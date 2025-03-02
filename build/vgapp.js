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
    if (!this._element) {
      throw new Error('Товарищ! Первый параметр не должен быть пустым!');
    }
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
      setData(data.response);
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
    x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    x.onreadystatechange = function () {
      if (x.readyState === 4) {
        switch (x.status) {
          case 200:
            callback('success', {
              text: x.statusText,
              response: x.responseText,
              code: x.status
            });
            break;
          default:
            callback('error', {
              text: x.statusText,
              response: x.responseText,
              code: x.status
            });
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
    let defaultParams = {
      offset: [0, 2],
      over: false,
      backdrop: true,
      overflow: true,
      keyboard: true,
      placement: 'bottom',
      animation: true,
      timeoutAnimation: 350,
      hover: false,
      ajax: {
        route: '',
        target: '',
        method: 'get'
      }
    };
    if ('offset' in params && Array.isArray(params.offset)) {
      defaultParams.offset = params.offset;
    }
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)(defaultParams, params));
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
/* harmony import */ var _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../utils/js/components/backdrop */ "./app/utils/js/components/backdrop.js");










/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.fs';

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
    _this._params.ajax.data = data;
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isObject)(data)) {
      if ('code' in data && data.code && data.code === 200) {
        if ('response' in data && data.response) {
          let response = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)(data.response);
          if (typeof response === 'string') {
            if (response.indexOf("Parse error") !== -1 || response.indexOf("syntax error") !== -1) {
              status = 'error';
              data = {
                response: {
                  title: 'Error',
                  message: 'Something went wrong, please repeat later'
                },
                text: 'Something went wrong, please repeat later'
              };
            }
          } else {
            if ('errors' in response && (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)(response.errors)) {
              status = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)(response.errors) ? 'error' : 'success';
            }
          }
        }
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
    let id = _this._params.classes.general + '-' + (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.makeRandomString)();
    let $modal = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.' + _this._params.classes.alertModal);
    if ($modal) $modal.remove();
    setTimeout(() => {
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
    }, 300);
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isObject)(data)) {
      if (status === 'error') {
        if ('code' in data && data.code !== 200) {
          if ('text' in data && !data.text) {
            data.text = 'Something went wrong, please repeat later';
            switch (data.code) {
              case 400:
                data.text = 'Bad Request';
                break;
              case 401:
                data.text = 'Unauthorized';
                break;
              case 403:
                data.text = 'Unauthorized';
                break;
              case 413:
                data.text = 'Forbidden';
                break;
              case 404:
                data.text = 'Not Found';
                break;
              case 422:
                data.text = 'Unprocessable Entity';
                break;
              case 500:
                data.text = 'Internal Server Error';
                break;
              case 504:
                data.text = 'Gateway Timeout';
                break;
            }
          }
        }
      }
      if ('response' in data) {
        let response = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)(data.response),
          title = '',
          txt = '',
          code = '';
        if (typeof response !== 'string') {
          if (!('view' in response)) {
            if ('title' in response) title = response.title;
            if (status === 'error' && data.code !== 200) {
              code = ' ' + data.text + ' (' + data.code + ')';
            }
            txt += '<h4 class="vg-alert-content--title">' + title + code + '</h4>';
            if ('message' in response) {
              txt += '<div class="vg-alert-content--message">' + response.message + '</div>';
            }
            if ('errors' in response) {
              let errors = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.normalizeData)(response.errors) || null;
              if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isObject)(errors)) {
                for (const error in errors) {
                  if (Array.isArray(errors[error])) {
                    errors[error].forEach(function (t) {
                      txt += '<div>' + t + '</div>';
                    });
                  } else {
                    txt = '<div>' + errors[error] + '</div>';
                  }
                }
              }
            }
            data = {
              view: txt
            };
          }
        } else {
          data.view = response;
        }
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
      text.innerHTML = data.view;
      content.append(text);
      $alert.append(content);
    } else {
      let text = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.vg-alert-content--text', $alert);
      text.innerHTML = data.view;
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

    // TODO доделать
    /*if (Array.isArray(instance._params.ajax.fields) && instance._params.ajax.fields.length) {
    	data = collectData(data, instance._params.ajax.fields);
    }*/

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
/* harmony import */ var _utils_js_components_scrollbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/components/scrollbar */ "./app/utils/js/components/scrollbar.js");
/* harmony import */ var _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/components/backdrop */ "./app/utils/js/components/backdrop.js");
/* harmony import */ var _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/components/overflow */ "./app/utils/js/components/overflow.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_components_animation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../utils/js/components/animation */ "./app/utils/js/components/animation.js");












/**
 * Constants
 */
const NAME = 'modal';
const NAME_KEY = 'vg.modal';
const ESCAPE_KEY = 'Escape';
const OPEN_SELECTOR = '.vg-modal.show';
const SELECTOR_DIALOG = '.vg-modal-dialog';
const SELECTOR_MODAL_BODY = '.vg-modal-body';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="modal"]';
const CLASS_NAME_OPEN = 'vg-modal-open';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_STATIC = 'vg-modal-static';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_RESIZE = `${NAME_KEY}.resize`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_MOUSEDOWN_DISMISS = `mousedown.dismiss${NAME_KEY}`;
const EVENT_KEY_CLICK_DISMISS = `click.dismiss${NAME_KEY}`;
class VGModal extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_7__.mergeDeepObject)({
      backdrop: true,
      focus: true,
      keyboard: true,
      fields: [],
      ajax: {
        route: '',
        target: '',
        method: 'get',
        loader: false
      },
      animation: {
        in: 'animate__backInUp',
        out: 'animate__backOutUp',
        duration: 1000,
        delay: 1000,
        repeat: 1
      },
      classes: {
        general: 'vg-modal',
        dialog: 'vg-modal-dialog',
        content: 'vg-modal-content',
        header: 'vg-modal-header',
        title: 'vg-modal-title',
        body: 'vg-modal-body',
        footer: 'vg-modal-footer'
      }
    }, params));
    this._button = null;
    this._dialog = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find(SELECTOR_DIALOG, this._element);
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new _utils_js_components_scrollbar__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this._addEventListeners();
    this._dismissElement();
    this._animation();
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
    _element.classList.add('vg-modal', 'fade');
    _element.id = id;
    let dialog = document.createElement('div');
    dialog.classList.add('vg-modal-dialog');
    let content = document.createElement('div');
    content.classList.add('vg-modal-content');
    let btnClose = document.createElement('button');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.set(btnClose, 'type', 'button');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.set(btnClose, 'data-vg-dismiss', 'modal');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.set(btnClose, 'data-vg-target', '#' + id);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.set(btnClose, 'aria-label', 'close');
    btnClose.classList.add('vg-btn-close');
    content.append(btnClose);
    let body = document.createElement('div');
    body.classList.add('vg-modal-body');
    content.append(body);
    dialog.append(content);
    _element.append(dialog);
    document.body.append(_element);
    const modal = VGModal.getOrCreateInstance(_element, params);
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_7__.execute)(callback, [modal]);
  }
  toggle(relatedTarget) {
    return !this._isShown ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_7__.isDisabled)(_this._element)) return;
    this._route();
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    this._isShown = true;
    this._isTransitioning = true;
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._addFieldsInModal(relatedTarget);
    this._adjustDialog();
    _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].show(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) return;
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    this._isShown = false;
    this._isTransitioning = true;
    this._animation();
    setTimeout(() => {
      this._element.classList.remove(CLASS_NAME_SHOW);
      this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
    }, 800);
  }
  _hideModal() {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
    });
  }
  _showElement(relatedTarget) {
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }
    this._element.style.display = 'block';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.scrollTop = 0;
    const modalBody = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_7__.reflow)(this._element);
    this._element.classList.add(CLASS_NAME_SHOW);
    const transitionComplete = () => {
      this._isTransitioning = false;
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE);
  }
  _animation() {
    if (!this._isAnimated()) {
      let animation = new _utils_js_components_animation__WEBPACK_IMPORTED_MODULE_9__["default"](this._element, this._params.animation);
      animation.toggle();
    }
  }
  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_7__.isRTL)() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_7__.isRTL)() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }
  _addEventListeners() {
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(this._element, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) return;
      if (this._params.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(window, EVENT_KEY_RESIZE, () => {
      if (this._isShown && !this._isTransitioning) this._adjustDialog();
    });
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(this._element, EVENT_KEY_MOUSEDOWN_DISMISS, event => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].one(this._element, EVENT_KEY_CLICK_DISMISS, event2 => {
        if (this._element !== event.target || this._element !== event2.target) return;
        if (this._params.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }
        if (this._params.backdrop) {
          this.hide();
        }
      });
    });
  }
  _triggerBackdropTransition() {
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
    if (hideEvent.defaultPrevented) return;
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY;
    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) return;
    if (!isModalOverflowing) this._element.style.overflowY = 'hidden';
    this._element.classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);
  }
  _addFieldsInModal(relatedTarget) {
    this._params = this._getParams(relatedTarget, this._params);
    if (!this._params.fields.length) return;
    this._params.fields.forEach(function (item) {
      if (!'name' in item && !'value' in item) return;
      let elements = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].findAll('[data-' + item.name + ']');
      if (!elements.length) return;
      for (const elm of elements) {
        switch (elm.tagName) {
          case 'INPUT':
            elm.value = item.value;
            break;
          case 'IMG':
            _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_6__.Manipulator.set(elm, 'src', item.value);
            break;
          default:
            elm.innerHTML = item.value;
        }
      }
    });
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_8__.dismissTrigger)(VGModal);

/**
 * Data API implementation
 */

_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) event.preventDefault();
  _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].one(target, EVENT_KEY_SHOW, showEvent => {
    if (showEvent.defaultPrevented) return;
  });
  const alreadyOpen = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find(OPEN_SELECTOR);
  if (alreadyOpen) VGModal.getInstance(alreadyOpen).hide();
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
      breakpoint: false,
      placement: 'horizontal',
      classes: {
        hamburgerActive: 'vg-nav-hamburger-active',
        hamburgerAlways: 'vg-nav-hamburger-always',
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
        enable: true,
        always: false,
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
    if (!params.breakpoint) {
      params.expand = false;
    }
    if (!params.hamburger.always) {
      if (!params.breakpoint || !params.expand) {
        this._element.classList.add(params.classes.expand);
      } else if (params.breakpoint !== false) {
        this._element.classList.add('vg-nav-' + params.breakpoint);
      }
    } else {
      this._element.classList.add(params.classes.hamburgerAlways);
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
        hamburger.classList.add(instance._params.classes.hamburgerActive);
      });
      vgNavSidebar.addEventListener('vg.sidebar.hide', function () {
        hamburger.classList.remove(instance._params.classes.hamburgerActive);
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

/***/ "./app/modules/vgrollup/js/vgrollup.js":
/*!*********************************************!*\
  !*** ./app/modules/vgrollup/js/vgrollup.js ***!
  \*********************************************/
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
const NAME = 'rollup';
const NAME_KEY = 'vg.rollup';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_HIDE = 'd-none';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="rollup"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGRollup extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({}, params));
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }

  /**
   * Инициализация
   * @param element
   * @param params
   */
  static init(element, params = {}) {
    const instance = VGRollup.getOrCreateInstance(element, params);
    instance.build();
  }
  build() {}
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {}
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
}

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].getElementFromSelector(this);
  if (!target) return;
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  const data = VGRollup.getOrCreateInstance(target);
  data.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGRollup);

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
    //if (isVisible(this)) this.focus();
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

/***/ "./app/utils/js/components/animation.js":
/*!**********************************************!*\
  !*** ./app/utils/js/components/animation.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");


/**
 * Классы для анимаций смотрим здесь
 * https://animate.style/
 */
class Animation {
  constructor(element, params = {}) {
    this._params = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)({
      in: 'animate__backInUp',
      out: 'animate__backOutUp',
      duration: 1000,
      delay: 1000,
      repeat: 1
    }, params);
    this._element = element;
    if (!this._element.classList.contains('animate__animated')) {
      this._element.classList.add('animate__animated');
    }
  }
  toggle() {
    if (this._element.classList.contains(this._params.in)) {
      this.out();
    } else {
      this.in();
    }
  }
  in(callback) {
    this._element.classList.remove(this._params.out);
    this._element.classList.add(this._params.in);
  }
  out(callback) {
    this._element.classList.remove(this._params.in);
    this._element.classList.add(this._params.out);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Animation);

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
    }, 100);
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

/***/ "./app/utils/js/components/scrollbar.js":
/*!**********************************************!*\
  !*** ./app/utils/js/components/scrollbar.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/manipulator */ "./app/utils/js/dom/manipulator.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");
/* harmony import */ var _dom_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom/selectors */ "./app/utils/js/dom/selectors.js");
/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */





/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';

/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  // Public
  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
  }
  reset() {
    this._resetElementAttributes(this._element, 'overflow');
    this._resetElementAttributes(this._element, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }

  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');
    this._element.style.overflow = 'hidden';
  }
  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.get(element, styleProperty, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = element => {
      const value = _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.get(element, styleProperty);
      // We only want to remove the property if the value is `null`; the value can also be zero
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }
      _dom_manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.remove(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if ((0,_functions__WEBPACK_IMPORTED_MODULE_1__.isElement)(selector)) {
      callBack(selector);
      return;
    }
    for (const sel of _dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].findAll(selector, this._element)) {
      callBack(sel);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollBarHelper);

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
/* harmony export */   isRTL: () => (/* binding */ isRTL),
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

/**
 * isVisible
 * @param element
 * @returns {boolean}
 */
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

/**
 *
 */
const isRTL = () => document.documentElement.dir === 'rtl';


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

/***/ "./app/modules/vgrollup/scss/vgrollup.scss":
/*!*************************************************!*\
  !*** ./app/modules/vgrollup/scss/vgrollup.scss ***!
  \*************************************************/
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
/* harmony export */   VGRollup: () => (/* reexport safe */ _app_modules_vgrollup_js_vgrollup__WEBPACK_IMPORTED_MODULE_13__["default"]),
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
/* harmony import */ var _app_modules_vgrollup_scss_vgrollup_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./app/modules/vgrollup/scss/vgrollup.scss */ "./app/modules/vgrollup/scss/vgrollup.scss");
/* harmony import */ var _app_modules_vgrollup_js_vgrollup__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./app/modules/vgrollup/js/vgrollup */ "./app/modules/vgrollup/js/vgrollup.js");
// css классы по умолчанию


// sidebar



// collapse


// nav



// dropdown



// modal



// form sender



// rollup



})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNWRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeGZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDcEtBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ3JEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUMzQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFrREE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDMVVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xSQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9iYXNlLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL21vZHVsZS1mbi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnY29sbGFwc2UvanMvdmdjb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vanMvdmdkcm9wZG93bi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9qcy92Z2Zvcm1zZW5kZXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z21vZGFsL2pzL3ZnbW9kYWwuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z25hdi9qcy92Z25hdi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Zncm9sbHVwL2pzL3Zncm9sbHVwLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL2pzL3Znc2lkZWJhci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3cuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9wYXJhbXMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9wbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9yZXNwb25zaXZlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvc2Nyb2xsYmFyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9kYXRhLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9ldmVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZG9tL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzP2U4MjUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvc2Nzcy92Z2Zvcm1zZW5kZXIuc2Nzcz82OTEyIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdtb2RhbC9zY3NzL3ZnbW9kYWwuc2Nzcz8xMjg5Iiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmduYXYvc2Nzcy92Z25hdi5zY3NzPzE5YmMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3JvbGx1cC9zY3NzL3Zncm9sbHVwLnNjc3M/MzUyNiIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzPzVhY2QiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3M/YzYzNCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZnLy4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleGVjdXRlLCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCBpc0VtcHR5T2JqfSBmcm9tIFwiLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9kYXRhXCI7XHJcbmltcG9ydCBQYXJhbXMgZnJvbSBcIi4uL3V0aWxzL2pzL2NvbXBvbmVudHMvcGFyYW1zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge0FqYXgsIGdldFNWR30gZnJvbSBcIi4vbW9kdWxlLWZuXCI7XHJcblxyXG5jbGFzcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50KSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHJldHVyblxyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBTZWxlY3RvcnMuZmluZChlbGVtZW50KTtcclxuXHRcdGlmICghdGhpcy5fZWxlbWVudCl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcign0KLQvtCy0LDRgNC40YkhINCf0LXRgNCy0YvQuSDQv9Cw0YDQsNC80LXRgtGAINC90LUg0LTQvtC70LbQtdC9INCx0YvRgtGMINC/0YPRgdGC0YvQvCEnKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHRcdERhdGEuc2V0KHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVksIHRoaXMpXHJcblx0fVxyXG5cclxuXHRfZ2V0UGFyYW1zKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0cmV0dXJuIG5ldyBQYXJhbXMocGFyYW1zLCBlbGVtZW50KS5nZXQoKTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHREYXRhLnJlbW92ZSh0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZKTtcclxuXHRcdEV2ZW50SGFuZGxlci5vZmYodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5FVkVOVF9LRVkpXHJcblxyXG5cdFx0Zm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcclxuXHRcdFx0dGhpc1twcm9wZXJ0eU5hbWVdID0gbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3JvdXRlKGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRsZXQgJGNvbnRlbnQgPSBudWxsO1xyXG5cclxuXHRcdGNvbnN0IHNldERhdGEgPSAoZGF0YSkgPT4ge1xyXG5cdFx0XHRpZiAoJGNvbnRlbnQpICRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHR9O1xyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnYWpheCcpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIV90aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEnbWV0aG9kJyBpbiBfdGhpcy5fcGFyYW1zLmFqYXgpIHtcclxuXHRcdFx0X3RoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZCA9ICdnZXQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgndGFyZ2V0JyBpbiBfdGhpcy5fcGFyYW1zLmFqYXggJiYgX3RoaXMuX3BhcmFtcy5hamF4LnRhcmdldCkge1xyXG5cdFx0XHQkY29udGVudCA9IFNlbGVjdG9ycy5maW5kKF90aGlzLl9wYXJhbXMuYWpheC50YXJnZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnbG9hZGVyJyBpbiBfdGhpcy5fcGFyYW1zLmFqYXggJiYgX3RoaXMuX3BhcmFtcy5hamF4LmxvYWRlcikge1xyXG5cdFx0XHRzZXREYXRhKCc8ZGl2IGNsYXNzPVwidmctbG9hZGVyXCI+PC9kaXY+Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0QWpheFtfdGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kXShfdGhpcy5fcGFyYW1zLmFqYXgucm91dGUsIF90aGlzLl9wYXJhbXMuYWpheC5kYXRhIHx8IHt9LCBmdW5jdGlvbiAoc3RhdHVzLCBkYXRhKSB7XHJcblx0XHRcdHNldERhdGEoZGF0YS5yZXNwb25zZSk7XHJcblx0XHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFtzdGF0dXMsIGRhdGFdKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2Rpc21pc3NFbGVtZW50KCkge1xyXG5cdFx0bGV0IGNyb3NzID0gZ2V0U1ZHKCdjcm9zcycpLFxyXG5cdFx0XHRidXR0b24gPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy52Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRpZiAoYnV0dG9uKSB7XHJcblx0XHRcdGxldCBzdmcgPSBidXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcblx0XHRcdGlmICghc3ZnKSBidXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBjcm9zcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcXVldWVDYWxsYmFjayhjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCA9IHRydWUsIHRpbWVPdXRNcykge1xyXG5cdFx0ZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbihjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCwgdGltZU91dE1zKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRGF0YS5nZXQoU2VsZWN0b3JzLmZpbmQoZWxlbWVudCksIHRoaXMuTkFNRV9LRVkpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoZWxlbWVudCkgfHwgbmV3IHRoaXMoZWxlbWVudCwgIWlzRW1wdHlPYmoocGFyYW1zKSA/IHBhcmFtcyA6IHt9KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEQVRBX0tFWSgpIHtcclxuXHRcdHJldHVybiBgdmcuJHt0aGlzLk5BTUV9YFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBFVkVOVF9LRVkoKSB7XHJcblx0XHRyZXR1cm4gYC4ke3RoaXMuREFUQV9LRVl9YFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc0VtcHR5T2JqfSBmcm9tIFwiLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQotGD0YIg0YHQvtCx0YDQsNC90Ysg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LrRgNC40L/RgtGLINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LlcclxuICovXHJcblxyXG4vKipcclxuICog0J3QsNCx0L7RgCBzdmcg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEByZXR1cm5zIHsqfHt9fVxyXG4gKi9cclxuY29uc3QgZ2V0U1ZHID0gKG5hbWUpID0+IHtcclxuXHRjb25zdCBzdmcgPSAge1xyXG5cdFx0ZXJyb3I6ICc8c3ZnICB2aWV3Qm94PVwiMCAwIDg3IDg3XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBpZD1cInVpLXN1Y2Nlc3NcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIGlkPVwiR3JvdXAtMlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApXCI+PGNpcmNsZSBpZD1cIk92YWwtMlwiIHN0cm9rZT1cInJnYmEoMjUyLCAxOTEsIDE5MSwgLjUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLWVycm9yLWNpcmNsZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCI0XCIgY3g9XCI0MS41XCIgY3k9XCI0MS41XCIgcj1cIjQxLjVcIj48L2NpcmNsZT48cGF0aCBjbGFzcz1cInVpLWVycm9yLWxpbmUxXCIgZD1cIk0yMi4yNDQyMjQsMjIgTDYwLjQyNzk5MDIsNjAuMTgzNzY2MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PHBhdGggY2xhc3M9XCJ1aS1lcnJvci1saW5lMlwiIGQ9XCJNNjAuNzU1Nzc2LDIxIEwyMy4yNDQyMjQsNTkuODQ0MzQ5MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4nLFxyXG5cdFx0c3VjY2VzczogJzxzdmcgdmlld0JveD1cIjAgMCA4NyA4N1wiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGcgaWQ9XCJ1aS1lcnJvclwiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgxMTcsIDE4MywgMTUyLCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSAgY2xhc3M9XCJ1aS1zdWNjZXNzLWNpcmNsZVwiIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxwb2x5bGluZSBjbGFzcz1cInVpLXN1Y2Nlc3MtcGF0aFwiIGlkPVwiUGF0aC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBwb2ludHM9XCIxOSAzOC44MDM2ODEzIDMxLjEwMjA3NDQgNTQuODA0Njg3NSA2My4yOTkyMjEgMjhcIj48L3BvbHlsaW5lPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdHdhaXRpbmc6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODcgODdcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnIGlkPVwidWktd2FpdGluZ1wiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgyNTUsIDIxOCwgMTA2LCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLXdhaXRpbmctY2lyY2xlXCIgaWQ9XCJPdmFsLTJcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PHBhdGggY2xhc3M9XCJ1aS13YWl0aW5nLWxpbmUxXCIgZD1cIk00MyA2M0M1NC41OTggNjMgNjQgNTMuNTk4IDY0IDQyQzY0IDMwLjQwMiA1NC41OTggMjEgNDMgMjFDMzEuNDAyIDIxIDIyIDMwLjQwMiAyMiA0MkMyMiA1My41OTggMzEuNDAyIDYzIDQzIDYzWlwiIHN0cm9rZS13aWR0aD1cIjNcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjxwYXRoIGNsYXNzPVwidWktd2FpdGluZy1saW5lMlwiIGQ9XCJNNDAuNjY2NyAzMi42NjQxVjQ0LjMzMDdINTIuMzMzNFwiIHN0cm9rZT1cIiNmZmRhNmFcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdGRvdHM6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJiaSBiaS10aHJlZS1kb3RzLXZlcnRpY2FsXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOS41IDEzYTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHpcIi8+PC9zdmc+JyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLQtdGI0LDQtdC8INGB0L7QsdGL0YLQuNC1IFwi0JfQsNC60YDRi9GC0YxcIiDQvdCwINCy0YHQtSDQvNC+0LTQsNC70LrQuCwg0YHQsNC50LTQsdCw0YDRiyDQuCDRgi7Qvy5cclxuICogQHBhcmFtIG1vZHVsZVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqL1xyXG5jb25zdCBkaXNtaXNzVHJpZ2dlciA9IChtb2R1bGUsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xyXG5cdGNvbnN0IGNsaWNrRXZlbnQgPSBgY2xpY2suZGlzbWlzcy4ke21vZHVsZS5FVkVOVF9LRVl9YFxyXG5cdGNvbnN0IG5hbWUgPSBtb2R1bGUuTkFNRTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBjbGlja0V2ZW50LCBgW2RhdGEtdmctZGlzbWlzcz1cIiR7bmFtZX1cIl1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpIHx8IHRoaXMuY2xvc2VzdChgLnZnLSR7bmFtZX1gKVxyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBtb2R1bGUuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblxyXG5cdFx0aW5zdGFuY2VbbWV0aG9kXSgpXHJcblx0fSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEFKQVggUkVRVUVTVFxyXG4gKiBAdHlwZSB7e3Bvc3Q6IGFqYXgucG9zdCwgZ2V0OiBhamF4LmdldCwgeDogKChmdW5jdGlvbigpOiAoWE1MSHR0cFJlcXVlc3QpKXwqKSwgc2VuZDogYWpheC5zZW5kfX1cclxuICovXHJcbmNvbnN0IEFqYXggPSB7XHJcblx0eDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHZlcnNpb25zID0gW1xyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjYuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjUuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjQuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjMuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjIuMFwiLFxyXG5cdFx0XHRcIk1pY3Jvc29mdC5YbWxIdHRwXCJcclxuXHRcdF07XHJcblxyXG5cdFx0bGV0IHhocjtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCh2ZXJzaW9uc1tpXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHhocjtcclxuXHR9LFxyXG5cclxuXHRzZW5kOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBhc3luYykge1xyXG5cdFx0aWYgKGFzeW5jID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0YXN5bmMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHggPSBBamF4LngoKTtcclxuXHRcdHgub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG5cdFx0eC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHguc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjYXNlIDIwMDpcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ3N1Y2Nlc3MnLCB7dGV4dDogeC5zdGF0dXNUZXh0LCByZXNwb25zZTogeC5yZXNwb25zZVRleHQsIGNvZGU6IHguc3RhdHVzfSlcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnZXJyb3InLCB7dGV4dDogeC5zdGF0dXNUZXh0LCByZXNwb25zZTogeC5yZXNwb25zZVRleHQsIGNvZGU6IHguc3RhdHVzfSlcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0eC5zZW5kKGRhdGEpXHJcblx0fSxcclxuXHJcblx0Z2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmICghaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdEFqYXguc2VuZCh1cmwgKyAocXVlcnkubGVuZ3RoID8gJz8nICsgcXVlcnkuam9pbignJicpIDogJycpLCBjYWxsYmFjaywgJ0dFVCcsIG51bGwsIGFzeW5jKVxyXG5cdH0sXHJcblxyXG5cdHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0QWpheC5zZW5kKHVybCwgY2FsbGJhY2ssICdQT1NUJywgZGF0YSwgYXN5bmMpXHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuXHRkaXNtaXNzVHJpZ2dlciwgQWpheCwgZ2V0U1ZHXHJcbn0iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHttZXJnZURlZXBPYmplY3QsIHJlZmxvd30gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ2NvbGxhcHNlJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuY29sbGFwc2UnO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ09MTEFQU0UgPSAndmctY29sbGFwc2UnO1xyXG5jb25zdCBDTEFTU19OQU1FX0NPTExBUFNJTkcgPSAndmctY29sbGFwc2luZyc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ09MTEFQU0VEID0gJ3ZnLWNvbGxhcHNlZCc7XHJcbmNvbnN0IENMQVNTX05BTUVfREVFUEVSX0NISUxEUkVOID0gYDpzY29wZSAuJHtDTEFTU19OQU1FX0NPTExBUFNFfSAuJHtDTEFTU19OQU1FX0NPTExBUFNFfWA7XHJcblxyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cImNvbGxhcHNlXCJdJztcclxuY29uc3QgU0VMRUNUT1JfQUNUSVZFUyA9ICcuY29sbGFwc2Uuc2hvdywgLmNvbGxhcHNlLmNvbGxhcHNpbmcnO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0NvbGxhcHNlIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdHRvZ2dsZTogdHJ1ZSxcclxuXHRcdFx0cGFyZW50OiBudWxsLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZVxyXG5cdFx0dGhpcy5fdHJpZ2dlckFycmF5ID0gW11cclxuXHJcblx0XHRjb25zdCB0b2dnbGVMaXN0ID0gU2VsZWN0b3JzLmZpbmRBbGwoU0VMRUNUT1JfREFUQV9UT0dHTEUpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgZWxlbSBvZiB0b2dnbGVMaXN0KSB7XHJcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gU2VsZWN0b3JzLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbSk7XHJcblx0XHRcdGNvbnN0IGZpbHRlckVsZW1lbnQgPSBTZWxlY3RvcnMuZmluZEFsbChzZWxlY3RvcikuZmlsdGVyKGZvdW5kRWxlbWVudCA9PiBmb3VuZEVsZW1lbnQgPT09IHRoaXMuX2VsZW1lbnQpO1xyXG5cclxuXHRcdFx0aWYgKHNlbGVjdG9yICE9PSBudWxsICYmIGZpbHRlckVsZW1lbnQubGVuZ3RoKSB7XHJcblx0XHRcdFx0dGhpcy5fdHJpZ2dlckFycmF5LnB1c2goZWxlbSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2luaXRpYWxpemVDaGlsZHJlbigpO1xyXG5cclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLnBhcmVudCkge1xyXG5cdFx0XHR0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fdHJpZ2dlckFycmF5LCB0aGlzLl9pc1Nob3duKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMudG9nZ2xlKSB7XHJcblx0XHRcdHRoaXMudG9nZ2xlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdygpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMuX2lzVHJhbnNpdGlvbmluZyB8fCBfdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGFjdGl2ZUNoaWxkcmVuID0gW107XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMucGFyZW50KSB7XHJcblx0XHRcdGFjdGl2ZUNoaWxkcmVuID0gdGhpcy5fZ2V0Rmlyc3RMZXZlbENoaWxkcmVuKFNFTEVDVE9SX0FDVElWRVMpXHJcblx0XHRcdFx0LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnQpXHJcblx0XHRcdFx0Lm1hcChlbGVtZW50ID0+IFZHQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCB7IHRvZ2dsZTogZmFsc2UgfSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChhY3RpdmVDaGlsZHJlbi5sZW5ndGggJiYgYWN0aXZlQ2hpbGRyZW5bMF0uX2lzVHJhbnNpdGlvbmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHN0YXJ0RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1cpO1xyXG5cdFx0aWYgKHN0YXJ0RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGZvciAoY29uc3QgYWN0aXZlSW5zdGFuY2Ugb2YgYWN0aXZlQ2hpbGRyZW4pIHtcclxuXHRcdFx0YWN0aXZlSW5zdGFuY2UuaGlkZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTRSlcclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IDA7XHJcblxyXG5cdFx0X3RoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhfdGhpcy5fdHJpZ2dlckFycmF5LCB0cnVlKTtcclxuXHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSB0cnVlO1xyXG5cclxuXHRcdF90aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xyXG5cdFx0XHRfdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0lORyk7XHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9DT0xMQVBTRSwgQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRcdF90aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOKTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgX3RoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cclxuXHRcdGNvbnN0IHNjcm9sbFNpemUgPSBgc2Nyb2xsSGVpZ2h0YDtcclxuXHRcdF90aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke190aGlzLl9lbGVtZW50W3Njcm9sbFNpemVdfXB4YDtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9pc1RyYW5zaXRpb25pbmcgfHwgIV90aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBzdGFydEV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKVxyXG5cdFx0aWYgKHN0YXJ0RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMuX2VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0fXB4YDtcclxuXHRcdHJlZmxvdyhfdGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNJTkcpO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNFLCBDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdHJpZ2dlciBvZiBfdGhpcy5fdHJpZ2dlckFycmF5KSB7XHJcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0cmlnZ2VyKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50ICYmICFfdGhpcy5faXNTaG93bihlbGVtZW50KSkge1xyXG5cdFx0XHRcdF90aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoW3RyaWdnZXJdLCBmYWxzZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xyXG5cdFx0XHRfdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnO1xyXG5cdFx0X3RoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGUsIF90aGlzLl9lbGVtZW50LCB0cnVlKTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bihlbGVtZW50ID0gdGhpcy5fZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRyaWdnZXJBcnJheSwgaXNPcGVuKSB7XHJcblx0XHRpZiAoIXRyaWdnZXJBcnJheS5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIHRyaWdnZXJBcnJheSkge1xyXG5cdFx0XHR0aGlzLl9jaGFuZ2VTdGF0ZUJ1dHRvbihlbGVtZW50LCBpc09wZW4pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2luaXRpYWxpemVDaGlsZHJlbigpIHtcclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLnBhcmVudCkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fZ2V0Rmlyc3RMZXZlbENoaWxkcmVuKFNFTEVDVE9SX0RBVEFfVE9HR0xFKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgY2hpbGRyZW4pIHtcclxuXHRcdFx0Y29uc3Qgc2VsZWN0ZWQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3RvcihlbGVtZW50KVxyXG5cclxuXHRcdFx0aWYgKHNlbGVjdGVkKSB7XHJcblx0XHRcdFx0dGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKFtlbGVtZW50XSwgdGhpcy5faXNTaG93bihzZWxlY3RlZCkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9nZXRGaXJzdExldmVsQ2hpbGRyZW4oc2VsZWN0b3IpIHtcclxuXHRcdGNvbnN0IGNoaWxkcmVuID0gU2VsZWN0b3JzLmZpbmQoQ0xBU1NfTkFNRV9ERUVQRVJfQ0hJTERSRU4sIHRoaXMuX3BhcmFtcy5wYXJlbnQpO1xyXG5cdFx0cmV0dXJuIFNlbGVjdG9ycy5maW5kKHNlbGVjdG9yLCB0aGlzLl9wYXJhbXMucGFyZW50KS5maWx0ZXIoZWxlbWVudCA9PiAhY2hpbGRyZW4uaW5jbHVkZXMoZWxlbWVudCkpO1xyXG5cdH1cclxuXHJcblx0X2NoYW5nZVN0YXRlQnV0dG9uKGVsZW1lbnQsIGlzT3Blbikge1xyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKENMQVNTX05BTUVfQ09MTEFQU0VELCAhaXNPcGVuKTtcclxuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKTtcclxuXHRcdGVsZW1lbnQuaW5uZXJIVE1MID0gTWFuaXB1bGF0b3IuZ2V0KGVsZW1lbnQsIGBkYXRhLSR7aXNPcGVuID8gJ2hpZGUnIDogJ3Nob3cnfS10ZXh0YCkgfHwgZWxlbWVudC5pbm5lckhUTUw7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0aWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnQScgfHwgKGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LnRhZ05hbWUgPT09ICdBJykpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdFNlbGVjdG9ycy5nZXRNdWx0aXBsZUVsZW1lbnRzRnJvbVNlbGVjdG9yKHRoaXMpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFZHQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCB7dG9nZ2xlOiBmYWxzZX0pLnRvZ2dsZSgpO1xyXG5cdH0pO1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdDb2xsYXBzZTsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBtZXJnZURlZXBPYmplY3QsIG5vb3B9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFBsYWNlbWVudCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9wbGFjZW1lbnRcIjtcclxuXHJcbmNvbnN0IE5BTUUgICAgICAgICAgICAgPSAnZHJvcGRvd24nO1xyXG5jb25zdCBOQU1FX0tFWSAgICAgICAgID0gJ3ZnLmRyb3Bkb3duJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICA9ICdmYWRlJztcclxuY29uc3QgVEFSR0VUX0NPTlRBSU5FUiA9ICd2Zy1kcm9wZG93bi1jb250ZW50JztcclxuY29uc3QgUEFSRU5UX0NPTlRBSU5FUiA9ICd2Zy1kcm9wZG93bic7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJ1tkYXRhLXZnLXRvZ2dsZT1cImRyb3Bkb3duXCJdJztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlVUF9EQVRBX0FQSSA9ICAgICBga2V5dXAuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlET1dOX0RBVEFfQVBJID0gICBga2V5ZG93bi4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJID0gICAgIGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSA9ICBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdEcm9wZG93biBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcykge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRsZXQgZGVmYXVsdFBhcmFtcyA9IHtcclxuXHRcdFx0b2Zmc2V0OiBbMCwgMl0sXHJcblx0XHRcdG92ZXI6IGZhbHNlLFxyXG5cdFx0XHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRcdFx0b3ZlcmZsb3c6IHRydWUsXHJcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cdFx0XHRhbmltYXRpb246IHRydWUsXHJcblx0XHRcdHRpbWVvdXRBbmltYXRpb246IDM1MCxcclxuXHRcdFx0aG92ZXI6IGZhbHNlLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdvZmZzZXQnIGluIHBhcmFtcyAmJiBBcnJheS5pc0FycmF5KHBhcmFtcy5vZmZzZXQpKSB7XHJcblx0XHRcdGRlZmF1bHRQYXJhbXMub2Zmc2V0ID0gcGFyYW1zLm9mZnNldDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KGRlZmF1bHRQYXJhbXMsIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcclxuXHRcdHRoaXMuX2Ryb3AgPSBTZWxlY3RvcnMuZmluZCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSLCB0aGlzLl9wYXJlbnQpO1xyXG5cdFx0dGhpcy5faXNQbGFjZW1lbnQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0dGhpcy5fcGFyYW1zLnRpbWVvdXRBbmltYXRpb24gPSAxMFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzU2hvd24oKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgdGhpcy5faXNTaG93bigpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0aGlzLl9zZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9kcm9wLCB0cnVlLCA1MCk7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgIXRoaXMuX2lzU2hvd24oKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0cmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRyZXR1cm4gc3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUsIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZHJvcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9wYXJlbnQsIHRydWUsIHRoaXMuX3BhcmFtcy50aW1lb3V0QW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub2Zmc2V0KSB7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdUb3AgPSBfdGhpcy5fcGFyYW1zLm9mZnNldFsxXSArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdSaWdodCA9IF90aGlzLl9wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgUEFSRU5UX0NPTlRBSU5FUik7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCFpbnN0YW5jZS5fcGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRpbnN0YW5jZS5fY29tcGxldGVIaWRlKHtyZWxhdGVkVGFyZ2V0OiBpbnN0YW5jZS5fZWxlbWVudH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWURPV05fREFUQV9BUEksICcuJyArIFRBUkdFVF9DT05UQUlORVIsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl06bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHRHJvcGRvd24uZ2V0SW5zdGFuY2UodG9nZ2xlKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZHJvcCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMga2V5ZG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlzSW5wdXQgPSAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKVxyXG5cdFx0Y29uc3QgaXNFc2NhcGVFdmVudCA9IGV2ZW50LmtleSA9PT0gJ0VzY2FwZSdcclxuXHRcdGNvbnN0IGlzVXBPckRvd25FdmVudCA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXS5pbmNsdWRlcyhldmVudC5rZXkpXHJcblxyXG5cdFx0aWYgKCFpc1VwT3JEb3duRXZlbnQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzSW5wdXQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuXHRcdGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgP1xyXG5cdFx0XHR0aGlzIDogKFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5wYXJlbnROb2RlKSlcclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShnZXRUb2dnbGVCdXR0b24pXHJcblxyXG5cdFx0aWYgKGlzVXBPckRvd25FdmVudCkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5zaG93KClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2UuaGlkZSgpXHJcblx0XHRcdGdldFRvZ2dsZUJ1dHRvbi5mb2N1cygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRHJvcGRvd247IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBWR01vZGFsIGZyb20gXCIuLi8uLi92Z21vZGFsL2pzL3ZnbW9kYWxcIjtcclxuaW1wb3J0IHtpc09iamVjdCwgbWFrZVJhbmRvbVN0cmluZywgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IFZHQ29sbGFwc2UgZnJvbSBcIi4uLy4uL3ZnY29sbGFwc2UvanMvdmdjb2xsYXBzZVwiO1xyXG5pbXBvcnQge2dldFNWR30gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvYmFja2Ryb3BcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnZm9ybS1zZW5kZXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5mcyc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX1NVQ0NFU1MgPSAndmcuZnMuc3VjY2Vzcyc7XHJcbmNvbnN0IEVWRU5UX0tFWV9FUlJPUiAgID0gJ3ZnLmZzLmVycm9yJztcclxuY29uc3QgRVZFTlRfS0VZX0JFRk9SRSAgPSAndmcuZnMuYmVmb3JlJztcclxuXHJcbmNvbnN0IEVWRU5UX1NVQk1JVF9EQVRBX0FQSSA9IGBzdWJtaXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdGb3JtU2VuZGVyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdHJlZGlyZWN0OiAnJyxcclxuXHRcdFx0dmFsaWRhdGU6IGZhbHNlLFxyXG5cdFx0XHRzdWJtaXQ6IGZhbHNlLFxyXG5cdFx0XHRmaWVsZHM6IFtdLFxyXG5cdFx0XHRhbGVydDoge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0dHlwZTogJ21vZGFsJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2xhc3Nlczoge1xyXG5cdFx0XHRcdGdlbmVyYWw6ICd2Zy1mb3JtLXNlbmRlcicsXHJcblx0XHRcdFx0YWxlcnRDb2xsYXBzZTogJ3ZnLWZvcm0tc2VuZGVyLWNvbGxhcHNlJyxcclxuXHRcdFx0XHRhbGVydE1vZGFsOiAndmctZm9ybS1zZW5kZXItbW9kYWwnLFxyXG5cdFx0XHRcdHZhbGlkYXRpb246ICduZWVkcy12YWxpZGF0aW9uJyxcclxuXHRcdFx0XHR3YXNWYWxpZGF0ZTogJ3dhcy12YWxpZGF0ZWQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5hamF4LnJvdXRlID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdhY3Rpb24nKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdtZXRob2QnKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5fYnV0dG9uID0gU2VsZWN0b3JzLmZpbmQoJ1t0eXBlPVwic3VibWl0XCJdJywgdGhpcy5fZWxlbWVudCkgfHwgU2VsZWN0b3JzLmZpbmQoJ1tmb3JtPVwiJyArIHRoaXMuX2VsZW1lbnQuaWQgKyAnXCJdJykgfHwgbnVsbDtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuaXNCdG5UZXh0ICAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtYnRuLXRleHQnKSAhPT0gJ2ZhbHNlJztcclxuXHRcdHRoaXMuX3BhcmFtcy5pc0pzb25QYXJzZSA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnZGF0YS1qc29uLXBhcnNlJykgIT09ICdmYWxzZSc7XHJcblx0XHR0aGlzLl9wYXJhbXMuaXNTaG93UGFzcyAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtc2hvdy1wYXNzJykgPT09ICd0cnVlJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5jbGFzc2VzLmdlbmVyYWwpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMudmFsaWRhdGUpIHtcclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KHRoaXMuX2VsZW1lbnQsICdub3ZhbGlkYXRlJywgJycpO1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5fcGFyYW1zLmNsYXNzZXMudmFsaWRhdGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETyDRgdC00LXQu9Cw0YLRjCDQtNC+0LHQsNCy0LvQtdC90LjQtSDQs9C70LDQt9CwINC10YHQu9C4INC10YHRgtGMINCy0LLQvtC0INC/0LDRgNC+0LvRj1xyXG5cclxuXHRcdHJldHVybiB0aGlzXHJcblx0fVxyXG5cclxuXHRyZXF1ZXN0KGRhdGEsIGV2ZW50KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0X3RoaXMuX2FsZXJ0QmVmb3JlKCk7XHJcblxyXG5cdFx0X3RoaXMuX3BhcmFtcy5hamF4LmRhdGEgPSBkYXRhO1xyXG5cclxuXHRcdF90aGlzLl9yb3V0ZShmdW5jdGlvbiAoc3RhdHVzLCBkYXRhKSB7XHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3dhcy12YWxpZGF0ZWQnKTtcclxuXHJcblx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LmVuYWJsZWQpIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ3N0cmluZycgJiYgc3RhdHVzID09PSAnZXJyb3InKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5fYWxlcnRFcnJvcihldmVudCwgZGF0YSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygc3RhdHVzID09PSAnc3RyaW5nJyAmJiBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG5cdFx0XHRcdFx0X3RoaXMuX2FsZXJ0U3VjY2VzcyhldmVudCwgZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5yZWRpcmVjdCkge1xyXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gX3RoaXMuX3BhcmFtcy5yZWRpcmVjdDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRCZWZvcmUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG5cdFx0XHRbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYWxlcnRDb2xsYXBzZSldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XHJcblx0XHRcdFx0XHRWR0NvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwge3RvZ2dsZTogZmFsc2V9KS5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdiZWZvcmUnKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfQkVGT1JFLCBfdGhpcyk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRFcnJvcihldmVudCwgZGF0YSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9zdGF0dXNCdXR0b24oJ2FmdGVyJyk7XHJcblx0XHRfdGhpcy5fanNvblBhcnNlKGRhdGEsICdlcnJvcicpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9FUlJPUiwgW2V2ZW50LCBfdGhpcywgZGF0YV0pO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0U3VjY2VzcyhldmVudCwgZGF0YSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9zdGF0dXNCdXR0b24oJ2FmdGVyJyk7XHJcblx0XHRfdGhpcy5fanNvblBhcnNlKGRhdGEsICdzdWNjZXNzJyk7XHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NVQ0NFU1MsIFtldmVudCwgX3RoaXMsIGRhdGFdKTtcclxuXHR9XHJcblxyXG5cdF9zdGF0dXNCdXR0b24oc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fYnV0dG9uKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGJ0blN1Ym1pdFRleHQgPSBfdGhpcy5fYnV0dG9uLFxyXG5cdFx0XHRidG5UZXh0ID0ge1xyXG5cdFx0XHRzZW5kOiAn0J7RgtC/0YDQsNCy0LvRj9C10LwuLi4nLFxyXG5cdFx0XHR0ZXh0OiAn0J7RgtC/0YDQsNCy0LjRgtGMJ1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXNwaW5uZXInKSAmJiBzdGF0dXMgPT09ICdiZWZvcmUnKSB7XHJcblx0XHRcdF90aGlzLl9idXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgJzxzcGFuIGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMlwiPjwvc3Bhbj4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXRleHQnKSkge1xyXG5cdFx0XHRidG5UZXh0LnRleHQgPSBNYW5pcHVsYXRvci5nZXQoX3RoaXMuX2J1dHRvbiwgJ2RhdGEtdGV4dCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0ICRidG5UZXh0ID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXh0XScpO1xyXG5cdFx0XHRpZiAoJGJ0blRleHQpIHtcclxuXHRcdFx0XHRidG5UZXh0LnRleHQgPSBNYW5pcHVsYXRvci5nZXQoJGJ0blRleHQsICdkYXRhLXRleHQnKTtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0ID0gJGJ0blRleHQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKF90aGlzLl9idXR0b24sICdkYXRhLXRleHQtc2VuZCcpKSB7XHJcblx0XHRcdGJ0blRleHQuc2VuZCA9IE1hbmlwdWxhdG9yLmdldChfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0LXNlbmQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCAkYnRuVGV4dFNlbmQgPSBfdGhpcy5fYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRleHQtc2VuZF0nKTtcclxuXHRcdFx0aWYgKCRidG5UZXh0U2VuZCkge1xyXG5cdFx0XHRcdGJ0blRleHQuc2VuZCA9IE1hbmlwdWxhdG9yLmdldCgkYnRuVGV4dFNlbmQsICdkYXRhLXRleHQtc2VuZCcpO1xyXG5cdFx0XHRcdGJ0blN1Ym1pdFRleHQgPSAkYnRuVGV4dFNlbmQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3RhdHVzID09PSAnYmVmb3JlJykge1xyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5pc0J0blRleHQpIHtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0LmlubmVySFRNTCA9IGJ0blRleHQuc2VuZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQoX3RoaXMuX2J1dHRvbiwnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3RhdHVzID09PSAnYWZ0ZXInKSB7XHJcblx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmlzQnRuVGV4dCkge1xyXG5cdFx0XHRcdGJ0blN1Ym1pdFRleHQuaW5uZXJIVE1MID0gYnRuVGV4dC50ZXh0O1xyXG5cdFx0XHR9XHJcblx0XHRcdE1hbmlwdWxhdG9yLnJlbW92ZShfdGhpcy5fYnV0dG9uLCdkaXNhYmxlZCcpO1xyXG5cclxuXHRcdFx0bGV0IHNwaW5uZXIgPSBfdGhpcy5fYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5zcGlubmVyLWJvcmRlcicpO1xyXG5cdFx0XHRpZiAoc3Bpbm5lcikgc3Bpbm5lci5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9qc29uUGFyc2UoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuaXNKc29uUGFyc2UgJiYgdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGxldCBwYXJzZXJEYXRhID0ge307XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHBhcnNlckRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cdFx0XHRcdF90aGlzLmFsZXJ0KHBhcnNlckRhdGEsIHN0YXR1cyk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRfdGhpcy5hbGVydChkYXRhLCBzdGF0dXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRfdGhpcy5hbGVydChkYXRhLCBzdGF0dXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YWxlcnQoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKGlzT2JqZWN0KGRhdGEpKSB7XHJcblx0XHRcdGlmICgoJ2NvZGUnIGluIGRhdGEpICYmIGRhdGEuY29kZSAmJiBkYXRhLmNvZGUgPT09IDIwMCkge1xyXG5cdFx0XHRcdGlmICgncmVzcG9uc2UnIGluIGRhdGEgJiYgZGF0YS5yZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0bGV0IHJlc3BvbnNlID0gbm9ybWFsaXplRGF0YShkYXRhLnJlc3BvbnNlKTtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgcmVzcG9uc2UgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZS5pbmRleE9mKFwiUGFyc2UgZXJyb3JcIikgIT09IC0xIHx8IHJlc3BvbnNlLmluZGV4T2YoXCJzeW50YXggZXJyb3JcIikgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0c3RhdHVzID0gJ2Vycm9yJztcclxuXHRcdFx0XHRcdFx0XHRkYXRhID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2U6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICdFcnJvcicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZywgcGxlYXNlIHJlcGVhdCBsYXRlcidcclxuXHRcdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSByZXBlYXQgbGF0ZXInXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoJ2Vycm9ycycgaW4gcmVzcG9uc2UgJiYgbm9ybWFsaXplRGF0YShyZXNwb25zZS5lcnJvcnMpKSB7XHJcblx0XHRcdFx0XHRcdFx0c3RhdHVzID0gbm9ybWFsaXplRGF0YShyZXNwb25zZS5lcnJvcnMpID8gJ2Vycm9yJyA6ICdzdWNjZXNzJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5hbGVydC5lbmFibGVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC50eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdF90aGlzLl9hbGVydE1vZGFsKGRhdGEsIHN0YXR1cylcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC50eXBlID09PSAnY29sbGFwc2UnKSB7XHJcblx0XHRcdF90aGlzLl9hbGVydENvbGxhcHNlKGRhdGEsIHN0YXR1cylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9hbGVydE1vZGFsKGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdC8vINCV0YHRgtGMINC70Lgg0L7RgtC60YDRi9GC0YvQtSDQvNC+0LTQsNC70LrQuCwg0LfQsNC60YDRi9Cy0LDQtdC8XHJcblx0XHRbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwnKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XHJcblx0XHRcdFx0bGV0IG1CUyA9IGJvb3RzdHJhcC5Nb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdFx0XHRcdG1CUy5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2Zy1tb2RhbCcpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdGlmIChlbGVtZW50ICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcclxuXHRcdFx0XHRjb25zdCBtVkcgPSBWR01vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCk7XHJcblx0XHRcdFx0bVZHLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IGlkID0gX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmdlbmVyYWwgKyAnLScgKyBtYWtlUmFuZG9tU3RyaW5nKCk7XHJcblxyXG5cdFx0bGV0ICRtb2RhbCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHRcdGlmICgkbW9kYWwpICRtb2RhbC5yZW1vdmUoKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0VkdNb2RhbC5pbml0KGlkLCB7XHJcblx0XHRcdFx0Y2xhc3Nlczoge1xyXG5cdFx0XHRcdFx0YWxlcnQ6IF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBmdW5jdGlvbiAoc2VsZikge1xyXG5cdFx0XHRcdGxldCBlbGVtZW50ID0gc2VsZi5fZWxlbWVudDtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0TW9kYWwpO1xyXG5cclxuXHRcdFx0XHRsZXQgJGJvZHkgPSBTZWxlY3RvcnMuZmluZCgnLnZnLW1vZGFsLWJvZHknLCBlbGVtZW50KTtcclxuXHRcdFx0XHRpZiAoJGJvZHkpICRib2R5LmFwcGVuZChfdGhpcy5zZXREYXRhUmVsYXRpb25TdGF0dXMoZWxlbWVudCwgc3RhdHVzLCBkYXRhLCAnbW9kYWwnKSk7XHJcblxyXG5cdFx0XHRcdHNlbGYudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSwgMzAwKVxyXG5cdH1cclxuXHJcblx0X2FsZXJ0Q29sbGFwc2UoZGF0YSwgc3RhdHVzKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0ICRjb2xsYXBzZSA9IFNlbGVjdG9ycy5maW5kKCcuJyArIF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydENvbGxhcHNlKTtcclxuXHRcdGlmICghJGNvbGxhcHNlKSB7XHJcblx0XHRcdCRjb2xsYXBzZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHQkY29sbGFwc2UuY2xhc3NMaXN0LmFkZChfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYWxlcnRDb2xsYXBzZSk7XHJcblx0XHRcdCRjb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCd2Zy1jb2xsYXBzZScpO1xyXG5cdFx0XHQkY29sbGFwc2UuaWQgPSBfdGhpcy5fcGFyYW1zLmNsYXNzZXMuZ2VuZXJhbCArICctJyArIG1ha2VSYW5kb21TdHJpbmcoKTtcclxuXHRcdFx0JGNvbGxhcHNlLmFwcGVuZChfdGhpcy5zZXREYXRhUmVsYXRpb25TdGF0dXMoJGNvbGxhcHNlLCBzdGF0dXMsIGRhdGEsICdjb2xsYXBzZScpKTtcclxuXHJcblx0XHRcdF90aGlzLl9lbGVtZW50LnByZXBlbmQoJGNvbGxhcHNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRWR0NvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoJGNvbGxhcHNlLCB7dG9nZ2xlOiBmYWxzZX0pLnRvZ2dsZSgpO1xyXG5cdH1cclxuXHJcblx0c2V0RGF0YVJlbGF0aW9uU3RhdHVzKCRlbGVtZW50LCBzdGF0dXMsIGRhdGEsIHR5cGUpIHtcclxuXHRcdGxldCAkYWxlcnQgPSBTZWxlY3RvcnMuZmluZCgnLnZnLWFsZXJ0LScgKyBzdGF0dXMsICRlbGVtZW50KTtcclxuXHJcblx0XHRpZiAoaXNPYmplY3QoZGF0YSkpIHtcclxuXHRcdFx0aWYgKHN0YXR1cyA9PT0gJ2Vycm9yJykge1xyXG5cdFx0XHRcdGlmICgnY29kZScgaW4gZGF0YSAmJiBkYXRhLmNvZGUgIT09IDIwMCkge1xyXG5cdFx0XHRcdFx0aWYgKCd0ZXh0JyBpbiBkYXRhICYmICFkYXRhLnRleHQpIHtcclxuXHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBwbGVhc2UgcmVwZWF0IGxhdGVyJztcclxuXHJcblx0XHRcdFx0XHRcdHN3aXRjaCAoZGF0YS5jb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSA0MDA6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnQmFkIFJlcXVlc3QnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQwMTpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdVbmF1dGhvcml6ZWQnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQwMzpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdVbmF1dGhvcml6ZWQnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQxMzpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdGb3JiaWRkZW4nXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQwNDpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdOb3QgRm91bmQnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQyMjpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdVbnByb2Nlc3NhYmxlIEVudGl0eSdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNTAwOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ0ludGVybmFsIFNlcnZlciBFcnJvcidcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNTA0OlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ0dhdGV3YXkgVGltZW91dCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoJ3Jlc3BvbnNlJyBpbiBkYXRhKSB7XHJcblx0XHRcdFx0bGV0IHJlc3BvbnNlID0gbm9ybWFsaXplRGF0YShkYXRhLnJlc3BvbnNlKSwgdGl0bGUgPSAnJywgdHh0ID0gJycsIGNvZGUgPSAnJztcclxuXHRcdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlICE9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKCEoJ3ZpZXcnIGluIHJlc3BvbnNlKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoJ3RpdGxlJyBpbiByZXNwb25zZSkgdGl0bGUgPSByZXNwb25zZS50aXRsZTtcclxuXHRcdFx0XHRcdFx0aWYgKHN0YXR1cyA9PT0gJ2Vycm9yJyAmJiBkYXRhLmNvZGUgIT09IDIwMCkge1xyXG5cdFx0XHRcdFx0XHRcdGNvZGUgPSAnICcgKyBkYXRhLnRleHQgKyAnICgnICsgZGF0YS5jb2RlICsgJyknO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR0eHQgKz0gJzxoNCBjbGFzcz1cInZnLWFsZXJ0LWNvbnRlbnQtLXRpdGxlXCI+JyArIHRpdGxlICsgY29kZSArICc8L2g0Pic7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoJ21lc3NhZ2UnIGluIHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRcdFx0dHh0ICs9ICc8ZGl2IGNsYXNzPVwidmctYWxlcnQtY29udGVudC0tbWVzc2FnZVwiPicgKyByZXNwb25zZS5tZXNzYWdlICsgJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCdlcnJvcnMnIGluIHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVycm9ycyA9IG5vcm1hbGl6ZURhdGEocmVzcG9uc2UuZXJyb3JzKSB8fCBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChpc09iamVjdChlcnJvcnMpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IGVycm9yIGluIGVycm9ycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShlcnJvcnNbZXJyb3JdKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yc1tlcnJvcl0uZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHh0ICs9ICc8ZGl2PicrIHQgKyc8L2Rpdj4nO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHh0ID0gJzxkaXY+JysgZXJyb3JzW2Vycm9yXSArJzwvZGl2Pic7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGRhdGEgPSB7XHJcblx0XHRcdFx0XHRcdFx0dmlldzogdHh0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZGF0YS52aWV3ID0gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEkYWxlcnQpIHtcclxuXHRcdFx0JGFsZXJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdCRhbGVydC5jbGFzc0xpc3QuYWRkKCd2Zy1hbGVydCcsICd2Zy1hbGVydC0nICsgc3RhdHVzLCAndmctYWxlcnQtJyArIHR5cGUpO1xyXG5cclxuXHRcdFx0bGV0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0Y29udGVudC5jbGFzc0xpc3QuYWRkKCd2Zy1hbGVydC1jb250ZW50Jyk7XHJcblxyXG5cdFx0XHRsZXQgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0LWNvbnRlbnQtLWljb24nKTtcclxuXHJcblx0XHRcdGxldCBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cdFx0XHRpLmlubmVySFRNTCA9IGdldFNWRyhzdGF0dXMpO1xyXG5cclxuXHRcdFx0aWNvbi5hcHBlbmQoaSk7XHJcblx0XHRcdGNvbnRlbnQuYXBwZW5kKGljb24pO1xyXG5cclxuXHRcdFx0bGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0dGV4dC5jbGFzc0xpc3QuYWRkKCd2Zy1hbGVydC1jb250ZW50LS10ZXh0Jyk7XHJcblx0XHRcdHRleHQuaW5uZXJIVE1MID0gZGF0YS52aWV3O1xyXG5cclxuXHRcdFx0Y29udGVudC5hcHBlbmQodGV4dCk7XHJcblx0XHRcdCRhbGVydC5hcHBlbmQoY29udGVudCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgdGV4dCA9IFNlbGVjdG9ycy5maW5kKCcudmctYWxlcnQtY29udGVudC0tdGV4dCcsICRhbGVydCk7XHJcblx0XHRcdHRleHQuaW5uZXJIVE1MID0gZGF0YS52aWV3O1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAkYWxlcnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRm9ybVNlbmRlci5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHRpbnN0YW5jZS5idWlsZCgpO1xyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9TVUJNSVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGlmICghTWFuaXB1bGF0b3IuaGFzKGV2ZW50LnRhcmdldCwgJ2RhdGEtdmdmb3Jtc2VuZGVyJykpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGluc3RhbmNlID0gVkdGb3JtU2VuZGVyLmdldE9yQ3JlYXRlSW5zdGFuY2UoZXZlbnQudGFyZ2V0LCB7fSk7XHJcblx0aWYgKCFpbnN0YW5jZSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKGluc3RhbmNlLl9wYXJhbXMudmFsaWRhdGUpIHtcclxuXHRcdGlmICghaW5zdGFuY2UuX2VsZW1lbnQuY2hlY2tWYWxpZGl0eSgpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0aW5zdGFuY2UuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMud2FzVmFsaWRhdGUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgY29sbGVjdERhdGEgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcclxuXHRcdGZvciAobGV0IG5hbWUgaW4gZmllbGRzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZmllbGRzW25hbWVdID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiBmaWVsZHNbbmFtZV0pIHtcclxuXHRcdFx0XHRcdGxldCBhcnIgPSBPYmplY3Qua2V5cyhmaWVsZHNbbmFtZV1ba2V5XSkubWFwKGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmaWVsZHNbbmFtZV1ba2V5XVtpXTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgYXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGF0YS5hcHBlbmQobmFtZSwgZmllbGRzW25hbWVdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH1cclxuXHJcblx0aWYgKCFpbnN0YW5jZS5fcGFyYW1zLnN1Ym1pdCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YShpbnN0YW5jZS5fZWxlbWVudCk7XHJcblxyXG5cdFx0Ly8gVE9ETyDQtNC+0LTQtdC70LDRgtGMXHJcblx0XHQvKmlmIChBcnJheS5pc0FycmF5KGluc3RhbmNlLl9wYXJhbXMuYWpheC5maWVsZHMpICYmIGluc3RhbmNlLl9wYXJhbXMuYWpheC5maWVsZHMubGVuZ3RoKSB7XHJcblx0XHRcdGRhdGEgPSBjb2xsZWN0RGF0YShkYXRhLCBpbnN0YW5jZS5fcGFyYW1zLmFqYXguZmllbGRzKTtcclxuXHRcdH0qL1xyXG5cclxuXHRcdHJldHVybiBpbnN0YW5jZS5yZXF1ZXN0KGRhdGEsIGV2ZW50KTtcclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0Zvcm1TZW5kZXI7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTY3JvbGxCYXJIZWxwZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvc2Nyb2xsYmFyXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIGlzUlRMLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdCwgcmVmbG93fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IEFuaW1hdGlvbiBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9hbmltYXRpb25cIjtcclxuaW1wb3J0IGV2ZW50IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbW9kYWwnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5tb2RhbCc7XHJcblxyXG5jb25zdCBFU0NBUEVfS0VZID0gJ0VzY2FwZSc7XHJcblxyXG5jb25zdCBPUEVOX1NFTEVDVE9SID0gJy52Zy1tb2RhbC5zaG93JztcclxuY29uc3QgU0VMRUNUT1JfRElBTE9HID0gJy52Zy1tb2RhbC1kaWFsb2cnO1xyXG5jb25zdCBTRUxFQ1RPUl9NT0RBTF9CT0RZID0gJy52Zy1tb2RhbC1ib2R5JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwibW9kYWxcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9PUEVOID0gJ3ZnLW1vZGFsLW9wZW4nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TVEFUSUMgPSAndmctbW9kYWwtc3RhdGljJ1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuY29uc3QgRVZFTlRfS0VZX1JFU0laRSA9IGAke05BTUVfS0VZfS5yZXNpemVgXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTICAgICA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgICAgICA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJICAgICAgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfTU9VU0VET1dOX0RJU01JU1MgICA9IGBtb3VzZWRvd24uZGlzbWlzcyR7TkFNRV9LRVl9YFxyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfRElTTUlTUyAgICAgICAgICAgPSBgY2xpY2suZGlzbWlzcyR7TkFNRV9LRVl9YFxyXG5cclxuY2xhc3MgVkdNb2RhbCBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRcdFx0Zm9jdXM6IHRydWUsXHJcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxyXG5cdFx0XHRmaWVsZHM6IFtdLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0XHRsb2FkZXI6IGZhbHNlXHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdGluOiAnYW5pbWF0ZV9fYmFja0luVXAnLFxyXG5cdFx0XHRcdG91dDogJ2FuaW1hdGVfX2JhY2tPdXRVcCcsXHJcblx0XHRcdFx0ZHVyYXRpb246IDEwMDAsXHJcblx0XHRcdFx0ZGVsYXk6IDEwMDAsXHJcblx0XHRcdFx0cmVwZWF0OiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctbW9kYWwnLFxyXG5cdFx0XHRcdGRpYWxvZzogJ3ZnLW1vZGFsLWRpYWxvZycsXHJcblx0XHRcdFx0Y29udGVudDogJ3ZnLW1vZGFsLWNvbnRlbnQnLFxyXG5cdFx0XHRcdGhlYWRlcjogJ3ZnLW1vZGFsLWhlYWRlcicsXHJcblx0XHRcdFx0dGl0bGU6ICd2Zy1tb2RhbC10aXRsZScsXHJcblx0XHRcdFx0Ym9keTogJ3ZnLW1vZGFsLWJvZHknLFxyXG5cdFx0XHRcdGZvb3RlcjogJ3ZnLW1vZGFsLWZvb3RlcicsXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cdFx0dGhpcy5fYnV0dG9uID0gbnVsbDtcclxuXHRcdHRoaXMuX2RpYWxvZyA9IFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RJQUxPRywgdGhpcy5fZWxlbWVudCk7XHJcblx0XHR0aGlzLl9pc1Nob3duID0gZmFsc2U7XHJcblx0XHR0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuX3Njcm9sbEJhciA9IG5ldyBTY3JvbGxCYXJIZWxwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbigpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0VkdNb2RhbC5idWlsZChlbGVtZW50LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZChpZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0aWYgKHR5cGVvZiBpZCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0X2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwnLCAnZmFkZScpO1xyXG5cdFx0X2VsZW1lbnQuaWQgPSBpZDtsZXQgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRkaWFsb2cuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtZGlhbG9nJyk7XHJcblxyXG5cdFx0bGV0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtY29udGVudCcpO1xyXG5cclxuXHRcdGxldCBidG5DbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAndHlwZScsICdidXR0b24nKTtcclxuXHRcdE1hbmlwdWxhdG9yLnNldChidG5DbG9zZSwgJ2RhdGEtdmctZGlzbWlzcycsICdtb2RhbCcpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAnZGF0YS12Zy10YXJnZXQnLCAnIycgKyBpZCk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQoYnRuQ2xvc2UsICdhcmlhLWxhYmVsJywgJ2Nsb3NlJyk7XHJcblx0XHRidG5DbG9zZS5jbGFzc0xpc3QuYWRkKCd2Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRjb250ZW50LmFwcGVuZChidG5DbG9zZSk7XHJcblxyXG5cdFx0bGV0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtYm9keScpO1xyXG5cclxuXHRcdGNvbnRlbnQuYXBwZW5kKGJvZHkpO1xyXG5cdFx0ZGlhbG9nLmFwcGVuZChjb250ZW50KTtcclxuXHRcdF9lbGVtZW50LmFwcGVuZChkaWFsb2cpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKF9lbGVtZW50KTtcclxuXHJcblx0XHRjb25zdCBtb2RhbCA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShfZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrLCBbbW9kYWxdKTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24gPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9pc1Nob3duID0gdHJ1ZTtcclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5fc2Nyb2xsQmFyLmhpZGUoKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHJcblx0XHR0aGlzLl9hZGRGaWVsZHNJbk1vZGFsKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0dGhpcy5fYWRqdXN0RGlhbG9nKCk7XHJcblxyXG5cdFx0QmFja2Ryb3Auc2hvdygoKSA9PiB0aGlzLl9zaG93RWxlbWVudChyZWxhdGVkVGFyZ2V0KSk7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9pc1Nob3duIHx8IHRoaXMuX2lzVHJhbnNpdGlvbmluZykgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2lzU2hvd24gPSBmYWxzZTtcclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcblx0XHR0aGlzLl9hbmltYXRpb24oKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKCgpID0+IHRoaXMuX2hpZGVNb2RhbCgpLCB0aGlzLl9lbGVtZW50LCB0aGlzLl9pc0FuaW1hdGVkKCkpO1xyXG5cdFx0fSwgODAwKTtcclxuXHR9XHJcblxyXG5cdF9oaWRlTW9kYWwoKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHR0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLW1vZGFsJyk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0QmFja2Ryb3AuaGlkZSgoKSA9PiB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX09QRU4pO1xyXG5cdFx0XHR0aGlzLl9yZXNldEFkanVzdG1lbnRzKCk7XHJcblx0XHRcdHRoaXMuX3Njcm9sbEJhci5yZXNldCgpO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0X3Nob3dFbGVtZW50KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLl9lbGVtZW50KSkge1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLl9lbGVtZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsIHRydWUpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnNjcm9sbFRvcCA9IDA7XHJcblxyXG5cdFx0Y29uc3QgbW9kYWxCb2R5ID0gU2VsZWN0b3JzLmZpbmQoU0VMRUNUT1JfTU9EQUxfQk9EWSwgdGhpcy5fZGlhbG9nKTtcclxuXHRcdGlmIChtb2RhbEJvZHkpIHtcclxuXHRcdFx0bW9kYWxCb2R5LnNjcm9sbFRvcCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVmbG93KHRoaXMuX2VsZW1lbnQpO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpXHJcblxyXG5cdFx0Y29uc3QgdHJhbnNpdGlvbkNvbXBsZXRlID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKHRyYW5zaXRpb25Db21wbGV0ZSwgdGhpcy5fZGlhbG9nLCB0aGlzLl9pc0FuaW1hdGVkKCkpXHJcblx0fVxyXG5cclxuXHRfaXNBbmltYXRlZCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0ZBREUpXHJcblx0fVxyXG5cclxuXHRfYW5pbWF0aW9uKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9pc0FuaW1hdGVkKCkpIHtcclxuXHRcdFx0bGV0IGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24odGhpcy5fZWxlbWVudCwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbik7XHJcblx0XHRcdGFuaW1hdGlvbi50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9hZGp1c3REaWFsb2coKSB7XHJcblx0XHRjb25zdCBpc01vZGFsT3ZlcmZsb3dpbmcgPSB0aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuXHRcdGNvbnN0IHNjcm9sbGJhcldpZHRoID0gdGhpcy5fc2Nyb2xsQmFyLmdldFdpZHRoKClcclxuXHRcdGNvbnN0IGlzQm9keU92ZXJmbG93aW5nID0gc2Nyb2xsYmFyV2lkdGggPiAwXHJcblxyXG5cdFx0aWYgKGlzQm9keU92ZXJmbG93aW5nICYmICFpc01vZGFsT3ZlcmZsb3dpbmcpIHtcclxuXHRcdFx0Y29uc3QgcHJvcGVydHkgPSBpc1JUTCgpID8gJ3BhZGRpbmdMZWZ0JyA6ICdwYWRkaW5nUmlnaHQnXHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuc3R5bGVbcHJvcGVydHldID0gYCR7c2Nyb2xsYmFyV2lkdGh9cHhgXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFpc0JvZHlPdmVyZmxvd2luZyAmJiBpc01vZGFsT3ZlcmZsb3dpbmcpIHtcclxuXHRcdFx0Y29uc3QgcHJvcGVydHkgPSBpc1JUTCgpID8gJ3BhZGRpbmdSaWdodCcgOiAncGFkZGluZ0xlZnQnXHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuc3R5bGVbcHJvcGVydHldID0gYCR7c2Nyb2xsYmFyV2lkdGh9cHhgXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcmVzZXRBZGp1c3RtZW50cygpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSAnJ1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJ1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gRVNDQVBFX0tFWSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbigpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfS0VZX1JFU0laRSwgKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5faXNTaG93biAmJiAhdGhpcy5faXNUcmFuc2l0aW9uaW5nKSB0aGlzLl9hZGp1c3REaWFsb2coKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfTU9VU0VET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uZSh0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfRElTTUlTUywgZXZlbnQyID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5fZWxlbWVudCAhPT0gZXZlbnQudGFyZ2V0IHx8IHRoaXMuX2VsZW1lbnQgIT09IGV2ZW50Mi50YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5iYWNrZHJvcCA9PT0gJ3N0YXRpYycpIHtcclxuXHRcdFx0XHRcdHRoaXMuX3RyaWdnZXJCYWNrZHJvcFRyYW5zaXRpb24oKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLl9wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X3RyaWdnZXJCYWNrZHJvcFRyYW5zaXRpb24oKSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaXNNb2RhbE92ZXJmbG93aW5nID0gdGhpcy5fZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG5cdFx0Y29uc3QgaW5pdGlhbE92ZXJmbG93WSA9IHRoaXMuX2VsZW1lbnQuc3R5bGUub3ZlcmZsb3dZO1xyXG5cclxuXHRcdGlmIChpbml0aWFsT3ZlcmZsb3dZID09PSAnaGlkZGVuJyB8fCB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NUQVRJQykpIHJldHVybjtcclxuXHRcdGlmICghaXNNb2RhbE92ZXJmbG93aW5nKSB0aGlzLl9lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NUQVRJQyk7XHJcblxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjaygoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NUQVRJQyk7XHJcblx0XHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gaW5pdGlhbE92ZXJmbG93WTtcclxuXHRcdFx0fSwgdGhpcy5fZGlhbG9nKTtcclxuXHRcdH0sIHRoaXMuX2RpYWxvZyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRmllbGRzSW5Nb2RhbChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMocmVsYXRlZFRhcmdldCwgdGhpcy5fcGFyYW1zKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX3BhcmFtcy5maWVsZHMubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdGlmICghJ25hbWUnIGluIGl0ZW0gJiYgISd2YWx1ZScgaW4gaXRlbSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0bGV0IGVsZW1lbnRzID0gU2VsZWN0b3JzLmZpbmRBbGwoJ1tkYXRhLScgKyBpdGVtLm5hbWUgKyAnXScpO1xyXG5cdFx0XHRpZiAoIWVsZW1lbnRzLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Zm9yIChjb25zdCBlbG0gb2YgZWxlbWVudHMpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKGVsbS50YWdOYW1lKSB7XHJcblx0XHRcdFx0XHRjYXNlICdJTlBVVCc6IGVsbS52YWx1ZSA9IGl0ZW0udmFsdWU7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnSU1HJzogTWFuaXB1bGF0b3Iuc2V0KGVsbSwgJ3NyYycsIGl0ZW0udmFsdWUpOyBicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6IGVsbS5pbm5lckhUTUwgPSBpdGVtLnZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWR01vZGFsKTtcclxuXHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX1NIT1csIHNob3dFdmVudCA9PiB7XHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHR9KTtcclxuXHJcblx0Y29uc3QgYWxyZWFkeU9wZW4gPSBTZWxlY3RvcnMuZmluZChPUEVOX1NFTEVDVE9SKTtcclxuXHRpZiAoYWxyZWFkeU9wZW4pIFZHTW9kYWwuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKTtcclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpO1xyXG5cdGRhdGEudG9nZ2xlKHRoaXMpO1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdNb2RhbDsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9yZXNwb25zaXZlXCI7XHJcbmltcG9ydCB7Z2V0U1ZHfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNWaXNpYmxlLCBtZXJnZURlZXBPYmplY3QsIG5vb3AsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbmF2JztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubmF2JztcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgQ2xhc3Nlc1xyXG4gKi9cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XICAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgID0gJ2ZhZGUnO1xyXG5jb25zdCBDTEFTU19OQU1FX0FDVElWRSA9ICdhY3RpdmUnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICcudmctbmF2IGEnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBFdmVudHNcclxuICovXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgID0gYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlVUF9EQVRBX0FQSSA9IGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX1JFU0laRV9EQVRBX0FQSSA9IGByZXNpemUuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdOYXYgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJyZWFrcG9pbnQ6IGZhbHNlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdob3Jpem9udGFsJyxcclxuXHRcdFx0Y2xhc3Nlczoge1xyXG5cdFx0XHRcdGhhbWJ1cmdlckFjdGl2ZTogJ3ZnLW5hdi1oYW1idXJnZXItYWN0aXZlJyxcclxuXHRcdFx0XHRoYW1idXJnZXJBbHdheXM6ICd2Zy1uYXYtaGFtYnVyZ2VyLWFsd2F5cycsXHJcblx0XHRcdFx0aGFtYnVyZ2VyOiAndmctbmF2LWhhbWJ1cmdlcicsXHJcblx0XHRcdFx0Y29udGFpbmVyOiAndmctbmF2LWNvbnRhaW5lcicsXHJcblx0XHRcdFx0d3JhcHBlcjogJ3ZnLW5hdi13cmFwcGVyJyxcclxuXHRcdFx0XHRhY3RpdmU6ICd2Zy1uYXYtYWN0aXZlJyxcclxuXHRcdFx0XHRleHBhbmQ6ICd2Zy1uYXYtZXhwYW5kJyxcclxuXHRcdFx0XHRjbG9uZWQ6ICd2Zy1uYXYtY2xvbmVkJyxcclxuXHRcdFx0XHRob3ZlcjogJ3ZnLW5hdi1ob3ZlcicsXHJcblx0XHRcdFx0ZmxpcDogJ3ZnLW5hdi1mbGlwJyxcclxuXHRcdFx0XHRYWFhMOiAndmctbmF2LXh4eGwnLFxyXG5cdFx0XHRcdFhYTDogJ3ZnLW5hdi14eGwnLFxyXG5cdFx0XHRcdFhMOiAndmctbmF2LXhsJyxcclxuXHRcdFx0XHRMRzogJ3ZnLW5hdi1sZycsXHJcblx0XHRcdFx0TUQ6ICd2Zy1uYXYtbWQnLFxyXG5cdFx0XHRcdFNNOiAndmctbmF2LXNtJyxcclxuXHRcdFx0XHRYUzogJ3ZnLW5hdi14cydcclxuXHRcdFx0fSxcclxuXHRcdFx0ZXhwYW5kOiB0cnVlLFxyXG5cdFx0XHRob3ZlcjogZmFsc2UsXHJcblx0XHRcdHBvc2l0aW9uOiB0cnVlLFxyXG5cdFx0XHRjb2xsYXBzZTogdHJ1ZSxcclxuXHRcdFx0dG9nZ2xlOiAnPHNwYW4gY2xhc3M9XCJkZWZhdWx0XCI+PC9zcGFuPicsXHJcblx0XHRcdGhhbWJ1cmdlcjoge1xyXG5cdFx0XHRcdGVuYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRhbHdheXM6IGZhbHNlLFxyXG5cdFx0XHRcdHRpdGxlOiAnJyxcclxuXHRcdFx0XHRib2R5OiBudWxsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNhbGxiYWNrOiBub29wLFxyXG5cdFx0XHRhbmltYXRpb246IHRydWUsXHJcblx0XHRcdHRpbWVvdXRBbmltYXRpb246IDMwMCxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IG51bGw7XHJcblx0XHR0aGlzLm5hdmlnYXRpb24gPSAnLicgKyB0aGlzLl9wYXJhbXMuY2xhc3Nlcy53cmFwcGVyO1xyXG5cclxuXHRcdHRoaXMubW92ZWRMaW5rcyA9IFtdO1xyXG5cdFx0dGhpcy4kbGlua3MgPSBTZWxlY3RvcnMuZmluZEFsbCgnLicgKyB0aGlzLl9wYXJhbXMuY2xhc3Nlcy53cmFwcGVyICsgJyA+IGxpJywgdGhpcy5uYXZpZ2F0aW9uKVxyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMuYW5pbWF0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLl9wYXJhbXMudGltZW91dEFuaW1hdGlvbiA9IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHRnZXQgbmF2aWdhdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9uYXZpZ2F0aW9uO1xyXG5cdH1cclxuXHJcblx0c2V0IG5hdmlnYXRpb24oZWwpIHtcclxuXHRcdGxldCBlbG0gPSBTZWxlY3RvcnMuZmluZChlbCwgdGhpcy5fZWxlbWVudCk7XHJcblx0XHRpZiAoIWVsbSkgcmV0dXJuO1xyXG5cdFx0dGhpcy5fbmF2aWdhdGlvbiA9IGVsbTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0aWYgKCF0aGlzLm5hdmlnYXRpb24pIHJldHVybjtcclxuXHJcblx0XHRsZXQgcGFyYW1zID0gdGhpcy5fcGFyYW1zO1xyXG5cclxuXHRcdC8vINCS0LXRiNCw0LXQvCDQvtGB0L3QvtCy0L3Ri9C1INC60LvQsNGB0YHRi1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc2VzLmNvbnRhaW5lcik7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLnBsYWNlbWVudCk7XHJcblxyXG5cdFx0Ly8g0JXRgdC70Lgg0L3Rg9C20L3QviDQvtGB0YLQsNCy0LjRgtGMINGB0L/QuNGB0L7QuiDQvNC10L3RjiDQuNC70Lgg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0LzQtdC00LjQsCDRgtC+0YfQutGDXHJcblx0XHRpZiAoIXBhcmFtcy5icmVha3BvaW50KSB7XHJcblx0XHRcdHBhcmFtcy5leHBhbmQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXBhcmFtcy5oYW1idXJnZXIuYWx3YXlzKSB7XHJcblx0XHRcdGlmICghcGFyYW1zLmJyZWFrcG9pbnQgfHwgIXBhcmFtcy5leHBhbmQpIHtcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuZXhwYW5kKTtcclxuXHRcdFx0fSBlbHNlIGlmIChwYXJhbXMuYnJlYWtwb2ludCAhPT0gZmFsc2UpIHtcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLW5hdi0nICsgcGFyYW1zLmJyZWFrcG9pbnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyQWx3YXlzKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyDQnNC10L3RjiDRgdGA0LDQsdCw0YLRi9Cy0LDQtdGCINC/0YDQuCDQvdCw0LLQtdC00LXQvdC40LgsINC10YHQu9C4INGN0YLQviDQvdC1INC80L7QsdC40LvRjNC90L7QtSDRg9GB0YLRgNC+0LnRgdGC0LLQvlxyXG5cdFx0aWYgKHBhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuaG92ZXIpO1xyXG5cclxuXHRcdFx0aWYgKFJlc3BvbnNpdmUuY2hlY2tNb2JpbGVPclRhYmxldCgpKSB7XHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHBhcmFtcy5jbGFzc2VzLmhvdmVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INCz0LDQvNCx0YPRgNCz0LXRgCwg0LXRgdC70Lgg0LXQs9C+INC90LXRgiDQsiDRgNCw0LfQvNC10YLQutC1XHJcblx0XHRpZiAocGFyYW1zLmV4cGFuZCAmJiAhcGFyYW1zLmhhbWJ1cmdlci5ib2R5KSB7XHJcblx0XHRcdGxldCBpc0hhbWJ1cmdlciA9IFNlbGVjdG9ycy5maW5kKCcuJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciwgdGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0XHRpZiAoaXNIYW1idXJnZXIgPT09IG51bGwpIHtcclxuXHRcdFx0XHRsZXQgbVRpdGxlID0gJycsXHJcblx0XHRcdFx0XHRoYW1idXJnZXIgPSAnPHNwYW4gY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJy0tbGluZXNcIj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48L3NwYW4+JztcclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIudGl0bGUpIHtcclxuXHRcdFx0XHRcdG1UaXRsZSA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS10aXRsZVwiPicrIHBhcmFtcy5oYW1idXJnZXIudGl0bGUgKyc8L3NwYW4+JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwYXJhbXMuaGFtYnVyZ2VyLmJvZHkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9IHBhcmFtcy5oYW1idXJnZXIuYm9keTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywnPGEgaHJlZj1cIiNzaWRlYmFyLW5hdlwiIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICdcIiBkYXRhLXZnLXRvZ2dsZT1cInNpZGViYXJcIj4nICsgbVRpdGxlICsgaGFtYnVyZ2VyICsnPC9hPicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0YPQutCw0LfQsNGC0LXQu9GMINC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9GPXHJcblx0XHRpZiAocGFyYW1zLnRvZ2dsZSkge1xyXG5cdFx0XHRsZXQgJGRyb3Bkb3duX2EgPSBbLi4uU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bi1tZWdhID4gYSwgLmRyb3Bkb3duID4gYScsIHRoaXMuX2VsZW1lbnQpXSxcclxuXHRcdFx0XHR0b2dnbGUgPSAnPHNwYW4gY2xhc3M9XCJ0b2dnbGVcIj4nICsgcGFyYW1zLnRvZ2dsZSArICc8L3NwYW4+JztcclxuXHJcblx0XHRcdGlmICgkZHJvcGRvd25fYS5sZW5ndGgpIHtcclxuXHRcdFx0XHQkZHJvcGRvd25fYS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWVsZW0ucXVlcnlTZWxlY3RvcignLnRvZ2dsZScpICYmICFlbGVtLmNsb3Nlc3QoJy5kb3RzJykpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG5cdFx0XHRcdFx0XHRlbGVtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdG9nZ2xlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtcy5jb2xsYXBzZSAmJiBSZXNwb25zaXZlLmNoZWNrKHRoaXMpICYmIHBhcmFtcy5wbGFjZW1lbnQgIT09ICd2ZXJ0aWNhbCcpIHtcclxuXHRcdFx0c2V0Q29sbGFwc2UodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdhZnRlckluaXQnIGluIHRoaXMuX3BhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRleGVjdXRlKHRoaXMuX3BhcmFtcy5jYWxsYmFjay5hZnRlckluaXQsIFt0aGlzXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiDQpNGD0L3QutGG0LjRjyDRgdCy0L7RgNCw0YfQuNCy0LDQvdC40Y9cclxuXHRcdCAqIFRPRE8g0J/RgNC40LTRg9C80LDRgtGMINGH0YLQviDRgtC+INGBINC80LXQs9CwINC80LXQvdGOLCDQutC+0YLQvtGA0L7QtSDRg9GF0L7QtNC40YIg0LIg0L/QvtC00LzQtdC90Y5cclxuXHRcdCAqIFRPRE8g0KLQsNC6INC20LUg0LXRgdGC0Ywg0LrQvtGB0Y/QutC4INC/0YDQuCDRgNC10YHQsNC50LfQtVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBzZXRDb2xsYXBzZShfdGhpcykge1xyXG5cdFx0XHRsZXQgd2lkdGhfbmF2aWdhdGlvbl9yZXNwb25zaXZlID0gX3RoaXMubmF2aWdhdGlvbi5jbGllbnRXaWR0aCxcclxuXHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IDAsXHJcblx0XHRcdFx0JGRvdHMgPSBTZWxlY3RvcnMuZmluZCgnLmRvdHMnLCBfdGhpcy5uYXZpZ2F0aW9uKSxcclxuXHRcdFx0XHRfZG90cyA9IGdldFNWRygnZG90cycpO1xyXG5cclxuXHRcdFx0aWYgKF90aGlzLiRsaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gJGRvdHMuY2xpZW50V2lkdGhcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bGV0ICRhID0gU2VsZWN0b3JzLmZpbmQoJ2EnLCBfdGhpcy4kbGlua3NbMF0pLFxyXG5cdFx0XHRcdFx0XHQkbGlua1N0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSgkYSksXHJcblx0XHRcdFx0XHRcdHBhZGRpbmdMZWZ0ID0gbm9ybWFsaXplRGF0YSgkbGlua1N0eWxlLnBhZGRpbmdMZWZ0LnNsaWNlKDAsIC0yKSksXHJcblx0XHRcdFx0XHRcdHBhZGRpbmdSaWdodCA9ICBub3JtYWxpemVEYXRhKCRsaW5rU3R5bGUucGFkZGluZ1JpZ2h0LnNsaWNlKDAsIC0yKSksXHJcblx0XHRcdFx0XHRcdHBhZGRpbmcgPSBwYWRkaW5nTGVmdCArIHBhZGRpbmdSaWdodDtcclxuXHJcblx0XHRcdFx0XHQvLyBUT0RPINC90LUg0YHQvtCy0YHQtdC8INCy0LXRgNC90L4sINC90L4g0LzRiyDRgtC+0YfQvdC+INC30L3QsNC10Lwg0YjQuNGA0LjQvdGDINGC0L7Rh9C10Log0LIgc3ZnIC0gMTZweFxyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSBwYWRkaW5nICsgMTY7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGxldCAkbGluayBvZiBfdGhpcy4kbGlua3MpIHtcclxuXHRcdFx0XHRcdGxldCB3aWR0aCA9ICRsaW5rLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSB3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSArIHdpZHRoO1xyXG5cclxuXHRcdFx0XHRcdGlmICgod2lkdGhfbmF2aWdhdGlvbl9yZXNwb25zaXZlKSA8IHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVkTGlua3MucHVzaCgkbGluayk7XHJcblx0XHRcdFx0XHRcdCRsaW5rLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmluc2VydEJlZm9yZShfdGhpcy5tb3ZlZExpbmtzWzBdLCAkZG90cylcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5hcHBlbmRDaGlsZChfdGhpcy5tb3ZlZExpbmtzWzBdKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRfdGhpcy5tb3ZlZExpbmtzLnNwbGljZSgwLCAxKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKF90aGlzLm1vdmVkTGlua3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRpZiAoISRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCc8bGkgY2xhc3M9XCJkcm9wZG93biBkb3RzXCI+JyArICc8YSBocmVmPVwiI1wiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPicrIF9kb3RzICsnPC9hPjwvbGk+Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0XHQkZG90cy5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCAkZCA9IF90aGlzLm5hdmlnYXRpb24ucXVlcnlTZWxlY3RvcignLmRvdHMnKTtcclxuXHRcdFx0XHRpZiAoJGQgJiYgX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGxldCAkZHJvcGRvd24gPSAkZC5xdWVyeVNlbGVjdG9yKCd1bCcpO1xyXG5cdFx0XHRcdFx0aWYgKCRkcm9wZG93bikge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsaW5rIG9mIF90aGlzLm1vdmVkTGlua3MpIHtcclxuXHRcdFx0XHRcdFx0XHQkZHJvcGRvd24ucHJlcGVuZChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0ICRkcm9wZG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcblx0XHRcdFx0XHRcdCRkcm9wZG93bi5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bi1jb250ZW50Jyk7XHJcblx0XHRcdFx0XHRcdCRkcm9wZG93bi5jbGFzc0xpc3QuYWRkKCdyaWdodCcpO1xyXG5cclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbGluayBvZiBfdGhpcy5tb3ZlZExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdFx0JGRyb3Bkb3duLnByZXBlbmQobGluayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdCRkLmFwcGVuZENoaWxkKCRkcm9wZG93bik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGxldCB0YXJnZXQgPSByZWxhdGVkVGFyZ2V0LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0aWYgKCF0YXJnZXQgfHwgaXNEaXNhYmxlZCh0YXJnZXQpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24tY29udGVudCcpKSB7XHJcblx0XHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaXJzdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRhcmdldCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBkcm9wID0gU2VsZWN0b3JzLmZpbmQoJy5kcm9wZG93bi1jb250ZW50JywgdGFyZ2V0KSxcclxuXHRcdFx0bGluayA9IHRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcblx0XHRpZiAobGluaykgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG5cdFx0ZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0FDVElWRSk7XHJcblxyXG5cdFx0c2V0RHJvcFBvc2l0aW9uKGRyb3ApXHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0ZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRhcmdldCwgRVZFTlRfS0VZX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCBkcm9wLCB0cnVlLCA1MCk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtICRkcm9wXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIHNldERyb3BQb3NpdGlvbigkZHJvcCkge1xyXG5cdFx0XHRsZXQge3dpZHRoLCByaWdodH0gPSAkZHJvcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuXHRcdFx0XHR3aW5kb3dfd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcblx0XHRcdGxldCBOX3JpZ2h0ID0gd2luZG93X3dpZHRoIC0gcmlnaHQgLSB3aWR0aDtcclxuXHJcblx0XHRcdCRkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ3JpZ2h0Jyk7XHJcblx0XHRcdCRkcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2xlZnQnKTtcclxuXHJcblx0XHRcdGxldCAkcGFyZW50ID0gJGRyb3AuY2xvc2VzdCgnbGknKSxcclxuXHRcdFx0XHQkdWwgPSAkcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3VsJyk7XHJcblxyXG5cdFx0XHRpZiAoTl9yaWdodCA+IHdpZHRoKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCAkZWwgb2YgJHVsKSB7XHJcblx0XHRcdFx0XHQkZWwuY2xhc3NMaXN0LmFkZCgnbGVmdCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0ICRlbCBvZiAkdWwpIHtcclxuXHRcdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdyaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBlbGVtZW50ID0gcmVsYXRlZFRhcmdldC5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICgnZWxtJyBpbiByZWxhdGVkVGFyZ2V0ICYmIHJlbGF0ZWRUYXJnZXQuZWxtKSB7XHJcblx0XHRcdGVsZW1lbnQgPSByZWxhdGVkVGFyZ2V0LmVsbVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlbGVtZW50KSB7XHJcblx0XHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKGVsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXJzdCcpKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaXJzdCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRbLi4uU2VsZWN0b3JzLmZpbmRBbGwoJy4nICsgQ0xBU1NfTkFNRV9TSE9XLCBlbGVtZW50KV0uZm9yRWFjaChmdW5jdGlvbiAoZWwsIGluZGV4KSB7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0ZBREUpO1xyXG5cclxuXHRcdFx0XHRsZXQgcGFyZW50ID0gZWwuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0aWYgKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9BQ1RJVkUpKSB7XHJcblx0XHRcdFx0XHRwYXJlbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgbGluayA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdFx0aWYgKGxpbmspIGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRcdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihlbCwgRVZFTlRfS0VZX0hJRERFTiwgcmVsYXRlZFRhcmdldClcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCBlbCwgdHJ1ZSwgNTAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVE9ETyDQtdGB0LvQuCDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0L3QtdGB0LrQvtC70YzQutC+INC90LDQstC40LPQsNGG0LjQuSwg0YLQviDQtdGB0YLRjCDQutC+0YHRj9C60LhcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBwYXJhbXNcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR05hdi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblx0XHRpbnN0YW5jZS5idWlsZCgpO1xyXG5cclxuXHRcdGxldCBkcm9wcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd24nLCBpbnN0YW5jZS5fbmF2aWdhdGlvbilcclxuXHJcblx0XHRpZiAoaW5zdGFuY2UuX3BhcmFtcy5ob3Zlcikge1xyXG5cdFx0XHRbLi4uZHJvcHNdLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoY3VycmVudEVsZW0pIHJldHVybjtcclxuXHRcdFx0XHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGlmICghaW5zdGFuY2UubmF2aWdhdGlvbi5jb250YWlucyh0YXJnZXQpKSByZXR1cm47XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IHtcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldDogdGFyZ2V0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2Uuc2hvdyhyZWxhdGVkVGFyZ2V0KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWwsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmICghY3VycmVudEVsZW0pIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Bkb3duJyksXHJcblx0XHRcdFx0XHRcdGVsbSA9IGN1cnJlbnRFbGVtO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGVsbTogZWxtfSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZVVBfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR05hdi5jbGVhckRyb3BzKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghTWFuaXB1bGF0b3IuaGFzKHRoaXMsICdhcmlhLWV4cGFuZGVkJykpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICgnY2xpY2snIGluIGluc3RhbmNlLl9wYXJhbXMuY2FsbGJhY2spIHtcclxuXHRcdFx0XHRcdGV4ZWN1dGUoaW5zdGFuY2UuX3BhcmFtcy5jYWxsYmFjay5jbGljaywgW3RoaXNdKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdGxldCBzZWxmID0gdGhpcy5jbG9zZXN0KCcudmctbmF2JyksXHJcblx0XHRcdFx0XHRpc0ZpcnN0ID0gc2VsZi5xdWVyeVNlbGVjdG9yKCcuZmlyc3QnKTtcclxuXHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IHRoaXMuY2xvc2VzdCgnLmRyb3Bkb3duJyk7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKGlzRGlzYWJsZWQodGFyZ2V0KSAmJiAhaXNWaXNpYmxlKHRhcmdldCkpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChpc0ZpcnN0ICYmIHRoaXMuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5oaWRlKHtyZWxhdGVkVGFyZ2V0OiB0YXJnZXR9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRbLi4uU2VsZWN0b3JzLmZpbmRBbGwoJy5hY3RpdmUnLCBzZWxmKV0uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGVsICYmIGVsICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5oaWRlKHtyZWxhdGVkVGFyZ2V0OiBlbH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aW5zdGFuY2Uuc2hvdyh7cmVsYXRlZFRhcmdldDogdGFyZ2V0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHZnTmF2U2lkZWJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlYmFyLW5hdicpO1xyXG5cdFx0bGV0IGhhbWJ1cmdlciA9IGluc3RhbmNlLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaW5zdGFuY2UuX3BhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlcik7XHJcblxyXG5cdFx0aWYgKHZnTmF2U2lkZWJhciAmJiBoYW1idXJnZXIpIHtcclxuXHRcdFx0dmdOYXZTaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZnLnNpZGViYXIuc2hvdycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRoYW1idXJnZXIuY2xhc3NMaXN0LmFkZChpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyQWN0aXZlKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5oaWRlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKGluc3RhbmNlLl9wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHTmF2LmhpZGVPcGVuRHJvcHMoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZU9wZW5Ecm9wcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpLmFjdGl2ZScpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR05hdi5nZXRJbnN0YW5jZSh0b2dnbGUuY2xvc2VzdCgnLnZnLW5hdicpKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSBjb250aW51ZTtcclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLmZpcnN0JykpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRvZ2dsZSB9XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdHJlbGF0ZWRUYXJnZXQuY2xpY2tFdmVudCA9IGV2ZW50XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHQuaGlkZShyZWxhdGVkVGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfUkVTSVpFX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoJy52Zy1uYXYnLCB7fSk7XHJcblx0aW5zdGFuY2UuYnVpbGQoKTtcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHTmF2OyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIGlzVmlzaWJsZSwgbWVyZ2VEZWVwT2JqZWN0LCBub29wfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAncm9sbHVwJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcucm9sbHVwJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0hJREUgPSAnZC1ub25lJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJyb2xsdXBcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHUm9sbHVwICBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdSb2xsdXAuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblxyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRjb25zdCBkYXRhID0gVkdSb2xsdXAuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHUm9sbHVwOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIGlzVmlzaWJsZSwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9vdmVyZmxvd1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdzaWRlYmFyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuc2lkZWJhcic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCJdJ1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdTaWRlYmFyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblx0XHR0aGlzLl9kaXNtaXNzRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcm91dGUoKTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihTZWxlY3RvcnMuZmluZCgnLnZnLWJhY2tkcm9wJyksICdtb3VzZWRvd24udmcuYmFja2Ryb3AnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlLCA1MClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHJldHVybjtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdTaWRlYmFyKTtcclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfS0VZX0hJRERFTiwgKCkgPT4ge1xyXG5cdFx0Ly9pZiAoaXNWaXNpYmxlKHRoaXMpKSB0aGlzLmZvY3VzKCk7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kKCcudmctc2lkZWJhci5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VkdTaWRlYmFyLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWR1NpZGViYXIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCJpbXBvcnQge21lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YHRiyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuSDRgdC80L7RgtGA0LjQvCDQt9C00LXRgdGMXHJcbiAqIGh0dHBzOi8vYW5pbWF0ZS5zdHlsZS9cclxuICovXHJcbmNsYXNzIEFuaW1hdGlvbiB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGluOiAnYW5pbWF0ZV9fYmFja0luVXAnLFxyXG5cdFx0XHRvdXQ6ICdhbmltYXRlX19iYWNrT3V0VXAnLFxyXG5cdFx0XHRkdXJhdGlvbjogMTAwMCxcclxuXHRcdFx0ZGVsYXk6IDEwMDAsXHJcblx0XHRcdHJlcGVhdDogMVxyXG5cdFx0fSwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbmltYXRlX19hbmltYXRlZCcpKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZV9fYW5pbWF0ZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdGlmICh0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLl9wYXJhbXMuaW4pKSB7XHJcblx0XHRcdHRoaXMub3V0KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmluKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3BhcmFtcy5vdXQpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5pbik7XHJcblx0fVxyXG5cclxuXHRvdXQoY2FsbGJhY2spIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9wYXJhbXMuaW4pO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5vdXQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uOyIsImltcG9ydCB7ZXhlY3V0ZX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4vb3ZlcmZsb3dcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSAnYmFja2Ryb3AnO1xyXG5jb25zdCBDTEFTU19OQU1FID0gJ3ZnLWJhY2tkcm9wJztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnO1xyXG5jb25zdCBFVkVOVF9NT1VTRURPV04gPSBgbW91c2Vkb3duLnZnLiR7TkFNRX1gO1xyXG5cclxuY2xhc3MgQmFja2Ryb3Age1xyXG5cdHN0YXRpYyBzaG93KGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fYXBwZW5kKClcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGUoY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9kZXN0cm95KCk7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfYXBwZW5kKCkge1xyXG5cdFx0aWYgKFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFja2Ryb3ApO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSlcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24oYmFja2Ryb3AsIEVWRU5UX01PVVNFRE9XTiwgKCkgPT4ge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKClcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2Rlc3Ryb3koKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUUpO1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHR9LCAxMDApO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja2Ryb3A7IiwiaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgT3ZlcmZsb3dcclxuICog0JfQsNC/0YDQtdGJ0LDQtdGCINGB0LrRgNC+0LvQu9C40L3QsyDQuCDRg9Cx0LjRgNCw0LXRgiDQtdCz0L4sINC60L7QvNC/0LXQvdGB0LjRgNGD0Y8g0L7RgtGB0YLRg9C/0L7QvFxyXG4gKi9cclxuXHJcbmNsYXNzIE92ZXJmbG93IHtcclxuXHRzdGF0aWMgYXBwZW5kKCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBnZXRXaWR0aCgpICsgJ3B4JztcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcblx0XHRmdW5jdGlvbiBnZXRXaWR0aCgpIHtcclxuXHRcdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cdFx0XHRyZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGRlc3Ryb3koKSB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG5cclxuXHRcdGxldCBzdHlsZXMgPSBNYW5pcHVsYXRvci5nZXQoZG9jdW1lbnQuYm9keSwgJ3N0eWxlJyk7XHJcblx0XHRpZiAoIXN0eWxlcykgTWFuaXB1bGF0b3IucmVtb3ZlKGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3ZlcmZsb3c7IiwiaW1wb3J0IHtpc0VsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vZG9tL21hbmlwdWxhdG9yXCI7XHJcblxyXG5jbGFzcyBQYXJhbXMge1xyXG5cdGNvbnN0cnVjdG9yKHBhcmFtcywgZWxlbWVudCA9IG51bGwpIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMubWVyZ2UocGFyYW1zLCBlbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdGdldCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9wYXJhbXM7XHJcblx0fVxyXG5cclxuXHRmcm9tRWxlbWVudChlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gaXNFbGVtZW50KGVsZW1lbnQpID8gTWFuaXB1bGF0b3IuZ2V0KGVsZW1lbnQpIDoge307XHJcblx0fVxyXG5cclxuXHRtZXJnZShwYXJhbXMsIGVsZW1lbnQpIHtcclxuXHRcdGxldCBtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHBhcmFtcywgdGhpcy5mcm9tRWxlbWVudChlbGVtZW50KSk7XHJcblxyXG5cdFx0Zm9yIChsZXQga2V5IGluIG1QYXJhbXMpIHtcclxuXHRcdFx0aWYgKGtleS5pbmRleE9mKCctJykgIT09IC0xKSB7XHJcblx0XHRcdFx0bGV0IGtleXMgPSBrZXkuc3BsaXQoJy0nKSxcclxuXHRcdFx0XHRcdHZhbHVlID0gbm9ybWFsaXplRGF0YShtUGFyYW1zW2tleV0pO1xyXG5cclxuXHRcdFx0XHRpZiAoa2V5c1swXSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdFx0XHRpZiAoa2V5c1sxXSBpbiBtUGFyYW1zW2tleXNbMF1dKSB7XHJcblx0XHRcdFx0XHRcdG1QYXJhbXNba2V5c1swXV1ba2V5c1sxXV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2tleV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ3BhcmFtcycgaW4gbVBhcmFtcykge1xyXG5cdFx0XHRtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KG1QYXJhbXMsIG1QYXJhbXMucGFyYW1zKTtcclxuXHRcdFx0ZGVsZXRlIG1QYXJhbXMucGFyYW1zO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBtUGFyYW1zO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGFyYW1zOyIsImltcG9ydCB7bWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JrQu9Cw0YHRgSBQbGFjZW1lbnQsINC+0L/RgNC10LTQtdC70Y/QtdGCINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC80LXRgdGC0L7Qv9C+0LvQvtC20LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQvdCwINGB0YLRgNCw0L3QuNGG0LUuXHJcbiAqIFRPRE8g0LrQu9Cw0YHRgSDQvdC1INC00L7Qv9C40YHQsNC9XHJcbiAqL1xyXG5cclxuY2xhc3MgUGxhY2VtZW50IHtcclxuXHRjb25zdHJ1Y3RvcihhcmcgPSB7fSkge1xyXG5cdFx0dGhpcy5wYXJhbXMgPSBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRlbGVtZW50OiBudWxsLFxyXG5cdFx0XHRkcm9wOiBudWxsXHJcblx0XHR9LCBhcmcpO1xyXG5cdH1cclxuXHJcblx0X2dldFBsYWNlbWVudCgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGNvbnN0IF9wYXJlbnQgPSAoc2VsZikgPT4ge1xyXG5cdFx0XHRsZXQgcGFyZW50ID0gc2VsZi5wYXJlbnROb2RlLFxyXG5cdFx0XHRcdG92ZXJmbG93ID0gZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnQpLm92ZXJmbG93O1xyXG5cclxuXHRcdFx0aWYgKHBhcmVudC50YWdOYW1lICE9PSAnQk9EWScpIHtcclxuXHRcdFx0XHRpZiAob3ZlcmZsb3cgPT09ICd2aXNpYmxlJykge1xyXG5cdFx0XHRcdFx0X3BhcmVudChwYXJlbnQpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJlbnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGlzRml4ZWQgPSBmYWxzZSwgdG9wLCBsZWZ0LFxyXG5cdFx0XHRib3VuZHMgPSBfdGhpcy5wYXJhbXMuZHJvcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuXHRcdFx0cGFyZW50ID0gX3RoaXMucGFyYW1zLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0aWYgKF9wYXJlbnQoX3RoaXMucGFyYW1zLmVsZW1lbnQpKSB7XHJcblx0XHRcdGlzRml4ZWQgPSB0cnVlO1xyXG5cdFx0XHR0b3AgPSBib3VuZHMudG9wO1xyXG5cdFx0XHRsZWZ0ID0gYm91bmRzLmxlZnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShfdGhpcy5wYXJhbXMuZHJvcCk7XHJcblx0XHRcdHRvcCA9IG5vcm1hbGl6ZURhdGEoc3R5bGVzLnRvcC5zbGljZSgwLCAtMikpO1xyXG5cdFx0XHRsZWZ0ID0gbm9ybWFsaXplRGF0YShzdHlsZXMubGVmdC5zbGljZSgwLCAtMikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgoYm91bmRzLmxlZnQgKyBib3VuZHMud2lkdGgpID4gd2luZG93LmlubmVyV2lkdGgpIHtcclxuXHRcdFx0bGVmdCA9IHBhcmVudC53aWR0aCAtIGJvdW5kcy53aWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpc0ZpeGVkOiBpc0ZpeGVkLFxyXG5cdFx0XHR0b3A6IHRvcCxcclxuXHRcdFx0bGVmdDogbGVmdFxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGxhY2VtZW50OyIsIi8qKlxyXG4gKiDQmtC70LDRgdGBIFJlc3BvbnNpdmUsINGA0LDQsdC+0YLQsNC10YIg0L/QviDRgtCw0LrQuNC8INC20LUg0LzQtdC00LjQsCDRgtC+0YfQutCw0LwsINGH0YLQviDQuCBib290c3RyYXBcclxuICog0Lgg0L7Qv9GA0LXQtNC10LvRj9C10YIg0L3QsCDRgtCw0Ycg0YPRgdGC0YDQvtC50YHRgtCy0LAuXHJcbiAqL1xyXG5cclxuY2xhc3MgUmVzcG9uc2l2ZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmJyZWFrcG9pbnRzID0ge1xyXG5cdFx0XHR4czogMCxcclxuXHRcdFx0c206IDU3NixcclxuXHRcdFx0bWQ6IDc2OCxcclxuXHRcdFx0bGc6IDk5MixcclxuXHRcdFx0eGw6IDEyMDAsXHJcblx0XHRcdHh4bDogMTQwMCxcclxuXHRcdFx0eHh4bDogMTYwMCxcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQldGB0LvQuCDQvdCw0YjQsCDRiNC40YDQuNC90LAg0Y3QutGA0LDQvdCwINGB0L7QstC/0LDQtNCw0LXRgiDRgSDQtNC40LDQv9Cw0LfQvtC90L7QvCDQutC+0YLQvtGA0YvQuSDRg9C60LDQt9Cw0L0g0LIg0LzQvtC00YPQu9C1INCy0YvQtNCw0LXQvCB0cnVlLCDQuNC90LDRh9C1IGZhbHNlXHJcblx0ICogQHBhcmFtIG1vZHVsZVxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVjayhtb2R1bGUpIHtcclxuXHRcdGxldCBpbnN0YW5jZSA9IG5ldyB0aGlzIDtcclxuXHRcdHJldHVybiBpbnN0YW5jZS5kZWZpbmUobW9kdWxlKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtCy0LXRgNGP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC4gVE9ETyDQvdC1INGB0L7QstGB0LXQvCDQv9GA0LDQstC40LvRjNC90L4sINC90LDQtNC+INGB0LTQtdC70LDRgtGMINC/0L4t0LTRgNGD0LPQvtC80YNcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRzdGF0aWMgY2hlY2tNb2JpbGVPclRhYmxldCgpIHtcclxuXHRcdGxldCBjaGVjayA9IGZhbHNlO1xyXG5cdFx0KGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0aWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm98YW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaS50ZXN0KGEpfHwvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc2xpY2UoMCw0KSkpe1xyXG5cdFx0XHRcdGNoZWNrID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSkobmF2aWdhdG9yLnVzZXJBZ2VudHx8bmF2aWdhdG9yLnZlbmRvcnx8d2luZG93Lm9wZXJhKTtcclxuXHJcblx0XHRyZXR1cm4gY2hlY2s7XHJcblx0fVxyXG5cclxuXHRkZWZpbmUobW9kdWxlKSB7XHJcblx0XHRsZXQgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCxcclxuXHRcdFx0cmVzcG9uc2l2ZV9zaXplID0gdGhpcy5fY2hlY2tSZXNwb25zaXZlQ2xhc3MobW9kdWxlKSxcclxuXHRcdFx0YnJlYWtwb2ludHMgPSB0aGlzLmJyZWFrcG9pbnRzLFxyXG5cdFx0XHRwb2ludCA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5maW5kKGtleSA9PiBicmVha3BvaW50c1trZXldID09PSByZXNwb25zaXZlX3NpemUpO1xyXG5cclxuXHRcdGxldCBrZXlzID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLFxyXG5cdFx0XHRsb2MgPSBrZXlzLmluZGV4T2YocG9pbnQpO1xyXG5cclxuXHRcdHJldHVybiB3aW5kb3dXaWR0aCA+PSBicmVha3BvaW50c1trZXlzW2xvYyArIDFdXTtcclxuXHR9XHJcblxyXG5cdF9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gbW9kdWxlLl9lbGVtZW50LFxyXG5cdFx0XHRwYXJhbXMgPSBtb2R1bGUuX3BhcmFtcyxcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSAwO1xyXG5cclxuXHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5MRykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLmxnO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5NRCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLm1kO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5TTSkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnNtO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YUykpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnhzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZTsiLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIHV0aWwvc2Nyb2xsQmFyLmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuXHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi9kb20vbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IHtpc0VsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vZG9tL3NlbGVjdG9yc1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuXHJcbmNvbnN0IFNFTEVDVE9SX0ZJWEVEX0NPTlRFTlQgPSAnLmZpeGVkLXRvcCwgLmZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkLCAuc3RpY2t5LXRvcCdcclxuY29uc3QgU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQgPSAnLnN0aWNreS10b3AnXHJcbmNvbnN0IFBST1BFUlRZX1BBRERJTkcgPSAncGFkZGluZy1yaWdodCdcclxuY29uc3QgUFJPUEVSVFlfTUFSR0lOID0gJ21hcmdpbi1yaWdodCdcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBkZWZpbml0aW9uXHJcbiAqL1xyXG5cclxuY2xhc3MgU2Nyb2xsQmFySGVscGVyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5ib2R5XHJcblx0fVxyXG5cclxuXHQvLyBQdWJsaWNcclxuXHRnZXRXaWR0aCgpIHtcclxuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cvaW5uZXJXaWR0aCN1c2FnZV9ub3Rlc1xyXG5cdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCB3aWR0aCA9IHRoaXMuZ2V0V2lkdGgoKVxyXG5cdFx0dGhpcy5fZGlzYWJsZU92ZXJGbG93KClcclxuXHRcdC8vIGdpdmUgcGFkZGluZyB0byBlbGVtZW50IHRvIGJhbGFuY2UgdGhlIGhpZGRlbiBzY3JvbGxiYXIgd2lkdGhcclxuXHRcdHRoaXMuX3NldEVsZW1lbnRBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQsIFBST1BFUlRZX1BBRERJTkcsIGNhbGN1bGF0ZWRWYWx1ZSA9PiBjYWxjdWxhdGVkVmFsdWUgKyB3aWR0aClcclxuXHRcdC8vIHRyaWNrOiBXZSBhZGp1c3QgcG9zaXRpdmUgcGFkZGluZ1JpZ2h0IGFuZCBuZWdhdGl2ZSBtYXJnaW5SaWdodCB0byBzdGlja3ktdG9wIGVsZW1lbnRzIHRvIGtlZXAgc2hvd2luZyBmdWxsd2lkdGhcclxuXHRcdHRoaXMuX3NldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX0ZJWEVEX0NPTlRFTlQsIFBST1BFUlRZX1BBRERJTkcsIGNhbGN1bGF0ZWRWYWx1ZSA9PiBjYWxjdWxhdGVkVmFsdWUgKyB3aWR0aClcclxuXHRcdHRoaXMuX3NldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX1NUSUNLWV9DT05URU5ULCBQUk9QRVJUWV9NQVJHSU4sIGNhbGN1bGF0ZWRWYWx1ZSA9PiBjYWxjdWxhdGVkVmFsdWUgLSB3aWR0aClcclxuXHR9XHJcblxyXG5cdHJlc2V0KCkge1xyXG5cdFx0dGhpcy5fcmVzZXRFbGVtZW50QXR0cmlidXRlcyh0aGlzLl9lbGVtZW50LCAnb3ZlcmZsb3cnKVxyXG5cdFx0dGhpcy5fcmVzZXRFbGVtZW50QXR0cmlidXRlcyh0aGlzLl9lbGVtZW50LCBQUk9QRVJUWV9QQURESU5HKVxyXG5cdFx0dGhpcy5fcmVzZXRFbGVtZW50QXR0cmlidXRlcyhTRUxFQ1RPUl9GSVhFRF9DT05URU5ULCBQUk9QRVJUWV9QQURESU5HKVxyXG5cdFx0dGhpcy5fcmVzZXRFbGVtZW50QXR0cmlidXRlcyhTRUxFQ1RPUl9TVElDS1lfQ09OVEVOVCwgUFJPUEVSVFlfTUFSR0lOKVxyXG5cdH1cclxuXHJcblx0aXNPdmVyZmxvd2luZygpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldFdpZHRoKCkgPiAwXHJcblx0fVxyXG5cclxuXHQvLyBQcml2YXRlXHJcblx0X2Rpc2FibGVPdmVyRmxvdygpIHtcclxuXHRcdHRoaXMuX3NhdmVJbml0aWFsQXR0cmlidXRlKHRoaXMuX2VsZW1lbnQsICdvdmVyZmxvdycpXHJcblx0XHR0aGlzLl9lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuXHR9XHJcblxyXG5cdF9zZXRFbGVtZW50QXR0cmlidXRlcyhzZWxlY3Rvciwgc3R5bGVQcm9wZXJ0eSwgY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IHNjcm9sbGJhcldpZHRoID0gdGhpcy5nZXRXaWR0aCgpXHJcblx0XHRjb25zdCBtYW5pcHVsYXRpb25DYWxsQmFjayA9IGVsZW1lbnQgPT4ge1xyXG5cdFx0XHRpZiAoZWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA+IGVsZW1lbnQuY2xpZW50V2lkdGggKyBzY3JvbGxiYXJXaWR0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9zYXZlSW5pdGlhbEF0dHJpYnV0ZShlbGVtZW50LCBzdHlsZVByb3BlcnR5KVxyXG5cdFx0XHRjb25zdCBjYWxjdWxhdGVkVmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlUHJvcGVydHkpXHJcblx0XHRcdGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoc3R5bGVQcm9wZXJ0eSwgYCR7Y2FsbGJhY2soTnVtYmVyLnBhcnNlRmxvYXQoY2FsY3VsYXRlZFZhbHVlKSl9cHhgKVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIG1hbmlwdWxhdGlvbkNhbGxCYWNrKVxyXG5cdH1cclxuXHJcblx0X3NhdmVJbml0aWFsQXR0cmlidXRlKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpIHtcclxuXHRcdGNvbnN0IGFjdHVhbFZhbHVlID0gZWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlUHJvcGVydHkpXHJcblx0XHRpZiAoYWN0dWFsVmFsdWUpIHtcclxuXHRcdFx0TWFuaXB1bGF0b3IuZ2V0KGVsZW1lbnQsIHN0eWxlUHJvcGVydHksIGFjdHVhbFZhbHVlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXMoc2VsZWN0b3IsIHN0eWxlUHJvcGVydHkpIHtcclxuXHRcdGNvbnN0IG1hbmlwdWxhdGlvbkNhbGxCYWNrID0gZWxlbWVudCA9PiB7XHJcblx0XHRcdGNvbnN0IHZhbHVlID0gTWFuaXB1bGF0b3IuZ2V0KGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpXHJcblx0XHRcdC8vIFdlIG9ubHkgd2FudCB0byByZW1vdmUgdGhlIHByb3BlcnR5IGlmIHRoZSB2YWx1ZSBpcyBgbnVsbGA7IHRoZSB2YWx1ZSBjYW4gYWxzbyBiZSB6ZXJvXHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoc3R5bGVQcm9wZXJ0eSlcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0TWFuaXB1bGF0b3IucmVtb3ZlKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpXHJcblx0XHRcdGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoc3R5bGVQcm9wZXJ0eSwgdmFsdWUpXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fYXBwbHlNYW5pcHVsYXRpb25DYWxsYmFjayhzZWxlY3RvciwgbWFuaXB1bGF0aW9uQ2FsbEJhY2spXHJcblx0fVxyXG5cclxuXHRfYXBwbHlNYW5pcHVsYXRpb25DYWxsYmFjayhzZWxlY3RvciwgY2FsbEJhY2spIHtcclxuXHRcdGlmIChpc0VsZW1lbnQoc2VsZWN0b3IpKSB7XHJcblx0XHRcdGNhbGxCYWNrKHNlbGVjdG9yKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IHNlbCBvZiBTZWxlY3RvcnMuZmluZEFsbChzZWxlY3RvciwgdGhpcy5fZWxlbWVudCkpIHtcclxuXHRcdFx0Y2FsbEJhY2soc2VsKVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsQmFySGVscGVyIiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBkYXRhLmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiDQodC60YDQuNC/0YIg0YDQsNCx0L7RgtCw0LXRgiDRgSDQutC+0LvQu9C10LrRhtC40LXQuSDQvNC+0LTRg9C70LXQuS4g0J/QvtC00YDQvtCx0L3QtdC1INGC0YPRgiBodHRwczovL2xlYXJuLmphdmFzY3JpcHQucnUvbWFwLXNldFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQmtC+0L3RgdGC0LDQvdGC0YtcclxuICovXHJcblxyXG5jb25zdCBlbGVtZW50TWFwID0gbmV3IE1hcCgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0c2V0KGVsZW1lbnQsIGtleSwgaW5zdGFuY2UpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgbmV3IE1hcCgpKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHRcdGlmICghaW5zdGFuY2VNYXAuaGFzKGtleSkgJiYgaW5zdGFuY2VNYXAuc2l6ZSAhPT0gMCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBWR0FwcCDQvdC1INC00L7Qv9GD0YHQutCw0LXRgiDQsdC+0LvQtdC1INC+0LTQvdC+0LPQviDRjdC60LfQtdC80L/Qu9GP0YDQsCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsC4g0KHQstGP0LfQsNC90L3Ri9C5INGN0LrQt9C10LzQv9C70Y/RgDogJHtBcnJheS5mcm9tKGluc3RhbmNlTWFwLmtleXMoKSlbMF19LmApXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLnNldChrZXksIGluc3RhbmNlKVxyXG5cdH0sXHJcblxyXG5cdGdldChlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmIChlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudE1hcC5nZXQoZWxlbWVudCkuZ2V0KGtleSkgfHwgbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0cmVtb3ZlKGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuZGVsZXRlKGtleSk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlTWFwLnNpemUgPT09IDApIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBldmVudC5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICog0KHQutGA0LjQv9GCINC00LvRjyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQmtC+0L3RgdGC0LDQvdGC0YtcclxuICovXHJcblxyXG5jb25zdCBuYW1lc3BhY2VSZWdleCA9IC9bXi5dKig/PVxcLi4qKVxcLnwuKi9cclxuY29uc3Qgc3RyaXBOYW1lUmVnZXggPSAvXFwuLiovXHJcbmNvbnN0IHN0cmlwVWlkUmVnZXggPSAvOjpcXGQrJC9cclxuY29uc3QgZXZlbnRSZWdpc3RyeSA9IHt9IC8vIEV2ZW50cyBzdG9yYWdlXHJcbmxldCB1aWRFdmVudCA9IDFcclxuY29uc3QgY3VzdG9tRXZlbnRzID0ge1xyXG5cdG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLFxyXG5cdG1vdXNlbGVhdmU6ICdtb3VzZW91dCdcclxufVxyXG5cclxuY29uc3QgbmF0aXZlRXZlbnRzID0gbmV3IFNldChbXHJcblx0J2NsaWNrJyxcclxuXHQnZGJsY2xpY2snLFxyXG5cdCdtb3VzZXVwJyxcclxuXHQnbW91c2Vkb3duJyxcclxuXHQnY29udGV4dG1lbnUnLFxyXG5cdCdtb3VzZXdoZWVsJyxcclxuXHQnRE9NTW91c2VTY3JvbGwnLFxyXG5cdCdtb3VzZW92ZXInLFxyXG5cdCdtb3VzZW91dCcsXHJcblx0J21vdXNlbW92ZScsXHJcblx0J3NlbGVjdHN0YXJ0JyxcclxuXHQnc2VsZWN0ZW5kJyxcclxuXHQnc3VibWl0JyxcclxuXHQna2V5ZG93bicsXHJcblx0J2tleXByZXNzJyxcclxuXHQna2V5dXAnLFxyXG5cdCdvcmllbnRhdGlvbmNoYW5nZScsXHJcblx0J3RvdWNoc3RhcnQnLFxyXG5cdCd0b3VjaG1vdmUnLFxyXG5cdCd0b3VjaGVuZCcsXHJcblx0J3RvdWNoY2FuY2VsJyxcclxuXHQncG9pbnRlcmRvd24nLFxyXG5cdCdwb2ludGVybW92ZScsXHJcblx0J3BvaW50ZXJ1cCcsXHJcblx0J3BvaW50ZXJsZWF2ZScsXHJcblx0J3BvaW50ZXJjYW5jZWwnLFxyXG5cdCdnZXN0dXJlc3RhcnQnLFxyXG5cdCdnZXN0dXJlY2hhbmdlJyxcclxuXHQnZ2VzdHVyZWVuZCcsXHJcblx0J2ZvY3VzJyxcclxuXHQnYmx1cicsXHJcblx0J2NoYW5nZScsXHJcblx0J3Jlc2V0JyxcclxuXHQnc2VsZWN0JyxcclxuXHQnc3VibWl0JyxcclxuXHQnZm9jdXNpbicsXHJcblx0J2ZvY3Vzb3V0JyxcclxuXHQnbG9hZCcsXHJcblx0J3VubG9hZCcsXHJcblx0J2JlZm9yZXVubG9hZCcsXHJcblx0J3Jlc2l6ZScsXHJcblx0J21vdmUnLFxyXG5cdCdET01Db250ZW50TG9hZGVkJyxcclxuXHQncmVhZHlzdGF0ZWNoYW5nZScsXHJcblx0J2Vycm9yJyxcclxuXHQnYWJvcnQnLFxyXG5cdCdzY3JvbGwnXHJcbl0pXHJcblxyXG4vKipcclxuICog0J/RgNC40LLQsNGC0L3Ri9C1INC80LXRgtC+0LTRi1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1ha2VFdmVudFVpZChlbGVtZW50LCB1aWQpIHtcclxuXHRyZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChlbGVtZW50KVxyXG5cclxuXHRlbGVtZW50LnVpZEV2ZW50ID0gdWlkXHJcblx0ZXZlbnRSZWdpc3RyeVt1aWRdID0gZXZlbnRSZWdpc3RyeVt1aWRdIHx8IHt9XHJcblxyXG5cdHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiBlbGVtZW50IH0pXHJcblxyXG5cdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgZm4pXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIFtldmVudF0pXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgZG9tRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcblxyXG5cdFx0Zm9yIChsZXQgeyB0YXJnZXQgfSA9IGV2ZW50OyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSB0aGlzOyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRvbUVsZW1lbnQgb2YgZG9tRWxlbWVudHMpIHtcclxuXHRcdFx0XHRpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogdGFyZ2V0IH0pXHJcblxyXG5cdFx0XHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBzZWxlY3RvciwgZm4pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkodGFyZ2V0LCBbZXZlbnRdKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kSGFuZGxlcihldmVudHMsIGNhbGxhYmxlLCBkZWxlZ2F0aW9uU2VsZWN0b3IgPSBudWxsKSB7XHJcblx0cmV0dXJuIE9iamVjdC52YWx1ZXMoZXZlbnRzKVxyXG5cdFx0LmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRjb25zdCBpc0RlbGVnYXRlZCA9IHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJ1xyXG5cdC8vIFRPRE86INCy0YvQtNCw0LXRgiBcImZhbHNlXCIg0LLQvNC10YHRgtC+INGB0LXQu9C10LrRgtC+0YDQsCwg0L/QvtGN0YLQvtC80YMg0L3Rg9C20L3QviDQv9GA0L7QstC10YDQuNGC0YwuIGJvb3RcclxuXHRjb25zdCBjYWxsYWJsZSA9IGlzRGVsZWdhdGVkID8gZGVsZWdhdGlvbkZ1bmN0aW9uIDogKGhhbmRsZXIgfHwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cdGxldCB0eXBlRXZlbnQgPSBnZXRUeXBlRXZlbnQob3JpZ2luYWxUeXBlRXZlbnQpXHJcblxyXG5cdGlmICghbmF0aXZlRXZlbnRzLmhhcyh0eXBlRXZlbnQpKSB7XHJcblx0XHR0eXBlRXZlbnQgPSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSGFuZGxlcihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBvbmVPZmYpIHtcclxuXHRpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRsZXQgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHJcblx0Ly8gaW4gY2FzZSBvZiBtb3VzZWVudGVyIG9yIG1vdXNlbGVhdmUgd3JhcCB0aGUgaGFuZGxlciB3aXRoaW4gYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBmb3IgaXRzIERPTSBwb3NpdGlvblxyXG5cdC8vIHRoaXMgcHJldmVudHMgdGhlIGhhbmRsZXIgZnJvbSBiZWluZyBkaXNwYXRjaGVkIHRoZSBzYW1lIHdheSBhcyBtb3VzZW92ZXIgb3IgbW91c2VvdXQgZG9lc1xyXG5cdGlmIChvcmlnaW5hbFR5cGVFdmVudCBpbiBjdXN0b21FdmVudHMpIHtcclxuXHRcdGNvbnN0IHdyYXBGdW5jdGlvbiA9IGZuID0+IHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghZXZlbnQucmVsYXRlZFRhcmdldCB8fCAoZXZlbnQucmVsYXRlZFRhcmdldCAhPT0gZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgIWV2ZW50LmRlbGVnYXRlVGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGFibGUgPSB3cmFwRnVuY3Rpb24oY2FsbGFibGUpXHJcblx0fVxyXG5cclxuXHRjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXHJcblx0Y29uc3QgaGFuZGxlcnMgPSBldmVudHNbdHlwZUV2ZW50XSB8fCAoZXZlbnRzW3R5cGVFdmVudF0gPSB7fSlcclxuXHRjb25zdCBwcmV2aW91c0Z1bmN0aW9uID0gZmluZEhhbmRsZXIoaGFuZGxlcnMsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxyXG5cclxuXHRpZiAocHJldmlvdXNGdW5jdGlvbikge1xyXG5cdFx0cHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgPSBwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiAmJiBvbmVPZmZcclxuXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChjYWxsYWJsZSwgb3JpZ2luYWxUeXBlRXZlbnQucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKVxyXG5cdGNvbnN0IGZuID0gaXNEZWxlZ2F0ZWQgP1xyXG5cdFx0Ym9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY2FsbGFibGUpIDpcclxuXHRcdGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgY2FsbGFibGUpXHJcblxyXG5cdGZuLmRlbGVnYXRpb25TZWxlY3RvciA9IGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGxcclxuXHRmbi5jYWxsYWJsZSA9IGNhbGxhYmxlXHJcblx0Zm4ub25lT2ZmID0gb25lT2ZmXHJcblx0Zm4udWlkRXZlbnQgPSB1aWRcclxuXHRoYW5kbGVyc1t1aWRdID0gZm5cclxuXHJcblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIGlzRGVsZWdhdGVkKVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpIHtcclxuXHRjb25zdCBmbiA9IGZpbmRIYW5kbGVyKGV2ZW50c1t0eXBlRXZlbnRdLCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblxyXG5cdGlmICghZm4pIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIEJvb2xlYW4oZGVsZWdhdGlvblNlbGVjdG9yKSlcclxuXHRkZWxldGUgZXZlbnRzW3R5cGVFdmVudF1bZm4udWlkRXZlbnRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgbmFtZXNwYWNlKSB7XHJcblx0Y29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxyXG5cclxuXHRmb3IgKGNvbnN0IFtoYW5kbGVyS2V5LCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XHJcblx0XHRpZiAoaGFuZGxlcktleS5pbmNsdWRlcyhuYW1lc3BhY2UpKSB7XHJcblx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50LmNhbGxhYmxlLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUeXBlRXZlbnQoZXZlbnQpIHtcclxuXHQvLyBhbGxvdyB0byBnZXQgdGhlIG5hdGl2ZSBldmVudHMgZnJvbSBuYW1lc3BhY2VkIGV2ZW50cyAoJ2NsaWNrLmJzLmJ1dHRvbicgLS0+ICdjbGljaycpXHJcblx0ZXZlbnQgPSBldmVudC5yZXBsYWNlKHN0cmlwTmFtZVJlZ2V4LCAnJylcclxuXHRyZXR1cm4gY3VzdG9tRXZlbnRzW2V2ZW50XSB8fCBldmVudFxyXG59XHJcblxyXG5mdW5jdGlvbiBoeWRyYXRlT2JqKG9iaiwgbWV0YSA9IHt9KSB7XHJcblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0YSkpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdG9ialtrZXldID0gdmFsdWVcclxuXHRcdH0gY2F0Y2gge1xyXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0Z2V0KCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG9ialxyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40Y9cclxuICogQHR5cGUge3tvbmUoKiwgKiwgKiwgKik6IHZvaWQsIHRyaWdnZXIoKiwgKiwgKik6IChudWxsfCopLCBvZmYoKiwgKiwgKiwgKik6IHZvaWQsIG9uKCosICosICosICopOiB2b2lkfX1cclxuICovXHJcbmNvbnN0IEV2ZW50SGFuZGxlciA9IHtcclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5ICjRjdC70LXQvNC10L3Rgiwg0YHQvtCx0YvRgtC40LUgKNC/0L7Qu9C90YvQuSDRgdC/0LjRgdC+0Log0YHQvNC+0YLRgNC4INCyINC60L7QvdGB0YLQsNC90YLQtSBuYXRpdmVFdmVudHMsINC40YHRgtC+0YfQvdC40Log0YHQvtCx0YvRgtC40Y8g0LjQu9C4INGF0LXQvdC00LvQtdGALCDRhNGD0L3QutGG0LjRjyDQvtCx0YDQsNGC0L3QvtCz0L4g0LLRi9C30L7QstCwKSlcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgZmFsc2UpXHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0YHQu9GD0YjQuNCy0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjQuSwg0L3QviDQt9Cw0LzRi9C60LDQtdGC0YHRjyDQuCDQsdC+0LvRjNGI0LUg0L3QtSDQv9C+0LLRgtC+0YDRj9C10YLRgdGPINC90LAg0Y3Qu9C10LzQtdC90YLQtVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b25lKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgdHJ1ZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQo9C00LDQu9C10L3QuNC1INC+0LHRgNCw0LHQvtGC0YfQuNC60LBcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9mZihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cdFx0Y29uc3QgaW5OYW1lc3BhY2UgPSB0eXBlRXZlbnQgIT09IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0XHRjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXHJcblx0XHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblx0XHRjb25zdCBpc05hbWVzcGFjZSA9IG9yaWdpbmFsVHlwZUV2ZW50LnN0YXJ0c1dpdGgoJy4nKVxyXG5cclxuXHRcdGlmICh0eXBlb2YgY2FsbGFibGUgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdC8vIFNpbXBsZXN0IGNhc2U6IGhhbmRsZXIgaXMgcGFzc2VkLCByZW1vdmUgdGhhdCBsaXN0ZW5lciBPTkxZLlxyXG5cdFx0XHRpZiAoIU9iamVjdC5rZXlzKHN0b3JlRWxlbWVudEV2ZW50KS5sZW5ndGgpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc05hbWVzcGFjZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnRFdmVudCBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XHJcblx0XHRcdFx0cmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgZWxlbWVudEV2ZW50LCBvcmlnaW5hbFR5cGVFdmVudC5zbGljZSgxKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3QgW2tleUhhbmRsZXJzLCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XHJcblx0XHRcdGNvbnN0IGhhbmRsZXJLZXkgPSBrZXlIYW5kbGVycy5yZXBsYWNlKHN0cmlwVWlkUmVnZXgsICcnKVxyXG5cclxuXHRcdFx0aWYgKCFpbk5hbWVzcGFjZSB8fCBvcmlnaW5hbFR5cGVFdmVudC5pbmNsdWRlcyhoYW5kbGVyS2V5KSkge1xyXG5cdFx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50LmNhbGxhYmxlLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDRgdC+0LHRi9GC0LjRjy4g0J/QvtC00YDQvtCx0L3QtdC1INGC0YPRgiBodHRwczovL2xlYXJuLmphdmFzY3JpcHQucnUvZGlzcGF0Y2gtZXZlbnRzXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gYXJnc1xyXG5cdCAqIEByZXR1cm5zIHsqfG51bGx9XHJcblx0ICovXHJcblx0dHJpZ2dlcihlbGVtZW50LCBldmVudCwgYXJncykge1xyXG5cdFx0aWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYnViYmxlcyA9IHRydWU7XHJcblx0XHRsZXQgbmF0aXZlRGlzcGF0Y2ggPSB0cnVlO1xyXG5cdFx0bGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdCBldnQgPSBoeWRyYXRlT2JqKG5ldyBFdmVudChldmVudCwgeyBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlIH0pLCBhcmdzKVxyXG5cclxuXHRcdGlmIChkZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hdGl2ZURpc3BhdGNoKSB7XHJcblx0XHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGV2dFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXHJcbiIsImltcG9ydCB7aXNFbGVtZW50LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDQsNGC0YDQuNCx0YPRgtCw0LzQuCDRgyDRjdC70LXQvNC10L3RgtCwOlxyXG4gKiBnZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINGE0LvQsNCzIC0g0LLRi9GA0LXQt9Cw0YLRjCBkYXRhLSkgLSDQvNC10YLQvtC0INCy0YvQsdC40YDQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQsNGC0YDQuNCx0YPRgtCwINC/0L4g0LXQs9C+INC40LzQtdC90LgsINC10YHQu9C4INCyINC/0L7Qu9C1INC40LzQtdC90Lgg0L/QtdGA0LXQtNCw0YLRjCAnZGF0YScgLT4g0LHRg9C00YPRgiDQstGL0LHRgNCw0L3RiyDRgtC+0LvRjNC60L4g0LTQsNGC0LAg0LDRgtGA0LjQsdGD0YLRiywg0LXRgdC70LggJ2FsbCcgLT4g0LzQtdGC0L7QtCDQstC10YDQvdC10YIg0LfQvdCw0YfQtdC90LjQtSDQstGB0LXRhSDQsNGC0YDQuNCx0YPRgtC+0LJcclxuICogaGFzICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPKSAtINC10YHRgtGMINC70Lgg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKiBzZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINC30L3QsNGH0LXQvdC40LUpIC0g0YPRgdGC0LDQvdC+0LLQutCwINGDINGN0LvQtdC80LXQvdGC0LAg0LDRgtGA0LjQsdGD0YLQsCDQuNC70Lgg0LXQs9C+INC40LfQvNC10L3QtdC90LjQtVxyXG4gKiByZW1vdmUgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0YPQtNCw0LvRj9C10YIg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0KGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUgPSAnZGF0YScsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdkYXRhJykge1xyXG5cdFx0XHRsZXQgZWxtQmFzZSA9IFsnZGF0YS12Zy10b2dnbGUnLCAnZGF0YS12Zy10YXJnZXQnLCAnZGF0YS12Zy1kaXNtaXNzJ10sXHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IHt9O1xyXG5cclxuXHRcdFx0bGV0IGFyciA9IFtdLmZpbHRlci5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24gKGF0KSB7XHJcblx0XHRcdFx0cmV0dXJuIC9eZGF0YS0vLnRlc3QoYXQubmFtZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdFx0bGV0IG5hbWUgPSB2Lm5hbWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpc1JlbW92ZURhdGFOYW1lKSBuYW1lID0gbmFtZS5zbGljZSg1KTtcclxuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1tuYW1lXSA9IG5vcm1hbGl6ZURhdGEodi52YWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZU5hbWVzKCkucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gey4uLmFjYywgW25hbWVdOiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKX07XHJcblx0XHRcdH0sIHt9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRoYXMoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdH0sXHJcblxyXG5cdHNldChlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lKSB7XHJcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5pcHVsYXRvcn1cclxuIiwiLyoqXHJcbiAqINCg0LDQsdC+0YLQsCDRgSBET01cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuaW1wb3J0IHtpc0VsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbmNvbnN0IHBhcnNlU2VsZWN0b3IgPSBzZWxlY3RvciA9PiB7XHJcblx0aWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3JcclxufVxyXG5cclxuY29uc3QgZ2V0U2VsZWN0b3IgPSBlbGVtZW50ID0+IHtcclxuXHRsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS12Zy10YXJnZXQnKTtcclxuXHJcblx0aWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcblx0XHRsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcblx0XHRpZiAoIWhyZWZBdHRyaWJ1dGUgfHwgKCFocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnLicpKSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG5cdFx0XHRocmVmQXR0cmlidXRlID0gYCMke2hyZWZBdHRyaWJ1dGUuc3BsaXQoJyMnKVsxXX1gO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGw7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3IgPyBzZWxlY3Rvci5zcGxpdCgnLCcpLm1hcChzZWwgPT4gcGFyc2VTZWxlY3RvcihzZWwpKS5qb2luKCcsJykgOiBudWxsO1xyXG59XHJcblxyXG5jb25zdCBTZWxlY3RvcnMgPSB7XHJcblx0ZmluZChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcclxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3Rvcik7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZmluZEFsbChzZWxlY3RvciwgY29udGFpbmVyID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChjb250YWluZXIsIHNlbGVjdG9yKSk7XHJcblx0fSxcclxuXHJcblx0Z2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpO1xyXG5cdFx0aWYgKHNlbGVjdG9yKSByZXR1cm4gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IpID8gc2VsZWN0b3IgOiBudWxsXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH0sXHJcblxyXG5cdGdldEVsZW1lbnRGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KTtcclxuXHRcdHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9ycy5maW5kKHNlbGVjdG9yKSA6IG51bGxcclxuXHR9LFxyXG5cclxuXHRnZXRNdWx0aXBsZUVsZW1lbnRzRnJvbVNlbGVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IgPyBTZWxlY3RvcnMuZmluZEFsbChzZWxlY3RvcikgOiBbXVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JzOyIsIi8qKlxyXG4gKiDQndCw0LHQvtGAINGB0LrRgNC40L/RgtC+0LIg0LTQu9GPINGI0LjRgNC+0LrQvtCz0L4g0L/RgNC40LzQtdC90LXQvdC40Y9cclxuICovXHJcblxyXG4vKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0VsZW1lbnRcclxuICogQHBhcmFtIG9iamVjdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XHJcblx0aWYgKCFpc09iamVjdChvYmplY3QpKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdHJldHVybiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xyXG59XHJcblxyXG4vKipcclxuICogaXNEaXNhYmxlZFxyXG4gKiBAcGFyYW0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRGlzYWJsZWQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGVsZW1lbnQuZGlzYWJsZWQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc1Zpc2libGVcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1Zpc2libGUgKGVsZW1lbnQpIHtcclxuXHRpZiAoIWlzRWxlbWVudChlbGVtZW50KSB8fCBlbGVtZW50LmdldENsaWVudFJlY3RzKCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGNvbnN0IGVsZW1lbnRJc1Zpc2libGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3Zpc2liaWxpdHknKSA9PT0gJ3Zpc2libGUnXHJcblx0Y29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXHJcblxyXG5cdGlmICghY2xvc2VkRGV0YWlscykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxuXHR9XHJcblxyXG5cdGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzdW1tYXJ5ID0gZWxlbWVudC5jbG9zZXN0KCdzdW1tYXJ5JylcclxuXHRcdGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkucGFyZW50Tm9kZSAhPT0gY2xvc2VkRGV0YWlscykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc09iamVjdFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcblx0cmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC40LLQvtC00LjQvCDQsiDQv9C+0YDRj9C00L7QuiDRgtC40L/RiyDQtNCw0L3QvdGL0YVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSAge1xyXG5cdGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XHJcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0fSBjYXRjaCB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgtGLINGBINC80LDRgdGB0LjQstCwXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50QXJyYXkoYXJyLCBlbCkge1xyXG5cdHJldHVybiBhcnIuZmlsdGVyKChpdGVtKSA9PiAhZWwuaW5jbHVkZXMoaXRlbSkpO1xyXG59XHJcblxyXG4vKipcclxuICog0JPQu9GD0LHQvtC60L7QtSDQvtCx0YrQtdC00LjQvdC10L3QuNC1INC+0LHRitC10LrRgtC+0LJcclxuICogQHBhcmFtIG9iamVjdHNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZURlZXBPYmplY3QoLi4ub2JqZWN0cykge1xyXG5cdGNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxuXHJcblx0cmV0dXJuIG9iamVjdHMucmVkdWNlKChwcmV2LCBvYmopID0+IHtcclxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG5cdFx0XHRjb25zdCBwVmFsID0gcHJldltrZXldO1xyXG5cdFx0XHRjb25zdCBvVmFsID0gb2JqW2tleV07XHJcblxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwVmFsKSAmJiBBcnJheS5pc0FycmF5KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gcFZhbC5jb25jYXQoLi4ub1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoaXNPYmplY3QocFZhbCkgJiYgaXNPYmplY3Qob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBtZXJnZURlZXBPYmplY3QocFZhbCwgb1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gb1ZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHByZXY7XHJcblx0fSwge30pO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2tcclxuICogQHBhcmFtIHBvc3NpYmxlQ2FsbGJhY2tcclxuICogQHBhcmFtIGFyZ3NcclxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIGV4ZWN1dGUocG9zc2libGVDYWxsYmFjaywgYXJncyA9IFtdLCBkZWZhdWx0VmFsdWUgPSBwb3NzaWJsZUNhbGxiYWNrKSB7XHJcblx0cmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjayguLi5hcmdzKSA6IGRlZmF1bHRWYWx1ZVxyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNpdGlvblxyXG4gKiBAcGFyYW0gY2FsbGJhY2tcclxuICogQHBhcmFtIHRyYW5zaXRpb25FbGVtZW50XHJcbiAqIEBwYXJhbSB3YWl0Rm9yVHJhbnNpdGlvblxyXG4gKi9cclxuY29uc3QgVFJBTlNJVElPTl9FTkQgPSAndHJhbnNpdGlvbmVuZCc7XHJcbmNvbnN0IE1JTExJU0VDT05EU19NVUxUSVBMSUVSID0gMTAwMDtcclxuXHJcbmZ1bmN0aW9uIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gKGNhbGxiYWNrLCB0cmFuc2l0aW9uRWxlbWVudCwgd2FpdEZvclRyYW5zaXRpb24gPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRpZiAoIXdhaXRGb3JUcmFuc2l0aW9uKSB7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XHJcblx0Y29uc3QgZW11bGF0ZWREdXJhdGlvbiA9IHRpbWVPdXRNcyA/IHRpbWVPdXRNcyA6IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRyYW5zaXRpb25FbGVtZW50KSArIGR1cmF0aW9uUGFkZGluZztcclxuXHJcblx0bGV0IGNhbGxlZCA9IGZhbHNlXHJcblxyXG5cdGNvbnN0IGhhbmRsZXIgPSAoeyB0YXJnZXQgfSkgPT4ge1xyXG5cdFx0aWYgKHRhcmdldCAhPT0gdHJhbnNpdGlvbkVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGVkID0gdHJ1ZVxyXG5cdFx0dHJhbnNpdGlvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spXHJcblx0fVxyXG5cclxuXHR0cmFuc2l0aW9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0aWYgKCFjYWxsZWQpIHtcclxuXHRcdFx0dHJpZ2dlclRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkVsZW1lbnQpXHJcblx0XHR9XHJcblx0fSwgZW11bGF0ZWREdXJhdGlvbilcclxufVxyXG5cclxuY29uc3QgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBHZXQgdHJhbnNpdGlvbi1kdXJhdGlvbiBvZiB0aGUgZWxlbWVudFxyXG5cdGxldCB7IHRyYW5zaXRpb25EdXJhdGlvbiwgdHJhbnNpdGlvbkRlbGF5IH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxyXG5cclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbilcclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EZWxheSA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSlcclxuXHJcblx0Ly8gUmV0dXJuIDAgaWYgZWxlbWVudCBvciB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIG5vdCBmb3VuZFxyXG5cdGlmICghZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gJiYgIWZsb2F0VHJhbnNpdGlvbkRlbGF5KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxyXG5cdHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdCgnLCcpWzBdXHJcblx0dHJhbnNpdGlvbkRlbGF5ID0gdHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsJylbMF1cclxuXHJcblx0cmV0dXJuIChOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KSkgKiBNSUxMSVNFQ09ORFNfTVVMVElQTElFUlxyXG59XHJcblxyXG5jb25zdCB0cmlnZ2VyVHJhbnNpdGlvbkVuZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoVFJBTlNJVElPTl9FTkQpKVxyXG59XHJcblxyXG4vKipcclxuICog0KLRgNGO0Log0LTQu9GPINC/0LXRgNC10LfQsNC/0YPRgdC60LAg0LDQvdC40LzQsNGG0LjQuCDRjdC70LXQvNC10L3RgtCwXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybiB2b2lkXHJcbiAqXHJcbiAqIEDRgdC80L7RgtGA0LggaHR0cHM6Ly93d3cuY2hhcmlzdGhlby5pby9ibG9nLzIwMjEvMDIvcmVzdGFydC1hLWNzcy1hbmltYXRpb24td2l0aC1qYXZhc2NyaXB0LyNyZXN0YXJ0aW5nLWEtY3NzLWFuaW1hdGlvblxyXG4gKi9cclxuY29uc3QgcmVmbG93ID0gZWxlbWVudCA9PiB7XHJcblx0ZWxlbWVudC5vZmZzZXRIZWlnaHQgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbi8qKlxyXG4gKiDQk9C10L3QtdGA0LDRhtC40Y8g0YHQu9GD0YfQsNC50L3QvtC5INGB0YLRgNC+0LrQuFxyXG4gKi9cclxuZnVuY3Rpb24gbWFrZVJhbmRvbVN0cmluZyhsZW5ndGggPSA3KSB7XHJcblx0bGV0IHJlc3VsdCA9ICcnO1xyXG5cdGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG5cdGNvbnN0IGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcclxuXHRsZXQgY291bnRlciA9IDA7XHJcblx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcclxuXHRcdHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzTGVuZ3RoKSk7XHJcblx0XHRjb3VudGVyICs9IDE7XHJcblx0fVxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuY29uc3QgaXNSVEwgPSAoKSA9PiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZGlyID09PSAncnRsJ1xyXG5cclxuZXhwb3J0IHtpc0VsZW1lbnQsIGlzVmlzaWJsZSwgaXNEaXNhYmxlZCwgaXNPYmplY3QsIGlzRW1wdHlPYmosIG1lcmdlRGVlcE9iamVjdCwgcmVtb3ZlRWxlbWVudEFycmF5LCBub3JtYWxpemVEYXRhLCBleGVjdXRlLCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCByZWZsb3csIG5vb3AsIG1ha2VSYW5kb21TdHJpbmcsIGlzUlRMfSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC91dGlscy9zY3NzL2RlZmF1bHQuc2Nzc1wiO1xyXG5cclxuLy8gc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL2pzL3Znc2lkZWJhclwiO1xyXG5cclxuLy8gY29sbGFwc2VcclxuaW1wb3J0IFZHQ29sbGFwc2UgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlXCI7XHJcblxyXG4vLyBuYXZcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3NcIjtcclxuaW1wb3J0IFZHTmF2IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2XCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3NcIjtcclxuaW1wb3J0IFZHRHJvcGRvd24gZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duXCI7XHJcblxyXG4vLyBtb2RhbFxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZHTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdtb2RhbC9qcy92Z21vZGFsXCI7XHJcblxyXG4vLyBmb3JtIHNlbmRlclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9zY3NzL3ZnZm9ybXNlbmRlci5zY3NzXCI7XHJcbmltcG9ydCBWR0Zvcm1TZW5kZXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlclwiO1xyXG5cclxuLy8gcm9sbHVwXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdyb2xsdXAvc2Nzcy92Z3JvbGx1cC5zY3NzXCI7XHJcbmltcG9ydCBWR1JvbGx1cCBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z3JvbGx1cC9qcy92Z3JvbGx1cFwiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXIsIFZHQ29sbGFwc2UsIFZHTmF2LCBWR0Ryb3Bkb3duLCBWR01vZGFsLCBWR0Zvcm1TZW5kZXIsIFZHUm9sbHVwXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9