import BaseModule from "../../base-module";
import {Manipulator} from "../../../_utils/js/manipulator";
import {isDisabled} from "../../../_utils/js/functions";

const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
const TARGET_CONTAINER = 'vg-dropdown-content';
const PARAMS_DEFAULT     = {
	offset: [0, 2],
	over: false,
	backdrop: true,
	overflow: true,
	keyboard: false,
	ajax: {
		route: '',
		target: ''
	}
};

const EVENT_KEY_HIDE   = 'vg.dropdown.hide';
const EVENT_KEY_HIDDEN = 'vg.dropdown.hidden';
const EVENT_KEY_SHOW   = 'vg.dropdown.show';
const EVENT_KEY_SHOWN  = 'vg.dropdown.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';

class VGDropdown extends BaseModule {
	constructor(element, params) {
		super(element, params);

		console.log(this.element)
		console.log(this.params)
	}

	static get Default() {
		return PARAMS_DEFAULT
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	toggle() {

	}

	static makeInit(btn) {
		btn.addEventListener('click', () => {
			let dropdown = new VGDropdown(btn, {});
			dropdown.toggle();

			return false;
		});
	}
}

export default VGDropdown;