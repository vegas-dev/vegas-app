import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {isDisabled, mergeDeepObject, noop} from "../../../utils/js/functions";
import Placement from "../../../utils/js/components/placement";
import Overflow from "../../../utils/js/components/overflow";
import Backdrop from "../../../utils/js/components/backdrop";

const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
const CLASS_NAME_FADE  = 'fade';
const TARGET_CONTAINER = 'vg-dropdown-content';
const PARENT_CONTAINER = 'vg-dropdown';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="dropdown"]';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEYUP_DATA_API =     `keyup.${NAME_KEY}.data.api`;
const EVENT_KEYDOWN_DATA_API =   `keydown.${NAME_KEY}.data.api`;
const EVENT_CLICK_DATA_API =     `click.${NAME_KEY}.data.api`;
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}.data.api`;
const EVENT_MOUSEOUT_DATA_API =  `mouseout.${NAME_KEY}.data.api`;

class VGDropdown extends BaseModule {
	constructor(element, params) {
		super(element, params);

		let defaultParams = {
			offset: [0, 2],
			backdrop: false,
			overflow: false,
			keyboard: false,
			placement: 'bottom',
			timeoutAnimation: 350,
			hover: false,
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: false,
				output: true,
			},
			animation: {
				enable: false,
				in: 'animate__flipInY',
				out: 'animate__flipOutY',
				delay: 800,
			},
		}

		if ('offset' in params && Array.isArray(params.offset)) {
			defaultParams.offset = params.offset;
		}

		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));

		const target = Selectors.getElementFromSelector(this._element);

		this._parent = this._element.parentNode;
		this._drop = target || Selectors.find('.' + TARGET_CONTAINER, this._parent);
		this._isPlacement = false;

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._drop, VGDropdown.NAME_KEY, this._params.animation);
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
		if (isDisabled(this._element) || this._isShown()) return;

		const relatedTarget = {
			relatedTarget: this._element
		}

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, relatedTarget)
		if (showEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			for (const element of [].concat(...document.body.children)) {
				EventHandler.on(element, 'mouseover', noop);
			}
		}

		this._route();

		this._element.setAttribute('aria-expanded', true);
		this._element.classList.add(CLASS_NAME_SHOW);
		this._drop.classList.add(CLASS_NAME_SHOW);
		this._setPlacement();

		if (this._params.backdrop && !this._params.hover) {
			Backdrop.show();
		}

		if (this._params.overflow) {
			Overflow.append();
			document.body.classList.add('dropdown-open')
		}

		const completeCallBack = () => {
			this._drop.classList.add(CLASS_NAME_FADE);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, relatedTarget)
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
		return this._element.classList.contains(CLASS_NAME_SHOW);
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
		this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.setAttribute('aria-expanded', 'false');

		if (this._params.backdrop && !this._params.hover) {
			const _this = this;
			Backdrop.hide(function () {
				if (_this._params.overflow) {
					Overflow.destroy();
				}
			});
		}

		if (this._params.overflow) {
			Overflow.destroy();
			document.body.classList.remove('dropdown-open');
		}

		setTimeout(() => {
			const completeCallback = () => {
				this._drop.classList.remove(CLASS_NAME_SHOW);
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN, relatedTarget);
			}
			this._queueCallback(completeCallback, this._parent, true, 10);
		}, this._params.animation.delay);
	}

	// TODO class Placement isn't done
	_setPlacement() {
		const _this = this;

		if (!_this._isPlacement) {
			let placement = new Placement({
				element: this._parent,
				drop: this._drop
			})._getPlacement();

			if (placement.isFixed) {
				_this._drop.style.position = 'fixed';
				_this._drop.style.transform = 'translateY(-20%)'; // todo this is костыль поfixить
			}

			_this._drop.style.left = placement.left + 'px';
			_this._drop.style.top =  placement.top + 'px';
		}

		if (_this._params.offset) {
			_this._drop.style.paddingTop = _this._params.offset[1] + 'px';
			_this._drop.style.paddingRight = _this._params.offset[0] + 'px';
		}

		_this._isPlacement = true;
	}

	static init(element, params = {}) {
		const instance = VGDropdown.getOrCreateInstance(element, params);

		if (instance._params.hover) {
			let currentElem = null;
			EventHandler.on(instance._parent, EVENT_MOUSEOVER_DATA_API, function (event) {
				if (currentElem) return;
				VGDropdown.hideOpenToggles(event);

				let target = event.target.closest('.' + PARENT_CONTAINER);
				if (!target) return;

				if (!instance._parent.contains(target)) return;
				currentElem = target;
				instance.show();
			});

			EventHandler.on(instance._parent, EVENT_MOUSEOUT_DATA_API, function (event) {
				if (!currentElem) return;

				let relatedTarget = event.relatedTarget;

				while (relatedTarget) {
					if (relatedTarget === currentElem) return;
					relatedTarget = relatedTarget.parentNode;
				}

				currentElem = null;
				instance._completeHide({relatedTarget: instance._element});
			})
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

	static hideOpenToggles(event) {
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
			this : (Selectors.find(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode))

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

		VGDropdown.hideOpenToggles(event)
	}
}

export default VGDropdown;