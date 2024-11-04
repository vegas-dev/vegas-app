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
 * isElement
 * @param object
 * @returns {boolean}
 */
const isElement = object => {
	if (!isObject(object)) {
		return false
	}

	return typeof object.nodeType !== 'undefined'
}

/**
 * isDisabled
 * @param element
 * @returns {boolean}
 */
const isDisabled = element => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) {
		return true
	}

	if (element.classList.contains('disabled')) {
		return true
	}

	if (typeof element.disabled !== 'undefined') {
		return element.disabled
	}

	return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false'
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

export {isElement, isDisabled, isObject, isEmptyObj, mergeDeepObject, removeElementArray, normalizeData}