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
let _isShown = false,
  _cross = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' + '\t viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">' + '<path d="M89.7,10.3L89.7,10.3c-1-1-2.6-1-3.5,0L50,46.5L13.9,10.3c-1-1-2.6-1-3.5,0l0,0c-1,1-1,2.6,0,3.5L46.5,50L10.3,86.1' + '\tc-1,1-1,2.6,0,3.5h0c1,1,2.6,1,3.5,0L50,53.5l36.1,36.1c1,1,2.6,1,3.5,0l0,0c1-1,1-2.6,0-3.5L53.5,50l36.1-36.1' + '\tC90.6,12.9,90.6,11.3,89.7,10.3z"/>' + '</svg>';
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
    let mParams = (0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)(arg, this.paramsDefault);
    if ((0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.isObject)(mParams) && !(0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.isEmptyObj)(mParams)) {
      for (const datum in mParams) {
        let value = (0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.normalizeData)(mParams[datum]);
        if (datum !== 'params') {
          if (!(datum in this.paramsDefault)) {
            let p = datum.split('-');
            if (p[1] in this.paramsDefault[p[0]]) {
              this.paramsDefault[p[0]][p[1]] = value;
            }
            delete mParams[datum];
          } else {
            mParams[datum] = value;
          }
        } else {
          mParams = (0,_utils_js_manipulator__WEBPACK_IMPORTED_MODULE_1__.mergeDeepObject)(mParams, value);
          delete mParams[datum];
        }
      }
    }
    this.params = mParams;
    this.init();
  }
  init() {
    const _this = this;
    let cross = _this.element.querySelector('.vg-btn-close');
    if (cross) {
      let svg = cross.querySelector('svg');
      if (!svg) cross.insertAdjacentHTML('beforeend', _cross);
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
/* harmony export */   VGSidebar: () => (/* reexport safe */ _app_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _app_utils_scss_default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/_utils/scss/default.scss */ "./app/_utils/scss/default.scss");
/* harmony import */ var _app_sidebar_scss_vgsidebar_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/sidebar/scss/vgsidebar.scss */ "./app/sidebar/scss/vgsidebar.scss");
/* harmony import */ var _app_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/sidebar/js/vgsidebar */ "./app/sidebar/js/vgsidebar.js");
// css классы по умолчанию


// vgsidebar



// dropdowns

function onReady() {
  // vgsidebar
  [...document.querySelectorAll('[data-vg-toggle="sidebar"]')].forEach(function (btn) {
    _app_sidebar_js_vgsidebar__WEBPACK_IMPORTED_MODULE_2__["default"].makeInit(btn);
  });

  // dropdowns
}
document.addEventListener("DOMContentLoaded", onReady);

})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdhcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEtBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7QUMzT0E7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92Zy8uL2FwcC9fdXRpbHMvanMvYmFzZS1tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vdmcvLi9hcHAvX3V0aWxzL2pzL21hbmlwdWxhdG9yLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL3NpZGViYXIvanMvdmdzaWRlYmFyLmpzIiwid2VicGFjazovL3ZnLy4vYXBwL191dGlscy9zY3NzL2RlZmF1bHQuc2NzcyIsIndlYnBhY2s6Ly92Zy8uL2FwcC9zaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3MiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92Zy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNFbXB0eU9iaiwgTWFuaXB1bGF0b3IsIG1lcmdlRGVlcE9iamVjdH0gZnJvbSBcIi4vbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNsYXNzIEJhc2VNb2R1bGUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5fZWxlbWVudCA9IG51bGw7XHJcblx0XHR0aGlzLl9wYXJhbXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdGdldCBlbGVtZW50KCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRcclxuXHR9XHJcblxyXG5cdHNldCBlbGVtZW50KGVsKSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gTWFuaXB1bGF0b3IuZmluZChlbCk7XHJcblx0fVxyXG5cclxuXHRnZXQgcGFyYW1zKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcmFtc1xyXG5cdH1cclxuXHJcblx0c2V0IHBhcmFtcyhwYXJhbXMpIHtcclxuXHRcdGlmICghaXNFbXB0eU9iaihwYXJhbXMpKSB7XHJcblx0XHRcdGxldCBhdHRycyA9IE1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMuZWxlbWVudCk7XHJcblx0XHRcdHRoaXMuX3BhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChwYXJhbXMsIGF0dHJzKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhc2VNb2R1bGU7XHJcbiIsIi8qKlxyXG4gKiDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgtGLINGBINC80LDRgdGB0LjQstCwXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50QXJyYXkoYXJyLCBlbCkge1xyXG5cdHJldHVybiBhcnIuZmlsdGVyKChpdGVtKSA9PiAhZWwuaW5jbHVkZXMoaXRlbSkpO1xyXG59XHJcblxyXG4vKipcclxuICog0JPQu9GD0LHQvtC60L7QtSDQvtCx0YrQtdC00LjQvdC10L3QuNC1INC+0LHRitC10LrRgtC+0LJcclxuICogQHBhcmFtIG9iamVjdHNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZURlZXBPYmplY3QoLi4ub2JqZWN0cykge1xyXG5cdGNvbnN0IGlzT2JqZWN0ID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxuXHJcblx0cmV0dXJuIG9iamVjdHMucmVkdWNlKChwcmV2LCBvYmopID0+IHtcclxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG5cdFx0XHRjb25zdCBwVmFsID0gcHJldltrZXldO1xyXG5cdFx0XHRjb25zdCBvVmFsID0gb2JqW2tleV07XHJcblxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwVmFsKSAmJiBBcnJheS5pc0FycmF5KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gcFZhbC5jb25jYXQoLi4ub1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoaXNPYmplY3QocFZhbCkgJiYgaXNPYmplY3Qob1ZhbCkpIHtcclxuXHRcdFx0XHRwcmV2W2tleV0gPSBtZXJnZURlZXBPYmplY3QocFZhbCwgb1ZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gb1ZhbDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHByZXY7XHJcblx0fSwge30pO1xyXG59XHJcblxyXG4vKipcclxuICog0JXRgdC70Lgg0YfRgtC+LdC90LjQsdGD0LTRjCDQsiDQvtCx0YrQtdC60YLQtVxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iaihvYmopIHtcclxuXHRmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpc09iamVjdFxyXG4gKiBAcGFyYW0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcblx0cmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC40LLQvtC00LjQvCDQsiDQv9C+0YDRj9C00L7QuiDRgtC40L/RiyDQtNCw0L3QvdGL0YVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbHVlKSAge1xyXG5cdGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gTnVtYmVyKHZhbHVlKS50b1N0cmluZygpKSB7XHJcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0fSBjYXRjaCB7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQnNCw0L3QuNC/0YPQu9GP0YbQuNC4INGBINGN0LvQtdC80LXQvdGC0L7QvFxyXG4gKi9cclxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XHJcblx0Z2V0RGF0YUF0dHJpYnV0ZXMoZWxlbWVudCwgaXNSZW1vdmVEYXRhTmFtZSA9IHRydWUsIGlzUmVtb3ZlUHJlZml4ID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGF0dHJpYnV0ZXM9IHt9LFxyXG5cdFx0XHRhcnIgPSBbXS5maWx0ZXIuY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhdCkge1xyXG5cdFx0XHRcdHJldHVybiAvXmRhdGEtLy50ZXN0KGF0Lm5hbWUpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRpZiAoYXJyLmxlbmd0aCkge1xyXG5cdFx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG5cdFx0XHRcdGxldCBuYW1lID0gdi5uYW1lLCBwcmVmaXggPSAndmctJztcclxuXHRcdFx0XHRpZiAoaXNSZW1vdmVEYXRhTmFtZSkgbmFtZSA9IG5hbWUuc2xpY2UoNSk7XHJcblx0XHRcdFx0aWYgKGlzUmVtb3ZlUHJlZml4ICYmIG5hbWUuaW5kZXhPZihwcmVmaXgpICE9PSAtMSkgbmFtZSA9IG5hbWUuc2xpY2UoMyk7XHJcblxyXG5cdFx0XHRcdGF0dHJpYnV0ZXNbbmFtZV0gPSBub3JtYWxpemVEYXRhKHYudmFsdWUpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBhdHRyaWJ1dGVzXHJcblx0fSxcclxuXHJcblx0Z2V0QXR0cmlidXRlOiBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZUF0dHJpYnV0ZSkge1xyXG5cdFx0aWYgKCFlbGVtZW50IHx8ICFuYW1lQXR0cmlidXRlKSB7XHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vcm1hbGl6ZURhdGEoZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZUF0dHJpYnV0ZSkpO1xyXG5cdH0sXHJcblxyXG5cdGZpbmQ6IGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0aWYgKCFlbCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ9Ci0L7QstCw0YDQuNGJISDQn9C10YDQstGL0Lkg0L/QsNGA0LDQvNC10YLRgCDQvdC1INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQv9GD0YHRgtGL0LwhJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGxldCBlbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcclxuXHRcdFx0XHRpZiAoZWxtKSByZXR1cm4gZWxtO1xyXG5cdFx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCfQkNGF0L/QtdGAISDQndC1INGD0LTQsNC70L7RgdGMINC90LDQudGC0Lgg0Y3Qu9C10LzQtdC90YInKTtcclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZWwgPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcign0JrQrdCfISDQmtCw0LrQsNGPLdGC0L4g0LTQuNGH0Ywg0Log0L3QsNC8INC30LDQu9C10YLQtdC70LAnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEVWRU5UU1xyXG4gKiBAdHlwZSB7e29uOiBldmVudEhhbmRsZXIub259fVxyXG4gKiDQmtCw0Log0Y3RgtC+INGA0LDQsdC+0YLQsNC10YI/XHJcbiAqINCS0YvQt9C+0LIg0YTRg9C90LrRhtC40Lg6IGV2ZW50SGFuZGxlci5vbign0Y3Qu9C10LzQtdC90YIg0LrQvtGC0L7RgNGL0Lkg0L3Rg9C20L3QviDRgtGA0LjQs9C10YDQvdGD0YLRjCcsICfQutCw0Log0YLRgNC40LPQtdGA0L3Rg9GC0Ywg0Y3Qu9C10LzQtdC90YInKTtcclxuICovXHJcbmNvbnN0IGV2ZW50SGFuZGxlciA9IHtcclxuXHRvbjogZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50LCBkZXRhaWwgPSB7fSkge1xyXG5cdFx0Y29uc3QgZXZlbnRTdWNjZXNzID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50LCB7XHJcblx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdGRldGFpbDogZGV0YWlsXHJcblx0XHR9KTtcclxuXHJcblx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRTdWNjZXNzKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuaXB1bGF0b3IsIGV2ZW50SGFuZGxlciwgaXNPYmplY3QsIGlzRW1wdHlPYmosIG1lcmdlRGVlcE9iamVjdCwgcmVtb3ZlRWxlbWVudEFycmF5LCBub3JtYWxpemVEYXRhfVxyXG4iLCJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tIFwiLi4vLi4vX3V0aWxzL2pzL2Jhc2UtbW9kdWxlXCI7XHJcbmltcG9ydCB7XHJcblx0ZXZlbnRIYW5kbGVyLFxyXG5cdE1hbmlwdWxhdG9yLFxyXG5cdG1lcmdlRGVlcE9iamVjdCxcclxuXHRpc09iamVjdCwgaXNFbXB0eU9iaiwgbm9ybWFsaXplRGF0YVxyXG59IGZyb20gXCIuLi8uLi9fdXRpbHMvanMvbWFuaXB1bGF0b3JcIjtcclxuXHJcbmNvbnN0IEVWRU5UX0tFWV9ISURFID0gJ3ZnLnNpZGViYXIuaGlkZSc7XHJcbmNvbnN0IEVWRU5UX0tFWV9ISURERU4gPSAndmcuc2lkZWJhci5oaWRkZW4nO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPVyA9ICd2Zy5zaWRlYmFyLnNob3cnO1xyXG5jb25zdCBFVkVOVF9LRVlfU0hPV04gPSAndmcuc2lkZWJhci5zaG93bic7XHJcbmNvbnN0IEVWRU5UX0tFWV9MT0FERUQgPSAndmcuc2lkZWJhci5sb2FkZWQnO1xyXG5cclxubGV0IF9pc1Nob3duID0gZmFsc2UsXHJcblx0X2Nyb3NzID0gJzxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiJyArXHJcblx0XHQnXFx0IHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+JyArXHJcblx0XHQnPHBhdGggZD1cIk04OS43LDEwLjNMODkuNywxMC4zYy0xLTEtMi42LTEtMy41LDBMNTAsNDYuNUwxMy45LDEwLjNjLTEtMS0yLjYtMS0zLjUsMGwwLDBjLTEsMS0xLDIuNiwwLDMuNUw0Ni41LDUwTDEwLjMsODYuMScgK1xyXG5cdFx0J1xcdGMtMSwxLTEsMi42LDAsMy41aDBjMSwxLDIuNiwxLDMuNSwwTDUwLDUzLjVsMzYuMSwzNi4xYzEsMSwyLjYsMSwzLjUsMGwwLDBjMS0xLDEtMi42LDAtMy41TDUzLjUsNTBsMzYuMS0zNi4xJyArXHJcblx0XHQnXFx0QzkwLjYsMTIuOSw5MC42LDExLjMsODkuNywxMC4zelwiLz4nICtcclxuXHRcdCc8L3N2Zz4nO1xyXG5cclxuY2xhc3MgVkdTaWRlYmFyIGV4dGVuZHMgQmFzZU1vZHVsZXtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50LCBhcmcgPSB7fSkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMucGFyYW1zRGVmYXVsdCA9IHtcclxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdG92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcclxuXHRcdFx0YWpheDoge1xyXG5cdFx0XHRcdHJvdXRlOiAnJyxcclxuXHRcdFx0XHR0YXJnZXQ6ICcnXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG5cclxuXHRcdGxldCBtUGFyYW1zID0gbWVyZ2VEZWVwT2JqZWN0KGFyZywgdGhpcy5wYXJhbXNEZWZhdWx0KTtcclxuXHRcdGlmIChpc09iamVjdChtUGFyYW1zKSAmJiAhaXNFbXB0eU9iaihtUGFyYW1zKSkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGRhdHVtIGluIG1QYXJhbXMpIHtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSBub3JtYWxpemVEYXRhKG1QYXJhbXNbZGF0dW1dKTtcclxuXHJcblx0XHRcdFx0aWYgKGRhdHVtICE9PSAncGFyYW1zJykge1xyXG5cdFx0XHRcdFx0aWYgKCEoZGF0dW0gaW4gdGhpcy5wYXJhbXNEZWZhdWx0KSkge1xyXG5cdFx0XHRcdFx0XHRsZXQgcCA9IGRhdHVtLnNwbGl0KCctJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocFsxXSBpbiB0aGlzLnBhcmFtc0RlZmF1bHRbcFswXV0pIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnBhcmFtc0RlZmF1bHRbcFswXV1bcFsxXV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1QYXJhbXNbZGF0dW1dO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bVBhcmFtc1tkYXR1bV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bVBhcmFtcyA9IG1lcmdlRGVlcE9iamVjdChtUGFyYW1zLCB2YWx1ZSlcclxuXHRcdFx0XHRcdGRlbGV0ZSBtUGFyYW1zW2RhdHVtXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBhcmFtcyA9IG1QYXJhbXM7XHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdGluaXQoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0IGNyb3NzID0gX3RoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmctYnRuLWNsb3NlJyk7XHJcblx0XHRpZiAoY3Jvc3MpIHtcclxuXHRcdFx0bGV0IHN2ZyA9IGNyb3NzLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG5cdFx0XHRpZiAoIXN2ZykgY3Jvc3MuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBfY3Jvc3MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZWxlbWVudC52Z1NpZGViYXIgPSB0aGlzO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCkge1xyXG5cdFx0cmV0dXJuIF9pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKTtcclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF9pc1Nob3duKSByZXR1cm47XHJcblx0XHRfaXNTaG93biA9IHRydWU7XHJcblxyXG5cdFx0ZXZlbnRIYW5kbGVyLm9uKF90aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9TSE9XKTtcclxuXHJcblx0XHRfdGhpcy5fYmFja2Ryb3AoKTtcclxuXHRcdF90aGlzLl9vdmVyZmxvdygpO1xyXG5cdFx0X3RoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGlmIChfdGhpcy5wYXJhbXMuYWpheC5yb3V0ZSAmJiBfdGhpcy5wYXJhbXMuYWpheC50YXJnZXQpIF90aGlzLl9yb3V0ZSgpO1xyXG5cdFx0XHRldmVudEhhbmRsZXIub24oX3RoaXMuZWxlbWVudCwgRVZFTlRfS0VZX1NIT1dOKTtcclxuXHRcdH0sIDUwKTtcclxuXHJcblx0XHRfdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcigpO1xyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRpZiAoIV9pc1Nob3duKSByZXR1cm47XHJcblx0XHRfaXNTaG93biA9IGZhbHNlO1xyXG5cclxuXHRcdGV2ZW50SGFuZGxlci5vbihfdGhpcy5lbGVtZW50LCBFVkVOVF9LRVlfSElERSk7XHJcblxyXG5cdFx0X3RoaXMuX2JhY2tkcm9wKCk7XHJcblx0XHRfdGhpcy5fb3ZlcmZsb3coKTtcclxuXHRcdF90aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRldmVudEhhbmRsZXIub24oX3RoaXMuZWxlbWVudCwgRVZFTlRfS0VZX0hJRERFTik7XHJcblx0XHR9LCA1MClcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZSh0YXJnZXQpIHtcclxuXHRcdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXHJcblx0XHRyZXR1cm4gdGFyZ2V0Py52Z1NpZGViYXI7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgbWFrZUluaXQoYnRuKSB7XHJcblx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdGxldCBhcmcgPSBNYW5pcHVsYXRvci5nZXREYXRhQXR0cmlidXRlcyhidG4pLFxyXG5cdFx0XHRcdHRhcmdldCA9IGFyZy50YXJnZXQgfHwgYnRuLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8IG51bGw7XHJcblxyXG5cdFx0XHRpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0ZGVsZXRlIGFyZ1sndGFyZ2V0J107XHJcblx0XHRcdFx0ZGVsZXRlIGFyZ1sndG9nZ2xlJ107XHJcblxyXG5cdFx0XHRcdGxldCBzaWRlYmFyID0gbmV3IFZHU2lkZWJhcih0YXJnZXQsIGFyZyk7XHJcblx0XHRcdFx0c2lkZWJhci50b2dnbGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfYmFja2Ryb3AoKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52Zy1zaWRlYmFyLWJhY2tkcm9wJyk7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5wYXJhbXMuYmFja2Ryb3ApIHJldHVybjtcclxuXHJcblx0XHRpZiAoYmFja2Ryb3ApIHtcclxuXHRcdFx0YmFja2Ryb3AucmVtb3ZlKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCd2Zy1zaWRlYmFyLWJhY2tkcm9wJyk7XHJcblxyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChiYWNrZHJvcCk7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdmYWRlJylcclxuXHRcdFx0fSwgNTApXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfb3ZlcmZsb3coKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCFfdGhpcy5wYXJhbXMub3ZlcmZsb3cpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghX2lzU2hvd24pIHtcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBnZXRXaWR0aCgpICsgJ3B4JztcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGdldFdpZHRoKCkge1xyXG5cdFx0XHRjb25zdCBkb2N1bWVudFdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcblx0XHRcdHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50V2lkdGgpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfYWRkRXZlbnRMaXN0ZW5lcigpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRsZXQgYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmctc2lkZWJhci1iYWNrZHJvcCcpO1xyXG5cdFx0aWYgKGJhY2tkcm9wKSB7XHJcblx0XHRcdGJhY2tkcm9wLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdmctZGlzbWlzcz1cInNpZGViYXJcIl0nKV0uZm9yRWFjaChmdW5jdGlvbiAoY3Jvc3MpIHtcclxuXHRcdFx0Y3Jvc3Mub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gY3Jvc3MuZGF0YXNldC52Z1RhcmdldCB8fCBjcm9zcy5jbG9zZXN0KCcudmctc2lkZWJhcicpIHx8IG51bGw7XHJcblxyXG5cdFx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHRcdFZHU2lkZWJhci5nZXRJbnN0YW5jZSh0YXJnZXQpLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKF90aGlzLnBhcmFtcy5rZXlib2FyZCkge1xyXG5cdFx0XHRkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpIHtcclxuXHRcdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yb3V0ZSgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRsZXQgJGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF90aGlzLnBhcmFtcy5hamF4LnRhcmdldCk7XHJcblx0XHRpZiAoJGNvbnRlbnQpIHtcclxuXHRcdFx0bGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0cmVxdWVzdC5vcGVuKFwiZ2V0XCIsIF90aGlzLnBhcmFtcy5hamF4LnJvdXRlLCB0cnVlKTtcclxuXHRcdFx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2V0RGF0YShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0ZXZlbnRIYW5kbGVyLm9uKF90aGlzLmVsZW1lbnQsIEVWRU5UX0tFWV9MT0FERUQpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXF1ZXN0LnNlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcclxuXHRcdFx0JGNvbnRlbnQuaW5uZXJIVE1MID0gZGF0YTtcclxuXHRcdH07XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWR1NpZGViYXI7XHJcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gY3NzINC60LvQsNGB0YHRiyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG5pbXBvcnQgXCIuL2FwcC9fdXRpbHMvc2Nzcy9kZWZhdWx0LnNjc3NcIjtcclxuXHJcbi8vIHZnc2lkZWJhclxyXG5pbXBvcnQgXCIuL2FwcC9zaWRlYmFyL3Njc3MvdmdzaWRlYmFyLnNjc3NcIjtcclxuaW1wb3J0IFZHU2lkZWJhciBmcm9tIFwiLi9hcHAvc2lkZWJhci9qcy92Z3NpZGViYXJcIjtcclxuXHJcbi8vIGRyb3Bkb3duc1xyXG5cclxuZnVuY3Rpb24gb25SZWFkeSgpIHtcclxuXHQvLyB2Z3NpZGViYXJcclxuXHRbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdmctdG9nZ2xlPVwic2lkZWJhclwiXScpXS5mb3JFYWNoKGZ1bmN0aW9uIChidG4pIHtcclxuXHRcdFZHU2lkZWJhci5tYWtlSW5pdChidG4pO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBkcm9wZG93bnNcclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgb25SZWFkeSk7XHJcblxyXG5leHBvcnQge1xyXG5cdFZHU2lkZWJhclxyXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9