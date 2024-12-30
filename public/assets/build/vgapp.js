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
  _route() {
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
    console.log(_this.params.ajax);

    /*Ajax[method](_this.params.ajax.route, {}, function (status, data) {
    	setData(data);
    	EventHandler.trigger(_this.element, _this.NAME_KEY + '.loaded');
    });*/
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
      this.element.classList.add(this.params.classes.general);
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
        if (!_this.form.checkValidity()) {
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
      _this.request(callback, event);
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
      route: _this.settings.action,
      method: _this.settings.method.toLowerCase(),
      data: data
    };
    if (callback && 'beforeSend' in callback) {
      (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_2__.execute)(callback.beforeSend, [event, _this]);
    }
    _utils_js_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(_this.element, EVENT_KEY_BEFORE, _this);
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
  console.log('asdsadsadv sfdsdf sdfsfsdfsdf');
}
document.addEventListener('DOMContentLoaded', onReady);

})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBa0RBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxVUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdPQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0lBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7OztBQ3JmQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTs7Ozs7Ozs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFNQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7QUMvckNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7QUM3RUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUNBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzlDQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM1S0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBOzs7Ozs7Ozs7O0FDN1VBO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUdBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUlBO0FBQ0E7O0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBR0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUdBO0FBQ0E7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBT0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTs7QUFLQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFHQTtBQUNBO0FBR0E7QUFJQTtBQUtBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFHQTs7Ozs7Ozs7Ozs7QUMxbURBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1BBOztBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6YUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeUJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWNBO0FBSUE7QUFNQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFNQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFNQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUVBO0FBSUE7QUFLQTtBQUlBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBS0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RlQTtBQUNBO0FBK0JBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBR0E7QUFFQTtBQUlBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF3SUE7QUEwQkE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUtBO0FBQ0E7QUFNQTtBQUVBO0FBS0E7QUFFQTtBQU9BO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUdBO0FBQ0E7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFNQTtBQUVBO0FBQ0E7QUFFQTtBQUtBO0FBUUE7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3plQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0VBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNpQ0E7QUFFQTtBQUlBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFFQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBU0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1S0E7QUFDQTtBQUNBO0FBT0E7QUFLQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUVBO0FBR0E7QUFNQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBRUE7QUFJQTtBQUVBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQVNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBUUE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUVBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFHQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBSUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFlQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFNQTtBQUNBO0FBS0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBRUE7QUFJQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBR0E7QUFHQTtBQUVBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBRUE7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckZBO0FBQUE7QUFBQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVdBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FML0NBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FNREE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUlBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9iYWNrZHJvcC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZGF0YS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZXZlbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2Z1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL21vZHVsZS1mbi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvb3ZlcmZsb3cuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3BhcmFtcy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvcGxhY2VtZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9yZXNwb25zaXZlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9iYXNlLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd24uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9tb2RhbC9qcy92Z21vZGFsLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvanMvdmdmb3Jtc2VuZGVyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmduYXYvanMvdmduYXYuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvYnJvd3NlcnNsaXN0L2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvYnJvd3NlcnNsaXN0L2Vycm9yLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJzbGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9icm93c2Vyc2xpc3QvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvY2FuaXVzZS1saXRlL2RhdGEvYWdlbnRzLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Nhbml1c2UtbGl0ZS9kYXRhL2Jyb3dzZXJWZXJzaW9ucy5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9jYW5pdXNlLWxpdGUvZGF0YS9icm93c2Vycy5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9jYW5pdXNlLWxpdGUvZGlzdC91bnBhY2tlci9hZ2VudHMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvY2FuaXVzZS1saXRlL2Rpc3QvdW5wYWNrZXIvYnJvd3NlclZlcnNpb25zLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2Nhbml1c2UtbGl0ZS9kaXN0L3VucGFja2VyL2Jyb3dzZXJzLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXRvLWNocm9taXVtL3ZlcnNpb25zLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL2xydS1jYWNoZS9pbmRleC5qcyIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9zZW12ZXIvc2VtdmVyLmpzIiwid2VicGFjazovL3ZnLy4vbm9kZV9tb2R1bGVzL3lhbGxpc3QvaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMveWFsbGlzdC95YWxsaXN0LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2Nzcz8yMmZhIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3M/MjE3YyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL21vZGFsL3Njc3Mvdmdtb2RhbC5zY3NzPzQ2YjIiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9zaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3M/ZTQ4YiIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L3Njc3MvdmduYXYuc2Nzcz8xOWJjIiwid2VicGFjazovL3ZnL2lnbm9yZWR8RDpcXE9TUGFuZWxcXGhvbWVcXHBsdWdpbnNcXHZlZ2FzLWFwcFxcbm9kZV9tb2R1bGVzXFxicm93c2Vyc2xpc3R8cGF0aCIsIndlYnBhY2s6Ly92Zy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvY29tcGF0LWRhdGEvbmF0aXZlLW1vZHVsZXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9ub2RlX21vZHVsZXMvQGJhYmVsL2NvbXBhdC1kYXRhL3BsdWdpbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi4vLi4vLi4vc3JjL2NvbmZpZy92YWxpZGF0aW9uL29wdGlvbi1hc3NlcnRpb25zLnRzIiwid2VicGFjazovL3ZnLy4uLy4uLy4uL3NyYy9jb25maWcvdmFsaWRhdGlvbi9vcHRpb25zLnRzIiwid2VicGFjazovL3ZnLy4uLy4uLy4uL3NyYy9jb25maWcvdmFsaWRhdGlvbi9yZW1vdmVkLnRzIiwid2VicGFjazovL3ZnLy4uLy4uL3NyYy9lcnJvcnMvY29uZmlnLWVycm9yLnRzIiwid2VicGFjazovL3ZnLy4uLy4uL3NyYy9lcnJvcnMvcmV3cml0ZS1zdGFjay10cmFjZS50cyIsIndlYnBhY2s6Ly92Zy8uLi9zcmMvZGVidWcudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL2ZpbHRlci1pdGVtcy50cyIsIndlYnBhY2s6Ly92Zy8uLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL29wdGlvbnMudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL3ByZXR0eS50cyIsIndlYnBhY2s6Ly92Zy8uLi9zcmMvdGFyZ2V0cy50cyIsIndlYnBhY2s6Ly92Zy8uLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vdmcvLi4vc3JjL2ZpbmQtc3VnZ2VzdGlvbi50cyIsIndlYnBhY2s6Ly92Zy8uLi9zcmMvdmFsaWRhdG9yLnRzIiwid2VicGFjazovL3ZnL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmcvLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN1dGV9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuL2V2ZW50XCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi9vdmVyZmxvd1wiO1xyXG5cclxuY29uc3QgTkFNRSA9ICdiYWNrZHJvcCdcclxuY29uc3QgQ0xBU1NfTkFNRSA9ICd2Zy1iYWNrZHJvcCdcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnXHJcbmNvbnN0IEVWRU5UX01PVVNFRE9XTiA9IGBtb3VzZWRvd24udmcuJHtOQU1FfWBcclxuXHJcbmNsYXNzIEJhY2tkcm9wIHtcclxuXHRzdGF0aWMgc2hvdyhjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2FwcGVuZCgpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlKGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fZGVzdHJveSgpO1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2FwcGVuZCgpIHtcclxuXHRcdGlmIChTZWxlY3RvcnMuZmluZE9uZSgnLicgKyBDTEFTU19OQU1FKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUUpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKGJhY2tkcm9wKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpXHJcblx0XHR9LCA1MCk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGJhY2tkcm9wLCBFVkVOVF9NT1VTRURPV04sICgpID0+IHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZSgpXHJcblx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9kZXN0cm95KCkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBTZWxlY3RvcnMuZmluZE9uZSgnLicgKyBDTEFTU19OQU1FKTtcclxuXHRcdGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG5cclxuXHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZSgpO1xyXG5cdFx0fSwgNTAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhY2tkcm9wOyIsIi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBCb290c3RyYXAgZGF0YS5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICog0KHQutGA0LjQv9GCINGA0LDQsdC+0YLQsNC10YIg0YEg0LrQvtC70LvQtdC60YbQuNC10Lkg0LzQvtC00YPQu9C10LkuINCf0L7QtNGA0L7QsdC90LXQtSDRgtGD0YIgaHR0cHM6Ly9sZWFybi5qYXZhc2NyaXB0LnJ1L21hcC1zZXRcclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YHRgtCw0L3RgtGLXHJcbiAqL1xyXG5cclxuY29uc3QgZWxlbWVudE1hcCA9IG5ldyBNYXAoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG5cdHNldChlbGVtZW50LCBrZXksIGluc3RhbmNlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdGVsZW1lbnRNYXAuc2V0KGVsZW1lbnQsIG5ldyBNYXAoKSlcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblx0XHRpZiAoIWluc3RhbmNlTWFwLmhhcyhrZXkpICYmIGluc3RhbmNlTWFwLnNpemUgIT09IDApIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihgVkdBcHAg0L3QtSDQtNC+0L/Rg9GB0LrQsNC10YIg0LHQvtC70LXQtSDQvtC00L3QvtCz0L4g0Y3QutC30LXQvNC/0LvRj9GA0LAg0LTQu9GPINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LAuINCh0LLRj9C30LDQvdC90YvQuSDRjdC60LfQtdC80L/Qu9GP0YA6ICR7QXJyYXkuZnJvbShpbnN0YW5jZU1hcC5rZXlzKCkpWzBdfS5gKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpbnN0YW5jZU1hcC5zZXQoa2V5LCBpbnN0YW5jZSlcclxuXHR9LFxyXG5cclxuXHRnZXQoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpLmdldChrZXkpIHx8IG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH0sXHJcblxyXG5cdHJlbW92ZShlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLmRlbGV0ZShrZXkpO1xyXG5cclxuXHRcdGlmIChpbnN0YW5jZU1hcC5zaXplID09PSAwKSB7XHJcblx0XHRcdGVsZW1lbnRNYXAuZGVsZXRlKGVsZW1lbnQpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBCb290c3RyYXAgZXZlbnQuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDQtNC70Y8g0L/RgNC+0YHQu9GD0YjQuNCy0LDQvdC40Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YHRgtCw0L3RgtGLXHJcbiAqL1xyXG5cclxuY29uc3QgbmFtZXNwYWNlUmVnZXggPSAvW14uXSooPz1cXC4uKilcXC58LiovXHJcbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xyXG5jb25zdCBzdHJpcFVpZFJlZ2V4ID0gLzo6XFxkKyQvXHJcbmNvbnN0IGV2ZW50UmVnaXN0cnkgPSB7fSAvLyBFdmVudHMgc3RvcmFnZVxyXG5sZXQgdWlkRXZlbnQgPSAxXHJcbmNvbnN0IGN1c3RvbUV2ZW50cyA9IHtcclxuXHRtb3VzZWVudGVyOiAnbW91c2VvdmVyJyxcclxuXHRtb3VzZWxlYXZlOiAnbW91c2VvdXQnXHJcbn1cclxuXHJcbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xyXG5cdCdjbGljaycsXHJcblx0J2RibGNsaWNrJyxcclxuXHQnbW91c2V1cCcsXHJcblx0J21vdXNlZG93bicsXHJcblx0J2NvbnRleHRtZW51JyxcclxuXHQnbW91c2V3aGVlbCcsXHJcblx0J0RPTU1vdXNlU2Nyb2xsJyxcclxuXHQnbW91c2VvdmVyJyxcclxuXHQnbW91c2VvdXQnLFxyXG5cdCdtb3VzZW1vdmUnLFxyXG5cdCdzZWxlY3RzdGFydCcsXHJcblx0J3NlbGVjdGVuZCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2tleWRvd24nLFxyXG5cdCdrZXlwcmVzcycsXHJcblx0J2tleXVwJyxcclxuXHQnb3JpZW50YXRpb25jaGFuZ2UnLFxyXG5cdCd0b3VjaHN0YXJ0JyxcclxuXHQndG91Y2htb3ZlJyxcclxuXHQndG91Y2hlbmQnLFxyXG5cdCd0b3VjaGNhbmNlbCcsXHJcblx0J3BvaW50ZXJkb3duJyxcclxuXHQncG9pbnRlcm1vdmUnLFxyXG5cdCdwb2ludGVydXAnLFxyXG5cdCdwb2ludGVybGVhdmUnLFxyXG5cdCdwb2ludGVyY2FuY2VsJyxcclxuXHQnZ2VzdHVyZXN0YXJ0JyxcclxuXHQnZ2VzdHVyZWNoYW5nZScsXHJcblx0J2dlc3R1cmVlbmQnLFxyXG5cdCdmb2N1cycsXHJcblx0J2JsdXInLFxyXG5cdCdjaGFuZ2UnLFxyXG5cdCdyZXNldCcsXHJcblx0J3NlbGVjdCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2ZvY3VzaW4nLFxyXG5cdCdmb2N1c291dCcsXHJcblx0J2xvYWQnLFxyXG5cdCd1bmxvYWQnLFxyXG5cdCdiZWZvcmV1bmxvYWQnLFxyXG5cdCdyZXNpemUnLFxyXG5cdCdtb3ZlJyxcclxuXHQnRE9NQ29udGVudExvYWRlZCcsXHJcblx0J3JlYWR5c3RhdGVjaGFuZ2UnLFxyXG5cdCdlcnJvcicsXHJcblx0J2Fib3J0JyxcclxuXHQnc2Nyb2xsJ1xyXG5dKVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0LDRgtC90YvQtSDQvNC10YLQvtC00YtcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYWtlRXZlbnRVaWQoZWxlbWVudCwgdWlkKSB7XHJcblx0cmV0dXJuICh1aWQgJiYgYCR7dWlkfTo6JHt1aWRFdmVudCsrfWApIHx8IGVsZW1lbnQudWlkRXZlbnQgfHwgdWlkRXZlbnQrK1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpIHtcclxuXHRjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoZWxlbWVudClcclxuXHJcblx0ZWxlbWVudC51aWRFdmVudCA9IHVpZFxyXG5cdGV2ZW50UmVnaXN0cnlbdWlkXSA9IGV2ZW50UmVnaXN0cnlbdWlkXSB8fCB7fVxyXG5cclxuXHRyZXR1cm4gZXZlbnRSZWdpc3RyeVt1aWRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogZWxlbWVudCB9KVxyXG5cclxuXHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIGZuKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmbi5hcHBseShlbGVtZW50LCBbZXZlbnRdKVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgc2VsZWN0b3IsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGRvbUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxyXG5cclxuXHRcdGZvciAobGV0IHsgdGFyZ2V0IH0gPSBldmVudDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpczsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBkb21FbGVtZW50IG9mIGRvbUVsZW1lbnRzKSB7XHJcblx0XHRcdFx0aWYgKGRvbUVsZW1lbnQgIT09IHRhcmdldCkge1xyXG5cdFx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IHRhcmdldCB9KVxyXG5cclxuXHRcdFx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgc2VsZWN0b3IsIGZuKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGZuLmFwcGx5KHRhcmdldCwgW2V2ZW50XSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmluZEhhbmRsZXIoZXZlbnRzLCBjYWxsYWJsZSwgZGVsZWdhdGlvblNlbGVjdG9yID0gbnVsbCkge1xyXG5cdHJldHVybiBPYmplY3QudmFsdWVzKGV2ZW50cylcclxuXHRcdC5maW5kKGV2ZW50ID0+IGV2ZW50LmNhbGxhYmxlID09PSBjYWxsYWJsZSAmJiBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IgPT09IGRlbGVnYXRpb25TZWxlY3RvcilcclxufVxyXG5cclxuZnVuY3Rpb24gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0Y29uc3QgaXNEZWxlZ2F0ZWQgPSB0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZydcclxuXHQvLyBUT0RPOiDQstGL0LTQsNC10YIgXCJmYWxzZVwiINCy0LzQtdGB0YLQviDRgdC10LvQtdC60YLQvtGA0LAsINC/0L7RjdGC0L7QvNGDINC90YPQttC90L4g0L/RgNC+0LLQtdGA0LjRgtGMLiBib290XHJcblx0Y29uc3QgY2FsbGFibGUgPSBpc0RlbGVnYXRlZCA/IGRlbGVnYXRpb25GdW5jdGlvbiA6IChoYW5kbGVyIHx8IGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHRsZXQgdHlwZUV2ZW50ID0gZ2V0VHlwZUV2ZW50KG9yaWdpbmFsVHlwZUV2ZW50KVxyXG5cclxuXHRpZiAoIW5hdGl2ZUV2ZW50cy5oYXModHlwZUV2ZW50KSkge1xyXG5cdFx0dHlwZUV2ZW50ID0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHR9XHJcblxyXG5cdHJldHVybiBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhhbmRsZXIoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgb25lT2ZmKSB7XHJcblx0aWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0bGV0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblxyXG5cdC8vIGluIGNhc2Ugb2YgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlIHdyYXAgdGhlIGhhbmRsZXIgd2l0aGluIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgZm9yIGl0cyBET00gcG9zaXRpb25cclxuXHQvLyB0aGlzIHByZXZlbnRzIHRoZSBoYW5kbGVyIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0aGUgc2FtZSB3YXkgYXMgbW91c2VvdmVyIG9yIG1vdXNlb3V0IGRvZXNcclxuXHRpZiAob3JpZ2luYWxUeXBlRXZlbnQgaW4gY3VzdG9tRXZlbnRzKSB7XHJcblx0XHRjb25zdCB3cmFwRnVuY3Rpb24gPSBmbiA9PiB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgKGV2ZW50LnJlbGF0ZWRUYXJnZXQgIT09IGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmICFldmVudC5kZWxlZ2F0ZVRhcmdldC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxhYmxlID0gd3JhcEZ1bmN0aW9uKGNhbGxhYmxlKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxyXG5cdGNvbnN0IGhhbmRsZXJzID0gZXZlbnRzW3R5cGVFdmVudF0gfHwgKGV2ZW50c1t0eXBlRXZlbnRdID0ge30pXHJcblx0Y29uc3QgcHJldmlvdXNGdW5jdGlvbiA9IGZpbmRIYW5kbGVyKGhhbmRsZXJzLCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHJcblx0aWYgKHByZXZpb3VzRnVuY3Rpb24pIHtcclxuXHRcdHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmID0gcHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgJiYgb25lT2ZmXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoY2FsbGFibGUsIG9yaWdpbmFsVHlwZUV2ZW50LnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSlcclxuXHRjb25zdCBmbiA9IGlzRGVsZWdhdGVkID9cclxuXHRcdGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIGNhbGxhYmxlKSA6XHJcblx0XHRib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGNhbGxhYmxlKVxyXG5cclxuXHRmbi5kZWxlZ2F0aW9uU2VsZWN0b3IgPSBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsXHJcblx0Zm4uY2FsbGFibGUgPSBjYWxsYWJsZVxyXG5cdGZuLm9uZU9mZiA9IG9uZU9mZlxyXG5cdGZuLnVpZEV2ZW50ID0gdWlkXHJcblx0aGFuZGxlcnNbdWlkXSA9IGZuXHJcblxyXG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBpc0RlbGVnYXRlZClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKSB7XHJcblx0Y29uc3QgZm4gPSBmaW5kSGFuZGxlcihldmVudHNbdHlwZUV2ZW50XSwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cclxuXHRpZiAoIWZuKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBCb29sZWFuKGRlbGVnYXRpb25TZWxlY3RvcikpXHJcblx0ZGVsZXRlIGV2ZW50c1t0eXBlRXZlbnRdW2ZuLnVpZEV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIG5hbWVzcGFjZSkge1xyXG5cdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHJcblx0Zm9yIChjb25zdCBbaGFuZGxlcktleSwgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xyXG5cdFx0aWYgKGhhbmRsZXJLZXkuaW5jbHVkZXMobmFtZXNwYWNlKSkge1xyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHlwZUV2ZW50KGV2ZW50KSB7XHJcblx0Ly8gYWxsb3cgdG8gZ2V0IHRoZSBuYXRpdmUgZXZlbnRzIGZyb20gbmFtZXNwYWNlZCBldmVudHMgKCdjbGljay5icy5idXR0b24nIC0tPiAnY2xpY2snKVxyXG5cdGV2ZW50ID0gZXZlbnQucmVwbGFjZShzdHJpcE5hbWVSZWdleCwgJycpXHJcblx0cmV0dXJuIGN1c3RvbUV2ZW50c1tldmVudF0gfHwgZXZlbnRcclxufVxyXG5cclxuZnVuY3Rpb24gaHlkcmF0ZU9iaihvYmosIG1ldGEgPSB7fSkge1xyXG5cdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGEpKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRvYmpba2V5XSA9IHZhbHVlXHJcblx0XHR9IGNhdGNoIHtcclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGdldCgpIHtcclxuXHRcdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBvYmpcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNGPXHJcbiAqIEB0eXBlIHt7b25lKCosICosICosICopOiB2b2lkLCB0cmlnZ2VyKCosICosICopOiAobnVsbHwqKSwgb2ZmKCosICosICosICopOiB2b2lkLCBvbigqLCAqLCAqLCAqKTogdm9pZH19XHJcbiAqL1xyXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XHJcblx0LyoqXHJcblx0ICog0J/RgNC+0YHQu9GD0YjQuNCy0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjQuSAo0Y3Qu9C10LzQtdC90YIsINGB0L7QsdGL0YLQuNC1ICjQv9C+0LvQvdGL0Lkg0YHQv9C40YHQvtC6INGB0LzQvtGC0YDQuCDQsiDQutC+0L3RgdGC0LDQvdGC0LUgbmF0aXZlRXZlbnRzLCDQuNGB0YLQvtGH0L3QuNC6INGB0L7QsdGL0YLQuNGPINC40LvQuCDRhdC10L3QtNC70LXRgCwg0YTRg9C90LrRhtC40Y8g0L7QsdGA0LDRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCkpXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvbihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIGZhbHNlKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtGB0LvRg9GI0LjQstCw0YLQtdC70Ywg0YHQvtCx0YvRgtC40LksINC90L4g0LfQsNC80YvQutCw0LXRgtGB0Y8g0Lgg0LHQvtC70YzRiNC1INC90LUg0L/QvtCy0YLQvtGA0Y/QtdGC0YHRjyDQvdCwINGN0LvQtdC80LXQvdGC0LVcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIHRydWUpXHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0KPQtNCw0LvQtdC90LjQtSDQvtCx0YDQsNCx0L7RgtGH0LjQutCwXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvZmYoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHRcdGNvbnN0IGluTmFtZXNwYWNlID0gdHlwZUV2ZW50ICE9PSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdFx0Y29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxyXG5cdFx0Y29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxyXG5cdFx0Y29uc3QgaXNOYW1lc3BhY2UgPSBvcmlnaW5hbFR5cGVFdmVudC5zdGFydHNXaXRoKCcuJylcclxuXHJcblx0XHRpZiAodHlwZW9mIGNhbGxhYmxlICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHQvLyBTaW1wbGVzdCBjYXNlOiBoYW5kbGVyIGlzIHBhc3NlZCwgcmVtb3ZlIHRoYXQgbGlzdGVuZXIgT05MWS5cclxuXHRcdFx0aWYgKCFPYmplY3Qua2V5cyhzdG9yZUVsZW1lbnRFdmVudCkubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNOYW1lc3BhY2UpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50RXZlbnQgb2YgT2JqZWN0LmtleXMoZXZlbnRzKSkge1xyXG5cdFx0XHRcdHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIGVsZW1lbnRFdmVudCwgb3JpZ2luYWxUeXBlRXZlbnQuc2xpY2UoMSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IFtrZXlIYW5kbGVycywgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xyXG5cdFx0XHRjb25zdCBoYW5kbGVyS2V5ID0ga2V5SGFuZGxlcnMucmVwbGFjZShzdHJpcFVpZFJlZ2V4LCAnJylcclxuXHJcblx0XHRcdGlmICghaW5OYW1lc3BhY2UgfHwgb3JpZ2luYWxUeXBlRXZlbnQuaW5jbHVkZXMoaGFuZGxlcktleSkpIHtcclxuXHRcdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0YHQvtCx0YvRgtC40Y8uINCf0L7QtNGA0L7QsdC90LXQtSDRgtGD0YIgaHR0cHM6Ly9sZWFybi5qYXZhc2NyaXB0LnJ1L2Rpc3BhdGNoLWV2ZW50c1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGFyZ3NcclxuXHQgKiBAcmV0dXJucyB7KnxudWxsfVxyXG5cdCAqL1xyXG5cdHRyaWdnZXIoZWxlbWVudCwgZXZlbnQsIGFyZ3MpIHtcclxuXHRcdGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGJ1YmJsZXMgPSB0cnVlO1xyXG5cdFx0bGV0IG5hdGl2ZURpc3BhdGNoID0gdHJ1ZTtcclxuXHRcdGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3QgZXZ0ID0gaHlkcmF0ZU9iaihuZXcgRXZlbnQoZXZlbnQsIHsgYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSB9KSwgYXJncylcclxuXHJcblx0XHRpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuYXRpdmVEaXNwYXRjaCkge1xyXG5cdFx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBldnRcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlclxyXG4iLCIvKipcclxuICog0J3QsNCx0L7RgCDRgdC60YDQuNC/0YLQvtCyINC00LvRjyDRiNC40YDQvtC60L7Qs9C+INC/0YDQuNC80LXQvdC10L3QuNGPXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCV0YHQu9C4INGH0YLQvi3QvdC40LHRg9C00Ywg0LIg0L7QsdGK0LXQutGC0LVcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRW1wdHlPYmoob2JqKSB7XHJcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcclxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogaXNFbGVtZW50XHJcbiAqIEBwYXJhbSBvYmplY3RcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSBvYmplY3QgPT4ge1xyXG5cdGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHlwZW9mIG9iamVjdC5ub2RlVHlwZSAhPT0gJ3VuZGVmaW5lZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRGlzYWJsZWRcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0Rpc2FibGVkID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50IHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiBlbGVtZW50LmRpc2FibGVkICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuZGlzYWJsZWRcclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSAhPT0gJ2ZhbHNlJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1Zpc2libGUgKGVsZW1lbnQpIHtcclxuXHRpZiAoIWlzRWxlbWVudChlbGVtZW50KSB8fCBlbGVtZW50LmdldENsaWVudFJlY3RzKCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGNvbnN0IGVsZW1lbnRJc1Zpc2libGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3Zpc2liaWxpdHknKSA9PT0gJ3Zpc2libGUnXHJcblx0Y29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXHJcblxyXG5cdGlmICghY2xvc2VkRGV0YWlscykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxuXHR9XHJcblxyXG5cdGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzdW1tYXJ5ID0gZWxlbWVudC5jbG9zZXN0KCdzdW1tYXJ5JylcclxuXHRcdGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkucGFyZW50Tm9kZSAhPT0gY2xvc2VkRGV0YWlscykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc09iamVjdFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcblx0cmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC40LLQvtC00LjQvCDQsiDQv9C+0YDRj9C00L7QuiDRgtC40L/RiyDQtNCw0L3QvdGL0YVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSAge1xyXG5cdGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XHJcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0fSBjYXRjaCB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgtGLINGBINC80LDRgdGB0LjQstCwXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50QXJyYXkoYXJyLCBlbCkge1xyXG5cdHJldHVybiBhcnIuZmlsdGVyKChpdGVtKSA9PiAhZWwuaW5jbHVkZXMoaXRlbSkpO1xyXG59XHJcblxyXG4vKipcclxuICog0JPQu9GD0LHQvtC60L7QtSDQvtCx0YrQtdC00LjQvdC10L3QuNC1INC+0LHRitC10LrRgtC+0LJcclxuICogQHBhcmFtIG9iamVjdHNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZURlZXBPYmplY3QoLi4ub2JqZWN0cykge1xyXG5cdGNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxuXHJcblx0cmV0dXJuIG9iamVjdHMucmVkdWNlKChwcmV2LCBvYmopID0+IHtcclxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG5cdFx0XHRjb25zdCBwVmFsID0gcHJldltrZXldO1xyXG5cdFx0XHRjb25zdCBvVmFsID0gb2JqW2tleV07XHJcblxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwVmFsKSAmJiBBcnJheS5pc0FycmF5KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gcFZhbC5jb25jYXQoLi4ub1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoaXNPYmplY3QocFZhbCkgJiYgaXNPYmplY3Qob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBtZXJnZURlZXBPYmplY3QocFZhbCwgb1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gb1ZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHByZXY7XHJcblx0fSwge30pO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2tcclxuICogQHBhcmFtIHBvc3NpYmxlQ2FsbGJhY2tcclxuICogQHBhcmFtIGFyZ3NcclxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIGV4ZWN1dGUocG9zc2libGVDYWxsYmFjaywgYXJncyA9IFtdLCBkZWZhdWx0VmFsdWUgPSBwb3NzaWJsZUNhbGxiYWNrKSB7XHJcblx0cmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjayguLi5hcmdzKSA6IGRlZmF1bHRWYWx1ZVxyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNpdGlvblxyXG4gKiBAcGFyYW0gY2FsbGJhY2tcclxuICogQHBhcmFtIHRyYW5zaXRpb25FbGVtZW50XHJcbiAqIEBwYXJhbSB3YWl0Rm9yVHJhbnNpdGlvblxyXG4gKi9cclxuY29uc3QgVFJBTlNJVElPTl9FTkQgPSAndHJhbnNpdGlvbmVuZCc7XHJcbmNvbnN0IE1JTExJU0VDT05EU19NVUxUSVBMSUVSID0gMTAwMDtcclxuXHJcbmZ1bmN0aW9uIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gKGNhbGxiYWNrLCB0cmFuc2l0aW9uRWxlbWVudCwgd2FpdEZvclRyYW5zaXRpb24gPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRpZiAoIXdhaXRGb3JUcmFuc2l0aW9uKSB7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XHJcblx0Y29uc3QgZW11bGF0ZWREdXJhdGlvbiA9IHRpbWVPdXRNcyA/IHRpbWVPdXRNcyA6IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRyYW5zaXRpb25FbGVtZW50KSArIGR1cmF0aW9uUGFkZGluZztcclxuXHJcblx0bGV0IGNhbGxlZCA9IGZhbHNlXHJcblxyXG5cdGNvbnN0IGhhbmRsZXIgPSAoeyB0YXJnZXQgfSkgPT4ge1xyXG5cdFx0aWYgKHRhcmdldCAhPT0gdHJhbnNpdGlvbkVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGVkID0gdHJ1ZVxyXG5cdFx0dHJhbnNpdGlvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spXHJcblx0fVxyXG5cclxuXHR0cmFuc2l0aW9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0aWYgKCFjYWxsZWQpIHtcclxuXHRcdFx0dHJpZ2dlclRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkVsZW1lbnQpXHJcblx0XHR9XHJcblx0fSwgZW11bGF0ZWREdXJhdGlvbilcclxufVxyXG5cclxuY29uc3QgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBHZXQgdHJhbnNpdGlvbi1kdXJhdGlvbiBvZiB0aGUgZWxlbWVudFxyXG5cdGxldCB7IHRyYW5zaXRpb25EdXJhdGlvbiwgdHJhbnNpdGlvbkRlbGF5IH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxyXG5cclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbilcclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EZWxheSA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSlcclxuXHJcblx0Ly8gUmV0dXJuIDAgaWYgZWxlbWVudCBvciB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIG5vdCBmb3VuZFxyXG5cdGlmICghZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gJiYgIWZsb2F0VHJhbnNpdGlvbkRlbGF5KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxyXG5cdHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdCgnLCcpWzBdXHJcblx0dHJhbnNpdGlvbkRlbGF5ID0gdHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsJylbMF1cclxuXHJcblx0cmV0dXJuIChOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KSkgKiBNSUxMSVNFQ09ORFNfTVVMVElQTElFUlxyXG59XHJcblxyXG5jb25zdCB0cmlnZ2VyVHJhbnNpdGlvbkVuZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoVFJBTlNJVElPTl9FTkQpKVxyXG59XHJcblxyXG4vKipcclxuICogTm9vcFxyXG4gKi9cclxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xyXG5cclxuZXhwb3J0IHtpc0VsZW1lbnQsIGlzVmlzaWJsZSwgaXNEaXNhYmxlZCwgaXNPYmplY3QsIGlzRW1wdHlPYmosIG1lcmdlRGVlcE9iamVjdCwgcmVtb3ZlRWxlbWVudEFycmF5LCBub3JtYWxpemVEYXRhLCBleGVjdXRlLCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCBub29wfSIsImltcG9ydCB7aXNFbGVtZW50LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQnNCw0L3QuNC/0YPQu9GP0YbQuNC4INGBINCw0YLRgNC40LHRg9GC0LDQvNC4INGDINGN0LvQtdC80LXQvdGC0LA6XHJcbiAqIGdldCAo0Y3Qu9C10LzQtdC90YIsINC40LzRjywg0YTQu9Cw0LMgLSDQstGL0YDQtdC30LDRgtGMIGRhdGEtKSAtINC80LXRgtC+0LQg0LLRi9Cx0LjRgNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INCw0YLRgNC40LHRg9GC0LAg0L/QviDQtdCz0L4g0LjQvNC10L3QuCwg0LXRgdC70Lgg0LIg0L/QvtC70LUg0LjQvNC10L3QuCDQv9C10YDQtdC00LDRgtGMICdkYXRhJyAtPiDQsdGD0LTRg9GCINCy0YvQsdGA0LDQvdGLINGC0L7Qu9GM0LrQviDQtNCw0YLQsCDQsNGC0YDQuNCx0YPRgtGLLCDQtdGB0LvQuCAnYWxsJyAtPiDQvNC10YLQvtC0INCy0LXRgNC90LXRgiDQt9C90LDRh9C10L3QuNC1INCy0YHQtdGFINCw0YLRgNC40LHRg9GC0L7QslxyXG4gKiBoYXMgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0LXRgdGC0Ywg0LvQuCDQsNGC0YDQuNCx0YPRgiDRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAqIHNldCAo0Y3Qu9C10LzQtdC90YIsINC40LzRjywg0LfQvdCw0YfQtdC90LjQtSkgLSDRg9GB0YLQsNC90L7QstC60LAg0YMg0Y3Qu9C10LzQtdC90YLQsCDQsNGC0YDQuNCx0YPRgtCwINC40LvQuCDQtdCz0L4g0LjQt9C80LXQvdC10L3QuNC1XHJcbiAqIHJlbW92ZSAo0Y3Qu9C10LzQtdC90YIsINC40LzRjykgLSDRg9C00LDQu9GP0LXRgiDQsNGC0YDQuNCx0YPRgiDRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAqL1xyXG5jb25zdCBNYW5pcHVsYXRvciA9IHtcclxuXHRnZXQoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSA9ICdkYXRhJywgaXNSZW1vdmVEYXRhTmFtZSA9IHRydWUpIHtcclxuXHRcdGlmICghZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4ge31cclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmFtZUF0dHJpYnV0ZSA9PT0gJ2RhdGEnKSB7XHJcblx0XHRcdGxldCBlbG1CYXNlID0gWydkYXRhLXZnLXRvZ2dsZScsICdkYXRhLXZnLXRhcmdldCcsICdkYXRhLXZnLWRpc21pc3MnXSxcclxuXHRcdFx0XHRhdHRyaWJ1dGVzID0ge307XHJcblxyXG5cdFx0XHRsZXQgYXJyID0gW10uZmlsdGVyLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gL15kYXRhLS8udGVzdChhdC5uYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoYXJyLmxlbmd0aCkge1xyXG5cdFx0XHRcdGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdFx0XHRsZXQgbmFtZSA9IHYubmFtZTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWVsbUJhc2UuaW5jbHVkZXMobmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGlzUmVtb3ZlRGF0YU5hbWUpIG5hbWUgPSBuYW1lLnNsaWNlKDUpO1xyXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW25hbWVdID0gbm9ybWFsaXplRGF0YSh2LnZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYXR0cmlidXRlcztcclxuXHRcdH0gZWxzZSBpZiAobmFtZUF0dHJpYnV0ZSA9PT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlTmFtZXMoKS5yZWR1Y2UoKGFjYywgbmFtZSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiB7Li4uYWNjLCBbbmFtZV06IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpfTtcclxuXHRcdFx0fSwge30pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGhhcyhlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0fSxcclxuXHJcblx0c2V0KGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KGVsZW1lbnQpICYmIG5hbWUgJiYgdmFsdWUpIHtcclxuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbW92ZShlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KGVsZW1lbnQpICYmIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge01hbmlwdWxhdG9yfVxyXG4iLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuL2V2ZW50XCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNFbXB0eU9iaiwgaXNPYmplY3R9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuL3NlbGVjdG9yc1wiO1xyXG5cclxuLyoqXHJcbiAqINCi0YPRgiDRgdC+0LHRgNCw0L3RiyDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0LUg0YHQutGA0LjQv9GC0Ysg0LTQu9GPINGA0LDQsdC+0YLRiyDQvNC+0LTRg9C70LXQuVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQndCw0LHQvtGAIHN2ZyDRjdC70LXQvNC10L3RgtC+0LJcclxuICogQHBhcmFtIG5hbWVcclxuICogQHJldHVybnMgeyp8e319XHJcbiAqL1xyXG5jb25zdCBnZXRTVkcgPSAobmFtZSkgPT4ge1xyXG5cdGNvbnN0IHN2ZyA9ICB7XHJcblx0XHRlcnJvcjogJycsXHJcblx0XHRzdWNjZXNzOiAnJyxcclxuXHRcdGRvdHM6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJiaSBiaS10aHJlZS1kb3RzLXZlcnRpY2FsXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOS41IDEzYTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHpcIi8+PC9zdmc+JyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLQtdGI0LDQtdC8INGB0L7QsdGL0YLQuNC1IFwi0JfQsNC60YDRi9GC0YxcIiDQvdCwINCy0YHQtSDQvNC+0LTQsNC70LrQuCwg0YHQsNC50LTQsdCw0YDRiyDQuCDRgi7Qvy5cclxuICogQHBhcmFtIG1vZHVsZVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqL1xyXG5jb25zdCBkaXNtaXNzVHJpZ2dlciA9IChtb2R1bGUsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xyXG5cdGNvbnN0IGNsaWNrRXZlbnQgPSBgY2xpY2suZGlzbWlzcy4ke21vZHVsZS5FVkVOVF9LRVl9YFxyXG5cdGNvbnN0IG5hbWUgPSBtb2R1bGUuTkFNRTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBjbGlja0V2ZW50LCBgW2RhdGEtdmctZGlzbWlzcz1cIiR7bmFtZX1cIl1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRUYXJnZXRGcm9tU2VsZWN0b3IodGhpcykgfHwgdGhpcy5jbG9zZXN0KGAudmctJHtuYW1lfWApXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IG1vZHVsZS5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHJcblx0XHRpbnN0YW5jZVttZXRob2RdKClcclxuXHR9KVxyXG59XHJcblxyXG4vKipcclxuICogQUpBWCBSRVFVRVNUXHJcbiAqIEB0eXBlIHt7cG9zdDogYWpheC5wb3N0LCBnZXQ6IGFqYXguZ2V0LCB4OiAoKGZ1bmN0aW9uKCk6IChYTUxIdHRwUmVxdWVzdCkpfCopLCBzZW5kOiBhamF4LnNlbmR9fVxyXG4gKi9cclxuY29uc3QgQWpheCA9IHtcclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCIGh0dHAg0LfQsNC/0YDQvtGB0YtcclxuXHQgKiBAcmV0dXJucyB7WE1MSHR0cFJlcXVlc3R8Kn1cclxuXHQgKi9cclxuXHR4KCkge1xyXG5cdFx0aWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB2ZXJzaW9ucyA9IFtcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC42LjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC41LjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC40LjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC4zLjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC4yLjBcIixcclxuXHRcdFx0XCJNaWNyb3NvZnQuWG1sSHR0cFwiXHJcblx0XHRdLCB4aHI7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KHZlcnNpb25zW2ldKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4geGhyO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCe0YLQv9GA0LDQstC70Y/QtdGCINC30LDQv9GA0L7RgdGLINC4INC/0YDQuNC90LjQvNCw0LXRgiDQvtGC0LLQtdGCXHJcblx0ICogQHBhcmFtIHVybFxyXG5cdCAqIEBwYXJhbSBtZXRob2RcclxuXHQgKiBAcGFyYW0gZGF0YVxyXG5cdCAqIEBwYXJhbSBjYWxsYmFja1xyXG5cdCAqIEBwYXJhbSBhc3luY1xyXG5cdCAqL1xyXG5cdHNlbmQodXJsLCBtZXRob2QsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0aWYgKGFzeW5jID09PSB1bmRlZmluZWQpIGFzeW5jID0gdHJ1ZTtcclxuXHJcblx0XHRsZXQgeCA9IEFqYXgueCgpO1xyXG5cdFx0eC5vcGVuKG1ldGhvZCwgdXJsLCBhc3luYyk7XHJcblx0XHR4Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHgucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdHN3aXRjaCAoeC5zdGF0dXMpIHtcclxuXHRcdFx0XHRcdGNhc2UgMjAwOlxyXG5cdFx0XHRcdFx0XHRleGVjdXRlKGNhbGxiYWNrLCBbJ3N1Y2Nlc3MnLCB4LnJlc3BvbnNlVGV4dF0pO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFsnZXJyb3InLCB4LnN0YXR1c1RleHRdKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR4LnNlbmQoZGF0YSk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0J7RgtC/0YDQsNCy0LvRj9C10YIg0Lgg0L/RgNC40L3QuNC80LDQtdGCIEdFVCDQt9Cw0L/RgNC+0YHRi1xyXG5cdCAqIEBwYXJhbSB1cmxcclxuXHQgKiBAcGFyYW0gZGF0YVxyXG5cdCAqIEBwYXJhbSBjYWxsYmFja1xyXG5cdCAqIEBwYXJhbSBhc3luY1xyXG5cdCAqL1xyXG5cdGdldCh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0bGV0IHF1ZXJ5ID0gW107XHJcblxyXG5cdFx0aWYgKGlzT2JqZWN0KGRhdGEpICYmICFpc0VtcHR5T2JqKGRhdGEpKSB7XHJcblx0XHRcdGZvciAobGV0IGtleSBvZiBkYXRhKSB7XHJcblx0XHRcdFx0cXVlcnkucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5WzBdKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChrZXlbMV0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEFqYXguc2VuZCh1cmwgKyAocXVlcnkubGVuZ3RoID8gJz8nICsgcXVlcnkuam9pbignJicpIDogJycpLCAnR0VUJywgbnVsbCwgY2FsbGJhY2ssIGFzeW5jKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCe0YLQv9GA0LDQstC70Y/QtdGCINC4INC/0YDQuNC90LjQvNCw0LXRgiBQT1NUINC30LDQv9GA0L7RgdGLXHJcblx0ICogQHBhcmFtIHVybFxyXG5cdCAqIEBwYXJhbSBkYXRhXHJcblx0ICogQHBhcmFtIGNhbGxiYWNrXHJcblx0ICogQHBhcmFtIGFzeW5jXHJcblx0ICovXHJcblx0cG9zdCh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0QWpheC5zZW5kKHVybCwgY2FsbGJhY2ssICdQT1NUJywgZGF0YSwgYXN5bmMpXHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuXHRkaXNtaXNzVHJpZ2dlciwgQWpheCwgZ2V0U1ZHXHJcbn0iLCJpbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgT3ZlcmZsb3dcclxuICog0JfQsNC/0YDQtdGJ0LDQtdGCINGB0LrRgNC+0LvQu9C40L3QsyDQuCDRg9Cx0LjRgNCw0LXRgiDQtdCz0L4sINC60L7QvNC/0LXQvdGB0LjRgNGD0Y8g0L7RgtGB0YLRg9C/0L7QvFxyXG4gKi9cclxuXHJcbmNsYXNzIE92ZXJmbG93IHtcclxuXHRzdGF0aWMgYXBwZW5kKCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBnZXRXaWR0aCgpICsgJ3B4JztcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcblx0XHRmdW5jdGlvbiBnZXRXaWR0aCgpIHtcclxuXHRcdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cdFx0XHRyZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGRlc3Ryb3koKSB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG5cclxuXHRcdGxldCBzdHlsZXMgPSBNYW5pcHVsYXRvci5nZXQoZG9jdW1lbnQuYm9keSwgJ3N0eWxlJyk7XHJcblx0XHRpZiAoIXN0eWxlcykgTWFuaXB1bGF0b3IucmVtb3ZlKGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3ZlcmZsb3c7IiwiaW1wb3J0IHtpc0VsZW1lbnQsIGlzRW1wdHlPYmosIGlzT2JqZWN0LCBtZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgUGFyYW1zLCDRgdC+0LHQuNGA0LDQtdGCINCy0YHQtSBcItC/0LDRgNCw0LzQtdGC0YDRi1wiINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LksINGP0LLQu9GP0Y/RgdGMINC00LvRjyDQvdC40YUg0L7RgtC/0YDQsNCy0L3QvtC5INGC0L7Rh9C60L7QuVxyXG4gKi9cclxuXHJcbmNsYXNzIFBhcmFtcyB7XHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIHt9XHJcblx0fVxyXG5cclxuXHRfZ2V0UGFyYW1zKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0cGFyYW1zID0gdGhpcy5fbWVyZ2VQYXJhbXNPYmoocGFyYW1zLCBlbGVtZW50KVxyXG5cdFx0cGFyYW1zID0gdGhpcy5fcGFyYW1zQWZ0ZXJNZXJnZShwYXJhbXMpXHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cclxuXHRfcGFyYW1zQWZ0ZXJNZXJnZShwYXJhbXMpIHtcclxuXHRcdGxldCBwRGVmYXVsdCA9IHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCxcclxuXHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwRGVmYXVsdCwgcGFyYW1zKTtcclxuXHJcblx0XHRpZiAoaXNPYmplY3QobVBhcmFtcykgJiYgIWlzRW1wdHlPYmoobVBhcmFtcykpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBkYXR1bSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gbm9ybWFsaXplRGF0YShtUGFyYW1zW2RhdHVtXSk7XHJcblxyXG5cdFx0XHRcdGlmIChkYXR1bSAhPT0gJ3BhcmFtcycpIHtcclxuXHRcdFx0XHRcdGlmICghKGRhdHVtIGluIHBEZWZhdWx0KSkge1xyXG5cdFx0XHRcdFx0XHRsZXQgcCA9IGRhdHVtLnNwbGl0KCctJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocERlZmF1bHRbcFswXV0gJiYgcFsxXSBpbiBwRGVmYXVsdFtwWzBdXSkge1xyXG5cdFx0XHRcdFx0XHRcdHBEZWZhdWx0W3BbMF1dW3BbMV1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2RhdHVtXTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1QYXJhbXNbZGF0dW1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QobVBhcmFtcywgdmFsdWUpXHJcblx0XHRcdFx0XHRkZWxldGUgbVBhcmFtc1tkYXR1bV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG1QYXJhbXM7XHJcblx0fVxyXG5cclxuXHRfbWVyZ2VQYXJhbXNPYmoocGFyYW1zLCBlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gaXNFbGVtZW50KGVsZW1lbnQpID8gbWVyZ2VEZWVwT2JqZWN0KE1hbmlwdWxhdG9yLmdldChlbGVtZW50KSwgcGFyYW1zKSA6IHt9XHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFBhcmFtcztcclxuIiwiaW1wb3J0IHttZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgUGxhY2VtZW50LCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvNC10YHRgtC+0L/QvtC70L7QttC10L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0L3QsCDRgdGC0YDQsNC90LjRhtC1LlxyXG4gKiBUT0RPINC60LvQsNGB0YEg0L3QtSDQtNC+0L/QuNGB0LDQvVxyXG4gKi9cclxuXHJcbmNsYXNzIFBsYWNlbWVudCB7XHJcblx0Y29uc3RydWN0b3IoYXJnID0ge30pIHtcclxuXHRcdHRoaXMucGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0ZWxlbWVudDogbnVsbCxcclxuXHRcdFx0ZHJvcDogbnVsbFxyXG5cdFx0fSwgYXJnKTtcclxuXHR9XHJcblxyXG5cdF9nZXRQbGFjZW1lbnQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRjb25zdCBfcGFyZW50ID0gKHNlbGYpID0+IHtcclxuXHRcdFx0bGV0IHBhcmVudCA9IHNlbGYucGFyZW50Tm9kZSxcclxuXHRcdFx0XHRvdmVyZmxvdyA9IGdldENvbXB1dGVkU3R5bGUocGFyZW50KS5vdmVyZmxvdztcclxuXHJcblx0XHRcdGlmIChwYXJlbnQudGFnTmFtZSAhPT0gJ0JPRFknKSB7XHJcblx0XHRcdFx0aWYgKG92ZXJmbG93ID09PSAndmlzaWJsZScpIHtcclxuXHRcdFx0XHRcdF9wYXJlbnQocGFyZW50KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gcGFyZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBpc0ZpeGVkID0gZmFsc2UsIHRvcCwgbGVmdCxcclxuXHRcdFx0Ym91bmRzID0gX3RoaXMucGFyYW1zLmRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdHBhcmVudCA9IF90aGlzLnBhcmFtcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdGlmIChfcGFyZW50KF90aGlzLnBhcmFtcy5lbGVtZW50KSkge1xyXG5cdFx0XHRpc0ZpeGVkID0gdHJ1ZTtcclxuXHRcdFx0dG9wID0gYm91bmRzLnRvcDtcclxuXHRcdFx0bGVmdCA9IGJvdW5kcy5sZWZ0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoX3RoaXMucGFyYW1zLmRyb3ApO1xyXG5cdFx0XHR0b3AgPSBub3JtYWxpemVEYXRhKHN0eWxlcy50b3Auc2xpY2UoMCwgLTIpKTtcclxuXHRcdFx0bGVmdCA9IG5vcm1hbGl6ZURhdGEoc3R5bGVzLmxlZnQuc2xpY2UoMCwgLTIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoKGJvdW5kcy5sZWZ0ICsgYm91bmRzLndpZHRoKSA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdGxlZnQgPSBwYXJlbnQud2lkdGggLSBib3VuZHMud2lkdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXNGaXhlZDogaXNGaXhlZCxcclxuXHRcdFx0dG9wOiB0b3AsXHJcblx0XHRcdGxlZnQ6IGxlZnRcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYWNlbWVudDsiLCIvKipcclxuICog0JrQu9Cw0YHRgSBSZXNwb25zaXZlLCDRgNCw0LHQvtGC0LDQtdGCINC/0L4g0YLQsNC60LjQvCDQttC1INC80LXQtNC40LAg0YLQvtGH0LrQsNC8LCDRh9GC0L4g0LggYm9vdHN0cmFwXHJcbiAqINC4INC+0L/RgNC10LTQtdC70Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLlxyXG4gKi9cclxuXHJcbmNsYXNzIFJlc3BvbnNpdmUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5icmVha3BvaW50cyA9IHtcclxuXHRcdFx0eHM6IDAsXHJcblx0XHRcdHNtOiA1NzYsXHJcblx0XHRcdG1kOiA3NjgsXHJcblx0XHRcdGxnOiA5OTIsXHJcblx0XHRcdHhsOiAxMjAwLFxyXG5cdFx0XHR4eGw6IDE0MDAsXHJcblx0XHRcdHh4eGw6IDE2MDAsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JXRgdC70Lgg0L3QsNGI0LAg0YjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsCDRgdC+0LLQv9Cw0LTQsNC10YIg0YEg0LTQuNCw0L/QsNC30L7QvdC+0Lwg0LrQvtGC0L7RgNGL0Lkg0YPQutCw0LfQsNC9INCyINC80L7QtNGD0LvQtSDQstGL0LTQsNC10LwgdHJ1ZSwg0LjQvdCw0YfQtSBmYWxzZVxyXG5cdCAqIEBwYXJhbSBtb2R1bGVcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRzdGF0aWMgY2hlY2sobW9kdWxlKSB7XHJcblx0XHRsZXQgaW5zdGFuY2UgPSBuZXcgdGhpcyA7XHJcblx0XHRyZXR1cm4gaW5zdGFuY2UuZGVmaW5lKG1vZHVsZSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7QstC10YDRj9C10YIg0L3QsCDRgtCw0Ycg0YPRgdGC0YDQvtC50YHRgtCy0LAuIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0L/RgNCw0LLQuNC70YzQvdC+LCDQvdCw0LTQviDRgdC00LXQu9Cw0YLRjCDQv9C+LdC00YDRg9Cz0L7QvNGDXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrTW9iaWxlT3JUYWJsZXQoKSB7XHJcblx0XHRsZXQgY2hlY2sgPSBmYWxzZTtcclxuXHRcdChmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vfGFuZHJvaWR8aXBhZHxwbGF5Ym9va3xzaWxrL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnNsaWNlKDAsNCkpKXtcclxuXHRcdFx0XHRjaGVjayA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7XHJcblxyXG5cdFx0cmV0dXJuIGNoZWNrO1xyXG5cdH1cclxuXHJcblx0ZGVmaW5lKG1vZHVsZSkge1xyXG5cdFx0bGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGgsXHJcblx0XHRcdHJlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuX2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSksXHJcblx0XHRcdGJyZWFrcG9pbnRzID0gdGhpcy5icmVha3BvaW50cyxcclxuXHRcdFx0cG9pbnQgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cykuZmluZChrZXkgPT4gYnJlYWtwb2ludHNba2V5XSA9PT0gcmVzcG9uc2l2ZV9zaXplKTtcclxuXHJcblx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKSxcclxuXHRcdFx0bG9jID0ga2V5cy5pbmRleE9mKHBvaW50KTtcclxuXHJcblx0XHRyZXR1cm4gd2luZG93V2lkdGggPj0gYnJlYWtwb2ludHNba2V5c1tsb2MgKyAxXV07XHJcblx0fVxyXG5cclxuXHRfY2hlY2tSZXNwb25zaXZlQ2xhc3MobW9kdWxlKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IG1vZHVsZS5lbGVtZW50LFxyXG5cdFx0XHRwYXJhbXMgPSBtb2R1bGUucGFyYW1zLFxyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IDA7XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhYWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54eHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54eGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLkxHKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMubGc7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLk1EKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMubWQ7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlNNKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMuc207XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhTKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlOyIsImltcG9ydCB7aXNFbGVtZW50fSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQoNCw0LHQvtGC0LAg0YEgRE9NXHJcbiAqIFRPRE8g0L/QtdGA0LXRgNCw0LHQvtGC0LDRgtGMINC60L7QvdGB0YLQsNC90YLRgyBTZWxlY3RvcnNcclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuXHJcbmNvbnN0IHBhcnNlU2VsZWN0b3IgPSBzZWxlY3RvciA9PiB7XHJcblx0aWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3JcclxufVxyXG5cclxuY29uc3QgZ2V0U2VsZWN0b3IgPSBlbGVtZW50ID0+IHtcclxuXHRsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS12Zy10YXJnZXQnKVxyXG5cclxuXHRpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSAnIycpIHtcclxuXHRcdGxldCBocmVmQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxyXG5cdFx0aWYgKCFocmVmQXR0cmlidXRlIHx8ICghaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJy4nKSkpIHtcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG5cdFx0XHRocmVmQXR0cmlidXRlID0gYCMke2hyZWZBdHRyaWJ1dGUuc3BsaXQoJyMnKVsxXX1gXHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZWN0b3IgPSBocmVmQXR0cmlidXRlICYmIGhyZWZBdHRyaWJ1dGUgIT09ICcjJyA/IGhyZWZBdHRyaWJ1dGUudHJpbSgpIDogbnVsbFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlbGVjdG9yID8gc2VsZWN0b3Iuc3BsaXQoJywnKS5tYXAoc2VsID0+IHBhcnNlU2VsZWN0b3Ioc2VsKSkuam9pbignLCcpIDogbnVsbFxyXG59XHJcblxyXG5jb25zdCBTZWxlY3RvcnMgPSB7XHJcblx0Z2V0KGVsLCBjb250YWluZXIpIHtcclxuXHRcdGlmICghZWwpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCfQotC+0LLQsNGA0LjRiSEg0J/QtdGA0LLRi9C5INC/0LDRgNCw0LzQtdGC0YAg0L3QtSDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0L/Rg9GB0YLRi9C8IScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRsZXQgZWxtID0gaXNFbGVtZW50KGNvbnRhaW5lcikgPyBTZWxlY3RvcnMuZmluZE9uZShlbCwgY29udGFpbmVyKSA6IFNlbGVjdG9ycy5maW5kT25lKGVsKTtcclxuXHRcdFx0XHRpZiAoZWxtKSByZXR1cm4gZWxtO1xyXG5cdFx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCfQkNGF0L/QtdGAISDQndC1INGD0LTQsNC70L7RgdGMINC90LDQudGC0Lgg0Y3Qu9C10LzQtdC90YInKTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc0VsZW1lbnQoZWwpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcign0JrQrdCfISDQmtCw0LrQsNGPLdGC0L4g0LTQuNGH0Ywg0Log0L3QsNC8INC30LDQu9C10YLQtdC70LAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGZpbmRBbGwoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBbXS5jb25jYXQoLi4uRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbC5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKSlcclxuXHR9LFxyXG5cclxuXHRmaW5kT25lKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3Rvci5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKVxyXG5cdH0sXHJcblxyXG5cdHByZXYoZWxlbWVudCwgc2VsZWN0b3IpIHtcclxuXHRcdGxldCBwcmV2aW91cyA9IGVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZ1xyXG5cclxuXHRcdHdoaWxlIChwcmV2aW91cykge1xyXG5cdFx0XHRpZiAocHJldmlvdXMubWF0Y2hlcyhzZWxlY3RvcikpIHtcclxuXHRcdFx0XHRyZXR1cm4gW3ByZXZpb3VzXVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmV2aW91cyA9IHByZXZpb3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmdcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gW11cclxuXHR9LFxyXG5cclxuXHRuZXh0KGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcblx0XHRsZXQgbmV4dCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cclxuXHRcdHdoaWxlIChuZXh0KSB7XHJcblx0XHRcdGlmIChuZXh0Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtuZXh0XVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZXh0ID0gbmV4dC5uZXh0RWxlbWVudFNpYmxpbmdcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gW11cclxuXHR9LFxyXG5cclxuXHRnZXRUYXJnZXRGcm9tU2VsZWN0b3Ioc2VsZWN0b3IpIHtcclxuXHRcdGxldCBfc2VsZWN0b3IgPSBudWxsO1xyXG5cclxuXHRcdGlmIChpc0VsZW1lbnQoc2VsZWN0b3IpKSB7XHJcblx0XHRcdF9zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdF9zZWxlY3RvciA9IFNlbGVjdG9ycy5maW5kT25lKHNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGFyZ2V0ID0gZ2V0U2VsZWN0b3IoX3NlbGVjdG9yKTtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHRsZXQgX3RhcmdldFNlbGVjdG9yID0gU2VsZWN0b3JzLmZpbmRPbmUodGFyZ2V0KTtcclxuXHRcdGlmIChfdGFyZ2V0U2VsZWN0b3IpIHJldHVybiAgX3RhcmdldFNlbGVjdG9yO1xyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JzOyIsImltcG9ydCB7ZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFBhcmFtcyBmcm9tIFwiLi4vX3V0aWxzL2pzL3BhcmFtc1wiO1xyXG5pbXBvcnQgRGF0YSBmcm9tIFwiLi4vX3V0aWxzL2pzL2RhdGFcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtBamF4LCBnZXRTVkd9IGZyb20gXCIuLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcblxyXG5jbGFzcyBCYXNlTW9kdWxlIGV4dGVuZHMgUGFyYW1zIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudCA9IG51bGw7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHJcblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cdFx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblxyXG5cdFx0RGF0YS5zZXQodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZLCB0aGlzKVxyXG5cdH1cclxuXHJcblx0Z2V0IGVsZW1lbnQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudFxyXG5cdH1cclxuXHJcblx0c2V0IGVsZW1lbnQoZWwpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBTZWxlY3RvcnMuZ2V0KGVsKTtcclxuXHR9XHJcblxyXG5cdGdldCBwYXJhbXMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcGFyYW1zXHJcblx0fVxyXG5cclxuXHRzZXQgcGFyYW1zKHBhcmFtcykge1xyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKHBhcmFtcywgdGhpcy5lbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gJydcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiAnJ1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEluc3RhbmNlKGVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBEYXRhLmdldChTZWxlY3RvcnMuZ2V0KGVsZW1lbnQpLCB0aGlzLk5BTUVfS0VZKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHJldHVybiB0aGlzLmdldEluc3RhbmNlKGVsZW1lbnQpIHx8IG5ldyB0aGlzKGVsZW1lbnQsICFpc0VtcHR5T2JqKHBhcmFtcykgPyBwYXJhbXMgOiB7fSlcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHREYXRhLnJlbW92ZSh0aGlzLmVsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVkpXHJcblxyXG5cdFx0Zm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcclxuXHRcdFx0dGhpc1twcm9wZXJ0eU5hbWVdID0gbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3JvdXRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0bGV0ICRjb250ZW50ID0gbnVsbDtcclxuXHJcblx0XHRpZiAoIV90aGlzLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnYWpheCcpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISdyb3V0ZScgaW4gX3RoaXMucGFyYW1zLmFqYXggJiYgIV90aGlzLnBhcmFtcy5hamF4LnJvdXRlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ3RhcmdldCcgaW4gX3RoaXMucGFyYW1zLmFqYXggJiYgX3RoaXMucGFyYW1zLmFqYXgudGFyZ2V0KSB7XHJcblx0XHRcdCRjb250ZW50ID0gU2VsZWN0b3JzLmZpbmRPbmUoX3RoaXMucGFyYW1zLmFqYXgudGFyZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKCRjb250ZW50KSAkY29udGVudC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoISdtZXRob2QnIGluIF90aGlzLnBhcmFtcy5hamF4KSB7XHJcblx0XHRcdF90aGlzLnBhcmFtcy5hamF4Lm1ldGhvZCA9ICdnZXQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnNvbGUubG9nKF90aGlzLnBhcmFtcy5hamF4KVxyXG5cclxuXHRcdC8qQWpheFttZXRob2RdKF90aGlzLnBhcmFtcy5hamF4LnJvdXRlLCB7fSwgZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRzZXREYXRhKGRhdGEpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5lbGVtZW50LCBfdGhpcy5OQU1FX0tFWSArICcubG9hZGVkJyk7XHJcblx0XHR9KTsqL1xyXG5cdH1cclxuXHJcblx0X2Rpc21pc3NFbGVtZW50KCkge1xyXG5cdFx0bGV0IGNyb3NzID0gZ2V0U1ZHKCdjcm9zcycpLFxyXG5cdFx0XHRidXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZnLWJ0bi1jbG9zZScpO1xyXG5cclxuXHRcdGlmIChidXR0b24pIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuXHRcdFx0aWYgKCFzdmcpIGJ1dHRvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNyb3NzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9xdWV1ZUNhbGxiYWNrKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0XHRleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkLCB0aW1lT3V0TXMpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBub29wfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGxhY2VtZW50IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvcGxhY2VtZW50XCI7XHJcblxyXG5jb25zdCBOQU1FICAgICAgICAgICAgID0gJ2Ryb3Bkb3duJztcclxuY29uc3QgTkFNRV9LRVkgICAgICAgICA9ICd2Zy5kcm9wZG93bic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgPSAnZmFkZSc7XHJcbmNvbnN0IFRBUkdFVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24tY29udGVudCc7XHJcbmNvbnN0IFBBUkVOVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXSc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSBga2V5dXAuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlET1dOX0RBVEFfQVBJID0gYGtleWRvd24uJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSA9IGBtb3VzZW91dC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jb25zdCBQQVJBTVNfREVGQVVMVCA9IHtcclxuXHRvZmZzZXQ6IFswLCAyXSxcclxuXHRvdmVyOiBmYWxzZSxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0aG92ZXI6IGZhbHNlLFxyXG5cdGFqYXg6IHtcclxuXHRcdHJvdXRlOiAnJyxcclxuXHRcdHRhcmdldDogJydcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWR0Ryb3Bkb3duIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnROb2RlO1xyXG5cdFx0dGhpcy5fZHJvcCA9IFNlbGVjdG9ycy5nZXQoJy4nICsgVEFSR0VUX0NPTlRBSU5FUiwgdGhpcy5fcGFyZW50KTtcclxuXHRcdHRoaXMuX2lzUGxhY2VtZW50ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHRoaXMucGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5wYXJhbXMudGltZW91dEFuaW1hdGlvbiA9IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9pc1Nob3duKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xyXG5cdH1cclxuXHJcblx0c2hvdygpIHtcclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMuZWxlbWVudCkgfHwgdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHR0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9zZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLmVsZW1lbnQpIHx8ICF0aGlzLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRoaXMuZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRyZXR1cm4gc3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOLCByZWxhdGVkVGFyZ2V0KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fcGFyZW50LCB0cnVlLCB0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vZmZzZXQpIHtcclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUucGFkZGluZ1RvcCA9IF90aGlzLnBhcmFtcy5vZmZzZXRbMV0gKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBfdGhpcy5wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLnBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRsZXQgY3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oaW5zdGFuY2UuX3BhcmVudCwgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudCk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBQQVJFTlRfQ09OVEFJTkVSKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoIWluc3RhbmNlLl9wYXJlbnQuY29udGFpbnModGFyZ2V0KSkgcmV0dXJuO1xyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gdGFyZ2V0O1xyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oaW5zdGFuY2UuX3BhcmVudCwgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdFx0XHR3aGlsZSAocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0XHRcdFx0aWYgKHJlbGF0ZWRUYXJnZXQgPT09IGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdGluc3RhbmNlLl9jb21wbGV0ZUhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGluc3RhbmNlLl9lbGVtZW50fSk7XHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgVkdEcm9wZG93bi5rZXlkb3duSGFuZGxlcik7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSwgJy4nICsgVEFSR0VUX0NPTlRBSU5FUiwgVkdEcm9wZG93bi5rZXlkb3duSGFuZGxlcik7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHRHJvcGRvd24uY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFZHRHJvcGRvd24uY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpbnN0YW5jZS50b2dnbGUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KSB7XHJcblx0XHRjb25zdCBvcGVuVG9nZ2xlcyA9IFNlbGVjdG9ycy5maW5kQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXTpub3QoLmRpc2FibGVkKTpub3QoOmRpc2FibGVkKS5zaG93Jyk7XHJcblx0XHRmb3IgKGNvbnN0IHRvZ2dsZSBvZiBvcGVuVG9nZ2xlcykge1xyXG5cdFx0XHRjb25zdCBjb250ZXh0ID0gVkdEcm9wZG93bi5nZXRJbnN0YW5jZSh0b2dnbGUpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIHtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuJyArIFRBUkdFVF9DT05UQUlORVIpID09PSBjb250ZXh0Ll9kcm9wKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBjb21wb3NlZFBhdGggPSBldmVudC5jb21wb3NlZFBhdGgoKTtcclxuXHRcdFx0aWYgKGNvbXBvc2VkUGF0aC5pbmNsdWRlcyhjb250ZXh0Ll9lbGVtZW50KSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IGNvbnRleHQuX2VsZW1lbnQgfVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb250ZXh0Ll9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBrZXlkb3duSGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgaXNJbnB1dCA9IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXHJcblx0XHRjb25zdCBpc0VzY2FwZUV2ZW50ID0gZXZlbnQua2V5ID09PSAnRXNjYXBlJ1xyXG5cdFx0Y29uc3QgaXNVcE9yRG93bkV2ZW50ID0gWydBcnJvd1VwJywgJ0Fycm93RG93biddLmluY2x1ZGVzKGV2ZW50LmtleSlcclxuXHJcblx0XHRpZiAoIWlzVXBPckRvd25FdmVudCAmJiAhaXNFc2NhcGVFdmVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNJbnB1dCAmJiAhaXNFc2NhcGVFdmVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG5cdFx0Y29uc3QgZ2V0VG9nZ2xlQnV0dG9uID0gdGhpcy5tYXRjaGVzKFNFTEVDVE9SX0RBVEFfVE9HR0xFKSA/XHJcblx0XHRcdHRoaXMgOlxyXG5cdFx0XHQoU2VsZWN0b3JzLnByZXYodGhpcywgU0VMRUNUT1JfREFUQV9UT0dHTEUpWzBdIHx8XHJcblx0XHRcdFx0U2VsZWN0b3JzLm5leHQodGhpcywgU0VMRUNUT1JfREFUQV9UT0dHTEUpWzBdIHx8XHJcblx0XHRcdFx0U2VsZWN0b3JzLmZpbmRPbmUoU0VMRUNUT1JfREFUQV9UT0dHTEUsIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LnBhcmVudE5vZGUpKVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGdldFRvZ2dsZUJ1dHRvbilcclxuXHJcblx0XHRpZiAoaXNVcE9yRG93bkV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblx0XHRcdGluc3RhbmNlLnNob3coKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW5zdGFuY2UuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5oaWRlKClcclxuXHRcdFx0Z2V0VG9nZ2xlQnV0dG9uLmZvY3VzKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHRHJvcGRvd24uaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdEcm9wZG93bjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9vdmVyZmxvd1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdtb2RhbCc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLm1vZGFsJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcclxuY29uc3QgU0VMRUNUT1JfRElBTE9HID0gJy52Zy1tb2RhbC1kaWFsb2cnXHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwibW9kYWxcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5cclxuY29uc3QgUEFSQU1TX0RFRkFVTFQgPSAge1xyXG5cdGJ1dHRvbjogbnVsbCxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRhamF4OiB7XHJcblx0XHRyb3V0ZTogJycsXHJcblx0XHR0YXJnZXQ6ICcnXHJcblx0fVxyXG59O1xyXG5cclxuY2xhc3MgVmdNb2RhbCBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX2RpYWxvZyA9IFNlbGVjdG9ycy5maW5kT25lKFNFTEVDVE9SX0RJQUxPRywgdGhpcy5lbGVtZW50KVxyXG5cclxuXHRcdHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblx0XHR0aGlzLl9kaXNtaXNzRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIFBBUkFNU19ERUZBVUxUXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lzQW5pbWF0ZWQoKSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCAnbW91c2Vkb3duLnZnLm1vZGFsJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0Y29uc3QgbW9kYWxDb250ZW50ID0gU2VsZWN0b3JzLmdldCgnLnZnLW1vZGFsLWNvbnRlbnQnLCB0aGlzKTtcclxuXHRcdFx0XHRpZiAoIW1vZGFsQ29udGVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5faXNBbmltYXRlZCgpKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLmVsZW1lbnQsIHRoaXMuX2lzQW5pbWF0ZWQoKSk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfaXNBbmltYXRlZCgpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRkFERSlcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWZ01vZGFsKVxyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFRhcmdldEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1tb2RhbC5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VmdNb2RhbC5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRjb25zdCBkYXRhID0gVmdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVmdNb2RhbDtcclxuIiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvYmFja2Ryb3BcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZH0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9tb2R1bGUtZm5cIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnc2lkZWJhcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnNpZGViYXInO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRidXR0b246IG51bGwsXHJcblx0YmFja2Ryb3A6IHRydWUsXHJcblx0b3ZlcmZsb3c6IHRydWUsXHJcblx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHU2lkZWJhciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5hcHBlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1iYWNrZHJvcCcpLCAnbW91c2Vkb3duLnZnLmJhY2tkcm9wJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLmVsZW1lbnQsIHRydWUsIDUwKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLmVsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuZWxlbWVudCwgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMucGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKClcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdTaWRlYmFyKVxyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX0hJRERFTiwgKCkgPT4ge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0fSlcclxuXHJcblx0Y29uc3QgYWxyZWFkeU9wZW4gPSBTZWxlY3RvcnMuZmluZE9uZSgnLnZnLXNpZGViYXIuc2hvdycpXHJcblx0aWYgKGFscmVhZHlPcGVuICYmIGFscmVhZHlPcGVuICE9PSB0YXJnZXQpIHtcclxuXHRcdFZHU2lkZWJhci5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRjb25zdCBkYXRhID0gVkdTaWRlYmFyLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cdGRhdGEudG9nZ2xlKHRoaXMpXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR1NpZGViYXI7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL21hbmlwdWxhdG9yXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7dmFsaWRhdGV9IGZyb20gXCJAYmFiZWwvY29yZS9saWIvY29uZmlnL3ZhbGlkYXRpb24vb3B0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ2Zvcm0tc2VuZGVyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuZm9ybS1zZW5kZXInO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgRXZlbnRzXHJcbiAqL1xyXG5jb25zdCBFVkVOVF9LRVlfU1VDQ0VTUyA9ICd2Zy5mcy5zdWNjZXNzJztcclxuY29uc3QgRVZFTlRfS0VZX0VSUk9SICAgPSAndmcuZnMuZXJyb3InO1xyXG5jb25zdCBFVkVOVF9LRVlfQkVGT1JFICA9ICd2Zy5mcy5iZWZvcmUnO1xyXG5jb25zdCBFVkVOVF9LRVlfTE9BREVEICA9ICd2Zy5mcy5sb2FkZWQnO1xyXG5cclxuY29uc3QgRVZFTlRfU1VCTUlUX0RBVEFfQVBJID0gYHN1Ym1pdC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBQYXJhbXNcclxuICovXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRhY3Rpb246IGxvY2F0aW9uLmhyZWYsXHJcblx0bWV0aG9kOiAncG9zdCcsXHJcblx0ZmllbGRzOiBbXSxcclxuXHRyZWRpcmVjdDogbnVsbCxcclxuXHRpc0pzb25QYXJzZTogdHJ1ZSxcclxuXHRpc1ZhbGlkYXRlOiBmYWxzZSxcclxuXHRpc1N1Ym1pdDogZmFsc2UsXHJcblx0aXNCdG5UZXh0OiB0cnVlLFxyXG5cdGlzU2hvd1Bhc3M6IHRydWUsXHJcblx0YWxlcnQ6IHtcclxuXHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRkZWxheTogMzUwLFxyXG5cdFx0dHlwZTogJ21vZGFsJ1xyXG5cdH0sXHJcblx0Y2xhc3Nlczoge1xyXG5cdFx0Z2VuZXJhbDogJ3ZnLWZvcm0tc2VuZGVyJyxcclxuXHRcdHZhbGlkYXRpb246ICduZWVkcy12YWxpZGF0aW9uJyxcclxuXHRcdHdhc1ZhbGlkYXRlOiAnd2FzLXZhbGlkYXRlZCdcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWR0Zvcm1TZW5kZXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9idXR0b24gPSBudWxsO1xyXG5cdFx0dGhpcy5idXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW3R5cGU9XCJzdWJtaXRcIl0nKTtcclxuXHJcblx0XHR0aGlzLnBhcmFtcy5hY3Rpb24gPSBNYW5pcHVsYXRvci5nZXQodGhpcy5lbGVtZW50LCAnYWN0aW9uJykgfHwgdGhpcy5wYXJhbXMuYWN0aW9uO1xyXG5cdFx0dGhpcy5wYXJhbXMubWV0aG9kID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuZWxlbWVudCwgJ21ldGhvZCcpIHx8IHRoaXMucGFyYW1zLm1ldGhvZDtcclxuXHJcblx0XHR0aGlzLnBhcmFtcy5pc1ZhbGlkYXRlICA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLmVsZW1lbnQsICdkYXRhLXZhbGlkYXRlJykgPT09ICd0cnVlJztcclxuXHRcdHRoaXMucGFyYW1zLmlzU3VibWl0ICAgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuZWxlbWVudCwgJ2RhdGEtc3VibWl0JykgPT09ICd0cnVlJztcclxuXHRcdHRoaXMucGFyYW1zLmlzQnRuVGV4dCAgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuZWxlbWVudCwgJ2RhdGEtYnRuLXRleHQnKSAhPT0gJ2ZhbHNlJztcclxuXHRcdHRoaXMucGFyYW1zLmlzSnNvblBhcnNlID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuZWxlbWVudCwgJ2RhdGEtanNvbi1wYXJzZScpICE9PSAnZmFsc2UnO1xyXG5cdFx0dGhpcy5wYXJhbXMuaXNTaG93UGFzcyA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLmVsZW1lbnQsICdkYXRhLXNob3ctcGFzcycpICE9PSAnZmFsc2UnO1xyXG5cclxuXHRcdGlmICh0aGlzLnBhcmFtcy5maWVsZHMgJiYgdHlwZW9mIHRoaXMucGFyYW1zLmZpZWxkcyA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMucGFyYW1zLmZpZWxkcyA9IHRoaXMucGFyYW1zLmZpZWxkcygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIFBBUkFNU19ERUZBVUxUXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHRnZXQgYnV0dG9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2J1dHRvblxyXG5cdH1cclxuXHJcblx0c2V0IGJ1dHRvbihidG4pIHtcclxuXHRcdGlmICghYnRuKSB7XHJcblx0XHRcdHRoaXMuX2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tmb3JtPVwiJyArIHRoaXMuZWxlbWVudC5pZCArICdcIl0nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2J1dHRvbiA9IGJ0bjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsKTtcclxuXHJcblx0XHRpZiAodGhpcy5wYXJhbXMuaXNWYWxpZGF0ZSkge1xyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQodGhpcy5lbGVtZW50LCAnbm92YWxpZGF0ZScsICcnKTtcclxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPINGB0LTQtdC70LDRgtGMINC00L7QsdCw0LLQu9C10L3QuNC1INCz0LvQsNC30LAg0LXRgdC70Lgg0LXRgdGC0Ywg0LLQstC+0LQg0L/QsNGA0L7Qu9GPXHJcblxyXG5cdFx0cmV0dXJuIHRoaXNcclxuXHR9XHJcblxyXG5cdHN1Ym1pdChjYWxsYmFjaykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGNvbnN0IGNvbGxlY3REYXRhID0gZnVuY3Rpb24oZGF0YSwgZmllbGRzKSB7XHJcblx0XHRcdGZvciAobGV0IG5hbWUgaW4gZmllbGRzKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBmaWVsZHNbbmFtZV0gPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBrZXkgaW4gZmllbGRzW25hbWVdKSB7XHJcblx0XHRcdFx0XHRcdGxldCBhcnIgPSBPYmplY3Qua2V5cyhmaWVsZHNbbmFtZV1ba2V5XSkubWFwKGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZpZWxkc1tuYW1lXVtrZXldW2ldO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgYXJyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgZmllbGRzW25hbWVdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0aWYgKF90aGlzLnBhcmFtcy5pc1ZhbGlkYXRlKSB7XHJcblx0XHRcdFx0aWYgKCFfdGhpcy5mb3JtLmNoZWNrVmFsaWRpdHkoKSkge1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0XHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChfdGhpcy5wYXJhbXMuY2xhc3Nlcy53YXNWYWxpZGF0ZSk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuYnV0dG9uKSkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5yZXF1ZXN0KGNhbGxiYWNrLCBldmVudCk7XHJcblxyXG5cdFx0XHRpZiAoIV90aGlzLnBhcmFtcy5pc1N1Ym1pdCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKF90aGlzLmVsZW1lbnQpO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgX3RoaXMucGFyYW1zLmZpZWxkcyA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSBjb2xsZWN0RGF0YShkYXRhLCBfdGhpcy5wYXJhbXMuZmllbGRzKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBfdGhpcy5yZXF1ZXN0KGRhdGEsIGNhbGxiYWNrLCBldmVudCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmVxdWVzdChkYXRhLCBjYWxsYmFjaywgZXZlbnQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5wYXJhbXMuYWpheCA9IHtcclxuXHRcdFx0cm91dGU6IF90aGlzLnNldHRpbmdzLmFjdGlvbixcclxuXHRcdFx0bWV0aG9kOiBfdGhpcy5zZXR0aW5ncy5tZXRob2QudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjYWxsYmFjayAmJiAnYmVmb3JlU2VuZCcgaW4gY2FsbGJhY2spIHtcclxuXHRcdFx0ZXhlY3V0ZShjYWxsYmFjay5iZWZvcmVTZW5kLCBbZXZlbnQsIF90aGlzXSlcclxuXHRcdH1cclxuXHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfQkVGT1JFLCBfdGhpcyk7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdGb3JtU2VuZGVyLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCkuc3VibWl0KCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0Zvcm1TZW5kZXI7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IFJlc3BvbnNpdmUgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9yZXNwb25zaXZlXCI7XHJcbmltcG9ydCB7Z2V0U1ZHfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIGlzVmlzaWJsZSwgbm9vcCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbmF2JztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubmF2JztcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgQ2xhc3Nlc1xyXG4gKi9cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XICAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgID0gJ2ZhZGUnO1xyXG5jb25zdCBDTEFTU19OQU1FX0FDVElWRSA9ICdhY3RpdmUnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICcudmctbmF2IGEnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBFdmVudHNcclxuICovXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgID0gYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlVUF9EQVRBX0FQSSA9IGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX1JFU0laRV9EQVRBX0FQSSA9IGByZXNpemUuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuLyoqXHJcbiAqIERlZmF1bHQgUGFyYW1zXHJcbiAqL1xyXG5jb25zdCBQQVJBTVNfREVGQVVMVCA9ICB7XHJcblx0YnJlYWtwb2ludDogJ2xnJyxcclxuXHRwbGFjZW1lbnQ6ICdob3Jpem9udGFsJyxcclxuXHRjbGFzc2VzOiB7XHJcblx0XHRoYW1idXJnZXJBY3RpdmU6ICd2Zy1uYXYtaGFtYnVyZ2VyLWFjdGl2ZScsXHJcblx0XHRoYW1idXJnZXI6ICd2Zy1uYXYtaGFtYnVyZ2VyJyxcclxuXHRcdGNvbnRhaW5lcjogJ3ZnLW5hdi1jb250YWluZXInLFxyXG5cdFx0d3JhcHBlcjogJ3ZnLW5hdi13cmFwcGVyJyxcclxuXHRcdGFjdGl2ZTogJ3ZnLW5hdi1hY3RpdmUnLFxyXG5cdFx0ZXhwYW5kOiAndmctbmF2LWV4cGFuZCcsXHJcblx0XHRjbG9uZWQ6ICd2Zy1uYXYtY2xvbmVkJyxcclxuXHRcdGhvdmVyOiAndmctbmF2LWhvdmVyJyxcclxuXHRcdGZsaXA6ICd2Zy1uYXYtZmxpcCcsXHJcblx0XHRYWFhMOiAndmctbmF2LXh4eGwnLFxyXG5cdFx0WFhMOiAndmctbmF2LXh4bCcsXHJcblx0XHRYTDogJ3ZnLW5hdi14bCcsXHJcblx0XHRMRzogJ3ZnLW5hdi1sZycsXHJcblx0XHRNRDogJ3ZnLW5hdi1tZCcsXHJcblx0XHRTTTogJ3ZnLW5hdi1zbScsXHJcblx0XHRYUzogJ3ZnLW5hdi14cydcclxuXHR9LFxyXG5cdGV4cGFuZDogdHJ1ZSxcclxuXHRob3ZlcjogZmFsc2UsXHJcblx0cG9zaXRpb246IHRydWUsXHJcblx0Y29sbGFwc2U6IHRydWUsXHJcblx0dG9nZ2xlOiAnPHNwYW4gY2xhc3M9XCJkZWZhdWx0XCI+PC9zcGFuPicsXHJcblx0aGFtYnVyZ2VyOiB7XHJcblx0XHR0aXRsZTogJycsXHJcblx0XHRib2R5OiBudWxsXHJcblx0fSxcclxuXHRjYWxsYmFjazogbm9vcCxcclxuXHRhbmltYXRpb246IHRydWUsXHJcblx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdGFqYXg6IHtcclxuXHRcdHJvdXRlOiAnJyxcclxuXHRcdHRhcmdldDogJydcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWR05hdiBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX25hdmlnYXRpb24gPSBudWxsO1xyXG5cdFx0dGhpcy5uYXZpZ2F0aW9uID0gJy4nICsgdGhpcy5wYXJhbXMuY2xhc3Nlcy53cmFwcGVyO1xyXG5cclxuXHRcdHRoaXMubW92ZWRMaW5rcyA9IFtdO1xyXG5cdFx0dGhpcy4kbGlua3MgPSBTZWxlY3RvcnMuZmluZEFsbCgnLicgKyB0aGlzLnBhcmFtcy5jbGFzc2VzLndyYXBwZXIgKyAnID4gbGknLCB0aGlzLm5hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKHRoaXMucGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5wYXJhbXMudGltZW91dEFuaW1hdGlvbiA9IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGdldCBuYXZpZ2F0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25hdmlnYXRpb247XHJcblx0fVxyXG5cclxuXHRzZXQgbmF2aWdhdGlvbihlbCkge1xyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IFNlbGVjdG9ycy5nZXQoZWwsIHRoaXMuZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRidWlsZCgpIHtcclxuXHRcdGlmICghdGhpcy5uYXZpZ2F0aW9uKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG5cclxuXHRcdC8vINCS0LXRiNCw0LXQvCDQvtGB0L3QvtCy0L3Ri9C1INC60LvQsNGB0YHRi1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuY29udGFpbmVyKTtcclxuXHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2Zy1uYXYtJyArIHBhcmFtcy5wbGFjZW1lbnQpO1xyXG5cclxuXHRcdC8vINCV0YHQu9C4INC90YPQttC90L4g0L7RgdGC0LDQstC40YLRjCDRgdC/0LjRgdC+0Log0LzQtdC90Y4g0LjQu9C4INGD0YHRgtCw0L3QvtCy0LjRgtGMINC80LXQtNC40LAg0YLQvtGH0LrRg1xyXG5cdFx0aWYgKHBhcmFtcy5icmVha3BvaW50ID09PSBudWxsKSB7XHJcblx0XHRcdHBhcmFtcy5leHBhbmQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGFyYW1zLmJyZWFrcG9pbnQgPT09IG51bGwgfHwgIXBhcmFtcy5leHBhbmQpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuZXhwYW5kKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2Zy1uYXYtJyArIHBhcmFtcy5icmVha3BvaW50KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyDQnNC10L3RjiDRgdGA0LDQsdCw0YLRi9Cy0LDQtdGCINC/0YDQuCDQvdCw0LLQtdC00LXQvdC40LgsINC10YHQu9C4INGN0YLQviDQvdC1INC80L7QsdC40LvRjNC90L7QtSDRg9GB0YLRgNC+0LnRgdGC0LLQvlxyXG5cdFx0aWYgKHBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5ob3Zlcik7XHJcblxyXG5cdFx0XHRpZiAoUmVzcG9uc2l2ZS5jaGVja01vYmlsZU9yVGFibGV0KCkpIHtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShwYXJhbXMuY2xhc3Nlcy5ob3Zlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQs9Cw0LzQsdGD0YDQs9C10YAsINC10YHQu9C4INC10LPQviDQvdC10YIg0LIg0YDQsNC30LzQtdGC0LrQtVxyXG5cdFx0aWYgKHBhcmFtcy5leHBhbmQgJiYgIXBhcmFtcy5oYW1idXJnZXIuYm9keSkge1xyXG5cdFx0XHRsZXQgaXNIYW1idXJnZXIgPSBTZWxlY3RvcnMuZmluZE9uZSgnLicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIsIHRoaXMuZWxlbWVudCk7XHJcblxyXG5cdFx0XHRpZiAoaXNIYW1idXJnZXIgPT09IG51bGwpIHtcclxuXHRcdFx0XHRsZXQgbVRpdGxlID0gJycsXHJcblx0XHRcdFx0XHRoYW1idXJnZXIgPSAnPHNwYW4gY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJy0tbGluZXNcIj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48L3NwYW4+JztcclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIudGl0bGUpIHtcclxuXHRcdFx0XHRcdG1UaXRsZSA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS10aXRsZVwiPicrIHBhcmFtcy5oYW1idXJnZXIudGl0bGUgKyc8L3NwYW4+JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwYXJhbXMuaGFtYnVyZ2VyLmJvZHkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9IHBhcmFtcy5oYW1idXJnZXIuYm9keTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCc8YSBocmVmPVwiI3NpZGViYXItbmF2XCIgY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJ1wiIGRhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiPicgKyBtVGl0bGUgKyBoYW1idXJnZXIgKyc8L2E+Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRg9C60LDQt9Cw0YLQtdC70Ywg0L/QtdGA0LXQutC70Y7Rh9Cw0YLQtdC70Y9cclxuXHRcdGlmIChwYXJhbXMudG9nZ2xlKSB7XHJcblx0XHRcdGxldCAkZHJvcGRvd25fYSA9IFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duLW1lZ2EgPiBhLCAuZHJvcGRvd24gPiBhJywgdGhpcy5lbGVtZW50KV0sXHJcblx0XHRcdFx0dG9nZ2xlID0gJzxzcGFuIGNsYXNzPVwidG9nZ2xlXCI+JyArIHBhcmFtcy50b2dnbGUgKyAnPC9zcGFuPic7XHJcblxyXG5cdFx0XHRpZiAoJGRyb3Bkb3duX2EubGVuZ3RoKSB7XHJcblx0XHRcdFx0JGRyb3Bkb3duX2EuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xyXG5cdFx0XHRcdFx0aWYgKCFlbGVtLnF1ZXJ5U2VsZWN0b3IoJy50b2dnbGUnKSAmJiAhZWxlbS5jbG9zZXN0KCcuZG90cycpKSB7XHJcblx0XHRcdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcclxuXHRcdFx0XHRcdFx0ZWxlbS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRvZ2dsZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXJhbXMuY29sbGFwc2UgJiYgUmVzcG9uc2l2ZS5jaGVjayh0aGlzKSAmJiBwYXJhbXMucGxhY2VtZW50ICE9PSAndmVydGljYWwnKSB7XHJcblx0XHRcdHNldENvbGxhcHNlKHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnYWZ0ZXJJbml0JyBpbiB0aGlzLnBhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRleGVjdXRlKHRoaXMucGFyYW1zLmNhbGxiYWNrLmFmdGVySW5pdCwgW3RoaXNdKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqINCk0YPQvdC60YbQuNGPINGB0LLQvtGA0LDRh9C40LLQsNC90LjRj1xyXG5cdFx0ICogVE9ETyDQn9GA0LjQtNGD0LzQsNGC0Ywg0YfRgtC+INGC0L4g0YEg0LzQtdCz0LAg0LzQtdC90Y4sINC60L7RgtC+0YDQvtC1INGD0YXQvtC00LjRgiDQsiDQv9C+0LTQvNC10L3RjlxyXG5cdFx0ICogVE9ETyDQotCw0Log0LbQtSDQtdGB0YLRjCDQutC+0YHRj9C60Lgg0L/RgNC4INGA0LXRgdCw0LnQt9C1XHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIHNldENvbGxhcHNlKF90aGlzKSB7XHJcblx0XHRcdGxldCB3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUgPSBfdGhpcy5uYXZpZ2F0aW9uLmNsaWVudFdpZHRoLFxyXG5cdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gMCxcclxuXHRcdFx0XHQkZG90cyA9IFNlbGVjdG9ycy5maW5kT25lKCcuZG90cycsIF90aGlzLm5hdmlnYXRpb24pLFxyXG5cdFx0XHRcdF9kb3RzID0gZ2V0U1ZHKCdkb3RzJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuJGxpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAkZG90cy5jbGllbnRXaWR0aFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgJGEgPSBTZWxlY3RvcnMuZmluZE9uZSgnYScsIF90aGlzLiRsaW5rc1swXSksXHJcblx0XHRcdFx0XHRcdCRsaW5rU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKCRhKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ0xlZnQgPSBub3JtYWxpemVEYXRhKCRsaW5rU3R5bGUucGFkZGluZ0xlZnQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0ID0gIG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nUmlnaHQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZyA9IHBhZGRpbmdMZWZ0ICsgcGFkZGluZ1JpZ2h0O1xyXG5cclxuXHRcdFx0XHRcdC8vIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0LLQtdGA0L3Qviwg0L3QviDQvNGLINGC0L7Rh9C90L4g0LfQvdCw0LXQvCDRiNC40YDQuNC90YMg0YLQvtGH0LXQuiDQsiBzdmcgLSAxNnB4XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHBhZGRpbmcgKyAxNjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAobGV0ICRsaW5rIG9mIF90aGlzLiRsaW5rcykge1xyXG5cdFx0XHRcdFx0bGV0IHdpZHRoID0gJGxpbmsuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlICsgd2lkdGg7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCh3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUpIDwgd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5wdXNoKCRsaW5rKTtcclxuXHRcdFx0XHRcdFx0JGxpbmsucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uaW5zZXJ0QmVmb3JlKF90aGlzLm1vdmVkTGlua3NbMF0sICRkb3RzKVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmFwcGVuZENoaWxkKF90aGlzLm1vdmVkTGlua3NbMF0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdF90aGlzLm1vdmVkTGlua3Muc3BsaWNlKDAsIDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGlmICghJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsJzxsaSBjbGFzcz1cImRyb3Bkb3duIGRvdHNcIj4nICsgJzxhIGhyZWY9XCIjXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JysgX2RvdHMgKyc8L2E+PC9saT4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdCRkb3RzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0ICRkID0gX3RoaXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuZG90cycpO1xyXG5cdFx0XHRcdGlmICgkZCAmJiBfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0bGV0ICRkcm9wZG93biA9ICRkLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XHJcblx0XHRcdFx0XHRpZiAoJGRyb3Bkb3duKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duLWNvbnRlbnQnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblxyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsaW5rIG9mIF90aGlzLm1vdmVkTGlua3MpIHtcclxuXHRcdFx0XHRcdFx0XHQkZHJvcGRvd24ucHJlcGVuZChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0JGQuYXBwZW5kQ2hpbGQoJGRyb3Bkb3duKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0bGV0IHRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoIXRhcmdldCB8fCBpc0Rpc2FibGVkKHRhcmdldCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bi1jb250ZW50JykpIHtcclxuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpcnN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGRyb3AgPSBTZWxlY3RvcnMuZmluZE9uZSgnLmRyb3Bkb3duLWNvbnRlbnQnLCB0YXJnZXQpLFxyXG5cdFx0XHRsaW5rID0gdGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuXHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcblx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRzZXREcm9wUG9zaXRpb24oZHJvcClcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIGRyb3AsIHRydWUsIDUwKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gJGRyb3BcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0RHJvcFBvc2l0aW9uKCRkcm9wKSB7XHJcblx0XHRcdGxldCB7d2lkdGgsIHJpZ2h0fSA9ICRkcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRcdHdpbmRvd193aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuXHRcdFx0bGV0IE5fcmlnaHQgPSB3aW5kb3dfd2lkdGggLSByaWdodCAtIHdpZHRoO1xyXG5cclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQnKTtcclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgnbGVmdCcpO1xyXG5cclxuXHRcdFx0bGV0ICRwYXJlbnQgPSAkZHJvcC5jbG9zZXN0KCdsaScpLFxyXG5cdFx0XHRcdCR1bCA9ICRwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgndWwnKTtcclxuXHJcblx0XHRcdGlmIChOX3JpZ2h0ID4gd2lkdGgpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0ICRlbCBvZiAkdWwpIHtcclxuXHRcdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRoaWRlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsZW1lbnQgPSByZWxhdGVkVGFyZ2V0LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0aWYgKCdlbG0nIGluIHJlbGF0ZWRUYXJnZXQgJiYgcmVsYXRlZFRhcmdldC5lbG0pIHtcclxuXHRcdFx0ZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQuZWxtXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQpIHtcclxuXHRcdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIoZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpcnN0JykpIHtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpcnN0Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLicgKyBDTEFTU19OQU1FX1NIT1csIGVsZW1lbnQpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0XHRcdGxldCBwYXJlbnQgPSBlbC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAocGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0FDVElWRSkpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0XHRpZiAobGluaykgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKGVsLCBFVkVOVF9LRVlfSElEREVOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIGVsLCB0cnVlLCA1MDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUT0RPINC10YHQu9C4INC90LAg0YHRgtGA0LDQvdC40YbQtSDQvdC10YHQutC+0LvRjNC60L4g0L3QsNCy0LjQs9Cw0YbQuNC5LCDRgtC+INC10YHRgtGMINC60L7RgdGP0LrQuFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCk7XHJcblxyXG5cdFx0bGV0IGRyb3BzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bicsIGluc3RhbmNlLl9uYXZpZ2F0aW9uKVxyXG5cclxuXHRcdGlmIChpbnN0YW5jZS5wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0Wy4uLmRyb3BzXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdGxldCBjdXJyZW50RWxlbSA9IG51bGw7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsLCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRWR05hdi5oaWRlT3BlbkRyb3BzKGV2ZW50KTtcclxuXHJcblx0XHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWluc3RhbmNlLm5hdmlnYXRpb24uY29udGFpbnModGFyZ2V0KSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSB0YXJnZXQ7XHJcblxyXG5cdFx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRhcmdldFxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGluc3RhbmNlLnNob3cocmVsYXRlZFRhcmdldCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsLCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bicpLFxyXG5cdFx0XHRcdFx0XHRlbG0gPSBjdXJyZW50RWxlbTtcclxuXHJcblx0XHRcdFx0XHR3aGlsZSAocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVsYXRlZFRhcmdldCA9PT0gY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IG51bGw7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5oaWRlKHtyZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBlbG06IGVsbX0pO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgVkdOYXYuY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIU1hbmlwdWxhdG9yLmhhcyh0aGlzLCAnYXJpYS1leHBhbmRlZCcpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoJ2NsaWNrJyBpbiBpbnN0YW5jZS5wYXJhbXMuY2FsbGJhY2spIHtcclxuXHRcdFx0XHRcdGV4ZWN1dGUoaW5zdGFuY2UucGFyYW1zLmNhbGxiYWNrLmNsaWNrLCBbdGhpc10pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzLmNsb3Nlc3QoJy52Zy1uYXYnKSxcclxuXHRcdFx0XHRcdGlzRmlyc3QgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5maXJzdCcpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNEaXNhYmxlZCh0YXJnZXQpICYmICFpc1Zpc2libGUodGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGlzRmlyc3QgJiYgdGhpcy5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmFjdGl2ZScsIHNlbGYpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZWwgJiYgZWwgIT09IHRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGVsfSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KHtyZWxhdGVkVGFyZ2V0OiB0YXJnZXR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdmdOYXZTaWRlYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXItbmF2Jyk7XHJcblx0XHRsZXQgaGFtYnVyZ2VyID0gaW5zdGFuY2UuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIGluc3RhbmNlLnBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlcik7XHJcblxyXG5cdFx0aWYgKHZnTmF2U2lkZWJhciAmJiBoYW1idXJnZXIpIHtcclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuc2hvdycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LmFkZChpbnN0YW5jZS5wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZnTmF2U2lkZWJhci5hZGRFdmVudExpc3RlbmVyKCd2Zy5zaWRlYmFyLmhpZGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoaW5zdGFuY2UucGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyQWN0aXZlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR05hdi5oaWRlT3BlbkRyb3BzKGV2ZW50KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuRHJvcHMoZXZlbnQpIHtcclxuXHRcdGNvbnN0IG9wZW5Ub2dnbGVzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bjpub3QoLmRpc2FibGVkKTpub3QoOmRpc2FibGVkKS5hY3RpdmUnKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IHRvZ2dsZSBvZiBvcGVuVG9nZ2xlcykge1xyXG5cdFx0XHRjb25zdCBjb250ZXh0ID0gVkdOYXYuZ2V0SW5zdGFuY2UodG9nZ2xlLmNsb3Nlc3QoJy52Zy1uYXYnKSk7XHJcblx0XHRcdGlmICghY29udGV4dCkgY29udGludWU7XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5maXJzdCcpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0b2dnbGUgfVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb250ZXh0LmhpZGUocmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbkV2ZW50SGFuZGxlci5vbih3aW5kb3csIEVWRU5UX1JFU0laRV9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR05hdi5nZXRPckNyZWF0ZUluc3RhbmNlKCcudmctbmF2Jywge30pO1xyXG5cdGluc3RhbmNlLmJ1aWxkKCk7XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR05hdjsiLCJ2YXIgQnJvd3NlcnNsaXN0RXJyb3IgPSByZXF1aXJlKCcuL2Vycm9yJylcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2FkUXVlcmllczogZnVuY3Rpb24gbG9hZFF1ZXJpZXMoKSB7XG4gICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKFxuICAgICAgJ1NoYXJhYmxlIGNvbmZpZ3MgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gY2xpZW50LXNpZGUgYnVpbGQgb2YgQnJvd3NlcnNsaXN0J1xuICAgIClcbiAgfSxcblxuICBnZXRTdGF0OiBmdW5jdGlvbiBnZXRTdGF0KG9wdHMpIHtcbiAgICByZXR1cm4gb3B0cy5zdGF0c1xuICB9LFxuXG4gIGxvYWRDb25maWc6IGZ1bmN0aW9uIGxvYWRDb25maWcob3B0cykge1xuICAgIGlmIChvcHRzLmNvbmZpZykge1xuICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKFxuICAgICAgICAnQnJvd3NlcnNsaXN0IGNvbmZpZyBhcmUgbm90IHN1cHBvcnRlZCBpbiBjbGllbnQtc2lkZSBidWlsZCdcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgbG9hZENvdW50cnk6IGZ1bmN0aW9uIGxvYWRDb3VudHJ5KCkge1xuICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICdDb3VudHJ5IHN0YXRpc3RpY3MgYXJlIG5vdCBzdXBwb3J0ZWQgJyArXG4gICAgICAgICdpbiBjbGllbnQtc2lkZSBidWlsZCBvZiBCcm93c2Vyc2xpc3QnXG4gICAgKVxuICB9LFxuXG4gIGxvYWRGZWF0dXJlOiBmdW5jdGlvbiBsb2FkRmVhdHVyZSgpIHtcbiAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAnU3VwcG9ydHMgcXVlcmllcyBhcmUgbm90IGF2YWlsYWJsZSBpbiBjbGllbnQtc2lkZSBidWlsZCBvZiBCcm93c2Vyc2xpc3QnXG4gICAgKVxuICB9LFxuXG4gIGN1cnJlbnROb2RlOiBmdW5jdGlvbiBjdXJyZW50Tm9kZShyZXNvbHZlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlc29sdmUoWydtYWludGFpbmVkIG5vZGUgdmVyc2lvbnMnXSwgY29udGV4dClbMF1cbiAgfSxcblxuICBwYXJzZUNvbmZpZzogbm9vcCxcblxuICByZWFkQ29uZmlnOiBub29wLFxuXG4gIGZpbmRDb25maWc6IG5vb3AsXG5cbiAgZmluZENvbmZpZ0ZpbGU6IG5vb3AsXG5cbiAgY2xlYXJDYWNoZXM6IG5vb3AsXG5cbiAgb2xkRGF0YVdhcm5pbmc6IG5vb3AsXG5cbiAgZW52OiB7fVxufVxuIiwiZnVuY3Rpb24gQnJvd3NlcnNsaXN0RXJyb3IobWVzc2FnZSkge1xuICB0aGlzLm5hbWUgPSAnQnJvd3NlcnNsaXN0RXJyb3InXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgdGhpcy5icm93c2Vyc2xpc3QgPSB0cnVlXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEJyb3dzZXJzbGlzdEVycm9yKVxuICB9XG59XG5cbkJyb3dzZXJzbGlzdEVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJyb3dzZXJzbGlzdEVycm9yXG4iLCJ2YXIganNSZWxlYXNlcyA9IHJlcXVpcmUoJ25vZGUtcmVsZWFzZXMvZGF0YS9wcm9jZXNzZWQvZW52cy5qc29uJylcbnZhciBhZ2VudHMgPSByZXF1aXJlKCdjYW5pdXNlLWxpdGUvZGlzdC91bnBhY2tlci9hZ2VudHMnKS5hZ2VudHNcbnZhciBlMmMgPSByZXF1aXJlKCdlbGVjdHJvbi10by1jaHJvbWl1bS92ZXJzaW9ucycpXG52YXIganNFT0wgPSByZXF1aXJlKCdub2RlLXJlbGVhc2VzL2RhdGEvcmVsZWFzZS1zY2hlZHVsZS9yZWxlYXNlLXNjaGVkdWxlLmpzb24nKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxudmFyIEJyb3dzZXJzbGlzdEVycm9yID0gcmVxdWlyZSgnLi9lcnJvcicpXG52YXIgZW52ID0gcmVxdWlyZSgnLi9ub2RlJylcbnZhciBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKSAvLyBXaWxsIGxvYWQgYnJvd3Nlci5qcyBpbiB3ZWJwYWNrXG5cbnZhciBZRUFSID0gMzY1LjI1OTY0MSAqIDI0ICogNjAgKiA2MCAqIDEwMDBcbnZhciBBTkRST0lEX0VWRVJHUkVFTl9GSVJTVCA9ICczNydcbnZhciBPUF9NT0JfQkxJTktfRklSU1QgPSAxNFxuXG4vLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIGlzVmVyc2lvbnNNYXRjaCh2ZXJzaW9uQSwgdmVyc2lvbkIpIHtcbiAgcmV0dXJuICh2ZXJzaW9uQSArICcuJykuaW5kZXhPZih2ZXJzaW9uQiArICcuJykgPT09IDBcbn1cblxuZnVuY3Rpb24gaXNFb2xSZWxlYXNlZChuYW1lKSB7XG4gIHZhciB2ZXJzaW9uID0gbmFtZS5zbGljZSgxKVxuICByZXR1cm4gYnJvd3NlcnNsaXN0Lm5vZGVWZXJzaW9ucy5zb21lKGZ1bmN0aW9uIChpKSB7XG4gICAgcmV0dXJuIGlzVmVyc2lvbnNNYXRjaChpLCB2ZXJzaW9uKVxuICB9KVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemUodmVyc2lvbnMpIHtcbiAgcmV0dXJuIHZlcnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmVyc2lvbikge1xuICAgIHJldHVybiB0eXBlb2YgdmVyc2lvbiA9PT0gJ3N0cmluZydcbiAgfSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRWxlY3Ryb24odmVyc2lvbikge1xuICB2YXIgdmVyc2lvblRvVXNlID0gdmVyc2lvblxuICBpZiAodmVyc2lvbi5zcGxpdCgnLicpLmxlbmd0aCA9PT0gMykge1xuICAgIHZlcnNpb25Ub1VzZSA9IHZlcnNpb24uc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpXG4gIH1cbiAgcmV0dXJuIHZlcnNpb25Ub1VzZVxufVxuXG5mdW5jdGlvbiBuYW1lTWFwcGVyKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1hcE5hbWUodmVyc2lvbikge1xuICAgIHJldHVybiBuYW1lICsgJyAnICsgdmVyc2lvblxuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1ham9yKHZlcnNpb24pIHtcbiAgcmV0dXJuIHBhcnNlSW50KHZlcnNpb24uc3BsaXQoJy4nKVswXSlcbn1cblxuZnVuY3Rpb24gZ2V0TWFqb3JWZXJzaW9ucyhyZWxlYXNlZCwgbnVtYmVyKSB7XG4gIGlmIChyZWxlYXNlZC5sZW5ndGggPT09IDApIHJldHVybiBbXVxuICB2YXIgbWFqb3JWZXJzaW9ucyA9IHVuaXEocmVsZWFzZWQubWFwKGdldE1ham9yKSlcbiAgdmFyIG1pbmltdW0gPSBtYWpvclZlcnNpb25zW21ham9yVmVyc2lvbnMubGVuZ3RoIC0gbnVtYmVyXVxuICBpZiAoIW1pbmltdW0pIHtcbiAgICByZXR1cm4gcmVsZWFzZWRcbiAgfVxuICB2YXIgc2VsZWN0ZWQgPSBbXVxuICBmb3IgKHZhciBpID0gcmVsZWFzZWQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAobWluaW11bSA+IGdldE1ham9yKHJlbGVhc2VkW2ldKSkgYnJlYWtcbiAgICBzZWxlY3RlZC51bnNoaWZ0KHJlbGVhc2VkW2ldKVxuICB9XG4gIHJldHVybiBzZWxlY3RlZFxufVxuXG5mdW5jdGlvbiB1bmlxKGFycmF5KSB7XG4gIHZhciBmaWx0ZXJlZCA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZmlsdGVyZWQuaW5kZXhPZihhcnJheVtpXSkgPT09IC0xKSBmaWx0ZXJlZC5wdXNoKGFycmF5W2ldKVxuICB9XG4gIHJldHVybiBmaWx0ZXJlZFxufVxuXG5mdW5jdGlvbiBmaWxsVXNhZ2UocmVzdWx0LCBuYW1lLCBkYXRhKSB7XG4gIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgIHJlc3VsdFtuYW1lICsgJyAnICsgaV0gPSBkYXRhW2ldXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVGaWx0ZXIoc2lnbiwgdmVyc2lvbikge1xuICB2ZXJzaW9uID0gcGFyc2VGbG9hdCh2ZXJzaW9uKVxuICBpZiAoc2lnbiA9PT0gJz4nKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICByZXR1cm4gcGFyc2VMYXRlc3RGbG9hdCh2KSA+IHZlcnNpb25cbiAgICB9XG4gIH0gZWxzZSBpZiAoc2lnbiA9PT0gJz49Jykge1xuICAgIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHBhcnNlTGF0ZXN0RmxvYXQodikgPj0gdmVyc2lvblxuICAgIH1cbiAgfSBlbHNlIGlmIChzaWduID09PSAnPCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHYpIDwgdmVyc2lvblxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHYpIDw9IHZlcnNpb25cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxhdGVzdEZsb2F0KHYpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2LnNwbGl0KCctJylbMV0gfHwgdilcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVNlbXZlckZpbHRlcihzaWduLCB2ZXJzaW9uKSB7XG4gIHZlcnNpb24gPSB2ZXJzaW9uLnNwbGl0KCcuJykubWFwKHBhcnNlU2ltcGxlSW50KVxuICB2ZXJzaW9uWzFdID0gdmVyc2lvblsxXSB8fCAwXG4gIHZlcnNpb25bMl0gPSB2ZXJzaW9uWzJdIHx8IDBcbiAgaWYgKHNpZ24gPT09ICc+Jykge1xuICAgIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgICAgdiA9IHYuc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gICAgICByZXR1cm4gY29tcGFyZVNlbXZlcih2LCB2ZXJzaW9uKSA+IDBcbiAgICB9XG4gIH0gZWxzZSBpZiAoc2lnbiA9PT0gJz49Jykge1xuICAgIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgICAgdiA9IHYuc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gICAgICByZXR1cm4gY29tcGFyZVNlbXZlcih2LCB2ZXJzaW9uKSA+PSAwXG4gICAgfVxuICB9IGVsc2UgaWYgKHNpZ24gPT09ICc8Jykge1xuICAgIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgICAgdiA9IHYuc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gICAgICByZXR1cm4gY29tcGFyZVNlbXZlcih2ZXJzaW9uLCB2KSA+IDBcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICB2ID0gdi5zcGxpdCgnLicpLm1hcChwYXJzZVNpbXBsZUludClcbiAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyKHZlcnNpb24sIHYpID49IDBcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VTaW1wbGVJbnQoeCkge1xuICByZXR1cm4gcGFyc2VJbnQoeClcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhIDwgYikgcmV0dXJuIC0xXG4gIGlmIChhID4gYikgcmV0dXJuICsxXG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVTZW12ZXIoYSwgYikge1xuICByZXR1cm4gKFxuICAgIGNvbXBhcmUocGFyc2VJbnQoYVswXSksIHBhcnNlSW50KGJbMF0pKSB8fFxuICAgIGNvbXBhcmUocGFyc2VJbnQoYVsxXSB8fCAnMCcpLCBwYXJzZUludChiWzFdIHx8ICcwJykpIHx8XG4gICAgY29tcGFyZShwYXJzZUludChhWzJdIHx8ICcwJyksIHBhcnNlSW50KGJbMl0gfHwgJzAnKSlcbiAgKVxufVxuXG4vLyB0aGlzIGZvbGxvd3MgdGhlIG5wbS1saWtlIHNlbXZlciBiZWhhdmlvclxuZnVuY3Rpb24gc2VtdmVyRmlsdGVyTG9vc2Uob3BlcmF0b3IsIHJhbmdlKSB7XG4gIHJhbmdlID0gcmFuZ2Uuc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gIGlmICh0eXBlb2YgcmFuZ2VbMV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmFuZ2VbMV0gPSAneCdcbiAgfVxuICAvLyBpZ25vcmUgYW55IHBhdGNoIHZlcnNpb24gYmVjYXVzZSB3ZSBvbmx5IHJldHVybiBtaW5vciB2ZXJzaW9uc1xuICAvLyByYW5nZVsyXSA9ICd4J1xuICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgY2FzZSAnPD0nOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnNwbGl0KCcuJykubWFwKHBhcnNlU2ltcGxlSW50KVxuICAgICAgICByZXR1cm4gY29tcGFyZVNlbXZlckxvb3NlKHZlcnNpb24sIHJhbmdlKSA8PSAwXG4gICAgICB9XG4gICAgY2FzZSAnPj0nOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24uc3BsaXQoJy4nKS5tYXAocGFyc2VTaW1wbGVJbnQpXG4gICAgICAgIHJldHVybiBjb21wYXJlU2VtdmVyTG9vc2UodmVyc2lvbiwgcmFuZ2UpID49IDBcbiAgICAgIH1cbiAgfVxufVxuXG4vLyB0aGlzIGZvbGxvd3MgdGhlIG5wbS1saWtlIHNlbXZlciBiZWhhdmlvclxuZnVuY3Rpb24gY29tcGFyZVNlbXZlckxvb3NlKHZlcnNpb24sIHJhbmdlKSB7XG4gIGlmICh2ZXJzaW9uWzBdICE9PSByYW5nZVswXSkge1xuICAgIHJldHVybiB2ZXJzaW9uWzBdIDwgcmFuZ2VbMF0gPyAtMSA6ICsxXG4gIH1cbiAgaWYgKHJhbmdlWzFdID09PSAneCcpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh2ZXJzaW9uWzFdICE9PSByYW5nZVsxXSkge1xuICAgIHJldHVybiB2ZXJzaW9uWzFdIDwgcmFuZ2VbMV0gPyAtMSA6ICsxXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVZlcnNpb24oZGF0YSwgdmVyc2lvbikge1xuICBpZiAoZGF0YS52ZXJzaW9ucy5pbmRleE9mKHZlcnNpb24pICE9PSAtMSkge1xuICAgIHJldHVybiB2ZXJzaW9uXG4gIH0gZWxzZSBpZiAoYnJvd3NlcnNsaXN0LnZlcnNpb25BbGlhc2VzW2RhdGEubmFtZV1bdmVyc2lvbl0pIHtcbiAgICByZXR1cm4gYnJvd3NlcnNsaXN0LnZlcnNpb25BbGlhc2VzW2RhdGEubmFtZV1bdmVyc2lvbl1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWZXJzaW9uKGRhdGEsIHZlcnNpb24pIHtcbiAgdmFyIHJlc29sdmVkID0gcmVzb2x2ZVZlcnNpb24oZGF0YSwgdmVyc2lvbilcbiAgaWYgKHJlc29sdmVkKSB7XG4gICAgcmV0dXJuIHJlc29sdmVkXG4gIH0gZWxzZSBpZiAoZGF0YS52ZXJzaW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZGF0YS52ZXJzaW9uc1swXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlckJ5WWVhcihzaW5jZSwgY29udGV4dCkge1xuICBzaW5jZSA9IHNpbmNlIC8gMTAwMFxuICByZXR1cm4gT2JqZWN0LmtleXMoYWdlbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKHNlbGVjdGVkLCBuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBieU5hbWUobmFtZSwgY29udGV4dClcbiAgICBpZiAoIWRhdGEpIHJldHVybiBzZWxlY3RlZFxuICAgIHZhciB2ZXJzaW9ucyA9IE9iamVjdC5rZXlzKGRhdGEucmVsZWFzZURhdGUpLmZpbHRlcihmdW5jdGlvbiAodikge1xuICAgICAgdmFyIGRhdGUgPSBkYXRhLnJlbGVhc2VEYXRlW3ZdXG4gICAgICByZXR1cm4gZGF0ZSAhPT0gbnVsbCAmJiBkYXRlID49IHNpbmNlXG4gICAgfSlcbiAgICByZXR1cm4gc2VsZWN0ZWQuY29uY2F0KHZlcnNpb25zLm1hcChuYW1lTWFwcGVyKGRhdGEubmFtZSkpKVxuICB9LCBbXSlcbn1cblxuZnVuY3Rpb24gY2xvbmVEYXRhKGRhdGEpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgdmVyc2lvbnM6IGRhdGEudmVyc2lvbnMsXG4gICAgcmVsZWFzZWQ6IGRhdGEucmVsZWFzZWQsXG4gICAgcmVsZWFzZURhdGU6IGRhdGEucmVsZWFzZURhdGVcbiAgfVxufVxuXG5mdW5jdGlvbiBieU5hbWUobmFtZSwgY29udGV4dCkge1xuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIG5hbWUgPSBicm93c2Vyc2xpc3QuYWxpYXNlc1tuYW1lXSB8fCBuYW1lXG4gIGlmIChjb250ZXh0Lm1vYmlsZVRvRGVza3RvcCAmJiBicm93c2Vyc2xpc3QuZGVza3RvcE5hbWVzW25hbWVdKSB7XG4gICAgdmFyIGRlc2t0b3AgPSBicm93c2Vyc2xpc3QuZGF0YVticm93c2Vyc2xpc3QuZGVza3RvcE5hbWVzW25hbWVdXVxuICAgIGlmIChuYW1lID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHJldHVybiBub3JtYWxpemVBbmRyb2lkRGF0YShjbG9uZURhdGEoYnJvd3NlcnNsaXN0LmRhdGFbbmFtZV0pLCBkZXNrdG9wKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY2xvbmVkID0gY2xvbmVEYXRhKGRlc2t0b3ApXG4gICAgICBjbG9uZWQubmFtZSA9IG5hbWVcbiAgICAgIHJldHVybiBjbG9uZWRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJyb3dzZXJzbGlzdC5kYXRhW25hbWVdXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFuZHJvaWRWZXJzaW9ucyhhbmRyb2lkVmVyc2lvbnMsIGNocm9tZVZlcnNpb25zKSB7XG4gIHZhciBpRmlyc3RFdmVyZ3JlZW4gPSBjaHJvbWVWZXJzaW9ucy5pbmRleE9mKEFORFJPSURfRVZFUkdSRUVOX0ZJUlNUKVxuICByZXR1cm4gYW5kcm9pZFZlcnNpb25zXG4gICAgLmZpbHRlcihmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgcmV0dXJuIC9eKD86WzItNF1cXC58WzM0XSQpLy50ZXN0KHZlcnNpb24pXG4gICAgfSlcbiAgICAuY29uY2F0KGNocm9tZVZlcnNpb25zLnNsaWNlKGlGaXJzdEV2ZXJncmVlbikpXG59XG5cbmZ1bmN0aW9uIGNvcHlPYmplY3Qob2JqKSB7XG4gIHZhciBjb3B5ID0ge31cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGNvcHlba2V5XSA9IG9ialtrZXldXG4gIH1cbiAgcmV0dXJuIGNvcHlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQW5kcm9pZERhdGEoYW5kcm9pZCwgY2hyb21lKSB7XG4gIGFuZHJvaWQucmVsZWFzZWQgPSBub3JtYWxpemVBbmRyb2lkVmVyc2lvbnMoYW5kcm9pZC5yZWxlYXNlZCwgY2hyb21lLnJlbGVhc2VkKVxuICBhbmRyb2lkLnZlcnNpb25zID0gbm9ybWFsaXplQW5kcm9pZFZlcnNpb25zKGFuZHJvaWQudmVyc2lvbnMsIGNocm9tZS52ZXJzaW9ucylcbiAgYW5kcm9pZC5yZWxlYXNlRGF0ZSA9IGNvcHlPYmplY3QoYW5kcm9pZC5yZWxlYXNlRGF0ZSlcbiAgYW5kcm9pZC5yZWxlYXNlZC5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKGFuZHJvaWQucmVsZWFzZURhdGVbdl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgYW5kcm9pZC5yZWxlYXNlRGF0ZVt2XSA9IGNocm9tZS5yZWxlYXNlRGF0ZVt2XVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGFuZHJvaWRcbn1cblxuZnVuY3Rpb24gY2hlY2tOYW1lKG5hbWUsIGNvbnRleHQpIHtcbiAgdmFyIGRhdGEgPSBieU5hbWUobmFtZSwgY29udGV4dClcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoJ1Vua25vd24gYnJvd3NlciAnICsgbmFtZSlcbiAgcmV0dXJuIGRhdGFcbn1cblxuZnVuY3Rpb24gdW5rbm93blF1ZXJ5KHF1ZXJ5KSB7XG4gIHJldHVybiBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgJ1Vua25vd24gYnJvd3NlciBxdWVyeSBgJyArXG4gICAgICBxdWVyeSArXG4gICAgICAnYC4gJyArXG4gICAgICAnTWF5YmUgeW91IGFyZSB1c2luZyBvbGQgQnJvd3NlcnNsaXN0IG9yIG1hZGUgdHlwbyBpbiBxdWVyeS4nXG4gIClcbn1cblxuLy8gQWRqdXN0cyBsYXN0IFggdmVyc2lvbnMgcXVlcmllcyBmb3Igc29tZSBtb2JpbGUgYnJvd3NlcnMsXG4vLyB3aGVyZSBjYW5pdXNlIGRhdGEganVtcHMgZnJvbSBhIGxlZ2FjeSB2ZXJzaW9uIHRvIHRoZSBsYXRlc3RcbmZ1bmN0aW9uIGZpbHRlckp1bXBzKGxpc3QsIG5hbWUsIG5WZXJzaW9ucywgY29udGV4dCkge1xuICB2YXIganVtcCA9IDFcbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnYW5kcm9pZCc6XG4gICAgICBpZiAoY29udGV4dC5tb2JpbGVUb0Rlc2t0b3ApIHJldHVybiBsaXN0XG4gICAgICB2YXIgcmVsZWFzZWQgPSBicm93c2Vyc2xpc3QuZGF0YS5jaHJvbWUucmVsZWFzZWRcbiAgICAgIGp1bXAgPSByZWxlYXNlZC5sZW5ndGggLSByZWxlYXNlZC5pbmRleE9mKEFORFJPSURfRVZFUkdSRUVOX0ZJUlNUKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdvcF9tb2InOlxuICAgICAgdmFyIGxhdGVzdCA9IGJyb3dzZXJzbGlzdC5kYXRhLm9wX21vYi5yZWxlYXNlZC5zbGljZSgtMSlbMF1cbiAgICAgIGp1bXAgPSBnZXRNYWpvcihsYXRlc3QpIC0gT1BfTU9CX0JMSU5LX0ZJUlNUICsgMVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGxpc3RcbiAgfVxuICBpZiAoblZlcnNpb25zIDw9IGp1bXApIHtcbiAgICByZXR1cm4gbGlzdC5zbGljZSgtMSlcbiAgfVxuICByZXR1cm4gbGlzdC5zbGljZShqdW1wIC0gMSAtIG5WZXJzaW9ucylcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoZmxhZ3MsIHdpdGhQYXJ0aWFsKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIGZsYWdzID09PSAnc3RyaW5nJyAmJlxuICAgIChmbGFncy5pbmRleE9mKCd5JykgPj0gMCB8fCAod2l0aFBhcnRpYWwgJiYgZmxhZ3MuaW5kZXhPZignYScpID49IDApKVxuICApXG59XG5cbmZ1bmN0aW9uIHJlc29sdmUocXVlcmllcywgY29udGV4dCkge1xuICByZXR1cm4gcGFyc2UoUVVFUklFUywgcXVlcmllcykucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIG5vZGUsIGluZGV4KSB7XG4gICAgaWYgKG5vZGUubm90ICYmIGluZGV4ID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAgICdXcml0ZSBhbnkgYnJvd3NlcnMgcXVlcnkgKGZvciBpbnN0YW5jZSwgYGRlZmF1bHRzYCkgJyArXG4gICAgICAgICAgJ2JlZm9yZSBgJyArXG4gICAgICAgICAgbm9kZS5xdWVyeSArXG4gICAgICAgICAgJ2AnXG4gICAgICApXG4gICAgfVxuICAgIHZhciB0eXBlID0gUVVFUklFU1tub2RlLnR5cGVdXG4gICAgdmFyIGFycmF5ID0gdHlwZS5zZWxlY3QuY2FsbChicm93c2Vyc2xpc3QsIGNvbnRleHQsIG5vZGUpLm1hcChmdW5jdGlvbiAoaikge1xuICAgICAgdmFyIHBhcnRzID0gai5zcGxpdCgnICcpXG4gICAgICBpZiAocGFydHNbMV0gPT09ICcwJykge1xuICAgICAgICByZXR1cm4gcGFydHNbMF0gKyAnICcgKyBieU5hbWUocGFydHNbMF0sIGNvbnRleHQpLnZlcnNpb25zWzBdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4galxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAobm9kZS5jb21wb3NlID09PSAnYW5kJykge1xuICAgICAgaWYgKG5vZGUubm90KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuZmlsdGVyKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaikgPT09IC0xXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0LmZpbHRlcihmdW5jdGlvbiAoaikge1xuICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKGopICE9PSAtMVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobm9kZS5ub3QpIHtcbiAgICAgICAgdmFyIGZpbHRlciA9IHt9XG4gICAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24gKGopIHtcbiAgICAgICAgICBmaWx0ZXJbal0gPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByZXN1bHQuZmlsdGVyKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgcmV0dXJuICFmaWx0ZXJbal1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQuY29uY2F0KGFycmF5KVxuICAgIH1cbiAgfSwgW10pXG59XG5cbmZ1bmN0aW9uIHByZXBhcmVPcHRzKG9wdHMpIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAndW5kZWZpbmVkJykgb3B0cyA9IHt9XG5cbiAgaWYgKHR5cGVvZiBvcHRzLnBhdGggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgb3B0cy5wYXRoID0gcGF0aC5yZXNvbHZlID8gcGF0aC5yZXNvbHZlKCcuJykgOiAnLidcbiAgfVxuXG4gIHJldHVybiBvcHRzXG59XG5cbmZ1bmN0aW9uIHByZXBhcmVRdWVyaWVzKHF1ZXJpZXMsIG9wdHMpIHtcbiAgaWYgKHR5cGVvZiBxdWVyaWVzID09PSAndW5kZWZpbmVkJyB8fCBxdWVyaWVzID09PSBudWxsKSB7XG4gICAgdmFyIGNvbmZpZyA9IGJyb3dzZXJzbGlzdC5sb2FkQ29uZmlnKG9wdHMpXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgcXVlcmllcyA9IGNvbmZpZ1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyaWVzID0gYnJvd3NlcnNsaXN0LmRlZmF1bHRzXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJpZXNcbn1cblxuZnVuY3Rpb24gY2hlY2tRdWVyaWVzKHF1ZXJpZXMpIHtcbiAgaWYgKCEodHlwZW9mIHF1ZXJpZXMgPT09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkocXVlcmllcykpKSB7XG4gICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKFxuICAgICAgJ0Jyb3dzZXIgcXVlcmllcyBtdXN0IGJlIGFuIGFycmF5IG9yIHN0cmluZy4gR290ICcgKyB0eXBlb2YgcXVlcmllcyArICcuJ1xuICAgIClcbiAgfVxufVxuXG52YXIgY2FjaGUgPSB7fVxuXG5mdW5jdGlvbiBicm93c2Vyc2xpc3QocXVlcmllcywgb3B0cykge1xuICBvcHRzID0gcHJlcGFyZU9wdHMob3B0cylcbiAgcXVlcmllcyA9IHByZXBhcmVRdWVyaWVzKHF1ZXJpZXMsIG9wdHMpXG4gIGNoZWNrUXVlcmllcyhxdWVyaWVzKVxuXG4gIHZhciBjb250ZXh0ID0ge1xuICAgIGlnbm9yZVVua25vd25WZXJzaW9uczogb3B0cy5pZ25vcmVVbmtub3duVmVyc2lvbnMsXG4gICAgZGFuZ2Vyb3VzRXh0ZW5kOiBvcHRzLmRhbmdlcm91c0V4dGVuZCxcbiAgICBtb2JpbGVUb0Rlc2t0b3A6IG9wdHMubW9iaWxlVG9EZXNrdG9wLFxuICAgIHBhdGg6IG9wdHMucGF0aCxcbiAgICBlbnY6IG9wdHMuZW52XG4gIH1cblxuICBlbnYub2xkRGF0YVdhcm5pbmcoYnJvd3NlcnNsaXN0LmRhdGEpXG4gIHZhciBzdGF0cyA9IGVudi5nZXRTdGF0KG9wdHMsIGJyb3dzZXJzbGlzdC5kYXRhKVxuICBpZiAoc3RhdHMpIHtcbiAgICBjb250ZXh0LmN1c3RvbVVzYWdlID0ge31cbiAgICBmb3IgKHZhciBicm93c2VyIGluIHN0YXRzKSB7XG4gICAgICBmaWxsVXNhZ2UoY29udGV4dC5jdXN0b21Vc2FnZSwgYnJvd3Nlciwgc3RhdHNbYnJvd3Nlcl0pXG4gICAgfVxuICB9XG5cbiAgdmFyIGNhY2hlS2V5ID0gSlNPTi5zdHJpbmdpZnkoW3F1ZXJpZXMsIGNvbnRleHRdKVxuICBpZiAoY2FjaGVbY2FjaGVLZXldKSByZXR1cm4gY2FjaGVbY2FjaGVLZXldXG5cbiAgdmFyIHJlc3VsdCA9IHVuaXEocmVzb2x2ZShxdWVyaWVzLCBjb250ZXh0KSkuc29ydChmdW5jdGlvbiAobmFtZTEsIG5hbWUyKSB7XG4gICAgbmFtZTEgPSBuYW1lMS5zcGxpdCgnICcpXG4gICAgbmFtZTIgPSBuYW1lMi5zcGxpdCgnICcpXG4gICAgaWYgKG5hbWUxWzBdID09PSBuYW1lMlswXSkge1xuICAgICAgLy8gYXNzdW1wdGlvbnMgb24gY2FuaXVzZSBkYXRhXG4gICAgICAvLyAxKSB2ZXJzaW9uIHJhbmdlcyBuZXZlciBvdmVybGFwc1xuICAgICAgLy8gMikgaWYgdmVyc2lvbiBpcyBub3QgYSByYW5nZSwgaXQgbmV2ZXIgY29udGFpbnMgYC1gXG4gICAgICB2YXIgdmVyc2lvbjEgPSBuYW1lMVsxXS5zcGxpdCgnLScpWzBdXG4gICAgICB2YXIgdmVyc2lvbjIgPSBuYW1lMlsxXS5zcGxpdCgnLScpWzBdXG4gICAgICByZXR1cm4gY29tcGFyZVNlbXZlcih2ZXJzaW9uMi5zcGxpdCgnLicpLCB2ZXJzaW9uMS5zcGxpdCgnLicpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29tcGFyZShuYW1lMVswXSwgbmFtZTJbMF0pXG4gICAgfVxuICB9KVxuICBpZiAoIWVudi5lbnYuQlJPV1NFUlNMSVNUX0RJU0FCTEVfQ0FDSEUpIHtcbiAgICBjYWNoZVtjYWNoZUtleV0gPSByZXN1bHRcbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmJyb3dzZXJzbGlzdC5wYXJzZSA9IGZ1bmN0aW9uIChxdWVyaWVzLCBvcHRzKSB7XG4gIG9wdHMgPSBwcmVwYXJlT3B0cyhvcHRzKVxuICBxdWVyaWVzID0gcHJlcGFyZVF1ZXJpZXMocXVlcmllcywgb3B0cylcbiAgY2hlY2tRdWVyaWVzKHF1ZXJpZXMpXG4gIHJldHVybiBwYXJzZShRVUVSSUVTLCBxdWVyaWVzKVxufVxuXG4vLyBXaWxsIGJlIGZpbGxlZCBieSBDYW4gSSBVc2UgZGF0YSBiZWxvd1xuYnJvd3NlcnNsaXN0LmNhY2hlID0ge31cbmJyb3dzZXJzbGlzdC5kYXRhID0ge31cbmJyb3dzZXJzbGlzdC51c2FnZSA9IHtcbiAgZ2xvYmFsOiB7fSxcbiAgY3VzdG9tOiBudWxsXG59XG5cbi8vIERlZmF1bHQgYnJvd3NlcnMgcXVlcnlcbmJyb3dzZXJzbGlzdC5kZWZhdWx0cyA9IFsnPiAwLjUlJywgJ2xhc3QgMiB2ZXJzaW9ucycsICdGaXJlZm94IEVTUicsICdub3QgZGVhZCddXG5cbi8vIEJyb3dzZXIgbmFtZXMgYWxpYXNlc1xuYnJvd3NlcnNsaXN0LmFsaWFzZXMgPSB7XG4gIGZ4OiAnZmlyZWZveCcsXG4gIGZmOiAnZmlyZWZveCcsXG4gIGlvczogJ2lvc19zYWYnLFxuICBleHBsb3JlcjogJ2llJyxcbiAgYmxhY2tiZXJyeTogJ2JiJyxcbiAgZXhwbG9yZXJtb2JpbGU6ICdpZV9tb2InLFxuICBvcGVyYW1pbmk6ICdvcF9taW5pJyxcbiAgb3BlcmFtb2JpbGU6ICdvcF9tb2InLFxuICBjaHJvbWVhbmRyb2lkOiAnYW5kX2NocicsXG4gIGZpcmVmb3hhbmRyb2lkOiAnYW5kX2ZmJyxcbiAgdWNhbmRyb2lkOiAnYW5kX3VjJyxcbiAgcXFhbmRyb2lkOiAnYW5kX3FxJ1xufVxuXG4vLyBDYW4gSSBVc2Ugb25seSBwcm92aWRlcyBhIGZldyB2ZXJzaW9ucyBmb3Igc29tZSBicm93c2VycyAoZS5nLiBhbmRfY2hyKS5cbi8vIEZhbGxiYWNrIHRvIGEgc2ltaWxhciBicm93c2VyIGZvciB1bmtub3duIHZlcnNpb25zXG4vLyBOb3RlIG9wX21vYiBpcyBub3QgaW5jbHVkZWQgYXMgaXRzIGNocm9taXVtIHZlcnNpb25zIGFyZSBub3QgaW4gc3luYyB3aXRoIE9wZXJhIGRlc2t0b3BcbmJyb3dzZXJzbGlzdC5kZXNrdG9wTmFtZXMgPSB7XG4gIGFuZF9jaHI6ICdjaHJvbWUnLFxuICBhbmRfZmY6ICdmaXJlZm94JyxcbiAgaWVfbW9iOiAnaWUnLFxuICBhbmRyb2lkOiAnY2hyb21lJyAvLyBoYXMgZXh0cmEgcHJvY2Vzc2luZyBsb2dpY1xufVxuXG4vLyBBbGlhc2VzIHRvIHdvcmsgd2l0aCBqb2luZWQgdmVyc2lvbnMgbGlrZSBgaW9zX3NhZiA3LjAtNy4xYFxuYnJvd3NlcnNsaXN0LnZlcnNpb25BbGlhc2VzID0ge31cblxuYnJvd3NlcnNsaXN0LmNsZWFyQ2FjaGVzID0gZW52LmNsZWFyQ2FjaGVzXG5icm93c2Vyc2xpc3QucGFyc2VDb25maWcgPSBlbnYucGFyc2VDb25maWdcbmJyb3dzZXJzbGlzdC5yZWFkQ29uZmlnID0gZW52LnJlYWRDb25maWdcbmJyb3dzZXJzbGlzdC5maW5kQ29uZmlnRmlsZSA9IGVudi5maW5kQ29uZmlnRmlsZVxuYnJvd3NlcnNsaXN0LmZpbmRDb25maWcgPSBlbnYuZmluZENvbmZpZ1xuYnJvd3NlcnNsaXN0LmxvYWRDb25maWcgPSBlbnYubG9hZENvbmZpZ1xuXG5icm93c2Vyc2xpc3QuY292ZXJhZ2UgPSBmdW5jdGlvbiAoYnJvd3NlcnMsIHN0YXRzKSB7XG4gIHZhciBkYXRhXG4gIGlmICh0eXBlb2Ygc3RhdHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGF0YSA9IGJyb3dzZXJzbGlzdC51c2FnZS5nbG9iYWxcbiAgfSBlbHNlIGlmIChzdGF0cyA9PT0gJ215IHN0YXRzJykge1xuICAgIHZhciBvcHRzID0ge31cbiAgICBvcHRzLnBhdGggPSBwYXRoLnJlc29sdmUgPyBwYXRoLnJlc29sdmUoJy4nKSA6ICcuJ1xuICAgIHZhciBjdXN0b21TdGF0cyA9IGVudi5nZXRTdGF0KG9wdHMpXG4gICAgaWYgKCFjdXN0b21TdGF0cykge1xuICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKCdDdXN0b20gdXNhZ2Ugc3RhdGlzdGljcyB3YXMgbm90IHByb3ZpZGVkJylcbiAgICB9XG4gICAgZGF0YSA9IHt9XG4gICAgZm9yICh2YXIgYnJvd3NlciBpbiBjdXN0b21TdGF0cykge1xuICAgICAgZmlsbFVzYWdlKGRhdGEsIGJyb3dzZXIsIGN1c3RvbVN0YXRzW2Jyb3dzZXJdKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3RhdHMgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHN0YXRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHN0YXRzID0gc3RhdHMudG9Mb3dlckNhc2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0cyA9IHN0YXRzLnRvVXBwZXJDYXNlKClcbiAgICB9XG4gICAgZW52LmxvYWRDb3VudHJ5KGJyb3dzZXJzbGlzdC51c2FnZSwgc3RhdHMsIGJyb3dzZXJzbGlzdC5kYXRhKVxuICAgIGRhdGEgPSBicm93c2Vyc2xpc3QudXNhZ2Vbc3RhdHNdXG4gIH0gZWxzZSB7XG4gICAgaWYgKCdkYXRhQnlCcm93c2VyJyBpbiBzdGF0cykge1xuICAgICAgc3RhdHMgPSBzdGF0cy5kYXRhQnlCcm93c2VyXG4gICAgfVxuICAgIGRhdGEgPSB7fVxuICAgIGZvciAodmFyIG5hbWUgaW4gc3RhdHMpIHtcbiAgICAgIGZvciAodmFyIHZlcnNpb24gaW4gc3RhdHNbbmFtZV0pIHtcbiAgICAgICAgZGF0YVtuYW1lICsgJyAnICsgdmVyc2lvbl0gPSBzdGF0c1tuYW1lXVt2ZXJzaW9uXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBicm93c2Vycy5yZWR1Y2UoZnVuY3Rpb24gKGFsbCwgaSkge1xuICAgIHZhciB1c2FnZSA9IGRhdGFbaV1cbiAgICBpZiAodXNhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdXNhZ2UgPSBkYXRhW2kucmVwbGFjZSgvIFxcUyskLywgJyAwJyldXG4gICAgfVxuICAgIHJldHVybiBhbGwgKyAodXNhZ2UgfHwgMClcbiAgfSwgMClcbn1cblxuZnVuY3Rpb24gbm9kZVF1ZXJ5KGNvbnRleHQsIG5vZGUpIHtcbiAgdmFyIG1hdGNoZWQgPSBicm93c2Vyc2xpc3Qubm9kZVZlcnNpb25zLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgIHJldHVybiBpc1ZlcnNpb25zTWF0Y2goaSwgbm9kZS52ZXJzaW9uKVxuICB9KVxuICBpZiAobWF0Y2hlZC5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoY29udGV4dC5pZ25vcmVVbmtub3duVmVyc2lvbnMpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAgICdVbmtub3duIHZlcnNpb24gJyArIG5vZGUudmVyc2lvbiArICcgb2YgTm9kZS5qcydcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFsnbm9kZSAnICsgbWF0Y2hlZFttYXRjaGVkLmxlbmd0aCAtIDFdXVxufVxuXG5mdW5jdGlvbiBzaW5jZVF1ZXJ5KGNvbnRleHQsIG5vZGUpIHtcbiAgdmFyIHllYXIgPSBwYXJzZUludChub2RlLnllYXIpXG4gIHZhciBtb250aCA9IHBhcnNlSW50KG5vZGUubW9udGggfHwgJzAxJykgLSAxXG4gIHZhciBkYXkgPSBwYXJzZUludChub2RlLmRheSB8fCAnMDEnKVxuICByZXR1cm4gZmlsdGVyQnlZZWFyKERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXksIDAsIDAsIDApLCBjb250ZXh0KVxufVxuXG5mdW5jdGlvbiBjb3ZlclF1ZXJ5KGNvbnRleHQsIG5vZGUpIHtcbiAgdmFyIGNvdmVyYWdlID0gcGFyc2VGbG9hdChub2RlLmNvdmVyYWdlKVxuICB2YXIgdXNhZ2UgPSBicm93c2Vyc2xpc3QudXNhZ2UuZ2xvYmFsXG4gIGlmIChub2RlLnBsYWNlKSB7XG4gICAgaWYgKG5vZGUucGxhY2UubWF0Y2goL15teVxccytzdGF0cyQvaSkpIHtcbiAgICAgIGlmICghY29udGV4dC5jdXN0b21Vc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoJ0N1c3RvbSB1c2FnZSBzdGF0aXN0aWNzIHdhcyBub3QgcHJvdmlkZWQnKVxuICAgICAgfVxuICAgICAgdXNhZ2UgPSBjb250ZXh0LmN1c3RvbVVzYWdlXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwbGFjZVxuICAgICAgaWYgKG5vZGUucGxhY2UubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHBsYWNlID0gbm9kZS5wbGFjZS50b1VwcGVyQ2FzZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGFjZSA9IG5vZGUucGxhY2UudG9Mb3dlckNhc2UoKVxuICAgICAgfVxuICAgICAgZW52LmxvYWRDb3VudHJ5KGJyb3dzZXJzbGlzdC51c2FnZSwgcGxhY2UsIGJyb3dzZXJzbGlzdC5kYXRhKVxuICAgICAgdXNhZ2UgPSBicm93c2Vyc2xpc3QudXNhZ2VbcGxhY2VdXG4gICAgfVxuICB9XG4gIHZhciB2ZXJzaW9ucyA9IE9iamVjdC5rZXlzKHVzYWdlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIHVzYWdlW2JdIC0gdXNhZ2VbYV1cbiAgfSlcbiAgdmFyIGNvdmVyYWdlZCA9IDBcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIHZhciB2ZXJzaW9uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2ZXJzaW9uID0gdmVyc2lvbnNbaV1cbiAgICBpZiAodXNhZ2VbdmVyc2lvbl0gPT09IDApIGJyZWFrXG4gICAgY292ZXJhZ2VkICs9IHVzYWdlW3ZlcnNpb25dXG4gICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICBpZiAoY292ZXJhZ2VkID49IGNvdmVyYWdlKSBicmVha1xuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxudmFyIFFVRVJJRVMgPSB7XG4gIGxhc3RfbWFqb3JfdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb25zJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCspXFxzK21ham9yXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYWdlbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKHNlbGVjdGVkLCBuYW1lKSB7XG4gICAgICAgIHZhciBkYXRhID0gYnlOYW1lKG5hbWUsIGNvbnRleHQpXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuIHNlbGVjdGVkXG4gICAgICAgIHZhciBsaXN0ID0gZ2V0TWFqb3JWZXJzaW9ucyhkYXRhLnJlbGVhc2VkLCBub2RlLnZlcnNpb25zKVxuICAgICAgICBsaXN0ID0gbGlzdC5tYXAobmFtZU1hcHBlcihkYXRhLm5hbWUpKVxuICAgICAgICBsaXN0ID0gZmlsdGVySnVtcHMobGlzdCwgZGF0YS5uYW1lLCBub2RlLnZlcnNpb25zLCBjb250ZXh0KVxuICAgICAgICByZXR1cm4gc2VsZWN0ZWQuY29uY2F0KGxpc3QpXG4gICAgICB9LCBbXSlcbiAgICB9XG4gIH0sXG4gIGxhc3RfdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb25zJ10sXG4gICAgcmVnZXhwOiAvXmxhc3RcXHMrKFxcZCspXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYWdlbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKHNlbGVjdGVkLCBuYW1lKSB7XG4gICAgICAgIHZhciBkYXRhID0gYnlOYW1lKG5hbWUsIGNvbnRleHQpXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuIHNlbGVjdGVkXG4gICAgICAgIHZhciBsaXN0ID0gZGF0YS5yZWxlYXNlZC5zbGljZSgtbm9kZS52ZXJzaW9ucylcbiAgICAgICAgbGlzdCA9IGxpc3QubWFwKG5hbWVNYXBwZXIoZGF0YS5uYW1lKSlcbiAgICAgICAgbGlzdCA9IGZpbHRlckp1bXBzKGxpc3QsIGRhdGEubmFtZSwgbm9kZS52ZXJzaW9ucywgY29udGV4dClcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkLmNvbmNhdChsaXN0KVxuICAgICAgfSwgW10pXG4gICAgfVxuICB9LFxuICBsYXN0X2VsZWN0cm9uX21ham9yX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9ucyddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQrKVxccytlbGVjdHJvblxccyttYWpvclxccyt2ZXJzaW9ucz8kL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgdmFyIHZhbGlkVmVyc2lvbnMgPSBnZXRNYWpvclZlcnNpb25zKE9iamVjdC5rZXlzKGUyYyksIG5vZGUudmVyc2lvbnMpXG4gICAgICByZXR1cm4gdmFsaWRWZXJzaW9ucy5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuICdjaHJvbWUgJyArIGUyY1tpXVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGxhc3Rfbm9kZV9tYWpvcl92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbnMnXSxcbiAgICByZWdleHA6IC9ebGFzdFxccysoXFxkKylcXHMrbm9kZVxccyttYWpvclxccyt2ZXJzaW9ucz8kL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgcmV0dXJuIGdldE1ham9yVmVyc2lvbnMoYnJvd3NlcnNsaXN0Lm5vZGVWZXJzaW9ucywgbm9kZS52ZXJzaW9ucykubWFwKFxuICAgICAgICBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgICAgIHJldHVybiAnbm9kZSAnICsgdmVyc2lvblxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICB9LFxuICBsYXN0X2Jyb3dzZXJfbWFqb3JfdmVyc2lvbnM6IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb25zJywgJ2Jyb3dzZXInXSxcbiAgICByZWdleHA6IC9ebGFzdFxccysoXFxkKylcXHMrKFxcdyspXFxzK21ham9yXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgZGF0YSA9IGNoZWNrTmFtZShub2RlLmJyb3dzZXIsIGNvbnRleHQpXG4gICAgICB2YXIgdmFsaWRWZXJzaW9ucyA9IGdldE1ham9yVmVyc2lvbnMoZGF0YS5yZWxlYXNlZCwgbm9kZS52ZXJzaW9ucylcbiAgICAgIHZhciBsaXN0ID0gdmFsaWRWZXJzaW9ucy5tYXAobmFtZU1hcHBlcihkYXRhLm5hbWUpKVxuICAgICAgbGlzdCA9IGZpbHRlckp1bXBzKGxpc3QsIGRhdGEubmFtZSwgbm9kZS52ZXJzaW9ucywgY29udGV4dClcbiAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuICB9LFxuICBsYXN0X2VsZWN0cm9uX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9ucyddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQrKVxccytlbGVjdHJvblxccyt2ZXJzaW9ucz8kL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGUyYylcbiAgICAgICAgLnNsaWNlKC1ub2RlLnZlcnNpb25zKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgcmV0dXJuICdjaHJvbWUgJyArIGUyY1tpXVxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcbiAgbGFzdF9ub2RlX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9ucyddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQrKVxccytub2RlXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gYnJvd3NlcnNsaXN0Lm5vZGVWZXJzaW9uc1xuICAgICAgICAuc2xpY2UoLW5vZGUudmVyc2lvbnMpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgICByZXR1cm4gJ25vZGUgJyArIHZlcnNpb25cbiAgICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGxhc3RfYnJvd3Nlcl92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFsndmVyc2lvbnMnLCAnYnJvd3NlciddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQrKVxccysoXFx3KylcXHMrdmVyc2lvbnM/JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBkYXRhID0gY2hlY2tOYW1lKG5vZGUuYnJvd3NlciwgY29udGV4dClcbiAgICAgIHZhciBsaXN0ID0gZGF0YS5yZWxlYXNlZC5zbGljZSgtbm9kZS52ZXJzaW9ucykubWFwKG5hbWVNYXBwZXIoZGF0YS5uYW1lKSlcbiAgICAgIGxpc3QgPSBmaWx0ZXJKdW1wcyhsaXN0LCBkYXRhLm5hbWUsIG5vZGUudmVyc2lvbnMsIGNvbnRleHQpXG4gICAgICByZXR1cm4gbGlzdFxuICAgIH1cbiAgfSxcbiAgdW5yZWxlYXNlZF92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL151bnJlbGVhc2VkXFxzK3ZlcnNpb25zJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhZ2VudHMpLnJlZHVjZShmdW5jdGlvbiAoc2VsZWN0ZWQsIG5hbWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBieU5hbWUobmFtZSwgY29udGV4dClcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gc2VsZWN0ZWRcbiAgICAgICAgdmFyIGxpc3QgPSBkYXRhLnZlcnNpb25zLmZpbHRlcihmdW5jdGlvbiAodikge1xuICAgICAgICAgIHJldHVybiBkYXRhLnJlbGVhc2VkLmluZGV4T2YodikgPT09IC0xXG4gICAgICAgIH0pXG4gICAgICAgIGxpc3QgPSBsaXN0Lm1hcChuYW1lTWFwcGVyKGRhdGEubmFtZSkpXG4gICAgICAgIHJldHVybiBzZWxlY3RlZC5jb25jYXQobGlzdClcbiAgICAgIH0sIFtdKVxuICAgIH1cbiAgfSxcbiAgdW5yZWxlYXNlZF9lbGVjdHJvbl92ZXJzaW9uczoge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL151bnJlbGVhc2VkXFxzK2VsZWN0cm9uXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSxcbiAgdW5yZWxlYXNlZF9icm93c2VyX3ZlcnNpb25zOiB7XG4gICAgbWF0Y2hlczogWydicm93c2VyJ10sXG4gICAgcmVnZXhwOiAvXnVucmVsZWFzZWRcXHMrKFxcdyspXFxzK3ZlcnNpb25zPyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgZGF0YSA9IGNoZWNrTmFtZShub2RlLmJyb3dzZXIsIGNvbnRleHQpXG4gICAgICByZXR1cm4gZGF0YS52ZXJzaW9uc1xuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucmVsZWFzZWQuaW5kZXhPZih2KSA9PT0gLTFcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcChuYW1lTWFwcGVyKGRhdGEubmFtZSkpXG4gICAgfVxuICB9LFxuICBsYXN0X3llYXJzOiB7XG4gICAgbWF0Y2hlczogWyd5ZWFycyddLFxuICAgIHJlZ2V4cDogL15sYXN0XFxzKyhcXGQqLj9cXGQrKVxccyt5ZWFycz8kL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgcmV0dXJuIGZpbHRlckJ5WWVhcihEYXRlLm5vdygpIC0gWUVBUiAqIG5vZGUueWVhcnMsIGNvbnRleHQpXG4gICAgfVxuICB9LFxuICBzaW5jZV95OiB7XG4gICAgbWF0Y2hlczogWyd5ZWFyJ10sXG4gICAgcmVnZXhwOiAvXnNpbmNlIChcXGQrKSQvaSxcbiAgICBzZWxlY3Q6IHNpbmNlUXVlcnlcbiAgfSxcbiAgc2luY2VfeV9tOiB7XG4gICAgbWF0Y2hlczogWyd5ZWFyJywgJ21vbnRoJ10sXG4gICAgcmVnZXhwOiAvXnNpbmNlIChcXGQrKS0oXFxkKykkL2ksXG4gICAgc2VsZWN0OiBzaW5jZVF1ZXJ5XG4gIH0sXG4gIHNpbmNlX3lfbV9kOiB7XG4gICAgbWF0Y2hlczogWyd5ZWFyJywgJ21vbnRoJywgJ2RheSddLFxuICAgIHJlZ2V4cDogL15zaW5jZSAoXFxkKyktKFxcZCspLShcXGQrKSQvaSxcbiAgICBzZWxlY3Q6IHNpbmNlUXVlcnlcbiAgfSxcbiAgcG9wdWxhcml0eToge1xuICAgIG1hdGNoZXM6IFsnc2lnbicsICdwb3B1bGFyaXR5J10sXG4gICAgcmVnZXhwOiAvXig+PT98PD0/KVxccyooXFxkK3xcXGQrXFwuXFxkK3xcXC5cXGQrKSUkLyxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgcG9wdWxhcml0eSA9IHBhcnNlRmxvYXQobm9kZS5wb3B1bGFyaXR5KVxuICAgICAgdmFyIHVzYWdlID0gYnJvd3NlcnNsaXN0LnVzYWdlLmdsb2JhbFxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHVzYWdlKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgdmVyc2lvbikge1xuICAgICAgICBpZiAobm9kZS5zaWduID09PSAnPicpIHtcbiAgICAgICAgICBpZiAodXNhZ2VbdmVyc2lvbl0gPiBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnNpZ24gPT09ICc8Jykge1xuICAgICAgICAgIGlmICh1c2FnZVt2ZXJzaW9uXSA8IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzw9Jykge1xuICAgICAgICAgIGlmICh1c2FnZVt2ZXJzaW9uXSA8PSBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh1c2FnZVt2ZXJzaW9uXSA+PSBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9LCBbXSlcbiAgICB9XG4gIH0sXG4gIHBvcHVsYXJpdHlfaW5fbXlfc3RhdHM6IHtcbiAgICBtYXRjaGVzOiBbJ3NpZ24nLCAncG9wdWxhcml0eSddLFxuICAgIHJlZ2V4cDogL14oPj0/fDw9PylcXHMqKFxcZCt8XFxkK1xcLlxcZCt8XFwuXFxkKyklXFxzK2luXFxzK215XFxzK3N0YXRzJC8sXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgdmFyIHBvcHVsYXJpdHkgPSBwYXJzZUZsb2F0KG5vZGUucG9wdWxhcml0eSlcbiAgICAgIGlmICghY29udGV4dC5jdXN0b21Vc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoJ0N1c3RvbSB1c2FnZSBzdGF0aXN0aWNzIHdhcyBub3QgcHJvdmlkZWQnKVxuICAgICAgfVxuICAgICAgdmFyIHVzYWdlID0gY29udGV4dC5jdXN0b21Vc2FnZVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHVzYWdlKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgdmVyc2lvbikge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IHVzYWdlW3ZlcnNpb25dXG4gICAgICAgIGlmIChwZXJjZW50YWdlID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9kZS5zaWduID09PSAnPicpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA+IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzwnKSB7XG4gICAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPCBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnNpZ24gPT09ICc8PScpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA8PSBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwZXJjZW50YWdlID49IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0sIFtdKVxuICAgIH1cbiAgfSxcbiAgcG9wdWxhcml0eV9pbl9jb25maWdfc3RhdHM6IHtcbiAgICBtYXRjaGVzOiBbJ3NpZ24nLCAncG9wdWxhcml0eScsICdjb25maWcnXSxcbiAgICByZWdleHA6IC9eKD49P3w8PT8pXFxzKihcXGQrfFxcZCtcXC5cXGQrfFxcLlxcZCspJVxccytpblxccysoXFxTKylcXHMrc3RhdHMkLyxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgcG9wdWxhcml0eSA9IHBhcnNlRmxvYXQobm9kZS5wb3B1bGFyaXR5KVxuICAgICAgdmFyIHN0YXRzID0gZW52LmxvYWRTdGF0KGNvbnRleHQsIG5vZGUuY29uZmlnLCBicm93c2Vyc2xpc3QuZGF0YSlcbiAgICAgIGlmIChzdGF0cykge1xuICAgICAgICBjb250ZXh0LmN1c3RvbVVzYWdlID0ge31cbiAgICAgICAgZm9yICh2YXIgYnJvd3NlciBpbiBzdGF0cykge1xuICAgICAgICAgIGZpbGxVc2FnZShjb250ZXh0LmN1c3RvbVVzYWdlLCBicm93c2VyLCBzdGF0c1ticm93c2VyXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFjb250ZXh0LmN1c3RvbVVzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcignQ3VzdG9tIHVzYWdlIHN0YXRpc3RpY3Mgd2FzIG5vdCBwcm92aWRlZCcpXG4gICAgICB9XG4gICAgICB2YXIgdXNhZ2UgPSBjb250ZXh0LmN1c3RvbVVzYWdlXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModXNhZ2UpLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCB2ZXJzaW9uKSB7XG4gICAgICAgIHZhciBwZXJjZW50YWdlID0gdXNhZ2VbdmVyc2lvbl1cbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLnNpZ24gPT09ICc+Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlID4gcG9wdWxhcml0eSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmVyc2lvbilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5zaWduID09PSAnPCcpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA8IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzw9Jykge1xuICAgICAgICAgIGlmIChwZXJjZW50YWdlIDw9IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBlcmNlbnRhZ2UgPj0gcG9wdWxhcml0eSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSwgW10pXG4gICAgfVxuICB9LFxuICBwb3B1bGFyaXR5X2luX3BsYWNlOiB7XG4gICAgbWF0Y2hlczogWydzaWduJywgJ3BvcHVsYXJpdHknLCAncGxhY2UnXSxcbiAgICByZWdleHA6IC9eKD49P3w8PT8pXFxzKihcXGQrfFxcZCtcXC5cXGQrfFxcLlxcZCspJVxccytpblxccysoKGFsdC0pP1xcd1xcdykkLyxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgcG9wdWxhcml0eSA9IHBhcnNlRmxvYXQobm9kZS5wb3B1bGFyaXR5KVxuICAgICAgdmFyIHBsYWNlID0gbm9kZS5wbGFjZVxuICAgICAgaWYgKHBsYWNlLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBwbGFjZSA9IHBsYWNlLnRvVXBwZXJDYXNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYWNlID0gcGxhY2UudG9Mb3dlckNhc2UoKVxuICAgICAgfVxuICAgICAgZW52LmxvYWRDb3VudHJ5KGJyb3dzZXJzbGlzdC51c2FnZSwgcGxhY2UsIGJyb3dzZXJzbGlzdC5kYXRhKVxuICAgICAgdmFyIHVzYWdlID0gYnJvd3NlcnNsaXN0LnVzYWdlW3BsYWNlXVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHVzYWdlKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgdmVyc2lvbikge1xuICAgICAgICB2YXIgcGVyY2VudGFnZSA9IHVzYWdlW3ZlcnNpb25dXG4gICAgICAgIGlmIChwZXJjZW50YWdlID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9kZS5zaWduID09PSAnPicpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA+IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZlcnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc2lnbiA9PT0gJzwnKSB7XG4gICAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPCBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnNpZ24gPT09ICc8PScpIHtcbiAgICAgICAgICBpZiAocGVyY2VudGFnZSA8PSBwb3B1bGFyaXR5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwZXJjZW50YWdlID49IHBvcHVsYXJpdHkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2ZXJzaW9uKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0sIFtdKVxuICAgIH1cbiAgfSxcbiAgY292ZXI6IHtcbiAgICBtYXRjaGVzOiBbJ2NvdmVyYWdlJ10sXG4gICAgcmVnZXhwOiAvXmNvdmVyXFxzKyhcXGQrfFxcZCtcXC5cXGQrfFxcLlxcZCspJSQvaSxcbiAgICBzZWxlY3Q6IGNvdmVyUXVlcnlcbiAgfSxcbiAgY292ZXJfaW46IHtcbiAgICBtYXRjaGVzOiBbJ2NvdmVyYWdlJywgJ3BsYWNlJ10sXG4gICAgcmVnZXhwOiAvXmNvdmVyXFxzKyhcXGQrfFxcZCtcXC5cXGQrfFxcLlxcZCspJVxccytpblxccysobXlcXHMrc3RhdHN8KGFsdC0pP1xcd1xcdykkL2ksXG4gICAgc2VsZWN0OiBjb3ZlclF1ZXJ5XG4gIH0sXG4gIHN1cHBvcnRzOiB7XG4gICAgbWF0Y2hlczogWydzdXBwb3J0VHlwZScsICdmZWF0dXJlJ10sXG4gICAgcmVnZXhwOiAvXig/OihmdWxseXxwYXJ0aWFsbHkpXFxzKyk/c3VwcG9ydHNcXHMrKFtcXHctXSspJC8sXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgZW52LmxvYWRGZWF0dXJlKGJyb3dzZXJzbGlzdC5jYWNoZSwgbm9kZS5mZWF0dXJlKVxuICAgICAgdmFyIHdpdGhQYXJ0aWFsID0gbm9kZS5zdXBwb3J0VHlwZSAhPT0gJ2Z1bGx5J1xuICAgICAgdmFyIGZlYXR1cmVzID0gYnJvd3NlcnNsaXN0LmNhY2hlW25vZGUuZmVhdHVyZV1cbiAgICAgIHZhciByZXN1bHQgPSBbXVxuICAgICAgZm9yICh2YXIgbmFtZSBpbiBmZWF0dXJlcykge1xuICAgICAgICB2YXIgZGF0YSA9IGJ5TmFtZShuYW1lLCBjb250ZXh0KVxuICAgICAgICAvLyBPbmx5IGNoZWNrIGRlc2t0b3Agd2hlbiBsYXRlc3QgcmVsZWFzZWQgbW9iaWxlIGhhcyBzdXBwb3J0XG4gICAgICAgIHZhciBpTWF4ID0gZGF0YS5yZWxlYXNlZC5sZW5ndGggLSAxXG4gICAgICAgIHdoaWxlIChpTWF4ID49IDApIHtcbiAgICAgICAgICBpZiAoZGF0YS5yZWxlYXNlZFtpTWF4XSBpbiBmZWF0dXJlc1tuYW1lXSkgYnJlYWtcbiAgICAgICAgICBpTWF4LS1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hlY2tEZXNrdG9wID1cbiAgICAgICAgICBjb250ZXh0Lm1vYmlsZVRvRGVza3RvcCAmJlxuICAgICAgICAgIG5hbWUgaW4gYnJvd3NlcnNsaXN0LmRlc2t0b3BOYW1lcyAmJlxuICAgICAgICAgIGlzU3VwcG9ydGVkKGZlYXR1cmVzW25hbWVdW2RhdGEucmVsZWFzZWRbaU1heF1dLCB3aXRoUGFydGlhbClcbiAgICAgICAgZGF0YS52ZXJzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICAgICAgdmFyIGZsYWdzID0gZmVhdHVyZXNbbmFtZV1bdmVyc2lvbl1cbiAgICAgICAgICBpZiAoZmxhZ3MgPT09IHVuZGVmaW5lZCAmJiBjaGVja0Rlc2t0b3ApIHtcbiAgICAgICAgICAgIGZsYWdzID0gZmVhdHVyZXNbYnJvd3NlcnNsaXN0LmRlc2t0b3BOYW1lc1tuYW1lXV1bdmVyc2lvbl1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzU3VwcG9ydGVkKGZsYWdzLCB3aXRoUGFydGlhbCkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5hbWUgKyAnICcgKyB2ZXJzaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG4gIH0sXG4gIGVsZWN0cm9uX3JhbmdlOiB7XG4gICAgbWF0Y2hlczogWydmcm9tJywgJ3RvJ10sXG4gICAgcmVnZXhwOiAvXmVsZWN0cm9uXFxzKyhbXFxkLl0rKVxccyotXFxzKihbXFxkLl0rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgZnJvbVRvVXNlID0gbm9ybWFsaXplRWxlY3Ryb24obm9kZS5mcm9tKVxuICAgICAgdmFyIHRvVG9Vc2UgPSBub3JtYWxpemVFbGVjdHJvbihub2RlLnRvKVxuICAgICAgdmFyIGZyb20gPSBwYXJzZUZsb2F0KG5vZGUuZnJvbSlcbiAgICAgIHZhciB0byA9IHBhcnNlRmxvYXQobm9kZS50bylcbiAgICAgIGlmICghZTJjW2Zyb21Ub1VzZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEJyb3dzZXJzbGlzdEVycm9yKCdVbmtub3duIHZlcnNpb24gJyArIGZyb20gKyAnIG9mIGVsZWN0cm9uJylcbiAgICAgIH1cbiAgICAgIGlmICghZTJjW3RvVG9Vc2VdKSB7XG4gICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcignVW5rbm93biB2ZXJzaW9uICcgKyB0byArICcgb2YgZWxlY3Ryb24nKVxuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGUyYylcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIHZhciBwYXJzZWQgPSBwYXJzZUZsb2F0KGkpXG4gICAgICAgICAgcmV0dXJuIHBhcnNlZCA+PSBmcm9tICYmIHBhcnNlZCA8PSB0b1xuICAgICAgICB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgcmV0dXJuICdjaHJvbWUgJyArIGUyY1tpXVxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcbiAgbm9kZV9yYW5nZToge1xuICAgIG1hdGNoZXM6IFsnZnJvbScsICd0byddLFxuICAgIHJlZ2V4cDogL15ub2RlXFxzKyhbXFxkLl0rKVxccyotXFxzKihbXFxkLl0rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gYnJvd3NlcnNsaXN0Lm5vZGVWZXJzaW9uc1xuICAgICAgICAuZmlsdGVyKHNlbXZlckZpbHRlckxvb3NlKCc+PScsIG5vZGUuZnJvbSkpXG4gICAgICAgIC5maWx0ZXIoc2VtdmVyRmlsdGVyTG9vc2UoJzw9Jywgbm9kZS50bykpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICByZXR1cm4gJ25vZGUgJyArIHZcbiAgICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGJyb3dzZXJfcmFuZ2U6IHtcbiAgICBtYXRjaGVzOiBbJ2Jyb3dzZXInLCAnZnJvbScsICd0byddLFxuICAgIHJlZ2V4cDogL14oXFx3KylcXHMrKFtcXGQuXSspXFxzKi1cXHMqKFtcXGQuXSspJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICAgIHZhciBkYXRhID0gY2hlY2tOYW1lKG5vZGUuYnJvd3NlciwgY29udGV4dClcbiAgICAgIHZhciBmcm9tID0gcGFyc2VGbG9hdChub3JtYWxpemVWZXJzaW9uKGRhdGEsIG5vZGUuZnJvbSkgfHwgbm9kZS5mcm9tKVxuICAgICAgdmFyIHRvID0gcGFyc2VGbG9hdChub3JtYWxpemVWZXJzaW9uKGRhdGEsIG5vZGUudG8pIHx8IG5vZGUudG8pXG4gICAgICBmdW5jdGlvbiBmaWx0ZXIodikge1xuICAgICAgICB2YXIgcGFyc2VkID0gcGFyc2VGbG9hdCh2KVxuICAgICAgICByZXR1cm4gcGFyc2VkID49IGZyb20gJiYgcGFyc2VkIDw9IHRvXG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YS5yZWxlYXNlZC5maWx0ZXIoZmlsdGVyKS5tYXAobmFtZU1hcHBlcihkYXRhLm5hbWUpKVxuICAgIH1cbiAgfSxcbiAgZWxlY3Ryb25fcmF5OiB7XG4gICAgbWF0Y2hlczogWydzaWduJywgJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9eZWxlY3Ryb25cXHMqKD49P3w8PT8pXFxzKihbXFxkLl0rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgdmVyc2lvblRvVXNlID0gbm9ybWFsaXplRWxlY3Ryb24obm9kZS52ZXJzaW9uKVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGUyYylcbiAgICAgICAgLmZpbHRlcihnZW5lcmF0ZUZpbHRlcihub2RlLnNpZ24sIHZlcnNpb25Ub1VzZSkpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICByZXR1cm4gJ2Nocm9tZSAnICsgZTJjW2ldXG4gICAgICAgIH0pXG4gICAgfVxuICB9LFxuICBub2RlX3JheToge1xuICAgIG1hdGNoZXM6IFsnc2lnbicsICd2ZXJzaW9uJ10sXG4gICAgcmVnZXhwOiAvXm5vZGVcXHMqKD49P3w8PT8pXFxzKihbXFxkLl0rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICByZXR1cm4gYnJvd3NlcnNsaXN0Lm5vZGVWZXJzaW9uc1xuICAgICAgICAuZmlsdGVyKGdlbmVyYXRlU2VtdmVyRmlsdGVyKG5vZGUuc2lnbiwgbm9kZS52ZXJzaW9uKSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgIHJldHVybiAnbm9kZSAnICsgdlxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcbiAgYnJvd3Nlcl9yYXk6IHtcbiAgICBtYXRjaGVzOiBbJ2Jyb3dzZXInLCAnc2lnbicsICd2ZXJzaW9uJ10sXG4gICAgcmVnZXhwOiAvXihcXHcrKVxccyooPj0/fDw9PylcXHMqKFtcXGQuXSspJC8sXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgdmFyIHZlcnNpb24gPSBub2RlLnZlcnNpb25cbiAgICAgIHZhciBkYXRhID0gY2hlY2tOYW1lKG5vZGUuYnJvd3NlciwgY29udGV4dClcbiAgICAgIHZhciBhbGlhcyA9IGJyb3dzZXJzbGlzdC52ZXJzaW9uQWxpYXNlc1tkYXRhLm5hbWVdW3ZlcnNpb25dXG4gICAgICBpZiAoYWxpYXMpIHZlcnNpb24gPSBhbGlhc1xuICAgICAgcmV0dXJuIGRhdGEucmVsZWFzZWRcbiAgICAgICAgLmZpbHRlcihnZW5lcmF0ZUZpbHRlcihub2RlLnNpZ24sIHZlcnNpb24pKVxuICAgICAgICAubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEubmFtZSArICcgJyArIHZcbiAgICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGZpcmVmb3hfZXNyOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXihmaXJlZm94fGZmfGZ4KVxccytlc3IkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gWydmaXJlZm94IDExNScsICdmaXJlZm94IDEyOCddXG4gICAgfVxuICB9LFxuICBvcGVyYV9taW5pX2FsbDoge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogLyhvcGVyYW1pbml8b3BfbWluaSlcXHMrYWxsL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gWydvcF9taW5pIGFsbCddXG4gICAgfVxuICB9LFxuICBlbGVjdHJvbl92ZXJzaW9uOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9uJ10sXG4gICAgcmVnZXhwOiAvXmVsZWN0cm9uXFxzKyhbXFxkLl0rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgdmVyc2lvblRvVXNlID0gbm9ybWFsaXplRWxlY3Ryb24obm9kZS52ZXJzaW9uKVxuICAgICAgdmFyIGNocm9tZSA9IGUyY1t2ZXJzaW9uVG9Vc2VdXG4gICAgICBpZiAoIWNocm9tZSkge1xuICAgICAgICB0aHJvdyBuZXcgQnJvd3NlcnNsaXN0RXJyb3IoXG4gICAgICAgICAgJ1Vua25vd24gdmVyc2lvbiAnICsgbm9kZS52ZXJzaW9uICsgJyBvZiBlbGVjdHJvbidcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIFsnY2hyb21lICcgKyBjaHJvbWVdXG4gICAgfVxuICB9LFxuICBub2RlX21ham9yX3ZlcnNpb246IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9ebm9kZVxccysoXFxkKykkL2ksXG4gICAgc2VsZWN0OiBub2RlUXVlcnlcbiAgfSxcbiAgbm9kZV9taW5vcl92ZXJzaW9uOiB7XG4gICAgbWF0Y2hlczogWyd2ZXJzaW9uJ10sXG4gICAgcmVnZXhwOiAvXm5vZGVcXHMrKFxcZCtcXC5cXGQrKSQvaSxcbiAgICBzZWxlY3Q6IG5vZGVRdWVyeVxuICB9LFxuICBub2RlX3BhdGNoX3ZlcnNpb246IHtcbiAgICBtYXRjaGVzOiBbJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9ebm9kZVxccysoXFxkK1xcLlxcZCtcXC5cXGQrKSQvaSxcbiAgICBzZWxlY3Q6IG5vZGVRdWVyeVxuICB9LFxuICBjdXJyZW50X25vZGU6IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9eY3VycmVudFxccytub2RlJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBbZW52LmN1cnJlbnROb2RlKHJlc29sdmUsIGNvbnRleHQpXVxuICAgIH1cbiAgfSxcbiAgbWFpbnRhaW5lZF9ub2RlOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXm1haW50YWluZWRcXHMrbm9kZVxccyt2ZXJzaW9ucyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgdmFyIHF1ZXJpZXMgPSBPYmplY3Qua2V5cyhqc0VPTClcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG5vdyA8IERhdGUucGFyc2UoanNFT0xba2V5XS5lbmQpICYmXG4gICAgICAgICAgICBub3cgPiBEYXRlLnBhcnNlKGpzRU9MW2tleV0uc3RhcnQpICYmXG4gICAgICAgICAgICBpc0VvbFJlbGVhc2VkKGtleSlcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiAnbm9kZSAnICsga2V5LnNsaWNlKDEpXG4gICAgICAgIH0pXG4gICAgICByZXR1cm4gcmVzb2x2ZShxdWVyaWVzLCBjb250ZXh0KVxuICAgIH1cbiAgfSxcbiAgcGhhbnRvbWpzXzFfOToge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL15waGFudG9tanNcXHMrMS45JC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFsnc2FmYXJpIDUnXVxuICAgIH1cbiAgfSxcbiAgcGhhbnRvbWpzXzJfMToge1xuICAgIG1hdGNoZXM6IFtdLFxuICAgIHJlZ2V4cDogL15waGFudG9tanNcXHMrMi4xJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFsnc2FmYXJpIDYnXVxuICAgIH1cbiAgfSxcbiAgYnJvd3Nlcl92ZXJzaW9uOiB7XG4gICAgbWF0Y2hlczogWydicm93c2VyJywgJ3ZlcnNpb24nXSxcbiAgICByZWdleHA6IC9eKFxcdyspXFxzKyh0cHxbXFxkLl0rKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICB2YXIgdmVyc2lvbiA9IG5vZGUudmVyc2lvblxuICAgICAgaWYgKC9edHAkL2kudGVzdCh2ZXJzaW9uKSkgdmVyc2lvbiA9ICdUUCdcbiAgICAgIHZhciBkYXRhID0gY2hlY2tOYW1lKG5vZGUuYnJvd3NlciwgY29udGV4dClcbiAgICAgIHZhciBhbGlhcyA9IG5vcm1hbGl6ZVZlcnNpb24oZGF0YSwgdmVyc2lvbilcbiAgICAgIGlmIChhbGlhcykge1xuICAgICAgICB2ZXJzaW9uID0gYWxpYXNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2ZXJzaW9uLmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcbiAgICAgICAgICBhbGlhcyA9IHZlcnNpb24gKyAnLjAnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxpYXMgPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLjAkLywgJycpXG4gICAgICAgIH1cbiAgICAgICAgYWxpYXMgPSBub3JtYWxpemVWZXJzaW9uKGRhdGEsIGFsaWFzKVxuICAgICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgICB2ZXJzaW9uID0gYWxpYXNcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lmlnbm9yZVVua25vd25WZXJzaW9ucykge1xuICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICAgICAgICdVbmtub3duIHZlcnNpb24gJyArIHZlcnNpb24gKyAnIG9mICcgKyBub2RlLmJyb3dzZXJcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBbZGF0YS5uYW1lICsgJyAnICsgdmVyc2lvbl1cbiAgICB9XG4gIH0sXG4gIGJyb3dzZXJzbGlzdF9jb25maWc6IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9eYnJvd3NlcnNsaXN0IGNvbmZpZyQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICByZXR1cm4gYnJvd3NlcnNsaXN0KHVuZGVmaW5lZCwgY29udGV4dClcbiAgICB9XG4gIH0sXG4gIGV4dGVuZHM6IHtcbiAgICBtYXRjaGVzOiBbJ2NvbmZpZyddLFxuICAgIHJlZ2V4cDogL15leHRlbmRzICguKykkL2ksXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZW52LmxvYWRRdWVyaWVzKGNvbnRleHQsIG5vZGUuY29uZmlnKSwgY29udGV4dClcbiAgICB9XG4gIH0sXG4gIGRlZmF1bHRzOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXmRlZmF1bHRzJC9pLFxuICAgIHNlbGVjdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGJyb3dzZXJzbGlzdC5kZWZhdWx0cywgY29udGV4dClcbiAgICB9XG4gIH0sXG4gIGRlYWQ6IHtcbiAgICBtYXRjaGVzOiBbXSxcbiAgICByZWdleHA6IC9eZGVhZCQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICB2YXIgZGVhZCA9IFtcbiAgICAgICAgJ0JhaWR1ID49IDAnLFxuICAgICAgICAnaWUgPD0gMTEnLFxuICAgICAgICAnaWVfbW9iIDw9IDExJyxcbiAgICAgICAgJ2JiIDw9IDEwJyxcbiAgICAgICAgJ29wX21vYiA8PSAxMi4xJyxcbiAgICAgICAgJ3NhbXN1bmcgNCdcbiAgICAgIF1cbiAgICAgIHJldHVybiByZXNvbHZlKGRlYWQsIGNvbnRleHQpXG4gICAgfVxuICB9LFxuICB1bmtub3duOiB7XG4gICAgbWF0Y2hlczogW10sXG4gICAgcmVnZXhwOiAvXihcXHcrKSQvaSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgICBpZiAoYnlOYW1lKG5vZGUucXVlcnksIGNvbnRleHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBCcm93c2Vyc2xpc3RFcnJvcihcbiAgICAgICAgICAnU3BlY2lmeSB2ZXJzaW9ucyBpbiBCcm93c2Vyc2xpc3QgcXVlcnkgZm9yIGJyb3dzZXIgJyArIG5vZGUucXVlcnlcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdW5rbm93blF1ZXJ5KG5vZGUucXVlcnkpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIEdldCBhbmQgY29udmVydCBDYW4gSSBVc2UgZGF0YVxuXG47KGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhZ2VudHMpIHtcbiAgICB2YXIgYnJvd3NlciA9IGFnZW50c1tuYW1lXVxuICAgIGJyb3dzZXJzbGlzdC5kYXRhW25hbWVdID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZlcnNpb25zOiBub3JtYWxpemUoYWdlbnRzW25hbWVdLnZlcnNpb25zKSxcbiAgICAgIHJlbGVhc2VkOiBub3JtYWxpemUoYWdlbnRzW25hbWVdLnZlcnNpb25zLnNsaWNlKDAsIC0zKSksXG4gICAgICByZWxlYXNlRGF0ZTogYWdlbnRzW25hbWVdLnJlbGVhc2VfZGF0ZVxuICAgIH1cbiAgICBmaWxsVXNhZ2UoYnJvd3NlcnNsaXN0LnVzYWdlLmdsb2JhbCwgbmFtZSwgYnJvd3Nlci51c2FnZV9nbG9iYWwpXG5cbiAgICBicm93c2Vyc2xpc3QudmVyc2lvbkFsaWFzZXNbbmFtZV0gPSB7fVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJvd3Nlci52ZXJzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGZ1bGwgPSBicm93c2VyLnZlcnNpb25zW2ldXG4gICAgICBpZiAoIWZ1bGwpIGNvbnRpbnVlXG5cbiAgICAgIGlmIChmdWxsLmluZGV4T2YoJy0nKSAhPT0gLTEpIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gZnVsbC5zcGxpdCgnLScpXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW50ZXJ2YWwubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBicm93c2Vyc2xpc3QudmVyc2lvbkFsaWFzZXNbbmFtZV1baW50ZXJ2YWxbal1dID0gZnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnJvd3NlcnNsaXN0Lm5vZGVWZXJzaW9ucyA9IGpzUmVsZWFzZXMubWFwKGZ1bmN0aW9uIChyZWxlYXNlKSB7XG4gICAgcmV0dXJuIHJlbGVhc2UudmVyc2lvblxuICB9KVxufSkoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJyb3dzZXJzbGlzdFxuIiwidmFyIEFORF9SRUdFWFAgPSAvXlxccythbmRcXHMrKC4qKS9pXG52YXIgT1JfUkVHRVhQID0gL14oPzosXFxzKnxcXHMrb3JcXHMrKSguKikvaVxuXG5mdW5jdGlvbiBmbGF0dGVuKGFycmF5KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHJldHVybiBbYXJyYXldXG4gIHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYS5jb25jYXQoZmxhdHRlbihiKSlcbiAgfSwgW10pXG59XG5cbmZ1bmN0aW9uIGZpbmQoc3RyaW5nLCBwcmVkaWNhdGUpIHtcbiAgZm9yICh2YXIgbWF4ID0gc3RyaW5nLmxlbmd0aCwgbiA9IDE7IG4gPD0gbWF4OyBuKyspIHtcbiAgICB2YXIgcGFyc2VkID0gc3RyaW5nLnN1YnN0cigtbiwgbilcbiAgICBpZiAocHJlZGljYXRlKHBhcnNlZCwgbiwgbWF4KSkge1xuICAgICAgcmV0dXJuIHN0cmluZy5zbGljZSgwLCAtbilcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnXG59XG5cbmZ1bmN0aW9uIG1hdGNoUXVlcnkoYWxsLCBxdWVyeSkge1xuICB2YXIgbm9kZSA9IHsgcXVlcnk6IHF1ZXJ5IH1cbiAgaWYgKHF1ZXJ5LmluZGV4T2YoJ25vdCAnKSA9PT0gMCkge1xuICAgIG5vZGUubm90ID0gdHJ1ZVxuICAgIHF1ZXJ5ID0gcXVlcnkuc2xpY2UoNClcbiAgfVxuXG4gIGZvciAodmFyIG5hbWUgaW4gYWxsKSB7XG4gICAgdmFyIHR5cGUgPSBhbGxbbmFtZV1cbiAgICB2YXIgbWF0Y2ggPSBxdWVyeS5tYXRjaCh0eXBlLnJlZ2V4cClcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIG5vZGUudHlwZSA9IG5hbWVcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZS5tYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5vZGVbdHlwZS5tYXRjaGVzW2ldXSA9IG1hdGNoW2kgKyAxXVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gIH1cblxuICBub2RlLnR5cGUgPSAndW5rbm93bidcbiAgcmV0dXJuIG5vZGVcbn1cblxuZnVuY3Rpb24gbWF0Y2hCbG9jayhhbGwsIHN0cmluZywgcXMpIHtcbiAgdmFyIG5vZGVcbiAgcmV0dXJuIGZpbmQoc3RyaW5nLCBmdW5jdGlvbiAocGFyc2VkLCBuLCBtYXgpIHtcbiAgICBpZiAoQU5EX1JFR0VYUC50ZXN0KHBhcnNlZCkpIHtcbiAgICAgIG5vZGUgPSBtYXRjaFF1ZXJ5KGFsbCwgcGFyc2VkLm1hdGNoKEFORF9SRUdFWFApWzFdKVxuICAgICAgbm9kZS5jb21wb3NlID0gJ2FuZCdcbiAgICAgIHFzLnVuc2hpZnQobm9kZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIGlmIChPUl9SRUdFWFAudGVzdChwYXJzZWQpKSB7XG4gICAgICBub2RlID0gbWF0Y2hRdWVyeShhbGwsIHBhcnNlZC5tYXRjaChPUl9SRUdFWFApWzFdKVxuICAgICAgbm9kZS5jb21wb3NlID0gJ29yJ1xuICAgICAgcXMudW5zaGlmdChub2RlKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2UgaWYgKG4gPT09IG1heCkge1xuICAgICAgbm9kZSA9IG1hdGNoUXVlcnkoYWxsLCBwYXJzZWQudHJpbSgpKVxuICAgICAgbm9kZS5jb21wb3NlID0gJ29yJ1xuICAgICAgcXMudW5zaGlmdChub2RlKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UoYWxsLCBxdWVyaWVzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShxdWVyaWVzKSkgcXVlcmllcyA9IFtxdWVyaWVzXVxuICByZXR1cm4gZmxhdHRlbihcbiAgICBxdWVyaWVzLm1hcChmdW5jdGlvbiAoYmxvY2spIHtcbiAgICAgIHZhciBxcyA9IFtdXG4gICAgICBkbyB7XG4gICAgICAgIGJsb2NrID0gbWF0Y2hCbG9jayhhbGwsIGJsb2NrLCBxcylcbiAgICAgIH0gd2hpbGUgKGJsb2NrKVxuICAgICAgcmV0dXJuIHFzXG4gICAgfSlcbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHM9e0E6e0E6e0s6MCxFOjAsRjowLjA1NjMwNDMsRzowLjA0MjIyODIsQTowLjAxNDA3NjEsQjowLjQ3ODU4NixmQzowfSxCOlwibXNcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcImZDXCIsXCJLXCIsXCJFXCIsXCJGXCIsXCJHXCIsXCJBXCIsXCJCXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJJRVwiLEY6e2ZDOjk2MjMyMzIwMCxLOjk5ODg3MDQwMCxFOjExNjExMjk2MDAsRjoxMjM3NDIwODAwLEc6MTMwMDA2MDgwMCxBOjEzNDY3MTY4MDAsQjoxMzgxOTY4MDAwfX0sQjp7QTp7XCI0XCI6MC4wMDcxNjYsXCI1XCI6MC4wMDcxNjYsXCI2XCI6MC4wMTA3NDksXCI3XCI6MC4wMDcxNjYsXCI4XCI6MC4wMTA3NDksXCI5XCI6MC4wMzk0MTMsQzowLEw6MCxNOjAuMDAzNTgzLEg6MCxOOjAsTzowLjAwNzE2NixQOjAuMDU3MzI4LFE6MCxJOjAsUjowLFM6MCxUOjAsVTowLFY6MCxXOjAsWDowLFk6MCxaOjAsYTowLGI6MC4wMTQzMzIsYzowLGQ6MCxlOjAsZjowLGc6MCxoOjAsaTowLGo6MCxrOjAsbDowLG06MCxuOjAsbzowLHA6MCxxOjAuMDAzNTgzLHI6MC4wMDcxNjYsczowLjA2NDQ5NCx0OjAuMDA3MTY2LHU6MC4wMDcxNjYsdjowLjAwNzE2Nix3OjAuMDEwNzQ5LHg6MC4wMTQzMzIsQUI6MC4wMTc5MTUsQkI6MC4wMjUwODEsQ0I6MC4wMTQzMzIsREI6MC4wMjUwODEsRUI6MC4wNTM3NDUsRkI6MC4yNTQzOTMsR0I6My4zODU5NCxIQjowLjkxNzI0OCxJQjowLEQ6MH0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiQ1wiLFwiTFwiLFwiTVwiLFwiSFwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiUVwiLFwiSVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiLFwiblwiLFwib1wiLFwicFwiLFwicVwiLFwiclwiLFwic1wiLFwidFwiLFwidVwiLFwidlwiLFwid1wiLFwieFwiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiQUJcIixcIkJCXCIsXCJDQlwiLFwiREJcIixcIkVCXCIsXCJGQlwiLFwiR0JcIixcIkhCXCIsXCJJQlwiLFwiRFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiRWRnZVwiLEY6e1wiNFwiOjE2ODk4OTc2MDAsXCI1XCI6MTY5MjU3NjAwMCxcIjZcIjoxNjk0NjQ5NjAwLFwiN1wiOjE2OTcxNTUyMDAsXCI4XCI6MTY5ODk2OTYwMCxcIjlcIjoxNzAxOTkzNjAwLEM6MTQzODEyODAwMCxMOjE0NDcyODY0MDAsTToxNDcwMDk2MDAwLEg6MTQ5MTg2ODgwMCxOOjE1MDgxOTg0MDAsTzoxNTI1MDQ2NDAwLFA6MTU0MjA2NzIwMCxROjE1NzkwNDY0MDAsSToxNTgxMDMzNjAwLFI6MTU4NjczNjAwMCxTOjE1OTAwMTkyMDAsVDoxNTk0ODU3NjAwLFU6MTU5ODQ4NjQwMCxWOjE2MDIyMDE2MDAsVzoxNjA1ODMwNDAwLFg6MTYxMTM2MDAwMCxZOjE2MTQ4MTYwMDAsWjoxNjE4MzU4NDAwLGE6MTYyMjA3MzYwMCxiOjE2MjY5MTIwMDAsYzoxNjMwNjI3MjAwLGQ6MTYzMjQ0MTYwMCxlOjE2MzQ3NzQ0MDAsZjoxNjM3NTM5MjAwLGc6MTY0MTQyNzIwMCxoOjE2NDM5MzI4MDAsaToxNjQ2MjY1NjAwLGo6MTY0OTYzNTIwMCxrOjE2NTExOTA0MDAsbDoxNjUzOTU1MjAwLG06MTY1NTk0MjQwMCxuOjE2NTk2NTc2MDAsbzoxNjYxOTkwNDAwLHA6MTY2NDc1NTIwMCxxOjE2NjY5MTUyMDAscjoxNjcwMTk4NDAwLHM6MTY3MzQ4MTYwMCx0OjE2NzU5MDA4MDAsdToxNjc4NjY1NjAwLHY6MTY4MDgyNTYwMCx3OjE2ODMxNTg0MDAseDoxNjg1NjY0MDAwLEFCOjE3MDYyMjcyMDAsQkI6MTcwODczMjgwMCxDQjoxNzExMTUyMDAwLERCOjE3MTMzOTg0MDAsRUI6MTcxNTk5MDQwMCxGQjoxNzE4ODQxNjAwLEdCOjE3MjE4NjU2MDAsSEI6MTcyNDM3MTIwMCxJQjoxNzI2NzA0MDAwLEQ6MTcyOTEyMzIwMH0sRDp7QzpcIm1zXCIsTDpcIm1zXCIsTTpcIm1zXCIsSDpcIm1zXCIsTjpcIm1zXCIsTzpcIm1zXCIsUDpcIm1zXCJ9fSxDOntBOntcIjBcIjowLFwiMVwiOjAsXCIyXCI6MCxcIjNcIjowLFwiNFwiOjAuMzUxMTM0LFwiNVwiOjAsXCI2XCI6MC4wMDcxNjYsXCI3XCI6MC4wODk1NzUsXCI4XCI6MCxcIjlcIjowLjAwNzE2NixnQzowLEdDOjAsSjowLjAwMzU4MyxKQjowLEs6MCxFOjAsRjowLEc6MCxBOjAsQjowLjAxNDMzMixDOjAsTDowLE06MCxIOjAsTjowLE86MCxQOjAsS0I6MCx5OjAsejowLExCOjAsTUI6MCxOQjowLE9COjAsUEI6MCxRQjowLFJCOjAsU0I6MCxUQjowLFVCOjAsVkI6MCxXQjowLFhCOjAsWUI6MCxaQjowLGFCOjAsYkI6MCxjQjowLjAwMzU4MyxkQjowLjAwNzE2NixlQjowLjAwMzU4MyxmQjowLGdCOjAsaEI6MCxpQjowLGpCOjAuMDAzNTgzLGtCOjAsbEI6MC4wNDI5OTYsbUI6MCxuQjowLjAwNzE2NixvQjowLjAwMzU4MyxwQjowLjAxNzkxNSxxQjowLHJCOjAsSEM6MC4wMDM1ODMsc0I6MCxJQzowLHRCOjAsdUI6MCx2QjowLHdCOjAseEI6MCx5QjowLHpCOjAsXCIwQlwiOjAsXCIxQlwiOjAsXCIyQlwiOjAsXCIzQlwiOjAsXCI0QlwiOjAsXCI1QlwiOjAsXCI2QlwiOjAsXCI3QlwiOjAsXCI4QlwiOjAsXCI5QlwiOjAuMDE0MzMyLFE6MCxJOjAsUjowLEpDOjAsUzowLFQ6MCxVOjAsVjowLFc6MCxYOjAuMDA3MTY2LFk6MCxaOjAsYTowLGI6MCxjOjAsZDowLjAwMzU4MyxlOjAsZjowLGc6MCxoOjAsaTowLGo6MCxrOjAsbDowLjAwNzE2NixtOjAuMDEwNzQ5LG46MCxvOjAuMDAzNTgzLHA6MCxxOjAscjowLHM6MC4wMDcxNjYsdDowLHU6MCx2OjAsdzowLjAwNzE2Nix4OjAsQUI6MC4wMDcxNjYsQkI6MC4wMDM1ODMsQ0I6MC4wMDcxNjYsREI6MC4wMDcxNjYsRUI6MC4wMTQzMzIsRkI6MC4wMzIyNDcsR0I6MC4wNDI5OTYsSEI6MC40NDc4NzUsSUI6MS4wODkyMyxEOjAuMDA3MTY2LEtDOjAsTEM6MCxNQzowLGhDOjAsaUM6MCxqQzowLGtDOjB9LEI6XCJtb3pcIixDOltcImdDXCIsXCJHQ1wiLFwiakNcIixcImtDXCIsXCJKXCIsXCJKQlwiLFwiS1wiLFwiRVwiLFwiRlwiLFwiR1wiLFwiQVwiLFwiQlwiLFwiQ1wiLFwiTFwiLFwiTVwiLFwiSFwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiS0JcIixcInlcIixcInpcIixcIjBcIixcIjFcIixcIjJcIixcIjNcIixcIkxCXCIsXCJNQlwiLFwiTkJcIixcIk9CXCIsXCJQQlwiLFwiUUJcIixcIlJCXCIsXCJTQlwiLFwiVEJcIixcIlVCXCIsXCJWQlwiLFwiV0JcIixcIlhCXCIsXCJZQlwiLFwiWkJcIixcImFCXCIsXCJiQlwiLFwiY0JcIixcImRCXCIsXCJlQlwiLFwiZkJcIixcImdCXCIsXCJoQlwiLFwiaUJcIixcImpCXCIsXCJrQlwiLFwibEJcIixcIm1CXCIsXCJuQlwiLFwib0JcIixcInBCXCIsXCJxQlwiLFwickJcIixcIkhDXCIsXCJzQlwiLFwiSUNcIixcInRCXCIsXCJ1QlwiLFwidkJcIixcIndCXCIsXCJ4QlwiLFwieUJcIixcInpCXCIsXCIwQlwiLFwiMUJcIixcIjJCXCIsXCIzQlwiLFwiNEJcIixcIjVCXCIsXCI2QlwiLFwiN0JcIixcIjhCXCIsXCI5QlwiLFwiUVwiLFwiSVwiLFwiUlwiLFwiSkNcIixcIlNcIixcIlRcIixcIlVcIixcIlZcIixcIldcIixcIlhcIixcIllcIixcIlpcIixcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIixcIm5cIixcIm9cIixcInBcIixcInFcIixcInJcIixcInNcIixcInRcIixcInVcIixcInZcIixcIndcIixcInhcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIkFCXCIsXCJCQlwiLFwiQ0JcIixcIkRCXCIsXCJFQlwiLFwiRkJcIixcIkdCXCIsXCJIQlwiLFwiSUJcIixcIkRcIixcIktDXCIsXCJMQ1wiLFwiTUNcIixcImhDXCIsXCJpQ1wiXSxFOlwiRmlyZWZveFwiLEY6e1wiMFwiOjEzNjg0ODk2MDAsXCIxXCI6MTM3MjExODQwMCxcIjJcIjoxMzc1NzQ3MjAwLFwiM1wiOjEzNzkzNzYwMDAsXCI0XCI6MTY4ODQyODgwMCxcIjVcIjoxNjkwODQ4MDAwLFwiNlwiOjE2OTMyNjcyMDAsXCI3XCI6MTY5NTY4NjQwMCxcIjhcIjoxNjk4MTA1NjAwLFwiOVwiOjE3MDA1MjQ4MDAsZ0M6MTE2MTY0ODAwMCxHQzoxMjEzNjYwODAwLGpDOjEyNDYzMjAwMDAsa0M6MTI2NDAzMjAwMCxKOjEzMDA3NTIwMDAsSkI6MTMwODYxNDQwMCxLOjEzMTM0NTI4MDAsRToxMzE3MDgxNjAwLEY6MTMxNzA4MTYwMCxHOjEzMjA3MTA0MDAsQToxMzI0MzM5MjAwLEI6MTMyNzk2ODAwMCxDOjEzMzE1OTY4MDAsTDoxMzM1MjI1NjAwLE06MTMzODg1NDQwMCxIOjEzNDI0ODMyMDAsTjoxMzQ2MTEyMDAwLE86MTM0OTc0MDgwMCxQOjEzNTM2Mjg4MDAsS0I6MTM1NzYwMzIwMCx5OjEzNjEyMzIwMDAsejoxMzY0ODYwODAwLExCOjEzODY2MzM2MDAsTUI6MTM5MTQ3MjAwMCxOQjoxMzk1MTAwODAwLE9COjEzOTg3Mjk2MDAsUEI6MTQwMjM1ODQwMCxRQjoxNDA1OTg3MjAwLFJCOjE0MDk2MTYwMDAsU0I6MTQxMzI0NDgwMCxUQjoxNDE3MzkyMDAwLFVCOjE0MjExMDcyMDAsVkI6MTQyNDczNjAwMCxXQjoxNDI4Mjc4NDAwLFhCOjE0MzE0NzUyMDAsWUI6MTQzNTg4MTYwMCxaQjoxNDM5MjUxMjAwLGFCOjE0NDI4ODAwMDAsYkI6MTQ0NjUwODgwMCxjQjoxNDUwMTM3NjAwLGRCOjE0NTM4NTI4MDAsZUI6MTQ1NzM5NTIwMCxmQjoxNDYxNjI4ODAwLGdCOjE0NjUyNTc2MDAsaEI6MTQ3MDA5NjAwMCxpQjoxNDc0MzI5NjAwLGpCOjE0NzkxNjgwMDAsa0I6MTQ4NTIxNjAwMCxsQjoxNDg4ODQ0ODAwLG1COjE0OTI1NjAwMDAsbkI6MTQ5NzMxMjAwMCxvQjoxNTAyMTUwNDAwLHBCOjE1MDY1NTY4MDAscUI6MTUxMDYxNzYwMCxyQjoxNTE2NjY1NjAwLEhDOjE1MjA5ODU2MDAsc0I6MTUyNTgyNDAwMCxJQzoxNTI5OTcxMjAwLHRCOjE1MzYxMDU2MDAsdUI6MTU0MDI1MjgwMCx2QjoxNTQ0NDg2NDAwLHdCOjE1NDg3MjAwMDAseEI6MTU1Mjk1MzYwMCx5QjoxNTU4Mzk2ODAwLHpCOjE1NjI2MzA0MDAsXCIwQlwiOjE1Njc0Njg4MDAsXCIxQlwiOjE1NzE3ODg4MDAsXCIyQlwiOjE1NzUzMzEyMDAsXCIzQlwiOjE1NzgzNTUyMDAsXCI0QlwiOjE1ODEzNzkyMDAsXCI1QlwiOjE1ODM3OTg0MDAsXCI2QlwiOjE1ODYzMDQwMDAsXCI3QlwiOjE1ODg2MzY4MDAsXCI4QlwiOjE1OTEwNTYwMDAsXCI5QlwiOjE1OTM0NzUyMDAsUToxNTk1ODk0NDAwLEk6MTU5ODMxMzYwMCxSOjE2MDA3MzI4MDAsSkM6MTYwMzE1MjAwMCxTOjE2MDU1NzEyMDAsVDoxNjA3OTkwNDAwLFU6MTYxMTYxOTIwMCxWOjE2MTQwMzg0MDAsVzoxNjE2NDU3NjAwLFg6MTYxODc5MDQwMCxZOjE2MjI1MDU2MDAsWjoxNjI2MTM0NDAwLGE6MTYyODU1MzYwMCxiOjE2MzA5NzI4MDAsYzoxNjMzMzkyMDAwLGQ6MTYzNTgxMTIwMCxlOjE2Mzg4MzUyMDAsZjoxNjQxODU5MjAwLGc6MTY0NDM2NDgwMCxoOjE2NDY2OTc2MDAsaToxNjQ5MTE2ODAwLGo6MTY1MTUzNjAwMCxrOjE2NTM5NTUyMDAsbDoxNjU2Mzc0NDAwLG06MTY1ODc5MzYwMCxuOjE2NjEyMTI4MDAsbzoxNjYzNjMyMDAwLHA6MTY2NjA1MTIwMCxxOjE2Njg0NzA0MDAscjoxNjcwODg5NjAwLHM6MTY3MzkxMzYwMCx0OjE2NzYzMzI4MDAsdToxNjc4NzUyMDAwLHY6MTY4MTE3MTIwMCx3OjE2ODM1OTA0MDAseDoxNjg2MDA5NjAwLEFCOjE3MDI5NDQwMDAsQkI6MTcwNTk2ODAwMCxDQjoxNzA4Mzg3MjAwLERCOjE3MTA4MDY0MDAsRUI6MTcxMzIyNTYwMCxGQjoxNzE1NjQ0ODAwLEdCOjE3MTgwNjQwMDAsSEI6MTcyMDQ4MzIwMCxJQjoxNzIyOTAyNDAwLEQ6MTcyNTMyMTYwMCxLQzoxNzI3NzQwODAwLExDOjE3MzAxNjAwMDAsTUM6bnVsbCxoQzpudWxsLGlDOm51bGx9fSxEOntBOntcIjBcIjowLFwiMVwiOjAsXCIyXCI6MCxcIjNcIjowLFwiNFwiOjAuMDM1ODMsXCI1XCI6MC4xNjg0MDEsXCI2XCI6MC4xMDc0OSxcIjdcIjowLjA3MTY2LFwiOFwiOjAuMDY4MDc3LFwiOVwiOjAuMTA3NDksSjowLEpCOjAsSzowLEU6MCxGOjAsRzowLEE6MCxCOjAsQzowLEw6MCxNOjAsSDowLE46MCxPOjAsUDowLEtCOjAseTowLHo6MCxMQjowLE1COjAsTkI6MCxPQjowLFBCOjAsUUI6MCxSQjowLFNCOjAsVEI6MCxVQjowLFZCOjAsV0I6MCxYQjowLjAxMDc0OSxZQjowLFpCOjAsYUI6MCxiQjowLGNCOjAsZEI6MCxlQjowLjAwMzU4MyxmQjowLGdCOjAuMDA3MTY2LGhCOjAuMDI1MDgxLGlCOjAuMDIxNDk4LGpCOjAuMDA3MTY2LGtCOjAuMDAzNTgzLGxCOjAuMDAzNTgzLG1COjAuMDA3MTY2LG5COjAsb0I6MCxwQjowLjAzMjI0NyxxQjowLjAwMzU4MyxyQjowLjAwNzE2NixIQzowLHNCOjAsSUM6MC4wMDM1ODMsdEI6MCx1QjowLHZCOjAsd0I6MCx4QjowLjAyNTA4MSx5QjowLjAwNzE2Nix6QjowLFwiMEJcIjowLjAyODY2NCxcIjFCXCI6MC4wMjg2NjQsXCIyQlwiOjAsXCIzQlwiOjAsXCI0QlwiOjAuMDA3MTY2LFwiNUJcIjowLjAxMDc0OSxcIjZCXCI6MC4wMTA3NDksXCI3QlwiOjAuMDA3MTY2LFwiOEJcIjowLjAyMTQ5OCxcIjlCXCI6MC4wMTc5MTUsUTowLjEwMzkwNyxJOjAuMDE0MzMyLFI6MC4wMjE0OTgsUzowLjAzMjI0NyxUOjAuMDEwNzQ5LFU6MC4wMTQzMzIsVjowLjAyNTA4MSxXOjAuMDc1MjQzLFg6MC4wMTc5MTUsWTowLjAxMDc0OSxaOjAuMDE0MzMyLGE6MC4wNTM3NDUsYjowLjAxNDMzMixjOjAuMDE0MzMyLGQ6MC4wNTAxNjIsZTowLjAxMDc0OSxmOjAuMDEwNzQ5LGc6MC4wMTc5MTUsaDowLjA0NjU3OSxpOjAuMDI1MDgxLGo6MC4wMjE0OTgsazowLjAyMTQ5OCxsOjAuMDE3OTE1LG06MC4xMTEwNzMsbjowLjA4NTk5MixvOjAuMDE3OTE1LHA6MC4wMjg2NjQscTowLjAzNTgzLHI6MC4wNDY1NzksczoxLjQyNjAzLHQ6MC4wMjUwODEsdTowLjAzOTQxMyx2OjAuMDUwMTYyLHc6MC4xMDc0OSx4OjAuMTAzOTA3LEFCOjAuMTA3NDksQkI6MC4xMTgyMzksQ0I6MC4xNDMzMixEQjowLjIyOTMxMixFQjowLjM2OTA0OSxGQjoxLjQ5MDUzLEdCOjEyLjc3NyxIQjoyLjMwNzQ1LElCOjAuMDE0MzMyLEQ6MC4wMDM1ODMsS0M6MCxMQzowLE1DOjB9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiSlwiLFwiSkJcIixcIktcIixcIkVcIixcIkZcIixcIkdcIixcIkFcIixcIkJcIixcIkNcIixcIkxcIixcIk1cIixcIkhcIixcIk5cIixcIk9cIixcIlBcIixcIktCXCIsXCJ5XCIsXCJ6XCIsXCIwXCIsXCIxXCIsXCIyXCIsXCIzXCIsXCJMQlwiLFwiTUJcIixcIk5CXCIsXCJPQlwiLFwiUEJcIixcIlFCXCIsXCJSQlwiLFwiU0JcIixcIlRCXCIsXCJVQlwiLFwiVkJcIixcIldCXCIsXCJYQlwiLFwiWUJcIixcIlpCXCIsXCJhQlwiLFwiYkJcIixcImNCXCIsXCJkQlwiLFwiZUJcIixcImZCXCIsXCJnQlwiLFwiaEJcIixcImlCXCIsXCJqQlwiLFwia0JcIixcImxCXCIsXCJtQlwiLFwibkJcIixcIm9CXCIsXCJwQlwiLFwicUJcIixcInJCXCIsXCJIQ1wiLFwic0JcIixcIklDXCIsXCJ0QlwiLFwidUJcIixcInZCXCIsXCJ3QlwiLFwieEJcIixcInlCXCIsXCJ6QlwiLFwiMEJcIixcIjFCXCIsXCIyQlwiLFwiM0JcIixcIjRCXCIsXCI1QlwiLFwiNkJcIixcIjdCXCIsXCI4QlwiLFwiOUJcIixcIlFcIixcIklcIixcIlJcIixcIlNcIixcIlRcIixcIlVcIixcIlZcIixcIldcIixcIlhcIixcIllcIixcIlpcIixcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIixcIm5cIixcIm9cIixcInBcIixcInFcIixcInJcIixcInNcIixcInRcIixcInVcIixcInZcIixcIndcIixcInhcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIkFCXCIsXCJCQlwiLFwiQ0JcIixcIkRCXCIsXCJFQlwiLFwiRkJcIixcIkdCXCIsXCJIQlwiLFwiSUJcIixcIkRcIixcIktDXCIsXCJMQ1wiLFwiTUNcIl0sRTpcIkNocm9tZVwiLEY6e1wiMFwiOjEzNDM2OTI4MDAsXCIxXCI6MTM0ODUzMTIwMCxcIjJcIjoxMzUyMjQ2NDAwLFwiM1wiOjEzNTc4NjI0MDAsXCI0XCI6MTY4OTcyNDgwMCxcIjVcIjoxNjkyMDU3NjAwLFwiNlwiOjE2OTQ0NzY4MDAsXCI3XCI6MTY5Njg5NjAwMCxcIjhcIjoxNjk4NzEwNDAwLFwiOVwiOjE3MDE5OTM2MDAsSjoxMjY0Mzc3NjAwLEpCOjEyNzQ3NDU2MDAsSzoxMjgzMzg1NjAwLEU6MTI4NzYxOTIwMCxGOjEyOTEyNDgwMDAsRzoxMjk2Nzc3NjAwLEE6MTI5OTU0MjQwMCxCOjEzMDM4NjI0MDAsQzoxMzA3NDA0ODAwLEw6MTMxMjI0MzIwMCxNOjEzMTYxMzEyMDAsSDoxMzE2MTMxMjAwLE46MTMxOTUwMDgwMCxPOjEzMjM3MzQ0MDAsUDoxMzI4NjU5MjAwLEtCOjEzMzI4OTI4MDAseToxMzM3MDQwMDAwLHo6MTM0MDY2ODgwMCxMQjoxMzYxNDA0ODAwLE1COjEzNjQ0Mjg4MDAsTkI6MTM2OTA5NDQwMCxPQjoxMzc0MTA1NjAwLFBCOjEzNzY5NTY4MDAsUUI6MTM4NDIxNDQwMCxSQjoxMzg5NjU3NjAwLFNCOjEzOTI5NDA4MDAsVEI6MTM5NzAwMTYwMCxVQjoxNDAwNTQ0MDAwLFZCOjE0MDU0Njg4MDAsV0I6MTQwOTAxMTIwMCxYQjoxNDEyNjQwMDAwLFlCOjE0MTYyNjg4MDAsWkI6MTQyMTc5ODQwMCxhQjoxNDI1NTEzNjAwLGJCOjE0Mjk0MDE2MDAsY0I6MTQzMjA4MDAwMCxkQjoxNDM3NTIzMjAwLGVCOjE0NDExNTIwMDAsZkI6MTQ0NDc4MDgwMCxnQjoxNDQ5MDE0NDAwLGhCOjE0NTMyNDgwMDAsaUI6MTQ1Njk2MzIwMCxqQjoxNDYwNTkyMDAwLGtCOjE0NjQxMzQ0MDAsbEI6MTQ2OTA1OTIwMCxtQjoxNDcyNjAxNjAwLG5COjE0NzYyMzA0MDAsb0I6MTQ4MDU1MDQwMCxwQjoxNDg1MzAyNDAwLHFCOjE0ODkwMTc2MDAsckI6MTQ5MjU2MDAwMCxIQzoxNDk2NzA3MjAwLHNCOjE1MDA5NDA4MDAsSUM6MTUwNDU2OTYwMCx0QjoxNTA4MTk4NDAwLHVCOjE1MTI1MTg0MDAsdkI6MTUxNjc1MjAwMCx3QjoxNTIwMjk0NDAwLHhCOjE1MjM5MjMyMDAseUI6MTUyNzU1MjAwMCx6QjoxNTMyMzkwNDAwLFwiMEJcIjoxNTM2MDE5MjAwLFwiMUJcIjoxNTM5NjQ4MDAwLFwiMkJcIjoxNTQzOTY4MDAwLFwiM0JcIjoxNTQ4NzIwMDAwLFwiNEJcIjoxNTUyMzQ4ODAwLFwiNUJcIjoxNTU1OTc3NjAwLFwiNkJcIjoxNTU5NjA2NDAwLFwiN0JcIjoxNTY0NDQ0ODAwLFwiOEJcIjoxNTY4MDczNjAwLFwiOUJcIjoxNTcxNzAyNDAwLFE6MTU3NTkzNjAwMCxJOjE1ODA4NjA4MDAsUjoxNTg2MzA0MDAwLFM6MTU4OTg0NjQwMCxUOjE1OTQ2ODQ4MDAsVToxNTk4MzEzNjAwLFY6MTYwMTk0MjQwMCxXOjE2MDU1NzEyMDAsWDoxNjExMDE0NDAwLFk6MTYxNDU1NjgwMCxaOjE2MTgyNzIwMDAsYToxNjIxOTg3MjAwLGI6MTYyNjczOTIwMCxjOjE2MzAzNjgwMDAsZDoxNjMyMjY4ODAwLGU6MTYzNDYwMTYwMCxmOjE2MzcwMjA4MDAsZzoxNjQxMzQwODAwLGg6MTY0MzY3MzYwMCxpOjE2NDYwOTI4MDAsajoxNjQ4NTEyMDAwLGs6MTY1MDkzMTIwMCxsOjE2NTMzNTA0MDAsbToxNjU1NzY5NjAwLG46MTY1OTM5ODQwMCxvOjE2NjE4MTc2MDAscDoxNjY0MjM2ODAwLHE6MTY2NjY1NjAwMCxyOjE2Njk2ODAwMDAsczoxNjczMzA4ODAwLHQ6MTY3NTcyODAwMCx1OjE2NzgxNDcyMDAsdjoxNjgwNTY2NDAwLHc6MTY4Mjk4NTYwMCx4OjE2ODU0MDQ4MDAsQUI6MTcwNTk2ODAwMCxCQjoxNzA4Mzg3MjAwLENCOjE3MTA4MDY0MDAsREI6MTcxMzIyNTYwMCxFQjoxNzE1NjQ0ODAwLEZCOjE3MTgwNjQwMDAsR0I6MTcyMTE3NDQwMCxIQjoxNzI0MTEyMDAwLElCOjE3MjY1MzEyMDAsRDoxNzI4OTUwNDAwLEtDOm51bGwsTEM6bnVsbCxNQzpudWxsfX0sRTp7QTp7SjowLEpCOjAsSzowLEU6MCxGOjAsRzowLjAwMzU4MyxBOjAsQjowLEM6MCxMOjAuMDA3MTY2LE06MC4wMjg2NjQsSDowLjAwNzE2NixsQzowLE5DOjAsbUM6MCxuQzowLG9DOjAscEM6MCxPQzowLEFDOjAuMDA3MTY2LEJDOjAuMDEwNzQ5LHFDOjAuMDU3MzI4LHJDOjAuMDc4ODI2LHNDOjAuMDI1MDgxLFBDOjAuMDEwNzQ5LFFDOjAuMDIxNDk4LENDOjAuMDI4NjY0LHRDOjAuMjE4NTYzLERDOjAuMDI4NjY0LFJDOjAuMDM1ODMsU0M6MC4wMzIyNDcsVEM6MC4xODI3MzMsVUM6MC4wMjE0OTgsVkM6MC4wNDI5OTYsdUM6MC4yOTAyMjMsRUM6MC4wMTc5MTUsV0M6MC4wMzk0MTMsWEM6MC4wMzk0MTMsWUM6MC4wNDI5OTYsWkM6MC4xMTgyMzksYUM6MS40NDc1MyxiQzowLjQxNTYyOCxGQzowLjAxNzkxNSxjQzowLHZDOjB9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcImxDXCIsXCJOQ1wiLFwiSlwiLFwiSkJcIixcIm1DXCIsXCJLXCIsXCJuQ1wiLFwiRVwiLFwib0NcIixcIkZcIixcIkdcIixcInBDXCIsXCJBXCIsXCJPQ1wiLFwiQlwiLFwiQUNcIixcIkNcIixcIkJDXCIsXCJMXCIsXCJxQ1wiLFwiTVwiLFwickNcIixcIkhcIixcInNDXCIsXCJQQ1wiLFwiUUNcIixcIkNDXCIsXCJ0Q1wiLFwiRENcIixcIlJDXCIsXCJTQ1wiLFwiVENcIixcIlVDXCIsXCJWQ1wiLFwidUNcIixcIkVDXCIsXCJXQ1wiLFwiWENcIixcIllDXCIsXCJaQ1wiLFwiYUNcIixcImJDXCIsXCJGQ1wiLFwiY0NcIixcInZDXCIsXCJcIl0sRTpcIlNhZmFyaVwiLEY6e2xDOjEyMDU3OTg0MDAsTkM6MTIyNjUzNDQwMCxKOjEyNDQ0MTkyMDAsSkI6MTI3NTg2ODgwMCxtQzoxMzExMTIwMDAwLEs6MTM0MzE3NDQwMCxuQzoxMzgyNDAwMDAwLEU6MTM4MjQwMDAwMCxvQzoxNDEwOTk4NDAwLEY6MTQxMzQxNzYwMCxHOjE0NDM2NTc2MDAscEM6MTQ1ODUxODQwMCxBOjE0NzQzMjk2MDAsT0M6MTQ5MDU3MjgwMCxCOjE1MDU3NzkyMDAsQUM6MTUyMjI4MTYwMCxDOjE1MzcxNDI0MDAsQkM6MTU1MzQ3MjAwMCxMOjE1Njg4NTEyMDAscUM6MTU4NTAwODAwMCxNOjE2MDAyMTQ0MDAsckM6MTYxOTM5NTIwMCxIOjE2MzIwOTYwMDAsc0M6MTYzNTI5MjgwMCxQQzoxNjM5MzUzNjAwLFFDOjE2NDcyMTYwMDAsQ0M6MTY1Mjc0NTYwMCx0QzoxNjU4Mjc1MjAwLERDOjE2NjI5NDA4MDAsUkM6MTY2NjU2OTYwMCxTQzoxNjcwODg5NjAwLFRDOjE2NzQ0MzIwMDAsVUM6MTY3OTg3NTIwMCxWQzoxNjg0MzY4MDAwLHVDOjE2OTAxNTY4MDAsRUM6MTY5NTY4NjQwMCxXQzoxNjk4MTkyMDAwLFhDOjE3MDIyNTI4MDAsWUM6MTcwNTg4MTYwMCxaQzoxNzA5NTk2ODAwLGFDOjE3MTU1NTg0MDAsYkM6MTcyMjIxMTIwMCxGQzoxNzI2NDQ0ODAwLGNDOm51bGwsdkM6bnVsbH19LEY6e0E6e1wiMFwiOjAsXCIxXCI6MCxcIjJcIjowLFwiM1wiOjAsRzowLEI6MCxDOjAsSDowLE46MCxPOjAsUDowLEtCOjAseTowLHo6MCxMQjowLE1COjAsTkI6MCxPQjowLFBCOjAsUUI6MCxSQjowLFNCOjAsVEI6MCxVQjowLFZCOjAsV0I6MCxYQjowLFlCOjAsWkI6MC4wMDM1ODMsYUI6MCxiQjowLGNCOjAsZEI6MCxlQjowLGZCOjAuMDE3OTE1LGdCOjAsaEI6MCxpQjowLGpCOjAsa0I6MCxsQjowLG1COjAsbkI6MCxvQjowLHBCOjAscUI6MCxyQjowLHNCOjAsdEI6MCx1QjowLHZCOjAsd0I6MCx4QjowLHlCOjAsekI6MCxcIjBCXCI6MCxcIjFCXCI6MCxcIjJCXCI6MCxcIjNCXCI6MCxcIjRCXCI6MCxcIjVCXCI6MCxcIjZCXCI6MCxcIjdCXCI6MCxcIjhCXCI6MCxcIjlCXCI6MCxROjAsSTowLFI6MCxKQzowLFM6MC4wMjg2NjQsVDowLjAwMzU4MyxVOjAsVjowLFc6MCxYOjAsWTowLFo6MCxhOjAsYjowLGM6MCxkOjAsZTowLjAzOTQxMyxmOjAsZzowLGg6MCxpOjAsajowLGs6MCxsOjAuMDMyMjQ3LG06MCxuOjAsbzowLHA6MCxxOjAscjowLHM6MC4xNTQwNjksdDowLHU6MC4wNjA5MTEsdjowLHc6MCx4OjAsd0M6MCx4QzowLHlDOjAsekM6MCxBQzowLGRDOjAsXCIwQ1wiOjAsQkM6MH0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiR1wiLFwid0NcIixcInhDXCIsXCJ5Q1wiLFwiekNcIixcIkJcIixcIkFDXCIsXCJkQ1wiLFwiMENcIixcIkNcIixcIkJDXCIsXCJIXCIsXCJOXCIsXCJPXCIsXCJQXCIsXCJLQlwiLFwieVwiLFwielwiLFwiMFwiLFwiMVwiLFwiMlwiLFwiM1wiLFwiTEJcIixcIk1CXCIsXCJOQlwiLFwiT0JcIixcIlBCXCIsXCJRQlwiLFwiUkJcIixcIlNCXCIsXCJUQlwiLFwiVUJcIixcIlZCXCIsXCJXQlwiLFwiWEJcIixcIllCXCIsXCJaQlwiLFwiYUJcIixcImJCXCIsXCJjQlwiLFwiZEJcIixcImVCXCIsXCJmQlwiLFwiZ0JcIixcImhCXCIsXCJpQlwiLFwiakJcIixcImtCXCIsXCJsQlwiLFwibUJcIixcIm5CXCIsXCJvQlwiLFwicEJcIixcInFCXCIsXCJyQlwiLFwic0JcIixcInRCXCIsXCJ1QlwiLFwidkJcIixcIndCXCIsXCJ4QlwiLFwieUJcIixcInpCXCIsXCIwQlwiLFwiMUJcIixcIjJCXCIsXCIzQlwiLFwiNEJcIixcIjVCXCIsXCI2QlwiLFwiN0JcIixcIjhCXCIsXCI5QlwiLFwiUVwiLFwiSVwiLFwiUlwiLFwiSkNcIixcIlNcIixcIlRcIixcIlVcIixcIlZcIixcIldcIixcIlhcIixcIllcIixcIlpcIixcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIixcIm5cIixcIm9cIixcInBcIixcInFcIixcInJcIixcInNcIixcInRcIixcInVcIixcInZcIixcIndcIixcInhcIixcIlwiLFwiXCIsXCJcIl0sRTpcIk9wZXJhXCIsRjp7XCIwXCI6MTQwMTc1MzYwMCxcIjFcIjoxNDA1OTg3MjAwLFwiMlwiOjE0MDk2MTYwMDAsXCIzXCI6MTQxMzMzMTIwMCxHOjExNTA3NjE2MDAsd0M6MTIyMzQyNDAwMCx4QzoxMjUxNzYzMjAwLHlDOjEyNjc0ODgwMDAsekM6MTI3Nzk0MjQwMCxCOjEyOTI0NTc2MDAsQUM6MTMwMjU2NjQwMCxkQzoxMzA5MjE5MjAwLFwiMENcIjoxMzIzMTI5NjAwLEM6MTMyMzEyOTYwMCxCQzoxMzUyMDczNjAwLEg6MTM3MjcyMzIwMCxOOjEzNzc1NjE2MDAsTzoxMzgxMTA0MDAwLFA6MTM4NjI4ODAwMCxLQjoxMzkwODY3MjAwLHk6MTM5Mzg5MTIwMCx6OjEzOTkzMzQ0MDAsTEI6MTQxNzEzMjgwMCxNQjoxNDIyMzE2ODAwLE5COjE0MjU5NDU2MDAsT0I6MTQzMDE3OTIwMCxQQjoxNDMzODA4MDAwLFFCOjE0Mzg2NDY0MDAsUkI6MTQ0MjQ0ODAwMCxTQjoxNDQ1OTA0MDAwLFRCOjE0NDkxMDA4MDAsVUI6MTQ1NDM3MTIwMCxWQjoxNDU3MzA4ODAwLFdCOjE0NjIzMjAwMDAsWEI6MTQ2NTM0NDAwMCxZQjoxNDcwMDk2MDAwLFpCOjE0NzQzMjk2MDAsYUI6MTQ3NzI2NzIwMCxiQjoxNDgxNTg3MjAwLGNCOjE0ODY0MjU2MDAsZEI6MTQ5MDA1NDQwMCxlQjoxNDk0Mzc0NDAwLGZCOjE0OTgwMDMyMDAsZ0I6MTUwMjIzNjgwMCxoQjoxNTA2NDcwNDAwLGlCOjE1MTAwOTkyMDAsakI6MTUxNTAyNDAwMCxrQjoxNTE3OTYxNjAwLGxCOjE1MjE2NzY4MDAsbUI6MTUyNTkxMDQwMCxuQjoxNTMwMTQ0MDAwLG9COjE1MzQ5ODI0MDAscEI6MTUzNzgzMzYwMCxxQjoxNTQzMzYzMjAwLHJCOjE1NDgyMDE2MDAsc0I6MTU1NDc2ODAwMCx0QjoxNTYxNTkzNjAwLHVCOjE1NjYyNTkyMDAsdkI6MTU3MDQwNjQwMCx3QjoxNTczNjg5NjAwLHhCOjE1Nzg0NDE2MDAseUI6MTU4Mzk3MTIwMCx6QjoxNTg3NTEzNjAwLFwiMEJcIjoxNTkyOTU2ODAwLFwiMUJcIjoxNTk1ODk0NDAwLFwiMkJcIjoxNjAwMTI4MDAwLFwiM0JcIjoxNjAzMjM4NDAwLFwiNEJcIjoxNjEzNTIwMDAwLFwiNUJcIjoxNjEyMjI0MDAwLFwiNkJcIjoxNjE2NTQ0MDAwLFwiN0JcIjoxNjE5NTY4MDAwLFwiOEJcIjoxNjIzNzE1MjAwLFwiOUJcIjoxNjI3OTQ4ODAwLFE6MTYzMTU3NzYwMCxJOjE2MzMzOTIwMDAsUjoxNjM1OTg0MDAwLEpDOjE2Mzg0MDMyMDAsUzoxNjQyNTUwNDAwLFQ6MTY0NDk2OTYwMCxVOjE2NDc5OTM2MDAsVjoxNjUwNDEyODAwLFc6MTY1Mjc0NTYwMCxYOjE2NTQ2NDY0MDAsWToxNjU3MTUyMDAwLFo6MTY2MDc4MDgwMCxhOjE2NjMxMTM2MDAsYjoxNjY4ODE2MDAwLGM6MTY2ODY0MzIwMCxkOjE2NzEwNjI0MDAsZToxNjc1MjA5NjAwLGY6MTY3NzAyNDAwMCxnOjE2Nzk1Mjk2MDAsaDoxNjgxOTQ4ODAwLGk6MTY4NDE5NTIwMCxqOjE2ODcyMTkyMDAsazoxNjkwMzI5NjAwLGw6MTY5Mjc0ODgwMCxtOjE2OTYyMDQ4MDAsbjoxNjk5OTIwMDAwLG86MTY5OTkyMDAwMCxwOjE3MDI5NDQwMDAscToxNzA3MjY0MDAwLHI6MTcxMDExNTIwMCxzOjE3MTE0OTc2MDAsdDoxNzE2MzM2MDAwLHU6MTcxOTI3MzYwMCx2OjE3MjEwODgwMDAsdzoxNzI0Mjg0ODAwLHg6MTcyNzIyMjQwMH0sRDp7RzpcIm9cIixCOlwib1wiLEM6XCJvXCIsd0M6XCJvXCIseEM6XCJvXCIseUM6XCJvXCIsekM6XCJvXCIsQUM6XCJvXCIsZEM6XCJvXCIsXCIwQ1wiOlwib1wiLEJDOlwib1wifX0sRzp7QTp7RjowLE5DOjAsXCIxQ1wiOjAsZUM6MC4wMDQ0NzcwOCxcIjJDXCI6MC4wMDE0OTIzNixcIjNDXCI6MC4wMDc0NjE4MSxcIjRDXCI6MC4wMDg5NTQxNyxcIjVDXCI6MCxcIjZDXCI6MC4wMDc0NjE4MSxcIjdDXCI6MC4wMjk4NDcyLFwiOENcIjowLjAwODk1NDE3LFwiOUNcIjowLjA0NjI2MzIsQUQ6MC4xMTc4OTcsQkQ6MC4wMTQ5MjM2LENEOjAuMDExOTM4OSxERDowLjE5OTk3NixFRDowLjAwMjk4NDcyLEZEOjAuMDY1NjYzOSxHRDowLjAwODk1NDE3LEhEOjAuMDM3MzA5LElEOjAuMTUyMjIxLEpEOjAuMTA1OTU4LEtEOjAuMDU2NzA5NyxQQzowLjA1NjcwOTcsUUM6MC4wNjcxNTYzLENDOjAuMDc5MDk1MixMRDowLjc0MTcwNCxEQzowLjE1MDcyOSxSQzowLjMxNzg3MyxTQzowLjE1ODE5LFRDOjAuMjY0MTQ4LFVDOjAuMDY1NjYzOSxWQzowLjEwNzQ1LE1EOjAuOTIwNzg3LEVDOjAuMDg1MDY0NixXQzowLjEzMTMyOCxYQzowLjEyMDg4MSxZQzowLjE3OTA4MyxaQzowLjQxOTM1NCxhQzo4LjU1ODY5LGJDOjEuNDQxNjIsRkM6MC4xNTY2OTgsY0M6MH0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJOQ1wiLFwiMUNcIixcImVDXCIsXCIyQ1wiLFwiM0NcIixcIjRDXCIsXCJGXCIsXCI1Q1wiLFwiNkNcIixcIjdDXCIsXCI4Q1wiLFwiOUNcIixcIkFEXCIsXCJCRFwiLFwiQ0RcIixcIkREXCIsXCJFRFwiLFwiRkRcIixcIkdEXCIsXCJIRFwiLFwiSURcIixcIkpEXCIsXCJLRFwiLFwiUENcIixcIlFDXCIsXCJDQ1wiLFwiTERcIixcIkRDXCIsXCJSQ1wiLFwiU0NcIixcIlRDXCIsXCJVQ1wiLFwiVkNcIixcIk1EXCIsXCJFQ1wiLFwiV0NcIixcIlhDXCIsXCJZQ1wiLFwiWkNcIixcImFDXCIsXCJiQ1wiLFwiRkNcIixcImNDXCIsXCJcIixcIlwiXSxFOlwiU2FmYXJpIG9uIGlPU1wiLEY6e05DOjEyNzAyNTI4MDAsXCIxQ1wiOjEyODM5MDQwMDAsZUM6MTI5OTYyODgwMCxcIjJDXCI6MTMzMTA3ODQwMCxcIjNDXCI6MTM1OTMzMTIwMCxcIjRDXCI6MTM5NDQwOTYwMCxGOjE0MTA5MTIwMDAsXCI1Q1wiOjE0MTM3NjMyMDAsXCI2Q1wiOjE0NDIzNjE2MDAsXCI3Q1wiOjE0NTg1MTg0MDAsXCI4Q1wiOjE0NzM3MjQ4MDAsXCI5Q1wiOjE0OTA1NzI4MDAsQUQ6MTUwNTc3OTIwMCxCRDoxNTIyMjgxNjAwLENEOjE1MzcxNDI0MDAsREQ6MTU1MzQ3MjAwMCxFRDoxNTY4ODUxMjAwLEZEOjE1NzIyMjA4MDAsR0Q6MTU4MDE2OTYwMCxIRDoxNTg1MDA4MDAwLElEOjE2MDAyMTQ0MDAsSkQ6MTYxOTM5NTIwMCxLRDoxNjMyMDk2MDAwLFBDOjE2MzkzNTM2MDAsUUM6MTY0NzIxNjAwMCxDQzoxNjUyNjU5MjAwLExEOjE2NTgyNzUyMDAsREM6MTY2Mjk0MDgwMCxSQzoxNjY2NTY5NjAwLFNDOjE2NzA4ODk2MDAsVEM6MTY3NDQzMjAwMCxVQzoxNjc5ODc1MjAwLFZDOjE2ODQzNjgwMDAsTUQ6MTY5MDE1NjgwMCxFQzoxNjk0OTk1MjAwLFdDOjE2OTgxOTIwMDAsWEM6MTcwMjI1MjgwMCxZQzoxNzA1ODgxNjAwLFpDOjE3MDk1OTY4MDAsYUM6MTcxNTU1ODQwMCxiQzoxNzIyMjExMjAwLEZDOjE3MjY0NDQ4MDAsY0M6bnVsbH19LEg6e0E6e05EOjAuMDV9LEI6XCJvXCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJORFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiT3BlcmEgTWluaVwiLEY6e05EOjE0MjY0NjQwMDB9fSxJOntBOntHQzowLEo6MC4wMDAwMzI3MjE2LEQ6MC4zMjYxNjksT0Q6MCxQRDowLFFEOjAsUkQ6MC4wMDAxMzA4ODYsZUM6MC4wMDAxMzA4ODYsU0Q6MCxURDowLjAwMDUyMzU0Nn0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiT0RcIixcIlBEXCIsXCJRRFwiLFwiR0NcIixcIkpcIixcIlJEXCIsXCJlQ1wiLFwiU0RcIixcIlREXCIsXCJEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJBbmRyb2lkIEJyb3dzZXJcIixGOntPRDoxMjU2NTE1MjAwLFBEOjEyNzQzMTM2MDAsUUQ6MTI5MTU5MzYwMCxHQzoxMjk4MzMyODAwLEo6MTMxODg5NjAwMCxSRDoxMzQxNzkyMDAwLGVDOjEzNzQ2MjQwMDAsU0Q6MTM4NjU0NzIwMCxURDoxNDAxNjY3MjAwLEQ6MTcyODg2NDAwMH19LEo6e0E6e0U6MCxBOjB9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJFXCIsXCJBXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJCbGFja2JlcnJ5IEJyb3dzZXJcIixGOntFOjEzMjUzNzYwMDAsQToxMzU5NTA0MDAwfX0sSzp7QTp7QTowLEI6MCxDOjAsSToxLjI0NjAzLEFDOjAsZEM6MCxCQzowfSxCOlwib1wiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiQVwiLFwiQlwiLFwiQUNcIixcImRDXCIsXCJDXCIsXCJCQ1wiLFwiSVwiLFwiXCIsXCJcIixcIlwiXSxFOlwiT3BlcmEgTW9iaWxlXCIsRjp7QToxMjg3MTAwODAwLEI6MTMwMDc1MjAwMCxBQzoxMzE0ODM1MjAwLGRDOjEzMTgyOTEyMDAsQzoxMzMwMzAwODAwLEJDOjEzNDk3NDA4MDAsSToxNzA5NzY5NjAwfSxEOntJOlwid2Via2l0XCJ9fSxMOntBOntEOjQ0LjMzMX0sQjpcIndlYmtpdFwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiRFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiQ2hyb21lIGZvciBBbmRyb2lkXCIsRjp7RDoxNzI4ODY0MDAwfX0sTTp7QTp7RDowLjM2NTcxMn0sQjpcIm1velwiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiRFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiRmlyZWZveCBmb3IgQW5kcm9pZFwiLEY6e0Q6MTcyNTMyMTYwMH19LE46e0E6e0E6MCxCOjB9LEI6XCJtc1wiLEM6W1wiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIkFcIixcIkJcIixcIlwiLFwiXCIsXCJcIl0sRTpcIklFIE1vYmlsZVwiLEY6e0E6MTM0MDE1MDQwMCxCOjEzNTM0NTYwMDB9fSxPOntBOntDQzoxLjEzNTYzfSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJDQ1wiLFwiXCIsXCJcIixcIlwiXSxFOlwiVUMgQnJvd3NlciBmb3IgQW5kcm9pZFwiLEY6e0NDOjE3MTAxMTUyMDB9LEQ6e0NDOlwid2Via2l0XCJ9fSxQOntBOntcIjBcIjowLjA2NDczNjEsXCIxXCI6MC4wNjQ3MzYxLFwiMlwiOjAuMDc1NTI1NSxcIjNcIjoxLjI3MzE0LEo6MC4wOTcxMDQyLHk6MC4wMjE1Nzg3LHo6MC4wNDMxNTc0LFVEOjAuMDEwNzg5NCxWRDowLjAxMDc4OTQsV0Q6MC4wMzIzNjgxLFhEOjAsWUQ6MCxPQzowLFpEOjAuMDEwNzg5NCxhRDowLGJEOjAuMDEwNzg5NCxjRDowLGREOjAsREM6MCxFQzowLjAyMTU3ODcsRkM6MCxlRDowLjAyMTU3ODd9LEI6XCJ3ZWJraXRcIixDOltcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIkpcIixcIlVEXCIsXCJWRFwiLFwiV0RcIixcIlhEXCIsXCJZRFwiLFwiT0NcIixcIlpEXCIsXCJhRFwiLFwiYkRcIixcImNEXCIsXCJkRFwiLFwiRENcIixcIkVDXCIsXCJGQ1wiLFwiZURcIixcInlcIixcInpcIixcIjBcIixcIjFcIixcIjJcIixcIjNcIixcIlwiLFwiXCIsXCJcIl0sRTpcIlNhbXN1bmcgSW50ZXJuZXRcIixGOntcIjBcIjoxNjg5MjkyODAwLFwiMVwiOjE2OTc1ODcyMDAsXCIyXCI6MTcxMTQ5NzYwMCxcIjNcIjoxNzE1MTI2NDAwLEo6MTQ2MTAyNDAwMCxVRDoxNDgxODQ2NDAwLFZEOjE1MDk0MDgwMDAsV0Q6MTUyODMyOTYwMCxYRDoxNTQ2MTI4MDAwLFlEOjE1NTQxNjMyMDAsT0M6MTU2NzkwMDgwMCxaRDoxNTgyNTg4ODAwLGFEOjE1OTM0NzUyMDAsYkQ6MTYwNTY1NzYwMCxjRDoxNjE4NTMxMjAwLGREOjE2MjkwNzIwMDAsREM6MTY0MDczNjAwMCxFQzoxNjUxNzA4ODAwLEZDOjE2NTk2NTc2MDAsZUQ6MTY2NzI2MDgwMCx5OjE2NzczNjk2MDAsejoxNjg0NDU0NDAwfX0sUTp7QTp7ZkQ6MC4zMjA4fSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJmRFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiUVEgQnJvd3NlclwiLEY6e2ZEOjE3MTAyODgwMDB9fSxSOntBOntnRDowfSxCOlwid2Via2l0XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJnRFwiLFwiXCIsXCJcIixcIlwiXSxFOlwiQmFpZHUgQnJvd3NlclwiLEY6e2dEOjE3MTAyMDE2MDB9fSxTOntBOntoRDowLjA1MTMyOCxpRDowfSxCOlwibW96XCIsQzpbXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiXCIsXCJcIixcIlwiLFwiaERcIixcImlEXCIsXCJcIixcIlwiLFwiXCJdLEU6XCJLYWlPUyBCcm93c2VyXCIsRjp7aEQ6MTUyNzgxMTIwMCxpRDoxNjMxNjY0MDAwfX19O1xuIiwibW9kdWxlLmV4cG9ydHM9e1wiMFwiOlwiMjJcIixcIjFcIjpcIjIzXCIsXCIyXCI6XCIyNFwiLFwiM1wiOlwiMjVcIixcIjRcIjpcIjExNVwiLFwiNVwiOlwiMTE2XCIsXCI2XCI6XCIxMTdcIixcIjdcIjpcIjExOFwiLFwiOFwiOlwiMTE5XCIsXCI5XCI6XCIxMjBcIixBOlwiMTBcIixCOlwiMTFcIixDOlwiMTJcIixEOlwiMTMwXCIsRTpcIjdcIixGOlwiOFwiLEc6XCI5XCIsSDpcIjE1XCIsSTpcIjgwXCIsSjpcIjRcIixLOlwiNlwiLEw6XCIxM1wiLE06XCIxNFwiLE46XCIxNlwiLE86XCIxN1wiLFA6XCIxOFwiLFE6XCI3OVwiLFI6XCI4MVwiLFM6XCI4M1wiLFQ6XCI4NFwiLFU6XCI4NVwiLFY6XCI4NlwiLFc6XCI4N1wiLFg6XCI4OFwiLFk6XCI4OVwiLFo6XCI5MFwiLGE6XCI5MVwiLGI6XCI5MlwiLGM6XCI5M1wiLGQ6XCI5NFwiLGU6XCI5NVwiLGY6XCI5NlwiLGc6XCI5N1wiLGg6XCI5OFwiLGk6XCI5OVwiLGo6XCIxMDBcIixrOlwiMTAxXCIsbDpcIjEwMlwiLG06XCIxMDNcIixuOlwiMTA0XCIsbzpcIjEwNVwiLHA6XCIxMDZcIixxOlwiMTA3XCIscjpcIjEwOFwiLHM6XCIxMDlcIix0OlwiMTEwXCIsdTpcIjExMVwiLHY6XCIxMTJcIix3OlwiMTEzXCIseDpcIjExNFwiLHk6XCIyMFwiLHo6XCIyMVwiLEFCOlwiMTIxXCIsQkI6XCIxMjJcIixDQjpcIjEyM1wiLERCOlwiMTI0XCIsRUI6XCIxMjVcIixGQjpcIjEyNlwiLEdCOlwiMTI3XCIsSEI6XCIxMjhcIixJQjpcIjEyOVwiLEpCOlwiNVwiLEtCOlwiMTlcIixMQjpcIjI2XCIsTUI6XCIyN1wiLE5COlwiMjhcIixPQjpcIjI5XCIsUEI6XCIzMFwiLFFCOlwiMzFcIixSQjpcIjMyXCIsU0I6XCIzM1wiLFRCOlwiMzRcIixVQjpcIjM1XCIsVkI6XCIzNlwiLFdCOlwiMzdcIixYQjpcIjM4XCIsWUI6XCIzOVwiLFpCOlwiNDBcIixhQjpcIjQxXCIsYkI6XCI0MlwiLGNCOlwiNDNcIixkQjpcIjQ0XCIsZUI6XCI0NVwiLGZCOlwiNDZcIixnQjpcIjQ3XCIsaEI6XCI0OFwiLGlCOlwiNDlcIixqQjpcIjUwXCIsa0I6XCI1MVwiLGxCOlwiNTJcIixtQjpcIjUzXCIsbkI6XCI1NFwiLG9COlwiNTVcIixwQjpcIjU2XCIscUI6XCI1N1wiLHJCOlwiNThcIixzQjpcIjYwXCIsdEI6XCI2MlwiLHVCOlwiNjNcIix2QjpcIjY0XCIsd0I6XCI2NVwiLHhCOlwiNjZcIix5QjpcIjY3XCIsekI6XCI2OFwiLFwiMEJcIjpcIjY5XCIsXCIxQlwiOlwiNzBcIixcIjJCXCI6XCI3MVwiLFwiM0JcIjpcIjcyXCIsXCI0QlwiOlwiNzNcIixcIjVCXCI6XCI3NFwiLFwiNkJcIjpcIjc1XCIsXCI3QlwiOlwiNzZcIixcIjhCXCI6XCI3N1wiLFwiOUJcIjpcIjc4XCIsQUM6XCIxMS4xXCIsQkM6XCIxMi4xXCIsQ0M6XCIxNS41XCIsREM6XCIxNi4wXCIsRUM6XCIxNy4wXCIsRkM6XCIxOC4wXCIsR0M6XCIzXCIsSEM6XCI1OVwiLElDOlwiNjFcIixKQzpcIjgyXCIsS0M6XCIxMzFcIixMQzpcIjEzMlwiLE1DOlwiMTMzXCIsTkM6XCIzLjJcIixPQzpcIjEwLjFcIixQQzpcIjE1LjItMTUuM1wiLFFDOlwiMTUuNFwiLFJDOlwiMTYuMVwiLFNDOlwiMTYuMlwiLFRDOlwiMTYuM1wiLFVDOlwiMTYuNFwiLFZDOlwiMTYuNVwiLFdDOlwiMTcuMVwiLFhDOlwiMTcuMlwiLFlDOlwiMTcuM1wiLFpDOlwiMTcuNFwiLGFDOlwiMTcuNVwiLGJDOlwiMTcuNlwiLGNDOlwiMTguMVwiLGRDOlwiMTEuNVwiLGVDOlwiNC4yLTQuM1wiLGZDOlwiNS41XCIsZ0M6XCIyXCIsaEM6XCIxMzRcIixpQzpcIjEzNVwiLGpDOlwiMy41XCIsa0M6XCIzLjZcIixsQzpcIjMuMVwiLG1DOlwiNS4xXCIsbkM6XCI2LjFcIixvQzpcIjcuMVwiLHBDOlwiOS4xXCIscUM6XCIxMy4xXCIsckM6XCIxNC4xXCIsc0M6XCIxNS4xXCIsdEM6XCIxNS42XCIsdUM6XCIxNi42XCIsdkM6XCJUUFwiLHdDOlwiOS41LTkuNlwiLHhDOlwiMTAuMC0xMC4xXCIseUM6XCIxMC41XCIsekM6XCIxMC42XCIsXCIwQ1wiOlwiMTEuNlwiLFwiMUNcIjpcIjQuMC00LjFcIixcIjJDXCI6XCI1LjAtNS4xXCIsXCIzQ1wiOlwiNi4wLTYuMVwiLFwiNENcIjpcIjcuMC03LjFcIixcIjVDXCI6XCI4LjEtOC40XCIsXCI2Q1wiOlwiOS4wLTkuMlwiLFwiN0NcIjpcIjkuM1wiLFwiOENcIjpcIjEwLjAtMTAuMlwiLFwiOUNcIjpcIjEwLjNcIixBRDpcIjExLjAtMTEuMlwiLEJEOlwiMTEuMy0xMS40XCIsQ0Q6XCIxMi4wLTEyLjFcIixERDpcIjEyLjItMTIuNVwiLEVEOlwiMTMuMC0xMy4xXCIsRkQ6XCIxMy4yXCIsR0Q6XCIxMy4zXCIsSEQ6XCIxMy40LTEzLjdcIixJRDpcIjE0LjAtMTQuNFwiLEpEOlwiMTQuNS0xNC44XCIsS0Q6XCIxNS4wLTE1LjFcIixMRDpcIjE1LjYtMTUuOFwiLE1EOlwiMTYuNi0xNi43XCIsTkQ6XCJhbGxcIixPRDpcIjIuMVwiLFBEOlwiMi4yXCIsUUQ6XCIyLjNcIixSRDpcIjQuMVwiLFNEOlwiNC40XCIsVEQ6XCI0LjQuMy00LjQuNFwiLFVEOlwiNS4wLTUuNFwiLFZEOlwiNi4yLTYuNFwiLFdEOlwiNy4yLTcuNFwiLFhEOlwiOC4yXCIsWUQ6XCI5LjJcIixaRDpcIjExLjEtMTEuMlwiLGFEOlwiMTIuMFwiLGJEOlwiMTMuMFwiLGNEOlwiMTQuMFwiLGREOlwiMTUuMFwiLGVEOlwiMTkuMFwiLGZEOlwiMTQuOVwiLGdEOlwiMTMuNTJcIixoRDpcIjIuNVwiLGlEOlwiMy4wLTMuMVwifTtcbiIsIm1vZHVsZS5leHBvcnRzPXtBOlwiaWVcIixCOlwiZWRnZVwiLEM6XCJmaXJlZm94XCIsRDpcImNocm9tZVwiLEU6XCJzYWZhcmlcIixGOlwib3BlcmFcIixHOlwiaW9zX3NhZlwiLEg6XCJvcF9taW5pXCIsSTpcImFuZHJvaWRcIixKOlwiYmJcIixLOlwib3BfbW9iXCIsTDpcImFuZF9jaHJcIixNOlwiYW5kX2ZmXCIsTjpcImllX21vYlwiLE86XCJhbmRfdWNcIixQOlwic2Ftc3VuZ1wiLFE6XCJhbmRfcXFcIixSOlwiYmFpZHVcIixTOlwia2Fpb3NcIn07XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgYnJvd3NlcnMgPSByZXF1aXJlKCcuL2Jyb3dzZXJzJykuYnJvd3NlcnNcbmNvbnN0IHZlcnNpb25zID0gcmVxdWlyZSgnLi9icm93c2VyVmVyc2lvbnMnKS5icm93c2VyVmVyc2lvbnNcbmNvbnN0IGFnZW50c0RhdGEgPSByZXF1aXJlKCcuLi8uLi9kYXRhL2FnZW50cycpXG5cbmZ1bmN0aW9uIHVucGFja0Jyb3dzZXJWZXJzaW9ucyh2ZXJzaW9uc0RhdGEpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHZlcnNpb25zRGF0YSkucmVkdWNlKCh1c2FnZSwgdmVyc2lvbikgPT4ge1xuICAgIHVzYWdlW3ZlcnNpb25zW3ZlcnNpb25dXSA9IHZlcnNpb25zRGF0YVt2ZXJzaW9uXVxuICAgIHJldHVybiB1c2FnZVxuICB9LCB7fSlcbn1cblxubW9kdWxlLmV4cG9ydHMuYWdlbnRzID0gT2JqZWN0LmtleXMoYWdlbnRzRGF0YSkucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuICBsZXQgdmVyc2lvbnNEYXRhID0gYWdlbnRzRGF0YVtrZXldXG4gIG1hcFticm93c2Vyc1trZXldXSA9IE9iamVjdC5rZXlzKHZlcnNpb25zRGF0YSkucmVkdWNlKChkYXRhLCBlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeSA9PT0gJ0EnKSB7XG4gICAgICBkYXRhLnVzYWdlX2dsb2JhbCA9IHVucGFja0Jyb3dzZXJWZXJzaW9ucyh2ZXJzaW9uc0RhdGFbZW50cnldKVxuICAgIH0gZWxzZSBpZiAoZW50cnkgPT09ICdDJykge1xuICAgICAgZGF0YS52ZXJzaW9ucyA9IHZlcnNpb25zRGF0YVtlbnRyeV0ucmVkdWNlKChsaXN0LCB2ZXJzaW9uKSA9PiB7XG4gICAgICAgIGlmICh2ZXJzaW9uID09PSAnJykge1xuICAgICAgICAgIGxpc3QucHVzaChudWxsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3QucHVzaCh2ZXJzaW9uc1t2ZXJzaW9uXSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGlzdFxuICAgICAgfSwgW10pXG4gICAgfSBlbHNlIGlmIChlbnRyeSA9PT0gJ0QnKSB7XG4gICAgICBkYXRhLnByZWZpeF9leGNlcHRpb25zID0gdW5wYWNrQnJvd3NlclZlcnNpb25zKHZlcnNpb25zRGF0YVtlbnRyeV0pXG4gICAgfSBlbHNlIGlmIChlbnRyeSA9PT0gJ0UnKSB7XG4gICAgICBkYXRhLmJyb3dzZXIgPSB2ZXJzaW9uc0RhdGFbZW50cnldXG4gICAgfSBlbHNlIGlmIChlbnRyeSA9PT0gJ0YnKSB7XG4gICAgICBkYXRhLnJlbGVhc2VfZGF0ZSA9IE9iamVjdC5rZXlzKHZlcnNpb25zRGF0YVtlbnRyeV0pLnJlZHVjZShcbiAgICAgICAgKG1hcDIsIGtleTIpID0+IHtcbiAgICAgICAgICBtYXAyW3ZlcnNpb25zW2tleTJdXSA9IHZlcnNpb25zRGF0YVtlbnRyeV1ba2V5Ml1cbiAgICAgICAgICByZXR1cm4gbWFwMlxuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbnRyeSBpcyBCXG4gICAgICBkYXRhLnByZWZpeCA9IHZlcnNpb25zRGF0YVtlbnRyeV1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGFcbiAgfSwge30pXG4gIHJldHVybiBtYXBcbn0sIHt9KVxuIiwibW9kdWxlLmV4cG9ydHMuYnJvd3NlclZlcnNpb25zID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9icm93c2VyVmVyc2lvbnMnKVxuIiwibW9kdWxlLmV4cG9ydHMuYnJvd3NlcnMgPSByZXF1aXJlKCcuLi8uLi9kYXRhL2Jyb3dzZXJzJylcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIjAuMjBcIjogXCIzOVwiLFxuXHRcIjAuMjFcIjogXCI0MVwiLFxuXHRcIjAuMjJcIjogXCI0MVwiLFxuXHRcIjAuMjNcIjogXCI0MVwiLFxuXHRcIjAuMjRcIjogXCI0MVwiLFxuXHRcIjAuMjVcIjogXCI0MlwiLFxuXHRcIjAuMjZcIjogXCI0MlwiLFxuXHRcIjAuMjdcIjogXCI0M1wiLFxuXHRcIjAuMjhcIjogXCI0M1wiLFxuXHRcIjAuMjlcIjogXCI0M1wiLFxuXHRcIjAuMzBcIjogXCI0NFwiLFxuXHRcIjAuMzFcIjogXCI0NVwiLFxuXHRcIjAuMzJcIjogXCI0NVwiLFxuXHRcIjAuMzNcIjogXCI0NVwiLFxuXHRcIjAuMzRcIjogXCI0NVwiLFxuXHRcIjAuMzVcIjogXCI0NVwiLFxuXHRcIjAuMzZcIjogXCI0N1wiLFxuXHRcIjAuMzdcIjogXCI0OVwiLFxuXHRcIjEuMFwiOiBcIjQ5XCIsXG5cdFwiMS4xXCI6IFwiNTBcIixcblx0XCIxLjJcIjogXCI1MVwiLFxuXHRcIjEuM1wiOiBcIjUyXCIsXG5cdFwiMS40XCI6IFwiNTNcIixcblx0XCIxLjVcIjogXCI1NFwiLFxuXHRcIjEuNlwiOiBcIjU2XCIsXG5cdFwiMS43XCI6IFwiNThcIixcblx0XCIxLjhcIjogXCI1OVwiLFxuXHRcIjIuMFwiOiBcIjYxXCIsXG5cdFwiMi4xXCI6IFwiNjFcIixcblx0XCIzLjBcIjogXCI2NlwiLFxuXHRcIjMuMVwiOiBcIjY2XCIsXG5cdFwiNC4wXCI6IFwiNjlcIixcblx0XCI0LjFcIjogXCI2OVwiLFxuXHRcIjQuMlwiOiBcIjY5XCIsXG5cdFwiNS4wXCI6IFwiNzNcIixcblx0XCI2LjBcIjogXCI3NlwiLFxuXHRcIjYuMVwiOiBcIjc2XCIsXG5cdFwiNy4wXCI6IFwiNzhcIixcblx0XCI3LjFcIjogXCI3OFwiLFxuXHRcIjcuMlwiOiBcIjc4XCIsXG5cdFwiNy4zXCI6IFwiNzhcIixcblx0XCI4LjBcIjogXCI4MFwiLFxuXHRcIjguMVwiOiBcIjgwXCIsXG5cdFwiOC4yXCI6IFwiODBcIixcblx0XCI4LjNcIjogXCI4MFwiLFxuXHRcIjguNFwiOiBcIjgwXCIsXG5cdFwiOC41XCI6IFwiODBcIixcblx0XCI5LjBcIjogXCI4M1wiLFxuXHRcIjkuMVwiOiBcIjgzXCIsXG5cdFwiOS4yXCI6IFwiODNcIixcblx0XCI5LjNcIjogXCI4M1wiLFxuXHRcIjkuNFwiOiBcIjgzXCIsXG5cdFwiMTAuMFwiOiBcIjg1XCIsXG5cdFwiMTAuMVwiOiBcIjg1XCIsXG5cdFwiMTAuMlwiOiBcIjg1XCIsXG5cdFwiMTAuM1wiOiBcIjg1XCIsXG5cdFwiMTAuNFwiOiBcIjg1XCIsXG5cdFwiMTEuMFwiOiBcIjg3XCIsXG5cdFwiMTEuMVwiOiBcIjg3XCIsXG5cdFwiMTEuMlwiOiBcIjg3XCIsXG5cdFwiMTEuM1wiOiBcIjg3XCIsXG5cdFwiMTEuNFwiOiBcIjg3XCIsXG5cdFwiMTEuNVwiOiBcIjg3XCIsXG5cdFwiMTIuMFwiOiBcIjg5XCIsXG5cdFwiMTIuMVwiOiBcIjg5XCIsXG5cdFwiMTIuMlwiOiBcIjg5XCIsXG5cdFwiMTMuMFwiOiBcIjkxXCIsXG5cdFwiMTMuMVwiOiBcIjkxXCIsXG5cdFwiMTMuMlwiOiBcIjkxXCIsXG5cdFwiMTMuM1wiOiBcIjkxXCIsXG5cdFwiMTMuNFwiOiBcIjkxXCIsXG5cdFwiMTMuNVwiOiBcIjkxXCIsXG5cdFwiMTMuNlwiOiBcIjkxXCIsXG5cdFwiMTQuMFwiOiBcIjkzXCIsXG5cdFwiMTQuMVwiOiBcIjkzXCIsXG5cdFwiMTQuMlwiOiBcIjkzXCIsXG5cdFwiMTUuMFwiOiBcIjk0XCIsXG5cdFwiMTUuMVwiOiBcIjk0XCIsXG5cdFwiMTUuMlwiOiBcIjk0XCIsXG5cdFwiMTUuM1wiOiBcIjk0XCIsXG5cdFwiMTUuNFwiOiBcIjk0XCIsXG5cdFwiMTUuNVwiOiBcIjk0XCIsXG5cdFwiMTYuMFwiOiBcIjk2XCIsXG5cdFwiMTYuMVwiOiBcIjk2XCIsXG5cdFwiMTYuMlwiOiBcIjk2XCIsXG5cdFwiMTcuMFwiOiBcIjk4XCIsXG5cdFwiMTcuMVwiOiBcIjk4XCIsXG5cdFwiMTcuMlwiOiBcIjk4XCIsXG5cdFwiMTcuM1wiOiBcIjk4XCIsXG5cdFwiMTcuNFwiOiBcIjk4XCIsXG5cdFwiMTguMFwiOiBcIjEwMFwiLFxuXHRcIjE4LjFcIjogXCIxMDBcIixcblx0XCIxOC4yXCI6IFwiMTAwXCIsXG5cdFwiMTguM1wiOiBcIjEwMFwiLFxuXHRcIjE5LjBcIjogXCIxMDJcIixcblx0XCIxOS4xXCI6IFwiMTAyXCIsXG5cdFwiMjAuMFwiOiBcIjEwNFwiLFxuXHRcIjIwLjFcIjogXCIxMDRcIixcblx0XCIyMC4yXCI6IFwiMTA0XCIsXG5cdFwiMjAuM1wiOiBcIjEwNFwiLFxuXHRcIjIxLjBcIjogXCIxMDZcIixcblx0XCIyMS4xXCI6IFwiMTA2XCIsXG5cdFwiMjEuMlwiOiBcIjEwNlwiLFxuXHRcIjIxLjNcIjogXCIxMDZcIixcblx0XCIyMS40XCI6IFwiMTA2XCIsXG5cdFwiMjIuMFwiOiBcIjEwOFwiLFxuXHRcIjIyLjFcIjogXCIxMDhcIixcblx0XCIyMi4yXCI6IFwiMTA4XCIsXG5cdFwiMjIuM1wiOiBcIjEwOFwiLFxuXHRcIjIzLjBcIjogXCIxMTBcIixcblx0XCIyMy4xXCI6IFwiMTEwXCIsXG5cdFwiMjMuMlwiOiBcIjExMFwiLFxuXHRcIjIzLjNcIjogXCIxMTBcIixcblx0XCIyNC4wXCI6IFwiMTEyXCIsXG5cdFwiMjQuMVwiOiBcIjExMlwiLFxuXHRcIjI0LjJcIjogXCIxMTJcIixcblx0XCIyNC4zXCI6IFwiMTEyXCIsXG5cdFwiMjQuNFwiOiBcIjExMlwiLFxuXHRcIjI0LjVcIjogXCIxMTJcIixcblx0XCIyNC42XCI6IFwiMTEyXCIsXG5cdFwiMjQuN1wiOiBcIjExMlwiLFxuXHRcIjI0LjhcIjogXCIxMTJcIixcblx0XCIyNS4wXCI6IFwiMTE0XCIsXG5cdFwiMjUuMVwiOiBcIjExNFwiLFxuXHRcIjI1LjJcIjogXCIxMTRcIixcblx0XCIyNS4zXCI6IFwiMTE0XCIsXG5cdFwiMjUuNFwiOiBcIjExNFwiLFxuXHRcIjI1LjVcIjogXCIxMTRcIixcblx0XCIyNS42XCI6IFwiMTE0XCIsXG5cdFwiMjUuN1wiOiBcIjExNFwiLFxuXHRcIjI1LjhcIjogXCIxMTRcIixcblx0XCIyNS45XCI6IFwiMTE0XCIsXG5cdFwiMjYuMFwiOiBcIjExNlwiLFxuXHRcIjI2LjFcIjogXCIxMTZcIixcblx0XCIyNi4yXCI6IFwiMTE2XCIsXG5cdFwiMjYuM1wiOiBcIjExNlwiLFxuXHRcIjI2LjRcIjogXCIxMTZcIixcblx0XCIyNi41XCI6IFwiMTE2XCIsXG5cdFwiMjYuNlwiOiBcIjExNlwiLFxuXHRcIjI3LjBcIjogXCIxMThcIixcblx0XCIyNy4xXCI6IFwiMTE4XCIsXG5cdFwiMjcuMlwiOiBcIjExOFwiLFxuXHRcIjI3LjNcIjogXCIxMThcIixcblx0XCIyOC4wXCI6IFwiMTIwXCIsXG5cdFwiMjguMVwiOiBcIjEyMFwiLFxuXHRcIjI4LjJcIjogXCIxMjBcIixcblx0XCIyOC4zXCI6IFwiMTIwXCIsXG5cdFwiMjkuMFwiOiBcIjEyMlwiLFxuXHRcIjI5LjFcIjogXCIxMjJcIixcblx0XCIyOS4yXCI6IFwiMTIyXCIsXG5cdFwiMjkuM1wiOiBcIjEyMlwiLFxuXHRcIjI5LjRcIjogXCIxMjJcIixcblx0XCIzMC4wXCI6IFwiMTI0XCIsXG5cdFwiMzAuMVwiOiBcIjEyNFwiLFxuXHRcIjMwLjJcIjogXCIxMjRcIixcblx0XCIzMC4zXCI6IFwiMTI0XCIsXG5cdFwiMzAuNFwiOiBcIjEyNFwiLFxuXHRcIjMwLjVcIjogXCIxMjRcIixcblx0XCIzMS4wXCI6IFwiMTI2XCIsXG5cdFwiMzEuMVwiOiBcIjEyNlwiLFxuXHRcIjMxLjJcIjogXCIxMjZcIixcblx0XCIzMS4zXCI6IFwiMTI2XCIsXG5cdFwiMzEuNFwiOiBcIjEyNlwiLFxuXHRcIjMxLjVcIjogXCIxMjZcIixcblx0XCIzMS42XCI6IFwiMTI2XCIsXG5cdFwiMzEuN1wiOiBcIjEyNlwiLFxuXHRcIjMyLjBcIjogXCIxMjhcIixcblx0XCIzMi4xXCI6IFwiMTI4XCIsXG5cdFwiMzIuMlwiOiBcIjEyOFwiLFxuXHRcIjMzLjBcIjogXCIxMzBcIixcblx0XCIzNC4wXCI6IFwiMTMyXCJcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbi8vIEEgbGlua2VkIGxpc3QgdG8ga2VlcCB0cmFjayBvZiByZWNlbnRseS11c2VkLW5lc3NcbmNvbnN0IFlhbGxpc3QgPSByZXF1aXJlKCd5YWxsaXN0JylcblxuY29uc3QgTUFYID0gU3ltYm9sKCdtYXgnKVxuY29uc3QgTEVOR1RIID0gU3ltYm9sKCdsZW5ndGgnKVxuY29uc3QgTEVOR1RIX0NBTENVTEFUT1IgPSBTeW1ib2woJ2xlbmd0aENhbGN1bGF0b3InKVxuY29uc3QgQUxMT1dfU1RBTEUgPSBTeW1ib2woJ2FsbG93U3RhbGUnKVxuY29uc3QgTUFYX0FHRSA9IFN5bWJvbCgnbWF4QWdlJylcbmNvbnN0IERJU1BPU0UgPSBTeW1ib2woJ2Rpc3Bvc2UnKVxuY29uc3QgTk9fRElTUE9TRV9PTl9TRVQgPSBTeW1ib2woJ25vRGlzcG9zZU9uU2V0JylcbmNvbnN0IExSVV9MSVNUID0gU3ltYm9sKCdscnVMaXN0JylcbmNvbnN0IENBQ0hFID0gU3ltYm9sKCdjYWNoZScpXG5jb25zdCBVUERBVEVfQUdFX09OX0dFVCA9IFN5bWJvbCgndXBkYXRlQWdlT25HZXQnKVxuXG5jb25zdCBuYWl2ZUxlbmd0aCA9ICgpID0+IDFcblxuLy8gbHJ1TGlzdCBpcyBhIHlhbGxpc3Qgd2hlcmUgdGhlIGhlYWQgaXMgdGhlIHlvdW5nZXN0XG4vLyBpdGVtLCBhbmQgdGhlIHRhaWwgaXMgdGhlIG9sZGVzdC4gIHRoZSBsaXN0IGNvbnRhaW5zIHRoZSBIaXRcbi8vIG9iamVjdHMgYXMgdGhlIGVudHJpZXMuXG4vLyBFYWNoIEhpdCBvYmplY3QgaGFzIGEgcmVmZXJlbmNlIHRvIGl0cyBZYWxsaXN0Lk5vZGUuICBUaGlzXG4vLyBuZXZlciBjaGFuZ2VzLlxuLy9cbi8vIGNhY2hlIGlzIGEgTWFwIChvciBQc2V1ZG9NYXApIHRoYXQgbWF0Y2hlcyB0aGUga2V5cyB0b1xuLy8gdGhlIFlhbGxpc3QuTm9kZSBvYmplY3QuXG5jbGFzcyBMUlVDYWNoZSB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJylcbiAgICAgIG9wdGlvbnMgPSB7IG1heDogb3B0aW9ucyB9XG5cbiAgICBpZiAoIW9wdGlvbnMpXG4gICAgICBvcHRpb25zID0ge31cblxuICAgIGlmIChvcHRpb25zLm1heCAmJiAodHlwZW9mIG9wdGlvbnMubWF4ICE9PSAnbnVtYmVyJyB8fCBvcHRpb25zLm1heCA8IDApKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbWF4IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyJylcbiAgICAvLyBLaW5kIG9mIHdlaXJkIHRvIGhhdmUgYSBkZWZhdWx0IG1heCBvZiBJbmZpbml0eSwgYnV0IG9oIHdlbGwuXG4gICAgY29uc3QgbWF4ID0gdGhpc1tNQVhdID0gb3B0aW9ucy5tYXggfHwgSW5maW5pdHlcblxuICAgIGNvbnN0IGxjID0gb3B0aW9ucy5sZW5ndGggfHwgbmFpdmVMZW5ndGhcbiAgICB0aGlzW0xFTkdUSF9DQUxDVUxBVE9SXSA9ICh0eXBlb2YgbGMgIT09ICdmdW5jdGlvbicpID8gbmFpdmVMZW5ndGggOiBsY1xuICAgIHRoaXNbQUxMT1dfU1RBTEVdID0gb3B0aW9ucy5zdGFsZSB8fCBmYWxzZVxuICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhBZ2UgIT09ICdudW1iZXInKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbWF4QWdlIG11c3QgYmUgYSBudW1iZXInKVxuICAgIHRoaXNbTUFYX0FHRV0gPSBvcHRpb25zLm1heEFnZSB8fCAwXG4gICAgdGhpc1tESVNQT1NFXSA9IG9wdGlvbnMuZGlzcG9zZVxuICAgIHRoaXNbTk9fRElTUE9TRV9PTl9TRVRdID0gb3B0aW9ucy5ub0Rpc3Bvc2VPblNldCB8fCBmYWxzZVxuICAgIHRoaXNbVVBEQVRFX0FHRV9PTl9HRVRdID0gb3B0aW9ucy51cGRhdGVBZ2VPbkdldCB8fCBmYWxzZVxuICAgIHRoaXMucmVzZXQoKVxuICB9XG5cbiAgLy8gcmVzaXplIHRoZSBjYWNoZSB3aGVuIHRoZSBtYXggY2hhbmdlcy5cbiAgc2V0IG1heCAobUwpIHtcbiAgICBpZiAodHlwZW9mIG1MICE9PSAnbnVtYmVyJyB8fCBtTCA8IDApXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtYXggbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXInKVxuXG4gICAgdGhpc1tNQVhdID0gbUwgfHwgSW5maW5pdHlcbiAgICB0cmltKHRoaXMpXG4gIH1cbiAgZ2V0IG1heCAoKSB7XG4gICAgcmV0dXJuIHRoaXNbTUFYXVxuICB9XG5cbiAgc2V0IGFsbG93U3RhbGUgKGFsbG93U3RhbGUpIHtcbiAgICB0aGlzW0FMTE9XX1NUQUxFXSA9ICEhYWxsb3dTdGFsZVxuICB9XG4gIGdldCBhbGxvd1N0YWxlICgpIHtcbiAgICByZXR1cm4gdGhpc1tBTExPV19TVEFMRV1cbiAgfVxuXG4gIHNldCBtYXhBZ2UgKG1BKSB7XG4gICAgaWYgKHR5cGVvZiBtQSAhPT0gJ251bWJlcicpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtYXhBZ2UgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXInKVxuXG4gICAgdGhpc1tNQVhfQUdFXSA9IG1BXG4gICAgdHJpbSh0aGlzKVxuICB9XG4gIGdldCBtYXhBZ2UgKCkge1xuICAgIHJldHVybiB0aGlzW01BWF9BR0VdXG4gIH1cblxuICAvLyByZXNpemUgdGhlIGNhY2hlIHdoZW4gdGhlIGxlbmd0aENhbGN1bGF0b3IgY2hhbmdlcy5cbiAgc2V0IGxlbmd0aENhbGN1bGF0b3IgKGxDKSB7XG4gICAgaWYgKHR5cGVvZiBsQyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIGxDID0gbmFpdmVMZW5ndGhcblxuICAgIGlmIChsQyAhPT0gdGhpc1tMRU5HVEhfQ0FMQ1VMQVRPUl0pIHtcbiAgICAgIHRoaXNbTEVOR1RIX0NBTENVTEFUT1JdID0gbENcbiAgICAgIHRoaXNbTEVOR1RIXSA9IDBcbiAgICAgIHRoaXNbTFJVX0xJU1RdLmZvckVhY2goaGl0ID0+IHtcbiAgICAgICAgaGl0Lmxlbmd0aCA9IHRoaXNbTEVOR1RIX0NBTENVTEFUT1JdKGhpdC52YWx1ZSwgaGl0LmtleSlcbiAgICAgICAgdGhpc1tMRU5HVEhdICs9IGhpdC5sZW5ndGhcbiAgICAgIH0pXG4gICAgfVxuICAgIHRyaW0odGhpcylcbiAgfVxuICBnZXQgbGVuZ3RoQ2FsY3VsYXRvciAoKSB7IHJldHVybiB0aGlzW0xFTkdUSF9DQUxDVUxBVE9SXSB9XG5cbiAgZ2V0IGxlbmd0aCAoKSB7IHJldHVybiB0aGlzW0xFTkdUSF0gfVxuICBnZXQgaXRlbUNvdW50ICgpIHsgcmV0dXJuIHRoaXNbTFJVX0xJU1RdLmxlbmd0aCB9XG5cbiAgcmZvckVhY2ggKGZuLCB0aGlzcCkge1xuICAgIHRoaXNwID0gdGhpc3AgfHwgdGhpc1xuICAgIGZvciAobGV0IHdhbGtlciA9IHRoaXNbTFJVX0xJU1RdLnRhaWw7IHdhbGtlciAhPT0gbnVsbDspIHtcbiAgICAgIGNvbnN0IHByZXYgPSB3YWxrZXIucHJldlxuICAgICAgZm9yRWFjaFN0ZXAodGhpcywgZm4sIHdhbGtlciwgdGhpc3ApXG4gICAgICB3YWxrZXIgPSBwcmV2XG4gICAgfVxuICB9XG5cbiAgZm9yRWFjaCAoZm4sIHRoaXNwKSB7XG4gICAgdGhpc3AgPSB0aGlzcCB8fCB0aGlzXG4gICAgZm9yIChsZXQgd2Fsa2VyID0gdGhpc1tMUlVfTElTVF0uaGVhZDsgd2Fsa2VyICE9PSBudWxsOykge1xuICAgICAgY29uc3QgbmV4dCA9IHdhbGtlci5uZXh0XG4gICAgICBmb3JFYWNoU3RlcCh0aGlzLCBmbiwgd2Fsa2VyLCB0aGlzcClcbiAgICAgIHdhbGtlciA9IG5leHRcbiAgICB9XG4gIH1cblxuICBrZXlzICgpIHtcbiAgICByZXR1cm4gdGhpc1tMUlVfTElTVF0udG9BcnJheSgpLm1hcChrID0+IGsua2V5KVxuICB9XG5cbiAgdmFsdWVzICgpIHtcbiAgICByZXR1cm4gdGhpc1tMUlVfTElTVF0udG9BcnJheSgpLm1hcChrID0+IGsudmFsdWUpXG4gIH1cblxuICByZXNldCAoKSB7XG4gICAgaWYgKHRoaXNbRElTUE9TRV0gJiZcbiAgICAgICAgdGhpc1tMUlVfTElTVF0gJiZcbiAgICAgICAgdGhpc1tMUlVfTElTVF0ubGVuZ3RoKSB7XG4gICAgICB0aGlzW0xSVV9MSVNUXS5mb3JFYWNoKGhpdCA9PiB0aGlzW0RJU1BPU0VdKGhpdC5rZXksIGhpdC52YWx1ZSkpXG4gICAgfVxuXG4gICAgdGhpc1tDQUNIRV0gPSBuZXcgTWFwKCkgLy8gaGFzaCBvZiBpdGVtcyBieSBrZXlcbiAgICB0aGlzW0xSVV9MSVNUXSA9IG5ldyBZYWxsaXN0KCkgLy8gbGlzdCBvZiBpdGVtcyBpbiBvcmRlciBvZiB1c2UgcmVjZW5jeVxuICAgIHRoaXNbTEVOR1RIXSA9IDAgLy8gbGVuZ3RoIG9mIGl0ZW1zIGluIHRoZSBsaXN0XG4gIH1cblxuICBkdW1wICgpIHtcbiAgICByZXR1cm4gdGhpc1tMUlVfTElTVF0ubWFwKGhpdCA9PlxuICAgICAgaXNTdGFsZSh0aGlzLCBoaXQpID8gZmFsc2UgOiB7XG4gICAgICAgIGs6IGhpdC5rZXksXG4gICAgICAgIHY6IGhpdC52YWx1ZSxcbiAgICAgICAgZTogaGl0Lm5vdyArIChoaXQubWF4QWdlIHx8IDApXG4gICAgICB9KS50b0FycmF5KCkuZmlsdGVyKGggPT4gaClcbiAgfVxuXG4gIGR1bXBMcnUgKCkge1xuICAgIHJldHVybiB0aGlzW0xSVV9MSVNUXVxuICB9XG5cbiAgc2V0IChrZXksIHZhbHVlLCBtYXhBZ2UpIHtcbiAgICBtYXhBZ2UgPSBtYXhBZ2UgfHwgdGhpc1tNQVhfQUdFXVxuXG4gICAgaWYgKG1heEFnZSAmJiB0eXBlb2YgbWF4QWdlICE9PSAnbnVtYmVyJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ21heEFnZSBtdXN0IGJlIGEgbnVtYmVyJylcblxuICAgIGNvbnN0IG5vdyA9IG1heEFnZSA/IERhdGUubm93KCkgOiAwXG4gICAgY29uc3QgbGVuID0gdGhpc1tMRU5HVEhfQ0FMQ1VMQVRPUl0odmFsdWUsIGtleSlcblxuICAgIGlmICh0aGlzW0NBQ0hFXS5oYXMoa2V5KSkge1xuICAgICAgaWYgKGxlbiA+IHRoaXNbTUFYXSkge1xuICAgICAgICBkZWwodGhpcywgdGhpc1tDQUNIRV0uZ2V0KGtleSkpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBub2RlID0gdGhpc1tDQUNIRV0uZ2V0KGtleSlcbiAgICAgIGNvbnN0IGl0ZW0gPSBub2RlLnZhbHVlXG5cbiAgICAgIC8vIGRpc3Bvc2Ugb2YgdGhlIG9sZCBvbmUgYmVmb3JlIG92ZXJ3cml0aW5nXG4gICAgICAvLyBzcGxpdCBvdXQgaW50byAyIGlmcyBmb3IgYmV0dGVyIGNvdmVyYWdlIHRyYWNraW5nXG4gICAgICBpZiAodGhpc1tESVNQT1NFXSkge1xuICAgICAgICBpZiAoIXRoaXNbTk9fRElTUE9TRV9PTl9TRVRdKVxuICAgICAgICAgIHRoaXNbRElTUE9TRV0oa2V5LCBpdGVtLnZhbHVlKVxuICAgICAgfVxuXG4gICAgICBpdGVtLm5vdyA9IG5vd1xuICAgICAgaXRlbS5tYXhBZ2UgPSBtYXhBZ2VcbiAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZVxuICAgICAgdGhpc1tMRU5HVEhdICs9IGxlbiAtIGl0ZW0ubGVuZ3RoXG4gICAgICBpdGVtLmxlbmd0aCA9IGxlblxuICAgICAgdGhpcy5nZXQoa2V5KVxuICAgICAgdHJpbSh0aGlzKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjb25zdCBoaXQgPSBuZXcgRW50cnkoa2V5LCB2YWx1ZSwgbGVuLCBub3csIG1heEFnZSlcblxuICAgIC8vIG92ZXJzaXplZCBvYmplY3RzIGZhbGwgb3V0IG9mIGNhY2hlIGF1dG9tYXRpY2FsbHkuXG4gICAgaWYgKGhpdC5sZW5ndGggPiB0aGlzW01BWF0pIHtcbiAgICAgIGlmICh0aGlzW0RJU1BPU0VdKVxuICAgICAgICB0aGlzW0RJU1BPU0VdKGtleSwgdmFsdWUpXG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHRoaXNbTEVOR1RIXSArPSBoaXQubGVuZ3RoXG4gICAgdGhpc1tMUlVfTElTVF0udW5zaGlmdChoaXQpXG4gICAgdGhpc1tDQUNIRV0uc2V0KGtleSwgdGhpc1tMUlVfTElTVF0uaGVhZClcbiAgICB0cmltKHRoaXMpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGhhcyAoa2V5KSB7XG4gICAgaWYgKCF0aGlzW0NBQ0hFXS5oYXMoa2V5KSkgcmV0dXJuIGZhbHNlXG4gICAgY29uc3QgaGl0ID0gdGhpc1tDQUNIRV0uZ2V0KGtleSkudmFsdWVcbiAgICByZXR1cm4gIWlzU3RhbGUodGhpcywgaGl0KVxuICB9XG5cbiAgZ2V0IChrZXkpIHtcbiAgICByZXR1cm4gZ2V0KHRoaXMsIGtleSwgdHJ1ZSlcbiAgfVxuXG4gIHBlZWsgKGtleSkge1xuICAgIHJldHVybiBnZXQodGhpcywga2V5LCBmYWxzZSlcbiAgfVxuXG4gIHBvcCAoKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXNbTFJVX0xJU1RdLnRhaWxcbiAgICBpZiAoIW5vZGUpXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgZGVsKHRoaXMsIG5vZGUpXG4gICAgcmV0dXJuIG5vZGUudmFsdWVcbiAgfVxuXG4gIGRlbCAoa2V5KSB7XG4gICAgZGVsKHRoaXMsIHRoaXNbQ0FDSEVdLmdldChrZXkpKVxuICB9XG5cbiAgbG9hZCAoYXJyKSB7XG4gICAgLy8gcmVzZXQgdGhlIGNhY2hlXG4gICAgdGhpcy5yZXNldCgpXG5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgLy8gQSBwcmV2aW91cyBzZXJpYWxpemVkIGNhY2hlIGhhcyB0aGUgbW9zdCByZWNlbnQgaXRlbXMgZmlyc3RcbiAgICBmb3IgKGxldCBsID0gYXJyLmxlbmd0aCAtIDE7IGwgPj0gMDsgbC0tKSB7XG4gICAgICBjb25zdCBoaXQgPSBhcnJbbF1cbiAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IGhpdC5lIHx8IDBcbiAgICAgIGlmIChleHBpcmVzQXQgPT09IDApXG4gICAgICAgIC8vIHRoZSBpdGVtIHdhcyBjcmVhdGVkIHdpdGhvdXQgZXhwaXJhdGlvbiBpbiBhIG5vbiBhZ2VkIGNhY2hlXG4gICAgICAgIHRoaXMuc2V0KGhpdC5rLCBoaXQudilcbiAgICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBtYXhBZ2UgPSBleHBpcmVzQXQgLSBub3dcbiAgICAgICAgLy8gZG9udCBhZGQgYWxyZWFkeSBleHBpcmVkIGl0ZW1zXG4gICAgICAgIGlmIChtYXhBZ2UgPiAwKSB7XG4gICAgICAgICAgdGhpcy5zZXQoaGl0LmssIGhpdC52LCBtYXhBZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcnVuZSAoKSB7XG4gICAgdGhpc1tDQUNIRV0uZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gZ2V0KHRoaXMsIGtleSwgZmFsc2UpKVxuICB9XG59XG5cbmNvbnN0IGdldCA9IChzZWxmLCBrZXksIGRvVXNlKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBzZWxmW0NBQ0hFXS5nZXQoa2V5KVxuICBpZiAobm9kZSkge1xuICAgIGNvbnN0IGhpdCA9IG5vZGUudmFsdWVcbiAgICBpZiAoaXNTdGFsZShzZWxmLCBoaXQpKSB7XG4gICAgICBkZWwoc2VsZiwgbm9kZSlcbiAgICAgIGlmICghc2VsZltBTExPV19TVEFMRV0pXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRvVXNlKSB7XG4gICAgICAgIGlmIChzZWxmW1VQREFURV9BR0VfT05fR0VUXSlcbiAgICAgICAgICBub2RlLnZhbHVlLm5vdyA9IERhdGUubm93KClcbiAgICAgICAgc2VsZltMUlVfTElTVF0udW5zaGlmdE5vZGUobm9kZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhpdC52YWx1ZVxuICB9XG59XG5cbmNvbnN0IGlzU3RhbGUgPSAoc2VsZiwgaGl0KSA9PiB7XG4gIGlmICghaGl0IHx8ICghaGl0Lm1heEFnZSAmJiAhc2VsZltNQVhfQUdFXSkpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBoaXQubm93XG4gIHJldHVybiBoaXQubWF4QWdlID8gZGlmZiA+IGhpdC5tYXhBZ2VcbiAgICA6IHNlbGZbTUFYX0FHRV0gJiYgKGRpZmYgPiBzZWxmW01BWF9BR0VdKVxufVxuXG5jb25zdCB0cmltID0gc2VsZiA9PiB7XG4gIGlmIChzZWxmW0xFTkdUSF0gPiBzZWxmW01BWF0pIHtcbiAgICBmb3IgKGxldCB3YWxrZXIgPSBzZWxmW0xSVV9MSVNUXS50YWlsO1xuICAgICAgc2VsZltMRU5HVEhdID4gc2VsZltNQVhdICYmIHdhbGtlciAhPT0gbnVsbDspIHtcbiAgICAgIC8vIFdlIGtub3cgdGhhdCB3ZSdyZSBhYm91dCB0byBkZWxldGUgdGhpcyBvbmUsIGFuZCBhbHNvXG4gICAgICAvLyB3aGF0IHRoZSBuZXh0IGxlYXN0IHJlY2VudGx5IHVzZWQga2V5IHdpbGwgYmUsIHNvIGp1c3RcbiAgICAgIC8vIGdvIGFoZWFkIGFuZCBzZXQgaXQgbm93LlxuICAgICAgY29uc3QgcHJldiA9IHdhbGtlci5wcmV2XG4gICAgICBkZWwoc2VsZiwgd2Fsa2VyKVxuICAgICAgd2Fsa2VyID0gcHJldlxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBkZWwgPSAoc2VsZiwgbm9kZSkgPT4ge1xuICBpZiAobm9kZSkge1xuICAgIGNvbnN0IGhpdCA9IG5vZGUudmFsdWVcbiAgICBpZiAoc2VsZltESVNQT1NFXSlcbiAgICAgIHNlbGZbRElTUE9TRV0oaGl0LmtleSwgaGl0LnZhbHVlKVxuXG4gICAgc2VsZltMRU5HVEhdIC09IGhpdC5sZW5ndGhcbiAgICBzZWxmW0NBQ0hFXS5kZWxldGUoaGl0LmtleSlcbiAgICBzZWxmW0xSVV9MSVNUXS5yZW1vdmVOb2RlKG5vZGUpXG4gIH1cbn1cblxuY2xhc3MgRW50cnkge1xuICBjb25zdHJ1Y3RvciAoa2V5LCB2YWx1ZSwgbGVuZ3RoLCBub3csIG1heEFnZSkge1xuICAgIHRoaXMua2V5ID0ga2V5XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGhcbiAgICB0aGlzLm5vdyA9IG5vd1xuICAgIHRoaXMubWF4QWdlID0gbWF4QWdlIHx8IDBcbiAgfVxufVxuXG5jb25zdCBmb3JFYWNoU3RlcCA9IChzZWxmLCBmbiwgbm9kZSwgdGhpc3ApID0+IHtcbiAgbGV0IGhpdCA9IG5vZGUudmFsdWVcbiAgaWYgKGlzU3RhbGUoc2VsZiwgaGl0KSkge1xuICAgIGRlbChzZWxmLCBub2RlKVxuICAgIGlmICghc2VsZltBTExPV19TVEFMRV0pXG4gICAgICBoaXQgPSB1bmRlZmluZWRcbiAgfVxuICBpZiAoaGl0KVxuICAgIGZuLmNhbGwodGhpc3AsIGhpdC52YWx1ZSwgaGl0LmtleSwgc2VsZilcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMUlVDYWNoZVxuIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gU2VtVmVyXG5cbnZhciBkZWJ1Z1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiZcbiAgICBwcm9jZXNzLmVudiAmJlxuICAgIHByb2Nlc3MuZW52Lk5PREVfREVCVUcgJiZcbiAgICAvXFxic2VtdmVyXFxiL2kudGVzdChwcm9jZXNzLmVudi5OT0RFX0RFQlVHKSkge1xuICBkZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcbiAgICBhcmdzLnVuc2hpZnQoJ1NFTVZFUicpXG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncylcbiAgfVxufSBlbHNlIHtcbiAgZGVidWcgPSBmdW5jdGlvbiAoKSB7fVxufVxuXG4vLyBOb3RlOiB0aGlzIGlzIHRoZSBzZW12ZXIub3JnIHZlcnNpb24gb2YgdGhlIHNwZWMgdGhhdCBpdCBpbXBsZW1lbnRzXG4vLyBOb3QgbmVjZXNzYXJpbHkgdGhlIHBhY2thZ2UgdmVyc2lvbiBvZiB0aGlzIGNvZGUuXG5leHBvcnRzLlNFTVZFUl9TUEVDX1ZFUlNJT04gPSAnMi4wLjAnXG5cbnZhciBNQVhfTEVOR1RIID0gMjU2XG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSIHx8XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIDkwMDcxOTkyNTQ3NDA5OTFcblxuLy8gTWF4IHNhZmUgc2VnbWVudCBsZW5ndGggZm9yIGNvZXJjaW9uLlxudmFyIE1BWF9TQUZFX0NPTVBPTkVOVF9MRU5HVEggPSAxNlxuXG52YXIgTUFYX1NBRkVfQlVJTERfTEVOR1RIID0gTUFYX0xFTkdUSCAtIDZcblxuLy8gVGhlIGFjdHVhbCByZWdleHBzIGdvIG9uIGV4cG9ydHMucmVcbnZhciByZSA9IGV4cG9ydHMucmUgPSBbXVxudmFyIHNhZmVSZSA9IGV4cG9ydHMuc2FmZVJlID0gW11cbnZhciBzcmMgPSBleHBvcnRzLnNyYyA9IFtdXG52YXIgdCA9IGV4cG9ydHMudG9rZW5zID0ge31cbnZhciBSID0gMFxuXG5mdW5jdGlvbiB0b2sgKG4pIHtcbiAgdFtuXSA9IFIrK1xufVxuXG52YXIgTEVUVEVSREFTSE5VTUJFUiA9ICdbYS16QS1aMC05LV0nXG5cbi8vIFJlcGxhY2Ugc29tZSBncmVlZHkgcmVnZXggdG9rZW5zIHRvIHByZXZlbnQgcmVnZXggZG9zIGlzc3Vlcy4gVGhlc2UgcmVnZXggYXJlXG4vLyB1c2VkIGludGVybmFsbHkgdmlhIHRoZSBzYWZlUmUgb2JqZWN0IHNpbmNlIGFsbCBpbnB1dHMgaW4gdGhpcyBsaWJyYXJ5IGdldFxuLy8gbm9ybWFsaXplZCBmaXJzdCB0byB0cmltIGFuZCBjb2xsYXBzZSBhbGwgZXh0cmEgd2hpdGVzcGFjZS4gVGhlIG9yaWdpbmFsXG4vLyByZWdleGVzIGFyZSBleHBvcnRlZCBmb3IgdXNlcmxhbmQgY29uc3VtcHRpb24gYW5kIGxvd2VyIGxldmVsIHVzYWdlLiBBXG4vLyBmdXR1cmUgYnJlYWtpbmcgY2hhbmdlIGNvdWxkIGV4cG9ydCB0aGUgc2FmZXIgcmVnZXggb25seSB3aXRoIGEgbm90ZSB0aGF0XG4vLyBhbGwgaW5wdXQgc2hvdWxkIGhhdmUgZXh0cmEgd2hpdGVzcGFjZSByZW1vdmVkLlxudmFyIHNhZmVSZWdleFJlcGxhY2VtZW50cyA9IFtcbiAgWydcXFxccycsIDFdLFxuICBbJ1xcXFxkJywgTUFYX0xFTkdUSF0sXG4gIFtMRVRURVJEQVNITlVNQkVSLCBNQVhfU0FGRV9CVUlMRF9MRU5HVEhdLFxuXVxuXG5mdW5jdGlvbiBtYWtlU2FmZVJlICh2YWx1ZSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNhZmVSZWdleFJlcGxhY2VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b2tlbiA9IHNhZmVSZWdleFJlcGxhY2VtZW50c1tpXVswXVxuICAgIHZhciBtYXggPSBzYWZlUmVnZXhSZXBsYWNlbWVudHNbaV1bMV1cbiAgICB2YWx1ZSA9IHZhbHVlXG4gICAgICAuc3BsaXQodG9rZW4gKyAnKicpLmpvaW4odG9rZW4gKyAnezAsJyArIG1heCArICd9JylcbiAgICAgIC5zcGxpdCh0b2tlbiArICcrJykuam9pbih0b2tlbiArICd7MSwnICsgbWF4ICsgJ30nKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vLyBUaGUgZm9sbG93aW5nIFJlZ3VsYXIgRXhwcmVzc2lvbnMgY2FuIGJlIHVzZWQgZm9yIHRva2VuaXppbmcsXG4vLyB2YWxpZGF0aW5nLCBhbmQgcGFyc2luZyBTZW1WZXIgdmVyc2lvbiBzdHJpbmdzLlxuXG4vLyAjIyBOdW1lcmljIElkZW50aWZpZXJcbi8vIEEgc2luZ2xlIGAwYCwgb3IgYSBub24temVybyBkaWdpdCBmb2xsb3dlZCBieSB6ZXJvIG9yIG1vcmUgZGlnaXRzLlxuXG50b2soJ05VTUVSSUNJREVOVElGSUVSJylcbnNyY1t0Lk5VTUVSSUNJREVOVElGSUVSXSA9ICcwfFsxLTldXFxcXGQqJ1xudG9rKCdOVU1FUklDSURFTlRJRklFUkxPT1NFJylcbnNyY1t0Lk5VTUVSSUNJREVOVElGSUVSTE9PU0VdID0gJ1xcXFxkKydcblxuLy8gIyMgTm9uLW51bWVyaWMgSWRlbnRpZmllclxuLy8gWmVybyBvciBtb3JlIGRpZ2l0cywgZm9sbG93ZWQgYnkgYSBsZXR0ZXIgb3IgaHlwaGVuLCBhbmQgdGhlbiB6ZXJvIG9yXG4vLyBtb3JlIGxldHRlcnMsIGRpZ2l0cywgb3IgaHlwaGVucy5cblxudG9rKCdOT05OVU1FUklDSURFTlRJRklFUicpXG5zcmNbdC5OT05OVU1FUklDSURFTlRJRklFUl0gPSAnXFxcXGQqW2EtekEtWi1dJyArIExFVFRFUkRBU0hOVU1CRVIgKyAnKidcblxuLy8gIyMgTWFpbiBWZXJzaW9uXG4vLyBUaHJlZSBkb3Qtc2VwYXJhdGVkIG51bWVyaWMgaWRlbnRpZmllcnMuXG5cbnRvaygnTUFJTlZFUlNJT04nKVxuc3JjW3QuTUFJTlZFUlNJT05dID0gJygnICsgc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJdICsgJylcXFxcLicgK1xuICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSXSArICcpXFxcXC4nICtcbiAgICAgICAgICAgICAgICAgICAnKCcgKyBzcmNbdC5OVU1FUklDSURFTlRJRklFUl0gKyAnKSdcblxudG9rKCdNQUlOVkVSU0lPTkxPT1NFJylcbnNyY1t0Lk1BSU5WRVJTSU9OTE9PU0VdID0gJygnICsgc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gKyAnKVxcXFwuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKCcgKyBzcmNbdC5OVU1FUklDSURFTlRJRklFUkxPT1NFXSArICcpXFxcXC4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSTE9PU0VdICsgJyknXG5cbi8vICMjIFByZS1yZWxlYXNlIFZlcnNpb24gSWRlbnRpZmllclxuLy8gQSBudW1lcmljIGlkZW50aWZpZXIsIG9yIGEgbm9uLW51bWVyaWMgaWRlbnRpZmllci5cblxudG9rKCdQUkVSRUxFQVNFSURFTlRJRklFUicpXG5zcmNbdC5QUkVSRUxFQVNFSURFTlRJRklFUl0gPSAnKD86JyArIHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSXSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3wnICsgc3JjW3QuTk9OTlVNRVJJQ0lERU5USUZJRVJdICsgJyknXG5cbnRvaygnUFJFUkVMRUFTRUlERU5USUZJRVJMT09TRScpXG5zcmNbdC5QUkVSRUxFQVNFSURFTlRJRklFUkxPT1NFXSA9ICcoPzonICsgc3JjW3QuTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3wnICsgc3JjW3QuTk9OTlVNRVJJQ0lERU5USUZJRVJdICsgJyknXG5cbi8vICMjIFByZS1yZWxlYXNlIFZlcnNpb25cbi8vIEh5cGhlbiwgZm9sbG93ZWQgYnkgb25lIG9yIG1vcmUgZG90LXNlcGFyYXRlZCBwcmUtcmVsZWFzZSB2ZXJzaW9uXG4vLyBpZGVudGlmaWVycy5cblxudG9rKCdQUkVSRUxFQVNFJylcbnNyY1t0LlBSRVJFTEVBU0VdID0gJyg/Oi0oJyArIHNyY1t0LlBSRVJFTEVBU0VJREVOVElGSUVSXSArXG4gICAgICAgICAgICAgICAgICAnKD86XFxcXC4nICsgc3JjW3QuUFJFUkVMRUFTRUlERU5USUZJRVJdICsgJykqKSknXG5cbnRvaygnUFJFUkVMRUFTRUxPT1NFJylcbnNyY1t0LlBSRVJFTEVBU0VMT09TRV0gPSAnKD86LT8oJyArIHNyY1t0LlBSRVJFTEVBU0VJREVOVElGSUVSTE9PU0VdICtcbiAgICAgICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuJyArIHNyY1t0LlBSRVJFTEVBU0VJREVOVElGSUVSTE9PU0VdICsgJykqKSknXG5cbi8vICMjIEJ1aWxkIE1ldGFkYXRhIElkZW50aWZpZXJcbi8vIEFueSBjb21iaW5hdGlvbiBvZiBkaWdpdHMsIGxldHRlcnMsIG9yIGh5cGhlbnMuXG5cbnRvaygnQlVJTERJREVOVElGSUVSJylcbnNyY1t0LkJVSUxESURFTlRJRklFUl0gPSBMRVRURVJEQVNITlVNQkVSICsgJysnXG5cbi8vICMjIEJ1aWxkIE1ldGFkYXRhXG4vLyBQbHVzIHNpZ24sIGZvbGxvd2VkIGJ5IG9uZSBvciBtb3JlIHBlcmlvZC1zZXBhcmF0ZWQgYnVpbGQgbWV0YWRhdGFcbi8vIGlkZW50aWZpZXJzLlxuXG50b2soJ0JVSUxEJylcbnNyY1t0LkJVSUxEXSA9ICcoPzpcXFxcKygnICsgc3JjW3QuQlVJTERJREVOVElGSUVSXSArXG4gICAgICAgICAgICAgJyg/OlxcXFwuJyArIHNyY1t0LkJVSUxESURFTlRJRklFUl0gKyAnKSopKSdcblxuLy8gIyMgRnVsbCBWZXJzaW9uIFN0cmluZ1xuLy8gQSBtYWluIHZlcnNpb24sIGZvbGxvd2VkIG9wdGlvbmFsbHkgYnkgYSBwcmUtcmVsZWFzZSB2ZXJzaW9uIGFuZFxuLy8gYnVpbGQgbWV0YWRhdGEuXG5cbi8vIE5vdGUgdGhhdCB0aGUgb25seSBtYWpvciwgbWlub3IsIHBhdGNoLCBhbmQgcHJlLXJlbGVhc2Ugc2VjdGlvbnMgb2Zcbi8vIHRoZSB2ZXJzaW9uIHN0cmluZyBhcmUgY2FwdHVyaW5nIGdyb3Vwcy4gIFRoZSBidWlsZCBtZXRhZGF0YSBpcyBub3QgYVxuLy8gY2FwdHVyaW5nIGdyb3VwLCBiZWNhdXNlIGl0IHNob3VsZCBub3QgZXZlciBiZSB1c2VkIGluIHZlcnNpb25cbi8vIGNvbXBhcmlzb24uXG5cbnRvaygnRlVMTCcpXG50b2soJ0ZVTExQTEFJTicpXG5zcmNbdC5GVUxMUExBSU5dID0gJ3Y/JyArIHNyY1t0Lk1BSU5WRVJTSU9OXSArXG4gICAgICAgICAgICAgICAgICBzcmNbdC5QUkVSRUxFQVNFXSArICc/JyArXG4gICAgICAgICAgICAgICAgICBzcmNbdC5CVUlMRF0gKyAnPydcblxuc3JjW3QuRlVMTF0gPSAnXicgKyBzcmNbdC5GVUxMUExBSU5dICsgJyQnXG5cbi8vIGxpa2UgZnVsbCwgYnV0IGFsbG93cyB2MS4yLjMgYW5kID0xLjIuMywgd2hpY2ggcGVvcGxlIGRvIHNvbWV0aW1lcy5cbi8vIGFsc28sIDEuMC4wYWxwaGExIChwcmVyZWxlYXNlIHdpdGhvdXQgdGhlIGh5cGhlbikgd2hpY2ggaXMgcHJldHR5XG4vLyBjb21tb24gaW4gdGhlIG5wbSByZWdpc3RyeS5cbnRvaygnTE9PU0VQTEFJTicpXG5zcmNbdC5MT09TRVBMQUlOXSA9ICdbdj1cXFxcc10qJyArIHNyY1t0Lk1BSU5WRVJTSU9OTE9PU0VdICtcbiAgICAgICAgICAgICAgICAgIHNyY1t0LlBSRVJFTEVBU0VMT09TRV0gKyAnPycgK1xuICAgICAgICAgICAgICAgICAgc3JjW3QuQlVJTERdICsgJz8nXG5cbnRvaygnTE9PU0UnKVxuc3JjW3QuTE9PU0VdID0gJ14nICsgc3JjW3QuTE9PU0VQTEFJTl0gKyAnJCdcblxudG9rKCdHVExUJylcbnNyY1t0LkdUTFRdID0gJygoPzo8fD4pPz0/KSdcblxuLy8gU29tZXRoaW5nIGxpa2UgXCIyLipcIiBvciBcIjEuMi54XCIuXG4vLyBOb3RlIHRoYXQgXCJ4LnhcIiBpcyBhIHZhbGlkIHhSYW5nZSBpZGVudGlmZXIsIG1lYW5pbmcgXCJhbnkgdmVyc2lvblwiXG4vLyBPbmx5IHRoZSBmaXJzdCBpdGVtIGlzIHN0cmljdGx5IHJlcXVpcmVkLlxudG9rKCdYUkFOR0VJREVOVElGSUVSTE9PU0UnKVxuc3JjW3QuWFJBTkdFSURFTlRJRklFUkxPT1NFXSA9IHNyY1t0Lk5VTUVSSUNJREVOVElGSUVSTE9PU0VdICsgJ3x4fFh8XFxcXConXG50b2soJ1hSQU5HRUlERU5USUZJRVInKVxuc3JjW3QuWFJBTkdFSURFTlRJRklFUl0gPSBzcmNbdC5OVU1FUklDSURFTlRJRklFUl0gKyAnfHh8WHxcXFxcKidcblxudG9rKCdYUkFOR0VQTEFJTicpXG5zcmNbdC5YUkFOR0VQTEFJTl0gPSAnW3Y9XFxcXHNdKignICsgc3JjW3QuWFJBTkdFSURFTlRJRklFUl0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICcoPzpcXFxcLignICsgc3JjW3QuWFJBTkdFSURFTlRJRklFUl0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICcoPzpcXFxcLignICsgc3JjW3QuWFJBTkdFSURFTlRJRklFUl0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICcoPzonICsgc3JjW3QuUFJFUkVMRUFTRV0gKyAnKT8nICtcbiAgICAgICAgICAgICAgICAgICBzcmNbdC5CVUlMRF0gKyAnPycgK1xuICAgICAgICAgICAgICAgICAgICcpPyk/J1xuXG50b2soJ1hSQU5HRVBMQUlOTE9PU0UnKVxuc3JjW3QuWFJBTkdFUExBSU5MT09TRV0gPSAnW3Y9XFxcXHNdKignICsgc3JjW3QuWFJBTkdFSURFTlRJRklFUkxPT1NFXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKD86XFxcXC4oJyArIHNyY1t0LlhSQU5HRUlERU5USUZJRVJMT09TRV0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuKCcgKyBzcmNbdC5YUkFOR0VJREVOVElGSUVSTE9PU0VdICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcoPzonICsgc3JjW3QuUFJFUkVMRUFTRUxPT1NFXSArICcpPycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjW3QuQlVJTERdICsgJz8nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcpPyk/J1xuXG50b2soJ1hSQU5HRScpXG5zcmNbdC5YUkFOR0VdID0gJ14nICsgc3JjW3QuR1RMVF0gKyAnXFxcXHMqJyArIHNyY1t0LlhSQU5HRVBMQUlOXSArICckJ1xudG9rKCdYUkFOR0VMT09TRScpXG5zcmNbdC5YUkFOR0VMT09TRV0gPSAnXicgKyBzcmNbdC5HVExUXSArICdcXFxccyonICsgc3JjW3QuWFJBTkdFUExBSU5MT09TRV0gKyAnJCdcblxuLy8gQ29lcmNpb24uXG4vLyBFeHRyYWN0IGFueXRoaW5nIHRoYXQgY291bGQgY29uY2VpdmFibHkgYmUgYSBwYXJ0IG9mIGEgdmFsaWQgc2VtdmVyXG50b2soJ0NPRVJDRScpXG5zcmNbdC5DT0VSQ0VdID0gJyhefFteXFxcXGRdKScgK1xuICAgICAgICAgICAgICAnKFxcXFxkezEsJyArIE1BWF9TQUZFX0NPTVBPTkVOVF9MRU5HVEggKyAnfSknICtcbiAgICAgICAgICAgICAgJyg/OlxcXFwuKFxcXFxkezEsJyArIE1BWF9TQUZFX0NPTVBPTkVOVF9MRU5HVEggKyAnfSkpPycgK1xuICAgICAgICAgICAgICAnKD86XFxcXC4oXFxcXGR7MSwnICsgTUFYX1NBRkVfQ09NUE9ORU5UX0xFTkdUSCArICd9KSk/JyArXG4gICAgICAgICAgICAgICcoPzokfFteXFxcXGRdKSdcbnRvaygnQ09FUkNFUlRMJylcbnJlW3QuQ09FUkNFUlRMXSA9IG5ldyBSZWdFeHAoc3JjW3QuQ09FUkNFXSwgJ2cnKVxuc2FmZVJlW3QuQ09FUkNFUlRMXSA9IG5ldyBSZWdFeHAobWFrZVNhZmVSZShzcmNbdC5DT0VSQ0VdKSwgJ2cnKVxuXG4vLyBUaWxkZSByYW5nZXMuXG4vLyBNZWFuaW5nIGlzIFwicmVhc29uYWJseSBhdCBvciBncmVhdGVyIHRoYW5cIlxudG9rKCdMT05FVElMREUnKVxuc3JjW3QuTE9ORVRJTERFXSA9ICcoPzp+Pj8pJ1xuXG50b2soJ1RJTERFVFJJTScpXG5zcmNbdC5USUxERVRSSU1dID0gJyhcXFxccyopJyArIHNyY1t0LkxPTkVUSUxERV0gKyAnXFxcXHMrJ1xucmVbdC5USUxERVRSSU1dID0gbmV3IFJlZ0V4cChzcmNbdC5USUxERVRSSU1dLCAnZycpXG5zYWZlUmVbdC5USUxERVRSSU1dID0gbmV3IFJlZ0V4cChtYWtlU2FmZVJlKHNyY1t0LlRJTERFVFJJTV0pLCAnZycpXG52YXIgdGlsZGVUcmltUmVwbGFjZSA9ICckMX4nXG5cbnRvaygnVElMREUnKVxuc3JjW3QuVElMREVdID0gJ14nICsgc3JjW3QuTE9ORVRJTERFXSArIHNyY1t0LlhSQU5HRVBMQUlOXSArICckJ1xudG9rKCdUSUxERUxPT1NFJylcbnNyY1t0LlRJTERFTE9PU0VdID0gJ14nICsgc3JjW3QuTE9ORVRJTERFXSArIHNyY1t0LlhSQU5HRVBMQUlOTE9PU0VdICsgJyQnXG5cbi8vIENhcmV0IHJhbmdlcy5cbi8vIE1lYW5pbmcgaXMgXCJhdCBsZWFzdCBhbmQgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aFwiXG50b2soJ0xPTkVDQVJFVCcpXG5zcmNbdC5MT05FQ0FSRVRdID0gJyg/OlxcXFxeKSdcblxudG9rKCdDQVJFVFRSSU0nKVxuc3JjW3QuQ0FSRVRUUklNXSA9ICcoXFxcXHMqKScgKyBzcmNbdC5MT05FQ0FSRVRdICsgJ1xcXFxzKydcbnJlW3QuQ0FSRVRUUklNXSA9IG5ldyBSZWdFeHAoc3JjW3QuQ0FSRVRUUklNXSwgJ2cnKVxuc2FmZVJlW3QuQ0FSRVRUUklNXSA9IG5ldyBSZWdFeHAobWFrZVNhZmVSZShzcmNbdC5DQVJFVFRSSU1dKSwgJ2cnKVxudmFyIGNhcmV0VHJpbVJlcGxhY2UgPSAnJDFeJ1xuXG50b2soJ0NBUkVUJylcbnNyY1t0LkNBUkVUXSA9ICdeJyArIHNyY1t0LkxPTkVDQVJFVF0gKyBzcmNbdC5YUkFOR0VQTEFJTl0gKyAnJCdcbnRvaygnQ0FSRVRMT09TRScpXG5zcmNbdC5DQVJFVExPT1NFXSA9ICdeJyArIHNyY1t0LkxPTkVDQVJFVF0gKyBzcmNbdC5YUkFOR0VQTEFJTkxPT1NFXSArICckJ1xuXG4vLyBBIHNpbXBsZSBndC9sdC9lcSB0aGluZywgb3IganVzdCBcIlwiIHRvIGluZGljYXRlIFwiYW55IHZlcnNpb25cIlxudG9rKCdDT01QQVJBVE9STE9PU0UnKVxuc3JjW3QuQ09NUEFSQVRPUkxPT1NFXSA9ICdeJyArIHNyY1t0LkdUTFRdICsgJ1xcXFxzKignICsgc3JjW3QuTE9PU0VQTEFJTl0gKyAnKSR8XiQnXG50b2soJ0NPTVBBUkFUT1InKVxuc3JjW3QuQ09NUEFSQVRPUl0gPSAnXicgKyBzcmNbdC5HVExUXSArICdcXFxccyooJyArIHNyY1t0LkZVTExQTEFJTl0gKyAnKSR8XiQnXG5cbi8vIEFuIGV4cHJlc3Npb24gdG8gc3RyaXAgYW55IHdoaXRlc3BhY2UgYmV0d2VlbiB0aGUgZ3RsdCBhbmQgdGhlIHRoaW5nXG4vLyBpdCBtb2RpZmllcywgc28gdGhhdCBgPiAxLjIuM2AgPT0+IGA+MS4yLjNgXG50b2soJ0NPTVBBUkFUT1JUUklNJylcbnNyY1t0LkNPTVBBUkFUT1JUUklNXSA9ICcoXFxcXHMqKScgKyBzcmNbdC5HVExUXSArXG4gICAgICAgICAgICAgICAgICAgICAgJ1xcXFxzKignICsgc3JjW3QuTE9PU0VQTEFJTl0gKyAnfCcgKyBzcmNbdC5YUkFOR0VQTEFJTl0gKyAnKSdcblxuLy8gdGhpcyBvbmUgaGFzIHRvIHVzZSB0aGUgL2cgZmxhZ1xucmVbdC5DT01QQVJBVE9SVFJJTV0gPSBuZXcgUmVnRXhwKHNyY1t0LkNPTVBBUkFUT1JUUklNXSwgJ2cnKVxuc2FmZVJlW3QuQ09NUEFSQVRPUlRSSU1dID0gbmV3IFJlZ0V4cChtYWtlU2FmZVJlKHNyY1t0LkNPTVBBUkFUT1JUUklNXSksICdnJylcbnZhciBjb21wYXJhdG9yVHJpbVJlcGxhY2UgPSAnJDEkMiQzJ1xuXG4vLyBTb21ldGhpbmcgbGlrZSBgMS4yLjMgLSAxLjIuNGBcbi8vIE5vdGUgdGhhdCB0aGVzZSBhbGwgdXNlIHRoZSBsb29zZSBmb3JtLCBiZWNhdXNlIHRoZXknbGwgYmVcbi8vIGNoZWNrZWQgYWdhaW5zdCBlaXRoZXIgdGhlIHN0cmljdCBvciBsb29zZSBjb21wYXJhdG9yIGZvcm1cbi8vIGxhdGVyLlxudG9rKCdIWVBIRU5SQU5HRScpXG5zcmNbdC5IWVBIRU5SQU5HRV0gPSAnXlxcXFxzKignICsgc3JjW3QuWFJBTkdFUExBSU5dICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAnXFxcXHMrLVxcXFxzKycgK1xuICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1t0LlhSQU5HRVBMQUlOXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgJ1xcXFxzKiQnXG5cbnRvaygnSFlQSEVOUkFOR0VMT09TRScpXG5zcmNbdC5IWVBIRU5SQU5HRUxPT1NFXSA9ICdeXFxcXHMqKCcgKyBzcmNbdC5YUkFOR0VQTEFJTkxPT1NFXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxcXHMrLVxcXFxzKycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgc3JjW3QuWFJBTkdFUExBSU5MT09TRV0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcXFxzKiQnXG5cbi8vIFN0YXIgcmFuZ2VzIGJhc2ljYWxseSBqdXN0IGFsbG93IGFueXRoaW5nIGF0IGFsbC5cbnRvaygnU1RBUicpXG5zcmNbdC5TVEFSXSA9ICcoPHw+KT89P1xcXFxzKlxcXFwqJ1xuXG4vLyBDb21waWxlIHRvIGFjdHVhbCByZWdleHAgb2JqZWN0cy5cbi8vIEFsbCBhcmUgZmxhZy1mcmVlLCB1bmxlc3MgdGhleSB3ZXJlIGNyZWF0ZWQgYWJvdmUgd2l0aCBhIGZsYWcuXG5mb3IgKHZhciBpID0gMDsgaSA8IFI7IGkrKykge1xuICBkZWJ1ZyhpLCBzcmNbaV0pXG4gIGlmICghcmVbaV0pIHtcbiAgICByZVtpXSA9IG5ldyBSZWdFeHAoc3JjW2ldKVxuXG4gICAgLy8gUmVwbGFjZSBhbGwgZ3JlZWR5IHdoaXRlc3BhY2UgdG8gcHJldmVudCByZWdleCBkb3MgaXNzdWVzLiBUaGVzZSByZWdleCBhcmVcbiAgICAvLyB1c2VkIGludGVybmFsbHkgdmlhIHRoZSBzYWZlUmUgb2JqZWN0IHNpbmNlIGFsbCBpbnB1dHMgaW4gdGhpcyBsaWJyYXJ5IGdldFxuICAgIC8vIG5vcm1hbGl6ZWQgZmlyc3QgdG8gdHJpbSBhbmQgY29sbGFwc2UgYWxsIGV4dHJhIHdoaXRlc3BhY2UuIFRoZSBvcmlnaW5hbFxuICAgIC8vIHJlZ2V4ZXMgYXJlIGV4cG9ydGVkIGZvciB1c2VybGFuZCBjb25zdW1wdGlvbiBhbmQgbG93ZXIgbGV2ZWwgdXNhZ2UuIEFcbiAgICAvLyBmdXR1cmUgYnJlYWtpbmcgY2hhbmdlIGNvdWxkIGV4cG9ydCB0aGUgc2FmZXIgcmVnZXggb25seSB3aXRoIGEgbm90ZSB0aGF0XG4gICAgLy8gYWxsIGlucHV0IHNob3VsZCBoYXZlIGV4dHJhIHdoaXRlc3BhY2UgcmVtb3ZlZC5cbiAgICBzYWZlUmVbaV0gPSBuZXcgUmVnRXhwKG1ha2VTYWZlUmUoc3JjW2ldKSlcbiAgfVxufVxuXG5leHBvcnRzLnBhcnNlID0gcGFyc2VcbmZ1bmN0aW9uIHBhcnNlICh2ZXJzaW9uLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgbG9vc2U6ICEhb3B0aW9ucyxcbiAgICAgIGluY2x1ZGVQcmVyZWxlYXNlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlmICh2ZXJzaW9uIGluc3RhbmNlb2YgU2VtVmVyKSB7XG4gICAgcmV0dXJuIHZlcnNpb25cbiAgfVxuXG4gIGlmICh0eXBlb2YgdmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgaWYgKHZlcnNpb24ubGVuZ3RoID4gTUFYX0xFTkdUSCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICB2YXIgciA9IG9wdGlvbnMubG9vc2UgPyBzYWZlUmVbdC5MT09TRV0gOiBzYWZlUmVbdC5GVUxMXVxuICBpZiAoIXIudGVzdCh2ZXJzaW9uKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiBuZXcgU2VtVmVyKHZlcnNpb24sIG9wdGlvbnMpXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnRzLnZhbGlkID0gdmFsaWRcbmZ1bmN0aW9uIHZhbGlkICh2ZXJzaW9uLCBvcHRpb25zKSB7XG4gIHZhciB2ID0gcGFyc2UodmVyc2lvbiwgb3B0aW9ucylcbiAgcmV0dXJuIHYgPyB2LnZlcnNpb24gOiBudWxsXG59XG5cbmV4cG9ydHMuY2xlYW4gPSBjbGVhblxuZnVuY3Rpb24gY2xlYW4gKHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgdmFyIHMgPSBwYXJzZSh2ZXJzaW9uLnRyaW0oKS5yZXBsYWNlKC9eWz12XSsvLCAnJyksIG9wdGlvbnMpXG4gIHJldHVybiBzID8gcy52ZXJzaW9uIDogbnVsbFxufVxuXG5leHBvcnRzLlNlbVZlciA9IFNlbVZlclxuXG5mdW5jdGlvbiBTZW1WZXIgKHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zIHx8IHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBsb29zZTogISFvcHRpb25zLFxuICAgICAgaW5jbHVkZVByZXJlbGVhc2U6IGZhbHNlXG4gICAgfVxuICB9XG4gIGlmICh2ZXJzaW9uIGluc3RhbmNlb2YgU2VtVmVyKSB7XG4gICAgaWYgKHZlcnNpb24ubG9vc2UgPT09IG9wdGlvbnMubG9vc2UpIHtcbiAgICAgIHJldHVybiB2ZXJzaW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnZlcnNpb25cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZlcnNpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBWZXJzaW9uOiAnICsgdmVyc2lvbilcbiAgfVxuXG4gIGlmICh2ZXJzaW9uLmxlbmd0aCA+IE1BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2ZXJzaW9uIGlzIGxvbmdlciB0aGFuICcgKyBNQVhfTEVOR1RIICsgJyBjaGFyYWN0ZXJzJylcbiAgfVxuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTZW1WZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBTZW1WZXIodmVyc2lvbiwgb3B0aW9ucylcbiAgfVxuXG4gIGRlYnVnKCdTZW1WZXInLCB2ZXJzaW9uLCBvcHRpb25zKVxuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIHRoaXMubG9vc2UgPSAhIW9wdGlvbnMubG9vc2VcblxuICB2YXIgbSA9IHZlcnNpb24udHJpbSgpLm1hdGNoKG9wdGlvbnMubG9vc2UgPyBzYWZlUmVbdC5MT09TRV0gOiBzYWZlUmVbdC5GVUxMXSlcblxuICBpZiAoIW0pIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIFZlcnNpb246ICcgKyB2ZXJzaW9uKVxuICB9XG5cbiAgdGhpcy5yYXcgPSB2ZXJzaW9uXG5cbiAgLy8gdGhlc2UgYXJlIGFjdHVhbGx5IG51bWJlcnNcbiAgdGhpcy5tYWpvciA9ICttWzFdXG4gIHRoaXMubWlub3IgPSArbVsyXVxuICB0aGlzLnBhdGNoID0gK21bM11cblxuICBpZiAodGhpcy5tYWpvciA+IE1BWF9TQUZFX0lOVEVHRVIgfHwgdGhpcy5tYWpvciA8IDApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG1ham9yIHZlcnNpb24nKVxuICB9XG5cbiAgaWYgKHRoaXMubWlub3IgPiBNQVhfU0FGRV9JTlRFR0VSIHx8IHRoaXMubWlub3IgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBtaW5vciB2ZXJzaW9uJylcbiAgfVxuXG4gIGlmICh0aGlzLnBhdGNoID4gTUFYX1NBRkVfSU5URUdFUiB8fCB0aGlzLnBhdGNoIDwgMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgcGF0Y2ggdmVyc2lvbicpXG4gIH1cblxuICAvLyBudW1iZXJpZnkgYW55IHByZXJlbGVhc2UgbnVtZXJpYyBpZHNcbiAgaWYgKCFtWzRdKSB7XG4gICAgdGhpcy5wcmVyZWxlYXNlID0gW11cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByZXJlbGVhc2UgPSBtWzRdLnNwbGl0KCcuJykubWFwKGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKC9eWzAtOV0rJC8udGVzdChpZCkpIHtcbiAgICAgICAgdmFyIG51bSA9ICtpZFxuICAgICAgICBpZiAobnVtID49IDAgJiYgbnVtIDwgTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgICAgIHJldHVybiBudW1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlkXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMuYnVpbGQgPSBtWzVdID8gbVs1XS5zcGxpdCgnLicpIDogW11cbiAgdGhpcy5mb3JtYXQoKVxufVxuXG5TZW1WZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy52ZXJzaW9uID0gdGhpcy5tYWpvciArICcuJyArIHRoaXMubWlub3IgKyAnLicgKyB0aGlzLnBhdGNoXG4gIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoKSB7XG4gICAgdGhpcy52ZXJzaW9uICs9ICctJyArIHRoaXMucHJlcmVsZWFzZS5qb2luKCcuJylcbiAgfVxuICByZXR1cm4gdGhpcy52ZXJzaW9uXG59XG5cblNlbVZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnZlcnNpb25cbn1cblxuU2VtVmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gIGRlYnVnKCdTZW1WZXIuY29tcGFyZScsIHRoaXMudmVyc2lvbiwgdGhpcy5vcHRpb25zLCBvdGhlcilcbiAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBTZW1WZXIpKSB7XG4gICAgb3RoZXIgPSBuZXcgU2VtVmVyKG90aGVyLCB0aGlzLm9wdGlvbnMpXG4gIH1cblxuICByZXR1cm4gdGhpcy5jb21wYXJlTWFpbihvdGhlcikgfHwgdGhpcy5jb21wYXJlUHJlKG90aGVyKVxufVxuXG5TZW1WZXIucHJvdG90eXBlLmNvbXBhcmVNYWluID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gIGlmICghKG90aGVyIGluc3RhbmNlb2YgU2VtVmVyKSkge1xuICAgIG90aGVyID0gbmV3IFNlbVZlcihvdGhlciwgdGhpcy5vcHRpb25zKVxuICB9XG5cbiAgcmV0dXJuIGNvbXBhcmVJZGVudGlmaWVycyh0aGlzLm1ham9yLCBvdGhlci5tYWpvcikgfHxcbiAgICAgICAgIGNvbXBhcmVJZGVudGlmaWVycyh0aGlzLm1pbm9yLCBvdGhlci5taW5vcikgfHxcbiAgICAgICAgIGNvbXBhcmVJZGVudGlmaWVycyh0aGlzLnBhdGNoLCBvdGhlci5wYXRjaClcbn1cblxuU2VtVmVyLnByb3RvdHlwZS5jb21wYXJlUHJlID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gIGlmICghKG90aGVyIGluc3RhbmNlb2YgU2VtVmVyKSkge1xuICAgIG90aGVyID0gbmV3IFNlbVZlcihvdGhlciwgdGhpcy5vcHRpb25zKVxuICB9XG5cbiAgLy8gTk9UIGhhdmluZyBhIHByZXJlbGVhc2UgaXMgPiBoYXZpbmcgb25lXG4gIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoICYmICFvdGhlci5wcmVyZWxlYXNlLmxlbmd0aCkge1xuICAgIHJldHVybiAtMVxuICB9IGVsc2UgaWYgKCF0aGlzLnByZXJlbGVhc2UubGVuZ3RoICYmIG90aGVyLnByZXJlbGVhc2UubGVuZ3RoKSB7XG4gICAgcmV0dXJuIDFcbiAgfSBlbHNlIGlmICghdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCAmJiAhb3RoZXIucHJlcmVsZWFzZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIGRvIHtcbiAgICB2YXIgYSA9IHRoaXMucHJlcmVsZWFzZVtpXVxuICAgIHZhciBiID0gb3RoZXIucHJlcmVsZWFzZVtpXVxuICAgIGRlYnVnKCdwcmVyZWxlYXNlIGNvbXBhcmUnLCBpLCBhLCBiKVxuICAgIGlmIChhID09PSB1bmRlZmluZWQgJiYgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gMFxuICAgIH0gZWxzZSBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gMVxuICAgIH0gZWxzZSBpZiAoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9IGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb21wYXJlSWRlbnRpZmllcnMoYSwgYilcbiAgICB9XG4gIH0gd2hpbGUgKCsraSlcbn1cblxuU2VtVmVyLnByb3RvdHlwZS5jb21wYXJlQnVpbGQgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBTZW1WZXIpKSB7XG4gICAgb3RoZXIgPSBuZXcgU2VtVmVyKG90aGVyLCB0aGlzLm9wdGlvbnMpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgZG8ge1xuICAgIHZhciBhID0gdGhpcy5idWlsZFtpXVxuICAgIHZhciBiID0gb3RoZXIuYnVpbGRbaV1cbiAgICBkZWJ1ZygncHJlcmVsZWFzZSBjb21wYXJlJywgaSwgYSwgYilcbiAgICBpZiAoYSA9PT0gdW5kZWZpbmVkICYmIGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIDBcbiAgICB9IGVsc2UgaWYgKGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIDFcbiAgICB9IGVsc2UgaWYgKGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfSBlbHNlIGlmIChhID09PSBiKSB7XG4gICAgICBjb250aW51ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29tcGFyZUlkZW50aWZpZXJzKGEsIGIpXG4gICAgfVxuICB9IHdoaWxlICgrK2kpXG59XG5cbi8vIHByZW1pbm9yIHdpbGwgYnVtcCB0aGUgdmVyc2lvbiB1cCB0byB0aGUgbmV4dCBtaW5vciByZWxlYXNlLCBhbmQgaW1tZWRpYXRlbHlcbi8vIGRvd24gdG8gcHJlLXJlbGVhc2UuIHByZW1ham9yIGFuZCBwcmVwYXRjaCB3b3JrIHRoZSBzYW1lIHdheS5cblNlbVZlci5wcm90b3R5cGUuaW5jID0gZnVuY3Rpb24gKHJlbGVhc2UsIGlkZW50aWZpZXIpIHtcbiAgc3dpdGNoIChyZWxlYXNlKSB7XG4gICAgY2FzZSAncHJlbWFqb3InOlxuICAgICAgdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9IDBcbiAgICAgIHRoaXMucGF0Y2ggPSAwXG4gICAgICB0aGlzLm1pbm9yID0gMFxuICAgICAgdGhpcy5tYWpvcisrXG4gICAgICB0aGlzLmluYygncHJlJywgaWRlbnRpZmllcilcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAncHJlbWlub3InOlxuICAgICAgdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9IDBcbiAgICAgIHRoaXMucGF0Y2ggPSAwXG4gICAgICB0aGlzLm1pbm9yKytcbiAgICAgIHRoaXMuaW5jKCdwcmUnLCBpZGVudGlmaWVyKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdwcmVwYXRjaCc6XG4gICAgICAvLyBJZiB0aGlzIGlzIGFscmVhZHkgYSBwcmVyZWxlYXNlLCBpdCB3aWxsIGJ1bXAgdG8gdGhlIG5leHQgdmVyc2lvblxuICAgICAgLy8gZHJvcCBhbnkgcHJlcmVsZWFzZXMgdGhhdCBtaWdodCBhbHJlYWR5IGV4aXN0LCBzaW5jZSB0aGV5IGFyZSBub3RcbiAgICAgIC8vIHJlbGV2YW50IGF0IHRoaXMgcG9pbnQuXG4gICAgICB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID0gMFxuICAgICAgdGhpcy5pbmMoJ3BhdGNoJywgaWRlbnRpZmllcilcbiAgICAgIHRoaXMuaW5jKCdwcmUnLCBpZGVudGlmaWVyKVxuICAgICAgYnJlYWtcbiAgICAvLyBJZiB0aGUgaW5wdXQgaXMgYSBub24tcHJlcmVsZWFzZSB2ZXJzaW9uLCB0aGlzIGFjdHMgdGhlIHNhbWUgYXNcbiAgICAvLyBwcmVwYXRjaC5cbiAgICBjYXNlICdwcmVyZWxlYXNlJzpcbiAgICAgIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuaW5jKCdwYXRjaCcsIGlkZW50aWZpZXIpXG4gICAgICB9XG4gICAgICB0aGlzLmluYygncHJlJywgaWRlbnRpZmllcilcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdtYWpvcic6XG4gICAgICAvLyBJZiB0aGlzIGlzIGEgcHJlLW1ham9yIHZlcnNpb24sIGJ1bXAgdXAgdG8gdGhlIHNhbWUgbWFqb3IgdmVyc2lvbi5cbiAgICAgIC8vIE90aGVyd2lzZSBpbmNyZW1lbnQgbWFqb3IuXG4gICAgICAvLyAxLjAuMC01IGJ1bXBzIHRvIDEuMC4wXG4gICAgICAvLyAxLjEuMCBidW1wcyB0byAyLjAuMFxuICAgICAgaWYgKHRoaXMubWlub3IgIT09IDAgfHxcbiAgICAgICAgICB0aGlzLnBhdGNoICE9PSAwIHx8XG4gICAgICAgICAgdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLm1ham9yKytcbiAgICAgIH1cbiAgICAgIHRoaXMubWlub3IgPSAwXG4gICAgICB0aGlzLnBhdGNoID0gMFxuICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW11cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnbWlub3InOlxuICAgICAgLy8gSWYgdGhpcyBpcyBhIHByZS1taW5vciB2ZXJzaW9uLCBidW1wIHVwIHRvIHRoZSBzYW1lIG1pbm9yIHZlcnNpb24uXG4gICAgICAvLyBPdGhlcndpc2UgaW5jcmVtZW50IG1pbm9yLlxuICAgICAgLy8gMS4yLjAtNSBidW1wcyB0byAxLjIuMFxuICAgICAgLy8gMS4yLjEgYnVtcHMgdG8gMS4zLjBcbiAgICAgIGlmICh0aGlzLnBhdGNoICE9PSAwIHx8IHRoaXMucHJlcmVsZWFzZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5taW5vcisrXG4gICAgICB9XG4gICAgICB0aGlzLnBhdGNoID0gMFxuICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW11cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAncGF0Y2gnOlxuICAgICAgLy8gSWYgdGhpcyBpcyBub3QgYSBwcmUtcmVsZWFzZSB2ZXJzaW9uLCBpdCB3aWxsIGluY3JlbWVudCB0aGUgcGF0Y2guXG4gICAgICAvLyBJZiBpdCBpcyBhIHByZS1yZWxlYXNlIGl0IHdpbGwgYnVtcCB1cCB0byB0aGUgc2FtZSBwYXRjaCB2ZXJzaW9uLlxuICAgICAgLy8gMS4yLjAtNSBwYXRjaGVzIHRvIDEuMi4wXG4gICAgICAvLyAxLjIuMCBwYXRjaGVzIHRvIDEuMi4xXG4gICAgICBpZiAodGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnBhdGNoKytcbiAgICAgIH1cbiAgICAgIHRoaXMucHJlcmVsZWFzZSA9IFtdXG4gICAgICBicmVha1xuICAgIC8vIFRoaXMgcHJvYmFibHkgc2hvdWxkbid0IGJlIHVzZWQgcHVibGljbHkuXG4gICAgLy8gMS4wLjAgXCJwcmVcIiB3b3VsZCBiZWNvbWUgMS4wLjAtMCB3aGljaCBpcyB0aGUgd3JvbmcgZGlyZWN0aW9uLlxuICAgIGNhc2UgJ3ByZSc6XG4gICAgICBpZiAodGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnByZXJlbGVhc2UgPSBbMF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5wcmVyZWxlYXNlLmxlbmd0aFxuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJlcmVsZWFzZVtpXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMucHJlcmVsZWFzZVtpXSsrXG4gICAgICAgICAgICBpID0gLTJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IC0xKSB7XG4gICAgICAgICAgLy8gZGlkbid0IGluY3JlbWVudCBhbnl0aGluZ1xuICAgICAgICAgIHRoaXMucHJlcmVsZWFzZS5wdXNoKDApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpZGVudGlmaWVyKSB7XG4gICAgICAgIC8vIDEuMi4wLWJldGEuMSBidW1wcyB0byAxLjIuMC1iZXRhLjIsXG4gICAgICAgIC8vIDEuMi4wLWJldGEuZm9vYmx6IG9yIDEuMi4wLWJldGEgYnVtcHMgdG8gMS4yLjAtYmV0YS4wXG4gICAgICAgIGlmICh0aGlzLnByZXJlbGVhc2VbMF0gPT09IGlkZW50aWZpZXIpIHtcbiAgICAgICAgICBpZiAoaXNOYU4odGhpcy5wcmVyZWxlYXNlWzFdKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW2lkZW50aWZpZXIsIDBdXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJlcmVsZWFzZSA9IFtpZGVudGlmaWVyLCAwXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBpbmNyZW1lbnQgYXJndW1lbnQ6ICcgKyByZWxlYXNlKVxuICB9XG4gIHRoaXMuZm9ybWF0KClcbiAgdGhpcy5yYXcgPSB0aGlzLnZlcnNpb25cbiAgcmV0dXJuIHRoaXNcbn1cblxuZXhwb3J0cy5pbmMgPSBpbmNcbmZ1bmN0aW9uIGluYyAodmVyc2lvbiwgcmVsZWFzZSwgbG9vc2UsIGlkZW50aWZpZXIpIHtcbiAgaWYgKHR5cGVvZiAobG9vc2UpID09PSAnc3RyaW5nJykge1xuICAgIGlkZW50aWZpZXIgPSBsb29zZVxuICAgIGxvb3NlID0gdW5kZWZpbmVkXG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiBuZXcgU2VtVmVyKHZlcnNpb24sIGxvb3NlKS5pbmMocmVsZWFzZSwgaWRlbnRpZmllcikudmVyc2lvblxuICB9IGNhdGNoIChlcikge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuZXhwb3J0cy5kaWZmID0gZGlmZlxuZnVuY3Rpb24gZGlmZiAodmVyc2lvbjEsIHZlcnNpb24yKSB7XG4gIGlmIChlcSh2ZXJzaW9uMSwgdmVyc2lvbjIpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfSBlbHNlIHtcbiAgICB2YXIgdjEgPSBwYXJzZSh2ZXJzaW9uMSlcbiAgICB2YXIgdjIgPSBwYXJzZSh2ZXJzaW9uMilcbiAgICB2YXIgcHJlZml4ID0gJydcbiAgICBpZiAodjEucHJlcmVsZWFzZS5sZW5ndGggfHwgdjIucHJlcmVsZWFzZS5sZW5ndGgpIHtcbiAgICAgIHByZWZpeCA9ICdwcmUnXG4gICAgICB2YXIgZGVmYXVsdFJlc3VsdCA9ICdwcmVyZWxlYXNlJ1xuICAgIH1cbiAgICBmb3IgKHZhciBrZXkgaW4gdjEpIHtcbiAgICAgIGlmIChrZXkgPT09ICdtYWpvcicgfHwga2V5ID09PSAnbWlub3InIHx8IGtleSA9PT0gJ3BhdGNoJykge1xuICAgICAgICBpZiAodjFba2V5XSAhPT0gdjJba2V5XSkge1xuICAgICAgICAgIHJldHVybiBwcmVmaXggKyBrZXlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFJlc3VsdCAvLyBtYXkgYmUgdW5kZWZpbmVkXG4gIH1cbn1cblxuZXhwb3J0cy5jb21wYXJlSWRlbnRpZmllcnMgPSBjb21wYXJlSWRlbnRpZmllcnNcblxudmFyIG51bWVyaWMgPSAvXlswLTldKyQvXG5mdW5jdGlvbiBjb21wYXJlSWRlbnRpZmllcnMgKGEsIGIpIHtcbiAgdmFyIGFudW0gPSBudW1lcmljLnRlc3QoYSlcbiAgdmFyIGJudW0gPSBudW1lcmljLnRlc3QoYilcblxuICBpZiAoYW51bSAmJiBibnVtKSB7XG4gICAgYSA9ICthXG4gICAgYiA9ICtiXG4gIH1cblxuICByZXR1cm4gYSA9PT0gYiA/IDBcbiAgICA6IChhbnVtICYmICFibnVtKSA/IC0xXG4gICAgOiAoYm51bSAmJiAhYW51bSkgPyAxXG4gICAgOiBhIDwgYiA/IC0xXG4gICAgOiAxXG59XG5cbmV4cG9ydHMucmNvbXBhcmVJZGVudGlmaWVycyA9IHJjb21wYXJlSWRlbnRpZmllcnNcbmZ1bmN0aW9uIHJjb21wYXJlSWRlbnRpZmllcnMgKGEsIGIpIHtcbiAgcmV0dXJuIGNvbXBhcmVJZGVudGlmaWVycyhiLCBhKVxufVxuXG5leHBvcnRzLm1ham9yID0gbWFqb3JcbmZ1bmN0aW9uIG1ham9yIChhLCBsb29zZSkge1xuICByZXR1cm4gbmV3IFNlbVZlcihhLCBsb29zZSkubWFqb3Jcbn1cblxuZXhwb3J0cy5taW5vciA9IG1pbm9yXG5mdW5jdGlvbiBtaW5vciAoYSwgbG9vc2UpIHtcbiAgcmV0dXJuIG5ldyBTZW1WZXIoYSwgbG9vc2UpLm1pbm9yXG59XG5cbmV4cG9ydHMucGF0Y2ggPSBwYXRjaFxuZnVuY3Rpb24gcGF0Y2ggKGEsIGxvb3NlKSB7XG4gIHJldHVybiBuZXcgU2VtVmVyKGEsIGxvb3NlKS5wYXRjaFxufVxuXG5leHBvcnRzLmNvbXBhcmUgPSBjb21wYXJlXG5mdW5jdGlvbiBjb21wYXJlIChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gbmV3IFNlbVZlcihhLCBsb29zZSkuY29tcGFyZShuZXcgU2VtVmVyKGIsIGxvb3NlKSlcbn1cblxuZXhwb3J0cy5jb21wYXJlTG9vc2UgPSBjb21wYXJlTG9vc2VcbmZ1bmN0aW9uIGNvbXBhcmVMb29zZSAoYSwgYikge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCB0cnVlKVxufVxuXG5leHBvcnRzLmNvbXBhcmVCdWlsZCA9IGNvbXBhcmVCdWlsZFxuZnVuY3Rpb24gY29tcGFyZUJ1aWxkIChhLCBiLCBsb29zZSkge1xuICB2YXIgdmVyc2lvbkEgPSBuZXcgU2VtVmVyKGEsIGxvb3NlKVxuICB2YXIgdmVyc2lvbkIgPSBuZXcgU2VtVmVyKGIsIGxvb3NlKVxuICByZXR1cm4gdmVyc2lvbkEuY29tcGFyZSh2ZXJzaW9uQikgfHwgdmVyc2lvbkEuY29tcGFyZUJ1aWxkKHZlcnNpb25CKVxufVxuXG5leHBvcnRzLnJjb21wYXJlID0gcmNvbXBhcmVcbmZ1bmN0aW9uIHJjb21wYXJlIChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShiLCBhLCBsb29zZSlcbn1cblxuZXhwb3J0cy5zb3J0ID0gc29ydFxuZnVuY3Rpb24gc29ydCAobGlzdCwgbG9vc2UpIHtcbiAgcmV0dXJuIGxpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBleHBvcnRzLmNvbXBhcmVCdWlsZChhLCBiLCBsb29zZSlcbiAgfSlcbn1cblxuZXhwb3J0cy5yc29ydCA9IHJzb3J0XG5mdW5jdGlvbiByc29ydCAobGlzdCwgbG9vc2UpIHtcbiAgcmV0dXJuIGxpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBleHBvcnRzLmNvbXBhcmVCdWlsZChiLCBhLCBsb29zZSlcbiAgfSlcbn1cblxuZXhwb3J0cy5ndCA9IGd0XG5mdW5jdGlvbiBndCAoYSwgYiwgbG9vc2UpIHtcbiAgcmV0dXJuIGNvbXBhcmUoYSwgYiwgbG9vc2UpID4gMFxufVxuXG5leHBvcnRzLmx0ID0gbHRcbmZ1bmN0aW9uIGx0IChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPCAwXG59XG5cbmV4cG9ydHMuZXEgPSBlcVxuZnVuY3Rpb24gZXEgKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGEsIGIsIGxvb3NlKSA9PT0gMFxufVxuXG5leHBvcnRzLm5lcSA9IG5lcVxuZnVuY3Rpb24gbmVxIChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgIT09IDBcbn1cblxuZXhwb3J0cy5ndGUgPSBndGVcbmZ1bmN0aW9uIGd0ZSAoYSwgYiwgbG9vc2UpIHtcbiAgcmV0dXJuIGNvbXBhcmUoYSwgYiwgbG9vc2UpID49IDBcbn1cblxuZXhwb3J0cy5sdGUgPSBsdGVcbmZ1bmN0aW9uIGx0ZSAoYSwgYiwgbG9vc2UpIHtcbiAgcmV0dXJuIGNvbXBhcmUoYSwgYiwgbG9vc2UpIDw9IDBcbn1cblxuZXhwb3J0cy5jbXAgPSBjbXBcbmZ1bmN0aW9uIGNtcCAoYSwgb3AsIGIsIGxvb3NlKSB7XG4gIHN3aXRjaCAob3ApIHtcbiAgICBjYXNlICc9PT0nOlxuICAgICAgaWYgKHR5cGVvZiBhID09PSAnb2JqZWN0JylcbiAgICAgICAgYSA9IGEudmVyc2lvblxuICAgICAgaWYgKHR5cGVvZiBiID09PSAnb2JqZWN0JylcbiAgICAgICAgYiA9IGIudmVyc2lvblxuICAgICAgcmV0dXJuIGEgPT09IGJcblxuICAgIGNhc2UgJyE9PSc6XG4gICAgICBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKVxuICAgICAgICBhID0gYS52ZXJzaW9uXG4gICAgICBpZiAodHlwZW9mIGIgPT09ICdvYmplY3QnKVxuICAgICAgICBiID0gYi52ZXJzaW9uXG4gICAgICByZXR1cm4gYSAhPT0gYlxuXG4gICAgY2FzZSAnJzpcbiAgICBjYXNlICc9JzpcbiAgICBjYXNlICc9PSc6XG4gICAgICByZXR1cm4gZXEoYSwgYiwgbG9vc2UpXG5cbiAgICBjYXNlICchPSc6XG4gICAgICByZXR1cm4gbmVxKGEsIGIsIGxvb3NlKVxuXG4gICAgY2FzZSAnPic6XG4gICAgICByZXR1cm4gZ3QoYSwgYiwgbG9vc2UpXG5cbiAgICBjYXNlICc+PSc6XG4gICAgICByZXR1cm4gZ3RlKGEsIGIsIGxvb3NlKVxuXG4gICAgY2FzZSAnPCc6XG4gICAgICByZXR1cm4gbHQoYSwgYiwgbG9vc2UpXG5cbiAgICBjYXNlICc8PSc6XG4gICAgICByZXR1cm4gbHRlKGEsIGIsIGxvb3NlKVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb3BlcmF0b3I6ICcgKyBvcClcbiAgfVxufVxuXG5leHBvcnRzLkNvbXBhcmF0b3IgPSBDb21wYXJhdG9yXG5mdW5jdGlvbiBDb21wYXJhdG9yIChjb21wLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgbG9vc2U6ICEhb3B0aW9ucyxcbiAgICAgIGluY2x1ZGVQcmVyZWxlYXNlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlmIChjb21wIGluc3RhbmNlb2YgQ29tcGFyYXRvcikge1xuICAgIGlmIChjb21wLmxvb3NlID09PSAhIW9wdGlvbnMubG9vc2UpIHtcbiAgICAgIHJldHVybiBjb21wXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXAgPSBjb21wLnZhbHVlXG4gICAgfVxuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIENvbXBhcmF0b3IpKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wYXJhdG9yKGNvbXAsIG9wdGlvbnMpXG4gIH1cblxuICBjb21wID0gY29tcC50cmltKCkuc3BsaXQoL1xccysvKS5qb2luKCcgJylcbiAgZGVidWcoJ2NvbXBhcmF0b3InLCBjb21wLCBvcHRpb25zKVxuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIHRoaXMubG9vc2UgPSAhIW9wdGlvbnMubG9vc2VcbiAgdGhpcy5wYXJzZShjb21wKVxuXG4gIGlmICh0aGlzLnNlbXZlciA9PT0gQU5ZKSB7XG4gICAgdGhpcy52YWx1ZSA9ICcnXG4gIH0gZWxzZSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMub3BlcmF0b3IgKyB0aGlzLnNlbXZlci52ZXJzaW9uXG4gIH1cblxuICBkZWJ1ZygnY29tcCcsIHRoaXMpXG59XG5cbnZhciBBTlkgPSB7fVxuQ29tcGFyYXRvci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoY29tcCkge1xuICB2YXIgciA9IHRoaXMub3B0aW9ucy5sb29zZSA/IHNhZmVSZVt0LkNPTVBBUkFUT1JMT09TRV0gOiBzYWZlUmVbdC5DT01QQVJBVE9SXVxuICB2YXIgbSA9IGNvbXAubWF0Y2gocilcblxuICBpZiAoIW0pIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNvbXBhcmF0b3I6ICcgKyBjb21wKVxuICB9XG5cbiAgdGhpcy5vcGVyYXRvciA9IG1bMV0gIT09IHVuZGVmaW5lZCA/IG1bMV0gOiAnJ1xuICBpZiAodGhpcy5vcGVyYXRvciA9PT0gJz0nKSB7XG4gICAgdGhpcy5vcGVyYXRvciA9ICcnXG4gIH1cblxuICAvLyBpZiBpdCBsaXRlcmFsbHkgaXMganVzdCAnPicgb3IgJycgdGhlbiBhbGxvdyBhbnl0aGluZy5cbiAgaWYgKCFtWzJdKSB7XG4gICAgdGhpcy5zZW12ZXIgPSBBTllcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNlbXZlciA9IG5ldyBTZW1WZXIobVsyXSwgdGhpcy5vcHRpb25zLmxvb3NlKVxuICB9XG59XG5cbkNvbXBhcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5Db21wYXJhdG9yLnByb3RvdHlwZS50ZXN0ID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgZGVidWcoJ0NvbXBhcmF0b3IudGVzdCcsIHZlcnNpb24sIHRoaXMub3B0aW9ucy5sb29zZSlcblxuICBpZiAodGhpcy5zZW12ZXIgPT09IEFOWSB8fCB2ZXJzaW9uID09PSBBTlkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICB2ZXJzaW9uID0gbmV3IFNlbVZlcih2ZXJzaW9uLCB0aGlzLm9wdGlvbnMpXG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjbXAodmVyc2lvbiwgdGhpcy5vcGVyYXRvciwgdGhpcy5zZW12ZXIsIHRoaXMub3B0aW9ucylcbn1cblxuQ29tcGFyYXRvci5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIChjb21wLCBvcHRpb25zKSB7XG4gIGlmICghKGNvbXAgaW5zdGFuY2VvZiBDb21wYXJhdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2EgQ29tcGFyYXRvciBpcyByZXF1aXJlZCcpXG4gIH1cblxuICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGxvb3NlOiAhIW9wdGlvbnMsXG4gICAgICBpbmNsdWRlUHJlcmVsZWFzZTogZmFsc2VcbiAgICB9XG4gIH1cblxuICB2YXIgcmFuZ2VUbXBcblxuICBpZiAodGhpcy5vcGVyYXRvciA9PT0gJycpIHtcbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJhbmdlVG1wID0gbmV3IFJhbmdlKGNvbXAudmFsdWUsIG9wdGlvbnMpXG4gICAgcmV0dXJuIHNhdGlzZmllcyh0aGlzLnZhbHVlLCByYW5nZVRtcCwgb3B0aW9ucylcbiAgfSBlbHNlIGlmIChjb21wLm9wZXJhdG9yID09PSAnJykge1xuICAgIGlmIChjb21wLnZhbHVlID09PSAnJykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmFuZ2VUbXAgPSBuZXcgUmFuZ2UodGhpcy52YWx1ZSwgb3B0aW9ucylcbiAgICByZXR1cm4gc2F0aXNmaWVzKGNvbXAuc2VtdmVyLCByYW5nZVRtcCwgb3B0aW9ucylcbiAgfVxuXG4gIHZhciBzYW1lRGlyZWN0aW9uSW5jcmVhc2luZyA9XG4gICAgKHRoaXMub3BlcmF0b3IgPT09ICc+PScgfHwgdGhpcy5vcGVyYXRvciA9PT0gJz4nKSAmJlxuICAgIChjb21wLm9wZXJhdG9yID09PSAnPj0nIHx8IGNvbXAub3BlcmF0b3IgPT09ICc+JylcbiAgdmFyIHNhbWVEaXJlY3Rpb25EZWNyZWFzaW5nID1cbiAgICAodGhpcy5vcGVyYXRvciA9PT0gJzw9JyB8fCB0aGlzLm9wZXJhdG9yID09PSAnPCcpICYmXG4gICAgKGNvbXAub3BlcmF0b3IgPT09ICc8PScgfHwgY29tcC5vcGVyYXRvciA9PT0gJzwnKVxuICB2YXIgc2FtZVNlbVZlciA9IHRoaXMuc2VtdmVyLnZlcnNpb24gPT09IGNvbXAuc2VtdmVyLnZlcnNpb25cbiAgdmFyIGRpZmZlcmVudERpcmVjdGlvbnNJbmNsdXNpdmUgPVxuICAgICh0aGlzLm9wZXJhdG9yID09PSAnPj0nIHx8IHRoaXMub3BlcmF0b3IgPT09ICc8PScpICYmXG4gICAgKGNvbXAub3BlcmF0b3IgPT09ICc+PScgfHwgY29tcC5vcGVyYXRvciA9PT0gJzw9JylcbiAgdmFyIG9wcG9zaXRlRGlyZWN0aW9uc0xlc3NUaGFuID1cbiAgICBjbXAodGhpcy5zZW12ZXIsICc8JywgY29tcC5zZW12ZXIsIG9wdGlvbnMpICYmXG4gICAgKCh0aGlzLm9wZXJhdG9yID09PSAnPj0nIHx8IHRoaXMub3BlcmF0b3IgPT09ICc+JykgJiZcbiAgICAoY29tcC5vcGVyYXRvciA9PT0gJzw9JyB8fCBjb21wLm9wZXJhdG9yID09PSAnPCcpKVxuICB2YXIgb3Bwb3NpdGVEaXJlY3Rpb25zR3JlYXRlclRoYW4gPVxuICAgIGNtcCh0aGlzLnNlbXZlciwgJz4nLCBjb21wLnNlbXZlciwgb3B0aW9ucykgJiZcbiAgICAoKHRoaXMub3BlcmF0b3IgPT09ICc8PScgfHwgdGhpcy5vcGVyYXRvciA9PT0gJzwnKSAmJlxuICAgIChjb21wLm9wZXJhdG9yID09PSAnPj0nIHx8IGNvbXAub3BlcmF0b3IgPT09ICc+JykpXG5cbiAgcmV0dXJuIHNhbWVEaXJlY3Rpb25JbmNyZWFzaW5nIHx8IHNhbWVEaXJlY3Rpb25EZWNyZWFzaW5nIHx8XG4gICAgKHNhbWVTZW1WZXIgJiYgZGlmZmVyZW50RGlyZWN0aW9uc0luY2x1c2l2ZSkgfHxcbiAgICBvcHBvc2l0ZURpcmVjdGlvbnNMZXNzVGhhbiB8fCBvcHBvc2l0ZURpcmVjdGlvbnNHcmVhdGVyVGhhblxufVxuXG5leHBvcnRzLlJhbmdlID0gUmFuZ2VcbmZ1bmN0aW9uIFJhbmdlIChyYW5nZSwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGxvb3NlOiAhIW9wdGlvbnMsXG4gICAgICBpbmNsdWRlUHJlcmVsZWFzZTogZmFsc2VcbiAgICB9XG4gIH1cblxuICBpZiAocmFuZ2UgaW5zdGFuY2VvZiBSYW5nZSkge1xuICAgIGlmIChyYW5nZS5sb29zZSA9PT0gISFvcHRpb25zLmxvb3NlICYmXG4gICAgICAgIHJhbmdlLmluY2x1ZGVQcmVyZWxlYXNlID09PSAhIW9wdGlvbnMuaW5jbHVkZVByZXJlbGVhc2UpIHtcbiAgICAgIHJldHVybiByYW5nZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKHJhbmdlLnJhdywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICBpZiAocmFuZ2UgaW5zdGFuY2VvZiBDb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBSYW5nZShyYW5nZS52YWx1ZSwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSYW5nZSkpIHtcbiAgICByZXR1cm4gbmV3IFJhbmdlKHJhbmdlLCBvcHRpb25zKVxuICB9XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB0aGlzLmxvb3NlID0gISFvcHRpb25zLmxvb3NlXG4gIHRoaXMuaW5jbHVkZVByZXJlbGVhc2UgPSAhIW9wdGlvbnMuaW5jbHVkZVByZXJlbGVhc2VcblxuICAvLyBGaXJzdCByZWR1Y2UgYWxsIHdoaXRlc3BhY2UgYXMgbXVjaCBhcyBwb3NzaWJsZSBzbyB3ZSBkbyBub3QgaGF2ZSB0byByZWx5XG4gIC8vIG9uIHBvdGVudGlhbGx5IHNsb3cgcmVnZXhlcyBsaWtlIFxccyouIFRoaXMgaXMgdGhlbiBzdG9yZWQgYW5kIHVzZWQgZm9yXG4gIC8vIGZ1dHVyZSBlcnJvciBtZXNzYWdlcyBhcyB3ZWxsLlxuICB0aGlzLnJhdyA9IHJhbmdlXG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgLmpvaW4oJyAnKVxuXG4gIC8vIEZpcnN0LCBzcGxpdCBiYXNlZCBvbiBib29sZWFuIG9yIHx8XG4gIHRoaXMuc2V0ID0gdGhpcy5yYXcuc3BsaXQoJ3x8JykubWFwKGZ1bmN0aW9uIChyYW5nZSkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlUmFuZ2UocmFuZ2UudHJpbSgpKVxuICB9LCB0aGlzKS5maWx0ZXIoZnVuY3Rpb24gKGMpIHtcbiAgICAvLyB0aHJvdyBvdXQgYW55IHRoYXQgYXJlIG5vdCByZWxldmFudCBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gICAgcmV0dXJuIGMubGVuZ3RoXG4gIH0pXG5cbiAgaWYgKCF0aGlzLnNldC5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIFNlbVZlciBSYW5nZTogJyArIHRoaXMucmF3KVxuICB9XG5cbiAgdGhpcy5mb3JtYXQoKVxufVxuXG5SYW5nZS5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJhbmdlID0gdGhpcy5zZXQubWFwKGZ1bmN0aW9uIChjb21wcykge1xuICAgIHJldHVybiBjb21wcy5qb2luKCcgJykudHJpbSgpXG4gIH0pLmpvaW4oJ3x8JykudHJpbSgpXG4gIHJldHVybiB0aGlzLnJhbmdlXG59XG5cblJhbmdlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMucmFuZ2Vcbn1cblxuUmFuZ2UucHJvdG90eXBlLnBhcnNlUmFuZ2UgPSBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgdmFyIGxvb3NlID0gdGhpcy5vcHRpb25zLmxvb3NlXG4gIC8vIGAxLjIuMyAtIDEuMi40YCA9PiBgPj0xLjIuMyA8PTEuMi40YFxuICB2YXIgaHIgPSBsb29zZSA/IHNhZmVSZVt0LkhZUEhFTlJBTkdFTE9PU0VdIDogc2FmZVJlW3QuSFlQSEVOUkFOR0VdXG4gIHJhbmdlID0gcmFuZ2UucmVwbGFjZShociwgaHlwaGVuUmVwbGFjZSlcbiAgZGVidWcoJ2h5cGhlbiByZXBsYWNlJywgcmFuZ2UpXG4gIC8vIGA+IDEuMi4zIDwgMS4yLjVgID0+IGA+MS4yLjMgPDEuMi41YFxuICByYW5nZSA9IHJhbmdlLnJlcGxhY2Uoc2FmZVJlW3QuQ09NUEFSQVRPUlRSSU1dLCBjb21wYXJhdG9yVHJpbVJlcGxhY2UpXG4gIGRlYnVnKCdjb21wYXJhdG9yIHRyaW0nLCByYW5nZSwgc2FmZVJlW3QuQ09NUEFSQVRPUlRSSU1dKVxuXG4gIC8vIGB+IDEuMi4zYCA9PiBgfjEuMi4zYFxuICByYW5nZSA9IHJhbmdlLnJlcGxhY2Uoc2FmZVJlW3QuVElMREVUUklNXSwgdGlsZGVUcmltUmVwbGFjZSlcblxuICAvLyBgXiAxLjIuM2AgPT4gYF4xLjIuM2BcbiAgcmFuZ2UgPSByYW5nZS5yZXBsYWNlKHNhZmVSZVt0LkNBUkVUVFJJTV0sIGNhcmV0VHJpbVJlcGxhY2UpXG5cbiAgLy8gbm9ybWFsaXplIHNwYWNlc1xuICByYW5nZSA9IHJhbmdlLnNwbGl0KC9cXHMrLykuam9pbignICcpXG5cbiAgLy8gQXQgdGhpcyBwb2ludCwgdGhlIHJhbmdlIGlzIGNvbXBsZXRlbHkgdHJpbW1lZCBhbmRcbiAgLy8gcmVhZHkgdG8gYmUgc3BsaXQgaW50byBjb21wYXJhdG9ycy5cblxuICB2YXIgY29tcFJlID0gbG9vc2UgPyBzYWZlUmVbdC5DT01QQVJBVE9STE9PU0VdIDogc2FmZVJlW3QuQ09NUEFSQVRPUl1cbiAgdmFyIHNldCA9IHJhbmdlLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uIChjb21wKSB7XG4gICAgcmV0dXJuIHBhcnNlQ29tcGFyYXRvcihjb21wLCB0aGlzLm9wdGlvbnMpXG4gIH0sIHRoaXMpLmpvaW4oJyAnKS5zcGxpdCgvXFxzKy8pXG4gIGlmICh0aGlzLm9wdGlvbnMubG9vc2UpIHtcbiAgICAvLyBpbiBsb29zZSBtb2RlLCB0aHJvdyBvdXQgYW55IHRoYXQgYXJlIG5vdCB2YWxpZCBjb21wYXJhdG9yc1xuICAgIHNldCA9IHNldC5maWx0ZXIoZnVuY3Rpb24gKGNvbXApIHtcbiAgICAgIHJldHVybiAhIWNvbXAubWF0Y2goY29tcFJlKVxuICAgIH0pXG4gIH1cbiAgc2V0ID0gc2V0Lm1hcChmdW5jdGlvbiAoY29tcCkge1xuICAgIHJldHVybiBuZXcgQ29tcGFyYXRvcihjb21wLCB0aGlzLm9wdGlvbnMpXG4gIH0sIHRoaXMpXG5cbiAgcmV0dXJuIHNldFxufVxuXG5SYW5nZS5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIChyYW5nZSwgb3B0aW9ucykge1xuICBpZiAoIShyYW5nZSBpbnN0YW5jZW9mIFJhbmdlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2EgUmFuZ2UgaXMgcmVxdWlyZWQnKVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuc2V0LnNvbWUoZnVuY3Rpb24gKHRoaXNDb21wYXJhdG9ycykge1xuICAgIHJldHVybiAoXG4gICAgICBpc1NhdGlzZmlhYmxlKHRoaXNDb21wYXJhdG9ycywgb3B0aW9ucykgJiZcbiAgICAgIHJhbmdlLnNldC5zb21lKGZ1bmN0aW9uIChyYW5nZUNvbXBhcmF0b3JzKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgaXNTYXRpc2ZpYWJsZShyYW5nZUNvbXBhcmF0b3JzLCBvcHRpb25zKSAmJlxuICAgICAgICAgIHRoaXNDb21wYXJhdG9ycy5ldmVyeShmdW5jdGlvbiAodGhpc0NvbXBhcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5nZUNvbXBhcmF0b3JzLmV2ZXJ5KGZ1bmN0aW9uIChyYW5nZUNvbXBhcmF0b3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXNDb21wYXJhdG9yLmludGVyc2VjdHMocmFuZ2VDb21wYXJhdG9yLCBvcHRpb25zKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9KVxuICAgIClcbiAgfSlcbn1cblxuLy8gdGFrZSBhIHNldCBvZiBjb21wYXJhdG9ycyBhbmQgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlcmVcbi8vIGV4aXN0cyBhIHZlcnNpb24gd2hpY2ggY2FuIHNhdGlzZnkgaXRcbmZ1bmN0aW9uIGlzU2F0aXNmaWFibGUgKGNvbXBhcmF0b3JzLCBvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB0cnVlXG4gIHZhciByZW1haW5pbmdDb21wYXJhdG9ycyA9IGNvbXBhcmF0b3JzLnNsaWNlKClcbiAgdmFyIHRlc3RDb21wYXJhdG9yID0gcmVtYWluaW5nQ29tcGFyYXRvcnMucG9wKClcblxuICB3aGlsZSAocmVzdWx0ICYmIHJlbWFpbmluZ0NvbXBhcmF0b3JzLmxlbmd0aCkge1xuICAgIHJlc3VsdCA9IHJlbWFpbmluZ0NvbXBhcmF0b3JzLmV2ZXJ5KGZ1bmN0aW9uIChvdGhlckNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiB0ZXN0Q29tcGFyYXRvci5pbnRlcnNlY3RzKG90aGVyQ29tcGFyYXRvciwgb3B0aW9ucylcbiAgICB9KVxuXG4gICAgdGVzdENvbXBhcmF0b3IgPSByZW1haW5pbmdDb21wYXJhdG9ycy5wb3AoKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBNb3N0bHkganVzdCBmb3IgdGVzdGluZyBhbmQgbGVnYWN5IEFQSSByZWFzb25zXG5leHBvcnRzLnRvQ29tcGFyYXRvcnMgPSB0b0NvbXBhcmF0b3JzXG5mdW5jdGlvbiB0b0NvbXBhcmF0b3JzIChyYW5nZSwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IFJhbmdlKHJhbmdlLCBvcHRpb25zKS5zZXQubWFwKGZ1bmN0aW9uIChjb21wKSB7XG4gICAgcmV0dXJuIGNvbXAubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYy52YWx1ZVxuICAgIH0pLmpvaW4oJyAnKS50cmltKCkuc3BsaXQoJyAnKVxuICB9KVxufVxuXG4vLyBjb21wcmlzZWQgb2YgeHJhbmdlcywgdGlsZGVzLCBzdGFycywgYW5kIGd0bHQncyBhdCB0aGlzIHBvaW50LlxuLy8gYWxyZWFkeSByZXBsYWNlZCB0aGUgaHlwaGVuIHJhbmdlc1xuLy8gdHVybiBpbnRvIGEgc2V0IG9mIEpVU1QgY29tcGFyYXRvcnMuXG5mdW5jdGlvbiBwYXJzZUNvbXBhcmF0b3IgKGNvbXAsIG9wdGlvbnMpIHtcbiAgZGVidWcoJ2NvbXAnLCBjb21wLCBvcHRpb25zKVxuICBjb21wID0gcmVwbGFjZUNhcmV0cyhjb21wLCBvcHRpb25zKVxuICBkZWJ1ZygnY2FyZXQnLCBjb21wKVxuICBjb21wID0gcmVwbGFjZVRpbGRlcyhjb21wLCBvcHRpb25zKVxuICBkZWJ1ZygndGlsZGVzJywgY29tcClcbiAgY29tcCA9IHJlcGxhY2VYUmFuZ2VzKGNvbXAsIG9wdGlvbnMpXG4gIGRlYnVnKCd4cmFuZ2UnLCBjb21wKVxuICBjb21wID0gcmVwbGFjZVN0YXJzKGNvbXAsIG9wdGlvbnMpXG4gIGRlYnVnKCdzdGFycycsIGNvbXApXG4gIHJldHVybiBjb21wXG59XG5cbmZ1bmN0aW9uIGlzWCAoaWQpIHtcbiAgcmV0dXJuICFpZCB8fCBpZC50b0xvd2VyQ2FzZSgpID09PSAneCcgfHwgaWQgPT09ICcqJ1xufVxuXG4vLyB+LCB+PiAtLT4gKiAoYW55LCBraW5kYSBzaWxseSlcbi8vIH4yLCB+Mi54LCB+Mi54LngsIH4+Miwgfj4yLnggfj4yLngueCAtLT4gPj0yLjAuMCA8My4wLjBcbi8vIH4yLjAsIH4yLjAueCwgfj4yLjAsIH4+Mi4wLnggLS0+ID49Mi4wLjAgPDIuMS4wXG4vLyB+MS4yLCB+MS4yLngsIH4+MS4yLCB+PjEuMi54IC0tPiA+PTEuMi4wIDwxLjMuMFxuLy8gfjEuMi4zLCB+PjEuMi4zIC0tPiA+PTEuMi4zIDwxLjMuMFxuLy8gfjEuMi4wLCB+PjEuMi4wIC0tPiA+PTEuMi4wIDwxLjMuMFxuZnVuY3Rpb24gcmVwbGFjZVRpbGRlcyAoY29tcCwgb3B0aW9ucykge1xuICByZXR1cm4gY29tcC50cmltKCkuc3BsaXQoL1xccysvKS5tYXAoZnVuY3Rpb24gKGNvbXApIHtcbiAgICByZXR1cm4gcmVwbGFjZVRpbGRlKGNvbXAsIG9wdGlvbnMpXG4gIH0pLmpvaW4oJyAnKVxufVxuXG5mdW5jdGlvbiByZXBsYWNlVGlsZGUgKGNvbXAsIG9wdGlvbnMpIHtcbiAgdmFyIHIgPSBvcHRpb25zLmxvb3NlID8gc2FmZVJlW3QuVElMREVMT09TRV0gOiBzYWZlUmVbdC5USUxERV1cbiAgcmV0dXJuIGNvbXAucmVwbGFjZShyLCBmdW5jdGlvbiAoXywgTSwgbSwgcCwgcHIpIHtcbiAgICBkZWJ1ZygndGlsZGUnLCBjb21wLCBfLCBNLCBtLCBwLCBwcilcbiAgICB2YXIgcmV0XG5cbiAgICBpZiAoaXNYKE0pKSB7XG4gICAgICByZXQgPSAnJ1xuICAgIH0gZWxzZSBpZiAoaXNYKG0pKSB7XG4gICAgICByZXQgPSAnPj0nICsgTSArICcuMC4wIDwnICsgKCtNICsgMSkgKyAnLjAuMCdcbiAgICB9IGVsc2UgaWYgKGlzWChwKSkge1xuICAgICAgLy8gfjEuMiA9PSA+PTEuMi4wIDwxLjMuMFxuICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4wIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJ1xuICAgIH0gZWxzZSBpZiAocHIpIHtcbiAgICAgIGRlYnVnKCdyZXBsYWNlVGlsZGUgcHInLCBwcilcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgKyAnLScgKyBwciArXG4gICAgICAgICAgICAnIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJ1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB+MS4yLjMgPT0gPj0xLjIuMyA8MS4zLjBcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgK1xuICAgICAgICAgICAgJyA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCdcbiAgICB9XG5cbiAgICBkZWJ1ZygndGlsZGUgcmV0dXJuJywgcmV0KVxuICAgIHJldHVybiByZXRcbiAgfSlcbn1cblxuLy8gXiAtLT4gKiAoYW55LCBraW5kYSBzaWxseSlcbi8vIF4yLCBeMi54LCBeMi54LnggLS0+ID49Mi4wLjAgPDMuMC4wXG4vLyBeMi4wLCBeMi4wLnggLS0+ID49Mi4wLjAgPDMuMC4wXG4vLyBeMS4yLCBeMS4yLnggLS0+ID49MS4yLjAgPDIuMC4wXG4vLyBeMS4yLjMgLS0+ID49MS4yLjMgPDIuMC4wXG4vLyBeMS4yLjAgLS0+ID49MS4yLjAgPDIuMC4wXG5mdW5jdGlvbiByZXBsYWNlQ2FyZXRzIChjb21wLCBvcHRpb25zKSB7XG4gIHJldHVybiBjb21wLnRyaW0oKS5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbiAoY29tcCkge1xuICAgIHJldHVybiByZXBsYWNlQ2FyZXQoY29tcCwgb3B0aW9ucylcbiAgfSkuam9pbignICcpXG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VDYXJldCAoY29tcCwgb3B0aW9ucykge1xuICBkZWJ1ZygnY2FyZXQnLCBjb21wLCBvcHRpb25zKVxuICB2YXIgciA9IG9wdGlvbnMubG9vc2UgPyBzYWZlUmVbdC5DQVJFVExPT1NFXSA6IHNhZmVSZVt0LkNBUkVUXVxuICByZXR1cm4gY29tcC5yZXBsYWNlKHIsIGZ1bmN0aW9uIChfLCBNLCBtLCBwLCBwcikge1xuICAgIGRlYnVnKCdjYXJldCcsIGNvbXAsIF8sIE0sIG0sIHAsIHByKVxuICAgIHZhciByZXRcblxuICAgIGlmIChpc1goTSkpIHtcbiAgICAgIHJldCA9ICcnXG4gICAgfSBlbHNlIGlmIChpc1gobSkpIHtcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4wLjAgPCcgKyAoK00gKyAxKSArICcuMC4wJ1xuICAgIH0gZWxzZSBpZiAoaXNYKHApKSB7XG4gICAgICBpZiAoTSA9PT0gJzAnKSB7XG4gICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuMCA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuMCA8JyArICgrTSArIDEpICsgJy4wLjAnXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcikge1xuICAgICAgZGVidWcoJ3JlcGxhY2VDYXJldCBwcicsIHByKVxuICAgICAgaWYgKE0gPT09ICcwJykge1xuICAgICAgICBpZiAobSA9PT0gJzAnKSB7XG4gICAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArICctJyArIHByICtcbiAgICAgICAgICAgICAgICAnIDwnICsgTSArICcuJyArIG0gKyAnLicgKyAoK3AgKyAxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgKyAnLScgKyBwciArXG4gICAgICAgICAgICAgICAgJyA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCdcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArICctJyArIHByICtcbiAgICAgICAgICAgICAgJyA8JyArICgrTSArIDEpICsgJy4wLjAnXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnKCdubyBwcicpXG4gICAgICBpZiAoTSA9PT0gJzAnKSB7XG4gICAgICAgIGlmIChtID09PSAnMCcpIHtcbiAgICAgICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLicgKyBwICtcbiAgICAgICAgICAgICAgICAnIDwnICsgTSArICcuJyArIG0gKyAnLicgKyAoK3AgKyAxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgK1xuICAgICAgICAgICAgICAgICcgPCcgKyBNICsgJy4nICsgKCttICsgMSkgKyAnLjAnXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgK1xuICAgICAgICAgICAgICAnIDwnICsgKCtNICsgMSkgKyAnLjAuMCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWJ1ZygnY2FyZXQgcmV0dXJuJywgcmV0KVxuICAgIHJldHVybiByZXRcbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVhSYW5nZXMgKGNvbXAsIG9wdGlvbnMpIHtcbiAgZGVidWcoJ3JlcGxhY2VYUmFuZ2VzJywgY29tcCwgb3B0aW9ucylcbiAgcmV0dXJuIGNvbXAuc3BsaXQoL1xccysvKS5tYXAoZnVuY3Rpb24gKGNvbXApIHtcbiAgICByZXR1cm4gcmVwbGFjZVhSYW5nZShjb21wLCBvcHRpb25zKVxuICB9KS5qb2luKCcgJylcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVhSYW5nZSAoY29tcCwgb3B0aW9ucykge1xuICBjb21wID0gY29tcC50cmltKClcbiAgdmFyIHIgPSBvcHRpb25zLmxvb3NlID8gc2FmZVJlW3QuWFJBTkdFTE9PU0VdIDogc2FmZVJlW3QuWFJBTkdFXVxuICByZXR1cm4gY29tcC5yZXBsYWNlKHIsIGZ1bmN0aW9uIChyZXQsIGd0bHQsIE0sIG0sIHAsIHByKSB7XG4gICAgZGVidWcoJ3hSYW5nZScsIGNvbXAsIHJldCwgZ3RsdCwgTSwgbSwgcCwgcHIpXG4gICAgdmFyIHhNID0gaXNYKE0pXG4gICAgdmFyIHhtID0geE0gfHwgaXNYKG0pXG4gICAgdmFyIHhwID0geG0gfHwgaXNYKHApXG4gICAgdmFyIGFueVggPSB4cFxuXG4gICAgaWYgKGd0bHQgPT09ICc9JyAmJiBhbnlYKSB7XG4gICAgICBndGx0ID0gJydcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSdyZSBpbmNsdWRpbmcgcHJlcmVsZWFzZXMgaW4gdGhlIG1hdGNoLCB0aGVuIHdlIG5lZWRcbiAgICAvLyB0byBmaXggdGhpcyB0byAtMCwgdGhlIGxvd2VzdCBwb3NzaWJsZSBwcmVyZWxlYXNlIHZhbHVlXG4gICAgcHIgPSBvcHRpb25zLmluY2x1ZGVQcmVyZWxlYXNlID8gJy0wJyA6ICcnXG5cbiAgICBpZiAoeE0pIHtcbiAgICAgIGlmIChndGx0ID09PSAnPicgfHwgZ3RsdCA9PT0gJzwnKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaXMgYWxsb3dlZFxuICAgICAgICByZXQgPSAnPDAuMC4wLTAnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBub3RoaW5nIGlzIGZvcmJpZGRlblxuICAgICAgICByZXQgPSAnKidcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGd0bHQgJiYgYW55WCkge1xuICAgICAgLy8gd2Uga25vdyBwYXRjaCBpcyBhbiB4LCBiZWNhdXNlIHdlIGhhdmUgYW55IHggYXQgYWxsLlxuICAgICAgLy8gcmVwbGFjZSBYIHdpdGggMFxuICAgICAgaWYgKHhtKSB7XG4gICAgICAgIG0gPSAwXG4gICAgICB9XG4gICAgICBwID0gMFxuXG4gICAgICBpZiAoZ3RsdCA9PT0gJz4nKSB7XG4gICAgICAgIC8vID4xID0+ID49Mi4wLjBcbiAgICAgICAgLy8gPjEuMiA9PiA+PTEuMy4wXG4gICAgICAgIC8vID4xLjIuMyA9PiA+PSAxLjIuNFxuICAgICAgICBndGx0ID0gJz49J1xuICAgICAgICBpZiAoeG0pIHtcbiAgICAgICAgICBNID0gK00gKyAxXG4gICAgICAgICAgbSA9IDBcbiAgICAgICAgICBwID0gMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG0gPSArbSArIDFcbiAgICAgICAgICBwID0gMFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGd0bHQgPT09ICc8PScpIHtcbiAgICAgICAgLy8gPD0wLjcueCBpcyBhY3R1YWxseSA8MC44LjAsIHNpbmNlIGFueSAwLjcueCBzaG91bGRcbiAgICAgICAgLy8gcGFzcy4gIFNpbWlsYXJseSwgPD03LnggaXMgYWN0dWFsbHkgPDguMC4wLCBldGMuXG4gICAgICAgIGd0bHQgPSAnPCdcbiAgICAgICAgaWYgKHhtKSB7XG4gICAgICAgICAgTSA9ICtNICsgMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG0gPSArbSArIDFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXQgPSBndGx0ICsgTSArICcuJyArIG0gKyAnLicgKyBwICsgcHJcbiAgICB9IGVsc2UgaWYgKHhtKSB7XG4gICAgICByZXQgPSAnPj0nICsgTSArICcuMC4wJyArIHByICsgJyA8JyArICgrTSArIDEpICsgJy4wLjAnICsgcHJcbiAgICB9IGVsc2UgaWYgKHhwKSB7XG4gICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLjAnICsgcHIgK1xuICAgICAgICAnIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJyArIHByXG4gICAgfVxuXG4gICAgZGVidWcoJ3hSYW5nZSByZXR1cm4nLCByZXQpXG5cbiAgICByZXR1cm4gcmV0XG4gIH0pXG59XG5cbi8vIEJlY2F1c2UgKiBpcyBBTkQtZWQgd2l0aCBldmVyeXRoaW5nIGVsc2UgaW4gdGhlIGNvbXBhcmF0b3IsXG4vLyBhbmQgJycgbWVhbnMgXCJhbnkgdmVyc2lvblwiLCBqdXN0IHJlbW92ZSB0aGUgKnMgZW50aXJlbHkuXG5mdW5jdGlvbiByZXBsYWNlU3RhcnMgKGNvbXAsIG9wdGlvbnMpIHtcbiAgZGVidWcoJ3JlcGxhY2VTdGFycycsIGNvbXAsIG9wdGlvbnMpXG4gIC8vIExvb3NlbmVzcyBpcyBpZ25vcmVkIGhlcmUuICBzdGFyIGlzIGFsd2F5cyBhcyBsb29zZSBhcyBpdCBnZXRzIVxuICByZXR1cm4gY29tcC50cmltKCkucmVwbGFjZShzYWZlUmVbdC5TVEFSXSwgJycpXG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgcGFzc2VkIHRvIHN0cmluZy5yZXBsYWNlKHJlW3QuSFlQSEVOUkFOR0VdKVxuLy8gTSwgbSwgcGF0Y2gsIHByZXJlbGVhc2UsIGJ1aWxkXG4vLyAxLjIgLSAzLjQuNSA9PiA+PTEuMi4wIDw9My40LjVcbi8vIDEuMi4zIC0gMy40ID0+ID49MS4yLjAgPDMuNS4wIEFueSAzLjQueCB3aWxsIGRvXG4vLyAxLjIgLSAzLjQgPT4gPj0xLjIuMCA8My41LjBcbmZ1bmN0aW9uIGh5cGhlblJlcGxhY2UgKCQwLFxuICBmcm9tLCBmTSwgZm0sIGZwLCBmcHIsIGZiLFxuICB0bywgdE0sIHRtLCB0cCwgdHByLCB0Yikge1xuICBpZiAoaXNYKGZNKSkge1xuICAgIGZyb20gPSAnJ1xuICB9IGVsc2UgaWYgKGlzWChmbSkpIHtcbiAgICBmcm9tID0gJz49JyArIGZNICsgJy4wLjAnXG4gIH0gZWxzZSBpZiAoaXNYKGZwKSkge1xuICAgIGZyb20gPSAnPj0nICsgZk0gKyAnLicgKyBmbSArICcuMCdcbiAgfSBlbHNlIHtcbiAgICBmcm9tID0gJz49JyArIGZyb21cbiAgfVxuXG4gIGlmIChpc1godE0pKSB7XG4gICAgdG8gPSAnJ1xuICB9IGVsc2UgaWYgKGlzWCh0bSkpIHtcbiAgICB0byA9ICc8JyArICgrdE0gKyAxKSArICcuMC4wJ1xuICB9IGVsc2UgaWYgKGlzWCh0cCkpIHtcbiAgICB0byA9ICc8JyArIHRNICsgJy4nICsgKCt0bSArIDEpICsgJy4wJ1xuICB9IGVsc2UgaWYgKHRwcikge1xuICAgIHRvID0gJzw9JyArIHRNICsgJy4nICsgdG0gKyAnLicgKyB0cCArICctJyArIHRwclxuICB9IGVsc2Uge1xuICAgIHRvID0gJzw9JyArIHRvXG4gIH1cblxuICByZXR1cm4gKGZyb20gKyAnICcgKyB0bykudHJpbSgpXG59XG5cbi8vIGlmIEFOWSBvZiB0aGUgc2V0cyBtYXRjaCBBTEwgb2YgaXRzIGNvbXBhcmF0b3JzLCB0aGVuIHBhc3NcblJhbmdlLnByb3RvdHlwZS50ZXN0ID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAodHlwZW9mIHZlcnNpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZlcnNpb24gPSBuZXcgU2VtVmVyKHZlcnNpb24sIHRoaXMub3B0aW9ucylcbiAgICB9IGNhdGNoIChlcikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNldC5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0ZXN0U2V0KHRoaXMuc2V0W2ldLCB2ZXJzaW9uLCB0aGlzLm9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gdGVzdFNldCAoc2V0LCB2ZXJzaW9uLCBvcHRpb25zKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFzZXRbaV0udGVzdCh2ZXJzaW9uKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaWYgKHZlcnNpb24ucHJlcmVsZWFzZS5sZW5ndGggJiYgIW9wdGlvbnMuaW5jbHVkZVByZXJlbGVhc2UpIHtcbiAgICAvLyBGaW5kIHRoZSBzZXQgb2YgdmVyc2lvbnMgdGhhdCBhcmUgYWxsb3dlZCB0byBoYXZlIHByZXJlbGVhc2VzXG4gICAgLy8gRm9yIGV4YW1wbGUsIF4xLjIuMy1wci4xIGRlc3VnYXJzIHRvID49MS4yLjMtcHIuMSA8Mi4wLjBcbiAgICAvLyBUaGF0IHNob3VsZCBhbGxvdyBgMS4yLjMtcHIuMmAgdG8gcGFzcy5cbiAgICAvLyBIb3dldmVyLCBgMS4yLjQtYWxwaGEubm90cmVhZHlgIHNob3VsZCBOT1QgYmUgYWxsb3dlZCxcbiAgICAvLyBldmVuIHRob3VnaCBpdCdzIHdpdGhpbiB0aGUgcmFuZ2Ugc2V0IGJ5IHRoZSBjb21wYXJhdG9ycy5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZWJ1ZyhzZXRbaV0uc2VtdmVyKVxuICAgICAgaWYgKHNldFtpXS5zZW12ZXIgPT09IEFOWSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBpZiAoc2V0W2ldLnNlbXZlci5wcmVyZWxlYXNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGFsbG93ZWQgPSBzZXRbaV0uc2VtdmVyXG4gICAgICAgIGlmIChhbGxvd2VkLm1ham9yID09PSB2ZXJzaW9uLm1ham9yICYmXG4gICAgICAgICAgICBhbGxvd2VkLm1pbm9yID09PSB2ZXJzaW9uLm1pbm9yICYmXG4gICAgICAgICAgICBhbGxvd2VkLnBhdGNoID09PSB2ZXJzaW9uLnBhdGNoKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZlcnNpb24gaGFzIGEgLXByZSwgYnV0IGl0J3Mgbm90IG9uZSBvZiB0aGUgb25lcyB3ZSBsaWtlLlxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0cy5zYXRpc2ZpZXMgPSBzYXRpc2ZpZXNcbmZ1bmN0aW9uIHNhdGlzZmllcyAodmVyc2lvbiwgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByYW5nZSA9IG5ldyBSYW5nZShyYW5nZSwgb3B0aW9ucylcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gcmFuZ2UudGVzdCh2ZXJzaW9uKVxufVxuXG5leHBvcnRzLm1heFNhdGlzZnlpbmcgPSBtYXhTYXRpc2Z5aW5nXG5mdW5jdGlvbiBtYXhTYXRpc2Z5aW5nICh2ZXJzaW9ucywgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgdmFyIG1heCA9IG51bGxcbiAgdmFyIG1heFNWID0gbnVsbFxuICB0cnkge1xuICAgIHZhciByYW5nZU9iaiA9IG5ldyBSYW5nZShyYW5nZSwgb3B0aW9ucylcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHZlcnNpb25zLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAocmFuZ2VPYmoudGVzdCh2KSkge1xuICAgICAgLy8gc2F0aXNmaWVzKHYsIHJhbmdlLCBvcHRpb25zKVxuICAgICAgaWYgKCFtYXggfHwgbWF4U1YuY29tcGFyZSh2KSA9PT0gLTEpIHtcbiAgICAgICAgLy8gY29tcGFyZShtYXgsIHYsIHRydWUpXG4gICAgICAgIG1heCA9IHZcbiAgICAgICAgbWF4U1YgPSBuZXcgU2VtVmVyKG1heCwgb3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBtYXhcbn1cblxuZXhwb3J0cy5taW5TYXRpc2Z5aW5nID0gbWluU2F0aXNmeWluZ1xuZnVuY3Rpb24gbWluU2F0aXNmeWluZyAodmVyc2lvbnMsIHJhbmdlLCBvcHRpb25zKSB7XG4gIHZhciBtaW4gPSBudWxsXG4gIHZhciBtaW5TViA9IG51bGxcbiAgdHJ5IHtcbiAgICB2YXIgcmFuZ2VPYmogPSBuZXcgUmFuZ2UocmFuZ2UsIG9wdGlvbnMpXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2ZXJzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKHJhbmdlT2JqLnRlc3QodikpIHtcbiAgICAgIC8vIHNhdGlzZmllcyh2LCByYW5nZSwgb3B0aW9ucylcbiAgICAgIGlmICghbWluIHx8IG1pblNWLmNvbXBhcmUodikgPT09IDEpIHtcbiAgICAgICAgLy8gY29tcGFyZShtaW4sIHYsIHRydWUpXG4gICAgICAgIG1pbiA9IHZcbiAgICAgICAgbWluU1YgPSBuZXcgU2VtVmVyKG1pbiwgb3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBtaW5cbn1cblxuZXhwb3J0cy5taW5WZXJzaW9uID0gbWluVmVyc2lvblxuZnVuY3Rpb24gbWluVmVyc2lvbiAocmFuZ2UsIGxvb3NlKSB7XG4gIHJhbmdlID0gbmV3IFJhbmdlKHJhbmdlLCBsb29zZSlcblxuICB2YXIgbWludmVyID0gbmV3IFNlbVZlcignMC4wLjAnKVxuICBpZiAocmFuZ2UudGVzdChtaW52ZXIpKSB7XG4gICAgcmV0dXJuIG1pbnZlclxuICB9XG5cbiAgbWludmVyID0gbmV3IFNlbVZlcignMC4wLjAtMCcpXG4gIGlmIChyYW5nZS50ZXN0KG1pbnZlcikpIHtcbiAgICByZXR1cm4gbWludmVyXG4gIH1cblxuICBtaW52ZXIgPSBudWxsXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmFuZ2Uuc2V0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGNvbXBhcmF0b3JzID0gcmFuZ2Uuc2V0W2ldXG5cbiAgICBjb21wYXJhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wYXJhdG9yKSB7XG4gICAgICAvLyBDbG9uZSB0byBhdm9pZCBtYW5pcHVsYXRpbmcgdGhlIGNvbXBhcmF0b3IncyBzZW12ZXIgb2JqZWN0LlxuICAgICAgdmFyIGNvbXB2ZXIgPSBuZXcgU2VtVmVyKGNvbXBhcmF0b3Iuc2VtdmVyLnZlcnNpb24pXG4gICAgICBzd2l0Y2ggKGNvbXBhcmF0b3Iub3BlcmF0b3IpIHtcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgaWYgKGNvbXB2ZXIucHJlcmVsZWFzZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbXB2ZXIucGF0Y2grK1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21wdmVyLnByZXJlbGVhc2UucHVzaCgwKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb21wdmVyLnJhdyA9IGNvbXB2ZXIuZm9ybWF0KClcbiAgICAgICAgICAvKiBmYWxsdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICcnOlxuICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgaWYgKCFtaW52ZXIgfHwgZ3QobWludmVyLCBjb21wdmVyKSkge1xuICAgICAgICAgICAgbWludmVyID0gY29tcHZlclxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgIC8qIElnbm9yZSBtYXhpbXVtIHZlcnNpb25zICovXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgb3BlcmF0aW9uOiAnICsgY29tcGFyYXRvci5vcGVyYXRvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKG1pbnZlciAmJiByYW5nZS50ZXN0KG1pbnZlcikpIHtcbiAgICByZXR1cm4gbWludmVyXG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnRzLnZhbGlkUmFuZ2UgPSB2YWxpZFJhbmdlXG5mdW5jdGlvbiB2YWxpZFJhbmdlIChyYW5nZSwgb3B0aW9ucykge1xuICB0cnkge1xuICAgIC8vIFJldHVybiAnKicgaW5zdGVhZCBvZiAnJyBzbyB0aGF0IHRydXRoaW5lc3Mgd29ya3MuXG4gICAgLy8gVGhpcyB3aWxsIHRocm93IGlmIGl0J3MgaW52YWxpZCBhbnl3YXlcbiAgICByZXR1cm4gbmV3IFJhbmdlKHJhbmdlLCBvcHRpb25zKS5yYW5nZSB8fCAnKidcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8vIERldGVybWluZSBpZiB2ZXJzaW9uIGlzIGxlc3MgdGhhbiBhbGwgdGhlIHZlcnNpb25zIHBvc3NpYmxlIGluIHRoZSByYW5nZVxuZXhwb3J0cy5sdHIgPSBsdHJcbmZ1bmN0aW9uIGx0ciAodmVyc2lvbiwgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG91dHNpZGUodmVyc2lvbiwgcmFuZ2UsICc8Jywgb3B0aW9ucylcbn1cblxuLy8gRGV0ZXJtaW5lIGlmIHZlcnNpb24gaXMgZ3JlYXRlciB0aGFuIGFsbCB0aGUgdmVyc2lvbnMgcG9zc2libGUgaW4gdGhlIHJhbmdlLlxuZXhwb3J0cy5ndHIgPSBndHJcbmZ1bmN0aW9uIGd0ciAodmVyc2lvbiwgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG91dHNpZGUodmVyc2lvbiwgcmFuZ2UsICc+Jywgb3B0aW9ucylcbn1cblxuZXhwb3J0cy5vdXRzaWRlID0gb3V0c2lkZVxuZnVuY3Rpb24gb3V0c2lkZSAodmVyc2lvbiwgcmFuZ2UsIGhpbG8sIG9wdGlvbnMpIHtcbiAgdmVyc2lvbiA9IG5ldyBTZW1WZXIodmVyc2lvbiwgb3B0aW9ucylcbiAgcmFuZ2UgPSBuZXcgUmFuZ2UocmFuZ2UsIG9wdGlvbnMpXG5cbiAgdmFyIGd0Zm4sIGx0ZWZuLCBsdGZuLCBjb21wLCBlY29tcFxuICBzd2l0Y2ggKGhpbG8pIHtcbiAgICBjYXNlICc+JzpcbiAgICAgIGd0Zm4gPSBndFxuICAgICAgbHRlZm4gPSBsdGVcbiAgICAgIGx0Zm4gPSBsdFxuICAgICAgY29tcCA9ICc+J1xuICAgICAgZWNvbXAgPSAnPj0nXG4gICAgICBicmVha1xuICAgIGNhc2UgJzwnOlxuICAgICAgZ3RmbiA9IGx0XG4gICAgICBsdGVmbiA9IGd0ZVxuICAgICAgbHRmbiA9IGd0XG4gICAgICBjb21wID0gJzwnXG4gICAgICBlY29tcCA9ICc8PSdcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ011c3QgcHJvdmlkZSBhIGhpbG8gdmFsIG9mIFwiPFwiIG9yIFwiPlwiJylcbiAgfVxuXG4gIC8vIElmIGl0IHNhdGlzaWZlcyB0aGUgcmFuZ2UgaXQgaXMgbm90IG91dHNpZGVcbiAgaWYgKHNhdGlzZmllcyh2ZXJzaW9uLCByYW5nZSwgb3B0aW9ucykpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIEZyb20gbm93IG9uLCB2YXJpYWJsZSB0ZXJtcyBhcmUgYXMgaWYgd2UncmUgaW4gXCJndHJcIiBtb2RlLlxuICAvLyBidXQgbm90ZSB0aGF0IGV2ZXJ5dGhpbmcgaXMgZmxpcHBlZCBmb3IgdGhlIFwibHRyXCIgZnVuY3Rpb24uXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZS5zZXQubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgY29tcGFyYXRvcnMgPSByYW5nZS5zZXRbaV1cblxuICAgIHZhciBoaWdoID0gbnVsbFxuICAgIHZhciBsb3cgPSBudWxsXG5cbiAgICBjb21wYXJhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wYXJhdG9yKSB7XG4gICAgICBpZiAoY29tcGFyYXRvci5zZW12ZXIgPT09IEFOWSkge1xuICAgICAgICBjb21wYXJhdG9yID0gbmV3IENvbXBhcmF0b3IoJz49MC4wLjAnKVxuICAgICAgfVxuICAgICAgaGlnaCA9IGhpZ2ggfHwgY29tcGFyYXRvclxuICAgICAgbG93ID0gbG93IHx8IGNvbXBhcmF0b3JcbiAgICAgIGlmIChndGZuKGNvbXBhcmF0b3Iuc2VtdmVyLCBoaWdoLnNlbXZlciwgb3B0aW9ucykpIHtcbiAgICAgICAgaGlnaCA9IGNvbXBhcmF0b3JcbiAgICAgIH0gZWxzZSBpZiAobHRmbihjb21wYXJhdG9yLnNlbXZlciwgbG93LnNlbXZlciwgb3B0aW9ucykpIHtcbiAgICAgICAgbG93ID0gY29tcGFyYXRvclxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBJZiB0aGUgZWRnZSB2ZXJzaW9uIGNvbXBhcmF0b3IgaGFzIGEgb3BlcmF0b3IgdGhlbiBvdXIgdmVyc2lvblxuICAgIC8vIGlzbid0IG91dHNpZGUgaXRcbiAgICBpZiAoaGlnaC5vcGVyYXRvciA9PT0gY29tcCB8fCBoaWdoLm9wZXJhdG9yID09PSBlY29tcCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGxvd2VzdCB2ZXJzaW9uIGNvbXBhcmF0b3IgaGFzIGFuIG9wZXJhdG9yIGFuZCBvdXIgdmVyc2lvblxuICAgIC8vIGlzIGxlc3MgdGhhbiBpdCB0aGVuIGl0IGlzbid0IGhpZ2hlciB0aGFuIHRoZSByYW5nZVxuICAgIGlmICgoIWxvdy5vcGVyYXRvciB8fCBsb3cub3BlcmF0b3IgPT09IGNvbXApICYmXG4gICAgICAgIGx0ZWZuKHZlcnNpb24sIGxvdy5zZW12ZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2UgaWYgKGxvdy5vcGVyYXRvciA9PT0gZWNvbXAgJiYgbHRmbih2ZXJzaW9uLCBsb3cuc2VtdmVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydHMucHJlcmVsZWFzZSA9IHByZXJlbGVhc2VcbmZ1bmN0aW9uIHByZXJlbGVhc2UgKHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgdmFyIHBhcnNlZCA9IHBhcnNlKHZlcnNpb24sIG9wdGlvbnMpXG4gIHJldHVybiAocGFyc2VkICYmIHBhcnNlZC5wcmVyZWxlYXNlLmxlbmd0aCkgPyBwYXJzZWQucHJlcmVsZWFzZSA6IG51bGxcbn1cblxuZXhwb3J0cy5pbnRlcnNlY3RzID0gaW50ZXJzZWN0c1xuZnVuY3Rpb24gaW50ZXJzZWN0cyAocjEsIHIyLCBvcHRpb25zKSB7XG4gIHIxID0gbmV3IFJhbmdlKHIxLCBvcHRpb25zKVxuICByMiA9IG5ldyBSYW5nZShyMiwgb3B0aW9ucylcbiAgcmV0dXJuIHIxLmludGVyc2VjdHMocjIpXG59XG5cbmV4cG9ydHMuY29lcmNlID0gY29lcmNlXG5mdW5jdGlvbiBjb2VyY2UgKHZlcnNpb24sIG9wdGlvbnMpIHtcbiAgaWYgKHZlcnNpb24gaW5zdGFuY2VvZiBTZW1WZXIpIHtcbiAgICByZXR1cm4gdmVyc2lvblxuICB9XG5cbiAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSAnbnVtYmVyJykge1xuICAgIHZlcnNpb24gPSBTdHJpbmcodmVyc2lvbilcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICB2YXIgbWF0Y2ggPSBudWxsXG4gIGlmICghb3B0aW9ucy5ydGwpIHtcbiAgICBtYXRjaCA9IHZlcnNpb24ubWF0Y2goc2FmZVJlW3QuQ09FUkNFXSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGaW5kIHRoZSByaWdodC1tb3N0IGNvZXJjaWJsZSBzdHJpbmcgdGhhdCBkb2VzIG5vdCBzaGFyZVxuICAgIC8vIGEgdGVybWludXMgd2l0aCBhIG1vcmUgbGVmdC13YXJkIGNvZXJjaWJsZSBzdHJpbmcuXG4gICAgLy8gRWcsICcxLjIuMy40JyB3YW50cyB0byBjb2VyY2UgJzIuMy40Jywgbm90ICczLjQnIG9yICc0J1xuICAgIC8vXG4gICAgLy8gV2FsayB0aHJvdWdoIHRoZSBzdHJpbmcgY2hlY2tpbmcgd2l0aCBhIC9nIHJlZ2V4cFxuICAgIC8vIE1hbnVhbGx5IHNldCB0aGUgaW5kZXggc28gYXMgdG8gcGljayB1cCBvdmVybGFwcGluZyBtYXRjaGVzLlxuICAgIC8vIFN0b3Agd2hlbiB3ZSBnZXQgYSBtYXRjaCB0aGF0IGVuZHMgYXQgdGhlIHN0cmluZyBlbmQsIHNpbmNlIG5vXG4gICAgLy8gY29lcmNpYmxlIHN0cmluZyBjYW4gYmUgbW9yZSByaWdodC13YXJkIHdpdGhvdXQgdGhlIHNhbWUgdGVybWludXMuXG4gICAgdmFyIG5leHRcbiAgICB3aGlsZSAoKG5leHQgPSBzYWZlUmVbdC5DT0VSQ0VSVExdLmV4ZWModmVyc2lvbikpICYmXG4gICAgICAoIW1hdGNoIHx8IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoICE9PSB2ZXJzaW9uLmxlbmd0aClcbiAgICApIHtcbiAgICAgIGlmICghbWF0Y2ggfHxcbiAgICAgICAgICBuZXh0LmluZGV4ICsgbmV4dFswXS5sZW5ndGggIT09IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKSB7XG4gICAgICAgIG1hdGNoID0gbmV4dFxuICAgICAgfVxuICAgICAgc2FmZVJlW3QuQ09FUkNFUlRMXS5sYXN0SW5kZXggPSBuZXh0LmluZGV4ICsgbmV4dFsxXS5sZW5ndGggKyBuZXh0WzJdLmxlbmd0aFxuICAgIH1cbiAgICAvLyBsZWF2ZSBpdCBpbiBhIGNsZWFuIHN0YXRlXG4gICAgc2FmZVJlW3QuQ09FUkNFUlRMXS5sYXN0SW5kZXggPSAtMVxuICB9XG5cbiAgaWYgKG1hdGNoID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHJldHVybiBwYXJzZShtYXRjaFsyXSArXG4gICAgJy4nICsgKG1hdGNoWzNdIHx8ICcwJykgK1xuICAgICcuJyArIChtYXRjaFs0XSB8fCAnMCcpLCBvcHRpb25zKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChZYWxsaXN0KSB7XG4gIFlhbGxpc3QucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiogKCkge1xuICAgIGZvciAobGV0IHdhbGtlciA9IHRoaXMuaGVhZDsgd2Fsa2VyOyB3YWxrZXIgPSB3YWxrZXIubmV4dCkge1xuICAgICAgeWllbGQgd2Fsa2VyLnZhbHVlXG4gICAgfVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gWWFsbGlzdFxuXG5ZYWxsaXN0Lk5vZGUgPSBOb2RlXG5ZYWxsaXN0LmNyZWF0ZSA9IFlhbGxpc3RcblxuZnVuY3Rpb24gWWFsbGlzdCAobGlzdCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgaWYgKCEoc2VsZiBpbnN0YW5jZW9mIFlhbGxpc3QpKSB7XG4gICAgc2VsZiA9IG5ldyBZYWxsaXN0KClcbiAgfVxuXG4gIHNlbGYudGFpbCA9IG51bGxcbiAgc2VsZi5oZWFkID0gbnVsbFxuICBzZWxmLmxlbmd0aCA9IDBcblxuICBpZiAobGlzdCAmJiB0eXBlb2YgbGlzdC5mb3JFYWNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICBzZWxmLnB1c2goaXRlbSlcbiAgICB9KVxuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBzZWxmLnB1c2goYXJndW1lbnRzW2ldKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzZWxmXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnJlbW92ZU5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICBpZiAobm9kZS5saXN0ICE9PSB0aGlzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmluZyBub2RlIHdoaWNoIGRvZXMgbm90IGJlbG9uZyB0byB0aGlzIGxpc3QnKVxuICB9XG5cbiAgdmFyIG5leHQgPSBub2RlLm5leHRcbiAgdmFyIHByZXYgPSBub2RlLnByZXZcblxuICBpZiAobmV4dCkge1xuICAgIG5leHQucHJldiA9IHByZXZcbiAgfVxuXG4gIGlmIChwcmV2KSB7XG4gICAgcHJldi5uZXh0ID0gbmV4dFxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuaGVhZCkge1xuICAgIHRoaXMuaGVhZCA9IG5leHRcbiAgfVxuICBpZiAobm9kZSA9PT0gdGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsID0gcHJldlxuICB9XG5cbiAgbm9kZS5saXN0Lmxlbmd0aC0tXG4gIG5vZGUubmV4dCA9IG51bGxcbiAgbm9kZS5wcmV2ID0gbnVsbFxuICBub2RlLmxpc3QgPSBudWxsXG5cbiAgcmV0dXJuIG5leHRcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUudW5zaGlmdE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICBpZiAobm9kZSA9PT0gdGhpcy5oZWFkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAobm9kZS5saXN0KSB7XG4gICAgbm9kZS5saXN0LnJlbW92ZU5vZGUobm9kZSlcbiAgfVxuXG4gIHZhciBoZWFkID0gdGhpcy5oZWFkXG4gIG5vZGUubGlzdCA9IHRoaXNcbiAgbm9kZS5uZXh0ID0gaGVhZFxuICBpZiAoaGVhZCkge1xuICAgIGhlYWQucHJldiA9IG5vZGVcbiAgfVxuXG4gIHRoaXMuaGVhZCA9IG5vZGVcbiAgaWYgKCF0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwgPSBub2RlXG4gIH1cbiAgdGhpcy5sZW5ndGgrK1xufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5wdXNoTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIGlmIChub2RlID09PSB0aGlzLnRhaWwpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChub2RlLmxpc3QpIHtcbiAgICBub2RlLmxpc3QucmVtb3ZlTm9kZShub2RlKVxuICB9XG5cbiAgdmFyIHRhaWwgPSB0aGlzLnRhaWxcbiAgbm9kZS5saXN0ID0gdGhpc1xuICBub2RlLnByZXYgPSB0YWlsXG4gIGlmICh0YWlsKSB7XG4gICAgdGFpbC5uZXh0ID0gbm9kZVxuICB9XG5cbiAgdGhpcy50YWlsID0gbm9kZVxuICBpZiAoIXRoaXMuaGVhZCkge1xuICAgIHRoaXMuaGVhZCA9IG5vZGVcbiAgfVxuICB0aGlzLmxlbmd0aCsrXG59XG5cbllhbGxpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHB1c2godGhpcywgYXJndW1lbnRzW2ldKVxuICB9XG4gIHJldHVybiB0aGlzLmxlbmd0aFxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB1bnNoaWZ0KHRoaXMsIGFyZ3VtZW50c1tpXSlcbiAgfVxuICByZXR1cm4gdGhpcy5sZW5ndGhcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMudGFpbCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIHZhciByZXMgPSB0aGlzLnRhaWwudmFsdWVcbiAgdGhpcy50YWlsID0gdGhpcy50YWlsLnByZXZcbiAgaWYgKHRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbC5uZXh0ID0gbnVsbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuaGVhZCA9IG51bGxcbiAgfVxuICB0aGlzLmxlbmd0aC0tXG4gIHJldHVybiByZXNcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5oZWFkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgdmFyIHJlcyA9IHRoaXMuaGVhZC52YWx1ZVxuICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dFxuICBpZiAodGhpcy5oZWFkKSB7XG4gICAgdGhpcy5oZWFkLnByZXYgPSBudWxsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy50YWlsID0gbnVsbFxuICB9XG4gIHRoaXMubGVuZ3RoLS1cbiAgcmV0dXJuIHJlc1xufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGZuLCB0aGlzcCkge1xuICB0aGlzcCA9IHRoaXNwIHx8IHRoaXNcbiAgZm9yICh2YXIgd2Fsa2VyID0gdGhpcy5oZWFkLCBpID0gMDsgd2Fsa2VyICE9PSBudWxsOyBpKyspIHtcbiAgICBmbi5jYWxsKHRoaXNwLCB3YWxrZXIudmFsdWUsIGksIHRoaXMpXG4gICAgd2Fsa2VyID0gd2Fsa2VyLm5leHRcbiAgfVxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5mb3JFYWNoUmV2ZXJzZSA9IGZ1bmN0aW9uIChmbiwgdGhpc3ApIHtcbiAgdGhpc3AgPSB0aGlzcCB8fCB0aGlzXG4gIGZvciAodmFyIHdhbGtlciA9IHRoaXMudGFpbCwgaSA9IHRoaXMubGVuZ3RoIC0gMTsgd2Fsa2VyICE9PSBudWxsOyBpLS0pIHtcbiAgICBmbi5jYWxsKHRoaXNwLCB3YWxrZXIudmFsdWUsIGksIHRoaXMpXG4gICAgd2Fsa2VyID0gd2Fsa2VyLnByZXZcbiAgfVxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobikge1xuICBmb3IgKHZhciBpID0gMCwgd2Fsa2VyID0gdGhpcy5oZWFkOyB3YWxrZXIgIT09IG51bGwgJiYgaSA8IG47IGkrKykge1xuICAgIC8vIGFib3J0IG91dCBvZiB0aGUgbGlzdCBlYXJseSBpZiB3ZSBoaXQgYSBjeWNsZVxuICAgIHdhbGtlciA9IHdhbGtlci5uZXh0XG4gIH1cbiAgaWYgKGkgPT09IG4gJiYgd2Fsa2VyICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdhbGtlci52YWx1ZVxuICB9XG59XG5cbllhbGxpc3QucHJvdG90eXBlLmdldFJldmVyc2UgPSBmdW5jdGlvbiAobikge1xuICBmb3IgKHZhciBpID0gMCwgd2Fsa2VyID0gdGhpcy50YWlsOyB3YWxrZXIgIT09IG51bGwgJiYgaSA8IG47IGkrKykge1xuICAgIC8vIGFib3J0IG91dCBvZiB0aGUgbGlzdCBlYXJseSBpZiB3ZSBoaXQgYSBjeWNsZVxuICAgIHdhbGtlciA9IHdhbGtlci5wcmV2XG4gIH1cbiAgaWYgKGkgPT09IG4gJiYgd2Fsa2VyICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdhbGtlci52YWx1ZVxuICB9XG59XG5cbllhbGxpc3QucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChmbiwgdGhpc3ApIHtcbiAgdGhpc3AgPSB0aGlzcCB8fCB0aGlzXG4gIHZhciByZXMgPSBuZXcgWWFsbGlzdCgpXG4gIGZvciAodmFyIHdhbGtlciA9IHRoaXMuaGVhZDsgd2Fsa2VyICE9PSBudWxsOykge1xuICAgIHJlcy5wdXNoKGZuLmNhbGwodGhpc3AsIHdhbGtlci52YWx1ZSwgdGhpcykpXG4gICAgd2Fsa2VyID0gd2Fsa2VyLm5leHRcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbllhbGxpc3QucHJvdG90eXBlLm1hcFJldmVyc2UgPSBmdW5jdGlvbiAoZm4sIHRoaXNwKSB7XG4gIHRoaXNwID0gdGhpc3AgfHwgdGhpc1xuICB2YXIgcmVzID0gbmV3IFlhbGxpc3QoKVxuICBmb3IgKHZhciB3YWxrZXIgPSB0aGlzLnRhaWw7IHdhbGtlciAhPT0gbnVsbDspIHtcbiAgICByZXMucHVzaChmbi5jYWxsKHRoaXNwLCB3YWxrZXIudmFsdWUsIHRoaXMpKVxuICAgIHdhbGtlciA9IHdhbGtlci5wcmV2XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiAoZm4sIGluaXRpYWwpIHtcbiAgdmFyIGFjY1xuICB2YXIgd2Fsa2VyID0gdGhpcy5oZWFkXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgIGFjYyA9IGluaXRpYWxcbiAgfSBlbHNlIGlmICh0aGlzLmhlYWQpIHtcbiAgICB3YWxrZXIgPSB0aGlzLmhlYWQubmV4dFxuICAgIGFjYyA9IHRoaXMuaGVhZC52YWx1ZVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBsaXN0IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpXG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgd2Fsa2VyICE9PSBudWxsOyBpKyspIHtcbiAgICBhY2MgPSBmbihhY2MsIHdhbGtlci52YWx1ZSwgaSlcbiAgICB3YWxrZXIgPSB3YWxrZXIubmV4dFxuICB9XG5cbiAgcmV0dXJuIGFjY1xufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS5yZWR1Y2VSZXZlcnNlID0gZnVuY3Rpb24gKGZuLCBpbml0aWFsKSB7XG4gIHZhciBhY2NcbiAgdmFyIHdhbGtlciA9IHRoaXMudGFpbFxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICBhY2MgPSBpbml0aWFsXG4gIH0gZWxzZSBpZiAodGhpcy50YWlsKSB7XG4gICAgd2Fsa2VyID0gdGhpcy50YWlsLnByZXZcbiAgICBhY2MgPSB0aGlzLnRhaWwudmFsdWVcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgbGlzdCB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgd2Fsa2VyICE9PSBudWxsOyBpLS0pIHtcbiAgICBhY2MgPSBmbihhY2MsIHdhbGtlci52YWx1ZSwgaSlcbiAgICB3YWxrZXIgPSB3YWxrZXIucHJldlxuICB9XG5cbiAgcmV0dXJuIGFjY1xufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXJyID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMCwgd2Fsa2VyID0gdGhpcy5oZWFkOyB3YWxrZXIgIT09IG51bGw7IGkrKykge1xuICAgIGFycltpXSA9IHdhbGtlci52YWx1ZVxuICAgIHdhbGtlciA9IHdhbGtlci5uZXh0XG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG5ZYWxsaXN0LnByb3RvdHlwZS50b0FycmF5UmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFyciA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDAsIHdhbGtlciA9IHRoaXMudGFpbDsgd2Fsa2VyICE9PSBudWxsOyBpKyspIHtcbiAgICBhcnJbaV0gPSB3YWxrZXIudmFsdWVcbiAgICB3YWxrZXIgPSB3YWxrZXIucHJldlxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuWWFsbGlzdC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgdG8gPSB0byB8fCB0aGlzLmxlbmd0aFxuICBpZiAodG8gPCAwKSB7XG4gICAgdG8gKz0gdGhpcy5sZW5ndGhcbiAgfVxuICBmcm9tID0gZnJvbSB8fCAwXG4gIGlmIChmcm9tIDwgMCkge1xuICAgIGZyb20gKz0gdGhpcy5sZW5ndGhcbiAgfVxuICB2YXIgcmV0ID0gbmV3IFlhbGxpc3QoKVxuICBpZiAodG8gPCBmcm9tIHx8IHRvIDwgMCkge1xuICAgIHJldHVybiByZXRcbiAgfVxuICBpZiAoZnJvbSA8IDApIHtcbiAgICBmcm9tID0gMFxuICB9XG4gIGlmICh0byA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdG8gPSB0aGlzLmxlbmd0aFxuICB9XG4gIGZvciAodmFyIGkgPSAwLCB3YWxrZXIgPSB0aGlzLmhlYWQ7IHdhbGtlciAhPT0gbnVsbCAmJiBpIDwgZnJvbTsgaSsrKSB7XG4gICAgd2Fsa2VyID0gd2Fsa2VyLm5leHRcbiAgfVxuICBmb3IgKDsgd2Fsa2VyICE9PSBudWxsICYmIGkgPCB0bzsgaSsrLCB3YWxrZXIgPSB3YWxrZXIubmV4dCkge1xuICAgIHJldC5wdXNoKHdhbGtlci52YWx1ZSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbllhbGxpc3QucHJvdG90eXBlLnNsaWNlUmV2ZXJzZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICB0byA9IHRvIHx8IHRoaXMubGVuZ3RoXG4gIGlmICh0byA8IDApIHtcbiAgICB0byArPSB0aGlzLmxlbmd0aFxuICB9XG4gIGZyb20gPSBmcm9tIHx8IDBcbiAgaWYgKGZyb20gPCAwKSB7XG4gICAgZnJvbSArPSB0aGlzLmxlbmd0aFxuICB9XG4gIHZhciByZXQgPSBuZXcgWWFsbGlzdCgpXG4gIGlmICh0byA8IGZyb20gfHwgdG8gPCAwKSB7XG4gICAgcmV0dXJuIHJldFxuICB9XG4gIGlmIChmcm9tIDwgMCkge1xuICAgIGZyb20gPSAwXG4gIH1cbiAgaWYgKHRvID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0byA9IHRoaXMubGVuZ3RoXG4gIH1cbiAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoLCB3YWxrZXIgPSB0aGlzLnRhaWw7IHdhbGtlciAhPT0gbnVsbCAmJiBpID4gdG87IGktLSkge1xuICAgIHdhbGtlciA9IHdhbGtlci5wcmV2XG4gIH1cbiAgZm9yICg7IHdhbGtlciAhPT0gbnVsbCAmJiBpID4gZnJvbTsgaS0tLCB3YWxrZXIgPSB3YWxrZXIucHJldikge1xuICAgIHJldC5wdXNoKHdhbGtlci52YWx1ZSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbllhbGxpc3QucHJvdG90eXBlLnNwbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZGVsZXRlQ291bnQgLyosIC4uLm5vZGVzICovKSB7XG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgc3RhcnQgPSB0aGlzLmxlbmd0aCAtIDFcbiAgfVxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSB0aGlzLmxlbmd0aCArIHN0YXJ0O1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIHdhbGtlciA9IHRoaXMuaGVhZDsgd2Fsa2VyICE9PSBudWxsICYmIGkgPCBzdGFydDsgaSsrKSB7XG4gICAgd2Fsa2VyID0gd2Fsa2VyLm5leHRcbiAgfVxuXG4gIHZhciByZXQgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgd2Fsa2VyICYmIGkgPCBkZWxldGVDb3VudDsgaSsrKSB7XG4gICAgcmV0LnB1c2god2Fsa2VyLnZhbHVlKVxuICAgIHdhbGtlciA9IHRoaXMucmVtb3ZlTm9kZSh3YWxrZXIpXG4gIH1cbiAgaWYgKHdhbGtlciA9PT0gbnVsbCkge1xuICAgIHdhbGtlciA9IHRoaXMudGFpbFxuICB9XG5cbiAgaWYgKHdhbGtlciAhPT0gdGhpcy5oZWFkICYmIHdhbGtlciAhPT0gdGhpcy50YWlsKSB7XG4gICAgd2Fsa2VyID0gd2Fsa2VyLnByZXZcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgd2Fsa2VyID0gaW5zZXJ0KHRoaXMsIHdhbGtlciwgYXJndW1lbnRzW2ldKVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbllhbGxpc3QucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkID0gdGhpcy5oZWFkXG4gIHZhciB0YWlsID0gdGhpcy50YWlsXG4gIGZvciAodmFyIHdhbGtlciA9IGhlYWQ7IHdhbGtlciAhPT0gbnVsbDsgd2Fsa2VyID0gd2Fsa2VyLnByZXYpIHtcbiAgICB2YXIgcCA9IHdhbGtlci5wcmV2XG4gICAgd2Fsa2VyLnByZXYgPSB3YWxrZXIubmV4dFxuICAgIHdhbGtlci5uZXh0ID0gcFxuICB9XG4gIHRoaXMuaGVhZCA9IHRhaWxcbiAgdGhpcy50YWlsID0gaGVhZFxuICByZXR1cm4gdGhpc1xufVxuXG5mdW5jdGlvbiBpbnNlcnQgKHNlbGYsIG5vZGUsIHZhbHVlKSB7XG4gIHZhciBpbnNlcnRlZCA9IG5vZGUgPT09IHNlbGYuaGVhZCA/XG4gICAgbmV3IE5vZGUodmFsdWUsIG51bGwsIG5vZGUsIHNlbGYpIDpcbiAgICBuZXcgTm9kZSh2YWx1ZSwgbm9kZSwgbm9kZS5uZXh0LCBzZWxmKVxuXG4gIGlmIChpbnNlcnRlZC5uZXh0ID09PSBudWxsKSB7XG4gICAgc2VsZi50YWlsID0gaW5zZXJ0ZWRcbiAgfVxuICBpZiAoaW5zZXJ0ZWQucHJldiA9PT0gbnVsbCkge1xuICAgIHNlbGYuaGVhZCA9IGluc2VydGVkXG4gIH1cblxuICBzZWxmLmxlbmd0aCsrXG5cbiAgcmV0dXJuIGluc2VydGVkXG59XG5cbmZ1bmN0aW9uIHB1c2ggKHNlbGYsIGl0ZW0pIHtcbiAgc2VsZi50YWlsID0gbmV3IE5vZGUoaXRlbSwgc2VsZi50YWlsLCBudWxsLCBzZWxmKVxuICBpZiAoIXNlbGYuaGVhZCkge1xuICAgIHNlbGYuaGVhZCA9IHNlbGYudGFpbFxuICB9XG4gIHNlbGYubGVuZ3RoKytcbn1cblxuZnVuY3Rpb24gdW5zaGlmdCAoc2VsZiwgaXRlbSkge1xuICBzZWxmLmhlYWQgPSBuZXcgTm9kZShpdGVtLCBudWxsLCBzZWxmLmhlYWQsIHNlbGYpXG4gIGlmICghc2VsZi50YWlsKSB7XG4gICAgc2VsZi50YWlsID0gc2VsZi5oZWFkXG4gIH1cbiAgc2VsZi5sZW5ndGgrK1xufVxuXG5mdW5jdGlvbiBOb2RlICh2YWx1ZSwgcHJldiwgbmV4dCwgbGlzdCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICByZXR1cm4gbmV3IE5vZGUodmFsdWUsIHByZXYsIG5leHQsIGxpc3QpXG4gIH1cblxuICB0aGlzLmxpc3QgPSBsaXN0XG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxuXG4gIGlmIChwcmV2KSB7XG4gICAgcHJldi5uZXh0ID0gdGhpc1xuICAgIHRoaXMucHJldiA9IHByZXZcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByZXYgPSBudWxsXG4gIH1cblxuICBpZiAobmV4dCkge1xuICAgIG5leHQucHJldiA9IHRoaXNcbiAgICB0aGlzLm5leHQgPSBuZXh0XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5uZXh0ID0gbnVsbFxuICB9XG59XG5cbnRyeSB7XG4gIC8vIGFkZCBpZiBzdXBwb3J0IGZvciBTeW1ib2wuaXRlcmF0b3IgaXMgcHJlc2VudFxuICByZXF1aXJlKCcuL2l0ZXJhdG9yLmpzJykoWWFsbGlzdClcbn0gY2F0Y2ggKGVyKSB7fVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyogKGlnbm9yZWQpICovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9kYXRhL25hdGl2ZS1tb2R1bGVzLmpzb25cIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2RhdGEvcGx1Z2lucy5qc29uXCIpO1xuIiwiaW1wb3J0IHtcbiAgaXNCcm93c2Vyc1F1ZXJ5VmFsaWQsXG4gIFRhcmdldE5hbWVzLFxufSBmcm9tIFwiQGJhYmVsL2hlbHBlci1jb21waWxhdGlvbi10YXJnZXRzXCI7XG5cbmltcG9ydCB0eXBlIHtcbiAgQ29uZmlnRmlsZVNlYXJjaCxcbiAgQmFiZWxyY1NlYXJjaCxcbiAgSWdub3JlTGlzdCxcbiAgSWdub3JlSXRlbSxcbiAgUGx1Z2luTGlzdCxcbiAgUGx1Z2luSXRlbSxcbiAgUGx1Z2luVGFyZ2V0LFxuICBDb25maWdBcHBsaWNhYmxlVGVzdCxcbiAgU291cmNlTWFwc09wdGlvbixcbiAgU291cmNlVHlwZU9wdGlvbixcbiAgQ29tcGFjdE9wdGlvbixcbiAgUm9vdElucHV0U291cmNlTWFwT3B0aW9uLFxuICBOZXN0aW5nUGF0aCxcbiAgQ2FsbGVyTWV0YWRhdGEsXG4gIFJvb3RNb2RlLFxuICBUYXJnZXRzTGlzdE9yT2JqZWN0LFxuICBBc3N1bXB0aW9uTmFtZSxcbn0gZnJvbSBcIi4vb3B0aW9ucy50c1wiO1xuXG5pbXBvcnQgeyBhc3N1bXB0aW9uc05hbWVzIH0gZnJvbSBcIi4vb3B0aW9ucy50c1wiO1xuXG5leHBvcnQgdHlwZSB7IFJvb3RQYXRoIH0gZnJvbSBcIi4vb3B0aW9ucy50c1wiO1xuXG5leHBvcnQgdHlwZSBWYWxpZGF0b3JTZXQgPSB7XG4gIFtuYW1lOiBzdHJpbmddOiBWYWxpZGF0b3I8YW55Pjtcbn07XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRvcjxUPiA9IChsb2M6IE9wdGlvblBhdGgsIHZhbHVlOiB1bmtub3duKSA9PiBUO1xuXG5leHBvcnQgZnVuY3Rpb24gbXNnKGxvYzogTmVzdGluZ1BhdGggfCBHZW5lcmFsUGF0aCk6IHN0cmluZyB7XG4gIHN3aXRjaCAobG9jLnR5cGUpIHtcbiAgICBjYXNlIFwicm9vdFwiOlxuICAgICAgcmV0dXJuIGBgO1xuICAgIGNhc2UgXCJlbnZcIjpcbiAgICAgIHJldHVybiBgJHttc2cobG9jLnBhcmVudCl9LmVudltcIiR7bG9jLm5hbWV9XCJdYDtcbiAgICBjYXNlIFwib3ZlcnJpZGVzXCI6XG4gICAgICByZXR1cm4gYCR7bXNnKGxvYy5wYXJlbnQpfS5vdmVycmlkZXNbJHtsb2MuaW5kZXh9XWA7XG4gICAgY2FzZSBcIm9wdGlvblwiOlxuICAgICAgcmV0dXJuIGAke21zZyhsb2MucGFyZW50KX0uJHtsb2MubmFtZX1gO1xuICAgIGNhc2UgXCJhY2Nlc3NcIjpcbiAgICAgIHJldHVybiBgJHttc2cobG9jLnBhcmVudCl9WyR7SlNPTi5zdHJpbmdpZnkobG9jLm5hbWUpfV1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHNob3VsZCBub3QgaGFwcGVuIHdoZW4gY29kZSBpcyB0eXBlIGNoZWNrZWRcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXJ0aW9uIGZhaWx1cmU6IFVua25vd24gdHlwZSAke2xvYy50eXBlfWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY2Nlc3MobG9jOiBHZW5lcmFsUGF0aCwgbmFtZTogc3RyaW5nIHwgbnVtYmVyKTogQWNjZXNzUGF0aCB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogXCJhY2Nlc3NcIixcbiAgICBuYW1lLFxuICAgIHBhcmVudDogbG9jLFxuICB9O1xufVxuXG5leHBvcnQgdHlwZSBPcHRpb25QYXRoID0gUmVhZG9ubHk8e1xuICB0eXBlOiBcIm9wdGlvblwiO1xuICBuYW1lOiBzdHJpbmc7XG4gIHBhcmVudDogTmVzdGluZ1BhdGg7XG59PjtcbnR5cGUgQWNjZXNzUGF0aCA9IFJlYWRvbmx5PHtcbiAgdHlwZTogXCJhY2Nlc3NcIjtcbiAgbmFtZTogc3RyaW5nIHwgbnVtYmVyO1xuICBwYXJlbnQ6IEdlbmVyYWxQYXRoO1xufT47XG50eXBlIEdlbmVyYWxQYXRoID0gT3B0aW9uUGF0aCB8IEFjY2Vzc1BhdGg7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRSb290TW9kZShcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IFJvb3RNb2RlIHwgdm9pZCB7XG4gIGlmIChcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgdmFsdWUgIT09IFwicm9vdFwiICYmXG4gICAgdmFsdWUgIT09IFwidXB3YXJkXCIgJiZcbiAgICB2YWx1ZSAhPT0gXCJ1cHdhcmQtb3B0aW9uYWxcIlxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHttc2cobG9jKX0gbXVzdCBiZSBhIFwicm9vdFwiLCBcInVwd2FyZFwiLCBcInVwd2FyZC1vcHRpb25hbFwiIG9yIHVuZGVmaW5lZGAsXG4gICAgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRTb3VyY2VNYXBzKFxuICBsb2M6IE9wdGlvblBhdGgsXG4gIHZhbHVlOiB1bmtub3duLFxuKTogU291cmNlTWFwc09wdGlvbiB8IHZvaWQge1xuICBpZiAoXG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJib29sZWFuXCIgJiZcbiAgICB2YWx1ZSAhPT0gXCJpbmxpbmVcIiAmJlxuICAgIHZhbHVlICE9PSBcImJvdGhcIlxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHttc2cobG9jKX0gbXVzdCBiZSBhIGJvb2xlYW4sIFwiaW5saW5lXCIsIFwiYm90aFwiLCBvciB1bmRlZmluZWRgLFxuICAgICk7XG4gIH1cbiAgLy8gQHRzLWV4cGVjdC1lcnJvcjogVFMgY2FuIG9ubHkgbmFycm93IGRvd24gdGhlIHR5cGUgd2hlbiBcInN0cmljdE51bGxDaGVja1wiIGlzIHRydWVcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Q29tcGFjdChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IENvbXBhY3RPcHRpb24gfCB2b2lkIHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJiB2YWx1ZSAhPT0gXCJhdXRvXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBib29sZWFuLCBcImF1dG9cIiwgb3IgdW5kZWZpbmVkYCk7XG4gIH1cbiAgLy8gQHRzLWV4cGVjdC1lcnJvcjogVFMgY2FuIG9ubHkgbmFycm93IGRvd24gdGhlIHR5cGUgd2hlbiBcInN0cmljdE51bGxDaGVja1wiIGlzIHRydWVcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0U291cmNlVHlwZShcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IFNvdXJjZVR5cGVPcHRpb24gfCB2b2lkIHtcbiAgaWYgKFxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICB2YWx1ZSAhPT0gXCJtb2R1bGVcIiAmJlxuICAgIHZhbHVlICE9PSBcInNjcmlwdFwiICYmXG4gICAgdmFsdWUgIT09IFwidW5hbWJpZ3VvdXNcIlxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHttc2cobG9jKX0gbXVzdCBiZSBcIm1vZHVsZVwiLCBcInNjcmlwdFwiLCBcInVuYW1iaWd1b3VzXCIsIG9yIHVuZGVmaW5lZGAsXG4gICAgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDYWxsZXJNZXRhZGF0YShcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IENhbGxlck1ldGFkYXRhIHwgdW5kZWZpbmVkIHtcbiAgY29uc3Qgb2JqID0gYXNzZXJ0T2JqZWN0KGxvYywgdmFsdWUpO1xuICBpZiAob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgJHttc2cobG9jKX0gc2V0IGJ1dCBkb2VzIG5vdCBjb250YWluIFwibmFtZVwiIHByb3BlcnR5IHN0cmluZ2AsXG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcHJvcCBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICBjb25zdCBwcm9wTG9jID0gYWNjZXNzKGxvYywgcHJvcCk7XG4gICAgICBjb25zdCB2YWx1ZSA9IG9ialtwcm9wXTtcbiAgICAgIGlmIChcbiAgICAgICAgdmFsdWUgIT0gbnVsbCAmJlxuICAgICAgICB0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiICYmXG4gICAgICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICB0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCJcbiAgICAgICkge1xuICAgICAgICAvLyBOT1RFKGxvZ2FuKTogSSdtIGxpbWl0aW5nIHRoZSB0eXBlIGhlcmUgc28gdGhhdCB3ZSBjYW4gZ3VhcmFudGVlIHRoYXRcbiAgICAgICAgLy8gdGhlIFwiY2FsbGVyXCIgdmFsdWUgd2lsbCBzZXJpYWxpemUgdG8gSlNPTiBuaWNlbHkuIFdlIGNhbiBhbHdheXNcbiAgICAgICAgLy8gYWxsb3cgbW9yZSBjb21wbGV4IHN0cnVjdHVyZXMgbGF0ZXIgdGhvdWdoLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7bXNnKFxuICAgICAgICAgICAgcHJvcExvYyxcbiAgICAgICAgICApfSBtdXN0IGJlIG51bGwsIHVuZGVmaW5lZCwgYSBib29sZWFuLCBhIHN0cmluZywgb3IgYSBudW1iZXIuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gQHRzLWV4cGVjdC1lcnJvciB0b2RvKGZsb3ctPnRzKVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRJbnB1dFNvdXJjZU1hcChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IFJvb3RJbnB1dFNvdXJjZU1hcE9wdGlvbiB7XG4gIGlmIChcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJlxuICAgICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgIXZhbHVlKVxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBib29sZWFuLCBvYmplY3QsIG9yIHVuZGVmaW5lZGApO1xuICB9XG4gIHJldHVybiB2YWx1ZSBhcyBSb290SW5wdXRTb3VyY2VNYXBPcHRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRTdHJpbmcobG9jOiBHZW5lcmFsUGF0aCwgdmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCB2b2lkIHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBtdXN0IGJlIGEgc3RyaW5nLCBvciB1bmRlZmluZWRgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRGdW5jdGlvbihcbiAgbG9jOiBHZW5lcmFsUGF0aCxcbiAgdmFsdWU6IHVua25vd24sXG4pOiBGdW5jdGlvbiB8IHZvaWQge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhIGZ1bmN0aW9uLCBvciB1bmRlZmluZWRgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRCb29sZWFuKFxuICBsb2M6IEdlbmVyYWxQYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IGJvb2xlYW4gfCB2b2lkIHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIikge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhIGJvb2xlYW4sIG9yIHVuZGVmaW5lZGApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE9iamVjdChcbiAgbG9jOiBHZW5lcmFsUGF0aCxcbiAgdmFsdWU6IHVua25vd24sXG4pOiB7IHJlYWRvbmx5IFtrZXk6IHN0cmluZ106IHVua25vd24gfSB8IHZvaWQge1xuICBpZiAoXG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgIXZhbHVlKVxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYW4gb2JqZWN0LCBvciB1bmRlZmluZWRgKTtcbiAgfVxuICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvZG8oZmxvdy0+dHMpIHZhbHVlIGlzIHN0aWxsIHR5cGVkIGFzIHVua25vd24sIGFsc28gYXNzZXJ0IGZ1bmN0aW9uIHR5cGljYWxseSBzaG91bGQgbm90IHJldHVybiBhIHZhbHVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEFycmF5PFQ+KFxuICBsb2M6IEdlbmVyYWxQYXRoLFxuICB2YWx1ZTogQXJyYXk8VD4gfCB1bmRlZmluZWQgfCBudWxsLFxuKTogUmVhZG9ubHlBcnJheTxUPiB8IHVuZGVmaW5lZCB8IG51bGwge1xuICBpZiAodmFsdWUgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYW4gYXJyYXksIG9yIHVuZGVmaW5lZGApO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydElnbm9yZUxpc3QoXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd25bXSB8IHVuZGVmaW5lZCxcbik6IElnbm9yZUxpc3QgfCB2b2lkIHtcbiAgY29uc3QgYXJyID0gYXNzZXJ0QXJyYXkobG9jLCB2YWx1ZSk7XG4gIGFycj8uZm9yRWFjaCgoaXRlbSwgaSkgPT4gYXNzZXJ0SWdub3JlSXRlbShhY2Nlc3MobG9jLCBpKSwgaXRlbSkpO1xuICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvZG8oZmxvdy0+dHMpXG4gIHJldHVybiBhcnI7XG59XG5mdW5jdGlvbiBhc3NlcnRJZ25vcmVJdGVtKGxvYzogR2VuZXJhbFBhdGgsIHZhbHVlOiB1bmtub3duKTogSWdub3JlSXRlbSB7XG4gIGlmIChcbiAgICB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICEodmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhcbiAgICAgICAgbG9jLFxuICAgICAgKX0gbXVzdCBiZSBhbiBhcnJheSBvZiBzdHJpbmcvRnVuY3Rpb24vUmVnRXhwIHZhbHVlcywgb3IgdW5kZWZpbmVkYCxcbiAgICApO1xuICB9XG4gIHJldHVybiB2YWx1ZSBhcyBJZ25vcmVJdGVtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Q29uZmlnQXBwbGljYWJsZVRlc3QoXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd24sXG4pOiBDb25maWdBcHBsaWNhYmxlVGVzdCB8IHZvaWQge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgaWYgKCFjaGVja1ZhbGlkVGVzdChpdGVtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7bXNnKGFjY2Vzcyhsb2MsIGkpKX0gbXVzdCBiZSBhIHN0cmluZy9GdW5jdGlvbi9SZWdFeHAuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmICghY2hlY2tWYWxpZFRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBzdHJpbmcvRnVuY3Rpb24vUmVnRXhwLCBvciBhbiBhcnJheSBvZiB0aG9zZWAsXG4gICAgKTtcbiAgfVxuICByZXR1cm4gdmFsdWUgYXMgQ29uZmlnQXBwbGljYWJsZVRlc3Q7XG59XG5cbmZ1bmN0aW9uIGNoZWNrVmFsaWRUZXN0KHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgc3RyaW5nIHwgRnVuY3Rpb24gfCBSZWdFeHAge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiIHx8XG4gICAgdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHBcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydENvbmZpZ0ZpbGVTZWFyY2goXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd24sXG4pOiBDb25maWdGaWxlU2VhcmNoIHwgdm9pZCB7XG4gIGlmIChcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJlxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIlxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHttc2cobG9jKX0gbXVzdCBiZSBhIHVuZGVmaW5lZCwgYSBib29sZWFuLCBhIHN0cmluZywgYCArXG4gICAgICAgIGBnb3QgJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCxcbiAgICApO1xuICB9XG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IFRTIGNhbiBvbmx5IG5hcnJvdyBkb3duIHRoZSB0eXBlIHdoZW4gXCJzdHJpY3ROdWxsQ2hlY2tcIiBpcyB0cnVlXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEJhYmVscmNTZWFyY2goXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd24sXG4pOiBCYWJlbHJjU2VhcmNoIHwgdm9pZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBjYW4gb25seSBuYXJyb3cgZG93biB0aGUgdHlwZSB3aGVuIFwic3RyaWN0TnVsbENoZWNrXCIgaXMgdHJ1ZVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHZhbHVlLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGlmICghY2hlY2tWYWxpZFRlc3QoaXRlbSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke21zZyhhY2Nlc3MobG9jLCBpKSl9IG11c3QgYmUgYSBzdHJpbmcvRnVuY3Rpb24vUmVnRXhwLmAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIWNoZWNrVmFsaWRUZXN0KHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIGEgdW5kZWZpbmVkLCBhIGJvb2xlYW4sIGEgc3RyaW5nL0Z1bmN0aW9uL1JlZ0V4cCBgICtcbiAgICAgICAgYG9yIGFuIGFycmF5IG9mIHRob3NlLCBnb3QgJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSBhcyBhbnkpfWAsXG4gICAgKTtcbiAgfVxuICByZXR1cm4gdmFsdWUgYXMgQmFiZWxyY1NlYXJjaDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFBsdWdpbkxpc3QoXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd25bXSB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBQbHVnaW5MaXN0IHwgdm9pZCB7XG4gIGNvbnN0IGFyciA9IGFzc2VydEFycmF5KGxvYywgdmFsdWUpO1xuICBpZiAoYXJyKSB7XG4gICAgLy8gTG9vcCBpbnN0ZWFkIG9mIHVzaW5nIGAubWFwYCBpbiBvcmRlciB0byBwcmVzZXJ2ZSBvYmplY3QgaWRlbnRpdHlcbiAgICAvLyBmb3IgcGx1Z2luIGFycmF5IGZvciB1c2UgZHVyaW5nIGNvbmZpZyBjaGFpbiBwcm9jZXNzaW5nLlxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiBhc3NlcnRQbHVnaW5JdGVtKGFjY2Vzcyhsb2MsIGkpLCBpdGVtKSk7XG4gIH1cbiAgcmV0dXJuIGFyciBhcyBhbnk7XG59XG5mdW5jdGlvbiBhc3NlcnRQbHVnaW5JdGVtKGxvYzogR2VuZXJhbFBhdGgsIHZhbHVlOiB1bmtub3duKTogUGx1Z2luSXRlbSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBpbmNsdWRlIGFuIG9iamVjdGApO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZS5sZW5ndGggPiAzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG1heSBvbmx5IGJlIGEgdHdvLXR1cGxlIG9yIHRocmVlLXR1cGxlYCk7XG4gICAgfVxuXG4gICAgYXNzZXJ0UGx1Z2luVGFyZ2V0KGFjY2Vzcyhsb2MsIDApLCB2YWx1ZVswXSk7XG5cbiAgICBpZiAodmFsdWUubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3Qgb3B0cyA9IHZhbHVlWzFdO1xuICAgICAgaWYgKFxuICAgICAgICBvcHRzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgb3B0cyAhPT0gZmFsc2UgJiZcbiAgICAgICAgKHR5cGVvZiBvcHRzICE9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkob3B0cykgfHwgb3B0cyA9PT0gbnVsbClcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7bXNnKGFjY2Vzcyhsb2MsIDEpKX0gbXVzdCBiZSBhbiBvYmplY3QsIGZhbHNlLCBvciB1bmRlZmluZWRgLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFsdWUubGVuZ3RoID09PSAzKSB7XG4gICAgICBjb25zdCBuYW1lID0gdmFsdWVbMl07XG4gICAgICBpZiAobmFtZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHttc2coYWNjZXNzKGxvYywgMikpfSBtdXN0IGJlIGEgc3RyaW5nLCBvciB1bmRlZmluZWRgLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhc3NlcnRQbHVnaW5UYXJnZXQobG9jLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBAdHMtZXhwZWN0LWVycm9yIHRvZG8oZmxvdy0+dHMpXG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGFzc2VydFBsdWdpblRhcmdldChsb2M6IEdlbmVyYWxQYXRoLCB2YWx1ZTogdW5rbm93bik6IFBsdWdpblRhcmdldCB7XG4gIGlmIChcbiAgICAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8ICF2YWx1ZSkgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIlxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IG11c3QgYmUgYSBzdHJpbmcsIG9iamVjdCwgZnVuY3Rpb25gKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRUYXJnZXRzKFxuICBsb2M6IEdlbmVyYWxQYXRoLFxuICB2YWx1ZTogYW55LFxuKTogVGFyZ2V0c0xpc3RPck9iamVjdCB7XG4gIGlmIChpc0Jyb3dzZXJzUXVlcnlWYWxpZCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8ICF2YWx1ZSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIGEgc3RyaW5nLCBhbiBhcnJheSBvZiBzdHJpbmdzIG9yIGFuIG9iamVjdGAsXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGJyb3dzZXJzTG9jID0gYWNjZXNzKGxvYywgXCJicm93c2Vyc1wiKTtcbiAgY29uc3QgZXNtb2R1bGVzTG9jID0gYWNjZXNzKGxvYywgXCJlc21vZHVsZXNcIik7XG5cbiAgYXNzZXJ0QnJvd3NlcnNMaXN0KGJyb3dzZXJzTG9jLCB2YWx1ZS5icm93c2Vycyk7XG4gIGFzc2VydEJvb2xlYW4oZXNtb2R1bGVzTG9jLCB2YWx1ZS5lc21vZHVsZXMpO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xuICAgIGNvbnN0IHZhbCA9IHZhbHVlW2tleV07XG4gICAgY29uc3Qgc3ViTG9jID0gYWNjZXNzKGxvYywga2V5KTtcblxuICAgIGlmIChrZXkgPT09IFwiZXNtb2R1bGVzXCIpIGFzc2VydEJvb2xlYW4oc3ViTG9jLCB2YWwpO1xuICAgIGVsc2UgaWYgKGtleSA9PT0gXCJicm93c2Vyc1wiKSBhc3NlcnRCcm93c2Vyc0xpc3Qoc3ViTG9jLCB2YWwpO1xuICAgIGVsc2UgaWYgKCFPYmplY3QuaGFzT3duKFRhcmdldE5hbWVzLCBrZXkpKSB7XG4gICAgICBjb25zdCB2YWxpZFRhcmdldHMgPSBPYmplY3Qua2V5cyhUYXJnZXROYW1lcykuam9pbihcIiwgXCIpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgJHttc2coXG4gICAgICAgICAgc3ViTG9jLFxuICAgICAgICApfSBpcyBub3QgYSB2YWxpZCB0YXJnZXQuIFN1cHBvcnRlZCB0YXJnZXRzIGFyZSAke3ZhbGlkVGFyZ2V0c31gLFxuICAgICAgKTtcbiAgICB9IGVsc2UgYXNzZXJ0QnJvd3NlclZlcnNpb24oc3ViTG9jLCB2YWwpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRCcm93c2Vyc0xpc3QobG9jOiBHZW5lcmFsUGF0aCwgdmFsdWU6IHVua25vd24pIHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWlzQnJvd3NlcnNRdWVyeVZhbGlkKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke21zZyhsb2MpfSBtdXN0IGJlIHVuZGVmaW5lZCwgYSBzdHJpbmcgb3IgYW4gYXJyYXkgb2Ygc3RyaW5nc2AsXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRCcm93c2VyVmVyc2lvbihsb2M6IEdlbmVyYWxQYXRoLCB2YWx1ZTogdW5rbm93bikge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmIE1hdGgucm91bmQodmFsdWUpID09PSB2YWx1ZSkgcmV0dXJuO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIGludGVnZXIgbnVtYmVyYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRBc3N1bXB0aW9ucyhcbiAgbG9jOiBHZW5lcmFsUGF0aCxcbiAgdmFsdWU6IHsgW2tleTogc3RyaW5nXTogdW5rbm93biB9LFxuKTogeyBbbmFtZTogc3RyaW5nXTogYm9vbGVhbiB9IHwgdm9pZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2cobG9jKX0gbXVzdCBiZSBhbiBvYmplY3Qgb3IgdW5kZWZpbmVkLmApO1xuICB9XG5cbiAgLy8gdG9kbyhmbG93LT50cyk6IHJlbW92ZSBhbnlcbiAgbGV0IHJvb3Q6IGFueSA9IGxvYztcbiAgZG8ge1xuICAgIHJvb3QgPSByb290LnBhcmVudDtcbiAgfSB3aGlsZSAocm9vdC50eXBlICE9PSBcInJvb3RcIik7XG4gIGNvbnN0IGluUHJlc2V0ID0gcm9vdC5zb3VyY2UgPT09IFwicHJlc2V0XCI7XG5cbiAgZm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xuICAgIGNvbnN0IHN1YkxvYyA9IGFjY2Vzcyhsb2MsIG5hbWUpO1xuICAgIGlmICghYXNzdW1wdGlvbnNOYW1lcy5oYXMobmFtZSBhcyBBc3N1bXB0aW9uTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHttc2coc3ViTG9jKX0gaXMgbm90IGEgc3VwcG9ydGVkIGFzc3VtcHRpb24uYCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWVbbmFtZV0gIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKHN1YkxvYyl9IG11c3QgYmUgYSBib29sZWFuLmApO1xuICAgIH1cbiAgICBpZiAoaW5QcmVzZXQgJiYgdmFsdWVbbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21zZyhzdWJMb2MpfSBjYW5ub3QgYmUgc2V0IHRvICdmYWxzZScgaW5zaWRlIHByZXNldHMuYCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gQHRzLWV4cGVjdC1lcnJvciB0b2RvKGZsb3ctPnRzKVxuICByZXR1cm4gdmFsdWU7XG59XG4iLCJpbXBvcnQgdHlwZSB7IElucHV0VGFyZ2V0cywgVGFyZ2V0cyB9IGZyb20gXCJAYmFiZWwvaGVscGVyLWNvbXBpbGF0aW9uLXRhcmdldHNcIjtcblxuaW1wb3J0IHR5cGUgeyBDb25maWdJdGVtIH0gZnJvbSBcIi4uL2l0ZW0udHNcIjtcbmltcG9ydCB0eXBlIFBsdWdpbiBmcm9tIFwiLi4vcGx1Z2luLnRzXCI7XG5cbmltcG9ydCByZW1vdmVkIGZyb20gXCIuL3JlbW92ZWQudHNcIjtcbmltcG9ydCB7XG4gIG1zZyxcbiAgYWNjZXNzLFxuICBhc3NlcnRTdHJpbmcsXG4gIGFzc2VydEJvb2xlYW4sXG4gIGFzc2VydE9iamVjdCxcbiAgYXNzZXJ0QXJyYXksXG4gIGFzc2VydENhbGxlck1ldGFkYXRhLFxuICBhc3NlcnRJbnB1dFNvdXJjZU1hcCxcbiAgYXNzZXJ0SWdub3JlTGlzdCxcbiAgYXNzZXJ0UGx1Z2luTGlzdCxcbiAgYXNzZXJ0Q29uZmlnQXBwbGljYWJsZVRlc3QsXG4gIGFzc2VydENvbmZpZ0ZpbGVTZWFyY2gsXG4gIGFzc2VydEJhYmVscmNTZWFyY2gsXG4gIGFzc2VydEZ1bmN0aW9uLFxuICBhc3NlcnRSb290TW9kZSxcbiAgYXNzZXJ0U291cmNlTWFwcyxcbiAgYXNzZXJ0Q29tcGFjdCxcbiAgYXNzZXJ0U291cmNlVHlwZSxcbiAgYXNzZXJ0VGFyZ2V0cyxcbiAgYXNzZXJ0QXNzdW1wdGlvbnMsXG59IGZyb20gXCIuL29wdGlvbi1hc3NlcnRpb25zLnRzXCI7XG5pbXBvcnQgdHlwZSB7XG4gIFZhbGlkYXRvclNldCxcbiAgVmFsaWRhdG9yLFxuICBPcHRpb25QYXRoLFxufSBmcm9tIFwiLi9vcHRpb24tYXNzZXJ0aW9ucy50c1wiO1xuaW1wb3J0IHR5cGUgeyBVbmxvYWRlZERlc2NyaXB0b3IgfSBmcm9tIFwiLi4vY29uZmlnLWRlc2NyaXB0b3JzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbkFQSSB9IGZyb20gXCIuLi9oZWxwZXJzL2NvbmZpZy1hcGkudHNcIjtcbmltcG9ydCB0eXBlIHsgUGFyc2VyT3B0aW9ucyB9IGZyb20gXCJAYmFiZWwvcGFyc2VyXCI7XG5pbXBvcnQgdHlwZSB7IEdlbmVyYXRvck9wdGlvbnMgfSBmcm9tIFwiQGJhYmVsL2dlbmVyYXRvclwiO1xuaW1wb3J0IENvbmZpZ0Vycm9yIGZyb20gXCIuLi8uLi9lcnJvcnMvY29uZmlnLWVycm9yLnRzXCI7XG5cbmNvbnN0IFJPT1RfVkFMSURBVE9SUzogVmFsaWRhdG9yU2V0ID0ge1xuICBjd2Q6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImN3ZFwiXT4sXG4gIHJvb3Q6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInJvb3RcIl0+LFxuICByb290TW9kZTogYXNzZXJ0Um9vdE1vZGUgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJyb290TW9kZVwiXT4sXG4gIGNvbmZpZ0ZpbGU6IGFzc2VydENvbmZpZ0ZpbGVTZWFyY2ggYXMgVmFsaWRhdG9yPFxuICAgIFZhbGlkYXRlZE9wdGlvbnNbXCJjb25maWdGaWxlXCJdXG4gID4sXG5cbiAgY2FsbGVyOiBhc3NlcnRDYWxsZXJNZXRhZGF0YSBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImNhbGxlclwiXT4sXG4gIGZpbGVuYW1lOiBhc3NlcnRTdHJpbmcgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJmaWxlbmFtZVwiXT4sXG4gIGZpbGVuYW1lUmVsYXRpdmU6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImZpbGVuYW1lUmVsYXRpdmVcIl1cbiAgPixcbiAgY29kZTogYXNzZXJ0Qm9vbGVhbiBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImNvZGVcIl0+LFxuICBhc3Q6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJhc3RcIl0+LFxuXG4gIGNsb25lSW5wdXRBc3Q6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJjbG9uZUlucHV0QXN0XCJdPixcblxuICBlbnZOYW1lOiBhc3NlcnRTdHJpbmcgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJlbnZOYW1lXCJdPixcbn07XG5cbmNvbnN0IEJBQkVMUkNfVkFMSURBVE9SUzogVmFsaWRhdG9yU2V0ID0ge1xuICBiYWJlbHJjOiBhc3NlcnRCb29sZWFuIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiYmFiZWxyY1wiXT4sXG4gIGJhYmVscmNSb290czogYXNzZXJ0QmFiZWxyY1NlYXJjaCBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImJhYmVscmNSb290c1wiXVxuICA+LFxufTtcblxuY29uc3QgTk9OUFJFU0VUX1ZBTElEQVRPUlM6IFZhbGlkYXRvclNldCA9IHtcbiAgZXh0ZW5kczogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiZXh0ZW5kc1wiXT4sXG4gIGlnbm9yZTogYXNzZXJ0SWdub3JlTGlzdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImlnbm9yZVwiXT4sXG4gIG9ubHk6IGFzc2VydElnbm9yZUxpc3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJvbmx5XCJdPixcblxuICB0YXJnZXRzOiBhc3NlcnRUYXJnZXRzIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1widGFyZ2V0c1wiXT4sXG4gIGJyb3dzZXJzbGlzdENvbmZpZ0ZpbGU6IGFzc2VydENvbmZpZ0ZpbGVTZWFyY2ggYXMgVmFsaWRhdG9yPFxuICAgIFZhbGlkYXRlZE9wdGlvbnNbXCJicm93c2Vyc2xpc3RDb25maWdGaWxlXCJdXG4gID4sXG4gIGJyb3dzZXJzbGlzdEVudjogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxcbiAgICBWYWxpZGF0ZWRPcHRpb25zW1wiYnJvd3NlcnNsaXN0RW52XCJdXG4gID4sXG59O1xuXG5jb25zdCBDT01NT05fVkFMSURBVE9SUzogVmFsaWRhdG9yU2V0ID0ge1xuICAvLyBUT0RPOiBTaG91bGQgJ2lucHV0U291cmNlTWFwJyBiZSBtb3ZlZCB0byBiZSBhIHJvb3Qtb25seSBvcHRpb24/XG4gIC8vIFdlIG1heSB3YW50IGEgYm9vbGVhbi1vbmx5IHZlcnNpb24gdG8gYmUgYSBjb21tb24gb3B0aW9uLCB3aXRoIHRoZVxuICAvLyBvYmplY3Qgb25seSBhbGxvd2VkIGFzIGEgcm9vdCBjb25maWcgYXJndW1lbnQuXG4gIGlucHV0U291cmNlTWFwOiBhc3NlcnRJbnB1dFNvdXJjZU1hcCBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImlucHV0U291cmNlTWFwXCJdXG4gID4sXG4gIHByZXNldHM6IGFzc2VydFBsdWdpbkxpc3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJwcmVzZXRzXCJdPixcbiAgcGx1Z2luczogYXNzZXJ0UGx1Z2luTGlzdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInBsdWdpbnNcIl0+LFxuICBwYXNzUGVyUHJlc2V0OiBhc3NlcnRCb29sZWFuIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wicGFzc1BlclByZXNldFwiXT4sXG4gIGFzc3VtcHRpb25zOiBhc3NlcnRBc3N1bXB0aW9ucyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImFzc3VtcHRpb25zXCJdPixcblxuICBlbnY6IGFzc2VydEVudlNldCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcImVudlwiXT4sXG4gIG92ZXJyaWRlczogYXNzZXJ0T3ZlcnJpZGVzTGlzdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcIm92ZXJyaWRlc1wiXT4sXG5cbiAgLy8gV2UgY291bGQgbGltaXQgdGhlc2UgdG8gJ292ZXJyaWRlcycgYmxvY2tzLCBidXQgaXQncyBub3QgY2xlYXIgd2h5IHdlJ2RcbiAgLy8gYm90aGVyLCB3aGVuIHRoZSBhYmlsaXR5IHRvIGxpbWl0IGEgY29uZmlnIHRvIGEgc3BlY2lmaWMgc2V0IG9mIGZpbGVzXG4gIC8vIGlzIGEgZmFpcmx5IGdlbmVyYWwgdXNlZnVsIGZlYXR1cmUuXG4gIHRlc3Q6IGFzc2VydENvbmZpZ0FwcGxpY2FibGVUZXN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1widGVzdFwiXT4sXG4gIGluY2x1ZGU6IGFzc2VydENvbmZpZ0FwcGxpY2FibGVUZXN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiaW5jbHVkZVwiXT4sXG4gIGV4Y2x1ZGU6IGFzc2VydENvbmZpZ0FwcGxpY2FibGVUZXN0IGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiZXhjbHVkZVwiXT4sXG5cbiAgcmV0YWluTGluZXM6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJyZXRhaW5MaW5lc1wiXT4sXG4gIGNvbW1lbnRzOiBhc3NlcnRCb29sZWFuIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiY29tbWVudHNcIl0+LFxuICBzaG91bGRQcmludENvbW1lbnQ6IGFzc2VydEZ1bmN0aW9uIGFzIFZhbGlkYXRvcjxcbiAgICBWYWxpZGF0ZWRPcHRpb25zW1wic2hvdWxkUHJpbnRDb21tZW50XCJdXG4gID4sXG4gIGNvbXBhY3Q6IGFzc2VydENvbXBhY3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJjb21wYWN0XCJdPixcbiAgbWluaWZpZWQ6IGFzc2VydEJvb2xlYW4gYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJtaW5pZmllZFwiXT4sXG4gIGF1eGlsaWFyeUNvbW1lbnRCZWZvcmU6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8XG4gICAgVmFsaWRhdGVkT3B0aW9uc1tcImF1eGlsaWFyeUNvbW1lbnRCZWZvcmVcIl1cbiAgPixcbiAgYXV4aWxpYXJ5Q29tbWVudEFmdGVyOiBhc3NlcnRTdHJpbmcgYXMgVmFsaWRhdG9yPFxuICAgIFZhbGlkYXRlZE9wdGlvbnNbXCJhdXhpbGlhcnlDb21tZW50QWZ0ZXJcIl1cbiAgPixcbiAgc291cmNlVHlwZTogYXNzZXJ0U291cmNlVHlwZSBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInNvdXJjZVR5cGVcIl0+LFxuICB3cmFwUGx1Z2luVmlzaXRvck1ldGhvZDogYXNzZXJ0RnVuY3Rpb24gYXMgVmFsaWRhdG9yPFxuICAgIFZhbGlkYXRlZE9wdGlvbnNbXCJ3cmFwUGx1Z2luVmlzaXRvck1ldGhvZFwiXVxuICA+LFxuICBoaWdobGlnaHRDb2RlOiBhc3NlcnRCb29sZWFuIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wiaGlnaGxpZ2h0Q29kZVwiXT4sXG4gIHNvdXJjZU1hcHM6IGFzc2VydFNvdXJjZU1hcHMgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJzb3VyY2VNYXBzXCJdPixcbiAgc291cmNlTWFwOiBhc3NlcnRTb3VyY2VNYXBzIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wic291cmNlTWFwXCJdPixcbiAgc291cmNlRmlsZU5hbWU6IGFzc2VydFN0cmluZyBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInNvdXJjZUZpbGVOYW1lXCJdPixcbiAgc291cmNlUm9vdDogYXNzZXJ0U3RyaW5nIGFzIFZhbGlkYXRvcjxWYWxpZGF0ZWRPcHRpb25zW1wic291cmNlUm9vdFwiXT4sXG4gIHBhcnNlck9wdHM6IGFzc2VydE9iamVjdCBhcyBWYWxpZGF0b3I8VmFsaWRhdGVkT3B0aW9uc1tcInBhcnNlck9wdHNcIl0+LFxuICBnZW5lcmF0b3JPcHRzOiBhc3NlcnRPYmplY3QgYXMgVmFsaWRhdG9yPFZhbGlkYXRlZE9wdGlvbnNbXCJnZW5lcmF0b3JPcHRzXCJdPixcbn07XG5pZiAoIXByb2Nlc3MuZW52LkJBQkVMXzhfQlJFQUtJTkcpIHtcbiAgT2JqZWN0LmFzc2lnbihDT01NT05fVkFMSURBVE9SUywge1xuICAgIGdldE1vZHVsZUlkOiBhc3NlcnRGdW5jdGlvbixcbiAgICBtb2R1bGVSb290OiBhc3NlcnRTdHJpbmcsXG4gICAgbW9kdWxlSWRzOiBhc3NlcnRCb29sZWFuLFxuICAgIG1vZHVsZUlkOiBhc3NlcnRTdHJpbmcsXG4gIH0pO1xufVxuXG5leHBvcnQgdHlwZSBJbnB1dE9wdGlvbnMgPSBWYWxpZGF0ZWRPcHRpb25zO1xuXG5leHBvcnQgdHlwZSBWYWxpZGF0ZWRPcHRpb25zID0ge1xuICBjd2Q/OiBzdHJpbmc7XG4gIGZpbGVuYW1lPzogc3RyaW5nO1xuICBmaWxlbmFtZVJlbGF0aXZlPzogc3RyaW5nO1xuICBiYWJlbHJjPzogYm9vbGVhbjtcbiAgYmFiZWxyY1Jvb3RzPzogQmFiZWxyY1NlYXJjaDtcbiAgY29uZmlnRmlsZT86IENvbmZpZ0ZpbGVTZWFyY2g7XG4gIHJvb3Q/OiBzdHJpbmc7XG4gIHJvb3RNb2RlPzogUm9vdE1vZGU7XG4gIGNvZGU/OiBib29sZWFuO1xuICBhc3Q/OiBib29sZWFuO1xuICBjbG9uZUlucHV0QXN0PzogYm9vbGVhbjtcbiAgaW5wdXRTb3VyY2VNYXA/OiBSb290SW5wdXRTb3VyY2VNYXBPcHRpb247XG4gIGVudk5hbWU/OiBzdHJpbmc7XG4gIGNhbGxlcj86IENhbGxlck1ldGFkYXRhO1xuICBleHRlbmRzPzogc3RyaW5nO1xuICBlbnY/OiBFbnZTZXQ8VmFsaWRhdGVkT3B0aW9ucz47XG4gIGlnbm9yZT86IElnbm9yZUxpc3Q7XG4gIG9ubHk/OiBJZ25vcmVMaXN0O1xuICBvdmVycmlkZXM/OiBPdmVycmlkZXNMaXN0O1xuICBzaG93SWdub3JlZEZpbGVzPzogYm9vbGVhbjtcbiAgLy8gR2VuZXJhbGx5IHZlcmlmeSBpZiBhIGdpdmVuIGNvbmZpZyBvYmplY3Qgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGdpdmVuIGZpbGUuXG4gIHRlc3Q/OiBDb25maWdBcHBsaWNhYmxlVGVzdDtcbiAgaW5jbHVkZT86IENvbmZpZ0FwcGxpY2FibGVUZXN0O1xuICBleGNsdWRlPzogQ29uZmlnQXBwbGljYWJsZVRlc3Q7XG4gIHByZXNldHM/OiBQbHVnaW5MaXN0O1xuICBwbHVnaW5zPzogUGx1Z2luTGlzdDtcbiAgcGFzc1BlclByZXNldD86IGJvb2xlYW47XG4gIGFzc3VtcHRpb25zPzoge1xuICAgIFtuYW1lOiBzdHJpbmddOiBib29sZWFuO1xuICB9O1xuICAvLyBicm93c2Vyc2xpc3RzLXJlbGF0ZWQgb3B0aW9uc1xuICB0YXJnZXRzPzogVGFyZ2V0c0xpc3RPck9iamVjdDtcbiAgYnJvd3NlcnNsaXN0Q29uZmlnRmlsZT86IENvbmZpZ0ZpbGVTZWFyY2g7XG4gIGJyb3dzZXJzbGlzdEVudj86IHN0cmluZztcbiAgLy8gT3B0aW9ucyBmb3IgQGJhYmVsL2dlbmVyYXRvclxuICByZXRhaW5MaW5lcz86IGJvb2xlYW47XG4gIGNvbW1lbnRzPzogYm9vbGVhbjtcbiAgc2hvdWxkUHJpbnRDb21tZW50PzogRnVuY3Rpb247XG4gIGNvbXBhY3Q/OiBDb21wYWN0T3B0aW9uO1xuICBtaW5pZmllZD86IGJvb2xlYW47XG4gIGF1eGlsaWFyeUNvbW1lbnRCZWZvcmU/OiBzdHJpbmc7XG4gIGF1eGlsaWFyeUNvbW1lbnRBZnRlcj86IHN0cmluZztcbiAgLy8gUGFyc2VyXG4gIHNvdXJjZVR5cGU/OiBTb3VyY2VUeXBlT3B0aW9uO1xuICB3cmFwUGx1Z2luVmlzaXRvck1ldGhvZD86IEZ1bmN0aW9uO1xuICBoaWdobGlnaHRDb2RlPzogYm9vbGVhbjtcbiAgLy8gU291cmNlbWFwIGdlbmVyYXRpb24gb3B0aW9ucy5cbiAgc291cmNlTWFwcz86IFNvdXJjZU1hcHNPcHRpb247XG4gIHNvdXJjZU1hcD86IFNvdXJjZU1hcHNPcHRpb247XG4gIHNvdXJjZUZpbGVOYW1lPzogc3RyaW5nO1xuICBzb3VyY2VSb290Pzogc3RyaW5nO1xuICAvLyBEZXByZWNhdGUgdG9wIGxldmVsIHBhcnNlck9wdHNcbiAgcGFyc2VyT3B0cz86IFBhcnNlck9wdGlvbnM7XG4gIC8vIERlcHJlY2F0ZSB0b3AgbGV2ZWwgZ2VuZXJhdG9yT3B0c1xuICBnZW5lcmF0b3JPcHRzPzogR2VuZXJhdG9yT3B0aW9ucztcbn07XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRPcHRpb25zID0ge1xuICByZWFkb25seSB0YXJnZXRzOiBUYXJnZXRzO1xufSAmIE9taXQ8VmFsaWRhdGVkT3B0aW9ucywgXCJ0YXJnZXRzXCI+O1xuXG5leHBvcnQgdHlwZSBDYWxsZXJNZXRhZGF0YSA9IHtcbiAgLy8gSWYgJ2NhbGxlcicgaXMgc3BlY2lmaWVkLCByZXF1aXJlIHRoYXQgdGhlIG5hbWUgaXMgZ2l2ZW4gZm9yIGRlYnVnZ2luZ1xuICAvLyBtZXNzYWdlcy5cbiAgbmFtZTogc3RyaW5nO1xufTtcbmV4cG9ydCB0eXBlIEVudlNldDxUPiA9IHtcbiAgW3g6IHN0cmluZ106IFQ7XG59O1xuZXhwb3J0IHR5cGUgSWdub3JlSXRlbSA9XG4gIHwgc3RyaW5nXG4gIHwgUmVnRXhwXG4gIHwgKChcbiAgICAgIHBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICAgIGNvbnRleHQ6IHsgZGlybmFtZTogc3RyaW5nOyBjYWxsZXI6IENhbGxlck1ldGFkYXRhOyBlbnZOYW1lOiBzdHJpbmcgfSxcbiAgICApID0+IHVua25vd24pO1xuZXhwb3J0IHR5cGUgSWdub3JlTGlzdCA9IFJlYWRvbmx5QXJyYXk8SWdub3JlSXRlbT47XG5cbmV4cG9ydCB0eXBlIFBsdWdpbk9wdGlvbnMgPSBvYmplY3QgfCB2b2lkIHwgZmFsc2U7XG5leHBvcnQgdHlwZSBQbHVnaW5UYXJnZXQgPSBzdHJpbmcgfCBvYmplY3QgfCBGdW5jdGlvbjtcbmV4cG9ydCB0eXBlIFBsdWdpbkl0ZW0gPVxuICB8IENvbmZpZ0l0ZW08UGx1Z2luQVBJPlxuICB8IFBsdWdpblxuICB8IFBsdWdpblRhcmdldFxuICB8IFtQbHVnaW5UYXJnZXQsIFBsdWdpbk9wdGlvbnNdXG4gIHwgW1BsdWdpblRhcmdldCwgUGx1Z2luT3B0aW9ucywgc3RyaW5nIHwgdm9pZF07XG5leHBvcnQgdHlwZSBQbHVnaW5MaXN0ID0gUmVhZG9ubHlBcnJheTxQbHVnaW5JdGVtPjtcblxuZXhwb3J0IHR5cGUgT3ZlcnJpZGVzTGlzdCA9IEFycmF5PFZhbGlkYXRlZE9wdGlvbnM+O1xuZXhwb3J0IHR5cGUgQ29uZmlnQXBwbGljYWJsZVRlc3QgPSBJZ25vcmVJdGVtIHwgQXJyYXk8SWdub3JlSXRlbT47XG5cbmV4cG9ydCB0eXBlIENvbmZpZ0ZpbGVTZWFyY2ggPSBzdHJpbmcgfCBib29sZWFuO1xuZXhwb3J0IHR5cGUgQmFiZWxyY1NlYXJjaCA9IGJvb2xlYW4gfCBJZ25vcmVJdGVtIHwgSWdub3JlTGlzdDtcbmV4cG9ydCB0eXBlIFNvdXJjZU1hcHNPcHRpb24gPSBib29sZWFuIHwgXCJpbmxpbmVcIiB8IFwiYm90aFwiO1xuZXhwb3J0IHR5cGUgU291cmNlVHlwZU9wdGlvbiA9IFwibW9kdWxlXCIgfCBcInNjcmlwdFwiIHwgXCJ1bmFtYmlndW91c1wiO1xuZXhwb3J0IHR5cGUgQ29tcGFjdE9wdGlvbiA9IGJvb2xlYW4gfCBcImF1dG9cIjtcbmV4cG9ydCB0eXBlIFJvb3RJbnB1dFNvdXJjZU1hcE9wdGlvbiA9IG9iamVjdCB8IGJvb2xlYW47XG5leHBvcnQgdHlwZSBSb290TW9kZSA9IFwicm9vdFwiIHwgXCJ1cHdhcmRcIiB8IFwidXB3YXJkLW9wdGlvbmFsXCI7XG5cbmV4cG9ydCB0eXBlIFRhcmdldHNMaXN0T3JPYmplY3QgPVxuICB8IFRhcmdldHNcbiAgfCBJbnB1dFRhcmdldHNcbiAgfCBJbnB1dFRhcmdldHNbXCJicm93c2Vyc1wiXTtcblxuZXhwb3J0IHR5cGUgT3B0aW9uc1NvdXJjZSA9XG4gIHwgXCJhcmd1bWVudHNcIlxuICB8IFwiY29uZmlnZmlsZVwiXG4gIHwgXCJiYWJlbHJjZmlsZVwiXG4gIHwgXCJleHRlbmRzZmlsZVwiXG4gIHwgXCJwcmVzZXRcIlxuICB8IFwicGx1Z2luXCI7XG5cbmV4cG9ydCB0eXBlIFJvb3RQYXRoID0gUmVhZG9ubHk8e1xuICB0eXBlOiBcInJvb3RcIjtcbiAgc291cmNlOiBPcHRpb25zU291cmNlO1xufT47XG5cbnR5cGUgT3ZlcnJpZGVzUGF0aCA9IFJlYWRvbmx5PHtcbiAgdHlwZTogXCJvdmVycmlkZXNcIjtcbiAgaW5kZXg6IG51bWJlcjtcbiAgcGFyZW50OiBSb290UGF0aDtcbn0+O1xuXG50eXBlIEVudlBhdGggPSBSZWFkb25seTx7XG4gIHR5cGU6IFwiZW52XCI7XG4gIG5hbWU6IHN0cmluZztcbiAgcGFyZW50OiBSb290UGF0aCB8IE92ZXJyaWRlc1BhdGg7XG59PjtcblxuZXhwb3J0IHR5cGUgTmVzdGluZ1BhdGggPSBSb290UGF0aCB8IE92ZXJyaWRlc1BhdGggfCBFbnZQYXRoO1xuXG5jb25zdCBrbm93bkFzc3VtcHRpb25zID0gW1xuICBcImFycmF5TGlrZUlzSXRlcmFibGVcIixcbiAgXCJjb25zdGFudFJlZXhwb3J0c1wiLFxuICBcImNvbnN0YW50U3VwZXJcIixcbiAgXCJlbnVtZXJhYmxlTW9kdWxlTWV0YVwiLFxuICBcImlnbm9yZUZ1bmN0aW9uTGVuZ3RoXCIsXG4gIFwiaWdub3JlVG9QcmltaXRpdmVIaW50XCIsXG4gIFwiaXRlcmFibGVJc0FycmF5XCIsXG4gIFwibXV0YWJsZVRlbXBsYXRlT2JqZWN0XCIsXG4gIFwibm9DbGFzc0NhbGxzXCIsXG4gIFwibm9Eb2N1bWVudEFsbFwiLFxuICBcIm5vSW5jb21wbGV0ZU5zSW1wb3J0RGV0ZWN0aW9uXCIsXG4gIFwibm9OZXdBcnJvd3NcIixcbiAgXCJub1VuaW5pdGlhbGl6ZWRQcml2YXRlRmllbGRBY2Nlc3NcIixcbiAgXCJvYmplY3RSZXN0Tm9TeW1ib2xzXCIsXG4gIFwicHJpdmF0ZUZpZWxkc0FzU3ltYm9sc1wiLFxuICBcInByaXZhdGVGaWVsZHNBc1Byb3BlcnRpZXNcIixcbiAgXCJwdXJlR2V0dGVyc1wiLFxuICBcInNldENsYXNzTWV0aG9kc1wiLFxuICBcInNldENvbXB1dGVkUHJvcGVydGllc1wiLFxuICBcInNldFB1YmxpY0NsYXNzRmllbGRzXCIsXG4gIFwic2V0U3ByZWFkUHJvcGVydGllc1wiLFxuICBcInNraXBGb3JPZkl0ZXJhdG9yQ2xvc2luZ1wiLFxuICBcInN1cGVySXNDYWxsYWJsZUNvbnN0cnVjdG9yXCIsXG5dIGFzIGNvbnN0O1xuZXhwb3J0IHR5cGUgQXNzdW1wdGlvbk5hbWUgPSAodHlwZW9mIGtub3duQXNzdW1wdGlvbnMpW251bWJlcl07XG5leHBvcnQgY29uc3QgYXNzdW1wdGlvbnNOYW1lcyA9IG5ldyBTZXQoa25vd25Bc3N1bXB0aW9ucyk7XG5cbmZ1bmN0aW9uIGdldFNvdXJjZShsb2M6IE5lc3RpbmdQYXRoKTogT3B0aW9uc1NvdXJjZSB7XG4gIHJldHVybiBsb2MudHlwZSA9PT0gXCJyb290XCIgPyBsb2Muc291cmNlIDogZ2V0U291cmNlKGxvYy5wYXJlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGUoXG4gIHR5cGU6IE9wdGlvbnNTb3VyY2UsXG4gIG9wdHM6IGFueSxcbiAgZmlsZW5hbWU/OiBzdHJpbmcsXG4pOiBWYWxpZGF0ZWRPcHRpb25zIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdmFsaWRhdGVOZXN0ZWQoXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwicm9vdFwiLFxuICAgICAgICBzb3VyY2U6IHR5cGUsXG4gICAgICB9LFxuICAgICAgb3B0cyxcbiAgICApO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGNvbmZpZ0Vycm9yID0gbmV3IENvbmZpZ0Vycm9yKGVycm9yLm1lc3NhZ2UsIGZpbGVuYW1lKTtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRPRE86IC5jb2RlIGlzIG5vdCBkZWZpbmVkIG9uIENvbmZpZ0Vycm9yIG9yIEVycm9yXG4gICAgaWYgKGVycm9yLmNvZGUpIGNvbmZpZ0Vycm9yLmNvZGUgPSBlcnJvci5jb2RlO1xuICAgIHRocm93IGNvbmZpZ0Vycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTmVzdGVkKGxvYzogTmVzdGluZ1BhdGgsIG9wdHM6IHsgW2tleTogc3RyaW5nXTogdW5rbm93biB9KSB7XG4gIGNvbnN0IHR5cGUgPSBnZXRTb3VyY2UobG9jKTtcblxuICBhc3NlcnROb0R1cGxpY2F0ZVNvdXJjZW1hcChvcHRzKTtcblxuICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG9wdExvYyA9IHtcbiAgICAgIHR5cGU6IFwib3B0aW9uXCIsXG4gICAgICBuYW1lOiBrZXksXG4gICAgICBwYXJlbnQ6IGxvYyxcbiAgICB9IGFzIGNvbnN0O1xuXG4gICAgaWYgKHR5cGUgPT09IFwicHJlc2V0XCIgJiYgTk9OUFJFU0VUX1ZBTElEQVRPUlNba2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhvcHRMb2MpfSBpcyBub3QgYWxsb3dlZCBpbiBwcmVzZXQgb3B0aW9uc2ApO1xuICAgIH1cbiAgICBpZiAodHlwZSAhPT0gXCJhcmd1bWVudHNcIiAmJiBST09UX1ZBTElEQVRPUlNba2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgJHttc2cob3B0TG9jKX0gaXMgb25seSBhbGxvd2VkIGluIHJvb3QgcHJvZ3JhbW1hdGljIG9wdGlvbnNgLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgdHlwZSAhPT0gXCJhcmd1bWVudHNcIiAmJlxuICAgICAgdHlwZSAhPT0gXCJjb25maWdmaWxlXCIgJiZcbiAgICAgIEJBQkVMUkNfVkFMSURBVE9SU1trZXldXG4gICAgKSB7XG4gICAgICBpZiAodHlwZSA9PT0gXCJiYWJlbHJjZmlsZVwiIHx8IHR5cGUgPT09IFwiZXh0ZW5kc2ZpbGVcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7bXNnKFxuICAgICAgICAgICAgb3B0TG9jLFxuICAgICAgICAgICl9IGlzIG5vdCBhbGxvd2VkIGluIC5iYWJlbHJjIG9yIFwiZXh0ZW5kc1wiZWQgZmlsZXMsIG9ubHkgaW4gcm9vdCBwcm9ncmFtbWF0aWMgb3B0aW9ucywgYCArXG4gICAgICAgICAgICBgb3IgYmFiZWwuY29uZmlnLmpzL2NvbmZpZyBmaWxlIG9wdGlvbnNgLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21zZyhcbiAgICAgICAgICBvcHRMb2MsXG4gICAgICAgICl9IGlzIG9ubHkgYWxsb3dlZCBpbiByb290IHByb2dyYW1tYXRpYyBvcHRpb25zLCBvciBiYWJlbC5jb25maWcuanMvY29uZmlnIGZpbGUgb3B0aW9uc2AsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbGlkYXRvciA9XG4gICAgICBDT01NT05fVkFMSURBVE9SU1trZXldIHx8XG4gICAgICBOT05QUkVTRVRfVkFMSURBVE9SU1trZXldIHx8XG4gICAgICBCQUJFTFJDX1ZBTElEQVRPUlNba2V5XSB8fFxuICAgICAgUk9PVF9WQUxJREFUT1JTW2tleV0gfHxcbiAgICAgICh0aHJvd1Vua25vd25FcnJvciBhcyBWYWxpZGF0b3I8dm9pZD4pO1xuXG4gICAgdmFsaWRhdG9yKG9wdExvYywgb3B0c1trZXldKTtcbiAgfSk7XG5cbiAgcmV0dXJuIG9wdHM7XG59XG5cbmZ1bmN0aW9uIHRocm93VW5rbm93bkVycm9yKGxvYzogT3B0aW9uUGF0aCkge1xuICBjb25zdCBrZXkgPSBsb2MubmFtZTtcblxuICBpZiAocmVtb3ZlZFtrZXldKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCB2ZXJzaW9uID0gNSB9ID0gcmVtb3ZlZFtrZXldO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFVzaW5nIHJlbW92ZWQgQmFiZWwgJHt2ZXJzaW9ufSBvcHRpb246ICR7bXNnKGxvYyl9IC0gJHttZXNzYWdlfWAsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB1bmtub3duT3B0RXJyID0gbmV3IEVycm9yKFxuICAgICAgYFVua25vd24gb3B0aW9uOiAke21zZyhcbiAgICAgICAgbG9jLFxuICAgICAgKX0uIENoZWNrIG91dCBodHRwczovL2JhYmVsanMuaW8vZG9jcy9lbi9iYWJlbC1jb3JlLyNvcHRpb25zIGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IG9wdGlvbnMuYCxcbiAgICApO1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdG9kbyhmbG93LT50cyk6IGNvbnNpZGVyIGNyZWF0aW5nIHNvbWV0aGluZyBsaWtlIEJhYmVsQ29uZmlnRXJyb3Igd2l0aCBjb2RlIGZpZWxkIGluIGl0XG4gICAgdW5rbm93bk9wdEVyci5jb2RlID0gXCJCQUJFTF9VTktOT1dOX09QVElPTlwiO1xuXG4gICAgdGhyb3cgdW5rbm93bk9wdEVycjtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnROb0R1cGxpY2F0ZVNvdXJjZW1hcChvcHRzOiBhbnkpOiB2b2lkIHtcbiAgaWYgKE9iamVjdC5oYXNPd24ob3B0cywgXCJzb3VyY2VNYXBcIikgJiYgT2JqZWN0Lmhhc093bihvcHRzLCBcInNvdXJjZU1hcHNcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCIuc291cmNlTWFwIGlzIGFuIGFsaWFzIGZvciAuc291cmNlTWFwcywgY2Fubm90IHVzZSBib3RoXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydEVudlNldChcbiAgbG9jOiBPcHRpb25QYXRoLFxuICB2YWx1ZTogdW5rbm93bixcbik6IHZvaWQgfCBFbnZTZXQ8VmFsaWRhdGVkT3B0aW9ucz4ge1xuICBpZiAobG9jLnBhcmVudC50eXBlID09PSBcImVudlwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBpcyBub3QgYWxsb3dlZCBpbnNpZGUgb2YgYW5vdGhlciAuZW52IGJsb2NrYCk7XG4gIH1cbiAgY29uc3QgcGFyZW50OiBSb290UGF0aCB8IE92ZXJyaWRlc1BhdGggPSBsb2MucGFyZW50O1xuXG4gIGNvbnN0IG9iaiA9IGFzc2VydE9iamVjdChsb2MsIHZhbHVlKTtcbiAgaWYgKG9iaikge1xuICAgIC8vIFZhbGlkYXRlIGJ1dCBkb24ndCBjb3B5IHRoZSAuZW52IG9iamVjdCBpbiBvcmRlciB0byBwcmVzZXJ2ZVxuICAgIC8vIG9iamVjdCBpZGVudGl0eSBmb3IgdXNlIGR1cmluZyBjb25maWcgY2hhaW4gcHJvY2Vzc2luZy5cbiAgICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgY29uc3QgZW52ID0gYXNzZXJ0T2JqZWN0KGFjY2Vzcyhsb2MsIGVudk5hbWUpLCBvYmpbZW52TmFtZV0pO1xuICAgICAgaWYgKCFlbnYpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBlbnZMb2MgPSB7XG4gICAgICAgIHR5cGU6IFwiZW52XCIsXG4gICAgICAgIG5hbWU6IGVudk5hbWUsXG4gICAgICAgIHBhcmVudCxcbiAgICAgIH0gYXMgY29uc3Q7XG4gICAgICB2YWxpZGF0ZU5lc3RlZChlbnZMb2MsIGVudik7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIGFzc2VydE92ZXJyaWRlc0xpc3QoXG4gIGxvYzogT3B0aW9uUGF0aCxcbiAgdmFsdWU6IHVua25vd25bXSxcbik6IHVuZGVmaW5lZCB8IE92ZXJyaWRlc0xpc3Qge1xuICBpZiAobG9jLnBhcmVudC50eXBlID09PSBcImVudlwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21zZyhsb2MpfSBpcyBub3QgYWxsb3dlZCBpbnNpZGUgYW4gLmVudiBibG9ja2ApO1xuICB9XG4gIGlmIChsb2MucGFyZW50LnR5cGUgPT09IFwib3ZlcnJpZGVzXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnKGxvYyl9IGlzIG5vdCBhbGxvd2VkIGluc2lkZSBhbiAub3ZlcnJpZGVzIGJsb2NrYCk7XG4gIH1cbiAgY29uc3QgcGFyZW50OiBSb290UGF0aCA9IGxvYy5wYXJlbnQ7XG5cbiAgY29uc3QgYXJyID0gYXNzZXJ0QXJyYXkobG9jLCB2YWx1ZSk7XG4gIGlmIChhcnIpIHtcbiAgICBmb3IgKGNvbnN0IFtpbmRleCwgaXRlbV0gb2YgYXJyLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgb2JqTG9jID0gYWNjZXNzKGxvYywgaW5kZXgpO1xuICAgICAgY29uc3QgZW52ID0gYXNzZXJ0T2JqZWN0KG9iakxvYywgaXRlbSk7XG4gICAgICBpZiAoIWVudikgdGhyb3cgbmV3IEVycm9yKGAke21zZyhvYmpMb2MpfSBtdXN0IGJlIGFuIG9iamVjdGApO1xuXG4gICAgICBjb25zdCBvdmVycmlkZXNMb2MgPSB7XG4gICAgICAgIHR5cGU6IFwib3ZlcnJpZGVzXCIsXG4gICAgICAgIGluZGV4LFxuICAgICAgICBwYXJlbnQsXG4gICAgICB9IGFzIGNvbnN0O1xuICAgICAgdmFsaWRhdGVOZXN0ZWQob3ZlcnJpZGVzTG9jLCBlbnYpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyIGFzIE92ZXJyaWRlc0xpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja05vVW53cmFwcGVkSXRlbU9wdGlvblBhaXJzPEFQST4oXG4gIGl0ZW1zOiBBcnJheTxVbmxvYWRlZERlc2NyaXB0b3I8QVBJPj4sXG4gIGluZGV4OiBudW1iZXIsXG4gIHR5cGU6IFwicGx1Z2luXCIgfCBcInByZXNldFwiLFxuICBlOiBFcnJvcixcbik6IHZvaWQge1xuICBpZiAoaW5kZXggPT09IDApIHJldHVybjtcblxuICBjb25zdCBsYXN0SXRlbSA9IGl0ZW1zW2luZGV4IC0gMV07XG4gIGNvbnN0IHRoaXNJdGVtID0gaXRlbXNbaW5kZXhdO1xuXG4gIGlmIChcbiAgICBsYXN0SXRlbS5maWxlICYmXG4gICAgbGFzdEl0ZW0ub3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmXG4gICAgdHlwZW9mIHRoaXNJdGVtLnZhbHVlID09PSBcIm9iamVjdFwiXG4gICkge1xuICAgIGUubWVzc2FnZSArPVxuICAgICAgYFxcbi0gTWF5YmUgeW91IG1lYW50IHRvIHVzZVxcbmAgK1xuICAgICAgYFwiJHt0eXBlfXNcIjogW1xcbiAgW1wiJHtsYXN0SXRlbS5maWxlLnJlcXVlc3R9XCIsICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIHRoaXNJdGVtLnZhbHVlLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIDIsXG4gICAgICApfV1cXG5dXFxuYCArXG4gICAgICBgVG8gYmUgYSB2YWxpZCAke3R5cGV9LCBpdHMgbmFtZSBhbmQgb3B0aW9ucyBzaG91bGQgYmUgd3JhcHBlZCBpbiBhIHBhaXIgb2YgYnJhY2tldHNgO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGF1eGlsaWFyeUNvbW1lbnQ6IHtcbiAgICBtZXNzYWdlOiBcIlVzZSBgYXV4aWxpYXJ5Q29tbWVudEJlZm9yZWAgb3IgYGF1eGlsaWFyeUNvbW1lbnRBZnRlcmBcIixcbiAgfSxcbiAgYmxhY2tsaXN0OiB7XG4gICAgbWVzc2FnZTogXCJQdXQgdGhlIHNwZWNpZmljIHRyYW5zZm9ybXMgeW91IHdhbnQgaW4gdGhlIGBwbHVnaW5zYCBvcHRpb25cIixcbiAgfSxcbiAgYnJlYWtDb25maWc6IHtcbiAgICBtZXNzYWdlOiBcIlRoaXMgaXMgbm90IGEgbmVjZXNzYXJ5IG9wdGlvbiBpbiBCYWJlbCA2XCIsXG4gIH0sXG4gIGV4cGVyaW1lbnRhbDoge1xuICAgIG1lc3NhZ2U6IFwiUHV0IHRoZSBzcGVjaWZpYyB0cmFuc2Zvcm1zIHlvdSB3YW50IGluIHRoZSBgcGx1Z2luc2Agb3B0aW9uXCIsXG4gIH0sXG4gIGV4dGVybmFsSGVscGVyczoge1xuICAgIG1lc3NhZ2U6XG4gICAgICBcIlVzZSB0aGUgYGV4dGVybmFsLWhlbHBlcnNgIHBsdWdpbiBpbnN0ZWFkLiBcIiArXG4gICAgICBcIkNoZWNrIG91dCBodHRwOi8vYmFiZWxqcy5pby9kb2NzL3BsdWdpbnMvZXh0ZXJuYWwtaGVscGVycy9cIixcbiAgfSxcbiAgZXh0cmE6IHtcbiAgICBtZXNzYWdlOiBcIlwiLFxuICB9LFxuICBqc3hQcmFnbWE6IHtcbiAgICBtZXNzYWdlOlxuICAgICAgXCJ1c2UgdGhlIGBwcmFnbWFgIG9wdGlvbiBpbiB0aGUgYHJlYWN0LWpzeGAgcGx1Z2luLiBcIiArXG4gICAgICBcIkNoZWNrIG91dCBodHRwOi8vYmFiZWxqcy5pby9kb2NzL3BsdWdpbnMvdHJhbnNmb3JtLXJlYWN0LWpzeC9cIixcbiAgfSxcbiAgbG9vc2U6IHtcbiAgICBtZXNzYWdlOlxuICAgICAgXCJTcGVjaWZ5IHRoZSBgbG9vc2VgIG9wdGlvbiBmb3IgdGhlIHJlbGV2YW50IHBsdWdpbiB5b3UgYXJlIHVzaW5nIFwiICtcbiAgICAgIFwib3IgdXNlIGEgcHJlc2V0IHRoYXQgc2V0cyB0aGUgb3B0aW9uLlwiLFxuICB9LFxuICBtZXRhZGF0YVVzZWRIZWxwZXJzOiB7XG4gICAgbWVzc2FnZTogXCJOb3QgcmVxdWlyZWQgYW55bW9yZSBhcyB0aGlzIGlzIGVuYWJsZWQgYnkgZGVmYXVsdFwiLFxuICB9LFxuICBtb2R1bGVzOiB7XG4gICAgbWVzc2FnZTpcbiAgICAgIFwiVXNlIHRoZSBjb3JyZXNwb25kaW5nIG1vZHVsZSB0cmFuc2Zvcm0gcGx1Z2luIGluIHRoZSBgcGx1Z2luc2Agb3B0aW9uLiBcIiArXG4gICAgICBcIkNoZWNrIG91dCBodHRwOi8vYmFiZWxqcy5pby9kb2NzL3BsdWdpbnMvI21vZHVsZXNcIixcbiAgfSxcbiAgbm9uU3RhbmRhcmQ6IHtcbiAgICBtZXNzYWdlOlxuICAgICAgXCJVc2UgdGhlIGByZWFjdC1qc3hgIGFuZCBgZmxvdy1zdHJpcC10eXBlc2AgcGx1Z2lucyB0byBzdXBwb3J0IEpTWCBhbmQgRmxvdy4gXCIgK1xuICAgICAgXCJBbHNvIGNoZWNrIG91dCB0aGUgcmVhY3QgcHJlc2V0IGh0dHA6Ly9iYWJlbGpzLmlvL2RvY3MvcGx1Z2lucy9wcmVzZXQtcmVhY3QvXCIsXG4gIH0sXG4gIG9wdGlvbmFsOiB7XG4gICAgbWVzc2FnZTogXCJQdXQgdGhlIHNwZWNpZmljIHRyYW5zZm9ybXMgeW91IHdhbnQgaW4gdGhlIGBwbHVnaW5zYCBvcHRpb25cIixcbiAgfSxcbiAgc291cmNlTWFwTmFtZToge1xuICAgIG1lc3NhZ2U6XG4gICAgICBcIlRoZSBgc291cmNlTWFwTmFtZWAgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWQgYmVjYXVzZSBpdCBtYWtlcyBtb3JlIHNlbnNlIGZvciB0aGUgXCIgK1xuICAgICAgXCJ0b29saW5nIHRoYXQgY2FsbHMgQmFiZWwgdG8gYXNzaWduIGBtYXAuZmlsZWAgdGhlbXNlbHZlcy5cIixcbiAgfSxcbiAgc3RhZ2U6IHtcbiAgICBtZXNzYWdlOlxuICAgICAgXCJDaGVjayBvdXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RhZ2UteCBwcmVzZXRzIGh0dHA6Ly9iYWJlbGpzLmlvL2RvY3MvcGx1Z2lucy8jcHJlc2V0c1wiLFxuICB9LFxuICB3aGl0ZWxpc3Q6IHtcbiAgICBtZXNzYWdlOiBcIlB1dCB0aGUgc3BlY2lmaWMgdHJhbnNmb3JtcyB5b3Ugd2FudCBpbiB0aGUgYHBsdWdpbnNgIG9wdGlvblwiLFxuICB9LFxuXG4gIHJlc29sdmVNb2R1bGVTb3VyY2U6IHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG1lc3NhZ2U6IFwiVXNlIGBiYWJlbC1wbHVnaW4tbW9kdWxlLXJlc29sdmVyQDNgJ3MgJ3Jlc29sdmVQYXRoJyBvcHRpb25zXCIsXG4gIH0sXG4gIG1ldGFkYXRhOiB7XG4gICAgdmVyc2lvbjogNixcbiAgICBtZXNzYWdlOlxuICAgICAgXCJHZW5lcmF0ZWQgcGx1Z2luIG1ldGFkYXRhIGlzIGFsd2F5cyBpbmNsdWRlZCBpbiB0aGUgb3V0cHV0IHJlc3VsdFwiLFxuICB9LFxuICBzb3VyY2VNYXBUYXJnZXQ6IHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG1lc3NhZ2U6XG4gICAgICBcIlRoZSBgc291cmNlTWFwVGFyZ2V0YCBvcHRpb24gaGFzIGJlZW4gcmVtb3ZlZCBiZWNhdXNlIGl0IG1ha2VzIG1vcmUgc2Vuc2UgZm9yIHRoZSB0b29saW5nIFwiICtcbiAgICAgIFwidGhhdCBjYWxscyBCYWJlbCB0byBhc3NpZ24gYG1hcC5maWxlYCB0aGVtc2VsdmVzLlwiLFxuICB9LFxufSBhcyB7IFtuYW1lOiBzdHJpbmddOiB7IHZlcnNpb24/OiBudW1iZXI7IG1lc3NhZ2U6IHN0cmluZyB9IH07XG4iLCJpbXBvcnQge1xuICBpbmplY3RWaXJ0dWFsU3RhY2tGcmFtZSxcbiAgZXhwZWN0ZWRFcnJvcixcbn0gZnJvbSBcIi4vcmV3cml0ZS1zdGFjay10cmFjZS50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBmaWxlbmFtZT86IHN0cmluZykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIGV4cGVjdGVkRXJyb3IodGhpcyk7XG4gICAgaWYgKGZpbGVuYW1lKSBpbmplY3RWaXJ0dWFsU3RhY2tGcmFtZSh0aGlzLCBmaWxlbmFtZSk7XG4gIH1cbn1cbiIsIi8qKlxuICogVGhpcyBmaWxlIHVzZXMgdGhlIGludGVybmFsIFY4IFN0YWNrIFRyYWNlIEFQSSAoaHR0cHM6Ly92OC5kZXYvZG9jcy9zdGFjay10cmFjZS1hcGkpXG4gKiB0byBwcm92aWRlIHV0aWxpdGllcyB0byByZXdyaXRlIHRoZSBzdGFjayB0cmFjZS5cbiAqIFdoZW4gdGhpcyBBUEkgaXMgbm90IHByZXNlbnQsIGFsbCB0aGUgZnVuY3Rpb25zIGluIHRoaXMgZmlsZSBiZWNvbWUgbm9vcHMuXG4gKlxuICogYmVnaW5IaWRkZW5DYWxsU3RhY2soZm4pIGFuZCBlbmRIaWRkZW5DYWxsU3RhY2soZm4pIHdyYXAgdGhlaXIgcGFyYW1ldGVyIHRvXG4gKiBtYXJrIGFuIGhpZGRlbiBwb3J0aW9uIG9mIHRoZSBzdGFjayB0cmFjZS4gVGhlIGZ1bmN0aW9uIHBhc3NlZCB0b1xuICogYmVnaW5IaWRkZW5DYWxsU3RhY2sgaXMgdGhlIGZpcnN0IGhpZGRlbiBmdW5jdGlvbiwgd2hpbGUgdGhlIGZ1bmN0aW9uIHBhc3NlZFxuICogdG8gZW5kSGlkZGVuQ2FsbFN0YWNrIGlzIHRoZSBmaXJzdCBzaG93biBmdW5jdGlvbi5cbiAqXG4gKiBXaGVuIGFuIGVycm9yIGlzIHRocm93biBfb3V0c2lkZV8gb2YgdGhlIGhpZGRlbiB6b25lLCBldmVyeXRoaW5nIGJldHdlZW5cbiAqIGJlZ2luSGlkZGVuQ2FsbFN0YWNrIGFuZCBlbmRIaWRkZW5DYWxsU3RhY2sgd2lsbCBub3QgYmUgc2hvd24uXG4gKiBJZiBhbiBlcnJvciBpcyB0aHJvd24gX2luc2lkZV8gdGhlIGhpZGRlbiB6b25lLCB0aGVuIHRoZSB3aG9sZSBzdGFjayB0cmFjZVxuICogd2lsbCBiZSB2aXNpYmxlOiB0aGlzIGlzIHRvIGF2b2lkIGhpZGluZyByZWFsIGJ1Z3MuXG4gKiBIb3dldmVyLCBpZiBhbiBlcnJvciBpbnNpZGUgdGhlIGhpZGRlbiB6b25lIGlzIGV4cGVjdGVkLCBpdCBjYW4gYmUgbWFya2VkXG4gKiB3aXRoIHRoZSBleHBlY3RlZEVycm9yKGVycm9yKSBmdW5jdGlvbiB0byBrZWVwIHRoZSBoaWRkZW4gZnJhbWVzIGhpZGRlbi5cbiAqXG4gKiBDb25zaWRlciB0aGlzIGNhbGwgc3RhY2sgKHRoZSBvdXRlciBmdW5jdGlvbiBpcyB0aGUgYm90dG9tIG9uZSk6XG4gKlxuICogICAxLiBhKClcbiAqICAgMi4gZW5kSGlkZGVuQ2FsbFN0YWNrKGIpKClcbiAqICAgMy4gYygpXG4gKiAgIDQuIGJlZ2luSGlkZGVuQ2FsbFN0YWNrKGQpKClcbiAqICAgNS4gZSgpXG4gKiAgIDYuIGYoKVxuICpcbiAqIC0gSWYgYSgpIHRocm93cyBhbiBlcnJvciwgdGhlbiBpdHMgc2hvd24gY2FsbCBzdGFjayB3aWxsIGJlIFwiYSwgYiwgZSwgZlwiXG4gKiAtIElmIGIoKSB0aHJvd3MgYW4gZXJyb3IsIHRoZW4gaXRzIHNob3duIGNhbGwgc3RhY2sgd2lsbCBiZSBcImIsIGUsIGZcIlxuICogLSBJZiBjKCkgdGhyb3dzIGFuIGV4cGVjdGVkIGVycm9yLCB0aGVuIGl0cyBzaG93biBjYWxsIHN0YWNrIHdpbGwgYmUgXCJlLCBmXCJcbiAqIC0gSWYgYygpIHRocm93cyBhbiB1bmV4cGVjdGVkIGVycm9yLCB0aGVuIGl0cyBzaG93biBjYWxsIHN0YWNrIHdpbGwgYmUgXCJjLCBkLCBlLCBmXCJcbiAqIC0gSWYgZCgpIHRocm93cyBhbiBleHBlY3RlZCBlcnJvciwgdGhlbiBpdHMgc2hvd24gY2FsbCBzdGFjayB3aWxsIGJlIFwiZSwgZlwiXG4gKiAtIElmIGQoKSB0aHJvd3MgYW4gdW5leHBlY3RlZCBlcnJvciwgdGhlbiBpdHMgc2hvd24gY2FsbCBzdGFjayB3aWxsIGJlIFwiZCwgZSwgZlwiXG4gKiAtIElmIGUoKSB0aHJvd3MgYW4gZXJyb3IsIHRoZW4gaXRzIHNob3duIGNhbGwgc3RhY2sgd2lsbCBiZSBcImUsIGZcIlxuICpcbiAqIEFkZGl0aW9uYWxseSwgYW4gZXJyb3IgY2FuIGluamVjdCBhZGRpdGlvbmFsIFwidmlydHVhbFwiIHN0YWNrIGZyYW1lcyB1c2luZyB0aGVcbiAqIGluamVjdFZpcnR1YWxTdGFja0ZyYW1lKGVycm9yLCBmaWxlbmFtZSkgZnVuY3Rpb246IHRob3NlIGFyZSBpbmplY3RlZCBhcyBhXG4gKiByZXBsYWNlbWVudCBvZiB0aGUgaGlkZGVuIGZyYW1lcy5cbiAqIEluIHRoZSBleGFtcGxlIGFib3ZlLCBpZiB3ZSBjYWxsZWQgaW5qZWN0VmlydHVhbFN0YWNrRnJhbWUoZXJyLCBcImhcIikgYW5kXG4gKiBpbmplY3RWaXJ0dWFsU3RhY2tGcmFtZShlcnIsIFwiaVwiKSBvbiB0aGUgZXhwZWN0ZWQgZXJyb3IgdGhyb3duIGJ5IGMoKSwgaXRzXG4gKiBzaG93biBjYWxsIHN0YWNrIHdvdWxkIGhhdmUgYmVlbiBcImgsIGksIGUsIGZcIi5cbiAqIFRoaXMgY2FuIGJlIHVzZWZ1bCwgZm9yIGV4YW1wbGUsIHRvIHJlcG9ydCBjb25maWcgdmFsaWRhdGlvbiBlcnJvcnMgYXMgaWYgdGhleVxuICogd2VyZSBkaXJlY3RseSB0aHJvd24gaW4gdGhlIGNvbmZpZyBmaWxlLlxuICovXG5cbmNvbnN0IEVycm9yVG9TdHJpbmcgPSBGdW5jdGlvbi5jYWxsLmJpbmQoRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nKTtcblxuY29uc3QgU1VQUE9SVEVEID1cbiAgISFFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVycm9yLCBcInN0YWNrVHJhY2VMaW1pdFwiKT8ud3JpdGFibGUgPT09IHRydWU7XG5cbmNvbnN0IFNUQVJUX0hJRElORyA9IFwic3RhcnRIaWRpbmcgLSBzZWNyZXQgLSBkb24ndCB1c2UgdGhpcyAtIHYxXCI7XG5jb25zdCBTVE9QX0hJRElORyA9IFwic3RvcEhpZGluZyAtIHNlY3JldCAtIGRvbid0IHVzZSB0aGlzIC0gdjFcIjtcblxudHlwZSBDYWxsU2l0ZSA9IE5vZGVKUy5DYWxsU2l0ZTtcblxuY29uc3QgZXhwZWN0ZWRFcnJvcnMgPSBuZXcgV2Vha1NldDxFcnJvcj4oKTtcbmNvbnN0IHZpcnR1YWxGcmFtZXMgPSBuZXcgV2Vha01hcDxFcnJvciwgQ2FsbFNpdGVbXT4oKTtcblxuZnVuY3Rpb24gQ2FsbFNpdGUoZmlsZW5hbWU6IHN0cmluZyk6IENhbGxTaXRlIHtcbiAgLy8gV2UgbmVlZCB0byB1c2UgYSBwcm90b3R5cGUgb3RoZXJ3aXNlIGl0IGJyZWFrcyBzb3VyY2UtbWFwLXN1cHBvcnQncyBpbnRlcm5hbHNcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoe1xuICAgIGlzTmF0aXZlOiAoKSA9PiBmYWxzZSxcbiAgICBpc0NvbnN0cnVjdG9yOiAoKSA9PiBmYWxzZSxcbiAgICBpc1RvcGxldmVsOiAoKSA9PiB0cnVlLFxuICAgIGdldEZpbGVOYW1lOiAoKSA9PiBmaWxlbmFtZSxcbiAgICBnZXRMaW5lTnVtYmVyOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgZ2V0Q29sdW1uTnVtYmVyOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgZ2V0RnVuY3Rpb25OYW1lOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgZ2V0TWV0aG9kTmFtZTogKCkgPT4gdW5kZWZpbmVkLFxuICAgIGdldFR5cGVOYW1lOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgdG9TdHJpbmc6ICgpID0+IGZpbGVuYW1lLFxuICB9IGFzIENhbGxTaXRlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFZpcnR1YWxTdGFja0ZyYW1lKGVycm9yOiBFcnJvciwgZmlsZW5hbWU6IHN0cmluZykge1xuICBpZiAoIVNVUFBPUlRFRCkgcmV0dXJuO1xuXG4gIGxldCBmcmFtZXMgPSB2aXJ0dWFsRnJhbWVzLmdldChlcnJvcik7XG4gIGlmICghZnJhbWVzKSB2aXJ0dWFsRnJhbWVzLnNldChlcnJvciwgKGZyYW1lcyA9IFtdKSk7XG4gIGZyYW1lcy5wdXNoKENhbGxTaXRlKGZpbGVuYW1lKSk7XG5cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwZWN0ZWRFcnJvcihlcnJvcjogRXJyb3IpIHtcbiAgaWYgKCFTVVBQT1JURUQpIHJldHVybjtcbiAgZXhwZWN0ZWRFcnJvcnMuYWRkKGVycm9yKTtcbiAgcmV0dXJuIGVycm9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmVnaW5IaWRkZW5DYWxsU3RhY2s8QSBleHRlbmRzIHVua25vd25bXSwgUj4oXG4gIGZuOiAoLi4uYXJnczogQSkgPT4gUixcbikge1xuICBpZiAoIVNVUFBPUlRFRCkgcmV0dXJuIGZuO1xuXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgZnVuY3Rpb24gKC4uLmFyZ3M6IEEpIHtcbiAgICAgIHNldHVwUHJlcGFyZVN0YWNrVHJhY2UoKTtcbiAgICAgIHJldHVybiBmbiguLi5hcmdzKTtcbiAgICB9LFxuICAgIFwibmFtZVwiLFxuICAgIHsgdmFsdWU6IFNUT1BfSElESU5HIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmRIaWRkZW5DYWxsU3RhY2s8QSBleHRlbmRzIHVua25vd25bXSwgUj4oXG4gIGZuOiAoLi4uYXJnczogQSkgPT4gUixcbikge1xuICBpZiAoIVNVUFBPUlRFRCkgcmV0dXJuIGZuO1xuXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgZnVuY3Rpb24gKC4uLmFyZ3M6IEEpIHtcbiAgICAgIHJldHVybiBmbiguLi5hcmdzKTtcbiAgICB9LFxuICAgIFwibmFtZVwiLFxuICAgIHsgdmFsdWU6IFNUQVJUX0hJRElORyB9LFxuICApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFByZXBhcmVTdGFja1RyYWNlKCkge1xuICAvLyBAdHMtZXhwZWN0LWVycm9yIFRoaXMgZnVuY3Rpb24gaXMgYSBzaW5nbGV0b25cbiAgc2V0dXBQcmVwYXJlU3RhY2tUcmFjZSA9ICgpID0+IHt9O1xuXG4gIGNvbnN0IHsgcHJlcGFyZVN0YWNrVHJhY2UgPSBkZWZhdWx0UHJlcGFyZVN0YWNrVHJhY2UgfSA9IEVycm9yO1xuXG4gIC8vIFdlIGFkZCBzb21lIGV4dHJhIGZyYW1lcyB0byBFcnJvci5zdGFja1RyYWNlTGltaXQsIHNvIHRoYXQgd2UgY2FuXG4gIC8vIGFsd2F5cyBzaG93IHNvbWUgdXNlZnVsIGZyYW1lcyBldmVuIGFmdGVyIGRlbGV0aW5nIG91cnMuXG4gIC8vIFNUQUNLX1RSQUNFX0xJTUlUX0RFTFRBIHNob3VsZCBiZSBhcm91bmQgdGhlIG1heGltdW0gZXhwZWN0ZWQgbnVtYmVyXG4gIC8vIG9mIGludGVybmFsIGZyYW1lcywgYW5kIG5vdCB0b28gYmlnIGJlY2F1c2UgY2FwdHVyaW5nIHRoZSBzdGFjayB0cmFjZVxuICAvLyBpcyBzbG93ICh0aGlzIGlzIHdoeSBFcnJvci5zdGFja1RyYWNlTGltaXQgZG9lcyBub3QgZGVmYXVsdCB0byBJbmZpbml0eSEpLlxuICAvLyBJbmNyZWFzZSBpdCBpZiBuZWVkZWQuXG4gIC8vIEhvd2V2ZXIsIHdlIG9ubHkgZG8gaXQgaWYgdGhlIHVzZXIgZGlkIG5vdCBleHBsaWNpdGx5IHNldCBpdCB0byAwLlxuICBjb25zdCBNSU5fU1RBQ0tfVFJBQ0VfTElNSVQgPSA1MDtcbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ICYmPSBNYXRoLm1heChcbiAgICBFcnJvci5zdGFja1RyYWNlTGltaXQsXG4gICAgTUlOX1NUQUNLX1RSQUNFX0xJTUlULFxuICApO1xuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24gc3RhY2tUcmFjZVJld3JpdGVyKGVyciwgdHJhY2UpIHtcbiAgICBsZXQgbmV3VHJhY2UgPSBbXTtcblxuICAgIGNvbnN0IGlzRXhwZWN0ZWQgPSBleHBlY3RlZEVycm9ycy5oYXMoZXJyKTtcbiAgICBsZXQgc3RhdHVzOiBcInNob3dpbmdcIiB8IFwiaGlkaW5nXCIgfCBcInVua25vd25cIiA9IGlzRXhwZWN0ZWRcbiAgICAgID8gXCJoaWRpbmdcIlxuICAgICAgOiBcInVua25vd25cIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuYW1lID0gdHJhY2VbaV0uZ2V0RnVuY3Rpb25OYW1lKCk7XG4gICAgICBpZiAobmFtZSA9PT0gU1RBUlRfSElESU5HKSB7XG4gICAgICAgIHN0YXR1cyA9IFwiaGlkaW5nXCI7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFNUT1BfSElESU5HKSB7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiaGlkaW5nXCIpIHtcbiAgICAgICAgICBzdGF0dXMgPSBcInNob3dpbmdcIjtcbiAgICAgICAgICBpZiAodmlydHVhbEZyYW1lcy5oYXMoZXJyKSkge1xuICAgICAgICAgICAgbmV3VHJhY2UudW5zaGlmdCguLi52aXJ0dWFsRnJhbWVzLmdldChlcnIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBcInVua25vd25cIikge1xuICAgICAgICAgIC8vIFVuZXhwZWN0ZWQgaW50ZXJuYWwgZXJyb3IsIHNob3cgdGhlIGZ1bGwgc3RhY2sgdHJhY2VcbiAgICAgICAgICBuZXdUcmFjZSA9IHRyYWNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gXCJoaWRpbmdcIikge1xuICAgICAgICBuZXdUcmFjZS5wdXNoKHRyYWNlW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJlcGFyZVN0YWNrVHJhY2UoZXJyLCBuZXdUcmFjZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRQcmVwYXJlU3RhY2tUcmFjZShlcnI6IEVycm9yLCB0cmFjZTogQ2FsbFNpdGVbXSkge1xuICBpZiAodHJhY2UubGVuZ3RoID09PSAwKSByZXR1cm4gRXJyb3JUb1N0cmluZyhlcnIpO1xuICByZXR1cm4gYCR7RXJyb3JUb1N0cmluZyhlcnIpfVxcbiAgICBhdCAke3RyYWNlLmpvaW4oXCJcXG4gICAgYXQgXCIpfWA7XG59XG4iLCJpbXBvcnQgc2VtdmVyIGZyb20gXCJzZW12ZXJcIjtcbmltcG9ydCB7IHByZXR0aWZ5VmVyc2lvbiB9IGZyb20gXCIuL3ByZXR0eS50c1wiO1xuaW1wb3J0IHtcbiAgc2VtdmVyaWZ5LFxuICBpc1VucmVsZWFzZWRWZXJzaW9uLFxuICBnZXRMb3dlc3RJbXBsZW1lbnRlZFZlcnNpb24sXG59IGZyb20gXCIuL3V0aWxzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFRhcmdldCwgVGFyZ2V0cyB9IGZyb20gXCIuL3R5cGVzLnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmNsdXNpb25SZWFzb25zKFxuICBpdGVtOiBzdHJpbmcsXG4gIHRhcmdldFZlcnNpb25zOiBUYXJnZXRzLFxuICBsaXN0OiB7IFtrZXk6IHN0cmluZ106IFRhcmdldHMgfSxcbikge1xuICBjb25zdCBtaW5WZXJzaW9ucyA9IGxpc3RbaXRlbV0gfHwge307XG5cbiAgcmV0dXJuIChPYmplY3Qua2V5cyh0YXJnZXRWZXJzaW9ucykgYXMgVGFyZ2V0W10pLnJlZHVjZShcbiAgICAocmVzdWx0LCBlbnYpID0+IHtcbiAgICAgIGNvbnN0IG1pblZlcnNpb24gPSBnZXRMb3dlc3RJbXBsZW1lbnRlZFZlcnNpb24obWluVmVyc2lvbnMsIGVudik7XG4gICAgICBjb25zdCB0YXJnZXRWZXJzaW9uID0gdGFyZ2V0VmVyc2lvbnNbZW52XTtcblxuICAgICAgaWYgKCFtaW5WZXJzaW9uKSB7XG4gICAgICAgIHJlc3VsdFtlbnZdID0gcHJldHRpZnlWZXJzaW9uKHRhcmdldFZlcnNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWluSXNVbnJlbGVhc2VkID0gaXNVbnJlbGVhc2VkVmVyc2lvbihtaW5WZXJzaW9uLCBlbnYpO1xuICAgICAgICBjb25zdCB0YXJnZXRJc1VucmVsZWFzZWQgPSBpc1VucmVsZWFzZWRWZXJzaW9uKHRhcmdldFZlcnNpb24sIGVudik7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICF0YXJnZXRJc1VucmVsZWFzZWQgJiZcbiAgICAgICAgICAobWluSXNVbnJlbGVhc2VkIHx8XG4gICAgICAgICAgICBzZW12ZXIubHQodGFyZ2V0VmVyc2lvbi50b1N0cmluZygpLCBzZW12ZXJpZnkobWluVmVyc2lvbikpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXN1bHRbZW52XSA9IHByZXR0aWZ5VmVyc2lvbih0YXJnZXRWZXJzaW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAge30gYXMgUGFydGlhbDxSZWNvcmQ8VGFyZ2V0LCBzdHJpbmc+PixcbiAgKTtcbn1cbiIsImltcG9ydCBzZW12ZXIgZnJvbSBcInNlbXZlclwiO1xuXG5pbXBvcnQgcGx1Z2luc0NvbXBhdERhdGEgZnJvbSBcIkBiYWJlbC9jb21wYXQtZGF0YS9wbHVnaW5zXCI7XG5cbmltcG9ydCB0eXBlIHsgVGFyZ2V0cyB9IGZyb20gXCIuL3R5cGVzLnRzXCI7XG5pbXBvcnQge1xuICBnZXRMb3dlc3RJbXBsZW1lbnRlZFZlcnNpb24sXG4gIGlzVW5yZWxlYXNlZFZlcnNpb24sXG4gIHNlbXZlcmlmeSxcbn0gZnJvbSBcIi4vdXRpbHMudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRhcmdldHNTdXBwb3J0ZWQodGFyZ2V0OiBUYXJnZXRzLCBzdXBwb3J0OiBUYXJnZXRzKSB7XG4gIGNvbnN0IHRhcmdldEVudmlyb25tZW50cyA9IE9iamVjdC5rZXlzKHRhcmdldCkgYXMgQXJyYXk8a2V5b2YgVGFyZ2V0cz47XG5cbiAgaWYgKHRhcmdldEVudmlyb25tZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB1bnN1cHBvcnRlZEVudmlyb25tZW50cyA9IHRhcmdldEVudmlyb25tZW50cy5maWx0ZXIoZW52aXJvbm1lbnQgPT4ge1xuICAgIGNvbnN0IGxvd2VzdEltcGxlbWVudGVkVmVyc2lvbiA9IGdldExvd2VzdEltcGxlbWVudGVkVmVyc2lvbihcbiAgICAgIHN1cHBvcnQsXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICApO1xuXG4gICAgLy8gRmVhdHVyZSBpcyBub3QgaW1wbGVtZW50ZWQgaW4gdGhhdCBlbnZpcm9ubWVudFxuICAgIGlmICghbG93ZXN0SW1wbGVtZW50ZWRWZXJzaW9uKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBsb3dlc3RUYXJnZXRlZFZlcnNpb24gPSB0YXJnZXRbZW52aXJvbm1lbnRdO1xuXG4gICAgLy8gSWYgdGFyZ2V0cyBoYXMgdW5yZWxlYXNlZCB2YWx1ZSBhcyBhIGxvd2VzdCB2ZXJzaW9uLCB0aGVuIGRvbid0IHJlcXVpcmUgYSBwbHVnaW4uXG4gICAgaWYgKGlzVW5yZWxlYXNlZFZlcnNpb24obG93ZXN0VGFyZ2V0ZWRWZXJzaW9uLCBlbnZpcm9ubWVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJbmNsdWRlIHBsdWdpbiBpZiBpdCBpcyBzdXBwb3J0ZWQgaW4gdGhlIHVucmVsZWFzZWQgZW52aXJvbm1lbnQsIHdoaWNoIHdhc24ndCBzcGVjaWZpZWQgaW4gdGFyZ2V0c1xuICAgIGlmIChpc1VucmVsZWFzZWRWZXJzaW9uKGxvd2VzdEltcGxlbWVudGVkVmVyc2lvbiwgZW52aXJvbm1lbnQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXNlbXZlci52YWxpZChsb3dlc3RUYXJnZXRlZFZlcnNpb24udG9TdHJpbmcoKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgdmVyc2lvbiBwYXNzZWQgZm9yIHRhcmdldCBcIiR7ZW52aXJvbm1lbnR9XCI6IFwiJHtsb3dlc3RUYXJnZXRlZFZlcnNpb259XCIuIGAgK1xuICAgICAgICAgIFwiVmVyc2lvbnMgbXVzdCBiZSBpbiBzZW12ZXIgZm9ybWF0IChtYWpvci5taW5vci5wYXRjaClcIixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbXZlci5ndChcbiAgICAgIHNlbXZlcmlmeShsb3dlc3RJbXBsZW1lbnRlZFZlcnNpb24pLFxuICAgICAgbG93ZXN0VGFyZ2V0ZWRWZXJzaW9uLnRvU3RyaW5nKCksXG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHVuc3VwcG9ydGVkRW52aXJvbm1lbnRzLmxlbmd0aCA9PT0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVxdWlyZWQoXG4gIG5hbWU6IHN0cmluZyxcbiAgdGFyZ2V0czogVGFyZ2V0cyxcbiAge1xuICAgIGNvbXBhdERhdGEgPSBwbHVnaW5zQ29tcGF0RGF0YSxcbiAgICBpbmNsdWRlcyxcbiAgICBleGNsdWRlcyxcbiAgfToge1xuICAgIGNvbXBhdERhdGE/OiB7IFtmZWF0dXJlOiBzdHJpbmddOiBUYXJnZXRzIH07XG4gICAgaW5jbHVkZXM/OiBTZXQ8c3RyaW5nPjtcbiAgICBleGNsdWRlcz86IFNldDxzdHJpbmc+O1xuICB9ID0ge30sXG4pIHtcbiAgaWYgKGV4Y2x1ZGVzPy5oYXMobmFtZSkpIHJldHVybiBmYWxzZTtcbiAgaWYgKGluY2x1ZGVzPy5oYXMobmFtZSkpIHJldHVybiB0cnVlO1xuICByZXR1cm4gIXRhcmdldHNTdXBwb3J0ZWQodGFyZ2V0cywgY29tcGF0RGF0YVtuYW1lXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbHRlckl0ZW1zKFxuICBsaXN0OiB7IFtmZWF0dXJlOiBzdHJpbmddOiBUYXJnZXRzIH0sXG4gIGluY2x1ZGVzOiBTZXQ8c3RyaW5nPixcbiAgZXhjbHVkZXM6IFNldDxzdHJpbmc+LFxuICB0YXJnZXRzOiBUYXJnZXRzLFxuICBkZWZhdWx0SW5jbHVkZXM6IEFycmF5PHN0cmluZz4gfCBudWxsLFxuICBkZWZhdWx0RXhjbHVkZXM/OiBBcnJheTxzdHJpbmc+IHwgbnVsbCxcbiAgcGx1Z2luU3ludGF4TWFwPzogTWFwPHN0cmluZywgc3RyaW5nIHwgbnVsbD4sXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IG9wdGlvbnMgPSB7IGNvbXBhdERhdGE6IGxpc3QsIGluY2x1ZGVzLCBleGNsdWRlcyB9O1xuXG4gIGZvciAoY29uc3QgaXRlbSBpbiBsaXN0KSB7XG4gICAgaWYgKGlzUmVxdWlyZWQoaXRlbSwgdGFyZ2V0cywgb3B0aW9ucykpIHtcbiAgICAgIHJlc3VsdC5hZGQoaXRlbSk7XG4gICAgfSBlbHNlIGlmIChwbHVnaW5TeW50YXhNYXApIHtcbiAgICAgIGNvbnN0IHNoaXBwZWRQcm9wb3NhbHNTeW50YXggPSBwbHVnaW5TeW50YXhNYXAuZ2V0KGl0ZW0pO1xuXG4gICAgICBpZiAoc2hpcHBlZFByb3Bvc2Fsc1N5bnRheCkge1xuICAgICAgICByZXN1bHQuYWRkKHNoaXBwZWRQcm9wb3NhbHNTeW50YXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlZmF1bHRJbmNsdWRlcz8uZm9yRWFjaChpdGVtID0+ICFleGNsdWRlcy5oYXMoaXRlbSkgJiYgcmVzdWx0LmFkZChpdGVtKSk7XG4gIGRlZmF1bHRFeGNsdWRlcz8uZm9yRWFjaChpdGVtID0+ICFpbmNsdWRlcy5oYXMoaXRlbSkgJiYgcmVzdWx0LmRlbGV0ZShpdGVtKSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCBicm93c2Vyc2xpc3QgZnJvbSBcImJyb3dzZXJzbGlzdFwiO1xuaW1wb3J0IHsgZmluZFN1Z2dlc3Rpb24gfSBmcm9tIFwiQGJhYmVsL2hlbHBlci12YWxpZGF0b3Itb3B0aW9uXCI7XG5pbXBvcnQgYnJvd3Nlck1vZHVsZXNEYXRhIGZyb20gXCJAYmFiZWwvY29tcGF0LWRhdGEvbmF0aXZlLW1vZHVsZXNcIjtcbmltcG9ydCBMcnVDYWNoZSBmcm9tIFwibHJ1LWNhY2hlXCI7XG5cbmltcG9ydCB7XG4gIHNlbXZlcmlmeSxcbiAgc2VtdmVyTWluLFxuICBpc1VucmVsZWFzZWRWZXJzaW9uLFxuICBnZXRMb3dlc3RVbnJlbGVhc2VkLFxuICBnZXRIaWdoZXN0VW5yZWxlYXNlZCxcbn0gZnJvbSBcIi4vdXRpbHMudHNcIjtcbmltcG9ydCB7IE9wdGlvblZhbGlkYXRvciB9IGZyb20gXCJAYmFiZWwvaGVscGVyLXZhbGlkYXRvci1vcHRpb25cIjtcbmltcG9ydCB7IGJyb3dzZXJOYW1lTWFwIH0gZnJvbSBcIi4vdGFyZ2V0cy50c1wiO1xuaW1wb3J0IHsgVGFyZ2V0TmFtZXMgfSBmcm9tIFwiLi9vcHRpb25zLnRzXCI7XG5pbXBvcnQgdHlwZSB7XG4gIFRhcmdldCxcbiAgVGFyZ2V0cyxcbiAgSW5wdXRUYXJnZXRzLFxuICBCcm93c2VycyxcbiAgQnJvd3NlcnNsaXN0QnJvd3Nlck5hbWUsXG4gIFRhcmdldHNUdXBsZSxcbn0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuZXhwb3J0IHR5cGUgeyBUYXJnZXQsIFRhcmdldHMsIElucHV0VGFyZ2V0cyB9O1xuXG5leHBvcnQgeyBwcmV0dGlmeVRhcmdldHMgfSBmcm9tIFwiLi9wcmV0dHkudHNcIjtcbmV4cG9ydCB7IGdldEluY2x1c2lvblJlYXNvbnMgfSBmcm9tIFwiLi9kZWJ1Zy50c1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBmaWx0ZXJJdGVtcywgaXNSZXF1aXJlZCB9IGZyb20gXCIuL2ZpbHRlci1pdGVtcy50c1wiO1xuZXhwb3J0IHsgdW5yZWxlYXNlZExhYmVscyB9IGZyb20gXCIuL3RhcmdldHMudHNcIjtcbmV4cG9ydCB7IFRhcmdldE5hbWVzIH07XG5cbmNvbnN0IEVTTV9TVVBQT1JUID0gYnJvd3Nlck1vZHVsZXNEYXRhW1wiZXM2Lm1vZHVsZVwiXTtcblxuY29uc3QgdiA9IG5ldyBPcHRpb25WYWxpZGF0b3IoUEFDS0FHRV9KU09OLm5hbWUpO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVRhcmdldE5hbWVzKHRhcmdldHM6IFRhcmdldHMpOiBUYXJnZXRzVHVwbGUge1xuICBjb25zdCB2YWxpZFRhcmdldHMgPSBPYmplY3Qua2V5cyhUYXJnZXROYW1lcyk7XG4gIGZvciAoY29uc3QgdGFyZ2V0IG9mIE9iamVjdC5rZXlzKHRhcmdldHMpKSB7XG4gICAgaWYgKCEodGFyZ2V0IGluIFRhcmdldE5hbWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICB2LmZvcm1hdE1lc3NhZ2UoYCcke3RhcmdldH0nIGlzIG5vdCBhIHZhbGlkIHRhcmdldFxuLSBEaWQgeW91IG1lYW4gJyR7ZmluZFN1Z2dlc3Rpb24odGFyZ2V0LCB2YWxpZFRhcmdldHMpfSc/YCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCcm93c2Vyc1F1ZXJ5VmFsaWQoYnJvd3NlcnM6IHVua25vd24pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgYnJvd3NlcnMgPT09IFwic3RyaW5nXCIgfHxcbiAgICAoQXJyYXkuaXNBcnJheShicm93c2VycykgJiYgYnJvd3NlcnMuZXZlcnkoYiA9PiB0eXBlb2YgYiA9PT0gXCJzdHJpbmdcIikpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQnJvd3NlcnMoYnJvd3NlcnM6IEJyb3dzZXJzIHwgdW5kZWZpbmVkKSB7XG4gIHYuaW52YXJpYW50KFxuICAgIGJyb3dzZXJzID09PSB1bmRlZmluZWQgfHwgaXNCcm93c2Vyc1F1ZXJ5VmFsaWQoYnJvd3NlcnMpLFxuICAgIGAnJHtTdHJpbmcoYnJvd3NlcnMpfScgaXMgbm90IGEgdmFsaWQgYnJvd3NlcnNsaXN0IHF1ZXJ5YCxcbiAgKTtcblxuICByZXR1cm4gYnJvd3NlcnM7XG59XG5cbmZ1bmN0aW9uIGdldExvd2VzdFZlcnNpb25zKGJyb3dzZXJzOiBBcnJheTxzdHJpbmc+KTogVGFyZ2V0cyB7XG4gIHJldHVybiBicm93c2Vycy5yZWR1Y2UoXG4gICAgKGFsbCwgYnJvd3NlcikgPT4ge1xuICAgICAgY29uc3QgW2Jyb3dzZXJOYW1lLCBicm93c2VyVmVyc2lvbl0gPSBicm93c2VyLnNwbGl0KFwiIFwiKSBhcyBbXG4gICAgICAgIEJyb3dzZXJzbGlzdEJyb3dzZXJOYW1lLFxuICAgICAgICBzdHJpbmcsXG4gICAgICBdO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gYnJvd3Nlck5hbWVNYXBbYnJvd3Nlck5hbWVdO1xuXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm4gYWxsO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBCcm93c2VyIHZlcnNpb24gY2FuIHJldHVybiBhcyBcIjEwLjAtMTAuMlwiXG4gICAgICAgIGNvbnN0IHNwbGl0VmVyc2lvbiA9IGJyb3dzZXJWZXJzaW9uLnNwbGl0KFwiLVwiKVswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpc1NwbGl0VW5yZWxlYXNlZCA9IGlzVW5yZWxlYXNlZFZlcnNpb24oc3BsaXRWZXJzaW9uLCB0YXJnZXQpO1xuXG4gICAgICAgIGlmICghYWxsW3RhcmdldF0pIHtcbiAgICAgICAgICBhbGxbdGFyZ2V0XSA9IGlzU3BsaXRVbnJlbGVhc2VkXG4gICAgICAgICAgICA/IHNwbGl0VmVyc2lvblxuICAgICAgICAgICAgOiBzZW12ZXJpZnkoc3BsaXRWZXJzaW9uKTtcbiAgICAgICAgICByZXR1cm4gYWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmVyc2lvbiA9IGFsbFt0YXJnZXRdO1xuICAgICAgICBjb25zdCBpc1VucmVsZWFzZWQgPSBpc1VucmVsZWFzZWRWZXJzaW9uKHZlcnNpb24sIHRhcmdldCk7XG5cbiAgICAgICAgaWYgKGlzVW5yZWxlYXNlZCAmJiBpc1NwbGl0VW5yZWxlYXNlZCkge1xuICAgICAgICAgIGFsbFt0YXJnZXRdID0gZ2V0TG93ZXN0VW5yZWxlYXNlZCh2ZXJzaW9uLCBzcGxpdFZlcnNpb24sIHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNVbnJlbGVhc2VkKSB7XG4gICAgICAgICAgYWxsW3RhcmdldF0gPSBzZW12ZXJpZnkoc3BsaXRWZXJzaW9uKTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNVbnJlbGVhc2VkICYmICFpc1NwbGl0VW5yZWxlYXNlZCkge1xuICAgICAgICAgIGNvbnN0IHBhcnNlZEJyb3dzZXJWZXJzaW9uID0gc2VtdmVyaWZ5KHNwbGl0VmVyc2lvbik7XG5cbiAgICAgICAgICBhbGxbdGFyZ2V0XSA9IHNlbXZlck1pbih2ZXJzaW9uLCBwYXJzZWRCcm93c2VyVmVyc2lvbik7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF8pIHt9XG5cbiAgICAgIHJldHVybiBhbGw7XG4gICAgfSxcbiAgICB7fSBhcyBSZWNvcmQ8VGFyZ2V0LCBzdHJpbmc+LFxuICApO1xufVxuXG5mdW5jdGlvbiBvdXRwdXREZWNpbWFsV2FybmluZyhcbiAgZGVjaW1hbFRhcmdldHM6IEFycmF5PHsgdGFyZ2V0OiBzdHJpbmc7IHZhbHVlOiBudW1iZXIgfT4sXG4pIHtcbiAgaWYgKCFkZWNpbWFsVGFyZ2V0cy5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zb2xlLndhcm4oXCJXYXJuaW5nLCB0aGUgZm9sbG93aW5nIHRhcmdldHMgYXJlIHVzaW5nIGEgZGVjaW1hbCB2ZXJzaW9uOlxcblwiKTtcbiAgZGVjaW1hbFRhcmdldHMuZm9yRWFjaCgoeyB0YXJnZXQsIHZhbHVlIH0pID0+XG4gICAgY29uc29sZS53YXJuKGAgICR7dGFyZ2V0fTogJHt2YWx1ZX1gKSxcbiAgKTtcbiAgY29uc29sZS53YXJuKGBcbldlIHJlY29tbWVuZCB1c2luZyBhIHN0cmluZyBmb3IgbWlub3IvcGF0Y2ggdmVyc2lvbnMgdG8gYXZvaWQgbnVtYmVycyBsaWtlIDYuMTBcbmdldHRpbmcgcGFyc2VkIGFzIDYuMSwgd2hpY2ggY2FuIGxlYWQgdG8gdW5leHBlY3RlZCBiZWhhdmlvci5cbmApO1xufVxuXG5mdW5jdGlvbiBzZW12ZXJpZnlUYXJnZXQodGFyZ2V0OiBUYXJnZXQsIHZhbHVlOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gc2VtdmVyaWZ5KHZhbHVlKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIHYuZm9ybWF0TWVzc2FnZShcbiAgICAgICAgYCcke3ZhbHVlfScgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yICd0YXJnZXRzLiR7dGFyZ2V0fScuYCxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuXG4vLyBQYXJzZSBgbm9kZTogdHJ1ZWAgYW5kIGBub2RlOiBcImN1cnJlbnRcImAgdG8gdmVyc2lvblxuZnVuY3Rpb24gbm9kZVRhcmdldFBhcnNlcih2YWx1ZTogdHJ1ZSB8IHN0cmluZykge1xuICBjb25zdCBwYXJzZWQgPVxuICAgIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBcImN1cnJlbnRcIlxuICAgICAgPyBwcm9jZXNzLnZlcnNpb25zLm5vZGVcbiAgICAgIDogc2VtdmVyaWZ5VGFyZ2V0KFwibm9kZVwiLCB2YWx1ZSk7XG4gIHJldHVybiBbXCJub2RlXCIsIHBhcnNlZF0gYXMgY29uc3Q7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRUYXJnZXRQYXJzZXIoXG4gIHRhcmdldDogRXhjbHVkZTxUYXJnZXQsIFwibm9kZVwiPixcbiAgdmFsdWU6IHN0cmluZyxcbik6IHJlYWRvbmx5IFtFeGNsdWRlPFRhcmdldCwgXCJub2RlXCI+LCBzdHJpbmddIHtcbiAgY29uc3QgdmVyc2lvbiA9IGlzVW5yZWxlYXNlZFZlcnNpb24odmFsdWUsIHRhcmdldClcbiAgICA/IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICA6IHNlbXZlcmlmeVRhcmdldCh0YXJnZXQsIHZhbHVlKTtcbiAgcmV0dXJuIFt0YXJnZXQsIHZlcnNpb25dIGFzIGNvbnN0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRhcmdldHMoaW5wdXRUYXJnZXRzOiBJbnB1dFRhcmdldHMpOiBUYXJnZXRzIHtcbiAgY29uc3QgaW5wdXQgPSB7IC4uLmlucHV0VGFyZ2V0cyB9O1xuICBkZWxldGUgaW5wdXQuZXNtb2R1bGVzO1xuICBkZWxldGUgaW5wdXQuYnJvd3NlcnM7XG4gIHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldHMocXVlcmllczogQnJvd3NlcnMsIGVudj86IHN0cmluZyk6IFRhcmdldHMge1xuICBjb25zdCByZXNvbHZlZCA9IGJyb3dzZXJzbGlzdChxdWVyaWVzLCB7XG4gICAgbW9iaWxlVG9EZXNrdG9wOiB0cnVlLFxuICAgIGVudixcbiAgfSk7XG4gIHJldHVybiBnZXRMb3dlc3RWZXJzaW9ucyhyZXNvbHZlZCk7XG59XG5cbmNvbnN0IHRhcmdldHNDYWNoZSA9IG5ldyBMcnVDYWNoZSh7IG1heDogNjQgfSk7XG5cbmZ1bmN0aW9uIHJlc29sdmVUYXJnZXRzQ2FjaGVkKHF1ZXJpZXM6IEJyb3dzZXJzLCBlbnY/OiBzdHJpbmcpOiBUYXJnZXRzIHtcbiAgY29uc3QgY2FjaGVLZXkgPSB0eXBlb2YgcXVlcmllcyA9PT0gXCJzdHJpbmdcIiA/IHF1ZXJpZXMgOiBxdWVyaWVzLmpvaW4oKSArIGVudjtcbiAgbGV0IGNhY2hlZCA9IHRhcmdldHNDYWNoZS5nZXQoY2FjaGVLZXkpIGFzIFRhcmdldHMgfCB1bmRlZmluZWQ7XG4gIGlmICghY2FjaGVkKSB7XG4gICAgY2FjaGVkID0gcmVzb2x2ZVRhcmdldHMocXVlcmllcywgZW52KTtcbiAgICB0YXJnZXRzQ2FjaGUuc2V0KGNhY2hlS2V5LCBjYWNoZWQpO1xuICB9XG4gIHJldHVybiB7IC4uLmNhY2hlZCB9O1xufVxuXG50eXBlIEdldFRhcmdldHNPcHRpb24gPSB7XG4gIC8vIFRoaXMgaXMgbm90IHRoZSBwYXRoIG9mIHRoZSBjb25maWcgZmlsZSwgYnV0IHRoZSBwYXRoIHdoZXJlIHN0YXJ0IHNlYXJjaGluZyBpdCBmcm9tXG4gIGNvbmZpZ1BhdGg/OiBzdHJpbmc7XG4gIC8vIFRoZSBwYXRoIG9mIHRoZSBjb25maWcgZmlsZVxuICBjb25maWdGaWxlPzogc3RyaW5nO1xuICAvLyBUaGUgZW52IHRvIHBhc3MgdG8gYnJvd3NlcnNsaXN0XG4gIGJyb3dzZXJzbGlzdEVudj86IHN0cmluZztcbiAgLy8gdHJ1ZSB0byBkaXNhYmxlIGNvbmZpZyBsb2FkaW5nXG4gIGlnbm9yZUJyb3dzZXJzbGlzdENvbmZpZz86IGJvb2xlYW47XG4gIC8vIGN1c3RvbSBob29rIHdoZW4gYnJvd3NlcnNsaXN0IGNvbmZpZyBpcyBmb3VuZFxuICBvbkJyb3dzZXJzbGlzdENvbmZpZ0ZvdW5kPzogKGNvbmZpZ0ZpbGU6IHN0cmluZykgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFRhcmdldHMoXG4gIGlucHV0VGFyZ2V0czogSW5wdXRUYXJnZXRzID0ge30sXG4gIG9wdGlvbnM6IEdldFRhcmdldHNPcHRpb24gPSB7fSxcbik6IFRhcmdldHMge1xuICBsZXQgeyBicm93c2VycywgZXNtb2R1bGVzIH0gPSBpbnB1dFRhcmdldHM7XG4gIGNvbnN0IHsgY29uZmlnUGF0aCA9IFwiLlwiLCBvbkJyb3dzZXJzbGlzdENvbmZpZ0ZvdW5kIH0gPSBvcHRpb25zO1xuXG4gIHZhbGlkYXRlQnJvd3NlcnMoYnJvd3NlcnMpO1xuXG4gIGNvbnN0IGlucHV0ID0gZ2VuZXJhdGVUYXJnZXRzKGlucHV0VGFyZ2V0cyk7XG4gIGxldCB0YXJnZXRzID0gdmFsaWRhdGVUYXJnZXROYW1lcyhpbnB1dCk7XG5cbiAgY29uc3Qgc2hvdWxkUGFyc2VCcm93c2VycyA9ICEhYnJvd3NlcnM7XG4gIGNvbnN0IGhhc1RhcmdldHMgPSBzaG91bGRQYXJzZUJyb3dzZXJzIHx8IE9iamVjdC5rZXlzKHRhcmdldHMpLmxlbmd0aCA+IDA7XG4gIGNvbnN0IHNob3VsZFNlYXJjaEZvckNvbmZpZyA9XG4gICAgIW9wdGlvbnMuaWdub3JlQnJvd3NlcnNsaXN0Q29uZmlnICYmICFoYXNUYXJnZXRzO1xuXG4gIGlmICghYnJvd3NlcnMgJiYgc2hvdWxkU2VhcmNoRm9yQ29uZmlnKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jyb3dzZXJzbGlzdC9icm93c2Vyc2xpc3QvYmxvYi84YWU4NWNhYTkwNWQxMzBmNGNhODZmN2E5OThhNWI2M2FiYmJlNTgyL25vZGUuanMjTDI0M1xuICAgIGJyb3dzZXJzID0gcHJvY2Vzcy5lbnYuQlJPV1NFUlNMSVNUO1xuICAgIGlmICghYnJvd3NlcnMpIHtcbiAgICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPVxuICAgICAgICBvcHRpb25zLmNvbmZpZ0ZpbGUgfHxcbiAgICAgICAgcHJvY2Vzcy5lbnYuQlJPV1NFUlNMSVNUX0NPTkZJRyB8fFxuICAgICAgICBicm93c2Vyc2xpc3QuZmluZENvbmZpZ0ZpbGUoY29uZmlnUGF0aCk7XG4gICAgICBpZiAoY29uZmlnRmlsZSAhPSBudWxsKSB7XG4gICAgICAgIG9uQnJvd3NlcnNsaXN0Q29uZmlnRm91bmQ/Lihjb25maWdGaWxlKTtcbiAgICAgICAgYnJvd3NlcnMgPSBicm93c2Vyc2xpc3QubG9hZENvbmZpZyh7XG4gICAgICAgICAgY29uZmlnOiBjb25maWdGaWxlLFxuICAgICAgICAgIGVudjogb3B0aW9ucy5icm93c2Vyc2xpc3RFbnYsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChicm93c2VycyA9PSBudWxsKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuQkFCRUxfOF9CUkVBS0lORykge1xuICAgICAgICAvLyBJbiBCYWJlbCA4LCBpZiBubyB0YXJnZXRzIGFyZSBwYXNzZWQsIHdlIHVzZSBicm93c2Vyc2xpc3QncyBkZWZhdWx0cy5cbiAgICAgICAgYnJvd3NlcnMgPSBbXCJkZWZhdWx0c1wiXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIG5vIHRhcmdldHMgYXJlIHBhc3NlZCwgd2UgbmVlZCB0byBvdmVyd3JpdGUgYnJvd3NlcnNsaXN0J3MgZGVmYXVsdHNcbiAgICAgICAgLy8gc28gdGhhdCB3ZSBlbmFibGUgYWxsIHRyYW5zZm9ybXMgKGFjdGluZyBsaWtlIHRoZSBub3cgZGVwcmVjYXRlZFxuICAgICAgICAvLyBwcmVzZXQtbGF0ZXN0KS5cbiAgICAgICAgYnJvd3NlcnMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBgZXNtb2R1bGVzYCBhcyBhIHRhcmdldCBpbmRpY2F0ZXMgdGhlIHNwZWNpZmljIHNldCBvZiBicm93c2VycyBzdXBwb3J0aW5nIEVTIE1vZHVsZXMuXG4gIC8vIFRoZXNlIHZhbHVlcyBPVkVSUklERSB0aGUgYGJyb3dzZXJzYCBmaWVsZC5cbiAgaWYgKGVzbW9kdWxlcyAmJiAoZXNtb2R1bGVzICE9PSBcImludGVyc2VjdFwiIHx8ICFicm93c2Vycz8ubGVuZ3RoKSkge1xuICAgIGJyb3dzZXJzID0gT2JqZWN0LmtleXMoRVNNX1NVUFBPUlQpXG4gICAgICAubWFwKFxuICAgICAgICAoYnJvd3Nlcjoga2V5b2YgdHlwZW9mIEVTTV9TVVBQT1JUKSA9PlxuICAgICAgICAgIGAke2Jyb3dzZXJ9ID49ICR7RVNNX1NVUFBPUlRbYnJvd3Nlcl19YCxcbiAgICAgIClcbiAgICAgIC5qb2luKFwiLCBcIik7XG4gICAgZXNtb2R1bGVzID0gZmFsc2U7XG4gIH1cblxuICAvLyBJZiBjdXJyZW50IHZhbHVlIG9mIGBicm93c2Vyc2AgaXMgdW5kZWZpbmVkIChgaWdub3JlQnJvd3NlcnNsaXN0Q29uZmlnYCBzaG91bGQgYmUgYGZhbHNlYClcbiAgLy8gb3IgYW4gZW1wdHkgYXJyYXkgKHdpdGhvdXQgYW55IHVzZXIgY29uZmlnLCB1c2UgZGVmYXVsdCBjb25maWcpLFxuICAvLyB3ZSBkb24ndCBuZWVkIHRvIGNhbGwgYHJlc29sdmVUYXJnZXRzYCB0byBleGVjdXRlIHRoZSByZWxhdGVkIG1ldGhvZHMgb2YgYGJyb3dzZXJzbGlzdGAgbGlicmFyeS5cbiAgaWYgKGJyb3dzZXJzPy5sZW5ndGgpIHtcbiAgICBjb25zdCBxdWVyeUJyb3dzZXJzID0gcmVzb2x2ZVRhcmdldHNDYWNoZWQoXG4gICAgICBicm93c2VycyxcbiAgICAgIG9wdGlvbnMuYnJvd3NlcnNsaXN0RW52LFxuICAgICk7XG5cbiAgICBpZiAoZXNtb2R1bGVzID09PSBcImludGVyc2VjdFwiKSB7XG4gICAgICBmb3IgKGNvbnN0IGJyb3dzZXIgb2YgT2JqZWN0LmtleXMocXVlcnlCcm93c2VycykgYXMgVGFyZ2V0W10pIHtcbiAgICAgICAgaWYgKGJyb3dzZXIgIT09IFwiZGVub1wiICYmIGJyb3dzZXIgIT09IFwiaWVcIikge1xuICAgICAgICAgIGNvbnN0IGVzbVN1cHBvcnRWZXJzaW9uID1cbiAgICAgICAgICAgIEVTTV9TVVBQT1JUW2Jyb3dzZXIgPT09IFwib3BlcmFfbW9iaWxlXCIgPyBcIm9wX21vYlwiIDogYnJvd3Nlcl07XG5cbiAgICAgICAgICBpZiAoZXNtU3VwcG9ydFZlcnNpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSBxdWVyeUJyb3dzZXJzW2Jyb3dzZXJdO1xuICAgICAgICAgICAgcXVlcnlCcm93c2Vyc1ticm93c2VyXSA9IGdldEhpZ2hlc3RVbnJlbGVhc2VkKFxuICAgICAgICAgICAgICB2ZXJzaW9uLFxuICAgICAgICAgICAgICBzZW12ZXJpZnkoZXNtU3VwcG9ydFZlcnNpb24pLFxuICAgICAgICAgICAgICBicm93c2VyLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIHF1ZXJ5QnJvd3NlcnNbYnJvd3Nlcl07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBxdWVyeUJyb3dzZXJzW2Jyb3dzZXJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGFyZ2V0cyA9IE9iamVjdC5hc3NpZ24ocXVlcnlCcm93c2VycywgdGFyZ2V0cyk7XG4gIH1cblxuICAvLyBQYXJzZSByZW1haW5pbmcgdGFyZ2V0c1xuICBjb25zdCByZXN1bHQ6IFRhcmdldHMgPSB7fTtcbiAgY29uc3QgZGVjaW1hbFdhcm5pbmdzID0gW107XG4gIGZvciAoY29uc3QgdGFyZ2V0IG9mIE9iamVjdC5rZXlzKHRhcmdldHMpLnNvcnQoKSBhcyBUYXJnZXRbXSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0c1t0YXJnZXRdO1xuXG4gICAgLy8gV2FybiB3aGVuIHNwZWNpZnlpbmcgbWlub3IvcGF0Y2ggYXMgYSBkZWNpbWFsXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiB2YWx1ZSAlIDEgIT09IDApIHtcbiAgICAgIGRlY2ltYWxXYXJuaW5ncy5wdXNoKHsgdGFyZ2V0LCB2YWx1ZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBbcGFyc2VkVGFyZ2V0LCBwYXJzZWRWYWx1ZV0gPVxuICAgICAgdGFyZ2V0ID09PSBcIm5vZGVcIlxuICAgICAgICA/IG5vZGVUYXJnZXRQYXJzZXIodmFsdWUpXG4gICAgICAgIDogZGVmYXVsdFRhcmdldFBhcnNlcih0YXJnZXQsIHZhbHVlIGFzIHN0cmluZyk7XG5cbiAgICBpZiAocGFyc2VkVmFsdWUpIHtcbiAgICAgIC8vIE1lcmdlIChsb3dlc3Qgd2lucylcbiAgICAgIHJlc3VsdFtwYXJzZWRUYXJnZXRdID0gcGFyc2VkVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgb3V0cHV0RGVjaW1hbFdhcm5pbmcoZGVjaW1hbFdhcm5pbmdzKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiZXhwb3J0IGNvbnN0IFRhcmdldE5hbWVzID0ge1xuICBub2RlOiBcIm5vZGVcIixcbiAgZGVubzogXCJkZW5vXCIsXG4gIGNocm9tZTogXCJjaHJvbWVcIixcbiAgb3BlcmE6IFwib3BlcmFcIixcbiAgZWRnZTogXCJlZGdlXCIsXG4gIGZpcmVmb3g6IFwiZmlyZWZveFwiLFxuICBzYWZhcmk6IFwic2FmYXJpXCIsXG4gIGllOiBcImllXCIsXG4gIGlvczogXCJpb3NcIixcbiAgYW5kcm9pZDogXCJhbmRyb2lkXCIsXG4gIGVsZWN0cm9uOiBcImVsZWN0cm9uXCIsXG4gIHNhbXN1bmc6IFwic2Ftc3VuZ1wiLFxuICByaGlubzogXCJyaGlub1wiLFxuICBvcGVyYV9tb2JpbGU6IFwib3BlcmFfbW9iaWxlXCIsXG59O1xuIiwiaW1wb3J0IHNlbXZlciBmcm9tIFwic2VtdmVyXCI7XG5pbXBvcnQgeyB1bnJlbGVhc2VkTGFiZWxzIH0gZnJvbSBcIi4vdGFyZ2V0cy50c1wiO1xuaW1wb3J0IHR5cGUgeyBUYXJnZXRzLCBUYXJnZXQgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJldHRpZnlWZXJzaW9uKHZlcnNpb246IHN0cmluZykge1xuICBpZiAodHlwZW9mIHZlcnNpb24gIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gdmVyc2lvbjtcbiAgfVxuXG4gIGNvbnN0IHsgbWFqb3IsIG1pbm9yLCBwYXRjaCB9ID0gc2VtdmVyLnBhcnNlKHZlcnNpb24pO1xuXG4gIGNvbnN0IHBhcnRzID0gW21ham9yXTtcblxuICBpZiAobWlub3IgfHwgcGF0Y2gpIHtcbiAgICBwYXJ0cy5wdXNoKG1pbm9yKTtcbiAgfVxuXG4gIGlmIChwYXRjaCkge1xuICAgIHBhcnRzLnB1c2gocGF0Y2gpO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oXCIuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJldHRpZnlUYXJnZXRzKHRhcmdldHM6IFRhcmdldHMpOiBUYXJnZXRzIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHRhcmdldHMpLnJlZHVjZSgocmVzdWx0cywgdGFyZ2V0OiBUYXJnZXQpID0+IHtcbiAgICBsZXQgdmFsdWUgPSB0YXJnZXRzW3RhcmdldF07XG5cbiAgICBjb25zdCB1bnJlbGVhc2VkTGFiZWwgPVxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB1bmRlZmluZWQgaXMgc3RyaWN0bHkgY29tcGFyZWQgd2l0aCBzdHJpbmcgbGF0ZXJcbiAgICAgIHVucmVsZWFzZWRMYWJlbHNbdGFyZ2V0XTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHVucmVsZWFzZWRMYWJlbCAhPT0gdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gcHJldHRpZnlWZXJzaW9uKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXN1bHRzW3RhcmdldF0gPSB2YWx1ZTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSwge30gYXMgVGFyZ2V0cyk7XG59XG4iLCJleHBvcnQgY29uc3QgdW5yZWxlYXNlZExhYmVscyA9IHtcbiAgc2FmYXJpOiBcInRwXCIsXG59IGFzIGNvbnN0O1xuXG4vLyBNYXAgZnJvbSBicm93c2Vyc2xpc3R8QG1kbi9icm93c2VyLWNvbXBhdC1kYXRhIGJyb3dzZXIgbmFtZXMgdG8gQGthbmdheC9jb21wYXQtdGFibGUgYnJvd3NlciBuYW1lc1xuZXhwb3J0IGNvbnN0IGJyb3dzZXJOYW1lTWFwID0ge1xuICBhbmRfY2hyOiBcImNocm9tZVwiLFxuICBhbmRfZmY6IFwiZmlyZWZveFwiLFxuICBhbmRyb2lkOiBcImFuZHJvaWRcIixcbiAgY2hyb21lOiBcImNocm9tZVwiLFxuICBlZGdlOiBcImVkZ2VcIixcbiAgZmlyZWZveDogXCJmaXJlZm94XCIsXG4gIGllOiBcImllXCIsXG4gIGllX21vYjogXCJpZVwiLFxuICBpb3Nfc2FmOiBcImlvc1wiLFxuICBub2RlOiBcIm5vZGVcIixcbiAgZGVubzogXCJkZW5vXCIsXG4gIG9wX21vYjogXCJvcGVyYV9tb2JpbGVcIixcbiAgb3BlcmE6IFwib3BlcmFcIixcbiAgc2FmYXJpOiBcInNhZmFyaVwiLFxuICBzYW1zdW5nOiBcInNhbXN1bmdcIixcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEJyb3dzZXJzbGlzdEJyb3dzZXJOYW1lID0ga2V5b2YgdHlwZW9mIGJyb3dzZXJOYW1lTWFwO1xuIiwiaW1wb3J0IHNlbXZlciBmcm9tIFwic2VtdmVyXCI7XG5pbXBvcnQgeyBPcHRpb25WYWxpZGF0b3IgfSBmcm9tIFwiQGJhYmVsL2hlbHBlci12YWxpZGF0b3Itb3B0aW9uXCI7XG5pbXBvcnQgeyB1bnJlbGVhc2VkTGFiZWxzIH0gZnJvbSBcIi4vdGFyZ2V0cy50c1wiO1xuaW1wb3J0IHR5cGUgeyBUYXJnZXQsIFRhcmdldHMgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG5jb25zdCB2ZXJzaW9uUmVnRXhwID1cbiAgL14oPzpcXGQrfFxcZCg/OlxcZD9bXlxcZFxcblxcclxcdTIwMjhcXHUyMDI5XVxcZCt8XFxkezIsfSg/OlteXFxkXFxuXFxyXFx1MjAyOFxcdTIwMjldXFxkKyk/KSkkLztcblxuY29uc3QgdiA9IG5ldyBPcHRpb25WYWxpZGF0b3IoUEFDS0FHRV9KU09OLm5hbWUpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VtdmVyTWluKFxuICBmaXJzdDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgc2Vjb25kOiBzdHJpbmcsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gZmlyc3QgJiYgc2VtdmVyLmx0KGZpcnN0LCBzZWNvbmQpID8gZmlyc3QgOiBzZWNvbmQ7XG59XG5cbi8vIENvbnZlcnQgdmVyc2lvbiB0byBhIHNlbXZlciB2YWx1ZS5cbi8vIDIuNSAtPiAyLjUuMDsgMSAtPiAxLjAuMDtcbmV4cG9ydCBmdW5jdGlvbiBzZW12ZXJpZnkodmVyc2lvbjogbnVtYmVyIHwgc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSBcInN0cmluZ1wiICYmIHNlbXZlci52YWxpZCh2ZXJzaW9uKSkge1xuICAgIHJldHVybiB2ZXJzaW9uO1xuICB9XG5cbiAgdi5pbnZhcmlhbnQoXG4gICAgdHlwZW9mIHZlcnNpb24gPT09IFwibnVtYmVyXCIgfHxcbiAgICAgICh0eXBlb2YgdmVyc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiB2ZXJzaW9uUmVnRXhwLnRlc3QodmVyc2lvbikpLFxuICAgIGAnJHt2ZXJzaW9ufScgaXMgbm90IGEgdmFsaWQgdmVyc2lvbmAsXG4gICk7XG5cbiAgdmVyc2lvbiA9IHZlcnNpb24udG9TdHJpbmcoKTtcblxuICBsZXQgcG9zID0gMDtcbiAgbGV0IG51bSA9IDA7XG4gIHdoaWxlICgocG9zID0gdmVyc2lvbi5pbmRleE9mKFwiLlwiLCBwb3MgKyAxKSkgPiAwKSB7XG4gICAgbnVtKys7XG4gIH1cbiAgcmV0dXJuIHZlcnNpb24gKyBcIi4wXCIucmVwZWF0KDIgLSBudW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVbnJlbGVhc2VkVmVyc2lvbihcbiAgdmVyc2lvbjogc3RyaW5nIHwgbnVtYmVyLFxuICBlbnY6IFRhcmdldCxcbik6IGJvb2xlYW4ge1xuICBjb25zdCB1bnJlbGVhc2VkTGFiZWwgPVxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdW5yZWxlYXNlZExhYmVsIHdpbGwgYmUgZ3VhcmRlZCBsYXRlclxuICAgIHVucmVsZWFzZWRMYWJlbHNbZW52XTtcbiAgcmV0dXJuIChcbiAgICAhIXVucmVsZWFzZWRMYWJlbCAmJiB1bnJlbGVhc2VkTGFiZWwgPT09IHZlcnNpb24udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb3dlc3RVbnJlbGVhc2VkKGE6IHN0cmluZywgYjogc3RyaW5nLCBlbnY6IFRhcmdldCk6IHN0cmluZyB7XG4gIGNvbnN0IHVucmVsZWFzZWRMYWJlbDpcbiAgICB8ICh0eXBlb2YgdW5yZWxlYXNlZExhYmVscylba2V5b2YgdHlwZW9mIHVucmVsZWFzZWRMYWJlbHNdXG4gICAgfCB1bmRlZmluZWQgPVxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdW5yZWxlYXNlZExhYmVsIGlzIHVuZGVmaW5lZCB3aGVuIGVudiBpcyBub3Qgc2FmYXJpXG4gICAgdW5yZWxlYXNlZExhYmVsc1tlbnZdO1xuICBpZiAoYSA9PT0gdW5yZWxlYXNlZExhYmVsKSB7XG4gICAgcmV0dXJuIGI7XG4gIH1cbiAgaWYgKGIgPT09IHVucmVsZWFzZWRMYWJlbCkge1xuICAgIHJldHVybiBhO1xuICB9XG4gIHJldHVybiBzZW12ZXJNaW4oYSwgYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIaWdoZXN0VW5yZWxlYXNlZChcbiAgYTogc3RyaW5nLFxuICBiOiBzdHJpbmcsXG4gIGVudjogVGFyZ2V0LFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGdldExvd2VzdFVucmVsZWFzZWQoYSwgYiwgZW52KSA9PT0gYSA/IGIgOiBhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG93ZXN0SW1wbGVtZW50ZWRWZXJzaW9uKFxuICBwbHVnaW46IFRhcmdldHMsXG4gIGVudmlyb25tZW50OiBUYXJnZXQsXG4pOiBzdHJpbmcge1xuICBjb25zdCByZXN1bHQgPSBwbHVnaW5bZW52aXJvbm1lbnRdO1xuICAvLyBXaGVuIEFuZHJvaWQgc3VwcG9ydCBkYXRhIGlzIGFic2VudCwgdXNlIENocm9tZSBkYXRhIGFzIGZhbGxiYWNrXG4gIGlmICghcmVzdWx0ICYmIGVudmlyb25tZW50ID09PSBcImFuZHJvaWRcIikge1xuICAgIHJldHVybiBwbHVnaW4uY2hyb21lO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJjb25zdCB7IG1pbiB9ID0gTWF0aDtcblxuLy8gYSBtaW5pbWFsIGxldmVuIGRpc3RhbmNlIGltcGxlbWVudGF0aW9uXG4vLyBiYWxhbmNlZCBtYWludGFpbmFiaWxpdHkgd2l0aCBjb2RlIHNpemVcbi8vIEl0IGlzIG5vdCBibGF6aW5nbHkgZmFzdCBidXQgc2hvdWxkIGJlIG9rYXkgZm9yIEJhYmVsIHVzZXIgY2FzZVxuLy8gd2hlcmUgaXQgd2lsbCBiZSBydW4gZm9yIGF0IG1vc3QgdGVucyBvZiB0aW1lIG9uIHN0cmluZ3Ncbi8vIHRoYXQgaGF2ZSBsZXNzIHRoYW4gMjAgQVNDSUkgY2hhcmFjdGVyc1xuXG4vLyBodHRwczovL3Jvc2V0dGFjb2RlLm9yZy93aWtpL0xldmVuc2h0ZWluX2Rpc3RhbmNlI0VTNVxuZnVuY3Rpb24gbGV2ZW5zaHRlaW4oYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICBsZXQgdCA9IFtdLFxuICAgIHU6IG51bWJlcltdID0gW10sXG4gICAgaSxcbiAgICBqO1xuICBjb25zdCBtID0gYS5sZW5ndGgsXG4gICAgbiA9IGIubGVuZ3RoO1xuICBpZiAoIW0pIHtcbiAgICByZXR1cm4gbjtcbiAgfVxuICBpZiAoIW4pIHtcbiAgICByZXR1cm4gbTtcbiAgfVxuICBmb3IgKGogPSAwOyBqIDw9IG47IGorKykge1xuICAgIHRbal0gPSBqO1xuICB9XG4gIGZvciAoaSA9IDE7IGkgPD0gbTsgaSsrKSB7XG4gICAgZm9yICh1ID0gW2ldLCBqID0gMTsgaiA8PSBuOyBqKyspIHtcbiAgICAgIHVbal0gPVxuICAgICAgICBhW2kgLSAxXSA9PT0gYltqIC0gMV0gPyB0W2ogLSAxXSA6IG1pbih0W2ogLSAxXSwgdFtqXSwgdVtqIC0gMV0pICsgMTtcbiAgICB9XG4gICAgdCA9IHU7XG4gIH1cbiAgcmV0dXJuIHVbbl07XG59XG5cbi8qKlxuICogR2l2ZW4gYSBzdHJpbmcgYHN0cmAgYW5kIGFuIGFycmF5IG9mIGNhbmRpZGF0ZXMgYGFycmAsXG4gKiByZXR1cm4gdGhlIGZpcnN0IG9mIGVsZW1lbnRzIGluIGNhbmRpZGF0ZXMgdGhhdCBoYXMgbWluaW1hbFxuICogTGV2ZW5zaHRlaW4gZGlzdGFuY2Ugd2l0aCBgc3RyYC5cbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFyclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRTdWdnZXN0aW9uKHN0cjogc3RyaW5nLCBhcnI6IHJlYWRvbmx5IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc3QgZGlzdGFuY2VzID0gYXJyLm1hcDxudW1iZXI+KGVsID0+IGxldmVuc2h0ZWluKGVsLCBzdHIpKTtcbiAgcmV0dXJuIGFycltkaXN0YW5jZXMuaW5kZXhPZihtaW4oLi4uZGlzdGFuY2VzKSldO1xufVxuIiwiaW1wb3J0IHsgZmluZFN1Z2dlc3Rpb24gfSBmcm9tIFwiLi9maW5kLXN1Z2dlc3Rpb24udHNcIjtcblxuZXhwb3J0IGNsYXNzIE9wdGlvblZhbGlkYXRvciB7XG4gIGRlY2xhcmUgZGVzY3JpcHRvcjogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihkZXNjcmlwdG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLmRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGlmIHRoZSBnaXZlbiBgb3B0aW9uc2AgZm9sbG93IHRoZSBuYW1lIG9mIGtleXMgZGVmaW5lZCBpbiB0aGUgYFRvcExldmVsT3B0aW9uU2hhcGVgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBUb3BMZXZlbE9wdGlvblNoYXBlXG4gICAqICAgQW4gb2JqZWN0IHdpdGggYWxsIHRoZSB2YWxpZCBrZXkgbmFtZXMgdGhhdCBgb3B0aW9uc2Agc2hvdWxkIGJlIGFsbG93ZWQgdG8gaGF2ZVxuICAgKiAgIFRoZSBwcm9wZXJ0eSB2YWx1ZXMgb2YgYFRvcExldmVsT3B0aW9uU2hhcGVgIGNhbiBiZSBhcmJpdHJhcnlcbiAgICogQG1lbWJlcm9mIE9wdGlvblZhbGlkYXRvclxuICAgKi9cbiAgdmFsaWRhdGVUb3BMZXZlbE9wdGlvbnMob3B0aW9uczogb2JqZWN0LCBUb3BMZXZlbE9wdGlvblNoYXBlOiBvYmplY3QpOiB2b2lkIHtcbiAgICBjb25zdCB2YWxpZE9wdGlvbk5hbWVzID0gT2JqZWN0LmtleXMoVG9wTGV2ZWxPcHRpb25TaGFwZSk7XG4gICAgZm9yIChjb25zdCBvcHRpb24gb2YgT2JqZWN0LmtleXMob3B0aW9ucykpIHtcbiAgICAgIGlmICghdmFsaWRPcHRpb25OYW1lcy5pbmNsdWRlcyhvcHRpb24pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICB0aGlzLmZvcm1hdE1lc3NhZ2UoYCcke29wdGlvbn0nIGlzIG5vdCBhIHZhbGlkIHRvcC1sZXZlbCBvcHRpb24uXG4tIERpZCB5b3UgbWVhbiAnJHtmaW5kU3VnZ2VzdGlvbihvcHRpb24sIHZhbGlkT3B0aW9uTmFtZXMpfSc/YCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gbm90ZTogd2UgZG8gbm90IGNvbnNpZGVyIHJld3JpdGUgdGhlbSB0byBoaWdoIG9yZGVyIGZ1bmN0aW9uc1xuICAvLyB1bnRpbCB3ZSBoYXZlIHRvIHN1cHBvcnQgYHZhbGlkYXRlTnVtYmVyT3B0aW9uYC5cbiAgdmFsaWRhdGVCb29sZWFuT3B0aW9uPFQgZXh0ZW5kcyBib29sZWFuPihcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdmFsdWU/OiBib29sZWFuLFxuICAgIGRlZmF1bHRWYWx1ZT86IFQsXG4gICk6IGJvb2xlYW4gfCBUIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnZhcmlhbnQoXG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIsXG4gICAgICAgIGAnJHtuYW1lfScgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLmAsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB2YWxpZGF0ZVN0cmluZ09wdGlvbjxUIGV4dGVuZHMgc3RyaW5nPihcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdmFsdWU/OiBzdHJpbmcsXG4gICAgZGVmYXVsdFZhbHVlPzogVCxcbiAgKTogc3RyaW5nIHwgVCB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW52YXJpYW50KFxuICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIsXG4gICAgICAgIGAnJHtuYW1lfScgb3B0aW9uIG11c3QgYmUgYSBzdHJpbmcuYCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICAvKipcbiAgICogQSBoZWxwZXIgaW50ZXJmYWNlIGNvcGllZCBmcm9tIHRoZSBgaW52YXJpYW50YCBucG0gcGFja2FnZS5cbiAgICogSXQgdGhyb3dzIGdpdmVuIGBtZXNzYWdlYCB3aGVuIGBjb25kaXRpb25gIGlzIG5vdCBtZXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICogQG1lbWJlcm9mIE9wdGlvblZhbGlkYXRvclxuICAgKi9cbiAgaW52YXJpYW50KGNvbmRpdGlvbjogYm9vbGVhbiwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLmZvcm1hdE1lc3NhZ2UobWVzc2FnZSkpO1xuICAgIH1cbiAgfVxuXG4gIGZvcm1hdE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5kZXNjcmlwdG9yfTogJHttZXNzYWdlfWA7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC9fdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3NcIjtcclxuXHJcbi8vIHZnc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzc1wiO1xyXG5pbXBvcnQgVkdTaWRlYmFyIGZyb20gXCIuL2FwcC9tb2R1bGVzL3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzXCI7XHJcbmltcG9ydCBWR0Ryb3Bkb3duIGZyb20gXCIuL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd25cIjtcclxuXHJcbi8vIG1vZGFsXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZnTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvbW9kYWwvanMvdmdtb2RhbFwiO1xyXG5cclxuLy8gbmF2XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzXCI7XHJcbmltcG9ydCBWR05hdiBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z25hdi9qcy92Z25hdlwiO1xyXG5cclxuLy8gZm9ybSBzZW5kZXJcclxuaW1wb3J0IFZHRm9ybVNlbmRlciBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvanMvdmdmb3Jtc2VuZGVyXCI7XHJcblxyXG5mdW5jdGlvbiBvblJlYWR5KCkge1xyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXScpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRWR0Ryb3Bkb3duLmluaXQoZWxlbWVudCwge30pXHJcblx0fSk7XHJcblxyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmctbmF2JyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFZHTmF2LmluaXQoZWxlbWVudCwge30pXHJcblx0fSk7XHJcblxyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Z2Zvcm1zZW5kZXJdJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFZHRm9ybVNlbmRlci5pbml0KGVsZW1lbnQsIHt9KVxyXG5cdH0pO1xyXG5cclxuXHRjb25zb2xlLmxvZygnYXNkc2Fkc2FkdiBzZmRzZGYgc2Rmc2ZzZGZzZGYnKVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgb25SZWFkeSk7XHJcblxyXG5leHBvcnQge1xyXG5cdFZHU2lkZWJhciwgVkdEcm9wZG93biwgVkdOYXYsIFZnTW9kYWwsIFZHRm9ybVNlbmRlclxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==