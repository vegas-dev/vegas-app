/**
 * Описание: сворачивание текста и списков VGRollup.
 * Возможности: ограничение высоты, строк и количества элементов, локализация кнопок, Data API, callbacks и события.
 */
import BaseModule from "../../base-module";
import { execute, isDisabled, mergeDeepObject } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {lang_buttons} from "../../../utils/js/components/lang";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * @class VGRollup
 * @extends BaseModule
 * @description
 * Модуль "Rollup" — реализует функционал сворачивания/разворачивания контента.
 * Поддерживает два режима: текст (ограничение по высоте) и элементы (ограничение по количеству).
 * Автоматически создаёт кнопку управления, если включена.
 *
 * @example
 * // Инициализация через JS
 * VGRollup.init(document.querySelector('.rollup'), {
 *   height: 100,
 *   button: {
 *     enabled: true,
 *     more: "Показать",
 *     less: "Свернуть"
 *   }
 * });
 *
 * // Инициализация через data-атрибут
 * // <div class="rollup" data-vg-rollup='{"height": 80, "button": {"more": "Еще"}}'>...</div>
 */

/**
 * Constants
 */
const NAME = 'rollup';
const NAME_KEY = 'vg.rollup';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_HIDE = 'vg-rollup-display--none';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="rollup"]';

const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGRollup extends BaseModule {

	/**
	 * @constructor
	 * @param {HTMLElement} element - Основной контейнер контента.
	 * @param {Object} params - Параметры конфигурации.
	 * @param {Object} [params.lang = 'ru'] - Локализация
	 * @param {string} [params.content='text'] - Режим: `'text'` (ограничение по высоте) или `'elements'` (по количеству).
	 * @param {number} [params.cnt=0] - Количество видимых элементов в режиме `'elements'`.
	 * @param {boolean} [params.fade=true] - Добавлять эффект затухания.
	 * @param {boolean} [params.transition=false] - Включить CSS-анимацию при переключении.
	 * @param {boolean} [params.number=false] - Показывать количество скрытых элементов.
	 * @param {number} [params.height=0] - Высота в px, до которой сворачивается текст.
	 * @param {Object} [params.ellipsis] - Настройки для многоточия.
	 * @param {number|null} [params.ellipsis.line=null] - Количество строк перед обрезкой (только для `display: -webkit-box`).
	 * @param {string} [params.more=' еще '] - Текст для отображения количества скрытых элементов.
	 * @param {Object} [params.button] - Настройки кнопки.
	 * @param {boolean} [params.button.enabled=true] - Показывать кнопку управления.
	 * @param {string} [params.button.more="Показать"] - Текст кнопки для раскрытия.
	 * @param {string} [params.button.less="Свернуть"] - Текст кнопки для сворачивания.
	 *
	 * @example
	 * new VGRollup(document.querySelector('.rollup'), {
	 *   content: 'elements',
	 *   elements: 'item',
	 *   cnt: 3,
	 *   button: { more: 'Показать ещё', less: 'Свернуть' }
	 * });
	 */
	constructor(element, params = {}) {
		super(element, params);

		const defaultParams = {
			lang: document.documentElement.lang || 'ru',
			content: 'text',
			cnt: 0,
			fade: true,
			transition: false,
			number: false,
			height: 0,
			ellipsis: {
				line: null
			},
			more: ' еще ',
			button: {
				enabled: true,
				more: 'Показать',
				less: 'Свернуть',
				classes: ''
			},
			callbacks: {
				init: () => {},
				expand: () => {},
				collapse: () => {}
			}
		};

		const lang = Manipulator.get(element, 'data-lang') || params.lang || defaultParams.lang;

		// Локализация текстов кнопок
		defaultParams.button.more = lang_buttons(lang, NAME)['show'];
		defaultParams.button.less = lang_buttons(lang, NAME)['less'];
		defaultParams.more        = lang_buttons(lang, NAME)['more'];


		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));

		/**
		 * CSS-классы, используемые модулем.
		 * @type {Object}
		 * @property {string} container - Базовый класс контейнера.
		 * @property {string} hidden - Класс для скрытого состояния.
		 * @property {string} fade - Класс для эффекта затухания.
		 * @property {string} ellipsis - Класс для многоточия.
		 * @property {string} button - Класс контейнера кнопки.
		 * @property {string} transition - Класс для анимации.
		 */
		this.classes = {
			container: 'vg-rollup',
			hidden: "vg-rollup-content--hidden",
			fade: "vg-rollup-content--fade",
			ellipsis: "vg-rollup-content--ellipsis",
			button: "vg-rollup-content--button",
			transition: "vg-rollup-content--transition"
		};

		/**
		 * Общее количество элементов (в режиме `elements`).
		 * @type {number}
		 */
		this.total = 0;

		/**
		 * Количество видимых элементов (в режиме `elements`).
		 * @type {number}
		 */
		this.count = 0;

		/**
		 * Смещение для подгрузки (если используется).
		 * @type {number}
		 */
		this.offset = 0;

		/**
		 * Флаг активности режима смещения.
		 * @type {boolean}
		 */
		this.isOffset = false;

		this.build();
	}

	/**
	 * Имя модуля
	 * @type {string}
	 */
	static get NAME() { return NAME; }

	/**
	 * Ключ модуля (пространство имён событий)
	 * @type {string}
	 */
	static get NAME_KEY() { return NAME_KEY; }

	/**
	 * Переключает состояние контента (свёрнут/развёрнут).
	 * @param {HTMLElement} target - Целевой контейнер контента.
	 * @param {HTMLElement} relatedTarget - Кнопка, вызвавшая переключение.
	 * @static
	 * @example
	 * VGRollup.toggle(document.querySelector('.rollup'), buttonEl);
	 */
	static toggle(target, relatedTarget) {
		const instance = VGRollup.getOrCreateInstance(target);
		const isShown = instance.isShow();

		if (!isShown) {
			instance._show(relatedTarget);
		} else {
			instance._hide(relatedTarget);
		}
	}

	/**
	 * Открывает (разворачивает) контент.
	 * @param {HTMLElement} relatedTarget - Элемент, вызвавший событие (кнопка).
	 * @private
	 */
	_show(relatedTarget) {
		Classes.add(this._element, CLASS_NAME_SHOW);
		relatedTarget.innerHTML = this._params.button.less;
		Manipulator.set(relatedTarget, 'aria-expanded', 'true');

		if (this.offset > 0) {
			relatedTarget.innerHTML = this.isOffset ? this._params.button.more : this._params.button.less;
			Manipulator.set(relatedTarget, 'aria-expanded', this.isOffset ? "true" : "false");
		}

		this.switch(this._element, false);
		EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
	}

	/**
	 * Закрывает (сворачивает) контент.
	 * @param {HTMLElement} relatedTarget - Элемент, вызвавший событие (кнопка).
	 * @private
	 */
	_hide(relatedTarget) {
		let buttonText = this._params.button.more;
		const isShowNum = this._params.number;

		if (isShowNum) {
			const sum = this.total - this.count;
			if (sum > 0) {
				buttonText += this._params.more + sum;
			}
		}

		Classes.remove(this._element, CLASS_NAME_SHOW);
		Manipulator.set(relatedTarget, 'aria-expanded', 'false');
		relatedTarget.textContent = buttonText;

		this.switch(this._element, true);
		EventHandler.trigger(this._element, EVENT_KEY_HIDE, { relatedTarget });
	}

	/**
	 * Инициализирует отображение контента и создаёт кнопку (если нужно).
	 * @param {HTMLElement|null} el - Элемент, который нужно инициализировать.
	 * @param {boolean} isButtonAppend - Разрешено ли добавление кнопки.
	 * @example
	 * instance.build(); // перестроить текущий элемент
	 */
	build(el = null, isButtonAppend = true) {
		const element = el || this._element;
		const selfHeight = element.clientHeight;
		const setHeight = this._params.height || (selfHeight / 2);

		const {
			fade,
			transition,
			button,
			number: showNum,
			content,
			elements: elementClass,
			cnt,
			ellipsis: ellipsisCfg
		} = this._params;

		const isEllipsis = ellipsisCfg.line !== null;
		const isButton = button.enabled && isButtonAppend;

		Classes.add(element, this.classes.container);

		if (!isButtonAppend) {
			this.switch(element);
			return;
		}

		if (content === 'text' && selfHeight > setHeight) {
			this._setupTextContent(element, setHeight, fade, transition, isEllipsis, ellipsisCfg.line, isButton, showNum);
		} else if (content === 'elements') {
			this._setupElementsContent(element, elementClass, cnt, fade, transition, isEllipsis, isButton, showNum);
		}

		execute(this._params.callbacks.init, [element, this])
	}

	/**
	 * Настраивает контент типа 'text' (ограничение по высоте).
	 * @param {HTMLElement} element - Контейнер текста.
	 * @param {number} height - Высота, до которой обрезать.
	 * @param {boolean} fade - Использовать затухание.
	 * @param {boolean} transition - Использовать анимацию.
	 * @param {boolean} isEllipsis - Использовать многоточие.
	 * @param {number|null} line - Количество строк.
	 * @param {boolean} isButton - Показывать кнопку.
	 * @param {boolean} showNum - Показывать счётчик.
	 * @private
	 */
	_setupTextContent(element, height, fade, transition, isEllipsis, line, isButton, showNum) {
		Classes.add(element, this.classes.hidden);
		element.style.height = height + "px";

		if (isEllipsis && line) {
			Classes.add(element, this.classes.ellipsis);
			element.style.lineClamp  = Number(line);
			element.style.setProperty('-webkit-line-clamp', String(Number(line)));
		} else if (isEllipsis) {
			console.error("Переменная [data-line] или параметр[line] не должны быть пустыми");
		}

		if (transition) Classes.add(element, this.classes.transition);
		if (fade) Classes.add(element, this.classes.fade);

		if (isButton) this._createButton(element, '', showNum);
	}

	/**
	 * Настраивает контент типа 'elements' (ограничение по количеству).
	 * @param {HTMLElement} element - Контейнер элементов.
	 * @param {string} elementClass - Класс видимых элементов.
	 * @param {number} cnt - Количество видимых элементов.
	 * @param {boolean} fade - Использовать затухание.
	 * @param {boolean} transition - Использовать анимацию.
	 * @param {boolean} isEllipsis - Использовать многоточие.
	 * @param {boolean} isButton - Показывать кнопку.
	 * @param {boolean} showNum - Показывать счётчик.
	 * @private
	 */
	_setupElementsContent(element, elementClass, cnt, fade, transition, isEllipsis, isButton, showNum) {
		const items = Selectors.findAll('.' + elementClass, element);
		this.total = items.length;
		this.count = cnt;

		items.forEach((item, index) => {
			if (index >= cnt) {
				Classes.add(item, CLASS_NAME_HIDE);
			}
		});

		const shouldShowButton = isButton && items.length > cnt;

		if (isEllipsis) Classes.add(element, this.classes.ellipsis);
		if (transition) Classes.add(element, this.classes.transition);
		if (fade) Classes.add(element, this.classes.fade);

		if (shouldShowButton) {
			const sum = this.total - this.count;
			const textShowNum = showNum && sum > 0 ? this._params.more + sum : '';
			this._createButton(element, textShowNum, false);
		}
	}

	/**
	 * Создаёт кнопку управления разворачиванием.
	 * @param {HTMLElement} element - Целевой контейнер.
	 * @param {string} textNum - Дополнительный текст (например, количество).
	 * @param {boolean} showNum - Флаг отображения числа (не используется).
	 * @private
	 */
	_createButton(element, textNum = '', showNum = false) {
		if (!element.id) {
			element.id = `vg-rollup-${Math.random().toString(36).substr(2, 9)}`;
		}

		const btnTextMore = this._params.button.more;
		const btnHTML = `<div class="${this.classes.button}">
            <a href="#" aria-expanded="false" data-vg-toggle="rollup" class="${this._params.button.classes}" data-vg-target="#${element.id}">
                ${btnTextMore}${textNum}
            </a>
        </div>`;

		element.insertAdjacentHTML("afterend", btnHTML);
	}

	/**
	 * Переключает состояние скрытия/показа контента.
	 * @param {HTMLElement} el - Элемент контента.
	 * @param {boolean} switcher - Если `true` — свернуть, иначе — полностью открыть.
	 * @example
	 * instance.switch(element, true); // свернуть
	 * instance.switch(element, false); // развернуть
	 */
	switch(el, switcher = false) {
		if (switcher && !this.isOffset) {
			const { content } = this._params;
			const selfHeight = el.clientHeight;
			const setHeight = this._params.height || selfHeight / 2;

			if (content === 'text' && selfHeight > setHeight) {
				Classes.add(el, this.classes.hidden);
				el.style.height = setHeight + "px";

				if (this._params.ellipsis.line) {
					Classes.add(el, this.classes.ellipsis);
					el.style.lineClamp = this._params.ellipsis.line;
					el.style.setProperty('-webkit-line-clamp', String(this._params.ellipsis.line));
				}

				if (this._params.fade) Classes.add(el, this.classes.fade);
				if (this._params.transition) Classes.add(el, this.classes.transition);

				execute(this._params.callbacks.collapse, [el, this])
			} else if (content === 'elements') {
				const items = Selectors.findAll('.' + this._params.elements, el);
				items.forEach((item, index) => {
					if (index >= this.count) {
						Classes.add(item, CLASS_NAME_HIDE);
					}
				});

				execute(this._params.callbacks.collapse, [el, items, this])
			}

			Classes.add(el, this.classes.container);
		} else {
			const { hidden, ellipsis, fade } = this.classes;
			Classes.remove(el, [hidden, ellipsis, fade]);
			el.style.removeProperty('height');
			el.style.removeProperty('line-clamp');
			el.style.removeProperty('-webkit-line-clamp');

			if (this._params.content === 'elements') {
				const items = Selectors.findAll('.' + this._params.elements, el);
				items.forEach(item => Classes.remove(item, CLASS_NAME_HIDE));
			}

			execute(this._params.callbacks.expand, [el, this])
		}
	}

	/**
	 * Проверяет, развёрнут ли контент.
	 * @returns {boolean} `true`, если контент развёрнут.
	 * @example
	 * if (instance.isShow()) { ... }
	 */
	isShow() {
		return Classes.has(this._element, CLASS_NAME_SHOW);
	}

	/**
	 * Инициализирует экземпляр VGRollup для элемента.
	 * @param {HTMLElement} element - Целевой элемент.
	 * @param {Object} params - Параметры конфигурации.
	 * @param {Function} [callback] - Колбэк, вызываемый после инициализации.
	 * @static
	 * @example
	 * VGRollup.init(document.querySelector('.rollup'), { height: 100 }, (instance) => {
	 *   console.log('Rollup инициализирован:', instance);
	 * });
	 */
	static init(element, params = {}, callback) {
		const instance = VGRollup.getOrCreateInstance(element, params);
		execute(callback, [instance]);
	}
}

/**
 * Подключает обработчик кликов по data-атрибуту для автоматической инициализации.
 * @listens click
 * @event
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}

	if (isDisabled(this)) return;

	const target = Selectors.getElementFromSelector(this);
	if (!target) return;

	VGRollup.toggle(target, this);
});

export default VGRollup;
