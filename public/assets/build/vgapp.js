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
      timeout: 50,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeGZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pSQTtBQUNBO0FBUUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDelhBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUN2REE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDM0NBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7OztBQ2pIQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFtREE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDM1VBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNyU0E7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy9iYXNlLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL21vZHVsZS1mbi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnYWxlcnQvanMvdmdhbGVydC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnY29sbGFwc2UvanMvdmdjb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZHJvcGRvd24vanMvdmdkcm9wZG93bi5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnZm9ybXNlbmRlci9qcy92Z2Zvcm1zZW5kZXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2xhd2Nvb2tpZS9qcy92Z2xhd2Nvb2tpZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbW9kYWwvanMvdmdtb2RhbC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3ZnbmF2L2pzL3ZnbmF2LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdyb2xsdXAvanMvdmdyb2xsdXAuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3NlbGVjdC9qcy92Z3NlbGVjdC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Znc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3RvYXN0L2pzL3ZndG9hc3QuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL292ZXJmbG93LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcGFyYW1zLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcGxhY2VtZW50LmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2NvbXBvbmVudHMvcmVzcG9uc2l2ZS5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9jb21wb25lbnRzL3Njcm9sbGJhci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vY29va2llLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9kYXRhLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL2pzL2RvbS9ldmVudC5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9kb20vbWFuaXB1bGF0b3IuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvdXRpbHMvanMvZG9tL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC91dGlscy9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2FsZXJ0L3Njc3MvdmdhbGVydC5zY3NzPzUwYmQiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzP2U4MjUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvc2Nzcy92Z2Zvcm1zZW5kZXIuc2Nzcz82OTEyIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdsYXdjb29raWUvc2Nzcy92Z2xhd2Nvb2tpZS5zY3NzP2RkNDUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z21vZGFsL3Njc3Mvdmdtb2RhbC5zY3NzPzEyODkiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z25hdi9zY3NzL3ZnbmF2LnNjc3M/MTliYyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9tb2R1bGVzL3Zncm9sbHVwL3Njc3Mvdmdyb2xsdXAuc2Nzcz8zNTI2Iiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmdzZWxlY3Qvc2Nzcy92Z3NlbGVjdC5zY3NzPzBmYmUiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2Nzcz81YWNkIiwid2VicGFjazovL3ZnLy4vYXBwL21vZHVsZXMvdmd0b2FzdC9zY3NzL3ZndG9hc3Quc2Nzcz8xODg5Iiwid2VicGFjazovL3ZnLy4vYXBwL3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzP2M2MzQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY3V0ZSwgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiwgaXNFbXB0eU9ian0gZnJvbSBcIi4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBEYXRhIGZyb20gXCIuLi91dGlscy9qcy9kb20vZGF0YVwiO1xyXG5pbXBvcnQgUGFyYW1zIGZyb20gXCIuLi91dGlscy9qcy9jb21wb25lbnRzL3BhcmFtc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtBamF4LCBnZXRTVkd9IGZyb20gXCIuL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgQW5pbWF0aW9uIGZyb20gXCIuLi91dGlscy9qcy9jb21wb25lbnRzL2FuaW1hdGlvblwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm5cclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoZWxlbWVudCk7XHJcblx0XHRpZiAoIXRoaXMuX2VsZW1lbnQpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ci0L7QstCw0YDQuNGJISDQn9C10YDQstGL0Lkg0L/QsNGA0LDQvNC10YLRgCDQvdC1INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQv9GD0YHRgtGL0LwhJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0ge307XHJcblx0XHREYXRhLnNldCh0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLk5BTUVfS0VZLCB0aGlzKTtcclxuXHR9XHJcblxyXG5cdF9nZXRQYXJhbXMoZWxlbWVudCwgcGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gbmV3IFBhcmFtcyhwYXJhbXMsIGVsZW1lbnQpLmdldCgpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdERhdGEucmVtb3ZlKHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuTkFNRV9LRVkpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9mZih0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkVWRU5UX0tFWSlcclxuXHJcblx0XHRmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0aGlzW3Byb3BlcnR5TmFtZV0gPSBudWxsXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcm91dGUoY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGxldCAkY29udGVudCA9IG51bGw7XHJcblxyXG5cdFx0Y29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XHJcblx0XHRcdGlmICgkY29udGVudCkgJGNvbnRlbnQuaW5uZXJIVE1MID0gZGF0YTtcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5fcGFyYW1zLmhhc093blByb3BlcnR5KCdhamF4JykpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghX3RoaXMuX3BhcmFtcy5hamF4LnJvdXRlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISdtZXRob2QnIGluIF90aGlzLl9wYXJhbXMuYWpheCkge1xyXG5cdFx0XHRfdGhpcy5fcGFyYW1zLmFqYXgubWV0aG9kID0gJ2dldCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCd0YXJnZXQnIGluIF90aGlzLl9wYXJhbXMuYWpheCAmJiBfdGhpcy5fcGFyYW1zLmFqYXgudGFyZ2V0KSB7XHJcblx0XHRcdCRjb250ZW50ID0gU2VsZWN0b3JzLmZpbmQoX3RoaXMuX3BhcmFtcy5hamF4LnRhcmdldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdsb2FkZXInIGluIF90aGlzLl9wYXJhbXMuYWpheCAmJiBfdGhpcy5fcGFyYW1zLmFqYXgubG9hZGVyKSB7XHJcblx0XHRcdHNldERhdGEoJzxkaXYgY2xhc3M9XCJ2Zy1sb2FkZXJcIj48L2Rpdj4nKTtcclxuXHRcdH1cclxuXHJcblx0XHRBamF4W190aGlzLl9wYXJhbXMuYWpheC5tZXRob2RdKF90aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSwgX3RoaXMuX3BhcmFtcy5hamF4LmRhdGEgfHwge30sIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0c2V0RGF0YShkYXRhLnJlc3BvbnNlKTtcclxuXHRcdFx0ZXhlY3V0ZShjYWxsYmFjaywgW3N0YXR1cywgZGF0YV0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfZGlzbWlzc0VsZW1lbnQoKSB7XHJcblx0XHRsZXQgY3Jvc3MgPSBnZXRTVkcoJ2Nyb3NzJyksXHJcblx0XHRcdGJ1dHRvbiA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvcignLnZnLWJ0bi1jbG9zZScpO1xyXG5cclxuXHRcdGlmIChidXR0b24pIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuXHRcdFx0aWYgKCFzdmcpIGJ1dHRvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNyb3NzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9xdWV1ZUNhbGxiYWNrKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkID0gdHJ1ZSwgdGltZU91dE1zKSB7XHJcblx0XHRleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkLCB0aW1lT3V0TXMpO1xyXG5cdH1cclxuXHJcblx0X2FuaW1hdGlvbihlbGVtZW50LCBrZXksIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRuZXcgQW5pbWF0aW9uKGVsZW1lbnQsIGtleSwgcGFyYW1zKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gRGF0YS5nZXQoU2VsZWN0b3JzLmZpbmQoZWxlbWVudCksIHRoaXMuTkFNRV9LRVkpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoZWxlbWVudCkgfHwgbmV3IHRoaXMoZWxlbWVudCwgIWlzRW1wdHlPYmoocGFyYW1zKSA/IHBhcmFtcyA6IHt9KVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBEQVRBX0tFWSgpIHtcclxuXHRcdHJldHVybiBgdmcuJHt0aGlzLk5BTUV9YFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBFVkVOVF9LRVkoKSB7XHJcblx0XHRyZXR1cm4gYC4ke3RoaXMuREFUQV9LRVl9YFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTsiLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc0VtcHR5T2JqfSBmcm9tIFwiLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQotGD0YIg0YHQvtCx0YDQsNC90Ysg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGB0LrRgNC40L/RgtGLINC00LvRjyDRgNCw0LHQvtGC0Ysg0LzQvtC00YPQu9C10LlcclxuICovXHJcblxyXG4vKipcclxuICog0J3QsNCx0L7RgCBzdmcg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEByZXR1cm5zIHsqfHt9fVxyXG4gKi9cclxuY29uc3QgZ2V0U1ZHID0gKG5hbWUpID0+IHtcclxuXHRjb25zdCBzdmcgPSAge1xyXG5cdFx0ZXJyb3I6ICc8c3ZnICB2aWV3Qm94PVwiMCAwIDg3IDg3XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48ZyBpZD1cInVpLXN1Y2Nlc3NcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxnIGlkPVwiR3JvdXAtMlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApXCI+PGNpcmNsZSBpZD1cIk92YWwtMlwiIHN0cm9rZT1cInJnYmEoMjUyLCAxOTEsIDE5MSwgLjUpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLWVycm9yLWNpcmNsZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCI0XCIgY3g9XCI0MS41XCIgY3k9XCI0MS41XCIgcj1cIjQxLjVcIj48L2NpcmNsZT48cGF0aCBjbGFzcz1cInVpLWVycm9yLWxpbmUxXCIgZD1cIk0yMi4yNDQyMjQsMjIgTDYwLjQyNzk5MDIsNjAuMTgzNzY2MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PHBhdGggY2xhc3M9XCJ1aS1lcnJvci1saW5lMlwiIGQ9XCJNNjAuNzU1Nzc2LDIxIEwyMy4yNDQyMjQsNTkuODQ0MzQ5MlwiIGlkPVwiTGluZVwiIHN0cm9rZT1cIiNGNzQ0NDRcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4nLFxyXG5cdFx0c3VjY2VzczogJzxzdmcgdmlld0JveD1cIjAgMCA4NyA4N1wiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGcgaWQ9XCJ1aS1lcnJvclwiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgxMTcsIDE4MywgMTUyLCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSAgY2xhc3M9XCJ1aS1zdWNjZXNzLWNpcmNsZVwiIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBjeD1cIjQxLjVcIiBjeT1cIjQxLjVcIiByPVwiNDEuNVwiPjwvY2lyY2xlPjxwb2x5bGluZSBjbGFzcz1cInVpLXN1Y2Nlc3MtcGF0aFwiIGlkPVwiUGF0aC0yXCIgc3Ryb2tlPVwiI0E1REM4NlwiIHN0cm9rZS13aWR0aD1cIjRcIiBwb2ludHM9XCIxOSAzOC44MDM2ODEzIDMxLjEwMjA3NDQgNTQuODA0Njg3NSA2My4yOTkyMjEgMjhcIj48L3BvbHlsaW5lPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdHdhaXRpbmc6ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODcgODdcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnIGlkPVwidWktd2FpdGluZ1wiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgaWQ9XCJHcm91cC0zXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMClcIj48Y2lyY2xlIGlkPVwiT3ZhbC0yXCIgc3Ryb2tlPVwicmdiYSgyNTUsIDIxOCwgMTA2LCAwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PGNpcmNsZSBjbGFzcz1cInVpLXdhaXRpbmctY2lyY2xlXCIgaWQ9XCJPdmFsLTJcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIGN4PVwiNDEuNVwiIGN5PVwiNDEuNVwiIHI9XCI0MS41XCI+PC9jaXJjbGU+PHBhdGggY2xhc3M9XCJ1aS13YWl0aW5nLWxpbmUxXCIgZD1cIk00MyA2M0M1NC41OTggNjMgNjQgNTMuNTk4IDY0IDQyQzY0IDMwLjQwMiA1NC41OTggMjEgNDMgMjFDMzEuNDAyIDIxIDIyIDMwLjQwMiAyMiA0MkMyMiA1My41OTggMzEuNDAyIDYzIDQzIDYzWlwiIHN0cm9rZS13aWR0aD1cIjNcIiBzdHJva2U9XCIjZmZkYTZhXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjxwYXRoIGNsYXNzPVwidWktd2FpdGluZy1saW5lMlwiIGQ9XCJNNDAuNjY2NyAzMi42NjQxVjQ0LjMzMDdINTIuMzMzNFwiIHN0cm9rZT1cIiNmZmRhNmFcIiBzdHJva2Utd2lkdGg9XCIzXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjwvZz48L2c+PC9zdmc+JyxcclxuXHRcdGRvdHM6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJiaSBiaS10aHJlZS1kb3RzLXZlcnRpY2FsXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOS41IDEzYTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwem0wLTVhMS41IDEuNSAwIDEgMS0zIDAgMS41IDEuNSAwIDAgMSAzIDB6bTAtNWExLjUgMS41IDAgMSAxLTMgMCAxLjUgMS41IDAgMCAxIDMgMHpcIi8+PC9zdmc+JyxcclxuXHRcdGNyb3NzOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDIyNC41MTIgMjI0LjUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBvbHlnb24gcG9pbnRzPVwiMjI0LjUwNyw2Ljk5NyAyMTcuNTIxLDAgMTEyLjI1NiwxMDUuMjU4IDYuOTk4LDAgMC4wMDUsNi45OTcgMTA1LjI2MywxMTIuMjU0IDAuMDA1LDIxNy41MTIgNi45OTgsMjI0LjUxMiAxMTIuMjU2LDExOS4yNCAyMTcuNTIxLDIyNC41MTIgMjI0LjUwNywyMTcuNTEyIDExOS4yNDksMTEyLjI1NCBcIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPidcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gc3ZnW25hbWVdID8/IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLQtdGI0LDQtdC8INGB0L7QsdGL0YLQuNC1IFwi0JfQsNC60YDRi9GC0YxcIiDQvdCwINCy0YHQtSDQvNC+0LTQsNC70LrQuCwg0YHQsNC50LTQsdCw0YDRiyDQuCDRgi7Qvy5cclxuICogQHBhcmFtIG1vZHVsZVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqL1xyXG5jb25zdCBkaXNtaXNzVHJpZ2dlciA9IChtb2R1bGUsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xyXG5cdGNvbnN0IGNsaWNrRXZlbnQgPSBgY2xpY2suZGlzbWlzcy4ke21vZHVsZS5FVkVOVF9LRVl9YFxyXG5cdGNvbnN0IG5hbWUgPSBtb2R1bGUuTkFNRTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBjbGlja0V2ZW50LCBgW2RhdGEtdmctZGlzbWlzcz1cIiR7bmFtZX1cIl1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpIHx8IHRoaXMuY2xvc2VzdChgLnZnLSR7bmFtZX1gKTtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gbW9kdWxlLmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0KTtcclxuXHJcblx0XHRpbnN0YW5jZVttZXRob2RdKCk7XHJcblx0fSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEFKQVggUkVRVUVTVFxyXG4gKiBAdHlwZSB7e3Bvc3Q6IGFqYXgucG9zdCwgZ2V0OiBhamF4LmdldCwgeDogKChmdW5jdGlvbigpOiAoWE1MSHR0cFJlcXVlc3QpKXwqKSwgc2VuZDogYWpheC5zZW5kfX1cclxuICovXHJcbmNvbnN0IEFqYXggPSB7XHJcblx0eDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHZlcnNpb25zID0gW1xyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjYuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjUuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjQuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjMuMFwiLFxyXG5cdFx0XHRcIk1TWE1MMi5YbWxIdHRwLjIuMFwiLFxyXG5cdFx0XHRcIk1pY3Jvc29mdC5YbWxIdHRwXCJcclxuXHRcdF07XHJcblxyXG5cdFx0bGV0IHhocjtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCh2ZXJzaW9uc1tpXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHhocjtcclxuXHR9LFxyXG5cclxuXHRzZW5kOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBhc3luYykge1xyXG5cdFx0aWYgKGFzeW5jID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0YXN5bmMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHggPSBBamF4LngoKTtcclxuXHRcdHgub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG5cdFx0eC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHguc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjYXNlIDIwMDpcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ3N1Y2Nlc3MnLCB7dGV4dDogeC5zdGF0dXNUZXh0LCByZXNwb25zZTogeC5yZXNwb25zZVRleHQsIGNvZGU6IHguc3RhdHVzfSlcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnZXJyb3InLCB7dGV4dDogeC5zdGF0dXNUZXh0LCByZXNwb25zZTogeC5yZXNwb25zZVRleHQsIGNvZGU6IHguc3RhdHVzfSlcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0eC5zZW5kKGRhdGEpXHJcblx0fSxcclxuXHJcblx0Z2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYWxsYmFjaywgYXN5bmMpIHtcclxuXHRcdGxldCBxdWVyeSA9IFtdO1xyXG5cclxuXHRcdGlmICghaXNFbXB0eU9iaihkYXRhKSkge1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgb2YgZGF0YSkge1xyXG5cdFx0XHRcdHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleVswXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5WzFdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdEFqYXguc2VuZCh1cmwgKyAocXVlcnkubGVuZ3RoID8gJz8nICsgcXVlcnkuam9pbignJicpIDogJycpLCBjYWxsYmFjaywgJ0dFVCcsIG51bGwsIGFzeW5jKVxyXG5cdH0sXHJcblxyXG5cdHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNhbGxiYWNrLCBhc3luYykge1xyXG5cdFx0QWpheC5zZW5kKHVybCwgY2FsbGJhY2ssICdQT1NUJywgZGF0YSwgYXN5bmMpXHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuXHRkaXNtaXNzVHJpZ2dlciwgQWpheCwgZ2V0U1ZHXHJcbn0iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IHtleGVjdXRlLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnYWxlcnQnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5hbGVydCc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwiYWxlcnRcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX09QRU4gPSAndmctYWxlcnQtb3Blbic7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiAgPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCAgPSBgJHtOQU1FX0tFWX0ubG9hZGVkYDtcclxuY29uc3QgRVZFTlRfS0VZX0NPTkZJUk0gPSBgJHtOQU1FX0tFWX0uY29uZmlybWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DQU5DRUwgID0gYCR7TkFNRV9LRVl9LmNhbmNlbGA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHQWxlcnQgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdG92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0Y29uZmlybTogdHJ1ZSxcclxuXHRcdFx0c2hvd0luc2lkZTogdHJ1ZSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JyxcclxuXHRcdFx0ZWxlbWVudHM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQndGl0bGUnOiAn0JLRiyDRg9Cy0LXRgNC10L3Riz8nLFxyXG5cdFx0XHRcdFx0J2VsZW1lbnQnOiAnYnV0dG9uJyxcclxuXHRcdFx0XHRcdCd0eXBlJzogJ2NvbmZpcm0nLFxyXG5cdFx0XHRcdFx0J2NsYXNzZXMnOiBbJ2J0bicsICdidG4tcHJpbWFyeSddXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdLFxyXG5cdFx0XHRhbmltYXRpb246IHtcclxuXHRcdFx0XHRlbmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdGluOiAnYW5pbWF0ZV9fcm9sbEluJyxcclxuXHRcdFx0XHRvdXQ6ICdhbmltYXRlX19yb2xsT3V0JyxcclxuXHRcdFx0XHRkZWxheTogODAwLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0XHRsb2FkZXI6IGZhbHNlLFxyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnQoKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5ID0gIXRoaXMuX3BhcmFtcy5hbmltYXRpb24uZW5hYmxlID8gMCA6IHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXk7XHJcblx0XHR0aGlzLl9hbmltYXRpb24odGhpcy5fZWxlbWVudCwgVkdBbGVydC5OQU1FX0tFWSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbik7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBydW4odGV4dCwgcGFyYW1zID0ge30sIGNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gVkdBbGVydC5idWlsZCh0ZXh0LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZCh0ZXh0LCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0XHRwYXJhbXMgPSBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHR0aGVtZTogJ2RlZmF1bHQnLFxyXG5cdFx0fSwgcGFyYW1zKTtcclxuXHJcblx0XHRsZXQgdGFyZ2V0O1xyXG5cclxuXHRcdGxldCBpbnN0YW5jZSA9ICBWR0FsZXJ0LmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0LCBwYXJhbXMpO1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaywgW2luc3RhbmNlXSk7XHJcblx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LmtleSAhPT0gJ0VzY2FwZScpIHJldHVybjtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRClcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdBbGVydCk7XHJcblxyXG4vKipcclxuICogRGF0YSBBUEkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHQWxlcnQ7XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge21lcmdlRGVlcE9iamVjdCwgcmVmbG93fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnY29sbGFwc2UnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTRSA9ICd2Zy1jb2xsYXBzZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ09MTEFQU0lORyA9ICd2Zy1jb2xsYXBzaW5nJztcclxuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTRUQgPSAndmctY29sbGFwc2VkJztcclxuY29uc3QgQ0xBU1NfTkFNRV9ERUVQRVJfQ0hJTERSRU4gPSBgOnNjb3BlIC4ke0NMQVNTX05BTUVfQ09MTEFQU0V9IC4ke0NMQVNTX05BTUVfQ09MTEFQU0V9YDtcclxuXHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFPSAnW2RhdGEtdmctdG9nZ2xlPVwiY29sbGFwc2VcIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9BQ1RJVkVTID0gJy5jb2xsYXBzZS5zaG93LCAuY29sbGFwc2UuY29sbGFwc2luZyc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHQ29sbGFwc2UgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0c3VwZXIoZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0dG9nZ2xlOiB0cnVlLFxyXG5cdFx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnLFxyXG5cdFx0XHRcdGxvYWRlcjogZmFsc2UsXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlXHJcblx0XHR0aGlzLl90cmlnZ2VyQXJyYXkgPSBbXVxyXG5cclxuXHRcdGNvbnN0IHRvZ2dsZUxpc3QgPSBTZWxlY3RvcnMuZmluZEFsbChTRUxFQ1RPUl9EQVRBX1RPR0dMRSk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCBlbGVtIG9mIHRvZ2dsZUxpc3QpIHtcclxuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBTZWxlY3RvcnMuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtKTtcclxuXHRcdFx0Y29uc3QgZmlsdGVyRWxlbWVudCA9IFNlbGVjdG9ycy5maW5kQWxsKHNlbGVjdG9yKS5maWx0ZXIoZm91bmRFbGVtZW50ID0+IGZvdW5kRWxlbWVudCA9PT0gdGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0XHRpZiAoc2VsZWN0b3IgIT09IG51bGwgJiYgZmlsdGVyRWxlbWVudC5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzLl90cmlnZ2VyQXJyYXkucHVzaChlbGVtKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5faW5pdGlhbGl6ZUNoaWxkcmVuKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMucGFyZW50KSB7XHJcblx0XHRcdHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl90cmlnZ2VyQXJyYXksIHRoaXMuX2lzU2hvd24oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy50b2dnbGUpIHtcclxuXHRcdFx0dGhpcy50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHJldHVybiAhdGhpcy5faXNTaG93bigpID8gdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8IF90aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHRsZXQgYWN0aXZlQ2hpbGRyZW4gPSBbXTtcclxuXHJcblx0XHRpZiAoX3RoaXMuX3BhcmFtcy5wYXJlbnQpIHtcclxuXHRcdFx0YWN0aXZlQ2hpbGRyZW4gPSB0aGlzLl9nZXRGaXJzdExldmVsQ2hpbGRyZW4oU0VMRUNUT1JfQUNUSVZFUylcclxuXHRcdFx0XHQuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudClcclxuXHRcdFx0XHQubWFwKGVsZW1lbnQgPT4gVkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHsgdG9nZ2xlOiBmYWxzZSB9KSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGFjdGl2ZUNoaWxkcmVuLmxlbmd0aCAmJiBhY3RpdmVDaGlsZHJlblswXS5faXNUcmFuc2l0aW9uaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3Qgc3RhcnRFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVyk7XHJcblx0XHRpZiAoc3RhcnRFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0Zm9yIChjb25zdCBhY3RpdmVJbnN0YW5jZSBvZiBhY3RpdmVDaGlsZHJlbikge1xyXG5cdFx0XHRhY3RpdmVJbnN0YW5jZS5oaWRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNFKVxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNJTkcpXHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gMDtcclxuXHJcblx0XHRfdGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKF90aGlzLl90cmlnZ2VyQXJyYXksIHRydWUpO1xyXG5cdFx0X3RoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcblxyXG5cdFx0X3RoaXMuX3JvdXRlKCk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdF90aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNFLCBDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04pO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlLCBfdGhpcy5fZWxlbWVudCwgdHJ1ZSk7XHJcblxyXG5cdFx0Y29uc3Qgc2Nyb2xsU2l6ZSA9IGBzY3JvbGxIZWlnaHRgO1xyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7X3RoaXMuX2VsZW1lbnRbc2Nyb2xsU2l6ZV19cHhgO1xyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMuX2lzVHJhbnNpdGlvbmluZyB8fCAhX3RoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHN0YXJ0RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpXHJcblx0XHRpZiAoc3RhcnRFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHR9cHhgO1xyXG5cdFx0cmVmbG93KF90aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0lORyk7XHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0UsIENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0cmlnZ2VyIG9mIF90aGlzLl90cmlnZ2VyQXJyYXkpIHtcclxuXHRcdFx0Y29uc3QgZWxlbWVudCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRyaWdnZXIpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgIV90aGlzLl9pc1Nob3duKGVsZW1lbnQpKSB7XHJcblx0XHRcdFx0X3RoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhbdHJpZ2dlcl0sIGZhbHNlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSB0cnVlXHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNJTkcpO1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0UpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgX3RoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModHJpZ2dlckFycmF5LCBpc09wZW4pIHtcclxuXHRcdGlmICghdHJpZ2dlckFycmF5Lmxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdHJpZ2dlckFycmF5KSB7XHJcblx0XHRcdHRoaXMuX2NoYW5nZVN0YXRlQnV0dG9uKGVsZW1lbnQsIGlzT3Blbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfaW5pdGlhbGl6ZUNoaWxkcmVuKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMucGFyZW50KSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSB0aGlzLl9nZXRGaXJzdExldmVsQ2hpbGRyZW4oU0VMRUNUT1JfREFUQV9UT0dHTEUpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBjaGlsZHJlbikge1xyXG5cdFx0XHRjb25zdCBzZWxlY3RlZCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpXHJcblxyXG5cdFx0XHRpZiAoc2VsZWN0ZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoW2VsZW1lbnRdLCB0aGlzLl9pc1Nob3duKHNlbGVjdGVkKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2dldEZpcnN0TGV2ZWxDaGlsZHJlbihzZWxlY3Rvcikge1xyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSBTZWxlY3RvcnMuZmluZChDTEFTU19OQU1FX0RFRVBFUl9DSElMRFJFTiwgdGhpcy5fcGFyYW1zLnBhcmVudCk7XHJcblx0XHRyZXR1cm4gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IsIHRoaXMuX3BhcmFtcy5wYXJlbnQpLmZpbHRlcihlbGVtZW50ID0+ICFjaGlsZHJlbi5pbmNsdWRlcyhlbGVtZW50KSk7XHJcblx0fVxyXG5cclxuXHRfY2hhbmdlU3RhdGVCdXR0b24oZWxlbWVudCwgaXNPcGVuKSB7XHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfTkFNRV9DT0xMQVBTRUQsICFpc09wZW4pO1xyXG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pO1xyXG5cdFx0ZWxlbWVudC5pbm5lckhUTUwgPSBNYW5pcHVsYXRvci5nZXQoZWxlbWVudCwgYGRhdGEtJHtpc09wZW4gPyAnaGlkZScgOiAnc2hvdyd9LXRleHRgKSB8fCBlbGVtZW50LmlubmVySFRNTDtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdBJyB8fCAoZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgZXZlbnQuZGVsZWdhdGVUYXJnZXQudGFnTmFtZSA9PT0gJ0EnKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdH1cclxuXHJcblx0U2VsZWN0b3JzLmdldE11bHRpcGxlRWxlbWVudHNGcm9tU2VsZWN0b3IodGhpcykuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0VkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fSk7XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0NvbGxhcHNlOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5pbXBvcnQge2lzRGlzYWJsZWQsIG1lcmdlRGVlcE9iamVjdCwgbm9vcH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgUGxhY2VtZW50IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3BsYWNlbWVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuaW1wb3J0IEJhY2tkcm9wIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL2JhY2tkcm9wXCI7XHJcblxyXG5jb25zdCBOQU1FICAgICAgICAgICAgID0gJ2Ryb3Bkb3duJztcclxuY29uc3QgTkFNRV9LRVkgICAgICAgICA9ICd2Zy5kcm9wZG93bic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSAgPSAnZmFkZSc7XHJcbmNvbnN0IFRBUkdFVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24tY29udGVudCc7XHJcbmNvbnN0IFBBUkVOVF9DT05UQUlORVIgPSAndmctZHJvcGRvd24nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXSc7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfSElEREVOID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgPSBgJHtOQU1FX0tFWX0uc2hvd2A7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiAgPSBgJHtOQU1FX0tFWX0uc2hvd25gO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSAgICAgYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSA9ICAgYGtleWRvd24uJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9ICAgICBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9WRVJfREFUQV9BUEkgPSBgbW91c2VvdmVyLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEkgPSAgYG1vdXNlb3V0LiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHRHJvcGRvd24gZXh0ZW5kcyBCYXNlTW9kdWxlIHtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJhbXMpIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0bGV0IGRlZmF1bHRQYXJhbXMgPSB7XHJcblx0XHRcdG9mZnNldDogWzAsIDJdLFxyXG5cdFx0XHRiYWNrZHJvcDogZmFsc2UsXHJcblx0XHRcdG92ZXJmbG93OiBmYWxzZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IGZhbHNlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cdFx0XHR0aW1lb3V0QW5pbWF0aW9uOiAzNTAsXHJcblx0XHRcdGhvdmVyOiBmYWxzZSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdFx0bG9hZGVyOiBmYWxzZSxcclxuXHRcdFx0fSxcclxuXHRcdFx0YW5pbWF0aW9uOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiBmYWxzZSxcclxuXHRcdFx0XHRpbjogJ2FuaW1hdGVfX2ZsaXBJblknLFxyXG5cdFx0XHRcdG91dDogJ2FuaW1hdGVfX2ZsaXBPdXRZJyxcclxuXHRcdFx0XHRkZWxheTogODAwLFxyXG5cdFx0XHR9LFxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgnb2Zmc2V0JyBpbiBwYXJhbXMgJiYgQXJyYXkuaXNBcnJheShwYXJhbXMub2Zmc2V0KSkge1xyXG5cdFx0XHRkZWZhdWx0UGFyYW1zLm9mZnNldCA9IHBhcmFtcy5vZmZzZXQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdChkZWZhdWx0UGFyYW1zLCBwYXJhbXMpKTtcclxuXHJcblx0XHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHR0aGlzLl9wYXJlbnQgPSB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGU7XHJcblx0XHR0aGlzLl9kcm9wID0gdGFyZ2V0IHx8IFNlbGVjdG9ycy5maW5kKCcuJyArIFRBUkdFVF9DT05UQUlORVIsIHRoaXMuX3BhcmVudCk7XHJcblx0XHR0aGlzLl9pc1BsYWNlbWVudCA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXkgPSAhdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5lbmFibGUgPyAwIDogdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheTtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbih0aGlzLl9kcm9wLCBWR0Ryb3Bkb3duLk5BTUVfS0VZLCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9pc1Nob3duKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xyXG5cdH1cclxuXHJcblx0c2hvdygpIHtcclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMuX2VsZW1lbnQpIHx8IHRoaXMuX2lzU2hvd24oKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQ6IHRoaXMuX2VsZW1lbnRcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9yb3V0ZSgpO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fc2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5iYWNrZHJvcCAmJiAhdGhpcy5fcGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdEJhY2tkcm9wLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duLW9wZW4nKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSB8fCAhdGhpcy5faXNTaG93bigpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0OiB0aGlzLl9lbGVtZW50XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHJldHVybiBzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0X2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSwgcmVsYXRlZFRhcmdldClcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kcm9wLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmJhY2tkcm9wICYmICF0aGlzLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5vdmVyZmxvdykge1xyXG5cdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcGRvd24tb3BlbicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuX2Ryb3AuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4sIHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fcGFyZW50LCB0cnVlLCAxMCk7XHJcblx0XHR9LCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5KTtcclxuXHR9XHJcblxyXG5cdC8vIFRPRE8gY2xhc3MgUGxhY2VtZW50IGlzbid0IGRvbmVcclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2lzUGxhY2VtZW50KSB7XHJcblx0XHRcdGxldCBwbGFjZW1lbnQgPSBuZXcgUGxhY2VtZW50KHtcclxuXHRcdFx0XHRlbGVtZW50OiB0aGlzLl9wYXJlbnQsXHJcblx0XHRcdFx0ZHJvcDogdGhpcy5fZHJvcFxyXG5cdFx0XHR9KS5fZ2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0XHRpZiAocGxhY2VtZW50LmlzRml4ZWQpIHtcclxuXHRcdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHRcdFx0X3RoaXMuX2Ryb3Auc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTIwJSknOyAvLyB0b2RvIHRoaXMgaXMg0LrQvtGB0YLRi9C70Ywg0L/QvmZpeNC40YLRjFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS5sZWZ0ID0gcGxhY2VtZW50LmxlZnQgKyAncHgnO1xyXG5cdFx0XHRfdGhpcy5fZHJvcC5zdHlsZS50b3AgPSAgcGxhY2VtZW50LnRvcCArICdweCc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMub2Zmc2V0KSB7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdUb3AgPSBfdGhpcy5fcGFyYW1zLm9mZnNldFsxXSArICdweCc7XHJcblx0XHRcdF90aGlzLl9kcm9wLnN0eWxlLnBhZGRpbmdSaWdodCA9IF90aGlzLl9wYXJhbXMub2Zmc2V0WzBdICsgJ3B4JztcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5faXNQbGFjZW1lbnQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9wYXJhbXMuaG92ZXIpIHtcclxuXHRcdFx0bGV0IGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0VkdEcm9wZG93bi5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy4nICsgUEFSRU5UX0NPTlRBSU5FUik7XHJcblx0XHRcdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0aWYgKCFpbnN0YW5jZS5fcGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9IHRhcmdldDtcclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGluc3RhbmNlLl9wYXJlbnQsIEVWRU5UX01PVVNFT1VUX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRpZiAoIWN1cnJlbnRFbGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChyZWxhdGVkVGFyZ2V0ID09PSBjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtID0gbnVsbDtcclxuXHRcdFx0XHRpbnN0YW5jZS5fY29tcGxldGVIaWRlKHtyZWxhdGVkVGFyZ2V0OiBpbnN0YW5jZS5fZWxlbWVudH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWURPV05fREFUQV9BUEksICcuJyArIFRBUkdFVF9DT05UQUlORVIsIFZHRHJvcGRvd24ua2V5ZG93bkhhbmRsZXIpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWVVQX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBWR0Ryb3Bkb3duLmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGVPcGVuVG9nZ2xlcyhldmVudCkge1xyXG5cdFx0Y29uc3Qgb3BlblRvZ2dsZXMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZHJvcGRvd25cIl06bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHRHJvcGRvd24uZ2V0SW5zdGFuY2UodG9nZ2xlKTtcclxuXHRcdFx0aWYgKCFjb250ZXh0KSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnLicgKyBUQVJHRVRfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZHJvcCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMga2V5ZG93bkhhbmRsZXIoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlzSW5wdXQgPSAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKVxyXG5cdFx0Y29uc3QgaXNFc2NhcGVFdmVudCA9IGV2ZW50LmtleSA9PT0gJ0VzY2FwZSdcclxuXHRcdGNvbnN0IGlzVXBPckRvd25FdmVudCA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nXS5pbmNsdWRlcyhldmVudC5rZXkpXHJcblxyXG5cdFx0aWYgKCFpc1VwT3JEb3duRXZlbnQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzSW5wdXQgJiYgIWlzRXNjYXBlRXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuXHRcdGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgP1xyXG5cdFx0XHR0aGlzIDogKFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5wYXJlbnROb2RlKSlcclxuXHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHRHJvcGRvd24uZ2V0T3JDcmVhdGVJbnN0YW5jZShnZXRUb2dnbGVCdXR0b24pXHJcblxyXG5cdFx0aWYgKGlzVXBPckRvd25FdmVudCkge1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdFx0XHRpbnN0YW5jZS5zaG93KClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGluc3RhbmNlLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHRcdFx0aW5zdGFuY2UuaGlkZSgpXHJcblx0XHRcdGdldFRvZ2dsZUJ1dHRvbi5mb2N1cygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR0Ryb3Bkb3duLmhpZGVPcGVuVG9nZ2xlcyhldmVudClcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRHJvcGRvd247IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vbWFuaXB1bGF0b3JcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBWR01vZGFsIGZyb20gXCIuLi8uLi92Z21vZGFsL2pzL3ZnbW9kYWxcIjtcclxuaW1wb3J0IHtpc09iamVjdCwgbWFrZVJhbmRvbVN0cmluZywgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IFZHQ29sbGFwc2UgZnJvbSBcIi4uLy4uL3ZnY29sbGFwc2UvanMvdmdjb2xsYXBzZVwiO1xyXG5pbXBvcnQge2dldFNWR30gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvYmFja2Ryb3BcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnZm9ybS1zZW5kZXInO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5mcyc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX1NVQ0NFU1MgPSAndmcuZnMuc3VjY2Vzcyc7XHJcbmNvbnN0IEVWRU5UX0tFWV9FUlJPUiAgID0gJ3ZnLmZzLmVycm9yJztcclxuY29uc3QgRVZFTlRfS0VZX0JFRk9SRSAgPSAndmcuZnMuYmVmb3JlJztcclxuXHJcbmNvbnN0IEVWRU5UX1NVQk1JVF9EQVRBX0FQSSA9IGBzdWJtaXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdGb3JtU2VuZGVyIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdHJlZGlyZWN0OiAnJyxcclxuXHRcdFx0dmFsaWRhdGU6IGZhbHNlLFxyXG5cdFx0XHRzdWJtaXQ6IGZhbHNlLFxyXG5cdFx0XHRmaWVsZHM6IFtdLFxyXG5cdFx0XHR0aW1lb3V0OiA1MCxcclxuXHRcdFx0YWxlcnQ6IHtcclxuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHRcdHR5cGU6ICdtb2RhbCdcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctZm9ybS1zZW5kZXInLFxyXG5cdFx0XHRcdGFsZXJ0Q29sbGFwc2U6ICd2Zy1mb3JtLXNlbmRlci1jb2xsYXBzZScsXHJcblx0XHRcdFx0YWxlcnRNb2RhbDogJ3ZnLWZvcm0tc2VuZGVyLW1vZGFsJyxcclxuXHRcdFx0XHR2YWxpZGF0aW9uOiAnbmVlZHMtdmFsaWRhdGlvbicsXHJcblx0XHRcdFx0d2FzVmFsaWRhdGU6ICd3YXMtdmFsaWRhdGVkJ1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYWpheC5yb3V0ZSA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnYWN0aW9uJykudG9Mb3dlckNhc2UoKTtcclxuXHRcdHRoaXMuX3BhcmFtcy5hamF4Lm1ldGhvZCA9IE1hbmlwdWxhdG9yLmdldCh0aGlzLl9lbGVtZW50LCAnbWV0aG9kJykudG9Mb3dlckNhc2UoKTtcclxuXHRcdHRoaXMuX2J1dHRvbiA9IFNlbGVjdG9ycy5maW5kKCdbdHlwZT1cInN1Ym1pdFwiXScsIHRoaXMuX2VsZW1lbnQpIHx8IFNlbGVjdG9ycy5maW5kKCdbZm9ybT1cIicgKyB0aGlzLl9lbGVtZW50LmlkICsgJ1wiXScpIHx8IG51bGw7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmlzQnRuVGV4dCAgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdkYXRhLWJ0bi10ZXh0JykgIT09ICdmYWxzZSc7XHJcblx0XHR0aGlzLl9wYXJhbXMuaXNKc29uUGFyc2UgPSBNYW5pcHVsYXRvci5nZXQodGhpcy5fZWxlbWVudCwgJ2RhdGEtanNvbi1wYXJzZScpICE9PSAnZmFsc2UnO1xyXG5cdFx0dGhpcy5fcGFyYW1zLmlzU2hvd1Bhc3MgID0gTWFuaXB1bGF0b3IuZ2V0KHRoaXMuX2VsZW1lbnQsICdkYXRhLXNob3ctcGFzcycpID09PSAndHJ1ZSc7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHRidWlsZCgpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLl9wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLnZhbGlkYXRlKSB7XHJcblx0XHRcdE1hbmlwdWxhdG9yLnNldCh0aGlzLl9lbGVtZW50LCAnbm92YWxpZGF0ZScsICcnKTtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5jbGFzc2VzLnZhbGlkYXRpb24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE8g0YHQtNC10LvQsNGC0Ywg0LTQvtCx0LDQstC70LXQvdC40LUg0LPQu9Cw0LfQsCDQtdGB0LvQuCDQtdGB0YLRjCDQstCy0L7QtCDQv9Cw0YDQvtC70Y9cclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cdH1cclxuXHJcblx0cmVxdWVzdChkYXRhLCBldmVudCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLl9hbGVydEJlZm9yZSgpO1xyXG5cclxuXHRcdF90aGlzLl9wYXJhbXMuYWpheC5kYXRhID0gZGF0YTtcclxuXHJcblx0XHRfdGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd3YXMtdmFsaWRhdGVkJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5hbGVydC5lbmFibGVkKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBzdGF0dXMgPT09ICdzdHJpbmcnICYmIHN0YXR1cyA9PT0gJ2Vycm9yJykge1xyXG5cdFx0XHRcdFx0X3RoaXMuX2FsZXJ0RXJyb3IoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ3N0cmluZycgJiYgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRcdF90aGlzLl9hbGVydFN1Y2Nlc3MoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMucmVkaXJlY3QpIHtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IF90aGlzLl9wYXJhbXMucmVkaXJlY3Q7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0QmVmb3JlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmFsZXJ0LnR5cGUgPT09ICdjb2xsYXBzZScpIHtcclxuXHRcdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdFx0VkdDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIHt0b2dnbGU6IGZhbHNlfSkuaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0X3RoaXMuX3N0YXR1c0J1dHRvbignYmVmb3JlJyk7XHJcblx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0JFRk9SRSwgX3RoaXMpO1xyXG5cdH1cclxuXHJcblx0X2FsZXJ0RXJyb3IoZXZlbnQsIGRhdGEpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdhZnRlcicpO1xyXG5cdFx0X3RoaXMuX2pzb25QYXJzZShkYXRhLCAnZXJyb3InKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKF90aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfRVJST1IsIFtldmVudCwgX3RoaXMsIGRhdGFdKTtcclxuXHR9XHJcblxyXG5cdF9hbGVydFN1Y2Nlc3MoZXZlbnQsIGRhdGEpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5fc3RhdHVzQnV0dG9uKCdhZnRlcicpO1xyXG5cdFx0X3RoaXMuX2pzb25QYXJzZShkYXRhLCAnc3VjY2VzcycpO1xyXG5cdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TVUNDRVNTLCBbZXZlbnQsIF90aGlzLCBkYXRhXSk7XHJcblx0fVxyXG5cclxuXHRfc3RhdHVzQnV0dG9uKHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMuX2J1dHRvbikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBidG5TdWJtaXRUZXh0ID0gX3RoaXMuX2J1dHRvbixcclxuXHRcdFx0YnRuVGV4dCA9IHtcclxuXHRcdFx0c2VuZDogJ9Ce0YLQv9GA0LDQstC70Y/QtdC8Li4uJyxcclxuXHRcdFx0dGV4dDogJ9Ce0YLQv9GA0LDQstC40YLRjCdcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS1zcGlubmVyJykgJiYgc3RhdHVzID09PSAnYmVmb3JlJykge1xyXG5cdFx0XHRfdGhpcy5fYnV0dG9uLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtIG1lLTJcIj48L3NwYW4+Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0JykpIHtcclxuXHRcdFx0YnRuVGV4dC50ZXh0ID0gTWFuaXB1bGF0b3IuZ2V0KF90aGlzLl9idXR0b24sICdkYXRhLXRleHQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCAkYnRuVGV4dCA9IF90aGlzLl9idXR0b24ucXVlcnlTZWxlY3RvcignW2RhdGEtdGV4dF0nKTtcclxuXHRcdFx0aWYgKCRidG5UZXh0KSB7XHJcblx0XHRcdFx0YnRuVGV4dC50ZXh0ID0gTWFuaXB1bGF0b3IuZ2V0KCRidG5UZXh0LCAnZGF0YS10ZXh0Jyk7XHJcblx0XHRcdFx0YnRuU3VibWl0VGV4dCA9ICRidG5UZXh0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhfdGhpcy5fYnV0dG9uLCAnZGF0YS10ZXh0LXNlbmQnKSkge1xyXG5cdFx0XHRidG5UZXh0LnNlbmQgPSBNYW5pcHVsYXRvci5nZXQoX3RoaXMuX2J1dHRvbiwgJ2RhdGEtdGV4dC1zZW5kJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgJGJ0blRleHRTZW5kID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXh0LXNlbmRdJyk7XHJcblx0XHRcdGlmICgkYnRuVGV4dFNlbmQpIHtcclxuXHRcdFx0XHRidG5UZXh0LnNlbmQgPSBNYW5pcHVsYXRvci5nZXQoJGJ0blRleHRTZW5kLCAnZGF0YS10ZXh0LXNlbmQnKTtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0ID0gJGJ0blRleHRTZW5kO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN0YXR1cyA9PT0gJ2JlZm9yZScpIHtcclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMuaXNCdG5UZXh0KSB7XHJcblx0XHRcdFx0YnRuU3VibWl0VGV4dC5pbm5lckhUTUwgPSBidG5UZXh0LnNlbmQ7XHJcblx0XHRcdH1cclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KF90aGlzLl9idXR0b24sJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHN0YXR1cyA9PT0gJ2FmdGVyJykge1xyXG5cdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5pc0J0blRleHQpIHtcclxuXHRcdFx0XHRidG5TdWJtaXRUZXh0LmlubmVySFRNTCA9IGJ0blRleHQudGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRNYW5pcHVsYXRvci5yZW1vdmUoX3RoaXMuX2J1dHRvbiwnZGlzYWJsZWQnKTtcclxuXHJcblx0XHRcdGxldCBzcGlubmVyID0gX3RoaXMuX2J1dHRvbi5xdWVyeVNlbGVjdG9yKCcuc3Bpbm5lci1ib3JkZXInKTtcclxuXHRcdFx0aWYgKHNwaW5uZXIpIHNwaW5uZXIucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfanNvblBhcnNlKGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLmlzSnNvblBhcnNlICYmIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRsZXQgcGFyc2VyRGF0YSA9IHt9O1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRwYXJzZXJEYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuXHRcdFx0XHRfdGhpcy5hbGVydChwYXJzZXJEYXRhLCBzdGF0dXMpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0X3RoaXMuYWxlcnQoZGF0YSwgc3RhdHVzKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0X3RoaXMuYWxlcnQoZGF0YSwgc3RhdHVzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFsZXJ0KGRhdGEsIHN0YXR1cykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSkge1xyXG5cdFx0XHRpZiAoKCdjb2RlJyBpbiBkYXRhKSAmJiBkYXRhLmNvZGUgJiYgZGF0YS5jb2RlID09PSAyMDApIHtcclxuXHRcdFx0XHRpZiAoJ3Jlc3BvbnNlJyBpbiBkYXRhICYmIGRhdGEucmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdGxldCByZXNwb25zZSA9IG5vcm1hbGl6ZURhdGEoZGF0YS5yZXNwb25zZSk7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlc3BvbnNlID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UuaW5kZXhPZihcIlBhcnNlIGVycm9yXCIpICE9PSAtMSB8fCByZXNwb25zZS5pbmRleE9mKFwic3ludGF4IGVycm9yXCIpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdHN0YXR1cyA9ICdlcnJvcic7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAnRXJyb3InLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSByZXBlYXQgbGF0ZXInXHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBwbGVhc2UgcmVwZWF0IGxhdGVyJ1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKCdlcnJvcnMnIGluIHJlc3BvbnNlICYmIG5vcm1hbGl6ZURhdGEocmVzcG9uc2UuZXJyb3JzKSkge1xyXG5cdFx0XHRcdFx0XHRcdHN0YXR1cyA9IG5vcm1hbGl6ZURhdGEocmVzcG9uc2UuZXJyb3JzKSA/ICdlcnJvcicgOiAnc3VjY2Vzcyc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIV90aGlzLl9wYXJhbXMuYWxlcnQuZW5hYmxlZCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQudHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRfdGhpcy5fYWxlcnRNb2RhbChkYXRhLCBzdGF0dXMpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYWxlcnQudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG5cdFx0XHRfdGhpcy5fYWxlcnRDb2xsYXBzZShkYXRhLCBzdGF0dXMpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfYWxlcnRNb2RhbChkYXRhLCBzdGF0dXMpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHQvLyDQldGB0YLRjCDQu9C4INC+0YLQutGA0YvRgtGL0LUg0LzQvtC00LDQu9C60LgsINC30LDQutGA0YvQstCw0LXQvFxyXG5cdFx0Wy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsJyldLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG5cdFx0XHRcdGxldCBtQlMgPSBib290c3RyYXAuTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50KTtcclxuXHRcdFx0XHRtQlMuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmctbW9kYWwnKV0uZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XHJcblx0XHRcdFx0Y29uc3QgbVZHID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdFx0XHRcdG1WRy5oaWRlKFttVkddKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IGlkID0gX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmdlbmVyYWwgKyAnLScgKyBtYWtlUmFuZG9tU3RyaW5nKCksXHJcblx0XHRcdCRtb2RhbCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHJcblx0XHRpZiAoJG1vZGFsKSAkbW9kYWwucmVtb3ZlKCk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFZHTW9kYWwuaW5pdChpZCwge1xyXG5cdFx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRcdGFsZXJ0OiBfdGhpcy5fcGFyYW1zLmNsYXNzZXMuYWxlcnRNb2RhbFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgZnVuY3Rpb24gKHNlbGYpIHtcclxuXHRcdFx0XHRsZXQgZWxlbWVudCA9IHNlbGYuX2VsZW1lbnQ7XHJcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydE1vZGFsKTtcclxuXHJcblx0XHRcdFx0bGV0ICRib2R5ID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1tb2RhbC1ib2R5JywgZWxlbWVudCk7XHJcblx0XHRcdFx0aWYgKCRib2R5KSAkYm9keS5hcHBlbmQoX3RoaXMuc2V0RGF0YVJlbGF0aW9uU3RhdHVzKGVsZW1lbnQsIHN0YXR1cywgZGF0YSwgJ21vZGFsJykpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnRvZ2dsZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sIF90aGlzLl9wYXJhbXMudGltZW91dCk7XHJcblx0fVxyXG5cclxuXHRfYWxlcnRDb2xsYXBzZShkYXRhLCBzdGF0dXMpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRsZXQgJGNvbGxhcHNlID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgX3RoaXMuX3BhcmFtcy5jbGFzc2VzLmFsZXJ0Q29sbGFwc2UpO1xyXG5cdFx0aWYgKCEkY29sbGFwc2UpIHtcclxuXHRcdFx0JGNvbGxhcHNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdCRjb2xsYXBzZS5jbGFzc0xpc3QuYWRkKF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5hbGVydENvbGxhcHNlKTtcclxuXHRcdFx0JGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ3ZnLWNvbGxhcHNlJyk7XHJcblx0XHRcdCRjb2xsYXBzZS5pZCA9IF90aGlzLl9wYXJhbXMuY2xhc3Nlcy5nZW5lcmFsICsgJy0nICsgbWFrZVJhbmRvbVN0cmluZygpO1xyXG5cdFx0XHQkY29sbGFwc2UuYXBwZW5kKF90aGlzLnNldERhdGFSZWxhdGlvblN0YXR1cygkY29sbGFwc2UsIHN0YXR1cywgZGF0YSwgJ2NvbGxhcHNlJykpO1xyXG5cclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQucHJlcGVuZCgkY29sbGFwc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdFZHQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZSgkY29sbGFwc2UsIHt0b2dnbGU6IGZhbHNlfSkudG9nZ2xlKCk7XHJcblx0fVxyXG5cclxuXHRzZXREYXRhUmVsYXRpb25TdGF0dXMoJGVsZW1lbnQsIHN0YXR1cywgZGF0YSwgdHlwZSkge1xyXG5cdFx0bGV0ICRhbGVydCA9IFNlbGVjdG9ycy5maW5kKCcudmctYWxlcnQtJyArIHN0YXR1cywgJGVsZW1lbnQpO1xyXG5cclxuXHRcdGlmIChpc09iamVjdChkYXRhKSkge1xyXG5cdFx0XHRpZiAoc3RhdHVzID09PSAnZXJyb3InKSB7XHJcblx0XHRcdFx0aWYgKCdjb2RlJyBpbiBkYXRhICYmIGRhdGEuY29kZSAhPT0gMjAwKSB7XHJcblx0XHRcdFx0XHRpZiAoJ3RleHQnIGluIGRhdGEgJiYgIWRhdGEudGV4dCkge1xyXG5cdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSByZXBlYXQgbGF0ZXInO1xyXG5cclxuXHRcdFx0XHRcdFx0c3dpdGNoIChkYXRhLmNvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDQwMDpcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGEudGV4dCA9ICdCYWQgUmVxdWVzdCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDAxOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1VuYXV0aG9yaXplZCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDAzOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1VuYXV0aG9yaXplZCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDEzOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ0ZvcmJpZGRlbidcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDA0OlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ05vdCBGb3VuZCdcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgNDIyOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS50ZXh0ID0gJ1VucHJvY2Vzc2FibGUgRW50aXR5J1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSA1MDA6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnSW50ZXJuYWwgU2VydmVyIEVycm9yJ1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSA1MDQ6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLnRleHQgPSAnR2F0ZXdheSBUaW1lb3V0J1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICgncmVzcG9uc2UnIGluIGRhdGEpIHtcclxuXHRcdFx0XHRsZXQgcmVzcG9uc2UgPSBub3JtYWxpemVEYXRhKGRhdGEucmVzcG9uc2UpLCB0aXRsZSA9ICcnLCB0eHQgPSAnJywgY29kZSA9ICcnO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgcmVzcG9uc2UgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAoISgndmlldycgaW4gcmVzcG9uc2UpKSB7XHJcblx0XHRcdFx0XHRcdGlmICgndGl0bGUnIGluIHJlc3BvbnNlKSB0aXRsZSA9IHJlc3BvbnNlLnRpdGxlO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3RhdHVzID09PSAnZXJyb3InICYmIGRhdGEuY29kZSAhPT0gMjAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29kZSA9ICcgJyArIGRhdGEudGV4dCArICcgKCcgKyBkYXRhLmNvZGUgKyAnKSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHR4dCArPSAnPGg0IGNsYXNzPVwidmctYWxlcnQtY29udGVudC0tdGl0bGVcIj4nICsgdGl0bGUgKyBjb2RlICsgJzwvaDQ+JztcclxuXHJcblx0XHRcdFx0XHRcdGlmICgnbWVzc2FnZScgaW4gcmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFx0XHR0eHQgKz0gJzxkaXYgY2xhc3M9XCJ2Zy1hbGVydC1jb250ZW50LS1tZXNzYWdlXCI+JyArIHJlc3BvbnNlLm1lc3NhZ2UgKyAnPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoJ2Vycm9ycycgaW4gcmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZXJyb3JzID0gbm9ybWFsaXplRGF0YShyZXNwb25zZS5lcnJvcnMpIHx8IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGlzT2JqZWN0KGVycm9ycykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvciAoY29uc3QgZXJyb3IgaW4gZXJyb3JzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGVycm9yc1tlcnJvcl0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JzW2Vycm9yXS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eHQgKz0gJzxkaXY+JysgdCArJzwvZGl2Pic7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0eHQgPSAnPGRpdj4nKyBlcnJvcnNbZXJyb3JdICsnPC9kaXY+JztcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0XHR2aWV3OiB0eHRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRkYXRhLnZpZXcgPSByZXNwb25zZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISRhbGVydCkge1xyXG5cdFx0XHQkYWxlcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0JGFsZXJ0LmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0JywgJ3ZnLWFsZXJ0LScgKyBzdGF0dXMsICd2Zy1hbGVydC0nICsgdHlwZSk7XHJcblxyXG5cdFx0XHRsZXQgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRjb250ZW50LmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0LWNvbnRlbnQnKTtcclxuXHJcblx0XHRcdGxldCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGljb24uY2xhc3NMaXN0LmFkZCgndmctYWxlcnQtY29udGVudC0taWNvbicpO1xyXG5cclxuXHRcdFx0bGV0IGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblx0XHRcdGkuaW5uZXJIVE1MID0gZ2V0U1ZHKHN0YXR1cyk7XHJcblxyXG5cdFx0XHRpY29uLmFwcGVuZChpKTtcclxuXHRcdFx0Y29udGVudC5hcHBlbmQoaWNvbik7XHJcblxyXG5cdFx0XHRsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHR0ZXh0LmNsYXNzTGlzdC5hZGQoJ3ZnLWFsZXJ0LWNvbnRlbnQtLXRleHQnKTtcclxuXHRcdFx0dGV4dC5pbm5lckhUTUwgPSBkYXRhLnZpZXc7XHJcblxyXG5cdFx0XHRjb250ZW50LmFwcGVuZCh0ZXh0KTtcclxuXHRcdFx0JGFsZXJ0LmFwcGVuZChjb250ZW50KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCB0ZXh0ID0gU2VsZWN0b3JzLmZpbmQoJy52Zy1hbGVydC1jb250ZW50LS10ZXh0JywgJGFsZXJ0KTtcclxuXHRcdFx0dGV4dC5pbm5lckhUTUwgPSBkYXRhLnZpZXc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICRhbGVydDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdGb3JtU2VuZGVyLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCk7XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX1NVQk1JVF9EQVRBX0FQSSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0aWYgKCFNYW5pcHVsYXRvci5oYXMoZXZlbnQudGFyZ2V0LCAnZGF0YS12Z2Zvcm1zZW5kZXInKSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR0Zvcm1TZW5kZXIuZ2V0T3JDcmVhdGVJbnN0YW5jZShldmVudC50YXJnZXQsIHt9KTtcclxuXHRpZiAoIWluc3RhbmNlKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoaW5zdGFuY2UuX3BhcmFtcy52YWxpZGF0ZSkge1xyXG5cdFx0aWYgKCFpbnN0YW5jZS5fZWxlbWVudC5jaGVja1ZhbGlkaXR5KCkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRpbnN0YW5jZS5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLl9wYXJhbXMuY2xhc3Nlcy53YXNWYWxpZGF0ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBjb2xsZWN0RGF0YSA9IGZ1bmN0aW9uKGRhdGEsIGZpZWxkcykge1xyXG5cdFx0Zm9yIChsZXQgbmFtZSBpbiBmaWVsZHMpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBmaWVsZHNbbmFtZV0gPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIGZpZWxkc1tuYW1lXSkge1xyXG5cdFx0XHRcdFx0bGV0IGFyciA9IE9iamVjdC5rZXlzKGZpZWxkc1tuYW1lXVtrZXldKS5tYXAoZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZpZWxkc1tuYW1lXVtrZXldW2ldO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRkYXRhLmFwcGVuZChuYW1lLCBhcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkYXRhLmFwcGVuZChuYW1lLCBmaWVsZHNbbmFtZV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fVxyXG5cclxuXHRpZiAoIWluc3RhbmNlLl9wYXJhbXMuc3VibWl0KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKGluc3RhbmNlLl9lbGVtZW50KTtcclxuXHJcblx0XHQvLyBUT0RPINC00L7QtNC10LvQsNGC0YxcclxuXHRcdC8qaWYgKEFycmF5LmlzQXJyYXkoaW5zdGFuY2UuX3BhcmFtcy5hamF4LmZpZWxkcykgJiYgaW5zdGFuY2UuX3BhcmFtcy5hamF4LmZpZWxkcy5sZW5ndGgpIHtcclxuXHRcdFx0ZGF0YSA9IGNvbGxlY3REYXRhKGRhdGEsIGluc3RhbmNlLl9wYXJhbXMuYWpheC5maWVsZHMpO1xyXG5cdFx0fSovXHJcblxyXG5cdFx0cmV0dXJuIGluc3RhbmNlLnJlcXVlc3QoZGF0YSwgZXZlbnQpO1xyXG5cdH1cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRm9ybVNlbmRlcjsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCBTZWxlY3RvcnMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9zZWxlY3RvcnNcIjtcclxuaW1wb3J0IENvb2tpZXMgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9jb29raWVcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSAgICAgPSAnbGF3Y29va2llJztcclxuY29uc3QgTkFNRV9LRVkgPSAndmcubGF3Y29va2llJztcclxuXHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSAgICAgICA9ICdbZGF0YS12Zy10b2dnbGU9XCJsYXdjb29raWVcIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRV9DTEVBUiA9ICdbZGF0YS12Zy10b2dnbGU9XCJsYXdjb29raWUtY2xlYXJcIl0nO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgICA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR0xhd0Nvb2tpZSBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdHN0YXRpYyBzUGFyYW1zID0ge307XHJcblxyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRzdG9yYWdlOiAnbG9jYWwnLCAvLyBjb29raWUgb3IgbG9jYWxcclxuXHRcdFx0ZGVsYXk6IDUwMCxcclxuXHRcdFx0Y29va2llOiB7XHJcblx0XHRcdFx0bmFtZTogJ2xhd0Nvb2tpZScsXHJcblx0XHRcdFx0dmFsdWU6ICd5ZXMnLFxyXG5cdFx0XHRcdGF0dHJpYnV0ZXM6IHt9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdGVuYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpbjogJ2FuaW1hdGVfX2ZhZGVJblVwJyxcclxuXHRcdFx0XHRvdXQ6ICdhbmltYXRlX19mYWRlT3V0RG93bicsXHJcblx0XHRcdFx0ZGVsYXk6IDgwMCxcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCdcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0VkdMYXdDb29raWUuc1BhcmFtcyA9IHRoaXMuX3BhcmFtcztcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5ID0gIXRoaXMuX3BhcmFtcy5hbmltYXRpb24uZW5hYmxlID8gMCA6IHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXk7XHJcblx0XHR0aGlzLl9hbmltYXRpb24odGhpcy5fZWxlbWVudCwgVkdMYXdDb29raWUuTkFNRV9LRVksIHRoaXMuX3BhcmFtcy5hbmltYXRpb24pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3coKSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zdG9yYWdlKCkuZ2V0KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywge30pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHt9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSwgdGhpcy5fcGFyYW1zLmRlbGF5KVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFKTtcclxuXHRcdGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHJcblx0XHRcdGNvbnN0IGNvbXBsZXRlQ2FsbGJhY2sgPSAoKSA9PiBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9lbGVtZW50LCB0cnVlKTtcclxuXHRcdH0sIHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXkpO1xyXG5cdH1cclxuXHJcblx0c3RvcmFnZSgpIHtcclxuXHRcdHRoaXMuX3N0b3JhZ2UgPSB7XHJcblx0XHRcdGlzQ29va2llOiB0aGlzLl9wYXJhbXMuc3RvcmFnZSA9PT0gJ2Nvb2tpZScsXHJcblx0XHRcdHN0b3JhZ2U6IHRoaXMuX3BhcmFtcy5zdG9yYWdlID09PSAnY29va2llJyA/IENvb2tpZXMgOiBsb2NhbFN0b3JhZ2UsXHJcblx0XHRcdG5hbWU6IHRoaXMuX3BhcmFtcy5jb29raWUubmFtZSxcclxuXHRcdFx0dmFsdWU6IHRoaXMuX3BhcmFtcy5jb29raWUudmFsdWUsXHJcblx0XHRcdGF0dHJpYnV0ZXM6IHRoaXMuX3BhcmFtcy5jb29raWUuYXR0cmlidXRlcyxcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdldCgpIHtcclxuXHRcdGlmICh0aGlzLl9zdG9yYWdlLmlzQ29va2llKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yYWdlLnN0b3JhZ2UuZ2V0KHRoaXMuX3N0b3JhZ2UubmFtZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RvcmFnZS5zdG9yYWdlLmdldEl0ZW0odGhpcy5fc3RvcmFnZS5uYW1lKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldCgpIHtcclxuXHRcdGlmICh0aGlzLl9zdG9yYWdlLmlzQ29va2llKSB7XHJcblx0XHRcdHRoaXMuX3N0b3JhZ2Uuc3RvcmFnZS5zZXQodGhpcy5fc3RvcmFnZS5uYW1lLCB0aGlzLl9zdG9yYWdlLnZhbHVlLCB0aGlzLl9zdG9yYWdlLmF0dHJpYnV0ZXMpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fc3RvcmFnZS5zdG9yYWdlLnNldEl0ZW0odGhpcy5fc3RvcmFnZS5uYW1lLCB0aGlzLl9zdG9yYWdlLnZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcmVzZXQoKSB7XHJcblx0XHRDb29raWVzLnJlbW92ZShWR0xhd0Nvb2tpZS5zUGFyYW1zLmNvb2tpZS5uYW1lKTtcclxuXHRcdGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHTGF3Q29va2llLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLnRvZ2dsZSgpO1xyXG5cdH1cclxufVxyXG5cclxuZGlzbWlzc1RyaWdnZXIoVkdMYXdDb29raWUpO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkgcmV0dXJuO1xyXG5cclxuXHRjb25zdCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoJyN2Zy1sYXdjb29raWUnKTtcclxuXHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR0xhd0Nvb2tpZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdGluc3RhbmNlLnN0b3JhZ2UoKS5zZXQoKTtcclxuXHRpbnN0YW5jZS5oaWRlKCk7XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFX0NMRUFSLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkgcmV0dXJuO1xyXG5cclxuXHRjb25zdCBlbGVtZW50ID0gU2VsZWN0b3JzLmZpbmQoJyN2Zy1sYXdjb29raWUnKTtcclxuXHRpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR0xhd0Nvb2tpZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQpO1xyXG5cdGluc3RhbmNlLmRpc3Bvc2UoKTtcclxuXHJcblx0bG9jYXRpb24ucmVsb2FkKCk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdMYXdDb29raWU7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCBTY3JvbGxCYXJIZWxwZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvc2Nyb2xsYmFyXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgaXNSVEwsIG1lcmdlRGVlcE9iamVjdCwgcmVmbG93fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnbW9kYWwnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5tb2RhbCc7XHJcblxyXG5jb25zdCBFU0NBUEVfS0VZID0gJ0VzY2FwZSc7XHJcblxyXG5jb25zdCBPUEVOX1NFTEVDVE9SID0gJy52Zy1tb2RhbC5zaG93JztcclxuY29uc3QgU0VMRUNUT1JfRElBTE9HID0gJy52Zy1tb2RhbC1kaWFsb2cnO1xyXG5jb25zdCBTRUxFQ1RPUl9NT0RBTF9CT0RZID0gJy52Zy1tb2RhbC1ib2R5JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtdmctdG9nZ2xlPVwibW9kYWxcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9PUEVOID0gJ3ZnLW1vZGFsLW9wZW4nO1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdyc7XHJcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJztcclxuY29uc3QgQ0xBU1NfTkFNRV9TVEFUSUMgPSAndmctbW9kYWwtc3RhdGljJztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9SRVNJWkUgPSBgJHtOQU1FX0tFWX0ucmVzaXplYDtcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCA9IGAke05BTUVfS0VZfS5sb2FkZWRgO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUyAgICAgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEICAgICAgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSAgICAgID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZX01PVVNFRE9XTl9ESVNNSVNTICAgPSBgbW91c2Vkb3duLmRpc21pc3Mke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19ESVNNSVNTICAgICAgID0gYGNsaWNrLmRpc21pc3Mke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ET01fTE9BREVEX0RBVEFfQVBJID0gYERPTUNvbnRlbnRMb2FkZWQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfUE9QU1RBVEVfREFUQV9BUEkgICA9IGBwb3BzdGF0ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR01vZGFsIGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRmb2N1czogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGZpZWxkczogW10sXHJcblx0XHRcdGhhc2g6IGZhbHNlLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0JyxcclxuXHRcdFx0XHRsb2FkZXI6IGZhbHNlXHJcblx0XHRcdH0sXHJcblx0XHRcdGFuaW1hdGlvbjoge1xyXG5cdFx0XHRcdGVuYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0aW46ICdhbmltYXRlX19yb2xsSW4nLFxyXG5cdFx0XHRcdG91dDogJ2FuaW1hdGVfX3JvbGxPdXQnLFxyXG5cdFx0XHRcdGRlbGF5OiA4MDAsXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsYXNzZXM6IHtcclxuXHRcdFx0XHRnZW5lcmFsOiAndmctbW9kYWwnLFxyXG5cdFx0XHRcdGRpYWxvZzogJ3ZnLW1vZGFsLWRpYWxvZycsXHJcblx0XHRcdFx0Y29udGVudDogJ3ZnLW1vZGFsLWNvbnRlbnQnLFxyXG5cdFx0XHRcdGhlYWRlcjogJ3ZnLW1vZGFsLWhlYWRlcicsXHJcblx0XHRcdFx0dGl0bGU6ICd2Zy1tb2RhbC10aXRsZScsXHJcblx0XHRcdFx0Ym9keTogJ3ZnLW1vZGFsLWJvZHknLFxyXG5cdFx0XHRcdGZvb3RlcjogJ3ZnLW1vZGFsLWZvb3RlcicsXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX2J1dHRvbiA9IG51bGw7XHJcblx0XHR0aGlzLl9kaWFsb2cgPSBTZWxlY3RvcnMuZmluZChTRUxFQ1RPUl9ESUFMT0csIHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0dGhpcy5faXNTaG93biA9IGZhbHNlO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLl9zY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFySGVscGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSA9ICF0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmVuYWJsZSA/IDAgOiB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5O1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIFZHTW9kYWwuTkFNRV9LRVksIHRoaXMuX3BhcmFtcy5hbmltYXRpb24pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0VkdNb2RhbC5idWlsZChlbGVtZW50LCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBidWlsZChpZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0aWYgKHR5cGVvZiBpZCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0X2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwnLCAnZmFkZScpO1xyXG5cdFx0X2VsZW1lbnQuaWQgPSBpZDtsZXQgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRkaWFsb2cuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtZGlhbG9nJyk7XHJcblxyXG5cdFx0bGV0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtY29udGVudCcpO1xyXG5cclxuXHRcdGxldCBidG5DbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAndHlwZScsICdidXR0b24nKTtcclxuXHRcdE1hbmlwdWxhdG9yLnNldChidG5DbG9zZSwgJ2RhdGEtdmctZGlzbWlzcycsICdtb2RhbCcpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGJ0bkNsb3NlLCAnZGF0YS12Zy10YXJnZXQnLCAnIycgKyBpZCk7XHJcblx0XHRNYW5pcHVsYXRvci5zZXQoYnRuQ2xvc2UsICdhcmlhLWxhYmVsJywgJ2Nsb3NlJyk7XHJcblx0XHRidG5DbG9zZS5jbGFzc0xpc3QuYWRkKCd2Zy1idG4tY2xvc2UnKTtcclxuXHJcblx0XHRjb250ZW50LmFwcGVuZChidG5DbG9zZSk7XHJcblxyXG5cdFx0bGV0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgndmctbW9kYWwtYm9keScpO1xyXG5cclxuXHRcdGNvbnRlbnQuYXBwZW5kKGJvZHkpO1xyXG5cdFx0ZGlhbG9nLmFwcGVuZChjb250ZW50KTtcclxuXHRcdF9lbGVtZW50LmFwcGVuZChkaWFsb2cpO1xyXG5cclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKF9lbGVtZW50KTtcclxuXHJcblx0XHRjb25zdCBtb2RhbCA9IFZHTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShfZWxlbWVudCwgcGFyYW1zKTtcclxuXHJcblx0XHRleGVjdXRlKGNhbGxiYWNrLCBbbW9kYWxdKTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24gPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKHJlbGF0ZWRUYXJnZXQsIHRoaXMuX3BhcmFtcyk7XHJcblx0XHRfdGhpcy5fcm91dGUoZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0xPQURFRCwge3N0YXRzOiBzdGF0dXMsIGRhdGE6IGRhdGF9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2lzU2hvd24gPSB0cnVlO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLmhhc2gpIHtcclxuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwidmctc2lkZWJhci1vcGVuXCIsIFwiI1wiICsgdGhpcy5fZWxlbWVudC5pZCk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9LRVlfUE9QU1RBVEVfREFUQV9BUEksICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fc2Nyb2xsQmFyLmhpZGUoKTtcclxuXHJcblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHJcblx0XHR0aGlzLl9hZGRGaWVsZHNJbk1vZGFsKHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0dGhpcy5fYWRqdXN0RGlhbG9nKCk7XHJcblxyXG5cdFx0QmFja2Ryb3Auc2hvdygoKSA9PiB0aGlzLl9zaG93RWxlbWVudChyZWxhdGVkVGFyZ2V0KSk7XHJcblx0fVxyXG5cclxuXHRoaWRlKG9wZW5lZE1vZGFscyA9IFtdKSB7XHJcblx0XHRpZiAoIXRoaXMuX2lzU2hvd24gfHwgdGhpcy5faXNUcmFuc2l0aW9uaW5nKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5faXNTaG93biA9IGZhbHNlO1xyXG5cdFx0dGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soKCkgPT4gdGhpcy5faGlkZU1vZGFsKG9wZW5lZE1vZGFscyksIHRoaXMuX2VsZW1lbnQsIHRoaXMuX2lzQW5pbWF0ZWRGYWRlKCkpO1xyXG5cdFx0fSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSk7XHJcblx0fVxyXG5cclxuXHRfaGlkZU1vZGFsKG9wZW5lZE1vZGFscykge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcpO1xyXG5cdFx0dGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKTtcclxuXHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xyXG5cclxuXHRcdGlmIChvcGVuZWRNb2RhbHMubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5oYXNoKSB7XHJcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuXHRcdH1cclxuXHJcblx0XHRCYWNrZHJvcC5oaWRlKCgpID0+IHtcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfT1BFTik7XHJcblx0XHRcdHRoaXMuX3Jlc2V0QWRqdXN0bWVudHMoKTtcclxuXHRcdFx0dGhpcy5fc2Nyb2xsQmFyLnJlc2V0KCk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRfc2hvd0VsZW1lbnQocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0aWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuX2VsZW1lbnQpKSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHR0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgdHJ1ZSk7XHJcblx0XHR0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuc2Nyb2xsVG9wID0gMDtcclxuXHJcblx0XHRjb25zdCBtb2RhbEJvZHkgPSBTZWxlY3RvcnMuZmluZChTRUxFQ1RPUl9NT0RBTF9CT0RZLCB0aGlzLl9kaWFsb2cpO1xyXG5cdFx0aWYgKG1vZGFsQm9keSkge1xyXG5cdFx0XHRtb2RhbEJvZHkuc2Nyb2xsVG9wID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRyZWZsb3codGhpcy5fZWxlbWVudCk7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVylcclxuXHJcblx0XHRjb25zdCB0cmFuc2l0aW9uQ29tcGxldGUgPSAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHtcclxuXHRcdFx0XHRyZWxhdGVkVGFyZ2V0XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2sodHJhbnNpdGlvbkNvbXBsZXRlLCB0aGlzLl9kaWFsb2csIHRoaXMuX2lzQW5pbWF0ZWRGYWRlKCkpXHJcblx0fVxyXG5cclxuXHRfaXNBbmltYXRlZEZhZGUoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9GQURFKVxyXG5cdH1cclxuXHJcblx0X2FkanVzdERpYWxvZygpIHtcclxuXHRcdGNvbnN0IGlzTW9kYWxPdmVyZmxvd2luZyA9IHRoaXMuX2VsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG5cdFx0Y29uc3Qgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLl9zY3JvbGxCYXIuZ2V0V2lkdGgoKVxyXG5cdFx0Y29uc3QgaXNCb2R5T3ZlcmZsb3dpbmcgPSBzY3JvbGxiYXJXaWR0aCA+IDBcclxuXHJcblx0XHRpZiAoaXNCb2R5T3ZlcmZsb3dpbmcgJiYgIWlzTW9kYWxPdmVyZmxvd2luZykge1xyXG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IGlzUlRMKCkgPyAncGFkZGluZ0xlZnQnIDogJ3BhZGRpbmdSaWdodCdcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSBgJHtzY3JvbGxiYXJXaWR0aH1weGBcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWlzQm9keU92ZXJmbG93aW5nICYmIGlzTW9kYWxPdmVyZmxvd2luZykge1xyXG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IGlzUlRMKCkgPyAncGFkZGluZ1JpZ2h0JyA6ICdwYWRkaW5nTGVmdCdcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSBgJHtzY3JvbGxiYXJXaWR0aH1weGBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yZXNldEFkanVzdG1lbnRzKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9ICcnXHJcblx0XHR0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnXHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblx0XHRFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSBFU0NBUEVfS0VZKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGFyYW1zLmtleWJvYXJkKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl90cmlnZ2VyQmFja2Ryb3BUcmFuc2l0aW9uKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9LRVlfUkVTSVpFLCAoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLl9pc1Nob3duICYmICF0aGlzLl9pc1RyYW5zaXRpb25pbmcpIHRoaXMuX2FkanVzdERpYWxvZygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9NT1VTRURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub25lKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9DTElDS19ESVNNSVNTLCBldmVudDIgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLl9lbGVtZW50ICE9PSBldmVudC50YXJnZXQgfHwgdGhpcy5fZWxlbWVudCAhPT0gZXZlbnQyLnRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5fcGFyYW1zLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xyXG5cdFx0XHRcdFx0dGhpcy5fdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbigpIHtcclxuXHRcdGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBpc01vZGFsT3ZlcmZsb3dpbmcgPSB0aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcblx0XHRjb25zdCBpbml0aWFsT3ZlcmZsb3dZID0gdGhpcy5fZWxlbWVudC5zdHlsZS5vdmVyZmxvd1k7XHJcblxyXG5cdFx0aWYgKGluaXRpYWxPdmVyZmxvd1kgPT09ICdoaWRkZW4nIHx8IHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU1RBVElDKSkgcmV0dXJuO1xyXG5cdFx0aWYgKCFpc01vZGFsT3ZlcmZsb3dpbmcpIHRoaXMuX2VsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU1RBVElDKTtcclxuXHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKCgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU1RBVElDKTtcclxuXHRcdFx0dGhpcy5fcXVldWVDYWxsYmFjaygoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBpbml0aWFsT3ZlcmZsb3dZO1xyXG5cdFx0XHR9LCB0aGlzLl9kaWFsb2cpO1xyXG5cdFx0fSwgdGhpcy5fZGlhbG9nKTtcclxuXHR9XHJcblxyXG5cdF9hZGRGaWVsZHNJbk1vZGFsKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhyZWxhdGVkVGFyZ2V0LCB0aGlzLl9wYXJhbXMpO1xyXG5cclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLmZpZWxkcy5sZW5ndGgpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMuZmllbGRzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKCEnbmFtZScgaW4gaXRlbSAmJiAhJ3ZhbHVlJyBpbiBpdGVtKSByZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgZWxlbWVudHMgPSBTZWxlY3RvcnMuZmluZEFsbCgnW2RhdGEtJyArIGl0ZW0ubmFtZSArICddJywgdGhpcy5fZWxlbWVudCk7XHJcblx0XHRcdGlmICghZWxlbWVudHMubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdFx0XHRmb3IgKGNvbnN0IGVsbSBvZiBlbGVtZW50cykge1xyXG5cdFx0XHRcdHN3aXRjaCAoZWxtLnRhZ05hbWUpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ0lOUFVUJzogZWxtLnZhbHVlID0gaXRlbS52YWx1ZTsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdJTUcnOiBNYW5pcHVsYXRvci5zZXQoZWxtLCAnc3JjJywgaXRlbS52YWx1ZSk7IGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDogZWxtLmlubmVySFRNTCA9IGl0ZW0udmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHTW9kYWwpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBEYXRhIEFQSSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRjb25zdCB0YXJnZXQgPSBTZWxlY3RvcnMuZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKTtcclxuXHJcblx0aWYgKFsnQScsICdBUkVBJ10uaW5jbHVkZXModGhpcy50YWdOYW1lKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0RXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX0tFWV9TSE9XLCBzaG93RXZlbnQgPT4ge1xyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblx0fSk7XHJcblxyXG5cdGNvbnN0IGFscmVhZHlPcGVuID0gU2VsZWN0b3JzLmZpbmQoT1BFTl9TRUxFQ1RPUik7XHJcblx0aWYgKGFscmVhZHlPcGVuKSBWR01vZGFsLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKFthbHJlYWR5T3Blbl0pO1xyXG5cclxuXHRjb25zdCBkYXRhID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldCk7XHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfRE9NX0xPQURFRF9EQVRBX0FQSSwgZnVuY3Rpb24gKCkge1xyXG5cdGxldCB0YXJnZXRIYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XHJcblx0aWYgKHRhcmdldEhhc2gpIHtcclxuXHRcdGxldCB0YXJnZXQgPSBTZWxlY3RvcnMuZmluZCgnIycgKyB0YXJnZXRIYXNoKTtcclxuXHRcdGlmICh0YXJnZXQgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndmctbW9kYWwnKSkge1xyXG5cdFx0XHRpZiAoaXNEaXNhYmxlZCh0YXJnZXQpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBkYXRhID0gVkdNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcclxuXHRcdFx0ZGF0YS50b2dnbGUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR01vZGFsOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBSZXNwb25zaXZlIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9jb21wb25lbnRzL3Jlc3BvbnNpdmVcIjtcclxuaW1wb3J0IHtnZXRTVkd9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdCwgbm9vcCwgbm9ybWFsaXplRGF0YX0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICduYXYnO1xyXG5jb25zdCBOQU1FX0tFWSA9ICd2Zy5uYXYnO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50cyBDbGFzc2VzXHJcbiAqL1xyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFICAgPSAnZmFkZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJy52Zy1uYXYgYSc7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzIEV2ZW50c1xyXG4gKi9cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9IGAke05BTUVfS0VZfS5oaWRkZW5gO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuXHJcbmNvbnN0IEVWRU5UX01PVVNFT1ZFUl9EQVRBX0FQSSA9IGBtb3VzZW92ZXIuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9NT1VTRU9VVF9EQVRBX0FQSSAgPSBgbW91c2VvdXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljay4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX0tFWVVQX0RBVEFfQVBJID0gYGtleXVwLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfUkVTSVpFX0RBVEFfQVBJID0gYHJlc2l6ZS4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcblxyXG5jbGFzcyBWR05hdiBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50KTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMoZWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0YnJlYWtwb2ludDogZmFsc2UsXHJcblx0XHRcdHBsYWNlbWVudDogJ2hvcml6b250YWwnLFxyXG5cdFx0XHRjbGFzc2VzOiB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyQWN0aXZlOiAndmctbmF2LWhhbWJ1cmdlci1hY3RpdmUnLFxyXG5cdFx0XHRcdGhhbWJ1cmdlckFsd2F5czogJ3ZnLW5hdi1oYW1idXJnZXItYWx3YXlzJyxcclxuXHRcdFx0XHRoYW1idXJnZXI6ICd2Zy1uYXYtaGFtYnVyZ2VyJyxcclxuXHRcdFx0XHRjb250YWluZXI6ICd2Zy1uYXYtY29udGFpbmVyJyxcclxuXHRcdFx0XHR3cmFwcGVyOiAndmctbmF2LXdyYXBwZXInLFxyXG5cdFx0XHRcdGFjdGl2ZTogJ3ZnLW5hdi1hY3RpdmUnLFxyXG5cdFx0XHRcdGV4cGFuZDogJ3ZnLW5hdi1leHBhbmQnLFxyXG5cdFx0XHRcdGNsb25lZDogJ3ZnLW5hdi1jbG9uZWQnLFxyXG5cdFx0XHRcdGhvdmVyOiAndmctbmF2LWhvdmVyJyxcclxuXHRcdFx0XHRmbGlwOiAndmctbmF2LWZsaXAnLFxyXG5cdFx0XHRcdFhYWEw6ICd2Zy1uYXYteHh4bCcsXHJcblx0XHRcdFx0WFhMOiAndmctbmF2LXh4bCcsXHJcblx0XHRcdFx0WEw6ICd2Zy1uYXYteGwnLFxyXG5cdFx0XHRcdExHOiAndmctbmF2LWxnJyxcclxuXHRcdFx0XHRNRDogJ3ZnLW5hdi1tZCcsXHJcblx0XHRcdFx0U006ICd2Zy1uYXYtc20nLFxyXG5cdFx0XHRcdFhTOiAndmctbmF2LXhzJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRleHBhbmQ6IHRydWUsXHJcblx0XHRcdGhvdmVyOiBmYWxzZSxcclxuXHRcdFx0cG9zaXRpb246IHRydWUsXHJcblx0XHRcdGNvbGxhcHNlOiB0cnVlLFxyXG5cdFx0XHR0b2dnbGU6ICc8c3BhbiBjbGFzcz1cImRlZmF1bHRcIj48L3NwYW4+JyxcclxuXHRcdFx0aGFtYnVyZ2VyOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGFsd2F5czogZmFsc2UsXHJcblx0XHRcdFx0dGl0bGU6ICcnLFxyXG5cdFx0XHRcdGJvZHk6IG51bGxcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2FsbGJhY2s6IG5vb3AsXHJcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcclxuXHRcdFx0dGltZW91dEFuaW1hdGlvbjogMzAwLFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cm91dGU6ICcnLFxyXG5cdFx0XHRcdHRhcmdldDogJycsXHJcblx0XHRcdFx0bWV0aG9kOiAnZ2V0J1xyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpKTtcclxuXHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gbnVsbDtcclxuXHRcdHRoaXMubmF2aWdhdGlvbiA9ICcuJyArIHRoaXMuX3BhcmFtcy5jbGFzc2VzLndyYXBwZXI7XHJcblxyXG5cdFx0dGhpcy5tb3ZlZExpbmtzID0gW107XHJcblx0XHR0aGlzLiRsaW5rcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuJyArIHRoaXMuX3BhcmFtcy5jbGFzc2VzLndyYXBwZXIgKyAnID4gbGknLCB0aGlzLm5hdmlnYXRpb24pXHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5hbmltYXRpb24gPT09IGZhbHNlKSB7XHJcblx0XHRcdHRoaXMuX3BhcmFtcy50aW1lb3V0QW5pbWF0aW9uID0gMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWTtcclxuXHR9XHJcblxyXG5cdGdldCBuYXZpZ2F0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25hdmlnYXRpb247XHJcblx0fVxyXG5cclxuXHRzZXQgbmF2aWdhdGlvbihlbCkge1xyXG5cdFx0bGV0IGVsbSA9IFNlbGVjdG9ycy5maW5kKGVsLCB0aGlzLl9lbGVtZW50KTtcclxuXHRcdGlmICghZWxtKSByZXR1cm47XHJcblx0XHR0aGlzLl9uYXZpZ2F0aW9uID0gZWxtO1xyXG5cdH1cclxuXHJcblx0YnVpbGQoKSB7XHJcblx0XHRpZiAoIXRoaXMubmF2aWdhdGlvbikgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBwYXJhbXMgPSB0aGlzLl9wYXJhbXM7XHJcblxyXG5cdFx0Ly8g0JLQtdGI0LDQtdC8INC+0YHQvdC+0LLQvdGL0LUg0LrQu9Cw0YHRgdGLXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQocGFyYW1zLmNsYXNzZXMuY29udGFpbmVyKTtcclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbmF2LScgKyBwYXJhbXMucGxhY2VtZW50KTtcclxuXHJcblx0XHQvLyDQldGB0LvQuCDQvdGD0LbQvdC+INC+0YHRgtCw0LLQuNGC0Ywg0YHQv9C40YHQvtC6INC80LXQvdGOINC40LvQuCDRg9GB0YLQsNC90L7QstC40YLRjCDQvNC10LTQuNCwINGC0L7Rh9C60YNcclxuXHRcdGlmICghcGFyYW1zLmJyZWFrcG9pbnQpIHtcclxuXHRcdFx0cGFyYW1zLmV4cGFuZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghcGFyYW1zLmhhbWJ1cmdlci5hbHdheXMpIHtcclxuXHRcdFx0aWYgKCFwYXJhbXMuYnJlYWtwb2ludCB8fCAhcGFyYW1zLmV4cGFuZCkge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5leHBhbmQpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHBhcmFtcy5icmVha3BvaW50ICE9PSBmYWxzZSkge1xyXG5cdFx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctbmF2LScgKyBwYXJhbXMuYnJlYWtwb2ludCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBbHdheXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vINCc0LXQvdGOINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCwg0LXRgdC70Lgg0Y3RgtC+INC90LUg0LzQvtCx0LjQu9GM0L3QvtC1INGD0YHRgtGA0L7QudGB0YLQstC+XHJcblx0XHRpZiAocGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3Nlcy5ob3Zlcik7XHJcblxyXG5cdFx0XHRpZiAoUmVzcG9uc2l2ZS5jaGVja01vYmlsZU9yVGFibGV0KCkpIHtcclxuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmNsYXNzZXMuaG92ZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LPQsNC80LHRg9GA0LPQtdGALCDQtdGB0LvQuCDQtdCz0L4g0L3QtdGCINCyINGA0LDQt9C80LXRgtC60LVcclxuXHRcdGlmIChwYXJhbXMuZXhwYW5kICYmICFwYXJhbXMuaGFtYnVyZ2VyLmJvZHkpIHtcclxuXHRcdFx0bGV0IGlzSGFtYnVyZ2VyID0gU2VsZWN0b3JzLmZpbmQoJy4nICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyLCB0aGlzLl9lbGVtZW50KTtcclxuXHJcblx0XHRcdGlmIChpc0hhbWJ1cmdlciA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGxldCBtVGl0bGUgPSAnJyxcclxuXHRcdFx0XHRcdGhhbWJ1cmdlciA9ICc8c3BhbiBjbGFzcz1cIicgKyBwYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXIgKyAnLS1saW5lc1wiPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocGFyYW1zLmhhbWJ1cmdlci50aXRsZSkge1xyXG5cdFx0XHRcdFx0bVRpdGxlID0gJzxzcGFuIGNsYXNzPVwiJyArIHBhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlciArICctLXRpdGxlXCI+JysgcGFyYW1zLmhhbWJ1cmdlci50aXRsZSArJzwvc3Bhbj4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtcy5oYW1idXJnZXIuYm9keSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aGFtYnVyZ2VyID0gcGFyYW1zLmhhbWJ1cmdlci5ib2R5O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fZWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCc8YSBocmVmPVwiI3NpZGViYXItbmF2XCIgY2xhc3M9XCInICsgcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyICsgJ1wiIGRhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiPicgKyBtVGl0bGUgKyBoYW1idXJnZXIgKyc8L2E+Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRg9C60LDQt9Cw0YLQtdC70Ywg0L/QtdGA0LXQutC70Y7Rh9Cw0YLQtdC70Y9cclxuXHRcdGlmIChwYXJhbXMudG9nZ2xlKSB7XHJcblx0XHRcdGxldCAkZHJvcGRvd25fYSA9IFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmRyb3Bkb3duLW1lZ2EgPiBhLCAuZHJvcGRvd24gPiBhJywgdGhpcy5fZWxlbWVudCldLFxyXG5cdFx0XHRcdHRvZ2dsZSA9ICc8c3BhbiBjbGFzcz1cInRvZ2dsZVwiPicgKyBwYXJhbXMudG9nZ2xlICsgJzwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0aWYgKCRkcm9wZG93bl9hLmxlbmd0aCkge1xyXG5cdFx0XHRcdCRkcm9wZG93bl9hLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuXHRcdFx0XHRcdGlmICghZWxlbS5xdWVyeVNlbGVjdG9yKCcudG9nZ2xlJykgJiYgIWVsZW0uY2xvc2VzdCgnLmRvdHMnKSkge1xyXG5cdFx0XHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXHJcblx0XHRcdFx0XHRcdGVsZW0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0b2dnbGUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGFyYW1zLmNvbGxhcHNlICYmIFJlc3BvbnNpdmUuY2hlY2sodGhpcykgJiYgcGFyYW1zLnBsYWNlbWVudCAhPT0gJ3ZlcnRpY2FsJykge1xyXG5cdFx0XHRzZXRDb2xsYXBzZSh0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ2FmdGVySW5pdCcgaW4gdGhpcy5fcGFyYW1zLmNhbGxiYWNrKSB7XHJcblx0XHRcdGV4ZWN1dGUodGhpcy5fcGFyYW1zLmNhbGxiYWNrLmFmdGVySW5pdCwgW3RoaXNdKTtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqINCk0YPQvdC60YbQuNGPINGB0LLQvtGA0LDRh9C40LLQsNC90LjRj1xyXG5cdFx0ICogVE9ETyDQn9GA0LjQtNGD0LzQsNGC0Ywg0YfRgtC+INGC0L4g0YEg0LzQtdCz0LAg0LzQtdC90Y4sINC60L7RgtC+0YDQvtC1INGD0YXQvtC00LjRgiDQsiDQv9C+0LTQvNC10L3RjlxyXG5cdFx0ICogVE9ETyDQotCw0Log0LbQtSDQtdGB0YLRjCDQutC+0YHRj9C60Lgg0L/RgNC4INGA0LXRgdCw0LnQt9C1XHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIHNldENvbGxhcHNlKF90aGlzKSB7XHJcblx0XHRcdGxldCB3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUgPSBfdGhpcy5uYXZpZ2F0aW9uLmNsaWVudFdpZHRoLFxyXG5cdFx0XHRcdHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlID0gMCxcclxuXHRcdFx0XHQkZG90cyA9IFNlbGVjdG9ycy5maW5kKCcuZG90cycsIF90aGlzLm5hdmlnYXRpb24pLFxyXG5cdFx0XHRcdF9kb3RzID0gZ2V0U1ZHKCdkb3RzJyk7XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuJGxpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGlmICgkZG90cykge1xyXG5cdFx0XHRcdFx0d2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUgPSAkZG90cy5jbGllbnRXaWR0aFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgJGEgPSBTZWxlY3RvcnMuZmluZCgnYScsIF90aGlzLiRsaW5rc1swXSksXHJcblx0XHRcdFx0XHRcdCRsaW5rU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKCRhKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ0xlZnQgPSBub3JtYWxpemVEYXRhKCRsaW5rU3R5bGUucGFkZGluZ0xlZnQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0ID0gIG5vcm1hbGl6ZURhdGEoJGxpbmtTdHlsZS5wYWRkaW5nUmlnaHQuc2xpY2UoMCwgLTIpKSxcclxuXHRcdFx0XHRcdFx0cGFkZGluZyA9IHBhZGRpbmdMZWZ0ICsgcGFkZGluZ1JpZ2h0O1xyXG5cclxuXHRcdFx0XHRcdC8vIFRPRE8g0L3QtSDRgdC+0LLRgdC10Lwg0LLQtdGA0L3Qviwg0L3QviDQvNGLINGC0L7Rh9C90L4g0LfQvdCw0LXQvCDRiNC40YDQuNC90YMg0YLQvtGH0LXQuiDQsiBzdmcgLSAxNnB4XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHBhZGRpbmcgKyAxNjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAobGV0ICRsaW5rIG9mIF90aGlzLiRsaW5rcykge1xyXG5cdFx0XHRcdFx0bGV0IHdpZHRoID0gJGxpbmsuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRcdFx0XHR3aWR0aF9hbGxfbGlua3NfcmVzcG9uc2l2ZSA9IHdpZHRoX2FsbF9saW5rc19yZXNwb25zaXZlICsgd2lkdGg7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCh3aWR0aF9uYXZpZ2F0aW9uX3Jlc3BvbnNpdmUpIDwgd2lkdGhfYWxsX2xpbmtzX3Jlc3BvbnNpdmUpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZWRMaW5rcy5wdXNoKCRsaW5rKTtcclxuXHRcdFx0XHRcdFx0JGxpbmsucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm5hdmlnYXRpb24uaW5zZXJ0QmVmb3JlKF90aGlzLm1vdmVkTGlua3NbMF0sICRkb3RzKVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5uYXZpZ2F0aW9uLmFwcGVuZENoaWxkKF90aGlzLm1vdmVkTGlua3NbMF0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdF90aGlzLm1vdmVkTGlua3Muc3BsaWNlKDAsIDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoX3RoaXMubW92ZWRMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGlmICghJGRvdHMpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubmF2aWdhdGlvbi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsJzxsaSBjbGFzcz1cImRyb3Bkb3duIGRvdHNcIj4nICsgJzxhIGhyZWY9XCIjXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JysgX2RvdHMgKyc8L2E+PC9saT4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCRkb3RzKSB7XHJcblx0XHRcdFx0XHRcdCRkb3RzLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0ICRkID0gX3RoaXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuZG90cycpO1xyXG5cdFx0XHRcdGlmICgkZCAmJiBfdGhpcy5tb3ZlZExpbmtzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0bGV0ICRkcm9wZG93biA9ICRkLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XHJcblx0XHRcdFx0XHRpZiAoJGRyb3Bkb3duKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGxpbmsgb2YgX3RoaXMubW92ZWRMaW5rcykge1xyXG5cdFx0XHRcdFx0XHRcdCRkcm9wZG93bi5wcmVwZW5kKGxpbmspO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgJGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duLWNvbnRlbnQnKTtcclxuXHRcdFx0XHRcdFx0JGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblxyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsaW5rIG9mIF90aGlzLm1vdmVkTGlua3MpIHtcclxuXHRcdFx0XHRcdFx0XHQkZHJvcGRvd24ucHJlcGVuZChsaW5rKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0JGQuYXBwZW5kQ2hpbGQoJGRyb3Bkb3duKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0bGV0IHRhcmdldCA9IHJlbGF0ZWRUYXJnZXQucmVsYXRlZFRhcmdldDtcclxuXHJcblx0XHRpZiAoIXRhcmdldCB8fCBpc0Rpc2FibGVkKHRhcmdldCkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGFyZ2V0LmNsb3Nlc3QoJy5kcm9wZG93bi1jb250ZW50JykpIHtcclxuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpcnN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0bGV0IGRyb3AgPSBTZWxlY3RvcnMuZmluZCgnLmRyb3Bkb3duLWNvbnRlbnQnLCB0YXJnZXQpLFxyXG5cdFx0XHRsaW5rID0gdGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuXHRcdGlmIChsaW5rKSBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcblx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHJcblx0XHRzZXREcm9wUG9zaXRpb24oZHJvcClcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGFyZ2V0LCBFVkVOVF9LRVlfU0hPV04sIHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIGRyb3AsIHRydWUsIDUwKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gJGRyb3BcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0RHJvcFBvc2l0aW9uKCRkcm9wKSB7XHJcblx0XHRcdGxldCB7d2lkdGgsIHJpZ2h0fSA9ICRkcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRcdHdpbmRvd193aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuXHRcdFx0bGV0IE5fcmlnaHQgPSB3aW5kb3dfd2lkdGggLSByaWdodCAtIHdpZHRoO1xyXG5cclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQnKTtcclxuXHRcdFx0JGRyb3AuY2xhc3NMaXN0LnJlbW92ZSgnbGVmdCcpO1xyXG5cclxuXHRcdFx0bGV0ICRwYXJlbnQgPSAkZHJvcC5jbG9zZXN0KCdsaScpLFxyXG5cdFx0XHRcdCR1bCA9ICRwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgndWwnKTtcclxuXHJcblx0XHRcdGlmIChOX3JpZ2h0ID4gd2lkdGgpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0ICRlbCBvZiAkdWwpIHtcclxuXHRcdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdsZWZ0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgJGVsIG9mICR1bCkge1xyXG5cdFx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRoaWRlKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHRcdGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKSkge1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsZW1lbnQgPSByZWxhdGVkVGFyZ2V0LnJlbGF0ZWRUYXJnZXQ7XHJcblxyXG5cdFx0aWYgKCdlbG0nIGluIHJlbGF0ZWRUYXJnZXQgJiYgcmVsYXRlZFRhcmdldC5lbG0pIHtcclxuXHRcdFx0ZWxlbWVudCA9IHJlbGF0ZWRUYXJnZXQuZWxtXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQpIHtcclxuXHRcdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIoZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0FDVElWRSk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpcnN0JykpIHtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpcnN0Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLicgKyBDTEFTU19OQU1FX1NIT1csIGVsZW1lbnQpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcclxuXHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0XHRcdGxldCBwYXJlbnQgPSBlbC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAocGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0FDVElWRSkpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdFx0XHRpZiAobGluaykgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdFx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKGVsLCBFVkVOVF9LRVlfSElEREVOLCByZWxhdGVkVGFyZ2V0KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdF90aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIGVsLCB0cnVlLCA1MDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUT0RPINC10YHQu9C4INC90LAg0YHRgtGA0LDQvdC40YbQtSDQvdC10YHQutC+0LvRjNC60L4g0L3QsNCy0LjQs9Cw0YbQuNC5LCDRgtC+INC10YHRgtGMINC60L7RgdGP0LrQuFxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqL1xyXG5cdHN0YXRpYyBpbml0KGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHTmF2LmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGluc3RhbmNlLmJ1aWxkKCk7XHJcblxyXG5cdFx0bGV0IGRyb3BzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy5kcm9wZG93bicsIGluc3RhbmNlLl9uYXZpZ2F0aW9uKVxyXG5cclxuXHRcdGlmIChpbnN0YW5jZS5fcGFyYW1zLmhvdmVyKSB7XHJcblx0XHRcdFsuLi5kcm9wc10uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRsZXQgY3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbCwgRVZFTlRfTU9VU0VPVkVSX0RBVEFfQVBJLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0VkdOYXYuaGlkZU9wZW5Ecm9wcyhldmVudCk7XHJcblxyXG5cdFx0XHRcdFx0bGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFpbnN0YW5jZS5uYXZpZ2F0aW9uLmNvbnRhaW5zKHRhcmdldCkpIHJldHVybjtcclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gdGFyZ2V0O1xyXG5cclxuXHRcdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0ge1xyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0OiB0YXJnZXRcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpbnN0YW5jZS5zaG93KHJlbGF0ZWRUYXJnZXQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdEV2ZW50SGFuZGxlci5vbihlbCwgRVZFTlRfTU9VU0VPVVRfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKCFjdXJyZW50RWxlbSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGxldCByZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldC5jbG9zZXN0KCcuZHJvcGRvd24nKSxcclxuXHRcdFx0XHRcdFx0ZWxtID0gY3VycmVudEVsZW07XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlbGF0ZWRUYXJnZXQgPT09IGN1cnJlbnRFbGVtKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYXJnZXQgPSByZWxhdGVkVGFyZ2V0LnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSBudWxsO1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuaGlkZSh7cmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCwgZWxtOiBlbG19KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgVkdOYXYuY2xlYXJEcm9wcyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFZHTmF2LmNsZWFyRHJvcHMpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKCFNYW5pcHVsYXRvci5oYXModGhpcywgJ2FyaWEtZXhwYW5kZWQnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCdjbGljaycgaW4gaW5zdGFuY2UuX3BhcmFtcy5jYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0ZXhlY3V0ZShpbnN0YW5jZS5fcGFyYW1zLmNhbGxiYWNrLmNsaWNrLCBbdGhpc10pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzLmNsb3Nlc3QoJy52Zy1uYXYnKSxcclxuXHRcdFx0XHRcdGlzRmlyc3QgPSBzZWxmLnF1ZXJ5U2VsZWN0b3IoJy5maXJzdCcpO1xyXG5cclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gdGhpcy5jbG9zZXN0KCcuZHJvcGRvd24nKTtcclxuXHRcdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNEaXNhYmxlZCh0YXJnZXQpICYmICFpc1Zpc2libGUodGFyZ2V0KSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGlzRmlyc3QgJiYgdGhpcy5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IHRhcmdldH0pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFsuLi5TZWxlY3RvcnMuZmluZEFsbCgnLmFjdGl2ZScsIHNlbGYpXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZWwgJiYgZWwgIT09IHRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLmhpZGUoe3JlbGF0ZWRUYXJnZXQ6IGVsfSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5zaG93KHtyZWxhdGVkVGFyZ2V0OiB0YXJnZXR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdmdOYXZTaWRlYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXItbmF2Jyk7XHJcblx0XHRsZXQgaGFtYnVyZ2VyID0gaW5zdGFuY2UuX2VsZW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBpbnN0YW5jZS5fcGFyYW1zLmNsYXNzZXMuaGFtYnVyZ2VyKTtcclxuXHJcblx0XHRpZiAodmdOYXZTaWRlYmFyICYmIGhhbWJ1cmdlcikge1xyXG5cdFx0XHR2Z05hdlNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndmcuc2lkZWJhci5zaG93JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKGluc3RhbmNlLl9wYXJhbXMuY2xhc3Nlcy5oYW1idXJnZXJBY3RpdmUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZnTmF2U2lkZWJhci5hZGRFdmVudExpc3RlbmVyKCd2Zy5zaWRlYmFyLmhpZGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoaW5zdGFuY2UuX3BhcmFtcy5jbGFzc2VzLmhhbWJ1cmdlckFjdGl2ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGNsZWFyRHJvcHMoZXZlbnQpIHtcclxuXHRcdGlmIChldmVudC5idXR0b24gPT09IDIgfHwgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5ICE9PSAnVGFiJykpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0VkdOYXYuaGlkZU9wZW5Ecm9wcyhldmVudClcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlT3BlbkRyb3BzKGV2ZW50KSB7XHJcblx0XHRjb25zdCBvcGVuVG9nZ2xlcyA9IFNlbGVjdG9ycy5maW5kQWxsKCcuZHJvcGRvd246bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuYWN0aXZlJyk7XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0b2dnbGUgb2Ygb3BlblRvZ2dsZXMpIHtcclxuXHRcdFx0Y29uc3QgY29udGV4dCA9IFZHTmF2LmdldEluc3RhbmNlKHRvZ2dsZS5jbG9zZXN0KCcudmctbmF2JykpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZmlyc3QnKSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdG9nZ2xlIH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5oaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5FdmVudEhhbmRsZXIub24od2luZG93LCBFVkVOVF9SRVNJWkVfREFUQV9BUEksIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IGluc3RhbmNlID0gVkdOYXYuZ2V0T3JDcmVhdGVJbnN0YW5jZSgnLnZnLW5hdicsIHt9KTtcclxuXHRpbnN0YW5jZS5idWlsZCgpO1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdOYXY7IiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7ZXhlY3V0ZSwgaXNEaXNhYmxlZCwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ3JvbGx1cCc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnJvbGx1cCc7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93JztcclxuY29uc3QgQ0xBU1NfTkFNRV9ISURFID0gJ3ZnLXJvbGx1cC1kaXNwbGF5LS1ub25lJztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJyb2xsdXBcIl0nXHJcblxyXG5jb25zdCBFVkVOVF9LRVlfSElERSAgID0gYCR7TkFNRV9LRVl9LmhpZGVgO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gYCR7TkFNRV9LRVl9LnNob3dgO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHUm9sbHVwICBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRjb250ZW50OiAndGV4dCcsXHJcblx0XHRcdG9mZnNldDogMCxcclxuXHRcdFx0Y250OiAwLFxyXG5cdFx0XHRmYWRlOiB0cnVlLFxyXG5cdFx0XHR0cmFuc2l0aW9uOiBmYWxzZSxcclxuXHRcdFx0bnVtYmVyOiBmYWxzZSxcclxuXHRcdFx0aGVpZ2h0OiAwLFxyXG5cdFx0XHRlbGxpcHNpczoge1xyXG5cdFx0XHRcdGxpbmU6IG51bGxcclxuXHRcdFx0fSxcclxuXHRcdFx0bW9yZTogJyDQtdGJ0LUgJyxcclxuXHRcdFx0YnV0dG9uOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiB0cnVlLFxyXG5cdFx0XHRcdG1vcmU6IFwi0J/QvtC60LDQt9Cw0YLRjFwiLFxyXG5cdFx0XHRcdGxlc3M6IFwi0KHQstC10YDQvdGD0YLRjFwiXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuY2xhc3NlcyA9IHtcclxuXHRcdFx0Y29udGFpbmVyOiAndmctcm9sbHVwJyxcclxuXHRcdFx0aGlkZGVuOiBcInZnLXJvbGx1cC1jb250ZW50LS1oaWRkZW5cIixcclxuXHRcdFx0ZmFkZTogXCJ2Zy1yb2xsdXAtY29udGVudC0tZmFkZVwiLFxyXG5cdFx0XHRlbGxpcHNpczogXCJ2Zy1yb2xsdXAtY29udGVudC0tZWxsaXBzaXNcIixcclxuXHRcdFx0YnV0dG9uOiBcInZnLXJvbGx1cC1jb250ZW50LS1idXR0b25cIixcclxuXHRcdFx0dHJhbnNpdGlvbjogXCJ2Zy1yb2xsdXAtY29udGVudC0tdHJhbnNpdGlvblwiXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMudG90YWwgICAgPSAwO1xyXG5cdFx0dGhpcy5jb3VudCAgICA9IDA7XHJcblx0XHR0aGlzLm9mZnNldCAgID0gMDtcclxuXHRcdHRoaXMuaXNPZmZzZXQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGFyYW1zLm9mZnNldCA+IDApIHtcclxuXHRcdFx0dGhpcy5vZmZzZXQgPSAodGhpcy5fcGFyYW1zLm9mZnNldCArIHRoaXMuX3BhcmFtcy5jbnQpIHx8IDA7XHJcblx0XHRcdHRoaXMuaXNPZmZzZXQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYnVpbGQoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRSgpIHtcclxuXHRcdHJldHVybiBOQU1FO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FX0tFWSgpIHtcclxuXHRcdHJldHVybiBOQU1FX0tFWVxyXG5cdH1cclxuXHJcblx0c3RhdGljIHRvZ2dsZSh0YXJnZXQsIHJlbGF0ZWRUYXJnZXQpIHtcclxuXHRcdGNvbnN0IGluc3RhbmNlID0gVkdSb2xsdXAuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpO1xyXG5cdFx0bGV0IGlzU2hvd24gPSBpbnN0YW5jZS5pc1Nob3coKTtcclxuXHJcblx0XHRpZiAoIWlzU2hvd24pIHtcclxuXHRcdFx0aW5zdGFuY2UuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0LmlubmVySFRNTCA9IGluc3RhbmNlLl9wYXJhbXMuYnV0dG9uLmxlc3M7XHJcblxyXG5cdFx0XHRpZiAoaW5zdGFuY2Uub2Zmc2V0ID4gMCkge1xyXG5cdFx0XHRcdGlmIChpbnN0YW5jZS5pc09mZnNldCkge1xyXG5cdFx0XHRcdFx0cmVsYXRlZFRhcmdldC5pbm5lckhUTUwgPSBpbnN0YW5jZS5fcGFyYW1zLmJ1dHRvbi5tb3JlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZWxhdGVkVGFyZ2V0LmlubmVySFRNTCA9IGluc3RhbmNlLl9wYXJhbXMuYnV0dG9uLmxlc3M7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbnN0YW5jZS5zd2l0Y2goaW5zdGFuY2UuX2VsZW1lbnQsIGZhbHNlKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoaW5zdGFuY2UuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgdGV4dFNob3dOdW0gPSAnJyxcclxuXHRcdFx0XHRpc1Nob3dOdW0gPSBpbnN0YW5jZS5fcGFyYW1zLm51bWJlcjtcclxuXHJcblxyXG5cdFx0XHRpZiAoaXNTaG93TnVtKSB7XHJcblx0XHRcdFx0bGV0IHN1bSA9IChpbnN0YW5jZS50b3RhbCkgLSAoaW5zdGFuY2UuY291bnQpO1xyXG5cclxuXHRcdFx0XHRpZiAoc3VtID4gMCkge1xyXG5cdFx0XHRcdFx0dGV4dFNob3dOdW0gPSBpbnN0YW5jZS5fcGFyYW1zLm1vcmUgKyBzdW07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZWxhdGVkVGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xyXG5cdFx0XHRpbnN0YW5jZS5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdHJlbGF0ZWRUYXJnZXQuaW5uZXJIVE1MID0gaW5zdGFuY2UuX3BhcmFtcy5idXR0b24ubW9yZSArIHRleHRTaG93TnVtO1xyXG5cdFx0XHRpbnN0YW5jZS5zd2l0Y2goaW5zdGFuY2UuX2VsZW1lbnQsIHRydWUpO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoaW5zdGFuY2UuX2VsZW1lbnQsIEVWRU5UX0tFWV9ISURFLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRidWlsZChlbCA9IG51bGwsIGlzQnV0dG9uQXBwZW5kID0gdHJ1ZSkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcyxcclxuXHRcdFx0ZWxlbWVudCA9IGVsIHx8IF90aGlzLl9lbGVtZW50LFxyXG5cdFx0XHRzZWxmX2hlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0LCBzZXRfaGVpZ2h0ID0gX3RoaXMuX3BhcmFtcy5oZWlnaHQgfHwgKHNlbGZfaGVpZ2h0IC8gMik7XHJcblxyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLmNsYXNzZXMuY29udGFpbmVyKVxyXG5cclxuXHRcdGxldCBpc0ZhZGUgPSAgICAgICAgX3RoaXMuX3BhcmFtcy5mYWRlLFxyXG5cdFx0XHRpc1RyYW5zaXRpb24gPSAgX3RoaXMuX3BhcmFtcy50cmFuc2l0aW9uLFxyXG5cdFx0XHRpc0VsbGlwc2lzID0gICAgX3RoaXMuX3BhcmFtcy5lbGxpcHNpcy5saW5lICE9PSBudWxsLFxyXG5cdFx0XHRpc0J1dHRvbiA9ICAgICAgX3RoaXMuX3BhcmFtcy5idXR0b24uZW5hYmxlLFxyXG5cdFx0XHRpc1Nob3dOdW0gPSAgICAgX3RoaXMuX3BhcmFtcy5udW1iZXI7XHJcblxyXG5cdFx0aWYgKCFpc0J1dHRvbkFwcGVuZCkgX3RoaXMuc3dpdGNoKGVsZW1lbnQpO1xyXG5cclxuXHRcdGlmIChzZWxmX2hlaWdodCA+IHNldF9oZWlnaHQgJiYgX3RoaXMuX3BhcmFtcy5jb250ZW50ID09PSAndGV4dCcpIHtcclxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKF90aGlzLmNsYXNzZXMuaGlkZGVuKTtcclxuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBzZXRfaGVpZ2h0ICsgXCJweFwiO1xyXG5cclxuXHRcdFx0ZWxsaXBzaXMoKTtcclxuXHRcdFx0dHJhbnNpdGlvbigpO1xyXG5cdFx0XHRmYWRlKCk7XHJcblx0XHRcdGJ1dHRvbigpO1xyXG5cdFx0fSBlbHNlIGlmIChfdGhpcy5fcGFyYW1zLmNvbnRlbnQgPT09ICdlbGVtZW50cycpIHtcclxuXHRcdFx0bGV0IGVsZW1lbnRDbGFzcyA9IF90aGlzLl9wYXJhbXMuZWxlbWVudHMgfHwgJ2l0ZW0nLFxyXG5cdFx0XHRcdGl0ZW1zID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIGVsZW1lbnRDbGFzcyksXHJcblx0XHRcdFx0Y250ID0gX3RoaXMuX3BhcmFtcy5jbnQgfHwgNSxcclxuXHRcdFx0XHRpID0gMTtcclxuXHJcblx0XHRcdF90aGlzLnRvdGFsID0gaXRlbXMubGVuZ3RoO1xyXG5cdFx0XHRfdGhpcy5jb3VudCA9IGNudDtcclxuXHJcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xyXG5cdFx0XHRcdGlmIChpID4gY250KSB7XHJcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9ISURFKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaXNCdXR0b24gPT09IHRydWUpIGlzQnV0dG9uID0gKGkgLSAxKSA+IGNudDtcclxuXHJcblx0XHRcdGVsbGlwc2lzKCk7XHJcblx0XHRcdHRyYW5zaXRpb24oKTtcclxuXHRcdFx0ZmFkZSgpO1xyXG5cdFx0XHRidXR0b24oKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBlbGxpcHNpcygpIHtcclxuXHRcdFx0aWYgKGlzRWxsaXBzaXMpIHtcclxuXHRcdFx0XHRsZXQgbGluZSA9IF90aGlzLl9wYXJhbXMuZWxsaXBzaXMubGluZTtcclxuXHRcdFx0XHRpc0ZhZGUgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0aWYgKGxpbmUpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChfdGhpcy5jbGFzc2VzLmVsbGlwc2lzKTtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc3R5bGUud2Via2l0TGluZUNsYW1wID0gbGluZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCLQn9C10YDQtdC80LXQvdC90LDRjyBbZGF0YS1saW5lXSDQuNC70Lgg0L/QsNGA0LDQvNC10YLRgFtsaW5lXSDQvdC1INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQv9GD0YHRgtGL0LzQuFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPIG5vIHdvcmtcclxuXHRcdGZ1bmN0aW9uIHRyYW5zaXRpb24oKSB7XHJcblx0XHRcdGlmIChpc1RyYW5zaXRpb24pIHtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoX3RoaXMuY2xhc3Nlcy50cmFuc2l0aW9uKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGZhZGUoKSB7XHJcblx0XHRcdGlmIChpc0ZhZGUpIHtcclxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoX3RoaXMuY2xhc3Nlcy5mYWRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGJ1dHRvbigpIHtcclxuXHRcdFx0aWYgKGlzQnV0dG9uQXBwZW5kKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBlbGVtZW50LmlkKTtcclxuXHJcblx0XHRcdFx0aWYgKGlzQnV0dG9uKSB7XHJcblx0XHRcdFx0XHRsZXQgdGV4dFNob3dOdW0gPSAnJztcclxuXHJcblx0XHRcdFx0XHRpZiAoaXNTaG93TnVtKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzdW0gPSAoX3RoaXMudG90YWwpIC0gKF90aGlzLmNvdW50KTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChzdW0gPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0dGV4dFNob3dOdW0gPSBfdGhpcy5fcGFyYW1zLm1vcmUgKyBzdW07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRsZXQgYnRuVGV4dE1vcmUgPSBfdGhpcy5fcGFyYW1zLmJ1dHRvbi5tb3JlO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmVuZFwiLCBcIjxkaXYgIGNsYXNzPVxcXCJcIiArIF90aGlzLmNsYXNzZXMuYnV0dG9uICsgXCJcXFwiPjxhIGhyZWY9XFxcIiNcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiBkYXRhLXZnLXRvZ2dsZT1cXFwicm9sbHVwXFxcIiBkYXRhLXZnLXRhcmdldD1cXFwiI1wiICsgZWxlbWVudC5pZCArIFwiXFxcIj5cIiArIGJ0blRleHRNb3JlICsgdGV4dFNob3dOdW0gKyBcIjwvYT48L2Rpdj5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzd2l0Y2goZWwsIHN3aXRjaGVyID0gZmFsc2UpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoc3dpdGNoZXIpIHtcclxuXHRcdFx0dGhpcy5idWlsZChlbCwgZmFsc2UpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuaGlkZGVuKTtcclxuXHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuZWxsaXBzaXMpO1xyXG5cdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5mYWRlKTtcclxuXHJcblx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xyXG5cclxuXHRcdFx0aWYgKF90aGlzLl9wYXJhbXMuY29udGVudCA9PT0gJ2VsZW1lbnRzJykge1xyXG5cdFx0XHRcdGxldCBjbGFzc05hbWUgPSBfdGhpcy5fcGFyYW1zLmVsZW1lbnRzO1xyXG5cclxuXHRcdFx0XHRsZXQgaXRlbXMgPSBbLi4uZWwucXVlcnlTZWxlY3RvckFsbCgnLicgKyBjbGFzc05hbWUpXTtcclxuXHRcdFx0XHRpZiAoaXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRpZiAoX3RoaXMub2Zmc2V0ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRsZXQgY2xhc3NOYW1lID0gX3RoaXMuX3BhcmFtcy5lbGVtZW50cyxcclxuXHRcdFx0XHRcdFx0XHRpdGVtcyA9IFsuLi5lbC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIGNsYXNzTmFtZSldO1xyXG5cclxuXHRcdFx0XHRcdFx0aXRlbXMuc2xpY2UoX3RoaXMuY291bnQsIF90aGlzLm9mZnNldCkuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0hJREUpKTtcclxuXHRcdFx0XHRcdFx0X3RoaXMub2Zmc2V0ID0gX3RoaXMub2Zmc2V0ICsgX3RoaXMuc2V0dGluZ3Mub2Zmc2V0O1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKF90aGlzLm9mZnNldCA+IGl0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdF90aGlzLmlzT2Zmc2V0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0X3RoaXMub2Zmc2V0ID0gMDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfSElERSkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpc1Nob3coKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0ICogQHBhcmFtIGNhbGxiYWNrXHJcblx0ICovXHJcblx0c3RhdGljIGluaXQoZWxlbWVudCwgcGFyYW1zID0ge30sIGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBpbnN0YW5jZSA9IFZHUm9sbHVwLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgcGFyYW1zKTtcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2ssIFtpbnN0YW5jZV0pO1xyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG5cdGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHR9XHJcblxyXG5cdGlmIChpc0Rpc2FibGVkKHRoaXMpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XHJcblx0VkdSb2xsdXAudG9nZ2xlKHRhcmdldCwgdGhpcyk7XHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHUm9sbHVwOyIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge1xyXG5cdGlzRGlzYWJsZWQsXHJcblx0aXNFbXB0eU9iaiwgaXNPYmplY3QsXHJcblx0bWVyZ2VEZWVwT2JqZWN0LFxyXG5cdG5vb3AsXHJcblx0bm9ybWFsaXplRGF0YSxcclxuXHR0cmFuc2xpdGVyYXRlXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL21hbmlwdWxhdG9yXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5jb25zdCBOQU1FID0gJ3NlbGVjdCc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnNlbGVjdCc7XHJcblxyXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgICAgICAgICAgID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX0FDVElWRSAgICAgICAgID0gJ2FjdGl2ZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ09OVEFJTkVSICAgICAgPSAndmctc2VsZWN0JztcclxuY29uc3QgQ0xBU1NfTkFNRV9EUk9QRE9XTiAgICAgICA9ICd2Zy1zZWxlY3QtZHJvcGRvd24nO1xyXG5jb25zdCBDTEFTU19OQU1FX0xJU1QgICAgICAgICAgID0gJ3ZnLXNlbGVjdC1saXN0JztcclxuY29uc3QgQ0xBU1NfTkFNRV9PUFRJT04gICAgICAgICA9ICd2Zy1zZWxlY3QtbGlzdC0tb3B0aW9uJztcclxuY29uc3QgQ0xBU1NfTkFNRV9PUFRHUk9VUCAgICAgICA9ICd2Zy1zZWxlY3QtbGlzdC0tb3B0Z3JvdXAnO1xyXG5jb25zdCBDTEFTU19OQU1FX09QVEdST1VQX1RJVExFID0gJ3ZnLXNlbGVjdC1saXN0LS1vcHRncm91cC10aXRsZSc7XHJcbmNvbnN0IENMQVNTX05BTUVfQ1VSUkVOVCAgICAgICAgPSAndmctc2VsZWN0LWN1cnJlbnQnO1xyXG5jb25zdCBDTEFTU19OQU1FX1BMQUNFSE9MREVSICAgID0gJ3ZnLXNlbGVjdC1jdXJyZW50LS1wbGFjZWhvbGRlcic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0VBUkNIICAgICAgICAgPSAndmctc2VsZWN0LXNlYXJjaCc7XHJcblxyXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSAgICAgID0gYGNsaWNrLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuY29uc3QgRVZFTlRfS0VZX1VQX0RBVEFfQVBJICAgICA9IGBrZXl1cC4ke05BTUVfS0VZfS5kYXRhLmFwaWA7XHJcbmNvbnN0IEVWRU5UX1JFU0VUX0RBVEFfQVBJICAgICAgPSBgcmVzZXQuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0hBTkdFICAgICAgICAgID0gYCR7TkFNRV9LRVl9LmNoYW5nZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgICAgICAgICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gICAgICAgICAgPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICAgICAgICAgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICAgICAgICAgICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcblxyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSAgICA9ICdbZGF0YS12Zy10b2dnbGU9XCJzZWxlY3RcIl0nO1xyXG5jb25zdCBTRUxFQ1RPUl9PUFRJT05fVE9HR0xFICA9ICdbZGF0YS12Zy10b2dnbGU9XCJzZWxlY3Qtb3B0aW9uXCJdJztcclxuY29uc3QgU0VMRUNUT1JfU0VBUkNIX1RPR0dMRSAgPSAnW25hbWU9dmctc2VsZWN0LXNlYXJjaF0nO1xyXG5cclxuXHJcbmxldCBvYnNlcnZlclRpbW91dDtcclxuXHJcbmNsYXNzIFZHU2VsZWN0IGV4dGVuZHMgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuXHRcdHN1cGVyKGVsZW1lbnQsIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5fZ2V0UGFyYW1zKGVsZW1lbnQsIG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdHNlYXJjaDogZmFsc2UsXHJcblx0XHRcdHBsYWNlaG9sZGVyOiAnJyxcclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdGVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblxyXG5cdFx0dGhpcy5fZHJvcCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUVfRFJPUERPV04sIHRoaXMuX2VsZW1lbnQpO1xyXG5cdFx0dGhpcy5yZWZyZXNoKCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgYnVpbGRMaXN0T3B0aW9ucyhzZWxlY3RvciwgZHJvcCkge1xyXG5cdFx0bGV0IG9wdGlvbnMgPSBzZWxlY3Rvci5vcHRpb25zLFxyXG5cdFx0XHRsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuXHJcblx0XHRsaXN0LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9MSVNUKTtcclxuXHJcblx0XHRsZXQgb3B0R3JvdXAgPSBzZWxlY3Rvci5xdWVyeVNlbGVjdG9yQWxsKCdvcHRncm91cCcpO1xyXG5cclxuXHRcdGlmIChvcHRHcm91cC5sZW5ndGgpIHtcclxuXHRcdFx0bGV0IGlzU2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0Wy4uLm9wdEdyb3VwXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdGxldCBvbE9wdEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2wnKTtcclxuXHRcdFx0XHRvbE9wdEdyb3VwLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUFRHUk9VUCk7XHJcblxyXG5cdFx0XHRcdGxldCBsaUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuXHRcdFx0XHRsaUxhYmVsLmlubmVySFRNTCA9IGVsLmxhYmVsLnRyaW0oKTtcclxuXHRcdFx0XHRsaUxhYmVsLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUFRHUk9VUF9USVRMRSlcclxuXHJcblx0XHRcdFx0b2xPcHRHcm91cC5wcmVwZW5kKGxpTGFiZWwpXHJcblxyXG5cdFx0XHRcdGxldCBvcHRHcm91cE9wdGlvbnMgPSBTZWxlY3RvcnMuZmluZEFsbCgnb3B0aW9uJywgZWwpO1xyXG5cclxuXHRcdFx0XHRjcmVhdGVMaShvcHRHcm91cE9wdGlvbnMsIG9sT3B0R3JvdXAsIGlzU2VsZWN0ZWQpO1xyXG5cclxuXHRcdFx0XHRsaXN0LmFwcGVuZChvbE9wdEdyb3VwKTtcclxuXHRcdFx0XHRpc1NlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgaXNTZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRjcmVhdGVMaShvcHRpb25zLCBsaXN0LCBpc1NlbGVjdGVkKTtcclxuXHRcdH1cclxuXHJcblx0XHRkcm9wLmFwcGVuZChsaXN0KTtcclxuXHJcblx0XHRyZXR1cm4gbGlzdDtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVMaShvcHRpb25zLCBsaXN0LCBpc1NlbGVjdGVkKSB7XHJcblx0XHRcdGxldCBpID0gMDtcclxuXHRcdFx0Zm9yIChjb25zdCBvcHRpb24gb2Ygb3B0aW9ucykge1xyXG5cdFx0XHRcdGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcblxyXG5cdFx0XHRcdGxpLmlubmVySFRNTCA9IG9wdGlvbi5pbm5lckhUTUwudHJpbSgpLnJlcGxhY2UoLzxcXC9bXj5dKyg+fCQpL2csIFwiXCIpXHJcblx0XHRcdFx0bGkuZGF0YXNldC52YWx1ZSA9IE1hbmlwdWxhdG9yLmdldChvcHRpb24sICd2YWx1ZScpO1xyXG5cdFx0XHRcdGxpLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUFRJT04pO1xyXG5cclxuXHRcdFx0XHRNYW5pcHVsYXRvci5zZXQobGksICdkYXRhLXZnLXRvZ2dsZScsICdzZWxlY3Qtb3B0aW9uJyk7XHJcblxyXG5cdFx0XHRcdGxldCBsaURhdGEgPSBNYW5pcHVsYXRvci5nZXQob3B0aW9uKTtcclxuXHRcdFx0XHRpZiAoIWlzRW1wdHlPYmoobGlEYXRhKSkge1xyXG5cdFx0XHRcdFx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobGlEYXRhKSkge1xyXG5cdFx0XHRcdFx0XHRNYW5pcHVsYXRvci5zZXQobGksICdkYXRhLScgKyBrZXksIGxpRGF0YVtrZXldKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChpID09PSBzZWxlY3Rvci5zZWxlY3RlZEluZGV4ICYmICFpc1NlbGVjdGVkKSB7XHJcblx0XHRcdFx0XHRsaS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhvcHRpb24sICdkaXNhYmxlZCcpKSBsaS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHRcdGlmIChNYW5pcHVsYXRvci5oYXMob3B0aW9uLCAnaGlkZGVuJykpIGxpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG5cclxuXHRcdFx0XHRsaXN0LmFwcGVuZChsaSk7XHJcblxyXG5cdFx0XHRcdGkrKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGJ1aWxkKHNlbGVjdG9yLCByZUJ1aWxkKSB7XHJcblx0XHRsZXQgb3B0aW9uX3NlbGVjdGVkLFxyXG5cdFx0XHRwbGFjZWhvbGRlciA9IHNlbGVjdG9yLmRhdGFzZXQucGxhY2Vob2xkZXIgfHwgJycsXHJcblx0XHRcdGlzU2VhcmNoID0gc2VsZWN0b3IuZGF0YXNldC5zZWFyY2ggfHwgZmFsc2U7XHJcblxyXG5cdFx0aWYgKHNlbGVjdG9yLmRhdGFzZXQ/LmluaXRlZCA9PT0gJ3RydWUnICYmICFyZUJ1aWxkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH0gZWxzZSBpZiAocmVCdWlsZCkge1xyXG5cdFx0XHRWR1NlbGVjdC5kZXN0cm95KHNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGxhY2Vob2xkZXIgJiYgc2VsZWN0b3Iuc2VsZWN0ZWRJbmRleCA9PT0gMCkge1xyXG5cdFx0XHRvcHRpb25fc2VsZWN0ZWQgPSAnPHNwYW4gY2xhc3M9XCInKyBDTEFTU19OQU1FX1BMQUNFSE9MREVSICsnXCI+JyArIHBsYWNlaG9sZGVyICsgJzxzcGFuPic7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvcHRpb25fc2VsZWN0ZWQgPSBzZWxlY3Rvci5vcHRpb25zW3NlbGVjdG9yLnNlbGVjdGVkSW5kZXhdLmlubmVyVGV4dDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyDQodC+0LfQtNCw0LXQvCDQvtGB0L3QvtCy0L3QvtC5INGN0LvQtdC80LXQvdGCINGBINC60LvQsNGB0YHQsNC80Lgg0YHQtdC70LXQutGC0LBcclxuXHRcdGxldCBjbGFzc2VzID0gTWFuaXB1bGF0b3IuZ2V0KHNlbGVjdG9yLCdjbGFzcycpLFxyXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG5cdFx0Y2xhc3NlcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IF9jbGFzcyBvZiBjbGFzc2VzKSB7XHJcblx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChfY2xhc3MpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE1hbmlwdWxhdG9yLmhhcyhzZWxlY3RvciwgJ2Rpc2FibGVkJykpIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcclxuXHJcblx0XHRsZXQgZWxEYXRhID0gTWFuaXB1bGF0b3IuZ2V0KHNlbGVjdG9yKTtcclxuXHRcdGlmICghaXNFbXB0eU9iaihlbERhdGEpKSB7XHJcblx0XHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGVsRGF0YSkpIHtcclxuXHRcdFx0XHRNYW5pcHVsYXRvci5zZXQoZWxlbWVudCwnZGF0YS0nICsga2V5LCBlbERhdGFba2V5XSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyDQodC+0LfQtNCw0LXQvCDRjdC70LXQvNC10L3RgiDRgSDQvtGC0L7QsdGA0LDQttC10L3QuNC10Lwg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0LLQsNGA0LjQsNC90YLQsFxyXG5cdFx0bGV0IGN1cnJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGN1cnJlbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NVUlJFTlQpO1xyXG5cdFx0TWFuaXB1bGF0b3Iuc2V0KGN1cnJlbnQsICdkYXRhLXZnLXRvZ2dsZScsICdzZWxlY3QnKTtcclxuXHRcdE1hbmlwdWxhdG9yLnNldChjdXJyZW50LCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG5cdFx0Y3VycmVudC5pbm5lckhUTUwgPSBvcHRpb25fc2VsZWN0ZWQudHJpbSgpO1xyXG5cdFx0ZWxlbWVudC5hcHBlbmQoY3VycmVudCk7XHJcblxyXG5cdFx0Ly8g0KHQvtC30LTQsNC10Lwg0Y3Qu9C10LzQtdC90YIg0LLRi9C/0LDQtNCw0Y7RidC10LPQviDRgdC/0LjRgdC60LBcclxuXHRcdGxldCBkcm9wZG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0ZHJvcGRvd24uY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0RST1BET1dOKTtcclxuXHRcdGVsZW1lbnQuYXBwZW5kKGRyb3Bkb3duKTtcclxuXHJcblx0XHQvLyDQodC+0LfQtNCw0LXQvCDRgdC/0LjRgdC+0Log0Lgg0LLQsNGA0LjQsNC90YLRiyDRgdC10LvQtdC60YLQsFxyXG5cdFx0VkdTZWxlY3QuYnVpbGRMaXN0T3B0aW9ucyhzZWxlY3RvciwgZHJvcGRvd24pO1xyXG5cclxuXHRcdC8vINCU0L7QsdCw0LLQu9GP0LXQvCDQstGB0LUg0YHQvtC30LTQsNC90L3Ri9C5INC60L7QvdGC0LXQudC90LXRgCDQv9C+0YHQu9C1INGB0LXQu9C10LrRgtCwXHJcblx0XHRzZWxlY3Rvci5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgZWxlbWVudCk7XHJcblxyXG5cdFx0Ly8g0L/QvtC80LXRh9Cw0LXQvCDRjdC70LXQvNC10L3RgiDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0L3QvdGL0LxcclxuXHRcdHNlbGVjdG9yLmRhdGFzZXQuaW5pdGVkID0gJ3RydWUnO1xyXG5cclxuXHRcdGlmIChpc1NlYXJjaCkge1xyXG5cdFx0XHRsZXQgc2VhcmNoX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRzZWFyY2hfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TRUFSQ0gpO1xyXG5cclxuXHRcdFx0bGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRcdFx0TWFuaXB1bGF0b3Iuc2V0KGlucHV0LCAnbmFtZScsICd2Zy1zZWxlY3Qtc2VhcmNoJyk7XHJcblx0XHRcdE1hbmlwdWxhdG9yLnNldChpbnB1dCwgJ3R5cGUnLCAndGV4dCcpO1xyXG5cdFx0XHRNYW5pcHVsYXRvci5zZXQoaW5wdXQsICdwbGFjZWhvbGRlcicsICfQn9C+0LjRgdC6Li4uJyk7XHJcblxyXG5cdFx0XHRzZWFyY2hfY29udGFpbmVyLmFwcGVuZChpbnB1dCk7XHJcblx0XHRcdGRyb3Bkb3duLnByZXBlbmQoc2VhcmNoX2NvbnRhaW5lcik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXHJcblx0XHRpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdGZvciAoY29uc3QgZWxlbWVudCBvZiBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikpIHtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIub24oZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5zZWFyY2gpIHtcclxuXHRcdFx0bGV0IGlucHV0ID0gU2VsZWN0b3JzLmZpbmQoJ2lucHV0JywgdGhpcy5fZWxlbWVudCk7XHJcblx0XHRcdGlmIChpbnB1dCkgaW5wdXQuZm9jdXMoKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbEJhY2ssIHRoaXMuX2Ryb3AsIHRydWUsIDUwKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGlmIChpc0Rpc2FibGVkKHRoaXMuX2VsZW1lbnQpIHx8ICF0aGlzLl9pc1Nob3duKCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9jb21wbGV0ZUhpZGUoKTtcclxuXHR9XHJcblxyXG5cdF9jb21wbGV0ZUhpZGUoKSB7XHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSwge30pXHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpO1xyXG5cdFx0bGV0IHRvZ2dsZSA9IFNlbGVjdG9ycy5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCB0aGlzLl9lbGVtZW50KTtcclxuXHRcdE1hbmlwdWxhdG9yLnNldCh0b2dnbGUsICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0aWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnQgb2YgW10uY29uY2F0KC4uLmRvY3VtZW50LmJvZHkuY2hpbGRyZW4pKSB7XHJcblx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCAnbW91c2VvdmVyJywgbm9vcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTiwge30pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9kcm9wLCB0cnVlLCAxMCk7XHJcblx0fVxyXG5cclxuXHRfaXNTaG93bigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpO1xyXG5cdH1cclxuXHJcblx0cmVmcmVzaCgpIHtcclxuXHRcdGNvbnN0IHNlbGVjdCA9IHRoaXMuX2VsZW1lbnQucHJldmlvdXNTaWJsaW5nO1xyXG5cclxuXHRcdGxldCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KG9ic2VydmVyVGltb3V0KTtcclxuXHRcdFx0b2JzZXJ2ZXJUaW1vdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRWR1NlbGVjdC5idWlsZChzZWxlY3QsIHRydWUpO1xyXG5cdFx0XHR9LCAxMDApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShzZWxlY3QsIHtcclxuXHRcdFx0YXR0cmlidXRlRmlsdGVyOiBbJ2Rpc2FibGVkJywgJ3JlcXVpcmVkJywgJ3N0eWxlJywgJ2hpZGRlbiddLFxyXG5cdFx0XHRjaGlsZExpc3Q6IHRydWUsXHJcblx0XHRcdHN1YnRyZWU6IHRydWUsXHJcblx0XHRcdGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogdHJ1ZSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZGlzcG9zZSgpIHtcclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBkZXN0cm95KHNlbGVjdCkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBzZWxlY3QubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cclxuXHRcdGlmIChlbGVtZW50KSB7XHJcblx0XHRcdGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0NPTlRBSU5FUikpIHtcclxuXHRcdFx0XHRlbGVtZW50LnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRzZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XHJcblx0XHRcdFx0Wy4uLnNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKV0uZm9yRWFjaChmdW5jdGlvbiAoZWwsIGluZGV4KSB7XHJcblx0XHRcdFx0XHRpZiAoZWwuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpKSB7XHJcblx0XHRcdFx0XHRcdHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBoaWRlT3BlblRvZ2dsZXMoZXZlbnQpIHtcclxuXHRcdGNvbnN0IG9wZW5Ub2dnbGVzID0gU2VsZWN0b3JzLmZpbmRBbGwoJy52Zy1zZWxlY3Q6bm90KC5kaXNhYmxlZCk6bm90KDpkaXNhYmxlZCkuc2hvdycpO1xyXG5cclxuXHRcdGZvciAoY29uc3QgdG9nZ2xlIG9mIG9wZW5Ub2dnbGVzKSB7XHJcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBWR1NlbGVjdC5nZXRJbnN0YW5jZSh0b2dnbGUpO1xyXG5cdFx0XHRpZiAoIWNvbnRleHQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuJyArIENMQVNTX05BTUVfQ09OVEFJTkVSKSA9PT0gY29udGV4dC5fZWxlbWVudCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcblx0XHRcdGlmIChjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkpIHtcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiBjb250ZXh0Ll9lbGVtZW50IH1cclxuXHJcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcblx0XHRcdFx0cmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29udGV4dC5fY29tcGxldGVIaWRlKHJlbGF0ZWRUYXJnZXQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2xlYXJEcm9wcyhldmVudCkge1xyXG5cdFx0aWYgKGV2ZW50LmJ1dHRvbiA9PT0gMiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09ICdUYWInKSkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRWR1NlbGVjdC5oaWRlT3BlblRvZ2dsZXMoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY2hhbmdlU2VsZWN0b3Ioc2VsZWN0LCB2YWx1ZSwgZGF0YSA9IHt9KSB7XHJcblx0XHRpZiAoIWlzT2JqZWN0KGRhdGEpICYmIGlzRW1wdHlPYmooZGF0YSkpIHJldHVybjtcclxuXHJcblx0XHRzZWxlY3QudmFsdWUgPSBub3JtYWxpemVEYXRhKHZhbHVlKTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHNlbGVjdCwgRVZFTlRfS0VZX0NIQU5HRSwge2RhdGE6IGRhdGF9KTtcclxuXHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHNlbGVjdCwgJ2NoYW5nZScsIHtkYXRhOiBkYXRhfSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIHBhcmFtc1xyXG5cdCAqIEBwYXJhbSBpc1JlYnVpbGRcclxuXHQgKi9cclxuXHRzdGF0aWMgaW5pdChlbGVtZW50LCBwYXJhbXMgPSB7fSwgaXNSZWJ1aWxkID0gZmFsc2UpIHtcclxuXHRcdGxldCBlbG0gPSBWR1NlbGVjdC5idWlsZChlbGVtZW50KTtcclxuXHRcdFZHU2VsZWN0LmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxtLCBwYXJhbXMpO1xyXG5cdH1cclxufVxyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgVkdTZWxlY3QuY2xlYXJEcm9wcyk7XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IHRoaXMuY2xvc2VzdCgnLicgKyBDTEFTU19OQU1FX0NPTlRBSU5FUik7XHJcblxyXG5cdE1hbmlwdWxhdG9yLnNldCh0aGlzLCAnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kKCcudmctc2VsZWN0LnNob3cnKVxyXG5cdGlmIChhbHJlYWR5T3BlbiAmJiBhbHJlYWR5T3BlbiAhPT0gdGFyZ2V0KSB7XHJcblx0XHRWR1NlbGVjdC5nZXRJbnN0YW5jZShhbHJlYWR5T3BlbikuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgaW5zdGFuY2UgPSBWR1NlbGVjdC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldCk7XHJcblx0aW5zdGFuY2UudG9nZ2xlKHRoaXMpO1xyXG59KTtcclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX09QVElPTl9UT0dHTEUsIGZ1bmN0aW9uIChlKSB7XHJcblx0bGV0IGVsID0gZS50YXJnZXQ7XHJcblxyXG5cdGlmICghZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XHJcblx0XHRsZXQgY29udGFpbmVyID0gZWwuY2xvc2VzdCgnLicgKyBDTEFTU19OQU1FX0NPTlRBSU5FUiksXHJcblx0XHRcdG9wdGlvbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLicgKyBDTEFTU19OQU1FX09QVElPTik7XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMubGVuZ3RoKSB7XHJcblx0XHRcdGZvciAoY29uc3Qgb3B0aW9uIG9mIG9wdGlvbnMpIHtcclxuXHRcdFx0XHRvcHRpb24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcblxyXG5cdFx0Y29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy4nICsgQ0xBU1NfTkFNRV9DVVJSRU5UKS5pbm5lclRleHQgPSBlbC5pbm5lclRleHQ7XHJcblx0XHRjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG5cclxuXHRcdGxldCBzZWxlY3QgPSBjb250YWluZXIucHJldmlvdXNTaWJsaW5nO1xyXG5cdFx0VkdTZWxlY3QuY2hhbmdlU2VsZWN0b3Ioc2VsZWN0LCBlbC5kYXRhc2V0LnZhbHVlLCB7dmFsdWU6IGVsLmRhdGFzZXQudmFsdWUsIHRpdGxlOiBlbC5pbm5lckhUTUx9KVxyXG5cdH1cclxufSk7XHJcblxyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9VUF9EQVRBX0FQSSwgU0VMRUNUT1JfU0VBUkNIX1RPR0dMRSwgZnVuY3Rpb24gKGUpIHtcclxuXHRsZXQgZWwgPSB0aGlzO1xyXG5cclxuXHRsZXQgc2VsZWN0TGlzdCA9IGVsPy5jbG9zZXN0KCcuJyArIENMQVNTX05BTUVfRFJPUERPV04pLnF1ZXJ5U2VsZWN0b3IoJy4nICsgQ0xBU1NfTkFNRV9MSVNUKTtcclxuXHRpZiAoc2VsZWN0TGlzdCkge1xyXG5cdFx0bGV0IG9wdGlvbnMgPSBbLi4uc2VsZWN0TGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIENMQVNTX05BTUVfT1BUSU9OKV0sXHJcblx0XHRcdG9wdGlvbnNHcm91cCA9IFsuLi5zZWxlY3RMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgQ0xBU1NfTkFNRV9PUFRHUk9VUCldLFxyXG5cdFx0XHR2YWx1ZSA9IGVsPy52YWx1ZTtcclxuXHJcblx0XHRvcHRpb25zID0gb3B0aW9ucy5jb25jYXQob3B0aW9uc0dyb3VwKTtcclxuXHJcblx0XHRmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zKSB7XHJcblx0XHRcdE1hbmlwdWxhdG9yLnNob3cob3B0aW9uKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodmFsdWUubGVuZ3RoKSB7XHJcblx0XHRcdHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdHZhbHVlID0gdHJhbnNsaXRlcmF0ZSh2YWx1ZSwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zKSB7XHJcblx0XHRcdFx0bGV0IHRleHQgPSBvcHRpb24uaW5uZXJUZXh0LnRvTG93ZXJDYXNlKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0ZXh0LmluZGV4T2YodmFsdWUpID09PSAtMSkgTWFuaXB1bGF0b3IuaGlkZShvcHRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfUkVTRVRfREFUQV9BUEksICdmb3JtJywgZnVuY3Rpb24gKCkge1xyXG5cdFNlbGVjdG9ycy5maW5kQWxsKCdzZWxlY3QuJyArIENMQVNTX05BTUVfQ09OVEFJTkVSLCB0aGlzKS5mb3JFYWNoKGVsID0+IHtcclxuXHRcdFZHU2VsZWN0LmJ1aWxkKGVsLCB0cnVlKVxyXG5cdH0pO1xyXG59KTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR1NlbGVjdDsiLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtpc0Rpc2FibGVkLCBpc1Zpc2libGUsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vZXZlbnRcIjtcclxuaW1wb3J0IHtkaXNtaXNzVHJpZ2dlcn0gZnJvbSBcIi4uLy4uL21vZHVsZS1mblwiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvY29tcG9uZW50cy9iYWNrZHJvcFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2pzL2NvbXBvbmVudHMvb3ZlcmZsb3dcIjtcclxuXHJcbi8qKlxyXG4gKiBDb25zdGFudHNcclxuICovXHJcbmNvbnN0IE5BTUUgPSAnc2lkZWJhcic7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnNpZGViYXInO1xyXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRT0gJ1tkYXRhLXZnLXRvZ2dsZT1cInNpZGViYXJcIl0nO1xyXG5cclxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnO1xyXG5jb25zdCBDTEFTU19OQU1FX09QRU4gPSAndmctc2lkZWJhci1vcGVuJztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgPSBgJHtOQU1FX0tFWX0uaGlkZWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSBgJHtOQU1FX0tFWX0uaGlkZGVuYDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1cgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICA9IGAke05BTUVfS0VZfS5zaG93bmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9MT0FERUQgPSBgJHtOQU1FX0tFWX0ubG9hZGVkYDtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzLiR7TkFNRV9LRVl9YDtcclxuY29uc3QgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEID0gYGhpZGVQcmV2ZW50ZWQuJHtOQU1FX0tFWX1gO1xyXG5jb25zdCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfUE9QU1RBVEVfREFUQV9BUEkgPSBgcG9wc3RhdGUuJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5jb25zdCBFVkVOVF9LRVlfRE9NX0xPQURFRF9EQVRBX0FQSSA9IGBET01Db250ZW50TG9hZGVkLiR7TkFNRV9LRVl9LmRhdGEuYXBpYDtcclxuXHJcbmNsYXNzIFZHU2lkZWJhciBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRiYWNrZHJvcDogdHJ1ZSxcclxuXHRcdFx0b3ZlcmZsb3c6IHRydWUsXHJcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxyXG5cdFx0XHRoYXNoOiBmYWxzZSxcclxuXHRcdFx0YW5pbWF0aW9uOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiBmYWxzZSxcclxuXHRcdFx0XHRpbjogJ2FuaW1hdGVfX3JvbGxJbicsXHJcblx0XHRcdFx0b3V0OiAnYW5pbWF0ZV9fcm9sbE91dCcsXHJcblx0XHRcdFx0ZGVsYXk6IDgwMCxcclxuXHRcdFx0fSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnLFxyXG5cdFx0XHRcdG1ldGhvZDogJ2dldCcsXHJcblx0XHRcdFx0bG9hZGVyOiBmYWxzZSxcclxuXHRcdFx0fVxyXG5cdFx0fSwgcGFyYW1zKSk7XHJcblxyXG5cdFx0dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblxyXG5cdFx0dGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSA9ICF0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmVuYWJsZSA/IDAgOiB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5O1xyXG5cdFx0dGhpcy5fYW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIFZHU2lkZWJhci5OQU1FX0tFWSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbik7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUUoKSB7XHJcblx0XHRyZXR1cm4gTkFNRTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkFNRV9LRVkoKSB7XHJcblx0XHRyZXR1cm4gTkFNRV9LRVlcclxuXHR9XHJcblxyXG5cdHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuX2lzU2hvd24oKSA/IHRoaXMuc2hvdyhyZWxhdGVkVGFyZ2V0KSA6IHRoaXMuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0c2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRpZiAoaXNEaXNhYmxlZChfdGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRpZiAocmVsYXRlZFRhcmdldCkgX3RoaXMuX3BhcmFtcyA9IF90aGlzLl9nZXRQYXJhbXMocmVsYXRlZFRhcmdldCwgX3RoaXMuX3BhcmFtcyk7XHJcblxyXG5cdFx0X3RoaXMuX3JvdXRlKGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIoX3RoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9MT0FERUQsIHtzdGF0czogc3RhdHVzLCBkYXRhOiBkYXRhfSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1csIHsgcmVsYXRlZFRhcmdldCB9KVxyXG5cdFx0aWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKF90aGlzLl9wYXJhbXMuYmFja2Ryb3ApIHtcclxuXHRcdFx0QmFja2Ryb3Auc2hvdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdE92ZXJmbG93LmFwcGVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMuaGFzaCkge1xyXG5cdFx0XHR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgXCJ2Zy1zaWRlYmFyLW9wZW5cIiwgXCIjXCIgKyB0aGlzLl9lbGVtZW50LmlkKTtcclxuXHJcblx0XHRcdEV2ZW50SGFuZGxlci5vbih3aW5kb3csIEVWRU5UX0tFWV9QT1BTVEFURV9EQVRBX0FQSSwgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRfdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHJcblx0XHRjb25zdCBjb21wbGV0ZUNhbGxCYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRFdmVudEhhbmRsZXIub24oU2VsZWN0b3JzLmZpbmQoJy52Zy1iYWNrZHJvcCcpLCAnbW91c2Vkb3duLnZnLmJhY2tkcm9wJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcihfdGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOLCB7IHJlbGF0ZWRUYXJnZXQgfSk7XHJcblx0XHR9XHJcblx0XHRfdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxCYWNrLCBfdGhpcy5fZWxlbWVudCwgdHJ1ZSwgNTApXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQoX3RoaXMuX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG5cdFx0Y29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cdFx0aWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdF90aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdFx0X3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5iYWNrZHJvcCkge1xyXG5cdFx0XHRcdFx0QmFja2Ryb3AuaGlkZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdFx0XHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfdGhpcy5fcGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdFx0XHRPdmVyZmxvdy5kZXN0cm95KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoX3RoaXMuX3BhcmFtcy5oYXNoKSB7XHJcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZShcIlwiLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlQ2FsbGJhY2ssIHRoaXMuX2VsZW1lbnQsIHRydWUpO1xyXG5cdFx0fSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSk7XHJcblx0fVxyXG5cclxuXHRkaXNwb3NlKCkge1xyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X2lzU2hvd24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKTtcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykgcmV0dXJuO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEKVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5kaXNtaXNzVHJpZ2dlcihWR1NpZGViYXIpO1xyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KVxyXG5cclxuXHRjb25zdCBhbHJlYWR5T3BlbiA9IFNlbGVjdG9ycy5maW5kKCcudmctc2lkZWJhci5zaG93JylcclxuXHRpZiAoYWxyZWFkeU9wZW4gJiYgYWxyZWFkeU9wZW4gIT09IHRhcmdldCkge1xyXG5cdFx0VkdTaWRlYmFyLmdldEluc3RhbmNlKGFscmVhZHlPcGVuKS5oaWRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGRhdGEgPSBWR1NpZGViYXIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0ZGF0YS50b2dnbGUodGhpcyk7XHJcbn0pO1xyXG5cclxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfRE9NX0xPQURFRF9EQVRBX0FQSSwgZnVuY3Rpb24gKCkge1xyXG5cdGxldCB0YXJnZXRIYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XHJcblx0aWYgKHRhcmdldEhhc2gpIHtcclxuXHRcdGxldCB0YXJnZXQgPSBTZWxlY3RvcnMuZmluZCgnIycgKyB0YXJnZXRIYXNoKTtcclxuXHRcdGlmICh0YXJnZXQgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndmctc2lkZWJhcicpKSB7XHJcblx0XHRcdGlmIChpc0Rpc2FibGVkKHRhcmdldCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGRhdGEgPSBWR1NpZGViYXIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXHJcblx0XHRcdGRhdGEudG9nZ2xlKCk7XHJcblx0XHR9XHJcblx0fVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL2V2ZW50XCI7XHJcbmltcG9ydCB7ZGlzbWlzc1RyaWdnZXJ9IGZyb20gXCIuLi8uLi9tb2R1bGUtZm5cIjtcclxuaW1wb3J0IHtleGVjdXRlLCBpc0Rpc2FibGVkLCBtYWtlUmFuZG9tU3RyaW5nLCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi8uLi8uLi91dGlscy9qcy9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvanMvZG9tL3NlbGVjdG9yc1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnN0YW50c1xyXG4gKi9cclxuY29uc3QgTkFNRSA9ICd0b2FzdCc7XHJcbmNvbnN0IE5BTUVfS0VZID0gJ3ZnLnRvYXN0JztcclxuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEU9ICdbZGF0YS12Zy10b2dnbGU9XCJ0b2FzdFwiXSc7XHJcblxyXG5jb25zdCBDTEFTU19OQU1FX09QRU4gICAgPSAndmctdG9hc3Qtb3Blbic7XHJcbmNvbnN0IENMQVNTX05BTUVfU0hPVyAgICA9ICdzaG93JztcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFICAgICA9IGAke05BTUVfS0VZfS5oaWRlYDtcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiAgID0gYCR7TkFNRV9LRVl9LmhpZGRlbmA7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XICAgICA9IGAke05BTUVfS0VZfS5zaG93YDtcclxuY29uc3QgRVZFTlRfS0VZX1NIT1dOICAgID0gYCR7TkFNRV9LRVl9LnNob3duYDtcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCAgID0gYCR7TkFNRV9LRVl9LmxvYWRlZGA7XHJcblxyXG5jb25zdCBFVkVOVF9LRVlfS0VZRE9XTl9ESVNNSVNTID0gYGtleWRvd24uZGlzbWlzcy4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFX1BSRVZFTlRFRCAgPSBgaGlkZVByZXZlbnRlZC4ke05BTUVfS0VZfWA7XHJcbmNvbnN0IEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSAgPSBgY2xpY2suJHtOQU1FX0tFWX0uZGF0YS5hcGlgO1xyXG5cclxuY2xhc3MgVkdUb2FzdCBleHRlbmRzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmFtcyA9IHt9KSB7XHJcblx0XHRzdXBlcihlbGVtZW50LCBwYXJhbXMpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcyA9IHRoaXMuX2dldFBhcmFtcyhlbGVtZW50LCBtZXJnZURlZXBPYmplY3Qoe1xyXG5cdFx0XHRzdGF0aWM6IHRydWUsXHJcblx0XHRcdHBsYWNlbWVudDogJ2JvdHRvbSBjZW50ZXInLFxyXG5cdFx0XHRhdXRvaGlkZTogZmFsc2UsXHJcblx0XHRcdGRlbGF5OiAzMDAwLFxyXG5cdFx0XHRlbmFibGVDbGlja1RvYXN0OiB0cnVlLFxyXG5cdFx0XHRlbmFibGVCdXR0b25DbG9zZTogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdHRoZW1lOiAnZGFyaycsXHJcblx0XHRcdHN0YWNrOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiB0cnVlLFxyXG5cdFx0XHRcdG1heDogNVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhbmltYXRpb246IHtcclxuXHRcdFx0XHRlbmFibGU6IHRydWUsXHJcblx0XHRcdFx0aW46ICdhbmltYXRlX19mYWRlSW4nLFxyXG5cdFx0XHRcdG91dDogJ2FuaW1hdGVfX2ZhZGVPdXQnLFxyXG5cdFx0XHRcdGRlbGF5OiA0MDAsXHJcblx0XHRcdH0sXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdnZXQnLFxyXG5cdFx0XHRcdGxvYWRlcjogZmFsc2UsXHJcblx0XHRcdH1cclxuXHRcdH0sIHBhcmFtcykpO1xyXG5cclxuXHRcdHRoaXMuX3BhcmFtcy5hbmltYXRpb24uZGVsYXkgPSAhdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5lbmFibGUgPyAwIDogdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheTtcclxuXHRcdHRoaXMuX2FuaW1hdGlvbih0aGlzLl9lbGVtZW50LCBWR1RvYXN0Lk5BTUVfS0VZLCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uKTtcclxuXHRcdHRoaXMuX2Rpc21pc3NFbGVtZW50KCk7XHJcblx0XHR0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cclxuXHRcdHRoaXMuX3RpbWVvdXQgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBOQU1FKCkge1xyXG5cdFx0cmV0dXJuIE5BTUU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE5BTUVfS0VZKCkge1xyXG5cdFx0cmV0dXJuIE5BTUVfS0VZXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcnVuKHRleHQsIHBhcmFtcyA9IHt9LCBjYWxsYmFjaykge1xyXG5cdFx0cmV0dXJuIFZHVG9hc3QuYnVpbGQodGV4dCwgcGFyYW1zLCBjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgYnVpbGQodGV4dCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdFx0cGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHtcclxuXHRcdFx0cGxhY2VtZW50OiAnYm90dG9tIGNlbnRlcicsXHJcblx0XHRcdHN0YXRpYzogZmFsc2UsXHJcblx0XHRcdHRoZW1lOiAnZGFyaycsXHJcblx0XHRcdHN0YWNrOiB7XHJcblx0XHRcdFx0ZW5hYmxlOiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHR9LCBwYXJhbXMpO1xyXG5cclxuXHRcdGxldCB0YXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdCcpO1xyXG5cdFx0dGFyZ2V0LmlkID0gJ3ZnLXRvYXN0LScgKyBtYWtlUmFuZG9tU3RyaW5nKCk7XHJcblxyXG5cdFx0aWYgKCd0aGVtZScgaW4gcGFyYW1zKSB7XHJcblx0XHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC0nICsgcGFyYW1zLnRoZW1lKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ3BsYWNlbWVudCcgaW4gcGFyYW1zKSB7XHJcblx0XHRcdHBhcmFtcy5wbGFjZW1lbnQuc3BsaXQoJyAnKS5mb3JFYWNoKHZhbCA9PiB0YXJnZXQuY2xhc3NMaXN0LmFkZCh2YWwpKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0d3JhcHBlci5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC13cmFwcGVyJyk7XHJcblxyXG5cdFx0aWYgKCd0eXBlJyBpbiBwYXJhbXMpIHtcclxuXHRcdFx0bGV0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC1pY29uJyk7XHJcblxyXG5cdFx0XHR3cmFwcGVyLmFwcGVuZChpY29uKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0Y29udGVudC5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC1jb250ZW50Jyk7XHJcblxyXG5cdFx0bGV0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgndmctdG9hc3QtYm9keScpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0Ym9keS5pbm5lckhUTUwgPSB0ZXh0O1xyXG5cdFx0XHRjb250ZW50LmFwcGVuZChib2R5KTtcclxuXHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0ZXh0KSkge1xyXG5cdFx0XHRpZiAodGV4dC5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0bGV0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdGhlYWRlci5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC1oZWFkZXInKTtcclxuXHRcdFx0XHRoZWFkZXIuaW5uZXJIVE1MID0gdGV4dFswXTtcclxuXHRcdFx0XHRjb250ZW50LmFwcGVuZChoZWFkZXIpO1xyXG5cclxuXHRcdFx0XHRib2R5LmlubmVySFRNTCA9IHRleHRbMV07XHJcblx0XHRcdFx0Y29udGVudC5hcHBlbmQoYm9keSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ym9keS5pbm5lckhUTUwgPSB0ZXh0WzBdO1xyXG5cdFx0XHRcdGNvbnRlbnQuYXBwZW5kKGJvZHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0d3JhcHBlci5hcHBlbmQoY29udGVudCk7XHJcblxyXG5cdFx0aWYgKCdlbmFibGVCdXR0b25DbG9zZScgaW4gcGFyYW1zICYmIHBhcmFtcy5lbmFibGVCdXR0b25DbG9zZSkge1xyXG5cdFx0XHRsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd2Zy10b2FzdC1idXR0b24nKTtcclxuXHRcdFx0YnV0dG9uLmlubmVySFRNTCA9ICc8YnV0dG9uIGNsYXNzPVwidmctYnRuLWNsb3NlXCIgZGF0YS12Zy1kaXNtaXNzPVwidG9hc3RcIj48L2J1dHRvbj4nO1xyXG5cdFx0XHR3cmFwcGVyLmFwcGVuZChidXR0b24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRhcmdldC5hcHBlbmQod3JhcHBlcik7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZCh0YXJnZXQpO1xyXG5cclxuXHRcdGxldCBpbnN0YW5jZSA9ICBWR1RvYXN0LmdldE9yQ3JlYXRlSW5zdGFuY2UodGFyZ2V0LCBwYXJhbXMpO1xyXG5cdFx0ZXhlY3V0ZShjYWxsYmFjaywgW2luc3RhbmNlXSk7XHJcblx0XHRpbnN0YW5jZS5zaG93KCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGUocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9pc1Nob3duKCkgPyB0aGlzLnNob3cocmVsYXRlZFRhcmdldCkgOiB0aGlzLmhpZGUoKTtcclxuXHR9XHJcblxyXG5cdHNob3cocmVsYXRlZFRhcmdldCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9jbGVhclRpbWVvdXQoKTtcclxuXHJcblx0XHR0aGlzLl9wYXJhbXMgPSB0aGlzLl9nZXRQYXJhbXMocmVsYXRlZFRhcmdldCB8fCB7fSwgdGhpcy5fcGFyYW1zKTtcclxuXHRcdHRoaXMuX3JvdXRlKGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0xPQURFRCwge3N0YXRzOiBzdGF0dXMsIGRhdGE6IGRhdGF9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XLCB7IHJlbGF0ZWRUYXJnZXQgfSlcclxuXHRcdGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfT1BFTik7XHJcblxyXG5cdFx0dGhpcy5fc2V0UGxhY2VtZW50KCk7XHJcblxyXG5cdFx0Y29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHRcdEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTiwgeyByZWxhdGVkVGFyZ2V0IH0pO1xyXG5cdFx0XHR0aGlzLl9zY2hlZHVsZUhpZGUoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSwgMCk7XHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0aWYgKGlzRGlzYWJsZWQodGhpcy5fZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblx0XHRpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudD8uY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpO1xyXG5cclxuXHRcdFx0Y29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcclxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9PUEVOKTtcclxuXHRcdFx0XHRFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5zdGFjay5lbmFibGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuX3NldFBsYWNlbWVudCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLl9wYXJhbXMuc3RhdGljKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRpc3Bvc2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZUNhbGxiYWNrLCB0aGlzLl9lbGVtZW50LCBmYWxzZSwgdGhpcy5fcGFyYW1zLmFuaW1hdGlvbi5kZWxheSk7XHJcblx0XHR9LCB0aGlzLl9wYXJhbXMuYW5pbWF0aW9uLmRlbGF5KTtcclxuXHR9XHJcblxyXG5cdGRpc3Bvc2UoKSB7XHJcblx0XHR0aGlzLl9jbGVhclRpbWVvdXQoKTtcclxuXHRcdGlmICh0aGlzLl9pc1Nob3duKCkpIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9wYXJhbXMuc3RhdGljKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxuXHJcblx0X3NjaGVkdWxlSGlkZSgpIHtcclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLmF1dG9oaWRlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl90aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0fSwgdGhpcy5fcGFyYW1zLmRlbGF5KTtcclxuXHR9XHJcblxyXG5cdF9pc1Nob3duKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVyk7XHJcblx0fVxyXG5cclxuXHRfc2V0UGxhY2VtZW50KCkge1xyXG5cdFx0bGV0IGVsbXMgPSB0aGlzLl9lbmFibGVTdGFjaygpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wYXJhbXMuc3RhY2suZW5hYmxlKSB7XHJcblx0XHRcdGlmIChlbG1zLmxlbmd0aCA+IHRoaXMuX3BhcmFtcy5zdGFjay5tYXgpIHtcclxuXHRcdFx0XHRsZXQgZWxtID0gZWxtcy5zaGlmdCgpO1xyXG5cdFx0XHRcdFZHVG9hc3QuZ2V0SW5zdGFuY2UoZWxtLmVsKS5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRlbG1zLmZvckVhY2goZWxtID0+IHtcclxuXHRcdFx0bGV0IGlzUGxhY2VtZW50Q2xhc3NUb3AgPSBlbG0uZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b3AnKSxcclxuXHRcdFx0XHRpc1BsYWNlbWVudENsYXNzQm90dG9tID0gZWxtLmVsLmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tJyksXHJcblx0XHRcdFx0aXNQbGFjZW1lbnRDbGFzc0xlZnQgPSBlbG0uZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JyksXHJcblx0XHRcdFx0aXNQbGFjZW1lbnRDbGFzc1JpZ2h0ID0gZWxtLmVsLmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSxcclxuXHRcdFx0XHRpc1BsYWNlbWVudENsYXNzQ2VudGVyID0gZWxtLmVsLmNsYXNzTGlzdC5jb250YWlucygnY2VudGVyJyk7XHJcblxyXG5cdFx0XHRpZiAoIWlzUGxhY2VtZW50Q2xhc3NUb3AgJiZcclxuXHRcdFx0XHQhaXNQbGFjZW1lbnRDbGFzc0JvdHRvbSAmJlxyXG5cdFx0XHRcdCFpc1BsYWNlbWVudENsYXNzQ2VudGVyICYmXHJcblx0XHRcdFx0IWlzUGxhY2VtZW50Q2xhc3NSaWdodCAmJlxyXG5cdFx0XHRcdCFpc1BsYWNlbWVudENsYXNzTGVmdFxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRpc1BsYWNlbWVudENsYXNzQm90dG9tID0gdHJ1ZTtcclxuXHRcdFx0XHRpc1BsYWNlbWVudENsYXNzQ2VudGVyID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGlzUGxhY2VtZW50Q2xhc3NDZW50ZXIpIHtcclxuXHRcdFx0XHRpZiAoaXNQbGFjZW1lbnRDbGFzc0xlZnQpIHtcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5sZWZ0ID0gMDtcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5ib3R0b20gPSAnY2FsYyg1MCUgLSAoJysgZWxtLnRvcCArJ3B4KSknO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaXNQbGFjZW1lbnRDbGFzc1JpZ2h0KSB7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUucmlnaHQgPSAwO1xyXG5cdFx0XHRcdFx0ZWxtLmVsLnN0eWxlLmJvdHRvbSA9ICdjYWxjKDUwJSAtICgnKyBlbG0udG9wICsncHgpKSc7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpc1BsYWNlbWVudENsYXNzQm90dG9tKSB7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUubGVmdCA9ICdjYWxjKDUwJSAtICgnKyBlbG0uZWwuY2xpZW50V2lkdGggKydweCkgLyAyKSc7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUuYm90dG9tID0gZWxtLnRvcCArICdweCc7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpc1BsYWNlbWVudENsYXNzVG9wKSB7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUubGVmdCA9ICdjYWxjKDUwJSAtICgnKyBlbG0uZWwuY2xpZW50V2lkdGggKydweCkgLyAyKSc7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUudG9wID0gZWxtLnRvcCArICdweCc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVsbS5lbC5zdHlsZS5sZWZ0ID0gJ2NhbGMoNTAlIC0gKCcrIGVsbS5lbC5jbGllbnRIZWlnaHQgKydweCkgLyAyKSc7XHJcblx0XHRcdFx0XHRlbG0uZWwuc3R5bGUuYm90dG9tID0gJ2NhbGMoNTAlIC0gJysgZWxtLnRvcCArJ3B4KSc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChpc1BsYWNlbWVudENsYXNzTGVmdCkgZWxtLmVsLnN0eWxlLmxlZnQgPSAwO1xyXG5cdFx0XHRcdGlmIChpc1BsYWNlbWVudENsYXNzQm90dG9tKSBlbG0uZWwuc3R5bGUuYm90dG9tID0gZWxtLnRvcCArICdweCc7XHJcblx0XHRcdFx0aWYgKGlzUGxhY2VtZW50Q2xhc3NUb3ApIGVsbS5lbC5zdHlsZS50b3AgPSBlbG0udG9wICsgJ3B4JztcclxuXHRcdFx0XHRpZiAoaXNQbGFjZW1lbnRDbGFzc1JpZ2h0KSBlbG0uZWwuc3R5bGUucmlnaHQgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdF9lbmFibGVTdGFjaygpIHtcclxuXHRcdGxldCBlbG1zU2hvd24gPSBbLi4uIFNlbGVjdG9ycy5maW5kQWxsKCcudmctdG9hc3Quc2hvdycpXSwgdG9wID0gMDtcclxuXHJcblx0XHRpZiAoIXRoaXMuX3BhcmFtcy5zdGFjay5lbmFibGUpIHtcclxuXHRcdFx0ZWxtc1Nob3duLmZvckVhY2goZWwgPT4ge1xyXG5cdFx0XHRcdGlmIChlbCAhPT0gdGhpcy5fZWxlbWVudCkge1xyXG5cdFx0XHRcdFx0VkdUb2FzdC5nZXRJbnN0YW5jZShlbCkuaGlkZSgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0cmV0dXJuIFt7XHJcblx0XHRcdFx0ZWw6IHRoaXMuX2VsZW1lbnQsXHJcblx0XHRcdFx0dG9wOiAwLFxyXG5cdFx0XHR9XTtcclxuXHRcdH1cclxuXHJcblx0XHRlbG1zU2hvd24gPSBlbG1zU2hvd24ubWFwKGVsID0+IHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRlbDogZWwsXHJcblx0XHRcdFx0dG9wOiBlbC5jbGllbnRIZWlnaHRcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGVsbXNTaG93bi5tYXAoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0XHRpZiAoaW5kZXggPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0ZWw6IHZhbHVlLmVsLFxyXG5cdFx0XHRcdFx0dG9wOiAwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRvcCArPSB2YWx1ZS50b3BcclxuXHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdGVsOiB2YWx1ZS5lbCxcclxuXHRcdFx0XHRcdHRvcDogdG9wXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdF9jbGVhclRpbWVvdXQoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCk7XHJcblx0XHR0aGlzLl90aW1lb3V0ID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuXHRcdEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfS0VZX0tFWURPV05fRElTTUlTUywgZXZlbnQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ICE9PSAnRXNjYXBlJykgcmV0dXJuO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3BhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfS0VZX0hJREVfUFJFVkVOVEVEKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhcmFtcy5lbmFibGVDbGlja1RvYXN0KSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmctdG9hc3QtcG9pbnRlcicpO1xyXG5cclxuXHRcdFx0RXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlfQ0xJQ0tfREFUQV9BUEksICcjJyArIHRoaXMuX2VsZW1lbnQuaWQsICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmRpc21pc3NUcmlnZ2VyKFZHVG9hc3QpO1xyXG5cclxuLyoqXHJcbiAqIERhdGEgQVBJIGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0tFWV9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdGNvbnN0IHRhcmdldCA9IFNlbGVjdG9ycy5nZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpO1xyXG5cclxuXHRpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0fVxyXG5cclxuXHRpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cdEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9LRVlfSElEREVOLCAoKSA9PiB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHR9KTtcclxuXHJcblx0Y29uc3QgZGF0YSA9IFZHVG9hc3QuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpO1xyXG5cdGRhdGEudG9nZ2xlKHRoaXMpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHVG9hc3Q7XHJcbiIsImltcG9ydCB7aXNFbGVtZW50LCBtZXJnZURlZXBPYmplY3R9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi4vZG9tL2V2ZW50XCI7XHJcblxyXG4vKipcclxuICog0JrQu9Cw0YHRgdGLINC00LvRjyDQsNC90LjQvNCw0YbQuNC5INGB0LzQvtGC0YDQuNC8INC30LTQtdGB0YxcclxuICogaHR0cHM6Ly9hbmltYXRlLnN0eWxlL1xyXG4gKlxyXG4gKiDQoNCw0LHQvtGC0LDQtdGCINGBINC80L7QtNGD0LvRj9C80Lgg0YMg0LrQvtGC0L7RgNGL0YUg0LXRgdGC0Ywg0YHQvtCx0YvRgtC40Y8gc2hvdywgaGlkZSwgaGlkZGVuXHJcbiAqL1xyXG5jbGFzcyBBbmltYXRpb24ge1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIGtleSwgcGFyYW1zID0ge30pIHtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGVuYWJsZTogZmFsc2UsXHJcblx0XHRcdGluOiAnYW5pbWF0ZV9fYmFja0luVXAnLFxyXG5cdFx0XHRvdXQ6ICdhbmltYXRlX19iYWNrT3V0VXAnLFxyXG5cdFx0XHRkZWxheTogMCxcclxuXHRcdH0sIHBhcmFtcyk7XHJcblxyXG5cdFx0dGhpcy5jbGFzc2VzID0ge1xyXG5cdFx0XHRhbmltYXRlZDogJ2FuaW1hdGVfX2FuaW1hdGVkJ1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5fcGFyYW1zLmVuYWJsZSkgcmV0dXJuO1xyXG5cdFx0aWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMuX25hbWVfa2V5ID0ga2V5O1xyXG5cclxuXHRcdGlmICghdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzc2VzLmFuaW1hdGVkKSkge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLmFuaW1hdGVkKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl90cmlnZ2VycygpO1xyXG5cdH1cclxuXHJcblx0X3RyaWdnZXJzKCkge1xyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25hbWVfa2V5ICsgJy5zaG93JywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fcGFyYW1zLm91dCk7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLl9wYXJhbXMuaW4pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25hbWVfa2V5ICsgJy5oaWRlJywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fcGFyYW1zLmluKTtcclxuXHRcdFx0dGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX3BhcmFtcy5vdXQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0RXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25hbWVfa2V5ICsgJy5oaWRkZW4nLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9wYXJhbXMub3V0KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uOyIsImltcG9ydCB7ZXhlY3V0ZX0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi9kb20vc2VsZWN0b3JzXCI7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4uL2RvbS9ldmVudFwiO1xyXG5pbXBvcnQgT3ZlcmZsb3cgZnJvbSBcIi4vb3ZlcmZsb3dcIjtcclxuXHJcbmNvbnN0IE5BTUUgPSAnYmFja2Ryb3AnO1xyXG5jb25zdCBDTEFTU19OQU1FID0gJ3ZnLWJhY2tkcm9wJztcclxuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnO1xyXG5jb25zdCBFVkVOVF9NT1VTRURPV04gPSBgbW91c2Vkb3duLnZnLiR7TkFNRX1gO1xyXG5cclxubGV0IGJhY2tkcm9wX2RlbGF5ID0gNTAwO1xyXG5cclxuY2xhc3MgQmFja2Ryb3Age1xyXG5cdHN0YXRpYyBzaG93KGNhbGxiYWNrKSB7XHJcblx0XHRCYWNrZHJvcC5fYXBwZW5kKClcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGhpZGUoY2FsbGJhY2spIHtcclxuXHRcdEJhY2tkcm9wLl9kZXN0cm95KCk7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBfYXBwZW5kKCkge1xyXG5cdFx0aWYgKFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFja2Ryb3ApO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfRkFERSlcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRFdmVudEhhbmRsZXIub24oYmFja2Ryb3AsIEVWRU5UX01PVVNFRE9XTiwgKCkgPT4ge1xyXG5cdFx0XHRCYWNrZHJvcC5oaWRlKClcclxuXHRcdFx0T3ZlcmZsb3cuZGVzdHJveSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgX2Rlc3Ryb3koKSB7XHJcblx0XHRsZXQgZWxlbWVudCA9IFNlbGVjdG9ycy5maW5kKCcuJyArIENMQVNTX05BTUUpO1xyXG5cdFx0aWYgKCFlbGVtZW50KSByZXR1cm47XHJcblxyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHR9LCBiYWNrZHJvcF9kZWxheSk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWNrZHJvcDsiLCJpbXBvcnQge01hbmlwdWxhdG9yfSBmcm9tIFwiLi4vZG9tL21hbmlwdWxhdG9yXCI7XHJcblxyXG4vKipcclxuICog0JrQu9Cw0YHRgSBPdmVyZmxvd1xyXG4gKiDQl9Cw0L/RgNC10YnQsNC10YIg0YHQutGA0L7Qu9C70LjQvdCzINC4INGD0LHQuNGA0LDQtdGCINC10LPQviwg0LrQvtC80L/QtdC90YHQuNGA0YPRjyDQvtGC0YHRgtGD0L/QvtC8XHJcbiAqL1xyXG5cclxuY2xhc3MgT3ZlcmZsb3cge1xyXG5cdHN0YXRpYyBhcHBlbmQoKSB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGdldFdpZHRoKCkgKyAncHgnO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdldFdpZHRoKCkge1xyXG5cdFx0XHRjb25zdCBkb2N1bWVudFdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcblx0XHRcdHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50V2lkdGgpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZGVzdHJveSgpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJyc7XHJcblxyXG5cdFx0bGV0IHN0eWxlcyA9IE1hbmlwdWxhdG9yLmdldChkb2N1bWVudC5ib2R5LCAnc3R5bGUnKTtcclxuXHRcdGlmICghc3R5bGVzKSBNYW5pcHVsYXRvci5yZW1vdmUoZG9jdW1lbnQuYm9keSwgJ3N0eWxlJyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPdmVyZmxvdzsiLCJpbXBvcnQge2lzRWxlbWVudCwgbWVyZ2VEZWVwT2JqZWN0LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7TWFuaXB1bGF0b3J9IGZyb20gXCIuLi9kb20vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIFBhcmFtcyB7XHJcblx0Y29uc3RydWN0b3IocGFyYW1zLCBlbGVtZW50ID0gbnVsbCkge1xyXG5cdFx0dGhpcy5fcGFyYW1zID0gdGhpcy5tZXJnZShwYXJhbXMsIGVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0Z2V0KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcmFtcztcclxuXHR9XHJcblxyXG5cdGZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBpc0VsZW1lbnQoZWxlbWVudCkgPyBNYW5pcHVsYXRvci5nZXQoZWxlbWVudCkgOiB7fTtcclxuXHR9XHJcblxyXG5cdG1lcmdlKHBhcmFtcywgZWxlbWVudCkge1xyXG5cdFx0bGV0IG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QocGFyYW1zLCB0aGlzLmZyb21FbGVtZW50KGVsZW1lbnQpKTtcclxuXHJcblx0XHRmb3IgKGxldCBrZXkgaW4gbVBhcmFtcykge1xyXG5cdFx0XHRpZiAoa2V5LmluZGV4T2YoJy0nKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRsZXQga2V5cyA9IGtleS5zcGxpdCgnLScpLFxyXG5cdFx0XHRcdFx0dmFsdWUgPSBub3JtYWxpemVEYXRhKG1QYXJhbXNba2V5XSk7XHJcblxyXG5cdFx0XHRcdGlmIChrZXlzWzBdIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0XHRcdGlmIChrZXlzWzFdIGluIG1QYXJhbXNba2V5c1swXV0pIHtcclxuXHRcdFx0XHRcdFx0bVBhcmFtc1trZXlzWzBdXVtrZXlzWzFdXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgncGFyYW1zJyBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QobVBhcmFtcywgbVBhcmFtcy5wYXJhbXMpO1xyXG5cdFx0XHRkZWxldGUgbVBhcmFtcy5wYXJhbXM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG1QYXJhbXM7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYXJhbXM7IiwiaW1wb3J0IHttZXJnZURlZXBPYmplY3QsIG5vcm1hbGl6ZURhdGF9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbi8qKlxyXG4gKiDQmtC70LDRgdGBIFBsYWNlbWVudCwg0L7Qv9GA0LXQtNC10LvRj9C10YIg0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LzQtdGB0YLQvtC/0L7Qu9C+0LbQtdC90LjQtSDRjdC70LXQvNC10L3RgtCwINC90LAg0YHRgtGA0LDQvdC40YbQtS5cclxuICogVE9ETyDQutC70LDRgdGBINC90LUg0LTQvtC/0LjRgdCw0L1cclxuICovXHJcblxyXG5jbGFzcyBQbGFjZW1lbnQge1xyXG5cdGNvbnN0cnVjdG9yKGFyZyA9IHt9KSB7XHJcblx0XHR0aGlzLnBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdCh7XHJcblx0XHRcdGVsZW1lbnQ6IG51bGwsXHJcblx0XHRcdGRyb3A6IG51bGxcclxuXHRcdH0sIGFyZyk7XHJcblx0fVxyXG5cclxuXHRfZ2V0UGxhY2VtZW50KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Y29uc3QgX3BhcmVudCA9IChzZWxmKSA9PiB7XHJcblx0XHRcdGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudE5vZGUsXHJcblx0XHRcdFx0b3ZlcmZsb3cgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCkub3ZlcmZsb3c7XHJcblxyXG5cdFx0XHRpZiAocGFyZW50LnRhZ05hbWUgIT09ICdCT0RZJykge1xyXG5cdFx0XHRcdGlmIChvdmVyZmxvdyA9PT0gJ3Zpc2libGUnKSB7XHJcblx0XHRcdFx0XHRfcGFyZW50KHBhcmVudClcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXNGaXhlZCA9IGZhbHNlLCB0b3AsIGxlZnQsXHJcblx0XHRcdGJvdW5kcyA9IF90aGlzLnBhcmFtcy5kcm9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG5cdFx0XHRwYXJlbnQgPSBfdGhpcy5wYXJhbXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRpZiAoX3BhcmVudChfdGhpcy5wYXJhbXMuZWxlbWVudCkpIHtcclxuXHRcdFx0aXNGaXhlZCA9IHRydWU7XHJcblx0XHRcdHRvcCA9IGJvdW5kcy50b3A7XHJcblx0XHRcdGxlZnQgPSBib3VuZHMubGVmdDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKF90aGlzLnBhcmFtcy5kcm9wKTtcclxuXHRcdFx0dG9wID0gbm9ybWFsaXplRGF0YShzdHlsZXMudG9wLnNsaWNlKDAsIC0yKSk7XHJcblx0XHRcdGxlZnQgPSBub3JtYWxpemVEYXRhKHN0eWxlcy5sZWZ0LnNsaWNlKDAsIC0yKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKChib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCkgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHRsZWZ0ID0gcGFyZW50LndpZHRoIC0gYm91bmRzLndpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGlzRml4ZWQ6IGlzRml4ZWQsXHJcblx0XHRcdHRvcDogdG9wLFxyXG5cdFx0XHRsZWZ0OiBsZWZ0XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGFjZW1lbnQ7IiwiLyoqXHJcbiAqINCa0LvQsNGB0YEgUmVzcG9uc2l2ZSwg0YDQsNCx0L7RgtCw0LXRgiDQv9C+INGC0LDQutC40Lwg0LbQtSDQvNC10LTQuNCwINGC0L7Rh9C60LDQvCwg0YfRgtC+INC4IGJvb3RzdHJhcFxyXG4gKiDQuCDQvtC/0YDQtdC00LXQu9GP0LXRgiDQvdCwINGC0LDRhyDRg9GB0YLRgNC+0LnRgdGC0LLQsC5cclxuICovXHJcblxyXG5jbGFzcyBSZXNwb25zaXZlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuYnJlYWtwb2ludHMgPSB7XHJcblx0XHRcdHhzOiAwLFxyXG5cdFx0XHRzbTogNTc2LFxyXG5cdFx0XHRtZDogNzY4LFxyXG5cdFx0XHRsZzogOTkyLFxyXG5cdFx0XHR4bDogMTIwMCxcclxuXHRcdFx0eHhsOiAxNDAwLFxyXG5cdFx0XHR4eHhsOiAxNjAwLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCV0YHQu9C4INC90LDRiNCwINGI0LjRgNC40L3QsCDRjdC60YDQsNC90LAg0YHQvtCy0L/QsNC00LDQtdGCINGBINC00LjQsNC/0LDQt9C+0L3QvtC8INC60L7RgtC+0YDRi9C5INGD0LrQsNC30LDQvSDQsiDQvNC+0LTRg9C70LUg0LLRi9C00LDQtdC8IHRydWUsINC40L3QsNGH0LUgZmFsc2VcclxuXHQgKiBAcGFyYW0gbW9kdWxlXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhdGljIGNoZWNrKG1vZHVsZSkge1xyXG5cdFx0bGV0IGluc3RhbmNlID0gbmV3IHRoaXMgO1xyXG5cdFx0cmV0dXJuIGluc3RhbmNlLmRlZmluZShtb2R1bGUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0LLQtdGA0Y/QtdGCINC90LAg0YLQsNGHINGD0YHRgtGA0L7QudGB0YLQstCwLiBUT0RPINC90LUg0YHQvtCy0YHQtdC8INC/0YDQsNCy0LjQu9GM0L3Qviwg0L3QsNC00L4g0YHQtNC10LvQsNGC0Ywg0L/Qvi3QtNGA0YPQs9C+0LzRg1xyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaGVja01vYmlsZU9yVGFibGV0KCkge1xyXG5cdFx0bGV0IGNoZWNrID0gZmFsc2U7XHJcblx0XHQoZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWlub3xhbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zbGljZSgwLDQpKSl7XHJcblx0XHRcdFx0Y2hlY2sgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmEpO1xyXG5cclxuXHRcdHJldHVybiBjaGVjaztcclxuXHR9XHJcblxyXG5cdGRlZmluZShtb2R1bGUpIHtcclxuXHRcdGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG5cdFx0XHRyZXNwb25zaXZlX3NpemUgPSB0aGlzLl9jaGVja1Jlc3BvbnNpdmVDbGFzcyhtb2R1bGUpLFxyXG5cdFx0XHRicmVha3BvaW50cyA9IHRoaXMuYnJlYWtwb2ludHMsXHJcblx0XHRcdHBvaW50ID0gT2JqZWN0LmtleXMoYnJlYWtwb2ludHMpLmZpbmQoa2V5ID0+IGJyZWFrcG9pbnRzW2tleV0gPT09IHJlc3BvbnNpdmVfc2l6ZSk7XHJcblxyXG5cdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhicmVha3BvaW50cyksXHJcblx0XHRcdGxvYyA9IGtleXMuaW5kZXhPZihwb2ludCk7XHJcblxyXG5cdFx0cmV0dXJuIHdpbmRvd1dpZHRoID49IGJyZWFrcG9pbnRzW2tleXNbbG9jICsgMV1dO1xyXG5cdH1cclxuXHJcblx0X2NoZWNrUmVzcG9uc2l2ZUNsYXNzKG1vZHVsZSkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSBtb2R1bGUuX2VsZW1lbnQsXHJcblx0XHRcdHBhcmFtcyA9IG1vZHVsZS5fcGFyYW1zLFxyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IDA7XHJcblxyXG5cdFx0aWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhYWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54eHhsO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhwYXJhbXMuY2xhc3Nlcy5YWEwpKSB7XHJcblx0XHRcdGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplID0gdGhpcy5icmVha3BvaW50cy54eGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhMKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueGw7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLkxHKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMubGc7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLk1EKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMubWQ7XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlNNKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMuc207XHJcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmFtcy5jbGFzc2VzLlhTKSkge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXJyZW50X3Jlc3BvbnNpdmVfc2l6ZSA9IHRoaXMuYnJlYWtwb2ludHMueHM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGN1cnJlbnRfcmVzcG9uc2l2ZV9zaXplXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlOyIsIi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBCb290c3RyYXAgdXRpbC9zY3JvbGxCYXIuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtNYW5pcHVsYXRvcn0gZnJvbSBcIi4uL2RvbS9tYW5pcHVsYXRvclwiO1xyXG5pbXBvcnQge2lzRWxlbWVudH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gXCIuLi9kb20vc2VsZWN0b3JzXCI7XHJcblxyXG4vKipcclxuICogQ29uc3RhbnRzXHJcbiAqL1xyXG5cclxuY29uc3QgU0VMRUNUT1JfRklYRURfQ09OVEVOVCA9ICcuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wJ1xyXG5jb25zdCBTRUxFQ1RPUl9TVElDS1lfQ09OVEVOVCA9ICcuc3RpY2t5LXRvcCdcclxuY29uc3QgUFJPUEVSVFlfUEFERElORyA9ICdwYWRkaW5nLXJpZ2h0J1xyXG5jb25zdCBQUk9QRVJUWV9NQVJHSU4gPSAnbWFyZ2luLXJpZ2h0J1xyXG5cclxuLyoqXHJcbiAqIENsYXNzIGRlZmluaXRpb25cclxuICovXHJcblxyXG5jbGFzcyBTY3JvbGxCYXJIZWxwZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmJvZHlcclxuXHR9XHJcblxyXG5cdC8vIFB1YmxpY1xyXG5cdGdldFdpZHRoKCkge1xyXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvdy9pbm5lcldpZHRoI3VzYWdlX25vdGVzXHJcblx0XHRjb25zdCBkb2N1bWVudFdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcblx0XHRyZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IHdpZHRoID0gdGhpcy5nZXRXaWR0aCgpXHJcblx0XHR0aGlzLl9kaXNhYmxlT3ZlckZsb3coKVxyXG5cdFx0Ly8gZ2l2ZSBwYWRkaW5nIHRvIGVsZW1lbnQgdG8gYmFsYW5jZSB0aGUgaGlkZGVuIHNjcm9sbGJhciB3aWR0aFxyXG5cdFx0dGhpcy5fc2V0RWxlbWVudEF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCwgUFJPUEVSVFlfUEFERElORywgY2FsY3VsYXRlZFZhbHVlID0+IGNhbGN1bGF0ZWRWYWx1ZSArIHdpZHRoKVxyXG5cdFx0Ly8gdHJpY2s6IFdlIGFkanVzdCBwb3NpdGl2ZSBwYWRkaW5nUmlnaHQgYW5kIG5lZ2F0aXZlIG1hcmdpblJpZ2h0IHRvIHN0aWNreS10b3AgZWxlbWVudHMgdG8ga2VlcCBzaG93aW5nIGZ1bGx3aWR0aFxyXG5cdFx0dGhpcy5fc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfRklYRURfQ09OVEVOVCwgUFJPUEVSVFlfUEFERElORywgY2FsY3VsYXRlZFZhbHVlID0+IGNhbGN1bGF0ZWRWYWx1ZSArIHdpZHRoKVxyXG5cdFx0dGhpcy5fc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQsIFBST1BFUlRZX01BUkdJTiwgY2FsY3VsYXRlZFZhbHVlID0+IGNhbGN1bGF0ZWRWYWx1ZSAtIHdpZHRoKVxyXG5cdH1cclxuXHJcblx0cmVzZXQoKSB7XHJcblx0XHR0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQsICdvdmVyZmxvdycpXHJcblx0XHR0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQsIFBST1BFUlRZX1BBRERJTkcpXHJcblx0XHR0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX0ZJWEVEX0NPTlRFTlQsIFBST1BFUlRZX1BBRERJTkcpXHJcblx0XHR0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX1NUSUNLWV9DT05URU5ULCBQUk9QRVJUWV9NQVJHSU4pXHJcblx0fVxyXG5cclxuXHRpc092ZXJmbG93aW5nKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0V2lkdGgoKSA+IDBcclxuXHR9XHJcblxyXG5cdC8vIFByaXZhdGVcclxuXHRfZGlzYWJsZU92ZXJGbG93KCkge1xyXG5cdFx0dGhpcy5fc2F2ZUluaXRpYWxBdHRyaWJ1dGUodGhpcy5fZWxlbWVudCwgJ292ZXJmbG93JylcclxuXHRcdHRoaXMuX2VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG5cdH1cclxuXHJcblx0X3NldEVsZW1lbnRBdHRyaWJ1dGVzKHNlbGVjdG9yLCBzdHlsZVByb3BlcnR5LCBjYWxsYmFjaykge1xyXG5cdFx0Y29uc3Qgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLmdldFdpZHRoKClcclxuXHRcdGNvbnN0IG1hbmlwdWxhdGlvbkNhbGxCYWNrID0gZWxlbWVudCA9PiB7XHJcblx0XHRcdGlmIChlbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50ICYmIHdpbmRvdy5pbm5lcldpZHRoID4gZWxlbWVudC5jbGllbnRXaWR0aCArIHNjcm9sbGJhcldpZHRoKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX3NhdmVJbml0aWFsQXR0cmlidXRlKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpXHJcblx0XHRcdGNvbnN0IGNhbGN1bGF0ZWRWYWx1ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoc3R5bGVQcm9wZXJ0eSlcclxuXHRcdFx0ZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShzdHlsZVByb3BlcnR5LCBgJHtjYWxsYmFjayhOdW1iZXIucGFyc2VGbG9hdChjYWxjdWxhdGVkVmFsdWUpKX1weGApXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fYXBwbHlNYW5pcHVsYXRpb25DYWxsYmFjayhzZWxlY3RvciwgbWFuaXB1bGF0aW9uQ2FsbEJhY2spXHJcblx0fVxyXG5cclxuXHRfc2F2ZUluaXRpYWxBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSkge1xyXG5cdFx0Y29uc3QgYWN0dWFsVmFsdWUgPSBlbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUoc3R5bGVQcm9wZXJ0eSlcclxuXHRcdGlmIChhY3R1YWxWYWx1ZSkge1xyXG5cdFx0XHRNYW5pcHVsYXRvci5nZXQoZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSwgYWN0dWFsVmFsdWUpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcmVzZXRFbGVtZW50QXR0cmlidXRlcyhzZWxlY3Rvciwgc3R5bGVQcm9wZXJ0eSkge1xyXG5cdFx0Y29uc3QgbWFuaXB1bGF0aW9uQ2FsbEJhY2sgPSBlbGVtZW50ID0+IHtcclxuXHRcdFx0Y29uc3QgdmFsdWUgPSBNYW5pcHVsYXRvci5nZXQoZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSlcclxuXHRcdFx0Ly8gV2Ugb25seSB3YW50IHRvIHJlbW92ZSB0aGUgcHJvcGVydHkgaWYgdGhlIHZhbHVlIGlzIGBudWxsYDsgdGhlIHZhbHVlIGNhbiBhbHNvIGJlIHplcm9cclxuXHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShzdHlsZVByb3BlcnR5KVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRNYW5pcHVsYXRvci5yZW1vdmUoZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSlcclxuXHRcdFx0ZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShzdHlsZVByb3BlcnR5LCB2YWx1ZSlcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9hcHBseU1hbmlwdWxhdGlvbkNhbGxiYWNrKHNlbGVjdG9yLCBtYW5pcHVsYXRpb25DYWxsQmFjaylcclxuXHR9XHJcblxyXG5cdF9hcHBseU1hbmlwdWxhdGlvbkNhbGxiYWNrKHNlbGVjdG9yLCBjYWxsQmFjaykge1xyXG5cdFx0aWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcclxuXHRcdFx0Y2FsbEJhY2soc2VsZWN0b3IpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3Qgc2VsIG9mIFNlbGVjdG9ycy5maW5kQWxsKHNlbGVjdG9yLCB0aGlzLl9lbGVtZW50KSkge1xyXG5cdFx0XHRjYWxsQmFjayhzZWwpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxCYXJIZWxwZXIiLCIvKiEganMtY29va2llIHYzLjAuMSB8IE1JVCAqL1xyXG5cclxuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcclxuXHRmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcclxuXHRcdFx0dGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRhcmdldFxyXG59XHJcblxyXG5sZXQgZGVmYXVsdENvbnZlcnRlciA9IHtcclxuXHRyZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnNsaWNlKDEsIC0xKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcclxuXHR9LFxyXG5cdHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXHJcblx0XHRcdC8lKDJbMzQ2QkZdfDNbQUMtRl18NDB8NVtCREVdfDYwfDdbQkNEXSkvZyxcclxuXHRcdFx0ZGVjb2RlVVJJQ29tcG9uZW50XHJcblx0XHQpXHJcblx0fVxyXG59O1xyXG5cclxuZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xyXG5cdGZ1bmN0aW9uIHNldCAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xyXG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0YXR0cmlidXRlcyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZTUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xyXG5cdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKTtcclxuXHRcdH1cclxuXHJcblx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KVxyXG5cdFx0XHQucmVwbGFjZSgvJSgyWzM0NkJdfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXHJcblx0XHRcdC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XHJcblxyXG5cdFx0bGV0IHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xyXG5cdFx0Zm9yIChsZXQgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcclxuXHJcblx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxyXG5cdFx0XHQvLyAuLi5cclxuXHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxyXG5cdFx0XHQvLyAgICAgY2hhcmFjdGVyOlxyXG5cdFx0XHQvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxyXG5cdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cclxuXHRcdFx0Ly8gLi4uXHJcblx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxyXG5cdFx0XHRrZXkgKyAnPScgKyBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXQgKGtleSkge1xyXG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgKGFyZ3VtZW50cy5sZW5ndGggJiYgIWtleSkpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxyXG5cdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXHJcblx0XHRsZXQgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cdFx0bGV0IGphciA9IHt9O1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcclxuXHRcdFx0bGV0IHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRsZXQgZm91bmRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xyXG5cdFx0XHRcdGphcltmb3VuZEtleV0gPSBjb252ZXJ0ZXIucmVhZCh2YWx1ZSwgZm91bmRLZXkpO1xyXG5cclxuXHRcdFx0XHRpZiAoa2V5ID09PSBmb3VuZEtleSkge1xyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmNyZWF0ZSh7XHJcblx0XHRcdHNldDogc2V0LFxyXG5cdFx0XHRnZXQ6IGdldCxcclxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdFx0c2V0KFxyXG5cdFx0XHRcdFx0a2V5LFxyXG5cdFx0XHRcdFx0JycsXHJcblx0XHRcdFx0XHRhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcclxuXHRcdFx0XHRcdFx0ZXhwaXJlczogLTFcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0d2l0aEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdFx0cmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcclxuXHRcdFx0fSxcclxuXHRcdFx0d2l0aENvbnZlcnRlcjogZnVuY3Rpb24gKGNvbnZlcnRlcikge1xyXG5cdFx0XHRcdHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0YXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcclxuXHRcdFx0Y29udmVydGVyOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGNvbnZlcnRlcikgfVxyXG5cdFx0fVxyXG5cdClcclxufVxyXG5cclxubGV0IGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcGk7IiwiLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvb3RzdHJhcCBkYXRhLmpzXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiDQodC60YDQuNC/0YIg0YDQsNCx0L7RgtCw0LXRgiDRgSDQutC+0LvQu9C10LrRhtC40LXQuSDQvNC+0LTRg9C70LXQuS4g0J/QvtC00YDQvtCx0L3QtdC1INGC0YPRgiBodHRwczovL2xlYXJuLmphdmFzY3JpcHQucnUvbWFwLXNldFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQmtC+0L3RgdGC0LDQvdGC0YtcclxuICovXHJcblxyXG5jb25zdCBlbGVtZW50TWFwID0gbmV3IE1hcCgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0c2V0KGVsZW1lbnQsIGtleSwgaW5zdGFuY2UpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0ZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgbmV3IE1hcCgpKVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcclxuXHRcdGlmICghaW5zdGFuY2VNYXAuaGFzKGtleSkgJiYgaW5zdGFuY2VNYXAuc2l6ZSAhPT0gMCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGBWR0FwcCDQvdC1INC00L7Qv9GD0YHQutCw0LXRgiDQsdC+0LvQtdC1INC+0LTQvdC+0LPQviDRjdC60LfQtdC80L/Qu9GP0YDQsCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsC4g0KHQstGP0LfQsNC90L3Ri9C5INGN0LrQt9C10LzQv9C70Y/RgDogJHtBcnJheS5mcm9tKGluc3RhbmNlTWFwLmtleXMoKSlbMF19LmApXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLnNldChrZXksIGluc3RhbmNlKTtcclxuXHR9LFxyXG5cclxuXHRnZXQoZWxlbWVudCwga2V5KSB7XHJcblx0XHRpZiAoZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpLmdldChrZXkpIHx8IG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH0sXHJcblxyXG5cdHJlbW92ZShlbGVtZW50LCBrZXkpIHtcclxuXHRcdGlmICghZWxlbWVudE1hcC5oYXMoZWxlbWVudCkpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBlbGVtZW50TWFwLmdldChlbGVtZW50KVxyXG5cclxuXHRcdGluc3RhbmNlTWFwLmRlbGV0ZShrZXkpO1xyXG5cclxuXHRcdGlmIChpbnN0YW5jZU1hcC5zaXplID09PSAwKSB7XHJcblx0XHRcdGVsZW1lbnRNYXAuZGVsZXRlKGVsZW1lbnQpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBCb290c3RyYXAgZXZlbnQuanNcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqINCh0LrRgNC40L/RgiDQtNC70Y8g0L/RgNC+0YHQu9GD0YjQuNCy0LDQvdC40Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YHRgtCw0L3RgtGLXHJcbiAqL1xyXG5cclxuY29uc3QgbmFtZXNwYWNlUmVnZXggPSAvW14uXSooPz1cXC4uKilcXC58LiovXHJcbmNvbnN0IHN0cmlwTmFtZVJlZ2V4ID0gL1xcLi4qL1xyXG5jb25zdCBzdHJpcFVpZFJlZ2V4ID0gLzo6XFxkKyQvXHJcbmNvbnN0IGV2ZW50UmVnaXN0cnkgPSB7fSAvLyBFdmVudHMgc3RvcmFnZVxyXG5sZXQgdWlkRXZlbnQgPSAxXHJcbmNvbnN0IGN1c3RvbUV2ZW50cyA9IHtcclxuXHRtb3VzZWVudGVyOiAnbW91c2VvdmVyJyxcclxuXHRtb3VzZWxlYXZlOiAnbW91c2VvdXQnXHJcbn1cclxuXHJcbmNvbnN0IG5hdGl2ZUV2ZW50cyA9IG5ldyBTZXQoW1xyXG5cdCdjbGljaycsXHJcblx0J2RibGNsaWNrJyxcclxuXHQnbW91c2V1cCcsXHJcblx0J21vdXNlZG93bicsXHJcblx0J2NvbnRleHRtZW51JyxcclxuXHQnbW91c2V3aGVlbCcsXHJcblx0J0RPTU1vdXNlU2Nyb2xsJyxcclxuXHQnbW91c2VvdmVyJyxcclxuXHQnbW91c2VvdXQnLFxyXG5cdCdtb3VzZW1vdmUnLFxyXG5cdCdzZWxlY3RzdGFydCcsXHJcblx0J3NlbGVjdGVuZCcsXHJcblx0J3N1Ym1pdCcsXHJcblx0J2tleWRvd24nLFxyXG5cdCdrZXlwcmVzcycsXHJcblx0J2tleXVwJyxcclxuXHQnb3JpZW50YXRpb25jaGFuZ2UnLFxyXG5cdCd0b3VjaHN0YXJ0JyxcclxuXHQndG91Y2htb3ZlJyxcclxuXHQndG91Y2hlbmQnLFxyXG5cdCd0b3VjaGNhbmNlbCcsXHJcblx0J3BvaW50ZXJkb3duJyxcclxuXHQncG9pbnRlcm1vdmUnLFxyXG5cdCdwb2ludGVydXAnLFxyXG5cdCdwb2ludGVybGVhdmUnLFxyXG5cdCdwb2ludGVyY2FuY2VsJyxcclxuXHQncG9wc3RhdGUnLFxyXG5cdCdnZXN0dXJlc3RhcnQnLFxyXG5cdCdnZXN0dXJlY2hhbmdlJyxcclxuXHQnZ2VzdHVyZWVuZCcsXHJcblx0J2ZvY3VzJyxcclxuXHQnYmx1cicsXHJcblx0J2NoYW5nZScsXHJcblx0J3Jlc2V0JyxcclxuXHQnc2VsZWN0JyxcclxuXHQnc3VibWl0JyxcclxuXHQnZm9jdXNpbicsXHJcblx0J2ZvY3Vzb3V0JyxcclxuXHQnbG9hZCcsXHJcblx0J3VubG9hZCcsXHJcblx0J2JlZm9yZXVubG9hZCcsXHJcblx0J3Jlc2l6ZScsXHJcblx0J21vdmUnLFxyXG5cdCdET01Db250ZW50TG9hZGVkJyxcclxuXHQncmVhZHlzdGF0ZWNoYW5nZScsXHJcblx0J2Vycm9yJyxcclxuXHQnYWJvcnQnLFxyXG5cdCdzY3JvbGwnXHJcbl0pXHJcblxyXG4vKipcclxuICog0J/RgNC40LLQsNGC0L3Ri9C1INC80LXRgtC+0LTRi1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1ha2VFdmVudFVpZChlbGVtZW50LCB1aWQpIHtcclxuXHRyZXR1cm4gKHVpZCAmJiBgJHt1aWR9Ojoke3VpZEV2ZW50Kyt9YCkgfHwgZWxlbWVudC51aWRFdmVudCB8fCB1aWRFdmVudCsrXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVsZW1lbnRFdmVudHMoZWxlbWVudCkge1xyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChlbGVtZW50KVxyXG5cclxuXHRlbGVtZW50LnVpZEV2ZW50ID0gdWlkXHJcblx0ZXZlbnRSZWdpc3RyeVt1aWRdID0gZXZlbnRSZWdpc3RyeVt1aWRdIHx8IHt9XHJcblxyXG5cdHJldHVybiBldmVudFJlZ2lzdHJ5W3VpZF1cclxufVxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBmbikge1xyXG5cdHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcblx0XHRoeWRyYXRlT2JqKGV2ZW50LCB7IGRlbGVnYXRlVGFyZ2V0OiBlbGVtZW50IH0pXHJcblxyXG5cdFx0aWYgKGhhbmRsZXIub25lT2ZmKSB7XHJcblx0XHRcdEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgZXZlbnQudHlwZSwgZm4pXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIFtldmVudF0pXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG5cdFx0Y29uc3QgZG9tRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcblxyXG5cdFx0Zm9yIChsZXQgeyB0YXJnZXQgfSA9IGV2ZW50OyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSB0aGlzOyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRvbUVsZW1lbnQgb2YgZG9tRWxlbWVudHMpIHtcclxuXHRcdFx0XHRpZiAoZG9tRWxlbWVudCAhPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aHlkcmF0ZU9iaihldmVudCwgeyBkZWxlZ2F0ZVRhcmdldDogdGFyZ2V0IH0pXHJcblxyXG5cdFx0XHRcdGlmIChoYW5kbGVyLm9uZU9mZikge1xyXG5cdFx0XHRcdFx0RXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBzZWxlY3RvciwgZm4pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkodGFyZ2V0LCBbZXZlbnRdKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kSGFuZGxlcihldmVudHMsIGNhbGxhYmxlLCBkZWxlZ2F0aW9uU2VsZWN0b3IgPSBudWxsKSB7XHJcblx0cmV0dXJuIE9iamVjdC52YWx1ZXMoZXZlbnRzKVxyXG5cdFx0LmZpbmQoZXZlbnQgPT4gZXZlbnQuY2FsbGFibGUgPT09IGNhbGxhYmxlICYmIGV2ZW50LmRlbGVnYXRpb25TZWxlY3RvciA9PT0gZGVsZWdhdGlvblNlbGVjdG9yKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRjb25zdCBpc0RlbGVnYXRlZCA9IHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJ1xyXG5cdC8vIFRPRE86INCy0YvQtNCw0LXRgiBcImZhbHNlXCIg0LLQvNC10YHRgtC+INGB0LXQu9C10LrRgtC+0YDQsCwg0L/QvtGN0YLQvtC80YMg0L3Rg9C20L3QviDQv9GA0L7QstC10YDQuNGC0YwuIGJvb3RcclxuXHRjb25zdCBjYWxsYWJsZSA9IGlzRGVsZWdhdGVkID8gZGVsZWdhdGlvbkZ1bmN0aW9uIDogKGhhbmRsZXIgfHwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cdGxldCB0eXBlRXZlbnQgPSBnZXRUeXBlRXZlbnQob3JpZ2luYWxUeXBlRXZlbnQpXHJcblxyXG5cdGlmICghbmF0aXZlRXZlbnRzLmhhcyh0eXBlRXZlbnQpKSB7XHJcblx0XHR0eXBlRXZlbnQgPSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIFtpc0RlbGVnYXRlZCwgY2FsbGFibGUsIHR5cGVFdmVudF1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSGFuZGxlcihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uLCBvbmVPZmYpIHtcclxuXHRpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRsZXQgW2lzRGVsZWdhdGVkLCBjYWxsYWJsZSwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtZXRlcnMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbilcclxuXHJcblx0Ly8gaW4gY2FzZSBvZiBtb3VzZWVudGVyIG9yIG1vdXNlbGVhdmUgd3JhcCB0aGUgaGFuZGxlciB3aXRoaW4gYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBmb3IgaXRzIERPTSBwb3NpdGlvblxyXG5cdC8vIHRoaXMgcHJldmVudHMgdGhlIGhhbmRsZXIgZnJvbSBiZWluZyBkaXNwYXRjaGVkIHRoZSBzYW1lIHdheSBhcyBtb3VzZW92ZXIgb3IgbW91c2VvdXQgZG9lc1xyXG5cdGlmIChvcmlnaW5hbFR5cGVFdmVudCBpbiBjdXN0b21FdmVudHMpIHtcclxuXHRcdGNvbnN0IHdyYXBGdW5jdGlvbiA9IGZuID0+IHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdGlmICghZXZlbnQucmVsYXRlZFRhcmdldCB8fCAoZXZlbnQucmVsYXRlZFRhcmdldCAhPT0gZXZlbnQuZGVsZWdhdGVUYXJnZXQgJiYgIWV2ZW50LmRlbGVnYXRlVGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGFibGUgPSB3cmFwRnVuY3Rpb24oY2FsbGFibGUpXHJcblx0fVxyXG5cclxuXHRjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXHJcblx0Y29uc3QgaGFuZGxlcnMgPSBldmVudHNbdHlwZUV2ZW50XSB8fCAoZXZlbnRzW3R5cGVFdmVudF0gPSB7fSlcclxuXHRjb25zdCBwcmV2aW91c0Z1bmN0aW9uID0gZmluZEhhbmRsZXIoaGFuZGxlcnMsIGNhbGxhYmxlLCBpc0RlbGVnYXRlZCA/IGhhbmRsZXIgOiBudWxsKVxyXG5cclxuXHRpZiAocHJldmlvdXNGdW5jdGlvbikge1xyXG5cdFx0cHJldmlvdXNGdW5jdGlvbi5vbmVPZmYgPSBwcmV2aW91c0Z1bmN0aW9uLm9uZU9mZiAmJiBvbmVPZmZcclxuXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cdGNvbnN0IHVpZCA9IG1ha2VFdmVudFVpZChjYWxsYWJsZSwgb3JpZ2luYWxUeXBlRXZlbnQucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKVxyXG5cdGNvbnN0IGZuID0gaXNEZWxlZ2F0ZWQgP1xyXG5cdFx0Ym9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY2FsbGFibGUpIDpcclxuXHRcdGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgY2FsbGFibGUpXHJcblxyXG5cdGZuLmRlbGVnYXRpb25TZWxlY3RvciA9IGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGxcclxuXHRmbi5jYWxsYWJsZSA9IGNhbGxhYmxlXHJcblx0Zm4ub25lT2ZmID0gb25lT2ZmXHJcblx0Zm4udWlkRXZlbnQgPSB1aWRcclxuXHRoYW5kbGVyc1t1aWRdID0gZm5cclxuXHJcblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIGlzRGVsZWdhdGVkKVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpIHtcclxuXHRjb25zdCBmbiA9IGZpbmRIYW5kbGVyKGV2ZW50c1t0eXBlRXZlbnRdLCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblxyXG5cdGlmICghZm4pIHtcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGVFdmVudCwgZm4sIEJvb2xlYW4oZGVsZWdhdGlvblNlbGVjdG9yKSlcclxuXHRkZWxldGUgZXZlbnRzW3R5cGVFdmVudF1bZm4udWlkRXZlbnRdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgbmFtZXNwYWNlKSB7XHJcblx0Y29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxyXG5cclxuXHRmb3IgKGNvbnN0IFtoYW5kbGVyS2V5LCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XHJcblx0XHRpZiAoaGFuZGxlcktleS5pbmNsdWRlcyhuYW1lc3BhY2UpKSB7XHJcblx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50LmNhbGxhYmxlLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUeXBlRXZlbnQoZXZlbnQpIHtcclxuXHQvLyBhbGxvdyB0byBnZXQgdGhlIG5hdGl2ZSBldmVudHMgZnJvbSBuYW1lc3BhY2VkIGV2ZW50cyAoJ2NsaWNrLmJzLmJ1dHRvbicgLS0+ICdjbGljaycpXHJcblx0ZXZlbnQgPSBldmVudC5yZXBsYWNlKHN0cmlwTmFtZVJlZ2V4LCAnJylcclxuXHRyZXR1cm4gY3VzdG9tRXZlbnRzW2V2ZW50XSB8fCBldmVudFxyXG59XHJcblxyXG5mdW5jdGlvbiBoeWRyYXRlT2JqKG9iaiwgbWV0YSA9IHt9KSB7XHJcblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMobWV0YSkpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdG9ialtrZXldID0gdmFsdWVcclxuXHRcdH0gY2F0Y2gge1xyXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcblx0XHRcdFx0Z2V0KCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG9ialxyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40Y9cclxuICogQHR5cGUge3tvbmUoKiwgKiwgKiwgKik6IHZvaWQsIHRyaWdnZXIoKiwgKiwgKik6IChudWxsfCopLCBvZmYoKiwgKiwgKiwgKik6IHZvaWQsIG9uKCosICosICosICopOiB2b2lkfX1cclxuICovXHJcbmNvbnN0IEV2ZW50SGFuZGxlciA9IHtcclxuXHQvKipcclxuXHQgKiDQn9GA0L7RgdC70YPRiNC40LLQsNGC0LXQu9GMINGB0L7QsdGL0YLQuNC5ICjRjdC70LXQvNC10L3Rgiwg0YHQvtCx0YvRgtC40LUgKNC/0L7Qu9C90YvQuSDRgdC/0LjRgdC+0Log0YHQvNC+0YLRgNC4INCyINC60L7QvdGB0YLQsNC90YLQtSBuYXRpdmVFdmVudHMsINC40YHRgtC+0YfQvdC40Log0YHQvtCx0YvRgtC40Y8g0LjQu9C4INGF0LXQvdC00LvQtdGALCDRhNGD0L3QutGG0LjRjyDQvtCx0YDQsNGC0L3QvtCz0L4g0LLRi9C30L7QstCwKSlcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBldmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgZmFsc2UpXHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICog0J/RgNC+0YHQu9GD0YjQuNCy0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjQuSwg0L3QviDQt9Cw0LzRi9C60LDQtdGC0YHRjyDQuCDQsdC+0LvRjNGI0LUg0L3QtSDQv9C+0LLRgtC+0YDRj9C10YLRgdGPINC90LAg0Y3Qu9C10LzQtdC90YLQtVxyXG5cdCAqIEBwYXJhbSBlbGVtZW50XHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICogQHBhcmFtIGhhbmRsZXJcclxuXHQgKiBAcGFyYW0gZGVsZWdhdGlvbkZ1bmN0aW9uXHJcblx0ICovXHJcblx0b25lKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRnVuY3Rpb24pIHtcclxuXHRcdGFkZEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GdW5jdGlvbiwgdHJ1ZSlcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQo9C00LDQu9C10L3QuNC1INC+0LHRgNCw0LHQvtGC0YfQuNC60LBcclxuXHQgKiBAcGFyYW0gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSBvcmlnaW5hbFR5cGVFdmVudFxyXG5cdCAqIEBwYXJhbSBoYW5kbGVyXHJcblx0ICogQHBhcmFtIGRlbGVnYXRpb25GdW5jdGlvblxyXG5cdCAqL1xyXG5cdG9mZihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKSB7XHJcblx0XHRpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBbaXNEZWxlZ2F0ZWQsIGNhbGxhYmxlLCB0eXBlRXZlbnRdID0gbm9ybWFsaXplUGFyYW1ldGVycyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZ1bmN0aW9uKVxyXG5cdFx0Y29uc3QgaW5OYW1lc3BhY2UgPSB0eXBlRXZlbnQgIT09IG9yaWdpbmFsVHlwZUV2ZW50XHJcblx0XHRjb25zdCBldmVudHMgPSBnZXRFbGVtZW50RXZlbnRzKGVsZW1lbnQpXHJcblx0XHRjb25zdCBzdG9yZUVsZW1lbnRFdmVudCA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IHt9XHJcblx0XHRjb25zdCBpc05hbWVzcGFjZSA9IG9yaWdpbmFsVHlwZUV2ZW50LnN0YXJ0c1dpdGgoJy4nKVxyXG5cclxuXHRcdGlmICh0eXBlb2YgY2FsbGFibGUgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdC8vIFNpbXBsZXN0IGNhc2U6IGhhbmRsZXIgaXMgcGFzc2VkLCByZW1vdmUgdGhhdCBsaXN0ZW5lciBPTkxZLlxyXG5cdFx0XHRpZiAoIU9iamVjdC5rZXlzKHN0b3JlRWxlbWVudEV2ZW50KS5sZW5ndGgpIHtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgY2FsbGFibGUsIGlzRGVsZWdhdGVkID8gaGFuZGxlciA6IG51bGwpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc05hbWVzcGFjZSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGVsZW1lbnRFdmVudCBvZiBPYmplY3Qua2V5cyhldmVudHMpKSB7XHJcblx0XHRcdFx0cmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgZWxlbWVudEV2ZW50LCBvcmlnaW5hbFR5cGVFdmVudC5zbGljZSgxKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoY29uc3QgW2tleUhhbmRsZXJzLCBldmVudF0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVFbGVtZW50RXZlbnQpKSB7XHJcblx0XHRcdGNvbnN0IGhhbmRsZXJLZXkgPSBrZXlIYW5kbGVycy5yZXBsYWNlKHN0cmlwVWlkUmVnZXgsICcnKVxyXG5cclxuXHRcdFx0aWYgKCFpbk5hbWVzcGFjZSB8fCBvcmlnaW5hbFR5cGVFdmVudC5pbmNsdWRlcyhoYW5kbGVyS2V5KSkge1xyXG5cdFx0XHRcdHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50LmNhbGxhYmxlLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQtSDRgdC+0LHRi9GC0LjRjy4g0J/QvtC00YDQvtCx0L3QtdC1INGC0YPRgiBodHRwczovL2xlYXJuLmphdmFzY3JpcHQucnUvZGlzcGF0Y2gtZXZlbnRzXHJcblx0ICogQHBhcmFtIGVsZW1lbnRcclxuXHQgKiBAcGFyYW0gZXZlbnRcclxuXHQgKiBAcGFyYW0gYXJnc1xyXG5cdCAqIEByZXR1cm5zIHsqfG51bGx9XHJcblx0ICovXHJcblx0dHJpZ2dlcihlbGVtZW50LCBldmVudCwgYXJncykge1xyXG5cdFx0aWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYnViYmxlcyA9IHRydWU7XHJcblx0XHRsZXQgbmF0aXZlRGlzcGF0Y2ggPSB0cnVlO1xyXG5cdFx0bGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdCBldnQgPSBoeWRyYXRlT2JqKG5ldyBFdmVudChldmVudCwgeyBidWJibGVzLCBjYW5jZWxhYmxlOiB0cnVlIH0pLCBhcmdzKVxyXG5cclxuXHRcdGlmIChkZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hdGl2ZURpc3BhdGNoKSB7XHJcblx0XHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGV2dFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXHJcbiIsImltcG9ydCB7aXNFbGVtZW50LCBub3JtYWxpemVEYXRhfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDQsNGC0YDQuNCx0YPRgtCw0LzQuCDRgyDRjdC70LXQvNC10L3RgtCwOlxyXG4gKiBnZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINGE0LvQsNCzIC0g0LLRi9GA0LXQt9Cw0YLRjCBkYXRhLSkgLSDQvNC10YLQvtC0INCy0YvQsdC40YDQsNC10YIg0LfQvdCw0YfQtdC90LjQtSDQsNGC0YDQuNCx0YPRgtCwINC/0L4g0LXQs9C+INC40LzQtdC90LgsINC10YHQu9C4INCyINC/0L7Qu9C1INC40LzQtdC90Lgg0L/QtdGA0LXQtNCw0YLRjCAnZGF0YScgLT4g0LHRg9C00YPRgiDQstGL0LHRgNCw0L3RiyDRgtC+0LvRjNC60L4g0LTQsNGC0LAg0LDRgtGA0LjQsdGD0YLRiywg0LXRgdC70LggJ2FsbCcgLT4g0LzQtdGC0L7QtCDQstC10YDQvdC10YIg0LfQvdCw0YfQtdC90LjQtSDQstGB0LXRhSDQsNGC0YDQuNCx0YPRgtC+0LJcclxuICogaGFzICjRjdC70LXQvNC10L3Rgiwg0LjQvNGPKSAtINC10YHRgtGMINC70Lgg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKiBzZXQgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8sINC30L3QsNGH0LXQvdC40LUpIC0g0YPRgdGC0LDQvdC+0LLQutCwINGDINGN0LvQtdC80LXQvdGC0LAg0LDRgtGA0LjQsdGD0YLQsCDQuNC70Lgg0LXQs9C+INC40LfQvNC10L3QtdC90LjQtVxyXG4gKiByZW1vdmUgKNGN0LvQtdC80LXQvdGCLCDQuNC80Y8pIC0g0YPQtNCw0LvRj9C10YIg0LDRgtGA0LjQsdGD0YIg0YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0KGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUgPSAnZGF0YScsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlKSB7XHJcblx0XHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdkYXRhJykge1xyXG5cdFx0XHRsZXQgZWxtQmFzZSA9IFsnZGF0YS12Zy10b2dnbGUnLCAnZGF0YS12Zy10YXJnZXQnLCAnZGF0YS12Zy1kaXNtaXNzJ10sXHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IHt9O1xyXG5cclxuXHRcdFx0bGV0IGFyciA9IFtdLmZpbHRlci5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24gKGF0KSB7XHJcblx0XHRcdFx0cmV0dXJuIC9eZGF0YS0vLnRlc3QoYXQubmFtZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdFx0bGV0IG5hbWUgPSB2Lm5hbWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFlbG1CYXNlLmluY2x1ZGVzKG5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChpc1JlbW92ZURhdGFOYW1lKSBuYW1lID0gbmFtZS5zbGljZSg1KTtcclxuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1tuYW1lXSA9IG5vcm1hbGl6ZURhdGEodi52YWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKG5hbWVBdHRyaWJ1dGUgPT09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZU5hbWVzKCkucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gey4uLmFjYywgW25hbWVdOiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKX07XHJcblx0XHRcdH0sIHt9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lQXR0cmlidXRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRoYXMoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdH0sXHJcblxyXG5cdHNldChlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lKSB7XHJcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW1vdmUoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChlbGVtZW50KSAmJiBuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGhpZGUoZWwpIHtcclxuXHRcdGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0fSxcclxuXHJcblx0c2hvdyhlbCwgc3RhdGUgPSAnYmxvY2snKSB7XHJcblx0XHRlbC5zdHlsZS5kaXNwbGF5ID0gc3RhdGU7XHJcblx0fSxcclxufVxyXG5cclxuZXhwb3J0IHtNYW5pcHVsYXRvcn1cclxuIiwiLyoqXHJcbiAqINCg0LDQsdC+0YLQsCDRgSBET01cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuaW1wb3J0IHtpc0VsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcclxuXHJcbmNvbnN0IHBhcnNlU2VsZWN0b3IgPSBzZWxlY3RvciA9PiB7XHJcblx0aWYgKHNlbGVjdG9yICYmIHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5lc2NhcGUpIHtcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvIyhbXlxcc1wiIyddKykvZywgKG1hdGNoLCBpZCkgPT4gYCMke0NTUy5lc2NhcGUoaWQpfWApXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3JcclxufVxyXG5cclxuY29uc3QgZ2V0U2VsZWN0b3IgPSBlbGVtZW50ID0+IHtcclxuXHRsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS12Zy10YXJnZXQnKTtcclxuXHJcblx0aWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XHJcblx0XHRsZXQgaHJlZkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcblx0XHRpZiAoIWhyZWZBdHRyaWJ1dGUgfHwgKCFocmVmQXR0cmlidXRlLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyaWJ1dGUuc3RhcnRzV2l0aCgnLicpKSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaHJlZkF0dHJpYnV0ZS5pbmNsdWRlcygnIycpICYmICFocmVmQXR0cmlidXRlLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG5cdFx0XHRocmVmQXR0cmlidXRlID0gYCMke2hyZWZBdHRyaWJ1dGUuc3BsaXQoJyMnKVsxXX1gO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGVjdG9yID0gaHJlZkF0dHJpYnV0ZSAmJiBocmVmQXR0cmlidXRlICE9PSAnIycgPyBocmVmQXR0cmlidXRlLnRyaW0oKSA6IG51bGw7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2VsZWN0b3IgPyBzZWxlY3Rvci5zcGxpdCgnLCcpLm1hcChzZWwgPT4gcGFyc2VTZWxlY3RvcihzZWwpKS5qb2luKCcsJykgOiBudWxsO1xyXG59XHJcblxyXG5jb25zdCBTZWxlY3RvcnMgPSB7XHJcblx0ZmluZChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0aWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcclxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3Rvcik7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZmluZEFsbChzZWxlY3RvciwgY29udGFpbmVyID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRyZXR1cm4gW10uY29uY2F0KC4uLkVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwuY2FsbChjb250YWluZXIsIHNlbGVjdG9yKSk7XHJcblx0fSxcclxuXHJcblx0Z2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpO1xyXG5cdFx0aWYgKHNlbGVjdG9yKSByZXR1cm4gU2VsZWN0b3JzLmZpbmQoc2VsZWN0b3IpID8gc2VsZWN0b3IgOiBudWxsXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH0sXHJcblxyXG5cdGdldEVsZW1lbnRGcm9tU2VsZWN0b3IoZWxlbWVudCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KTtcclxuXHRcdHJldHVybiBzZWxlY3RvciA/IFNlbGVjdG9ycy5maW5kKHNlbGVjdG9yKSA6IG51bGxcclxuXHR9LFxyXG5cclxuXHRnZXRNdWx0aXBsZUVsZW1lbnRzRnJvbVNlbGVjdG9yKGVsZW1lbnQpIHtcclxuXHRcdGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3IoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IgPyBTZWxlY3RvcnMuZmluZEFsbChzZWxlY3RvcikgOiBbXVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JzOyIsIi8qKlxyXG4gKiDQndCw0LHQvtGAINGB0LrRgNC40L/RgtC+0LIg0LTQu9GPINGI0LjRgNC+0LrQvtCz0L4g0L/RgNC40LzQtdC90LXQvdC40Y9cclxuICovXHJcblxyXG4vKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc0VsZW1lbnRcclxuICogQHBhcmFtIG9iamVjdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9IG9iamVjdCA9PiB7XHJcblx0aWYgKCFpc09iamVjdChvYmplY3QpKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdHJldHVybiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xyXG59XHJcblxyXG4vKipcclxuICogaXNEaXNhYmxlZFxyXG4gKiBAcGFyYW0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRGlzYWJsZWQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGVsZW1lbnQuZGlzYWJsZWQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kaXNhYmxlZFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICE9PSAnZmFsc2UnXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc1Zpc2libGVcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1Zpc2libGUgKGVsZW1lbnQpIHtcclxuXHRpZiAoIWlzRWxlbWVudChlbGVtZW50KSB8fCBlbGVtZW50LmdldENsaWVudFJlY3RzKCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGNvbnN0IGVsZW1lbnRJc1Zpc2libGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3Zpc2liaWxpdHknKSA9PT0gJ3Zpc2libGUnXHJcblx0Y29uc3QgY2xvc2VkRGV0YWlscyA9IGVsZW1lbnQuY2xvc2VzdCgnZGV0YWlsczpub3QoW29wZW5dKScpXHJcblxyXG5cdGlmICghY2xvc2VkRGV0YWlscykge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRJc1Zpc2libGVcclxuXHR9XHJcblxyXG5cdGlmIChjbG9zZWREZXRhaWxzICE9PSBlbGVtZW50KSB7XHJcblx0XHRjb25zdCBzdW1tYXJ5ID0gZWxlbWVudC5jbG9zZXN0KCdzdW1tYXJ5JylcclxuXHRcdGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkucGFyZW50Tm9kZSAhPT0gY2xvc2VkRGV0YWlscykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoc3VtbWFyeSA9PT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBlbGVtZW50SXNWaXNpYmxlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc09iamVjdFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcblx0cmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC40LLQvtC00LjQvCDQsiDQv9C+0YDRj9C00L7QuiDRgtC40L/RiyDQtNCw0L3QvdGL0YVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSAge1xyXG5cdGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XHJcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0fSBjYXRjaCB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgtGLINGBINC80LDRgdGB0LjQstCwXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50QXJyYXkoYXJyLCBlbCkge1xyXG5cdHJldHVybiBhcnIuZmlsdGVyKChpdGVtKSA9PiAhZWwuaW5jbHVkZXMoaXRlbSkpO1xyXG59XHJcblxyXG4vKipcclxuICog0JPQu9GD0LHQvtC60L7QtSDQvtCx0YrQtdC00LjQvdC10L3QuNC1INC+0LHRitC10LrRgtC+0LJcclxuICogQHBhcmFtIG9iamVjdHNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZURlZXBPYmplY3QoLi4ub2JqZWN0cykge1xyXG5cdGNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxuXHJcblx0cmV0dXJuIG9iamVjdHMucmVkdWNlKChwcmV2LCBvYmopID0+IHtcclxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG5cdFx0XHRjb25zdCBwVmFsID0gcHJldltrZXldO1xyXG5cdFx0XHRjb25zdCBvVmFsID0gb2JqW2tleV07XHJcblxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwVmFsKSAmJiBBcnJheS5pc0FycmF5KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gcFZhbC5jb25jYXQoLi4ub1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoaXNPYmplY3QocFZhbCkgJiYgaXNPYmplY3Qob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBtZXJnZURlZXBPYmplY3QocFZhbCwgb1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gb1ZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHByZXY7XHJcblx0fSwge30pO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2tcclxuICogQHBhcmFtIHBvc3NpYmxlQ2FsbGJhY2tcclxuICogQHBhcmFtIGFyZ3NcclxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIGV4ZWN1dGUocG9zc2libGVDYWxsYmFjaywgYXJncyA9IFtdLCBkZWZhdWx0VmFsdWUgPSBwb3NzaWJsZUNhbGxiYWNrKSB7XHJcblx0cmV0dXJuIHR5cGVvZiBwb3NzaWJsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gcG9zc2libGVDYWxsYmFjayguLi5hcmdzKSA6IGRlZmF1bHRWYWx1ZVxyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNpdGlvblxyXG4gKiBAcGFyYW0gY2FsbGJhY2tcclxuICogQHBhcmFtIHRyYW5zaXRpb25FbGVtZW50XHJcbiAqIEBwYXJhbSB3YWl0Rm9yVHJhbnNpdGlvblxyXG4gKi9cclxuY29uc3QgVFJBTlNJVElPTl9FTkQgPSAndHJhbnNpdGlvbmVuZCc7XHJcbmNvbnN0IE1JTExJU0VDT05EU19NVUxUSVBMSUVSID0gMTAwMDtcclxuXHJcbmZ1bmN0aW9uIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24gKGNhbGxiYWNrLCB0cmFuc2l0aW9uRWxlbWVudCwgd2FpdEZvclRyYW5zaXRpb24gPSB0cnVlLCB0aW1lT3V0TXMpIHtcclxuXHRpZiAoIXdhaXRGb3JUcmFuc2l0aW9uKSB7XHJcblx0XHRleGVjdXRlKGNhbGxiYWNrKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHRjb25zdCBkdXJhdGlvblBhZGRpbmcgPSA1XHJcblx0Y29uc3QgZW11bGF0ZWREdXJhdGlvbiA9IHRpbWVPdXRNcyA/IHRpbWVPdXRNcyA6IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRyYW5zaXRpb25FbGVtZW50KSArIGR1cmF0aW9uUGFkZGluZztcclxuXHJcblx0bGV0IGNhbGxlZCA9IGZhbHNlXHJcblxyXG5cdGNvbnN0IGhhbmRsZXIgPSAoeyB0YXJnZXQgfSkgPT4ge1xyXG5cdFx0aWYgKHRhcmdldCAhPT0gdHJhbnNpdGlvbkVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGVkID0gdHJ1ZVxyXG5cdFx0dHJhbnNpdGlvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9OX0VORCwgaGFuZGxlcilcclxuXHRcdGV4ZWN1dGUoY2FsbGJhY2spXHJcblx0fVxyXG5cclxuXHR0cmFuc2l0aW9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0aWYgKCFjYWxsZWQpIHtcclxuXHRcdFx0dHJpZ2dlclRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkVsZW1lbnQpXHJcblx0XHR9XHJcblx0fSwgZW11bGF0ZWREdXJhdGlvbilcclxufVxyXG5cclxuY29uc3QgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQgPSBlbGVtZW50ID0+IHtcclxuXHRpZiAoIWVsZW1lbnQpIHtcclxuXHRcdHJldHVybiAwXHJcblx0fVxyXG5cclxuXHQvLyBHZXQgdHJhbnNpdGlvbi1kdXJhdGlvbiBvZiB0aGUgZWxlbWVudFxyXG5cdGxldCB7IHRyYW5zaXRpb25EdXJhdGlvbiwgdHJhbnNpdGlvbkRlbGF5IH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxyXG5cclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbilcclxuXHRjb25zdCBmbG9hdFRyYW5zaXRpb25EZWxheSA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EZWxheSlcclxuXHJcblx0Ly8gUmV0dXJuIDAgaWYgZWxlbWVudCBvciB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIG5vdCBmb3VuZFxyXG5cdGlmICghZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gJiYgIWZsb2F0VHJhbnNpdGlvbkRlbGF5KSB7XHJcblx0XHRyZXR1cm4gMFxyXG5cdH1cclxuXHJcblx0Ly8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxyXG5cdHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdCgnLCcpWzBdXHJcblx0dHJhbnNpdGlvbkRlbGF5ID0gdHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsJylbMF1cclxuXHJcblx0cmV0dXJuIChOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KSkgKiBNSUxMSVNFQ09ORFNfTVVMVElQTElFUlxyXG59XHJcblxyXG5jb25zdCB0cmlnZ2VyVHJhbnNpdGlvbkVuZCA9IGVsZW1lbnQgPT4ge1xyXG5cdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoVFJBTlNJVElPTl9FTkQpKVxyXG59XHJcblxyXG4vKipcclxuICog0KLRgNGO0Log0LTQu9GPINC/0LXRgNC10LfQsNC/0YPRgdC60LAg0LDQvdC40LzQsNGG0LjQuCDRjdC70LXQvNC10L3RgtCwXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybiB2b2lkXHJcbiAqXHJcbiAqIEDRgdC80L7RgtGA0LggaHR0cHM6Ly93d3cuY2hhcmlzdGhlby5pby9ibG9nLzIwMjEvMDIvcmVzdGFydC1hLWNzcy1hbmltYXRpb24td2l0aC1qYXZhc2NyaXB0LyNyZXN0YXJ0aW5nLWEtY3NzLWFuaW1hdGlvblxyXG4gKi9cclxuY29uc3QgcmVmbG93ID0gZWxlbWVudCA9PiB7XHJcblx0ZWxlbWVudC5vZmZzZXRIZWlnaHQgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vb3BcclxuICovXHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcclxuXHJcbi8qKlxyXG4gKiDQk9C10L3QtdGA0LDRhtC40Y8g0YHQu9GD0YfQsNC50L3QvtC5INGB0YLRgNC+0LrQuFxyXG4gKi9cclxuZnVuY3Rpb24gbWFrZVJhbmRvbVN0cmluZyhsZW5ndGggPSA3KSB7XHJcblx0bGV0IHJlc3VsdCA9ICcnO1xyXG5cdGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG5cdGNvbnN0IGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcclxuXHRsZXQgY291bnRlciA9IDA7XHJcblx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcclxuXHRcdHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzTGVuZ3RoKSk7XHJcblx0XHRjb3VudGVyICs9IDE7XHJcblx0fVxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQotGA0LDQvdGB0LvQuNGC0LXRgNCw0YbQuNGPINGB0LjQvNCy0L7Qu9C+0LIg0YEg0LvQsNGC0LjQvdC40YbRiyDQvdCwINC60LjRgNC40LvQu9C40YbRgyDQuCDQvtCx0YDQsNGC0L3QvlxyXG4gKiBAcGFyYW0gdGV4dFxyXG4gKiBAcGFyYW0gZW5Ub1J1XHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZnVuY3Rpb24gdHJhbnNsaXRlcmF0ZSh0ZXh0LCBlblRvUnUpIHtcclxuXHRsZXQgcnUgPSBcItC5INGGINGDINC6INC1INC9INCzINGIINGJINC3INGFINGKINGEINGLINCyINCwINC/INGAINC+INC7INC0INC2INGNINGPINGHINGBINC8INC4INGCINGMINCxINGOXCIuc3BsaXQoLyArL2cpO1xyXG5cdGxldCBlbiA9IFwicSB3IGUgciB0IHkgdSBpIG8gcCBbIF0gYSBzIGQgZiBnIGggaiBrIGwgOyAnIHogeCBjIHYgYiBuIG0gLCAuXCIuc3BsaXQoLyArL2cpO1xyXG5cdGxldCB4O1xyXG5cclxuXHRmb3IgKHggPSAwOyB4IDwgcnUubGVuZ3RoOyB4KyspIHtcclxuXHRcdHRleHQgPSB0ZXh0LnNwbGl0KGVuVG9SdSA/IGVuW3hdIDogcnVbeF0pLmpvaW4oZW5Ub1J1ID8gcnVbeF0gOiBlblt4XSk7XHJcblx0XHR0ZXh0ID0gdGV4dC5zcGxpdChlblRvUnUgPyBlblt4XS50b1VwcGVyQ2FzZSgpIDogcnVbeF0udG9VcHBlckNhc2UoKSkuam9pbihlblRvUnUgPyBydVt4XS50b1VwcGVyQ2FzZSgpIDogZW5beF0udG9VcHBlckNhc2UoKSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGV4dDtcclxufVxyXG5cclxuLyoqXHJcbiAqXHJcbiAqL1xyXG5jb25zdCBpc1JUTCA9ICgpID0+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPT09ICdydGwnXHJcblxyXG5leHBvcnQge2lzRWxlbWVudCwgaXNWaXNpYmxlLCBpc0Rpc2FibGVkLCBpc09iamVjdCwgaXNFbXB0eU9iaiwgbWVyZ2VEZWVwT2JqZWN0LCByZW1vdmVFbGVtZW50QXJyYXksIG5vcm1hbGl6ZURhdGEsIGV4ZWN1dGUsIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sIHJlZmxvdywgbm9vcCwgbWFrZVJhbmRvbVN0cmluZywgaXNSVEwsIHRyYW5zbGl0ZXJhdGV9IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBjc3Mg0LrQu9Cw0YHRgdGLINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbmltcG9ydCBcIi4vYXBwL3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzXCI7XHJcblxyXG4vLyBzaWRlYmFyXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdzaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3NcIjtcclxuaW1wb3J0IFZHU2lkZWJhciBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyBjb2xsYXBzZVxyXG5pbXBvcnQgVkdDb2xsYXBzZSBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2NvbGxhcHNlL2pzL3ZnY29sbGFwc2VcIjtcclxuXHJcbi8vIG5hdlxyXG5pbXBvcnQgXCIuL2FwcC9tb2R1bGVzL3ZnbmF2L3Njc3MvdmduYXYuc2Nzc1wiO1xyXG5pbXBvcnQgVkdOYXYgZnJvbSBcIi4vYXBwL21vZHVsZXMvdmduYXYvanMvdmduYXZcIjtcclxuXHJcbi8vIGRyb3Bkb3duXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdkcm9wZG93bi9zY3NzL3ZnZHJvcGRvd24uc2Nzc1wiO1xyXG5pbXBvcnQgVkdEcm9wZG93biBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd25cIjtcclxuXHJcbi8vIG1vZGFsXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdtb2RhbC9zY3NzL3ZnbW9kYWwuc2Nzc1wiO1xyXG5pbXBvcnQgVkdNb2RhbCBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z21vZGFsL2pzL3ZnbW9kYWxcIjtcclxuXHJcbi8vIGZvcm0gc2VuZGVyXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdmb3Jtc2VuZGVyL3Njc3Mvdmdmb3Jtc2VuZGVyLnNjc3NcIjtcclxuaW1wb3J0IFZHRm9ybVNlbmRlciBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2Zvcm1zZW5kZXIvanMvdmdmb3Jtc2VuZGVyXCI7XHJcblxyXG4vLyByb2xsdXBcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z3JvbGx1cC9zY3NzL3Zncm9sbHVwLnNjc3NcIjtcclxuaW1wb3J0IFZHUm9sbHVwIGZyb20gXCIuL2FwcC9tb2R1bGVzL3Zncm9sbHVwL2pzL3Zncm9sbHVwXCI7XHJcblxyXG4vLyBsYXcgY29va2llXHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdsYXdjb29raWUvc2Nzcy92Z2xhd2Nvb2tpZS5zY3NzXCI7XHJcbmltcG9ydCBWR0xhd0Nvb2tpZSBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z2xhd2Nvb2tpZS9qcy92Z2xhd2Nvb2tpZVwiO1xyXG5cclxuLy8gc2VsZWN0XHJcbmltcG9ydCBcIi4vYXBwL21vZHVsZXMvdmdzZWxlY3Qvc2Nzcy92Z3NlbGVjdC5zY3NzXCI7XHJcbmltcG9ydCBWR1NlbGVjdCBmcm9tIFwiLi9hcHAvbW9kdWxlcy92Z3NlbGVjdC9qcy92Z3NlbGVjdFwiO1xyXG5cclxuLy8gYWxlcnRcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z2FsZXJ0L3Njc3MvdmdhbGVydC5zY3NzXCI7XHJcbmltcG9ydCBWR0FsZXJ0IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZnYWxlcnQvanMvdmdhbGVydFwiO1xyXG5cclxuLy8gdG9hc3RcclxuaW1wb3J0IFwiLi9hcHAvbW9kdWxlcy92Z3RvYXN0L3Njc3Mvdmd0b2FzdC5zY3NzXCI7XHJcbmltcG9ydCBWR1RvYXN0IGZyb20gXCIuL2FwcC9tb2R1bGVzL3ZndG9hc3QvanMvdmd0b2FzdFwiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXIsIFZHQ29sbGFwc2UsIFZHTmF2LCBWR0Ryb3Bkb3duLCBWR01vZGFsLCBWR0Zvcm1TZW5kZXIsIFZHUm9sbHVwLCBWR0xhd0Nvb2tpZSwgVkdTZWxlY3QsIFZHQWxlcnQsIFZHVG9hc3RcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=