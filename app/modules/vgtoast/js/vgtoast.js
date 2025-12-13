import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {execute, isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'toast';
const NAME_KEY = 'vg.toast';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="toast"]';

const CLASS_NAME_OPEN    = 'vg-toast-open';
const CLASS_NAME_SHOW    = 'show';
const CLASS_NAME_SHOWN   = 'shown';

const EVENT_KEY_HIDE     = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN   = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW     = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN    = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED   = `${NAME_KEY}.loaded`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED  = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API  = `click.${NAME_KEY}.data.api`;

const defaultParams = {
	static: true,
	placement: 'bottom center',
	autohide: false,
	delay: 3000,
	enableClickToast: true,
	enableButtonClose: false,
	keyboard: true,
	theme: 'dark',
	stack: {
		enable: true,
		max: 5
	},
	animation: {
		enable: true,
		in: 'animate__backInUp',
		out: 'animate__backOutDown',
		delay: 300,
	},
	ajax: {
		route: '',
		target: '',
		method: 'get',
		loader: false,
		once: false,
		output: true,
	}
};

class VGToast extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));
		this._animation(this._element, VGToast.NAME_KEY, this._params.animation);
		this._dismissElement();
		this._addEventListeners();

		this._timeout = null;
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	static run(text, params = {}, callback) {
		return VGToast.build(text, params, callback);
	}

	static build(text, params, callback) {
		params = mergeDeepObject(defaultParams, {static: false, autohide: true}, params);

		let target = document.createElement('div');
		target.classList.add('vg-toast');
		target.id = 'vg-toast-' + makeRandomString();

		if ('theme' in params) {
			target.classList.add('vg-toast-' + params.theme);
		}

		if ('placement' in params) {
			params.placement.split(' ').forEach(val => target.classList.add(val));
		}

		let wrapper = document.createElement('div');
		wrapper.classList.add('vg-toast-wrapper');

		if ('type' in params) {
			let icon = document.createElement('div');
			icon.classList.add('vg-toast-icon');

			wrapper.append(icon);
		}

		let content = document.createElement('div');
		content.classList.add('vg-toast-content');

		let body = document.createElement('div');
		body.classList.add('vg-toast-body');

		if (typeof text === 'string') {
			body.innerHTML = text;
			content.append(body);
		} else if (Array.isArray(text)) {
			if (text.length > 1) {
				let header = document.createElement('div');
				header.classList.add('vg-toast-header');
				header.innerHTML = text[0];
				content.append(header);

				body.innerHTML = text[1];
				content.append(body);
			} else {
				body.innerHTML = text[0];
				content.append(body);
			}
		}

		wrapper.append(content);

		if ('enableButtonClose' in params && params.enableButtonClose) {
			let button = document.createElement('div');
			button.classList.add('vg-toast-button');
			button.innerHTML = '<button class="vg-btn-close" data-vg-dismiss="toast"></button>';
			wrapper.append(button);
		}

		target.append(wrapper);
		document.body.append(target);

		let instance =  VGToast.getOrCreateInstance(target, params);
		if ('animation' in params) {
			instance._animation(target, VGToast.NAME_KEY, params.animation);
		}

		execute(callback, [instance]);
		instance.show();
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		this._clearTimeout();

		this._params = this._getParams(relatedTarget || {}, this._params);
		this._route(function (status, data) {
			EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		this._element?.classList.remove(CLASS_NAME_SHOW);

		this._element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		this._setPlacement();

		const completeCallBack = () => {
			this._element.classList.add(CLASS_NAME_SHOWN);
			this._scheduleHide();
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		}
		this._queueCallback(completeCallBack, this._element, true, this._params.animation.delay);
	}

	hide() {
		if (isDisabled(this._element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._element?.classList.remove(CLASS_NAME_SHOWN);

		setTimeout(() => {
			this._element?.classList.remove(CLASS_NAME_SHOW);

			const completeCallback = () => {
				document.body.classList.remove(CLASS_NAME_OPEN);
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);

				if (this._params.stack.enable) {
					this._setPlacement();
				}

				if (!this._params.static) {
					this.dispose();
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

		if (!this._params.static) {
			this._element.remove();
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

		if (this._params.stack.enable) {
			if (elms.length > this._params.stack.max) {
				let elm = elms.shift();
				VGToast.getInstance(elm.el).hide();
			}
		}

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
					elm.el.style.left = 'calc(50% - ('+ elm.el.clientWidth +'px) / 2)';
					elm.el.style.bottom = elm.top + 'px';
				} else if (isPlacementClassTop) {
					elm.el.style.left = 'calc(50% - ('+ elm.el.clientWidth +'px) / 2)';
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

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== 'Escape') return;

			if (this._params.keyboard) {
				this.hide();
				return;
			}

			EventHandler.trigger(this._element, EVENT_KEY_HIDE_PREVENTED)
		});

		if (this._params.enableClickToast) {
			this._element.classList.add('vg-toast-pointer');

			EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, '#' + this._element.id, () => {
				this.hide();
			})
		}
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
