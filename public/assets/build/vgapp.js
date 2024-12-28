var vg;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/_utils/js/backdrop.js":
/*!***********************************!*\
  !*** ./app/_utils/js/backdrop.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

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
    if (_this.params.hasOwnProperty('ajax')) {
      if ('target' in _this.params.ajax && _this.params.ajax.target) {
        let $content = _utils_js_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].findOne(_this.params.ajax.target);
        if ($content) {
          if ('route' in _this.params.ajax && _this.params.ajax.route) {
            _utils_js_module_fn__WEBPACK_IMPORTED_MODULE_5__.Ajax.get(_this.params.ajax.route, {}, function (status, data) {
              setData(data);
              _utils_js_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(_this.element, _this.NAME_KEY + '.loaded');
            });
          }
        }
        const setData = data => {
          $content.innerHTML = data;
        };
      }
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");


/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.form-sender';

/**
 * Constants Classes
 */
const SELECTOR_DATA_TOGGLE = '[data-vgformsender]';

/**
 * Constants Events
 */
const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

/**
 * Default Params
 */
const PARAMS_DEFAULT = {};
class VGFormSender extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
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
  build() {}

  /**
   * Инициализация
   * @param element
   * @param params
   */
  static init(element, params = {}) {
    const instance = VGFormSender.getOrCreateInstance(element, params);
    instance.build();
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGFormSender);

/***/ }),

/***/ "./app/modules/vgnav/js/vgnav.js":
/*!***************************************!*\
  !*** ./app/modules/vgnav/js/vgnav.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./app/_utils/scss/default.scss":
/*!**************************************!*\
  !*** ./app/_utils/scss/default.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/dropdown/scss/vgdropdown.scss":
/*!***************************************************!*\
  !*** ./app/modules/dropdown/scss/vgdropdown.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/modal/scss/vgmodal.scss":
/*!*********************************************!*\
  !*** ./app/modules/modal/scss/vgmodal.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/sidebar/scss/vgsidebar.scss":
/*!*************************************************!*\
  !*** ./app/modules/sidebar/scss/vgsidebar.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/vgnav/scss/vgnav.scss":
/*!*******************************************!*\
  !*** ./app/modules/vgnav/scss/vgnav.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"]),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQWlEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6VUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDN09BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFPQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0lBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDcERBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUN0S0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7OztBQ3JmQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9iYWNrZHJvcC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZGF0YS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZXZlbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2Z1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL21vZHVsZS1mbi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvb3ZlcmZsb3cuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3BhcmFtcy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvcGxhY2VtZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9yZXNwb25zaXZlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9iYXNlLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd24uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9tb2RhbC9qcy92Z21vZGFsLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvanMvdmdmb3Jtc2VuZGVyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmduYXYvanMvdmduYXYuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3MiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9tb2RhbC9zY3NzL3ZnbW9kYWwuc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L3Njc3MvdmduYXYuc2NzcyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZnLy4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleGVjdXRlfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4vb3ZlcmZsb3dcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSAnYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUUgPSAndmctYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xyXG5jb25zdCBFVkVOVF9NT1VTRURPV04gPSBgbW91c2Vkb3duLnZnLiR7TkFNRX1gXHJcblxyXG5jbGFzcyBCYWNrZHJvcCB7XHJcblx0c3RhdGljIHNob3coY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9hcHBlbmQoKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZShjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2Rlc3Ryb3koKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9hcHBlbmQoKSB7XHJcblx0XHRpZiAoU2VsZWN0b3JzLmZpbmRPbmUoJy4nICsgQ0xBU1NfTkFNRSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChiYWNrZHJvcCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdFx0fSwgNTApO1xyXG5cclxuXHRcdEV2ZW50SGFuZGxlci5vbihiYWNrZHJvcCwgRVZFTlRfTU9VU0VET1dOLCAoKSA9PiB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoKVxyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfZGVzdHJveSgpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmRPbmUoJy4nICsgQ0xBU1NfTkFNRSk7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdH0sIDUwMCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWNrZHJvcDsiLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGRhdGEuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDRgNCw0LHQvtGC0LDQtdGCINGBINC60L7Qu9C70LXQutGG0LjQtdC5INC80L7QtNGD0LvQtdC5LiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9tYXAtc2V0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IGVsZW1lbnRNYXAgPSBuZXcgTWFwKClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRzZXQoZWxlbWVudCwga2V5LCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRlbGVtZW50TWFwLnNldChlbGVtZW50LCBuZXcgTWFwKCkpXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cdFx0aWYgKCFpbnN0YW5jZU1hcC5oYXMoa2V5KSAmJiBpbnN0YW5jZU1hcC5zaXplICE9PSAwKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFZHQXBwINC90LUg0LTQvtC/0YPRgdC60LDQtdGCINCx0L7Qu9C10LUg0L7QtNC90L7Qs9C+INGN0LrQt9C10LzQv9C70Y/RgNCwINC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwLiDQodCy0Y/Qt9Cw0L3QvdGL0Lkg0Y3QutC30LXQvNC/0LvRj9GAOiAke0FycmF5LmZyb20oaW5zdGFuY2VNYXAua2V5cygpKVswXX0uYClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuc2V0KGtleSwgaW5zdGFuY2UpXHJcblx0fSxcclxuXHJcblx0Z2V0KGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKGVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50TWFwLmdldChlbGVtZW50KS5nZXQoa2V5KSB8fCBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHJcblx0XHRpbnN0YW5jZU1hcC5kZWxldGUoa2V5KTtcclxuXHJcblx0XHRpZiAoaW5zdGFuY2VNYXAuc2l6ZSA9PT0gMCkge1xyXG5cdFx0XHRlbGVtZW50TWFwLmRlbGV0ZShlbGVtZW50KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGV2ZW50LmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiDQodC60YDQuNC/0YIg0LTQu9GPINC/0YDQvtGB0LvRg9GI0LjQstCw0L3QuNGPINGB0L7QsdGL0YLQuNGPXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IG5hbWVzcGFjZVJlZ2V4ID0gL1teLl0qKD89XFwuLiopXFwufC4qL1xyXG5jb25zdCBzdHJpcE5hbWVSZWdleCA9IC9cXC4uKi9cclxuY29uc3Qgc3RyaXBVaWRSZWdleCA9IC86OlxcZCskL1xyXG5jb25zdCBldmVudFJlZ2lzdHJ5ID0ge30gLy8gRXZlbnRzIHN0b3JhZ2VcclxubGV0IHVpZEV2ZW50ID0gMVxyXG5jb25zdCBjdXN0b21FdmVudHMgPSB7XHJcblx0bW91c2VlbnRlcjogJ21vdXNlb3ZlcicsXHJcblx0bW91c2VsZWF2ZTogJ21vdXNlb3V0J1xyXG59XHJcblxyXG5jb25zdCBuYXRpdmVFdmVudHMgPSBuZXcgU2V0KFtcclxuXHQnY2xpY2snLFxyXG5cdCdkYmxjbGljaycsXHJcblx0J21vdXNldXAnLFxyXG5cdCdtb3VzZWRvd24nLFxyXG5cdCdjb250ZXh0bWVudScsXHJcblx0J21vdXNld2hlZWwnLFxyXG5cdCdET01Nb3VzZVNjcm9sbCcsXHJcblx0J21vdXNlb3ZlcicsXHJcblx0J21vdXNlb3V0JyxcclxuXHQnbW91c2Vtb3ZlJyxcclxuXHQnc2VsZWN0c3RhcnQnLFxyXG5cdCdzZWxlY3RlbmQnLFxyXG5cdCdrZXlkb3duJyxcclxuXHQna2V5cHJlc3MnLFxyXG5cdCdrZXl1cCcsXHJcblx0J29yaWVudGF0aW9uY2hhbmdlJyxcclxuXHQndG91Y2hzdGFydCcsXHJcblx0J3RvdWNobW92ZScsXHJcblx0J3RvdWNoZW5kJyxcclxuXHQndG91Y2hjYW5jZWwnLFxyXG5cdCdwb2ludGVyZG93bicsXHJcblx0J3BvaW50ZXJtb3ZlJyxcclxuXHQncG9pbnRlcnVwJyxcclxuXHQncG9pbnRlcmxlYXZlJyxcclxuXHQncG9pbnRlcmNhbmNlbCcsXHJcblx0J2dlc3R1cmVzdGFydCcsXHJcblx0J2dlc3R1cmVjaGFuZ2UnLFxyXG5cdCdnZXN0dXJlZW5kJyxcclxuXHQnZm9jdXMnLFxyXG5cdCdibHVyJyxcclxuXHQnY2hhbmdlJyxcclxuXHQncmVzZXQnLFxyXG5cdCdzZWxlY3QnLFxyXG5cdCdzdWJtaXQnLFxyXG5cdCdmb2N1c2luJyxcclxuXHQnZm9jdXNvdXQnLFxyXG5cdCdsb2FkJyxcclxuXHQndW5sb2FkJyxcclxuXHQnYmVmb3JldW5sb2FkJyxcclxuXHQncmVzaXplJyxcclxuXHQnbW92ZScsXHJcblx0J0RPTUNvbnRlbnRMb2FkZWQnLFxyXG5cdCdyZWFkeXN0YXRlY2hhbmdlJyxcclxuXHQnZXJyb3InLFxyXG5cdCdhYm9ydCcsXHJcblx0J3Njcm9sbCdcclxuXSlcclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstCw0YLQvdGL0LUg0LzQtdGC0L7QtNGLXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xyXG5cdHJldHVybiAodWlkICYmIGAke3VpZH06OiR7dWlkRXZlbnQrK31gKSB8fCBlbGVtZW50LnVpZEV2ZW50IHx8IHVpZEV2ZW50KytcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KSB7XHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGVsZW1lbnQpXHJcblxyXG5cdGVsZW1lbnQudWlkRXZlbnQgPSB1aWRcclxuXHRldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cclxuXHJcblx0cmV0dXJuIGV2ZW50UmVnaXN0cnlbdWlkXVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcclxuXHJcblx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIHNlbGVjdG9yLCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcclxuXHJcblx0XHRmb3IgKGxldCB7IHRhcmdldCB9ID0gZXZlbnQ7IHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xyXG5cdFx0XHRcdGlmIChkb21FbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiB0YXJnZXQgfSlcclxuXHJcblx0XHRcdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0YXJnZXQsIFtldmVudF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRIYW5kbGVyKGV2ZW50cywgY2FsbGFibGUsIGRlbGVnYXRpb25TZWxlY3RvciA9IG51bGwpIHtcclxuXHRyZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXHJcblx0XHQuZmluZChldmVudCA9PiBldmVudC5jYWxsYWJsZSA9PT0gY2FsbGFibGUgJiYgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yID09PSBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdGNvbnN0IGlzRGVsZWdhdGVkID0gdHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnXHJcblx0Ly8gVE9ETzog0LLRi9C00LDQtdGCIFwiZmFsc2VcIiDQstC80LXRgdGC0L4g0YHQtdC70LXQutGC0L7RgNCwLCDQv9C+0Y3RgtC+0LzRgyDQvdGD0LbQvdC+INC/0YDQvtCy0LXRgNC40YLRjC4gYm9vdFxyXG5cdGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0bGV0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChvcmlnaW5hbFR5cGVFdmVudClcclxuXHJcblx0aWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcclxuXHRcdHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIG9uZU9mZikge1xyXG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cclxuXHQvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXHJcblx0Ly8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXHJcblx0aWYgKG9yaWdpbmFsVHlwZUV2ZW50IGluIGN1c3RvbUV2ZW50cykge1xyXG5cdFx0Y29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYWJsZSA9IHdyYXBGdW5jdGlvbihjYWxsYWJsZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxyXG5cdGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblxyXG5cdGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XHJcblx0XHRwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxyXG5cclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXHJcblx0Y29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XHJcblx0XHRib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjYWxsYWJsZSkgOlxyXG5cdFx0Ym9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcclxuXHJcblx0Zm4uZGVsZWdhdGlvblNlbGVjdG9yID0gaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbFxyXG5cdGZuLmNhbGxhYmxlID0gY2FsbGFibGVcclxuXHRmbi5vbmVPZmYgPSBvbmVPZmZcclxuXHRmbi51aWRFdmVudCA9IHVpZFxyXG5cdGhhbmRsZXJzW3VpZF0gPSBmblxyXG5cclxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgaXNEZWxlZ2F0ZWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3Rvcikge1xyXG5cdGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcclxuXHJcblx0aWYgKCFmbikge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxyXG5cdGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcclxuXHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblxyXG5cdGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR5cGVFdmVudChldmVudCkge1xyXG5cdC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcclxuXHRldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxyXG5cdHJldHVybiBjdXN0b21FdmVudHNbZXZlbnRdIHx8IGV2ZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcclxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhtZXRhKSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0b2JqW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb2JqXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjRj1xyXG4gKiBAdHlwZSB7e29uZSgqLCAqLCAqLCAqKTogdm9pZCwgdHJpZ2dlcigqLCAqLCAqKTogKG51bGx8KiksIG9mZigqLCAqLCAqLCAqKTogdm9pZCwgb24oKiwgKiwgKiwgKik6IHZvaWR9fVxyXG4gKi9cclxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtGB0LvRg9GI0LjQstCw0YLQtdC70Ywg0YHQvtCx0YvRgtC40LkgKNGN0LvQtdC80LXQvdGCLCDRgdC+0LHRi9GC0LjQtSAo0L/QvtC70L3Ri9C5INGB0L/QuNGB0L7QuiDRgdC80L7RgtGA0Lgg0LIg0LrQvtC90YHRgtCw0L3RgtC1IG5hdGl2ZUV2ZW50cywg0LjRgdGC0L7Rh9C90LjQuiDRgdC+0LHRi9GC0LjRjyDQuNC70Lgg0YXQtdC90LTQu9C10YAsINGE0YPQvdC60YbQuNGPINC+0LHRgNCw0YLQvdC+0LPQviDQstGL0LfQvtCy0LApKVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b24oZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBmYWxzZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5LCDQvdC+INC30LDQvNGL0LrQsNC10YLRgdGPINC4INCx0L7Qu9GM0YjQtSDQvdC1INC/0L7QstGC0L7RgNGP0LXRgtGB0Y8g0L3QsCDRjdC70LXQvNC10L3RgtC1XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvbmUoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCB0cnVlKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCj0LTQsNC70LXQvdC40LUg0L7QsdGA0LDQsdC+0YLRh9C40LrQsFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b2ZmKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0XHRjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHRcdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRcdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHRcdGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly8gU2ltcGxlc3QgY2FzZTogaGFuZGxlciBpcyBwYXNzZWQsIHJlbW92ZSB0aGF0IGxpc3RlbmVyIE9OTFkuXHJcblx0XHRcdGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFtZXNwYWNlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcclxuXHRcdFx0XHRyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBba2V5SGFuZGxlcnMsIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdFx0Y29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXHJcblxyXG5cdFx0XHRpZiAoIWluTmFtZXNwYWNlIHx8IG9yaWdpbmFsVHlwZUV2ZW50LmluY2x1ZGVzKGhhbmRsZXJLZXkpKSB7XHJcblx0XHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGB0L7QsdGL0YLQuNGPLiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9kaXNwYXRjaC1ldmVudHNcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBhcmdzXHJcblx0ICogQHJldHVybnMgeyp8bnVsbH1cclxuXHQgKi9cclxuXHR0cmlnZ2VyKGVsZW1lbnQsIGV2ZW50LCBhcmdzKSB7XHJcblx0XHRpZiAodHlwZW9mIGV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBidWJibGVzID0gdHJ1ZTtcclxuXHRcdGxldCBuYXRpdmVEaXNwYXRjaCA9IHRydWU7XHJcblx0XHRsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0IGV2dCA9IGh5ZHJhdGVPYmoobmV3IEV2ZW50KGV2ZW50LCB7IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUgfSksIGFyZ3MpXHJcblxyXG5cdFx0aWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmF0aXZlRGlzcGF0Y2gpIHtcclxuXHRcdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZXZ0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXJcclxuIiwiLyoqXHJcbiAqINCd0LDQsdC+0YAg0YHQutGA0LjQv9GC0L7QsiDQtNC70Y8g0YjQuNGA0L7QutC+0LPQviDQv9GA0LjQvNC10L3QtdC90LjRj1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQldGB0LvQuCDRh9GC0L4t0L3QuNCx0YPQtNGMINCyINC+0LHRitC10LrRgtC1XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xyXG5cdGZvciAobGV0IHByb3AgaW4gb2JqKSB7XHJcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRWxlbWVudFxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gb2JqZWN0ID0+IHtcclxuXHRpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHR5cGVvZiBvYmplY3Qubm9kZVR5cGUgIT09ICd1bmRlZmluZWQnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0Rpc2FibGVkXHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmRpc2FibGVkXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09ICdmYWxzZSdcclxufVxyXG5cclxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtZW50KSB7XHJcblx0aWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRjb25zdCBlbGVtZW50SXNWaXNpYmxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xyXG5cdGNvbnN0IGNsb3NlZERldGFpbHMgPSBlbGVtZW50LmNsb3Nlc3QoJ2RldGFpbHM6bm90KFtvcGVuXSknKVxyXG5cclxuXHRpZiAoIWNsb3NlZERldGFpbHMpIHtcclxuXHRcdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcblx0fVxyXG5cclxuXHRpZiAoY2xvc2VkRGV0YWlscyAhPT0gZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXHJcblx0XHRpZiAoc3VtbWFyeSAmJiBzdW1tYXJ5LnBhcmVudE5vZGUgIT09IGNsb3NlZERldGFpbHMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN1bW1hcnkgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG59XHJcblxyXG4vKipcclxuICogaXNPYmplY3RcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG5cdHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0L7QtNC40Lwg0LIg0L/QvtGA0Y/QtNC+0Log0YLQuNC/0Ysg0LTQsNC90L3Ri9GFXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkgIHtcclxuXHRpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xyXG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdH0gY2F0Y2gge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YLRiyDRgSDQvNCw0YHRgdC40LLQsFxyXG4gKiBAcGFyYW0gYXJyXHJcbiAqIEBwYXJhbSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudEFycmF5KGFyciwgZWwpIHtcclxuXHRyZXR1cm4gYXJyLmZpbHRlcigoaXRlbSkgPT4gIWVsLmluY2x1ZGVzKGl0ZW0pKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCT0LvRg9Cx0L7QutC+0LUg0L7QsdGK0LXQtNC40L3QtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyXHJcbiAqIEBwYXJhbSBvYmplY3RzXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VEZWVwT2JqZWN0KC4uLm9iamVjdHMpIHtcclxuXHRjb25zdCBpc09iamVjdCA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcblxyXG5cdHJldHVybiBvYmplY3RzLnJlZHVjZSgocHJldiwgb2JqKSA9PiB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0Y29uc3QgcFZhbCA9IHByZXZba2V5XTtcclxuXHRcdFx0Y29uc3Qgb1ZhbCA9IG9ialtrZXldO1xyXG5cclxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocFZhbCkgJiYgQXJyYXkuaXNBcnJheShvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IHBWYWwuY29uY2F0KC4uLm9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGlzT2JqZWN0KHBWYWwpICYmIGlzT2JqZWN0KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gbWVyZ2VEZWVwT2JqZWN0KHBWYWwsIG9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG9WYWw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwcmV2O1xyXG5cdH0sIHt9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrXHJcbiAqIEBwYXJhbSBwb3NzaWJsZUNhbGxiYWNrXHJcbiAqIEBwYXJhbSBhcmdzXHJcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWVcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBleGVjdXRlKHBvc3NpYmxlQ2FsbGJhY2ssIGFyZ3MgPSBbXSwgZGVmYXVsdFZhbHVlID0gcG9zc2libGVDYWxsYmFjaykge1xyXG5cdHJldHVybiB0eXBlb2YgcG9zc2libGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IHBvc3NpYmxlQ2FsbGJhY2soLi4uYXJncykgOiBkZWZhdWx0VmFsdWVcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zaXRpb25cclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uRWxlbWVudFxyXG4gKiBAcGFyYW0gd2FpdEZvclRyYW5zaXRpb25cclxuICovXHJcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnO1xyXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDA7XHJcblxyXG5mdW5jdGlvbiBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uIChjYWxsYmFjaywgdHJhbnNpdGlvbkVsZW1lbnQsIHdhaXRGb3JUcmFuc2l0aW9uID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0aWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxyXG5cdGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSB0aW1lT3V0TXMgPyB0aW1lT3V0TXMgOiBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmc7XHJcblxyXG5cdGxldCBjYWxsZWQgPSBmYWxzZVxyXG5cclxuXHRjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcclxuXHRcdGlmICh0YXJnZXQgIT09IHRyYW5zaXRpb25FbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxlZCA9IHRydWVcclxuXHRcdHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdH1cclxuXHJcblx0dHJhbnNpdGlvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdGlmICghY2FsbGVkKSB7XHJcblx0XHRcdHRyaWdnZXJUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25FbGVtZW50KVxyXG5cdFx0fVxyXG5cdH0sIGVtdWxhdGVkRHVyYXRpb24pXHJcbn1cclxuXHJcbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcclxuXHRsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXHJcblxyXG5cdC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcclxuXHRpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcclxuXHR0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxyXG5cdHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXHJcblxyXG5cdHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcclxufVxyXG5cclxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcclxuXHRlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbmV4cG9ydCB7aXNFbGVtZW50LCBpc1Zpc2libGUsIGlzRGlzYWJsZWQsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YSwgZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgbm9vcH0iLCJpbXBvcnQge2lzRWxlbWVudCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDQsNGC0YDQuNCx0YPRgtCw0LzQuCDRgyDRjdC70LXQvNC10L3RgtCwOlxyXG4gKiBnZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINGE0LvQsNCzIC0g0LLRi9GA0LXQt9Cw0YLRjCBkYXRhLSkgLSDQvNC10YLQvtC0INCy0YvQsdC40YDQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQsNGC0YDQuNCx0YPRgtCwINC/0L4g0LXQs9C+INC40LzQtdC90LgsINC10YHQu9C4INCyINC/0L7Qu9C1INC40LzQtdC90Lgg0L/QtdGA0LXQtNCw0YLRjCAnZGF0YScgLT4g0LHRg9C00YPRgiDQstGL0LHRgNCw0L3RiyDRgtC+0LvRjNC60L4g0LTQsNGC0LAg0LDRgtGA0LjQsdGD0YLRiywg0LXRgdC70LggJ2FsbCcgLT4g0LzQtdGC0L7QtCDQstC10YDQvdC10YIg0LfQvdCw0YfQtdC90LjQtSDQstGB0LXRhSDQsNGC0YDQuNCx0YPRgtC+0LJcclxuICogaGFzICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPKSAtINC10YHRgtGMINC70Lgg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKiBzZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINC30L3QsNGH0LXQvdC40LUpIC0g0YPRgdGC0LDQvdC+0LLQutCwINGDINGN0LvQtdC80LXQvdGC0LAg0LDRgtGA0LjQsdGD0YLQsCDQuNC70Lgg0LXQs9C+INC40LfQvNC10L3QtdC90LjQtVxyXG4gKiByZW1vdmUgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0YPQtNCw0LvRj9C10YIg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0KGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUgPSAnZGF0YScsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdkYXRhJykge1xyXG5cdFx0XHRsZXQgZWxtQmFzZSA9IFsnZGF0YS12Zy10b2dnbGUnLCAnZGF0YS12Zy10YXJnZXQnLCAnZGF0YS12Zy1kaXNtaXNzJ10sXHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IHt9O1xyXG5cclxuXHRcdFx0bGV0IGFyciA9IFtdLmZpbHRlci5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24gKGF0KSB7XHJcblx0XHRcdFx0cmV0dXJuIC9eZGF0YS0vLnRlc3QoYXQubmFtZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdFx0bGV0IG5hbWUgPSB2Lm5hbWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpc1JlbW92ZURhdGFOYW1lKSBuYW1lID0gbmFtZS5zbGljZSg1KTtcclxuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1tuYW1lXSA9IG5vcm1hbGl6ZURhdGEodi52YWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZU5hbWVzKCkucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gey4uLmFjYywgW25hbWVdOiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKX07XHJcblx0XHRcdH0sIHt9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRoYXMoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdH0sXHJcblxyXG5cdHNldChlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lICYmIHZhbHVlKSB7XHJcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5pcHVsYXRvcn1cclxuIiwiaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIGlzRW1wdHlPYmosIGlzT2JqZWN0fSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQotGD0YIg0YHQvtCx0YDQsNC90Ysg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LrRgNC40L/RgtGLINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LlcclxuICovXHJcblxyXG4vKipcclxuICog0J3QsNCx0L7RgCBzdmcg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEByZXR1cm5zIHsqfHt9fVxyXG4gKi9cclxuY29uc3QgZ2V0U1ZHID0gKG5hbWUpID0+IHtcclxuXHRjb25zdCBzdmcgPSAge1xyXG5cdFx0ZXJyb3I6ICcnLFxyXG5cdFx0c3VjY2VzczogJycsXHJcblx0XHRkb3RzOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGNsYXNzPVwiYmkgYmktdGhyZWUtZG90cy12ZXJ0aWNhbFwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj48cGF0aCBkPVwiTTkuNSAxM2ExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHptMC01YTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6XCIvPjwvc3ZnPicsXHJcblx0XHRjcm9zczogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCAyMjQuNTEyIDIyNC41MTJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxnPjxwb2x5Z29uIHBvaW50cz1cIjIyNC41MDcsNi45OTcgMjE3LjUyMSwwIDExMi4yNTYsMTA1LjI1OCA2Ljk5OCwwIDAuMDA1LDYuOTk3IDEwNS4yNjMsMTEyLjI1NCAwLjAwNSwyMTcuNTEyIDYuOTk4LDIyNC41MTIgMTEyLjI1NiwxMTkuMjQgMjE3LjUyMSwyMjQuNTEyIDIyNC41MDcsMjE3LjUxMiAxMTkuMjQ5LDExMi4yNTQgXCIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4nXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHN2Z1tuYW1lXSA/PyB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LXRiNCw0LXQvCDRgdC+0LHRi9GC0LjQtSBcItCX0LDQutGA0YvRgtGMXCIg0L3QsCDQstGB0LUg0LzQvtC00LDQu9C60LgsINGB0LDQudC00LHQsNGA0Ysg0Lgg0YIu0L8uXHJcbiAqIEBwYXJhbSBtb2R1bGVcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKi9cclxuY29uc3QgZGlzbWlzc1RyaWdnZXIgPSAobW9kdWxlLCBtZXRob2QgPSAnaGlkZScpID0+IHtcclxuXHRjb25zdCBjbGlja0V2ZW50ID0gYGNsaWNrLmRpc21pc3MuJHttb2R1bGUuRVZFTlRfS0VZfWBcclxuXHRjb25zdCBuYW1lID0gbW9kdWxlLk5BTUU7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgY2xpY2tFdmVudCwgYFtkYXRhLXZnLWRpc21pc3M9XCIke25hbWV9XCJdYCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHRoaXMpIHx8IHRoaXMuY2xvc2VzdChgLnZnLSR7bmFtZX1gKVxyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBtb2R1bGUuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblxyXG5cdFx0aW5zdGFuY2VbbWV0aG9kXSgpXHJcblx0fSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEFKQVggUkVRVUVTVFxyXG4gKiBAdHlwZSB7e3Bvc3Q6IGFqYXgucG9zdCwgZ2V0OiBhamF4LmdldCwgeDogKChmdW5jdGlvbigpOiAoWE1MSHR0cFJlcXVlc3QpKXwqKSwgc2VuZDogYWpheC5zZW5kfX1cclxuICovXHJcbmNvbnN0IEFqYXggPSB7XHJcblx0LyoqXHJcblx0ICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiBodHRwINC30LDQv9GA0L7RgdGLXHJcblx0ICogQHJldHVybnMge1hNTEh0dHBSZXF1ZXN0fCp9XHJcblx0ICovXHJcblx0eCgpIHtcclxuXHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdmVyc2lvbnMgPSBbXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNi4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNS4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNC4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuMy4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuMi4wXCIsXHJcblx0XHRcdFwiTWljcm9zb2Z0LlhtbEh0dHBcIlxyXG5cdFx0XSwgeGhyO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCh2ZXJzaW9uc1tpXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHhocjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQntGC0L/RgNCw0LLQu9GP0LXRgiDQt9Cw0L/RgNC+0YHRiyDQuCDQv9GA0LjQvdC40LzQsNC10YIg0L7RgtCy0LXRglxyXG5cdCAqIEBwYXJhbSB1cmxcclxuXHQgKiBAcGFyYW0gbWV0aG9kXHJcblx0ICogQHBhcmFtIGRhdGFcclxuXHQgKiBAcGFyYW0gY2FsbGJhY2tcclxuXHQgKiBAcGFyYW0gYXN5bmNcclxuXHQgKi9cclxuXHRzZW5kKHVybCwgbWV0aG9kLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGlmIChhc3luYyA9PT0gdW5kZWZpbmVkKSBhc3luYyA9IHRydWU7XHJcblxyXG5cdFx0bGV0IHggPSBBamF4LngoKTtcclxuXHRcdHgub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG5cdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHguc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjYXNlIDIwMDpcclxuXHRcdFx0XHRcdFx0ZXhlY3V0ZShjYWxsYmFjaywgWydzdWNjZXNzJywgeC5yZXNwb25zZVRleHRdKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRleGVjdXRlKGNhbGxiYWNrLCBbJ2Vycm9yJywgeC5zdGF0dXNUZXh0XSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0eC5zZW5kKGRhdGEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCe0YLQv9GA0LDQstC70Y/QtdGCINC4INC/0YDQuNC90LjQvNCw0LXRgiBHRVQg0LfQsNC/0YDQvtGB0YtcclxuXHQgKiBAcGFyYW0gdXJsXHJcblx0ICogQHBhcmFtIGRhdGFcclxuXHQgKiBAcGFyYW0gY2FsbGJhY2tcclxuXHQgKiBAcGFyYW0gYXN5bmNcclxuXHQgKi9cclxuXHRnZXQodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSAmJiAhaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRBamF4LnNlbmQodXJsICsgKHF1ZXJ5Lmxlbmd0aCA/ICc/JyArIHF1ZXJ5LmpvaW4oJyYnKSA6ICcnKSwgJ0dFVCcsIG51bGwsIGNhbGxiYWNrLCBhc3luYylcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQntGC0L/RgNCw0LLQu9GP0LXRgiDQuCDQv9GA0LjQvdC40LzQsNC10YIgUE9TVCDQt9Cw0L/RgNC+0YHRi1xyXG5cdCAqIEBwYXJhbSB1cmxcclxuXHQgKiBAcGFyYW0gZGF0YVxyXG5cdCAqIEBwYXJhbSBjYWxsYmFja1xyXG5cdCAqIEBwYXJhbSBhc3luY1xyXG5cdCAqL1xyXG5cdHBvc3QodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdEFqYXguc2VuZCh1cmwsIGNhbGxiYWNrLCAnUE9TVCcsIGRhdGEsIGFzeW5jKVxyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCB7XHJcblx0ZGlzbWlzc1RyaWdnZXIsIEFqYXgsIGdldFNWR1xyXG59IiwiaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIE92ZXJmbG93XHJcbiAqINCX0LDQv9GA0LXRidCw0LXRgiDRgdC60YDQvtC70LvQuNC90LMg0Lgg0YPQsdC40YDQsNC10YIg0LXQs9C+LCDQutC+0LzQv9C10L3RgdC40YDRg9GPINC+0YLRgdGC0YPQv9C+0LxcclxuICovXHJcblxyXG5jbGFzcyBPdmVyZmxvdyB7XHJcblx0c3RhdGljIGFwcGVuZCgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcblx0XHRsZXQgc3R5bGVzID0gTWFuaXB1bGF0b3IuZ2V0KGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdFx0aWYgKCFzdHlsZXMpIE1hbmlwdWxhdG9yLnJlbW92ZShkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJmbG93OyIsImltcG9ydCB7aXNFbGVtZW50LCBpc0VtcHR5T2JqLCBpc09iamVjdCwgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIFBhcmFtcywg0YHQvtCx0LjRgNCw0LXRgiDQstGB0LUgXCLQv9Cw0YDQsNC80LXRgtGA0YtcIiDQtNC70Y8g0YDQsNCx0L7RgtGLINC80L7QtNGD0LvQtdC5LCDRj9Cy0LvRj9GP0YHRjCDQtNC70Y8g0L3QuNGFINC+0YLQv9GA0LDQstC90L7QuSDRgtC+0YfQutC+0LlcclxuICovXHJcblxyXG5jbGFzcyBQYXJhbXMge1xyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiB7fVxyXG5cdH1cclxuXHJcblx0X2dldFBhcmFtcyhwYXJhbXMsIGVsZW1lbnQpIHtcclxuXHRcdHBhcmFtcyA9IHRoaXMuX21lcmdlUGFyYW1zT2JqKHBhcmFtcywgZWxlbWVudClcclxuXHRcdHBhcmFtcyA9IHRoaXMuX3BhcmFtc0FmdGVyTWVyZ2UocGFyYW1zKVxyXG5cdFx0cmV0dXJuIHBhcmFtc1xyXG5cdH1cclxuXHJcblx0X3BhcmFtc0FmdGVyTWVyZ2UocGFyYW1zKSB7XHJcblx0XHRsZXQgcERlZmF1bHQgPSB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHQsXHJcblx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QocERlZmF1bHQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGlzT2JqZWN0KG1QYXJhbXMpICYmICFpc0VtcHR5T2JqKG1QYXJhbXMpKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZGF0dW0gaW4gbVBhcmFtcykge1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IG5vcm1hbGl6ZURhdGEobVBhcmFtc1tkYXR1bV0pO1xyXG5cclxuXHRcdFx0XHRpZiAoZGF0dW0gIT09ICdwYXJhbXMnKSB7XHJcblx0XHRcdFx0XHRpZiAoIShkYXR1bSBpbiBwRGVmYXVsdCkpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHAgPSBkYXR1bS5zcGxpdCgnLScpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBEZWZhdWx0W3BbMF1dICYmIHBbMV0gaW4gcERlZmF1bHRbcFswXV0pIHtcclxuXHRcdFx0XHRcdFx0XHRwRGVmYXVsdFtwWzBdXVtwWzFdXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRkZWxldGUgbVBhcmFtc1tkYXR1bV07XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRtUGFyYW1zW2RhdHVtXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KG1QYXJhbXMsIHZhbHVlKVxyXG5cdFx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNbZGF0dW1dO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBtUGFyYW1zO1xyXG5cdH1cclxuXHJcblx0X21lcmdlUGFyYW1zT2JqKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIGlzRWxlbWVudChlbGVtZW50KSA/IG1lcmdlRGVlcE9iamVjdChNYW5pcHVsYXRvci5nZXQoZWxlbWVudCksIHBhcmFtcykgOiB7fVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBQYXJhbXM7XHJcbiIsImltcG9ydCB7bWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIFBsYWNlbWVudCwg0L7Qv9GA0LXQtNC10LvRj9C10YIg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LzQtdGB0YLQvtC/0L7Qu9C+0LbQtdC90LjQtSDRjdC70LXQvNC10L3RgtCwINC90LAg0YHRgtGA0LDQvdC40YbQtS5cclxuICogVE9ETyDQutC70LDRgdGBINC90LUg0LTQvtC/0LjRgdCw0L1cclxuICovXHJcblxyXG5jbGFzcyBQbGFjZW1lbnQge1xyXG5cdGNvbnN0cnVjdG9yKGFyZyA9IHt9KSB7XHJcblx0XHR0aGlzLnBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGVsZW1lbnQ6IG51bGwsXHJcblx0XHRcdGRyb3A6IG51bGxcclxuXHRcdH0sIGFyZyk7XHJcblx0fVxyXG5cclxuXHRfZ2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Y29uc3QgX3BhcmVudCA9IChzZWxmKSA9PiB7XHJcblx0XHRcdGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudE5vZGUsXHJcblx0XHRcdFx0b3ZlcmZsb3cgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCkub3ZlcmZsb3c7XHJcblxyXG5cdFx0XHRpZiAocGFyZW50LnRhZ05hbWUgIT09ICdCT0RZJykge1xyXG5cdFx0XHRcdGlmIChvdmVyZmxvdyA9PT0gJ3Zpc2libGUnKSB7XHJcblx0XHRcdFx0XHRfcGFyZW50KHBhcmVudClcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXNGaXhlZCA9IGZhbHNlLCB0b3AsIGxlZnQsXHJcblx0XHRcdGJvdW5kcyA9IF90aGlzLnBhcmFtcy5kcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRwYXJlbnQgPSBfdGhpcy5wYXJhbXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRpZiAoX3BhcmVudChfdGhpcy5wYXJhbXMuZWxlbWVudCkpIHtcclxuXHRcdFx0aXNGaXhlZCA9IHRydWU7XHJcblx0XHRcdHRvcCA9IGJvdW5kcy50b3A7XHJcblx0XHRcdGxlZnQgPSBib3VuZHMubGVmdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKF90aGlzLnBhcmFtcy5kcm9wKTtcclxuXHRcdFx0dG9wID0gbm9ybWFsaXplRGF0YShzdHlsZXMudG9wLnNsaWNlKDAsIC0yKSk7XHJcblx0XHRcdGxlZnQgPSBub3JtYWxpemVEYXRhKHN0eWxlcy5sZWZ0LnNsaWNlKDAsIC0yKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKChib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCkgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHRsZWZ0ID0gcGFyZW50LndpZHRoIC0gYm91bmRzLndpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlzRml4ZWQ6IGlzRml4ZWQsXHJcblx0XHRcdHRvcDogdG9wLFxyXG5cdFx0XHRsZWZ0OiBsZWZ0XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGFjZW1lbnQ7IiwiLyoqXHJcbiAqINCa0LvQsNGB0YEgUmVzcG9uc2l2ZSwg0YDQsNCx0L7RgtCw0LXRgiDQv9C+INGC0LDQutC40Lwg0LbQtSDQvNC10LTQuNCwINGC0L7Rh9C60LDQvCwg0YfRgtC+INC4IGJvb3RzdHJhcFxyXG4gKiDQuCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC5cclxuICovXHJcblxyXG5jbGFzcyBSZXNwb25zaXZlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYnJlYWtwb2ludHMgPSB7XHJcblx0XHRcdHhzOiAwLFxyXG5cdFx0XHRzbTogNTc2LFxyXG5cdFx0XHRtZDogNzY4LFxyXG5cdFx0XHRsZzogOTkyLFxyXG5cdFx0XHR4bDogMTIwMCxcclxuXHRcdFx0eHhsOiAxNDAwLFxyXG5cdFx0XHR4eHhsOiAxNjAwLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCV0YHQu9C4INC90LDRiNCwINGI0LjRgNC40L3QsCDRjdC60YDQsNC90LAg0YHQvtCy0L/QsNC00LDQtdGCINGBINC00LjQsNC/0LDQt9C+0L3QvtC8INC60L7RgtC+0YDRi9C5INGD0LrQsNC30LDQvSDQsiDQvNC+0LTRg9C70LUg0LLRi9C00LDQtdC8IHRydWUsINC40L3QsNGH0LUgZmFsc2VcclxuXHQgKiBAcGFyYW0gbW9kdWxlXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrKG1vZHVsZSkge1xyXG5cdFx0bGV0IGluc3RhbmNlID0gbmV3IHRoaXMgO1xyXG5cdFx0cmV0dXJuIGluc3RhbmNlLmRlZmluZShtb2R1bGUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0LLQtdGA0Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLiBUT0RPINC90LUg0YHQvtCy0YHQtdC8INC/0YDQsNCy0LjQu9GM0L3Qviwg0L3QsNC00L4g0YHQtNC10LvQsNGC0Ywg0L/Qvi3QtNGA0YPQs9C+0LzRg1xyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVja01vYmlsZU9yVGFibGV0KCkge1xyXG5cdFx0bGV0IGNoZWNrID0gZmFsc2U7XHJcblx0XHQoZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWlub3xhbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zbGljZSgwLDQpKSl7XHJcblx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmEpO1xyXG5cclxuXHRcdHJldHVybiBjaGVjaztcclxuXHR9XHJcblxyXG5cdGRlZmluZShtb2R1bGUpIHtcclxuXHRcdGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG5cdFx0XHRyZXNwb25zaXZlX3NpemUgPSB0aGlzLl9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpLFxyXG5cdFx0XHRicmVha3BvaW50cyA9IHRoaXMuYnJlYWtwb2ludHMsXHJcblx0XHRcdHBvaW50ID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLmZpbmQoa2V5ID0+IGJyZWFrcG9pbnRzW2tleV0gPT09IHJlc3BvbnNpdmVfc2l6ZSk7XHJcblxyXG5cdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cyksXHJcblx0XHRcdGxvYyA9IGtleXMuaW5kZXhPZihwb2ludCk7XHJcblxyXG5cdFx0cmV0dXJuIHdpbmRvd1dpZHRoID49IGJyZWFrcG9pbnRzW2tleXNbbG9jICsgMV1dO1xyXG5cdH1cclxuXHJcblx0X2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBtb2R1bGUuZWxlbWVudCxcclxuXHRcdFx0cGFyYW1zID0gbW9kdWxlLnBhcmFtcyxcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSAwO1xyXG5cclxuXHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5MRykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLmxnO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5NRCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLm1kO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5TTSkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnNtO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YUykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZTsiLCJpbXBvcnQge2lzRWxlbWVudH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0KDQsNCx0L7RgtCwINGBIERPTVxyXG4gKiBUT0RPINC/0LXRgNC10YDQsNCx0L7RgtCw0YLRjCDQutC+0L3RgdGC0LDQvdGC0YMgU2VsZWN0b3JzXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcblxyXG5jb25zdCBwYXJzZVNlbGVjdG9yID0gc2VsZWN0b3IgPT4ge1xyXG5cdGlmIChzZWxlY3RvciAmJiB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1MuZXNjYXBlKSB7XHJcblx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyMoW15cXHNcIiMnXSspL2csIChtYXRjaCwgaWQpID0+IGAjJHtDU1MuZXNjYXBlKGlkKX1gKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcbn1cclxuXHJcbmNvbnN0IGdldFNlbGVjdG9yID0gZWxlbWVudCA9PiB7XHJcblx0bGV0IHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmctdGFyZ2V0JylcclxuXHJcblx0aWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcblx0XHRsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcclxuXHRcdGlmICghaHJlZkF0dHJpYnV0ZSB8fCAoIWhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcuJykpKSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcjJykpIHtcclxuXHRcdFx0aHJlZkF0dHJpYnV0ZSA9IGAjJHtocmVmQXR0cmlidXRlLnNwbGl0KCcjJylbMV19YFxyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGxcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvciA/IHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKHNlbCA9PiBwYXJzZVNlbGVjdG9yKHNlbCkpLmpvaW4oJywnKSA6IG51bGxcclxufVxyXG5cclxuY29uc3QgU2VsZWN0b3JzID0ge1xyXG5cdGdldChlbCwgY29udGFpbmVyKSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcign0KLQvtCy0LDRgNC40YkhINCf0LXRgNCy0YvQuSDQv9Cw0YDQsNC80LXRgtGAINC90LUg0LTQvtC70LbQtdC9INCx0YvRgtGMINC/0YPRgdGC0YvQvCEnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0bGV0IGVsbSA9IGlzRWxlbWVudChjb250YWluZXIpID8gU2VsZWN0b3JzLmZpbmRPbmUoZWwsIGNvbnRhaW5lcikgOiBTZWxlY3RvcnMuZmluZE9uZShlbCk7XHJcblx0XHRcdFx0aWYgKGVsbSkgcmV0dXJuIGVsbTtcclxuXHRcdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcign0JDRhdC/0LXRgCEg0J3QtSDRg9C00LDQu9C+0YHRjCDQvdCw0LnRgtC4INGN0LvQtdC80LXQvdGCJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAoaXNFbGVtZW50KGVsKSkge1xyXG5cdFx0XHRcdHJldHVybiBlbDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ca0K3QnyEg0JrQsNC60LDRjy3RgtC+INC00LjRh9GMINC6INC90LDQvCDQt9Cw0LvQtdGC0LXQu9CwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmaW5kQWxsKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChlbGVtZW50LCBzZWxlY3RvcikpXHJcblx0fSxcclxuXHJcblx0ZmluZE9uZShzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3RvcilcclxuXHR9LFxyXG5cclxuXHRwcmV2KGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcblx0XHRsZXQgcHJldmlvdXMgPSBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmdcclxuXHJcblx0XHR3aGlsZSAocHJldmlvdXMpIHtcclxuXHRcdFx0aWYgKHByZXZpb3VzLm1hdGNoZXMoc2VsZWN0b3IpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtwcmV2aW91c11cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cHJldmlvdXMgPSBwcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtdXHJcblx0fSxcclxuXHJcblx0bmV4dChlbGVtZW50LCBzZWxlY3Rvcikge1xyXG5cdFx0bGV0IG5leHQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcclxuXHJcblx0XHR3aGlsZSAobmV4dCkge1xyXG5cdFx0XHRpZiAobmV4dC5tYXRjaGVzKHNlbGVjdG9yKSkge1xyXG5cdFx0XHRcdHJldHVybiBbbmV4dF1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV4dCA9IG5leHQubmV4dEVsZW1lbnRTaWJsaW5nXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtdXHJcblx0fSxcclxuXHJcblx0Z2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcblx0XHRsZXQgX3NlbGVjdG9yID0gbnVsbDtcclxuXHJcblx0XHRpZiAoaXNFbGVtZW50KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRfc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRfc2VsZWN0b3IgPSBTZWxlY3RvcnMuZmluZE9uZShzZWxlY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRhcmdldCA9IGdldFNlbGVjdG9yKF9zZWxlY3Rvcik7XHJcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuIG51bGw7XHJcblxyXG5cdFx0bGV0IF90YXJnZXRTZWxlY3RvciA9IFNlbGVjdG9ycy5maW5kT25lKHRhcmdldCk7XHJcblx0XHRpZiAoX3RhcmdldFNlbGVjdG9yKSByZXR1cm4gIF90YXJnZXRTZWxlY3RvcjtcclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yczsiLCJpbXBvcnQge2V4ZWN1dGVBZnRlclRyYW5zaXRpb24sIGlzRW1wdHlPYmp9IGZyb20gXCIuLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBQYXJhbXMgZnJvbSBcIi4uL191dGlscy9qcy9wYXJhbXNcIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4uL191dGlscy9qcy9kYXRhXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7QWpheCwgZ2V0U1ZHfSBmcm9tIFwiLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSBleHRlbmRzIFBhcmFtcyB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG5cdFx0dGhpcy5fcGFyYW1zID0ge307XHJcblxyXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cclxuXHRcdERhdGEuc2V0KHRoaXMuZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FX0tFWSwgdGhpcylcclxuXHR9XHJcblxyXG5cdGdldCBlbGVtZW50KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRcclxuXHR9XHJcblxyXG5cdHNldCBlbGVtZW50KGVsKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gU2VsZWN0b3JzLmdldChlbCk7XHJcblx0fVxyXG5cclxuXHRnZXQgcGFyYW1zKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcmFtc1xyXG5cdH1cclxuXHJcblx0c2V0IHBhcmFtcyhwYXJhbXMpIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhwYXJhbXMsIHRoaXMuZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuICcnXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gJydcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRGF0YS5nZXQoU2VsZWN0b3JzLmdldChlbGVtZW50KSwgdGhpcy5OQU1FX0tFWSlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRJbnN0YW5jZShlbGVtZW50KSB8fCBuZXcgdGhpcyhlbGVtZW50LCAhaXNFbXB0eU9iaihwYXJhbXMpID8gcGFyYW1zIDoge30pXHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0RGF0YS5yZW1vdmUodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZKVxyXG5cclxuXHRcdGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHRoaXNbcHJvcGVydHlOYW1lXSA9IG51bGxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yb3V0ZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmhhc093blByb3BlcnR5KCdhamF4JykpIHtcclxuXHRcdFx0aWYgKCd0YXJnZXQnIGluIF90aGlzLnBhcmFtcy5hamF4ICYmIF90aGlzLnBhcmFtcy5hamF4LnRhcmdldCkge1xyXG5cdFx0XHRcdGxldCAkY29udGVudCA9IFNlbGVjdG9ycy5maW5kT25lKF90aGlzLnBhcmFtcy5hamF4LnRhcmdldCk7XHJcblx0XHRcdFx0aWYgKCRjb250ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoJ3JvdXRlJyBpbiBfdGhpcy5wYXJhbXMuYWpheCAmJiBfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSkge1xyXG5cdFx0XHRcdFx0XHRBamF4LmdldChfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSwge30sIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRzZXREYXRhKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLmVsZW1lbnQsIF90aGlzLk5BTUVfS0VZICsgJy5sb2FkZWQnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcclxuXHRcdFx0XHRcdCRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2Rpc21pc3NFbGVtZW50KCkge1xyXG5cdFx0bGV0IGNyb3NzID0gZ2V0U1ZHKCdjcm9zcycpLFxyXG5cdFx0XHRidXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZnLWJ0bi1jbG9zZScpO1xyXG5cclxuXHRcdGlmIChidXR0b24pIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuXHRcdFx0aWYgKCFzdmcpIGJ1dHRvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNyb3NzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9xdWV1ZUNhbGxiYWNrKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0XHRleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkLCB0aW1lT3V0TXMpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBub29wfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGxhY2VtZW50IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvcGxhY2VtZW50XCI7XHJcblxyXG5jb25zdCBOQU1FICAgICAgICAgICAgID0gJ2Ryb3Bkb3duJztcclxuY29uc3QgTkFNRV9LRVkgICAgICAgICA9ICd2Zy5kcm9wZG93bic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgPSAnZmFkZSc7XHJcbmNvbnN0IFRBUkdFVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24tY29udGVudCc7XHJcbmNvbnN0IFBBUkVOVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXSc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSBga2V5dXAuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlET1dOX0RBVEFfQVBJID0gYGtleWRvd24uJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSA9IGBtb3VzZW91dC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jb25zdCBQQVJBTVNfREVGQVVMVCA9IHtcclxuXHRvZmZzZXQ6IFswLCAyXSxcclxuXHRvdmVyOiBmYWxzZSxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0aG92ZXI6IGZhbHNlLFxyXG5cdGFqYXg6IHtcclxuXHRcdHJvdXRlOiAnJyxcclxuXHRcdHRhcmdldDogJydcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWR0Ryb3Bkb3duIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnROb2RlO1xyXG5cdFx0dGhpcy5fZHJvcCA9IFNlbGVjdG9ycy5nZXQoJy4nICsgVEFSR0VUX0NPTlRBSU5FUiwgdGhpcy5fcGFyZW50KTtcclxuXHRcdHRoaXMuX2lzUGxhY2VtZW50ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHRoaXMucGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5wYXJhbXMudGltZW91dEFuaW1hdGlvbiA9IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9pc1Nob3duKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xyXG5cdH1cclxuXHJcblx0c2hvdygpIHtcclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMuZWxlbWVudCkgfHwgdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHR0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9zZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLmVsZW1lbnQpIHx8ICF0aGlzLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRoaXMuZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRyZXR1cm4gc3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOLCByZWxhdGVkVGFyZ2V0KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fcGFyZW50LCB0cnVlLCB0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vZmZzZXQpIHtcclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUucGFkZGluZ1RvcCA9IF90aGlzLnBhcmFtcy5vZmZzZXRbMV0gKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBfdGhpcy5wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLnBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRsZXQgY3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oaW5zdGFuY2UuX3BhcmVudCwgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudCk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBQQVJFTlRfQ09OVEFJTkVSKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoIWluc3RhbmNlLl9wYXJlbnQuY29udGFpbnModGFyZ2V0KSkgcmV0dXJuO1xyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gdGFyZ2V0O1xyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oaW5zdGFuY2UuX3BhcmVudCwgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdFx0XHR3aGlsZSAocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0XHRcdFx0aWYgKHJlbGF0ZWRUYXJnZXQgPT09IGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdGluc3RhbmNlLl9jb21wbGV0ZUhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGluc3RhbmNlLl9lbGVtZW50fSk7XHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgVkdEcm9wZG93bi5rZXlkb3duSGFuZGxlcik7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSwgJy4nICsgVEFSR0VUX0NPTlRBSU5FUiwgVkdEcm9wZG93bi5rZXlkb3duSGFuZGxlcik7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHRHJvcGRvd24uY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFZHRHJvcGRvd24uY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpbnN0YW5jZS50b2dnbGUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KSB7XHJcblx0XHRjb25zdCBvcGVuVG9nZ2xlcyA9IFNlbGVjdG9ycy5maW5kQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXTpub3QoLmRpc2FibGVkKTpub3QoOmRpc2FibGVkKS5zaG93Jyk7XHJcblx0XHRmb3IgKGNvbnN0IHRvZ2dsZSBvZiBvcGVuVG9nZ2xlcykge1xyXG5cdFx0XHRjb25zdCBjb250ZXh0ID0gVkdEcm9wZG93bi5nZXRJbnN0YW5jZSh0b2dnbGUpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIHtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuJyArIFRBUkdFVF9DT05UQUlORVIpID09PSBjb250ZXh0Ll9kcm9wKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBjb21wb3NlZFBhdGggPSBldmVudC5jb21wb3NlZFBhdGgoKTtcclxuXHRcdFx0aWYgKGNvbXBvc2VkUGF0aC5pbmNsdWRlcyhjb250ZXh0Ll9lbGVtZW50KSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IGNvbnRleHQuX2VsZW1lbnQgfVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb250ZXh0Ll9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBrZXlkb3duSGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgaXNJbnB1dCA9IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXHJcblx0XHRjb25zdCBpc0VzY2FwZUV2ZW50ID0gZXZlbnQua2V5ID09PSAnRXNjYXBlJ1xyXG5cdFx0Y29uc3QgaXNVcE9yRG93bkV2ZW50ID0gWydBcnJvd1VwJywgJ0Fycm93RG93biddLmluY2x1ZGVzKGV2ZW50LmtleSlcclxuXHJcblx0XHRpZiAoIWlzVXBPckRvd25FdmVudCAmJiAhaXNFc2NhcGVFdmVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNJbnB1dCAmJiAhaXNFc2NhcGVFdmVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG5cdFx0Y29uc3QgZ2V0VG9nZ2xlQnV0dG9uID0gdGhpcy5tYXRjaGVzKFNFTEVDVE9SX0RBVEFfVE9HR0xFKSA/XHJcblx0XHRcdHRoaXMgOlxyXG5cdFx0XHQoU2VsZWN0b3JzLnByZXYodGhpcywgU0VMRUNUT1JfREFUQV9UT0dHTEUpWzBdIHx8XHJcblx0XHRcdFx0U2VsZWN0b3JzLm5leHQodGhpcywgU0VMRUNUT1JfREFUQV9UT0dHTEUpWzBdIHx8XHJcblx0XHRcdFx0U2VsZWN0b3JzLmZpbmRPbmUoU0VMRUNUT1JfREFUQV9UT0dHTEUsIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LnBhcmVudE5vZGUpKVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGdldFRvZ2dsZUJ1dHRvbilcclxuXHJcblx0XHRpZiAoaXNVcE9yRG93bkV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblx0XHRcdGluc3RhbmNlLnNob3coKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW5zdGFuY2UuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5oaWRlKClcclxuXHRcdFx0Z2V0VG9nZ2xlQnV0dG9uLmZvY3VzKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHRHJvcGRvd24uaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdEcm9wZG93bjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9vdmVyZmxvd1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdtb2RhbCc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLm1vZGFsJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcclxuY29uc3QgU0VMRUNUT1JfRElBTE9HID0gJy52Zy1tb2RhbC1kaWFsb2cnXHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwibW9kYWxcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5cclxuY29uc3QgUEFSQU1TX0RFRkFVTFQgPSAge1xyXG5cdGJ1dHRvbjogbnVsbCxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRhamF4OiB7XHJcblx0XHRyb3V0ZTogJycsXHJcblx0XHR0YXJnZXQ6ICcnXHJcblx0fVxyXG59O1xyXG5cclxuY2xhc3MgVmdNb2RhbCBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX2RpYWxvZyA9IFNlbGVjdG9ycy5maW5kT25lKFNFTEVDVE9SX0RJQUxPRywgdGhpcy5lbGVtZW50KVxyXG5cclxuXHRcdHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblx0XHR0aGlzLl9kaXNtaXNzRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIFBBUkFNU19ERUZBVUxUXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lzQW5pbWF0ZWQoKSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCAnbW91c2Vkb3duLnZnLm1vZGFsJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0Y29uc3QgbW9kYWxDb250ZW50ID0gU2VsZWN0b3JzLmdldCgnLnZnLW1vZGFsLWNvbnRlbnQnLCB0aGlzKTtcclxuXHRcdFx0XHRpZiAoIW1vZGFsQ29udGVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5faXNBbmltYXRlZCgpKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLmVsZW1lbnQsIHRoaXMuX2lzQW5pbWF0ZWQoKSk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfaXNBbmltYXRlZCgpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRkFERSlcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWZ01vZGFsKVxyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFRhcmdldEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1tb2RhbC5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VmdNb2RhbC5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRjb25zdCBkYXRhID0gVmdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVmdNb2RhbDtcclxuIiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvYmFja2Ryb3BcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZH0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9tb2R1bGUtZm5cIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnc2lkZWJhcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnNpZGViYXInO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRidXR0b246IG51bGwsXHJcblx0YmFja2Ryb3A6IHRydWUsXHJcblx0b3ZlcmZsb3c6IHRydWUsXHJcblx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHU2lkZWJhciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5hcHBlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1iYWNrZHJvcCcpLCAnbW91c2Vkb3duLnZnLmJhY2tkcm9wJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLmVsZW1lbnQsIHRydWUsIDUwKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLmVsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuZWxlbWVudCwgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMucGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKClcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdTaWRlYmFyKVxyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX0hJRERFTiwgKCkgPT4ge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0fSlcclxuXHJcblx0Y29uc3QgYWxyZWFkeU9wZW4gPSBTZWxlY3RvcnMuZmluZE9uZSgnLnZnLXNpZGViYXIuc2hvdycpXHJcblx0aWYgKGFscmVhZHlPcGVuICYmIGFscmVhZHlPcGVuICE9PSB0YXJnZXQpIHtcclxuXHRcdFZHU2lkZWJhci5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRjb25zdCBkYXRhID0gVkdTaWRlYmFyLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cdGRhdGEudG9nZ2xlKHRoaXMpXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR1NpZGViYXI7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdmb3JtLXNlbmRlcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLmZvcm0tc2VuZGVyJztcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgQ2xhc3Nlc1xyXG4gKi9cclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmdmb3Jtc2VuZGVyXSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfU1VCTUlUX0RBVEFfQVBJID0gYHN1Ym1pdC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBQYXJhbXNcclxuICovXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHJcbn07XHJcblxyXG5jbGFzcyBWR0Zvcm1TZW5kZXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRpZiAodGhpcy5wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0YnVpbGQoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBwYXJhbXNcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR0Zvcm1TZW5kZXIuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRm9ybVNlbmRlcjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3Jlc3BvbnNpdmVcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBub29wLCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICduYXYnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5uYXYnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICAgPSAnZmFkZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJy52Zy1uYXYgYSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSAgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTSVpFX0RBVEFfQVBJID0gYHJlc2l6ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBQYXJhbXNcclxuICovXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRicmVha3BvaW50OiAnbGcnLFxyXG5cdHBsYWNlbWVudDogJ2hvcml6b250YWwnLFxyXG5cdGNsYXNzZXM6IHtcclxuXHRcdGhhbWJ1cmdlckFjdGl2ZTogJ3ZnLW5hdi1oYW1idXJnZXItYWN0aXZlJyxcclxuXHRcdGhhbWJ1cmdlcjogJ3ZnLW5hdi1oYW1idXJnZXInLFxyXG5cdFx0Y29udGFpbmVyOiAndmctbmF2LWNvbnRhaW5lcicsXHJcblx0XHR3cmFwcGVyOiAndmctbmF2LXdyYXBwZXInLFxyXG5cdFx0YWN0aXZlOiAndmctbmF2LWFjdGl2ZScsXHJcblx0XHRleHBhbmQ6ICd2Zy1uYXYtZXhwYW5kJyxcclxuXHRcdGNsb25lZDogJ3ZnLW5hdi1jbG9uZWQnLFxyXG5cdFx0aG92ZXI6ICd2Zy1uYXYtaG92ZXInLFxyXG5cdFx0ZmxpcDogJ3ZnLW5hdi1mbGlwJyxcclxuXHRcdFhYWEw6ICd2Zy1uYXYteHh4bCcsXHJcblx0XHRYWEw6ICd2Zy1uYXYteHhsJyxcclxuXHRcdFhMOiAndmctbmF2LXhsJyxcclxuXHRcdExHOiAndmctbmF2LWxnJyxcclxuXHRcdE1EOiAndmctbmF2LW1kJyxcclxuXHRcdFNNOiAndmctbmF2LXNtJyxcclxuXHRcdFhTOiAndmctbmF2LXhzJ1xyXG5cdH0sXHJcblx0ZXhwYW5kOiB0cnVlLFxyXG5cdGhvdmVyOiBmYWxzZSxcclxuXHRwb3NpdGlvbjogdHJ1ZSxcclxuXHRjb2xsYXBzZTogdHJ1ZSxcclxuXHR0b2dnbGU6ICc8c3BhbiBjbGFzcz1cImRlZmF1bHRcIj48L3NwYW4+JyxcclxuXHRoYW1idXJnZXI6IHtcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdGJvZHk6IG51bGxcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiBub29wLFxyXG5cdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHTmF2IGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IG51bGw7XHJcblx0XHR0aGlzLm5hdmlnYXRpb24gPSAnLicgKyB0aGlzLnBhcmFtcy5jbGFzc2VzLndyYXBwZXI7XHJcblxyXG5cdFx0dGhpcy5tb3ZlZExpbmtzID0gW107XHJcblx0XHR0aGlzLiRsaW5rcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuJyArIHRoaXMucGFyYW1zLmNsYXNzZXMud3JhcHBlciArICcgPiBsaScsIHRoaXMubmF2aWdhdGlvbilcclxuXHJcblx0XHRpZiAodGhpcy5wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0Z2V0IG5hdmlnYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcclxuXHR9XHJcblxyXG5cdHNldCBuYXZpZ2F0aW9uKGVsKSB7XHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gU2VsZWN0b3JzLmdldChlbCwgdGhpcy5lbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0aWYgKCF0aGlzLm5hdmlnYXRpb24pIHJldHVybjtcclxuXHJcblx0XHRsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcblxyXG5cdFx0Ly8g0JLQtdGI0LDQtdC8INC+0YHQvdC+0LLQvdGL0LUg0LrQu9Cw0YHRgdGLXHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5jb250YWluZXIpO1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLnBsYWNlbWVudCk7XHJcblxyXG5cdFx0Ly8g0JXRgdC70Lgg0L3Rg9C20L3QviDQvtGB0YLQsNCy0LjRgtGMINGB0L/QuNGB0L7QuiDQvNC10L3RjiDQuNC70Lgg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0LzQtdC00LjQsCDRgtC+0YfQutGDXHJcblx0XHRpZiAocGFyYW1zLmJyZWFrcG9pbnQgPT09IG51bGwpIHtcclxuXHRcdFx0cGFyYW1zLmV4cGFuZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXJhbXMuYnJlYWtwb2ludCA9PT0gbnVsbCB8fCAhcGFyYW1zLmV4cGFuZCkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5leHBhbmQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLmJyZWFrcG9pbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCc0LXQvdGOINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCwg0LXRgdC70Lgg0Y3RgtC+INC90LUg0LzQvtCx0LjQu9GM0L3QvtC1INGD0YHRgtGA0L7QudGB0YLQstC+XHJcblx0XHRpZiAocGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHJcblx0XHRcdGlmIChSZXNwb25zaXZlLmNoZWNrTW9iaWxlT3JUYWJsZXQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INCz0LDQvNCx0YPRgNCz0LXRgCwg0LXRgdC70Lgg0LXQs9C+INC90LXRgiDQsiDRgNCw0LfQvNC10YLQutC1XHJcblx0XHRpZiAocGFyYW1zLmV4cGFuZCAmJiAhcGFyYW1zLmhhbWJ1cmdlci5ib2R5KSB7XHJcblx0XHRcdGxldCBpc0hhbWJ1cmdlciA9IFNlbGVjdG9ycy5maW5kT25lKCcuJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciwgdGhpcy5lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChpc0hhbWJ1cmdlciA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBtVGl0bGUgPSAnJyxcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS1saW5lc1wiPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci50aXRsZSkge1xyXG5cdFx0XHRcdFx0bVRpdGxlID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLXRpdGxlXCI+JysgcGFyYW1zLmhhbWJ1cmdlci50aXRsZSArJzwvc3Bhbj4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIuYm9keSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gcGFyYW1zLmhhbWJ1cmdlci5ib2R5O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsJzxhIGhyZWY9XCIjc2lkZWJhci1uYXZcIiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnXCIgZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCI+JyArIG1UaXRsZSArIGhhbWJ1cmdlciArJzwvYT4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INGD0LrQsNC30LDRgtC10LvRjCDQv9C10YDQtdC60LvRjtGH0LDRgtC10LvRj1xyXG5cdFx0aWYgKHBhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0bGV0ICRkcm9wZG93bl9hID0gWy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd24tbWVnYSA+IGEsIC5kcm9wZG93biA+IGEnLCB0aGlzLmVsZW1lbnQpXSxcclxuXHRcdFx0XHR0b2dnbGUgPSAnPHNwYW4gY2xhc3M9XCJ0b2dnbGVcIj4nICsgcGFyYW1zLnRvZ2dsZSArICc8L3NwYW4+JztcclxuXHJcblx0XHRcdGlmICgkZHJvcGRvd25fYS5sZW5ndGgpIHtcclxuXHRcdFx0XHQkZHJvcGRvd25fYS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVsZW0ucXVlcnlTZWxlY3RvcignLnRvZ2dsZScpICYmICFlbGVtLmNsb3Nlc3QoJy5kb3RzJykpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG5cdFx0XHRcdFx0XHRlbGVtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdG9nZ2xlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtcy5jb2xsYXBzZSAmJiBSZXNwb25zaXZlLmNoZWNrKHRoaXMpICYmIHBhcmFtcy5wbGFjZW1lbnQgIT09ICd2ZXJ0aWNhbCcpIHtcclxuXHRcdFx0c2V0Q29sbGFwc2UodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdhZnRlckluaXQnIGluIHRoaXMucGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUodGhpcy5wYXJhbXMuY2FsbGJhY2suYWZ0ZXJJbml0LCBbdGhpc10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICog0KTRg9C90LrRhtC40Y8g0YHQstC+0YDQsNGH0LjQstCw0L3QuNGPXHJcblx0XHQgKiBUT0RPINCf0YDQuNC00YPQvNCw0YLRjCDRh9GC0L4g0YLQviDRgSDQvNC10LPQsCDQvNC10L3Rjiwg0LrQvtGC0L7RgNC+0LUg0YPRhdC+0LTQuNGCINCyINC/0L7QtNC80LXQvdGOXHJcblx0XHQgKiBUT0RPINCi0LDQuiDQttC1INC10YHRgtGMINC60L7RgdGP0LrQuCDQv9GA0Lgg0YDQtdGB0LDQudC30LVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0Q29sbGFwc2UoX3RoaXMpIHtcclxuXHRcdFx0bGV0IHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSA9IF90aGlzLm5hdmlnYXRpb24uY2xpZW50V2lkdGgsXHJcblx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAwLFxyXG5cdFx0XHRcdCRkb3RzID0gU2VsZWN0b3JzLmZpbmRPbmUoJy5kb3RzJywgX3RoaXMubmF2aWdhdGlvbiksXHJcblx0XHRcdFx0X2RvdHMgPSBnZXRTVkcoJ2RvdHMnKTtcclxuXHJcblx0XHRcdGlmIChfdGhpcy4kbGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9ICRkb3RzLmNsaWVudFdpZHRoXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCAkYSA9IFNlbGVjdG9ycy5maW5kT25lKCdhJywgX3RoaXMuJGxpbmtzWzBdKSxcclxuXHRcdFx0XHRcdFx0JGxpbmtTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoJGEpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nTGVmdC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSAgbm9ybWFsaXplRGF0YSgkbGlua1N0eWxlLnBhZGRpbmdSaWdodC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nID0gcGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQ7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQstC10YDQvdC+LCDQvdC+INC80Ysg0YLQvtGH0L3QviDQt9C90LDQtdC8INGI0LjRgNC40L3RgyDRgtC+0YfQtdC6INCyIHN2ZyAtIDE2cHhcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gcGFkZGluZyArIDE2O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgJGxpbmsgb2YgX3RoaXMuJGxpbmtzKSB7XHJcblx0XHRcdFx0XHRsZXQgd2lkdGggPSAkbGluay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgKyB3aWR0aDtcclxuXHJcblx0XHRcdFx0XHRpZiAoKHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSkgPCB3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlZExpbmtzLnB1c2goJGxpbmspO1xyXG5cdFx0XHRcdFx0XHQkbGluay5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRCZWZvcmUoX3RoaXMubW92ZWRMaW5rc1swXSwgJGRvdHMpXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uYXBwZW5kQ2hpbGQoX3RoaXMubW92ZWRMaW5rc1swXSlcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5zcGxpY2UoMCwgMSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0aWYgKCEkZG90cykge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywnPGxpIGNsYXNzPVwiZHJvcGRvd24gZG90c1wiPicgKyAnPGEgaHJlZj1cIiNcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4nKyBfZG90cyArJzwvYT48L2xpPicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0JGRvdHMucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgJGQgPSBfdGhpcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5kb3RzJyk7XHJcblx0XHRcdFx0aWYgKCRkICYmIF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gJGQucXVlcnlTZWxlY3RvcigndWwnKTtcclxuXHRcdFx0XHRcdGlmICgkZHJvcGRvd24pIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBfdGhpcy5tb3ZlZExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdFx0JGRyb3Bkb3duLnByZXBlbmQobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCAkZHJvcGRvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd24tY29udGVudCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQkZC5hcHBlbmRDaGlsZCgkZHJvcGRvd24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRsZXQgdGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICghdGFyZ2V0IHx8IGlzRGlzYWJsZWQodGFyZ2V0KSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duLWNvbnRlbnQnKSkge1xyXG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCgnZmlyc3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRsZXQgZHJvcCA9IFNlbGVjdG9ycy5maW5kT25lKCcuZHJvcGRvd24tY29udGVudCcsIHRhcmdldCksXHJcblx0XHRcdGxpbmsgPSB0YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG5cdFx0aWYgKGxpbmspIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuXHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cclxuXHRcdHNldERyb3BQb3NpdGlvbihkcm9wKVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgZHJvcCwgdHJ1ZSwgNTApO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSAkZHJvcFxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBzZXREcm9wUG9zaXRpb24oJGRyb3ApIHtcclxuXHRcdFx0bGV0IHt3aWR0aCwgcmlnaHR9ID0gJGRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdFx0d2luZG93X3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG5cdFx0XHRsZXQgTl9yaWdodCA9IHdpbmRvd193aWR0aCAtIHJpZ2h0IC0gd2lkdGg7XHJcblxyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdsZWZ0Jyk7XHJcblxyXG5cdFx0XHRsZXQgJHBhcmVudCA9ICRkcm9wLmNsb3Nlc3QoJ2xpJyksXHJcblx0XHRcdFx0JHVsID0gJHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCd1bCcpO1xyXG5cclxuXHRcdFx0aWYgKE5fcmlnaHQgPiB3aWR0aCkge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCAkZWwgb2YgJHVsKSB7XHJcblx0XHRcdFx0XHQkZWwuY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoJ2VsbScgaW4gcmVsYXRlZFRhcmdldCAmJiByZWxhdGVkVGFyZ2V0LmVsbSkge1xyXG5cdFx0XHRlbGVtZW50ID0gcmVsYXRlZFRhcmdldC5lbG1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZWxlbWVudCkge1xyXG5cdFx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihlbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZmlyc3QnKSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlyc3QnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuJyArIENMQVNTX05BTUVfU0hPVywgZWxlbWVudCldLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xyXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRcdFx0bGV0IHBhcmVudCA9IGVsLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGxpbmsgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0XHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoZWwsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0X3RoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgZWwsIHRydWUsIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRPRE8g0LXRgdC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtC1INC90LXRgdC60L7Qu9GM0LrQviDQvdCw0LLQuNCz0LDRhtC40LksINGC0L4g0LXRgdGC0Ywg0LrQvtGB0Y/QutC4XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdOYXYuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHJcblx0XHRsZXQgZHJvcHMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duJywgaW5zdGFuY2UuX25hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLnBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRbLi4uZHJvcHNdLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGlmICghaW5zdGFuY2UubmF2aWdhdGlvbi5jb250YWlucyh0YXJnZXQpKSByZXR1cm47XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldDogdGFyZ2V0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2Uuc2hvdyhyZWxhdGVkVGFyZ2V0KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyksXHJcblx0XHRcdFx0XHRcdGVsbSA9IGN1cnJlbnRFbGVtO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGVsbTogZWxtfSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghTWFuaXB1bGF0b3IuaGFzKHRoaXMsICdhcmlhLWV4cGFuZGVkJykpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICgnY2xpY2snIGluIGluc3RhbmNlLnBhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0ZXhlY3V0ZShpbnN0YW5jZS5wYXJhbXMuY2FsbGJhY2suY2xpY2ssIFt0aGlzXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXMuY2xvc2VzdCgnLnZnLW5hdicpLFxyXG5cdFx0XHRcdFx0aXNGaXJzdCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmZpcnN0Jyk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSB0aGlzLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGlmIChpc0Rpc2FibGVkKHRhcmdldCkgJiYgIWlzVmlzaWJsZSh0YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaXNGaXJzdCAmJiB0aGlzLmNsb3Nlc3QoJy5maXJzdCcpKSB7XHJcblx0XHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogdGFyZ2V0fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuYWN0aXZlJywgc2VsZildLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlbCAmJiBlbCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogZWx9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB2Z05hdlNpZGViYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhci1uYXYnKTtcclxuXHRcdGxldCBoYW1idXJnZXIgPSBpbnN0YW5jZS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaW5zdGFuY2UucGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyKTtcclxuXHJcblx0XHRpZiAodmdOYXZTaWRlYmFyICYmIGhhbWJ1cmdlcikge1xyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5zaG93JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLnBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuaGlkZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZShpbnN0YW5jZS5wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ecm9wcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpLmFjdGl2ZScpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR05hdi5nZXRJbnN0YW5jZSh0b2dnbGUuY2xvc2VzdCgnLnZnLW5hdicpKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSBjb250aW51ZTtcclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRvZ2dsZSB9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdHJlbGF0ZWRUYXJnZXQuY2xpY2tFdmVudCA9IGV2ZW50XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHQuaGlkZShyZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfUkVTSVpFX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoJy52Zy1uYXYnLCB7fSk7XHJcblx0aW5zdGFuY2UuYnVpbGQoKTtcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHTmF2OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC9fdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3NcIjtcclxuXHJcbi8vIHZnc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzc1wiO1xyXG5pbXBvcnQgVkdTaWRlYmFyIGZyb20gXCIuL2FwcC9tb2R1bGVzL3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzXCI7XHJcbmltcG9ydCBWR0Ryb3Bkb3duIGZyb20gXCIuL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd25cIjtcclxuXHJcbi8vIG1vZGFsXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZnTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvbW9kYWwvanMvdmdtb2RhbFwiO1xyXG5cclxuLy8gbmF2XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzXCI7XHJcbmltcG9ydCBWR05hdiBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z25hdi9qcy92Z25hdlwiO1xyXG5cclxuLy8gZm9ybSBzZW5kZXJcclxuaW1wb3J0IFZHRm9ybVNlbmRlciBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvanMvdmdmb3Jtc2VuZGVyXCI7XHJcblxyXG5mdW5jdGlvbiBvblJlYWR5KCkge1xyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXScpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRWR0Ryb3Bkb3duLmluaXQoZWxlbWVudCwge30pXHJcblx0fSk7XHJcblxyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmctbmF2JyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFZHTmF2LmluaXQoZWxlbWVudCwge30pXHJcblx0fSk7XHJcblxyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Z2Zvcm1zZW5kZXJdJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFZHRm9ybVNlbmRlci5pbml0KGVsZW1lbnQsIHt9KVxyXG5cdH0pO1xyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgb25SZWFkeSk7XHJcblxyXG5leHBvcnQge1xyXG5cdFZHU2lkZWJhciwgVkdEcm9wZG93biwgVkdOYXYsIFZnTW9kYWxcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=