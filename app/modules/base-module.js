import {executeAfterTransition, isEmptyObj} from "../_utils/js/functions";
import Params from "../_utils/js/params";
import Data from "../_utils/js/data";
import Selectors from "../_utils/js/selectors";

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

	_queueCallback(callback, element, isAnimated = true) {
		executeAfterTransition(callback, element, isAnimated)
	}
}

export default BaseModule;