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
    const setData = data => {
      if ($content) $content.innerHTML = data;
    };
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
    if ('loader' in _this._params.ajax && _this._params.ajax.loader) {
      setData('<div class="vg-loader"></div>');
    }
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
    error: '<svg  viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="ui-success" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-2" transform="translate(2.000000, 2.000000)"><circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><circle class="ui-error-circle" stroke="#F74444" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><path class="ui-error-line1" d="M22.244224,22 L60.4279902,60.1837662" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path><path class="ui-error-line2" d="M60.755776,21 L23.244224,59.8443492" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path></g></g></svg>',
    success: '<svg viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="ui-error" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-3" transform="translate(2.000000, 2.000000)"><circle id="Oval-2" stroke="rgba(117, 183, 152, 0.4)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><circle  class="ui-success-circle" id="Oval-2" stroke="#A5DC86" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><polyline class="ui-success-path" id="Path-2" stroke="#A5DC86" stroke-width="4" points="19 38.8036813 31.1020744 54.8046875 63.299221 28"></polyline></g></g></svg>',
    waiting: '<svg viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="ui-waiting" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-3" transform="translate(2.000000, 2.000000)"><circle id="Oval-2" stroke="rgba(255, 218, 106, 0.4)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><circle class="ui-waiting-circle" id="Oval-2" stroke="#ffda6a" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><path class="ui-waiting-line1" d="M43 63C54.598 63 64 53.598 64 42C64 30.402 54.598 21 43 21C31.402 21 22 30.402 22 42C22 53.598 31.402 63 43 63Z" stroke-width="3" stroke="#ffda6a" stroke-linecap="round" stroke-linejoin="round"/><path class="ui-waiting-line2" d="M40.6667 32.6641V44.3307H52.3334" stroke="#ffda6a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>',
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
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");






/**
 * Constants
 */
const NAME = 'collapse';
const NAME_KEY = 'vg.collapse';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_COLLAPSE = 'vg-collapse';
const CLASS_NAME_COLLAPSING = 'vg-collapsing';
const CLASS_NAME_COLLAPSED = 'vg-collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="collapse"]';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGCollapse extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      toggle: true,
      parent: null,
      ajax: {
        route: '',
        target: '',
        method: 'get'
      }
    }, params));
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].findAll(SELECTOR_DATA_TOGGLE);
    for (const elem of toggleList) {
      const selector = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].getSelectorFromElement(elem);
      const filterElement = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].findAll(selector).filter(foundElement => foundElement === this._element);
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._params.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._params.toggle) {
      this.toggle();
    }
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
  show() {
    const _this = this;
    if (_this._isTransitioning || _this._isShown()) return;
    let activeChildren = [];
    if (_this._params.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => VGCollapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) return;
    const startEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_SHOW);
    if (startEvent.defaultPrevented) return;
    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }
    _this._element.classList.remove(CLASS_NAME_COLLAPSE);
    _this._element.classList.add(CLASS_NAME_COLLAPSING);
    _this._element.style.height = 0;
    _this._addAriaAndCollapsedClass(_this._triggerArray, true);
    _this._isTransitioning = true;
    _this._route();
    const complete = () => {
      _this._isTransitioning = false;
      _this._element.classList.remove(CLASS_NAME_COLLAPSING);
      _this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
      _this._element.style.height = '';
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_SHOWN);
    };
    _this._queueCallback(complete, _this._element, true);
    const scrollSize = `scrollHeight`;
    _this._element.style.height = `${_this._element[scrollSize]}px`;
  }
  hide() {
    const _this = this;
    if (_this._isTransitioning || !_this._isShown()) return;
    const startEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_HIDE);
    if (startEvent.defaultPrevented) return;
    _this._element.style.height = `${this._element.getBoundingClientRect().height}px`;
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.reflow)(_this._element);
    _this._element.classList.add(CLASS_NAME_COLLAPSING);
    _this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
    for (const trigger of _this._triggerArray) {
      const element = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].getElementFromSelector(trigger);
      if (element && !_this._isShown(element)) {
        _this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    _this._isTransitioning = true;
    const complete = () => {
      _this._isTransitioning = false;
      _this._element.classList.remove(CLASS_NAME_COLLAPSING);
      _this._element.classList.add(CLASS_NAME_COLLAPSE);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_HIDDEN);
    };
    _this._element.style.height = '';
    _this._queueCallback(complete, _this._element, true);
  }
  dispose() {
    super.dispose();
  }
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW);
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    for (const element of triggerArray) {
      this._changeStateButton(element, isOpen);
    }
  }
  _initializeChildren() {
    if (!this._params.parent) return;
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);
    for (const element of children) {
      const selected = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }
  _getFirstLevelChildren(selector) {
    const children = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find(CLASS_NAME_DEEPER_CHILDREN, this._params.parent);
    return _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find(selector, this._params.parent).filter(element => !children.includes(element));
  }
  _changeStateButton(element, isOpen) {
    element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
    element.setAttribute('aria-expanded', isOpen);
    element.innerHTML = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_4__.Manipulator.get(element, `data-${isOpen ? 'hide' : 'show'}-text`) || element.innerHTML;
  }
}

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }
  _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].getMultipleElementsFromSelector(this).forEach(function (element) {
    VGCollapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  });
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
/* harmony import */ var _vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../vgcollapse/js/vgcollapse */ "./app/modules/vgcollapse/js/vgcollapse.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");









/**
 * Constants
 */
const NAME = 'form-sender';
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
        alertCollapse: 'vg-form-sender-collapse',
        alertModal: 'vg-form-sender-modal',
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
    if (_this._params.alert.type === 'collapse') {
      [...document.getElementsByClassName(_this._params.classes.alertCollapse)].forEach(function (element) {
        if (element && element.classList.contains('show')) {
          _vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_6__["default"].getOrCreateInstance(element, {
            toggle: false
          }).hide();
        }
      });
    }
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
    if (typeof data === "object") {
      if ('errors' in data) {
        status = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)(data.errors) ? 'error' : 'success';
      }
    }
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
    let $modal = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.' + _this._params.classes.alertModal);
    if (!$modal) {
      $modal = document.createElement('div');
      $modal.classList.add('vg-modal', 'fade', _this._params.classes.alertModal);
      $modal.id = _this._params.classes.general + '-' + (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.makeRandomString)();
      let dialog = document.createElement('div');
      dialog.classList.add('vg-modal-dialog', 'vg-modal-md');
      let content = document.createElement('div');
      content.classList.add('vg-modal-content');
      let body = document.createElement('div');
      body.classList.add('vg-modal-body');
      content.append(body);
      dialog.append(content);
      $modal.append(dialog);
    }
    $modal.append(_this.setDataRelationStatus($modal, status, data, 'modal'));
    document.body.append($modal);
    _vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_3__["default"].getOrCreateInstance($modal).toggle();
  }
  _alertCollapse(data, status) {
    const _this = this;
    let $collapse = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.' + _this._params.classes.alertCollapse);
    if (!$collapse) {
      $collapse = document.createElement('div');
      $collapse.classList.add(_this._params.classes.alertCollapse);
      $collapse.classList.add('vg-collapse');
      $collapse.id = _this._params.classes.general + '-' + (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.makeRandomString)();
      $collapse.append(_this.setDataRelationStatus($collapse, status, data, 'collapse'));
      _this._element.prepend($collapse);
    }
    _vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_6__["default"].getOrCreateInstance($collapse, {
      toggle: false
    }).toggle();
  }
  setDataRelationStatus($element, status, data, type) {
    let $alert = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.vg-alert-' + status, $element);
    if (typeof data === 'object') {
      if ('view' in data && typeof data.view === 'object') {
        let txt = '';
        if ('title' in data.view) {
          txt += '<h4 class="vg-alert-content--title">' + data.view.title + '</h4>';
        }
        if ('message' in data.view) {
          txt += '<div class="vg-alert-content--message">' + data.view.message + '</div>';
        }
        data = txt;
      } else if ('view' in data && typeof data.view === "string") {
        data = data.view;
      }
    }
    if (!$alert) {
      $alert = document.createElement('div');
      $alert.classList.add('vg-alert', 'vg-alert-' + status, 'vg-alert-' + type);
      let content = document.createElement('div');
      content.classList.add('vg-alert-content');
      let icon = document.createElement('div');
      icon.classList.add('vg-alert-content--icon');
      let i = document.createElement('i');
      i.innerHTML = (0,_module_fn__WEBPACK_IMPORTED_MODULE_7__.getSVG)(status);
      icon.append(i);
      content.append(icon);
      let text = document.createElement('div');
      text.classList.add('vg-alert-content--text');
      text.innerHTML = data;
      content.append(text);
      $alert.append(content);
    } else {
      let text = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.vg-alert-content--text', $alert);
      text.innerHTML = data;
    }
    return $alert;
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
/* harmony export */   makeRandomString: () => (/* binding */ makeRandomString),
/* harmony export */   mergeDeepObject: () => (/* binding */ mergeDeepObject),
/* harmony export */   noop: () => (/* binding */ noop),
/* harmony export */   normalizeData: () => (/* binding */ normalizeData),
/* harmony export */   reflow: () => (/* binding */ reflow),
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
 * Трюк для перезапуска анимации элемента
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @смотри https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};

/**
 * Noop
 */
const noop = () => {};

/**
 * Генерация случайной строки
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
/* harmony export */   VGCollapse: () => (/* reexport safe */ _app_modules_vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_modules_vgdropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   VGFormSender: () => (/* reexport safe */ _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   VGModal: () => (/* reexport safe */ _app_modules_vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   VGNav: () => (/* reexport safe */ _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_modules_vgsidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/utils/scss/default.scss */ "./app/utils/scss/default.scss");
/* harmony import */ var _app_modules_vgsidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/modules/vgsidebar/scss/vgsidebar.scss */ "./app/modules/vgsidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_modules_vgsidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/modules/vgsidebar/js/vgsidebar */ "./app/modules/vgsidebar/js/vgsidebar.js");
/* harmony import */ var _app_modules_vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/modules/vgcollapse/js/vgcollapse */ "./app/modules/vgcollapse/js/vgcollapse.js");
/* harmony import */ var _app_modules_vgnav_scss_vgnav_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/modules/vgnav/scss/vgnav.scss */ "./app/modules/vgnav/scss/vgnav.scss");
/* harmony import */ var _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app/modules/vgnav/js/vgnav */ "./app/modules/vgnav/js/vgnav.js");
/* harmony import */ var _app_modules_vgdropdown_scss_vgdropdown_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app/modules/vgdropdown/scss/vgdropdown.scss */ "./app/modules/vgdropdown/scss/vgdropdown.scss");
/* harmony import */ var _app_modules_vgdropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app/modules/vgdropdown/js/vgdropdown */ "./app/modules/vgdropdown/js/vgdropdown.js");
/* harmony import */ var _app_modules_vgmodal_scss_vgmodal_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app/modules/vgmodal/scss/vgmodal.scss */ "./app/modules/vgmodal/scss/vgmodal.scss");
/* harmony import */ var _app_modules_vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app/modules/vgmodal/js/vgmodal */ "./app/modules/vgmodal/js/vgmodal.js");
/* harmony import */ var _app_modules_vgformsender_scss_vgformsender_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app/modules/vgformsender/scss/vgformsender.scss */ "./app/modules/vgformsender/scss/vgformsender.scss");
/* harmony import */ var _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./app/modules/vgformsender/js/vgformsender */ "./app/modules/vgformsender/js/vgformsender.js");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDamZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ3JEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUMzQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBa0RBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQzFVQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4UUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvbW9kdWxlLWZuLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbW9kYWwvanMvdmdtb2RhbC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL2pzL3Znc2lkZWJhci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3cuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9wYXJhbXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9wbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9yZXNwb25zaXZlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9kYXRhLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9ldmVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZG9tL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzP2U4MjUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvc2Nzcy92Z2Zvcm1zZW5kZXIuc2Nzcz82OTEyIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdtb2RhbC9zY3NzL3ZnbW9kYWwuc2Nzcz8xMjg5Iiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzPzE5YmMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzcz81YWNkIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzP2M2MzQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBEYXRhIGZyb20gXCIuLi91dGlscy9qcy9kb20vZGF0YVwiO1xyXG5pbXBvcnQgUGFyYW1zIGZyb20gXCIuLi91dGlscy9qcy9jb21wb25lbnRzL3BhcmFtc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtBamF4LCBnZXRTVkd9IGZyb20gXCIuL21vZHVsZS1mblwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm5cclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoZWxlbWVudCk7XHJcblx0XHRpZiAoIXRoaXMuX2VsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHRcdERhdGEuc2V0KHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVksIHRoaXMpXHJcblx0fVxyXG5cclxuXHRfZ2V0UGFyYW1zKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0cmV0dXJuIG5ldyBQYXJhbXMocGFyYW1zLCBlbGVtZW50KS5nZXQoKTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHREYXRhLnJlbW92ZSh0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZKTtcclxuXHRcdEV2ZW50SGFuZGxlci5vZmYodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5FVkVOVF9LRVkpXHJcblxyXG5cdFx0Zm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcclxuXHRcdFx0dGhpc1twcm9wZXJ0eU5hbWVdID0gbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3JvdXRlKGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRsZXQgJGNvbnRlbnQgPSBudWxsO1xyXG5cclxuXHRcdGNvbnN0IHNldERhdGEgPSAoZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAoJGNvbnRlbnQpICRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHR9O1xyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnYWpheCcpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIV90aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEnbWV0aG9kJyBpbiBfdGhpcy5fcGFyYW1zLmFqYXgpIHtcclxuXHRcdFx0X3RoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZCA9ICdnZXQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgndGFyZ2V0JyBpbiBfdGhpcy5fcGFyYW1zLmFqYXggJiYgX3RoaXMuX3BhcmFtcy5hamF4LnRhcmdldCkge1xyXG5cdFx0XHQkY29udGVudCA9IFNlbGVjdG9ycy5maW5kKF90aGlzLl9wYXJhbXMuYWpheC50YXJnZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnbG9hZGVyJyBpbiBfdGhpcy5fcGFyYW1zLmFqYXggJiYgX3RoaXMuX3BhcmFtcy5hamF4LmxvYWRlcikge1xyXG5cdFx0XHRzZXREYXRhKCc8ZGl2IGNsYXNzPVwidmctbG9hZGVyXCI+PC9kaXY+Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0QWpheFtfdGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kXShfdGhpcy5fcGFyYW1zLmFqYXgucm91dGUsIF90aGlzLl9wYXJhbXMuYWpheC5kYXRhIHx8IHt9LCBmdW5jdGlvbiAoc3RhdHVzLCBkYXRhKSB7XHJcblx0XHRcdHNldERhdGEoZGF0YSk7XHJcblx0XHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFtzdGF0dXMsIGRhdGFdKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2Rpc21pc3NFbGVtZW50KCkge1xyXG5cdFx0bGV0IGNyb3NzID0gZ2V0U1ZHKCdjcm9zcycpLFxyXG5cdFx0XHRidXR0b24gPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy52Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRpZiAoYnV0dG9uKSB7XHJcblx0XHRcdGxldCBzdmcgPSBidXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcblx0XHRcdGlmICghc3ZnKSBidXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBjcm9zcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcXVldWVDYWxsYmFjayhjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCA9IHRydWUsIHRpbWVPdXRNcykge1xyXG5cdFx0ZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbihjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCwgdGltZU91dE1zKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRGF0YS5nZXQoU2VsZWN0b3JzLmZpbmQoZWxlbWVudCksIHRoaXMuTkFNRV9LRVkpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoZWxlbWVudCkgfHwgbmV3IHRoaXMoZWxlbWVudCwgIWlzRW1wdHlPYmoocGFyYW1zKSA/IHBhcmFtcyA6IHt9KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEQVRBX0tFWSgpIHtcclxuXHRcdHJldHVybiBgdmcuJHt0aGlzLk5BTUV9YFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBFVkVOVF9LRVkoKSB7XHJcblx0XHRyZXR1cm4gYC4ke3RoaXMuREFUQV9LRVl9YFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc0VtcHR5T2JqfSBmcm9tIFwiLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQotGD0YIg0YHQvtCx0YDQsNC90Ysg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LrRgNC40L/RgtGLINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LlcclxuICovXHJcblxyXG4vKipcclxuICog0J3QsNCx0L7RgCBzdmcg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEByZXR1cm5zIHsqfHt9fVxyXG4gKi9cclxuY29uc3QgZ2V0U1ZHID0gKG5hbWUpID0+IHtcclxuXHRjb25zdCBzdmcgPSAge1xyXG5cdFx0ZXJyb3I6ICc8c3ZnICB2aWV3Qm94PVwiMCAwIDg3IDg3XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBpZD1cInVpLXN1Y2Nlc3NcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIGlkPVwiR3JvdXAtMlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApXCI+PGNpcmNsZSBpZD1cIk92YWwtMlwiIHN0cm9rZT1cInJnYmEoMjUyLCAxOTEsIDE5MSwgLjUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLWVycm9yLWNpcmNsZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCI0XCIgY3g9XCI0MS41XCIgY3k9XCI0MS41XCIgcj1cIjQxLjVcIj48L2NpcmNsZT48cGF0aCBjbGFzcz1cInVpLWVycm9yLWxpbmUxXCIgZD1cIk0yMi4yNDQyMjQsMjIgTDYwLjQyNzk5MDIsNjAuMTgzNzY2MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PHBhdGggY2xhc3M9XCJ1aS1lcnJvci1saW5lMlwiIGQ9XCJNNjAuNzU1Nzc2LDIxIEwyMy4yNDQyMjQsNTkuODQ0MzQ5MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4nLFxyXG5cdFx0c3VjY2VzczogJzxzdmcgdmlld0JveD1cIjAgMCA4NyA4N1wiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGcgaWQ9XCJ1aS1lcnJvclwiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgxMTcsIDE4MywgMTUyLCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSAgY2xhc3M9XCJ1aS1zdWNjZXNzLWNpcmNsZVwiIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxwb2x5bGluZSBjbGFzcz1cInVpLXN1Y2Nlc3MtcGF0aFwiIGlkPVwiUGF0aC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBwb2ludHM9XCIxOSAzOC44MDM2ODEzIDMxLjEwMjA3NDQgNTQuODA0Njg3NSA2My4yOTkyMjEgMjhcIj48L3BvbHlsaW5lPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdHdhaXRpbmc6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODcgODdcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnIGlkPVwidWktd2FpdGluZ1wiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgyNTUsIDIxOCwgMTA2LCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLXdhaXRpbmctY2lyY2xlXCIgaWQ9XCJPdmFsLTJcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PHBhdGggY2xhc3M9XCJ1aS13YWl0aW5nLWxpbmUxXCIgZD1cIk00MyA2M0M1NC41OTggNjMgNjQgNTMuNTk4IDY0IDQyQzY0IDMwLjQwMiA1NC41OTggMjEgNDMgMjFDMzEuNDAyIDIxIDIyIDMwLjQwMiAyMiA0MkMyMiA1My41OTggMzEuNDAyIDYzIDQzIDYzWlwiIHN0cm9rZS13aWR0aD1cIjNcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjxwYXRoIGNsYXNzPVwidWktd2FpdGluZy1saW5lMlwiIGQ9XCJNNDAuNjY2NyAzMi42NjQxVjQ0LjMzMDdINTIuMzMzNFwiIHN0cm9rZT1cIiNmZmRhNmFcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdGRvdHM6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJiaSBiaS10aHJlZS1kb3RzLXZlcnRpY2FsXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOS41IDEzYTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHpcIi8+PC9zdmc+JyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLQtdGI0LDQtdC8INGB0L7QsdGL0YLQuNC1IFwi0JfQsNC60YDRi9GC0YxcIiDQvdCwINCy0YHQtSDQvNC+0LTQsNC70LrQuCwg0YHQsNC50LTQsdCw0YDRiyDQuCDRgi7Qvy5cclxuICogQHBhcmFtIG1vZHVsZVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqL1xyXG5jb25zdCBkaXNtaXNzVHJpZ2dlciA9IChtb2R1bGUsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xyXG5cdGNvbnN0IGNsaWNrRXZlbnQgPSBgY2xpY2suZGlzbWlzcy4ke21vZHVsZS5FVkVOVF9LRVl9YFxyXG5cdGNvbnN0IG5hbWUgPSBtb2R1bGUuTkFNRTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBjbGlja0V2ZW50LCBgW2RhdGEtdmctZGlzbWlzcz1cIiR7bmFtZX1cIl1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpIHx8IHRoaXMuY2xvc2VzdChgLnZnLSR7bmFtZX1gKVxyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBtb2R1bGUuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblxyXG5cdFx0aW5zdGFuY2VbbWV0aG9kXSgpXHJcblx0fSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEFKQVggUkVRVUVTVFxyXG4gKiBAdHlwZSB7e3Bvc3Q6IGFqYXgucG9zdCwgZ2V0OiBhamF4LmdldCwgeDogKChmdW5jdGlvbigpOiAoWE1MSHR0cFJlcXVlc3QpKXwqKSwgc2VuZDogYWpheC5zZW5kfX1cclxuICovXHJcbmNvbnN0IEFqYXggPSB7XHJcblx0eDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHZlcnNpb25zID0gW1xyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjYuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjUuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjQuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjMuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjIuMFwiLFxyXG5cdFx0XHRcIk1pY3Jvc29mdC5YbWxIdHRwXCJcclxuXHRcdF07XHJcblxyXG5cdFx0bGV0IHhocjtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCh2ZXJzaW9uc1tpXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHhocjtcclxuXHR9LFxyXG5cclxuXHRzZW5kOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBhc3luYykge1xyXG5cdFx0aWYgKGFzeW5jID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0YXN5bmMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHggPSBBamF4LngoKTtcclxuXHRcdHgub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG5cdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHguc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjYXNlIDIwMDpcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ3N1Y2Nlc3MnLCB4LnJlc3BvbnNlVGV4dClcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnZXJyb3InLCB4LnN0YXR1c1RleHQpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdHguc2VuZChkYXRhKVxyXG5cdH0sXHJcblxyXG5cdGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgY2FsbGJhY2ssIGFzeW5jKSB7XHJcblx0XHRsZXQgcXVlcnkgPSBbXTtcclxuXHJcblx0XHRpZiAoIWlzRW1wdHlPYmooZGF0YSkpIHtcclxuXHRcdFx0Zm9yIChsZXQga2V5IG9mIGRhdGEpIHtcclxuXHRcdFx0XHRxdWVyeS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXlbMF0pICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGtleVsxXSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRBamF4LnNlbmQodXJsICsgKHF1ZXJ5Lmxlbmd0aCA/ICc/JyArIHF1ZXJ5LmpvaW4oJyYnKSA6ICcnKSwgY2FsbGJhY2ssICdHRVQnLCBudWxsLCBhc3luYylcclxuXHR9LFxyXG5cclxuXHRwb3N0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdEFqYXguc2VuZCh1cmwsIGNhbGxiYWNrLCAnUE9TVCcsIGRhdGEsIGFzeW5jKVxyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCB7XHJcblx0ZGlzbWlzc1RyaWdnZXIsIEFqYXgsIGdldFNWR1xyXG59IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7bWVyZ2VEZWVwT2JqZWN0LCByZWZsb3d9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdjb2xsYXBzZSc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLmNvbGxhcHNlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0NPTExBUFNFID0gJ3ZnLWNvbGxhcHNlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTSU5HID0gJ3ZnLWNvbGxhcHNpbmcnO1xyXG5jb25zdCBDTEFTU19OQU1FX0NPTExBUFNFRCA9ICd2Zy1jb2xsYXBzZWQnO1xyXG5jb25zdCBDTEFTU19OQU1FX0RFRVBFUl9DSElMRFJFTiA9IGA6c2NvcGUgLiR7Q0xBU1NfTkFNRV9DT0xMQVBTRX0gLiR7Q0xBU1NfTkFNRV9DT0xMQVBTRX1gO1xyXG5cclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJjb2xsYXBzZVwiXSc7XHJcbmNvbnN0IFNFTEVDVE9SX0FDVElWRVMgPSAnLmNvbGxhcHNlLnNob3csIC5jb2xsYXBzZS5jb2xsYXBzaW5nJztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdDb2xsYXBzZSBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHR0b2dnbGU6IHRydWUsXHJcblx0XHRcdHBhcmVudDogbnVsbCxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2VcclxuXHRcdHRoaXMuX3RyaWdnZXJBcnJheSA9IFtdXHJcblxyXG5cdFx0Y29uc3QgdG9nZ2xlTGlzdCA9IFNlbGVjdG9ycy5maW5kQWxsKFNFTEVDVE9SX0RBVEFfVE9HR0xFKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IGVsZW0gb2YgdG9nZ2xlTGlzdCkge1xyXG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IFNlbGVjdG9ycy5nZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW0pO1xyXG5cdFx0XHRjb25zdCBmaWx0ZXJFbGVtZW50ID0gU2VsZWN0b3JzLmZpbmRBbGwoc2VsZWN0b3IpLmZpbHRlcihmb3VuZEVsZW1lbnQgPT4gZm91bmRFbGVtZW50ID09PSB0aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChzZWxlY3RvciAhPT0gbnVsbCAmJiBmaWx0ZXJFbGVtZW50Lmxlbmd0aCkge1xyXG5cdFx0XHRcdHRoaXMuX3RyaWdnZXJBcnJheS5wdXNoKGVsZW0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9pbml0aWFsaXplQ2hpbGRyZW4oKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX3BhcmFtcy5wYXJlbnQpIHtcclxuXHRcdFx0dGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuX3RyaWdnZXJBcnJheSwgdGhpcy5faXNTaG93bigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLnRvZ2dsZSkge1xyXG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9pc1RyYW5zaXRpb25pbmcgfHwgX3RoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBhY3RpdmVDaGlsZHJlbiA9IFtdO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLnBhcmVudCkge1xyXG5cdFx0XHRhY3RpdmVDaGlsZHJlbiA9IHRoaXMuX2dldEZpcnN0TGV2ZWxDaGlsZHJlbihTRUxFQ1RPUl9BQ1RJVkVTKVxyXG5cdFx0XHRcdC5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50KVxyXG5cdFx0XHRcdC5tYXAoZWxlbWVudCA9PiBWR0NvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgeyB0b2dnbGU6IGZhbHNlIH0pKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoYWN0aXZlQ2hpbGRyZW4ubGVuZ3RoICYmIGFjdGl2ZUNoaWxkcmVuWzBdLl9pc1RyYW5zaXRpb25pbmcpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBzdGFydEV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XKTtcclxuXHRcdGlmIChzdGFydEV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRmb3IgKGNvbnN0IGFjdGl2ZUluc3RhbmNlIG9mIGFjdGl2ZUNoaWxkcmVuKSB7XHJcblx0XHRcdGFjdGl2ZUluc3RhbmNlLmhpZGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0UpXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0lORylcclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAwO1xyXG5cclxuXHRcdF90aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoX3RoaXMuX3RyaWdnZXJBcnJheSwgdHJ1ZSk7XHJcblx0XHRfdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRfdGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcclxuXHRcdFx0X3RoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNJTkcpO1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0UsIENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnJztcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTik7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGUsIF90aGlzLl9lbGVtZW50LCB0cnVlKTtcclxuXHJcblx0XHRjb25zdCBzY3JvbGxTaXplID0gYHNjcm9sbEhlaWdodGA7XHJcblx0XHRfdGhpcy5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtfdGhpcy5fZWxlbWVudFtzY3JvbGxTaXplXX1weGA7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8ICFfdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3Qgc3RhcnRFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSlcclxuXHRcdGlmIChzdGFydEV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodH1weGA7XHJcblx0XHRyZWZsb3coX3RoaXMuX2VsZW1lbnQpO1xyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKTtcclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTRSwgQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IHRyaWdnZXIgb2YgX3RoaXMuX3RyaWdnZXJBcnJheSkge1xyXG5cdFx0XHRjb25zdCBlbGVtZW50ID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IodHJpZ2dlcik7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudCAmJiAhX3RoaXMuX2lzU2hvd24oZWxlbWVudCkpIHtcclxuXHRcdFx0XHRfdGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKFt0cmlnZ2VyXSwgZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWVcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcclxuXHRcdFx0X3RoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0lORyk7XHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9DT0xMQVBTRSk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnJztcclxuXHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlLCBfdGhpcy5fZWxlbWVudCwgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0cmlnZ2VyQXJyYXksIGlzT3Blbikge1xyXG5cdFx0aWYgKCF0cmlnZ2VyQXJyYXkubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiB0cmlnZ2VyQXJyYXkpIHtcclxuXHRcdFx0dGhpcy5fY2hhbmdlU3RhdGVCdXR0b24oZWxlbWVudCwgaXNPcGVuKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9pbml0aWFsaXplQ2hpbGRyZW4oKSB7XHJcblx0XHRpZiAoIXRoaXMuX3BhcmFtcy5wYXJlbnQpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldEZpcnN0TGV2ZWxDaGlsZHJlbihTRUxFQ1RPUl9EQVRBX1RPR0dMRSk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIGNoaWxkcmVuKSB7XHJcblx0XHRcdGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IoZWxlbWVudClcclxuXHJcblx0XHRcdGlmIChzZWxlY3RlZCkge1xyXG5cdFx0XHRcdHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhbZWxlbWVudF0sIHRoaXMuX2lzU2hvd24oc2VsZWN0ZWQpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfZ2V0Rmlyc3RMZXZlbENoaWxkcmVuKHNlbGVjdG9yKSB7XHJcblx0XHRjb25zdCBjaGlsZHJlbiA9IFNlbGVjdG9ycy5maW5kKENMQVNTX05BTUVfREVFUEVSX0NISUxEUkVOLCB0aGlzLl9wYXJhbXMucGFyZW50KTtcclxuXHRcdHJldHVybiBTZWxlY3RvcnMuZmluZChzZWxlY3RvciwgdGhpcy5fcGFyYW1zLnBhcmVudCkuZmlsdGVyKGVsZW1lbnQgPT4gIWNoaWxkcmVuLmluY2x1ZGVzKGVsZW1lbnQpKTtcclxuXHR9XHJcblxyXG5cdF9jaGFuZ2VTdGF0ZUJ1dHRvbihlbGVtZW50LCBpc09wZW4pIHtcclxuXHRcdGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShDTEFTU19OQU1FX0NPTExBUFNFRCwgIWlzT3Blbik7XHJcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGlzT3Blbik7XHJcblx0XHRlbGVtZW50LmlubmVySFRNTCA9IE1hbmlwdWxhdG9yLmdldChlbGVtZW50LCBgZGF0YS0ke2lzT3BlbiA/ICdoaWRlJyA6ICdzaG93J30tdGV4dGApIHx8IGVsZW1lbnQuaW5uZXJIVE1MO1xyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0EnIHx8IChldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiBldmVudC5kZWxlZ2F0ZVRhcmdldC50YWdOYW1lID09PSAnQScpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRTZWxlY3RvcnMuZ2V0TXVsdGlwbGVFbGVtZW50c0Zyb21TZWxlY3Rvcih0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRWR0NvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwge3RvZ2dsZTogZmFsc2V9KS50b2dnbGUoKTtcclxuXHR9KTtcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHQ29sbGFwc2U7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgbWVyZ2VEZWVwT2JqZWN0LCBub29wfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBQbGFjZW1lbnQgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvcGxhY2VtZW50XCI7XHJcblxyXG5jb25zdCBOQU1FICAgICAgICAgICAgID0gJ2Ryb3Bkb3duJztcclxuY29uc3QgTkFNRV9LRVkgICAgICAgICA9ICd2Zy5kcm9wZG93bic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgPSAnZmFkZSc7XHJcbmNvbnN0IFRBUkdFVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24tY29udGVudCc7XHJcbmNvbnN0IFBBUkVOVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXSc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSAgICAgYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSA9ICAgYGtleWRvd24uJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9ICAgICBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgPSAgYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHRHJvcGRvd24gZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdG9mZnNldDogWzAsIDJdLFxyXG5cdFx0XHRvdmVyOiBmYWxzZSxcclxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdG92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0cGxhY2VtZW50OiAnYm90dG9tJyxcclxuXHRcdFx0YW5pbWF0aW9uOiB0cnVlLFxyXG5cdFx0XHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0XHRcdGhvdmVyOiBmYWxzZSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fcGFyZW50ID0gdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlO1xyXG5cdFx0dGhpcy5fZHJvcCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIFRBUkdFVF9DT05UQUlORVIsIHRoaXMuX3BhcmVudCk7XHJcblx0XHR0aGlzLl9pc1BsYWNlbWVudCA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLl9wYXJhbXMudGltZW91dEFuaW1hdGlvbiA9IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNTaG93bigpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKTtcclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSB8fCB0aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLl9lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX3NldFBsYWNlbWVudCgpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSB8fCAhdGhpcy5faXNTaG93bigpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLl9lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHJldHVybiBzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSwgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTiwgcmVsYXRlZFRhcmdldCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX3BhcmVudCwgdHJ1ZSwgdGhpcy5fcGFyYW1zLnRpbWVvdXRBbmltYXRpb24pO1xyXG5cdH1cclxuXHJcblx0Ly8gVE9ETyBjbGFzcyBQbGFjZW1lbnQgaXNuJ3QgZG9uZVxyXG5cdF9zZXRQbGFjZW1lbnQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5faXNQbGFjZW1lbnQpIHtcclxuXHRcdFx0bGV0IHBsYWNlbWVudCA9IG5ldyBQbGFjZW1lbnQoe1xyXG5cdFx0XHRcdGVsZW1lbnQ6IHRoaXMuX3BhcmVudCxcclxuXHRcdFx0XHRkcm9wOiB0aGlzLl9kcm9wXHJcblx0XHRcdH0pLl9nZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRcdGlmIChwbGFjZW1lbnQuaXNGaXhlZCkge1xyXG5cdFx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMjAlKSc7IC8vIHRvZG8gdGhpcyBpcyDQutC+0YHRgtGL0LvRjCDQv9C+Zml40LjRgtGMXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLmxlZnQgPSBwbGFjZW1lbnQubGVmdCArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnRvcCA9ICBwbGFjZW1lbnQudG9wICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vZmZzZXQpIHtcclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUucGFkZGluZ1RvcCA9IF90aGlzLl9wYXJhbXMub2Zmc2V0WzFdICsgJ3B4JztcclxuXHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUucGFkZGluZ1JpZ2h0ID0gX3RoaXMuX3BhcmFtcy5vZmZzZXRbMF0gKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9pc1BsYWNlbWVudCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR0Ryb3Bkb3duLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRpZiAoaW5zdGFuY2UuX3BhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRsZXQgY3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oaW5zdGFuY2UuX3BhcmVudCwgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudCk7XHJcblxyXG5cdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBQQVJFTlRfQ09OVEFJTkVSKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoIWluc3RhbmNlLl9wYXJlbnQuY29udGFpbnModGFyZ2V0KSkgcmV0dXJuO1xyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gdGFyZ2V0O1xyXG5cdFx0XHRcdGluc3RhbmNlLnNob3coKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oaW5zdGFuY2UuX3BhcmVudCwgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0bGV0IHJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdFx0XHR3aGlsZSAocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0XHRcdFx0aWYgKHJlbGF0ZWRUYXJnZXQgPT09IGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdGluc3RhbmNlLl9jb21wbGV0ZUhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGluc3RhbmNlLl9lbGVtZW50fSk7XHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgVkdEcm9wZG93bi5rZXlkb3duSGFuZGxlcik7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSwgJy4nICsgVEFSR0VUX0NPTlRBSU5FUiwgVkdEcm9wZG93bi5rZXlkb3duSGFuZGxlcik7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHRHJvcGRvd24uY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFZHRHJvcGRvd24uY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpbnN0YW5jZS50b2dnbGUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KSB7XHJcblx0XHRjb25zdCBvcGVuVG9nZ2xlcyA9IFNlbGVjdG9ycy5maW5kQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXTpub3QoLmRpc2FibGVkKTpub3QoOmRpc2FibGVkKS5zaG93Jyk7XHJcblx0XHRmb3IgKGNvbnN0IHRvZ2dsZSBvZiBvcGVuVG9nZ2xlcykge1xyXG5cdFx0XHRjb25zdCBjb250ZXh0ID0gVkdEcm9wZG93bi5nZXRJbnN0YW5jZSh0b2dnbGUpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIHtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuJyArIFRBUkdFVF9DT05UQUlORVIpID09PSBjb250ZXh0Ll9kcm9wKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBjb21wb3NlZFBhdGggPSBldmVudC5jb21wb3NlZFBhdGgoKTtcclxuXHRcdFx0aWYgKGNvbXBvc2VkUGF0aC5pbmNsdWRlcyhjb250ZXh0Ll9lbGVtZW50KSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IGNvbnRleHQuX2VsZW1lbnQgfVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb250ZXh0Ll9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBrZXlkb3duSGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgaXNJbnB1dCA9IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXHJcblx0XHRjb25zdCBpc0VzY2FwZUV2ZW50ID0gZXZlbnQua2V5ID09PSAnRXNjYXBlJ1xyXG5cdFx0Y29uc3QgaXNVcE9yRG93bkV2ZW50ID0gWydBcnJvd1VwJywgJ0Fycm93RG93biddLmluY2x1ZGVzKGV2ZW50LmtleSlcclxuXHJcblx0XHRpZiAoIWlzVXBPckRvd25FdmVudCAmJiAhaXNFc2NhcGVFdmVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNJbnB1dCAmJiAhaXNFc2NhcGVFdmVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG5cdFx0Y29uc3QgZ2V0VG9nZ2xlQnV0dG9uID0gdGhpcy5tYXRjaGVzKFNFTEVDVE9SX0RBVEFfVE9HR0xFKSA/XHJcblx0XHRcdHRoaXMgOiAoU2VsZWN0b3JzLmZpbmQoU0VMRUNUT1JfREFUQV9UT0dHTEUsIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LnBhcmVudE5vZGUpKVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGdldFRvZ2dsZUJ1dHRvbilcclxuXHJcblx0XHRpZiAoaXNVcE9yRG93bkV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblx0XHRcdGluc3RhbmNlLnNob3coKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW5zdGFuY2UuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5oaWRlKClcclxuXHRcdFx0Z2V0VG9nZ2xlQnV0dG9uLmZvY3VzKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHRHJvcGRvd24uaGlkZU9wZW5Ub2dnbGVzKGV2ZW50KVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdEcm9wZG93bjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IFZHTW9kYWwgZnJvbSBcIi4uLy4uL3ZnbW9kYWwvanMvdmdtb2RhbFwiO1xyXG5pbXBvcnQge21ha2VSYW5kb21TdHJpbmcsIG1lcmdlRGVlcE9iamVjdCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBWR0NvbGxhcHNlIGZyb20gXCIuLi8uLi92Z2NvbGxhcHNlL2pzL3ZnY29sbGFwc2VcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnZm9ybS1zZW5kZXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5mcyc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIENsYXNzZXNcclxuICovXHJcblxyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBFdmVudHNcclxuICovXHJcbmNvbnN0IEVWRU5UX0tFWV9TVUNDRVNTID0gJ3ZnLmZzLnN1Y2Nlc3MnO1xyXG5jb25zdCBFVkVOVF9LRVlfRVJST1IgICA9ICd2Zy5mcy5lcnJvcic7XHJcbmNvbnN0IEVWRU5UX0tFWV9CRUZPUkUgID0gJ3ZnLmZzLmJlZm9yZSc7XHJcblxyXG5jb25zdCBFVkVOVF9TVUJNSVRfREFUQV9BUEkgPSBgc3VibWl0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHRm9ybVNlbmRlciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRyZWRpcmVjdDogJycsXHJcblx0XHRcdHZhbGlkYXRlOiBmYWxzZSxcclxuXHRcdFx0c3VibWl0OiBmYWxzZSxcclxuXHRcdFx0ZmllbGRzOiBbXSxcclxuXHRcdFx0YWxlcnQ6IHtcclxuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHRcdHR5cGU6ICdtb2RhbCdcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctZm9ybS1zZW5kZXInLFxyXG5cdFx0XHRcdGFsZXJ0Q29sbGFwc2U6ICd2Zy1mb3JtLXNlbmRlci1jb2xsYXBzZScsXHJcblx0XHRcdFx0YWxlcnRNb2RhbDogJ3ZnLWZvcm0tc2VuZGVyLW1vZGFsJyxcclxuXHRcdFx0XHR2YWxpZGF0aW9uOiAnbmVlZHMtdmFsaWRhdGlvbicsXHJcblx0XHRcdFx0d2FzVmFsaWRhdGU6ICd3YXMtdmFsaWRhdGVkJ1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnYWN0aW9uJykudG9Mb3dlckNhc2UoKTtcclxuXHRcdHRoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZCA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnbWV0aG9kJykudG9Mb3dlckNhc2UoKTtcclxuXHRcdHRoaXMuX2J1dHRvbiA9IFNlbGVjdG9ycy5maW5kKCdbdHlwZT1cInN1Ym1pdFwiXScsIHRoaXMuX2VsZW1lbnQpIHx8IFNlbGVjdG9ycy5maW5kKCdbZm9ybT1cIicgKyB0aGlzLl9lbGVtZW50LmlkICsgJ1wiXScpIHx8IG51bGw7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmlzQnRuVGV4dCAgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdkYXRhLWJ0bi10ZXh0JykgIT09ICdmYWxzZSc7XHJcblx0XHR0aGlzLl9wYXJhbXMuaXNKc29uUGFyc2UgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtanNvbi1wYXJzZScpICE9PSAnZmFsc2UnO1xyXG5cdFx0dGhpcy5fcGFyYW1zLmlzU2hvd1Bhc3MgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdkYXRhLXNob3ctcGFzcycpID09PSAndHJ1ZSc7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHRidWlsZCgpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLl9wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLnZhbGlkYXRlKSB7XHJcblx0XHRcdE1hbmlwdWxhdG9yLnNldCh0aGlzLl9lbGVtZW50LCAnbm92YWxpZGF0ZScsICcnKTtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5jbGFzc2VzLnZhbGlkYXRpb24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE8g0YHQtNC10LvQsNGC0Ywg0LTQvtCx0LDQstC70LXQvdC40LUg0LPQu9Cw0LfQsCDQtdGB0LvQuCDQtdGB0YLRjCDQstCy0L7QtCDQv9Cw0YDQvtC70Y9cclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cdH1cclxuXHJcblx0cmVxdWVzdChkYXRhLCBldmVudCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9hbGVydEJlZm9yZSgpO1xyXG5cclxuXHRcdF90aGlzLl9wYXJhbXMuYWpheC5maWVsZHMgPSBkYXRhO1xyXG5cclxuXHRcdF90aGlzLl9yb3V0ZShmdW5jdGlvbiAoc3RhdHVzLCBkYXRhKSB7XHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3dhcy12YWxpZGF0ZWQnKTtcclxuXHJcblx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LmVuYWJsZWQpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ3N0cmluZycgJiYgc3RhdHVzID09PSAnZXJyb3InKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5fYWxlcnRFcnJvcihldmVudCwgZGF0YSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygc3RhdHVzID09PSAnc3RyaW5nJyAmJiBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG5cdFx0XHRcdFx0X3RoaXMuX2FsZXJ0U3VjY2VzcyhldmVudCwgZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5yZWRpcmVjdCkge1xyXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gX3RoaXMuX3BhcmFtcy5yZWRpcmVjdDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRCZWZvcmUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG5cdFx0XHRbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYWxlcnRDb2xsYXBzZSldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XHJcblx0XHRcdFx0XHRWR0NvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwge3RvZ2dsZTogZmFsc2V9KS5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdiZWZvcmUnKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfQkVGT1JFLCBfdGhpcyk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRFcnJvcihldmVudCwgZGF0YSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9zdGF0dXNCdXR0b24oJ2FmdGVyJyk7XHJcblx0XHRfdGhpcy5fanNvblBhcnNlKGRhdGEsICdlcnJvcicpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9FUlJPUiwgW2V2ZW50LCBfdGhpcywgZGF0YV0pO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0U3VjY2VzcyhldmVudCwgZGF0YSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9zdGF0dXNCdXR0b24oJ2FmdGVyJyk7XHJcblx0XHRfdGhpcy5fanNvblBhcnNlKGRhdGEsICdzdWNjZXNzJyk7XHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NVQ0NFU1MsIFtldmVudCwgX3RoaXMsIGRhdGFdKTtcclxuXHR9XHJcblxyXG5cdF9zdGF0dXNCdXR0b24oc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fYnV0dG9uKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGJ0blN1Ym1pdFRleHQgPSBfdGhpcy5fYnV0dG9uLFxyXG5cdFx0XHRidG5UZXh0ID0ge1xyXG5cdFx0XHRzZW5kOiAn0J7RgtC/0YDQsNCy0LvRj9C10LwuLi4nLFxyXG5cdFx0XHR0ZXh0OiAn0J7RgtC/0YDQsNCy0LjRgtGMJ1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXNwaW5uZXInKSAmJiBzdGF0dXMgPT09ICdiZWZvcmUnKSB7XHJcblx0XHRcdF90aGlzLl9idXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgJzxzcGFuIGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMlwiPjwvc3Bhbj4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXRleHQnKSkge1xyXG5cdFx0XHRidG5UZXh0LnRleHQgPSBNYW5pcHVsYXRvci5nZXQoX3RoaXMuX2J1dHRvbiwgJ2RhdGEtdGV4dCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0ICRidG5UZXh0ID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXh0XScpO1xyXG5cdFx0XHRpZiAoJGJ0blRleHQpIHtcclxuXHRcdFx0XHRidG5UZXh0LnRleHQgPSBNYW5pcHVsYXRvci5nZXQoJGJ0blRleHQsICdkYXRhLXRleHQnKTtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0ID0gJGJ0blRleHQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXRleHQtc2VuZCcpKSB7XHJcblx0XHRcdGJ0blRleHQuc2VuZCA9IE1hbmlwdWxhdG9yLmdldChfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0LXNlbmQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCAkYnRuVGV4dFNlbmQgPSBfdGhpcy5fYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRleHQtc2VuZF0nKTtcclxuXHRcdFx0aWYgKCRidG5UZXh0U2VuZCkge1xyXG5cdFx0XHRcdGJ0blRleHQuc2VuZCA9IE1hbmlwdWxhdG9yLmdldCgkYnRuVGV4dFNlbmQsICdkYXRhLXRleHQtc2VuZCcpO1xyXG5cdFx0XHRcdGJ0blN1Ym1pdFRleHQgPSAkYnRuVGV4dFNlbmQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3RhdHVzID09PSAnYmVmb3JlJykge1xyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5pc0J0blRleHQpIHtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0LmlubmVySFRNTCA9IGJ0blRleHQuc2VuZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQoX3RoaXMuX2J1dHRvbiwnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3RhdHVzID09PSAnYWZ0ZXInKSB7XHJcblx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmlzQnRuVGV4dCkge1xyXG5cdFx0XHRcdGJ0blN1Ym1pdFRleHQuaW5uZXJIVE1MID0gYnRuVGV4dC50ZXh0O1xyXG5cdFx0XHR9XHJcblx0XHRcdE1hbmlwdWxhdG9yLnJlbW92ZShfdGhpcy5fYnV0dG9uLCdkaXNhYmxlZCcpO1xyXG5cclxuXHRcdFx0bGV0IHNwaW5uZXIgPSBfdGhpcy5fYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5zcGlubmVyLWJvcmRlcicpO1xyXG5cdFx0XHRpZiAoc3Bpbm5lcikgc3Bpbm5lci5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9qc29uUGFyc2UoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuaXNKc29uUGFyc2UgJiYgdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGxldCBwYXJzZXJEYXRhID0ge307XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHBhcnNlckRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cdFx0XHRcdF90aGlzLmFsZXJ0KHBhcnNlckRhdGEsIHN0YXR1cyk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRfdGhpcy5hbGVydChkYXRhLCBzdGF0dXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRfdGhpcy5hbGVydChkYXRhLCBzdGF0dXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YWxlcnQoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiKSB7XHJcblx0XHRcdGlmICgnZXJyb3JzJyBpbiBkYXRhKSB7XHJcblx0XHRcdFx0c3RhdHVzID0gbm9ybWFsaXplRGF0YShkYXRhLmVycm9ycykgPyAnZXJyb3InIDogJ3N1Y2Nlc3MnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fcGFyYW1zLmFsZXJ0LmVuYWJsZWQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdtb2RhbCcpIHtcclxuXHRcdFx0X3RoaXMuX2FsZXJ0TW9kYWwoZGF0YSwgc3RhdHVzKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdjb2xsYXBzZScpIHtcclxuXHRcdFx0X3RoaXMuX2FsZXJ0Q29sbGFwc2UoZGF0YSwgc3RhdHVzKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2FsZXJ0TW9kYWwoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0Ly8g0JXRgdGC0Ywg0LvQuCDQvtGC0LrRgNGL0YLRi9C1INC80L7QtNCw0LvQutC4LCDQt9Cw0LrRgNGL0LLQsNC10LxcclxuXHRcdFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbCcpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdGlmIChlbGVtZW50ICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcclxuXHRcdFx0XHRsZXQgbUJTID0gYm9vdHN0cmFwLk1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCk7XHJcblx0XHRcdFx0bUJTLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3ZnLW1vZGFsJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdGNvbnN0IG1WRyA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50KTtcclxuXHRcdFx0XHRtVkcuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgJG1vZGFsID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0TW9kYWwpO1xyXG5cdFx0aWYgKCEkbW9kYWwpIHtcclxuXHRcdFx0JG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdCRtb2RhbC5jbGFzc0xpc3QuYWRkKCd2Zy1tb2RhbCcsICdmYWRlJywgX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0TW9kYWwpO1xyXG5cdFx0XHQkbW9kYWwuaWQgPSBfdGhpcy5fcGFyYW1zLmNsYXNzZXMuZ2VuZXJhbCArICctJyArIG1ha2VSYW5kb21TdHJpbmcoKTtcclxuXHJcblx0XHRcdGxldCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0ZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3ZnLW1vZGFsLWRpYWxvZycsICd2Zy1tb2RhbC1tZCcpO1xyXG5cclxuXHRcdFx0bGV0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0Y29udGVudC5jbGFzc0xpc3QuYWRkKCd2Zy1tb2RhbC1jb250ZW50Jyk7XHJcblxyXG5cdFx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRib2R5LmNsYXNzTGlzdC5hZGQoJ3ZnLW1vZGFsLWJvZHknKTtcclxuXHJcblx0XHRcdGNvbnRlbnQuYXBwZW5kKGJvZHkpO1xyXG5cdFx0XHRkaWFsb2cuYXBwZW5kKGNvbnRlbnQpO1xyXG5cdFx0XHQkbW9kYWwuYXBwZW5kKGRpYWxvZyk7XHJcblx0XHR9XHJcblxyXG5cdFx0JG1vZGFsLmFwcGVuZChfdGhpcy5zZXREYXRhUmVsYXRpb25TdGF0dXMoJG1vZGFsLCBzdGF0dXMsIGRhdGEsICdtb2RhbCcpKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKCRtb2RhbCk7XHJcblxyXG5cdFx0VkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKCRtb2RhbCkudG9nZ2xlKCk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRDb2xsYXBzZShkYXRhLCBzdGF0dXMpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRsZXQgJGNvbGxhcHNlID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpO1xyXG5cdFx0aWYgKCEkY29sbGFwc2UpIHtcclxuXHRcdFx0JGNvbGxhcHNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdCRjb2xsYXBzZS5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydENvbGxhcHNlKTtcclxuXHRcdFx0JGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ3ZnLWNvbGxhcHNlJyk7XHJcblx0XHRcdCRjb2xsYXBzZS5pZCA9IF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsICsgJy0nICsgbWFrZVJhbmRvbVN0cmluZygpO1xyXG5cdFx0XHQkY29sbGFwc2UuYXBwZW5kKF90aGlzLnNldERhdGFSZWxhdGlvblN0YXR1cygkY29sbGFwc2UsIHN0YXR1cywgZGF0YSwgJ2NvbGxhcHNlJykpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQucHJlcGVuZCgkY29sbGFwc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFZHQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZSgkY29sbGFwc2UsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fVxyXG5cclxuXHRzZXREYXRhUmVsYXRpb25TdGF0dXMoJGVsZW1lbnQsIHN0YXR1cywgZGF0YSwgdHlwZSkge1xyXG5cdFx0bGV0ICRhbGVydCA9IFNlbGVjdG9ycy5maW5kKCcudmctYWxlcnQtJyArIHN0YXR1cywgJGVsZW1lbnQpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0aWYgKCd2aWV3JyBpbiBkYXRhICYmIHR5cGVvZiBkYXRhLnZpZXcgPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0bGV0IHR4dCA9ICcnO1xyXG5cclxuXHRcdFx0XHRpZiAoJ3RpdGxlJyBpbiBkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHRcdHR4dCArPSAnPGg0IGNsYXNzPVwidmctYWxlcnQtY29udGVudC0tdGl0bGVcIj4nICsgZGF0YS52aWV3LnRpdGxlICsgJzwvaDQ+J1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCdtZXNzYWdlJyBpbiBkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHRcdHR4dCArPSAnPGRpdiBjbGFzcz1cInZnLWFsZXJ0LWNvbnRlbnQtLW1lc3NhZ2VcIj4nICsgZGF0YS52aWV3Lm1lc3NhZ2UgKyAnPC9kaXY+J1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZGF0YSA9IHR4dDtcclxuXHRcdFx0fSBlbHNlIGlmICgndmlldycgaW4gZGF0YSAmJiB0eXBlb2YgZGF0YS52aWV3ID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdFx0ZGF0YSA9IGRhdGEudmlldztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJGFsZXJ0KSB7XHJcblx0XHRcdCRhbGVydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHQkYWxlcnQuY2xhc3NMaXN0LmFkZCgndmctYWxlcnQnLCAndmctYWxlcnQtJyArIHN0YXR1cywgJ3ZnLWFsZXJ0LScgKyB0eXBlKTtcclxuXHJcblx0XHRcdGxldCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgndmctYWxlcnQtY29udGVudCcpO1xyXG5cclxuXHRcdFx0bGV0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKCd2Zy1hbGVydC1jb250ZW50LS1pY29uJyk7XHJcblxyXG5cdFx0XHRsZXQgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHRcdFx0aS5pbm5lckhUTUwgPSBnZXRTVkcoc3RhdHVzKTtcclxuXHJcblx0XHRcdGljb24uYXBwZW5kKGkpO1xyXG5cdFx0XHRjb250ZW50LmFwcGVuZChpY29uKTtcclxuXHJcblx0XHRcdGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdHRleHQuY2xhc3NMaXN0LmFkZCgndmctYWxlcnQtY29udGVudC0tdGV4dCcpO1xyXG5cdFx0XHR0ZXh0LmlubmVySFRNTCA9IGRhdGE7XHJcblxyXG5cdFx0XHRjb250ZW50LmFwcGVuZCh0ZXh0KTtcclxuXHRcdFx0JGFsZXJ0LmFwcGVuZChjb250ZW50KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1hbGVydC1jb250ZW50LS10ZXh0JywgJGFsZXJ0KTtcclxuXHRcdFx0dGV4dC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAkYWxlcnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRm9ybVNlbmRlci5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHRpbnN0YW5jZS5idWlsZCgpO1xyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9TVUJNSVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGlmICghTWFuaXB1bGF0b3IuaGFzKGV2ZW50LnRhcmdldCwgJ2RhdGEtdmdmb3Jtc2VuZGVyJykpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGluc3RhbmNlID0gVkdGb3JtU2VuZGVyLmdldE9yQ3JlYXRlSW5zdGFuY2UoZXZlbnQudGFyZ2V0LCB7fSk7XHJcblx0aWYgKCFpbnN0YW5jZSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKGluc3RhbmNlLl9wYXJhbXMudmFsaWRhdGUpIHtcclxuXHRcdGlmICghaW5zdGFuY2UuX2VsZW1lbnQuY2hlY2tWYWxpZGl0eSgpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0aW5zdGFuY2UuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMud2FzVmFsaWRhdGUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgY29sbGVjdERhdGEgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcclxuXHRcdGZvciAobGV0IG5hbWUgaW4gZmllbGRzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZmllbGRzW25hbWVdID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiBmaWVsZHNbbmFtZV0pIHtcclxuXHRcdFx0XHRcdGxldCBhcnIgPSBPYmplY3Qua2V5cyhmaWVsZHNbbmFtZV1ba2V5XSkubWFwKGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmaWVsZHNbbmFtZV1ba2V5XVtpXTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgYXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgZmllbGRzW25hbWVdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH1cclxuXHJcblx0aWYgKCFpbnN0YW5jZS5fcGFyYW1zLnN1Ym1pdCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YShpbnN0YW5jZS5fZWxlbWVudCk7XHJcblx0XHRpZiAodHlwZW9mIGluc3RhbmNlLl9wYXJhbXMuYWpheC5maWVsZHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdGRhdGEgPSBjb2xsZWN0RGF0YShkYXRhLCBpbnN0YW5jZS5fcGFyYW1zLmFqYXguZmllbGRzKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gaW5zdGFuY2UucmVxdWVzdChkYXRhLCBldmVudCk7XHJcblx0fVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdGb3JtU2VuZGVyOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9vdmVyZmxvd1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbW9kYWwnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5tb2RhbCc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnXHJcbmNvbnN0IFNFTEVDVE9SX0RJQUxPRyA9ICcudmctbW9kYWwtZGlhbG9nJ1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJtb2RhbFwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCAgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSAgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdNb2RhbCBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRidXR0b246IG51bGwsXHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2RpYWxvZyA9IFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RJQUxPRywgdGhpcy5fZWxlbWVudClcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHQvL3RoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9pc0FuaW1hdGVkKCkpIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihfdGhpcy5fZWxlbWVudCwgJ21vdXNlZG93bi52Zy5tb2RhbCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGNvbnN0IG1vZGFsQ29udGVudCA9IFNlbGVjdG9ycy5nZXQoJy52Zy1tb2RhbC1jb250ZW50JywgdGhpcyk7XHJcblx0XHRcdFx0aWYgKCFtb2RhbENvbnRlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuX2lzQW5pbWF0ZWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9lbGVtZW50LCB0aGlzLl9pc0FuaW1hdGVkKCkpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9pc0FuaW1hdGVkKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRkFERSlcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKClcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEKVxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHTW9kYWwpXHJcblxyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1tb2RhbC5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VkdNb2RhbC5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRjb25zdCBkYXRhID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdNb2RhbDtcclxuIiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IFJlc3BvbnNpdmUgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvcmVzcG9uc2l2ZVwiO1xyXG5pbXBvcnQge2dldFNWR30gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIGlzVmlzaWJsZSwgbWVyZ2VEZWVwT2JqZWN0LCBub29wLCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ25hdic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLm5hdic7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIENsYXNzZXNcclxuICovXHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgICA9ICdmYWRlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9BQ1RJVkUgPSAnYWN0aXZlJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnLnZnLW5hdiBhJztcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgRXZlbnRzXHJcbiAqL1xyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJID0gYG1vdXNlb3Zlci4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJICA9IGBtb3VzZW91dC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSBga2V5dXAuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9SRVNJWkVfREFUQV9BUEkgPSBgcmVzaXplLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHTmF2IGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRicmVha3BvaW50OiAnbGcnLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdob3Jpem9udGFsJyxcclxuXHRcdFx0Y2xhc3Nlczoge1xyXG5cdFx0XHRcdGhhbWJ1cmdlckFjdGl2ZTogJ3ZnLW5hdi1oYW1idXJnZXItYWN0aXZlJyxcclxuXHRcdFx0XHRoYW1idXJnZXI6ICd2Zy1uYXYtaGFtYnVyZ2VyJyxcclxuXHRcdFx0XHRjb250YWluZXI6ICd2Zy1uYXYtY29udGFpbmVyJyxcclxuXHRcdFx0XHR3cmFwcGVyOiAndmctbmF2LXdyYXBwZXInLFxyXG5cdFx0XHRcdGFjdGl2ZTogJ3ZnLW5hdi1hY3RpdmUnLFxyXG5cdFx0XHRcdGV4cGFuZDogJ3ZnLW5hdi1leHBhbmQnLFxyXG5cdFx0XHRcdGNsb25lZDogJ3ZnLW5hdi1jbG9uZWQnLFxyXG5cdFx0XHRcdGhvdmVyOiAndmctbmF2LWhvdmVyJyxcclxuXHRcdFx0XHRmbGlwOiAndmctbmF2LWZsaXAnLFxyXG5cdFx0XHRcdFhYWEw6ICd2Zy1uYXYteHh4bCcsXHJcblx0XHRcdFx0WFhMOiAndmctbmF2LXh4bCcsXHJcblx0XHRcdFx0WEw6ICd2Zy1uYXYteGwnLFxyXG5cdFx0XHRcdExHOiAndmctbmF2LWxnJyxcclxuXHRcdFx0XHRNRDogJ3ZnLW5hdi1tZCcsXHJcblx0XHRcdFx0U006ICd2Zy1uYXYtc20nLFxyXG5cdFx0XHRcdFhTOiAndmctbmF2LXhzJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRleHBhbmQ6IHRydWUsXHJcblx0XHRcdGhvdmVyOiBmYWxzZSxcclxuXHRcdFx0cG9zaXRpb246IHRydWUsXHJcblx0XHRcdGNvbGxhcHNlOiB0cnVlLFxyXG5cdFx0XHR0b2dnbGU6ICc8c3BhbiBjbGFzcz1cImRlZmF1bHRcIj48L3NwYW4+JyxcclxuXHRcdFx0aGFtYnVyZ2VyOiB7XHJcblx0XHRcdFx0dGl0bGU6ICcnLFxyXG5cdFx0XHRcdGJvZHk6IG51bGxcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2FsbGJhY2s6IG5vb3AsXHJcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHRcdFx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gbnVsbDtcclxuXHRcdHRoaXMubmF2aWdhdGlvbiA9ICcuJyArIHRoaXMuX3BhcmFtcy5jbGFzc2VzLndyYXBwZXI7XHJcblxyXG5cdFx0dGhpcy5tb3ZlZExpbmtzID0gW107XHJcblx0XHR0aGlzLiRsaW5rcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuJyArIHRoaXMuX3BhcmFtcy5jbGFzc2VzLndyYXBwZXIgKyAnID4gbGknLCB0aGlzLm5hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5hbmltYXRpb24gPT09IGZhbHNlKSB7XHJcblx0XHRcdHRoaXMuX3BhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGdldCBuYXZpZ2F0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25hdmlnYXRpb247XHJcblx0fVxyXG5cclxuXHRzZXQgbmF2aWdhdGlvbihlbCkge1xyXG5cdFx0bGV0IGVsbSA9IFNlbGVjdG9ycy5maW5kKGVsLCB0aGlzLl9lbGVtZW50KTtcclxuXHRcdGlmICghZWxtKSByZXR1cm47XHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gZWxtO1xyXG5cdH1cclxuXHJcblx0YnVpbGQoKSB7XHJcblx0XHRpZiAoIXRoaXMubmF2aWdhdGlvbikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBwYXJhbXMgPSB0aGlzLl9wYXJhbXM7XHJcblxyXG5cdFx0Ly8g0JLQtdGI0LDQtdC8INC+0YHQvdC+0LLQvdGL0LUg0LrQu9Cw0YHRgdGLXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuY29udGFpbmVyKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbmF2LScgKyBwYXJhbXMucGxhY2VtZW50KTtcclxuXHJcblx0XHQvLyDQldGB0LvQuCDQvdGD0LbQvdC+INC+0YHRgtCw0LLQuNGC0Ywg0YHQv9C40YHQvtC6INC80LXQvdGOINC40LvQuCDRg9GB0YLQsNC90L7QstC40YLRjCDQvNC10LTQuNCwINGC0L7Rh9C60YNcclxuXHRcdGlmIChwYXJhbXMuYnJlYWtwb2ludCA9PT0gbnVsbCkge1xyXG5cdFx0XHRwYXJhbXMuZXhwYW5kID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtcy5icmVha3BvaW50ID09PSBudWxsIHx8ICFwYXJhbXMuZXhwYW5kKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5leHBhbmQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2Zy1uYXYtJyArIHBhcmFtcy5icmVha3BvaW50KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyDQnNC10L3RjiDRgdGA0LDQsdCw0YLRi9Cy0LDQtdGCINC/0YDQuCDQvdCw0LLQtdC00LXQvdC40LgsINC10YHQu9C4INGN0YLQviDQvdC1INC80L7QsdC40LvRjNC90L7QtSDRg9GB0YLRgNC+0LnRgdGC0LLQvlxyXG5cdFx0aWYgKHBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuaG92ZXIpO1xyXG5cclxuXHRcdFx0aWYgKFJlc3BvbnNpdmUuY2hlY2tNb2JpbGVPclRhYmxldCgpKSB7XHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INCz0LDQvNCx0YPRgNCz0LXRgCwg0LXRgdC70Lgg0LXQs9C+INC90LXRgiDQsiDRgNCw0LfQvNC10YLQutC1XHJcblx0XHRpZiAocGFyYW1zLmV4cGFuZCAmJiAhcGFyYW1zLmhhbWJ1cmdlci5ib2R5KSB7XHJcblx0XHRcdGxldCBpc0hhbWJ1cmdlciA9IFNlbGVjdG9ycy5maW5kKCcuJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciwgdGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0XHRpZiAoaXNIYW1idXJnZXIgPT09IG51bGwpIHtcclxuXHRcdFx0XHRsZXQgbVRpdGxlID0gJycsXHJcblx0XHRcdFx0XHRoYW1idXJnZXIgPSAnPHNwYW4gY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJy0tbGluZXNcIj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48L3NwYW4+JztcclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIudGl0bGUpIHtcclxuXHRcdFx0XHRcdG1UaXRsZSA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS10aXRsZVwiPicrIHBhcmFtcy5oYW1idXJnZXIudGl0bGUgKyc8L3NwYW4+JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwYXJhbXMuaGFtYnVyZ2VyLmJvZHkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9IHBhcmFtcy5oYW1idXJnZXIuYm9keTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywnPGEgaHJlZj1cIiNzaWRlYmFyLW5hdlwiIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICdcIiBkYXRhLXZnLXRvZ2dsZT1cInNpZGViYXJcIj4nICsgbVRpdGxlICsgaGFtYnVyZ2VyICsnPC9hPicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0YPQutCw0LfQsNGC0LXQu9GMINC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9GPXHJcblx0XHRpZiAocGFyYW1zLnRvZ2dsZSkge1xyXG5cdFx0XHRsZXQgJGRyb3Bkb3duX2EgPSBbLi4uU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bi1tZWdhID4gYSwgLmRyb3Bkb3duID4gYScsIHRoaXMuX2VsZW1lbnQpXSxcclxuXHRcdFx0XHR0b2dnbGUgPSAnPHNwYW4gY2xhc3M9XCJ0b2dnbGVcIj4nICsgcGFyYW1zLnRvZ2dsZSArICc8L3NwYW4+JztcclxuXHJcblx0XHRcdGlmICgkZHJvcGRvd25fYS5sZW5ndGgpIHtcclxuXHRcdFx0XHQkZHJvcGRvd25fYS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVsZW0ucXVlcnlTZWxlY3RvcignLnRvZ2dsZScpICYmICFlbGVtLmNsb3Nlc3QoJy5kb3RzJykpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG5cdFx0XHRcdFx0XHRlbGVtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdG9nZ2xlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtcy5jb2xsYXBzZSAmJiBSZXNwb25zaXZlLmNoZWNrKHRoaXMpICYmIHBhcmFtcy5wbGFjZW1lbnQgIT09ICd2ZXJ0aWNhbCcpIHtcclxuXHRcdFx0c2V0Q29sbGFwc2UodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdhZnRlckluaXQnIGluIHRoaXMuX3BhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRleGVjdXRlKHRoaXMuX3BhcmFtcy5jYWxsYmFjay5hZnRlckluaXQsIFt0aGlzXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiDQpNGD0L3QutGG0LjRjyDRgdCy0L7RgNCw0YfQuNCy0LDQvdC40Y9cclxuXHRcdCAqIFRPRE8g0J/RgNC40LTRg9C80LDRgtGMINGH0YLQviDRgtC+INGBINC80LXQs9CwINC80LXQvdGOLCDQutC+0YLQvtGA0L7QtSDRg9GF0L7QtNC40YIg0LIg0L/QvtC00LzQtdC90Y5cclxuXHRcdCAqIFRPRE8g0KLQsNC6INC20LUg0LXRgdGC0Ywg0LrQvtGB0Y/QutC4INC/0YDQuCDRgNC10YHQsNC50LfQtVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBzZXRDb2xsYXBzZShfdGhpcykge1xyXG5cdFx0XHRsZXQgd2lkdGhfbmF2aWdhdGlvbl9yZXNwb25zaXZlID0gX3RoaXMubmF2aWdhdGlvbi5jbGllbnRXaWR0aCxcclxuXHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IDAsXHJcblx0XHRcdFx0JGRvdHMgPSBTZWxlY3RvcnMuZmluZCgnLmRvdHMnLCBfdGhpcy5uYXZpZ2F0aW9uKSxcclxuXHRcdFx0XHRfZG90cyA9IGdldFNWRygnZG90cycpO1xyXG5cclxuXHRcdFx0aWYgKF90aGlzLiRsaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gJGRvdHMuY2xpZW50V2lkdGhcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bGV0ICRhID0gU2VsZWN0b3JzLmZpbmQoJ2EnLCBfdGhpcy4kbGlua3NbMF0pLFxyXG5cdFx0XHRcdFx0XHQkbGlua1N0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSgkYSksXHJcblx0XHRcdFx0XHRcdHBhZGRpbmdMZWZ0ID0gbm9ybWFsaXplRGF0YSgkbGlua1N0eWxlLnBhZGRpbmdMZWZ0LnNsaWNlKDAsIC0yKSksXHJcblx0XHRcdFx0XHRcdHBhZGRpbmdSaWdodCA9ICBub3JtYWxpemVEYXRhKCRsaW5rU3R5bGUucGFkZGluZ1JpZ2h0LnNsaWNlKDAsIC0yKSksXHJcblx0XHRcdFx0XHRcdHBhZGRpbmcgPSBwYWRkaW5nTGVmdCArIHBhZGRpbmdSaWdodDtcclxuXHJcblx0XHRcdFx0XHQvLyBUT0RPINC90LUg0YHQvtCy0YHQtdC8INCy0LXRgNC90L4sINC90L4g0LzRiyDRgtC+0YfQvdC+INC30L3QsNC10Lwg0YjQuNGA0LjQvdGDINGC0L7Rh9C10Log0LIgc3ZnIC0gMTZweFxyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSBwYWRkaW5nICsgMTY7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGxldCAkbGluayBvZiBfdGhpcy4kbGlua3MpIHtcclxuXHRcdFx0XHRcdGxldCB3aWR0aCA9ICRsaW5rLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSB3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSArIHdpZHRoO1xyXG5cclxuXHRcdFx0XHRcdGlmICgod2lkdGhfbmF2aWdhdGlvbl9yZXNwb25zaXZlKSA8IHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVkTGlua3MucHVzaCgkbGluayk7XHJcblx0XHRcdFx0XHRcdCRsaW5rLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmluc2VydEJlZm9yZShfdGhpcy5tb3ZlZExpbmtzWzBdLCAkZG90cylcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5hcHBlbmRDaGlsZChfdGhpcy5tb3ZlZExpbmtzWzBdKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRfdGhpcy5tb3ZlZExpbmtzLnNwbGljZSgwLCAxKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRpZiAoISRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCc8bGkgY2xhc3M9XCJkcm9wZG93biBkb3RzXCI+JyArICc8YSBocmVmPVwiI1wiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPicrIF9kb3RzICsnPC9hPjwvbGk+Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0XHQkZG90cy5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCAkZCA9IF90aGlzLm5hdmlnYXRpb24ucXVlcnlTZWxlY3RvcignLmRvdHMnKTtcclxuXHRcdFx0XHRpZiAoJGQgJiYgX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGxldCAkZHJvcGRvd24gPSAkZC5xdWVyeVNlbGVjdG9yKCd1bCcpO1xyXG5cdFx0XHRcdFx0aWYgKCRkcm9wZG93bikge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsaW5rIG9mIF90aGlzLm1vdmVkTGlua3MpIHtcclxuXHRcdFx0XHRcdFx0XHQkZHJvcGRvd24ucHJlcGVuZChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0ICRkcm9wZG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcblx0XHRcdFx0XHRcdCRkcm9wZG93bi5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bi1jb250ZW50Jyk7XHJcblx0XHRcdFx0XHRcdCRkcm9wZG93bi5jbGFzc0xpc3QuYWRkKCdyaWdodCcpO1xyXG5cclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBfdGhpcy5tb3ZlZExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdFx0JGRyb3Bkb3duLnByZXBlbmQobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdCRkLmFwcGVuZENoaWxkKCRkcm9wZG93bik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGxldCB0YXJnZXQgPSByZWxhdGVkVGFyZ2V0LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0aWYgKCF0YXJnZXQgfHwgaXNEaXNhYmxlZCh0YXJnZXQpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24tY29udGVudCcpKSB7XHJcblx0XHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaXJzdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRhcmdldCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBkcm9wID0gU2VsZWN0b3JzLmZpbmQoJy5kcm9wZG93bi1jb250ZW50JywgdGFyZ2V0KSxcclxuXHRcdFx0bGluayA9IHRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcblx0XHRpZiAobGluaykgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG5cdFx0ZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0FDVElWRSk7XHJcblxyXG5cdFx0c2V0RHJvcFBvc2l0aW9uKGRyb3ApXHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0ZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRhcmdldCwgRVZFTlRfS0VZX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCBkcm9wLCB0cnVlLCA1MCk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtICRkcm9wXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIHNldERyb3BQb3NpdGlvbigkZHJvcCkge1xyXG5cdFx0XHRsZXQge3dpZHRoLCByaWdodH0gPSAkZHJvcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuXHRcdFx0XHR3aW5kb3dfd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcblx0XHRcdGxldCBOX3JpZ2h0ID0gd2luZG93X3dpZHRoIC0gcmlnaHQgLSB3aWR0aDtcclxuXHJcblx0XHRcdCRkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdCRkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2xlZnQnKTtcclxuXHJcblx0XHRcdGxldCAkcGFyZW50ID0gJGRyb3AuY2xvc2VzdCgnbGknKSxcclxuXHRcdFx0XHQkdWwgPSAkcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3VsJyk7XHJcblxyXG5cdFx0XHRpZiAoTl9yaWdodCA+IHdpZHRoKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCAkZWwgb2YgJHVsKSB7XHJcblx0XHRcdFx0XHQkZWwuY2xhc3NMaXN0LmFkZCgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0ICRlbCBvZiAkdWwpIHtcclxuXHRcdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBlbGVtZW50ID0gcmVsYXRlZFRhcmdldC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICgnZWxtJyBpbiByZWxhdGVkVGFyZ2V0ICYmIHJlbGF0ZWRUYXJnZXQuZWxtKSB7XHJcblx0XHRcdGVsZW1lbnQgPSByZWxhdGVkVGFyZ2V0LmVsbVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlbGVtZW50KSB7XHJcblx0XHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKGVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXJzdCcpKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaXJzdCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRbLi4uU2VsZWN0b3JzLmZpbmRBbGwoJy4nICsgQ0xBU1NfTkFNRV9TSE9XLCBlbGVtZW50KV0uZm9yRWFjaChmdW5jdGlvbiAoZWwsIGluZGV4KSB7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cclxuXHRcdFx0XHRsZXQgcGFyZW50ID0gZWwuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0aWYgKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9BQ1RJVkUpKSB7XHJcblx0XHRcdFx0XHRwYXJlbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgbGluayA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdFx0aWYgKGxpbmspIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRcdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihlbCwgRVZFTlRfS0VZX0hJRERFTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCBlbCwgdHJ1ZSwgNTAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVE9ETyDQtdGB0LvQuCDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0L3QtdGB0LrQvtC70YzQutC+INC90LDQstC40LPQsNGG0LjQuSwg0YLQviDQtdGB0YLRjCDQutC+0YHRj9C60LhcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBwYXJhbXNcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR05hdi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHRpbnN0YW5jZS5idWlsZCgpO1xyXG5cclxuXHRcdGxldCBkcm9wcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd24nLCBpbnN0YW5jZS5fbmF2aWdhdGlvbilcclxuXHJcblx0XHRpZiAoaW5zdGFuY2UuX3BhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRbLi4uZHJvcHNdLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGlmICghaW5zdGFuY2UubmF2aWdhdGlvbi5jb250YWlucyh0YXJnZXQpKSByZXR1cm47XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldDogdGFyZ2V0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2Uuc2hvdyhyZWxhdGVkVGFyZ2V0KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyksXHJcblx0XHRcdFx0XHRcdGVsbSA9IGN1cnJlbnRFbGVtO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGVsbTogZWxtfSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghTWFuaXB1bGF0b3IuaGFzKHRoaXMsICdhcmlhLWV4cGFuZGVkJykpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICgnY2xpY2snIGluIGluc3RhbmNlLl9wYXJhbXMuY2FsbGJhY2spIHtcclxuXHRcdFx0XHRcdGV4ZWN1dGUoaW5zdGFuY2UuX3BhcmFtcy5jYWxsYmFjay5jbGljaywgW3RoaXNdKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdGxldCBzZWxmID0gdGhpcy5jbG9zZXN0KCcudmctbmF2JyksXHJcblx0XHRcdFx0XHRpc0ZpcnN0ID0gc2VsZi5xdWVyeVNlbGVjdG9yKCcuZmlyc3QnKTtcclxuXHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IHRoaXMuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKGlzRGlzYWJsZWQodGFyZ2V0KSAmJiAhaXNWaXNpYmxlKHRhcmdldCkpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChpc0ZpcnN0ICYmIHRoaXMuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5oaWRlKHtyZWxhdGVkVGFyZ2V0OiB0YXJnZXR9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRbLi4uU2VsZWN0b3JzLmZpbmRBbGwoJy5hY3RpdmUnLCBzZWxmKV0uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGVsICYmIGVsICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5oaWRlKHtyZWxhdGVkVGFyZ2V0OiBlbH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aW5zdGFuY2Uuc2hvdyh7cmVsYXRlZFRhcmdldDogdGFyZ2V0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHZnTmF2U2lkZWJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlYmFyLW5hdicpO1xyXG5cdFx0bGV0IGhhbWJ1cmdlciA9IGluc3RhbmNlLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaW5zdGFuY2UuX3BhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlcik7XHJcblxyXG5cdFx0aWYgKHZnTmF2U2lkZWJhciAmJiBoYW1idXJnZXIpIHtcclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuc2hvdycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LmFkZChpbnN0YW5jZS5wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZnTmF2U2lkZWJhci5hZGRFdmVudExpc3RlbmVyKCd2Zy5zaWRlYmFyLmhpZGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoaW5zdGFuY2UucGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyQWN0aXZlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR05hdi5oaWRlT3BlbkRyb3BzKGV2ZW50KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuRHJvcHMoZXZlbnQpIHtcclxuXHRcdGNvbnN0IG9wZW5Ub2dnbGVzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bjpub3QoLmRpc2FibGVkKTpub3QoOmRpc2FibGVkKS5hY3RpdmUnKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IHRvZ2dsZSBvZiBvcGVuVG9nZ2xlcykge1xyXG5cdFx0XHRjb25zdCBjb250ZXh0ID0gVkdOYXYuZ2V0SW5zdGFuY2UodG9nZ2xlLmNsb3Nlc3QoJy52Zy1uYXYnKSk7XHJcblx0XHRcdGlmICghY29udGV4dCkgY29udGludWU7XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5maXJzdCcpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0b2dnbGUgfVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb250ZXh0LmhpZGUocmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbkV2ZW50SGFuZGxlci5vbih3aW5kb3csIEVWRU5UX1JFU0laRV9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR05hdi5nZXRPckNyZWF0ZUluc3RhbmNlKCcudmctbmF2Jywge30pO1xyXG5cdGluc3RhbmNlLmJ1aWxkKCk7XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR05hdjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnc2lkZWJhcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnNpZGViYXInO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHU2lkZWJhciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRcdFx0b3ZlcmZsb3c6IHRydWUsXHJcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oU2VsZWN0b3JzLmZpbmQoJy52Zy1iYWNrZHJvcCcpLCAnbW91c2Vkb3duLnZnLmJhY2tkcm9wJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlKTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTLCBldmVudCA9PiB7XHJcblx0XHRcdGlmIChldmVudC5rZXkgIT09ICdFc2NhcGUnKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHU2lkZWJhcik7XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdGlmIChpc1Zpc2libGUodGhpcykpIHRoaXMuZm9jdXMoKTtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1zaWRlYmFyLnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWR1NpZGViYXIuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHU2lkZWJhci5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR1NpZGViYXI7XHJcbiIsImltcG9ydCB7ZXhlY3V0ZX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4vb3ZlcmZsb3dcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSAnYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUUgPSAndmctYmFja2Ryb3AnXHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xyXG5jb25zdCBFVkVOVF9NT1VTRURPV04gPSBgbW91c2Vkb3duLnZnLiR7TkFNRX1gXHJcblxyXG5jbGFzcyBCYWNrZHJvcCB7XHJcblx0c3RhdGljIHNob3coY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9hcHBlbmQoKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZShjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2Rlc3Ryb3koKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9hcHBlbmQoKSB7XHJcblx0XHRpZiAoU2VsZWN0b3JzLmZpbmQoJy4nICsgQ0xBU1NfTkFNRSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChiYWNrZHJvcCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdFx0fSwgNTApO1xyXG5cclxuXHRcdEV2ZW50SGFuZGxlci5vbihiYWNrZHJvcCwgRVZFTlRfTU9VU0VET1dOLCAoKSA9PiB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoKVxyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfZGVzdHJveSgpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgQ0xBU1NfTkFNRSk7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdH0sIDUwMCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWNrZHJvcDsiLCJpbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vZG9tL21hbmlwdWxhdG9yXCI7XHJcblxyXG4vKipcclxuICog0JrQu9Cw0YHRgSBPdmVyZmxvd1xyXG4gKiDQl9Cw0L/RgNC10YnQsNC10YIg0YHQutGA0L7Qu9C70LjQvdCzINC4INGD0LHQuNGA0LDQtdGCINC10LPQviwg0LrQvtC80L/QtdC90YHQuNGA0YPRjyDQvtGC0YHRgtGD0L/QvtC8XHJcbiAqL1xyXG5cclxuY2xhc3MgT3ZlcmZsb3cge1xyXG5cdHN0YXRpYyBhcHBlbmQoKSB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGdldFdpZHRoKCkgKyAncHgnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdldFdpZHRoKCkge1xyXG5cdFx0XHRjb25zdCBkb2N1bWVudFdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcblx0XHRcdHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50V2lkdGgpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZGVzdHJveSgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJyc7XHJcblxyXG5cdFx0bGV0IHN0eWxlcyA9IE1hbmlwdWxhdG9yLmdldChkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHRcdGlmICghc3R5bGVzKSBNYW5pcHVsYXRvci5yZW1vdmUoZG9jdW1lbnQuYm9keSwgJ3N0eWxlJyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPdmVyZmxvdzsiLCJpbXBvcnQge2lzRWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIFBhcmFtcyB7XHJcblx0Y29uc3RydWN0b3IocGFyYW1zLCBlbGVtZW50ID0gbnVsbCkge1xyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5tZXJnZShwYXJhbXMsIGVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0Z2V0KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcmFtcztcclxuXHR9XHJcblxyXG5cdGZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBpc0VsZW1lbnQoZWxlbWVudCkgPyBNYW5pcHVsYXRvci5nZXQoZWxlbWVudCkgOiB7fTtcclxuXHR9XHJcblxyXG5cdG1lcmdlKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0bGV0IG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QocGFyYW1zLCB0aGlzLmZyb21FbGVtZW50KGVsZW1lbnQpKTtcclxuXHJcblx0XHRmb3IgKGxldCBrZXkgaW4gbVBhcmFtcykge1xyXG5cdFx0XHRpZiAoa2V5LmluZGV4T2YoJy0nKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRsZXQga2V5cyA9IGtleS5zcGxpdCgnLScpLFxyXG5cdFx0XHRcdFx0dmFsdWUgPSBub3JtYWxpemVEYXRhKG1QYXJhbXNba2V5XSk7XHJcblxyXG5cdFx0XHRcdGlmIChrZXlzWzBdIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0XHRcdGlmIChrZXlzWzFdIGluIG1QYXJhbXNba2V5c1swXV0pIHtcclxuXHRcdFx0XHRcdFx0bVBhcmFtc1trZXlzWzBdXVtrZXlzWzFdXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgncGFyYW1zJyBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QobVBhcmFtcywgbVBhcmFtcy5wYXJhbXMpO1xyXG5cdFx0XHRkZWxldGUgbVBhcmFtcy5wYXJhbXM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG1QYXJhbXM7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYXJhbXM7IiwiaW1wb3J0IHttZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIFBsYWNlbWVudCwg0L7Qv9GA0LXQtNC10LvRj9C10YIg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LzQtdGB0YLQvtC/0L7Qu9C+0LbQtdC90LjQtSDRjdC70LXQvNC10L3RgtCwINC90LAg0YHRgtGA0LDQvdC40YbQtS5cclxuICogVE9ETyDQutC70LDRgdGBINC90LUg0LTQvtC/0LjRgdCw0L1cclxuICovXHJcblxyXG5jbGFzcyBQbGFjZW1lbnQge1xyXG5cdGNvbnN0cnVjdG9yKGFyZyA9IHt9KSB7XHJcblx0XHR0aGlzLnBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGVsZW1lbnQ6IG51bGwsXHJcblx0XHRcdGRyb3A6IG51bGxcclxuXHRcdH0sIGFyZyk7XHJcblx0fVxyXG5cclxuXHRfZ2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Y29uc3QgX3BhcmVudCA9IChzZWxmKSA9PiB7XHJcblx0XHRcdGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudE5vZGUsXHJcblx0XHRcdFx0b3ZlcmZsb3cgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCkub3ZlcmZsb3c7XHJcblxyXG5cdFx0XHRpZiAocGFyZW50LnRhZ05hbWUgIT09ICdCT0RZJykge1xyXG5cdFx0XHRcdGlmIChvdmVyZmxvdyA9PT0gJ3Zpc2libGUnKSB7XHJcblx0XHRcdFx0XHRfcGFyZW50KHBhcmVudClcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXNGaXhlZCA9IGZhbHNlLCB0b3AsIGxlZnQsXHJcblx0XHRcdGJvdW5kcyA9IF90aGlzLnBhcmFtcy5kcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRwYXJlbnQgPSBfdGhpcy5wYXJhbXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRpZiAoX3BhcmVudChfdGhpcy5wYXJhbXMuZWxlbWVudCkpIHtcclxuXHRcdFx0aXNGaXhlZCA9IHRydWU7XHJcblx0XHRcdHRvcCA9IGJvdW5kcy50b3A7XHJcblx0XHRcdGxlZnQgPSBib3VuZHMubGVmdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKF90aGlzLnBhcmFtcy5kcm9wKTtcclxuXHRcdFx0dG9wID0gbm9ybWFsaXplRGF0YShzdHlsZXMudG9wLnNsaWNlKDAsIC0yKSk7XHJcblx0XHRcdGxlZnQgPSBub3JtYWxpemVEYXRhKHN0eWxlcy5sZWZ0LnNsaWNlKDAsIC0yKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKChib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCkgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHRsZWZ0ID0gcGFyZW50LndpZHRoIC0gYm91bmRzLndpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlzRml4ZWQ6IGlzRml4ZWQsXHJcblx0XHRcdHRvcDogdG9wLFxyXG5cdFx0XHRsZWZ0OiBsZWZ0XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGFjZW1lbnQ7IiwiLyoqXHJcbiAqINCa0LvQsNGB0YEgUmVzcG9uc2l2ZSwg0YDQsNCx0L7RgtCw0LXRgiDQv9C+INGC0LDQutC40Lwg0LbQtSDQvNC10LTQuNCwINGC0L7Rh9C60LDQvCwg0YfRgtC+INC4IGJvb3RzdHJhcFxyXG4gKiDQuCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC5cclxuICovXHJcblxyXG5jbGFzcyBSZXNwb25zaXZlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYnJlYWtwb2ludHMgPSB7XHJcblx0XHRcdHhzOiAwLFxyXG5cdFx0XHRzbTogNTc2LFxyXG5cdFx0XHRtZDogNzY4LFxyXG5cdFx0XHRsZzogOTkyLFxyXG5cdFx0XHR4bDogMTIwMCxcclxuXHRcdFx0eHhsOiAxNDAwLFxyXG5cdFx0XHR4eHhsOiAxNjAwLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCV0YHQu9C4INC90LDRiNCwINGI0LjRgNC40L3QsCDRjdC60YDQsNC90LAg0YHQvtCy0L/QsNC00LDQtdGCINGBINC00LjQsNC/0LDQt9C+0L3QvtC8INC60L7RgtC+0YDRi9C5INGD0LrQsNC30LDQvSDQsiDQvNC+0LTRg9C70LUg0LLRi9C00LDQtdC8IHRydWUsINC40L3QsNGH0LUgZmFsc2VcclxuXHQgKiBAcGFyYW0gbW9kdWxlXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrKG1vZHVsZSkge1xyXG5cdFx0bGV0IGluc3RhbmNlID0gbmV3IHRoaXMgO1xyXG5cdFx0cmV0dXJuIGluc3RhbmNlLmRlZmluZShtb2R1bGUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0LLQtdGA0Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLiBUT0RPINC90LUg0YHQvtCy0YHQtdC8INC/0YDQsNCy0LjQu9GM0L3Qviwg0L3QsNC00L4g0YHQtNC10LvQsNGC0Ywg0L/Qvi3QtNGA0YPQs9C+0LzRg1xyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVja01vYmlsZU9yVGFibGV0KCkge1xyXG5cdFx0bGV0IGNoZWNrID0gZmFsc2U7XHJcblx0XHQoZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWlub3xhbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zbGljZSgwLDQpKSl7XHJcblx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmEpO1xyXG5cclxuXHRcdHJldHVybiBjaGVjaztcclxuXHR9XHJcblxyXG5cdGRlZmluZShtb2R1bGUpIHtcclxuXHRcdGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG5cdFx0XHRyZXNwb25zaXZlX3NpemUgPSB0aGlzLl9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpLFxyXG5cdFx0XHRicmVha3BvaW50cyA9IHRoaXMuYnJlYWtwb2ludHMsXHJcblx0XHRcdHBvaW50ID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLmZpbmQoa2V5ID0+IGJyZWFrcG9pbnRzW2tleV0gPT09IHJlc3BvbnNpdmVfc2l6ZSk7XHJcblxyXG5cdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cyksXHJcblx0XHRcdGxvYyA9IGtleXMuaW5kZXhPZihwb2ludCk7XHJcblxyXG5cdFx0cmV0dXJuIHdpbmRvd1dpZHRoID49IGJyZWFrcG9pbnRzW2tleXNbbG9jICsgMV1dO1xyXG5cdH1cclxuXHJcblx0X2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBtb2R1bGUuX2VsZW1lbnQsXHJcblx0XHRcdHBhcmFtcyA9IG1vZHVsZS5fcGFyYW1zLFxyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IDA7XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhYWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54eHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54eGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLkxHKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMubGc7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLk1EKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMubWQ7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlNNKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMuc207XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhTKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlOyIsIi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBCb290c3RyYXAgZGF0YS5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICog0KHQutGA0LjQv9GCINGA0LDQsdC+0YLQsNC10YIg0YEg0LrQvtC70LvQtdC60YbQuNC10Lkg0LzQvtC00YPQu9C10LkuINCf0L7QtNGA0L7QsdC90LXQtSDRgtGD0YIgaHR0cHM6Ly9sZWFybi5qYXZhc2NyaXB0LnJ1L21hcC1zZXRcclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YHRgtCw0L3RgtGLXHJcbiAqL1xyXG5cclxuY29uc3QgZWxlbWVudE1hcCA9IG5ldyBNYXAoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG5cdHNldChlbGVtZW50LCBrZXksIGluc3RhbmNlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XHJcblx0XHRcdGVsZW1lbnRNYXAuc2V0KGVsZW1lbnQsIG5ldyBNYXAoKSlcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblx0XHRpZiAoIWluc3RhbmNlTWFwLmhhcyhrZXkpICYmIGluc3RhbmNlTWFwLnNpemUgIT09IDApIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihgVkdBcHAg0L3QtSDQtNC+0L/Rg9GB0LrQsNC10YIg0LHQvtC70LXQtSDQvtC00L3QvtCz0L4g0Y3QutC30LXQvNC/0LvRj9GA0LAg0LTQu9GPINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LAuINCh0LLRj9C30LDQvdC90YvQuSDRjdC60LfQtdC80L/Qu9GP0YA6ICR7QXJyYXkuZnJvbShpbnN0YW5jZU1hcC5rZXlzKCkpWzBdfS5gKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpbnN0YW5jZU1hcC5zZXQoa2V5LCBpbnN0YW5jZSlcclxuXHR9LFxyXG5cclxuXHRnZXQoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpLmdldChrZXkpIHx8IG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH0sXHJcblxyXG5cdHJlbW92ZShlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLmRlbGV0ZShrZXkpO1xyXG5cclxuXHRcdGlmIChpbnN0YW5jZU1hcC5zaXplID09PSAwKSB7XHJcblx0XHRcdGVsZW1lbnRNYXAuZGVsZXRlKGVsZW1lbnQpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBCb290c3RyYXAgZXZlbnQuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDQtNC70Y8g0L/RgNC+0YHQu9GD0YjQuNCy0LDQvdC40Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YHRgtCw0L3RgtGLXHJcbiAqL1xyXG5cclxuY29uc3QgbmFtZXNwYWNlUmVnZXggPSAvW14uXSooPz1cXC4uKilcXC58LiovXHJcbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xyXG5jb25zdCBzdHJpcFVpZFJlZ2V4ID0gLzo6XFxkKyQvXHJcbmNvbnN0IGV2ZW50UmVnaXN0cnkgPSB7fSAvLyBFdmVudHMgc3RvcmFnZVxyXG5sZXQgdWlkRXZlbnQgPSAxXHJcbmNvbnN0IGN1c3RvbUV2ZW50cyA9IHtcclxuXHRtb3VzZWVudGVyOiAnbW91c2VvdmVyJyxcclxuXHRtb3VzZWxlYXZlOiAnbW91c2VvdXQnXHJcbn1cclxuXHJcbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xyXG5cdCdjbGljaycsXHJcblx0J2RibGNsaWNrJyxcclxuXHQnbW91c2V1cCcsXHJcblx0J21vdXNlZG93bicsXHJcblx0J2NvbnRleHRtZW51JyxcclxuXHQnbW91c2V3aGVlbCcsXHJcblx0J0RPTU1vdXNlU2Nyb2xsJyxcclxuXHQnbW91c2VvdmVyJyxcclxuXHQnbW91c2VvdXQnLFxyXG5cdCdtb3VzZW1vdmUnLFxyXG5cdCdzZWxlY3RzdGFydCcsXHJcblx0J3NlbGVjdGVuZCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2tleWRvd24nLFxyXG5cdCdrZXlwcmVzcycsXHJcblx0J2tleXVwJyxcclxuXHQnb3JpZW50YXRpb25jaGFuZ2UnLFxyXG5cdCd0b3VjaHN0YXJ0JyxcclxuXHQndG91Y2htb3ZlJyxcclxuXHQndG91Y2hlbmQnLFxyXG5cdCd0b3VjaGNhbmNlbCcsXHJcblx0J3BvaW50ZXJkb3duJyxcclxuXHQncG9pbnRlcm1vdmUnLFxyXG5cdCdwb2ludGVydXAnLFxyXG5cdCdwb2ludGVybGVhdmUnLFxyXG5cdCdwb2ludGVyY2FuY2VsJyxcclxuXHQnZ2VzdHVyZXN0YXJ0JyxcclxuXHQnZ2VzdHVyZWNoYW5nZScsXHJcblx0J2dlc3R1cmVlbmQnLFxyXG5cdCdmb2N1cycsXHJcblx0J2JsdXInLFxyXG5cdCdjaGFuZ2UnLFxyXG5cdCdyZXNldCcsXHJcblx0J3NlbGVjdCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2ZvY3VzaW4nLFxyXG5cdCdmb2N1c291dCcsXHJcblx0J2xvYWQnLFxyXG5cdCd1bmxvYWQnLFxyXG5cdCdiZWZvcmV1bmxvYWQnLFxyXG5cdCdyZXNpemUnLFxyXG5cdCdtb3ZlJyxcclxuXHQnRE9NQ29udGVudExvYWRlZCcsXHJcblx0J3JlYWR5c3RhdGVjaGFuZ2UnLFxyXG5cdCdlcnJvcicsXHJcblx0J2Fib3J0JyxcclxuXHQnc2Nyb2xsJ1xyXG5dKVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0LDRgtC90YvQtSDQvNC10YLQvtC00YtcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYWtlRXZlbnRVaWQoZWxlbWVudCwgdWlkKSB7XHJcblx0cmV0dXJuICh1aWQgJiYgYCR7dWlkfTo6JHt1aWRFdmVudCsrfWApIHx8IGVsZW1lbnQudWlkRXZlbnQgfHwgdWlkRXZlbnQrK1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpIHtcclxuXHRjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoZWxlbWVudClcclxuXHJcblx0ZWxlbWVudC51aWRFdmVudCA9IHVpZFxyXG5cdGV2ZW50UmVnaXN0cnlbdWlkXSA9IGV2ZW50UmVnaXN0cnlbdWlkXSB8fCB7fVxyXG5cclxuXHRyZXR1cm4gZXZlbnRSZWdpc3RyeVt1aWRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogZWxlbWVudCB9KVxyXG5cclxuXHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIGZuKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmbi5hcHBseShlbGVtZW50LCBbZXZlbnRdKVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgc2VsZWN0b3IsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGRvbUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxyXG5cclxuXHRcdGZvciAobGV0IHsgdGFyZ2V0IH0gPSBldmVudDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpczsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBkb21FbGVtZW50IG9mIGRvbUVsZW1lbnRzKSB7XHJcblx0XHRcdFx0aWYgKGRvbUVsZW1lbnQgIT09IHRhcmdldCkge1xyXG5cdFx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IHRhcmdldCB9KVxyXG5cclxuXHRcdFx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgc2VsZWN0b3IsIGZuKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGZuLmFwcGx5KHRhcmdldCwgW2V2ZW50XSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmluZEhhbmRsZXIoZXZlbnRzLCBjYWxsYWJsZSwgZGVsZWdhdGlvblNlbGVjdG9yID0gbnVsbCkge1xyXG5cdHJldHVybiBPYmplY3QudmFsdWVzKGV2ZW50cylcclxuXHRcdC5maW5kKGV2ZW50ID0+IGV2ZW50LmNhbGxhYmxlID09PSBjYWxsYWJsZSAmJiBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IgPT09IGRlbGVnYXRpb25TZWxlY3RvcilcclxufVxyXG5cclxuZnVuY3Rpb24gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0Y29uc3QgaXNEZWxlZ2F0ZWQgPSB0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZydcclxuXHQvLyBUT0RPOiDQstGL0LTQsNC10YIgXCJmYWxzZVwiINCy0LzQtdGB0YLQviDRgdC10LvQtdC60YLQvtGA0LAsINC/0L7RjdGC0L7QvNGDINC90YPQttC90L4g0L/RgNC+0LLQtdGA0LjRgtGMLiBib290XHJcblx0Y29uc3QgY2FsbGFibGUgPSBpc0RlbGVnYXRlZCA/IGRlbGVnYXRpb25GdW5jdGlvbiA6IChoYW5kbGVyIHx8IGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHRsZXQgdHlwZUV2ZW50ID0gZ2V0VHlwZUV2ZW50KG9yaWdpbmFsVHlwZUV2ZW50KVxyXG5cclxuXHRpZiAoIW5hdGl2ZUV2ZW50cy5oYXModHlwZUV2ZW50KSkge1xyXG5cdFx0dHlwZUV2ZW50ID0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHR9XHJcblxyXG5cdHJldHVybiBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhhbmRsZXIoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgb25lT2ZmKSB7XHJcblx0aWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0bGV0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblxyXG5cdC8vIGluIGNhc2Ugb2YgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlIHdyYXAgdGhlIGhhbmRsZXIgd2l0aGluIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgZm9yIGl0cyBET00gcG9zaXRpb25cclxuXHQvLyB0aGlzIHByZXZlbnRzIHRoZSBoYW5kbGVyIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0aGUgc2FtZSB3YXkgYXMgbW91c2VvdmVyIG9yIG1vdXNlb3V0IGRvZXNcclxuXHRpZiAob3JpZ2luYWxUeXBlRXZlbnQgaW4gY3VzdG9tRXZlbnRzKSB7XHJcblx0XHRjb25zdCB3cmFwRnVuY3Rpb24gPSBmbiA9PiB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgKGV2ZW50LnJlbGF0ZWRUYXJnZXQgIT09IGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmICFldmVudC5kZWxlZ2F0ZVRhcmdldC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxhYmxlID0gd3JhcEZ1bmN0aW9uKGNhbGxhYmxlKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxyXG5cdGNvbnN0IGhhbmRsZXJzID0gZXZlbnRzW3R5cGVFdmVudF0gfHwgKGV2ZW50c1t0eXBlRXZlbnRdID0ge30pXHJcblx0Y29uc3QgcHJldmlvdXNGdW5jdGlvbiA9IGZpbmRIYW5kbGVyKGhhbmRsZXJzLCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHJcblx0aWYgKHByZXZpb3VzRnVuY3Rpb24pIHtcclxuXHRcdHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmID0gcHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgJiYgb25lT2ZmXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCB1aWQgPSBtYWtlRXZlbnRVaWQoY2FsbGFibGUsIG9yaWdpbmFsVHlwZUV2ZW50LnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSlcclxuXHRjb25zdCBmbiA9IGlzRGVsZWdhdGVkID9cclxuXHRcdGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIGNhbGxhYmxlKSA6XHJcblx0XHRib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGNhbGxhYmxlKVxyXG5cclxuXHRmbi5kZWxlZ2F0aW9uU2VsZWN0b3IgPSBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsXHJcblx0Zm4uY2FsbGFibGUgPSBjYWxsYWJsZVxyXG5cdGZuLm9uZU9mZiA9IG9uZU9mZlxyXG5cdGZuLnVpZEV2ZW50ID0gdWlkXHJcblx0aGFuZGxlcnNbdWlkXSA9IGZuXHJcblxyXG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBpc0RlbGVnYXRlZClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKSB7XHJcblx0Y29uc3QgZm4gPSBmaW5kSGFuZGxlcihldmVudHNbdHlwZUV2ZW50XSwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cclxuXHRpZiAoIWZuKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBCb29sZWFuKGRlbGVnYXRpb25TZWxlY3RvcikpXHJcblx0ZGVsZXRlIGV2ZW50c1t0eXBlRXZlbnRdW2ZuLnVpZEV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIG5hbWVzcGFjZSkge1xyXG5cdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHJcblx0Zm9yIChjb25zdCBbaGFuZGxlcktleSwgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xyXG5cdFx0aWYgKGhhbmRsZXJLZXkuaW5jbHVkZXMobmFtZXNwYWNlKSkge1xyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHlwZUV2ZW50KGV2ZW50KSB7XHJcblx0Ly8gYWxsb3cgdG8gZ2V0IHRoZSBuYXRpdmUgZXZlbnRzIGZyb20gbmFtZXNwYWNlZCBldmVudHMgKCdjbGljay5icy5idXR0b24nIC0tPiAnY2xpY2snKVxyXG5cdGV2ZW50ID0gZXZlbnQucmVwbGFjZShzdHJpcE5hbWVSZWdleCwgJycpXHJcblx0cmV0dXJuIGN1c3RvbUV2ZW50c1tldmVudF0gfHwgZXZlbnRcclxufVxyXG5cclxuZnVuY3Rpb24gaHlkcmF0ZU9iaihvYmosIG1ldGEgPSB7fSkge1xyXG5cdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1ldGEpKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRvYmpba2V5XSA9IHZhbHVlXHJcblx0XHR9IGNhdGNoIHtcclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGdldCgpIHtcclxuXHRcdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBvYmpcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNGPXHJcbiAqIEB0eXBlIHt7b25lKCosICosICosICopOiB2b2lkLCB0cmlnZ2VyKCosICosICopOiAobnVsbHwqKSwgb2ZmKCosICosICosICopOiB2b2lkLCBvbigqLCAqLCAqLCAqKTogdm9pZH19XHJcbiAqL1xyXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XHJcblx0LyoqXHJcblx0ICog0J/RgNC+0YHQu9GD0YjQuNCy0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjQuSAo0Y3Qu9C10LzQtdC90YIsINGB0L7QsdGL0YLQuNC1ICjQv9C+0LvQvdGL0Lkg0YHQv9C40YHQvtC6INGB0LzQvtGC0YDQuCDQsiDQutC+0L3RgdGC0LDQvdGC0LUgbmF0aXZlRXZlbnRzLCDQuNGB0YLQvtGH0L3QuNC6INGB0L7QsdGL0YLQuNGPINC40LvQuCDRhdC10L3QtNC70LXRgCwg0YTRg9C90LrRhtC40Y8g0L7QsdGA0LDRgtC90L7Qs9C+INCy0YvQt9C+0LLQsCkpXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvbihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIGZhbHNlKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtGB0LvRg9GI0LjQstCw0YLQtdC70Ywg0YHQvtCx0YvRgtC40LksINC90L4g0LfQsNC80YvQutCw0LXRgtGB0Y8g0Lgg0LHQvtC70YzRiNC1INC90LUg0L/QvtCy0YLQvtGA0Y/QtdGC0YHRjyDQvdCwINGN0LvQtdC80LXQvdGC0LVcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIHRydWUpXHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0KPQtNCw0LvQtdC90LjQtSDQvtCx0YDQsNCx0L7RgtGH0LjQutCwXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvZmYoZWxlbWVudCwgb3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHRcdGNvbnN0IGluTmFtZXNwYWNlID0gdHlwZUV2ZW50ICE9PSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdFx0Y29uc3QgZXZlbnRzID0gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KVxyXG5cdFx0Y29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxyXG5cdFx0Y29uc3QgaXNOYW1lc3BhY2UgPSBvcmlnaW5hbFR5cGVFdmVudC5zdGFydHNXaXRoKCcuJylcclxuXHJcblx0XHRpZiAodHlwZW9mIGNhbGxhYmxlICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHQvLyBTaW1wbGVzdCBjYXNlOiBoYW5kbGVyIGlzIHBhc3NlZCwgcmVtb3ZlIHRoYXQgbGlzdGVuZXIgT05MWS5cclxuXHRcdFx0aWYgKCFPYmplY3Qua2V5cyhzdG9yZUVsZW1lbnRFdmVudCkubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNOYW1lc3BhY2UpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50RXZlbnQgb2YgT2JqZWN0LmtleXMoZXZlbnRzKSkge1xyXG5cdFx0XHRcdHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIGVsZW1lbnRFdmVudCwgb3JpZ2luYWxUeXBlRXZlbnQuc2xpY2UoMSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IFtrZXlIYW5kbGVycywgZXZlbnRdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlRWxlbWVudEV2ZW50KSkge1xyXG5cdFx0XHRjb25zdCBoYW5kbGVyS2V5ID0ga2V5SGFuZGxlcnMucmVwbGFjZShzdHJpcFVpZFJlZ2V4LCAnJylcclxuXHJcblx0XHRcdGlmICghaW5OYW1lc3BhY2UgfHwgb3JpZ2luYWxUeXBlRXZlbnQuaW5jbHVkZXMoaGFuZGxlcktleSkpIHtcclxuXHRcdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBldmVudC5jYWxsYWJsZSwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0YHQvtCx0YvRgtC40Y8uINCf0L7QtNGA0L7QsdC90LXQtSDRgtGD0YIgaHR0cHM6Ly9sZWFybi5qYXZhc2NyaXB0LnJ1L2Rpc3BhdGNoLWV2ZW50c1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGFyZ3NcclxuXHQgKiBAcmV0dXJucyB7KnxudWxsfVxyXG5cdCAqL1xyXG5cdHRyaWdnZXIoZWxlbWVudCwgZXZlbnQsIGFyZ3MpIHtcclxuXHRcdGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGJ1YmJsZXMgPSB0cnVlO1xyXG5cdFx0bGV0IG5hdGl2ZURpc3BhdGNoID0gdHJ1ZTtcclxuXHRcdGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3QgZXZ0ID0gaHlkcmF0ZU9iaihuZXcgRXZlbnQoZXZlbnQsIHsgYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSB9KSwgYXJncylcclxuXHJcblx0XHRpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuYXRpdmVEaXNwYXRjaCkge1xyXG5cdFx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBldnRcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlclxyXG4iLCJpbXBvcnQge2lzRWxlbWVudCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5cclxuLyoqXHJcbiAqINCc0LDQvdC40L/Rg9C70Y/RhtC40Lgg0YEg0LDRgtGA0LjQsdGD0YLQsNC80Lgg0YMg0Y3Qu9C10LzQtdC90YLQsDpcclxuICogZ2V0ICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPLCDRhNC70LDQsyAtINCy0YvRgNC10LfQsNGC0YwgZGF0YS0pIC0g0LzQtdGC0L7QtCDQstGL0LHQuNGA0LDQtdGCINC30L3QsNGH0LXQvdC40LUg0LDRgtGA0LjQsdGD0YLQsCDQv9C+INC10LPQviDQuNC80LXQvdC4LCDQtdGB0LvQuCDQsiDQv9C+0LvQtSDQuNC80LXQvdC4INC/0LXRgNC10LTQsNGC0YwgJ2RhdGEnIC0+INCx0YPQtNGD0YIg0LLRi9Cx0YDQsNC90Ysg0YLQvtC70YzQutC+INC00LDRgtCwINCw0YLRgNC40LHRg9GC0YssINC10YHQu9C4ICdhbGwnIC0+INC80LXRgtC+0LQg0LLQtdGA0L3QtdGCINC30L3QsNGH0LXQvdC40LUg0LLRgdC10YUg0LDRgtGA0LjQsdGD0YLQvtCyXHJcbiAqIGhhcyAo0Y3Qu9C10LzQtdC90YIsINC40LzRjykgLSDQtdGB0YLRjCDQu9C4INCw0YLRgNC40LHRg9GCINGDINGN0LvQtdC80LXQvdGC0LBcclxuICogc2V0ICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPLCDQt9C90LDRh9C10L3QuNC1KSAtINGD0YHRgtCw0L3QvtCy0LrQsCDRgyDRjdC70LXQvNC10L3RgtCwINCw0YLRgNC40LHRg9GC0LAg0LjQu9C4INC10LPQviDQuNC30LzQtdC90LXQvdC40LVcclxuICogcmVtb3ZlICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPKSAtINGD0LTQsNC70Y/QtdGCINCw0YLRgNC40LHRg9GCINGDINGN0LvQtdC80LXQvdGC0LBcclxuICovXHJcbmNvbnN0IE1hbmlwdWxhdG9yID0ge1xyXG5cdGdldChlbGVtZW50LCBuYW1lQXR0cmlidXRlID0gJ2RhdGEnLCBpc1JlbW92ZURhdGFOYW1lID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuYW1lQXR0cmlidXRlID09PSAnZGF0YScpIHtcclxuXHRcdFx0bGV0IGVsbUJhc2UgPSBbJ2RhdGEtdmctdG9nZ2xlJywgJ2RhdGEtdmctdGFyZ2V0JywgJ2RhdGEtdmctZGlzbWlzcyddLFxyXG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSB7fTtcclxuXHJcblx0XHRcdGxldCBhcnIgPSBbXS5maWx0ZXIuY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhdCkge1xyXG5cdFx0XHRcdHJldHVybiAvXmRhdGEtLy50ZXN0KGF0Lm5hbWUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGlmIChhcnIubGVuZ3RoKSB7XHJcblx0XHRcdFx0YXJyLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuXHRcdFx0XHRcdGxldCBuYW1lID0gdi5uYW1lO1xyXG5cclxuXHRcdFx0XHRcdGlmICghZWxtQmFzZS5pbmNsdWRlcyhuYW1lKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaXNSZW1vdmVEYXRhTmFtZSkgbmFtZSA9IG5hbWUuc2xpY2UoNSk7XHJcblx0XHRcdFx0XHRcdGF0dHJpYnV0ZXNbbmFtZV0gPSBub3JtYWxpemVEYXRhKHYudmFsdWUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhdHRyaWJ1dGVzO1xyXG5cdFx0fSBlbHNlIGlmIChuYW1lQXR0cmlidXRlID09PSAnYWxsJykge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGVOYW1lcygpLnJlZHVjZSgoYWNjLCBuYW1lKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIHsuLi5hY2MsIFtuYW1lXTogZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZSl9O1xyXG5cdFx0XHR9LCB7fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0aGFzKGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHR9LFxyXG5cclxuXHRzZXQoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcclxuXHRcdGlmIChpc0VsZW1lbnQoZWxlbWVudCkgJiYgbmFtZSkge1xyXG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVtb3ZlKGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdGlmIChpc0VsZW1lbnQoZWxlbWVudCkgJiYgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuaXB1bGF0b3J9XHJcbiIsIi8qKlxyXG4gKiDQoNCw0LHQvtGC0LAg0YEgRE9NXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmltcG9ydCB7aXNFbGVtZW50fSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG5jb25zdCBwYXJzZVNlbGVjdG9yID0gc2VsZWN0b3IgPT4ge1xyXG5cdGlmIChzZWxlY3RvciAmJiB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1MuZXNjYXBlKSB7XHJcblx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyMoW15cXHNcIiMnXSspL2csIChtYXRjaCwgaWQpID0+IGAjJHtDU1MuZXNjYXBlKGlkKX1gKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcbn1cclxuXHJcbmNvbnN0IGdldFNlbGVjdG9yID0gZWxlbWVudCA9PiB7XHJcblx0bGV0IHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmctdGFyZ2V0Jyk7XHJcblxyXG5cdGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09ICcjJykge1xyXG5cdFx0bGV0IGhyZWZBdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG5cdFx0aWYgKCFocmVmQXR0cmlidXRlIHx8ICghaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJy4nKSkpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcjJykpIHtcclxuXHRcdFx0aHJlZkF0dHJpYnV0ZSA9IGAjJHtocmVmQXR0cmlidXRlLnNwbGl0KCcjJylbMV19YDtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxlY3RvciA9IGhyZWZBdHRyaWJ1dGUgJiYgaHJlZkF0dHJpYnV0ZSAhPT0gJyMnID8gaHJlZkF0dHJpYnV0ZS50cmltKCkgOiBudWxsO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNlbGVjdG9yID8gc2VsZWN0b3Iuc3BsaXQoJywnKS5tYXAoc2VsID0+IHBhcnNlU2VsZWN0b3Ioc2VsKSkuam9pbignLCcpIDogbnVsbDtcclxufVxyXG5cclxuY29uc3QgU2VsZWN0b3JzID0ge1xyXG5cdGZpbmQoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdGlmIChpc0VsZW1lbnQoc2VsZWN0b3IpKSB7XHJcblx0XHRcdHJldHVybiBzZWxlY3RvcjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGZpbmRBbGwoc2VsZWN0b3IsIGNvbnRhaW5lciA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIFtdLmNvbmNhdCguLi5FbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsLmNhbGwoY29udGFpbmVyLCBzZWxlY3RvcikpO1xyXG5cdH0sXHJcblxyXG5cdGdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KTtcclxuXHRcdGlmIChzZWxlY3RvcikgcmV0dXJuIFNlbGVjdG9ycy5maW5kKHNlbGVjdG9yKSA/IHNlbGVjdG9yIDogbnVsbFxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9LFxyXG5cclxuXHRnZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IgPyBTZWxlY3RvcnMuZmluZChzZWxlY3RvcikgOiBudWxsXHJcblx0fSxcclxuXHJcblx0Z2V0TXVsdGlwbGVFbGVtZW50c0Zyb21TZWxlY3RvcihlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIHNlbGVjdG9yID8gU2VsZWN0b3JzLmZpbmRBbGwoc2VsZWN0b3IpIDogW11cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yczsiLCIvKipcclxuICog0J3QsNCx0L7RgCDRgdC60YDQuNC/0YLQvtCyINC00LvRjyDRiNC40YDQvtC60L7Qs9C+INC/0YDQuNC80LXQvdC10L3QuNGPXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCV0YHQu9C4INGH0YLQvi3QvdC40LHRg9C00Ywg0LIg0L7QsdGK0LXQutGC0LVcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRW1wdHlPYmoob2JqKSB7XHJcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcclxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogaXNFbGVtZW50XHJcbiAqIEBwYXJhbSBvYmplY3RcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSBvYmplY3QgPT4ge1xyXG5cdGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHlwZW9mIG9iamVjdC5ub2RlVHlwZSAhPT0gJ3VuZGVmaW5lZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRGlzYWJsZWRcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0Rpc2FibGVkID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50IHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiBlbGVtZW50LmRpc2FibGVkICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuZGlzYWJsZWRcclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSAhPT0gJ2ZhbHNlJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1Zpc2libGUgKGVsZW1lbnQpIHtcclxuXHRpZiAoIWlzRWxlbWVudChlbGVtZW50KSB8fCBlbGVtZW50LmdldENsaWVudFJlY3RzKCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGNvbnN0IGVsZW1lbnRJc1Zpc2libGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3Zpc2liaWxpdHknKSA9PT0gJ3Zpc2libGUnXHJcblx0Y29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXHJcblxyXG5cdGlmICghY2xvc2VkRGV0YWlscykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxuXHR9XHJcblxyXG5cdGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzdW1tYXJ5ID0gZWxlbWVudC5jbG9zZXN0KCdzdW1tYXJ5JylcclxuXHRcdGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkucGFyZW50Tm9kZSAhPT0gY2xvc2VkRGV0YWlscykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc09iamVjdFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcblx0cmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC40LLQvtC00LjQvCDQsiDQv9C+0YDRj9C00L7QuiDRgtC40L/RiyDQtNCw0L3QvdGL0YVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSAge1xyXG5cdGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XHJcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0fSBjYXRjaCB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgtGLINGBINC80LDRgdGB0LjQstCwXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50QXJyYXkoYXJyLCBlbCkge1xyXG5cdHJldHVybiBhcnIuZmlsdGVyKChpdGVtKSA9PiAhZWwuaW5jbHVkZXMoaXRlbSkpO1xyXG59XHJcblxyXG4vKipcclxuICog0JPQu9GD0LHQvtC60L7QtSDQvtCx0YrQtdC00LjQvdC10L3QuNC1INC+0LHRitC10LrRgtC+0LJcclxuICogQHBhcmFtIG9iamVjdHNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZURlZXBPYmplY3QoLi4ub2JqZWN0cykge1xyXG5cdGNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxuXHJcblx0cmV0dXJuIG9iamVjdHMucmVkdWNlKChwcmV2LCBvYmopID0+IHtcclxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG5cdFx0XHRjb25zdCBwVmFsID0gcHJldltrZXldO1xyXG5cdFx0XHRjb25zdCBvVmFsID0gb2JqW2tleV07XHJcblxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwVmFsKSAmJiBBcnJheS5pc0FycmF5KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gcFZhbC5jb25jYXQoLi4ub1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoaXNPYmplY3QocFZhbCkgJiYgaXNPYmplY3Qob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBtZXJnZURlZXBPYmplY3QocFZhbCwgb1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gb1ZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHByZXY7XHJcblx0fSwge30pO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2tcclxuICogQHBhcmFtIHBvc3NpYmxlQ2FsbGJhY2tcclxuICogQHBhcmFtIGFyZ3NcclxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIGV4ZWN1dGUocG9zc2libGVDYWxsYmFjaywgYXJncyA9IFtdLCBkZWZhdWx0VmFsdWUgPSBwb3NzaWJsZUNhbGxiYWNrKSB7XHJcblx0cmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjayguLi5hcmdzKSA6IGRlZmF1bHRWYWx1ZVxyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNpdGlvblxyXG4gKiBAcGFyYW0gY2FsbGJhY2tcclxuICogQHBhcmFtIHRyYW5zaXRpb25FbGVtZW50XHJcbiAqIEBwYXJhbSB3YWl0Rm9yVHJhbnNpdGlvblxyXG4gKi9cclxuY29uc3QgVFJBTlNJVElPTl9FTkQgPSAndHJhbnNpdGlvbmVuZCc7XHJcbmNvbnN0IE1JTExJU0VDT05EU19NVUxUSVBMSUVSID0gMTAwMDtcclxuXHJcbmZ1bmN0aW9uIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gKGNhbGxiYWNrLCB0cmFuc2l0aW9uRWxlbWVudCwgd2FpdEZvclRyYW5zaXRpb24gPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRpZiAoIXdhaXRGb3JUcmFuc2l0aW9uKSB7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XHJcblx0Y29uc3QgZW11bGF0ZWREdXJhdGlvbiA9IHRpbWVPdXRNcyA/IHRpbWVPdXRNcyA6IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRyYW5zaXRpb25FbGVtZW50KSArIGR1cmF0aW9uUGFkZGluZztcclxuXHJcblx0bGV0IGNhbGxlZCA9IGZhbHNlXHJcblxyXG5cdGNvbnN0IGhhbmRsZXIgPSAoeyB0YXJnZXQgfSkgPT4ge1xyXG5cdFx0aWYgKHRhcmdldCAhPT0gdHJhbnNpdGlvbkVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGVkID0gdHJ1ZVxyXG5cdFx0dHJhbnNpdGlvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spXHJcblx0fVxyXG5cclxuXHR0cmFuc2l0aW9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0aWYgKCFjYWxsZWQpIHtcclxuXHRcdFx0dHJpZ2dlclRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkVsZW1lbnQpXHJcblx0XHR9XHJcblx0fSwgZW11bGF0ZWREdXJhdGlvbilcclxufVxyXG5cclxuY29uc3QgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBHZXQgdHJhbnNpdGlvbi1kdXJhdGlvbiBvZiB0aGUgZWxlbWVudFxyXG5cdGxldCB7IHRyYW5zaXRpb25EdXJhdGlvbiwgdHJhbnNpdGlvbkRlbGF5IH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxyXG5cclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbilcclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EZWxheSA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSlcclxuXHJcblx0Ly8gUmV0dXJuIDAgaWYgZWxlbWVudCBvciB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIG5vdCBmb3VuZFxyXG5cdGlmICghZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gJiYgIWZsb2F0VHJhbnNpdGlvbkRlbGF5KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxyXG5cdHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdCgnLCcpWzBdXHJcblx0dHJhbnNpdGlvbkRlbGF5ID0gdHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsJylbMF1cclxuXHJcblx0cmV0dXJuIChOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KSkgKiBNSUxMSVNFQ09ORFNfTVVMVElQTElFUlxyXG59XHJcblxyXG5jb25zdCB0cmlnZ2VyVHJhbnNpdGlvbkVuZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoVFJBTlNJVElPTl9FTkQpKVxyXG59XHJcblxyXG4vKipcclxuICog0KLRgNGO0Log0LTQu9GPINC/0LXRgNC10LfQsNC/0YPRgdC60LAg0LDQvdC40LzQsNGG0LjQuCDRjdC70LXQvNC10L3RgtCwXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybiB2b2lkXHJcbiAqXHJcbiAqIEDRgdC80L7RgtGA0LggaHR0cHM6Ly93d3cuY2hhcmlzdGhlby5pby9ibG9nLzIwMjEvMDIvcmVzdGFydC1hLWNzcy1hbmltYXRpb24td2l0aC1qYXZhc2NyaXB0LyNyZXN0YXJ0aW5nLWEtY3NzLWFuaW1hdGlvblxyXG4gKi9cclxuY29uc3QgcmVmbG93ID0gZWxlbWVudCA9PiB7XHJcblx0ZWxlbWVudC5vZmZzZXRIZWlnaHQgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbi8qKlxyXG4gKiDQk9C10L3QtdGA0LDRhtC40Y8g0YHQu9GD0YfQsNC50L3QvtC5INGB0YLRgNC+0LrQuFxyXG4gKi9cclxuZnVuY3Rpb24gbWFrZVJhbmRvbVN0cmluZyhsZW5ndGggPSA3KSB7XHJcblx0bGV0IHJlc3VsdCA9ICcnO1xyXG5cdGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG5cdGNvbnN0IGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcclxuXHRsZXQgY291bnRlciA9IDA7XHJcblx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcclxuXHRcdHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzTGVuZ3RoKSk7XHJcblx0XHRjb3VudGVyICs9IDE7XHJcblx0fVxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCB7aXNFbGVtZW50LCBpc1Zpc2libGUsIGlzRGlzYWJsZWQsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YSwgZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgcmVmbG93LCBub29wLCBtYWtlUmFuZG9tU3RyaW5nfSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC91dGlscy9zY3NzL2RlZmF1bHQuc2Nzc1wiO1xyXG5cclxuLy8gdmdzaWRlYmFyXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3NcIjtcclxuaW1wb3J0IFZHU2lkZWJhciBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyB2Z2NvbGxhcHNlXHJcbmltcG9ydCBWR0NvbGxhcHNlIGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnY29sbGFwc2UvanMvdmdjb2xsYXBzZVwiO1xyXG5cclxuLy8gbmF2XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzXCI7XHJcbmltcG9ydCBWR05hdiBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z25hdi9qcy92Z25hdlwiO1xyXG5cclxuLy8gZHJvcGRvd25cclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzXCI7XHJcbmltcG9ydCBWR0Ryb3Bkb3duIGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vanMvdmdkcm9wZG93blwiO1xyXG5cclxuLy8gbW9kYWxcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z21vZGFsL3Njc3Mvdmdtb2RhbC5zY3NzXCI7XHJcbmltcG9ydCBWR01vZGFsIGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnbW9kYWwvanMvdmdtb2RhbFwiO1xyXG5cclxuLy8gZm9ybSBzZW5kZXJcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvc2Nzcy92Z2Zvcm1zZW5kZXIuc2Nzc1wiO1xyXG5pbXBvcnQgVkdGb3JtU2VuZGVyIGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9qcy92Z2Zvcm1zZW5kZXJcIjtcclxuXHJcbmV4cG9ydCB7XHJcblx0VkdTaWRlYmFyLCBWR0NvbGxhcHNlLCBWR05hdiwgVkdEcm9wZG93biwgVkdNb2RhbCwgVkdGb3JtU2VuZGVyXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9