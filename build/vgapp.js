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
 */

/**
 * Constants
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
 */

/**
 * Constants
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
 * Private methods
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
  // TODO: tooltip passes `false` instead of selector, so we need to check
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
const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },
  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },
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
/* harmony export */   normalizeData: () => (/* binding */ normalizeData),
/* harmony export */   removeElementArray: () => (/* binding */ removeElementArray)
/* harmony export */ });
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
function executeAfterTransition(callback, transitionElement, waitForTransition = true) {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
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
 * Манипуляции с элементом
 */
const Manipulator = {
  getDataAttributes(element, isRemoveDataName = true) {
    if (!element) {
      return {};
    }
    let elmBase = ['data-vg-toggle', 'data-vg-target', 'data-vg-dismiss'],
      attributes = {},
      arr = [].filter.call(element.attributes, function (at) {
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
  },
  getAttribute: function (element, nameAttribute) {
    if (!element && !nameAttribute) {
      return '';
    }
    return (0,_functions__WEBPACK_IMPORTED_MODULE_0__.normalizeData)(element.getAttribute(nameAttribute));
  },
  removeAttribute: function (element, nameAttribute) {
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) && nameAttribute) {
      element.removeAttribute(nameAttribute);
    }
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
    let styles = _manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.getAttribute(document.body, 'style');
    if (!styles) _manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.removeAttribute(document.body, 'style');
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
    return (0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.getDataAttributes(element), params) : {};
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Params);

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
/* harmony import */ var _manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manipulator */ "./app/_utils/js/manipulator.js");


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
  getTargetFromSelector(selector) {
    let _selector = null;
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(selector)) {
      _selector = selector;
    } else if (typeof selector === 'string') {
      _selector = Selectors.findOne(selector);
    }
    let target = _manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.getAttribute(_selector, 'href') || _manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.getAttribute(_selector, 'data-vg-target') || '';
    if (target) {
      return Selectors.findOne(target);
    }
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
    return this.getInstance(element) || new this(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.isEmptyObj)(params) ? params : null);
  }
  dispose() {
    _utils_js_data__WEBPACK_IMPORTED_MODULE_2__["default"].remove(this.element, this.constructor.NAME_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }
  _queueCallback(callback, element, isAnimated = true) {
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.executeAfterTransition)(callback, element, isAnimated);
  }
  _dismissElement() {
    let cross = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' + '\t viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">' + '<path d="M89.7,10.3L89.7,10.3c-1-1-2.6-1-3.5,0L50,46.5L13.9,10.3c-1-1-2.6-1-3.5,0l0,0c-1,1-1,2.6,0,3.5L46.5,50L10.3,86.1' + '\tc-1,1-1,2.6,0,3.5h0c1,1,2.6,1,3.5,0L50,53.5l36.1,36.1c1,1,2.6,1,3.5,0l0,0c1-1,1-2.6,0-3.5L53.5,50l36.1-36.1' + '\tC90.6,12.9,90.6,11.3,89.7,10.3z"/>' + '</svg>',
      button = this.element.querySelector('.vg-btn-close');
    if (button) {
      let svg = button.querySelector('svg');
      if (!svg) button.insertAdjacentHTML('beforeend', cross);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BaseModule);

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







/**
 * Constants
 */
const NAME = 'vgSidebar';
const NAME_KEY = 'vg.sidebar';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="sidebar"]';
const EVENT_KEY_HIDE = 'vg.sidebar.hide';
const EVENT_KEY_HIDDEN = 'vg.sidebar.hidden';
const EVENT_KEY_SHOW = 'vg.sidebar.show';
const EVENT_KEY_SHOWN = 'vg.sidebar.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';
const EVENT_KEY_KEYDOWN_DISMISS = 'keydown.dismiss.vg.sidebar';
const EVENT_KEY_HIDE_PREVENTED = 'hidePrevented.vg.sidebar';
const EVENT_KEY_CLICK_DATA_API = 'click.vg.sidebar.data.api';
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
    if (relatedTarget) {
      relatedTarget.setAttribute('aria-expanded', true);
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
    this._queueCallback(completeCallBack, this.element, true);
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

/***/ "./app/_utils/scss/default.scss":
/*!**************************************!*\
  !*** ./app/_utils/scss/default.scss ***!
  \**************************************/
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
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_modules_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/_utils/scss/default.scss */ "./app/_utils/scss/default.scss");
/* harmony import */ var _app_modules_sidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/modules/sidebar/scss/vgsidebar.scss */ "./app/modules/sidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_modules_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/modules/sidebar/js/vgsidebar */ "./app/modules/sidebar/js/vgsidebar.js");
// css классы по умолчанию


// vgsidebar



})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBaURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3BPQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7OztBQ2xLQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9iYWNrZHJvcC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZGF0YS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZXZlbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2Z1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL292ZXJmbG93LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9wYXJhbXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzIiwid2VicGFjazovL3ZnL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmcvLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN1dGUsIGlzRWxlbWVudH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnRcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuL292ZXJmbG93XCI7XHJcblxyXG5jb25zdCBOQU1FID0gJ2JhY2tkcm9wJ1xyXG5jb25zdCBDTEFTU19OQU1FID0gJ3ZnLWJhY2tkcm9wJ1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcclxuY29uc3QgRVZFTlRfTU9VU0VET1dOID0gYG1vdXNlZG93bi52Zy4ke05BTUV9YFxyXG5cclxuY2xhc3MgQmFja2Ryb3Age1xyXG5cdHN0YXRpYyBzaG93KGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fYXBwZW5kKClcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGUoY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9kZXN0cm95KCk7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfYXBwZW5kKCkge1xyXG5cdFx0aWYgKFNlbGVjdG9ycy5maW5kT25lKCcuJyArIENMQVNTX05BTUUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFja2Ryb3ApO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSlcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24oYmFja2Ryb3AsIEVWRU5UX01PVVNFRE9XTiwgKCkgPT4ge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKClcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2Rlc3Ryb3koKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IFNlbGVjdG9ycy5maW5kT25lKCcuJyArIENMQVNTX05BTUUpO1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja2Ryb3A7IiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBkYXRhLmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcblxyXG5jb25zdCBlbGVtZW50TWFwID0gbmV3IE1hcCgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0c2V0KGVsZW1lbnQsIGtleSwgaW5zdGFuY2UpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgbmV3IE1hcCgpKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHRcdGlmICghaW5zdGFuY2VNYXAuaGFzKGtleSkgJiYgaW5zdGFuY2VNYXAuc2l6ZSAhPT0gMCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBWR0FwcCDQvdC1INC00L7Qv9GD0YHQutCw0LXRgiDQsdC+0LvQtdC1INC+0LTQvdC+0LPQviDRjdC60LfQtdC80L/Qu9GP0YDQsCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsC4g0KHQstGP0LfQsNC90L3Ri9C5INGN0LrQt9C10LzQv9C70Y/RgDogJHtBcnJheS5mcm9tKGluc3RhbmNlTWFwLmtleXMoKSlbMF19LmApXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLnNldChrZXksIGluc3RhbmNlKVxyXG5cdH0sXHJcblxyXG5cdGdldChlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmIChlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudE1hcC5nZXQoZWxlbWVudCkuZ2V0KGtleSkgfHwgbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0cmVtb3ZlKGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuZGVsZXRlKGtleSk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlTWFwLnNpemUgPT09IDApIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBldmVudC5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5cclxuY29uc3QgbmFtZXNwYWNlUmVnZXggPSAvW14uXSooPz1cXC4uKilcXC58LiovXHJcbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xyXG5jb25zdCBzdHJpcFVpZFJlZ2V4ID0gLzo6XFxkKyQvXHJcbmNvbnN0IGV2ZW50UmVnaXN0cnkgPSB7fSAvLyBFdmVudHMgc3RvcmFnZVxyXG5sZXQgdWlkRXZlbnQgPSAxXHJcbmNvbnN0IGN1c3RvbUV2ZW50cyA9IHtcclxuXHRtb3VzZWVudGVyOiAnbW91c2VvdmVyJyxcclxuXHRtb3VzZWxlYXZlOiAnbW91c2VvdXQnXHJcbn1cclxuXHJcbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xyXG5cdCdjbGljaycsXHJcblx0J2RibGNsaWNrJyxcclxuXHQnbW91c2V1cCcsXHJcblx0J21vdXNlZG93bicsXHJcblx0J2NvbnRleHRtZW51JyxcclxuXHQnbW91c2V3aGVlbCcsXHJcblx0J0RPTU1vdXNlU2Nyb2xsJyxcclxuXHQnbW91c2VvdmVyJyxcclxuXHQnbW91c2VvdXQnLFxyXG5cdCdtb3VzZW1vdmUnLFxyXG5cdCdzZWxlY3RzdGFydCcsXHJcblx0J3NlbGVjdGVuZCcsXHJcblx0J2tleWRvd24nLFxyXG5cdCdrZXlwcmVzcycsXHJcblx0J2tleXVwJyxcclxuXHQnb3JpZW50YXRpb25jaGFuZ2UnLFxyXG5cdCd0b3VjaHN0YXJ0JyxcclxuXHQndG91Y2htb3ZlJyxcclxuXHQndG91Y2hlbmQnLFxyXG5cdCd0b3VjaGNhbmNlbCcsXHJcblx0J3BvaW50ZXJkb3duJyxcclxuXHQncG9pbnRlcm1vdmUnLFxyXG5cdCdwb2ludGVydXAnLFxyXG5cdCdwb2ludGVybGVhdmUnLFxyXG5cdCdwb2ludGVyY2FuY2VsJyxcclxuXHQnZ2VzdHVyZXN0YXJ0JyxcclxuXHQnZ2VzdHVyZWNoYW5nZScsXHJcblx0J2dlc3R1cmVlbmQnLFxyXG5cdCdmb2N1cycsXHJcblx0J2JsdXInLFxyXG5cdCdjaGFuZ2UnLFxyXG5cdCdyZXNldCcsXHJcblx0J3NlbGVjdCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2ZvY3VzaW4nLFxyXG5cdCdmb2N1c291dCcsXHJcblx0J2xvYWQnLFxyXG5cdCd1bmxvYWQnLFxyXG5cdCdiZWZvcmV1bmxvYWQnLFxyXG5cdCdyZXNpemUnLFxyXG5cdCdtb3ZlJyxcclxuXHQnRE9NQ29udGVudExvYWRlZCcsXHJcblx0J3JlYWR5c3RhdGVjaGFuZ2UnLFxyXG5cdCdlcnJvcicsXHJcblx0J2Fib3J0JyxcclxuXHQnc2Nyb2xsJ1xyXG5dKVxyXG5cclxuLyoqXHJcbiAqIFByaXZhdGUgbWV0aG9kc1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1ha2VFdmVudFVpZChlbGVtZW50LCB1aWQpIHtcclxuXHRyZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChlbGVtZW50KVxyXG5cclxuXHRlbGVtZW50LnVpZEV2ZW50ID0gdWlkXHJcblx0ZXZlbnRSZWdpc3RyeVt1aWRdID0gZXZlbnRSZWdpc3RyeVt1aWRdIHx8IHt9XHJcblxyXG5cdHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiBlbGVtZW50IH0pXHJcblxyXG5cdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgZm4pXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIFtldmVudF0pXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgZG9tRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcblxyXG5cdFx0Zm9yIChsZXQgeyB0YXJnZXQgfSA9IGV2ZW50OyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSB0aGlzOyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRvbUVsZW1lbnQgb2YgZG9tRWxlbWVudHMpIHtcclxuXHRcdFx0XHRpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogdGFyZ2V0IH0pXHJcblxyXG5cdFx0XHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBzZWxlY3RvciwgZm4pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkodGFyZ2V0LCBbZXZlbnRdKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kSGFuZGxlcihldmVudHMsIGNhbGxhYmxlLCBkZWxlZ2F0aW9uU2VsZWN0b3IgPSBudWxsKSB7XHJcblx0cmV0dXJuIE9iamVjdC52YWx1ZXMoZXZlbnRzKVxyXG5cdFx0LmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRjb25zdCBpc0RlbGVnYXRlZCA9IHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJ1xyXG5cdC8vIFRPRE86IHRvb2x0aXAgcGFzc2VzIGBmYWxzZWAgaW5zdGVhZCBvZiBzZWxlY3Rvciwgc28gd2UgbmVlZCB0byBjaGVja1xyXG5cdGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0bGV0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChvcmlnaW5hbFR5cGVFdmVudClcclxuXHJcblx0aWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcclxuXHRcdHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIG9uZU9mZikge1xyXG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cclxuXHQvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXHJcblx0Ly8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXHJcblx0aWYgKG9yaWdpbmFsVHlwZUV2ZW50IGluIGN1c3RvbUV2ZW50cykge1xyXG5cdFx0Y29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYWJsZSA9IHdyYXBGdW5jdGlvbihjYWxsYWJsZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxyXG5cdGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblxyXG5cdGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XHJcblx0XHRwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxyXG5cclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXHJcblx0Y29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XHJcblx0XHRib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjYWxsYWJsZSkgOlxyXG5cdFx0Ym9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcclxuXHJcblx0Zm4uZGVsZWdhdGlvblNlbGVjdG9yID0gaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbFxyXG5cdGZuLmNhbGxhYmxlID0gY2FsbGFibGVcclxuXHRmbi5vbmVPZmYgPSBvbmVPZmZcclxuXHRmbi51aWRFdmVudCA9IHVpZFxyXG5cdGhhbmRsZXJzW3VpZF0gPSBmblxyXG5cclxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgaXNEZWxlZ2F0ZWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3Rvcikge1xyXG5cdGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcclxuXHJcblx0aWYgKCFmbikge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxyXG5cdGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcclxuXHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblxyXG5cdGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR5cGVFdmVudChldmVudCkge1xyXG5cdC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcclxuXHRldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxyXG5cdHJldHVybiBjdXN0b21FdmVudHNbZXZlbnRdIHx8IGV2ZW50XHJcbn1cclxuXHJcbmNvbnN0IEV2ZW50SGFuZGxlciA9IHtcclxuXHRvbihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIGZhbHNlKVxyXG5cdH0sXHJcblxyXG5cdG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIHRydWUpXHJcblx0fSxcclxuXHJcblx0b2ZmKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0XHRjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHRcdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRcdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHRcdGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly8gU2ltcGxlc3QgY2FzZTogaGFuZGxlciBpcyBwYXNzZWQsIHJlbW92ZSB0aGF0IGxpc3RlbmVyIE9OTFkuXHJcblx0XHRcdGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFtZXNwYWNlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcclxuXHRcdFx0XHRyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBba2V5SGFuZGxlcnMsIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdFx0Y29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXHJcblxyXG5cdFx0XHRpZiAoIWluTmFtZXNwYWNlIHx8IG9yaWdpbmFsVHlwZUV2ZW50LmluY2x1ZGVzKGhhbmRsZXJLZXkpKSB7XHJcblx0XHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXIoZWxlbWVudCwgZXZlbnQsIGFyZ3MpIHtcclxuXHRcdGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGJ1YmJsZXMgPSB0cnVlO1xyXG5cdFx0bGV0IG5hdGl2ZURpc3BhdGNoID0gdHJ1ZTtcclxuXHRcdGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3QgZXZ0ID0gaHlkcmF0ZU9iaihuZXcgRXZlbnQoZXZlbnQsIHsgYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSB9KSwgYXJncylcclxuXHJcblx0XHRpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuYXRpdmVEaXNwYXRjaCkge1xyXG5cdFx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBldnRcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcclxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhtZXRhKSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0b2JqW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb2JqXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlclxyXG4iLCIvKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0VsZW1lbnRcclxuICogQHBhcmFtIG9iamVjdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XHJcblx0aWYgKCFpc09iamVjdChvYmplY3QpKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdHJldHVybiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xyXG59XHJcblxyXG4vKipcclxuICogaXNEaXNhYmxlZFxyXG4gKiBAcGFyYW0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRGlzYWJsZWQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGVsZW1lbnQuZGlzYWJsZWQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVmlzaWJsZSAoZWxlbWVudCkge1xyXG5cdGlmICghaXNFbGVtZW50KGVsZW1lbnQpIHx8IGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPT09IDApIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZWxlbWVudElzVmlzaWJsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgndmlzaWJpbGl0eScpID09PSAndmlzaWJsZSdcclxuXHRjb25zdCBjbG9zZWREZXRhaWxzID0gZWxlbWVudC5jbG9zZXN0KCdkZXRhaWxzOm5vdChbb3Blbl0pJylcclxuXHJcblx0aWYgKCFjbG9zZWREZXRhaWxzKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG5cdH1cclxuXHJcblx0aWYgKGNsb3NlZERldGFpbHMgIT09IGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHN1bW1hcnkgPSBlbGVtZW50LmNsb3Nlc3QoJ3N1bW1hcnknKVxyXG5cdFx0aWYgKHN1bW1hcnkgJiYgc3VtbWFyeS5wYXJlbnROb2RlICE9PSBjbG9zZWREZXRhaWxzKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzdW1tYXJ5ID09PSBudWxsKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzT2JqZWN0XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcclxuXHRyZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstC+0LTQuNC8INCyINC/0L7RgNGP0LTQvtC6INGC0LjQv9GLINC00LDQvdC90YvRhVxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHJldHVybnMge2FueX1cclxuICovXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGEodmFsdWUpICB7XHJcblx0aWYgKHZhbHVlID09PSAndHJ1ZScpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSBOdW1iZXIodmFsdWUpLnRvU3RyaW5nKCkpIHtcclxuXHRcdHJldHVybiBOdW1iZXIodmFsdWUpXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnbnVsbCcpIHtcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG5cclxuXHR0cnkge1xyXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcclxuXHR9IGNhdGNoIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCj0LTQsNC70Y/QtdC8INGN0LvQtdC80LXQvdGC0Ysg0YEg0LzQsNGB0YHQuNCy0LBcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcGFyYW0gZWxcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRBcnJheShhcnIsIGVsKSB7XHJcblx0cmV0dXJuIGFyci5maWx0ZXIoKGl0ZW0pID0+ICFlbC5pbmNsdWRlcyhpdGVtKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQk9C70YPQsdC+0LrQvtC1INC+0LHRitC10LTQuNC90LXQvdC40LUg0L7QsdGK0LXQutGC0L7QslxyXG4gKiBAcGFyYW0gb2JqZWN0c1xyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIG1lcmdlRGVlcE9iamVjdCguLi5vYmplY3RzKSB7XHJcblx0Y29uc3QgaXNPYmplY3QgPSBvYmogPT4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xyXG5cclxuXHRyZXR1cm4gb2JqZWN0cy5yZWR1Y2UoKHByZXYsIG9iaikgPT4ge1xyXG5cdFx0T2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcblx0XHRcdGNvbnN0IHBWYWwgPSBwcmV2W2tleV07XHJcblx0XHRcdGNvbnN0IG9WYWwgPSBvYmpba2V5XTtcclxuXHJcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBWYWwpICYmIEFycmF5LmlzQXJyYXkob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBwVmFsLmNvbmNhdCguLi5vVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChpc09iamVjdChwVmFsKSAmJiBpc09iamVjdChvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG1lcmdlRGVlcE9iamVjdChwVmFsLCBvVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBvVmFsO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcHJldjtcclxuXHR9LCB7fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFja1xyXG4gKiBAcGFyYW0gcG9zc2libGVDYWxsYmFja1xyXG4gKiBAcGFyYW0gYXJnc1xyXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gZXhlY3V0ZShwb3NzaWJsZUNhbGxiYWNrLCBhcmdzID0gW10sIGRlZmF1bHRWYWx1ZSA9IHBvc3NpYmxlQ2FsbGJhY2spIHtcclxuXHRyZXR1cm4gdHlwZW9mIHBvc3NpYmxlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBwb3NzaWJsZUNhbGxiYWNrKC4uLmFyZ3MpIDogZGVmYXVsdFZhbHVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2l0aW9uXHJcbiAqIEBwYXJhbSBjYWxsYmFja1xyXG4gKiBAcGFyYW0gdHJhbnNpdGlvbkVsZW1lbnRcclxuICogQHBhcmFtIHdhaXRGb3JUcmFuc2l0aW9uXHJcbiAqL1xyXG5jb25zdCBUUkFOU0lUSU9OX0VORCA9ICd0cmFuc2l0aW9uZW5kJztcclxuY29uc3QgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwO1xyXG5cclxuZnVuY3Rpb24gZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiAoY2FsbGJhY2ssIHRyYW5zaXRpb25FbGVtZW50LCB3YWl0Rm9yVHJhbnNpdGlvbiA9IHRydWUpIHtcclxuXHRpZiAoIXdhaXRGb3JUcmFuc2l0aW9uKSB7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XHJcblx0Y29uc3QgZW11bGF0ZWREdXJhdGlvbiA9IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRyYW5zaXRpb25FbGVtZW50KSArIGR1cmF0aW9uUGFkZGluZ1xyXG5cclxuXHRsZXQgY2FsbGVkID0gZmFsc2VcclxuXHJcblx0Y29uc3QgaGFuZGxlciA9ICh7IHRhcmdldCB9KSA9PiB7XHJcblx0XHRpZiAodGFyZ2V0ICE9PSB0cmFuc2l0aW9uRWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsZWQgPSB0cnVlXHJcblx0XHR0cmFuc2l0aW9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHR9XHJcblxyXG5cdHRyYW5zaXRpb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRpZiAoIWNhbGxlZCkge1xyXG5cdFx0XHR0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRWxlbWVudClcclxuXHRcdH1cclxuXHR9LCBlbXVsYXRlZER1cmF0aW9uKVxyXG59XHJcblxyXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIEdldCB0cmFuc2l0aW9uLWR1cmF0aW9uIG9mIHRoZSBlbGVtZW50XHJcblx0bGV0IHsgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uRGVsYXkgfSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXHJcblxyXG5cdGNvbnN0IGZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKVxyXG5cdGNvbnN0IGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KVxyXG5cclxuXHQvLyBSZXR1cm4gMCBpZiBlbGVtZW50IG9yIHRyYW5zaXRpb24gZHVyYXRpb24gaXMgbm90IGZvdW5kXHJcblx0aWYgKCFmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiAmJiAhZmxvYXRUcmFuc2l0aW9uRGVsYXkpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBJZiBtdWx0aXBsZSBkdXJhdGlvbnMgYXJlIGRlZmluZWQsIHRha2UgdGhlIGZpcnN0XHJcblx0dHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KCcsJylbMF1cclxuXHR0cmFuc2l0aW9uRGVsYXkgPSB0cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywnKVswXVxyXG5cclxuXHRyZXR1cm4gKE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbikgKyBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpKSAqIE1JTExJU0VDT05EU19NVUxUSVBMSUVSXHJcbn1cclxuXHJcbmNvbnN0IHRyaWdnZXJUcmFuc2l0aW9uRW5kID0gZWxlbWVudCA9PiB7XHJcblx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChUUkFOU0lUSU9OX0VORCkpXHJcbn1cclxuXHJcbmV4cG9ydCB7aXNFbGVtZW50LCBpc1Zpc2libGUsIGlzRGlzYWJsZWQsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YSwgZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbn0iLCJpbXBvcnQge2lzRWxlbWVudCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDRjdC70LXQvNC10L3RgtC+0LxcclxuICovXHJcbmNvbnN0IE1hbmlwdWxhdG9yID0ge1xyXG5cdGdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsbUJhc2UgPSBbJ2RhdGEtdmctdG9nZ2xlJywgJ2RhdGEtdmctdGFyZ2V0JywgJ2RhdGEtdmctZGlzbWlzcyddLFxyXG5cdFx0XHRhdHRyaWJ1dGVzPSB7fSxcclxuXHRcdFx0YXJyID0gW10uZmlsdGVyLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gL15kYXRhLS8udGVzdChhdC5uYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0YXJyLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuXHRcdFx0XHRsZXQgbmFtZSA9IHYubmFtZTtcclxuXHJcblx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRpZiAoaXNSZW1vdmVEYXRhTmFtZSkgbmFtZSA9IG5hbWUuc2xpY2UoNSk7XHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzW25hbWVdID0gbm9ybWFsaXplRGF0YSh2LnZhbHVlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGF0dHJpYnV0ZXNcclxuXHR9LFxyXG5cclxuXHRnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQgJiYgIW5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdFx0cmV0dXJuICcnXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9ybWFsaXplRGF0YShlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKSk7XHJcblx0fSxcclxuXHJcblx0cmVtb3ZlQXR0cmlidXRlOiBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5pcHVsYXRvcn1cclxuIiwiaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIE92ZXJmbG93IHtcclxuXHRzdGF0aWMgYXBwZW5kKCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBnZXRXaWR0aCgpICsgJ3B4JztcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcblx0XHRmdW5jdGlvbiBnZXRXaWR0aCgpIHtcclxuXHRcdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cdFx0XHRyZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGRlc3Ryb3koKSB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG5cclxuXHRcdGxldCBzdHlsZXMgPSBNYW5pcHVsYXRvci5nZXRBdHRyaWJ1dGUoZG9jdW1lbnQuYm9keSwgJ3N0eWxlJyk7XHJcblx0XHRpZiAoIXN0eWxlcykgTWFuaXB1bGF0b3IucmVtb3ZlQXR0cmlidXRlKGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3ZlcmZsb3c7IiwiaW1wb3J0IHtpc0VsZW1lbnQsIGlzRW1wdHlPYmosIGlzT2JqZWN0LCBtZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi9tYW5pcHVsYXRvclwiO1xyXG5cclxuY2xhc3MgUGFyYW1zIHtcclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4ge31cclxuXHR9XHJcblxyXG5cdF9nZXRQYXJhbXMocGFyYW1zLCBlbGVtZW50KSB7XHJcblx0XHRwYXJhbXMgPSB0aGlzLl9tZXJnZVBhcmFtc09iaihwYXJhbXMsIGVsZW1lbnQpXHJcblx0XHRwYXJhbXMgPSB0aGlzLl9wYXJhbXNBZnRlck1lcmdlKHBhcmFtcylcclxuXHRcdHJldHVybiBwYXJhbXNcclxuXHR9XHJcblxyXG5cdF9wYXJhbXNBZnRlck1lcmdlKHBhcmFtcykge1xyXG5cdFx0bGV0IHBEZWZhdWx0ID0gdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LFxyXG5cdFx0XHRtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHBEZWZhdWx0LCBwYXJhbXMpO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChtUGFyYW1zKSAmJiAhaXNFbXB0eU9iaihtUGFyYW1zKSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRhdHVtIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSBub3JtYWxpemVEYXRhKG1QYXJhbXNbZGF0dW1dKTtcclxuXHJcblx0XHRcdFx0aWYgKGRhdHVtICE9PSAncGFyYW1zJykge1xyXG5cdFx0XHRcdFx0aWYgKCEoZGF0dW0gaW4gcERlZmF1bHQpKSB7XHJcblx0XHRcdFx0XHRcdGxldCBwID0gZGF0dW0uc3BsaXQoJy0nKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChwRGVmYXVsdFtwWzBdXSAmJiBwWzFdIGluIHBEZWZhdWx0W3BbMF1dKSB7XHJcblx0XHRcdFx0XHRcdFx0cERlZmF1bHRbcFswXV1bcFsxXV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNbZGF0dW1dO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bVBhcmFtc1tkYXR1bV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChtUGFyYW1zLCB2YWx1ZSlcclxuXHRcdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2RhdHVtXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbVBhcmFtcztcclxuXHR9XHJcblxyXG5cdF9tZXJnZVBhcmFtc09iaihwYXJhbXMsIGVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBpc0VsZW1lbnQoZWxlbWVudCkgPyBtZXJnZURlZXBPYmplY3QoTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXMoZWxlbWVudCksIHBhcmFtcykgOiB7fVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBQYXJhbXM7XHJcbiIsImltcG9ydCB7aXNFbGVtZW50fSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNvbnN0IFNlbGVjdG9ycyA9IHtcclxuXHRnZXQoZWwsIGNvbnRhaW5lcikge1xyXG5cdFx0aWYgKCFlbCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ci0L7QstCw0YDQuNGJISDQn9C10YDQstGL0Lkg0L/QsNGA0LDQvNC10YLRgCDQvdC1INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQv9GD0YHRgtGL0LwhJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGxldCBlbG0gPSBpc0VsZW1lbnQoY29udGFpbmVyKSA/IFNlbGVjdG9ycy5maW5kT25lKGVsLCBjb250YWluZXIpIDogU2VsZWN0b3JzLmZpbmRPbmUoZWwpO1xyXG5cdFx0XHRcdGlmIChlbG0pIHJldHVybiBlbG07XHJcblx0XHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ9CQ0YXQv9C10YAhINCd0LUg0YPQtNCw0LvQvtGB0Ywg0L3QsNC50YLQuCDRjdC70LXQvNC10L3RgicpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRWxlbWVudChlbCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZWw7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCfQmtCt0J8hINCa0LDQutCw0Y8t0YLQviDQtNC40YfRjCDQuiDQvdCw0Lwg0LfQsNC70LXRgtC10LvQsCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZmluZEFsbChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIFtdLmNvbmNhdCguLi5FbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpKVxyXG5cdH0sXHJcblxyXG5cdGZpbmRPbmUoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpXHJcblx0fSxcclxuXHJcblx0Z2V0VGFyZ2V0RnJvbVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcblx0XHRsZXQgX3NlbGVjdG9yID0gbnVsbDtcclxuXHJcblx0XHRpZiAoaXNFbGVtZW50KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRfc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRfc2VsZWN0b3IgPSBTZWxlY3RvcnMuZmluZE9uZShzZWxlY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRhcmdldCA9IE1hbmlwdWxhdG9yLmdldEF0dHJpYnV0ZShfc2VsZWN0b3IsJ2hyZWYnKSB8fCBNYW5pcHVsYXRvci5nZXRBdHRyaWJ1dGUoX3NlbGVjdG9yLCdkYXRhLXZnLXRhcmdldCcpIHx8ICcnO1xyXG5cdFx0aWYgKHRhcmdldCkge1xyXG5cdFx0XHRyZXR1cm4gU2VsZWN0b3JzLmZpbmRPbmUodGFyZ2V0KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yczsiLCJpbXBvcnQge2V4ZWN1dGVBZnRlclRyYW5zaXRpb24sIGlzRW1wdHlPYmp9IGZyb20gXCIuLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBQYXJhbXMgZnJvbSBcIi4uL191dGlscy9qcy9wYXJhbXNcIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4uL191dGlscy9qcy9kYXRhXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuXHJcbmNsYXNzIEJhc2VNb2R1bGUgZXh0ZW5kcyBQYXJhbXMge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gbnVsbDtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHJcblx0XHREYXRhLnNldCh0aGlzLmVsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVksIHRoaXMpXHJcblx0fVxyXG5cclxuXHRnZXQgZWxlbWVudCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50XHJcblx0fVxyXG5cclxuXHRzZXQgZWxlbWVudChlbCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudCA9IFNlbGVjdG9ycy5nZXQoZWwpO1xyXG5cdH1cclxuXHJcblx0Z2V0IHBhcmFtcygpIHtcclxuXHRcdHJldHVybiB0aGlzLl9wYXJhbXNcclxuXHR9XHJcblxyXG5cdHNldCBwYXJhbXMocGFyYW1zKSB7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMocGFyYW1zLCB0aGlzLmVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiAnJ1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuICcnXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIERhdGEuZ2V0KFNlbGVjdG9ycy5nZXQoZWxlbWVudCksIHRoaXMuTkFNRV9LRVkpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoZWxlbWVudCkgfHwgbmV3IHRoaXMoZWxlbWVudCwgaXNFbXB0eU9iaihwYXJhbXMpID8gcGFyYW1zIDogbnVsbClcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHREYXRhLnJlbW92ZSh0aGlzLmVsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVkpXHJcblxyXG5cdFx0Zm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcclxuXHRcdFx0dGhpc1twcm9wZXJ0eU5hbWVdID0gbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3F1ZXVlQ2FsbGJhY2soY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQgPSB0cnVlKSB7XHJcblx0XHRleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkKVxyXG5cdH1cclxuXHJcblx0X2Rpc21pc3NFbGVtZW50KCkge1xyXG5cdFx0bGV0IGNyb3NzID0gJzxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiJyArXHJcblx0XHRcdCdcXHQgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMCAxMDA7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj4nICtcclxuXHRcdFx0JzxwYXRoIGQ9XCJNODkuNywxMC4zTDg5LjcsMTAuM2MtMS0xLTIuNi0xLTMuNSwwTDUwLDQ2LjVMMTMuOSwxMC4zYy0xLTEtMi42LTEtMy41LDBsMCwwYy0xLDEtMSwyLjYsMCwzLjVMNDYuNSw1MEwxMC4zLDg2LjEnICtcclxuXHRcdFx0J1xcdGMtMSwxLTEsMi42LDAsMy41aDBjMSwxLDIuNiwxLDMuNSwwTDUwLDUzLjVsMzYuMSwzNi4xYzEsMSwyLjYsMSwzLjUsMGwwLDBjMS0xLDEtMi42LDAtMy41TDUzLjUsNTBsMzYuMS0zNi4xJyArXHJcblx0XHRcdCdcXHRDOTAuNiwxMi45LDkwLjYsMTEuMyw4OS43LDEwLjN6XCIvPicgK1xyXG5cdFx0XHQnPC9zdmc+JyxcclxuXHRcdFx0YnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy52Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRpZiAoYnV0dG9uKSB7XHJcblx0XHRcdGxldCBzdmcgPSBidXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcblx0XHRcdGlmICghc3ZnKSBidXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBjcm9zcyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYXNlTW9kdWxlOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL292ZXJmbG93XCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9ldmVudFwiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWR9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ3ZnU2lkZWJhcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnNpZGViYXInO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFID0gJ3ZnLnNpZGViYXIuaGlkZSc7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSAndmcuc2lkZWJhci5oaWRkZW4nO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyA9ICd2Zy5zaWRlYmFyLnNob3cnO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gPSAndmcuc2lkZWJhci5zaG93bic7XHJcbmNvbnN0IEVWRU5UX0tFWV9MT0FERUQgPSAndmcuc2lkZWJhci5sb2FkZWQnO1xyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gJ2tleWRvd24uZGlzbWlzcy52Zy5zaWRlYmFyJztcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gJ2hpZGVQcmV2ZW50ZWQudmcuc2lkZWJhcic7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9ICdjbGljay52Zy5zaWRlYmFyLmRhdGEuYXBpJztcclxuXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRidXR0b246IG51bGwsXHJcblx0YmFja2Ryb3A6IHRydWUsXHJcblx0b3ZlcmZsb3c6IHRydWUsXHJcblx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHU2lkZWJhciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XHJcblx0XHRyZXR1cm4gUEFSQU1TX0RFRkFVTFRcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1iYWNrZHJvcCcpLCAnbW91c2Vkb3duLnZnLmJhY2tkcm9wJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLmVsZW1lbnQsIHRydWUpXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5lbGVtZW50LCB0cnVlKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFRhcmdldEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1zaWRlYmFyLnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWR1NpZGViYXIuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHU2lkZWJhci5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGNzcyDQutC70LDRgdGB0Ysg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuaW1wb3J0IFwiLi9hcHAvX3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzXCI7XHJcblxyXG4vLyB2Z3NpZGViYXJcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy9zaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3NcIjtcclxuaW1wb3J0IFZHU2lkZWJhciBmcm9tIFwiLi9hcHAvbW9kdWxlcy9zaWRlYmFyL2pzL3Znc2lkZWJhclwiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXJcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=