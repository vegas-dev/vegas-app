import {isElement, isEmptyObj, isObject, mergeDeepObject, normalizeData} from "./functions";
import {Manipulator} from "./manipulator";

/**
 * Класс Params, собирает все "параметры" для работы модулей, являясь для них отправной точкой
 */

class Params {
	static get NAME() {
		return ''
	}

	static get NAME_FULL() {
		return '';
	}

	static get NAME_KEY() {
		return ''
	}

	static get Default() {
		return {}
	}

	_getParams(params, element) {
		return this._mergeParams(params, element)
	}

	_mergeParams(params, element) {
		let elementParams = this._getElementParams(element),
			defaultParams = this.constructor.Default;

		Object.keys(elementParams).forEach(key => {
			if (key === this.constructor.NAME_FULL) {
				delete elementParams[key];
			}
		});

		params = mergeDeepObject(this.constructor.Default, elementParams, params);

		for (let key in params) {
			if (key.indexOf('-') !== -1) {
				let keys = key.split('-'),
					obj = defaultParams[keys[0]];

				if (params[keys[0]] === defaultParams[keys[0]]) {
					obj[keys[1]] = params[key];
				}

				params[keys[0]] = obj;
			}
		}

		console.log(params)

		return params;
	}

	_getElementParams(element) {
		return isElement(element) ? Manipulator.get(element) : {}
	}
}
export default Params;
