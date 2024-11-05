import BaseModule from "../../base-module";
import Selectors from "../../../_utils/js/selectors";
import Backdrop from "../../../_utils/js/backdrop";
import Overflow from "../../../_utils/js/overflow";
import EventHandler from "../../../_utils/js/event";
import {isDisabled} from "../../../_utils/js/functions";

const NAME             = 'vgSidebar';
const NAME_KEY         = 'vg.sidebar';
const CLASS_NAME_SHOW  = 'show';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="sidebar"]'
const PARAMS_DEFAULT =  {
	backdrop: true,
	overflow: true,
	keyboard: false, // todo not done
	scroll: false, // todo not done
	ajax: {
		route: '',
		target: ''
	}
};

const EVENT_KEY_CLICK_DATA_API = 'vg.sidebar.click.api';
const EVENT_KEY_HIDE = 'vg.sidebar.hide';
const EVENT_KEY_HIDDEN = 'vg.sidebar.hidden';
const EVENT_KEY_SHOW = 'vg.sidebar.show';
const EVENT_KEY_SHOWN = 'vg.sidebar.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';

class VGSidebar extends BaseModule {
	constructor(element, arg = {}) {
		super(element, arg);
		this._container = null;
		this.container = Selectors.getTargetFromSelector(this.element);
	}

	get container() {
		return this._container
	}

	set container(target) {
		this._container = target;
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
			Backdrop.show(function () {
				if (_this.params.overflow) {
					Overflow.append();
				}
			});
		}

		_this.element.setAttribute('aria-expanded', true);
		_this.container.classList.add(CLASS_NAME_SHOW);

		const completeCallBack = () => {
			EventHandler.on(Selectors.findOne('.vg-backdrop'), 'mousedown.vg.backdrop', function () {
				_this.hide();
			});

			EventHandler.trigger(this.container, EVENT_KEY_SHOWN, { relatedTarget });
		}
		this._queueCallback(completeCallBack, this.container, true)
	}

	hide() {
		const _this = this;
		if (isDisabled(_this.element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		if (_this.params.backdrop) {
			Backdrop.hide(function () {
				if (_this.params.overflow) {
					Overflow.destroy();
				}
			});
		}

		_this.element.setAttribute('aria-expanded', false);
		_this.container.classList.remove(CLASS_NAME_SHOW);

		const completeCallback = () => EventHandler.trigger(this.element, EVENT_KEY_HIDDEN);
		this._queueCallback(completeCallback, this.element, true);
	}

	_isShown() {
		return this.container.classList.contains(CLASS_NAME_SHOW);
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getTargetFromSelector(this);

	console.log(event)

	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) {
		return
	}

	const alreadyOpen = Selectors.findOne('.vg-sidebar.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGSidebar.getInstance(alreadyOpen).hide()
	}

	const data = VGSidebar.getOrCreateInstance(target)
	data.toggle(this)
})

export default VGSidebar;
