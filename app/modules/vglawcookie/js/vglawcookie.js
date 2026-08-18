import BaseModule from "../../base-module";
import { isDisabled, mergeDeepObject } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import Cookies from "../../../utils/js/dom/cookie";
import { dismissTrigger } from "../../module-fn";

/**
 * Constants
 */
const NAME = 'lawcookie';
const NAME_KEY = 'vg.lawcookie';

const CLASS_NAME_SHOW = 'show';

const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="lawcookie"]';
const SELECTOR_DATA_TOGGLE_CLEAR = '[data-vg-toggle="lawcookie-clear"]';
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGLawCookie extends BaseModule {

	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			storage: 'local', // 'cookie' или 'local'
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
				method: 'get',
				loader: false,
				once: false,
				output: true,
			}
		}, params));

		// Инициализация хранилища сразу в конструкторе
		this._storage = this._createStorage();

		// Настройка анимации
		this._params.animation.delay = this._params.animation.enable ? this._params.animation.delay : 0;
		this._animation(this._element, VGLawCookie.NAME_KEY, this._params.animation);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Проверяет, было ли дано согласие
	 * @returns {boolean}
	 * @private
	 */
	_isConsented() {
		return this._storage.get() === this._params.cookie.value;
	}

	/**
	 * Переключает отображение: показать, если ещё нет согласия
	 */
	toggle() {
		return this._isConsented() ? this.hide() : this.show();
	}

	/**
	 * Показать баннер
	 */
	show() {
		if (isDisabled(this._element) || this._isConsented()) return;

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW);
		if (showEvent.defaultPrevented) return;

		this._element.classList.add(CLASS_NAME_SHOW);

		const completeCallback = () => {
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN);
		};

		this._queueCallback(completeCallback, this._element, true, this._params.delay);
	}

	/**
	 * Скрыть баннер и сохранить согласие
	 */
	hide() {
		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_SHOW);

		const completeCallback = () => {
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
		};

		this._queueCallback(completeCallback, this._element, true, this._params.animation.delay);
	}

	/**
	 * Создаёт объект хранилища с унифицированным API
	 * @returns {{get: () => string|null, set: () => void}}
	 * @private
	 */
	_createStorage() {
		const { name, value, attributes } = this._params.cookie;

		if (this._params.storage === 'cookie') {
			return {
				get: () => Cookies.get(name),
				set: () => Cookies.set(name, value, attributes)
			};
		} else {
			return {
				get: () => localStorage.getItem(name),
				set: () => localStorage.setItem(name, value)
			};
		}
	}

	/**
	 * Сохраняет согласие
	 */
	accept() {
		this._storage.set();
	}

	/**
	 * Сбрасывает согласие, не затрагивая остальные данные хранилища
	 */
	static reset() {
		const { name } = VGLawCookie.getDefaultParams().cookie;

		Cookies.remove(name);
		localStorage.removeItem(name);
		location.reload();
	}

	/**
	 * Возвращает дефолтные параметры (для доступа без инстанса)
	 */
	static getDefaultParams() {
		return mergeDeepObject({
			cookie: { name: 'lawCookie' }
		}, {});
	}

	dispose() {
		const { name } = this._params.cookie;

		Cookies.remove(name);
		localStorage.removeItem(name);
		super.dispose();
	}

	/**
	 * Инициализация модуля
	 * @param {Element} element
	 * @param {Object} params
	 */
	static init(element, params = {}) {
		const instance = VGLawCookie.getOrCreateInstance(element, params);
		instance.toggle();
	}
}

// Подключение поведения закрытия через триггер
dismissTrigger(VGLawCookie);

// Обработка кнопки принятия согласия
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}

	if (isDisabled(this)) return;

	const element = Selectors.find('#vg-lawcookie');
	if (!element) return;

	const instance = VGLawCookie.getOrCreateInstance(element);
	instance.accept(); // Сохраняем согласие
	instance.hide();   // Скрываем баннер
});

// Обработка кнопки сброса
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CLEAR, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}

	if (isDisabled(this)) return;

	const element = Selectors.find('#vg-lawcookie');
	if (!element) return;

	const instance = VGLawCookie.getOrCreateInstance(element);
	instance.dispose();
	VGLawCookie.reset(); // Сброс согласия
});

export default VGLawCookie;
