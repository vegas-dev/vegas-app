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

		for (let key in mParams) {
			if (key.indexOf('-') !== -1) {
				let keys = key.split('-'),
					value = normalizeData(mParams[key]);

				if (keys[0] in mParams) {
					if (keys[1] in mParams[keys[0]]) {
						mParams[keys[0]][keys[1]] = value;
					}
				}

				delete mParams[key];
			}
		}

		if ('params' in mParams) {
			mParams = mergeDeepObject(mParams, mParams.params);
			delete mParams.params;
		}

		return mParams;
	}
}

export default Params;