import BaseModule from "../../base-module";
import ScrollBarHelper from "../../../utils/js/components/scrollbar";
import Backdrop from "../../../utils/js/components/backdrop";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import {execute, isDisabled, isRTL, mergeDeepObject, reflow} from "../../../utils/js/functions";
import {dismissTrigger} from "../../module-fn";
import Params from "../../../utils/js/components/params";

/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';

const ESCAPE_KEY = 'Escape';

const OPEN_SELECTOR = '.vg-modal.show';
const SELECTOR_DIALOG = '.vg-modal-dialog';
const SELECTOR_MODAL_BODY = '.vg-modal-body';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="modal"]';

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
const EVENT_KEY_MOUSEDOWN_DISMISS   = `mousedown.dismiss${NAME_KEY}`
const EVENT_KEY_CLICK_DISMISS           = `click.dismiss${NAME_KEY}`

class VGModal extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			backdrop: true,
			focus: true,
			keyboard: true,
			fields: [],
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false
			},
			animation: {
				enable: false,
				in: 'animate__rollIn',
				out: 'animate__rollOut',
				delay: 800,
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
		this._isShown = false;
		this._isTransitioning = false;
		this._scrollBar = new ScrollBarHelper();

		this._addEventListeners();
		this._dismissElement();

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGModal.NAME_KEY, this._params.animation);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static init(element, params, callback) {
		VGModal.build(element, params, callback);
	}

	static build(id, params, callback) {
		if (typeof id !== "string") return;

		let _element = document.createElement('div');
		_element.classList.add('vg-modal', 'fade');
		_element.id = id;let dialog = document.createElement('div');
		dialog.classList.add('vg-modal-dialog');

		let content = document.createElement('div');
		content.classList.add('vg-modal-content');

		let btnClose = document.createElement('button');
		Manipulator.set(btnClose, 'type', 'button');
		Manipulator.set(btnClose, 'data-vg-dismiss', 'modal');
		Manipulator.set(btnClose, 'data-vg-target', '#' + id);
		Manipulator.set(btnClose, 'aria-label', 'close');
		btnClose.classList.add('vg-btn-close');

		content.append(btnClose);

		let body = document.createElement('div');
		body.classList.add('vg-modal-body');

		content.append(body);
		dialog.append(content);
		_element.append(dialog);

		document.body.append(_element);

		const modal = VGModal.getOrCreateInstance(_element, params);

		execute(callback, [modal]);
	}

	toggle(relatedTarget) {
		return !this._isShown ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		const _this = this;
		if (isDisabled(_this._element)) return;

		this._params = this._getParams(relatedTarget, this._params);
		_this._route(function (status, data) {
			EventHandler.trigger(_this._element, EVENT_KEY_LOADED, {stats: status, data: data});
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		this._isShown = true;
		this._isTransitioning = true;

		this._scrollBar.hide();

		document.body.classList.add(CLASS_NAME_OPEN);

		this._addFieldsInModal(relatedTarget);
		this._adjustDialog();

		Backdrop.show(() => this._showElement(relatedTarget));
	}

	hide(openedModals = []) {
		if (!this._isShown || this._isTransitioning) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._isShown = false;
		this._isTransitioning = true;

		setTimeout(() => {
			this._element.classList.remove(CLASS_NAME_SHOW);
			this._queueCallback(() => this._hideModal(openedModals), this._element, this._isAnimatedFade());
		}, this._params.animation.delay);
	}

	_hideModal(openedModals) {
		this._element.style.display = 'none';
		this._element.setAttribute('aria-hidden', true);
		this._element.removeAttribute('aria-modal');
		this._element.removeAttribute('role');
		this._isTransitioning = false;

		if (openedModals.length) return;

		Backdrop.hide(() => {
			document.body.classList.remove(CLASS_NAME_OPEN);
			this._resetAdjustments();
			this._scrollBar.reset();

			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
		})
	}

	_showElement(relatedTarget) {
		if (!document.body.contains(this._element)) {
			document.body.append(this._element);
		}

		this._element.style.display = 'block';
		this._element.removeAttribute('aria-hidden');
		this._element.setAttribute('aria-modal', true);
		this._element.setAttribute('role', 'dialog');
		this._element.scrollTop = 0;

		const modalBody = Selectors.find(SELECTOR_MODAL_BODY, this._dialog);
		if (modalBody) {
			modalBody.scrollTop = 0;
		}

		reflow(this._element);

		this._element.classList.add(CLASS_NAME_SHOW)

		const transitionComplete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, {
				relatedTarget
			});
		}

		this._queueCallback(transitionComplete, this._dialog, this._isAnimatedFade())
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
		EventHandler.on(this._element, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== ESCAPE_KEY) return;

			if (this._params.keyboard) {
				this.hide();
				return;
			}

			this._triggerBackdropTransition();
		});

		EventHandler.on(window, EVENT_KEY_RESIZE, () => {
			if (this._isShown && !this._isTransitioning) this._adjustDialog();
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

		this._params.fields.forEach(function (item) {
			if (!'name' in item && !'value' in item) return;

			let elements = Selectors.findAll('[data-' + item.name + ']');
			if (!elements.length) return;

			for (const elm of elements) {
				switch (elm.tagName) {
					case 'INPUT': elm.value = item.value; break;
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
	if (alreadyOpen) VGModal.getInstance(alreadyOpen).hide([alreadyOpen]);

	const data = VGModal.getOrCreateInstance(target);
	data.toggle(this);
})

export default VGModal;