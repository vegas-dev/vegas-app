import BaseModule from "../../base-module";
import Selectors from "../../../utils/js/dom/selectors";
import {getSVG} from "../../module-fn";
import {execute, isDisabled, isVisible, mergeDeepObject, noop, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import Placement from "../../../utils/js/components/placement";

/**
 * Constants
 */
const NAME = 'nav';
const NAME_KEY = 'vg.nav';

/**
 * Constants Classes
 */
const CLASS_NAME           = 'vg-nav';
const CLASS_NAME_SHOW      = 'show';
const CLASS_NAME_FADE      = 'fade';
const CLASS_NAME_ACTIVE    = 'active';

/**
 * Constants toggle
 */
const SELECTOR_DATA_TOGGLE = '.' + CLASS_NAME + ' a';

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

class VGNav extends BaseModule {
	constructor(element, params = {}) {
		super(element);

		this._params = this._getParams(element, mergeDeepObject({
			breakpoint: 'lg',
			placement: 'horizontal',
			hover: true,
			animation: {
				enable: true,
				timeout: 700
			},
			toggle: '<span class="default"></span>',
			hamburger: {
				enable: true,
				always: false,
				title: '',
				body: null
			},
			callbacks: {
				afterInit: noop,
				afterClick: noop,
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

		if (this._params.animation.enable === false) {
			this._params.animation.timeout = 10;
		}

		this._openDrops = new Map();
		this._handleScroll = this._handleScroll.bind(this);
		this._handleResize = this._handleResize.bind(this);
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

		// Устанавливаем гамбургер, если его нет в разметке
		if (params.hamburger.enable) {
			let isHamburger = !!Selectors.find('.' + classes.hamburger, this._element);

			if (!isHamburger) {
				let mobileNavTitle = '',
					hamburger = '<span class="' + classes.hamburger + '--lines"><span></span><span></span><span></span></span>';

				if (params.hamburger.title) {
					mobileNavTitle = '<span class="' + classes.hamburger + '--title">' + params.hamburger.title + '</span>';
				}

				if (params.hamburger.body !== null) {
					hamburger = params.hamburger.body;
				}

				let a = document.createElement('a');
				a.classList.add(classes.hamburger);
				Manipulator.set(a, 'data-vg-toggle', 'sidebar');
				Manipulator.set(a, 'href', '#sidebar-nav');
				a.innerHTML = mobileNavTitle + hamburger;

				this._element.append(a);
			}
		}

		// Устанавливаем указатель дропа
		if (params.toggle) {
			let $dropdown_a = [...Selectors.findAll('.dropdown > a', this._element)],
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

		if ('afterInit' in this._params.callbacks) {
			execute(this._params.callbacks.afterInit, [this]);
		}
	}

	show(relatedTarget) {
		let target = relatedTarget.relatedTarget;

		if (!target || isDisabled(target)) return;

		if (!target.closest('.dropdown-content')) {
			target.classList.add('first');
		}

		const showEvent = EventHandler.trigger(target, EVENT_KEY_SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		let drop = Selectors.find('.dropdown-content', target),
			link = target.firstElementChild;

		if (link) link.setAttribute('aria-expanded', 'true');
		drop.classList.add(CLASS_NAME_SHOW);
		target.classList.add(CLASS_NAME_ACTIVE);

		const $placement = new Placement({
			reference: target,
			drop: drop,
			placement: 'bottom-start',
			fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
			offset: [0, 6],
			boundary: 'clippingParents',
			autoFlip: true,
			overflowProtection: true
		});

		$placement._setPlacement();

		this._openDrops.set(drop, {
			reference: target,
			placement: $placement,
			scrollHandler: this._handleScroll,
			resizeHandler: this._handleResize
		});

		window.addEventListener('scroll', this._handleScroll, { passive: true, capture: true });
		window.addEventListener('resize', this._handleResize);

		const completeCallBack = () => {
			drop.classList.add(CLASS_NAME_FADE);
			EventHandler.trigger(target, EVENT_KEY_SHOWN, relatedTarget);
		};
		this._queueCallback(completeCallBack, drop, true, 10);
	}

	hide(relatedTarget) {
		const _this = this;
		if ('ontouchstart' in document.documentElement) {
			for (const element of [].concat(...document.body.children)) {
				EventHandler.off(element, 'mouseover', noop);
			}
		}

		let element = relatedTarget.relatedTarget;

		if ('elm' in relatedTarget && relatedTarget.elm) {
			element = relatedTarget.elm;
		}

		if (element) {
			const hideEvent = EventHandler.trigger(element, EVENT_KEY_HIDE);
			if (hideEvent.defaultPrevented) return;

			element.classList.remove(CLASS_NAME_ACTIVE);

			if (element.classList.contains('first')) {
				element.classList.remove('first');
			}

			[...Selectors.findAll('.' + CLASS_NAME_SHOW, element)].forEach(function (el, index) {
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
						EventHandler.trigger(el, EVENT_KEY_HIDDEN, relatedTarget);
					};

					_this._queueCallback(completeCallback, el, true, 500);
				}

				const dropData = _this._openDrops.get(el);
				if (dropData) {
					window.removeEventListener('scroll', dropData.scrollHandler, { capture: true });
					window.removeEventListener('resize', dropData.resizeHandler);
					_this._openDrops.delete(el);
				}
			});
		}
	}

	_handleScroll() {
		for (const [drop, data] of this._openDrops.entries()) {
			if (drop.offsetParent === null) {
				this._cleanupDrop(drop);
				continue;
			}

			data.placement._setPlacement();

			if (!this._isElementInViewport(drop)) {
				const target = data.reference;
				this.hide({ relatedTarget: target });
			}
		}
	}

	_handleResize() {
		for (const [drop, data] of this._openDrops.entries()) {
			if (drop.offsetParent === null) continue;
			data.placement._setPlacement();
		}
	}

	_cleanupDrop(drop) {
		const dropData = this._openDrops.get(drop);
		if (dropData) {
			window.removeEventListener('scroll', dropData.scrollHandler, { capture: true });
			window.removeEventListener('resize', dropData.resizeHandler);
			this._openDrops.delete(drop);
		}
	}

	_isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		const viewHeight = window.innerHeight || document.documentElement.clientHeight;
		const viewWidth = window.innerWidth || document.documentElement.clientWidth;

		const vertInView = (rect.top <= viewHeight) && ((rect.top + rect.height) >= 0);
		const horInView = (rect.left <= viewWidth) && ((rect.left + rect.width) >= 0);

		return vertInView && horInView;
	}

	static init(element, params = {}) {
		const instance = VGNav.getOrCreateInstance(element, params);
		instance.build();

		let drops = Selectors.findAll('.dropdown', instance.navigation);

		if (instance._params.hover && !instance.isMobileDevice()) {
			[...drops].forEach(function (el) {
				let currentElem = null;

				EventHandler.on(el, EVENT_MOUSEOVER_DATA_API, function (event) {
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

				EventHandler.on(el, EVENT_MOUSEOUT_DATA_API, function (event) {
					if (!currentElem) return;

					let relatedTarget = event.relatedTarget?.closest('.dropdown'),
						elm = currentElem;

					while (relatedTarget) {
						if (relatedTarget === currentElem) return;
						relatedTarget = relatedTarget.parentNode;
					}

					currentElem = null;
					instance.hide({ relatedTarget: relatedTarget, elm: elm });
				});
			});
		}

		const vgNavSidebar = document.getElementById('sidebar-nav');
		let hamburger = instance._element.querySelector('.' + instance._classes.hamburger);

		if (vgNavSidebar && hamburger) {
			vgNavSidebar.addEventListener('vg.sidebar.show', function () {
				hamburger.classList.add(instance._classes.hamburgerActive);
			});

			vgNavSidebar.addEventListener('vg.sidebar.hide', function () {
				hamburger.classList.remove(instance._classes.hamburgerActive);
			});
		}
	}

	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) {
			return;
		}

		VGNav.hideOpenDrops(event);
	}

	static hideOpenDrops(event) {
		[...Selectors.findAll('.dropdown:not(.disabled):not(:disabled).active')].forEach((el) => {
			let target = event.target,
				drop = target.closest('.dropdown');

			if (el !== drop) {
				const nav = el.closest('.vg-nav');
				const context = VGNav.getInstance(nav);
				if (!context) return;

				let isFirst = !!nav.querySelector('.first'),
					dropContent = !!target.closest('.dropdown-content');

				if (isFirst && dropContent) {
					return;
				}

				const relatedTarget = { relatedTarget: el };

				context.hide(relatedTarget);
			}
		});
	}
}

EventHandler.on(document, EVENT_KEYUP_DATA_API, VGNav.clearDrops);
EventHandler.on(document, EVENT_CLICK_DATA_API, VGNav.clearDrops);
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (!Manipulator.has(this, 'aria-expanded')) {
		return;
	}

	let nav = this.closest('.vg-nav');
	const instance = VGNav.getOrCreateInstance(nav);

	if ('afterClick' in instance._params.callbacks) {
		execute(instance._params.callbacks.afterClick, [instance, event, this]);
	}

	if (instance._params.hover && !instance.isMobileDevice()) return;

	event.preventDefault();

	let drop = this.parentNode;
	if (!drop) return;

	if (isDisabled(drop) && !isVisible(drop)) {
		return;
	}

	let isFirst = !!nav.querySelector('.first'),
		dropContent = !!this.closest('.dropdown-content');

	if (dropContent && isFirst) {
		if (drop.classList.contains('active')) {
			instance.hide({ relatedTarget: drop });
			return;
		}
	} else {
		[...Selectors.findAll('.active', nav)].forEach(function (el) {
			instance.hide({ relatedTarget: el });
		});
	}

	instance.show({ relatedTarget: drop });
});

export default VGNav;