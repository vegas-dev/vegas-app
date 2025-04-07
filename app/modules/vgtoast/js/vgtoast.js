import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {isDisabled, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'toast';
const NAME_KEY = 'vg.toast';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="toast"]';

const CLASS_NAME_OPEN    = 'vg-toast-open';
const CLASS_NAME_SHOWING = 'showing';
const CLASS_NAME_SHOW    = 'show';

const EVENT_KEY_HIDE     = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN   = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW     = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN    = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED   = `${NAME_KEY}.loaded`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGToast extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			autohide: false,
			delay: 5000,
			stack: {
				enable: true,
				max: 5
			},
			animation: {
				enable: true,
				in: 'animate__fadeInUp',
				out: 'animate__fadeOutDown',
				delay: 800,
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
			}
		}, params));

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGToast.NAME_KEY, this._params.animation);
		this._dismissElement();

		this._timeout = null;
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	init(element) {

	}

	build() {

	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		this._clearTimeout();

		this._params = this._getParams(relatedTarget, this._params);
		this._route(function (status, data) {
			EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		this._element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		this._setPlacement();

		const completeCallBack = () => {
			this._element.classList.add(CLASS_NAME_SHOW);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
			this._scheduleHide();
		}
		this._queueCallback(completeCallBack, this._element, true, 0);
	}

	hide() {
		if (isDisabled(this._element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		setTimeout(() => {
			this._element.setAttribute('aria-expanded', false);
			this._element.classList.remove(CLASS_NAME_SHOW);

			const completeCallback = () => {
				document.body.classList.remove(CLASS_NAME_OPEN);
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);

				if (this._params.stack.enable) {
					this._setPlacement();
				}
			}
			this._queueCallback(completeCallback, this._element, false, this._params.animation.delay);
		}, this._params.animation.delay);
	}

	dispose() {
		this._clearTimeout();
		if (this._isShown()) {
			this._element.classList.remove(CLASS_NAME_SHOW);
		}

		super.dispose();
	}

	_scheduleHide() {
		if (!this._params.autohide) {
			return;
		}

		this._timeout = setTimeout(() => {
			this.hide();
		}, this._params.delay);
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_setPlacement() {
		let elms = this._enableStack();
		//const elSizes = [this._element.clientWidth, this._element.clientHeight + stackSize];

		elms.forEach(elm => {
			let isPlacementClassTop = elm.el.classList.contains('top'),
				isPlacementClassBottom = elm.el.classList.contains('bottom'),
				isPlacementClassLeft = elm.el.classList.contains('left'),
				isPlacementClassRight = elm.el.classList.contains('right'),
				isPlacementClassCenter = elm.el.classList.contains('center');

			if (!isPlacementClassTop &&
				!isPlacementClassBottom &&
				!isPlacementClassCenter &&
				!isPlacementClassRight &&
				!isPlacementClassLeft
			) {
				isPlacementClassBottom = true;
				isPlacementClassCenter = true;
			}

			if (isPlacementClassCenter) {
				if (isPlacementClassLeft) {
					elm.el.style.left = 0;
					elm.el.style.bottom = 'calc(50% - ('+ elm.top +'px))';
				} else if (isPlacementClassRight) {
					elm.el.style.right = 0;
					elm.el.style.bottom = 'calc(50% - ('+ elm.top +'px))';
				} else if (isPlacementClassBottom) {
					elm.el.style.left = 'calc(50% - ('+ elm.el.clientHeight +'px) / 2)';
					elm.el.style.bottom = elm.top + 'px';
				} else if (isPlacementClassTop) {
					elm.el.style.left = 'calc(50% - ('+ elm.el.clientHeight +'px) / 2)';
					elm.el.style.top = elm.top + 'px';
				} else {
					elm.el.style.left = 'calc(50% - ('+ elm.el.clientHeight +'px) / 2)';
					elm.el.style.bottom = 'calc(50% - '+ elm.top +'px)';
				}
			} else {
				if (isPlacementClassLeft) elm.el.style.left = 0;
				if (isPlacementClassBottom) elm.el.style.bottom = elm.top + 'px';
				if (isPlacementClassTop) elm.el.style.top = elm.top + 'px';
				if (isPlacementClassRight) elm.el.style.right = 0;
			}
		});
	}

	_enableStack() {
		let elmsShown = [... Selectors.findAll('.vg-toast.show')], top = 0;

		if (!this._params.stack.enable) {
			elmsShown.forEach(el => {
				if (el !== this._element) {
					VGToast.getInstance(el).hide()
				}
			})

			return [{
				el: this._element,
				top: 0,
			}];
		}

		elmsShown = elmsShown.map(el => {
			return {
				el: el,
				top: el.clientHeight
			}
		});

		return elmsShown.map(function (value, index) {
			if (index === 0) {
				return {
					el: value.el,
					top: 0
				}
			} else {
				top += value.top

				return {
					el: value.el,
					top: top
				}
			}
		});
	}

	_clearTimeout() {
		clearTimeout(this._timeout);
		this._timeout = null;
	}
}

dismissTrigger(VGToast);

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
	});

	const data = VGToast.getOrCreateInstance(target);
	data.toggle(this);
});

export default VGToast;
