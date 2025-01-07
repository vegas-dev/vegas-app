import {isElement, isEmptyObj, isObject, mergeDeepObject, normalizeData} from "./functions";
import {Manipulator} from "./manipulator";

/**
 * Класс Params, собирает все "параметры" для работы модулей, являясь для них отправной точкой
 */

class Params {
	static get Default() {
		return {}
	}

	_getParams(params, element) {
		params = this._mergeParamsObj(params, element);
		params = this._paramsAfterMerge(params);
		return params
	}

	_paramsAfterMerge(params) {
		let pDefault = this.constructor.Default,
			mParams = mergeDeepObject(pDefault, params);

		if (isObject(mParams) && !isEmptyObj(mParams)) {
			for (const datum in mParams) {
				let value = normalizeData(mParams[datum]);

				if (datum !== 'params') {
					if (!(datum in pDefault)) {
						let p = datum.split('-');

						if (pDefault[p[0]] && p[1] in pDefault[p[0]]) {
							pDefault[p[0]][p[1]] = value;
						}

						delete mParams[datum];
					} else {
						mParams[datum] = value;
					}
				} else {
					mParams = mergeDeepObject(mParams, value)
					delete mParams[datum];
				}
			}
		}

		return mParams;
	}

	_mergeParamsObj(params, element) {
		return isElement(element) ? mergeDeepObject(Manipulator.get(element), params) : {}
	}
}
export default Params;
