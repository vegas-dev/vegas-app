import {isElement, mergeDeepObject, normalizeData} from "../functions";
import {Manipulator} from "../dom/manipulator";

class Params {
	constructor(params, element = null) {
		this._params = this.merge(params, element);
	}

	get() {
		return this._params;
	}

	fromElement(element) {
		return isElement(element) ? Manipulator.get(element) : {};
	}

	merge(params, element) {
		let mParams = mergeDeepObject(params, this.fromElement(element));

		function stringToNestedObjectWithValue(str, value, params) {
			const keys = str.split('-');
			let result = {};
			let currentLevel = result;

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];

				if (i < keys.length - 1) {
					currentLevel[key] = {};
					currentLevel = currentLevel[key];
				} else {
					currentLevel[key] = value;
				}
			}

			return mergeDeepObject(params, result);
		}

		for (let key in mParams) {
			if (key.indexOf('-') !== -1) {
				mParams = stringToNestedObjectWithValue(key, mParams[key], mParams);
				delete mParams[key];
			}
		}

		return mParams;
	}
}

export default Params;