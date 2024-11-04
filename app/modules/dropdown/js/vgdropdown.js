import BaseModule from "../../base-module";
import {Manipulator} from "../../../_utils/js/manipulator";
import {isDisabled} from "../../../_utils/js/functions";

const isShown = false;
const NAME = 'vg.dropdown';
const TARGET_CONTAINER = 'vg-dropdown-content';
const ParamsDefault = {
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

class VGDropdown extends BaseModule {
	constructor(element, params) {
		super(element, params);
		this._container = null;
		this.container = '.' + TARGET_CONTAINER;
		this.init();

		console.log(this.container)
	}

	static get Default() {
		return ParamsDefault
	}

	static get NAME() {
		return NAME;
	}

	get container() {
		return this._container;
	}

	set container(target) {
		return this._container = Manipulator.find(target, this.element);
	}

	init() {
		const _this = this;
		_this.element.vgDropdown = this;
		_this.setPosition();
	}

	toggle() {
		return !isShown ? this.show() : this.hide();
	}

	show() {
		if (isDisabled(this.element) || isShown) {
			return false;
		}
	}

	hide() {

	}

	setPosition() {
		const _this = this;

		let rect = _this.element.getBoundingClientRect();
		_this.container.style.inset      = '0px auto auto 0px';
		_this.container.style.transform  = 'translate(0, '+ (rect.height + _this.params.indent) +'px)';

		console.log(_this.params)

		if (_this.params.over) {
			_this.element.style.position = 'fixed';
		}
	}

	dispose() {
		super.dispose();
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