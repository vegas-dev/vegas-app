var vg;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/modules/base-module.js":
/*!************************************!*\
  !*** ./app/modules/base-module.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_dom_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/js/dom/data */ "./app/utils/js/dom/data.js");
/* harmony import */ var _utils_js_components_params__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/js/components/params */ "./app/utils/js/components/params.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./module-fn */ "./app/modules/module-fn.js");






class BaseModule {
  constructor(element) {
    if (!element) return;
    this._element = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find(element);
    if (!this._element) return;
    this._params = {};
    _utils_js_dom_data__WEBPACK_IMPORTED_MODULE_2__["default"].set(this._element, this.constructor.NAME_KEY, this);
  }
  _getParams(element, params) {
    return new _utils_js_components_params__WEBPACK_IMPORTED_MODULE_3__["default"](params, element).get();
  }
  dispose() {
    _utils_js_dom_data__WEBPACK_IMPORTED_MODULE_2__["default"].remove(this._element, this.constructor.NAME_KEY);
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].off(this._element, this.constructor.EVENT_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }
  _route(callback) {
    const _this = this;
    let $content = null;
    if (!_this._params.hasOwnProperty('ajax')) {
      return;
    }
    if (!_this._params.ajax.route) {
      return;
    }
    if (!'method' in _this._params.ajax) {
      _this._params.ajax.method = 'get';
    }
    if ('target' in _this._params.ajax && _this._params.ajax.target) {
      $content = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find(_this._params.ajax.target);
    }
    const setData = data => {
      if ($content) $content.innerHTML = data;
    };
    _module_fn__WEBPACK_IMPORTED_MODULE_5__.Ajax[_this._params.ajax.method](_this._params.ajax.route, _this._params.ajax.data || {}, function (status, data) {
      setData(data);
      (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.execute)(callback, [status, data]);
    });
  }
  _dismissElement() {
    let cross = (0,_module_fn__WEBPACK_IMPORTED_MODULE_5__.getSVG)('cross'),
      button = this._element.querySelector('.vg-btn-close');
    if (button) {
      let svg = button.querySelector('svg');
      if (!svg) button.insertAdjacentHTML('beforeend', cross);
    }
  }
  _queueCallback(callback, element, isAnimated = true, timeOutMs) {
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.executeAfterTransition)(callback, element, isAnimated, timeOutMs);
  }
  static getInstance(element) {
    return _utils_js_dom_data__WEBPACK_IMPORTED_MODULE_2__["default"].get(_utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find(element), this.NAME_KEY);
  }
  static getOrCreateInstance(element, params = {}) {
    return this.getInstance(element) || new this(element, !(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_0__.isEmptyObj)(params) ? params : {});
  }
  static get DATA_KEY() {
    return `vg.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BaseModule);

/***/ }),

/***/ "./app/modules/module-fn.js":
/*!**********************************!*\
  !*** ./app/modules/module-fn.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ajax: () => (/* binding */ Ajax),
/* harmony export */   dismissTrigger: () => (/* binding */ dismissTrigger),
/* harmony export */   getSVG: () => (/* binding */ getSVG)
/* harmony export */ });
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");




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
  _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_0__["default"].on(document, clickEvent, `[data-vg-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) {
      return;
    }
    const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].getSelectorFromElement(this) || this.closest(`.vg-${name}`);
    const instance = module.getOrCreateInstance(target);
    instance[method]();
  });
};

/**
 * AJAX REQUEST
 * @type {{post: ajax.post, get: ajax.get, x: ((function(): (XMLHttpRequest))|*), send: ajax.send}}
 */
const Ajax = {
  x: function () {
    if (typeof XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    let versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
    let xhr;
    for (let i = 0; i < versions.length; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      } catch (e) {}
    }
    return xhr;
  },
  send: function (url, callback, method, data, async) {
    if (async === undefined) {
      async = true;
    }
    let x = Ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
      if (x.readyState === 4) {
        switch (x.status) {
          case 200:
            callback('success', x.responseText);
            break;
          default:
            callback('error', x.statusText);
            break;
        }
      }
    };
    x.send(data);
  },
  get: function (url, data, callback, async) {
    let query = [];
    if (!(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(data)) {
      for (let key of data) {
        query.push(encodeURIComponent(key[0]) + '=' + encodeURIComponent(key[1]));
      }
    }
    Ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
  },
  post: function (url, data, callback, async) {
    Ajax.send(url, callback, 'POST', data, async);
  }
};


/***/ }),

/***/ "./app/modules/vgcollapse/js/vgcollapse.js":
/*!*************************************************!*\
  !*** ./app/modules/vgcollapse/js/vgcollapse.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/components/backdrop */ "./app/utils/js/components/backdrop.js");
/* harmony import */ var _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/components/overflow */ "./app/utils/js/components/overflow.js");








/**
 * Constants
 */
const NAME = 'collapse';
const NAME_KEY = 'vg.collapse';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="collapse"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGCollapse extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      parent: null,
      ajax: {
        route: '',
        target: '',
        method: 'get'
      }
    }, params));
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(_this._element)) return;
  }
  hide() {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(_this._element)) return;
  }
  dispose() {
    super.dispose();
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
}

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }
  let target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].getSelectorFromElement(this);
  if (!target) return;
  VGCollapse.getOrCreateInstance(target, {
    toggle: false
  }).toggle();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGCollapse);

/***/ }),

/***/ "./app/modules/vgdropdown/js/vgdropdown.js":
/*!*************************************************!*\
  !*** ./app/modules/vgdropdown/js/vgdropdown.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_components_placement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/components/placement */ "./app/utils/js/components/placement.js");





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
class VGDropdown extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)({
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
        target: '',
        method: 'get'
      }
    }, params));
    this._parent = this._element.parentNode;
    this._drop = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].find('.' + TARGET_CONTAINER, this._parent);
    this._isPlacement = false;
    if (this._params.animation === false) {
      this._params.timeoutAnimation = 10;
    }
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this._element) || this._isShown()) return;
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_SHOW, relatedTarget);
    if (showEvent.defaultPrevented) return;
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.noop);
      }
    }
    this._route();
    this._element.setAttribute('aria-expanded', true);
    this._element.classList.add(CLASS_NAME_SHOW);
    this._drop.classList.add(CLASS_NAME_SHOW);
    this._setPlacement();
    const completeCallBack = () => {
      this._drop.classList.add(CLASS_NAME_FADE);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_SHOWN, relatedTarget);
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
  dispose() {
    return super.dispose();
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  _completeHide(relatedTarget) {
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDE, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].off(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.noop);
      }
    }
    this._drop.classList.remove(CLASS_NAME_FADE);
    this._element.classList.remove(CLASS_NAME_SHOW);
    this._element.setAttribute('aria-expanded', 'false');
    const completeCallback = () => {
      this._drop.classList.remove(CLASS_NAME_SHOW);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDDEN, relatedTarget);
    };
    this._queueCallback(completeCallback, this._parent, true, this._params.timeoutAnimation);
  }

  // TODO class Placement isn't done
  _setPlacement() {
    const _this = this;
    if (!_this._isPlacement) {
      let placement = new _utils_js_components_placement__WEBPACK_IMPORTED_MODULE_4__["default"]({
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
    if (_this._params.offset) {
      _this._drop.style.paddingTop = _this._params.offset[1] + 'px';
      _this._drop.style.paddingRight = _this._params.offset[0] + 'px';
    }
    _this._isPlacement = true;
  }
  static init(element, params = {}) {
    const instance = VGDropdown.getOrCreateInstance(element, params);
    if (instance._params.hover) {
      let currentElem = null;
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(instance._parent, EVENT_MOUSEOVER_DATA_API, function (event) {
        if (currentElem) return;
        VGDropdown.hideOpenToggles(event);
        let target = event.target.closest('.' + PARENT_CONTAINER);
        if (!target) return;
        if (!instance._parent.contains(target)) return;
        currentElem = target;
        instance.show();
      });
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(instance._parent, EVENT_MOUSEOUT_DATA_API, function (event) {
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
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEYUP_DATA_API, SELECTOR_DATA_TOGGLE, VGDropdown.keydownHandler);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEYDOWN_DATA_API, '.' + TARGET_CONTAINER, VGDropdown.keydownHandler);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEYUP_DATA_API, VGDropdown.clearDrops);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_CLICK_DATA_API, VGDropdown.clearDrops);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(element, EVENT_CLICK_DATA_API, function (event) {
        event.preventDefault();
        instance.toggle();
      });
    }
  }
  static hideOpenToggles(event) {
    const openToggles = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].findAll('[data-vg-toggle="dropdown"]:not(.disabled):not(:disabled).show');
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
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ? this : _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].find(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode);
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
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../vgmodal/js/vgmodal */ "./app/modules/vgmodal/js/vgmodal.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");







/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_FULL = 'vgformsender';
const NAME_KEY = 'vg.fs';

/**
 * Constants Classes
 */

/**
 * Constants Events
 */
const EVENT_KEY_SUCCESS = 'vg.fs.success';
const EVENT_KEY_ERROR = 'vg.fs.error';
const EVENT_KEY_BEFORE = 'vg.fs.before';
const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;
class VGFormSender extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.mergeDeepObject)({
      redirect: '',
      validate: false,
      submit: false,
      fields: [],
      alert: {
        enabled: true,
        type: 'modal'
      },
      ajax: {
        route: '',
        target: '',
        method: 'get'
      },
      classes: {
        general: 'vg-form-sender',
        validation: 'needs-validation',
        wasValidate: 'was-validated'
      }
    }, params));
    this._params.ajax.route = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this._element, 'action').toLowerCase();
    this._params.ajax.method = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this._element, 'method').toLowerCase();
    this._button = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('[type="submit"]', this._element) || _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('[form="' + this._element.id + '"]') || null;
    this._params.isBtnText = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this._element, 'data-btn-text') !== 'false';
    this._params.isJsonParse = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this._element, 'data-json-parse') !== 'false';
    this._params.isShowPass = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(this._element, 'data-show-pass') === 'true';
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  build() {
    this._element.classList.add(this._params.classes.general);
    if (this._params.validate) {
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.set(this._element, 'novalidate', '');
      this._element.classList.add(this._params.classes.validation);
    }

    // TODO сделать добавление глаза если есть ввод пароля

    return this;
  }
  request(data, event) {
    const _this = this;
    _this._alertBefore();
    _this._params.ajax.fields = data;
    _this._route(function (status, data) {
      _this._element.classList.remove('was-validated');
      if (_this._params.alert.enabled) {
        if (typeof status === 'string' && status === 'error') {
          _this._alertError(event, data);
        } else if (typeof status === 'string' && status === 'success') {
          _this._alertSuccess(event, data);
        }
      }
      if (_this._params.redirect) {
        window.location.href = _this._params.redirect;
      }
    });
  }
  _alertBefore() {
    const _this = this;
    _this._statusButton('before');
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_BEFORE, _this);
  }
  _alertError(event, data) {
    const _this = this;
    _this._statusButton('after');
    _this._jsonParse(data, 'error');
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_ERROR, [event, _this, data]);
  }
  _alertSuccess(event, data) {
    const _this = this;
    _this._statusButton('after');
    _this._jsonParse(data, 'success');
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_SUCCESS, [event, _this, data]);
  }
  _statusButton(status) {
    const _this = this;
    if (!_this._button) return;
    let btnSubmitText = _this._button,
      btnText = {
        send: 'Отправляем...',
        text: 'Отправить'
      };
    if (_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.has(_this._button, 'data-spinner') && status === 'before') {
      _this._button.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm me-2"></span>');
    }
    if (_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.has(_this._button, 'data-text')) {
      btnText.text = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(_this._button, 'data-text');
    } else {
      let $btnText = _this._button.querySelector('[data-text]');
      if ($btnText) {
        btnText.text = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get($btnText, 'data-text');
        btnSubmitText = $btnText;
      }
    }
    if (_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.has(_this._button, 'data-text-send')) {
      btnText.send = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(_this._button, 'data-text-send');
    } else {
      let $btnTextSend = _this._button.querySelector('[data-text-send]');
      if ($btnTextSend) {
        btnText.send = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get($btnTextSend, 'data-text-send');
        btnSubmitText = $btnTextSend;
      }
    }
    if (status === 'before') {
      if (_this._params.isBtnText) {
        btnSubmitText.innerHTML = btnText.send;
      }
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.set(_this._button, 'disabled', 'disabled');
    }
    if (status === 'after') {
      if (_this._params.isBtnText) {
        btnSubmitText.innerHTML = btnText.text;
      }
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.remove(_this._button, 'disabled');
      let spinner = _this._button.querySelector('.spinner-border');
      if (spinner) spinner.remove();
    }
  }
  _jsonParse(data, status) {
    const _this = this;
    if (_this._params.isJsonParse && typeof data === 'string') {
      let parserData = {};
      try {
        parserData = JSON.parse(data);
        _this.alert(parserData, status);
      } catch (e) {
        _this.alert(data, status);
      }
    } else {
      _this.alert(data, status);
    }
  }
  alert(data, status) {
    const _this = this;
    if (!_this._params.alert.enabled) {
      return;
    }
    if (_this._params.alert.type === 'modal') {
      _this._alertModal(data, status);
    }
    if (_this._params.alert.type === 'collapse') {
      _this._alertCollapse(data, status);
    }
  }
  _alertModal(data, status) {
    const _this = this;

    // Есть ли открытые модалки, закрываем
    [...document.getElementsByClassName('modal')].forEach(function (element) {
      if (element && element.classList.contains('show')) {
        let mBS = bootstrap.Modal.getOrCreateInstance(element);
        mBS.hide();
      }
    });
    [...document.getElementsByClassName('vg-modal')].forEach(function (element) {
      if (element && element.classList.contains('show')) {
        const mVG = _vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_3__["default"].getOrCreateInstance(element);
        mVG.hide();
      }
    });

    // Формируем новую модалку и открываем её
  }
  _alertCollapse(data, status) {
    const _this = this;
    console.log(_this._params.alert.type);
  }

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
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_SUBMIT_DATA_API, function (event) {
  if (!_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.has(event.target, 'data-vgformsender')) {
    return;
  }
  const instance = VGFormSender.getOrCreateInstance(event.target, {});
  if (!instance) {
    return;
  }
  if (instance._params.validate) {
    if (!instance._element.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      instance._element.classList.add(instance._params.classes.wasValidate);
      return false;
    }
  }
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
  if (!instance._params.submit) {
    event.preventDefault();
    let data = new FormData(instance._element);
    if (typeof instance._params.ajax.fields === 'object') {
      data = collectData(data, instance._params.ajax.fields);
    }
    return instance.request(data, event);
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGFormSender);

/***/ }),

/***/ "./app/modules/vgmodal/js/vgmodal.js":
/*!*******************************************!*\
  !*** ./app/modules/vgmodal/js/vgmodal.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/components/backdrop */ "./app/utils/js/components/backdrop.js");
/* harmony import */ var _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/components/overflow */ "./app/utils/js/components/overflow.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");








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
class VGModal extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.mergeDeepObject)({
      button: null,
      backdrop: true,
      overflow: true,
      keyboard: true,
      ajax: {
        route: '',
        target: '',
        method: 'get'
      }
    }, params));
    this._dialog = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].find(SELECTOR_DIALOG, this._element);
    this._addEventListeners();
    this._dismissElement();
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isDisabled)(_this._element)) return;

    //this._route();

    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    if (_this._params.backdrop) {
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_3__["default"].show();
    }
    if (_this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_4__["default"].append();
    }
    if (this._isAnimated()) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    _this._element.classList.add(CLASS_NAME_SHOW);
    const completeCallBack = () => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(_this._element, 'mousedown.vg.modal', function (event) {
        const modalContent = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].get('.vg-modal-content', this);
        if (!modalContent.contains(event.target)) {
          _this.hide();
        }
      });
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true, 50);
  }
  hide() {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isDisabled)(_this._element)) return;
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    if (_this._params.backdrop) {
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_3__["default"].hide(function () {
        if (_this._params.overflow) {
          _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_4__["default"].destroy();
        }
      });
    }
    if (_this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_4__["default"].destroy();
    }
    _this._element.setAttribute('aria-expanded', false);
    _this._element.classList.remove(CLASS_NAME_SHOW);
    const completeCallback = () => {
      if (this._isAnimated()) {
        this._element.classList.remove(CLASS_NAME_FADE);
      }
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
    };
    this._queueCallback(completeCallback, this._element, this._isAnimated());
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE);
  }
  _addEventListeners() {
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== 'Escape') {
        return;
      }
      if (this._params.keyboard) {
        this.hide();
        return;
      }
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
    });
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_1__.dismissTrigger)(VGModal);

/**
 * Data API implementation
 */

_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].one(target, EVENT_KEY_HIDDEN, () => {
    this.setAttribute('aria-expanded', false);
  });
  const alreadyOpen = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].find('.vg-modal.show');
  if (alreadyOpen && alreadyOpen !== target) {
    VGModal.getInstance(alreadyOpen).hide();
  }
  const data = VGModal.getOrCreateInstance(target);
  data.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGModal);

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
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_components_responsive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/components/responsive */ "./app/utils/js/components/responsive.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");








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
class VGNav extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.mergeDeepObject)({
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
        target: '',
        method: 'get'
      }
    }, params));
    this._navigation = null;
    this.navigation = '.' + this._params.classes.wrapper;
    this.movedLinks = [];
    this.$links = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.' + this._params.classes.wrapper + ' > li', this.navigation);
    if (this._params.animation === false) {
      this._params.timeoutAnimation = 10;
    }
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
    let elm = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find(el, this._element);
    if (!elm) return;
    this._navigation = elm;
  }
  build() {
    if (!this.navigation) return;
    let params = this._params;

    // Вешаем основные классы
    this._element.classList.add(params.classes.container);
    this._element.classList.add('vg-nav-' + params.placement);

    // Если нужно оставить список меню или установить медиа точку
    if (params.breakpoint === null) {
      params.expand = false;
    }
    if (params.breakpoint === null || !params.expand) {
      this._element.classList.add(params.classes.expand);
    } else {
      this._element.classList.add('vg-nav-' + params.breakpoint);
    }

    // Меню срабатывает при наведении, если это не мобильное устройство
    if (params.hover) {
      this._element.classList.add(params.classes.hover);
      if (_utils_js_components_responsive__WEBPACK_IMPORTED_MODULE_2__["default"].checkMobileOrTablet()) {
        this._element.classList.remove(params.classes.hover);
      }
    }

    // Устанавливаем гамбургер, если его нет в разметке
    if (params.expand && !params.hamburger.body) {
      let isHamburger = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('.' + params.classes.hamburger, this._element);
      if (isHamburger === null) {
        let mTitle = '',
          hamburger = '<span class="' + params.classes.hamburger + '--lines"><span></span><span></span><span></span></span>';
        if (params.hamburger.title) {
          mTitle = '<span class="' + params.classes.hamburger + '--title">' + params.hamburger.title + '</span>';
        }
        if (params.hamburger.body !== null) {
          hamburger = params.hamburger.body;
        }
        this._element.insertAdjacentHTML('afterbegin', '<a href="#sidebar-nav" class="' + params.classes.hamburger + '" data-vg-toggle="sidebar">' + mTitle + hamburger + '</a>');
      }
    }

    // Устанавливаем указатель переключателя
    if (params.toggle) {
      let $dropdown_a = [..._utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.dropdown-mega > a, .dropdown > a', this._element)],
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
    if (params.collapse && _utils_js_components_responsive__WEBPACK_IMPORTED_MODULE_2__["default"].check(this) && params.placement !== 'vertical') {
      setCollapse(this);
    }
    if ('afterInit' in this._params.callback) {
      (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.execute)(this._params.callback.afterInit, [this]);
    }

    /**
     * Функция сворачивания
     * TODO Придумать что то с мега меню, которое уходит в подменю
     * TODO Так же есть косяки при ресайзе
     */
    function setCollapse(_this) {
      let width_navigation_responsive = _this.navigation.clientWidth,
        width_all_links_responsive = 0,
        $dots = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('.dots', _this.navigation),
        _dots = (0,_module_fn__WEBPACK_IMPORTED_MODULE_3__.getSVG)('dots');
      if (_this.$links.length) {
        if ($dots) {
          width_all_links_responsive = $dots.clientWidth;
        } else {
          let $a = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('a', _this.$links[0]),
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
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(target, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    let drop = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('.dropdown-content', target),
      link = target.firstElementChild;
    if (link) link.setAttribute('aria-expanded', 'true');
    drop.classList.add(CLASS_NAME_SHOW);
    target.classList.add(CLASS_NAME_ACTIVE);
    setDropPosition(drop);
    const completeCallBack = () => {
      drop.classList.add(CLASS_NAME_FADE);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(target, EVENT_KEY_SHOWN, relatedTarget);
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
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].off(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.noop);
      }
    }
    let element = relatedTarget.relatedTarget;
    if ('elm' in relatedTarget && relatedTarget.elm) {
      element = relatedTarget.elm;
    }
    if (element) {
      const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(element, EVENT_KEY_HIDE);
      if (hideEvent.defaultPrevented) return;
      element.classList.remove(CLASS_NAME_ACTIVE);
      if (element.classList.contains('first')) {
        element.classList.remove('first');
      }
      [..._utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.' + CLASS_NAME_SHOW, element)].forEach(function (el, index) {
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
            _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(el, EVENT_KEY_HIDDEN, relatedTarget);
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
    let drops = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.dropdown', instance._navigation);
    if (instance._params.hover) {
      [...drops].forEach(function (el) {
        let currentElem = null;
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(el, EVENT_MOUSEOVER_DATA_API, function (event) {
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
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(el, EVENT_MOUSEOUT_DATA_API, function (event) {
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
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_KEYUP_DATA_API, VGNav.clearDrops);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_CLICK_DATA_API, VGNav.clearDrops);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
        if (!_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.has(this, 'aria-expanded')) {
          return;
        }
        if ('click' in instance._params.callback) {
          (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.execute)(instance._params.callback.click, [this]);
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
          [..._utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.active', self)].forEach(function (el) {
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
    let hamburger = instance._element.querySelector('.' + instance._params.classes.hamburger);
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
    const openToggles = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].findAll('.dropdown:not(.disabled):not(:disabled).active');
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
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(window, EVENT_RESIZE_DATA_API, function (event) {
  const instance = VGNav.getOrCreateInstance('.vg-nav', {});
  instance.build();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGNav);

/***/ }),

/***/ "./app/modules/vgsidebar/js/vgsidebar.js":
/*!***********************************************!*\
  !*** ./app/modules/vgsidebar/js/vgsidebar.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/components/backdrop */ "./app/utils/js/components/backdrop.js");
/* harmony import */ var _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/components/overflow */ "./app/utils/js/components/overflow.js");








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
class VGSidebar extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      backdrop: true,
      overflow: true,
      keyboard: true,
      ajax: {
        route: '',
        target: '',
        method: 'get'
      }
    }, params));
    this._addEventListeners();
    this._dismissElement();
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(_this._element)) return;
    this._route();
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    if (_this._params.backdrop) {
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_5__["default"].show();
    }
    if (_this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_6__["default"].append();
    }
    _this._element.classList.add(CLASS_NAME_SHOW);
    const completeCallBack = () => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(_utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('.vg-backdrop'), 'mousedown.vg.backdrop', function () {
        _this.hide();
      });
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true, 50);
  }
  hide() {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(_this._element)) return;
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    if (_this._params.backdrop) {
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_5__["default"].hide(function () {
        if (_this._params.overflow) {
          _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_6__["default"].destroy();
        }
      });
    }
    if (_this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_6__["default"].destroy();
    }
    _this._element.setAttribute('aria-expanded', false);
    _this._element.classList.remove(CLASS_NAME_SHOW);
    const completeCallback = () => _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    super.dispose();
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  _addEventListeners() {
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== 'Escape') return;
      if (this._params.keyboard) {
        this.hide();
        return;
      }
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
    });
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_3__.dismissTrigger)(VGSidebar);

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].one(target, EVENT_KEY_HIDDEN, () => {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isVisible)(this)) this.focus();
    this.setAttribute('aria-expanded', false);
  });
  const alreadyOpen = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('.vg-sidebar.show');
  if (alreadyOpen && alreadyOpen !== target) {
    VGSidebar.getInstance(alreadyOpen).hide();
  }
  const data = VGSidebar.getOrCreateInstance(target);
  data.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGSidebar);

/***/ }),

/***/ "./app/utils/js/components/backdrop.js":
/*!*********************************************!*\
  !*** ./app/utils/js/components/backdrop.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");
/* harmony import */ var _dom_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _dom_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _overflow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overflow */ "./app/utils/js/components/overflow.js");




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
    if (_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('.' + CLASS_NAME)) {
      return false;
    }
    let backdrop = document.createElement('div');
    backdrop.classList.add(CLASS_NAME);
    document.body.append(backdrop);
    setTimeout(() => {
      backdrop.classList.add(CLASS_NAME_FADE);
    }, 50);
    _dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(backdrop, EVENT_MOUSEDOWN, () => {
      Backdrop.hide();
      _overflow__WEBPACK_IMPORTED_MODULE_3__["default"].destroy();
    });
  }
  static _destroy() {
    let element = _dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('.' + CLASS_NAME);
    if (!element) return;
    element.classList.remove(CLASS_NAME_FADE);
    setTimeout(() => {
      element.remove();
    }, 500);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Backdrop);

/***/ }),

/***/ "./app/utils/js/components/overflow.js":
/*!*********************************************!*\
  !*** ./app/utils/js/components/overflow.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/manipulator */ "./app/utils/js/dom/manipulator.js");


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
    let styles = _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.get(document.body, 'style');
    if (!styles) _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.remove(document.body, 'style');
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Overflow);

/***/ }),

/***/ "./app/utils/js/components/params.js":
/*!*******************************************!*\
  !*** ./app/utils/js/components/params.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");
/* harmony import */ var _dom_manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom/manipulator */ "./app/utils/js/dom/manipulator.js");


class Params {
  constructor(params, element = null) {
    this._params = this.merge(params, element);
  }
  get() {
    return this._params;
  }
  fromElement(element) {
    return (0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? _dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.get(element) : {};
  }
  merge(params, element) {
    let mParams = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(params, this.fromElement(element));
    for (let key in mParams) {
      if (key.indexOf('-') !== -1) {
        let keys = key.split('-'),
          value = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.normalizeData)(mParams[key]);
        if (keys[0] in mParams) {
          if (keys[1] in mParams[keys[0]]) {
            mParams[keys[0]][keys[1]] = value;
          }
        }
        delete mParams[key];
      }
    }
    if ('params' in mParams) {
      mParams = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(mParams, mParams.params);
      delete mParams.params;
    }
    return mParams;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Params);

/***/ }),

/***/ "./app/utils/js/components/placement.js":
/*!**********************************************!*\
  !*** ./app/utils/js/components/placement.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");


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

/***/ "./app/utils/js/components/responsive.js":
/*!***********************************************!*\
  !*** ./app/utils/js/components/responsive.js ***!
  \***********************************************/
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
    let element = module._element,
      params = module._params,
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

/***/ "./app/utils/js/dom/data.js":
/*!**********************************!*\
  !*** ./app/utils/js/dom/data.js ***!
  \**********************************/
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

/***/ "./app/utils/js/dom/event.js":
/*!***********************************!*\
  !*** ./app/utils/js/dom/event.js ***!
  \***********************************/
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

/***/ "./app/utils/js/dom/manipulator.js":
/*!*****************************************!*\
  !*** ./app/utils/js/dom/manipulator.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Manipulator: () => (/* binding */ Manipulator)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");


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
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) && name) {
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

/***/ "./app/utils/js/dom/selectors.js":
/*!***************************************!*\
  !*** ./app/utils/js/dom/selectors.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");
/**
 * Работа с DOM
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
  find(selector, element = document.documentElement) {
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(selector)) {
      return selector;
    } else {
      return Element.prototype.querySelector.call(element, selector);
    }
  },
  findAll(selector, container = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(container, selector));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) return Selectors.find(selector) ? selector : null;
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? Selectors.find(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? Selectors.findAll(selector) : [];
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Selectors);

/***/ }),

/***/ "./app/utils/js/functions.js":
/*!***********************************!*\
  !*** ./app/utils/js/functions.js ***!
  \***********************************/
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

/***/ "./app/modules/vgcollapse/scss/vgcollapse.scss":
/*!*****************************************************!*\
  !*** ./app/modules/vgcollapse/scss/vgcollapse.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/vgdropdown/scss/vgdropdown.scss":
/*!*****************************************************!*\
  !*** ./app/modules/vgdropdown/scss/vgdropdown.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/vgformsender/scss/vgformsender.scss":
/*!*********************************************************!*\
  !*** ./app/modules/vgformsender/scss/vgformsender.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/modules/vgmodal/scss/vgmodal.scss":
/*!***********************************************!*\
  !*** ./app/modules/vgmodal/scss/vgmodal.scss ***!
  \***********************************************/
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


/***/ }),

/***/ "./app/modules/vgsidebar/scss/vgsidebar.scss":
/*!***************************************************!*\
  !*** ./app/modules/vgsidebar/scss/vgsidebar.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/utils/scss/default.scss":
/*!*************************************!*\
  !*** ./app/utils/scss/default.scss ***!
  \*************************************/
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
/* harmony export */   VGCollapse: () => (/* reexport safe */ _app_modules_vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_modules_vgdropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   VGFormSender: () => (/* reexport safe */ _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   VGModal: () => (/* reexport safe */ _app_modules_vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   VGNav: () => (/* reexport safe */ _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_modules_vgsidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/utils/scss/default.scss */ "./app/utils/scss/default.scss");
/* harmony import */ var _app_modules_vgsidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/modules/vgsidebar/scss/vgsidebar.scss */ "./app/modules/vgsidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_modules_vgsidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/modules/vgsidebar/js/vgsidebar */ "./app/modules/vgsidebar/js/vgsidebar.js");
/* harmony import */ var _app_modules_vgcollapse_scss_vgcollapse_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/modules/vgcollapse/scss/vgcollapse.scss */ "./app/modules/vgcollapse/scss/vgcollapse.scss");
/* harmony import */ var _app_modules_vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/modules/vgcollapse/js/vgcollapse */ "./app/modules/vgcollapse/js/vgcollapse.js");
/* harmony import */ var _app_modules_vgnav_scss_vgnav_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app/modules/vgnav/scss/vgnav.scss */ "./app/modules/vgnav/scss/vgnav.scss");
/* harmony import */ var _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app/modules/vgnav/js/vgnav */ "./app/modules/vgnav/js/vgnav.js");
/* harmony import */ var _app_modules_vgdropdown_scss_vgdropdown_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app/modules/vgdropdown/scss/vgdropdown.scss */ "./app/modules/vgdropdown/scss/vgdropdown.scss");
/* harmony import */ var _app_modules_vgdropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app/modules/vgdropdown/js/vgdropdown */ "./app/modules/vgdropdown/js/vgdropdown.js");
/* harmony import */ var _app_modules_vgmodal_scss_vgmodal_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app/modules/vgmodal/scss/vgmodal.scss */ "./app/modules/vgmodal/scss/vgmodal.scss");
/* harmony import */ var _app_modules_vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app/modules/vgmodal/js/vgmodal */ "./app/modules/vgmodal/js/vgmodal.js");
/* harmony import */ var _app_modules_vgformsender_scss_vgformsender_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./app/modules/vgformsender/scss/vgformsender.scss */ "./app/modules/vgformsender/scss/vgformsender.scss");
/* harmony import */ var _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./app/modules/vgformsender/js/vgformsender */ "./app/modules/vgformsender/js/vgformsender.js");
// css классы по умолчанию


// vgsidebar



// vgcollapse



// nav



// dropdown



// modal



// form sender



})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUZBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDckRBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQzNDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFrREE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDMVVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdPQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvbW9kdWxlLWZuLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbW9kYWwvanMvdmdtb2RhbC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL2pzL3Znc2lkZWJhci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3cuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9wYXJhbXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9wbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9yZXNwb25zaXZlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9kYXRhLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9ldmVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZG9tL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2NvbGxhcHNlL3Njc3Mvdmdjb2xsYXBzZS5zY3NzPzhkZTYiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzP2U4MjUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvc2Nzcy92Z2Zvcm1zZW5kZXIuc2Nzcz82OTEyIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdtb2RhbC9zY3NzL3ZnbW9kYWwuc2Nzcz8xMjg5Iiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzPzE5YmMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzcz81YWNkIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzP2M2MzQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBEYXRhIGZyb20gXCIuLi91dGlscy9qcy9kb20vZGF0YVwiO1xyXG5pbXBvcnQgUGFyYW1zIGZyb20gXCIuLi91dGlscy9qcy9jb21wb25lbnRzL3BhcmFtc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtBamF4LCBnZXRTVkd9IGZyb20gXCIuL21vZHVsZS1mblwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm5cclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoZWxlbWVudCk7XHJcblx0XHRpZiAoIXRoaXMuX2VsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHRcdERhdGEuc2V0KHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVksIHRoaXMpXHJcblx0fVxyXG5cclxuXHRfZ2V0UGFyYW1zKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0cmV0dXJuIG5ldyBQYXJhbXMocGFyYW1zLCBlbGVtZW50KS5nZXQoKTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHREYXRhLnJlbW92ZSh0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZKTtcclxuXHRcdEV2ZW50SGFuZGxlci5vZmYodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5FVkVOVF9LRVkpXHJcblxyXG5cdFx0Zm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcclxuXHRcdFx0dGhpc1twcm9wZXJ0eU5hbWVdID0gbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3JvdXRlKGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRsZXQgJGNvbnRlbnQgPSBudWxsO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnYWpheCcpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIV90aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEnbWV0aG9kJyBpbiBfdGhpcy5fcGFyYW1zLmFqYXgpIHtcclxuXHRcdFx0X3RoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZCA9ICdnZXQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgndGFyZ2V0JyBpbiBfdGhpcy5fcGFyYW1zLmFqYXggJiYgX3RoaXMuX3BhcmFtcy5hamF4LnRhcmdldCkge1xyXG5cdFx0XHQkY29udGVudCA9IFNlbGVjdG9ycy5maW5kKF90aGlzLl9wYXJhbXMuYWpheC50YXJnZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNldERhdGEgPSAoZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAoJGNvbnRlbnQpICRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHR9O1xyXG5cclxuXHRcdEFqYXhbX3RoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZF0oX3RoaXMuX3BhcmFtcy5hamF4LnJvdXRlLCBfdGhpcy5fcGFyYW1zLmFqYXguZGF0YSB8fCB7fSwgZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRzZXREYXRhKGRhdGEpO1xyXG5cdFx0XHRleGVjdXRlKGNhbGxiYWNrLCBbc3RhdHVzLCBkYXRhXSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdF9kaXNtaXNzRWxlbWVudCgpIHtcclxuXHRcdGxldCBjcm9zcyA9IGdldFNWRygnY3Jvc3MnKSxcclxuXHRcdFx0YnV0dG9uID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmctYnRuLWNsb3NlJyk7XHJcblxyXG5cdFx0aWYgKGJ1dHRvbikge1xyXG5cdFx0XHRsZXQgc3ZnID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG5cdFx0XHRpZiAoIXN2ZykgYnV0dG9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgY3Jvc3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3F1ZXVlQ2FsbGJhY2soY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQgPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRcdGV4ZWN1dGVBZnRlclRyYW5zaXRpb24oY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQsIHRpbWVPdXRNcyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIERhdGEuZ2V0KFNlbGVjdG9ycy5maW5kKGVsZW1lbnQpLCB0aGlzLk5BTUVfS0VZKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHJldHVybiB0aGlzLmdldEluc3RhbmNlKGVsZW1lbnQpIHx8IG5ldyB0aGlzKGVsZW1lbnQsICFpc0VtcHR5T2JqKHBhcmFtcykgPyBwYXJhbXMgOiB7fSlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgREFUQV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gYHZnLiR7dGhpcy5OQU1FfWBcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRVZFTlRfS0VZKCkge1xyXG5cdFx0cmV0dXJuIGAuJHt0aGlzLkRBVEFfS0VZfWBcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhc2VNb2R1bGU7IiwiaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICog0KLRg9GCINGB0L7QsdGA0LDQvdGLINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDRgdC60YDQuNC/0YLRiyDQtNC70Y8g0YDQsNCx0L7RgtGLINC80L7QtNGD0LvQtdC5XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCd0LDQsdC+0YAgc3ZnINGN0LvQtdC80LXQvdGC0L7QslxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcmV0dXJucyB7Knx7fX1cclxuICovXHJcbmNvbnN0IGdldFNWRyA9IChuYW1lKSA9PiB7XHJcblx0Y29uc3Qgc3ZnID0gIHtcclxuXHRcdGVycm9yOiAnJyxcclxuXHRcdHN1Y2Nlc3M6ICcnLFxyXG5cdFx0ZG90czogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cImJpIGJpLXRocmVlLWRvdHMtdmVydGljYWxcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+PHBhdGggZD1cIk05LjUgMTNhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHptMC01YTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwelwiLz48L3N2Zz4nLFxyXG5cdFx0Y3Jvc3M6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkNhcGFfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgMjI0LjUxMiAyMjQuNTEyXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48Zz48cG9seWdvbiBwb2ludHM9XCIyMjQuNTA3LDYuOTk3IDIxNy41MjEsMCAxMTIuMjU2LDEwNS4yNTggNi45OTgsMCAwLjAwNSw2Ljk5NyAxMDUuMjYzLDExMi4yNTQgMC4wMDUsMjE3LjUxMiA2Ljk5OCwyMjQuNTEyIDExMi4yNTYsMTE5LjI0IDIxNy41MjEsMjI0LjUxMiAyMjQuNTA3LDIxNy41MTIgMTE5LjI0OSwxMTIuMjU0IFwiLz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+J1xyXG5cdH07XHJcblxyXG5cdHJldHVybiBzdmdbbmFtZV0gPz8ge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC10YjQsNC10Lwg0YHQvtCx0YvRgtC40LUgXCLQl9Cw0LrRgNGL0YLRjFwiINC90LAg0LLRgdC1INC80L7QtNCw0LvQutC4LCDRgdCw0LnQtNCx0LDRgNGLINC4INGCLtC/LlxyXG4gKiBAcGFyYW0gbW9kdWxlXHJcbiAqIEBwYXJhbSBtZXRob2RcclxuICovXHJcbmNvbnN0IGRpc21pc3NUcmlnZ2VyID0gKG1vZHVsZSwgbWV0aG9kID0gJ2hpZGUnKSA9PiB7XHJcblx0Y29uc3QgY2xpY2tFdmVudCA9IGBjbGljay5kaXNtaXNzLiR7bW9kdWxlLkVWRU5UX0tFWX1gXHJcblx0Y29uc3QgbmFtZSA9IG1vZHVsZS5OQU1FO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIGNsaWNrRXZlbnQsIGBbZGF0YS12Zy1kaXNtaXNzPVwiJHtuYW1lfVwiXWAsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcykgfHwgdGhpcy5jbG9zZXN0KGAudmctJHtuYW1lfWApXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IG1vZHVsZS5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHJcblx0XHRpbnN0YW5jZVttZXRob2RdKClcclxuXHR9KVxyXG59XHJcblxyXG4vKipcclxuICogQUpBWCBSRVFVRVNUXHJcbiAqIEB0eXBlIHt7cG9zdDogYWpheC5wb3N0LCBnZXQ6IGFqYXguZ2V0LCB4OiAoKGZ1bmN0aW9uKCk6IChYTUxIdHRwUmVxdWVzdCkpfCopLCBzZW5kOiBhamF4LnNlbmR9fVxyXG4gKi9cclxuY29uc3QgQWpheCA9IHtcclxuXHR4OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR9XHJcblx0XHRsZXQgdmVyc2lvbnMgPSBbXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNi4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNS4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuNC4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuMy4wXCIsXHJcblx0XHRcdFwiTVNYTUwyLlhtbEh0dHAuMi4wXCIsXHJcblx0XHRcdFwiTWljcm9zb2Z0LlhtbEh0dHBcIlxyXG5cdFx0XTtcclxuXHJcblx0XHRsZXQgeGhyO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KHZlcnNpb25zW2ldKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4geGhyO1xyXG5cdH0sXHJcblxyXG5cdHNlbmQ6IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrLCBtZXRob2QsIGRhdGEsIGFzeW5jKSB7XHJcblx0XHRpZiAoYXN5bmMgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRhc3luYyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRsZXQgeCA9IEFqYXgueCgpO1xyXG5cdFx0eC5vcGVuKG1ldGhvZCwgdXJsLCBhc3luYyk7XHJcblx0XHR4Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHgucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdHN3aXRjaCAoeC5zdGF0dXMpIHtcclxuXHRcdFx0XHRcdGNhc2UgMjAwOlxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnc3VjY2VzcycsIHgucmVzcG9uc2VUZXh0KVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCdlcnJvcicsIHguc3RhdHVzVGV4dClcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0eC5zZW5kKGRhdGEpXHJcblx0fSxcclxuXHJcblx0Z2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmICghaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdEFqYXguc2VuZCh1cmwgKyAocXVlcnkubGVuZ3RoID8gJz8nICsgcXVlcnkuam9pbignJicpIDogJycpLCBjYWxsYmFjaywgJ0dFVCcsIG51bGwsIGFzeW5jKVxyXG5cdH0sXHJcblxyXG5cdHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0QWpheC5zZW5kKHVybCwgY2FsbGJhY2ssICdQT1NUJywgZGF0YSwgYXN5bmMpXHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuXHRkaXNtaXNzVHJpZ2dlciwgQWpheCwgZ2V0U1ZHXHJcbn0iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnY29sbGFwc2UnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJjb2xsYXBzZVwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdDb2xsYXBzZSBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0aWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnQScgfHwgKGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LnRhZ05hbWUgPT09ICdBJykpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGxldCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKTtcclxuXHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRWR0NvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0LCB7IHRvZ2dsZTogZmFsc2UgfSkudG9nZ2xlKClcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHQ29sbGFwc2U7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIG1lcmdlRGVlcE9iamVjdCwgbm9vcH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGxhY2VtZW50IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3BsYWNlbWVudFwiO1xyXG5cclxuY29uc3QgTkFNRSAgICAgICAgICAgICA9ICdkcm9wZG93bic7XHJcbmNvbnN0IE5BTUVfS0VZICAgICAgICAgPSAndmcuZHJvcGRvd24nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgID0gJ2ZhZGUnO1xyXG5jb25zdCBUQVJHRVRfQ09OVEFJTkVSID0gJ3ZnLWRyb3Bkb3duLWNvbnRlbnQnO1xyXG5jb25zdCBQQVJFTlRfQ09OVEFJTkVSID0gJ3ZnLWRyb3Bkb3duJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl0nO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gICAgIGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWURPV05fREFUQV9BUEkgPSAgIGBrZXlkb3duLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSAgICAgYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJID0gYG1vdXNlb3Zlci4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJID0gIGBtb3VzZW91dC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0Ryb3Bkb3duIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRvZmZzZXQ6IFswLCAyXSxcclxuXHRcdFx0b3ZlcjogZmFsc2UsXHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdHBsYWNlbWVudDogJ2JvdHRvbScsXHJcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHRcdFx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdFx0XHRob3ZlcjogZmFsc2UsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcclxuXHRcdHRoaXMuX2Ryb3AgPSBTZWxlY3RvcnMuZmluZCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSLCB0aGlzLl9wYXJlbnQpO1xyXG5cdFx0dGhpcy5faXNQbGFjZW1lbnQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5fcGFyYW1zLnRpbWVvdXRBbmltYXRpb24gPSAxMFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzU2hvd24oKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9zZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9kcm9wLCB0cnVlLCA1MCk7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgIXRoaXMuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRyZXR1cm4gc3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUsIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9wYXJlbnQsIHRydWUsIHRoaXMuX3BhcmFtcy50aW1lb3V0QW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub2Zmc2V0KSB7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdUb3AgPSBfdGhpcy5fcGFyYW1zLm9mZnNldFsxXSArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdSaWdodCA9IF90aGlzLl9wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgUEFSRU5UX0NPTlRBSU5FUik7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCFpbnN0YW5jZS5fcGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRpbnN0YW5jZS5fY29tcGxldGVIaWRlKHtyZWxhdGVkVGFyZ2V0OiBpbnN0YW5jZS5fZWxlbWVudH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWURPV05fREFUQV9BUEksICcuJyArIFRBUkdFVF9DT05UQUlORVIsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl06bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHRHJvcGRvd24uZ2V0SW5zdGFuY2UodG9nZ2xlKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZHJvcCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMga2V5ZG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlzSW5wdXQgPSAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKVxyXG5cdFx0Y29uc3QgaXNFc2NhcGVFdmVudCA9IGV2ZW50LmtleSA9PT0gJ0VzY2FwZSdcclxuXHRcdGNvbnN0IGlzVXBPckRvd25FdmVudCA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXS5pbmNsdWRlcyhldmVudC5rZXkpXHJcblxyXG5cdFx0aWYgKCFpc1VwT3JEb3duRXZlbnQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzSW5wdXQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuXHRcdGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgP1xyXG5cdFx0XHR0aGlzIDogKFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5wYXJlbnROb2RlKSlcclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShnZXRUb2dnbGVCdXR0b24pXHJcblxyXG5cdFx0aWYgKGlzVXBPckRvd25FdmVudCkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5zaG93KClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2UuaGlkZSgpXHJcblx0XHRcdGdldFRvZ2dsZUJ1dHRvbi5mb2N1cygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRHJvcGRvd247IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBWR01vZGFsIGZyb20gXCIuLi8uLi92Z21vZGFsL2pzL3ZnbW9kYWxcIjtcclxuaW1wb3J0IHttZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdmb3JtLXNlbmRlcic7XHJcbmNvbnN0IE5BTUVfRlVMTCA9ICd2Z2Zvcm1zZW5kZXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5mcyc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIENsYXNzZXNcclxuICovXHJcblxyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBFdmVudHNcclxuICovXHJcbmNvbnN0IEVWRU5UX0tFWV9TVUNDRVNTID0gJ3ZnLmZzLnN1Y2Nlc3MnO1xyXG5jb25zdCBFVkVOVF9LRVlfRVJST1IgICA9ICd2Zy5mcy5lcnJvcic7XHJcbmNvbnN0IEVWRU5UX0tFWV9CRUZPUkUgID0gJ3ZnLmZzLmJlZm9yZSc7XHJcblxyXG5jb25zdCBFVkVOVF9TVUJNSVRfREFUQV9BUEkgPSBgc3VibWl0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHRm9ybVNlbmRlciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRyZWRpcmVjdDogJycsXHJcblx0XHRcdHZhbGlkYXRlOiBmYWxzZSxcclxuXHRcdFx0c3VibWl0OiBmYWxzZSxcclxuXHRcdFx0ZmllbGRzOiBbXSxcclxuXHRcdFx0YWxlcnQ6IHtcclxuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHRcdHR5cGU6ICdtb2RhbCdcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctZm9ybS1zZW5kZXInLFxyXG5cdFx0XHRcdHZhbGlkYXRpb246ICduZWVkcy12YWxpZGF0aW9uJyxcclxuXHRcdFx0XHR3YXNWYWxpZGF0ZTogJ3dhcy12YWxpZGF0ZWQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5hamF4LnJvdXRlID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdhY3Rpb24nKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdtZXRob2QnKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5fYnV0dG9uID0gU2VsZWN0b3JzLmZpbmQoJ1t0eXBlPVwic3VibWl0XCJdJywgdGhpcy5fZWxlbWVudCkgfHwgU2VsZWN0b3JzLmZpbmQoJ1tmb3JtPVwiJyArIHRoaXMuX2VsZW1lbnQuaWQgKyAnXCJdJykgfHwgbnVsbDtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuaXNCdG5UZXh0ICAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtYnRuLXRleHQnKSAhPT0gJ2ZhbHNlJztcclxuXHRcdHRoaXMuX3BhcmFtcy5pc0pzb25QYXJzZSA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnZGF0YS1qc29uLXBhcnNlJykgIT09ICdmYWxzZSc7XHJcblx0XHR0aGlzLl9wYXJhbXMuaXNTaG93UGFzcyAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtc2hvdy1wYXNzJykgPT09ICd0cnVlJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5jbGFzc2VzLmdlbmVyYWwpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMudmFsaWRhdGUpIHtcclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KHRoaXMuX2VsZW1lbnQsICdub3ZhbGlkYXRlJywgJycpO1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5fcGFyYW1zLmNsYXNzZXMudmFsaWRhdGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETyDRgdC00LXQu9Cw0YLRjCDQtNC+0LHQsNCy0LvQtdC90LjQtSDQs9C70LDQt9CwINC10YHQu9C4INC10YHRgtGMINCy0LLQvtC0INC/0LDRgNC+0LvRj1xyXG5cclxuXHRcdHJldHVybiB0aGlzXHJcblx0fVxyXG5cclxuXHRyZXF1ZXN0KGRhdGEsIGV2ZW50KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0X3RoaXMuX2FsZXJ0QmVmb3JlKCk7XHJcblxyXG5cdFx0X3RoaXMuX3BhcmFtcy5hamF4LmZpZWxkcyA9IGRhdGE7XHJcblxyXG5cdFx0X3RoaXMuX3JvdXRlKGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnd2FzLXZhbGlkYXRlZCcpO1xyXG5cclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQuZW5hYmxlZCkge1xyXG5cdFx0XHRcdGlmICh0eXBlb2Ygc3RhdHVzID09PSAnc3RyaW5nJyAmJiBzdGF0dXMgPT09ICdlcnJvcicpIHtcclxuXHRcdFx0XHRcdF90aGlzLl9hbGVydEVycm9yKGV2ZW50LCBkYXRhKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBzdGF0dXMgPT09ICdzdHJpbmcnICYmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5fYWxlcnRTdWNjZXNzKGV2ZW50LCBkYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLnJlZGlyZWN0KSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBfdGhpcy5fcGFyYW1zLnJlZGlyZWN0O1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdF9hbGVydEJlZm9yZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdiZWZvcmUnKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfQkVGT1JFLCBfdGhpcyk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRFcnJvcihldmVudCwgZGF0YSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9zdGF0dXNCdXR0b24oJ2FmdGVyJyk7XHJcblx0XHRfdGhpcy5fanNvblBhcnNlKGRhdGEsICdlcnJvcicpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9FUlJPUiwgW2V2ZW50LCBfdGhpcywgZGF0YV0pO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0U3VjY2VzcyhldmVudCwgZGF0YSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9zdGF0dXNCdXR0b24oJ2FmdGVyJyk7XHJcblx0XHRfdGhpcy5fanNvblBhcnNlKGRhdGEsICdzdWNjZXNzJyk7XHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NVQ0NFU1MsIFtldmVudCwgX3RoaXMsIGRhdGFdKTtcclxuXHR9XHJcblxyXG5cdF9zdGF0dXNCdXR0b24oc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fYnV0dG9uKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGJ0blN1Ym1pdFRleHQgPSBfdGhpcy5fYnV0dG9uLFxyXG5cdFx0XHRidG5UZXh0ID0ge1xyXG5cdFx0XHRzZW5kOiAn0J7RgtC/0YDQsNCy0LvRj9C10LwuLi4nLFxyXG5cdFx0XHR0ZXh0OiAn0J7RgtC/0YDQsNCy0LjRgtGMJ1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXNwaW5uZXInKSAmJiBzdGF0dXMgPT09ICdiZWZvcmUnKSB7XHJcblx0XHRcdF90aGlzLl9idXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgJzxzcGFuIGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMlwiPjwvc3Bhbj4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXRleHQnKSkge1xyXG5cdFx0XHRidG5UZXh0LnRleHQgPSBNYW5pcHVsYXRvci5nZXQoX3RoaXMuX2J1dHRvbiwgJ2RhdGEtdGV4dCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0ICRidG5UZXh0ID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXh0XScpO1xyXG5cdFx0XHRpZiAoJGJ0blRleHQpIHtcclxuXHRcdFx0XHRidG5UZXh0LnRleHQgPSBNYW5pcHVsYXRvci5nZXQoJGJ0blRleHQsICdkYXRhLXRleHQnKTtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0ID0gJGJ0blRleHQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXRleHQtc2VuZCcpKSB7XHJcblx0XHRcdGJ0blRleHQuc2VuZCA9IE1hbmlwdWxhdG9yLmdldChfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0LXNlbmQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCAkYnRuVGV4dFNlbmQgPSBfdGhpcy5fYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRleHQtc2VuZF0nKTtcclxuXHRcdFx0aWYgKCRidG5UZXh0U2VuZCkge1xyXG5cdFx0XHRcdGJ0blRleHQuc2VuZCA9IE1hbmlwdWxhdG9yLmdldCgkYnRuVGV4dFNlbmQsICdkYXRhLXRleHQtc2VuZCcpO1xyXG5cdFx0XHRcdGJ0blN1Ym1pdFRleHQgPSAkYnRuVGV4dFNlbmQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3RhdHVzID09PSAnYmVmb3JlJykge1xyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5pc0J0blRleHQpIHtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0LmlubmVySFRNTCA9IGJ0blRleHQuc2VuZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQoX3RoaXMuX2J1dHRvbiwnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3RhdHVzID09PSAnYWZ0ZXInKSB7XHJcblx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmlzQnRuVGV4dCkge1xyXG5cdFx0XHRcdGJ0blN1Ym1pdFRleHQuaW5uZXJIVE1MID0gYnRuVGV4dC50ZXh0O1xyXG5cdFx0XHR9XHJcblx0XHRcdE1hbmlwdWxhdG9yLnJlbW92ZShfdGhpcy5fYnV0dG9uLCdkaXNhYmxlZCcpO1xyXG5cclxuXHRcdFx0bGV0IHNwaW5uZXIgPSBfdGhpcy5fYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5zcGlubmVyLWJvcmRlcicpO1xyXG5cdFx0XHRpZiAoc3Bpbm5lcikgc3Bpbm5lci5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9qc29uUGFyc2UoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuaXNKc29uUGFyc2UgJiYgdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGxldCBwYXJzZXJEYXRhID0ge307XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHBhcnNlckRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cdFx0XHRcdF90aGlzLmFsZXJ0KHBhcnNlckRhdGEsIHN0YXR1cyk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRfdGhpcy5hbGVydChkYXRhLCBzdGF0dXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRfdGhpcy5hbGVydChkYXRhLCBzdGF0dXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YWxlcnQoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fcGFyYW1zLmFsZXJ0LmVuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdtb2RhbCcpIHtcclxuXHRcdFx0X3RoaXMuX2FsZXJ0TW9kYWwoZGF0YSwgc3RhdHVzKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdjb2xsYXBzZScpIHtcclxuXHRcdFx0X3RoaXMuX2FsZXJ0Q29sbGFwc2UoZGF0YSwgc3RhdHVzKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2FsZXJ0TW9kYWwoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0Ly8g0JXRgdGC0Ywg0LvQuCDQvtGC0LrRgNGL0YLRi9C1INC80L7QtNCw0LvQutC4LCDQt9Cw0LrRgNGL0LLQsNC10LxcclxuXHRcdFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbCcpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdGlmIChlbGVtZW50ICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcclxuXHRcdFx0XHRsZXQgbUJTID0gYm9vdHN0cmFwLk1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCk7XHJcblx0XHRcdFx0bUJTLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3ZnLW1vZGFsJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdGNvbnN0IG1WRyA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50KTtcclxuXHRcdFx0XHRtVkcuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyDQpNC+0YDQvNC40YDRg9C10Lwg0L3QvtCy0YPRjiDQvNC+0LTQsNC70LrRgyDQuCDQvtGC0LrRgNGL0LLQsNC10Lwg0LXRkVxyXG5cdH1cclxuXHJcblx0X2FsZXJ0Q29sbGFwc2UoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coX3RoaXMuX3BhcmFtcy5hbGVydC50eXBlKVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBwYXJhbXNcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR0Zvcm1TZW5kZXIuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHR9XHJcbn1cclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfU1VCTUlUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoIU1hbmlwdWxhdG9yLmhhcyhldmVudC50YXJnZXQsICdkYXRhLXZnZm9ybXNlbmRlcicpKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHRm9ybVNlbmRlci5nZXRPckNyZWF0ZUluc3RhbmNlKGV2ZW50LnRhcmdldCwge30pO1xyXG5cdGlmICghaW5zdGFuY2UpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmIChpbnN0YW5jZS5fcGFyYW1zLnZhbGlkYXRlKSB7XHJcblx0XHRpZiAoIWluc3RhbmNlLl9lbGVtZW50LmNoZWNrVmFsaWRpdHkoKSkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHRcdGluc3RhbmNlLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoaW5zdGFuY2UuX3BhcmFtcy5jbGFzc2VzLndhc1ZhbGlkYXRlKTtcclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0IGNvbGxlY3REYXRhID0gZnVuY3Rpb24oZGF0YSwgZmllbGRzKSB7XHJcblx0XHRmb3IgKGxldCBuYW1lIGluIGZpZWxkcykge1xyXG5cdFx0XHRpZiAodHlwZW9mIGZpZWxkc1tuYW1lXSA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrZXkgaW4gZmllbGRzW25hbWVdKSB7XHJcblx0XHRcdFx0XHRsZXQgYXJyID0gT2JqZWN0LmtleXMoZmllbGRzW25hbWVdW2tleV0pLm1hcChmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmllbGRzW25hbWVdW2tleV1baV07XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGRhdGEuYXBwZW5kKG5hbWUsIGFycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRhdGEuYXBwZW5kKG5hbWUsIGZpZWxkc1tuYW1lXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9XHJcblxyXG5cdGlmICghaW5zdGFuY2UuX3BhcmFtcy5zdWJtaXQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0bGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoaW5zdGFuY2UuX2VsZW1lbnQpO1xyXG5cdFx0aWYgKHR5cGVvZiBpbnN0YW5jZS5fcGFyYW1zLmFqYXguZmllbGRzID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRkYXRhID0gY29sbGVjdERhdGEoZGF0YSwgaW5zdGFuY2UuX3BhcmFtcy5hamF4LmZpZWxkcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGluc3RhbmNlLnJlcXVlc3QoZGF0YSwgZXZlbnQpO1xyXG5cdH1cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRm9ybVNlbmRlcjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ21vZGFsJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubW9kYWwnO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xyXG5jb25zdCBTRUxFQ1RPUl9ESUFMT0cgPSAnLnZnLW1vZGFsLWRpYWxvZydcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwibW9kYWxcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHTW9kYWwgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YnV0dG9uOiBudWxsLFxyXG5cdFx0XHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRcdFx0b3ZlcmZsb3c6IHRydWUsXHJcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9kaWFsb2cgPSBTZWxlY3RvcnMuZmluZChTRUxFQ1RPUl9ESUFMT0csIHRoaXMuX2VsZW1lbnQpXHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Ly90aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5hcHBlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5faXNBbmltYXRlZCgpKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oX3RoaXMuX2VsZW1lbnQsICdtb3VzZWRvd24udmcubW9kYWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRjb25zdCBtb2RhbENvbnRlbnQgPSBTZWxlY3RvcnMuZ2V0KCcudmctbW9kYWwtY29udGVudCcsIHRoaXMpO1xyXG5cdFx0XHRcdGlmICghbW9kYWxDb250ZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcclxuXHRcdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2VsZW1lbnQsIHRydWUsIDUwKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLl9pc0FuaW1hdGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fZWxlbWVudCwgdGhpcy5faXNBbmltYXRlZCgpKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfaXNBbmltYXRlZCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0ZBREUpXHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWR01vZGFsKVxyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kKCcudmctbW9kYWwuc2hvdycpXHJcblx0aWYgKGFscmVhZHlPcGVuICYmIGFscmVhZHlPcGVuICE9PSB0YXJnZXQpIHtcclxuXHRcdFZHTW9kYWwuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcylcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHTW9kYWw7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBSZXNwb25zaXZlIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3Jlc3BvbnNpdmVcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdCwgbm9vcCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICduYXYnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5uYXYnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICAgPSAnZmFkZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJy52Zy1uYXYgYSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSAgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTSVpFX0RBVEFfQVBJID0gYHJlc2l6ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR05hdiBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50KTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YnJlYWtwb2ludDogJ2xnJyxcclxuXHRcdFx0cGxhY2VtZW50OiAnaG9yaXpvbnRhbCcsXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRoYW1idXJnZXJBY3RpdmU6ICd2Zy1uYXYtaGFtYnVyZ2VyLWFjdGl2ZScsXHJcblx0XHRcdFx0aGFtYnVyZ2VyOiAndmctbmF2LWhhbWJ1cmdlcicsXHJcblx0XHRcdFx0Y29udGFpbmVyOiAndmctbmF2LWNvbnRhaW5lcicsXHJcblx0XHRcdFx0d3JhcHBlcjogJ3ZnLW5hdi13cmFwcGVyJyxcclxuXHRcdFx0XHRhY3RpdmU6ICd2Zy1uYXYtYWN0aXZlJyxcclxuXHRcdFx0XHRleHBhbmQ6ICd2Zy1uYXYtZXhwYW5kJyxcclxuXHRcdFx0XHRjbG9uZWQ6ICd2Zy1uYXYtY2xvbmVkJyxcclxuXHRcdFx0XHRob3ZlcjogJ3ZnLW5hdi1ob3ZlcicsXHJcblx0XHRcdFx0ZmxpcDogJ3ZnLW5hdi1mbGlwJyxcclxuXHRcdFx0XHRYWFhMOiAndmctbmF2LXh4eGwnLFxyXG5cdFx0XHRcdFhYTDogJ3ZnLW5hdi14eGwnLFxyXG5cdFx0XHRcdFhMOiAndmctbmF2LXhsJyxcclxuXHRcdFx0XHRMRzogJ3ZnLW5hdi1sZycsXHJcblx0XHRcdFx0TUQ6ICd2Zy1uYXYtbWQnLFxyXG5cdFx0XHRcdFNNOiAndmctbmF2LXNtJyxcclxuXHRcdFx0XHRYUzogJ3ZnLW5hdi14cydcclxuXHRcdFx0fSxcclxuXHRcdFx0ZXhwYW5kOiB0cnVlLFxyXG5cdFx0XHRob3ZlcjogZmFsc2UsXHJcblx0XHRcdHBvc2l0aW9uOiB0cnVlLFxyXG5cdFx0XHRjb2xsYXBzZTogdHJ1ZSxcclxuXHRcdFx0dG9nZ2xlOiAnPHNwYW4gY2xhc3M9XCJkZWZhdWx0XCI+PC9zcGFuPicsXHJcblx0XHRcdGhhbWJ1cmdlcjoge1xyXG5cdFx0XHRcdHRpdGxlOiAnJyxcclxuXHRcdFx0XHRib2R5OiBudWxsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNhbGxiYWNrOiBub29wLFxyXG5cdFx0XHRhbmltYXRpb246IHRydWUsXHJcblx0XHRcdHRpbWVvdXRBbmltYXRpb246IDMwMCxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IG51bGw7XHJcblx0XHR0aGlzLm5hdmlnYXRpb24gPSAnLicgKyB0aGlzLl9wYXJhbXMuY2xhc3Nlcy53cmFwcGVyO1xyXG5cclxuXHRcdHRoaXMubW92ZWRMaW5rcyA9IFtdO1xyXG5cdFx0dGhpcy4kbGlua3MgPSBTZWxlY3RvcnMuZmluZEFsbCgnLicgKyB0aGlzLl9wYXJhbXMuY2xhc3Nlcy53cmFwcGVyICsgJyA+IGxpJywgdGhpcy5uYXZpZ2F0aW9uKVxyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLl9wYXJhbXMudGltZW91dEFuaW1hdGlvbiA9IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHRnZXQgbmF2aWdhdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9uYXZpZ2F0aW9uO1xyXG5cdH1cclxuXHJcblx0c2V0IG5hdmlnYXRpb24oZWwpIHtcclxuXHRcdGxldCBlbG0gPSBTZWxlY3RvcnMuZmluZChlbCwgdGhpcy5fZWxlbWVudCk7XHJcblx0XHRpZiAoIWVsbSkgcmV0dXJuO1xyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IGVsbTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0aWYgKCF0aGlzLm5hdmlnYXRpb24pIHJldHVybjtcclxuXHJcblx0XHRsZXQgcGFyYW1zID0gdGhpcy5fcGFyYW1zO1xyXG5cclxuXHRcdC8vINCS0LXRiNCw0LXQvCDQvtGB0L3QvtCy0L3Ri9C1INC60LvQsNGB0YHRi1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmNvbnRhaW5lcik7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLnBsYWNlbWVudCk7XHJcblxyXG5cdFx0Ly8g0JXRgdC70Lgg0L3Rg9C20L3QviDQvtGB0YLQsNCy0LjRgtGMINGB0L/QuNGB0L7QuiDQvNC10L3RjiDQuNC70Lgg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0LzQtdC00LjQsCDRgtC+0YfQutGDXHJcblx0XHRpZiAocGFyYW1zLmJyZWFrcG9pbnQgPT09IG51bGwpIHtcclxuXHRcdFx0cGFyYW1zLmV4cGFuZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXJhbXMuYnJlYWtwb2ludCA9PT0gbnVsbCB8fCAhcGFyYW1zLmV4cGFuZCkge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuZXhwYW5kKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbmF2LScgKyBwYXJhbXMuYnJlYWtwb2ludCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g0JzQtdC90Y4g0YHRgNCw0LHQsNGC0YvQstCw0LXRgiDQv9GA0Lgg0L3QsNCy0LXQtNC10L3QuNC4LCDQtdGB0LvQuCDRjdGC0L4g0L3QtSDQvNC+0LHQuNC70YzQvdC+0LUg0YPRgdGC0YDQvtC50YHRgtCy0L5cclxuXHRcdGlmIChwYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHJcblx0XHRcdGlmIChSZXNwb25zaXZlLmNoZWNrTW9iaWxlT3JUYWJsZXQoKSkge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShwYXJhbXMuY2xhc3Nlcy5ob3Zlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQs9Cw0LzQsdGD0YDQs9C10YAsINC10YHQu9C4INC10LPQviDQvdC10YIg0LIg0YDQsNC30LzQtdGC0LrQtVxyXG5cdFx0aWYgKHBhcmFtcy5leHBhbmQgJiYgIXBhcmFtcy5oYW1idXJnZXIuYm9keSkge1xyXG5cdFx0XHRsZXQgaXNIYW1idXJnZXIgPSBTZWxlY3RvcnMuZmluZCgnLicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIsIHRoaXMuX2VsZW1lbnQpO1xyXG5cclxuXHRcdFx0aWYgKGlzSGFtYnVyZ2VyID09PSBudWxsKSB7XHJcblx0XHRcdFx0bGV0IG1UaXRsZSA9ICcnLFxyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLWxpbmVzXCI+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PC9zcGFuPic7XHJcblxyXG5cdFx0XHRcdGlmIChwYXJhbXMuaGFtYnVyZ2VyLnRpdGxlKSB7XHJcblx0XHRcdFx0XHRtVGl0bGUgPSAnPHNwYW4gY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJy0tdGl0bGVcIj4nKyBwYXJhbXMuaGFtYnVyZ2VyLnRpdGxlICsnPC9zcGFuPic7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci5ib2R5ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRoYW1idXJnZXIgPSBwYXJhbXMuaGFtYnVyZ2VyLmJvZHk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsJzxhIGhyZWY9XCIjc2lkZWJhci1uYXZcIiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnXCIgZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCI+JyArIG1UaXRsZSArIGhhbWJ1cmdlciArJzwvYT4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INGD0LrQsNC30LDRgtC10LvRjCDQv9C10YDQtdC60LvRjtGH0LDRgtC10LvRj1xyXG5cdFx0aWYgKHBhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0bGV0ICRkcm9wZG93bl9hID0gWy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd24tbWVnYSA+IGEsIC5kcm9wZG93biA+IGEnLCB0aGlzLl9lbGVtZW50KV0sXHJcblx0XHRcdFx0dG9nZ2xlID0gJzxzcGFuIGNsYXNzPVwidG9nZ2xlXCI+JyArIHBhcmFtcy50b2dnbGUgKyAnPC9zcGFuPic7XHJcblxyXG5cdFx0XHRpZiAoJGRyb3Bkb3duX2EubGVuZ3RoKSB7XHJcblx0XHRcdFx0JGRyb3Bkb3duX2EuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xyXG5cdFx0XHRcdFx0aWYgKCFlbGVtLnF1ZXJ5U2VsZWN0b3IoJy50b2dnbGUnKSAmJiAhZWxlbS5jbG9zZXN0KCcuZG90cycpKSB7XHJcblx0XHRcdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcclxuXHRcdFx0XHRcdFx0ZWxlbS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRvZ2dsZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXJhbXMuY29sbGFwc2UgJiYgUmVzcG9uc2l2ZS5jaGVjayh0aGlzKSAmJiBwYXJhbXMucGxhY2VtZW50ICE9PSAndmVydGljYWwnKSB7XHJcblx0XHRcdHNldENvbGxhcHNlKHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnYWZ0ZXJJbml0JyBpbiB0aGlzLl9wYXJhbXMuY2FsbGJhY2spIHtcclxuXHRcdFx0ZXhlY3V0ZSh0aGlzLl9wYXJhbXMuY2FsbGJhY2suYWZ0ZXJJbml0LCBbdGhpc10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICog0KTRg9C90LrRhtC40Y8g0YHQstC+0YDQsNGH0LjQstCw0L3QuNGPXHJcblx0XHQgKiBUT0RPINCf0YDQuNC00YPQvNCw0YLRjCDRh9GC0L4g0YLQviDRgSDQvNC10LPQsCDQvNC10L3Rjiwg0LrQvtGC0L7RgNC+0LUg0YPRhdC+0LTQuNGCINCyINC/0L7QtNC80LXQvdGOXHJcblx0XHQgKiBUT0RPINCi0LDQuiDQttC1INC10YHRgtGMINC60L7RgdGP0LrQuCDQv9GA0Lgg0YDQtdGB0LDQudC30LVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0Q29sbGFwc2UoX3RoaXMpIHtcclxuXHRcdFx0bGV0IHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSA9IF90aGlzLm5hdmlnYXRpb24uY2xpZW50V2lkdGgsXHJcblx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAwLFxyXG5cdFx0XHRcdCRkb3RzID0gU2VsZWN0b3JzLmZpbmQoJy5kb3RzJywgX3RoaXMubmF2aWdhdGlvbiksXHJcblx0XHRcdFx0X2RvdHMgPSBnZXRTVkcoJ2RvdHMnKTtcclxuXHJcblx0XHRcdGlmIChfdGhpcy4kbGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9ICRkb3RzLmNsaWVudFdpZHRoXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCAkYSA9IFNlbGVjdG9ycy5maW5kKCdhJywgX3RoaXMuJGxpbmtzWzBdKSxcclxuXHRcdFx0XHRcdFx0JGxpbmtTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoJGEpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nTGVmdCA9IG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nTGVmdC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nUmlnaHQgPSAgbm9ybWFsaXplRGF0YSgkbGlua1N0eWxlLnBhZGRpbmdSaWdodC5zbGljZSgwLCAtMikpLFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nID0gcGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQ7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQstC10YDQvdC+LCDQvdC+INC80Ysg0YLQvtGH0L3QviDQt9C90LDQtdC8INGI0LjRgNC40L3RgyDRgtC+0YfQtdC6INCyIHN2ZyAtIDE2cHhcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gcGFkZGluZyArIDE2O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgJGxpbmsgb2YgX3RoaXMuJGxpbmtzKSB7XHJcblx0XHRcdFx0XHRsZXQgd2lkdGggPSAkbGluay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgKyB3aWR0aDtcclxuXHJcblx0XHRcdFx0XHRpZiAoKHdpZHRoX25hdmlnYXRpb25fcmVzcG9uc2l2ZSkgPCB3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlZExpbmtzLnB1c2goJGxpbmspO1xyXG5cdFx0XHRcdFx0XHQkbGluay5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRCZWZvcmUoX3RoaXMubW92ZWRMaW5rc1swXSwgJGRvdHMpXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uYXBwZW5kQ2hpbGQoX3RoaXMubW92ZWRMaW5rc1swXSlcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5zcGxpY2UoMCwgMSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0aWYgKCEkZG90cykge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywnPGxpIGNsYXNzPVwiZHJvcGRvd24gZG90c1wiPicgKyAnPGEgaHJlZj1cIiNcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4nKyBfZG90cyArJzwvYT48L2xpPicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0JGRvdHMucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgJGQgPSBfdGhpcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5kb3RzJyk7XHJcblx0XHRcdFx0aWYgKCRkICYmIF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gJGQucXVlcnlTZWxlY3RvcigndWwnKTtcclxuXHRcdFx0XHRcdGlmICgkZHJvcGRvd24pIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBfdGhpcy5tb3ZlZExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdFx0JGRyb3Bkb3duLnByZXBlbmQobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCAkZHJvcGRvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgnZHJvcGRvd24tY29udGVudCcpO1xyXG5cdFx0XHRcdFx0XHQkZHJvcGRvd24uY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQkZC5hcHBlbmRDaGlsZCgkZHJvcGRvd24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRsZXQgdGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICghdGFyZ2V0IHx8IGlzRGlzYWJsZWQodGFyZ2V0KSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duLWNvbnRlbnQnKSkge1xyXG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCgnZmlyc3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRsZXQgZHJvcCA9IFNlbGVjdG9ycy5maW5kKCcuZHJvcGRvd24tY29udGVudCcsIHRhcmdldCksXHJcblx0XHRcdGxpbmsgPSB0YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG5cdFx0aWYgKGxpbmspIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuXHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cclxuXHRcdHNldERyb3BQb3NpdGlvbihkcm9wKVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdGRyb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0YXJnZXQsIEVWRU5UX0tFWV9TSE9XTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgZHJvcCwgdHJ1ZSwgNTApO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSAkZHJvcFxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBzZXREcm9wUG9zaXRpb24oJGRyb3ApIHtcclxuXHRcdFx0bGV0IHt3aWR0aCwgcmlnaHR9ID0gJGRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdFx0d2luZG93X3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG5cdFx0XHRsZXQgTl9yaWdodCA9IHdpbmRvd193aWR0aCAtIHJpZ2h0IC0gd2lkdGg7XHJcblxyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodCcpO1xyXG5cdFx0XHQkZHJvcC5jbGFzc0xpc3QucmVtb3ZlKCdsZWZ0Jyk7XHJcblxyXG5cdFx0XHRsZXQgJHBhcmVudCA9ICRkcm9wLmNsb3Nlc3QoJ2xpJyksXHJcblx0XHRcdFx0JHVsID0gJHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCd1bCcpO1xyXG5cclxuXHRcdFx0aWYgKE5fcmlnaHQgPiB3aWR0aCkge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCAkZWwgb2YgJHVsKSB7XHJcblx0XHRcdFx0XHQkZWwuY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoJ2VsbScgaW4gcmVsYXRlZFRhcmdldCAmJiByZWxhdGVkVGFyZ2V0LmVsbSkge1xyXG5cdFx0XHRlbGVtZW50ID0gcmVsYXRlZFRhcmdldC5lbG1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZWxlbWVudCkge1xyXG5cdFx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihlbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZmlyc3QnKSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlyc3QnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuJyArIENMQVNTX05BTUVfU0hPVywgZWxlbWVudCldLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xyXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRcdFx0bGV0IHBhcmVudCA9IGVsLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGxpbmsgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cdFx0XHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0XHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoZWwsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0X3RoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgZWwsIHRydWUsIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRPRE8g0LXRgdC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtC1INC90LXRgdC60L7Qu9GM0LrQviDQvdCw0LLQuNCz0LDRhtC40LksINGC0L4g0LXRgdGC0Ywg0LrQvtGB0Y/QutC4XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdOYXYuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHJcblx0XHRsZXQgZHJvcHMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duJywgaW5zdGFuY2UuX25hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0Wy4uLmRyb3BzXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdGxldCBjdXJyZW50RWxlbSA9IG51bGw7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsLCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRWR05hdi5oaWRlT3BlbkRyb3BzKGV2ZW50KTtcclxuXHJcblx0XHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWluc3RhbmNlLm5hdmlnYXRpb24uY29udGFpbnModGFyZ2V0KSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSB0YXJnZXQ7XHJcblxyXG5cdFx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRhcmdldFxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGluc3RhbmNlLnNob3cocmVsYXRlZFRhcmdldCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsLCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bicpLFxyXG5cdFx0XHRcdFx0XHRlbG0gPSBjdXJyZW50RWxlbTtcclxuXHJcblx0XHRcdFx0XHR3aGlsZSAocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVsYXRlZFRhcmdldCA9PT0gY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IG51bGw7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5oaWRlKHtyZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBlbG06IGVsbX0pO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgVkdOYXYuY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIU1hbmlwdWxhdG9yLmhhcyh0aGlzLCAnYXJpYS1leHBhbmRlZCcpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoJ2NsaWNrJyBpbiBpbnN0YW5jZS5fcGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdFx0XHRleGVjdXRlKGluc3RhbmNlLl9wYXJhbXMuY2FsbGJhY2suY2xpY2ssIFt0aGlzXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXMuY2xvc2VzdCgnLnZnLW5hdicpLFxyXG5cdFx0XHRcdFx0aXNGaXJzdCA9IHNlbGYucXVlcnlTZWxlY3RvcignLmZpcnN0Jyk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSB0aGlzLmNsb3Nlc3QoJy5kcm9wZG93bicpO1xyXG5cdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGlmIChpc0Rpc2FibGVkKHRhcmdldCkgJiYgIWlzVmlzaWJsZSh0YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaXNGaXJzdCAmJiB0aGlzLmNsb3Nlc3QoJy5maXJzdCcpKSB7XHJcblx0XHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogdGFyZ2V0fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Wy4uLlNlbGVjdG9ycy5maW5kQWxsKCcuYWN0aXZlJywgc2VsZildLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlbCAmJiBlbCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogZWx9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB2Z05hdlNpZGViYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhci1uYXYnKTtcclxuXHRcdGxldCBoYW1idXJnZXIgPSBpbnN0YW5jZS5fZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIGluc3RhbmNlLl9wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIpO1xyXG5cclxuXHRcdGlmICh2Z05hdlNpZGViYXIgJiYgaGFtYnVyZ2VyKSB7XHJcblx0XHRcdHZnTmF2U2lkZWJhci5hZGRFdmVudExpc3RlbmVyKCd2Zy5zaWRlYmFyLnNob3cnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyLmNsYXNzTGlzdC5hZGQoaW5zdGFuY2UucGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyQWN0aXZlKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5oaWRlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKGluc3RhbmNlLnBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGNsZWFyRHJvcHMoZXZlbnQpIHtcclxuXHRcdGlmIChldmVudC5idXR0b24gPT09IDIgfHwgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5ICE9PSAnVGFiJykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0VkdOYXYuaGlkZU9wZW5Ecm9wcyhldmVudClcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlT3BlbkRyb3BzKGV2ZW50KSB7XHJcblx0XHRjb25zdCBvcGVuVG9nZ2xlcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd246bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuYWN0aXZlJyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHTmF2LmdldEluc3RhbmNlKHRvZ2dsZS5jbG9zZXN0KCcudmctbmF2JykpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdG9nZ2xlIH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5oaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9SRVNJWkVfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IGluc3RhbmNlID0gVkdOYXYuZ2V0T3JDcmVhdGVJbnN0YW5jZSgnLnZnLW5hdicsIHt9KTtcclxuXHRpbnN0YW5jZS5idWlsZCgpO1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdOYXY7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvYmFja2Ryb3BcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL292ZXJmbG93XCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ3NpZGViYXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5zaWRlYmFyJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cInNpZGViYXJcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR1NpZGViYXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdG92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5hcHBlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKFNlbGVjdG9ycy5maW5kKCcudmctYmFja2Ryb3AnKSwgJ21vdXNlZG93bi52Zy5iYWNrZHJvcCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2VsZW1lbnQsIHRydWUsIDUwKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykgcmV0dXJuO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEKVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWR1NpZGViYXIpO1xyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHRpZiAoaXNWaXNpYmxlKHRoaXMpKSB0aGlzLmZvY3VzKCk7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kKCcudmctc2lkZWJhci5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VkdTaWRlYmFyLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWR1NpZGViYXIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCJpbXBvcnQge2V4ZWN1dGV9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi9kb20vZXZlbnRcIjtcclxuaW1wb3J0IE92ZXJmbG93IGZyb20gXCIuL292ZXJmbG93XCI7XHJcblxyXG5jb25zdCBOQU1FID0gJ2JhY2tkcm9wJ1xyXG5jb25zdCBDTEFTU19OQU1FID0gJ3ZnLWJhY2tkcm9wJ1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcclxuY29uc3QgRVZFTlRfTU9VU0VET1dOID0gYG1vdXNlZG93bi52Zy4ke05BTUV9YFxyXG5cclxuY2xhc3MgQmFja2Ryb3Age1xyXG5cdHN0YXRpYyBzaG93KGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fYXBwZW5kKClcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGUoY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9kZXN0cm95KCk7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfYXBwZW5kKCkge1xyXG5cdFx0aWYgKFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFja2Ryb3ApO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSlcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24oYmFja2Ryb3AsIEVWRU5UX01PVVNFRE9XTiwgKCkgPT4ge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKClcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2Rlc3Ryb3koKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUUpO1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja2Ryb3A7IiwiaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgT3ZlcmZsb3dcclxuICog0JfQsNC/0YDQtdGJ0LDQtdGCINGB0LrRgNC+0LvQu9C40L3QsyDQuCDRg9Cx0LjRgNCw0LXRgiDQtdCz0L4sINC60L7QvNC/0LXQvdGB0LjRgNGD0Y8g0L7RgtGB0YLRg9C/0L7QvFxyXG4gKi9cclxuXHJcbmNsYXNzIE92ZXJmbG93IHtcclxuXHRzdGF0aWMgYXBwZW5kKCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBnZXRXaWR0aCgpICsgJ3B4JztcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcblx0XHRmdW5jdGlvbiBnZXRXaWR0aCgpIHtcclxuXHRcdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cdFx0XHRyZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGRlc3Ryb3koKSB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG5cclxuXHRcdGxldCBzdHlsZXMgPSBNYW5pcHVsYXRvci5nZXQoZG9jdW1lbnQuYm9keSwgJ3N0eWxlJyk7XHJcblx0XHRpZiAoIXN0eWxlcykgTWFuaXB1bGF0b3IucmVtb3ZlKGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3ZlcmZsb3c7IiwiaW1wb3J0IHtpc0VsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vZG9tL21hbmlwdWxhdG9yXCI7XHJcblxyXG5jbGFzcyBQYXJhbXMge1xyXG5cdGNvbnN0cnVjdG9yKHBhcmFtcywgZWxlbWVudCA9IG51bGwpIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMubWVyZ2UocGFyYW1zLCBlbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdGdldCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9wYXJhbXM7XHJcblx0fVxyXG5cclxuXHRmcm9tRWxlbWVudChlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gaXNFbGVtZW50KGVsZW1lbnQpID8gTWFuaXB1bGF0b3IuZ2V0KGVsZW1lbnQpIDoge307XHJcblx0fVxyXG5cclxuXHRtZXJnZShwYXJhbXMsIGVsZW1lbnQpIHtcclxuXHRcdGxldCBtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHBhcmFtcywgdGhpcy5mcm9tRWxlbWVudChlbGVtZW50KSk7XHJcblxyXG5cdFx0Zm9yIChsZXQga2V5IGluIG1QYXJhbXMpIHtcclxuXHRcdFx0aWYgKGtleS5pbmRleE9mKCctJykgIT09IC0xKSB7XHJcblx0XHRcdFx0bGV0IGtleXMgPSBrZXkuc3BsaXQoJy0nKSxcclxuXHRcdFx0XHRcdHZhbHVlID0gbm9ybWFsaXplRGF0YShtUGFyYW1zW2tleV0pO1xyXG5cclxuXHRcdFx0XHRpZiAoa2V5c1swXSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdFx0XHRpZiAoa2V5c1sxXSBpbiBtUGFyYW1zW2tleXNbMF1dKSB7XHJcblx0XHRcdFx0XHRcdG1QYXJhbXNba2V5c1swXV1ba2V5c1sxXV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2tleV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ3BhcmFtcycgaW4gbVBhcmFtcykge1xyXG5cdFx0XHRtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KG1QYXJhbXMsIG1QYXJhbXMucGFyYW1zKTtcclxuXHRcdFx0ZGVsZXRlIG1QYXJhbXMucGFyYW1zO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBtUGFyYW1zO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGFyYW1zOyIsImltcG9ydCB7bWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JrQu9Cw0YHRgSBQbGFjZW1lbnQsINC+0L/RgNC10LTQtdC70Y/QtdGCINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC80LXRgdGC0L7Qv9C+0LvQvtC20LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQvdCwINGB0YLRgNCw0L3QuNGG0LUuXHJcbiAqIFRPRE8g0LrQu9Cw0YHRgSDQvdC1INC00L7Qv9C40YHQsNC9XHJcbiAqL1xyXG5cclxuY2xhc3MgUGxhY2VtZW50IHtcclxuXHRjb25zdHJ1Y3RvcihhcmcgPSB7fSkge1xyXG5cdFx0dGhpcy5wYXJhbXMgPSBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRlbGVtZW50OiBudWxsLFxyXG5cdFx0XHRkcm9wOiBudWxsXHJcblx0XHR9LCBhcmcpO1xyXG5cdH1cclxuXHJcblx0X2dldFBsYWNlbWVudCgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGNvbnN0IF9wYXJlbnQgPSAoc2VsZikgPT4ge1xyXG5cdFx0XHRsZXQgcGFyZW50ID0gc2VsZi5wYXJlbnROb2RlLFxyXG5cdFx0XHRcdG92ZXJmbG93ID0gZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnQpLm92ZXJmbG93O1xyXG5cclxuXHRcdFx0aWYgKHBhcmVudC50YWdOYW1lICE9PSAnQk9EWScpIHtcclxuXHRcdFx0XHRpZiAob3ZlcmZsb3cgPT09ICd2aXNpYmxlJykge1xyXG5cdFx0XHRcdFx0X3BhcmVudChwYXJlbnQpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJlbnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGlzRml4ZWQgPSBmYWxzZSwgdG9wLCBsZWZ0LFxyXG5cdFx0XHRib3VuZHMgPSBfdGhpcy5wYXJhbXMuZHJvcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuXHRcdFx0cGFyZW50ID0gX3RoaXMucGFyYW1zLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0aWYgKF9wYXJlbnQoX3RoaXMucGFyYW1zLmVsZW1lbnQpKSB7XHJcblx0XHRcdGlzRml4ZWQgPSB0cnVlO1xyXG5cdFx0XHR0b3AgPSBib3VuZHMudG9wO1xyXG5cdFx0XHRsZWZ0ID0gYm91bmRzLmxlZnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShfdGhpcy5wYXJhbXMuZHJvcCk7XHJcblx0XHRcdHRvcCA9IG5vcm1hbGl6ZURhdGEoc3R5bGVzLnRvcC5zbGljZSgwLCAtMikpO1xyXG5cdFx0XHRsZWZ0ID0gbm9ybWFsaXplRGF0YShzdHlsZXMubGVmdC5zbGljZSgwLCAtMikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgoYm91bmRzLmxlZnQgKyBib3VuZHMud2lkdGgpID4gd2luZG93LmlubmVyV2lkdGgpIHtcclxuXHRcdFx0bGVmdCA9IHBhcmVudC53aWR0aCAtIGJvdW5kcy53aWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpc0ZpeGVkOiBpc0ZpeGVkLFxyXG5cdFx0XHR0b3A6IHRvcCxcclxuXHRcdFx0bGVmdDogbGVmdFxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGxhY2VtZW50OyIsIi8qKlxyXG4gKiDQmtC70LDRgdGBIFJlc3BvbnNpdmUsINGA0LDQsdC+0YLQsNC10YIg0L/QviDRgtCw0LrQuNC8INC20LUg0LzQtdC00LjQsCDRgtC+0YfQutCw0LwsINGH0YLQviDQuCBib290c3RyYXBcclxuICog0Lgg0L7Qv9GA0LXQtNC10LvRj9C10YIg0L3QsCDRgtCw0Ycg0YPRgdGC0YDQvtC50YHRgtCy0LAuXHJcbiAqL1xyXG5cclxuY2xhc3MgUmVzcG9uc2l2ZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmJyZWFrcG9pbnRzID0ge1xyXG5cdFx0XHR4czogMCxcclxuXHRcdFx0c206IDU3NixcclxuXHRcdFx0bWQ6IDc2OCxcclxuXHRcdFx0bGc6IDk5MixcclxuXHRcdFx0eGw6IDEyMDAsXHJcblx0XHRcdHh4bDogMTQwMCxcclxuXHRcdFx0eHh4bDogMTYwMCxcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQldGB0LvQuCDQvdCw0YjQsCDRiNC40YDQuNC90LAg0Y3QutGA0LDQvdCwINGB0L7QstC/0LDQtNCw0LXRgiDRgSDQtNC40LDQv9Cw0LfQvtC90L7QvCDQutC+0YLQvtGA0YvQuSDRg9C60LDQt9Cw0L0g0LIg0LzQvtC00YPQu9C1INCy0YvQtNCw0LXQvCB0cnVlLCDQuNC90LDRh9C1IGZhbHNlXHJcblx0ICogQHBhcmFtIG1vZHVsZVxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVjayhtb2R1bGUpIHtcclxuXHRcdGxldCBpbnN0YW5jZSA9IG5ldyB0aGlzIDtcclxuXHRcdHJldHVybiBpbnN0YW5jZS5kZWZpbmUobW9kdWxlKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtCy0LXRgNGP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC4gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQv9GA0LDQstC40LvRjNC90L4sINC90LDQtNC+INGB0LTQtdC70LDRgtGMINC/0L4t0LTRgNGD0LPQvtC80YNcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRzdGF0aWMgY2hlY2tNb2JpbGVPclRhYmxldCgpIHtcclxuXHRcdGxldCBjaGVjayA9IGZhbHNlO1xyXG5cdFx0KGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0aWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm98YW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaS50ZXN0KGEpfHwvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc2xpY2UoMCw0KSkpe1xyXG5cdFx0XHRcdGNoZWNrID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSkobmF2aWdhdG9yLnVzZXJBZ2VudHx8bmF2aWdhdG9yLnZlbmRvcnx8d2luZG93Lm9wZXJhKTtcclxuXHJcblx0XHRyZXR1cm4gY2hlY2s7XHJcblx0fVxyXG5cclxuXHRkZWZpbmUobW9kdWxlKSB7XHJcblx0XHRsZXQgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCxcclxuXHRcdFx0cmVzcG9uc2l2ZV9zaXplID0gdGhpcy5fY2hlY2tSZXNwb25zaXZlQ2xhc3MobW9kdWxlKSxcclxuXHRcdFx0YnJlYWtwb2ludHMgPSB0aGlzLmJyZWFrcG9pbnRzLFxyXG5cdFx0XHRwb2ludCA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5maW5kKGtleSA9PiBicmVha3BvaW50c1trZXldID09PSByZXNwb25zaXZlX3NpemUpO1xyXG5cclxuXHRcdGxldCBrZXlzID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLFxyXG5cdFx0XHRsb2MgPSBrZXlzLmluZGV4T2YocG9pbnQpO1xyXG5cclxuXHRcdHJldHVybiB3aW5kb3dXaWR0aCA+PSBicmVha3BvaW50c1trZXlzW2xvYyArIDFdXTtcclxuXHR9XHJcblxyXG5cdF9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gbW9kdWxlLl9lbGVtZW50LFxyXG5cdFx0XHRwYXJhbXMgPSBtb2R1bGUuX3BhcmFtcyxcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSAwO1xyXG5cclxuXHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5MRykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLmxnO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5NRCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLm1kO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5TTSkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnNtO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YUykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZTsiLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGRhdGEuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDRgNCw0LHQvtGC0LDQtdGCINGBINC60L7Qu9C70LXQutGG0LjQtdC5INC80L7QtNGD0LvQtdC5LiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9tYXAtc2V0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IGVsZW1lbnRNYXAgPSBuZXcgTWFwKClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRzZXQoZWxlbWVudCwga2V5LCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRlbGVtZW50TWFwLnNldChlbGVtZW50LCBuZXcgTWFwKCkpXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cdFx0aWYgKCFpbnN0YW5jZU1hcC5oYXMoa2V5KSAmJiBpbnN0YW5jZU1hcC5zaXplICE9PSAwKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFZHQXBwINC90LUg0LTQvtC/0YPRgdC60LDQtdGCINCx0L7Qu9C10LUg0L7QtNC90L7Qs9C+INGN0LrQt9C10LzQv9C70Y/RgNCwINC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwLiDQodCy0Y/Qt9Cw0L3QvdGL0Lkg0Y3QutC30LXQvNC/0LvRj9GAOiAke0FycmF5LmZyb20oaW5zdGFuY2VNYXAua2V5cygpKVswXX0uYClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuc2V0KGtleSwgaW5zdGFuY2UpXHJcblx0fSxcclxuXHJcblx0Z2V0KGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKGVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50TWFwLmdldChlbGVtZW50KS5nZXQoa2V5KSB8fCBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHJcblx0XHRpbnN0YW5jZU1hcC5kZWxldGUoa2V5KTtcclxuXHJcblx0XHRpZiAoaW5zdGFuY2VNYXAuc2l6ZSA9PT0gMCkge1xyXG5cdFx0XHRlbGVtZW50TWFwLmRlbGV0ZShlbGVtZW50KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGV2ZW50LmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiDQodC60YDQuNC/0YIg0LTQu9GPINC/0YDQvtGB0LvRg9GI0LjQstCw0L3QuNGPINGB0L7QsdGL0YLQuNGPXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IG5hbWVzcGFjZVJlZ2V4ID0gL1teLl0qKD89XFwuLiopXFwufC4qL1xyXG5jb25zdCBzdHJpcE5hbWVSZWdleCA9IC9cXC4uKi9cclxuY29uc3Qgc3RyaXBVaWRSZWdleCA9IC86OlxcZCskL1xyXG5jb25zdCBldmVudFJlZ2lzdHJ5ID0ge30gLy8gRXZlbnRzIHN0b3JhZ2VcclxubGV0IHVpZEV2ZW50ID0gMVxyXG5jb25zdCBjdXN0b21FdmVudHMgPSB7XHJcblx0bW91c2VlbnRlcjogJ21vdXNlb3ZlcicsXHJcblx0bW91c2VsZWF2ZTogJ21vdXNlb3V0J1xyXG59XHJcblxyXG5jb25zdCBuYXRpdmVFdmVudHMgPSBuZXcgU2V0KFtcclxuXHQnY2xpY2snLFxyXG5cdCdkYmxjbGljaycsXHJcblx0J21vdXNldXAnLFxyXG5cdCdtb3VzZWRvd24nLFxyXG5cdCdjb250ZXh0bWVudScsXHJcblx0J21vdXNld2hlZWwnLFxyXG5cdCdET01Nb3VzZVNjcm9sbCcsXHJcblx0J21vdXNlb3ZlcicsXHJcblx0J21vdXNlb3V0JyxcclxuXHQnbW91c2Vtb3ZlJyxcclxuXHQnc2VsZWN0c3RhcnQnLFxyXG5cdCdzZWxlY3RlbmQnLFxyXG5cdCdzdWJtaXQnLFxyXG5cdCdrZXlkb3duJyxcclxuXHQna2V5cHJlc3MnLFxyXG5cdCdrZXl1cCcsXHJcblx0J29yaWVudGF0aW9uY2hhbmdlJyxcclxuXHQndG91Y2hzdGFydCcsXHJcblx0J3RvdWNobW92ZScsXHJcblx0J3RvdWNoZW5kJyxcclxuXHQndG91Y2hjYW5jZWwnLFxyXG5cdCdwb2ludGVyZG93bicsXHJcblx0J3BvaW50ZXJtb3ZlJyxcclxuXHQncG9pbnRlcnVwJyxcclxuXHQncG9pbnRlcmxlYXZlJyxcclxuXHQncG9pbnRlcmNhbmNlbCcsXHJcblx0J2dlc3R1cmVzdGFydCcsXHJcblx0J2dlc3R1cmVjaGFuZ2UnLFxyXG5cdCdnZXN0dXJlZW5kJyxcclxuXHQnZm9jdXMnLFxyXG5cdCdibHVyJyxcclxuXHQnY2hhbmdlJyxcclxuXHQncmVzZXQnLFxyXG5cdCdzZWxlY3QnLFxyXG5cdCdzdWJtaXQnLFxyXG5cdCdmb2N1c2luJyxcclxuXHQnZm9jdXNvdXQnLFxyXG5cdCdsb2FkJyxcclxuXHQndW5sb2FkJyxcclxuXHQnYmVmb3JldW5sb2FkJyxcclxuXHQncmVzaXplJyxcclxuXHQnbW92ZScsXHJcblx0J0RPTUNvbnRlbnRMb2FkZWQnLFxyXG5cdCdyZWFkeXN0YXRlY2hhbmdlJyxcclxuXHQnZXJyb3InLFxyXG5cdCdhYm9ydCcsXHJcblx0J3Njcm9sbCdcclxuXSlcclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstCw0YLQvdGL0LUg0LzQtdGC0L7QtNGLXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xyXG5cdHJldHVybiAodWlkICYmIGAke3VpZH06OiR7dWlkRXZlbnQrK31gKSB8fCBlbGVtZW50LnVpZEV2ZW50IHx8IHVpZEV2ZW50KytcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KSB7XHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGVsZW1lbnQpXHJcblxyXG5cdGVsZW1lbnQudWlkRXZlbnQgPSB1aWRcclxuXHRldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cclxuXHJcblx0cmV0dXJuIGV2ZW50UmVnaXN0cnlbdWlkXVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcclxuXHJcblx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIHNlbGVjdG9yLCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcclxuXHJcblx0XHRmb3IgKGxldCB7IHRhcmdldCB9ID0gZXZlbnQ7IHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xyXG5cdFx0XHRcdGlmIChkb21FbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiB0YXJnZXQgfSlcclxuXHJcblx0XHRcdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0YXJnZXQsIFtldmVudF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRIYW5kbGVyKGV2ZW50cywgY2FsbGFibGUsIGRlbGVnYXRpb25TZWxlY3RvciA9IG51bGwpIHtcclxuXHRyZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXHJcblx0XHQuZmluZChldmVudCA9PiBldmVudC5jYWxsYWJsZSA9PT0gY2FsbGFibGUgJiYgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yID09PSBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdGNvbnN0IGlzRGVsZWdhdGVkID0gdHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnXHJcblx0Ly8gVE9ETzog0LLRi9C00LDQtdGCIFwiZmFsc2VcIiDQstC80LXRgdGC0L4g0YHQtdC70LXQutGC0L7RgNCwLCDQv9C+0Y3RgtC+0LzRgyDQvdGD0LbQvdC+INC/0YDQvtCy0LXRgNC40YLRjC4gYm9vdFxyXG5cdGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0bGV0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChvcmlnaW5hbFR5cGVFdmVudClcclxuXHJcblx0aWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcclxuXHRcdHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIG9uZU9mZikge1xyXG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cclxuXHQvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXHJcblx0Ly8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXHJcblx0aWYgKG9yaWdpbmFsVHlwZUV2ZW50IGluIGN1c3RvbUV2ZW50cykge1xyXG5cdFx0Y29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYWJsZSA9IHdyYXBGdW5jdGlvbihjYWxsYWJsZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxyXG5cdGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblxyXG5cdGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XHJcblx0XHRwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxyXG5cclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXHJcblx0Y29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XHJcblx0XHRib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjYWxsYWJsZSkgOlxyXG5cdFx0Ym9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcclxuXHJcblx0Zm4uZGVsZWdhdGlvblNlbGVjdG9yID0gaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbFxyXG5cdGZuLmNhbGxhYmxlID0gY2FsbGFibGVcclxuXHRmbi5vbmVPZmYgPSBvbmVPZmZcclxuXHRmbi51aWRFdmVudCA9IHVpZFxyXG5cdGhhbmRsZXJzW3VpZF0gPSBmblxyXG5cclxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgaXNEZWxlZ2F0ZWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3Rvcikge1xyXG5cdGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcclxuXHJcblx0aWYgKCFmbikge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxyXG5cdGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcclxuXHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblxyXG5cdGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR5cGVFdmVudChldmVudCkge1xyXG5cdC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcclxuXHRldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxyXG5cdHJldHVybiBjdXN0b21FdmVudHNbZXZlbnRdIHx8IGV2ZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcclxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhtZXRhKSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0b2JqW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb2JqXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjRj1xyXG4gKiBAdHlwZSB7e29uZSgqLCAqLCAqLCAqKTogdm9pZCwgdHJpZ2dlcigqLCAqLCAqKTogKG51bGx8KiksIG9mZigqLCAqLCAqLCAqKTogdm9pZCwgb24oKiwgKiwgKiwgKik6IHZvaWR9fVxyXG4gKi9cclxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtGB0LvRg9GI0LjQstCw0YLQtdC70Ywg0YHQvtCx0YvRgtC40LkgKNGN0LvQtdC80LXQvdGCLCDRgdC+0LHRi9GC0LjQtSAo0L/QvtC70L3Ri9C5INGB0L/QuNGB0L7QuiDRgdC80L7RgtGA0Lgg0LIg0LrQvtC90YHRgtCw0L3RgtC1IG5hdGl2ZUV2ZW50cywg0LjRgdGC0L7Rh9C90LjQuiDRgdC+0LHRi9GC0LjRjyDQuNC70Lgg0YXQtdC90LTQu9C10YAsINGE0YPQvdC60YbQuNGPINC+0LHRgNCw0YLQvdC+0LPQviDQstGL0LfQvtCy0LApKVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b24oZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBmYWxzZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5LCDQvdC+INC30LDQvNGL0LrQsNC10YLRgdGPINC4INCx0L7Qu9GM0YjQtSDQvdC1INC/0L7QstGC0L7RgNGP0LXRgtGB0Y8g0L3QsCDRjdC70LXQvNC10L3RgtC1XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvbmUoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCB0cnVlKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCj0LTQsNC70LXQvdC40LUg0L7QsdGA0LDQsdC+0YLRh9C40LrQsFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b2ZmKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0XHRjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHRcdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRcdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHRcdGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly8gU2ltcGxlc3QgY2FzZTogaGFuZGxlciBpcyBwYXNzZWQsIHJlbW92ZSB0aGF0IGxpc3RlbmVyIE9OTFkuXHJcblx0XHRcdGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFtZXNwYWNlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcclxuXHRcdFx0XHRyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBba2V5SGFuZGxlcnMsIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdFx0Y29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXHJcblxyXG5cdFx0XHRpZiAoIWluTmFtZXNwYWNlIHx8IG9yaWdpbmFsVHlwZUV2ZW50LmluY2x1ZGVzKGhhbmRsZXJLZXkpKSB7XHJcblx0XHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGB0L7QsdGL0YLQuNGPLiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9kaXNwYXRjaC1ldmVudHNcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBhcmdzXHJcblx0ICogQHJldHVybnMgeyp8bnVsbH1cclxuXHQgKi9cclxuXHR0cmlnZ2VyKGVsZW1lbnQsIGV2ZW50LCBhcmdzKSB7XHJcblx0XHRpZiAodHlwZW9mIGV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBidWJibGVzID0gdHJ1ZTtcclxuXHRcdGxldCBuYXRpdmVEaXNwYXRjaCA9IHRydWU7XHJcblx0XHRsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0IGV2dCA9IGh5ZHJhdGVPYmoobmV3IEV2ZW50KGV2ZW50LCB7IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUgfSksIGFyZ3MpXHJcblxyXG5cdFx0aWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmF0aXZlRGlzcGF0Y2gpIHtcclxuXHRcdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZXZ0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXJcclxuIiwiaW1wb3J0IHtpc0VsZW1lbnQsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQnNCw0L3QuNC/0YPQu9GP0YbQuNC4INGBINCw0YLRgNC40LHRg9GC0LDQvNC4INGDINGN0LvQtdC80LXQvdGC0LA6XHJcbiAqIGdldCAo0Y3Qu9C10LzQtdC90YIsINC40LzRjywg0YTQu9Cw0LMgLSDQstGL0YDQtdC30LDRgtGMIGRhdGEtKSAtINC80LXRgtC+0LQg0LLRi9Cx0LjRgNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INCw0YLRgNC40LHRg9GC0LAg0L/QviDQtdCz0L4g0LjQvNC10L3QuCwg0LXRgdC70Lgg0LIg0L/QvtC70LUg0LjQvNC10L3QuCDQv9C10YDQtdC00LDRgtGMICdkYXRhJyAtPiDQsdGD0LTRg9GCINCy0YvQsdGA0LDQvdGLINGC0L7Qu9GM0LrQviDQtNCw0YLQsCDQsNGC0YDQuNCx0YPRgtGLLCDQtdGB0LvQuCAnYWxsJyAtPiDQvNC10YLQvtC0INCy0LXRgNC90LXRgiDQt9C90LDRh9C10L3QuNC1INCy0YHQtdGFINCw0YLRgNC40LHRg9GC0L7QslxyXG4gKiBoYXMgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0LXRgdGC0Ywg0LvQuCDQsNGC0YDQuNCx0YPRgiDRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAqIHNldCAo0Y3Qu9C10LzQtdC90YIsINC40LzRjywg0LfQvdCw0YfQtdC90LjQtSkgLSDRg9GB0YLQsNC90L7QstC60LAg0YMg0Y3Qu9C10LzQtdC90YLQsCDQsNGC0YDQuNCx0YPRgtCwINC40LvQuCDQtdCz0L4g0LjQt9C80LXQvdC10L3QuNC1XHJcbiAqIHJlbW92ZSAo0Y3Qu9C10LzQtdC90YIsINC40LzRjykgLSDRg9C00LDQu9GP0LXRgiDQsNGC0YDQuNCx0YPRgiDRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAqL1xyXG5jb25zdCBNYW5pcHVsYXRvciA9IHtcclxuXHRnZXQoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSA9ICdkYXRhJywgaXNSZW1vdmVEYXRhTmFtZSA9IHRydWUpIHtcclxuXHRcdGlmICghZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4ge31cclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmFtZUF0dHJpYnV0ZSA9PT0gJ2RhdGEnKSB7XHJcblx0XHRcdGxldCBlbG1CYXNlID0gWydkYXRhLXZnLXRvZ2dsZScsICdkYXRhLXZnLXRhcmdldCcsICdkYXRhLXZnLWRpc21pc3MnXSxcclxuXHRcdFx0XHRhdHRyaWJ1dGVzID0ge307XHJcblxyXG5cdFx0XHRsZXQgYXJyID0gW10uZmlsdGVyLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gL15kYXRhLS8udGVzdChhdC5uYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoYXJyLmxlbmd0aCkge1xyXG5cdFx0XHRcdGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdFx0XHRsZXQgbmFtZSA9IHYubmFtZTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWVsbUJhc2UuaW5jbHVkZXMobmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGlzUmVtb3ZlRGF0YU5hbWUpIG5hbWUgPSBuYW1lLnNsaWNlKDUpO1xyXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW25hbWVdID0gbm9ybWFsaXplRGF0YSh2LnZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYXR0cmlidXRlcztcclxuXHRcdH0gZWxzZSBpZiAobmFtZUF0dHJpYnV0ZSA9PT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlTmFtZXMoKS5yZWR1Y2UoKGFjYywgbmFtZSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiB7Li4uYWNjLCBbbmFtZV06IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpfTtcclxuXHRcdFx0fSwge30pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGhhcyhlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0fSxcclxuXHJcblx0c2V0KGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KGVsZW1lbnQpICYmIG5hbWUpIHtcclxuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbW92ZShlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KGVsZW1lbnQpICYmIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge01hbmlwdWxhdG9yfVxyXG4iLCIvKipcclxuICog0KDQsNCx0L7RgtCwINGBIERPTVxyXG4gKiBAcGFyYW0gc2VsZWN0b3JcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5pbXBvcnQge2lzRWxlbWVudH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5cclxuY29uc3QgcGFyc2VTZWxlY3RvciA9IHNlbGVjdG9yID0+IHtcclxuXHRpZiAoc2VsZWN0b3IgJiYgd2luZG93LkNTUyAmJiB3aW5kb3cuQ1NTLmVzY2FwZSkge1xyXG5cdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8jKFteXFxzXCIjJ10rKS9nLCAobWF0Y2gsIGlkKSA9PiBgIyR7Q1NTLmVzY2FwZShpZCl9YClcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvclxyXG59XHJcblxyXG5jb25zdCBnZXRTZWxlY3RvciA9IGVsZW1lbnQgPT4ge1xyXG5cdGxldCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXZnLXRhcmdldCcpO1xyXG5cclxuXHRpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSAnIycpIHtcclxuXHRcdGxldCBocmVmQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuXHRcdGlmICghaHJlZkF0dHJpYnV0ZSB8fCAoIWhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcuJykpKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnIycpKSB7XHJcblx0XHRcdGhyZWZBdHRyaWJ1dGUgPSBgIyR7aHJlZkF0dHJpYnV0ZS5zcGxpdCgnIycpWzFdfWA7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZWN0b3IgPSBocmVmQXR0cmlidXRlICYmIGhyZWZBdHRyaWJ1dGUgIT09ICcjJyA/IGhyZWZBdHRyaWJ1dGUudHJpbSgpIDogbnVsbDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvciA/IHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKHNlbCA9PiBwYXJzZVNlbGVjdG9yKHNlbCkpLmpvaW4oJywnKSA6IG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IFNlbGVjdG9ycyA9IHtcclxuXHRmaW5kKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRyZXR1cm4gc2VsZWN0b3I7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3Rvci5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmaW5kQWxsKHNlbGVjdG9yLCBjb250YWluZXIgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBbXS5jb25jYXQoLi4uRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbC5jYWxsKGNvbnRhaW5lciwgc2VsZWN0b3IpKTtcclxuXHR9LFxyXG5cclxuXHRnZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudCk7XHJcblx0XHRpZiAoc2VsZWN0b3IpIHJldHVybiBTZWxlY3RvcnMuZmluZChzZWxlY3RvcikgPyBzZWxlY3RvciA6IG51bGxcclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0Z2V0RWxlbWVudEZyb21TZWxlY3RvcihlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIHNlbGVjdG9yID8gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IpIDogbnVsbFxyXG5cdH0sXHJcblxyXG5cdGdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KTtcclxuXHRcdHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9ycy5maW5kQWxsKHNlbGVjdG9yKSA6IFtdXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RvcnM7IiwiLyoqXHJcbiAqINCd0LDQsdC+0YAg0YHQutGA0LjQv9GC0L7QsiDQtNC70Y8g0YjQuNGA0L7QutC+0LPQviDQv9GA0LjQvNC10L3QtdC90LjRj1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQldGB0LvQuCDRh9GC0L4t0L3QuNCx0YPQtNGMINCyINC+0LHRitC10LrRgtC1XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xyXG5cdGZvciAobGV0IHByb3AgaW4gb2JqKSB7XHJcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRWxlbWVudFxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gb2JqZWN0ID0+IHtcclxuXHRpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHR5cGVvZiBvYmplY3Qubm9kZVR5cGUgIT09ICd1bmRlZmluZWQnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0Rpc2FibGVkXHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNEaXNhYmxlZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgZWxlbWVudC5kaXNhYmxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmRpc2FibGVkXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09ICdmYWxzZSdcclxufVxyXG5cclxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtZW50KSB7XHJcblx0aWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRjb25zdCBlbGVtZW50SXNWaXNpYmxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xyXG5cdGNvbnN0IGNsb3NlZERldGFpbHMgPSBlbGVtZW50LmNsb3Nlc3QoJ2RldGFpbHM6bm90KFtvcGVuXSknKVxyXG5cclxuXHRpZiAoIWNsb3NlZERldGFpbHMpIHtcclxuXHRcdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcblx0fVxyXG5cclxuXHRpZiAoY2xvc2VkRGV0YWlscyAhPT0gZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXHJcblx0XHRpZiAoc3VtbWFyeSAmJiBzdW1tYXJ5LnBhcmVudE5vZGUgIT09IGNsb3NlZERldGFpbHMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN1bW1hcnkgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG59XHJcblxyXG4vKipcclxuICogaXNPYmplY3RcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG5cdHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0L7QtNC40Lwg0LIg0L/QvtGA0Y/QtNC+0Log0YLQuNC/0Ysg0LTQsNC90L3Ri9GFXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkgIHtcclxuXHRpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xyXG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdH0gY2F0Y2gge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YLRiyDRgSDQvNCw0YHRgdC40LLQsFxyXG4gKiBAcGFyYW0gYXJyXHJcbiAqIEBwYXJhbSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudEFycmF5KGFyciwgZWwpIHtcclxuXHRyZXR1cm4gYXJyLmZpbHRlcigoaXRlbSkgPT4gIWVsLmluY2x1ZGVzKGl0ZW0pKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCT0LvRg9Cx0L7QutC+0LUg0L7QsdGK0LXQtNC40L3QtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyXHJcbiAqIEBwYXJhbSBvYmplY3RzXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VEZWVwT2JqZWN0KC4uLm9iamVjdHMpIHtcclxuXHRjb25zdCBpc09iamVjdCA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcblxyXG5cdHJldHVybiBvYmplY3RzLnJlZHVjZSgocHJldiwgb2JqKSA9PiB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0Y29uc3QgcFZhbCA9IHByZXZba2V5XTtcclxuXHRcdFx0Y29uc3Qgb1ZhbCA9IG9ialtrZXldO1xyXG5cclxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocFZhbCkgJiYgQXJyYXkuaXNBcnJheShvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IHBWYWwuY29uY2F0KC4uLm9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGlzT2JqZWN0KHBWYWwpICYmIGlzT2JqZWN0KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gbWVyZ2VEZWVwT2JqZWN0KHBWYWwsIG9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG9WYWw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwcmV2O1xyXG5cdH0sIHt9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrXHJcbiAqIEBwYXJhbSBwb3NzaWJsZUNhbGxiYWNrXHJcbiAqIEBwYXJhbSBhcmdzXHJcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWVcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBleGVjdXRlKHBvc3NpYmxlQ2FsbGJhY2ssIGFyZ3MgPSBbXSwgZGVmYXVsdFZhbHVlID0gcG9zc2libGVDYWxsYmFjaykge1xyXG5cdHJldHVybiB0eXBlb2YgcG9zc2libGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IHBvc3NpYmxlQ2FsbGJhY2soLi4uYXJncykgOiBkZWZhdWx0VmFsdWVcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zaXRpb25cclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uRWxlbWVudFxyXG4gKiBAcGFyYW0gd2FpdEZvclRyYW5zaXRpb25cclxuICovXHJcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnO1xyXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDA7XHJcblxyXG5mdW5jdGlvbiBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uIChjYWxsYmFjaywgdHJhbnNpdGlvbkVsZW1lbnQsIHdhaXRGb3JUcmFuc2l0aW9uID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0aWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxyXG5cdGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSB0aW1lT3V0TXMgPyB0aW1lT3V0TXMgOiBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmc7XHJcblxyXG5cdGxldCBjYWxsZWQgPSBmYWxzZVxyXG5cclxuXHRjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcclxuXHRcdGlmICh0YXJnZXQgIT09IHRyYW5zaXRpb25FbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxlZCA9IHRydWVcclxuXHRcdHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdH1cclxuXHJcblx0dHJhbnNpdGlvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdGlmICghY2FsbGVkKSB7XHJcblx0XHRcdHRyaWdnZXJUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25FbGVtZW50KVxyXG5cdFx0fVxyXG5cdH0sIGVtdWxhdGVkRHVyYXRpb24pXHJcbn1cclxuXHJcbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcclxuXHRsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXHJcblxyXG5cdC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcclxuXHRpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcclxuXHR0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxyXG5cdHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXHJcblxyXG5cdHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcclxufVxyXG5cclxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcclxuXHRlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbmV4cG9ydCB7aXNFbGVtZW50LCBpc1Zpc2libGUsIGlzRGlzYWJsZWQsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YSwgZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgbm9vcH0iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGNzcyDQutC70LDRgdGB0Ysg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuaW1wb3J0IFwiLi9hcHAvdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3NcIjtcclxuXHJcbi8vIHZnc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL2pzL3Znc2lkZWJhclwiO1xyXG5cclxuLy8gdmdjb2xsYXBzZVxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnY29sbGFwc2Uvc2Nzcy92Z2NvbGxhcHNlLnNjc3NcIjtcclxuaW1wb3J0IFZHQ29sbGFwc2UgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlXCI7XHJcblxyXG4vLyBuYXZcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3NcIjtcclxuaW1wb3J0IFZHTmF2IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2XCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3NcIjtcclxuaW1wb3J0IFZHRHJvcGRvd24gZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duXCI7XHJcblxyXG4vLyBtb2RhbFxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZHTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdtb2RhbC9qcy92Z21vZGFsXCI7XHJcblxyXG4vLyBmb3JtIHNlbmRlclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9zY3NzL3ZnZm9ybXNlbmRlci5zY3NzXCI7XHJcbmltcG9ydCBWR0Zvcm1TZW5kZXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlclwiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXIsIFZHQ29sbGFwc2UsIFZHTmF2LCBWR0Ryb3Bkb3duLCBWR01vZGFsLCBWR0Zvcm1TZW5kZXJcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=