import BaseModule from "../../base-module";
import {mergeDeepObject} from "../../../utils/js/functions";

/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';

/**
 *
 */
const defaultParams = {

};

class VGRangeSlider extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}
}

export default VGRangeSlider;