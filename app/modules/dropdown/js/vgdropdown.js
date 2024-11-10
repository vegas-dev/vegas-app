import BaseModule from "../../base-module";
import EventHandler from "../../../_utils/js/event";
import Selectors from "../../../_utils/js/selectors";
import {isDisabled, noop, normalizeData} from "../../../_utils/js/functions";
import params from "../../../_utils/js/params";

const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
const CLASS_NAME_FADE  = 'fade-top';
const TARGET_CONTAINER = 'vg-dropdown-content';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="dropdown"]';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEYUP_DATA_API = `keyup.${NAME_KEY}.data.api`;
const EVENT_KEYDOWN_DATA_API = `keydown.${NAME_KEY}.data.api`;
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}.data.api`;
const EVENT_MOUSEOUT_DATA_API = `mouseout.${NAME_KEY}.data.api`;

const PARAMS_DEFAULT     = {
	offset: [0, 2],
	over: false,
	backdrop: true,
	overflow: true,
	keyboard: true,
	placement: 'bottom',
	hover: false,
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
		this._isPlacement = false;
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

	dispose() {
		return super.dispose();
	}

	_isShown() {
		return this.element.classList.contains(CLASS_NAME_SHOW);
	}

	_completeHide(relatedTarget) {
		const hideEvent = EventHandler.trigger(this.element, EVENT_KEY_HIDE, relatedTarget)
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
		this._queueCallback(completeCallback, this._drop, true, 10);
	}

	_setPlacement() {
		const _this = this;

		if (!_this._isPlacement) {
			let placement = _this._getPlacement();

			if (placement.isFixed) {
				_this._drop.style.position = 'fixed';
			}

			_this._drop.style.left = placement.left + 'px';
			_this._drop.style.top =  placement.top + 'px';
		}

		_this._isPlacement = true;
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
					return parent;
				}
			} else {
				return null;
			}
		}

		let isFixed = false, top, left,
			bounds = _this._drop.getBoundingClientRect(),
			parent = _this._parent.getBoundingClientRect();

		if (_parent(_this._parent)) {
			left = bounds.left + _this.params.offset[0];
			top  = bounds.top + _this.params.offset[1];
			isFixed = true;
		} else {
			let styles = getComputedStyle(_this._drop);
			top = normalizeData(styles.top.slice(0, -2)) + _this.params.offset[1];
			left = normalizeData(styles.left.slice(0, -2)) + _this.params.offset[0];
		}

		if ((bounds.left + bounds.width) > window.innerWidth) {
			left = parent.width - bounds.width;
		}

		return {
			isFixed: isFixed,
			top: top,
			left: left
		}
	}

	static init(element, params = {}) {
		const instance = VGDropdown.getOrCreateInstance(element, params);

		if (instance.params.hover) {
			// TODO isHover not done
		} else {
			EventHandler.on(document, EVENT_KEYUP_DATA_API, SELECTOR_DATA_TOGGLE, VGDropdown.keydownHandler);
			EventHandler.on(document, EVENT_KEYDOWN_DATA_API, '.' + TARGET_CONTAINER, VGDropdown.keydownHandler);
			EventHandler.on(document, EVENT_KEYUP_DATA_API, VGDropdown.clearDrops);
			EventHandler.on(document, EVENT_CLICK_DATA_API, VGDropdown.clearDrops);
			EventHandler.on(element, EVENT_CLICK_DATA_API, function (event) {
				event.preventDefault();
				instance.toggle();
			});
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

			if (event.target.closest('.' + TARGET_CONTAINER) === context._drop) {
				return;
			}

			const composedPath = event.composedPath();
			if (composedPath.includes(context._element)) {
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

export default VGDropdown;