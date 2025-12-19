import {execute, executeAfterTransition, isEmptyObj, isObject, normalizeData} from "../utils/js/functions";
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
		let $content = null,
			timeout = this._params.ajax.timeout || 0;

		if (this._isLoaded) return;

		const setData = (response) => {
			console.log(response)

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
		}, timeout);
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

	isMobileDevice() {
		const userAgent = navigator.userAgent;
		const isMobileUA = /Android|iPhone|iPad|iPod/i.test(userAgent);
		const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
		const isSmallScreen = window.innerWidth < 768;
		const isHighDPI = window.devicePixelRatio >= 2;

		function detectIPadPro() {
			const userAgent = navigator.userAgent;
			const platform = navigator.platform;

			const isIPad = /iPad/.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);

			if (!isIPad) return { isiPadPro: false };

			const screenWidth = window.screen.width * window.devicePixelRatio;
			const screenHeight = window.screen.height * window.devicePixelRatio;

			const proResolutions = [
				{ width: 2048, height: 2732 }, // 12.9"
				{ width: 1668, height: 2388 }, // 11"
				{ width: 1668, height: 2224 }  // 10.5"
			];

			const isProResolution = proResolutions.some(res =>
				(screenWidth === res.width && screenHeight === res.height) ||
				(screenWidth === res.height && screenHeight === res.width)
			);

			return {
				isiPadPro: isProResolution,
				screenWidth: screenWidth,
				screenHeight: screenHeight,
				userAgent: userAgent,
				platform: platform
			};
		}

		return isMobileUA || (isTouchDevice && isSmallScreen && isHighDPI) || detectIPadPro().isiPadPro;
	}

	static getInstance(element) {
		return Data.get(Selectors.find(element), this.NAME_KEY)
	}

	static getOrCreateInstance(element, params = {}) {
		return this.getInstance(element) || new this(element, !isEmptyObj(params) ? params : {})
	}

	static get DATA_KEY() {
		return `vg.${this.NAME}`
	}

	static get EVENT_KEY() {
		return `.${this.DATA_KEY}`
	}
}

export default BaseModule;