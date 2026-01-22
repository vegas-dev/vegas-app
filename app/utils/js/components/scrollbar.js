/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scrollBar.js (рефакторинг)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 *
 * Улучшена читаемость, вынесены дублирующиеся операции,
 * добавлены JSDoc-комментарии, упрощена логика.
 */

import { Manipulator } from "../dom/manipulator";
import Selectors from "../dom/selectors";
import {isElement, isMobileDevice} from "../functions";

/**
 * Константы
 */
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';

/**
 * Вспомогательный класс для управления скроллбаром
 * Корректирует отступы при скрытии скролла, сохраняет исходные стили
 */
class ScrollBarHelper {
	constructor() {
		this._element = document.body;
	}

	/**
	 * Возвращает ширину вертикального скроллбара
	 * @returns {number}
	 */
	getWidth() {
		const documentWidth = document.documentElement.clientWidth;
		return Math.abs(window.innerWidth - documentWidth);
	}

	/**
	 * Проверяет, есть ли скроллбар (ширина > 0)
	 * @returns {boolean}
	 */
	isOverflowing() {
		return this.getWidth() > 0;
	}

	/**
	 * Скрывает скроллбар и корректирует макет
	 */
	hide() {
		if (this.isOverflowing && !isMobileDevice()) {
			const width = this.getWidth();
			this._disableOverflow();

			this._setStyle(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, width, (value) => value + width);
			this._setStyle(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, width, (value) => value - width);
			this._setStyle(this._element, PROPERTY_PADDING, width, (value) => value + width);
		} else if (isMobileDevice()) {
			this._disableOverflow();
		}
	}

	/**
	 * Сбрасывает стили до исходных значений
	 */
	reset() {
		this._resetStyle(this._element, "overflow");
		this._resetStyle(this._element, PROPERTY_PADDING);
		this._resetStyle(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
		this._resetStyle(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
	}

	/**
	 * Блокирует overflow у body
	 * @private
	 */
	_disableOverflow() {
		this._saveInitialStyle(this._element, "overflow");
		this._element.style.overflow = "hidden";
	}

	/**
	 * Устанавливает стили с сохранением начальных значений
	 * @param {string|HTMLElement} selector
	 * @param {string} property
	 * @param {number} width
	 * @param {(value: number) => number} callback
	 * @private
	 */
	_setStyle(selector, property, width, callback) {
		const apply = (element) => {
			// Исключаем элементы, у которых и так нет места под скролл
			if (element !== this._element && window.innerWidth > element.clientWidth + width) {
				return;
			}

			this._saveInitialStyle(element, property);

			const current = getComputedStyle(element).getPropertyValue(property);
			const value = Number.parseFloat(current) || 0;

			element.style.setProperty(property, `${callback(value)}px`);
		};

		this._applyToElements(selector, apply);
	}

	/**
	 * Сбрасывает стили до сохранённых значений
	 * @param {string|HTMLElement} selector
	 * @param {string} property
	 * @private
	 */
	_resetStyle(selector, property) {
		const apply = (element) => {
			const value = Manipulator.get(element, property);

			if (value === null) {
				element.style.removeProperty(property);
				return;
			}

			Manipulator.remove(element, property);
			element.style.setProperty(property, value);
		};

		this._applyToElements(selector, apply);
	}

	/**
	 * Сохраняет текущее значение inline-стиля через Manipulator
	 * (включая пустое значение, чтобы reset() работал стабильно).
	 * @param {HTMLElement} element
	 * @param {string} property
	 * @private
	 */
	_saveInitialStyle(element, property) {
		const value = element.style.getPropertyValue(property);

		// Важно: сохраняем даже пустую строку (если inline-стиля не было)
		// чтобы reset() мог корректно восстановить "как было".
		if (value !== null) {
			Manipulator.set(element, property, value);
		}
	}

	/**
	 * Применяет callback к элементу или списку элементов
	 * @param {string|HTMLElement} selector
	 * @param {(element: HTMLElement) => void} callback
	 * @private
	 */
	_applyToElements(selector, callback) {
		if (isElement(selector)) {
			callback(selector);
			return;
		}

		Selectors.findAll(selector, this._element).forEach(callback);
	}
}

export default ScrollBarHelper;