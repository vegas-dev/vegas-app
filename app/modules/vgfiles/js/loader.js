import Ajax from "../../../utils/js/components/ajax";
import {normalizeData} from "../../../utils/js/functions";

class FileUploader {
	constructor(options = {}) {
		// Настройки
		this.mode = options.mode || 'sequential'; // 'sequential' или 'parallel'
		this.maxParallel = options.maxParallel || 3; // Максимум одновременных загрузок для parallel режима
		this.maxConcurrent = options.maxConcurrent || 1; // Для sequential режима
		this.retryAttempts = options.retryAttempts || 3;
		this.retryDelay = options.retryDelay || 1000;

		// Структуры данных
		this.uploads = new Map(); // Все активные загрузки
		this.completed = []; // Завершенные загрузки
		this.queue = []; // Очередь (только для sequential режима)

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
	}

	// Основной метод загрузки
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
			endTime: null
		};

		this.uploads.set(id, uploadData);

		if (this.mode === 'sequential') {
			return this.addToSequentialQueue(uploadData);
		} else {
			return this.startParallelUpload(uploadData);
		}
	}

	// Последовательная загрузка (с очередью)
	async addToSequentialQueue(uploadData) {
		return new Promise((resolve, reject) => {
			const task = {
				...uploadData,
				resolve,
				reject
			};

			this.queue.push(task);
			this.processSequentialQueue();

			return {
				id: uploadData.id,
				cancel: () => this.cancelUpload(uploadData.id)
			};
		});
	}

	async processSequentialQueue() {
		if (this.isPaused ||
			this.activeCount >= this.maxConcurrent ||
			this.queue.length === 0) {
			return;
		}

		const task = this.queue.shift();
		this.activeCount++;

		try {
			const result = await this.executeUpload(task);
			task.resolve(result);
		} catch (error) {
			task.reject(error);
		} finally {
			this.activeCount--;
			await this.processSequentialQueue();
		}
	}

	// Параллельная загрузка (без очереди)
	async startParallelUpload(uploadData) {
		if (this.activeCount >= this.maxParallel && this.mode === 'parallel') {
			// Ждем, пока освободится место
			await this.waitForSlot();
		}

		this.activeCount++;
		uploadData.startTime = Date.now();

		try {
			return await this.executeUpload(uploadData);
		} finally {
			this.activeCount--;
			// Уведомляем ожидающие загрузки
			this.notifyParallelWaiters();
		}
	}

	// Ожидание свободного слота для параллельной загрузки
	waitForSlot() {
		return new Promise(resolve => {
			const checkSlot = () => {
				if (this.activeCount < this.maxParallel) {
					resolve();
				} else {
					setTimeout(checkSlot, 100);
				}
			};
			checkSlot();
		});
	}

	notifyParallelWaiters() {
		// Можно добавить механизм уведомлений для ожидающих промисов
	}

	// Выполнение загрузки файла
	async executeUpload(uploadData, attempt = 1) {
		uploadData.status = 'uploading';
		uploadData.attempts = attempt;

		try {
			const result = await this.performUpload(uploadData);

			uploadData.status = 'completed';
			uploadData.progress = 100;
			uploadData.result = result;
			uploadData.endTime = Date.now();

			this.completed.push({ ...uploadData });
			/*this.notifyProgress(uploadData);*/
			this.notifyComplete(uploadData);

			this.checkAllComplete();

			return result;
		} catch (error) {
			uploadData.error = error;

			if (attempt < this.retryAttempts) {
				uploadData.status = 'retrying';
				this.notifyProgress(uploadData);

				await this.delay(this.retryDelay * attempt); // Экспоненциальная задержка
				return this.executeUpload(uploadData, attempt + 1);
			} else {
				uploadData.status = 'failed';
				uploadData.endTime = Date.now();

				this.notifyProgress(uploadData);
				this.notifyError(uploadData, error);
				this.checkAllComplete();

				throw error;
			}
		}
	}

	// Непосредственная загрузка через Fetch API
	async performUpload(uploadData) {
		const ajax = new Ajax();

		const formData = new FormData();
		formData.append('file', uploadData.file);
		formData.append('_token', ajax._getCsrfToken() || '')
		if (uploadData.options.additionalData) {
			Object.entries(uploadData.options.additionalData).forEach(([key, value]) => {
				formData.append(key, value);
			});
		}

		return new Promise((resolve, reject) => {
			ajax.post(uploadData.url, formData, {
				onProgress: (percent, event) => {
					uploadData.progress = percent;
					this.notifyProgress(uploadData);
				},
				onSuccess: (data) => {
					resolve(normalizeData(data));
				},
				onError: (err) => {
					reject(normalizeData(err));
				}
			});
		});
	}

	// Массовая загрузка файлов
	async uploadFiles(files, url, options = {}) {
		const results = [];

		if (this.mode === 'sequential') {
			// Последовательно
			for (const file of files) {
				try {
					const result = await this.uploadFile(file, url, options);
					results.push({ file: file.name, success: true, result });
				} catch (error) {
					results.push({ file: file.name, success: false, error });
				}
			}
		} else {
			// Параллельно
			const uploadPromises = files.map(file =>
				this.uploadFile(file, url, options)
					.then(result => ({ file: file.name, success: true, result }))
					.catch(error => ({ file: file.name, success: false, error }))
			);

			const allResults = await Promise.allSettled(uploadPromises);
			results.push(...allResults.map(r => r.value || r.reason));
		}

		return results;
	}

	// Отмена загрузки
	cancelUpload(id) {
		const uploadData = this.uploads.get(id);

		if (!uploadData) return false;

		if (uploadData.xhr) {
			uploadData.xhr.abort();
		}

		if (uploadData.controller) {
			uploadData.controller.abort();
		}

		uploadData.status = 'cancelled';
		uploadData.endTime = Date.now();

		this.notifyProgress(uploadData);

		// Удаляем из очереди, если есть
		const queueIndex = this.queue.findIndex(task => task.id === id);
		if (queueIndex > -1) {
			this.queue.splice(queueIndex, 1);
		}

		return true;
	}

	// Смена режима
	setMode(mode, maxParallel = 3) {
		this.mode = mode;
		this.maxParallel = maxParallel;

		if (mode === 'parallel') {
			// Очищаем очередь
			this.queue = [];
		}
	}

	// Пауза/возобновление
	pause() {
		this.isPaused = true;
	}

	resume() {
		this.isPaused = false;
		if (this.mode === 'sequential') {
			this.processSequentialQueue();
		}
	}

	// Очистка
	clear() {
		// Отменяем все активные загрузки
		this.uploads.forEach(upload => {
			if (upload.status === 'uploading' || upload.status === 'pending') {
				this.cancelUpload(upload.id);
			}
		});

		this.uploads.clear();
		this.queue = [];
		this.completed = [];
		this.activeCount = 0;
	}

	// Получение статистики
	getStats() {
		const allUploads = Array.from(this.uploads.values());

		return {
			total: allUploads.length,
			active: this.activeCount,
			pending: allUploads.filter(u => u.status === 'pending').length,
			uploading: allUploads.filter(u => u.status === 'uploading').length,
			completed: allUploads.filter(u => u.status === 'completed').length,
			failed: allUploads.filter(u => u.status === 'failed').length,
			cancelled: allUploads.filter(u => u.status === 'cancelled').length,
			mode: this.mode,
			isPaused: this.isPaused,
			queueLength: this.queue.length
		};
	}

	// Вспомогательные методы
	generateId() {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	checkAllComplete() {
		const allUploads = Array.from(this.uploads.values());
		const allDone = allUploads.every(u =>
			['completed', 'failed', 'cancelled'].includes(u.status)
		);

		if (allDone && allUploads.length > 0) {
			this.notifyAllComplete();
		}
	}

	// Коллбэки
	onProgress(callback) {
		this.callbacks.progress.push(callback);
	}

	onComplete(callback) {
		this.callbacks.complete.push(callback);
	}

	onError(callback) {
		this.callbacks.error.push(callback);
	}

	onAllComplete(callback) {
		this.callbacks.allComplete.push(callback);
	}

	// Уведомления
	notifyProgress(uploadData) {
		this.callbacks.progress.forEach(callback => {
			try {
				callback({
					...uploadData,
					stats: this.getStats()
				});
			} catch (error) {
				console.error('Progress callback error:', error);
			}
		});
	}

	notifyComplete(uploadData) {
		this.callbacks.complete.forEach(callback => {
			try {
				callback(uploadData);
			} catch (error) {
				console.error('Complete callback error:', error);
			}
		});
	}

	notifyError(uploadData, error) {
		this.callbacks.error.forEach(callback => {
			try {
				callback(uploadData, error);
			} catch (error) {
				console.error('Error callback error:', error);
			}
		});
	}

	notifyAllComplete() {
		this.callbacks.allComplete.forEach(callback => {
			try {
				callback({
					completed: this.completed,
					stats: this.getStats()
				});
			} catch (error) {
				console.error('All complete callback error:', error);
			}
		});
	}
}

export default FileUploader