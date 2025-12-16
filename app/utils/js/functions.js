/**
 * Набор скриптов для широкого применения
 * Включает утилиты для работы с DOM, типами данных, анимациями и массивами.
 * Все функции экспортируются для использования в других модулях.
 */

/**
 * Экранирование селекторов для корректной работы идентификаторов,
 * содержащих специальные символы (например, `#my-id:with-colon`).
 * Использует `CSS.escape()` при наличии поддержки в браузере.
 *
 * @param {string} selector - CSS-селектор, который необходимо экранировать
 * @returns {string} Экранированный селектор, пригодный для `document.querySelector`
 * @example
 * parseSelector('#user:input') → '#user\\:input'
 */
const parseSelector = (selector) => {
	if (selector && window.CSS && window.CSS.escape) {
		// document.querySelector needs escaping to handle IDs (html5+) containing for instance /
		selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
	}

	return selector;
};

/**
 * Проверяет, является ли объект пустым.
 * Объект считается пустым, если не содержит собственных перечисляемых свойств.
 *
 * @param {Object} obj - Объект для проверки
 * @returns {boolean} `true`, если объект пуст или не является объектом, иначе `false`
 * @example
 * isEmptyObj({}) → true
 * isEmptyObj({ a: 1 }) → false
 */
function isEmptyObj(obj) {
	for (let prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			return false;
		}
	}

	return true;
}

/**
 * Получает DOM-элемент по селектору или возвращает сам элемент, если передан.
 * Поддерживает jQuery-объекты (через `.jquery` и `[0]`).
 *
 * @param {string|Element|jQuery} object - Селектор строки, DOM-элемент или jQuery-объект
 * @returns {Element|null} Найденный DOM-элемент или `null`, если не найден
 * @example
 * getElement('#myId') → <div id="myId">...</div>
 * getElement(element) → element
 */
const getElement = (object) => {
	// it's a jQuery object or a node element
	if (isElement(object)) {
		return object.jquery ? object[0] : object;
	}

	if (typeof object === 'string' && object.length > 0) {
		return document.querySelector(parseSelector(object));
	}

	return null;
};

/**
 * Проверяет, является ли переданный объект DOM-элементом.
 *
 * @param {*} object - Объект для проверки
 * @returns {boolean} `true`, если объект является DOM-элементом, иначе `false`
 * @example
 * isElement(document.body) → true
 * isElement({}) → false
 */
const isElement = (object) => {
	if (!isObject(object)) {
		return false;
	}

	return typeof object.nodeType !== 'undefined';
};

/**
 * Проверяет, отключён ли DOM-элемент.
 * Учитывает класс `.disabled`, атрибут `disabled`, а также свойство `disabled`.
 *
 * @param {Element} element - DOM-элемент для проверки
 * @returns {boolean} `true`, если элемент отключён, иначе `false`
 * @example
 * isDisabled(document.querySelector('[disabled]')) → true
 */
const isDisabled = (element) => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) {
		return true;
	}

	if (element.classList.contains('disabled')) {
		return true;
	}

	if (typeof element.disabled !== 'undefined') {
		return element.disabled;
	}

	return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

/**
 * Проверяет, видим ли DOM-элемент.
 * Учитывает размеры (getClientRects), `visibility: hidden`, `details:not([open])` и `summary`.
 *
 * @param {Element} element - DOM-элемент для проверки видимости
 * @returns {boolean} `true`, если элемент видим, иначе `false`
 * @example
 * isVisible(button) → true
 */
function isVisible(element) {
	if (!isElement(element) || element.getClientRects().length === 0) {
		return false;
	}

	const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
	const closedDetails = element.closest('details:not([open])');

	if (!closedDetails) {
		return elementIsVisible;
	}

	if (closedDetails !== element) {
		const summary = element.closest('summary');
		if (summary && summary.parentNode !== closedDetails) {
			return false;
		}

		if (summary === null) {
			return false;
		}
	}

	return elementIsVisible;
}

/**
 * Проверяет, является ли значение объектом (включая массивы и null).
 *
 * @param {*} obj - Значение для проверки
 * @returns {boolean} `true`, если значение — объект, иначе `false`
 * @example
 * isObject({}) → true
 * isObject([]) → true
 * isObject(null) → false
 */
function isObject(obj) {
	return obj && typeof obj === 'object';
}

/**
 * Нормализует строку в соответствующий тип данных.
 * Преобразует строки в `true`, `false`, `null`, числа, JSON и т.д.
 *
 * @param {string|*} value - Значение для нормализации
 * @returns {*} Нормализованное значение: boolean, number, null, object, string и т.д.
 * @example
 * normalizeData('true') → true
 * normalizeData('{"a":1}') → { a: 1 }
 */
function normalizeData(value) {
	if (value === 'true') {
		return true;
	}

	if (value === 'false') {
		return false;
	}

	if (value === Number(value).toString()) {
		return Number(value);
	}

	if (value === '' || value === 'null') {
		return null;
	}

	if (typeof value !== 'string') {
		return value;
	}

	try {
		return JSON.parse(decodeURIComponent(value));
	} catch {
		return value;
	}
}

/**
 * Удаляет указанные элементы из массива.
 *
 * @param {Array} arr - Исходный массив
 * @param {Array} el - Массив элементов, которые нужно удалить
 * @returns {Array} Новый массив без указанных элементов
 * @example
 * removeElementArray([1, 2, 3], [2]) → [1, 3]
 */
function removeElementArray(arr, el) {
	return arr.filter((item) => !el.includes(item));
}

/**
 * Глубокое объединение нескольких объектов.
 * Поддерживает вложенные объекты и массивы (конкатенация).
 *
 * @param {...Object} objects - Объекты для объединения
 * @returns {Object} Новый объект с объединёнными данными
 * @example
 * mergeDeepObject({ a: [1] }, { a: [2] }) → { a: [1, 2] }
 * mergeDeepObject({ a: { b: 1 } }, { a: { c: 2 } }) → { a: { b: 1, c: 2 } }
 */
function mergeDeepObject(...objects) {
	const isObject = (obj) => obj && typeof obj === 'object';

	if (!isObject) return;

	return objects.reduce((prev, obj) => {
		Object.keys(obj).forEach((key) => {
			const pVal = prev[key];
			const oVal = obj[key];

			if (Array.isArray(pVal) && Array.isArray(oVal)) {
				prev[key] = pVal.concat(...oVal);
			} else if (isObject(pVal) && isObject(oVal)) {
				prev[key] = mergeDeepObject(pVal, oVal);
			} else {
				prev[key] = oVal;
			}
		});

		return prev;
	}, {});
}

/**
 * Выполняет функцию, если передан колбэк; иначе возвращает значение по умолчанию.
 *
 * @param {Function|*} possibleCallback - Функция или любое значение
 * @param {Array} [args=[]] - Аргументы для вызова функции
 * @param {*} [defaultValue=possibleCallback] - Значение по умолчанию, если колбэк не функция
 * @returns {*} Результат выполнения колбэка или `defaultValue`
 * @example
 * execute(() => 'hi') → 'hi'
 * execute('notFunc', [], 'fallback') → 'fallback'
 */
function execute(possibleCallback, args = [], defaultValue = possibleCallback) {
	return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
}

/**
 * Событие окончания CSS-перехода.
 * @type {string}
 */
const TRANSITION_END = 'transitionend';

/**
 * Множитель для перевода секунд в миллисекунды.
 * @type {number}
 */
const MILLISECONDS_MULTIPLIER = 1000;

/**
 * Выполняет колбэк после завершения CSS-перехода.
 * Использует `transitionend`, с fallback на `setTimeout`.
 *
 * @param {Function} callback - Функция, вызываемая после перехода
 * @param {Element} transitionElement - Элемент, за переходом которого нужно следить
 * @param {boolean} [waitForTransition=true] - Ожидать ли переход
 * @param {number} [timeOutMs] - Фиксированная задержка (вместо авто-определения)
 * @example
 * executeAfterTransition(() => console.log('done'), button)
 */
function executeAfterTransition(callback, transitionElement, waitForTransition = true, timeOutMs) {
	if (!waitForTransition) {
		execute(callback);
		return;
	}

	const durationPadding = 5;
	const emulatedDuration = timeOutMs ? timeOutMs : getTransitionDurationFromElement(transitionElement) + durationPadding;

	let called = false;

	const handler = ({ target }) => {
		if (target !== transitionElement) {
			return;
		}

		called = true;
		transitionElement.removeEventListener(TRANSITION_END, handler);
		execute(callback);
	};

	transitionElement.addEventListener(TRANSITION_END, handler);
	setTimeout(() => {
		if (!called) {
			triggerTransitionEnd(transitionElement);
		}
	}, emulatedDuration);
}

/**
 * Получает длительность CSS-перехода элемента в миллисекундах.
 * Учитывает `transition-duration` и `transition-delay`.
 *
 * @param {Element} element - DOM-элемент
 * @returns {number} Длительность перехода в миллисекундах
 * @example
 * getTransitionDurationFromElement(div) → 300
 */
const getTransitionDurationFromElement = (element) => {
	if (!element) {
		return 0;
	}

	// Get transition-duration of the element
	let { transitionDuration, transitionDelay } = window.getComputedStyle(element);

	const floatTransitionDuration = Number.parseFloat(transitionDuration);
	const floatTransitionDelay = Number.parseFloat(transitionDelay);

	// Return 0 if element or transition duration is not found
	if (!floatTransitionDuration && !floatTransitionDelay) {
		return 0;
	}

	// If multiple durations are defined, take the first
	transitionDuration = transitionDuration.split(',')[0];
	transitionDelay = transitionDelay.split(',')[0];

	return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};

/**
 * Принудительно генерирует событие окончания перехода на элементе.
 *
 * @param {Element} element - Элемент, на котором нужно вызвать событие
 * @example
 * triggerTransitionEnd(button)
 */
const triggerTransitionEnd = (element) => {
	element.dispatchEvent(new Event(TRANSITION_END));
};

/**
 * Принудительный рефлоу (пересчёт макета) для перезапуска CSS-анимаций.
 *
 * @param {HTMLElement} element - DOM-элемент
 * @returns {void}
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 * @example
 * reflow(myElement);
 */
const reflow = (element) => {
	element.offsetHeight; // eslint-disable-line no-unused-expressions
};

/**
 * Пустая функция, используемая как заглушка.
 *
 * @returns {void}
 * @example
 * someFunc || noop
 */
const noop = () => {};

/**
 * Генерирует случайную строку заданной длины.
 *
 * @param {number} [length=7] - Длина строки
 * @returns {string} Случайная строка из латинских букв и цифр
 * @example
 * makeRandomString(5) → 'aB3xY'
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
 * Транслитерация символов между кириллицей и латиницей.
 *
 * @param {string} text - Текст для транслитерации
 * @param {boolean} [enToRu=true] - Направление: `true` — en→ru, `false` — ru→en
 * @returns {string} Транслитерированный текст
 * @example
 * transliterate('privet', true) → 'привет'
 * transliterate('привет', false) → 'privet'
 */
function transliterate(text, enToRu) {
	let ru = 'й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю'.split(/ +/g);
	let en = 'q w e r t y u i o p [ ] a s d f g h j k l ; \' z x c v b n m , .'.split(/ +/g);
	let x;

	for (x = 0; x < ru.length; x++) {
		text = text.split(enToRu ? en[x] : ru[x]).join(enToRu ? ru[x] : en[x]);
		text = text
			.split(enToRu ? en[x].toUpperCase() : ru[x].toUpperCase())
			.join(enToRu ? ru[x].toUpperCase() : en[x].toUpperCase());
	}

	return text;
}

/**
 * Возвращает следующий или предыдущий элемент в списке.
 * Поддерживает циклическое переключение.
 *
 * @param {Array<Element>} list - Массив DOM-элементов
 * @param {Element} activeElement - Текущий активный элемент
 * @param {boolean} shouldGetNext - `true` — следующий, `false` — предыдущий
 * @param {boolean} isCycleAllowed - Разрешить цикл (с конца к началу и наоборот)
 * @returns {Element} Следующий/предыдущий элемент
 * @example
 * getNextActiveElement(items, current, true, true) → следующий элемент (с циклом)
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
	const listLength = list.length;
	let index = list.indexOf(activeElement);

	// if the element does not exist in the list return an element
	// depending on the direction and if cycle is allowed
	if (index === -1) {
		return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
	}

	index += shouldGetNext ? 1 : -1;

	if (isCycleAllowed) {
		index = (index + listLength) % listLength;
	}

	return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * Рекурсивно возвращает самый глубокий последний дочерний элемент.
 *
 * @param {Element} element - Родительский элемент
 * @returns {Element} Самый вложенный `lastElementChild`
 * @example
 * getDeepestLastChild(div) → <span>...</span>
 */
function getDeepestLastChild(element) {
	let current = element;

	while (current.lastElementChild) {
		current = current.lastElementChild;
	}

	return current;
}

/**
 * Проверяет, используется ли направление текста справа налево (RTL).
 *
 * @returns {boolean} `true`, если `dir="rtl"`, иначе `false`
 * @example
 * isRTL() → true (если <html dir="rtl">)
 */
const isRTL = () => document.documentElement.dir === 'rtl';

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
};