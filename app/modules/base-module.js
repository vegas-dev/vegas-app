import {executeAfterTransition, isEmptyObj} from "../_utils/js/functions";
import Params from "../_utils/js/params";
import Data from "../_utils/js/data";
import Selectors from "../_utils/js/selectors";
import EventHandler from "../_utils/js/event";
import {Ajax, getSVG} from "../_utils/js/module-fn";

class BaseModule extends Params {
	constructor(element, params) {
		super();

		this._element = null;
		this._params = {};

		this.element = element;
		this.params = params;

		Data.set(this.element, this.constructor.NAME_KEY, this)
	}

	get element() {
		return this._element
	}

	set element(el) {
		this._element = Selectors.get(el);
	}

	get params() {
		return this._params
	}

	set params(params) {
		this._params = this._getParams(params, this.element);
	}

	static get NAME_KEY() {
		return ''
	}

	static get NAME() {
		return ''
	}

	static getInstance(element) {
		return Data.get(Selectors.get(element), this.NAME_KEY)
	}

	static getOrCreateInstance(element, params = {}) {
		return this.getInstance(element) || new this(element, isEmptyObj(params) ? params : null)
	}

	dispose() {
		Data.remove(this.element, this.constructor.NAME_KEY)

		for (const propertyName of Object.getOwnPropertyNames(this)) {
			this[propertyName] = null
		}
	}

	_route() {
		const _this = this;

		if (_this.params.hasOwnProperty('ajax')) {
			if ('target' in _this.params.ajax && _this.params.ajax.target) {
				let $content = Selectors.findOne(_this.params.ajax.target);
				if ($content) {
					if ('route' in _this.params.ajax && _this.params.ajax.route) {
						Ajax.get(_this.params.ajax.route, {}, function (status, data) {
							setData(data);
							EventHandler.trigger(_this.element, _this.NAME_KEY + '.loaded');
						});
					}
				}

				const setData = (data) => {
					$content.innerHTML = data;
				};
			}
		}
	}

	_dismissElement() {
		let cross = getSVG('cross'),
			button = this.element.querySelector('.vg-btn-close');

		if (button) {
			let svg = button.querySelector('svg');
			if (!svg) button.insertAdjacentHTML('beforeend', cross);
		}
	}

	_queueCallback(callback, element, isAnimated = true, timeOutMs) {
		executeAfterTransition(callback, element, isAnimated, timeOutMs);
	}
}

export default BaseModule;