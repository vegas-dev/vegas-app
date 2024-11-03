import BaseModule from "../../_utils/js/base-module";
import {
	eventHandler,
	Manipulator,
	mergeParams
} from "../../_utils/js/manipulator";

const EVENT_KEY_HIDE = 'vg.sidebar.hide';
const EVENT_KEY_HIDDEN = 'vg.sidebar.hidden';
const EVENT_KEY_SHOW = 'vg.sidebar.show';
const EVENT_KEY_SHOWN = 'vg.sidebar.shown';
const EVENT_KEY_LOADED = 'vg.sidebar.loaded';

let _isShown = false;

class VGSidebar extends BaseModule{
	constructor(element, arg = {}) {
		super();
		this.paramsDefault = {
			button: null,
			backdrop: true,
			overflow: true,
			keyboard: false, // todo not done
			scroll: false, // todo not done
			ajax: {
				route: '',
				target: ''
			}
		};
		this.element = element;
		this.params = mergeParams(arg, this.paramsDefault);
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

		eventHandler.on(_this.element, EVENT_KEY_SHOW);

		_this._backdrop();
		_this._overflow(_isShown);
		_this.element.classList.add('show');

		setTimeout(() => {
			if (_this.params.ajax.route && _this.params.ajax.target) _this._route();
			eventHandler.on(_this.element, EVENT_KEY_SHOWN);
		}, 50);

		_this._addEventListener();
	}

	hide() {
		const _this = this;

		if (!_isShown) return;
		_isShown = false;

		eventHandler.on(_this.element, EVENT_KEY_HIDE);

		_this._backdrop();
		_this._overflow(_isShown);
		_this.element.classList.remove('show');

		setTimeout(() => {
			eventHandler.on(_this.element, EVENT_KEY_HIDDEN);
		}, 50)
	}

	static getInstance(target) {
		if (typeof target === 'string') target = document.querySelector(target)
		return target?.vgSidebar;
	}

	static makeInit(btn) {
		btn.addEventListener('click', () => {
			let arg = Manipulator.getDataAttributes(btn),
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
			}
		}

		[...document.querySelectorAll('[data-vg-dismiss="sidebar"]')].forEach(function (cross) {
			cross.onclick = function () {
				let target = cross.dataset.vgTarget || cross.closest('.vg-sidebar') || null;

				if (target) {
					VGSidebar.getInstance(target).hide();
				}

				return false;
			}
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
				eventHandler.on(_this.element, EVENT_KEY_LOADED);
			};
			request.send();
		}

		const setData = (data) => {
			$content.innerHTML = data;
		};
	}
}

export default VGSidebar;
