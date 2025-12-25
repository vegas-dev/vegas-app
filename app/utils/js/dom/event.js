/**
 * --------------------------------------------------------------------------
 * Bootstrap event.js (рефакторинг)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 * Утилита для гибкого управления DOM-событиями с поддержкой делегирования, пространств имён и one-off обработчиков.
 */

/**
 * ==================================
 * КОНСТАНТЫ
 * ==================================
 */

const NAMESPACE_REGEX = /[^.]*(?=\..*)\.|.*/
const STRIP_NAME_REGEX = /\..*/
const STRIP_UID_REGEX = /::\d+$/
const customEvents = {
	mouseenter: 'mouseover',
	mouseleave: 'mouseout'
};

// Список нативных событий для валидации
const nativeEvents = new Set([
	'click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu',
	'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove',
	'selectstart', 'selectend', 'submit', 'keydown', 'keypress', 'keyup',
	'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel',
	'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel',
	'popstate', 'gesturestart', 'gesturechange', 'gestureend',
	'focus', 'blur', 'change', 'reset', 'select', 'focusin', 'focusout',
	'load', 'unload', 'beforeunload', 'resize', 'move',
	'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll'
]);

/**
 * ==================================
 * ПРИВАТНЫЕ ПОЛЯ
 * ==================================
 */

const eventRegistry = {}; // Хранилище событий
let uidEvent = 1;         // Глобальный идентификатор

/**
 * ==================================
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 * ==================================
 */

/**
 * Генерирует уникальный ID для события.
 * @param {Element} element
 * @param {string|null} uid
 * @returns {string|number}
 */
const makeEventUid = (element, uid = null) => {
	if (!element.uidEvent) {
		element.uidEvent = uid ? `${uid}::${uidEvent++}` : uidEvent++;
	}
	return element.uidEvent;
};

/**
 * Получает или создаёт хранилище событий для элемента.
 * @param {Element} element
 * @returns {Object}
 */
const getElementEvents = (element) => {
	const uid = makeEventUid(element);
	eventRegistry[uid] = eventRegistry[uid] || {};
	return eventRegistry[uid];
};

/**
 * Создаёт обёртку для вызова обработчика.
 * @param {Element} element
 * @param {Function} fn
 * @param {boolean} isOneOff
 * @returns {Function}
 */
const createHandler = (element, fn, isOneOff) => {
	const handler = function (event) {
		hydrateObj(event, { delegateTarget: element });

		if (isOneOff) {
			EventHandler.off(element, event.type, fn);
		}

		return fn.apply(element, [event]);
	};

	handler.delegationSelector = null;
	handler.callable = fn;
	handler.oneOff = isOneOff;
	handler.uidEvent = null;

	return handler;
};

/**
 * Создаёт делегированный обработчик.
 * @param {Element} element
 * @param {string} selector
 * @param {Function} fn
 * @param {boolean} isOneOff
 * @returns {Function}
 */
const createDelegatedHandler = (element, selector, fn, isOneOff) => {
	const handler = function (event) {
		const candidates = Array.from(element.querySelectorAll(selector));
		for (let target = event.target; target && target !== element; target = target.parentNode) {
			if (!candidates.includes(target)) continue;

			hydrateObj(event, { delegateTarget: target });

			if (isOneOff) {
				EventHandler.off(element, event.type, selector, fn);
			}

			return fn.apply(target, [event]);
		}
	};

	handler.delegationSelector = selector;
	handler.callable = fn;
	handler.oneOff = isOneOff;
	handler.uidEvent = null;

	return handler;
};

/**
 * Обёртка для mouseenter/mouseleave.
 * @param {Function} fn
 * @returns {Function}
 */
const withRelatedTargetCheck = (fn) => {
	return function (event) {
		if (
			!event.relatedTarget ||
			(event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget))
		) {
			return fn.call(this, event);
		}
	};
};

/**
 * Нормализует параметры события.
 * @param {string} originalTypeEvent
 * @param {Function|string} handler
 * @param {Function} delegationFunction
 * @returns {[boolean, Function, string]}
 */
const normalizeParameters = (originalTypeEvent, handler, delegationFunction) => {
	const isDelegated = typeof handler === 'string';
	const callable = isDelegated ? delegationFunction : (handler || delegationFunction);
	let typeEvent = originalTypeEvent.replace(STRIP_NAME_REGEX, '');

	// Замена кастомных событий
	if (customEvents[typeEvent]) {
		typeEvent = customEvents[typeEvent];
	}

	// Если не нативное событие — оставляем как есть
	if (!nativeEvents.has(typeEvent)) {
		typeEvent = originalTypeEvent;
	}

	return [isDelegated, callable, typeEvent];
};

/**
 * Добавляет обработчик.
 * @param {Element} element
 * @param {string} originalTypeEvent
 * @param {Function|string} handler
 * @param {Function} delegationFunction
 * @param {boolean} oneOff
 */
const addHandler = (element, originalTypeEvent, handler, delegationFunction, oneOff) => {
	if (typeof originalTypeEvent !== 'string' || !element) return;

	const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
	const events = getElementEvents(element);
	const handlers = events[typeEvent] ||= {};
	const key = isDelegated ? handler : null;
	const existing = findHandler(handlers, callable, key);

	if (existing) {
		existing.oneOff = existing.oneOff && oneOff;
		return;
	}

	let fn = isDelegated
		? createDelegatedHandler(element, handler, callable, oneOff)
		: createHandler(element, callable, oneOff);

	const uid = makeEventUid(fn, originalTypeEvent.replace(NAMESPACE_REGEX, ''));
	fn.uidEvent = uid;
	handlers[uid] = fn;

	element.addEventListener(typeEvent, fn, isDelegated);
};

/**
 * Находит обработчик в хранилище.
 * @param {Object} handlers
 * @param {Function} callable
 * @param {string|null} delegationSelector
 * @returns {Object|undefined}
 */
const findHandler = (handlers, callable, delegationSelector) => {
	return Object.values(handlers).find(
		h => h.callable === callable && h.delegationSelector === delegationSelector
	);
};

/**
 * Удаляет обработчик.
 * @param {Element} element
 * @param {Object} events
 * @param {string} typeEvent
 * @param {Function} callable
 * @param {string|null} delegationSelector
 */
const removeHandler = (element, events, typeEvent, callable, delegationSelector) => {
	const handler = findHandler(events[typeEvent], callable, delegationSelector);
	if (!handler) return;

	element.removeEventListener(typeEvent, handler, Boolean(delegationSelector));
	delete events[typeEvent][handler.uidEvent];
};

/**
 * Удаляет обработчики по пространству имён.
 * @param {Element} element
 * @param {Object} events
 * @param {string} typeEvent
 * @param {string} namespace
 */
const removeNamespacedHandlers = (element, events, typeEvent, namespace) => {
	const handlers = events[typeEvent] || {};
	for (const [key, handler] of Object.entries(handlers)) {
		if (key.includes(namespace)) {
			removeHandler(element, events, typeEvent, handler.callable, handler.delegationSelector);
		}
	}
};

/**
 * Добавляет свойства в объект события, безопасно.
 * @param {Object} obj
 * @param {Object} meta
 * @returns {Object}
 */
const hydrateObj = (obj, meta = {}) => {
	for (const [key, value] of Object.entries(meta)) {
		try {
			obj[key] = value;
		} catch {
			Object.defineProperty(obj, key, {
				configurable: true,
				get() { return value; }
			});
		}
	}
	return obj;
};

/**
 * ==================================
 * ОСНОВНОЙ МОДУЛЬ: EventHandler
 * ==================================
 */

const EventHandler = {
	/**
	 * Добавляет прослушиватель события.
	 * @param {Element} element
	 * @param {string} event — тип события (с опциональным пространством имён)
	 * @param {Function|string} handler — селектор (если делегирование) или функция
	 * @param {Function} [delegationFunction] — функция, вызываемая при делегировании
	 */
	on(element, event, handler, delegationFunction) {
		addHandler(element, event, handler, delegationFunction, false);
	},

	/**
	 * Добавляет одноразовый обработчик.
	 * @param {Element} element
	 * @param {string} event
	 * @param {Function|string} handler
	 * @param {Function} [delegationFunction]
	 */
	one(element, event, handler, delegationFunction) {
		addHandler(element, event, handler, delegationFunction, true);
	},

	/**
	 * Удаляет обработчик(и).
	 * @param {Element} element
	 * @param {string} originalTypeEvent
	 * @param {Function|string} [handler]
	 * @param {Function} [delegationFunction]
	 */
	off(element, originalTypeEvent, handler, delegationFunction) {
		if (typeof originalTypeEvent !== 'string' || !element) return;

		const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
		const events = getElementEvents(element);
		const isNamespace = originalTypeEvent.startsWith('.');
		const inNamespace = typeEvent !== originalTypeEvent;

		// Удаление по пространству имён
		if (isNamespace) {
			for (const eventType of Object.keys(events)) {
				removeNamespacedHandlers(element, events, eventType, originalTypeEvent.slice(1));
			}
			return;
		}

		const storeElementEvent = events[typeEvent] || {};

		// Удаление конкретного обработчика
		if (typeof callable !== 'undefined') {
			removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
			return;
		}

		// Удаление всех обработчиков события
		for (const [key, eventObj] of Object.entries(storeElementEvent)) {
			const handlerKey = key.replace(STRIP_UID_REGEX, '');
			if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
				removeHandler(element, events, typeEvent, eventObj.callable, eventObj.delegationSelector);
			}
		}
	},

	/**
	 * Генерирует пользовательское событие.
	 * @param {Element} element
	 * @param {string} event — имя события
	 * @param {Object} [args] — дополнительные данные
	 * @returns {Object}
	 */
	trigger(element, event, args) {
		if (typeof event !== 'string' || !element) return null;

		const evt = hydrateObj(
			new CustomEvent(event, {
				bubbles: true,
				cancelable: true,
				detail: args
			}),
			args
		);

		element.dispatchEvent(evt);
		return evt;
	}
};

export default EventHandler;