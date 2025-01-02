import BaseModule from "../../base-module";
import Selectors from "../../../_utils/js/selectors";
import Backdrop from "../../../_utils/js/backdrop";
import Overflow from "../../../_utils/js/overflow";
import EventHandler from "../../../_utils/js/event";
import {isDisabled} from "../../../_utils/js/functions";
import {dismissTrigger} from "../../../_utils/js/module-fn";

/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade'
const SELECTOR_DIALOG = '.vg-modal-dialog'
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="modal"]'

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;


const PARAMS_DEFAULT =  {
	button: null,
	backdrop: true,
	overflow: true,
	keyboard: true,
	ajax: {
		route: '',
		target: '',
		method: 'get'
	}
};

class VGModal extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._dialog = Selectors.findOne(SELECTOR_DIALOG, this.element)

		this._addEventListeners();
		this._dismissElement();
	}

	static get Default() {
		return PARAMS_DEFAULT
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
		if (isDisabled(_this.element)) return;

		//this._route();

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		if (_this.params.backdrop) {
			Backdrop.show();
		}

		if (_this.params.overflow) {
			Overflow.append();
		}

		if (this._isAnimated()) {
			this.element.classList.add(CLASS_NAME_FADE);
		}

		_this.element.classList.add(CLASS_NAME_SHOW);

		const completeCallBack = () => {
			EventHandler.on(_this.element, 'mousedown.vg.modal', function (event) {
				const modalContent = Selectors.get('.vg-modal-content', this);
				if (!modalContent.contains(event.target)) {
					_this.hide();
				}
			});

			EventHandler.trigger(this.element, EVENT_KEY_SHOWN, { relatedTarget });
		}
		this._queueCallback(completeCallBack, this.element, true, 50)
	}

	hide() {
		const _this = this;
		if (isDisabled(_this.element)) return;

		const hideEvent = EventHandler.trigger(this.element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		if (_this.params.backdrop) {
			Backdrop.hide(function () {
				if (_this.params.overflow) {
					Overflow.destroy();
				}
			});
		}

		if (_this.params.overflow) {
			Overflow.destroy();
		}

		_this.element.setAttribute('aria-expanded', false);
		_this.element.classList.remove(CLASS_NAME_SHOW);

		const completeCallback = () => {
			if (this._isAnimated()) {
				this.element.classList.remove(CLASS_NAME_FADE);
			}

			EventHandler.trigger(this.element, EVENT_KEY_HIDDEN);
		};

		this._queueCallback(completeCallback, this.element, this._isAnimated());
	}

	_isShown() {
		return this.element.classList.contains(CLASS_NAME_SHOW);
	}

	_isAnimated() {
		return this.element.classList.contains(CLASS_NAME_FADE)
	}

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== 'Escape') {
				return
			}

			if (this.params.keyboard) {
				this.hide()
				return
			}

			EventHandler.trigger(this.element, EVENT_KEY_HIDE_PREVENTED)
		})
	}
}

dismissTrigger(VGModal)


/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getTargetFromSelector(this);

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
