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
  let mParams = mergeDeepObject(arg, pDefault);
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


class VGDropdown extends _utils_js_base_module__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(element, arg = {}) {
    super();
  }
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
      backdrop: true,
      overflow: true,
      keyboard: true,
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
    this.element.vgSidebar = this;
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
    _this._overflow();
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
    _this._overflow();
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
        delete arg['target'];
        delete arg['toggle'];
        let sidebar = new VGSidebar(target, arg);
        sidebar.toggle();
      }
      return false;
    });
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
  _overflow() {
    const _this = this;
    if (!_this.params.overflow) {
      return;
    }
    if (!_isShown) {
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
  [...document.querySelectorAll('[data-vg-toggle="dropdown"]')].forEach(function (btn) {});
}
document.addEventListener("DOMContentLoaded", onReady);

})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuTUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7QUMzTUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUdBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvYmFzZS1tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL21hbmlwdWxhdG9yLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL2Ryb3Bkb3duL2pzL3ZnZHJvcGRvd24uanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvc2lkZWJhci9qcy92Z3NpZGViYXIuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzIiwid2VicGFjazovL3ZnLy4vYXBwL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzIiwid2VicGFjazovL3ZnLy4vYXBwL3NpZGViYXIvc2Nzcy92Z3NpZGViYXIuc2NzcyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZnLy4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0VtcHR5T2JqLCBNYW5pcHVsYXRvciwgbWVyZ2VEZWVwT2JqZWN0fSBmcm9tIFwiLi9tYW5pcHVsYXRvclwiO1xyXG5cclxuY2xhc3MgQmFzZU1vZHVsZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gbnVsbDtcclxuXHRcdHRoaXMuX3BhcmFtcyA9IHt9O1xyXG5cdFx0dGhpcy5fY3Jvc3MgPSAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCInICtcclxuXHRcdFx0J1xcdCB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwIDEwMDtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPicgK1xyXG5cdFx0XHQnPHBhdGggZD1cIk04OS43LDEwLjNMODkuNywxMC4zYy0xLTEtMi42LTEtMy41LDBMNTAsNDYuNUwxMy45LDEwLjNjLTEtMS0yLjYtMS0zLjUsMGwwLDBjLTEsMS0xLDIuNiwwLDMuNUw0Ni41LDUwTDEwLjMsODYuMScgK1xyXG5cdFx0XHQnXFx0Yy0xLDEtMSwyLjYsMCwzLjVoMGMxLDEsMi42LDEsMy41LDBMNTAsNTMuNWwzNi4xLDM2LjFjMSwxLDIuNiwxLDMuNSwwbDAsMGMxLTEsMS0yLjYsMC0zLjVMNTMuNSw1MGwzNi4xLTM2LjEnICtcclxuXHRcdFx0J1xcdEM5MC42LDEyLjksOTAuNiwxMS4zLDg5LjcsMTAuM3pcIi8+JyArXHJcblx0XHRcdCc8L3N2Zz4nO1xyXG5cdH1cclxuXHJcblx0Z2V0IGVsZW1lbnQoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudFxyXG5cdH1cclxuXHJcblx0c2V0IGVsZW1lbnQoZWwpIHtcclxuXHRcdHRoaXMuX2VsZW1lbnQgPSBNYW5pcHVsYXRvci5maW5kKGVsKTtcclxuXHR9XHJcblxyXG5cdGdldCBwYXJhbXMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcGFyYW1zXHJcblx0fVxyXG5cclxuXHRzZXQgcGFyYW1zKHBhcmFtcykge1xyXG5cdFx0aWYgKCFpc0VtcHR5T2JqKHBhcmFtcykpIHtcclxuXHRcdFx0bGV0IGF0dHJzID0gTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXModGhpcy5lbGVtZW50KTtcclxuXHRcdFx0dGhpcy5fcGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KHBhcmFtcywgYXR0cnMpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZU1vZHVsZTtcclxuIiwiLyoqXHJcbiAqINCj0LTQsNC70Y/QtdC8INGN0LvQtdC80LXQvdGC0Ysg0YEg0LzQsNGB0YHQuNCy0LBcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcGFyYW0gZWxcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRBcnJheShhcnIsIGVsKSB7XHJcblx0cmV0dXJuIGFyci5maWx0ZXIoKGl0ZW0pID0+ICFlbC5pbmNsdWRlcyhpdGVtKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQk9C70YPQsdC+0LrQvtC1INC+0LHRitC10LTQuNC90LXQvdC40LUg0L7QsdGK0LXQutGC0L7QslxyXG4gKiBAcGFyYW0gb2JqZWN0c1xyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIG1lcmdlRGVlcE9iamVjdCguLi5vYmplY3RzKSB7XHJcblx0Y29uc3QgaXNPYmplY3QgPSBvYmogPT4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xyXG5cclxuXHRyZXR1cm4gb2JqZWN0cy5yZWR1Y2UoKHByZXYsIG9iaikgPT4ge1xyXG5cdFx0T2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcblx0XHRcdGNvbnN0IHBWYWwgPSBwcmV2W2tleV07XHJcblx0XHRcdGNvbnN0IG9WYWwgPSBvYmpba2V5XTtcclxuXHJcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBWYWwpICYmIEFycmF5LmlzQXJyYXkob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBwVmFsLmNvbmNhdCguLi5vVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChpc09iamVjdChwVmFsKSAmJiBpc09iamVjdChvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG1lcmdlRGVlcE9iamVjdChwVmFsLCBvVmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBvVmFsO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcHJldjtcclxuXHR9LCB7fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdC8INC4INC+0LHRitC10LTQuNC90Y/QtdC8INC/0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAcGFyYW0gYXJnXHJcbiAqIEBwYXJhbSBwRGVmYXVsdFxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIG1lcmdlUGFyYW1zKGFyZywgcERlZmF1bHQpIHtcclxuXHRsZXQgbVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChhcmcsIHBEZWZhdWx0KTtcclxuXHJcblx0aWYgKGlzT2JqZWN0KG1QYXJhbXMpICYmICFpc0VtcHR5T2JqKG1QYXJhbXMpKSB7XHJcblx0XHRmb3IgKGNvbnN0IGRhdHVtIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0bGV0IHZhbHVlID0gbm9ybWFsaXplRGF0YShtUGFyYW1zW2RhdHVtXSk7XHJcblxyXG5cdFx0XHRpZiAoZGF0dW0gIT09ICdwYXJhbXMnKSB7XHJcblx0XHRcdFx0aWYgKCEoZGF0dW0gaW4gcERlZmF1bHQpKSB7XHJcblx0XHRcdFx0XHRsZXQgcCA9IGRhdHVtLnNwbGl0KCctJyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHBbMV0gaW4gcERlZmF1bHRbcFswXV0pIHtcclxuXHRcdFx0XHRcdFx0cERlZmF1bHRbcFswXV1bcFsxXV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRkZWxldGUgbVBhcmFtc1tkYXR1bV07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1QYXJhbXNbZGF0dW1dID0gdmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1QYXJhbXMgPSBtZXJnZURlZXBPYmplY3QobVBhcmFtcywgdmFsdWUpXHJcblx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNbZGF0dW1dO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbVBhcmFtc1xyXG59XHJcblxyXG4vKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc09iamVjdFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcblx0cmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC40LLQvtC00LjQvCDQsiDQv9C+0YDRj9C00L7QuiDRgtC40L/RiyDQtNCw0L3QvdGL0YVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSAge1xyXG5cdGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XHJcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0fSBjYXRjaCB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQnNCw0L3QuNC/0YPQu9GP0YbQuNC4INGBINGN0LvQtdC80LXQvdGC0L7QvFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0RGF0YUF0dHJpYnV0ZXMoZWxlbWVudCwgaXNSZW1vdmVEYXRhTmFtZSA9IHRydWUsIGlzUmVtb3ZlUHJlZml4ID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGF0dHJpYnV0ZXM9IHt9LFxyXG5cdFx0XHRhcnIgPSBbXS5maWx0ZXIuY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhdCkge1xyXG5cdFx0XHRcdHJldHVybiAvXmRhdGEtLy50ZXN0KGF0Lm5hbWUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRpZiAoYXJyLmxlbmd0aCkge1xyXG5cdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdGxldCBuYW1lID0gdi5uYW1lLCBwcmVmaXggPSAndmctJztcclxuXHRcdFx0XHRpZiAoaXNSZW1vdmVEYXRhTmFtZSkgbmFtZSA9IG5hbWUuc2xpY2UoNSk7XHJcblx0XHRcdFx0aWYgKGlzUmVtb3ZlUHJlZml4ICYmIG5hbWUuaW5kZXhPZihwcmVmaXgpICE9PSAtMSkgbmFtZSA9IG5hbWUuc2xpY2UoMyk7XHJcblxyXG5cdFx0XHRcdGF0dHJpYnV0ZXNbbmFtZV0gPSBub3JtYWxpemVEYXRhKHYudmFsdWUpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhdHRyaWJ1dGVzXHJcblx0fSxcclxuXHJcblx0Z2V0QXR0cmlidXRlOiBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50IHx8ICFuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vcm1hbGl6ZURhdGEoZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSkpO1xyXG5cdH0sXHJcblxyXG5cdGZpbmQ6IGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0aWYgKCFlbCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ci0L7QstCw0YDQuNGJISDQn9C10YDQstGL0Lkg0L/QsNGA0LDQvNC10YLRgCDQvdC1INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQv9GD0YHRgtGL0LwhJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGxldCBlbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcclxuXHRcdFx0XHRpZiAoZWxtKSByZXR1cm4gZWxtO1xyXG5cdFx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCfQkNGF0L/QtdGAISDQndC1INGD0LTQsNC70L7RgdGMINC90LDQudGC0Lgg0Y3Qu9C10LzQtdC90YInKTtcclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZWwgPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcign0JrQrdCfISDQmtCw0LrQsNGPLdGC0L4g0LTQuNGH0Ywg0Log0L3QsNC8INC30LDQu9C10YLQtdC70LAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEVWRU5UU1xyXG4gKiBAdHlwZSB7e29uOiBldmVudEhhbmRsZXIub259fVxyXG4gKiDQmtCw0Log0Y3RgtC+INGA0LDQsdC+0YLQsNC10YI/XHJcbiAqINCS0YvQt9C+0LIg0YTRg9C90LrRhtC40Lg6IGV2ZW50SGFuZGxlci5vbign0Y3Qu9C10LzQtdC90YIg0LrQvtGC0L7RgNGL0Lkg0L3Rg9C20L3QviDRgtGA0LjQs9C10YDQvdGD0YLRjCcsICfQutCw0Log0YLRgNC40LPQtdGA0L3Rg9GC0Ywg0Y3Qu9C10LzQtdC90YInKTtcclxuICovXHJcbmNvbnN0IGV2ZW50SGFuZGxlciA9IHtcclxuXHRvbjogZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50LCBkZXRhaWwgPSB7fSkge1xyXG5cdFx0Y29uc3QgZXZlbnRTdWNjZXNzID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50LCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KTtcclxuXHJcblx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRTdWNjZXNzKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuaXB1bGF0b3IsIGV2ZW50SGFuZGxlciwgaXNPYmplY3QsIGlzRW1wdHlPYmosIG1lcmdlRGVlcE9iamVjdCwgbWVyZ2VQYXJhbXMsIHJlbW92ZUVsZW1lbnRBcnJheSwgbm9ybWFsaXplRGF0YX1cclxuIiwiaW1wb3J0IEJhc2VNb2R1bGUgZnJvbSBcIi4uLy4uL191dGlscy9qcy9iYXNlLW1vZHVsZVwiO1xyXG5pbXBvcnQge1xyXG5cdGV2ZW50SGFuZGxlcixcclxuXHRNYW5pcHVsYXRvcixcclxuXHRtZXJnZVBhcmFtc1xyXG59IGZyb20gXCIuLi8uLi9fdXRpbHMvanMvbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIFZHRHJvcGRvd24gZXh0ZW5kcyBCYXNlTW9kdWxle1xyXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIGFyZyA9IHt9KSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHR9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR0Ryb3Bkb3duO1xyXG4iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vX3V0aWxzL2pzL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7XHJcblx0ZXZlbnRIYW5kbGVyLFxyXG5cdE1hbmlwdWxhdG9yLFxyXG5cdG1lcmdlUGFyYW1zXHJcbn0gZnJvbSBcIi4uLy4uL191dGlscy9qcy9tYW5pcHVsYXRvclwiO1xyXG5cclxuY29uc3QgRVZFTlRfS0VZX0hJREUgPSAndmcuc2lkZWJhci5oaWRlJztcclxuY29uc3QgRVZFTlRfS0VZX0hJRERFTiA9ICd2Zy5zaWRlYmFyLmhpZGRlbic7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XID0gJ3ZnLnNpZGViYXIuc2hvdyc7XHJcbmNvbnN0IEVWRU5UX0tFWV9TSE9XTiA9ICd2Zy5zaWRlYmFyLnNob3duJztcclxuY29uc3QgRVZFTlRfS0VZX0xPQURFRCA9ICd2Zy5zaWRlYmFyLmxvYWRlZCc7XHJcblxyXG5sZXQgX2lzU2hvd24gPSBmYWxzZTtcclxuXHJcbmNsYXNzIFZHU2lkZWJhciBleHRlbmRzIEJhc2VNb2R1bGV7XHJcblx0Y29uc3RydWN0b3IoZWxlbWVudCwgYXJnID0ge30pIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLnBhcmFtc0RlZmF1bHQgPSB7XHJcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxyXG5cdFx0XHRvdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHRcdGFqYXg6IHtcclxuXHRcdFx0XHRyb3V0ZTogJycsXHJcblx0XHRcdFx0dGFyZ2V0OiAnJ1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMucGFyYW1zID0gbWVyZ2VQYXJhbXMoYXJnLCB0aGlzLnBhcmFtc0RlZmF1bHQpO1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fVxyXG5cclxuXHRpbml0KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGxldCBjcm9zcyA9IF90aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZnLWJ0bi1jbG9zZScpO1xyXG5cdFx0aWYgKGNyb3NzKSB7XHJcblx0XHRcdGxldCBzdmcgPSBjcm9zcy5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuXHRcdFx0aWYgKCFzdmcpIGNyb3NzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgX3RoaXMuX2Nyb3NzKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmVsZW1lbnQudmdTaWRlYmFyID0gdGhpcztcclxuXHR9XHJcblxyXG5cdHRvZ2dsZSgpIHtcclxuXHRcdHJldHVybiBfaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCk7XHJcblx0fVxyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfaXNTaG93bikgcmV0dXJuO1xyXG5cdFx0X2lzU2hvd24gPSB0cnVlO1xyXG5cclxuXHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfU0hPVyk7XHJcblxyXG5cdFx0X3RoaXMuX2JhY2tkcm9wKCk7XHJcblx0XHRfdGhpcy5fb3ZlcmZsb3coKTtcclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRpZiAoX3RoaXMucGFyYW1zLmFqYXgucm91dGUgJiYgX3RoaXMucGFyYW1zLmFqYXgudGFyZ2V0KSBfdGhpcy5fcm91dGUoKTtcclxuXHRcdFx0ZXZlbnRIYW5kbGVyLm9uKF90aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XTik7XHJcblx0XHR9LCA1MCk7XHJcblxyXG5cdFx0X3RoaXMuX2FkZEV2ZW50TGlzdGVuZXIoKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfaXNTaG93bikgcmV0dXJuO1xyXG5cdFx0X2lzU2hvd24gPSBmYWxzZTtcclxuXHJcblx0XHRldmVudEhhbmRsZXIub24oX3RoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJREUpO1xyXG5cclxuXHRcdF90aGlzLl9iYWNrZHJvcCgpO1xyXG5cdFx0X3RoaXMuX292ZXJmbG93KCk7XHJcblx0XHRfdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0ZXZlbnRIYW5kbGVyLm9uKF90aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9ISURERU4pO1xyXG5cdFx0fSwgNTApXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UodGFyZ2V0KSB7XHJcblx0XHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxyXG5cdFx0cmV0dXJuIHRhcmdldD8udmdTaWRlYmFyO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2VJbml0KGJ0bikge1xyXG5cdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHRsZXQgYXJnID0gTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXMoYnRuKSxcclxuXHRcdFx0XHR0YXJnZXQgPSBhcmcudGFyZ2V0IHx8IGJ0bi5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCBudWxsO1xyXG5cclxuXHRcdFx0aWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGRlbGV0ZSBhcmdbJ3RhcmdldCddO1xyXG5cdFx0XHRcdGRlbGV0ZSBhcmdbJ3RvZ2dsZSddO1xyXG5cclxuXHRcdFx0XHRsZXQgc2lkZWJhciA9IG5ldyBWR1NpZGViYXIodGFyZ2V0LCBhcmcpO1xyXG5cdFx0XHRcdHNpZGViYXIudG9nZ2xlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2JhY2tkcm9wKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcyxcclxuXHRcdFx0YmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmctc2lkZWJhci1iYWNrZHJvcCcpO1xyXG5cclxuXHRcdGlmICghX3RoaXMucGFyYW1zLmJhY2tkcm9wKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKGJhY2tkcm9wKSB7XHJcblx0XHRcdGJhY2tkcm9wLnJlbW92ZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgndmctc2lkZWJhci1iYWNrZHJvcCcpO1xyXG5cclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoYmFja2Ryb3ApO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0YmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZScpXHJcblx0XHRcdH0sIDUwKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X292ZXJmbG93KCkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmICghX3RoaXMucGFyYW1zLm92ZXJmbG93KSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIV9pc1Nob3duKSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZ2V0V2lkdGgoKSArICdweCc7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBnZXRXaWR0aCgpIHtcclxuXHRcdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG5cdFx0XHRyZXR1cm4gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudFdpZHRoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2FkZEV2ZW50TGlzdGVuZXIoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0IGJhY2tkcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZnLXNpZGViYXItYmFja2Ryb3AnKTtcclxuXHRcdGlmIChiYWNrZHJvcCkge1xyXG5cdFx0XHRiYWNrZHJvcC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXZnLWRpc21pc3M9XCJzaWRlYmFyXCJdJyldLmZvckVhY2goZnVuY3Rpb24gKGNyb3NzKSB7XHJcblx0XHRcdGNyb3NzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0bGV0IHRhcmdldCA9IGNyb3NzLmRhdGFzZXQudmdUYXJnZXQgfHwgY3Jvc3MuY2xvc2VzdCgnLnZnLXNpZGViYXInKSB8fCBudWxsO1xyXG5cclxuXHRcdFx0XHRpZiAodGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRWR1NpZGViYXIuZ2V0SW5zdGFuY2UodGFyZ2V0KS5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmIChfdGhpcy5wYXJhbXMua2V5Ym9hcmQpIHtcclxuXHRcdFx0ZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0aWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcm91dGUoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0ICRjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfdGhpcy5wYXJhbXMuYWpheC50YXJnZXQpO1xyXG5cdFx0aWYgKCRjb250ZW50KSB7XHJcblx0XHRcdGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHJlcXVlc3Qub3BlbihcImdldFwiLCBfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSwgdHJ1ZSk7XHJcblx0XHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldERhdGEocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfTE9BREVEKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0cmVxdWVzdC5zZW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XHJcblx0XHRcdCRjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVkdTaWRlYmFyO1xyXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGNzcyDQutC70LDRgdGB0Ysg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuaW1wb3J0IFwiLi9hcHAvX3V0aWxzL3Njc3MvZGVmYXVsdC5zY3NzXCI7XHJcblxyXG4vLyB2Z3NpZGViYXJcclxuaW1wb3J0IFwiLi9hcHAvc2lkZWJhci9zY3NzL3Znc2lkZWJhci5zY3NzXCI7XHJcbmltcG9ydCBWR1NpZGViYXIgZnJvbSBcIi4vYXBwL3NpZGViYXIvanMvdmdzaWRlYmFyXCI7XHJcblxyXG4vLyB2Z2Ryb3Bkb3duXHJcbmltcG9ydCBcIi4vYXBwL2Ryb3Bkb3duL3Njc3Mvdmdkcm9wZG93bi5zY3NzXCI7XHJcbmltcG9ydCBWR0Ryb3Bkb3duIGZyb20gXCIuL2FwcC9kcm9wZG93bi9qcy92Z2Ryb3Bkb3duXCI7XHJcblxyXG5mdW5jdGlvbiBvblJlYWR5KCkge1xyXG5cdC8vIHZnc2lkZWJhclxyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJzaWRlYmFyXCJdJyldLmZvckVhY2goZnVuY3Rpb24gKGJ0bikge1xyXG5cdFx0VkdTaWRlYmFyLm1ha2VJbml0KGJ0bik7XHJcblx0fSk7XHJcblxyXG5cdC8vIGRyb3Bkb3duc1xyXG5cdFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS12Zy10b2dnbGU9XCJkcm9wZG93blwiXScpXS5mb3JFYWNoKGZ1bmN0aW9uIChidG4pIHtcclxuXHJcblx0fSk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIG9uUmVhZHkpO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR1NpZGViYXIsIFZHRHJvcGRvd25cclxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==