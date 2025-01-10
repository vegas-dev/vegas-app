/**
 * --------------------------------------------------------------------------
 * Bootstrap data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 * Скрипт работает с коллекцией модулей. Подробнее тут https://learn.javascript.ru/map-set
 */

/**
 * Константы
 */

const elementMap = new Map()

export default {
	set(element, key, instance) {
		if (!elementMap.has(element)) {
			elementMap.set(element, new Map())
		}

		const instanceMap = elementMap.get(element)
		if (!instanceMap.has(key) && instanceMap.size !== 0) {
			console.error(`VGApp не допускает более одного экземпляра для каждого элемента. Связанный экземпляр: ${Array.from(instanceMap.keys())[0]}.`)
			return
		}

		instanceMap.set(key, instance)
	},

	get(element, key) {
		if (elementMap.has(element)) {
			return elementMap.get(element).get(key) || null
		}

		return null
	},

	remove(element, key) {
		if (!elementMap.has(element)) {
			return
		}

		const instanceMap = elementMap.get(element)

		instanceMap.delete(key);

		if (instanceMap.size === 0) {
			elementMap.delete(element)
		}
	}
}
