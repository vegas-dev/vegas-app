import {
	execute,
	executeAfterTransition,
	isEmptyObj,
	isObject,
	mergeDeepObject,
	normalizeData
} from "../utils/js/functions";
import Selectors from "../utils/js/dom/selectors";
import Data from "../utils/js/dom/data";
import Params from "../utils/js/components/params";
import EventHandler from "../utils/js/dom/event";
import {getSVG} from "./module-fn";
import Animation from "../utils/js/components/animation";
import Ajax from "../utils/js/components/ajax";
import Html from "../utils/js/components/templater";

class BaseModule {
	constructor(element) {
		if (!element) return

		this._element = Selectors.find(element);
		if (!this._element){
			throw new Error('Товарищ! Первый параметр не должен быть пустым!');
		}

		this._params = {};
		this._isLoaded = false;
		Data.set(this._element, this.constructor.NAME_KEY, this);
	}

	_getParams(element, params) {
		return new Params(params, element).get();
	}

	dispose() {
		Data.remove(this._element, this.constructor.NAME_KEY);
		EventHandler.off(this._element, this.constructor.EVENT_KEY)

		for (const propertyName of Object.getOwnPropertyNames(this)) {
			this[propertyName] = null
		}
	}

	/**
	 * Метод для отправки данных на сервер
	 * данные для работы должны быть в this._params.ajax
	 * - route = ссылка для отправки данных, обязательное поле
	 * - method = по умолчанию get
	 * - target = элемент (#container-request), куда будут выгружен ответ сервер, тип строка
	 * - loader = спиннер загрузки использует класс vg-loader (в дефолтных стилях), по умолчанию false
	 * - once = сделает всего один запрос (например: при открытии модалки несколько раз), по умолчанию false
	 * - output = Разрешает или запрещает добавление контента с сервера в целевой блок, по умолчанию false
	 * - timeout = задержка перед отправкой, по умолчанию 0
	 * @param callback
	 */
	_route(callback) {
		if (typeof callback !== 'function') {
			return this._requestRoute(callback);
		}

		let $content = null,
			timeout = this._params.ajax.timeout || 0;

		if (this._isLoaded) return;

		const setData = (response) => {
			if (typeof response === "string") {
				if ($content) $content.innerHTML = response;
			} else if (isObject(response) && !isEmptyObj(response)) {
				Object.values(response).forEach(value => {
					if (typeof value === "string") {
						if ($content) $content.innerHTML = value;
					}
				});
			}
		};

		if (!this._params.hasOwnProperty('ajax')) {
			return;
		}

		if (!this._params.ajax.route) {
			return;
		}

		if (!'method' in this._params.ajax) {
			this._params.ajax.method = 'get';
		}

		if ('target' in this._params.ajax && this._params.ajax.target) {
			$content = Selectors.find(this._params.ajax.target);
		}

		if (('loader' in this._params.ajax && this._params.ajax.loader) && ('output' in this._params.ajax && this._params.ajax.output)) {
			setData(Html('string').div({class: 'vg-loader'}));
		}

		let completeAjaxRequest = (data, status) => {
			if ('loader' in this._params.ajax && this._params.ajax.loader) setData('');

			if ('once' in this._params.ajax && this._params.ajax.once) {
				this._isLoaded = true;
			}

			if ('output' in this._params.ajax && this._params.ajax.output) {
				if ('response' in data) {
					setData(normalizeData(data.response))
				} else {
					setData(data);
				}
			}

			execute(callback, [status, data, $content]);
		}

		const ajax = new Ajax();

		let ajaxData = {
			onSuccess: (data) => {
				completeAjaxRequest(data, 'success')
			},
			onError: (err) => {
				completeAjaxRequest(err, 'error')
			}
		}

		setTimeout(() => {
			if (this._params.ajax.method.toLowerCase() === 'get') {
				ajax.get(this._params.ajax.route, ajaxData);
			}

			if (this._params.ajax.method.toLowerCase() === 'post') {
				ajax.post(this._params.ajax.route, this._params.ajax.data, ajaxData);
			}

			if (this._params.ajax.method.toLowerCase() === 'delete') {
				ajax.delete(this._params.ajax.route, ajaxData);
			}
		}, timeout);
	}

	_requestRoute(options = {}) {
		const config = this._normalizeRouteRequestOptions(options);
		return Ajax.requestRoute(config);
	}

	_buildRouteUrl(params = {}, endpoint = '', options = {}) {
		const config = this._normalizeRouteRequestOptions(Object.assign({}, options, {
			params,
			route: endpoint || options.route || '',
		}));
		return Ajax.buildRouteUrl(config.route, {
			params: config.params,
			baseParams: config.baseParams,
		});
	}

	_normalizeRouteRequestOptions(options = {}) {
		const requestOptions = this._params && isObject(this._params.request)
			? this._params.request
			: {};
		const ajaxOptions = this._params && isObject(this._params.ajax)
			? this._params.ajax
			: {};
		const source = isObject(options) ? options : {};
		const route = String(
			source.route
			|| source.endpoint
			|| requestOptions.route
			|| ajaxOptions.route
			|| ''
		).trim();
		const method = String(
			source.method
			|| requestOptions.method
			|| ajaxOptions.method
			|| 'GET'
		).toUpperCase().trim() || 'GET';
		const credentials = String(
			source.credentials
			|| requestOptions.credentials
			|| 'same-origin'
		).trim() || 'same-origin';
		const headers = mergeDeepObject(
			{
				'Accept': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			isObject(requestOptions.headers) ? requestOptions.headers : {},
			isObject(source.headers) ? source.headers : {}
		);
		const baseParams = mergeDeepObject(
			{},
			isObject(requestOptions.params) ? requestOptions.params : {},
			isObject(source.baseParams) ? source.baseParams : {},
			isObject(source.paramsBase) ? source.paramsBase : {}
		);
		const params = isObject(source.params) ? source.params : {};
		const body = source.body !== undefined
			? source.body
			: (source.data !== undefined ? source.data : null);
		return {
			route,
			method,
			credentials,
			headers,
			baseParams,
			params,
			body,
			signal: source.signal || null,
			responseType: String(source.responseType || source.parse || 'auto').toLowerCase().trim() || 'auto',
		};
	}

	_dismissElement() {
		let cross = getSVG('cross'),
			button = this._element.querySelector('.vg-btn-close');

		if (button) {
			let svg = button.querySelector('svg');
			if (!svg) button.insertAdjacentHTML('beforeend', cross);
		}
	}

	_queueCallback(callback, element, isAnimated = true, timeOutMs) {
		executeAfterTransition(callback, element, isAnimated, timeOutMs);
	}

	_animation(element, key, params = {}) {
		new Animation(element, key, params);
	}

	static getInstance(element) {
		return Data.get(Selectors.find(element), this.NAME_KEY)
	}

	static getOrCreateInstance(element, params = {}) {
		return this.getInstance(element) || new this(element, !isEmptyObj(params) ? params : {})
	}

	static boot(params = {}) {
		if (typeof this.initAll === 'function') {
			return this.initAll(params);
		}

		if (typeof this.init !== 'function') {
			return null;
		}

		if (params && Object.prototype.hasOwnProperty.call(params, 'element')) {
			const { element, ...options } = params;
			return this.init(element, options);
		}

		return null;
	}

	static get DATA_KEY() {
		return `vg.${this.NAME}`
	}

	static get EVENT_KEY() {
		return `.${this.DATA_KEY}`
	}
}

export default BaseModule;
