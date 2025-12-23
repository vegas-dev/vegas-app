import {mergeDeepObject, noop, normalizeData} from "../functions";

class Ajax {
	/**
	 * Конфигурация запроса
	 * @param {Object} options
	 * @param {string} options.baseUrl - Базовый URL API (опционально)
	 * @param {Object} options.headers - Доп. заголовки (например, авторизация)
	 * @param {boolean} options.withCredentials - Отправлять ли куки (для авторизованных запросов)
	 * @param {string} options._token - Токен (авто-чтение из meta)
	 */
	constructor(options = {}) {
		this.baseUrl = options.baseUrl || '';
		this.defaultHeaders = {
			'X-Requested-With': 'XMLHttpRequest',
			...options.headers
		};
		this.withCredentials = options.withCredentials || false;
		this.csrfToken = options._token || this._getCsrfToken();
	}

	/**
	 * Получение csrf токена из тега meta
	 * @returns {string}
	 */
	_getCsrfToken() {
		const meta = document.querySelector('meta[name="csrf-token"]');
		if (meta) return meta.getAttribute('content');
		console.warn('CSRF-токен не найден в <meta name="csrf-token">');
		return '';
	}

	/**
	 * Универсальный метод отправки запроса
	 * @param {string} url
	 * @param {Object} options
	 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} options.method
	 * @param {Object|FormData} options.body - Данные (обычный объект или FormData)
	 * @param {Object} options.headers - Дополнительные заголовки
	 * @param {Function} options.onProgress - Колбэк прогресса (только для POST/PUT)
	 * @param {Function} options.onSuccess
	 * @param {Function} options.onError
	 * @param {Function} options.onUploadStart
	 * @param {Function} options.onUploadEnd
	 */
	request(url, {
		method = 'GET',
		body = null,
		headers = {},
		onProgress = null,
		onSuccess = (data) => noop(),
		onError = (error) => noop(),
		onUploadStart = () => {},
		onUploadEnd = () => {}
	} = {}) {
		const fullUrl = this.baseUrl + url;
		const isFormData = body instanceof FormData;
		const requestHeaders = { ...this.defaultHeaders, ...headers };
		const token = {};

		if (!isFormData && this.csrfToken) {
			token.body = JSON.stringify({
				_token: this.csrfToken
			})
		}

		// Для JSON устанавливаем заголовок, для FormData — НЕЛЬЗЯ
		if (!isFormData && !('Content-Type' in headers)) {
			requestHeaders['Content-Type'] = 'application/json';
		}

		// Если это GET-запрос — тело игнорируется
		if (method.toUpperCase() === 'GET') {
			return this._makeFetch(fullUrl, {
				method,
				headers: requestHeaders,
				withCredentials: this.withCredentials
			}, onSuccess, onError);
		}

		// Для FormData — используем XMLHttpRequest, чтобы отслеживать прогресс
		if (isFormData || onProgress) {
			return this._makeXHR({
				method,
				url: fullUrl,
				body,
				headers: requestHeaders,
				onProgress,
				onSuccess,
				onError,
				onUploadStart,
				onUploadEnd
			});
		}

		// Остальные случаи — fetch
		return this._makeFetch(fullUrl, mergeDeepObject({
			method,
			headers: requestHeaders,
			withCredentials: this.withCredentials
		}, token), onSuccess, onError);
	}

	/**
	 * Использование fetch (для JSON)
	 */
	_makeFetch(url, config, onSuccess, onError) {
		return fetch(url, config)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					return {
						code: response.status,
						response: response.json()
					};
				}

				return {
					code: response.status,
					response: response.text()
				};
			})
			.then(data => {
				if ('response' in data) {
					if (data.response instanceof Promise) {
						data.response.then(text => {
							onSuccess({
								code: data.code,
								response: text
							})
						})
					} else {
						onSuccess(data)
					}
				} else {
					onSuccess(data)
				}
			})
			.catch(error => onError(error));
	}

	/**
	 * Использование XHR (для FormData и прогресса)
	 */
	_makeXHR({
		         method,
		         url,
		         body,
		         headers,
		         onProgress,
		         onSuccess,
		         onError,
		         onUploadStart,
		         onUploadEnd
	         }) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method, url, true);
			xhr.withCredentials = this.withCredentials;

			// Устанавливаем только пользовательские заголовки (кроме Content-Type для FormData)
			Object.keys(headers).forEach(key => {
				if (key.toLowerCase() !== 'content-type' || !(body instanceof FormData)) {
					xhr.setRequestHeader(key, headers[key]);
				}
			});

			// Отслеживание прогресса загрузки
			if (onProgress) {
				xhr.upload.addEventListener('progress', (e) => {
					if (e.lengthComputable) {
						const percent = (e.loaded / e.total) * 100;
						onProgress(percent, e);
					}
				});
			}

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					let data = {
						code: xhr.status,
						response: normalizeData(xhr.responseText)
					};
					onSuccess(data);
					resolve(data);
				} else {
					const error = new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`);
					let data = {
						code: xhr.status,
						response: error
					}
					onError(data);
					reject(data);
				}
				onUploadEnd();
			};

			xhr.onerror = () => {
				const error = new Error('Network Error');
				onError(error);
				reject(error);
				onUploadEnd();
			};

			onUploadStart();
			xhr.send(body);
		});
	}

	// === Сокращённые методы ===
	get(url, options = {}) {
		return this.request(url, { method: 'GET', ...options });
	}

	post(url, body, options = {}) {
		return this.request(url, { method: 'POST', body, ...options });
	}

	put(url, body, options = {}) {
		return this.request(url, { method: 'PUT', body, ...options });
	}

	delete(url, options = {}) {
		return this.request(url, { method: 'DELETE', ...options });
	}

	patch(url, body, options = {}) {
		return this.request(url, { method: 'PATCH', body, ...options });
	}
}

export default Ajax;