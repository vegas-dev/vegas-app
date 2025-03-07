import BaseModule from "../../base-module";
import {isDisabled, mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import Cookies from "../../../utils/js/dom/cookie";
import {dismissTrigger} from "../../module-fn";

/**
 * Constants
 */
const NAME     = 'lawcookie';
const NAME_KEY = 'vg.lawcookie';

const CLASS_NAME_SHOW = 'show';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const SELECTOR_DATA_TOGGLE       = '[data-vg-toggle="lawcookie"]';
const SELECTOR_DATA_TOGGLE_CLEAR = '[data-vg-toggle="lawcookie-clear"]';
const EVENT_KEY_CLICK_DATA_API   = `click.${NAME_KEY}.data.api`;

class VGLawCookie extends BaseModule {
	static sParams = {};

	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			storage: 'local', // cookie or local
			delay: 500,
			cookie: {
				name: 'lawCookie',
				value: 'yes',
				attributes: {}
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
				method: 'get'
			}
		}, params));

		VGLawCookie.sParams = this._params;

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGLawCookie.NAME_KEY, this._params.animation);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	toggle() {
		return !this._isShown() ? this.show() : this.hide();
	}

	_isShown() {
		return this.storage().get();
	}

	show() {
		if (isDisabled(this._element)) return;

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, {})
		if (showEvent.defaultPrevented) return;

		this._element.classList.add(CLASS_NAME_SHOW);

		const completeCallBack = () => {
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, {});
		}
		this._queueCallback(completeCallBack, this._element, true, this._params.delay)
	}

	hide() {
		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		setTimeout(() => {
			this._element.classList.remove(CLASS_NAME_SHOW);

			const completeCallback = () => EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
			this._queueCallback(completeCallback, this._element, true);
		}, this._params.animation.delay);
	}

	storage() {
		this._storage = {
			isCookie: this._params.storage === 'cookie',
			storage: this._params.storage === 'cookie' ? Cookies : localStorage,
			name: this._params.cookie.name,
			value: this._params.cookie.value,
			attributes: this._params.cookie.attributes,
		}

		return this;
	}

	get() {
		if (this._storage.isCookie) {
			return this._storage.storage.get(this._storage.name);
		} else {
			return this._storage.storage.getItem(this._storage.name);
		}
	}

	set() {
		if (this._storage.isCookie) {
			this._storage.storage.set(this._storage.name, this._storage.value, this._storage.attributes);
		} else {
			this._storage.storage.setItem(this._storage.name, this._storage.value);
		}
	}

	dispose() {
		super.dispose();
	}

	static reset() {
		Cookies.remove(VGLawCookie.sParams.cookie.name);
		localStorage.clear();
		location.reload();
	}

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 */
	static init(element, params = {}) {
		const instance = VGLawCookie.getOrCreateInstance(element, params);
		instance.toggle();
	}
}

dismissTrigger(VGLawCookie);

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) return;

	const element = Selectors.find('#vg-lawcookie');
	if (!element) return;

	const instance = VGLawCookie.getOrCreateInstance(element);
	instance.storage().set();
	instance.hide();
});

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CLEAR, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) return;

	const element = Selectors.find('#vg-lawcookie');
	if (!element) return;

	const instance = VGLawCookie.getOrCreateInstance(element);
	instance.dispose();

	location.reload();
});

export default VGLawCookie;