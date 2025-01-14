/**
 * Набор скриптов для широкого применения
 */

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

function isVisible (element) {
	if (!isElement(element) || element.getClientRects().length === 0) {
		return false
	}

	const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'
	const closedDetails = element.closest('details:not([open])')

	if (!closedDetails) {
		return elementIsVisible
	}

	if (closedDetails !== element) {
		const summary = element.closest('summary')
		if (summary && summary.parentNode !== closedDetails) {
			return false
		}

		if (summary === null) {
			return false
		}
	}

	return elementIsVisible
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

/**
 * Callback
 * @param possibleCallback
 * @param args
 * @param defaultValue
 * @returns {*}
 */
function execute(possibleCallback, args = [], defaultValue = possibleCallback) {
	return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue
}

/**
 * Transition
 * @param callback
 * @param transitionElement
 * @param waitForTransition
 */
const TRANSITION_END = 'transitionend';
const MILLISECONDS_MULTIPLIER = 1000;

function executeAfterTransition (callback, transitionElement, waitForTransition = true, timeOutMs) {
	if (!waitForTransition) {
		execute(callback)
		return
	}

	const durationPadding = 5
	const emulatedDuration = timeOutMs ? timeOutMs : getTransitionDurationFromElement(transitionElement) + durationPadding;

	let called = false

	const handler = ({ target }) => {
		if (target !== transitionElement) {
			return
		}

		called = true
		transitionElement.removeEventListener(TRANSITION_END, handler)
		execute(callback)
	}

	transitionElement.addEventListener(TRANSITION_END, handler)
	setTimeout(() => {
		if (!called) {
			triggerTransitionEnd(transitionElement)
		}
	}, emulatedDuration)
}

const getTransitionDurationFromElement = element => {
	if (!element) {
		return 0
	}

	// Get transition-duration of the element
	let { transitionDuration, transitionDelay } = window.getComputedStyle(element)

	const floatTransitionDuration = Number.parseFloat(transitionDuration)
	const floatTransitionDelay = Number.parseFloat(transitionDelay)

	// Return 0 if element or transition duration is not found
	if (!floatTransitionDuration && !floatTransitionDelay) {
		return 0
	}

	// If multiple durations are defined, take the first
	transitionDuration = transitionDuration.split(',')[0]
	transitionDelay = transitionDelay.split(',')[0]

	return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
}

const triggerTransitionEnd = element => {
	element.dispatchEvent(new Event(TRANSITION_END))
}

/**
 * Трюк для перезапуска анимации элемента
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @смотри https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
	element.offsetHeight // eslint-disable-line no-unused-expressions
}

/**
 * Noop
 */
const noop = () => {};

/**
 * Генерация случайной строки
 */
function makeRandomString(length = 7) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

/**
 *
 */
const isRTL = () => document.documentElement.dir === 'rtl'

export {isElement, isVisible, isDisabled, isObject, isEmptyObj, mergeDeepObject, removeElementArray, normalizeData, execute, executeAfterTransition, reflow, noop, makeRandomString, isRTL}