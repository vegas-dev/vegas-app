/**
 * Утилиты: DOM, типы, массивы, анимации, объекты
 * Экспортируются все функции.
 */

/**
 * Проверяет, является ли объект DOM-элементом.
 * @param {*} obj
 * @returns {boolean}
 */
const isElement = (obj) => obj?.nodeType === Node.ELEMENT_NODE;

/**
 * Проверяет, является ли значение объектом (не null, включая массивы).
 * @param {*} obj
 * @returns {boolean}
 */
const isObject = (obj) => obj && typeof obj === 'object';

/**
 * Проверяет, пуст ли объект (нет собственных перечисляемых ключей).
 * @param {Object} obj
 * @returns {boolean}
 */
const isEmptyObj = (obj) => {
	if (!isObject(obj)) return true;
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
	}
	return true;
};

/**
 * Возвращает DOM-элемент по селектору, элементу или jQuery-объекту.
 * @param {string|Element|jQuery} selector
 * @returns {Element|null}
 */
const getElement = (selector) => {
	if (isElement(selector)) return selector;
	if (selector?.jquery) return selector[0] || null;
	if (typeof selector === 'string' && selector.trim() !== '') {
		try {
			return document.querySelector(selector);
		} catch (e) {
			console.warn('Invalid selector:', selector);
			return null;
		}
	}
	return null;
};

/**
 * Проверяет, отключён ли элемент (по классу .disabled, атрибуту или свойству).
 * @param {Element} el
 * @returns {boolean}
 */
const isDisabled = (el) => {
	if (!isElement(el)) return true;
	if (el.classList.contains('disabled')) return true;
	if (typeof el.disabled !== 'undefined') return !!el.disabled;
	return el.hasAttribute('disabled') && el.getAttribute('disabled') !== 'false';
};

/**
 * Проверяет видимость элемента (размер, visibility, details).
 * @param {Element} el
 * @returns {boolean}
 */
const isVisible = (el) => {
	if (!isElement(el) || el.getClientRects().length === 0) return false;

	const style = getComputedStyle(el);
	if (style.visibility === 'hidden') return false;

	const parentDetails = el.closest('details:not([open])');
	if (!parentDetails) return true;

	const summary = el.closest('summary');
	if (summary && summary.parentNode === parentDetails) return true;

	return false;
};

/**
 * Преобразует строку в соответствующий тип: boolean, number, null, объект.
 * @param {*} value
 * @returns {*}
 */
const normalizeData = (value) => {
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'null') return null;
	if (value === '') return null;
	if (typeof value === 'number' || value === Number(value)) return Number(value);
	if (typeof value !== 'string') return value;

	try {
		return JSON.parse(decodeURIComponent(value));
	} catch {
		return value;
	}
};

/**
 * Удаляет элементы из массива.
 * @param {Array} arr
 * @param {Array} toRemove
 * @returns {Array}
 */
const removeElementArray = (arr, toRemove) => arr.filter((item) => !toRemove.includes(item));

/**
 * Глубокое слияние объектов с конкатенацией массивов.
 * @param {...Object} sources
 * @returns {Object}
 */
const mergeDeepObject = (...sources) => {
	const isObj = (o) => o && typeof o === 'object';

	return sources.reduce((acc, obj) => {
		if (!isObj(obj)) return acc;

		Object.keys(obj).forEach((key) => {
			const src = acc[key];
			const val = obj[key];

			if (Array.isArray(src) && Array.isArray(val)) {
				acc[key] = src.concat(val);
			} else if (isObj(src) && isObj(val)) {
				acc[key] = mergeDeepObject(src, val);
			} else {
				acc[key] = val;
			}
		});

		return acc;
	}, {});
};

/**
 * Выполняет функцию с аргументами или возвращает значение по умолчанию.
 * @param {Function|*} fn
 * @param {Array} args
 * @param {*} defaultValue
 * @returns {*}
 */
const execute = (fn, args = [], defaultValue = fn) => {
	return typeof fn === 'function' ? fn(...args) : defaultValue;
};

/**
 * Событие завершения CSS-перехода.
 * @type {string}
 */
const TRANSITION_END = 'transitionend';

/**
 * Множитель для мс.
 * @type {number}
 */
const MILLISECONDS_MULTIPLIER = 1000;

/**
 * Выполняет колбэк после CSS-перехода с fallback на setTimeout.
 * @param {Function} callback
 * @param {Element} element
 * @param {boolean} waitForTransition
 * @param {number} [timeoutMs]
 */
const executeAfterTransition = (callback, element, waitForTransition = true, timeoutMs) => {
	if (!element) {
		execute(callback);
		return;
	}

	if (!waitForTransition) {
		execute(callback);
		return;
	}

	const duration = timeoutMs ?? getTransitionDurationFromElement(element) + 5;
	let called = false;

	const handler = (e) => {
		if (e.target === element) {
			called = true;
			element.removeEventListener(TRANSITION_END, handler);
			execute(callback);
		}
	};

	element.addEventListener(TRANSITION_END, handler);
	setTimeout(() => {
		if (!called) triggerTransitionEnd(element);
	}, duration);
};

/**
 * Получает длительность CSS-перехода элемента в мс.
 * @param {Element} element
 * @returns {number}
 */
const getTransitionDurationFromElement = (element) => {
	if (!element) return 0;
	const { transitionDuration, transitionDelay } = getComputedStyle(element);

	const durations = transitionDuration.split(', ');
	const delays = transitionDelay.split(', ');

	const duration = Number.parseFloat(durations[0]) || 0;
	const delay = Number.parseFloat(delays[0]) || 0;

	return (duration + delay) * MILLISECONDS_MULTIPLIER;
};

/**
 * Принудительно вызывает событие перехода.
 * @param {Element} element
 */
const triggerTransitionEnd = (element) => {
	if (!element) return;
	element.dispatchEvent(new Event(TRANSITION_END));
};

/**
 * Принудительный рефлоу (для перезапуска анимаций).
 * @param {HTMLElement} element
 */
const reflow = (element) => {
	/* eslint-disable no-unused-expressions */
	element.offsetHeight;
	/* eslint-enable no-unused-expressions */
};

/**
 * Пустая функция-заглушка.
 */
const noop = () => {};

/**
 * Генерирует случайную строку.
 * @param {number} length
 * @returns {string}
 */
const makeRandomString = (length = 7) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

/**
 * Транслитерация: en ⇄ ru.
 * @param {string} text
 * @param {boolean} [enToRu=true] - true: en→ru, false: ru→en
 * @returns {string}
 */
const transliterate = (text, enToRu = true) => {
	const from = 'q w e r t y u i o p [ ] a s d f g h j k l ; \' z x c v b n m , .'.split(' ');
	const to = 'й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю'.split(' ');

	const src = enToRu ? from : to;
	const dst = enToRu ? to : from;

	let result = text;

	for (let i = 0; i < src.length; i++) {
		const srcLower = src[i];
		const dstLower = dst[i];
		const srcUpper = src[i].toUpperCase();
		const dstUpper = dst[i].toUpperCase();

		result = result.split(srcLower).join(dstLower).split(srcUpper).join(dstUpper);
	}

	return result;
};

/**
 * Получает следующий/предыдущий элемент с циклом.
 * @param {Array<Element>} list
 * @param {Element} active
 * @param {boolean} getNext
 * @param {boolean} cycle
 * @returns {Element}
 */
const getNextActiveElement = (list, active, getNext, cycle) => {
	const len = list.length;
	let idx = list.indexOf(active);

	if (idx === -1) return getNext || !cycle ? list[0] : list[len - 1];

	idx += getNext ? 1 : -1;
	if (cycle) idx = ((idx % len) + len) % len;

	return list[Math.max(0, Math.min(idx, len - 1))];
};

/**
 * Возвращает самый глубокий последний дочерний элемент.
 * @param {Element} el
 * @returns {Element}
 */
const getDeepestLastChild = (el) => {
	let node = el;
	while (node.lastElementChild) node = node.lastElementChild;
	return node;
};

/**
 * Проверяет, включён ли RTL.
 * @returns {boolean}
 */
const isRTL = () => document.documentElement.dir === 'rtl';

function isMobileDevice() {
	const userAgent = navigator.userAgent;
	const isMobileUA = /Android|iPhone|iPad|iPod/i.test(userAgent);
	const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
	const isSmallScreen = window.innerWidth < 768;
	const isHighDPI = window.devicePixelRatio >= 2;

	function detectIPadPro() {
		const userAgent = navigator.userAgent;
		const platform = navigator.platform;

		const isIPad = /iPad/.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);

		if (!isIPad) return { isiPadPro: false };

		const screenWidth = window.screen.width * window.devicePixelRatio;
		const screenHeight = window.screen.height * window.devicePixelRatio;

		const proResolutions = [
			{ width: 2048, height: 2732 }, // 12.9"
			{ width: 1668, height: 2388 }, // 11"
			{ width: 1668, height: 2224 }  // 10.5"
		];

		const isProResolution = proResolutions.some(res =>
			(screenWidth === res.width && screenHeight === res.height) ||
			(screenWidth === res.height && screenHeight === res.width)
		);

		return {
			isiPadPro: isProResolution,
			screenWidth: screenWidth,
			screenHeight: screenHeight,
			userAgent: userAgent,
			platform: platform
		};
	}

	return isMobileUA || (isTouchDevice && isSmallScreen && isHighDPI) || detectIPadPro().isiPadPro;
}

// экспорт
export {
	getDeepestLastChild,
	isElement,
	isVisible,
	isDisabled,
	isObject,
	isEmptyObj,
	mergeDeepObject,
	removeElementArray,
	normalizeData,
	execute,
	executeAfterTransition,
	reflow,
	noop,
	makeRandomString,
	isRTL,
	transliterate,
	getElement,
	getNextActiveElement,
	getTransitionDurationFromElement,
	triggerTransitionEnd,
	isMobileDevice
};