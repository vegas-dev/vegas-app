import BaseModule from "../../base-module";
import {isDisabled, isVisible, mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import Selectors from "../../../utils/js/dom/selectors";
import Backdrop from "../../../utils/js/components/backdrop";
import Overflow from "../../../utils/js/components/overflow";

/**
 * Constants
 */
const NAME = 'sidebar';
const NAME_KEY = 'vg.sidebar';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="sidebar"]';

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_OPEN = 'vg-sidebar-open';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGSidebar extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			backdrop: true,
			overflow: true,
			keyboard: true,
			animation: {
				enable: false,
				in: 'animate__rollIn',
				out: 'animate__rollOut',
				delay: 800,
			},
			ajax: {
				route: '',
				target: '',
				method: 'get'
			}
		}, params));

		this._addEventListeners();
		this._dismissElement();

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGSidebar.NAME_KEY, this._params.animation);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		const _this = this;
		if (isDisabled(_this._element)) return;

		_this._params = _this._getParams(relatedTarget, _this._params);
		_this._route();

		const showEvent = EventHandler.trigger(_this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		if (_this._params.backdrop) {
			Backdrop.show();
		}

		if (_this._params.overflow) {
			Overflow.append();
		}

		_this._element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		const completeCallBack = () => {
			EventHandler.on(Selectors.find('.vg-backdrop'), 'mousedown.vg.backdrop', function () {
				_this.hide();
			});

			EventHandler.trigger(_this._element, EVENT_KEY_SHOWN, { relatedTarget });
		}
		_this._queueCallback(completeCallBack, _this._element, true, 50)
	}

	hide() {
		const _this = this;
		if (isDisabled(_this._element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		setTimeout(() => {
			_this._element.setAttribute('aria-expanded', false);
			_this._element.classList.remove(CLASS_NAME_SHOW);

			const completeCallback = () => {
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

				document.body.classList.remove(CLASS_NAME_OPEN);
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
			}
			this._queueCallback(completeCallback, this._element, true);
		}, this._params.animation.delay);
	}

	dispose() {
		super.dispose();
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== 'Escape') return;

			if (this._params.keyboard) {
				this.hide();
				return;
			}

			EventHandler.trigger(this._element, EVENT_KEY_HIDE_PREVENTED)
		});
	}
}

dismissTrigger(VGSidebar);

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
		//if (isVisible(this)) this.focus();
		this.setAttribute('aria-expanded', false);
	})

	const alreadyOpen = Selectors.find('.vg-sidebar.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGSidebar.getInstance(alreadyOpen).hide()
	}

	const data = VGSidebar.getOrCreateInstance(target)
	data.toggle(this);
});

export default VGSidebar;
