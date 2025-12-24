import Ajax from "../../../utils/js/components/ajax";
import { normalizeData } from "../../../utils/js/functions";

class FileUploader {
	constructor(options = {}) {
		// Настройки
		this.mode = options.mode || 'sequential';
		this.maxParallel = options.maxParallel || 3;
		this.maxConcurrent = options.maxConcurrent || 1; // для sequential
		this.retryAttempts = options.retryAttempts || 3;
		this.retryDelay = options.retryDelay || 1000;

		// Состояние загрузок
		this.uploads = new Map(); // id → uploadData
		this.completed = [];
		this.queue = []; // очередь для sequential
		this.waitingPromises = []; // для parallel: промисы, ожидающие слот

		// Состояние
		this.activeCount = 0;
		this.isPaused = false;

		// Коллбэки
		this.callbacks = {
			progress: [],
			complete: [],
			error: [],
			allComplete: []
		};

		this._checkAllCompleteBound = this.checkAllComplete.bind(this);
	}

	// === ОСНОВНЫЕ МЕТОДЫ ===

	/**
	 * Загрузка одного файла
	 */
	async uploadFile(file, url, options = {}) {
		const id = this.generateId();
		const uploadData = {
			id,
			file,
			url,
			options,
			status: 'pending',
			progress: 0,
			attempts: 0,
			result: null,
			error: null,
			startTime: null,
			endTime: null,
			controller: new AbortController(), // для отмены
			signal: null // будет установлен при старте
		};

		this.uploads.set(id, uploadData);

		if (this.mode === 'sequential') {
			return this._addToSequentialQueue(uploadData);
		} else {
			return this._startParallelUpload(uploadData);
		}
	}

	/**
	 * Массовая загрузка файлов
	 */
	async uploadFiles(files, url, options = {}) {
		const promises = files.map(file => this.uploadFile(file, url, options));
		const results = await Promise.allSettled(promises);

		return results.map(result => {
			if (result.status === 'fulfilled') {
				return { file: result.value.file?.name, success: true, result: result.value };
			} else {
				return { file: result.reason?.file?.name || 'unknown', success: false, error: result.reason };
			}
		});
	}

	// === РЕЖИМЫ ЗАГРУЗКИ ===

	_addToSequentialQueue(uploadData) {
		return new Promise((resolve, reject) => {
			this.queue.push({ uploadData, resolve, reject });
			this._processSequentialQueue();
		});
	}

	async _processSequentialQueue() {
		if (
			this.isPaused ||
			this.activeCount >= this.maxConcurrent ||
			this.queue.length === 0
		) {
			return;
		}

		const { uploadData, resolve, reject } = this.queue[0]; // не удаляем, пока не начнём
		this.activeCount++;

		try {
			const result = await this._executeUpload(uploadData);
			resolve(result);
		} catch (error) {
			reject(error);
		} finally {
			this.queue.shift(); // удаляем только после завершения
			this.activeCount--;
			await this._processSequentialQueue();
		}
	}

	async _startParallelUpload(uploadData) {
		// Ждём свободный слот
		if (this.activeCount >= this.maxParallel) {
			await new Promise(resolve => this.waitingPromises.push(resolve));
		}

		this.activeCount++;
		uploadData.startTime = Date.now();

		try {
			return await this._executeUpload(uploadData);
		} finally {
			this.activeCount--;
			this._notifyWaiting(); // освободили слот
		}
	}

	_notifyWaiting() {
		if (this.waitingPromises.length > 0 && this.activeCount < this.maxParallel) {
			const resolve = this.waitingPromises.shift();
			resolve();
		}
	}

	// === ВЫПОЛНЕНИЕ ЗАГРУЗКИ ===

	async _executeUpload(uploadData, attempt = 1) {
		uploadData.status = 'uploading';
		uploadData.attempts = attempt;
		uploadData.signal = uploadData.controller.signal;

		try {
			const result = await this._performUpload(uploadData);
			this._completeUpload(uploadData, result);
			return result;
		} catch (error) {
			if (uploadData.status === 'cancelled') return;

			uploadData.error = error;

			if (attempt < this.retryAttempts) {
				uploadData.status = 'retrying';
				this.notifyProgress(uploadData);
				await this._delay(this.retryDelay * Math.pow(2, attempt)); // экспоненциальная задержка
				return this._executeUpload(uploadData, attempt + 1);
			} else {
				uploadData.status = 'failed';
				uploadData.endTime = Date.now();
				this.notifyProgress(uploadData);
				this.notifyError(uploadData, error);
				this._checkAllCompleteBound();
				throw error;
			}
		}
	}

	_performUpload(uploadData) {
		return new Promise((resolve, reject) => {
			const ajax = new Ajax();
			const formData = new FormData();

			formData.append('file', uploadData.file);
			formData.append('_token', ajax._getCsrfToken() || '');

			if (uploadData.options.additionalData) {
				Object.entries(uploadData.options.additionalData).forEach(([key, value]) => {
					formData.append(key, value);
				});
			}

			// Передаём AbortController.signal
			const config = {
				onProgress: (percent, event) => {
					uploadData.progress = percent;
					this.notifyProgress(uploadData);
				},
				onSuccess: (data) => {
					resolve(normalizeData(data));
				},
				onError: (err) => {
					reject(normalizeData(err));
				},
				signal: uploadData.signal
			};

			// Предполагаем, что ajax.post поддерживает signal
			const xhr = ajax.post(uploadData.url, formData, config);
			uploadData.xhr = xhr; // для отмены
		});
	}

	_completeUpload(uploadData, result) {
		uploadData.status = 'completed';
		uploadData.progress = 100;
		uploadData.result = result;
		uploadData.endTime = Date.now();

		this.completed.push({ ...uploadData });
		this.notifyComplete(uploadData);
		this._checkAllCompleteBound();
	}

	// === УПРАВЛЕНИЕ ===

	cancelUpload(id) {
		const uploadData = this.uploads.get(id);
		if (!uploadData || ['completed', 'failed', 'cancelled'].includes(uploadData.status)) {
			return false;
		}

		// Отмена
		uploadData.controller.abort();
		if (uploadData.xhr && typeof uploadData.xhr.abort === 'function') {
			uploadData.xhr.abort();
		}

		uploadData.status = 'cancelled';
		uploadData.endTime = Date.now();
		this.notifyProgress(uploadData);

		// Удаление из очереди
		const queueIndex = this.queue.findIndex(task => task.uploadData.id === id);
		if (queueIndex > -1) {
			this.queue.splice(queueIndex, 1);
		}

		return true;
	}

	setMode(mode, maxParallel = 3) {
		this.mode = mode;
		this.maxParallel = maxParallel;

		if (mode === 'parallel') {
			this.queue = [];
			this._notifyWaiting(); // разблокировать ожидающие промисы
		}
	}

	pause() {
		this.isPaused = true;
	}

	resume() {
		this.isPaused = false;
		if (this.mode === 'sequential') {
			this._processSequentialQueue();
		} else {
			this._notifyWaiting(); // может быть, кто-то ждёт
		}
	}

	clear() {
		this.uploads.forEach((_, id) => {
			this.cancelUpload(id);
		});

		this.uploads.clear();
		this.completed = [];
		this.queue = [];
		this.waitingPromises = [];
		this.activeCount = 0;
	}

	// === СТАТИСТИКА И ВСПОМОГАТЕЛЬНЫЕ ===

	getStats() {
		const all = Array.from(this.uploads.values());
		return {
			total: all.length,
			active: this.activeCount,
			pending: all.filter(u => u.status === 'pending').length,
			uploading: all.filter(u => u.status === 'uploading').length,
			completed: all.filter(u => u.status === 'completed').length,
			failed: all.filter(u => u.status === 'failed').length,
			cancelled: all.filter(u => u.status === 'cancelled').length,
			mode: this.mode,
			isPaused: this.isPaused,
			queueLength: this.queue.length
		};
	}

	generateId() {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	_delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	checkAllComplete() {
		const allDone = Array.from(this.uploads.values()).every(u =>
			['completed', 'failed', 'cancelled'].includes(u.status)
		);

		if (allDone && this.uploads.size > 0) {
			this.notifyAllComplete();
		}
	}

	// === КОЛЛБЭКИ ===

	onProgress(callback) { this.callbacks.progress.push(callback); }
	onComplete(callback) { this.callbacks.complete.push(callback); }
	onError(callback) { this.callbacks.error.push(callback); }
	onAllComplete(callback) { this.callbacks.allComplete.push(callback); }

	notifyProgress(uploadData) {
		this.callbacks.progress.forEach(cb => this._safeCall(cb, { ...uploadData, stats: this.getStats() }));
	}

	notifyComplete(uploadData) {
		this.callbacks.complete.forEach(cb => this._safeCall(cb, uploadData));
	}

	notifyError(uploadData, error) {
		this.callbacks.error.forEach(cb => this._safeCall(cb, uploadData, error));
	}

	notifyAllComplete() {
		this.callbacks.allComplete.forEach(cb => this._safeCall(cb, { completed: this.completed, stats: this.getStats() }));
	}

	_safeCall(callback, ...args) {
		try {
			callback(...args);
		} catch (error) {
			console.error('Callback error:', error);
		}
	}
}

export default FileUploader;