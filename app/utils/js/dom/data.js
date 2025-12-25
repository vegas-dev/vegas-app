/**
 * --------------------------------------------------------------------------
 * Bootstrap data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 * Управление данными-экземплярами, привязанными к DOM-элементам.
 * Использует Map для эффективного хранения и контроля уникальности.
 */

/**
 * Внутренняя карта для хранения данных по элементам.
 * Структура: Element → Map<Key, Instance>
 */
const elementMap = new Map();

/**
 * Утилита для безопасного получения вложенной карты экземпляров.
 * @param {Element} element
 * @returns {Map<string, any>|null}
 */
function getInstanceMap(element) {
	if (!elementMap.has(element)) {
		return null;
	}
	return elementMap.get(element);
}

/**
 * Утилита для создания новой вложенной карты для элемента.
 * @param {Element} element
 * @returns {Map<string, any>}
 */
function createInstanceMap(element) {
	const map = new Map();
	elementMap.set(element, map);
	return map;
}

export default {
	/**
	 * Устанавливает экземпляр для элемента по ключу.
	 * Запрещает несколько экземпляров на один элемент.
	 *
	 * @param {Element} element - DOM-элемент
	 * @param {string} key - уникальный ключ (например, имя компонента)
	 * @param {any} instance - экземпляр класса или объект
	 */
	set(element, key, instance) {
		if (!getInstanceMap(element)) {
			createInstanceMap(element);
		}

		const instanceMap = getInstanceMap(element);

		// Проверяем, есть ли уже экземпляр (кроме случая, если это первая запись)
		if (instanceMap.size > 0 && !instanceMap.has(key)) {
			const existingKey = Array.from(instanceMap.keys())[0];
			console.error(
				`VGApp не допускает более одного экземпляра для каждого элемента. Связанный экземпляр: ${existingKey}.`
			);
			return;
		}

		instanceMap.set(key, instance);
	},

	/**
	 * Получает экземпляр по элементу и ключу.
	 *
	 * @param {Element} element - DOM-элемент
	 * @param {string} key - ключ
	 * @returns {any|null} - экземпляр или null
	 */
	get(element, key) {
		const instanceMap = getInstanceMap(element);
		if (!instanceMap) return null;

		return instanceMap.get(key) || null;
	},

	/**
	 * Удаляет экземпляр по ключу.
	 * Если у элемента не остаётся экземпляров — удаляет и сам элемент из хранилища.
	 *
	 * @param {Element} element - DOM-элемент
	 * @param {string} key - ключ
	 */
	remove(element, key) {
		const instanceMap = getInstanceMap(element);
		if (!instanceMap) return;

		instanceMap.delete(key);

		// Очищаем корневую запись, если больше нет экземпляров
		if (instanceMap.size === 0) {
			elementMap.delete(element);
		}
	}
};