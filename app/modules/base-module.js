import {Manipulator} from "../_utils/js/manipulator";
import {isEmptyObj, isObject} from "../_utils/js/functions";
import Params from "../_utils/js/params";
import Data from "../_utils/js/data";
import Selectors from "../_utils/js/selectors";

const CROSS_CLOSE = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
	'\t viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">' +
	'<path d="M89.7,10.3L89.7,10.3c-1-1-2.6-1-3.5,0L50,46.5L13.9,10.3c-1-1-2.6-1-3.5,0l0,0c-1,1-1,2.6,0,3.5L46.5,50L10.3,86.1' +
	'\tc-1,1-1,2.6,0,3.5h0c1,1,2.6,1,3.5,0L50,53.5l36.1,36.1c1,1,2.6,1,3.5,0l0,0c1-1,1-2.6,0-3.5L53.5,50l36.1-36.1' +
	'\tC90.6,12.9,90.6,11.3,89.7,10.3z"/>' +
	'</svg>';

class BaseModule extends Params{
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
		return Data.get(Manipulator.find(element), this.NAME_KEY)
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

	_backdrop() {
		let _this = this,
			backdrop = document.querySelector('.vg-sidebar-backdrop');

		if (!_this.params.backdrop) return;

		if (backdrop) {
			backdrop.remove();
		} else {
			backdrop = document.createElement('div');
			backdrop.classList.add('vg-sidebar-backdrop');

			document.body.append(backdrop);

			setTimeout(() => {
				backdrop.classList.add('fade')
			}, 50)
		}
	}

	_overflow(isShown) {
		const _this = this;

		if (!_this.params.overflow) {
			return;
		}

		if (!isShown) {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		} else {
			document.body.style.paddingRight = getWidth() + 'px';
			document.body.style.overflow = 'hidden';
		}

		function getWidth() {
			const documentWidth = document.documentElement.clientWidth
			return Math.abs(window.innerWidth - documentWidth)
		}
	}
}

export default BaseModule;