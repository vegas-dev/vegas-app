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
/* harmony export */   noop: () => (/* binding */ noop),
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



const getSVG = name => {
  const svg = {
    error: '',
    success: '',
    cross: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 224.512 224.512" xml:space="preserve"><g><polygon points="224.507,6.997 217.521,0 112.256,105.258 6.998,0 0.005,6.997 105.263,112.254 0.005,217.512 6.998,224.512 112.256,119.24 217.521,224.512 224.507,217.512 119.249,112.254 "/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>'
  };
  return svg[name] ?? {};
};

/**
 * Enable Dismiss Trigger
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
  get(url, data, callback, async) {
    let query = [];
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_1__.isObject)(data) && !(0,_functions__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(data)) {
      for (let key of data) {
        query.push(encodeURIComponent(key[0]) + '=' + encodeURIComponent(key[1]));
      }
    }
    Ajax.send(url + (query.length ? '?' + query.join('&') : ''), 'GET', null, callback, async);
  },
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
    return this.getInstance(element) || new this(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.isEmptyObj)(params) ? params : null);
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




const NAME = 'dropdown';
const NAME_KEY = 'vg.dropdown';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade-top';
const TARGET_CONTAINER = 'vg-dropdown-content';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="dropdown"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const PARAMS_DEFAULT = {
  offset: [0, 2],
  over: false,
  backdrop: true,
  overflow: true,
  keyboard: true,
  placement: 'bottom',
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
    this._setPlacement();
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
    this.element.setAttribute('aria-expanded', true);
    this.element.classList.add(CLASS_NAME_SHOW);
    this._drop.classList.add(CLASS_NAME_SHOW);
    const completeCallBack = () => {
      this._drop.classList.add(CLASS_NAME_FADE);
      _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this.element, EVENT_KEY_SHOWN, relatedTarget);
    };
    this._queueCallback(completeCallBack, this._drop, true, 50);
  }
  hide() {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this._element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  _isShown() {
    return this.element.classList.contains(CLASS_NAME_SHOW);
  }
  _completeHide(relatedTarget) {
    const hideEvent = _utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDE, relatedTarget);
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
    this._queueCallback(completeCallback, this._drop, true);
  }
  _setPlacement() {
    const _this = this;
    let offset = getOffset(),
      rectElement = this.element.getBoundingClientRect();
    if (offset.length !== 2 || !rectElement) return;
    _this._drop.style.trasform = 'translate(0, 0)';
    const completePlacement = () => {
      if (_this.params.placement === 'bottom') {
        _this._drop.style.inset = '0px auto auto 0px';
        _this._drop.style.transform = 'translate(0, ' + (rectElement.height + offset[1]) + 'px)';
      }
    };
    this._queueCallback(completePlacement, this._drop, true, 50);
    function getOffset() {
      const {
        offset
      } = _this.params;
      if (typeof offset === 'string') {
        return offset.split(',').map(value => Number.parseInt(value, 10));
      }
      return offset;
    }
  }
}
_utils_js_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault();
  VGDropdown.getOrCreateInstance(this).toggle();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGDropdown);

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
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_modules_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/_utils/scss/default.scss */ "./app/_utils/scss/default.scss");
/* harmony import */ var _app_modules_sidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/modules/sidebar/scss/vgsidebar.scss */ "./app/modules/sidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_modules_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/modules/sidebar/js/vgsidebar */ "./app/modules/sidebar/js/vgsidebar.js");
/* harmony import */ var _app_modules_dropdown_scss_vgdropdown_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/modules/dropdown/scss/vgdropdown.scss */ "./app/modules/dropdown/scss/vgdropdown.scss");
/* harmony import */ var _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/modules/dropdown/js/vgdropdown */ "./app/modules/dropdown/js/vgdropdown.js");
// css классы по умолчанию


// vgsidebar



// dropdown



})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBaURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6T0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFPQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2hEQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7O0FDdEtBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvYmFja2Ryb3AuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2RhdGEuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2V2ZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL21hbmlwdWxhdG9yLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9tb2R1bGUtZm4uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL292ZXJmbG93LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9wYXJhbXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvZHJvcGRvd24vanMvdmdkcm9wZG93bi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3NpZGViYXIvanMvdmdzaWRlYmFyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzIiwid2VicGFjazovL3ZnL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmcvLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN1dGUsIGlzRWxlbWVudH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnRcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuL292ZXJmbG93XCI7XHJcblxyXG5jb25zdCBOQU1FID0gJ2JhY2tkcm9wJ1xyXG5jb25zdCBDTEFTU19OQU1FID0gJ3ZnLWJhY2tkcm9wJ1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcclxuY29uc3QgRVZFTlRfTU9VU0VET1dOID0gYG1vdXNlZG93bi52Zy4ke05BTUV9YFxyXG5cclxuY2xhc3MgQmFja2Ryb3Age1xyXG5cdHN0YXRpYyBzaG93KGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fYXBwZW5kKClcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGUoY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9kZXN0cm95KCk7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfYXBwZW5kKCkge1xyXG5cdFx0aWYgKFNlbGVjdG9ycy5maW5kT25lKCcuJyArIENMQVNTX05BTUUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFja2Ryb3ApO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSlcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24oYmFja2Ryb3AsIEVWRU5UX01PVVNFRE9XTiwgKCkgPT4ge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKClcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2Rlc3Ryb3koKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IFNlbGVjdG9ycy5maW5kT25lKCcuJyArIENMQVNTX05BTUUpO1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja2Ryb3A7IiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBkYXRhLmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcblxyXG5jb25zdCBlbGVtZW50TWFwID0gbmV3IE1hcCgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0c2V0KGVsZW1lbnQsIGtleSwgaW5zdGFuY2UpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgbmV3IE1hcCgpKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHRcdGlmICghaW5zdGFuY2VNYXAuaGFzKGtleSkgJiYgaW5zdGFuY2VNYXAuc2l6ZSAhPT0gMCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBWR0FwcCDQvdC1INC00L7Qv9GD0YHQutCw0LXRgiDQsdC+0LvQtdC1INC+0LTQvdC+0LPQviDRjdC60LfQtdC80L/Qu9GP0YDQsCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsC4g0KHQstGP0LfQsNC90L3Ri9C5INGN0LrQt9C10LzQv9C70Y/RgDogJHtBcnJheS5mcm9tKGluc3RhbmNlTWFwLmtleXMoKSlbMF19LmApXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLnNldChrZXksIGluc3RhbmNlKVxyXG5cdH0sXHJcblxyXG5cdGdldChlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmIChlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudE1hcC5nZXQoZWxlbWVudCkuZ2V0KGtleSkgfHwgbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0cmVtb3ZlKGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuZGVsZXRlKGtleSk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlTWFwLnNpemUgPT09IDApIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBldmVudC5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5cclxuY29uc3QgbmFtZXNwYWNlUmVnZXggPSAvW14uXSooPz1cXC4uKilcXC58LiovXHJcbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xyXG5jb25zdCBzdHJpcFVpZFJlZ2V4ID0gLzo6XFxkKyQvXHJcbmNvbnN0IGV2ZW50UmVnaXN0cnkgPSB7fSAvLyBFdmVudHMgc3RvcmFnZVxyXG5sZXQgdWlkRXZlbnQgPSAxXHJcbmNvbnN0IGN1c3RvbUV2ZW50cyA9IHtcclxuXHRtb3VzZWVudGVyOiAnbW91c2VvdmVyJyxcclxuXHRtb3VzZWxlYXZlOiAnbW91c2VvdXQnXHJcbn1cclxuXHJcbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xyXG5cdCdjbGljaycsXHJcblx0J2RibGNsaWNrJyxcclxuXHQnbW91c2V1cCcsXHJcblx0J21vdXNlZG93bicsXHJcblx0J2NvbnRleHRtZW51JyxcclxuXHQnbW91c2V3aGVlbCcsXHJcblx0J0RPTU1vdXNlU2Nyb2xsJyxcclxuXHQnbW91c2VvdmVyJyxcclxuXHQnbW91c2VvdXQnLFxyXG5cdCdtb3VzZW1vdmUnLFxyXG5cdCdzZWxlY3RzdGFydCcsXHJcblx0J3NlbGVjdGVuZCcsXHJcblx0J2tleWRvd24nLFxyXG5cdCdrZXlwcmVzcycsXHJcblx0J2tleXVwJyxcclxuXHQnb3JpZW50YXRpb25jaGFuZ2UnLFxyXG5cdCd0b3VjaHN0YXJ0JyxcclxuXHQndG91Y2htb3ZlJyxcclxuXHQndG91Y2hlbmQnLFxyXG5cdCd0b3VjaGNhbmNlbCcsXHJcblx0J3BvaW50ZXJkb3duJyxcclxuXHQncG9pbnRlcm1vdmUnLFxyXG5cdCdwb2ludGVydXAnLFxyXG5cdCdwb2ludGVybGVhdmUnLFxyXG5cdCdwb2ludGVyY2FuY2VsJyxcclxuXHQnZ2VzdHVyZXN0YXJ0JyxcclxuXHQnZ2VzdHVyZWNoYW5nZScsXHJcblx0J2dlc3R1cmVlbmQnLFxyXG5cdCdmb2N1cycsXHJcblx0J2JsdXInLFxyXG5cdCdjaGFuZ2UnLFxyXG5cdCdyZXNldCcsXHJcblx0J3NlbGVjdCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2ZvY3VzaW4nLFxyXG5cdCdmb2N1c291dCcsXHJcblx0J2xvYWQnLFxyXG5cdCd1bmxvYWQnLFxyXG5cdCdiZWZvcmV1bmxvYWQnLFxyXG5cdCdyZXNpemUnLFxyXG5cdCdtb3ZlJyxcclxuXHQnRE9NQ29udGVudExvYWRlZCcsXHJcblx0J3JlYWR5c3RhdGVjaGFuZ2UnLFxyXG5cdCdlcnJvcicsXHJcblx0J2Fib3J0JyxcclxuXHQnc2Nyb2xsJ1xyXG5dKVxyXG5cclxuLyoqXHJcbiAqIFByaXZhdGUgbWV0aG9kc1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1ha2VFdmVudFVpZChlbGVtZW50LCB1aWQpIHtcclxuXHRyZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChlbGVtZW50KVxyXG5cclxuXHRlbGVtZW50LnVpZEV2ZW50ID0gdWlkXHJcblx0ZXZlbnRSZWdpc3RyeVt1aWRdID0gZXZlbnRSZWdpc3RyeVt1aWRdIHx8IHt9XHJcblxyXG5cdHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiBlbGVtZW50IH0pXHJcblxyXG5cdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgZm4pXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIFtldmVudF0pXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgZG9tRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcblxyXG5cdFx0Zm9yIChsZXQgeyB0YXJnZXQgfSA9IGV2ZW50OyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSB0aGlzOyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRvbUVsZW1lbnQgb2YgZG9tRWxlbWVudHMpIHtcclxuXHRcdFx0XHRpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogdGFyZ2V0IH0pXHJcblxyXG5cdFx0XHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBzZWxlY3RvciwgZm4pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkodGFyZ2V0LCBbZXZlbnRdKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kSGFuZGxlcihldmVudHMsIGNhbGxhYmxlLCBkZWxlZ2F0aW9uU2VsZWN0b3IgPSBudWxsKSB7XHJcblx0cmV0dXJuIE9iamVjdC52YWx1ZXMoZXZlbnRzKVxyXG5cdFx0LmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRjb25zdCBpc0RlbGVnYXRlZCA9IHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJ1xyXG5cdC8vIFRPRE86IHRvb2x0aXAgcGFzc2VzIGBmYWxzZWAgaW5zdGVhZCBvZiBzZWxlY3Rvciwgc28gd2UgbmVlZCB0byBjaGVja1xyXG5cdGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0bGV0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChvcmlnaW5hbFR5cGVFdmVudClcclxuXHJcblx0aWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcclxuXHRcdHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIG9uZU9mZikge1xyXG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cclxuXHQvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXHJcblx0Ly8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXHJcblx0aWYgKG9yaWdpbmFsVHlwZUV2ZW50IGluIGN1c3RvbUV2ZW50cykge1xyXG5cdFx0Y29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYWJsZSA9IHdyYXBGdW5jdGlvbihjYWxsYWJsZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxyXG5cdGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblxyXG5cdGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XHJcblx0XHRwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxyXG5cclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXHJcblx0Y29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XHJcblx0XHRib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjYWxsYWJsZSkgOlxyXG5cdFx0Ym9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcclxuXHJcblx0Zm4uZGVsZWdhdGlvblNlbGVjdG9yID0gaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbFxyXG5cdGZuLmNhbGxhYmxlID0gY2FsbGFibGVcclxuXHRmbi5vbmVPZmYgPSBvbmVPZmZcclxuXHRmbi51aWRFdmVudCA9IHVpZFxyXG5cdGhhbmRsZXJzW3VpZF0gPSBmblxyXG5cclxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgaXNEZWxlZ2F0ZWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3Rvcikge1xyXG5cdGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcclxuXHJcblx0aWYgKCFmbikge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxyXG5cdGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcclxuXHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblxyXG5cdGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR5cGVFdmVudChldmVudCkge1xyXG5cdC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcclxuXHRldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxyXG5cdHJldHVybiBjdXN0b21FdmVudHNbZXZlbnRdIHx8IGV2ZW50XHJcbn1cclxuXHJcbmNvbnN0IEV2ZW50SGFuZGxlciA9IHtcclxuXHRvbihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIGZhbHNlKVxyXG5cdH0sXHJcblxyXG5cdG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIHRydWUpXHJcblx0fSxcclxuXHJcblx0b2ZmKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0XHRjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHRcdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRcdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHRcdGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly8gU2ltcGxlc3QgY2FzZTogaGFuZGxlciBpcyBwYXNzZWQsIHJlbW92ZSB0aGF0IGxpc3RlbmVyIE9OTFkuXHJcblx0XHRcdGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFtZXNwYWNlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcclxuXHRcdFx0XHRyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBba2V5SGFuZGxlcnMsIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdFx0Y29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXHJcblxyXG5cdFx0XHRpZiAoIWluTmFtZXNwYWNlIHx8IG9yaWdpbmFsVHlwZUV2ZW50LmluY2x1ZGVzKGhhbmRsZXJLZXkpKSB7XHJcblx0XHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXIoZWxlbWVudCwgZXZlbnQsIGFyZ3MpIHtcclxuXHRcdGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGJ1YmJsZXMgPSB0cnVlO1xyXG5cdFx0bGV0IG5hdGl2ZURpc3BhdGNoID0gdHJ1ZTtcclxuXHRcdGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3QgZXZ0ID0gaHlkcmF0ZU9iaihuZXcgRXZlbnQoZXZlbnQsIHsgYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSB9KSwgYXJncylcclxuXHJcblx0XHRpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuYXRpdmVEaXNwYXRjaCkge1xyXG5cdFx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBldnRcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcclxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhtZXRhKSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0b2JqW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb2JqXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlclxyXG4iLCIvKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0VsZW1lbnRcclxuICogQHBhcmFtIG9iamVjdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XHJcblx0aWYgKCFpc09iamVjdChvYmplY3QpKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdHJldHVybiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xyXG59XHJcblxyXG4vKipcclxuICogaXNEaXNhYmxlZFxyXG4gKiBAcGFyYW0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRGlzYWJsZWQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGVsZW1lbnQuZGlzYWJsZWQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVmlzaWJsZSAoZWxlbWVudCkge1xyXG5cdGlmICghaXNFbGVtZW50KGVsZW1lbnQpIHx8IGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPT09IDApIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZWxlbWVudElzVmlzaWJsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgndmlzaWJpbGl0eScpID09PSAndmlzaWJsZSdcclxuXHRjb25zdCBjbG9zZWREZXRhaWxzID0gZWxlbWVudC5jbG9zZXN0KCdkZXRhaWxzOm5vdChbb3Blbl0pJylcclxuXHJcblx0aWYgKCFjbG9zZWREZXRhaWxzKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG5cdH1cclxuXHJcblx0aWYgKGNsb3NlZERldGFpbHMgIT09IGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHN1bW1hcnkgPSBlbGVtZW50LmNsb3Nlc3QoJ3N1bW1hcnknKVxyXG5cdFx0aWYgKHN1bW1hcnkgJiYgc3VtbWFyeS5wYXJlbnROb2RlICE9PSBjbG9zZWREZXRhaWxzKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzdW1tYXJ5ID09PSBudWxsKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzT2JqZWN0XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcclxuXHRyZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstC+0LTQuNC8INCyINC/0L7RgNGP0LTQvtC6INGC0LjQv9GLINC00LDQvdC90YvRhVxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHJldHVybnMge2FueX1cclxuICovXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGEodmFsdWUpICB7XHJcblx0aWYgKHZhbHVlID09PSAndHJ1ZScpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSBOdW1iZXIodmFsdWUpLnRvU3RyaW5nKCkpIHtcclxuXHRcdHJldHVybiBOdW1iZXIodmFsdWUpXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnbnVsbCcpIHtcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG5cclxuXHR0cnkge1xyXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcclxuXHR9IGNhdGNoIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCj0LTQsNC70Y/QtdC8INGN0LvQtdC80LXQvdGC0Ysg0YEg0LzQsNGB0YHQuNCy0LBcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcGFyYW0gZWxcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRBcnJheShhcnIsIGVsKSB7XHJcblx0cmV0dXJuIGFyci5maWx0ZXIoKGl0ZW0pID0+ICFlbC5pbmNsdWRlcyhpdGVtKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQk9C70YPQsdC+0LrQvtC1INC+0LHRitC10LTQuNC90LXQvdC40LUg0L7QsdGK0LXQutGC0L7QslxyXG4gKiBAcGFyYW0gb2JqZWN0c1xyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIG1lcmdlRGVlcE9iamVjdCguLi5vYmplY3RzKSB7XHJcblx0Y29uc3QgaXNPYmplY3QgPSBvYmogPT4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xyXG5cclxuXHRyZXR1cm4gb2JqZWN0cy5yZWR1Y2UoKHByZXYsIG9iaikgPT4ge1xyXG5cdFx0T2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcblx0XHRcdGNvbnN0IHBWYWwgPSBwcmV2W2tleV07XHJcblx0XHRcdGNvbnN0IG9WYWwgPSBvYmpba2V5XTtcclxuXHJcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBWYWwpICYmIEFycmF5LmlzQXJyYXkob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBwVmFsLmNvbmNhdCguLi5vVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChpc09iamVjdChwVmFsKSAmJiBpc09iamVjdChvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG1lcmdlRGVlcE9iamVjdChwVmFsLCBvVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBvVmFsO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcHJldjtcclxuXHR9LCB7fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFja1xyXG4gKiBAcGFyYW0gcG9zc2libGVDYWxsYmFja1xyXG4gKiBAcGFyYW0gYXJnc1xyXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gZXhlY3V0ZShwb3NzaWJsZUNhbGxiYWNrLCBhcmdzID0gW10sIGRlZmF1bHRWYWx1ZSA9IHBvc3NpYmxlQ2FsbGJhY2spIHtcclxuXHRyZXR1cm4gdHlwZW9mIHBvc3NpYmxlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBwb3NzaWJsZUNhbGxiYWNrKC4uLmFyZ3MpIDogZGVmYXVsdFZhbHVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2l0aW9uXHJcbiAqIEBwYXJhbSBjYWxsYmFja1xyXG4gKiBAcGFyYW0gdHJhbnNpdGlvbkVsZW1lbnRcclxuICogQHBhcmFtIHdhaXRGb3JUcmFuc2l0aW9uXHJcbiAqL1xyXG5jb25zdCBUUkFOU0lUSU9OX0VORCA9ICd0cmFuc2l0aW9uZW5kJztcclxuY29uc3QgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwO1xyXG5cclxuZnVuY3Rpb24gZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiAoY2FsbGJhY2ssIHRyYW5zaXRpb25FbGVtZW50LCB3YWl0Rm9yVHJhbnNpdGlvbiA9IHRydWUsIHRpbWVPdXRNcykge1xyXG5cdGlmICghd2FpdEZvclRyYW5zaXRpb24pIHtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGNvbnN0IGR1cmF0aW9uUGFkZGluZyA9IDVcclxuXHRjb25zdCBlbXVsYXRlZER1cmF0aW9uID0gdGltZU91dE1zID8gdGltZU91dE1zIDogZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQodHJhbnNpdGlvbkVsZW1lbnQpICsgZHVyYXRpb25QYWRkaW5nO1xyXG5cclxuXHRsZXQgY2FsbGVkID0gZmFsc2VcclxuXHJcblx0Y29uc3QgaGFuZGxlciA9ICh7IHRhcmdldCB9KSA9PiB7XHJcblx0XHRpZiAodGFyZ2V0ICE9PSB0cmFuc2l0aW9uRWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsZWQgPSB0cnVlXHJcblx0XHR0cmFuc2l0aW9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHR9XHJcblxyXG5cdHRyYW5zaXRpb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRpZiAoIWNhbGxlZCkge1xyXG5cdFx0XHR0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRWxlbWVudClcclxuXHRcdH1cclxuXHR9LCBlbXVsYXRlZER1cmF0aW9uKVxyXG59XHJcblxyXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIEdldCB0cmFuc2l0aW9uLWR1cmF0aW9uIG9mIHRoZSBlbGVtZW50XHJcblx0bGV0IHsgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uRGVsYXkgfSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXHJcblxyXG5cdGNvbnN0IGZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKVxyXG5cdGNvbnN0IGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KVxyXG5cclxuXHQvLyBSZXR1cm4gMCBpZiBlbGVtZW50IG9yIHRyYW5zaXRpb24gZHVyYXRpb24gaXMgbm90IGZvdW5kXHJcblx0aWYgKCFmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiAmJiAhZmxvYXRUcmFuc2l0aW9uRGVsYXkpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBJZiBtdWx0aXBsZSBkdXJhdGlvbnMgYXJlIGRlZmluZWQsIHRha2UgdGhlIGZpcnN0XHJcblx0dHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KCcsJylbMF1cclxuXHR0cmFuc2l0aW9uRGVsYXkgPSB0cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywnKVswXVxyXG5cclxuXHRyZXR1cm4gKE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbikgKyBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpKSAqIE1JTExJU0VDT05EU19NVUxUSVBMSUVSXHJcbn1cclxuXHJcbmNvbnN0IHRyaWdnZXJUcmFuc2l0aW9uRW5kID0gZWxlbWVudCA9PiB7XHJcblx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChUUkFOU0lUSU9OX0VORCkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBOb29wXHJcbiAqL1xyXG5jb25zdCBub29wID0gKCkgPT4ge307XHJcblxyXG5leHBvcnQge2lzRWxlbWVudCwgaXNWaXNpYmxlLCBpc0Rpc2FibGVkLCBpc09iamVjdCwgaXNFbXB0eU9iaiwgbWVyZ2VEZWVwT2JqZWN0LCByZW1vdmVFbGVtZW50QXJyYXksIG5vcm1hbGl6ZURhdGEsIGV4ZWN1dGUsIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sIG5vb3B9IiwiaW1wb3J0IHtpc0VsZW1lbnQsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5cclxuLyoqXHJcbiAqINCc0LDQvdC40L/Rg9C70Y/RhtC40Lgg0YEg0Y3Qu9C10LzQtdC90YLQvtC8XHJcbiAqL1xyXG5jb25zdCBNYW5pcHVsYXRvciA9IHtcclxuXHRnZXREYXRhQXR0cmlidXRlcyhlbGVtZW50LCBpc1JlbW92ZURhdGFOYW1lID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBlbG1CYXNlID0gWydkYXRhLXZnLXRvZ2dsZScsICdkYXRhLXZnLXRhcmdldCcsICdkYXRhLXZnLWRpc21pc3MnXSxcclxuXHRcdFx0YXR0cmlidXRlcz0ge30sXHJcblx0XHRcdGFyciA9IFtdLmZpbHRlci5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24gKGF0KSB7XHJcblx0XHRcdFx0cmV0dXJuIC9eZGF0YS0vLnRlc3QoYXQubmFtZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdGlmIChhcnIubGVuZ3RoKSB7XHJcblx0XHRcdGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdFx0bGV0IG5hbWUgPSB2Lm5hbWU7XHJcblxyXG5cdFx0XHRcdGlmICghZWxtQmFzZS5pbmNsdWRlcyhuYW1lKSkge1xyXG5cdFx0XHRcdFx0aWYgKGlzUmVtb3ZlRGF0YU5hbWUpIG5hbWUgPSBuYW1lLnNsaWNlKDUpO1xyXG5cdFx0XHRcdFx0YXR0cmlidXRlc1tuYW1lXSA9IG5vcm1hbGl6ZURhdGEodi52YWx1ZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhdHRyaWJ1dGVzXHJcblx0fSxcclxuXHJcblx0Z2V0QXR0cmlidXRlOiBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50ICYmICFuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vcm1hbGl6ZURhdGEoZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZUF0dHJpYnV0ZTogZnVuY3Rpb24gKGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdGlmIChpc0VsZW1lbnQoZWxlbWVudCkgJiYgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuaXB1bGF0b3J9XHJcbiIsImltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnRcIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBpc0VtcHR5T2JqLCBpc09iamVjdH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4vc2VsZWN0b3JzXCI7XHJcblxyXG5jb25zdCBnZXRTVkcgPSAobmFtZSkgPT4ge1xyXG5cdGNvbnN0IHN2ZyA9ICB7XHJcblx0XHRlcnJvcjogJycsXHJcblx0XHRzdWNjZXNzOiAnJyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICogRW5hYmxlIERpc21pc3MgVHJpZ2dlclxyXG4gKiBAcGFyYW0gbW9kdWxlXHJcbiAqIEBwYXJhbSBtZXRob2RcclxuICovXHJcbmNvbnN0IGRpc21pc3NUcmlnZ2VyID0gKG1vZHVsZSwgbWV0aG9kID0gJ2hpZGUnKSA9PiB7XHJcblx0Y29uc3QgY2xpY2tFdmVudCA9IGBjbGljay5kaXNtaXNzLiR7bW9kdWxlLkVWRU5UX0tFWX1gXHJcblx0Y29uc3QgbmFtZSA9IG1vZHVsZS5OQU1FO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIGNsaWNrRXZlbnQsIGBbZGF0YS12Zy1kaXNtaXNzPVwiJHtuYW1lfVwiXWAsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFRhcmdldEZyb21TZWxlY3Rvcih0aGlzKSB8fCB0aGlzLmNsb3Nlc3QoYC52Zy0ke25hbWV9YClcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gbW9kdWxlLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cclxuXHRcdGluc3RhbmNlW21ldGhvZF0oKVxyXG5cdH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBSkFYIFJFUVVFU1RcclxuICogQHR5cGUge3twb3N0OiBhamF4LnBvc3QsIGdldDogYWpheC5nZXQsIHg6ICgoZnVuY3Rpb24oKTogKFhNTEh0dHBSZXF1ZXN0KSl8KiksIHNlbmQ6IGFqYXguc2VuZH19XHJcbiAqL1xyXG5jb25zdCBBamF4ID0ge1xyXG5cdHgoKSB7XHJcblx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHZlcnNpb25zID0gW1xyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjYuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjUuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjQuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjMuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjIuMFwiLFxyXG5cdFx0XHRcIk1pY3Jvc29mdC5YbWxIdHRwXCJcclxuXHRcdF0sIHhocjtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZlcnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0eGhyID0gbmV3IEFjdGl2ZVhPYmplY3QodmVyc2lvbnNbaV0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB4aHI7XHJcblx0fSxcclxuXHJcblx0c2VuZCh1cmwsIG1ldGhvZCwgZGF0YSwgY2FsbGJhY2ssIGFzeW5jKSB7XHJcblx0XHRpZiAoYXN5bmMgPT09IHVuZGVmaW5lZCkgYXN5bmMgPSB0cnVlO1xyXG5cclxuXHRcdGxldCB4ID0gQWpheC54KCk7XHJcblx0XHR4Lm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jKTtcclxuXHRcdHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeC5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0c3dpdGNoICh4LnN0YXR1cykge1xyXG5cdFx0XHRcdFx0Y2FzZSAyMDA6XHJcblx0XHRcdFx0XHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFsnc3VjY2VzcycsIHgucmVzcG9uc2VUZXh0XSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0ZXhlY3V0ZShjYWxsYmFjaywgWydlcnJvcicsIHguc3RhdHVzVGV4dF0pO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHguc2VuZChkYXRhKTtcclxuXHR9LFxyXG5cclxuXHRnZXQodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSAmJiAhaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRBamF4LnNlbmQodXJsICsgKHF1ZXJ5Lmxlbmd0aCA/ICc/JyArIHF1ZXJ5LmpvaW4oJyYnKSA6ICcnKSwgJ0dFVCcsIG51bGwsIGNhbGxiYWNrLCBhc3luYylcclxuXHR9LFxyXG5cclxuXHRwb3N0KHVybCwgZGF0YSwgY2FsbGJhY2ssIGFzeW5jKSB7XHJcblx0XHRBamF4LnNlbmQodXJsLCBjYWxsYmFjaywgJ1BPU1QnLCBkYXRhLCBhc3luYylcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQge1xyXG5cdGRpc21pc3NUcmlnZ2VyLCBBamF4LCBnZXRTVkdcclxufSIsImltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuL21hbmlwdWxhdG9yXCI7XHJcblxyXG5jbGFzcyBPdmVyZmxvdyB7XHJcblx0c3RhdGljIGFwcGVuZCgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcblx0XHRsZXQgc3R5bGVzID0gTWFuaXB1bGF0b3IuZ2V0QXR0cmlidXRlKGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdFx0aWYgKCFzdHlsZXMpIE1hbmlwdWxhdG9yLnJlbW92ZUF0dHJpYnV0ZShkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJmbG93OyIsImltcG9ydCB7aXNFbGVtZW50LCBpc0VtcHR5T2JqLCBpc09iamVjdCwgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIFBhcmFtcyB7XHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIHt9XHJcblx0fVxyXG5cclxuXHRfZ2V0UGFyYW1zKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0cGFyYW1zID0gdGhpcy5fbWVyZ2VQYXJhbXNPYmoocGFyYW1zLCBlbGVtZW50KVxyXG5cdFx0cGFyYW1zID0gdGhpcy5fcGFyYW1zQWZ0ZXJNZXJnZShwYXJhbXMpXHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cclxuXHRfcGFyYW1zQWZ0ZXJNZXJnZShwYXJhbXMpIHtcclxuXHRcdGxldCBwRGVmYXVsdCA9IHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCxcclxuXHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwRGVmYXVsdCwgcGFyYW1zKTtcclxuXHJcblx0XHRpZiAoaXNPYmplY3QobVBhcmFtcykgJiYgIWlzRW1wdHlPYmoobVBhcmFtcykpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBkYXR1bSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gbm9ybWFsaXplRGF0YShtUGFyYW1zW2RhdHVtXSk7XHJcblxyXG5cdFx0XHRcdGlmIChkYXR1bSAhPT0gJ3BhcmFtcycpIHtcclxuXHRcdFx0XHRcdGlmICghKGRhdHVtIGluIHBEZWZhdWx0KSkge1xyXG5cdFx0XHRcdFx0XHRsZXQgcCA9IGRhdHVtLnNwbGl0KCctJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocERlZmF1bHRbcFswXV0gJiYgcFsxXSBpbiBwRGVmYXVsdFtwWzBdXSkge1xyXG5cdFx0XHRcdFx0XHRcdHBEZWZhdWx0W3BbMF1dW3BbMV1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2RhdHVtXTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1QYXJhbXNbZGF0dW1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QobVBhcmFtcywgdmFsdWUpXHJcblx0XHRcdFx0XHRkZWxldGUgbVBhcmFtc1tkYXR1bV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG1QYXJhbXM7XHJcblx0fVxyXG5cclxuXHRfbWVyZ2VQYXJhbXNPYmoocGFyYW1zLCBlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gaXNFbGVtZW50KGVsZW1lbnQpID8gbWVyZ2VEZWVwT2JqZWN0KE1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQpLCBwYXJhbXMpIDoge31cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgUGFyYW1zO1xyXG4iLCJpbXBvcnQge2lzRWxlbWVudH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG5jb25zdCBwYXJzZVNlbGVjdG9yID0gc2VsZWN0b3IgPT4ge1xyXG5cdGlmIChzZWxlY3RvciAmJiB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1MuZXNjYXBlKSB7XHJcblx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyMoW15cXHNcIiMnXSspL2csIChtYXRjaCwgaWQpID0+IGAjJHtDU1MuZXNjYXBlKGlkKX1gKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcbn1cclxuXHJcbmNvbnN0IGdldFNlbGVjdG9yID0gZWxlbWVudCA9PiB7XHJcblx0bGV0IHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmctdGFyZ2V0JylcclxuXHJcblx0aWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcblx0XHRsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcclxuXHRcdGlmICghaHJlZkF0dHJpYnV0ZSB8fCAoIWhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcuJykpKSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcjJykpIHtcclxuXHRcdFx0aHJlZkF0dHJpYnV0ZSA9IGAjJHtocmVmQXR0cmlidXRlLnNwbGl0KCcjJylbMV19YFxyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGxcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvciA/IHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKHNlbCA9PiBwYXJzZVNlbGVjdG9yKHNlbCkpLmpvaW4oJywnKSA6IG51bGxcclxufVxyXG5cclxuY29uc3QgU2VsZWN0b3JzID0ge1xyXG5cdGdldChlbCwgY29udGFpbmVyKSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcign0KLQvtCy0LDRgNC40YkhINCf0LXRgNCy0YvQuSDQv9Cw0YDQsNC80LXRgtGAINC90LUg0LTQvtC70LbQtdC9INCx0YvRgtGMINC/0YPRgdGC0YvQvCEnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0bGV0IGVsbSA9IGlzRWxlbWVudChjb250YWluZXIpID8gU2VsZWN0b3JzLmZpbmRPbmUoZWwsIGNvbnRhaW5lcikgOiBTZWxlY3RvcnMuZmluZE9uZShlbCk7XHJcblx0XHRcdFx0aWYgKGVsbSkgcmV0dXJuIGVsbTtcclxuXHRcdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcign0JDRhdC/0LXRgCEg0J3QtSDRg9C00LDQu9C+0YHRjCDQvdCw0LnRgtC4INGN0LvQtdC80LXQvdGCJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAoaXNFbGVtZW50KGVsKSkge1xyXG5cdFx0XHRcdHJldHVybiBlbDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ca0K3QnyEg0JrQsNC60LDRjy3RgtC+INC00LjRh9GMINC6INC90LDQvCDQt9Cw0LvQtdGC0LXQu9CwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmaW5kQWxsKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChlbGVtZW50LCBzZWxlY3RvcikpXHJcblx0fSxcclxuXHJcblx0ZmluZE9uZShzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3RvcilcclxuXHR9LFxyXG5cclxuXHRnZXRUYXJnZXRGcm9tU2VsZWN0b3Ioc2VsZWN0b3IpIHtcclxuXHRcdGxldCBfc2VsZWN0b3IgPSBudWxsO1xyXG5cclxuXHRcdGlmIChpc0VsZW1lbnQoc2VsZWN0b3IpKSB7XHJcblx0XHRcdF9zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdF9zZWxlY3RvciA9IFNlbGVjdG9ycy5maW5kT25lKHNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGFyZ2V0ID0gZ2V0U2VsZWN0b3IoX3NlbGVjdG9yKTtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm4gbnVsbDtcclxuXHJcblx0XHRsZXQgX3RhcmdldFNlbGVjdG9yID0gU2VsZWN0b3JzLmZpbmRPbmUodGFyZ2V0KTtcclxuXHRcdGlmIChfdGFyZ2V0U2VsZWN0b3IpIHJldHVybiAgX3RhcmdldFNlbGVjdG9yO1xyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JzOyIsImltcG9ydCB7ZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFBhcmFtcyBmcm9tIFwiLi4vX3V0aWxzL2pzL3BhcmFtc1wiO1xyXG5pbXBvcnQgRGF0YSBmcm9tIFwiLi4vX3V0aWxzL2pzL2RhdGFcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtBamF4LCBnZXRTVkd9IGZyb20gXCIuLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcblxyXG5jbGFzcyBCYXNlTW9kdWxlIGV4dGVuZHMgUGFyYW1zIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudCA9IG51bGw7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHJcblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cdFx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblxyXG5cdFx0RGF0YS5zZXQodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZLCB0aGlzKVxyXG5cdH1cclxuXHJcblx0Z2V0IGVsZW1lbnQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudFxyXG5cdH1cclxuXHJcblx0c2V0IGVsZW1lbnQoZWwpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBTZWxlY3RvcnMuZ2V0KGVsKTtcclxuXHR9XHJcblxyXG5cdGdldCBwYXJhbXMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcGFyYW1zXHJcblx0fVxyXG5cclxuXHRzZXQgcGFyYW1zKHBhcmFtcykge1xyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKHBhcmFtcywgdGhpcy5lbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gJydcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiAnJ1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEluc3RhbmNlKGVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBEYXRhLmdldChTZWxlY3RvcnMuZ2V0KGVsZW1lbnQpLCB0aGlzLk5BTUVfS0VZKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHJldHVybiB0aGlzLmdldEluc3RhbmNlKGVsZW1lbnQpIHx8IG5ldyB0aGlzKGVsZW1lbnQsIGlzRW1wdHlPYmoocGFyYW1zKSA/IHBhcmFtcyA6IG51bGwpXHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0RGF0YS5yZW1vdmUodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZKVxyXG5cclxuXHRcdGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHRoaXNbcHJvcGVydHlOYW1lXSA9IG51bGxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yb3V0ZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmhhc093blByb3BlcnR5KCdhamF4JykpIHtcclxuXHRcdFx0aWYgKCd0YXJnZXQnIGluIF90aGlzLnBhcmFtcy5hamF4ICYmIF90aGlzLnBhcmFtcy5hamF4LnRhcmdldCkge1xyXG5cdFx0XHRcdGxldCAkY29udGVudCA9IFNlbGVjdG9ycy5maW5kT25lKF90aGlzLnBhcmFtcy5hamF4LnRhcmdldCk7XHJcblx0XHRcdFx0aWYgKCRjb250ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoJ3JvdXRlJyBpbiBfdGhpcy5wYXJhbXMuYWpheCAmJiBfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSkge1xyXG5cdFx0XHRcdFx0XHRBamF4LmdldChfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSwge30sIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRzZXREYXRhKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLmVsZW1lbnQsIF90aGlzLk5BTUVfS0VZICsgJy5sb2FkZWQnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcclxuXHRcdFx0XHRcdCRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2Rpc21pc3NFbGVtZW50KCkge1xyXG5cdFx0bGV0IGNyb3NzID0gZ2V0U1ZHKCdjcm9zcycpLFxyXG5cdFx0XHRidXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZnLWJ0bi1jbG9zZScpO1xyXG5cclxuXHRcdGlmIChidXR0b24pIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuXHRcdFx0aWYgKCFzdmcpIGJ1dHRvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNyb3NzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9xdWV1ZUNhbGxiYWNrKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0XHRleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkLCB0aW1lT3V0TXMpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBub29wfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5cclxuY29uc3QgTkFNRSAgICAgICAgICAgICA9ICdkcm9wZG93bic7XHJcbmNvbnN0IE5BTUVfS0VZICAgICAgICAgPSAndmcuZHJvcGRvd24nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgID0gJ2ZhZGUtdG9wJztcclxuY29uc3QgVEFSR0VUX0NPTlRBSU5FUiA9ICd2Zy1kcm9wZG93bi1jb250ZW50JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUICAgICA9IHtcclxuXHRvZmZzZXQ6IFswLCAyXSxcclxuXHRvdmVyOiBmYWxzZSxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cdGFqYXg6IHtcclxuXHRcdHJvdXRlOiAnJyxcclxuXHRcdHRhcmdldDogJydcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWR0Ryb3Bkb3duIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnROb2RlO1xyXG5cdFx0dGhpcy5fZHJvcCA9IFNlbGVjdG9ycy5nZXQoJy4nICsgVEFSR0VUX0NPTlRBSU5FUiwgdGhpcy5fcGFyZW50KTtcclxuXHRcdHRoaXMuX3NldFBsYWNlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIFBBUkFNU19ERUZBVUxUXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNTaG93bigpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKTtcclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLmVsZW1lbnQpIHx8IHRoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRoaXMuZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSB8fCAhdGhpcy5faXNTaG93bigpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLl9lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSwgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTiwgcmVsYXRlZFRhcmdldCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2Ryb3AsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0X3NldFBsYWNlbWVudCgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGxldCBvZmZzZXQgPSBnZXRPZmZzZXQoKSxcclxuXHRcdFx0cmVjdEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0aWYgKG9mZnNldC5sZW5ndGggIT09IDIgfHwgIXJlY3RFbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhc2Zvcm0gPSAndHJhbnNsYXRlKDAsIDApJztcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZVBsYWNlbWVudCA9ICgpID0+IHtcclxuXHRcdFx0aWYgKF90aGlzLnBhcmFtcy5wbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUuaW5zZXQgICAgICA9ICcwcHggYXV0byBhdXRvIDBweCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtICA9ICd0cmFuc2xhdGUoMCwgJysgKHJlY3RFbGVtZW50LmhlaWdodCArIG9mZnNldFsxXSkgKydweCknO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZVBsYWNlbWVudCwgdGhpcy5fZHJvcCwgdHJ1ZSwgNTApO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdldE9mZnNldCgpIHtcclxuXHRcdFx0Y29uc3QgeyBvZmZzZXQgfSA9IF90aGlzLnBhcmFtcztcclxuXHJcblx0XHRcdGlmICh0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdHJldHVybiBvZmZzZXQuc3BsaXQoJywnKS5tYXAodmFsdWUgPT4gTnVtYmVyLnBhcnNlSW50KHZhbHVlLCAxMCkpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBvZmZzZXQ7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0VkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKHRoaXMpLnRvZ2dsZSgpO1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdEcm9wZG93bjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9vdmVyZmxvd1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL21vZHVsZS1mblwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdzaWRlYmFyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuc2lkZWJhcic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCJdJ1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY29uc3QgUEFSQU1TX0RFRkFVTFQgPSAge1xyXG5cdGJ1dHRvbjogbnVsbCxcclxuXHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRrZXlib2FyZDogdHJ1ZSxcclxuXHRhamF4OiB7XHJcblx0XHRyb3V0ZTogJycsXHJcblx0XHR0YXJnZXQ6ICcnXHJcblx0fVxyXG59O1xyXG5cclxuY2xhc3MgVkdTaWRlYmFyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLmVsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihTZWxlY3RvcnMuZmluZE9uZSgnLnZnLWJhY2tkcm9wJyksICdtb3VzZWRvd24udmcuYmFja2Ryb3AnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5lbGVtZW50LCB0cnVlKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWR1NpZGViYXIpXHJcblxyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRUYXJnZXRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kT25lKCcudmctc2lkZWJhci5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VkdTaWRlYmFyLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWR1NpZGViYXIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcylcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHU2lkZWJhcjtcclxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBjc3Mg0LrQu9Cw0YHRgdGLINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbmltcG9ydCBcIi4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2Nzc1wiO1xyXG5cclxuLy8gdmdzaWRlYmFyXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvc2lkZWJhci9qcy92Z3NpZGViYXJcIjtcclxuXHJcbi8vIGRyb3Bkb3duXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3NcIjtcclxuaW1wb3J0IFZHRHJvcGRvd24gZnJvbSBcIi4vYXBwL21vZHVsZXMvZHJvcGRvd24vanMvdmdkcm9wZG93blwiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXIsIFZHRHJvcGRvd25cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=