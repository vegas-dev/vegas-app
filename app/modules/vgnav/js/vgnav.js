import BaseModule from "../../base-module";
import Selectors from "../../../_utils/js/selectors";
import Responsive from "../../../_utils/js/responsive";
import {getSVG} from "../../../_utils/js/module-fn";
import {execute, isDisabled, isVisible, noop, normalizeData} from "../../../_utils/js/functions";
import EventHandler from "../../../_utils/js/event";
import {Manipulator} from "../../../_utils/js/manipulator";

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

/**
 * Default Params
 */
const PARAMS_DEFAULT =  {
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
	callback: noop,
	animation: true,
	timeoutAnimation: 300,
	ajax: {
		route: '',
		target: ''
	}
};

class VGNav extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._navigation = null;
		this.navigation = '.' + this.params.classes.wrapper;

		if (this.params.animation === false) {
			this.params.timeoutAnimation = 10
		}
	}

	static get Default() {
		return PARAMS_DEFAULT
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
		this._navigation = Selectors.get(el, this.element);
	}

	build() {
		if (!this.navigation) return;

		let movedLinks = [],
			params = this.params,
			$links = Selectors.findAll('.' + this.params.classes.wrapper + ' > li', this.navigation);

		// Вешаем основные классы
		this.element.classList.add(params.classes.container);
		this.element.classList.add('vg-nav-' + params.placement);

		// Если нужно оставить список меню или установить медиа точку
		if (params.breakpoint === null) {
			params.expand = false;
		}

		if (params.breakpoint === null || !params.expand) {
			this.element.classList.add(params.classes.expand);
		} else {
			this.element.classList.add('vg-nav-' + params.breakpoint);
		}

		// Меню срабатывает при наведении, если это не мобильное устройство
		if (params.hover) {
			this.element.classList.add(params.classes.hover);

			if (Responsive.checkMobileOrTablet()) {
				this.element.classList.remove(params.classes.hover);
			}
		}

		// Устанавливаем гамбургер, если его нет в разметке
		if (params.expand && !params.hamburger.body) {
			let isHamburger = Selectors.findOne('.' + params.classes.hamburger, this.element);

			if (isHamburger === null) {
				let mTitle = '',
					hamburger = '<span class="' + params.classes.hamburger + '--lines"><span></span><span></span><span></span></span>';

				if (params.hamburger.title) {
					mTitle = '<span class="' + params.classes.hamburger + '--title">'+ params.hamburger.title +'</span>';
				}

				if (params.hamburger.body !== null) {
					hamburger = params.hamburger.body;
				}

				this.element.insertAdjacentHTML('afterbegin','<a href="#sidebar-nav" class="' + params.classes.hamburger + '" data-vg-toggle="sidebar">' + mTitle + hamburger +'</a>');
			}
		}

		// Устанавливаем указатель переключателя
		if (params.toggle) {
			let $dropdown_a = [...Selectors.findAll('.dropdown-mega > a, .dropdown > a', this.element)],
				toggle = '<span class="toggle">' + params.toggle + '</span>';

			if ($dropdown_a.length) {
				$dropdown_a.forEach(function (elem) {
					elem.setAttribute('aria-expanded', 'false')
					elem.insertAdjacentHTML('beforeend', toggle)
				});
			}
		}

		if (params.collapse && Responsive.check(this) && params.placement !== 'vertical') {
			setCollapse(this);
		}

		if ('afterInit' in this.params.callback) {
			execute(this.params.callback.afterInit, [this]);
		}

		/**
		 * Функция сворачивания
		 */
		function setCollapse(_this) {
			let width_navigation_responsive = _this.navigation.clientWidth,
				width_all_links_responsive = 0,
				$dots = Selectors.findOne('.dots', _this.navigation),
				_dots = getSVG('dots');

			if ($links.length) {
				if ($dots) {
					width_all_links_responsive = $dots.clientWidth
				} else {
					let $a = Selectors.findOne('a', $links[0]),
						$linkStyle = getComputedStyle($a),
						paddingLeft = normalizeData($linkStyle.paddingLeft.slice(0, -2)),
						paddingRight =  normalizeData($linkStyle.paddingRight.slice(0, -2)),
						padding = paddingLeft + paddingRight;

					// TODO не совсем верно, но мы точно знаем ширину точек в svg - 16px
					width_all_links_responsive = padding + 16;
				}

				for (let $link of $links) {
					let width = $link.getBoundingClientRect().width;
					width_all_links_responsive = width_all_links_responsive + width;

					if ((width_navigation_responsive) < width_all_links_responsive) {
						movedLinks.push($link);
						$link.remove();
					} else {
						if (movedLinks.length) {
							if ($dots) {
								_this.navigation.insertBefore(movedLinks[0], $dots)
							} else {
								_this.navigation.appendChild(movedLinks[0])
							}
							movedLinks.splice(0, 1);
						}
					}
				}

				if (movedLinks.length) {
					if (!$dots) {
						_this.navigation.insertAdjacentHTML('beforeend','<li class="dropdown dots">' + '<a href="#" aria-expanded="false">'+ _dots +'</a></li>');
					}
				} else {
					if ($dots) {
						$dots.remove();
					}
				}

				let $d = _this.navigation.querySelector('.dots');
				if ($d && movedLinks.length) {
					let $dropdown = $d.querySelector('ul');
					if ($dropdown) {
						for (let link of movedLinks) {
							$dropdown.prepend(link);
						}
					} else {
						let $dropdown = document.createElement('ul');
						$dropdown.classList.add('dropdown-content');
						$dropdown.classList.add('right');

						for (let link of movedLinks) {
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

		if (!target || isDisabled(target)) {
			return;
		}

		if (!target.closest('.dropdown-content')) {
			target.classList.add('first');
		}

		let drop = Selectors.findOne('.dropdown-content', target),
			link = target.firstElementChild;

		if (link) link.setAttribute('aria-expanded', 'true');
		drop.classList.add(CLASS_NAME_SHOW);
		target.classList.add(CLASS_NAME_ACTIVE);

		const completeCallBack = () => {
			drop.classList.add(CLASS_NAME_FADE);
			EventHandler.trigger(target, EVENT_KEY_SHOWN, relatedTarget)
		}
		this._queueCallback(completeCallBack, drop, true, 50);
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
			element = relatedTarget.elm
		}

		if (element) {
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
						EventHandler.trigger(el, EVENT_KEY_HIDDEN, relatedTarget)
					}

					_this._queueCallback(completeCallback, el, true, 500);
				}
			});
		}
	}


	/**
	 * TODO если на странице несколько навигаций, то ни одна не работает
	 * @param element
	 * @param params
	 */
	static init(element, params = {}) {
		const instance = VGNav.getOrCreateInstance(element, params);
		instance.build();

		let drops = Selectors.findAll('.dropdown', instance._navigation)

		if (instance.params.hover) {
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
					}

					instance.show(relatedTarget);
				});
				EventHandler.on(el, EVENT_MOUSEOUT_DATA_API, function (event) {
					if (!currentElem) return;

					let relatedTarget = event.relatedTarget.closest('.dropdown'),
						elm = currentElem;

					while (relatedTarget) {
						if (relatedTarget === currentElem) return;
						relatedTarget = relatedTarget.parentNode;
					}

					currentElem = null;
					instance.hide({relatedTarget: relatedTarget, elm: elm});
				})
			})
		} else {
			EventHandler.on(document, EVENT_KEYUP_DATA_API, VGNav.clearDrops);
			EventHandler.on(document, EVENT_CLICK_DATA_API, VGNav.clearDrops);
			EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
				if (!Manipulator.hasAttribute(this, 'aria-expanded')) {
					return;
				}

				if ('click' in instance.params.callback) {
					execute(instance.params.callback.click, [this]);
				}

				event.preventDefault();

				let self = this.closest('.vg-nav'),
					isFirst = self.querySelector('.first');

				let target = this.closest('.dropdown');
				if (!target) return;

				if (isDisabled(target) && !isVisible(target)) {
					return;
				}

				if (isFirst && this.closest('.first')) {
					if (target.classList.contains('active')) {
						instance.hide({relatedTarget: target});
						return;
					}
				} else {
					[...Selectors.findAll('.active', self)].forEach(function (el) {
						if (el && el !== target) {
							instance.hide({relatedTarget: el})
						}
					});
				}

				instance.show({relatedTarget: target});
			});
		}
	}

	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) {
			return
		}

		VGNav.hideOpenDrops(event)
	}

	static hideOpenDrops(event) {
		const openToggles = Selectors.findAll('.dropdown:not(.disabled):not(:disabled).active');

		for (const toggle of openToggles) {
			const context = VGNav.getInstance(toggle.closest('.vg-nav'));
			if (!context) continue;

			if (event.target.closest('.first')) {
				return;
			}

			const relatedTarget = { relatedTarget: toggle }

			if (event.type === 'click') {
				relatedTarget.clickEvent = event
			}

			context.hide(relatedTarget)
		}
	}
}

export default VGNav;