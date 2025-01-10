import BaseModule from "../../base-module";
import {dismissTrigger} from "../../module-fn";
import Selectors from "../../../utils/js/dom/selectors";
import Backdrop from "../../../utils/js/components/backdrop";
import Overflow from "../../../utils/js/components/overflow";
import EventHandler from "../../../utils/js/dom/event";
import {isDisabled, mergeDeepObject} from "../../../utils/js/functions";

/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade'
const SELECTOR_DIALOG = '.vg-modal-dialog'
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
			}
		}, params));

		this._dialog = Selectors.findOne(SELECTOR_DIALOG, this._element)

		this._addEventListeners();
		this._dismissElement();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
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

		if (this._isAnimated()) {
			this._element.classList.add(CLASS_NAME_FADE);
		}

		_this._element.classList.add(CLASS_NAME_SHOW);

		const completeCallBack = () => {
			EventHandler.on(_this._element, 'mousedown.vg.modal', function (event) {
				const modalContent = Selectors.get('.vg-modal-content', this);
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

		const completeCallback = () => {
			if (this._isAnimated()) {
				this._element.classList.remove(CLASS_NAME_FADE);
			}

			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
		};

		this._queueCallback(completeCallback, this._element, this._isAnimated());
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_isAnimated() {
		return this._element.classList.contains(CLASS_NAME_FADE)
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

	const alreadyOpen = Selectors.findOne('.vg-modal.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGModal.getInstance(alreadyOpen).hide()
	}

	const data = VGModal.getOrCreateInstance(target)
	data.toggle(this)
})

export default VGModal;
