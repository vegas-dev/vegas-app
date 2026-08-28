/**
 * Описание: всплывающие подсказки и информационные popover VGApp.
 * Возможности: Data API, позиционирование, события и очистка при удалении триггера.
 */
import BaseModule from "../../base-module";
import {isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import Placement from "../../../utils/js/components/placement";

const NAME = 'tooltip';
const NAME_KEY = 'vg.tooltip';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="tooltip"]';
const SELECTOR_DATA_TOGGLE_POPOVER = '[data-vg-toggle="popover"]';

const CLASS_NAME_OPEN = 'vg-tooltip-open';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWN = 'shown';

const SELECTOR_OPEN_TRIGGER = `${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}, ${SELECTOR_DATA_TOGGLE_POPOVER}.${CLASS_NAME_SHOW}`;

const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;

const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_MOUSEENTER = `mouseenter.${NAME_KEY}`;
const EVENT_KEY_MOUSELEAVE = `mouseleave.${NAME_KEY}`;
const EVENT_KEY_CLICK_DISMISS = `click.dismiss.${NAME_KEY}`;
const EVENT_KEY_KEYDOWN = `keydown.dismiss.${NAME_KEY}`;

const PLACEMENT_CLASSES = [
	'top',
	'top-start',
	'top-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'left-start',
	'left-end',
	'right',
	'right-start',
	'right-end'
];

const defaultParams = {
	title: '',
	content: '',
	trigger: 'hover',
	placement: 'top',
	container: 'body',
	popover: false,
	html: false,
	offset: [8, 8],
	autoFlip: true,
	overflowProtection: true,
	fallbackPlacements: ['bottom', 'right', 'left'],
	closeOnOutsideClick: true,
	keyboard: true,
	closeOther: true,
	delay: {
		show: 100,
		hide: 100
	},
	arrow: {
		padding: 8
	},
	custom: {
		class: ''
	},
	animation: {
		enable: true,
		in: 'animate__backInUp',
		out: 'animate__backOutDown',
		delay: 300,
		effect: 'none',
	}
};

class VGTooltip extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));
		// Геометрические массивы заменяются целиком, а не дополняют defaults.
		const dataParams = this._getParams(element, {});
		['offset', 'fallbackPlacements'].forEach(key => {
			this._params[key] = [...(dataParams[key] ?? params[key] ?? defaultParams[key])];
		});
		this._tooltip = null;
		this._isHiding = false;
		this._showTimeout = null;
		this._hideTimeout = null;
		this._triggerObserver = null;

		this._fixTitle();

		this._handleUpdate = () => {
			if (!this._element?.isConnected) {
				this.dispose();
				return;
			}

			if (this._isShown()) {
				this._setPlacement();
			}
		};
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	show(relatedTarget) {
		if (isDisabled(this._element) || this._isShown()) return;

		this._clearTimeouts();

		this._showTimeout = setTimeout(() => {
			this._showTimeout = null;
			if (!this._element?.isConnected) {
				this.dispose();
				return;
			}

			const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
			if (showEvent.defaultPrevented) return;

			if (this._params.closeOther) {
				this._hideOpenedTooltips();
			}

			this._isHiding = false;
			this._createTooltip();

			if (!this._tooltip) return;

			this._tooltip.classList.remove(CLASS_NAME_SHOWN);
			this._tooltip.classList.add(CLASS_NAME_SHOW);
			this._element.classList.add(CLASS_NAME_SHOW);
			document.body.classList.add(CLASS_NAME_OPEN);

			this._addWindowListeners();
			this._observeTrigger();

			requestAnimationFrame(() => {
				if (!this._tooltip) return;

				this._setPlacement();

				this._queueCallback(() => {
					if (!this._tooltip || this._isHiding) return;

					this._tooltip.classList.add(CLASS_NAME_SHOWN);
					EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
				}, this._tooltip, true, this._params.animation.delay);
			});
		}, this._params.delay.show);
	}

	hide() {
		this._clearTimeouts();

		if (!this._isShown() || this._isHiding || !this._tooltip) return;

		this._disconnectTriggerObserver();

		this._hideTimeout = setTimeout(() => {
			this._hideTimeout = null;

			const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
			if (hideEvent.defaultPrevented) {
				this._observeTrigger();
				return;
			}

			this._removeWindowListeners();

			this._isHiding = true;
			this._tooltip.classList.remove(CLASS_NAME_SHOWN);

			this._queueCallback(() => {
				if (!this._tooltip) return;

				this._tooltip.classList.remove(CLASS_NAME_SHOW);
				this._element.classList.remove(CLASS_NAME_SHOW);
				this._element.removeAttribute('aria-describedby');

				this._tooltip.remove();
				this._tooltip = null;
				this._isHiding = false;

				if (!Selectors.find('.vg-tooltip.show')) {
					document.body.classList.remove(CLASS_NAME_OPEN);
				}

				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
			}, this._tooltip, false, this._params.animation.delay);
		}, this._params.delay.hide);
	}

	dispose() {
		this._clearTimeouts();
		this._removeWindowListeners();
		this._disconnectTriggerObserver();

		if (this._tooltip) {
			this._tooltip.remove();
			this._tooltip = null;
		}

		if (this._element) {
			this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_SHOWN);
			this._element.removeAttribute('aria-describedby');

			if (Object.prototype.hasOwnProperty.call(this._element.dataset, 'vgOriginalTitle')) {
				this._element.setAttribute('title', this._element.dataset.vgOriginalTitle);
				this._element.removeAttribute('data-vg-original-title');
			}
		}

		if (!Selectors.find('.vg-tooltip.show')) {
			document.body.classList.remove(CLASS_NAME_OPEN);
		}

		super.dispose();
	}

	_isShown() {
		return !!this._element && this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_createTooltip() {
		if (this._tooltip) return;

		const title = this._getTitle();
		if (!title) return;

		const id = `vg-tooltip-${makeRandomString()}`;
		const tooltip = document.createElement('div');

		tooltip.id = id;
		tooltip.className = `vg-tooltip ${this._params.placement} ${this._params.custom.class || ''}`;
		tooltip.setAttribute('role', this._params.popover ? 'dialog' : 'tooltip');

		if (this._params.popover) {
			tooltip.classList.add('vg-tooltip-popover');
		}

		const inner = document.createElement('div');
		inner.classList.add('vg-tooltip-inner');
		const content = this._params.content || this._element.dataset.vgContent || '';

		if (content) {
			const titleBlock = document.createElement('div');
			titleBlock.classList.add('vg-tooltip-inner--title');

			const contentBlock = document.createElement('div');
			contentBlock.classList.add('vg-tooltip-inner--content');

			if (this._params.html) {
				titleBlock.innerHTML = title;
				contentBlock.innerHTML = content;
			} else {
				titleBlock.textContent = title;
				contentBlock.textContent = content;
			}

			inner.append(titleBlock);
			inner.append(contentBlock);
		} else {
			if (this._params.html) {
				inner.innerHTML = title;
			} else {
				inner.textContent = title;
			}
		}

		const arrow = document.createElement('div');
		arrow.classList.add('vg-tooltip-arrow');

		inner.append(arrow);
		tooltip.append(inner);

		const container = this._params.container === 'body'
			? document.body
			: Selectors.find(this._params.container);

		if (!container) return;

		container.append(tooltip);

		this._element.setAttribute('aria-describedby', id);
		this._tooltip = tooltip;

		this._animation(this._tooltip, VGTooltip.NAME_KEY, this._params.animation);
	}

	_getTitle() {
		return (
			this._params.title ||
			this._element.dataset.vgTitle ||
			this._element.dataset.vgOriginalTitle ||
			''
		);
	}

	_fixTitle() {
		const title = this._element.getAttribute('title');

		if (title === null) return;

		this._element.setAttribute('data-vg-original-title', title);
		this._element.removeAttribute('title');
	}

	_setPlacement() {
		if (!this._tooltip) return;

		const placement = new Placement({
			reference: this._element,
			drop: this._tooltip,
			placement: this._params.placement,
			offset: this._params.offset,
			autoFlip: this._params.autoFlip,
			overflowProtection: this._params.overflowProtection,
			fallbackPlacements: this._params.fallbackPlacements,
			clamp: true,
			isMerge: false
		});

		placement._setPlacement();

		this._syncPlacementClass();
		this._setArrowPlacement();
	}

	_setArrowPlacement() {
		if (!this._tooltip) return;

		const inner = this._tooltip.querySelector('.vg-tooltip-inner');
		const arrow = this._tooltip.querySelector('.vg-tooltip-arrow');

		if (!inner || !arrow) return;

		const placement = this._tooltip.getAttribute('data-vg-placement') || this._params.placement;

		const triggerRect = this._element.getBoundingClientRect();
		const innerRect = inner.getBoundingClientRect();

		const triggerCenterX = triggerRect.left + triggerRect.width / 2;
		const triggerCenterY = triggerRect.top + triggerRect.height / 2;

		const arrowPadding = this._params.arrow.padding;

		arrow.style.left = '';
		arrow.style.right = '';
		arrow.style.top = '';
		arrow.style.bottom = '';

		if (placement.startsWith('top') || placement.startsWith('bottom')) {
			let arrowLeft = triggerCenterX - innerRect.left;

			arrowLeft = Math.max(
				arrowPadding,
				Math.min(arrowLeft, innerRect.width - arrowPadding)
			);

			arrow.style.left = `${arrowLeft}px`;
			arrow.style.transform = 'translateX(-50%) rotate(45deg)';

			if (placement.startsWith('top')) {
				arrow.style.bottom = '-4px';
			} else {
				arrow.style.top = '-4px';
			}
		}

		if (placement.startsWith('left') || placement.startsWith('right')) {
			let arrowTop = triggerCenterY - innerRect.top;

			arrowTop = Math.max(
				arrowPadding,
				Math.min(arrowTop, innerRect.height - arrowPadding)
			);

			arrow.style.top = `${arrowTop}px`;
			arrow.style.transform = 'translateY(-50%) rotate(45deg)';

			if (placement.startsWith('left')) {
				arrow.style.right = '-4px';
			} else {
				arrow.style.left = '-4px';
			}
		}
	}

	_syncPlacementClass() {
		if (!this._tooltip) return;

		const placement = this._tooltip.getAttribute('data-vg-placement');

		this._tooltip.classList.remove(...PLACEMENT_CLASSES);

		if (placement) {
			this._tooltip.classList.add(placement);
		}
	}

	_hideOpenedTooltips() {
		Selectors.findAll('.vg-tooltip.show').forEach(tooltip => {
			const id = tooltip.id;
			const trigger = Selectors.find(`[aria-describedby="${id}"]`);

			if (!trigger) {
				tooltip.remove();
				return;
			}

			if (trigger === this._element) return;

			const instance = VGTooltip.getInstance(trigger);
			instance?.hide();
		});

		if (!Selectors.find('.vg-tooltip.show')) {
			document.body.classList.remove(CLASS_NAME_OPEN);
		}
	}

	_observeTrigger() {
		if (this._triggerObserver || !this._element?.isConnected) return;

		this._triggerObserver = new MutationObserver(() => {
			if (!this._element?.isConnected) {
				this.dispose();
			}
		});

		this._triggerObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	_disconnectTriggerObserver() {
		if (!this._triggerObserver) return;

		this._triggerObserver.disconnect();
		this._triggerObserver = null;
	}

	_addWindowListeners() {
		window.addEventListener('resize', this._handleUpdate);
		window.addEventListener('scroll', this._handleUpdate, true);
	}

	_removeWindowListeners() {
		window.removeEventListener('resize', this._handleUpdate);
		window.removeEventListener('scroll', this._handleUpdate, true);
	}

	_clearTimeouts() {
		if (this._showTimeout) {
			clearTimeout(this._showTimeout);
			this._showTimeout = null;
		}

		if (this._hideTimeout) {
			clearTimeout(this._hideTimeout);
			this._hideTimeout = null;
		}
	}
}

const getShownInstances = () => {
	return Selectors.findAll(SELECTOR_OPEN_TRIGGER)
		.map(element => VGTooltip.getInstance(element))
		.filter(Boolean);
};

EventHandler.on(document, EVENT_KEY_KEYDOWN, event => {
	if (event.key !== 'Escape') return;

	getShownInstances().forEach(instance => {
		if (!instance._params.keyboard || !instance._isShown()) return;

		instance.hide();
	});
});

EventHandler.on(document, EVENT_KEY_CLICK_DISMISS, event => {
	getShownInstances().forEach(instance => {
		if (!instance._params.closeOnOutsideClick) return;
		if (!instance._params.trigger.includes('click') && !instance._params.popover) return;
		if (!instance._isShown()) return;

		if (
			instance._tooltip?.contains(event.target) ||
			instance._element.contains(event.target)
		) {
			return;
		}

		instance.hide();
	});
});

EventHandler.on(document, EVENT_KEY_MOUSEENTER, SELECTOR_DATA_TOGGLE, function () {
	const instance = VGTooltip.getOrCreateInstance(this);

	if (instance._params.trigger.includes('hover')) {
		instance.show(this);
	}
});

EventHandler.on(document, EVENT_KEY_MOUSELEAVE, SELECTOR_DATA_TOGGLE, function () {
	const instance = VGTooltip.getOrCreateInstance(this);

	if (instance._params.trigger.includes('hover')) {
		instance.hide();
	}
});

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const instance = VGTooltip.getOrCreateInstance(this);

	if (instance._params.popover) {
		instance._params.trigger = 'click';
	}

	if (instance._params.trigger.includes('click')) {
		event.preventDefault();
		instance.toggle(this);
	}
});

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_POPOVER, function (event) {
	event.preventDefault();

	const instance = VGTooltip.getOrCreateInstance(this);

	instance._params.popover = true;
	instance._params.trigger = 'click';

	instance.toggle(this);
});

export default VGTooltip;
