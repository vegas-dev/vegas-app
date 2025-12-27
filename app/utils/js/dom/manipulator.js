import { isElement, normalizeData } from "../functions";

/**
 * Утилиты для работы с атрибутами и классами DOM-элементов.
 */
const Manipulator = {
	/**
	 * Получает значение атрибута, data-атрибутов или всех атрибутов.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} nameAttribute - Имя атрибута ('data', 'all' или конкретное имя).
	 * @param {boolean} isRemoveDataName - Убрать префикс 'data-' у data-атрибутов.
	 * @returns {any|Object} - Значение атрибута или объект атрибутов.
	 */
	get(element, nameAttribute = "data", isRemoveDataName = true) {
		if (!isElement(element)) return {};

		// Все атрибуты
		if (nameAttribute === "all") {
			return Array.from(element.attributes).reduce((acc, attr) => {
				acc[attr.name] = attr.value;
				return acc;
			}, {});
		}

		// Data-атрибуты
		if (nameAttribute === "data") {
			const baseKeys = new Set(['data-vg-toggle', 'data-vg-target', 'data-vg-dismiss', 'data-vg-loaded']);
			const dataAttrs = {};

			Array.from(element.attributes)
				.filter(attr => attr.name.startsWith('data-'))
				.forEach(attr => {
					if (!baseKeys.has(attr.name)) {
						const key = isRemoveDataName ? attr.name.slice(5) : attr.name;
						dataAttrs[key] = normalizeData(attr.value);
					}
				});

			return dataAttrs;
		}

		// Конкретный атрибут
		return element.getAttribute(nameAttribute);
	},

	/**
	 * Проверяет наличие атрибута у элемента.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} nameAttribute - Имя атрибута.
	 * @returns {boolean}
	 */
	has(element, nameAttribute) {
		return isElement(element) && element.hasAttribute(nameAttribute);
	},

	/**
	 * Устанавливает атрибут элементу.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} name - Имя атрибута.
	 * @param {string} value - Значение атрибута.
	 */
	set(element, name, value) {
		if (isElement(element) && name) {
			element.setAttribute(name, value);
		}
	},

	/**
	 * Удаляет атрибут у элемента.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} nameAttribute - Имя атрибута.
	 */
	remove(element, nameAttribute) {
		if (isElement(element) && nameAttribute) {
			element.removeAttribute(nameAttribute);
		}
	},

	/**
	 * Скрывает элемент.
	 * @param {Element} element - DOM-элемент.
	 */
	hide(element) {
		if (isElement(element)) {
			element.style.display = 'none';
		}
	},

	/**
	 * Отображает элемент.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} state - display-значение (по умолчанию 'block').
	 */
	show(element, state = 'block') {
		if (isElement(element)) {
			element.style.display = state;
		}
	},
};

/**
 * Утилиты для работы с classList элемента.
 */
const Classes = {
	/**
	 * Удаляет класс(ы) у элемента.
	 * @param {Element} element - DOM-элемент.
	 * @param {string|string[]} className - Класс или массив классов.
	 */
	remove(element, className) {
		if (!isElement(element) || !className) return;

		const classes = Array.isArray(className) ? className : className.split(' ').filter(Boolean);
		element.classList.remove(...classes);
	},

	/**
	 * Добавляет класс(ы) к элементу.
	 * @param {Element} element - DOM-элемент.
	 * @param {string|string[]} className - Класс или массив классов.
	 * @param {boolean} isString - Если true — возвращает строку вместо применения.
	 * @returns {string|undefined} - Строка с классами (если isString=true).
	 */
	add(element, className, isString = false) {
		if (!className) return;

		const classes = Array.isArray(className) ? className : className.split(' ').filter(Boolean);

		if (isString) {
			return classes.join(' ');
		}

		if (isElement(element)) {
			element.classList.add(...classes);
		}
	},

	/**
	 * Переключает класс у элемента.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} className - Имя класса.
	 * @param {boolean} condition - Условие переключения.
	 */
	toggle(element, className, condition = true) {
		if (isElement(element) && className) {
			element.classList.toggle(className, !!condition);
		}
	},

	/**
	 * Заменяет один класс на другой.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} oldClass - Старый класс.
	 * @param {string} newClass - Новый класс.
	 */
	replace(element, oldClass, newClass) {
		if (isElement(element) && oldClass && newClass) {
			element.classList.replace(oldClass, newClass);
		}
	},

	/**
	 * Проверяет наличие класса у элемента.
	 * @param {Element} element - DOM-элемент.
	 * @param {string} className - Имя класса.
	 * @returns {boolean} - Возвращает true, если элемент содержит указанный класс.
	 */
	has(element, className) {
		return isElement(element) && element.classList.contains(className);
	},
};

export { Manipulator, Classes };