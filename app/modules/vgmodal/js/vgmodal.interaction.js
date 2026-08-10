import Selectors from "../../../utils/js/dom/selectors";
import VGModalDrag from "./vgmodal.drag";
import VGModalResize from "./vgmodal.resize";

const DEFAULTS = {
	drag: {
		enable: false,
		selector: '.vg-modal-content',
		threshold: 4,
		resizeEdgeSize: 8,
		debug: false,
	},
	resize: {
		enable: false,
		edgeSize: 8,
		minWidth: 300,
		minHeight: 160,
		debug: false,
	},
};

class VGModalInteraction {
	constructor(modalElement, dialogElement, contentElement, getParams) {
		this._modalElement = modalElement;
		this._dialogElement = dialogElement;
		this._contentElement = contentElement;
		this._getParams = typeof getParams === 'function' ? getParams : () => ({});
		this._dragHandler = new VGModalDrag(this._modalElement, this._dialogElement);
		this._resizeHandler = new VGModalResize(this._modalElement, this._dialogElement);
		this._config = this._resolveConfig();

		this._bindHandlers();
	}

	toggleHandlers() {
		this._config = this._resolveConfig();
		this._bindHandlers();

		if (this._config.drag.enable) {
			this._dragHandler.enable();
		} else {
			this._dragHandler.disable();
		}

		if (this._config.resize.enable) {
			this._resizeHandler.enable();
		} else {
			this._resizeHandler.disable();
		}
	}

	disableHandlers() {
		this._dragHandler.disable();
		this._resizeHandler.disable();
	}

	syncBounds() {
		if (this._config.resize.enable) {
			this._resizeHandler.syncToViewport();
		}

		if (this._config.drag.enable) {
			this._dragHandler.syncPosition();
		}
	}

	saveState() {
		const stateConfig = this._getStateConfig();
		const storageKey = this._getStateStorageKey(stateConfig);
		if (!stateConfig.enable || !storageKey || typeof window === 'undefined' || !window.localStorage) return;

		try {
			window.localStorage.setItem(storageKey, JSON.stringify(this._captureState()));
		} catch (error) {
		}
	}

	restoreState() {
		const stateConfig = this._getStateConfig();
		const storageKey = this._getStateStorageKey(stateConfig);
		if (!stateConfig.enable || !storageKey || typeof window === 'undefined' || !window.localStorage) return false;

		try {
			const rawState = window.localStorage.getItem(storageKey);
			if (!rawState) return false;

			const parsedState = JSON.parse(rawState);
			this._applyState(parsedState);
			return true;
		} catch (error) {
			return false;
		}
	}

	dispose() {
		this.disableHandlers();
	}

	_bindHandlers() {
		this._dragHandler.setOptions(this._config.drag);
		this._resizeHandler.setOptions(this._config.resize);
	}

	_resolveConfig() {
		const params = this._getParams();

		return {
			drag: this._normalizeInteractionParams(params.drag, DEFAULTS.drag),
			resize: this._normalizeInteractionParams(params.resize, DEFAULTS.resize),
		};
	}

	_normalizeInteractionParams(paramsValue, defaults) {
		if (typeof paramsValue === 'boolean') {
			return {...defaults, enable: paramsValue};
		}

		if (paramsValue && typeof paramsValue === 'object') {
			const hasEnable = Object.prototype.hasOwnProperty.call(paramsValue, 'enable');
			return {
				...defaults,
				...paramsValue,
				enable: hasEnable ? Boolean(paramsValue.enable) : true,
			};
		}

		return {...defaults};
	}

	_getStateConfig() {
		const params = this._getParams();
		return this._normalizeStateParams(params.state);
	}

	_normalizeStateParams(paramsValue, defaults = { enable: true, key: '' }) {
		if (typeof paramsValue === 'boolean') {
			return {...defaults, enable: paramsValue};
		}

		if (paramsValue && typeof paramsValue === 'object') {
			const hasEnable = Object.prototype.hasOwnProperty.call(paramsValue, 'enable');
			const key = typeof paramsValue.key === 'string' ? paramsValue.key.trim() : '';
			return {
				...defaults,
				...paramsValue,
				key,
				enable: hasEnable ? Boolean(paramsValue.enable) : true,
			};
		}

		return {...defaults};
	}

	_getStateStorageKey(stateConfig = this._getStateConfig()) {
		if (!stateConfig.enable) return '';

		if (typeof stateConfig.key === 'string' && stateConfig.key.trim()) {
			return stateConfig.key.trim();
		}

		if (!this._modalElement || !this._modalElement.id) return '';

		return `vg.modal.state:${window.location.pathname}:${this._modalElement.id}`;
	}

	_captureState() {
		const dialogStyle = this._dialogElement ? this._dialogElement.style : null;
		const contentElement = this._contentElement || Selectors.find('.vg-modal-content', this._dialogElement);
		const contentStyle = contentElement ? contentElement.style : null;

		return {
			dialog: dialogStyle ? {
				position: dialogStyle.position,
				margin: dialogStyle.margin,
				left: dialogStyle.left,
				top: dialogStyle.top,
				width: dialogStyle.width,
				height: dialogStyle.height,
				transform: dialogStyle.transform,
				maxWidth: dialogStyle.maxWidth,
				maxHeight: dialogStyle.maxHeight,
				minHeight: dialogStyle.minHeight,
				overflow: dialogStyle.overflow,
				pointerEvents: dialogStyle.pointerEvents,
				transition: dialogStyle.transition,
				willChange: dialogStyle.willChange,
			} : {},
			content: contentStyle ? {
				height: contentStyle.height,
				maxHeight: contentStyle.maxHeight,
				overflow: contentStyle.overflow,
			} : {},
		};
	}

	_applyState(state) {
		if (!state || typeof state !== 'object') return;

		const dialogState = state.dialog && typeof state.dialog === 'object' ? state.dialog : {};
		const contentState = state.content && typeof state.content === 'object' ? state.content : {};
		if (this._dialogElement) {
			Object.keys(dialogState).forEach(propertyName => {
				this._dialogElement.style[propertyName] = dialogState[propertyName] || '';
			});
		}

		const contentElement = this._contentElement || Selectors.find('.vg-modal-content', this._dialogElement);
		if (contentElement) {
			Object.keys(contentState).forEach(propertyName => {
				contentElement.style[propertyName] = contentState[propertyName] || '';
			});
		}
	}
}

export default VGModalInteraction;
