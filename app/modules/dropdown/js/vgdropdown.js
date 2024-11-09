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

const EVENT_KEYUP_DATA_API = `keyup.${NAME_KEY}.data.api`
const EVENT_KEYDOWN_DATA_API = `keydown.${NAME_KEY}.data.api`
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

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
		this._setPlacement();

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

		_this._getPlacement();
	}

	_getPlacement() {
		const _this = this;
		const _parent = (self) => {
			let parent = self.parentNode,
				overflow = getComputedStyle(parent).overflow;

			if (parent.tagName !== 'BODY') {
				if (overflow === 'visible') {
					_parent(parent)
				} else {
					return getBounds(parent);
				}
			} else {
				return getBounds(document.body);
			}
		}

		let bounds = _parent(_this._parent);
		console.log(bounds)

		function getBounds(element) {
			let rectDrop = _this._drop.getBoundingClientRect();

			return {
				top: rectDrop.top,
				right: rectDrop.right,
				bottom: rectDrop.bottom,
				left: rectDrop.left
			}
		}
	}

	static keydownHandler(event) {
		const isInput = /input|textarea/i.test(event.target.tagName)
		const isEscapeEvent = event.key === 'Escape'
		const isUpOrDownEvent = ['ArrowUp', 'ArrowDown'].includes(event.key)

		if (!isUpOrDownEvent && !isEscapeEvent) {
			return
		}

		if (isInput && !isEscapeEvent) {
			return
		}

		event.preventDefault()

		const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ?
			this :
			(Selectors.prev(this, SELECTOR_DATA_TOGGLE)[0] ||
				Selectors.next(this, SELECTOR_DATA_TOGGLE)[0] ||
				Selectors.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode))

		const instance = VGDropdown.getOrCreateInstance(getToggleButton)

		if (isUpOrDownEvent) {
			event.stopPropagation()
			instance.show()
			return
		}

		if (instance._isShown()) {
			event.stopPropagation()
			instance.hide()
			getToggleButton.focus()
		}
	}

	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) {
			return
		}

		const openToggles = Selectors.findAll('[data-vg-toggle="dropdown"]:not(.disabled):not(:disabled).show');

		for (const toggle of openToggles) {
			const context = VGDropdown.getInstance(toggle);
			if (!context) {
				continue;
			}

			const composedPath = event.composedPath();
			if (composedPath.includes(context.element)) {
				continue
			}

			const relatedTarget = { relatedTarget: context._element }

			if (event.type === 'click') {
				relatedTarget.clickEvent = event
			}

			context._completeHide(relatedTarget)
		}
	}
}

EventHandler.on(document, EVENT_KEYUP_DATA_API, SELECTOR_DATA_TOGGLE, VGDropdown.keydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, '.' + TARGET_CONTAINER, VGDropdown.keydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API, VGDropdown.clearDrops);
EventHandler.on(document, EVENT_KEYUP_DATA_API, VGDropdown.clearDrops);
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	event.preventDefault();
	VGDropdown.getOrCreateInstance(this).toggle();
})

export default VGDropdown;