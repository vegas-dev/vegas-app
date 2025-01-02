var vg;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app/_utils/js/backdrop.js":
/*!***********************************!*\
  !*** ./app/_utils/js/backdrop.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectors */ "./app/_utils/js/selectors.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./app/_utils/js/event.js");
/* harmony import */ var _overflow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overflow */ "./app/_utils/js/overflow.js");




const NAME = 'backdrop';
const CLASS_NAME = 'vg-backdrop';
const CLASS_NAME_FADE = 'fade';
const EVENT_MOUSEDOWN = `mousedown.vg.${NAME}`;
class Backdrop {
  static show(callback) {
    Backdrop._append();
    (0,_functions__WEBPACK_IMPORTED_MODULE_0__.execute)(callback);
  }
  static hide(callback) {
    Backdrop._destroy();
    (0,_functions__WEBPACK_IMPORTED_MODULE_0__.execute)(callback);
  }
  static _append() {
    if (_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.' + CLASS_NAME)) {
      return false;
    }
    let backdrop = document.createElement('div');
    backdrop.classList.add(CLASS_NAME);
    document.body.append(backdrop);
    setTimeout(() => {
      backdrop.classList.add(CLASS_NAME_FADE);
    }, 50);
    _event__WEBPACK_IMPORTED_MODULE_2__["default"].on(backdrop, EVENT_MOUSEDOWN, () => {
      Backdrop.hide();
      _overflow__WEBPACK_IMPORTED_MODULE_3__["default"].destroy();
    });
  }
  static _destroy() {
    let element = _selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.' + CLASS_NAME);
    if (!element) return;
    element.classList.remove(CLASS_NAME_FADE);
    setTimeout(() => {
      element.remove();
    }, 500);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Backdrop);

/***/ }),

/***/ "./app/_utils/js/data.js":
/*!*******************************!*\
  !*** ./app/_utils/js/data.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

const elementMap = new Map();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }
    const instanceMap = elementMap.get(element);
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      console.error(`VGApp не допускает более одного экземпляра для каждого элемента. Связанный экземпляр: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
});

/***/ }),

/***/ "./app/_utils/js/event.js":
/*!********************************!*\
  !*** ./app/_utils/js/event.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * --------------------------------------------------------------------------
 * Bootstrap event.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 * Скрипт для прослушивания события
 */

/**
 * Константы
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'submit', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

/**
 * Приватные методы
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }
    return fn.apply(element, [event]);
  };
}
function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }
        hydrateObj(event, {
          delegateTarget: target
        });
        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }
        return fn.apply(target, [event]);
      }
    }
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: выдает "false" вместо селектора, поэтому нужно проверить. boot
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn) {
    return;
  }
  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}
function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}
function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}

/**
 * События
 * @type {{one(*, *, *, *): void, trigger(*, *, *): (null|*), off(*, *, *, *): void, on(*, *, *, *): void}}
 */
const EventHandler = {
  /**
   * Прослушиватель событий (элемент, событие (полный список смотри в константе nativeEvents, источник события или хендлер, функция обратного вызова))
   * @param element
   * @param event
   * @param handler
   * @param delegationFunction
   */
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },
  /**
   * Прослушиватель событий, но замыкается и больше не повторяется на элементе
   * @param element
   * @param event
   * @param handler
   * @param delegationFunction
   */
  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },
  /**
   * Удаление обработчика
   * @param element
   * @param originalTypeEvent
   * @param handler
   * @param delegationFunction
   */
  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');
    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },
  /**
   * Пользовательские события. Подробнее тут https://learn.javascript.ru/dispatch-events
   * @param element
   * @param event
   * @param args
   * @returns {*|null}
   */
  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    const evt = hydrateObj(new Event(event, {
      bubbles,
      cancelable: true
    }), args);
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    return evt;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventHandler);

/***/ }),

/***/ "./app/_utils/js/functions.js":
/*!************************************!*\
  !*** ./app/_utils/js/functions.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   execute: () => (/* binding */ execute),
/* harmony export */   executeAfterTransition: () => (/* binding */ executeAfterTransition),
/* harmony export */   isDisabled: () => (/* binding */ isDisabled),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isEmptyObj: () => (/* binding */ isEmptyObj),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isVisible: () => (/* binding */ isVisible),
/* harmony export */   mergeDeepObject: () => (/* binding */ mergeDeepObject),
/* harmony export */   noop: () => (/* binding */ noop),
/* harmony export */   normalizeData: () => (/* binding */ normalizeData),
/* harmony export */   removeElementArray: () => (/* binding */ removeElementArray)
/* harmony export */ });
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
  return true;
}

/**
 * isElement
 * @param object
 * @returns {boolean}
 */
const isElement = object => {
  if (!isObject(object)) {
    return false;
  }
  return typeof object.nodeType !== 'undefined';
};

/**
 * isDisabled
 * @param element
 * @returns {boolean}
 */
const isDisabled = element => {
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
 * isObject
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
  return obj && typeof obj === 'object';
}

/**
 * Приводим в порядок типы данных
 * @param value
 * @returns {any}
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
 * Удаляем элементы с массива
 * @param arr
 * @param el
 */
function removeElementArray(arr, el) {
  return arr.filter(item => !el.includes(item));
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
 * Callback
 * @param possibleCallback
 * @param args
 * @param defaultValue
 * @returns {*}
 */
function execute(possibleCallback, args = [], defaultValue = possibleCallback) {
  return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
}

/**
 * Transition
 * @param callback
 * @param transitionElement
 * @param waitForTransition
 */
const TRANSITION_END = 'transitionend';
const MILLISECONDS_MULTIPLIER = 1000;
function executeAfterTransition(callback, transitionElement, waitForTransition = true, timeOutMs) {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = timeOutMs ? timeOutMs : getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler = ({
    target
  }) => {
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
const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  }

  // Get transition-duration of the element
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
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
const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

/**
 * Noop
 */
const noop = () => {};


/***/ }),

/***/ "./app/_utils/js/manipulator.js":
/*!**************************************!*\
  !*** ./app/_utils/js/manipulator.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Manipulator: () => (/* binding */ Manipulator)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./app/_utils/js/functions.js");


/**
 * Манипуляции с атрибутами у элемента:
 * get (элемент, имя, флаг - вырезать data-) - метод выбирает значение атрибута по его имени, если в поле имени передать 'data' -> будут выбраны только дата атрибуты, если 'all' -> метод вернет значение всех атрибутов
 * has (элемент, имя) - есть ли атрибут у элемента
 * set (элемент, имя, значение) - установка у элемента атрибута или его изменение
 * remove (элемент, имя) - удаляет атрибут у элемента
 */
const Manipulator = {
  get(element, nameAttribute = 'data', isRemoveDataName = true) {
    if (!element) {
      return {};
    }
    if (nameAttribute === 'data') {
      let elmBase = ['data-vg-toggle', 'data-vg-target', 'data-vg-dismiss'],
        attributes = {};
      let arr = [].filter.call(element.attributes, function (at) {
        return /^data-/.test(at.name);
      });
      if (arr.length) {
        arr.forEach(function (v) {
          let name = v.name;
          if (!elmBase.includes(name)) {
            if (isRemoveDataName) name = name.slice(5);
            attributes[name] = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.normalizeData)(v.value);
          }
        });
      }
      return attributes;
    } else if (nameAttribute === 'all') {
      return element.getAttributeNames().reduce((acc, name) => {
        return {
          ...acc,
          [name]: element.getAttribute(name)
        };
      }, {});
    } else {
      return element.getAttribute(nameAttribute);
    }
  },
  has(element, nameAttribute) {
    return element.hasAttribute(nameAttribute);
  },
  set(element, name, value) {
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) && name && value) {
      element.setAttribute(name, value);
    }
  },
  remove(element, nameAttribute) {
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) && nameAttribute) {
      element.removeAttribute(nameAttribute);
    }
  }
};


/***/ }),

/***/ "./app/_utils/js/module-fn.js":
/*!************************************!*\
  !*** ./app/_utils/js/module-fn.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ajax: () => (/* binding */ Ajax),
/* harmony export */   dismissTrigger: () => (/* binding */ dismissTrigger),
/* harmony export */   getSVG: () => (/* binding */ getSVG)
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event */ "./app/_utils/js/event.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./app/_utils/js/selectors.js");




/**
 * Тут собраны вспомогательные скрипты для работы модулей
 */

/**
 * Набор svg элементов
 * @param name
 * @returns {*|{}}
 */
const getSVG = name => {
  const svg = {
    error: '',
    success: '',
    dots: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',
    cross: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 224.512 224.512" xml:space="preserve"><g><polygon points="224.507,6.997 217.521,0 112.256,105.258 6.998,0 0.005,6.997 105.263,112.254 0.005,217.512 6.998,224.512 112.256,119.24 217.521,224.512 224.507,217.512 119.249,112.254 "/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>'
  };
  return svg[name] ?? {};
};

/**
 * Вешаем событие "Закрыть" на все модалки, сайдбары и т.п.
 * @param module
 * @param method
 */
const dismissTrigger = (module, method = 'hide') => {
  const clickEvent = `click.dismiss.${module.EVENT_KEY}`;
  const name = module.NAME;
  _event__WEBPACK_IMPORTED_MODULE_0__["default"].on(document, clickEvent, `[data-vg-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) {
      return;
    }
    const target = _selectors__WEBPACK_IMPORTED_MODULE_2__["default"].getTargetFromSelector(this) || this.closest(`.vg-${name}`);
    const instance = module.getOrCreateInstance(target);
    instance[method]();
  });
};

/**
 * AJAX REQUEST
 * @type {{post: ajax.post, get: ajax.get, x: ((function(): (XMLHttpRequest))|*), send: ajax.send}}
 */
const Ajax = {
  /**
   * Инициализирует http запросы
   * @returns {XMLHttpRequest|*}
   */
  x() {
    if (typeof XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    let versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"],
      xhr;
    for (let i = 0; i < versions.length; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      } catch (e) {}
    }
    return xhr;
  },
  /**
   * Отправляет запросы и принимает ответ
   * @param url
   * @param method
   * @param data
   * @param callback
   * @param async
   */
  send(url, method, data, callback, async) {
    if (async === undefined) async = true;
    let x = Ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
      if (x.readyState === 4) {
        switch (x.status) {
          case 200:
            (0,_functions__WEBPACK_IMPORTED_MODULE_1__.execute)(callback, ['success', x.responseText]);
            break;
          default:
            (0,_functions__WEBPACK_IMPORTED_MODULE_1__.execute)(callback, ['error', x.statusText]);
            break;
        }
      }
    };
    x.send(data);
  },
  /**
   * Отправляет и принимает GET запросы
   * @param url
   * @param data
   * @param callback
   * @param async
   */
  get(url, data, callback, async) {
    let query = [];
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_1__.isObject)(data) && !(0,_functions__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(data)) {
      for (let key of data) {
        query.push(encodeURIComponent(key[0]) + '=' + encodeURIComponent(key[1]));
      }
    }
    Ajax.send(url + (query.length ? '?' + query.join('&') : ''), 'GET', null, callback, async);
  },
  /**
   * Отправляет и принимает POST запросы
   * @param url
   * @param data
   * @param callback
   * @param async
   */
  post(url, data, callback, async) {
    Ajax.send(url, callback, 'POST', data, async);
  }
};


/***/ }),

/***/ "./app/_utils/js/overflow.js":
/*!***********************************!*\
  !*** ./app/_utils/js/overflow.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _manipulator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./manipulator */ "./app/_utils/js/manipulator.js");


/**
 * Класс Overflow
 * Запрещает скроллинг и убирает его, компенсируя отступом
 */

class Overflow {
  static append() {
    document.body.style.paddingRight = getWidth() + 'px';
    document.body.style.overflow = 'hidden';
    function getWidth() {
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
  }
  static destroy() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    let styles = _manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.get(document.body, 'style');
    if (!styles) _manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.remove(document.body, 'style');
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Overflow);

/***/ }),

/***/ "./app/_utils/js/params.js":
/*!*********************************!*\
  !*** ./app/_utils/js/params.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manipulator */ "./app/_utils/js/manipulator.js");



/**
 * Класс Params, собирает все "параметры" для работы модулей, являясь для них отправной точкой
 */

class Params {
  static get Default() {
    return {};
  }
  _getParams(params, element) {
    params = this._mergeParamsObj(params, element);
    params = this._paramsAfterMerge(params);
    return params;
  }
  _paramsAfterMerge(params) {
    let pDefault = this.constructor.Default,
      mParams = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(pDefault, params);
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isObject)(mParams) && !(0,_functions__WEBPACK_IMPORTED_MODULE_0__.isEmptyObj)(mParams)) {
      for (const datum in mParams) {
        let value = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.normalizeData)(mParams[datum]);
        if (datum !== 'params') {
          if (!(datum in pDefault)) {
            let p = datum.split('-');
            if (pDefault[p[0]] && p[1] in pDefault[p[0]]) {
              pDefault[p[0]][p[1]] = value;
            }
            delete mParams[datum];
          } else {
            mParams[datum] = value;
          }
        } else {
          mParams = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(mParams, value);
          delete mParams[datum];
        }
      }
    }
    return mParams;
  }
  _mergeParamsObj(params, element) {
    return (0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(element), params) : {};
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Params);

/***/ }),

/***/ "./app/_utils/js/placement.js":
/*!************************************!*\
  !*** ./app/_utils/js/placement.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./app/_utils/js/functions.js");


/**
 * Класс Placement, определяет и устанавливает местоположение элемента на странице.
 * TODO класс не дописан
 */

class Placement {
  constructor(arg = {}) {
    this.params = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)({
      element: null,
      drop: null
    }, arg);
  }
  _getPlacement() {
    const _this = this;
    const _parent = self => {
      let parent = self.parentNode,
        overflow = getComputedStyle(parent).overflow;
      if (parent.tagName !== 'BODY') {
        if (overflow === 'visible') {
          _parent(parent);
        } else {
          return parent;
        }
      } else {
        return null;
      }
    };
    let isFixed = false,
      top,
      left,
      bounds = _this.params.drop.getBoundingClientRect(),
      parent = _this.params.element.getBoundingClientRect();
    if (_parent(_this.params.element)) {
      isFixed = true;
      top = bounds.top;
      left = bounds.left;
    } else {
      let styles = getComputedStyle(_this.params.drop);
      top = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.normalizeData)(styles.top.slice(0, -2));
      left = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.normalizeData)(styles.left.slice(0, -2));
    }
    if (bounds.left + bounds.width > window.innerWidth) {
      left = parent.width - bounds.width;
    }
    return {
      isFixed: isFixed,
      top: top,
      left: left
    };
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Placement);

/***/ }),

/***/ "./app/_utils/js/responsive.js":
/*!*************************************!*\
  !*** ./app/_utils/js/responsive.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Класс Responsive, работает по таким же медиа точкам, что и bootstrap
 * и определяет на тач устройства.
 */

class Responsive {
  constructor() {
    this.breakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
      xxxl: 1600
    };
  }

  /**
   * Если наша ширина экрана совпадает с диапазоном который указан в модуле выдаем true, иначе false
   * @param module
   * @returns {boolean}
   */
  static check(module) {
    let instance = new this();
    return instance.define(module);
  }

  /**
   * Проверяет на тач устройства. TODO не совсем правильно, надо сделать по-другому
   * @returns {boolean}
   */
  static checkMobileOrTablet() {
    let check = false;
    (function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.slice(0, 4))) {
        check = true;
      }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
  define(module) {
    let windowWidth = window.innerWidth,
      responsive_size = this._checkResponsiveClass(module),
      breakpoints = this.breakpoints,
      point = Object.keys(breakpoints).find(key => breakpoints[key] === responsive_size);
    let keys = Object.keys(breakpoints),
      loc = keys.indexOf(point);
    return windowWidth >= breakpoints[keys[loc + 1]];
  }
  _checkResponsiveClass(module) {
    let element = module.element,
      params = module.params,
      current_responsive_size = 0;
    if (element.classList.contains(params.classes.XXXL)) {
      current_responsive_size = this.breakpoints.xxxl;
    } else if (element.classList.contains(params.classes.XXL)) {
      current_responsive_size = this.breakpoints.xxl;
    } else if (element.classList.contains(params.classes.XL)) {
      current_responsive_size = this.breakpoints.xl;
    } else if (element.classList.contains(params.classes.LG)) {
      current_responsive_size = this.breakpoints.lg;
    } else if (element.classList.contains(params.classes.MD)) {
      current_responsive_size = this.breakpoints.md;
    } else if (element.classList.contains(params.classes.SM)) {
      current_responsive_size = this.breakpoints.sm;
    } else if (element.classList.contains(params.classes.XS)) {
      current_responsive_size = this.breakpoints.xs;
    } else {
      current_responsive_size = this.breakpoints.xs;
    }
    return current_responsive_size;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Responsive);

/***/ }),

/***/ "./app/_utils/js/selectors.js":
/*!************************************!*\
  !*** ./app/_utils/js/selectors.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./app/_utils/js/functions.js");


/**
 * Работа с DOM
 * TODO переработать константу Selectors
 * @param selector
 * @returns {*}
 */

const parseSelector = selector => {
  if (selector && window.CSS && window.CSS.escape) {
    selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
  }
  return selector;
};
const getSelector = element => {
  let selector = element.getAttribute('data-vg-target');
  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href');
    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    }
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }
  return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
};
const Selectors = {
  get(el, container) {
    if (!el) {
      throw new Error('Товарищ! Первый параметр не должен быть пустым!');
    } else {
      if (typeof el === 'string') {
        let elm = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(container) ? Selectors.findOne(el, container) : Selectors.findOne(el);
        if (elm) return elm;else throw new Error('Ахпер! Не удалось найти элемент');
      } else if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(el)) {
        return el;
      } else {
        throw new Error('КЭП! Какая-то дичь к нам залетела');
      }
    }
  },
  findAll(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  getTargetFromSelector(selector) {
    let _selector = null;
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(selector)) {
      _selector = selector;
    } else if (typeof selector === 'string') {
      _selector = Selectors.findOne(selector);
    }
    let target = getSelector(_selector);
    if (!target) return null;
    let _targetSelector = Selectors.findOne(target);
    if (_targetSelector) return _targetSelector;
    return null;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Selectors);

/***/ }),

/***/ "./app/modules/base-module.js":
/*!************************************!*\
  !*** ./app/modules/base-module.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_utils/js/functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _utils_js_params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_utils/js/params */ "./app/_utils/js/params.js");
/* harmony import */ var _utils_js_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_utils/js/data */ "./app/_utils/js/data.js");
/* harmony import */ var _utils_js_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_utils/js/selectors */ "./app/_utils/js/selectors.js");
/* harmony import */ var _utils_js_event__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_utils/js/event */ "./app/_utils/js/event.js");
/* harmony import */ var _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_utils/js/module-fn */ "./app/_utils/js/module-fn.js");







class BaseModule extends _utils_js_params__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(element, params) {
    super();
    this._element = null;
    this._params = {};
    this.element = element;
    this.params = params;
    _utils_js_data__WEBPACK_IMPORTED_MODULE_2__["default"].set(this.element, this.constructor.NAME_KEY, this);
  }
  get element() {
    return this._element;
  }
  set element(el) {
    this._element = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].get(el);
  }
  get params() {
    return this._params;
  }
  set params(params) {
    this._params = this._getParams(params, this.element);
  }
  static get NAME_KEY() {
    return '';
  }
  static get NAME() {
    return '';
  }
  static getInstance(element) {
    return _utils_js_data__WEBPACK_IMPORTED_MODULE_2__["default"].get(_utils_js_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].get(element), this.NAME_KEY);
  }
  static getOrCreateInstance(element, params = {}) {
    return this.getInstance(element) || new this(element, !(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.isEmptyObj)(params) ? params : {});
  }
  dispose() {
    _utils_js_data__WEBPACK_IMPORTED_MODULE_2__["default"].remove(this.element, this.constructor.NAME_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }
  _route(callback) {
    const _this = this;
    let $content = null;
    if (!_this.params.hasOwnProperty('ajax')) {
      return;
    }
    if (!'route' in _this.params.ajax && !_this.params.ajax.route) {
      return;
    }
    if ('target' in _this.params.ajax && _this.params.ajax.target) {
      $content = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].findOne(_this.params.ajax.target);
    }
    const setData = data => {
      if ($content) $content.innerHTML = data;
    };
    if (!'method' in _this.params.ajax) {
      _this.params.ajax.method = 'get';
    }
    if (_this.params.ajax.method === 'get') {
      _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_5__.Ajax.get(_this.params.ajax.route, _this.params.ajax.data || {}, function (status, data) {
        setData(data);
        (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.execute)(callback, [status, data]);
        _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(_this.element, _this.NAME_KEY + '.loaded');
      });
    }
    if (_this.params.ajax.method === 'post') {
      console.log(_this.params.ajax);
      _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_5__.Ajax.post(_this.params.ajax.route, {}, function (status, data) {
        setData(data);
        (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.execute)(callback, [status, data]);
        _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(_this.element, _this.NAME_KEY + '.loaded');
      });
    }
  }
  _dismissElement() {
    let cross = (0,_utils_js_module_fn__WEBPACK_IMPORTED_MODULE_5__.getSVG)('cross'),
      button = this.element.querySelector('.vg-btn-close');
    if (button) {
      let svg = button.querySelector('svg');
      if (!svg) button.insertAdjacentHTML('beforeend', cross);
    }
  }
  _queueCallback(callback, element, isAnimated = true, timeOutMs) {
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.executeAfterTransition)(callback, element, isAnimated, timeOutMs);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BaseModule);

/***/ }),

/***/ "./app/modules/dropdown/js/vgdropdown.js":
/*!***********************************************!*\
  !*** ./app/modules/dropdown/js/vgdropdown.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_utils/js/event */ "./app/_utils/js/event.js");
/* harmony import */ var _utils_js_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_utils/js/selectors */ "./app/_utils/js/selectors.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_utils/js/functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _utils_js_placement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../_utils/js/placement */ "./app/_utils/js/placement.js");





const NAME = 'dropdown';
const NAME_KEY = 'vg.dropdown';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade';
const TARGET_CONTAINER = 'vg-dropdown-content';
const PARENT_CONTAINER = 'vg-dropdown';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="dropdown"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEYUP_DATA_API = `keyup.${NAME_KEY}.data.api`;
const EVENT_KEYDOWN_DATA_API = `keydown.${NAME_KEY}.data.api`;
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}.data.api`;
const EVENT_MOUSEOUT_DATA_API = `mouseout.${NAME_KEY}.data.api`;
const PARAMS_DEFAULT = {
  offset: [0, 2],
  over: false,
  backdrop: true,
  overflow: true,
  keyboard: true,
  placement: 'bottom',
  animation: true,
  timeoutAnimation: 300,
  hover: false,
  ajax: {
    route: '',
    target: ''
  }
};
class VGDropdown extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params) {
    super(element, params);
    this._parent = this.element.parentNode;
    this._drop = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].get('.' + TARGET_CONTAINER, this._parent);
    this._isPlacement = false;
    if (this.params.animation === false) {
      this.params.timeoutAnimation = 10;
    }
  }
  static get Default() {
    return PARAMS_DEFAULT;
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this.element) || this._isShown()) return;
    const relatedTarget = {
      relatedTarget: this.element
    };
    const showEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_SHOW, relatedTarget);
    if (showEvent.defaultPrevented) return;
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.noop);
      }
    }
    this._route();
    this.element.setAttribute('aria-expanded', true);
    this.element.classList.add(CLASS_NAME_SHOW);
    this._drop.classList.add(CLASS_NAME_SHOW);
    this._setPlacement();
    const completeCallBack = () => {
      this._drop.classList.add(CLASS_NAME_FADE);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this.element, EVENT_KEY_SHOWN, relatedTarget);
    };
    this._queueCallback(completeCallBack, this._drop, true, 50);
  }
  hide() {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this.element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this.element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    return super.dispose();
  }
  _isShown() {
    return this.element.classList.contains(CLASS_NAME_SHOW);
  }
  _completeHide(relatedTarget) {
    const hideEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this.element, EVENT_KEY_HIDE, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].off(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.noop);
      }
    }
    this._drop.classList.remove(CLASS_NAME_FADE);
    this.element.classList.remove(CLASS_NAME_SHOW);
    this.element.setAttribute('aria-expanded', 'false');
    const completeCallback = () => {
      this._drop.classList.remove(CLASS_NAME_SHOW);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this.element, EVENT_KEY_HIDDEN, relatedTarget);
    };
    this._queueCallback(completeCallback, this._parent, true, this.params.timeoutAnimation);
  }

  // TODO class Placement isn't done
  _setPlacement() {
    const _this = this;
    if (!_this._isPlacement) {
      let placement = new _utils_js_placement__WEBPACK_IMPORTED_MODULE_4__["default"]({
        element: this._parent,
        drop: this._drop
      })._getPlacement();
      if (placement.isFixed) {
        _this._drop.style.position = 'fixed';
        _this._drop.style.transform = 'translateY(-20%)'; // todo this is костыль поfixить
      }
      _this._drop.style.left = placement.left + 'px';
      _this._drop.style.top = placement.top + 'px';
    }
    if (_this.params.offset) {
      _this._drop.style.paddingTop = _this.params.offset[1] + 'px';
      _this._drop.style.paddingRight = _this.params.offset[0] + 'px';
    }
    _this._isPlacement = true;
  }
  static init(element, params = {}) {
    const instance = VGDropdown.getOrCreateInstance(element, params);
    if (instance.params.hover) {
      let currentElem = null;
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(instance._parent, EVENT_MOUSEOVER_DATA_API, function (event) {
        if (currentElem) return;
        VGDropdown.hideOpenToggles(event);
        let target = event.target.closest('.' + PARENT_CONTAINER);
        if (!target) return;
        if (!instance._parent.contains(target)) return;
        currentElem = target;
        instance.show();
      });
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(instance._parent, EVENT_MOUSEOUT_DATA_API, function (event) {
        if (!currentElem) return;
        let relatedTarget = event.relatedTarget;
        while (relatedTarget) {
          if (relatedTarget === currentElem) return;
          relatedTarget = relatedTarget.parentNode;
        }
        currentElem = null;
        instance._completeHide({
          relatedTarget: instance._element
        });
      });
    } else {
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEYUP_DATA_API, SELECTOR_DATA_TOGGLE, VGDropdown.keydownHandler);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEYDOWN_DATA_API, '.' + TARGET_CONTAINER, VGDropdown.keydownHandler);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEYUP_DATA_API, VGDropdown.clearDrops);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_CLICK_DATA_API, VGDropdown.clearDrops);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(element, EVENT_CLICK_DATA_API, function (event) {
        event.preventDefault();
        instance.toggle();
      });
    }
  }
  static hideOpenToggles(event) {
    const openToggles = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].findAll('[data-vg-toggle="dropdown"]:not(.disabled):not(:disabled).show');
    for (const toggle of openToggles) {
      const context = VGDropdown.getInstance(toggle);
      if (!context) {
        continue;
      }
      if (event.target.closest('.' + TARGET_CONTAINER) === context._drop) {
        return;
      }
      const composedPath = event.composedPath();
      if (composedPath.includes(context._element)) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      context._completeHide(relatedTarget);
    }
  }
  static keydownHandler(event) {
    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === 'Escape';
    const isUpOrDownEvent = ['ArrowUp', 'ArrowDown'].includes(event.key);
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    event.preventDefault();
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ? this : _utils_js_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].prev(this, SELECTOR_DATA_TOGGLE)[0] || _utils_js_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].next(this, SELECTOR_DATA_TOGGLE)[0] || _utils_js_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode);
    const instance = VGDropdown.getOrCreateInstance(getToggleButton);
    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();
      return;
    }
    if (instance._isShown()) {
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }
  static clearDrops(event) {
    if (event.button === 2 || event.type === 'keyup' && event.key !== 'Tab') {
      return;
    }
    VGDropdown.hideOpenToggles(event);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGDropdown);

/***/ }),

/***/ "./app/modules/modal/js/vgmodal.js":
/*!*****************************************!*\
  !*** ./app/modules/modal/js/vgmodal.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_utils/js/selectors */ "./app/_utils/js/selectors.js");
/* harmony import */ var _utils_js_backdrop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_utils/js/backdrop */ "./app/_utils/js/backdrop.js");
/* harmony import */ var _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_utils/js/overflow */ "./app/_utils/js/overflow.js");
/* harmony import */ var _utils_js_event__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../_utils/js/event */ "./app/_utils/js/event.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../_utils/js/functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../_utils/js/module-fn */ "./app/_utils/js/module-fn.js");








/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade';
const SELECTOR_DIALOG = '.vg-modal-dialog';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="modal"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const PARAMS_DEFAULT = {
  button: null,
  backdrop: true,
  overflow: true,
  keyboard: true,
  ajax: {
    route: '',
    target: ''
  }
};
class VgModal extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._dialog = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne(SELECTOR_DIALOG, this.element);
    this._addEventListeners();
    this._dismissElement();
  }
  static get Default() {
    return PARAMS_DEFAULT;
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_5__.isDisabled)(_this.element)) return;
    this._route();
    const showEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    if (_this.params.backdrop) {
      _utils_js_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].show();
    }
    if (_this.params.overflow) {
      _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__["default"].append();
    }
    if (this._isAnimated()) {
      this.element.classList.add(CLASS_NAME_FADE);
    }
    _this.element.classList.add(CLASS_NAME_SHOW);
    const completeCallBack = () => {
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(_this.element, 'mousedown.vg.modal', function (event) {
        const modalContent = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].get('.vg-modal-content', this);
        if (!modalContent.contains(event.target)) {
          _this.hide();
        }
      });
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this.element, true, 50);
  }
  hide() {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_5__.isDisabled)(_this.element)) return;
    const hideEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    if (_this.params.backdrop) {
      _utils_js_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].hide(function () {
        if (_this.params.overflow) {
          _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__["default"].destroy();
        }
      });
    }
    if (_this.params.overflow) {
      _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__["default"].destroy();
    }
    _this.element.setAttribute('aria-expanded', false);
    _this.element.classList.remove(CLASS_NAME_SHOW);
    const completeCallback = () => {
      if (this._isAnimated()) {
        this.element.classList.remove(CLASS_NAME_FADE);
      }
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_HIDDEN);
    };
    this._queueCallback(completeCallback, this.element, this._isAnimated());
  }
  _isShown() {
    return this.element.classList.contains(CLASS_NAME_SHOW);
  }
  _isAnimated() {
    return this.element.classList.contains(CLASS_NAME_FADE);
  }
  _addEventListeners() {
    _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== 'Escape') {
        return;
      }
      if (this.params.keyboard) {
        this.hide();
        return;
      }
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_HIDE_PREVENTED);
    });
  }
}
(0,_utils_js_module_fn__WEBPACK_IMPORTED_MODULE_6__.dismissTrigger)(VgModal);

/**
 * Data API implementation
 */

_utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].getTargetFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_5__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].one(target, EVENT_KEY_HIDDEN, () => {
    this.setAttribute('aria-expanded', false);
  });
  const alreadyOpen = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.vg-modal.show');
  if (alreadyOpen && alreadyOpen !== target) {
    VgModal.getInstance(alreadyOpen).hide();
  }
  const data = VgModal.getOrCreateInstance(target);
  data.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VgModal);

/***/ }),

/***/ "./app/modules/sidebar/js/vgsidebar.js":
/*!*********************************************!*\
  !*** ./app/modules/sidebar/js/vgsidebar.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_utils/js/selectors */ "./app/_utils/js/selectors.js");
/* harmony import */ var _utils_js_backdrop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_utils/js/backdrop */ "./app/_utils/js/backdrop.js");
/* harmony import */ var _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_utils/js/overflow */ "./app/_utils/js/overflow.js");
/* harmony import */ var _utils_js_event__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../_utils/js/event */ "./app/_utils/js/event.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../_utils/js/functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../_utils/js/module-fn */ "./app/_utils/js/module-fn.js");








/**
 * Constants
 */
const NAME = 'sidebar';
const NAME_KEY = 'vg.sidebar';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="sidebar"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const PARAMS_DEFAULT = {
  button: null,
  backdrop: true,
  overflow: true,
  keyboard: true,
  ajax: {
    route: '',
    target: ''
  }
};
class VGSidebar extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._addEventListeners();
    this._dismissElement();
  }
  static get Default() {
    return PARAMS_DEFAULT;
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_5__.isDisabled)(_this.element)) return;
    this._route();
    const showEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    if (_this.params.backdrop) {
      _utils_js_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].show();
    }
    if (_this.params.overflow) {
      _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__["default"].append();
    }
    _this.element.classList.add(CLASS_NAME_SHOW);
    const completeCallBack = () => {
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(_utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.vg-backdrop'), 'mousedown.vg.backdrop', function () {
        _this.hide();
      });
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this.element, true, 50);
  }
  hide() {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_5__.isDisabled)(_this.element)) return;
    const hideEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    if (_this.params.backdrop) {
      _utils_js_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].hide(function () {
        if (_this.params.overflow) {
          _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__["default"].destroy();
        }
      });
    }
    if (_this.params.overflow) {
      _utils_js_overflow__WEBPACK_IMPORTED_MODULE_3__["default"].destroy();
    }
    _this.element.setAttribute('aria-expanded', false);
    _this.element.classList.remove(CLASS_NAME_SHOW);
    const completeCallback = () => _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_HIDDEN);
    this._queueCallback(completeCallback, this.element, true);
  }
  _isShown() {
    return this.element.classList.contains(CLASS_NAME_SHOW);
  }
  _addEventListeners() {
    _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== 'Escape') {
        return;
      }
      if (this.params.keyboard) {
        this.hide();
        return;
      }
      _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this.element, EVENT_KEY_HIDE_PREVENTED);
    });
  }
}
(0,_utils_js_module_fn__WEBPACK_IMPORTED_MODULE_6__.dismissTrigger)(VGSidebar);

/**
 * Data API implementation
 */
_utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].getTargetFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_5__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].one(target, EVENT_KEY_HIDDEN, () => {
    this.setAttribute('aria-expanded', false);
  });
  const alreadyOpen = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.vg-sidebar.show');
  if (alreadyOpen && alreadyOpen !== target) {
    VGSidebar.getInstance(alreadyOpen).hide();
  }
  const data = VGSidebar.getOrCreateInstance(target);
  data.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGSidebar);

/***/ }),

/***/ "./app/modules/vgformsender/js/vgformsender.js":
/*!*****************************************************!*\
  !*** ./app/modules/vgformsender/js/vgformsender.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_utils/js/manipulator */ "./app/_utils/js/manipulator.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_utils/js/functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _utils_js_event__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_utils/js/event */ "./app/_utils/js/event.js");
/* harmony import */ var _babel_core_lib_config_validation_options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/core/lib/config/validation/options */ "./node_modules/@babel/core/lib/config/validation/options.js");
/* harmony import */ var _utils_js_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../_utils/js/selectors */ "./app/_utils/js/selectors.js");







/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.form-sender';

/**
 * Constants Classes
 */

/**
 * Constants Events
 */
const EVENT_KEY_SUCCESS = 'vg.fs.success';
const EVENT_KEY_ERROR = 'vg.fs.error';
const EVENT_KEY_BEFORE = 'vg.fs.before';
const EVENT_KEY_LOADED = 'vg.fs.loaded';
const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

/**
 * Default Params
 */
const PARAMS_DEFAULT = {
  action: location.href,
  method: 'post',
  fields: [],
  redirect: null,
  isJsonParse: true,
  isValidate: false,
  isSubmit: false,
  isBtnText: true,
  isShowPass: true,
  alert: {
    enabled: true,
    delay: 350,
    type: 'modal'
  },
  classes: {
    general: 'vg-form-sender',
    validation: 'needs-validation',
    wasValidate: 'was-validated'
  }
};
class VGFormSender extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._button = null;
    this.button = this.element.querySelector('[type="submit"]');
    this.params.action = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'action') || this.params.action;
    this.params.method = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'method') || this.params.method;
    this.params.isValidate = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'data-validate') === 'true';
    this.params.isSubmit = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'data-submit') === 'true';
    this.params.isBtnText = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'data-btn-text') !== 'false';
    this.params.isJsonParse = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'data-json-parse') !== 'false';
    this.params.isShowPass = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this.element, 'data-show-pass') !== 'false';
    if (this.params.fields && typeof this.params.fields == 'function') {
      this.params.fields = this.params.fields();
    }
  }
  static get Default() {
    return PARAMS_DEFAULT;
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  get button() {
    return this._button;
  }
  set button(btn) {
    if (!btn) {
      this._button = document.querySelector('[form="' + this.element.id + '"]');
    } else {
      this._button = btn;
    }
  }
  build() {
    this.element.classList.add(this.params.classes.general);
    if (this.params.isValidate) {
      _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.set(this.element, 'novalidate', '');
      this.element.classList.add(this.params.classes.validation);
    }

    // TODO сделать добавление глаза если есть ввод пароля

    return this;
  }
  submit(callback) {
    const _this = this;
    const collectData = function (data, fields) {
      for (let name in fields) {
        if (typeof fields[name] === 'object') {
          for (let key in fields[name]) {
            let arr = Object.keys(fields[name][key]).map(function (i) {
              return fields[name][key][i];
            });
            data.append(name, arr);
          }
        } else {
          data.append(name, fields[name]);
        }
      }
      return data;
    };
    this.element.addEventListener('submit', function (event) {
      if (_this.params.isValidate) {
        if (!_this.element.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          _this.element.classList.add(_this.params.classes.wasValidate);
          return false;
        }
      }
      if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_2__.isDisabled)(_this.button)) {
        event.preventDefault();
        return;
      }
      if (!_this.params.isSubmit) {
        event.preventDefault();
        let data = new FormData(_this.element);
        if (typeof _this.params.fields === 'object') {
          data = collectData(data, _this.params.fields);
        }
        return _this.request(data, callback, event);
      }
    });
  }
  request(data, callback, event) {
    const _this = this;
    _this.params.ajax = {
      route: _this.params.action,
      method: _this.params.method.toLowerCase(),
      data: data
    };
    if (callback && 'beforeSend' in callback) {
      (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_2__.execute)(callback.beforeSend, [event, _this]);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(_this.element, EVENT_KEY_BEFORE, _this);
    }
    _this._route(function (status, data) {
      console.log(status);
      console.log(data);
    });
  }

  /**
   * Инициализация
   * @param element
   * @param params
   */
  static init(element, params = {}) {
    const instance = VGFormSender.getOrCreateInstance(element, params);
    instance.build().submit();
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGFormSender);

/***/ }),

/***/ "./app/modules/vgnav/js/vgnav.js":
/*!***************************************!*\
  !*** ./app/modules/vgnav/js/vgnav.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_utils/js/selectors */ "./app/_utils/js/selectors.js");
/* harmony import */ var _utils_js_responsive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../_utils/js/responsive */ "./app/_utils/js/responsive.js");
/* harmony import */ var _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_utils/js/module-fn */ "./app/_utils/js/module-fn.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../_utils/js/functions */ "./app/_utils/js/functions.js");
/* harmony import */ var _utils_js_event__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../_utils/js/event */ "./app/_utils/js/event.js");
/* harmony import */ var _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../_utils/js/manipulator */ "./app/_utils/js/manipulator.js");








/**
 * Constants
 */
const NAME = 'nav';
const NAME_KEY = 'vg.nav';

/**
 * Constants Classes
 */
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_ACTIVE = 'active';
const SELECTOR_DATA_TOGGLE = '.vg-nav a';

/**
 * Constants Events
 */
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}.data.api`;
const EVENT_MOUSEOUT_DATA_API = `mouseout.${NAME_KEY}.data.api`;
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEYUP_DATA_API = `keyup.${NAME_KEY}.data.api`;
const EVENT_RESIZE_DATA_API = `resize.${NAME_KEY}.data.api`;

/**
 * Default Params
 */
const PARAMS_DEFAULT = {
  breakpoint: 'lg',
  placement: 'horizontal',
  classes: {
    hamburgerActive: 'vg-nav-hamburger-active',
    hamburger: 'vg-nav-hamburger',
    container: 'vg-nav-container',
    wrapper: 'vg-nav-wrapper',
    active: 'vg-nav-active',
    expand: 'vg-nav-expand',
    cloned: 'vg-nav-cloned',
    hover: 'vg-nav-hover',
    flip: 'vg-nav-flip',
    XXXL: 'vg-nav-xxxl',
    XXL: 'vg-nav-xxl',
    XL: 'vg-nav-xl',
    LG: 'vg-nav-lg',
    MD: 'vg-nav-md',
    SM: 'vg-nav-sm',
    XS: 'vg-nav-xs'
  },
  expand: true,
  hover: false,
  position: true,
  collapse: true,
  toggle: '<span class="default"></span>',
  hamburger: {
    title: '',
    body: null
  },
  callback: _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.noop,
  animation: true,
  timeoutAnimation: 300,
  ajax: {
    route: '',
    target: ''
  }
};
class VGNav extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._navigation = null;
    this.navigation = '.' + this.params.classes.wrapper;
    this.movedLinks = [];
    this.$links = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.' + this.params.classes.wrapper + ' > li', this.navigation);
    if (this.params.animation === false) {
      this.params.timeoutAnimation = 10;
    }
  }
  static get Default() {
    return PARAMS_DEFAULT;
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  get navigation() {
    return this._navigation;
  }
  set navigation(el) {
    this._navigation = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].get(el, this.element);
  }
  build() {
    if (!this.navigation) return;
    let params = this.params;

    // Вешаем основные классы
    this.element.classList.add(params.classes.container);
    this.element.classList.add('vg-nav-' + params.placement);

    // Если нужно оставить список меню или установить медиа точку
    if (params.breakpoint === null) {
      params.expand = false;
    }
    if (params.breakpoint === null || !params.expand) {
      this.element.classList.add(params.classes.expand);
    } else {
      this.element.classList.add('vg-nav-' + params.breakpoint);
    }

    // Меню срабатывает при наведении, если это не мобильное устройство
    if (params.hover) {
      this.element.classList.add(params.classes.hover);
      if (_utils_js_responsive__WEBPACK_IMPORTED_MODULE_2__["default"].checkMobileOrTablet()) {
        this.element.classList.remove(params.classes.hover);
      }
    }

    // Устанавливаем гамбургер, если его нет в разметке
    if (params.expand && !params.hamburger.body) {
      let isHamburger = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.' + params.classes.hamburger, this.element);
      if (isHamburger === null) {
        let mTitle = '',
          hamburger = '<span class="' + params.classes.hamburger + '--lines"><span></span><span></span><span></span></span>';
        if (params.hamburger.title) {
          mTitle = '<span class="' + params.classes.hamburger + '--title">' + params.hamburger.title + '</span>';
        }
        if (params.hamburger.body !== null) {
          hamburger = params.hamburger.body;
        }
        this.element.insertAdjacentHTML('afterbegin', '<a href="#sidebar-nav" class="' + params.classes.hamburger + '" data-vg-toggle="sidebar">' + mTitle + hamburger + '</a>');
      }
    }

    // Устанавливаем указатель переключателя
    if (params.toggle) {
      let $dropdown_a = [..._utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.dropdown-mega > a, .dropdown > a', this.element)],
        toggle = '<span class="toggle">' + params.toggle + '</span>';
      if ($dropdown_a.length) {
        $dropdown_a.forEach(function (elem) {
          if (!elem.querySelector('.toggle') && !elem.closest('.dots')) {
            elem.setAttribute('aria-expanded', 'false');
            elem.insertAdjacentHTML('beforeend', toggle);
          }
        });
      }
    }
    if (params.collapse && _utils_js_responsive__WEBPACK_IMPORTED_MODULE_2__["default"].check(this) && params.placement !== 'vertical') {
      setCollapse(this);
    }
    if ('afterInit' in this.params.callback) {
      (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.execute)(this.params.callback.afterInit, [this]);
    }

    /**
     * Функция сворачивания
     * TODO Придумать что то с мега меню, которое уходит в подменю
     * TODO Так же есть косяки при ресайзе
     */
    function setCollapse(_this) {
      let width_navigation_responsive = _this.navigation.clientWidth,
        width_all_links_responsive = 0,
        $dots = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.dots', _this.navigation),
        _dots = (0,_utils_js_module_fn__WEBPACK_IMPORTED_MODULE_3__.getSVG)('dots');
      if (_this.$links.length) {
        if ($dots) {
          width_all_links_responsive = $dots.clientWidth;
        } else {
          let $a = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('a', _this.$links[0]),
            $linkStyle = getComputedStyle($a),
            paddingLeft = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)($linkStyle.paddingLeft.slice(0, -2)),
            paddingRight = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)($linkStyle.paddingRight.slice(0, -2)),
            padding = paddingLeft + paddingRight;

          // TODO не совсем верно, но мы точно знаем ширину точек в svg - 16px
          width_all_links_responsive = padding + 16;
        }
        for (let $link of _this.$links) {
          let width = $link.getBoundingClientRect().width;
          width_all_links_responsive = width_all_links_responsive + width;
          if (width_navigation_responsive < width_all_links_responsive) {
            _this.movedLinks.push($link);
            $link.remove();
          } else {
            if (_this.movedLinks.length) {
              if ($dots) {
                _this.navigation.insertBefore(_this.movedLinks[0], $dots);
              } else {
                _this.navigation.appendChild(_this.movedLinks[0]);
              }
              _this.movedLinks.splice(0, 1);
            }
          }
        }
        if (_this.movedLinks.length) {
          if (!$dots) {
            _this.navigation.insertAdjacentHTML('beforeend', '<li class="dropdown dots">' + '<a href="#" aria-expanded="false">' + _dots + '</a></li>');
          }
        } else {
          if ($dots) {
            $dots.remove();
          }
        }
        let $d = _this.navigation.querySelector('.dots');
        if ($d && _this.movedLinks.length) {
          let $dropdown = $d.querySelector('ul');
          if ($dropdown) {
            for (let link of _this.movedLinks) {
              $dropdown.prepend(link);
            }
          } else {
            let $dropdown = document.createElement('ul');
            $dropdown.classList.add('dropdown-content');
            $dropdown.classList.add('right');
            for (let link of _this.movedLinks) {
              $dropdown.prepend(link);
            }
            $d.appendChild($dropdown);
          }
        }
      }
    }
  }
  show(relatedTarget) {
    let target = relatedTarget.relatedTarget;
    if (!target || (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isDisabled)(target)) {
      return;
    }
    if (!target.closest('.dropdown-content')) {
      target.classList.add('first');
    }
    const showEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(target, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    let drop = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findOne('.dropdown-content', target),
      link = target.firstElementChild;
    if (link) link.setAttribute('aria-expanded', 'true');
    drop.classList.add(CLASS_NAME_SHOW);
    target.classList.add(CLASS_NAME_ACTIVE);
    setDropPosition(drop);
    const completeCallBack = () => {
      drop.classList.add(CLASS_NAME_FADE);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(target, EVENT_KEY_SHOWN, relatedTarget);
    };
    this._queueCallback(completeCallBack, drop, true, 50);

    /**
     *
     * @param $drop
     */
    function setDropPosition($drop) {
      let {
          width,
          right
        } = $drop.getBoundingClientRect(),
        window_width = window.innerWidth;
      let N_right = window_width - right - width;
      $drop.classList.remove('right');
      $drop.classList.remove('left');
      let $parent = $drop.closest('li'),
        $ul = $parent.querySelectorAll('ul');
      if (N_right > width) {
        for (const $el of $ul) {
          $el.classList.add('left');
        }
      } else {
        for (const $el of $ul) {
          $el.classList.add('right');
        }
      }
    }
  }
  hide(relatedTarget) {
    const _this = this;
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].off(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.noop);
      }
    }
    let element = relatedTarget.relatedTarget;
    if ('elm' in relatedTarget && relatedTarget.elm) {
      element = relatedTarget.elm;
    }
    if (element) {
      const hideEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(element, EVENT_KEY_HIDE);
      if (hideEvent.defaultPrevented) return;
      element.classList.remove(CLASS_NAME_ACTIVE);
      if (element.classList.contains('first')) {
        element.classList.remove('first');
      }
      [..._utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.' + CLASS_NAME_SHOW, element)].forEach(function (el, index) {
        el.classList.remove(CLASS_NAME_FADE);
        let parent = el.closest('.dropdown');
        if (parent.classList.contains(CLASS_NAME_ACTIVE)) {
          parent.classList.remove(CLASS_NAME_ACTIVE);
        }
        let link = el.previousElementSibling;
        if (link) link.setAttribute('aria-expanded', 'false');
        if (index === 0) {
          const completeCallback = () => {
            el.classList.remove(CLASS_NAME_SHOW);
            _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(el, EVENT_KEY_HIDDEN, relatedTarget);
          };
          _this._queueCallback(completeCallback, el, true, 500);
        }
      });
    }
  }

  /**
   * TODO если на странице несколько навигаций, то есть косяки
   * @param element
   * @param params
   */
  static init(element, params = {}) {
    const instance = VGNav.getOrCreateInstance(element, params);
    instance.build();
    let drops = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.dropdown', instance._navigation);
    if (instance.params.hover) {
      [...drops].forEach(function (el) {
        let currentElem = null;
        _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(el, EVENT_MOUSEOVER_DATA_API, function (event) {
          if (currentElem) return;
          VGNav.hideOpenDrops(event);
          let target = event.target.closest('.dropdown');
          if (!target) return;
          if (!instance.navigation.contains(target)) return;
          currentElem = target;
          let relatedTarget = {
            relatedTarget: target
          };
          instance.show(relatedTarget);
        });
        _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(el, EVENT_MOUSEOUT_DATA_API, function (event) {
          if (!currentElem) return;
          let relatedTarget = event.relatedTarget.closest('.dropdown'),
            elm = currentElem;
          while (relatedTarget) {
            if (relatedTarget === currentElem) return;
            relatedTarget = relatedTarget.parentNode;
          }
          currentElem = null;
          instance.hide({
            relatedTarget: relatedTarget,
            elm: elm
          });
        });
      });
    } else {
      _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_KEYUP_DATA_API, VGNav.clearDrops);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_CLICK_DATA_API, VGNav.clearDrops);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
        if (!_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.has(this, 'aria-expanded')) {
          return;
        }
        if ('click' in instance.params.callback) {
          (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.execute)(instance.params.callback.click, [this]);
        }
        event.preventDefault();
        let self = this.closest('.vg-nav'),
          isFirst = self.querySelector('.first');
        let target = this.closest('.dropdown');
        if (!target) return;
        if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isDisabled)(target) && !(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isVisible)(target)) {
          return;
        }
        if (isFirst && this.closest('.first')) {
          if (target.classList.contains('active')) {
            instance.hide({
              relatedTarget: target
            });
            return;
          }
        } else {
          [..._utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.active', self)].forEach(function (el) {
            if (el && el !== target) {
              instance.hide({
                relatedTarget: el
              });
            }
          });
        }
        instance.show({
          relatedTarget: target
        });
      });
    }
    const vgNavSidebar = document.getElementById('sidebar-nav');
    let hamburger = instance.element.querySelector('.' + instance.params.classes.hamburger);
    if (vgNavSidebar && hamburger) {
      vgNavSidebar.addEventListener('vg.sidebar.show', function () {
        hamburger.classList.add(instance.params.classes.hamburgerActive);
      });
      vgNavSidebar.addEventListener('vg.sidebar.hide', function () {
        hamburger.classList.remove(instance.params.classes.hamburgerActive);
      });
    }
  }
  static clearDrops(event) {
    if (event.button === 2 || event.type === 'keyup' && event.key !== 'Tab') {
      return;
    }
    VGNav.hideOpenDrops(event);
  }
  static hideOpenDrops(event) {
    const openToggles = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.dropdown:not(.disabled):not(:disabled).active');
    for (const toggle of openToggles) {
      const context = VGNav.getInstance(toggle.closest('.vg-nav'));
      if (!context) continue;
      if (event.target.closest('.first')) {
        return;
      }
      const relatedTarget = {
        relatedTarget: toggle
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      context.hide(relatedTarget);
    }
  }
}
_utils_js_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(window, EVENT_RESIZE_DATA_API, function (event) {
  const instance = VGNav.getOrCreateInstance('.vg-nav', {});
  instance.build();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGNav);

/***/ }),

/***/ "./node_modules/browserslist/browser.js":
/*!**********************************************!*\
  !*** ./node_modules/browserslist/browser.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var BrowserslistError = __webpack_require__(/*! ./error */ "./node_modules/browserslist/error.js");
function noop() {}
module.exports = {
  loadQueries: function loadQueries() {
    throw new BrowserslistError('Sharable configs are not supported in client-side build of Browserslist');
  },
  getStat: function getStat(opts) {
    return opts.stats;
  },
  loadConfig: function loadConfig(opts) {
    if (opts.config) {
      throw new BrowserslistError('Browserslist config are not supported in client-side build');
    }
  },
  loadCountry: function loadCountry() {
    throw new BrowserslistError('Country statistics are not supported ' + 'in client-side build of Browserslist');
  },
  loadFeature: function loadFeature() {
    throw new BrowserslistError('Supports queries are not available in client-side build of Browserslist');
  },
  currentNode: function currentNode(resolve, context) {
    return resolve(['maintained node versions'], context)[0];
  },
  parseConfig: noop,
  readConfig: noop,
  findConfig: noop,
  findConfigFile: noop,
  clearCaches: noop,
  oldDataWarning: noop,
  env: {}
};

/***/ }),

/***/ "./node_modules/browserslist/error.js":
/*!********************************************!*\
  !*** ./node_modules/browserslist/error.js ***!
  \********************************************/
/***/ ((module) => {

function BrowserslistError(message) {
  this.name = 'BrowserslistError';
  this.message = message;
  this.browserslist = true;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, BrowserslistError);
  }
}
BrowserslistError.prototype = Error.prototype;
module.exports = BrowserslistError;

/***/ }),

/***/ "./node_modules/browserslist/index.js":
/*!********************************************!*\
  !*** ./node_modules/browserslist/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var jsReleases = __webpack_require__(/*! node-releases/data/processed/envs.json */ "./node_modules/node-releases/data/processed/envs.json");
var agents = (__webpack_require__(/*! caniuse-lite/dist/unpacker/agents */ "./node_modules/caniuse-lite/dist/unpacker/agents.js").agents);
var e2c = __webpack_require__(/*! electron-to-chromium/versions */ "./node_modules/electron-to-chromium/versions.js");
var jsEOL = __webpack_require__(/*! node-releases/data/release-schedule/release-schedule.json */ "./node_modules/node-releases/data/release-schedule/release-schedule.json");
var path = __webpack_require__(/*! path */ "?3465");
var BrowserslistError = __webpack_require__(/*! ./error */ "./node_modules/browserslist/error.js");
var env = __webpack_require__(/*! ./node */ "./node_modules/browserslist/browser.js");
var parse = __webpack_require__(/*! ./parse */ "./node_modules/browserslist/parse.js"); // Will load browser.js in webpack

var YEAR = 365.259641 * 24 * 60 * 60 * 1000;
var ANDROID_EVERGREEN_FIRST = '37';
var OP_MOB_BLINK_FIRST = 14;

// Helpers

function isVersionsMatch(versionA, versionB) {
  return (versionA + '.').indexOf(versionB + '.') === 0;
}
function isEolReleased(name) {
  var version = name.slice(1);
  return browserslist.nodeVersions.some(function (i) {
    return isVersionsMatch(i, version);
  });
}
function normalize(versions) {
  return versions.filter(function (version) {
    return typeof version === 'string';
  });
}
function normalizeElectron(version) {
  var versionToUse = version;
  if (version.split('.').length === 3) {
    versionToUse = version.split('.').slice(0, -1).join('.');
  }
  return versionToUse;
}
function nameMapper(name) {
  return function mapName(version) {
    return name + ' ' + version;
  };
}
function getMajor(version) {
  return parseInt(version.split('.')[0]);
}
function getMajorVersions(released, number) {
  if (released.length === 0) return [];
  var majorVersions = uniq(released.map(getMajor));
  var minimum = majorVersions[majorVersions.length - number];
  if (!minimum) {
    return released;
  }
  var selected = [];
  for (var i = released.length - 1; i >= 0; i--) {
    if (minimum > getMajor(released[i])) break;
    selected.unshift(released[i]);
  }
  return selected;
}
function uniq(array) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    if (filtered.indexOf(array[i]) === -1) filtered.push(array[i]);
  }
  return filtered;
}
function fillUsage(result, name, data) {
  for (var i in data) {
    result[name + ' ' + i] = data[i];
  }
}
function generateFilter(sign, version) {
  version = parseFloat(version);
  if (sign === '>') {
    return function (v) {
      return parseLatestFloat(v) > version;
    };
  } else if (sign === '>=') {
    return function (v) {
      return parseLatestFloat(v) >= version;
    };
  } else if (sign === '<') {
    return function (v) {
      return parseFloat(v) < version;
    };
  } else {
    return function (v) {
      return parseFloat(v) <= version;
    };
  }
  function parseLatestFloat(v) {
    return parseFloat(v.split('-')[1] || v);
  }
}
function generateSemverFilter(sign, version) {
  version = version.split('.').map(parseSimpleInt);
  version[1] = version[1] || 0;
  version[2] = version[2] || 0;
  if (sign === '>') {
    return function (v) {
      v = v.split('.').map(parseSimpleInt);
      return compareSemver(v, version) > 0;
    };
  } else if (sign === '>=') {
    return function (v) {
      v = v.split('.').map(parseSimpleInt);
      return compareSemver(v, version) >= 0;
    };
  } else if (sign === '<') {
    return function (v) {
      v = v.split('.').map(parseSimpleInt);
      return compareSemver(version, v) > 0;
    };
  } else {
    return function (v) {
      v = v.split('.').map(parseSimpleInt);
      return compareSemver(version, v) >= 0;
    };
  }
}
function parseSimpleInt(x) {
  return parseInt(x);
}
function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return +1;
  return 0;
}
function compareSemver(a, b) {
  return compare(parseInt(a[0]), parseInt(b[0])) || compare(parseInt(a[1] || '0'), parseInt(b[1] || '0')) || compare(parseInt(a[2] || '0'), parseInt(b[2] || '0'));
}

// this follows the npm-like semver behavior
function semverFilterLoose(operator, range) {
  range = range.split('.').map(parseSimpleInt);
  if (typeof range[1] === 'undefined') {
    range[1] = 'x';
  }
  // ignore any patch version because we only return minor versions
  // range[2] = 'x'
  switch (operator) {
    case '<=':
      return function (version) {
        version = version.split('.').map(parseSimpleInt);
        return compareSemverLoose(version, range) <= 0;
      };
    case '>=':
    default:
      return function (version) {
        version = version.split('.').map(parseSimpleInt);
        return compareSemverLoose(version, range) >= 0;
      };
  }
}

// this follows the npm-like semver behavior
function compareSemverLoose(version, range) {
  if (version[0] !== range[0]) {
    return version[0] < range[0] ? -1 : +1;
  }
  if (range[1] === 'x') {
    return 0;
  }
  if (version[1] !== range[1]) {
    return version[1] < range[1] ? -1 : +1;
  }
  return 0;
}
function resolveVersion(data, version) {
  if (data.versions.indexOf(version) !== -1) {
    return version;
  } else if (browserslist.versionAliases[data.name][version]) {
    return browserslist.versionAliases[data.name][version];
  } else {
    return false;
  }
}
function normalizeVersion(data, version) {
  var resolved = resolveVersion(data, version);
  if (resolved) {
    return resolved;
  } else if (data.versions.length === 1) {
    return data.versions[0];
  } else {
    return false;
  }
}
function filterByYear(since, context) {
  since = since / 1000;
  return Object.keys(agents).reduce(function (selected, name) {
    var data = byName(name, context);
    if (!data) return selected;
    var versions = Object.keys(data.releaseDate).filter(function (v) {
      var date = data.releaseDate[v];
      return date !== null && date >= since;
    });
    return selected.concat(versions.map(nameMapper(data.name)));
  }, []);
}
function cloneData(data) {
  return {
    name: data.name,
    versions: data.versions,
    released: data.released,
    releaseDate: data.releaseDate
  };
}
function byName(name, context) {
  name = name.toLowerCase();
  name = browserslist.aliases[name] || name;
  if (context.mobileToDesktop && browserslist.desktopNames[name]) {
    var desktop = browserslist.data[browserslist.desktopNames[name]];
    if (name === 'android') {
      return normalizeAndroidData(cloneData(browserslist.data[name]), desktop);
    } else {
      var cloned = cloneData(desktop);
      cloned.name = name;
      return cloned;
    }
  }
  return browserslist.data[name];
}
function normalizeAndroidVersions(androidVersions, chromeVersions) {
  var iFirstEvergreen = chromeVersions.indexOf(ANDROID_EVERGREEN_FIRST);
  return androidVersions.filter(function (version) {
    return /^(?:[2-4]\.|[34]$)/.test(version);
  }).concat(chromeVersions.slice(iFirstEvergreen));
}
function copyObject(obj) {
  var copy = {};
  for (var key in obj) {
    copy[key] = obj[key];
  }
  return copy;
}
function normalizeAndroidData(android, chrome) {
  android.released = normalizeAndroidVersions(android.released, chrome.released);
  android.versions = normalizeAndroidVersions(android.versions, chrome.versions);
  android.releaseDate = copyObject(android.releaseDate);
  android.released.forEach(function (v) {
    if (android.releaseDate[v] === undefined) {
      android.releaseDate[v] = chrome.releaseDate[v];
    }
  });
  return android;
}
function checkName(name, context) {
  var data = byName(name, context);
  if (!data) throw new BrowserslistError('Unknown browser ' + name);
  return data;
}
function unknownQuery(query) {
  return new BrowserslistError('Unknown browser query `' + query + '`. ' + 'Maybe you are using old Browserslist or made typo in query.');
}

// Adjusts last X versions queries for some mobile browsers,
// where caniuse data jumps from a legacy version to the latest
function filterJumps(list, name, nVersions, context) {
  var jump = 1;
  switch (name) {
    case 'android':
      if (context.mobileToDesktop) return list;
      var released = browserslist.data.chrome.released;
      jump = released.length - released.indexOf(ANDROID_EVERGREEN_FIRST);
      break;
    case 'op_mob':
      var latest = browserslist.data.op_mob.released.slice(-1)[0];
      jump = getMajor(latest) - OP_MOB_BLINK_FIRST + 1;
      break;
    default:
      return list;
  }
  if (nVersions <= jump) {
    return list.slice(-1);
  }
  return list.slice(jump - 1 - nVersions);
}
function isSupported(flags, withPartial) {
  return typeof flags === 'string' && (flags.indexOf('y') >= 0 || withPartial && flags.indexOf('a') >= 0);
}
function resolve(queries, context) {
  return parse(QUERIES, queries).reduce(function (result, node, index) {
    if (node.not && index === 0) {
      throw new BrowserslistError('Write any browsers query (for instance, `defaults`) ' + 'before `' + node.query + '`');
    }
    var type = QUERIES[node.type];
    var array = type.select.call(browserslist, context, node).map(function (j) {
      var parts = j.split(' ');
      if (parts[1] === '0') {
        return parts[0] + ' ' + byName(parts[0], context).versions[0];
      } else {
        return j;
      }
    });
    if (node.compose === 'and') {
      if (node.not) {
        return result.filter(function (j) {
          return array.indexOf(j) === -1;
        });
      } else {
        return result.filter(function (j) {
          return array.indexOf(j) !== -1;
        });
      }
    } else {
      if (node.not) {
        var filter = {};
        array.forEach(function (j) {
          filter[j] = true;
        });
        return result.filter(function (j) {
          return !filter[j];
        });
      }
      return result.concat(array);
    }
  }, []);
}
function prepareOpts(opts) {
  if (typeof opts === 'undefined') opts = {};
  if (typeof opts.path === 'undefined') {
    opts.path = path.resolve ? path.resolve('.') : '.';
  }
  return opts;
}
function prepareQueries(queries, opts) {
  if (typeof queries === 'undefined' || queries === null) {
    var config = browserslist.loadConfig(opts);
    if (config) {
      queries = config;
    } else {
      queries = browserslist.defaults;
    }
  }
  return queries;
}
function checkQueries(queries) {
  if (!(typeof queries === 'string' || Array.isArray(queries))) {
    throw new BrowserslistError('Browser queries must be an array or string. Got ' + typeof queries + '.');
  }
}
var cache = {};
function browserslist(queries, opts) {
  opts = prepareOpts(opts);
  queries = prepareQueries(queries, opts);
  checkQueries(queries);
  var context = {
    ignoreUnknownVersions: opts.ignoreUnknownVersions,
    dangerousExtend: opts.dangerousExtend,
    mobileToDesktop: opts.mobileToDesktop,
    path: opts.path,
    env: opts.env
  };
  env.oldDataWarning(browserslist.data);
  var stats = env.getStat(opts, browserslist.data);
  if (stats) {
    context.customUsage = {};
    for (var browser in stats) {
      fillUsage(context.customUsage, browser, stats[browser]);
    }
  }
  var cacheKey = JSON.stringify([queries, context]);
  if (cache[cacheKey]) return cache[cacheKey];
  var result = uniq(resolve(queries, context)).sort(function (name1, name2) {
    name1 = name1.split(' ');
    name2 = name2.split(' ');
    if (name1[0] === name2[0]) {
      // assumptions on caniuse data
      // 1) version ranges never overlaps
      // 2) if version is not a range, it never contains `-`
      var version1 = name1[1].split('-')[0];
      var version2 = name2[1].split('-')[0];
      return compareSemver(version2.split('.'), version1.split('.'));
    } else {
      return compare(name1[0], name2[0]);
    }
  });
  if (!env.env.BROWSERSLIST_DISABLE_CACHE) {
    cache[cacheKey] = result;
  }
  return result;
}
browserslist.parse = function (queries, opts) {
  opts = prepareOpts(opts);
  queries = prepareQueries(queries, opts);
  checkQueries(queries);
  return parse(QUERIES, queries);
};

// Will be filled by Can I Use data below
browserslist.cache = {};
browserslist.data = {};
browserslist.usage = {
  global: {},
  custom: null
};

// Default browsers query
browserslist.defaults = ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'];

// Browser names aliases
browserslist.aliases = {
  fx: 'firefox',
  ff: 'firefox',
  ios: 'ios_saf',
  explorer: 'ie',
  blackberry: 'bb',
  explorermobile: 'ie_mob',
  operamini: 'op_mini',
  operamobile: 'op_mob',
  chromeandroid: 'and_chr',
  firefoxandroid: 'and_ff',
  ucandroid: 'and_uc',
  qqandroid: 'and_qq'
};

// Can I Use only provides a few versions for some browsers (e.g. and_chr).
// Fallback to a similar browser for unknown versions
// Note op_mob is not included as its chromium versions are not in sync with Opera desktop
browserslist.desktopNames = {
  and_chr: 'chrome',
  and_ff: 'firefox',
  ie_mob: 'ie',
  android: 'chrome' // has extra processing logic
};

// Aliases to work with joined versions like `ios_saf 7.0-7.1`
browserslist.versionAliases = {};
browserslist.clearCaches = env.clearCaches;
browserslist.parseConfig = env.parseConfig;
browserslist.readConfig = env.readConfig;
browserslist.findConfigFile = env.findConfigFile;
browserslist.findConfig = env.findConfig;
browserslist.loadConfig = env.loadConfig;
browserslist.coverage = function (browsers, stats) {
  var data;
  if (typeof stats === 'undefined') {
    data = browserslist.usage.global;
  } else if (stats === 'my stats') {
    var opts = {};
    opts.path = path.resolve ? path.resolve('.') : '.';
    var customStats = env.getStat(opts);
    if (!customStats) {
      throw new BrowserslistError('Custom usage statistics was not provided');
    }
    data = {};
    for (var browser in customStats) {
      fillUsage(data, browser, customStats[browser]);
    }
  } else if (typeof stats === 'string') {
    if (stats.length > 2) {
      stats = stats.toLowerCase();
    } else {
      stats = stats.toUpperCase();
    }
    env.loadCountry(browserslist.usage, stats, browserslist.data);
    data = browserslist.usage[stats];
  } else {
    if ('dataByBrowser' in stats) {
      stats = stats.dataByBrowser;
    }
    data = {};
    for (var name in stats) {
      for (var version in stats[name]) {
        data[name + ' ' + version] = stats[name][version];
      }
    }
  }
  return browsers.reduce(function (all, i) {
    var usage = data[i];
    if (usage === undefined) {
      usage = data[i.replace(/ \S+$/, ' 0')];
    }
    return all + (usage || 0);
  }, 0);
};
function nodeQuery(context, node) {
  var matched = browserslist.nodeVersions.filter(function (i) {
    return isVersionsMatch(i, node.version);
  });
  if (matched.length === 0) {
    if (context.ignoreUnknownVersions) {
      return [];
    } else {
      throw new BrowserslistError('Unknown version ' + node.version + ' of Node.js');
    }
  }
  return ['node ' + matched[matched.length - 1]];
}
function sinceQuery(context, node) {
  var year = parseInt(node.year);
  var month = parseInt(node.month || '01') - 1;
  var day = parseInt(node.day || '01');
  return filterByYear(Date.UTC(year, month, day, 0, 0, 0), context);
}
function coverQuery(context, node) {
  var coverage = parseFloat(node.coverage);
  var usage = browserslist.usage.global;
  if (node.place) {
    if (node.place.match(/^my\s+stats$/i)) {
      if (!context.customUsage) {
        throw new BrowserslistError('Custom usage statistics was not provided');
      }
      usage = context.customUsage;
    } else {
      var place;
      if (node.place.length === 2) {
        place = node.place.toUpperCase();
      } else {
        place = node.place.toLowerCase();
      }
      env.loadCountry(browserslist.usage, place, browserslist.data);
      usage = browserslist.usage[place];
    }
  }
  var versions = Object.keys(usage).sort(function (a, b) {
    return usage[b] - usage[a];
  });
  var coveraged = 0;
  var result = [];
  var version;
  for (var i = 0; i < versions.length; i++) {
    version = versions[i];
    if (usage[version] === 0) break;
    coveraged += usage[version];
    result.push(version);
    if (coveraged >= coverage) break;
  }
  return result;
}
var QUERIES = {
  last_major_versions: {
    matches: ['versions'],
    regexp: /^last\s+(\d+)\s+major\s+versions?$/i,
    select: function (context, node) {
      return Object.keys(agents).reduce(function (selected, name) {
        var data = byName(name, context);
        if (!data) return selected;
        var list = getMajorVersions(data.released, node.versions);
        list = list.map(nameMapper(data.name));
        list = filterJumps(list, data.name, node.versions, context);
        return selected.concat(list);
      }, []);
    }
  },
  last_versions: {
    matches: ['versions'],
    regexp: /^last\s+(\d+)\s+versions?$/i,
    select: function (context, node) {
      return Object.keys(agents).reduce(function (selected, name) {
        var data = byName(name, context);
        if (!data) return selected;
        var list = data.released.slice(-node.versions);
        list = list.map(nameMapper(data.name));
        list = filterJumps(list, data.name, node.versions, context);
        return selected.concat(list);
      }, []);
    }
  },
  last_electron_major_versions: {
    matches: ['versions'],
    regexp: /^last\s+(\d+)\s+electron\s+major\s+versions?$/i,
    select: function (context, node) {
      var validVersions = getMajorVersions(Object.keys(e2c), node.versions);
      return validVersions.map(function (i) {
        return 'chrome ' + e2c[i];
      });
    }
  },
  last_node_major_versions: {
    matches: ['versions'],
    regexp: /^last\s+(\d+)\s+node\s+major\s+versions?$/i,
    select: function (context, node) {
      return getMajorVersions(browserslist.nodeVersions, node.versions).map(function (version) {
        return 'node ' + version;
      });
    }
  },
  last_browser_major_versions: {
    matches: ['versions', 'browser'],
    regexp: /^last\s+(\d+)\s+(\w+)\s+major\s+versions?$/i,
    select: function (context, node) {
      var data = checkName(node.browser, context);
      var validVersions = getMajorVersions(data.released, node.versions);
      var list = validVersions.map(nameMapper(data.name));
      list = filterJumps(list, data.name, node.versions, context);
      return list;
    }
  },
  last_electron_versions: {
    matches: ['versions'],
    regexp: /^last\s+(\d+)\s+electron\s+versions?$/i,
    select: function (context, node) {
      return Object.keys(e2c).slice(-node.versions).map(function (i) {
        return 'chrome ' + e2c[i];
      });
    }
  },
  last_node_versions: {
    matches: ['versions'],
    regexp: /^last\s+(\d+)\s+node\s+versions?$/i,
    select: function (context, node) {
      return browserslist.nodeVersions.slice(-node.versions).map(function (version) {
        return 'node ' + version;
      });
    }
  },
  last_browser_versions: {
    matches: ['versions', 'browser'],
    regexp: /^last\s+(\d+)\s+(\w+)\s+versions?$/i,
    select: function (context, node) {
      var data = checkName(node.browser, context);
      var list = data.released.slice(-node.versions).map(nameMapper(data.name));
      list = filterJumps(list, data.name, node.versions, context);
      return list;
    }
  },
  unreleased_versions: {
    matches: [],
    regexp: /^unreleased\s+versions$/i,
    select: function (context) {
      return Object.keys(agents).reduce(function (selected, name) {
        var data = byName(name, context);
        if (!data) return selected;
        var list = data.versions.filter(function (v) {
          return data.released.indexOf(v) === -1;
        });
        list = list.map(nameMapper(data.name));
        return selected.concat(list);
      }, []);
    }
  },
  unreleased_electron_versions: {
    matches: [],
    regexp: /^unreleased\s+electron\s+versions?$/i,
    select: function () {
      return [];
    }
  },
  unreleased_browser_versions: {
    matches: ['browser'],
    regexp: /^unreleased\s+(\w+)\s+versions?$/i,
    select: function (context, node) {
      var data = checkName(node.browser, context);
      return data.versions.filter(function (v) {
        return data.released.indexOf(v) === -1;
      }).map(nameMapper(data.name));
    }
  },
  last_years: {
    matches: ['years'],
    regexp: /^last\s+(\d*.?\d+)\s+years?$/i,
    select: function (context, node) {
      return filterByYear(Date.now() - YEAR * node.years, context);
    }
  },
  since_y: {
    matches: ['year'],
    regexp: /^since (\d+)$/i,
    select: sinceQuery
  },
  since_y_m: {
    matches: ['year', 'month'],
    regexp: /^since (\d+)-(\d+)$/i,
    select: sinceQuery
  },
  since_y_m_d: {
    matches: ['year', 'month', 'day'],
    regexp: /^since (\d+)-(\d+)-(\d+)$/i,
    select: sinceQuery
  },
  popularity: {
    matches: ['sign', 'popularity'],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%$/,
    select: function (context, node) {
      var popularity = parseFloat(node.popularity);
      var usage = browserslist.usage.global;
      return Object.keys(usage).reduce(function (result, version) {
        if (node.sign === '>') {
          if (usage[version] > popularity) {
            result.push(version);
          }
        } else if (node.sign === '<') {
          if (usage[version] < popularity) {
            result.push(version);
          }
        } else if (node.sign === '<=') {
          if (usage[version] <= popularity) {
            result.push(version);
          }
        } else if (usage[version] >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  popularity_in_my_stats: {
    matches: ['sign', 'popularity'],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+my\s+stats$/,
    select: function (context, node) {
      var popularity = parseFloat(node.popularity);
      if (!context.customUsage) {
        throw new BrowserslistError('Custom usage statistics was not provided');
      }
      var usage = context.customUsage;
      return Object.keys(usage).reduce(function (result, version) {
        var percentage = usage[version];
        if (percentage == null) {
          return result;
        }
        if (node.sign === '>') {
          if (percentage > popularity) {
            result.push(version);
          }
        } else if (node.sign === '<') {
          if (percentage < popularity) {
            result.push(version);
          }
        } else if (node.sign === '<=') {
          if (percentage <= popularity) {
            result.push(version);
          }
        } else if (percentage >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  popularity_in_config_stats: {
    matches: ['sign', 'popularity', 'config'],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+(\S+)\s+stats$/,
    select: function (context, node) {
      var popularity = parseFloat(node.popularity);
      var stats = env.loadStat(context, node.config, browserslist.data);
      if (stats) {
        context.customUsage = {};
        for (var browser in stats) {
          fillUsage(context.customUsage, browser, stats[browser]);
        }
      }
      if (!context.customUsage) {
        throw new BrowserslistError('Custom usage statistics was not provided');
      }
      var usage = context.customUsage;
      return Object.keys(usage).reduce(function (result, version) {
        var percentage = usage[version];
        if (percentage == null) {
          return result;
        }
        if (node.sign === '>') {
          if (percentage > popularity) {
            result.push(version);
          }
        } else if (node.sign === '<') {
          if (percentage < popularity) {
            result.push(version);
          }
        } else if (node.sign === '<=') {
          if (percentage <= popularity) {
            result.push(version);
          }
        } else if (percentage >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  popularity_in_place: {
    matches: ['sign', 'popularity', 'place'],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+((alt-)?\w\w)$/,
    select: function (context, node) {
      var popularity = parseFloat(node.popularity);
      var place = node.place;
      if (place.length === 2) {
        place = place.toUpperCase();
      } else {
        place = place.toLowerCase();
      }
      env.loadCountry(browserslist.usage, place, browserslist.data);
      var usage = browserslist.usage[place];
      return Object.keys(usage).reduce(function (result, version) {
        var percentage = usage[version];
        if (percentage == null) {
          return result;
        }
        if (node.sign === '>') {
          if (percentage > popularity) {
            result.push(version);
          }
        } else if (node.sign === '<') {
          if (percentage < popularity) {
            result.push(version);
          }
        } else if (node.sign === '<=') {
          if (percentage <= popularity) {
            result.push(version);
          }
        } else if (percentage >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  cover: {
    matches: ['coverage'],
    regexp: /^cover\s+(\d+|\d+\.\d+|\.\d+)%$/i,
    select: coverQuery
  },
  cover_in: {
    matches: ['coverage', 'place'],
    regexp: /^cover\s+(\d+|\d+\.\d+|\.\d+)%\s+in\s+(my\s+stats|(alt-)?\w\w)$/i,
    select: coverQuery
  },
  supports: {
    matches: ['supportType', 'feature'],
    regexp: /^(?:(fully|partially)\s+)?supports\s+([\w-]+)$/,
    select: function (context, node) {
      env.loadFeature(browserslist.cache, node.feature);
      var withPartial = node.supportType !== 'fully';
      var features = browserslist.cache[node.feature];
      var result = [];
      for (var name in features) {
        var data = byName(name, context);
        // Only check desktop when latest released mobile has support
        var iMax = data.released.length - 1;
        while (iMax >= 0) {
          if (data.released[iMax] in features[name]) break;
          iMax--;
        }
        var checkDesktop = context.mobileToDesktop && name in browserslist.desktopNames && isSupported(features[name][data.released[iMax]], withPartial);
        data.versions.forEach(function (version) {
          var flags = features[name][version];
          if (flags === undefined && checkDesktop) {
            flags = features[browserslist.desktopNames[name]][version];
          }
          if (isSupported(flags, withPartial)) {
            result.push(name + ' ' + version);
          }
        });
      }
      return result;
    }
  },
  electron_range: {
    matches: ['from', 'to'],
    regexp: /^electron\s+([\d.]+)\s*-\s*([\d.]+)$/i,
    select: function (context, node) {
      var fromToUse = normalizeElectron(node.from);
      var toToUse = normalizeElectron(node.to);
      var from = parseFloat(node.from);
      var to = parseFloat(node.to);
      if (!e2c[fromToUse]) {
        throw new BrowserslistError('Unknown version ' + from + ' of electron');
      }
      if (!e2c[toToUse]) {
        throw new BrowserslistError('Unknown version ' + to + ' of electron');
      }
      return Object.keys(e2c).filter(function (i) {
        var parsed = parseFloat(i);
        return parsed >= from && parsed <= to;
      }).map(function (i) {
        return 'chrome ' + e2c[i];
      });
    }
  },
  node_range: {
    matches: ['from', 'to'],
    regexp: /^node\s+([\d.]+)\s*-\s*([\d.]+)$/i,
    select: function (context, node) {
      return browserslist.nodeVersions.filter(semverFilterLoose('>=', node.from)).filter(semverFilterLoose('<=', node.to)).map(function (v) {
        return 'node ' + v;
      });
    }
  },
  browser_range: {
    matches: ['browser', 'from', 'to'],
    regexp: /^(\w+)\s+([\d.]+)\s*-\s*([\d.]+)$/i,
    select: function (context, node) {
      var data = checkName(node.browser, context);
      var from = parseFloat(normalizeVersion(data, node.from) || node.from);
      var to = parseFloat(normalizeVersion(data, node.to) || node.to);
      function filter(v) {
        var parsed = parseFloat(v);
        return parsed >= from && parsed <= to;
      }
      return data.released.filter(filter).map(nameMapper(data.name));
    }
  },
  electron_ray: {
    matches: ['sign', 'version'],
    regexp: /^electron\s*(>=?|<=?)\s*([\d.]+)$/i,
    select: function (context, node) {
      var versionToUse = normalizeElectron(node.version);
      return Object.keys(e2c).filter(generateFilter(node.sign, versionToUse)).map(function (i) {
        return 'chrome ' + e2c[i];
      });
    }
  },
  node_ray: {
    matches: ['sign', 'version'],
    regexp: /^node\s*(>=?|<=?)\s*([\d.]+)$/i,
    select: function (context, node) {
      return browserslist.nodeVersions.filter(generateSemverFilter(node.sign, node.version)).map(function (v) {
        return 'node ' + v;
      });
    }
  },
  browser_ray: {
    matches: ['browser', 'sign', 'version'],
    regexp: /^(\w+)\s*(>=?|<=?)\s*([\d.]+)$/,
    select: function (context, node) {
      var version = node.version;
      var data = checkName(node.browser, context);
      var alias = browserslist.versionAliases[data.name][version];
      if (alias) version = alias;
      return data.released.filter(generateFilter(node.sign, version)).map(function (v) {
        return data.name + ' ' + v;
      });
    }
  },
  firefox_esr: {
    matches: [],
    regexp: /^(firefox|ff|fx)\s+esr$/i,
    select: function () {
      return ['firefox 115', 'firefox 128'];
    }
  },
  opera_mini_all: {
    matches: [],
    regexp: /(operamini|op_mini)\s+all/i,
    select: function () {
      return ['op_mini all'];
    }
  },
  electron_version: {
    matches: ['version'],
    regexp: /^electron\s+([\d.]+)$/i,
    select: function (context, node) {
      var versionToUse = normalizeElectron(node.version);
      var chrome = e2c[versionToUse];
      if (!chrome) {
        throw new BrowserslistError('Unknown version ' + node.version + ' of electron');
      }
      return ['chrome ' + chrome];
    }
  },
  node_major_version: {
    matches: ['version'],
    regexp: /^node\s+(\d+)$/i,
    select: nodeQuery
  },
  node_minor_version: {
    matches: ['version'],
    regexp: /^node\s+(\d+\.\d+)$/i,
    select: nodeQuery
  },
  node_patch_version: {
    matches: ['version'],
    regexp: /^node\s+(\d+\.\d+\.\d+)$/i,
    select: nodeQuery
  },
  current_node: {
    matches: [],
    regexp: /^current\s+node$/i,
    select: function (context) {
      return [env.currentNode(resolve, context)];
    }
  },
  maintained_node: {
    matches: [],
    regexp: /^maintained\s+node\s+versions$/i,
    select: function (context) {
      var now = Date.now();
      var queries = Object.keys(jsEOL).filter(function (key) {
        return now < Date.parse(jsEOL[key].end) && now > Date.parse(jsEOL[key].start) && isEolReleased(key);
      }).map(function (key) {
        return 'node ' + key.slice(1);
      });
      return resolve(queries, context);
    }
  },
  phantomjs_1_9: {
    matches: [],
    regexp: /^phantomjs\s+1.9$/i,
    select: function () {
      return ['safari 5'];
    }
  },
  phantomjs_2_1: {
    matches: [],
    regexp: /^phantomjs\s+2.1$/i,
    select: function () {
      return ['safari 6'];
    }
  },
  browser_version: {
    matches: ['browser', 'version'],
    regexp: /^(\w+)\s+(tp|[\d.]+)$/i,
    select: function (context, node) {
      var version = node.version;
      if (/^tp$/i.test(version)) version = 'TP';
      var data = checkName(node.browser, context);
      var alias = normalizeVersion(data, version);
      if (alias) {
        version = alias;
      } else {
        if (version.indexOf('.') === -1) {
          alias = version + '.0';
        } else {
          alias = version.replace(/\.0$/, '');
        }
        alias = normalizeVersion(data, alias);
        if (alias) {
          version = alias;
        } else if (context.ignoreUnknownVersions) {
          return [];
        } else {
          throw new BrowserslistError('Unknown version ' + version + ' of ' + node.browser);
        }
      }
      return [data.name + ' ' + version];
    }
  },
  browserslist_config: {
    matches: [],
    regexp: /^browserslist config$/i,
    select: function (context) {
      return browserslist(undefined, context);
    }
  },
  extends: {
    matches: ['config'],
    regexp: /^extends (.+)$/i,
    select: function (context, node) {
      return resolve(env.loadQueries(context, node.config), context);
    }
  },
  defaults: {
    matches: [],
    regexp: /^defaults$/i,
    select: function (context) {
      return resolve(browserslist.defaults, context);
    }
  },
  dead: {
    matches: [],
    regexp: /^dead$/i,
    select: function (context) {
      var dead = ['Baidu >= 0', 'ie <= 11', 'ie_mob <= 11', 'bb <= 10', 'op_mob <= 12.1', 'samsung 4'];
      return resolve(dead, context);
    }
  },
  unknown: {
    matches: [],
    regexp: /^(\w+)$/i,
    select: function (context, node) {
      if (byName(node.query, context)) {
        throw new BrowserslistError('Specify versions in Browserslist query for browser ' + node.query);
      } else {
        throw unknownQuery(node.query);
      }
    }
  }
}

// Get and convert Can I Use data
;
(function () {
  for (var name in agents) {
    var browser = agents[name];
    browserslist.data[name] = {
      name: name,
      versions: normalize(agents[name].versions),
      released: normalize(agents[name].versions.slice(0, -3)),
      releaseDate: agents[name].release_date
    };
    fillUsage(browserslist.usage.global, name, browser.usage_global);
    browserslist.versionAliases[name] = {};
    for (var i = 0; i < browser.versions.length; i++) {
      var full = browser.versions[i];
      if (!full) continue;
      if (full.indexOf('-') !== -1) {
        var interval = full.split('-');
        for (var j = 0; j < interval.length; j++) {
          browserslist.versionAliases[name][interval[j]] = full;
        }
      }
    }
  }
  browserslist.nodeVersions = jsReleases.map(function (release) {
    return release.version;
  });
})();
module.exports = browserslist;

/***/ }),

/***/ "./node_modules/browserslist/parse.js":
/*!********************************************!*\
  !*** ./node_modules/browserslist/parse.js ***!
  \********************************************/
/***/ ((module) => {

var AND_REGEXP = /^\s+and\s+(.*)/i;
var OR_REGEXP = /^(?:,\s*|\s+or\s+)(.*)/i;
function flatten(array) {
  if (!Array.isArray(array)) return [array];
  return array.reduce(function (a, b) {
    return a.concat(flatten(b));
  }, []);
}
function find(string, predicate) {
  for (var max = string.length, n = 1; n <= max; n++) {
    var parsed = string.substr(-n, n);
    if (predicate(parsed, n, max)) {
      return string.slice(0, -n);
    }
  }
  return '';
}
function matchQuery(all, query) {
  var node = {
    query: query
  };
  if (query.indexOf('not ') === 0) {
    node.not = true;
    query = query.slice(4);
  }
  for (var name in all) {
    var type = all[name];
    var match = query.match(type.regexp);
    if (match) {
      node.type = name;
      for (var i = 0; i < type.matches.length; i++) {
        node[type.matches[i]] = match[i + 1];
      }
      return node;
    }
  }
  node.type = 'unknown';
  return node;
}
function matchBlock(all, string, qs) {
  var node;
  return find(string, function (parsed, n, max) {
    if (AND_REGEXP.test(parsed)) {
      node = matchQuery(all, parsed.match(AND_REGEXP)[1]);
      node.compose = 'and';
      qs.unshift(node);
      return true;
    } else if (OR_REGEXP.test(parsed)) {
      node = matchQuery(all, parsed.match(OR_REGEXP)[1]);
      node.compose = 'or';
      qs.unshift(node);
      return true;
    } else if (n === max) {
      node = matchQuery(all, parsed.trim());
      node.compose = 'or';
      qs.unshift(node);
      return true;
    }
    return false;
  });
}
module.exports = function parse(all, queries) {
  if (!Array.isArray(queries)) queries = [queries];
  return flatten(queries.map(function (block) {
    var qs = [];
    do {
      block = matchBlock(all, block, qs);
    } while (block);
    return qs;
  }));
};

/***/ }),

/***/ "./node_modules/caniuse-lite/data/agents.js":
/*!**************************************************!*\
  !*** ./node_modules/caniuse-lite/data/agents.js ***!
  \**************************************************/
/***/ ((module) => {

module.exports = {
  A: {
    A: {
      K: 0,
      E: 0,
      F: 0.0563043,
      G: 0.0422282,
      A: 0.0140761,
      B: 0.478586,
      fC: 0
    },
    B: "ms",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "fC", "K", "E", "F", "G", "A", "B", "", "", ""],
    E: "IE",
    F: {
      fC: 962323200,
      K: 998870400,
      E: 1161129600,
      F: 1237420800,
      G: 1300060800,
      A: 1346716800,
      B: 1381968000
    }
  },
  B: {
    A: {
      "4": 0.007166,
      "5": 0.007166,
      "6": 0.010749,
      "7": 0.007166,
      "8": 0.010749,
      "9": 0.039413,
      C: 0,
      L: 0,
      M: 0.003583,
      H: 0,
      N: 0,
      O: 0.007166,
      P: 0.057328,
      Q: 0,
      I: 0,
      R: 0,
      S: 0,
      T: 0,
      U: 0,
      V: 0,
      W: 0,
      X: 0,
      Y: 0,
      Z: 0,
      a: 0,
      b: 0.014332,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
      i: 0,
      j: 0,
      k: 0,
      l: 0,
      m: 0,
      n: 0,
      o: 0,
      p: 0,
      q: 0.003583,
      r: 0.007166,
      s: 0.064494,
      t: 0.007166,
      u: 0.007166,
      v: 0.007166,
      w: 0.010749,
      x: 0.014332,
      AB: 0.017915,
      BB: 0.025081,
      CB: 0.014332,
      DB: 0.025081,
      EB: 0.053745,
      FB: 0.254393,
      GB: 3.38594,
      HB: 0.917248,
      IB: 0,
      D: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "C", "L", "M", "H", "N", "O", "P", "Q", "I", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "4", "5", "6", "7", "8", "9", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "D", "", "", ""],
    E: "Edge",
    F: {
      "4": 1689897600,
      "5": 1692576000,
      "6": 1694649600,
      "7": 1697155200,
      "8": 1698969600,
      "9": 1701993600,
      C: 1438128000,
      L: 1447286400,
      M: 1470096000,
      H: 1491868800,
      N: 1508198400,
      O: 1525046400,
      P: 1542067200,
      Q: 1579046400,
      I: 1581033600,
      R: 1586736000,
      S: 1590019200,
      T: 1594857600,
      U: 1598486400,
      V: 1602201600,
      W: 1605830400,
      X: 1611360000,
      Y: 1614816000,
      Z: 1618358400,
      a: 1622073600,
      b: 1626912000,
      c: 1630627200,
      d: 1632441600,
      e: 1634774400,
      f: 1637539200,
      g: 1641427200,
      h: 1643932800,
      i: 1646265600,
      j: 1649635200,
      k: 1651190400,
      l: 1653955200,
      m: 1655942400,
      n: 1659657600,
      o: 1661990400,
      p: 1664755200,
      q: 1666915200,
      r: 1670198400,
      s: 1673481600,
      t: 1675900800,
      u: 1678665600,
      v: 1680825600,
      w: 1683158400,
      x: 1685664000,
      AB: 1706227200,
      BB: 1708732800,
      CB: 1711152000,
      DB: 1713398400,
      EB: 1715990400,
      FB: 1718841600,
      GB: 1721865600,
      HB: 1724371200,
      IB: 1726704000,
      D: 1729123200
    },
    D: {
      C: "ms",
      L: "ms",
      M: "ms",
      H: "ms",
      N: "ms",
      O: "ms",
      P: "ms"
    }
  },
  C: {
    A: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0.351134,
      "5": 0,
      "6": 0.007166,
      "7": 0.089575,
      "8": 0,
      "9": 0.007166,
      gC: 0,
      GC: 0,
      J: 0.003583,
      JB: 0,
      K: 0,
      E: 0,
      F: 0,
      G: 0,
      A: 0,
      B: 0.014332,
      C: 0,
      L: 0,
      M: 0,
      H: 0,
      N: 0,
      O: 0,
      P: 0,
      KB: 0,
      y: 0,
      z: 0,
      LB: 0,
      MB: 0,
      NB: 0,
      OB: 0,
      PB: 0,
      QB: 0,
      RB: 0,
      SB: 0,
      TB: 0,
      UB: 0,
      VB: 0,
      WB: 0,
      XB: 0,
      YB: 0,
      ZB: 0,
      aB: 0,
      bB: 0,
      cB: 0.003583,
      dB: 0.007166,
      eB: 0.003583,
      fB: 0,
      gB: 0,
      hB: 0,
      iB: 0,
      jB: 0.003583,
      kB: 0,
      lB: 0.042996,
      mB: 0,
      nB: 0.007166,
      oB: 0.003583,
      pB: 0.017915,
      qB: 0,
      rB: 0,
      HC: 0.003583,
      sB: 0,
      IC: 0,
      tB: 0,
      uB: 0,
      vB: 0,
      wB: 0,
      xB: 0,
      yB: 0,
      zB: 0,
      "0B": 0,
      "1B": 0,
      "2B": 0,
      "3B": 0,
      "4B": 0,
      "5B": 0,
      "6B": 0,
      "7B": 0,
      "8B": 0,
      "9B": 0.014332,
      Q: 0,
      I: 0,
      R: 0,
      JC: 0,
      S: 0,
      T: 0,
      U: 0,
      V: 0,
      W: 0,
      X: 0.007166,
      Y: 0,
      Z: 0,
      a: 0,
      b: 0,
      c: 0,
      d: 0.003583,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
      i: 0,
      j: 0,
      k: 0,
      l: 0.007166,
      m: 0.010749,
      n: 0,
      o: 0.003583,
      p: 0,
      q: 0,
      r: 0,
      s: 0.007166,
      t: 0,
      u: 0,
      v: 0,
      w: 0.007166,
      x: 0,
      AB: 0.007166,
      BB: 0.003583,
      CB: 0.007166,
      DB: 0.007166,
      EB: 0.014332,
      FB: 0.032247,
      GB: 0.042996,
      HB: 0.447875,
      IB: 1.08923,
      D: 0.007166,
      KC: 0,
      LC: 0,
      MC: 0,
      hC: 0,
      iC: 0,
      jC: 0,
      kC: 0
    },
    B: "moz",
    C: ["gC", "GC", "jC", "kC", "J", "JB", "K", "E", "F", "G", "A", "B", "C", "L", "M", "H", "N", "O", "P", "KB", "y", "z", "0", "1", "2", "3", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB", "aB", "bB", "cB", "dB", "eB", "fB", "gB", "hB", "iB", "jB", "kB", "lB", "mB", "nB", "oB", "pB", "qB", "rB", "HC", "sB", "IC", "tB", "uB", "vB", "wB", "xB", "yB", "zB", "0B", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "Q", "I", "R", "JC", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "4", "5", "6", "7", "8", "9", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "D", "KC", "LC", "MC", "hC", "iC"],
    E: "Firefox",
    F: {
      "0": 1368489600,
      "1": 1372118400,
      "2": 1375747200,
      "3": 1379376000,
      "4": 1688428800,
      "5": 1690848000,
      "6": 1693267200,
      "7": 1695686400,
      "8": 1698105600,
      "9": 1700524800,
      gC: 1161648000,
      GC: 1213660800,
      jC: 1246320000,
      kC: 1264032000,
      J: 1300752000,
      JB: 1308614400,
      K: 1313452800,
      E: 1317081600,
      F: 1317081600,
      G: 1320710400,
      A: 1324339200,
      B: 1327968000,
      C: 1331596800,
      L: 1335225600,
      M: 1338854400,
      H: 1342483200,
      N: 1346112000,
      O: 1349740800,
      P: 1353628800,
      KB: 1357603200,
      y: 1361232000,
      z: 1364860800,
      LB: 1386633600,
      MB: 1391472000,
      NB: 1395100800,
      OB: 1398729600,
      PB: 1402358400,
      QB: 1405987200,
      RB: 1409616000,
      SB: 1413244800,
      TB: 1417392000,
      UB: 1421107200,
      VB: 1424736000,
      WB: 1428278400,
      XB: 1431475200,
      YB: 1435881600,
      ZB: 1439251200,
      aB: 1442880000,
      bB: 1446508800,
      cB: 1450137600,
      dB: 1453852800,
      eB: 1457395200,
      fB: 1461628800,
      gB: 1465257600,
      hB: 1470096000,
      iB: 1474329600,
      jB: 1479168000,
      kB: 1485216000,
      lB: 1488844800,
      mB: 1492560000,
      nB: 1497312000,
      oB: 1502150400,
      pB: 1506556800,
      qB: 1510617600,
      rB: 1516665600,
      HC: 1520985600,
      sB: 1525824000,
      IC: 1529971200,
      tB: 1536105600,
      uB: 1540252800,
      vB: 1544486400,
      wB: 1548720000,
      xB: 1552953600,
      yB: 1558396800,
      zB: 1562630400,
      "0B": 1567468800,
      "1B": 1571788800,
      "2B": 1575331200,
      "3B": 1578355200,
      "4B": 1581379200,
      "5B": 1583798400,
      "6B": 1586304000,
      "7B": 1588636800,
      "8B": 1591056000,
      "9B": 1593475200,
      Q: 1595894400,
      I: 1598313600,
      R: 1600732800,
      JC: 1603152000,
      S: 1605571200,
      T: 1607990400,
      U: 1611619200,
      V: 1614038400,
      W: 1616457600,
      X: 1618790400,
      Y: 1622505600,
      Z: 1626134400,
      a: 1628553600,
      b: 1630972800,
      c: 1633392000,
      d: 1635811200,
      e: 1638835200,
      f: 1641859200,
      g: 1644364800,
      h: 1646697600,
      i: 1649116800,
      j: 1651536000,
      k: 1653955200,
      l: 1656374400,
      m: 1658793600,
      n: 1661212800,
      o: 1663632000,
      p: 1666051200,
      q: 1668470400,
      r: 1670889600,
      s: 1673913600,
      t: 1676332800,
      u: 1678752000,
      v: 1681171200,
      w: 1683590400,
      x: 1686009600,
      AB: 1702944000,
      BB: 1705968000,
      CB: 1708387200,
      DB: 1710806400,
      EB: 1713225600,
      FB: 1715644800,
      GB: 1718064000,
      HB: 1720483200,
      IB: 1722902400,
      D: 1725321600,
      KC: 1727740800,
      LC: 1730160000,
      MC: null,
      hC: null,
      iC: null
    }
  },
  D: {
    A: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0.03583,
      "5": 0.168401,
      "6": 0.10749,
      "7": 0.07166,
      "8": 0.068077,
      "9": 0.10749,
      J: 0,
      JB: 0,
      K: 0,
      E: 0,
      F: 0,
      G: 0,
      A: 0,
      B: 0,
      C: 0,
      L: 0,
      M: 0,
      H: 0,
      N: 0,
      O: 0,
      P: 0,
      KB: 0,
      y: 0,
      z: 0,
      LB: 0,
      MB: 0,
      NB: 0,
      OB: 0,
      PB: 0,
      QB: 0,
      RB: 0,
      SB: 0,
      TB: 0,
      UB: 0,
      VB: 0,
      WB: 0,
      XB: 0.010749,
      YB: 0,
      ZB: 0,
      aB: 0,
      bB: 0,
      cB: 0,
      dB: 0,
      eB: 0.003583,
      fB: 0,
      gB: 0.007166,
      hB: 0.025081,
      iB: 0.021498,
      jB: 0.007166,
      kB: 0.003583,
      lB: 0.003583,
      mB: 0.007166,
      nB: 0,
      oB: 0,
      pB: 0.032247,
      qB: 0.003583,
      rB: 0.007166,
      HC: 0,
      sB: 0,
      IC: 0.003583,
      tB: 0,
      uB: 0,
      vB: 0,
      wB: 0,
      xB: 0.025081,
      yB: 0.007166,
      zB: 0,
      "0B": 0.028664,
      "1B": 0.028664,
      "2B": 0,
      "3B": 0,
      "4B": 0.007166,
      "5B": 0.010749,
      "6B": 0.010749,
      "7B": 0.007166,
      "8B": 0.021498,
      "9B": 0.017915,
      Q: 0.103907,
      I: 0.014332,
      R: 0.021498,
      S: 0.032247,
      T: 0.010749,
      U: 0.014332,
      V: 0.025081,
      W: 0.075243,
      X: 0.017915,
      Y: 0.010749,
      Z: 0.014332,
      a: 0.053745,
      b: 0.014332,
      c: 0.014332,
      d: 0.050162,
      e: 0.010749,
      f: 0.010749,
      g: 0.017915,
      h: 0.046579,
      i: 0.025081,
      j: 0.021498,
      k: 0.021498,
      l: 0.017915,
      m: 0.111073,
      n: 0.085992,
      o: 0.017915,
      p: 0.028664,
      q: 0.03583,
      r: 0.046579,
      s: 1.42603,
      t: 0.025081,
      u: 0.039413,
      v: 0.050162,
      w: 0.10749,
      x: 0.103907,
      AB: 0.10749,
      BB: 0.118239,
      CB: 0.14332,
      DB: 0.229312,
      EB: 0.369049,
      FB: 1.49053,
      GB: 12.777,
      HB: 2.30745,
      IB: 0.014332,
      D: 0.003583,
      KC: 0,
      LC: 0,
      MC: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "J", "JB", "K", "E", "F", "G", "A", "B", "C", "L", "M", "H", "N", "O", "P", "KB", "y", "z", "0", "1", "2", "3", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB", "aB", "bB", "cB", "dB", "eB", "fB", "gB", "hB", "iB", "jB", "kB", "lB", "mB", "nB", "oB", "pB", "qB", "rB", "HC", "sB", "IC", "tB", "uB", "vB", "wB", "xB", "yB", "zB", "0B", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "Q", "I", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "4", "5", "6", "7", "8", "9", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "D", "KC", "LC", "MC"],
    E: "Chrome",
    F: {
      "0": 1343692800,
      "1": 1348531200,
      "2": 1352246400,
      "3": 1357862400,
      "4": 1689724800,
      "5": 1692057600,
      "6": 1694476800,
      "7": 1696896000,
      "8": 1698710400,
      "9": 1701993600,
      J: 1264377600,
      JB: 1274745600,
      K: 1283385600,
      E: 1287619200,
      F: 1291248000,
      G: 1296777600,
      A: 1299542400,
      B: 1303862400,
      C: 1307404800,
      L: 1312243200,
      M: 1316131200,
      H: 1316131200,
      N: 1319500800,
      O: 1323734400,
      P: 1328659200,
      KB: 1332892800,
      y: 1337040000,
      z: 1340668800,
      LB: 1361404800,
      MB: 1364428800,
      NB: 1369094400,
      OB: 1374105600,
      PB: 1376956800,
      QB: 1384214400,
      RB: 1389657600,
      SB: 1392940800,
      TB: 1397001600,
      UB: 1400544000,
      VB: 1405468800,
      WB: 1409011200,
      XB: 1412640000,
      YB: 1416268800,
      ZB: 1421798400,
      aB: 1425513600,
      bB: 1429401600,
      cB: 1432080000,
      dB: 1437523200,
      eB: 1441152000,
      fB: 1444780800,
      gB: 1449014400,
      hB: 1453248000,
      iB: 1456963200,
      jB: 1460592000,
      kB: 1464134400,
      lB: 1469059200,
      mB: 1472601600,
      nB: 1476230400,
      oB: 1480550400,
      pB: 1485302400,
      qB: 1489017600,
      rB: 1492560000,
      HC: 1496707200,
      sB: 1500940800,
      IC: 1504569600,
      tB: 1508198400,
      uB: 1512518400,
      vB: 1516752000,
      wB: 1520294400,
      xB: 1523923200,
      yB: 1527552000,
      zB: 1532390400,
      "0B": 1536019200,
      "1B": 1539648000,
      "2B": 1543968000,
      "3B": 1548720000,
      "4B": 1552348800,
      "5B": 1555977600,
      "6B": 1559606400,
      "7B": 1564444800,
      "8B": 1568073600,
      "9B": 1571702400,
      Q: 1575936000,
      I: 1580860800,
      R: 1586304000,
      S: 1589846400,
      T: 1594684800,
      U: 1598313600,
      V: 1601942400,
      W: 1605571200,
      X: 1611014400,
      Y: 1614556800,
      Z: 1618272000,
      a: 1621987200,
      b: 1626739200,
      c: 1630368000,
      d: 1632268800,
      e: 1634601600,
      f: 1637020800,
      g: 1641340800,
      h: 1643673600,
      i: 1646092800,
      j: 1648512000,
      k: 1650931200,
      l: 1653350400,
      m: 1655769600,
      n: 1659398400,
      o: 1661817600,
      p: 1664236800,
      q: 1666656000,
      r: 1669680000,
      s: 1673308800,
      t: 1675728000,
      u: 1678147200,
      v: 1680566400,
      w: 1682985600,
      x: 1685404800,
      AB: 1705968000,
      BB: 1708387200,
      CB: 1710806400,
      DB: 1713225600,
      EB: 1715644800,
      FB: 1718064000,
      GB: 1721174400,
      HB: 1724112000,
      IB: 1726531200,
      D: 1728950400,
      KC: null,
      LC: null,
      MC: null
    }
  },
  E: {
    A: {
      J: 0,
      JB: 0,
      K: 0,
      E: 0,
      F: 0,
      G: 0.003583,
      A: 0,
      B: 0,
      C: 0,
      L: 0.007166,
      M: 0.028664,
      H: 0.007166,
      lC: 0,
      NC: 0,
      mC: 0,
      nC: 0,
      oC: 0,
      pC: 0,
      OC: 0,
      AC: 0.007166,
      BC: 0.010749,
      qC: 0.057328,
      rC: 0.078826,
      sC: 0.025081,
      PC: 0.010749,
      QC: 0.021498,
      CC: 0.028664,
      tC: 0.218563,
      DC: 0.028664,
      RC: 0.03583,
      SC: 0.032247,
      TC: 0.182733,
      UC: 0.021498,
      VC: 0.042996,
      uC: 0.290223,
      EC: 0.017915,
      WC: 0.039413,
      XC: 0.039413,
      YC: 0.042996,
      ZC: 0.118239,
      aC: 1.44753,
      bC: 0.415628,
      FC: 0.017915,
      cC: 0,
      vC: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "lC", "NC", "J", "JB", "mC", "K", "nC", "E", "oC", "F", "G", "pC", "A", "OC", "B", "AC", "C", "BC", "L", "qC", "M", "rC", "H", "sC", "PC", "QC", "CC", "tC", "DC", "RC", "SC", "TC", "UC", "VC", "uC", "EC", "WC", "XC", "YC", "ZC", "aC", "bC", "FC", "cC", "vC", ""],
    E: "Safari",
    F: {
      lC: 1205798400,
      NC: 1226534400,
      J: 1244419200,
      JB: 1275868800,
      mC: 1311120000,
      K: 1343174400,
      nC: 1382400000,
      E: 1382400000,
      oC: 1410998400,
      F: 1413417600,
      G: 1443657600,
      pC: 1458518400,
      A: 1474329600,
      OC: 1490572800,
      B: 1505779200,
      AC: 1522281600,
      C: 1537142400,
      BC: 1553472000,
      L: 1568851200,
      qC: 1585008000,
      M: 1600214400,
      rC: 1619395200,
      H: 1632096000,
      sC: 1635292800,
      PC: 1639353600,
      QC: 1647216000,
      CC: 1652745600,
      tC: 1658275200,
      DC: 1662940800,
      RC: 1666569600,
      SC: 1670889600,
      TC: 1674432000,
      UC: 1679875200,
      VC: 1684368000,
      uC: 1690156800,
      EC: 1695686400,
      WC: 1698192000,
      XC: 1702252800,
      YC: 1705881600,
      ZC: 1709596800,
      aC: 1715558400,
      bC: 1722211200,
      FC: 1726444800,
      cC: null,
      vC: null
    }
  },
  F: {
    A: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      G: 0,
      B: 0,
      C: 0,
      H: 0,
      N: 0,
      O: 0,
      P: 0,
      KB: 0,
      y: 0,
      z: 0,
      LB: 0,
      MB: 0,
      NB: 0,
      OB: 0,
      PB: 0,
      QB: 0,
      RB: 0,
      SB: 0,
      TB: 0,
      UB: 0,
      VB: 0,
      WB: 0,
      XB: 0,
      YB: 0,
      ZB: 0.003583,
      aB: 0,
      bB: 0,
      cB: 0,
      dB: 0,
      eB: 0,
      fB: 0.017915,
      gB: 0,
      hB: 0,
      iB: 0,
      jB: 0,
      kB: 0,
      lB: 0,
      mB: 0,
      nB: 0,
      oB: 0,
      pB: 0,
      qB: 0,
      rB: 0,
      sB: 0,
      tB: 0,
      uB: 0,
      vB: 0,
      wB: 0,
      xB: 0,
      yB: 0,
      zB: 0,
      "0B": 0,
      "1B": 0,
      "2B": 0,
      "3B": 0,
      "4B": 0,
      "5B": 0,
      "6B": 0,
      "7B": 0,
      "8B": 0,
      "9B": 0,
      Q: 0,
      I: 0,
      R: 0,
      JC: 0,
      S: 0.028664,
      T: 0.003583,
      U: 0,
      V: 0,
      W: 0,
      X: 0,
      Y: 0,
      Z: 0,
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0.039413,
      f: 0,
      g: 0,
      h: 0,
      i: 0,
      j: 0,
      k: 0,
      l: 0.032247,
      m: 0,
      n: 0,
      o: 0,
      p: 0,
      q: 0,
      r: 0,
      s: 0.154069,
      t: 0,
      u: 0.060911,
      v: 0,
      w: 0,
      x: 0,
      wC: 0,
      xC: 0,
      yC: 0,
      zC: 0,
      AC: 0,
      dC: 0,
      "0C": 0,
      BC: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "G", "wC", "xC", "yC", "zC", "B", "AC", "dC", "0C", "C", "BC", "H", "N", "O", "P", "KB", "y", "z", "0", "1", "2", "3", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB", "aB", "bB", "cB", "dB", "eB", "fB", "gB", "hB", "iB", "jB", "kB", "lB", "mB", "nB", "oB", "pB", "qB", "rB", "sB", "tB", "uB", "vB", "wB", "xB", "yB", "zB", "0B", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "Q", "I", "R", "JC", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "", "", ""],
    E: "Opera",
    F: {
      "0": 1401753600,
      "1": 1405987200,
      "2": 1409616000,
      "3": 1413331200,
      G: 1150761600,
      wC: 1223424000,
      xC: 1251763200,
      yC: 1267488000,
      zC: 1277942400,
      B: 1292457600,
      AC: 1302566400,
      dC: 1309219200,
      "0C": 1323129600,
      C: 1323129600,
      BC: 1352073600,
      H: 1372723200,
      N: 1377561600,
      O: 1381104000,
      P: 1386288000,
      KB: 1390867200,
      y: 1393891200,
      z: 1399334400,
      LB: 1417132800,
      MB: 1422316800,
      NB: 1425945600,
      OB: 1430179200,
      PB: 1433808000,
      QB: 1438646400,
      RB: 1442448000,
      SB: 1445904000,
      TB: 1449100800,
      UB: 1454371200,
      VB: 1457308800,
      WB: 1462320000,
      XB: 1465344000,
      YB: 1470096000,
      ZB: 1474329600,
      aB: 1477267200,
      bB: 1481587200,
      cB: 1486425600,
      dB: 1490054400,
      eB: 1494374400,
      fB: 1498003200,
      gB: 1502236800,
      hB: 1506470400,
      iB: 1510099200,
      jB: 1515024000,
      kB: 1517961600,
      lB: 1521676800,
      mB: 1525910400,
      nB: 1530144000,
      oB: 1534982400,
      pB: 1537833600,
      qB: 1543363200,
      rB: 1548201600,
      sB: 1554768000,
      tB: 1561593600,
      uB: 1566259200,
      vB: 1570406400,
      wB: 1573689600,
      xB: 1578441600,
      yB: 1583971200,
      zB: 1587513600,
      "0B": 1592956800,
      "1B": 1595894400,
      "2B": 1600128000,
      "3B": 1603238400,
      "4B": 1613520000,
      "5B": 1612224000,
      "6B": 1616544000,
      "7B": 1619568000,
      "8B": 1623715200,
      "9B": 1627948800,
      Q: 1631577600,
      I: 1633392000,
      R: 1635984000,
      JC: 1638403200,
      S: 1642550400,
      T: 1644969600,
      U: 1647993600,
      V: 1650412800,
      W: 1652745600,
      X: 1654646400,
      Y: 1657152000,
      Z: 1660780800,
      a: 1663113600,
      b: 1668816000,
      c: 1668643200,
      d: 1671062400,
      e: 1675209600,
      f: 1677024000,
      g: 1679529600,
      h: 1681948800,
      i: 1684195200,
      j: 1687219200,
      k: 1690329600,
      l: 1692748800,
      m: 1696204800,
      n: 1699920000,
      o: 1699920000,
      p: 1702944000,
      q: 1707264000,
      r: 1710115200,
      s: 1711497600,
      t: 1716336000,
      u: 1719273600,
      v: 1721088000,
      w: 1724284800,
      x: 1727222400
    },
    D: {
      G: "o",
      B: "o",
      C: "o",
      wC: "o",
      xC: "o",
      yC: "o",
      zC: "o",
      AC: "o",
      dC: "o",
      "0C": "o",
      BC: "o"
    }
  },
  G: {
    A: {
      F: 0,
      NC: 0,
      "1C": 0,
      eC: 0.00447708,
      "2C": 0.00149236,
      "3C": 0.00746181,
      "4C": 0.00895417,
      "5C": 0,
      "6C": 0.00746181,
      "7C": 0.0298472,
      "8C": 0.00895417,
      "9C": 0.0462632,
      AD: 0.117897,
      BD: 0.0149236,
      CD: 0.0119389,
      DD: 0.199976,
      ED: 0.00298472,
      FD: 0.0656639,
      GD: 0.00895417,
      HD: 0.037309,
      ID: 0.152221,
      JD: 0.105958,
      KD: 0.0567097,
      PC: 0.0567097,
      QC: 0.0671563,
      CC: 0.0790952,
      LD: 0.741704,
      DC: 0.150729,
      RC: 0.317873,
      SC: 0.15819,
      TC: 0.264148,
      UC: 0.0656639,
      VC: 0.10745,
      MD: 0.920787,
      EC: 0.0850646,
      WC: 0.131328,
      XC: 0.120881,
      YC: 0.179083,
      ZC: 0.419354,
      aC: 8.55869,
      bC: 1.44162,
      FC: 0.156698,
      cC: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "NC", "1C", "eC", "2C", "3C", "4C", "F", "5C", "6C", "7C", "8C", "9C", "AD", "BD", "CD", "DD", "ED", "FD", "GD", "HD", "ID", "JD", "KD", "PC", "QC", "CC", "LD", "DC", "RC", "SC", "TC", "UC", "VC", "MD", "EC", "WC", "XC", "YC", "ZC", "aC", "bC", "FC", "cC", "", ""],
    E: "Safari on iOS",
    F: {
      NC: 1270252800,
      "1C": 1283904000,
      eC: 1299628800,
      "2C": 1331078400,
      "3C": 1359331200,
      "4C": 1394409600,
      F: 1410912000,
      "5C": 1413763200,
      "6C": 1442361600,
      "7C": 1458518400,
      "8C": 1473724800,
      "9C": 1490572800,
      AD: 1505779200,
      BD: 1522281600,
      CD: 1537142400,
      DD: 1553472000,
      ED: 1568851200,
      FD: 1572220800,
      GD: 1580169600,
      HD: 1585008000,
      ID: 1600214400,
      JD: 1619395200,
      KD: 1632096000,
      PC: 1639353600,
      QC: 1647216000,
      CC: 1652659200,
      LD: 1658275200,
      DC: 1662940800,
      RC: 1666569600,
      SC: 1670889600,
      TC: 1674432000,
      UC: 1679875200,
      VC: 1684368000,
      MD: 1690156800,
      EC: 1694995200,
      WC: 1698192000,
      XC: 1702252800,
      YC: 1705881600,
      ZC: 1709596800,
      aC: 1715558400,
      bC: 1722211200,
      FC: 1726444800,
      cC: null
    }
  },
  H: {
    A: {
      ND: 0.05
    },
    B: "o",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "ND", "", "", ""],
    E: "Opera Mini",
    F: {
      ND: 1426464000
    }
  },
  I: {
    A: {
      GC: 0,
      J: 0.0000327216,
      D: 0.326169,
      OD: 0,
      PD: 0,
      QD: 0,
      RD: 0.000130886,
      eC: 0.000130886,
      SD: 0,
      TD: 0.000523546
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OD", "PD", "QD", "GC", "J", "RD", "eC", "SD", "TD", "D", "", "", ""],
    E: "Android Browser",
    F: {
      OD: 1256515200,
      PD: 1274313600,
      QD: 1291593600,
      GC: 1298332800,
      J: 1318896000,
      RD: 1341792000,
      eC: 1374624000,
      SD: 1386547200,
      TD: 1401667200,
      D: 1728864000
    }
  },
  J: {
    A: {
      E: 0,
      A: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "E", "A", "", "", ""],
    E: "Blackberry Browser",
    F: {
      E: 1325376000,
      A: 1359504000
    }
  },
  K: {
    A: {
      A: 0,
      B: 0,
      C: 0,
      I: 1.24603,
      AC: 0,
      dC: 0,
      BC: 0
    },
    B: "o",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "A", "B", "AC", "dC", "C", "BC", "I", "", "", ""],
    E: "Opera Mobile",
    F: {
      A: 1287100800,
      B: 1300752000,
      AC: 1314835200,
      dC: 1318291200,
      C: 1330300800,
      BC: 1349740800,
      I: 1709769600
    },
    D: {
      I: "webkit"
    }
  },
  L: {
    A: {
      D: 44.331
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "D", "", "", ""],
    E: "Chrome for Android",
    F: {
      D: 1728864000
    }
  },
  M: {
    A: {
      D: 0.365712
    },
    B: "moz",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "D", "", "", ""],
    E: "Firefox for Android",
    F: {
      D: 1725321600
    }
  },
  N: {
    A: {
      A: 0,
      B: 0
    },
    B: "ms",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "A", "B", "", "", ""],
    E: "IE Mobile",
    F: {
      A: 1340150400,
      B: 1353456000
    }
  },
  O: {
    A: {
      CC: 1.13563
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "CC", "", "", ""],
    E: "UC Browser for Android",
    F: {
      CC: 1710115200
    },
    D: {
      CC: "webkit"
    }
  },
  P: {
    A: {
      "0": 0.0647361,
      "1": 0.0647361,
      "2": 0.0755255,
      "3": 1.27314,
      J: 0.0971042,
      y: 0.0215787,
      z: 0.0431574,
      UD: 0.0107894,
      VD: 0.0107894,
      WD: 0.0323681,
      XD: 0,
      YD: 0,
      OC: 0,
      ZD: 0.0107894,
      aD: 0,
      bD: 0.0107894,
      cD: 0,
      dD: 0,
      DC: 0,
      EC: 0.0215787,
      FC: 0,
      eD: 0.0215787
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "J", "UD", "VD", "WD", "XD", "YD", "OC", "ZD", "aD", "bD", "cD", "dD", "DC", "EC", "FC", "eD", "y", "z", "0", "1", "2", "3", "", "", ""],
    E: "Samsung Internet",
    F: {
      "0": 1689292800,
      "1": 1697587200,
      "2": 1711497600,
      "3": 1715126400,
      J: 1461024000,
      UD: 1481846400,
      VD: 1509408000,
      WD: 1528329600,
      XD: 1546128000,
      YD: 1554163200,
      OC: 1567900800,
      ZD: 1582588800,
      aD: 1593475200,
      bD: 1605657600,
      cD: 1618531200,
      dD: 1629072000,
      DC: 1640736000,
      EC: 1651708800,
      FC: 1659657600,
      eD: 1667260800,
      y: 1677369600,
      z: 1684454400
    }
  },
  Q: {
    A: {
      fD: 0.3208
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "fD", "", "", ""],
    E: "QQ Browser",
    F: {
      fD: 1710288000
    }
  },
  R: {
    A: {
      gD: 0
    },
    B: "webkit",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "gD", "", "", ""],
    E: "Baidu Browser",
    F: {
      gD: 1710201600
    }
  },
  S: {
    A: {
      hD: 0.051328,
      iD: 0
    },
    B: "moz",
    C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "hD", "iD", "", "", ""],
    E: "KaiOS Browser",
    F: {
      hD: 1527811200,
      iD: 1631664000
    }
  }
};

/***/ }),

/***/ "./node_modules/caniuse-lite/data/browserVersions.js":
/*!***********************************************************!*\
  !*** ./node_modules/caniuse-lite/data/browserVersions.js ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = {
  "0": "22",
  "1": "23",
  "2": "24",
  "3": "25",
  "4": "115",
  "5": "116",
  "6": "117",
  "7": "118",
  "8": "119",
  "9": "120",
  A: "10",
  B: "11",
  C: "12",
  D: "130",
  E: "7",
  F: "8",
  G: "9",
  H: "15",
  I: "80",
  J: "4",
  K: "6",
  L: "13",
  M: "14",
  N: "16",
  O: "17",
  P: "18",
  Q: "79",
  R: "81",
  S: "83",
  T: "84",
  U: "85",
  V: "86",
  W: "87",
  X: "88",
  Y: "89",
  Z: "90",
  a: "91",
  b: "92",
  c: "93",
  d: "94",
  e: "95",
  f: "96",
  g: "97",
  h: "98",
  i: "99",
  j: "100",
  k: "101",
  l: "102",
  m: "103",
  n: "104",
  o: "105",
  p: "106",
  q: "107",
  r: "108",
  s: "109",
  t: "110",
  u: "111",
  v: "112",
  w: "113",
  x: "114",
  y: "20",
  z: "21",
  AB: "121",
  BB: "122",
  CB: "123",
  DB: "124",
  EB: "125",
  FB: "126",
  GB: "127",
  HB: "128",
  IB: "129",
  JB: "5",
  KB: "19",
  LB: "26",
  MB: "27",
  NB: "28",
  OB: "29",
  PB: "30",
  QB: "31",
  RB: "32",
  SB: "33",
  TB: "34",
  UB: "35",
  VB: "36",
  WB: "37",
  XB: "38",
  YB: "39",
  ZB: "40",
  aB: "41",
  bB: "42",
  cB: "43",
  dB: "44",
  eB: "45",
  fB: "46",
  gB: "47",
  hB: "48",
  iB: "49",
  jB: "50",
  kB: "51",
  lB: "52",
  mB: "53",
  nB: "54",
  oB: "55",
  pB: "56",
  qB: "57",
  rB: "58",
  sB: "60",
  tB: "62",
  uB: "63",
  vB: "64",
  wB: "65",
  xB: "66",
  yB: "67",
  zB: "68",
  "0B": "69",
  "1B": "70",
  "2B": "71",
  "3B": "72",
  "4B": "73",
  "5B": "74",
  "6B": "75",
  "7B": "76",
  "8B": "77",
  "9B": "78",
  AC: "11.1",
  BC: "12.1",
  CC: "15.5",
  DC: "16.0",
  EC: "17.0",
  FC: "18.0",
  GC: "3",
  HC: "59",
  IC: "61",
  JC: "82",
  KC: "131",
  LC: "132",
  MC: "133",
  NC: "3.2",
  OC: "10.1",
  PC: "15.2-15.3",
  QC: "15.4",
  RC: "16.1",
  SC: "16.2",
  TC: "16.3",
  UC: "16.4",
  VC: "16.5",
  WC: "17.1",
  XC: "17.2",
  YC: "17.3",
  ZC: "17.4",
  aC: "17.5",
  bC: "17.6",
  cC: "18.1",
  dC: "11.5",
  eC: "4.2-4.3",
  fC: "5.5",
  gC: "2",
  hC: "134",
  iC: "135",
  jC: "3.5",
  kC: "3.6",
  lC: "3.1",
  mC: "5.1",
  nC: "6.1",
  oC: "7.1",
  pC: "9.1",
  qC: "13.1",
  rC: "14.1",
  sC: "15.1",
  tC: "15.6",
  uC: "16.6",
  vC: "TP",
  wC: "9.5-9.6",
  xC: "10.0-10.1",
  yC: "10.5",
  zC: "10.6",
  "0C": "11.6",
  "1C": "4.0-4.1",
  "2C": "5.0-5.1",
  "3C": "6.0-6.1",
  "4C": "7.0-7.1",
  "5C": "8.1-8.4",
  "6C": "9.0-9.2",
  "7C": "9.3",
  "8C": "10.0-10.2",
  "9C": "10.3",
  AD: "11.0-11.2",
  BD: "11.3-11.4",
  CD: "12.0-12.1",
  DD: "12.2-12.5",
  ED: "13.0-13.1",
  FD: "13.2",
  GD: "13.3",
  HD: "13.4-13.7",
  ID: "14.0-14.4",
  JD: "14.5-14.8",
  KD: "15.0-15.1",
  LD: "15.6-15.8",
  MD: "16.6-16.7",
  ND: "all",
  OD: "2.1",
  PD: "2.2",
  QD: "2.3",
  RD: "4.1",
  SD: "4.4",
  TD: "4.4.3-4.4.4",
  UD: "5.0-5.4",
  VD: "6.2-6.4",
  WD: "7.2-7.4",
  XD: "8.2",
  YD: "9.2",
  ZD: "11.1-11.2",
  aD: "12.0",
  bD: "13.0",
  cD: "14.0",
  dD: "15.0",
  eD: "19.0",
  fD: "14.9",
  gD: "13.52",
  hD: "2.5",
  iD: "3.0-3.1"
};

/***/ }),

/***/ "./node_modules/caniuse-lite/data/browsers.js":
/*!****************************************************!*\
  !*** ./node_modules/caniuse-lite/data/browsers.js ***!
  \****************************************************/
/***/ ((module) => {

module.exports = {
  A: "ie",
  B: "edge",
  C: "firefox",
  D: "chrome",
  E: "safari",
  F: "opera",
  G: "ios_saf",
  H: "op_mini",
  I: "android",
  J: "bb",
  K: "op_mob",
  L: "and_chr",
  M: "and_ff",
  N: "ie_mob",
  O: "and_uc",
  P: "samsung",
  Q: "and_qq",
  R: "baidu",
  S: "kaios"
};

/***/ }),

/***/ "./node_modules/caniuse-lite/dist/unpacker/agents.js":
/*!***********************************************************!*\
  !*** ./node_modules/caniuse-lite/dist/unpacker/agents.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const browsers = (__webpack_require__(/*! ./browsers */ "./node_modules/caniuse-lite/dist/unpacker/browsers.js").browsers);
const versions = (__webpack_require__(/*! ./browserVersions */ "./node_modules/caniuse-lite/dist/unpacker/browserVersions.js").browserVersions);
const agentsData = __webpack_require__(/*! ../../data/agents */ "./node_modules/caniuse-lite/data/agents.js");
function unpackBrowserVersions(versionsData) {
  return Object.keys(versionsData).reduce((usage, version) => {
    usage[versions[version]] = versionsData[version];
    return usage;
  }, {});
}
module.exports.agents = Object.keys(agentsData).reduce((map, key) => {
  let versionsData = agentsData[key];
  map[browsers[key]] = Object.keys(versionsData).reduce((data, entry) => {
    if (entry === 'A') {
      data.usage_global = unpackBrowserVersions(versionsData[entry]);
    } else if (entry === 'C') {
      data.versions = versionsData[entry].reduce((list, version) => {
        if (version === '') {
          list.push(null);
        } else {
          list.push(versions[version]);
        }
        return list;
      }, []);
    } else if (entry === 'D') {
      data.prefix_exceptions = unpackBrowserVersions(versionsData[entry]);
    } else if (entry === 'E') {
      data.browser = versionsData[entry];
    } else if (entry === 'F') {
      data.release_date = Object.keys(versionsData[entry]).reduce((map2, key2) => {
        map2[versions[key2]] = versionsData[entry][key2];
        return map2;
      }, {});
    } else {
      // entry is B
      data.prefix = versionsData[entry];
    }
    return data;
  }, {});
  return map;
}, {});

/***/ }),

/***/ "./node_modules/caniuse-lite/dist/unpacker/browserVersions.js":
/*!********************************************************************!*\
  !*** ./node_modules/caniuse-lite/dist/unpacker/browserVersions.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports.browserVersions = __webpack_require__(/*! ../../data/browserVersions */ "./node_modules/caniuse-lite/data/browserVersions.js");

/***/ }),

/***/ "./node_modules/caniuse-lite/dist/unpacker/browsers.js":
/*!*************************************************************!*\
  !*** ./node_modules/caniuse-lite/dist/unpacker/browsers.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports.browsers = __webpack_require__(/*! ../../data/browsers */ "./node_modules/caniuse-lite/data/browsers.js");

/***/ }),

/***/ "./node_modules/electron-to-chromium/versions.js":
/*!*******************************************************!*\
  !*** ./node_modules/electron-to-chromium/versions.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = {
  "0.20": "39",
  "0.21": "41",
  "0.22": "41",
  "0.23": "41",
  "0.24": "41",
  "0.25": "42",
  "0.26": "42",
  "0.27": "43",
  "0.28": "43",
  "0.29": "43",
  "0.30": "44",
  "0.31": "45",
  "0.32": "45",
  "0.33": "45",
  "0.34": "45",
  "0.35": "45",
  "0.36": "47",
  "0.37": "49",
  "1.0": "49",
  "1.1": "50",
  "1.2": "51",
  "1.3": "52",
  "1.4": "53",
  "1.5": "54",
  "1.6": "56",
  "1.7": "58",
  "1.8": "59",
  "2.0": "61",
  "2.1": "61",
  "3.0": "66",
  "3.1": "66",
  "4.0": "69",
  "4.1": "69",
  "4.2": "69",
  "5.0": "73",
  "6.0": "76",
  "6.1": "76",
  "7.0": "78",
  "7.1": "78",
  "7.2": "78",
  "7.3": "78",
  "8.0": "80",
  "8.1": "80",
  "8.2": "80",
  "8.3": "80",
  "8.4": "80",
  "8.5": "80",
  "9.0": "83",
  "9.1": "83",
  "9.2": "83",
  "9.3": "83",
  "9.4": "83",
  "10.0": "85",
  "10.1": "85",
  "10.2": "85",
  "10.3": "85",
  "10.4": "85",
  "11.0": "87",
  "11.1": "87",
  "11.2": "87",
  "11.3": "87",
  "11.4": "87",
  "11.5": "87",
  "12.0": "89",
  "12.1": "89",
  "12.2": "89",
  "13.0": "91",
  "13.1": "91",
  "13.2": "91",
  "13.3": "91",
  "13.4": "91",
  "13.5": "91",
  "13.6": "91",
  "14.0": "93",
  "14.1": "93",
  "14.2": "93",
  "15.0": "94",
  "15.1": "94",
  "15.2": "94",
  "15.3": "94",
  "15.4": "94",
  "15.5": "94",
  "16.0": "96",
  "16.1": "96",
  "16.2": "96",
  "17.0": "98",
  "17.1": "98",
  "17.2": "98",
  "17.3": "98",
  "17.4": "98",
  "18.0": "100",
  "18.1": "100",
  "18.2": "100",
  "18.3": "100",
  "19.0": "102",
  "19.1": "102",
  "20.0": "104",
  "20.1": "104",
  "20.2": "104",
  "20.3": "104",
  "21.0": "106",
  "21.1": "106",
  "21.2": "106",
  "21.3": "106",
  "21.4": "106",
  "22.0": "108",
  "22.1": "108",
  "22.2": "108",
  "22.3": "108",
  "23.0": "110",
  "23.1": "110",
  "23.2": "110",
  "23.3": "110",
  "24.0": "112",
  "24.1": "112",
  "24.2": "112",
  "24.3": "112",
  "24.4": "112",
  "24.5": "112",
  "24.6": "112",
  "24.7": "112",
  "24.8": "112",
  "25.0": "114",
  "25.1": "114",
  "25.2": "114",
  "25.3": "114",
  "25.4": "114",
  "25.5": "114",
  "25.6": "114",
  "25.7": "114",
  "25.8": "114",
  "25.9": "114",
  "26.0": "116",
  "26.1": "116",
  "26.2": "116",
  "26.3": "116",
  "26.4": "116",
  "26.5": "116",
  "26.6": "116",
  "27.0": "118",
  "27.1": "118",
  "27.2": "118",
  "27.3": "118",
  "28.0": "120",
  "28.1": "120",
  "28.2": "120",
  "28.3": "120",
  "29.0": "122",
  "29.1": "122",
  "29.2": "122",
  "29.3": "122",
  "29.4": "122",
  "30.0": "124",
  "30.1": "124",
  "30.2": "124",
  "30.3": "124",
  "30.4": "124",
  "30.5": "124",
  "31.0": "126",
  "31.1": "126",
  "31.2": "126",
  "31.3": "126",
  "31.4": "126",
  "31.5": "126",
  "31.6": "126",
  "31.7": "126",
  "32.0": "128",
  "32.1": "128",
  "32.2": "128",
  "33.0": "130",
  "34.0": "132"
};

/***/ }),

/***/ "./node_modules/lru-cache/index.js":
/*!*****************************************!*\
  !*** ./node_modules/lru-cache/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(/*! yallist */ "./node_modules/yallist/yallist.js");
const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');
const naiveLength = () => 1;

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor(options) {
    if (typeof options === 'number') options = {
      max: options
    };
    if (!options) options = {};
    if (options.max && (typeof options.max !== 'number' || options.max < 0)) throw new TypeError('max must be a non-negative number');
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity;
    const lc = options.length || naiveLength;
    this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
    this[ALLOW_STALE] = options.stale || false;
    if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError('maxAge must be a number');
    this[MAX_AGE] = options.maxAge || 0;
    this[DISPOSE] = options.dispose;
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
    this.reset();
  }

  // resize the cache when the max changes.
  set max(mL) {
    if (typeof mL !== 'number' || mL < 0) throw new TypeError('max must be a non-negative number');
    this[MAX] = mL || Infinity;
    trim(this);
  }
  get max() {
    return this[MAX];
  }
  set allowStale(allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  }
  get allowStale() {
    return this[ALLOW_STALE];
  }
  set maxAge(mA) {
    if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');
    this[MAX_AGE] = mA;
    trim(this);
  }
  get maxAge() {
    return this[MAX_AGE];
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator(lC) {
    if (typeof lC !== 'function') lC = naiveLength;
    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      });
    }
    trim(this);
  }
  get lengthCalculator() {
    return this[LENGTH_CALCULATOR];
  }
  get length() {
    return this[LENGTH];
  }
  get itemCount() {
    return this[LRU_LIST].length;
  }
  rforEach(fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev;
      forEachStep(this, fn, walker, thisp);
      walker = prev;
    }
  }
  forEach(fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next;
      forEachStep(this, fn, walker, thisp);
      walker = next;
    }
  }
  keys() {
    return this[LRU_LIST].toArray().map(k => k.key);
  }
  values() {
    return this[LRU_LIST].toArray().map(k => k.value);
  }
  reset() {
    if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
    }
    this[CACHE] = new Map(); // hash of items by key
    this[LRU_LIST] = new Yallist(); // list of items in order of use recency
    this[LENGTH] = 0; // length of items in the list
  }
  dump() {
    return this[LRU_LIST].map(hit => isStale(this, hit) ? false : {
      k: hit.key,
      v: hit.value,
      e: hit.now + (hit.maxAge || 0)
    }).toArray().filter(h => h);
  }
  dumpLru() {
    return this[LRU_LIST];
  }
  set(key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE];
    if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');
    const now = maxAge ? Date.now() : 0;
    const len = this[LENGTH_CALCULATOR](value, key);
    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key));
        return false;
      }
      const node = this[CACHE].get(key);
      const item = node.value;

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
      }
      item.now = now;
      item.maxAge = maxAge;
      item.value = value;
      this[LENGTH] += len - item.length;
      item.length = len;
      this.get(key);
      trim(this);
      return true;
    }
    const hit = new Entry(key, value, len, now, maxAge);

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE]) this[DISPOSE](key, value);
      return false;
    }
    this[LENGTH] += hit.length;
    this[LRU_LIST].unshift(hit);
    this[CACHE].set(key, this[LRU_LIST].head);
    trim(this);
    return true;
  }
  has(key) {
    if (!this[CACHE].has(key)) return false;
    const hit = this[CACHE].get(key).value;
    return !isStale(this, hit);
  }
  get(key) {
    return get(this, key, true);
  }
  peek(key) {
    return get(this, key, false);
  }
  pop() {
    const node = this[LRU_LIST].tail;
    if (!node) return null;
    del(this, node);
    return node.value;
  }
  del(key) {
    del(this, this[CACHE].get(key));
  }
  load(arr) {
    // reset the cache
    this.reset();
    const now = Date.now();
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l];
      const expiresAt = hit.e || 0;
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v);else {
        const maxAge = expiresAt - now;
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge);
        }
      }
    }
  }
  prune() {
    this[CACHE].forEach((value, key) => get(this, key, false));
  }
}
const get = (self, key, doUse) => {
  const node = self[CACHE].get(key);
  if (node) {
    const hit = node.value;
    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE]) return undefined;
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
        self[LRU_LIST].unshiftNode(node);
      }
    }
    return hit.value;
  }
};
const isStale = (self, hit) => {
  if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
  const diff = Date.now() - hit.now;
  return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};
const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
};
const del = (self, node) => {
  if (node) {
    const hit = node.value;
    if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
};
class Entry {
  constructor(key, value, length, now, maxAge) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.maxAge = maxAge || 0;
  }
}
const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value;
  if (isStale(self, hit)) {
    del(self, node);
    if (!self[ALLOW_STALE]) hit = undefined;
  }
  if (hit) fn.call(thisp, hit.value, hit.key, self);
};
module.exports = LRUCache;

/***/ }),

/***/ "./node_modules/semver/semver.js":
/*!***************************************!*\
  !*** ./node_modules/semver/semver.js ***!
  \***************************************/
/***/ ((module, exports) => {

exports = module.exports = SemVer;
var debug;
/* istanbul ignore next */
if (typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('SEMVER');
    console.log.apply(console, args);
  };
} else {
  debug = function () {};
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';
var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */9007199254740991;

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16;
var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;

// The actual regexps go on exports.re
var re = exports.re = [];
var safeRe = exports.safeRe = [];
var src = exports.src = [];
var t = exports.tokens = {};
var R = 0;
function tok(n) {
  t[n] = R++;
}
var LETTERDASHNUMBER = '[a-zA-Z0-9-]';

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
var safeRegexReplacements = [['\\s', 1], ['\\d', MAX_LENGTH], [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]];
function makeSafeRe(value) {
  for (var i = 0; i < safeRegexReplacements.length; i++) {
    var token = safeRegexReplacements[i][0];
    var max = safeRegexReplacements[i][1];
    value = value.split(token + '*').join(token + '{0,' + max + '}').split(token + '+').join(token + '{1,' + max + '}');
  }
  return value;
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER');
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*';
tok('NUMERICIDENTIFIERLOOSE');
src[t.NUMERICIDENTIFIERLOOSE] = '\\d+';

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER');
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-]' + LETTERDASHNUMBER + '*';

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION');
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' + '(' + src[t.NUMERICIDENTIFIER] + ')\\.' + '(' + src[t.NUMERICIDENTIFIER] + ')';
tok('MAINVERSIONLOOSE');
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER');
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] + '|' + src[t.NONNUMERICIDENTIFIER] + ')';
tok('PRERELEASEIDENTIFIERLOOSE');
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] + '|' + src[t.NONNUMERICIDENTIFIER] + ')';

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE');
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] + '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))';
tok('PRERELEASELOOSE');
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] + '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER');
src[t.BUILDIDENTIFIER] = LETTERDASHNUMBER + '+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD');
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] + '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))';

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL');
tok('FULLPLAIN');
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] + src[t.PRERELEASE] + '?' + src[t.BUILD] + '?';
src[t.FULL] = '^' + src[t.FULLPLAIN] + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN');
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + '?' + src[t.BUILD] + '?';
tok('LOOSE');
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$';
tok('GTLT');
src[t.GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE');
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
tok('XRANGEIDENTIFIER');
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*';
tok('XRANGEPLAIN');
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:' + src[t.PRERELEASE] + ')?' + src[t.BUILD] + '?' + ')?)?';
tok('XRANGEPLAINLOOSE');
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:' + src[t.PRERELEASELOOSE] + ')?' + src[t.BUILD] + '?' + ')?)?';
tok('XRANGE');
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$';
tok('XRANGELOOSE');
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$';

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE');
src[t.COERCE] = '(^|[^\\d])' + '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:$|[^\\d])';
tok('COERCERTL');
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g');
safeRe[t.COERCERTL] = new RegExp(makeSafeRe(src[t.COERCE]), 'g');

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE');
src[t.LONETILDE] = '(?:~>?)';
tok('TILDETRIM');
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+';
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g');
safeRe[t.TILDETRIM] = new RegExp(makeSafeRe(src[t.TILDETRIM]), 'g');
var tildeTrimReplace = '$1~';
tok('TILDE');
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$';
tok('TILDELOOSE');
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET');
src[t.LONECARET] = '(?:\\^)';
tok('CARETTRIM');
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+';
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g');
safeRe[t.CARETTRIM] = new RegExp(makeSafeRe(src[t.CARETTRIM]), 'g');
var caretTrimReplace = '$1^';
tok('CARET');
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$';
tok('CARETLOOSE');
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE');
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$';
tok('COMPARATOR');
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$';

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM');
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g');
safeRe[t.COMPARATORTRIM] = new RegExp(makeSafeRe(src[t.COMPARATORTRIM]), 'g');
var comparatorTrimReplace = '$1$2$3';

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE');
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' + '\\s+-\\s+' + '(' + src[t.XRANGEPLAIN] + ')' + '\\s*$';
tok('HYPHENRANGELOOSE');
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' + '\\s+-\\s+' + '(' + src[t.XRANGEPLAINLOOSE] + ')' + '\\s*$';

// Star ranges basically just allow anything at all.
tok('STAR');
src[t.STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i]) {
    re[i] = new RegExp(src[i]);

    // Replace all greedy whitespace to prevent regex dos issues. These regex are
    // used internally via the safeRe object since all inputs in this library get
    // normalized first to trim and collapse all extra whitespace. The original
    // regexes are exported for userland consumption and lower level usage. A
    // future breaking change could export the safer regex only with a note that
    // all input should have extra whitespace removed.
    safeRe[i] = new RegExp(makeSafeRe(src[i]));
  }
}
exports.parse = parse;
function parse(version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }
  if (version instanceof SemVer) {
    return version;
  }
  if (typeof version !== 'string') {
    return null;
  }
  if (version.length > MAX_LENGTH) {
    return null;
  }
  var r = options.loose ? safeRe[t.LOOSE] : safeRe[t.FULL];
  if (!r.test(version)) {
    return null;
  }
  try {
    return new SemVer(version, options);
  } catch (er) {
    return null;
  }
}
exports.valid = valid;
function valid(version, options) {
  var v = parse(version, options);
  return v ? v.version : null;
}
exports.clean = clean;
function clean(version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options);
  return s ? s.version : null;
}
exports.SemVer = SemVer;
function SemVer(version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version;
    } else {
      version = version.version;
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }
  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters');
  }
  if (!(this instanceof SemVer)) {
    return new SemVer(version, options);
  }
  debug('SemVer', version, options);
  this.options = options;
  this.loose = !!options.loose;
  var m = version.trim().match(options.loose ? safeRe[t.LOOSE] : safeRe[t.FULL]);
  if (!m) {
    throw new TypeError('Invalid Version: ' + version);
  }
  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];
  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version');
  }
  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version');
  }
  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version');
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = [];
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num;
        }
      }
      return id;
    });
  }
  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}
SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.');
  }
  return this.version;
};
SemVer.prototype.toString = function () {
  return this.version;
};
SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other);
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }
  return this.compareMain(other) || this.comparePre(other);
};
SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }
  return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
};
SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1;
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1;
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0;
  }
  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined) {
      return 0;
    } else if (b === undefined) {
      return 1;
    } else if (a === undefined) {
      return -1;
    } else if (a === b) {
      continue;
    } else {
      return compareIdentifiers(a, b);
    }
  } while (++i);
};
SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }
  var i = 0;
  do {
    var a = this.build[i];
    var b = other.build[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined) {
      return 0;
    } else if (b === undefined) {
      return 1;
    } else if (a === undefined) {
      return -1;
    } else if (a === b) {
      continue;
    } else {
      return compareIdentifiers(a, b);
    }
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier);
      }
      this.inc('pre', identifier);
      break;
    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
        this.major++;
      }
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++;
      }
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++;
      }
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0];
      } else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0);
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0];
          }
        } else {
          this.prerelease = [identifier, 0];
        }
      }
      break;
    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};
exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof loose === 'string') {
    identifier = loose;
    loose = undefined;
  }
  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}
exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    var prefix = '';
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre';
      var defaultResult = 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key;
        }
      }
    }
    return defaultResult; // may be undefined
  }
}
exports.compareIdentifiers = compareIdentifiers;
var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);
  if (anum && bnum) {
    a = +a;
    b = +b;
  }
  return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
}
exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}
exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}
exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}
exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}
exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}
exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}
exports.compareBuild = compareBuild;
function compareBuild(a, b, loose) {
  var versionA = new SemVer(a, loose);
  var versionB = new SemVer(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB);
}
exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}
exports.sort = sort;
function sort(list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose);
  });
}
exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose);
  });
}
exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}
exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}
exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}
exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}
exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}
exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}
exports.cmp = cmp;
function cmp(a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      return a === b;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      return a !== b;
    case '':
    case '=':
    case '==':
      return eq(a, b, loose);
    case '!=':
      return neq(a, b, loose);
    case '>':
      return gt(a, b, loose);
    case '>=':
      return gte(a, b, loose);
    case '<':
      return lt(a, b, loose);
    case '<=':
      return lte(a, b, loose);
    default:
      throw new TypeError('Invalid operator: ' + op);
  }
}
exports.Comparator = Comparator;
function Comparator(comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }
  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp;
    } else {
      comp = comp.value;
    }
  }
  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options);
  }
  comp = comp.trim().split(/\s+/).join(' ');
  debug('comparator', comp, options);
  this.options = options;
  this.loose = !!options.loose;
  this.parse(comp);
  if (this.semver === ANY) {
    this.value = '';
  } else {
    this.value = this.operator + this.semver.version;
  }
  debug('comp', this);
}
var ANY = {};
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? safeRe[t.COMPARATORLOOSE] : safeRe[t.COMPARATOR];
  var m = comp.match(r);
  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp);
  }
  this.operator = m[1] !== undefined ? m[1] : '';
  if (this.operator === '=') {
    this.operator = '';
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY;
  } else {
    this.semver = new SemVer(m[2], this.options.loose);
  }
};
Comparator.prototype.toString = function () {
  return this.value;
};
Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose);
  if (this.semver === ANY || version === ANY) {
    return true;
  }
  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options);
    } catch (er) {
      return false;
    }
  }
  return cmp(version, this.operator, this.semver, this.options);
};
Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }
  var rangeTmp;
  if (this.operator === '') {
    if (this.value === '') {
      return true;
    }
    rangeTmp = new Range(comp.value, options);
    return satisfies(this.value, rangeTmp, options);
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true;
    }
    rangeTmp = new Range(this.value, options);
    return satisfies(comp.semver, rangeTmp, options);
  }
  var sameDirectionIncreasing = (this.operator === '>=' || this.operator === '>') && (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing = (this.operator === '<=' || this.operator === '<') && (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive = (this.operator === '>=' || this.operator === '<=') && (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan = cmp(this.semver, '<', comp.semver, options) && (this.operator === '>=' || this.operator === '>') && (comp.operator === '<=' || comp.operator === '<');
  var oppositeDirectionsGreaterThan = cmp(this.semver, '>', comp.semver, options) && (this.operator === '<=' || this.operator === '<') && (comp.operator === '>=' || comp.operator === '>');
  return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};
exports.Range = Range;
function Range(range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }
  if (range instanceof Range) {
    if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
      return range;
    } else {
      return new Range(range.raw, options);
    }
  }
  if (range instanceof Comparator) {
    return new Range(range.value, options);
  }
  if (!(this instanceof Range)) {
    return new Range(range, options);
  }
  this.options = options;
  this.loose = !!options.loose;
  this.includePrerelease = !!options.includePrerelease;

  // First reduce all whitespace as much as possible so we do not have to rely
  // on potentially slow regexes like \s*. This is then stored and used for
  // future error messages as well.
  this.raw = range.trim().split(/\s+/).join(' ');

  // First, split based on boolean or ||
  this.set = this.raw.split('||').map(function (range) {
    return this.parseRange(range.trim());
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });
  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + this.raw);
  }
  this.format();
}
Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};
Range.prototype.toString = function () {
  return this.range;
};
Range.prototype.parseRange = function (range) {
  var loose = this.options.loose;
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? safeRe[t.HYPHENRANGELOOSE] : safeRe[t.HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(safeRe[t.COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, safeRe[t.COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(safeRe[t.TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(safeRe[t.CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? safeRe[t.COMPARATORLOOSE] : safeRe[t.COMPARATOR];
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options);
  }, this).join(' ').split(/\s+/);
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options);
  }, this);
  return set;
};
Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }
  return this.set.some(function (thisComparators) {
    return isSatisfiable(thisComparators, options) && range.set.some(function (rangeComparators) {
      return isSatisfiable(rangeComparators, options) && thisComparators.every(function (thisComparator) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options);
        });
      });
    });
  });
};

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable(comparators, options) {
  var result = true;
  var remainingComparators = comparators.slice();
  var testComparator = remainingComparators.pop();
  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options);
    });
    testComparator = remainingComparators.pop();
  }
  return result;
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, options) {
  debug('comp', comp, options);
  comp = replaceCarets(comp, options);
  debug('caret', comp);
  comp = replaceTildes(comp, options);
  debug('tildes', comp);
  comp = replaceXRanges(comp, options);
  debug('xrange', comp);
  comp = replaceStars(comp, options);
  debug('stars', comp);
  return comp;
}
function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options);
  }).join(' ');
}
function replaceTilde(comp, options) {
  var r = options.loose ? safeRe[t.TILDELOOSE] : safeRe[t.TILDE];
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;
    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    } else if (pr) {
      debug('replaceTilde pr', pr);
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
    }
    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options);
  }).join(' ');
}
function replaceCaret(comp, options) {
  debug('caret', comp, options);
  var r = options.loose ? safeRe[t.CARETLOOSE] : safeRe[t.CARET];
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;
    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
      }
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + m + '.' + (+p + 1);
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + (+M + 1) + '.0.0';
      }
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + m + '.' + (+p + 1);
        } else {
          ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + ' <' + (+M + 1) + '.0.0';
      }
    }
    debug('caret return', ret);
    return ret;
  });
}
function replaceXRanges(comp, options) {
  debug('replaceXRanges', comp, options);
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options);
  }).join(' ');
}
function replaceXRange(comp, options) {
  comp = comp.trim();
  var r = options.loose ? safeRe[t.XRANGELOOSE] : safeRe[t.XRANGE];
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;
    if (gtlt === '=' && anyX) {
      gtlt = '';
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : '';
    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0;
      }
      p = 0;
      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }
      ret = gtlt + M + '.' + m + '.' + p + pr;
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr;
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr + ' <' + M + '.' + (+m + 1) + '.0' + pr;
    }
    debug('xRange return', ret);
    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, options) {
  debug('replaceStars', comp, options);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(safeRe[t.STAR], '');
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = '';
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0';
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0';
  } else {
    from = '>=' + from;
  }
  if (isX(tM)) {
    to = '';
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0';
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  } else {
    to = '<=' + to;
  }
  return (from + ' ' + to).trim();
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false;
  }
  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options);
    } catch (er) {
      return false;
    }
  }
  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true;
    }
  }
  return false;
};
function testSet(set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false;
    }
  }
  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY) {
        continue;
      }
      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
          return true;
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }
  return true;
}
exports.satisfies = satisfies;
function satisfies(version, range, options) {
  try {
    range = new Range(range, options);
  } catch (er) {
    return false;
  }
  return range.test(version);
}
exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, options) {
  var max = null;
  var maxSV = null;
  try {
    var rangeObj = new Range(range, options);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, options);
      }
    }
  });
  return max;
}
exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, options) {
  var min = null;
  var minSV = null;
  try {
    var rangeObj = new Range(range, options);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, options);
      }
    }
  });
  return min;
}
exports.minVersion = minVersion;
function minVersion(range, loose) {
  range = new Range(range, loose);
  var minver = new SemVer('0.0.0');
  if (range.test(minver)) {
    return minver;
  }
  minver = new SemVer('0.0.0-0');
  if (range.test(minver)) {
    return minver;
  }
  minver = null;
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];
    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version);
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
        /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver;
          }
          break;
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break;
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator);
      }
    });
  }
  if (minver && range.test(minver)) {
    return minver;
  }
  return null;
}
exports.validRange = validRange;
function validRange(range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, options) {
  return outside(version, range, '<', options);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, options) {
  return outside(version, range, '>', options);
}
exports.outside = outside;
function outside(version, range, hilo, options) {
  version = new SemVer(version, options);
  range = new Range(range, options);
  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];
    var high = null;
    var low = null;
    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0');
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}
exports.prerelease = prerelease;
function prerelease(version, options) {
  var parsed = parse(version, options);
  return parsed && parsed.prerelease.length ? parsed.prerelease : null;
}
exports.intersects = intersects;
function intersects(r1, r2, options) {
  r1 = new Range(r1, options);
  r2 = new Range(r2, options);
  return r1.intersects(r2);
}
exports.coerce = coerce;
function coerce(version, options) {
  if (version instanceof SemVer) {
    return version;
  }
  if (typeof version === 'number') {
    version = String(version);
  }
  if (typeof version !== 'string') {
    return null;
  }
  options = options || {};
  var match = null;
  if (!options.rtl) {
    match = version.match(safeRe[t.COERCE]);
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next;
    while ((next = safeRe[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
      if (!match || next.index + next[0].length !== match.index + match[0].length) {
        match = next;
      }
      safeRe[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
    }
    // leave it in a clean state
    safeRe[t.COERCERTL].lastIndex = -1;
  }
  if (match === null) {
    return null;
  }
  return parse(match[2] + '.' + (match[3] || '0') + '.' + (match[4] || '0'), options);
}

/***/ }),

/***/ "./node_modules/yallist/iterator.js":
/*!******************************************!*\
  !*** ./node_modules/yallist/iterator.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  };
};

/***/ }),

/***/ "./node_modules/yallist/yallist.js":
/*!*****************************************!*\
  !*** ./node_modules/yallist/yallist.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;
function Yallist(list) {
  var self = this;
  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }
  self.tail = null;
  self.head = null;
  self.length = 0;
  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }
  return self;
}
Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list');
  }
  var next = node.next;
  var prev = node.prev;
  if (next) {
    next.prev = prev;
  }
  if (prev) {
    prev.next = next;
  }
  if (node === this.head) {
    this.head = next;
  }
  if (node === this.tail) {
    this.tail = prev;
  }
  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;
  return next;
};
Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return;
  }
  if (node.list) {
    node.list.removeNode(node);
  }
  var head = this.head;
  node.list = this;
  node.next = head;
  if (head) {
    head.prev = node;
  }
  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
  this.length++;
};
Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return;
  }
  if (node.list) {
    node.list.removeNode(node);
  }
  var tail = this.tail;
  node.list = this;
  node.prev = tail;
  if (tail) {
    tail.next = node;
  }
  this.tail = node;
  if (!this.head) {
    this.head = node;
  }
  this.length++;
};
Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }
  return this.length;
};
Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }
  return this.length;
};
Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined;
  }
  var res = this.tail.value;
  this.tail = this.tail.prev;
  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }
  this.length--;
  return res;
};
Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined;
  }
  var res = this.head.value;
  this.head = this.head.next;
  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  this.length--;
  return res;
};
Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};
Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};
Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }
  if (i === n && walker !== null) {
    return walker.value;
  }
};
Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }
  if (i === n && walker !== null) {
    return walker.value;
  }
};
Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }
  return res;
};
Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }
  return res;
};
Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value');
  }
  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }
  return acc;
};
Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value');
  }
  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }
  return acc;
};
Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }
  return arr;
};
Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }
  return arr;
};
Yallist.prototype.slice = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret;
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }
  return ret;
};
Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret;
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }
  return ret;
};
Yallist.prototype.splice = function (start, deleteCount /*, ...nodes */) {
  if (start > this.length) {
    start = this.length - 1;
  }
  if (start < 0) {
    start = this.length + start;
  }
  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next;
  }
  var ret = [];
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value);
    walker = this.removeNode(walker);
  }
  if (walker === null) {
    walker = this.tail;
  }
  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev;
  }
  for (var i = 2; i < arguments.length; i++) {
    walker = insert(this, walker, arguments[i]);
  }
  return ret;
};
Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }
  this.head = tail;
  this.tail = head;
  return this;
};
function insert(self, node, value) {
  var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
  if (inserted.next === null) {
    self.tail = inserted;
  }
  if (inserted.prev === null) {
    self.head = inserted;
  }
  self.length++;
  return inserted;
}
function push(self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}
function unshift(self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}
function Node(value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list);
  }
  this.list = list;
  this.value = value;
  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }
  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}
try {
  // add if support for Symbol.iterator is present
  __webpack_require__(/*! ./iterator.js */ "./node_modules/yallist/iterator.js")(Yallist);
} catch (er) {}

/***/ }),

/***/ "./app/_utils/scss/default.scss":
/*!**************************************!*\
  !*** ./app/_utils/scss/default.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/dropdown/scss/vgdropdown.scss":
/*!***************************************************!*\
  !*** ./app/modules/dropdown/scss/vgdropdown.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/modal/scss/vgmodal.scss":
/*!*********************************************!*\
  !*** ./app/modules/modal/scss/vgmodal.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/sidebar/scss/vgsidebar.scss":
/*!*************************************************!*\
  !*** ./app/modules/sidebar/scss/vgsidebar.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/vgnav/scss/vgnav.scss":
/*!*******************************************!*\
  !*** ./app/modules/vgnav/scss/vgnav.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "?3465":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/@babel/compat-data/native-modules.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/compat-data/native-modules.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./data/native-modules.json */ "./node_modules/@babel/compat-data/data/native-modules.json");

/***/ }),

/***/ "./node_modules/@babel/compat-data/plugins.js":
/*!****************************************************!*\
  !*** ./node_modules/@babel/compat-data/plugins.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./data/plugins.json */ "./node_modules/@babel/compat-data/data/plugins.json");

/***/ }),

/***/ "./node_modules/@babel/core/lib/config/validation/option-assertions.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/core/lib/config/validation/option-assertions.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.access = access;
exports.assertArray = assertArray;
exports.assertAssumptions = assertAssumptions;
exports.assertBabelrcSearch = assertBabelrcSearch;
exports.assertBoolean = assertBoolean;
exports.assertCallerMetadata = assertCallerMetadata;
exports.assertCompact = assertCompact;
exports.assertConfigApplicableTest = assertConfigApplicableTest;
exports.assertConfigFileSearch = assertConfigFileSearch;
exports.assertFunction = assertFunction;
exports.assertIgnoreList = assertIgnoreList;
exports.assertInputSourceMap = assertInputSourceMap;
exports.assertObject = assertObject;
exports.assertPluginList = assertPluginList;
exports.assertRootMode = assertRootMode;
exports.assertSourceMaps = assertSourceMaps;
exports.assertSourceType = assertSourceType;
exports.assertString = assertString;
exports.assertTargets = assertTargets;
exports.msg = msg;
function _helperCompilationTargets() {
  const data = __webpack_require__(/*! @babel/helper-compilation-targets */ "./node_modules/@babel/helper-compilation-targets/lib/index.js");
  _helperCompilationTargets = function () {
    return data;
  };
  return data;
}
var _options = __webpack_require__(/*! ./options.js */ "./node_modules/@babel/core/lib/config/validation/options.js");
function msg(loc) {
  switch (loc.type) {
    case "root":
      return ``;
    case "env":
      return `${msg(loc.parent)}.env["${loc.name}"]`;
    case "overrides":
      return `${msg(loc.parent)}.overrides[${loc.index}]`;
    case "option":
      return `${msg(loc.parent)}.${loc.name}`;
    case "access":
      return `${msg(loc.parent)}[${JSON.stringify(loc.name)}]`;
    default:
      throw new Error(`Assertion failure: Unknown type ${loc.type}`);
  }
}
function access(loc, name) {
  return {
    type: "access",
    name,
    parent: loc
  };
}
function assertRootMode(loc, value) {
  if (value !== undefined && value !== "root" && value !== "upward" && value !== "upward-optional") {
    throw new Error(`${msg(loc)} must be a "root", "upward", "upward-optional" or undefined`);
  }
  return value;
}
function assertSourceMaps(loc, value) {
  if (value !== undefined && typeof value !== "boolean" && value !== "inline" && value !== "both") {
    throw new Error(`${msg(loc)} must be a boolean, "inline", "both", or undefined`);
  }
  return value;
}
function assertCompact(loc, value) {
  if (value !== undefined && typeof value !== "boolean" && value !== "auto") {
    throw new Error(`${msg(loc)} must be a boolean, "auto", or undefined`);
  }
  return value;
}
function assertSourceType(loc, value) {
  if (value !== undefined && value !== "module" && value !== "script" && value !== "unambiguous") {
    throw new Error(`${msg(loc)} must be "module", "script", "unambiguous", or undefined`);
  }
  return value;
}
function assertCallerMetadata(loc, value) {
  const obj = assertObject(loc, value);
  if (obj) {
    if (typeof obj.name !== "string") {
      throw new Error(`${msg(loc)} set but does not contain "name" property string`);
    }
    for (const prop of Object.keys(obj)) {
      const propLoc = access(loc, prop);
      const value = obj[prop];
      if (value != null && typeof value !== "boolean" && typeof value !== "string" && typeof value !== "number") {
        throw new Error(`${msg(propLoc)} must be null, undefined, a boolean, a string, or a number.`);
      }
    }
  }
  return value;
}
function assertInputSourceMap(loc, value) {
  if (value !== undefined && typeof value !== "boolean" && (typeof value !== "object" || !value)) {
    throw new Error(`${msg(loc)} must be a boolean, object, or undefined`);
  }
  return value;
}
function assertString(loc, value) {
  if (value !== undefined && typeof value !== "string") {
    throw new Error(`${msg(loc)} must be a string, or undefined`);
  }
  return value;
}
function assertFunction(loc, value) {
  if (value !== undefined && typeof value !== "function") {
    throw new Error(`${msg(loc)} must be a function, or undefined`);
  }
  return value;
}
function assertBoolean(loc, value) {
  if (value !== undefined && typeof value !== "boolean") {
    throw new Error(`${msg(loc)} must be a boolean, or undefined`);
  }
  return value;
}
function assertObject(loc, value) {
  if (value !== undefined && (typeof value !== "object" || Array.isArray(value) || !value)) {
    throw new Error(`${msg(loc)} must be an object, or undefined`);
  }
  return value;
}
function assertArray(loc, value) {
  if (value != null && !Array.isArray(value)) {
    throw new Error(`${msg(loc)} must be an array, or undefined`);
  }
  return value;
}
function assertIgnoreList(loc, value) {
  const arr = assertArray(loc, value);
  arr == null || arr.forEach((item, i) => assertIgnoreItem(access(loc, i), item));
  return arr;
}
function assertIgnoreItem(loc, value) {
  if (typeof value !== "string" && typeof value !== "function" && !(value instanceof RegExp)) {
    throw new Error(`${msg(loc)} must be an array of string/Function/RegExp values, or undefined`);
  }
  return value;
}
function assertConfigApplicableTest(loc, value) {
  if (value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (!checkValidTest(item)) {
        throw new Error(`${msg(access(loc, i))} must be a string/Function/RegExp.`);
      }
    });
  } else if (!checkValidTest(value)) {
    throw new Error(`${msg(loc)} must be a string/Function/RegExp, or an array of those`);
  }
  return value;
}
function checkValidTest(value) {
  return typeof value === "string" || typeof value === "function" || value instanceof RegExp;
}
function assertConfigFileSearch(loc, value) {
  if (value !== undefined && typeof value !== "boolean" && typeof value !== "string") {
    throw new Error(`${msg(loc)} must be a undefined, a boolean, a string, ` + `got ${JSON.stringify(value)}`);
  }
  return value;
}
function assertBabelrcSearch(loc, value) {
  if (value === undefined || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (!checkValidTest(item)) {
        throw new Error(`${msg(access(loc, i))} must be a string/Function/RegExp.`);
      }
    });
  } else if (!checkValidTest(value)) {
    throw new Error(`${msg(loc)} must be a undefined, a boolean, a string/Function/RegExp ` + `or an array of those, got ${JSON.stringify(value)}`);
  }
  return value;
}
function assertPluginList(loc, value) {
  const arr = assertArray(loc, value);
  if (arr) {
    arr.forEach((item, i) => assertPluginItem(access(loc, i), item));
  }
  return arr;
}
function assertPluginItem(loc, value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error(`${msg(loc)} must include an object`);
    }
    if (value.length > 3) {
      throw new Error(`${msg(loc)} may only be a two-tuple or three-tuple`);
    }
    assertPluginTarget(access(loc, 0), value[0]);
    if (value.length > 1) {
      const opts = value[1];
      if (opts !== undefined && opts !== false && (typeof opts !== "object" || Array.isArray(opts) || opts === null)) {
        throw new Error(`${msg(access(loc, 1))} must be an object, false, or undefined`);
      }
    }
    if (value.length === 3) {
      const name = value[2];
      if (name !== undefined && typeof name !== "string") {
        throw new Error(`${msg(access(loc, 2))} must be a string, or undefined`);
      }
    }
  } else {
    assertPluginTarget(loc, value);
  }
  return value;
}
function assertPluginTarget(loc, value) {
  if ((typeof value !== "object" || !value) && typeof value !== "string" && typeof value !== "function") {
    throw new Error(`${msg(loc)} must be a string, object, function`);
  }
  return value;
}
function assertTargets(loc, value) {
  if ((0, _helperCompilationTargets().isBrowsersQueryValid)(value)) return value;
  if (typeof value !== "object" || !value || Array.isArray(value)) {
    throw new Error(`${msg(loc)} must be a string, an array of strings or an object`);
  }
  const browsersLoc = access(loc, "browsers");
  const esmodulesLoc = access(loc, "esmodules");
  assertBrowsersList(browsersLoc, value.browsers);
  assertBoolean(esmodulesLoc, value.esmodules);
  for (const key of Object.keys(value)) {
    const val = value[key];
    const subLoc = access(loc, key);
    if (key === "esmodules") assertBoolean(subLoc, val);else if (key === "browsers") assertBrowsersList(subLoc, val);else if (!hasOwnProperty.call(_helperCompilationTargets().TargetNames, key)) {
      const validTargets = Object.keys(_helperCompilationTargets().TargetNames).join(", ");
      throw new Error(`${msg(subLoc)} is not a valid target. Supported targets are ${validTargets}`);
    } else assertBrowserVersion(subLoc, val);
  }
  return value;
}
function assertBrowsersList(loc, value) {
  if (value !== undefined && !(0, _helperCompilationTargets().isBrowsersQueryValid)(value)) {
    throw new Error(`${msg(loc)} must be undefined, a string or an array of strings`);
  }
}
function assertBrowserVersion(loc, value) {
  if (typeof value === "number" && Math.round(value) === value) return;
  if (typeof value === "string") return;
  throw new Error(`${msg(loc)} must be a string or an integer number`);
}
function assertAssumptions(loc, value) {
  if (value === undefined) return;
  if (typeof value !== "object" || value === null) {
    throw new Error(`${msg(loc)} must be an object or undefined.`);
  }
  let root = loc;
  do {
    root = root.parent;
  } while (root.type !== "root");
  const inPreset = root.source === "preset";
  for (const name of Object.keys(value)) {
    const subLoc = access(loc, name);
    if (!_options.assumptionsNames.has(name)) {
      throw new Error(`${msg(subLoc)} is not a supported assumption.`);
    }
    if (typeof value[name] !== "boolean") {
      throw new Error(`${msg(subLoc)} must be a boolean.`);
    }
    if (inPreset && value[name] === false) {
      throw new Error(`${msg(subLoc)} cannot be set to 'false' inside presets.`);
    }
  }
  return value;
}
0 && 0;

/***/ }),

/***/ "./node_modules/@babel/core/lib/config/validation/options.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/core/lib/config/validation/options.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.assumptionsNames = void 0;
exports.checkNoUnwrappedItemOptionPairs = checkNoUnwrappedItemOptionPairs;
exports.validate = validate;
var _removed = __webpack_require__(/*! ./removed.js */ "./node_modules/@babel/core/lib/config/validation/removed.js");
var _optionAssertions = __webpack_require__(/*! ./option-assertions.js */ "./node_modules/@babel/core/lib/config/validation/option-assertions.js");
var _configError = __webpack_require__(/*! ../../errors/config-error.js */ "./node_modules/@babel/core/lib/errors/config-error.js");
const ROOT_VALIDATORS = {
  cwd: _optionAssertions.assertString,
  root: _optionAssertions.assertString,
  rootMode: _optionAssertions.assertRootMode,
  configFile: _optionAssertions.assertConfigFileSearch,
  caller: _optionAssertions.assertCallerMetadata,
  filename: _optionAssertions.assertString,
  filenameRelative: _optionAssertions.assertString,
  code: _optionAssertions.assertBoolean,
  ast: _optionAssertions.assertBoolean,
  cloneInputAst: _optionAssertions.assertBoolean,
  envName: _optionAssertions.assertString
};
const BABELRC_VALIDATORS = {
  babelrc: _optionAssertions.assertBoolean,
  babelrcRoots: _optionAssertions.assertBabelrcSearch
};
const NONPRESET_VALIDATORS = {
  extends: _optionAssertions.assertString,
  ignore: _optionAssertions.assertIgnoreList,
  only: _optionAssertions.assertIgnoreList,
  targets: _optionAssertions.assertTargets,
  browserslistConfigFile: _optionAssertions.assertConfigFileSearch,
  browserslistEnv: _optionAssertions.assertString
};
const COMMON_VALIDATORS = {
  inputSourceMap: _optionAssertions.assertInputSourceMap,
  presets: _optionAssertions.assertPluginList,
  plugins: _optionAssertions.assertPluginList,
  passPerPreset: _optionAssertions.assertBoolean,
  assumptions: _optionAssertions.assertAssumptions,
  env: assertEnvSet,
  overrides: assertOverridesList,
  test: _optionAssertions.assertConfigApplicableTest,
  include: _optionAssertions.assertConfigApplicableTest,
  exclude: _optionAssertions.assertConfigApplicableTest,
  retainLines: _optionAssertions.assertBoolean,
  comments: _optionAssertions.assertBoolean,
  shouldPrintComment: _optionAssertions.assertFunction,
  compact: _optionAssertions.assertCompact,
  minified: _optionAssertions.assertBoolean,
  auxiliaryCommentBefore: _optionAssertions.assertString,
  auxiliaryCommentAfter: _optionAssertions.assertString,
  sourceType: _optionAssertions.assertSourceType,
  wrapPluginVisitorMethod: _optionAssertions.assertFunction,
  highlightCode: _optionAssertions.assertBoolean,
  sourceMaps: _optionAssertions.assertSourceMaps,
  sourceMap: _optionAssertions.assertSourceMaps,
  sourceFileName: _optionAssertions.assertString,
  sourceRoot: _optionAssertions.assertString,
  parserOpts: _optionAssertions.assertObject,
  generatorOpts: _optionAssertions.assertObject
};
{
  Object.assign(COMMON_VALIDATORS, {
    getModuleId: _optionAssertions.assertFunction,
    moduleRoot: _optionAssertions.assertString,
    moduleIds: _optionAssertions.assertBoolean,
    moduleId: _optionAssertions.assertString
  });
}
const knownAssumptions = ["arrayLikeIsIterable", "constantReexports", "constantSuper", "enumerableModuleMeta", "ignoreFunctionLength", "ignoreToPrimitiveHint", "iterableIsArray", "mutableTemplateObject", "noClassCalls", "noDocumentAll", "noIncompleteNsImportDetection", "noNewArrows", "noUninitializedPrivateFieldAccess", "objectRestNoSymbols", "privateFieldsAsSymbols", "privateFieldsAsProperties", "pureGetters", "setClassMethods", "setComputedProperties", "setPublicClassFields", "setSpreadProperties", "skipForOfIteratorClosing", "superIsCallableConstructor"];
const assumptionsNames = exports.assumptionsNames = new Set(knownAssumptions);
function getSource(loc) {
  return loc.type === "root" ? loc.source : getSource(loc.parent);
}
function validate(type, opts, filename) {
  try {
    return validateNested({
      type: "root",
      source: type
    }, opts);
  } catch (error) {
    const configError = new _configError.default(error.message, filename);
    if (error.code) configError.code = error.code;
    throw configError;
  }
}
function validateNested(loc, opts) {
  const type = getSource(loc);
  assertNoDuplicateSourcemap(opts);
  Object.keys(opts).forEach(key => {
    const optLoc = {
      type: "option",
      name: key,
      parent: loc
    };
    if (type === "preset" && NONPRESET_VALIDATORS[key]) {
      throw new Error(`${(0, _optionAssertions.msg)(optLoc)} is not allowed in preset options`);
    }
    if (type !== "arguments" && ROOT_VALIDATORS[key]) {
      throw new Error(`${(0, _optionAssertions.msg)(optLoc)} is only allowed in root programmatic options`);
    }
    if (type !== "arguments" && type !== "configfile" && BABELRC_VALIDATORS[key]) {
      if (type === "babelrcfile" || type === "extendsfile") {
        throw new Error(`${(0, _optionAssertions.msg)(optLoc)} is not allowed in .babelrc or "extends"ed files, only in root programmatic options, ` + `or babel.config.js/config file options`);
      }
      throw new Error(`${(0, _optionAssertions.msg)(optLoc)} is only allowed in root programmatic options, or babel.config.js/config file options`);
    }
    const validator = COMMON_VALIDATORS[key] || NONPRESET_VALIDATORS[key] || BABELRC_VALIDATORS[key] || ROOT_VALIDATORS[key] || throwUnknownError;
    validator(optLoc, opts[key]);
  });
  return opts;
}
function throwUnknownError(loc) {
  const key = loc.name;
  if (_removed.default[key]) {
    const {
      message,
      version = 5
    } = _removed.default[key];
    throw new Error(`Using removed Babel ${version} option: ${(0, _optionAssertions.msg)(loc)} - ${message}`);
  } else {
    const unknownOptErr = new Error(`Unknown option: ${(0, _optionAssertions.msg)(loc)}. Check out https://babeljs.io/docs/en/babel-core/#options for more information about options.`);
    unknownOptErr.code = "BABEL_UNKNOWN_OPTION";
    throw unknownOptErr;
  }
}
function assertNoDuplicateSourcemap(opts) {
  if (hasOwnProperty.call(opts, "sourceMap") && hasOwnProperty.call(opts, "sourceMaps")) {
    throw new Error(".sourceMap is an alias for .sourceMaps, cannot use both");
  }
}
function assertEnvSet(loc, value) {
  if (loc.parent.type === "env") {
    throw new Error(`${(0, _optionAssertions.msg)(loc)} is not allowed inside of another .env block`);
  }
  const parent = loc.parent;
  const obj = (0, _optionAssertions.assertObject)(loc, value);
  if (obj) {
    for (const envName of Object.keys(obj)) {
      const env = (0, _optionAssertions.assertObject)((0, _optionAssertions.access)(loc, envName), obj[envName]);
      if (!env) continue;
      const envLoc = {
        type: "env",
        name: envName,
        parent
      };
      validateNested(envLoc, env);
    }
  }
  return obj;
}
function assertOverridesList(loc, value) {
  if (loc.parent.type === "env") {
    throw new Error(`${(0, _optionAssertions.msg)(loc)} is not allowed inside an .env block`);
  }
  if (loc.parent.type === "overrides") {
    throw new Error(`${(0, _optionAssertions.msg)(loc)} is not allowed inside an .overrides block`);
  }
  const parent = loc.parent;
  const arr = (0, _optionAssertions.assertArray)(loc, value);
  if (arr) {
    for (const [index, item] of arr.entries()) {
      const objLoc = (0, _optionAssertions.access)(loc, index);
      const env = (0, _optionAssertions.assertObject)(objLoc, item);
      if (!env) throw new Error(`${(0, _optionAssertions.msg)(objLoc)} must be an object`);
      const overridesLoc = {
        type: "overrides",
        index,
        parent
      };
      validateNested(overridesLoc, env);
    }
  }
  return arr;
}
function checkNoUnwrappedItemOptionPairs(items, index, type, e) {
  if (index === 0) return;
  const lastItem = items[index - 1];
  const thisItem = items[index];
  if (lastItem.file && lastItem.options === undefined && typeof thisItem.value === "object") {
    e.message += `\n- Maybe you meant to use\n` + `"${type}s": [\n  ["${lastItem.file.request}", ${JSON.stringify(thisItem.value, undefined, 2)}]\n]\n` + `To be a valid ${type}, its name and options should be wrapped in a pair of brackets`;
  }
}
0 && 0;

/***/ }),

/***/ "./node_modules/@babel/core/lib/config/validation/removed.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/core/lib/config/validation/removed.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  auxiliaryComment: {
    message: "Use `auxiliaryCommentBefore` or `auxiliaryCommentAfter`"
  },
  blacklist: {
    message: "Put the specific transforms you want in the `plugins` option"
  },
  breakConfig: {
    message: "This is not a necessary option in Babel 6"
  },
  experimental: {
    message: "Put the specific transforms you want in the `plugins` option"
  },
  externalHelpers: {
    message: "Use the `external-helpers` plugin instead. " + "Check out http://babeljs.io/docs/plugins/external-helpers/"
  },
  extra: {
    message: ""
  },
  jsxPragma: {
    message: "use the `pragma` option in the `react-jsx` plugin. " + "Check out http://babeljs.io/docs/plugins/transform-react-jsx/"
  },
  loose: {
    message: "Specify the `loose` option for the relevant plugin you are using " + "or use a preset that sets the option."
  },
  metadataUsedHelpers: {
    message: "Not required anymore as this is enabled by default"
  },
  modules: {
    message: "Use the corresponding module transform plugin in the `plugins` option. " + "Check out http://babeljs.io/docs/plugins/#modules"
  },
  nonStandard: {
    message: "Use the `react-jsx` and `flow-strip-types` plugins to support JSX and Flow. " + "Also check out the react preset http://babeljs.io/docs/plugins/preset-react/"
  },
  optional: {
    message: "Put the specific transforms you want in the `plugins` option"
  },
  sourceMapName: {
    message: "The `sourceMapName` option has been removed because it makes more sense for the " + "tooling that calls Babel to assign `map.file` themselves."
  },
  stage: {
    message: "Check out the corresponding stage-x presets http://babeljs.io/docs/plugins/#presets"
  },
  whitelist: {
    message: "Put the specific transforms you want in the `plugins` option"
  },
  resolveModuleSource: {
    version: 6,
    message: "Use `babel-plugin-module-resolver@3`'s 'resolvePath' options"
  },
  metadata: {
    version: 6,
    message: "Generated plugin metadata is always included in the output result"
  },
  sourceMapTarget: {
    version: 6,
    message: "The `sourceMapTarget` option has been removed because it makes more sense for the tooling " + "that calls Babel to assign `map.file` themselves."
  }
};
0 && 0;

/***/ }),

/***/ "./node_modules/@babel/core/lib/errors/config-error.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/core/lib/errors/config-error.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _rewriteStackTrace = __webpack_require__(/*! ./rewrite-stack-trace.js */ "./node_modules/@babel/core/lib/errors/rewrite-stack-trace.js");
class ConfigError extends Error {
  constructor(message, filename) {
    super(message);
    (0, _rewriteStackTrace.expectedError)(this);
    if (filename) (0, _rewriteStackTrace.injectVirtualStackFrame)(this, filename);
  }
}
exports["default"] = ConfigError;
0 && 0;

/***/ }),

/***/ "./node_modules/@babel/core/lib/errors/rewrite-stack-trace.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/core/lib/errors/rewrite-stack-trace.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.beginHiddenCallStack = beginHiddenCallStack;
exports.endHiddenCallStack = endHiddenCallStack;
exports.expectedError = expectedError;
exports.injectVirtualStackFrame = injectVirtualStackFrame;
var _Object$getOwnPropert;
const ErrorToString = Function.call.bind(Error.prototype.toString);
const SUPPORTED = !!Error.captureStackTrace && ((_Object$getOwnPropert = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit")) == null ? void 0 : _Object$getOwnPropert.writable) === true;
const START_HIDING = "startHiding - secret - don't use this - v1";
const STOP_HIDING = "stopHiding - secret - don't use this - v1";
const expectedErrors = new WeakSet();
const virtualFrames = new WeakMap();
function CallSite(filename) {
  return Object.create({
    isNative: () => false,
    isConstructor: () => false,
    isToplevel: () => true,
    getFileName: () => filename,
    getLineNumber: () => undefined,
    getColumnNumber: () => undefined,
    getFunctionName: () => undefined,
    getMethodName: () => undefined,
    getTypeName: () => undefined,
    toString: () => filename
  });
}
function injectVirtualStackFrame(error, filename) {
  if (!SUPPORTED) return;
  let frames = virtualFrames.get(error);
  if (!frames) virtualFrames.set(error, frames = []);
  frames.push(CallSite(filename));
  return error;
}
function expectedError(error) {
  if (!SUPPORTED) return;
  expectedErrors.add(error);
  return error;
}
function beginHiddenCallStack(fn) {
  if (!SUPPORTED) return fn;
  return Object.defineProperty(function (...args) {
    setupPrepareStackTrace();
    return fn(...args);
  }, "name", {
    value: STOP_HIDING
  });
}
function endHiddenCallStack(fn) {
  if (!SUPPORTED) return fn;
  return Object.defineProperty(function (...args) {
    return fn(...args);
  }, "name", {
    value: START_HIDING
  });
}
function setupPrepareStackTrace() {
  setupPrepareStackTrace = () => {};
  const {
    prepareStackTrace = defaultPrepareStackTrace
  } = Error;
  const MIN_STACK_TRACE_LIMIT = 50;
  Error.stackTraceLimit && (Error.stackTraceLimit = Math.max(Error.stackTraceLimit, MIN_STACK_TRACE_LIMIT));
  Error.prepareStackTrace = function stackTraceRewriter(err, trace) {
    let newTrace = [];
    const isExpected = expectedErrors.has(err);
    let status = isExpected ? "hiding" : "unknown";
    for (let i = 0; i < trace.length; i++) {
      const name = trace[i].getFunctionName();
      if (name === START_HIDING) {
        status = "hiding";
      } else if (name === STOP_HIDING) {
        if (status === "hiding") {
          status = "showing";
          if (virtualFrames.has(err)) {
            newTrace.unshift(...virtualFrames.get(err));
          }
        } else if (status === "unknown") {
          newTrace = trace;
          break;
        }
      } else if (status !== "hiding") {
        newTrace.push(trace[i]);
      }
    }
    return prepareStackTrace(err, newTrace);
  };
}
function defaultPrepareStackTrace(err, trace) {
  if (trace.length === 0) return ErrorToString(err);
  return `${ErrorToString(err)}\n    at ${trace.join("\n    at ")}`;
}
0 && 0;

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/debug.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/debug.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getInclusionReasons = getInclusionReasons;
var _semver = __webpack_require__(/*! semver */ "./node_modules/semver/semver.js");
var _pretty = __webpack_require__(/*! ./pretty.js */ "./node_modules/@babel/helper-compilation-targets/lib/pretty.js");
var _utils = __webpack_require__(/*! ./utils.js */ "./node_modules/@babel/helper-compilation-targets/lib/utils.js");
function getInclusionReasons(item, targetVersions, list) {
  const minVersions = list[item] || {};
  return Object.keys(targetVersions).reduce((result, env) => {
    const minVersion = (0, _utils.getLowestImplementedVersion)(minVersions, env);
    const targetVersion = targetVersions[env];
    if (!minVersion) {
      result[env] = (0, _pretty.prettifyVersion)(targetVersion);
    } else {
      const minIsUnreleased = (0, _utils.isUnreleasedVersion)(minVersion, env);
      const targetIsUnreleased = (0, _utils.isUnreleasedVersion)(targetVersion, env);
      if (!targetIsUnreleased && (minIsUnreleased || _semver.lt(targetVersion.toString(), (0, _utils.semverify)(minVersion)))) {
        result[env] = (0, _pretty.prettifyVersion)(targetVersion);
      }
    }
    return result;
  }, {});
}

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/filter-items.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/filter-items.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = filterItems;
exports.isRequired = isRequired;
exports.targetsSupported = targetsSupported;
var _semver = __webpack_require__(/*! semver */ "./node_modules/semver/semver.js");
var _plugins = __webpack_require__(/*! @babel/compat-data/plugins */ "./node_modules/@babel/compat-data/plugins.js");
var _utils = __webpack_require__(/*! ./utils.js */ "./node_modules/@babel/helper-compilation-targets/lib/utils.js");
function targetsSupported(target, support) {
  const targetEnvironments = Object.keys(target);
  if (targetEnvironments.length === 0) {
    return false;
  }
  const unsupportedEnvironments = targetEnvironments.filter(environment => {
    const lowestImplementedVersion = (0, _utils.getLowestImplementedVersion)(support, environment);
    if (!lowestImplementedVersion) {
      return true;
    }
    const lowestTargetedVersion = target[environment];
    if ((0, _utils.isUnreleasedVersion)(lowestTargetedVersion, environment)) {
      return false;
    }
    if ((0, _utils.isUnreleasedVersion)(lowestImplementedVersion, environment)) {
      return true;
    }
    if (!_semver.valid(lowestTargetedVersion.toString())) {
      throw new Error(`Invalid version passed for target "${environment}": "${lowestTargetedVersion}". ` + "Versions must be in semver format (major.minor.patch)");
    }
    return _semver.gt((0, _utils.semverify)(lowestImplementedVersion), lowestTargetedVersion.toString());
  });
  return unsupportedEnvironments.length === 0;
}
function isRequired(name, targets, {
  compatData = _plugins,
  includes,
  excludes
} = {}) {
  if (excludes != null && excludes.has(name)) return false;
  if (includes != null && includes.has(name)) return true;
  return !targetsSupported(targets, compatData[name]);
}
function filterItems(list, includes, excludes, targets, defaultIncludes, defaultExcludes, pluginSyntaxMap) {
  const result = new Set();
  const options = {
    compatData: list,
    includes,
    excludes
  };
  for (const item in list) {
    if (isRequired(item, targets, options)) {
      result.add(item);
    } else if (pluginSyntaxMap) {
      const shippedProposalsSyntax = pluginSyntaxMap.get(item);
      if (shippedProposalsSyntax) {
        result.add(shippedProposalsSyntax);
      }
    }
  }
  defaultIncludes == null || defaultIncludes.forEach(item => !excludes.has(item) && result.add(item));
  defaultExcludes == null || defaultExcludes.forEach(item => !includes.has(item) && result.delete(item));
  return result;
}

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "TargetNames", ({
  enumerable: true,
  get: function () {
    return _options.TargetNames;
  }
}));
exports["default"] = getTargets;
Object.defineProperty(exports, "filterItems", ({
  enumerable: true,
  get: function () {
    return _filterItems.default;
  }
}));
Object.defineProperty(exports, "getInclusionReasons", ({
  enumerable: true,
  get: function () {
    return _debug.getInclusionReasons;
  }
}));
exports.isBrowsersQueryValid = isBrowsersQueryValid;
Object.defineProperty(exports, "isRequired", ({
  enumerable: true,
  get: function () {
    return _filterItems.isRequired;
  }
}));
Object.defineProperty(exports, "prettifyTargets", ({
  enumerable: true,
  get: function () {
    return _pretty.prettifyTargets;
  }
}));
Object.defineProperty(exports, "unreleasedLabels", ({
  enumerable: true,
  get: function () {
    return _targets.unreleasedLabels;
  }
}));
var _browserslist = __webpack_require__(/*! browserslist */ "./node_modules/browserslist/index.js");
var _helperValidatorOption = __webpack_require__(/*! @babel/helper-validator-option */ "./node_modules/@babel/helper-validator-option/lib/index.js");
var _nativeModules = __webpack_require__(/*! @babel/compat-data/native-modules */ "./node_modules/@babel/compat-data/native-modules.js");
var _lruCache = __webpack_require__(/*! lru-cache */ "./node_modules/lru-cache/index.js");
var _utils = __webpack_require__(/*! ./utils.js */ "./node_modules/@babel/helper-compilation-targets/lib/utils.js");
var _targets = __webpack_require__(/*! ./targets.js */ "./node_modules/@babel/helper-compilation-targets/lib/targets.js");
var _options = __webpack_require__(/*! ./options.js */ "./node_modules/@babel/helper-compilation-targets/lib/options.js");
var _pretty = __webpack_require__(/*! ./pretty.js */ "./node_modules/@babel/helper-compilation-targets/lib/pretty.js");
var _debug = __webpack_require__(/*! ./debug.js */ "./node_modules/@babel/helper-compilation-targets/lib/debug.js");
var _filterItems = __webpack_require__(/*! ./filter-items.js */ "./node_modules/@babel/helper-compilation-targets/lib/filter-items.js");
const ESM_SUPPORT = _nativeModules["es6.module"];
const v = new _helperValidatorOption.OptionValidator("@babel/helper-compilation-targets");
function validateTargetNames(targets) {
  const validTargets = Object.keys(_options.TargetNames);
  for (const target of Object.keys(targets)) {
    if (!(target in _options.TargetNames)) {
      throw new Error(v.formatMessage(`'${target}' is not a valid target
- Did you mean '${(0, _helperValidatorOption.findSuggestion)(target, validTargets)}'?`));
    }
  }
  return targets;
}
function isBrowsersQueryValid(browsers) {
  return typeof browsers === "string" || Array.isArray(browsers) && browsers.every(b => typeof b === "string");
}
function validateBrowsers(browsers) {
  v.invariant(browsers === undefined || isBrowsersQueryValid(browsers), `'${String(browsers)}' is not a valid browserslist query`);
  return browsers;
}
function getLowestVersions(browsers) {
  return browsers.reduce((all, browser) => {
    const [browserName, browserVersion] = browser.split(" ");
    const target = _targets.browserNameMap[browserName];
    if (!target) {
      return all;
    }
    try {
      const splitVersion = browserVersion.split("-")[0].toLowerCase();
      const isSplitUnreleased = (0, _utils.isUnreleasedVersion)(splitVersion, target);
      if (!all[target]) {
        all[target] = isSplitUnreleased ? splitVersion : (0, _utils.semverify)(splitVersion);
        return all;
      }
      const version = all[target];
      const isUnreleased = (0, _utils.isUnreleasedVersion)(version, target);
      if (isUnreleased && isSplitUnreleased) {
        all[target] = (0, _utils.getLowestUnreleased)(version, splitVersion, target);
      } else if (isUnreleased) {
        all[target] = (0, _utils.semverify)(splitVersion);
      } else if (!isUnreleased && !isSplitUnreleased) {
        const parsedBrowserVersion = (0, _utils.semverify)(splitVersion);
        all[target] = (0, _utils.semverMin)(version, parsedBrowserVersion);
      }
    } catch (_) {}
    return all;
  }, {});
}
function outputDecimalWarning(decimalTargets) {
  if (!decimalTargets.length) {
    return;
  }
  console.warn("Warning, the following targets are using a decimal version:\n");
  decimalTargets.forEach(({
    target,
    value
  }) => console.warn(`  ${target}: ${value}`));
  console.warn(`
We recommend using a string for minor/patch versions to avoid numbers like 6.10
getting parsed as 6.1, which can lead to unexpected behavior.
`);
}
function semverifyTarget(target, value) {
  try {
    return (0, _utils.semverify)(value);
  } catch (_) {
    throw new Error(v.formatMessage(`'${value}' is not a valid value for 'targets.${target}'.`));
  }
}
function nodeTargetParser(value) {
  const parsed = value === true || value === "current" ? process.versions.node : semverifyTarget("node", value);
  return ["node", parsed];
}
function defaultTargetParser(target, value) {
  const version = (0, _utils.isUnreleasedVersion)(value, target) ? value.toLowerCase() : semverifyTarget(target, value);
  return [target, version];
}
function generateTargets(inputTargets) {
  const input = Object.assign({}, inputTargets);
  delete input.esmodules;
  delete input.browsers;
  return input;
}
function resolveTargets(queries, env) {
  const resolved = _browserslist(queries, {
    mobileToDesktop: true,
    env
  });
  return getLowestVersions(resolved);
}
const targetsCache = new _lruCache({
  max: 64
});
function resolveTargetsCached(queries, env) {
  const cacheKey = typeof queries === "string" ? queries : queries.join() + env;
  let cached = targetsCache.get(cacheKey);
  if (!cached) {
    cached = resolveTargets(queries, env);
    targetsCache.set(cacheKey, cached);
  }
  return Object.assign({}, cached);
}
function getTargets(inputTargets = {}, options = {}) {
  var _browsers, _browsers2;
  let {
    browsers,
    esmodules
  } = inputTargets;
  const {
    configPath = ".",
    onBrowserslistConfigFound
  } = options;
  validateBrowsers(browsers);
  const input = generateTargets(inputTargets);
  let targets = validateTargetNames(input);
  const shouldParseBrowsers = !!browsers;
  const hasTargets = shouldParseBrowsers || Object.keys(targets).length > 0;
  const shouldSearchForConfig = !options.ignoreBrowserslistConfig && !hasTargets;
  if (!browsers && shouldSearchForConfig) {
    browsers = process.env.BROWSERSLIST;
    if (!browsers) {
      const configFile = options.configFile || process.env.BROWSERSLIST_CONFIG || _browserslist.findConfigFile(configPath);
      if (configFile != null) {
        onBrowserslistConfigFound == null || onBrowserslistConfigFound(configFile);
        browsers = _browserslist.loadConfig({
          config: configFile,
          env: options.browserslistEnv
        });
      }
    }
    if (browsers == null) {
      {
        browsers = [];
      }
    }
  }
  if (esmodules && (esmodules !== "intersect" || !((_browsers = browsers) != null && _browsers.length))) {
    browsers = Object.keys(ESM_SUPPORT).map(browser => `${browser} >= ${ESM_SUPPORT[browser]}`).join(", ");
    esmodules = false;
  }
  if ((_browsers2 = browsers) != null && _browsers2.length) {
    const queryBrowsers = resolveTargetsCached(browsers, options.browserslistEnv);
    if (esmodules === "intersect") {
      for (const browser of Object.keys(queryBrowsers)) {
        if (browser !== "deno" && browser !== "ie") {
          const esmSupportVersion = ESM_SUPPORT[browser === "opera_mobile" ? "op_mob" : browser];
          if (esmSupportVersion) {
            const version = queryBrowsers[browser];
            queryBrowsers[browser] = (0, _utils.getHighestUnreleased)(version, (0, _utils.semverify)(esmSupportVersion), browser);
          } else {
            delete queryBrowsers[browser];
          }
        } else {
          delete queryBrowsers[browser];
        }
      }
    }
    targets = Object.assign(queryBrowsers, targets);
  }
  const result = {};
  const decimalWarnings = [];
  for (const target of Object.keys(targets).sort()) {
    const value = targets[target];
    if (typeof value === "number" && value % 1 !== 0) {
      decimalWarnings.push({
        target,
        value
      });
    }
    const [parsedTarget, parsedValue] = target === "node" ? nodeTargetParser(value) : defaultTargetParser(target, value);
    if (parsedValue) {
      result[parsedTarget] = parsedValue;
    }
  }
  outputDecimalWarning(decimalWarnings);
  return result;
}

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/options.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/options.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TargetNames = void 0;
const TargetNames = exports.TargetNames = {
  node: "node",
  deno: "deno",
  chrome: "chrome",
  opera: "opera",
  edge: "edge",
  firefox: "firefox",
  safari: "safari",
  ie: "ie",
  ios: "ios",
  android: "android",
  electron: "electron",
  samsung: "samsung",
  rhino: "rhino",
  opera_mobile: "opera_mobile"
};

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/pretty.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/pretty.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.prettifyTargets = prettifyTargets;
exports.prettifyVersion = prettifyVersion;
var _semver = __webpack_require__(/*! semver */ "./node_modules/semver/semver.js");
var _targets = __webpack_require__(/*! ./targets.js */ "./node_modules/@babel/helper-compilation-targets/lib/targets.js");
function prettifyVersion(version) {
  if (typeof version !== "string") {
    return version;
  }
  const {
    major,
    minor,
    patch
  } = _semver.parse(version);
  const parts = [major];
  if (minor || patch) {
    parts.push(minor);
  }
  if (patch) {
    parts.push(patch);
  }
  return parts.join(".");
}
function prettifyTargets(targets) {
  return Object.keys(targets).reduce((results, target) => {
    let value = targets[target];
    const unreleasedLabel = _targets.unreleasedLabels[target];
    if (typeof value === "string" && unreleasedLabel !== value) {
      value = prettifyVersion(value);
    }
    results[target] = value;
    return results;
  }, {});
}

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/targets.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/targets.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.unreleasedLabels = exports.browserNameMap = void 0;
const unreleasedLabels = exports.unreleasedLabels = {
  safari: "tp"
};
const browserNameMap = exports.browserNameMap = {
  and_chr: "chrome",
  and_ff: "firefox",
  android: "android",
  chrome: "chrome",
  edge: "edge",
  firefox: "firefox",
  ie: "ie",
  ie_mob: "ie",
  ios_saf: "ios",
  node: "node",
  deno: "deno",
  op_mob: "opera_mobile",
  opera: "opera",
  safari: "safari",
  samsung: "samsung"
};

/***/ }),

/***/ "./node_modules/@babel/helper-compilation-targets/lib/utils.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/helper-compilation-targets/lib/utils.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getHighestUnreleased = getHighestUnreleased;
exports.getLowestImplementedVersion = getLowestImplementedVersion;
exports.getLowestUnreleased = getLowestUnreleased;
exports.isUnreleasedVersion = isUnreleasedVersion;
exports.semverMin = semverMin;
exports.semverify = semverify;
var _semver = __webpack_require__(/*! semver */ "./node_modules/semver/semver.js");
var _helperValidatorOption = __webpack_require__(/*! @babel/helper-validator-option */ "./node_modules/@babel/helper-validator-option/lib/index.js");
var _targets = __webpack_require__(/*! ./targets.js */ "./node_modules/@babel/helper-compilation-targets/lib/targets.js");
const versionRegExp = /^(?:\d+|\d(?:\d?[^\d\n\r\u2028\u2029]\d+|\d{2,}(?:[^\d\n\r\u2028\u2029]\d+)?))$/;
const v = new _helperValidatorOption.OptionValidator("@babel/helper-compilation-targets");
function semverMin(first, second) {
  return first && _semver.lt(first, second) ? first : second;
}
function semverify(version) {
  if (typeof version === "string" && _semver.valid(version)) {
    return version;
  }
  v.invariant(typeof version === "number" || typeof version === "string" && versionRegExp.test(version), `'${version}' is not a valid version`);
  version = version.toString();
  let pos = 0;
  let num = 0;
  while ((pos = version.indexOf(".", pos + 1)) > 0) {
    num++;
  }
  return version + ".0".repeat(2 - num);
}
function isUnreleasedVersion(version, env) {
  const unreleasedLabel = _targets.unreleasedLabels[env];
  return !!unreleasedLabel && unreleasedLabel === version.toString().toLowerCase();
}
function getLowestUnreleased(a, b, env) {
  const unreleasedLabel = _targets.unreleasedLabels[env];
  if (a === unreleasedLabel) {
    return b;
  }
  if (b === unreleasedLabel) {
    return a;
  }
  return semverMin(a, b);
}
function getHighestUnreleased(a, b, env) {
  return getLowestUnreleased(a, b, env) === a ? b : a;
}
function getLowestImplementedVersion(plugin, environment) {
  const result = plugin[environment];
  if (!result && environment === "android") {
    return plugin.chrome;
  }
  return result;
}

/***/ }),

/***/ "./node_modules/@babel/helper-validator-option/lib/find-suggestion.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/helper-validator-option/lib/find-suggestion.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.findSuggestion = findSuggestion;
const {
  min
} = Math;
function levenshtein(a, b) {
  let t = [],
    u = [],
    i,
    j;
  const m = a.length,
    n = b.length;
  if (!m) {
    return n;
  }
  if (!n) {
    return m;
  }
  for (j = 0; j <= n; j++) {
    t[j] = j;
  }
  for (i = 1; i <= m; i++) {
    for (u = [i], j = 1; j <= n; j++) {
      u[j] = a[i - 1] === b[j - 1] ? t[j - 1] : min(t[j - 1], t[j], u[j - 1]) + 1;
    }
    t = u;
  }
  return u[n];
}
function findSuggestion(str, arr) {
  const distances = arr.map(el => levenshtein(el, str));
  return arr[distances.indexOf(min(...distances))];
}

/***/ }),

/***/ "./node_modules/@babel/helper-validator-option/lib/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/helper-validator-option/lib/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "OptionValidator", ({
  enumerable: true,
  get: function () {
    return _validator.OptionValidator;
  }
}));
Object.defineProperty(exports, "findSuggestion", ({
  enumerable: true,
  get: function () {
    return _findSuggestion.findSuggestion;
  }
}));
var _validator = __webpack_require__(/*! ./validator.js */ "./node_modules/@babel/helper-validator-option/lib/validator.js");
var _findSuggestion = __webpack_require__(/*! ./find-suggestion.js */ "./node_modules/@babel/helper-validator-option/lib/find-suggestion.js");

/***/ }),

/***/ "./node_modules/@babel/helper-validator-option/lib/validator.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/helper-validator-option/lib/validator.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OptionValidator = void 0;
var _findSuggestion = __webpack_require__(/*! ./find-suggestion.js */ "./node_modules/@babel/helper-validator-option/lib/find-suggestion.js");
class OptionValidator {
  constructor(descriptor) {
    this.descriptor = descriptor;
  }
  validateTopLevelOptions(options, TopLevelOptionShape) {
    const validOptionNames = Object.keys(TopLevelOptionShape);
    for (const option of Object.keys(options)) {
      if (!validOptionNames.includes(option)) {
        throw new Error(this.formatMessage(`'${option}' is not a valid top-level option.
- Did you mean '${(0, _findSuggestion.findSuggestion)(option, validOptionNames)}'?`));
      }
    }
  }
  validateBooleanOption(name, value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    } else {
      this.invariant(typeof value === "boolean", `'${name}' option must be a boolean.`);
    }
    return value;
  }
  validateStringOption(name, value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    } else {
      this.invariant(typeof value === "string", `'${name}' option must be a string.`);
    }
    return value;
  }
  invariant(condition, message) {
    if (!condition) {
      throw new Error(this.formatMessage(message));
    }
  }
  formatMessage(message) {
    return `${this.descriptor}: ${message}`;
  }
}
exports.OptionValidator = OptionValidator;

/***/ }),

/***/ "./node_modules/@babel/compat-data/data/native-modules.json":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/compat-data/data/native-modules.json ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"es6.module":{"chrome":"61","and_chr":"61","edge":"16","firefox":"60","and_ff":"60","node":"13.2.0","opera":"48","op_mob":"45","safari":"10.1","ios":"10.3","samsung":"8.2","android":"61","electron":"2.0","ios_saf":"10.3"}}');

/***/ }),

/***/ "./node_modules/@babel/compat-data/data/plugins.json":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/compat-data/data/plugins.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"transform-duplicate-named-capturing-groups-regex":{"chrome":"126","opera":"112","edge":"126","firefox":"129","safari":"17.4","node":"23","ios":"17.4","electron":"31.0"},"transform-regexp-modifiers":{"chrome":"125","opera":"111","edge":"125","firefox":"132","node":"23","electron":"31.0"},"transform-unicode-sets-regex":{"chrome":"112","opera":"98","edge":"112","firefox":"116","safari":"17","node":"20","deno":"1.32","ios":"17","opera_mobile":"75","electron":"24.0"},"bugfix/transform-v8-static-class-fields-redefine-readonly":{"chrome":"98","opera":"84","edge":"98","firefox":"75","safari":"15","node":"12","deno":"1.18","ios":"15","samsung":"11","opera_mobile":"52","electron":"17.0"},"bugfix/transform-firefox-class-in-computed-class-key":{"chrome":"74","opera":"62","edge":"79","safari":"16","node":"12","deno":"1","ios":"16","samsung":"11","opera_mobile":"53","electron":"6.0"},"bugfix/transform-safari-class-field-initializer-scope":{"chrome":"74","opera":"62","edge":"79","firefox":"69","safari":"16","node":"12","deno":"1","ios":"16","samsung":"11","opera_mobile":"53","electron":"6.0"},"transform-class-static-block":{"chrome":"94","opera":"80","edge":"94","firefox":"93","safari":"16.4","node":"16.11","deno":"1.14","ios":"16.4","samsung":"17","opera_mobile":"66","electron":"15.0"},"proposal-class-static-block":{"chrome":"94","opera":"80","edge":"94","firefox":"93","safari":"16.4","node":"16.11","deno":"1.14","ios":"16.4","samsung":"17","opera_mobile":"66","electron":"15.0"},"transform-private-property-in-object":{"chrome":"91","opera":"77","edge":"91","firefox":"90","safari":"15","node":"16.9","deno":"1.9","ios":"15","samsung":"16","opera_mobile":"64","electron":"13.0"},"proposal-private-property-in-object":{"chrome":"91","opera":"77","edge":"91","firefox":"90","safari":"15","node":"16.9","deno":"1.9","ios":"15","samsung":"16","opera_mobile":"64","electron":"13.0"},"transform-class-properties":{"chrome":"74","opera":"62","edge":"79","firefox":"90","safari":"14.1","node":"12","deno":"1","ios":"14.5","samsung":"11","opera_mobile":"53","electron":"6.0"},"proposal-class-properties":{"chrome":"74","opera":"62","edge":"79","firefox":"90","safari":"14.1","node":"12","deno":"1","ios":"14.5","samsung":"11","opera_mobile":"53","electron":"6.0"},"transform-private-methods":{"chrome":"84","opera":"70","edge":"84","firefox":"90","safari":"15","node":"14.6","deno":"1","ios":"15","samsung":"14","opera_mobile":"60","electron":"10.0"},"proposal-private-methods":{"chrome":"84","opera":"70","edge":"84","firefox":"90","safari":"15","node":"14.6","deno":"1","ios":"15","samsung":"14","opera_mobile":"60","electron":"10.0"},"transform-numeric-separator":{"chrome":"75","opera":"62","edge":"79","firefox":"70","safari":"13","node":"12.5","deno":"1","ios":"13","samsung":"11","rhino":"1.7.14","opera_mobile":"54","electron":"6.0"},"proposal-numeric-separator":{"chrome":"75","opera":"62","edge":"79","firefox":"70","safari":"13","node":"12.5","deno":"1","ios":"13","samsung":"11","rhino":"1.7.14","opera_mobile":"54","electron":"6.0"},"transform-logical-assignment-operators":{"chrome":"85","opera":"71","edge":"85","firefox":"79","safari":"14","node":"15","deno":"1.2","ios":"14","samsung":"14","opera_mobile":"60","electron":"10.0"},"proposal-logical-assignment-operators":{"chrome":"85","opera":"71","edge":"85","firefox":"79","safari":"14","node":"15","deno":"1.2","ios":"14","samsung":"14","opera_mobile":"60","electron":"10.0"},"transform-nullish-coalescing-operator":{"chrome":"80","opera":"67","edge":"80","firefox":"72","safari":"13.1","node":"14","deno":"1","ios":"13.4","samsung":"13","opera_mobile":"57","electron":"8.0"},"proposal-nullish-coalescing-operator":{"chrome":"80","opera":"67","edge":"80","firefox":"72","safari":"13.1","node":"14","deno":"1","ios":"13.4","samsung":"13","opera_mobile":"57","electron":"8.0"},"transform-optional-chaining":{"chrome":"91","opera":"77","edge":"91","firefox":"74","safari":"13.1","node":"16.9","deno":"1.9","ios":"13.4","samsung":"16","opera_mobile":"64","electron":"13.0"},"proposal-optional-chaining":{"chrome":"91","opera":"77","edge":"91","firefox":"74","safari":"13.1","node":"16.9","deno":"1.9","ios":"13.4","samsung":"16","opera_mobile":"64","electron":"13.0"},"transform-json-strings":{"chrome":"66","opera":"53","edge":"79","firefox":"62","safari":"12","node":"10","deno":"1","ios":"12","samsung":"9","rhino":"1.7.14","opera_mobile":"47","electron":"3.0"},"proposal-json-strings":{"chrome":"66","opera":"53","edge":"79","firefox":"62","safari":"12","node":"10","deno":"1","ios":"12","samsung":"9","rhino":"1.7.14","opera_mobile":"47","electron":"3.0"},"transform-optional-catch-binding":{"chrome":"66","opera":"53","edge":"79","firefox":"58","safari":"11.1","node":"10","deno":"1","ios":"11.3","samsung":"9","opera_mobile":"47","electron":"3.0"},"proposal-optional-catch-binding":{"chrome":"66","opera":"53","edge":"79","firefox":"58","safari":"11.1","node":"10","deno":"1","ios":"11.3","samsung":"9","opera_mobile":"47","electron":"3.0"},"transform-parameters":{"chrome":"49","opera":"36","edge":"18","firefox":"53","safari":"16.3","node":"6","deno":"1","ios":"16.3","samsung":"5","opera_mobile":"36","electron":"0.37"},"transform-async-generator-functions":{"chrome":"63","opera":"50","edge":"79","firefox":"57","safari":"12","node":"10","deno":"1","ios":"12","samsung":"8","opera_mobile":"46","electron":"3.0"},"proposal-async-generator-functions":{"chrome":"63","opera":"50","edge":"79","firefox":"57","safari":"12","node":"10","deno":"1","ios":"12","samsung":"8","opera_mobile":"46","electron":"3.0"},"transform-object-rest-spread":{"chrome":"60","opera":"47","edge":"79","firefox":"55","safari":"11.1","node":"8.3","deno":"1","ios":"11.3","samsung":"8","opera_mobile":"44","electron":"2.0"},"proposal-object-rest-spread":{"chrome":"60","opera":"47","edge":"79","firefox":"55","safari":"11.1","node":"8.3","deno":"1","ios":"11.3","samsung":"8","opera_mobile":"44","electron":"2.0"},"transform-dotall-regex":{"chrome":"62","opera":"49","edge":"79","firefox":"78","safari":"11.1","node":"8.10","deno":"1","ios":"11.3","samsung":"8","rhino":"1.7.15","opera_mobile":"46","electron":"3.0"},"transform-unicode-property-regex":{"chrome":"64","opera":"51","edge":"79","firefox":"78","safari":"11.1","node":"10","deno":"1","ios":"11.3","samsung":"9","opera_mobile":"47","electron":"3.0"},"proposal-unicode-property-regex":{"chrome":"64","opera":"51","edge":"79","firefox":"78","safari":"11.1","node":"10","deno":"1","ios":"11.3","samsung":"9","opera_mobile":"47","electron":"3.0"},"transform-named-capturing-groups-regex":{"chrome":"64","opera":"51","edge":"79","firefox":"78","safari":"11.1","node":"10","deno":"1","ios":"11.3","samsung":"9","opera_mobile":"47","electron":"3.0"},"transform-async-to-generator":{"chrome":"55","opera":"42","edge":"15","firefox":"52","safari":"11","node":"7.6","deno":"1","ios":"11","samsung":"6","opera_mobile":"42","electron":"1.6"},"transform-exponentiation-operator":{"chrome":"52","opera":"39","edge":"14","firefox":"52","safari":"10.1","node":"7","deno":"1","ios":"10.3","samsung":"6","rhino":"1.7.14","opera_mobile":"41","electron":"1.3"},"transform-template-literals":{"chrome":"41","opera":"28","edge":"13","firefox":"34","safari":"13","node":"4","deno":"1","ios":"13","samsung":"3.4","opera_mobile":"28","electron":"0.21"},"transform-literals":{"chrome":"44","opera":"31","edge":"12","firefox":"53","safari":"9","node":"4","deno":"1","ios":"9","samsung":"4","rhino":"1.7.15","opera_mobile":"32","electron":"0.30"},"transform-function-name":{"chrome":"51","opera":"38","edge":"79","firefox":"53","safari":"10","node":"6.5","deno":"1","ios":"10","samsung":"5","opera_mobile":"41","electron":"1.2"},"transform-arrow-functions":{"chrome":"47","opera":"34","edge":"13","firefox":"43","safari":"10","node":"6","deno":"1","ios":"10","samsung":"5","rhino":"1.7.13","opera_mobile":"34","electron":"0.36"},"transform-block-scoped-functions":{"chrome":"41","opera":"28","edge":"12","firefox":"46","safari":"10","node":"4","deno":"1","ie":"11","ios":"10","samsung":"3.4","opera_mobile":"28","electron":"0.21"},"transform-classes":{"chrome":"46","opera":"33","edge":"13","firefox":"45","safari":"10","node":"5","deno":"1","ios":"10","samsung":"5","opera_mobile":"33","electron":"0.36"},"transform-object-super":{"chrome":"46","opera":"33","edge":"13","firefox":"45","safari":"10","node":"5","deno":"1","ios":"10","samsung":"5","opera_mobile":"33","electron":"0.36"},"transform-shorthand-properties":{"chrome":"43","opera":"30","edge":"12","firefox":"33","safari":"9","node":"4","deno":"1","ios":"9","samsung":"4","rhino":"1.7.14","opera_mobile":"30","electron":"0.27"},"transform-duplicate-keys":{"chrome":"42","opera":"29","edge":"12","firefox":"34","safari":"9","node":"4","deno":"1","ios":"9","samsung":"3.4","opera_mobile":"29","electron":"0.25"},"transform-computed-properties":{"chrome":"44","opera":"31","edge":"12","firefox":"34","safari":"7.1","node":"4","deno":"1","ios":"8","samsung":"4","opera_mobile":"32","electron":"0.30"},"transform-for-of":{"chrome":"51","opera":"38","edge":"15","firefox":"53","safari":"10","node":"6.5","deno":"1","ios":"10","samsung":"5","opera_mobile":"41","electron":"1.2"},"transform-sticky-regex":{"chrome":"49","opera":"36","edge":"13","firefox":"3","safari":"10","node":"6","deno":"1","ios":"10","samsung":"5","rhino":"1.7.15","opera_mobile":"36","electron":"0.37"},"transform-unicode-escapes":{"chrome":"44","opera":"31","edge":"12","firefox":"53","safari":"9","node":"4","deno":"1","ios":"9","samsung":"4","rhino":"1.7.15","opera_mobile":"32","electron":"0.30"},"transform-unicode-regex":{"chrome":"50","opera":"37","edge":"13","firefox":"46","safari":"12","node":"6","deno":"1","ios":"12","samsung":"5","opera_mobile":"37","electron":"1.1"},"transform-spread":{"chrome":"46","opera":"33","edge":"13","firefox":"45","safari":"10","node":"5","deno":"1","ios":"10","samsung":"5","opera_mobile":"33","electron":"0.36"},"transform-destructuring":{"chrome":"51","opera":"38","edge":"15","firefox":"53","safari":"10","node":"6.5","deno":"1","ios":"10","samsung":"5","opera_mobile":"41","electron":"1.2"},"transform-block-scoping":{"chrome":"50","opera":"37","edge":"14","firefox":"53","safari":"11","node":"6","deno":"1","ios":"11","samsung":"5","opera_mobile":"37","electron":"1.1"},"transform-typeof-symbol":{"chrome":"38","opera":"25","edge":"12","firefox":"36","safari":"9","node":"0.12","deno":"1","ios":"9","samsung":"3","rhino":"1.7.13","opera_mobile":"25","electron":"0.20"},"transform-new-target":{"chrome":"46","opera":"33","edge":"14","firefox":"41","safari":"10","node":"5","deno":"1","ios":"10","samsung":"5","opera_mobile":"33","electron":"0.36"},"transform-regenerator":{"chrome":"50","opera":"37","edge":"13","firefox":"53","safari":"10","node":"6","deno":"1","ios":"10","samsung":"5","opera_mobile":"37","electron":"1.1"},"transform-member-expression-literals":{"chrome":"7","opera":"12","edge":"12","firefox":"2","safari":"5.1","node":"0.4","deno":"1","ie":"9","android":"4","ios":"6","phantom":"1.9","samsung":"1","rhino":"1.7.13","opera_mobile":"12","electron":"0.20"},"transform-property-literals":{"chrome":"7","opera":"12","edge":"12","firefox":"2","safari":"5.1","node":"0.4","deno":"1","ie":"9","android":"4","ios":"6","phantom":"1.9","samsung":"1","rhino":"1.7.13","opera_mobile":"12","electron":"0.20"},"transform-reserved-words":{"chrome":"13","opera":"10.50","edge":"12","firefox":"2","safari":"3.1","node":"0.6","deno":"1","ie":"9","android":"4.4","ios":"6","phantom":"1.9","samsung":"1","rhino":"1.7.13","opera_mobile":"10.1","electron":"0.20"},"transform-export-namespace-from":{"chrome":"72","deno":"1.0","edge":"79","firefox":"80","node":"13.2","opera":"60","opera_mobile":"51","safari":"14.1","ios":"14.5","samsung":"11.0","android":"72","electron":"5.0"},"proposal-export-namespace-from":{"chrome":"72","deno":"1.0","edge":"79","firefox":"80","node":"13.2","opera":"60","opera_mobile":"51","safari":"14.1","ios":"14.5","samsung":"11.0","android":"72","electron":"5.0"}}');

/***/ }),

/***/ "./node_modules/node-releases/data/processed/envs.json":
/*!*************************************************************!*\
  !*** ./node_modules/node-releases/data/processed/envs.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('[{"name":"nodejs","version":"0.2.0","date":"2011-08-26","lts":false,"security":false,"v8":"2.3.8.0"},{"name":"nodejs","version":"0.3.0","date":"2011-08-26","lts":false,"security":false,"v8":"2.5.1.0"},{"name":"nodejs","version":"0.4.0","date":"2011-08-26","lts":false,"security":false,"v8":"3.1.2.0"},{"name":"nodejs","version":"0.5.0","date":"2011-08-26","lts":false,"security":false,"v8":"3.1.8.25"},{"name":"nodejs","version":"0.6.0","date":"2011-11-04","lts":false,"security":false,"v8":"3.6.6.6"},{"name":"nodejs","version":"0.7.0","date":"2012-01-17","lts":false,"security":false,"v8":"3.8.6.0"},{"name":"nodejs","version":"0.8.0","date":"2012-06-22","lts":false,"security":false,"v8":"3.11.10.10"},{"name":"nodejs","version":"0.9.0","date":"2012-07-20","lts":false,"security":false,"v8":"3.11.10.15"},{"name":"nodejs","version":"0.10.0","date":"2013-03-11","lts":false,"security":false,"v8":"3.14.5.8"},{"name":"nodejs","version":"0.11.0","date":"2013-03-28","lts":false,"security":false,"v8":"3.17.13.0"},{"name":"nodejs","version":"0.12.0","date":"2015-02-06","lts":false,"security":false,"v8":"3.28.73.0"},{"name":"nodejs","version":"4.0.0","date":"2015-09-08","lts":false,"security":false,"v8":"4.5.103.30"},{"name":"nodejs","version":"4.1.0","date":"2015-09-17","lts":false,"security":false,"v8":"4.5.103.33"},{"name":"nodejs","version":"4.2.0","date":"2015-10-12","lts":"Argon","security":false,"v8":"4.5.103.35"},{"name":"nodejs","version":"4.3.0","date":"2016-02-09","lts":"Argon","security":false,"v8":"4.5.103.35"},{"name":"nodejs","version":"4.4.0","date":"2016-03-08","lts":"Argon","security":false,"v8":"4.5.103.35"},{"name":"nodejs","version":"4.5.0","date":"2016-08-16","lts":"Argon","security":false,"v8":"4.5.103.37"},{"name":"nodejs","version":"4.6.0","date":"2016-09-27","lts":"Argon","security":true,"v8":"4.5.103.37"},{"name":"nodejs","version":"4.7.0","date":"2016-12-06","lts":"Argon","security":false,"v8":"4.5.103.43"},{"name":"nodejs","version":"4.8.0","date":"2017-02-21","lts":"Argon","security":false,"v8":"4.5.103.45"},{"name":"nodejs","version":"4.9.0","date":"2018-03-28","lts":"Argon","security":true,"v8":"4.5.103.53"},{"name":"nodejs","version":"5.0.0","date":"2015-10-29","lts":false,"security":false,"v8":"4.6.85.28"},{"name":"nodejs","version":"5.1.0","date":"2015-11-17","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.2.0","date":"2015-12-09","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.3.0","date":"2015-12-15","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.4.0","date":"2016-01-06","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.5.0","date":"2016-01-21","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.6.0","date":"2016-02-09","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.7.0","date":"2016-02-23","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.8.0","date":"2016-03-09","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.9.0","date":"2016-03-16","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.10.0","date":"2016-04-01","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.11.0","date":"2016-04-21","lts":false,"security":false,"v8":"4.6.85.31"},{"name":"nodejs","version":"5.12.0","date":"2016-06-23","lts":false,"security":false,"v8":"4.6.85.32"},{"name":"nodejs","version":"6.0.0","date":"2016-04-26","lts":false,"security":false,"v8":"5.0.71.35"},{"name":"nodejs","version":"6.1.0","date":"2016-05-05","lts":false,"security":false,"v8":"5.0.71.35"},{"name":"nodejs","version":"6.2.0","date":"2016-05-17","lts":false,"security":false,"v8":"5.0.71.47"},{"name":"nodejs","version":"6.3.0","date":"2016-07-06","lts":false,"security":false,"v8":"5.0.71.52"},{"name":"nodejs","version":"6.4.0","date":"2016-08-12","lts":false,"security":false,"v8":"5.0.71.60"},{"name":"nodejs","version":"6.5.0","date":"2016-08-26","lts":false,"security":false,"v8":"5.1.281.81"},{"name":"nodejs","version":"6.6.0","date":"2016-09-14","lts":false,"security":false,"v8":"5.1.281.83"},{"name":"nodejs","version":"6.7.0","date":"2016-09-27","lts":false,"security":true,"v8":"5.1.281.83"},{"name":"nodejs","version":"6.8.0","date":"2016-10-12","lts":false,"security":false,"v8":"5.1.281.84"},{"name":"nodejs","version":"6.9.0","date":"2016-10-18","lts":"Boron","security":false,"v8":"5.1.281.84"},{"name":"nodejs","version":"6.10.0","date":"2017-02-21","lts":"Boron","security":false,"v8":"5.1.281.93"},{"name":"nodejs","version":"6.11.0","date":"2017-06-06","lts":"Boron","security":false,"v8":"5.1.281.102"},{"name":"nodejs","version":"6.12.0","date":"2017-11-06","lts":"Boron","security":false,"v8":"5.1.281.108"},{"name":"nodejs","version":"6.13.0","date":"2018-02-10","lts":"Boron","security":false,"v8":"5.1.281.111"},{"name":"nodejs","version":"6.14.0","date":"2018-03-28","lts":"Boron","security":true,"v8":"5.1.281.111"},{"name":"nodejs","version":"6.15.0","date":"2018-11-27","lts":"Boron","security":true,"v8":"5.1.281.111"},{"name":"nodejs","version":"6.16.0","date":"2018-12-26","lts":"Boron","security":false,"v8":"5.1.281.111"},{"name":"nodejs","version":"6.17.0","date":"2019-02-28","lts":"Boron","security":true,"v8":"5.1.281.111"},{"name":"nodejs","version":"7.0.0","date":"2016-10-25","lts":false,"security":false,"v8":"5.4.500.36"},{"name":"nodejs","version":"7.1.0","date":"2016-11-08","lts":false,"security":false,"v8":"5.4.500.36"},{"name":"nodejs","version":"7.2.0","date":"2016-11-22","lts":false,"security":false,"v8":"5.4.500.43"},{"name":"nodejs","version":"7.3.0","date":"2016-12-20","lts":false,"security":false,"v8":"5.4.500.45"},{"name":"nodejs","version":"7.4.0","date":"2017-01-04","lts":false,"security":false,"v8":"5.4.500.45"},{"name":"nodejs","version":"7.5.0","date":"2017-01-31","lts":false,"security":false,"v8":"5.4.500.48"},{"name":"nodejs","version":"7.6.0","date":"2017-02-21","lts":false,"security":false,"v8":"5.5.372.40"},{"name":"nodejs","version":"7.7.0","date":"2017-02-28","lts":false,"security":false,"v8":"5.5.372.41"},{"name":"nodejs","version":"7.8.0","date":"2017-03-29","lts":false,"security":false,"v8":"5.5.372.43"},{"name":"nodejs","version":"7.9.0","date":"2017-04-11","lts":false,"security":false,"v8":"5.5.372.43"},{"name":"nodejs","version":"7.10.0","date":"2017-05-02","lts":false,"security":false,"v8":"5.5.372.43"},{"name":"nodejs","version":"8.0.0","date":"2017-05-30","lts":false,"security":false,"v8":"5.8.283.41"},{"name":"nodejs","version":"8.1.0","date":"2017-06-08","lts":false,"security":false,"v8":"5.8.283.41"},{"name":"nodejs","version":"8.2.0","date":"2017-07-19","lts":false,"security":false,"v8":"5.8.283.41"},{"name":"nodejs","version":"8.3.0","date":"2017-08-08","lts":false,"security":false,"v8":"6.0.286.52"},{"name":"nodejs","version":"8.4.0","date":"2017-08-15","lts":false,"security":false,"v8":"6.0.286.52"},{"name":"nodejs","version":"8.5.0","date":"2017-09-12","lts":false,"security":false,"v8":"6.0.287.53"},{"name":"nodejs","version":"8.6.0","date":"2017-09-26","lts":false,"security":false,"v8":"6.0.287.53"},{"name":"nodejs","version":"8.7.0","date":"2017-10-11","lts":false,"security":false,"v8":"6.1.534.42"},{"name":"nodejs","version":"8.8.0","date":"2017-10-24","lts":false,"security":false,"v8":"6.1.534.42"},{"name":"nodejs","version":"8.9.0","date":"2017-10-31","lts":"Carbon","security":false,"v8":"6.1.534.46"},{"name":"nodejs","version":"8.10.0","date":"2018-03-06","lts":"Carbon","security":false,"v8":"6.2.414.50"},{"name":"nodejs","version":"8.11.0","date":"2018-03-28","lts":"Carbon","security":true,"v8":"6.2.414.50"},{"name":"nodejs","version":"8.12.0","date":"2018-09-10","lts":"Carbon","security":false,"v8":"6.2.414.66"},{"name":"nodejs","version":"8.13.0","date":"2018-11-20","lts":"Carbon","security":false,"v8":"6.2.414.72"},{"name":"nodejs","version":"8.14.0","date":"2018-11-27","lts":"Carbon","security":true,"v8":"6.2.414.72"},{"name":"nodejs","version":"8.15.0","date":"2018-12-26","lts":"Carbon","security":false,"v8":"6.2.414.75"},{"name":"nodejs","version":"8.16.0","date":"2019-04-16","lts":"Carbon","security":false,"v8":"6.2.414.77"},{"name":"nodejs","version":"8.17.0","date":"2019-12-17","lts":"Carbon","security":true,"v8":"6.2.414.78"},{"name":"nodejs","version":"9.0.0","date":"2017-10-31","lts":false,"security":false,"v8":"6.2.414.32"},{"name":"nodejs","version":"9.1.0","date":"2017-11-07","lts":false,"security":false,"v8":"6.2.414.32"},{"name":"nodejs","version":"9.2.0","date":"2017-11-14","lts":false,"security":false,"v8":"6.2.414.44"},{"name":"nodejs","version":"9.3.0","date":"2017-12-12","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.4.0","date":"2018-01-10","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.5.0","date":"2018-01-31","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.6.0","date":"2018-02-21","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.7.0","date":"2018-03-01","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.8.0","date":"2018-03-07","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.9.0","date":"2018-03-21","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.10.0","date":"2018-03-28","lts":false,"security":true,"v8":"6.2.414.46"},{"name":"nodejs","version":"9.11.0","date":"2018-04-04","lts":false,"security":false,"v8":"6.2.414.46"},{"name":"nodejs","version":"10.0.0","date":"2018-04-24","lts":false,"security":false,"v8":"6.6.346.24"},{"name":"nodejs","version":"10.1.0","date":"2018-05-08","lts":false,"security":false,"v8":"6.6.346.27"},{"name":"nodejs","version":"10.2.0","date":"2018-05-23","lts":false,"security":false,"v8":"6.6.346.32"},{"name":"nodejs","version":"10.3.0","date":"2018-05-29","lts":false,"security":false,"v8":"6.6.346.32"},{"name":"nodejs","version":"10.4.0","date":"2018-06-06","lts":false,"security":false,"v8":"6.7.288.43"},{"name":"nodejs","version":"10.5.0","date":"2018-06-20","lts":false,"security":false,"v8":"6.7.288.46"},{"name":"nodejs","version":"10.6.0","date":"2018-07-04","lts":false,"security":false,"v8":"6.7.288.46"},{"name":"nodejs","version":"10.7.0","date":"2018-07-18","lts":false,"security":false,"v8":"6.7.288.49"},{"name":"nodejs","version":"10.8.0","date":"2018-08-01","lts":false,"security":false,"v8":"6.7.288.49"},{"name":"nodejs","version":"10.9.0","date":"2018-08-15","lts":false,"security":false,"v8":"6.8.275.24"},{"name":"nodejs","version":"10.10.0","date":"2018-09-06","lts":false,"security":false,"v8":"6.8.275.30"},{"name":"nodejs","version":"10.11.0","date":"2018-09-19","lts":false,"security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.12.0","date":"2018-10-10","lts":false,"security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.13.0","date":"2018-10-30","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.14.0","date":"2018-11-27","lts":"Dubnium","security":true,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.15.0","date":"2018-12-26","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.16.0","date":"2019-05-28","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.17.0","date":"2019-10-22","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.18.0","date":"2019-12-17","lts":"Dubnium","security":true,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.19.0","date":"2020-02-05","lts":"Dubnium","security":true,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.20.0","date":"2020-03-26","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.21.0","date":"2020-06-02","lts":"Dubnium","security":true,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.22.0","date":"2020-07-21","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.23.0","date":"2020-10-27","lts":"Dubnium","security":false,"v8":"6.8.275.32"},{"name":"nodejs","version":"10.24.0","date":"2021-02-23","lts":"Dubnium","security":true,"v8":"6.8.275.32"},{"name":"nodejs","version":"11.0.0","date":"2018-10-23","lts":false,"security":false,"v8":"7.0.276.28"},{"name":"nodejs","version":"11.1.0","date":"2018-10-30","lts":false,"security":false,"v8":"7.0.276.32"},{"name":"nodejs","version":"11.2.0","date":"2018-11-15","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.3.0","date":"2018-11-27","lts":false,"security":true,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.4.0","date":"2018-12-07","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.5.0","date":"2018-12-18","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.6.0","date":"2018-12-26","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.7.0","date":"2019-01-17","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.8.0","date":"2019-01-24","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.9.0","date":"2019-01-30","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.10.0","date":"2019-02-14","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.11.0","date":"2019-03-05","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.12.0","date":"2019-03-14","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.13.0","date":"2019-03-28","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.14.0","date":"2019-04-10","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"11.15.0","date":"2019-04-30","lts":false,"security":false,"v8":"7.0.276.38"},{"name":"nodejs","version":"12.0.0","date":"2019-04-23","lts":false,"security":false,"v8":"7.4.288.21"},{"name":"nodejs","version":"12.1.0","date":"2019-04-29","lts":false,"security":false,"v8":"7.4.288.21"},{"name":"nodejs","version":"12.2.0","date":"2019-05-07","lts":false,"security":false,"v8":"7.4.288.21"},{"name":"nodejs","version":"12.3.0","date":"2019-05-21","lts":false,"security":false,"v8":"7.4.288.27"},{"name":"nodejs","version":"12.4.0","date":"2019-06-04","lts":false,"security":false,"v8":"7.4.288.27"},{"name":"nodejs","version":"12.5.0","date":"2019-06-26","lts":false,"security":false,"v8":"7.5.288.22"},{"name":"nodejs","version":"12.6.0","date":"2019-07-03","lts":false,"security":false,"v8":"7.5.288.22"},{"name":"nodejs","version":"12.7.0","date":"2019-07-23","lts":false,"security":false,"v8":"7.5.288.22"},{"name":"nodejs","version":"12.8.0","date":"2019-08-06","lts":false,"security":false,"v8":"7.5.288.22"},{"name":"nodejs","version":"12.9.0","date":"2019-08-20","lts":false,"security":false,"v8":"7.6.303.29"},{"name":"nodejs","version":"12.10.0","date":"2019-09-04","lts":false,"security":false,"v8":"7.6.303.29"},{"name":"nodejs","version":"12.11.0","date":"2019-09-25","lts":false,"security":false,"v8":"7.7.299.11"},{"name":"nodejs","version":"12.12.0","date":"2019-10-11","lts":false,"security":false,"v8":"7.7.299.13"},{"name":"nodejs","version":"12.13.0","date":"2019-10-21","lts":"Erbium","security":false,"v8":"7.7.299.13"},{"name":"nodejs","version":"12.14.0","date":"2019-12-17","lts":"Erbium","security":true,"v8":"7.7.299.13"},{"name":"nodejs","version":"12.15.0","date":"2020-02-05","lts":"Erbium","security":true,"v8":"7.7.299.13"},{"name":"nodejs","version":"12.16.0","date":"2020-02-11","lts":"Erbium","security":false,"v8":"7.8.279.23"},{"name":"nodejs","version":"12.17.0","date":"2020-05-26","lts":"Erbium","security":false,"v8":"7.8.279.23"},{"name":"nodejs","version":"12.18.0","date":"2020-06-02","lts":"Erbium","security":true,"v8":"7.8.279.23"},{"name":"nodejs","version":"12.19.0","date":"2020-10-06","lts":"Erbium","security":false,"v8":"7.8.279.23"},{"name":"nodejs","version":"12.20.0","date":"2020-11-24","lts":"Erbium","security":false,"v8":"7.8.279.23"},{"name":"nodejs","version":"12.21.0","date":"2021-02-23","lts":"Erbium","security":true,"v8":"7.8.279.23"},{"name":"nodejs","version":"12.22.0","date":"2021-03-30","lts":"Erbium","security":false,"v8":"7.8.279.23"},{"name":"nodejs","version":"13.0.0","date":"2019-10-22","lts":false,"security":false,"v8":"7.8.279.17"},{"name":"nodejs","version":"13.1.0","date":"2019-11-05","lts":false,"security":false,"v8":"7.8.279.17"},{"name":"nodejs","version":"13.2.0","date":"2019-11-21","lts":false,"security":false,"v8":"7.9.317.23"},{"name":"nodejs","version":"13.3.0","date":"2019-12-03","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.4.0","date":"2019-12-17","lts":false,"security":true,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.5.0","date":"2019-12-18","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.6.0","date":"2020-01-07","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.7.0","date":"2020-01-21","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.8.0","date":"2020-02-05","lts":false,"security":true,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.9.0","date":"2020-02-18","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.10.0","date":"2020-03-04","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.11.0","date":"2020-03-12","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.12.0","date":"2020-03-26","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.13.0","date":"2020-04-14","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"13.14.0","date":"2020-04-29","lts":false,"security":false,"v8":"7.9.317.25"},{"name":"nodejs","version":"14.0.0","date":"2020-04-21","lts":false,"security":false,"v8":"8.1.307.30"},{"name":"nodejs","version":"14.1.0","date":"2020-04-29","lts":false,"security":false,"v8":"8.1.307.31"},{"name":"nodejs","version":"14.2.0","date":"2020-05-05","lts":false,"security":false,"v8":"8.1.307.31"},{"name":"nodejs","version":"14.3.0","date":"2020-05-19","lts":false,"security":false,"v8":"8.1.307.31"},{"name":"nodejs","version":"14.4.0","date":"2020-06-02","lts":false,"security":true,"v8":"8.1.307.31"},{"name":"nodejs","version":"14.5.0","date":"2020-06-30","lts":false,"security":false,"v8":"8.3.110.9"},{"name":"nodejs","version":"14.6.0","date":"2020-07-20","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.7.0","date":"2020-07-29","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.8.0","date":"2020-08-11","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.9.0","date":"2020-08-27","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.10.0","date":"2020-09-08","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.11.0","date":"2020-09-15","lts":false,"security":true,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.12.0","date":"2020-09-22","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.13.0","date":"2020-09-29","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.14.0","date":"2020-10-15","lts":false,"security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.15.0","date":"2020-10-27","lts":"Fermium","security":false,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.16.0","date":"2021-02-23","lts":"Fermium","security":true,"v8":"8.4.371.19"},{"name":"nodejs","version":"14.17.0","date":"2021-05-11","lts":"Fermium","security":false,"v8":"8.4.371.23"},{"name":"nodejs","version":"14.18.0","date":"2021-09-28","lts":"Fermium","security":false,"v8":"8.4.371.23"},{"name":"nodejs","version":"14.19.0","date":"2022-02-01","lts":"Fermium","security":false,"v8":"8.4.371.23"},{"name":"nodejs","version":"14.20.0","date":"2022-07-07","lts":"Fermium","security":true,"v8":"8.4.371.23"},{"name":"nodejs","version":"14.21.0","date":"2022-11-01","lts":"Fermium","security":false,"v8":"8.4.371.23"},{"name":"nodejs","version":"15.0.0","date":"2020-10-20","lts":false,"security":false,"v8":"8.6.395.16"},{"name":"nodejs","version":"15.1.0","date":"2020-11-04","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.2.0","date":"2020-11-10","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.3.0","date":"2020-11-24","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.4.0","date":"2020-12-09","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.5.0","date":"2020-12-22","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.6.0","date":"2021-01-14","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.7.0","date":"2021-01-25","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.8.0","date":"2021-02-02","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.9.0","date":"2021-02-18","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.10.0","date":"2021-02-23","lts":false,"security":true,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.11.0","date":"2021-03-03","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.12.0","date":"2021-03-17","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.13.0","date":"2021-03-31","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"15.14.0","date":"2021-04-06","lts":false,"security":false,"v8":"8.6.395.17"},{"name":"nodejs","version":"16.0.0","date":"2021-04-20","lts":false,"security":false,"v8":"9.0.257.17"},{"name":"nodejs","version":"16.1.0","date":"2021-05-04","lts":false,"security":false,"v8":"9.0.257.24"},{"name":"nodejs","version":"16.2.0","date":"2021-05-19","lts":false,"security":false,"v8":"9.0.257.25"},{"name":"nodejs","version":"16.3.0","date":"2021-06-03","lts":false,"security":false,"v8":"9.0.257.25"},{"name":"nodejs","version":"16.4.0","date":"2021-06-23","lts":false,"security":false,"v8":"9.1.269.36"},{"name":"nodejs","version":"16.5.0","date":"2021-07-14","lts":false,"security":false,"v8":"9.1.269.38"},{"name":"nodejs","version":"16.6.0","date":"2021-07-29","lts":false,"security":true,"v8":"9.2.230.21"},{"name":"nodejs","version":"16.7.0","date":"2021-08-18","lts":false,"security":false,"v8":"9.2.230.21"},{"name":"nodejs","version":"16.8.0","date":"2021-08-25","lts":false,"security":false,"v8":"9.2.230.21"},{"name":"nodejs","version":"16.9.0","date":"2021-09-07","lts":false,"security":false,"v8":"9.3.345.16"},{"name":"nodejs","version":"16.10.0","date":"2021-09-22","lts":false,"security":false,"v8":"9.3.345.19"},{"name":"nodejs","version":"16.11.0","date":"2021-10-08","lts":false,"security":false,"v8":"9.4.146.19"},{"name":"nodejs","version":"16.12.0","date":"2021-10-20","lts":false,"security":false,"v8":"9.4.146.19"},{"name":"nodejs","version":"16.13.0","date":"2021-10-26","lts":"Gallium","security":false,"v8":"9.4.146.19"},{"name":"nodejs","version":"16.14.0","date":"2022-02-08","lts":"Gallium","security":false,"v8":"9.4.146.24"},{"name":"nodejs","version":"16.15.0","date":"2022-04-26","lts":"Gallium","security":false,"v8":"9.4.146.24"},{"name":"nodejs","version":"16.16.0","date":"2022-07-07","lts":"Gallium","security":true,"v8":"9.4.146.24"},{"name":"nodejs","version":"16.17.0","date":"2022-08-16","lts":"Gallium","security":false,"v8":"9.4.146.26"},{"name":"nodejs","version":"16.18.0","date":"2022-10-12","lts":"Gallium","security":false,"v8":"9.4.146.26"},{"name":"nodejs","version":"16.19.0","date":"2022-12-13","lts":"Gallium","security":false,"v8":"9.4.146.26"},{"name":"nodejs","version":"16.20.0","date":"2023-03-28","lts":"Gallium","security":false,"v8":"9.4.146.26"},{"name":"nodejs","version":"17.0.0","date":"2021-10-19","lts":false,"security":false,"v8":"9.5.172.21"},{"name":"nodejs","version":"17.1.0","date":"2021-11-09","lts":false,"security":false,"v8":"9.5.172.25"},{"name":"nodejs","version":"17.2.0","date":"2021-11-30","lts":false,"security":false,"v8":"9.6.180.14"},{"name":"nodejs","version":"17.3.0","date":"2021-12-17","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"17.4.0","date":"2022-01-18","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"17.5.0","date":"2022-02-10","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"17.6.0","date":"2022-02-22","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"17.7.0","date":"2022-03-09","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"17.8.0","date":"2022-03-22","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"17.9.0","date":"2022-04-07","lts":false,"security":false,"v8":"9.6.180.15"},{"name":"nodejs","version":"18.0.0","date":"2022-04-18","lts":false,"security":false,"v8":"10.1.124.8"},{"name":"nodejs","version":"18.1.0","date":"2022-05-03","lts":false,"security":false,"v8":"10.1.124.8"},{"name":"nodejs","version":"18.2.0","date":"2022-05-17","lts":false,"security":false,"v8":"10.1.124.8"},{"name":"nodejs","version":"18.3.0","date":"2022-06-02","lts":false,"security":false,"v8":"10.2.154.4"},{"name":"nodejs","version":"18.4.0","date":"2022-06-16","lts":false,"security":false,"v8":"10.2.154.4"},{"name":"nodejs","version":"18.5.0","date":"2022-07-06","lts":false,"security":true,"v8":"10.2.154.4"},{"name":"nodejs","version":"18.6.0","date":"2022-07-13","lts":false,"security":false,"v8":"10.2.154.13"},{"name":"nodejs","version":"18.7.0","date":"2022-07-26","lts":false,"security":false,"v8":"10.2.154.13"},{"name":"nodejs","version":"18.8.0","date":"2022-08-24","lts":false,"security":false,"v8":"10.2.154.13"},{"name":"nodejs","version":"18.9.0","date":"2022-09-07","lts":false,"security":false,"v8":"10.2.154.15"},{"name":"nodejs","version":"18.10.0","date":"2022-09-28","lts":false,"security":false,"v8":"10.2.154.15"},{"name":"nodejs","version":"18.11.0","date":"2022-10-13","lts":false,"security":false,"v8":"10.2.154.15"},{"name":"nodejs","version":"18.12.0","date":"2022-10-25","lts":"Hydrogen","security":false,"v8":"10.2.154.15"},{"name":"nodejs","version":"18.13.0","date":"2023-01-05","lts":"Hydrogen","security":false,"v8":"10.2.154.23"},{"name":"nodejs","version":"18.14.0","date":"2023-02-01","lts":"Hydrogen","security":false,"v8":"10.2.154.23"},{"name":"nodejs","version":"18.15.0","date":"2023-03-05","lts":"Hydrogen","security":false,"v8":"10.2.154.26"},{"name":"nodejs","version":"18.16.0","date":"2023-04-12","lts":"Hydrogen","security":false,"v8":"10.2.154.26"},{"name":"nodejs","version":"18.17.0","date":"2023-07-18","lts":"Hydrogen","security":false,"v8":"10.2.154.26"},{"name":"nodejs","version":"18.18.0","date":"2023-09-18","lts":"Hydrogen","security":false,"v8":"10.2.154.26"},{"name":"nodejs","version":"18.19.0","date":"2023-11-29","lts":"Hydrogen","security":false,"v8":"10.2.154.26"},{"name":"nodejs","version":"18.20.0","date":"2024-03-26","lts":"Hydrogen","security":false,"v8":"10.2.154.26"},{"name":"nodejs","version":"19.0.0","date":"2022-10-17","lts":false,"security":false,"v8":"10.7.193.13"},{"name":"nodejs","version":"19.1.0","date":"2022-11-14","lts":false,"security":false,"v8":"10.7.193.20"},{"name":"nodejs","version":"19.2.0","date":"2022-11-29","lts":false,"security":false,"v8":"10.8.168.20"},{"name":"nodejs","version":"19.3.0","date":"2022-12-14","lts":false,"security":false,"v8":"10.8.168.21"},{"name":"nodejs","version":"19.4.0","date":"2023-01-05","lts":false,"security":false,"v8":"10.8.168.25"},{"name":"nodejs","version":"19.5.0","date":"2023-01-24","lts":false,"security":false,"v8":"10.8.168.25"},{"name":"nodejs","version":"19.6.0","date":"2023-02-01","lts":false,"security":false,"v8":"10.8.168.25"},{"name":"nodejs","version":"19.7.0","date":"2023-02-21","lts":false,"security":false,"v8":"10.8.168.25"},{"name":"nodejs","version":"19.8.0","date":"2023-03-14","lts":false,"security":false,"v8":"10.8.168.25"},{"name":"nodejs","version":"19.9.0","date":"2023-04-10","lts":false,"security":false,"v8":"10.8.168.25"},{"name":"nodejs","version":"20.0.0","date":"2023-04-17","lts":false,"security":false,"v8":"11.3.244.4"},{"name":"nodejs","version":"20.1.0","date":"2023-05-03","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.2.0","date":"2023-05-16","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.3.0","date":"2023-06-08","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.4.0","date":"2023-07-04","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.5.0","date":"2023-07-19","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.6.0","date":"2023-08-23","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.7.0","date":"2023-09-18","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.8.0","date":"2023-09-28","lts":false,"security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.9.0","date":"2023-10-24","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.10.0","date":"2023-11-22","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.11.0","date":"2024-01-09","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.12.0","date":"2024-03-26","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.13.0","date":"2024-05-07","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.14.0","date":"2024-05-28","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"20.15.0","date":"2024-06-20","lts":"Iron","security":false,"v8":"11.3.244.8"},{"name":"nodejs","version":"21.0.0","date":"2023-10-17","lts":false,"security":false,"v8":"11.8.172.13"},{"name":"nodejs","version":"21.1.0","date":"2023-10-24","lts":false,"security":false,"v8":"11.8.172.15"},{"name":"nodejs","version":"21.2.0","date":"2023-11-14","lts":false,"security":false,"v8":"11.8.172.17"},{"name":"nodejs","version":"21.3.0","date":"2023-11-30","lts":false,"security":false,"v8":"11.8.172.17"},{"name":"nodejs","version":"21.4.0","date":"2023-12-05","lts":false,"security":false,"v8":"11.8.172.17"},{"name":"nodejs","version":"21.5.0","date":"2023-12-19","lts":false,"security":false,"v8":"11.8.172.17"},{"name":"nodejs","version":"21.6.0","date":"2024-01-14","lts":false,"security":false,"v8":"11.8.172.17"},{"name":"nodejs","version":"21.7.0","date":"2024-03-06","lts":false,"security":false,"v8":"11.8.172.17"},{"name":"nodejs","version":"22.0.0","date":"2024-04-24","lts":false,"security":false,"v8":"12.4.254.14"},{"name":"nodejs","version":"22.1.0","date":"2024-05-02","lts":false,"security":false,"v8":"12.4.254.14"},{"name":"nodejs","version":"22.2.0","date":"2024-05-15","lts":false,"security":false,"v8":"12.4.254.14"},{"name":"nodejs","version":"22.3.0","date":"2024-06-11","lts":false,"security":false,"v8":"12.4.254.20"},{"name":"nodejs","version":"22.4.0","date":"2024-07-02","lts":false,"security":false,"v8":"12.4.254.21"},{"name":"nodejs","version":"22.5.0","date":"2024-07-17","lts":false,"security":false,"v8":"12.4.254.21"}]');

/***/ }),

/***/ "./node_modules/node-releases/data/release-schedule/release-schedule.json":
/*!********************************************************************************!*\
  !*** ./node_modules/node-releases/data/release-schedule/release-schedule.json ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"v0.8":{"start":"2012-06-25","end":"2014-07-31"},"v0.10":{"start":"2013-03-11","end":"2016-10-31"},"v0.12":{"start":"2015-02-06","end":"2016-12-31"},"v4":{"start":"2015-09-08","lts":"2015-10-12","maintenance":"2017-04-01","end":"2018-04-30","codename":"Argon"},"v5":{"start":"2015-10-29","maintenance":"2016-04-30","end":"2016-06-30"},"v6":{"start":"2016-04-26","lts":"2016-10-18","maintenance":"2018-04-30","end":"2019-04-30","codename":"Boron"},"v7":{"start":"2016-10-25","maintenance":"2017-04-30","end":"2017-06-30"},"v8":{"start":"2017-05-30","lts":"2017-10-31","maintenance":"2019-01-01","end":"2019-12-31","codename":"Carbon"},"v9":{"start":"2017-10-01","maintenance":"2018-04-01","end":"2018-06-30"},"v10":{"start":"2018-04-24","lts":"2018-10-30","maintenance":"2020-05-19","end":"2021-04-30","codename":"Dubnium"},"v11":{"start":"2018-10-23","maintenance":"2019-04-22","end":"2019-06-01"},"v12":{"start":"2019-04-23","lts":"2019-10-21","maintenance":"2020-11-30","end":"2022-04-30","codename":"Erbium"},"v13":{"start":"2019-10-22","maintenance":"2020-04-01","end":"2020-06-01"},"v14":{"start":"2020-04-21","lts":"2020-10-27","maintenance":"2021-10-19","end":"2023-04-30","codename":"Fermium"},"v15":{"start":"2020-10-20","maintenance":"2021-04-01","end":"2021-06-01"},"v16":{"start":"2021-04-20","lts":"2021-10-26","maintenance":"2022-10-18","end":"2023-09-11","codename":"Gallium"},"v17":{"start":"2021-10-19","maintenance":"2022-04-01","end":"2022-06-01"},"v18":{"start":"2022-04-19","lts":"2022-10-25","maintenance":"2023-10-18","end":"2025-04-30","codename":"Hydrogen"},"v19":{"start":"2022-10-18","maintenance":"2023-04-01","end":"2023-06-01"},"v20":{"start":"2023-04-18","lts":"2023-10-24","maintenance":"2024-10-22","end":"2026-04-30","codename":"Iron"},"v21":{"start":"2023-10-17","maintenance":"2024-04-01","end":"2024-06-01"},"v22":{"start":"2024-04-24","lts":"2024-10-29","maintenance":"2025-10-21","end":"2027-04-30","codename":""},"v23":{"start":"2024-10-15","maintenance":"2025-04-01","end":"2025-06-01"},"v24":{"start":"2025-04-22","lts":"2025-10-28","maintenance":"2026-10-20","end":"2028-04-30","codename":""}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   VGFormSender: () => (/* reexport safe */ _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   VGNav: () => (/* reexport safe */ _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_modules_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   VgModal: () => (/* reexport safe */ _app_modules_modal_js_vgmodal__WEBPACK_IMPORTED_MODULE_6__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/_utils/scss/default.scss */ "./app/_utils/scss/default.scss");
/* harmony import */ var _app_modules_sidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/modules/sidebar/scss/vgsidebar.scss */ "./app/modules/sidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_modules_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/modules/sidebar/js/vgsidebar */ "./app/modules/sidebar/js/vgsidebar.js");
/* harmony import */ var _app_modules_dropdown_scss_vgdropdown_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/modules/dropdown/scss/vgdropdown.scss */ "./app/modules/dropdown/scss/vgdropdown.scss");
/* harmony import */ var _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/modules/dropdown/js/vgdropdown */ "./app/modules/dropdown/js/vgdropdown.js");
/* harmony import */ var _app_modules_modal_scss_vgmodal_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app/modules/modal/scss/vgmodal.scss */ "./app/modules/modal/scss/vgmodal.scss");
/* harmony import */ var _app_modules_modal_js_vgmodal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app/modules/modal/js/vgmodal */ "./app/modules/modal/js/vgmodal.js");
/* harmony import */ var _app_modules_vgnav_scss_vgnav_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app/modules/vgnav/scss/vgnav.scss */ "./app/modules/vgnav/scss/vgnav.scss");
/* harmony import */ var _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app/modules/vgnav/js/vgnav */ "./app/modules/vgnav/js/vgnav.js");
/* harmony import */ var _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app/modules/vgformsender/js/vgformsender */ "./app/modules/vgformsender/js/vgformsender.js");
// css классы по умолчанию


// vgsidebar



// dropdown



// modal



// nav



// form sender

function onReady() {
  [...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (element) {
    _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"].init(element, {});
  });
  [...document.querySelectorAll('.vg-nav')].forEach(function (element) {
    _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_8__["default"].init(element, {});
  });
  [...document.querySelectorAll('[data-vgformsender]')].forEach(function (element) {
    _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_9__["default"].init(element, {});
  });
}
document.addEventListener('DOMContentLoaded', onReady);

})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBa0RBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxVUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdPQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0lBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7OztBQ3JmQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTs7Ozs7Ozs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFNQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7QUMvckNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7QUM3RUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUNBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzlDQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM1S0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBOzs7Ozs7Ozs7O0FDN1VBO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUdBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUlBO0FBQ0E7O0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBR0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUdBO0FBQ0E7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBT0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTs7QUFLQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFHQTtBQUNBO0FBR0E7QUFJQTtBQUtBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFHQTs7Ozs7Ozs7Ozs7QUMxbURBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1BBOztBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6YUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeUJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWNBO0FBSUE7QUFNQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFNQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFNQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUVBO0FBSUE7QUFLQTtBQUlBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBS0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RlQTtBQUNBO0FBK0JBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBR0E7QUFFQTtBQUlBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF3SUE7QUEwQkE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUtBO0FBQ0E7QUFNQTtBQUVBO0FBS0E7QUFFQTtBQU9BO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUdBO0FBQ0E7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFNQTtBQUVBO0FBQ0E7QUFFQTtBQUtBO0FBUUE7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3plQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0VBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNpQ0E7QUFFQTtBQUlBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFFQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBU0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1S0E7QUFDQTtBQUNBO0FBT0E7QUFLQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUVBO0FBR0E7QUFNQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBRUE7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQVNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBUUE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFHQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFlQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFNQTtBQUNBO0FBS0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBRUE7QUFJQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBR0E7QUFHQTtBQUVBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBRUE7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckZBO0FBQUE7QUFBQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVdBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FML0NBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FNREE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvYmFja2Ryb3AuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2RhdGEuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2V2ZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL21hbmlwdWxhdG9yLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9tb2R1bGUtZm4uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL292ZXJmbG93LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9wYXJhbXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3BsYWNlbWVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvcmVzcG9uc2l2ZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvc2VsZWN0b3JzLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvYmFzZS1tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9kcm9wZG93bi9qcy92Z2Ryb3Bkb3duLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvbW9kYWwvanMvdmdtb2RhbC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3NpZGViYXIvanMvdmdzaWRlYmFyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2LmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJzbGlzdC9icm93c2VyLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJzbGlzdC9lcnJvci5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9icm93c2Vyc2xpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvYnJvd3NlcnNsaXN0L3BhcnNlLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Nhbml1c2UtbGl0ZS9kYXRhL2FnZW50cy5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9jYW5pdXNlLWxpdGUvZGF0YS9icm93c2VyVmVyc2lvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvY2FuaXVzZS1saXRlL2RhdGEvYnJvd3NlcnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvY2FuaXVzZS1saXRlL2Rpc3QvdW5wYWNrZXIvYWdlbnRzLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Nhbml1c2UtbGl0ZS9kaXN0L3VucGFja2VyL2Jyb3dzZXJWZXJzaW9ucy5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9jYW5pdXNlLWxpdGUvZGlzdC91bnBhY2tlci9icm93c2Vycy5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi10by1jaHJvbWl1bS92ZXJzaW9ucy5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9scnUtY2FjaGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvc2VtdmVyL3NlbXZlci5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy95YWxsaXN0L2l0ZXJhdG9yLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL3lhbGxpc3QveWFsbGlzdC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3M/MjJmYSIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzPzIxN2MiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9tb2RhbC9zY3NzL3ZnbW9kYWwuc2Nzcz80NmIyIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzP2U0OGIiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3M/MTliYyIsIndlYnBhY2s6Ly92Zy9pZ25vcmVkfEQ6XFxPU1BhbmVsXFxob21lXFxwbHVnaW5zXFx2ZWdhcy1hcHBcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcnNsaXN0fHBhdGgiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvQGJhYmVsL2NvbXBhdC1kYXRhL25hdGl2ZS1tb2R1bGVzLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9jb21wYXQtZGF0YS9wbHVnaW5zLmpzIiwid2VicGFjazovL3ZnLy4uLy4uLy4uL3NyYy9jb25maWcvdmFsaWRhdGlvbi9vcHRpb24tYXNzZXJ0aW9ucy50cyIsIndlYnBhY2s6Ly92Zy8uLi8uLi8uLi9zcmMvY29uZmlnL3ZhbGlkYXRpb24vb3B0aW9ucy50cyIsIndlYnBhY2s6Ly92Zy8uLi8uLi8uLi9zcmMvY29uZmlnL3ZhbGlkYXRpb24vcmVtb3ZlZC50cyIsIndlYnBhY2s6Ly92Zy8uLi8uLi9zcmMvZXJyb3JzL2NvbmZpZy1lcnJvci50cyIsIndlYnBhY2s6Ly92Zy8uLi8uLi9zcmMvZXJyb3JzL3Jld3JpdGUtc3RhY2stdHJhY2UudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL2RlYnVnLnRzIiwid2VicGFjazovL3ZnLy4uL3NyYy9maWx0ZXItaXRlbXMudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3ZnLy4uL3NyYy9vcHRpb25zLnRzIiwid2VicGFjazovL3ZnLy4uL3NyYy9wcmV0dHkudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL3RhcmdldHMudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL3ZnLy4uL3NyYy9maW5kLXN1Z2dlc3Rpb24udHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL3ZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZnLy4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleGVjdXRlfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4vb3ZlcmZsb3dcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSAnYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUUgPSAndmctYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xyXG5jb25zdCBFVkVOVF9NT1VTRURPV04gPSBgbW91c2Vkb3duLnZnLiR7TkFNRX1gXHJcblxyXG5jbGFzcyBCYWNrZHJvcCB7XHJcblx0c3RhdGljIHNob3coY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9hcHBlbmQoKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZShjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2Rlc3Ryb3koKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9hcHBlbmQoKSB7XHJcblx0XHRpZiAoU2VsZWN0b3JzLmZpbmRPbmUoJy4nICsgQ0xBU1NfTkFNRSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChiYWNrZHJvcCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdFx0fSwgNTApO1xyXG5cclxuXHRcdEV2ZW50SGFuZGxlci5vbihiYWNrZHJvcCwgRVZFTlRfTU9VU0VET1dOLCAoKSA9PiB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoKVxyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfZGVzdHJveSgpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmRPbmUoJy4nICsgQ0xBU1NfTkFNRSk7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdH0sIDUwMCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWNrZHJvcDsiLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGRhdGEuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDRgNCw0LHQvtGC0LDQtdGCINGBINC60L7Qu9C70LXQutGG0LjQtdC5INC80L7QtNGD0LvQtdC5LiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9tYXAtc2V0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IGVsZW1lbnRNYXAgPSBuZXcgTWFwKClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRzZXQoZWxlbWVudCwga2V5LCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRlbGVtZW50TWFwLnNldChlbGVtZW50LCBuZXcgTWFwKCkpXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cdFx0aWYgKCFpbnN0YW5jZU1hcC5oYXMoa2V5KSAmJiBpbnN0YW5jZU1hcC5zaXplICE9PSAwKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFZHQXBwINC90LUg0LTQvtC/0YPRgdC60LDQtdGCINCx0L7Qu9C10LUg0L7QtNC90L7Qs9C+INGN0LrQt9C10LzQv9C70Y/RgNCwINC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwLiDQodCy0Y/Qt9Cw0L3QvdGL0Lkg0Y3QutC30LXQvNC/0LvRj9GAOiAke0FycmF5LmZyb20oaW5zdGFuY2VNYXAua2V5cygpKVswXX0uYClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuc2V0KGtleSwgaW5zdGFuY2UpXHJcblx0fSxcclxuXHJcblx0Z2V0KGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKGVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50TWFwLmdldChlbGVtZW50KS5nZXQoa2V5KSB8fCBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHJcblx0XHRpbnN0YW5jZU1hcC5kZWxldGUoa2V5KTtcclxuXHJcblx0XHRpZiAoaW5zdGFuY2VNYXAuc2l6ZSA9PT0gMCkge1xyXG5cdFx0XHRlbGVtZW50TWFwLmRlbGV0ZShlbGVtZW50KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGV2ZW50LmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiDQodC60YDQuNC/0YIg0LTQu9GPINC/0YDQvtGB0LvRg9GI0LjQstCw0L3QuNGPINGB0L7QsdGL0YLQuNGPXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IG5hbWVzcGFjZVJlZ2V4ID0gL1teLl0qKD89XFwuLiopXFwufC4qL1xyXG5jb25zdCBzdHJpcE5hbWVSZWdleCA9IC9cXC4uKi9cclxuY29uc3Qgc3RyaXBVaWRSZWdleCA9IC86OlxcZCskL1xyXG5jb25zdCBldmVudFJlZ2lzdHJ5ID0ge30gLy8gRXZlbnRzIHN0b3JhZ2VcclxubGV0IHVpZEV2ZW50ID0gMVxyXG5jb25zdCBjdXN0b21FdmVudHMgPSB7XHJcblx0bW91c2VlbnRlcjogJ21vdXNlb3ZlcicsXHJcblx0bW91c2VsZWF2ZTogJ21vdXNlb3V0J1xyXG59XHJcblxyXG5jb25zdCBuYXRpdmVFdmVudHMgPSBuZXcgU2V0KFtcclxuXHQnY2xpY2snLFxyXG5cdCdkYmxjbGljaycsXHJcblx0J21vdXNldXAnLFxyXG5cdCdtb3VzZWRvd24nLFxyXG5cdCdjb250ZXh0bWVudScsXHJcblx0J21vdXNld2hlZWwnLFxyXG5cdCdET01Nb3VzZVNjcm9sbCcsXHJcblx0J21vdXNlb3ZlcicsXHJcblx0J21vdXNlb3V0JyxcclxuXHQnbW91c2Vtb3ZlJyxcclxuXHQnc2VsZWN0c3RhcnQnLFxyXG5cdCdzZWxlY3RlbmQnLFxyXG5cdCdzdWJtaXQnLFxyXG5cdCdrZXlkb3duJyxcclxuXHQna2V5cHJlc3MnLFxyXG5cdCdrZXl1cCcsXHJcblx0J29yaWVudGF0aW9uY2hhbmdlJyxcclxuXHQndG91Y2hzdGFydCcsXHJcblx0J3RvdWNobW92ZScsXHJcblx0J3RvdWNoZW5kJyxcclxuXHQndG91Y2hjYW5jZWwnLFxyXG5cdCdwb2ludGVyZG93bicsXHJcblx0J3BvaW50ZXJtb3ZlJyxcclxuXHQncG9pbnRlcnVwJyxcclxuXHQncG9pbnRlcmxlYXZlJyxcclxuXHQncG9pbnRlcmNhbmNlbCcsXHJcblx0J2dlc3R1cmVzdGFydCcsXHJcblx0J2dlc3R1cmVjaGFuZ2UnLFxyXG5cdCdnZXN0dXJlZW5kJyxcclxuXHQnZm9jdXMnLFxyXG5cdCdibHVyJyxcclxuXHQnY2hhbmdlJyxcclxuXHQncmVzZXQnLFxyXG5cdCdzZWxlY3QnLFxyXG5cdCdzdWJtaXQnLFxyXG5cdCdmb2N1c2luJyxcclxuXHQnZm9jdXNvdXQnLFxyXG5cdCdsb2FkJyxcclxuXHQndW5sb2FkJyxcclxuXHQnYmVmb3JldW5sb2FkJyxcclxuXHQncmVzaXplJyxcclxuXHQnbW92ZScsXHJcblx0J0RPTUNvbnRlbnRMb2FkZWQnLFxyXG5cdCdyZWFkeXN0YXRlY2hhbmdlJyxcclxuXHQnZXJyb3InLFxyXG5cdCdhYm9ydCcsXHJcblx0J3Njcm9sbCdcclxuXSlcclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstCw0YLQvdGL0LUg0LzQtdGC0L7QtNGLXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xyXG5cdHJldHVybiAodWlkICYmIGAke3VpZH06OiR7dWlkRXZlbnQrK31gKSB8fCBlbGVtZW50LnVpZEV2ZW50IHx8IHVpZEV2ZW50KytcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KSB7XHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGVsZW1lbnQpXHJcblxyXG5cdGVsZW1lbnQudWlkRXZlbnQgPSB1aWRcclxuXHRldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cclxuXHJcblx0cmV0dXJuIGV2ZW50UmVnaXN0cnlbdWlkXVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcclxuXHJcblx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIHNlbGVjdG9yLCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcclxuXHJcblx0XHRmb3IgKGxldCB7IHRhcmdldCB9ID0gZXZlbnQ7IHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xyXG5cdFx0XHRcdGlmIChkb21FbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiB0YXJnZXQgfSlcclxuXHJcblx0XHRcdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0YXJnZXQsIFtldmVudF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRIYW5kbGVyKGV2ZW50cywgY2FsbGFibGUsIGRlbGVnYXRpb25TZWxlY3RvciA9IG51bGwpIHtcclxuXHRyZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXHJcblx0XHQuZmluZChldmVudCA9PiBldmVudC5jYWxsYWJsZSA9PT0gY2FsbGFibGUgJiYgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yID09PSBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdGNvbnN0IGlzRGVsZWdhdGVkID0gdHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnXHJcblx0Ly8gVE9ETzog0LLRi9C00LDQtdGCIFwiZmFsc2VcIiDQstC80LXRgdGC0L4g0YHQtdC70LXQutGC0L7RgNCwLCDQv9C+0Y3RgtC+0LzRgyDQvdGD0LbQvdC+INC/0YDQvtCy0LXRgNC40YLRjC4gYm9vdFxyXG5cdGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0bGV0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChvcmlnaW5hbFR5cGVFdmVudClcclxuXHJcblx0aWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcclxuXHRcdHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIG9uZU9mZikge1xyXG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cclxuXHQvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXHJcblx0Ly8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXHJcblx0aWYgKG9yaWdpbmFsVHlwZUV2ZW50IGluIGN1c3RvbUV2ZW50cykge1xyXG5cdFx0Y29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYWJsZSA9IHdyYXBGdW5jdGlvbihjYWxsYWJsZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxyXG5cdGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblxyXG5cdGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XHJcblx0XHRwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxyXG5cclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXHJcblx0Y29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XHJcblx0XHRib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjYWxsYWJsZSkgOlxyXG5cdFx0Ym9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcclxuXHJcblx0Zm4uZGVsZWdhdGlvblNlbGVjdG9yID0gaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbFxyXG5cdGZuLmNhbGxhYmxlID0gY2FsbGFibGVcclxuXHRmbi5vbmVPZmYgPSBvbmVPZmZcclxuXHRmbi51aWRFdmVudCA9IHVpZFxyXG5cdGhhbmRsZXJzW3VpZF0gPSBmblxyXG5cclxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgaXNEZWxlZ2F0ZWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3Rvcikge1xyXG5cdGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcclxuXHJcblx0aWYgKCFmbikge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxyXG5cdGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcclxuXHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblxyXG5cdGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR5cGVFdmVudChldmVudCkge1xyXG5cdC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcclxuXHRldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxyXG5cdHJldHVybiBjdXN0b21FdmVudHNbZXZlbnRdIHx8IGV2ZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcclxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhtZXRhKSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0b2JqW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb2JqXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjRj1xyXG4gKiBAdHlwZSB7e29uZSgqLCAqLCAqLCAqKTogdm9pZCwgdHJpZ2dlcigqLCAqLCAqKTogKG51bGx8KiksIG9mZigqLCAqLCAqLCAqKTogdm9pZCwgb24oKiwgKiwgKiwgKik6IHZvaWR9fVxyXG4gKi9cclxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtGB0LvRg9GI0LjQstCw0YLQtdC70Ywg0YHQvtCx0YvRgtC40LkgKNGN0LvQtdC80LXQvdGCLCDRgdC+0LHRi9GC0LjQtSAo0L/QvtC70L3Ri9C5INGB0L/QuNGB0L7QuiDRgdC80L7RgtGA0Lgg0LIg0LrQvtC90YHRgtCw0L3RgtC1IG5hdGl2ZUV2ZW50cywg0LjRgdGC0L7Rh9C90LjQuiDRgdC+0LHRi9GC0LjRjyDQuNC70Lgg0YXQtdC90LTQu9C10YAsINGE0YPQvdC60YbQuNGPINC+0LHRgNCw0YLQvdC+0LPQviDQstGL0LfQvtCy0LApKVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b24oZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBmYWxzZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5LCDQvdC+INC30LDQvNGL0LrQsNC10YLRgdGPINC4INCx0L7Qu9GM0YjQtSDQvdC1INC/0L7QstGC0L7RgNGP0LXRgtGB0Y8g0L3QsCDRjdC70LXQvNC10L3RgtC1XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvbmUoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCB0cnVlKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCj0LTQsNC70LXQvdC40LUg0L7QsdGA0LDQsdC+0YLRh9C40LrQsFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b2ZmKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0XHRjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHRcdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRcdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHRcdGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly8gU2ltcGxlc3QgY2FzZTogaGFuZGxlciBpcyBwYXNzZWQsIHJlbW92ZSB0aGF0IGxpc3RlbmVyIE9OTFkuXHJcblx0XHRcdGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFtZXNwYWNlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcclxuXHRcdFx0XHRyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBba2V5SGFuZGxlcnMsIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdFx0Y29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXHJcblxyXG5cdFx0XHRpZiAoIWluTmFtZXNwYWNlIHx8IG9yaWdpbmFsVHlwZUV2ZW50LmluY2x1ZGVzKGhhbmRsZXJLZXkpKSB7XHJcblx0XHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGB0L7QsdGL0YLQuNGPLiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9kaXNwYXRjaC1ldmVudHNcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBhcmdzXHJcblx0ICogQHJldHVybnMgeyp8bnVsbH1cclxuXHQgKi9cclxuXHR0cmlnZ2VyKGVsZW1lbnQsIGV2ZW50LCBhcmdzKSB7XHJcblx0XHRpZiAodHlwZW9mIGV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBidWJibGVzID0gdHJ1ZTtcclxuXHRcdGxldCBuYXRpdmVEaXNwYXRjaCA9IHRydWU7XHJcblx0XHRsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0IGV2dCA9IGh5ZHJhdGVPYmoobmV3IEV2ZW50KGV2ZW50LCB7IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUgfSksIGFyZ3MpXHJcblxyXG5cdFx0aWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmF0aXZlRGlzcGF0Y2gpIHtcclxuXHRcdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZXZ0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXJcclxuIiwiLyoqXHJcbiAqINCd0LDQsdC+0YAg0YHQutGA0LjQv9GC0L7QsiDQtNC70Y8g0YjQuNGA0L7QutC+0LPQviDQv9GA0LjQvNC10L3QtdC90LjRj1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQldGB0LvQuCDRh9GC0L4t0L3QuNCx0YPQtNGMINCyINC+0LHRitC10LrRgtC1XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xyXG5cdGZvciAobGV0IHByb3AgaW4gb2JqKSB7XHJcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRWxlbWVudFxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gb2JqZWN0ID0+IHtcclxuXHRpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHR5cGVvZiBvYmplY3Qubm9kZVR5cGUgIT09ICd1bmRlZmluZWQnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0Rpc2FibGVkXHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmRpc2FibGVkXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09ICdmYWxzZSdcclxufVxyXG5cclxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtZW50KSB7XHJcblx0aWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRjb25zdCBlbGVtZW50SXNWaXNpYmxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xyXG5cdGNvbnN0IGNsb3NlZERldGFpbHMgPSBlbGVtZW50LmNsb3Nlc3QoJ2RldGFpbHM6bm90KFtvcGVuXSknKVxyXG5cclxuXHRpZiAoIWNsb3NlZERldGFpbHMpIHtcclxuXHRcdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcblx0fVxyXG5cclxuXHRpZiAoY2xvc2VkRGV0YWlscyAhPT0gZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXHJcblx0XHRpZiAoc3VtbWFyeSAmJiBzdW1tYXJ5LnBhcmVudE5vZGUgIT09IGNsb3NlZERldGFpbHMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN1bW1hcnkgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG59XHJcblxyXG4vKipcclxuICogaXNPYmplY3RcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG5cdHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0L7QtNC40Lwg0LIg0L/QvtGA0Y/QtNC+0Log0YLQuNC/0Ysg0LTQsNC90L3Ri9GFXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkgIHtcclxuXHRpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xyXG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdH0gY2F0Y2gge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YLRiyDRgSDQvNCw0YHRgdC40LLQsFxyXG4gKiBAcGFyYW0gYXJyXHJcbiAqIEBwYXJhbSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudEFycmF5KGFyciwgZWwpIHtcclxuXHRyZXR1cm4gYXJyLmZpbHRlcigoaXRlbSkgPT4gIWVsLmluY2x1ZGVzKGl0ZW0pKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCT0LvRg9Cx0L7QutC+0LUg0L7QsdGK0LXQtNC40L3QtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyXHJcbiAqIEBwYXJhbSBvYmplY3RzXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VEZWVwT2JqZWN0KC4uLm9iamVjdHMpIHtcclxuXHRjb25zdCBpc09iamVjdCA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcblxyXG5cdHJldHVybiBvYmplY3RzLnJlZHVjZSgocHJldiwgb2JqKSA9PiB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0Y29uc3QgcFZhbCA9IHByZXZba2V5XTtcclxuXHRcdFx0Y29uc3Qgb1ZhbCA9IG9ialtrZXldO1xyXG5cclxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocFZhbCkgJiYgQXJyYXkuaXNBcnJheShvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IHBWYWwuY29uY2F0KC4uLm9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGlzT2JqZWN0KHBWYWwpICYmIGlzT2JqZWN0KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gbWVyZ2VEZWVwT2JqZWN0KHBWYWwsIG9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG9WYWw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwcmV2O1xyXG5cdH0sIHt9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrXHJcbiAqIEBwYXJhbSBwb3NzaWJsZUNhbGxiYWNrXHJcbiAqIEBwYXJhbSBhcmdzXHJcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWVcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBleGVjdXRlKHBvc3NpYmxlQ2FsbGJhY2ssIGFyZ3MgPSBbXSwgZGVmYXVsdFZhbHVlID0gcG9zc2libGVDYWxsYmFjaykge1xyXG5cdHJldHVybiB0eXBlb2YgcG9zc2libGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IHBvc3NpYmxlQ2FsbGJhY2soLi4uYXJncykgOiBkZWZhdWx0VmFsdWVcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zaXRpb25cclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uRWxlbWVudFxyXG4gKiBAcGFyYW0gd2FpdEZvclRyYW5zaXRpb25cclxuICovXHJcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnO1xyXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDA7XHJcblxyXG5mdW5jdGlvbiBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uIChjYWxsYmFjaywgdHJhbnNpdGlvbkVsZW1lbnQsIHdhaXRGb3JUcmFuc2l0aW9uID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0aWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxyXG5cdGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSB0aW1lT3V0TXMgPyB0aW1lT3V0TXMgOiBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmc7XHJcblxyXG5cdGxldCBjYWxsZWQgPSBmYWxzZVxyXG5cclxuXHRjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcclxuXHRcdGlmICh0YXJnZXQgIT09IHRyYW5zaXRpb25FbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxlZCA9IHRydWVcclxuXHRcdHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdH1cclxuXHJcblx0dHJhbnNpdGlvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdGlmICghY2FsbGVkKSB7XHJcblx0XHRcdHRyaWdnZXJUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25FbGVtZW50KVxyXG5cdFx0fVxyXG5cdH0sIGVtdWxhdGVkRHVyYXRpb24pXHJcbn1cclxuXHJcbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcclxuXHRsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXHJcblxyXG5cdC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcclxuXHRpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcclxuXHR0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxyXG5cdHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXHJcblxyXG5cdHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcclxufVxyXG5cclxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcclxuXHRlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbmV4cG9ydCB7aXNFbGVtZW50LCBpc1Zpc2libGUsIGlzRGlzYWJsZWQsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YSwgZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgbm9vcH0iLCJpbXBvcnQge2lzRWxlbWVudCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDQsNGC0YDQuNCx0YPRgtCw0LzQuCDRgyDRjdC70LXQvNC10L3RgtCwOlxyXG4gKiBnZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINGE0LvQsNCzIC0g0LLRi9GA0LXQt9Cw0YLRjCBkYXRhLSkgLSDQvNC10YLQvtC0INCy0YvQsdC40YDQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQsNGC0YDQuNCx0YPRgtCwINC/0L4g0LXQs9C+INC40LzQtdC90LgsINC10YHQu9C4INCyINC/0L7Qu9C1INC40LzQtdC90Lgg0L/QtdGA0LXQtNCw0YLRjCAnZGF0YScgLT4g0LHRg9C00YPRgiDQstGL0LHRgNCw0L3RiyDRgtC+0LvRjNC60L4g0LTQsNGC0LAg0LDRgtGA0LjQsdGD0YLRiywg0LXRgdC70LggJ2FsbCcgLT4g0LzQtdGC0L7QtCDQstC10YDQvdC10YIg0LfQvdCw0YfQtdC90LjQtSDQstGB0LXRhSDQsNGC0YDQuNCx0YPRgtC+0LJcclxuICogaGFzICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPKSAtINC10YHRgtGMINC70Lgg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKiBzZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINC30L3QsNGH0LXQvdC40LUpIC0g0YPRgdGC0LDQvdC+0LLQutCwINGDINGN0LvQtdC80LXQvdGC0LAg0LDRgtGA0LjQsdGD0YLQsCDQuNC70Lgg0LXQs9C+INC40LfQvNC10L3QtdC90LjQtVxyXG4gKiByZW1vdmUgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0YPQtNCw0LvRj9C10YIg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0KGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUgPSAnZGF0YScsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdkYXRhJykge1xyXG5cdFx0XHRsZXQgZWxtQmFzZSA9IFsnZGF0YS12Zy10b2dnbGUnLCAnZGF0YS12Zy10YXJnZXQnLCAnZGF0YS12Zy1kaXNtaXNzJ10sXHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IHt9O1xyXG5cclxuXHRcdFx0bGV0IGFyciA9IFtdLmZpbHRlci5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24gKGF0KSB7XHJcblx0XHRcdFx0cmV0dXJuIC9eZGF0YS0vLnRlc3QoYXQubmFtZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdFx0bGV0IG5hbWUgPSB2Lm5hbWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpc1JlbW92ZURhdGFOYW1lKSBuYW1lID0gbmFtZS5zbGljZSg1KTtcclxuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1tuYW1lXSA9IG5vcm1hbGl6ZURhdGEodi52YWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZU5hbWVzKCkucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gey4uLmFjYywgW25hbWVdOiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKX07XHJcblx0XHRcdH0sIHt9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRoYXMoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdH0sXHJcblxyXG5cdHNldChlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lICYmIHZhbHVlKSB7XHJcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5pcHVsYXRvcn1cclxuIiwiaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIGlzRW1wdHlPYmosIGlzT2JqZWN0fSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQotGD0YIg0YHQvtCx0YDQsNC90Ysg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LrRgNC40L/RgtGLINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LlcclxuICovXHJcblxyXG4vKipcclxuICog0J3QsNCx0L7RgCBzdmcg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEByZXR1cm5zIHsqfHt9fVxyXG4gKi9cclxuY29uc3QgZ2V0U1ZHID0gKG5hbWUpID0+IHtcclxuXHRjb25zdCBzdmcgPSAge1xyXG5cdFx0ZXJyb3I6ICcnLFxyXG5cdFx0c3VjY2VzczogJycsXHJcblx0XHRkb3RzOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGNsYXNzPVwiYmkgYmktdGhyZWUtZG90cy12ZXJ0aWNhbFwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj48cGF0aCBkPVwiTTkuNSAxM2ExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHptMC01YTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6XCIvPjwvc3ZnPicsXHJcblx0XHRjcm9zczogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCAyMjQuNTEyIDIyNC41MTJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxnPjxwb2x5Z29uIHBvaW50cz1cIjIyNC41MDcsNi45OTcgMjE3LjUyMSwwIDExMi4yNTYsMTA1LjI1OCA2Ljk5OCwwIDAuMDA1LDYuOTk3IDEwNS4yNjMsMTEyLjI1NCAwLjAwNSwyMTcuNTEyIDYuOTk4LDIyNC41MTIgMTEyLjI1NiwxMTkuMjQgMjE3LjUyMSwyMjQuNTEyIDIyNC41MDcsMjE3LjUxMiAxMTkuMjQ5LDExMi4yNTQgXCIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4nXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHN2Z1tuYW1lXSA/PyB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LXRiNCw0LXQvCDRgdC+0LHRi9GC0LjQtSBcItCX0LDQutGA0YvRgtGMXCIg0L3QsCDQstGB0LUg0LzQvtC00LDQu9C60LgsINGB0LDQudC00LHQsNGA0Ysg0Lgg0YIu0L8uXHJcbiAqIEBwYXJhbSBtb2R1bGVcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKi9cclxuY29uc3QgZGlzbWlzc1RyaWdnZXIgPSAobW9kdWxlLCBtZXRob2QgPSAnaGlkZScpID0+IHtcclxuXHRjb25zdCBjbGlja0V2ZW50ID0gYGNsaWNrLmRpc21pc3MuJHttb2R1bGUuRVZFTlRfS0VZfWBcclxuXHRjb25zdCBuYW1lID0gbW9kdWxlLk5BTUU7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgY2xpY2tFdmVudCwgYFtkYXRhLXZnLWRpc21pc3M9XCIke25hbWV9XCJdYCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHRoaXMpIHx8IHRoaXMuY2xvc2VzdChgLnZnLSR7bmFtZX1gKVxyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBtb2R1bGUuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblxyXG5cdFx0aW5zdGFuY2VbbWV0aG9kXSgpXHJcblx0fSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEFKQVggUkVRVUVTVFxyXG4gKiBAdHlwZSB7e3Bvc3Q6IGFqYXgucG9zdCwgZ2V0OiBhamF4LmdldCwgeDogKChmdW5jdGlvbigpOiAoWE1MSHR0cFJlcXVlc3QpKXwqKSwgc2VuZDogYWpheC5zZW5kfX1cclxuICovXHJcbmNvbnN0IEFqYXggPSB7XHJcblx0LyoqXHJcblx0ICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiBodHRwINC30LDQv9GA0L7RgdGLXHJcblx0ICogQHJldHVybnMge1hNTEh0dHBSZXF1ZXN0fCp9XHJcblx0ICovXHJcblx0eCgpIHtcclxuXHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdmVyc2lvbnMgPSBbXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNi4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNS4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNC4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuMy4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuMi4wXCIsXHJcblx0XHRcdFwiTWljcm9zb2Z0LlhtbEh0dHBcIlxyXG5cdFx0XSwgeGhyO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCh2ZXJzaW9uc1tpXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHhocjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQntGC0L/RgNCw0LLQu9GP0LXRgiDQt9Cw0L/RgNC+0YHRiyDQuCDQv9GA0LjQvdC40LzQsNC10YIg0L7RgtCy0LXRglxyXG5cdCAqIEBwYXJhbSB1cmxcclxuXHQgKiBAcGFyYW0gbWV0aG9kXHJcblx0ICogQHBhcmFtIGRhdGFcclxuXHQgKiBAcGFyYW0gY2FsbGJhY2tcclxuXHQgKiBAcGFyYW0gYXN5bmNcclxuXHQgKi9cclxuXHRzZW5kKHVybCwgbWV0aG9kLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGlmIChhc3luYyA9PT0gdW5kZWZpbmVkKSBhc3luYyA9IHRydWU7XHJcblxyXG5cdFx0bGV0IHggPSBBamF4LngoKTtcclxuXHRcdHgub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG5cdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHguc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjYXNlIDIwMDpcclxuXHRcdFx0XHRcdFx0ZXhlY3V0ZShjYWxsYmFjaywgWydzdWNjZXNzJywgeC5yZXNwb25zZVRleHRdKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRleGVjdXRlKGNhbGxiYWNrLCBbJ2Vycm9yJywgeC5zdGF0dXNUZXh0XSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0eC5zZW5kKGRhdGEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCe0YLQv9GA0LDQstC70Y/QtdGCINC4INC/0YDQuNC90LjQvNCw0LXRgiBHRVQg0LfQsNC/0YDQvtGB0YtcclxuXHQgKiBAcGFyYW0gdXJsXHJcblx0ICogQHBhcmFtIGRhdGFcclxuXHQgKiBAcGFyYW0gY2FsbGJhY2tcclxuXHQgKiBAcGFyYW0gYXN5bmNcclxuXHQgKi9cclxuXHRnZXQodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSAmJiAhaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRBamF4LnNlbmQodXJsICsgKHF1ZXJ5Lmxlbmd0aCA/ICc/JyArIHF1ZXJ5LmpvaW4oJyYnKSA6ICcnKSwgJ0dFVCcsIG51bGwsIGNhbGxiYWNrLCBhc3luYylcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQntGC0L/RgNCw0LLQu9GP0LXRgiDQuCDQv9GA0LjQvdC40LzQsNC10YIgUE9TVCDQt9Cw0L/RgNC+0YHRi1xyXG5cdCAqIEBwYXJhbSB1cmxcclxuXHQgKiBAcGFyYW0gZGF0YVxyXG5cdCAqIEBwYXJhbSBjYWxsYmFja1xyXG5cdCAqIEBwYXJhbSBhc3luY1xyXG5cdCAqL1xyXG5cdHBvc3QodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdEFqYXguc2VuZCh1cmwsIGNhbGxiYWNrLCAnUE9TVCcsIGRhdGEsIGFzeW5jKVxyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCB7XHJcblx0ZGlzbWlzc1RyaWdnZXIsIEFqYXgsIGdldFNWR1xyXG59IiwiaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIE92ZXJmbG93XHJcbiAqINCX0LDQv9GA0LXRidCw0LXRgiDRgdC60YDQvtC70LvQuNC90LMg0Lgg0YPQsdC40YDQsNC10YIg0LXQs9C+LCDQutC+0LzQv9C10L3RgdC40YDRg9GPINC+0YLRgdGC0YPQv9C+0LxcclxuICovXHJcblxyXG5jbGFzcyBPdmVyZmxvdyB7XHJcblx0c3RhdGljIGFwcGVuZCgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcblx0XHRsZXQgc3R5bGVzID0gTWFuaXB1bGF0b3IuZ2V0KGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdFx0aWYgKCFzdHlsZXMpIE1hbmlwdWxhdG9yLnJlbW92ZShkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJmbG93OyIsImltcG9ydCB7aXNFbGVtZW50LCBpc0VtcHR5T2JqLCBpc09iamVjdCwgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIFBhcmFtcywg0YHQvtCx0LjRgNCw0LXRgiDQstGB0LUgXCLQv9Cw0YDQsNC80LXRgtGA0YtcIiDQtNC70Y8g0YDQsNCx0L7RgtGLINC80L7QtNGD0LvQtdC5LCDRj9Cy0LvRj9GP0YHRjCDQtNC70Y8g0L3QuNGFINC+0YLQv9GA0LDQstC90L7QuSDRgtC+0YfQutC+0LlcclxuICovXHJcblxyXG5jbGFzcyBQYXJhbXMge1xyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiB7fVxyXG5cdH1cclxuXHJcblx0X2dldFBhcmFtcyhwYXJhbXMsIGVsZW1lbnQpIHtcclxuXHRcdHBhcmFtcyA9IHRoaXMuX21lcmdlUGFyYW1zT2JqKHBhcmFtcywgZWxlbWVudClcclxuXHRcdHBhcmFtcyA9IHRoaXMuX3BhcmFtc0FmdGVyTWVyZ2UocGFyYW1zKVxyXG5cdFx0cmV0dXJuIHBhcmFtc1xyXG5cdH1cclxuXHJcblx0X3BhcmFtc0FmdGVyTWVyZ2UocGFyYW1zKSB7XHJcblx0XHRsZXQgcERlZmF1bHQgPSB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHQsXHJcblx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QocERlZmF1bHQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGlzT2JqZWN0KG1QYXJhbXMpICYmICFpc0VtcHR5T2JqKG1QYXJhbXMpKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZGF0dW0gaW4gbVBhcmFtcykge1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IG5vcm1hbGl6ZURhdGEobVBhcmFtc1tkYXR1bV0pO1xyXG5cclxuXHRcdFx0XHRpZiAoZGF0dW0gIT09ICdwYXJhbXMnKSB7XHJcblx0XHRcdFx0XHRpZiAoIShkYXR1bSBpbiBwRGVmYXVsdCkpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHAgPSBkYXR1bS5zcGxpdCgnLScpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBEZWZhdWx0W3BbMF1dICYmIHBbMV0gaW4gcERlZmF1bHRbcFswXV0pIHtcclxuXHRcdFx0XHRcdFx0XHRwRGVmYXVsdFtwWzBdXVtwWzFdXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRkZWxldGUgbVBhcmFtc1tkYXR1bV07XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRtUGFyYW1zW2RhdHVtXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KG1QYXJhbXMsIHZhbHVlKVxyXG5cdFx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNbZGF0dW1dO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBtUGFyYW1zO1xyXG5cdH1cclxuXHJcblx0X21lcmdlUGFyYW1zT2JqKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIGlzRWxlbWVudChlbGVtZW50KSA/IG1lcmdlRGVlcE9iamVjdChNYW5pcHVsYXRvci5nZXQoZWxlbWVudCksIHBhcmFtcykgOiB7fVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBQYXJhbXM7XHJcbiIsImltcG9ydCB7bWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIFBsYWNlbWVudCwg0L7Qv9GA0LXQtNC10LvRj9C10YIg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LzQtdGB0YLQvtC/0L7Qu9C+0LbQtdC90LjQtSDRjdC70LXQvNC10L3RgtCwINC90LAg0YHRgtGA0LDQvdC40YbQtS5cclxuICogVE9ETyDQutC70LDRgdGBINC90LUg0LTQvtC/0LjRgdCw0L1cclxuICovXHJcblxyXG5jbGFzcyBQbGFjZW1lbnQge1xyXG5cdGNvbnN0cnVjdG9yKGFyZyA9IHt9KSB7XHJcblx0XHR0aGlzLnBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGVsZW1lbnQ6IG51bGwsXHJcblx0XHRcdGRyb3A6IG51bGxcclxuXHRcdH0sIGFyZyk7XHJcblx0fVxyXG5cclxuXHRfZ2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Y29uc3QgX3BhcmVudCA9IChzZWxmKSA9PiB7XHJcblx0XHRcdGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudE5vZGUsXHJcblx0XHRcdFx0b3ZlcmZsb3cgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCkub3ZlcmZsb3c7XHJcblxyXG5cdFx0XHRpZiAocGFyZW50LnRhZ05hbWUgIT09ICdCT0RZJykge1xyXG5cdFx0XHRcdGlmIChvdmVyZmxvdyA9PT0gJ3Zpc2libGUnKSB7XHJcblx0XHRcdFx0XHRfcGFyZW50KHBhcmVudClcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXNGaXhlZCA9IGZhbHNlLCB0b3AsIGxlZnQsXHJcblx0XHRcdGJvdW5kcyA9IF90aGlzLnBhcmFtcy5kcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRwYXJlbnQgPSBfdGhpcy5wYXJhbXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRpZiAoX3BhcmVudChfdGhpcy5wYXJhbXMuZWxlbWVudCkpIHtcclxuXHRcdFx0aXNGaXhlZCA9IHRydWU7XHJcblx0XHRcdHRvcCA9IGJvdW5kcy50b3A7XHJcblx0XHRcdGxlZnQgPSBib3VuZHMubGVmdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKF90aGlzLnBhcmFtcy5kcm9wKTtcclxuXHRcdFx0dG9wID0gbm9ybWFsaXplRGF0YShzdHlsZXMudG9wLnNsaWNlKDAsIC0yKSk7XHJcblx0XHRcdGxlZnQgPSBub3JtYWxpemVEYXRhKHN0eWxlcy5sZWZ0LnNsaWNlKDAsIC0yKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKChib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCkgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHRsZWZ0ID0gcGFyZW50LndpZHRoIC0gYm91bmRzLndpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlzRml4ZWQ6IGlzRml4ZWQsXHJcblx0XHRcdHRvcDogdG9wLFxyXG5cdFx0XHRsZWZ0OiBsZWZ0XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGFjZW1lbnQ7IiwiLyoqXHJcbiAqINCa0LvQsNGB0YEgUmVzcG9uc2l2ZSwg0YDQsNCx0L7RgtCw0LXRgiDQv9C+INGC0LDQutC40Lwg0LbQtSDQvNC10LTQuNCwINGC0L7Rh9C60LDQvCwg0YfRgtC+INC4IGJvb3RzdHJhcFxyXG4gKiDQuCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC5cclxuICovXHJcblxyXG5jbGFzcyBSZXNwb25zaXZlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYnJlYWtwb2ludHMgPSB7XHJcblx0XHRcdHhzOiAwLFxyXG5cdFx0XHRzbTogNTc2LFxyXG5cdFx0XHRtZDogNzY4LFxyXG5cdFx0XHRsZzogOTkyLFxyXG5cdFx0XHR4bDogMTIwMCxcclxuXHRcdFx0eHhsOiAxNDAwLFxyXG5cdFx0XHR4eHhsOiAxNjAwLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCV0YHQu9C4INC90LDRiNCwINGI0LjRgNC40L3QsCDRjdC60YDQsNC90LAg0YHQvtCy0L/QsNC00LDQtdGCINGBINC00LjQsNC/0LDQt9C+0L3QvtC8INC60L7RgtC+0YDRi9C5INGD0LrQsNC30LDQvSDQsiDQvNC+0LTRg9C70LUg0LLRi9C00LDQtdC8IHRydWUsINC40L3QsNGH0LUgZmFsc2VcclxuXHQgKiBAcGFyYW0gbW9kdWxlXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrKG1vZHVsZSkge1xyXG5cdFx0bGV0IGluc3RhbmNlID0gbmV3IHRoaXMgO1xyXG5cdFx0cmV0dXJuIGluc3RhbmNlLmRlZmluZShtb2R1bGUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0LLQtdGA0Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLiBUT0RPINC90LUg0YHQvtCy0YHQtdC8INC/0YDQsNCy0LjQu9GM0L3Qviwg0L3QsNC00L4g0YHQtNC10LvQsNGC0Ywg0L/Qvi3QtNGA0YPQs9C+0LzRg1xyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVja01vYmlsZU9yVGFibGV0KCkge1xyXG5cdFx0bGV0IGNoZWNrID0gZmFsc2U7XHJcblx0XHQoZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWlub3xhbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zbGljZSgwLDQpKSl7XHJcblx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmEpO1xyXG5cclxuXHRcdHJldHVybiBjaGVjaztcclxuXHR9XHJcblxyXG5cdGRlZmluZShtb2R1bGUpIHtcclxuXHRcdGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG5cdFx0XHRyZXNwb25zaXZlX3NpemUgPSB0aGlzLl9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpLFxyXG5cdFx0XHRicmVha3BvaW50cyA9IHRoaXMuYnJlYWtwb2ludHMsXHJcblx0XHRcdHBvaW50ID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLmZpbmQoa2V5ID0+IGJyZWFrcG9pbnRzW2tleV0gPT09IHJlc3BvbnNpdmVfc2l6ZSk7XHJcblxyXG5cdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cyksXHJcblx0XHRcdGxvYyA9IGtleXMuaW5kZXhPZihwb2ludCk7XHJcblxyXG5cdFx0cmV0dXJuIHdpbmRvd1dpZHRoID49IGJyZWFrcG9pbnRzW2tleXNbbG9jICsgMV1dO1xyXG5cdH1cclxuXHJcblx0X2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBtb2R1bGUuZWxlbWVudCxcclxuXHRcdFx0cGFyYW1zID0gbW9kdWxlLnBhcmFtcyxcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSAwO1xyXG5cclxuXHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5MRykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLmxnO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5NRCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLm1kO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5TTSkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnNtO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YUykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZTsiLCJpbXBvcnQge2lzRWxlbWVudH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0KDQsNCx0L7RgtCwINGBIERPTVxyXG4gKiBUT0RPINC/0LXRgNC10YDQsNCx0L7RgtCw0YLRjCDQutC+0L3RgdGC0LDQvdGC0YMgU2VsZWN0b3JzXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcblxyXG5jb25zdCBwYXJzZVNlbGVjdG9yID0gc2VsZWN0b3IgPT4ge1xyXG5cdGlmIChzZWxlY3RvciAmJiB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1MuZXNjYXBlKSB7XHJcblx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyMoW15cXHNcIiMnXSspL2csIChtYXRjaCwgaWQpID0+IGAjJHtDU1MuZXNjYXBlKGlkKX1gKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcbn1cclxuXHJcbmNvbnN0IGdldFNlbGVjdG9yID0gZWxlbWVudCA9PiB7XHJcblx0bGV0IHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmctdGFyZ2V0JylcclxuXHJcblx0aWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcblx0XHRsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcclxuXHRcdGlmICghaHJlZkF0dHJpYnV0ZSB8fCAoIWhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcuJykpKSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcjJykpIHtcclxuXHRcdFx0aHJlZkF0dHJpYnV0ZSA9IGAjJHtocmVmQXR0cmlidXRlLnNwbGl0KCcjJylbMV19YFxyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGxcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvciA/IHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKHNlbCA9PiBwYXJzZVNlbGVjdG9yKHNlbCkpLmpvaW4oJywnKSA6IG51bGxcclxufVxyXG5cclxuY29uc3QgU2VsZWN0b3JzID0ge1xyXG5cdGdldChlbCwgY29udGFpbmVyKSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcign0KLQvtCy0LDRgNC40YkhINCf0LXRgNCy0YvQuSDQv9Cw0YDQsNC80LXRgtGAINC90LUg0LTQvtC70LbQtdC9INCx0YvRgtGMINC/0YPRgdGC0YvQvCEnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0bGV0IGVsbSA9IGlzRWxlbWVudChjb250YWluZXIpID8gU2VsZWN0b3JzLmZpbmRPbmUoZWwsIGNvbnRhaW5lcikgOiBTZWxlY3RvcnMuZmluZE9uZShlbCk7XHJcblx0XHRcdFx0aWYgKGVsbSkgcmV0dXJuIGVsbTtcclxuXHRcdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcign0JDRhdC/0LXRgCEg0J3QtSDRg9C00LDQu9C+0YHRjCDQvdCw0LnRgtC4INGN0LvQtdC80LXQvdGCJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAoaXNFbGVtZW50KGVsKSkge1xyXG5cdFx0XHRcdHJldHVybiBlbDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ca0K3QnyEg0JrQsNC60LDRjy3RgtC+INC00LjRh9GMINC6INC90LDQvCDQt9Cw0LvQtdGC0LXQu9CwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmaW5kQWxsKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChlbGVtZW50LCBzZWxlY3RvcikpXHJcblx0fSxcclxuXHJcblx0ZmluZE9uZShzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3RvcilcclxuXHR9LFxyXG5cclxuXHRwcmV2KGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcblx0XHRsZXQgcHJldmlvdXMgPSBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmdcclxuXHJcblx0XHR3aGlsZSAocHJldmlvdXMpIHtcclxuXHRcdFx0aWYgKHByZXZpb3VzLm1hdGNoZXMoc2VsZWN0b3IpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtwcmV2aW91c11cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cHJldmlvdXMgPSBwcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtdXHJcblx0fSxcclxuXHJcblx0bmV4dChlbGVtZW50LCBzZWxlY3Rvcikge1xyXG5cdFx0bGV0IG5leHQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcclxuXHJcblx0XHR3aGlsZSAobmV4dCkge1xyXG5cdFx0XHRpZiAobmV4dC5tYXRjaGVzKHNlbGVjdG9yKSkge1xyXG5cdFx0XHRcdHJldHVybiBbbmV4dF1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV4dCA9IG5leHQubmV4dEVsZW1lbnRTaWJsaW5nXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtdXHJcblx0fSxcclxuXHJcblx0Z2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcblx0XHRsZXQgX3NlbGVjdG9yID0gbnVsbDtcclxuXHJcblx0XHRpZiAoaXNFbGVtZW50KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRfc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRfc2VsZWN0b3IgPSBTZWxlY3RvcnMuZmluZE9uZShzZWxlY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRhcmdldCA9IGdldFNlbGVjdG9yKF9zZWxlY3Rvcik7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0bGV0IF90YXJnZXRTZWxlY3RvciA9IFNlbGVjdG9ycy5maW5kT25lKHRhcmdldCk7XHJcblx0XHRpZiAoX3RhcmdldFNlbGVjdG9yKSByZXR1cm4gIF90YXJnZXRTZWxlY3RvcjtcclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yczsiLCJpbXBvcnQge2V4ZWN1dGUsIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sIGlzRW1wdHlPYmp9IGZyb20gXCIuLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBQYXJhbXMgZnJvbSBcIi4uL191dGlscy9qcy9wYXJhbXNcIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4uL191dGlscy9qcy9kYXRhXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7QWpheCwgZ2V0U1ZHfSBmcm9tIFwiLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgZXZlbnQgZnJvbSBcIi4uL191dGlscy9qcy9ldmVudFwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSBleHRlbmRzIFBhcmFtcyB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG5cdFx0dGhpcy5fcGFyYW1zID0ge307XHJcblxyXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cclxuXHRcdERhdGEuc2V0KHRoaXMuZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FX0tFWSwgdGhpcylcclxuXHR9XHJcblxyXG5cdGdldCBlbGVtZW50KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRcclxuXHR9XHJcblxyXG5cdHNldCBlbGVtZW50KGVsKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gU2VsZWN0b3JzLmdldChlbCk7XHJcblx0fVxyXG5cclxuXHRnZXQgcGFyYW1zKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcmFtc1xyXG5cdH1cclxuXHJcblx0c2V0IHBhcmFtcyhwYXJhbXMpIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhwYXJhbXMsIHRoaXMuZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuICcnXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gJydcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRGF0YS5nZXQoU2VsZWN0b3JzLmdldChlbGVtZW50KSwgdGhpcy5OQU1FX0tFWSlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRJbnN0YW5jZShlbGVtZW50KSB8fCBuZXcgdGhpcyhlbGVtZW50LCAhaXNFbXB0eU9iaihwYXJhbXMpID8gcGFyYW1zIDoge30pXHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0RGF0YS5yZW1vdmUodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZKVxyXG5cclxuXHRcdGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHRoaXNbcHJvcGVydHlOYW1lXSA9IG51bGxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yb3V0ZShjYWxsYmFjaykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0bGV0ICRjb250ZW50ID0gbnVsbDtcclxuXHJcblx0XHRpZiAoIV90aGlzLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnYWpheCcpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISdyb3V0ZScgaW4gX3RoaXMucGFyYW1zLmFqYXggJiYgIV90aGlzLnBhcmFtcy5hamF4LnJvdXRlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ3RhcmdldCcgaW4gX3RoaXMucGFyYW1zLmFqYXggJiYgX3RoaXMucGFyYW1zLmFqYXgudGFyZ2V0KSB7XHJcblx0XHRcdCRjb250ZW50ID0gU2VsZWN0b3JzLmZpbmRPbmUoX3RoaXMucGFyYW1zLmFqYXgudGFyZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKCRjb250ZW50KSAkY29udGVudC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoISdtZXRob2QnIGluIF90aGlzLnBhcmFtcy5hamF4KSB7XHJcblx0XHRcdF90aGlzLnBhcmFtcy5hamF4Lm1ldGhvZCA9ICdnZXQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYWpheC5tZXRob2QgPT09ICdnZXQnKSB7XHJcblx0XHRcdEFqYXguZ2V0KF90aGlzLnBhcmFtcy5hamF4LnJvdXRlLCBfdGhpcy5wYXJhbXMuYWpheC5kYXRhIHx8IHt9LCBmdW5jdGlvbiAoc3RhdHVzLCBkYXRhKSB7XHJcblx0XHRcdFx0c2V0RGF0YShkYXRhKTtcclxuXHRcdFx0XHRleGVjdXRlKGNhbGxiYWNrLCBbc3RhdHVzLCBkYXRhXSk7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuZWxlbWVudCwgX3RoaXMuTkFNRV9LRVkgKyAnLmxvYWRlZCcpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYWpheC5tZXRob2QgPT09ICdwb3N0Jykge1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coX3RoaXMucGFyYW1zLmFqYXgpXHJcblx0XHRcdEFqYXgucG9zdChfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSwge30sIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0XHRzZXREYXRhKGRhdGEpO1xyXG5cdFx0XHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFtzdGF0dXMsIGRhdGFdKTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5lbGVtZW50LCBfdGhpcy5OQU1FX0tFWSArICcubG9hZGVkJyk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfZGlzbWlzc0VsZW1lbnQoKSB7XHJcblx0XHRsZXQgY3Jvc3MgPSBnZXRTVkcoJ2Nyb3NzJyksXHJcblx0XHRcdGJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmctYnRuLWNsb3NlJyk7XHJcblxyXG5cdFx0aWYgKGJ1dHRvbikge1xyXG5cdFx0XHRsZXQgc3ZnID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG5cdFx0XHRpZiAoIXN2ZykgYnV0dG9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgY3Jvc3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3F1ZXVlQ2FsbGJhY2soY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQgPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRcdGV4ZWN1dGVBZnRlclRyYW5zaXRpb24oY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQsIHRpbWVPdXRNcyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYXNlTW9kdWxlOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIG5vb3B9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBQbGFjZW1lbnQgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9wbGFjZW1lbnRcIjtcclxuXHJcbmNvbnN0IE5BTUUgICAgICAgICAgICAgPSAnZHJvcGRvd24nO1xyXG5jb25zdCBOQU1FX0tFWSAgICAgICAgID0gJ3ZnLmRyb3Bkb3duJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICA9ICdmYWRlJztcclxuY29uc3QgVEFSR0VUX0NPTlRBSU5FUiA9ICd2Zy1kcm9wZG93bi1jb250ZW50JztcclxuY29uc3QgUEFSRU5UX0NPTlRBSU5FUiA9ICd2Zy1kcm9wZG93bic7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJ1tkYXRhLXZnLXRvZ2dsZT1cImRyb3Bkb3duXCJdJztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlVUF9EQVRBX0FQSSA9IGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWURPV05fREFUQV9BUEkgPSBga2V5ZG93bi4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJID0gYG1vdXNlb3Zlci4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJID0gYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0ge1xyXG5cdG9mZnNldDogWzAsIDJdLFxyXG5cdG92ZXI6IGZhbHNlLFxyXG5cdGJhY2tkcm9wOiB0cnVlLFxyXG5cdG92ZXJmbG93OiB0cnVlLFxyXG5cdGtleWJvYXJkOiB0cnVlLFxyXG5cdHBsYWNlbWVudDogJ2JvdHRvbScsXHJcblx0YW5pbWF0aW9uOiB0cnVlLFxyXG5cdHRpbWVvdXRBbmltYXRpb246IDMwMCxcclxuXHRob3ZlcjogZmFsc2UsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHRHJvcGRvd24gZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyZW50ID0gdGhpcy5lbGVtZW50LnBhcmVudE5vZGU7XHJcblx0XHR0aGlzLl9kcm9wID0gU2VsZWN0b3JzLmdldCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSLCB0aGlzLl9wYXJlbnQpO1xyXG5cdFx0dGhpcy5faXNQbGFjZW1lbnQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodGhpcy5wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzU2hvd24oKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5lbGVtZW50KSB8fCB0aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLmVsZW1lbnRcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX3NldFBsYWNlbWVudCgpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZHJvcCwgdHJ1ZSwgNTApO1xyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMuZWxlbWVudCkgfHwgIXRoaXMuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHJldHVybiBzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJREUsIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9wYXJlbnQsIHRydWUsIHRoaXMucGFyYW1zLnRpbWVvdXRBbmltYXRpb24pO1xyXG5cdH1cclxuXHJcblx0Ly8gVE9ETyBjbGFzcyBQbGFjZW1lbnQgaXNuJ3QgZG9uZVxyXG5cdF9zZXRQbGFjZW1lbnQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5faXNQbGFjZW1lbnQpIHtcclxuXHRcdFx0bGV0IHBsYWNlbWVudCA9IG5ldyBQbGFjZW1lbnQoe1xyXG5cdFx0XHRcdGVsZW1lbnQ6IHRoaXMuX3BhcmVudCxcclxuXHRcdFx0XHRkcm9wOiB0aGlzLl9kcm9wXHJcblx0XHRcdH0pLl9nZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRcdGlmIChwbGFjZW1lbnQuaXNGaXhlZCkge1xyXG5cdFx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMjAlKSc7IC8vIHRvZG8gdGhpcyBpcyDQutC+0YHRgtGL0LvRjCDQv9C+Zml40LjRgtGMXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLmxlZnQgPSBwbGFjZW1lbnQubGVmdCArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnRvcCA9ICBwbGFjZW1lbnQudG9wICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm9mZnNldCkge1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wYWRkaW5nVG9wID0gX3RoaXMucGFyYW1zLm9mZnNldFsxXSArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdSaWdodCA9IF90aGlzLnBhcmFtcy5vZmZzZXRbMF0gKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9pc1BsYWNlbWVudCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR0Ryb3Bkb3duLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRpZiAoaW5zdGFuY2UucGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdGxldCBjdXJyZW50RWxlbSA9IG51bGw7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihpbnN0YW5jZS5fcGFyZW50LCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmIChjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFZHRHJvcGRvd24uaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KTtcclxuXHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuJyArIFBBUkVOVF9DT05UQUlORVIpO1xyXG5cdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGlmICghaW5zdGFuY2UuX3BhcmVudC5jb250YWlucyh0YXJnZXQpKSByZXR1cm47XHJcblx0XHRcdFx0Y3VycmVudEVsZW0gPSB0YXJnZXQ7XHJcblx0XHRcdFx0aW5zdGFuY2Uuc2hvdygpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihpbnN0YW5jZS5fcGFyZW50LCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0XHRcdHdoaWxlIChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRpZiAocmVsYXRlZFRhcmdldCA9PT0gY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQgPSByZWxhdGVkVGFyZ2V0LnBhcmVudE5vZGU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IG51bGw7XHJcblx0XHRcdFx0aW5zdGFuY2UuX2NvbXBsZXRlSGlkZSh7cmVsYXRlZFRhcmdldDogaW5zdGFuY2UuX2VsZW1lbnR9KTtcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBWR0Ryb3Bkb3duLmtleWRvd25IYW5kbGVyKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlET1dOX0RBVEFfQVBJLCAnLicgKyBUQVJHRVRfQ09OVEFJTkVSLCBWR0Ryb3Bkb3duLmtleWRvd25IYW5kbGVyKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgVkdEcm9wZG93bi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgVkdEcm9wZG93bi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGluc3RhbmNlLnRvZ2dsZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlT3BlblRvZ2dsZXMoZXZlbnQpIHtcclxuXHRcdGNvbnN0IG9wZW5Ub2dnbGVzID0gU2VsZWN0b3JzLmZpbmRBbGwoJ1tkYXRhLXZnLXRvZ2dsZT1cImRyb3Bkb3duXCJdOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpLnNob3cnKTtcclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR0Ryb3Bkb3duLmdldEluc3RhbmNlKHRvZ2dsZSk7XHJcblx0XHRcdGlmICghY29udGV4dCkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgVEFSR0VUX0NPTlRBSU5FUikgPT09IGNvbnRleHQuX2Ryb3ApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGNvbXBvc2VkUGF0aCA9IGV2ZW50LmNvbXBvc2VkUGF0aCgpO1xyXG5cdFx0XHRpZiAoY29tcG9zZWRQYXRoLmluY2x1ZGVzKGNvbnRleHQuX2VsZW1lbnQpKSB7XHJcblx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogY29udGV4dC5fZWxlbWVudCB9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdHJlbGF0ZWRUYXJnZXQuY2xpY2tFdmVudCA9IGV2ZW50XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHQuX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGtleWRvd25IYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRjb25zdCBpc0lucHV0ID0gL2lucHV0fHRleHRhcmVhL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSlcclxuXHRcdGNvbnN0IGlzRXNjYXBlRXZlbnQgPSBldmVudC5rZXkgPT09ICdFc2NhcGUnXHJcblx0XHRjb25zdCBpc1VwT3JEb3duRXZlbnQgPSBbJ0Fycm93VXAnLCAnQXJyb3dEb3duJ10uaW5jbHVkZXMoZXZlbnQua2V5KVxyXG5cclxuXHRcdGlmICghaXNVcE9yRG93bkV2ZW50ICYmICFpc0VzY2FwZUV2ZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc0lucHV0ICYmICFpc0VzY2FwZUV2ZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcblx0XHRjb25zdCBnZXRUb2dnbGVCdXR0b24gPSB0aGlzLm1hdGNoZXMoU0VMRUNUT1JfREFUQV9UT0dHTEUpID9cclxuXHRcdFx0dGhpcyA6XHJcblx0XHRcdChTZWxlY3RvcnMucHJldih0aGlzLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSlbMF0gfHxcclxuXHRcdFx0XHRTZWxlY3RvcnMubmV4dCh0aGlzLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSlbMF0gfHxcclxuXHRcdFx0XHRTZWxlY3RvcnMuZmluZE9uZShTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZXZlbnQuZGVsZWdhdGVUYXJnZXQucGFyZW50Tm9kZSkpXHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR0Ryb3Bkb3duLmdldE9yQ3JlYXRlSW5zdGFuY2UoZ2V0VG9nZ2xlQnV0dG9uKVxyXG5cclxuXHRcdGlmIChpc1VwT3JEb3duRXZlbnQpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2Uuc2hvdygpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpbnN0YW5jZS5faXNTaG93bigpKSB7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblx0XHRcdGluc3RhbmNlLmhpZGUoKVxyXG5cdFx0XHRnZXRUb2dnbGVCdXR0b24uZm9jdXMoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGNsZWFyRHJvcHMoZXZlbnQpIHtcclxuXHRcdGlmIChldmVudC5idXR0b24gPT09IDIgfHwgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5ICE9PSAnVGFiJykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0Ryb3Bkb3duOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL292ZXJmbG93XCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9ldmVudFwiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWR9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ21vZGFsJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubW9kYWwnO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xyXG5jb25zdCBTRUxFQ1RPUl9ESUFMT0cgPSAnLnZnLW1vZGFsLWRpYWxvZydcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJtb2RhbFwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcblxyXG5jb25zdCBQQVJBTVNfREVGQVVMVCA9ICB7XHJcblx0YnV0dG9uOiBudWxsLFxyXG5cdGJhY2tkcm9wOiB0cnVlLFxyXG5cdG92ZXJmbG93OiB0cnVlLFxyXG5cdGtleWJvYXJkOiB0cnVlLFxyXG5cdGFqYXg6IHtcclxuXHRcdHJvdXRlOiAnJyxcclxuXHRcdHRhcmdldDogJydcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWZ01vZGFsIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fZGlhbG9nID0gU2VsZWN0b3JzLmZpbmRPbmUoU0VMRUNUT1JfRElBTE9HLCB0aGlzLmVsZW1lbnQpXHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5hcHBlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5faXNBbmltYXRlZCgpKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKF90aGlzLmVsZW1lbnQsICdtb3VzZWRvd24udmcubW9kYWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRjb25zdCBtb2RhbENvbnRlbnQgPSBTZWxlY3RvcnMuZ2V0KCcudmctbW9kYWwtY29udGVudCcsIHRoaXMpO1xyXG5cdFx0XHRcdGlmICghbW9kYWxDb250ZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcclxuXHRcdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5lbGVtZW50LCB0cnVlLCA1MClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLl9pc0FuaW1hdGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuZWxlbWVudCwgdGhpcy5faXNBbmltYXRlZCgpKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9pc0FuaW1hdGVkKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTLCBldmVudCA9PiB7XHJcblx0XHRcdGlmIChldmVudC5rZXkgIT09ICdFc2NhcGUnKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLnBhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEKVxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZnTW9kYWwpXHJcblxyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX0hJRERFTiwgKCkgPT4ge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0fSlcclxuXHJcblx0Y29uc3QgYWxyZWFkeU9wZW4gPSBTZWxlY3RvcnMuZmluZE9uZSgnLnZnLW1vZGFsLnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWZ01vZGFsLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWZ01vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cdGRhdGEudG9nZ2xlKHRoaXMpXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWZ01vZGFsO1xyXG4iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9vdmVyZmxvd1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdzaWRlYmFyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuc2lkZWJhcic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCJdJ1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY29uc3QgUEFSQU1TX0RFRkFVTFQgPSAge1xyXG5cdGJ1dHRvbjogbnVsbCxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRhamF4OiB7XHJcblx0XHRyb3V0ZTogJycsXHJcblx0XHR0YXJnZXQ6ICcnXHJcblx0fVxyXG59O1xyXG5cclxuY2xhc3MgVkdTaWRlYmFyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLmVsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihTZWxlY3RvcnMuZmluZE9uZSgnLnZnLWJhY2tkcm9wJyksICdtb3VzZWRvd24udmcuYmFja2Ryb3AnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5lbGVtZW50LCB0cnVlKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWR1NpZGViYXIpXHJcblxyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRUYXJnZXRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kT25lKCcudmctc2lkZWJhci5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VkdTaWRlYmFyLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWR1NpZGViYXIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcylcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHU2lkZWJhcjtcclxuIiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHt2YWxpZGF0ZX0gZnJvbSBcIkBiYWJlbC9jb3JlL2xpYi9jb25maWcvdmFsaWRhdGlvbi9vcHRpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnZm9ybS1zZW5kZXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5mb3JtLXNlbmRlcic7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIENsYXNzZXNcclxuICovXHJcblxyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBFdmVudHNcclxuICovXHJcbmNvbnN0IEVWRU5UX0tFWV9TVUNDRVNTID0gJ3ZnLmZzLnN1Y2Nlc3MnO1xyXG5jb25zdCBFVkVOVF9LRVlfRVJST1IgICA9ICd2Zy5mcy5lcnJvcic7XHJcbmNvbnN0IEVWRU5UX0tFWV9CRUZPUkUgID0gJ3ZnLmZzLmJlZm9yZSc7XHJcbmNvbnN0IEVWRU5UX0tFWV9MT0FERUQgID0gJ3ZnLmZzLmxvYWRlZCc7XHJcblxyXG5jb25zdCBFVkVOVF9TVUJNSVRfREFUQV9BUEkgPSBgc3VibWl0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IFBhcmFtc1xyXG4gKi9cclxuY29uc3QgUEFSQU1TX0RFRkFVTFQgPSAge1xyXG5cdGFjdGlvbjogbG9jYXRpb24uaHJlZixcclxuXHRtZXRob2Q6ICdwb3N0JyxcclxuXHRmaWVsZHM6IFtdLFxyXG5cdHJlZGlyZWN0OiBudWxsLFxyXG5cdGlzSnNvblBhcnNlOiB0cnVlLFxyXG5cdGlzVmFsaWRhdGU6IGZhbHNlLFxyXG5cdGlzU3VibWl0OiBmYWxzZSxcclxuXHRpc0J0blRleHQ6IHRydWUsXHJcblx0aXNTaG93UGFzczogdHJ1ZSxcclxuXHRhbGVydDoge1xyXG5cdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdGRlbGF5OiAzNTAsXHJcblx0XHR0eXBlOiAnbW9kYWwnXHJcblx0fSxcclxuXHRjbGFzc2VzOiB7XHJcblx0XHRnZW5lcmFsOiAndmctZm9ybS1zZW5kZXInLFxyXG5cdFx0dmFsaWRhdGlvbjogJ25lZWRzLXZhbGlkYXRpb24nLFxyXG5cdFx0d2FzVmFsaWRhdGU6ICd3YXMtdmFsaWRhdGVkJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHRm9ybVNlbmRlciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX2J1dHRvbiA9IG51bGw7XHJcblx0XHR0aGlzLmJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpO1xyXG5cclxuXHRcdHRoaXMucGFyYW1zLmFjdGlvbiA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLmVsZW1lbnQsICdhY3Rpb24nKSB8fCB0aGlzLnBhcmFtcy5hY3Rpb247XHJcblx0XHR0aGlzLnBhcmFtcy5tZXRob2QgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5lbGVtZW50LCAnbWV0aG9kJykgfHwgdGhpcy5wYXJhbXMubWV0aG9kO1xyXG5cclxuXHRcdHRoaXMucGFyYW1zLmlzVmFsaWRhdGUgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuZWxlbWVudCwgJ2RhdGEtdmFsaWRhdGUnKSA9PT0gJ3RydWUnO1xyXG5cdFx0dGhpcy5wYXJhbXMuaXNTdWJtaXQgICAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5lbGVtZW50LCAnZGF0YS1zdWJtaXQnKSA9PT0gJ3RydWUnO1xyXG5cdFx0dGhpcy5wYXJhbXMuaXNCdG5UZXh0ICAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5lbGVtZW50LCAnZGF0YS1idG4tdGV4dCcpICE9PSAnZmFsc2UnO1xyXG5cdFx0dGhpcy5wYXJhbXMuaXNKc29uUGFyc2UgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5lbGVtZW50LCAnZGF0YS1qc29uLXBhcnNlJykgIT09ICdmYWxzZSc7XHJcblx0XHR0aGlzLnBhcmFtcy5pc1Nob3dQYXNzID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuZWxlbWVudCwgJ2RhdGEtc2hvdy1wYXNzJykgIT09ICdmYWxzZSc7XHJcblxyXG5cdFx0aWYgKHRoaXMucGFyYW1zLmZpZWxkcyAmJiB0eXBlb2YgdGhpcy5wYXJhbXMuZmllbGRzID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5wYXJhbXMuZmllbGRzID0gdGhpcy5wYXJhbXMuZmllbGRzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGdldCBidXR0b24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fYnV0dG9uXHJcblx0fVxyXG5cclxuXHRzZXQgYnV0dG9uKGJ0bikge1xyXG5cdFx0aWYgKCFidG4pIHtcclxuXHRcdFx0dGhpcy5fYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2Zvcm09XCInICsgdGhpcy5lbGVtZW50LmlkICsgJ1wiXScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fYnV0dG9uID0gYnRuO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YnVpbGQoKSB7XHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLnBhcmFtcy5jbGFzc2VzLmdlbmVyYWwpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBhcmFtcy5pc1ZhbGlkYXRlKSB7XHJcblx0XHRcdE1hbmlwdWxhdG9yLnNldCh0aGlzLmVsZW1lbnQsICdub3ZhbGlkYXRlJywgJycpO1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLnBhcmFtcy5jbGFzc2VzLnZhbGlkYXRpb24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE8g0YHQtNC10LvQsNGC0Ywg0LTQvtCx0LDQstC70LXQvdC40LUg0LPQu9Cw0LfQsCDQtdGB0LvQuCDQtdGB0YLRjCDQstCy0L7QtCDQv9Cw0YDQvtC70Y9cclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cdH1cclxuXHJcblx0c3VibWl0KGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0Y29uc3QgY29sbGVjdERhdGEgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgbmFtZSBpbiBmaWVsZHMpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGZpZWxkc1tuYW1lXSA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGtleSBpbiBmaWVsZHNbbmFtZV0pIHtcclxuXHRcdFx0XHRcdFx0bGV0IGFyciA9IE9iamVjdC5rZXlzKGZpZWxkc1tuYW1lXVtrZXldKS5tYXAoZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmllbGRzW25hbWVdW2tleV1baV07XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRkYXRhLmFwcGVuZChuYW1lLCBhcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRkYXRhLmFwcGVuZChuYW1lLCBmaWVsZHNbbmFtZV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRpZiAoX3RoaXMucGFyYW1zLmlzVmFsaWRhdGUpIHtcclxuXHRcdFx0XHRpZiAoIV90aGlzLmVsZW1lbnQuY2hlY2tWYWxpZGl0eSgpKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLnBhcmFtcy5jbGFzc2VzLndhc1ZhbGlkYXRlKTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5idXR0b24pKSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghX3RoaXMucGFyYW1zLmlzU3VibWl0KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0bGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoX3RoaXMuZWxlbWVudCk7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBfdGhpcy5wYXJhbXMuZmllbGRzID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IGNvbGxlY3REYXRhKGRhdGEsIF90aGlzLnBhcmFtcy5maWVsZHMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIF90aGlzLnJlcXVlc3QoZGF0YSwgY2FsbGJhY2ssIGV2ZW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXF1ZXN0KGRhdGEsIGNhbGxiYWNrLCBldmVudCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLnBhcmFtcy5hamF4ID0ge1xyXG5cdFx0XHRyb3V0ZTogX3RoaXMucGFyYW1zLmFjdGlvbixcclxuXHRcdFx0bWV0aG9kOiBfdGhpcy5wYXJhbXMubWV0aG9kLnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2FsbGJhY2sgJiYgJ2JlZm9yZVNlbmQnIGluIGNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUoY2FsbGJhY2suYmVmb3JlU2VuZCwgW2V2ZW50LCBfdGhpc10pO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfQkVGT1JFLCBfdGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX3JvdXRlKGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coc3RhdHVzKTtcclxuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBwYXJhbXNcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR0Zvcm1TZW5kZXIuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKS5zdWJtaXQoKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRm9ybVNlbmRlcjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3Jlc3BvbnNpdmVcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBub29wLCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICduYXYnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5uYXYnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICAgPSAnZmFkZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJy52Zy1uYXYgYSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSAgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTSVpFX0RBVEFfQVBJID0gYHJlc2l6ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBQYXJhbXNcclxuICovXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRicmVha3BvaW50OiAnbGcnLFxyXG5cdHBsYWNlbWVudDogJ2hvcml6b250YWwnLFxyXG5cdGNsYXNzZXM6IHtcclxuXHRcdGhhbWJ1cmdlckFjdGl2ZTogJ3ZnLW5hdi1oYW1idXJnZXItYWN0aXZlJyxcclxuXHRcdGhhbWJ1cmdlcjogJ3ZnLW5hdi1oYW1idXJnZXInLFxyXG5cdFx0Y29udGFpbmVyOiAndmctbmF2LWNvbnRhaW5lcicsXHJcblx0XHR3cmFwcGVyOiAndmctbmF2LXdyYXBwZXInLFxyXG5cdFx0YWN0aXZlOiAndmctbmF2LWFjdGl2ZScsXHJcblx0XHRleHBhbmQ6ICd2Zy1uYXYtZXhwYW5kJyxcclxuXHRcdGNsb25lZDogJ3ZnLW5hdi1jbG9uZWQnLFxyXG5cdFx0aG92ZXI6ICd2Zy1uYXYtaG92ZXInLFxyXG5cdFx0ZmxpcDogJ3ZnLW5hdi1mbGlwJyxcclxuXHRcdFhYWEw6ICd2Zy1uYXYteHh4bCcsXHJcblx0XHRYWEw6ICd2Zy1uYXYteHhsJyxcclxuXHRcdFhMOiAndmctbmF2LXhsJyxcclxuXHRcdExHOiAndmctbmF2LWxnJyxcclxuXHRcdE1EOiAndmctbmF2LW1kJyxcclxuXHRcdFNNOiAndmctbmF2LXNtJyxcclxuXHRcdFhTOiAndmctbmF2LXhzJ1xyXG5cdH0sXHJcblx0ZXhwYW5kOiB0cnVlLFxyXG5cdGhvdmVyOiBmYWxzZSxcclxuXHRwb3NpdGlvbjogdHJ1ZSxcclxuXHRjb2xsYXBzZTogdHJ1ZSxcclxuXHR0b2dnbGU6ICc8c3BhbiBjbGFzcz1cImRlZmF1bHRcIj48L3NwYW4+JyxcclxuXHRoYW1idXJnZXI6IHtcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdGJvZHk6IG51bGxcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiBub29wLFxyXG5cdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHTmF2IGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IG51bGw7XHJcblx0XHR0aGlzLm5hdmlnYXRpb24gPSAnLicgKyB0aGlzLnBhcmFtcy5jbGFzc2VzLndyYXBwZXI7XHJcblxyXG5cdFx0dGhpcy5tb3ZlZExpbmtzID0gW107XHJcblx0XHR0aGlzLiRsaW5rcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuJyArIHRoaXMucGFyYW1zLmNsYXNzZXMud3JhcHBlciArICcgPiBsaScsIHRoaXMubmF2aWdhdGlvbilcclxuXHJcblx0XHRpZiAodGhpcy5wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0Z2V0IG5hdmlnYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcclxuXHR9XHJcblxyXG5cdHNldCBuYXZpZ2F0aW9uKGVsKSB7XHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gU2VsZWN0b3JzLmdldChlbCwgdGhpcy5lbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0aWYgKCF0aGlzLm5hdmlnYXRpb24pIHJldHVybjtcclxuXHJcblx0XHRsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcblxyXG5cdFx0Ly8g0JLQtdGI0LDQtdC8INC+0YHQvdC+0LLQvdGL0LUg0LrQu9Cw0YHRgdGLXHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5jb250YWluZXIpO1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLnBsYWNlbWVudCk7XHJcblxyXG5cdFx0Ly8g0JXRgdC70Lgg0L3Rg9C20L3QviDQvtGB0YLQsNCy0LjRgtGMINGB0L/QuNGB0L7QuiDQvNC10L3RjiDQuNC70Lgg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0LzQtdC00LjQsCDRgtC+0YfQutGDXHJcblx0XHRpZiAocGFyYW1zLmJyZWFrcG9pbnQgPT09IG51bGwpIHtcclxuXHRcdFx0cGFyYW1zLmV4cGFuZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXJhbXMuYnJlYWtwb2ludCA9PT0gbnVsbCB8fCAhcGFyYW1zLmV4cGFuZCkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5leHBhbmQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLmJyZWFrcG9pbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCc0LXQvdGOINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCwg0LXRgdC70Lgg0Y3RgtC+INC90LUg0LzQvtCx0LjQu9GM0L3QvtC1INGD0YHRgtGA0L7QudGB0YLQstC+XHJcblx0XHRpZiAocGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHJcblx0XHRcdGlmIChSZXNwb25zaXZlLmNoZWNrTW9iaWxlT3JUYWJsZXQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INCz0LDQvNCx0YPRgNCz0LXRgCwg0LXRgdC70Lgg0LXQs9C+INC90LXRgiDQsiDRgNCw0LfQvNC10YLQutC1XHJcblx0XHRpZiAocGFyYW1zLmV4cGFuZCAmJiAhcGFyYW1zLmhhbWJ1cmdlci5ib2R5KSB7XHJcblx0XHRcdGxldCBpc0hhbWJ1cmdlciA9IFNlbGVjdG9ycy5maW5kT25lKCcuJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciwgdGhpcy5lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChpc0hhbWJ1cmdlciA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBtVGl0bGUgPSAnJyxcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS1saW5lc1wiPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci50aXRsZSkge1xyXG5cdFx0XHRcdFx0bVRpdGxlID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLXRpdGxlXCI+JysgcGFyYW1zLmhhbWJ1cmdlci50aXRsZSArJzwvc3Bhbj4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIuYm9keSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gcGFyYW1zLmhhbWJ1cmdlci5ib2R5O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsJzxhIGhyZWY9XCIjc2lkZWJhci1uYXZcIiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnXCIgZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCI+JyArIG1UaXRsZSArIGhhbWJ1cmdlciArJzwvYT4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INGD0LrQsNC30LDRgtC10LvRjCDQv9C10YDQtdC60LvRjtGH0LDRgtC10LvRj1xyXG5cdFx0aWYgKHBhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0bGV0ICRkcm9wZG93bl9hID0gWy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd24tbWVnYSA+IGEsIC5kcm9wZG93biA+IGEnLCB0aGlzLmVsZW1lbnQpXSxcclxuXHRcdFx0XHR0b2dnbGUgPSAnPHNwYW4gY2xhc3M9XCJ0b2dnbGVcIj4nICsgcGFyYW1zLnRvZ2dsZSArICc8L3NwYW4+JztcclxuXHJcblx0XHRcdGlmICgkZHJvcGRvd25fYS5sZW5ndGgpIHtcclxuXHRcdFx0XHQkZHJvcGRvd25fYS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVsZW0ucXVlcnlTZWxlY3RvcignLnRvZ2dsZScpICYmICFlbGVtLmNsb3Nlc3QoJy5kb3RzJykpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG5cdFx0XHRcdFx0XHRlbGVtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdG9nZ2xlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtcy5jb2xsYXBzZSAmJiBSZXNwb25zaXZlLmNoZWNrKHRoaXMpICYmIHBhcmFtcy5wbGFjZW1lbnQgIT09ICd2ZXJ0aWNhbCcpIHtcclxuXHRcdFx0c2V0Q29sbGFwc2UodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdhZnRlckluaXQnIGluIHRoaXMucGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUodGhpcy5wYXJhbXMuY2FsbGJhY2suYWZ0ZXJJbml0LCBbdGhpc10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICog0KTRg9C90LrRhtC40Y8g0YHQstC+0YDQsNGH0LjQstCw0L3QuNGPXHJcblx0XHQgKiBUT0RPINCf0YDQuNC00YPQvNCw0YLRjCDRh9GC0L4g0YLQviDRgSDQvNC10LPQsCDQvNC10L3Rjiwg0LrQvtGC0L7RgNC+0LUg0YPRhdC+0LTQuNGCINCyINC/0L7QtNC80LXQvdGOXHJcblx0XHQgKiBUT0RPINCi0LDQuiDQttC1INC10YHRgtGMINC60L7RgdGP0LrQuCDQv9GA0Lgg0YDQtdGB0LDQudC30LVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0Q29sbGFwc2UoX3RoaXMpIHtcclxuXHRcdFx0bGV0IHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSA9IF90aGlzLm5hdmlnYXRpb24uY2xpZW50V2lkdGgsXHJcblx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAwLFxyXG5cdFx0XHRcdCRkb3RzID0gU2VsZWN0b3JzLmZpbmRPbmUoJy5kb3RzJywgX3RoaXMubmF2aWdhdGlvbiksXHJcblx0XHRcdFx0X2RvdHMgPSBnZXRTVkcoJ2RvdHMnKTtcclxuXHJcblx0XHRcdGlmIChfdGhpcy4kbGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9ICRkb3RzLmNsaWVudFdpZHRoXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCAkYSA9IFNlbGVjdG9ycy5maW5kT25lKCdhJywgX3RoaXMuJGxpbmtzWzBdKSxcclxuXHRcdFx0XHRcdFx0JGxpbmtTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoJGEpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nTGVmdC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSAgbm9ybWFsaXplRGF0YSgkbGlua1N0eWxlLnBhZGRpbmdSaWdodC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nID0gcGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQ7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQstC10YDQvdC+LCDQvdC+INC80Ysg0YLQvtGH0L3QviDQt9C90LDQtdC8INGI0LjRgNC40L3RgyDRgtC+0YfQtdC6INCyIHN2ZyAtIDE2cHhcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gcGFkZGluZyArIDE2O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgJGxpbmsgb2YgX3RoaXMuJGxpbmtzKSB7XHJcblx0XHRcdFx0XHRsZXQgd2lkdGggPSAkbGluay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgKyB3aWR0aDtcclxuXHJcblx0XHRcdFx0XHRpZiAoKHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSkgPCB3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlZExpbmtzLnB1c2goJGxpbmspO1xyXG5cdFx0XHRcdFx0XHQkbGluay5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRCZWZvcmUoX3RoaXMubW92ZWRMaW5rc1swXSwgJGRvdHMpXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uYXBwZW5kQ2hpbGQoX3RoaXMubW92ZWRMaW5rc1swXSlcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5zcGxpY2UoMCwgMSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0aWYgKCEkZG90cykge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywnPGxpIGNsYXNzPVwiZHJvcGRvd24gZG90c1wiPicgKyAnPGEgaHJlZj1cIiNcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4nKyBfZG90cyArJzwvYT48L2xpPicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0JGRvdHMucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgJGQgPSBfdGhpcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5kb3RzJyk7XHJcblx0XHRcdFx0aWYgKCRkICYmIF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gJGQucXVlcnlTZWxlY3RvcigndWwnKTtcclxuXHRcdFx0XHRcdGlmICgkZHJvcGRvd24pIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBfdGhpcy5tb3ZlZExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdFx0JGRyb3Bkb3duLnByZXBlbmQobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCAkZHJvcGRvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd24tY29udGVudCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQkZC5hcHBlbmRDaGlsZCgkZHJvcGRvd24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRsZXQgdGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICghdGFyZ2V0IHx8IGlzRGlzYWJsZWQodGFyZ2V0KSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duLWNvbnRlbnQnKSkge1xyXG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCgnZmlyc3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRsZXQgZHJvcCA9IFNlbGVjdG9ycy5maW5kT25lKCcuZHJvcGRvd24tY29udGVudCcsIHRhcmdldCksXHJcblx0XHRcdGxpbmsgPSB0YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG5cdFx0aWYgKGxpbmspIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuXHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cclxuXHRcdHNldERyb3BQb3NpdGlvbihkcm9wKVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgZHJvcCwgdHJ1ZSwgNTApO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSAkZHJvcFxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBzZXREcm9wUG9zaXRpb24oJGRyb3ApIHtcclxuXHRcdFx0bGV0IHt3aWR0aCwgcmlnaHR9ID0gJGRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdFx0d2luZG93X3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG5cdFx0XHRsZXQgTl9yaWdodCA9IHdpbmRvd193aWR0aCAtIHJpZ2h0IC0gd2lkdGg7XHJcblxyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdsZWZ0Jyk7XHJcblxyXG5cdFx0XHRsZXQgJHBhcmVudCA9ICRkcm9wLmNsb3Nlc3QoJ2xpJyksXHJcblx0XHRcdFx0JHVsID0gJHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCd1bCcpO1xyXG5cclxuXHRcdFx0aWYgKE5fcmlnaHQgPiB3aWR0aCkge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCAkZWwgb2YgJHVsKSB7XHJcblx0XHRcdFx0XHQkZWwuY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoJ2VsbScgaW4gcmVsYXRlZFRhcmdldCAmJiByZWxhdGVkVGFyZ2V0LmVsbSkge1xyXG5cdFx0XHRlbGVtZW50ID0gcmVsYXRlZFRhcmdldC5lbG1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZWxlbWVudCkge1xyXG5cdFx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihlbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZmlyc3QnKSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlyc3QnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuJyArIENMQVNTX05BTUVfU0hPVywgZWxlbWVudCldLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xyXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRcdFx0bGV0IHBhcmVudCA9IGVsLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGxpbmsgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0XHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoZWwsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0X3RoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgZWwsIHRydWUsIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRPRE8g0LXRgdC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtC1INC90LXRgdC60L7Qu9GM0LrQviDQvdCw0LLQuNCz0LDRhtC40LksINGC0L4g0LXRgdGC0Ywg0LrQvtGB0Y/QutC4XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdOYXYuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHJcblx0XHRsZXQgZHJvcHMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duJywgaW5zdGFuY2UuX25hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLnBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRbLi4uZHJvcHNdLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGlmICghaW5zdGFuY2UubmF2aWdhdGlvbi5jb250YWlucyh0YXJnZXQpKSByZXR1cm47XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldDogdGFyZ2V0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2Uuc2hvdyhyZWxhdGVkVGFyZ2V0KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyksXHJcblx0XHRcdFx0XHRcdGVsbSA9IGN1cnJlbnRFbGVtO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGVsbTogZWxtfSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghTWFuaXB1bGF0b3IuaGFzKHRoaXMsICdhcmlhLWV4cGFuZGVkJykpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICgnY2xpY2snIGluIGluc3RhbmNlLnBhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0ZXhlY3V0ZShpbnN0YW5jZS5wYXJhbXMuY2FsbGJhY2suY2xpY2ssIFt0aGlzXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXMuY2xvc2VzdCgnLnZnLW5hdicpLFxyXG5cdFx0XHRcdFx0aXNGaXJzdCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmZpcnN0Jyk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSB0aGlzLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGlmIChpc0Rpc2FibGVkKHRhcmdldCkgJiYgIWlzVmlzaWJsZSh0YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaXNGaXJzdCAmJiB0aGlzLmNsb3Nlc3QoJy5maXJzdCcpKSB7XHJcblx0XHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogdGFyZ2V0fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuYWN0aXZlJywgc2VsZildLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlbCAmJiBlbCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogZWx9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB2Z05hdlNpZGViYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhci1uYXYnKTtcclxuXHRcdGxldCBoYW1idXJnZXIgPSBpbnN0YW5jZS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaW5zdGFuY2UucGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyKTtcclxuXHJcblx0XHRpZiAodmdOYXZTaWRlYmFyICYmIGhhbWJ1cmdlcikge1xyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5zaG93JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLnBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuaGlkZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZShpbnN0YW5jZS5wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ecm9wcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpLmFjdGl2ZScpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR05hdi5nZXRJbnN0YW5jZSh0b2dnbGUuY2xvc2VzdCgnLnZnLW5hdicpKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSBjb250aW51ZTtcclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRvZ2dsZSB9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdHJlbGF0ZWRUYXJnZXQuY2xpY2tFdmVudCA9IGV2ZW50XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHQuaGlkZShyZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfUkVTSVpFX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoJy52Zy1uYXYnLCB7fSk7XHJcblx0aW5zdGFuY2UuYnVpbGQoKTtcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHTmF2OyIsInZhciBCcm93c2Vyc2xpc3RFcnJvciA9IHJlcXVpcmUoJy4vZXJyb3InKVxuXG5mdW5jdGlvbiBub29wKCkge31cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxvYWRRdWVyaWVzOiBmdW5jdGlvbiBsb2FkUXVlcmllcygpIHtcbiAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAnU2hhcmFibGUgY29uZmlncyBhcmUgbm90IHN1cHBvcnRlZCBpbiBjbGllbnQtc2lkZSBidWlsZCBvZiBCcm93c2Vyc2xpc3QnXG4gICAgKVxuICB9LFxuXG4gIGdldFN0YXQ6IGZ1bmN0aW9uIGdldFN0YXQob3B0cykge1xuICAgIHJldHVybiBvcHRzLnN0YXRzXG4gIH0sXG5cbiAgbG9hZENvbmZpZzogZnVuY3Rpb24gbG9hZENvbmZpZyhvcHRzKSB7XG4gICAgaWYgKG9wdHMuY29uZmlnKSB7XG4gICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAgICdCcm93c2Vyc2xpc3QgY29uZmlnIGFyZSBub3Qgc3VwcG9ydGVkIGluIGNsaWVudC1zaWRlIGJ1aWxkJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICBsb2FkQ291bnRyeTogZnVuY3Rpb24gbG9hZENvdW50cnkoKSB7XG4gICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKFxuICAgICAgJ0NvdW50cnkgc3RhdGlzdGljcyBhcmUgbm90IHN1cHBvcnRlZCAnICtcbiAgICAgICAgJ2luIGNsaWVudC1zaWRlIGJ1aWxkIG9mIEJyb3dzZXJzbGlzdCdcbiAgICApXG4gIH0sXG5cbiAgbG9hZEZlYXR1cmU6IGZ1bmN0aW9uIGxvYWRGZWF0dXJlKCkge1xuICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICdTdXBwb3J0cyBxdWVyaWVzIGFyZSBub3QgYXZhaWxhYmxlIGluIGNsaWVudC1zaWRlIGJ1aWxkIG9mIEJyb3dzZXJzbGlzdCdcbiAgICApXG4gIH0sXG5cbiAgY3VycmVudE5vZGU6IGZ1bmN0aW9uIGN1cnJlbnROb2RlKHJlc29sdmUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVzb2x2ZShbJ21haW50YWluZWQgbm9kZSB2ZXJzaW9ucyddLCBjb250ZXh0KVswXVxuICB9LFxuXG4gIHBhcnNlQ29uZmlnOiBub29wLFxuXG4gIHJlYWRDb25maWc6IG5vb3AsXG5cbiAgZmluZENvbmZpZzogbm9vcCxcblxuICBmaW5kQ29uZmlnRmlsZTogbm9vcCxcblxuICBjbGVhckNhY2hlczogbm9vcCxcblxuICBvbGREYXRhV2FybmluZzogbm9vcCxcblxuICBlbnY6IHt9XG59XG4iLCJmdW5jdGlvbiBCcm93c2Vyc2xpc3RFcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubmFtZSA9ICdCcm93c2Vyc2xpc3RFcnJvcidcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICB0aGlzLmJyb3dzZXJzbGlzdCA9IHRydWVcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgQnJvd3NlcnNsaXN0RXJyb3IpXG4gIH1cbn1cblxuQnJvd3NlcnNsaXN0RXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlXG5cbm1vZHVsZS5leHBvcnRzID0gQnJvd3NlcnNsaXN0RXJyb3JcbiIsInZhciBqc1JlbGVhc2VzID0gcmVxdWlyZSgnbm9kZS1yZWxlYXNlcy9kYXRhL3Byb2Nlc3NlZC9lbnZzLmpzb24nKVxudmFyIGFnZW50cyA9IHJlcXVpcmUoJ2Nhbml1c2UtbGl0ZS9kaXN0L3VucGFja2VyL2FnZW50cycpLmFnZW50c1xudmFyIGUyYyA9IHJlcXVpcmUoJ2VsZWN0cm9uLXRvLWNocm9taXVtL3ZlcnNpb25zJylcbnZhciBqc0VPTCA9IHJlcXVpcmUoJ25vZGUtcmVsZWFzZXMvZGF0YS9yZWxlYXNlLXNjaGVkdWxlL3JlbGVhc2Utc2NoZWR1bGUuanNvbicpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG52YXIgQnJvd3NlcnNsaXN0RXJyb3IgPSByZXF1aXJlKCcuL2Vycm9yJylcbnZhciBlbnYgPSByZXF1aXJlKCcuL25vZGUnKVxudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpIC8vIFdpbGwgbG9hZCBicm93c2VyLmpzIGluIHdlYnBhY2tcblxudmFyIFlFQVIgPSAzNjUuMjU5NjQxICogMjQgKiA2MCAqIDYwICogMTAwMFxudmFyIEFORFJPSURfRVZFUkdSRUVOX0ZJUlNUID0gJzM3J1xudmFyIE9QX01PQl9CTElOS19GSVJTVCA9IDE0XG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gaXNWZXJzaW9uc01hdGNoKHZlcnNpb25BLCB2ZXJzaW9uQikge1xuICByZXR1cm4gKHZlcnNpb25BICsgJy4nKS5pbmRleE9mKHZlcnNpb25CICsgJy4nKSA9PT0gMFxufVxuXG5mdW5jdGlvbiBpc0VvbFJlbGVhc2VkKG5hbWUpIHtcbiAgdmFyIHZlcnNpb24gPSBuYW1lLnNsaWNlKDEpXG4gIHJldHVybiBicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zLnNvbWUoZnVuY3Rpb24gKGkpIHtcbiAgICByZXR1cm4gaXNWZXJzaW9uc01hdGNoKGksIHZlcnNpb24pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSh2ZXJzaW9ucykge1xuICByZXR1cm4gdmVyc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ZXJzaW9uID09PSAnc3RyaW5nJ1xuICB9KVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVFbGVjdHJvbih2ZXJzaW9uKSB7XG4gIHZhciB2ZXJzaW9uVG9Vc2UgPSB2ZXJzaW9uXG4gIGlmICh2ZXJzaW9uLnNwbGl0KCcuJykubGVuZ3RoID09PSAzKSB7XG4gICAgdmVyc2lvblRvVXNlID0gdmVyc2lvbi5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcuJylcbiAgfVxuICByZXR1cm4gdmVyc2lvblRvVXNlXG59XG5cbmZ1bmN0aW9uIG5hbWVNYXBwZXIobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24gbWFwTmFtZSh2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIG5hbWUgKyAnICcgKyB2ZXJzaW9uXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWFqb3IodmVyc2lvbikge1xuICByZXR1cm4gcGFyc2VJbnQodmVyc2lvbi5zcGxpdCgnLicpWzBdKVxufVxuXG5mdW5jdGlvbiBnZXRNYWpvclZlcnNpb25zKHJlbGVhc2VkLCBudW1iZXIpIHtcbiAgaWYgKHJlbGVhc2VkLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdXG4gIHZhciBtYWpvclZlcnNpb25zID0gdW5pcShyZWxlYXNlZC5tYXAoZ2V0TWFqb3IpKVxuICB2YXIgbWluaW11bSA9IG1ham9yVmVyc2lvbnNbbWFqb3JWZXJzaW9ucy5sZW5ndGggLSBudW1iZXJdXG4gIGlmICghbWluaW11bSkge1xuICAgIHJldHVybiByZWxlYXNlZFxuICB9XG4gIHZhciBzZWxlY3RlZCA9IFtdXG4gIGZvciAodmFyIGkgPSByZWxlYXNlZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChtaW5pbXVtID4gZ2V0TWFqb3IocmVsZWFzZWRbaV0pKSBicmVha1xuICAgIHNlbGVjdGVkLnVuc2hpZnQocmVsZWFzZWRbaV0pXG4gIH1cbiAgcmV0dXJuIHNlbGVjdGVkXG59XG5cbmZ1bmN0aW9uIHVuaXEoYXJyYXkpIHtcbiAgdmFyIGZpbHRlcmVkID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChmaWx0ZXJlZC5pbmRleE9mKGFycmF5W2ldKSA9PT0gLTEpIGZpbHRlcmVkLnB1c2goYXJyYXlbaV0pXG4gIH1cbiAgcmV0dXJuIGZpbHRlcmVkXG59XG5cbmZ1bmN0aW9uIGZpbGxVc2FnZShyZXN1bHQsIG5hbWUsIGRhdGEpIHtcbiAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgcmVzdWx0W25hbWUgKyAnICcgKyBpXSA9IGRhdGFbaV1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUZpbHRlcihzaWduLCB2ZXJzaW9uKSB7XG4gIHZlcnNpb24gPSBwYXJzZUZsb2F0KHZlcnNpb24pXG4gIGlmIChzaWduID09PSAnPicpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiBwYXJzZUxhdGVzdEZsb2F0KHYpID4gdmVyc2lvblxuICAgIH1cbiAgfSBlbHNlIGlmIChzaWduID09PSAnPj0nKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICByZXR1cm4gcGFyc2VMYXRlc3RGbG9hdCh2KSA+PSB2ZXJzaW9uXG4gICAgfVxuICB9IGVsc2UgaWYgKHNpZ24gPT09ICc8Jykge1xuICAgIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodikgPCB2ZXJzaW9uXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodikgPD0gdmVyc2lvblxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTGF0ZXN0RmxvYXQodikge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHYuc3BsaXQoJy0nKVsxXSB8fCB2KVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2VtdmVyRmlsdGVyKHNpZ24sIHZlcnNpb24pIHtcbiAgdmVyc2lvbiA9IHZlcnNpb24uc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gIHZlcnNpb25bMV0gPSB2ZXJzaW9uWzFdIHx8IDBcbiAgdmVyc2lvblsyXSA9IHZlcnNpb25bMl0gfHwgMFxuICBpZiAoc2lnbiA9PT0gJz4nKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICB2ID0gdi5zcGxpdCgnLicpLm1hcChwYXJzZVNpbXBsZUludClcbiAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyKHYsIHZlcnNpb24pID4gMFxuICAgIH1cbiAgfSBlbHNlIGlmIChzaWduID09PSAnPj0nKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICB2ID0gdi5zcGxpdCgnLicpLm1hcChwYXJzZVNpbXBsZUludClcbiAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyKHYsIHZlcnNpb24pID49IDBcbiAgICB9XG4gIH0gZWxzZSBpZiAoc2lnbiA9PT0gJzwnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICB2ID0gdi5zcGxpdCgnLicpLm1hcChwYXJzZVNpbXBsZUludClcbiAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyKHZlcnNpb24sIHYpID4gMFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgIHYgPSB2LnNwbGl0KCcuJykubWFwKHBhcnNlU2ltcGxlSW50KVxuICAgICAgcmV0dXJuIGNvbXBhcmVTZW12ZXIodmVyc2lvbiwgdikgPj0gMFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVNpbXBsZUludCh4KSB7XG4gIHJldHVybiBwYXJzZUludCh4KVxufVxuXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSByZXR1cm4gLTFcbiAgaWYgKGEgPiBiKSByZXR1cm4gKzFcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29tcGFyZVNlbXZlcihhLCBiKSB7XG4gIHJldHVybiAoXG4gICAgY29tcGFyZShwYXJzZUludChhWzBdKSwgcGFyc2VJbnQoYlswXSkpIHx8XG4gICAgY29tcGFyZShwYXJzZUludChhWzFdIHx8ICcwJyksIHBhcnNlSW50KGJbMV0gfHwgJzAnKSkgfHxcbiAgICBjb21wYXJlKHBhcnNlSW50KGFbMl0gfHwgJzAnKSwgcGFyc2VJbnQoYlsyXSB8fCAnMCcpKVxuICApXG59XG5cbi8vIHRoaXMgZm9sbG93cyB0aGUgbnBtLWxpa2Ugc2VtdmVyIGJlaGF2aW9yXG5mdW5jdGlvbiBzZW12ZXJGaWx0ZXJMb29zZShvcGVyYXRvciwgcmFuZ2UpIHtcbiAgcmFuZ2UgPSByYW5nZS5zcGxpdCgnLicpLm1hcChwYXJzZVNpbXBsZUludClcbiAgaWYgKHR5cGVvZiByYW5nZVsxXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByYW5nZVsxXSA9ICd4J1xuICB9XG4gIC8vIGlnbm9yZSBhbnkgcGF0Y2ggdmVyc2lvbiBiZWNhdXNlIHdlIG9ubHkgcmV0dXJuIG1pbm9yIHZlcnNpb25zXG4gIC8vIHJhbmdlWzJdID0gJ3gnXG4gIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICBjYXNlICc8PSc6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24uc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gICAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyTG9vc2UodmVyc2lvbiwgcmFuZ2UpIDw9IDBcbiAgICAgIH1cbiAgICBjYXNlICc+PSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgICB2ZXJzaW9uID0gdmVyc2lvbi5zcGxpdCgnLicpLm1hcChwYXJzZVNpbXBsZUludClcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVTZW12ZXJMb29zZSh2ZXJzaW9uLCByYW5nZSkgPj0gMFxuICAgICAgfVxuICB9XG59XG5cbi8vIHRoaXMgZm9sbG93cyB0aGUgbnBtLWxpa2Ugc2VtdmVyIGJlaGF2aW9yXG5mdW5jdGlvbiBjb21wYXJlU2VtdmVyTG9vc2UodmVyc2lvbiwgcmFuZ2UpIHtcbiAgaWYgKHZlcnNpb25bMF0gIT09IHJhbmdlWzBdKSB7XG4gICAgcmV0dXJuIHZlcnNpb25bMF0gPCByYW5nZVswXSA/IC0xIDogKzFcbiAgfVxuICBpZiAocmFuZ2VbMV0gPT09ICd4Jykge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHZlcnNpb25bMV0gIT09IHJhbmdlWzFdKSB7XG4gICAgcmV0dXJuIHZlcnNpb25bMV0gPCByYW5nZVsxXSA/IC0xIDogKzFcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiByZXNvbHZlVmVyc2lvbihkYXRhLCB2ZXJzaW9uKSB7XG4gIGlmIChkYXRhLnZlcnNpb25zLmluZGV4T2YodmVyc2lvbikgIT09IC0xKSB7XG4gICAgcmV0dXJuIHZlcnNpb25cbiAgfSBlbHNlIGlmIChicm93c2Vyc2xpc3QudmVyc2lvbkFsaWFzZXNbZGF0YS5uYW1lXVt2ZXJzaW9uXSkge1xuICAgIHJldHVybiBicm93c2Vyc2xpc3QudmVyc2lvbkFsaWFzZXNbZGF0YS5uYW1lXVt2ZXJzaW9uXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZlcnNpb24oZGF0YSwgdmVyc2lvbikge1xuICB2YXIgcmVzb2x2ZWQgPSByZXNvbHZlVmVyc2lvbihkYXRhLCB2ZXJzaW9uKVxuICBpZiAocmVzb2x2ZWQpIHtcbiAgICByZXR1cm4gcmVzb2x2ZWRcbiAgfSBlbHNlIGlmIChkYXRhLnZlcnNpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBkYXRhLnZlcnNpb25zWzBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyQnlZZWFyKHNpbmNlLCBjb250ZXh0KSB7XG4gIHNpbmNlID0gc2luY2UgLyAxMDAwXG4gIHJldHVybiBPYmplY3Qua2V5cyhhZ2VudHMpLnJlZHVjZShmdW5jdGlvbiAoc2VsZWN0ZWQsIG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IGJ5TmFtZShuYW1lLCBjb250ZXh0KVxuICAgIGlmICghZGF0YSkgcmV0dXJuIHNlbGVjdGVkXG4gICAgdmFyIHZlcnNpb25zID0gT2JqZWN0LmtleXMoZGF0YS5yZWxlYXNlRGF0ZSkuZmlsdGVyKGZ1bmN0aW9uICh2KSB7XG4gICAgICB2YXIgZGF0ZSA9IGRhdGEucmVsZWFzZURhdGVbdl1cbiAgICAgIHJldHVybiBkYXRlICE9PSBudWxsICYmIGRhdGUgPj0gc2luY2VcbiAgICB9KVxuICAgIHJldHVybiBzZWxlY3RlZC5jb25jYXQodmVyc2lvbnMubWFwKG5hbWVNYXBwZXIoZGF0YS5uYW1lKSkpXG4gIH0sIFtdKVxufVxuXG5mdW5jdGlvbiBjbG9uZURhdGEoZGF0YSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICB2ZXJzaW9uczogZGF0YS52ZXJzaW9ucyxcbiAgICByZWxlYXNlZDogZGF0YS5yZWxlYXNlZCxcbiAgICByZWxlYXNlRGF0ZTogZGF0YS5yZWxlYXNlRGF0ZVxuICB9XG59XG5cbmZ1bmN0aW9uIGJ5TmFtZShuYW1lLCBjb250ZXh0KSB7XG4gIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKClcbiAgbmFtZSA9IGJyb3dzZXJzbGlzdC5hbGlhc2VzW25hbWVdIHx8IG5hbWVcbiAgaWYgKGNvbnRleHQubW9iaWxlVG9EZXNrdG9wICYmIGJyb3dzZXJzbGlzdC5kZXNrdG9wTmFtZXNbbmFtZV0pIHtcbiAgICB2YXIgZGVza3RvcCA9IGJyb3dzZXJzbGlzdC5kYXRhW2Jyb3dzZXJzbGlzdC5kZXNrdG9wTmFtZXNbbmFtZV1dXG4gICAgaWYgKG5hbWUgPT09ICdhbmRyb2lkJykge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZUFuZHJvaWREYXRhKGNsb25lRGF0YShicm93c2Vyc2xpc3QuZGF0YVtuYW1lXSksIGRlc2t0b3ApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjbG9uZWQgPSBjbG9uZURhdGEoZGVza3RvcClcbiAgICAgIGNsb25lZC5uYW1lID0gbmFtZVxuICAgICAgcmV0dXJuIGNsb25lZFxuICAgIH1cbiAgfVxuICByZXR1cm4gYnJvd3NlcnNsaXN0LmRhdGFbbmFtZV1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQW5kcm9pZFZlcnNpb25zKGFuZHJvaWRWZXJzaW9ucywgY2hyb21lVmVyc2lvbnMpIHtcbiAgdmFyIGlGaXJzdEV2ZXJncmVlbiA9IGNocm9tZVZlcnNpb25zLmluZGV4T2YoQU5EUk9JRF9FVkVSR1JFRU5fRklSU1QpXG4gIHJldHVybiBhbmRyb2lkVmVyc2lvbnNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICByZXR1cm4gL14oPzpbMi00XVxcLnxbMzRdJCkvLnRlc3QodmVyc2lvbilcbiAgICB9KVxuICAgIC5jb25jYXQoY2hyb21lVmVyc2lvbnMuc2xpY2UoaUZpcnN0RXZlcmdyZWVuKSlcbn1cblxuZnVuY3Rpb24gY29weU9iamVjdChvYmopIHtcbiAgdmFyIGNvcHkgPSB7fVxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgY29weVtrZXldID0gb2JqW2tleV1cbiAgfVxuICByZXR1cm4gY29weVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVBbmRyb2lkRGF0YShhbmRyb2lkLCBjaHJvbWUpIHtcbiAgYW5kcm9pZC5yZWxlYXNlZCA9IG5vcm1hbGl6ZUFuZHJvaWRWZXJzaW9ucyhhbmRyb2lkLnJlbGVhc2VkLCBjaHJvbWUucmVsZWFzZWQpXG4gIGFuZHJvaWQudmVyc2lvbnMgPSBub3JtYWxpemVBbmRyb2lkVmVyc2lvbnMoYW5kcm9pZC52ZXJzaW9ucywgY2hyb21lLnZlcnNpb25zKVxuICBhbmRyb2lkLnJlbGVhc2VEYXRlID0gY29weU9iamVjdChhbmRyb2lkLnJlbGVhc2VEYXRlKVxuICBhbmRyb2lkLnJlbGVhc2VkLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAoYW5kcm9pZC5yZWxlYXNlRGF0ZVt2XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhbmRyb2lkLnJlbGVhc2VEYXRlW3ZdID0gY2hyb21lLnJlbGVhc2VEYXRlW3ZdXG4gICAgfVxuICB9KVxuICByZXR1cm4gYW5kcm9pZFxufVxuXG5mdW5jdGlvbiBjaGVja05hbWUobmFtZSwgY29udGV4dCkge1xuICB2YXIgZGF0YSA9IGJ5TmFtZShuYW1lLCBjb250ZXh0KVxuICBpZiAoIWRhdGEpIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcignVW5rbm93biBicm93c2VyICcgKyBuYW1lKVxuICByZXR1cm4gZGF0YVxufVxuXG5mdW5jdGlvbiB1bmtub3duUXVlcnkocXVlcnkpIHtcbiAgcmV0dXJuIG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAnVW5rbm93biBicm93c2VyIHF1ZXJ5IGAnICtcbiAgICAgIHF1ZXJ5ICtcbiAgICAgICdgLiAnICtcbiAgICAgICdNYXliZSB5b3UgYXJlIHVzaW5nIG9sZCBCcm93c2Vyc2xpc3Qgb3IgbWFkZSB0eXBvIGluIHF1ZXJ5LidcbiAgKVxufVxuXG4vLyBBZGp1c3RzIGxhc3QgWCB2ZXJzaW9ucyBxdWVyaWVzIGZvciBzb21lIG1vYmlsZSBicm93c2Vycyxcbi8vIHdoZXJlIGNhbml1c2UgZGF0YSBqdW1wcyBmcm9tIGEgbGVnYWN5IHZlcnNpb24gdG8gdGhlIGxhdGVzdFxuZnVuY3Rpb24gZmlsdGVySnVtcHMobGlzdCwgbmFtZSwgblZlcnNpb25zLCBjb250ZXh0KSB7XG4gIHZhciBqdW1wID0gMVxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlICdhbmRyb2lkJzpcbiAgICAgIGlmIChjb250ZXh0Lm1vYmlsZVRvRGVza3RvcCkgcmV0dXJuIGxpc3RcbiAgICAgIHZhciByZWxlYXNlZCA9IGJyb3dzZXJzbGlzdC5kYXRhLmNocm9tZS5yZWxlYXNlZFxuICAgICAganVtcCA9IHJlbGVhc2VkLmxlbmd0aCAtIHJlbGVhc2VkLmluZGV4T2YoQU5EUk9JRF9FVkVSR1JFRU5fRklSU1QpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ29wX21vYic6XG4gICAgICB2YXIgbGF0ZXN0ID0gYnJvd3NlcnNsaXN0LmRhdGEub3BfbW9iLnJlbGVhc2VkLnNsaWNlKC0xKVswXVxuICAgICAganVtcCA9IGdldE1ham9yKGxhdGVzdCkgLSBPUF9NT0JfQkxJTktfRklSU1QgKyAxXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbGlzdFxuICB9XG4gIGlmIChuVmVyc2lvbnMgPD0ganVtcCkge1xuICAgIHJldHVybiBsaXN0LnNsaWNlKC0xKVxuICB9XG4gIHJldHVybiBsaXN0LnNsaWNlKGp1bXAgLSAxIC0gblZlcnNpb25zKVxufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZChmbGFncywgd2l0aFBhcnRpYWwpIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgZmxhZ3MgPT09ICdzdHJpbmcnICYmXG4gICAgKGZsYWdzLmluZGV4T2YoJ3knKSA+PSAwIHx8ICh3aXRoUGFydGlhbCAmJiBmbGFncy5pbmRleE9mKCdhJykgPj0gMCkpXG4gIClcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShxdWVyaWVzLCBjb250ZXh0KSB7XG4gIHJldHVybiBwYXJzZShRVUVSSUVTLCBxdWVyaWVzKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgbm9kZSwgaW5kZXgpIHtcbiAgICBpZiAobm9kZS5ub3QgJiYgaW5kZXggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICAgJ1dyaXRlIGFueSBicm93c2VycyBxdWVyeSAoZm9yIGluc3RhbmNlLCBgZGVmYXVsdHNgKSAnICtcbiAgICAgICAgICAnYmVmb3JlIGAnICtcbiAgICAgICAgICBub2RlLnF1ZXJ5ICtcbiAgICAgICAgICAnYCdcbiAgICAgIClcbiAgICB9XG4gICAgdmFyIHR5cGUgPSBRVUVSSUVTW25vZGUudHlwZV1cbiAgICB2YXIgYXJyYXkgPSB0eXBlLnNlbGVjdC5jYWxsKGJyb3dzZXJzbGlzdCwgY29udGV4dCwgbm9kZSkubWFwKGZ1bmN0aW9uIChqKSB7XG4gICAgICB2YXIgcGFydHMgPSBqLnNwbGl0KCcgJylcbiAgICAgIGlmIChwYXJ0c1sxXSA9PT0gJzAnKSB7XG4gICAgICAgIHJldHVybiBwYXJ0c1swXSArICcgJyArIGJ5TmFtZShwYXJ0c1swXSwgY29udGV4dCkudmVyc2lvbnNbMF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBqXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmIChub2RlLmNvbXBvc2UgPT09ICdhbmQnKSB7XG4gICAgICBpZiAobm9kZS5ub3QpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5maWx0ZXIoZnVuY3Rpb24gKGopIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihqKSA9PT0gLTFcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuZmlsdGVyKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaikgIT09IC0xXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub2RlLm5vdCkge1xuICAgICAgICB2YXIgZmlsdGVyID0ge31cbiAgICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoaikge1xuICAgICAgICAgIGZpbHRlcltqXSA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5maWx0ZXIoZnVuY3Rpb24gKGopIHtcbiAgICAgICAgICByZXR1cm4gIWZpbHRlcltqXVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdC5jb25jYXQoYXJyYXkpXG4gICAgfVxuICB9LCBbXSlcbn1cblxuZnVuY3Rpb24gcHJlcGFyZU9wdHMob3B0cykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICd1bmRlZmluZWQnKSBvcHRzID0ge31cblxuICBpZiAodHlwZW9mIG9wdHMucGF0aCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRzLnBhdGggPSBwYXRoLnJlc29sdmUgPyBwYXRoLnJlc29sdmUoJy4nKSA6ICcuJ1xuICB9XG5cbiAgcmV0dXJuIG9wdHNcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVF1ZXJpZXMocXVlcmllcywgb3B0cykge1xuICBpZiAodHlwZW9mIHF1ZXJpZXMgPT09ICd1bmRlZmluZWQnIHx8IHF1ZXJpZXMgPT09IG51bGwpIHtcbiAgICB2YXIgY29uZmlnID0gYnJvd3NlcnNsaXN0LmxvYWRDb25maWcob3B0cylcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBxdWVyaWVzID0gY29uZmlnXG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXJpZXMgPSBicm93c2Vyc2xpc3QuZGVmYXVsdHNcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcXVlcmllc1xufVxuXG5mdW5jdGlvbiBjaGVja1F1ZXJpZXMocXVlcmllcykge1xuICBpZiAoISh0eXBlb2YgcXVlcmllcyA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShxdWVyaWVzKSkpIHtcbiAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAnQnJvd3NlciBxdWVyaWVzIG11c3QgYmUgYW4gYXJyYXkgb3Igc3RyaW5nLiBHb3QgJyArIHR5cGVvZiBxdWVyaWVzICsgJy4nXG4gICAgKVxuICB9XG59XG5cbnZhciBjYWNoZSA9IHt9XG5cbmZ1bmN0aW9uIGJyb3dzZXJzbGlzdChxdWVyaWVzLCBvcHRzKSB7XG4gIG9wdHMgPSBwcmVwYXJlT3B0cyhvcHRzKVxuICBxdWVyaWVzID0gcHJlcGFyZVF1ZXJpZXMocXVlcmllcywgb3B0cylcbiAgY2hlY2tRdWVyaWVzKHF1ZXJpZXMpXG5cbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgaWdub3JlVW5rbm93blZlcnNpb25zOiBvcHRzLmlnbm9yZVVua25vd25WZXJzaW9ucyxcbiAgICBkYW5nZXJvdXNFeHRlbmQ6IG9wdHMuZGFuZ2Vyb3VzRXh0ZW5kLFxuICAgIG1vYmlsZVRvRGVza3RvcDogb3B0cy5tb2JpbGVUb0Rlc2t0b3AsXG4gICAgcGF0aDogb3B0cy5wYXRoLFxuICAgIGVudjogb3B0cy5lbnZcbiAgfVxuXG4gIGVudi5vbGREYXRhV2FybmluZyhicm93c2Vyc2xpc3QuZGF0YSlcbiAgdmFyIHN0YXRzID0gZW52LmdldFN0YXQob3B0cywgYnJvd3NlcnNsaXN0LmRhdGEpXG4gIGlmIChzdGF0cykge1xuICAgIGNvbnRleHQuY3VzdG9tVXNhZ2UgPSB7fVxuICAgIGZvciAodmFyIGJyb3dzZXIgaW4gc3RhdHMpIHtcbiAgICAgIGZpbGxVc2FnZShjb250ZXh0LmN1c3RvbVVzYWdlLCBicm93c2VyLCBzdGF0c1ticm93c2VyXSlcbiAgICB9XG4gIH1cblxuICB2YXIgY2FjaGVLZXkgPSBKU09OLnN0cmluZ2lmeShbcXVlcmllcywgY29udGV4dF0pXG4gIGlmIChjYWNoZVtjYWNoZUtleV0pIHJldHVybiBjYWNoZVtjYWNoZUtleV1cblxuICB2YXIgcmVzdWx0ID0gdW5pcShyZXNvbHZlKHF1ZXJpZXMsIGNvbnRleHQpKS5zb3J0KGZ1bmN0aW9uIChuYW1lMSwgbmFtZTIpIHtcbiAgICBuYW1lMSA9IG5hbWUxLnNwbGl0KCcgJylcbiAgICBuYW1lMiA9IG5hbWUyLnNwbGl0KCcgJylcbiAgICBpZiAobmFtZTFbMF0gPT09IG5hbWUyWzBdKSB7XG4gICAgICAvLyBhc3N1bXB0aW9ucyBvbiBjYW5pdXNlIGRhdGFcbiAgICAgIC8vIDEpIHZlcnNpb24gcmFuZ2VzIG5ldmVyIG92ZXJsYXBzXG4gICAgICAvLyAyKSBpZiB2ZXJzaW9uIGlzIG5vdCBhIHJhbmdlLCBpdCBuZXZlciBjb250YWlucyBgLWBcbiAgICAgIHZhciB2ZXJzaW9uMSA9IG5hbWUxWzFdLnNwbGl0KCctJylbMF1cbiAgICAgIHZhciB2ZXJzaW9uMiA9IG5hbWUyWzFdLnNwbGl0KCctJylbMF1cbiAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyKHZlcnNpb24yLnNwbGl0KCcuJyksIHZlcnNpb24xLnNwbGl0KCcuJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb21wYXJlKG5hbWUxWzBdLCBuYW1lMlswXSlcbiAgICB9XG4gIH0pXG4gIGlmICghZW52LmVudi5CUk9XU0VSU0xJU1RfRElTQUJMRV9DQUNIRSkge1xuICAgIGNhY2hlW2NhY2hlS2V5XSA9IHJlc3VsdFxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuYnJvd3NlcnNsaXN0LnBhcnNlID0gZnVuY3Rpb24gKHF1ZXJpZXMsIG9wdHMpIHtcbiAgb3B0cyA9IHByZXBhcmVPcHRzKG9wdHMpXG4gIHF1ZXJpZXMgPSBwcmVwYXJlUXVlcmllcyhxdWVyaWVzLCBvcHRzKVxuICBjaGVja1F1ZXJpZXMocXVlcmllcylcbiAgcmV0dXJuIHBhcnNlKFFVRVJJRVMsIHF1ZXJpZXMpXG59XG5cbi8vIFdpbGwgYmUgZmlsbGVkIGJ5IENhbiBJIFVzZSBkYXRhIGJlbG93XG5icm93c2Vyc2xpc3QuY2FjaGUgPSB7fVxuYnJvd3NlcnNsaXN0LmRhdGEgPSB7fVxuYnJvd3NlcnNsaXN0LnVzYWdlID0ge1xuICBnbG9iYWw6IHt9LFxuICBjdXN0b206IG51bGxcbn1cblxuLy8gRGVmYXVsdCBicm93c2VycyBxdWVyeVxuYnJvd3NlcnNsaXN0LmRlZmF1bHRzID0gWyc+IDAuNSUnLCAnbGFzdCAyIHZlcnNpb25zJywgJ0ZpcmVmb3ggRVNSJywgJ25vdCBkZWFkJ11cblxuLy8gQnJvd3NlciBuYW1lcyBhbGlhc2VzXG5icm93c2Vyc2xpc3QuYWxpYXNlcyA9IHtcbiAgZng6ICdmaXJlZm94JyxcbiAgZmY6ICdmaXJlZm94JyxcbiAgaW9zOiAnaW9zX3NhZicsXG4gIGV4cGxvcmVyOiAnaWUnLFxuICBibGFja2JlcnJ5OiAnYmInLFxuICBleHBsb3Jlcm1vYmlsZTogJ2llX21vYicsXG4gIG9wZXJhbWluaTogJ29wX21pbmknLFxuICBvcGVyYW1vYmlsZTogJ29wX21vYicsXG4gIGNocm9tZWFuZHJvaWQ6ICdhbmRfY2hyJyxcbiAgZmlyZWZveGFuZHJvaWQ6ICdhbmRfZmYnLFxuICB1Y2FuZHJvaWQ6ICdhbmRfdWMnLFxuICBxcWFuZHJvaWQ6ICdhbmRfcXEnXG59XG5cbi8vIENhbiBJIFVzZSBvbmx5IHByb3ZpZGVzIGEgZmV3IHZlcnNpb25zIGZvciBzb21lIGJyb3dzZXJzIChlLmcuIGFuZF9jaHIpLlxuLy8gRmFsbGJhY2sgdG8gYSBzaW1pbGFyIGJyb3dzZXIgZm9yIHVua25vd24gdmVyc2lvbnNcbi8vIE5vdGUgb3BfbW9iIGlzIG5vdCBpbmNsdWRlZCBhcyBpdHMgY2hyb21pdW0gdmVyc2lvbnMgYXJlIG5vdCBpbiBzeW5jIHdpdGggT3BlcmEgZGVza3RvcFxuYnJvd3NlcnNsaXN0LmRlc2t0b3BOYW1lcyA9IHtcbiAgYW5kX2NocjogJ2Nocm9tZScsXG4gIGFuZF9mZjogJ2ZpcmVmb3gnLFxuICBpZV9tb2I6ICdpZScsXG4gIGFuZHJvaWQ6ICdjaHJvbWUnIC8vIGhhcyBleHRyYSBwcm9jZXNzaW5nIGxvZ2ljXG59XG5cbi8vIEFsaWFzZXMgdG8gd29yayB3aXRoIGpvaW5lZCB2ZXJzaW9ucyBsaWtlIGBpb3Nfc2FmIDcuMC03LjFgXG5icm93c2Vyc2xpc3QudmVyc2lvbkFsaWFzZXMgPSB7fVxuXG5icm93c2Vyc2xpc3QuY2xlYXJDYWNoZXMgPSBlbnYuY2xlYXJDYWNoZXNcbmJyb3dzZXJzbGlzdC5wYXJzZUNvbmZpZyA9IGVudi5wYXJzZUNvbmZpZ1xuYnJvd3NlcnNsaXN0LnJlYWRDb25maWcgPSBlbnYucmVhZENvbmZpZ1xuYnJvd3NlcnNsaXN0LmZpbmRDb25maWdGaWxlID0gZW52LmZpbmRDb25maWdGaWxlXG5icm93c2Vyc2xpc3QuZmluZENvbmZpZyA9IGVudi5maW5kQ29uZmlnXG5icm93c2Vyc2xpc3QubG9hZENvbmZpZyA9IGVudi5sb2FkQ29uZmlnXG5cbmJyb3dzZXJzbGlzdC5jb3ZlcmFnZSA9IGZ1bmN0aW9uIChicm93c2Vycywgc3RhdHMpIHtcbiAgdmFyIGRhdGFcbiAgaWYgKHR5cGVvZiBzdGF0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkYXRhID0gYnJvd3NlcnNsaXN0LnVzYWdlLmdsb2JhbFxuICB9IGVsc2UgaWYgKHN0YXRzID09PSAnbXkgc3RhdHMnKSB7XG4gICAgdmFyIG9wdHMgPSB7fVxuICAgIG9wdHMucGF0aCA9IHBhdGgucmVzb2x2ZSA/IHBhdGgucmVzb2x2ZSgnLicpIDogJy4nXG4gICAgdmFyIGN1c3RvbVN0YXRzID0gZW52LmdldFN0YXQob3B0cylcbiAgICBpZiAoIWN1c3RvbVN0YXRzKSB7XG4gICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoJ0N1c3RvbSB1c2FnZSBzdGF0aXN0aWNzIHdhcyBub3QgcHJvdmlkZWQnKVxuICAgIH1cbiAgICBkYXRhID0ge31cbiAgICBmb3IgKHZhciBicm93c2VyIGluIGN1c3RvbVN0YXRzKSB7XG4gICAgICBmaWxsVXNhZ2UoZGF0YSwgYnJvd3NlciwgY3VzdG9tU3RhdHNbYnJvd3Nlcl0pXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBzdGF0cyA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoc3RhdHMubGVuZ3RoID4gMikge1xuICAgICAgc3RhdHMgPSBzdGF0cy50b0xvd2VyQ2FzZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRzID0gc3RhdHMudG9VcHBlckNhc2UoKVxuICAgIH1cbiAgICBlbnYubG9hZENvdW50cnkoYnJvd3NlcnNsaXN0LnVzYWdlLCBzdGF0cywgYnJvd3NlcnNsaXN0LmRhdGEpXG4gICAgZGF0YSA9IGJyb3dzZXJzbGlzdC51c2FnZVtzdGF0c11cbiAgfSBlbHNlIHtcbiAgICBpZiAoJ2RhdGFCeUJyb3dzZXInIGluIHN0YXRzKSB7XG4gICAgICBzdGF0cyA9IHN0YXRzLmRhdGFCeUJyb3dzZXJcbiAgICB9XG4gICAgZGF0YSA9IHt9XG4gICAgZm9yICh2YXIgbmFtZSBpbiBzdGF0cykge1xuICAgICAgZm9yICh2YXIgdmVyc2lvbiBpbiBzdGF0c1tuYW1lXSkge1xuICAgICAgICBkYXRhW25hbWUgKyAnICcgKyB2ZXJzaW9uXSA9IHN0YXRzW25hbWVdW3ZlcnNpb25dXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJyb3dzZXJzLnJlZHVjZShmdW5jdGlvbiAoYWxsLCBpKSB7XG4gICAgdmFyIHVzYWdlID0gZGF0YVtpXVxuICAgIGlmICh1c2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB1c2FnZSA9IGRhdGFbaS5yZXBsYWNlKC8gXFxTKyQvLCAnIDAnKV1cbiAgICB9XG4gICAgcmV0dXJuIGFsbCArICh1c2FnZSB8fCAwKVxuICB9LCAwKVxufVxuXG5mdW5jdGlvbiBub2RlUXVlcnkoY29udGV4dCwgbm9kZSkge1xuICB2YXIgbWF0Y2hlZCA9IGJyb3dzZXJzbGlzdC5ub2RlVmVyc2lvbnMuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgcmV0dXJuIGlzVmVyc2lvbnNNYXRjaChpLCBub2RlLnZlcnNpb24pXG4gIH0pXG4gIGlmIChtYXRjaGVkLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChjb250ZXh0Lmlnbm9yZVVua25vd25WZXJzaW9ucykge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICAgJ1Vua25vd24gdmVyc2lvbiAnICsgbm9kZS52ZXJzaW9uICsgJyBvZiBOb2RlLmpzJ1xuICAgICAgKVxuICAgIH1cbiAgfVxuICByZXR1cm4gWydub2RlICcgKyBtYXRjaGVkW21hdGNoZWQubGVuZ3RoIC0gMV1dXG59XG5cbmZ1bmN0aW9uIHNpbmNlUXVlcnkoY29udGV4dCwgbm9kZSkge1xuICB2YXIgeWVhciA9IHBhcnNlSW50KG5vZGUueWVhcilcbiAgdmFyIG1vbnRoID0gcGFyc2VJbnQobm9kZS5tb250aCB8fCAnMDEnKSAtIDFcbiAgdmFyIGRheSA9IHBhcnNlSW50KG5vZGUuZGF5IHx8ICcwMScpXG4gIHJldHVybiBmaWx0ZXJCeVllYXIoRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRheSwgMCwgMCwgMCksIGNvbnRleHQpXG59XG5cbmZ1bmN0aW9uIGNvdmVyUXVlcnkoY29udGV4dCwgbm9kZSkge1xuICB2YXIgY292ZXJhZ2UgPSBwYXJzZUZsb2F0KG5vZGUuY292ZXJhZ2UpXG4gIHZhciB1c2FnZSA9IGJyb3dzZXJzbGlzdC51c2FnZS5nbG9iYWxcbiAgaWYgKG5vZGUucGxhY2UpIHtcbiAgICBpZiAobm9kZS5wbGFjZS5tYXRjaCgvXm15XFxzK3N0YXRzJC9pKSkge1xuICAgICAgaWYgKCFjb250ZXh0LmN1c3RvbVVzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcignQ3VzdG9tIHVzYWdlIHN0YXRpc3RpY3Mgd2FzIG5vdCBwcm92aWRlZCcpXG4gICAgICB9XG4gICAgICB1c2FnZSA9IGNvbnRleHQuY3VzdG9tVXNhZ2VcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHBsYWNlXG4gICAgICBpZiAobm9kZS5wbGFjZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcGxhY2UgPSBub2RlLnBsYWNlLnRvVXBwZXJDYXNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYWNlID0gbm9kZS5wbGFjZS50b0xvd2VyQ2FzZSgpXG4gICAgICB9XG4gICAgICBlbnYubG9hZENvdW50cnkoYnJvd3NlcnNsaXN0LnVzYWdlLCBwbGFjZSwgYnJvd3NlcnNsaXN0LmRhdGEpXG4gICAgICB1c2FnZSA9IGJyb3dzZXJzbGlzdC51c2FnZVtwbGFjZV1cbiAgICB9XG4gIH1cbiAgdmFyIHZlcnNpb25zID0gT2JqZWN0LmtleXModXNhZ2UpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gdXNhZ2VbYl0gLSB1c2FnZVthXVxuICB9KVxuICB2YXIgY292ZXJhZ2VkID0gMFxuICB2YXIgcmVzdWx0ID0gW11cbiAgdmFyIHZlcnNpb25cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZlcnNpb24gPSB2ZXJzaW9uc1tpXVxuICAgIGlmICh1c2FnZVt2ZXJzaW9uXSA9PT0gMCkgYnJlYWtcbiAgICBjb3ZlcmFnZWQgKz0gdXNhZ2VbdmVyc2lvbl1cbiAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgIGlmIChjb3ZlcmFnZWQgPj0gY292ZXJhZ2UpIGJyZWFrXG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG52YXIgUVVFUklFUyA9IHtcbiAgbGFzdF9tYWpvcl92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbnMnXSxcbiAgICByZWdleHA6IC9ebGFzdFxccysoXFxkKylcXHMrbWFqb3JcXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhZ2VudHMpLnJlZHVjZShmdW5jdGlvbiAoc2VsZWN0ZWQsIG5hbWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBieU5hbWUobmFtZSwgY29udGV4dClcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gc2VsZWN0ZWRcbiAgICAgICAgdmFyIGxpc3QgPSBnZXRNYWpvclZlcnNpb25zKGRhdGEucmVsZWFzZWQsIG5vZGUudmVyc2lvbnMpXG4gICAgICAgIGxpc3QgPSBsaXN0Lm1hcChuYW1lTWFwcGVyKGRhdGEubmFtZSkpXG4gICAgICAgIGxpc3QgPSBmaWx0ZXJKdW1wcyhsaXN0LCBkYXRhLm5hbWUsIG5vZGUudmVyc2lvbnMsIGNvbnRleHQpXG4gICAgICAgIHJldHVybiBzZWxlY3RlZC5jb25jYXQobGlzdClcbiAgICAgIH0sIFtdKVxuICAgIH1cbiAgfSxcbiAgbGFzdF92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbnMnXSxcbiAgICByZWdleHA6IC9ebGFzdFxccysoXFxkKylcXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhZ2VudHMpLnJlZHVjZShmdW5jdGlvbiAoc2VsZWN0ZWQsIG5hbWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBieU5hbWUobmFtZSwgY29udGV4dClcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gc2VsZWN0ZWRcbiAgICAgICAgdmFyIGxpc3QgPSBkYXRhLnJlbGVhc2VkLnNsaWNlKC1ub2RlLnZlcnNpb25zKVxuICAgICAgICBsaXN0ID0gbGlzdC5tYXAobmFtZU1hcHBlcihkYXRhLm5hbWUpKVxuICAgICAgICBsaXN0ID0gZmlsdGVySnVtcHMobGlzdCwgZGF0YS5uYW1lLCBub2RlLnZlcnNpb25zLCBjb250ZXh0KVxuICAgICAgICByZXR1cm4gc2VsZWN0ZWQuY29uY2F0KGxpc3QpXG4gICAgICB9LCBbXSlcbiAgICB9XG4gIH0sXG4gIGxhc3RfZWxlY3Ryb25fbWFqb3JfdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb25zJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCspXFxzK2VsZWN0cm9uXFxzK21ham9yXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgdmFsaWRWZXJzaW9ucyA9IGdldE1ham9yVmVyc2lvbnMoT2JqZWN0LmtleXMoZTJjKSwgbm9kZS52ZXJzaW9ucylcbiAgICAgIHJldHVybiB2YWxpZFZlcnNpb25zLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gJ2Nocm9tZSAnICsgZTJjW2ldXG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgbGFzdF9ub2RlX21ham9yX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9ucyddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQrKVxccytub2RlXFxzK21ham9yXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gZ2V0TWFqb3JWZXJzaW9ucyhicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zLCBub2RlLnZlcnNpb25zKS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICAgICAgcmV0dXJuICdub2RlICcgKyB2ZXJzaW9uXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gIH0sXG4gIGxhc3RfYnJvd3Nlcl9tYWpvcl92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbnMnLCAnYnJvd3NlciddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQrKVxccysoXFx3KylcXHMrbWFqb3JcXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBkYXRhID0gY2hlY2tOYW1lKG5vZGUuYnJvd3NlciwgY29udGV4dClcbiAgICAgIHZhciB2YWxpZFZlcnNpb25zID0gZ2V0TWFqb3JWZXJzaW9ucyhkYXRhLnJlbGVhc2VkLCBub2RlLnZlcnNpb25zKVxuICAgICAgdmFyIGxpc3QgPSB2YWxpZFZlcnNpb25zLm1hcChuYW1lTWFwcGVyKGRhdGEubmFtZSkpXG4gICAgICBsaXN0ID0gZmlsdGVySnVtcHMobGlzdCwgZGF0YS5uYW1lLCBub2RlLnZlcnNpb25zLCBjb250ZXh0KVxuICAgICAgcmV0dXJuIGxpc3RcbiAgICB9XG4gIH0sXG4gIGxhc3RfZWxlY3Ryb25fdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb25zJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCspXFxzK2VsZWN0cm9uXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoZTJjKVxuICAgICAgICAuc2xpY2UoLW5vZGUudmVyc2lvbnMpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICByZXR1cm4gJ2Nocm9tZSAnICsgZTJjW2ldXG4gICAgICAgIH0pXG4gICAgfVxuICB9LFxuICBsYXN0X25vZGVfdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb25zJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCspXFxzK25vZGVcXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHJldHVybiBicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zXG4gICAgICAgIC5zbGljZSgtbm9kZS52ZXJzaW9ucylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgICAgIHJldHVybiAnbm9kZSAnICsgdmVyc2lvblxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcbiAgbGFzdF9icm93c2VyX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9ucycsICdicm93c2VyJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCspXFxzKyhcXHcrKVxccyt2ZXJzaW9ucz8kL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgdmFyIGRhdGEgPSBjaGVja05hbWUobm9kZS5icm93c2VyLCBjb250ZXh0KVxuICAgICAgdmFyIGxpc3QgPSBkYXRhLnJlbGVhc2VkLnNsaWNlKC1ub2RlLnZlcnNpb25zKS5tYXAobmFtZU1hcHBlcihkYXRhLm5hbWUpKVxuICAgICAgbGlzdCA9IGZpbHRlckp1bXBzKGxpc3QsIGRhdGEubmFtZSwgbm9kZS52ZXJzaW9ucywgY29udGV4dClcbiAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuICB9LFxuICB1bnJlbGVhc2VkX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXnVucmVsZWFzZWRcXHMrdmVyc2lvbnMkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFnZW50cykucmVkdWNlKGZ1bmN0aW9uIChzZWxlY3RlZCwgbmFtZSkge1xuICAgICAgICB2YXIgZGF0YSA9IGJ5TmFtZShuYW1lLCBjb250ZXh0KVxuICAgICAgICBpZiAoIWRhdGEpIHJldHVybiBzZWxlY3RlZFxuICAgICAgICB2YXIgbGlzdCA9IGRhdGEudmVyc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucmVsZWFzZWQuaW5kZXhPZih2KSA9PT0gLTFcbiAgICAgICAgfSlcbiAgICAgICAgbGlzdCA9IGxpc3QubWFwKG5hbWVNYXBwZXIoZGF0YS5uYW1lKSlcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkLmNvbmNhdChsaXN0KVxuICAgICAgfSwgW10pXG4gICAgfVxuICB9LFxuICB1bnJlbGVhc2VkX2VsZWN0cm9uX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXnVucmVsZWFzZWRcXHMrZWxlY3Ryb25cXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9LFxuICB1bnJlbGVhc2VkX2Jyb3dzZXJfdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ2Jyb3dzZXInXSxcbiAgICByZWdleHA6IC9edW5yZWxlYXNlZFxccysoXFx3KylcXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBkYXRhID0gY2hlY2tOYW1lKG5vZGUuYnJvd3NlciwgY29udGV4dClcbiAgICAgIHJldHVybiBkYXRhLnZlcnNpb25zXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5yZWxlYXNlZC5pbmRleE9mKHYpID09PSAtMVxuICAgICAgICB9KVxuICAgICAgICAubWFwKG5hbWVNYXBwZXIoZGF0YS5uYW1lKSlcbiAgICB9XG4gIH0sXG4gIGxhc3RfeWVhcnM6IHtcbiAgICBtYXRjaGVzOiBbJ3llYXJzJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCouP1xcZCspXFxzK3llYXJzPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gZmlsdGVyQnlZZWFyKERhdGUubm93KCkgLSBZRUFSICogbm9kZS55ZWFycywgY29udGV4dClcbiAgICB9XG4gIH0sXG4gIHNpbmNlX3k6IHtcbiAgICBtYXRjaGVzOiBbJ3llYXInXSxcbiAgICByZWdleHA6IC9ec2luY2UgKFxcZCspJC9pLFxuICAgIHNlbGVjdDogc2luY2VRdWVyeVxuICB9LFxuICBzaW5jZV95X206IHtcbiAgICBtYXRjaGVzOiBbJ3llYXInLCAnbW9udGgnXSxcbiAgICByZWdleHA6IC9ec2luY2UgKFxcZCspLShcXGQrKSQvaSxcbiAgICBzZWxlY3Q6IHNpbmNlUXVlcnlcbiAgfSxcbiAgc2luY2VfeV9tX2Q6IHtcbiAgICBtYXRjaGVzOiBbJ3llYXInLCAnbW9udGgnLCAnZGF5J10sXG4gICAgcmVnZXhwOiAvXnNpbmNlIChcXGQrKS0oXFxkKyktKFxcZCspJC9pLFxuICAgIHNlbGVjdDogc2luY2VRdWVyeVxuICB9LFxuICBwb3B1bGFyaXR5OiB7XG4gICAgbWF0Y2hlczogWydzaWduJywgJ3BvcHVsYXJpdHknXSxcbiAgICByZWdleHA6IC9eKD49P3w8PT8pXFxzKihcXGQrfFxcZCtcXC5cXGQrfFxcLlxcZCspJSQvLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBwb3B1bGFyaXR5ID0gcGFyc2VGbG9hdChub2RlLnBvcHVsYXJpdHkpXG4gICAgICB2YXIgdXNhZ2UgPSBicm93c2Vyc2xpc3QudXNhZ2UuZ2xvYmFsXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModXNhZ2UpLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCB2ZXJzaW9uKSB7XG4gICAgICAgIGlmIChub2RlLnNpZ24gPT09ICc+Jykge1xuICAgICAgICAgIGlmICh1c2FnZVt2ZXJzaW9uXSA+IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzwnKSB7XG4gICAgICAgICAgaWYgKHVzYWdlW3ZlcnNpb25dIDwgcG9wdWxhcml0eSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5zaWduID09PSAnPD0nKSB7XG4gICAgICAgICAgaWYgKHVzYWdlW3ZlcnNpb25dIDw9IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHVzYWdlW3ZlcnNpb25dID49IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0sIFtdKVxuICAgIH1cbiAgfSxcbiAgcG9wdWxhcml0eV9pbl9teV9zdGF0czoge1xuICAgIG1hdGNoZXM6IFsnc2lnbicsICdwb3B1bGFyaXR5J10sXG4gICAgcmVnZXhwOiAvXig+PT98PD0/KVxccyooXFxkK3xcXGQrXFwuXFxkK3xcXC5cXGQrKSVcXHMraW5cXHMrbXlcXHMrc3RhdHMkLyxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgcG9wdWxhcml0eSA9IHBhcnNlRmxvYXQobm9kZS5wb3B1bGFyaXR5KVxuICAgICAgaWYgKCFjb250ZXh0LmN1c3RvbVVzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcignQ3VzdG9tIHVzYWdlIHN0YXRpc3RpY3Mgd2FzIG5vdCBwcm92aWRlZCcpXG4gICAgICB9XG4gICAgICB2YXIgdXNhZ2UgPSBjb250ZXh0LmN1c3RvbVVzYWdlXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModXNhZ2UpLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCB2ZXJzaW9uKSB7XG4gICAgICAgIHZhciBwZXJjZW50YWdlID0gdXNhZ2VbdmVyc2lvbl1cbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLnNpZ24gPT09ICc+Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlID4gcG9wdWxhcml0eSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5zaWduID09PSAnPCcpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA8IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzw9Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlIDw9IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBlcmNlbnRhZ2UgPj0gcG9wdWxhcml0eSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSwgW10pXG4gICAgfVxuICB9LFxuICBwb3B1bGFyaXR5X2luX2NvbmZpZ19zdGF0czoge1xuICAgIG1hdGNoZXM6IFsnc2lnbicsICdwb3B1bGFyaXR5JywgJ2NvbmZpZyddLFxuICAgIHJlZ2V4cDogL14oPj0/fDw9PylcXHMqKFxcZCt8XFxkK1xcLlxcZCt8XFwuXFxkKyklXFxzK2luXFxzKyhcXFMrKVxccytzdGF0cyQvLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBwb3B1bGFyaXR5ID0gcGFyc2VGbG9hdChub2RlLnBvcHVsYXJpdHkpXG4gICAgICB2YXIgc3RhdHMgPSBlbnYubG9hZFN0YXQoY29udGV4dCwgbm9kZS5jb25maWcsIGJyb3dzZXJzbGlzdC5kYXRhKVxuICAgICAgaWYgKHN0YXRzKSB7XG4gICAgICAgIGNvbnRleHQuY3VzdG9tVXNhZ2UgPSB7fVxuICAgICAgICBmb3IgKHZhciBicm93c2VyIGluIHN0YXRzKSB7XG4gICAgICAgICAgZmlsbFVzYWdlKGNvbnRleHQuY3VzdG9tVXNhZ2UsIGJyb3dzZXIsIHN0YXRzW2Jyb3dzZXJdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWNvbnRleHQuY3VzdG9tVXNhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKCdDdXN0b20gdXNhZ2Ugc3RhdGlzdGljcyB3YXMgbm90IHByb3ZpZGVkJylcbiAgICAgIH1cbiAgICAgIHZhciB1c2FnZSA9IGNvbnRleHQuY3VzdG9tVXNhZ2VcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh1c2FnZSkucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHZlcnNpb24pIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2UgPSB1c2FnZVt2ZXJzaW9uXVxuICAgICAgICBpZiAocGVyY2VudGFnZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUuc2lnbiA9PT0gJz4nKSB7XG4gICAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPiBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnNpZ24gPT09ICc8Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlIDwgcG9wdWxhcml0eSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5zaWduID09PSAnPD0nKSB7XG4gICAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPD0gcG9wdWxhcml0eSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocGVyY2VudGFnZSA+PSBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9LCBbXSlcbiAgICB9XG4gIH0sXG4gIHBvcHVsYXJpdHlfaW5fcGxhY2U6IHtcbiAgICBtYXRjaGVzOiBbJ3NpZ24nLCAncG9wdWxhcml0eScsICdwbGFjZSddLFxuICAgIHJlZ2V4cDogL14oPj0/fDw9PylcXHMqKFxcZCt8XFxkK1xcLlxcZCt8XFwuXFxkKyklXFxzK2luXFxzKygoYWx0LSk/XFx3XFx3KSQvLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBwb3B1bGFyaXR5ID0gcGFyc2VGbG9hdChub2RlLnBvcHVsYXJpdHkpXG4gICAgICB2YXIgcGxhY2UgPSBub2RlLnBsYWNlXG4gICAgICBpZiAocGxhY2UubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHBsYWNlID0gcGxhY2UudG9VcHBlckNhc2UoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxhY2UgPSBwbGFjZS50b0xvd2VyQ2FzZSgpXG4gICAgICB9XG4gICAgICBlbnYubG9hZENvdW50cnkoYnJvd3NlcnNsaXN0LnVzYWdlLCBwbGFjZSwgYnJvd3NlcnNsaXN0LmRhdGEpXG4gICAgICB2YXIgdXNhZ2UgPSBicm93c2Vyc2xpc3QudXNhZ2VbcGxhY2VdXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModXNhZ2UpLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCB2ZXJzaW9uKSB7XG4gICAgICAgIHZhciBwZXJjZW50YWdlID0gdXNhZ2VbdmVyc2lvbl1cbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLnNpZ24gPT09ICc+Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlID4gcG9wdWxhcml0eSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5zaWduID09PSAnPCcpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA8IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzw9Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlIDw9IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBlcmNlbnRhZ2UgPj0gcG9wdWxhcml0eSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSwgW10pXG4gICAgfVxuICB9LFxuICBjb3Zlcjoge1xuICAgIG1hdGNoZXM6IFsnY292ZXJhZ2UnXSxcbiAgICByZWdleHA6IC9eY292ZXJcXHMrKFxcZCt8XFxkK1xcLlxcZCt8XFwuXFxkKyklJC9pLFxuICAgIHNlbGVjdDogY292ZXJRdWVyeVxuICB9LFxuICBjb3Zlcl9pbjoge1xuICAgIG1hdGNoZXM6IFsnY292ZXJhZ2UnLCAncGxhY2UnXSxcbiAgICByZWdleHA6IC9eY292ZXJcXHMrKFxcZCt8XFxkK1xcLlxcZCt8XFwuXFxkKyklXFxzK2luXFxzKyhteVxccytzdGF0c3woYWx0LSk/XFx3XFx3KSQvaSxcbiAgICBzZWxlY3Q6IGNvdmVyUXVlcnlcbiAgfSxcbiAgc3VwcG9ydHM6IHtcbiAgICBtYXRjaGVzOiBbJ3N1cHBvcnRUeXBlJywgJ2ZlYXR1cmUnXSxcbiAgICByZWdleHA6IC9eKD86KGZ1bGx5fHBhcnRpYWxseSlcXHMrKT9zdXBwb3J0c1xccysoW1xcdy1dKykkLyxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICBlbnYubG9hZEZlYXR1cmUoYnJvd3NlcnNsaXN0LmNhY2hlLCBub2RlLmZlYXR1cmUpXG4gICAgICB2YXIgd2l0aFBhcnRpYWwgPSBub2RlLnN1cHBvcnRUeXBlICE9PSAnZnVsbHknXG4gICAgICB2YXIgZmVhdHVyZXMgPSBicm93c2Vyc2xpc3QuY2FjaGVbbm9kZS5mZWF0dXJlXVxuICAgICAgdmFyIHJlc3VsdCA9IFtdXG4gICAgICBmb3IgKHZhciBuYW1lIGluIGZlYXR1cmVzKSB7XG4gICAgICAgIHZhciBkYXRhID0gYnlOYW1lKG5hbWUsIGNvbnRleHQpXG4gICAgICAgIC8vIE9ubHkgY2hlY2sgZGVza3RvcCB3aGVuIGxhdGVzdCByZWxlYXNlZCBtb2JpbGUgaGFzIHN1cHBvcnRcbiAgICAgICAgdmFyIGlNYXggPSBkYXRhLnJlbGVhc2VkLmxlbmd0aCAtIDFcbiAgICAgICAgd2hpbGUgKGlNYXggPj0gMCkge1xuICAgICAgICAgIGlmIChkYXRhLnJlbGVhc2VkW2lNYXhdIGluIGZlYXR1cmVzW25hbWVdKSBicmVha1xuICAgICAgICAgIGlNYXgtLVxuICAgICAgICB9XG4gICAgICAgIHZhciBjaGVja0Rlc2t0b3AgPVxuICAgICAgICAgIGNvbnRleHQubW9iaWxlVG9EZXNrdG9wICYmXG4gICAgICAgICAgbmFtZSBpbiBicm93c2Vyc2xpc3QuZGVza3RvcE5hbWVzICYmXG4gICAgICAgICAgaXNTdXBwb3J0ZWQoZmVhdHVyZXNbbmFtZV1bZGF0YS5yZWxlYXNlZFtpTWF4XV0sIHdpdGhQYXJ0aWFsKVxuICAgICAgICBkYXRhLnZlcnNpb25zLmZvckVhY2goZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgICB2YXIgZmxhZ3MgPSBmZWF0dXJlc1tuYW1lXVt2ZXJzaW9uXVxuICAgICAgICAgIGlmIChmbGFncyA9PT0gdW5kZWZpbmVkICYmIGNoZWNrRGVza3RvcCkge1xuICAgICAgICAgICAgZmxhZ3MgPSBmZWF0dXJlc1ticm93c2Vyc2xpc3QuZGVza3RvcE5hbWVzW25hbWVdXVt2ZXJzaW9uXVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNTdXBwb3J0ZWQoZmxhZ3MsIHdpdGhQYXJ0aWFsKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmFtZSArICcgJyArIHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbiAgfSxcbiAgZWxlY3Ryb25fcmFuZ2U6IHtcbiAgICBtYXRjaGVzOiBbJ2Zyb20nLCAndG8nXSxcbiAgICByZWdleHA6IC9eZWxlY3Ryb25cXHMrKFtcXGQuXSspXFxzKi1cXHMqKFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBmcm9tVG9Vc2UgPSBub3JtYWxpemVFbGVjdHJvbihub2RlLmZyb20pXG4gICAgICB2YXIgdG9Ub1VzZSA9IG5vcm1hbGl6ZUVsZWN0cm9uKG5vZGUudG8pXG4gICAgICB2YXIgZnJvbSA9IHBhcnNlRmxvYXQobm9kZS5mcm9tKVxuICAgICAgdmFyIHRvID0gcGFyc2VGbG9hdChub2RlLnRvKVxuICAgICAgaWYgKCFlMmNbZnJvbVRvVXNlXSkge1xuICAgICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoJ1Vua25vd24gdmVyc2lvbiAnICsgZnJvbSArICcgb2YgZWxlY3Ryb24nKVxuICAgICAgfVxuICAgICAgaWYgKCFlMmNbdG9Ub1VzZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKCdVbmtub3duIHZlcnNpb24gJyArIHRvICsgJyBvZiBlbGVjdHJvbicpXG4gICAgICB9XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoZTJjKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgdmFyIHBhcnNlZCA9IHBhcnNlRmxvYXQoaSlcbiAgICAgICAgICByZXR1cm4gcGFyc2VkID49IGZyb20gJiYgcGFyc2VkIDw9IHRvXG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICByZXR1cm4gJ2Nocm9tZSAnICsgZTJjW2ldXG4gICAgICAgIH0pXG4gICAgfVxuICB9LFxuICBub2RlX3JhbmdlOiB7XG4gICAgbWF0Y2hlczogWydmcm9tJywgJ3RvJ10sXG4gICAgcmVnZXhwOiAvXm5vZGVcXHMrKFtcXGQuXSspXFxzKi1cXHMqKFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHJldHVybiBicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zXG4gICAgICAgIC5maWx0ZXIoc2VtdmVyRmlsdGVyTG9vc2UoJz49Jywgbm9kZS5mcm9tKSlcbiAgICAgICAgLmZpbHRlcihzZW12ZXJGaWx0ZXJMb29zZSgnPD0nLCBub2RlLnRvKSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgIHJldHVybiAnbm9kZSAnICsgdlxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcbiAgYnJvd3Nlcl9yYW5nZToge1xuICAgIG1hdGNoZXM6IFsnYnJvd3NlcicsICdmcm9tJywgJ3RvJ10sXG4gICAgcmVnZXhwOiAvXihcXHcrKVxccysoW1xcZC5dKylcXHMqLVxccyooW1xcZC5dKykkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgdmFyIGRhdGEgPSBjaGVja05hbWUobm9kZS5icm93c2VyLCBjb250ZXh0KVxuICAgICAgdmFyIGZyb20gPSBwYXJzZUZsb2F0KG5vcm1hbGl6ZVZlcnNpb24oZGF0YSwgbm9kZS5mcm9tKSB8fCBub2RlLmZyb20pXG4gICAgICB2YXIgdG8gPSBwYXJzZUZsb2F0KG5vcm1hbGl6ZVZlcnNpb24oZGF0YSwgbm9kZS50bykgfHwgbm9kZS50bylcbiAgICAgIGZ1bmN0aW9uIGZpbHRlcih2KSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSBwYXJzZUZsb2F0KHYpXG4gICAgICAgIHJldHVybiBwYXJzZWQgPj0gZnJvbSAmJiBwYXJzZWQgPD0gdG9cbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhLnJlbGVhc2VkLmZpbHRlcihmaWx0ZXIpLm1hcChuYW1lTWFwcGVyKGRhdGEubmFtZSkpXG4gICAgfVxuICB9LFxuICBlbGVjdHJvbl9yYXk6IHtcbiAgICBtYXRjaGVzOiBbJ3NpZ24nLCAndmVyc2lvbiddLFxuICAgIHJlZ2V4cDogL15lbGVjdHJvblxccyooPj0/fDw9PylcXHMqKFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciB2ZXJzaW9uVG9Vc2UgPSBub3JtYWxpemVFbGVjdHJvbihub2RlLnZlcnNpb24pXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoZTJjKVxuICAgICAgICAuZmlsdGVyKGdlbmVyYXRlRmlsdGVyKG5vZGUuc2lnbiwgdmVyc2lvblRvVXNlKSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIHJldHVybiAnY2hyb21lICcgKyBlMmNbaV1cbiAgICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIG5vZGVfcmF5OiB7XG4gICAgbWF0Y2hlczogWydzaWduJywgJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9ebm9kZVxccyooPj0/fDw9PylcXHMqKFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHJldHVybiBicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zXG4gICAgICAgIC5maWx0ZXIoZ2VuZXJhdGVTZW12ZXJGaWx0ZXIobm9kZS5zaWduLCBub2RlLnZlcnNpb24pKVxuICAgICAgICAubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgcmV0dXJuICdub2RlICcgKyB2XG4gICAgICAgIH0pXG4gICAgfVxuICB9LFxuICBicm93c2VyX3JheToge1xuICAgIG1hdGNoZXM6IFsnYnJvd3NlcicsICdzaWduJywgJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9eKFxcdyspXFxzKig+PT98PD0/KVxccyooW1xcZC5dKykkLyxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgdmVyc2lvbiA9IG5vZGUudmVyc2lvblxuICAgICAgdmFyIGRhdGEgPSBjaGVja05hbWUobm9kZS5icm93c2VyLCBjb250ZXh0KVxuICAgICAgdmFyIGFsaWFzID0gYnJvd3NlcnNsaXN0LnZlcnNpb25BbGlhc2VzW2RhdGEubmFtZV1bdmVyc2lvbl1cbiAgICAgIGlmIChhbGlhcykgdmVyc2lvbiA9IGFsaWFzXG4gICAgICByZXR1cm4gZGF0YS5yZWxlYXNlZFxuICAgICAgICAuZmlsdGVyKGdlbmVyYXRlRmlsdGVyKG5vZGUuc2lnbiwgdmVyc2lvbikpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5uYW1lICsgJyAnICsgdlxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZmlyZWZveF9lc3I6IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9eKGZpcmVmb3h8ZmZ8ZngpXFxzK2VzciQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBbJ2ZpcmVmb3ggMTE1JywgJ2ZpcmVmb3ggMTI4J11cbiAgICB9XG4gIH0sXG4gIG9wZXJhX21pbmlfYWxsOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvKG9wZXJhbWluaXxvcF9taW5pKVxccythbGwvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBbJ29wX21pbmkgYWxsJ11cbiAgICB9XG4gIH0sXG4gIGVsZWN0cm9uX3ZlcnNpb246IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9eZWxlY3Ryb25cXHMrKFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciB2ZXJzaW9uVG9Vc2UgPSBub3JtYWxpemVFbGVjdHJvbihub2RlLnZlcnNpb24pXG4gICAgICB2YXIgY2hyb21lID0gZTJjW3ZlcnNpb25Ub1VzZV1cbiAgICAgIGlmICghY2hyb21lKSB7XG4gICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICAgICAnVW5rbm93biB2ZXJzaW9uICcgKyBub2RlLnZlcnNpb24gKyAnIG9mIGVsZWN0cm9uJ1xuICAgICAgICApXG4gICAgICB9XG4gICAgICByZXR1cm4gWydjaHJvbWUgJyArIGNocm9tZV1cbiAgICB9XG4gIH0sXG4gIG5vZGVfbWFqb3JfdmVyc2lvbjoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbiddLFxuICAgIHJlZ2V4cDogL15ub2RlXFxzKyhcXGQrKSQvaSxcbiAgICBzZWxlY3Q6IG5vZGVRdWVyeVxuICB9LFxuICBub2RlX21pbm9yX3ZlcnNpb246IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9ebm9kZVxccysoXFxkK1xcLlxcZCspJC9pLFxuICAgIHNlbGVjdDogbm9kZVF1ZXJ5XG4gIH0sXG4gIG5vZGVfcGF0Y2hfdmVyc2lvbjoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbiddLFxuICAgIHJlZ2V4cDogL15ub2RlXFxzKyhcXGQrXFwuXFxkK1xcLlxcZCspJC9pLFxuICAgIHNlbGVjdDogbm9kZVF1ZXJ5XG4gIH0sXG4gIGN1cnJlbnRfbm9kZToge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL15jdXJyZW50XFxzK25vZGUkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgcmV0dXJuIFtlbnYuY3VycmVudE5vZGUocmVzb2x2ZSwgY29udGV4dCldXG4gICAgfVxuICB9LFxuICBtYWludGFpbmVkX25vZGU6IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9ebWFpbnRhaW5lZFxccytub2RlXFxzK3ZlcnNpb25zJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpXG4gICAgICB2YXIgcXVlcmllcyA9IE9iamVjdC5rZXlzKGpzRU9MKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgbm93IDwgRGF0ZS5wYXJzZShqc0VPTFtrZXldLmVuZCkgJiZcbiAgICAgICAgICAgIG5vdyA+IERhdGUucGFyc2UoanNFT0xba2V5XS5zdGFydCkgJiZcbiAgICAgICAgICAgIGlzRW9sUmVsZWFzZWQoa2V5KVxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuICdub2RlICcgKyBrZXkuc2xpY2UoMSlcbiAgICAgICAgfSlcbiAgICAgIHJldHVybiByZXNvbHZlKHF1ZXJpZXMsIGNvbnRleHQpXG4gICAgfVxuICB9LFxuICBwaGFudG9tanNfMV85OiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXnBoYW50b21qc1xccysxLjkkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gWydzYWZhcmkgNSddXG4gICAgfVxuICB9LFxuICBwaGFudG9tanNfMl8xOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXnBoYW50b21qc1xccysyLjEkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gWydzYWZhcmkgNiddXG4gICAgfVxuICB9LFxuICBicm93c2VyX3ZlcnNpb246IHtcbiAgICBtYXRjaGVzOiBbJ2Jyb3dzZXInLCAndmVyc2lvbiddLFxuICAgIHJlZ2V4cDogL14oXFx3KylcXHMrKHRwfFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciB2ZXJzaW9uID0gbm9kZS52ZXJzaW9uXG4gICAgICBpZiAoL150cCQvaS50ZXN0KHZlcnNpb24pKSB2ZXJzaW9uID0gJ1RQJ1xuICAgICAgdmFyIGRhdGEgPSBjaGVja05hbWUobm9kZS5icm93c2VyLCBjb250ZXh0KVxuICAgICAgdmFyIGFsaWFzID0gbm9ybWFsaXplVmVyc2lvbihkYXRhLCB2ZXJzaW9uKVxuICAgICAgaWYgKGFsaWFzKSB7XG4gICAgICAgIHZlcnNpb24gPSBhbGlhc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHZlcnNpb24uaW5kZXhPZignLicpID09PSAtMSkge1xuICAgICAgICAgIGFsaWFzID0gdmVyc2lvbiArICcuMCdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGlhcyA9IHZlcnNpb24ucmVwbGFjZSgvXFwuMCQvLCAnJylcbiAgICAgICAgfVxuICAgICAgICBhbGlhcyA9IG5vcm1hbGl6ZVZlcnNpb24oZGF0YSwgYWxpYXMpXG4gICAgICAgIGlmIChhbGlhcykge1xuICAgICAgICAgIHZlcnNpb24gPSBhbGlhc1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaWdub3JlVW5rbm93blZlcnNpb25zKSB7XG4gICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKFxuICAgICAgICAgICAgJ1Vua25vd24gdmVyc2lvbiAnICsgdmVyc2lvbiArICcgb2YgJyArIG5vZGUuYnJvd3NlclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIFtkYXRhLm5hbWUgKyAnICcgKyB2ZXJzaW9uXVxuICAgIH1cbiAgfSxcbiAgYnJvd3NlcnNsaXN0X2NvbmZpZzoge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL15icm93c2Vyc2xpc3QgY29uZmlnJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBicm93c2Vyc2xpc3QodW5kZWZpbmVkLCBjb250ZXh0KVxuICAgIH1cbiAgfSxcbiAgZXh0ZW5kczoge1xuICAgIG1hdGNoZXM6IFsnY29uZmlnJ10sXG4gICAgcmVnZXhwOiAvXmV4dGVuZHMgKC4rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShlbnYubG9hZFF1ZXJpZXMoY29udGV4dCwgbm9kZS5jb25maWcpLCBjb250ZXh0KVxuICAgIH1cbiAgfSxcbiAgZGVmYXVsdHM6IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9eZGVmYXVsdHMkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUoYnJvd3NlcnNsaXN0LmRlZmF1bHRzLCBjb250ZXh0KVxuICAgIH1cbiAgfSxcbiAgZGVhZDoge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL15kZWFkJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIHZhciBkZWFkID0gW1xuICAgICAgICAnQmFpZHUgPj0gMCcsXG4gICAgICAgICdpZSA8PSAxMScsXG4gICAgICAgICdpZV9tb2IgPD0gMTEnLFxuICAgICAgICAnYmIgPD0gMTAnLFxuICAgICAgICAnb3BfbW9iIDw9IDEyLjEnLFxuICAgICAgICAnc2Ftc3VuZyA0J1xuICAgICAgXVxuICAgICAgcmV0dXJuIHJlc29sdmUoZGVhZCwgY29udGV4dClcbiAgICB9XG4gIH0sXG4gIHVua25vd246IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9eKFxcdyspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIGlmIChieU5hbWUobm9kZS5xdWVyeSwgY29udGV4dCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKFxuICAgICAgICAgICdTcGVjaWZ5IHZlcnNpb25zIGluIEJyb3dzZXJzbGlzdCBxdWVyeSBmb3IgYnJvd3NlciAnICsgbm9kZS5xdWVyeVxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB1bmtub3duUXVlcnkobm9kZS5xdWVyeSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gR2V0IGFuZCBjb252ZXJ0IENhbiBJIFVzZSBkYXRhXG5cbjsoZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBuYW1lIGluIGFnZW50cykge1xuICAgIHZhciBicm93c2VyID0gYWdlbnRzW25hbWVdXG4gICAgYnJvd3NlcnNsaXN0LmRhdGFbbmFtZV0gPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmVyc2lvbnM6IG5vcm1hbGl6ZShhZ2VudHNbbmFtZV0udmVyc2lvbnMpLFxuICAgICAgcmVsZWFzZWQ6IG5vcm1hbGl6ZShhZ2VudHNbbmFtZV0udmVyc2lvbnMuc2xpY2UoMCwgLTMpKSxcbiAgICAgIHJlbGVhc2VEYXRlOiBhZ2VudHNbbmFtZV0ucmVsZWFzZV9kYXRlXG4gICAgfVxuICAgIGZpbGxVc2FnZShicm93c2Vyc2xpc3QudXNhZ2UuZ2xvYmFsLCBuYW1lLCBicm93c2VyLnVzYWdlX2dsb2JhbClcblxuICAgIGJyb3dzZXJzbGlzdC52ZXJzaW9uQWxpYXNlc1tuYW1lXSA9IHt9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBicm93c2VyLnZlcnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZnVsbCA9IGJyb3dzZXIudmVyc2lvbnNbaV1cbiAgICAgIGlmICghZnVsbCkgY29udGludWVcblxuICAgICAgaWYgKGZ1bGwuaW5kZXhPZignLScpICE9PSAtMSkge1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSBmdWxsLnNwbGl0KCctJylcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpbnRlcnZhbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGJyb3dzZXJzbGlzdC52ZXJzaW9uQWxpYXNlc1tuYW1lXVtpbnRlcnZhbFtqXV0gPSBmdWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zID0ganNSZWxlYXNlcy5tYXAoZnVuY3Rpb24gKHJlbGVhc2UpIHtcbiAgICByZXR1cm4gcmVsZWFzZS52ZXJzaW9uXG4gIH0pXG59KSgpXG5cbm1vZHVsZS5leHBvcnRzID0gYnJvd3NlcnNsaXN0XG4iLCJ2YXIgQU5EX1JFR0VYUCA9IC9eXFxzK2FuZFxccysoLiopL2lcbnZhciBPUl9SRUdFWFAgPSAvXig/OixcXHMqfFxccytvclxccyspKC4qKS9pXG5cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXkpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkgcmV0dXJuIFthcnJheV1cbiAgcmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhLmNvbmNhdChmbGF0dGVuKGIpKVxuICB9LCBbXSlcbn1cblxuZnVuY3Rpb24gZmluZChzdHJpbmcsIHByZWRpY2F0ZSkge1xuICBmb3IgKHZhciBtYXggPSBzdHJpbmcubGVuZ3RoLCBuID0gMTsgbiA8PSBtYXg7IG4rKykge1xuICAgIHZhciBwYXJzZWQgPSBzdHJpbmcuc3Vic3RyKC1uLCBuKVxuICAgIGlmIChwcmVkaWNhdGUocGFyc2VkLCBuLCBtYXgpKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnNsaWNlKDAsIC1uKVxuICAgIH1cbiAgfVxuICByZXR1cm4gJydcbn1cblxuZnVuY3Rpb24gbWF0Y2hRdWVyeShhbGwsIHF1ZXJ5KSB7XG4gIHZhciBub2RlID0geyBxdWVyeTogcXVlcnkgfVxuICBpZiAocXVlcnkuaW5kZXhPZignbm90ICcpID09PSAwKSB7XG4gICAgbm9kZS5ub3QgPSB0cnVlXG4gICAgcXVlcnkgPSBxdWVyeS5zbGljZSg0KVxuICB9XG5cbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpIHtcbiAgICB2YXIgdHlwZSA9IGFsbFtuYW1lXVxuICAgIHZhciBtYXRjaCA9IHF1ZXJ5Lm1hdGNoKHR5cGUucmVnZXhwKVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgbm9kZS50eXBlID0gbmFtZVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlLm1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbm9kZVt0eXBlLm1hdGNoZXNbaV1dID0gbWF0Y2hbaSArIDFdXG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZVxuICAgIH1cbiAgfVxuXG4gIG5vZGUudHlwZSA9ICd1bmtub3duJ1xuICByZXR1cm4gbm9kZVxufVxuXG5mdW5jdGlvbiBtYXRjaEJsb2NrKGFsbCwgc3RyaW5nLCBxcykge1xuICB2YXIgbm9kZVxuICByZXR1cm4gZmluZChzdHJpbmcsIGZ1bmN0aW9uIChwYXJzZWQsIG4sIG1heCkge1xuICAgIGlmIChBTkRfUkVHRVhQLnRlc3QocGFyc2VkKSkge1xuICAgICAgbm9kZSA9IG1hdGNoUXVlcnkoYWxsLCBwYXJzZWQubWF0Y2goQU5EX1JFR0VYUClbMV0pXG4gICAgICBub2RlLmNvbXBvc2UgPSAnYW5kJ1xuICAgICAgcXMudW5zaGlmdChub2RlKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2UgaWYgKE9SX1JFR0VYUC50ZXN0KHBhcnNlZCkpIHtcbiAgICAgIG5vZGUgPSBtYXRjaFF1ZXJ5KGFsbCwgcGFyc2VkLm1hdGNoKE9SX1JFR0VYUClbMV0pXG4gICAgICBub2RlLmNvbXBvc2UgPSAnb3InXG4gICAgICBxcy51bnNoaWZ0KG5vZGUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSBpZiAobiA9PT0gbWF4KSB7XG4gICAgICBub2RlID0gbWF0Y2hRdWVyeShhbGwsIHBhcnNlZC50cmltKCkpXG4gICAgICBub2RlLmNvbXBvc2UgPSAnb3InXG4gICAgICBxcy51bnNoaWZ0KG5vZGUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShhbGwsIHF1ZXJpZXMpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHF1ZXJpZXMpKSBxdWVyaWVzID0gW3F1ZXJpZXNdXG4gIHJldHVybiBmbGF0dGVuKFxuICAgIHF1ZXJpZXMubWFwKGZ1bmN0aW9uIChibG9jaykge1xuICAgICAgdmFyIHFzID0gW11cbiAgICAgIGRvIHtcbiAgICAgICAgYmxvY2sgPSBtYXRjaEJsb2NrKGFsbCwgYmxvY2ssIHFzKVxuICAgICAgfSB3aGlsZSAoYmxvY2spXG4gICAgICByZXR1cm4gcXNcbiAgICB9KVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cz17QTp7QTp7SzowLEU6MCxGOjAuMDU2MzA0MyxHOjAuMDQyMjI4MixBOjAuMDE0MDc2MSxCOjAuNDc4NTg2LGZDOjB9LEI6XCJtc1wiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiZkNcIixcIktcIixcIkVcIixcIkZcIixcIkdcIixcIkFcIixcIkJcIixcIlwiLFwiXCIsXCJcIl0sRTpcIklFXCIsRjp7ZkM6OTYyMzIzMjAwLEs6OTk4ODcwNDAwLEU6MTE2MTEyOTYwMCxGOjEyMzc0MjA4MDAsRzoxMzAwMDYwODAwLEE6MTM0NjcxNjgwMCxCOjEzODE5NjgwMDB9fSxCOntBOntcIjRcIjowLjAwNzE2NixcIjVcIjowLjAwNzE2NixcIjZcIjowLjAxMDc0OSxcIjdcIjowLjAwNzE2NixcIjhcIjowLjAxMDc0OSxcIjlcIjowLjAzOTQxMyxDOjAsTDowLE06MC4wMDM1ODMsSDowLE46MCxPOjAuMDA3MTY2LFA6MC4wNTczMjgsUTowLEk6MCxSOjAsUzowLFQ6MCxVOjAsVjowLFc6MCxYOjAsWTowLFo6MCxhOjAsYjowLjAxNDMzMixjOjAsZDowLGU6MCxmOjAsZzowLGg6MCxpOjAsajowLGs6MCxsOjAsbTowLG46MCxvOjAscDowLHE6MC4wMDM1ODMscjowLjAwNzE2NixzOjAuMDY0NDk0LHQ6MC4wMDcxNjYsdTowLjAwNzE2Nix2OjAuMDA3MTY2LHc6MC4wMTA3NDkseDowLjAxNDMzMixBQjowLjAxNzkxNSxCQjowLjAyNTA4MSxDQjowLjAxNDMzMixEQjowLjAyNTA4MSxFQjowLjA1Mzc0NSxGQjowLjI1NDM5MyxHQjozLjM4NTk0LEhCOjAuOTE3MjQ4LElCOjAsRDowfSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJDXCIsXCJMXCIsXCJNXCIsXCJIXCIsXCJOXCIsXCJPXCIsXCJQXCIsXCJRXCIsXCJJXCIsXCJSXCIsXCJTXCIsXCJUXCIsXCJVXCIsXCJWXCIsXCJXXCIsXCJYXCIsXCJZXCIsXCJaXCIsXCJhXCIsXCJiXCIsXCJjXCIsXCJkXCIsXCJlXCIsXCJmXCIsXCJnXCIsXCJoXCIsXCJpXCIsXCJqXCIsXCJrXCIsXCJsXCIsXCJtXCIsXCJuXCIsXCJvXCIsXCJwXCIsXCJxXCIsXCJyXCIsXCJzXCIsXCJ0XCIsXCJ1XCIsXCJ2XCIsXCJ3XCIsXCJ4XCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCJBQlwiLFwiQkJcIixcIkNCXCIsXCJEQlwiLFwiRUJcIixcIkZCXCIsXCJHQlwiLFwiSEJcIixcIklCXCIsXCJEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJFZGdlXCIsRjp7XCI0XCI6MTY4OTg5NzYwMCxcIjVcIjoxNjkyNTc2MDAwLFwiNlwiOjE2OTQ2NDk2MDAsXCI3XCI6MTY5NzE1NTIwMCxcIjhcIjoxNjk4OTY5NjAwLFwiOVwiOjE3MDE5OTM2MDAsQzoxNDM4MTI4MDAwLEw6MTQ0NzI4NjQwMCxNOjE0NzAwOTYwMDAsSDoxNDkxODY4ODAwLE46MTUwODE5ODQwMCxPOjE1MjUwNDY0MDAsUDoxNTQyMDY3MjAwLFE6MTU3OTA0NjQwMCxJOjE1ODEwMzM2MDAsUjoxNTg2NzM2MDAwLFM6MTU5MDAxOTIwMCxUOjE1OTQ4NTc2MDAsVToxNTk4NDg2NDAwLFY6MTYwMjIwMTYwMCxXOjE2MDU4MzA0MDAsWDoxNjExMzYwMDAwLFk6MTYxNDgxNjAwMCxaOjE2MTgzNTg0MDAsYToxNjIyMDczNjAwLGI6MTYyNjkxMjAwMCxjOjE2MzA2MjcyMDAsZDoxNjMyNDQxNjAwLGU6MTYzNDc3NDQwMCxmOjE2Mzc1MzkyMDAsZzoxNjQxNDI3MjAwLGg6MTY0MzkzMjgwMCxpOjE2NDYyNjU2MDAsajoxNjQ5NjM1MjAwLGs6MTY1MTE5MDQwMCxsOjE2NTM5NTUyMDAsbToxNjU1OTQyNDAwLG46MTY1OTY1NzYwMCxvOjE2NjE5OTA0MDAscDoxNjY0NzU1MjAwLHE6MTY2NjkxNTIwMCxyOjE2NzAxOTg0MDAsczoxNjczNDgxNjAwLHQ6MTY3NTkwMDgwMCx1OjE2Nzg2NjU2MDAsdjoxNjgwODI1NjAwLHc6MTY4MzE1ODQwMCx4OjE2ODU2NjQwMDAsQUI6MTcwNjIyNzIwMCxCQjoxNzA4NzMyODAwLENCOjE3MTExNTIwMDAsREI6MTcxMzM5ODQwMCxFQjoxNzE1OTkwNDAwLEZCOjE3MTg4NDE2MDAsR0I6MTcyMTg2NTYwMCxIQjoxNzI0MzcxMjAwLElCOjE3MjY3MDQwMDAsRDoxNzI5MTIzMjAwfSxEOntDOlwibXNcIixMOlwibXNcIixNOlwibXNcIixIOlwibXNcIixOOlwibXNcIixPOlwibXNcIixQOlwibXNcIn19LEM6e0E6e1wiMFwiOjAsXCIxXCI6MCxcIjJcIjowLFwiM1wiOjAsXCI0XCI6MC4zNTExMzQsXCI1XCI6MCxcIjZcIjowLjAwNzE2NixcIjdcIjowLjA4OTU3NSxcIjhcIjowLFwiOVwiOjAuMDA3MTY2LGdDOjAsR0M6MCxKOjAuMDAzNTgzLEpCOjAsSzowLEU6MCxGOjAsRzowLEE6MCxCOjAuMDE0MzMyLEM6MCxMOjAsTTowLEg6MCxOOjAsTzowLFA6MCxLQjowLHk6MCx6OjAsTEI6MCxNQjowLE5COjAsT0I6MCxQQjowLFFCOjAsUkI6MCxTQjowLFRCOjAsVUI6MCxWQjowLFdCOjAsWEI6MCxZQjowLFpCOjAsYUI6MCxiQjowLGNCOjAuMDAzNTgzLGRCOjAuMDA3MTY2LGVCOjAuMDAzNTgzLGZCOjAsZ0I6MCxoQjowLGlCOjAsakI6MC4wMDM1ODMsa0I6MCxsQjowLjA0Mjk5NixtQjowLG5COjAuMDA3MTY2LG9COjAuMDAzNTgzLHBCOjAuMDE3OTE1LHFCOjAsckI6MCxIQzowLjAwMzU4MyxzQjowLElDOjAsdEI6MCx1QjowLHZCOjAsd0I6MCx4QjowLHlCOjAsekI6MCxcIjBCXCI6MCxcIjFCXCI6MCxcIjJCXCI6MCxcIjNCXCI6MCxcIjRCXCI6MCxcIjVCXCI6MCxcIjZCXCI6MCxcIjdCXCI6MCxcIjhCXCI6MCxcIjlCXCI6MC4wMTQzMzIsUTowLEk6MCxSOjAsSkM6MCxTOjAsVDowLFU6MCxWOjAsVzowLFg6MC4wMDcxNjYsWTowLFo6MCxhOjAsYjowLGM6MCxkOjAuMDAzNTgzLGU6MCxmOjAsZzowLGg6MCxpOjAsajowLGs6MCxsOjAuMDA3MTY2LG06MC4wMTA3NDksbjowLG86MC4wMDM1ODMscDowLHE6MCxyOjAsczowLjAwNzE2Nix0OjAsdTowLHY6MCx3OjAuMDA3MTY2LHg6MCxBQjowLjAwNzE2NixCQjowLjAwMzU4MyxDQjowLjAwNzE2NixEQjowLjAwNzE2NixFQjowLjAxNDMzMixGQjowLjAzMjI0NyxHQjowLjA0Mjk5NixIQjowLjQ0Nzg3NSxJQjoxLjA4OTIzLEQ6MC4wMDcxNjYsS0M6MCxMQzowLE1DOjAsaEM6MCxpQzowLGpDOjAsa0M6MH0sQjpcIm1velwiLEM6W1wiZ0NcIixcIkdDXCIsXCJqQ1wiLFwia0NcIixcIkpcIixcIkpCXCIsXCJLXCIsXCJFXCIsXCJGXCIsXCJHXCIsXCJBXCIsXCJCXCIsXCJDXCIsXCJMXCIsXCJNXCIsXCJIXCIsXCJOXCIsXCJPXCIsXCJQXCIsXCJLQlwiLFwieVwiLFwielwiLFwiMFwiLFwiMVwiLFwiMlwiLFwiM1wiLFwiTEJcIixcIk1CXCIsXCJOQlwiLFwiT0JcIixcIlBCXCIsXCJRQlwiLFwiUkJcIixcIlNCXCIsXCJUQlwiLFwiVUJcIixcIlZCXCIsXCJXQlwiLFwiWEJcIixcIllCXCIsXCJaQlwiLFwiYUJcIixcImJCXCIsXCJjQlwiLFwiZEJcIixcImVCXCIsXCJmQlwiLFwiZ0JcIixcImhCXCIsXCJpQlwiLFwiakJcIixcImtCXCIsXCJsQlwiLFwibUJcIixcIm5CXCIsXCJvQlwiLFwicEJcIixcInFCXCIsXCJyQlwiLFwiSENcIixcInNCXCIsXCJJQ1wiLFwidEJcIixcInVCXCIsXCJ2QlwiLFwid0JcIixcInhCXCIsXCJ5QlwiLFwiekJcIixcIjBCXCIsXCIxQlwiLFwiMkJcIixcIjNCXCIsXCI0QlwiLFwiNUJcIixcIjZCXCIsXCI3QlwiLFwiOEJcIixcIjlCXCIsXCJRXCIsXCJJXCIsXCJSXCIsXCJKQ1wiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiLFwiblwiLFwib1wiLFwicFwiLFwicVwiLFwiclwiLFwic1wiLFwidFwiLFwidVwiLFwidlwiLFwid1wiLFwieFwiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiQUJcIixcIkJCXCIsXCJDQlwiLFwiREJcIixcIkVCXCIsXCJGQlwiLFwiR0JcIixcIkhCXCIsXCJJQlwiLFwiRFwiLFwiS0NcIixcIkxDXCIsXCJNQ1wiLFwiaENcIixcImlDXCJdLEU6XCJGaXJlZm94XCIsRjp7XCIwXCI6MTM2ODQ4OTYwMCxcIjFcIjoxMzcyMTE4NDAwLFwiMlwiOjEzNzU3NDcyMDAsXCIzXCI6MTM3OTM3NjAwMCxcIjRcIjoxNjg4NDI4ODAwLFwiNVwiOjE2OTA4NDgwMDAsXCI2XCI6MTY5MzI2NzIwMCxcIjdcIjoxNjk1Njg2NDAwLFwiOFwiOjE2OTgxMDU2MDAsXCI5XCI6MTcwMDUyNDgwMCxnQzoxMTYxNjQ4MDAwLEdDOjEyMTM2NjA4MDAsakM6MTI0NjMyMDAwMCxrQzoxMjY0MDMyMDAwLEo6MTMwMDc1MjAwMCxKQjoxMzA4NjE0NDAwLEs6MTMxMzQ1MjgwMCxFOjEzMTcwODE2MDAsRjoxMzE3MDgxNjAwLEc6MTMyMDcxMDQwMCxBOjEzMjQzMzkyMDAsQjoxMzI3OTY4MDAwLEM6MTMzMTU5NjgwMCxMOjEzMzUyMjU2MDAsTToxMzM4ODU0NDAwLEg6MTM0MjQ4MzIwMCxOOjEzNDYxMTIwMDAsTzoxMzQ5NzQwODAwLFA6MTM1MzYyODgwMCxLQjoxMzU3NjAzMjAwLHk6MTM2MTIzMjAwMCx6OjEzNjQ4NjA4MDAsTEI6MTM4NjYzMzYwMCxNQjoxMzkxNDcyMDAwLE5COjEzOTUxMDA4MDAsT0I6MTM5ODcyOTYwMCxQQjoxNDAyMzU4NDAwLFFCOjE0MDU5ODcyMDAsUkI6MTQwOTYxNjAwMCxTQjoxNDEzMjQ0ODAwLFRCOjE0MTczOTIwMDAsVUI6MTQyMTEwNzIwMCxWQjoxNDI0NzM2MDAwLFdCOjE0MjgyNzg0MDAsWEI6MTQzMTQ3NTIwMCxZQjoxNDM1ODgxNjAwLFpCOjE0MzkyNTEyMDAsYUI6MTQ0Mjg4MDAwMCxiQjoxNDQ2NTA4ODAwLGNCOjE0NTAxMzc2MDAsZEI6MTQ1Mzg1MjgwMCxlQjoxNDU3Mzk1MjAwLGZCOjE0NjE2Mjg4MDAsZ0I6MTQ2NTI1NzYwMCxoQjoxNDcwMDk2MDAwLGlCOjE0NzQzMjk2MDAsakI6MTQ3OTE2ODAwMCxrQjoxNDg1MjE2MDAwLGxCOjE0ODg4NDQ4MDAsbUI6MTQ5MjU2MDAwMCxuQjoxNDk3MzEyMDAwLG9COjE1MDIxNTA0MDAscEI6MTUwNjU1NjgwMCxxQjoxNTEwNjE3NjAwLHJCOjE1MTY2NjU2MDAsSEM6MTUyMDk4NTYwMCxzQjoxNTI1ODI0MDAwLElDOjE1Mjk5NzEyMDAsdEI6MTUzNjEwNTYwMCx1QjoxNTQwMjUyODAwLHZCOjE1NDQ0ODY0MDAsd0I6MTU0ODcyMDAwMCx4QjoxNTUyOTUzNjAwLHlCOjE1NTgzOTY4MDAsekI6MTU2MjYzMDQwMCxcIjBCXCI6MTU2NzQ2ODgwMCxcIjFCXCI6MTU3MTc4ODgwMCxcIjJCXCI6MTU3NTMzMTIwMCxcIjNCXCI6MTU3ODM1NTIwMCxcIjRCXCI6MTU4MTM3OTIwMCxcIjVCXCI6MTU4Mzc5ODQwMCxcIjZCXCI6MTU4NjMwNDAwMCxcIjdCXCI6MTU4ODYzNjgwMCxcIjhCXCI6MTU5MTA1NjAwMCxcIjlCXCI6MTU5MzQ3NTIwMCxROjE1OTU4OTQ0MDAsSToxNTk4MzEzNjAwLFI6MTYwMDczMjgwMCxKQzoxNjAzMTUyMDAwLFM6MTYwNTU3MTIwMCxUOjE2MDc5OTA0MDAsVToxNjExNjE5MjAwLFY6MTYxNDAzODQwMCxXOjE2MTY0NTc2MDAsWDoxNjE4NzkwNDAwLFk6MTYyMjUwNTYwMCxaOjE2MjYxMzQ0MDAsYToxNjI4NTUzNjAwLGI6MTYzMDk3MjgwMCxjOjE2MzMzOTIwMDAsZDoxNjM1ODExMjAwLGU6MTYzODgzNTIwMCxmOjE2NDE4NTkyMDAsZzoxNjQ0MzY0ODAwLGg6MTY0NjY5NzYwMCxpOjE2NDkxMTY4MDAsajoxNjUxNTM2MDAwLGs6MTY1Mzk1NTIwMCxsOjE2NTYzNzQ0MDAsbToxNjU4NzkzNjAwLG46MTY2MTIxMjgwMCxvOjE2NjM2MzIwMDAscDoxNjY2MDUxMjAwLHE6MTY2ODQ3MDQwMCxyOjE2NzA4ODk2MDAsczoxNjczOTEzNjAwLHQ6MTY3NjMzMjgwMCx1OjE2Nzg3NTIwMDAsdjoxNjgxMTcxMjAwLHc6MTY4MzU5MDQwMCx4OjE2ODYwMDk2MDAsQUI6MTcwMjk0NDAwMCxCQjoxNzA1OTY4MDAwLENCOjE3MDgzODcyMDAsREI6MTcxMDgwNjQwMCxFQjoxNzEzMjI1NjAwLEZCOjE3MTU2NDQ4MDAsR0I6MTcxODA2NDAwMCxIQjoxNzIwNDgzMjAwLElCOjE3MjI5MDI0MDAsRDoxNzI1MzIxNjAwLEtDOjE3Mjc3NDA4MDAsTEM6MTczMDE2MDAwMCxNQzpudWxsLGhDOm51bGwsaUM6bnVsbH19LEQ6e0E6e1wiMFwiOjAsXCIxXCI6MCxcIjJcIjowLFwiM1wiOjAsXCI0XCI6MC4wMzU4MyxcIjVcIjowLjE2ODQwMSxcIjZcIjowLjEwNzQ5LFwiN1wiOjAuMDcxNjYsXCI4XCI6MC4wNjgwNzcsXCI5XCI6MC4xMDc0OSxKOjAsSkI6MCxLOjAsRTowLEY6MCxHOjAsQTowLEI6MCxDOjAsTDowLE06MCxIOjAsTjowLE86MCxQOjAsS0I6MCx5OjAsejowLExCOjAsTUI6MCxOQjowLE9COjAsUEI6MCxRQjowLFJCOjAsU0I6MCxUQjowLFVCOjAsVkI6MCxXQjowLFhCOjAuMDEwNzQ5LFlCOjAsWkI6MCxhQjowLGJCOjAsY0I6MCxkQjowLGVCOjAuMDAzNTgzLGZCOjAsZ0I6MC4wMDcxNjYsaEI6MC4wMjUwODEsaUI6MC4wMjE0OTgsakI6MC4wMDcxNjYsa0I6MC4wMDM1ODMsbEI6MC4wMDM1ODMsbUI6MC4wMDcxNjYsbkI6MCxvQjowLHBCOjAuMDMyMjQ3LHFCOjAuMDAzNTgzLHJCOjAuMDA3MTY2LEhDOjAsc0I6MCxJQzowLjAwMzU4Myx0QjowLHVCOjAsdkI6MCx3QjowLHhCOjAuMDI1MDgxLHlCOjAuMDA3MTY2LHpCOjAsXCIwQlwiOjAuMDI4NjY0LFwiMUJcIjowLjAyODY2NCxcIjJCXCI6MCxcIjNCXCI6MCxcIjRCXCI6MC4wMDcxNjYsXCI1QlwiOjAuMDEwNzQ5LFwiNkJcIjowLjAxMDc0OSxcIjdCXCI6MC4wMDcxNjYsXCI4QlwiOjAuMDIxNDk4LFwiOUJcIjowLjAxNzkxNSxROjAuMTAzOTA3LEk6MC4wMTQzMzIsUjowLjAyMTQ5OCxTOjAuMDMyMjQ3LFQ6MC4wMTA3NDksVTowLjAxNDMzMixWOjAuMDI1MDgxLFc6MC4wNzUyNDMsWDowLjAxNzkxNSxZOjAuMDEwNzQ5LFo6MC4wMTQzMzIsYTowLjA1Mzc0NSxiOjAuMDE0MzMyLGM6MC4wMTQzMzIsZDowLjA1MDE2MixlOjAuMDEwNzQ5LGY6MC4wMTA3NDksZzowLjAxNzkxNSxoOjAuMDQ2NTc5LGk6MC4wMjUwODEsajowLjAyMTQ5OCxrOjAuMDIxNDk4LGw6MC4wMTc5MTUsbTowLjExMTA3MyxuOjAuMDg1OTkyLG86MC4wMTc5MTUscDowLjAyODY2NCxxOjAuMDM1ODMscjowLjA0NjU3OSxzOjEuNDI2MDMsdDowLjAyNTA4MSx1OjAuMDM5NDEzLHY6MC4wNTAxNjIsdzowLjEwNzQ5LHg6MC4xMDM5MDcsQUI6MC4xMDc0OSxCQjowLjExODIzOSxDQjowLjE0MzMyLERCOjAuMjI5MzEyLEVCOjAuMzY5MDQ5LEZCOjEuNDkwNTMsR0I6MTIuNzc3LEhCOjIuMzA3NDUsSUI6MC4wMTQzMzIsRDowLjAwMzU4MyxLQzowLExDOjAsTUM6MH0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJKXCIsXCJKQlwiLFwiS1wiLFwiRVwiLFwiRlwiLFwiR1wiLFwiQVwiLFwiQlwiLFwiQ1wiLFwiTFwiLFwiTVwiLFwiSFwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiS0JcIixcInlcIixcInpcIixcIjBcIixcIjFcIixcIjJcIixcIjNcIixcIkxCXCIsXCJNQlwiLFwiTkJcIixcIk9CXCIsXCJQQlwiLFwiUUJcIixcIlJCXCIsXCJTQlwiLFwiVEJcIixcIlVCXCIsXCJWQlwiLFwiV0JcIixcIlhCXCIsXCJZQlwiLFwiWkJcIixcImFCXCIsXCJiQlwiLFwiY0JcIixcImRCXCIsXCJlQlwiLFwiZkJcIixcImdCXCIsXCJoQlwiLFwiaUJcIixcImpCXCIsXCJrQlwiLFwibEJcIixcIm1CXCIsXCJuQlwiLFwib0JcIixcInBCXCIsXCJxQlwiLFwickJcIixcIkhDXCIsXCJzQlwiLFwiSUNcIixcInRCXCIsXCJ1QlwiLFwidkJcIixcIndCXCIsXCJ4QlwiLFwieUJcIixcInpCXCIsXCIwQlwiLFwiMUJcIixcIjJCXCIsXCIzQlwiLFwiNEJcIixcIjVCXCIsXCI2QlwiLFwiN0JcIixcIjhCXCIsXCI5QlwiLFwiUVwiLFwiSVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiLFwiblwiLFwib1wiLFwicFwiLFwicVwiLFwiclwiLFwic1wiLFwidFwiLFwidVwiLFwidlwiLFwid1wiLFwieFwiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiQUJcIixcIkJCXCIsXCJDQlwiLFwiREJcIixcIkVCXCIsXCJGQlwiLFwiR0JcIixcIkhCXCIsXCJJQlwiLFwiRFwiLFwiS0NcIixcIkxDXCIsXCJNQ1wiXSxFOlwiQ2hyb21lXCIsRjp7XCIwXCI6MTM0MzY5MjgwMCxcIjFcIjoxMzQ4NTMxMjAwLFwiMlwiOjEzNTIyNDY0MDAsXCIzXCI6MTM1Nzg2MjQwMCxcIjRcIjoxNjg5NzI0ODAwLFwiNVwiOjE2OTIwNTc2MDAsXCI2XCI6MTY5NDQ3NjgwMCxcIjdcIjoxNjk2ODk2MDAwLFwiOFwiOjE2OTg3MTA0MDAsXCI5XCI6MTcwMTk5MzYwMCxKOjEyNjQzNzc2MDAsSkI6MTI3NDc0NTYwMCxLOjEyODMzODU2MDAsRToxMjg3NjE5MjAwLEY6MTI5MTI0ODAwMCxHOjEyOTY3Nzc2MDAsQToxMjk5NTQyNDAwLEI6MTMwMzg2MjQwMCxDOjEzMDc0MDQ4MDAsTDoxMzEyMjQzMjAwLE06MTMxNjEzMTIwMCxIOjEzMTYxMzEyMDAsTjoxMzE5NTAwODAwLE86MTMyMzczNDQwMCxQOjEzMjg2NTkyMDAsS0I6MTMzMjg5MjgwMCx5OjEzMzcwNDAwMDAsejoxMzQwNjY4ODAwLExCOjEzNjE0MDQ4MDAsTUI6MTM2NDQyODgwMCxOQjoxMzY5MDk0NDAwLE9COjEzNzQxMDU2MDAsUEI6MTM3Njk1NjgwMCxRQjoxMzg0MjE0NDAwLFJCOjEzODk2NTc2MDAsU0I6MTM5Mjk0MDgwMCxUQjoxMzk3MDAxNjAwLFVCOjE0MDA1NDQwMDAsVkI6MTQwNTQ2ODgwMCxXQjoxNDA5MDExMjAwLFhCOjE0MTI2NDAwMDAsWUI6MTQxNjI2ODgwMCxaQjoxNDIxNzk4NDAwLGFCOjE0MjU1MTM2MDAsYkI6MTQyOTQwMTYwMCxjQjoxNDMyMDgwMDAwLGRCOjE0Mzc1MjMyMDAsZUI6MTQ0MTE1MjAwMCxmQjoxNDQ0NzgwODAwLGdCOjE0NDkwMTQ0MDAsaEI6MTQ1MzI0ODAwMCxpQjoxNDU2OTYzMjAwLGpCOjE0NjA1OTIwMDAsa0I6MTQ2NDEzNDQwMCxsQjoxNDY5MDU5MjAwLG1COjE0NzI2MDE2MDAsbkI6MTQ3NjIzMDQwMCxvQjoxNDgwNTUwNDAwLHBCOjE0ODUzMDI0MDAscUI6MTQ4OTAxNzYwMCxyQjoxNDkyNTYwMDAwLEhDOjE0OTY3MDcyMDAsc0I6MTUwMDk0MDgwMCxJQzoxNTA0NTY5NjAwLHRCOjE1MDgxOTg0MDAsdUI6MTUxMjUxODQwMCx2QjoxNTE2NzUyMDAwLHdCOjE1MjAyOTQ0MDAseEI6MTUyMzkyMzIwMCx5QjoxNTI3NTUyMDAwLHpCOjE1MzIzOTA0MDAsXCIwQlwiOjE1MzYwMTkyMDAsXCIxQlwiOjE1Mzk2NDgwMDAsXCIyQlwiOjE1NDM5NjgwMDAsXCIzQlwiOjE1NDg3MjAwMDAsXCI0QlwiOjE1NTIzNDg4MDAsXCI1QlwiOjE1NTU5Nzc2MDAsXCI2QlwiOjE1NTk2MDY0MDAsXCI3QlwiOjE1NjQ0NDQ4MDAsXCI4QlwiOjE1NjgwNzM2MDAsXCI5QlwiOjE1NzE3MDI0MDAsUToxNTc1OTM2MDAwLEk6MTU4MDg2MDgwMCxSOjE1ODYzMDQwMDAsUzoxNTg5ODQ2NDAwLFQ6MTU5NDY4NDgwMCxVOjE1OTgzMTM2MDAsVjoxNjAxOTQyNDAwLFc6MTYwNTU3MTIwMCxYOjE2MTEwMTQ0MDAsWToxNjE0NTU2ODAwLFo6MTYxODI3MjAwMCxhOjE2MjE5ODcyMDAsYjoxNjI2NzM5MjAwLGM6MTYzMDM2ODAwMCxkOjE2MzIyNjg4MDAsZToxNjM0NjAxNjAwLGY6MTYzNzAyMDgwMCxnOjE2NDEzNDA4MDAsaDoxNjQzNjczNjAwLGk6MTY0NjA5MjgwMCxqOjE2NDg1MTIwMDAsazoxNjUwOTMxMjAwLGw6MTY1MzM1MDQwMCxtOjE2NTU3Njk2MDAsbjoxNjU5Mzk4NDAwLG86MTY2MTgxNzYwMCxwOjE2NjQyMzY4MDAscToxNjY2NjU2MDAwLHI6MTY2OTY4MDAwMCxzOjE2NzMzMDg4MDAsdDoxNjc1NzI4MDAwLHU6MTY3ODE0NzIwMCx2OjE2ODA1NjY0MDAsdzoxNjgyOTg1NjAwLHg6MTY4NTQwNDgwMCxBQjoxNzA1OTY4MDAwLEJCOjE3MDgzODcyMDAsQ0I6MTcxMDgwNjQwMCxEQjoxNzEzMjI1NjAwLEVCOjE3MTU2NDQ4MDAsRkI6MTcxODA2NDAwMCxHQjoxNzIxMTc0NDAwLEhCOjE3MjQxMTIwMDAsSUI6MTcyNjUzMTIwMCxEOjE3Mjg5NTA0MDAsS0M6bnVsbCxMQzpudWxsLE1DOm51bGx9fSxFOntBOntKOjAsSkI6MCxLOjAsRTowLEY6MCxHOjAuMDAzNTgzLEE6MCxCOjAsQzowLEw6MC4wMDcxNjYsTTowLjAyODY2NCxIOjAuMDA3MTY2LGxDOjAsTkM6MCxtQzowLG5DOjAsb0M6MCxwQzowLE9DOjAsQUM6MC4wMDcxNjYsQkM6MC4wMTA3NDkscUM6MC4wNTczMjgsckM6MC4wNzg4MjYsc0M6MC4wMjUwODEsUEM6MC4wMTA3NDksUUM6MC4wMjE0OTgsQ0M6MC4wMjg2NjQsdEM6MC4yMTg1NjMsREM6MC4wMjg2NjQsUkM6MC4wMzU4MyxTQzowLjAzMjI0NyxUQzowLjE4MjczMyxVQzowLjAyMTQ5OCxWQzowLjA0Mjk5Nix1QzowLjI5MDIyMyxFQzowLjAxNzkxNSxXQzowLjAzOTQxMyxYQzowLjAzOTQxMyxZQzowLjA0Mjk5NixaQzowLjExODIzOSxhQzoxLjQ0NzUzLGJDOjAuNDE1NjI4LEZDOjAuMDE3OTE1LGNDOjAsdkM6MH0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwibENcIixcIk5DXCIsXCJKXCIsXCJKQlwiLFwibUNcIixcIktcIixcIm5DXCIsXCJFXCIsXCJvQ1wiLFwiRlwiLFwiR1wiLFwicENcIixcIkFcIixcIk9DXCIsXCJCXCIsXCJBQ1wiLFwiQ1wiLFwiQkNcIixcIkxcIixcInFDXCIsXCJNXCIsXCJyQ1wiLFwiSFwiLFwic0NcIixcIlBDXCIsXCJRQ1wiLFwiQ0NcIixcInRDXCIsXCJEQ1wiLFwiUkNcIixcIlNDXCIsXCJUQ1wiLFwiVUNcIixcIlZDXCIsXCJ1Q1wiLFwiRUNcIixcIldDXCIsXCJYQ1wiLFwiWUNcIixcIlpDXCIsXCJhQ1wiLFwiYkNcIixcIkZDXCIsXCJjQ1wiLFwidkNcIixcIlwiXSxFOlwiU2FmYXJpXCIsRjp7bEM6MTIwNTc5ODQwMCxOQzoxMjI2NTM0NDAwLEo6MTI0NDQxOTIwMCxKQjoxMjc1ODY4ODAwLG1DOjEzMTExMjAwMDAsSzoxMzQzMTc0NDAwLG5DOjEzODI0MDAwMDAsRToxMzgyNDAwMDAwLG9DOjE0MTA5OTg0MDAsRjoxNDEzNDE3NjAwLEc6MTQ0MzY1NzYwMCxwQzoxNDU4NTE4NDAwLEE6MTQ3NDMyOTYwMCxPQzoxNDkwNTcyODAwLEI6MTUwNTc3OTIwMCxBQzoxNTIyMjgxNjAwLEM6MTUzNzE0MjQwMCxCQzoxNTUzNDcyMDAwLEw6MTU2ODg1MTIwMCxxQzoxNTg1MDA4MDAwLE06MTYwMDIxNDQwMCxyQzoxNjE5Mzk1MjAwLEg6MTYzMjA5NjAwMCxzQzoxNjM1MjkyODAwLFBDOjE2MzkzNTM2MDAsUUM6MTY0NzIxNjAwMCxDQzoxNjUyNzQ1NjAwLHRDOjE2NTgyNzUyMDAsREM6MTY2Mjk0MDgwMCxSQzoxNjY2NTY5NjAwLFNDOjE2NzA4ODk2MDAsVEM6MTY3NDQzMjAwMCxVQzoxNjc5ODc1MjAwLFZDOjE2ODQzNjgwMDAsdUM6MTY5MDE1NjgwMCxFQzoxNjk1Njg2NDAwLFdDOjE2OTgxOTIwMDAsWEM6MTcwMjI1MjgwMCxZQzoxNzA1ODgxNjAwLFpDOjE3MDk1OTY4MDAsYUM6MTcxNTU1ODQwMCxiQzoxNzIyMjExMjAwLEZDOjE3MjY0NDQ4MDAsY0M6bnVsbCx2QzpudWxsfX0sRjp7QTp7XCIwXCI6MCxcIjFcIjowLFwiMlwiOjAsXCIzXCI6MCxHOjAsQjowLEM6MCxIOjAsTjowLE86MCxQOjAsS0I6MCx5OjAsejowLExCOjAsTUI6MCxOQjowLE9COjAsUEI6MCxRQjowLFJCOjAsU0I6MCxUQjowLFVCOjAsVkI6MCxXQjowLFhCOjAsWUI6MCxaQjowLjAwMzU4MyxhQjowLGJCOjAsY0I6MCxkQjowLGVCOjAsZkI6MC4wMTc5MTUsZ0I6MCxoQjowLGlCOjAsakI6MCxrQjowLGxCOjAsbUI6MCxuQjowLG9COjAscEI6MCxxQjowLHJCOjAsc0I6MCx0QjowLHVCOjAsdkI6MCx3QjowLHhCOjAseUI6MCx6QjowLFwiMEJcIjowLFwiMUJcIjowLFwiMkJcIjowLFwiM0JcIjowLFwiNEJcIjowLFwiNUJcIjowLFwiNkJcIjowLFwiN0JcIjowLFwiOEJcIjowLFwiOUJcIjowLFE6MCxJOjAsUjowLEpDOjAsUzowLjAyODY2NCxUOjAuMDAzNTgzLFU6MCxWOjAsVzowLFg6MCxZOjAsWjowLGE6MCxiOjAsYzowLGQ6MCxlOjAuMDM5NDEzLGY6MCxnOjAsaDowLGk6MCxqOjAsazowLGw6MC4wMzIyNDcsbTowLG46MCxvOjAscDowLHE6MCxyOjAsczowLjE1NDA2OSx0OjAsdTowLjA2MDkxMSx2OjAsdzowLHg6MCx3QzowLHhDOjAseUM6MCx6QzowLEFDOjAsZEM6MCxcIjBDXCI6MCxCQzowfSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJHXCIsXCJ3Q1wiLFwieENcIixcInlDXCIsXCJ6Q1wiLFwiQlwiLFwiQUNcIixcImRDXCIsXCIwQ1wiLFwiQ1wiLFwiQkNcIixcIkhcIixcIk5cIixcIk9cIixcIlBcIixcIktCXCIsXCJ5XCIsXCJ6XCIsXCIwXCIsXCIxXCIsXCIyXCIsXCIzXCIsXCJMQlwiLFwiTUJcIixcIk5CXCIsXCJPQlwiLFwiUEJcIixcIlFCXCIsXCJSQlwiLFwiU0JcIixcIlRCXCIsXCJVQlwiLFwiVkJcIixcIldCXCIsXCJYQlwiLFwiWUJcIixcIlpCXCIsXCJhQlwiLFwiYkJcIixcImNCXCIsXCJkQlwiLFwiZUJcIixcImZCXCIsXCJnQlwiLFwiaEJcIixcImlCXCIsXCJqQlwiLFwia0JcIixcImxCXCIsXCJtQlwiLFwibkJcIixcIm9CXCIsXCJwQlwiLFwicUJcIixcInJCXCIsXCJzQlwiLFwidEJcIixcInVCXCIsXCJ2QlwiLFwid0JcIixcInhCXCIsXCJ5QlwiLFwiekJcIixcIjBCXCIsXCIxQlwiLFwiMkJcIixcIjNCXCIsXCI0QlwiLFwiNUJcIixcIjZCXCIsXCI3QlwiLFwiOEJcIixcIjlCXCIsXCJRXCIsXCJJXCIsXCJSXCIsXCJKQ1wiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiLFwiblwiLFwib1wiLFwicFwiLFwicVwiLFwiclwiLFwic1wiLFwidFwiLFwidVwiLFwidlwiLFwid1wiLFwieFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiT3BlcmFcIixGOntcIjBcIjoxNDAxNzUzNjAwLFwiMVwiOjE0MDU5ODcyMDAsXCIyXCI6MTQwOTYxNjAwMCxcIjNcIjoxNDEzMzMxMjAwLEc6MTE1MDc2MTYwMCx3QzoxMjIzNDI0MDAwLHhDOjEyNTE3NjMyMDAseUM6MTI2NzQ4ODAwMCx6QzoxMjc3OTQyNDAwLEI6MTI5MjQ1NzYwMCxBQzoxMzAyNTY2NDAwLGRDOjEzMDkyMTkyMDAsXCIwQ1wiOjEzMjMxMjk2MDAsQzoxMzIzMTI5NjAwLEJDOjEzNTIwNzM2MDAsSDoxMzcyNzIzMjAwLE46MTM3NzU2MTYwMCxPOjEzODExMDQwMDAsUDoxMzg2Mjg4MDAwLEtCOjEzOTA4NjcyMDAseToxMzkzODkxMjAwLHo6MTM5OTMzNDQwMCxMQjoxNDE3MTMyODAwLE1COjE0MjIzMTY4MDAsTkI6MTQyNTk0NTYwMCxPQjoxNDMwMTc5MjAwLFBCOjE0MzM4MDgwMDAsUUI6MTQzODY0NjQwMCxSQjoxNDQyNDQ4MDAwLFNCOjE0NDU5MDQwMDAsVEI6MTQ0OTEwMDgwMCxVQjoxNDU0MzcxMjAwLFZCOjE0NTczMDg4MDAsV0I6MTQ2MjMyMDAwMCxYQjoxNDY1MzQ0MDAwLFlCOjE0NzAwOTYwMDAsWkI6MTQ3NDMyOTYwMCxhQjoxNDc3MjY3MjAwLGJCOjE0ODE1ODcyMDAsY0I6MTQ4NjQyNTYwMCxkQjoxNDkwMDU0NDAwLGVCOjE0OTQzNzQ0MDAsZkI6MTQ5ODAwMzIwMCxnQjoxNTAyMjM2ODAwLGhCOjE1MDY0NzA0MDAsaUI6MTUxMDA5OTIwMCxqQjoxNTE1MDI0MDAwLGtCOjE1MTc5NjE2MDAsbEI6MTUyMTY3NjgwMCxtQjoxNTI1OTEwNDAwLG5COjE1MzAxNDQwMDAsb0I6MTUzNDk4MjQwMCxwQjoxNTM3ODMzNjAwLHFCOjE1NDMzNjMyMDAsckI6MTU0ODIwMTYwMCxzQjoxNTU0NzY4MDAwLHRCOjE1NjE1OTM2MDAsdUI6MTU2NjI1OTIwMCx2QjoxNTcwNDA2NDAwLHdCOjE1NzM2ODk2MDAseEI6MTU3ODQ0MTYwMCx5QjoxNTgzOTcxMjAwLHpCOjE1ODc1MTM2MDAsXCIwQlwiOjE1OTI5NTY4MDAsXCIxQlwiOjE1OTU4OTQ0MDAsXCIyQlwiOjE2MDAxMjgwMDAsXCIzQlwiOjE2MDMyMzg0MDAsXCI0QlwiOjE2MTM1MjAwMDAsXCI1QlwiOjE2MTIyMjQwMDAsXCI2QlwiOjE2MTY1NDQwMDAsXCI3QlwiOjE2MTk1NjgwMDAsXCI4QlwiOjE2MjM3MTUyMDAsXCI5QlwiOjE2Mjc5NDg4MDAsUToxNjMxNTc3NjAwLEk6MTYzMzM5MjAwMCxSOjE2MzU5ODQwMDAsSkM6MTYzODQwMzIwMCxTOjE2NDI1NTA0MDAsVDoxNjQ0OTY5NjAwLFU6MTY0Nzk5MzYwMCxWOjE2NTA0MTI4MDAsVzoxNjUyNzQ1NjAwLFg6MTY1NDY0NjQwMCxZOjE2NTcxNTIwMDAsWjoxNjYwNzgwODAwLGE6MTY2MzExMzYwMCxiOjE2Njg4MTYwMDAsYzoxNjY4NjQzMjAwLGQ6MTY3MTA2MjQwMCxlOjE2NzUyMDk2MDAsZjoxNjc3MDI0MDAwLGc6MTY3OTUyOTYwMCxoOjE2ODE5NDg4MDAsaToxNjg0MTk1MjAwLGo6MTY4NzIxOTIwMCxrOjE2OTAzMjk2MDAsbDoxNjkyNzQ4ODAwLG06MTY5NjIwNDgwMCxuOjE2OTk5MjAwMDAsbzoxNjk5OTIwMDAwLHA6MTcwMjk0NDAwMCxxOjE3MDcyNjQwMDAscjoxNzEwMTE1MjAwLHM6MTcxMTQ5NzYwMCx0OjE3MTYzMzYwMDAsdToxNzE5MjczNjAwLHY6MTcyMTA4ODAwMCx3OjE3MjQyODQ4MDAseDoxNzI3MjIyNDAwfSxEOntHOlwib1wiLEI6XCJvXCIsQzpcIm9cIix3QzpcIm9cIix4QzpcIm9cIix5QzpcIm9cIix6QzpcIm9cIixBQzpcIm9cIixkQzpcIm9cIixcIjBDXCI6XCJvXCIsQkM6XCJvXCJ9fSxHOntBOntGOjAsTkM6MCxcIjFDXCI6MCxlQzowLjAwNDQ3NzA4LFwiMkNcIjowLjAwMTQ5MjM2LFwiM0NcIjowLjAwNzQ2MTgxLFwiNENcIjowLjAwODk1NDE3LFwiNUNcIjowLFwiNkNcIjowLjAwNzQ2MTgxLFwiN0NcIjowLjAyOTg0NzIsXCI4Q1wiOjAuMDA4OTU0MTcsXCI5Q1wiOjAuMDQ2MjYzMixBRDowLjExNzg5NyxCRDowLjAxNDkyMzYsQ0Q6MC4wMTE5Mzg5LEREOjAuMTk5OTc2LEVEOjAuMDAyOTg0NzIsRkQ6MC4wNjU2NjM5LEdEOjAuMDA4OTU0MTcsSEQ6MC4wMzczMDksSUQ6MC4xNTIyMjEsSkQ6MC4xMDU5NTgsS0Q6MC4wNTY3MDk3LFBDOjAuMDU2NzA5NyxRQzowLjA2NzE1NjMsQ0M6MC4wNzkwOTUyLExEOjAuNzQxNzA0LERDOjAuMTUwNzI5LFJDOjAuMzE3ODczLFNDOjAuMTU4MTksVEM6MC4yNjQxNDgsVUM6MC4wNjU2NjM5LFZDOjAuMTA3NDUsTUQ6MC45MjA3ODcsRUM6MC4wODUwNjQ2LFdDOjAuMTMxMzI4LFhDOjAuMTIwODgxLFlDOjAuMTc5MDgzLFpDOjAuNDE5MzU0LGFDOjguNTU4NjksYkM6MS40NDE2MixGQzowLjE1NjY5OCxjQzowfSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIk5DXCIsXCIxQ1wiLFwiZUNcIixcIjJDXCIsXCIzQ1wiLFwiNENcIixcIkZcIixcIjVDXCIsXCI2Q1wiLFwiN0NcIixcIjhDXCIsXCI5Q1wiLFwiQURcIixcIkJEXCIsXCJDRFwiLFwiRERcIixcIkVEXCIsXCJGRFwiLFwiR0RcIixcIkhEXCIsXCJJRFwiLFwiSkRcIixcIktEXCIsXCJQQ1wiLFwiUUNcIixcIkNDXCIsXCJMRFwiLFwiRENcIixcIlJDXCIsXCJTQ1wiLFwiVENcIixcIlVDXCIsXCJWQ1wiLFwiTURcIixcIkVDXCIsXCJXQ1wiLFwiWENcIixcIllDXCIsXCJaQ1wiLFwiYUNcIixcImJDXCIsXCJGQ1wiLFwiY0NcIixcIlwiLFwiXCJdLEU6XCJTYWZhcmkgb24gaU9TXCIsRjp7TkM6MTI3MDI1MjgwMCxcIjFDXCI6MTI4MzkwNDAwMCxlQzoxMjk5NjI4ODAwLFwiMkNcIjoxMzMxMDc4NDAwLFwiM0NcIjoxMzU5MzMxMjAwLFwiNENcIjoxMzk0NDA5NjAwLEY6MTQxMDkxMjAwMCxcIjVDXCI6MTQxMzc2MzIwMCxcIjZDXCI6MTQ0MjM2MTYwMCxcIjdDXCI6MTQ1ODUxODQwMCxcIjhDXCI6MTQ3MzcyNDgwMCxcIjlDXCI6MTQ5MDU3MjgwMCxBRDoxNTA1Nzc5MjAwLEJEOjE1MjIyODE2MDAsQ0Q6MTUzNzE0MjQwMCxERDoxNTUzNDcyMDAwLEVEOjE1Njg4NTEyMDAsRkQ6MTU3MjIyMDgwMCxHRDoxNTgwMTY5NjAwLEhEOjE1ODUwMDgwMDAsSUQ6MTYwMDIxNDQwMCxKRDoxNjE5Mzk1MjAwLEtEOjE2MzIwOTYwMDAsUEM6MTYzOTM1MzYwMCxRQzoxNjQ3MjE2MDAwLENDOjE2NTI2NTkyMDAsTEQ6MTY1ODI3NTIwMCxEQzoxNjYyOTQwODAwLFJDOjE2NjY1Njk2MDAsU0M6MTY3MDg4OTYwMCxUQzoxNjc0NDMyMDAwLFVDOjE2Nzk4NzUyMDAsVkM6MTY4NDM2ODAwMCxNRDoxNjkwMTU2ODAwLEVDOjE2OTQ5OTUyMDAsV0M6MTY5ODE5MjAwMCxYQzoxNzAyMjUyODAwLFlDOjE3MDU4ODE2MDAsWkM6MTcwOTU5NjgwMCxhQzoxNzE1NTU4NDAwLGJDOjE3MjIyMTEyMDAsRkM6MTcyNjQ0NDgwMCxjQzpudWxsfX0sSDp7QTp7TkQ6MC4wNX0sQjpcIm9cIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIk5EXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJPcGVyYSBNaW5pXCIsRjp7TkQ6MTQyNjQ2NDAwMH19LEk6e0E6e0dDOjAsSjowLjAwMDAzMjcyMTYsRDowLjMyNjE2OSxPRDowLFBEOjAsUUQ6MCxSRDowLjAwMDEzMDg4NixlQzowLjAwMDEzMDg4NixTRDowLFREOjAuMDAwNTIzNTQ2fSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJPRFwiLFwiUERcIixcIlFEXCIsXCJHQ1wiLFwiSlwiLFwiUkRcIixcImVDXCIsXCJTRFwiLFwiVERcIixcIkRcIixcIlwiLFwiXCIsXCJcIl0sRTpcIkFuZHJvaWQgQnJvd3NlclwiLEY6e09EOjEyNTY1MTUyMDAsUEQ6MTI3NDMxMzYwMCxRRDoxMjkxNTkzNjAwLEdDOjEyOTgzMzI4MDAsSjoxMzE4ODk2MDAwLFJEOjEzNDE3OTIwMDAsZUM6MTM3NDYyNDAwMCxTRDoxMzg2NTQ3MjAwLFREOjE0MDE2NjcyMDAsRDoxNzI4ODY0MDAwfX0sSjp7QTp7RTowLEE6MH0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIkVcIixcIkFcIixcIlwiLFwiXCIsXCJcIl0sRTpcIkJsYWNrYmVycnkgQnJvd3NlclwiLEY6e0U6MTMyNTM3NjAwMCxBOjEzNTk1MDQwMDB9fSxLOntBOntBOjAsQjowLEM6MCxJOjEuMjQ2MDMsQUM6MCxkQzowLEJDOjB9LEI6XCJvXCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJBXCIsXCJCXCIsXCJBQ1wiLFwiZENcIixcIkNcIixcIkJDXCIsXCJJXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJPcGVyYSBNb2JpbGVcIixGOntBOjEyODcxMDA4MDAsQjoxMzAwNzUyMDAwLEFDOjEzMTQ4MzUyMDAsZEM6MTMxODI5MTIwMCxDOjEzMzAzMDA4MDAsQkM6MTM0OTc0MDgwMCxJOjE3MDk3Njk2MDB9LEQ6e0k6XCJ3ZWJraXRcIn19LEw6e0E6e0Q6NDQuMzMxfSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJDaHJvbWUgZm9yIEFuZHJvaWRcIixGOntEOjE3Mjg4NjQwMDB9fSxNOntBOntEOjAuMzY1NzEyfSxCOlwibW96XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJGaXJlZm94IGZvciBBbmRyb2lkXCIsRjp7RDoxNzI1MzIxNjAwfX0sTjp7QTp7QTowLEI6MH0sQjpcIm1zXCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiQVwiLFwiQlwiLFwiXCIsXCJcIixcIlwiXSxFOlwiSUUgTW9iaWxlXCIsRjp7QToxMzQwMTUwNDAwLEI6MTM1MzQ1NjAwMH19LE86e0E6e0NDOjEuMTM1NjN9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIkNDXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJVQyBCcm93c2VyIGZvciBBbmRyb2lkXCIsRjp7Q0M6MTcxMDExNTIwMH0sRDp7Q0M6XCJ3ZWJraXRcIn19LFA6e0E6e1wiMFwiOjAuMDY0NzM2MSxcIjFcIjowLjA2NDczNjEsXCIyXCI6MC4wNzU1MjU1LFwiM1wiOjEuMjczMTQsSjowLjA5NzEwNDIseTowLjAyMTU3ODcsejowLjA0MzE1NzQsVUQ6MC4wMTA3ODk0LFZEOjAuMDEwNzg5NCxXRDowLjAzMjM2ODEsWEQ6MCxZRDowLE9DOjAsWkQ6MC4wMTA3ODk0LGFEOjAsYkQ6MC4wMTA3ODk0LGNEOjAsZEQ6MCxEQzowLEVDOjAuMDIxNTc4NyxGQzowLGVEOjAuMDIxNTc4N30sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiSlwiLFwiVURcIixcIlZEXCIsXCJXRFwiLFwiWERcIixcIllEXCIsXCJPQ1wiLFwiWkRcIixcImFEXCIsXCJiRFwiLFwiY0RcIixcImREXCIsXCJEQ1wiLFwiRUNcIixcIkZDXCIsXCJlRFwiLFwieVwiLFwielwiLFwiMFwiLFwiMVwiLFwiMlwiLFwiM1wiLFwiXCIsXCJcIixcIlwiXSxFOlwiU2Ftc3VuZyBJbnRlcm5ldFwiLEY6e1wiMFwiOjE2ODkyOTI4MDAsXCIxXCI6MTY5NzU4NzIwMCxcIjJcIjoxNzExNDk3NjAwLFwiM1wiOjE3MTUxMjY0MDAsSjoxNDYxMDI0MDAwLFVEOjE0ODE4NDY0MDAsVkQ6MTUwOTQwODAwMCxXRDoxNTI4MzI5NjAwLFhEOjE1NDYxMjgwMDAsWUQ6MTU1NDE2MzIwMCxPQzoxNTY3OTAwODAwLFpEOjE1ODI1ODg4MDAsYUQ6MTU5MzQ3NTIwMCxiRDoxNjA1NjU3NjAwLGNEOjE2MTg1MzEyMDAsZEQ6MTYyOTA3MjAwMCxEQzoxNjQwNzM2MDAwLEVDOjE2NTE3MDg4MDAsRkM6MTY1OTY1NzYwMCxlRDoxNjY3MjYwODAwLHk6MTY3NzM2OTYwMCx6OjE2ODQ0NTQ0MDB9fSxROntBOntmRDowLjMyMDh9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcImZEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJRUSBCcm93c2VyXCIsRjp7ZkQ6MTcxMDI4ODAwMH19LFI6e0E6e2dEOjB9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcImdEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJCYWlkdSBCcm93c2VyXCIsRjp7Z0Q6MTcxMDIwMTYwMH19LFM6e0E6e2hEOjAuMDUxMzI4LGlEOjB9LEI6XCJtb3pcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJoRFwiLFwiaURcIixcIlwiLFwiXCIsXCJcIl0sRTpcIkthaU9TIEJyb3dzZXJcIixGOntoRDoxNTI3ODExMjAwLGlEOjE2MzE2NjQwMDB9fX07XG4iLCJtb2R1bGUuZXhwb3J0cz17XCIwXCI6XCIyMlwiLFwiMVwiOlwiMjNcIixcIjJcIjpcIjI0XCIsXCIzXCI6XCIyNVwiLFwiNFwiOlwiMTE1XCIsXCI1XCI6XCIxMTZcIixcIjZcIjpcIjExN1wiLFwiN1wiOlwiMTE4XCIsXCI4XCI6XCIxMTlcIixcIjlcIjpcIjEyMFwiLEE6XCIxMFwiLEI6XCIxMVwiLEM6XCIxMlwiLEQ6XCIxMzBcIixFOlwiN1wiLEY6XCI4XCIsRzpcIjlcIixIOlwiMTVcIixJOlwiODBcIixKOlwiNFwiLEs6XCI2XCIsTDpcIjEzXCIsTTpcIjE0XCIsTjpcIjE2XCIsTzpcIjE3XCIsUDpcIjE4XCIsUTpcIjc5XCIsUjpcIjgxXCIsUzpcIjgzXCIsVDpcIjg0XCIsVTpcIjg1XCIsVjpcIjg2XCIsVzpcIjg3XCIsWDpcIjg4XCIsWTpcIjg5XCIsWjpcIjkwXCIsYTpcIjkxXCIsYjpcIjkyXCIsYzpcIjkzXCIsZDpcIjk0XCIsZTpcIjk1XCIsZjpcIjk2XCIsZzpcIjk3XCIsaDpcIjk4XCIsaTpcIjk5XCIsajpcIjEwMFwiLGs6XCIxMDFcIixsOlwiMTAyXCIsbTpcIjEwM1wiLG46XCIxMDRcIixvOlwiMTA1XCIscDpcIjEwNlwiLHE6XCIxMDdcIixyOlwiMTA4XCIsczpcIjEwOVwiLHQ6XCIxMTBcIix1OlwiMTExXCIsdjpcIjExMlwiLHc6XCIxMTNcIix4OlwiMTE0XCIseTpcIjIwXCIsejpcIjIxXCIsQUI6XCIxMjFcIixCQjpcIjEyMlwiLENCOlwiMTIzXCIsREI6XCIxMjRcIixFQjpcIjEyNVwiLEZCOlwiMTI2XCIsR0I6XCIxMjdcIixIQjpcIjEyOFwiLElCOlwiMTI5XCIsSkI6XCI1XCIsS0I6XCIxOVwiLExCOlwiMjZcIixNQjpcIjI3XCIsTkI6XCIyOFwiLE9COlwiMjlcIixQQjpcIjMwXCIsUUI6XCIzMVwiLFJCOlwiMzJcIixTQjpcIjMzXCIsVEI6XCIzNFwiLFVCOlwiMzVcIixWQjpcIjM2XCIsV0I6XCIzN1wiLFhCOlwiMzhcIixZQjpcIjM5XCIsWkI6XCI0MFwiLGFCOlwiNDFcIixiQjpcIjQyXCIsY0I6XCI0M1wiLGRCOlwiNDRcIixlQjpcIjQ1XCIsZkI6XCI0NlwiLGdCOlwiNDdcIixoQjpcIjQ4XCIsaUI6XCI0OVwiLGpCOlwiNTBcIixrQjpcIjUxXCIsbEI6XCI1MlwiLG1COlwiNTNcIixuQjpcIjU0XCIsb0I6XCI1NVwiLHBCOlwiNTZcIixxQjpcIjU3XCIsckI6XCI1OFwiLHNCOlwiNjBcIix0QjpcIjYyXCIsdUI6XCI2M1wiLHZCOlwiNjRcIix3QjpcIjY1XCIseEI6XCI2NlwiLHlCOlwiNjdcIix6QjpcIjY4XCIsXCIwQlwiOlwiNjlcIixcIjFCXCI6XCI3MFwiLFwiMkJcIjpcIjcxXCIsXCIzQlwiOlwiNzJcIixcIjRCXCI6XCI3M1wiLFwiNUJcIjpcIjc0XCIsXCI2QlwiOlwiNzVcIixcIjdCXCI6XCI3NlwiLFwiOEJcIjpcIjc3XCIsXCI5QlwiOlwiNzhcIixBQzpcIjExLjFcIixCQzpcIjEyLjFcIixDQzpcIjE1LjVcIixEQzpcIjE2LjBcIixFQzpcIjE3LjBcIixGQzpcIjE4LjBcIixHQzpcIjNcIixIQzpcIjU5XCIsSUM6XCI2MVwiLEpDOlwiODJcIixLQzpcIjEzMVwiLExDOlwiMTMyXCIsTUM6XCIxMzNcIixOQzpcIjMuMlwiLE9DOlwiMTAuMVwiLFBDOlwiMTUuMi0xNS4zXCIsUUM6XCIxNS40XCIsUkM6XCIxNi4xXCIsU0M6XCIxNi4yXCIsVEM6XCIxNi4zXCIsVUM6XCIxNi40XCIsVkM6XCIxNi41XCIsV0M6XCIxNy4xXCIsWEM6XCIxNy4yXCIsWUM6XCIxNy4zXCIsWkM6XCIxNy40XCIsYUM6XCIxNy41XCIsYkM6XCIxNy42XCIsY0M6XCIxOC4xXCIsZEM6XCIxMS41XCIsZUM6XCI0LjItNC4zXCIsZkM6XCI1LjVcIixnQzpcIjJcIixoQzpcIjEzNFwiLGlDOlwiMTM1XCIsakM6XCIzLjVcIixrQzpcIjMuNlwiLGxDOlwiMy4xXCIsbUM6XCI1LjFcIixuQzpcIjYuMVwiLG9DOlwiNy4xXCIscEM6XCI5LjFcIixxQzpcIjEzLjFcIixyQzpcIjE0LjFcIixzQzpcIjE1LjFcIix0QzpcIjE1LjZcIix1QzpcIjE2LjZcIix2QzpcIlRQXCIsd0M6XCI5LjUtOS42XCIseEM6XCIxMC4wLTEwLjFcIix5QzpcIjEwLjVcIix6QzpcIjEwLjZcIixcIjBDXCI6XCIxMS42XCIsXCIxQ1wiOlwiNC4wLTQuMVwiLFwiMkNcIjpcIjUuMC01LjFcIixcIjNDXCI6XCI2LjAtNi4xXCIsXCI0Q1wiOlwiNy4wLTcuMVwiLFwiNUNcIjpcIjguMS04LjRcIixcIjZDXCI6XCI5LjAtOS4yXCIsXCI3Q1wiOlwiOS4zXCIsXCI4Q1wiOlwiMTAuMC0xMC4yXCIsXCI5Q1wiOlwiMTAuM1wiLEFEOlwiMTEuMC0xMS4yXCIsQkQ6XCIxMS4zLTExLjRcIixDRDpcIjEyLjAtMTIuMVwiLEREOlwiMTIuMi0xMi41XCIsRUQ6XCIxMy4wLTEzLjFcIixGRDpcIjEzLjJcIixHRDpcIjEzLjNcIixIRDpcIjEzLjQtMTMuN1wiLElEOlwiMTQuMC0xNC40XCIsSkQ6XCIxNC41LTE0LjhcIixLRDpcIjE1LjAtMTUuMVwiLExEOlwiMTUuNi0xNS44XCIsTUQ6XCIxNi42LTE2LjdcIixORDpcImFsbFwiLE9EOlwiMi4xXCIsUEQ6XCIyLjJcIixRRDpcIjIuM1wiLFJEOlwiNC4xXCIsU0Q6XCI0LjRcIixURDpcIjQuNC4zLTQuNC40XCIsVUQ6XCI1LjAtNS40XCIsVkQ6XCI2LjItNi40XCIsV0Q6XCI3LjItNy40XCIsWEQ6XCI4LjJcIixZRDpcIjkuMlwiLFpEOlwiMTEuMS0xMS4yXCIsYUQ6XCIxMi4wXCIsYkQ6XCIxMy4wXCIsY0Q6XCIxNC4wXCIsZEQ6XCIxNS4wXCIsZUQ6XCIxOS4wXCIsZkQ6XCIxNC45XCIsZ0Q6XCIxMy41MlwiLGhEOlwiMi41XCIsaUQ6XCIzLjAtMy4xXCJ9O1xuIiwibW9kdWxlLmV4cG9ydHM9e0E6XCJpZVwiLEI6XCJlZGdlXCIsQzpcImZpcmVmb3hcIixEOlwiY2hyb21lXCIsRTpcInNhZmFyaVwiLEY6XCJvcGVyYVwiLEc6XCJpb3Nfc2FmXCIsSDpcIm9wX21pbmlcIixJOlwiYW5kcm9pZFwiLEo6XCJiYlwiLEs6XCJvcF9tb2JcIixMOlwiYW5kX2NoclwiLE06XCJhbmRfZmZcIixOOlwiaWVfbW9iXCIsTzpcImFuZF91Y1wiLFA6XCJzYW1zdW5nXCIsUTpcImFuZF9xcVwiLFI6XCJiYWlkdVwiLFM6XCJrYWlvc1wifTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBicm93c2VycyA9IHJlcXVpcmUoJy4vYnJvd3NlcnMnKS5icm93c2Vyc1xuY29uc3QgdmVyc2lvbnMgPSByZXF1aXJlKCcuL2Jyb3dzZXJWZXJzaW9ucycpLmJyb3dzZXJWZXJzaW9uc1xuY29uc3QgYWdlbnRzRGF0YSA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvYWdlbnRzJylcblxuZnVuY3Rpb24gdW5wYWNrQnJvd3NlclZlcnNpb25zKHZlcnNpb25zRGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmtleXModmVyc2lvbnNEYXRhKS5yZWR1Y2UoKHVzYWdlLCB2ZXJzaW9uKSA9PiB7XG4gICAgdXNhZ2VbdmVyc2lvbnNbdmVyc2lvbl1dID0gdmVyc2lvbnNEYXRhW3ZlcnNpb25dXG4gICAgcmV0dXJuIHVzYWdlXG4gIH0sIHt9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5hZ2VudHMgPSBPYmplY3Qua2V5cyhhZ2VudHNEYXRhKS5yZWR1Y2UoKG1hcCwga2V5KSA9PiB7XG4gIGxldCB2ZXJzaW9uc0RhdGEgPSBhZ2VudHNEYXRhW2tleV1cbiAgbWFwW2Jyb3dzZXJzW2tleV1dID0gT2JqZWN0LmtleXModmVyc2lvbnNEYXRhKS5yZWR1Y2UoKGRhdGEsIGVudHJ5KSA9PiB7XG4gICAgaWYgKGVudHJ5ID09PSAnQScpIHtcbiAgICAgIGRhdGEudXNhZ2VfZ2xvYmFsID0gdW5wYWNrQnJvd3NlclZlcnNpb25zKHZlcnNpb25zRGF0YVtlbnRyeV0pXG4gICAgfSBlbHNlIGlmIChlbnRyeSA9PT0gJ0MnKSB7XG4gICAgICBkYXRhLnZlcnNpb25zID0gdmVyc2lvbnNEYXRhW2VudHJ5XS5yZWR1Y2UoKGxpc3QsIHZlcnNpb24pID0+IHtcbiAgICAgICAgaWYgKHZlcnNpb24gPT09ICcnKSB7XG4gICAgICAgICAgbGlzdC5wdXNoKG51bGwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGlzdC5wdXNoKHZlcnNpb25zW3ZlcnNpb25dKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgICB9LCBbXSlcbiAgICB9IGVsc2UgaWYgKGVudHJ5ID09PSAnRCcpIHtcbiAgICAgIGRhdGEucHJlZml4X2V4Y2VwdGlvbnMgPSB1bnBhY2tCcm93c2VyVmVyc2lvbnModmVyc2lvbnNEYXRhW2VudHJ5XSlcbiAgICB9IGVsc2UgaWYgKGVudHJ5ID09PSAnRScpIHtcbiAgICAgIGRhdGEuYnJvd3NlciA9IHZlcnNpb25zRGF0YVtlbnRyeV1cbiAgICB9IGVsc2UgaWYgKGVudHJ5ID09PSAnRicpIHtcbiAgICAgIGRhdGEucmVsZWFzZV9kYXRlID0gT2JqZWN0LmtleXModmVyc2lvbnNEYXRhW2VudHJ5XSkucmVkdWNlKFxuICAgICAgICAobWFwMiwga2V5MikgPT4ge1xuICAgICAgICAgIG1hcDJbdmVyc2lvbnNba2V5Ml1dID0gdmVyc2lvbnNEYXRhW2VudHJ5XVtrZXkyXVxuICAgICAgICAgIHJldHVybiBtYXAyXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVudHJ5IGlzIEJcbiAgICAgIGRhdGEucHJlZml4ID0gdmVyc2lvbnNEYXRhW2VudHJ5XVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9LCB7fSlcbiAgcmV0dXJuIG1hcFxufSwge30pXG4iLCJtb2R1bGUuZXhwb3J0cy5icm93c2VyVmVyc2lvbnMgPSByZXF1aXJlKCcuLi8uLi9kYXRhL2Jyb3dzZXJWZXJzaW9ucycpXG4iLCJtb2R1bGUuZXhwb3J0cy5icm93c2VycyA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvYnJvd3NlcnMnKVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiMC4yMFwiOiBcIjM5XCIsXG5cdFwiMC4yMVwiOiBcIjQxXCIsXG5cdFwiMC4yMlwiOiBcIjQxXCIsXG5cdFwiMC4yM1wiOiBcIjQxXCIsXG5cdFwiMC4yNFwiOiBcIjQxXCIsXG5cdFwiMC4yNVwiOiBcIjQyXCIsXG5cdFwiMC4yNlwiOiBcIjQyXCIsXG5cdFwiMC4yN1wiOiBcIjQzXCIsXG5cdFwiMC4yOFwiOiBcIjQzXCIsXG5cdFwiMC4yOVwiOiBcIjQzXCIsXG5cdFwiMC4zMFwiOiBcIjQ0XCIsXG5cdFwiMC4zMVwiOiBcIjQ1XCIsXG5cdFwiMC4zMlwiOiBcIjQ1XCIsXG5cdFwiMC4zM1wiOiBcIjQ1XCIsXG5cdFwiMC4zNFwiOiBcIjQ1XCIsXG5cdFwiMC4zNVwiOiBcIjQ1XCIsXG5cdFwiMC4zNlwiOiBcIjQ3XCIsXG5cdFwiMC4zN1wiOiBcIjQ5XCIsXG5cdFwiMS4wXCI6IFwiNDlcIixcblx0XCIxLjFcIjogXCI1MFwiLFxuXHRcIjEuMlwiOiBcIjUxXCIsXG5cdFwiMS4zXCI6IFwiNTJcIixcblx0XCIxLjRcIjogXCI1M1wiLFxuXHRcIjEuNVwiOiBcIjU0XCIsXG5cdFwiMS42XCI6IFwiNTZcIixcblx0XCIxLjdcIjogXCI1OFwiLFxuXHRcIjEuOFwiOiBcIjU5XCIsXG5cdFwiMi4wXCI6IFwiNjFcIixcblx0XCIyLjFcIjogXCI2MVwiLFxuXHRcIjMuMFwiOiBcIjY2XCIsXG5cdFwiMy4xXCI6IFwiNjZcIixcblx0XCI0LjBcIjogXCI2OVwiLFxuXHRcIjQuMVwiOiBcIjY5XCIsXG5cdFwiNC4yXCI6IFwiNjlcIixcblx0XCI1LjBcIjogXCI3M1wiLFxuXHRcIjYuMFwiOiBcIjc2XCIsXG5cdFwiNi4xXCI6IFwiNzZcIixcblx0XCI3LjBcIjogXCI3OFwiLFxuXHRcIjcuMVwiOiBcIjc4XCIsXG5cdFwiNy4yXCI6IFwiNzhcIixcblx0XCI3LjNcIjogXCI3OFwiLFxuXHRcIjguMFwiOiBcIjgwXCIsXG5cdFwiOC4xXCI6IFwiODBcIixcblx0XCI4LjJcIjogXCI4MFwiLFxuXHRcIjguM1wiOiBcIjgwXCIsXG5cdFwiOC40XCI6IFwiODBcIixcblx0XCI4LjVcIjogXCI4MFwiLFxuXHRcIjkuMFwiOiBcIjgzXCIsXG5cdFwiOS4xXCI6IFwiODNcIixcblx0XCI5LjJcIjogXCI4M1wiLFxuXHRcIjkuM1wiOiBcIjgzXCIsXG5cdFwiOS40XCI6IFwiODNcIixcblx0XCIxMC4wXCI6IFwiODVcIixcblx0XCIxMC4xXCI6IFwiODVcIixcblx0XCIxMC4yXCI6IFwiODVcIixcblx0XCIxMC4zXCI6IFwiODVcIixcblx0XCIxMC40XCI6IFwiODVcIixcblx0XCIxMS4wXCI6IFwiODdcIixcblx0XCIxMS4xXCI6IFwiODdcIixcblx0XCIxMS4yXCI6IFwiODdcIixcblx0XCIxMS4zXCI6IFwiODdcIixcblx0XCIxMS40XCI6IFwiODdcIixcblx0XCIxMS41XCI6IFwiODdcIixcblx0XCIxMi4wXCI6IFwiODlcIixcblx0XCIxMi4xXCI6IFwiODlcIixcblx0XCIxMi4yXCI6IFwiODlcIixcblx0XCIxMy4wXCI6IFwiOTFcIixcblx0XCIxMy4xXCI6IFwiOTFcIixcblx0XCIxMy4yXCI6IFwiOTFcIixcblx0XCIxMy4zXCI6IFwiOTFcIixcblx0XCIxMy40XCI6IFwiOTFcIixcblx0XCIxMy41XCI6IFwiOTFcIixcblx0XCIxMy42XCI6IFwiOTFcIixcblx0XCIxNC4wXCI6IFwiOTNcIixcblx0XCIxNC4xXCI6IFwiOTNcIixcblx0XCIxNC4yXCI6IFwiOTNcIixcblx0XCIxNS4wXCI6IFwiOTRcIixcblx0XCIxNS4xXCI6IFwiOTRcIixcblx0XCIxNS4yXCI6IFwiOTRcIixcblx0XCIxNS4zXCI6IFwiOTRcIixcblx0XCIxNS40XCI6IFwiOTRcIixcblx0XCIxNS41XCI6IFwiOTRcIixcblx0XCIxNi4wXCI6IFwiOTZcIixcblx0XCIxNi4xXCI6IFwiOTZcIixcblx0XCIxNi4yXCI6IFwiOTZcIixcblx0XCIxNy4wXCI6IFwiOThcIixcblx0XCIxNy4xXCI6IFwiOThcIixcblx0XCIxNy4yXCI6IFwiOThcIixcblx0XCIxNy4zXCI6IFwiOThcIixcblx0XCIxNy40XCI6IFwiOThcIixcblx0XCIxOC4wXCI6IFwiMTAwXCIsXG5cdFwiMTguMVwiOiBcIjEwMFwiLFxuXHRcIjE4LjJcIjogXCIxMDBcIixcblx0XCIxOC4zXCI6IFwiMTAwXCIsXG5cdFwiMTkuMFwiOiBcIjEwMlwiLFxuXHRcIjE5LjFcIjogXCIxMDJcIixcblx0XCIyMC4wXCI6IFwiMTA0XCIsXG5cdFwiMjAuMVwiOiBcIjEwNFwiLFxuXHRcIjIwLjJcIjogXCIxMDRcIixcblx0XCIyMC4zXCI6IFwiMTA0XCIsXG5cdFwiMjEuMFwiOiBcIjEwNlwiLFxuXHRcIjIxLjFcIjogXCIxMDZcIixcblx0XCIyMS4yXCI6IFwiMTA2XCIsXG5cdFwiMjEuM1wiOiBcIjEwNlwiLFxuXHRcIjIxLjRcIjogXCIxMDZcIixcblx0XCIyMi4wXCI6IFwiMTA4XCIsXG5cdFwiMjIuMVwiOiBcIjEwOFwiLFxuXHRcIjIyLjJcIjogXCIxMDhcIixcblx0XCIyMi4zXCI6IFwiMTA4XCIsXG5cdFwiMjMuMFwiOiBcIjExMFwiLFxuXHRcIjIzLjFcIjogXCIxMTBcIixcblx0XCIyMy4yXCI6IFwiMTEwXCIsXG5cdFwiMjMuM1wiOiBcIjExMFwiLFxuXHRcIjI0LjBcIjogXCIxMTJcIixcblx0XCIyNC4xXCI6IFwiMTEyXCIsXG5cdFwiMjQuMlwiOiBcIjExMlwiLFxuXHRcIjI0LjNcIjogXCIxMTJcIixcblx0XCIyNC40XCI6IFwiMTEyXCIsXG5cdFwiMjQuNVwiOiBcIjExMlwiLFxuXHRcIjI0LjZcIjogXCIxMTJcIixcblx0XCIyNC43XCI6IFwiMTEyXCIsXG5cdFwiMjQuOFwiOiBcIjExMlwiLFxuXHRcIjI1LjBcIjogXCIxMTRcIixcblx0XCIyNS4xXCI6IFwiMTE0XCIsXG5cdFwiMjUuMlwiOiBcIjExNFwiLFxuXHRcIjI1LjNcIjogXCIxMTRcIixcblx0XCIyNS40XCI6IFwiMTE0XCIsXG5cdFwiMjUuNVwiOiBcIjExNFwiLFxuXHRcIjI1LjZcIjogXCIxMTRcIixcblx0XCIyNS43XCI6IFwiMTE0XCIsXG5cdFwiMjUuOFwiOiBcIjExNFwiLFxuXHRcIjI1LjlcIjogXCIxMTRcIixcblx0XCIyNi4wXCI6IFwiMTE2XCIsXG5cdFwiMjYuMVwiOiBcIjExNlwiLFxuXHRcIjI2LjJcIjogXCIxMTZcIixcblx0XCIyNi4zXCI6IFwiMTE2XCIsXG5cdFwiMjYuNFwiOiBcIjExNlwiLFxuXHRcIjI2LjVcIjogXCIxMTZcIixcblx0XCIyNi42XCI6IFwiMTE2XCIsXG5cdFwiMjcuMFwiOiBcIjExOFwiLFxuXHRcIjI3LjFcIjogXCIxMThcIixcblx0XCIyNy4yXCI6IFwiMTE4XCIsXG5cdFwiMjcuM1wiOiBcIjExOFwiLFxuXHRcIjI4LjBcIjogXCIxMjBcIixcblx0XCIyOC4xXCI6IFwiMTIwXCIsXG5cdFwiMjguMlwiOiBcIjEyMFwiLFxuXHRcIjI4LjNcIjogXCIxMjBcIixcblx0XCIyOS4wXCI6IFwiMTIyXCIsXG5cdFwiMjkuMVwiOiBcIjEyMlwiLFxuXHRcIjI5LjJcIjogXCIxMjJcIixcblx0XCIyOS4zXCI6IFwiMTIyXCIsXG5cdFwiMjkuNFwiOiBcIjEyMlwiLFxuXHRcIjMwLjBcIjogXCIxMjRcIixcblx0XCIzMC4xXCI6IFwiMTI0XCIsXG5cdFwiMzAuMlwiOiBcIjEyNFwiLFxuXHRcIjMwLjNcIjogXCIxMjRcIixcblx0XCIzMC40XCI6IFwiMTI0XCIsXG5cdFwiMzAuNVwiOiBcIjEyNFwiLFxuXHRcIjMxLjBcIjogXCIxMjZcIixcblx0XCIzMS4xXCI6IFwiMTI2XCIsXG5cdFwiMzEuMlwiOiBcIjEyNlwiLFxuXHRcIjMxLjNcIjogXCIxMjZcIixcblx0XCIzMS40XCI6IFwiMTI2XCIsXG5cdFwiMzEuNVwiOiBcIjEyNlwiLFxuXHRcIjMxLjZcIjogXCIxMjZcIixcblx0XCIzMS43XCI6IFwiMTI2XCIsXG5cdFwiMzIuMFwiOiBcIjEyOFwiLFxuXHRcIjMyLjFcIjogXCIxMjhcIixcblx0XCIzMi4yXCI6IFwiMTI4XCIsXG5cdFwiMzMuMFwiOiBcIjEzMFwiLFxuXHRcIjM0LjBcIjogXCIxMzJcIlxufTsiLCIndXNlIHN0cmljdCdcblxuLy8gQSBsaW5rZWQgbGlzdCB0byBrZWVwIHRyYWNrIG9mIHJlY2VudGx5LXVzZWQtbmVzc1xuY29uc3QgWWFsbGlzdCA9IHJlcXVpcmUoJ3lhbGxpc3QnKVxuXG5jb25zdCBNQVggPSBTeW1ib2woJ21heCcpXG5jb25zdCBMRU5HVEggPSBTeW1ib2woJ2xlbmd0aCcpXG5jb25zdCBMRU5HVEhfQ0FMQ1VMQVRPUiA9IFN5bWJvbCgnbGVuZ3RoQ2FsY3VsYXRvcicpXG5jb25zdCBBTExPV19TVEFMRSA9IFN5bWJvbCgnYWxsb3dTdGFsZScpXG5jb25zdCBNQVhfQUdFID0gU3ltYm9sKCdtYXhBZ2UnKVxuY29uc3QgRElTUE9TRSA9IFN5bWJvbCgnZGlzcG9zZScpXG5jb25zdCBOT19ESVNQT1NFX09OX1NFVCA9IFN5bWJvbCgnbm9EaXNwb3NlT25TZXQnKVxuY29uc3QgTFJVX0xJU1QgPSBTeW1ib2woJ2xydUxpc3QnKVxuY29uc3QgQ0FDSEUgPSBTeW1ib2woJ2NhY2hlJylcbmNvbnN0IFVQREFURV9BR0VfT05fR0VUID0gU3ltYm9sKCd1cGRhdGVBZ2VPbkdldCcpXG5cbmNvbnN0IG5haXZlTGVuZ3RoID0gKCkgPT4gMVxuXG4vLyBscnVMaXN0IGlzIGEgeWFsbGlzdCB3aGVyZSB0aGUgaGVhZCBpcyB0aGUgeW91bmdlc3Rcbi8vIGl0ZW0sIGFuZCB0aGUgdGFpbCBpcyB0aGUgb2xkZXN0LiAgdGhlIGxpc3QgY29udGFpbnMgdGhlIEhpdFxuLy8gb2JqZWN0cyBhcyB0aGUgZW50cmllcy5cbi8vIEVhY2ggSGl0IG9iamVjdCBoYXMgYSByZWZlcmVuY2UgdG8gaXRzIFlhbGxpc3QuTm9kZS4gIFRoaXNcbi8vIG5ldmVyIGNoYW5nZXMuXG4vL1xuLy8gY2FjaGUgaXMgYSBNYXAgKG9yIFBzZXVkb01hcCkgdGhhdCBtYXRjaGVzIHRoZSBrZXlzIHRvXG4vLyB0aGUgWWFsbGlzdC5Ob2RlIG9iamVjdC5cbmNsYXNzIExSVUNhY2hlIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdudW1iZXInKVxuICAgICAgb3B0aW9ucyA9IHsgbWF4OiBvcHRpb25zIH1cblxuICAgIGlmICghb3B0aW9ucylcbiAgICAgIG9wdGlvbnMgPSB7fVxuXG4gICAgaWYgKG9wdGlvbnMubWF4ICYmICh0eXBlb2Ygb3B0aW9ucy5tYXggIT09ICdudW1iZXInIHx8IG9wdGlvbnMubWF4IDwgMCkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtYXggbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXInKVxuICAgIC8vIEtpbmQgb2Ygd2VpcmQgdG8gaGF2ZSBhIGRlZmF1bHQgbWF4IG9mIEluZmluaXR5LCBidXQgb2ggd2VsbC5cbiAgICBjb25zdCBtYXggPSB0aGlzW01BWF0gPSBvcHRpb25zLm1heCB8fCBJbmZpbml0eVxuXG4gICAgY29uc3QgbGMgPSBvcHRpb25zLmxlbmd0aCB8fCBuYWl2ZUxlbmd0aFxuICAgIHRoaXNbTEVOR1RIX0NBTENVTEFUT1JdID0gKHR5cGVvZiBsYyAhPT0gJ2Z1bmN0aW9uJykgPyBuYWl2ZUxlbmd0aCA6IGxjXG4gICAgdGhpc1tBTExPV19TVEFMRV0gPSBvcHRpb25zLnN0YWxlIHx8IGZhbHNlXG4gICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHR5cGVvZiBvcHRpb25zLm1heEFnZSAhPT0gJ251bWJlcicpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtYXhBZ2UgbXVzdCBiZSBhIG51bWJlcicpXG4gICAgdGhpc1tNQVhfQUdFXSA9IG9wdGlvbnMubWF4QWdlIHx8IDBcbiAgICB0aGlzW0RJU1BPU0VdID0gb3B0aW9ucy5kaXNwb3NlXG4gICAgdGhpc1tOT19ESVNQT1NFX09OX1NFVF0gPSBvcHRpb25zLm5vRGlzcG9zZU9uU2V0IHx8IGZhbHNlXG4gICAgdGhpc1tVUERBVEVfQUdFX09OX0dFVF0gPSBvcHRpb25zLnVwZGF0ZUFnZU9uR2V0IHx8IGZhbHNlXG4gICAgdGhpcy5yZXNldCgpXG4gIH1cblxuICAvLyByZXNpemUgdGhlIGNhY2hlIHdoZW4gdGhlIG1heCBjaGFuZ2VzLlxuICBzZXQgbWF4IChtTCkge1xuICAgIGlmICh0eXBlb2YgbUwgIT09ICdudW1iZXInIHx8IG1MIDwgMClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ21heCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlcicpXG5cbiAgICB0aGlzW01BWF0gPSBtTCB8fCBJbmZpbml0eVxuICAgIHRyaW0odGhpcylcbiAgfVxuICBnZXQgbWF4ICgpIHtcbiAgICByZXR1cm4gdGhpc1tNQVhdXG4gIH1cblxuICBzZXQgYWxsb3dTdGFsZSAoYWxsb3dTdGFsZSkge1xuICAgIHRoaXNbQUxMT1dfU1RBTEVdID0gISFhbGxvd1N0YWxlXG4gIH1cbiAgZ2V0IGFsbG93U3RhbGUgKCkge1xuICAgIHJldHVybiB0aGlzW0FMTE9XX1NUQUxFXVxuICB9XG5cbiAgc2V0IG1heEFnZSAobUEpIHtcbiAgICBpZiAodHlwZW9mIG1BICE9PSAnbnVtYmVyJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ21heEFnZSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlcicpXG5cbiAgICB0aGlzW01BWF9BR0VdID0gbUFcbiAgICB0cmltKHRoaXMpXG4gIH1cbiAgZ2V0IG1heEFnZSAoKSB7XG4gICAgcmV0dXJuIHRoaXNbTUFYX0FHRV1cbiAgfVxuXG4gIC8vIHJlc2l6ZSB0aGUgY2FjaGUgd2hlbiB0aGUgbGVuZ3RoQ2FsY3VsYXRvciBjaGFuZ2VzLlxuICBzZXQgbGVuZ3RoQ2FsY3VsYXRvciAobEMpIHtcbiAgICBpZiAodHlwZW9mIGxDICE9PSAnZnVuY3Rpb24nKVxuICAgICAgbEMgPSBuYWl2ZUxlbmd0aFxuXG4gICAgaWYgKGxDICE9PSB0aGlzW0xFTkdUSF9DQUxDVUxBVE9SXSkge1xuICAgICAgdGhpc1tMRU5HVEhfQ0FMQ1VMQVRPUl0gPSBsQ1xuICAgICAgdGhpc1tMRU5HVEhdID0gMFxuICAgICAgdGhpc1tMUlVfTElTVF0uZm9yRWFjaChoaXQgPT4ge1xuICAgICAgICBoaXQubGVuZ3RoID0gdGhpc1tMRU5HVEhfQ0FMQ1VMQVRPUl0oaGl0LnZhbHVlLCBoaXQua2V5KVxuICAgICAgICB0aGlzW0xFTkdUSF0gKz0gaGl0Lmxlbmd0aFxuICAgICAgfSlcbiAgICB9XG4gICAgdHJpbSh0aGlzKVxuICB9XG4gIGdldCBsZW5ndGhDYWxjdWxhdG9yICgpIHsgcmV0dXJuIHRoaXNbTEVOR1RIX0NBTENVTEFUT1JdIH1cblxuICBnZXQgbGVuZ3RoICgpIHsgcmV0dXJuIHRoaXNbTEVOR1RIXSB9XG4gIGdldCBpdGVtQ291bnQgKCkgeyByZXR1cm4gdGhpc1tMUlVfTElTVF0ubGVuZ3RoIH1cblxuICByZm9yRWFjaCAoZm4sIHRoaXNwKSB7XG4gICAgdGhpc3AgPSB0aGlzcCB8fCB0aGlzXG4gICAgZm9yIChsZXQgd2Fsa2VyID0gdGhpc1tMUlVfTElTVF0udGFpbDsgd2Fsa2VyICE9PSBudWxsOykge1xuICAgICAgY29uc3QgcHJldiA9IHdhbGtlci5wcmV2XG4gICAgICBmb3JFYWNoU3RlcCh0aGlzLCBmbiwgd2Fsa2VyLCB0aGlzcClcbiAgICAgIHdhbGtlciA9IHByZXZcbiAgICB9XG4gIH1cblxuICBmb3JFYWNoIChmbiwgdGhpc3ApIHtcbiAgICB0aGlzcCA9IHRoaXNwIHx8IHRoaXNcbiAgICBmb3IgKGxldCB3YWxrZXIgPSB0aGlzW0xSVV9MSVNUXS5oZWFkOyB3YWxrZXIgIT09IG51bGw7KSB7XG4gICAgICBjb25zdCBuZXh0ID0gd2Fsa2VyLm5leHRcbiAgICAgIGZvckVhY2hTdGVwKHRoaXMsIGZuLCB3YWxrZXIsIHRoaXNwKVxuICAgICAgd2Fsa2VyID0gbmV4dFxuICAgIH1cbiAgfVxuXG4gIGtleXMgKCkge1xuICAgIHJldHVybiB0aGlzW0xSVV9MSVNUXS50b0FycmF5KCkubWFwKGsgPT4gay5rZXkpXG4gIH1cblxuICB2YWx1ZXMgKCkge1xuICAgIHJldHVybiB0aGlzW0xSVV9MSVNUXS50b0FycmF5KCkubWFwKGsgPT4gay52YWx1ZSlcbiAgfVxuXG4gIHJlc2V0ICgpIHtcbiAgICBpZiAodGhpc1tESVNQT1NFXSAmJlxuICAgICAgICB0aGlzW0xSVV9MSVNUXSAmJlxuICAgICAgICB0aGlzW0xSVV9MSVNUXS5sZW5ndGgpIHtcbiAgICAgIHRoaXNbTFJVX0xJU1RdLmZvckVhY2goaGl0ID0+IHRoaXNbRElTUE9TRV0oaGl0LmtleSwgaGl0LnZhbHVlKSlcbiAgICB9XG5cbiAgICB0aGlzW0NBQ0hFXSA9IG5ldyBNYXAoKSAvLyBoYXNoIG9mIGl0ZW1zIGJ5IGtleVxuICAgIHRoaXNbTFJVX0xJU1RdID0gbmV3IFlhbGxpc3QoKSAvLyBsaXN0IG9mIGl0ZW1zIGluIG9yZGVyIG9mIHVzZSByZWNlbmN5XG4gICAgdGhpc1tMRU5HVEhdID0gMCAvLyBsZW5ndGggb2YgaXRlbXMgaW4gdGhlIGxpc3RcbiAgfVxuXG4gIGR1bXAgKCkge1xuICAgIHJldHVybiB0aGlzW0xSVV9MSVNUXS5tYXAoaGl0ID0+XG4gICAgICBpc1N0YWxlKHRoaXMsIGhpdCkgPyBmYWxzZSA6IHtcbiAgICAgICAgazogaGl0LmtleSxcbiAgICAgICAgdjogaGl0LnZhbHVlLFxuICAgICAgICBlOiBoaXQubm93ICsgKGhpdC5tYXhBZ2UgfHwgMClcbiAgICAgIH0pLnRvQXJyYXkoKS5maWx0ZXIoaCA9PiBoKVxuICB9XG5cbiAgZHVtcExydSAoKSB7XG4gICAgcmV0dXJuIHRoaXNbTFJVX0xJU1RdXG4gIH1cblxuICBzZXQgKGtleSwgdmFsdWUsIG1heEFnZSkge1xuICAgIG1heEFnZSA9IG1heEFnZSB8fCB0aGlzW01BWF9BR0VdXG5cbiAgICBpZiAobWF4QWdlICYmIHR5cGVvZiBtYXhBZ2UgIT09ICdudW1iZXInKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbWF4QWdlIG11c3QgYmUgYSBudW1iZXInKVxuXG4gICAgY29uc3Qgbm93ID0gbWF4QWdlID8gRGF0ZS5ub3coKSA6IDBcbiAgICBjb25zdCBsZW4gPSB0aGlzW0xFTkdUSF9DQUxDVUxBVE9SXSh2YWx1ZSwga2V5KVxuXG4gICAgaWYgKHRoaXNbQ0FDSEVdLmhhcyhrZXkpKSB7XG4gICAgICBpZiAobGVuID4gdGhpc1tNQVhdKSB7XG4gICAgICAgIGRlbCh0aGlzLCB0aGlzW0NBQ0hFXS5nZXQoa2V5KSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzW0NBQ0hFXS5nZXQoa2V5KVxuICAgICAgY29uc3QgaXRlbSA9IG5vZGUudmFsdWVcblxuICAgICAgLy8gZGlzcG9zZSBvZiB0aGUgb2xkIG9uZSBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgICAgIC8vIHNwbGl0IG91dCBpbnRvIDIgaWZzIGZvciBiZXR0ZXIgY292ZXJhZ2UgdHJhY2tpbmdcbiAgICAgIGlmICh0aGlzW0RJU1BPU0VdKSB7XG4gICAgICAgIGlmICghdGhpc1tOT19ESVNQT1NFX09OX1NFVF0pXG4gICAgICAgICAgdGhpc1tESVNQT1NFXShrZXksIGl0ZW0udmFsdWUpXG4gICAgICB9XG5cbiAgICAgIGl0ZW0ubm93ID0gbm93XG4gICAgICBpdGVtLm1heEFnZSA9IG1heEFnZVxuICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlXG4gICAgICB0aGlzW0xFTkdUSF0gKz0gbGVuIC0gaXRlbS5sZW5ndGhcbiAgICAgIGl0ZW0ubGVuZ3RoID0gbGVuXG4gICAgICB0aGlzLmdldChrZXkpXG4gICAgICB0cmltKHRoaXMpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IGhpdCA9IG5ldyBFbnRyeShrZXksIHZhbHVlLCBsZW4sIG5vdywgbWF4QWdlKVxuXG4gICAgLy8gb3ZlcnNpemVkIG9iamVjdHMgZmFsbCBvdXQgb2YgY2FjaGUgYXV0b21hdGljYWxseS5cbiAgICBpZiAoaGl0Lmxlbmd0aCA+IHRoaXNbTUFYXSkge1xuICAgICAgaWYgKHRoaXNbRElTUE9TRV0pXG4gICAgICAgIHRoaXNbRElTUE9TRV0oa2V5LCB2YWx1ZSlcblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgdGhpc1tMRU5HVEhdICs9IGhpdC5sZW5ndGhcbiAgICB0aGlzW0xSVV9MSVNUXS51bnNoaWZ0KGhpdClcbiAgICB0aGlzW0NBQ0hFXS5zZXQoa2V5LCB0aGlzW0xSVV9MSVNUXS5oZWFkKVxuICAgIHRyaW0odGhpcylcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaGFzIChrZXkpIHtcbiAgICBpZiAoIXRoaXNbQ0FDSEVdLmhhcyhrZXkpKSByZXR1cm4gZmFsc2VcbiAgICBjb25zdCBoaXQgPSB0aGlzW0NBQ0hFXS5nZXQoa2V5KS52YWx1ZVxuICAgIHJldHVybiAhaXNTdGFsZSh0aGlzLCBoaXQpXG4gIH1cblxuICBnZXQgKGtleSkge1xuICAgIHJldHVybiBnZXQodGhpcywga2V5LCB0cnVlKVxuICB9XG5cbiAgcGVlayAoa2V5KSB7XG4gICAgcmV0dXJuIGdldCh0aGlzLCBrZXksIGZhbHNlKVxuICB9XG5cbiAgcG9wICgpIHtcbiAgICBjb25zdCBub2RlID0gdGhpc1tMUlVfTElTVF0udGFpbFxuICAgIGlmICghbm9kZSlcbiAgICAgIHJldHVybiBudWxsXG5cbiAgICBkZWwodGhpcywgbm9kZSlcbiAgICByZXR1cm4gbm9kZS52YWx1ZVxuICB9XG5cbiAgZGVsIChrZXkpIHtcbiAgICBkZWwodGhpcywgdGhpc1tDQUNIRV0uZ2V0KGtleSkpXG4gIH1cblxuICBsb2FkIChhcnIpIHtcbiAgICAvLyByZXNldCB0aGUgY2FjaGVcbiAgICB0aGlzLnJlc2V0KClcblxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAvLyBBIHByZXZpb3VzIHNlcmlhbGl6ZWQgY2FjaGUgaGFzIHRoZSBtb3N0IHJlY2VudCBpdGVtcyBmaXJzdFxuICAgIGZvciAobGV0IGwgPSBhcnIubGVuZ3RoIC0gMTsgbCA+PSAwOyBsLS0pIHtcbiAgICAgIGNvbnN0IGhpdCA9IGFycltsXVxuICAgICAgY29uc3QgZXhwaXJlc0F0ID0gaGl0LmUgfHwgMFxuICAgICAgaWYgKGV4cGlyZXNBdCA9PT0gMClcbiAgICAgICAgLy8gdGhlIGl0ZW0gd2FzIGNyZWF0ZWQgd2l0aG91dCBleHBpcmF0aW9uIGluIGEgbm9uIGFnZWQgY2FjaGVcbiAgICAgICAgdGhpcy5zZXQoaGl0LmssIGhpdC52KVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG1heEFnZSA9IGV4cGlyZXNBdCAtIG5vd1xuICAgICAgICAvLyBkb250IGFkZCBhbHJlYWR5IGV4cGlyZWQgaXRlbXNcbiAgICAgICAgaWYgKG1heEFnZSA+IDApIHtcbiAgICAgICAgICB0aGlzLnNldChoaXQuaywgaGl0LnYsIG1heEFnZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBydW5lICgpIHtcbiAgICB0aGlzW0NBQ0hFXS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiBnZXQodGhpcywga2V5LCBmYWxzZSkpXG4gIH1cbn1cblxuY29uc3QgZ2V0ID0gKHNlbGYsIGtleSwgZG9Vc2UpID0+IHtcbiAgY29uc3Qgbm9kZSA9IHNlbGZbQ0FDSEVdLmdldChrZXkpXG4gIGlmIChub2RlKSB7XG4gICAgY29uc3QgaGl0ID0gbm9kZS52YWx1ZVxuICAgIGlmIChpc1N0YWxlKHNlbGYsIGhpdCkpIHtcbiAgICAgIGRlbChzZWxmLCBub2RlKVxuICAgICAgaWYgKCFzZWxmW0FMTE9XX1NUQUxFXSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZG9Vc2UpIHtcbiAgICAgICAgaWYgKHNlbGZbVVBEQVRFX0FHRV9PTl9HRVRdKVxuICAgICAgICAgIG5vZGUudmFsdWUubm93ID0gRGF0ZS5ub3coKVxuICAgICAgICBzZWxmW0xSVV9MSVNUXS51bnNoaWZ0Tm9kZShub2RlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGl0LnZhbHVlXG4gIH1cbn1cblxuY29uc3QgaXNTdGFsZSA9IChzZWxmLCBoaXQpID0+IHtcbiAgaWYgKCFoaXQgfHwgKCFoaXQubWF4QWdlICYmICFzZWxmW01BWF9BR0VdKSlcbiAgICByZXR1cm4gZmFsc2VcblxuICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIGhpdC5ub3dcbiAgcmV0dXJuIGhpdC5tYXhBZ2UgPyBkaWZmID4gaGl0Lm1heEFnZVxuICAgIDogc2VsZltNQVhfQUdFXSAmJiAoZGlmZiA+IHNlbGZbTUFYX0FHRV0pXG59XG5cbmNvbnN0IHRyaW0gPSBzZWxmID0+IHtcbiAgaWYgKHNlbGZbTEVOR1RIXSA+IHNlbGZbTUFYXSkge1xuICAgIGZvciAobGV0IHdhbGtlciA9IHNlbGZbTFJVX0xJU1RdLnRhaWw7XG4gICAgICBzZWxmW0xFTkdUSF0gPiBzZWxmW01BWF0gJiYgd2Fsa2VyICE9PSBudWxsOykge1xuICAgICAgLy8gV2Uga25vdyB0aGF0IHdlJ3JlIGFib3V0IHRvIGRlbGV0ZSB0aGlzIG9uZSwgYW5kIGFsc29cbiAgICAgIC8vIHdoYXQgdGhlIG5leHQgbGVhc3QgcmVjZW50bHkgdXNlZCBrZXkgd2lsbCBiZSwgc28ganVzdFxuICAgICAgLy8gZ28gYWhlYWQgYW5kIHNldCBpdCBub3cuXG4gICAgICBjb25zdCBwcmV2ID0gd2Fsa2VyLnByZXZcbiAgICAgIGRlbChzZWxmLCB3YWxrZXIpXG4gICAgICB3YWxrZXIgPSBwcmV2XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlbCA9IChzZWxmLCBub2RlKSA9PiB7XG4gIGlmIChub2RlKSB7XG4gICAgY29uc3QgaGl0ID0gbm9kZS52YWx1ZVxuICAgIGlmIChzZWxmW0RJU1BPU0VdKVxuICAgICAgc2VsZltESVNQT1NFXShoaXQua2V5LCBoaXQudmFsdWUpXG5cbiAgICBzZWxmW0xFTkdUSF0gLT0gaGl0Lmxlbmd0aFxuICAgIHNlbGZbQ0FDSEVdLmRlbGV0ZShoaXQua2V5KVxuICAgIHNlbGZbTFJVX0xJU1RdLnJlbW92ZU5vZGUobm9kZSlcbiAgfVxufVxuXG5jbGFzcyBFbnRyeSB7XG4gIGNvbnN0cnVjdG9yIChrZXksIHZhbHVlLCBsZW5ndGgsIG5vdywgbWF4QWdlKSB7XG4gICAgdGhpcy5rZXkgPSBrZXlcbiAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aFxuICAgIHRoaXMubm93ID0gbm93XG4gICAgdGhpcy5tYXhBZ2UgPSBtYXhBZ2UgfHwgMFxuICB9XG59XG5cbmNvbnN0IGZvckVhY2hTdGVwID0gKHNlbGYsIGZuLCBub2RlLCB0aGlzcCkgPT4ge1xuICBsZXQgaGl0ID0gbm9kZS52YWx1ZVxuICBpZiAoaXNTdGFsZShzZWxmLCBoaXQpKSB7XG4gICAgZGVsKHNlbGYsIG5vZGUpXG4gICAgaWYgKCFzZWxmW0FMTE9XX1NUQUxFXSlcbiAgICAgIGhpdCA9IHVuZGVmaW5lZFxuICB9XG4gIGlmIChoaXQpXG4gICAgZm4uY2FsbCh0aGlzcCwgaGl0LnZhbHVlLCBoaXQua2V5LCBzZWxmKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExSVUNhY2hlXG4iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBTZW1WZXJcblxudmFyIGRlYnVnXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJlxuICAgIHByb2Nlc3MuZW52ICYmXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyAmJlxuICAgIC9cXGJzZW12ZXJcXGIvaS50ZXN0KHByb2Nlc3MuZW52Lk5PREVfREVCVUcpKSB7XG4gIGRlYnVnID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuICAgIGFyZ3MudW5zaGlmdCgnU0VNVkVSJylcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKVxuICB9XG59IGVsc2Uge1xuICBkZWJ1ZyA9IGZ1bmN0aW9uICgpIHt9XG59XG5cbi8vIE5vdGU6IHRoaXMgaXMgdGhlIHNlbXZlci5vcmcgdmVyc2lvbiBvZiB0aGUgc3BlYyB0aGF0IGl0IGltcGxlbWVudHNcbi8vIE5vdCBuZWNlc3NhcmlseSB0aGUgcGFja2FnZSB2ZXJzaW9uIG9mIHRoaXMgY29kZS5cbmV4cG9ydHMuU0VNVkVSX1NQRUNfVkVSU0lPTiA9ICcyLjAuMCdcblxudmFyIE1BWF9MRU5HVEggPSAyNTZcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgfHxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gOTAwNzE5OTI1NDc0MDk5MVxuXG4vLyBNYXggc2FmZSBzZWdtZW50IGxlbmd0aCBmb3IgY29lcmNpb24uXG52YXIgTUFYX1NBRkVfQ09NUE9ORU5UX0xFTkdUSCA9IDE2XG5cbnZhciBNQVhfU0FGRV9CVUlMRF9MRU5HVEggPSBNQVhfTEVOR1RIIC0gNlxuXG4vLyBUaGUgYWN0dWFsIHJlZ2V4cHMgZ28gb24gZXhwb3J0cy5yZVxudmFyIHJlID0gZXhwb3J0cy5yZSA9IFtdXG52YXIgc2FmZVJlID0gZXhwb3J0cy5zYWZlUmUgPSBbXVxudmFyIHNyYyA9IGV4cG9ydHMuc3JjID0gW11cbnZhciB0ID0gZXhwb3J0cy50b2tlbnMgPSB7fVxudmFyIFIgPSAwXG5cbmZ1bmN0aW9uIHRvayAobikge1xuICB0W25dID0gUisrXG59XG5cbnZhciBMRVRURVJEQVNITlVNQkVSID0gJ1thLXpBLVowLTktXSdcblxuLy8gUmVwbGFjZSBzb21lIGdyZWVkeSByZWdleCB0b2tlbnMgdG8gcHJldmVudCByZWdleCBkb3MgaXNzdWVzLiBUaGVzZSByZWdleCBhcmVcbi8vIHVzZWQgaW50ZXJuYWxseSB2aWEgdGhlIHNhZmVSZSBvYmplY3Qgc2luY2UgYWxsIGlucHV0cyBpbiB0aGlzIGxpYnJhcnkgZ2V0XG4vLyBub3JtYWxpemVkIGZpcnN0IHRvIHRyaW0gYW5kIGNvbGxhcHNlIGFsbCBleHRyYSB3aGl0ZXNwYWNlLiBUaGUgb3JpZ2luYWxcbi8vIHJlZ2V4ZXMgYXJlIGV4cG9ydGVkIGZvciB1c2VybGFuZCBjb25zdW1wdGlvbiBhbmQgbG93ZXIgbGV2ZWwgdXNhZ2UuIEFcbi8vIGZ1dHVyZSBicmVha2luZyBjaGFuZ2UgY291bGQgZXhwb3J0IHRoZSBzYWZlciByZWdleCBvbmx5IHdpdGggYSBub3RlIHRoYXRcbi8vIGFsbCBpbnB1dCBzaG91bGQgaGF2ZSBleHRyYSB3aGl0ZXNwYWNlIHJlbW92ZWQuXG52YXIgc2FmZVJlZ2V4UmVwbGFjZW1lbnRzID0gW1xuICBbJ1xcXFxzJywgMV0sXG4gIFsnXFxcXGQnLCBNQVhfTEVOR1RIXSxcbiAgW0xFVFRFUkRBU0hOVU1CRVIsIE1BWF9TQUZFX0JVSUxEX0xFTkdUSF0sXG5dXG5cbmZ1bmN0aW9uIG1ha2VTYWZlUmUgKHZhbHVlKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2FmZVJlZ2V4UmVwbGFjZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRva2VuID0gc2FmZVJlZ2V4UmVwbGFjZW1lbnRzW2ldWzBdXG4gICAgdmFyIG1heCA9IHNhZmVSZWdleFJlcGxhY2VtZW50c1tpXVsxXVxuICAgIHZhbHVlID0gdmFsdWVcbiAgICAgIC5zcGxpdCh0b2tlbiArICcqJykuam9pbih0b2tlbiArICd7MCwnICsgbWF4ICsgJ30nKVxuICAgICAgLnNwbGl0KHRva2VuICsgJysnKS5qb2luKHRva2VuICsgJ3sxLCcgKyBtYXggKyAnfScpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIFRoZSBmb2xsb3dpbmcgUmVndWxhciBFeHByZXNzaW9ucyBjYW4gYmUgdXNlZCBmb3IgdG9rZW5pemluZyxcbi8vIHZhbGlkYXRpbmcsIGFuZCBwYXJzaW5nIFNlbVZlciB2ZXJzaW9uIHN0cmluZ3MuXG5cbi8vICMjIE51bWVyaWMgSWRlbnRpZmllclxuLy8gQSBzaW5nbGUgYDBgLCBvciBhIG5vbi16ZXJvIGRpZ2l0IGZvbGxvd2VkIGJ5IHplcm8gb3IgbW9yZSBkaWdpdHMuXG5cbnRvaygnTlVNRVJJQ0lERU5USUZJRVInKVxuc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJdID0gJzB8WzEtOV1cXFxcZConXG50b2soJ05VTUVSSUNJREVOVElGSUVSTE9PU0UnKVxuc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gPSAnXFxcXGQrJ1xuXG4vLyAjIyBOb24tbnVtZXJpYyBJZGVudGlmaWVyXG4vLyBaZXJvIG9yIG1vcmUgZGlnaXRzLCBmb2xsb3dlZCBieSBhIGxldHRlciBvciBoeXBoZW4sIGFuZCB0aGVuIHplcm8gb3Jcbi8vIG1vcmUgbGV0dGVycywgZGlnaXRzLCBvciBoeXBoZW5zLlxuXG50b2soJ05PTk5VTUVSSUNJREVOVElGSUVSJylcbnNyY1t0Lk5PTk5VTUVSSUNJREVOVElGSUVSXSA9ICdcXFxcZCpbYS16QS1aLV0nICsgTEVUVEVSREFTSE5VTUJFUiArICcqJ1xuXG4vLyAjIyBNYWluIFZlcnNpb25cbi8vIFRocmVlIGRvdC1zZXBhcmF0ZWQgbnVtZXJpYyBpZGVudGlmaWVycy5cblxudG9rKCdNQUlOVkVSU0lPTicpXG5zcmNbdC5NQUlOVkVSU0lPTl0gPSAnKCcgKyBzcmNbdC5OVU1FUklDSURFTlRJRklFUl0gKyAnKVxcXFwuJyArXG4gICAgICAgICAgICAgICAgICAgJygnICsgc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJdICsgJylcXFxcLicgK1xuICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSXSArICcpJ1xuXG50b2soJ01BSU5WRVJTSU9OTE9PU0UnKVxuc3JjW3QuTUFJTlZFUlNJT05MT09TRV0gPSAnKCcgKyBzcmNbdC5OVU1FUklDSURFTlRJRklFUkxPT1NFXSArICcpXFxcXC4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSTE9PU0VdICsgJylcXFxcLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gKyAnKSdcblxuLy8gIyMgUHJlLXJlbGVhc2UgVmVyc2lvbiBJZGVudGlmaWVyXG4vLyBBIG51bWVyaWMgaWRlbnRpZmllciwgb3IgYSBub24tbnVtZXJpYyBpZGVudGlmaWVyLlxuXG50b2soJ1BSRVJFTEVBU0VJREVOVElGSUVSJylcbnNyY1t0LlBSRVJFTEVBU0VJREVOVElGSUVSXSA9ICcoPzonICsgc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJdICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfCcgKyBzcmNbdC5OT05OVU1FUklDSURFTlRJRklFUl0gKyAnKSdcblxudG9rKCdQUkVSRUxFQVNFSURFTlRJRklFUkxPT1NFJylcbnNyY1t0LlBSRVJFTEVBU0VJREVOVElGSUVSTE9PU0VdID0gJyg/OicgKyBzcmNbdC5OVU1FUklDSURFTlRJRklFUkxPT1NFXSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfCcgKyBzcmNbdC5OT05OVU1FUklDSURFTlRJRklFUl0gKyAnKSdcblxuLy8gIyMgUHJlLXJlbGVhc2UgVmVyc2lvblxuLy8gSHlwaGVuLCBmb2xsb3dlZCBieSBvbmUgb3IgbW9yZSBkb3Qtc2VwYXJhdGVkIHByZS1yZWxlYXNlIHZlcnNpb25cbi8vIGlkZW50aWZpZXJzLlxuXG50b2soJ1BSRVJFTEVBU0UnKVxuc3JjW3QuUFJFUkVMRUFTRV0gPSAnKD86LSgnICsgc3JjW3QuUFJFUkVMRUFTRUlERU5USUZJRVJdICtcbiAgICAgICAgICAgICAgICAgICcoPzpcXFxcLicgKyBzcmNbdC5QUkVSRUxFQVNFSURFTlRJRklFUl0gKyAnKSopKSdcblxudG9rKCdQUkVSRUxFQVNFTE9PU0UnKVxuc3JjW3QuUFJFUkVMRUFTRUxPT1NFXSA9ICcoPzotPygnICsgc3JjW3QuUFJFUkVMRUFTRUlERU5USUZJRVJMT09TRV0gK1xuICAgICAgICAgICAgICAgICAgICAgICAnKD86XFxcXC4nICsgc3JjW3QuUFJFUkVMRUFTRUlERU5USUZJRVJMT09TRV0gKyAnKSopKSdcblxuLy8gIyMgQnVpbGQgTWV0YWRhdGEgSWRlbnRpZmllclxuLy8gQW55IGNvbWJpbmF0aW9uIG9mIGRpZ2l0cywgbGV0dGVycywgb3IgaHlwaGVucy5cblxudG9rKCdCVUlMRElERU5USUZJRVInKVxuc3JjW3QuQlVJTERJREVOVElGSUVSXSA9IExFVFRFUkRBU0hOVU1CRVIgKyAnKydcblxuLy8gIyMgQnVpbGQgTWV0YWRhdGFcbi8vIFBsdXMgc2lnbiwgZm9sbG93ZWQgYnkgb25lIG9yIG1vcmUgcGVyaW9kLXNlcGFyYXRlZCBidWlsZCBtZXRhZGF0YVxuLy8gaWRlbnRpZmllcnMuXG5cbnRvaygnQlVJTEQnKVxuc3JjW3QuQlVJTERdID0gJyg/OlxcXFwrKCcgKyBzcmNbdC5CVUlMRElERU5USUZJRVJdICtcbiAgICAgICAgICAgICAnKD86XFxcXC4nICsgc3JjW3QuQlVJTERJREVOVElGSUVSXSArICcpKikpJ1xuXG4vLyAjIyBGdWxsIFZlcnNpb24gU3RyaW5nXG4vLyBBIG1haW4gdmVyc2lvbiwgZm9sbG93ZWQgb3B0aW9uYWxseSBieSBhIHByZS1yZWxlYXNlIHZlcnNpb24gYW5kXG4vLyBidWlsZCBtZXRhZGF0YS5cblxuLy8gTm90ZSB0aGF0IHRoZSBvbmx5IG1ham9yLCBtaW5vciwgcGF0Y2gsIGFuZCBwcmUtcmVsZWFzZSBzZWN0aW9ucyBvZlxuLy8gdGhlIHZlcnNpb24gc3RyaW5nIGFyZSBjYXB0dXJpbmcgZ3JvdXBzLiAgVGhlIGJ1aWxkIG1ldGFkYXRhIGlzIG5vdCBhXG4vLyBjYXB0dXJpbmcgZ3JvdXAsIGJlY2F1c2UgaXQgc2hvdWxkIG5vdCBldmVyIGJlIHVzZWQgaW4gdmVyc2lvblxuLy8gY29tcGFyaXNvbi5cblxudG9rKCdGVUxMJylcbnRvaygnRlVMTFBMQUlOJylcbnNyY1t0LkZVTExQTEFJTl0gPSAndj8nICsgc3JjW3QuTUFJTlZFUlNJT05dICtcbiAgICAgICAgICAgICAgICAgIHNyY1t0LlBSRVJFTEVBU0VdICsgJz8nICtcbiAgICAgICAgICAgICAgICAgIHNyY1t0LkJVSUxEXSArICc/J1xuXG5zcmNbdC5GVUxMXSA9ICdeJyArIHNyY1t0LkZVTExQTEFJTl0gKyAnJCdcblxuLy8gbGlrZSBmdWxsLCBidXQgYWxsb3dzIHYxLjIuMyBhbmQgPTEuMi4zLCB3aGljaCBwZW9wbGUgZG8gc29tZXRpbWVzLlxuLy8gYWxzbywgMS4wLjBhbHBoYTEgKHByZXJlbGVhc2Ugd2l0aG91dCB0aGUgaHlwaGVuKSB3aGljaCBpcyBwcmV0dHlcbi8vIGNvbW1vbiBpbiB0aGUgbnBtIHJlZ2lzdHJ5LlxudG9rKCdMT09TRVBMQUlOJylcbnNyY1t0LkxPT1NFUExBSU5dID0gJ1t2PVxcXFxzXSonICsgc3JjW3QuTUFJTlZFUlNJT05MT09TRV0gK1xuICAgICAgICAgICAgICAgICAgc3JjW3QuUFJFUkVMRUFTRUxPT1NFXSArICc/JyArXG4gICAgICAgICAgICAgICAgICBzcmNbdC5CVUlMRF0gKyAnPydcblxudG9rKCdMT09TRScpXG5zcmNbdC5MT09TRV0gPSAnXicgKyBzcmNbdC5MT09TRVBMQUlOXSArICckJ1xuXG50b2soJ0dUTFQnKVxuc3JjW3QuR1RMVF0gPSAnKCg/Ojx8Pik/PT8pJ1xuXG4vLyBTb21ldGhpbmcgbGlrZSBcIjIuKlwiIG9yIFwiMS4yLnhcIi5cbi8vIE5vdGUgdGhhdCBcIngueFwiIGlzIGEgdmFsaWQgeFJhbmdlIGlkZW50aWZlciwgbWVhbmluZyBcImFueSB2ZXJzaW9uXCJcbi8vIE9ubHkgdGhlIGZpcnN0IGl0ZW0gaXMgc3RyaWN0bHkgcmVxdWlyZWQuXG50b2soJ1hSQU5HRUlERU5USUZJRVJMT09TRScpXG5zcmNbdC5YUkFOR0VJREVOVElGSUVSTE9PU0VdID0gc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gKyAnfHh8WHxcXFxcKidcbnRvaygnWFJBTkdFSURFTlRJRklFUicpXG5zcmNbdC5YUkFOR0VJREVOVElGSUVSXSA9IHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSXSArICd8eHxYfFxcXFwqJ1xuXG50b2soJ1hSQU5HRVBMQUlOJylcbnNyY1t0LlhSQU5HRVBMQUlOXSA9ICdbdj1cXFxcc10qKCcgKyBzcmNbdC5YUkFOR0VJREVOVElGSUVSXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuKCcgKyBzcmNbdC5YUkFOR0VJREVOVElGSUVSXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuKCcgKyBzcmNbdC5YUkFOR0VJREVOVElGSUVSXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgJyg/OicgKyBzcmNbdC5QUkVSRUxFQVNFXSArICcpPycgK1xuICAgICAgICAgICAgICAgICAgIHNyY1t0LkJVSUxEXSArICc/JyArXG4gICAgICAgICAgICAgICAgICAgJyk/KT8nXG5cbnRvaygnWFJBTkdFUExBSU5MT09TRScpXG5zcmNbdC5YUkFOR0VQTEFJTkxPT1NFXSA9ICdbdj1cXFxcc10qKCcgKyBzcmNbdC5YUkFOR0VJREVOVElGSUVSTE9PU0VdICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcoPzpcXFxcLignICsgc3JjW3QuWFJBTkdFSURFTlRJRklFUkxPT1NFXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKD86XFxcXC4oJyArIHNyY1t0LlhSQU5HRUlERU5USUZJRVJMT09TRV0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyg/OicgKyBzcmNbdC5QUkVSRUxFQVNFTE9PU0VdICsgJyk/JyArXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNbdC5CVUlMRF0gKyAnPycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyk/KT8nXG5cbnRvaygnWFJBTkdFJylcbnNyY1t0LlhSQU5HRV0gPSAnXicgKyBzcmNbdC5HVExUXSArICdcXFxccyonICsgc3JjW3QuWFJBTkdFUExBSU5dICsgJyQnXG50b2soJ1hSQU5HRUxPT1NFJylcbnNyY1t0LlhSQU5HRUxPT1NFXSA9ICdeJyArIHNyY1t0LkdUTFRdICsgJ1xcXFxzKicgKyBzcmNbdC5YUkFOR0VQTEFJTkxPT1NFXSArICckJ1xuXG4vLyBDb2VyY2lvbi5cbi8vIEV4dHJhY3QgYW55dGhpbmcgdGhhdCBjb3VsZCBjb25jZWl2YWJseSBiZSBhIHBhcnQgb2YgYSB2YWxpZCBzZW12ZXJcbnRvaygnQ09FUkNFJylcbnNyY1t0LkNPRVJDRV0gPSAnKF58W15cXFxcZF0pJyArXG4gICAgICAgICAgICAgICcoXFxcXGR7MSwnICsgTUFYX1NBRkVfQ09NUE9ORU5UX0xFTkdUSCArICd9KScgK1xuICAgICAgICAgICAgICAnKD86XFxcXC4oXFxcXGR7MSwnICsgTUFYX1NBRkVfQ09NUE9ORU5UX0xFTkdUSCArICd9KSk/JyArXG4gICAgICAgICAgICAgICcoPzpcXFxcLihcXFxcZHsxLCcgKyBNQVhfU0FGRV9DT01QT05FTlRfTEVOR1RIICsgJ30pKT8nICtcbiAgICAgICAgICAgICAgJyg/OiR8W15cXFxcZF0pJ1xudG9rKCdDT0VSQ0VSVEwnKVxucmVbdC5DT0VSQ0VSVExdID0gbmV3IFJlZ0V4cChzcmNbdC5DT0VSQ0VdLCAnZycpXG5zYWZlUmVbdC5DT0VSQ0VSVExdID0gbmV3IFJlZ0V4cChtYWtlU2FmZVJlKHNyY1t0LkNPRVJDRV0pLCAnZycpXG5cbi8vIFRpbGRlIHJhbmdlcy5cbi8vIE1lYW5pbmcgaXMgXCJyZWFzb25hYmx5IGF0IG9yIGdyZWF0ZXIgdGhhblwiXG50b2soJ0xPTkVUSUxERScpXG5zcmNbdC5MT05FVElMREVdID0gJyg/On4+PyknXG5cbnRvaygnVElMREVUUklNJylcbnNyY1t0LlRJTERFVFJJTV0gPSAnKFxcXFxzKiknICsgc3JjW3QuTE9ORVRJTERFXSArICdcXFxccysnXG5yZVt0LlRJTERFVFJJTV0gPSBuZXcgUmVnRXhwKHNyY1t0LlRJTERFVFJJTV0sICdnJylcbnNhZmVSZVt0LlRJTERFVFJJTV0gPSBuZXcgUmVnRXhwKG1ha2VTYWZlUmUoc3JjW3QuVElMREVUUklNXSksICdnJylcbnZhciB0aWxkZVRyaW1SZXBsYWNlID0gJyQxfidcblxudG9rKCdUSUxERScpXG5zcmNbdC5USUxERV0gPSAnXicgKyBzcmNbdC5MT05FVElMREVdICsgc3JjW3QuWFJBTkdFUExBSU5dICsgJyQnXG50b2soJ1RJTERFTE9PU0UnKVxuc3JjW3QuVElMREVMT09TRV0gPSAnXicgKyBzcmNbdC5MT05FVElMREVdICsgc3JjW3QuWFJBTkdFUExBSU5MT09TRV0gKyAnJCdcblxuLy8gQ2FyZXQgcmFuZ2VzLlxuLy8gTWVhbmluZyBpcyBcImF0IGxlYXN0IGFuZCBiYWNrd2FyZHMgY29tcGF0aWJsZSB3aXRoXCJcbnRvaygnTE9ORUNBUkVUJylcbnNyY1t0LkxPTkVDQVJFVF0gPSAnKD86XFxcXF4pJ1xuXG50b2soJ0NBUkVUVFJJTScpXG5zcmNbdC5DQVJFVFRSSU1dID0gJyhcXFxccyopJyArIHNyY1t0LkxPTkVDQVJFVF0gKyAnXFxcXHMrJ1xucmVbdC5DQVJFVFRSSU1dID0gbmV3IFJlZ0V4cChzcmNbdC5DQVJFVFRSSU1dLCAnZycpXG5zYWZlUmVbdC5DQVJFVFRSSU1dID0gbmV3IFJlZ0V4cChtYWtlU2FmZVJlKHNyY1t0LkNBUkVUVFJJTV0pLCAnZycpXG52YXIgY2FyZXRUcmltUmVwbGFjZSA9ICckMV4nXG5cbnRvaygnQ0FSRVQnKVxuc3JjW3QuQ0FSRVRdID0gJ14nICsgc3JjW3QuTE9ORUNBUkVUXSArIHNyY1t0LlhSQU5HRVBMQUlOXSArICckJ1xudG9rKCdDQVJFVExPT1NFJylcbnNyY1t0LkNBUkVUTE9PU0VdID0gJ14nICsgc3JjW3QuTE9ORUNBUkVUXSArIHNyY1t0LlhSQU5HRVBMQUlOTE9PU0VdICsgJyQnXG5cbi8vIEEgc2ltcGxlIGd0L2x0L2VxIHRoaW5nLCBvciBqdXN0IFwiXCIgdG8gaW5kaWNhdGUgXCJhbnkgdmVyc2lvblwiXG50b2soJ0NPTVBBUkFUT1JMT09TRScpXG5zcmNbdC5DT01QQVJBVE9STE9PU0VdID0gJ14nICsgc3JjW3QuR1RMVF0gKyAnXFxcXHMqKCcgKyBzcmNbdC5MT09TRVBMQUlOXSArICcpJHxeJCdcbnRvaygnQ09NUEFSQVRPUicpXG5zcmNbdC5DT01QQVJBVE9SXSA9ICdeJyArIHNyY1t0LkdUTFRdICsgJ1xcXFxzKignICsgc3JjW3QuRlVMTFBMQUlOXSArICcpJHxeJCdcblxuLy8gQW4gZXhwcmVzc2lvbiB0byBzdHJpcCBhbnkgd2hpdGVzcGFjZSBiZXR3ZWVuIHRoZSBndGx0IGFuZCB0aGUgdGhpbmdcbi8vIGl0IG1vZGlmaWVzLCBzbyB0aGF0IGA+IDEuMi4zYCA9PT4gYD4xLjIuM2BcbnRvaygnQ09NUEFSQVRPUlRSSU0nKVxuc3JjW3QuQ09NUEFSQVRPUlRSSU1dID0gJyhcXFxccyopJyArIHNyY1t0LkdUTFRdICtcbiAgICAgICAgICAgICAgICAgICAgICAnXFxcXHMqKCcgKyBzcmNbdC5MT09TRVBMQUlOXSArICd8JyArIHNyY1t0LlhSQU5HRVBMQUlOXSArICcpJ1xuXG4vLyB0aGlzIG9uZSBoYXMgdG8gdXNlIHRoZSAvZyBmbGFnXG5yZVt0LkNPTVBBUkFUT1JUUklNXSA9IG5ldyBSZWdFeHAoc3JjW3QuQ09NUEFSQVRPUlRSSU1dLCAnZycpXG5zYWZlUmVbdC5DT01QQVJBVE9SVFJJTV0gPSBuZXcgUmVnRXhwKG1ha2VTYWZlUmUoc3JjW3QuQ09NUEFSQVRPUlRSSU1dKSwgJ2cnKVxudmFyIGNvbXBhcmF0b3JUcmltUmVwbGFjZSA9ICckMSQyJDMnXG5cbi8vIFNvbWV0aGluZyBsaWtlIGAxLjIuMyAtIDEuMi40YFxuLy8gTm90ZSB0aGF0IHRoZXNlIGFsbCB1c2UgdGhlIGxvb3NlIGZvcm0sIGJlY2F1c2UgdGhleSdsbCBiZVxuLy8gY2hlY2tlZCBhZ2FpbnN0IGVpdGhlciB0aGUgc3RyaWN0IG9yIGxvb3NlIGNvbXBhcmF0b3IgZm9ybVxuLy8gbGF0ZXIuXG50b2soJ0hZUEhFTlJBTkdFJylcbnNyY1t0LkhZUEhFTlJBTkdFXSA9ICdeXFxcXHMqKCcgKyBzcmNbdC5YUkFOR0VQTEFJTl0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICdcXFxccystXFxcXHMrJyArXG4gICAgICAgICAgICAgICAgICAgJygnICsgc3JjW3QuWFJBTkdFUExBSU5dICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAnXFxcXHMqJCdcblxudG9rKCdIWVBIRU5SQU5HRUxPT1NFJylcbnNyY1t0LkhZUEhFTlJBTkdFTE9PU0VdID0gJ15cXFxccyooJyArIHNyY1t0LlhSQU5HRVBMQUlOTE9PU0VdICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcXFxccystXFxcXHMrJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKCcgKyBzcmNbdC5YUkFOR0VQTEFJTkxPT1NFXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxcXHMqJCdcblxuLy8gU3RhciByYW5nZXMgYmFzaWNhbGx5IGp1c3QgYWxsb3cgYW55dGhpbmcgYXQgYWxsLlxudG9rKCdTVEFSJylcbnNyY1t0LlNUQVJdID0gJyg8fD4pPz0/XFxcXHMqXFxcXConXG5cbi8vIENvbXBpbGUgdG8gYWN0dWFsIHJlZ2V4cCBvYmplY3RzLlxuLy8gQWxsIGFyZSBmbGFnLWZyZWUsIHVubGVzcyB0aGV5IHdlcmUgY3JlYXRlZCBhYm92ZSB3aXRoIGEgZmxhZy5cbmZvciAodmFyIGkgPSAwOyBpIDwgUjsgaSsrKSB7XG4gIGRlYnVnKGksIHNyY1tpXSlcbiAgaWYgKCFyZVtpXSkge1xuICAgIHJlW2ldID0gbmV3IFJlZ0V4cChzcmNbaV0pXG5cbiAgICAvLyBSZXBsYWNlIGFsbCBncmVlZHkgd2hpdGVzcGFjZSB0byBwcmV2ZW50IHJlZ2V4IGRvcyBpc3N1ZXMuIFRoZXNlIHJlZ2V4IGFyZVxuICAgIC8vIHVzZWQgaW50ZXJuYWxseSB2aWEgdGhlIHNhZmVSZSBvYmplY3Qgc2luY2UgYWxsIGlucHV0cyBpbiB0aGlzIGxpYnJhcnkgZ2V0XG4gICAgLy8gbm9ybWFsaXplZCBmaXJzdCB0byB0cmltIGFuZCBjb2xsYXBzZSBhbGwgZXh0cmEgd2hpdGVzcGFjZS4gVGhlIG9yaWdpbmFsXG4gICAgLy8gcmVnZXhlcyBhcmUgZXhwb3J0ZWQgZm9yIHVzZXJsYW5kIGNvbnN1bXB0aW9uIGFuZCBsb3dlciBsZXZlbCB1c2FnZS4gQVxuICAgIC8vIGZ1dHVyZSBicmVha2luZyBjaGFuZ2UgY291bGQgZXhwb3J0IHRoZSBzYWZlciByZWdleCBvbmx5IHdpdGggYSBub3RlIHRoYXRcbiAgICAvLyBhbGwgaW5wdXQgc2hvdWxkIGhhdmUgZXh0cmEgd2hpdGVzcGFjZSByZW1vdmVkLlxuICAgIHNhZmVSZVtpXSA9IG5ldyBSZWdFeHAobWFrZVNhZmVSZShzcmNbaV0pKVxuICB9XG59XG5cbmV4cG9ydHMucGFyc2UgPSBwYXJzZVxuZnVuY3Rpb24gcGFyc2UgKHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zIHx8IHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBsb29zZTogISFvcHRpb25zLFxuICAgICAgaW5jbHVkZVByZXJlbGVhc2U6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaWYgKHZlcnNpb24gaW5zdGFuY2VvZiBTZW1WZXIpIHtcbiAgICByZXR1cm4gdmVyc2lvblxuICB9XG5cbiAgaWYgKHR5cGVvZiB2ZXJzaW9uICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBpZiAodmVyc2lvbi5sZW5ndGggPiBNQVhfTEVOR1RIKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHZhciByID0gb3B0aW9ucy5sb29zZSA/IHNhZmVSZVt0LkxPT1NFXSA6IHNhZmVSZVt0LkZVTExdXG4gIGlmICghci50ZXN0KHZlcnNpb24pKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBTZW1WZXIodmVyc2lvbiwgb3B0aW9ucylcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmV4cG9ydHMudmFsaWQgPSB2YWxpZFxuZnVuY3Rpb24gdmFsaWQgKHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgdmFyIHYgPSBwYXJzZSh2ZXJzaW9uLCBvcHRpb25zKVxuICByZXR1cm4gdiA/IHYudmVyc2lvbiA6IG51bGxcbn1cblxuZXhwb3J0cy5jbGVhbiA9IGNsZWFuXG5mdW5jdGlvbiBjbGVhbiAodmVyc2lvbiwgb3B0aW9ucykge1xuICB2YXIgcyA9IHBhcnNlKHZlcnNpb24udHJpbSgpLnJlcGxhY2UoL15bPXZdKy8sICcnKSwgb3B0aW9ucylcbiAgcmV0dXJuIHMgPyBzLnZlcnNpb24gOiBudWxsXG59XG5cbmV4cG9ydHMuU2VtVmVyID0gU2VtVmVyXG5cbmZ1bmN0aW9uIFNlbVZlciAodmVyc2lvbiwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGxvb3NlOiAhIW9wdGlvbnMsXG4gICAgICBpbmNsdWRlUHJlcmVsZWFzZTogZmFsc2VcbiAgICB9XG4gIH1cbiAgaWYgKHZlcnNpb24gaW5zdGFuY2VvZiBTZW1WZXIpIHtcbiAgICBpZiAodmVyc2lvbi5sb29zZSA9PT0gb3B0aW9ucy5sb29zZSkge1xuICAgICAgcmV0dXJuIHZlcnNpb25cbiAgICB9IGVsc2Uge1xuICAgICAgdmVyc2lvbiA9IHZlcnNpb24udmVyc2lvblxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIFZlcnNpb246ICcgKyB2ZXJzaW9uKVxuICB9XG5cbiAgaWYgKHZlcnNpb24ubGVuZ3RoID4gTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZlcnNpb24gaXMgbG9uZ2VyIHRoYW4gJyArIE1BWF9MRU5HVEggKyAnIGNoYXJhY3RlcnMnKVxuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNlbVZlcikpIHtcbiAgICByZXR1cm4gbmV3IFNlbVZlcih2ZXJzaW9uLCBvcHRpb25zKVxuICB9XG5cbiAgZGVidWcoJ1NlbVZlcicsIHZlcnNpb24sIG9wdGlvbnMpXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgdGhpcy5sb29zZSA9ICEhb3B0aW9ucy5sb29zZVxuXG4gIHZhciBtID0gdmVyc2lvbi50cmltKCkubWF0Y2gob3B0aW9ucy5sb29zZSA/IHNhZmVSZVt0LkxPT1NFXSA6IHNhZmVSZVt0LkZVTExdKVxuXG4gIGlmICghbSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgVmVyc2lvbjogJyArIHZlcnNpb24pXG4gIH1cblxuICB0aGlzLnJhdyA9IHZlcnNpb25cblxuICAvLyB0aGVzZSBhcmUgYWN0dWFsbHkgbnVtYmVyc1xuICB0aGlzLm1ham9yID0gK21bMV1cbiAgdGhpcy5taW5vciA9ICttWzJdXG4gIHRoaXMucGF0Y2ggPSArbVszXVxuXG4gIGlmICh0aGlzLm1ham9yID4gTUFYX1NBRkVfSU5URUdFUiB8fCB0aGlzLm1ham9yIDwgMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbWFqb3IgdmVyc2lvbicpXG4gIH1cblxuICBpZiAodGhpcy5taW5vciA+IE1BWF9TQUZFX0lOVEVHRVIgfHwgdGhpcy5taW5vciA8IDApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG1pbm9yIHZlcnNpb24nKVxuICB9XG5cbiAgaWYgKHRoaXMucGF0Y2ggPiBNQVhfU0FGRV9JTlRFR0VSIHx8IHRoaXMucGF0Y2ggPCAwKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBwYXRjaCB2ZXJzaW9uJylcbiAgfVxuXG4gIC8vIG51bWJlcmlmeSBhbnkgcHJlcmVsZWFzZSBudW1lcmljIGlkc1xuICBpZiAoIW1bNF0pIHtcbiAgICB0aGlzLnByZXJlbGVhc2UgPSBbXVxuICB9IGVsc2Uge1xuICAgIHRoaXMucHJlcmVsZWFzZSA9IG1bNF0uc3BsaXQoJy4nKS5tYXAoZnVuY3Rpb24gKGlkKSB7XG4gICAgICBpZiAoL15bMC05XSskLy50ZXN0KGlkKSkge1xuICAgICAgICB2YXIgbnVtID0gK2lkXG4gICAgICAgIGlmIChudW0gPj0gMCAmJiBudW0gPCBNQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICAgICAgcmV0dXJuIG51bVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaWRcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5idWlsZCA9IG1bNV0gPyBtWzVdLnNwbGl0KCcuJykgOiBbXVxuICB0aGlzLmZvcm1hdCgpXG59XG5cblNlbVZlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnZlcnNpb24gPSB0aGlzLm1ham9yICsgJy4nICsgdGhpcy5taW5vciArICcuJyArIHRoaXMucGF0Y2hcbiAgaWYgKHRoaXMucHJlcmVsZWFzZS5sZW5ndGgpIHtcbiAgICB0aGlzLnZlcnNpb24gKz0gJy0nICsgdGhpcy5wcmVyZWxlYXNlLmpvaW4oJy4nKVxuICB9XG4gIHJldHVybiB0aGlzLnZlcnNpb25cbn1cblxuU2VtVmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudmVyc2lvblxufVxuXG5TZW1WZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgZGVidWcoJ1NlbVZlci5jb21wYXJlJywgdGhpcy52ZXJzaW9uLCB0aGlzLm9wdGlvbnMsIG90aGVyKVxuICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIFNlbVZlcikpIHtcbiAgICBvdGhlciA9IG5ldyBTZW1WZXIob3RoZXIsIHRoaXMub3B0aW9ucylcbiAgfVxuXG4gIHJldHVybiB0aGlzLmNvbXBhcmVNYWluKG90aGVyKSB8fCB0aGlzLmNvbXBhcmVQcmUob3RoZXIpXG59XG5cblNlbVZlci5wcm90b3R5cGUuY29tcGFyZU1haW4gPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBTZW1WZXIpKSB7XG4gICAgb3RoZXIgPSBuZXcgU2VtVmVyKG90aGVyLCB0aGlzLm9wdGlvbnMpXG4gIH1cblxuICByZXR1cm4gY29tcGFyZUlkZW50aWZpZXJzKHRoaXMubWFqb3IsIG90aGVyLm1ham9yKSB8fFxuICAgICAgICAgY29tcGFyZUlkZW50aWZpZXJzKHRoaXMubWlub3IsIG90aGVyLm1pbm9yKSB8fFxuICAgICAgICAgY29tcGFyZUlkZW50aWZpZXJzKHRoaXMucGF0Y2gsIG90aGVyLnBhdGNoKVxufVxuXG5TZW1WZXIucHJvdG90eXBlLmNvbXBhcmVQcmUgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBTZW1WZXIpKSB7XG4gICAgb3RoZXIgPSBuZXcgU2VtVmVyKG90aGVyLCB0aGlzLm9wdGlvbnMpXG4gIH1cblxuICAvLyBOT1QgaGF2aW5nIGEgcHJlcmVsZWFzZSBpcyA+IGhhdmluZyBvbmVcbiAgaWYgKHRoaXMucHJlcmVsZWFzZS5sZW5ndGggJiYgIW90aGVyLnByZXJlbGVhc2UubGVuZ3RoKSB7XG4gICAgcmV0dXJuIC0xXG4gIH0gZWxzZSBpZiAoIXRoaXMucHJlcmVsZWFzZS5sZW5ndGggJiYgb3RoZXIucHJlcmVsZWFzZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gMVxuICB9IGVsc2UgaWYgKCF0aGlzLnByZXJlbGVhc2UubGVuZ3RoICYmICFvdGhlci5wcmVyZWxlYXNlLmxlbmd0aCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgZG8ge1xuICAgIHZhciBhID0gdGhpcy5wcmVyZWxlYXNlW2ldXG4gICAgdmFyIGIgPSBvdGhlci5wcmVyZWxlYXNlW2ldXG4gICAgZGVidWcoJ3ByZXJlbGVhc2UgY29tcGFyZScsIGksIGEsIGIpXG4gICAgaWYgKGEgPT09IHVuZGVmaW5lZCAmJiBiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAwXG4gICAgfSBlbHNlIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAxXG4gICAgfSBlbHNlIGlmIChhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH0gZWxzZSBpZiAoYSA9PT0gYikge1xuICAgICAgY29udGludWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbXBhcmVJZGVudGlmaWVycyhhLCBiKVxuICAgIH1cbiAgfSB3aGlsZSAoKytpKVxufVxuXG5TZW1WZXIucHJvdG90eXBlLmNvbXBhcmVCdWlsZCA9IGZ1bmN0aW9uIChvdGhlcikge1xuICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIFNlbVZlcikpIHtcbiAgICBvdGhlciA9IG5ldyBTZW1WZXIob3RoZXIsIHRoaXMub3B0aW9ucylcbiAgfVxuXG4gIHZhciBpID0gMFxuICBkbyB7XG4gICAgdmFyIGEgPSB0aGlzLmJ1aWxkW2ldXG4gICAgdmFyIGIgPSBvdGhlci5idWlsZFtpXVxuICAgIGRlYnVnKCdwcmVyZWxlYXNlIGNvbXBhcmUnLCBpLCBhLCBiKVxuICAgIGlmIChhID09PSB1bmRlZmluZWQgJiYgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gMFxuICAgIH0gZWxzZSBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gMVxuICAgIH0gZWxzZSBpZiAoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9IGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb21wYXJlSWRlbnRpZmllcnMoYSwgYilcbiAgICB9XG4gIH0gd2hpbGUgKCsraSlcbn1cblxuLy8gcHJlbWlub3Igd2lsbCBidW1wIHRoZSB2ZXJzaW9uIHVwIHRvIHRoZSBuZXh0IG1pbm9yIHJlbGVhc2UsIGFuZCBpbW1lZGlhdGVseVxuLy8gZG93biB0byBwcmUtcmVsZWFzZS4gcHJlbWFqb3IgYW5kIHByZXBhdGNoIHdvcmsgdGhlIHNhbWUgd2F5LlxuU2VtVmVyLnByb3RvdHlwZS5pbmMgPSBmdW5jdGlvbiAocmVsZWFzZSwgaWRlbnRpZmllcikge1xuICBzd2l0Y2ggKHJlbGVhc2UpIHtcbiAgICBjYXNlICdwcmVtYWpvcic6XG4gICAgICB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID0gMFxuICAgICAgdGhpcy5wYXRjaCA9IDBcbiAgICAgIHRoaXMubWlub3IgPSAwXG4gICAgICB0aGlzLm1ham9yKytcbiAgICAgIHRoaXMuaW5jKCdwcmUnLCBpZGVudGlmaWVyKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdwcmVtaW5vcic6XG4gICAgICB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID0gMFxuICAgICAgdGhpcy5wYXRjaCA9IDBcbiAgICAgIHRoaXMubWlub3IrK1xuICAgICAgdGhpcy5pbmMoJ3ByZScsIGlkZW50aWZpZXIpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3ByZXBhdGNoJzpcbiAgICAgIC8vIElmIHRoaXMgaXMgYWxyZWFkeSBhIHByZXJlbGVhc2UsIGl0IHdpbGwgYnVtcCB0byB0aGUgbmV4dCB2ZXJzaW9uXG4gICAgICAvLyBkcm9wIGFueSBwcmVyZWxlYXNlcyB0aGF0IG1pZ2h0IGFscmVhZHkgZXhpc3QsIHNpbmNlIHRoZXkgYXJlIG5vdFxuICAgICAgLy8gcmVsZXZhbnQgYXQgdGhpcyBwb2ludC5cbiAgICAgIHRoaXMucHJlcmVsZWFzZS5sZW5ndGggPSAwXG4gICAgICB0aGlzLmluYygncGF0Y2gnLCBpZGVudGlmaWVyKVxuICAgICAgdGhpcy5pbmMoJ3ByZScsIGlkZW50aWZpZXIpXG4gICAgICBicmVha1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBhIG5vbi1wcmVyZWxlYXNlIHZlcnNpb24sIHRoaXMgYWN0cyB0aGUgc2FtZSBhc1xuICAgIC8vIHByZXBhdGNoLlxuICAgIGNhc2UgJ3ByZXJlbGVhc2UnOlxuICAgICAgaWYgKHRoaXMucHJlcmVsZWFzZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5pbmMoJ3BhdGNoJywgaWRlbnRpZmllcilcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5jKCdwcmUnLCBpZGVudGlmaWVyKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ21ham9yJzpcbiAgICAgIC8vIElmIHRoaXMgaXMgYSBwcmUtbWFqb3IgdmVyc2lvbiwgYnVtcCB1cCB0byB0aGUgc2FtZSBtYWpvciB2ZXJzaW9uLlxuICAgICAgLy8gT3RoZXJ3aXNlIGluY3JlbWVudCBtYWpvci5cbiAgICAgIC8vIDEuMC4wLTUgYnVtcHMgdG8gMS4wLjBcbiAgICAgIC8vIDEuMS4wIGJ1bXBzIHRvIDIuMC4wXG4gICAgICBpZiAodGhpcy5taW5vciAhPT0gMCB8fFxuICAgICAgICAgIHRoaXMucGF0Y2ggIT09IDAgfHxcbiAgICAgICAgICB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMubWFqb3IrK1xuICAgICAgfVxuICAgICAgdGhpcy5taW5vciA9IDBcbiAgICAgIHRoaXMucGF0Y2ggPSAwXG4gICAgICB0aGlzLnByZXJlbGVhc2UgPSBbXVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdtaW5vcic6XG4gICAgICAvLyBJZiB0aGlzIGlzIGEgcHJlLW1pbm9yIHZlcnNpb24sIGJ1bXAgdXAgdG8gdGhlIHNhbWUgbWlub3IgdmVyc2lvbi5cbiAgICAgIC8vIE90aGVyd2lzZSBpbmNyZW1lbnQgbWlub3IuXG4gICAgICAvLyAxLjIuMC01IGJ1bXBzIHRvIDEuMi4wXG4gICAgICAvLyAxLjIuMSBidW1wcyB0byAxLjMuMFxuICAgICAgaWYgKHRoaXMucGF0Y2ggIT09IDAgfHwgdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLm1pbm9yKytcbiAgICAgIH1cbiAgICAgIHRoaXMucGF0Y2ggPSAwXG4gICAgICB0aGlzLnByZXJlbGVhc2UgPSBbXVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdwYXRjaCc6XG4gICAgICAvLyBJZiB0aGlzIGlzIG5vdCBhIHByZS1yZWxlYXNlIHZlcnNpb24sIGl0IHdpbGwgaW5jcmVtZW50IHRoZSBwYXRjaC5cbiAgICAgIC8vIElmIGl0IGlzIGEgcHJlLXJlbGVhc2UgaXQgd2lsbCBidW1wIHVwIHRvIHRoZSBzYW1lIHBhdGNoIHZlcnNpb24uXG4gICAgICAvLyAxLjIuMC01IHBhdGNoZXMgdG8gMS4yLjBcbiAgICAgIC8vIDEuMi4wIHBhdGNoZXMgdG8gMS4yLjFcbiAgICAgIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMucGF0Y2grK1xuICAgICAgfVxuICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW11cbiAgICAgIGJyZWFrXG4gICAgLy8gVGhpcyBwcm9iYWJseSBzaG91bGRuJ3QgYmUgdXNlZCBwdWJsaWNseS5cbiAgICAvLyAxLjAuMCBcInByZVwiIHdvdWxkIGJlY29tZSAxLjAuMC0wIHdoaWNoIGlzIHRoZSB3cm9uZyBkaXJlY3Rpb24uXG4gICAgY2FzZSAncHJlJzpcbiAgICAgIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMucHJlcmVsZWFzZSA9IFswXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLnByZXJlbGVhc2UubGVuZ3RoXG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcmVyZWxlYXNlW2ldID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5wcmVyZWxlYXNlW2ldKytcbiAgICAgICAgICAgIGkgPSAtMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgICAvLyBkaWRuJ3QgaW5jcmVtZW50IGFueXRoaW5nXG4gICAgICAgICAgdGhpcy5wcmVyZWxlYXNlLnB1c2goMClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlkZW50aWZpZXIpIHtcbiAgICAgICAgLy8gMS4yLjAtYmV0YS4xIGJ1bXBzIHRvIDEuMi4wLWJldGEuMixcbiAgICAgICAgLy8gMS4yLjAtYmV0YS5mb29ibHogb3IgMS4yLjAtYmV0YSBidW1wcyB0byAxLjIuMC1iZXRhLjBcbiAgICAgICAgaWYgKHRoaXMucHJlcmVsZWFzZVswXSA9PT0gaWRlbnRpZmllcikge1xuICAgICAgICAgIGlmIChpc05hTih0aGlzLnByZXJlbGVhc2VbMV0pKSB7XG4gICAgICAgICAgICB0aGlzLnByZXJlbGVhc2UgPSBbaWRlbnRpZmllciwgMF1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW2lkZW50aWZpZXIsIDBdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGluY3JlbWVudCBhcmd1bWVudDogJyArIHJlbGVhc2UpXG4gIH1cbiAgdGhpcy5mb3JtYXQoKVxuICB0aGlzLnJhdyA9IHRoaXMudmVyc2lvblxuICByZXR1cm4gdGhpc1xufVxuXG5leHBvcnRzLmluYyA9IGluY1xuZnVuY3Rpb24gaW5jICh2ZXJzaW9uLCByZWxlYXNlLCBsb29zZSwgaWRlbnRpZmllcikge1xuICBpZiAodHlwZW9mIChsb29zZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgaWRlbnRpZmllciA9IGxvb3NlXG4gICAgbG9vc2UgPSB1bmRlZmluZWRcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBTZW1WZXIodmVyc2lvbiwgbG9vc2UpLmluYyhyZWxlYXNlLCBpZGVudGlmaWVyKS52ZXJzaW9uXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnRzLmRpZmYgPSBkaWZmXG5mdW5jdGlvbiBkaWZmICh2ZXJzaW9uMSwgdmVyc2lvbjIpIHtcbiAgaWYgKGVxKHZlcnNpb24xLCB2ZXJzaW9uMikpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9IGVsc2Uge1xuICAgIHZhciB2MSA9IHBhcnNlKHZlcnNpb24xKVxuICAgIHZhciB2MiA9IHBhcnNlKHZlcnNpb24yKVxuICAgIHZhciBwcmVmaXggPSAnJ1xuICAgIGlmICh2MS5wcmVyZWxlYXNlLmxlbmd0aCB8fCB2Mi5wcmVyZWxlYXNlLmxlbmd0aCkge1xuICAgICAgcHJlZml4ID0gJ3ByZSdcbiAgICAgIHZhciBkZWZhdWx0UmVzdWx0ID0gJ3ByZXJlbGVhc2UnXG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiB2MSkge1xuICAgICAgaWYgKGtleSA9PT0gJ21ham9yJyB8fCBrZXkgPT09ICdtaW5vcicgfHwga2V5ID09PSAncGF0Y2gnKSB7XG4gICAgICAgIGlmICh2MVtrZXldICE9PSB2MltrZXldKSB7XG4gICAgICAgICAgcmV0dXJuIHByZWZpeCArIGtleVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0UmVzdWx0IC8vIG1heSBiZSB1bmRlZmluZWRcbiAgfVxufVxuXG5leHBvcnRzLmNvbXBhcmVJZGVudGlmaWVycyA9IGNvbXBhcmVJZGVudGlmaWVyc1xuXG52YXIgbnVtZXJpYyA9IC9eWzAtOV0rJC9cbmZ1bmN0aW9uIGNvbXBhcmVJZGVudGlmaWVycyAoYSwgYikge1xuICB2YXIgYW51bSA9IG51bWVyaWMudGVzdChhKVxuICB2YXIgYm51bSA9IG51bWVyaWMudGVzdChiKVxuXG4gIGlmIChhbnVtICYmIGJudW0pIHtcbiAgICBhID0gK2FcbiAgICBiID0gK2JcbiAgfVxuXG4gIHJldHVybiBhID09PSBiID8gMFxuICAgIDogKGFudW0gJiYgIWJudW0pID8gLTFcbiAgICA6IChibnVtICYmICFhbnVtKSA/IDFcbiAgICA6IGEgPCBiID8gLTFcbiAgICA6IDFcbn1cblxuZXhwb3J0cy5yY29tcGFyZUlkZW50aWZpZXJzID0gcmNvbXBhcmVJZGVudGlmaWVyc1xuZnVuY3Rpb24gcmNvbXBhcmVJZGVudGlmaWVycyAoYSwgYikge1xuICByZXR1cm4gY29tcGFyZUlkZW50aWZpZXJzKGIsIGEpXG59XG5cbmV4cG9ydHMubWFqb3IgPSBtYWpvclxuZnVuY3Rpb24gbWFqb3IgKGEsIGxvb3NlKSB7XG4gIHJldHVybiBuZXcgU2VtVmVyKGEsIGxvb3NlKS5tYWpvclxufVxuXG5leHBvcnRzLm1pbm9yID0gbWlub3JcbmZ1bmN0aW9uIG1pbm9yIChhLCBsb29zZSkge1xuICByZXR1cm4gbmV3IFNlbVZlcihhLCBsb29zZSkubWlub3Jcbn1cblxuZXhwb3J0cy5wYXRjaCA9IHBhdGNoXG5mdW5jdGlvbiBwYXRjaCAoYSwgbG9vc2UpIHtcbiAgcmV0dXJuIG5ldyBTZW1WZXIoYSwgbG9vc2UpLnBhdGNoXG59XG5cbmV4cG9ydHMuY29tcGFyZSA9IGNvbXBhcmVcbmZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBuZXcgU2VtVmVyKGEsIGxvb3NlKS5jb21wYXJlKG5ldyBTZW1WZXIoYiwgbG9vc2UpKVxufVxuXG5leHBvcnRzLmNvbXBhcmVMb29zZSA9IGNvbXBhcmVMb29zZVxuZnVuY3Rpb24gY29tcGFyZUxvb3NlIChhLCBiKSB7XG4gIHJldHVybiBjb21wYXJlKGEsIGIsIHRydWUpXG59XG5cbmV4cG9ydHMuY29tcGFyZUJ1aWxkID0gY29tcGFyZUJ1aWxkXG5mdW5jdGlvbiBjb21wYXJlQnVpbGQgKGEsIGIsIGxvb3NlKSB7XG4gIHZhciB2ZXJzaW9uQSA9IG5ldyBTZW1WZXIoYSwgbG9vc2UpXG4gIHZhciB2ZXJzaW9uQiA9IG5ldyBTZW1WZXIoYiwgbG9vc2UpXG4gIHJldHVybiB2ZXJzaW9uQS5jb21wYXJlKHZlcnNpb25CKSB8fCB2ZXJzaW9uQS5jb21wYXJlQnVpbGQodmVyc2lvbkIpXG59XG5cbmV4cG9ydHMucmNvbXBhcmUgPSByY29tcGFyZVxuZnVuY3Rpb24gcmNvbXBhcmUgKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGIsIGEsIGxvb3NlKVxufVxuXG5leHBvcnRzLnNvcnQgPSBzb3J0XG5mdW5jdGlvbiBzb3J0IChsaXN0LCBsb29zZSkge1xuICByZXR1cm4gbGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY29tcGFyZUJ1aWxkKGEsIGIsIGxvb3NlKVxuICB9KVxufVxuXG5leHBvcnRzLnJzb3J0ID0gcnNvcnRcbmZ1bmN0aW9uIHJzb3J0IChsaXN0LCBsb29zZSkge1xuICByZXR1cm4gbGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY29tcGFyZUJ1aWxkKGIsIGEsIGxvb3NlKVxuICB9KVxufVxuXG5leHBvcnRzLmd0ID0gZ3RcbmZ1bmN0aW9uIGd0IChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPiAwXG59XG5cbmV4cG9ydHMubHQgPSBsdFxuZnVuY3Rpb24gbHQgKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGEsIGIsIGxvb3NlKSA8IDBcbn1cblxuZXhwb3J0cy5lcSA9IGVxXG5mdW5jdGlvbiBlcSAoYSwgYiwgbG9vc2UpIHtcbiAgcmV0dXJuIGNvbXBhcmUoYSwgYiwgbG9vc2UpID09PSAwXG59XG5cbmV4cG9ydHMubmVxID0gbmVxXG5mdW5jdGlvbiBuZXEgKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGEsIGIsIGxvb3NlKSAhPT0gMFxufVxuXG5leHBvcnRzLmd0ZSA9IGd0ZVxuZnVuY3Rpb24gZ3RlIChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPj0gMFxufVxuXG5leHBvcnRzLmx0ZSA9IGx0ZVxuZnVuY3Rpb24gbHRlIChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPD0gMFxufVxuXG5leHBvcnRzLmNtcCA9IGNtcFxuZnVuY3Rpb24gY21wIChhLCBvcCwgYiwgbG9vc2UpIHtcbiAgc3dpdGNoIChvcCkge1xuICAgIGNhc2UgJz09PSc6XG4gICAgICBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKVxuICAgICAgICBhID0gYS52ZXJzaW9uXG4gICAgICBpZiAodHlwZW9mIGIgPT09ICdvYmplY3QnKVxuICAgICAgICBiID0gYi52ZXJzaW9uXG4gICAgICByZXR1cm4gYSA9PT0gYlxuXG4gICAgY2FzZSAnIT09JzpcbiAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpXG4gICAgICAgIGEgPSBhLnZlcnNpb25cbiAgICAgIGlmICh0eXBlb2YgYiA9PT0gJ29iamVjdCcpXG4gICAgICAgIGIgPSBiLnZlcnNpb25cbiAgICAgIHJldHVybiBhICE9PSBiXG5cbiAgICBjYXNlICcnOlxuICAgIGNhc2UgJz0nOlxuICAgIGNhc2UgJz09JzpcbiAgICAgIHJldHVybiBlcShhLCBiLCBsb29zZSlcblxuICAgIGNhc2UgJyE9JzpcbiAgICAgIHJldHVybiBuZXEoYSwgYiwgbG9vc2UpXG5cbiAgICBjYXNlICc+JzpcbiAgICAgIHJldHVybiBndChhLCBiLCBsb29zZSlcblxuICAgIGNhc2UgJz49JzpcbiAgICAgIHJldHVybiBndGUoYSwgYiwgbG9vc2UpXG5cbiAgICBjYXNlICc8JzpcbiAgICAgIHJldHVybiBsdChhLCBiLCBsb29zZSlcblxuICAgIGNhc2UgJzw9JzpcbiAgICAgIHJldHVybiBsdGUoYSwgYiwgbG9vc2UpXG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvcGVyYXRvcjogJyArIG9wKVxuICB9XG59XG5cbmV4cG9ydHMuQ29tcGFyYXRvciA9IENvbXBhcmF0b3JcbmZ1bmN0aW9uIENvbXBhcmF0b3IgKGNvbXAsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zIHx8IHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBsb29zZTogISFvcHRpb25zLFxuICAgICAgaW5jbHVkZVByZXJlbGVhc2U6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbXAgaW5zdGFuY2VvZiBDb21wYXJhdG9yKSB7XG4gICAgaWYgKGNvbXAubG9vc2UgPT09ICEhb3B0aW9ucy5sb29zZSkge1xuICAgICAgcmV0dXJuIGNvbXBcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcCA9IGNvbXAudmFsdWVcbiAgICB9XG4gIH1cblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ29tcGFyYXRvcikpIHtcbiAgICByZXR1cm4gbmV3IENvbXBhcmF0b3IoY29tcCwgb3B0aW9ucylcbiAgfVxuXG4gIGNvbXAgPSBjb21wLnRyaW0oKS5zcGxpdCgvXFxzKy8pLmpvaW4oJyAnKVxuICBkZWJ1ZygnY29tcGFyYXRvcicsIGNvbXAsIG9wdGlvbnMpXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgdGhpcy5sb29zZSA9ICEhb3B0aW9ucy5sb29zZVxuICB0aGlzLnBhcnNlKGNvbXApXG5cbiAgaWYgKHRoaXMuc2VtdmVyID09PSBBTlkpIHtcbiAgICB0aGlzLnZhbHVlID0gJydcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5vcGVyYXRvciArIHRoaXMuc2VtdmVyLnZlcnNpb25cbiAgfVxuXG4gIGRlYnVnKCdjb21wJywgdGhpcylcbn1cblxudmFyIEFOWSA9IHt9XG5Db21wYXJhdG9yLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChjb21wKSB7XG4gIHZhciByID0gdGhpcy5vcHRpb25zLmxvb3NlID8gc2FmZVJlW3QuQ09NUEFSQVRPUkxPT1NFXSA6IHNhZmVSZVt0LkNPTVBBUkFUT1JdXG4gIHZhciBtID0gY29tcC5tYXRjaChyKVxuXG4gIGlmICghbSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY29tcGFyYXRvcjogJyArIGNvbXApXG4gIH1cblxuICB0aGlzLm9wZXJhdG9yID0gbVsxXSAhPT0gdW5kZWZpbmVkID8gbVsxXSA6ICcnXG4gIGlmICh0aGlzLm9wZXJhdG9yID09PSAnPScpIHtcbiAgICB0aGlzLm9wZXJhdG9yID0gJydcbiAgfVxuXG4gIC8vIGlmIGl0IGxpdGVyYWxseSBpcyBqdXN0ICc+JyBvciAnJyB0aGVuIGFsbG93IGFueXRoaW5nLlxuICBpZiAoIW1bMl0pIHtcbiAgICB0aGlzLnNlbXZlciA9IEFOWVxuICB9IGVsc2Uge1xuICAgIHRoaXMuc2VtdmVyID0gbmV3IFNlbVZlcihtWzJdLCB0aGlzLm9wdGlvbnMubG9vc2UpXG4gIH1cbn1cblxuQ29tcGFyYXRvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlXG59XG5cbkNvbXBhcmF0b3IucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbiAodmVyc2lvbikge1xuICBkZWJ1ZygnQ29tcGFyYXRvci50ZXN0JywgdmVyc2lvbiwgdGhpcy5vcHRpb25zLmxvb3NlKVxuXG4gIGlmICh0aGlzLnNlbXZlciA9PT0gQU5ZIHx8IHZlcnNpb24gPT09IEFOWSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAodHlwZW9mIHZlcnNpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZlcnNpb24gPSBuZXcgU2VtVmVyKHZlcnNpb24sIHRoaXMub3B0aW9ucylcbiAgICB9IGNhdGNoIChlcikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNtcCh2ZXJzaW9uLCB0aGlzLm9wZXJhdG9yLCB0aGlzLnNlbXZlciwgdGhpcy5vcHRpb25zKVxufVxuXG5Db21wYXJhdG9yLnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24gKGNvbXAsIG9wdGlvbnMpIHtcbiAgaWYgKCEoY29tcCBpbnN0YW5jZW9mIENvbXBhcmF0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYSBDb21wYXJhdG9yIGlzIHJlcXVpcmVkJylcbiAgfVxuXG4gIGlmICghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgbG9vc2U6ICEhb3B0aW9ucyxcbiAgICAgIGluY2x1ZGVQcmVyZWxlYXNlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHZhciByYW5nZVRtcFxuXG4gIGlmICh0aGlzLm9wZXJhdG9yID09PSAnJykge1xuICAgIGlmICh0aGlzLnZhbHVlID09PSAnJykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmFuZ2VUbXAgPSBuZXcgUmFuZ2UoY29tcC52YWx1ZSwgb3B0aW9ucylcbiAgICByZXR1cm4gc2F0aXNmaWVzKHRoaXMudmFsdWUsIHJhbmdlVG1wLCBvcHRpb25zKVxuICB9IGVsc2UgaWYgKGNvbXAub3BlcmF0b3IgPT09ICcnKSB7XG4gICAgaWYgKGNvbXAudmFsdWUgPT09ICcnKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByYW5nZVRtcCA9IG5ldyBSYW5nZSh0aGlzLnZhbHVlLCBvcHRpb25zKVxuICAgIHJldHVybiBzYXRpc2ZpZXMoY29tcC5zZW12ZXIsIHJhbmdlVG1wLCBvcHRpb25zKVxuICB9XG5cbiAgdmFyIHNhbWVEaXJlY3Rpb25JbmNyZWFzaW5nID1cbiAgICAodGhpcy5vcGVyYXRvciA9PT0gJz49JyB8fCB0aGlzLm9wZXJhdG9yID09PSAnPicpICYmXG4gICAgKGNvbXAub3BlcmF0b3IgPT09ICc+PScgfHwgY29tcC5vcGVyYXRvciA9PT0gJz4nKVxuICB2YXIgc2FtZURpcmVjdGlvbkRlY3JlYXNpbmcgPVxuICAgICh0aGlzLm9wZXJhdG9yID09PSAnPD0nIHx8IHRoaXMub3BlcmF0b3IgPT09ICc8JykgJiZcbiAgICAoY29tcC5vcGVyYXRvciA9PT0gJzw9JyB8fCBjb21wLm9wZXJhdG9yID09PSAnPCcpXG4gIHZhciBzYW1lU2VtVmVyID0gdGhpcy5zZW12ZXIudmVyc2lvbiA9PT0gY29tcC5zZW12ZXIudmVyc2lvblxuICB2YXIgZGlmZmVyZW50RGlyZWN0aW9uc0luY2x1c2l2ZSA9XG4gICAgKHRoaXMub3BlcmF0b3IgPT09ICc+PScgfHwgdGhpcy5vcGVyYXRvciA9PT0gJzw9JykgJiZcbiAgICAoY29tcC5vcGVyYXRvciA9PT0gJz49JyB8fCBjb21wLm9wZXJhdG9yID09PSAnPD0nKVxuICB2YXIgb3Bwb3NpdGVEaXJlY3Rpb25zTGVzc1RoYW4gPVxuICAgIGNtcCh0aGlzLnNlbXZlciwgJzwnLCBjb21wLnNlbXZlciwgb3B0aW9ucykgJiZcbiAgICAoKHRoaXMub3BlcmF0b3IgPT09ICc+PScgfHwgdGhpcy5vcGVyYXRvciA9PT0gJz4nKSAmJlxuICAgIChjb21wLm9wZXJhdG9yID09PSAnPD0nIHx8IGNvbXAub3BlcmF0b3IgPT09ICc8JykpXG4gIHZhciBvcHBvc2l0ZURpcmVjdGlvbnNHcmVhdGVyVGhhbiA9XG4gICAgY21wKHRoaXMuc2VtdmVyLCAnPicsIGNvbXAuc2VtdmVyLCBvcHRpb25zKSAmJlxuICAgICgodGhpcy5vcGVyYXRvciA9PT0gJzw9JyB8fCB0aGlzLm9wZXJhdG9yID09PSAnPCcpICYmXG4gICAgKGNvbXAub3BlcmF0b3IgPT09ICc+PScgfHwgY29tcC5vcGVyYXRvciA9PT0gJz4nKSlcblxuICByZXR1cm4gc2FtZURpcmVjdGlvbkluY3JlYXNpbmcgfHwgc2FtZURpcmVjdGlvbkRlY3JlYXNpbmcgfHxcbiAgICAoc2FtZVNlbVZlciAmJiBkaWZmZXJlbnREaXJlY3Rpb25zSW5jbHVzaXZlKSB8fFxuICAgIG9wcG9zaXRlRGlyZWN0aW9uc0xlc3NUaGFuIHx8IG9wcG9zaXRlRGlyZWN0aW9uc0dyZWF0ZXJUaGFuXG59XG5cbmV4cG9ydHMuUmFuZ2UgPSBSYW5nZVxuZnVuY3Rpb24gUmFuZ2UgKHJhbmdlLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgbG9vc2U6ICEhb3B0aW9ucyxcbiAgICAgIGluY2x1ZGVQcmVyZWxlYXNlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlmIChyYW5nZSBpbnN0YW5jZW9mIFJhbmdlKSB7XG4gICAgaWYgKHJhbmdlLmxvb3NlID09PSAhIW9wdGlvbnMubG9vc2UgJiZcbiAgICAgICAgcmFuZ2UuaW5jbHVkZVByZXJlbGVhc2UgPT09ICEhb3B0aW9ucy5pbmNsdWRlUHJlcmVsZWFzZSkge1xuICAgICAgcmV0dXJuIHJhbmdlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUmFuZ2UocmFuZ2UucmF3LCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIGlmIChyYW5nZSBpbnN0YW5jZW9mIENvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IFJhbmdlKHJhbmdlLnZhbHVlLCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJhbmdlKSkge1xuICAgIHJldHVybiBuZXcgUmFuZ2UocmFuZ2UsIG9wdGlvbnMpXG4gIH1cblxuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIHRoaXMubG9vc2UgPSAhIW9wdGlvbnMubG9vc2VcbiAgdGhpcy5pbmNsdWRlUHJlcmVsZWFzZSA9ICEhb3B0aW9ucy5pbmNsdWRlUHJlcmVsZWFzZVxuXG4gIC8vIEZpcnN0IHJlZHVjZSBhbGwgd2hpdGVzcGFjZSBhcyBtdWNoIGFzIHBvc3NpYmxlIHNvIHdlIGRvIG5vdCBoYXZlIHRvIHJlbHlcbiAgLy8gb24gcG90ZW50aWFsbHkgc2xvdyByZWdleGVzIGxpa2UgXFxzKi4gVGhpcyBpcyB0aGVuIHN0b3JlZCBhbmQgdXNlZCBmb3JcbiAgLy8gZnV0dXJlIGVycm9yIG1lc3NhZ2VzIGFzIHdlbGwuXG4gIHRoaXMucmF3ID0gcmFuZ2VcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KC9cXHMrLylcbiAgICAuam9pbignICcpXG5cbiAgLy8gRmlyc3QsIHNwbGl0IGJhc2VkIG9uIGJvb2xlYW4gb3IgfHxcbiAgdGhpcy5zZXQgPSB0aGlzLnJhdy5zcGxpdCgnfHwnKS5tYXAoZnVuY3Rpb24gKHJhbmdlKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VSYW5nZShyYW5nZS50cmltKCkpXG4gIH0sIHRoaXMpLmZpbHRlcihmdW5jdGlvbiAoYykge1xuICAgIC8vIHRocm93IG91dCBhbnkgdGhhdCBhcmUgbm90IHJlbGV2YW50IGZvciB3aGF0ZXZlciByZWFzb25cbiAgICByZXR1cm4gYy5sZW5ndGhcbiAgfSlcblxuICBpZiAoIXRoaXMuc2V0Lmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgU2VtVmVyIFJhbmdlOiAnICsgdGhpcy5yYXcpXG4gIH1cblxuICB0aGlzLmZvcm1hdCgpXG59XG5cblJhbmdlLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucmFuZ2UgPSB0aGlzLnNldC5tYXAoZnVuY3Rpb24gKGNvbXBzKSB7XG4gICAgcmV0dXJuIGNvbXBzLmpvaW4oJyAnKS50cmltKClcbiAgfSkuam9pbignfHwnKS50cmltKClcbiAgcmV0dXJuIHRoaXMucmFuZ2Vcbn1cblxuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5yYW5nZVxufVxuXG5SYW5nZS5wcm90b3R5cGUucGFyc2VSYW5nZSA9IGZ1bmN0aW9uIChyYW5nZSkge1xuICB2YXIgbG9vc2UgPSB0aGlzLm9wdGlvbnMubG9vc2VcbiAgLy8gYDEuMi4zIC0gMS4yLjRgID0+IGA+PTEuMi4zIDw9MS4yLjRgXG4gIHZhciBociA9IGxvb3NlID8gc2FmZVJlW3QuSFlQSEVOUkFOR0VMT09TRV0gOiBzYWZlUmVbdC5IWVBIRU5SQU5HRV1cbiAgcmFuZ2UgPSByYW5nZS5yZXBsYWNlKGhyLCBoeXBoZW5SZXBsYWNlKVxuICBkZWJ1ZygnaHlwaGVuIHJlcGxhY2UnLCByYW5nZSlcbiAgLy8gYD4gMS4yLjMgPCAxLjIuNWAgPT4gYD4xLjIuMyA8MS4yLjVgXG4gIHJhbmdlID0gcmFuZ2UucmVwbGFjZShzYWZlUmVbdC5DT01QQVJBVE9SVFJJTV0sIGNvbXBhcmF0b3JUcmltUmVwbGFjZSlcbiAgZGVidWcoJ2NvbXBhcmF0b3IgdHJpbScsIHJhbmdlLCBzYWZlUmVbdC5DT01QQVJBVE9SVFJJTV0pXG5cbiAgLy8gYH4gMS4yLjNgID0+IGB+MS4yLjNgXG4gIHJhbmdlID0gcmFuZ2UucmVwbGFjZShzYWZlUmVbdC5USUxERVRSSU1dLCB0aWxkZVRyaW1SZXBsYWNlKVxuXG4gIC8vIGBeIDEuMi4zYCA9PiBgXjEuMi4zYFxuICByYW5nZSA9IHJhbmdlLnJlcGxhY2Uoc2FmZVJlW3QuQ0FSRVRUUklNXSwgY2FyZXRUcmltUmVwbGFjZSlcblxuICAvLyBub3JtYWxpemUgc3BhY2VzXG4gIHJhbmdlID0gcmFuZ2Uuc3BsaXQoL1xccysvKS5qb2luKCcgJylcblxuICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgcmFuZ2UgaXMgY29tcGxldGVseSB0cmltbWVkIGFuZFxuICAvLyByZWFkeSB0byBiZSBzcGxpdCBpbnRvIGNvbXBhcmF0b3JzLlxuXG4gIHZhciBjb21wUmUgPSBsb29zZSA/IHNhZmVSZVt0LkNPTVBBUkFUT1JMT09TRV0gOiBzYWZlUmVbdC5DT01QQVJBVE9SXVxuICB2YXIgc2V0ID0gcmFuZ2Uuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24gKGNvbXApIHtcbiAgICByZXR1cm4gcGFyc2VDb21wYXJhdG9yKGNvbXAsIHRoaXMub3B0aW9ucylcbiAgfSwgdGhpcykuam9pbignICcpLnNwbGl0KC9cXHMrLylcbiAgaWYgKHRoaXMub3B0aW9ucy5sb29zZSkge1xuICAgIC8vIGluIGxvb3NlIG1vZGUsIHRocm93IG91dCBhbnkgdGhhdCBhcmUgbm90IHZhbGlkIGNvbXBhcmF0b3JzXG4gICAgc2V0ID0gc2V0LmZpbHRlcihmdW5jdGlvbiAoY29tcCkge1xuICAgICAgcmV0dXJuICEhY29tcC5tYXRjaChjb21wUmUpXG4gICAgfSlcbiAgfVxuICBzZXQgPSBzZXQubWFwKGZ1bmN0aW9uIChjb21wKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wYXJhdG9yKGNvbXAsIHRoaXMub3B0aW9ucylcbiAgfSwgdGhpcylcblxuICByZXR1cm4gc2V0XG59XG5cblJhbmdlLnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24gKHJhbmdlLCBvcHRpb25zKSB7XG4gIGlmICghKHJhbmdlIGluc3RhbmNlb2YgUmFuZ2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYSBSYW5nZSBpcyByZXF1aXJlZCcpXG4gIH1cblxuICByZXR1cm4gdGhpcy5zZXQuc29tZShmdW5jdGlvbiAodGhpc0NvbXBhcmF0b3JzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzU2F0aXNmaWFibGUodGhpc0NvbXBhcmF0b3JzLCBvcHRpb25zKSAmJlxuICAgICAgcmFuZ2Uuc2V0LnNvbWUoZnVuY3Rpb24gKHJhbmdlQ29tcGFyYXRvcnMpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBpc1NhdGlzZmlhYmxlKHJhbmdlQ29tcGFyYXRvcnMsIG9wdGlvbnMpICYmXG4gICAgICAgICAgdGhpc0NvbXBhcmF0b3JzLmV2ZXJ5KGZ1bmN0aW9uICh0aGlzQ29tcGFyYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmdlQ29tcGFyYXRvcnMuZXZlcnkoZnVuY3Rpb24gKHJhbmdlQ29tcGFyYXRvcikge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc0NvbXBhcmF0b3IuaW50ZXJzZWN0cyhyYW5nZUNvbXBhcmF0b3IsIG9wdGlvbnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgKVxuICB9KVxufVxuXG4vLyB0YWtlIGEgc2V0IG9mIGNvbXBhcmF0b3JzIGFuZCBkZXRlcm1pbmUgd2hldGhlciB0aGVyZVxuLy8gZXhpc3RzIGEgdmVyc2lvbiB3aGljaCBjYW4gc2F0aXNmeSBpdFxuZnVuY3Rpb24gaXNTYXRpc2ZpYWJsZSAoY29tcGFyYXRvcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdCA9IHRydWVcbiAgdmFyIHJlbWFpbmluZ0NvbXBhcmF0b3JzID0gY29tcGFyYXRvcnMuc2xpY2UoKVxuICB2YXIgdGVzdENvbXBhcmF0b3IgPSByZW1haW5pbmdDb21wYXJhdG9ycy5wb3AoKVxuXG4gIHdoaWxlIChyZXN1bHQgJiYgcmVtYWluaW5nQ29tcGFyYXRvcnMubGVuZ3RoKSB7XG4gICAgcmVzdWx0ID0gcmVtYWluaW5nQ29tcGFyYXRvcnMuZXZlcnkoZnVuY3Rpb24gKG90aGVyQ29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHRlc3RDb21wYXJhdG9yLmludGVyc2VjdHMob3RoZXJDb21wYXJhdG9yLCBvcHRpb25zKVxuICAgIH0pXG5cbiAgICB0ZXN0Q29tcGFyYXRvciA9IHJlbWFpbmluZ0NvbXBhcmF0b3JzLnBvcCgpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8vIE1vc3RseSBqdXN0IGZvciB0ZXN0aW5nIGFuZCBsZWdhY3kgQVBJIHJlYXNvbnNcbmV4cG9ydHMudG9Db21wYXJhdG9ycyA9IHRvQ29tcGFyYXRvcnNcbmZ1bmN0aW9uIHRvQ29tcGFyYXRvcnMgKHJhbmdlLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgUmFuZ2UocmFuZ2UsIG9wdGlvbnMpLnNldC5tYXAoZnVuY3Rpb24gKGNvbXApIHtcbiAgICByZXR1cm4gY29tcC5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjLnZhbHVlXG4gICAgfSkuam9pbignICcpLnRyaW0oKS5zcGxpdCgnICcpXG4gIH0pXG59XG5cbi8vIGNvbXByaXNlZCBvZiB4cmFuZ2VzLCB0aWxkZXMsIHN0YXJzLCBhbmQgZ3RsdCdzIGF0IHRoaXMgcG9pbnQuXG4vLyBhbHJlYWR5IHJlcGxhY2VkIHRoZSBoeXBoZW4gcmFuZ2VzXG4vLyB0dXJuIGludG8gYSBzZXQgb2YgSlVTVCBjb21wYXJhdG9ycy5cbmZ1bmN0aW9uIHBhcnNlQ29tcGFyYXRvciAoY29tcCwgb3B0aW9ucykge1xuICBkZWJ1ZygnY29tcCcsIGNvbXAsIG9wdGlvbnMpXG4gIGNvbXAgPSByZXBsYWNlQ2FyZXRzKGNvbXAsIG9wdGlvbnMpXG4gIGRlYnVnKCdjYXJldCcsIGNvbXApXG4gIGNvbXAgPSByZXBsYWNlVGlsZGVzKGNvbXAsIG9wdGlvbnMpXG4gIGRlYnVnKCd0aWxkZXMnLCBjb21wKVxuICBjb21wID0gcmVwbGFjZVhSYW5nZXMoY29tcCwgb3B0aW9ucylcbiAgZGVidWcoJ3hyYW5nZScsIGNvbXApXG4gIGNvbXAgPSByZXBsYWNlU3RhcnMoY29tcCwgb3B0aW9ucylcbiAgZGVidWcoJ3N0YXJzJywgY29tcClcbiAgcmV0dXJuIGNvbXBcbn1cblxuZnVuY3Rpb24gaXNYIChpZCkge1xuICByZXR1cm4gIWlkIHx8IGlkLnRvTG93ZXJDYXNlKCkgPT09ICd4JyB8fCBpZCA9PT0gJyonXG59XG5cbi8vIH4sIH4+IC0tPiAqIChhbnksIGtpbmRhIHNpbGx5KVxuLy8gfjIsIH4yLngsIH4yLngueCwgfj4yLCB+PjIueCB+PjIueC54IC0tPiA+PTIuMC4wIDwzLjAuMFxuLy8gfjIuMCwgfjIuMC54LCB+PjIuMCwgfj4yLjAueCAtLT4gPj0yLjAuMCA8Mi4xLjBcbi8vIH4xLjIsIH4xLjIueCwgfj4xLjIsIH4+MS4yLnggLS0+ID49MS4yLjAgPDEuMy4wXG4vLyB+MS4yLjMsIH4+MS4yLjMgLS0+ID49MS4yLjMgPDEuMy4wXG4vLyB+MS4yLjAsIH4+MS4yLjAgLS0+ID49MS4yLjAgPDEuMy4wXG5mdW5jdGlvbiByZXBsYWNlVGlsZGVzIChjb21wLCBvcHRpb25zKSB7XG4gIHJldHVybiBjb21wLnRyaW0oKS5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbiAoY29tcCkge1xuICAgIHJldHVybiByZXBsYWNlVGlsZGUoY29tcCwgb3B0aW9ucylcbiAgfSkuam9pbignICcpXG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VUaWxkZSAoY29tcCwgb3B0aW9ucykge1xuICB2YXIgciA9IG9wdGlvbnMubG9vc2UgPyBzYWZlUmVbdC5USUxERUxPT1NFXSA6IHNhZmVSZVt0LlRJTERFXVxuICByZXR1cm4gY29tcC5yZXBsYWNlKHIsIGZ1bmN0aW9uIChfLCBNLCBtLCBwLCBwcikge1xuICAgIGRlYnVnKCd0aWxkZScsIGNvbXAsIF8sIE0sIG0sIHAsIHByKVxuICAgIHZhciByZXRcblxuICAgIGlmIChpc1goTSkpIHtcbiAgICAgIHJldCA9ICcnXG4gICAgfSBlbHNlIGlmIChpc1gobSkpIHtcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4wLjAgPCcgKyAoK00gKyAxKSArICcuMC4wJ1xuICAgIH0gZWxzZSBpZiAoaXNYKHApKSB7XG4gICAgICAvLyB+MS4yID09ID49MS4yLjAgPDEuMy4wXG4gICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLjAgPCcgKyBNICsgJy4nICsgKCttICsgMSkgKyAnLjAnXG4gICAgfSBlbHNlIGlmIChwcikge1xuICAgICAgZGVidWcoJ3JlcGxhY2VUaWxkZSBwcicsIHByKVxuICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArICctJyArIHByICtcbiAgICAgICAgICAgICcgPCcgKyBNICsgJy4nICsgKCttICsgMSkgKyAnLjAnXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIH4xLjIuMyA9PSA+PTEuMi4zIDwxLjMuMFxuICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArXG4gICAgICAgICAgICAnIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJ1xuICAgIH1cblxuICAgIGRlYnVnKCd0aWxkZSByZXR1cm4nLCByZXQpXG4gICAgcmV0dXJuIHJldFxuICB9KVxufVxuXG4vLyBeIC0tPiAqIChhbnksIGtpbmRhIHNpbGx5KVxuLy8gXjIsIF4yLngsIF4yLngueCAtLT4gPj0yLjAuMCA8My4wLjBcbi8vIF4yLjAsIF4yLjAueCAtLT4gPj0yLjAuMCA8My4wLjBcbi8vIF4xLjIsIF4xLjIueCAtLT4gPj0xLjIuMCA8Mi4wLjBcbi8vIF4xLjIuMyAtLT4gPj0xLjIuMyA8Mi4wLjBcbi8vIF4xLjIuMCAtLT4gPj0xLjIuMCA8Mi4wLjBcbmZ1bmN0aW9uIHJlcGxhY2VDYXJldHMgKGNvbXAsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNvbXAudHJpbSgpLnNwbGl0KC9cXHMrLykubWFwKGZ1bmN0aW9uIChjb21wKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VDYXJldChjb21wLCBvcHRpb25zKVxuICB9KS5qb2luKCcgJylcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUNhcmV0IChjb21wLCBvcHRpb25zKSB7XG4gIGRlYnVnKCdjYXJldCcsIGNvbXAsIG9wdGlvbnMpXG4gIHZhciByID0gb3B0aW9ucy5sb29zZSA/IHNhZmVSZVt0LkNBUkVUTE9PU0VdIDogc2FmZVJlW3QuQ0FSRVRdXG4gIHJldHVybiBjb21wLnJlcGxhY2UociwgZnVuY3Rpb24gKF8sIE0sIG0sIHAsIHByKSB7XG4gICAgZGVidWcoJ2NhcmV0JywgY29tcCwgXywgTSwgbSwgcCwgcHIpXG4gICAgdmFyIHJldFxuXG4gICAgaWYgKGlzWChNKSkge1xuICAgICAgcmV0ID0gJydcbiAgICB9IGVsc2UgaWYgKGlzWChtKSkge1xuICAgICAgcmV0ID0gJz49JyArIE0gKyAnLjAuMCA8JyArICgrTSArIDEpICsgJy4wLjAnXG4gICAgfSBlbHNlIGlmIChpc1gocCkpIHtcbiAgICAgIGlmIChNID09PSAnMCcpIHtcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4wIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4wIDwnICsgKCtNICsgMSkgKyAnLjAuMCdcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHByKSB7XG4gICAgICBkZWJ1ZygncmVwbGFjZUNhcmV0IHByJywgcHIpXG4gICAgICBpZiAoTSA9PT0gJzAnKSB7XG4gICAgICAgIGlmIChtID09PSAnMCcpIHtcbiAgICAgICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLicgKyBwICsgJy0nICsgcHIgK1xuICAgICAgICAgICAgICAgICcgPCcgKyBNICsgJy4nICsgbSArICcuJyArICgrcCArIDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArICctJyArIHByICtcbiAgICAgICAgICAgICAgICAnIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJ1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLicgKyBwICsgJy0nICsgcHIgK1xuICAgICAgICAgICAgICAnIDwnICsgKCtNICsgMSkgKyAnLjAuMCdcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWcoJ25vIHByJylcbiAgICAgIGlmIChNID09PSAnMCcpIHtcbiAgICAgICAgaWYgKG0gPT09ICcwJykge1xuICAgICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgK1xuICAgICAgICAgICAgICAgICcgPCcgKyBNICsgJy4nICsgbSArICcuJyArICgrcCArIDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArXG4gICAgICAgICAgICAgICAgJyA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCdcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArXG4gICAgICAgICAgICAgICcgPCcgKyAoK00gKyAxKSArICcuMC4wJ1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKCdjYXJldCByZXR1cm4nLCByZXQpXG4gICAgcmV0dXJuIHJldFxuICB9KVxufVxuXG5mdW5jdGlvbiByZXBsYWNlWFJhbmdlcyAoY29tcCwgb3B0aW9ucykge1xuICBkZWJ1ZygncmVwbGFjZVhSYW5nZXMnLCBjb21wLCBvcHRpb25zKVxuICByZXR1cm4gY29tcC5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbiAoY29tcCkge1xuICAgIHJldHVybiByZXBsYWNlWFJhbmdlKGNvbXAsIG9wdGlvbnMpXG4gIH0pLmpvaW4oJyAnKVxufVxuXG5mdW5jdGlvbiByZXBsYWNlWFJhbmdlIChjb21wLCBvcHRpb25zKSB7XG4gIGNvbXAgPSBjb21wLnRyaW0oKVxuICB2YXIgciA9IG9wdGlvbnMubG9vc2UgPyBzYWZlUmVbdC5YUkFOR0VMT09TRV0gOiBzYWZlUmVbdC5YUkFOR0VdXG4gIHJldHVybiBjb21wLnJlcGxhY2UociwgZnVuY3Rpb24gKHJldCwgZ3RsdCwgTSwgbSwgcCwgcHIpIHtcbiAgICBkZWJ1ZygneFJhbmdlJywgY29tcCwgcmV0LCBndGx0LCBNLCBtLCBwLCBwcilcbiAgICB2YXIgeE0gPSBpc1goTSlcbiAgICB2YXIgeG0gPSB4TSB8fCBpc1gobSlcbiAgICB2YXIgeHAgPSB4bSB8fCBpc1gocClcbiAgICB2YXIgYW55WCA9IHhwXG5cbiAgICBpZiAoZ3RsdCA9PT0gJz0nICYmIGFueVgpIHtcbiAgICAgIGd0bHQgPSAnJ1xuICAgIH1cblxuICAgIC8vIGlmIHdlJ3JlIGluY2x1ZGluZyBwcmVyZWxlYXNlcyBpbiB0aGUgbWF0Y2gsIHRoZW4gd2UgbmVlZFxuICAgIC8vIHRvIGZpeCB0aGlzIHRvIC0wLCB0aGUgbG93ZXN0IHBvc3NpYmxlIHByZXJlbGVhc2UgdmFsdWVcbiAgICBwciA9IG9wdGlvbnMuaW5jbHVkZVByZXJlbGVhc2UgPyAnLTAnIDogJydcblxuICAgIGlmICh4TSkge1xuICAgICAgaWYgKGd0bHQgPT09ICc+JyB8fCBndGx0ID09PSAnPCcpIHtcbiAgICAgICAgLy8gbm90aGluZyBpcyBhbGxvd2VkXG4gICAgICAgIHJldCA9ICc8MC4wLjAtMCdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaXMgZm9yYmlkZGVuXG4gICAgICAgIHJldCA9ICcqJ1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZ3RsdCAmJiBhbnlYKSB7XG4gICAgICAvLyB3ZSBrbm93IHBhdGNoIGlzIGFuIHgsIGJlY2F1c2Ugd2UgaGF2ZSBhbnkgeCBhdCBhbGwuXG4gICAgICAvLyByZXBsYWNlIFggd2l0aCAwXG4gICAgICBpZiAoeG0pIHtcbiAgICAgICAgbSA9IDBcbiAgICAgIH1cbiAgICAgIHAgPSAwXG5cbiAgICAgIGlmIChndGx0ID09PSAnPicpIHtcbiAgICAgICAgLy8gPjEgPT4gPj0yLjAuMFxuICAgICAgICAvLyA+MS4yID0+ID49MS4zLjBcbiAgICAgICAgLy8gPjEuMi4zID0+ID49IDEuMi40XG4gICAgICAgIGd0bHQgPSAnPj0nXG4gICAgICAgIGlmICh4bSkge1xuICAgICAgICAgIE0gPSArTSArIDFcbiAgICAgICAgICBtID0gMFxuICAgICAgICAgIHAgPSAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbSA9ICttICsgMVxuICAgICAgICAgIHAgPSAwXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZ3RsdCA9PT0gJzw9Jykge1xuICAgICAgICAvLyA8PTAuNy54IGlzIGFjdHVhbGx5IDwwLjguMCwgc2luY2UgYW55IDAuNy54IHNob3VsZFxuICAgICAgICAvLyBwYXNzLiAgU2ltaWxhcmx5LCA8PTcueCBpcyBhY3R1YWxseSA8OC4wLjAsIGV0Yy5cbiAgICAgICAgZ3RsdCA9ICc8J1xuICAgICAgICBpZiAoeG0pIHtcbiAgICAgICAgICBNID0gK00gKyAxXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbSA9ICttICsgMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9IGd0bHQgKyBNICsgJy4nICsgbSArICcuJyArIHAgKyBwclxuICAgIH0gZWxzZSBpZiAoeG0pIHtcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4wLjAnICsgcHIgKyAnIDwnICsgKCtNICsgMSkgKyAnLjAuMCcgKyBwclxuICAgIH0gZWxzZSBpZiAoeHApIHtcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuMCcgKyBwciArXG4gICAgICAgICcgPCcgKyBNICsgJy4nICsgKCttICsgMSkgKyAnLjAnICsgcHJcbiAgICB9XG5cbiAgICBkZWJ1ZygneFJhbmdlIHJldHVybicsIHJldClcblxuICAgIHJldHVybiByZXRcbiAgfSlcbn1cblxuLy8gQmVjYXVzZSAqIGlzIEFORC1lZCB3aXRoIGV2ZXJ5dGhpbmcgZWxzZSBpbiB0aGUgY29tcGFyYXRvcixcbi8vIGFuZCAnJyBtZWFucyBcImFueSB2ZXJzaW9uXCIsIGp1c3QgcmVtb3ZlIHRoZSAqcyBlbnRpcmVseS5cbmZ1bmN0aW9uIHJlcGxhY2VTdGFycyAoY29tcCwgb3B0aW9ucykge1xuICBkZWJ1ZygncmVwbGFjZVN0YXJzJywgY29tcCwgb3B0aW9ucylcbiAgLy8gTG9vc2VuZXNzIGlzIGlnbm9yZWQgaGVyZS4gIHN0YXIgaXMgYWx3YXlzIGFzIGxvb3NlIGFzIGl0IGdldHMhXG4gIHJldHVybiBjb21wLnRyaW0oKS5yZXBsYWNlKHNhZmVSZVt0LlNUQVJdLCAnJylcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBpcyBwYXNzZWQgdG8gc3RyaW5nLnJlcGxhY2UocmVbdC5IWVBIRU5SQU5HRV0pXG4vLyBNLCBtLCBwYXRjaCwgcHJlcmVsZWFzZSwgYnVpbGRcbi8vIDEuMiAtIDMuNC41ID0+ID49MS4yLjAgPD0zLjQuNVxuLy8gMS4yLjMgLSAzLjQgPT4gPj0xLjIuMCA8My41LjAgQW55IDMuNC54IHdpbGwgZG9cbi8vIDEuMiAtIDMuNCA9PiA+PTEuMi4wIDwzLjUuMFxuZnVuY3Rpb24gaHlwaGVuUmVwbGFjZSAoJDAsXG4gIGZyb20sIGZNLCBmbSwgZnAsIGZwciwgZmIsXG4gIHRvLCB0TSwgdG0sIHRwLCB0cHIsIHRiKSB7XG4gIGlmIChpc1goZk0pKSB7XG4gICAgZnJvbSA9ICcnXG4gIH0gZWxzZSBpZiAoaXNYKGZtKSkge1xuICAgIGZyb20gPSAnPj0nICsgZk0gKyAnLjAuMCdcbiAgfSBlbHNlIGlmIChpc1goZnApKSB7XG4gICAgZnJvbSA9ICc+PScgKyBmTSArICcuJyArIGZtICsgJy4wJ1xuICB9IGVsc2Uge1xuICAgIGZyb20gPSAnPj0nICsgZnJvbVxuICB9XG5cbiAgaWYgKGlzWCh0TSkpIHtcbiAgICB0byA9ICcnXG4gIH0gZWxzZSBpZiAoaXNYKHRtKSkge1xuICAgIHRvID0gJzwnICsgKCt0TSArIDEpICsgJy4wLjAnXG4gIH0gZWxzZSBpZiAoaXNYKHRwKSkge1xuICAgIHRvID0gJzwnICsgdE0gKyAnLicgKyAoK3RtICsgMSkgKyAnLjAnXG4gIH0gZWxzZSBpZiAodHByKSB7XG4gICAgdG8gPSAnPD0nICsgdE0gKyAnLicgKyB0bSArICcuJyArIHRwICsgJy0nICsgdHByXG4gIH0gZWxzZSB7XG4gICAgdG8gPSAnPD0nICsgdG9cbiAgfVxuXG4gIHJldHVybiAoZnJvbSArICcgJyArIHRvKS50cmltKClcbn1cblxuLy8gaWYgQU5ZIG9mIHRoZSBzZXRzIG1hdGNoIEFMTCBvZiBpdHMgY29tcGFyYXRvcnMsIHRoZW4gcGFzc1xuUmFuZ2UucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbiAodmVyc2lvbikge1xuICBpZiAoIXZlcnNpb24pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmVyc2lvbiA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgdmVyc2lvbiA9IG5ldyBTZW1WZXIodmVyc2lvbiwgdGhpcy5vcHRpb25zKVxuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRlc3RTZXQodGhpcy5zZXRbaV0sIHZlcnNpb24sIHRoaXMub3B0aW9ucykpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiB0ZXN0U2V0IChzZXQsIHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIXNldFtpXS50ZXN0KHZlcnNpb24pKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpZiAodmVyc2lvbi5wcmVyZWxlYXNlLmxlbmd0aCAmJiAhb3B0aW9ucy5pbmNsdWRlUHJlcmVsZWFzZSkge1xuICAgIC8vIEZpbmQgdGhlIHNldCBvZiB2ZXJzaW9ucyB0aGF0IGFyZSBhbGxvd2VkIHRvIGhhdmUgcHJlcmVsZWFzZXNcbiAgICAvLyBGb3IgZXhhbXBsZSwgXjEuMi4zLXByLjEgZGVzdWdhcnMgdG8gPj0xLjIuMy1wci4xIDwyLjAuMFxuICAgIC8vIFRoYXQgc2hvdWxkIGFsbG93IGAxLjIuMy1wci4yYCB0byBwYXNzLlxuICAgIC8vIEhvd2V2ZXIsIGAxLjIuNC1hbHBoYS5ub3RyZWFkeWAgc2hvdWxkIE5PVCBiZSBhbGxvd2VkLFxuICAgIC8vIGV2ZW4gdGhvdWdoIGl0J3Mgd2l0aGluIHRoZSByYW5nZSBzZXQgYnkgdGhlIGNvbXBhcmF0b3JzLlxuICAgIGZvciAoaSA9IDA7IGkgPCBzZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRlYnVnKHNldFtpXS5zZW12ZXIpXG4gICAgICBpZiAoc2V0W2ldLnNlbXZlciA9PT0gQU5ZKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRbaV0uc2VtdmVyLnByZXJlbGVhc2UubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgYWxsb3dlZCA9IHNldFtpXS5zZW12ZXJcbiAgICAgICAgaWYgKGFsbG93ZWQubWFqb3IgPT09IHZlcnNpb24ubWFqb3IgJiZcbiAgICAgICAgICAgIGFsbG93ZWQubWlub3IgPT09IHZlcnNpb24ubWlub3IgJiZcbiAgICAgICAgICAgIGFsbG93ZWQucGF0Y2ggPT09IHZlcnNpb24ucGF0Y2gpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmVyc2lvbiBoYXMgYSAtcHJlLCBidXQgaXQncyBub3Qgb25lIG9mIHRoZSBvbmVzIHdlIGxpa2UuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnRzLnNhdGlzZmllcyA9IHNhdGlzZmllc1xuZnVuY3Rpb24gc2F0aXNmaWVzICh2ZXJzaW9uLCByYW5nZSwgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJhbmdlID0gbmV3IFJhbmdlKHJhbmdlLCBvcHRpb25zKVxuICB9IGNhdGNoIChlcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiByYW5nZS50ZXN0KHZlcnNpb24pXG59XG5cbmV4cG9ydHMubWF4U2F0aXNmeWluZyA9IG1heFNhdGlzZnlpbmdcbmZ1bmN0aW9uIG1heFNhdGlzZnlpbmcgKHZlcnNpb25zLCByYW5nZSwgb3B0aW9ucykge1xuICB2YXIgbWF4ID0gbnVsbFxuICB2YXIgbWF4U1YgPSBudWxsXG4gIHRyeSB7XG4gICAgdmFyIHJhbmdlT2JqID0gbmV3IFJhbmdlKHJhbmdlLCBvcHRpb25zKVxuICB9IGNhdGNoIChlcikge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgdmVyc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgIGlmIChyYW5nZU9iai50ZXN0KHYpKSB7XG4gICAgICAvLyBzYXRpc2ZpZXModiwgcmFuZ2UsIG9wdGlvbnMpXG4gICAgICBpZiAoIW1heCB8fCBtYXhTVi5jb21wYXJlKHYpID09PSAtMSkge1xuICAgICAgICAvLyBjb21wYXJlKG1heCwgdiwgdHJ1ZSlcbiAgICAgICAgbWF4ID0gdlxuICAgICAgICBtYXhTViA9IG5ldyBTZW1WZXIobWF4LCBvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG1heFxufVxuXG5leHBvcnRzLm1pblNhdGlzZnlpbmcgPSBtaW5TYXRpc2Z5aW5nXG5mdW5jdGlvbiBtaW5TYXRpc2Z5aW5nICh2ZXJzaW9ucywgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgdmFyIG1pbiA9IG51bGxcbiAgdmFyIG1pblNWID0gbnVsbFxuICB0cnkge1xuICAgIHZhciByYW5nZU9iaiA9IG5ldyBSYW5nZShyYW5nZSwgb3B0aW9ucylcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHZlcnNpb25zLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAocmFuZ2VPYmoudGVzdCh2KSkge1xuICAgICAgLy8gc2F0aXNmaWVzKHYsIHJhbmdlLCBvcHRpb25zKVxuICAgICAgaWYgKCFtaW4gfHwgbWluU1YuY29tcGFyZSh2KSA9PT0gMSkge1xuICAgICAgICAvLyBjb21wYXJlKG1pbiwgdiwgdHJ1ZSlcbiAgICAgICAgbWluID0gdlxuICAgICAgICBtaW5TViA9IG5ldyBTZW1WZXIobWluLCBvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG1pblxufVxuXG5leHBvcnRzLm1pblZlcnNpb24gPSBtaW5WZXJzaW9uXG5mdW5jdGlvbiBtaW5WZXJzaW9uIChyYW5nZSwgbG9vc2UpIHtcbiAgcmFuZ2UgPSBuZXcgUmFuZ2UocmFuZ2UsIGxvb3NlKVxuXG4gIHZhciBtaW52ZXIgPSBuZXcgU2VtVmVyKCcwLjAuMCcpXG4gIGlmIChyYW5nZS50ZXN0KG1pbnZlcikpIHtcbiAgICByZXR1cm4gbWludmVyXG4gIH1cblxuICBtaW52ZXIgPSBuZXcgU2VtVmVyKCcwLjAuMC0wJylcbiAgaWYgKHJhbmdlLnRlc3QobWludmVyKSkge1xuICAgIHJldHVybiBtaW52ZXJcbiAgfVxuXG4gIG1pbnZlciA9IG51bGxcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZS5zZXQubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgY29tcGFyYXRvcnMgPSByYW5nZS5zZXRbaV1cblxuICAgIGNvbXBhcmF0b3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbXBhcmF0b3IpIHtcbiAgICAgIC8vIENsb25lIHRvIGF2b2lkIG1hbmlwdWxhdGluZyB0aGUgY29tcGFyYXRvcidzIHNlbXZlciBvYmplY3QuXG4gICAgICB2YXIgY29tcHZlciA9IG5ldyBTZW1WZXIoY29tcGFyYXRvci5zZW12ZXIudmVyc2lvbilcbiAgICAgIHN3aXRjaCAoY29tcGFyYXRvci5vcGVyYXRvcikge1xuICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICBpZiAoY29tcHZlci5wcmVyZWxlYXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29tcHZlci5wYXRjaCsrXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXB2ZXIucHJlcmVsZWFzZS5wdXNoKDApXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbXB2ZXIucmF3ID0gY29tcHZlci5mb3JtYXQoKVxuICAgICAgICAgIC8qIGZhbGx0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgIGNhc2UgJz49JzpcbiAgICAgICAgICBpZiAoIW1pbnZlciB8fCBndChtaW52ZXIsIGNvbXB2ZXIpKSB7XG4gICAgICAgICAgICBtaW52ZXIgPSBjb21wdmVyXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJzwnOlxuICAgICAgICBjYXNlICc8PSc6XG4gICAgICAgICAgLyogSWdub3JlIG1heGltdW0gdmVyc2lvbnMgKi9cbiAgICAgICAgICBicmVha1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBvcGVyYXRpb246ICcgKyBjb21wYXJhdG9yLm9wZXJhdG9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAobWludmVyICYmIHJhbmdlLnRlc3QobWludmVyKSkge1xuICAgIHJldHVybiBtaW52ZXJcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydHMudmFsaWRSYW5nZSA9IHZhbGlkUmFuZ2VcbmZ1bmN0aW9uIHZhbGlkUmFuZ2UgKHJhbmdlLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgLy8gUmV0dXJuICcqJyBpbnN0ZWFkIG9mICcnIHNvIHRoYXQgdHJ1dGhpbmVzcyB3b3Jrcy5cbiAgICAvLyBUaGlzIHdpbGwgdGhyb3cgaWYgaXQncyBpbnZhbGlkIGFueXdheVxuICAgIHJldHVybiBuZXcgUmFuZ2UocmFuZ2UsIG9wdGlvbnMpLnJhbmdlIHx8ICcqJ1xuICB9IGNhdGNoIChlcikge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gRGV0ZXJtaW5lIGlmIHZlcnNpb24gaXMgbGVzcyB0aGFuIGFsbCB0aGUgdmVyc2lvbnMgcG9zc2libGUgaW4gdGhlIHJhbmdlXG5leHBvcnRzLmx0ciA9IGx0clxuZnVuY3Rpb24gbHRyICh2ZXJzaW9uLCByYW5nZSwgb3B0aW9ucykge1xuICByZXR1cm4gb3V0c2lkZSh2ZXJzaW9uLCByYW5nZSwgJzwnLCBvcHRpb25zKVxufVxuXG4vLyBEZXRlcm1pbmUgaWYgdmVyc2lvbiBpcyBncmVhdGVyIHRoYW4gYWxsIHRoZSB2ZXJzaW9ucyBwb3NzaWJsZSBpbiB0aGUgcmFuZ2UuXG5leHBvcnRzLmd0ciA9IGd0clxuZnVuY3Rpb24gZ3RyICh2ZXJzaW9uLCByYW5nZSwgb3B0aW9ucykge1xuICByZXR1cm4gb3V0c2lkZSh2ZXJzaW9uLCByYW5nZSwgJz4nLCBvcHRpb25zKVxufVxuXG5leHBvcnRzLm91dHNpZGUgPSBvdXRzaWRlXG5mdW5jdGlvbiBvdXRzaWRlICh2ZXJzaW9uLCByYW5nZSwgaGlsbywgb3B0aW9ucykge1xuICB2ZXJzaW9uID0gbmV3IFNlbVZlcih2ZXJzaW9uLCBvcHRpb25zKVxuICByYW5nZSA9IG5ldyBSYW5nZShyYW5nZSwgb3B0aW9ucylcblxuICB2YXIgZ3RmbiwgbHRlZm4sIGx0Zm4sIGNvbXAsIGVjb21wXG4gIHN3aXRjaCAoaGlsbykge1xuICAgIGNhc2UgJz4nOlxuICAgICAgZ3RmbiA9IGd0XG4gICAgICBsdGVmbiA9IGx0ZVxuICAgICAgbHRmbiA9IGx0XG4gICAgICBjb21wID0gJz4nXG4gICAgICBlY29tcCA9ICc+PSdcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnPCc6XG4gICAgICBndGZuID0gbHRcbiAgICAgIGx0ZWZuID0gZ3RlXG4gICAgICBsdGZuID0gZ3RcbiAgICAgIGNvbXAgPSAnPCdcbiAgICAgIGVjb21wID0gJzw9J1xuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTXVzdCBwcm92aWRlIGEgaGlsbyB2YWwgb2YgXCI8XCIgb3IgXCI+XCInKVxuICB9XG5cbiAgLy8gSWYgaXQgc2F0aXNpZmVzIHRoZSByYW5nZSBpdCBpcyBub3Qgb3V0c2lkZVxuICBpZiAoc2F0aXNmaWVzKHZlcnNpb24sIHJhbmdlLCBvcHRpb25zKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gRnJvbSBub3cgb24sIHZhcmlhYmxlIHRlcm1zIGFyZSBhcyBpZiB3ZSdyZSBpbiBcImd0clwiIG1vZGUuXG4gIC8vIGJ1dCBub3RlIHRoYXQgZXZlcnl0aGluZyBpcyBmbGlwcGVkIGZvciB0aGUgXCJsdHJcIiBmdW5jdGlvbi5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlLnNldC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBjb21wYXJhdG9ycyA9IHJhbmdlLnNldFtpXVxuXG4gICAgdmFyIGhpZ2ggPSBudWxsXG4gICAgdmFyIGxvdyA9IG51bGxcblxuICAgIGNvbXBhcmF0b3JzLmZvckVhY2goZnVuY3Rpb24gKGNvbXBhcmF0b3IpIHtcbiAgICAgIGlmIChjb21wYXJhdG9yLnNlbXZlciA9PT0gQU5ZKSB7XG4gICAgICAgIGNvbXBhcmF0b3IgPSBuZXcgQ29tcGFyYXRvcignPj0wLjAuMCcpXG4gICAgICB9XG4gICAgICBoaWdoID0gaGlnaCB8fCBjb21wYXJhdG9yXG4gICAgICBsb3cgPSBsb3cgfHwgY29tcGFyYXRvclxuICAgICAgaWYgKGd0Zm4oY29tcGFyYXRvci5zZW12ZXIsIGhpZ2guc2VtdmVyLCBvcHRpb25zKSkge1xuICAgICAgICBoaWdoID0gY29tcGFyYXRvclxuICAgICAgfSBlbHNlIGlmIChsdGZuKGNvbXBhcmF0b3Iuc2VtdmVyLCBsb3cuc2VtdmVyLCBvcHRpb25zKSkge1xuICAgICAgICBsb3cgPSBjb21wYXJhdG9yXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIElmIHRoZSBlZGdlIHZlcnNpb24gY29tcGFyYXRvciBoYXMgYSBvcGVyYXRvciB0aGVuIG91ciB2ZXJzaW9uXG4gICAgLy8gaXNuJ3Qgb3V0c2lkZSBpdFxuICAgIGlmIChoaWdoLm9wZXJhdG9yID09PSBjb21wIHx8IGhpZ2gub3BlcmF0b3IgPT09IGVjb21wKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbG93ZXN0IHZlcnNpb24gY29tcGFyYXRvciBoYXMgYW4gb3BlcmF0b3IgYW5kIG91ciB2ZXJzaW9uXG4gICAgLy8gaXMgbGVzcyB0aGFuIGl0IHRoZW4gaXQgaXNuJ3QgaGlnaGVyIHRoYW4gdGhlIHJhbmdlXG4gICAgaWYgKCghbG93Lm9wZXJhdG9yIHx8IGxvdy5vcGVyYXRvciA9PT0gY29tcCkgJiZcbiAgICAgICAgbHRlZm4odmVyc2lvbiwgbG93LnNlbXZlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSBpZiAobG93Lm9wZXJhdG9yID09PSBlY29tcCAmJiBsdGZuKHZlcnNpb24sIGxvdy5zZW12ZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0cy5wcmVyZWxlYXNlID0gcHJlcmVsZWFzZVxuZnVuY3Rpb24gcHJlcmVsZWFzZSAodmVyc2lvbiwgb3B0aW9ucykge1xuICB2YXIgcGFyc2VkID0gcGFyc2UodmVyc2lvbiwgb3B0aW9ucylcbiAgcmV0dXJuIChwYXJzZWQgJiYgcGFyc2VkLnByZXJlbGVhc2UubGVuZ3RoKSA/IHBhcnNlZC5wcmVyZWxlYXNlIDogbnVsbFxufVxuXG5leHBvcnRzLmludGVyc2VjdHMgPSBpbnRlcnNlY3RzXG5mdW5jdGlvbiBpbnRlcnNlY3RzIChyMSwgcjIsIG9wdGlvbnMpIHtcbiAgcjEgPSBuZXcgUmFuZ2UocjEsIG9wdGlvbnMpXG4gIHIyID0gbmV3IFJhbmdlKHIyLCBvcHRpb25zKVxuICByZXR1cm4gcjEuaW50ZXJzZWN0cyhyMilcbn1cblxuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2VcbmZ1bmN0aW9uIGNvZXJjZSAodmVyc2lvbiwgb3B0aW9ucykge1xuICBpZiAodmVyc2lvbiBpbnN0YW5jZW9mIFNlbVZlcikge1xuICAgIHJldHVybiB2ZXJzaW9uXG4gIH1cblxuICBpZiAodHlwZW9mIHZlcnNpb24gPT09ICdudW1iZXInKSB7XG4gICAgdmVyc2lvbiA9IFN0cmluZyh2ZXJzaW9uKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2ZXJzaW9uICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIHZhciBtYXRjaCA9IG51bGxcbiAgaWYgKCFvcHRpb25zLnJ0bCkge1xuICAgIG1hdGNoID0gdmVyc2lvbi5tYXRjaChzYWZlUmVbdC5DT0VSQ0VdKVxuICB9IGVsc2Uge1xuICAgIC8vIEZpbmQgdGhlIHJpZ2h0LW1vc3QgY29lcmNpYmxlIHN0cmluZyB0aGF0IGRvZXMgbm90IHNoYXJlXG4gICAgLy8gYSB0ZXJtaW51cyB3aXRoIGEgbW9yZSBsZWZ0LXdhcmQgY29lcmNpYmxlIHN0cmluZy5cbiAgICAvLyBFZywgJzEuMi4zLjQnIHdhbnRzIHRvIGNvZXJjZSAnMi4zLjQnLCBub3QgJzMuNCcgb3IgJzQnXG4gICAgLy9cbiAgICAvLyBXYWxrIHRocm91Z2ggdGhlIHN0cmluZyBjaGVja2luZyB3aXRoIGEgL2cgcmVnZXhwXG4gICAgLy8gTWFudWFsbHkgc2V0IHRoZSBpbmRleCBzbyBhcyB0byBwaWNrIHVwIG92ZXJsYXBwaW5nIG1hdGNoZXMuXG4gICAgLy8gU3RvcCB3aGVuIHdlIGdldCBhIG1hdGNoIHRoYXQgZW5kcyBhdCB0aGUgc3RyaW5nIGVuZCwgc2luY2Ugbm9cbiAgICAvLyBjb2VyY2libGUgc3RyaW5nIGNhbiBiZSBtb3JlIHJpZ2h0LXdhcmQgd2l0aG91dCB0aGUgc2FtZSB0ZXJtaW51cy5cbiAgICB2YXIgbmV4dFxuICAgIHdoaWxlICgobmV4dCA9IHNhZmVSZVt0LkNPRVJDRVJUTF0uZXhlYyh2ZXJzaW9uKSkgJiZcbiAgICAgICghbWF0Y2ggfHwgbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggIT09IHZlcnNpb24ubGVuZ3RoKVxuICAgICkge1xuICAgICAgaWYgKCFtYXRjaCB8fFxuICAgICAgICAgIG5leHQuaW5kZXggKyBuZXh0WzBdLmxlbmd0aCAhPT0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpIHtcbiAgICAgICAgbWF0Y2ggPSBuZXh0XG4gICAgICB9XG4gICAgICBzYWZlUmVbdC5DT0VSQ0VSVExdLmxhc3RJbmRleCA9IG5leHQuaW5kZXggKyBuZXh0WzFdLmxlbmd0aCArIG5leHRbMl0ubGVuZ3RoXG4gICAgfVxuICAgIC8vIGxlYXZlIGl0IGluIGEgY2xlYW4gc3RhdGVcbiAgICBzYWZlUmVbdC5DT0VSQ0VSVExdLmxhc3RJbmRleCA9IC0xXG4gIH1cblxuICBpZiAobWF0Y2ggPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIHBhcnNlKG1hdGNoWzJdICtcbiAgICAnLicgKyAobWF0Y2hbM10gfHwgJzAnKSArXG4gICAgJy4nICsgKG1hdGNoWzRdIHx8ICcwJyksIG9wdGlvbnMpXG59XG4iLCIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFlhbGxpc3QpIHtcbiAgWWFsbGlzdC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKiAoKSB7XG4gICAgZm9yIChsZXQgd2Fsa2VyID0gdGhpcy5oZWFkOyB3YWxrZXI7IHdhbGtlciA9IHdhbGtlci5uZXh0KSB7XG4gICAgICB5aWVsZCB3YWxrZXIudmFsdWVcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSBZYWxsaXN0XG5cbllhbGxpc3QuTm9kZSA9IE5vZGVcbllhbGxpc3QuY3JlYXRlID0gWWFsbGlzdFxuXG5mdW5jdGlvbiBZYWxsaXN0IChsaXN0KSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoIShzZWxmIGluc3RhbmNlb2YgWWFsbGlzdCkpIHtcbiAgICBzZWxmID0gbmV3IFlhbGxpc3QoKVxuICB9XG5cbiAgc2VsZi50YWlsID0gbnVsbFxuICBzZWxmLmhlYWQgPSBudWxsXG4gIHNlbGYubGVuZ3RoID0gMFxuXG4gIGlmIChsaXN0ICYmIHR5cGVvZiBsaXN0LmZvckVhY2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHNlbGYucHVzaChpdGVtKVxuICAgIH0pXG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHNlbGYucHVzaChhcmd1bWVudHNbaV0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNlbGZcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUucmVtb3ZlTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIGlmIChub2RlLmxpc3QgIT09IHRoaXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92aW5nIG5vZGUgd2hpY2ggZG9lcyBub3QgYmVsb25nIHRvIHRoaXMgbGlzdCcpXG4gIH1cblxuICB2YXIgbmV4dCA9IG5vZGUubmV4dFxuICB2YXIgcHJldiA9IG5vZGUucHJldlxuXG4gIGlmIChuZXh0KSB7XG4gICAgbmV4dC5wcmV2ID0gcHJldlxuICB9XG5cbiAgaWYgKHByZXYpIHtcbiAgICBwcmV2Lm5leHQgPSBuZXh0XG4gIH1cblxuICBpZiAobm9kZSA9PT0gdGhpcy5oZWFkKSB7XG4gICAgdGhpcy5oZWFkID0gbmV4dFxuICB9XG4gIGlmIChub2RlID09PSB0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwgPSBwcmV2XG4gIH1cblxuICBub2RlLmxpc3QubGVuZ3RoLS1cbiAgbm9kZS5uZXh0ID0gbnVsbFxuICBub2RlLnByZXYgPSBudWxsXG4gIG5vZGUubGlzdCA9IG51bGxcblxuICByZXR1cm4gbmV4dFxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS51bnNoaWZ0Tm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIGlmIChub2RlID09PSB0aGlzLmhlYWQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChub2RlLmxpc3QpIHtcbiAgICBub2RlLmxpc3QucmVtb3ZlTm9kZShub2RlKVxuICB9XG5cbiAgdmFyIGhlYWQgPSB0aGlzLmhlYWRcbiAgbm9kZS5saXN0ID0gdGhpc1xuICBub2RlLm5leHQgPSBoZWFkXG4gIGlmIChoZWFkKSB7XG4gICAgaGVhZC5wcmV2ID0gbm9kZVxuICB9XG5cbiAgdGhpcy5oZWFkID0gbm9kZVxuICBpZiAoIXRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbCA9IG5vZGVcbiAgfVxuICB0aGlzLmxlbmd0aCsrXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnB1c2hOb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IHRoaXMudGFpbCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKG5vZGUubGlzdCkge1xuICAgIG5vZGUubGlzdC5yZW1vdmVOb2RlKG5vZGUpXG4gIH1cblxuICB2YXIgdGFpbCA9IHRoaXMudGFpbFxuICBub2RlLmxpc3QgPSB0aGlzXG4gIG5vZGUucHJldiA9IHRhaWxcbiAgaWYgKHRhaWwpIHtcbiAgICB0YWlsLm5leHQgPSBub2RlXG4gIH1cblxuICB0aGlzLnRhaWwgPSBub2RlXG4gIGlmICghdGhpcy5oZWFkKSB7XG4gICAgdGhpcy5oZWFkID0gbm9kZVxuICB9XG4gIHRoaXMubGVuZ3RoKytcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgcHVzaCh0aGlzLCBhcmd1bWVudHNbaV0pXG4gIH1cbiAgcmV0dXJuIHRoaXMubGVuZ3RoXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHVuc2hpZnQodGhpcywgYXJndW1lbnRzW2ldKVxuICB9XG4gIHJldHVybiB0aGlzLmxlbmd0aFxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy50YWlsKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgdmFyIHJlcyA9IHRoaXMudGFpbC52YWx1ZVxuICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwucHJldlxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5leHQgPSBudWxsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5oZWFkID0gbnVsbFxuICB9XG4gIHRoaXMubGVuZ3RoLS1cbiAgcmV0dXJuIHJlc1xufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCF0aGlzLmhlYWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICB2YXIgcmVzID0gdGhpcy5oZWFkLnZhbHVlXG4gIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0XG4gIGlmICh0aGlzLmhlYWQpIHtcbiAgICB0aGlzLmhlYWQucHJldiA9IG51bGxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRhaWwgPSBudWxsXG4gIH1cbiAgdGhpcy5sZW5ndGgtLVxuICByZXR1cm4gcmVzXG59XG5cbllhbGxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoZm4sIHRoaXNwKSB7XG4gIHRoaXNwID0gdGhpc3AgfHwgdGhpc1xuICBmb3IgKHZhciB3YWxrZXIgPSB0aGlzLmhlYWQsIGkgPSAwOyB3YWxrZXIgIT09IG51bGw7IGkrKykge1xuICAgIGZuLmNhbGwodGhpc3AsIHdhbGtlci52YWx1ZSwgaSwgdGhpcylcbiAgICB3YWxrZXIgPSB3YWxrZXIubmV4dFxuICB9XG59XG5cbllhbGxpc3QucHJvdG90eXBlLmZvckVhY2hSZXZlcnNlID0gZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICB0aGlzcCA9IHRoaXNwIHx8IHRoaXNcbiAgZm9yICh2YXIgd2Fsa2VyID0gdGhpcy50YWlsLCBpID0gdGhpcy5sZW5ndGggLSAxOyB3YWxrZXIgIT09IG51bGw7IGktLSkge1xuICAgIGZuLmNhbGwodGhpc3AsIHdhbGtlci52YWx1ZSwgaSwgdGhpcylcbiAgICB3YWxrZXIgPSB3YWxrZXIucHJldlxuICB9XG59XG5cbllhbGxpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuKSB7XG4gIGZvciAodmFyIGkgPSAwLCB3YWxrZXIgPSB0aGlzLmhlYWQ7IHdhbGtlciAhPT0gbnVsbCAmJiBpIDwgbjsgaSsrKSB7XG4gICAgLy8gYWJvcnQgb3V0IG9mIHRoZSBsaXN0IGVhcmx5IGlmIHdlIGhpdCBhIGN5Y2xlXG4gICAgd2Fsa2VyID0gd2Fsa2VyLm5leHRcbiAgfVxuICBpZiAoaSA9PT0gbiAmJiB3YWxrZXIgIT09IG51bGwpIHtcbiAgICByZXR1cm4gd2Fsa2VyLnZhbHVlXG4gIH1cbn1cblxuWWFsbGlzdC5wcm90b3R5cGUuZ2V0UmV2ZXJzZSA9IGZ1bmN0aW9uIChuKSB7XG4gIGZvciAodmFyIGkgPSAwLCB3YWxrZXIgPSB0aGlzLnRhaWw7IHdhbGtlciAhPT0gbnVsbCAmJiBpIDwgbjsgaSsrKSB7XG4gICAgLy8gYWJvcnQgb3V0IG9mIHRoZSBsaXN0IGVhcmx5IGlmIHdlIGhpdCBhIGN5Y2xlXG4gICAgd2Fsa2VyID0gd2Fsa2VyLnByZXZcbiAgfVxuICBpZiAoaSA9PT0gbiAmJiB3YWxrZXIgIT09IG51bGwpIHtcbiAgICByZXR1cm4gd2Fsa2VyLnZhbHVlXG4gIH1cbn1cblxuWWFsbGlzdC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICB0aGlzcCA9IHRoaXNwIHx8IHRoaXNcbiAgdmFyIHJlcyA9IG5ldyBZYWxsaXN0KClcbiAgZm9yICh2YXIgd2Fsa2VyID0gdGhpcy5oZWFkOyB3YWxrZXIgIT09IG51bGw7KSB7XG4gICAgcmVzLnB1c2goZm4uY2FsbCh0aGlzcCwgd2Fsa2VyLnZhbHVlLCB0aGlzKSlcbiAgICB3YWxrZXIgPSB3YWxrZXIubmV4dFxuICB9XG4gIHJldHVybiByZXNcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUubWFwUmV2ZXJzZSA9IGZ1bmN0aW9uIChmbiwgdGhpc3ApIHtcbiAgdGhpc3AgPSB0aGlzcCB8fCB0aGlzXG4gIHZhciByZXMgPSBuZXcgWWFsbGlzdCgpXG4gIGZvciAodmFyIHdhbGtlciA9IHRoaXMudGFpbDsgd2Fsa2VyICE9PSBudWxsOykge1xuICAgIHJlcy5wdXNoKGZuLmNhbGwodGhpc3AsIHdhbGtlci52YWx1ZSwgdGhpcykpXG4gICAgd2Fsa2VyID0gd2Fsa2VyLnByZXZcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChmbiwgaW5pdGlhbCkge1xuICB2YXIgYWNjXG4gIHZhciB3YWxrZXIgPSB0aGlzLmhlYWRcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgYWNjID0gaW5pdGlhbFxuICB9IGVsc2UgaWYgKHRoaXMuaGVhZCkge1xuICAgIHdhbGtlciA9IHRoaXMuaGVhZC5uZXh0XG4gICAgYWNjID0gdGhpcy5oZWFkLnZhbHVlXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGxpc3Qgd2l0aCBubyBpbml0aWFsIHZhbHVlJylcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyB3YWxrZXIgIT09IG51bGw7IGkrKykge1xuICAgIGFjYyA9IGZuKGFjYywgd2Fsa2VyLnZhbHVlLCBpKVxuICAgIHdhbGtlciA9IHdhbGtlci5uZXh0XG4gIH1cblxuICByZXR1cm4gYWNjXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnJlZHVjZVJldmVyc2UgPSBmdW5jdGlvbiAoZm4sIGluaXRpYWwpIHtcbiAgdmFyIGFjY1xuICB2YXIgd2Fsa2VyID0gdGhpcy50YWlsXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgIGFjYyA9IGluaXRpYWxcbiAgfSBlbHNlIGlmICh0aGlzLnRhaWwpIHtcbiAgICB3YWxrZXIgPSB0aGlzLnRhaWwucHJldlxuICAgIGFjYyA9IHRoaXMudGFpbC52YWx1ZVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBsaXN0IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpXG4gIH1cblxuICBmb3IgKHZhciBpID0gdGhpcy5sZW5ndGggLSAxOyB3YWxrZXIgIT09IG51bGw7IGktLSkge1xuICAgIGFjYyA9IGZuKGFjYywgd2Fsa2VyLnZhbHVlLCBpKVxuICAgIHdhbGtlciA9IHdhbGtlci5wcmV2XG4gIH1cblxuICByZXR1cm4gYWNjXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcnIgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwLCB3YWxrZXIgPSB0aGlzLmhlYWQ7IHdhbGtlciAhPT0gbnVsbDsgaSsrKSB7XG4gICAgYXJyW2ldID0gd2Fsa2VyLnZhbHVlXG4gICAgd2Fsa2VyID0gd2Fsa2VyLm5leHRcbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnRvQXJyYXlSZXZlcnNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXJyID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMCwgd2Fsa2VyID0gdGhpcy50YWlsOyB3YWxrZXIgIT09IG51bGw7IGkrKykge1xuICAgIGFycltpXSA9IHdhbGtlci52YWx1ZVxuICAgIHdhbGtlciA9IHdhbGtlci5wcmV2XG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICB0byA9IHRvIHx8IHRoaXMubGVuZ3RoXG4gIGlmICh0byA8IDApIHtcbiAgICB0byArPSB0aGlzLmxlbmd0aFxuICB9XG4gIGZyb20gPSBmcm9tIHx8IDBcbiAgaWYgKGZyb20gPCAwKSB7XG4gICAgZnJvbSArPSB0aGlzLmxlbmd0aFxuICB9XG4gIHZhciByZXQgPSBuZXcgWWFsbGlzdCgpXG4gIGlmICh0byA8IGZyb20gfHwgdG8gPCAwKSB7XG4gICAgcmV0dXJuIHJldFxuICB9XG4gIGlmIChmcm9tIDwgMCkge1xuICAgIGZyb20gPSAwXG4gIH1cbiAgaWYgKHRvID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0byA9IHRoaXMubGVuZ3RoXG4gIH1cbiAgZm9yICh2YXIgaSA9IDAsIHdhbGtlciA9IHRoaXMuaGVhZDsgd2Fsa2VyICE9PSBudWxsICYmIGkgPCBmcm9tOyBpKyspIHtcbiAgICB3YWxrZXIgPSB3YWxrZXIubmV4dFxuICB9XG4gIGZvciAoOyB3YWxrZXIgIT09IG51bGwgJiYgaSA8IHRvOyBpKyssIHdhbGtlciA9IHdhbGtlci5uZXh0KSB7XG4gICAgcmV0LnB1c2god2Fsa2VyLnZhbHVlKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUuc2xpY2VSZXZlcnNlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gIHRvID0gdG8gfHwgdGhpcy5sZW5ndGhcbiAgaWYgKHRvIDwgMCkge1xuICAgIHRvICs9IHRoaXMubGVuZ3RoXG4gIH1cbiAgZnJvbSA9IGZyb20gfHwgMFxuICBpZiAoZnJvbSA8IDApIHtcbiAgICBmcm9tICs9IHRoaXMubGVuZ3RoXG4gIH1cbiAgdmFyIHJldCA9IG5ldyBZYWxsaXN0KClcbiAgaWYgKHRvIDwgZnJvbSB8fCB0byA8IDApIHtcbiAgICByZXR1cm4gcmV0XG4gIH1cbiAgaWYgKGZyb20gPCAwKSB7XG4gICAgZnJvbSA9IDBcbiAgfVxuICBpZiAodG8gPiB0aGlzLmxlbmd0aCkge1xuICAgIHRvID0gdGhpcy5sZW5ndGhcbiAgfVxuICBmb3IgKHZhciBpID0gdGhpcy5sZW5ndGgsIHdhbGtlciA9IHRoaXMudGFpbDsgd2Fsa2VyICE9PSBudWxsICYmIGkgPiB0bzsgaS0tKSB7XG4gICAgd2Fsa2VyID0gd2Fsa2VyLnByZXZcbiAgfVxuICBmb3IgKDsgd2Fsa2VyICE9PSBudWxsICYmIGkgPiBmcm9tOyBpLS0sIHdhbGtlciA9IHdhbGtlci5wcmV2KSB7XG4gICAgcmV0LnB1c2god2Fsa2VyLnZhbHVlKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUuc3BsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBkZWxldGVDb3VudCAvKiwgLi4ubm9kZXMgKi8pIHtcbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICBzdGFydCA9IHRoaXMubGVuZ3RoIC0gMVxuICB9XG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IHRoaXMubGVuZ3RoICsgc3RhcnQ7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgd2Fsa2VyID0gdGhpcy5oZWFkOyB3YWxrZXIgIT09IG51bGwgJiYgaSA8IHN0YXJ0OyBpKyspIHtcbiAgICB3YWxrZXIgPSB3YWxrZXIubmV4dFxuICB9XG5cbiAgdmFyIHJldCA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyB3YWxrZXIgJiYgaSA8IGRlbGV0ZUNvdW50OyBpKyspIHtcbiAgICByZXQucHVzaCh3YWxrZXIudmFsdWUpXG4gICAgd2Fsa2VyID0gdGhpcy5yZW1vdmVOb2RlKHdhbGtlcilcbiAgfVxuICBpZiAod2Fsa2VyID09PSBudWxsKSB7XG4gICAgd2Fsa2VyID0gdGhpcy50YWlsXG4gIH1cblxuICBpZiAod2Fsa2VyICE9PSB0aGlzLmhlYWQgJiYgd2Fsa2VyICE9PSB0aGlzLnRhaWwpIHtcbiAgICB3YWxrZXIgPSB3YWxrZXIucHJldlxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB3YWxrZXIgPSBpbnNlcnQodGhpcywgd2Fsa2VyLCBhcmd1bWVudHNbaV0pXG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWQgPSB0aGlzLmhlYWRcbiAgdmFyIHRhaWwgPSB0aGlzLnRhaWxcbiAgZm9yICh2YXIgd2Fsa2VyID0gaGVhZDsgd2Fsa2VyICE9PSBudWxsOyB3YWxrZXIgPSB3YWxrZXIucHJldikge1xuICAgIHZhciBwID0gd2Fsa2VyLnByZXZcbiAgICB3YWxrZXIucHJldiA9IHdhbGtlci5uZXh0XG4gICAgd2Fsa2VyLm5leHQgPSBwXG4gIH1cbiAgdGhpcy5oZWFkID0gdGFpbFxuICB0aGlzLnRhaWwgPSBoZWFkXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIGluc2VydCAoc2VsZiwgbm9kZSwgdmFsdWUpIHtcbiAgdmFyIGluc2VydGVkID0gbm9kZSA9PT0gc2VsZi5oZWFkID9cbiAgICBuZXcgTm9kZSh2YWx1ZSwgbnVsbCwgbm9kZSwgc2VsZikgOlxuICAgIG5ldyBOb2RlKHZhbHVlLCBub2RlLCBub2RlLm5leHQsIHNlbGYpXG5cbiAgaWYgKGluc2VydGVkLm5leHQgPT09IG51bGwpIHtcbiAgICBzZWxmLnRhaWwgPSBpbnNlcnRlZFxuICB9XG4gIGlmIChpbnNlcnRlZC5wcmV2ID09PSBudWxsKSB7XG4gICAgc2VsZi5oZWFkID0gaW5zZXJ0ZWRcbiAgfVxuXG4gIHNlbGYubGVuZ3RoKytcblxuICByZXR1cm4gaW5zZXJ0ZWRcbn1cblxuZnVuY3Rpb24gcHVzaCAoc2VsZiwgaXRlbSkge1xuICBzZWxmLnRhaWwgPSBuZXcgTm9kZShpdGVtLCBzZWxmLnRhaWwsIG51bGwsIHNlbGYpXG4gIGlmICghc2VsZi5oZWFkKSB7XG4gICAgc2VsZi5oZWFkID0gc2VsZi50YWlsXG4gIH1cbiAgc2VsZi5sZW5ndGgrK1xufVxuXG5mdW5jdGlvbiB1bnNoaWZ0IChzZWxmLCBpdGVtKSB7XG4gIHNlbGYuaGVhZCA9IG5ldyBOb2RlKGl0ZW0sIG51bGwsIHNlbGYuaGVhZCwgc2VsZilcbiAgaWYgKCFzZWxmLnRhaWwpIHtcbiAgICBzZWxmLnRhaWwgPSBzZWxmLmhlYWRcbiAgfVxuICBzZWxmLmxlbmd0aCsrXG59XG5cbmZ1bmN0aW9uIE5vZGUgKHZhbHVlLCBwcmV2LCBuZXh0LCBsaXN0KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgIHJldHVybiBuZXcgTm9kZSh2YWx1ZSwgcHJldiwgbmV4dCwgbGlzdClcbiAgfVxuXG4gIHRoaXMubGlzdCA9IGxpc3RcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG5cbiAgaWYgKHByZXYpIHtcbiAgICBwcmV2Lm5leHQgPSB0aGlzXG4gICAgdGhpcy5wcmV2ID0gcHJldlxuICB9IGVsc2Uge1xuICAgIHRoaXMucHJldiA9IG51bGxcbiAgfVxuXG4gIGlmIChuZXh0KSB7XG4gICAgbmV4dC5wcmV2ID0gdGhpc1xuICAgIHRoaXMubmV4dCA9IG5leHRcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm5leHQgPSBudWxsXG4gIH1cbn1cblxudHJ5IHtcbiAgLy8gYWRkIGlmIHN1cHBvcnQgZm9yIFN5bWJvbC5pdGVyYXRvciBpcyBwcmVzZW50XG4gIHJlcXVpcmUoJy4vaXRlcmF0b3IuanMnKShZYWxsaXN0KVxufSBjYXRjaCAoZXIpIHt9XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKiAoaWdub3JlZCkgKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2RhdGEvbmF0aXZlLW1vZHVsZXMuanNvblwiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vZGF0YS9wbHVnaW5zLmpzb25cIik7XG4iLCJpbXBvcnQge1xuICBpc0Jyb3dzZXJzUXVlcnlWYWxpZCxcbiAgVGFyZ2V0TmFtZXMsXG59IGZyb20gXCJAYmFiZWwvaGVscGVyLWNvbXBpbGF0aW9uLXRhcmdldHNcIjtcblxuaW1wb3J0IHR5cGUge1xuICBDb25maWdGaWxlU2VhcmNoLFxuICBCYWJlbHJjU2VhcmNoLFxuICBJZ25vcmVMaXN0LFxuICBJZ25vcmVJdGVtLFxuICBQbHVnaW5MaXN0LFxuICBQbHVnaW5JdGVtLFxuICBQbHVnaW5UYXJnZXQsXG4gIENvbmZpZ0FwcGxpY2FibGVUZXN0LFxuICBTb3VyY2VNYXBzT3B0aW9uLFxuICBTb3VyY2VUeXBlT3B0aW9uLFxuICBDb21wYWN0T3B0aW9uLFxuICBSb290SW5wdXRTb3VyY2VNYXBPcHRpb24sXG4gIE5lc3RpbmdQYXRoLFxuICBDYWxsZXJNZXRhZGF0YSxcbiAgUm9vdE1vZGUsXG4gIFRhcmdldHNMaXN0T3JPYmplY3QsXG4gIEFzc3VtcHRpb25OYW1lLFxufSBmcm9tIFwiLi9vcHRpb25zLnRzXCI7XG5cbmltcG9ydCB7IGFzc3VtcHRpb25zTmFtZXMgfSBmcm9tIFwiLi9vcHRpb25zLnRzXCI7XG5cbmV4cG9ydCB0eXBlIHsgUm9vdFBhdGggfSBmcm9tIFwiLi9vcHRpb25zLnRzXCI7XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRvclNldCA9IHtcbiAgW25hbWU6IHN0cmluZ106IFZhbGlkYXRvcjxhbnk+O1xufTtcblxuZXhwb3J0IHR5cGUgVmFsaWRhdG9yPFQ+ID0gKGxvYzogT3B0aW9uUGF0aCwgdmFsdWU6IHVua25vd24pID0+IFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBtc2cobG9jOiBOZXN0aW5nUGF0aCB8IEdlbmVyYWxQYXRoKTogc3RyaW5nIHtcbiAgc3dpdGNoIChsb2MudHlwZSkge1xuICAgIGNhc2UgXCJyb290XCI6XG4gICAgICByZXR1cm4gYGA7XG4gICAgY2FzZSBcImVudlwiOlxuICAgICAgcmV0dXJuIGAke21zZyhsb2MucGFyZW50KX0uZW52W1wiJHtsb2MubmFtZX1cIl1gO1xuICAgIGNhc2UgXCJvdmVycmlkZXNcIjpcbiAgICAgIHJldHVybiBgJHttc2cobG9jLnBhcmVudCl9Lm92ZXJyaWRlc1ske2xvYy5pbmRleH1dYDtcbiAgICBjYXNlIFwib3B0aW9uXCI6XG4gICAgICByZXR1cm4gYCR7bXNnKGxvYy5wYXJlbnQpfS4ke2xvYy5uYW1lfWA7XG4gICAgY2FzZSBcImFjY2Vzc1wiOlxuICAgICAgcmV0dXJuIGAke21zZyhsb2MucGFyZW50KX1bJHtKU09OLnN0cmluZ2lmeShsb2MubmFtZSl9XWA7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3Igc2hvdWxkIG5vdCBoYXBwZW4gd2hlbiBjb2RlIGlzIHR5cGUgY2hlY2tlZFxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NlcnRpb24gZmFpbHVyZTogVW5rbm93biB0eXBlICR7bG9jLnR5cGV9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjY2Vzcyhsb2M6IEdlbmVyYWxQYXRoLCBuYW1lOiBzdHJpbmcgfCBudW1iZXIpOiBBY2Nlc3NQYXRoIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBcImFjY2Vzc1wiLFxuICAgIG5hbWUsXG4gICAgcGFyZW50OiBsb2MsXG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIE9wdGlvblBhdGggPSBSZWFkb25seTx7XG4gIHR5cGU6IFwib3B0aW9uXCI7XG4gIG5hbWU6IHN0cmluZztcbiAgcGFyZW50OiBOZXN0aW5nUGF0aDtcbn0+O1xudHlwZSBBY2Nlc3NQYXRoID0gUmVhZG9ubHk8e1xuICB0eXBlOiBcImFjY2Vzc1wiO1xuICBuYW1lOiBzdHJpbmcgfCBudW1iZXI7XG4gIHBhcmVudDogR2VuZXJhbFBhdGg7XG59PjtcbnR5cGUgR2VuZXJhbFBhdGggPSBPcHRpb25QYXRoIHwgQWNjZXNzUGF0aDtcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFJvb3RNb2RlKFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogUm9vdE1vZGUgfCB2b2lkIHtcbiAgaWYgKFxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICB2YWx1ZSAhPT0gXCJyb290XCIgJiZcbiAgICB2YWx1ZSAhPT0gXCJ1cHdhcmRcIiAmJlxuICAgIHZhbHVlICE9PSBcInVwd2FyZC1vcHRpb25hbFwiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIGEgXCJyb290XCIsIFwidXB3YXJkXCIsIFwidXB3YXJkLW9wdGlvbmFsXCIgb3IgdW5kZWZpbmVkYCxcbiAgICApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFNvdXJjZU1hcHMoXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd24sXG4pOiBTb3VyY2VNYXBzT3B0aW9uIHwgdm9pZCB7XG4gIGlmIChcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJlxuICAgIHZhbHVlICE9PSBcImlubGluZVwiICYmXG4gICAgdmFsdWUgIT09IFwiYm90aFwiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIGEgYm9vbGVhbiwgXCJpbmxpbmVcIiwgXCJib3RoXCIsIG9yIHVuZGVmaW5lZGAsXG4gICAgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDb21wYWN0KFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogQ29tcGFjdE9wdGlvbiB8IHZvaWQge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiICYmIHZhbHVlICE9PSBcImF1dG9cIikge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhIGJvb2xlYW4sIFwiYXV0b1wiLCBvciB1bmRlZmluZWRgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRTb3VyY2VUeXBlKFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogU291cmNlVHlwZU9wdGlvbiB8IHZvaWQge1xuICBpZiAoXG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgIHZhbHVlICE9PSBcIm1vZHVsZVwiICYmXG4gICAgdmFsdWUgIT09IFwic2NyaXB0XCIgJiZcbiAgICB2YWx1ZSAhPT0gXCJ1bmFtYmlndW91c1wiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIFwibW9kdWxlXCIsIFwic2NyaXB0XCIsIFwidW5hbWJpZ3VvdXNcIiwgb3IgdW5kZWZpbmVkYCxcbiAgICApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydENhbGxlck1ldGFkYXRhKFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogQ2FsbGVyTWV0YWRhdGEgfCB1bmRlZmluZWQge1xuICBjb25zdCBvYmogPSBhc3NlcnRPYmplY3QobG9jLCB2YWx1ZSk7XG4gIGlmIChvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iai5uYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21zZyhsb2MpfSBzZXQgYnV0IGRvZXMgbm90IGNvbnRhaW4gXCJuYW1lXCIgcHJvcGVydHkgc3RyaW5nYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wIG9mIE9iamVjdC5rZXlzKG9iaikpIHtcbiAgICAgIGNvbnN0IHByb3BMb2MgPSBhY2Nlc3MobG9jLCBwcm9wKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gb2JqW3Byb3BdO1xuICAgICAgaWYgKFxuICAgICAgICB2YWx1ZSAhPSBudWxsICYmXG4gICAgICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJib29sZWFuXCIgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJudW1iZXJcIlxuICAgICAgKSB7XG4gICAgICAgIC8vIE5PVEUobG9nYW4pOiBJJ20gbGltaXRpbmcgdGhlIHR5cGUgaGVyZSBzbyB0aGF0IHdlIGNhbiBndWFyYW50ZWUgdGhhdFxuICAgICAgICAvLyB0aGUgXCJjYWxsZXJcIiB2YWx1ZSB3aWxsIHNlcmlhbGl6ZSB0byBKU09OIG5pY2VseS4gV2UgY2FuIGFsd2F5c1xuICAgICAgICAvLyBhbGxvdyBtb3JlIGNvbXBsZXggc3RydWN0dXJlcyBsYXRlciB0aG91Z2guXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHttc2coXG4gICAgICAgICAgICBwcm9wTG9jLFxuICAgICAgICAgICl9IG11c3QgYmUgbnVsbCwgdW5kZWZpbmVkLCBhIGJvb2xlYW4sIGEgc3RyaW5nLCBvciBhIG51bWJlci5gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvZG8oZmxvdy0+dHMpXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydElucHV0U291cmNlTWFwKFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogUm9vdElucHV0U291cmNlTWFwT3B0aW9uIHtcbiAgaWYgKFxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiICYmXG4gICAgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCAhdmFsdWUpXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhIGJvb2xlYW4sIG9iamVjdCwgb3IgdW5kZWZpbmVkYCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlIGFzIFJvb3RJbnB1dFNvdXJjZU1hcE9wdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFN0cmluZyhsb2M6IEdlbmVyYWxQYXRoLCB2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IHZvaWQge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBzdHJpbmcsIG9yIHVuZGVmaW5lZGApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEZ1bmN0aW9uKFxuICBsb2M6IEdlbmVyYWxQYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IEZ1bmN0aW9uIHwgdm9pZCB7XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBtdXN0IGJlIGEgZnVuY3Rpb24sIG9yIHVuZGVmaW5lZGApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEJvb2xlYW4oXG4gIGxvYzogR2VuZXJhbFBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogYm9vbGVhbiB8IHZvaWQge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBtdXN0IGJlIGEgYm9vbGVhbiwgb3IgdW5kZWZpbmVkYCk7XG4gIH1cbiAgLy8gQHRzLWV4cGVjdC1lcnJvcjogVFMgY2FuIG9ubHkgbmFycm93IGRvd24gdGhlIHR5cGUgd2hlbiBcInN0cmljdE51bGxDaGVja1wiIGlzIHRydWVcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0T2JqZWN0KFxuICBsb2M6IEdlbmVyYWxQYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IHsgcmVhZG9ubHkgW2tleTogc3RyaW5nXTogdW5rbm93biB9IHwgdm9pZCB7XG4gIGlmIChcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSB8fCAhdmFsdWUpXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhbiBvYmplY3QsIG9yIHVuZGVmaW5lZGApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgdG9kbyhmbG93LT50cykgdmFsdWUgaXMgc3RpbGwgdHlwZWQgYXMgdW5rbm93biwgYWxzbyBhc3NlcnQgZnVuY3Rpb24gdHlwaWNhbGx5IHNob3VsZCBub3QgcmV0dXJuIGEgdmFsdWVcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0QXJyYXk8VD4oXG4gIGxvYzogR2VuZXJhbFBhdGgsXG4gIHZhbHVlOiBBcnJheTxUPiB8IHVuZGVmaW5lZCB8IG51bGwsXG4pOiBSZWFkb25seUFycmF5PFQ+IHwgdW5kZWZpbmVkIHwgbnVsbCB7XG4gIGlmICh2YWx1ZSAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhbiBhcnJheSwgb3IgdW5kZWZpbmVkYCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0SWdub3JlTGlzdChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bltdIHwgdW5kZWZpbmVkLFxuKTogSWdub3JlTGlzdCB8IHZvaWQge1xuICBjb25zdCBhcnIgPSBhc3NlcnRBcnJheShsb2MsIHZhbHVlKTtcbiAgYXJyPy5mb3JFYWNoKChpdGVtLCBpKSA9PiBhc3NlcnRJZ25vcmVJdGVtKGFjY2Vzcyhsb2MsIGkpLCBpdGVtKSk7XG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgdG9kbyhmbG93LT50cylcbiAgcmV0dXJuIGFycjtcbn1cbmZ1bmN0aW9uIGFzc2VydElnbm9yZUl0ZW0obG9jOiBHZW5lcmFsUGF0aCwgdmFsdWU6IHVua25vd24pOiBJZ25vcmVJdGVtIHtcbiAgaWYgKFxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiICYmXG4gICAgISh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7bXNnKFxuICAgICAgICBsb2MsXG4gICAgICApfSBtdXN0IGJlIGFuIGFycmF5IG9mIHN0cmluZy9GdW5jdGlvbi9SZWdFeHAgdmFsdWVzLCBvciB1bmRlZmluZWRgLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlIGFzIElnbm9yZUl0ZW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDb25maWdBcHBsaWNhYmxlVGVzdChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IENvbmZpZ0FwcGxpY2FibGVUZXN0IHwgdm9pZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvcjogVFMgY2FuIG9ubHkgbmFycm93IGRvd24gdGhlIHR5cGUgd2hlbiBcInN0cmljdE51bGxDaGVja1wiIGlzIHRydWVcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICBpZiAoIWNoZWNrVmFsaWRUZXN0KGl0ZW0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHttc2coYWNjZXNzKGxvYywgaSkpfSBtdXN0IGJlIGEgc3RyaW5nL0Z1bmN0aW9uL1JlZ0V4cC5gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKCFjaGVja1ZhbGlkVGVzdCh2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHttc2cobG9jKX0gbXVzdCBiZSBhIHN0cmluZy9GdW5jdGlvbi9SZWdFeHAsIG9yIGFuIGFycmF5IG9mIHRob3NlYCxcbiAgICApO1xuICB9XG4gIHJldHVybiB2YWx1ZSBhcyBDb25maWdBcHBsaWNhYmxlVGVzdDtcbn1cblxuZnVuY3Rpb24gY2hlY2tWYWxpZFRlc3QodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBzdHJpbmcgfCBGdW5jdGlvbiB8IFJlZ0V4cCB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICB2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Q29uZmlnRmlsZVNlYXJjaChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IENvbmZpZ0ZpbGVTZWFyY2ggfCB2b2lkIHtcbiAgaWYgKFxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiICYmXG4gICAgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIGEgdW5kZWZpbmVkLCBhIGJvb2xlYW4sIGEgc3RyaW5nLCBgICtcbiAgICAgICAgYGdvdCAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gLFxuICAgICk7XG4gIH1cbiAgLy8gQHRzLWV4cGVjdC1lcnJvcjogVFMgY2FuIG9ubHkgbmFycm93IGRvd24gdGhlIHR5cGUgd2hlbiBcInN0cmljdE51bGxDaGVja1wiIGlzIHRydWVcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0QmFiZWxyY1NlYXJjaChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IEJhYmVscmNTZWFyY2ggfCB2b2lkIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgaWYgKCFjaGVja1ZhbGlkVGVzdChpdGVtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7bXNnKGFjY2Vzcyhsb2MsIGkpKX0gbXVzdCBiZSBhIHN0cmluZy9GdW5jdGlvbi9SZWdFeHAuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmICghY2hlY2tWYWxpZFRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7bXNnKGxvYyl9IG11c3QgYmUgYSB1bmRlZmluZWQsIGEgYm9vbGVhbiwgYSBzdHJpbmcvRnVuY3Rpb24vUmVnRXhwIGAgK1xuICAgICAgICBgb3IgYW4gYXJyYXkgb2YgdGhvc2UsIGdvdCAke0pTT04uc3RyaW5naWZ5KHZhbHVlIGFzIGFueSl9YCxcbiAgICApO1xuICB9XG4gIHJldHVybiB2YWx1ZSBhcyBCYWJlbHJjU2VhcmNoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UGx1Z2luTGlzdChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bltdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFBsdWdpbkxpc3QgfCB2b2lkIHtcbiAgY29uc3QgYXJyID0gYXNzZXJ0QXJyYXkobG9jLCB2YWx1ZSk7XG4gIGlmIChhcnIpIHtcbiAgICAvLyBMb29wIGluc3RlYWQgb2YgdXNpbmcgYC5tYXBgIGluIG9yZGVyIHRvIHByZXNlcnZlIG9iamVjdCBpZGVudGl0eVxuICAgIC8vIGZvciBwbHVnaW4gYXJyYXkgZm9yIHVzZSBkdXJpbmcgY29uZmlnIGNoYWluIHByb2Nlc3NpbmcuXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IGFzc2VydFBsdWdpbkl0ZW0oYWNjZXNzKGxvYywgaSksIGl0ZW0pKTtcbiAgfVxuICByZXR1cm4gYXJyIGFzIGFueTtcbn1cbmZ1bmN0aW9uIGFzc2VydFBsdWdpbkl0ZW0obG9jOiBHZW5lcmFsUGF0aCwgdmFsdWU6IHVua25vd24pOiBQbHVnaW5JdGVtIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBtdXN0IGluY2x1ZGUgYW4gb2JqZWN0YCk7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlLmxlbmd0aCA+IDMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbWF5IG9ubHkgYmUgYSB0d28tdHVwbGUgb3IgdGhyZWUtdHVwbGVgKTtcbiAgICB9XG5cbiAgICBhc3NlcnRQbHVnaW5UYXJnZXQoYWNjZXNzKGxvYywgMCksIHZhbHVlWzBdKTtcblxuICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBvcHRzID0gdmFsdWVbMV07XG4gICAgICBpZiAoXG4gICAgICAgIG9wdHMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBvcHRzICE9PSBmYWxzZSAmJlxuICAgICAgICAodHlwZW9mIG9wdHMgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShvcHRzKSB8fCBvcHRzID09PSBudWxsKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHttc2coYWNjZXNzKGxvYywgMSkpfSBtdXN0IGJlIGFuIG9iamVjdCwgZmFsc2UsIG9yIHVuZGVmaW5lZGAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSB2YWx1ZVsyXTtcbiAgICAgIGlmIChuYW1lICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke21zZyhhY2Nlc3MobG9jLCAyKSl9IG11c3QgYmUgYSBzdHJpbmcsIG9yIHVuZGVmaW5lZGAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFzc2VydFBsdWdpblRhcmdldChsb2MsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgdG9kbyhmbG93LT50cylcbiAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gYXNzZXJ0UGx1Z2luVGFyZ2V0KGxvYzogR2VuZXJhbFBhdGgsIHZhbHVlOiB1bmtub3duKTogUGx1Z2luVGFyZ2V0IHtcbiAgaWYgKFxuICAgICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgIXZhbHVlKSAmJlxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhIHN0cmluZywgb2JqZWN0LCBmdW5jdGlvbmApO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFRhcmdldHMoXG4gIGxvYzogR2VuZXJhbFBhdGgsXG4gIHZhbHVlOiBhbnksXG4pOiBUYXJnZXRzTGlzdE9yT2JqZWN0IHtcbiAgaWYgKGlzQnJvd3NlcnNRdWVyeVZhbGlkKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgIXZhbHVlIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBzdHJpbmcsIGFuIGFycmF5IG9mIHN0cmluZ3Mgb3IgYW4gb2JqZWN0YCxcbiAgICApO1xuICB9XG5cbiAgY29uc3QgYnJvd3NlcnNMb2MgPSBhY2Nlc3MobG9jLCBcImJyb3dzZXJzXCIpO1xuICBjb25zdCBlc21vZHVsZXNMb2MgPSBhY2Nlc3MobG9jLCBcImVzbW9kdWxlc1wiKTtcblxuICBhc3NlcnRCcm93c2Vyc0xpc3QoYnJvd3NlcnNMb2MsIHZhbHVlLmJyb3dzZXJzKTtcbiAgYXNzZXJ0Qm9vbGVhbihlc21vZHVsZXNMb2MsIHZhbHVlLmVzbW9kdWxlcyk7XG5cbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModmFsdWUpKSB7XG4gICAgY29uc3QgdmFsID0gdmFsdWVba2V5XTtcbiAgICBjb25zdCBzdWJMb2MgPSBhY2Nlc3MobG9jLCBrZXkpO1xuXG4gICAgaWYgKGtleSA9PT0gXCJlc21vZHVsZXNcIikgYXNzZXJ0Qm9vbGVhbihzdWJMb2MsIHZhbCk7XG4gICAgZWxzZSBpZiAoa2V5ID09PSBcImJyb3dzZXJzXCIpIGFzc2VydEJyb3dzZXJzTGlzdChzdWJMb2MsIHZhbCk7XG4gICAgZWxzZSBpZiAoIU9iamVjdC5oYXNPd24oVGFyZ2V0TmFtZXMsIGtleSkpIHtcbiAgICAgIGNvbnN0IHZhbGlkVGFyZ2V0cyA9IE9iamVjdC5rZXlzKFRhcmdldE5hbWVzKS5qb2luKFwiLCBcIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21zZyhcbiAgICAgICAgICBzdWJMb2MsXG4gICAgICAgICl9IGlzIG5vdCBhIHZhbGlkIHRhcmdldC4gU3VwcG9ydGVkIHRhcmdldHMgYXJlICR7dmFsaWRUYXJnZXRzfWAsXG4gICAgICApO1xuICAgIH0gZWxzZSBhc3NlcnRCcm93c2VyVmVyc2lvbihzdWJMb2MsIHZhbCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGFzc2VydEJyb3dzZXJzTGlzdChsb2M6IEdlbmVyYWxQYXRoLCB2YWx1ZTogdW5rbm93bikge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhaXNCcm93c2Vyc1F1ZXJ5VmFsaWQodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7bXNnKGxvYyl9IG11c3QgYmUgdW5kZWZpbmVkLCBhIHN0cmluZyBvciBhbiBhcnJheSBvZiBzdHJpbmdzYCxcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydEJyb3dzZXJWZXJzaW9uKGxvYzogR2VuZXJhbFBhdGgsIHZhbHVlOiB1bmtub3duKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgTWF0aC5yb3VuZCh2YWx1ZSkgPT09IHZhbHVlKSByZXR1cm47XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBzdHJpbmcgb3IgYW4gaW50ZWdlciBudW1iZXJgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEFzc3VtcHRpb25zKFxuICBsb2M6IEdlbmVyYWxQYXRoLFxuICB2YWx1ZTogeyBba2V5OiBzdHJpbmddOiB1bmtub3duIH0sXG4pOiB7IFtuYW1lOiBzdHJpbmddOiBib29sZWFuIH0gfCB2b2lkIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBtdXN0IGJlIGFuIG9iamVjdCBvciB1bmRlZmluZWQuYCk7XG4gIH1cblxuICAvLyB0b2RvKGZsb3ctPnRzKTogcmVtb3ZlIGFueVxuICBsZXQgcm9vdDogYW55ID0gbG9jO1xuICBkbyB7XG4gICAgcm9vdCA9IHJvb3QucGFyZW50O1xuICB9IHdoaWxlIChyb290LnR5cGUgIT09IFwicm9vdFwiKTtcbiAgY29uc3QgaW5QcmVzZXQgPSByb290LnNvdXJjZSA9PT0gXCJwcmVzZXRcIjtcblxuICBmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXModmFsdWUpKSB7XG4gICAgY29uc3Qgc3ViTG9jID0gYWNjZXNzKGxvYywgbmFtZSk7XG4gICAgaWYgKCFhc3N1bXB0aW9uc05hbWVzLmhhcyhuYW1lIGFzIEFzc3VtcHRpb25OYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhzdWJMb2MpfSBpcyBub3QgYSBzdXBwb3J0ZWQgYXNzdW1wdGlvbi5gKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZVtuYW1lXSAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHttc2coc3ViTG9jKX0gbXVzdCBiZSBhIGJvb2xlYW4uYCk7XG4gICAgfVxuICAgIGlmIChpblByZXNldCAmJiB2YWx1ZVtuYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYCR7bXNnKHN1YkxvYyl9IGNhbm5vdCBiZSBzZXQgdG8gJ2ZhbHNlJyBpbnNpZGUgcHJlc2V0cy5gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvZG8oZmxvdy0+dHMpXG4gIHJldHVybiB2YWx1ZTtcbn1cbiIsImltcG9ydCB0eXBlIHsgSW5wdXRUYXJnZXRzLCBUYXJnZXRzIH0gZnJvbSBcIkBiYWJlbC9oZWxwZXItY29tcGlsYXRpb24tdGFyZ2V0c1wiO1xuXG5pbXBvcnQgdHlwZSB7IENvbmZpZ0l0ZW0gfSBmcm9tIFwiLi4vaXRlbS50c1wiO1xuaW1wb3J0IHR5cGUgUGx1Z2luIGZyb20gXCIuLi9wbHVnaW4udHNcIjtcblxuaW1wb3J0IHJlbW92ZWQgZnJvbSBcIi4vcmVtb3ZlZC50c1wiO1xuaW1wb3J0IHtcbiAgbXNnLFxuICBhY2Nlc3MsXG4gIGFzc2VydFN0cmluZyxcbiAgYXNzZXJ0Qm9vbGVhbixcbiAgYXNzZXJ0T2JqZWN0LFxuICBhc3NlcnRBcnJheSxcbiAgYXNzZXJ0Q2FsbGVyTWV0YWRhdGEsXG4gIGFzc2VydElucHV0U291cmNlTWFwLFxuICBhc3NlcnRJZ25vcmVMaXN0LFxuICBhc3NlcnRQbHVnaW5MaXN0LFxuICBhc3NlcnRDb25maWdBcHBsaWNhYmxlVGVzdCxcbiAgYXNzZXJ0Q29uZmlnRmlsZVNlYXJjaCxcbiAgYXNzZXJ0QmFiZWxyY1NlYXJjaCxcbiAgYXNzZXJ0RnVuY3Rpb24sXG4gIGFzc2VydFJvb3RNb2RlLFxuICBhc3NlcnRTb3VyY2VNYXBzLFxuICBhc3NlcnRDb21wYWN0LFxuICBhc3NlcnRTb3VyY2VUeXBlLFxuICBhc3NlcnRUYXJnZXRzLFxuICBhc3NlcnRBc3N1bXB0aW9ucyxcbn0gZnJvbSBcIi4vb3B0aW9uLWFzc2VydGlvbnMudHNcIjtcbmltcG9ydCB0eXBlIHtcbiAgVmFsaWRhdG9yU2V0LFxuICBWYWxpZGF0b3IsXG4gIE9wdGlvblBhdGgsXG59IGZyb20gXCIuL29wdGlvbi1hc3NlcnRpb25zLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFVubG9hZGVkRGVzY3JpcHRvciB9IGZyb20gXCIuLi9jb25maWctZGVzY3JpcHRvcnMudHNcIjtcbmltcG9ydCB0eXBlIHsgUGx1Z2luQVBJIH0gZnJvbSBcIi4uL2hlbHBlcnMvY29uZmlnLWFwaS50c1wiO1xuaW1wb3J0IHR5cGUgeyBQYXJzZXJPcHRpb25zIH0gZnJvbSBcIkBiYWJlbC9wYXJzZXJcIjtcbmltcG9ydCB0eXBlIHsgR2VuZXJhdG9yT3B0aW9ucyB9IGZyb20gXCJAYmFiZWwvZ2VuZXJhdG9yXCI7XG5pbXBvcnQgQ29uZmlnRXJyb3IgZnJvbSBcIi4uLy4uL2Vycm9ycy9jb25maWctZXJyb3IudHNcIjtcblxuY29uc3QgUk9PVF9WQUxJREFUT1JTOiBWYWxpZGF0b3JTZXQgPSB7XG4gIGN3ZDogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiY3dkXCJdPixcbiAgcm9vdDogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wicm9vdFwiXT4sXG4gIHJvb3RNb2RlOiBhc3NlcnRSb290TW9kZSBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInJvb3RNb2RlXCJdPixcbiAgY29uZmlnRmlsZTogYXNzZXJ0Q29uZmlnRmlsZVNlYXJjaCBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImNvbmZpZ0ZpbGVcIl1cbiAgPixcblxuICBjYWxsZXI6IGFzc2VydENhbGxlck1ldGFkYXRhIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiY2FsbGVyXCJdPixcbiAgZmlsZW5hbWU6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImZpbGVuYW1lXCJdPixcbiAgZmlsZW5hbWVSZWxhdGl2ZTogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxcbiAgICBWYWxpZGF0ZWRPcHRpb25zW1wiZmlsZW5hbWVSZWxhdGl2ZVwiXVxuICA+LFxuICBjb2RlOiBhc3NlcnRCb29sZWFuIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiY29kZVwiXT4sXG4gIGFzdDogYXNzZXJ0Qm9vbGVhbiBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImFzdFwiXT4sXG5cbiAgY2xvbmVJbnB1dEFzdDogYXNzZXJ0Qm9vbGVhbiBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImNsb25lSW5wdXRBc3RcIl0+LFxuXG4gIGVudk5hbWU6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImVudk5hbWVcIl0+LFxufTtcblxuY29uc3QgQkFCRUxSQ19WQUxJREFUT1JTOiBWYWxpZGF0b3JTZXQgPSB7XG4gIGJhYmVscmM6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJiYWJlbHJjXCJdPixcbiAgYmFiZWxyY1Jvb3RzOiBhc3NlcnRCYWJlbHJjU2VhcmNoIGFzIFZhbGlkYXRvcjxcbiAgICBWYWxpZGF0ZWRPcHRpb25zW1wiYmFiZWxyY1Jvb3RzXCJdXG4gID4sXG59O1xuXG5jb25zdCBOT05QUkVTRVRfVkFMSURBVE9SUzogVmFsaWRhdG9yU2V0ID0ge1xuICBleHRlbmRzOiBhc3NlcnRTdHJpbmcgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJleHRlbmRzXCJdPixcbiAgaWdub3JlOiBhc3NlcnRJZ25vcmVMaXN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiaWdub3JlXCJdPixcbiAgb25seTogYXNzZXJ0SWdub3JlTGlzdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcIm9ubHlcIl0+LFxuXG4gIHRhcmdldHM6IGFzc2VydFRhcmdldHMgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJ0YXJnZXRzXCJdPixcbiAgYnJvd3NlcnNsaXN0Q29uZmlnRmlsZTogYXNzZXJ0Q29uZmlnRmlsZVNlYXJjaCBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImJyb3dzZXJzbGlzdENvbmZpZ0ZpbGVcIl1cbiAgPixcbiAgYnJvd3NlcnNsaXN0RW52OiBhc3NlcnRTdHJpbmcgYXMgVmFsaWRhdG9yPFxuICAgIFZhbGlkYXRlZE9wdGlvbnNbXCJicm93c2Vyc2xpc3RFbnZcIl1cbiAgPixcbn07XG5cbmNvbnN0IENPTU1PTl9WQUxJREFUT1JTOiBWYWxpZGF0b3JTZXQgPSB7XG4gIC8vIFRPRE86IFNob3VsZCAnaW5wdXRTb3VyY2VNYXAnIGJlIG1vdmVkIHRvIGJlIGEgcm9vdC1vbmx5IG9wdGlvbj9cbiAgLy8gV2UgbWF5IHdhbnQgYSBib29sZWFuLW9ubHkgdmVyc2lvbiB0byBiZSBhIGNvbW1vbiBvcHRpb24sIHdpdGggdGhlXG4gIC8vIG9iamVjdCBvbmx5IGFsbG93ZWQgYXMgYSByb290IGNvbmZpZyBhcmd1bWVudC5cbiAgaW5wdXRTb3VyY2VNYXA6IGFzc2VydElucHV0U291cmNlTWFwIGFzIFZhbGlkYXRvcjxcbiAgICBWYWxpZGF0ZWRPcHRpb25zW1wiaW5wdXRTb3VyY2VNYXBcIl1cbiAgPixcbiAgcHJlc2V0czogYXNzZXJ0UGx1Z2luTGlzdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInByZXNldHNcIl0+LFxuICBwbHVnaW5zOiBhc3NlcnRQbHVnaW5MaXN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wicGx1Z2luc1wiXT4sXG4gIHBhc3NQZXJQcmVzZXQ6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJwYXNzUGVyUHJlc2V0XCJdPixcbiAgYXNzdW1wdGlvbnM6IGFzc2VydEFzc3VtcHRpb25zIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiYXNzdW1wdGlvbnNcIl0+LFxuXG4gIGVudjogYXNzZXJ0RW52U2V0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiZW52XCJdPixcbiAgb3ZlcnJpZGVzOiBhc3NlcnRPdmVycmlkZXNMaXN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wib3ZlcnJpZGVzXCJdPixcblxuICAvLyBXZSBjb3VsZCBsaW1pdCB0aGVzZSB0byAnb3ZlcnJpZGVzJyBibG9ja3MsIGJ1dCBpdCdzIG5vdCBjbGVhciB3aHkgd2UnZFxuICAvLyBib3RoZXIsIHdoZW4gdGhlIGFiaWxpdHkgdG8gbGltaXQgYSBjb25maWcgdG8gYSBzcGVjaWZpYyBzZXQgb2YgZmlsZXNcbiAgLy8gaXMgYSBmYWlybHkgZ2VuZXJhbCB1c2VmdWwgZmVhdHVyZS5cbiAgdGVzdDogYXNzZXJ0Q29uZmlnQXBwbGljYWJsZVRlc3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJ0ZXN0XCJdPixcbiAgaW5jbHVkZTogYXNzZXJ0Q29uZmlnQXBwbGljYWJsZVRlc3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJpbmNsdWRlXCJdPixcbiAgZXhjbHVkZTogYXNzZXJ0Q29uZmlnQXBwbGljYWJsZVRlc3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJleGNsdWRlXCJdPixcblxuICByZXRhaW5MaW5lczogYXNzZXJ0Qm9vbGVhbiBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInJldGFpbkxpbmVzXCJdPixcbiAgY29tbWVudHM6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJjb21tZW50c1wiXT4sXG4gIHNob3VsZFByaW50Q29tbWVudDogYXNzZXJ0RnVuY3Rpb24gYXMgVmFsaWRhdG9yPFxuICAgIFZhbGlkYXRlZE9wdGlvbnNbXCJzaG91bGRQcmludENvbW1lbnRcIl1cbiAgPixcbiAgY29tcGFjdDogYXNzZXJ0Q29tcGFjdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImNvbXBhY3RcIl0+LFxuICBtaW5pZmllZDogYXNzZXJ0Qm9vbGVhbiBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcIm1pbmlmaWVkXCJdPixcbiAgYXV4aWxpYXJ5Q29tbWVudEJlZm9yZTogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxcbiAgICBWYWxpZGF0ZWRPcHRpb25zW1wiYXV4aWxpYXJ5Q29tbWVudEJlZm9yZVwiXVxuICA+LFxuICBhdXhpbGlhcnlDb21tZW50QWZ0ZXI6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImF1eGlsaWFyeUNvbW1lbnRBZnRlclwiXVxuICA+LFxuICBzb3VyY2VUeXBlOiBhc3NlcnRTb3VyY2VUeXBlIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wic291cmNlVHlwZVwiXT4sXG4gIHdyYXBQbHVnaW5WaXNpdG9yTWV0aG9kOiBhc3NlcnRGdW5jdGlvbiBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcIndyYXBQbHVnaW5WaXNpdG9yTWV0aG9kXCJdXG4gID4sXG4gIGhpZ2hsaWdodENvZGU6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJoaWdobGlnaHRDb2RlXCJdPixcbiAgc291cmNlTWFwczogYXNzZXJ0U291cmNlTWFwcyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInNvdXJjZU1hcHNcIl0+LFxuICBzb3VyY2VNYXA6IGFzc2VydFNvdXJjZU1hcHMgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJzb3VyY2VNYXBcIl0+LFxuICBzb3VyY2VGaWxlTmFtZTogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wic291cmNlRmlsZU5hbWVcIl0+LFxuICBzb3VyY2VSb290OiBhc3NlcnRTdHJpbmcgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJzb3VyY2VSb290XCJdPixcbiAgcGFyc2VyT3B0czogYXNzZXJ0T2JqZWN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wicGFyc2VyT3B0c1wiXT4sXG4gIGdlbmVyYXRvck9wdHM6IGFzc2VydE9iamVjdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImdlbmVyYXRvck9wdHNcIl0+LFxufTtcbmlmICghcHJvY2Vzcy5lbnYuQkFCRUxfOF9CUkVBS0lORykge1xuICBPYmplY3QuYXNzaWduKENPTU1PTl9WQUxJREFUT1JTLCB7XG4gICAgZ2V0TW9kdWxlSWQ6IGFzc2VydEZ1bmN0aW9uLFxuICAgIG1vZHVsZVJvb3Q6IGFzc2VydFN0cmluZyxcbiAgICBtb2R1bGVJZHM6IGFzc2VydEJvb2xlYW4sXG4gICAgbW9kdWxlSWQ6IGFzc2VydFN0cmluZyxcbiAgfSk7XG59XG5cbmV4cG9ydCB0eXBlIElucHV0T3B0aW9ucyA9IFZhbGlkYXRlZE9wdGlvbnM7XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRlZE9wdGlvbnMgPSB7XG4gIGN3ZD86IHN0cmluZztcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XG4gIGZpbGVuYW1lUmVsYXRpdmU/OiBzdHJpbmc7XG4gIGJhYmVscmM/OiBib29sZWFuO1xuICBiYWJlbHJjUm9vdHM/OiBCYWJlbHJjU2VhcmNoO1xuICBjb25maWdGaWxlPzogQ29uZmlnRmlsZVNlYXJjaDtcbiAgcm9vdD86IHN0cmluZztcbiAgcm9vdE1vZGU/OiBSb290TW9kZTtcbiAgY29kZT86IGJvb2xlYW47XG4gIGFzdD86IGJvb2xlYW47XG4gIGNsb25lSW5wdXRBc3Q/OiBib29sZWFuO1xuICBpbnB1dFNvdXJjZU1hcD86IFJvb3RJbnB1dFNvdXJjZU1hcE9wdGlvbjtcbiAgZW52TmFtZT86IHN0cmluZztcbiAgY2FsbGVyPzogQ2FsbGVyTWV0YWRhdGE7XG4gIGV4dGVuZHM/OiBzdHJpbmc7XG4gIGVudj86IEVudlNldDxWYWxpZGF0ZWRPcHRpb25zPjtcbiAgaWdub3JlPzogSWdub3JlTGlzdDtcbiAgb25seT86IElnbm9yZUxpc3Q7XG4gIG92ZXJyaWRlcz86IE92ZXJyaWRlc0xpc3Q7XG4gIHNob3dJZ25vcmVkRmlsZXM/OiBib29sZWFuO1xuICAvLyBHZW5lcmFsbHkgdmVyaWZ5IGlmIGEgZ2l2ZW4gY29uZmlnIG9iamVjdCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgZ2l2ZW4gZmlsZS5cbiAgdGVzdD86IENvbmZpZ0FwcGxpY2FibGVUZXN0O1xuICBpbmNsdWRlPzogQ29uZmlnQXBwbGljYWJsZVRlc3Q7XG4gIGV4Y2x1ZGU/OiBDb25maWdBcHBsaWNhYmxlVGVzdDtcbiAgcHJlc2V0cz86IFBsdWdpbkxpc3Q7XG4gIHBsdWdpbnM/OiBQbHVnaW5MaXN0O1xuICBwYXNzUGVyUHJlc2V0PzogYm9vbGVhbjtcbiAgYXNzdW1wdGlvbnM/OiB7XG4gICAgW25hbWU6IHN0cmluZ106IGJvb2xlYW47XG4gIH07XG4gIC8vIGJyb3dzZXJzbGlzdHMtcmVsYXRlZCBvcHRpb25zXG4gIHRhcmdldHM/OiBUYXJnZXRzTGlzdE9yT2JqZWN0O1xuICBicm93c2Vyc2xpc3RDb25maWdGaWxlPzogQ29uZmlnRmlsZVNlYXJjaDtcbiAgYnJvd3NlcnNsaXN0RW52Pzogc3RyaW5nO1xuICAvLyBPcHRpb25zIGZvciBAYmFiZWwvZ2VuZXJhdG9yXG4gIHJldGFpbkxpbmVzPzogYm9vbGVhbjtcbiAgY29tbWVudHM/OiBib29sZWFuO1xuICBzaG91bGRQcmludENvbW1lbnQ/OiBGdW5jdGlvbjtcbiAgY29tcGFjdD86IENvbXBhY3RPcHRpb247XG4gIG1pbmlmaWVkPzogYm9vbGVhbjtcbiAgYXV4aWxpYXJ5Q29tbWVudEJlZm9yZT86IHN0cmluZztcbiAgYXV4aWxpYXJ5Q29tbWVudEFmdGVyPzogc3RyaW5nO1xuICAvLyBQYXJzZXJcbiAgc291cmNlVHlwZT86IFNvdXJjZVR5cGVPcHRpb247XG4gIHdyYXBQbHVnaW5WaXNpdG9yTWV0aG9kPzogRnVuY3Rpb247XG4gIGhpZ2hsaWdodENvZGU/OiBib29sZWFuO1xuICAvLyBTb3VyY2VtYXAgZ2VuZXJhdGlvbiBvcHRpb25zLlxuICBzb3VyY2VNYXBzPzogU291cmNlTWFwc09wdGlvbjtcbiAgc291cmNlTWFwPzogU291cmNlTWFwc09wdGlvbjtcbiAgc291cmNlRmlsZU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZVJvb3Q/OiBzdHJpbmc7XG4gIC8vIERlcHJlY2F0ZSB0b3AgbGV2ZWwgcGFyc2VyT3B0c1xuICBwYXJzZXJPcHRzPzogUGFyc2VyT3B0aW9ucztcbiAgLy8gRGVwcmVjYXRlIHRvcCBsZXZlbCBnZW5lcmF0b3JPcHRzXG4gIGdlbmVyYXRvck9wdHM/OiBHZW5lcmF0b3JPcHRpb25zO1xufTtcblxuZXhwb3J0IHR5cGUgTm9ybWFsaXplZE9wdGlvbnMgPSB7XG4gIHJlYWRvbmx5IHRhcmdldHM6IFRhcmdldHM7XG59ICYgT21pdDxWYWxpZGF0ZWRPcHRpb25zLCBcInRhcmdldHNcIj47XG5cbmV4cG9ydCB0eXBlIENhbGxlck1ldGFkYXRhID0ge1xuICAvLyBJZiAnY2FsbGVyJyBpcyBzcGVjaWZpZWQsIHJlcXVpcmUgdGhhdCB0aGUgbmFtZSBpcyBnaXZlbiBmb3IgZGVidWdnaW5nXG4gIC8vIG1lc3NhZ2VzLlxuICBuYW1lOiBzdHJpbmc7XG59O1xuZXhwb3J0IHR5cGUgRW52U2V0PFQ+ID0ge1xuICBbeDogc3RyaW5nXTogVDtcbn07XG5leHBvcnQgdHlwZSBJZ25vcmVJdGVtID1cbiAgfCBzdHJpbmdcbiAgfCBSZWdFeHBcbiAgfCAoKFxuICAgICAgcGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgICAgY29udGV4dDogeyBkaXJuYW1lOiBzdHJpbmc7IGNhbGxlcjogQ2FsbGVyTWV0YWRhdGE7IGVudk5hbWU6IHN0cmluZyB9LFxuICAgICkgPT4gdW5rbm93bik7XG5leHBvcnQgdHlwZSBJZ25vcmVMaXN0ID0gUmVhZG9ubHlBcnJheTxJZ25vcmVJdGVtPjtcblxuZXhwb3J0IHR5cGUgUGx1Z2luT3B0aW9ucyA9IG9iamVjdCB8IHZvaWQgfCBmYWxzZTtcbmV4cG9ydCB0eXBlIFBsdWdpblRhcmdldCA9IHN0cmluZyB8IG9iamVjdCB8IEZ1bmN0aW9uO1xuZXhwb3J0IHR5cGUgUGx1Z2luSXRlbSA9XG4gIHwgQ29uZmlnSXRlbTxQbHVnaW5BUEk+XG4gIHwgUGx1Z2luXG4gIHwgUGx1Z2luVGFyZ2V0XG4gIHwgW1BsdWdpblRhcmdldCwgUGx1Z2luT3B0aW9uc11cbiAgfCBbUGx1Z2luVGFyZ2V0LCBQbHVnaW5PcHRpb25zLCBzdHJpbmcgfCB2b2lkXTtcbmV4cG9ydCB0eXBlIFBsdWdpbkxpc3QgPSBSZWFkb25seUFycmF5PFBsdWdpbkl0ZW0+O1xuXG5leHBvcnQgdHlwZSBPdmVycmlkZXNMaXN0ID0gQXJyYXk8VmFsaWRhdGVkT3B0aW9ucz47XG5leHBvcnQgdHlwZSBDb25maWdBcHBsaWNhYmxlVGVzdCA9IElnbm9yZUl0ZW0gfCBBcnJheTxJZ25vcmVJdGVtPjtcblxuZXhwb3J0IHR5cGUgQ29uZmlnRmlsZVNlYXJjaCA9IHN0cmluZyB8IGJvb2xlYW47XG5leHBvcnQgdHlwZSBCYWJlbHJjU2VhcmNoID0gYm9vbGVhbiB8IElnbm9yZUl0ZW0gfCBJZ25vcmVMaXN0O1xuZXhwb3J0IHR5cGUgU291cmNlTWFwc09wdGlvbiA9IGJvb2xlYW4gfCBcImlubGluZVwiIHwgXCJib3RoXCI7XG5leHBvcnQgdHlwZSBTb3VyY2VUeXBlT3B0aW9uID0gXCJtb2R1bGVcIiB8IFwic2NyaXB0XCIgfCBcInVuYW1iaWd1b3VzXCI7XG5leHBvcnQgdHlwZSBDb21wYWN0T3B0aW9uID0gYm9vbGVhbiB8IFwiYXV0b1wiO1xuZXhwb3J0IHR5cGUgUm9vdElucHV0U291cmNlTWFwT3B0aW9uID0gb2JqZWN0IHwgYm9vbGVhbjtcbmV4cG9ydCB0eXBlIFJvb3RNb2RlID0gXCJyb290XCIgfCBcInVwd2FyZFwiIHwgXCJ1cHdhcmQtb3B0aW9uYWxcIjtcblxuZXhwb3J0IHR5cGUgVGFyZ2V0c0xpc3RPck9iamVjdCA9XG4gIHwgVGFyZ2V0c1xuICB8IElucHV0VGFyZ2V0c1xuICB8IElucHV0VGFyZ2V0c1tcImJyb3dzZXJzXCJdO1xuXG5leHBvcnQgdHlwZSBPcHRpb25zU291cmNlID1cbiAgfCBcImFyZ3VtZW50c1wiXG4gIHwgXCJjb25maWdmaWxlXCJcbiAgfCBcImJhYmVscmNmaWxlXCJcbiAgfCBcImV4dGVuZHNmaWxlXCJcbiAgfCBcInByZXNldFwiXG4gIHwgXCJwbHVnaW5cIjtcblxuZXhwb3J0IHR5cGUgUm9vdFBhdGggPSBSZWFkb25seTx7XG4gIHR5cGU6IFwicm9vdFwiO1xuICBzb3VyY2U6IE9wdGlvbnNTb3VyY2U7XG59PjtcblxudHlwZSBPdmVycmlkZXNQYXRoID0gUmVhZG9ubHk8e1xuICB0eXBlOiBcIm92ZXJyaWRlc1wiO1xuICBpbmRleDogbnVtYmVyO1xuICBwYXJlbnQ6IFJvb3RQYXRoO1xufT47XG5cbnR5cGUgRW52UGF0aCA9IFJlYWRvbmx5PHtcbiAgdHlwZTogXCJlbnZcIjtcbiAgbmFtZTogc3RyaW5nO1xuICBwYXJlbnQ6IFJvb3RQYXRoIHwgT3ZlcnJpZGVzUGF0aDtcbn0+O1xuXG5leHBvcnQgdHlwZSBOZXN0aW5nUGF0aCA9IFJvb3RQYXRoIHwgT3ZlcnJpZGVzUGF0aCB8IEVudlBhdGg7XG5cbmNvbnN0IGtub3duQXNzdW1wdGlvbnMgPSBbXG4gIFwiYXJyYXlMaWtlSXNJdGVyYWJsZVwiLFxuICBcImNvbnN0YW50UmVleHBvcnRzXCIsXG4gIFwiY29uc3RhbnRTdXBlclwiLFxuICBcImVudW1lcmFibGVNb2R1bGVNZXRhXCIsXG4gIFwiaWdub3JlRnVuY3Rpb25MZW5ndGhcIixcbiAgXCJpZ25vcmVUb1ByaW1pdGl2ZUhpbnRcIixcbiAgXCJpdGVyYWJsZUlzQXJyYXlcIixcbiAgXCJtdXRhYmxlVGVtcGxhdGVPYmplY3RcIixcbiAgXCJub0NsYXNzQ2FsbHNcIixcbiAgXCJub0RvY3VtZW50QWxsXCIsXG4gIFwibm9JbmNvbXBsZXRlTnNJbXBvcnREZXRlY3Rpb25cIixcbiAgXCJub05ld0Fycm93c1wiLFxuICBcIm5vVW5pbml0aWFsaXplZFByaXZhdGVGaWVsZEFjY2Vzc1wiLFxuICBcIm9iamVjdFJlc3ROb1N5bWJvbHNcIixcbiAgXCJwcml2YXRlRmllbGRzQXNTeW1ib2xzXCIsXG4gIFwicHJpdmF0ZUZpZWxkc0FzUHJvcGVydGllc1wiLFxuICBcInB1cmVHZXR0ZXJzXCIsXG4gIFwic2V0Q2xhc3NNZXRob2RzXCIsXG4gIFwic2V0Q29tcHV0ZWRQcm9wZXJ0aWVzXCIsXG4gIFwic2V0UHVibGljQ2xhc3NGaWVsZHNcIixcbiAgXCJzZXRTcHJlYWRQcm9wZXJ0aWVzXCIsXG4gIFwic2tpcEZvck9mSXRlcmF0b3JDbG9zaW5nXCIsXG4gIFwic3VwZXJJc0NhbGxhYmxlQ29uc3RydWN0b3JcIixcbl0gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBBc3N1bXB0aW9uTmFtZSA9ICh0eXBlb2Yga25vd25Bc3N1bXB0aW9ucylbbnVtYmVyXTtcbmV4cG9ydCBjb25zdCBhc3N1bXB0aW9uc05hbWVzID0gbmV3IFNldChrbm93bkFzc3VtcHRpb25zKTtcblxuZnVuY3Rpb24gZ2V0U291cmNlKGxvYzogTmVzdGluZ1BhdGgpOiBPcHRpb25zU291cmNlIHtcbiAgcmV0dXJuIGxvYy50eXBlID09PSBcInJvb3RcIiA/IGxvYy5zb3VyY2UgOiBnZXRTb3VyY2UobG9jLnBhcmVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZShcbiAgdHlwZTogT3B0aW9uc1NvdXJjZSxcbiAgb3B0czogYW55LFxuICBmaWxlbmFtZT86IHN0cmluZyxcbik6IFZhbGlkYXRlZE9wdGlvbnMge1xuICB0cnkge1xuICAgIHJldHVybiB2YWxpZGF0ZU5lc3RlZChcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJyb290XCIsXG4gICAgICAgIHNvdXJjZTogdHlwZSxcbiAgICAgIH0sXG4gICAgICBvcHRzLFxuICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgY29uZmlnRXJyb3IgPSBuZXcgQ29uZmlnRXJyb3IoZXJyb3IubWVzc2FnZSwgZmlsZW5hbWUpO1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVE9ETzogLmNvZGUgaXMgbm90IGRlZmluZWQgb24gQ29uZmlnRXJyb3Igb3IgRXJyb3JcbiAgICBpZiAoZXJyb3IuY29kZSkgY29uZmlnRXJyb3IuY29kZSA9IGVycm9yLmNvZGU7XG4gICAgdGhyb3cgY29uZmlnRXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVOZXN0ZWQobG9jOiBOZXN0aW5nUGF0aCwgb3B0czogeyBba2V5OiBzdHJpbmddOiB1bmtub3duIH0pIHtcbiAgY29uc3QgdHlwZSA9IGdldFNvdXJjZShsb2MpO1xuXG4gIGFzc2VydE5vRHVwbGljYXRlU291cmNlbWFwKG9wdHMpO1xuXG4gIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qgb3B0TG9jID0ge1xuICAgICAgdHlwZTogXCJvcHRpb25cIixcbiAgICAgIG5hbWU6IGtleSxcbiAgICAgIHBhcmVudDogbG9jLFxuICAgIH0gYXMgY29uc3Q7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJwcmVzZXRcIiAmJiBOT05QUkVTRVRfVkFMSURBVE9SU1trZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKG9wdExvYyl9IGlzIG5vdCBhbGxvd2VkIGluIHByZXNldCBvcHRpb25zYCk7XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSBcImFyZ3VtZW50c1wiICYmIFJPT1RfVkFMSURBVE9SU1trZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21zZyhvcHRMb2MpfSBpcyBvbmx5IGFsbG93ZWQgaW4gcm9vdCBwcm9ncmFtbWF0aWMgb3B0aW9uc2AsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0eXBlICE9PSBcImFyZ3VtZW50c1wiICYmXG4gICAgICB0eXBlICE9PSBcImNvbmZpZ2ZpbGVcIiAmJlxuICAgICAgQkFCRUxSQ19WQUxJREFUT1JTW2tleV1cbiAgICApIHtcbiAgICAgIGlmICh0eXBlID09PSBcImJhYmVscmNmaWxlXCIgfHwgdHlwZSA9PT0gXCJleHRlbmRzZmlsZVwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHttc2coXG4gICAgICAgICAgICBvcHRMb2MsXG4gICAgICAgICAgKX0gaXMgbm90IGFsbG93ZWQgaW4gLmJhYmVscmMgb3IgXCJleHRlbmRzXCJlZCBmaWxlcywgb25seSBpbiByb290IHByb2dyYW1tYXRpYyBvcHRpb25zLCBgICtcbiAgICAgICAgICAgIGBvciBiYWJlbC5jb25maWcuanMvY29uZmlnIGZpbGUgb3B0aW9uc2AsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYCR7bXNnKFxuICAgICAgICAgIG9wdExvYyxcbiAgICAgICAgKX0gaXMgb25seSBhbGxvd2VkIGluIHJvb3QgcHJvZ3JhbW1hdGljIG9wdGlvbnMsIG9yIGJhYmVsLmNvbmZpZy5qcy9jb25maWcgZmlsZSBvcHRpb25zYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWRhdG9yID1cbiAgICAgIENPTU1PTl9WQUxJREFUT1JTW2tleV0gfHxcbiAgICAgIE5PTlBSRVNFVF9WQUxJREFUT1JTW2tleV0gfHxcbiAgICAgIEJBQkVMUkNfVkFMSURBVE9SU1trZXldIHx8XG4gICAgICBST09UX1ZBTElEQVRPUlNba2V5XSB8fFxuICAgICAgKHRocm93VW5rbm93bkVycm9yIGFzIFZhbGlkYXRvcjx2b2lkPik7XG5cbiAgICB2YWxpZGF0b3Iob3B0TG9jLCBvcHRzW2tleV0pO1xuICB9KTtcblxuICByZXR1cm4gb3B0cztcbn1cblxuZnVuY3Rpb24gdGhyb3dVbmtub3duRXJyb3IobG9jOiBPcHRpb25QYXRoKSB7XG4gIGNvbnN0IGtleSA9IGxvYy5uYW1lO1xuXG4gIGlmIChyZW1vdmVkW2tleV0pIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIHZlcnNpb24gPSA1IH0gPSByZW1vdmVkW2tleV07XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgVXNpbmcgcmVtb3ZlZCBCYWJlbCAke3ZlcnNpb259IG9wdGlvbjogJHttc2cobG9jKX0gLSAke21lc3NhZ2V9YCxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHVua25vd25PcHRFcnIgPSBuZXcgRXJyb3IoXG4gICAgICBgVW5rbm93biBvcHRpb246ICR7bXNnKFxuICAgICAgICBsb2MsXG4gICAgICApfS4gQ2hlY2sgb3V0IGh0dHBzOi8vYmFiZWxqcy5pby9kb2NzL2VuL2JhYmVsLWNvcmUvI29wdGlvbnMgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgb3B0aW9ucy5gLFxuICAgICk7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0b2RvKGZsb3ctPnRzKTogY29uc2lkZXIgY3JlYXRpbmcgc29tZXRoaW5nIGxpa2UgQmFiZWxDb25maWdFcnJvciB3aXRoIGNvZGUgZmllbGQgaW4gaXRcbiAgICB1bmtub3duT3B0RXJyLmNvZGUgPSBcIkJBQkVMX1VOS05PV05fT1BUSU9OXCI7XG5cbiAgICB0aHJvdyB1bmtub3duT3B0RXJyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydE5vRHVwbGljYXRlU291cmNlbWFwKG9wdHM6IGFueSk6IHZvaWQge1xuICBpZiAoT2JqZWN0Lmhhc093bihvcHRzLCBcInNvdXJjZU1hcFwiKSAmJiBPYmplY3QuaGFzT3duKG9wdHMsIFwic291cmNlTWFwc1wiKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIi5zb3VyY2VNYXAgaXMgYW4gYWxpYXMgZm9yIC5zb3VyY2VNYXBzLCBjYW5ub3QgdXNlIGJvdGhcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0RW52U2V0KFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogdm9pZCB8IEVudlNldDxWYWxpZGF0ZWRPcHRpb25zPiB7XG4gIGlmIChsb2MucGFyZW50LnR5cGUgPT09IFwiZW52XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IGlzIG5vdCBhbGxvd2VkIGluc2lkZSBvZiBhbm90aGVyIC5lbnYgYmxvY2tgKTtcbiAgfVxuICBjb25zdCBwYXJlbnQ6IFJvb3RQYXRoIHwgT3ZlcnJpZGVzUGF0aCA9IGxvYy5wYXJlbnQ7XG5cbiAgY29uc3Qgb2JqID0gYXNzZXJ0T2JqZWN0KGxvYywgdmFsdWUpO1xuICBpZiAob2JqKSB7XG4gICAgLy8gVmFsaWRhdGUgYnV0IGRvbid0IGNvcHkgdGhlIC5lbnYgb2JqZWN0IGluIG9yZGVyIHRvIHByZXNlcnZlXG4gICAgLy8gb2JqZWN0IGlkZW50aXR5IGZvciB1c2UgZHVyaW5nIGNvbmZpZyBjaGFpbiBwcm9jZXNzaW5nLlxuICAgIGZvciAoY29uc3QgZW52TmFtZSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICBjb25zdCBlbnYgPSBhc3NlcnRPYmplY3QoYWNjZXNzKGxvYywgZW52TmFtZSksIG9ialtlbnZOYW1lXSk7XG4gICAgICBpZiAoIWVudikgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGVudkxvYyA9IHtcbiAgICAgICAgdHlwZTogXCJlbnZcIixcbiAgICAgICAgbmFtZTogZW52TmFtZSxcbiAgICAgICAgcGFyZW50LFxuICAgICAgfSBhcyBjb25zdDtcbiAgICAgIHZhbGlkYXRlTmVzdGVkKGVudkxvYywgZW52KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0T3ZlcnJpZGVzTGlzdChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bltdLFxuKTogdW5kZWZpbmVkIHwgT3ZlcnJpZGVzTGlzdCB7XG4gIGlmIChsb2MucGFyZW50LnR5cGUgPT09IFwiZW52XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IGlzIG5vdCBhbGxvd2VkIGluc2lkZSBhbiAuZW52IGJsb2NrYCk7XG4gIH1cbiAgaWYgKGxvYy5wYXJlbnQudHlwZSA9PT0gXCJvdmVycmlkZXNcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gaXMgbm90IGFsbG93ZWQgaW5zaWRlIGFuIC5vdmVycmlkZXMgYmxvY2tgKTtcbiAgfVxuICBjb25zdCBwYXJlbnQ6IFJvb3RQYXRoID0gbG9jLnBhcmVudDtcblxuICBjb25zdCBhcnIgPSBhc3NlcnRBcnJheShsb2MsIHZhbHVlKTtcbiAgaWYgKGFycikge1xuICAgIGZvciAoY29uc3QgW2luZGV4LCBpdGVtXSBvZiBhcnIuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBvYmpMb2MgPSBhY2Nlc3MobG9jLCBpbmRleCk7XG4gICAgICBjb25zdCBlbnYgPSBhc3NlcnRPYmplY3Qob2JqTG9jLCBpdGVtKTtcbiAgICAgIGlmICghZW52KSB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKG9iakxvYyl9IG11c3QgYmUgYW4gb2JqZWN0YCk7XG5cbiAgICAgIGNvbnN0IG92ZXJyaWRlc0xvYyA9IHtcbiAgICAgICAgdHlwZTogXCJvdmVycmlkZXNcIixcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHBhcmVudCxcbiAgICAgIH0gYXMgY29uc3Q7XG4gICAgICB2YWxpZGF0ZU5lc3RlZChvdmVycmlkZXNMb2MsIGVudik7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnIgYXMgT3ZlcnJpZGVzTGlzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTm9VbndyYXBwZWRJdGVtT3B0aW9uUGFpcnM8QVBJPihcbiAgaXRlbXM6IEFycmF5PFVubG9hZGVkRGVzY3JpcHRvcjxBUEk+PixcbiAgaW5kZXg6IG51bWJlcixcbiAgdHlwZTogXCJwbHVnaW5cIiB8IFwicHJlc2V0XCIsXG4gIGU6IEVycm9yLFxuKTogdm9pZCB7XG4gIGlmIChpbmRleCA9PT0gMCkgcmV0dXJuO1xuXG4gIGNvbnN0IGxhc3RJdGVtID0gaXRlbXNbaW5kZXggLSAxXTtcbiAgY29uc3QgdGhpc0l0ZW0gPSBpdGVtc1tpbmRleF07XG5cbiAgaWYgKFxuICAgIGxhc3RJdGVtLmZpbGUgJiZcbiAgICBsYXN0SXRlbS5vcHRpb25zID09PSB1bmRlZmluZWQgJiZcbiAgICB0eXBlb2YgdGhpc0l0ZW0udmFsdWUgPT09IFwib2JqZWN0XCJcbiAgKSB7XG4gICAgZS5tZXNzYWdlICs9XG4gICAgICBgXFxuLSBNYXliZSB5b3UgbWVhbnQgdG8gdXNlXFxuYCArXG4gICAgICBgXCIke3R5cGV9c1wiOiBbXFxuICBbXCIke2xhc3RJdGVtLmZpbGUucmVxdWVzdH1cIiwgJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgdGhpc0l0ZW0udmFsdWUsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgMixcbiAgICAgICl9XVxcbl1cXG5gICtcbiAgICAgIGBUbyBiZSBhIHZhbGlkICR7dHlwZX0sIGl0cyBuYW1lIGFuZCBvcHRpb25zIHNob3VsZCBiZSB3cmFwcGVkIGluIGEgcGFpciBvZiBicmFja2V0c2A7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgYXV4aWxpYXJ5Q29tbWVudDoge1xuICAgIG1lc3NhZ2U6IFwiVXNlIGBhdXhpbGlhcnlDb21tZW50QmVmb3JlYCBvciBgYXV4aWxpYXJ5Q29tbWVudEFmdGVyYFwiLFxuICB9LFxuICBibGFja2xpc3Q6IHtcbiAgICBtZXNzYWdlOiBcIlB1dCB0aGUgc3BlY2lmaWMgdHJhbnNmb3JtcyB5b3Ugd2FudCBpbiB0aGUgYHBsdWdpbnNgIG9wdGlvblwiLFxuICB9LFxuICBicmVha0NvbmZpZzoge1xuICAgIG1lc3NhZ2U6IFwiVGhpcyBpcyBub3QgYSBuZWNlc3Nhcnkgb3B0aW9uIGluIEJhYmVsIDZcIixcbiAgfSxcbiAgZXhwZXJpbWVudGFsOiB7XG4gICAgbWVzc2FnZTogXCJQdXQgdGhlIHNwZWNpZmljIHRyYW5zZm9ybXMgeW91IHdhbnQgaW4gdGhlIGBwbHVnaW5zYCBvcHRpb25cIixcbiAgfSxcbiAgZXh0ZXJuYWxIZWxwZXJzOiB7XG4gICAgbWVzc2FnZTpcbiAgICAgIFwiVXNlIHRoZSBgZXh0ZXJuYWwtaGVscGVyc2AgcGx1Z2luIGluc3RlYWQuIFwiICtcbiAgICAgIFwiQ2hlY2sgb3V0IGh0dHA6Ly9iYWJlbGpzLmlvL2RvY3MvcGx1Z2lucy9leHRlcm5hbC1oZWxwZXJzL1wiLFxuICB9LFxuICBleHRyYToge1xuICAgIG1lc3NhZ2U6IFwiXCIsXG4gIH0sXG4gIGpzeFByYWdtYToge1xuICAgIG1lc3NhZ2U6XG4gICAgICBcInVzZSB0aGUgYHByYWdtYWAgb3B0aW9uIGluIHRoZSBgcmVhY3QtanN4YCBwbHVnaW4uIFwiICtcbiAgICAgIFwiQ2hlY2sgb3V0IGh0dHA6Ly9iYWJlbGpzLmlvL2RvY3MvcGx1Z2lucy90cmFuc2Zvcm0tcmVhY3QtanN4L1wiLFxuICB9LFxuICBsb29zZToge1xuICAgIG1lc3NhZ2U6XG4gICAgICBcIlNwZWNpZnkgdGhlIGBsb29zZWAgb3B0aW9uIGZvciB0aGUgcmVsZXZhbnQgcGx1Z2luIHlvdSBhcmUgdXNpbmcgXCIgK1xuICAgICAgXCJvciB1c2UgYSBwcmVzZXQgdGhhdCBzZXRzIHRoZSBvcHRpb24uXCIsXG4gIH0sXG4gIG1ldGFkYXRhVXNlZEhlbHBlcnM6IHtcbiAgICBtZXNzYWdlOiBcIk5vdCByZXF1aXJlZCBhbnltb3JlIGFzIHRoaXMgaXMgZW5hYmxlZCBieSBkZWZhdWx0XCIsXG4gIH0sXG4gIG1vZHVsZXM6IHtcbiAgICBtZXNzYWdlOlxuICAgICAgXCJVc2UgdGhlIGNvcnJlc3BvbmRpbmcgbW9kdWxlIHRyYW5zZm9ybSBwbHVnaW4gaW4gdGhlIGBwbHVnaW5zYCBvcHRpb24uIFwiICtcbiAgICAgIFwiQ2hlY2sgb3V0IGh0dHA6Ly9iYWJlbGpzLmlvL2RvY3MvcGx1Z2lucy8jbW9kdWxlc1wiLFxuICB9LFxuICBub25TdGFuZGFyZDoge1xuICAgIG1lc3NhZ2U6XG4gICAgICBcIlVzZSB0aGUgYHJlYWN0LWpzeGAgYW5kIGBmbG93LXN0cmlwLXR5cGVzYCBwbHVnaW5zIHRvIHN1cHBvcnQgSlNYIGFuZCBGbG93LiBcIiArXG4gICAgICBcIkFsc28gY2hlY2sgb3V0IHRoZSByZWFjdCBwcmVzZXQgaHR0cDovL2JhYmVsanMuaW8vZG9jcy9wbHVnaW5zL3ByZXNldC1yZWFjdC9cIixcbiAgfSxcbiAgb3B0aW9uYWw6IHtcbiAgICBtZXNzYWdlOiBcIlB1dCB0aGUgc3BlY2lmaWMgdHJhbnNmb3JtcyB5b3Ugd2FudCBpbiB0aGUgYHBsdWdpbnNgIG9wdGlvblwiLFxuICB9LFxuICBzb3VyY2VNYXBOYW1lOiB7XG4gICAgbWVzc2FnZTpcbiAgICAgIFwiVGhlIGBzb3VyY2VNYXBOYW1lYCBvcHRpb24gaGFzIGJlZW4gcmVtb3ZlZCBiZWNhdXNlIGl0IG1ha2VzIG1vcmUgc2Vuc2UgZm9yIHRoZSBcIiArXG4gICAgICBcInRvb2xpbmcgdGhhdCBjYWxscyBCYWJlbCB0byBhc3NpZ24gYG1hcC5maWxlYCB0aGVtc2VsdmVzLlwiLFxuICB9LFxuICBzdGFnZToge1xuICAgIG1lc3NhZ2U6XG4gICAgICBcIkNoZWNrIG91dCB0aGUgY29ycmVzcG9uZGluZyBzdGFnZS14IHByZXNldHMgaHR0cDovL2JhYmVsanMuaW8vZG9jcy9wbHVnaW5zLyNwcmVzZXRzXCIsXG4gIH0sXG4gIHdoaXRlbGlzdDoge1xuICAgIG1lc3NhZ2U6IFwiUHV0IHRoZSBzcGVjaWZpYyB0cmFuc2Zvcm1zIHlvdSB3YW50IGluIHRoZSBgcGx1Z2luc2Agb3B0aW9uXCIsXG4gIH0sXG5cbiAgcmVzb2x2ZU1vZHVsZVNvdXJjZToge1xuICAgIHZlcnNpb246IDYsXG4gICAgbWVzc2FnZTogXCJVc2UgYGJhYmVsLXBsdWdpbi1tb2R1bGUtcmVzb2x2ZXJAM2AncyAncmVzb2x2ZVBhdGgnIG9wdGlvbnNcIixcbiAgfSxcbiAgbWV0YWRhdGE6IHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG1lc3NhZ2U6XG4gICAgICBcIkdlbmVyYXRlZCBwbHVnaW4gbWV0YWRhdGEgaXMgYWx3YXlzIGluY2x1ZGVkIGluIHRoZSBvdXRwdXQgcmVzdWx0XCIsXG4gIH0sXG4gIHNvdXJjZU1hcFRhcmdldDoge1xuICAgIHZlcnNpb246IDYsXG4gICAgbWVzc2FnZTpcbiAgICAgIFwiVGhlIGBzb3VyY2VNYXBUYXJnZXRgIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkIGJlY2F1c2UgaXQgbWFrZXMgbW9yZSBzZW5zZSBmb3IgdGhlIHRvb2xpbmcgXCIgK1xuICAgICAgXCJ0aGF0IGNhbGxzIEJhYmVsIHRvIGFzc2lnbiBgbWFwLmZpbGVgIHRoZW1zZWx2ZXMuXCIsXG4gIH0sXG59IGFzIHsgW25hbWU6IHN0cmluZ106IHsgdmVyc2lvbj86IG51bWJlcjsgbWVzc2FnZTogc3RyaW5nIH0gfTtcbiIsImltcG9ydCB7XG4gIGluamVjdFZpcnR1YWxTdGFja0ZyYW1lLFxuICBleHBlY3RlZEVycm9yLFxufSBmcm9tIFwiLi9yZXdyaXRlLXN0YWNrLXRyYWNlLnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGZpbGVuYW1lPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgZXhwZWN0ZWRFcnJvcih0aGlzKTtcbiAgICBpZiAoZmlsZW5hbWUpIGluamVjdFZpcnR1YWxTdGFja0ZyYW1lKHRoaXMsIGZpbGVuYW1lKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgdXNlcyB0aGUgaW50ZXJuYWwgVjggU3RhY2sgVHJhY2UgQVBJIChodHRwczovL3Y4LmRldi9kb2NzL3N0YWNrLXRyYWNlLWFwaSlcbiAqIHRvIHByb3ZpZGUgdXRpbGl0aWVzIHRvIHJld3JpdGUgdGhlIHN0YWNrIHRyYWNlLlxuICogV2hlbiB0aGlzIEFQSSBpcyBub3QgcHJlc2VudCwgYWxsIHRoZSBmdW5jdGlvbnMgaW4gdGhpcyBmaWxlIGJlY29tZSBub29wcy5cbiAqXG4gKiBiZWdpbkhpZGRlbkNhbGxTdGFjayhmbikgYW5kIGVuZEhpZGRlbkNhbGxTdGFjayhmbikgd3JhcCB0aGVpciBwYXJhbWV0ZXIgdG9cbiAqIG1hcmsgYW4gaGlkZGVuIHBvcnRpb24gb2YgdGhlIHN0YWNrIHRyYWNlLiBUaGUgZnVuY3Rpb24gcGFzc2VkIHRvXG4gKiBiZWdpbkhpZGRlbkNhbGxTdGFjayBpcyB0aGUgZmlyc3QgaGlkZGVuIGZ1bmN0aW9uLCB3aGlsZSB0aGUgZnVuY3Rpb24gcGFzc2VkXG4gKiB0byBlbmRIaWRkZW5DYWxsU3RhY2sgaXMgdGhlIGZpcnN0IHNob3duIGZ1bmN0aW9uLlxuICpcbiAqIFdoZW4gYW4gZXJyb3IgaXMgdGhyb3duIF9vdXRzaWRlXyBvZiB0aGUgaGlkZGVuIHpvbmUsIGV2ZXJ5dGhpbmcgYmV0d2VlblxuICogYmVnaW5IaWRkZW5DYWxsU3RhY2sgYW5kIGVuZEhpZGRlbkNhbGxTdGFjayB3aWxsIG5vdCBiZSBzaG93bi5cbiAqIElmIGFuIGVycm9yIGlzIHRocm93biBfaW5zaWRlXyB0aGUgaGlkZGVuIHpvbmUsIHRoZW4gdGhlIHdob2xlIHN0YWNrIHRyYWNlXG4gKiB3aWxsIGJlIHZpc2libGU6IHRoaXMgaXMgdG8gYXZvaWQgaGlkaW5nIHJlYWwgYnVncy5cbiAqIEhvd2V2ZXIsIGlmIGFuIGVycm9yIGluc2lkZSB0aGUgaGlkZGVuIHpvbmUgaXMgZXhwZWN0ZWQsIGl0IGNhbiBiZSBtYXJrZWRcbiAqIHdpdGggdGhlIGV4cGVjdGVkRXJyb3IoZXJyb3IpIGZ1bmN0aW9uIHRvIGtlZXAgdGhlIGhpZGRlbiBmcmFtZXMgaGlkZGVuLlxuICpcbiAqIENvbnNpZGVyIHRoaXMgY2FsbCBzdGFjayAodGhlIG91dGVyIGZ1bmN0aW9uIGlzIHRoZSBib3R0b20gb25lKTpcbiAqXG4gKiAgIDEuIGEoKVxuICogICAyLiBlbmRIaWRkZW5DYWxsU3RhY2soYikoKVxuICogICAzLiBjKClcbiAqICAgNC4gYmVnaW5IaWRkZW5DYWxsU3RhY2soZCkoKVxuICogICA1LiBlKClcbiAqICAgNi4gZigpXG4gKlxuICogLSBJZiBhKCkgdGhyb3dzIGFuIGVycm9yLCB0aGVuIGl0cyBzaG93biBjYWxsIHN0YWNrIHdpbGwgYmUgXCJhLCBiLCBlLCBmXCJcbiAqIC0gSWYgYigpIHRocm93cyBhbiBlcnJvciwgdGhlbiBpdHMgc2hvd24gY2FsbCBzdGFjayB3aWxsIGJlIFwiYiwgZSwgZlwiXG4gKiAtIElmIGMoKSB0aHJvd3MgYW4gZXhwZWN0ZWQgZXJyb3IsIHRoZW4gaXRzIHNob3duIGNhbGwgc3RhY2sgd2lsbCBiZSBcImUsIGZcIlxuICogLSBJZiBjKCkgdGhyb3dzIGFuIHVuZXhwZWN0ZWQgZXJyb3IsIHRoZW4gaXRzIHNob3duIGNhbGwgc3RhY2sgd2lsbCBiZSBcImMsIGQsIGUsIGZcIlxuICogLSBJZiBkKCkgdGhyb3dzIGFuIGV4cGVjdGVkIGVycm9yLCB0aGVuIGl0cyBzaG93biBjYWxsIHN0YWNrIHdpbGwgYmUgXCJlLCBmXCJcbiAqIC0gSWYgZCgpIHRocm93cyBhbiB1bmV4cGVjdGVkIGVycm9yLCB0aGVuIGl0cyBzaG93biBjYWxsIHN0YWNrIHdpbGwgYmUgXCJkLCBlLCBmXCJcbiAqIC0gSWYgZSgpIHRocm93cyBhbiBlcnJvciwgdGhlbiBpdHMgc2hvd24gY2FsbCBzdGFjayB3aWxsIGJlIFwiZSwgZlwiXG4gKlxuICogQWRkaXRpb25hbGx5LCBhbiBlcnJvciBjYW4gaW5qZWN0IGFkZGl0aW9uYWwgXCJ2aXJ0dWFsXCIgc3RhY2sgZnJhbWVzIHVzaW5nIHRoZVxuICogaW5qZWN0VmlydHVhbFN0YWNrRnJhbWUoZXJyb3IsIGZpbGVuYW1lKSBmdW5jdGlvbjogdGhvc2UgYXJlIGluamVjdGVkIGFzIGFcbiAqIHJlcGxhY2VtZW50IG9mIHRoZSBoaWRkZW4gZnJhbWVzLlxuICogSW4gdGhlIGV4YW1wbGUgYWJvdmUsIGlmIHdlIGNhbGxlZCBpbmplY3RWaXJ0dWFsU3RhY2tGcmFtZShlcnIsIFwiaFwiKSBhbmRcbiAqIGluamVjdFZpcnR1YWxTdGFja0ZyYW1lKGVyciwgXCJpXCIpIG9uIHRoZSBleHBlY3RlZCBlcnJvciB0aHJvd24gYnkgYygpLCBpdHNcbiAqIHNob3duIGNhbGwgc3RhY2sgd291bGQgaGF2ZSBiZWVuIFwiaCwgaSwgZSwgZlwiLlxuICogVGhpcyBjYW4gYmUgdXNlZnVsLCBmb3IgZXhhbXBsZSwgdG8gcmVwb3J0IGNvbmZpZyB2YWxpZGF0aW9uIGVycm9ycyBhcyBpZiB0aGV5XG4gKiB3ZXJlIGRpcmVjdGx5IHRocm93biBpbiB0aGUgY29uZmlnIGZpbGUuXG4gKi9cblxuY29uc3QgRXJyb3JUb1N0cmluZyA9IEZ1bmN0aW9uLmNhbGwuYmluZChFcnJvci5wcm90b3R5cGUudG9TdHJpbmcpO1xuXG5jb25zdCBTVVBQT1JURUQgPVxuICAhIUVycm9yLmNhcHR1cmVTdGFja1RyYWNlICYmXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRXJyb3IsIFwic3RhY2tUcmFjZUxpbWl0XCIpPy53cml0YWJsZSA9PT0gdHJ1ZTtcblxuY29uc3QgU1RBUlRfSElESU5HID0gXCJzdGFydEhpZGluZyAtIHNlY3JldCAtIGRvbid0IHVzZSB0aGlzIC0gdjFcIjtcbmNvbnN0IFNUT1BfSElESU5HID0gXCJzdG9wSGlkaW5nIC0gc2VjcmV0IC0gZG9uJ3QgdXNlIHRoaXMgLSB2MVwiO1xuXG50eXBlIENhbGxTaXRlID0gTm9kZUpTLkNhbGxTaXRlO1xuXG5jb25zdCBleHBlY3RlZEVycm9ycyA9IG5ldyBXZWFrU2V0PEVycm9yPigpO1xuY29uc3QgdmlydHVhbEZyYW1lcyA9IG5ldyBXZWFrTWFwPEVycm9yLCBDYWxsU2l0ZVtdPigpO1xuXG5mdW5jdGlvbiBDYWxsU2l0ZShmaWxlbmFtZTogc3RyaW5nKTogQ2FsbFNpdGUge1xuICAvLyBXZSBuZWVkIHRvIHVzZSBhIHByb3RvdHlwZSBvdGhlcndpc2UgaXQgYnJlYWtzIHNvdXJjZS1tYXAtc3VwcG9ydCdzIGludGVybmFsc1xuICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh7XG4gICAgaXNOYXRpdmU6ICgpID0+IGZhbHNlLFxuICAgIGlzQ29uc3RydWN0b3I6ICgpID0+IGZhbHNlLFxuICAgIGlzVG9wbGV2ZWw6ICgpID0+IHRydWUsXG4gICAgZ2V0RmlsZU5hbWU6ICgpID0+IGZpbGVuYW1lLFxuICAgIGdldExpbmVOdW1iZXI6ICgpID0+IHVuZGVmaW5lZCxcbiAgICBnZXRDb2x1bW5OdW1iZXI6ICgpID0+IHVuZGVmaW5lZCxcbiAgICBnZXRGdW5jdGlvbk5hbWU6ICgpID0+IHVuZGVmaW5lZCxcbiAgICBnZXRNZXRob2ROYW1lOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgZ2V0VHlwZU5hbWU6ICgpID0+IHVuZGVmaW5lZCxcbiAgICB0b1N0cmluZzogKCkgPT4gZmlsZW5hbWUsXG4gIH0gYXMgQ2FsbFNpdGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0VmlydHVhbFN0YWNrRnJhbWUoZXJyb3I6IEVycm9yLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gIGlmICghU1VQUE9SVEVEKSByZXR1cm47XG5cbiAgbGV0IGZyYW1lcyA9IHZpcnR1YWxGcmFtZXMuZ2V0KGVycm9yKTtcbiAgaWYgKCFmcmFtZXMpIHZpcnR1YWxGcmFtZXMuc2V0KGVycm9yLCAoZnJhbWVzID0gW10pKTtcbiAgZnJhbWVzLnB1c2goQ2FsbFNpdGUoZmlsZW5hbWUpKTtcblxuICByZXR1cm4gZXJyb3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBlY3RlZEVycm9yKGVycm9yOiBFcnJvcikge1xuICBpZiAoIVNVUFBPUlRFRCkgcmV0dXJuO1xuICBleHBlY3RlZEVycm9ycy5hZGQoZXJyb3IpO1xuICByZXR1cm4gZXJyb3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiZWdpbkhpZGRlbkNhbGxTdGFjazxBIGV4dGVuZHMgdW5rbm93bltdLCBSPihcbiAgZm46ICguLi5hcmdzOiBBKSA9PiBSLFxuKSB7XG4gIGlmICghU1VQUE9SVEVEKSByZXR1cm4gZm47XG5cbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICBmdW5jdGlvbiAoLi4uYXJnczogQSkge1xuICAgICAgc2V0dXBQcmVwYXJlU3RhY2tUcmFjZSgpO1xuICAgICAgcmV0dXJuIGZuKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgXCJuYW1lXCIsXG4gICAgeyB2YWx1ZTogU1RPUF9ISURJTkcgfSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZEhpZGRlbkNhbGxTdGFjazxBIGV4dGVuZHMgdW5rbm93bltdLCBSPihcbiAgZm46ICguLi5hcmdzOiBBKSA9PiBSLFxuKSB7XG4gIGlmICghU1VQUE9SVEVEKSByZXR1cm4gZm47XG5cbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICBmdW5jdGlvbiAoLi4uYXJnczogQSkge1xuICAgICAgcmV0dXJuIGZuKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgXCJuYW1lXCIsXG4gICAgeyB2YWx1ZTogU1RBUlRfSElESU5HIH0sXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNldHVwUHJlcGFyZVN0YWNrVHJhY2UoKSB7XG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgVGhpcyBmdW5jdGlvbiBpcyBhIHNpbmdsZXRvblxuICBzZXR1cFByZXBhcmVTdGFja1RyYWNlID0gKCkgPT4ge307XG5cbiAgY29uc3QgeyBwcmVwYXJlU3RhY2tUcmFjZSA9IGRlZmF1bHRQcmVwYXJlU3RhY2tUcmFjZSB9ID0gRXJyb3I7XG5cbiAgLy8gV2UgYWRkIHNvbWUgZXh0cmEgZnJhbWVzIHRvIEVycm9yLnN0YWNrVHJhY2VMaW1pdCwgc28gdGhhdCB3ZSBjYW5cbiAgLy8gYWx3YXlzIHNob3cgc29tZSB1c2VmdWwgZnJhbWVzIGV2ZW4gYWZ0ZXIgZGVsZXRpbmcgb3Vycy5cbiAgLy8gU1RBQ0tfVFJBQ0VfTElNSVRfREVMVEEgc2hvdWxkIGJlIGFyb3VuZCB0aGUgbWF4aW11bSBleHBlY3RlZCBudW1iZXJcbiAgLy8gb2YgaW50ZXJuYWwgZnJhbWVzLCBhbmQgbm90IHRvbyBiaWcgYmVjYXVzZSBjYXB0dXJpbmcgdGhlIHN0YWNrIHRyYWNlXG4gIC8vIGlzIHNsb3cgKHRoaXMgaXMgd2h5IEVycm9yLnN0YWNrVHJhY2VMaW1pdCBkb2VzIG5vdCBkZWZhdWx0IHRvIEluZmluaXR5ISkuXG4gIC8vIEluY3JlYXNlIGl0IGlmIG5lZWRlZC5cbiAgLy8gSG93ZXZlciwgd2Ugb25seSBkbyBpdCBpZiB0aGUgdXNlciBkaWQgbm90IGV4cGxpY2l0bHkgc2V0IGl0IHRvIDAuXG4gIGNvbnN0IE1JTl9TVEFDS19UUkFDRV9MSU1JVCA9IDUwO1xuICBFcnJvci5zdGFja1RyYWNlTGltaXQgJiY9IE1hdGgubWF4KFxuICAgIEVycm9yLnN0YWNrVHJhY2VMaW1pdCxcbiAgICBNSU5fU1RBQ0tfVFJBQ0VfTElNSVQsXG4gICk7XG5cbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBmdW5jdGlvbiBzdGFja1RyYWNlUmV3cml0ZXIoZXJyLCB0cmFjZSkge1xuICAgIGxldCBuZXdUcmFjZSA9IFtdO1xuXG4gICAgY29uc3QgaXNFeHBlY3RlZCA9IGV4cGVjdGVkRXJyb3JzLmhhcyhlcnIpO1xuICAgIGxldCBzdGF0dXM6IFwic2hvd2luZ1wiIHwgXCJoaWRpbmdcIiB8IFwidW5rbm93blwiID0gaXNFeHBlY3RlZFxuICAgICAgPyBcImhpZGluZ1wiXG4gICAgICA6IFwidW5rbm93blwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5hbWUgPSB0cmFjZVtpXS5nZXRGdW5jdGlvbk5hbWUoKTtcbiAgICAgIGlmIChuYW1lID09PSBTVEFSVF9ISURJTkcpIHtcbiAgICAgICAgc3RhdHVzID0gXCJoaWRpbmdcIjtcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gU1RPUF9ISURJTkcpIHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJoaWRpbmdcIikge1xuICAgICAgICAgIHN0YXR1cyA9IFwic2hvd2luZ1wiO1xuICAgICAgICAgIGlmICh2aXJ0dWFsRnJhbWVzLmhhcyhlcnIpKSB7XG4gICAgICAgICAgICBuZXdUcmFjZS51bnNoaWZ0KC4uLnZpcnR1YWxGcmFtZXMuZ2V0KGVycikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IFwidW5rbm93blwiKSB7XG4gICAgICAgICAgLy8gVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvciwgc2hvdyB0aGUgZnVsbCBzdGFjayB0cmFjZVxuICAgICAgICAgIG5ld1RyYWNlID0gdHJhY2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSBcImhpZGluZ1wiKSB7XG4gICAgICAgIG5ld1RyYWNlLnB1c2godHJhY2VbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwcmVwYXJlU3RhY2tUcmFjZShlcnIsIG5ld1RyYWNlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFByZXBhcmVTdGFja1RyYWNlKGVycjogRXJyb3IsIHRyYWNlOiBDYWxsU2l0ZVtdKSB7XG4gIGlmICh0cmFjZS5sZW5ndGggPT09IDApIHJldHVybiBFcnJvclRvU3RyaW5nKGVycik7XG4gIHJldHVybiBgJHtFcnJvclRvU3RyaW5nKGVycil9XFxuICAgIGF0ICR7dHJhY2Uuam9pbihcIlxcbiAgICBhdCBcIil9YDtcbn1cbiIsImltcG9ydCBzZW12ZXIgZnJvbSBcInNlbXZlclwiO1xuaW1wb3J0IHsgcHJldHRpZnlWZXJzaW9uIH0gZnJvbSBcIi4vcHJldHR5LnRzXCI7XG5pbXBvcnQge1xuICBzZW12ZXJpZnksXG4gIGlzVW5yZWxlYXNlZFZlcnNpb24sXG4gIGdldExvd2VzdEltcGxlbWVudGVkVmVyc2lvbixcbn0gZnJvbSBcIi4vdXRpbHMudHNcIjtcbmltcG9ydCB0eXBlIHsgVGFyZ2V0LCBUYXJnZXRzIH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY2x1c2lvblJlYXNvbnMoXG4gIGl0ZW06IHN0cmluZyxcbiAgdGFyZ2V0VmVyc2lvbnM6IFRhcmdldHMsXG4gIGxpc3Q6IHsgW2tleTogc3RyaW5nXTogVGFyZ2V0cyB9LFxuKSB7XG4gIGNvbnN0IG1pblZlcnNpb25zID0gbGlzdFtpdGVtXSB8fCB7fTtcblxuICByZXR1cm4gKE9iamVjdC5rZXlzKHRhcmdldFZlcnNpb25zKSBhcyBUYXJnZXRbXSkucmVkdWNlKFxuICAgIChyZXN1bHQsIGVudikgPT4ge1xuICAgICAgY29uc3QgbWluVmVyc2lvbiA9IGdldExvd2VzdEltcGxlbWVudGVkVmVyc2lvbihtaW5WZXJzaW9ucywgZW52KTtcbiAgICAgIGNvbnN0IHRhcmdldFZlcnNpb24gPSB0YXJnZXRWZXJzaW9uc1tlbnZdO1xuXG4gICAgICBpZiAoIW1pblZlcnNpb24pIHtcbiAgICAgICAgcmVzdWx0W2Vudl0gPSBwcmV0dGlmeVZlcnNpb24odGFyZ2V0VmVyc2lvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtaW5Jc1VucmVsZWFzZWQgPSBpc1VucmVsZWFzZWRWZXJzaW9uKG1pblZlcnNpb24sIGVudik7XG4gICAgICAgIGNvbnN0IHRhcmdldElzVW5yZWxlYXNlZCA9IGlzVW5yZWxlYXNlZFZlcnNpb24odGFyZ2V0VmVyc2lvbiwgZW52KTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgIXRhcmdldElzVW5yZWxlYXNlZCAmJlxuICAgICAgICAgIChtaW5Jc1VucmVsZWFzZWQgfHxcbiAgICAgICAgICAgIHNlbXZlci5sdCh0YXJnZXRWZXJzaW9uLnRvU3RyaW5nKCksIHNlbXZlcmlmeShtaW5WZXJzaW9uKSkpXG4gICAgICAgICkge1xuICAgICAgICAgIHJlc3VsdFtlbnZdID0gcHJldHRpZnlWZXJzaW9uKHRhcmdldFZlcnNpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICB7fSBhcyBQYXJ0aWFsPFJlY29yZDxUYXJnZXQsIHN0cmluZz4+LFxuICApO1xufVxuIiwiaW1wb3J0IHNlbXZlciBmcm9tIFwic2VtdmVyXCI7XG5cbmltcG9ydCBwbHVnaW5zQ29tcGF0RGF0YSBmcm9tIFwiQGJhYmVsL2NvbXBhdC1kYXRhL3BsdWdpbnNcIjtcblxuaW1wb3J0IHR5cGUgeyBUYXJnZXRzIH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcbmltcG9ydCB7XG4gIGdldExvd2VzdEltcGxlbWVudGVkVmVyc2lvbixcbiAgaXNVbnJlbGVhc2VkVmVyc2lvbixcbiAgc2VtdmVyaWZ5LFxufSBmcm9tIFwiLi91dGlscy50c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGFyZ2V0c1N1cHBvcnRlZCh0YXJnZXQ6IFRhcmdldHMsIHN1cHBvcnQ6IFRhcmdldHMpIHtcbiAgY29uc3QgdGFyZ2V0RW52aXJvbm1lbnRzID0gT2JqZWN0LmtleXModGFyZ2V0KSBhcyBBcnJheTxrZXlvZiBUYXJnZXRzPjtcblxuICBpZiAodGFyZ2V0RW52aXJvbm1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHVuc3VwcG9ydGVkRW52aXJvbm1lbnRzID0gdGFyZ2V0RW52aXJvbm1lbnRzLmZpbHRlcihlbnZpcm9ubWVudCA9PiB7XG4gICAgY29uc3QgbG93ZXN0SW1wbGVtZW50ZWRWZXJzaW9uID0gZ2V0TG93ZXN0SW1wbGVtZW50ZWRWZXJzaW9uKFxuICAgICAgc3VwcG9ydCxcbiAgICAgIGVudmlyb25tZW50LFxuICAgICk7XG5cbiAgICAvLyBGZWF0dXJlIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiB0aGF0IGVudmlyb25tZW50XG4gICAgaWYgKCFsb3dlc3RJbXBsZW1lbnRlZFZlcnNpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGxvd2VzdFRhcmdldGVkVmVyc2lvbiA9IHRhcmdldFtlbnZpcm9ubWVudF07XG5cbiAgICAvLyBJZiB0YXJnZXRzIGhhcyB1bnJlbGVhc2VkIHZhbHVlIGFzIGEgbG93ZXN0IHZlcnNpb24sIHRoZW4gZG9uJ3QgcmVxdWlyZSBhIHBsdWdpbi5cbiAgICBpZiAoaXNVbnJlbGVhc2VkVmVyc2lvbihsb3dlc3RUYXJnZXRlZFZlcnNpb24sIGVudmlyb25tZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEluY2x1ZGUgcGx1Z2luIGlmIGl0IGlzIHN1cHBvcnRlZCBpbiB0aGUgdW5yZWxlYXNlZCBlbnZpcm9ubWVudCwgd2hpY2ggd2Fzbid0IHNwZWNpZmllZCBpbiB0YXJnZXRzXG4gICAgaWYgKGlzVW5yZWxlYXNlZFZlcnNpb24obG93ZXN0SW1wbGVtZW50ZWRWZXJzaW9uLCBlbnZpcm9ubWVudCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghc2VtdmVyLnZhbGlkKGxvd2VzdFRhcmdldGVkVmVyc2lvbi50b1N0cmluZygpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCB2ZXJzaW9uIHBhc3NlZCBmb3IgdGFyZ2V0IFwiJHtlbnZpcm9ubWVudH1cIjogXCIke2xvd2VzdFRhcmdldGVkVmVyc2lvbn1cIi4gYCArXG4gICAgICAgICAgXCJWZXJzaW9ucyBtdXN0IGJlIGluIHNlbXZlciBmb3JtYXQgKG1ham9yLm1pbm9yLnBhdGNoKVwiLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VtdmVyLmd0KFxuICAgICAgc2VtdmVyaWZ5KGxvd2VzdEltcGxlbWVudGVkVmVyc2lvbiksXG4gICAgICBsb3dlc3RUYXJnZXRlZFZlcnNpb24udG9TdHJpbmcoKSxcbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gdW5zdXBwb3J0ZWRFbnZpcm9ubWVudHMubGVuZ3RoID09PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXF1aXJlZChcbiAgbmFtZTogc3RyaW5nLFxuICB0YXJnZXRzOiBUYXJnZXRzLFxuICB7XG4gICAgY29tcGF0RGF0YSA9IHBsdWdpbnNDb21wYXREYXRhLFxuICAgIGluY2x1ZGVzLFxuICAgIGV4Y2x1ZGVzLFxuICB9OiB7XG4gICAgY29tcGF0RGF0YT86IHsgW2ZlYXR1cmU6IHN0cmluZ106IFRhcmdldHMgfTtcbiAgICBpbmNsdWRlcz86IFNldDxzdHJpbmc+O1xuICAgIGV4Y2x1ZGVzPzogU2V0PHN0cmluZz47XG4gIH0gPSB7fSxcbikge1xuICBpZiAoZXhjbHVkZXM/LmhhcyhuYW1lKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoaW5jbHVkZXM/LmhhcyhuYW1lKSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiAhdGFyZ2V0c1N1cHBvcnRlZCh0YXJnZXRzLCBjb21wYXREYXRhW25hbWVdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmlsdGVySXRlbXMoXG4gIGxpc3Q6IHsgW2ZlYXR1cmU6IHN0cmluZ106IFRhcmdldHMgfSxcbiAgaW5jbHVkZXM6IFNldDxzdHJpbmc+LFxuICBleGNsdWRlczogU2V0PHN0cmluZz4sXG4gIHRhcmdldHM6IFRhcmdldHMsXG4gIGRlZmF1bHRJbmNsdWRlczogQXJyYXk8c3RyaW5nPiB8IG51bGwsXG4gIGRlZmF1bHRFeGNsdWRlcz86IEFycmF5PHN0cmluZz4gfCBudWxsLFxuICBwbHVnaW5TeW50YXhNYXA/OiBNYXA8c3RyaW5nLCBzdHJpbmcgfCBudWxsPixcbikge1xuICBjb25zdCByZXN1bHQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3Qgb3B0aW9ucyA9IHsgY29tcGF0RGF0YTogbGlzdCwgaW5jbHVkZXMsIGV4Y2x1ZGVzIH07XG5cbiAgZm9yIChjb25zdCBpdGVtIGluIGxpc3QpIHtcbiAgICBpZiAoaXNSZXF1aXJlZChpdGVtLCB0YXJnZXRzLCBvcHRpb25zKSkge1xuICAgICAgcmVzdWx0LmFkZChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKHBsdWdpblN5bnRheE1hcCkge1xuICAgICAgY29uc3Qgc2hpcHBlZFByb3Bvc2Fsc1N5bnRheCA9IHBsdWdpblN5bnRheE1hcC5nZXQoaXRlbSk7XG5cbiAgICAgIGlmIChzaGlwcGVkUHJvcG9zYWxzU3ludGF4KSB7XG4gICAgICAgIHJlc3VsdC5hZGQoc2hpcHBlZFByb3Bvc2Fsc1N5bnRheCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVmYXVsdEluY2x1ZGVzPy5mb3JFYWNoKGl0ZW0gPT4gIWV4Y2x1ZGVzLmhhcyhpdGVtKSAmJiByZXN1bHQuYWRkKGl0ZW0pKTtcbiAgZGVmYXVsdEV4Y2x1ZGVzPy5mb3JFYWNoKGl0ZW0gPT4gIWluY2x1ZGVzLmhhcyhpdGVtKSAmJiByZXN1bHQuZGVsZXRlKGl0ZW0pKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IGJyb3dzZXJzbGlzdCBmcm9tIFwiYnJvd3NlcnNsaXN0XCI7XG5pbXBvcnQgeyBmaW5kU3VnZ2VzdGlvbiB9IGZyb20gXCJAYmFiZWwvaGVscGVyLXZhbGlkYXRvci1vcHRpb25cIjtcbmltcG9ydCBicm93c2VyTW9kdWxlc0RhdGEgZnJvbSBcIkBiYWJlbC9jb21wYXQtZGF0YS9uYXRpdmUtbW9kdWxlc1wiO1xuaW1wb3J0IExydUNhY2hlIGZyb20gXCJscnUtY2FjaGVcIjtcblxuaW1wb3J0IHtcbiAgc2VtdmVyaWZ5LFxuICBzZW12ZXJNaW4sXG4gIGlzVW5yZWxlYXNlZFZlcnNpb24sXG4gIGdldExvd2VzdFVucmVsZWFzZWQsXG4gIGdldEhpZ2hlc3RVbnJlbGVhc2VkLFxufSBmcm9tIFwiLi91dGlscy50c1wiO1xuaW1wb3J0IHsgT3B0aW9uVmFsaWRhdG9yIH0gZnJvbSBcIkBiYWJlbC9oZWxwZXItdmFsaWRhdG9yLW9wdGlvblwiO1xuaW1wb3J0IHsgYnJvd3Nlck5hbWVNYXAgfSBmcm9tIFwiLi90YXJnZXRzLnRzXCI7XG5pbXBvcnQgeyBUYXJnZXROYW1lcyB9IGZyb20gXCIuL29wdGlvbnMudHNcIjtcbmltcG9ydCB0eXBlIHtcbiAgVGFyZ2V0LFxuICBUYXJnZXRzLFxuICBJbnB1dFRhcmdldHMsXG4gIEJyb3dzZXJzLFxuICBCcm93c2Vyc2xpc3RCcm93c2VyTmFtZSxcbiAgVGFyZ2V0c1R1cGxlLFxufSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG5leHBvcnQgdHlwZSB7IFRhcmdldCwgVGFyZ2V0cywgSW5wdXRUYXJnZXRzIH07XG5cbmV4cG9ydCB7IHByZXR0aWZ5VGFyZ2V0cyB9IGZyb20gXCIuL3ByZXR0eS50c1wiO1xuZXhwb3J0IHsgZ2V0SW5jbHVzaW9uUmVhc29ucyB9IGZyb20gXCIuL2RlYnVnLnRzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZpbHRlckl0ZW1zLCBpc1JlcXVpcmVkIH0gZnJvbSBcIi4vZmlsdGVyLWl0ZW1zLnRzXCI7XG5leHBvcnQgeyB1bnJlbGVhc2VkTGFiZWxzIH0gZnJvbSBcIi4vdGFyZ2V0cy50c1wiO1xuZXhwb3J0IHsgVGFyZ2V0TmFtZXMgfTtcblxuY29uc3QgRVNNX1NVUFBPUlQgPSBicm93c2VyTW9kdWxlc0RhdGFbXCJlczYubW9kdWxlXCJdO1xuXG5jb25zdCB2ID0gbmV3IE9wdGlvblZhbGlkYXRvcihQQUNLQUdFX0pTT04ubmFtZSk7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVGFyZ2V0TmFtZXModGFyZ2V0czogVGFyZ2V0cyk6IFRhcmdldHNUdXBsZSB7XG4gIGNvbnN0IHZhbGlkVGFyZ2V0cyA9IE9iamVjdC5rZXlzKFRhcmdldE5hbWVzKTtcbiAgZm9yIChjb25zdCB0YXJnZXQgb2YgT2JqZWN0LmtleXModGFyZ2V0cykpIHtcbiAgICBpZiAoISh0YXJnZXQgaW4gVGFyZ2V0TmFtZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIHYuZm9ybWF0TWVzc2FnZShgJyR7dGFyZ2V0fScgaXMgbm90IGEgdmFsaWQgdGFyZ2V0XG4tIERpZCB5b3UgbWVhbiAnJHtmaW5kU3VnZ2VzdGlvbih0YXJnZXQsIHZhbGlkVGFyZ2V0cyl9Jz9gKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jyb3dzZXJzUXVlcnlWYWxpZChicm93c2VyczogdW5rbm93bik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBicm93c2VycyA9PT0gXCJzdHJpbmdcIiB8fFxuICAgIChBcnJheS5pc0FycmF5KGJyb3dzZXJzKSAmJiBicm93c2Vycy5ldmVyeShiID0+IHR5cGVvZiBiID09PSBcInN0cmluZ1wiKSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVCcm93c2Vycyhicm93c2VyczogQnJvd3NlcnMgfCB1bmRlZmluZWQpIHtcbiAgdi5pbnZhcmlhbnQoXG4gICAgYnJvd3NlcnMgPT09IHVuZGVmaW5lZCB8fCBpc0Jyb3dzZXJzUXVlcnlWYWxpZChicm93c2VycyksXG4gICAgYCcke1N0cmluZyhicm93c2Vycyl9JyBpcyBub3QgYSB2YWxpZCBicm93c2Vyc2xpc3QgcXVlcnlgLFxuICApO1xuXG4gIHJldHVybiBicm93c2Vycztcbn1cblxuZnVuY3Rpb24gZ2V0TG93ZXN0VmVyc2lvbnMoYnJvd3NlcnM6IEFycmF5PHN0cmluZz4pOiBUYXJnZXRzIHtcbiAgcmV0dXJuIGJyb3dzZXJzLnJlZHVjZShcbiAgICAoYWxsLCBicm93c2VyKSA9PiB7XG4gICAgICBjb25zdCBbYnJvd3Nlck5hbWUsIGJyb3dzZXJWZXJzaW9uXSA9IGJyb3dzZXIuc3BsaXQoXCIgXCIpIGFzIFtcbiAgICAgICAgQnJvd3NlcnNsaXN0QnJvd3Nlck5hbWUsXG4gICAgICAgIHN0cmluZyxcbiAgICAgIF07XG4gICAgICBjb25zdCB0YXJnZXQgPSBicm93c2VyTmFtZU1hcFticm93c2VyTmFtZV07XG5cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBhbGw7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIEJyb3dzZXIgdmVyc2lvbiBjYW4gcmV0dXJuIGFzIFwiMTAuMC0xMC4yXCJcbiAgICAgICAgY29uc3Qgc3BsaXRWZXJzaW9uID0gYnJvd3NlclZlcnNpb24uc3BsaXQoXCItXCIpWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGlzU3BsaXRVbnJlbGVhc2VkID0gaXNVbnJlbGVhc2VkVmVyc2lvbihzcGxpdFZlcnNpb24sIHRhcmdldCk7XG5cbiAgICAgICAgaWYgKCFhbGxbdGFyZ2V0XSkge1xuICAgICAgICAgIGFsbFt0YXJnZXRdID0gaXNTcGxpdFVucmVsZWFzZWRcbiAgICAgICAgICAgID8gc3BsaXRWZXJzaW9uXG4gICAgICAgICAgICA6IHNlbXZlcmlmeShzcGxpdFZlcnNpb24pO1xuICAgICAgICAgIHJldHVybiBhbGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2ZXJzaW9uID0gYWxsW3RhcmdldF07XG4gICAgICAgIGNvbnN0IGlzVW5yZWxlYXNlZCA9IGlzVW5yZWxlYXNlZFZlcnNpb24odmVyc2lvbiwgdGFyZ2V0KTtcblxuICAgICAgICBpZiAoaXNVbnJlbGVhc2VkICYmIGlzU3BsaXRVbnJlbGVhc2VkKSB7XG4gICAgICAgICAgYWxsW3RhcmdldF0gPSBnZXRMb3dlc3RVbnJlbGVhc2VkKHZlcnNpb24sIHNwbGl0VmVyc2lvbiwgdGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1VucmVsZWFzZWQpIHtcbiAgICAgICAgICBhbGxbdGFyZ2V0XSA9IHNlbXZlcmlmeShzcGxpdFZlcnNpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc1VucmVsZWFzZWQgJiYgIWlzU3BsaXRVbnJlbGVhc2VkKSB7XG4gICAgICAgICAgY29uc3QgcGFyc2VkQnJvd3NlclZlcnNpb24gPSBzZW12ZXJpZnkoc3BsaXRWZXJzaW9uKTtcblxuICAgICAgICAgIGFsbFt0YXJnZXRdID0gc2VtdmVyTWluKHZlcnNpb24sIHBhcnNlZEJyb3dzZXJWZXJzaW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoXykge31cblxuICAgICAgcmV0dXJuIGFsbDtcbiAgICB9LFxuICAgIHt9IGFzIFJlY29yZDxUYXJnZXQsIHN0cmluZz4sXG4gICk7XG59XG5cbmZ1bmN0aW9uIG91dHB1dERlY2ltYWxXYXJuaW5nKFxuICBkZWNpbWFsVGFyZ2V0czogQXJyYXk8eyB0YXJnZXQ6IHN0cmluZzsgdmFsdWU6IG51bWJlciB9Pixcbikge1xuICBpZiAoIWRlY2ltYWxUYXJnZXRzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnNvbGUud2FybihcIldhcm5pbmcsIHRoZSBmb2xsb3dpbmcgdGFyZ2V0cyBhcmUgdXNpbmcgYSBkZWNpbWFsIHZlcnNpb246XFxuXCIpO1xuICBkZWNpbWFsVGFyZ2V0cy5mb3JFYWNoKCh7IHRhcmdldCwgdmFsdWUgfSkgPT5cbiAgICBjb25zb2xlLndhcm4oYCAgJHt0YXJnZXR9OiAke3ZhbHVlfWApLFxuICApO1xuICBjb25zb2xlLndhcm4oYFxuV2UgcmVjb21tZW5kIHVzaW5nIGEgc3RyaW5nIGZvciBtaW5vci9wYXRjaCB2ZXJzaW9ucyB0byBhdm9pZCBudW1iZXJzIGxpa2UgNi4xMFxuZ2V0dGluZyBwYXJzZWQgYXMgNi4xLCB3aGljaCBjYW4gbGVhZCB0byB1bmV4cGVjdGVkIGJlaGF2aW9yLlxuYCk7XG59XG5cbmZ1bmN0aW9uIHNlbXZlcmlmeVRhcmdldCh0YXJnZXQ6IFRhcmdldCwgdmFsdWU6IHN0cmluZykge1xuICB0cnkge1xuICAgIHJldHVybiBzZW12ZXJpZnkodmFsdWUpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgdi5mb3JtYXRNZXNzYWdlKFxuICAgICAgICBgJyR7dmFsdWV9JyBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgJ3RhcmdldHMuJHt0YXJnZXR9Jy5gLFxuICAgICAgKSxcbiAgICApO1xuICB9XG59XG5cbi8vIFBhcnNlIGBub2RlOiB0cnVlYCBhbmQgYG5vZGU6IFwiY3VycmVudFwiYCB0byB2ZXJzaW9uXG5mdW5jdGlvbiBub2RlVGFyZ2V0UGFyc2VyKHZhbHVlOiB0cnVlIHwgc3RyaW5nKSB7XG4gIGNvbnN0IHBhcnNlZCA9XG4gICAgdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IFwiY3VycmVudFwiXG4gICAgICA/IHByb2Nlc3MudmVyc2lvbnMubm9kZVxuICAgICAgOiBzZW12ZXJpZnlUYXJnZXQoXCJub2RlXCIsIHZhbHVlKTtcbiAgcmV0dXJuIFtcIm5vZGVcIiwgcGFyc2VkXSBhcyBjb25zdDtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFRhcmdldFBhcnNlcihcbiAgdGFyZ2V0OiBFeGNsdWRlPFRhcmdldCwgXCJub2RlXCI+LFxuICB2YWx1ZTogc3RyaW5nLFxuKTogcmVhZG9ubHkgW0V4Y2x1ZGU8VGFyZ2V0LCBcIm5vZGVcIj4sIHN0cmluZ10ge1xuICBjb25zdCB2ZXJzaW9uID0gaXNVbnJlbGVhc2VkVmVyc2lvbih2YWx1ZSwgdGFyZ2V0KVxuICAgID8gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgIDogc2VtdmVyaWZ5VGFyZ2V0KHRhcmdldCwgdmFsdWUpO1xuICByZXR1cm4gW3RhcmdldCwgdmVyc2lvbl0gYXMgY29uc3Q7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGFyZ2V0cyhpbnB1dFRhcmdldHM6IElucHV0VGFyZ2V0cyk6IFRhcmdldHMge1xuICBjb25zdCBpbnB1dCA9IHsgLi4uaW5wdXRUYXJnZXRzIH07XG4gIGRlbGV0ZSBpbnB1dC5lc21vZHVsZXM7XG4gIGRlbGV0ZSBpbnB1dC5icm93c2VycztcbiAgcmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVGFyZ2V0cyhxdWVyaWVzOiBCcm93c2VycywgZW52Pzogc3RyaW5nKTogVGFyZ2V0cyB7XG4gIGNvbnN0IHJlc29sdmVkID0gYnJvd3NlcnNsaXN0KHF1ZXJpZXMsIHtcbiAgICBtb2JpbGVUb0Rlc2t0b3A6IHRydWUsXG4gICAgZW52LFxuICB9KTtcbiAgcmV0dXJuIGdldExvd2VzdFZlcnNpb25zKHJlc29sdmVkKTtcbn1cblxuY29uc3QgdGFyZ2V0c0NhY2hlID0gbmV3IExydUNhY2hlKHsgbWF4OiA2NCB9KTtcblxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldHNDYWNoZWQocXVlcmllczogQnJvd3NlcnMsIGVudj86IHN0cmluZyk6IFRhcmdldHMge1xuICBjb25zdCBjYWNoZUtleSA9IHR5cGVvZiBxdWVyaWVzID09PSBcInN0cmluZ1wiID8gcXVlcmllcyA6IHF1ZXJpZXMuam9pbigpICsgZW52O1xuICBsZXQgY2FjaGVkID0gdGFyZ2V0c0NhY2hlLmdldChjYWNoZUtleSkgYXMgVGFyZ2V0cyB8IHVuZGVmaW5lZDtcbiAgaWYgKCFjYWNoZWQpIHtcbiAgICBjYWNoZWQgPSByZXNvbHZlVGFyZ2V0cyhxdWVyaWVzLCBlbnYpO1xuICAgIHRhcmdldHNDYWNoZS5zZXQoY2FjaGVLZXksIGNhY2hlZCk7XG4gIH1cbiAgcmV0dXJuIHsgLi4uY2FjaGVkIH07XG59XG5cbnR5cGUgR2V0VGFyZ2V0c09wdGlvbiA9IHtcbiAgLy8gVGhpcyBpcyBub3QgdGhlIHBhdGggb2YgdGhlIGNvbmZpZyBmaWxlLCBidXQgdGhlIHBhdGggd2hlcmUgc3RhcnQgc2VhcmNoaW5nIGl0IGZyb21cbiAgY29uZmlnUGF0aD86IHN0cmluZztcbiAgLy8gVGhlIHBhdGggb2YgdGhlIGNvbmZpZyBmaWxlXG4gIGNvbmZpZ0ZpbGU/OiBzdHJpbmc7XG4gIC8vIFRoZSBlbnYgdG8gcGFzcyB0byBicm93c2Vyc2xpc3RcbiAgYnJvd3NlcnNsaXN0RW52Pzogc3RyaW5nO1xuICAvLyB0cnVlIHRvIGRpc2FibGUgY29uZmlnIGxvYWRpbmdcbiAgaWdub3JlQnJvd3NlcnNsaXN0Q29uZmlnPzogYm9vbGVhbjtcbiAgLy8gY3VzdG9tIGhvb2sgd2hlbiBicm93c2Vyc2xpc3QgY29uZmlnIGlzIGZvdW5kXG4gIG9uQnJvd3NlcnNsaXN0Q29uZmlnRm91bmQ/OiAoY29uZmlnRmlsZTogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VGFyZ2V0cyhcbiAgaW5wdXRUYXJnZXRzOiBJbnB1dFRhcmdldHMgPSB7fSxcbiAgb3B0aW9uczogR2V0VGFyZ2V0c09wdGlvbiA9IHt9LFxuKTogVGFyZ2V0cyB7XG4gIGxldCB7IGJyb3dzZXJzLCBlc21vZHVsZXMgfSA9IGlucHV0VGFyZ2V0cztcbiAgY29uc3QgeyBjb25maWdQYXRoID0gXCIuXCIsIG9uQnJvd3NlcnNsaXN0Q29uZmlnRm91bmQgfSA9IG9wdGlvbnM7XG5cbiAgdmFsaWRhdGVCcm93c2Vycyhicm93c2Vycyk7XG5cbiAgY29uc3QgaW5wdXQgPSBnZW5lcmF0ZVRhcmdldHMoaW5wdXRUYXJnZXRzKTtcbiAgbGV0IHRhcmdldHMgPSB2YWxpZGF0ZVRhcmdldE5hbWVzKGlucHV0KTtcblxuICBjb25zdCBzaG91bGRQYXJzZUJyb3dzZXJzID0gISFicm93c2VycztcbiAgY29uc3QgaGFzVGFyZ2V0cyA9IHNob3VsZFBhcnNlQnJvd3NlcnMgfHwgT2JqZWN0LmtleXModGFyZ2V0cykubGVuZ3RoID4gMDtcbiAgY29uc3Qgc2hvdWxkU2VhcmNoRm9yQ29uZmlnID1cbiAgICAhb3B0aW9ucy5pZ25vcmVCcm93c2Vyc2xpc3RDb25maWcgJiYgIWhhc1RhcmdldHM7XG5cbiAgaWYgKCFicm93c2VycyAmJiBzaG91bGRTZWFyY2hGb3JDb25maWcpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYnJvd3NlcnNsaXN0L2Jyb3dzZXJzbGlzdC9ibG9iLzhhZTg1Y2FhOTA1ZDEzMGY0Y2E4NmY3YTk5OGE1YjYzYWJiYmU1ODIvbm9kZS5qcyNMMjQzXG4gICAgYnJvd3NlcnMgPSBwcm9jZXNzLmVudi5CUk9XU0VSU0xJU1Q7XG4gICAgaWYgKCFicm93c2Vycykge1xuICAgICAgY29uc3QgY29uZmlnRmlsZSA9XG4gICAgICAgIG9wdGlvbnMuY29uZmlnRmlsZSB8fFxuICAgICAgICBwcm9jZXNzLmVudi5CUk9XU0VSU0xJU1RfQ09ORklHIHx8XG4gICAgICAgIGJyb3dzZXJzbGlzdC5maW5kQ29uZmlnRmlsZShjb25maWdQYXRoKTtcbiAgICAgIGlmIChjb25maWdGaWxlICE9IG51bGwpIHtcbiAgICAgICAgb25Ccm93c2Vyc2xpc3RDb25maWdGb3VuZD8uKGNvbmZpZ0ZpbGUpO1xuICAgICAgICBicm93c2VycyA9IGJyb3dzZXJzbGlzdC5sb2FkQ29uZmlnKHtcbiAgICAgICAgICBjb25maWc6IGNvbmZpZ0ZpbGUsXG4gICAgICAgICAgZW52OiBvcHRpb25zLmJyb3dzZXJzbGlzdEVudixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJyb3dzZXJzID09IG51bGwpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5CQUJFTF84X0JSRUFLSU5HKSB7XG4gICAgICAgIC8vIEluIEJhYmVsIDgsIGlmIG5vIHRhcmdldHMgYXJlIHBhc3NlZCwgd2UgdXNlIGJyb3dzZXJzbGlzdCdzIGRlZmF1bHRzLlxuICAgICAgICBicm93c2VycyA9IFtcImRlZmF1bHRzXCJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgbm8gdGFyZ2V0cyBhcmUgcGFzc2VkLCB3ZSBuZWVkIHRvIG92ZXJ3cml0ZSBicm93c2Vyc2xpc3QncyBkZWZhdWx0c1xuICAgICAgICAvLyBzbyB0aGF0IHdlIGVuYWJsZSBhbGwgdHJhbnNmb3JtcyAoYWN0aW5nIGxpa2UgdGhlIG5vdyBkZXByZWNhdGVkXG4gICAgICAgIC8vIHByZXNldC1sYXRlc3QpLlxuICAgICAgICBicm93c2VycyA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGBlc21vZHVsZXNgIGFzIGEgdGFyZ2V0IGluZGljYXRlcyB0aGUgc3BlY2lmaWMgc2V0IG9mIGJyb3dzZXJzIHN1cHBvcnRpbmcgRVMgTW9kdWxlcy5cbiAgLy8gVGhlc2UgdmFsdWVzIE9WRVJSSURFIHRoZSBgYnJvd3NlcnNgIGZpZWxkLlxuICBpZiAoZXNtb2R1bGVzICYmIChlc21vZHVsZXMgIT09IFwiaW50ZXJzZWN0XCIgfHwgIWJyb3dzZXJzPy5sZW5ndGgpKSB7XG4gICAgYnJvd3NlcnMgPSBPYmplY3Qua2V5cyhFU01fU1VQUE9SVClcbiAgICAgIC5tYXAoXG4gICAgICAgIChicm93c2VyOiBrZXlvZiB0eXBlb2YgRVNNX1NVUFBPUlQpID0+XG4gICAgICAgICAgYCR7YnJvd3Nlcn0gPj0gJHtFU01fU1VQUE9SVFticm93c2VyXX1gLFxuICAgICAgKVxuICAgICAgLmpvaW4oXCIsIFwiKTtcbiAgICBlc21vZHVsZXMgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIElmIGN1cnJlbnQgdmFsdWUgb2YgYGJyb3dzZXJzYCBpcyB1bmRlZmluZWQgKGBpZ25vcmVCcm93c2Vyc2xpc3RDb25maWdgIHNob3VsZCBiZSBgZmFsc2VgKVxuICAvLyBvciBhbiBlbXB0eSBhcnJheSAod2l0aG91dCBhbnkgdXNlciBjb25maWcsIHVzZSBkZWZhdWx0IGNvbmZpZyksXG4gIC8vIHdlIGRvbid0IG5lZWQgdG8gY2FsbCBgcmVzb2x2ZVRhcmdldHNgIHRvIGV4ZWN1dGUgdGhlIHJlbGF0ZWQgbWV0aG9kcyBvZiBgYnJvd3NlcnNsaXN0YCBsaWJyYXJ5LlxuICBpZiAoYnJvd3NlcnM/Lmxlbmd0aCkge1xuICAgIGNvbnN0IHF1ZXJ5QnJvd3NlcnMgPSByZXNvbHZlVGFyZ2V0c0NhY2hlZChcbiAgICAgIGJyb3dzZXJzLFxuICAgICAgb3B0aW9ucy5icm93c2Vyc2xpc3RFbnYsXG4gICAgKTtcblxuICAgIGlmIChlc21vZHVsZXMgPT09IFwiaW50ZXJzZWN0XCIpIHtcbiAgICAgIGZvciAoY29uc3QgYnJvd3NlciBvZiBPYmplY3Qua2V5cyhxdWVyeUJyb3dzZXJzKSBhcyBUYXJnZXRbXSkge1xuICAgICAgICBpZiAoYnJvd3NlciAhPT0gXCJkZW5vXCIgJiYgYnJvd3NlciAhPT0gXCJpZVwiKSB7XG4gICAgICAgICAgY29uc3QgZXNtU3VwcG9ydFZlcnNpb24gPVxuICAgICAgICAgICAgRVNNX1NVUFBPUlRbYnJvd3NlciA9PT0gXCJvcGVyYV9tb2JpbGVcIiA/IFwib3BfbW9iXCIgOiBicm93c2VyXTtcblxuICAgICAgICAgIGlmIChlc21TdXBwb3J0VmVyc2lvbikge1xuICAgICAgICAgICAgY29uc3QgdmVyc2lvbiA9IHF1ZXJ5QnJvd3NlcnNbYnJvd3Nlcl07XG4gICAgICAgICAgICBxdWVyeUJyb3dzZXJzW2Jyb3dzZXJdID0gZ2V0SGlnaGVzdFVucmVsZWFzZWQoXG4gICAgICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgICAgICAgIHNlbXZlcmlmeShlc21TdXBwb3J0VmVyc2lvbiksXG4gICAgICAgICAgICAgIGJyb3dzZXIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgcXVlcnlCcm93c2Vyc1ticm93c2VyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHF1ZXJ5QnJvd3NlcnNbYnJvd3Nlcl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0YXJnZXRzID0gT2JqZWN0LmFzc2lnbihxdWVyeUJyb3dzZXJzLCB0YXJnZXRzKTtcbiAgfVxuXG4gIC8vIFBhcnNlIHJlbWFpbmluZyB0YXJnZXRzXG4gIGNvbnN0IHJlc3VsdDogVGFyZ2V0cyA9IHt9O1xuICBjb25zdCBkZWNpbWFsV2FybmluZ3MgPSBbXTtcbiAgZm9yIChjb25zdCB0YXJnZXQgb2YgT2JqZWN0LmtleXModGFyZ2V0cykuc29ydCgpIGFzIFRhcmdldFtdKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0YXJnZXRzW3RhcmdldF07XG5cbiAgICAvLyBXYXJuIHdoZW4gc3BlY2lmeWluZyBtaW5vci9wYXRjaCBhcyBhIGRlY2ltYWxcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmIHZhbHVlICUgMSAhPT0gMCkge1xuICAgICAgZGVjaW1hbFdhcm5pbmdzLnB1c2goeyB0YXJnZXQsIHZhbHVlIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IFtwYXJzZWRUYXJnZXQsIHBhcnNlZFZhbHVlXSA9XG4gICAgICB0YXJnZXQgPT09IFwibm9kZVwiXG4gICAgICAgID8gbm9kZVRhcmdldFBhcnNlcih2YWx1ZSlcbiAgICAgICAgOiBkZWZhdWx0VGFyZ2V0UGFyc2VyKHRhcmdldCwgdmFsdWUgYXMgc3RyaW5nKTtcblxuICAgIGlmIChwYXJzZWRWYWx1ZSkge1xuICAgICAgLy8gTWVyZ2UgKGxvd2VzdCB3aW5zKVxuICAgICAgcmVzdWx0W3BhcnNlZFRhcmdldF0gPSBwYXJzZWRWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBvdXRwdXREZWNpbWFsV2FybmluZyhkZWNpbWFsV2FybmluZ3MpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJleHBvcnQgY29uc3QgVGFyZ2V0TmFtZXMgPSB7XG4gIG5vZGU6IFwibm9kZVwiLFxuICBkZW5vOiBcImRlbm9cIixcbiAgY2hyb21lOiBcImNocm9tZVwiLFxuICBvcGVyYTogXCJvcGVyYVwiLFxuICBlZGdlOiBcImVkZ2VcIixcbiAgZmlyZWZveDogXCJmaXJlZm94XCIsXG4gIHNhZmFyaTogXCJzYWZhcmlcIixcbiAgaWU6IFwiaWVcIixcbiAgaW9zOiBcImlvc1wiLFxuICBhbmRyb2lkOiBcImFuZHJvaWRcIixcbiAgZWxlY3Ryb246IFwiZWxlY3Ryb25cIixcbiAgc2Ftc3VuZzogXCJzYW1zdW5nXCIsXG4gIHJoaW5vOiBcInJoaW5vXCIsXG4gIG9wZXJhX21vYmlsZTogXCJvcGVyYV9tb2JpbGVcIixcbn07XG4iLCJpbXBvcnQgc2VtdmVyIGZyb20gXCJzZW12ZXJcIjtcbmltcG9ydCB7IHVucmVsZWFzZWRMYWJlbHMgfSBmcm9tIFwiLi90YXJnZXRzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFRhcmdldHMsIFRhcmdldCB9IGZyb20gXCIuL3R5cGVzLnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV0dGlmeVZlcnNpb24odmVyc2lvbjogc3RyaW5nKSB7XG4gIGlmICh0eXBlb2YgdmVyc2lvbiAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiB2ZXJzaW9uO1xuICB9XG5cbiAgY29uc3QgeyBtYWpvciwgbWlub3IsIHBhdGNoIH0gPSBzZW12ZXIucGFyc2UodmVyc2lvbik7XG5cbiAgY29uc3QgcGFydHMgPSBbbWFqb3JdO1xuXG4gIGlmIChtaW5vciB8fCBwYXRjaCkge1xuICAgIHBhcnRzLnB1c2gobWlub3IpO1xuICB9XG5cbiAgaWYgKHBhdGNoKSB7XG4gICAgcGFydHMucHVzaChwYXRjaCk7XG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbihcIi5cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV0dGlmeVRhcmdldHModGFyZ2V0czogVGFyZ2V0cyk6IFRhcmdldHMge1xuICByZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0cykucmVkdWNlKChyZXN1bHRzLCB0YXJnZXQ6IFRhcmdldCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IHRhcmdldHNbdGFyZ2V0XTtcblxuICAgIGNvbnN0IHVucmVsZWFzZWRMYWJlbCA9XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHVuZGVmaW5lZCBpcyBzdHJpY3RseSBjb21wYXJlZCB3aXRoIHN0cmluZyBsYXRlclxuICAgICAgdW5yZWxlYXNlZExhYmVsc1t0YXJnZXRdO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdW5yZWxlYXNlZExhYmVsICE9PSB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSBwcmV0dGlmeVZlcnNpb24odmFsdWUpO1xuICAgIH1cblxuICAgIHJlc3VsdHNbdGFyZ2V0XSA9IHZhbHVlO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9LCB7fSBhcyBUYXJnZXRzKTtcbn1cbiIsImV4cG9ydCBjb25zdCB1bnJlbGVhc2VkTGFiZWxzID0ge1xuICBzYWZhcmk6IFwidHBcIixcbn0gYXMgY29uc3Q7XG5cbi8vIE1hcCBmcm9tIGJyb3dzZXJzbGlzdHxAbWRuL2Jyb3dzZXItY29tcGF0LWRhdGEgYnJvd3NlciBuYW1lcyB0byBAa2FuZ2F4L2NvbXBhdC10YWJsZSBicm93c2VyIG5hbWVzXG5leHBvcnQgY29uc3QgYnJvd3Nlck5hbWVNYXAgPSB7XG4gIGFuZF9jaHI6IFwiY2hyb21lXCIsXG4gIGFuZF9mZjogXCJmaXJlZm94XCIsXG4gIGFuZHJvaWQ6IFwiYW5kcm9pZFwiLFxuICBjaHJvbWU6IFwiY2hyb21lXCIsXG4gIGVkZ2U6IFwiZWRnZVwiLFxuICBmaXJlZm94OiBcImZpcmVmb3hcIixcbiAgaWU6IFwiaWVcIixcbiAgaWVfbW9iOiBcImllXCIsXG4gIGlvc19zYWY6IFwiaW9zXCIsXG4gIG5vZGU6IFwibm9kZVwiLFxuICBkZW5vOiBcImRlbm9cIixcbiAgb3BfbW9iOiBcIm9wZXJhX21vYmlsZVwiLFxuICBvcGVyYTogXCJvcGVyYVwiLFxuICBzYWZhcmk6IFwic2FmYXJpXCIsXG4gIHNhbXN1bmc6IFwic2Ftc3VuZ1wiLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgQnJvd3NlcnNsaXN0QnJvd3Nlck5hbWUgPSBrZXlvZiB0eXBlb2YgYnJvd3Nlck5hbWVNYXA7XG4iLCJpbXBvcnQgc2VtdmVyIGZyb20gXCJzZW12ZXJcIjtcbmltcG9ydCB7IE9wdGlvblZhbGlkYXRvciB9IGZyb20gXCJAYmFiZWwvaGVscGVyLXZhbGlkYXRvci1vcHRpb25cIjtcbmltcG9ydCB7IHVucmVsZWFzZWRMYWJlbHMgfSBmcm9tIFwiLi90YXJnZXRzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFRhcmdldCwgVGFyZ2V0cyB9IGZyb20gXCIuL3R5cGVzLnRzXCI7XG5cbmNvbnN0IHZlcnNpb25SZWdFeHAgPVxuICAvXig/OlxcZCt8XFxkKD86XFxkP1teXFxkXFxuXFxyXFx1MjAyOFxcdTIwMjldXFxkK3xcXGR7Mix9KD86W15cXGRcXG5cXHJcXHUyMDI4XFx1MjAyOV1cXGQrKT8pKSQvO1xuXG5jb25zdCB2ID0gbmV3IE9wdGlvblZhbGlkYXRvcihQQUNLQUdFX0pTT04ubmFtZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZW12ZXJNaW4oXG4gIGZpcnN0OiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsLFxuICBzZWNvbmQ6IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIHJldHVybiBmaXJzdCAmJiBzZW12ZXIubHQoZmlyc3QsIHNlY29uZCkgPyBmaXJzdCA6IHNlY29uZDtcbn1cblxuLy8gQ29udmVydCB2ZXJzaW9uIHRvIGEgc2VtdmVyIHZhbHVlLlxuLy8gMi41IC0+IDIuNS4wOyAxIC0+IDEuMC4wO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbXZlcmlmeSh2ZXJzaW9uOiBudW1iZXIgfCBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodHlwZW9mIHZlcnNpb24gPT09IFwic3RyaW5nXCIgJiYgc2VtdmVyLnZhbGlkKHZlcnNpb24pKSB7XG4gICAgcmV0dXJuIHZlcnNpb247XG4gIH1cblxuICB2LmludmFyaWFudChcbiAgICB0eXBlb2YgdmVyc2lvbiA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgKHR5cGVvZiB2ZXJzaW9uID09PSBcInN0cmluZ1wiICYmIHZlcnNpb25SZWdFeHAudGVzdCh2ZXJzaW9uKSksXG4gICAgYCcke3ZlcnNpb259JyBpcyBub3QgYSB2YWxpZCB2ZXJzaW9uYCxcbiAgKTtcblxuICB2ZXJzaW9uID0gdmVyc2lvbi50b1N0cmluZygpO1xuXG4gIGxldCBwb3MgPSAwO1xuICBsZXQgbnVtID0gMDtcbiAgd2hpbGUgKChwb3MgPSB2ZXJzaW9uLmluZGV4T2YoXCIuXCIsIHBvcyArIDEpKSA+IDApIHtcbiAgICBudW0rKztcbiAgfVxuICByZXR1cm4gdmVyc2lvbiArIFwiLjBcIi5yZXBlYXQoMiAtIG51bSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VucmVsZWFzZWRWZXJzaW9uKFxuICB2ZXJzaW9uOiBzdHJpbmcgfCBudW1iZXIsXG4gIGVudjogVGFyZ2V0LFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHVucmVsZWFzZWRMYWJlbCA9XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB1bnJlbGVhc2VkTGFiZWwgd2lsbCBiZSBndWFyZGVkIGxhdGVyXG4gICAgdW5yZWxlYXNlZExhYmVsc1tlbnZdO1xuICByZXR1cm4gKFxuICAgICEhdW5yZWxlYXNlZExhYmVsICYmIHVucmVsZWFzZWRMYWJlbCA9PT0gdmVyc2lvbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvd2VzdFVucmVsZWFzZWQoYTogc3RyaW5nLCBiOiBzdHJpbmcsIGVudjogVGFyZ2V0KTogc3RyaW5nIHtcbiAgY29uc3QgdW5yZWxlYXNlZExhYmVsOlxuICAgIHwgKHR5cGVvZiB1bnJlbGVhc2VkTGFiZWxzKVtrZXlvZiB0eXBlb2YgdW5yZWxlYXNlZExhYmVsc11cbiAgICB8IHVuZGVmaW5lZCA9XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB1bnJlbGVhc2VkTGFiZWwgaXMgdW5kZWZpbmVkIHdoZW4gZW52IGlzIG5vdCBzYWZhcmlcbiAgICB1bnJlbGVhc2VkTGFiZWxzW2Vudl07XG4gIGlmIChhID09PSB1bnJlbGVhc2VkTGFiZWwpIHtcbiAgICByZXR1cm4gYjtcbiAgfVxuICBpZiAoYiA9PT0gdW5yZWxlYXNlZExhYmVsKSB7XG4gICAgcmV0dXJuIGE7XG4gIH1cbiAgcmV0dXJuIHNlbXZlck1pbihhLCBiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhpZ2hlc3RVbnJlbGVhc2VkKFxuICBhOiBzdHJpbmcsXG4gIGI6IHN0cmluZyxcbiAgZW52OiBUYXJnZXQsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gZ2V0TG93ZXN0VW5yZWxlYXNlZChhLCBiLCBlbnYpID09PSBhID8gYiA6IGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb3dlc3RJbXBsZW1lbnRlZFZlcnNpb24oXG4gIHBsdWdpbjogVGFyZ2V0cyxcbiAgZW52aXJvbm1lbnQ6IFRhcmdldCxcbik6IHN0cmluZyB7XG4gIGNvbnN0IHJlc3VsdCA9IHBsdWdpbltlbnZpcm9ubWVudF07XG4gIC8vIFdoZW4gQW5kcm9pZCBzdXBwb3J0IGRhdGEgaXMgYWJzZW50LCB1c2UgQ2hyb21lIGRhdGEgYXMgZmFsbGJhY2tcbiAgaWYgKCFyZXN1bHQgJiYgZW52aXJvbm1lbnQgPT09IFwiYW5kcm9pZFwiKSB7XG4gICAgcmV0dXJuIHBsdWdpbi5jaHJvbWU7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImNvbnN0IHsgbWluIH0gPSBNYXRoO1xuXG4vLyBhIG1pbmltYWwgbGV2ZW4gZGlzdGFuY2UgaW1wbGVtZW50YXRpb25cbi8vIGJhbGFuY2VkIG1haW50YWluYWJpbGl0eSB3aXRoIGNvZGUgc2l6ZVxuLy8gSXQgaXMgbm90IGJsYXppbmdseSBmYXN0IGJ1dCBzaG91bGQgYmUgb2theSBmb3IgQmFiZWwgdXNlciBjYXNlXG4vLyB3aGVyZSBpdCB3aWxsIGJlIHJ1biBmb3IgYXQgbW9zdCB0ZW5zIG9mIHRpbWUgb24gc3RyaW5nc1xuLy8gdGhhdCBoYXZlIGxlc3MgdGhhbiAyMCBBU0NJSSBjaGFyYWN0ZXJzXG5cbi8vIGh0dHBzOi8vcm9zZXR0YWNvZGUub3JnL3dpa2kvTGV2ZW5zaHRlaW5fZGlzdGFuY2UjRVM1XG5mdW5jdGlvbiBsZXZlbnNodGVpbihhOiBzdHJpbmcsIGI6IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCB0ID0gW10sXG4gICAgdTogbnVtYmVyW10gPSBbXSxcbiAgICBpLFxuICAgIGo7XG4gIGNvbnN0IG0gPSBhLmxlbmd0aCxcbiAgICBuID0gYi5sZW5ndGg7XG4gIGlmICghbSkge1xuICAgIHJldHVybiBuO1xuICB9XG4gIGlmICghbikge1xuICAgIHJldHVybiBtO1xuICB9XG4gIGZvciAoaiA9IDA7IGogPD0gbjsgaisrKSB7XG4gICAgdFtqXSA9IGo7XG4gIH1cbiAgZm9yIChpID0gMTsgaSA8PSBtOyBpKyspIHtcbiAgICBmb3IgKHUgPSBbaV0sIGogPSAxOyBqIDw9IG47IGorKykge1xuICAgICAgdVtqXSA9XG4gICAgICAgIGFbaSAtIDFdID09PSBiW2ogLSAxXSA/IHRbaiAtIDFdIDogbWluKHRbaiAtIDFdLCB0W2pdLCB1W2ogLSAxXSkgKyAxO1xuICAgIH1cbiAgICB0ID0gdTtcbiAgfVxuICByZXR1cm4gdVtuXTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIHN0cmluZyBgc3RyYCBhbmQgYW4gYXJyYXkgb2YgY2FuZGlkYXRlcyBgYXJyYCxcbiAqIHJldHVybiB0aGUgZmlyc3Qgb2YgZWxlbWVudHMgaW4gY2FuZGlkYXRlcyB0aGF0IGhhcyBtaW5pbWFsXG4gKiBMZXZlbnNodGVpbiBkaXN0YW5jZSB3aXRoIGBzdHJgLlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFN1Z2dlc3Rpb24oc3RyOiBzdHJpbmcsIGFycjogcmVhZG9ubHkgc3RyaW5nW10pOiBzdHJpbmcge1xuICBjb25zdCBkaXN0YW5jZXMgPSBhcnIubWFwPG51bWJlcj4oZWwgPT4gbGV2ZW5zaHRlaW4oZWwsIHN0cikpO1xuICByZXR1cm4gYXJyW2Rpc3RhbmNlcy5pbmRleE9mKG1pbiguLi5kaXN0YW5jZXMpKV07XG59XG4iLCJpbXBvcnQgeyBmaW5kU3VnZ2VzdGlvbiB9IGZyb20gXCIuL2ZpbmQtc3VnZ2VzdGlvbi50c1wiO1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uVmFsaWRhdG9yIHtcbiAgZGVjbGFyZSBkZXNjcmlwdG9yOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0b3I6IHN0cmluZykge1xuICAgIHRoaXMuZGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgaWYgdGhlIGdpdmVuIGBvcHRpb25zYCBmb2xsb3cgdGhlIG5hbWUgb2Yga2V5cyBkZWZpbmVkIGluIHRoZSBgVG9wTGV2ZWxPcHRpb25TaGFwZWBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHBhcmFtIHtPYmplY3R9IFRvcExldmVsT3B0aW9uU2hhcGVcbiAgICogICBBbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHZhbGlkIGtleSBuYW1lcyB0aGF0IGBvcHRpb25zYCBzaG91bGQgYmUgYWxsb3dlZCB0byBoYXZlXG4gICAqICAgVGhlIHByb3BlcnR5IHZhbHVlcyBvZiBgVG9wTGV2ZWxPcHRpb25TaGFwZWAgY2FuIGJlIGFyYml0cmFyeVxuICAgKiBAbWVtYmVyb2YgT3B0aW9uVmFsaWRhdG9yXG4gICAqL1xuICB2YWxpZGF0ZVRvcExldmVsT3B0aW9ucyhvcHRpb25zOiBvYmplY3QsIFRvcExldmVsT3B0aW9uU2hhcGU6IG9iamVjdCk6IHZvaWQge1xuICAgIGNvbnN0IHZhbGlkT3B0aW9uTmFtZXMgPSBPYmplY3Qua2V5cyhUb3BMZXZlbE9wdGlvblNoYXBlKTtcbiAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBPYmplY3Qua2V5cyhvcHRpb25zKSkge1xuICAgICAgaWYgKCF2YWxpZE9wdGlvbk5hbWVzLmluY2x1ZGVzKG9wdGlvbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIHRoaXMuZm9ybWF0TWVzc2FnZShgJyR7b3B0aW9ufScgaXMgbm90IGEgdmFsaWQgdG9wLWxldmVsIG9wdGlvbi5cbi0gRGlkIHlvdSBtZWFuICcke2ZpbmRTdWdnZXN0aW9uKG9wdGlvbiwgdmFsaWRPcHRpb25OYW1lcyl9Jz9gKSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3RlOiB3ZSBkbyBub3QgY29uc2lkZXIgcmV3cml0ZSB0aGVtIHRvIGhpZ2ggb3JkZXIgZnVuY3Rpb25zXG4gIC8vIHVudGlsIHdlIGhhdmUgdG8gc3VwcG9ydCBgdmFsaWRhdGVOdW1iZXJPcHRpb25gLlxuICB2YWxpZGF0ZUJvb2xlYW5PcHRpb248VCBleHRlbmRzIGJvb2xlYW4+KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB2YWx1ZT86IGJvb2xlYW4sXG4gICAgZGVmYXVsdFZhbHVlPzogVCxcbiAgKTogYm9vbGVhbiB8IFQge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmludmFyaWFudChcbiAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIixcbiAgICAgICAgYCcke25hbWV9JyBvcHRpb24gbXVzdCBiZSBhIGJvb2xlYW4uYCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHZhbGlkYXRlU3RyaW5nT3B0aW9uPFQgZXh0ZW5kcyBzdHJpbmc+KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB2YWx1ZT86IHN0cmluZyxcbiAgICBkZWZhdWx0VmFsdWU/OiBULFxuICApOiBzdHJpbmcgfCBUIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnZhcmlhbnQoXG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIixcbiAgICAgICAgYCcke25hbWV9JyBvcHRpb24gbXVzdCBiZSBhIHN0cmluZy5gLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIC8qKlxuICAgKiBBIGhlbHBlciBpbnRlcmZhY2UgY29waWVkIGZyb20gdGhlIGBpbnZhcmlhbnRgIG5wbSBwYWNrYWdlLlxuICAgKiBJdCB0aHJvd3MgZ2l2ZW4gYG1lc3NhZ2VgIHdoZW4gYGNvbmRpdGlvbmAgaXMgbm90IG1ldFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKiBAbWVtYmVyb2YgT3B0aW9uVmFsaWRhdG9yXG4gICAqL1xuICBpbnZhcmlhbnQoY29uZGl0aW9uOiBib29sZWFuLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMuZm9ybWF0TWVzc2FnZShtZXNzYWdlKSk7XG4gICAgfVxuICB9XG5cbiAgZm9ybWF0TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmRlc2NyaXB0b3J9OiAke21lc3NhZ2V9YDtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBjc3Mg0LrQu9Cw0YHRgdGLINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbmltcG9ydCBcIi4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2Nzc1wiO1xyXG5cclxuLy8gdmdzaWRlYmFyXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvc2lkZWJhci9qcy92Z3NpZGViYXJcIjtcclxuXHJcbi8vIGRyb3Bkb3duXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3NcIjtcclxuaW1wb3J0IFZHRHJvcGRvd24gZnJvbSBcIi4vYXBwL21vZHVsZXMvZHJvcGRvd24vanMvdmdkcm9wZG93blwiO1xyXG5cclxuLy8gbW9kYWxcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy9tb2RhbC9zY3NzL3ZnbW9kYWwuc2Nzc1wiO1xyXG5pbXBvcnQgVmdNb2RhbCBmcm9tIFwiLi9hcHAvbW9kdWxlcy9tb2RhbC9qcy92Z21vZGFsXCI7XHJcblxyXG4vLyBuYXZcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3NcIjtcclxuaW1wb3J0IFZHTmF2IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2XCI7XHJcblxyXG4vLyBmb3JtIHNlbmRlclxyXG5pbXBvcnQgVkdGb3JtU2VuZGVyIGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9qcy92Z2Zvcm1zZW5kZXJcIjtcclxuXHJcbmZ1bmN0aW9uIG9uUmVhZHkoKSB7XHJcblx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXZnLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFZHRHJvcGRvd24uaW5pdChlbGVtZW50LCB7fSlcclxuXHR9KTtcclxuXHJcblx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52Zy1uYXYnKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0VkdOYXYuaW5pdChlbGVtZW50LCB7fSlcclxuXHR9KTtcclxuXHJcblx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXZnZm9ybXNlbmRlcl0nKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0VkdGb3JtU2VuZGVyLmluaXQoZWxlbWVudCwge30pXHJcblx0fSk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvblJlYWR5KTtcclxuXHJcbmV4cG9ydCB7XHJcblx0VkdTaWRlYmFyLCBWR0Ryb3Bkb3duLCBWR05hdiwgVmdNb2RhbCwgVkdGb3JtU2VuZGVyXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9