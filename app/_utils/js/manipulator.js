/**
 * Удаляем элементы с массива
 * @param arr
 * @param el
 */
function removeElementArray(arr, el) {
	return arr.filter((item) => !el.includes(item));
}

/**
 * Глубокое объединение объектов
 * @param objects
 * @returns {*}
 */
function mergeDeepObject(...objects) {
	const isObject = obj => obj && typeof obj === 'object';

	return objects.reduce((prev, obj) => {
		Object.keys(obj).forEach(key => {
			const pVal = prev[key];
			const oVal = obj[key];

			if (Array.isArray(pVal) && Array.isArray(oVal)) {
				prev[key] = pVal.concat(...oVal);
			}
			else if (isObject(pVal) && isObject(oVal)) {
				prev[key] = mergeDeepObject(pVal, oVal);
			}
			else {
				prev[key] = oVal;
			}
		});

		return prev;
	}, {});
}

/**
 * Если что-нибудь в объекте
 * @param obj
 * @returns {boolean}
 */
function isEmptyObj(obj) {
	for (let prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			return false;
		}
	}

	return true
}

/**
 * isObject
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
	return obj && typeof obj === 'object'
}

/**
 * Приводим в порядок типы данных
 * @param value
 * @returns {any}
 */
function normalizeData(value)  {
	if (value === 'true') {
		return true
	}

	if (value === 'false') {
		return false
	}

	if (value === Number(value).toString()) {
		return Number(value)
	}

	if (value === '' || value === 'null') {
		return null
	}

	if (typeof value !== 'string') {
		return value
	}

	try {
		return JSON.parse(decodeURIComponent(value))
	} catch {
		return value
	}
}

/**
 * Манипуляции с элементом
 */
const Manipulator = {
	getDataAttributes(element, isRemoveDataName = true, isRemovePrefix = true) {
		if (!element) {
			return {}
		}

		const attributes= {},
			arr = [].filter.call(element.attributes, function (at) {
				return /^data-/.test(at.name);
			});

		if (arr.length) {
			arr.forEach(function (v) {
				let name = v.name, prefix = 'vg-';
				if (isRemoveDataName) name = name.slice(5);
				if (isRemovePrefix && name.indexOf(prefix) !== -1) name = name.slice(3);

				attributes[name] = normalizeData(v.value)
			});
		}

		return attributes
	},

	getAttribute: function (element, nameAttribute) {
		if (!element || !nameAttribute) {
			return ''
		}
		return normalizeData(element.getAttribute(nameAttribute));
	},

	find: function (el) {
		if (!el) {
			throw new Error('Товарищ! Первый параметр не должен быть пустым!');
		} else {
			if (typeof el === 'string') {
				let elm = document.querySelector(el);
				if (elm) return elm;
				else throw new Error('Ахпер! Не удалось найти элемент');
			} else if (typeof el === 'object') {
				return el;
			} else {
				throw new Error('КЭП! Какая-то дичь к нам залетела');
			}
		}
	}
}

/**
 * EVENTS
 * @type {{on: eventHandler.on}}
 * Как это работает?
 * Вызов функции: eventHandler.on('элемент который нужно тригернуть', 'как тригернуть элемент');
 */
const eventHandler = {
	on: function (element, event, detail = {}) {
		const eventSuccess = new CustomEvent(event, {
			bubbles: true,
			detail: detail
		});

		element.dispatchEvent(eventSuccess);
	}
}

export {Manipulator, eventHandler, isObject, isEmptyObj, mergeDeepObject, removeElementArray, normalizeData}
