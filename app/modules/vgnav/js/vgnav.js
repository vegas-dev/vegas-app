import BaseModule from "../../base-module";
import Selectors from "../../../utils/js/dom/selectors";
import Responsive from "../../../utils/js/components/responsive";
import {getSVG} from "../../module-fn";
import {execute, isDisabled, isVisible, mergeDeepObject, noop, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import {Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * Constants
 */
const NAME = 'nav';
const NAME_KEY = 'vg.nav';

/**
 * Constants Classes
 */
const CLASS_NAME_SHOW   = 'show';
const CLASS_NAME_FADE   = 'fade';
const CLASS_NAME_ACTIVE = 'active';
const SELECTOR_DATA_TOGGLE = '.vg-nav a';

/**
 * Constants Events
 */
const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}.data.api`;
const EVENT_MOUSEOUT_DATA_API  = `mouseout.${NAME_KEY}.data.api`;
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEYUP_DATA_API = `keyup.${NAME_KEY}.data.api`;
const EVENT_RESIZE_DATA_API = `resize.${NAME_KEY}.data.api`;

class VGNav extends BaseModule {
	constructor(element, params = {}) {
		super(element);

		this._params = this._getParams(element, mergeDeepObject({
			breakpoint: 'lg',
			placement: 'horizontal',
			hover: false,
			animation: true,
			timeoutAnimation: 300,
			toggle: '<span class="default"></span>',
			hamburger: {
				enable: true,
				always: false,
				title: 'This is Navigation',
				body: null
			},
			callbacks: {
				afterInit: noop
			}
		}, params));

		this._classes = {
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
		};

		this._navigation = null;
		this.navigation = '.' + this._classes.wrapper;

		if (this._params.animation === false) {
			this._params.timeoutAnimation = 10
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
		let elm = Selectors.find(el, this._element);
		if (!elm) return;
		this._navigation = elm;
	}

	build() {
		if (!this.navigation) return;

		let params = this._params,
			classes = this._classes;

		// Вешаем основные классы
		this._element.classList.add(classes.container);
		this._element.classList.add('vg-nav-' + params.placement);

		if (!params.hamburger.always) {
			if (!params.breakpoint) {
				this._element.classList.add(classes.expand);
			} else if (params.breakpoint !== false) {
				this._element.classList.add('vg-nav-' + params.breakpoint);
			}
		} else {
			this._element.classList.add(classes.hamburgerAlways);
		}

		console.log(params)

		// Устанавливаем гамбургер, если его нет в разметке
		if (params.hamburger.enable) {
			let isHamburger = Selectors.find('.' + classes.hamburger, this._element);

			if (isHamburger === null) {
				let mobileNavTitle = '',
					hamburger = '<span class="' + classes.hamburger + '--lines"><span></span><span></span><span></span></span>';

				if (params.hamburger.title) {
					mobileNavTitle = '<span class="' + classes.hamburger + '--title">'+ params.hamburger.title +'</span>';
				}

				if (params.hamburger.body !== null) {
					hamburger = params.hamburger.body;
				}

				let a = document.createElement('a');
				a.classList.add(classes.hamburger);
				Manipulator.set(a, 'data-vg-toggle', 'sidebar');
				Manipulator.set(a, 'href', '#sidebar-nav');
				a.innerHTML = mobileNavTitle + hamburger;

				this._element.before(a);
			}
		}

		// Устанавливаем указатель дропа
		if (params.toggle) {
			let $dropdown_a = [...Selectors.findAll('.dropdown > a', this._element)],
				toggle = '<span class="toggle">' + params.toggle + '</span>';

			if ($dropdown_a.length) {
				$dropdown_a.forEach(function (elem) {
					if (!elem.querySelector('.toggle') && !elem.closest('.dots')) {
						elem.setAttribute('aria-expanded', 'false')
						elem.insertAdjacentHTML('beforeend', toggle)
					}
				});
			}
		}

		if ('afterInit' in this._params.callbacks) {
			execute(this._params.callbacks.afterInit, [this]);
		}
	}

	show(relatedTarget) {
		let target = relatedTarget.relatedTarget;

		if (!target || isDisabled(target)) return;
	}

	hide(relatedTarget) {

	}

	static init(element, params = {}) {
		const instance = VGNav.getOrCreateInstance(element, params);
		instance.build();

		let drops = Selectors.findAll('.dropdown', instance.navigation);

	}
}

EventHandler.on(window, EVENT_RESIZE_DATA_API, function () {
	if (Selectors.find('.vg-nav')) {
		const instance = VGNav.getOrCreateInstance('.vg-nav', {});
		instance.build();
	}
})

export default VGNav;