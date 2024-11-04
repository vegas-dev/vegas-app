import BaseModule from "../../_utils/js/base-module";
import {
	eventHandler,
	Manipulator,
	mergeParams
} from "../../_utils/js/manipulator";
import Params from "../../_utils/js/params";

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
		this._container = null;
		this.paramsDefault = {
			indent: 2,
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

		this.element   = element;
		this.params    = mergeParams(arg, this.paramsDefault);
		this.container = '.vg-dropdown-content';
		this.init();
	}

	get container() {
		return this._container;
	}

	set container(target) {
		return this._container = this.element.querySelector(target);
	}

	init() {
		const _this = this;
		_this.element.vgDropdown = this;
		_this.setPosition();

		const DATA = new Map();
		console.log(DATA)
	}

	toggle() {
		return !isShown ? this.show() : this.hide();
	}

	show() {
		let _this = this;

		if (isShown) return;
		isShown = true;

		_this.params.button.classList.add('active');
		_this.params.button.setAttribute('aria-expanded', 'true');
		_this.container.classList.add('show');

		eventHandler.on(_this.element, EVENT_KEY_SHOW);
	}

	hide() {
		let _this = this;

		if (!isShown) return;
		isShown = false;

		_this.params.button.classList.remove('active');
		_this.params.button.setAttribute('aria-expanded', 'false');
		_this.container.classList.remove('show');

		eventHandler.on(_this.element, EVENT_KEY_HIDE);
	}

	setPosition() {
		const _this = this;

		let rect = _this.element.getBoundingClientRect();
		_this.container.style.inset      = '0px auto auto 0px';
		_this.container.style.transform  = 'translate(0, '+ (rect.height + _this.params.indent) +'px)';

		if (_this.params.over) {
			_this.element.style.position = 'fixed';
		}
	}

	static makeInit(btn) {
		btn.addEventListener('click', () => {
			let arg = Manipulator.getDataAttributes(btn),
				target = btn.closest('.vg-dropdown') || null;

			if (target) {
				arg.button = btn;
				delete arg['toggle'];

				let dropdown = new VGDropdown(target, arg);
				dropdown.toggle();
			}

			return false;
		});
	}
}

export default VGDropdown;
