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
  hasAttribute: function (element, nameAttribute) {
    return element.hasAttribute(nameAttribute);
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
    dots: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',
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
        if (!_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.hasAttribute(this, 'aria-expanded')) {
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
// css классы по умолчанию


// vgsidebar



// dropdown



// modal



// nav


function onReady() {
  [...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (element) {
    _app_modules_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"].init(element, {});
  });
  [...document.querySelectorAll('.vg-nav')].forEach(function (element) {
    _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_8__["default"].init(element, {});
  });
}
document.addEventListener('DOMContentLoaded', onReady);

})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBaURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6T0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDeEdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDaERBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUM3RUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7O0FDcmZBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2JhY2tkcm9wLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9kYXRhLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9ldmVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvZnVuY3Rpb25zLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9tYW5pcHVsYXRvci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvbW9kdWxlLWZuLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9vdmVyZmxvdy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvcGFyYW1zLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9wbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3Jlc3BvbnNpdmUuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvZHJvcGRvd24vanMvdmdkcm9wZG93bi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL21vZGFsL2pzL3ZnbW9kYWwuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9zaWRlYmFyL2pzL3Znc2lkZWJhci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3MiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9zaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3MiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3MiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY3V0ZSwgaXNFbGVtZW50fSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4vb3ZlcmZsb3dcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSAnYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUUgPSAndmctYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xyXG5jb25zdCBFVkVOVF9NT1VTRURPV04gPSBgbW91c2Vkb3duLnZnLiR7TkFNRX1gXHJcblxyXG5jbGFzcyBCYWNrZHJvcCB7XHJcblx0c3RhdGljIHNob3coY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9hcHBlbmQoKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZShjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2Rlc3Ryb3koKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9hcHBlbmQoKSB7XHJcblx0XHRpZiAoU2VsZWN0b3JzLmZpbmRPbmUoJy4nICsgQ0xBU1NfTkFNRSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChiYWNrZHJvcCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdFx0fSwgNTApO1xyXG5cclxuXHRcdEV2ZW50SGFuZGxlci5vbihiYWNrZHJvcCwgRVZFTlRfTU9VU0VET1dOLCAoKSA9PiB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoKVxyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfZGVzdHJveSgpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmRPbmUoJy4nICsgQ0xBU1NfTkFNRSk7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdH0sIDUwMCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWNrZHJvcDsiLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGRhdGEuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuXHJcbmNvbnN0IGVsZW1lbnRNYXAgPSBuZXcgTWFwKClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRzZXQoZWxlbWVudCwga2V5LCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRlbGVtZW50TWFwLnNldChlbGVtZW50LCBuZXcgTWFwKCkpXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cdFx0aWYgKCFpbnN0YW5jZU1hcC5oYXMoa2V5KSAmJiBpbnN0YW5jZU1hcC5zaXplICE9PSAwKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFZHQXBwINC90LUg0LTQvtC/0YPRgdC60LDQtdGCINCx0L7Qu9C10LUg0L7QtNC90L7Qs9C+INGN0LrQt9C10LzQv9C70Y/RgNCwINC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwLiDQodCy0Y/Qt9Cw0L3QvdGL0Lkg0Y3QutC30LXQvNC/0LvRj9GAOiAke0FycmF5LmZyb20oaW5zdGFuY2VNYXAua2V5cygpKVswXX0uYClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuc2V0KGtleSwgaW5zdGFuY2UpXHJcblx0fSxcclxuXHJcblx0Z2V0KGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKGVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50TWFwLmdldChlbGVtZW50KS5nZXQoa2V5KSB8fCBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHJcblx0XHRpbnN0YW5jZU1hcC5kZWxldGUoa2V5KTtcclxuXHJcblx0XHRpZiAoaW5zdGFuY2VNYXAuc2l6ZSA9PT0gMCkge1xyXG5cdFx0XHRlbGVtZW50TWFwLmRlbGV0ZShlbGVtZW50KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGV2ZW50LmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcblxyXG5jb25zdCBuYW1lc3BhY2VSZWdleCA9IC9bXi5dKig/PVxcLi4qKVxcLnwuKi9cclxuY29uc3Qgc3RyaXBOYW1lUmVnZXggPSAvXFwuLiovXHJcbmNvbnN0IHN0cmlwVWlkUmVnZXggPSAvOjpcXGQrJC9cclxuY29uc3QgZXZlbnRSZWdpc3RyeSA9IHt9IC8vIEV2ZW50cyBzdG9yYWdlXHJcbmxldCB1aWRFdmVudCA9IDFcclxuY29uc3QgY3VzdG9tRXZlbnRzID0ge1xyXG5cdG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLFxyXG5cdG1vdXNlbGVhdmU6ICdtb3VzZW91dCdcclxufVxyXG5cclxuY29uc3QgbmF0aXZlRXZlbnRzID0gbmV3IFNldChbXHJcblx0J2NsaWNrJyxcclxuXHQnZGJsY2xpY2snLFxyXG5cdCdtb3VzZXVwJyxcclxuXHQnbW91c2Vkb3duJyxcclxuXHQnY29udGV4dG1lbnUnLFxyXG5cdCdtb3VzZXdoZWVsJyxcclxuXHQnRE9NTW91c2VTY3JvbGwnLFxyXG5cdCdtb3VzZW92ZXInLFxyXG5cdCdtb3VzZW91dCcsXHJcblx0J21vdXNlbW92ZScsXHJcblx0J3NlbGVjdHN0YXJ0JyxcclxuXHQnc2VsZWN0ZW5kJyxcclxuXHQna2V5ZG93bicsXHJcblx0J2tleXByZXNzJyxcclxuXHQna2V5dXAnLFxyXG5cdCdvcmllbnRhdGlvbmNoYW5nZScsXHJcblx0J3RvdWNoc3RhcnQnLFxyXG5cdCd0b3VjaG1vdmUnLFxyXG5cdCd0b3VjaGVuZCcsXHJcblx0J3RvdWNoY2FuY2VsJyxcclxuXHQncG9pbnRlcmRvd24nLFxyXG5cdCdwb2ludGVybW92ZScsXHJcblx0J3BvaW50ZXJ1cCcsXHJcblx0J3BvaW50ZXJsZWF2ZScsXHJcblx0J3BvaW50ZXJjYW5jZWwnLFxyXG5cdCdnZXN0dXJlc3RhcnQnLFxyXG5cdCdnZXN0dXJlY2hhbmdlJyxcclxuXHQnZ2VzdHVyZWVuZCcsXHJcblx0J2ZvY3VzJyxcclxuXHQnYmx1cicsXHJcblx0J2NoYW5nZScsXHJcblx0J3Jlc2V0JyxcclxuXHQnc2VsZWN0JyxcclxuXHQnc3VibWl0JyxcclxuXHQnZm9jdXNpbicsXHJcblx0J2ZvY3Vzb3V0JyxcclxuXHQnbG9hZCcsXHJcblx0J3VubG9hZCcsXHJcblx0J2JlZm9yZXVubG9hZCcsXHJcblx0J3Jlc2l6ZScsXHJcblx0J21vdmUnLFxyXG5cdCdET01Db250ZW50TG9hZGVkJyxcclxuXHQncmVhZHlzdGF0ZWNoYW5nZScsXHJcblx0J2Vycm9yJyxcclxuXHQnYWJvcnQnLFxyXG5cdCdzY3JvbGwnXHJcbl0pXHJcblxyXG4vKipcclxuICogUHJpdmF0ZSBtZXRob2RzXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xyXG5cdHJldHVybiAodWlkICYmIGAke3VpZH06OiR7dWlkRXZlbnQrK31gKSB8fCBlbGVtZW50LnVpZEV2ZW50IHx8IHVpZEV2ZW50KytcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KSB7XHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGVsZW1lbnQpXHJcblxyXG5cdGVsZW1lbnQudWlkRXZlbnQgPSB1aWRcclxuXHRldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cclxuXHJcblx0cmV0dXJuIGV2ZW50UmVnaXN0cnlbdWlkXVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcclxuXHJcblx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIHNlbGVjdG9yLCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcclxuXHJcblx0XHRmb3IgKGxldCB7IHRhcmdldCB9ID0gZXZlbnQ7IHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xyXG5cdFx0XHRcdGlmIChkb21FbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiB0YXJnZXQgfSlcclxuXHJcblx0XHRcdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0YXJnZXQsIFtldmVudF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRIYW5kbGVyKGV2ZW50cywgY2FsbGFibGUsIGRlbGVnYXRpb25TZWxlY3RvciA9IG51bGwpIHtcclxuXHRyZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXHJcblx0XHQuZmluZChldmVudCA9PiBldmVudC5jYWxsYWJsZSA9PT0gY2FsbGFibGUgJiYgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yID09PSBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdGNvbnN0IGlzRGVsZWdhdGVkID0gdHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnXHJcblx0Ly8gVE9ETzogdG9vbHRpcCBwYXNzZXMgYGZhbHNlYCBpbnN0ZWFkIG9mIHNlbGVjdG9yLCBzbyB3ZSBuZWVkIHRvIGNoZWNrXHJcblx0Y29uc3QgY2FsbGFibGUgPSBpc0RlbGVnYXRlZCA/IGRlbGVnYXRpb25GdW5jdGlvbiA6IChoYW5kbGVyIHx8IGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHRsZXQgdHlwZUV2ZW50ID0gZ2V0VHlwZUV2ZW50KG9yaWdpbmFsVHlwZUV2ZW50KVxyXG5cclxuXHRpZiAoIW5hdGl2ZUV2ZW50cy5oYXModHlwZUV2ZW50KSkge1xyXG5cdFx0dHlwZUV2ZW50ID0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHR9XHJcblxyXG5cdHJldHVybiBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhhbmRsZXIoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgb25lT2ZmKSB7XHJcblx0aWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0bGV0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblxyXG5cdC8vIGluIGNhc2Ugb2YgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlIHdyYXAgdGhlIGhhbmRsZXIgd2l0aGluIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgZm9yIGl0cyBET00gcG9zaXRpb25cclxuXHQvLyB0aGlzIHByZXZlbnRzIHRoZSBoYW5kbGVyIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0aGUgc2FtZSB3YXkgYXMgbW91c2VvdmVyIG9yIG1vdXNlb3V0IGRvZXNcclxuXHRpZiAob3JpZ2luYWxUeXBlRXZlbnQgaW4gY3VzdG9tRXZlbnRzKSB7XHJcblx0XHRjb25zdCB3cmFwRnVuY3Rpb24gPSBmbiA9PiB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgKGV2ZW50LnJlbGF0ZWRUYXJnZXQgIT09IGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmICFldmVudC5kZWxlZ2F0ZVRhcmdldC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxhYmxlID0gd3JhcEZ1bmN0aW9uKGNhbGxhYmxlKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxyXG5cdGNvbnN0IGhhbmRsZXJzID0gZXZlbnRzW3R5cGVFdmVudF0gfHwgKGV2ZW50c1t0eXBlRXZlbnRdID0ge30pXHJcblx0Y29uc3QgcHJldmlvdXNGdW5jdGlvbiA9IGZpbmRIYW5kbGVyKGhhbmRsZXJzLCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHJcblx0aWYgKHByZXZpb3VzRnVuY3Rpb24pIHtcclxuXHRcdHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmID0gcHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgJiYgb25lT2ZmXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoY2FsbGFibGUsIG9yaWdpbmFsVHlwZUV2ZW50LnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSlcclxuXHRjb25zdCBmbiA9IGlzRGVsZWdhdGVkID9cclxuXHRcdGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIGNhbGxhYmxlKSA6XHJcblx0XHRib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGNhbGxhYmxlKVxyXG5cclxuXHRmbi5kZWxlZ2F0aW9uU2VsZWN0b3IgPSBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsXHJcblx0Zm4uY2FsbGFibGUgPSBjYWxsYWJsZVxyXG5cdGZuLm9uZU9mZiA9IG9uZU9mZlxyXG5cdGZuLnVpZEV2ZW50ID0gdWlkXHJcblx0aGFuZGxlcnNbdWlkXSA9IGZuXHJcblxyXG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBpc0RlbGVnYXRlZClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKSB7XHJcblx0Y29uc3QgZm4gPSBmaW5kSGFuZGxlcihldmVudHNbdHlwZUV2ZW50XSwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cclxuXHRpZiAoIWZuKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBCb29sZWFuKGRlbGVnYXRpb25TZWxlY3RvcikpXHJcblx0ZGVsZXRlIGV2ZW50c1t0eXBlRXZlbnRdW2ZuLnVpZEV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIG5hbWVzcGFjZSkge1xyXG5cdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHJcblx0Zm9yIChjb25zdCBbaGFuZGxlcktleSwgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xyXG5cdFx0aWYgKGhhbmRsZXJLZXkuaW5jbHVkZXMobmFtZXNwYWNlKSkge1xyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHlwZUV2ZW50KGV2ZW50KSB7XHJcblx0Ly8gYWxsb3cgdG8gZ2V0IHRoZSBuYXRpdmUgZXZlbnRzIGZyb20gbmFtZXNwYWNlZCBldmVudHMgKCdjbGljay5icy5idXR0b24nIC0tPiAnY2xpY2snKVxyXG5cdGV2ZW50ID0gZXZlbnQucmVwbGFjZShzdHJpcE5hbWVSZWdleCwgJycpXHJcblx0cmV0dXJuIGN1c3RvbUV2ZW50c1tldmVudF0gfHwgZXZlbnRcclxufVxyXG5cclxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xyXG5cdG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgZmFsc2UpXHJcblx0fSxcclxuXHJcblx0b25lKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgdHJ1ZSlcclxuXHR9LFxyXG5cclxuXHRvZmYoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHRcdGNvbnN0IGluTmFtZXNwYWNlID0gdHlwZUV2ZW50ICE9PSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdFx0Y29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxyXG5cdFx0Y29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxyXG5cdFx0Y29uc3QgaXNOYW1lc3BhY2UgPSBvcmlnaW5hbFR5cGVFdmVudC5zdGFydHNXaXRoKCcuJylcclxuXHJcblx0XHRpZiAodHlwZW9mIGNhbGxhYmxlICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHQvLyBTaW1wbGVzdCBjYXNlOiBoYW5kbGVyIGlzIHBhc3NlZCwgcmVtb3ZlIHRoYXQgbGlzdGVuZXIgT05MWS5cclxuXHRcdFx0aWYgKCFPYmplY3Qua2V5cyhzdG9yZUVsZW1lbnRFdmVudCkubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNOYW1lc3BhY2UpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50RXZlbnQgb2YgT2JqZWN0LmtleXMoZXZlbnRzKSkge1xyXG5cdFx0XHRcdHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIGVsZW1lbnRFdmVudCwgb3JpZ2luYWxUeXBlRXZlbnQuc2xpY2UoMSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IFtrZXlIYW5kbGVycywgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xyXG5cdFx0XHRjb25zdCBoYW5kbGVyS2V5ID0ga2V5SGFuZGxlcnMucmVwbGFjZShzdHJpcFVpZFJlZ2V4LCAnJylcclxuXHJcblx0XHRcdGlmICghaW5OYW1lc3BhY2UgfHwgb3JpZ2luYWxUeXBlRXZlbnQuaW5jbHVkZXMoaGFuZGxlcktleSkpIHtcclxuXHRcdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcihlbGVtZW50LCBldmVudCwgYXJncykge1xyXG5cdFx0aWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYnViYmxlcyA9IHRydWU7XHJcblx0XHRsZXQgbmF0aXZlRGlzcGF0Y2ggPSB0cnVlO1xyXG5cdFx0bGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdCBldnQgPSBoeWRyYXRlT2JqKG5ldyBFdmVudChldmVudCwgeyBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlIH0pLCBhcmdzKVxyXG5cclxuXHRcdGlmIChkZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hdGl2ZURpc3BhdGNoKSB7XHJcblx0XHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGV2dFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gaHlkcmF0ZU9iaihvYmosIG1ldGEgPSB7fSkge1xyXG5cdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGEpKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRvYmpba2V5XSA9IHZhbHVlXHJcblx0XHR9IGNhdGNoIHtcclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGdldCgpIHtcclxuXHRcdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBvYmpcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXHJcbiIsIi8qKlxyXG4gKiDQldGB0LvQuCDRh9GC0L4t0L3QuNCx0YPQtNGMINCyINC+0LHRitC10LrRgtC1XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xyXG5cdGZvciAobGV0IHByb3AgaW4gb2JqKSB7XHJcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRWxlbWVudFxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gb2JqZWN0ID0+IHtcclxuXHRpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHR5cGVvZiBvYmplY3Qubm9kZVR5cGUgIT09ICd1bmRlZmluZWQnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0Rpc2FibGVkXHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmRpc2FibGVkXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09ICdmYWxzZSdcclxufVxyXG5cclxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtZW50KSB7XHJcblx0aWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRjb25zdCBlbGVtZW50SXNWaXNpYmxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xyXG5cdGNvbnN0IGNsb3NlZERldGFpbHMgPSBlbGVtZW50LmNsb3Nlc3QoJ2RldGFpbHM6bm90KFtvcGVuXSknKVxyXG5cclxuXHRpZiAoIWNsb3NlZERldGFpbHMpIHtcclxuXHRcdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcblx0fVxyXG5cclxuXHRpZiAoY2xvc2VkRGV0YWlscyAhPT0gZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXHJcblx0XHRpZiAoc3VtbWFyeSAmJiBzdW1tYXJ5LnBhcmVudE5vZGUgIT09IGNsb3NlZERldGFpbHMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN1bW1hcnkgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG59XHJcblxyXG4vKipcclxuICogaXNPYmplY3RcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG5cdHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0L7QtNC40Lwg0LIg0L/QvtGA0Y/QtNC+0Log0YLQuNC/0Ysg0LTQsNC90L3Ri9GFXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkgIHtcclxuXHRpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xyXG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdH0gY2F0Y2gge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YLRiyDRgSDQvNCw0YHRgdC40LLQsFxyXG4gKiBAcGFyYW0gYXJyXHJcbiAqIEBwYXJhbSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudEFycmF5KGFyciwgZWwpIHtcclxuXHRyZXR1cm4gYXJyLmZpbHRlcigoaXRlbSkgPT4gIWVsLmluY2x1ZGVzKGl0ZW0pKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCT0LvRg9Cx0L7QutC+0LUg0L7QsdGK0LXQtNC40L3QtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyXHJcbiAqIEBwYXJhbSBvYmplY3RzXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VEZWVwT2JqZWN0KC4uLm9iamVjdHMpIHtcclxuXHRjb25zdCBpc09iamVjdCA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcblxyXG5cdHJldHVybiBvYmplY3RzLnJlZHVjZSgocHJldiwgb2JqKSA9PiB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0Y29uc3QgcFZhbCA9IHByZXZba2V5XTtcclxuXHRcdFx0Y29uc3Qgb1ZhbCA9IG9ialtrZXldO1xyXG5cclxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocFZhbCkgJiYgQXJyYXkuaXNBcnJheShvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IHBWYWwuY29uY2F0KC4uLm9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGlzT2JqZWN0KHBWYWwpICYmIGlzT2JqZWN0KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gbWVyZ2VEZWVwT2JqZWN0KHBWYWwsIG9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG9WYWw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwcmV2O1xyXG5cdH0sIHt9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrXHJcbiAqIEBwYXJhbSBwb3NzaWJsZUNhbGxiYWNrXHJcbiAqIEBwYXJhbSBhcmdzXHJcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWVcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBleGVjdXRlKHBvc3NpYmxlQ2FsbGJhY2ssIGFyZ3MgPSBbXSwgZGVmYXVsdFZhbHVlID0gcG9zc2libGVDYWxsYmFjaykge1xyXG5cdHJldHVybiB0eXBlb2YgcG9zc2libGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IHBvc3NpYmxlQ2FsbGJhY2soLi4uYXJncykgOiBkZWZhdWx0VmFsdWVcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zaXRpb25cclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uRWxlbWVudFxyXG4gKiBAcGFyYW0gd2FpdEZvclRyYW5zaXRpb25cclxuICovXHJcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnO1xyXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDA7XHJcblxyXG5mdW5jdGlvbiBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uIChjYWxsYmFjaywgdHJhbnNpdGlvbkVsZW1lbnQsIHdhaXRGb3JUcmFuc2l0aW9uID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0aWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxyXG5cdGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSB0aW1lT3V0TXMgPyB0aW1lT3V0TXMgOiBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmc7XHJcblxyXG5cdGxldCBjYWxsZWQgPSBmYWxzZVxyXG5cclxuXHRjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcclxuXHRcdGlmICh0YXJnZXQgIT09IHRyYW5zaXRpb25FbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxlZCA9IHRydWVcclxuXHRcdHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdH1cclxuXHJcblx0dHJhbnNpdGlvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdGlmICghY2FsbGVkKSB7XHJcblx0XHRcdHRyaWdnZXJUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25FbGVtZW50KVxyXG5cdFx0fVxyXG5cdH0sIGVtdWxhdGVkRHVyYXRpb24pXHJcbn1cclxuXHJcbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcclxuXHRsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXHJcblxyXG5cdC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcclxuXHRpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcclxuXHR0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxyXG5cdHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXHJcblxyXG5cdHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcclxufVxyXG5cclxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcclxuXHRlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbmV4cG9ydCB7aXNFbGVtZW50LCBpc1Zpc2libGUsIGlzRGlzYWJsZWQsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YSwgZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgbm9vcH0iLCJpbXBvcnQge2lzRWxlbWVudCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDRjdC70LXQvNC10L3RgtC+0LxcclxuICovXHJcbmNvbnN0IE1hbmlwdWxhdG9yID0ge1xyXG5cdGdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsbUJhc2UgPSBbJ2RhdGEtdmctdG9nZ2xlJywgJ2RhdGEtdmctdGFyZ2V0JywgJ2RhdGEtdmctZGlzbWlzcyddLFxyXG5cdFx0XHRhdHRyaWJ1dGVzPSB7fSxcclxuXHRcdFx0YXJyID0gW10uZmlsdGVyLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gL15kYXRhLS8udGVzdChhdC5uYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0YXJyLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuXHRcdFx0XHRsZXQgbmFtZSA9IHYubmFtZTtcclxuXHJcblx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRpZiAoaXNSZW1vdmVEYXRhTmFtZSkgbmFtZSA9IG5hbWUuc2xpY2UoNSk7XHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzW25hbWVdID0gbm9ybWFsaXplRGF0YSh2LnZhbHVlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGF0dHJpYnV0ZXNcclxuXHR9LFxyXG5cclxuXHRoYXNBdHRyaWJ1dGU6IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0fSxcclxuXHJcblx0Z2V0QXR0cmlidXRlOiBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50ICYmICFuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vcm1hbGl6ZURhdGEoZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZUF0dHJpYnV0ZTogZnVuY3Rpb24gKGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdGlmIChpc0VsZW1lbnQoZWxlbWVudCkgJiYgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuaXB1bGF0b3J9XHJcbiIsImltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnRcIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBpc0VtcHR5T2JqLCBpc09iamVjdH0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4vc2VsZWN0b3JzXCI7XHJcblxyXG5jb25zdCBnZXRTVkcgPSAobmFtZSkgPT4ge1xyXG5cdGNvbnN0IHN2ZyA9ICB7XHJcblx0XHRlcnJvcjogJycsXHJcblx0XHRzdWNjZXNzOiAnJyxcclxuXHRcdGRvdHM6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJiaSBiaS10aHJlZS1kb3RzLXZlcnRpY2FsXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOS41IDEzYTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHpcIi8+PC9zdmc+JyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICogRW5hYmxlIERpc21pc3MgVHJpZ2dlclxyXG4gKiBAcGFyYW0gbW9kdWxlXHJcbiAqIEBwYXJhbSBtZXRob2RcclxuICovXHJcbmNvbnN0IGRpc21pc3NUcmlnZ2VyID0gKG1vZHVsZSwgbWV0aG9kID0gJ2hpZGUnKSA9PiB7XHJcblx0Y29uc3QgY2xpY2tFdmVudCA9IGBjbGljay5kaXNtaXNzLiR7bW9kdWxlLkVWRU5UX0tFWX1gXHJcblx0Y29uc3QgbmFtZSA9IG1vZHVsZS5OQU1FO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIGNsaWNrRXZlbnQsIGBbZGF0YS12Zy1kaXNtaXNzPVwiJHtuYW1lfVwiXWAsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFRhcmdldEZyb21TZWxlY3Rvcih0aGlzKSB8fCB0aGlzLmNsb3Nlc3QoYC52Zy0ke25hbWV9YClcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gbW9kdWxlLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cclxuXHRcdGluc3RhbmNlW21ldGhvZF0oKVxyXG5cdH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBSkFYIFJFUVVFU1RcclxuICogQHR5cGUge3twb3N0OiBhamF4LnBvc3QsIGdldDogYWpheC5nZXQsIHg6ICgoZnVuY3Rpb24oKTogKFhNTEh0dHBSZXF1ZXN0KSl8KiksIHNlbmQ6IGFqYXguc2VuZH19XHJcbiAqL1xyXG5jb25zdCBBamF4ID0ge1xyXG5cdHgoKSB7XHJcblx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHZlcnNpb25zID0gW1xyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjYuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjUuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjQuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjMuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjIuMFwiLFxyXG5cdFx0XHRcIk1pY3Jvc29mdC5YbWxIdHRwXCJcclxuXHRcdF0sIHhocjtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZlcnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0eGhyID0gbmV3IEFjdGl2ZVhPYmplY3QodmVyc2lvbnNbaV0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB4aHI7XHJcblx0fSxcclxuXHJcblx0c2VuZCh1cmwsIG1ldGhvZCwgZGF0YSwgY2FsbGJhY2ssIGFzeW5jKSB7XHJcblx0XHRpZiAoYXN5bmMgPT09IHVuZGVmaW5lZCkgYXN5bmMgPSB0cnVlO1xyXG5cclxuXHRcdGxldCB4ID0gQWpheC54KCk7XHJcblx0XHR4Lm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jKTtcclxuXHRcdHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeC5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0c3dpdGNoICh4LnN0YXR1cykge1xyXG5cdFx0XHRcdFx0Y2FzZSAyMDA6XHJcblx0XHRcdFx0XHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFsnc3VjY2VzcycsIHgucmVzcG9uc2VUZXh0XSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0ZXhlY3V0ZShjYWxsYmFjaywgWydlcnJvcicsIHguc3RhdHVzVGV4dF0pO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHguc2VuZChkYXRhKTtcclxuXHR9LFxyXG5cclxuXHRnZXQodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSAmJiAhaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRBamF4LnNlbmQodXJsICsgKHF1ZXJ5Lmxlbmd0aCA/ICc/JyArIHF1ZXJ5LmpvaW4oJyYnKSA6ICcnKSwgJ0dFVCcsIG51bGwsIGNhbGxiYWNrLCBhc3luYylcclxuXHR9LFxyXG5cclxuXHRwb3N0KHVybCwgZGF0YSwgY2FsbGJhY2ssIGFzeW5jKSB7XHJcblx0XHRBamF4LnNlbmQodXJsLCBjYWxsYmFjaywgJ1BPU1QnLCBkYXRhLCBhc3luYylcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQge1xyXG5cdGRpc21pc3NUcmlnZ2VyLCBBamF4LCBnZXRTVkdcclxufSIsImltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuL21hbmlwdWxhdG9yXCI7XHJcblxyXG5jbGFzcyBPdmVyZmxvdyB7XHJcblx0c3RhdGljIGFwcGVuZCgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcblx0XHRsZXQgc3R5bGVzID0gTWFuaXB1bGF0b3IuZ2V0QXR0cmlidXRlKGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdFx0aWYgKCFzdHlsZXMpIE1hbmlwdWxhdG9yLnJlbW92ZUF0dHJpYnV0ZShkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJmbG93OyIsImltcG9ydCB7aXNFbGVtZW50LCBpc0VtcHR5T2JqLCBpc09iamVjdCwgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIFBhcmFtcyB7XHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIHt9XHJcblx0fVxyXG5cclxuXHRfZ2V0UGFyYW1zKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0cGFyYW1zID0gdGhpcy5fbWVyZ2VQYXJhbXNPYmoocGFyYW1zLCBlbGVtZW50KVxyXG5cdFx0cGFyYW1zID0gdGhpcy5fcGFyYW1zQWZ0ZXJNZXJnZShwYXJhbXMpXHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cclxuXHRfcGFyYW1zQWZ0ZXJNZXJnZShwYXJhbXMpIHtcclxuXHRcdGxldCBwRGVmYXVsdCA9IHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCxcclxuXHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwRGVmYXVsdCwgcGFyYW1zKTtcclxuXHJcblx0XHRpZiAoaXNPYmplY3QobVBhcmFtcykgJiYgIWlzRW1wdHlPYmoobVBhcmFtcykpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBkYXR1bSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gbm9ybWFsaXplRGF0YShtUGFyYW1zW2RhdHVtXSk7XHJcblxyXG5cdFx0XHRcdGlmIChkYXR1bSAhPT0gJ3BhcmFtcycpIHtcclxuXHRcdFx0XHRcdGlmICghKGRhdHVtIGluIHBEZWZhdWx0KSkge1xyXG5cdFx0XHRcdFx0XHRsZXQgcCA9IGRhdHVtLnNwbGl0KCctJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocERlZmF1bHRbcFswXV0gJiYgcFsxXSBpbiBwRGVmYXVsdFtwWzBdXSkge1xyXG5cdFx0XHRcdFx0XHRcdHBEZWZhdWx0W3BbMF1dW3BbMV1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2RhdHVtXTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1QYXJhbXNbZGF0dW1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QobVBhcmFtcywgdmFsdWUpXHJcblx0XHRcdFx0XHRkZWxldGUgbVBhcmFtc1tkYXR1bV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG1QYXJhbXM7XHJcblx0fVxyXG5cclxuXHRfbWVyZ2VQYXJhbXNPYmoocGFyYW1zLCBlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gaXNFbGVtZW50KGVsZW1lbnQpID8gbWVyZ2VEZWVwT2JqZWN0KE1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQpLCBwYXJhbXMpIDoge31cclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgUGFyYW1zO1xyXG4iLCJpbXBvcnQge21lcmdlRGVlcE9iamVjdCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4vZnVuY3Rpb25zXCI7XHJcblxyXG5jbGFzcyBQbGFjZW1lbnQge1xyXG5cdGNvbnN0cnVjdG9yKGFyZyA9IHt9KSB7XHJcblx0XHR0aGlzLnBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGVsZW1lbnQ6IG51bGwsXHJcblx0XHRcdGRyb3A6IG51bGxcclxuXHRcdH0sIGFyZyk7XHJcblx0fVxyXG5cclxuXHRfZ2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Y29uc3QgX3BhcmVudCA9IChzZWxmKSA9PiB7XHJcblx0XHRcdGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudE5vZGUsXHJcblx0XHRcdFx0b3ZlcmZsb3cgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCkub3ZlcmZsb3c7XHJcblxyXG5cdFx0XHRpZiAocGFyZW50LnRhZ05hbWUgIT09ICdCT0RZJykge1xyXG5cdFx0XHRcdGlmIChvdmVyZmxvdyA9PT0gJ3Zpc2libGUnKSB7XHJcblx0XHRcdFx0XHRfcGFyZW50KHBhcmVudClcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXNGaXhlZCA9IGZhbHNlLCB0b3AsIGxlZnQsXHJcblx0XHRcdGJvdW5kcyA9IF90aGlzLnBhcmFtcy5kcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRwYXJlbnQgPSBfdGhpcy5wYXJhbXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRpZiAoX3BhcmVudChfdGhpcy5wYXJhbXMuZWxlbWVudCkpIHtcclxuXHRcdFx0aXNGaXhlZCA9IHRydWU7XHJcblx0XHRcdHRvcCA9IGJvdW5kcy50b3A7XHJcblx0XHRcdGxlZnQgPSBib3VuZHMubGVmdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKF90aGlzLnBhcmFtcy5kcm9wKTtcclxuXHRcdFx0dG9wID0gbm9ybWFsaXplRGF0YShzdHlsZXMudG9wLnNsaWNlKDAsIC0yKSk7XHJcblx0XHRcdGxlZnQgPSBub3JtYWxpemVEYXRhKHN0eWxlcy5sZWZ0LnNsaWNlKDAsIC0yKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKChib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCkgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHRsZWZ0ID0gcGFyZW50LndpZHRoIC0gYm91bmRzLndpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlzRml4ZWQ6IGlzRml4ZWQsXHJcblx0XHRcdHRvcDogdG9wLFxyXG5cdFx0XHRsZWZ0OiBsZWZ0XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGFjZW1lbnQ7IiwiY2xhc3MgUmVzcG9uc2l2ZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmJyZWFrcG9pbnRzID0ge1xyXG5cdFx0XHR4czogMCxcclxuXHRcdFx0c206IDU3NixcclxuXHRcdFx0bWQ6IDc2OCxcclxuXHRcdFx0bGc6IDk5MixcclxuXHRcdFx0eGw6IDEyMDAsXHJcblx0XHRcdHh4bDogMTQwMCxcclxuXHRcdFx0eHh4bDogMTYwMCxcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQldGB0LvQuCDQvdCw0YjQsCDRiNC40YDQuNC90LAg0Y3QutGA0LDQvdCwINGB0L7QstC/0LDQtNCw0LXRgiDRgSDQtNC40LDQv9Cw0LfQvtC90L7QvCDQutC+0YLQvtGA0YvQuSDRg9C60LDQt9Cw0L0g0LIg0LzQvtC00YPQu9C1INCy0YvQtNCw0LXQvCB0cnVlLCDQuNC90LDRh9C1IGZhbHNlXHJcblx0ICogQHBhcmFtIG1vZHVsZVxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVjayhtb2R1bGUpIHtcclxuXHRcdGxldCBpbnN0YW5jZSA9IG5ldyB0aGlzIDtcclxuXHRcdHJldHVybiBpbnN0YW5jZS5kZWZpbmUobW9kdWxlKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtCy0LXRgNGP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC4gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQv9GA0LDQstC40LvRjNC90L4sINC90LDQtNC+INGB0LTQtdC70LDRgtGMINC/0L4t0LTRgNGD0LPQvtC80YNcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRzdGF0aWMgY2hlY2tNb2JpbGVPclRhYmxldCgpIHtcclxuXHRcdGxldCBjaGVjayA9IGZhbHNlO1xyXG5cdFx0KGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0aWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm98YW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaS50ZXN0KGEpfHwvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc2xpY2UoMCw0KSkpe1xyXG5cdFx0XHRcdGNoZWNrID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSkobmF2aWdhdG9yLnVzZXJBZ2VudHx8bmF2aWdhdG9yLnZlbmRvcnx8d2luZG93Lm9wZXJhKTtcclxuXHJcblx0XHRyZXR1cm4gY2hlY2s7XHJcblx0fVxyXG5cclxuXHRkZWZpbmUobW9kdWxlKSB7XHJcblx0XHRsZXQgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCxcclxuXHRcdFx0cmVzcG9uc2l2ZV9zaXplID0gdGhpcy5fY2hlY2tSZXNwb25zaXZlQ2xhc3MobW9kdWxlKSxcclxuXHRcdFx0YnJlYWtwb2ludHMgPSB0aGlzLmJyZWFrcG9pbnRzLFxyXG5cdFx0XHRwb2ludCA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5maW5kKGtleSA9PiBicmVha3BvaW50c1trZXldID09PSByZXNwb25zaXZlX3NpemUpO1xyXG5cclxuXHRcdGxldCBrZXlzID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLFxyXG5cdFx0XHRsb2MgPSBrZXlzLmluZGV4T2YocG9pbnQpO1xyXG5cclxuXHRcdHJldHVybiB3aW5kb3dXaWR0aCA+PSBicmVha3BvaW50c1trZXlzW2xvYyArIDFdXTtcclxuXHR9XHJcblxyXG5cdF9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gbW9kdWxlLmVsZW1lbnQsXHJcblx0XHRcdHBhcmFtcyA9IG1vZHVsZS5wYXJhbXMsXHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gMDtcclxuXHJcblx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhYTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnh4eGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhYTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuTEcpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5sZztcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuTUQpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5tZDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuU00pKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5zbTtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFMpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54cztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54cztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY3VycmVudF9yZXNwb25zaXZlX3NpemVcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNpdmU7IiwiaW1wb3J0IHtpc0VsZW1lbnR9IGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xyXG5cclxuY29uc3QgcGFyc2VTZWxlY3RvciA9IHNlbGVjdG9yID0+IHtcclxuXHRpZiAoc2VsZWN0b3IgJiYgd2luZG93LkNTUyAmJiB3aW5kb3cuQ1NTLmVzY2FwZSkge1xyXG5cdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8jKFteXFxzXCIjJ10rKS9nLCAobWF0Y2gsIGlkKSA9PiBgIyR7Q1NTLmVzY2FwZShpZCl9YClcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvclxyXG59XHJcblxyXG5jb25zdCBnZXRTZWxlY3RvciA9IGVsZW1lbnQgPT4ge1xyXG5cdGxldCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXZnLXRhcmdldCcpXHJcblxyXG5cdGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09ICcjJykge1xyXG5cdFx0bGV0IGhyZWZBdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpXHJcblx0XHRpZiAoIWhyZWZBdHRyaWJ1dGUgfHwgKCFocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnLicpKSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnIycpKSB7XHJcblx0XHRcdGhyZWZBdHRyaWJ1dGUgPSBgIyR7aHJlZkF0dHJpYnV0ZS5zcGxpdCgnIycpWzFdfWBcclxuXHRcdH1cclxuXHJcblx0XHRzZWxlY3RvciA9IGhyZWZBdHRyaWJ1dGUgJiYgaHJlZkF0dHJpYnV0ZSAhPT0gJyMnID8gaHJlZkF0dHJpYnV0ZS50cmltKCkgOiBudWxsXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3IgPyBzZWxlY3Rvci5zcGxpdCgnLCcpLm1hcChzZWwgPT4gcGFyc2VTZWxlY3RvcihzZWwpKS5qb2luKCcsJykgOiBudWxsXHJcbn1cclxuXHJcbmNvbnN0IFNlbGVjdG9ycyA9IHtcclxuXHRnZXQoZWwsIGNvbnRhaW5lcikge1xyXG5cdFx0aWYgKCFlbCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ci0L7QstCw0YDQuNGJISDQn9C10YDQstGL0Lkg0L/QsNGA0LDQvNC10YLRgCDQvdC1INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQv9GD0YHRgtGL0LwhJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGxldCBlbG0gPSBpc0VsZW1lbnQoY29udGFpbmVyKSA/IFNlbGVjdG9ycy5maW5kT25lKGVsLCBjb250YWluZXIpIDogU2VsZWN0b3JzLmZpbmRPbmUoZWwpO1xyXG5cdFx0XHRcdGlmIChlbG0pIHJldHVybiBlbG07XHJcblx0XHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ9CQ0YXQv9C10YAhINCd0LUg0YPQtNCw0LvQvtGB0Ywg0L3QsNC50YLQuCDRjdC70LXQvNC10L3RgicpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRWxlbWVudChlbCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZWw7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCfQmtCt0J8hINCa0LDQutCw0Y8t0YLQviDQtNC40YfRjCDQuiDQvdCw0Lwg0LfQsNC70LXRgtC10LvQsCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZmluZEFsbChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIFtdLmNvbmNhdCguLi5FbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpKVxyXG5cdH0sXHJcblxyXG5cdGZpbmRPbmUoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpXHJcblx0fSxcclxuXHJcblx0cHJldihlbGVtZW50LCBzZWxlY3Rvcikge1xyXG5cdFx0bGV0IHByZXZpb3VzID0gZWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXHJcblxyXG5cdFx0d2hpbGUgKHByZXZpb3VzKSB7XHJcblx0XHRcdGlmIChwcmV2aW91cy5tYXRjaGVzKHNlbGVjdG9yKSkge1xyXG5cdFx0XHRcdHJldHVybiBbcHJldmlvdXNdXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXZpb3VzID0gcHJldmlvdXMucHJldmlvdXNFbGVtZW50U2libGluZ1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBbXVxyXG5cdH0sXHJcblxyXG5cdG5leHQoZWxlbWVudCwgc2VsZWN0b3IpIHtcclxuXHRcdGxldCBuZXh0ID0gZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG5cdFx0d2hpbGUgKG5leHQpIHtcclxuXHRcdFx0aWYgKG5leHQubWF0Y2hlcyhzZWxlY3RvcikpIHtcclxuXHRcdFx0XHRyZXR1cm4gW25leHRdXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5leHQgPSBuZXh0Lm5leHRFbGVtZW50U2libGluZ1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBbXVxyXG5cdH0sXHJcblxyXG5cdGdldFRhcmdldEZyb21TZWxlY3RvcihzZWxlY3Rvcikge1xyXG5cdFx0bGV0IF9zZWxlY3RvciA9IG51bGw7XHJcblxyXG5cdFx0aWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcclxuXHRcdFx0X3NlbGVjdG9yID0gc2VsZWN0b3I7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0X3NlbGVjdG9yID0gU2VsZWN0b3JzLmZpbmRPbmUoc2VsZWN0b3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0YXJnZXQgPSBnZXRTZWxlY3Rvcihfc2VsZWN0b3IpO1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGxldCBfdGFyZ2V0U2VsZWN0b3IgPSBTZWxlY3RvcnMuZmluZE9uZSh0YXJnZXQpO1xyXG5cdFx0aWYgKF90YXJnZXRTZWxlY3RvcikgcmV0dXJuICBfdGFyZ2V0U2VsZWN0b3I7XHJcblxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RvcnM7IiwiaW1wb3J0IHtleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCBpc0VtcHR5T2JqfSBmcm9tIFwiLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGFyYW1zIGZyb20gXCIuLi9fdXRpbHMvanMvcGFyYW1zXCI7XHJcbmltcG9ydCBEYXRhIGZyb20gXCIuLi9fdXRpbHMvanMvZGF0YVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi9fdXRpbHMvanMvc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uL191dGlscy9qcy9ldmVudFwiO1xyXG5pbXBvcnQge0FqYXgsIGdldFNWR30gZnJvbSBcIi4uL191dGlscy9qcy9tb2R1bGUtZm5cIjtcclxuXHJcbmNsYXNzIEJhc2VNb2R1bGUgZXh0ZW5kcyBQYXJhbXMge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gbnVsbDtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHJcblx0XHREYXRhLnNldCh0aGlzLmVsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVksIHRoaXMpXHJcblx0fVxyXG5cclxuXHRnZXQgZWxlbWVudCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50XHJcblx0fVxyXG5cclxuXHRzZXQgZWxlbWVudChlbCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudCA9IFNlbGVjdG9ycy5nZXQoZWwpO1xyXG5cdH1cclxuXHJcblx0Z2V0IHBhcmFtcygpIHtcclxuXHRcdHJldHVybiB0aGlzLl9wYXJhbXNcclxuXHR9XHJcblxyXG5cdHNldCBwYXJhbXMocGFyYW1zKSB7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMocGFyYW1zLCB0aGlzLmVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiAnJ1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuICcnXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIERhdGEuZ2V0KFNlbGVjdG9ycy5nZXQoZWxlbWVudCksIHRoaXMuTkFNRV9LRVkpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoZWxlbWVudCkgfHwgbmV3IHRoaXMoZWxlbWVudCwgIWlzRW1wdHlPYmoocGFyYW1zKSA/IHBhcmFtcyA6IHt9KVxyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdERhdGEucmVtb3ZlKHRoaXMuZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FX0tFWSlcclxuXHJcblx0XHRmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0aGlzW3Byb3BlcnR5TmFtZV0gPSBudWxsXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcm91dGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnYWpheCcpKSB7XHJcblx0XHRcdGlmICgndGFyZ2V0JyBpbiBfdGhpcy5wYXJhbXMuYWpheCAmJiBfdGhpcy5wYXJhbXMuYWpheC50YXJnZXQpIHtcclxuXHRcdFx0XHRsZXQgJGNvbnRlbnQgPSBTZWxlY3RvcnMuZmluZE9uZShfdGhpcy5wYXJhbXMuYWpheC50YXJnZXQpO1xyXG5cdFx0XHRcdGlmICgkY29udGVudCkge1xyXG5cdFx0XHRcdFx0aWYgKCdyb3V0ZScgaW4gX3RoaXMucGFyYW1zLmFqYXggJiYgX3RoaXMucGFyYW1zLmFqYXgucm91dGUpIHtcclxuXHRcdFx0XHRcdFx0QWpheC5nZXQoX3RoaXMucGFyYW1zLmFqYXgucm91dGUsIHt9LCBmdW5jdGlvbiAoc3RhdHVzLCBkYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0c2V0RGF0YShkYXRhKTtcclxuXHRcdFx0XHRcdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5lbGVtZW50LCBfdGhpcy5OQU1FX0tFWSArICcubG9hZGVkJyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XHJcblx0XHRcdFx0XHQkY29udGVudC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9kaXNtaXNzRWxlbWVudCgpIHtcclxuXHRcdGxldCBjcm9zcyA9IGdldFNWRygnY3Jvc3MnKSxcclxuXHRcdFx0YnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy52Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRpZiAoYnV0dG9uKSB7XHJcblx0XHRcdGxldCBzdmcgPSBidXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcblx0XHRcdGlmICghc3ZnKSBidXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBjcm9zcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcXVldWVDYWxsYmFjayhjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCA9IHRydWUsIHRpbWVPdXRNcykge1xyXG5cdFx0ZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbihjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCwgdGltZU91dE1zKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhc2VNb2R1bGU7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgbm9vcCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFBsYWNlbWVudCBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3BsYWNlbWVudFwiO1xyXG5cclxuY29uc3QgTkFNRSAgICAgICAgICAgICA9ICdkcm9wZG93bic7XHJcbmNvbnN0IE5BTUVfS0VZICAgICAgICAgPSAndmcuZHJvcGRvd24nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgID0gJ2ZhZGUnO1xyXG5jb25zdCBUQVJHRVRfQ09OVEFJTkVSID0gJ3ZnLWRyb3Bkb3duLWNvbnRlbnQnO1xyXG5jb25zdCBQQVJFTlRfQ09OVEFJTkVSID0gJ3ZnLWRyb3Bkb3duJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl0nO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSA9IGBrZXlkb3duLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY29uc3QgUEFSQU1TX0RFRkFVTFQgPSB7XHJcblx0b2Zmc2V0OiBbMCwgMl0sXHJcblx0b3ZlcjogZmFsc2UsXHJcblx0YmFja2Ryb3A6IHRydWUsXHJcblx0b3ZlcmZsb3c6IHRydWUsXHJcblx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0cGxhY2VtZW50OiAnYm90dG9tJyxcclxuXHRhbmltYXRpb246IHRydWUsXHJcblx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdGhvdmVyOiBmYWxzZSxcclxuXHRhamF4OiB7XHJcblx0XHRyb3V0ZTogJycsXHJcblx0XHR0YXJnZXQ6ICcnXHJcblx0fVxyXG59O1xyXG5cclxuY2xhc3MgVkdEcm9wZG93biBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJlbnQgPSB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZTtcclxuXHRcdHRoaXMuX2Ryb3AgPSBTZWxlY3RvcnMuZ2V0KCcuJyArIFRBUkdFVF9DT05UQUlORVIsIHRoaXMuX3BhcmVudCk7XHJcblx0XHR0aGlzLl9pc1BsYWNlbWVudCA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICh0aGlzLnBhcmFtcy5hbmltYXRpb24gPT09IGZhbHNlKSB7XHJcblx0XHRcdHRoaXMucGFyYW1zLnRpbWVvdXRBbmltYXRpb24gPSAxMFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIFBBUkFNU19ERUZBVUxUXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNTaG93bigpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKTtcclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLmVsZW1lbnQpIHx8IHRoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRoaXMuZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0dGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fc2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9kcm9wLCB0cnVlLCA1MCk7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5lbGVtZW50KSB8fCAhdGhpcy5faXNTaG93bigpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLmVsZW1lbnRcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldCk7XHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0cmV0dXJuIHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERSwgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTiwgcmVsYXRlZFRhcmdldCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX3BhcmVudCwgdHJ1ZSwgdGhpcy5wYXJhbXMudGltZW91dEFuaW1hdGlvbik7XHJcblx0fVxyXG5cclxuXHQvLyBUT0RPIGNsYXNzIFBsYWNlbWVudCBpc24ndCBkb25lXHJcblx0X3NldFBsYWNlbWVudCgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoIV90aGlzLl9pc1BsYWNlbWVudCkge1xyXG5cdFx0XHRsZXQgcGxhY2VtZW50ID0gbmV3IFBsYWNlbWVudCh7XHJcblx0XHRcdFx0ZWxlbWVudDogdGhpcy5fcGFyZW50LFxyXG5cdFx0XHRcdGRyb3A6IHRoaXMuX2Ryb3BcclxuXHRcdFx0fSkuX2dldFBsYWNlbWVudCgpO1xyXG5cclxuXHRcdFx0aWYgKHBsYWNlbWVudC5pc0ZpeGVkKSB7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG5cdFx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKC0yMCUpJzsgLy8gdG9kbyB0aGlzIGlzINC60L7RgdGC0YvQu9GMINC/0L5maXjQuNGC0YxcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUubGVmdCA9IHBsYWNlbWVudC5sZWZ0ICsgJ3B4JztcclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudG9wID0gIHBsYWNlbWVudC50b3AgKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub2Zmc2V0KSB7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdUb3AgPSBfdGhpcy5wYXJhbXMub2Zmc2V0WzFdICsgJ3B4JztcclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUucGFkZGluZ1JpZ2h0ID0gX3RoaXMucGFyYW1zLm9mZnNldFswXSArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2lzUGxhY2VtZW50ID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdGlmIChpbnN0YW5jZS5wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgUEFSRU5UX0NPTlRBSU5FUik7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCFpbnN0YW5jZS5fcGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRpbnN0YW5jZS5fY29tcGxldGVIaWRlKHtyZWxhdGVkVGFyZ2V0OiBpbnN0YW5jZS5fZWxlbWVudH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWURPV05fREFUQV9BUEksICcuJyArIFRBUkdFVF9DT05UQUlORVIsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl06bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHRHJvcGRvd24uZ2V0SW5zdGFuY2UodG9nZ2xlKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZHJvcCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMga2V5ZG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlzSW5wdXQgPSAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKVxyXG5cdFx0Y29uc3QgaXNFc2NhcGVFdmVudCA9IGV2ZW50LmtleSA9PT0gJ0VzY2FwZSdcclxuXHRcdGNvbnN0IGlzVXBPckRvd25FdmVudCA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXS5pbmNsdWRlcyhldmVudC5rZXkpXHJcblxyXG5cdFx0aWYgKCFpc1VwT3JEb3duRXZlbnQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzSW5wdXQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuXHRcdGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgP1xyXG5cdFx0XHR0aGlzIDpcclxuXHRcdFx0KFNlbGVjdG9ycy5wcmV2KHRoaXMsIFNFTEVDVE9SX0RBVEFfVE9HR0xFKVswXSB8fFxyXG5cdFx0XHRcdFNlbGVjdG9ycy5uZXh0KHRoaXMsIFNFTEVDVE9SX0RBVEFfVE9HR0xFKVswXSB8fFxyXG5cdFx0XHRcdFNlbGVjdG9ycy5maW5kT25lKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5wYXJlbnROb2RlKSlcclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShnZXRUb2dnbGVCdXR0b24pXHJcblxyXG5cdFx0aWYgKGlzVXBPckRvd25FdmVudCkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5zaG93KClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2UuaGlkZSgpXHJcblx0XHRcdGdldFRvZ2dsZUJ1dHRvbi5mb2N1cygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRHJvcGRvd247IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvYmFja2Ryb3BcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2V2ZW50XCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZH0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9tb2R1bGUtZm5cIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbW9kYWwnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5tb2RhbCc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnXHJcbmNvbnN0IFNFTEVDVE9SX0RJQUxPRyA9ICcudmctbW9kYWwtZGlhbG9nJ1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cIm1vZGFsXCJdJ1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRidXR0b246IG51bGwsXHJcblx0YmFja2Ryb3A6IHRydWUsXHJcblx0b3ZlcmZsb3c6IHRydWUsXHJcblx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZnTW9kYWwgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9kaWFsb2cgPSBTZWxlY3RvcnMuZmluZE9uZShTRUxFQ1RPUl9ESUFMT0csIHRoaXMuZWxlbWVudClcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLmVsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9pc0FuaW1hdGVkKCkpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oX3RoaXMuZWxlbWVudCwgJ21vdXNlZG93bi52Zy5tb2RhbCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGNvbnN0IG1vZGFsQ29udGVudCA9IFNlbGVjdG9ycy5nZXQoJy52Zy1tb2RhbC1jb250ZW50JywgdGhpcyk7XHJcblx0XHRcdFx0aWYgKCFtb2RhbENvbnRlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLmVsZW1lbnQsIHRydWUsIDUwKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLmVsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuX2lzQW5pbWF0ZWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5lbGVtZW50LCB0aGlzLl9pc0FuaW1hdGVkKCkpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2lzQW5pbWF0ZWQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0ZBREUpXHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMucGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKClcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVmdNb2RhbClcclxuXHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRUYXJnZXRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kT25lKCcudmctbW9kYWwuc2hvdycpXHJcblx0aWYgKGFscmVhZHlPcGVuICYmIGFscmVhZHlPcGVuICE9PSB0YXJnZXQpIHtcclxuXHRcdFZnTW9kYWwuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZGF0YSA9IFZnTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcylcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZnTW9kYWw7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL292ZXJmbG93XCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9ldmVudFwiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWR9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ3NpZGViYXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5zaWRlYmFyJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cInNpZGViYXJcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jb25zdCBQQVJBTVNfREVGQVVMVCA9ICB7XHJcblx0YnV0dG9uOiBudWxsLFxyXG5cdGJhY2tkcm9wOiB0cnVlLFxyXG5cdG92ZXJmbG93OiB0cnVlLFxyXG5cdGtleWJvYXJkOiB0cnVlLFxyXG5cdGFqYXg6IHtcclxuXHRcdHJvdXRlOiAnJyxcclxuXHRcdHRhcmdldDogJydcclxuXHR9XHJcbn07XHJcblxyXG5jbGFzcyBWR1NpZGViYXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblx0XHR0aGlzLl9kaXNtaXNzRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEZWZhdWx0KCkge1xyXG5cdFx0cmV0dXJuIFBBUkFNU19ERUZBVUxUXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKFNlbGVjdG9ycy5maW5kT25lKCcudmctYmFja2Ryb3AnKSwgJ21vdXNlZG93bi52Zy5iYWNrZHJvcCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5lbGVtZW50LCB0cnVlLCA1MClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLmVsZW1lbnQsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTLCBldmVudCA9PiB7XHJcblx0XHRcdGlmIChldmVudC5rZXkgIT09ICdFc2NhcGUnKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLnBhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEKVxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHU2lkZWJhcilcclxuXHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFRhcmdldEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmRPbmUoJy52Zy1zaWRlYmFyLnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWR1NpZGViYXIuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHU2lkZWJhci5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL3Jlc3BvbnNpdmVcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvbW9kdWxlLWZuXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBub29wLCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vX3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9fdXRpbHMvanMvZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL191dGlscy9qcy9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICduYXYnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5uYXYnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICAgPSAnZmFkZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJy52Zy1uYXYgYSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSAgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTSVpFX0RBVEFfQVBJID0gYHJlc2l6ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBQYXJhbXNcclxuICovXHJcbmNvbnN0IFBBUkFNU19ERUZBVUxUID0gIHtcclxuXHRicmVha3BvaW50OiAnbGcnLFxyXG5cdHBsYWNlbWVudDogJ2hvcml6b250YWwnLFxyXG5cdGNsYXNzZXM6IHtcclxuXHRcdGhhbWJ1cmdlckFjdGl2ZTogJ3ZnLW5hdi1oYW1idXJnZXItYWN0aXZlJyxcclxuXHRcdGhhbWJ1cmdlcjogJ3ZnLW5hdi1oYW1idXJnZXInLFxyXG5cdFx0Y29udGFpbmVyOiAndmctbmF2LWNvbnRhaW5lcicsXHJcblx0XHR3cmFwcGVyOiAndmctbmF2LXdyYXBwZXInLFxyXG5cdFx0YWN0aXZlOiAndmctbmF2LWFjdGl2ZScsXHJcblx0XHRleHBhbmQ6ICd2Zy1uYXYtZXhwYW5kJyxcclxuXHRcdGNsb25lZDogJ3ZnLW5hdi1jbG9uZWQnLFxyXG5cdFx0aG92ZXI6ICd2Zy1uYXYtaG92ZXInLFxyXG5cdFx0ZmxpcDogJ3ZnLW5hdi1mbGlwJyxcclxuXHRcdFhYWEw6ICd2Zy1uYXYteHh4bCcsXHJcblx0XHRYWEw6ICd2Zy1uYXYteHhsJyxcclxuXHRcdFhMOiAndmctbmF2LXhsJyxcclxuXHRcdExHOiAndmctbmF2LWxnJyxcclxuXHRcdE1EOiAndmctbmF2LW1kJyxcclxuXHRcdFNNOiAndmctbmF2LXNtJyxcclxuXHRcdFhTOiAndmctbmF2LXhzJ1xyXG5cdH0sXHJcblx0ZXhwYW5kOiB0cnVlLFxyXG5cdGhvdmVyOiBmYWxzZSxcclxuXHRwb3NpdGlvbjogdHJ1ZSxcclxuXHRjb2xsYXBzZTogdHJ1ZSxcclxuXHR0b2dnbGU6ICc8c3BhbiBjbGFzcz1cImRlZmF1bHRcIj48L3NwYW4+JyxcclxuXHRoYW1idXJnZXI6IHtcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdGJvZHk6IG51bGxcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiBub29wLFxyXG5cdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0YWpheDoge1xyXG5cdFx0cm91dGU6ICcnLFxyXG5cdFx0dGFyZ2V0OiAnJ1xyXG5cdH1cclxufTtcclxuXHJcbmNsYXNzIFZHTmF2IGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IG51bGw7XHJcblx0XHR0aGlzLm5hdmlnYXRpb24gPSAnLicgKyB0aGlzLnBhcmFtcy5jbGFzc2VzLndyYXBwZXI7XHJcblxyXG5cdFx0dGhpcy5tb3ZlZExpbmtzID0gW107XHJcblx0XHR0aGlzLiRsaW5rcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuJyArIHRoaXMucGFyYW1zLmNsYXNzZXMud3JhcHBlciArICcgPiBsaScsIHRoaXMubmF2aWdhdGlvbilcclxuXHJcblx0XHRpZiAodGhpcy5wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLnBhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcclxuXHRcdHJldHVybiBQQVJBTVNfREVGQVVMVFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0Z2V0IG5hdmlnYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcclxuXHR9XHJcblxyXG5cdHNldCBuYXZpZ2F0aW9uKGVsKSB7XHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gU2VsZWN0b3JzLmdldChlbCwgdGhpcy5lbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0aWYgKCF0aGlzLm5hdmlnYXRpb24pIHJldHVybjtcclxuXHJcblx0XHRsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcblxyXG5cdFx0Ly8g0JLQtdGI0LDQtdC8INC+0YHQvdC+0LLQvdGL0LUg0LrQu9Cw0YHRgdGLXHJcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5jb250YWluZXIpO1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLnBsYWNlbWVudCk7XHJcblxyXG5cdFx0Ly8g0JXRgdC70Lgg0L3Rg9C20L3QviDQvtGB0YLQsNCy0LjRgtGMINGB0L/QuNGB0L7QuiDQvNC10L3RjiDQuNC70Lgg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0LzQtdC00LjQsCDRgtC+0YfQutGDXHJcblx0XHRpZiAocGFyYW1zLmJyZWFrcG9pbnQgPT09IG51bGwpIHtcclxuXHRcdFx0cGFyYW1zLmV4cGFuZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXJhbXMuYnJlYWtwb2ludCA9PT0gbnVsbCB8fCAhcGFyYW1zLmV4cGFuZCkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5leHBhbmQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLmJyZWFrcG9pbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCc0LXQvdGOINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCwg0LXRgdC70Lgg0Y3RgtC+INC90LUg0LzQvtCx0LjQu9GM0L3QvtC1INGD0YHRgtGA0L7QudGB0YLQstC+XHJcblx0XHRpZiAocGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHJcblx0XHRcdGlmIChSZXNwb25zaXZlLmNoZWNrTW9iaWxlT3JUYWJsZXQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INCz0LDQvNCx0YPRgNCz0LXRgCwg0LXRgdC70Lgg0LXQs9C+INC90LXRgiDQsiDRgNCw0LfQvNC10YLQutC1XHJcblx0XHRpZiAocGFyYW1zLmV4cGFuZCAmJiAhcGFyYW1zLmhhbWJ1cmdlci5ib2R5KSB7XHJcblx0XHRcdGxldCBpc0hhbWJ1cmdlciA9IFNlbGVjdG9ycy5maW5kT25lKCcuJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciwgdGhpcy5lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChpc0hhbWJ1cmdlciA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBtVGl0bGUgPSAnJyxcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS1saW5lc1wiPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci50aXRsZSkge1xyXG5cdFx0XHRcdFx0bVRpdGxlID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLXRpdGxlXCI+JysgcGFyYW1zLmhhbWJ1cmdlci50aXRsZSArJzwvc3Bhbj4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIuYm9keSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gcGFyYW1zLmhhbWJ1cmdlci5ib2R5O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsJzxhIGhyZWY9XCIjc2lkZWJhci1uYXZcIiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnXCIgZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCI+JyArIG1UaXRsZSArIGhhbWJ1cmdlciArJzwvYT4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INGD0LrQsNC30LDRgtC10LvRjCDQv9C10YDQtdC60LvRjtGH0LDRgtC10LvRj1xyXG5cdFx0aWYgKHBhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0bGV0ICRkcm9wZG93bl9hID0gWy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd24tbWVnYSA+IGEsIC5kcm9wZG93biA+IGEnLCB0aGlzLmVsZW1lbnQpXSxcclxuXHRcdFx0XHR0b2dnbGUgPSAnPHNwYW4gY2xhc3M9XCJ0b2dnbGVcIj4nICsgcGFyYW1zLnRvZ2dsZSArICc8L3NwYW4+JztcclxuXHJcblx0XHRcdGlmICgkZHJvcGRvd25fYS5sZW5ndGgpIHtcclxuXHRcdFx0XHQkZHJvcGRvd25fYS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVsZW0ucXVlcnlTZWxlY3RvcignLnRvZ2dsZScpICYmICFlbGVtLmNsb3Nlc3QoJy5kb3RzJykpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG5cdFx0XHRcdFx0XHRlbGVtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdG9nZ2xlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtcy5jb2xsYXBzZSAmJiBSZXNwb25zaXZlLmNoZWNrKHRoaXMpICYmIHBhcmFtcy5wbGFjZW1lbnQgIT09ICd2ZXJ0aWNhbCcpIHtcclxuXHRcdFx0c2V0Q29sbGFwc2UodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdhZnRlckluaXQnIGluIHRoaXMucGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUodGhpcy5wYXJhbXMuY2FsbGJhY2suYWZ0ZXJJbml0LCBbdGhpc10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICog0KTRg9C90LrRhtC40Y8g0YHQstC+0YDQsNGH0LjQstCw0L3QuNGPXHJcblx0XHQgKiBUT0RPINCf0YDQuNC00YPQvNCw0YLRjCDRh9GC0L4g0YLQviDRgSDQvNC10LPQsCDQvNC10L3Rjiwg0LrQvtGC0L7RgNC+0LUg0YPRhdC+0LTQuNGCINCyINC/0L7QtNC80LXQvdGOXHJcblx0XHQgKiBUT0RPINCi0LDQuiDQttC1INC10YHRgtGMINC60L7RgdGP0LrQuCDQv9GA0Lgg0YDQtdGB0LDQudC30LVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0Q29sbGFwc2UoX3RoaXMpIHtcclxuXHRcdFx0bGV0IHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSA9IF90aGlzLm5hdmlnYXRpb24uY2xpZW50V2lkdGgsXHJcblx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAwLFxyXG5cdFx0XHRcdCRkb3RzID0gU2VsZWN0b3JzLmZpbmRPbmUoJy5kb3RzJywgX3RoaXMubmF2aWdhdGlvbiksXHJcblx0XHRcdFx0X2RvdHMgPSBnZXRTVkcoJ2RvdHMnKTtcclxuXHJcblx0XHRcdGlmIChfdGhpcy4kbGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9ICRkb3RzLmNsaWVudFdpZHRoXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCAkYSA9IFNlbGVjdG9ycy5maW5kT25lKCdhJywgX3RoaXMuJGxpbmtzWzBdKSxcclxuXHRcdFx0XHRcdFx0JGxpbmtTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoJGEpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nTGVmdC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSAgbm9ybWFsaXplRGF0YSgkbGlua1N0eWxlLnBhZGRpbmdSaWdodC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nID0gcGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQ7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQstC10YDQvdC+LCDQvdC+INC80Ysg0YLQvtGH0L3QviDQt9C90LDQtdC8INGI0LjRgNC40L3RgyDRgtC+0YfQtdC6INCyIHN2ZyAtIDE2cHhcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gcGFkZGluZyArIDE2O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgJGxpbmsgb2YgX3RoaXMuJGxpbmtzKSB7XHJcblx0XHRcdFx0XHRsZXQgd2lkdGggPSAkbGluay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgKyB3aWR0aDtcclxuXHJcblx0XHRcdFx0XHRpZiAoKHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSkgPCB3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlZExpbmtzLnB1c2goJGxpbmspO1xyXG5cdFx0XHRcdFx0XHQkbGluay5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRCZWZvcmUoX3RoaXMubW92ZWRMaW5rc1swXSwgJGRvdHMpXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uYXBwZW5kQ2hpbGQoX3RoaXMubW92ZWRMaW5rc1swXSlcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5zcGxpY2UoMCwgMSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0aWYgKCEkZG90cykge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywnPGxpIGNsYXNzPVwiZHJvcGRvd24gZG90c1wiPicgKyAnPGEgaHJlZj1cIiNcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4nKyBfZG90cyArJzwvYT48L2xpPicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0JGRvdHMucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgJGQgPSBfdGhpcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5kb3RzJyk7XHJcblx0XHRcdFx0aWYgKCRkICYmIF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gJGQucXVlcnlTZWxlY3RvcigndWwnKTtcclxuXHRcdFx0XHRcdGlmICgkZHJvcGRvd24pIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBfdGhpcy5tb3ZlZExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdFx0JGRyb3Bkb3duLnByZXBlbmQobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCAkZHJvcGRvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd24tY29udGVudCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQkZC5hcHBlbmRDaGlsZCgkZHJvcGRvd24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRsZXQgdGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICghdGFyZ2V0IHx8IGlzRGlzYWJsZWQodGFyZ2V0KSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duLWNvbnRlbnQnKSkge1xyXG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCgnZmlyc3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRsZXQgZHJvcCA9IFNlbGVjdG9ycy5maW5kT25lKCcuZHJvcGRvd24tY29udGVudCcsIHRhcmdldCksXHJcblx0XHRcdGxpbmsgPSB0YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG5cdFx0aWYgKGxpbmspIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuXHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cclxuXHRcdHNldERyb3BQb3NpdGlvbihkcm9wKVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgZHJvcCwgdHJ1ZSwgNTApO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSAkZHJvcFxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBzZXREcm9wUG9zaXRpb24oJGRyb3ApIHtcclxuXHRcdFx0bGV0IHt3aWR0aCwgcmlnaHR9ID0gJGRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdFx0d2luZG93X3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG5cdFx0XHRsZXQgTl9yaWdodCA9IHdpbmRvd193aWR0aCAtIHJpZ2h0IC0gd2lkdGg7XHJcblxyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdsZWZ0Jyk7XHJcblxyXG5cdFx0XHRsZXQgJHBhcmVudCA9ICRkcm9wLmNsb3Nlc3QoJ2xpJyksXHJcblx0XHRcdFx0JHVsID0gJHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCd1bCcpO1xyXG5cclxuXHRcdFx0aWYgKE5fcmlnaHQgPiB3aWR0aCkge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCAkZWwgb2YgJHVsKSB7XHJcblx0XHRcdFx0XHQkZWwuY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoJ2VsbScgaW4gcmVsYXRlZFRhcmdldCAmJiByZWxhdGVkVGFyZ2V0LmVsbSkge1xyXG5cdFx0XHRlbGVtZW50ID0gcmVsYXRlZFRhcmdldC5lbG1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZWxlbWVudCkge1xyXG5cdFx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihlbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZmlyc3QnKSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlyc3QnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuJyArIENMQVNTX05BTUVfU0hPVywgZWxlbWVudCldLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xyXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRcdFx0bGV0IHBhcmVudCA9IGVsLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGxpbmsgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0XHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoZWwsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0X3RoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgZWwsIHRydWUsIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRPRE8g0LXRgdC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtC1INC90LXRgdC60L7Qu9GM0LrQviDQvdCw0LLQuNCz0LDRhtC40LksINGC0L4g0LXRgdGC0Ywg0LrQvtGB0Y/QutC4XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdOYXYuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHJcblx0XHRsZXQgZHJvcHMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duJywgaW5zdGFuY2UuX25hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLnBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRbLi4uZHJvcHNdLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGlmICghaW5zdGFuY2UubmF2aWdhdGlvbi5jb250YWlucyh0YXJnZXQpKSByZXR1cm47XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldDogdGFyZ2V0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2Uuc2hvdyhyZWxhdGVkVGFyZ2V0KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyksXHJcblx0XHRcdFx0XHRcdGVsbSA9IGN1cnJlbnRFbGVtO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGVsbTogZWxtfSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghTWFuaXB1bGF0b3IuaGFzQXR0cmlidXRlKHRoaXMsICdhcmlhLWV4cGFuZGVkJykpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICgnY2xpY2snIGluIGluc3RhbmNlLnBhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0ZXhlY3V0ZShpbnN0YW5jZS5wYXJhbXMuY2FsbGJhY2suY2xpY2ssIFt0aGlzXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXMuY2xvc2VzdCgnLnZnLW5hdicpLFxyXG5cdFx0XHRcdFx0aXNGaXJzdCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmZpcnN0Jyk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSB0aGlzLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGlmIChpc0Rpc2FibGVkKHRhcmdldCkgJiYgIWlzVmlzaWJsZSh0YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaXNGaXJzdCAmJiB0aGlzLmNsb3Nlc3QoJy5maXJzdCcpKSB7XHJcblx0XHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogdGFyZ2V0fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuYWN0aXZlJywgc2VsZildLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlbCAmJiBlbCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogZWx9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB2Z05hdlNpZGViYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhci1uYXYnKTtcclxuXHRcdGxldCBoYW1idXJnZXIgPSBpbnN0YW5jZS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaW5zdGFuY2UucGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyKTtcclxuXHJcblx0XHRpZiAodmdOYXZTaWRlYmFyICYmIGhhbWJ1cmdlcikge1xyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5zaG93JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLnBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuaGlkZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZShpbnN0YW5jZS5wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ecm9wcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpLmFjdGl2ZScpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR05hdi5nZXRJbnN0YW5jZSh0b2dnbGUuY2xvc2VzdCgnLnZnLW5hdicpKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSBjb250aW51ZTtcclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRvZ2dsZSB9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdHJlbGF0ZWRUYXJnZXQuY2xpY2tFdmVudCA9IGV2ZW50XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHQuaGlkZShyZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfUkVTSVpFX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoJy52Zy1uYXYnLCB7fSk7XHJcblx0aW5zdGFuY2UuYnVpbGQoKTtcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHTmF2OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC9fdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3NcIjtcclxuXHJcbi8vIHZnc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzc1wiO1xyXG5pbXBvcnQgVkdTaWRlYmFyIGZyb20gXCIuL2FwcC9tb2R1bGVzL3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzXCI7XHJcbmltcG9ydCBWR0Ryb3Bkb3duIGZyb20gXCIuL2FwcC9tb2R1bGVzL2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd25cIjtcclxuXHJcbi8vIG1vZGFsXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZnTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvbW9kYWwvanMvdmdtb2RhbFwiO1xyXG5cclxuLy8gbmF2XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzXCI7XHJcbmltcG9ydCBWR05hdiBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z25hdi9qcy92Z25hdlwiO1xyXG5cclxuZnVuY3Rpb24gb25SZWFkeSgpIHtcclxuXHRbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl0nKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0VkdEcm9wZG93bi5pbml0KGVsZW1lbnQsIHt9KVxyXG5cdH0pO1xyXG5cclxuXHRbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZnLW5hdicpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRWR05hdi5pbml0KGVsZW1lbnQsIHt9KVxyXG5cdH0pO1xyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgb25SZWFkeSk7XHJcblxyXG5leHBvcnQge1xyXG5cdFZHU2lkZWJhciwgVkdEcm9wZG93biwgVkdOYXYsIFZnTW9kYWxcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=