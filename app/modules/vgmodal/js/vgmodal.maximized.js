/**
 * Описание: опциональная кнопка полноэкранного режима VGModal.
 * Возможности: переключает класс и иконку, сохраняет геометрию и приостанавливает drag/resize.
 */
import EventHandler from "../../../utils/js/dom/event";

const FULLSCREEN_CLASS = 'vg-modal-fullscreen';
const CLICK_EVENT = 'click.vg.modal.maximize';
const EXPAND_ICON = '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>';
const CONTRACT_ICON = '<path d="M9 4v5H4m11-5v5h5M4 15h5v5m11-5h-5v5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>';

class VGModalMaximized {
	constructor(modal) {
		this._modal = modal;
		this._button = null;
		this._initialFullscreen = this.isMaximized();
	}

	setup() {
		const config = this._getConfig();
		if (!config.enable || !this._modal._content) {
			if (this._button) this._button.hidden = true;
			return;
		}

		if (!this._button) {
			this._button = document.createElement('button');
			this._button.type = 'button';
			this._button.className = 'vg-btn-maximize';
			const closeButton = this._modal._content.querySelector('.vg-btn-close');
			if (closeButton) {
				closeButton.before(this._button);
			} else {
				this._modal._content.prepend(this._button);
			}
			EventHandler.on(this._button, CLICK_EVENT, event => {
				event.preventDefault();
				this._modal.toggleMaximize(this._button);
			});
		}
		this._button.hidden = false;
		this._syncButton();
	}

	isMaximized() {
		return Boolean(this._modal._dialog?.classList.contains(FULLSCREEN_CLASS));
	}

	setMaximized(maximized, relatedTarget) {
		if (!this._getConfig().enable || !this._modal._isShown || this._modal._isTransitioning
			|| this._modal._minimized.isMinimized() || this.isMaximized() === maximized) return;

		const action = maximized ? 'maximize' : 'unmaximize';
		const event = EventHandler.trigger(this._modal._element, `vg.modal.${action}`, {relatedTarget});
		if (event.defaultPrevented) return;

		if (maximized) {
			// Отключение обработчиков снимает их служебные стили; сохраняем текущую геометрию.
			const dialogStyles = this._modal._dialog.style.cssText;
			const contentStyles = this._modal._content.style.cssText;
			this._modal._disableInteractionHandlers();
			this._modal._dialog.style.cssText = dialogStyles;
			this._modal._content.style.cssText = contentStyles;
		}
		this._modal._dialog.classList.toggle(FULLSCREEN_CLASS, maximized);
		if (!maximized) {
			this._modal._toggleInteractionHandlers();
			this._modal._syncInteractiveBounds();
		}
		this._syncButton();
		EventHandler.trigger(this._modal._element, `vg.modal.${action}d`, {relatedTarget});
	}

	dispose() {
		if (this._button) {
			EventHandler.off(this._button, CLICK_EVENT);
			this._button.remove();
			this._button = null;
		}
		this._modal._dialog?.classList.toggle(FULLSCREEN_CLASS, this._initialFullscreen);
	}

	_getConfig() {
		const value = this._modal._params.maximize;
		return value && typeof value === 'object' ? {enable: true, ...value} : {enable: Boolean(value)};
	}

	_syncButton() {
		if (!this._button) return;
		const maximized = this.isMaximized();
		const config = this._getConfig();
		const label = maximized ? (config.restoreLabel || 'Уменьшить окно') : (config.label || 'На весь экран');
		this._button.setAttribute('aria-label', label);
		this._button.setAttribute('title', label);
		this._button.setAttribute('aria-pressed', String(maximized));
		this._button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${maximized ? CONTRACT_ICON : EXPAND_ICON}</svg>`;
	}
}

export default VGModalMaximized;
