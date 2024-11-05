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
const NAME = 'sidebar';
const NAME_KEY = 'vg.sidebar';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="sidebar"]'

const EVENT_KEY_HIDE = 'vg.sidebar.hide';
const EVENT_KEY_HIDDEN = 'vg.sidebar.hidden';
const EVENT_KEY_SHOW = 'vg.sidebar.show';
const EVENT_KEY_SHOWN = 'vg.sidebar.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';
const EVENT_KEY_KEYDOWN_DISMISS = 'keydown.dismiss.vg.sidebar';
const EVENT_KEY_HIDE_PREVENTED = 'hidePrevented.vg.sidebar';
const EVENT_KEY_CLICK_DATA_API = 'click.vg.sidebar.data.api';

const PARAMS_DEFAULT =  {
	button: null,
	backdrop: true,
	overflow: true,
	keyboard: true,
	ajax: {
		route: '',
		target: ''
	}
};

class VGSidebar extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);
		this._addEventListeners();
		this._route();
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

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		if (_this.params.backdrop) {
			Backdrop.show();
		}

		if (_this.params.overflow) {
			Overflow.append();
		}

		if (relatedTarget) {
			relatedTarget.setAttribute('aria-expanded', true);
		}

		_this.element.classList.add(CLASS_NAME_SHOW);

		const completeCallBack = () => {
			EventHandler.on(Selectors.findOne('.vg-backdrop'), 'mousedown.vg.backdrop', function () {
				_this.hide();
			});

			EventHandler.trigger(this.element, EVENT_KEY_SHOWN, { relatedTarget });
		}
		this._queueCallback(completeCallBack, this.element, true)
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

		const completeCallback = () => EventHandler.trigger(this.element, EVENT_KEY_HIDDEN);
		this._queueCallback(completeCallback, this.element, true);
	}

	_isShown() {
		return this.element.classList.contains(CLASS_NAME_SHOW);
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

dismissTrigger(VGSidebar)


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

	EventHandler.one(target, EVENT_KEY_HIDDEN, () => {
		this.setAttribute('aria-expanded', false);
	})

	const alreadyOpen = Selectors.findOne('.vg-sidebar.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGSidebar.getInstance(alreadyOpen).hide()
	}

	const data = VGSidebar.getOrCreateInstance(target)
	data.toggle(this)
})

export default VGSidebar;
