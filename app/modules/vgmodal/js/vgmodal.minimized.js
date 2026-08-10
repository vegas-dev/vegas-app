import Backdrop from "../../../utils/js/components/backdrop";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {reflow} from "../../../utils/js/functions";

const NAME_KEY = 'vg.modal';

const OPEN_SELECTOR = '.vg-modal.show:not([data-vg-persistent="true"])';

const CLASS_NAME_OPEN = 'vg-modal-open';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_MINIMIZED = 'vg-modal-minimized-state';
const CLASS_NAME_MINIMIZE_BUTTON = 'vg-btn-minimize';
const CLASS_NAME_MINIMIZED_CONTAINER = 'vg-modal-minimized-container';
const CLASS_NAME_MINIMIZED_ITEM = 'vg-modal-minimized';

const EVENT_KEY_MINIMIZE = `${NAME_KEY}.minimize`;
const EVENT_KEY_MINIMIZED = `${NAME_KEY}.minimized`;
const EVENT_KEY_RESTORE = `${NAME_KEY}.restore`;
const EVENT_KEY_RESTORED = `${NAME_KEY}.restored`;

class VGModalMinimized {
	constructor(modal) {
		this._modal = modal;
		this._element = modal._element;
		this._dialog = modal._dialog;
		this._content = modal._content;
		this._minimizedElement = null;
		this._isMinimized = false;
	}

	setup() {
		const minimizeConfig = this._getConfig();
		if (!minimizeConfig.enable || !this._content) return;
		if (Selectors.find(`.${CLASS_NAME_MINIMIZE_BUTTON}`, this._content)) return;

		const button = document.createElement('button');
		button.type = 'button';
		button.className = CLASS_NAME_MINIMIZE_BUTTON;
		button.setAttribute('aria-label', minimizeConfig.label || 'Minimize');
		button.innerHTML = '<span aria-hidden="true"></span>';

		const closeButton = Selectors.find('.vg-btn-close', this._content);
		if (closeButton && closeButton.parentNode) {
			closeButton.parentNode.insertBefore(button, closeButton);
		} else {
			this._content.prepend(button);
		}

		EventHandler.on(button, `click.${NAME_KEY}.minimize`, (event) => {
			event.preventDefault();
			this.minimize(button);
		});
	}

	isMinimized() {
		return this._isMinimized;
	}

	minimize(relatedTarget) {
		if (!this._getConfig().enable || !this._modal._isShown || this._isMinimized || this._modal._isTransitioning) return;

		const minimizeEvent = EventHandler.trigger(this._element, EVENT_KEY_MINIMIZE, { relatedTarget });
		if (minimizeEvent.defaultPrevented) return;

		this._isMinimized = true;
		this._modal._disableInteractionHandlers();
		this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.classList.add(CLASS_NAME_MINIMIZED);
		this._element.style.display = 'none';
		this._element.removeAttribute('aria-modal');
		this._element.removeAttribute('role');

		const remainingOpenModals = Selectors.findAll(OPEN_SELECTOR).filter(modal => modal !== this._element);
		if (!remainingOpenModals.length) {
			document.body.classList.remove(CLASS_NAME_OPEN);
		}

		const finish = () => {
			if (!Backdrop.isActive()) {
				this._modal._scrollBar.reset();
			}

			this._ensureElement(relatedTarget);
			EventHandler.trigger(this._element, EVENT_KEY_MINIMIZED, { relatedTarget });
		};

		if (this._modal._backdropElement) {
			this._modal._hideBackdrop(finish);
			return;
		}

		finish();
	}

	restore(relatedTarget) {
		if (!this._isMinimized || this._modal._isTransitioning) return;

		const restoreEvent = EventHandler.trigger(this._element, EVENT_KEY_RESTORE, { relatedTarget });
		if (restoreEvent.defaultPrevented) return;

		const restoreElement = () => {
			this.removeElement();
			this._isMinimized = false;
			this._element.classList.remove(CLASS_NAME_MINIMIZED);
			this._element.style.display = 'block';
			this._element.setAttribute('aria-modal', true);
			this._element.setAttribute('role', 'dialog');
			document.body.classList.add(CLASS_NAME_OPEN);

			reflow(this._element);
			this._element.classList.add(CLASS_NAME_SHOW);
			this._modal._toggleInteractionHandlers();
			this._modal._syncInteractiveBounds();
			EventHandler.trigger(this._element, EVENT_KEY_RESTORED, { relatedTarget });
		};

		if (this._modal._params.backdrop) {
			this._modal._scrollBar.hide();
			this._modal._showBackdrop(restoreElement);
			return;
		}

		restoreElement();
	}

	reset() {
		this.removeElement();
		this._isMinimized = false;
		this._element.classList.remove(CLASS_NAME_MINIMIZED);
	}

	dispose() {
		this.removeElement();
	}

	_getConfig() {
		const value = this._modal._params.minimize;
		const defaults = {
			enable: false,
			title: '',
			text: '',
			label: 'Minimize',
		};

		if (typeof value === 'boolean') {
			return {...defaults, enable: value};
		}

		if (value && typeof value === 'object') {
			const hasEnable = Object.prototype.hasOwnProperty.call(value, 'enable');
			return {
				...defaults,
				...value,
				enable: hasEnable ? Boolean(value.enable) : true,
			};
		}

		return defaults;
	}

	_ensureElement(relatedTarget) {
		if (this._minimizedElement && this._minimizedElement.isConnected) return this._minimizedElement;

		const minimizeConfig = this._getConfig();
		const container = VGModalMinimized.getContainer();
		const button = document.createElement('button');
		button.type = 'button';
		button.className = CLASS_NAME_MINIMIZED_ITEM;
		button.setAttribute('data-vg-modal-target', `#${this._element.id}`);

		const title = document.createElement('span');
		title.className = `${CLASS_NAME_MINIMIZED_ITEM}__title`;
		title.textContent = this._getTitle(minimizeConfig);
		button.append(title);

		const text = String(minimizeConfig.text || '').trim();
		if (text) {
			const description = document.createElement('span');
			description.className = `${CLASS_NAME_MINIMIZED_ITEM}__text`;
			description.textContent = text;
			button.append(description);
		}

		EventHandler.on(button, `click.${NAME_KEY}.restore`, (event) => {
			event.preventDefault();
			this.restore(button || relatedTarget);
		});

		container.append(button);
		this._minimizedElement = button;
		return button;
	}

	_getTitle(minimizeConfig) {
		const configuredTitle = String(minimizeConfig.title || '').trim();
		if (configuredTitle) return configuredTitle;

		const titleElement = Selectors.find('.vg-modal-title, .vg-modal-chat__name, [data-vg-modal-title]', this._element);
		const title = String(titleElement ? titleElement.textContent : '').trim();
		return title || this._element.id || 'Modal';
	}

	removeElement() {
		if (this._minimizedElement) {
			this._minimizedElement.remove();
			this._minimizedElement = null;
		}

		const container = Selectors.find(`.${CLASS_NAME_MINIMIZED_CONTAINER}`);
		if (container && !container.children.length) {
			container.remove();
		}
	}

	static getContainer() {
		let container = Selectors.find(`.${CLASS_NAME_MINIMIZED_CONTAINER}`);
		if (container) return container;

		container = document.createElement('div');
		container.className = CLASS_NAME_MINIMIZED_CONTAINER;
		document.body.append(container);
		return container;
	}
}

export default VGModalMinimized;
