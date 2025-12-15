import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {isDisabled, mergeDeepObject, noop} from "../../../utils/js/functions";
import Placement from "../../../utils/js/components/placement";
import Overflow from "../../../utils/js/components/overflow";
import Backdrop from "../../../utils/js/components/backdrop";
import {dismissTrigger} from "../../module-fn";

const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
const CLASS_NAME_FADE  = 'fade';
const CLASS_NAME_OPEN  = 'open';
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
			backdrop: false,
			overflow: false,
			keyboard: false,
			timeoutAnimation: 10,
			placement: 'auto',
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
				fade: true,
				enable: false,
				in: 'animate__flipInY',
				out: 'animate__flipOutY',
				delay: 300,
			},
		};

		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));

		const target = Selectors.getElementFromSelector(this._element);
		this._parent = this._element.parentNode;
		this._drop = target || Selectors.find(`.${TARGET_CONTAINER}`, this._parent);

		if (!this._drop) return;

		this._isPlacement = false;
		this.isFade = this._params.animation.fade;
		this.isAnimation = this._params.animation.enable;

		this._params.animation.delay = this.isAnimation ? this._params.animation.delay : 0;
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

		const relatedTarget = { relatedTarget: this._element };

		const showEvent = EventHandler.trigger(this._drop, EVENT_KEY_SHOW, relatedTarget);
		if (showEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			[].concat(...document.body.children).forEach(el => {
				EventHandler.on(el, 'mouseover', noop);
			});
		}

		this._element.setAttribute('aria-expanded', 'true');
		this._element.classList.add(CLASS_NAME_SHOW);
		this._drop.classList.add(CLASS_NAME_SHOW);
		this._setPlacement();
		this._route();

		if (this._params.backdrop && !this._params.hover) {
			Backdrop.show();
		}

		if (this._params.overflow) {
			Overflow.append();
			document.body.classList.add('dropdown-open');
		}

		const completeCallback = () => {
			if (this.isFade) {
				this._drop.classList.add(CLASS_NAME_FADE);
			} else if (!this.isAnimation) {
				this._drop.classList.add(CLASS_NAME_OPEN);
			}
			EventHandler.trigger(this._drop, EVENT_KEY_SHOWN, relatedTarget);
		};

		this._queueCallback(completeCallback, this._drop, this.isAnimation || this.isFade, 50);
	}

	hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		this._completeHide({ relatedTarget: this._element });
	}

	dispose() {
		super.dispose();
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_completeHide(relatedTarget) {
		const hideEvent = EventHandler.trigger(this._drop, EVENT_KEY_HIDE, relatedTarget);
		if (hideEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			[].concat(...document.body.children).forEach(el => {
				EventHandler.off(el, 'mouseover', noop);
			});
		}

		this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.setAttribute('aria-expanded', 'false');

		if (this.isFade) {
			this._drop.classList.remove(CLASS_NAME_FADE);
		} else if (!this.isAnimation) {
			this._drop.classList.remove(CLASS_NAME_OPEN);
		}

		if (this._params.backdrop && !this._params.hover) {
			Backdrop.hide(() => {
				if (this._params.overflow) {
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
				EventHandler.trigger(this._drop, EVENT_KEY_HIDDEN, relatedTarget);
			};
			this._queueCallback(completeCallback, this._drop, this.isAnimation || this.isFade);
		}, this._params.animation.delay);
	}

	_setPlacement() {
		if (!this._drop) return;

		if (!this._isPlacement) {
			let placementDefault = 'bottom-start',
				autoFlip = false,
				overflowProtection = false;

			if (this._params.placement === 'auto') {
				autoFlip = true;
				overflowProtection = true;
			} else {
				placementDefault = this._params.placement
			}

			const placement = new Placement({
				reference: this._element,
				drop: this._drop,
				placement: placementDefault,
				boundary: 'clippingParents',
				autoFlip: autoFlip,
				overflowProtection: overflowProtection,
				fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
			});

			placement._setPlacement(); // позиционируем
		}

		this._isPlacement = true;
	}

	static init(element, params = {}) {
		const instance = VGDropdown.getOrCreateInstance(element, params);

		if (instance._params.hover && !instance.isMobileDevice()) {
			let currentElem = null;

			EventHandler.on(instance._parent, EVENT_MOUSEOVER_DATA_API, (event) => {
				if (currentElem) return;

				VGDropdown.hideOpenToggles(event);

				const target = event.target.closest(`.${PARENT_CONTAINER}`);
				if (!target || !instance._parent.contains(target)) return;

				currentElem = target;
				instance.show();
			});

			EventHandler.on(instance._parent, EVENT_MOUSEOUT_DATA_API, (event) => {
				if (!currentElem) return;

				let relatedTarget = event.relatedTarget;
				while (relatedTarget && relatedTarget !== currentElem) {
					relatedTarget = relatedTarget.parentNode;
				}

				if (relatedTarget === currentElem) return;

				currentElem = null;
				instance._completeHide({ relatedTarget: instance._element });
			});
		}

		// Клавиатурные события
		EventHandler.on(document, EVENT_KEYUP_DATA_API, SELECTOR_DATA_TOGGLE, VGDropdown.keydownHandler);
		EventHandler.on(document, EVENT_KEYDOWN_DATA_API, `.${TARGET_CONTAINER}`, VGDropdown.keydownHandler);
		EventHandler.on(document, EVENT_KEYUP_DATA_API, VGDropdown.clearDrops);
		EventHandler.on(document, EVENT_CLICK_DATA_API, VGDropdown.clearDrops);

		// Клик по тоглу
		EventHandler.on(element, EVENT_CLICK_DATA_API, (event) => {
			event.preventDefault();
			instance.toggle();
		});
	}

	static hideOpenToggles(event) {
		const openToggles = Selectors.findAll(`${SELECTOR_DATA_TOGGLE}:not(.disabled):not(:disabled).${CLASS_NAME_SHOW}`);
		for (const toggle of openToggles) {
			const context = VGDropdown.getInstance(toggle);
			if (!context) continue;

			if (event.target.closest(`.${TARGET_CONTAINER}`) === context._drop) {
				return;
			}

			const composedPath = event.composedPath?.() || [];
			if (composedPath.includes(context._element)) {
				continue;
			}

			const relatedTarget = { relatedTarget: context._element };
			if (event.type === 'click') {
				relatedTarget.clickEvent = event;
			}

			context._completeHide(relatedTarget);
		}
	}

	static keydownHandler(event) {
		const isInput = /input|textarea/i.test(event.target.tagName);
		const isEscapeEvent = event.key === 'Escape';
		const isUpOrDownEvent = ['ArrowUp', 'ArrowDown'].includes(event.key);

		if (!isUpOrDownEvent && !isEscapeEvent) return;
		if (isInput && !isEscapeEvent) return;

		event.preventDefault();

		const toggle = this.matches(SELECTOR_DATA_TOGGLE)
			? this
			: Selectors.find(SELECTOR_DATA_TOGGLE, event.delegateTarget?.parentNode);

		if (!toggle) return;

		const instance = VGDropdown.getOrCreateInstance(toggle);

		if (isUpOrDownEvent) {
			event.stopPropagation();
			instance.show();
		} else if (instance._isShown()) {
			event.stopPropagation();
			instance.hide();
			toggle.focus();
		}
	}

	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) {
			return;
		}
		VGDropdown.hideOpenToggles(event);
	}
}

dismissTrigger(VGDropdown);

export default VGDropdown;