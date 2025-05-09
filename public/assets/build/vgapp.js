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
/* harmony import */ var _utils_js_components_animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/js/components/animation */ "./app/utils/js/components/animation.js");







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
  _animation(element, key, params = {}) {
    new _utils_js_components_animation__WEBPACK_IMPORTED_MODULE_6__["default"](element, key, params);
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
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) return;
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

/***/ "./app/modules/vgalert/js/vgalert.js":
/*!*******************************************!*\
  !*** ./app/modules/vgalert/js/vgalert.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");





/**
 * Constants
 */
const NAME = 'alert';
const NAME_KEY = 'vg.alert';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="alert"]';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_OPEN = 'vg-alert-open';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;
const EVENT_KEY_CONFIRM = `${NAME_KEY}.confirm`;
const EVENT_KEY_CANCEL = `${NAME_KEY}.cancel`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGAlert extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)({
      backdrop: true,
      overflow: true,
      keyboard: true,
      confirm: true,
      showInside: true,
      theme: 'default',
      elements: [{
        'title': 'Вы уверены?',
        'element': 'button',
        'type': 'confirm',
        'classes': ['btn', 'btn-primary']
      }],
      animation: {
        enable: false,
        in: 'animate__rollIn',
        out: 'animate__rollOut',
        delay: 800
      },
      ajax: {
        route: '',
        target: '',
        method: 'get',
        loader: false
      }
    }, params));
    this._addEventListeners();
    this._dismissElement();
    this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
    this._animation(this._element, VGAlert.NAME_KEY, this._params.animation);
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  static run(text, params = {}, callback) {
    return VGAlert.build(text, params, callback);
  }
  static build(text, params, callback) {
    params = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)({
      theme: 'default'
    }, params);
    let target;
    let instance = VGAlert.getOrCreateInstance(target, params);
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.execute)(callback, [instance]);
    instance.show();
  }
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {}
  hide() {}
  dispose() {
    super.dispose();
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  _addEventListeners() {
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== 'Escape') return;
      if (this._params.keyboard) {
        this.hide();
        return;
      }
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
    });
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_2__.dismissTrigger)(VGAlert);

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGAlert);

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
        method: 'get',
        loader: false
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
/* harmony import */ var _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/components/overflow */ "./app/utils/js/components/overflow.js");
/* harmony import */ var _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/components/backdrop */ "./app/utils/js/components/backdrop.js");







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
      backdrop: false,
      overflow: false,
      keyboard: false,
      placement: 'bottom',
      timeoutAnimation: 350,
      hover: false,
      ajax: {
        route: '',
        target: '',
        method: 'get',
        loader: false
      },
      animation: {
        enable: false,
        in: 'animate__flipInY',
        out: 'animate__flipOutY',
        delay: 800
      }
    };
    if ('offset' in params && Array.isArray(params.offset)) {
      defaultParams.offset = params.offset;
    }
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)(defaultParams, params));
    const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].getElementFromSelector(this._element);
    this._parent = this._element.parentNode;
    this._drop = target || _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].find('.' + TARGET_CONTAINER, this._parent);
    this._isPlacement = false;
    this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
    this._animation(this._drop, VGDropdown.NAME_KEY, this._params.animation);
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
    if (this._params.backdrop && !this._params.hover) {
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_6__["default"].show();
    }
    if (this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_5__["default"].append();
      document.body.classList.add('dropdown-open');
    }
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
    if (this._params.backdrop && !this._params.hover) {
      const _this = this;
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_6__["default"].hide(function () {
        if (_this._params.overflow) {
          _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_5__["default"].destroy();
        }
      });
    }
    if (this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_5__["default"].destroy();
      document.body.classList.remove('dropdown-open');
    }
    setTimeout(() => {
      const completeCallback = () => {
        this._drop.classList.remove(CLASS_NAME_SHOW);
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDDEN, relatedTarget);
      };
      this._queueCallback(completeCallback, this._parent, true, 10);
    }, this._params.animation.delay);
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

/***/ "./app/modules/vgformsender/js/hideshowpass.js":
/*!*****************************************************!*\
  !*** ./app/modules/vgformsender/js/hideshowpass.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_components_templater__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/components/templater */ "./app/utils/js/components/templater.js");
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");







/**
 * Constants
 */
const NAME = 'hideshowpass';
const NAME_KEY = 'vg.hideshowpass';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="vgpass"]';
const CLASS_NAME_SHOW = 'show';
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGHideShowPass extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(el, params = {}) {
    super(el, params);
    this._params = this._getParams(el, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)({}, params));
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide(relatedTarget);
  }
  show(relatedTarget) {
    if (relatedTarget) this._params = this._getParams(relatedTarget, this._params);
    this._element.classList.add(CLASS_NAME_SHOW);
    relatedTarget.remove();
    this.build(true);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(this._element, 'type', 'text');
  }
  hide(relatedTarget) {
    this._element.classList.remove(CLASS_NAME_SHOW);
    relatedTarget.remove();
    this.build(false);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(this._element, 'type', 'password');
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  static init(el, params) {
    let instance = VGHideShowPass.getOrCreateInstance(el, params);
    instance.build(false);
  }
  build(isShow = false) {
    if (!isShow) {
      this._params.template = 'pass-close';
    } else {
      this._params.template = 'pass-open';
    }
    new _utils_js_components_templater__WEBPACK_IMPORTED_MODULE_4__["default"](this._element, this._params).render();
  }
}

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_2__["default"].prev(this);
  if (!target) return;
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  const instance = VGHideShowPass.getOrCreateInstance(target);
  instance.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGHideShowPass);

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
/* harmony import */ var _hideshowpass__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hideshowpass */ "./app/modules/vgformsender/js/hideshowpass.js");










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
      redirect: {
        error: '',
        success: ''
      },
      validate: false,
      submit: false,
      fields: [],
      timeout: 50,
      pass: {
        enabled: true,
        template: 'pass-open',
        classes: ['vg-form-sender--hide-show-pass'],
        insert: 'afterend'
      },
      alert: {
        enabled: true,
        type: 'modal',
        errors: true
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
        wasValidate: 'was-validated',
        content: 'vg-form-sender--content'
      },
      callback: {
        afterInit: _utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.noop
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
    [..._utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].findAll('input, textarea, select', this._element)].forEach(el => {
      if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.isVisible)(el)) {
        el.parentElement.classList.add(this._params.classes.content);
      }
    });
    if (this._params.validate) {
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.set(this._element, 'novalidate', '');
      this._element.classList.add(this._params.classes.validation);
    }
    if (this._params.pass.enabled) {
      [..._utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].findAll('input[type="password"]', this._element)].forEach(el => {
        _hideshowpass__WEBPACK_IMPORTED_MODULE_8__["default"].init(el, this._params.pass);
      });
    }
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.execute)(this._params.callback.afterInit, [this._element, this]);
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
          if (_this._params.redirect.error) {
            window.location.href = _this._params.redirect.error;
          } else {
            _this._alertError(event, data);
          }
        } else if (typeof status === 'string' && status === 'success') {
          if (_this._params.redirect.success) {
            window.location.href = _this._params.redirect.success;
          } else {
            _this._alertSuccess(event, data);
          }
        }
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
        mVG.hide([mVG]);
      }
    });
    let id = _this._params.classes.general + '-' + (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_4__.makeRandomString)(),
      $modal = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_5__["default"].find('.' + _this._params.classes.alertModal);
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
    }, _this._params.timeout);
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
            if (status === 'error' && data.code !== 200 && this._params.alert.errors) {
              code = ' ' + data.text + ' (' + data.code + ')';
            }
            if (title) txt += '<h4 class="vg-alert-content--title">' + title + code + '</h4>';
            if ('message' in response) {
              txt += '<div class="vg-alert-content--message">' + response.message + '</div>';
            }
            if ('errors' in response && this._params.alert.errors) {
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

/***/ "./app/modules/vglawcookie/js/vglawcookie.js":
/*!***************************************************!*\
  !*** ./app/modules/vglawcookie/js/vglawcookie.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_dom_cookie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/cookie */ "./app/utils/js/dom/cookie.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");







/**
 * Constants
 */
const NAME = 'lawcookie';
const NAME_KEY = 'vg.lawcookie';
const CLASS_NAME_SHOW = 'show';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="lawcookie"]';
const SELECTOR_DATA_TOGGLE_CLEAR = '[data-vg-toggle="lawcookie-clear"]';
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGLawCookie extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static sParams = {};
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      storage: 'local',
      // cookie or local
      delay: 500,
      cookie: {
        name: 'lawCookie',
        value: 'yes',
        attributes: {}
      },
      animation: {
        enable: true,
        in: 'animate__fadeInUp',
        out: 'animate__fadeOutDown',
        delay: 800
      },
      ajax: {
        route: '',
        target: '',
        method: 'get'
      }
    }, params));
    VGLawCookie.sParams = this._params;
    this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
    this._animation(this._element, VGLawCookie.NAME_KEY, this._params.animation);
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  toggle() {
    return !this._isShown() ? this.show() : this.hide();
  }
  _isShown() {
    return this.storage().get();
  }
  show() {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this._element)) return;
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_SHOW, {});
    if (showEvent.defaultPrevented) return;
    this._element.classList.add(CLASS_NAME_SHOW);
    const completeCallBack = () => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_SHOWN, {});
    };
    this._queueCallback(completeCallBack, this._element, true, this._params.delay);
  }
  hide() {
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    setTimeout(() => {
      this._element.classList.remove(CLASS_NAME_SHOW);
      const completeCallback = () => _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
      this._queueCallback(completeCallback, this._element, true);
    }, this._params.animation.delay);
  }
  storage() {
    this._storage = {
      isCookie: this._params.storage === 'cookie',
      storage: this._params.storage === 'cookie' ? _utils_js_dom_cookie__WEBPACK_IMPORTED_MODULE_4__["default"] : localStorage,
      name: this._params.cookie.name,
      value: this._params.cookie.value,
      attributes: this._params.cookie.attributes
    };
    return this;
  }
  get() {
    if (this._storage.isCookie) {
      return this._storage.storage.get(this._storage.name);
    } else {
      return this._storage.storage.getItem(this._storage.name);
    }
  }
  set() {
    if (this._storage.isCookie) {
      this._storage.storage.set(this._storage.name, this._storage.value, this._storage.attributes);
    } else {
      this._storage.storage.setItem(this._storage.name, this._storage.value);
    }
  }
  dispose() {
    super.dispose();
  }
  static reset() {
    _utils_js_dom_cookie__WEBPACK_IMPORTED_MODULE_4__["default"].remove(VGLawCookie.sParams.cookie.name);
    localStorage.clear();
    location.reload();
  }

  /**
   * Инициализация
   * @param element
   * @param params
   */
  static init(element, params = {}) {
    const instance = VGLawCookie.getOrCreateInstance(element, params);
    instance.toggle();
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_5__.dismissTrigger)(VGLawCookie);
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) return;
  const element = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find('#vg-lawcookie');
  if (!element) return;
  const instance = VGLawCookie.getOrCreateInstance(element);
  instance.storage().set();
  instance.hide();
});
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CLEAR, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this)) return;
  const element = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find('#vg-lawcookie');
  if (!element) return;
  const instance = VGLawCookie.getOrCreateInstance(element);
  instance.dispose();
  location.reload();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGLawCookie);

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
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");









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
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_MOUSEDOWN_DISMISS = `mousedown.dismiss${NAME_KEY}`;
const EVENT_KEY_CLICK_DISMISS = `click.dismiss${NAME_KEY}`;
const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_POPSTATE_DATA_API = `popstate.${NAME_KEY}.data.api`;
class VGModal extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.mergeDeepObject)({
      backdrop: true,
      focus: true,
      keyboard: true,
      fields: [],
      hash: false,
      ajax: {
        route: '',
        target: '',
        method: 'get',
        loader: false
      },
      animation: {
        enable: false,
        in: 'animate__rollIn',
        out: 'animate__rollOut',
        delay: 800
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
    this._dialog = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find(SELECTOR_DIALOG, this._element);
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new _utils_js_components_scrollbar__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this._addEventListeners();
    this._dismissElement();
    this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
    this._animation(this._element, VGModal.NAME_KEY, this._params.animation);
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
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(btnClose, 'type', 'button');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(btnClose, 'data-vg-dismiss', 'modal');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(btnClose, 'data-vg-target', '#' + id);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(btnClose, 'aria-label', 'close');
    btnClose.classList.add('vg-btn-close');
    content.append(btnClose);
    let body = document.createElement('div');
    body.classList.add('vg-modal-body');
    content.append(body);
    dialog.append(content);
    _element.append(dialog);
    document.body.append(_element);
    const modal = VGModal.getOrCreateInstance(_element, params);
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.execute)(callback, [modal]);
  }
  toggle(relatedTarget) {
    return !this._isShown ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isDisabled)(_this._element)) return;
    this._params = this._getParams(relatedTarget, this._params);
    _this._route(function (status, data) {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(_this._element, EVENT_KEY_LOADED, {
        stats: status,
        data: data
      });
    });
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    this._isShown = true;
    this._isTransitioning = true;
    if (this._params.hash) {
      window.history.pushState(null, "vg-sidebar-open", "#" + this._element.id);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(window, EVENT_KEY_POPSTATE_DATA_API, () => {
        this.hide();
      });
    }
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._addFieldsInModal(relatedTarget);
    this._adjustDialog();
    _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].show(() => this._showElement(relatedTarget));
  }
  hide(openedModals = []) {
    if (!this._isShown || this._isTransitioning) return;
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    this._isShown = false;
    this._isTransitioning = true;
    setTimeout(() => {
      this._element.classList.remove(CLASS_NAME_SHOW);
      this._queueCallback(() => this._hideModal(openedModals), this._element, this._isAnimatedFade());
    }, this._params.animation.delay);
  }
  _hideModal(openedModals) {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    if (openedModals.length) return;
    if (this._params.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_2__["default"].hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
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
    const modalBody = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.reflow)(this._element);
    this._element.classList.add(CLASS_NAME_SHOW);
    const transitionComplete = () => {
      this._isTransitioning = false;
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimatedFade());
  }
  _isAnimatedFade() {
    return this._element.classList.contains(CLASS_NAME_FADE);
  }
  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isRTL)() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isRTL)() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }
  _addEventListeners() {
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(this._element, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) return;
      if (this._params.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(window, EVENT_KEY_RESIZE, () => {
      if (this._isShown && !this._isTransitioning) this._adjustDialog();
    });
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(this._element, EVENT_KEY_MOUSEDOWN_DISMISS, event => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].one(this._element, EVENT_KEY_CLICK_DISMISS, event2 => {
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
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
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
    this._params.fields.forEach(item => {
      if (!'name' in item && !'value' in item) return;
      let elements = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].findAll('[data-' + item.name + ']', this._element);
      if (!elements.length) return;
      for (const elm of elements) {
        switch (elm.tagName) {
          case 'INPUT':
            elm.value = item.value;
            break;
          case 'IMG':
            _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_5__.Manipulator.set(elm, 'src', item.value);
            break;
          default:
            elm.innerHTML = item.value;
        }
      }
    });
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_7__.dismissTrigger)(VGModal);

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) event.preventDefault();
  _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].one(target, EVENT_KEY_SHOW, showEvent => {
    if (showEvent.defaultPrevented) return;
  });
  const alreadyOpen = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find(OPEN_SELECTOR);
  if (alreadyOpen) VGModal.getInstance(alreadyOpen).hide([alreadyOpen]);
  const data = VGModal.getOrCreateInstance(target);
  data.toggle(this);
});
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_4__["default"].on(document, EVENT_KEY_DOM_LOADED_DATA_API, function () {
  let targetHash = window.location.hash.slice(1);
  if (targetHash) {
    let target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].find('#' + targetHash);
    if (target && target.classList.contains('vg-modal')) {
      if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_6__.isDisabled)(target)) {
        return;
      }
      const data = VGModal.getOrCreateInstance(target);
      data.toggle();
    }
  }
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
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_5__["default"].on(window, EVENT_RESIZE_DATA_API, function () {
  if (_utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].find('.vg-nav')) {
    const instance = VGNav.getOrCreateInstance('.vg-nav', {});
    instance.build();
  }
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





/**
 * Constants
 */
const NAME = 'rollup';
const NAME_KEY = 'vg.rollup';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_HIDE = 'vg-rollup-display--none';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="rollup"]';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGRollup extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      content: 'text',
      offset: 0,
      cnt: 0,
      fade: true,
      transition: false,
      number: false,
      height: 0,
      ellipsis: {
        line: null
      },
      more: ' еще ',
      button: {
        enable: true,
        more: "Показать",
        less: "Свернуть"
      }
    }, params));
    this.classes = {
      container: 'vg-rollup',
      hidden: "vg-rollup-content--hidden",
      fade: "vg-rollup-content--fade",
      ellipsis: "vg-rollup-content--ellipsis",
      button: "vg-rollup-content--button",
      transition: "vg-rollup-content--transition"
    };
    this.total = 0;
    this.count = 0;
    this.offset = 0;
    this.isOffset = false;
    if (this._params.offset > 0) {
      this.offset = this._params.offset + this._params.cnt || 0;
      this.isOffset = true;
    }
    this.build();
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  static toggle(target, relatedTarget) {
    const instance = VGRollup.getOrCreateInstance(target);
    let isShown = instance.isShow();
    if (!isShown) {
      instance._element.classList.add(CLASS_NAME_SHOW);
      relatedTarget.innerHTML = instance._params.button.less;
      if (instance.offset > 0) {
        if (instance.isOffset) {
          relatedTarget.innerHTML = instance._params.button.more;
        } else {
          relatedTarget.innerHTML = instance._params.button.less;
        }
      }
      instance.switch(instance._element, false);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(instance._element, EVENT_KEY_SHOW, {
        relatedTarget
      });
    } else {
      let textShowNum = '',
        isShowNum = instance._params.number;
      if (isShowNum) {
        let sum = instance.total - instance.count;
        if (sum > 0) {
          textShowNum = instance._params.more + sum;
        }
      }
      relatedTarget.setAttribute("aria-expanded", false);
      instance._element.classList.remove(CLASS_NAME_SHOW);
      relatedTarget.innerHTML = instance._params.button.more + textShowNum;
      instance.switch(instance._element, true);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(instance._element, EVENT_KEY_HIDE, {
        relatedTarget
      });
    }
  }
  build(el = null, isButtonAppend = true) {
    let _this = this,
      element = el || _this._element,
      self_height = element.clientHeight,
      set_height = _this._params.height || self_height / 2;
    element.classList.add(_this.classes.container);
    let isFade = _this._params.fade,
      isTransition = _this._params.transition,
      isEllipsis = _this._params.ellipsis.line !== null,
      isButton = _this._params.button.enable,
      isShowNum = _this._params.number;
    if (!isButtonAppend) _this.switch(element);
    if (self_height > set_height && _this._params.content === 'text') {
      element.classList.add(_this.classes.hidden);
      element.style.height = set_height + "px";
      ellipsis();
      transition();
      fade();
      button();
    } else if (_this._params.content === 'elements') {
      let elementClass = _this._params.elements || 'item',
        items = element.querySelectorAll('.' + elementClass),
        cnt = _this._params.cnt || 5,
        i = 1;
      _this.total = items.length;
      _this.count = cnt;
      for (const item of items) {
        if (i > cnt) {
          item.classList.add(CLASS_NAME_HIDE);
        }
        i++;
      }
      if (isButton === true) isButton = i - 1 > cnt;
      ellipsis();
      transition();
      fade();
      button();
    }
    function ellipsis() {
      if (isEllipsis) {
        let line = _this._params.ellipsis.line;
        isFade = false;
        if (line) {
          element.classList.add(_this.classes.ellipsis);
          element.style.webkitLineClamp = line;
        } else {
          console.log("Переменная [data-line] или параметр[line] не должны быть пустыми");
        }
      }
    }

    // TODO no work
    function transition() {
      if (isTransition) {
        element.classList.add(_this.classes.transition);
      }
    }
    function fade() {
      if (isFade) {
        element.classList.add(_this.classes.fade);
      }
    }
    function button() {
      if (isButtonAppend) {
        element.setAttribute("id", element.id);
        if (isButton) {
          let textShowNum = '';
          if (isShowNum) {
            let sum = _this.total - _this.count;
            if (sum > 0) {
              textShowNum = _this._params.more + sum;
            }
          }
          let btnTextMore = _this._params.button.more;
          element.insertAdjacentHTML("afterend", "<div  class=\"" + _this.classes.button + "\"><a href=\"#\" aria-expanded=\"false\" data-vg-toggle=\"rollup\" data-vg-target=\"#" + element.id + "\">" + btnTextMore + textShowNum + "</a></div>");
        }
      }
    }
  }
  switch(el, switcher = false) {
    const _this = this;
    if (switcher) {
      this.build(el, false);
    } else {
      el.classList.remove(this.classes.hidden);
      el.classList.remove(this.classes.ellipsis);
      el.classList.remove(this.classes.fade);
      el.removeAttribute("style");
      if (_this._params.content === 'elements') {
        let className = _this._params.elements;
        let items = [...el.querySelectorAll('.' + className)];
        if (items.length) {
          if (_this.offset > 0) {
            let className = _this._params.elements,
              items = [...el.querySelectorAll('.' + className)];
            items.slice(_this.count, _this.offset).forEach(item => item.classList.remove(CLASS_NAME_HIDE));
            _this.offset = _this.offset + _this.settings.offset;
            if (_this.offset > items.length) {
              _this.isOffset = false;
              _this.offset = 0;
            }
          } else {
            items.forEach(item => item.classList.remove(CLASS_NAME_HIDE));
          }
        }
      }
    }
  }
  isShow() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }

  /**
   * Инициализация
   * @param element
   * @param params
   * @param callback
   */
  static init(element, params = {}, callback) {
    const instance = VGRollup.getOrCreateInstance(element, params);
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.execute)(callback, [instance]);
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
  VGRollup.toggle(target, this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGRollup);

/***/ }),

/***/ "./app/modules/vgselect/js/vgselect.js":
/*!*********************************************!*\
  !*** ./app/modules/vgselect/js/vgselect.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/js/dom/manipulator */ "./app/utils/js/dom/manipulator.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");






/**
 * Constants
 */
const NAME = 'select';
const NAME_KEY = 'vg.select';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_CONTAINER = 'vg-select';
const CLASS_NAME_DROPDOWN = 'vg-select-dropdown';
const CLASS_NAME_LIST = 'vg-select-list';
const CLASS_NAME_OPTION = 'vg-select-list--option';
const CLASS_NAME_OPTGROUP = 'vg-select-list--optgroup';
const CLASS_NAME_OPTGROUP_TITLE = 'vg-select-list--optgroup-title';
const CLASS_NAME_CURRENT = 'vg-select-current';
const CLASS_NAME_PLACEHOLDER = 'vg-select-current--placeholder';
const CLASS_NAME_SEARCH = 'vg-select-search';
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_UP_DATA_API = `keyup.${NAME_KEY}.data.api`;
const EVENT_RESET_DATA_API = `reset.${NAME_KEY}.data.api`;
const EVENT_KEY_CHANGE = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="select"]';
const SELECTOR_OPTION_TOGGLE = '[data-vg-toggle="select-option"]';
const SELECTOR_SEARCH_TOGGLE = '[name=vg-select-search]';
let observerTimout;
class VGSelect extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      search: false,
      placeholder: ''
    }, params));
    element.parentElement.style.position = 'relative';
    this._drop = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('.' + CLASS_NAME_DROPDOWN, this._element);
    this.refresh();
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  static buildListOptions(selector, drop) {
    let options = selector.options,
      list = document.createElement('ul');
    list.classList.add(CLASS_NAME_LIST);
    let optGroup = selector.querySelectorAll('optgroup');
    if (optGroup.length) {
      let isSelected = false;
      [...optGroup].forEach(function (el) {
        let olOptGroup = document.createElement('ol');
        olOptGroup.classList.add(CLASS_NAME_OPTGROUP);
        let liLabel = document.createElement('li');
        liLabel.innerHTML = el.label.trim();
        liLabel.classList.add(CLASS_NAME_OPTGROUP_TITLE);
        olOptGroup.prepend(liLabel);
        let optGroupOptions = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].findAll('option', el);
        createLi(optGroupOptions, olOptGroup, isSelected);
        list.append(olOptGroup);
        isSelected = true;
      });
    } else {
      let isSelected = false;
      createLi(options, list, isSelected);
    }
    drop.append(list);
    return list;
    function createLi(options, list, isSelected) {
      let i = 0;
      for (const option of options) {
        let li = document.createElement('li');
        li.innerHTML = option.innerHTML.trim().replace(/<\/[^>]+(>|$)/g, "");
        li.dataset.value = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.get(option, 'value');
        li.classList.add(CLASS_NAME_OPTION);
        _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(li, 'data-vg-toggle', 'select-option');
        let liData = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.get(option);
        if (!(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(liData)) {
          for (const key of Object.keys(liData)) {
            _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(li, 'data-' + key, liData[key]);
          }
        }
        if (i === selector.selectedIndex && !isSelected) {
          li.classList.add('selected');
        }
        if (_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.has(option, 'disabled')) li.classList.add('disabled');
        if (_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.has(option, 'hidden')) li.classList.add('hidden');
        list.append(li);
        i++;
      }
    }
  }
  static build(selector, reBuild) {
    let option_selected,
      placeholder = selector.dataset.placeholder || '',
      isSearch = selector.dataset.search || false;
    if (selector.dataset?.inited === 'true' && !reBuild) {
      return;
    } else if (reBuild) {
      VGSelect.destroy(selector);
    }
    if (placeholder && selector.selectedIndex === 0) {
      option_selected = '<span class="' + CLASS_NAME_PLACEHOLDER + '">' + placeholder + '<span>';
    } else {
      option_selected = selector.options[selector.selectedIndex].innerText;
    }

    // Создаем основной элемент с классами селекта
    let classes = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.get(selector, 'class'),
      element = document.createElement('div');
    classes = classes.split(' ');
    for (const _class of classes) {
      element.classList.add(_class);
    }
    if (_utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.has(selector, 'disabled')) element.classList.add('disabled');
    let elData = _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.get(selector);
    if (!(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(elData)) {
      for (const key of Object.keys(elData)) {
        _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(element, 'data-' + key, elData[key]);
      }
    }

    // Создаем элемент с отображением выбранного варианта
    let current = document.createElement('div');
    current.classList.add(CLASS_NAME_CURRENT);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(current, 'data-vg-toggle', 'select');
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(current, 'aria-expanded', 'false');
    current.innerHTML = option_selected.trim();
    element.append(current);

    // Создаем элемент выпадающего списка
    let dropdown = document.createElement('div');
    dropdown.classList.add(CLASS_NAME_DROPDOWN);
    element.append(dropdown);

    // Создаем список и варианты селекта
    VGSelect.buildListOptions(selector, dropdown);

    // Добавляем все созданный контейнер после селекта
    selector.insertAdjacentElement('afterend', element);

    // помечаем элемент инициализированным
    selector.dataset.inited = 'true';
    if (isSearch) {
      let search_container = document.createElement('div');
      search_container.classList.add(CLASS_NAME_SEARCH);
      let input = document.createElement('input');
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(input, 'name', 'vg-select-search');
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(input, 'type', 'text');
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(input, 'placeholder', 'Поиск...');
      search_container.append(input);
      dropdown.prepend(search_container);
    }
    return element;
  }
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this._element)) return;
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].on(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.noop);
      }
    }
    this._element.classList.add(CLASS_NAME_SHOW);
    if (this._params.search) {
      let input = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('input', this._element);
      if (input) input.focus();
    }
    const completeCallBack = () => {
      this._element.classList.add(CLASS_NAME_ACTIVE);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._drop, true, 50);
  }
  hide() {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(this._element) || !this._isShown()) return;
    this._completeHide();
  }
  _completeHide() {
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(this._element, EVENT_KEY_HIDE, {});
    if (hideEvent.defaultPrevented) return;
    this._element.classList.remove(CLASS_NAME_ACTIVE);
    let toggle = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find(SELECTOR_DATA_TOGGLE, this._element);
    _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(toggle, 'aria-expanded', 'false');
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].off(element, 'mouseover', _utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.noop);
      }
    }
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(this._element, EVENT_KEY_HIDDEN, {});
    };
    this._queueCallback(completeCallback, this._drop, true, 10);
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  refresh() {
    const select = this._element.previousSibling;
    let observer = new MutationObserver(() => {
      clearTimeout(observerTimout);
      observerTimout = setTimeout(() => {
        VGSelect.build(select, true);
      }, 100);
    });
    observer.observe(select, {
      attributeFilter: ['disabled', 'required', 'style', 'hidden'],
      childList: true,
      subtree: true,
      characterDataOldValue: true
    });
  }
  dispose() {
    super.dispose();
  }
  static destroy(select) {
    let element = select.nextElementSibling;
    if (element) {
      if (element.classList.contains(CLASS_NAME_CONTAINER)) {
        element.remove();
        select.selectedIndex = 0;
        [...select.querySelectorAll('option')].forEach(function (el, index) {
          if (el.hasAttribute('selected')) {
            select.selectedIndex = index;
          }
        });
      }
    }
  }
  static hideOpenToggles(event) {
    const openToggles = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].findAll('.vg-select:not(.disabled):not(:disabled).show');
    for (const toggle of openToggles) {
      const context = VGSelect.getInstance(toggle);
      if (!context) continue;
      if (event.target.closest('.' + CLASS_NAME_CONTAINER) === context._element) {
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
  static clearDrops(event) {
    if (event.button === 2 || event.type === 'keyup' && event.key !== 'Tab') {
      return;
    }
    VGSelect.hideOpenToggles(event);
  }
  static changeSelector(select, value, data = {}) {
    if (!(0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isObject)(data) && (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(data)) return;
    select.value = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.normalizeData)(value);
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(select, EVENT_KEY_CHANGE, {
      data: data
    });
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].trigger(select, 'change', {
      data: data
    });
  }

  /**
   * Инициализация
   * @param element
   * @param params
   * @param isRebuild
   */
  static init(element, params = {}, isRebuild = false) {
    let elm = VGSelect.build(element);
    VGSelect.getOrCreateInstance(elm, params);
  }
}
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].on(document, EVENT_CLICK_DATA_API, VGSelect.clearDrops);
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function () {
  const target = this.closest('.' + CLASS_NAME_CONTAINER);
  _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.set(this, 'aria-expanded', true);
  const alreadyOpen = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('.vg-select.show');
  if (alreadyOpen && alreadyOpen !== target) {
    VGSelect.getInstance(alreadyOpen).hide();
  }
  const instance = VGSelect.getOrCreateInstance(target);
  instance.toggle(this);
});
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].on(document, EVENT_CLICK_DATA_API, SELECTOR_OPTION_TOGGLE, function (e) {
  let el = e.target;
  if (!el.classList.contains('disabled')) {
    let container = el.closest('.' + CLASS_NAME_CONTAINER),
      options = container.querySelectorAll('.' + CLASS_NAME_OPTION);
    if (options.length) {
      for (const option of options) {
        option.classList.remove('selected');
      }
    }
    el.classList.add('selected');
    container.querySelector('.' + CLASS_NAME_CURRENT).innerText = el.innerText;
    container.classList.remove('show');
    let select = container.previousSibling;
    VGSelect.changeSelector(select, el.dataset.value, {
      value: el.dataset.value,
      title: el.innerHTML
    });
  }
});
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].on(document, EVENT_KEY_UP_DATA_API, SELECTOR_SEARCH_TOGGLE, function (e) {
  let el = this;
  let selectList = el?.closest('.' + CLASS_NAME_DROPDOWN).querySelector('.' + CLASS_NAME_LIST);
  if (selectList) {
    let options = [...selectList.querySelectorAll('.' + CLASS_NAME_OPTION)],
      optionsGroup = [...selectList.querySelectorAll('.' + CLASS_NAME_OPTGROUP)],
      value = el?.value;
    options = options.concat(optionsGroup);
    for (const option of options) {
      _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.show(option);
    }
    if (value.length) {
      value = value.trim();
      value = value.toLowerCase();
      value = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.transliterate)(value, true);
      for (const option of options) {
        let text = option.innerText.toLowerCase();
        if (text.indexOf(value) === -1) _utils_js_dom_manipulator__WEBPACK_IMPORTED_MODULE_2__.Manipulator.hide(option);
      }
    }
  }
});
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_3__["default"].on(document, EVENT_RESET_DATA_API, 'form', function () {
  _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].findAll('select.' + CLASS_NAME_CONTAINER, this).forEach(el => {
    VGSelect.build(el, true);
  });
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGSelect);

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
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="sidebar"]';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_OPEN = 'vg-sidebar-open';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_POPSTATE_DATA_API = `popstate.${NAME_KEY}.data.api`;
const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
class VGSidebar extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)({
      backdrop: true,
      overflow: true,
      keyboard: true,
      hash: false,
      animation: {
        enable: false,
        in: 'animate__rollIn',
        out: 'animate__rollOut',
        delay: 800
      },
      ajax: {
        route: '',
        target: '',
        method: 'get',
        loader: false
      }
    }, params));
    this._addEventListeners();
    this._dismissElement();
    this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
    this._animation(this._element, VGSidebar.NAME_KEY, this._params.animation);
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
    if (relatedTarget) _this._params = _this._getParams(relatedTarget, _this._params);
    _this._route(function (status, data) {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_LOADED, {
        stats: status,
        data: data
      });
    });
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    if (_this._params.backdrop) {
      _utils_js_components_backdrop__WEBPACK_IMPORTED_MODULE_5__["default"].show();
    }
    if (_this._params.overflow) {
      _utils_js_components_overflow__WEBPACK_IMPORTED_MODULE_6__["default"].append();
    }
    if (this._params.hash) {
      window.history.pushState(null, "vg-sidebar-open", "#" + this._element.id);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(window, EVENT_KEY_POPSTATE_DATA_API, () => {
        this.hide();
      });
    }
    _this._element.classList.add(CLASS_NAME_SHOW);
    document.body.classList.add(CLASS_NAME_OPEN);
    const completeCallBack = () => {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(_utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('.vg-backdrop'), 'mousedown.vg.backdrop', function () {
        _this.hide();
      });
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(_this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
    };
    _this._queueCallback(completeCallBack, _this._element, true, 50);
  }
  hide() {
    const _this = this;
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(_this._element)) return;
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    setTimeout(() => {
      _this._element.setAttribute('aria-expanded', false);
      _this._element.classList.remove(CLASS_NAME_SHOW);
      const completeCallback = () => {
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
        if (_this._params.hash) {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        document.body.classList.remove(CLASS_NAME_OPEN);
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
      };
      this._queueCallback(completeCallback, this._element, true);
    }, this._params.animation.delay);
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
    this.setAttribute('aria-expanded', false);
  });
  const alreadyOpen = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('.vg-sidebar.show');
  if (alreadyOpen && alreadyOpen !== target) {
    VGSidebar.getInstance(alreadyOpen).hide();
  }
  const data = VGSidebar.getOrCreateInstance(target);
  data.toggle(this);
});
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_2__["default"].on(document, EVENT_KEY_DOM_LOADED_DATA_API, function () {
  let targetHash = window.location.hash.slice(1);
  if (targetHash) {
    let target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].find('#' + targetHash);
    if (target && target.classList.contains('vg-sidebar')) {
      if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_1__.isDisabled)(target)) {
        return;
      }
      const data = VGSidebar.getOrCreateInstance(target);
      data.toggle();
    }
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGSidebar);

/***/ }),

/***/ "./app/modules/vgtoast/js/vgtoast.js":
/*!*******************************************!*\
  !*** ./app/modules/vgtoast/js/vgtoast.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-module */ "./app/modules/base-module.js");
/* harmony import */ var _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/js/dom/event */ "./app/utils/js/dom/event.js");
/* harmony import */ var _module_fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../module-fn */ "./app/modules/module-fn.js");
/* harmony import */ var _utils_js_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/js/functions */ "./app/utils/js/functions.js");
/* harmony import */ var _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/js/dom/selectors */ "./app/utils/js/dom/selectors.js");






/**
 * Constants
 */
const NAME = 'toast';
const NAME_KEY = 'vg.toast';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="toast"]';
const CLASS_NAME_OPEN = 'vg-toast-open';
const CLASS_NAME_SHOW = 'show';
const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
class VGToast extends _base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, params = {}) {
    super(element, params);
    this._params = this._getParams(element, (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)({
      static: true,
      placement: 'bottom center',
      autohide: false,
      delay: 3000,
      enableClickToast: true,
      enableButtonClose: true,
      keyboard: true,
      theme: 'dark',
      stack: {
        enable: true,
        max: 5
      },
      animation: {
        enable: true,
        in: 'animate__fadeIn',
        out: 'animate__fadeOut',
        delay: 400
      },
      ajax: {
        route: '',
        target: '',
        method: 'get',
        loader: false
      }
    }, params));
    this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
    this._animation(this._element, VGToast.NAME_KEY, this._params.animation);
    this._dismissElement();
    this._addEventListeners();
    this._timeout = null;
  }
  static get NAME() {
    return NAME;
  }
  static get NAME_KEY() {
    return NAME_KEY;
  }
  static run(text, params = {}, callback) {
    return VGToast.build(text, params, callback);
  }
  static build(text, params, callback) {
    params = (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.mergeDeepObject)({
      placement: 'bottom center',
      static: false,
      theme: 'dark',
      stack: {
        enable: false
      }
    }, params);
    let target = document.createElement('div');
    target.classList.add('vg-toast');
    target.id = 'vg-toast-' + (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.makeRandomString)();
    if ('theme' in params) {
      target.classList.add('vg-toast-' + params.theme);
    }
    if ('placement' in params) {
      params.placement.split(' ').forEach(val => target.classList.add(val));
    }
    let wrapper = document.createElement('div');
    wrapper.classList.add('vg-toast-wrapper');
    if ('type' in params) {
      let icon = document.createElement('div');
      icon.classList.add('vg-toast-icon');
      wrapper.append(icon);
    }
    let content = document.createElement('div');
    content.classList.add('vg-toast-content');
    let body = document.createElement('div');
    body.classList.add('vg-toast-body');
    if (typeof text === 'string') {
      body.innerHTML = text;
      content.append(body);
    } else if (Array.isArray(text)) {
      if (text.length > 1) {
        let header = document.createElement('div');
        header.classList.add('vg-toast-header');
        header.innerHTML = text[0];
        content.append(header);
        body.innerHTML = text[1];
        content.append(body);
      } else {
        body.innerHTML = text[0];
        content.append(body);
      }
    }
    wrapper.append(content);
    if ('enableButtonClose' in params && params.enableButtonClose) {
      let button = document.createElement('div');
      button.classList.add('vg-toast-button');
      button.innerHTML = '<button class="vg-btn-close" data-vg-dismiss="toast"></button>';
      wrapper.append(button);
    }
    target.append(wrapper);
    document.body.append(target);
    let instance = VGToast.getOrCreateInstance(target, params);
    (0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.execute)(callback, [instance]);
    instance.show();
  }
  toggle(relatedTarget) {
    return !this._isShown() ? this.show(relatedTarget) : this.hide();
  }
  show(relatedTarget) {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this._element)) return;
    this._clearTimeout();
    this._params = this._getParams(relatedTarget || {}, this._params);
    this._route(function (status, data) {
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_LOADED, {
        stats: status,
        data: data
      });
    });
    const showEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_SHOW, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) return;
    this._element.classList.add(CLASS_NAME_SHOW);
    document.body.classList.add(CLASS_NAME_OPEN);
    this._setPlacement();
    const completeCallBack = () => {
      this._element.classList.add(CLASS_NAME_SHOW);
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_SHOWN, {
        relatedTarget
      });
      this._scheduleHide();
    };
    this._queueCallback(completeCallBack, this._element, true, 0);
  }
  hide() {
    if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this._element)) return;
    const hideEvent = _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDE);
    if (hideEvent.defaultPrevented) return;
    setTimeout(() => {
      this._element?.classList.remove(CLASS_NAME_SHOW);
      const completeCallback = () => {
        document.body.classList.remove(CLASS_NAME_OPEN);
        _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDDEN);
        if (this._params.stack.enable) {
          this._setPlacement();
        }
        if (!this._params.static) {
          this.dispose();
        }
      };
      this._queueCallback(completeCallback, this._element, false, this._params.animation.delay);
    }, this._params.animation.delay);
  }
  dispose() {
    this._clearTimeout();
    if (this._isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    if (!this._params.static) {
      this._element.remove();
    }
    super.dispose();
  }
  _scheduleHide() {
    if (!this._params.autohide) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._params.delay);
  }
  _isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  _setPlacement() {
    let elms = this._enableStack();
    if (this._params.stack.enable) {
      if (elms.length > this._params.stack.max) {
        let elm = elms.shift();
        VGToast.getInstance(elm.el).hide();
      }
    }
    elms.forEach(elm => {
      let isPlacementClassTop = elm.el.classList.contains('top'),
        isPlacementClassBottom = elm.el.classList.contains('bottom'),
        isPlacementClassLeft = elm.el.classList.contains('left'),
        isPlacementClassRight = elm.el.classList.contains('right'),
        isPlacementClassCenter = elm.el.classList.contains('center');
      if (!isPlacementClassTop && !isPlacementClassBottom && !isPlacementClassCenter && !isPlacementClassRight && !isPlacementClassLeft) {
        isPlacementClassBottom = true;
        isPlacementClassCenter = true;
      }
      if (isPlacementClassCenter) {
        if (isPlacementClassLeft) {
          elm.el.style.left = 0;
          elm.el.style.bottom = 'calc(50% - (' + elm.top + 'px))';
        } else if (isPlacementClassRight) {
          elm.el.style.right = 0;
          elm.el.style.bottom = 'calc(50% - (' + elm.top + 'px))';
        } else if (isPlacementClassBottom) {
          elm.el.style.left = 'calc(50% - (' + elm.el.clientWidth + 'px) / 2)';
          elm.el.style.bottom = elm.top + 'px';
        } else if (isPlacementClassTop) {
          elm.el.style.left = 'calc(50% - (' + elm.el.clientWidth + 'px) / 2)';
          elm.el.style.top = elm.top + 'px';
        } else {
          elm.el.style.left = 'calc(50% - (' + elm.el.clientHeight + 'px) / 2)';
          elm.el.style.bottom = 'calc(50% - ' + elm.top + 'px)';
        }
      } else {
        if (isPlacementClassLeft) elm.el.style.left = 0;
        if (isPlacementClassBottom) elm.el.style.bottom = elm.top + 'px';
        if (isPlacementClassTop) elm.el.style.top = elm.top + 'px';
        if (isPlacementClassRight) elm.el.style.right = 0;
      }
    });
  }
  _enableStack() {
    let elmsShown = [..._utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].findAll('.vg-toast.show')],
      top = 0;
    if (!this._params.stack.enable) {
      elmsShown.forEach(el => {
        if (el !== this._element) {
          VGToast.getInstance(el).hide();
        }
      });
      return [{
        el: this._element,
        top: 0
      }];
    }
    elmsShown = elmsShown.map(el => {
      return {
        el: el,
        top: el.clientHeight
      };
    });
    return elmsShown.map(function (value, index) {
      if (index === 0) {
        return {
          el: value.el,
          top: 0
        };
      } else {
        top += value.top;
        return {
          el: value.el,
          top: top
        };
      }
    });
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }
  _addEventListeners() {
    _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
      if (event.key !== 'Escape') return;
      if (this._params.keyboard) {
        this.hide();
        return;
      }
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].trigger(this._element, EVENT_KEY_HIDE_PREVENTED);
    });
    if (this._params.enableClickToast) {
      this._element.classList.add('vg-toast-pointer');
      _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_CLICK_DATA_API, '#' + this._element.id, () => {
        this.hide();
      });
    }
  }
}
(0,_module_fn__WEBPACK_IMPORTED_MODULE_2__.dismissTrigger)(VGToast);

/**
 * Data API implementation
 */
_utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = _utils_js_dom_selectors__WEBPACK_IMPORTED_MODULE_4__["default"].getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if ((0,_utils_js_functions__WEBPACK_IMPORTED_MODULE_3__.isDisabled)(this)) {
    return;
  }
  this.setAttribute('aria-expanded', true);
  _utils_js_dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].one(target, EVENT_KEY_HIDDEN, () => {
    this.setAttribute('aria-expanded', false);
  });
  const data = VGToast.getOrCreateInstance(target);
  data.toggle(this);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGToast);

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
/* harmony import */ var _dom_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom/event */ "./app/utils/js/dom/event.js");



/**
 * Классы для анимаций смотрим здесь
 * https://animate.style/
 *
 * Работает с модулями у которых есть события show, hide, hidden
 */
class Animation {
  constructor(element, key, params = {}) {
    this._params = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)({
      enable: false,
      in: 'animate__backInUp',
      out: 'animate__backOutUp',
      delay: 0
    }, params);
    this.classes = {
      animated: 'animate__animated'
    };
    if (!this._params.enable) return;
    if (!(0,_functions__WEBPACK_IMPORTED_MODULE_0__.isElement)(element)) return;
    this._element = element;
    this._name_key = key;
    if (!this._element.classList.contains(this.classes.animated)) {
      this._element.classList.add(this.classes.animated);
    }
    this._triggers();
  }
  _triggers() {
    _dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(this._element, this._name_key + '.show', () => {
      this._element.classList.remove(this._params.out);
      this._element.classList.add(this._params.in);
    });
    _dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(this._element, this._name_key + '.hide', () => {
      this._element.classList.remove(this._params.in);
      this._element.classList.add(this._params.out);
    });
    _dom_event__WEBPACK_IMPORTED_MODULE_1__["default"].on(this._element, this._name_key + '.hidden', () => {
      this._element.classList.remove(this._params.out);
    });
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
let backdrop_delay = 500;
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
    }, backdrop_delay);
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

/***/ "./app/utils/js/components/templater.js":
/*!**********************************************!*\
  !*** ./app/utils/js/components/templater.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./app/utils/js/functions.js");

const TEMPLATES = [{
  type: 'collapse',
  template: ''
}, {
  type: 'modal',
  template: '<div class="vg-modal"></div>'
}, {
  type: 'pass-open',
  template: '<span data-vg-toggle="vgpass" class="[[classes]]" title="Показать / Скрыть" data-bs-toggle="tooltip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg></span>'
}, {
  type: 'pass-close',
  template: '<span data-vg-toggle="vgpass" class="[[classes]]" title="Показать / Скрыть" data-bs-toggle="tooltip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/></svg></span>'
}];
class Templater {
  constructor(el, params = {}) {
    if (!el) {
      throw new Error('Element is required');
    }
    this._element = el;
    this._params = (0,_functions__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)({
      insert: 'afterend',
      classes: []
    }, params);
    this.templateBuild = null;
  }
  render(content, callback) {
    let tmpl = this.toHTML(content, callback);
    switch (this._params.insert) {
      case 'afterend':
        this._element.insertAdjacentHTML('afterend', tmpl);
        break;
    }
  }
  toHTML(content = '' | null, callback) {
    let tmpl = '';
    for (const tmplElement of TEMPLATES) {
      if (tmplElement.type === this._params.template) {
        tmpl = tmplElement.template;
      }
    }
    if (!tmpl) return;
    tmpl = tmpl.replace('[[classes]]', this._params.classes.join(' '));
    (0,_functions__WEBPACK_IMPORTED_MODULE_0__.execute)(callback, [this._element, this._params, tmpl]);
    return tmpl;
  }
  setContent() {}
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Templater);

/***/ }),

/***/ "./app/utils/js/dom/cookie.js":
/*!************************************!*\
  !*** ./app/utils/js/dom/cookie.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! js-cookie v3.0.1 | MIT */

function assign(target) {
  for (let i = 1; i < arguments.length; i++) {
    let source = arguments[i];
    for (let key in source) {
      target[key] = source[key];
    }
  }
  return target;
}
let defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function (value) {
    return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
  }
};
function init(converter, defaultAttributes) {
  function set(key, value, attributes) {
    if (typeof document === 'undefined') {
      return;
    }
    attributes = assign({}, defaultAttributes, attributes);
    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }
    key = encodeURIComponent(key).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
    let stringifiedAttributes = '';
    for (let attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue;
      }
      stringifiedAttributes += '; ' + attributeName;
      if (attributes[attributeName] === true) {
        continue;
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }
    return document.cookie = key + '=' + converter.write(value, key) + stringifiedAttributes;
  }
  function get(key) {
    if (typeof document === 'undefined' || arguments.length && !key) {
      return;
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    let cookies = document.cookie ? document.cookie.split('; ') : [];
    let jar = {};
    for (let i = 0; i < cookies.length; i++) {
      let parts = cookies[i].split('=');
      let value = parts.slice(1).join('=');
      try {
        let foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);
        if (key === foundKey) {
          break;
        }
      } catch (e) {}
    }
    return key ? jar[key] : jar;
  }
  return Object.create({
    set: set,
    get: get,
    remove: function (key, attributes) {
      set(key, '', assign({}, attributes, {
        expires: -1
      }));
    },
    withAttributes: function (attributes) {
      return init(this.converter, assign({}, this.attributes, attributes));
    },
    withConverter: function (converter) {
      return init(assign({}, this.converter, converter), this.attributes);
    }
  }, {
    attributes: {
      value: Object.freeze(defaultAttributes)
    },
    converter: {
      value: Object.freeze(converter)
    }
  });
}
let api = init(defaultConverter, {
  path: '/'
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);

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
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'submit', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'popstate', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

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
  },
  hide(el) {
    el.style.display = 'none';
  },
  show(el, state = 'block') {
    el.style.display = state;
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
  },
  prev(element) {
    return element.previousElementSibling || null;
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
/* harmony export */   removeElementArray: () => (/* binding */ removeElementArray),
/* harmony export */   transliterate: () => (/* binding */ transliterate)
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
 * Транслитерация символов с латиницы на кириллицу и обратно
 * @param text
 * @param enToRu
 * @returns {*}
 */
function transliterate(text, enToRu) {
  let ru = "й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю".split(/ +/g);
  let en = "q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , .".split(/ +/g);
  let x;
  for (x = 0; x < ru.length; x++) {
    text = text.split(enToRu ? en[x] : ru[x]).join(enToRu ? ru[x] : en[x]);
    text = text.split(enToRu ? en[x].toUpperCase() : ru[x].toUpperCase()).join(enToRu ? ru[x].toUpperCase() : en[x].toUpperCase());
  }
  return text;
}

/**
 *
 */
const isRTL = () => document.documentElement.dir === 'rtl';


/***/ }),

/***/ "./app/modules/vgalert/scss/vgalert.scss":
/*!***********************************************!*\
  !*** ./app/modules/vgalert/scss/vgalert.scss ***!
  \***********************************************/
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

/***/ "./app/modules/vglawcookie/scss/vglawcookie.scss":
/*!*******************************************************!*\
  !*** ./app/modules/vglawcookie/scss/vglawcookie.scss ***!
  \*******************************************************/
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

/***/ "./app/modules/vgselect/scss/vgselect.scss":
/*!*************************************************!*\
  !*** ./app/modules/vgselect/scss/vgselect.scss ***!
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

/***/ "./app/modules/vgtoast/scss/vgtoast.scss":
/*!***********************************************!*\
  !*** ./app/modules/vgtoast/scss/vgtoast.scss ***!
  \***********************************************/
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
/* harmony export */   VGAlert: () => (/* reexport safe */ _app_modules_vgalert_js_vgalert__WEBPACK_IMPORTED_MODULE_19__["default"]),
/* harmony export */   VGCollapse: () => (/* reexport safe */ _app_modules_vgcollapse_js_vgcollapse__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_modules_vgdropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   VGFormSender: () => (/* reexport safe */ _app_modules_vgformsender_js_vgformsender__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   VGLawCookie: () => (/* reexport safe */ _app_modules_vglawcookie_js_vglawcookie__WEBPACK_IMPORTED_MODULE_15__["default"]),
/* harmony export */   VGModal: () => (/* reexport safe */ _app_modules_vgmodal_js_vgmodal__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   VGNav: () => (/* reexport safe */ _app_modules_vgnav_js_vgnav__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   VGRollup: () => (/* reexport safe */ _app_modules_vgrollup_js_vgrollup__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   VGSelect: () => (/* reexport safe */ _app_modules_vgselect_js_vgselect__WEBPACK_IMPORTED_MODULE_17__["default"]),
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_modules_vgsidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   VGToast: () => (/* reexport safe */ _app_modules_vgtoast_js_vgtoast__WEBPACK_IMPORTED_MODULE_21__["default"])
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
/* harmony import */ var _app_modules_vglawcookie_scss_vglawcookie_scss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./app/modules/vglawcookie/scss/vglawcookie.scss */ "./app/modules/vglawcookie/scss/vglawcookie.scss");
/* harmony import */ var _app_modules_vglawcookie_js_vglawcookie__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./app/modules/vglawcookie/js/vglawcookie */ "./app/modules/vglawcookie/js/vglawcookie.js");
/* harmony import */ var _app_modules_vgselect_scss_vgselect_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app/modules/vgselect/scss/vgselect.scss */ "./app/modules/vgselect/scss/vgselect.scss");
/* harmony import */ var _app_modules_vgselect_js_vgselect__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./app/modules/vgselect/js/vgselect */ "./app/modules/vgselect/js/vgselect.js");
/* harmony import */ var _app_modules_vgalert_scss_vgalert_scss__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./app/modules/vgalert/scss/vgalert.scss */ "./app/modules/vgalert/scss/vgalert.scss");
/* harmony import */ var _app_modules_vgalert_js_vgalert__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./app/modules/vgalert/js/vgalert */ "./app/modules/vgalert/js/vgalert.js");
/* harmony import */ var _app_modules_vgtoast_scss_vgtoast_scss__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./app/modules/vgtoast/scss/vgtoast.scss */ "./app/modules/vgtoast/scss/vgtoast.scss");
/* harmony import */ var _app_modules_vgtoast_js_vgtoast__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./app/modules/vgtoast/js/vgtoast */ "./app/modules/vgtoast/js/vgtoast.js");
// css классы по умолчанию


// sidebar



// collapse


// nav



// dropdown



// modal



// form sender



// rollup



// law cookie



// select



// alert



// toast



})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMWZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pSQTtBQUNBO0FBUUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDelhBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUN2REE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDM0NBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUNqSEE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDekRBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQW1EQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUMzVUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JTQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvbW9kdWxlLWZuLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdhbGVydC9qcy92Z2FsZXJ0LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL2hpZGVzaG93cGFzcy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9qcy92Z2Zvcm1zZW5kZXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2xhd2Nvb2tpZS9qcy92Z2xhd2Nvb2tpZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbW9kYWwvanMvdmdtb2RhbC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdyb2xsdXAvanMvdmdyb2xsdXAuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3NlbGVjdC9qcy92Z3NlbGVjdC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3RvYXN0L2pzL3ZndG9hc3QuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL292ZXJmbG93LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcGFyYW1zLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcGxhY2VtZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcmVzcG9uc2l2ZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL3Njcm9sbGJhci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL3RlbXBsYXRlci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vY29va2llLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9kYXRhLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9ldmVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZG9tL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2FsZXJ0L3Njc3MvdmdhbGVydC5zY3NzPzUwYmQiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzP2U4MjUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvc2Nzcy92Z2Zvcm1zZW5kZXIuc2Nzcz82OTEyIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdsYXdjb29raWUvc2Nzcy92Z2xhd2Nvb2tpZS5zY3NzP2RkNDUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z21vZGFsL3Njc3Mvdmdtb2RhbC5zY3NzPzEyODkiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3M/MTliYyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Zncm9sbHVwL3Njc3Mvdmdyb2xsdXAuc2Nzcz8zNTI2Iiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdzZWxlY3Qvc2Nzcy92Z3NlbGVjdC5zY3NzPzBmYmUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzcz81YWNkIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmd0b2FzdC9zY3NzL3ZndG9hc3Quc2Nzcz8xODg5Iiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzP2M2MzQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBEYXRhIGZyb20gXCIuLi91dGlscy9qcy9kb20vZGF0YVwiO1xyXG5pbXBvcnQgUGFyYW1zIGZyb20gXCIuLi91dGlscy9qcy9jb21wb25lbnRzL3BhcmFtc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtBamF4LCBnZXRTVkd9IGZyb20gXCIuL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgQW5pbWF0aW9uIGZyb20gXCIuLi91dGlscy9qcy9jb21wb25lbnRzL2FuaW1hdGlvblwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm5cclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoZWxlbWVudCk7XHJcblx0XHRpZiAoIXRoaXMuX2VsZW1lbnQpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ci0L7QstCw0YDQuNGJISDQn9C10YDQstGL0Lkg0L/QsNGA0LDQvNC10YLRgCDQvdC1INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQv9GD0YHRgtGL0LwhJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0ge307XHJcblx0XHREYXRhLnNldCh0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZLCB0aGlzKTtcclxuXHR9XHJcblxyXG5cdF9nZXRQYXJhbXMoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gbmV3IFBhcmFtcyhwYXJhbXMsIGVsZW1lbnQpLmdldCgpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdERhdGEucmVtb3ZlKHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVkpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9mZih0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkVWRU5UX0tFWSlcclxuXHJcblx0XHRmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0aGlzW3Byb3BlcnR5TmFtZV0gPSBudWxsXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcm91dGUoY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGxldCAkY29udGVudCA9IG51bGw7XHJcblxyXG5cdFx0Y29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XHJcblx0XHRcdGlmICgkY29udGVudCkgJGNvbnRlbnQuaW5uZXJIVE1MID0gZGF0YTtcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fcGFyYW1zLmhhc093blByb3BlcnR5KCdhamF4JykpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5hamF4LnJvdXRlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISdtZXRob2QnIGluIF90aGlzLl9wYXJhbXMuYWpheCkge1xyXG5cdFx0XHRfdGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kID0gJ2dldCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCd0YXJnZXQnIGluIF90aGlzLl9wYXJhbXMuYWpheCAmJiBfdGhpcy5fcGFyYW1zLmFqYXgudGFyZ2V0KSB7XHJcblx0XHRcdCRjb250ZW50ID0gU2VsZWN0b3JzLmZpbmQoX3RoaXMuX3BhcmFtcy5hamF4LnRhcmdldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdsb2FkZXInIGluIF90aGlzLl9wYXJhbXMuYWpheCAmJiBfdGhpcy5fcGFyYW1zLmFqYXgubG9hZGVyKSB7XHJcblx0XHRcdHNldERhdGEoJzxkaXYgY2xhc3M9XCJ2Zy1sb2FkZXJcIj48L2Rpdj4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRBamF4W190aGlzLl9wYXJhbXMuYWpheC5tZXRob2RdKF90aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSwgX3RoaXMuX3BhcmFtcy5hamF4LmRhdGEgfHwge30sIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0c2V0RGF0YShkYXRhLnJlc3BvbnNlKTtcclxuXHRcdFx0ZXhlY3V0ZShjYWxsYmFjaywgW3N0YXR1cywgZGF0YV0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfZGlzbWlzc0VsZW1lbnQoKSB7XHJcblx0XHRsZXQgY3Jvc3MgPSBnZXRTVkcoJ2Nyb3NzJyksXHJcblx0XHRcdGJ1dHRvbiA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvcignLnZnLWJ0bi1jbG9zZScpO1xyXG5cclxuXHRcdGlmIChidXR0b24pIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuXHRcdFx0aWYgKCFzdmcpIGJ1dHRvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNyb3NzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9xdWV1ZUNhbGxiYWNrKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0XHRleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkLCB0aW1lT3V0TXMpO1xyXG5cdH1cclxuXHJcblx0X2FuaW1hdGlvbihlbGVtZW50LCBrZXksIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRuZXcgQW5pbWF0aW9uKGVsZW1lbnQsIGtleSwgcGFyYW1zKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRGF0YS5nZXQoU2VsZWN0b3JzLmZpbmQoZWxlbWVudCksIHRoaXMuTkFNRV9LRVkpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoZWxlbWVudCkgfHwgbmV3IHRoaXMoZWxlbWVudCwgIWlzRW1wdHlPYmoocGFyYW1zKSA/IHBhcmFtcyA6IHt9KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEQVRBX0tFWSgpIHtcclxuXHRcdHJldHVybiBgdmcuJHt0aGlzLk5BTUV9YFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBFVkVOVF9LRVkoKSB7XHJcblx0XHRyZXR1cm4gYC4ke3RoaXMuREFUQV9LRVl9YFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc0VtcHR5T2JqfSBmcm9tIFwiLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQotGD0YIg0YHQvtCx0YDQsNC90Ysg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LrRgNC40L/RgtGLINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LlcclxuICovXHJcblxyXG4vKipcclxuICog0J3QsNCx0L7RgCBzdmcg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEByZXR1cm5zIHsqfHt9fVxyXG4gKi9cclxuY29uc3QgZ2V0U1ZHID0gKG5hbWUpID0+IHtcclxuXHRjb25zdCBzdmcgPSAge1xyXG5cdFx0ZXJyb3I6ICc8c3ZnICB2aWV3Qm94PVwiMCAwIDg3IDg3XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBpZD1cInVpLXN1Y2Nlc3NcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIGlkPVwiR3JvdXAtMlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApXCI+PGNpcmNsZSBpZD1cIk92YWwtMlwiIHN0cm9rZT1cInJnYmEoMjUyLCAxOTEsIDE5MSwgLjUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLWVycm9yLWNpcmNsZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCI0XCIgY3g9XCI0MS41XCIgY3k9XCI0MS41XCIgcj1cIjQxLjVcIj48L2NpcmNsZT48cGF0aCBjbGFzcz1cInVpLWVycm9yLWxpbmUxXCIgZD1cIk0yMi4yNDQyMjQsMjIgTDYwLjQyNzk5MDIsNjAuMTgzNzY2MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PHBhdGggY2xhc3M9XCJ1aS1lcnJvci1saW5lMlwiIGQ9XCJNNjAuNzU1Nzc2LDIxIEwyMy4yNDQyMjQsNTkuODQ0MzQ5MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4nLFxyXG5cdFx0c3VjY2VzczogJzxzdmcgdmlld0JveD1cIjAgMCA4NyA4N1wiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGcgaWQ9XCJ1aS1lcnJvclwiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgxMTcsIDE4MywgMTUyLCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSAgY2xhc3M9XCJ1aS1zdWNjZXNzLWNpcmNsZVwiIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxwb2x5bGluZSBjbGFzcz1cInVpLXN1Y2Nlc3MtcGF0aFwiIGlkPVwiUGF0aC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBwb2ludHM9XCIxOSAzOC44MDM2ODEzIDMxLjEwMjA3NDQgNTQuODA0Njg3NSA2My4yOTkyMjEgMjhcIj48L3BvbHlsaW5lPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdHdhaXRpbmc6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODcgODdcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnIGlkPVwidWktd2FpdGluZ1wiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgyNTUsIDIxOCwgMTA2LCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLXdhaXRpbmctY2lyY2xlXCIgaWQ9XCJPdmFsLTJcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PHBhdGggY2xhc3M9XCJ1aS13YWl0aW5nLWxpbmUxXCIgZD1cIk00MyA2M0M1NC41OTggNjMgNjQgNTMuNTk4IDY0IDQyQzY0IDMwLjQwMiA1NC41OTggMjEgNDMgMjFDMzEuNDAyIDIxIDIyIDMwLjQwMiAyMiA0MkMyMiA1My41OTggMzEuNDAyIDYzIDQzIDYzWlwiIHN0cm9rZS13aWR0aD1cIjNcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjxwYXRoIGNsYXNzPVwidWktd2FpdGluZy1saW5lMlwiIGQ9XCJNNDAuNjY2NyAzMi42NjQxVjQ0LjMzMDdINTIuMzMzNFwiIHN0cm9rZT1cIiNmZmRhNmFcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdGRvdHM6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJiaSBiaS10aHJlZS1kb3RzLXZlcnRpY2FsXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOS41IDEzYTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHpcIi8+PC9zdmc+JyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLQtdGI0LDQtdC8INGB0L7QsdGL0YLQuNC1IFwi0JfQsNC60YDRi9GC0YxcIiDQvdCwINCy0YHQtSDQvNC+0LTQsNC70LrQuCwg0YHQsNC50LTQsdCw0YDRiyDQuCDRgi7Qvy5cclxuICogQHBhcmFtIG1vZHVsZVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqL1xyXG5jb25zdCBkaXNtaXNzVHJpZ2dlciA9IChtb2R1bGUsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xyXG5cdGNvbnN0IGNsaWNrRXZlbnQgPSBgY2xpY2suZGlzbWlzcy4ke21vZHVsZS5FVkVOVF9LRVl9YFxyXG5cdGNvbnN0IG5hbWUgPSBtb2R1bGUuTkFNRTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBjbGlja0V2ZW50LCBgW2RhdGEtdmctZGlzbWlzcz1cIiR7bmFtZX1cIl1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpIHx8IHRoaXMuY2xvc2VzdChgLnZnLSR7bmFtZX1gKTtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gbW9kdWxlLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KTtcclxuXHJcblx0XHRpbnN0YW5jZVttZXRob2RdKCk7XHJcblx0fSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEFKQVggUkVRVUVTVFxyXG4gKiBAdHlwZSB7e3Bvc3Q6IGFqYXgucG9zdCwgZ2V0OiBhamF4LmdldCwgeDogKChmdW5jdGlvbigpOiAoWE1MSHR0cFJlcXVlc3QpKXwqKSwgc2VuZDogYWpheC5zZW5kfX1cclxuICovXHJcbmNvbnN0IEFqYXggPSB7XHJcblx0eDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHZlcnNpb25zID0gW1xyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjYuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjUuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjQuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjMuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjIuMFwiLFxyXG5cdFx0XHRcIk1pY3Jvc29mdC5YbWxIdHRwXCJcclxuXHRcdF07XHJcblxyXG5cdFx0bGV0IHhocjtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCh2ZXJzaW9uc1tpXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHhocjtcclxuXHR9LFxyXG5cclxuXHRzZW5kOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBhc3luYykge1xyXG5cdFx0aWYgKGFzeW5jID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0YXN5bmMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHggPSBBamF4LngoKTtcclxuXHRcdHgub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG5cdFx0eC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHguc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjYXNlIDIwMDpcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ3N1Y2Nlc3MnLCB7dGV4dDogeC5zdGF0dXNUZXh0LCByZXNwb25zZTogeC5yZXNwb25zZVRleHQsIGNvZGU6IHguc3RhdHVzfSlcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnZXJyb3InLCB7dGV4dDogeC5zdGF0dXNUZXh0LCByZXNwb25zZTogeC5yZXNwb25zZVRleHQsIGNvZGU6IHguc3RhdHVzfSlcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0eC5zZW5kKGRhdGEpXHJcblx0fSxcclxuXHJcblx0Z2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmICghaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdEFqYXguc2VuZCh1cmwgKyAocXVlcnkubGVuZ3RoID8gJz8nICsgcXVlcnkuam9pbignJicpIDogJycpLCBjYWxsYmFjaywgJ0dFVCcsIG51bGwsIGFzeW5jKVxyXG5cdH0sXHJcblxyXG5cdHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0QWpheC5zZW5kKHVybCwgY2FsbGJhY2ssICdQT1NUJywgZGF0YSwgYXN5bmMpXHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuXHRkaXNtaXNzVHJpZ2dlciwgQWpheCwgZ2V0U1ZHXHJcbn0iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IHtleGVjdXRlLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnYWxlcnQnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5hbGVydCc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwiYWxlcnRcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX09QRU4gPSAndmctYWxlcnQtb3Blbic7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiAgPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCAgPSBgJHtOQU1FX0tFWX0ubG9hZGVkYDtcclxuY29uc3QgRVZFTlRfS0VZX0NPTkZJUk0gPSBgJHtOQU1FX0tFWX0uY29uZmlybWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DQU5DRUwgID0gYCR7TkFNRV9LRVl9LmNhbmNlbGA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHQWxlcnQgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdG92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0Y29uZmlybTogdHJ1ZSxcclxuXHRcdFx0c2hvd0luc2lkZTogdHJ1ZSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JyxcclxuXHRcdFx0ZWxlbWVudHM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQndGl0bGUnOiAn0JLRiyDRg9Cy0LXRgNC10L3Riz8nLFxyXG5cdFx0XHRcdFx0J2VsZW1lbnQnOiAnYnV0dG9uJyxcclxuXHRcdFx0XHRcdCd0eXBlJzogJ2NvbmZpcm0nLFxyXG5cdFx0XHRcdFx0J2NsYXNzZXMnOiBbJ2J0bicsICdidG4tcHJpbWFyeSddXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdLFxyXG5cdFx0XHRhbmltYXRpb246IHtcclxuXHRcdFx0XHRlbmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdGluOiAnYW5pbWF0ZV9fcm9sbEluJyxcclxuXHRcdFx0XHRvdXQ6ICdhbmltYXRlX19yb2xsT3V0JyxcclxuXHRcdFx0XHRkZWxheTogODAwLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0XHRsb2FkZXI6IGZhbHNlLFxyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5ID0gIXRoaXMuX3BhcmFtcy5hbmltYXRpb24uZW5hYmxlID8gMCA6IHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXk7XHJcblx0XHR0aGlzLl9hbmltYXRpb24odGhpcy5fZWxlbWVudCwgVkdBbGVydC5OQU1FX0tFWSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbik7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBydW4odGV4dCwgcGFyYW1zID0ge30sIGNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gVkdBbGVydC5idWlsZCh0ZXh0LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZCh0ZXh0LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0XHRwYXJhbXMgPSBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHR0aGVtZTogJ2RlZmF1bHQnLFxyXG5cdFx0fSwgcGFyYW1zKTtcclxuXHJcblx0XHRsZXQgdGFyZ2V0O1xyXG5cclxuXHRcdGxldCBpbnN0YW5jZSA9ICBWR0FsZXJ0LmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0LCBwYXJhbXMpO1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaywgW2luc3RhbmNlXSk7XHJcblx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHJldHVybjtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdBbGVydCk7XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHQWxlcnQ7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge21lcmdlRGVlcE9iamVjdCwgcmVmbG93fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnY29sbGFwc2UnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTRSA9ICd2Zy1jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ09MTEFQU0lORyA9ICd2Zy1jb2xsYXBzaW5nJztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTRUQgPSAndmctY29sbGFwc2VkJztcclxuY29uc3QgQ0xBU1NfTkFNRV9ERUVQRVJfQ0hJTERSRU4gPSBgOnNjb3BlIC4ke0NMQVNTX05BTUVfQ09MTEFQU0V9IC4ke0NMQVNTX05BTUVfQ09MTEFQU0V9YDtcclxuXHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwiY29sbGFwc2VcIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9BQ1RJVkVTID0gJy5jb2xsYXBzZS5zaG93LCAuY29sbGFwc2UuY29sbGFwc2luZyc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHQ29sbGFwc2UgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0dG9nZ2xlOiB0cnVlLFxyXG5cdFx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnLFxyXG5cdFx0XHRcdGxvYWRlcjogZmFsc2UsXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlXHJcblx0XHR0aGlzLl90cmlnZ2VyQXJyYXkgPSBbXVxyXG5cclxuXHRcdGNvbnN0IHRvZ2dsZUxpc3QgPSBTZWxlY3RvcnMuZmluZEFsbChTRUxFQ1RPUl9EQVRBX1RPR0dMRSk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCBlbGVtIG9mIHRvZ2dsZUxpc3QpIHtcclxuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBTZWxlY3RvcnMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtKTtcclxuXHRcdFx0Y29uc3QgZmlsdGVyRWxlbWVudCA9IFNlbGVjdG9ycy5maW5kQWxsKHNlbGVjdG9yKS5maWx0ZXIoZm91bmRFbGVtZW50ID0+IGZvdW5kRWxlbWVudCA9PT0gdGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0XHRpZiAoc2VsZWN0b3IgIT09IG51bGwgJiYgZmlsdGVyRWxlbWVudC5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzLl90cmlnZ2VyQXJyYXkucHVzaChlbGVtKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5faW5pdGlhbGl6ZUNoaWxkcmVuKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMucGFyZW50KSB7XHJcblx0XHRcdHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl90cmlnZ2VyQXJyYXksIHRoaXMuX2lzU2hvd24oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0dGhpcy50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8IF90aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHRsZXQgYWN0aXZlQ2hpbGRyZW4gPSBbXTtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5wYXJlbnQpIHtcclxuXHRcdFx0YWN0aXZlQ2hpbGRyZW4gPSB0aGlzLl9nZXRGaXJzdExldmVsQ2hpbGRyZW4oU0VMRUNUT1JfQUNUSVZFUylcclxuXHRcdFx0XHQuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudClcclxuXHRcdFx0XHQubWFwKGVsZW1lbnQgPT4gVkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHsgdG9nZ2xlOiBmYWxzZSB9KSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGFjdGl2ZUNoaWxkcmVuLmxlbmd0aCAmJiBhY3RpdmVDaGlsZHJlblswXS5faXNUcmFuc2l0aW9uaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3Qgc3RhcnRFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVyk7XHJcblx0XHRpZiAoc3RhcnRFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0Zm9yIChjb25zdCBhY3RpdmVJbnN0YW5jZSBvZiBhY3RpdmVDaGlsZHJlbikge1xyXG5cdFx0XHRhY3RpdmVJbnN0YW5jZS5oaWRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNFKVxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNJTkcpXHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gMDtcclxuXHJcblx0XHRfdGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKF90aGlzLl90cmlnZ2VyQXJyYXksIHRydWUpO1xyXG5cdFx0X3RoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcblxyXG5cdFx0X3RoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNFLCBDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04pO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlLCBfdGhpcy5fZWxlbWVudCwgdHJ1ZSk7XHJcblxyXG5cdFx0Y29uc3Qgc2Nyb2xsU2l6ZSA9IGBzY3JvbGxIZWlnaHRgO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7X3RoaXMuX2VsZW1lbnRbc2Nyb2xsU2l6ZV19cHhgO1xyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMuX2lzVHJhbnNpdGlvbmluZyB8fCAhX3RoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHN0YXJ0RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpXHJcblx0XHRpZiAoc3RhcnRFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHR9cHhgO1xyXG5cdFx0cmVmbG93KF90aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0lORyk7XHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0UsIENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0cmlnZ2VyIG9mIF90aGlzLl90cmlnZ2VyQXJyYXkpIHtcclxuXHRcdFx0Y29uc3QgZWxlbWVudCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRyaWdnZXIpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgIV90aGlzLl9pc1Nob3duKGVsZW1lbnQpKSB7XHJcblx0XHRcdFx0X3RoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhbdHJpZ2dlcl0sIGZhbHNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSB0cnVlXHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNJTkcpO1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0UpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgX3RoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModHJpZ2dlckFycmF5LCBpc09wZW4pIHtcclxuXHRcdGlmICghdHJpZ2dlckFycmF5Lmxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdHJpZ2dlckFycmF5KSB7XHJcblx0XHRcdHRoaXMuX2NoYW5nZVN0YXRlQnV0dG9uKGVsZW1lbnQsIGlzT3Blbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfaW5pdGlhbGl6ZUNoaWxkcmVuKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMucGFyZW50KSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRGaXJzdExldmVsQ2hpbGRyZW4oU0VMRUNUT1JfREFUQV9UT0dHTEUpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBjaGlsZHJlbikge1xyXG5cdFx0XHRjb25zdCBzZWxlY3RlZCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpXHJcblxyXG5cdFx0XHRpZiAoc2VsZWN0ZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoW2VsZW1lbnRdLCB0aGlzLl9pc1Nob3duKHNlbGVjdGVkKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2dldEZpcnN0TGV2ZWxDaGlsZHJlbihzZWxlY3Rvcikge1xyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSBTZWxlY3RvcnMuZmluZChDTEFTU19OQU1FX0RFRVBFUl9DSElMRFJFTiwgdGhpcy5fcGFyYW1zLnBhcmVudCk7XHJcblx0XHRyZXR1cm4gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IsIHRoaXMuX3BhcmFtcy5wYXJlbnQpLmZpbHRlcihlbGVtZW50ID0+ICFjaGlsZHJlbi5pbmNsdWRlcyhlbGVtZW50KSk7XHJcblx0fVxyXG5cclxuXHRfY2hhbmdlU3RhdGVCdXR0b24oZWxlbWVudCwgaXNPcGVuKSB7XHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfTkFNRV9DT0xMQVBTRUQsICFpc09wZW4pO1xyXG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pO1xyXG5cdFx0ZWxlbWVudC5pbm5lckhUTUwgPSBNYW5pcHVsYXRvci5nZXQoZWxlbWVudCwgYGRhdGEtJHtpc09wZW4gPyAnaGlkZScgOiAnc2hvdyd9LXRleHRgKSB8fCBlbGVtZW50LmlubmVySFRNTDtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdBJyB8fCAoZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgZXZlbnQuZGVsZWdhdGVUYXJnZXQudGFnTmFtZSA9PT0gJ0EnKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0U2VsZWN0b3JzLmdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IodGhpcykuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0VkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fSk7XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0NvbGxhcHNlOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIG1lcmdlRGVlcE9iamVjdCwgbm9vcH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGxhY2VtZW50IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3BsYWNlbWVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcblxyXG5jb25zdCBOQU1FICAgICAgICAgICAgID0gJ2Ryb3Bkb3duJztcclxuY29uc3QgTkFNRV9LRVkgICAgICAgICA9ICd2Zy5kcm9wZG93bic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgPSAnZmFkZSc7XHJcbmNvbnN0IFRBUkdFVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24tY29udGVudCc7XHJcbmNvbnN0IFBBUkVOVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXSc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSAgICAgYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSA9ICAgYGtleWRvd24uJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9ICAgICBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgPSAgYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHRHJvcGRvd24gZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0bGV0IGRlZmF1bHRQYXJhbXMgPSB7XHJcblx0XHRcdG9mZnNldDogWzAsIDJdLFxyXG5cdFx0XHRiYWNrZHJvcDogZmFsc2UsXHJcblx0XHRcdG92ZXJmbG93OiBmYWxzZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IGZhbHNlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cdFx0XHR0aW1lb3V0QW5pbWF0aW9uOiAzNTAsXHJcblx0XHRcdGhvdmVyOiBmYWxzZSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdFx0bG9hZGVyOiBmYWxzZSxcclxuXHRcdFx0fSxcclxuXHRcdFx0YW5pbWF0aW9uOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiBmYWxzZSxcclxuXHRcdFx0XHRpbjogJ2FuaW1hdGVfX2ZsaXBJblknLFxyXG5cdFx0XHRcdG91dDogJ2FuaW1hdGVfX2ZsaXBPdXRZJyxcclxuXHRcdFx0XHRkZWxheTogODAwLFxyXG5cdFx0XHR9LFxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnb2Zmc2V0JyBpbiBwYXJhbXMgJiYgQXJyYXkuaXNBcnJheShwYXJhbXMub2Zmc2V0KSkge1xyXG5cdFx0XHRkZWZhdWx0UGFyYW1zLm9mZnNldCA9IHBhcmFtcy5vZmZzZXQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdChkZWZhdWx0UGFyYW1zLCBwYXJhbXMpKTtcclxuXHJcblx0XHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHR0aGlzLl9wYXJlbnQgPSB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGU7XHJcblx0XHR0aGlzLl9kcm9wID0gdGFyZ2V0IHx8IFNlbGVjdG9ycy5maW5kKCcuJyArIFRBUkdFVF9DT05UQUlORVIsIHRoaXMuX3BhcmVudCk7XHJcblx0XHR0aGlzLl9pc1BsYWNlbWVudCA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXkgPSAhdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5lbmFibGUgPyAwIDogdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheTtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbih0aGlzLl9kcm9wLCBWR0Ryb3Bkb3duLk5BTUVfS0VZLCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9pc1Nob3duKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xyXG5cdH1cclxuXHJcblx0c2hvdygpIHtcclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMuX2VsZW1lbnQpIHx8IHRoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRoaXMuX2VsZW1lbnRcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fc2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5iYWNrZHJvcCAmJiAhdGhpcy5fcGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duLW9wZW4nKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSB8fCAhdGhpcy5faXNTaG93bigpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLl9lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHJldHVybiBzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSwgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmJhY2tkcm9wICYmICF0aGlzLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd24tb3BlbicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fcGFyZW50LCB0cnVlLCAxMCk7XHJcblx0XHR9LCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5KTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub2Zmc2V0KSB7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdUb3AgPSBfdGhpcy5fcGFyYW1zLm9mZnNldFsxXSArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdSaWdodCA9IF90aGlzLl9wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgUEFSRU5UX0NPTlRBSU5FUik7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCFpbnN0YW5jZS5fcGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRpbnN0YW5jZS5fY29tcGxldGVIaWRlKHtyZWxhdGVkVGFyZ2V0OiBpbnN0YW5jZS5fZWxlbWVudH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWURPV05fREFUQV9BUEksICcuJyArIFRBUkdFVF9DT05UQUlORVIsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl06bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHRHJvcGRvd24uZ2V0SW5zdGFuY2UodG9nZ2xlKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZHJvcCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMga2V5ZG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlzSW5wdXQgPSAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKVxyXG5cdFx0Y29uc3QgaXNFc2NhcGVFdmVudCA9IGV2ZW50LmtleSA9PT0gJ0VzY2FwZSdcclxuXHRcdGNvbnN0IGlzVXBPckRvd25FdmVudCA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXS5pbmNsdWRlcyhldmVudC5rZXkpXHJcblxyXG5cdFx0aWYgKCFpc1VwT3JEb3duRXZlbnQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzSW5wdXQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuXHRcdGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgP1xyXG5cdFx0XHR0aGlzIDogKFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5wYXJlbnROb2RlKSlcclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShnZXRUb2dnbGVCdXR0b24pXHJcblxyXG5cdFx0aWYgKGlzVXBPckRvd25FdmVudCkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5zaG93KClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2UuaGlkZSgpXHJcblx0XHRcdGdldFRvZ2dsZUJ1dHRvbi5mb2N1cygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRHJvcGRvd247IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7aXNEaXNhYmxlZCwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBUZW1wbGF0ZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvdGVtcGxhdGVyXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnaGlkZXNob3dwYXNzJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuaGlkZXNob3dwYXNzJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJ2Z3Bhc3NcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHSGlkZVNob3dQYXNzIGV4dGVuZHMgQmFzZU1vZHVsZXtcclxuXHRjb25zdHJ1Y3RvcihlbCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsLCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHJcblx0XHR9LCBwYXJhbXMpKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUocmVsYXRlZFRhcmdldCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGlmIChyZWxhdGVkVGFyZ2V0KSB0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMocmVsYXRlZFRhcmdldCwgdGhpcy5fcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHJlbGF0ZWRUYXJnZXQucmVtb3ZlKCk7XHJcblx0XHR0aGlzLmJ1aWxkKHRydWUpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KHRoaXMuX2VsZW1lbnQsICd0eXBlJywgJ3RleHQnKTtcclxuXHR9XHJcblxyXG5cdGhpZGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRyZWxhdGVkVGFyZ2V0LnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5idWlsZChmYWxzZSk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQodGhpcy5fZWxlbWVudCwgJ3R5cGUnLCAncGFzc3dvcmQnKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaW5pdChlbCwgcGFyYW1zKSB7XHJcblx0XHRsZXQgaW5zdGFuY2UgPSBWR0hpZGVTaG93UGFzcy5nZXRPckNyZWF0ZUluc3RhbmNlKGVsLCBwYXJhbXMpO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoZmFsc2UpO1xyXG5cdH1cclxuXHJcblx0YnVpbGQoaXNTaG93ID0gZmFsc2UpIHtcclxuXHRcdGlmICghaXNTaG93KSB7XHJcblx0XHRcdHRoaXMuX3BhcmFtcy50ZW1wbGF0ZSA9ICdwYXNzLWNsb3NlJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX3BhcmFtcy50ZW1wbGF0ZSA9ICdwYXNzLW9wZW4nO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5ldyBUZW1wbGF0ZXIodGhpcy5fZWxlbWVudCwgdGhpcy5fcGFyYW1zKS5yZW5kZXIoKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMucHJldih0aGlzKTtcclxuXHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHSGlkZVNob3dQYXNzLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KVxyXG5cdGluc3RhbmNlLnRvZ2dsZSh0aGlzKTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0hpZGVTaG93UGFzcyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgVkdNb2RhbCBmcm9tIFwiLi4vLi4vdmdtb2RhbC9qcy92Z21vZGFsXCI7XHJcbmltcG9ydCB7XHJcblx0ZXhlY3V0ZSxcclxuXHRpc09iamVjdCxcclxuXHRpc1Zpc2libGUsXHJcblx0bWFrZVJhbmRvbVN0cmluZyxcclxuXHRtZXJnZURlZXBPYmplY3QsXHJcblx0bm9vcCxcclxuXHRub3JtYWxpemVEYXRhXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBWR0NvbGxhcHNlIGZyb20gXCIuLi8uLi92Z2NvbGxhcHNlL2pzL3ZnY29sbGFwc2VcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IFZHSGlkZVNob3dQYXNzIGZyb20gXCIuL2hpZGVzaG93cGFzc1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdmb3JtLXNlbmRlcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLmZzJztcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHMgRXZlbnRzXHJcbiAqL1xyXG5jb25zdCBFVkVOVF9LRVlfU1VDQ0VTUyA9ICd2Zy5mcy5zdWNjZXNzJztcclxuY29uc3QgRVZFTlRfS0VZX0VSUk9SICAgPSAndmcuZnMuZXJyb3InO1xyXG5jb25zdCBFVkVOVF9LRVlfQkVGT1JFICA9ICd2Zy5mcy5iZWZvcmUnO1xyXG5cclxuY29uc3QgRVZFTlRfU1VCTUlUX0RBVEFfQVBJID0gYHN1Ym1pdC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0Zvcm1TZW5kZXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0cmVkaXJlY3Q6IHtcclxuXHRcdFx0XHRlcnJvcjogJycsXHJcblx0XHRcdFx0c3VjY2VzczogJydcclxuXHRcdFx0fSxcclxuXHRcdFx0dmFsaWRhdGU6IGZhbHNlLFxyXG5cdFx0XHRzdWJtaXQ6IGZhbHNlLFxyXG5cdFx0XHRmaWVsZHM6IFtdLFxyXG5cdFx0XHR0aW1lb3V0OiA1MCxcclxuXHRcdFx0cGFzczoge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0dGVtcGxhdGU6ICdwYXNzLW9wZW4nLFxyXG5cdFx0XHRcdGNsYXNzZXM6IFsndmctZm9ybS1zZW5kZXItLWhpZGUtc2hvdy1wYXNzJ10sXHJcblx0XHRcdFx0aW5zZXJ0OiAnYWZ0ZXJlbmQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGFsZXJ0OiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHR0eXBlOiAnbW9kYWwnLFxyXG5cdFx0XHRcdGVycm9yczogdHJ1ZSxcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctZm9ybS1zZW5kZXInLFxyXG5cdFx0XHRcdGFsZXJ0Q29sbGFwc2U6ICd2Zy1mb3JtLXNlbmRlci1jb2xsYXBzZScsXHJcblx0XHRcdFx0YWxlcnRNb2RhbDogJ3ZnLWZvcm0tc2VuZGVyLW1vZGFsJyxcclxuXHRcdFx0XHR2YWxpZGF0aW9uOiAnbmVlZHMtdmFsaWRhdGlvbicsXHJcblx0XHRcdFx0d2FzVmFsaWRhdGU6ICd3YXMtdmFsaWRhdGVkJyxcclxuXHRcdFx0XHRjb250ZW50OiAndmctZm9ybS1zZW5kZXItLWNvbnRlbnQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGNhbGxiYWNrOiB7XHJcblx0XHRcdFx0YWZ0ZXJJbml0OiBub29wXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5hamF4LnJvdXRlID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdhY3Rpb24nKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdtZXRob2QnKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5fYnV0dG9uID0gU2VsZWN0b3JzLmZpbmQoJ1t0eXBlPVwic3VibWl0XCJdJywgdGhpcy5fZWxlbWVudCkgfHwgU2VsZWN0b3JzLmZpbmQoJ1tmb3JtPVwiJyArIHRoaXMuX2VsZW1lbnQuaWQgKyAnXCJdJykgfHwgbnVsbDtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuaXNCdG5UZXh0ICAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtYnRuLXRleHQnKSAhPT0gJ2ZhbHNlJztcclxuXHRcdHRoaXMuX3BhcmFtcy5pc0pzb25QYXJzZSA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnZGF0YS1qc29uLXBhcnNlJykgIT09ICdmYWxzZSc7XHJcblx0XHR0aGlzLl9wYXJhbXMuaXNTaG93UGFzcyAgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtc2hvdy1wYXNzJykgPT09ICd0cnVlJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGJ1aWxkKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5jbGFzc2VzLmdlbmVyYWwpO1xyXG5cclxuXHRcdFsuLi4gU2VsZWN0b3JzLmZpbmRBbGwoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JywgdGhpcy5fZWxlbWVudCldLmZvckVhY2goKGVsKSA9PiB7XHJcblx0XHRcdGlmIChpc1Zpc2libGUoZWwpKSB7XHJcblx0XHRcdFx0ZWwucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5jbGFzc2VzLmNvbnRlbnQpXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMudmFsaWRhdGUpIHtcclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KHRoaXMuX2VsZW1lbnQsICdub3ZhbGlkYXRlJywgJycpO1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5fcGFyYW1zLmNsYXNzZXMudmFsaWRhdGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5wYXNzLmVuYWJsZWQpIHtcclxuXHRcdFx0Wy4uLiBTZWxlY3RvcnMuZmluZEFsbCgnaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJywgdGhpcy5fZWxlbWVudCldLmZvckVhY2goKGVsKSA9PiB7XHJcblx0XHRcdFx0VkdIaWRlU2hvd1Bhc3MuaW5pdChlbCwgdGhpcy5fcGFyYW1zLnBhc3MpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4ZWN1dGUodGhpcy5fcGFyYW1zLmNhbGxiYWNrLmFmdGVySW5pdCwgW3RoaXMuX2VsZW1lbnQsIHRoaXNdKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cdH1cclxuXHJcblx0cmVxdWVzdChkYXRhLCBldmVudCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9hbGVydEJlZm9yZSgpO1xyXG5cclxuXHRcdF90aGlzLl9wYXJhbXMuYWpheC5kYXRhID0gZGF0YTtcclxuXHJcblx0XHRfdGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd3YXMtdmFsaWRhdGVkJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC5lbmFibGVkKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBzdGF0dXMgPT09ICdzdHJpbmcnICYmIHN0YXR1cyA9PT0gJ2Vycm9yJykge1xyXG5cdFx0XHRcdFx0aWYgKF90aGlzLl9wYXJhbXMucmVkaXJlY3QuZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBfdGhpcy5fcGFyYW1zLnJlZGlyZWN0LmVycm9yO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMuX2FsZXJ0RXJyb3IoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ3N0cmluZycgJiYgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLnJlZGlyZWN0LnN1Y2Nlc3MpIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBfdGhpcy5fcGFyYW1zLnJlZGlyZWN0LnN1Y2Nlc3M7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5fYWxlcnRTdWNjZXNzKGV2ZW50LCBkYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0QmVmb3JlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdjb2xsYXBzZScpIHtcclxuXHRcdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdFx0VkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHt0b2dnbGU6IGZhbHNlfSkuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX3N0YXR1c0J1dHRvbignYmVmb3JlJyk7XHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0JFRk9SRSwgX3RoaXMpO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0RXJyb3IoZXZlbnQsIGRhdGEpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdhZnRlcicpO1xyXG5cdFx0X3RoaXMuX2pzb25QYXJzZShkYXRhLCAnZXJyb3InKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfRVJST1IsIFtldmVudCwgX3RoaXMsIGRhdGFdKTtcclxuXHR9XHJcblxyXG5cdF9hbGVydFN1Y2Nlc3MoZXZlbnQsIGRhdGEpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdhZnRlcicpO1xyXG5cdFx0X3RoaXMuX2pzb25QYXJzZShkYXRhLCAnc3VjY2VzcycpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TVUNDRVNTLCBbZXZlbnQsIF90aGlzLCBkYXRhXSk7XHJcblx0fVxyXG5cclxuXHRfc3RhdHVzQnV0dG9uKHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2J1dHRvbikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBidG5TdWJtaXRUZXh0ID0gX3RoaXMuX2J1dHRvbixcclxuXHRcdFx0YnRuVGV4dCA9IHtcclxuXHRcdFx0c2VuZDogJ9Ce0YLQv9GA0LDQstC70Y/QtdC8Li4uJyxcclxuXHRcdFx0dGV4dDogJ9Ce0YLQv9GA0LDQstC40YLRjCdcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS1zcGlubmVyJykgJiYgc3RhdHVzID09PSAnYmVmb3JlJykge1xyXG5cdFx0XHRfdGhpcy5fYnV0dG9uLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtIG1lLTJcIj48L3NwYW4+Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0JykpIHtcclxuXHRcdFx0YnRuVGV4dC50ZXh0ID0gTWFuaXB1bGF0b3IuZ2V0KF90aGlzLl9idXR0b24sICdkYXRhLXRleHQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCAkYnRuVGV4dCA9IF90aGlzLl9idXR0b24ucXVlcnlTZWxlY3RvcignW2RhdGEtdGV4dF0nKTtcclxuXHRcdFx0aWYgKCRidG5UZXh0KSB7XHJcblx0XHRcdFx0YnRuVGV4dC50ZXh0ID0gTWFuaXB1bGF0b3IuZ2V0KCRidG5UZXh0LCAnZGF0YS10ZXh0Jyk7XHJcblx0XHRcdFx0YnRuU3VibWl0VGV4dCA9ICRidG5UZXh0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0LXNlbmQnKSkge1xyXG5cdFx0XHRidG5UZXh0LnNlbmQgPSBNYW5pcHVsYXRvci5nZXQoX3RoaXMuX2J1dHRvbiwgJ2RhdGEtdGV4dC1zZW5kJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgJGJ0blRleHRTZW5kID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXh0LXNlbmRdJyk7XHJcblx0XHRcdGlmICgkYnRuVGV4dFNlbmQpIHtcclxuXHRcdFx0XHRidG5UZXh0LnNlbmQgPSBNYW5pcHVsYXRvci5nZXQoJGJ0blRleHRTZW5kLCAnZGF0YS10ZXh0LXNlbmQnKTtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0ID0gJGJ0blRleHRTZW5kO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN0YXR1cyA9PT0gJ2JlZm9yZScpIHtcclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMuaXNCdG5UZXh0KSB7XHJcblx0XHRcdFx0YnRuU3VibWl0VGV4dC5pbm5lckhUTUwgPSBidG5UZXh0LnNlbmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KF90aGlzLl9idXR0b24sJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN0YXR1cyA9PT0gJ2FmdGVyJykge1xyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5pc0J0blRleHQpIHtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0LmlubmVySFRNTCA9IGJ0blRleHQudGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRNYW5pcHVsYXRvci5yZW1vdmUoX3RoaXMuX2J1dHRvbiwnZGlzYWJsZWQnKTtcclxuXHJcblx0XHRcdGxldCBzcGlubmVyID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCcuc3Bpbm5lci1ib3JkZXInKTtcclxuXHRcdFx0aWYgKHNwaW5uZXIpIHNwaW5uZXIucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfanNvblBhcnNlKGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmlzSnNvblBhcnNlICYmIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRsZXQgcGFyc2VyRGF0YSA9IHt9O1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRwYXJzZXJEYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuXHRcdFx0XHRfdGhpcy5hbGVydChwYXJzZXJEYXRhLCBzdGF0dXMpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0X3RoaXMuYWxlcnQoZGF0YSwgc3RhdHVzKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0X3RoaXMuYWxlcnQoZGF0YSwgc3RhdHVzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFsZXJ0KGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSkge1xyXG5cdFx0XHRpZiAoKCdjb2RlJyBpbiBkYXRhKSAmJiBkYXRhLmNvZGUgJiYgZGF0YS5jb2RlID09PSAyMDApIHtcclxuXHRcdFx0XHRpZiAoJ3Jlc3BvbnNlJyBpbiBkYXRhICYmIGRhdGEucmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdGxldCByZXNwb25zZSA9IG5vcm1hbGl6ZURhdGEoZGF0YS5yZXNwb25zZSk7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UuaW5kZXhPZihcIlBhcnNlIGVycm9yXCIpICE9PSAtMSB8fCByZXNwb25zZS5pbmRleE9mKFwic3ludGF4IGVycm9yXCIpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdHN0YXR1cyA9ICdlcnJvcic7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAnRXJyb3InLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSByZXBlYXQgbGF0ZXInXHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBwbGVhc2UgcmVwZWF0IGxhdGVyJ1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKCdlcnJvcnMnIGluIHJlc3BvbnNlICYmIG5vcm1hbGl6ZURhdGEocmVzcG9uc2UuZXJyb3JzKSkge1xyXG5cdFx0XHRcdFx0XHRcdHN0YXR1cyA9IG5vcm1hbGl6ZURhdGEocmVzcG9uc2UuZXJyb3JzKSA/ICdlcnJvcicgOiAnc3VjY2Vzcyc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIV90aGlzLl9wYXJhbXMuYWxlcnQuZW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQudHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRfdGhpcy5fYWxlcnRNb2RhbChkYXRhLCBzdGF0dXMpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG5cdFx0XHRfdGhpcy5fYWxlcnRDb2xsYXBzZShkYXRhLCBzdGF0dXMpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfYWxlcnRNb2RhbChkYXRhLCBzdGF0dXMpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHQvLyDQldGB0YLRjCDQu9C4INC+0YLQutGA0YvRgtGL0LUg0LzQvtC00LDQu9C60LgsINC30LDQutGA0YvQstCw0LXQvFxyXG5cdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdGxldCBtQlMgPSBib290c3RyYXAuTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50KTtcclxuXHRcdFx0XHRtQlMuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmctbW9kYWwnKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XHJcblx0XHRcdFx0Y29uc3QgbVZHID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdFx0XHRcdG1WRy5oaWRlKFttVkddKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IGlkID0gX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmdlbmVyYWwgKyAnLScgKyBtYWtlUmFuZG9tU3RyaW5nKCksXHJcblx0XHRcdCRtb2RhbCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHJcblx0XHRpZiAoJG1vZGFsKSAkbW9kYWwucmVtb3ZlKCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFZHTW9kYWwuaW5pdChpZCwge1xyXG5cdFx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRcdGFsZXJ0OiBfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYWxlcnRNb2RhbFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgZnVuY3Rpb24gKHNlbGYpIHtcclxuXHRcdFx0XHRsZXQgZWxlbWVudCA9IHNlbGYuX2VsZW1lbnQ7XHJcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHJcblx0XHRcdFx0bGV0ICRib2R5ID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1tb2RhbC1ib2R5JywgZWxlbWVudCk7XHJcblx0XHRcdFx0aWYgKCRib2R5KSAkYm9keS5hcHBlbmQoX3RoaXMuc2V0RGF0YVJlbGF0aW9uU3RhdHVzKGVsZW1lbnQsIHN0YXR1cywgZGF0YSwgJ21vZGFsJykpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnRvZ2dsZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sIF90aGlzLl9wYXJhbXMudGltZW91dCk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRDb2xsYXBzZShkYXRhLCBzdGF0dXMpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRsZXQgJGNvbGxhcHNlID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpO1xyXG5cdFx0aWYgKCEkY29sbGFwc2UpIHtcclxuXHRcdFx0JGNvbGxhcHNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdCRjb2xsYXBzZS5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydENvbGxhcHNlKTtcclxuXHRcdFx0JGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ3ZnLWNvbGxhcHNlJyk7XHJcblx0XHRcdCRjb2xsYXBzZS5pZCA9IF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsICsgJy0nICsgbWFrZVJhbmRvbVN0cmluZygpO1xyXG5cdFx0XHQkY29sbGFwc2UuYXBwZW5kKF90aGlzLnNldERhdGFSZWxhdGlvblN0YXR1cygkY29sbGFwc2UsIHN0YXR1cywgZGF0YSwgJ2NvbGxhcHNlJykpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQucHJlcGVuZCgkY29sbGFwc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFZHQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZSgkY29sbGFwc2UsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fVxyXG5cclxuXHRzZXREYXRhUmVsYXRpb25TdGF0dXMoJGVsZW1lbnQsIHN0YXR1cywgZGF0YSwgdHlwZSkge1xyXG5cdFx0bGV0ICRhbGVydCA9IFNlbGVjdG9ycy5maW5kKCcudmctYWxlcnQtJyArIHN0YXR1cywgJGVsZW1lbnQpO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSkge1xyXG5cdFx0XHRpZiAoc3RhdHVzID09PSAnZXJyb3InKSB7XHJcblx0XHRcdFx0aWYgKCdjb2RlJyBpbiBkYXRhICYmIGRhdGEuY29kZSAhPT0gMjAwKSB7XHJcblx0XHRcdFx0XHRpZiAoJ3RleHQnIGluIGRhdGEgJiYgIWRhdGEudGV4dCkge1xyXG5cdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSByZXBlYXQgbGF0ZXInO1xyXG5cclxuXHRcdFx0XHRcdFx0c3dpdGNoIChkYXRhLmNvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQwMDpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdCYWQgUmVxdWVzdCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDAxOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1VuYXV0aG9yaXplZCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDAzOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1VuYXV0aG9yaXplZCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDEzOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ0ZvcmJpZGRlbidcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDA0OlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ05vdCBGb3VuZCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDIyOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1VucHJvY2Vzc2FibGUgRW50aXR5J1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSA1MDA6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnSW50ZXJuYWwgU2VydmVyIEVycm9yJ1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSA1MDQ6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnR2F0ZXdheSBUaW1lb3V0J1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICgncmVzcG9uc2UnIGluIGRhdGEpIHtcclxuXHRcdFx0XHRsZXQgcmVzcG9uc2UgPSBub3JtYWxpemVEYXRhKGRhdGEucmVzcG9uc2UpLCB0aXRsZSA9ICcnLCB0eHQgPSAnJywgY29kZSA9ICcnO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgcmVzcG9uc2UgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAoISgndmlldycgaW4gcmVzcG9uc2UpKSB7XHJcblx0XHRcdFx0XHRcdGlmICgndGl0bGUnIGluIHJlc3BvbnNlKSB0aXRsZSA9IHJlc3BvbnNlLnRpdGxlO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3RhdHVzID09PSAnZXJyb3InICYmIGRhdGEuY29kZSAhPT0gMjAwICYmIHRoaXMuX3BhcmFtcy5hbGVydC5lcnJvcnMpIHtcclxuXHRcdFx0XHRcdFx0XHRjb2RlID0gJyAnICsgZGF0YS50ZXh0ICsgJyAoJyArIGRhdGEuY29kZSArICcpJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRpdGxlKSB0eHQgKz0gJzxoNCBjbGFzcz1cInZnLWFsZXJ0LWNvbnRlbnQtLXRpdGxlXCI+JyArIHRpdGxlICsgY29kZSArICc8L2g0Pic7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoJ21lc3NhZ2UnIGluIHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRcdFx0dHh0ICs9ICc8ZGl2IGNsYXNzPVwidmctYWxlcnQtY29udGVudC0tbWVzc2FnZVwiPicgKyByZXNwb25zZS5tZXNzYWdlICsgJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCdlcnJvcnMnIGluIHJlc3BvbnNlICYmIHRoaXMuX3BhcmFtcy5hbGVydC5lcnJvcnMpIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZXJyb3JzID0gbm9ybWFsaXplRGF0YShyZXNwb25zZS5lcnJvcnMpIHx8IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGlzT2JqZWN0KGVycm9ycykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAoY29uc3QgZXJyb3IgaW4gZXJyb3JzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGVycm9yc1tlcnJvcl0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzW2Vycm9yXS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eHQgKz0gJzxkaXY+JysgdCArJzwvZGl2Pic7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eHQgPSAnPGRpdj4nKyBlcnJvcnNbZXJyb3JdICsnPC9kaXY+JztcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0XHR2aWV3OiB0eHRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRkYXRhLnZpZXcgPSByZXNwb25zZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRhbGVydCkge1xyXG5cdFx0XHQkYWxlcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0JGFsZXJ0LmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0JywgJ3ZnLWFsZXJ0LScgKyBzdGF0dXMsICd2Zy1hbGVydC0nICsgdHlwZSk7XHJcblxyXG5cdFx0XHRsZXQgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRjb250ZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0LWNvbnRlbnQnKTtcclxuXHJcblx0XHRcdGxldCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGljb24uY2xhc3NMaXN0LmFkZCgndmctYWxlcnQtY29udGVudC0taWNvbicpO1xyXG5cclxuXHRcdFx0bGV0IGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblx0XHRcdGkuaW5uZXJIVE1MID0gZ2V0U1ZHKHN0YXR1cyk7XHJcblxyXG5cdFx0XHRpY29uLmFwcGVuZChpKTtcclxuXHRcdFx0Y29udGVudC5hcHBlbmQoaWNvbik7XHJcblxyXG5cdFx0XHRsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHR0ZXh0LmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0LWNvbnRlbnQtLXRleHQnKTtcclxuXHRcdFx0dGV4dC5pbm5lckhUTUwgPSBkYXRhLnZpZXc7XHJcblxyXG5cdFx0XHRjb250ZW50LmFwcGVuZCh0ZXh0KTtcclxuXHRcdFx0JGFsZXJ0LmFwcGVuZChjb250ZW50KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1hbGVydC1jb250ZW50LS10ZXh0JywgJGFsZXJ0KTtcclxuXHRcdFx0dGV4dC5pbm5lckhUTUwgPSBkYXRhLnZpZXc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICRhbGVydDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdGb3JtU2VuZGVyLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCk7XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX1NVQk1JVF9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0aWYgKCFNYW5pcHVsYXRvci5oYXMoZXZlbnQudGFyZ2V0LCAnZGF0YS12Z2Zvcm1zZW5kZXInKSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR0Zvcm1TZW5kZXIuZ2V0T3JDcmVhdGVJbnN0YW5jZShldmVudC50YXJnZXQsIHt9KTtcclxuXHRpZiAoIWluc3RhbmNlKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoaW5zdGFuY2UuX3BhcmFtcy52YWxpZGF0ZSkge1xyXG5cdFx0aWYgKCFpbnN0YW5jZS5fZWxlbWVudC5jaGVja1ZhbGlkaXR5KCkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRpbnN0YW5jZS5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLl9wYXJhbXMuY2xhc3Nlcy53YXNWYWxpZGF0ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBjb2xsZWN0RGF0YSA9IGZ1bmN0aW9uKGRhdGEsIGZpZWxkcykge1xyXG5cdFx0Zm9yIChsZXQgbmFtZSBpbiBmaWVsZHMpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBmaWVsZHNbbmFtZV0gPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIGZpZWxkc1tuYW1lXSkge1xyXG5cdFx0XHRcdFx0bGV0IGFyciA9IE9iamVjdC5rZXlzKGZpZWxkc1tuYW1lXVtrZXldKS5tYXAoZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZpZWxkc1tuYW1lXVtrZXldW2ldO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRkYXRhLmFwcGVuZChuYW1lLCBhcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkYXRhLmFwcGVuZChuYW1lLCBmaWVsZHNbbmFtZV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fVxyXG5cclxuXHRpZiAoIWluc3RhbmNlLl9wYXJhbXMuc3VibWl0KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKGluc3RhbmNlLl9lbGVtZW50KTtcclxuXHJcblx0XHQvLyBUT0RPINC00L7QtNC10LvQsNGC0YxcclxuXHRcdC8qaWYgKEFycmF5LmlzQXJyYXkoaW5zdGFuY2UuX3BhcmFtcy5hamF4LmZpZWxkcykgJiYgaW5zdGFuY2UuX3BhcmFtcy5hamF4LmZpZWxkcy5sZW5ndGgpIHtcclxuXHRcdFx0ZGF0YSA9IGNvbGxlY3REYXRhKGRhdGEsIGluc3RhbmNlLl9wYXJhbXMuYWpheC5maWVsZHMpO1xyXG5cdFx0fSovXHJcblxyXG5cdFx0cmV0dXJuIGluc3RhbmNlLnJlcXVlc3QoZGF0YSwgZXZlbnQpO1xyXG5cdH1cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRm9ybVNlbmRlcjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IENvb2tpZXMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9jb29raWVcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSAgICAgPSAnbGF3Y29va2llJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubGF3Y29va2llJztcclxuXHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSAgICAgICA9ICdbZGF0YS12Zy10b2dnbGU9XCJsYXdjb29raWVcIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRV9DTEVBUiA9ICdbZGF0YS12Zy10b2dnbGU9XCJsYXdjb29raWUtY2xlYXJcIl0nO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgICA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0xhd0Nvb2tpZSBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdHN0YXRpYyBzUGFyYW1zID0ge307XHJcblxyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRzdG9yYWdlOiAnbG9jYWwnLCAvLyBjb29raWUgb3IgbG9jYWxcclxuXHRcdFx0ZGVsYXk6IDUwMCxcclxuXHRcdFx0Y29va2llOiB7XHJcblx0XHRcdFx0bmFtZTogJ2xhd0Nvb2tpZScsXHJcblx0XHRcdFx0dmFsdWU6ICd5ZXMnLFxyXG5cdFx0XHRcdGF0dHJpYnV0ZXM6IHt9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdGVuYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpbjogJ2FuaW1hdGVfX2ZhZGVJblVwJyxcclxuXHRcdFx0XHRvdXQ6ICdhbmltYXRlX19mYWRlT3V0RG93bicsXHJcblx0XHRcdFx0ZGVsYXk6IDgwMCxcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0VkdMYXdDb29raWUuc1BhcmFtcyA9IHRoaXMuX3BhcmFtcztcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5ID0gIXRoaXMuX3BhcmFtcy5hbmltYXRpb24uZW5hYmxlID8gMCA6IHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXk7XHJcblx0XHR0aGlzLl9hbmltYXRpb24odGhpcy5fZWxlbWVudCwgVkdMYXdDb29raWUuTkFNRV9LRVksIHRoaXMuX3BhcmFtcy5hbmltYXRpb24pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3coKSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zdG9yYWdlKCkuZ2V0KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywge30pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHt9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSwgdGhpcy5fcGFyYW1zLmRlbGF5KVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlKTtcclxuXHRcdH0sIHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXkpO1xyXG5cdH1cclxuXHJcblx0c3RvcmFnZSgpIHtcclxuXHRcdHRoaXMuX3N0b3JhZ2UgPSB7XHJcblx0XHRcdGlzQ29va2llOiB0aGlzLl9wYXJhbXMuc3RvcmFnZSA9PT0gJ2Nvb2tpZScsXHJcblx0XHRcdHN0b3JhZ2U6IHRoaXMuX3BhcmFtcy5zdG9yYWdlID09PSAnY29va2llJyA/IENvb2tpZXMgOiBsb2NhbFN0b3JhZ2UsXHJcblx0XHRcdG5hbWU6IHRoaXMuX3BhcmFtcy5jb29raWUubmFtZSxcclxuXHRcdFx0dmFsdWU6IHRoaXMuX3BhcmFtcy5jb29raWUudmFsdWUsXHJcblx0XHRcdGF0dHJpYnV0ZXM6IHRoaXMuX3BhcmFtcy5jb29raWUuYXR0cmlidXRlcyxcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdldCgpIHtcclxuXHRcdGlmICh0aGlzLl9zdG9yYWdlLmlzQ29va2llKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yYWdlLnN0b3JhZ2UuZ2V0KHRoaXMuX3N0b3JhZ2UubmFtZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RvcmFnZS5zdG9yYWdlLmdldEl0ZW0odGhpcy5fc3RvcmFnZS5uYW1lKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldCgpIHtcclxuXHRcdGlmICh0aGlzLl9zdG9yYWdlLmlzQ29va2llKSB7XHJcblx0XHRcdHRoaXMuX3N0b3JhZ2Uuc3RvcmFnZS5zZXQodGhpcy5fc3RvcmFnZS5uYW1lLCB0aGlzLl9zdG9yYWdlLnZhbHVlLCB0aGlzLl9zdG9yYWdlLmF0dHJpYnV0ZXMpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fc3RvcmFnZS5zdG9yYWdlLnNldEl0ZW0odGhpcy5fc3RvcmFnZS5uYW1lLCB0aGlzLl9zdG9yYWdlLnZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcmVzZXQoKSB7XHJcblx0XHRDb29raWVzLnJlbW92ZShWR0xhd0Nvb2tpZS5zUGFyYW1zLmNvb2tpZS5uYW1lKTtcclxuXHRcdGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHTGF3Q29va2llLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLnRvZ2dsZSgpO1xyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdMYXdDb29raWUpO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkgcmV0dXJuO1xyXG5cclxuXHRjb25zdCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoJyN2Zy1sYXdjb29raWUnKTtcclxuXHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR0xhd0Nvb2tpZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdGluc3RhbmNlLnN0b3JhZ2UoKS5zZXQoKTtcclxuXHRpbnN0YW5jZS5oaWRlKCk7XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFX0NMRUFSLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkgcmV0dXJuO1xyXG5cclxuXHRjb25zdCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoJyN2Zy1sYXdjb29raWUnKTtcclxuXHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR0xhd0Nvb2tpZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdGluc3RhbmNlLmRpc3Bvc2UoKTtcclxuXHJcblx0bG9jYXRpb24ucmVsb2FkKCk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdMYXdDb29raWU7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTY3JvbGxCYXJIZWxwZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvc2Nyb2xsYmFyXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNSVEwsIG1lcmdlRGVlcE9iamVjdCwgcmVmbG93fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbW9kYWwnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5tb2RhbCc7XHJcblxyXG5jb25zdCBFU0NBUEVfS0VZID0gJ0VzY2FwZSc7XHJcblxyXG5jb25zdCBPUEVOX1NFTEVDVE9SID0gJy52Zy1tb2RhbC5zaG93JztcclxuY29uc3QgU0VMRUNUT1JfRElBTE9HID0gJy52Zy1tb2RhbC1kaWFsb2cnO1xyXG5jb25zdCBTRUxFQ1RPUl9NT0RBTF9CT0RZID0gJy52Zy1tb2RhbC1ib2R5JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwibW9kYWxcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9PUEVOID0gJ3ZnLW1vZGFsLW9wZW4nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TVEFUSUMgPSAndmctbW9kYWwtc3RhdGljJztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9SRVNJWkUgPSBgJHtOQU1FX0tFWX0ucmVzaXplYDtcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCA9IGAke05BTUVfS0VZfS5sb2FkZWRgO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyAgICAgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEICAgICAgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSAgICAgID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZX01PVVNFRE9XTl9ESVNNSVNTICAgPSBgbW91c2Vkb3duLmRpc21pc3Mke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19ESVNNSVNTICAgICAgID0gYGNsaWNrLmRpc21pc3Mke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ET01fTE9BREVEX0RBVEFfQVBJID0gYERPTUNvbnRlbnRMb2FkZWQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfUE9QU1RBVEVfREFUQV9BUEkgICA9IGBwb3BzdGF0ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR01vZGFsIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRmb2N1czogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGZpZWxkczogW10sXHJcblx0XHRcdGhhc2g6IGZhbHNlLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0XHRsb2FkZXI6IGZhbHNlXHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdGVuYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0aW46ICdhbmltYXRlX19yb2xsSW4nLFxyXG5cdFx0XHRcdG91dDogJ2FuaW1hdGVfX3JvbGxPdXQnLFxyXG5cdFx0XHRcdGRlbGF5OiA4MDAsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctbW9kYWwnLFxyXG5cdFx0XHRcdGRpYWxvZzogJ3ZnLW1vZGFsLWRpYWxvZycsXHJcblx0XHRcdFx0Y29udGVudDogJ3ZnLW1vZGFsLWNvbnRlbnQnLFxyXG5cdFx0XHRcdGhlYWRlcjogJ3ZnLW1vZGFsLWhlYWRlcicsXHJcblx0XHRcdFx0dGl0bGU6ICd2Zy1tb2RhbC10aXRsZScsXHJcblx0XHRcdFx0Ym9keTogJ3ZnLW1vZGFsLWJvZHknLFxyXG5cdFx0XHRcdGZvb3RlcjogJ3ZnLW1vZGFsLWZvb3RlcicsXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2J1dHRvbiA9IG51bGw7XHJcblx0XHR0aGlzLl9kaWFsb2cgPSBTZWxlY3RvcnMuZmluZChTRUxFQ1RPUl9ESUFMT0csIHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0dGhpcy5faXNTaG93biA9IGZhbHNlO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLl9zY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFySGVscGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSA9ICF0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmVuYWJsZSA/IDAgOiB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5O1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIFZHTW9kYWwuTkFNRV9LRVksIHRoaXMuX3BhcmFtcy5hbmltYXRpb24pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0VkdNb2RhbC5idWlsZChlbGVtZW50LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZChpZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0aWYgKHR5cGVvZiBpZCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0X2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwnLCAnZmFkZScpO1xyXG5cdFx0X2VsZW1lbnQuaWQgPSBpZDtsZXQgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRkaWFsb2cuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtZGlhbG9nJyk7XHJcblxyXG5cdFx0bGV0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtY29udGVudCcpO1xyXG5cclxuXHRcdGxldCBidG5DbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAndHlwZScsICdidXR0b24nKTtcclxuXHRcdE1hbmlwdWxhdG9yLnNldChidG5DbG9zZSwgJ2RhdGEtdmctZGlzbWlzcycsICdtb2RhbCcpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAnZGF0YS12Zy10YXJnZXQnLCAnIycgKyBpZCk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQoYnRuQ2xvc2UsICdhcmlhLWxhYmVsJywgJ2Nsb3NlJyk7XHJcblx0XHRidG5DbG9zZS5jbGFzc0xpc3QuYWRkKCd2Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRjb250ZW50LmFwcGVuZChidG5DbG9zZSk7XHJcblxyXG5cdFx0bGV0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtYm9keScpO1xyXG5cclxuXHRcdGNvbnRlbnQuYXBwZW5kKGJvZHkpO1xyXG5cdFx0ZGlhbG9nLmFwcGVuZChjb250ZW50KTtcclxuXHRcdF9lbGVtZW50LmFwcGVuZChkaWFsb2cpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKF9lbGVtZW50KTtcclxuXHJcblx0XHRjb25zdCBtb2RhbCA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShfZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrLCBbbW9kYWxdKTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24gPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKHJlbGF0ZWRUYXJnZXQsIHRoaXMuX3BhcmFtcyk7XHJcblx0XHRfdGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0xPQURFRCwge3N0YXRzOiBzdGF0dXMsIGRhdGE6IGRhdGF9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2lzU2hvd24gPSB0cnVlO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmhhc2gpIHtcclxuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwidmctc2lkZWJhci1vcGVuXCIsIFwiI1wiICsgdGhpcy5fZWxlbWVudC5pZCk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9LRVlfUE9QU1RBVEVfREFUQV9BUEksICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fc2Nyb2xsQmFyLmhpZGUoKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHJcblx0XHR0aGlzLl9hZGRGaWVsZHNJbk1vZGFsKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0dGhpcy5fYWRqdXN0RGlhbG9nKCk7XHJcblxyXG5cdFx0QmFja2Ryb3Auc2hvdygoKSA9PiB0aGlzLl9zaG93RWxlbWVudChyZWxhdGVkVGFyZ2V0KSk7XHJcblx0fVxyXG5cclxuXHRoaWRlKG9wZW5lZE1vZGFscyA9IFtdKSB7XHJcblx0XHRpZiAoIXRoaXMuX2lzU2hvd24gfHwgdGhpcy5faXNUcmFuc2l0aW9uaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5faXNTaG93biA9IGZhbHNlO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soKCkgPT4gdGhpcy5faGlkZU1vZGFsKG9wZW5lZE1vZGFscyksIHRoaXMuX2VsZW1lbnQsIHRoaXMuX2lzQW5pbWF0ZWRGYWRlKCkpO1xyXG5cdFx0fSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSk7XHJcblx0fVxyXG5cclxuXHRfaGlkZU1vZGFsKG9wZW5lZE1vZGFscykge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKTtcclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xyXG5cclxuXHRcdGlmIChvcGVuZWRNb2RhbHMubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5oYXNoKSB7XHJcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuXHRcdH1cclxuXHJcblx0XHRCYWNrZHJvcC5oaWRlKCgpID0+IHtcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfT1BFTik7XHJcblx0XHRcdHRoaXMuX3Jlc2V0QWRqdXN0bWVudHMoKTtcclxuXHRcdFx0dGhpcy5fc2Nyb2xsQmFyLnJlc2V0KCk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRfc2hvd0VsZW1lbnQocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0aWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuX2VsZW1lbnQpKSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHR0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgdHJ1ZSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2Nyb2xsVG9wID0gMDtcclxuXHJcblx0XHRjb25zdCBtb2RhbEJvZHkgPSBTZWxlY3RvcnMuZmluZChTRUxFQ1RPUl9NT0RBTF9CT0RZLCB0aGlzLl9kaWFsb2cpO1xyXG5cdFx0aWYgKG1vZGFsQm9keSkge1xyXG5cdFx0XHRtb2RhbEJvZHkuc2Nyb2xsVG9wID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRyZWZsb3codGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVylcclxuXHJcblx0XHRjb25zdCB0cmFuc2l0aW9uQ29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2sodHJhbnNpdGlvbkNvbXBsZXRlLCB0aGlzLl9kaWFsb2csIHRoaXMuX2lzQW5pbWF0ZWRGYWRlKCkpXHJcblx0fVxyXG5cclxuXHRfaXNBbmltYXRlZEZhZGUoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdH1cclxuXHJcblx0X2FkanVzdERpYWxvZygpIHtcclxuXHRcdGNvbnN0IGlzTW9kYWxPdmVyZmxvd2luZyA9IHRoaXMuX2VsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG5cdFx0Y29uc3Qgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLl9zY3JvbGxCYXIuZ2V0V2lkdGgoKVxyXG5cdFx0Y29uc3QgaXNCb2R5T3ZlcmZsb3dpbmcgPSBzY3JvbGxiYXJXaWR0aCA+IDBcclxuXHJcblx0XHRpZiAoaXNCb2R5T3ZlcmZsb3dpbmcgJiYgIWlzTW9kYWxPdmVyZmxvd2luZykge1xyXG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IGlzUlRMKCkgPyAncGFkZGluZ0xlZnQnIDogJ3BhZGRpbmdSaWdodCdcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSBgJHtzY3JvbGxiYXJXaWR0aH1weGBcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWlzQm9keU92ZXJmbG93aW5nICYmIGlzTW9kYWxPdmVyZmxvd2luZykge1xyXG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IGlzUlRMKCkgPyAncGFkZGluZ1JpZ2h0JyA6ICdwYWRkaW5nTGVmdCdcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSBgJHtzY3JvbGxiYXJXaWR0aH1weGBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yZXNldEFkanVzdG1lbnRzKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9ICcnXHJcblx0XHR0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnXHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSBFU0NBUEVfS0VZKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl90cmlnZ2VyQmFja2Ryb3BUcmFuc2l0aW9uKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9LRVlfUkVTSVpFLCAoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLl9pc1Nob3duICYmICF0aGlzLl9pc1RyYW5zaXRpb25pbmcpIHRoaXMuX2FkanVzdERpYWxvZygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9NT1VTRURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub25lKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9DTElDS19ESVNNSVNTLCBldmVudDIgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLl9lbGVtZW50ICE9PSBldmVudC50YXJnZXQgfHwgdGhpcy5fZWxlbWVudCAhPT0gZXZlbnQyLnRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5fcGFyYW1zLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xyXG5cdFx0XHRcdFx0dGhpcy5fdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbigpIHtcclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBpc01vZGFsT3ZlcmZsb3dpbmcgPSB0aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcblx0XHRjb25zdCBpbml0aWFsT3ZlcmZsb3dZID0gdGhpcy5fZWxlbWVudC5zdHlsZS5vdmVyZmxvd1k7XHJcblxyXG5cdFx0aWYgKGluaXRpYWxPdmVyZmxvd1kgPT09ICdoaWRkZW4nIHx8IHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU1RBVElDKSkgcmV0dXJuO1xyXG5cdFx0aWYgKCFpc01vZGFsT3ZlcmZsb3dpbmcpIHRoaXMuX2VsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU1RBVElDKTtcclxuXHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKCgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU1RBVElDKTtcclxuXHRcdFx0dGhpcy5fcXVldWVDYWxsYmFjaygoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBpbml0aWFsT3ZlcmZsb3dZO1xyXG5cdFx0XHR9LCB0aGlzLl9kaWFsb2cpO1xyXG5cdFx0fSwgdGhpcy5fZGlhbG9nKTtcclxuXHR9XHJcblxyXG5cdF9hZGRGaWVsZHNJbk1vZGFsKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhyZWxhdGVkVGFyZ2V0LCB0aGlzLl9wYXJhbXMpO1xyXG5cclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLmZpZWxkcy5sZW5ndGgpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuZmllbGRzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKCEnbmFtZScgaW4gaXRlbSAmJiAhJ3ZhbHVlJyBpbiBpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgZWxlbWVudHMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtJyArIGl0ZW0ubmFtZSArICddJywgdGhpcy5fZWxlbWVudCk7XHJcblx0XHRcdGlmICghZWxlbWVudHMubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdFx0XHRmb3IgKGNvbnN0IGVsbSBvZiBlbGVtZW50cykge1xyXG5cdFx0XHRcdHN3aXRjaCAoZWxtLnRhZ05hbWUpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ0lOUFVUJzogZWxtLnZhbHVlID0gaXRlbS52YWx1ZTsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdJTUcnOiBNYW5pcHVsYXRvci5zZXQoZWxtLCAnc3JjJywgaXRlbS52YWx1ZSk7IGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDogZWxtLmlubmVySFRNTCA9IGl0ZW0udmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHTW9kYWwpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9TSE9XLCBzaG93RXZlbnQgPT4ge1xyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblx0fSk7XHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmQoT1BFTl9TRUxFQ1RPUik7XHJcblx0aWYgKGFscmVhZHlPcGVuKSBWR01vZGFsLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKFthbHJlYWR5T3Blbl0pO1xyXG5cclxuXHRjb25zdCBkYXRhID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldCk7XHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfRE9NX0xPQURFRF9EQVRBX0FQSSwgZnVuY3Rpb24gKCkge1xyXG5cdGxldCB0YXJnZXRIYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XHJcblx0aWYgKHRhcmdldEhhc2gpIHtcclxuXHRcdGxldCB0YXJnZXQgPSBTZWxlY3RvcnMuZmluZCgnIycgKyB0YXJnZXRIYXNoKTtcclxuXHRcdGlmICh0YXJnZXQgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndmctbW9kYWwnKSkge1xyXG5cdFx0XHRpZiAoaXNEaXNhYmxlZCh0YXJnZXQpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBkYXRhID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRcdFx0ZGF0YS50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR01vZGFsOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBSZXNwb25zaXZlIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3Jlc3BvbnNpdmVcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdCwgbm9vcCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICduYXYnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5uYXYnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICAgPSAnZmFkZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJy52Zy1uYXYgYSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSAgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTSVpFX0RBVEFfQVBJID0gYHJlc2l6ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR05hdiBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50KTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YnJlYWtwb2ludDogZmFsc2UsXHJcblx0XHRcdHBsYWNlbWVudDogJ2hvcml6b250YWwnLFxyXG5cdFx0XHRjbGFzc2VzOiB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyQWN0aXZlOiAndmctbmF2LWhhbWJ1cmdlci1hY3RpdmUnLFxyXG5cdFx0XHRcdGhhbWJ1cmdlckFsd2F5czogJ3ZnLW5hdi1oYW1idXJnZXItYWx3YXlzJyxcclxuXHRcdFx0XHRoYW1idXJnZXI6ICd2Zy1uYXYtaGFtYnVyZ2VyJyxcclxuXHRcdFx0XHRjb250YWluZXI6ICd2Zy1uYXYtY29udGFpbmVyJyxcclxuXHRcdFx0XHR3cmFwcGVyOiAndmctbmF2LXdyYXBwZXInLFxyXG5cdFx0XHRcdGFjdGl2ZTogJ3ZnLW5hdi1hY3RpdmUnLFxyXG5cdFx0XHRcdGV4cGFuZDogJ3ZnLW5hdi1leHBhbmQnLFxyXG5cdFx0XHRcdGNsb25lZDogJ3ZnLW5hdi1jbG9uZWQnLFxyXG5cdFx0XHRcdGhvdmVyOiAndmctbmF2LWhvdmVyJyxcclxuXHRcdFx0XHRmbGlwOiAndmctbmF2LWZsaXAnLFxyXG5cdFx0XHRcdFhYWEw6ICd2Zy1uYXYteHh4bCcsXHJcblx0XHRcdFx0WFhMOiAndmctbmF2LXh4bCcsXHJcblx0XHRcdFx0WEw6ICd2Zy1uYXYteGwnLFxyXG5cdFx0XHRcdExHOiAndmctbmF2LWxnJyxcclxuXHRcdFx0XHRNRDogJ3ZnLW5hdi1tZCcsXHJcblx0XHRcdFx0U006ICd2Zy1uYXYtc20nLFxyXG5cdFx0XHRcdFhTOiAndmctbmF2LXhzJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRleHBhbmQ6IHRydWUsXHJcblx0XHRcdGhvdmVyOiBmYWxzZSxcclxuXHRcdFx0cG9zaXRpb246IHRydWUsXHJcblx0XHRcdGNvbGxhcHNlOiB0cnVlLFxyXG5cdFx0XHR0b2dnbGU6ICc8c3BhbiBjbGFzcz1cImRlZmF1bHRcIj48L3NwYW4+JyxcclxuXHRcdFx0aGFtYnVyZ2VyOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGFsd2F5czogZmFsc2UsXHJcblx0XHRcdFx0dGl0bGU6ICcnLFxyXG5cdFx0XHRcdGJvZHk6IG51bGxcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2FsbGJhY2s6IG5vb3AsXHJcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHRcdFx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gbnVsbDtcclxuXHRcdHRoaXMubmF2aWdhdGlvbiA9ICcuJyArIHRoaXMuX3BhcmFtcy5jbGFzc2VzLndyYXBwZXI7XHJcblxyXG5cdFx0dGhpcy5tb3ZlZExpbmtzID0gW107XHJcblx0XHR0aGlzLiRsaW5rcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuJyArIHRoaXMuX3BhcmFtcy5jbGFzc2VzLndyYXBwZXIgKyAnID4gbGknLCB0aGlzLm5hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5hbmltYXRpb24gPT09IGZhbHNlKSB7XHJcblx0XHRcdHRoaXMuX3BhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGdldCBuYXZpZ2F0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25hdmlnYXRpb247XHJcblx0fVxyXG5cclxuXHRzZXQgbmF2aWdhdGlvbihlbCkge1xyXG5cdFx0bGV0IGVsbSA9IFNlbGVjdG9ycy5maW5kKGVsLCB0aGlzLl9lbGVtZW50KTtcclxuXHRcdGlmICghZWxtKSByZXR1cm47XHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gZWxtO1xyXG5cdH1cclxuXHJcblx0YnVpbGQoKSB7XHJcblx0XHRpZiAoIXRoaXMubmF2aWdhdGlvbikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBwYXJhbXMgPSB0aGlzLl9wYXJhbXM7XHJcblxyXG5cdFx0Ly8g0JLQtdGI0LDQtdC8INC+0YHQvdC+0LLQvdGL0LUg0LrQu9Cw0YHRgdGLXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuY29udGFpbmVyKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbmF2LScgKyBwYXJhbXMucGxhY2VtZW50KTtcclxuXHJcblx0XHQvLyDQldGB0LvQuCDQvdGD0LbQvdC+INC+0YHRgtCw0LLQuNGC0Ywg0YHQv9C40YHQvtC6INC80LXQvdGOINC40LvQuCDRg9GB0YLQsNC90L7QstC40YLRjCDQvNC10LTQuNCwINGC0L7Rh9C60YNcclxuXHRcdGlmICghcGFyYW1zLmJyZWFrcG9pbnQpIHtcclxuXHRcdFx0cGFyYW1zLmV4cGFuZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghcGFyYW1zLmhhbWJ1cmdlci5hbHdheXMpIHtcclxuXHRcdFx0aWYgKCFwYXJhbXMuYnJlYWtwb2ludCB8fCAhcGFyYW1zLmV4cGFuZCkge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5leHBhbmQpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHBhcmFtcy5icmVha3BvaW50ICE9PSBmYWxzZSkge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbmF2LScgKyBwYXJhbXMuYnJlYWtwb2ludCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBbHdheXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCc0LXQvdGOINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCwg0LXRgdC70Lgg0Y3RgtC+INC90LUg0LzQvtCx0LjQu9GM0L3QvtC1INGD0YHRgtGA0L7QudGB0YLQstC+XHJcblx0XHRpZiAocGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5ob3Zlcik7XHJcblxyXG5cdFx0XHRpZiAoUmVzcG9uc2l2ZS5jaGVja01vYmlsZU9yVGFibGV0KCkpIHtcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmNsYXNzZXMuaG92ZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LPQsNC80LHRg9GA0LPQtdGALCDQtdGB0LvQuCDQtdCz0L4g0L3QtdGCINCyINGA0LDQt9C80LXRgtC60LVcclxuXHRcdGlmIChwYXJhbXMuZXhwYW5kICYmICFwYXJhbXMuaGFtYnVyZ2VyLmJvZHkpIHtcclxuXHRcdFx0bGV0IGlzSGFtYnVyZ2VyID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyLCB0aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChpc0hhbWJ1cmdlciA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBtVGl0bGUgPSAnJyxcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS1saW5lc1wiPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci50aXRsZSkge1xyXG5cdFx0XHRcdFx0bVRpdGxlID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLXRpdGxlXCI+JysgcGFyYW1zLmhhbWJ1cmdlci50aXRsZSArJzwvc3Bhbj4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIuYm9keSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gcGFyYW1zLmhhbWJ1cmdlci5ib2R5O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCc8YSBocmVmPVwiI3NpZGViYXItbmF2XCIgY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJ1wiIGRhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiPicgKyBtVGl0bGUgKyBoYW1idXJnZXIgKyc8L2E+Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRg9C60LDQt9Cw0YLQtdC70Ywg0L/QtdGA0LXQutC70Y7Rh9Cw0YLQtdC70Y9cclxuXHRcdGlmIChwYXJhbXMudG9nZ2xlKSB7XHJcblx0XHRcdGxldCAkZHJvcGRvd25fYSA9IFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duLW1lZ2EgPiBhLCAuZHJvcGRvd24gPiBhJywgdGhpcy5fZWxlbWVudCldLFxyXG5cdFx0XHRcdHRvZ2dsZSA9ICc8c3BhbiBjbGFzcz1cInRvZ2dsZVwiPicgKyBwYXJhbXMudG9nZ2xlICsgJzwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0aWYgKCRkcm9wZG93bl9hLmxlbmd0aCkge1xyXG5cdFx0XHRcdCRkcm9wZG93bl9hLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuXHRcdFx0XHRcdGlmICghZWxlbS5xdWVyeVNlbGVjdG9yKCcudG9nZ2xlJykgJiYgIWVsZW0uY2xvc2VzdCgnLmRvdHMnKSkge1xyXG5cdFx0XHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXHJcblx0XHRcdFx0XHRcdGVsZW0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0b2dnbGUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGFyYW1zLmNvbGxhcHNlICYmIFJlc3BvbnNpdmUuY2hlY2sodGhpcykgJiYgcGFyYW1zLnBsYWNlbWVudCAhPT0gJ3ZlcnRpY2FsJykge1xyXG5cdFx0XHRzZXRDb2xsYXBzZSh0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ2FmdGVySW5pdCcgaW4gdGhpcy5fcGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUodGhpcy5fcGFyYW1zLmNhbGxiYWNrLmFmdGVySW5pdCwgW3RoaXNdKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqINCk0YPQvdC60YbQuNGPINGB0LLQvtGA0LDRh9C40LLQsNC90LjRj1xyXG5cdFx0ICogVE9ETyDQn9GA0LjQtNGD0LzQsNGC0Ywg0YfRgtC+INGC0L4g0YEg0LzQtdCz0LAg0LzQtdC90Y4sINC60L7RgtC+0YDQvtC1INGD0YXQvtC00LjRgiDQsiDQv9C+0LTQvNC10L3RjlxyXG5cdFx0ICogVE9ETyDQotCw0Log0LbQtSDQtdGB0YLRjCDQutC+0YHRj9C60Lgg0L/RgNC4INGA0LXRgdCw0LnQt9C1XHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIHNldENvbGxhcHNlKF90aGlzKSB7XHJcblx0XHRcdGxldCB3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUgPSBfdGhpcy5uYXZpZ2F0aW9uLmNsaWVudFdpZHRoLFxyXG5cdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gMCxcclxuXHRcdFx0XHQkZG90cyA9IFNlbGVjdG9ycy5maW5kKCcuZG90cycsIF90aGlzLm5hdmlnYXRpb24pLFxyXG5cdFx0XHRcdF9kb3RzID0gZ2V0U1ZHKCdkb3RzJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuJGxpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAkZG90cy5jbGllbnRXaWR0aFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgJGEgPSBTZWxlY3RvcnMuZmluZCgnYScsIF90aGlzLiRsaW5rc1swXSksXHJcblx0XHRcdFx0XHRcdCRsaW5rU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKCRhKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ0xlZnQgPSBub3JtYWxpemVEYXRhKCRsaW5rU3R5bGUucGFkZGluZ0xlZnQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0ID0gIG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nUmlnaHQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZyA9IHBhZGRpbmdMZWZ0ICsgcGFkZGluZ1JpZ2h0O1xyXG5cclxuXHRcdFx0XHRcdC8vIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0LLQtdGA0L3Qviwg0L3QviDQvNGLINGC0L7Rh9C90L4g0LfQvdCw0LXQvCDRiNC40YDQuNC90YMg0YLQvtGH0LXQuiDQsiBzdmcgLSAxNnB4XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHBhZGRpbmcgKyAxNjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAobGV0ICRsaW5rIG9mIF90aGlzLiRsaW5rcykge1xyXG5cdFx0XHRcdFx0bGV0IHdpZHRoID0gJGxpbmsuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlICsgd2lkdGg7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCh3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUpIDwgd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5wdXNoKCRsaW5rKTtcclxuXHRcdFx0XHRcdFx0JGxpbmsucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uaW5zZXJ0QmVmb3JlKF90aGlzLm1vdmVkTGlua3NbMF0sICRkb3RzKVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmFwcGVuZENoaWxkKF90aGlzLm1vdmVkTGlua3NbMF0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdF90aGlzLm1vdmVkTGlua3Muc3BsaWNlKDAsIDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGlmICghJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsJzxsaSBjbGFzcz1cImRyb3Bkb3duIGRvdHNcIj4nICsgJzxhIGhyZWY9XCIjXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JysgX2RvdHMgKyc8L2E+PC9saT4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdCRkb3RzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0ICRkID0gX3RoaXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuZG90cycpO1xyXG5cdFx0XHRcdGlmICgkZCAmJiBfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0bGV0ICRkcm9wZG93biA9ICRkLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XHJcblx0XHRcdFx0XHRpZiAoJGRyb3Bkb3duKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duLWNvbnRlbnQnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblxyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsaW5rIG9mIF90aGlzLm1vdmVkTGlua3MpIHtcclxuXHRcdFx0XHRcdFx0XHQkZHJvcGRvd24ucHJlcGVuZChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0JGQuYXBwZW5kQ2hpbGQoJGRyb3Bkb3duKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0bGV0IHRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoIXRhcmdldCB8fCBpc0Rpc2FibGVkKHRhcmdldCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bi1jb250ZW50JykpIHtcclxuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpcnN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGRyb3AgPSBTZWxlY3RvcnMuZmluZCgnLmRyb3Bkb3duLWNvbnRlbnQnLCB0YXJnZXQpLFxyXG5cdFx0XHRsaW5rID0gdGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuXHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcblx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRzZXREcm9wUG9zaXRpb24oZHJvcClcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIGRyb3AsIHRydWUsIDUwKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gJGRyb3BcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0RHJvcFBvc2l0aW9uKCRkcm9wKSB7XHJcblx0XHRcdGxldCB7d2lkdGgsIHJpZ2h0fSA9ICRkcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRcdHdpbmRvd193aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuXHRcdFx0bGV0IE5fcmlnaHQgPSB3aW5kb3dfd2lkdGggLSByaWdodCAtIHdpZHRoO1xyXG5cclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQnKTtcclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgnbGVmdCcpO1xyXG5cclxuXHRcdFx0bGV0ICRwYXJlbnQgPSAkZHJvcC5jbG9zZXN0KCdsaScpLFxyXG5cdFx0XHRcdCR1bCA9ICRwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgndWwnKTtcclxuXHJcblx0XHRcdGlmIChOX3JpZ2h0ID4gd2lkdGgpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0ICRlbCBvZiAkdWwpIHtcclxuXHRcdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRoaWRlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsZW1lbnQgPSByZWxhdGVkVGFyZ2V0LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0aWYgKCdlbG0nIGluIHJlbGF0ZWRUYXJnZXQgJiYgcmVsYXRlZFRhcmdldC5lbG0pIHtcclxuXHRcdFx0ZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQuZWxtXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQpIHtcclxuXHRcdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIoZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpcnN0JykpIHtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpcnN0Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLicgKyBDTEFTU19OQU1FX1NIT1csIGVsZW1lbnQpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0XHRcdGxldCBwYXJlbnQgPSBlbC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAocGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0FDVElWRSkpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0XHRpZiAobGluaykgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKGVsLCBFVkVOVF9LRVlfSElEREVOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIGVsLCB0cnVlLCA1MDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUT0RPINC10YHQu9C4INC90LAg0YHRgtGA0LDQvdC40YbQtSDQvdC10YHQutC+0LvRjNC60L4g0L3QsNCy0LjQs9Cw0YbQuNC5LCDRgtC+INC10YHRgtGMINC60L7RgdGP0LrQuFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCk7XHJcblxyXG5cdFx0bGV0IGRyb3BzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bicsIGluc3RhbmNlLl9uYXZpZ2F0aW9uKVxyXG5cclxuXHRcdGlmIChpbnN0YW5jZS5fcGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdFsuLi5kcm9wc10uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRsZXQgY3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbCwgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0VkdOYXYuaGlkZU9wZW5Ecm9wcyhldmVudCk7XHJcblxyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFpbnN0YW5jZS5uYXZpZ2F0aW9uLmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gdGFyZ2V0O1xyXG5cclxuXHRcdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0OiB0YXJnZXRcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpbnN0YW5jZS5zaG93KHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbCwgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKCFjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24nKSxcclxuXHRcdFx0XHRcdFx0ZWxtID0gY3VycmVudEVsZW07XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlbGF0ZWRUYXJnZXQgPT09IGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQgPSByZWxhdGVkVGFyZ2V0LnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCwgZWxtOiBlbG19KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgVkdOYXYuY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFNYW5pcHVsYXRvci5oYXModGhpcywgJ2FyaWEtZXhwYW5kZWQnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCdjbGljaycgaW4gaW5zdGFuY2UuX3BhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0ZXhlY3V0ZShpbnN0YW5jZS5fcGFyYW1zLmNhbGxiYWNrLmNsaWNrLCBbdGhpc10pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzLmNsb3Nlc3QoJy52Zy1uYXYnKSxcclxuXHRcdFx0XHRcdGlzRmlyc3QgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5maXJzdCcpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNEaXNhYmxlZCh0YXJnZXQpICYmICFpc1Zpc2libGUodGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGlzRmlyc3QgJiYgdGhpcy5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmFjdGl2ZScsIHNlbGYpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZWwgJiYgZWwgIT09IHRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGVsfSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KHtyZWxhdGVkVGFyZ2V0OiB0YXJnZXR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdmdOYXZTaWRlYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXItbmF2Jyk7XHJcblx0XHRsZXQgaGFtYnVyZ2VyID0gaW5zdGFuY2UuX2VsZW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyKTtcclxuXHJcblx0XHRpZiAodmdOYXZTaWRlYmFyICYmIGhhbWJ1cmdlcikge1xyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5zaG93JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLl9wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZnTmF2U2lkZWJhci5hZGRFdmVudExpc3RlbmVyKCd2Zy5zaWRlYmFyLmhpZGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoaW5zdGFuY2UuX3BhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGNsZWFyRHJvcHMoZXZlbnQpIHtcclxuXHRcdGlmIChldmVudC5idXR0b24gPT09IDIgfHwgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5ICE9PSAnVGFiJykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0VkdOYXYuaGlkZU9wZW5Ecm9wcyhldmVudClcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlT3BlbkRyb3BzKGV2ZW50KSB7XHJcblx0XHRjb25zdCBvcGVuVG9nZ2xlcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd246bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuYWN0aXZlJyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHTmF2LmdldEluc3RhbmNlKHRvZ2dsZS5jbG9zZXN0KCcudmctbmF2JykpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdG9nZ2xlIH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5oaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9SRVNJWkVfREFUQV9BUEksIGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoU2VsZWN0b3JzLmZpbmQoJy52Zy1uYXYnKSkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR05hdi5nZXRPckNyZWF0ZUluc3RhbmNlKCcudmctbmF2Jywge30pO1xyXG5cdFx0aW5zdGFuY2UuYnVpbGQoKTtcclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR05hdjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAncm9sbHVwJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcucm9sbHVwJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0hJREUgPSAndmctcm9sbHVwLWRpc3BsYXktLW5vbmUnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cInJvbGx1cFwiXSdcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdSb2xsdXAgIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGNvbnRlbnQ6ICd0ZXh0JyxcclxuXHRcdFx0b2Zmc2V0OiAwLFxyXG5cdFx0XHRjbnQ6IDAsXHJcblx0XHRcdGZhZGU6IHRydWUsXHJcblx0XHRcdHRyYW5zaXRpb246IGZhbHNlLFxyXG5cdFx0XHRudW1iZXI6IGZhbHNlLFxyXG5cdFx0XHRoZWlnaHQ6IDAsXHJcblx0XHRcdGVsbGlwc2lzOiB7XHJcblx0XHRcdFx0bGluZTogbnVsbFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtb3JlOiAnINC10YnQtSAnLFxyXG5cdFx0XHRidXR0b246IHtcclxuXHRcdFx0XHRlbmFibGU6IHRydWUsXHJcblx0XHRcdFx0bW9yZTogXCLQn9C+0LrQsNC30LDRgtGMXCIsXHJcblx0XHRcdFx0bGVzczogXCLQodCy0LXRgNC90YPRgtGMXCJcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5jbGFzc2VzID0ge1xyXG5cdFx0XHRjb250YWluZXI6ICd2Zy1yb2xsdXAnLFxyXG5cdFx0XHRoaWRkZW46IFwidmctcm9sbHVwLWNvbnRlbnQtLWhpZGRlblwiLFxyXG5cdFx0XHRmYWRlOiBcInZnLXJvbGx1cC1jb250ZW50LS1mYWRlXCIsXHJcblx0XHRcdGVsbGlwc2lzOiBcInZnLXJvbGx1cC1jb250ZW50LS1lbGxpcHNpc1wiLFxyXG5cdFx0XHRidXR0b246IFwidmctcm9sbHVwLWNvbnRlbnQtLWJ1dHRvblwiLFxyXG5cdFx0XHR0cmFuc2l0aW9uOiBcInZnLXJvbGx1cC1jb250ZW50LS10cmFuc2l0aW9uXCJcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy50b3RhbCAgICA9IDA7XHJcblx0XHR0aGlzLmNvdW50ICAgID0gMDtcclxuXHRcdHRoaXMub2Zmc2V0ICAgPSAwO1xyXG5cdFx0dGhpcy5pc09mZnNldCA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMub2Zmc2V0ID4gMCkge1xyXG5cdFx0XHR0aGlzLm9mZnNldCA9ICh0aGlzLl9wYXJhbXMub2Zmc2V0ICsgdGhpcy5fcGFyYW1zLmNudCkgfHwgMDtcclxuXHRcdFx0dGhpcy5pc09mZnNldCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5idWlsZCgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgdG9nZ2xlKHRhcmdldCwgcmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBWR1JvbGx1cC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldCk7XHJcblx0XHRsZXQgaXNTaG93biA9IGluc3RhbmNlLmlzU2hvdygpO1xyXG5cclxuXHRcdGlmICghaXNTaG93bikge1xyXG5cdFx0XHRpbnN0YW5jZS5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQuaW5uZXJIVE1MID0gaW5zdGFuY2UuX3BhcmFtcy5idXR0b24ubGVzcztcclxuXHJcblx0XHRcdGlmIChpbnN0YW5jZS5vZmZzZXQgPiAwKSB7XHJcblx0XHRcdFx0aWYgKGluc3RhbmNlLmlzT2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmlubmVySFRNTCA9IGluc3RhbmNlLl9wYXJhbXMuYnV0dG9uLm1vcmU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQuaW5uZXJIVE1MID0gaW5zdGFuY2UuX3BhcmFtcy5idXR0b24ubGVzcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluc3RhbmNlLnN3aXRjaChpbnN0YW5jZS5fZWxlbWVudCwgZmFsc2UpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihpbnN0YW5jZS5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCB0ZXh0U2hvd051bSA9ICcnLFxyXG5cdFx0XHRcdGlzU2hvd051bSA9IGluc3RhbmNlLl9wYXJhbXMubnVtYmVyO1xyXG5cclxuXHJcblx0XHRcdGlmIChpc1Nob3dOdW0pIHtcclxuXHRcdFx0XHRsZXQgc3VtID0gKGluc3RhbmNlLnRvdGFsKSAtIChpbnN0YW5jZS5jb3VudCk7XHJcblxyXG5cdFx0XHRcdGlmIChzdW0gPiAwKSB7XHJcblx0XHRcdFx0XHR0ZXh0U2hvd051bSA9IGluc3RhbmNlLl9wYXJhbXMubW9yZSArIHN1bTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBmYWxzZSk7XHJcblx0XHRcdGluc3RhbmNlLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0cmVsYXRlZFRhcmdldC5pbm5lckhUTUwgPSBpbnN0YW5jZS5fcGFyYW1zLmJ1dHRvbi5tb3JlICsgdGV4dFNob3dOdW07XHJcblx0XHRcdGluc3RhbmNlLnN3aXRjaChpbnN0YW5jZS5fZWxlbWVudCwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihpbnN0YW5jZS5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUsIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGJ1aWxkKGVsID0gbnVsbCwgaXNCdXR0b25BcHBlbmQgPSB0cnVlKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRlbGVtZW50ID0gZWwgfHwgX3RoaXMuX2VsZW1lbnQsXHJcblx0XHRcdHNlbGZfaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQsIHNldF9oZWlnaHQgPSBfdGhpcy5fcGFyYW1zLmhlaWdodCB8fCAoc2VsZl9oZWlnaHQgLyAyKTtcclxuXHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoX3RoaXMuY2xhc3Nlcy5jb250YWluZXIpXHJcblxyXG5cdFx0bGV0IGlzRmFkZSA9ICAgICAgICBfdGhpcy5fcGFyYW1zLmZhZGUsXHJcblx0XHRcdGlzVHJhbnNpdGlvbiA9ICBfdGhpcy5fcGFyYW1zLnRyYW5zaXRpb24sXHJcblx0XHRcdGlzRWxsaXBzaXMgPSAgICBfdGhpcy5fcGFyYW1zLmVsbGlwc2lzLmxpbmUgIT09IG51bGwsXHJcblx0XHRcdGlzQnV0dG9uID0gICAgICBfdGhpcy5fcGFyYW1zLmJ1dHRvbi5lbmFibGUsXHJcblx0XHRcdGlzU2hvd051bSA9ICAgICBfdGhpcy5fcGFyYW1zLm51bWJlcjtcclxuXHJcblx0XHRpZiAoIWlzQnV0dG9uQXBwZW5kKSBfdGhpcy5zd2l0Y2goZWxlbWVudCk7XHJcblxyXG5cdFx0aWYgKHNlbGZfaGVpZ2h0ID4gc2V0X2hlaWdodCAmJiBfdGhpcy5fcGFyYW1zLmNvbnRlbnQgPT09ICd0ZXh0Jykge1xyXG5cdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoX3RoaXMuY2xhc3Nlcy5oaWRkZW4pO1xyXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IHNldF9oZWlnaHQgKyBcInB4XCI7XHJcblxyXG5cdFx0XHRlbGxpcHNpcygpO1xyXG5cdFx0XHR0cmFuc2l0aW9uKCk7XHJcblx0XHRcdGZhZGUoKTtcclxuXHRcdFx0YnV0dG9uKCk7XHJcblx0XHR9IGVsc2UgaWYgKF90aGlzLl9wYXJhbXMuY29udGVudCA9PT0gJ2VsZW1lbnRzJykge1xyXG5cdFx0XHRsZXQgZWxlbWVudENsYXNzID0gX3RoaXMuX3BhcmFtcy5lbGVtZW50cyB8fCAnaXRlbScsXHJcblx0XHRcdFx0aXRlbXMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgZWxlbWVudENsYXNzKSxcclxuXHRcdFx0XHRjbnQgPSBfdGhpcy5fcGFyYW1zLmNudCB8fCA1LFxyXG5cdFx0XHRcdGkgPSAxO1xyXG5cclxuXHRcdFx0X3RoaXMudG90YWwgPSBpdGVtcy5sZW5ndGg7XHJcblx0XHRcdF90aGlzLmNvdW50ID0gY250O1xyXG5cclxuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XHJcblx0XHRcdFx0aWYgKGkgPiBjbnQpIHtcclxuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0hJREUpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpKys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpc0J1dHRvbiA9PT0gdHJ1ZSkgaXNCdXR0b24gPSAoaSAtIDEpID4gY250O1xyXG5cclxuXHRcdFx0ZWxsaXBzaXMoKTtcclxuXHRcdFx0dHJhbnNpdGlvbigpO1xyXG5cdFx0XHRmYWRlKCk7XHJcblx0XHRcdGJ1dHRvbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGVsbGlwc2lzKCkge1xyXG5cdFx0XHRpZiAoaXNFbGxpcHNpcykge1xyXG5cdFx0XHRcdGxldCBsaW5lID0gX3RoaXMuX3BhcmFtcy5lbGxpcHNpcy5saW5lO1xyXG5cdFx0XHRcdGlzRmFkZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZiAobGluZSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLmNsYXNzZXMuZWxsaXBzaXMpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zdHlsZS53ZWJraXRMaW5lQ2xhbXAgPSBsaW5lO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcItCf0LXRgNC10LzQtdC90L3QsNGPIFtkYXRhLWxpbmVdINC40LvQuCDQv9Cw0YDQsNC80LXRgtGAW2xpbmVdINC90LUg0LTQvtC70LbQvdGLINCx0YvRgtGMINC/0YPRgdGC0YvQvNC4XCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE8gbm8gd29ya1xyXG5cdFx0ZnVuY3Rpb24gdHJhbnNpdGlvbigpIHtcclxuXHRcdFx0aWYgKGlzVHJhbnNpdGlvbikge1xyXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChfdGhpcy5jbGFzc2VzLnRyYW5zaXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmFkZSgpIHtcclxuXHRcdFx0aWYgKGlzRmFkZSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChfdGhpcy5jbGFzc2VzLmZhZGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gYnV0dG9uKCkge1xyXG5cdFx0XHRpZiAoaXNCdXR0b25BcHBlbmQpIHtcclxuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIGVsZW1lbnQuaWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNCdXR0b24pIHtcclxuXHRcdFx0XHRcdGxldCB0ZXh0U2hvd051bSA9ICcnO1xyXG5cclxuXHRcdFx0XHRcdGlmIChpc1Nob3dOdW0pIHtcclxuXHRcdFx0XHRcdFx0bGV0IHN1bSA9IChfdGhpcy50b3RhbCkgLSAoX3RoaXMuY291bnQpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHN1bSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0U2hvd051bSA9IF90aGlzLl9wYXJhbXMubW9yZSArIHN1bTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxldCBidG5UZXh0TW9yZSA9IF90aGlzLl9wYXJhbXMuYnV0dG9uLm1vcmU7XHJcblx0XHRcdFx0XHRlbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcImFmdGVyZW5kXCIsIFwiPGRpdiAgY2xhc3M9XFxcIlwiICsgX3RoaXMuY2xhc3Nlcy5idXR0b24gKyBcIlxcXCI+PGEgaHJlZj1cXFwiI1xcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIGRhdGEtdmctdG9nZ2xlPVxcXCJyb2xsdXBcXFwiIGRhdGEtdmctdGFyZ2V0PVxcXCIjXCIgKyBlbGVtZW50LmlkICsgXCJcXFwiPlwiICsgYnRuVGV4dE1vcmUgKyB0ZXh0U2hvd051bSArIFwiPC9hPjwvZGl2PlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN3aXRjaChlbCwgc3dpdGNoZXIgPSBmYWxzZSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChzd2l0Y2hlcikge1xyXG5cdFx0XHR0aGlzLmJ1aWxkKGVsLCBmYWxzZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5oaWRkZW4pO1xyXG5cdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5lbGxpcHNpcyk7XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLmZhZGUpO1xyXG5cclxuXHRcdFx0ZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5jb250ZW50ID09PSAnZWxlbWVudHMnKSB7XHJcblx0XHRcdFx0bGV0IGNsYXNzTmFtZSA9IF90aGlzLl9wYXJhbXMuZWxlbWVudHM7XHJcblxyXG5cdFx0XHRcdGxldCBpdGVtcyA9IFsuLi5lbC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIGNsYXNzTmFtZSldO1xyXG5cdFx0XHRcdGlmIChpdGVtcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGlmIChfdGhpcy5vZmZzZXQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdGxldCBjbGFzc05hbWUgPSBfdGhpcy5fcGFyYW1zLmVsZW1lbnRzLFxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1zID0gWy4uLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgY2xhc3NOYW1lKV07XHJcblxyXG5cdFx0XHRcdFx0XHRpdGVtcy5zbGljZShfdGhpcy5jb3VudCwgX3RoaXMub2Zmc2V0KS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfSElERSkpO1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5vZmZzZXQgPSBfdGhpcy5vZmZzZXQgKyBfdGhpcy5zZXR0aW5ncy5vZmZzZXQ7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoX3RoaXMub2Zmc2V0ID4gaXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMuaXNPZmZzZXQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRfdGhpcy5vZmZzZXQgPSAwO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9ISURFKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlzU2hvdygpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBwYXJhbXNcclxuXHQgKiBAcGFyYW0gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSwgY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdSb2xsdXAuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMpO1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaywgW2luc3RhbmNlXSk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0aWYgKGlzRGlzYWJsZWQodGhpcykpIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRWR1JvbGx1cC50b2dnbGUodGFyZ2V0LCB0aGlzKTtcclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdSb2xsdXA7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7XHJcblx0aXNEaXNhYmxlZCxcclxuXHRpc0VtcHR5T2JqLCBpc09iamVjdCxcclxuXHRtZXJnZURlZXBPYmplY3QsXHJcblx0bm9vcCxcclxuXHRub3JtYWxpemVEYXRhLFxyXG5cdHRyYW5zbGl0ZXJhdGVcclxufSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnc2VsZWN0JztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuc2VsZWN0JztcclxuXHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgICAgICAgICAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFICAgICAgICAgPSAnYWN0aXZlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT05UQUlORVIgICAgICA9ICd2Zy1zZWxlY3QnO1xyXG5jb25zdCBDTEFTU19OQU1FX0RST1BET1dOICAgICAgID0gJ3ZnLXNlbGVjdC1kcm9wZG93bic7XHJcbmNvbnN0IENMQVNTX05BTUVfTElTVCAgICAgICAgICAgPSAndmctc2VsZWN0LWxpc3QnO1xyXG5jb25zdCBDTEFTU19OQU1FX09QVElPTiAgICAgICAgID0gJ3ZnLXNlbGVjdC1saXN0LS1vcHRpb24nO1xyXG5jb25zdCBDTEFTU19OQU1FX09QVEdST1VQICAgICAgID0gJ3ZnLXNlbGVjdC1saXN0LS1vcHRncm91cCc7XHJcbmNvbnN0IENMQVNTX05BTUVfT1BUR1JPVVBfVElUTEUgPSAndmctc2VsZWN0LWxpc3QtLW9wdGdyb3VwLXRpdGxlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9DVVJSRU5UICAgICAgICA9ICd2Zy1zZWxlY3QtY3VycmVudCc7XHJcbmNvbnN0IENMQVNTX05BTUVfUExBQ0VIT0xERVIgICAgPSAndmctc2VsZWN0LWN1cnJlbnQtLXBsYWNlaG9sZGVyJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TRUFSQ0ggICAgICAgICA9ICd2Zy1zZWxlY3Qtc2VhcmNoJztcclxuXHJcbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJICAgICAgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfVVBfREFUQV9BUEkgICAgID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTRVRfREFUQV9BUEkgICAgICA9IGByZXNldC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DSEFOR0UgICAgICAgICAgPSBgJHtOQU1FX0tFWX0uY2hhbmdlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICAgICAgICAgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiAgICAgICAgICA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgICAgICAgICAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gICAgICAgICAgID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFICAgID0gJ1tkYXRhLXZnLXRvZ2dsZT1cInNlbGVjdFwiXSc7XHJcbmNvbnN0IFNFTEVDVE9SX09QVElPTl9UT0dHTEUgID0gJ1tkYXRhLXZnLXRvZ2dsZT1cInNlbGVjdC1vcHRpb25cIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9TRUFSQ0hfVE9HR0xFICA9ICdbbmFtZT12Zy1zZWxlY3Qtc2VhcmNoXSc7XHJcblxyXG5cclxubGV0IG9ic2VydmVyVGltb3V0O1xyXG5cclxuY2xhc3MgVkdTZWxlY3QgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0c2VhcmNoOiBmYWxzZSxcclxuXHRcdFx0cGxhY2Vob2xkZXI6ICcnLFxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0ZWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHJcblx0XHR0aGlzLl9kcm9wID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgQ0xBU1NfTkFNRV9EUk9QRE9XTiwgdGhpcy5fZWxlbWVudCk7XHJcblx0XHR0aGlzLnJlZnJlc2goKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZExpc3RPcHRpb25zKHNlbGVjdG9yLCBkcm9wKSB7XHJcblx0XHRsZXQgb3B0aW9ucyA9IHNlbGVjdG9yLm9wdGlvbnMsXHJcblx0XHRcdGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG5cclxuXHRcdGxpc3QuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0xJU1QpO1xyXG5cclxuXHRcdGxldCBvcHRHcm91cCA9IHNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGdyb3VwJyk7XHJcblxyXG5cdFx0aWYgKG9wdEdyb3VwLmxlbmd0aCkge1xyXG5cdFx0XHRsZXQgaXNTZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRbLi4ub3B0R3JvdXBdLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0bGV0IG9sT3B0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvbCcpO1xyXG5cdFx0XHRcdG9sT3B0R3JvdXAuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX09QVEdST1VQKTtcclxuXHJcblx0XHRcdFx0bGV0IGxpTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG5cdFx0XHRcdGxpTGFiZWwuaW5uZXJIVE1MID0gZWwubGFiZWwudHJpbSgpO1xyXG5cdFx0XHRcdGxpTGFiZWwuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX09QVEdST1VQX1RJVExFKVxyXG5cclxuXHRcdFx0XHRvbE9wdEdyb3VwLnByZXBlbmQobGlMYWJlbClcclxuXHJcblx0XHRcdFx0bGV0IG9wdEdyb3VwT3B0aW9ucyA9IFNlbGVjdG9ycy5maW5kQWxsKCdvcHRpb24nLCBlbCk7XHJcblxyXG5cdFx0XHRcdGNyZWF0ZUxpKG9wdEdyb3VwT3B0aW9ucywgb2xPcHRHcm91cCwgaXNTZWxlY3RlZCk7XHJcblxyXG5cdFx0XHRcdGxpc3QuYXBwZW5kKG9sT3B0R3JvdXApO1xyXG5cdFx0XHRcdGlzU2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBpc1NlbGVjdGVkID0gZmFsc2U7XHJcblx0XHRcdGNyZWF0ZUxpKG9wdGlvbnMsIGxpc3QsIGlzU2VsZWN0ZWQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRyb3AuYXBwZW5kKGxpc3QpO1xyXG5cclxuXHRcdHJldHVybiBsaXN0O1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNyZWF0ZUxpKG9wdGlvbnMsIGxpc3QsIGlzU2VsZWN0ZWQpIHtcclxuXHRcdFx0bGV0IGkgPSAwO1xyXG5cdFx0XHRmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zKSB7XHJcblx0XHRcdFx0bGV0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuXHJcblx0XHRcdFx0bGkuaW5uZXJIVE1MID0gb3B0aW9uLmlubmVySFRNTC50cmltKCkucmVwbGFjZSgvPFxcL1tePl0rKD58JCkvZywgXCJcIilcclxuXHRcdFx0XHRsaS5kYXRhc2V0LnZhbHVlID0gTWFuaXB1bGF0b3IuZ2V0KG9wdGlvbiwgJ3ZhbHVlJyk7XHJcblx0XHRcdFx0bGkuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX09QVElPTik7XHJcblxyXG5cdFx0XHRcdE1hbmlwdWxhdG9yLnNldChsaSwgJ2RhdGEtdmctdG9nZ2xlJywgJ3NlbGVjdC1vcHRpb24nKTtcclxuXHJcblx0XHRcdFx0bGV0IGxpRGF0YSA9IE1hbmlwdWxhdG9yLmdldChvcHRpb24pO1xyXG5cdFx0XHRcdGlmICghaXNFbXB0eU9iaihsaURhdGEpKSB7XHJcblx0XHRcdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhsaURhdGEpKSB7XHJcblx0XHRcdFx0XHRcdE1hbmlwdWxhdG9yLnNldChsaSwgJ2RhdGEtJyArIGtleSwgbGlEYXRhW2tleV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGkgPT09IHNlbGVjdG9yLnNlbGVjdGVkSW5kZXggJiYgIWlzU2VsZWN0ZWQpIHtcclxuXHRcdFx0XHRcdGxpLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKG9wdGlvbiwgJ2Rpc2FibGVkJykpIGxpLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhvcHRpb24sICdoaWRkZW4nKSkgbGkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblxyXG5cdFx0XHRcdGxpc3QuYXBwZW5kKGxpKTtcclxuXHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgYnVpbGQoc2VsZWN0b3IsIHJlQnVpbGQpIHtcclxuXHRcdGxldCBvcHRpb25fc2VsZWN0ZWQsXHJcblx0XHRcdHBsYWNlaG9sZGVyID0gc2VsZWN0b3IuZGF0YXNldC5wbGFjZWhvbGRlciB8fCAnJyxcclxuXHRcdFx0aXNTZWFyY2ggPSBzZWxlY3Rvci5kYXRhc2V0LnNlYXJjaCB8fCBmYWxzZTtcclxuXHJcblx0XHRpZiAoc2VsZWN0b3IuZGF0YXNldD8uaW5pdGVkID09PSAndHJ1ZScgJiYgIXJlQnVpbGQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fSBlbHNlIGlmIChyZUJ1aWxkKSB7XHJcblx0XHRcdFZHU2VsZWN0LmRlc3Ryb3koc2VsZWN0b3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwbGFjZWhvbGRlciAmJiBzZWxlY3Rvci5zZWxlY3RlZEluZGV4ID09PSAwKSB7XHJcblx0XHRcdG9wdGlvbl9zZWxlY3RlZCA9ICc8c3BhbiBjbGFzcz1cIicrIENMQVNTX05BTUVfUExBQ0VIT0xERVIgKydcIj4nICsgcGxhY2Vob2xkZXIgKyAnPHNwYW4+JztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9wdGlvbl9zZWxlY3RlZCA9IHNlbGVjdG9yLm9wdGlvbnNbc2VsZWN0b3Iuc2VsZWN0ZWRJbmRleF0uaW5uZXJUZXh0O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCh0L7Qt9C00LDQtdC8INC+0YHQvdC+0LLQvdC+0Lkg0Y3Qu9C10LzQtdC90YIg0YEg0LrQu9Cw0YHRgdCw0LzQuCDRgdC10LvQtdC60YLQsFxyXG5cdFx0bGV0IGNsYXNzZXMgPSBNYW5pcHVsYXRvci5nZXQoc2VsZWN0b3IsJ2NsYXNzJyksXHJcblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcblx0XHRjbGFzc2VzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgX2NsYXNzIG9mIGNsYXNzZXMpIHtcclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF9jbGFzcylcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTWFuaXB1bGF0b3IuaGFzKHNlbGVjdG9yLCAnZGlzYWJsZWQnKSkgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xyXG5cclxuXHRcdGxldCBlbERhdGEgPSBNYW5pcHVsYXRvci5nZXQoc2VsZWN0b3IpO1xyXG5cdFx0aWYgKCFpc0VtcHR5T2JqKGVsRGF0YSkpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZWxEYXRhKSkge1xyXG5cdFx0XHRcdE1hbmlwdWxhdG9yLnNldChlbGVtZW50LCdkYXRhLScgKyBrZXksIGVsRGF0YVtrZXldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCh0L7Qt9C00LDQtdC8INGN0LvQtdC80LXQvdGCINGBINC+0YLQvtCx0YDQsNC20LXQvdC40LXQvCDQstGL0LHRgNCw0L3QvdC+0LPQviDQstCw0YDQuNCw0L3RgtCwXHJcblx0XHRsZXQgY3VycmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0Y3VycmVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ1VSUkVOVCk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQoY3VycmVudCwgJ2RhdGEtdmctdG9nZ2xlJywgJ3NlbGVjdCcpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGN1cnJlbnQsICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblx0XHRjdXJyZW50LmlubmVySFRNTCA9IG9wdGlvbl9zZWxlY3RlZC50cmltKCk7XHJcblx0XHRlbGVtZW50LmFwcGVuZChjdXJyZW50KTtcclxuXHJcblx0XHQvLyDQodC+0LfQtNCw0LXQvCDRjdC70LXQvNC10L3RgiDQstGL0L/QsNC00LDRjtGJ0LXQs9C+INGB0L/QuNGB0LrQsFxyXG5cdFx0bGV0IGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRkcm9wZG93bi5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRFJPUERPV04pO1xyXG5cdFx0ZWxlbWVudC5hcHBlbmQoZHJvcGRvd24pO1xyXG5cclxuXHRcdC8vINCh0L7Qt9C00LDQtdC8INGB0L/QuNGB0L7QuiDQuCDQstCw0YDQuNCw0L3RgtGLINGB0LXQu9C10LrRgtCwXHJcblx0XHRWR1NlbGVjdC5idWlsZExpc3RPcHRpb25zKHNlbGVjdG9yLCBkcm9wZG93bik7XHJcblxyXG5cdFx0Ly8g0JTQvtCx0LDQstC70Y/QtdC8INCy0YHQtSDRgdC+0LfQtNCw0L3QvdGL0Lkg0LrQvtC90YLQtdC50L3QtdGAINC/0L7RgdC70LUg0YHQtdC70LXQutGC0LBcclxuXHRcdHNlbGVjdG9yLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBlbGVtZW50KTtcclxuXHJcblx0XHQvLyDQv9C+0LzQtdGH0LDQtdC8INGN0LvQtdC80LXQvdGCINC40L3QuNGG0LjQsNC70LjQt9C40YDQvtCy0LDQvdC90YvQvFxyXG5cdFx0c2VsZWN0b3IuZGF0YXNldC5pbml0ZWQgPSAndHJ1ZSc7XHJcblxyXG5cdFx0aWYgKGlzU2VhcmNoKSB7XHJcblx0XHRcdGxldCBzZWFyY2hfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdHNlYXJjaF9jb250YWluZXIuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NFQVJDSCk7XHJcblxyXG5cdFx0XHRsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQoaW5wdXQsICduYW1lJywgJ3ZnLXNlbGVjdC1zZWFyY2gnKTtcclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KGlucHV0LCAndHlwZScsICd0ZXh0Jyk7XHJcblx0XHRcdE1hbmlwdWxhdG9yLnNldChpbnB1dCwgJ3BsYWNlaG9sZGVyJywgJ9Cf0L7QuNGB0LouLi4nKTtcclxuXHJcblx0XHRcdHNlYXJjaF9jb250YWluZXIuYXBwZW5kKGlucHV0KTtcclxuXHRcdFx0ZHJvcGRvd24ucHJlcGVuZChzZWFyY2hfY29udGFpbmVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLnNlYXJjaCkge1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBTZWxlY3RvcnMuZmluZCgnaW5wdXQnLCB0aGlzLl9lbGVtZW50KTtcclxuXHRcdFx0aWYgKGlucHV0KSBpbnB1dC5mb2N1cygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0FDVElWRSk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZHJvcCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkgfHwgIXRoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2NvbXBsZXRlSGlkZSgpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZSgpIHtcclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFLCB7fSlcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblx0XHRsZXQgdG9nZ2xlID0gU2VsZWN0b3JzLmZpbmQoU0VMRUNUT1JfREFUQV9UT0dHTEUsIHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KHRvZ2dsZSwgJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOLCB7fSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDEwKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRyZWZyZXNoKCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0ID0gdGhpcy5fZWxlbWVudC5wcmV2aW91c1NpYmxpbmc7XHJcblxyXG5cdFx0bGV0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xyXG5cdFx0XHRjbGVhclRpbWVvdXQob2JzZXJ2ZXJUaW1vdXQpO1xyXG5cdFx0XHRvYnNlcnZlclRpbW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFZHU2VsZWN0LmJ1aWxkKHNlbGVjdCwgdHJ1ZSk7XHJcblx0XHRcdH0sIDEwMCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRvYnNlcnZlci5vYnNlcnZlKHNlbGVjdCwge1xyXG5cdFx0XHRhdHRyaWJ1dGVGaWx0ZXI6IFsnZGlzYWJsZWQnLCAncmVxdWlyZWQnLCAnc3R5bGUnLCAnaGlkZGVuJ10sXHJcblx0XHRcdGNoaWxkTGlzdDogdHJ1ZSxcclxuXHRcdFx0c3VidHJlZTogdHJ1ZSxcclxuXHRcdFx0Y2hhcmFjdGVyRGF0YU9sZFZhbHVlOiB0cnVlLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGRlc3Ryb3koc2VsZWN0KSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IHNlbGVjdC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQ09OVEFJTkVSKSkge1xyXG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDtcclxuXHRcdFx0XHRbLi4uc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbicpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcclxuXHRcdFx0XHRcdGlmIChlbC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcclxuXHRcdFx0XHRcdFx0c2VsZWN0LnNlbGVjdGVkSW5kZXggPSBpbmRleDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnLnZnLXNlbGVjdDpub3QoLmRpc2FibGVkKTpub3QoOmRpc2FibGVkKS5zaG93Jyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHU2VsZWN0LmdldEluc3RhbmNlKHRvZ2dsZSk7XHJcblx0XHRcdGlmICghY29udGV4dCkgY29udGludWU7XHJcblxyXG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgQ0xBU1NfTkFNRV9DT05UQUlORVIpID09PSBjb250ZXh0Ll9lbGVtZW50KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBjb21wb3NlZFBhdGggPSBldmVudC5jb21wb3NlZFBhdGgoKTtcclxuXHRcdFx0aWYgKGNvbXBvc2VkUGF0aC5pbmNsdWRlcyhjb250ZXh0Ll9lbGVtZW50KSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IGNvbnRleHQuX2VsZW1lbnQgfVxyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb250ZXh0Ll9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjbGVhckRyb3BzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQuYnV0dG9uID09PSAyIHx8IChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleSAhPT0gJ1RhYicpKSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdFZHU2VsZWN0LmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjaGFuZ2VTZWxlY3RvcihzZWxlY3QsIHZhbHVlLCBkYXRhID0ge30pIHtcclxuXHRcdGlmICghaXNPYmplY3QoZGF0YSkgJiYgaXNFbXB0eU9iaihkYXRhKSkgcmV0dXJuO1xyXG5cclxuXHRcdHNlbGVjdC52YWx1ZSA9IG5vcm1hbGl6ZURhdGEodmFsdWUpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoc2VsZWN0LCBFVkVOVF9LRVlfQ0hBTkdFLCB7ZGF0YTogZGF0YX0pO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoc2VsZWN0LCAnY2hhbmdlJywge2RhdGE6IGRhdGF9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICogQHBhcmFtIGlzUmVidWlsZFxyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9LCBpc1JlYnVpbGQgPSBmYWxzZSkge1xyXG5cdFx0bGV0IGVsbSA9IFZHU2VsZWN0LmJ1aWxkKGVsZW1lbnQpO1xyXG5cdFx0VkdTZWxlY3QuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbG0sIHBhcmFtcyk7XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR1NlbGVjdC5jbGVhckRyb3BzKTtcclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoKSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gdGhpcy5jbG9zZXN0KCcuJyArIENMQVNTX05BTUVfQ09OVEFJTkVSKTtcclxuXHJcblx0TWFuaXB1bGF0b3Iuc2V0KHRoaXMsICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1zZWxlY3Quc2hvdycpXHJcblx0aWYgKGFscmVhZHlPcGVuICYmIGFscmVhZHlPcGVuICE9PSB0YXJnZXQpIHtcclxuXHRcdFZHU2VsZWN0LmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRjb25zdCBpbnN0YW5jZSA9IFZHU2VsZWN0LmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KTtcclxuXHRpbnN0YW5jZS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfT1BUSU9OX1RPR0dMRSwgZnVuY3Rpb24gKGUpIHtcclxuXHRsZXQgZWwgPSBlLnRhcmdldDtcclxuXHJcblx0aWYgKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdGxldCBjb250YWluZXIgPSBlbC5jbG9zZXN0KCcuJyArIENMQVNTX05BTUVfQ09OVEFJTkVSKSxcclxuXHRcdFx0b3B0aW9ucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIENMQVNTX05BTUVfT1BUSU9OKTtcclxuXHJcblx0XHRpZiAob3B0aW9ucy5sZW5ndGgpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBvcHRpb24gb2Ygb3B0aW9ucykge1xyXG5cdFx0XHRcdG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuXHJcblx0XHRjb250YWluZXIucXVlcnlTZWxlY3RvcignLicgKyBDTEFTU19OQU1FX0NVUlJFTlQpLmlubmVyVGV4dCA9IGVsLmlubmVyVGV4dDtcclxuXHRcdGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcblxyXG5cdFx0bGV0IHNlbGVjdCA9IGNvbnRhaW5lci5wcmV2aW91c1NpYmxpbmc7XHJcblx0XHRWR1NlbGVjdC5jaGFuZ2VTZWxlY3RvcihzZWxlY3QsIGVsLmRhdGFzZXQudmFsdWUsIHt2YWx1ZTogZWwuZGF0YXNldC52YWx1ZSwgdGl0bGU6IGVsLmlubmVySFRNTH0pXHJcblx0fVxyXG59KTtcclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX1VQX0RBVEFfQVBJLCBTRUxFQ1RPUl9TRUFSQ0hfVE9HR0xFLCBmdW5jdGlvbiAoZSkge1xyXG5cdGxldCBlbCA9IHRoaXM7XHJcblxyXG5cdGxldCBzZWxlY3RMaXN0ID0gZWw/LmNsb3Nlc3QoJy4nICsgQ0xBU1NfTkFNRV9EUk9QRE9XTikucXVlcnlTZWxlY3RvcignLicgKyBDTEFTU19OQU1FX0xJU1QpO1xyXG5cdGlmIChzZWxlY3RMaXN0KSB7XHJcblx0XHRsZXQgb3B0aW9ucyA9IFsuLi5zZWxlY3RMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgQ0xBU1NfTkFNRV9PUFRJT04pXSxcclxuXHRcdFx0b3B0aW9uc0dyb3VwID0gWy4uLnNlbGVjdExpc3QucXVlcnlTZWxlY3RvckFsbCgnLicgKyBDTEFTU19OQU1FX09QVEdST1VQKV0sXHJcblx0XHRcdHZhbHVlID0gZWw/LnZhbHVlO1xyXG5cclxuXHRcdG9wdGlvbnMgPSBvcHRpb25zLmNvbmNhdChvcHRpb25zR3JvdXApO1xyXG5cclxuXHRcdGZvciAoY29uc3Qgb3B0aW9uIG9mIG9wdGlvbnMpIHtcclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2hvdyhvcHRpb24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh2YWx1ZS5sZW5ndGgpIHtcclxuXHRcdFx0dmFsdWUgPSB2YWx1ZS50cmltKCk7XHJcblx0XHRcdHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0dmFsdWUgPSB0cmFuc2xpdGVyYXRlKHZhbHVlLCB0cnVlKTtcclxuXHJcblx0XHRcdGZvciAoY29uc3Qgb3B0aW9uIG9mIG9wdGlvbnMpIHtcclxuXHRcdFx0XHRsZXQgdGV4dCA9IG9wdGlvbi5pbm5lclRleHQudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRleHQuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSBNYW5pcHVsYXRvci5oaWRlKG9wdGlvbik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9SRVNFVF9EQVRBX0FQSSwgJ2Zvcm0nLCBmdW5jdGlvbiAoKSB7XHJcblx0U2VsZWN0b3JzLmZpbmRBbGwoJ3NlbGVjdC4nICsgQ0xBU1NfTkFNRV9DT05UQUlORVIsIHRoaXMpLmZvckVhY2goZWwgPT4ge1xyXG5cdFx0VkdTZWxlY3QuYnVpbGQoZWwsIHRydWUpXHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHU2VsZWN0OyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIGlzVmlzaWJsZSwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge2Rpc21pc3NUcmlnZ2VyfSBmcm9tIFwiLi4vLi4vbW9kdWxlLWZuXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9vdmVyZmxvd1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICdzaWRlYmFyJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcuc2lkZWJhcic7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiXSc7XHJcblxyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfT1BFTiA9ICd2Zy1zaWRlYmFyLW9wZW4nO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCA9IGAke05BTUVfS0VZfS5sb2FkZWRgO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3MuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9QT1BTVEFURV9EQVRBX0FQSSA9IGBwb3BzdGF0ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ET01fTE9BREVEX0RBVEFfQVBJID0gYERPTUNvbnRlbnRMb2FkZWQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdTaWRlYmFyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGhhc2g6IGZhbHNlLFxyXG5cdFx0XHRhbmltYXRpb246IHtcclxuXHRcdFx0XHRlbmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdGluOiAnYW5pbWF0ZV9fcm9sbEluJyxcclxuXHRcdFx0XHRvdXQ6ICdhbmltYXRlX19yb2xsT3V0JyxcclxuXHRcdFx0XHRkZWxheTogODAwLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0XHRsb2FkZXI6IGZhbHNlLFxyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5ID0gIXRoaXMuX3BhcmFtcy5hbmltYXRpb24uZW5hYmxlID8gMCA6IHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXk7XHJcblx0XHR0aGlzLl9hbmltYXRpb24odGhpcy5fZWxlbWVudCwgVkdTaWRlYmFyLk5BTUVfS0VZLCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmIChpc0Rpc2FibGVkKF90aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChyZWxhdGVkVGFyZ2V0KSBfdGhpcy5fcGFyYW1zID0gX3RoaXMuX2dldFBhcmFtcyhyZWxhdGVkVGFyZ2V0LCBfdGhpcy5fcGFyYW1zKTtcclxuXHJcblx0XHRfdGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0xPQURFRCwge3N0YXRzOiBzdGF0dXMsIGRhdGE6IGRhdGF9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRCYWNrZHJvcC5zaG93KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0T3ZlcmZsb3cuYXBwZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5oYXNoKSB7XHJcblx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBcInZnLXNpZGViYXItb3BlblwiLCBcIiNcIiArIHRoaXMuX2VsZW1lbnQuaWQpO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfS0VZX1BPUFNUQVRFX0RBVEFfQVBJLCAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX09QRU4pO1xyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihTZWxlY3RvcnMuZmluZCgnLnZnLWJhY2tkcm9wJyksICdtb3VzZWRvd24udmcuYmFja2Ryb3AnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIF90aGlzLl9lbGVtZW50LCB0cnVlLCA1MClcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmJhY2tkcm9wKSB7XHJcblx0XHRcdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKF90aGlzLl9wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdE92ZXJmbG93LmRlc3Ryb3koKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLmhhc2gpIHtcclxuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX09QRU4pO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSk7XHJcblx0XHR9LCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTLCBldmVudCA9PiB7XHJcblx0XHRcdGlmIChldmVudC5rZXkgIT09ICdFc2NhcGUnKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHU2lkZWJhcik7XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pXHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1zaWRlYmFyLnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWR1NpZGViYXIuZ2V0SW5zdGFuY2UoYWxyZWFkeU9wZW4pLmhpZGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHU2lkZWJhci5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRkYXRhLnRvZ2dsZSh0aGlzKTtcclxufSk7XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9ET01fTE9BREVEX0RBVEFfQVBJLCBmdW5jdGlvbiAoKSB7XHJcblx0bGV0IHRhcmdldEhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKTtcclxuXHRpZiAodGFyZ2V0SGFzaCkge1xyXG5cdFx0bGV0IHRhcmdldCA9IFNlbGVjdG9ycy5maW5kKCcjJyArIHRhcmdldEhhc2gpO1xyXG5cdFx0aWYgKHRhcmdldCAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2Zy1zaWRlYmFyJykpIHtcclxuXHRcdFx0aWYgKGlzRGlzYWJsZWQodGFyZ2V0KSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgZGF0YSA9IFZHU2lkZWJhci5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRcdFx0ZGF0YS50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR1NpZGViYXI7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQge2V4ZWN1dGUsIGlzRGlzYWJsZWQsIG1ha2VSYW5kb21TdHJpbmcsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ3RvYXN0JztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcudG9hc3QnO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cInRvYXN0XCJdJztcclxuXHJcbmNvbnN0IENMQVNTX05BTUVfT1BFTiAgICA9ICd2Zy10b2FzdC1vcGVuJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XICAgID0gJ3Nob3cnO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOICAgPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gICAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5jb25zdCBFVkVOVF9LRVlfTE9BREVEICAgPSBgJHtOQU1FX0tFWX0ubG9hZGVkYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEICA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJICA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR1RvYXN0IGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdHN0YXRpYzogdHJ1ZSxcclxuXHRcdFx0cGxhY2VtZW50OiAnYm90dG9tIGNlbnRlcicsXHJcblx0XHRcdGF1dG9oaWRlOiBmYWxzZSxcclxuXHRcdFx0ZGVsYXk6IDMwMDAsXHJcblx0XHRcdGVuYWJsZUNsaWNrVG9hc3Q6IHRydWUsXHJcblx0XHRcdGVuYWJsZUJ1dHRvbkNsb3NlOiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0dGhlbWU6ICdkYXJrJyxcclxuXHRcdFx0c3RhY2s6IHtcclxuXHRcdFx0XHRlbmFibGU6IHRydWUsXHJcblx0XHRcdFx0bWF4OiA1XHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdGVuYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpbjogJ2FuaW1hdGVfX2ZhZGVJbicsXHJcblx0XHRcdFx0b3V0OiAnYW5pbWF0ZV9fZmFkZU91dCcsXHJcblx0XHRcdFx0ZGVsYXk6IDQwMCxcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdFx0bG9hZGVyOiBmYWxzZSxcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSA9ICF0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmVuYWJsZSA/IDAgOiB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5O1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIFZHVG9hc3QuTkFNRV9LRVksIHRoaXMuX3BhcmFtcy5hbmltYXRpb24pO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHRcdHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblxyXG5cdFx0dGhpcy5fdGltZW91dCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBydW4odGV4dCwgcGFyYW1zID0ge30sIGNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gVkdUb2FzdC5idWlsZCh0ZXh0LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZCh0ZXh0LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0XHRwYXJhbXMgPSBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRwbGFjZW1lbnQ6ICdib3R0b20gY2VudGVyJyxcclxuXHRcdFx0c3RhdGljOiBmYWxzZSxcclxuXHRcdFx0dGhlbWU6ICdkYXJrJyxcclxuXHRcdFx0c3RhY2s6IHtcclxuXHRcdFx0XHRlbmFibGU6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcyk7XHJcblxyXG5cdFx0bGV0IHRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0Jyk7XHJcblx0XHR0YXJnZXQuaWQgPSAndmctdG9hc3QtJyArIG1ha2VSYW5kb21TdHJpbmcoKTtcclxuXHJcblx0XHRpZiAoJ3RoZW1lJyBpbiBwYXJhbXMpIHtcclxuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0LScgKyBwYXJhbXMudGhlbWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgncGxhY2VtZW50JyBpbiBwYXJhbXMpIHtcclxuXHRcdFx0cGFyYW1zLnBsYWNlbWVudC5zcGxpdCgnICcpLmZvckVhY2godmFsID0+IHRhcmdldC5jbGFzc0xpc3QuYWRkKHZhbCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHR3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0LXdyYXBwZXInKTtcclxuXHJcblx0XHRpZiAoJ3R5cGUnIGluIHBhcmFtcykge1xyXG5cdFx0XHRsZXQgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0LWljb24nKTtcclxuXHJcblx0XHRcdHdyYXBwZXIuYXBwZW5kKGljb24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRjb250ZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0LWNvbnRlbnQnKTtcclxuXHJcblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0Ym9keS5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC1ib2R5Jyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRib2R5LmlubmVySFRNTCA9IHRleHQ7XHJcblx0XHRcdGNvbnRlbnQuYXBwZW5kKGJvZHkpO1xyXG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRleHQpKSB7XHJcblx0XHRcdGlmICh0ZXh0Lmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRsZXQgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0LWhlYWRlcicpO1xyXG5cdFx0XHRcdGhlYWRlci5pbm5lckhUTUwgPSB0ZXh0WzBdO1xyXG5cdFx0XHRcdGNvbnRlbnQuYXBwZW5kKGhlYWRlcik7XHJcblxyXG5cdFx0XHRcdGJvZHkuaW5uZXJIVE1MID0gdGV4dFsxXTtcclxuXHRcdFx0XHRjb250ZW50LmFwcGVuZChib2R5KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRib2R5LmlubmVySFRNTCA9IHRleHRbMF07XHJcblx0XHRcdFx0Y29udGVudC5hcHBlbmQoYm9keSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR3cmFwcGVyLmFwcGVuZChjb250ZW50KTtcclxuXHJcblx0XHRpZiAoJ2VuYWJsZUJ1dHRvbkNsb3NlJyBpbiBwYXJhbXMgJiYgcGFyYW1zLmVuYWJsZUJ1dHRvbkNsb3NlKSB7XHJcblx0XHRcdGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3ZnLXRvYXN0LWJ1dHRvbicpO1xyXG5cdFx0XHRidXR0b24uaW5uZXJIVE1MID0gJzxidXR0b24gY2xhc3M9XCJ2Zy1idG4tY2xvc2VcIiBkYXRhLXZnLWRpc21pc3M9XCJ0b2FzdFwiPjwvYnV0dG9uPic7XHJcblx0XHRcdHdyYXBwZXIuYXBwZW5kKGJ1dHRvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0dGFyZ2V0LmFwcGVuZCh3cmFwcGVyKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKHRhcmdldCk7XHJcblxyXG5cdFx0bGV0IGluc3RhbmNlID0gIFZHVG9hc3QuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQsIHBhcmFtcyk7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrLCBbaW5zdGFuY2VdKTtcclxuXHRcdGluc3RhbmNlLnNob3coKTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2NsZWFyVGltZW91dCgpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhyZWxhdGVkVGFyZ2V0IHx8IHt9LCB0aGlzLl9wYXJhbXMpO1xyXG5cdFx0dGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfTE9BREVELCB7c3RhdHM6IHN0YXR1cywgZGF0YTogZGF0YX0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHJcblx0XHR0aGlzLl9zZXRQbGFjZW1lbnQoKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHRcdHRoaXMuX3NjaGVkdWxlSGlkZSgpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlLCAwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50Py5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX09QRU4pO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5fcGFyYW1zLnN0YWNrLmVuYWJsZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5fc2V0UGxhY2VtZW50KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIXRoaXMuX3BhcmFtcy5zdGF0aWMpIHtcclxuXHRcdFx0XHRcdHRoaXMuZGlzcG9zZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2VsZW1lbnQsIGZhbHNlLCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5KTtcclxuXHRcdH0sIHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXkpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHRoaXMuX2NsZWFyVGltZW91dCgpO1xyXG5cdFx0aWYgKHRoaXMuX2lzU2hvd24oKSkge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuX3BhcmFtcy5zdGF0aWMpIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfc2NoZWR1bGVIaWRlKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMuYXV0b2hpZGUpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHR9LCB0aGlzLl9wYXJhbXMuZGVsYXkpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9zZXRQbGFjZW1lbnQoKSB7XHJcblx0XHRsZXQgZWxtcyA9IHRoaXMuX2VuYWJsZVN0YWNrKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5zdGFjay5lbmFibGUpIHtcclxuXHRcdFx0aWYgKGVsbXMubGVuZ3RoID4gdGhpcy5fcGFyYW1zLnN0YWNrLm1heCkge1xyXG5cdFx0XHRcdGxldCBlbG0gPSBlbG1zLnNoaWZ0KCk7XHJcblx0XHRcdFx0VkdUb2FzdC5nZXRJbnN0YW5jZShlbG0uZWwpLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGVsbXMuZm9yRWFjaChlbG0gPT4ge1xyXG5cdFx0XHRsZXQgaXNQbGFjZW1lbnRDbGFzc1RvcCA9IGVsbS5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvcCcpLFxyXG5cdFx0XHRcdGlzUGxhY2VtZW50Q2xhc3NCb3R0b20gPSBlbG0uZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdib3R0b20nKSxcclxuXHRcdFx0XHRpc1BsYWNlbWVudENsYXNzTGVmdCA9IGVsbS5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSxcclxuXHRcdFx0XHRpc1BsYWNlbWVudENsYXNzUmlnaHQgPSBlbG0uZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpLFxyXG5cdFx0XHRcdGlzUGxhY2VtZW50Q2xhc3NDZW50ZXIgPSBlbG0uZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZW50ZXInKTtcclxuXHJcblx0XHRcdGlmICghaXNQbGFjZW1lbnRDbGFzc1RvcCAmJlxyXG5cdFx0XHRcdCFpc1BsYWNlbWVudENsYXNzQm90dG9tICYmXHJcblx0XHRcdFx0IWlzUGxhY2VtZW50Q2xhc3NDZW50ZXIgJiZcclxuXHRcdFx0XHQhaXNQbGFjZW1lbnRDbGFzc1JpZ2h0ICYmXHJcblx0XHRcdFx0IWlzUGxhY2VtZW50Q2xhc3NMZWZ0XHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGlzUGxhY2VtZW50Q2xhc3NCb3R0b20gPSB0cnVlO1xyXG5cdFx0XHRcdGlzUGxhY2VtZW50Q2xhc3NDZW50ZXIgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaXNQbGFjZW1lbnRDbGFzc0NlbnRlcikge1xyXG5cdFx0XHRcdGlmIChpc1BsYWNlbWVudENsYXNzTGVmdCkge1xyXG5cdFx0XHRcdFx0ZWxtLmVsLnN0eWxlLmxlZnQgPSAwO1xyXG5cdFx0XHRcdFx0ZWxtLmVsLnN0eWxlLmJvdHRvbSA9ICdjYWxjKDUwJSAtICgnKyBlbG0udG9wICsncHgpKSc7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpc1BsYWNlbWVudENsYXNzUmlnaHQpIHtcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5yaWdodCA9IDA7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUuYm90dG9tID0gJ2NhbGMoNTAlIC0gKCcrIGVsbS50b3AgKydweCkpJztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzUGxhY2VtZW50Q2xhc3NCb3R0b20pIHtcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5sZWZ0ID0gJ2NhbGMoNTAlIC0gKCcrIGVsbS5lbC5jbGllbnRXaWR0aCArJ3B4KSAvIDIpJztcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5ib3R0b20gPSBlbG0udG9wICsgJ3B4JztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzUGxhY2VtZW50Q2xhc3NUb3ApIHtcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5sZWZ0ID0gJ2NhbGMoNTAlIC0gKCcrIGVsbS5lbC5jbGllbnRXaWR0aCArJ3B4KSAvIDIpJztcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS50b3AgPSBlbG0udG9wICsgJ3B4JztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZWxtLmVsLnN0eWxlLmxlZnQgPSAnY2FsYyg1MCUgLSAoJysgZWxtLmVsLmNsaWVudEhlaWdodCArJ3B4KSAvIDIpJztcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5ib3R0b20gPSAnY2FsYyg1MCUgLSAnKyBlbG0udG9wICsncHgpJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKGlzUGxhY2VtZW50Q2xhc3NMZWZ0KSBlbG0uZWwuc3R5bGUubGVmdCA9IDA7XHJcblx0XHRcdFx0aWYgKGlzUGxhY2VtZW50Q2xhc3NCb3R0b20pIGVsbS5lbC5zdHlsZS5ib3R0b20gPSBlbG0udG9wICsgJ3B4JztcclxuXHRcdFx0XHRpZiAoaXNQbGFjZW1lbnRDbGFzc1RvcCkgZWxtLmVsLnN0eWxlLnRvcCA9IGVsbS50b3AgKyAncHgnO1xyXG5cdFx0XHRcdGlmIChpc1BsYWNlbWVudENsYXNzUmlnaHQpIGVsbS5lbC5zdHlsZS5yaWdodCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2VuYWJsZVN0YWNrKCkge1xyXG5cdFx0bGV0IGVsbXNTaG93biA9IFsuLi4gU2VsZWN0b3JzLmZpbmRBbGwoJy52Zy10b2FzdC5zaG93JyldLCB0b3AgPSAwO1xyXG5cclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLnN0YWNrLmVuYWJsZSkge1xyXG5cdFx0XHRlbG1zU2hvd24uZm9yRWFjaChlbCA9PiB7XHJcblx0XHRcdFx0aWYgKGVsICE9PSB0aGlzLl9lbGVtZW50KSB7XHJcblx0XHRcdFx0XHRWR1RvYXN0LmdldEluc3RhbmNlKGVsKS5oaWRlKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRyZXR1cm4gW3tcclxuXHRcdFx0XHRlbDogdGhpcy5fZWxlbWVudCxcclxuXHRcdFx0XHR0b3A6IDAsXHJcblx0XHRcdH1dO1xyXG5cdFx0fVxyXG5cclxuXHRcdGVsbXNTaG93biA9IGVsbXNTaG93bi5tYXAoZWwgPT4ge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGVsOiBlbCxcclxuXHRcdFx0XHR0b3A6IGVsLmNsaWVudEhlaWdodFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gZWxtc1Nob3duLm1hcChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRlbDogdmFsdWUuZWwsXHJcblx0XHRcdFx0XHR0b3A6IDBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dG9wICs9IHZhbHVlLnRvcFxyXG5cclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0ZWw6IHZhbHVlLmVsLFxyXG5cdFx0XHRcdFx0dG9wOiB0b3BcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2NsZWFyVGltZW91dCgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0KTtcclxuXHRcdHRoaXMuX3RpbWVvdXQgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTLCBldmVudCA9PiB7XHJcblx0XHRcdGlmIChldmVudC5rZXkgIT09ICdFc2NhcGUnKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERV9QUkVWRU5URUQpXHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmVuYWJsZUNsaWNrVG9hc3QpIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC1wb2ludGVyJyk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgJyMnICsgdGhpcy5fZWxlbWVudC5pZCwgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdUb2FzdCk7XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gU2VsZWN0b3JzLmdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcyk7XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9ISURERU4sICgpID0+IHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zdCBkYXRhID0gVkdUb2FzdC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldCk7XHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdUb2FzdDtcclxuIiwiaW1wb3J0IHtpc0VsZW1lbnQsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi9kb20vZXZlbnRcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGB0Ysg0LTQu9GPINCw0L3QuNC80LDRhtC40Lkg0YHQvNC+0YLRgNC40Lwg0LfQtNC10YHRjFxyXG4gKiBodHRwczovL2FuaW1hdGUuc3R5bGUvXHJcbiAqXHJcbiAqINCg0LDQsdC+0YLQsNC10YIg0YEg0LzQvtC00YPQu9GP0LzQuCDRgyDQutC+0YLQvtGA0YvRhSDQtdGB0YLRjCDRgdC+0LHRi9GC0LjRjyBzaG93LCBoaWRlLCBoaWRkZW5cclxuICovXHJcbmNsYXNzIEFuaW1hdGlvbiB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwga2V5LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0dGhpcy5fcGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0ZW5hYmxlOiBmYWxzZSxcclxuXHRcdFx0aW46ICdhbmltYXRlX19iYWNrSW5VcCcsXHJcblx0XHRcdG91dDogJ2FuaW1hdGVfX2JhY2tPdXRVcCcsXHJcblx0XHRcdGRlbGF5OiAwLFxyXG5cdFx0fSwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLmNsYXNzZXMgPSB7XHJcblx0XHRcdGFuaW1hdGVkOiAnYW5pbWF0ZV9fYW5pbWF0ZWQnXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMuZW5hYmxlKSByZXR1cm47XHJcblx0XHRpZiAoIWlzRWxlbWVudChlbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG5cdFx0dGhpcy5fbmFtZV9rZXkgPSBrZXk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNsYXNzZXMuYW5pbWF0ZWQpKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuYW5pbWF0ZWQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3RyaWdnZXJzKCk7XHJcblx0fVxyXG5cclxuXHRfdHJpZ2dlcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgdGhpcy5fbmFtZV9rZXkgKyAnLnNob3cnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9wYXJhbXMub3V0KTtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5pbik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgdGhpcy5fbmFtZV9rZXkgKyAnLmhpZGUnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9wYXJhbXMuaW4pO1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5fcGFyYW1zLm91dCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgdGhpcy5fbmFtZV9rZXkgKyAnLmhpZGRlbicsICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX3BhcmFtcy5vdXQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBbmltYXRpb247IiwiaW1wb3J0IHtleGVjdXRlfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBPdmVyZmxvdyBmcm9tIFwiLi9vdmVyZmxvd1wiO1xyXG5cclxuY29uc3QgTkFNRSA9ICdiYWNrZHJvcCc7XHJcbmNvbnN0IENMQVNTX05BTUUgPSAndmctYmFja2Ryb3AnO1xyXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSc7XHJcbmNvbnN0IEVWRU5UX01PVVNFRE9XTiA9IGBtb3VzZWRvd24udmcuJHtOQU1FfWA7XHJcblxyXG5sZXQgYmFja2Ryb3BfZGVsYXkgPSA1MDA7XHJcblxyXG5jbGFzcyBCYWNrZHJvcCB7XHJcblx0c3RhdGljIHNob3coY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9hcHBlbmQoKVxyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaGlkZShjYWxsYmFjaykge1xyXG5cdFx0QmFja2Ryb3AuX2Rlc3Ryb3koKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIF9hcHBlbmQoKSB7XHJcblx0XHRpZiAoU2VsZWN0b3JzLmZpbmQoJy4nICsgQ0xBU1NfTkFNRSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChiYWNrZHJvcCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdFx0fSwgNTApO1xyXG5cclxuXHRcdEV2ZW50SGFuZGxlci5vbihiYWNrZHJvcCwgRVZFTlRfTU9VU0VET1dOLCAoKSA9PiB7XHJcblx0XHRcdEJhY2tkcm9wLmhpZGUoKVxyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfZGVzdHJveSgpIHtcclxuXHRcdGxldCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgQ0xBU1NfTkFNRSk7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdH0sIGJhY2tkcm9wX2RlbGF5KTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhY2tkcm9wOyIsImltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIE92ZXJmbG93XHJcbiAqINCX0LDQv9GA0LXRidCw0LXRgiDRgdC60YDQvtC70LvQuNC90LMg0Lgg0YPQsdC40YDQsNC10YIg0LXQs9C+LCDQutC+0LzQv9C10L3RgdC40YDRg9GPINC+0YLRgdGC0YPQv9C+0LxcclxuICovXHJcblxyXG5jbGFzcyBPdmVyZmxvdyB7XHJcblx0c3RhdGljIGFwcGVuZCgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KCkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHJcblx0XHRsZXQgc3R5bGVzID0gTWFuaXB1bGF0b3IuZ2V0KGRvY3VtZW50LmJvZHksICdzdHlsZScpO1xyXG5cdFx0aWYgKCFzdHlsZXMpIE1hbmlwdWxhdG9yLnJlbW92ZShkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJmbG93OyIsImltcG9ydCB7aXNFbGVtZW50LCBtZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuY2xhc3MgUGFyYW1zIHtcclxuXHRjb25zdHJ1Y3RvcihwYXJhbXMsIGVsZW1lbnQgPSBudWxsKSB7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLm1lcmdlKHBhcmFtcywgZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRnZXQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcGFyYW1zO1xyXG5cdH1cclxuXHJcblx0ZnJvbUVsZW1lbnQoZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuIGlzRWxlbWVudChlbGVtZW50KSA/IE1hbmlwdWxhdG9yLmdldChlbGVtZW50KSA6IHt9O1xyXG5cdH1cclxuXHJcblx0bWVyZ2UocGFyYW1zLCBlbGVtZW50KSB7XHJcblx0XHRsZXQgbVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwYXJhbXMsIHRoaXMuZnJvbUVsZW1lbnQoZWxlbWVudCkpO1xyXG5cclxuXHRcdGZvciAobGV0IGtleSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdGlmIChrZXkuaW5kZXhPZignLScpICE9PSAtMSkge1xyXG5cdFx0XHRcdGxldCBrZXlzID0ga2V5LnNwbGl0KCctJyksXHJcblx0XHRcdFx0XHR2YWx1ZSA9IG5vcm1hbGl6ZURhdGEobVBhcmFtc1trZXldKTtcclxuXHJcblx0XHRcdFx0aWYgKGtleXNbMF0gaW4gbVBhcmFtcykge1xyXG5cdFx0XHRcdFx0aWYgKGtleXNbMV0gaW4gbVBhcmFtc1trZXlzWzBdXSkge1xyXG5cdFx0XHRcdFx0XHRtUGFyYW1zW2tleXNbMF1dW2tleXNbMV1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRkZWxldGUgbVBhcmFtc1trZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdwYXJhbXMnIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChtUGFyYW1zLCBtUGFyYW1zLnBhcmFtcyk7XHJcblx0XHRcdGRlbGV0ZSBtUGFyYW1zLnBhcmFtcztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbVBhcmFtcztcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhcmFtczsiLCJpbXBvcnQge21lcmdlRGVlcE9iamVjdCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgUGxhY2VtZW50LCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvNC10YHRgtC+0L/QvtC70L7QttC10L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0L3QsCDRgdGC0YDQsNC90LjRhtC1LlxyXG4gKiBUT0RPINC60LvQsNGB0YEg0L3QtSDQtNC+0L/QuNGB0LDQvVxyXG4gKi9cclxuXHJcbmNsYXNzIFBsYWNlbWVudCB7XHJcblx0Y29uc3RydWN0b3IoYXJnID0ge30pIHtcclxuXHRcdHRoaXMucGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0ZWxlbWVudDogbnVsbCxcclxuXHRcdFx0ZHJvcDogbnVsbFxyXG5cdFx0fSwgYXJnKTtcclxuXHR9XHJcblxyXG5cdF9nZXRQbGFjZW1lbnQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRjb25zdCBfcGFyZW50ID0gKHNlbGYpID0+IHtcclxuXHRcdFx0bGV0IHBhcmVudCA9IHNlbGYucGFyZW50Tm9kZSxcclxuXHRcdFx0XHRvdmVyZmxvdyA9IGdldENvbXB1dGVkU3R5bGUocGFyZW50KS5vdmVyZmxvdztcclxuXHJcblx0XHRcdGlmIChwYXJlbnQudGFnTmFtZSAhPT0gJ0JPRFknKSB7XHJcblx0XHRcdFx0aWYgKG92ZXJmbG93ID09PSAndmlzaWJsZScpIHtcclxuXHRcdFx0XHRcdF9wYXJlbnQocGFyZW50KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gcGFyZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBpc0ZpeGVkID0gZmFsc2UsIHRvcCwgbGVmdCxcclxuXHRcdFx0Ym91bmRzID0gX3RoaXMucGFyYW1zLmRyb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcblx0XHRcdHBhcmVudCA9IF90aGlzLnBhcmFtcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdGlmIChfcGFyZW50KF90aGlzLnBhcmFtcy5lbGVtZW50KSkge1xyXG5cdFx0XHRpc0ZpeGVkID0gdHJ1ZTtcclxuXHRcdFx0dG9wID0gYm91bmRzLnRvcDtcclxuXHRcdFx0bGVmdCA9IGJvdW5kcy5sZWZ0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoX3RoaXMucGFyYW1zLmRyb3ApO1xyXG5cdFx0XHR0b3AgPSBub3JtYWxpemVEYXRhKHN0eWxlcy50b3Auc2xpY2UoMCwgLTIpKTtcclxuXHRcdFx0bGVmdCA9IG5vcm1hbGl6ZURhdGEoc3R5bGVzLmxlZnQuc2xpY2UoMCwgLTIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoKGJvdW5kcy5sZWZ0ICsgYm91bmRzLndpZHRoKSA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdGxlZnQgPSBwYXJlbnQud2lkdGggLSBib3VuZHMud2lkdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXNGaXhlZDogaXNGaXhlZCxcclxuXHRcdFx0dG9wOiB0b3AsXHJcblx0XHRcdGxlZnQ6IGxlZnRcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYWNlbWVudDsiLCIvKipcclxuICog0JrQu9Cw0YHRgSBSZXNwb25zaXZlLCDRgNCw0LHQvtGC0LDQtdGCINC/0L4g0YLQsNC60LjQvCDQttC1INC80LXQtNC40LAg0YLQvtGH0LrQsNC8LCDRh9GC0L4g0LggYm9vdHN0cmFwXHJcbiAqINC4INC+0L/RgNC10LTQtdC70Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLlxyXG4gKi9cclxuXHJcbmNsYXNzIFJlc3BvbnNpdmUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5icmVha3BvaW50cyA9IHtcclxuXHRcdFx0eHM6IDAsXHJcblx0XHRcdHNtOiA1NzYsXHJcblx0XHRcdG1kOiA3NjgsXHJcblx0XHRcdGxnOiA5OTIsXHJcblx0XHRcdHhsOiAxMjAwLFxyXG5cdFx0XHR4eGw6IDE0MDAsXHJcblx0XHRcdHh4eGw6IDE2MDAsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JXRgdC70Lgg0L3QsNGI0LAg0YjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsCDRgdC+0LLQv9Cw0LTQsNC10YIg0YEg0LTQuNCw0L/QsNC30L7QvdC+0Lwg0LrQvtGC0L7RgNGL0Lkg0YPQutCw0LfQsNC9INCyINC80L7QtNGD0LvQtSDQstGL0LTQsNC10LwgdHJ1ZSwg0LjQvdCw0YfQtSBmYWxzZVxyXG5cdCAqIEBwYXJhbSBtb2R1bGVcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRzdGF0aWMgY2hlY2sobW9kdWxlKSB7XHJcblx0XHRsZXQgaW5zdGFuY2UgPSBuZXcgdGhpcyA7XHJcblx0XHRyZXR1cm4gaW5zdGFuY2UuZGVmaW5lKG1vZHVsZSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7QstC10YDRj9C10YIg0L3QsCDRgtCw0Ycg0YPRgdGC0YDQvtC50YHRgtCy0LAuIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0L/RgNCw0LLQuNC70YzQvdC+LCDQvdCw0LTQviDRgdC00LXQu9Cw0YLRjCDQv9C+LdC00YDRg9Cz0L7QvNGDXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrTW9iaWxlT3JUYWJsZXQoKSB7XHJcblx0XHRsZXQgY2hlY2sgPSBmYWxzZTtcclxuXHRcdChmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vfGFuZHJvaWR8aXBhZHxwbGF5Ym9va3xzaWxrL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnNsaWNlKDAsNCkpKXtcclxuXHRcdFx0XHRjaGVjayA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7XHJcblxyXG5cdFx0cmV0dXJuIGNoZWNrO1xyXG5cdH1cclxuXHJcblx0ZGVmaW5lKG1vZHVsZSkge1xyXG5cdFx0bGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGgsXHJcblx0XHRcdHJlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuX2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSksXHJcblx0XHRcdGJyZWFrcG9pbnRzID0gdGhpcy5icmVha3BvaW50cyxcclxuXHRcdFx0cG9pbnQgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cykuZmluZChrZXkgPT4gYnJlYWtwb2ludHNba2V5XSA9PT0gcmVzcG9uc2l2ZV9zaXplKTtcclxuXHJcblx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKSxcclxuXHRcdFx0bG9jID0ga2V5cy5pbmRleE9mKHBvaW50KTtcclxuXHJcblx0XHRyZXR1cm4gd2luZG93V2lkdGggPj0gYnJlYWtwb2ludHNba2V5c1tsb2MgKyAxXV07XHJcblx0fVxyXG5cclxuXHRfY2hlY2tSZXNwb25zaXZlQ2xhc3MobW9kdWxlKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IG1vZHVsZS5fZWxlbWVudCxcclxuXHRcdFx0cGFyYW1zID0gbW9kdWxlLl9wYXJhbXMsXHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gMDtcclxuXHJcblx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFhYTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnh4eGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhYTCkpIHtcclxuXHRcdFx0Y3VycmVudF9yZXNwb25zaXZlX3NpemUgPSB0aGlzLmJyZWFrcG9pbnRzLnh4bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54bDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuTEcpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5sZztcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuTUQpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5tZDtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuU00pKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy5zbTtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMocGFyYW1zLmNsYXNzZXMuWFMpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54cztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54cztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY3VycmVudF9yZXNwb25zaXZlX3NpemVcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNpdmU7IiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCB1dGlsL3Njcm9sbEJhci5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcblxyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vZG9tL21hbmlwdWxhdG9yXCI7XHJcbmltcG9ydCB7aXNFbGVtZW50fSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcblxyXG5jb25zdCBTRUxFQ1RPUl9GSVhFRF9DT05URU5UID0gJy5maXhlZC10b3AsIC5maXhlZC1ib3R0b20sIC5pcy1maXhlZCwgLnN0aWNreS10b3AnXHJcbmNvbnN0IFNFTEVDVE9SX1NUSUNLWV9DT05URU5UID0gJy5zdGlja3ktdG9wJ1xyXG5jb25zdCBQUk9QRVJUWV9QQURESU5HID0gJ3BhZGRpbmctcmlnaHQnXHJcbmNvbnN0IFBST1BFUlRZX01BUkdJTiA9ICdtYXJnaW4tcmlnaHQnXHJcblxyXG4vKipcclxuICogQ2xhc3MgZGVmaW5pdGlvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNjcm9sbEJhckhlbHBlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuYm9keVxyXG5cdH1cclxuXHJcblx0Ly8gUHVibGljXHJcblx0Z2V0V2lkdGgoKSB7XHJcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93L2lubmVyV2lkdGgjdXNhZ2Vfbm90ZXNcclxuXHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50V2lkdGgpXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3Qgd2lkdGggPSB0aGlzLmdldFdpZHRoKClcclxuXHRcdHRoaXMuX2Rpc2FibGVPdmVyRmxvdygpXHJcblx0XHQvLyBnaXZlIHBhZGRpbmcgdG8gZWxlbWVudCB0byBiYWxhbmNlIHRoZSBoaWRkZW4gc2Nyb2xsYmFyIHdpZHRoXHJcblx0XHR0aGlzLl9zZXRFbGVtZW50QXR0cmlidXRlcyh0aGlzLl9lbGVtZW50LCBQUk9QRVJUWV9QQURESU5HLCBjYWxjdWxhdGVkVmFsdWUgPT4gY2FsY3VsYXRlZFZhbHVlICsgd2lkdGgpXHJcblx0XHQvLyB0cmljazogV2UgYWRqdXN0IHBvc2l0aXZlIHBhZGRpbmdSaWdodCBhbmQgbmVnYXRpdmUgbWFyZ2luUmlnaHQgdG8gc3RpY2t5LXRvcCBlbGVtZW50cyB0byBrZWVwIHNob3dpbmcgZnVsbHdpZHRoXHJcblx0XHR0aGlzLl9zZXRFbGVtZW50QXR0cmlidXRlcyhTRUxFQ1RPUl9GSVhFRF9DT05URU5ULCBQUk9QRVJUWV9QQURESU5HLCBjYWxjdWxhdGVkVmFsdWUgPT4gY2FsY3VsYXRlZFZhbHVlICsgd2lkdGgpXHJcblx0XHR0aGlzLl9zZXRFbGVtZW50QXR0cmlidXRlcyhTRUxFQ1RPUl9TVElDS1lfQ09OVEVOVCwgUFJPUEVSVFlfTUFSR0lOLCBjYWxjdWxhdGVkVmFsdWUgPT4gY2FsY3VsYXRlZFZhbHVlIC0gd2lkdGgpXHJcblx0fVxyXG5cclxuXHRyZXNldCgpIHtcclxuXHRcdHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCwgJ292ZXJmbG93JylcclxuXHRcdHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCwgUFJPUEVSVFlfUEFERElORylcclxuXHRcdHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfRklYRURfQ09OVEVOVCwgUFJPUEVSVFlfUEFERElORylcclxuXHRcdHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQsIFBST1BFUlRZX01BUkdJTilcclxuXHR9XHJcblxyXG5cdGlzT3ZlcmZsb3dpbmcoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRXaWR0aCgpID4gMFxyXG5cdH1cclxuXHJcblx0Ly8gUHJpdmF0ZVxyXG5cdF9kaXNhYmxlT3ZlckZsb3coKSB7XHJcblx0XHR0aGlzLl9zYXZlSW5pdGlhbEF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50LCAnb3ZlcmZsb3cnKVxyXG5cdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcblx0fVxyXG5cclxuXHRfc2V0RWxlbWVudEF0dHJpYnV0ZXMoc2VsZWN0b3IsIHN0eWxlUHJvcGVydHksIGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuZ2V0V2lkdGgoKVxyXG5cdFx0Y29uc3QgbWFuaXB1bGF0aW9uQ2FsbEJhY2sgPSBlbGVtZW50ID0+IHtcclxuXHRcdFx0aWYgKGVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnQgJiYgd2luZG93LmlubmVyV2lkdGggPiBlbGVtZW50LmNsaWVudFdpZHRoICsgc2Nyb2xsYmFyV2lkdGgpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fc2F2ZUluaXRpYWxBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSlcclxuXHRcdFx0Y29uc3QgY2FsY3VsYXRlZFZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KVxyXG5cdFx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHN0eWxlUHJvcGVydHksIGAke2NhbGxiYWNrKE51bWJlci5wYXJzZUZsb2F0KGNhbGN1bGF0ZWRWYWx1ZSkpfXB4YClcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9hcHBseU1hbmlwdWxhdGlvbkNhbGxiYWNrKHNlbGVjdG9yLCBtYW5pcHVsYXRpb25DYWxsQmFjaylcclxuXHR9XHJcblxyXG5cdF9zYXZlSW5pdGlhbEF0dHJpYnV0ZShlbGVtZW50LCBzdHlsZVByb3BlcnR5KSB7XHJcblx0XHRjb25zdCBhY3R1YWxWYWx1ZSA9IGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KVxyXG5cdFx0aWYgKGFjdHVhbFZhbHVlKSB7XHJcblx0XHRcdE1hbmlwdWxhdG9yLmdldChlbGVtZW50LCBzdHlsZVByb3BlcnR5LCBhY3R1YWxWYWx1ZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKHNlbGVjdG9yLCBzdHlsZVByb3BlcnR5KSB7XHJcblx0XHRjb25zdCBtYW5pcHVsYXRpb25DYWxsQmFjayA9IGVsZW1lbnQgPT4ge1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IE1hbmlwdWxhdG9yLmdldChlbGVtZW50LCBzdHlsZVByb3BlcnR5KVxyXG5cdFx0XHQvLyBXZSBvbmx5IHdhbnQgdG8gcmVtb3ZlIHRoZSBwcm9wZXJ0eSBpZiB0aGUgdmFsdWUgaXMgYG51bGxgOyB0aGUgdmFsdWUgY2FuIGFsc28gYmUgemVyb1xyXG5cdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcclxuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KHN0eWxlUHJvcGVydHkpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE1hbmlwdWxhdG9yLnJlbW92ZShlbGVtZW50LCBzdHlsZVByb3BlcnR5KVxyXG5cdFx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHN0eWxlUHJvcGVydHksIHZhbHVlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIG1hbmlwdWxhdGlvbkNhbGxCYWNrKVxyXG5cdH1cclxuXHJcblx0X2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIGNhbGxCYWNrKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRjYWxsQmFjayhzZWxlY3RvcilcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBzZWwgb2YgU2VsZWN0b3JzLmZpbmRBbGwoc2VsZWN0b3IsIHRoaXMuX2VsZW1lbnQpKSB7XHJcblx0XHRcdGNhbGxCYWNrKHNlbClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjcm9sbEJhckhlbHBlciIsImltcG9ydCB7ZXhlY3V0ZSwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG5jb25zdCBURU1QTEFURVMgPSBbXHJcblx0e3R5cGU6ICdjb2xsYXBzZScsIHRlbXBsYXRlOiAnJ30sXHJcblx0e3R5cGU6ICdtb2RhbCcsIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInZnLW1vZGFsXCI+PC9kaXY+J30sXHJcblx0e3R5cGU6ICdwYXNzLW9wZW4nLCB0ZW1wbGF0ZTogJzxzcGFuIGRhdGEtdmctdG9nZ2xlPVwidmdwYXNzXCIgY2xhc3M9XCJbW2NsYXNzZXNdXVwiIHRpdGxlPVwi0J/QvtC60LDQt9Cw0YLRjCAvINCh0LrRgNGL0YLRjFwiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiPjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTc2IDUxMlwiPjxwYXRoIGQ9XCJNMjg4IDgwYy02NS4yIDAtMTE4LjggMjkuNi0xNTkuOSA2Ny43Qzg5LjYgMTgzLjUgNjMgMjI2IDQ5LjQgMjU2YzEzLjYgMzAgNDAuMiA3Mi41IDc4LjYgMTA4LjNDMTY5LjIgNDAyLjQgMjIyLjggNDMyIDI4OCA0MzJzMTE4LjgtMjkuNiAxNTkuOS02Ny43QzQ4Ni40IDMyOC41IDUxMyAyODYgNTI2LjYgMjU2Yy0xMy42LTMwLTQwLjItNzIuNS03OC42LTEwOC4zQzQwNi44IDEwOS42IDM1My4yIDgwIDI4OCA4MHpNOTUuNCAxMTIuNkMxNDIuNSA2OC44IDIwNy4yIDMyIDI4OCAzMnMxNDUuNSAzNi44IDE5Mi42IDgwLjZjNDYuOCA0My41IDc4LjEgOTUuNCA5MyAxMzEuMWMzLjMgNy45IDMuMyAxNi43IDAgMjQuNmMtMTQuOSAzNS43LTQ2LjIgODcuNy05MyAxMzEuMUM0MzMuNSA0NDMuMiAzNjguOCA0ODAgMjg4IDQ4MHMtMTQ1LjUtMzYuOC0xOTIuNi04MC42QzQ4LjYgMzU2IDE3LjMgMzA0IDIuNSAyNjguM2MtMy4zLTcuOS0zLjMtMTYuNyAwLTI0LjZDMTcuMyAyMDggNDguNiAxNTYgOTUuNCAxMTIuNnpNMjg4IDMzNmM0NC4yIDAgODAtMzUuOCA4MC04MHMtMzUuOC04MC04MC04MGMtLjcgMC0xLjMgMC0yIDBjMS4zIDUuMSAyIDEwLjUgMiAxNmMwIDM1LjMtMjguNyA2NC02NCA2NGMtNS41IDAtMTAuOS0uNy0xNi0yYzAgLjcgMCAxLjMgMCAyYzAgNDQuMiAzNS44IDgwIDgwIDgwem0wLTIwOGExMjggMTI4IDAgMSAxIDAgMjU2IDEyOCAxMjggMCAxIDEgMC0yNTZ6XCIvPjwvc3ZnPjwvc3Bhbj4nfSxcclxuXHR7dHlwZTogJ3Bhc3MtY2xvc2UnLCB0ZW1wbGF0ZTogJzxzcGFuIGRhdGEtdmctdG9nZ2xlPVwidmdwYXNzXCIgY2xhc3M9XCJbW2NsYXNzZXNdXVwiIHRpdGxlPVwi0J/QvtC60LDQt9Cw0YLRjCAvINCh0LrRgNGL0YLRjFwiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiPjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNjQwIDUxMlwiPjwhLS0hRm9udCBBd2Vzb21lIEZyZWUgNi43LjIgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UvZnJlZSBDb3B5cmlnaHQgMjAyNSBGb250aWNvbnMsIEluYy4tLT48cGF0aCBkPVwiTTM4LjggNS4xQzI4LjQtMy4xIDEzLjMtMS4yIDUuMSA5LjJTLTEuMiAzNC43IDkuMiA0Mi45bDU5MiA0NjRjMTAuNCA4LjIgMjUuNSA2LjMgMzMuNy00LjFzNi4zLTI1LjUtNC4xLTMzLjdMNTI1LjYgMzg2LjdjMzkuNi00MC42IDY2LjQtODYuMSA3OS45LTExOC40YzMuMy03LjkgMy4zLTE2LjcgMC0yNC42Yy0xNC45LTM1LjctNDYuMi04Ny43LTkzLTEzMS4xQzQ2NS41IDY4LjggNDAwLjggMzIgMzIwIDMyYy02OC4yIDAtMTI1IDI2LjMtMTY5LjMgNjAuOEwzOC44IDUuMXptMTUxIDExOC4zQzIyNiA5Ny43IDI2OS41IDgwIDMyMCA4MGM2NS4yIDAgMTE4LjggMjkuNiAxNTkuOSA2Ny43QzUxOC40IDE4My41IDU0NSAyMjYgNTU4LjYgMjU2Yy0xMi42IDI4LTM2LjYgNjYuOC03MC45IDEwMC45bC01My44LTQyLjJjOS4xLTE3LjYgMTQuMi0zNy41IDE0LjItNTguN2MwLTcwLjctNTcuMy0xMjgtMTI4LTEyOGMtMzIuMiAwLTYxLjcgMTEuOS04NC4yIDMxLjVsLTQ2LjEtMzYuMXpNMzk0LjkgMjg0LjJsLTgxLjUtNjMuOWM0LjItOC41IDYuNi0xOC4yIDYuNi0yOC4zYzAtNS41LS43LTEwLjktMi0xNmMuNyAwIDEuMyAwIDIgMGM0NC4yIDAgODAgMzUuOCA4MCA4MGMwIDkuOS0xLjggMTkuNC01LjEgMjguMnptOS40IDEzMC4zQzM3OC44IDQyNS40IDM1MC43IDQzMiAzMjAgNDMyYy02NS4yIDAtMTE4LjgtMjkuNi0xNTkuOS02Ny43QzEyMS42IDMyOC41IDk1IDI4NiA4MS40IDI1NmM4LjMtMTguNCAyMS41LTQxLjUgMzkuNC02NC44TDgzLjEgMTYxLjVDNjAuMyAxOTEuMiA0NCAyMjAuOCAzNC41IDI0My43Yy0zLjMgNy45LTMuMyAxNi43IDAgMjQuNmMxNC45IDM1LjcgNDYuMiA4Ny43IDkzIDEzMS4xQzE3NC41IDQ0My4yIDIzOS4yIDQ4MCAzMjAgNDgwYzQ3LjggMCA4OS45LTEyLjkgMTI2LjItMzIuNWwtNDEuOS0zM3pNMTkyIDI1NmMwIDcwLjcgNTcuMyAxMjggMTI4IDEyOGMxMy4zIDAgMjYuMS0yIDM4LjItNS44TDMwMiAzMzRjLTIzLjUtNS40LTQzLjEtMjEuMi01My43LTQyLjNsLTU2LjEtNDQuMmMtLjIgMi44LS4zIDUuNi0uMyA4LjV6XCIvPjwvc3ZnPjwvc3Bhbj4nfSxcclxuXVxyXG5cclxuXHJcbmNsYXNzIFRlbXBsYXRlciB7XHJcblx0Y29uc3RydWN0b3IoZWwsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBpcyByZXF1aXJlZCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBlbDtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGluc2VydDogJ2FmdGVyZW5kJyxcclxuXHRcdFx0Y2xhc3NlczogW11cclxuXHRcdH0sIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy50ZW1wbGF0ZUJ1aWxkID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHJlbmRlcihjb250ZW50LCBjYWxsYmFjaykge1xyXG5cdFx0bGV0IHRtcGwgPSB0aGlzLnRvSFRNTChjb250ZW50LCBjYWxsYmFjayk7XHJcblxyXG5cdFx0c3dpdGNoICh0aGlzLl9wYXJhbXMuaW5zZXJ0KSB7XHJcblx0XHRcdGNhc2UgJ2FmdGVyZW5kJzpcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCB0bXBsKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0b0hUTUwoY29udGVudCA9ICcnIHwgbnVsbCwgY2FsbGJhY2spIHtcclxuXHRcdGxldCB0bXBsID0gJyc7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0bXBsRWxlbWVudCBvZiBURU1QTEFURVMpIHtcclxuXHRcdFx0aWYgKHRtcGxFbGVtZW50LnR5cGUgPT09IHRoaXMuX3BhcmFtcy50ZW1wbGF0ZSkge1xyXG5cdFx0XHRcdHRtcGwgPSB0bXBsRWxlbWVudC50ZW1wbGF0ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdG1wbCkgcmV0dXJuO1xyXG5cclxuXHRcdHRtcGwgPSB0bXBsLnJlcGxhY2UoJ1tbY2xhc3Nlc11dJywgdGhpcy5fcGFyYW1zLmNsYXNzZXMuam9pbignICcpKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFt0aGlzLl9lbGVtZW50LCB0aGlzLl9wYXJhbXMsIHRtcGxdKTtcclxuXHJcblx0XHRyZXR1cm4gdG1wbDtcclxuXHR9XHJcblxyXG5cdHNldENvbnRlbnQoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGVtcGxhdGVyOyIsIi8qISBqcy1jb29raWUgdjMuMC4xIHwgTUlUICovXHJcblxyXG5mdW5jdGlvbiBhc3NpZ24gKHRhcmdldCkge1xyXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xyXG5cdFx0XHR0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdGFyZ2V0XHJcbn1cclxuXHJcbmxldCBkZWZhdWx0Q29udmVydGVyID0ge1xyXG5cdHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0aWYgKHZhbHVlWzBdID09PSAnXCInKSB7XHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHZhbHVlLnJlcGxhY2UoLyglW1xcZEEtRl17Mn0pKy9naSwgZGVjb2RlVVJJQ29tcG9uZW50KVxyXG5cdH0sXHJcblx0d3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkucmVwbGFjZShcclxuXHRcdFx0LyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxyXG5cdFx0XHRkZWNvZGVVUklDb21wb25lbnRcclxuXHRcdClcclxuXHR9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIsIGRlZmF1bHRBdHRyaWJ1dGVzKSB7XHJcblx0ZnVuY3Rpb24gc2V0IChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XHJcblx0XHR9XHJcblx0XHRpZiAoYXR0cmlidXRlcy5leHBpcmVzKSB7XHJcblx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpXHJcblx0XHRcdC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcclxuXHRcdFx0LnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcclxuXHJcblx0XHRsZXQgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XHJcblx0XHRmb3IgKGxldCBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XHJcblx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xyXG5cclxuXHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XHJcblx0XHRcdC8vIC4uLlxyXG5cdFx0XHQvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXHJcblx0XHRcdC8vICAgICBjaGFyYWN0ZXI6XHJcblx0XHRcdC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXHJcblx0XHRcdC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxyXG5cdFx0XHQvLyAuLi5cclxuXHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XHJcblx0XHRcdGtleSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcylcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldCAoa2V5KSB7XHJcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAha2V5KSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XHJcblx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cclxuXHRcdGxldCBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblx0XHRsZXQgamFyID0ge307XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xyXG5cdFx0XHRsZXQgdmFsdWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxldCBmb3VuZEtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XHJcblx0XHRcdFx0amFyW2ZvdW5kS2V5XSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZEtleSk7XHJcblxyXG5cdFx0XHRcdGlmIChrZXkgPT09IGZvdW5kS2V5KSB7XHJcblx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXJcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuY3JlYXRlKHtcclxuXHRcdFx0c2V0OiBzZXQsXHJcblx0XHRcdGdldDogZ2V0LFxyXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRzZXQoXHJcblx0XHRcdFx0XHRrZXksXHJcblx0XHRcdFx0XHQnJyxcclxuXHRcdFx0XHRcdGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xyXG5cdFx0XHRcdFx0XHRleHBpcmVzOiAtMVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRyZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxyXG5cdFx0XHRjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XHJcblx0XHR9XHJcblx0KVxyXG59XHJcblxyXG5sZXQgYXBpID0gaW5pdChkZWZhdWx0Q29udmVydGVyLCB7IHBhdGg6ICcvJyB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFwaTsiLCIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9vdHN0cmFwIGRhdGEuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDRgNCw0LHQvtGC0LDQtdGCINGBINC60L7Qu9C70LXQutGG0LjQtdC5INC80L7QtNGD0LvQtdC5LiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9tYXAtc2V0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGB0YLQsNC90YLRi1xyXG4gKi9cclxuXHJcbmNvbnN0IGVsZW1lbnRNYXAgPSBuZXcgTWFwKClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRzZXQoZWxlbWVudCwga2V5LCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRlbGVtZW50TWFwLnNldChlbGVtZW50LCBuZXcgTWFwKCkpXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cdFx0aWYgKCFpbnN0YW5jZU1hcC5oYXMoa2V5KSAmJiBpbnN0YW5jZU1hcC5zaXplICE9PSAwKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoYFZHQXBwINC90LUg0LTQvtC/0YPRgdC60LDQtdGCINCx0L7Qu9C10LUg0L7QtNC90L7Qs9C+INGN0LrQt9C10LzQv9C70Y/RgNCwINC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwLiDQodCy0Y/Qt9Cw0L3QvdGL0Lkg0Y3QutC30LXQvNC/0LvRj9GAOiAke0FycmF5LmZyb20oaW5zdGFuY2VNYXAua2V5cygpKVswXX0uYClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuc2V0KGtleSwgaW5zdGFuY2UpO1xyXG5cdH0sXHJcblxyXG5cdGdldChlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmIChlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudE1hcC5nZXQoZWxlbWVudCkuZ2V0KGtleSkgfHwgbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0cmVtb3ZlKGVsZW1lbnQsIGtleSkge1xyXG5cdFx0aWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXHJcblxyXG5cdFx0aW5zdGFuY2VNYXAuZGVsZXRlKGtleSk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlTWFwLnNpemUgPT09IDApIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBldmVudC5qc1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICog0KHQutGA0LjQv9GCINC00LvRjyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQmtC+0L3RgdGC0LDQvdGC0YtcclxuICovXHJcblxyXG5jb25zdCBuYW1lc3BhY2VSZWdleCA9IC9bXi5dKig/PVxcLi4qKVxcLnwuKi9cclxuY29uc3Qgc3RyaXBOYW1lUmVnZXggPSAvXFwuLiovXHJcbmNvbnN0IHN0cmlwVWlkUmVnZXggPSAvOjpcXGQrJC9cclxuY29uc3QgZXZlbnRSZWdpc3RyeSA9IHt9IC8vIEV2ZW50cyBzdG9yYWdlXHJcbmxldCB1aWRFdmVudCA9IDFcclxuY29uc3QgY3VzdG9tRXZlbnRzID0ge1xyXG5cdG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLFxyXG5cdG1vdXNlbGVhdmU6ICdtb3VzZW91dCdcclxufVxyXG5cclxuY29uc3QgbmF0aXZlRXZlbnRzID0gbmV3IFNldChbXHJcblx0J2NsaWNrJyxcclxuXHQnZGJsY2xpY2snLFxyXG5cdCdtb3VzZXVwJyxcclxuXHQnbW91c2Vkb3duJyxcclxuXHQnY29udGV4dG1lbnUnLFxyXG5cdCdtb3VzZXdoZWVsJyxcclxuXHQnRE9NTW91c2VTY3JvbGwnLFxyXG5cdCdtb3VzZW92ZXInLFxyXG5cdCdtb3VzZW91dCcsXHJcblx0J21vdXNlbW92ZScsXHJcblx0J3NlbGVjdHN0YXJ0JyxcclxuXHQnc2VsZWN0ZW5kJyxcclxuXHQnc3VibWl0JyxcclxuXHQna2V5ZG93bicsXHJcblx0J2tleXByZXNzJyxcclxuXHQna2V5dXAnLFxyXG5cdCdvcmllbnRhdGlvbmNoYW5nZScsXHJcblx0J3RvdWNoc3RhcnQnLFxyXG5cdCd0b3VjaG1vdmUnLFxyXG5cdCd0b3VjaGVuZCcsXHJcblx0J3RvdWNoY2FuY2VsJyxcclxuXHQncG9pbnRlcmRvd24nLFxyXG5cdCdwb2ludGVybW92ZScsXHJcblx0J3BvaW50ZXJ1cCcsXHJcblx0J3BvaW50ZXJsZWF2ZScsXHJcblx0J3BvaW50ZXJjYW5jZWwnLFxyXG5cdCdwb3BzdGF0ZScsXHJcblx0J2dlc3R1cmVzdGFydCcsXHJcblx0J2dlc3R1cmVjaGFuZ2UnLFxyXG5cdCdnZXN0dXJlZW5kJyxcclxuXHQnZm9jdXMnLFxyXG5cdCdibHVyJyxcclxuXHQnY2hhbmdlJyxcclxuXHQncmVzZXQnLFxyXG5cdCdzZWxlY3QnLFxyXG5cdCdzdWJtaXQnLFxyXG5cdCdmb2N1c2luJyxcclxuXHQnZm9jdXNvdXQnLFxyXG5cdCdsb2FkJyxcclxuXHQndW5sb2FkJyxcclxuXHQnYmVmb3JldW5sb2FkJyxcclxuXHQncmVzaXplJyxcclxuXHQnbW92ZScsXHJcblx0J0RPTUNvbnRlbnRMb2FkZWQnLFxyXG5cdCdyZWFkeXN0YXRlY2hhbmdlJyxcclxuXHQnZXJyb3InLFxyXG5cdCdhYm9ydCcsXHJcblx0J3Njcm9sbCdcclxuXSlcclxuXHJcbi8qKlxyXG4gKiDQn9GA0LjQstCw0YLQvdGL0LUg0LzQtdGC0L7QtNGLXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFrZUV2ZW50VWlkKGVsZW1lbnQsIHVpZCkge1xyXG5cdHJldHVybiAodWlkICYmIGAke3VpZH06OiR7dWlkRXZlbnQrK31gKSB8fCBlbGVtZW50LnVpZEV2ZW50IHx8IHVpZEV2ZW50KytcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudEV2ZW50cyhlbGVtZW50KSB7XHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGVsZW1lbnQpXHJcblxyXG5cdGVsZW1lbnQudWlkRXZlbnQgPSB1aWRcclxuXHRldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cclxuXHJcblx0cmV0dXJuIGV2ZW50UmVnaXN0cnlbdWlkXVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBIYW5kbGVyKGVsZW1lbnQsIGZuKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGh5ZHJhdGVPYmooZXZlbnQsIHsgZGVsZWdhdGVUYXJnZXQ6IGVsZW1lbnQgfSlcclxuXHJcblx0XHRpZiAoaGFuZGxlci5vbmVPZmYpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcERlbGVnYXRpb25IYW5kbGVyKGVsZW1lbnQsIHNlbGVjdG9yLCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcclxuXHJcblx0XHRmb3IgKGxldCB7IHRhcmdldCB9ID0gZXZlbnQ7IHRhcmdldCAmJiB0YXJnZXQgIT09IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZG9tRWxlbWVudCBvZiBkb21FbGVtZW50cykge1xyXG5cdFx0XHRcdGlmIChkb21FbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiB0YXJnZXQgfSlcclxuXHJcblx0XHRcdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdFx0XHRFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0YXJnZXQsIFtldmVudF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRIYW5kbGVyKGV2ZW50cywgY2FsbGFibGUsIGRlbGVnYXRpb25TZWxlY3RvciA9IG51bGwpIHtcclxuXHRyZXR1cm4gT2JqZWN0LnZhbHVlcyhldmVudHMpXHJcblx0XHQuZmluZChldmVudCA9PiBldmVudC5jYWxsYWJsZSA9PT0gY2FsbGFibGUgJiYgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yID09PSBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdGNvbnN0IGlzRGVsZWdhdGVkID0gdHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnXHJcblx0Ly8gVE9ETzog0LLRi9C00LDQtdGCIFwiZmFsc2VcIiDQstC80LXRgdGC0L4g0YHQtdC70LXQutGC0L7RgNCwLCDQv9C+0Y3RgtC+0LzRgyDQvdGD0LbQvdC+INC/0YDQvtCy0LXRgNC40YLRjC4gYm9vdFxyXG5cdGNvbnN0IGNhbGxhYmxlID0gaXNEZWxlZ2F0ZWQgPyBkZWxlZ2F0aW9uRnVuY3Rpb24gOiAoaGFuZGxlciB8fCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0bGV0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChvcmlnaW5hbFR5cGVFdmVudClcclxuXHJcblx0aWYgKCFuYXRpdmVFdmVudHMuaGFzKHR5cGVFdmVudCkpIHtcclxuXHRcdHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24sIG9uZU9mZikge1xyXG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGxldCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cclxuXHQvLyBpbiBjYXNlIG9mIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZSB3cmFwIHRoZSBoYW5kbGVyIHdpdGhpbiBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGZvciBpdHMgRE9NIHBvc2l0aW9uXHJcblx0Ly8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXHJcblx0aWYgKG9yaWdpbmFsVHlwZUV2ZW50IGluIGN1c3RvbUV2ZW50cykge1xyXG5cdFx0Y29uc3Qgd3JhcEZ1bmN0aW9uID0gZm4gPT4ge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYWJsZSA9IHdyYXBGdW5jdGlvbihjYWxsYWJsZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxyXG5cdGNvbnN0IHByZXZpb3VzRnVuY3Rpb24gPSBmaW5kSGFuZGxlcihoYW5kbGVycywgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblxyXG5cdGlmIChwcmV2aW91c0Z1bmN0aW9uKSB7XHJcblx0XHRwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiA9IHByZXZpb3VzRnVuY3Rpb24ub25lT2ZmICYmIG9uZU9mZlxyXG5cclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgdWlkID0gbWFrZUV2ZW50VWlkKGNhbGxhYmxlLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXHJcblx0Y29uc3QgZm4gPSBpc0RlbGVnYXRlZCA/XHJcblx0XHRib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjYWxsYWJsZSkgOlxyXG5cdFx0Ym9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBjYWxsYWJsZSlcclxuXHJcblx0Zm4uZGVsZWdhdGlvblNlbGVjdG9yID0gaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbFxyXG5cdGZuLmNhbGxhYmxlID0gY2FsbGFibGVcclxuXHRmbi5vbmVPZmYgPSBvbmVPZmZcclxuXHRmbi51aWRFdmVudCA9IHVpZFxyXG5cdGhhbmRsZXJzW3VpZF0gPSBmblxyXG5cclxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgaXNEZWxlZ2F0ZWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3Rvcikge1xyXG5cdGNvbnN0IGZuID0gZmluZEhhbmRsZXIoZXZlbnRzW3R5cGVFdmVudF0sIGhhbmRsZXIsIGRlbGVnYXRpb25TZWxlY3RvcilcclxuXHJcblx0aWYgKCFmbikge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZUV2ZW50LCBmbiwgQm9vbGVhbihkZWxlZ2F0aW9uU2VsZWN0b3IpKVxyXG5cdGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcclxuXHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblxyXG5cdGZvciAoY29uc3QgW2hhbmRsZXJLZXksIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR5cGVFdmVudChldmVudCkge1xyXG5cdC8vIGFsbG93IHRvIGdldCB0aGUgbmF0aXZlIGV2ZW50cyBmcm9tIG5hbWVzcGFjZWQgZXZlbnRzICgnY2xpY2suYnMuYnV0dG9uJyAtLT4gJ2NsaWNrJylcclxuXHRldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxyXG5cdHJldHVybiBjdXN0b21FdmVudHNbZXZlbnRdIHx8IGV2ZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh5ZHJhdGVPYmoob2JqLCBtZXRhID0ge30pIHtcclxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhtZXRhKSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0b2JqW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb2JqXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjRj1xyXG4gKiBAdHlwZSB7e29uZSgqLCAqLCAqLCAqKTogdm9pZCwgdHJpZ2dlcigqLCAqLCAqKTogKG51bGx8KiksIG9mZigqLCAqLCAqLCAqKTogdm9pZCwgb24oKiwgKiwgKiwgKik6IHZvaWR9fVxyXG4gKi9cclxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xyXG5cdC8qKlxyXG5cdCAqINCf0YDQvtGB0LvRg9GI0LjQstCw0YLQtdC70Ywg0YHQvtCx0YvRgtC40LkgKNGN0LvQtdC80LXQvdGCLCDRgdC+0LHRi9GC0LjQtSAo0L/QvtC70L3Ri9C5INGB0L/QuNGB0L7QuiDRgdC80L7RgtGA0Lgg0LIg0LrQvtC90YHRgtCw0L3RgtC1IG5hdGl2ZUV2ZW50cywg0LjRgdGC0L7Rh9C90LjQuiDRgdC+0LHRi9GC0LjRjyDQuNC70Lgg0YXQtdC90LTQu9C10YAsINGE0YPQvdC60YbQuNGPINC+0LHRgNCw0YLQvdC+0LPQviDQstGL0LfQvtCy0LApKVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b24oZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBmYWxzZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5LCDQvdC+INC30LDQvNGL0LrQsNC10YLRgdGPINC4INCx0L7Qu9GM0YjQtSDQvdC1INC/0L7QstGC0L7RgNGP0LXRgtGB0Y8g0L3QsCDRjdC70LXQvNC10L3RgtC1XHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gaGFuZGxlclxyXG5cdCAqIEBwYXJhbSBkZWxlZ2F0aW9uRnVuY3Rpb25cclxuXHQgKi9cclxuXHRvbmUoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbikge1xyXG5cdFx0YWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCB0cnVlKVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCj0LTQsNC70LXQvdC40LUg0L7QsdGA0LDQsdC+0YLRh9C40LrQsFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b2ZmKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWxUeXBlRXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pXHJcblx0XHRjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcclxuXHRcdGNvbnN0IGV2ZW50cyA9IGdldEVsZW1lbnRFdmVudHMoZWxlbWVudClcclxuXHRcdGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cclxuXHRcdGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjYWxsYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly8gU2ltcGxlc3QgY2FzZTogaGFuZGxlciBpcyBwYXNzZWQsIHJlbW92ZSB0aGF0IGxpc3RlbmVyIE9OTFkuXHJcblx0XHRcdGlmICghT2JqZWN0LmtleXMoc3RvcmVFbGVtZW50RXZlbnQpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBjYWxsYWJsZSwgaXNEZWxlZ2F0ZWQgPyBoYW5kbGVyIDogbnVsbClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFtZXNwYWNlKSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudEV2ZW50IG9mIE9iamVjdC5rZXlzKGV2ZW50cykpIHtcclxuXHRcdFx0XHRyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMoZWxlbWVudCwgZXZlbnRzLCBlbGVtZW50RXZlbnQsIG9yaWdpbmFsVHlwZUV2ZW50LnNsaWNlKDEpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCBba2V5SGFuZGxlcnMsIGV2ZW50XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZUVsZW1lbnRFdmVudCkpIHtcclxuXHRcdFx0Y29uc3QgaGFuZGxlcktleSA9IGtleUhhbmRsZXJzLnJlcGxhY2Uoc3RyaXBVaWRSZWdleCwgJycpXHJcblxyXG5cdFx0XHRpZiAoIWluTmFtZXNwYWNlIHx8IG9yaWdpbmFsVHlwZUV2ZW50LmluY2x1ZGVzKGhhbmRsZXJLZXkpKSB7XHJcblx0XHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQuY2FsbGFibGUsIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvcilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqINCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGB0L7QsdGL0YLQuNGPLiDQn9C+0LTRgNC+0LHQvdC10LUg0YLRg9GCIGh0dHBzOi8vbGVhcm4uamF2YXNjcmlwdC5ydS9kaXNwYXRjaC1ldmVudHNcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBhcmdzXHJcblx0ICogQHJldHVybnMgeyp8bnVsbH1cclxuXHQgKi9cclxuXHR0cmlnZ2VyKGVsZW1lbnQsIGV2ZW50LCBhcmdzKSB7XHJcblx0XHRpZiAodHlwZW9mIGV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBidWJibGVzID0gdHJ1ZTtcclxuXHRcdGxldCBuYXRpdmVEaXNwYXRjaCA9IHRydWU7XHJcblx0XHRsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0IGV2dCA9IGh5ZHJhdGVPYmoobmV3IEV2ZW50KGV2ZW50LCB7IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUgfSksIGFyZ3MpXHJcblxyXG5cdFx0aWYgKGRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmF0aXZlRGlzcGF0Y2gpIHtcclxuXHRcdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZXZ0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXJcclxuIiwiaW1wb3J0IHtpc0VsZW1lbnQsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQnNCw0L3QuNC/0YPQu9GP0YbQuNC4INGBINCw0YLRgNC40LHRg9GC0LDQvNC4INGDINGN0LvQtdC80LXQvdGC0LA6XHJcbiAqIGdldCAo0Y3Qu9C10LzQtdC90YIsINC40LzRjywg0YTQu9Cw0LMgLSDQstGL0YDQtdC30LDRgtGMIGRhdGEtKSAtINC80LXRgtC+0LQg0LLRi9Cx0LjRgNCw0LXRgiDQt9C90LDRh9C10L3QuNC1INCw0YLRgNC40LHRg9GC0LAg0L/QviDQtdCz0L4g0LjQvNC10L3QuCwg0LXRgdC70Lgg0LIg0L/QvtC70LUg0LjQvNC10L3QuCDQv9C10YDQtdC00LDRgtGMICdkYXRhJyAtPiDQsdGD0LTRg9GCINCy0YvQsdGA0LDQvdGLINGC0L7Qu9GM0LrQviDQtNCw0YLQsCDQsNGC0YDQuNCx0YPRgtGLLCDQtdGB0LvQuCAnYWxsJyAtPiDQvNC10YLQvtC0INCy0LXRgNC90LXRgiDQt9C90LDRh9C10L3QuNC1INCy0YHQtdGFINCw0YLRgNC40LHRg9GC0L7QslxyXG4gKiBoYXMgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0LXRgdGC0Ywg0LvQuCDQsNGC0YDQuNCx0YPRgiDRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAqIHNldCAo0Y3Qu9C10LzQtdC90YIsINC40LzRjywg0LfQvdCw0YfQtdC90LjQtSkgLSDRg9GB0YLQsNC90L7QstC60LAg0YMg0Y3Qu9C10LzQtdC90YLQsCDQsNGC0YDQuNCx0YPRgtCwINC40LvQuCDQtdCz0L4g0LjQt9C80LXQvdC10L3QuNC1XHJcbiAqIHJlbW92ZSAo0Y3Qu9C10LzQtdC90YIsINC40LzRjykgLSDRg9C00LDQu9GP0LXRgiDQsNGC0YDQuNCx0YPRgiDRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAqL1xyXG5jb25zdCBNYW5pcHVsYXRvciA9IHtcclxuXHRnZXQoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSA9ICdkYXRhJywgaXNSZW1vdmVEYXRhTmFtZSA9IHRydWUpIHtcclxuXHRcdGlmICghZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4ge31cclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmFtZUF0dHJpYnV0ZSA9PT0gJ2RhdGEnKSB7XHJcblx0XHRcdGxldCBlbG1CYXNlID0gWydkYXRhLXZnLXRvZ2dsZScsICdkYXRhLXZnLXRhcmdldCcsICdkYXRhLXZnLWRpc21pc3MnXSxcclxuXHRcdFx0XHRhdHRyaWJ1dGVzID0ge307XHJcblxyXG5cdFx0XHRsZXQgYXJyID0gW10uZmlsdGVyLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gL15kYXRhLS8udGVzdChhdC5uYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoYXJyLmxlbmd0aCkge1xyXG5cdFx0XHRcdGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcblx0XHRcdFx0XHRsZXQgbmFtZSA9IHYubmFtZTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIWVsbUJhc2UuaW5jbHVkZXMobmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGlzUmVtb3ZlRGF0YU5hbWUpIG5hbWUgPSBuYW1lLnNsaWNlKDUpO1xyXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW25hbWVdID0gbm9ybWFsaXplRGF0YSh2LnZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYXR0cmlidXRlcztcclxuXHRcdH0gZWxzZSBpZiAobmFtZUF0dHJpYnV0ZSA9PT0gJ2FsbCcpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlTmFtZXMoKS5yZWR1Y2UoKGFjYywgbmFtZSkgPT4ge1xyXG5cdFx0XHRcdHJldHVybiB7Li4uYWNjLCBbbmFtZV06IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpfTtcclxuXHRcdFx0fSwge30pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGhhcyhlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0fSxcclxuXHJcblx0c2V0KGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KGVsZW1lbnQpICYmIG5hbWUpIHtcclxuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbW92ZShlbGVtZW50LCBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KGVsZW1lbnQpICYmIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0aGlkZShlbCkge1xyXG5cdFx0ZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHR9LFxyXG5cclxuXHRzaG93KGVsLCBzdGF0ZSA9ICdibG9jaycpIHtcclxuXHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBzdGF0ZTtcclxuXHR9LFxyXG59XHJcblxyXG5leHBvcnQge01hbmlwdWxhdG9yfVxyXG4iLCIvKipcclxuICog0KDQsNCx0L7RgtCwINGBIERPTVxyXG4gKiBAcGFyYW0gc2VsZWN0b3JcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5pbXBvcnQge2lzRWxlbWVudH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5cclxuY29uc3QgcGFyc2VTZWxlY3RvciA9IHNlbGVjdG9yID0+IHtcclxuXHRpZiAoc2VsZWN0b3IgJiYgd2luZG93LkNTUyAmJiB3aW5kb3cuQ1NTLmVzY2FwZSkge1xyXG5cdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8jKFteXFxzXCIjJ10rKS9nLCAobWF0Y2gsIGlkKSA9PiBgIyR7Q1NTLmVzY2FwZShpZCl9YClcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvclxyXG59XHJcblxyXG5jb25zdCBnZXRTZWxlY3RvciA9IGVsZW1lbnQgPT4ge1xyXG5cdGxldCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXZnLXRhcmdldCcpO1xyXG5cclxuXHRpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSAnIycpIHtcclxuXHRcdGxldCBocmVmQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuXHRcdGlmICghaHJlZkF0dHJpYnV0ZSB8fCAoIWhyZWZBdHRyaWJ1dGUuaW5jbHVkZXMoJyMnKSAmJiAhaHJlZkF0dHJpYnV0ZS5zdGFydHNXaXRoKCcuJykpKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnIycpKSB7XHJcblx0XHRcdGhyZWZBdHRyaWJ1dGUgPSBgIyR7aHJlZkF0dHJpYnV0ZS5zcGxpdCgnIycpWzFdfWA7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZWN0b3IgPSBocmVmQXR0cmlidXRlICYmIGhyZWZBdHRyaWJ1dGUgIT09ICcjJyA/IGhyZWZBdHRyaWJ1dGUudHJpbSgpIDogbnVsbDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzZWxlY3RvciA/IHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKHNlbCA9PiBwYXJzZVNlbGVjdG9yKHNlbCkpLmpvaW4oJywnKSA6IG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IFNlbGVjdG9ycyA9IHtcclxuXHRmaW5kKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRpZiAoaXNFbGVtZW50KHNlbGVjdG9yKSkge1xyXG5cdFx0XHRyZXR1cm4gc2VsZWN0b3I7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3Rvci5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRmaW5kQWxsKHNlbGVjdG9yLCBjb250YWluZXIgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBbXS5jb25jYXQoLi4uRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbC5jYWxsKGNvbnRhaW5lciwgc2VsZWN0b3IpKTtcclxuXHR9LFxyXG5cclxuXHRnZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudCk7XHJcblx0XHRpZiAoc2VsZWN0b3IpIHJldHVybiBTZWxlY3RvcnMuZmluZChzZWxlY3RvcikgPyBzZWxlY3RvciA6IG51bGxcclxuXHRcdHJldHVybiBudWxsXHJcblx0fSxcclxuXHJcblx0Z2V0RWxlbWVudEZyb21TZWxlY3RvcihlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIHNlbGVjdG9yID8gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IpIDogbnVsbFxyXG5cdH0sXHJcblxyXG5cdGdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KTtcclxuXHRcdHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9ycy5maW5kQWxsKHNlbGVjdG9yKSA6IFtdXHJcblx0fSxcclxuXHJcblx0cHJldihlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIHx8IG51bGxcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yczsiLCIvKipcclxuICog0J3QsNCx0L7RgCDRgdC60YDQuNC/0YLQvtCyINC00LvRjyDRiNC40YDQvtC60L7Qs9C+INC/0YDQuNC80LXQvdC10L3QuNGPXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCV0YHQu9C4INGH0YLQvi3QvdC40LHRg9C00Ywg0LIg0L7QsdGK0LXQutGC0LVcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRW1wdHlPYmoob2JqKSB7XHJcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcclxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogaXNFbGVtZW50XHJcbiAqIEBwYXJhbSBvYmplY3RcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSBvYmplY3QgPT4ge1xyXG5cdGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHlwZW9mIG9iamVjdC5ub2RlVHlwZSAhPT0gJ3VuZGVmaW5lZCdcclxufVxyXG5cclxuLyoqXHJcbiAqIGlzRGlzYWJsZWRcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0Rpc2FibGVkID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50IHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiBlbGVtZW50LmRpc2FibGVkICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuZGlzYWJsZWRcclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSAhPT0gJ2ZhbHNlJ1xyXG59XHJcblxyXG4vKipcclxuICogaXNWaXNpYmxlXHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtZW50KSB7XHJcblx0aWYgKCFpc0VsZW1lbnQoZWxlbWVudCkgfHwgZWxlbWVudC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRjb25zdCBlbGVtZW50SXNWaXNpYmxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xyXG5cdGNvbnN0IGNsb3NlZERldGFpbHMgPSBlbGVtZW50LmNsb3Nlc3QoJ2RldGFpbHM6bm90KFtvcGVuXSknKVxyXG5cclxuXHRpZiAoIWNsb3NlZERldGFpbHMpIHtcclxuXHRcdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcblx0fVxyXG5cclxuXHRpZiAoY2xvc2VkRGV0YWlscyAhPT0gZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc3VtbWFyeSA9IGVsZW1lbnQuY2xvc2VzdCgnc3VtbWFyeScpXHJcblx0XHRpZiAoc3VtbWFyeSAmJiBzdW1tYXJ5LnBhcmVudE5vZGUgIT09IGNsb3NlZERldGFpbHMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN1bW1hcnkgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWxlbWVudElzVmlzaWJsZVxyXG59XHJcblxyXG4vKipcclxuICogaXNPYmplY3RcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG5cdHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0L7QtNC40Lwg0LIg0L/QvtGA0Y/QtNC+0Log0YLQuNC/0Ysg0LTQsNC90L3Ri9GFXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkgIHtcclxuXHRpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xyXG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdH0gY2F0Y2gge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YLRiyDRgSDQvNCw0YHRgdC40LLQsFxyXG4gKiBAcGFyYW0gYXJyXHJcbiAqIEBwYXJhbSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudEFycmF5KGFyciwgZWwpIHtcclxuXHRyZXR1cm4gYXJyLmZpbHRlcigoaXRlbSkgPT4gIWVsLmluY2x1ZGVzKGl0ZW0pKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCT0LvRg9Cx0L7QutC+0LUg0L7QsdGK0LXQtNC40L3QtdC90LjQtSDQvtCx0YrQtdC60YLQvtCyXHJcbiAqIEBwYXJhbSBvYmplY3RzXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VEZWVwT2JqZWN0KC4uLm9iamVjdHMpIHtcclxuXHRjb25zdCBpc09iamVjdCA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcblxyXG5cdHJldHVybiBvYmplY3RzLnJlZHVjZSgocHJldiwgb2JqKSA9PiB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0Y29uc3QgcFZhbCA9IHByZXZba2V5XTtcclxuXHRcdFx0Y29uc3Qgb1ZhbCA9IG9ialtrZXldO1xyXG5cclxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocFZhbCkgJiYgQXJyYXkuaXNBcnJheShvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IHBWYWwuY29uY2F0KC4uLm9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGlzT2JqZWN0KHBWYWwpICYmIGlzT2JqZWN0KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gbWVyZ2VEZWVwT2JqZWN0KHBWYWwsIG9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG9WYWw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwcmV2O1xyXG5cdH0sIHt9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrXHJcbiAqIEBwYXJhbSBwb3NzaWJsZUNhbGxiYWNrXHJcbiAqIEBwYXJhbSBhcmdzXHJcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWVcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBleGVjdXRlKHBvc3NpYmxlQ2FsbGJhY2ssIGFyZ3MgPSBbXSwgZGVmYXVsdFZhbHVlID0gcG9zc2libGVDYWxsYmFjaykge1xyXG5cdHJldHVybiB0eXBlb2YgcG9zc2libGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IHBvc3NpYmxlQ2FsbGJhY2soLi4uYXJncykgOiBkZWZhdWx0VmFsdWVcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zaXRpb25cclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uRWxlbWVudFxyXG4gKiBAcGFyYW0gd2FpdEZvclRyYW5zaXRpb25cclxuICovXHJcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnO1xyXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDA7XHJcblxyXG5mdW5jdGlvbiBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uIChjYWxsYmFjaywgdHJhbnNpdGlvbkVsZW1lbnQsIHdhaXRGb3JUcmFuc2l0aW9uID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0aWYgKCF3YWl0Rm9yVHJhbnNpdGlvbikge1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0Y29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxyXG5cdGNvbnN0IGVtdWxhdGVkRHVyYXRpb24gPSB0aW1lT3V0TXMgPyB0aW1lT3V0TXMgOiBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0cmFuc2l0aW9uRWxlbWVudCkgKyBkdXJhdGlvblBhZGRpbmc7XHJcblxyXG5cdGxldCBjYWxsZWQgPSBmYWxzZVxyXG5cclxuXHRjb25zdCBoYW5kbGVyID0gKHsgdGFyZ2V0IH0pID0+IHtcclxuXHRcdGlmICh0YXJnZXQgIT09IHRyYW5zaXRpb25FbGVtZW50KSB7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNhbGxlZCA9IHRydWVcclxuXHRcdHRyYW5zaXRpb25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoVFJBTlNJVElPTl9FTkQsIGhhbmRsZXIpXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdH1cclxuXHJcblx0dHJhbnNpdGlvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdGlmICghY2FsbGVkKSB7XHJcblx0XHRcdHRyaWdnZXJUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25FbGVtZW50KVxyXG5cdFx0fVxyXG5cdH0sIGVtdWxhdGVkRHVyYXRpb24pXHJcbn1cclxuXHJcbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XHJcblx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcclxuXHRsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pXHJcblx0Y29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXHJcblxyXG5cdC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcclxuXHRpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xyXG5cdFx0cmV0dXJuIDBcclxuXHR9XHJcblxyXG5cdC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcclxuXHR0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXVxyXG5cdHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXHJcblxyXG5cdHJldHVybiAoTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKSArIE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSkpICogTUlMTElTRUNPTkRTX01VTFRJUExJRVJcclxufVxyXG5cclxuY29uc3QgdHJpZ2dlclRyYW5zaXRpb25FbmQgPSBlbGVtZW50ID0+IHtcclxuXHRlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0YDRjtC6INC00LvRjyDQv9C10YDQtdC30LDQv9GD0YHQutCwINCw0L3QuNC80LDRhtC40Lgg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm4gdm9pZFxyXG4gKlxyXG4gKiBA0YHQvNC+0YLRgNC4IGh0dHBzOi8vd3d3LmNoYXJpc3RoZW8uaW8vYmxvZy8yMDIxLzAyL3Jlc3RhcnQtYS1jc3MtYW5pbWF0aW9uLXdpdGgtamF2YXNjcmlwdC8jcmVzdGFydGluZy1hLWNzcy1hbmltYXRpb25cclxuICovXHJcbmNvbnN0IHJlZmxvdyA9IGVsZW1lbnQgPT4ge1xyXG5cdGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBOb29wXHJcbiAqL1xyXG5jb25zdCBub29wID0gKCkgPT4ge307XHJcblxyXG4vKipcclxuICog0JPQtdC90LXRgNCw0YbQuNGPINGB0LvRg9GH0LDQudC90L7QuSDRgdGC0YDQvtC60LhcclxuICovXHJcbmZ1bmN0aW9uIG1ha2VSYW5kb21TdHJpbmcobGVuZ3RoID0gNykge1xyXG5cdGxldCByZXN1bHQgPSAnJztcclxuXHRjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcclxuXHRjb25zdCBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XHJcblx0bGV0IGNvdW50ZXIgPSAwO1xyXG5cdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XHJcblx0XHRyZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xyXG5cdFx0Y291bnRlciArPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog0KLRgNCw0L3RgdC70LjRgtC10YDQsNGG0LjRjyDRgdC40LzQstC+0LvQvtCyINGBINC70LDRgtC40L3QuNGG0Ysg0L3QsCDQutC40YDQuNC70LvQuNGG0YMg0Lgg0L7QsdGA0LDRgtC90L5cclxuICogQHBhcmFtIHRleHRcclxuICogQHBhcmFtIGVuVG9SdVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIHRyYW5zbGl0ZXJhdGUodGV4dCwgZW5Ub1J1KSB7XHJcblx0bGV0IHJ1ID0gXCLQuSDRhiDRgyDQuiDQtSDQvSDQsyDRiCDRiSDQtyDRhSDRiiDRhCDRiyDQsiDQsCDQvyDRgCDQviDQuyDQtCDQtiDRjSDRjyDRhyDRgSDQvCDQuCDRgiDRjCDQsSDRjlwiLnNwbGl0KC8gKy9nKTtcclxuXHRsZXQgZW4gPSBcInEgdyBlIHIgdCB5IHUgaSBvIHAgWyBdIGEgcyBkIGYgZyBoIGogayBsIDsgJyB6IHggYyB2IGIgbiBtICwgLlwiLnNwbGl0KC8gKy9nKTtcclxuXHRsZXQgeDtcclxuXHJcblx0Zm9yICh4ID0gMDsgeCA8IHJ1Lmxlbmd0aDsgeCsrKSB7XHJcblx0XHR0ZXh0ID0gdGV4dC5zcGxpdChlblRvUnUgPyBlblt4XSA6IHJ1W3hdKS5qb2luKGVuVG9SdSA/IHJ1W3hdIDogZW5beF0pO1xyXG5cdFx0dGV4dCA9IHRleHQuc3BsaXQoZW5Ub1J1ID8gZW5beF0udG9VcHBlckNhc2UoKSA6IHJ1W3hdLnRvVXBwZXJDYXNlKCkpLmpvaW4oZW5Ub1J1ID8gcnVbeF0udG9VcHBlckNhc2UoKSA6IGVuW3hdLnRvVXBwZXJDYXNlKCkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRleHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuY29uc3QgaXNSVEwgPSAoKSA9PiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZGlyID09PSAncnRsJ1xyXG5cclxuZXhwb3J0IHtpc0VsZW1lbnQsIGlzVmlzaWJsZSwgaXNEaXNhYmxlZCwgaXNPYmplY3QsIGlzRW1wdHlPYmosIG1lcmdlRGVlcE9iamVjdCwgcmVtb3ZlRWxlbWVudEFycmF5LCBub3JtYWxpemVEYXRhLCBleGVjdXRlLCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCByZWZsb3csIG5vb3AsIG1ha2VSYW5kb21TdHJpbmcsIGlzUlRMLCB0cmFuc2xpdGVyYXRlfSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC91dGlscy9zY3NzL2RlZmF1bHQuc2Nzc1wiO1xyXG5cclxuLy8gc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL2pzL3Znc2lkZWJhclwiO1xyXG5cclxuLy8gY29sbGFwc2VcclxuaW1wb3J0IFZHQ29sbGFwc2UgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdjb2xsYXBzZS9qcy92Z2NvbGxhcHNlXCI7XHJcblxyXG4vLyBuYXZcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3NcIjtcclxuaW1wb3J0IFZHTmF2IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2XCI7XHJcblxyXG4vLyBkcm9wZG93blxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vc2Nzcy92Z2Ryb3Bkb3duLnNjc3NcIjtcclxuaW1wb3J0IFZHRHJvcGRvd24gZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9qcy92Z2Ryb3Bkb3duXCI7XHJcblxyXG4vLyBtb2RhbFxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnbW9kYWwvc2Nzcy92Z21vZGFsLnNjc3NcIjtcclxuaW1wb3J0IFZHTW9kYWwgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdtb2RhbC9qcy92Z21vZGFsXCI7XHJcblxyXG4vLyBmb3JtIHNlbmRlclxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9zY3NzL3ZnZm9ybXNlbmRlci5zY3NzXCI7XHJcbmltcG9ydCBWR0Zvcm1TZW5kZXIgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL2pzL3ZnZm9ybXNlbmRlclwiO1xyXG5cclxuLy8gcm9sbHVwXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdyb2xsdXAvc2Nzcy92Z3JvbGx1cC5zY3NzXCI7XHJcbmltcG9ydCBWR1JvbGx1cCBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z3JvbGx1cC9qcy92Z3JvbGx1cFwiO1xyXG5cclxuLy8gbGF3IGNvb2tpZVxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnbGF3Y29va2llL3Njc3MvdmdsYXdjb29raWUuc2Nzc1wiO1xyXG5pbXBvcnQgVkdMYXdDb29raWUgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdsYXdjb29raWUvanMvdmdsYXdjb29raWVcIjtcclxuXHJcbi8vIHNlbGVjdFxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3Znc2VsZWN0L3Njc3MvdmdzZWxlY3Quc2Nzc1wiO1xyXG5pbXBvcnQgVkdTZWxlY3QgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmdzZWxlY3QvanMvdmdzZWxlY3RcIjtcclxuXHJcbi8vIGFsZXJ0XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdhbGVydC9zY3NzL3ZnYWxlcnQuc2Nzc1wiO1xyXG5pbXBvcnQgVkdBbGVydCBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2FsZXJ0L2pzL3ZnYWxlcnRcIjtcclxuXHJcbi8vIHRvYXN0XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmd0b2FzdC9zY3NzL3ZndG9hc3Quc2Nzc1wiO1xyXG5pbXBvcnQgVkdUb2FzdCBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z3RvYXN0L2pzL3ZndG9hc3RcIjtcclxuXHJcbmV4cG9ydCB7XHJcblx0VkdTaWRlYmFyLCBWR0NvbGxhcHNlLCBWR05hdiwgVkdEcm9wZG93biwgVkdNb2RhbCwgVkdGb3JtU2VuZGVyLCBWR1JvbGx1cCwgVkdMYXdDb29raWUsIFZHU2VsZWN0LCBWR0FsZXJ0LCBWR1RvYXN0XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9