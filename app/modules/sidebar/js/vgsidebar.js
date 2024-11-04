import BaseModule from "../../base-module";
import Selectors from "../../../_utils/js/selectors";
import Backdrop from "../../../_utils/js/backdrop";
import Overflow from "../../../_utils/js/overflow";
import EventHandler from "../../../_utils/js/event";
import {isDisabled} from "../../../_utils/js/functions";

const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
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

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE)
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

		const completeCallback = () => {
			EventHandler.trigger(this.element, EVENT_KEY_HIDDEN)
		}
		this._queueCallback(completeCallback, this.element, true)
	}

	_isShown() {
		console.log(this.container)
		return this.container.classList.contains(CLASS_NAME_SHOW)
	}

	static makeInit(btn) {
		btn.addEventListener('click', () => {
			let sidebar = VGSidebar.getOrCreateInstance(btn, {});
			sidebar.toggle();

			return false;
		});
	}
}

export default VGSidebar;
