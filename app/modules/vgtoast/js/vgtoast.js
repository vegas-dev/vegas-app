import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {execute, isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * @constant {string} NAME - Имя модуля.
 */
const NAME = 'toast';

/**
 * @constant {string} NAME_KEY - Пространство имён для событий.
 */
const NAME_KEY = 'vg.toast';

/**
 * @constant {string} SELECTOR_DATA_TOGGLE - Селектор для активации через data-атрибут.
 */
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="toast"]';

/**
 * @constant {string} CLASS_NAME_OPEN - Класс, добавляемый к body при открытии любого тоста.
 */
const CLASS_NAME_OPEN = 'vg-toast-open';

/**
 * @constant {string} CLASS_NAME_SHOW - Класс, показывающий, что тост видим.
 */
const CLASS_NAME_SHOW = 'show';

/**
 * @constant {string} CLASS_NAME_SHOWN - Класс, добавляемый после завершения анимации появления.
 */
const CLASS_NAME_SHOWN = 'shown';

// События
const EVENT_KEY_HIDE     = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN   = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW     = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN    = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED   = `${NAME_KEY}.loaded`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED  = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API  = `click.${NAME_KEY}.data.api`;

/**
 * @typedef {Object} ToastParams
 * @property {boolean} static - Сохранять ли тост в DOM после скрытия.
 * @property {string} placement - Расположение: 'top left', 'bottom center' и т.д.
 * @property {boolean} autohide - Автоматически скрывать.
 * @property {number} delay - Задержка перед авто-скрытием (мс).
 * @property {boolean} enableClickToast - Закрывать по клику на тост.
 * @property {boolean} enableButtonClose - Добавить кнопку закрытия.
 * @property {boolean} keyboard - Закрывать по Esc.
 * @property {string} theme - Тема: 'dark', 'light' и т.д.
 * @property {Object} stack - Настройки стека уведомлений.
 * @property {boolean} stack.enable - Разрешить стек.
 * @property {number} stack.max - Макс. количество тостов одновременно.
 * @property {Object} animation - Анимация.
 * @property {boolean} animation.enable - Включить анимацию.
 * @property {string} animation.in - Анимация входа (Animate.css).
 * @property {string} animation.out - Анимация выхода.
 * @property {number} animation.delay - Длительность анимации.
 * @property {Object} ajax - Настройки AJAX.
 * @property {string} ajax.route - URL для загрузки.
 * @property {string} ajax.target - Селектор контейнера.
 * @property {string} ajax.method - HTTP-метод.
 * @property {boolean} ajax.loader - Показывать лоадер.
 * @property {boolean} ajax.once - Загружать один раз.
 * @property {boolean} ajax.output - Выводить результат.
 */

/**
 * Параметры по умолчанию
 * @type {ToastParams}
 */
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

/**
 * Класс VGToast — модуль уведомлений (тосты)
 * Поддерживает стек, анимации, авто-скрытие, AJAX-контент, горячие клавиши.
 */
class VGToast extends BaseModule {
	/**
	 * Создаёт экземпляр VGToast
	 * @param {Element} element - HTML-элемент тоста.
	 * @param {Partial<ToastParams>} params - Пользовательские параметры.
	 */
	constructor(element, params = {}) {
		super(element, params);

		/** @private */
		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));
		this._animation(this._element, VGToast.NAME_KEY, this._params.animation);
		this._dismissElement();
		this._addEventListeners();

		/** @private */
		this._timeout = null;
	}

	/**
	 * Имя модуля
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Пространство имён событий
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Глобальный метод для быстрого создания тоста
	 * @param {string|Array<string>} text - Текст или [заголовок, тело].
	 * @param {Partial<ToastParams>} [params] - Параметры.
	 * @param {Function} [callback] - Вызывается после создания.
	 * @returns {VGToast}
	 */
	static run(text, params = {}, callback) {
		return VGToast.build(text, params, callback);
	}

	/**
	 * Создаёт и показывает новый тост
	 * @param {string|Array<string>} text - Текст уведомления.
	 * @param {Partial<ToastParams>} [params] - Параметры.
	 * @param {Function} [callback] - Вызывается после появления.
	 * @returns {VGToast}
	 */
	static build(text, params, callback) {
		params = mergeDeepObject(defaultParams, { static: false, autohide: true }, params);

		const id = 'vg-toast-' + makeRandomString();
		const target = document.createElement('div');
		target.classList.add('vg-toast');
		target.id = id;

		// Тема
		if (params.theme) {
			target.classList.add(`vg-toast-${params.theme}`);
		}

		// Позиция
		if (params.placement) {
			params.placement.split(' ').forEach(cls => target.classList.add(cls));
		}

		const wrapper = document.createElement('div');
		wrapper.classList.add('vg-toast-wrapper');

		// Иконка (если задан тип)
		if (params.type) {
			const icon = document.createElement('div');
			icon.classList.add('vg-toast-icon');
			wrapper.append(icon);
		}

		const content = document.createElement('div');
		content.classList.add('vg-toast-content');

		const body = document.createElement('div');
		body.classList.add('vg-toast-body');

		if (typeof text === 'string') {
			body.innerHTML = text;
			content.append(body);
		} else if (Array.isArray(text)) {
			if (text.length > 1) {
				const header = document.createElement('div');
				header.classList.add('vg-toast-header');
				header.innerHTML = text[0];
				content.append(header);
			}
			body.innerHTML = text[1];
			content.append(body);
		}

		wrapper.append(content);

		// Кнопка закрытия
		if (params.enableButtonClose) {
			const button = document.createElement('div');
			button.classList.add('vg-toast-button');
			button.innerHTML = '<button class="vg-btn-close" data-vg-dismiss="toast"></button>';
			wrapper.append(button);
		}

		target.append(wrapper);
		document.body.append(target);

		const instance = VGToast.getOrCreateInstance(target, params);
		if (params.animation) {
			instance._animation(target, VGToast.NAME_KEY, params.animation);
		}

		execute(callback, [instance]);
		instance.show();

		return instance;
	}

	/**
	 * Переключает состояние (показать/скрыть)
	 * @param {Element} [relatedTarget] - Элемент, вызвавший тост.
	 * @returns {VGToast}
	 */
	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	/**
	 * Показывает тост
	 * @param {Element} [relatedTarget] - Элемент, инициировавший показ.
	 * @returns {void}
	 */
	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		this._clearTimeout();

		this._params = this._getParams(relatedTarget || {}, this._params);
		this._route((status, data) => {
			EventHandler.trigger(this._element, EVENT_KEY_LOADED, { stats: status, data });
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_SHOWN);
		this._element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		this._setPlacement();

		const completeCallBack = () => {
			this._element.classList.add(CLASS_NAME_SHOWN);
			this._scheduleHide();
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		};

		this._queueCallback(completeCallBack, this._element, true, this._params.animation.delay);
	}

	/**
	 * Скрывает тост
	 * @returns {void}
	 */
	hide() {
		if (isDisabled(this._element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_SHOWN);

		setTimeout(() => {
			this._element.classList.remove(CLASS_NAME_SHOW);

			const completeCallback = () => {
				document.body.classList.remove(CLASS_NAME_OPEN);
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);

				if (this._params.stack.enable) {
					this._setPlacement();
				}

				if (!this._params.static) {
					this.dispose();
				}
			};

			this._queueCallback(completeCallback, this._element, false, this._params.animation.delay);
		}, this._params.animation.delay);
	}

	/**
	 * Удаляет тост из DOM и снимает обработчики
	 * @override
	 */
	dispose() {
		this._clearTimeout();
		if (!this._params.static) {
			this._element.remove();
		}
		super.dispose();
	}

	/**
	 * Устанавливает таймер на скрытие
	 * @private
	 */
	_scheduleHide() {
		if (!this._params.autohide) return;

		this._timeout = setTimeout(() => this.hide(), this._params.delay);
	}

	/**
	 * Проверяет, показан ли тост
	 * @private
	 * @returns {boolean}
	 */
	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Возвращает список активных тостов с вертикальными смещениями
	 * Учитывает стек и максимальное количество
	 * @private
	 * @returns {Array<{el: Element, top: number}>}
	 */
	_enableStack() {
		const placement = this._params.placement;
		const isVerticalCenter = placement.includes('center');
		const isTop = placement.includes('top');
		const isBottom = !isTop; // по умолчанию снизу

		// Фильтруем тосты с таким же направлением (top или bottom)
		const stackClass = isTop ? 'top' : 'bottom';
		const elmsShown = Selectors.findAll(`.vg-toast.show.${stackClass}`)
			.filter(el => {
				const instance = VGToast.getInstance(el);
				return instance?._params.stack.enable;
			});

		if (!this._params.stack.enable) {
			// Скрываем другие тосты, если стек выключен
			elmsShown
				.filter(el => el !== this._element)
				.forEach(el => VGToast.getInstance(el).hide());
			return [{ el: this._element, top: 0 }];
		}

		// Ограничиваем по max
		if (elmsShown.length >= this._params.stack.max) {
			const excess = elmsShown.slice(0, elmsShown.length - this._params.stack.max + 1);
			excess.forEach(el => VGToast.getInstance(el).hide());
		}

		// Вычисляем смещение (по высоте)
		const prevEls = elmsShown.filter(el => el !== this._element);
		const offset = prevEls.reduce((sum, el) => sum + el.clientHeight, 0);

		return elmsShown.includes(this._element)
			? elmsShown.map((el, index) => {
				const heightSum = elmsShown.slice(0, index).reduce((sum, e) => sum + e.clientHeight, 0);
				return { el, top: heightSum };
			})
			: [{ el: this._element, top: offset }];
	}

	/**
	 * Устанавливает позицию тостов с учётом стека
	 * @private
	 */
	_setPlacement() {
		const elms = this._enableStack();
		const isCenter = this._params.placement.includes('center');
		const isLeft = this._params.placement.includes('left');
		const isRight = this._params.placement.includes('right');
		const isTop = this._params.placement.includes('top');

		const stackClass = isTop ? 'top' : 'bottom';

		elms.forEach(({ el, top }) => {
			const style = el.style;
			style.left = '';
			style.right = '';
			style.top = '';
			style.bottom = '';
			style.transform = '';

			if (isCenter) {
				style.left = '50%';
				style.transform = 'translateX(-50%)';
			} else if (isLeft) {
				style.left = '0';
			} else if (isRight) {
				style.right = '0';
			} else {
				// по умолчанию: центрирование
				style.left = '50%';
				style.transform = 'translateX(-50%)';
			}

			if (isTop) {
				style.top = top + 'px';
			} else {
				style.bottom = top + 'px';
			}
		});
	}

	/**
	 * Очищает таймер
	 * @private
	 */
	_clearTimeout() {
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	}

	/**
	 * Назначает обработчики событий
	 * @private
	 */
	_addEventListeners() {
		// Закрытие по Esc
		if (this._params.keyboard) {
			EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
				if (event.key === 'Escape' && this._isShown()) {
					this.hide();
				}
			});
		}

		// Закрытие по клику на тост
		if (this._params.enableClickToast) {
			this._element.classList.add('vg-toast-pointer');
			EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, `#${this._element.id}`, () => {
				this.hide();
			});
		}
	}
}

// Автоматическое закрытие по data-vg-dismiss
dismissTrigger(VGToast);

/**
 * Реализация Data API
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getElementFromSelector(this);
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}
	if (isDisabled(this)) return;

	this.setAttribute('aria-expanded', 'true');
	EventHandler.one(target, EVENT_KEY_HIDDEN, () => {
		this.setAttribute('aria-expanded', 'false');
	});

	const data = VGToast.getOrCreateInstance(target);
	data.toggle(this);
});

export default VGToast;