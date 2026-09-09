/**
 * Описание: адаптивная навигация VGNav с выпадающими пунктами и гамбургером.
 * Возможности: click/hover, overflow первого уровня, вложенные меню, позиционирование, события и интеграция с VGSidebar.
 */
import BaseModule from "../../base-module";
import Selectors from "../../../utils/js/dom/selectors";
import {
	execute,
	getTransitionDurationFromElement,
	isDisabled,
	isMobileDevice,
	isVisible,
	mergeDeepObject,
	noop,
} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import Placement from "../../../utils/js/components/placement";
import {getSVG} from "../../module-fn";

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
const SELECTOR_DATA_TOGGLE = '.' + CLASS_NAME + ' .dropdown > a';

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
			// Брейкпоинт, с которого навигация отображается в расширенном виде.
			breakpoint: 'lg',
			// Направление меню: влияет на классы и поведение позиционирования.
			placement: 'horizontal',
			// Включает открытие выпадающих пунктов при наведении на десктопе.
			hover: true,
			// Включает ограничение высоты и overflow для списка внутри выпадающего меню.
			dropListScroll: true,
			// Переносит лишние пункты первого уровня горизонтального меню в dropdown.
			overflow: {
				enable: false,
				// Максимум видимых исходных пунктов; 0 оставляет только ограничение по ширине.
				count: 0,
				// Элементы, которые нельзя переносить (megamenu сохраняет геометрию первого уровня).
				keep: '.dropdown-mega, [data-vg-nav-overflow="keep"]',
				trigger: {
					icon: 'dots',
					body: null,
					label: '',
					ariaLabel: 'Другие разделы'
				}
			},
			// Настройки плавного переключения между соседними пунктами первого уровня.
			hoversmoothfirstlevel: {
				// Включает режим плавного перехода без мгновенного закрытия соседнего дропа.
				enable: false,
				// Ограничивает плавное переключение только горизонтальным движением курсора.
				horizontalOnly: true
			},
			// Настройки анимации открытия и закрытия выпадающих пунктов.
			animation: {
				// Включает анимацию переходов.
				enable: true,
				// Длительность ожидания завершения анимации перед финальным состоянием.
				timeout: 700
			},
			// HTML-разметка иконки-указателя для пунктов с выпадающим меню.
			toggle: '<span class="default"></span>',
			// Настройки кнопки-гамбургера для мобильной/адаптивной навигации.
			hamburger: {
				// Разрешает создавать и использовать кнопку-гамбургер.
				enable: true,
				// Принудительно показывает гамбургер всегда, независимо от брейкпоинта.
				always: false,
				// Текстовый заголовок рядом с иконкой гамбургера.
				title: '',
				// Пользовательская HTML-разметка тела гамбургера вместо стандартных линий.
				body: null,
				// CSS-селектор сайдбара, который открывает кнопка-гамбургер.
				target: '#sidebar-nav'
			},
			// Пользовательские обработчики жизненного цикла навигации.
			callbacks: {
				// Вызывается после построения навигации.
				afterInit: noop,
				// Вызывается после клика по пункту навигации.
				afterClick: noop,
			}
		}, params));

		this._classes = {
			hamburgerActive: 'vg-nav-hamburger-active',
			hamburgerAlways: 'vg-nav-hamburger-always',
			hamburger: 'vg-nav-hamburger',
			container: 'vg-nav-container',
			wrapper: 'vg-nav-wrapper',
			dropListScroll: 'vg-nav-drop-list-scroll',
			overflowEnabled: 'vg-nav-overflow-enabled',
			overflow: 'vg-nav-overflow',
			overflowList: 'vg-nav-overflow-list',
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
		this._pointerPosition = null;
		this._smoothSwitch = null;
		this._handleScroll = this._handleScroll.bind(this);
		this._handleResize = this._handleResize.bind(this);
		this._handleOverflowResize = this._handleOverflowResize.bind(this);
		this._overflowTrigger = null;
		this._overflowList = null;
		this._overflowItems = [];
		this._overflowAnchors = new Map();
		this._overflowObserver = null;
		this._overflowFrame = null;
		this._overflowWindowFallback = false;
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
		this._element.classList.toggle(classes.dropListScroll, !!params.dropListScroll);
		this._setupOverflow();

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
				const targetSelector = params.hamburger.target || '#sidebar-nav';
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
				Manipulator.set(a, 'href', targetSelector);
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

		this.refresh();

		if ('afterInit' in this._params.callbacks) {
			execute(this._params.callbacks.afterInit, [this]);
		}
	}

	show(relatedTarget) {
		let target = relatedTarget.relatedTarget;

		if (!target || isDisabled(target)) return;
		const drop = Selectors.find(':scope > .dropdown-content', target);
		if (!drop) return;

		const showEvent = EventHandler.trigger(target, EVENT_KEY_SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		if (!target.closest('.dropdown-content')) {
			target.classList.add('first');
		}

		const link = target.firstElementChild;

		if (link) link.setAttribute('aria-expanded', 'true');
		drop.classList.add(CLASS_NAME_SHOW);
		target.classList.add(CLASS_NAME_ACTIVE);
		// Координаты Placement имеют приоритет над старой CSS-схемой top/bottom/right.
		drop.style.bottom = 'auto';
		drop.style.right = 'auto';
		const openToSide = !!target.closest('.dropdown-content') || this._params.placement === 'vertical';

		const $placement = new Placement({
			reference: target,
			drop: drop,
			placement: openToSide ? 'right-start' : 'bottom-start',
			fallbackPlacements: openToSide
				? ['left-start', 'right-end', 'left-end', 'bottom-start', 'top-start']
				: ['top-start', 'bottom-end', 'top-end'],
			offset: openToSide ? [6, 0] : [0, 6],
			boundary: 'clippingParents',
			autoFlip: true,
			overflowProtection: true,
			clamp: true,
			isMerge: false
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

			[...Selectors.findAll('.dropdown-content.' + CLASS_NAME_SHOW, element)].forEach(function (el) {
				el.classList.remove(CLASS_NAME_FADE);

				let parent = el.closest('.dropdown');
				if (parent.classList.contains(CLASS_NAME_ACTIVE)) {
					parent.classList.remove(CLASS_NAME_ACTIVE);
				}

				let link = el.previousElementSibling;
				if (link) link.setAttribute('aria-expanded', 'false');

				const completeCallback = () => {
					if (parent.classList.contains(CLASS_NAME_ACTIVE)) return;
					el.classList.remove(CLASS_NAME_SHOW);
					EventHandler.trigger(el, EVENT_KEY_HIDDEN, relatedTarget);
				};

				_this._queueCallback(completeCallback, el, true, 500);
				_this._cleanupDrop(el);
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
			this._openDrops.delete(drop);
			// Обработчики общие для экземпляра: другие открытые уровни ещё нуждаются в них.
			if (!this._openDrops.size) {
				window.removeEventListener('scroll', dropData.scrollHandler, { capture: true });
				window.removeEventListener('resize', dropData.resizeHandler);
			}
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

	_updatePointerPosition(event) {
		if (!event || typeof event.clientX !== 'number' || typeof event.clientY !== 'number') return;
		this._pointerPosition = {
			x: event.clientX,
			y: event.clientY
		};
	}

	_isHorizontalPointerMove(event) {
		if (!this._pointerPosition || !event) return false;

		const dx = event.clientX - this._pointerPosition.x;
		const dy = event.clientY - this._pointerPosition.y;

		return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 0;
	}

	_isFirstLevelDropdown(drop) {
		return !!drop && !drop.closest('.dropdown-content');
	}

	_hasDirectDropdownContent(drop) {
		if (!drop || !drop.children) return false;
		return [...drop.children].some((child) => child.classList && child.classList.contains('dropdown-content'));
	}

	_isAdjacentDropdown(drop, relatedDrop) {
		if (!drop || !relatedDrop) return false;
		if (drop.parentElement !== relatedDrop.parentElement) return false;
		return drop.previousElementSibling === relatedDrop || drop.nextElementSibling === relatedDrop;
	}

	_canSmoothSwitchFirstLevel(event, currentDrop, relatedDrop) {
		const smoothParams = this._params.hoversmoothfirstlevel || {};
		if (!smoothParams.enable) return false;
		if (!currentDrop || !relatedDrop || currentDrop === relatedDrop) return false;
		if (!this._isFirstLevelDropdown(currentDrop) || !this._isFirstLevelDropdown(relatedDrop)) return false;
		if (!this._hasDirectDropdownContent(currentDrop) || !this._hasDirectDropdownContent(relatedDrop)) return false;
		if (!this._isAdjacentDropdown(currentDrop, relatedDrop)) return false;
		if (smoothParams.horizontalOnly && !this._isHorizontalPointerMove(event)) return false;

		return true;
	}

	_scheduleSmoothSwitchCompletion(dropContent, callback) {
		const duration = getTransitionDurationFromElement(dropContent);
		if (!duration) {
			callback();
			return;
		}

		window.setTimeout(callback, duration);
	}

	/**
	 * Пересчитывает пункты первого уровня, перенесённые в overflow-dropdown.
	 * Полезно вызывать после динамического изменения состава или текста меню.
	 */
	refresh() {
		if (!this._isOverflowEnabled()) return;
		this._collectOverflowItems();
		this._redistributeOverflowItems();
	}

	_isOverflowEnabled() {
		return !!this._params.overflow?.enable && this._params.placement === 'horizontal';
	}

	_setupOverflow() {
		if (!this._isOverflowEnabled() || this._overflowTrigger) return;

		this._element.classList.add(this._classes.overflowEnabled);
		const triggerParams = this._params.overflow.trigger || {};
		const item = document.createElement('li');
		item.classList.add('dropdown', 'dots', this._classes.overflow);
		item.hidden = true;

		const link = document.createElement('a');
		link.href = '#';
		link.setAttribute('aria-expanded', 'false');
		link.setAttribute('aria-label', triggerParams.ariaLabel || 'Другие разделы');

		const icon = document.createElement('span');
		icon.classList.add(this._classes.overflow + '-icon');
		icon.setAttribute('aria-hidden', 'true');
		icon.innerHTML = triggerParams.body !== null
			? triggerParams.body
			: (getSVG(triggerParams.icon || 'dots') || '');
		link.append(icon);

		if (triggerParams.label) {
			const label = document.createElement('span');
			label.classList.add(this._classes.overflow + '-label');
			label.textContent = triggerParams.label;
			link.append(label);
		}

		const content = document.createElement('div');
		content.classList.add('dropdown-content');
		const list = document.createElement('ul');
		list.classList.add('vg-nav-drop-list', this._classes.overflowList);
		content.append(list);
		item.append(link, content);
		this.navigation.append(item);

		this._overflowTrigger = item;
		this._overflowList = list;
		this._collectOverflowItems();
		this._startOverflowObserver();
	}

	_collectOverflowItems() {
		if (!this.navigation || !this._overflowTrigger) return;

		[...this.navigation.children].forEach((item) => {
			if (item === this._overflowTrigger || this._overflowAnchors.has(item)) return;
			const anchor = document.createComment('vg-nav-overflow-item');
			this.navigation.insertBefore(anchor, item);
			this._overflowAnchors.set(item, anchor);
			this._overflowItems.push(item);
		});
	}

	_restoreOverflowItems(removeAnchors = false) {
		this._overflowItems.forEach((item) => {
			const anchor = this._overflowAnchors.get(item);
			if (!anchor?.parentNode) return;
			if (removeAnchors) {
				anchor.replaceWith(item);
			} else {
				anchor.after(item);
			}
		});

		if (removeAnchors) this._overflowAnchors.clear();
	}

	_redistributeOverflowItems() {
		if (!this.navigation || !this._overflowTrigger || !this._overflowList) return;

		this._closeOverflowDrops();
		this._restoreOverflowItems();
		this._overflowTrigger.hidden = true;

		if (!this._isOverflowMeasurable()) return;

		const moved = new Set();
		const movable = this._overflowItems.filter((item) => !this._isOverflowKept(item));
		const count = Math.max(0, Number.parseInt(this._params.overflow.count, 10) || 0);
		let visibleCount = this._overflowItems.length;

		if (count > 0) {
			for (let index = movable.length - 1; index >= 0 && visibleCount > count; index--) {
				moved.add(movable[index]);
				this._overflowList.prepend(movable[index]);
				visibleCount--;
			}
		}

		if (moved.size || !this._overflowFits()) {
			this._overflowTrigger.hidden = false;
		}

		for (let index = movable.length - 1; index >= 0 && !this._overflowFits(); index--) {
			const item = movable[index];
			if (moved.has(item)) continue;
			moved.add(item);
			this._overflowList.prepend(item);
		}

		this._overflowItems.forEach((item) => {
			if (moved.has(item)) this._overflowList.append(item);
		});

		this._overflowTrigger.hidden = moved.size === 0;
		this._element.classList.toggle(this._classes.overflow + '-active', moved.size > 0);
	}

	_isOverflowKept(item) {
		const selector = String(this._params.overflow.keep || '').trim();
		return !!selector && item.matches(selector);
	}

	_isOverflowMeasurable() {
		if (!this._element.isConnected) return false;
		if (this.navigation.getClientRects().length === 0) return false;
		return this.navigation.clientWidth > 0 || this.navigation.getBoundingClientRect().width > 0;
	}

	_overflowFits() {
		const width = this.navigation.clientWidth || this.navigation.getBoundingClientRect().width;
		if (!width) return true;

		const style = window.getComputedStyle(this.navigation);
		const gap = Number.parseFloat(style.columnGap) || 0;
		const children = [...this.navigation.children].filter((item) => !item.hidden);
		const used = children.reduce((sum, item) => {
			const itemStyle = window.getComputedStyle(item);
			return sum + item.getBoundingClientRect().width
				+ (Number.parseFloat(itemStyle.marginLeft) || 0)
				+ (Number.parseFloat(itemStyle.marginRight) || 0);
		}, 0) + Math.max(0, children.length - 1) * gap;

		return used <= width + 0.5;
	}

	_closeOverflowDrops() {
		[...this.navigation.querySelectorAll('.dropdown.active')].forEach((item) => {
			this.hide({relatedTarget: item});
		});
	}

	_startOverflowObserver() {
		if (typeof ResizeObserver !== 'undefined') {
			this._overflowObserver = new ResizeObserver(this._handleOverflowResize);
			this._overflowObserver.observe(this.navigation);
			this._overflowObserver.observe(this._element);
		} else {
			window.addEventListener('resize', this._handleOverflowResize);
			this._overflowWindowFallback = true;
		}

		if (document.fonts?.ready) {
			document.fonts.ready.then(() => {
				if (this._element) this._handleOverflowResize();
			});
		}
	}

	_handleOverflowResize() {
		if (this._overflowFrame !== null) return;
		const schedule = typeof window.requestAnimationFrame === 'function'
			? window.requestAnimationFrame.bind(window)
			: (callback) => window.setTimeout(callback, 0);

		this._overflowFrame = schedule(() => {
			this._overflowFrame = null;
			this.refresh();
		});
	}

	dispose() {
		if (this._overflowObserver) this._overflowObserver.disconnect();
		if (this._overflowWindowFallback) window.removeEventListener('resize', this._handleOverflowResize);
		if (this._overflowFrame !== null && typeof window.cancelAnimationFrame === 'function') {
			window.cancelAnimationFrame(this._overflowFrame);
		}
		this._restoreOverflowItems(true);
		this._overflowTrigger?.remove();
		this._element.classList.remove(this._classes.overflowEnabled, this._classes.overflow + '-active');
		super.dispose();
	}

	_startSmoothSwitch(currentDrop, previousDrop, dropContent) {
		const staleSwitch = this._smoothSwitch;
		const transfer = { currentDrop, previousDrop };
		this._smoothSwitch = transfer;

		if (
			staleSwitch?.previousDrop
			&& staleSwitch.previousDrop !== currentDrop
			&& staleSwitch.previousDrop !== previousDrop
			&& staleSwitch.previousDrop.classList.contains(CLASS_NAME_ACTIVE)
		) {
			this.hide({ relatedTarget: staleSwitch.previousDrop });
		}

		this._scheduleSmoothSwitchCompletion(dropContent, () => {
			if (this._smoothSwitch !== transfer) return;
			this._smoothSwitch = null;
			if (!currentDrop.isConnected || !previousDrop.isConnected) return;
			if (!currentDrop.classList.contains(CLASS_NAME_ACTIVE)) return;
			if (previousDrop.classList.contains(CLASS_NAME_ACTIVE)) {
				this.hide({ relatedTarget: previousDrop });
			}
		});
	}

	_cancelSmoothSwitch(exceptDrop = null) {
		const transfer = this._smoothSwitch;
		this._smoothSwitch = null;
		if (!transfer?.previousDrop || transfer.previousDrop === exceptDrop) return;
		if (transfer.previousDrop.classList.contains(CLASS_NAME_ACTIVE)) {
			this.hide({ relatedTarget: transfer.previousDrop });
		}
	}

	static init(element, params = {}) {
		const instance = VGNav.getOrCreateInstance(element, params);
		instance.build();

		let drops = Selectors.findAll('.dropdown', instance.navigation);

		if (instance._params.hover && !isMobileDevice()) {
			EventHandler.on(instance.navigation, `mousemove.${NAME_KEY}.data.api`, function (event) {
				instance._updatePointerPosition(event);
			});

			[...drops].forEach(function (el) {
				let currentElem = null;

				EventHandler.on(el, EVENT_MOUSEOVER_DATA_API, function (event) {
					if (currentElem) return;

					let target = event.target.closest('.dropdown');
					if (!target) return;

					if (!instance.navigation.contains(target)) return;
					currentElem = target;

					const previousDrop = event.relatedTarget?.closest('.dropdown');
					const useSmoothSwitch = instance._canSmoothSwitchFirstLevel(event, target, previousDrop);

					if (!useSmoothSwitch) {
						instance._cancelSmoothSwitch(target);
						VGNav.hideOpenDrops(event);
					}

					let relatedTarget = {
						relatedTarget: target
					};

					instance.show(relatedTarget);

					if (useSmoothSwitch && previousDrop && previousDrop.classList.contains(CLASS_NAME_ACTIVE)) {
						const nextDropContent = Selectors.find(':scope > .dropdown-content', target);
						if (nextDropContent) {
							nextDropContent.classList.add(CLASS_NAME_FADE);
							instance._startSmoothSwitch(target, previousDrop, nextDropContent);
						}
					}

					instance._updatePointerPosition(event);
				});

				EventHandler.on(el, EVENT_MOUSEOUT_DATA_API, function (event) {
					if (!currentElem) return;

					let nextDrop = event.relatedTarget?.closest('.dropdown'),
						relatedTarget = nextDrop,
						elm = currentElem;

					while (relatedTarget) {
						if (relatedTarget === currentElem) return;
						relatedTarget = relatedTarget.parentNode;
					}

					if (instance._canSmoothSwitchFirstLevel(event, elm, nextDrop)) {
						currentElem = null;
						// Сохраняем предыдущую точку до mouseover соседнего пункта:
						// она нужна повторной проверке направления и передаче открытого состояния.
						return;
					}

					currentElem = null;
					instance._cancelSmoothSwitch(elm);
					instance.hide({ relatedTarget: relatedTarget, elm: elm });
					instance._updatePointerPosition(event);
				});
			});
		}

		const vgNavSidebar = document.querySelector(instance._params.hamburger.target || '#sidebar-nav');
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

	if (instance._params.hover && !isMobileDevice()) return;

	event.preventDefault();

	let drop = this.parentNode;
	if (!drop) return;

	if (isDisabled(drop) || !isVisible(drop)) {
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
