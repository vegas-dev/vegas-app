var vg;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/_utils/js/base-module.js":
/*!**************************************!*\
  !*** ./app/_utils/js/base-module.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _manipulator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./manipulator */ "./app/_utils/js/manipulator.js");

class BaseModule {
  constructor() {
    this._element = null;
    this._params = {};
    this._cross = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' + '\t viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">' + '<path d="M89.7,10.3L89.7,10.3c-1-1-2.6-1-3.5,0L50,46.5L13.9,10.3c-1-1-2.6-1-3.5,0l0,0c-1,1-1,2.6,0,3.5L46.5,50L10.3,86.1' + '\tc-1,1-1,2.6,0,3.5h0c1,1,2.6,1,3.5,0L50,53.5l36.1,36.1c1,1,2.6,1,3.5,0l0,0c1-1,1-2.6,0-3.5L53.5,50l36.1-36.1' + '\tC90.6,12.9,90.6,11.3,89.7,10.3z"/>' + '</svg>';
  }
  get element() {
    return this._element;
  }
  set element(el) {
    this._element = _manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.find(el);
  }
  get params() {
    return this._params;
  }
  set params(params) {
    if (!(0,_manipulator__WEBPACK_IMPORTED_MODULE_0__.isEmptyObj)(params)) {
      let attrs = _manipulator__WEBPACK_IMPORTED_MODULE_0__.Manipulator.getDataAttributes(this.element);
      this._params = (0,_manipulator__WEBPACK_IMPORTED_MODULE_0__.mergeDeepObject)(params, attrs);
    }
  }
  _backdrop() {
    let _this = this,
      backdrop = document.querySelector('.vg-sidebar-backdrop');
    if (!_this.params.backdrop) return;
    if (backdrop) {
      backdrop.remove();
    } else {
      backdrop = document.createElement('div');
      backdrop.classList.add('vg-sidebar-backdrop');
      document.body.append(backdrop);
      setTimeout(() => {
        backdrop.classList.add('fade');
      }, 50);
    }
  }
  _overflow(isShown) {
    const _this = this;
    if (!_this.params.overflow) {
      return;
    }
    if (!isShown) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    } else {
      document.body.style.paddingRight = getWidth() + 'px';
      document.body.style.overflow = 'hidden';
    }
    function getWidth() {
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BaseModule);

/***/ }),

/***/ "./app/_utils/js/manipulator.js":
/*!**************************************!*\
  !*** ./app/_utils/js/manipulator.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Manipulator: () => (/* binding */ Manipulator),
/* harmony export */   eventHandler: () => (/* binding */ eventHandler),
/* harmony export */   isEmptyObj: () => (/* binding */ isEmptyObj),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   mergeDeepObject: () => (/* binding */ mergeDeepObject),
/* harmony export */   mergeParams: () => (/* binding */ mergeParams),
/* harmony export */   normalizeData: () => (/* binding */ normalizeData),
/* harmony export */   removeElementArray: () => (/* binding */ removeElementArray)
/* harmony export */ });
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
 * Подготавливаем и объединяем параметры
 * @param arg
 * @param pDefault
 * @returns {*}
 */
function mergeParams(arg, pDefault) {
  let mParams = mergeDeepObject(pDefault, arg);
  if (isObject(mParams) && !isEmptyObj(mParams)) {
    for (const datum in mParams) {
      let value = normalizeData(mParams[datum]);
      if (datum !== 'params') {
        if (!(datum in pDefault)) {
          let p = datum.split('-');
          if (p[1] in pDefault[p[0]]) {
            pDefault[p[0]][p[1]] = value;
          }
          delete mParams[datum];
        } else {
          mParams[datum] = value;
        }
      } else {
        mParams = mergeDeepObject(mParams, value);
        delete mParams[datum];
      }
    }
  }
  return mParams;
}

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
 * Манипуляции с элементом
 */
const Manipulator = {
  getDataAttributes(element, isRemoveDataName = true, isRemovePrefix = true) {
    if (!element) {
      return {};
    }
    const attributes = {},
      arr = [].filter.call(element.attributes, function (at) {
        return /^data-/.test(at.name);
      });
    if (arr.length) {
      arr.forEach(function (v) {
        let name = v.name,
          prefix = 'vg-';
        if (isRemoveDataName) name = name.slice(5);
        if (isRemovePrefix && name.indexOf(prefix) !== -1) name = name.slice(3);
        attributes[name] = normalizeData(v.value);
      });
    }
    return attributes;
  },
  getAttribute: function (element, nameAttribute) {
    if (!element || !nameAttribute) {
      return '';
    }
    return normalizeData(element.getAttribute(nameAttribute));
  },
  find: function (el) {
    if (!el) {
      throw new Error('Товарищ! Первый параметр не должен быть пустым!');
    } else {
      if (typeof el === 'string') {
        let elm = document.querySelector(el);
        if (elm) return elm;else throw new Error('Ахпер! Не удалось найти элемент');
      } else if (typeof el === 'object') {
        return el;
      } else {
        throw new Error('КЭП! Какая-то дичь к нам залетела');
      }
    }
  }
};

/**
 * EVENTS
 * @type {{on: eventHandler.on}}
 * Как это работает?
 * Вызов функции: eventHandler.on('элемент который нужно тригернуть', 'как тригернуть элемент');
 */
const eventHandler = {
  on: function (element, event, detail = {}) {
    const eventSuccess = new CustomEvent(event, {
      bubbles: true,
      detail: detail
    });
    element.dispatchEvent(eventSuccess);
  }
};


/***/ }),

/***/ "./app/dropdown/js/vgdropdown.js":
/*!***************************************!*\
  !*** ./app/dropdown/js/vgdropdown.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js_base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_utils/js/base-module */ "./app/_utils/js/base-module.js");
/* harmony import */ var _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_utils/js/manipulator */ "./app/_utils/js/manipulator.js");


let isShown = false;
const EVENT_KEY_HIDE = 'vg.dropdown.hide';
const EVENT_KEY_HIDDEN = 'vg.dropdown.hidden';
const EVENT_KEY_SHOW = 'vg.dropdown.show';
const EVENT_KEY_SHOWN = 'vg.dropdown.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';
class VGDropdown extends _utils_js_base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, arg = {}) {
    super();

    //-- backdrop, overflow, keyboard - работают есть параметр over стоит true
    this.paramsDefault = {
      button: null,
      over: false,
      backdrop: true,
      overflow: true,
      keyboard: false,
      ajax: {
        route: '',
        target: ''
      }
    };
    this.element = element;
    this.params = (0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.mergeParams)(arg, this.paramsDefault);
    this.init();
  }
  init() {
    const _this = this;
    _this.element.vgDropdown = this;
    if (_this.params.over) {
      _this.element.style.position = 'fixed';
    } else {}
  }
  toggle() {
    return !isShown ? this.show() : this.hide();
  }
  show() {}
  hide() {}
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGDropdown);

/***/ }),

/***/ "./app/sidebar/js/vgsidebar.js":
/*!*************************************!*\
  !*** ./app/sidebar/js/vgsidebar.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js_base_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_utils/js/base-module */ "./app/_utils/js/base-module.js");
/* harmony import */ var _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_utils/js/manipulator */ "./app/_utils/js/manipulator.js");


const EVENT_KEY_HIDE = 'vg.sidebar.hide';
const EVENT_KEY_HIDDEN = 'vg.sidebar.hidden';
const EVENT_KEY_SHOW = 'vg.sidebar.show';
const EVENT_KEY_SHOWN = 'vg.sidebar.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';
let _isShown = false;
class VGSidebar extends _utils_js_base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, arg = {}) {
    super();
    this.paramsDefault = {
      button: null,
      backdrop: true,
      overflow: true,
      keyboard: false,
      // todo not done
      scroll: false,
      // todo not done
      ajax: {
        route: '',
        target: ''
      }
    };
    this.element = element;
    this.params = (0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.mergeParams)(arg, this.paramsDefault);
    this.init();
  }
  init() {
    const _this = this;
    let cross = _this.element.querySelector('.vg-btn-close');
    if (cross) {
      let svg = cross.querySelector('svg');
      if (!svg) cross.insertAdjacentHTML('beforeend', _this._cross);
    }
    _this.element.vgSidebar = this;
  }
  toggle() {
    return _isShown ? this.hide() : this.show();
  }
  show() {
    const _this = this;
    if (_isShown) return;
    _isShown = true;
    _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.eventHandler.on(_this.element, EVENT_KEY_SHOW);
    _this._backdrop();
    _this._overflow(_isShown);
    _this.element.classList.add('show');
    setTimeout(() => {
      if (_this.params.ajax.route && _this.params.ajax.target) _this._route();
      _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.eventHandler.on(_this.element, EVENT_KEY_SHOWN);
    }, 50);
    _this._addEventListener();
  }
  hide() {
    const _this = this;
    if (!_isShown) return;
    _isShown = false;
    _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.eventHandler.on(_this.element, EVENT_KEY_HIDE);
    _this._backdrop();
    _this._overflow(_isShown);
    _this.element.classList.remove('show');
    setTimeout(() => {
      _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.eventHandler.on(_this.element, EVENT_KEY_HIDDEN);
    }, 50);
  }
  static getInstance(target) {
    if (typeof target === 'string') target = document.querySelector(target);
    return target?.vgSidebar;
  }
  static makeInit(btn) {
    btn.addEventListener('click', () => {
      let arg = _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.Manipulator.getDataAttributes(btn),
        target = arg.target || btn.getAttribute('href') || null;
      if (target && typeof target === 'string') {
        arg.button = btn;
        delete arg['target'];
        delete arg['toggle'];
        let sidebar = new VGSidebar(target, arg);
        sidebar.toggle();
      }
      return false;
    });
  }
  _addEventListener() {
    const _this = this;
    let backdrop = document.querySelector('.vg-sidebar-backdrop');
    if (backdrop) {
      backdrop.onclick = function () {
        _this.hide();
        return false;
      };
    }
    [...document.querySelectorAll('[data-vg-dismiss="sidebar"]')].forEach(function (cross) {
      cross.onclick = function () {
        let target = cross.dataset.vgTarget || cross.closest('.vg-sidebar') || null;
        if (target) {
          VGSidebar.getInstance(target).hide();
        }
        return false;
      };
    });
    if (_this.params.keyboard) {
      document.onkeyup = function (e) {
        if (e.key === "Escape") {
          _this.hide();
        }
        return false;
      };
    }
  }
  _route() {
    const _this = this;
    let $content = document.querySelector(_this.params.ajax.target);
    if ($content) {
      let request = new XMLHttpRequest();
      request.open("get", _this.params.ajax.route, true);
      request.onload = function () {
        setData(request.responseText);
        _utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.eventHandler.on(_this.element, EVENT_KEY_LOADED);
      };
      request.send();
    }
    const setData = data => {
      $content.innerHTML = data;
    };
  }
}
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

/***/ "./app/dropdown/scss/vgdropdown.scss":
/*!*******************************************!*\
  !*** ./app/dropdown/scss/vgdropdown.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./app/sidebar/scss/vgsidebar.scss":
/*!*****************************************!*\
  !*** ./app/sidebar/scss/vgsidebar.scss ***!
  \*****************************************/
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
/* harmony export */   VGDropdown: () => (/* reexport safe */ _app_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/_utils/scss/default.scss */ "./app/_utils/scss/default.scss");
/* harmony import */ var _app_sidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/sidebar/scss/vgsidebar.scss */ "./app/sidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/sidebar/js/vgsidebar */ "./app/sidebar/js/vgsidebar.js");
/* harmony import */ var _app_dropdown_scss_vgdropdown_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/dropdown/scss/vgdropdown.scss */ "./app/dropdown/scss/vgdropdown.scss");
/* harmony import */ var _app_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/dropdown/js/vgdropdown */ "./app/dropdown/js/vgdropdown.js");
// css классы по умолчанию


// vgsidebar



// vgdropdown


function onReady() {
  // vgsidebar
  [...document.querySelectorAll('[data-vg-toggle="sidebar"]')].forEach(function (btn) {
    _app_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"].makeInit(btn);
  });

  // dropdowns
  [...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (btn) {
    _app_dropdown_js_vgdropdown__WEBPACK_IMPORTED_MODULE_4__["default"].makeInit(btn);
  });
}
document.addEventListener("DOMContentLoaded", onReady);

})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbk1BO0FBQ0E7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFHQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNURBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7QUNyS0E7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL2Jhc2UtbW9kdWxlLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9qcy9tYW5pcHVsYXRvci5qcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9kcm9wZG93bi9qcy92Z2Ryb3Bkb3duLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3NpZGViYXIvanMvdmdzaWRlYmFyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9kcm9wZG93bi9zY3NzL3ZnZHJvcGRvd24uc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9zaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3MiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNFbXB0eU9iaiwgTWFuaXB1bGF0b3IsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudCA9IG51bGw7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHRcdHRoaXMuX2Nyb3NzID0gJzxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiJyArXHJcblx0XHRcdCdcXHQgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMCAxMDA7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj4nICtcclxuXHRcdFx0JzxwYXRoIGQ9XCJNODkuNywxMC4zTDg5LjcsMTAuM2MtMS0xLTIuNi0xLTMuNSwwTDUwLDQ2LjVMMTMuOSwxMC4zYy0xLTEtMi42LTEtMy41LDBsMCwwYy0xLDEtMSwyLjYsMCwzLjVMNDYuNSw1MEwxMC4zLDg2LjEnICtcclxuXHRcdFx0J1xcdGMtMSwxLTEsMi42LDAsMy41aDBjMSwxLDIuNiwxLDMuNSwwTDUwLDUzLjVsMzYuMSwzNi4xYzEsMSwyLjYsMSwzLjUsMGwwLDBjMS0xLDEtMi42LDAtMy41TDUzLjUsNTBsMzYuMS0zNi4xJyArXHJcblx0XHRcdCdcXHRDOTAuNiwxMi45LDkwLjYsMTEuMyw4OS43LDEwLjN6XCIvPicgK1xyXG5cdFx0XHQnPC9zdmc+JztcclxuXHR9XHJcblxyXG5cdGdldCBlbGVtZW50KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRcclxuXHR9XHJcblxyXG5cdHNldCBlbGVtZW50KGVsKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gTWFuaXB1bGF0b3IuZmluZChlbCk7XHJcblx0fVxyXG5cclxuXHRnZXQgcGFyYW1zKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcmFtc1xyXG5cdH1cclxuXHJcblx0c2V0IHBhcmFtcyhwYXJhbXMpIHtcclxuXHRcdGlmICghaXNFbXB0eU9iaihwYXJhbXMpKSB7XHJcblx0XHRcdGxldCBhdHRycyA9IE1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMuZWxlbWVudCk7XHJcblx0XHRcdHRoaXMuX3BhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwYXJhbXMsIGF0dHJzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9iYWNrZHJvcCgpIHtcclxuXHRcdGxldCBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdGJhY2tkcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZnLXNpZGViYXItYmFja2Ryb3AnKTtcclxuXHJcblx0XHRpZiAoIV90aGlzLnBhcmFtcy5iYWNrZHJvcCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChiYWNrZHJvcCkge1xyXG5cdFx0XHRiYWNrZHJvcC5yZW1vdmUoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ3ZnLXNpZGViYXItYmFja2Ryb3AnKTtcclxuXHJcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKGJhY2tkcm9wKTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2ZhZGUnKVxyXG5cdFx0XHR9LCA1MClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9vdmVyZmxvdyhpc1Nob3duKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaXNTaG93bikge1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJyc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGdldFdpZHRoKCkgKyAncHgnO1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XHJcblx0XHRcdGNvbnN0IGRvY3VtZW50V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuXHRcdFx0cmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhc2VNb2R1bGU7XHJcbiIsIi8qKlxyXG4gKiDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgtGLINGBINC80LDRgdGB0LjQstCwXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50QXJyYXkoYXJyLCBlbCkge1xyXG5cdHJldHVybiBhcnIuZmlsdGVyKChpdGVtKSA9PiAhZWwuaW5jbHVkZXMoaXRlbSkpO1xyXG59XHJcblxyXG4vKipcclxuICog0JPQu9GD0LHQvtC60L7QtSDQvtCx0YrQtdC00LjQvdC10L3QuNC1INC+0LHRitC10LrRgtC+0LJcclxuICogQHBhcmFtIG9iamVjdHNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZURlZXBPYmplY3QoLi4ub2JqZWN0cykge1xyXG5cdGNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxuXHJcblx0cmV0dXJuIG9iamVjdHMucmVkdWNlKChwcmV2LCBvYmopID0+IHtcclxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG5cdFx0XHRjb25zdCBwVmFsID0gcHJldltrZXldO1xyXG5cdFx0XHRjb25zdCBvVmFsID0gb2JqW2tleV07XHJcblxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwVmFsKSAmJiBBcnJheS5pc0FycmF5KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gcFZhbC5jb25jYXQoLi4ub1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoaXNPYmplY3QocFZhbCkgJiYgaXNPYmplY3Qob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBtZXJnZURlZXBPYmplY3QocFZhbCwgb1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gb1ZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHByZXY7XHJcblx0fSwge30pO1xyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXQvCDQuCDQvtCx0YrQtdC00LjQvdGP0LXQvCDQv9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHBhcmFtIGFyZ1xyXG4gKiBAcGFyYW0gcERlZmF1bHRcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZVBhcmFtcyhhcmcsIHBEZWZhdWx0KSB7XHJcblx0bGV0IG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QocERlZmF1bHQsIGFyZyk7XHJcblxyXG5cdGlmIChpc09iamVjdChtUGFyYW1zKSAmJiAhaXNFbXB0eU9iaihtUGFyYW1zKSkge1xyXG5cdFx0Zm9yIChjb25zdCBkYXR1bSBpbiBtUGFyYW1zKSB7XHJcblx0XHRcdGxldCB2YWx1ZSA9IG5vcm1hbGl6ZURhdGEobVBhcmFtc1tkYXR1bV0pO1xyXG5cclxuXHRcdFx0aWYgKGRhdHVtICE9PSAncGFyYW1zJykge1xyXG5cdFx0XHRcdGlmICghKGRhdHVtIGluIHBEZWZhdWx0KSkge1xyXG5cdFx0XHRcdFx0bGV0IHAgPSBkYXR1bS5zcGxpdCgnLScpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChwWzFdIGluIHBEZWZhdWx0W3BbMF1dKSB7XHJcblx0XHRcdFx0XHRcdHBEZWZhdWx0W3BbMF1dW3BbMV1dID0gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNbZGF0dW1dO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtUGFyYW1zW2RhdHVtXSA9IHZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KG1QYXJhbXMsIHZhbHVlKVxyXG5cdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2RhdHVtXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG1QYXJhbXNcclxufVxyXG5cclxuLyoqXHJcbiAqINCV0YHQu9C4INGH0YLQvi3QvdC40LHRg9C00Ywg0LIg0L7QsdGK0LXQutGC0LVcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRW1wdHlPYmoob2JqKSB7XHJcblx0Zm9yIChsZXQgcHJvcCBpbiBvYmopIHtcclxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogaXNPYmplY3RcclxuICogQHBhcmFtIG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xyXG5cdHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQuNCy0L7QtNC40Lwg0LIg0L/QvtGA0Y/QtNC+0Log0YLQuNC/0Ysg0LTQsNC90L3Ri9GFXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplRGF0YSh2YWx1ZSkgIHtcclxuXHRpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0fVxyXG5cclxuXHRpZiAodmFsdWUgPT09IE51bWJlcih2YWx1ZSkudG9TdHJpbmcoKSkge1xyXG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdH0gY2F0Y2gge1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0JzQsNC90LjQv9GD0LvRj9GG0LjQuCDRgSDRjdC70LXQvNC10L3RgtC+0LxcclxuICovXHJcbmNvbnN0IE1hbmlwdWxhdG9yID0ge1xyXG5cdGdldERhdGFBdHRyaWJ1dGVzKGVsZW1lbnQsIGlzUmVtb3ZlRGF0YU5hbWUgPSB0cnVlLCBpc1JlbW92ZVByZWZpeCA9IHRydWUpIHtcclxuXHRcdGlmICghZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4ge31cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBhdHRyaWJ1dGVzPSB7fSxcclxuXHRcdFx0YXJyID0gW10uZmlsdGVyLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gL15kYXRhLS8udGVzdChhdC5uYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0aWYgKGFyci5sZW5ndGgpIHtcclxuXHRcdFx0YXJyLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuXHRcdFx0XHRsZXQgbmFtZSA9IHYubmFtZSwgcHJlZml4ID0gJ3ZnLSc7XHJcblx0XHRcdFx0aWYgKGlzUmVtb3ZlRGF0YU5hbWUpIG5hbWUgPSBuYW1lLnNsaWNlKDUpO1xyXG5cdFx0XHRcdGlmIChpc1JlbW92ZVByZWZpeCAmJiBuYW1lLmluZGV4T2YocHJlZml4KSAhPT0gLTEpIG5hbWUgPSBuYW1lLnNsaWNlKDMpO1xyXG5cclxuXHRcdFx0XHRhdHRyaWJ1dGVzW25hbWVdID0gbm9ybWFsaXplRGF0YSh2LnZhbHVlKVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYXR0cmlidXRlc1xyXG5cdH0sXHJcblxyXG5cdGdldEF0dHJpYnV0ZTogZnVuY3Rpb24gKGVsZW1lbnQsIG5hbWVBdHRyaWJ1dGUpIHtcclxuXHRcdGlmICghZWxlbWVudCB8fCAhbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0XHRyZXR1cm4gJydcclxuXHRcdH1cclxuXHRcdHJldHVybiBub3JtYWxpemVEYXRhKGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWVBdHRyaWJ1dGUpKTtcclxuXHR9LFxyXG5cclxuXHRmaW5kOiBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdGlmICghZWwpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCfQotC+0LLQsNGA0LjRiSEg0J/QtdGA0LLRi9C5INC/0LDRgNCw0LzQtdGC0YAg0L3QtSDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0L/Rg9GB0YLRi9C8IScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRsZXQgZWxtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XHJcblx0XHRcdFx0aWYgKGVsbSkgcmV0dXJuIGVsbTtcclxuXHRcdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcign0JDRhdC/0LXRgCEg0J3QtSDRg9C00LDQu9C+0YHRjCDQvdCw0LnRgtC4INGN0LvQtdC80LXQvdGCJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGVsID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRcdHJldHVybiBlbDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ca0K3QnyEg0JrQsNC60LDRjy3RgtC+INC00LjRh9GMINC6INC90LDQvCDQt9Cw0LvQtdGC0LXQu9CwJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFVkVOVFNcclxuICogQHR5cGUge3tvbjogZXZlbnRIYW5kbGVyLm9ufX1cclxuICog0JrQsNC6INGN0YLQviDRgNCw0LHQvtGC0LDQtdGCP1xyXG4gKiDQktGL0LfQvtCyINGE0YPQvdC60YbQuNC4OiBldmVudEhhbmRsZXIub24oJ9GN0LvQtdC80LXQvdGCINC60L7RgtC+0YDRi9C5INC90YPQttC90L4g0YLRgNC40LPQtdGA0L3Rg9GC0YwnLCAn0LrQsNC6INGC0YDQuNCz0LXRgNC90YPRgtGMINGN0LvQtdC80LXQvdGCJyk7XHJcbiAqL1xyXG5jb25zdCBldmVudEhhbmRsZXIgPSB7XHJcblx0b246IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudCwgZGV0YWlsID0ge30pIHtcclxuXHRcdGNvbnN0IGV2ZW50U3VjY2VzcyA9IG5ldyBDdXN0b21FdmVudChldmVudCwge1xyXG5cdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRkZXRhaWw6IGRldGFpbFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50U3VjY2Vzcyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQge01hbmlwdWxhdG9yLCBldmVudEhhbmRsZXIsIGlzT2JqZWN0LCBpc0VtcHR5T2JqLCBtZXJnZURlZXBPYmplY3QsIG1lcmdlUGFyYW1zLCByZW1vdmVFbGVtZW50QXJyYXksIG5vcm1hbGl6ZURhdGF9XHJcbiIsImltcG9ydCBCYXNlTW9kdWxlIGZyb20gXCIuLi8uLi9fdXRpbHMvanMvYmFzZS1tb2R1bGVcIjtcclxuaW1wb3J0IHtcclxuXHRldmVudEhhbmRsZXIsXHJcblx0TWFuaXB1bGF0b3IsXHJcblx0bWVyZ2VQYXJhbXNcclxufSBmcm9tIFwiLi4vLi4vX3V0aWxzL2pzL21hbmlwdWxhdG9yXCI7XHJcblxyXG5sZXQgaXNTaG93biA9IGZhbHNlO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgICA9ICd2Zy5kcm9wZG93bi5oaWRlJztcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9ICd2Zy5kcm9wZG93bi5oaWRkZW4nO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyAgID0gJ3ZnLmRyb3Bkb3duLnNob3cnO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gID0gJ3ZnLmRyb3Bkb3duLnNob3duJztcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCA9ICd2Zy5zaWRlYmFyLmxvYWRlZCc7XHJcblxyXG5jbGFzcyBWR0Ryb3Bkb3duIGV4dGVuZHMgQmFzZU1vZHVsZXtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBhcmcgPSB7fSkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHQvLy0tIGJhY2tkcm9wLCBvdmVyZmxvdywga2V5Ym9hcmQgLSDRgNCw0LHQvtGC0LDRjtGCINC10YHRgtGMINC/0LDRgNCw0LzQtdGC0YAgb3ZlciDRgdGC0L7QuNGCIHRydWVcclxuXHRcdHRoaXMucGFyYW1zRGVmYXVsdCA9IHtcclxuXHRcdFx0YnV0dG9uOiBudWxsLFxyXG5cdFx0XHRvdmVyOiBmYWxzZSxcclxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdG92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogZmFsc2UsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJ1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMucGFyYW1zID0gbWVyZ2VQYXJhbXMoYXJnLCB0aGlzLnBhcmFtc0RlZmF1bHQpO1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fVxyXG5cclxuXHRpbml0KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cdFx0X3RoaXMuZWxlbWVudC52Z0Ryb3Bkb3duID0gdGhpcztcclxuXHJcblx0XHRpZiAoX3RoaXMucGFyYW1zLm92ZXIpIHtcclxuXHRcdFx0X3RoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiAhaXNTaG93biA/IHRoaXMuc2hvdygpIDogdGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdEcm9wZG93bjtcclxuIiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL191dGlscy9qcy9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge1xyXG5cdGV2ZW50SGFuZGxlcixcclxuXHRNYW5pcHVsYXRvcixcclxuXHRtZXJnZVBhcmFtc1xyXG59IGZyb20gXCIuLi8uLi9fdXRpbHMvanMvbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFID0gJ3ZnLnNpZGViYXIuaGlkZSc7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSAndmcuc2lkZWJhci5oaWRkZW4nO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyA9ICd2Zy5zaWRlYmFyLnNob3cnO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gPSAndmcuc2lkZWJhci5zaG93bic7XHJcbmNvbnN0IEVWRU5UX0tFWV9MT0FERUQgPSAndmcuc2lkZWJhci5sb2FkZWQnO1xyXG5cclxubGV0IF9pc1Nob3duID0gZmFsc2U7XHJcblxyXG5jbGFzcyBWR1NpZGViYXIgZXh0ZW5kcyBCYXNlTW9kdWxle1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIGFyZyA9IHt9KSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5wYXJhbXNEZWZhdWx0ID0ge1xyXG5cdFx0XHRidXR0b246IG51bGwsXHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IGZhbHNlLCAvLyB0b2RvIG5vdCBkb25lXHJcblx0XHRcdHNjcm9sbDogZmFsc2UsIC8vIHRvZG8gbm90IGRvbmVcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cdFx0dGhpcy5wYXJhbXMgPSBtZXJnZVBhcmFtcyhhcmcsIHRoaXMucGFyYW1zRGVmYXVsdCk7XHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdGluaXQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0IGNyb3NzID0gX3RoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmctYnRuLWNsb3NlJyk7XHJcblx0XHRpZiAoY3Jvc3MpIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGNyb3NzLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG5cdFx0XHRpZiAoIXN2ZykgY3Jvc3MuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBfdGhpcy5fY3Jvc3MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF90aGlzLmVsZW1lbnQudmdTaWRlYmFyID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiBfaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfaXNTaG93bikgcmV0dXJuO1xyXG5cdFx0X2lzU2hvd24gPSB0cnVlO1xyXG5cclxuXHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPVyk7XHJcblxyXG5cdFx0X3RoaXMuX2JhY2tkcm9wKCk7XHJcblx0XHRfdGhpcy5fb3ZlcmZsb3coX2lzU2hvd24pO1xyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGlmIChfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSAmJiBfdGhpcy5wYXJhbXMuYWpheC50YXJnZXQpIF90aGlzLl9yb3V0ZSgpO1xyXG5cdFx0XHRldmVudEhhbmRsZXIub24oX3RoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOKTtcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRfdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcigpO1xyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoIV9pc1Nob3duKSByZXR1cm47XHJcblx0XHRfaXNTaG93biA9IGZhbHNlO1xyXG5cclxuXHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblxyXG5cdFx0X3RoaXMuX2JhY2tkcm9wKCk7XHJcblx0XHRfdGhpcy5fb3ZlcmZsb3coX2lzU2hvd24pO1xyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElEREVOKTtcclxuXHRcdH0sIDUwKVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEluc3RhbmNlKHRhcmdldCkge1xyXG5cdFx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKSB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcclxuXHRcdHJldHVybiB0YXJnZXQ/LnZnU2lkZWJhcjtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlSW5pdChidG4pIHtcclxuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0bGV0IGFyZyA9IE1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKGJ0biksXHJcblx0XHRcdFx0dGFyZ2V0ID0gYXJnLnRhcmdldCB8fCBidG4uZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgbnVsbDtcclxuXHJcblx0XHRcdGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRhcmcuYnV0dG9uID0gYnRuO1xyXG5cdFx0XHRcdGRlbGV0ZSBhcmdbJ3RhcmdldCddO1xyXG5cdFx0XHRcdGRlbGV0ZSBhcmdbJ3RvZ2dsZSddO1xyXG5cclxuXHRcdFx0XHRsZXQgc2lkZWJhciA9IG5ldyBWR1NpZGViYXIodGFyZ2V0LCBhcmcpO1xyXG5cdFx0XHRcdHNpZGViYXIudG9nZ2xlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXIoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0IGJhY2tkcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZnLXNpZGViYXItYmFja2Ryb3AnKTtcclxuXHRcdGlmIChiYWNrZHJvcCkge1xyXG5cdFx0XHRiYWNrZHJvcC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXZnLWRpc21pc3M9XCJzaWRlYmFyXCJdJyldLmZvckVhY2goZnVuY3Rpb24gKGNyb3NzKSB7XHJcblx0XHRcdGNyb3NzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IGNyb3NzLmRhdGFzZXQudmdUYXJnZXQgfHwgY3Jvc3MuY2xvc2VzdCgnLnZnLXNpZGViYXInKSB8fCBudWxsO1xyXG5cclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRWR1NpZGViYXIuZ2V0SW5zdGFuY2UodGFyZ2V0KS5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0ZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0aWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcm91dGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0ICRjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfdGhpcy5wYXJhbXMuYWpheC50YXJnZXQpO1xyXG5cdFx0aWYgKCRjb250ZW50KSB7XHJcblx0XHRcdGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHJlcXVlc3Qub3BlbihcImdldFwiLCBfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSwgdHJ1ZSk7XHJcblx0XHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldERhdGEocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfTE9BREVEKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0cmVxdWVzdC5zZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XHJcblx0XHRcdCRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGNzcyDQutC70LDRgdGB0Ysg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuaW1wb3J0IFwiLi9hcHAvX3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzXCI7XHJcblxyXG4vLyB2Z3NpZGViYXJcclxuaW1wb3J0IFwiLi9hcHAvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyB2Z2Ryb3Bkb3duXHJcbmltcG9ydCBcIi4vYXBwL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzXCI7XHJcbmltcG9ydCBWR0Ryb3Bkb3duIGZyb20gXCIuL2FwcC9kcm9wZG93bi9qcy92Z2Ryb3Bkb3duXCI7XHJcblxyXG5mdW5jdGlvbiBvblJlYWR5KCkge1xyXG5cdC8vIHZnc2lkZWJhclxyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCJdJyldLmZvckVhY2goZnVuY3Rpb24gKGJ0bikge1xyXG5cdFx0VkdTaWRlYmFyLm1ha2VJbml0KGJ0bik7XHJcblx0fSk7XHJcblxyXG5cdC8vIGRyb3Bkb3duc1xyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXScpXS5mb3JFYWNoKGZ1bmN0aW9uIChidG4pIHtcclxuXHRcdFZHRHJvcGRvd24ubWFrZUluaXQoYnRuKTtcclxuXHR9KTtcclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgb25SZWFkeSk7XHJcblxyXG5leHBvcnQge1xyXG5cdFZHU2lkZWJhciwgVkdEcm9wZG93blxyXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9