import BaseModule from "../../_utils/js/base-module";
import {
	eventHandler,
	Manipulator,
	mergeParams
} from "../../_utils/js/manipulator";

let isShown = false;

const EVENT_KEY_HIDE   = 'vg.dropdown.hide';
const EVENT_KEY_HIDDEN = 'vg.dropdown.hidden';
const EVENT_KEY_SHOW   = 'vg.dropdown.show';
const EVENT_KEY_SHOWN  = 'vg.dropdown.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';

class VGDropdown extends BaseModule{
	constructor(element, arg = {}) {
		super();

		//-- backdrop, overflow, keyboard - работают есть параметр over стоит true
		this.paramsDefault = {
			button: null,
			over: false,
			backdrop: true,
			overflow: true,
			keyboard: false,
			ajax: {
				route: '',
				target: ''
			}
		};
		this.element = element;
		this.params = mergeParams(arg, this.paramsDefault);
		this.init();
	}

	init() {
		const _this = this;
		_this.element.vgDropdown = this;

		if (_this.params.over) {
			_this.element.style.position = 'fixed';
		} else {

		}
	}

	toggle() {
		return !isShown ? this.show() : this.hide();
	}

	show() {

	}

	hide() {

	}
}

export default VGDropdown;
