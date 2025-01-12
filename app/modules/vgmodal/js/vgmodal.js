import BaseModule from "../../base-module";
import {dismissTrigger} from "../../module-fn";
import Selectors from "../../../utils/js/dom/selectors";
import Backdrop from "../../../utils/js/components/backdrop";
import Overflow from "../../../utils/js/components/overflow";
import EventHandler from "../../../utils/js/dom/event";
import {execute, isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import {Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="modal"]'

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED  = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API  = `click.${NAME_KEY}.data.api`;

class VGModal extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			button: null,
			backdrop: true,
			overflow: true,
			keyboard: true,
			ajax: {
				route: '',
				target: '',
				method: 'get'
			},
			animation: {
				name: 'animate__backInUp',
				duration: '1s',
				delay: '1s',
				repeat: 1
			},
			classes: {
				general: 'vg-modal',
				dialog: 'vg-modal-dialog',
				content: 'vg-modal-content',
				header: 'vg-modal-header',
				title: 'vg-modal-title',
				body: 'vg-modal-body',
				footer: 'vg-modal-footer',
				animated: 'animate__animated'
			}
		}, params));

		this._addEventListeners();
		this._dismissElement();
		this._dismissElement();
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
		_element.classList.add('vg-modal');
		_element.id = id;let dialog = document.createElement('div');
		dialog.classList.add('vg-modal-dialog', 'vg-modal-dialog-centered');

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
		_element.classList.add(modal._params.animation.name)

		execute(callback, [modal]);
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		const _this = this;
		if (isDisabled(_this._element)) return;

		//this._route();

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		if (_this._params.backdrop) {
			Backdrop.show();
		}

		if (_this._params.overflow) {
			Overflow.append();
		}

		_this._element.classList.add(CLASS_NAME_SHOW);
		_this._element.classList.add(_this._params.classes.animated);

		const completeCallBack = () => {
			EventHandler.on(_this._element, 'mousedown.vg.modal', function (event) {
				const modalContent = Selectors.find('.' + _this._params.classes.content, this);
				if (!modalContent.contains(event.target)) {
					_this.hide();
				}
			});

			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		}
		this._queueCallback(completeCallBack, this._element, true, 50)
	}

	hide() {
		const _this = this;
		if (isDisabled(_this._element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		if (_this._params.backdrop) {
			Backdrop.hide(function () {
				if (_this._params.overflow) {
					Overflow.destroy();
				}
			});
		}

		if (_this._params.overflow) {
			Overflow.destroy();
		}

		_this._element.setAttribute('aria-expanded', false);
		_this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.classList.remove(_this._params.classes.animated);

		const completeCallback = () => {
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
		};

		this._queueCallback(completeCallback, this._element, this._isAnimated());
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== 'Escape') {
				return
			}

			if (this._params.keyboard) {
				this.hide()
				return
			}

			EventHandler.trigger(this._element, EVENT_KEY_HIDE_PREVENTED)
		})
	}
}

dismissTrigger(VGModal)


/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getElementFromSelector(this);

	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) {
		return
	}

	this.setAttribute('aria-expanded', true);

	EventHandler.one(target, EVENT_KEY_HIDDEN, () => {
		this.setAttribute('aria-expanded', false);
	})

	const alreadyOpen = Selectors.find('.vg-modal.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGModal.getInstance(alreadyOpen).hide()
	}

	const data = VGModal.getOrCreateInstance(target)
	data.toggle(this)
})

export default VGModal;
