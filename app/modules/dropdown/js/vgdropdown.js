import BaseModule from "../../base-module";
import EventHandler from "../../../_utils/js/event";
import Selectors from "../../../_utils/js/selectors";
import {isDisabled, noop} from "../../../_utils/js/functions";

const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
const CLASS_NAME_FADE  = 'fade-top';
const TARGET_CONTAINER = 'vg-dropdown-content';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="dropdown"]'

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

const PARAMS_DEFAULT     = {
	offset: [0, 2],
	over: false,
	backdrop: true,
	overflow: true,
	keyboard: true,
	placement: 'bottom',
	ajax: {
		route: '',
		target: ''
	}
};

class VGDropdown extends BaseModule {
	constructor(element, params) {
		super(element, params);

		this._parent = this.element.parentNode;
		this._drop = Selectors.get('.' + TARGET_CONTAINER, this._parent);
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
		return this._isShown() ? this.hide() : this.show();
	}

	show() {
		if (isDisabled(this.element) || this._isShown()) return;

		const relatedTarget = {
			relatedTarget: this.element
		}

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, relatedTarget)
		if (showEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			for (const element of [].concat(...document.body.children)) {
				EventHandler.on(element, 'mouseover', noop);
			}
		}

		this.element.setAttribute('aria-expanded', true);
		this.element.classList.add(CLASS_NAME_SHOW);
		this._drop.classList.add(CLASS_NAME_SHOW);

		const completeCallBack = () => {
			this._drop.classList.add(CLASS_NAME_FADE);
			EventHandler.trigger(this.element, EVENT_KEY_SHOWN, relatedTarget)
		}
		this._queueCallback(completeCallBack, this._drop, true, 50);
	}

	hide() {
		if (isDisabled(this._element) || !this._isShown()) {
			return;
		}

		const relatedTarget = {
			relatedTarget: this._element
		}

		this._completeHide(relatedTarget);
	}

	_isShown() {
		return this.element.classList.contains(CLASS_NAME_SHOW);
	}

	_completeHide(relatedTarget) {
		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE, relatedTarget)
		if (hideEvent.defaultPrevented) {
			return;
		}

		if ('ontouchstart' in document.documentElement) {
			for (const element of [].concat(...document.body.children)) {
				EventHandler.off(element, 'mouseover', noop);
			}
		}

		this._drop.classList.remove(CLASS_NAME_FADE);
		this.element.classList.remove(CLASS_NAME_SHOW);
		this.element.setAttribute('aria-expanded', 'false');

		const completeCallback = () => {
			this._drop.classList.remove(CLASS_NAME_SHOW);
			EventHandler.trigger(this.element, EVENT_KEY_HIDDEN, relatedTarget);
		}
		this._queueCallback(completeCallback, this._drop, true);
	}

	_setPlacement() {
		const _this = this;
		let offset = getOffset(),
			rectElement = this.element.getBoundingClientRect();

		if (offset.length !== 2 || !rectElement) return;

		const completePlacement = () => {
			if (_this.params.placement === 'bottom') {
				_this._drop.style.inset      = '0px auto auto 0px';
				_this._drop.style.transform  = 'translate(0, '+ (rectElement.height + offset[1]) +'px)';
			}
		}

		this._queueCallback(completePlacement, this._drop, true, 50);

		function getOffset() {
			const { offset } = _this.params;

			if (typeof offset === 'string') {
				return offset.split(',').map(value => Number.parseInt(value, 10))
			}

			return offset;
		}
	}
}

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	event.preventDefault();
	VGDropdown.getOrCreateInstance(this).toggle();
})

export default VGDropdown;