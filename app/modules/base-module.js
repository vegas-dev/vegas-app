import {execute, executeAfterTransition, isEmptyObj} from "../_utils/js/functions";
import Params from "../_utils/js/params";
import Data from "../_utils/js/data";
import Selectors from "../_utils/js/selectors";
import EventHandler from "../_utils/js/event";
import {Ajax, getSVG} from "../_utils/js/module-fn";

class BaseModule extends Params {
	constructor(element, params) {
		super();

		this._element = element;
		this._params = this._getParams(params, element);

		Data.set(this._element, this.constructor.NAME_KEY, this)
	}

	static getInstance(element) {
		return Data.get(Selectors.find(element), this.NAME_KEY)
	}

	static getOrCreateInstance(element, params = {}) {
		return this.getInstance(element) || new this(element, !isEmptyObj(params) ? params : {})
	}

	dispose() {
		Data.remove(this.element, this.constructor.NAME_KEY)

		for (const propertyName of Object.getOwnPropertyNames(this)) {
			this[propertyName] = null
		}
	}

	_route(callback) {
		const _this = this;
		let $content = null;

		if (!_this.params.hasOwnProperty('ajax')) {
			return;
		}

		if (!'method' in _this.params.ajax) {
			_this.params.ajax.method = 'get';
		}

		if (!_this.params.ajax.method && !_this.params.ajax.route) {
			return;
		}

		if ('target' in _this.params.ajax && _this.params.ajax.target) {
			$content = Selectors.findOne(_this.params.ajax.target);
		}

		const setData = (data) => {
			if ($content) $content.innerHTML = data;
		};

		Ajax[_this.params.ajax.method](_this.params.ajax.route, _this.params.ajax.data || {}, function (status, data) {
			setData(data);
			execute(callback, [status, data]);
			EventHandler.trigger(_this.element, _this.NAME_KEY + '.loaded', [_this, status, data]);
		});
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