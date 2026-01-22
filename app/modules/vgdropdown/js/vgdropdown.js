import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {isDisabled, isMobileDevice, mergeDeepObject, noop} from "../../../utils/js/functions";
import Placement from "../../../utils/js/components/placement";

/**
 * Константы, используемые в модуле выпадающего списка.
 * @type {Object}
 * @property {string} NAME - Имя модуля.
 * @property {string} NAME_KEY - Уникальный ключ модуля с префиксом.
 * @property {string} CLASS_NAME_SHOW - CSS-класс для отображения элемента.
 * @property {string} CLASS_NAME_FADE - CSS-класс для эффекта затухания.
 * @property {string} CLASS_NAME_OPEN - CSS-класс для немигающего открытия.
 * @property {string} TARGET_CONTAINER - Класс контейнера выпадающего меню.
 * @property {string} PARENT_CONTAINER - Класс родительского контейнера.
 * @property {string} SELECTOR_DATA_TOGGLE - Селектор элемента-переключателя.
 */
const NAME             = 'dropdown';
const NAME_KEY         = 'vg.dropdown';
const CLASS_NAME_SHOW  = 'show';
const CLASS_NAME_FADE  = 'fade';
const CLASS_NAME_OPEN  = 'open';
const TARGET_CONTAINER = 'vg-dropdown-content';
const PARENT_CONTAINER = 'vg-dropdown';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="dropdown"]';

/**
 * События, генерируемые модулем.
 * @type {Object}
 */
const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

/**
 * Делегированные события на уровне документа.
 * @type {Object}
 */
const EVENT_KEYUP_DATA_API     = `keyup.${NAME_KEY}.data.api`;
const EVENT_KEYDOWN_DATA_API   = `keydown.${NAME_KEY}.data.api`;
const EVENT_CLICK_DATA_API     = `click.${NAME_KEY}.data.api`;
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}.data.api`;
const EVENT_MOUSEOUT_DATA_API  = `mouseout.${NAME_KEY}.data.api`;

/**
 * Компонент выпадающего списка (Dropdown).
 *
 * @extends BaseModule
 *
 * @example
 * const dropdown = new VGDropdown(document.querySelector('[data-vg-toggle="dropdown"]'), {
 *   placement: 'bottom-start',
 *   hover: true,
 *   animation: {
 *     enable: true,
 *     in: 'animate__fadeIn',
 *     out: 'animate__fadeOut',
 *     delay: 150
 *   }
 * });
 *
 * @example <caption>Инициализация через data-атрибуты</caption>
 * <div class="vg-dropdown">
 *   <button data-vg-toggle="dropdown" aria-expanded="false">Меню</button>
 *   <div class="vg-dropdown-content">Содержимое меню</div>
 * </div>
 */
class VGDropdown extends BaseModule {
	/**
	 * Создаёт экземпляр VGDropdown.
	 *
	 * @param {HTMLElement} element - Элемент-переключатель (кнопка).
	 * @param {Object} [params] - Пользовательские параметры.
	 * @param {string} [params.placement='auto'] - Позиция выпадающего окна: 'top', 'bottom', 'left', 'right', 'auto' и т.д.
	 * @param {boolean} [params.hover=false] - Открывать по наведению мыши.
	 * @param {Object} [params.ajax] - Параметры AJAX-загрузки.
	 * @param {string} [params.ajax.route=''] - URL для загрузки контента.
	 * @param {string} [params.ajax.target=''] - Селектор внутри drop для вставки данных.
	 * @param {string} [params.ajax.method='get'] - HTTP-метод.
	 * @param {boolean} [params.ajax.loader=false] - Показывать ли лоадер.
	 * @param {boolean} [params.ajax.once=false] - Загружать один раз.
	 * @param {boolean} [params.ajax.output=true] - Вставлять ли ответ в DOM.
	 * @param {Object} [params.animation] - Настройки анимации.
	 * @param {boolean} [params.animation.fade=false] - Использовать fade-анимацию.
	 * @param {boolean} [params.animation.enable=false] - Включить CSS-анимации.
	 * @param {string} [params.animation.in='animate__flipInY'] - Класс для анимации входа.
	 * @param {string} [params.animation.out='animate__flipOutY'] - Класс для анимации выхода.
	 * @param {number} [params.animation.delay=300] - Задержка перед завершением скрытия (в мс).
	 */
	constructor(element, params) {
		super(element, params);

		let defaultParams = {
			placement: 'auto',
			hover: false,
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: false,
				output: true,
			},
			animation: {
				fade: true,
				enable: false,
				in: 'animate__flipInY',
				out: 'animate__flipOutY',
				delay: 300,
			},
		};

		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));

		const target = Selectors.getElementFromSelector(this._element);
		this._parent = this._element.parentNode;
		this._drop = target || Selectors.find(`.${TARGET_CONTAINER}`, this._parent);

		if (!this._drop) return;

		this._isPlacement = false;
		this.isFade = this._params.animation.fade;
		this.isAnimation = this._params.animation.enable;

		this._params.animation.delay = this.isAnimation ? this._params.animation.delay : 0;
		this._animation(this._drop, VGDropdown.NAME_KEY, this._params.animation);
	}

	/**
	 * Возвращает имя компонента.
	 * @return {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Возвращает уникальный ключ компонента.
	 * @return {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Переключает состояние выпадающего списка (открыто/закрыто).
	 * @return {void}
	 */
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}

	/**
	 * Открывает выпадающий список.
	 * @fires VGDropdown#show - Перед открытием.
	 * @fires VGDropdown#shown - После открытия.
	 * @return {void}
	 */
	show() {
		if (isDisabled(this._element) || this._isShown()) return;

		const relatedTarget = { relatedTarget: this._element };

		const showEvent = EventHandler.trigger(this._drop, EVENT_KEY_SHOW, relatedTarget);
		if (showEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			[].concat(...document.body.children).forEach(el => {
				EventHandler.on(el, 'mouseover', noop);
			});
		}

		this._element.setAttribute('aria-expanded', 'true');
		this._element.classList.add(CLASS_NAME_SHOW);
		this._drop.classList.add(CLASS_NAME_SHOW);
		this._setPlacement();

		const completeCallback = () => {
			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_KEY_LOADED, { stats: status, data });
			});

			if (this.isFade) {
				this._drop.classList.add(CLASS_NAME_FADE);
			} else if (!this.isAnimation) {
				this._drop.classList.add(CLASS_NAME_OPEN);
			}
			EventHandler.trigger(this._drop, EVENT_KEY_SHOWN, relatedTarget);
		};

		this._queueCallback(completeCallback, this._drop, this.isAnimation || this.isFade, 50);
	}

	/**
	 * Закрывает выпадающий список.
	 * @fires VGDropdown#hide - Перед закрытием.
	 * @fires VGDropdown#hidden - После закрытия.
	 * @return {void}
	 */
	hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		this._completeHide({ relatedTarget: this._element });
	}

	/**
	 * Удаляет инстанс компонента и очищает обработчики событий.
	 * @return {void}
	 */
	dispose() {
		super.dispose();
	}

	/**
	 * Проверяет, открыто ли выпадающее меню.
	 * @return {boolean} - `true`, если открыто.
	 * @private
	 */
	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Полностью закрывает меню с анимацией и callback.
	 * @param {Object} relatedTarget - Событие-инициатор.
	 * @private
	 */
	_completeHide(relatedTarget) {
		const hideEvent = EventHandler.trigger(this._drop, EVENT_KEY_HIDE, relatedTarget);
		if (hideEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			[].concat(...document.body.children).forEach(el => {
				EventHandler.off(el, 'mouseover', noop);
			});
		}

		this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.setAttribute('aria-expanded', 'false');

		if (this.isFade) {
			this._drop.classList.remove(CLASS_NAME_FADE);
		} else if (!this.isAnimation) {
			this._drop.classList.remove(CLASS_NAME_OPEN);
		}

		setTimeout(() => {
			const completeCallback = () => {
				this._drop.classList.remove(CLASS_NAME_SHOW);
				EventHandler.trigger(this._drop, EVENT_KEY_HIDDEN, relatedTarget);
			};
			this._queueCallback(completeCallback, this._drop, this.isAnimation || this.isFade);
		}, this._params.animation.delay);
	}

	/**
	 * Устанавливает позицию выпадающего окна с помощью вспомогательного класса Placement.
	 * @private
	 */
	_setPlacement() {
		if (!this._drop) return;

		if (!this._isPlacement) {
			let placementDefault = 'bottom-start',
				autoFlip = false,
				overflowProtection = false;

			if (this._params.placement === 'auto') {
				autoFlip = true;
				overflowProtection = true;
			} else {
				placementDefault = this._params.placement
			}

			const placement = new Placement({
				reference: this._element,
				drop: this._drop,
				placement: placementDefault,
				boundary: 'clippingParents',
				autoFlip: autoFlip,
				overflowProtection: overflowProtection,
				fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
			});

			placement._setPlacement(); // позиционируем
		}

		this._isPlacement = true;
	}

	/**
	 * Инициализирует компонент на указанном элементе и устанавливает обработчики событий.
	 * @param {HTMLElement} element - Элемент-переключатель.
	 * @param {Object} [params] - Параметры инициализации.
	 * @return {VGDropdown} - Экземпляр компонента.
	 */
	static init(element, params = {}) {
		const instance = VGDropdown.getOrCreateInstance(element, params);

		if (instance._params.hover && !isMobileDevice()) {
			let currentElem = null;

			EventHandler.on(instance._parent, EVENT_MOUSEOVER_DATA_API, (event) => {
				if (currentElem) return;

				VGDropdown.hideOpenToggles(event);

				const target = event.target.closest(`.${PARENT_CONTAINER}`);
				if (!target || !instance._parent.contains(target)) return;

				currentElem = target;
				instance.show();
			});

			EventHandler.on(instance._parent, EVENT_MOUSEOUT_DATA_API, (event) => {
				if (!currentElem) return;

				let relatedTarget = event.relatedTarget;
				while (relatedTarget && relatedTarget !== currentElem) {
					relatedTarget = relatedTarget.parentNode;
				}

				if (relatedTarget === currentElem) return;

				currentElem = null;
				instance._completeHide({ relatedTarget: instance._element });
			});
		}

		// Клавиатурные события
		EventHandler.on(document, EVENT_KEYUP_DATA_API, SELECTOR_DATA_TOGGLE, VGDropdown.keydownHandler);
		EventHandler.on(document, EVENT_KEYDOWN_DATA_API, `.${TARGET_CONTAINER}`, VGDropdown.keydownHandler);
		EventHandler.on(document, EVENT_KEYUP_DATA_API, VGDropdown.clearDrops);
		EventHandler.on(document, EVENT_CLICK_DATA_API, VGDropdown.clearDrops);

		// Клик по тоглу
		EventHandler.on(element, EVENT_CLICK_DATA_API, (event) => {
			event.preventDefault();
			instance.toggle();
		});

		return instance;
	}

	/**
	 * Скрывает все открытые выпадающие списки.
	 * @param {Event} event - Событие, инициировавшее скрытие.
	 * @static
	 */
	static hideOpenToggles(event) {
		const openToggles = Selectors.findAll(`${SELECTOR_DATA_TOGGLE}:not(.disabled):not(:disabled).${CLASS_NAME_SHOW}`);
		for (const toggle of openToggles) {
			const context = VGDropdown.getInstance(toggle);
			if (!context) continue;

			if (event.target.closest(`.${TARGET_CONTAINER}`) === context._drop) {
				return;
			}

			const composedPath = event.composedPath?.() || [];
			if (composedPath.includes(context._element)) {
				continue;
			}

			const relatedTarget = { relatedTarget: context._element };
			if (event.type === 'click') {
				relatedTarget.clickEvent = event;
			}

			context._completeHide(relatedTarget);
		}
	}

	/**
	 * Обработчик клавиатурных событий (стрелки, Esc).
	 * @param {KeyboardEvent} event - Клавиатурное событие.
	 * @static
	 */
	static keydownHandler(event) {
		const isInput = /input|textarea/i.test(event.target.tagName);
		const isEscapeEvent = event.key === 'Escape';
		const isUpOrDownEvent = ['ArrowUp', 'ArrowDown'].includes(event.key);

		if (!isUpOrDownEvent && !isEscapeEvent) return;
		if (isInput && !isEscapeEvent) return;

		event.preventDefault();

		const toggle = this.matches(SELECTOR_DATA_TOGGLE)
			? this
			: Selectors.find(SELECTOR_DATA_TOGGLE, event.delegateTarget?.parentNode);

		if (!toggle) return;

		const instance = VGDropdown.getOrCreateInstance(toggle);

		if (isUpOrDownEvent) {
			event.stopPropagation();
			instance.show();
		} else if (instance._isShown()) {
			event.stopPropagation();
			instance.hide();
			toggle.focus();
		}
	}

	/**
	 * Обработчик кликов и Tab для закрытия выпадающих списков.
	 * @param {Event} event - Событие (click или keyup).
	 * @static
	 */
	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) {
			return;
		}
		VGDropdown.hideOpenToggles(event);
	}
}

export default VGDropdown;