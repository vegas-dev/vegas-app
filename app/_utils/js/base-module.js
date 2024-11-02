import {isEmptyObj, Manipulator, mergeDeepObject} from "./manipulator";

class BaseModule {
	constructor() {
		this._element = null;
		this._params = {};
	}

	get element() {
		return this._element
	}

	set element(el) {
		this._element = Manipulator.find(el);
	}

	get params() {
		return this._params
	}

	set params(params) {
		if (!isEmptyObj(params)) {
			let attrs = Manipulator.getDataAttributes(this.element);
			this._params = mergeDeepObject(params, attrs);
		}
	}
}

export default BaseModule;
