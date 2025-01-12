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
    if ($modal) $modal.remove();
    let id = _this._params.classes.general + '-' + (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.makeRandomString)();
    _vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_3__["default"].init(id, {
      classes: {
        alert: _this._params.classes.alertModal
      }
    }, function (self) {
      let element = self._element;
      element.classList.add(_this._params.classes.alertModal);
      let $body = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.vg-modal-body', element);
      if ($body) $body.append(_this.setDataRelationStatus(element, status, data, 'modal'));
      self.toggle();
    });
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
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");









/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';
const CLASS_NAME_SHOW = 'show';
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
      },
      animation: {
        name: 'animate__backInUp',
        duration: '1s',
        delay: '1s',
        repeat: 1
      },
      classes: {
        general: 'vg-modal',
        dialog: 'vg-modal-dialog',
        content: 'vg-modal-content',
        header: 'vg-modal-header',
        title: 'vg-modal-title',
        body: 'vg-modal-body',
        footer: 'vg-modal-footer',
        animated: 'animate__animated'
      }
    }, params));
    this._addEventListeners();
    this._dismissElement();
    this._dismissElement();
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  static init(element, params, callback) {
    VGModal.build(element, params, callback);
  }
  static build(id, params, callback) {
    if (typeof id !== "string") return;
    let _element = document.createElement('div');
    _element.classList.add('vg-modal');
    _element.id = id;
    let dialog = document.createElement('div');
    dialog.classList.add('vg-modal-dialog', 'vg-modal-dialog-centered');
    let content = document.createElement('div');
    content.classList.add('vg-modal-content');
    let btnClose = document.createElement('button');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_7__.Manipulator.set(btnClose, 'type', 'button');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_7__.Manipulator.set(btnClose, 'data-vg-dismiss', 'modal');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_7__.Manipulator.set(btnClose, 'data-vg-target', '#' + id);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_7__.Manipulator.set(btnClose, 'aria-label', 'close');
    btnClose.classList.add('vg-btn-close');
    content.append(btnClose);
    let body = document.createElement('div');
    body.classList.add('vg-modal-body');
    content.append(body);
    dialog.append(content);
    _element.append(dialog);
    document.body.append(_element);
    const modal = VGModal.getOrCreateInstance(_element, params);
    _element.classList.add(modal._params.animation.name);
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.execute)(callback, [modal]);
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
    _this._element.classList.add(CLASS_NAME_SHOW);
    _this._element.classList.add(_this._params.classes.animated);
    const completeCallBack = () => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(_this._element, 'mousedown.vg.modal', function (event) {
        const modalContent = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].find('.' + _this._params.classes.content, this);
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
    this._element.classList.remove(_this._params.classes.animated);
    const completeCallback = () => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
    };
    this._queueCallback(completeCallback, this._element, this._isAnimated());
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUNyREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDM0NBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQWtEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUMxVUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeFFBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9iYXNlLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL21vZHVsZS1mbi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnY29sbGFwc2UvanMvdmdjb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vanMvdmdkcm9wZG93bi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9qcy92Z2Zvcm1zZW5kZXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z21vZGFsL2pzL3ZnbW9kYWwuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z25hdi9qcy92Z25hdi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL292ZXJmbG93LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcGFyYW1zLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcGxhY2VtZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcmVzcG9uc2l2ZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vZGF0YS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vZXZlbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZnVuY3Rpb25zLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9zY3NzL3ZnZHJvcGRvd24uc2Nzcz9lODI1Iiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL3Njc3Mvdmdmb3Jtc2VuZGVyLnNjc3M/NjkxMiIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3M/MTI4OSIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L3Njc3MvdmduYXYuc2Nzcz8xOWJjIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3M/NWFjZCIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9zY3NzL2RlZmF1bHQuc2Nzcz9jNjM0Iiwid2VicGFjazovL3ZnL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmcvLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN1dGUsIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sIGlzRW1wdHlPYmp9IGZyb20gXCIuLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgRGF0YSBmcm9tIFwiLi4vdXRpbHMvanMvZG9tL2RhdGFcIjtcclxuaW1wb3J0IFBhcmFtcyBmcm9tIFwiLi4vdXRpbHMvanMvY29tcG9uZW50cy9wYXJhbXNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7QWpheCwgZ2V0U1ZHfSBmcm9tIFwiLi9tb2R1bGUtZm5cIjtcclxuXHJcbmNsYXNzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdGlmICghZWxlbWVudCkgcmV0dXJuXHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudCA9IFNlbGVjdG9ycy5maW5kKGVsZW1lbnQpO1xyXG5cdFx0aWYgKCF0aGlzLl9lbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0ge307XHJcblx0XHREYXRhLnNldCh0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZLCB0aGlzKVxyXG5cdH1cclxuXHJcblx0X2dldFBhcmFtcyhlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHJldHVybiBuZXcgUGFyYW1zKHBhcmFtcywgZWxlbWVudCkuZ2V0KCk7XHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0RGF0YS5yZW1vdmUodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FX0tFWSk7XHJcblx0XHRFdmVudEhhbmRsZXIub2ZmKHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKVxyXG5cclxuXHRcdGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHRoaXNbcHJvcGVydHlOYW1lXSA9IG51bGxcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yb3V0ZShjYWxsYmFjaykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0bGV0ICRjb250ZW50ID0gbnVsbDtcclxuXHJcblx0XHRjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcclxuXHRcdFx0aWYgKCRjb250ZW50KSAkY29udGVudC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoIV90aGlzLl9wYXJhbXMuaGFzT3duUHJvcGVydHkoJ2FqYXgnKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fcGFyYW1zLmFqYXgucm91dGUpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJ21ldGhvZCcgaW4gX3RoaXMuX3BhcmFtcy5hamF4KSB7XHJcblx0XHRcdF90aGlzLl9wYXJhbXMuYWpheC5tZXRob2QgPSAnZ2V0JztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ3RhcmdldCcgaW4gX3RoaXMuX3BhcmFtcy5hamF4ICYmIF90aGlzLl9wYXJhbXMuYWpheC50YXJnZXQpIHtcclxuXHRcdFx0JGNvbnRlbnQgPSBTZWxlY3RvcnMuZmluZChfdGhpcy5fcGFyYW1zLmFqYXgudGFyZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ2xvYWRlcicgaW4gX3RoaXMuX3BhcmFtcy5hamF4ICYmIF90aGlzLl9wYXJhbXMuYWpheC5sb2FkZXIpIHtcclxuXHRcdFx0c2V0RGF0YSgnPGRpdiBjbGFzcz1cInZnLWxvYWRlclwiPjwvZGl2PicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEFqYXhbX3RoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZF0oX3RoaXMuX3BhcmFtcy5hamF4LnJvdXRlLCBfdGhpcy5fcGFyYW1zLmFqYXguZGF0YSB8fCB7fSwgZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRzZXREYXRhKGRhdGEpO1xyXG5cdFx0XHRleGVjdXRlKGNhbGxiYWNrLCBbc3RhdHVzLCBkYXRhXSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdF9kaXNtaXNzRWxlbWVudCgpIHtcclxuXHRcdGxldCBjcm9zcyA9IGdldFNWRygnY3Jvc3MnKSxcclxuXHRcdFx0YnV0dG9uID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmctYnRuLWNsb3NlJyk7XHJcblxyXG5cdFx0aWYgKGJ1dHRvbikge1xyXG5cdFx0XHRsZXQgc3ZnID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG5cdFx0XHRpZiAoIXN2ZykgYnV0dG9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgY3Jvc3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3F1ZXVlQ2FsbGJhY2soY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQgPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRcdGV4ZWN1dGVBZnRlclRyYW5zaXRpb24oY2FsbGJhY2ssIGVsZW1lbnQsIGlzQW5pbWF0ZWQsIHRpbWVPdXRNcyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIERhdGEuZ2V0KFNlbGVjdG9ycy5maW5kKGVsZW1lbnQpLCB0aGlzLk5BTUVfS0VZKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHJldHVybiB0aGlzLmdldEluc3RhbmNlKGVsZW1lbnQpIHx8IG5ldyB0aGlzKGVsZW1lbnQsICFpc0VtcHR5T2JqKHBhcmFtcykgPyBwYXJhbXMgOiB7fSlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgREFUQV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gYHZnLiR7dGhpcy5OQU1FfWBcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgRVZFTlRfS0VZKCkge1xyXG5cdFx0cmV0dXJuIGAuJHt0aGlzLkRBVEFfS0VZfWBcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhc2VNb2R1bGU7IiwiaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICog0KLRg9GCINGB0L7QsdGA0LDQvdGLINCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDRgdC60YDQuNC/0YLRiyDQtNC70Y8g0YDQsNCx0L7RgtGLINC80L7QtNGD0LvQtdC5XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCd0LDQsdC+0YAgc3ZnINGN0LvQtdC80LXQvdGC0L7QslxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcmV0dXJucyB7Knx7fX1cclxuICovXHJcbmNvbnN0IGdldFNWRyA9IChuYW1lKSA9PiB7XHJcblx0Y29uc3Qgc3ZnID0gIHtcclxuXHRcdGVycm9yOiAnPHN2ZyAgdmlld0JveD1cIjAgMCA4NyA4N1wiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGcgaWQ9XCJ1aS1zdWNjZXNzXCIgc3Ryb2tlPVwibm9uZVwiIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIj48ZyBpZD1cIkdyb3VwLTJcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMi4wMDAwMDAsIDIuMDAwMDAwKVwiPjxjaXJjbGUgaWQ9XCJPdmFsLTJcIiBzdHJva2U9XCJyZ2JhKDI1MiwgMTkxLCAxOTEsIC41KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxjaXJjbGUgY2xhc3M9XCJ1aS1lcnJvci1jaXJjbGVcIiBzdHJva2U9XCIjRjc0NDQ0XCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PHBhdGggY2xhc3M9XCJ1aS1lcnJvci1saW5lMVwiIGQ9XCJNMjIuMjQ0MjI0LDIyIEw2MC40Mjc5OTAyLDYwLjE4Mzc2NjJcIiBpZD1cIkxpbmVcIiBzdHJva2U9XCIjRjc0NDQ0XCIgc3Ryb2tlLXdpZHRoPVwiM1wiIHN0cm9rZS1saW5lY2FwPVwic3F1YXJlXCI+PC9wYXRoPjxwYXRoIGNsYXNzPVwidWktZXJyb3ItbGluZTJcIiBkPVwiTTYwLjc1NTc3NiwyMSBMMjMuMjQ0MjI0LDU5Ljg0NDM0OTJcIiBpZD1cIkxpbmVcIiBzdHJva2U9XCIjRjc0NDQ0XCIgc3Ryb2tlLXdpZHRoPVwiM1wiIHN0cm9rZS1saW5lY2FwPVwic3F1YXJlXCI+PC9wYXRoPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdHN1Y2Nlc3M6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODcgODdcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnIGlkPVwidWktZXJyb3JcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIGlkPVwiR3JvdXAtM1wiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApXCI+PGNpcmNsZSBpZD1cIk92YWwtMlwiIHN0cm9rZT1cInJnYmEoMTE3LCAxODMsIDE1MiwgMC40KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxjaXJjbGUgIGNsYXNzPVwidWktc3VjY2Vzcy1jaXJjbGVcIiBpZD1cIk92YWwtMlwiIHN0cm9rZT1cIiNBNURDODZcIiBzdHJva2Utd2lkdGg9XCI0XCIgY3g9XCI0MS41XCIgY3k9XCI0MS41XCIgcj1cIjQxLjVcIj48L2NpcmNsZT48cG9seWxpbmUgY2xhc3M9XCJ1aS1zdWNjZXNzLXBhdGhcIiBpZD1cIlBhdGgtMlwiIHN0cm9rZT1cIiNBNURDODZcIiBzdHJva2Utd2lkdGg9XCI0XCIgcG9pbnRzPVwiMTkgMzguODAzNjgxMyAzMS4xMDIwNzQ0IDU0LjgwNDY4NzUgNjMuMjk5MjIxIDI4XCI+PC9wb2x5bGluZT48L2c+PC9nPjwvc3ZnPicsXHJcblx0XHR3YWl0aW5nOiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDg3IDg3XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBpZD1cInVpLXdhaXRpbmdcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIGlkPVwiR3JvdXAtM1wiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApXCI+PGNpcmNsZSBpZD1cIk92YWwtMlwiIHN0cm9rZT1cInJnYmEoMjU1LCAyMTgsIDEwNiwgMC40KVwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxjaXJjbGUgY2xhc3M9XCJ1aS13YWl0aW5nLWNpcmNsZVwiIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwiI2ZmZGE2YVwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxwYXRoIGNsYXNzPVwidWktd2FpdGluZy1saW5lMVwiIGQ9XCJNNDMgNjNDNTQuNTk4IDYzIDY0IDUzLjU5OCA2NCA0MkM2NCAzMC40MDIgNTQuNTk4IDIxIDQzIDIxQzMxLjQwMiAyMSAyMiAzMC40MDIgMjIgNDJDMjIgNTMuNTk4IDMxLjQwMiA2MyA0MyA2M1pcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlPVwiI2ZmZGE2YVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz48cGF0aCBjbGFzcz1cInVpLXdhaXRpbmctbGluZTJcIiBkPVwiTTQwLjY2NjcgMzIuNjY0MVY0NC4zMzA3SDUyLjMzMzRcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz48L2c+PC9nPjwvc3ZnPicsXHJcblx0XHRkb3RzOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGNsYXNzPVwiYmkgYmktdGhyZWUtZG90cy12ZXJ0aWNhbFwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj48cGF0aCBkPVwiTTkuNSAxM2ExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHptMC01YTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6XCIvPjwvc3ZnPicsXHJcblx0XHRjcm9zczogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCAyMjQuNTEyIDIyNC41MTJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxnPjxwb2x5Z29uIHBvaW50cz1cIjIyNC41MDcsNi45OTcgMjE3LjUyMSwwIDExMi4yNTYsMTA1LjI1OCA2Ljk5OCwwIDAuMDA1LDYuOTk3IDEwNS4yNjMsMTEyLjI1NCAwLjAwNSwyMTcuNTEyIDYuOTk4LDIyNC41MTIgMTEyLjI1NiwxMTkuMjQgMjE3LjUyMSwyMjQuNTEyIDIyNC41MDcsMjE3LjUxMiAxMTkuMjQ5LDExMi4yNTQgXCIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4nXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHN2Z1tuYW1lXSA/PyB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LXRiNCw0LXQvCDRgdC+0LHRi9GC0LjQtSBcItCX0LDQutGA0YvRgtGMXCIg0L3QsCDQstGB0LUg0LzQvtC00LDQu9C60LgsINGB0LDQudC00LHQsNGA0Ysg0Lgg0YIu0L8uXHJcbiAqIEBwYXJhbSBtb2R1bGVcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKi9cclxuY29uc3QgZGlzbWlzc1RyaWdnZXIgPSAobW9kdWxlLCBtZXRob2QgPSAnaGlkZScpID0+IHtcclxuXHRjb25zdCBjbGlja0V2ZW50ID0gYGNsaWNrLmRpc21pc3MuJHttb2R1bGUuRVZFTlRfS0VZfWBcclxuXHRjb25zdCBuYW1lID0gbW9kdWxlLk5BTUU7XHJcblxyXG5cdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgY2xpY2tFdmVudCwgYFtkYXRhLXZnLWRpc21pc3M9XCIke25hbWV9XCJdYCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKSB8fCB0aGlzLmNsb3Nlc3QoYC52Zy0ke25hbWV9YClcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gbW9kdWxlLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cclxuXHRcdGluc3RhbmNlW21ldGhvZF0oKVxyXG5cdH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBSkFYIFJFUVVFU1RcclxuICogQHR5cGUge3twb3N0OiBhamF4LnBvc3QsIGdldDogYWpheC5nZXQsIHg6ICgoZnVuY3Rpb24oKTogKFhNTEh0dHBSZXF1ZXN0KSl8KiksIHNlbmQ6IGFqYXguc2VuZH19XHJcbiAqL1xyXG5jb25zdCBBamF4ID0ge1xyXG5cdHg6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1cclxuXHRcdGxldCB2ZXJzaW9ucyA9IFtcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC42LjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC41LjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC40LjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC4zLjBcIixcclxuXHRcdFx0XCJNU1hNTDIuWG1sSHR0cC4yLjBcIixcclxuXHRcdFx0XCJNaWNyb3NvZnQuWG1sSHR0cFwiXHJcblx0XHRdO1xyXG5cclxuXHRcdGxldCB4aHI7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZlcnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0eGhyID0gbmV3IEFjdGl2ZVhPYmplY3QodmVyc2lvbnNbaV0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB4aHI7XHJcblx0fSxcclxuXHJcblx0c2VuZDogZnVuY3Rpb24gKHVybCwgY2FsbGJhY2ssIG1ldGhvZCwgZGF0YSwgYXN5bmMpIHtcclxuXHRcdGlmIChhc3luYyA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGFzeW5jID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGxldCB4ID0gQWpheC54KCk7XHJcblx0XHR4Lm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jKTtcclxuXHRcdHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeC5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0c3dpdGNoICh4LnN0YXR1cykge1xyXG5cdFx0XHRcdFx0Y2FzZSAyMDA6XHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCdzdWNjZXNzJywgeC5yZXNwb25zZVRleHQpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ2Vycm9yJywgeC5zdGF0dXNUZXh0KVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHR4LnNlbmQoZGF0YSlcclxuXHR9LFxyXG5cclxuXHRnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0bGV0IHF1ZXJ5ID0gW107XHJcblxyXG5cdFx0aWYgKCFpc0VtcHR5T2JqKGRhdGEpKSB7XHJcblx0XHRcdGZvciAobGV0IGtleSBvZiBkYXRhKSB7XHJcblx0XHRcdFx0cXVlcnkucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5WzBdKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChrZXlbMV0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0QWpheC5zZW5kKHVybCArIChxdWVyeS5sZW5ndGggPyAnPycgKyBxdWVyeS5qb2luKCcmJykgOiAnJyksIGNhbGxiYWNrLCAnR0VUJywgbnVsbCwgYXN5bmMpXHJcblx0fSxcclxuXHJcblx0cG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgY2FsbGJhY2ssIGFzeW5jKSB7XHJcblx0XHRBamF4LnNlbmQodXJsLCBjYWxsYmFjaywgJ1BPU1QnLCBkYXRhLCBhc3luYylcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQge1xyXG5cdGRpc21pc3NUcmlnZ2VyLCBBamF4LCBnZXRTVkdcclxufSIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge21lcmdlRGVlcE9iamVjdCwgcmVmbG93fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnY29sbGFwc2UnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTRSA9ICd2Zy1jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ09MTEFQU0lORyA9ICd2Zy1jb2xsYXBzaW5nJztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTRUQgPSAndmctY29sbGFwc2VkJztcclxuY29uc3QgQ0xBU1NfTkFNRV9ERUVQRVJfQ0hJTERSRU4gPSBgOnNjb3BlIC4ke0NMQVNTX05BTUVfQ09MTEFQU0V9IC4ke0NMQVNTX05BTUVfQ09MTEFQU0V9YDtcclxuXHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwiY29sbGFwc2VcIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9BQ1RJVkVTID0gJy5jb2xsYXBzZS5zaG93LCAuY29sbGFwc2UuY29sbGFwc2luZyc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHQ29sbGFwc2UgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0dG9nZ2xlOiB0cnVlLFxyXG5cdFx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlXHJcblx0XHR0aGlzLl90cmlnZ2VyQXJyYXkgPSBbXVxyXG5cclxuXHRcdGNvbnN0IHRvZ2dsZUxpc3QgPSBTZWxlY3RvcnMuZmluZEFsbChTRUxFQ1RPUl9EQVRBX1RPR0dMRSk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCBlbGVtIG9mIHRvZ2dsZUxpc3QpIHtcclxuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBTZWxlY3RvcnMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtKTtcclxuXHRcdFx0Y29uc3QgZmlsdGVyRWxlbWVudCA9IFNlbGVjdG9ycy5maW5kQWxsKHNlbGVjdG9yKS5maWx0ZXIoZm91bmRFbGVtZW50ID0+IGZvdW5kRWxlbWVudCA9PT0gdGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0XHRpZiAoc2VsZWN0b3IgIT09IG51bGwgJiYgZmlsdGVyRWxlbWVudC5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzLl90cmlnZ2VyQXJyYXkucHVzaChlbGVtKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5faW5pdGlhbGl6ZUNoaWxkcmVuKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMucGFyZW50KSB7XHJcblx0XHRcdHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl90cmlnZ2VyQXJyYXksIHRoaXMuX2lzU2hvd24oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0dGhpcy50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8IF90aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHRsZXQgYWN0aXZlQ2hpbGRyZW4gPSBbXTtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5wYXJlbnQpIHtcclxuXHRcdFx0YWN0aXZlQ2hpbGRyZW4gPSB0aGlzLl9nZXRGaXJzdExldmVsQ2hpbGRyZW4oU0VMRUNUT1JfQUNUSVZFUylcclxuXHRcdFx0XHQuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudClcclxuXHRcdFx0XHQubWFwKGVsZW1lbnQgPT4gVkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHsgdG9nZ2xlOiBmYWxzZSB9KSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGFjdGl2ZUNoaWxkcmVuLmxlbmd0aCAmJiBhY3RpdmVDaGlsZHJlblswXS5faXNUcmFuc2l0aW9uaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3Qgc3RhcnRFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVyk7XHJcblx0XHRpZiAoc3RhcnRFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0Zm9yIChjb25zdCBhY3RpdmVJbnN0YW5jZSBvZiBhY3RpdmVDaGlsZHJlbikge1xyXG5cdFx0XHRhY3RpdmVJbnN0YW5jZS5oaWRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNFKVxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNJTkcpXHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gMDtcclxuXHJcblx0XHRfdGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKF90aGlzLl90cmlnZ2VyQXJyYXksIHRydWUpO1xyXG5cdFx0X3RoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcblxyXG5cdFx0X3RoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNFLCBDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04pO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlLCBfdGhpcy5fZWxlbWVudCwgdHJ1ZSk7XHJcblxyXG5cdFx0Y29uc3Qgc2Nyb2xsU2l6ZSA9IGBzY3JvbGxIZWlnaHRgO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7X3RoaXMuX2VsZW1lbnRbc2Nyb2xsU2l6ZV19cHhgO1xyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMuX2lzVHJhbnNpdGlvbmluZyB8fCAhX3RoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHN0YXJ0RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpXHJcblx0XHRpZiAoc3RhcnRFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHR9cHhgO1xyXG5cdFx0cmVmbG93KF90aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0lORyk7XHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0UsIENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0cmlnZ2VyIG9mIF90aGlzLl90cmlnZ2VyQXJyYXkpIHtcclxuXHRcdFx0Y29uc3QgZWxlbWVudCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRyaWdnZXIpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgIV90aGlzLl9pc1Nob3duKGVsZW1lbnQpKSB7XHJcblx0XHRcdFx0X3RoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhbdHJpZ2dlcl0sIGZhbHNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSB0cnVlXHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNJTkcpO1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0UpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgX3RoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModHJpZ2dlckFycmF5LCBpc09wZW4pIHtcclxuXHRcdGlmICghdHJpZ2dlckFycmF5Lmxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdHJpZ2dlckFycmF5KSB7XHJcblx0XHRcdHRoaXMuX2NoYW5nZVN0YXRlQnV0dG9uKGVsZW1lbnQsIGlzT3Blbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfaW5pdGlhbGl6ZUNoaWxkcmVuKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMucGFyZW50KSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRGaXJzdExldmVsQ2hpbGRyZW4oU0VMRUNUT1JfREFUQV9UT0dHTEUpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBjaGlsZHJlbikge1xyXG5cdFx0XHRjb25zdCBzZWxlY3RlZCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpXHJcblxyXG5cdFx0XHRpZiAoc2VsZWN0ZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoW2VsZW1lbnRdLCB0aGlzLl9pc1Nob3duKHNlbGVjdGVkKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2dldEZpcnN0TGV2ZWxDaGlsZHJlbihzZWxlY3Rvcikge1xyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSBTZWxlY3RvcnMuZmluZChDTEFTU19OQU1FX0RFRVBFUl9DSElMRFJFTiwgdGhpcy5fcGFyYW1zLnBhcmVudCk7XHJcblx0XHRyZXR1cm4gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IsIHRoaXMuX3BhcmFtcy5wYXJlbnQpLmZpbHRlcihlbGVtZW50ID0+ICFjaGlsZHJlbi5pbmNsdWRlcyhlbGVtZW50KSk7XHJcblx0fVxyXG5cclxuXHRfY2hhbmdlU3RhdGVCdXR0b24oZWxlbWVudCwgaXNPcGVuKSB7XHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfTkFNRV9DT0xMQVBTRUQsICFpc09wZW4pO1xyXG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pO1xyXG5cdFx0ZWxlbWVudC5pbm5lckhUTUwgPSBNYW5pcHVsYXRvci5nZXQoZWxlbWVudCwgYGRhdGEtJHtpc09wZW4gPyAnaGlkZScgOiAnc2hvdyd9LXRleHRgKSB8fCBlbGVtZW50LmlubmVySFRNTDtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdBJyB8fCAoZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgZXZlbnQuZGVsZWdhdGVUYXJnZXQudGFnTmFtZSA9PT0gJ0EnKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0U2VsZWN0b3JzLmdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IodGhpcykuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0VkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fSk7XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0NvbGxhcHNlOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIG1lcmdlRGVlcE9iamVjdCwgbm9vcH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGxhY2VtZW50IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3BsYWNlbWVudFwiO1xyXG5cclxuY29uc3QgTkFNRSAgICAgICAgICAgICA9ICdkcm9wZG93bic7XHJcbmNvbnN0IE5BTUVfS0VZICAgICAgICAgPSAndmcuZHJvcGRvd24nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgID0gJ2ZhZGUnO1xyXG5jb25zdCBUQVJHRVRfQ09OVEFJTkVSID0gJ3ZnLWRyb3Bkb3duLWNvbnRlbnQnO1xyXG5jb25zdCBQQVJFTlRfQ09OVEFJTkVSID0gJ3ZnLWRyb3Bkb3duJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl0nO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gICAgIGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWURPV05fREFUQV9BUEkgPSAgIGBrZXlkb3duLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSAgICAgYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJID0gYG1vdXNlb3Zlci4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJID0gIGBtb3VzZW91dC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0Ryb3Bkb3duIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRvZmZzZXQ6IFswLCAyXSxcclxuXHRcdFx0b3ZlcjogZmFsc2UsXHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdHBsYWNlbWVudDogJ2JvdHRvbScsXHJcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHRcdFx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdFx0XHRob3ZlcjogZmFsc2UsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcclxuXHRcdHRoaXMuX2Ryb3AgPSBTZWxlY3RvcnMuZmluZCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSLCB0aGlzLl9wYXJlbnQpO1xyXG5cdFx0dGhpcy5faXNQbGFjZW1lbnQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5fcGFyYW1zLnRpbWVvdXRBbmltYXRpb24gPSAxMFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzU2hvd24oKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9zZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9kcm9wLCB0cnVlLCA1MCk7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgIXRoaXMuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRyZXR1cm4gc3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUsIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9wYXJlbnQsIHRydWUsIHRoaXMuX3BhcmFtcy50aW1lb3V0QW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub2Zmc2V0KSB7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdUb3AgPSBfdGhpcy5fcGFyYW1zLm9mZnNldFsxXSArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdSaWdodCA9IF90aGlzLl9wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgUEFSRU5UX0NPTlRBSU5FUik7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCFpbnN0YW5jZS5fcGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRpbnN0YW5jZS5fY29tcGxldGVIaWRlKHtyZWxhdGVkVGFyZ2V0OiBpbnN0YW5jZS5fZWxlbWVudH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWURPV05fREFUQV9BUEksICcuJyArIFRBUkdFVF9DT05UQUlORVIsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl06bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHRHJvcGRvd24uZ2V0SW5zdGFuY2UodG9nZ2xlKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZHJvcCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMga2V5ZG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlzSW5wdXQgPSAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKVxyXG5cdFx0Y29uc3QgaXNFc2NhcGVFdmVudCA9IGV2ZW50LmtleSA9PT0gJ0VzY2FwZSdcclxuXHRcdGNvbnN0IGlzVXBPckRvd25FdmVudCA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXS5pbmNsdWRlcyhldmVudC5rZXkpXHJcblxyXG5cdFx0aWYgKCFpc1VwT3JEb3duRXZlbnQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzSW5wdXQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuXHRcdGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgP1xyXG5cdFx0XHR0aGlzIDogKFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5wYXJlbnROb2RlKSlcclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShnZXRUb2dnbGVCdXR0b24pXHJcblxyXG5cdFx0aWYgKGlzVXBPckRvd25FdmVudCkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5zaG93KClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2UuaGlkZSgpXHJcblx0XHRcdGdldFRvZ2dsZUJ1dHRvbi5mb2N1cygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRHJvcGRvd247IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBWR01vZGFsIGZyb20gXCIuLi8uLi92Z21vZGFsL2pzL3ZnbW9kYWxcIjtcclxuaW1wb3J0IHttYWtlUmFuZG9tU3RyaW5nLCBtZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgVkdDb2xsYXBzZSBmcm9tIFwiLi4vLi4vdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlXCI7XHJcbmltcG9ydCB7Z2V0U1ZHfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ2Zvcm0tc2VuZGVyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuZnMnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgRXZlbnRzXHJcbiAqL1xyXG5jb25zdCBFVkVOVF9LRVlfU1VDQ0VTUyA9ICd2Zy5mcy5zdWNjZXNzJztcclxuY29uc3QgRVZFTlRfS0VZX0VSUk9SICAgPSAndmcuZnMuZXJyb3InO1xyXG5jb25zdCBFVkVOVF9LRVlfQkVGT1JFICA9ICd2Zy5mcy5iZWZvcmUnO1xyXG5cclxuY29uc3QgRVZFTlRfU1VCTUlUX0RBVEFfQVBJID0gYHN1Ym1pdC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0Zvcm1TZW5kZXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0cmVkaXJlY3Q6ICcnLFxyXG5cdFx0XHR2YWxpZGF0ZTogZmFsc2UsXHJcblx0XHRcdHN1Ym1pdDogZmFsc2UsXHJcblx0XHRcdGZpZWxkczogW10sXHJcblx0XHRcdGFsZXJ0OiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHR0eXBlOiAnbW9kYWwnXHJcblx0XHRcdH0sXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjbGFzc2VzOiB7XHJcblx0XHRcdFx0Z2VuZXJhbDogJ3ZnLWZvcm0tc2VuZGVyJyxcclxuXHRcdFx0XHRhbGVydENvbGxhcHNlOiAndmctZm9ybS1zZW5kZXItY29sbGFwc2UnLFxyXG5cdFx0XHRcdGFsZXJ0TW9kYWw6ICd2Zy1mb3JtLXNlbmRlci1tb2RhbCcsXHJcblx0XHRcdFx0dmFsaWRhdGlvbjogJ25lZWRzLXZhbGlkYXRpb24nLFxyXG5cdFx0XHRcdHdhc1ZhbGlkYXRlOiAnd2FzLXZhbGlkYXRlZCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmFqYXgucm91dGUgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2FjdGlvbicpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHR0aGlzLl9wYXJhbXMuYWpheC5tZXRob2QgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ21ldGhvZCcpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHR0aGlzLl9idXR0b24gPSBTZWxlY3RvcnMuZmluZCgnW3R5cGU9XCJzdWJtaXRcIl0nLCB0aGlzLl9lbGVtZW50KSB8fCBTZWxlY3RvcnMuZmluZCgnW2Zvcm09XCInICsgdGhpcy5fZWxlbWVudC5pZCArICdcIl0nKSB8fCBudWxsO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5pc0J0blRleHQgICA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnZGF0YS1idG4tdGV4dCcpICE9PSAnZmFsc2UnO1xyXG5cdFx0dGhpcy5fcGFyYW1zLmlzSnNvblBhcnNlID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdkYXRhLWpzb24tcGFyc2UnKSAhPT0gJ2ZhbHNlJztcclxuXHRcdHRoaXMuX3BhcmFtcy5pc1Nob3dQYXNzICA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnZGF0YS1zaG93LXBhc3MnKSA9PT0gJ3RydWUnO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0YnVpbGQoKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5fcGFyYW1zLmNsYXNzZXMuZ2VuZXJhbCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy52YWxpZGF0ZSkge1xyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQodGhpcy5fZWxlbWVudCwgJ25vdmFsaWRhdGUnLCAnJyk7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLl9wYXJhbXMuY2xhc3Nlcy52YWxpZGF0aW9uKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPINGB0LTQtdC70LDRgtGMINC00L7QsdCw0LLQu9C10L3QuNC1INCz0LvQsNC30LAg0LXRgdC70Lgg0LXRgdGC0Ywg0LLQstC+0LQg0L/QsNGA0L7Qu9GPXHJcblxyXG5cdFx0cmV0dXJuIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlcXVlc3QoZGF0YSwgZXZlbnQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fYWxlcnRCZWZvcmUoKTtcclxuXHJcblx0XHRfdGhpcy5fcGFyYW1zLmFqYXguZmllbGRzID0gZGF0YTtcclxuXHJcblx0XHRfdGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd3YXMtdmFsaWRhdGVkJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC5lbmFibGVkKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBzdGF0dXMgPT09ICdzdHJpbmcnICYmIHN0YXR1cyA9PT0gJ2Vycm9yJykge1xyXG5cdFx0XHRcdFx0X3RoaXMuX2FsZXJ0RXJyb3IoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ3N0cmluZycgJiYgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRcdF90aGlzLl9hbGVydFN1Y2Nlc3MoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMucmVkaXJlY3QpIHtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IF90aGlzLl9wYXJhbXMucmVkaXJlY3Q7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0QmVmb3JlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdjb2xsYXBzZScpIHtcclxuXHRcdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdFx0VkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHt0b2dnbGU6IGZhbHNlfSkuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX3N0YXR1c0J1dHRvbignYmVmb3JlJyk7XHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0JFRk9SRSwgX3RoaXMpO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0RXJyb3IoZXZlbnQsIGRhdGEpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdhZnRlcicpO1xyXG5cdFx0X3RoaXMuX2pzb25QYXJzZShkYXRhLCAnZXJyb3InKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfRVJST1IsIFtldmVudCwgX3RoaXMsIGRhdGFdKTtcclxuXHR9XHJcblxyXG5cdF9hbGVydFN1Y2Nlc3MoZXZlbnQsIGRhdGEpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdhZnRlcicpO1xyXG5cdFx0X3RoaXMuX2pzb25QYXJzZShkYXRhLCAnc3VjY2VzcycpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TVUNDRVNTLCBbZXZlbnQsIF90aGlzLCBkYXRhXSk7XHJcblx0fVxyXG5cclxuXHRfc3RhdHVzQnV0dG9uKHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2J1dHRvbikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBidG5TdWJtaXRUZXh0ID0gX3RoaXMuX2J1dHRvbixcclxuXHRcdFx0YnRuVGV4dCA9IHtcclxuXHRcdFx0c2VuZDogJ9Ce0YLQv9GA0LDQstC70Y/QtdC8Li4uJyxcclxuXHRcdFx0dGV4dDogJ9Ce0YLQv9GA0LDQstC40YLRjCdcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS1zcGlubmVyJykgJiYgc3RhdHVzID09PSAnYmVmb3JlJykge1xyXG5cdFx0XHRfdGhpcy5fYnV0dG9uLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtIG1lLTJcIj48L3NwYW4+Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0JykpIHtcclxuXHRcdFx0YnRuVGV4dC50ZXh0ID0gTWFuaXB1bGF0b3IuZ2V0KF90aGlzLl9idXR0b24sICdkYXRhLXRleHQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCAkYnRuVGV4dCA9IF90aGlzLl9idXR0b24ucXVlcnlTZWxlY3RvcignW2RhdGEtdGV4dF0nKTtcclxuXHRcdFx0aWYgKCRidG5UZXh0KSB7XHJcblx0XHRcdFx0YnRuVGV4dC50ZXh0ID0gTWFuaXB1bGF0b3IuZ2V0KCRidG5UZXh0LCAnZGF0YS10ZXh0Jyk7XHJcblx0XHRcdFx0YnRuU3VibWl0VGV4dCA9ICRidG5UZXh0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0LXNlbmQnKSkge1xyXG5cdFx0XHRidG5UZXh0LnNlbmQgPSBNYW5pcHVsYXRvci5nZXQoX3RoaXMuX2J1dHRvbiwgJ2RhdGEtdGV4dC1zZW5kJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgJGJ0blRleHRTZW5kID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXh0LXNlbmRdJyk7XHJcblx0XHRcdGlmICgkYnRuVGV4dFNlbmQpIHtcclxuXHRcdFx0XHRidG5UZXh0LnNlbmQgPSBNYW5pcHVsYXRvci5nZXQoJGJ0blRleHRTZW5kLCAnZGF0YS10ZXh0LXNlbmQnKTtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0ID0gJGJ0blRleHRTZW5kO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN0YXR1cyA9PT0gJ2JlZm9yZScpIHtcclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMuaXNCdG5UZXh0KSB7XHJcblx0XHRcdFx0YnRuU3VibWl0VGV4dC5pbm5lckhUTUwgPSBidG5UZXh0LnNlbmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KF90aGlzLl9idXR0b24sJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN0YXR1cyA9PT0gJ2FmdGVyJykge1xyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5pc0J0blRleHQpIHtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0LmlubmVySFRNTCA9IGJ0blRleHQudGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRNYW5pcHVsYXRvci5yZW1vdmUoX3RoaXMuX2J1dHRvbiwnZGlzYWJsZWQnKTtcclxuXHJcblx0XHRcdGxldCBzcGlubmVyID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCcuc3Bpbm5lci1ib3JkZXInKTtcclxuXHRcdFx0aWYgKHNwaW5uZXIpIHNwaW5uZXIucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfanNvblBhcnNlKGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmlzSnNvblBhcnNlICYmIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRsZXQgcGFyc2VyRGF0YSA9IHt9O1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRwYXJzZXJEYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuXHRcdFx0XHRfdGhpcy5hbGVydChwYXJzZXJEYXRhLCBzdGF0dXMpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0X3RoaXMuYWxlcnQoZGF0YSwgc3RhdHVzKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0X3RoaXMuYWxlcnQoZGF0YSwgc3RhdHVzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFsZXJ0KGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG5cdFx0XHRpZiAoJ2Vycm9ycycgaW4gZGF0YSkge1xyXG5cdFx0XHRcdHN0YXR1cyA9IG5vcm1hbGl6ZURhdGEoZGF0YS5lcnJvcnMpID8gJ2Vycm9yJyA6ICdzdWNjZXNzJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5hbGVydC5lbmFibGVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC50eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdF90aGlzLl9hbGVydE1vZGFsKGRhdGEsIHN0YXR1cylcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC50eXBlID09PSAnY29sbGFwc2UnKSB7XHJcblx0XHRcdF90aGlzLl9hbGVydENvbGxhcHNlKGRhdGEsIHN0YXR1cylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9hbGVydE1vZGFsKGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdC8vINCV0YHRgtGMINC70Lgg0L7RgtC60YDRi9GC0YvQtSDQvNC+0LTQsNC70LrQuCwg0LfQsNC60YDRi9Cy0LDQtdC8XHJcblx0XHRbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwnKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XHJcblx0XHRcdFx0bGV0IG1CUyA9IGJvb3RzdHJhcC5Nb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdFx0XHRcdG1CUy5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2Zy1tb2RhbCcpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdGlmIChlbGVtZW50ICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcclxuXHRcdFx0XHRjb25zdCBtVkcgPSBWR01vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCk7XHJcblx0XHRcdFx0bVZHLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0ICRtb2RhbCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHRcdGlmICgkbW9kYWwpICRtb2RhbC5yZW1vdmUoKTtcclxuXHJcblx0XHRsZXQgaWQgPSBfdGhpcy5fcGFyYW1zLmNsYXNzZXMuZ2VuZXJhbCArICctJyArIG1ha2VSYW5kb21TdHJpbmcoKTtcclxuXHRcdFZHTW9kYWwuaW5pdChpZCwge1xyXG5cdFx0XHRjbGFzc2VzOiB7XHJcblx0XHRcdFx0YWxlcnQ6IF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsXHJcblx0XHRcdH1cclxuXHRcdH0sIGZ1bmN0aW9uIChzZWxmKSB7XHJcblx0XHRcdGxldCBlbGVtZW50ID0gc2VsZi5fZWxlbWVudDtcclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHJcblx0XHRcdGxldCAkYm9keSA9IFNlbGVjdG9ycy5maW5kKCcudmctbW9kYWwtYm9keScsIGVsZW1lbnQpO1xyXG5cdFx0XHRpZiAoJGJvZHkpICRib2R5LmFwcGVuZChfdGhpcy5zZXREYXRhUmVsYXRpb25TdGF0dXMoZWxlbWVudCwgc3RhdHVzLCBkYXRhLCAnbW9kYWwnKSk7XHJcblxyXG5cdFx0XHRzZWxmLnRvZ2dsZSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRDb2xsYXBzZShkYXRhLCBzdGF0dXMpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRsZXQgJGNvbGxhcHNlID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpO1xyXG5cdFx0aWYgKCEkY29sbGFwc2UpIHtcclxuXHRcdFx0JGNvbGxhcHNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdCRjb2xsYXBzZS5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydENvbGxhcHNlKTtcclxuXHRcdFx0JGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ3ZnLWNvbGxhcHNlJyk7XHJcblx0XHRcdCRjb2xsYXBzZS5pZCA9IF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsICsgJy0nICsgbWFrZVJhbmRvbVN0cmluZygpO1xyXG5cdFx0XHQkY29sbGFwc2UuYXBwZW5kKF90aGlzLnNldERhdGFSZWxhdGlvblN0YXR1cygkY29sbGFwc2UsIHN0YXR1cywgZGF0YSwgJ2NvbGxhcHNlJykpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQucHJlcGVuZCgkY29sbGFwc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFZHQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZSgkY29sbGFwc2UsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fVxyXG5cclxuXHRzZXREYXRhUmVsYXRpb25TdGF0dXMoJGVsZW1lbnQsIHN0YXR1cywgZGF0YSwgdHlwZSkge1xyXG5cdFx0bGV0ICRhbGVydCA9IFNlbGVjdG9ycy5maW5kKCcudmctYWxlcnQtJyArIHN0YXR1cywgJGVsZW1lbnQpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0aWYgKCd2aWV3JyBpbiBkYXRhICYmIHR5cGVvZiBkYXRhLnZpZXcgPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0bGV0IHR4dCA9ICcnO1xyXG5cclxuXHRcdFx0XHRpZiAoJ3RpdGxlJyBpbiBkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHRcdHR4dCArPSAnPGg0IGNsYXNzPVwidmctYWxlcnQtY29udGVudC0tdGl0bGVcIj4nICsgZGF0YS52aWV3LnRpdGxlICsgJzwvaDQ+J1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCdtZXNzYWdlJyBpbiBkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHRcdHR4dCArPSAnPGRpdiBjbGFzcz1cInZnLWFsZXJ0LWNvbnRlbnQtLW1lc3NhZ2VcIj4nICsgZGF0YS52aWV3Lm1lc3NhZ2UgKyAnPC9kaXY+J1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZGF0YSA9IHR4dDtcclxuXHRcdFx0fSBlbHNlIGlmICgndmlldycgaW4gZGF0YSAmJiB0eXBlb2YgZGF0YS52aWV3ID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdFx0ZGF0YSA9IGRhdGEudmlldztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghJGFsZXJ0KSB7XHJcblx0XHRcdCRhbGVydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHQkYWxlcnQuY2xhc3NMaXN0LmFkZCgndmctYWxlcnQnLCAndmctYWxlcnQtJyArIHN0YXR1cywgJ3ZnLWFsZXJ0LScgKyB0eXBlKTtcclxuXHJcblx0XHRcdGxldCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgndmctYWxlcnQtY29udGVudCcpO1xyXG5cclxuXHRcdFx0bGV0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKCd2Zy1hbGVydC1jb250ZW50LS1pY29uJyk7XHJcblxyXG5cdFx0XHRsZXQgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHRcdFx0aS5pbm5lckhUTUwgPSBnZXRTVkcoc3RhdHVzKTtcclxuXHJcblx0XHRcdGljb24uYXBwZW5kKGkpO1xyXG5cdFx0XHRjb250ZW50LmFwcGVuZChpY29uKTtcclxuXHJcblx0XHRcdGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdHRleHQuY2xhc3NMaXN0LmFkZCgndmctYWxlcnQtY29udGVudC0tdGV4dCcpO1xyXG5cdFx0XHR0ZXh0LmlubmVySFRNTCA9IGRhdGE7XHJcblxyXG5cdFx0XHRjb250ZW50LmFwcGVuZCh0ZXh0KTtcclxuXHRcdFx0JGFsZXJ0LmFwcGVuZChjb250ZW50KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1hbGVydC1jb250ZW50LS10ZXh0JywgJGFsZXJ0KTtcclxuXHRcdFx0dGV4dC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAkYWxlcnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRm9ybVNlbmRlci5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHRpbnN0YW5jZS5idWlsZCgpO1xyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9TVUJNSVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGlmICghTWFuaXB1bGF0b3IuaGFzKGV2ZW50LnRhcmdldCwgJ2RhdGEtdmdmb3Jtc2VuZGVyJykpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGluc3RhbmNlID0gVkdGb3JtU2VuZGVyLmdldE9yQ3JlYXRlSW5zdGFuY2UoZXZlbnQudGFyZ2V0LCB7fSk7XHJcblx0aWYgKCFpbnN0YW5jZSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKGluc3RhbmNlLl9wYXJhbXMudmFsaWRhdGUpIHtcclxuXHRcdGlmICghaW5zdGFuY2UuX2VsZW1lbnQuY2hlY2tWYWxpZGl0eSgpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0aW5zdGFuY2UuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMud2FzVmFsaWRhdGUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgY29sbGVjdERhdGEgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcclxuXHRcdGZvciAobGV0IG5hbWUgaW4gZmllbGRzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZmllbGRzW25hbWVdID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiBmaWVsZHNbbmFtZV0pIHtcclxuXHRcdFx0XHRcdGxldCBhcnIgPSBPYmplY3Qua2V5cyhmaWVsZHNbbmFtZV1ba2V5XSkubWFwKGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmaWVsZHNbbmFtZV1ba2V5XVtpXTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgYXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgZmllbGRzW25hbWVdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH1cclxuXHJcblx0aWYgKCFpbnN0YW5jZS5fcGFyYW1zLnN1Ym1pdCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YShpbnN0YW5jZS5fZWxlbWVudCk7XHJcblx0XHRpZiAodHlwZW9mIGluc3RhbmNlLl9wYXJhbXMuYWpheC5maWVsZHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdGRhdGEgPSBjb2xsZWN0RGF0YShkYXRhLCBpbnN0YW5jZS5fcGFyYW1zLmFqYXguZmllbGRzKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gaW5zdGFuY2UucmVxdWVzdChkYXRhLCBldmVudCk7XHJcblx0fVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdGb3JtU2VuZGVyOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9vdmVyZmxvd1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBtYWtlUmFuZG9tU3RyaW5nLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdtb2RhbCc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLm1vZGFsJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJtb2RhbFwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCAgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSAgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdNb2RhbCBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRidXR0b246IG51bGwsXHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdG5hbWU6ICdhbmltYXRlX19iYWNrSW5VcCcsXHJcblx0XHRcdFx0ZHVyYXRpb246ICcxcycsXHJcblx0XHRcdFx0ZGVsYXk6ICcxcycsXHJcblx0XHRcdFx0cmVwZWF0OiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctbW9kYWwnLFxyXG5cdFx0XHRcdGRpYWxvZzogJ3ZnLW1vZGFsLWRpYWxvZycsXHJcblx0XHRcdFx0Y29udGVudDogJ3ZnLW1vZGFsLWNvbnRlbnQnLFxyXG5cdFx0XHRcdGhlYWRlcjogJ3ZnLW1vZGFsLWhlYWRlcicsXHJcblx0XHRcdFx0dGl0bGU6ICd2Zy1tb2RhbC10aXRsZScsXHJcblx0XHRcdFx0Ym9keTogJ3ZnLW1vZGFsLWJvZHknLFxyXG5cdFx0XHRcdGZvb3RlcjogJ3ZnLW1vZGFsLWZvb3RlcicsXHJcblx0XHRcdFx0YW5pbWF0ZWQ6ICdhbmltYXRlX19hbmltYXRlZCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0XHR0aGlzLl9kaXNtaXNzRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0VkdNb2RhbC5idWlsZChlbGVtZW50LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZChpZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0aWYgKHR5cGVvZiBpZCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0X2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwnKTtcclxuXHRcdF9lbGVtZW50LmlkID0gaWQ7bGV0IGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0ZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3ZnLW1vZGFsLWRpYWxvZycsICd2Zy1tb2RhbC1kaWFsb2ctY2VudGVyZWQnKTtcclxuXHJcblx0XHRsZXQgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0Y29udGVudC5jbGFzc0xpc3QuYWRkKCd2Zy1tb2RhbC1jb250ZW50Jyk7XHJcblxyXG5cdFx0bGV0IGJ0bkNsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQoYnRuQ2xvc2UsICd0eXBlJywgJ2J1dHRvbicpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAnZGF0YS12Zy1kaXNtaXNzJywgJ21vZGFsJyk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQoYnRuQ2xvc2UsICdkYXRhLXZnLXRhcmdldCcsICcjJyArIGlkKTtcclxuXHRcdE1hbmlwdWxhdG9yLnNldChidG5DbG9zZSwgJ2FyaWEtbGFiZWwnLCAnY2xvc2UnKTtcclxuXHRcdGJ0bkNsb3NlLmNsYXNzTGlzdC5hZGQoJ3ZnLWJ0bi1jbG9zZScpO1xyXG5cclxuXHRcdGNvbnRlbnQuYXBwZW5kKGJ0bkNsb3NlKTtcclxuXHJcblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0Ym9keS5jbGFzc0xpc3QuYWRkKCd2Zy1tb2RhbC1ib2R5Jyk7XHJcblxyXG5cdFx0Y29udGVudC5hcHBlbmQoYm9keSk7XHJcblx0XHRkaWFsb2cuYXBwZW5kKGNvbnRlbnQpO1xyXG5cdFx0X2VsZW1lbnQuYXBwZW5kKGRpYWxvZyk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoX2VsZW1lbnQpO1xyXG5cclxuXHRcdGNvbnN0IG1vZGFsID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKF9lbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0X2VsZW1lbnQuY2xhc3NMaXN0LmFkZChtb2RhbC5fcGFyYW1zLmFuaW1hdGlvbi5uYW1lKVxyXG5cclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFttb2RhbF0pO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdC8vdGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYW5pbWF0ZWQpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihfdGhpcy5fZWxlbWVudCwgJ21vdXNlZG93bi52Zy5tb2RhbCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGNvbnN0IG1vZGFsQ29udGVudCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5jb250ZW50LCB0aGlzKTtcclxuXHRcdFx0XHRpZiAoIW1vZGFsQ29udGVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlLCA1MClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYW5pbWF0ZWQpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2VsZW1lbnQsIHRoaXMuX2lzQW5pbWF0ZWQoKSk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTLCBldmVudCA9PiB7XHJcblx0XHRcdGlmIChldmVudC5rZXkgIT09ICdFc2NhcGUnKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLl9wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdNb2RhbClcclxuXHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX0hJRERFTiwgKCkgPT4ge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0fSlcclxuXHJcblx0Y29uc3QgYWxyZWFkeU9wZW4gPSBTZWxlY3RvcnMuZmluZCgnLnZnLW1vZGFsLnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWR01vZGFsLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWR01vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cdGRhdGEudG9nZ2xlKHRoaXMpXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR01vZGFsO1xyXG4iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9yZXNwb25zaXZlXCI7XHJcbmltcG9ydCB7Z2V0U1ZHfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBtZXJnZURlZXBPYmplY3QsIG5vb3AsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbmF2JztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubmF2JztcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgQ2xhc3Nlc1xyXG4gKi9cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XICAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgID0gJ2ZhZGUnO1xyXG5jb25zdCBDTEFTU19OQU1FX0FDVElWRSA9ICdhY3RpdmUnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICcudmctbmF2IGEnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBFdmVudHNcclxuICovXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgID0gYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlVUF9EQVRBX0FQSSA9IGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX1JFU0laRV9EQVRBX0FQSSA9IGByZXNpemUuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdOYXYgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJyZWFrcG9pbnQ6ICdsZycsXHJcblx0XHRcdHBsYWNlbWVudDogJ2hvcml6b250YWwnLFxyXG5cdFx0XHRjbGFzc2VzOiB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyQWN0aXZlOiAndmctbmF2LWhhbWJ1cmdlci1hY3RpdmUnLFxyXG5cdFx0XHRcdGhhbWJ1cmdlcjogJ3ZnLW5hdi1oYW1idXJnZXInLFxyXG5cdFx0XHRcdGNvbnRhaW5lcjogJ3ZnLW5hdi1jb250YWluZXInLFxyXG5cdFx0XHRcdHdyYXBwZXI6ICd2Zy1uYXYtd3JhcHBlcicsXHJcblx0XHRcdFx0YWN0aXZlOiAndmctbmF2LWFjdGl2ZScsXHJcblx0XHRcdFx0ZXhwYW5kOiAndmctbmF2LWV4cGFuZCcsXHJcblx0XHRcdFx0Y2xvbmVkOiAndmctbmF2LWNsb25lZCcsXHJcblx0XHRcdFx0aG92ZXI6ICd2Zy1uYXYtaG92ZXInLFxyXG5cdFx0XHRcdGZsaXA6ICd2Zy1uYXYtZmxpcCcsXHJcblx0XHRcdFx0WFhYTDogJ3ZnLW5hdi14eHhsJyxcclxuXHRcdFx0XHRYWEw6ICd2Zy1uYXYteHhsJyxcclxuXHRcdFx0XHRYTDogJ3ZnLW5hdi14bCcsXHJcblx0XHRcdFx0TEc6ICd2Zy1uYXYtbGcnLFxyXG5cdFx0XHRcdE1EOiAndmctbmF2LW1kJyxcclxuXHRcdFx0XHRTTTogJ3ZnLW5hdi1zbScsXHJcblx0XHRcdFx0WFM6ICd2Zy1uYXYteHMnXHJcblx0XHRcdH0sXHJcblx0XHRcdGV4cGFuZDogdHJ1ZSxcclxuXHRcdFx0aG92ZXI6IGZhbHNlLFxyXG5cdFx0XHRwb3NpdGlvbjogdHJ1ZSxcclxuXHRcdFx0Y29sbGFwc2U6IHRydWUsXHJcblx0XHRcdHRvZ2dsZTogJzxzcGFuIGNsYXNzPVwiZGVmYXVsdFwiPjwvc3Bhbj4nLFxyXG5cdFx0XHRoYW1idXJnZXI6IHtcclxuXHRcdFx0XHR0aXRsZTogJycsXHJcblx0XHRcdFx0Ym9keTogbnVsbFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjYWxsYmFjazogbm9vcCxcclxuXHRcdFx0YW5pbWF0aW9uOiB0cnVlLFxyXG5cdFx0XHR0aW1lb3V0QW5pbWF0aW9uOiAzMDAsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX25hdmlnYXRpb24gPSBudWxsO1xyXG5cdFx0dGhpcy5uYXZpZ2F0aW9uID0gJy4nICsgdGhpcy5fcGFyYW1zLmNsYXNzZXMud3JhcHBlcjtcclxuXHJcblx0XHR0aGlzLm1vdmVkTGlua3MgPSBbXTtcclxuXHRcdHRoaXMuJGxpbmtzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy4nICsgdGhpcy5fcGFyYW1zLmNsYXNzZXMud3JhcHBlciArICcgPiBsaScsIHRoaXMubmF2aWdhdGlvbilcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5fcGFyYW1zLnRpbWVvdXRBbmltYXRpb24gPSAxMFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0Z2V0IG5hdmlnYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcclxuXHR9XHJcblxyXG5cdHNldCBuYXZpZ2F0aW9uKGVsKSB7XHJcblx0XHRsZXQgZWxtID0gU2VsZWN0b3JzLmZpbmQoZWwsIHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0aWYgKCFlbG0pIHJldHVybjtcclxuXHRcdHRoaXMuX25hdmlnYXRpb24gPSBlbG07XHJcblx0fVxyXG5cclxuXHRidWlsZCgpIHtcclxuXHRcdGlmICghdGhpcy5uYXZpZ2F0aW9uKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHBhcmFtcyA9IHRoaXMuX3BhcmFtcztcclxuXHJcblx0XHQvLyDQktC10YjQsNC10Lwg0L7RgdC90L7QstC90YvQtSDQutC70LDRgdGB0YtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5jb250YWluZXIpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2Zy1uYXYtJyArIHBhcmFtcy5wbGFjZW1lbnQpO1xyXG5cclxuXHRcdC8vINCV0YHQu9C4INC90YPQttC90L4g0L7RgdGC0LDQstC40YLRjCDRgdC/0LjRgdC+0Log0LzQtdC90Y4g0LjQu9C4INGD0YHRgtCw0L3QvtCy0LjRgtGMINC80LXQtNC40LAg0YLQvtGH0LrRg1xyXG5cdFx0aWYgKHBhcmFtcy5icmVha3BvaW50ID09PSBudWxsKSB7XHJcblx0XHRcdHBhcmFtcy5leHBhbmQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGFyYW1zLmJyZWFrcG9pbnQgPT09IG51bGwgfHwgIXBhcmFtcy5leHBhbmQpIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmV4cGFuZCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLmJyZWFrcG9pbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCc0LXQvdGOINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCwg0LXRgdC70Lgg0Y3RgtC+INC90LUg0LzQvtCx0LjQu9GM0L3QvtC1INGD0YHRgtGA0L7QudGB0YLQstC+XHJcblx0XHRpZiAocGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5ob3Zlcik7XHJcblxyXG5cdFx0XHRpZiAoUmVzcG9uc2l2ZS5jaGVja01vYmlsZU9yVGFibGV0KCkpIHtcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmNsYXNzZXMuaG92ZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LPQsNC80LHRg9GA0LPQtdGALCDQtdGB0LvQuCDQtdCz0L4g0L3QtdGCINCyINGA0LDQt9C80LXRgtC60LVcclxuXHRcdGlmIChwYXJhbXMuZXhwYW5kICYmICFwYXJhbXMuaGFtYnVyZ2VyLmJvZHkpIHtcclxuXHRcdFx0bGV0IGlzSGFtYnVyZ2VyID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyLCB0aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChpc0hhbWJ1cmdlciA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBtVGl0bGUgPSAnJyxcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS1saW5lc1wiPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci50aXRsZSkge1xyXG5cdFx0XHRcdFx0bVRpdGxlID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLXRpdGxlXCI+JysgcGFyYW1zLmhhbWJ1cmdlci50aXRsZSArJzwvc3Bhbj4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIuYm9keSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gcGFyYW1zLmhhbWJ1cmdlci5ib2R5O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCc8YSBocmVmPVwiI3NpZGViYXItbmF2XCIgY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJ1wiIGRhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiPicgKyBtVGl0bGUgKyBoYW1idXJnZXIgKyc8L2E+Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRg9C60LDQt9Cw0YLQtdC70Ywg0L/QtdGA0LXQutC70Y7Rh9Cw0YLQtdC70Y9cclxuXHRcdGlmIChwYXJhbXMudG9nZ2xlKSB7XHJcblx0XHRcdGxldCAkZHJvcGRvd25fYSA9IFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duLW1lZ2EgPiBhLCAuZHJvcGRvd24gPiBhJywgdGhpcy5fZWxlbWVudCldLFxyXG5cdFx0XHRcdHRvZ2dsZSA9ICc8c3BhbiBjbGFzcz1cInRvZ2dsZVwiPicgKyBwYXJhbXMudG9nZ2xlICsgJzwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0aWYgKCRkcm9wZG93bl9hLmxlbmd0aCkge1xyXG5cdFx0XHRcdCRkcm9wZG93bl9hLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuXHRcdFx0XHRcdGlmICghZWxlbS5xdWVyeVNlbGVjdG9yKCcudG9nZ2xlJykgJiYgIWVsZW0uY2xvc2VzdCgnLmRvdHMnKSkge1xyXG5cdFx0XHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXHJcblx0XHRcdFx0XHRcdGVsZW0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0b2dnbGUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGFyYW1zLmNvbGxhcHNlICYmIFJlc3BvbnNpdmUuY2hlY2sodGhpcykgJiYgcGFyYW1zLnBsYWNlbWVudCAhPT0gJ3ZlcnRpY2FsJykge1xyXG5cdFx0XHRzZXRDb2xsYXBzZSh0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ2FmdGVySW5pdCcgaW4gdGhpcy5fcGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUodGhpcy5fcGFyYW1zLmNhbGxiYWNrLmFmdGVySW5pdCwgW3RoaXNdKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqINCk0YPQvdC60YbQuNGPINGB0LLQvtGA0LDRh9C40LLQsNC90LjRj1xyXG5cdFx0ICogVE9ETyDQn9GA0LjQtNGD0LzQsNGC0Ywg0YfRgtC+INGC0L4g0YEg0LzQtdCz0LAg0LzQtdC90Y4sINC60L7RgtC+0YDQvtC1INGD0YXQvtC00LjRgiDQsiDQv9C+0LTQvNC10L3RjlxyXG5cdFx0ICogVE9ETyDQotCw0Log0LbQtSDQtdGB0YLRjCDQutC+0YHRj9C60Lgg0L/RgNC4INGA0LXRgdCw0LnQt9C1XHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIHNldENvbGxhcHNlKF90aGlzKSB7XHJcblx0XHRcdGxldCB3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUgPSBfdGhpcy5uYXZpZ2F0aW9uLmNsaWVudFdpZHRoLFxyXG5cdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gMCxcclxuXHRcdFx0XHQkZG90cyA9IFNlbGVjdG9ycy5maW5kKCcuZG90cycsIF90aGlzLm5hdmlnYXRpb24pLFxyXG5cdFx0XHRcdF9kb3RzID0gZ2V0U1ZHKCdkb3RzJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuJGxpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAkZG90cy5jbGllbnRXaWR0aFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgJGEgPSBTZWxlY3RvcnMuZmluZCgnYScsIF90aGlzLiRsaW5rc1swXSksXHJcblx0XHRcdFx0XHRcdCRsaW5rU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKCRhKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ0xlZnQgPSBub3JtYWxpemVEYXRhKCRsaW5rU3R5bGUucGFkZGluZ0xlZnQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0ID0gIG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nUmlnaHQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZyA9IHBhZGRpbmdMZWZ0ICsgcGFkZGluZ1JpZ2h0O1xyXG5cclxuXHRcdFx0XHRcdC8vIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0LLQtdGA0L3Qviwg0L3QviDQvNGLINGC0L7Rh9C90L4g0LfQvdCw0LXQvCDRiNC40YDQuNC90YMg0YLQvtGH0LXQuiDQsiBzdmcgLSAxNnB4XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHBhZGRpbmcgKyAxNjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAobGV0ICRsaW5rIG9mIF90aGlzLiRsaW5rcykge1xyXG5cdFx0XHRcdFx0bGV0IHdpZHRoID0gJGxpbmsuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlICsgd2lkdGg7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCh3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUpIDwgd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5wdXNoKCRsaW5rKTtcclxuXHRcdFx0XHRcdFx0JGxpbmsucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uaW5zZXJ0QmVmb3JlKF90aGlzLm1vdmVkTGlua3NbMF0sICRkb3RzKVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmFwcGVuZENoaWxkKF90aGlzLm1vdmVkTGlua3NbMF0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdF90aGlzLm1vdmVkTGlua3Muc3BsaWNlKDAsIDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGlmICghJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsJzxsaSBjbGFzcz1cImRyb3Bkb3duIGRvdHNcIj4nICsgJzxhIGhyZWY9XCIjXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JysgX2RvdHMgKyc8L2E+PC9saT4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdCRkb3RzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0ICRkID0gX3RoaXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuZG90cycpO1xyXG5cdFx0XHRcdGlmICgkZCAmJiBfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0bGV0ICRkcm9wZG93biA9ICRkLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XHJcblx0XHRcdFx0XHRpZiAoJGRyb3Bkb3duKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duLWNvbnRlbnQnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblxyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsaW5rIG9mIF90aGlzLm1vdmVkTGlua3MpIHtcclxuXHRcdFx0XHRcdFx0XHQkZHJvcGRvd24ucHJlcGVuZChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0JGQuYXBwZW5kQ2hpbGQoJGRyb3Bkb3duKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0bGV0IHRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoIXRhcmdldCB8fCBpc0Rpc2FibGVkKHRhcmdldCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bi1jb250ZW50JykpIHtcclxuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpcnN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGRyb3AgPSBTZWxlY3RvcnMuZmluZCgnLmRyb3Bkb3duLWNvbnRlbnQnLCB0YXJnZXQpLFxyXG5cdFx0XHRsaW5rID0gdGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuXHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcblx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRzZXREcm9wUG9zaXRpb24oZHJvcClcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIGRyb3AsIHRydWUsIDUwKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gJGRyb3BcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0RHJvcFBvc2l0aW9uKCRkcm9wKSB7XHJcblx0XHRcdGxldCB7d2lkdGgsIHJpZ2h0fSA9ICRkcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRcdHdpbmRvd193aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuXHRcdFx0bGV0IE5fcmlnaHQgPSB3aW5kb3dfd2lkdGggLSByaWdodCAtIHdpZHRoO1xyXG5cclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQnKTtcclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgnbGVmdCcpO1xyXG5cclxuXHRcdFx0bGV0ICRwYXJlbnQgPSAkZHJvcC5jbG9zZXN0KCdsaScpLFxyXG5cdFx0XHRcdCR1bCA9ICRwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgndWwnKTtcclxuXHJcblx0XHRcdGlmIChOX3JpZ2h0ID4gd2lkdGgpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0ICRlbCBvZiAkdWwpIHtcclxuXHRcdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRoaWRlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsZW1lbnQgPSByZWxhdGVkVGFyZ2V0LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0aWYgKCdlbG0nIGluIHJlbGF0ZWRUYXJnZXQgJiYgcmVsYXRlZFRhcmdldC5lbG0pIHtcclxuXHRcdFx0ZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQuZWxtXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQpIHtcclxuXHRcdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIoZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpcnN0JykpIHtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpcnN0Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLicgKyBDTEFTU19OQU1FX1NIT1csIGVsZW1lbnQpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0XHRcdGxldCBwYXJlbnQgPSBlbC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAocGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0FDVElWRSkpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0XHRpZiAobGluaykgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKGVsLCBFVkVOVF9LRVlfSElEREVOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIGVsLCB0cnVlLCA1MDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUT0RPINC10YHQu9C4INC90LAg0YHRgtGA0LDQvdC40YbQtSDQvdC10YHQutC+0LvRjNC60L4g0L3QsNCy0LjQs9Cw0YbQuNC5LCDRgtC+INC10YHRgtGMINC60L7RgdGP0LrQuFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCk7XHJcblxyXG5cdFx0bGV0IGRyb3BzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bicsIGluc3RhbmNlLl9uYXZpZ2F0aW9uKVxyXG5cclxuXHRcdGlmIChpbnN0YW5jZS5fcGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdFsuLi5kcm9wc10uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRsZXQgY3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbCwgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0VkdOYXYuaGlkZU9wZW5Ecm9wcyhldmVudCk7XHJcblxyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFpbnN0YW5jZS5uYXZpZ2F0aW9uLmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gdGFyZ2V0O1xyXG5cclxuXHRcdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0OiB0YXJnZXRcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpbnN0YW5jZS5zaG93KHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbCwgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKCFjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24nKSxcclxuXHRcdFx0XHRcdFx0ZWxtID0gY3VycmVudEVsZW07XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlbGF0ZWRUYXJnZXQgPT09IGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQgPSByZWxhdGVkVGFyZ2V0LnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCwgZWxtOiBlbG19KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgVkdOYXYuY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFNYW5pcHVsYXRvci5oYXModGhpcywgJ2FyaWEtZXhwYW5kZWQnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCdjbGljaycgaW4gaW5zdGFuY2UuX3BhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0ZXhlY3V0ZShpbnN0YW5jZS5fcGFyYW1zLmNhbGxiYWNrLmNsaWNrLCBbdGhpc10pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzLmNsb3Nlc3QoJy52Zy1uYXYnKSxcclxuXHRcdFx0XHRcdGlzRmlyc3QgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5maXJzdCcpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNEaXNhYmxlZCh0YXJnZXQpICYmICFpc1Zpc2libGUodGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGlzRmlyc3QgJiYgdGhpcy5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmFjdGl2ZScsIHNlbGYpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZWwgJiYgZWwgIT09IHRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGVsfSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KHtyZWxhdGVkVGFyZ2V0OiB0YXJnZXR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdmdOYXZTaWRlYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXItbmF2Jyk7XHJcblx0XHRsZXQgaGFtYnVyZ2VyID0gaW5zdGFuY2UuX2VsZW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyKTtcclxuXHJcblx0XHRpZiAodmdOYXZTaWRlYmFyICYmIGhhbWJ1cmdlcikge1xyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5zaG93JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLnBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuaGlkZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZShpbnN0YW5jZS5wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ecm9wcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpLmFjdGl2ZScpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR05hdi5nZXRJbnN0YW5jZSh0b2dnbGUuY2xvc2VzdCgnLnZnLW5hdicpKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSBjb250aW51ZTtcclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRvZ2dsZSB9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdHJlbGF0ZWRUYXJnZXQuY2xpY2tFdmVudCA9IGV2ZW50XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHQuaGlkZShyZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfUkVTSVpFX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoJy52Zy1uYXYnLCB7fSk7XHJcblx0aW5zdGFuY2UuYnVpbGQoKTtcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHTmF2OyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIGlzVmlzaWJsZSwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9vdmVyZmxvd1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdzaWRlYmFyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuc2lkZWJhcic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCJdJ1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdTaWRlYmFyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblx0XHR0aGlzLl9kaXNtaXNzRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihTZWxlY3RvcnMuZmluZCgnLnZnLWJhY2tkcm9wJyksICdtb3VzZWRvd24udmcuYmFja2Ryb3AnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlLCA1MClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHJldHVybjtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdTaWRlYmFyKTtcclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX0hJRERFTiwgKCkgPT4ge1xyXG5cdFx0aWYgKGlzVmlzaWJsZSh0aGlzKSkgdGhpcy5mb2N1cygpO1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0fSlcclxuXHJcblx0Y29uc3QgYWxyZWFkeU9wZW4gPSBTZWxlY3RvcnMuZmluZCgnLnZnLXNpZGViYXIuc2hvdycpXHJcblx0aWYgKGFscmVhZHlPcGVuICYmIGFscmVhZHlPcGVuICE9PSB0YXJnZXQpIHtcclxuXHRcdFZHU2lkZWJhci5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRjb25zdCBkYXRhID0gVkdTaWRlYmFyLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cdGRhdGEudG9nZ2xlKHRoaXMpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHU2lkZWJhcjtcclxuIiwiaW1wb3J0IHtleGVjdXRlfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi9vdmVyZmxvd1wiO1xyXG5cclxuY29uc3QgTkFNRSA9ICdiYWNrZHJvcCdcclxuY29uc3QgQ0xBU1NfTkFNRSA9ICd2Zy1iYWNrZHJvcCdcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnXHJcbmNvbnN0IEVWRU5UX01PVVNFRE9XTiA9IGBtb3VzZWRvd24udmcuJHtOQU1FfWBcclxuXHJcbmNsYXNzIEJhY2tkcm9wIHtcclxuXHRzdGF0aWMgc2hvdyhjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2FwcGVuZCgpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlKGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fZGVzdHJveSgpO1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2FwcGVuZCgpIHtcclxuXHRcdGlmIChTZWxlY3RvcnMuZmluZCgnLicgKyBDTEFTU19OQU1FKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUUpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKGJhY2tkcm9wKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpXHJcblx0XHR9LCA1MCk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGJhY2tkcm9wLCBFVkVOVF9NT1VTRURPV04sICgpID0+IHtcclxuXHRcdFx0QmFja2Ryb3AuaGlkZSgpXHJcblx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9kZXN0cm95KCkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBTZWxlY3RvcnMuZmluZCgnLicgKyBDTEFTU19OQU1FKTtcclxuXHRcdGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG5cclxuXHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZSgpO1xyXG5cdFx0fSwgNTAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhY2tkcm9wOyIsImltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIE92ZXJmbG93XHJcbiAqINCX0LDQv9GA0LXRidCw0LXRgiDRgdC60YDQvtC70LvQuNC90LMg0Lgg0YPQsdC40YDQsNC10YIg0LXQs9C+LCDQutC+0LzQv9C10L3RgdC40YDRg9GPINC+0YLRgdGC0YPQv9C+0LxcclxuICovXHJcblxyXG5jbGFzcyBPdmVyZmxvdyB7XHJcblx0c3RhdGljIGFwcGVuZCgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcblx0XHRsZXQgc3R5bGVzID0gTWFuaXB1bGF0b3IuZ2V0KGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdFx0aWYgKCFzdHlsZXMpIE1hbmlwdWxhdG9yLnJlbW92ZShkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJmbG93OyIsImltcG9ydCB7aXNFbGVtZW50LCBtZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuY2xhc3MgUGFyYW1zIHtcclxuXHRjb25zdHJ1Y3RvcihwYXJhbXMsIGVsZW1lbnQgPSBudWxsKSB7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLm1lcmdlKHBhcmFtcywgZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRnZXQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcGFyYW1zO1xyXG5cdH1cclxuXHJcblx0ZnJvbUVsZW1lbnQoZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIGlzRWxlbWVudChlbGVtZW50KSA/IE1hbmlwdWxhdG9yLmdldChlbGVtZW50KSA6IHt9O1xyXG5cdH1cclxuXHJcblx0bWVyZ2UocGFyYW1zLCBlbGVtZW50KSB7XHJcblx0XHRsZXQgbVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwYXJhbXMsIHRoaXMuZnJvbUVsZW1lbnQoZWxlbWVudCkpO1xyXG5cclxuXHRcdGZvciAobGV0IGtleSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdGlmIChrZXkuaW5kZXhPZignLScpICE9PSAtMSkge1xyXG5cdFx0XHRcdGxldCBrZXlzID0ga2V5LnNwbGl0KCctJyksXHJcblx0XHRcdFx0XHR2YWx1ZSA9IG5vcm1hbGl6ZURhdGEobVBhcmFtc1trZXldKTtcclxuXHJcblx0XHRcdFx0aWYgKGtleXNbMF0gaW4gbVBhcmFtcykge1xyXG5cdFx0XHRcdFx0aWYgKGtleXNbMV0gaW4gbVBhcmFtc1trZXlzWzBdXSkge1xyXG5cdFx0XHRcdFx0XHRtUGFyYW1zW2tleXNbMF1dW2tleXNbMV1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRkZWxldGUgbVBhcmFtc1trZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdwYXJhbXMnIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChtUGFyYW1zLCBtUGFyYW1zLnBhcmFtcyk7XHJcblx0XHRcdGRlbGV0ZSBtUGFyYW1zLnBhcmFtcztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbVBhcmFtcztcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhcmFtczsiLCJpbXBvcnQge21lcmdlRGVlcE9iamVjdCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgUGxhY2VtZW50LCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvNC10YHRgtC+0L/QvtC70L7QttC10L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0L3QsCDRgdGC0YDQsNC90LjRhtC1LlxyXG4gKiBUT0RPINC60LvQsNGB0YEg0L3QtSDQtNC+0L/QuNGB0LDQvVxyXG4gKi9cclxuXHJcbmNsYXNzIFBsYWNlbWVudCB7XHJcblx0Y29uc3RydWN0b3IoYXJnID0ge30pIHtcclxuXHRcdHRoaXMucGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0ZWxlbWVudDogbnVsbCxcclxuXHRcdFx0ZHJvcDogbnVsbFxyXG5cdFx0fSwgYXJnKTtcclxuXHR9XHJcblxyXG5cdF9nZXRQbGFjZW1lbnQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRjb25zdCBfcGFyZW50ID0gKHNlbGYpID0+IHtcclxuXHRcdFx0bGV0IHBhcmVudCA9IHNlbGYucGFyZW50Tm9kZSxcclxuXHRcdFx0XHRvdmVyZmxvdyA9IGdldENvbXB1dGVkU3R5bGUocGFyZW50KS5vdmVyZmxvdztcclxuXHJcblx0XHRcdGlmIChwYXJlbnQudGFnTmFtZSAhPT0gJ0JPRFknKSB7XHJcblx0XHRcdFx0aWYgKG92ZXJmbG93ID09PSAndmlzaWJsZScpIHtcclxuXHRcdFx0XHRcdF9wYXJlbnQocGFyZW50KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gcGFyZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBpc0ZpeGVkID0gZmFsc2UsIHRvcCwgbGVmdCxcclxuXHRcdFx0Ym91bmRzID0gX3RoaXMucGFyYW1zLmRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdHBhcmVudCA9IF90aGlzLnBhcmFtcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdGlmIChfcGFyZW50KF90aGlzLnBhcmFtcy5lbGVtZW50KSkge1xyXG5cdFx0XHRpc0ZpeGVkID0gdHJ1ZTtcclxuXHRcdFx0dG9wID0gYm91bmRzLnRvcDtcclxuXHRcdFx0bGVmdCA9IGJvdW5kcy5sZWZ0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoX3RoaXMucGFyYW1zLmRyb3ApO1xyXG5cdFx0XHR0b3AgPSBub3JtYWxpemVEYXRhKHN0eWxlcy50b3Auc2xpY2UoMCwgLTIpKTtcclxuXHRcdFx0bGVmdCA9IG5vcm1hbGl6ZURhdGEoc3R5bGVzLmxlZnQuc2xpY2UoMCwgLTIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoKGJvdW5kcy5sZWZ0ICsgYm91bmRzLndpZHRoKSA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdGxlZnQgPSBwYXJlbnQud2lkdGggLSBib3VuZHMud2lkdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXNGaXhlZDogaXNGaXhlZCxcclxuXHRcdFx0dG9wOiB0b3AsXHJcblx0XHRcdGxlZnQ6IGxlZnRcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYWNlbWVudDsiLCIvKipcclxuICog0JrQu9Cw0YHRgSBSZXNwb25zaXZlLCDRgNCw0LHQvtGC0LDQtdGCINC/0L4g0YLQsNC60LjQvCDQttC1INC80LXQtNC40LAg0YLQvtGH0LrQsNC8LCDRh9GC0L4g0LggYm9vdHN0cmFwXHJcbiAqINC4INC+0L/RgNC10LTQtdC70Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLlxyXG4gKi9cclxuXHJcbmNsYXNzIFJlc3BvbnNpdmUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5icmVha3BvaW50cyA9IHtcclxuXHRcdFx0eHM6IDAsXHJcblx0XHRcdHNtOiA1NzYsXHJcblx0XHRcdG1kOiA3NjgsXHJcblx0XHRcdGxnOiA5OTIsXHJcblx0XHRcdHhsOiAxMjAwLFxyXG5cdFx0XHR4eGw6IDE0MDAsXHJcblx0XHRcdHh4eGw6IDE2MDAsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JXRgdC70Lgg0L3QsNGI0LAg0YjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsCDRgdC+0LLQv9Cw0LTQsNC10YIg0YEg0LTQuNCw0L/QsNC30L7QvdC+0Lwg0LrQvtGC0L7RgNGL0Lkg0YPQutCw0LfQsNC9INCyINC80L7QtNGD0LvQtSDQstGL0LTQsNC10LwgdHJ1ZSwg0LjQvdCw0YfQtSBmYWxzZVxyXG5cdCAqIEBwYXJhbSBtb2R1bGVcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRzdGF0aWMgY2hlY2sobW9kdWxlKSB7XHJcblx0XHRsZXQgaW5zdGFuY2UgPSBuZXcgdGhpcyA7XHJcblx0XHRyZXR1cm4gaW5zdGFuY2UuZGVmaW5lKG1vZHVsZSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7QstC10YDRj9C10YIg0L3QsCDRgtCw0Ycg0YPRgdGC0YDQvtC50YHRgtCy0LAuIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0L/RgNCw0LLQuNC70YzQvdC+LCDQvdCw0LTQviDRgdC00LXQu9Cw0YLRjCDQv9C+LdC00YDRg9Cz0L7QvNGDXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrTW9iaWxlT3JUYWJsZXQoKSB7XHJcblx0XHRsZXQgY2hlY2sgPSBmYWxzZTtcclxuXHRcdChmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vfGFuZHJvaWR8aXBhZHxwbGF5Ym9va3xzaWxrL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnNsaWNlKDAsNCkpKXtcclxuXHRcdFx0XHRjaGVjayA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7XHJcblxyXG5cdFx0cmV0dXJuIGNoZWNrO1xyXG5cdH1cclxuXHJcblx0ZGVmaW5lKG1vZHVsZSkge1xyXG5cdFx0bGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGgsXHJcblx0XHRcdHJlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuX2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSksXHJcblx0XHRcdGJyZWFrcG9pbnRzID0gdGhpcy5icmVha3BvaW50cyxcclxuXHRcdFx0cG9pbnQgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cykuZmluZChrZXkgPT4gYnJlYWtwb2ludHNba2V5XSA9PT0gcmVzcG9uc2l2ZV9zaXplKTtcclxuXHJcblx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKSxcclxuXHRcdFx0bG9jID0ga2V5cy5pbmRleE9mKHBvaW50KTtcclxuXHJcblx0XHRyZXR1cm4gd2luZG93V2lkdGggPj0gYnJlYWtwb2ludHNba2V5c1tsb2MgKyAxXV07XHJcblx0fVxyXG5cclxuXHRfY2hlY2tSZXNwb25zaXZlQ2xhc3MobW9kdWxlKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IG1vZHVsZS5fZWxlbWVudCxcclxuXHRcdFx0cGFyYW1zID0gbW9kdWxlLl9wYXJhbXMsXHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gMDtcclxuXHJcblx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhYTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnh4eGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhYTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuTEcpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5sZztcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuTUQpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5tZDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuU00pKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5zbTtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFMpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54cztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54cztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY3VycmVudF9yZXNwb25zaXZlX3NpemVcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNpdmU7IiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBkYXRhLmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiDQodC60YDQuNC/0YIg0YDQsNCx0L7RgtCw0LXRgiDRgSDQutC+0LvQu9C10LrRhtC40LXQuSDQvNC+0LTRg9C70LXQuS4g0J/QvtC00YDQvtCx0L3QtdC1INGC0YPRgiBodHRwczovL2xlYXJuLmphdmFzY3JpcHQucnUvbWFwLXNldFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQmtC+0L3RgdGC0LDQvdGC0YtcclxuICovXHJcblxyXG5jb25zdCBlbGVtZW50TWFwID0gbmV3IE1hcCgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0c2V0KGVsZW1lbnQsIGtleSwgaW5zdGFuY2UpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgbmV3IE1hcCgpKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHRcdGlmICghaW5zdGFuY2VNYXAuaGFzKGtleSkgJiYgaW5zdGFuY2VNYXAuc2l6ZSAhPT0gMCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBWR0FwcCDQvdC1INC00L7Qv9GD0YHQutCw0LXRgiDQsdC+0LvQtdC1INC+0LTQvdC+0LPQviDRjdC60LfQtdC80L/Qu9GP0YDQsCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsC4g0KHQstGP0LfQsNC90L3Ri9C5INGN0LrQt9C10LzQv9C70Y/RgDogJHtBcnJheS5mcm9tKGluc3RhbmNlTWFwLmtleXMoKSlbMF19LmApXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLnNldChrZXksIGluc3RhbmNlKVxyXG5cdH0sXHJcblxyXG5cdGdldChlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmIChlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudE1hcC5nZXQoZWxlbWVudCkuZ2V0KGtleSkgfHwgbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0cmVtb3ZlKGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuZGVsZXRlKGtleSk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlTWFwLnNpemUgPT09IDApIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBldmVudC5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICog0KHQutGA0LjQv9GCINC00LvRjyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQmtC+0L3RgdGC0LDQvdGC0YtcclxuICovXHJcblxyXG5jb25zdCBuYW1lc3BhY2VSZWdleCA9IC9bXi5dKig/PVxcLi4qKVxcLnwuKi9cclxuY29uc3Qgc3RyaXBOYW1lUmVnZXggPSAvXFwuLiovXHJcbmNvbnN0IHN0cmlwVWlkUmVnZXggPSAvOjpcXGQrJC9cclxuY29uc3QgZXZlbnRSZWdpc3RyeSA9IHt9IC8vIEV2ZW50cyBzdG9yYWdlXHJcbmxldCB1aWRFdmVudCA9IDFcclxuY29uc3QgY3VzdG9tRXZlbnRzID0ge1xyXG5cdG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLFxyXG5cdG1vdXNlbGVhdmU6ICdtb3VzZW91dCdcclxufVxyXG5cclxuY29uc3QgbmF0aXZlRXZlbnRzID0gbmV3IFNldChbXHJcblx0J2NsaWNrJyxcclxuXHQnZGJsY2xpY2snLFxyXG5cdCdtb3VzZXVwJyxcclxuXHQnbW91c2Vkb3duJyxcclxuXHQnY29udGV4dG1lbnUnLFxyXG5cdCdtb3VzZXdoZWVsJyxcclxuXHQnRE9NTW91c2VTY3JvbGwnLFxyXG5cdCdtb3VzZW92ZXInLFxyXG5cdCdtb3VzZW91dCcsXHJcblx0J21vdXNlbW92ZScsXHJcblx0J3NlbGVjdHN0YXJ0JyxcclxuXHQnc2VsZWN0ZW5kJyxcclxuXHQnc3VibWl0JyxcclxuXHQna2V5ZG93bicsXHJcblx0J2tleXByZXNzJyxcclxuXHQna2V5dXAnLFxyXG5cdCdvcmllbnRhdGlvbmNoYW5nZScsXHJcblx0J3RvdWNoc3RhcnQnLFxyXG5cdCd0b3VjaG1vdmUnLFxyXG5cdCd0b3VjaGVuZCcsXHJcblx0J3RvdWNoY2FuY2VsJyxcclxuXHQncG9pbnRlcmRvd24nLFxyXG5cdCdwb2ludGVybW92ZScsXHJcblx0J3BvaW50ZXJ1cCcsXHJcblx0J3BvaW50ZXJsZWF2ZScsXHJcblx0J3BvaW50ZXJjYW5jZWwnLFxyXG5cdCdnZXN0dXJlc3RhcnQnLFxyXG5cdCdnZXN0dXJlY2hhbmdlJyxcclxuXHQnZ2VzdHVyZWVuZCcsXHJcblx0J2ZvY3VzJyxcclxuXHQnYmx1cicsXHJcblx0J2NoYW5nZScsXHJcblx0J3Jlc2V0JyxcclxuXHQnc2VsZWN0JyxcclxuXHQnc3VibWl0JyxcclxuXHQnZm9jdXNpbicsXHJcblx0J2ZvY3Vzb3V0JyxcclxuXHQnbG9hZCcsXHJcblx0J3VubG9hZCcsXHJcblx0J2JlZm9yZXVubG9hZCcsXHJcblx0J3Jlc2l6ZScsXHJcblx0J21vdmUnLFxyXG5cdCdET01Db250ZW50TG9hZGVkJyxcclxuXHQncmVhZHlzdGF0ZWNoYW5nZScsXHJcblx0J2Vycm9yJyxcclxuXHQnYWJvcnQnLFxyXG5cdCdzY3JvbGwnXHJcbl0pXHJcblxyXG4vKipcclxuICog0J/RgNC40LLQsNGC0L3Ri9C1INC80LXRgtC+0LTRi1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1ha2VFdmVudFVpZChlbGVtZW50LCB1aWQpIHtcclxuXHRyZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChlbGVtZW50KVxyXG5cclxuXHRlbGVtZW50LnVpZEV2ZW50ID0gdWlkXHJcblx0ZXZlbnRSZWdpc3RyeVt1aWRdID0gZXZlbnRSZWdpc3RyeVt1aWRdIHx8IHt9XHJcblxyXG5cdHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiBlbGVtZW50IH0pXHJcblxyXG5cdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgZm4pXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIFtldmVudF0pXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgZG9tRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcblxyXG5cdFx0Zm9yIChsZXQgeyB0YXJnZXQgfSA9IGV2ZW50OyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSB0aGlzOyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRvbUVsZW1lbnQgb2YgZG9tRWxlbWVudHMpIHtcclxuXHRcdFx0XHRpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogdGFyZ2V0IH0pXHJcblxyXG5cdFx0XHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBzZWxlY3RvciwgZm4pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkodGFyZ2V0LCBbZXZlbnRdKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kSGFuZGxlcihldmVudHMsIGNhbGxhYmxlLCBkZWxlZ2F0aW9uU2VsZWN0b3IgPSBudWxsKSB7XHJcblx0cmV0dXJuIE9iamVjdC52YWx1ZXMoZXZlbnRzKVxyXG5cdFx0LmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRjb25zdCBpc0RlbGVnYXRlZCA9IHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJ1xyXG5cdC8vIFRPRE86INCy0YvQtNCw0LXRgiBcImZhbHNlXCIg0LLQvNC10YHRgtC+INGB0LXQu9C10LrRgtC+0YDQsCwg0L/QvtGN0YLQvtC80YMg0L3Rg9C20L3QviDQv9GA0L7QstC10YDQuNGC0YwuIGJvb3RcclxuXHRjb25zdCBjYWxsYWJsZSA9IGlzRGVsZWdhdGVkID8gZGVsZWdhdGlvbkZ1bmN0aW9uIDogKGhhbmRsZXIgfHwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cdGxldCB0eXBlRXZlbnQgPSBnZXRUeXBlRXZlbnQob3JpZ2luYWxUeXBlRXZlbnQpXHJcblxyXG5cdGlmICghbmF0aXZlRXZlbnRzLmhhcyh0eXBlRXZlbnQpKSB7XHJcblx0XHR0eXBlRXZlbnQgPSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSGFuZGxlcihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBvbmVPZmYpIHtcclxuXHRpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRsZXQgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHJcblx0Ly8gaW4gY2FzZSBvZiBtb3VzZWVudGVyIG9yIG1vdXNlbGVhdmUgd3JhcCB0aGUgaGFuZGxlciB3aXRoaW4gYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBmb3IgaXRzIERPTSBwb3NpdGlvblxyXG5cdC8vIHRoaXMgcHJldmVudHMgdGhlIGhhbmRsZXIgZnJvbSBiZWluZyBkaXNwYXRjaGVkIHRoZSBzYW1lIHdheSBhcyBtb3VzZW92ZXIgb3IgbW91c2VvdXQgZG9lc1xyXG5cdGlmIChvcmlnaW5hbFR5cGVFdmVudCBpbiBjdXN0b21FdmVudHMpIHtcclxuXHRcdGNvbnN0IHdyYXBGdW5jdGlvbiA9IGZuID0+IHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghZXZlbnQucmVsYXRlZFRhcmdldCB8fCAoZXZlbnQucmVsYXRlZFRhcmdldCAhPT0gZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgIWV2ZW50LmRlbGVnYXRlVGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGFibGUgPSB3cmFwRnVuY3Rpb24oY2FsbGFibGUpXHJcblx0fVxyXG5cclxuXHRjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXHJcblx0Y29uc3QgaGFuZGxlcnMgPSBldmVudHNbdHlwZUV2ZW50XSB8fCAoZXZlbnRzW3R5cGVFdmVudF0gPSB7fSlcclxuXHRjb25zdCBwcmV2aW91c0Z1bmN0aW9uID0gZmluZEhhbmRsZXIoaGFuZGxlcnMsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxyXG5cclxuXHRpZiAocHJldmlvdXNGdW5jdGlvbikge1xyXG5cdFx0cHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgPSBwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiAmJiBvbmVPZmZcclxuXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChjYWxsYWJsZSwgb3JpZ2luYWxUeXBlRXZlbnQucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKVxyXG5cdGNvbnN0IGZuID0gaXNEZWxlZ2F0ZWQgP1xyXG5cdFx0Ym9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY2FsbGFibGUpIDpcclxuXHRcdGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgY2FsbGFibGUpXHJcblxyXG5cdGZuLmRlbGVnYXRpb25TZWxlY3RvciA9IGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGxcclxuXHRmbi5jYWxsYWJsZSA9IGNhbGxhYmxlXHJcblx0Zm4ub25lT2ZmID0gb25lT2ZmXHJcblx0Zm4udWlkRXZlbnQgPSB1aWRcclxuXHRoYW5kbGVyc1t1aWRdID0gZm5cclxuXHJcblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIGlzRGVsZWdhdGVkKVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpIHtcclxuXHRjb25zdCBmbiA9IGZpbmRIYW5kbGVyKGV2ZW50c1t0eXBlRXZlbnRdLCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblxyXG5cdGlmICghZm4pIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIEJvb2xlYW4oZGVsZWdhdGlvblNlbGVjdG9yKSlcclxuXHRkZWxldGUgZXZlbnRzW3R5cGVFdmVudF1bZm4udWlkRXZlbnRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgbmFtZXNwYWNlKSB7XHJcblx0Y29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxyXG5cclxuXHRmb3IgKGNvbnN0IFtoYW5kbGVyS2V5LCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XHJcblx0XHRpZiAoaGFuZGxlcktleS5pbmNsdWRlcyhuYW1lc3BhY2UpKSB7XHJcblx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50LmNhbGxhYmxlLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUeXBlRXZlbnQoZXZlbnQpIHtcclxuXHQvLyBhbGxvdyB0byBnZXQgdGhlIG5hdGl2ZSBldmVudHMgZnJvbSBuYW1lc3BhY2VkIGV2ZW50cyAoJ2NsaWNrLmJzLmJ1dHRvbicgLS0+ICdjbGljaycpXHJcblx0ZXZlbnQgPSBldmVudC5yZXBsYWNlKHN0cmlwTmFtZVJlZ2V4LCAnJylcclxuXHRyZXR1cm4gY3VzdG9tRXZlbnRzW2V2ZW50XSB8fCBldmVudFxyXG59XHJcblxyXG5mdW5jdGlvbiBoeWRyYXRlT2JqKG9iaiwgbWV0YSA9IHt9KSB7XHJcblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0YSkpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdG9ialtrZXldID0gdmFsdWVcclxuXHRcdH0gY2F0Y2gge1xyXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0Z2V0KCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG9ialxyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40Y9cclxuICogQHR5cGUge3tvbmUoKiwgKiwgKiwgKik6IHZvaWQsIHRyaWdnZXIoKiwgKiwgKik6IChudWxsfCopLCBvZmYoKiwgKiwgKiwgKik6IHZvaWQsIG9uKCosICosICosICopOiB2b2lkfX1cclxuICovXHJcbmNvbnN0IEV2ZW50SGFuZGxlciA9IHtcclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5ICjRjdC70LXQvNC10L3Rgiwg0YHQvtCx0YvRgtC40LUgKNC/0L7Qu9C90YvQuSDRgdC/0LjRgdC+0Log0YHQvNC+0YLRgNC4INCyINC60L7QvdGB0YLQsNC90YLQtSBuYXRpdmVFdmVudHMsINC40YHRgtC+0YfQvdC40Log0YHQvtCx0YvRgtC40Y8g0LjQu9C4INGF0LXQvdC00LvQtdGALCDRhNGD0L3QutGG0LjRjyDQvtCx0YDQsNGC0L3QvtCz0L4g0LLRi9C30L7QstCwKSlcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgZmFsc2UpXHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0YHQu9GD0YjQuNCy0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjQuSwg0L3QviDQt9Cw0LzRi9C60LDQtdGC0YHRjyDQuCDQsdC+0LvRjNGI0LUg0L3QtSDQv9C+0LLRgtC+0YDRj9C10YLRgdGPINC90LAg0Y3Qu9C10LzQtdC90YLQtVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b25lKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgdHJ1ZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQo9C00LDQu9C10L3QuNC1INC+0LHRgNCw0LHQvtGC0YfQuNC60LBcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9mZihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cdFx0Y29uc3QgaW5OYW1lc3BhY2UgPSB0eXBlRXZlbnQgIT09IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0XHRjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXHJcblx0XHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblx0XHRjb25zdCBpc05hbWVzcGFjZSA9IG9yaWdpbmFsVHlwZUV2ZW50LnN0YXJ0c1dpdGgoJy4nKVxyXG5cclxuXHRcdGlmICh0eXBlb2YgY2FsbGFibGUgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdC8vIFNpbXBsZXN0IGNhc2U6IGhhbmRsZXIgaXMgcGFzc2VkLCByZW1vdmUgdGhhdCBsaXN0ZW5lciBPTkxZLlxyXG5cdFx0XHRpZiAoIU9iamVjdC5rZXlzKHN0b3JlRWxlbWVudEV2ZW50KS5sZW5ndGgpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc05hbWVzcGFjZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnRFdmVudCBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XHJcblx0XHRcdFx0cmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgZWxlbWVudEV2ZW50LCBvcmlnaW5hbFR5cGVFdmVudC5zbGljZSgxKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3QgW2tleUhhbmRsZXJzLCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XHJcblx0XHRcdGNvbnN0IGhhbmRsZXJLZXkgPSBrZXlIYW5kbGVycy5yZXBsYWNlKHN0cmlwVWlkUmVnZXgsICcnKVxyXG5cclxuXHRcdFx0aWYgKCFpbk5hbWVzcGFjZSB8fCBvcmlnaW5hbFR5cGVFdmVudC5pbmNsdWRlcyhoYW5kbGVyS2V5KSkge1xyXG5cdFx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50LmNhbGxhYmxlLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDRgdC+0LHRi9GC0LjRjy4g0J/QvtC00YDQvtCx0L3QtdC1INGC0YPRgiBodHRwczovL2xlYXJuLmphdmFzY3JpcHQucnUvZGlzcGF0Y2gtZXZlbnRzXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gYXJnc1xyXG5cdCAqIEByZXR1cm5zIHsqfG51bGx9XHJcblx0ICovXHJcblx0dHJpZ2dlcihlbGVtZW50LCBldmVudCwgYXJncykge1xyXG5cdFx0aWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYnViYmxlcyA9IHRydWU7XHJcblx0XHRsZXQgbmF0aXZlRGlzcGF0Y2ggPSB0cnVlO1xyXG5cdFx0bGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdCBldnQgPSBoeWRyYXRlT2JqKG5ldyBFdmVudChldmVudCwgeyBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlIH0pLCBhcmdzKVxyXG5cclxuXHRcdGlmIChkZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hdGl2ZURpc3BhdGNoKSB7XHJcblx0XHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGV2dFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXHJcbiIsImltcG9ydCB7aXNFbGVtZW50LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDQsNGC0YDQuNCx0YPRgtCw0LzQuCDRgyDRjdC70LXQvNC10L3RgtCwOlxyXG4gKiBnZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINGE0LvQsNCzIC0g0LLRi9GA0LXQt9Cw0YLRjCBkYXRhLSkgLSDQvNC10YLQvtC0INCy0YvQsdC40YDQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQsNGC0YDQuNCx0YPRgtCwINC/0L4g0LXQs9C+INC40LzQtdC90LgsINC10YHQu9C4INCyINC/0L7Qu9C1INC40LzQtdC90Lgg0L/QtdGA0LXQtNCw0YLRjCAnZGF0YScgLT4g0LHRg9C00YPRgiDQstGL0LHRgNCw0L3RiyDRgtC+0LvRjNC60L4g0LTQsNGC0LAg0LDRgtGA0LjQsdGD0YLRiywg0LXRgdC70LggJ2FsbCcgLT4g0LzQtdGC0L7QtCDQstC10YDQvdC10YIg0LfQvdCw0YfQtdC90LjQtSDQstGB0LXRhSDQsNGC0YDQuNCx0YPRgtC+0LJcclxuICogaGFzICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPKSAtINC10YHRgtGMINC70Lgg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKiBzZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINC30L3QsNGH0LXQvdC40LUpIC0g0YPRgdGC0LDQvdC+0LLQutCwINGDINGN0LvQtdC80LXQvdGC0LAg0LDRgtGA0LjQsdGD0YLQsCDQuNC70Lgg0LXQs9C+INC40LfQvNC10L3QtdC90LjQtVxyXG4gKiByZW1vdmUgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0YPQtNCw0LvRj9C10YIg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0KGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUgPSAnZGF0YScsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdkYXRhJykge1xyXG5cdFx0XHRsZXQgZWxtQmFzZSA9IFsnZGF0YS12Zy10b2dnbGUnLCAnZGF0YS12Zy10YXJnZXQnLCAnZGF0YS12Zy1kaXNtaXNzJ10sXHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IHt9O1xyXG5cclxuXHRcdFx0bGV0IGFyciA9IFtdLmZpbHRlci5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24gKGF0KSB7XHJcblx0XHRcdFx0cmV0dXJuIC9eZGF0YS0vLnRlc3QoYXQubmFtZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdFx0bGV0IG5hbWUgPSB2Lm5hbWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpc1JlbW92ZURhdGFOYW1lKSBuYW1lID0gbmFtZS5zbGljZSg1KTtcclxuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1tuYW1lXSA9IG5vcm1hbGl6ZURhdGEodi52YWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZU5hbWVzKCkucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gey4uLmFjYywgW25hbWVdOiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKX07XHJcblx0XHRcdH0sIHt9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRoYXMoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdH0sXHJcblxyXG5cdHNldChlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lKSB7XHJcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5pcHVsYXRvcn1cclxuIiwiLyoqXHJcbiAqINCg0LDQsdC+0YLQsCDRgSBET01cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuaW1wb3J0IHtpc0VsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbmNvbnN0IHBhcnNlU2VsZWN0b3IgPSBzZWxlY3RvciA9PiB7XHJcblx0aWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3JcclxufVxyXG5cclxuY29uc3QgZ2V0U2VsZWN0b3IgPSBlbGVtZW50ID0+IHtcclxuXHRsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS12Zy10YXJnZXQnKTtcclxuXHJcblx0aWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcblx0XHRsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcblx0XHRpZiAoIWhyZWZBdHRyaWJ1dGUgfHwgKCFocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnLicpKSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG5cdFx0XHRocmVmQXR0cmlidXRlID0gYCMke2hyZWZBdHRyaWJ1dGUuc3BsaXQoJyMnKVsxXX1gO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGw7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3IgPyBzZWxlY3Rvci5zcGxpdCgnLCcpLm1hcChzZWwgPT4gcGFyc2VTZWxlY3RvcihzZWwpKS5qb2luKCcsJykgOiBudWxsO1xyXG59XHJcblxyXG5jb25zdCBTZWxlY3RvcnMgPSB7XHJcblx0ZmluZChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcclxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3Rvcik7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZmluZEFsbChzZWxlY3RvciwgY29udGFpbmVyID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChjb250YWluZXIsIHNlbGVjdG9yKSk7XHJcblx0fSxcclxuXHJcblx0Z2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpO1xyXG5cdFx0aWYgKHNlbGVjdG9yKSByZXR1cm4gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IpID8gc2VsZWN0b3IgOiBudWxsXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH0sXHJcblxyXG5cdGdldEVsZW1lbnRGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KTtcclxuXHRcdHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9ycy5maW5kKHNlbGVjdG9yKSA6IG51bGxcclxuXHR9LFxyXG5cclxuXHRnZXRNdWx0aXBsZUVsZW1lbnRzRnJvbVNlbGVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IgPyBTZWxlY3RvcnMuZmluZEFsbChzZWxlY3RvcikgOiBbXVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JzOyIsIi8qKlxyXG4gKiDQndCw0LHQvtGAINGB0LrRgNC40L/RgtC+0LIg0LTQu9GPINGI0LjRgNC+0LrQvtCz0L4g0L/RgNC40LzQtdC90LXQvdC40Y9cclxuICovXHJcblxyXG4vKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0VsZW1lbnRcclxuICogQHBhcmFtIG9iamVjdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XHJcblx0aWYgKCFpc09iamVjdChvYmplY3QpKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdHJldHVybiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xyXG59XHJcblxyXG4vKipcclxuICogaXNEaXNhYmxlZFxyXG4gKiBAcGFyYW0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRGlzYWJsZWQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGVsZW1lbnQuZGlzYWJsZWQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVmlzaWJsZSAoZWxlbWVudCkge1xyXG5cdGlmICghaXNFbGVtZW50KGVsZW1lbnQpIHx8IGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPT09IDApIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZWxlbWVudElzVmlzaWJsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgndmlzaWJpbGl0eScpID09PSAndmlzaWJsZSdcclxuXHRjb25zdCBjbG9zZWREZXRhaWxzID0gZWxlbWVudC5jbG9zZXN0KCdkZXRhaWxzOm5vdChbb3Blbl0pJylcclxuXHJcblx0aWYgKCFjbG9zZWREZXRhaWxzKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG5cdH1cclxuXHJcblx0aWYgKGNsb3NlZERldGFpbHMgIT09IGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHN1bW1hcnkgPSBlbGVtZW50LmNsb3Nlc3QoJ3N1bW1hcnknKVxyXG5cdFx0aWYgKHN1bW1hcnkgJiYgc3VtbWFyeS5wYXJlbnROb2RlICE9PSBjbG9zZWREZXRhaWxzKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzdW1tYXJ5ID09PSBudWxsKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzT2JqZWN0XHJcbiAqIEBwYXJhbSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcclxuXHRyZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstC+0LTQuNC8INCyINC/0L7RgNGP0LTQvtC6INGC0LjQv9GLINC00LDQvdC90YvRhVxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHJldHVybnMge2FueX1cclxuICovXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGEodmFsdWUpICB7XHJcblx0aWYgKHZhbHVlID09PSAndHJ1ZScpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSBOdW1iZXIodmFsdWUpLnRvU3RyaW5nKCkpIHtcclxuXHRcdHJldHVybiBOdW1iZXIodmFsdWUpXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnbnVsbCcpIHtcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG5cclxuXHR0cnkge1xyXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcclxuXHR9IGNhdGNoIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCj0LTQsNC70Y/QtdC8INGN0LvQtdC80LXQvdGC0Ysg0YEg0LzQsNGB0YHQuNCy0LBcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcGFyYW0gZWxcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRBcnJheShhcnIsIGVsKSB7XHJcblx0cmV0dXJuIGFyci5maWx0ZXIoKGl0ZW0pID0+ICFlbC5pbmNsdWRlcyhpdGVtKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQk9C70YPQsdC+0LrQvtC1INC+0LHRitC10LTQuNC90LXQvdC40LUg0L7QsdGK0LXQutGC0L7QslxyXG4gKiBAcGFyYW0gb2JqZWN0c1xyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIG1lcmdlRGVlcE9iamVjdCguLi5vYmplY3RzKSB7XHJcblx0Y29uc3QgaXNPYmplY3QgPSBvYmogPT4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xyXG5cclxuXHRyZXR1cm4gb2JqZWN0cy5yZWR1Y2UoKHByZXYsIG9iaikgPT4ge1xyXG5cdFx0T2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcblx0XHRcdGNvbnN0IHBWYWwgPSBwcmV2W2tleV07XHJcblx0XHRcdGNvbnN0IG9WYWwgPSBvYmpba2V5XTtcclxuXHJcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBWYWwpICYmIEFycmF5LmlzQXJyYXkob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBwVmFsLmNvbmNhdCguLi5vVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChpc09iamVjdChwVmFsKSAmJiBpc09iamVjdChvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG1lcmdlRGVlcE9iamVjdChwVmFsLCBvVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBvVmFsO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcHJldjtcclxuXHR9LCB7fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFja1xyXG4gKiBAcGFyYW0gcG9zc2libGVDYWxsYmFja1xyXG4gKiBAcGFyYW0gYXJnc1xyXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gZXhlY3V0ZShwb3NzaWJsZUNhbGxiYWNrLCBhcmdzID0gW10sIGRlZmF1bHRWYWx1ZSA9IHBvc3NpYmxlQ2FsbGJhY2spIHtcclxuXHRyZXR1cm4gdHlwZW9mIHBvc3NpYmxlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBwb3NzaWJsZUNhbGxiYWNrKC4uLmFyZ3MpIDogZGVmYXVsdFZhbHVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2l0aW9uXHJcbiAqIEBwYXJhbSBjYWxsYmFja1xyXG4gKiBAcGFyYW0gdHJhbnNpdGlvbkVsZW1lbnRcclxuICogQHBhcmFtIHdhaXRGb3JUcmFuc2l0aW9uXHJcbiAqL1xyXG5jb25zdCBUUkFOU0lUSU9OX0VORCA9ICd0cmFuc2l0aW9uZW5kJztcclxuY29uc3QgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwO1xyXG5cclxuZnVuY3Rpb24gZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiAoY2FsbGJhY2ssIHRyYW5zaXRpb25FbGVtZW50LCB3YWl0Rm9yVHJhbnNpdGlvbiA9IHRydWUsIHRpbWVPdXRNcykge1xyXG5cdGlmICghd2FpdEZvclRyYW5zaXRpb24pIHtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGNvbnN0IGR1cmF0aW9uUGFkZGluZyA9IDVcclxuXHRjb25zdCBlbXVsYXRlZER1cmF0aW9uID0gdGltZU91dE1zID8gdGltZU91dE1zIDogZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQodHJhbnNpdGlvbkVsZW1lbnQpICsgZHVyYXRpb25QYWRkaW5nO1xyXG5cclxuXHRsZXQgY2FsbGVkID0gZmFsc2VcclxuXHJcblx0Y29uc3QgaGFuZGxlciA9ICh7IHRhcmdldCB9KSA9PiB7XHJcblx0XHRpZiAodGFyZ2V0ICE9PSB0cmFuc2l0aW9uRWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsZWQgPSB0cnVlXHJcblx0XHR0cmFuc2l0aW9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHR9XHJcblxyXG5cdHRyYW5zaXRpb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRpZiAoIWNhbGxlZCkge1xyXG5cdFx0XHR0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRWxlbWVudClcclxuXHRcdH1cclxuXHR9LCBlbXVsYXRlZER1cmF0aW9uKVxyXG59XHJcblxyXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xyXG5cdGlmICghZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIEdldCB0cmFuc2l0aW9uLWR1cmF0aW9uIG9mIHRoZSBlbGVtZW50XHJcblx0bGV0IHsgdHJhbnNpdGlvbkR1cmF0aW9uLCB0cmFuc2l0aW9uRGVsYXkgfSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXHJcblxyXG5cdGNvbnN0IGZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKVxyXG5cdGNvbnN0IGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KVxyXG5cclxuXHQvLyBSZXR1cm4gMCBpZiBlbGVtZW50IG9yIHRyYW5zaXRpb24gZHVyYXRpb24gaXMgbm90IGZvdW5kXHJcblx0aWYgKCFmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiAmJiAhZmxvYXRUcmFuc2l0aW9uRGVsYXkpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBJZiBtdWx0aXBsZSBkdXJhdGlvbnMgYXJlIGRlZmluZWQsIHRha2UgdGhlIGZpcnN0XHJcblx0dHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KCcsJylbMF1cclxuXHR0cmFuc2l0aW9uRGVsYXkgPSB0cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywnKVswXVxyXG5cclxuXHRyZXR1cm4gKE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbikgKyBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpKSAqIE1JTExJU0VDT05EU19NVUxUSVBMSUVSXHJcbn1cclxuXHJcbmNvbnN0IHRyaWdnZXJUcmFuc2l0aW9uRW5kID0gZWxlbWVudCA9PiB7XHJcblx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChUUkFOU0lUSU9OX0VORCkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQotGA0Y7QuiDQtNC70Y8g0L/QtdGA0LXQt9Cw0L/Rg9GB0LrQsCDQsNC90LjQvNCw0YbQuNC4INGN0LvQtdC80LXQvdGC0LBcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJuIHZvaWRcclxuICpcclxuICogQNGB0LzQvtGC0YDQuCBodHRwczovL3d3dy5jaGFyaXN0aGVvLmlvL2Jsb2cvMjAyMS8wMi9yZXN0YXJ0LWEtY3NzLWFuaW1hdGlvbi13aXRoLWphdmFzY3JpcHQvI3Jlc3RhcnRpbmctYS1jc3MtYW5pbWF0aW9uXHJcbiAqL1xyXG5jb25zdCByZWZsb3cgPSBlbGVtZW50ID0+IHtcclxuXHRlbGVtZW50Lm9mZnNldEhlaWdodCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xyXG59XHJcblxyXG4vKipcclxuICogTm9vcFxyXG4gKi9cclxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xyXG5cclxuLyoqXHJcbiAqINCT0LXQvdC10YDQsNGG0LjRjyDRgdC70YPRh9Cw0LnQvdC+0Lkg0YHRgtGA0L7QutC4XHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlUmFuZG9tU3RyaW5nKGxlbmd0aCA9IDcpIHtcclxuXHRsZXQgcmVzdWx0ID0gJyc7XHJcblx0Y29uc3QgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XHJcblx0Y29uc3QgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xyXG5cdGxldCBjb3VudGVyID0gMDtcclxuXHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xyXG5cdFx0cmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcclxuXHRcdGNvdW50ZXIgKz0gMTtcclxuXHR9XHJcblx0cmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IHtpc0VsZW1lbnQsIGlzVmlzaWJsZSwgaXNEaXNhYmxlZCwgaXNPYmplY3QsIGlzRW1wdHlPYmosIG1lcmdlRGVlcE9iamVjdCwgcmVtb3ZlRWxlbWVudEFycmF5LCBub3JtYWxpemVEYXRhLCBleGVjdXRlLCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCByZWZsb3csIG5vb3AsIG1ha2VSYW5kb21TdHJpbmd9IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBjc3Mg0LrQu9Cw0YHRgdGLINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbmltcG9ydCBcIi4vYXBwL3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzXCI7XHJcblxyXG4vLyB2Z3NpZGViYXJcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzc1wiO1xyXG5pbXBvcnQgVkdTaWRlYmFyIGZyb20gXCIuL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9qcy92Z3NpZGViYXJcIjtcclxuXHJcbi8vIHZnY29sbGFwc2VcclxuaW1wb3J0IFZHQ29sbGFwc2UgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlXCI7XHJcblxyXG4vLyBuYXZcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3NcIjtcclxuaW1wb3J0IFZHTmF2IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2XCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3NcIjtcclxuaW1wb3J0IFZHRHJvcGRvd24gZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duXCI7XHJcblxyXG4vLyBtb2RhbFxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZHTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdtb2RhbC9qcy92Z21vZGFsXCI7XHJcblxyXG4vLyBmb3JtIHNlbmRlclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9zY3NzL3ZnZm9ybXNlbmRlci5zY3NzXCI7XHJcbmltcG9ydCBWR0Zvcm1TZW5kZXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlclwiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXIsIFZHQ29sbGFwc2UsIFZHTmF2LCBWR0Ryb3Bkb3duLCBWR01vZGFsLCBWR0Zvcm1TZW5kZXJcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=