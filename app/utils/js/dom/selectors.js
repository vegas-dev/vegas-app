/**
 * Утилиты для работы с DOM-селекторами
 * Поддержка data-атрибутов, href и CSS-экранирование
 */

import { isElement } from '../functions';

/**
 * Экранирует ID в CSS-селекторах, если поддерживается браузером
 * @param {string} id
 * @returns {string}
 */
const escapeId = (id) => {
	if (id && window.CSS?.escape) {
		return CSS.escape(id);
	}
	// Резервное экранирование для старых браузеров
	return id.replace(/([:.#[]])/g, '\\$1');
};

/**
 * Извлекает селектор из элемента через data-атрибут или href
 * @param {Element} element
 * @returns {string|null}
 */
const getSelector = (element) => {
	const dataTarget = element.getAttribute('data-vg-target');
	if (dataTarget && dataTarget !== '#') {
		return dataTarget.trim();
	}

	const href = element.getAttribute('href');
	if (!href || (!href.includes('#') && !href.startsWith('.'))) {
		return null;
	}

	const selector = href.includes('#') && !href.startsWith('#')
		? `#${href.split('#')[1]}`
		: href;

	return selector !== '#' ? selector.trim() : null;
};

/**
 * Основной объект для работы с селекторами
 */
const Selectors = {
	/**
	 * Находит один элемент по селектору или возвращает сам элемент
	 * @param {string|Element} selector
	 * @param {Element} [container=document.documentElement]
	 * @returns {Element|null}
	 */
	find(selector, container = document.documentElement) {
		if (isElement(selector)) {
			return selector;
		}
		try {
			return container.querySelector(selector);
		} catch (e) {
			console.warn('Invalid selector:', selector, e);
			return null;
		}
	},

	/**
	 * Находит элемент по ID с экранированием
	 * @param {string} id
	 * @param {Element} [container=document]
	 * @returns {Element|null}
	 */
	findID(id, container = document) {
		try {
			const escaped = escapeId(id);
			return container.getElementById(escaped) || container.querySelector(`#${escaped}`);
		} catch (e) {
			console.warn('Invalid ID in findID:', id, e);
			return null;
		}
	},

	/**
	 * Находит все элементы по селектору
	 * @param {string} selector
	 * @param {Element} [container=document.documentElement]
	 * @returns {Element[]}
	 */
	findAll(selector, container = document.documentElement) {
		try {
			return Array.from(container.querySelectorAll(selector));
		} catch (e) {
			console.warn('Invalid selector in findAll:', selector, e);
			return [];
		}
	},

	/**
	 * Получает валидный селектор из элемента
	 * @param {Element} element
	 * @returns {string|null}
	 */
	getSelectorFromElement(element) {
		const selector = getSelector(element);
		return selector && this.find(selector) ? selector : null;
	},

	/**
	 * Получает целевой элемент по селектору из элемента
	 * @param {Element} element
	 * @returns {Element|null}
	 */
	getElementFromSelector(element) {
		const selector = getSelector(element);
		return selector ? this.find(selector) : null;
	},

	/**
	 * Получает все целевые элементы (для множественного выбора)
	 * @param {Element} element
	 * @returns {Element[]}
	 */
	getMultipleElementsFromSelector(element) {
		const selector = getSelector(element);
		return selector ? this.findAll(selector) : [];
	},

	/**
	 * Находит всех родителей, соответствующих селектору
	 * @param {Element} element
	 * @param {string} selector
	 * @returns {Element[]}
	 */
	parents(element, selector) {
		const parents = [];
		let parent = element.parentElement?.closest(selector);

		while (parent) {
			parents.push(parent);
			parent = parent.parentElement?.closest(selector);
		}

		return parents;
	},

	/**
	 * Находит следующий соседний элемент, соответствующий селектору
	 * @param {Element} element
	 * @param {string} selector
	 * @returns {Element[]}
	 */
	next(element, selector) {
		let sibling = element.nextElementSibling;
		while (sibling) {
			if (sibling.matches(selector)) {
				return [sibling];
			}
			sibling = sibling.nextElementSibling;
		}
		return [];
	},

	/**
	 * Находит предыдущий соседний элемент, соответствующий селектору
	 * @param {Element} element
	 * @param {string} selector
	 * @returns {Element[]}
	 */
	prev(element, selector) {
		let sibling = element.previousElementSibling;
		while (sibling) {
			if (sibling.matches(selector)) {
				return [sibling];
			}
			sibling = sibling.previousElementSibling;
		}
		return [];
	},
};

export default Selectors;