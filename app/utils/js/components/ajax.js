import { isObject, noop, normalizeData } from "../functions";

class Ajax {
	static _toRouteQueryParamValue(value) {
		if (!Array.isArray(value)) {
			return value;
		}

		return value
			.map((item) => String(item || '').trim())
			.filter((item) => item !== '')
			.join(',');
	}

	static buildRouteUrl(route, options = {}) {
		const target = String(route || '').trim();
		if (!target) {
			throw new Error('Request endpoint is empty');
		}

		const baseParams = isObject(options.baseParams) ? options.baseParams : {};
		const params = isObject(options.params) ? options.params : {};
		const url = new URL(target, window.location.origin);
		const merged = { ...baseParams, ...params };

		Object.keys(merged).forEach((key) => {
			const value = this._toRouteQueryParamValue(merged[key]);
			if (value === undefined || value === null || value === '') {
				return;
			}

			url.searchParams.set(key, String(value));
		});

		return url;
	}

	static async requestRoute(options = {}) {
		const method = String(options.method || 'GET').toUpperCase().trim() || 'GET';
		const headers = isObject(options.headers) ? { ...options.headers } : {};
		const credentials = String(options.credentials || 'same-origin').trim() || 'same-origin';
		const baseParams = isObject(options.baseParams) ? options.baseParams : {};
		const params = isObject(options.params) ? options.params : {};
		const hasBody = options.body !== undefined && options.body !== null;
		const isGetLike = method === 'GET' || method === 'HEAD';
		const route = String(options.route || options.endpoint || '').trim();
		const url = this.buildRouteUrl(route, {
			baseParams,
			params: isGetLike ? params : {},
		});
		const requestOptions = {
			method,
			credentials,
			headers,
			signal: options.signal || undefined,
		};

		if (!isGetLike && hasBody) {
			const body = options.body;
			const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

			if (isFormData) {
				delete requestOptions.headers['Content-Type'];
				requestOptions.body = body;
			} else if (typeof body === 'string') {
				if (!requestOptions.headers['Content-Type']) {
					requestOptions.headers['Content-Type'] = 'application/json';
				}
				requestOptions.body = body;
			} else {
				if (!requestOptions.headers['Content-Type']) {
					requestOptions.headers['Content-Type'] = 'application/json';
				}
				requestOptions.body = JSON.stringify(body);
			}
		}

		const response = await fetch(url.toString(), requestOptions);
		const contentType = String(response.headers.get('content-type') || '').toLowerCase();
		const expectsJson = options.responseType === 'json'
			|| (options.responseType !== 'text' && contentType.includes('application/json'));
		const payload = await (async () => {
			if (expectsJson) {
				try {
					return await response.json();
				} catch (error) {
					return await response.text();
				}
			}

			return response.text();
		})();

		if (!response.ok) {
			const apiError = payload && typeof payload === 'object' && payload.error && typeof payload.error === 'object'
				? payload.error
				: {};
			const fallbackMessage = typeof payload === 'string' && payload.trim()
				? payload
				: response.statusText;
			const message = String(apiError.message || fallbackMessage || 'Request failed');
			const error = new Error(message);
			error.status = response.status;
			error.code = apiError.code || 'REQUEST_FAILED';
			error.details = Array.isArray(apiError.details) ? apiError.details : [];
			error.requestId = apiError.request_id || response.headers.get('X-Request-Id') || '';
			error.response = payload;
			throw error;
		}

		return payload;
	}

	/**
	 * Конфигурация запроса
	 * @param {Object} options
	 * @param {string} options.baseUrl - Базовый URL API (опционально)
	 * @param {Object} options.headers - Доп. заголовки (например, авторизация)
	 * @param {boolean} options.withCredentials - Отправлять ли куки (для авторизованных запросов)
	 * @param {string} options._token - Токен (авто-чтение из meta)
	 */
	constructor(options = {}) {
		this.baseUrl = options.baseUrl || "";
		this.defaultHeaders = {
			"X-Requested-With": "XMLHttpRequest",
			...options.headers,
		};
		this.withCredentials = options.withCredentials || false;
		this.csrfToken = options._token || this._getCsrfToken();
	}

	/**
	 * Получение CSRF-токена из тега meta
	 * @returns {string}
	 */
	_getCsrfToken() {
		const meta = document.querySelector('meta[name="csrf-token"]');
		if (meta) return meta.getAttribute("content");
		console.warn('CSRF-токен не найден в <meta name="csrf-token">');
		return "";
	}

	/**
	 * Универсальный метод отправки запроса
	 * @param {string} url
	 * @param {Object} options
	 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} options.method
	 * @param {Object|FormData} options.body
	 * @param {Object} options.headers
	 * @param {AbortSignal} [options.signal] - Для отмены запроса
	 * @param {Function} [options.onProgress] - Только для POST/PUT с FormData
	 * @param {Function} options.onSuccess
	 * @param {Function} options.onError
	 * @param {Function} [options.onUploadStart]
	 * @param {Function} [options.onUploadEnd]
	 */
	request(url, {
		method = "GET",
		body = null,
		headers = {},
		signal = null,
		onProgress = null,
		onSuccess = noop,
		onError = noop,
		onUploadStart = noop,
		onUploadEnd = noop,
	} = {}) {
		const fullUrl = this.baseUrl + url;
		const isFormData = body instanceof FormData;
		const requestHeaders = { ...this.defaultHeaders, ...headers };
		const isGet = method.toUpperCase() === "GET";

		// Удаление тела для GET
		if (isGet) body = null;

		// Установка CSRF токена: в body, если не FormData
		if (!isGet && !isFormData && this.csrfToken) {
			if (!body) body = {};
			if (typeof body === "object" && !Array.isArray(body)) {
				body._token = this.csrfToken;
			}
		}

		// Content-Type только для JSON
		if (!isFormData && !("Content-Type" in headers)) {
			requestHeaders["Content-Type"] = "application/json";
		}

		// Если нужно отслеживать прогресс или FormData — используем XHR
		if (isFormData || onProgress) {
			return this._makeXHR({
				method,
				url: fullUrl,
				body,
				headers: requestHeaders,
				signal,
				onProgress,
				onSuccess,
				onError,
				onUploadStart,
				onUploadEnd,
			});
		} else {
			return this._makeFetch({
				url: fullUrl,
				method,
				body: isGet ? undefined : this._serializeBody(body),
				headers: requestHeaders,
				signal,
				withCredentials: this.withCredentials,
				onSuccess,
				onError,
			});
		}
	}

	/**
	 * fetch-реализация (для JSON)
	 */
	_makeFetch({
		           url,
		           method,
		           body,
		           headers,
		           signal,
		           withCredentials,
		           onSuccess,
		           onError,
	           }) {
		const config = {
			method,
			headers,
			signal,
			credentials: withCredentials ? 'include' : 'same-origin',
			...(body !== undefined && { body }),
		};

		fetch(url, config)
			.then((response) => {
				const contentType = response.headers.get("content-type");
				const isJson = contentType && contentType.includes("application/json");

				if (!response.ok) {
					return Promise.reject(
						normalizeData({
							code: response.status,
							response: isJson
								? response.json().catch(() => response.text())
								: response.text(),
						})
					);
				}

				let data = { code: response.status };
				if (isJson) {
					data.response = response.json();
				} else {
					data.response = response.text();
				}

				return data;
			})
			.then((data) => {
				if (data && data.response instanceof Promise) {
					data.response.then(
						(resolved) => onSuccess({ ...data, response: resolved }),
						() => {}
					);
				} else {
					onSuccess(data);
				}
			})
			.catch((error) => {
				if (error.name === "AbortError") return; // отмена — не ошибка

				if (error && error.response instanceof Promise) {
					error.response.then((errData) => {
						onError({ ...error, response: errData });
					}, () => {
						onError({ ...error, response: "Request failed" });
					});
				} else {
					onError(error);
				}
			});
	}

	/**
	 * XHR-реализация (с прогрессом и AbortController)
	 */
	_makeXHR({
		         method,
		         url,
		         body,
		         headers,
		         signal,
		         onProgress,
		         onSuccess,
		         onError,
		         onUploadStart,
		         onUploadEnd,
	         }) {
		const xhr = new XMLHttpRequest();

		xhr.open(method, url, true);
		xhr.withCredentials = this.withCredentials;

		// Установка заголовков
		Object.keys(headers).forEach((key) => {
			if (key.toLowerCase() !== "content-type" || !(body instanceof FormData)) {
				xhr.setRequestHeader(key, headers[key]);
			}
		});

		// Прогресс
		if (onProgress) {
			xhr.upload.addEventListener("progress", (e) => {
				if (e.lengthComputable) {
					onProgress(Math.round((e.loaded / e.total) * 100), e);
				}
			});
		}

		// События
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				const data = {
					code: xhr.status,
					response: normalizeData(xhr.responseText),
				};
				onSuccess(data);
			} else {
				const error = normalizeData({
					code: xhr.status,
					response: xhr.responseText || `HTTP ${xhr.status}`,
				});
				onError(error);
			}
			onUploadEnd();
		};

		xhr.onerror = () => {
			onError(normalizeData({ code: 0, response: "Network Error" }));
			onUploadEnd();
		};

		xhr.ontimeout = () => {
			onError(normalizeData({ code: 0, response: "Request Timeout" }));
			onUploadEnd();
		};

		// Привязка AbortController
		if (signal) {
			signal.addEventListener("abort", () => {
				xhr.abort();
			});
		}

		onUploadStart();
		xhr.send(body);

		return xhr; // для отмены снаружи
	}

	// === Сокращённые методы ===

	get(url, options = {}) {
		return this.request(url, { method: "GET", ...options });
	}

	post(url, body, options = {}) {
		return this.request(url, { method: "POST", body, ...options });
	}

	put(url, body, options = {}) {
		return this.request(url, { method: "PUT", body, ...options });
	}

	delete(url, options = {}) {
		return this.request(url, { method: "DELETE", ...options });
	}

	patch(url, body, options = {}) {
		return this.request(url, { method: "PATCH", body, ...options });
	}

	/**
	 * Сериализация тела (если не FormData)
	 */
	_serializeBody(body) {
		if (!body || body instanceof FormData) return undefined;
		return JSON.stringify(body);
	}
}

export default Ajax;
