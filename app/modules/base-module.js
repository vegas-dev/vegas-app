import {execute, executeAfterTransition, isEmptyObj} from "../utils/js/functions";
import Selectors from "../utils/js/dom/selectors";
import Data from "../utils/js/dom/data";
import Params from "../utils/js/components/params";
import EventHandler from "../utils/js/dom/event";
import {Ajax, getSVG} from "./module-fn";
import Animation from "../utils/js/components/animation";

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

	_route(callback) {
		const _this = this;
		let $content = null;

		if (_this._isLoaded) return;

		const setData = (data) => {
			if ($content) $content.innerHTML = data;
		};

		if (!_this._params.hasOwnProperty('ajax')) {
			return;
		}

		if (!_this._params.ajax.route) {
			return;
		}

		if (!'method' in _this._params.ajax) {
			_this._params.ajax.method = 'get';
		}

		if ('target' in _this._params.ajax && _this._params.ajax.target) {
			$content = Selectors.find(_this._params.ajax.target);
		}

		if ('loader' in _this._params.ajax && _this._params.ajax.loader) {
			if ('output' in _this._params.ajax && _this._params.ajax.output) {
				setData('<div class="vg-loader"></div>');
			}
		}

		Ajax[_this._params.ajax.method](_this._params.ajax.route, _this._params.ajax.data || {}, function (status, data) {
			if ('once' in _this._params.ajax && _this._params.ajax.once) {
				_this._isLoaded = true;
			}

			if ('output' in _this._params.ajax && _this._params.ajax.output) {
				setData(data.response);
			}

			execute(callback, [status, data, $content]);
		});
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

	static get DATA_KEY() {
		return `vg.${this.NAME}`
	}

	static get EVENT_KEY() {
		return `.${this.DATA_KEY}`
	}
}

export default BaseModule;