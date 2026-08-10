import BaseModule from "../../base-module";
import ScrollBarHelper from "../../../utils/js/components/scrollbar";
import Backdrop from "../../../utils/js/components/backdrop";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import {execute, isDisabled, isRTL, mergeDeepObject, reflow} from "../../../utils/js/functions";
import {dismissTrigger} from "../../module-fn";
import VGModalInteraction from "./vgmodal.interaction";
import VGModalMinimized from "./vgmodal.minimized";

/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';

const ESCAPE_KEY = 'Escape';

const OPEN_SELECTOR = '.vg-modal.show:not([data-vg-persistent="true"])';
const SELECTOR_DIALOG = '.vg-modal-dialog';
const SELECTOR_MODAL_BODY = '.vg-modal-body';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="modal"]';
const BACKDROP_OWNER_ATTR = 'data-vg-backdrop-owner';
const BACKDROP_OWNER_VALUE = 'modal';

const CLASS_NAME_OPEN = 'vg-modal-open';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_STATIC = 'vg-modal-static';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;
const EVENT_KEY_RESIZE = `${NAME_KEY}.resize`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

const EVENT_KEY_KEYDOWN_DISMISS     = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED      = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API      = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_MOUSEDOWN_DISMISS   = `mousedown.dismiss${NAME_KEY}`;
const EVENT_KEY_CLICK_DISMISS       = `click.dismiss${NAME_KEY}`;
const EVENT_KEY_BACKDROP_DISMISS    = `mousedown.${NAME_KEY}.backdrop`;
const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_POPSTATE_DATA_API   = `popstate.${NAME_KEY}.data.api`;

class VGModal extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			backdrop: true,
			persistent: false,
			focus: true,
			keyboard: true,
			fields: [],
			hash: false,
			centered: false,
			dismiss: true,
			minimize: {
				enable: false,
				title: '',
				text: '',
			},
			resize: {
				enable: false,
				edgeSize: 8,
				minWidth: 300,
				minHeight: 160,
				debug: false,
			},
			state: {
				enable: true,
				key: '',
			},
			drag: {
				enable: false,
				selector: '.vg-modal-content',
				threshold: 4,
				resizeEdgeSize: 8,
				debug: false,
			},
			sizes: {
				width: '',
				height: '',
			},
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
				in: 'animate__rollIn',
				out: 'animate__rollOut',
				delay: 100,
				duration: 800,
			},
			classes: {
				general: 'vg-modal',
				dialog: 'vg-modal-dialog',
				content: 'vg-modal-content',
				header: 'vg-modal-header',
				title: 'vg-modal-title',
				body: 'vg-modal-body',
				footer: 'vg-modal-footer',
			}
		}, params));

		this._button = null;
		this._dialog = Selectors.find(SELECTOR_DIALOG, this._element);
		this._content = Selectors.find('.vg-modal-content', this._dialog);
		this._isShown = false;
		this._isTransitioning = false;
		this._scrollBar = new ScrollBarHelper();
		this._backdropElement = null;
		this._isBackdropOwner = false;
		this._interaction = new VGModalInteraction(this._element, this._dialog, this._content, () => this._params);
		this._minimized = new VGModalMinimized(this);

		this._addEventListeners();
		this._dismissElement();
		this._minimized.setup();

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGModal.NAME_KEY, this._params.animation);
		if (this._params.persistent) {
			this._element.setAttribute('data-vg-persistent', 'true');
		} else {
			this._element.removeAttribute('data-vg-persistent');
		}
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static init(element, params = {}, callback) {
		return VGModal.build(element, params, callback);
	}

	static initAll(params = {}) {
		return Selectors.findAll('.vg-modal').map((element) => {
			return VGModal.getOrCreateInstance(element, params);
		});
	}

	static build(id, params = {}, callback) {
		if (typeof id !== "string") return;
		if (!params || typeof params !== 'object') {
			params = {};
		}

		const existed = document.getElementById(id);
		if (existed) {
			const modal = VGModal.getOrCreateInstance(existed, params);
			execute(callback, [modal]);
			return modal;
		}

		let _element = document.createElement('div');
		_element.classList.add('vg-modal');
		_element.classList.add('fade');
		_element.id = id;

		let dialog = document.createElement('div');
		dialog.classList.add('vg-modal-dialog');

		if (params.centered) {
			dialog.classList.add('vg-modal-dialog-centered');
		}

		let content = document.createElement('div');
		content.classList.add('vg-modal-content');

		const hasDismiss = !Object.prototype.hasOwnProperty.call(params, 'dismiss') || params.dismiss;
		if (hasDismiss) {
			let btnClose = document.createElement('button');
			Manipulator.set(btnClose, 'type', 'button');
			Manipulator.set(btnClose, 'data-vg-dismiss', 'modal');
			Manipulator.set(btnClose, 'data-vg-target', '#' + id);
			Manipulator.set(btnClose, 'aria-label', 'close');
			btnClose.classList.add('vg-btn-close');

			content.append(btnClose);
		}

		if (params.title) {
			let header = document.createElement('div');
			header.classList.add('vg-modal-header');

			let title = document.createElement('div');
			title.classList.add('vg-modal-title');
			VGModal._appendBuildContent(title, params.title, Boolean(params.html || params.titleHtml));

			header.append(title);
			content.append(header);
		}

		let body = document.createElement('div');
		body.classList.add('vg-modal-body');
		const bodyContent = Object.prototype.hasOwnProperty.call(params, 'body')
			? params.body
			: (Object.prototype.hasOwnProperty.call(params, 'content') ? params.content : null);
		VGModal._appendBuildContent(body, bodyContent, Boolean(params.html || params.bodyHtml || params.contentHtml));

		content.append(body);

		if (Object.prototype.hasOwnProperty.call(params, 'footer')) {
			let footer = document.createElement('div');
			footer.classList.add('vg-modal-footer');
			VGModal._appendBuildContent(footer, params.footer, Boolean(params.html || params.footerHtml));
			content.append(footer);
		}

		dialog.append(content);
		_element.append(dialog);

		document.body.append(_element);

		const modal = VGModal.getOrCreateInstance(_element, params);
		if ('animation' in params) {
			modal._animation(_element, VGModal.NAME_KEY, params.animation);
		}

		if ('sizes' in modal._params && modal._params.sizes.width) {
			_element.style.setProperty('--vg-modal-width', modal._params.sizes.width);
		}

		if ('sizes' in modal._params && modal._params.sizes.height) {
			dialog.style.height = modal._params.sizes.height;
		}

		execute(callback, [modal]);

		return modal;
	}

	static _appendBuildContent(target, content, isHTML = false) {
		if (!target || content === null || content === undefined) return;

		if (Array.isArray(content)) {
			content.forEach(item => VGModal._appendBuildContent(target, item, isHTML));
			return;
		}

		if (content instanceof Node) {
			target.append(content);
			return;
		}

		if (isHTML) {
			target.insertAdjacentHTML('beforeend', String(content));
			return;
		}

		target.append(document.createTextNode(String(content)));
	}

	toggle(relatedTarget) {
		if (this._minimized.isMinimized()) {
			return this.restore(relatedTarget);
		}

		return !this._isShown ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;
		if (this._minimized.isMinimized()) {
			return this.restore(relatedTarget);
		}
		if (this._isShown || this._isTransitioning) return;

		if (this._params.ajax.route && this._params.ajax.target && !this._params.ajax.once) {
			const ajaxTargetContent = Selectors.find(this._params.ajax.target, this._element);
			if (ajaxTargetContent) ajaxTargetContent.innerHTML = '';
		}

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		this._isShown = true;
		this._isTransitioning = true;

		if (this._params.hash) {
			if (window.location.hash !== `#${this._element.id}`) {
				window.history.pushState(null, "vg-modal-open", "#" + this._element.id);
			}

			EventHandler.on(window, EVENT_KEY_POPSTATE_DATA_API, () => {
				this.hide();
			});
		}

		if (this._params.backdrop) {
			this._scrollBar.hide();
		}

		document.body.classList.add(CLASS_NAME_OPEN);

		this._addFieldsInModal(relatedTarget);
		this._adjustDialog();

		if (this._params.backdrop) {
			this._showBackdrop(() => this._showElement(relatedTarget));
			return;
		}

		this._showElement(relatedTarget);
	}

	minimize(relatedTarget) {
		return this._minimized.minimize(relatedTarget);
	}

	restore(relatedTarget) {
		return this._minimized.restore(relatedTarget);
	}

	hide(openedModals = [], isLeaveBackDrop = false) {
		if (!this._isShown || this._isTransitioning) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._isShown = false;
		this._isTransitioning = true;

		setTimeout(() => {
			this._element.classList.remove(CLASS_NAME_SHOW);
			this._queueCallback(() => this._hideModal(openedModals, isLeaveBackDrop), this._element, this._isAnimatedFade());
		}, this._params.animation.delay);
	}

	_hideModal(openedModals, isLeaveBackDrop) {
		if (!isLeaveBackDrop) {
			this._saveInteractionState();
			this._disableInteractionHandlers();
			this._minimized.reset();
			this._element.style.display = 'none';
			this._element.removeAttribute('aria-modal');
			this._element.removeAttribute('role');
			this._isTransitioning = false;

			const remainingOpenModals = Selectors.findAll(OPEN_SELECTOR).filter(modal => modal !== this._element);
			if (remainingOpenModals.length || openedModals.length) {
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
				return;
			}

			document.body.classList.remove(CLASS_NAME_OPEN);

			if (this._params.hash) {
				history.pushState("", document.title, window.location.pathname + window.location.search);
			}

			if (!this._params.backdrop) {
				this._resetAdjustments();
				if (!Backdrop.isActive()) {
					this._scrollBar.reset();
				}

				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
				return;
			}

			this._hideBackdrop(() => {
				this._resetAdjustments();
				if (!Backdrop.isActive()) {
					this._scrollBar.reset();
				}

				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
			})
		}
	}

	dispose() {
		this._minimized.dispose();
		this._interaction.dispose();
		super.dispose();
	}

	_showElement(relatedTarget) {
		if (!document.body.contains(this._element)) {
			document.body.append(this._element);
		}

		this._element.style.display = 'block';
		this._element.setAttribute('aria-modal', true);
		this._element.setAttribute('role', 'dialog');
		this._element.scrollTop = 0;

		const modalBody = Selectors.find(SELECTOR_MODAL_BODY, this._dialog);
		if (modalBody) {
			modalBody.scrollTop = 0;
		}

		reflow(this._element);

		this._element.classList.add(CLASS_NAME_SHOW);
		this._toggleInteractionHandlers();

		const transitionComplete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, {
				relatedTarget
			});
			this._syncInteractiveBounds();

			this._params = this._getParams(relatedTarget, this._params);
			this._restoreInteractionState();
			this._syncInteractiveBounds();
			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data, relatedTarget: relatedTarget});
				this._syncInteractiveBounds();
			});
		}

		this._queueCallback(transitionComplete, this._dialog, this._isAnimatedFade())
	}

	_showBackdrop(callback) {
		const activeBackdrop = Backdrop.getElement();
		const activeBackdropOwner = activeBackdrop ? activeBackdrop.getAttribute(BACKDROP_OWNER_ATTR) : '';
		if (activeBackdrop && activeBackdropOwner !== 'sidebar') {
			if (!activeBackdropOwner) {
				activeBackdrop.setAttribute(BACKDROP_OWNER_ATTR, BACKDROP_OWNER_VALUE);
			}

			this._backdropElement = activeBackdrop;
			this._isBackdropOwner = true;
			this._bindBackdropDismiss(activeBackdrop);
			execute(callback);
			return;
		}

		Backdrop.show((backdrop) => {
			this._backdropElement = backdrop;
			this._isBackdropOwner = true;
			if (backdrop) {
				backdrop.setAttribute(BACKDROP_OWNER_ATTR, BACKDROP_OWNER_VALUE);
			}
			this._bindBackdropDismiss(backdrop);
			execute(callback);
		});
	}

	_hideBackdrop(callback) {
		if (!this._backdropElement || !this._isBackdropOwner) {
			this._backdropElement = null;
			this._isBackdropOwner = false;
			execute(callback);
			return;
		}

		Backdrop.hide(() => {
			this._backdropElement = null;
			this._isBackdropOwner = false;
			execute(callback);
		}, this._backdropElement);
	}

	_bindBackdropDismiss(backdrop) {
		if (!backdrop) return;

		EventHandler.off(backdrop, EVENT_KEY_BACKDROP_DISMISS);
		EventHandler.one(backdrop, EVENT_KEY_BACKDROP_DISMISS, () => {
			if (this._params.backdrop === 'static') {
				this._triggerBackdropTransition();
				return;
			}

			this.hide();
		});
	}

	_toggleInteractionHandlers() {
		this._interaction.toggleHandlers();
	}

	_disableInteractionHandlers() {
		this._interaction.disableHandlers();
	}

	_syncInteractiveBounds() {
		this._interaction.syncBounds();
	}

	_saveInteractionState() {
		this._interaction.saveState();
	}

	_restoreInteractionState() {
		return this._interaction.restoreState();
	}

	_isAnimatedFade() {
		return this._element.classList.contains(CLASS_NAME_FADE)
	}

	_adjustDialog() {
		const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight
		const scrollbarWidth = this._scrollBar.getWidth()
		const isBodyOverflowing = scrollbarWidth > 0

		if (isBodyOverflowing && !isModalOverflowing) {
			const property = isRTL() ? 'paddingLeft' : 'paddingRight'
			this._element.style[property] = `${scrollbarWidth}px`
		}

		if (!isBodyOverflowing && isModalOverflowing) {
			const property = isRTL() ? 'paddingRight' : 'paddingLeft'
			this._element.style[property] = `${scrollbarWidth}px`
		}
	}

	_resetAdjustments() {
		this._element.style.paddingLeft = ''
		this._element.style.paddingRight = ''
	}

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== ESCAPE_KEY) return;

			if (this._params.keyboard) {
				this.hide();
				return;
			}

			this._triggerBackdropTransition();
		});

		EventHandler.on(window, EVENT_KEY_RESIZE, () => {
			if (this._isShown && !this._isTransitioning) {
				this._adjustDialog();
				this._syncInteractiveBounds();
			}
		});

		EventHandler.on(this._element, EVENT_KEY_MOUSEDOWN_DISMISS, event => {
			EventHandler.one(this._element, EVENT_KEY_CLICK_DISMISS, event2 => {
				if (this._element !== event.target || this._element !== event2.target) return;

				if (this._params.backdrop === 'static') {
					this._triggerBackdropTransition();
					return;
				}

				if (this._params.backdrop) {
					this.hide();
				}
			})
		});
	}

	_triggerBackdropTransition() {
		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
		if (hideEvent.defaultPrevented) return;

		const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
		const initialOverflowY = this._element.style.overflowY;

		if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) return;
		if (!isModalOverflowing) this._element.style.overflowY = 'hidden';

		this._element.classList.add(CLASS_NAME_STATIC);

		this._queueCallback(() => {
			this._element.classList.remove(CLASS_NAME_STATIC);
			this._queueCallback(() => {
				this._element.style.overflowY = initialOverflowY;
			}, this._dialog);
		}, this._dialog);
	}

	_addFieldsInModal(relatedTarget) {
		this._params = this._getParams(relatedTarget, this._params);

		if (!this._params.fields.length) return;

		this._params.fields.forEach((item) => {
			if (!'name' in item && !'value' in item) return;

			let elements = Selectors.findAll('[data-' + item.name + ']', this._element);
			if (!elements.length) return;

			for (const elm of elements) {
				switch (elm.tagName) {
					case 'INPUT': elm.value = item.value; break;
					case 'FORM': elm.action = item.value; break;
					case 'IMG': Manipulator.set(elm, 'src', item.value); break;
					default: elm.innerHTML = item.value;
				}
			}
		});
	}
}

dismissTrigger(VGModal);


/**
 * Data API implementation
 */
	EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
		const target = Selectors.getElementFromSelector(this);

	if (['A', 'AREA'].includes(this.tagName)) event.preventDefault();

		EventHandler.one(target, EVENT_KEY_SHOW, showEvent => {
			if (showEvent.defaultPrevented) return;
		});

		const alreadyOpen = Selectors.find(OPEN_SELECTOR);
		if (alreadyOpen) {
			const alreadyOpenInstance = VGModal.getInstance(alreadyOpen);
			if (alreadyOpenInstance && !alreadyOpenInstance._params.persistent) {
				alreadyOpenInstance.hide([alreadyOpen]);
			}
		}

		const data = VGModal.getOrCreateInstance(target);
		data.toggle(this);
	});

const showModalFromHash = () => {
	let targetHash = window.location.hash.slice(1);
	if (!targetHash) return;

	try {
		targetHash = decodeURIComponent(targetHash);
	} catch (error) {
		return;
	}

	const target = Selectors.findID(targetHash);
	if (!target || !target.classList.contains('vg-modal') || isDisabled(target)) {
		return;
	}

	const data = VGModal.getOrCreateInstance(target);
	if (!data._params.hash || data._isShown) {
		return;
	}

	data.show();
};

if (document.readyState === 'loading') {
	EventHandler.on(document, EVENT_KEY_DOM_LOADED_DATA_API, showModalFromHash);
} else {
	showModalFromHash();
}

window.addEventListener('hashchange', showModalFromHash);

export default VGModal;
