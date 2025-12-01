import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGModal from "../../vgmodal/js/vgmodal";

/**
 * Constants
 */
const NAME = 'alert';
const NAME_KEY = 'vg.alert';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="alert"]';
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

let IS_PROMISE = false;

class VGAlert extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			modal: {
				centered: false,
				backdrop: true,
				overflow: true,
				keyboard: true,
				animation: {
					enable: false,
					in: 'animate__rollIn',
					out: 'animate__rollOut',
					delay: 0,
				},
			},
			toast: {

			},
			elements: {
				button: ''
			},
			dialog: 'modal',
			mode: 'alert',
		}, params));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	static call(options = {}) {
		return new Promise(options => {})
	}
}


export default VGAlert;