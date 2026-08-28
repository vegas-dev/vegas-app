/**
 * Описание: отслеживание активных секций и навигация по якорям.
 * Возможности: Data API, нативная и виртуальная прокрутка, вложенные меню и обновление секций.
 */
import BaseModule from "../../base-module";
import { getElement, isDisabled, isVisible, normalizeData } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Константы модуля VGSpy
 */
const NAME = 'spy';
const NAME_KEY = 'vg.spy';
const EVENT_KEY = `.${NAME_KEY}`;
const DATA_API_KEY = '.data-api';

const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_DROPDOWN_ITEM = 'vg-dropdown-item';
const CLASS_NAME_ACTIVE = 'active';

const SELECTOR_DATA_SPY = '[data-vg-toggle="spy"]';
const SELECTOR_TARGET_LINKS = '[href], [data-vg-target]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.vg-dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '[data-vg-toggle="dropdown"]';

/**
 * Модуль "Spy" — отслеживает прокрутку и активные секции на странице.
 * Автоматически подсвечивает навигационные ссылки в зависимости от текущего положения скролла.
 * Поддерживает плавную прокрутку и работу внутри контейнеров с overflow.
 */
class VGSpy extends BaseModule {
	/**
	 * Создаёт экземпляр VGSpy
	 * @param {HTMLElement} element — корневой элемент навигации (например, .nav)
	 * @param {Object} params — параметры конфигурации
	 */
	constructor(element, params) {
		super(element, params);

		/**
		 * Объединённые параметры с настройками по умолчанию
		 * @type {Object}
		 * @property {number|null} offset - смещение (устаревшее, для совместимости)
		 * @property {string} rootMargin - отступ для IntersectionObserver
		 * @property {boolean} smoothScroll - включить плавную прокрутку по якорям
		 * @property {HTMLElement|string} target - целевой контейнер прокрутки
		 * @property {number[]|string} threshold - пороги видимости (0.1, 0.5, 1)
		 */
		this._params = this._configAfterMerge(
			Object.assign(
				{
					offset: null, // Устаревшее, для обратной совместимости
					rootMargin: '0px 0px -25%',
					smoothScroll: true,
					target: this._element,
					threshold: [0.1, 0.5, 1],
				},
				params,
				this._getDataOptions()
			)
		);

		/**
		 * Карта: хеш-ссылка → HTML-элемент ссылки
		 * @type {Map<string, HTMLElement>}
		 */
		this._targetLinks = new Map();

		/**
		 * Карта: хеш-ссылка → HTML-элемент наблюдаемой секции
		 * @type {Map<string, HTMLElement>}
		 */
		this._observableSections = new Map();

		/**
		 * Корневой элемент для IntersectionObserver (если скролл не окно)
		 * @type {HTMLElement|null}
		 */
		this._rootElement = null;

		/**
		 * Текущая активная секция
		 * @type {HTMLElement|null}
		 */
		this._activeTarget = null;

		/**
		 * Экземпляр IntersectionObserver
		 * @type {IntersectionObserver|null}
		 */
		this._observer = null;

		/**
		 * Экземпляр Smooth Scrollbar (если используется вместо нативного scrollTop).
		 * @type {Object|null}
		 */
		this._scrollbar = null;

		/**
		 * Listener для Smooth Scrollbar.
		 * @type {Function|null}
		 */
		this._scrollbarListener = null;

		/**
		 * Данные о предыдущей прокрутке для определения направления
		 * @type {{visibleEntryTop: number, parentScrollTop: number}}
		 */
		this._previousScrollData = {
			visibleEntryTop: 0,
			parentScrollTop: 0,
		};

		this.refresh();
	}

	/**
	 * Имя модуля
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Ключ модуля (для хранения в data)
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	_getDataOptions() {
		const options = {};
		for (const name of ['target', 'offset', 'rootMargin', 'smoothScroll', 'threshold']) {
			const attribute = `data-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
			if (this._element.hasAttribute(attribute)) {
				options[name] = normalizeData(this._element.getAttribute(attribute));
			}
		}
		return options;
	}

	/**
	 * Инициализирует или перезапускает модуль: находит ссылки и секции, создаёт observer
	 */
	refresh() {
		this._process(null);
		this._initializeTargetsAndObservables();
		this._updateRootElement();
		this._maybeEnableSmoothScroll();

		this._setupTracking();

		// Подписываемся на наблюдение за секциями
	}

	/**
	 * Очищает ресурсы (отключает observer)
	 */
	_setupTracking() {
		this._updateSmoothScrollbar();

		if (this._scrollbar) {
			this._setupScrollbarTracking();
			return;
		}

		this._teardownScrollbarTracking();
		this._rebuildObserver();

		// Smooth Scrollbar can be initialized after the spy; retry once on the next tick.
		if (this._rootElement && !this._isScrollableSelf(this._rootElement) && window.Scrollbar) {
			setTimeout(() => {
				if (!this._element || this._scrollbar) return;
				this._updateSmoothScrollbar();
				if (this._scrollbar) this._setupScrollbarTracking();
			}, 0);
		}
	}

	_updateSmoothScrollbar() {
		const root = this._rootElement;
		const Scrollbar = window.Scrollbar;

		let instance = null;
		if (root) {
			instance = root.scrollbar || null;

			if (!instance && Scrollbar && typeof Scrollbar.get === 'function') {
				instance = Scrollbar.get(root) || null;
			}
		}

		if (instance === this._scrollbar) return;

		this._teardownScrollbarTracking();
		this._scrollbar = instance;
	}

	_setupScrollbarTracking() {
		if (!this._scrollbar || typeof this._scrollbar.addListener !== 'function') return;

		// Smooth Scrollbar is virtual (content is transformed), so IntersectionObserver won't be reliable.
		if (this._observer) this._observer.disconnect();

		if (this._scrollbarListener && typeof this._scrollbar.removeListener === 'function') {
			this._scrollbar.removeListener(this._scrollbarListener);
		}

		this._scrollbarListener = (status) => this._onScrollbarScroll(status);
		this._scrollbar.addListener(this._scrollbarListener);

		this._onScrollbarScroll(null);
	}

	_teardownScrollbarTracking() {
		if (this._scrollbar && this._scrollbarListener && typeof this._scrollbar.removeListener === 'function') {
			this._scrollbar.removeListener(this._scrollbarListener);
		}
		this._scrollbarListener = null;
	}

	_onScrollbarScroll(status) {
		const scrollTop = status?.offset?.y ?? this._getParentScrollTop();
		const userScrollsDown = scrollTop >= this._previousScrollData.parentScrollTop;
		this._previousScrollData.parentScrollTop = scrollTop;

		const activationLine = this._getActivationLine(scrollTop);

		const items = [];
		for (const [id, section] of this._observableSections.entries()) {
			if (!section || !isVisible(section)) continue;
			const link = this._targetLinks.get(id);
			if (!link) continue;

			items.push({ top: this._getSectionTop(section), link });
		}

		items.sort((a, b) => a.top - b.top);

		let activeLink = null;
		for (const item of items) {
			if (item.top <= activationLine) {
				activeLink = item.link;
			} else if (!userScrollsDown) {
				break;
			}
		}

		this._process(activeLink);
	}

	_getActivationLine(scrollTop) {
		const rootHeight = this._rootElement
			? this._rootElement.clientHeight
			: (window.innerHeight || document.documentElement.clientHeight || 0);

		const margin = (this._params.rootMargin || '').trim();
		const parts = margin ? margin.split(/\s+/) : [];
		const bottom = parts.length === 1
			? parts[0]
			: parts.length === 2
				? parts[0]
				: parts.length >= 3
					? parts[2]
					: null;

		if (bottom && bottom.endsWith('%')) {
			const pct = Number.parseFloat(bottom);
			if (!Number.isNaN(pct)) return scrollTop + rootHeight * (1 + pct / 100);
		}

		if (bottom && bottom.endsWith('px')) {
			const px = Number.parseFloat(bottom);
			if (!Number.isNaN(px)) return scrollTop + rootHeight + px;
		}

		return scrollTop + rootHeight * 0.75;
	}

	_rebuildObserver() {
		if (this._observer) this._observer.disconnect();
		this._observer = this._getNewObserver();

		for (const section of this._observableSections.values()) {
			this._observer.observe(section);
		}
	}

	_updateRootElement() {
		this._rootElement = this._normalizeScrollRoot(this._params.target);

		if (!this._rootElement && this._isScrollableSelf(this._element)) {
			this._rootElement = this._element;
		}

		if (!this._rootElement) {
			const firstSection = this._observableSections.values().next().value || null;

			// Если секции лежат внутри overflow-контейнера — он обычно родитель секции
			if (firstSection && this._isScrollable(firstSection)) {
				this._rootElement = firstSection.parentElement;
			} else {
				this._rootElement = firstSection ? this._getScrollParent(firstSection) : null;
			}
		}

		this._updateSmoothScrollbar();
		this._previousScrollData.parentScrollTop = this._getParentScrollTop();
		this._previousScrollData.visibleEntryTop = 0;
	}

	_normalizeScrollRoot(element) {
		const root = getElement(element);
		if (!root) return null;
		if (root === document.body || root === document.documentElement) return null;

		if (this._isScrollableSelf(root)) return root;

		// Smooth Scrollbar containers are often overflow-hidden, but still act as a scroll root.
		const Scrollbar = window.Scrollbar;
		const hasSmoothScrollbar = !!(root.scrollbar || (Scrollbar && typeof Scrollbar.get === 'function' && Scrollbar.get(root)));
		return hasSmoothScrollbar ? root : null;
	}

	// Проверяет: "родитель element является скролл-контейнером?"
	_isScrollable(element) {
		if (!(element instanceof HTMLElement)) return false;
		const parent = element.parentElement;
		if (!parent) return false;
		return this._isScrollableSelf(parent);
	}

	// Проверяет: "сам element является скролл-контейнером?"
	_isScrollableSelf(element) {
		if (!(element instanceof HTMLElement)) return false;
		const overflowY = getComputedStyle(element).overflowY;
		if (!/(auto|scroll|overlay)/.test(overflowY)) return false;
		return element.scrollHeight > element.clientHeight;
	}

	_getScrollParent(element) {
		for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
			if (this._isScrollableSelf(parent)) return parent;
		}
		return null;
	}

	_getSectionTop(section) {
		if (this._rootElement) {
			const rootRect = this._rootElement.getBoundingClientRect();
			const rect = section.getBoundingClientRect();
			const scrollTop = this._scrollbar?.offset?.y ?? this._rootElement.scrollTop;
			return scrollTop + (rect.top - rootRect.top);
		}

		return (window.scrollY || document.documentElement.scrollTop || 0) + section.getBoundingClientRect().top;
	}

	_getParentScrollTop() {
		if (this._scrollbar) return this._scrollbar.offset?.y ?? 0;
		if (this._rootElement) return this._rootElement.scrollTop;
		return window.scrollY || document.documentElement.scrollTop || 0;
	}

	dispose() {
		if (!this._element) return;
		this._process(null);
		if (this._observer) {
			this._observer.disconnect();
		}
		this._teardownScrollbarTracking();
		this._scrollbar = null;
		super.dispose();
	}

	/**
	 * Обрабатывает и нормализует параметры после слияния
	 * @param {Object} config
	 * @returns {Object}
	 * @private
	 */
	_configAfterMerge(config) {
		config.target = getElement(config.target) || document.body;

		// Поддержка устаревшего параметра `offset`
		if (config.offset != null) {
			config.rootMargin = `${config.offset}px 0px -30%`;
		}

		// Преобразуем строку порогов в массив чисел
		if (typeof config.threshold === 'string') {
			config.threshold = config.threshold
				.split(',')
				.map((value) => Number.parseFloat(value.trim()));
		}

		return config;
	}

	/**
	 * Подключает плавную прокрутку по якорным ссылкам
	 * @private
	 */
	_maybeEnableSmoothScroll() {
		if (!this._params.smoothScroll) return;

		EventHandler.off(this._element, EVENT_CLICK);
		EventHandler.on(this._element, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event) => {
			const link = event.delegateTarget || event.target;
			const id = this._getTargetIdFromTrigger(link);
			if (!id) return;

			let section = this._observableSections.get(id);
			if (!section) {
				section = Selectors.findID(id);
				if (section) {
					this._targetLinks.set(section.id, link);
					this._observableSections.set(section.id, section);
				}
			}
			if (!section) return;

			// If the target section is currently hidden (tabs/collapses/lazy layout),
			// don't hijack the click; allow UI to reveal it, then retry.
			if (!isVisible(section)) {
				setTimeout(() => {
					if (!this._element) return;
					const revealed = Selectors.findID(id);
					if (!revealed || !isVisible(revealed)) return;

					this._targetLinks.set(revealed.id, link);
					this._observableSections.set(revealed.id, revealed);

					this._updateRootElement();
					this._setupTracking();

					const top = this._getSectionTop(revealed);
					if (this._scrollbar && typeof this._scrollbar.scrollTo === 'function') {
						this._scrollbar.scrollTo(0, top, 600);
					} else if (this._rootElement) {
						if (this._rootElement.scrollTo) {
							this._rootElement.scrollTo({ top, behavior: 'smooth' });
						} else {
							this._rootElement.scrollTop = top;
						}
					} else if (window.scrollTo) {
						window.scrollTo({ top, behavior: 'smooth' });
					} else {
						document.documentElement.scrollTop = top;
					}

					this._process(link);
				}, 0);
				return;
			}

			event.preventDefault();

			this._updateRootElement();
			this._setupTracking();

			const scrollTop = this._getSectionTop(section);
			const root = this._rootElement;

			if (this._scrollbar && typeof this._scrollbar.scrollTo === 'function') {
				this._scrollbar.scrollTo(0, scrollTop, 600);
				this._process(link);
				return;
			}

			if (root) {
				if (root.scrollTo) {
					root.scrollTo({ top: scrollTop, behavior: 'smooth' });
				} else {
					root.scrollTop = scrollTop;
				}
				this._process(link);
				return;
			}

			if (window.scrollTo) {
				window.scrollTo({ top: scrollTop, behavior: 'smooth' });
			} else {
				document.documentElement.scrollTop = scrollTop;
			}

			this._process(link);
		});
	}

	/**
	 * Создаёт новый экземпляр IntersectionObserver
	 * @returns {IntersectionObserver}
	 * @private
	 */
	_getNewObserver() {
		const options = {
			root: this._rootElement,
			rootMargin: this._params.rootMargin,
			threshold: this._params.threshold,
		};

		return new IntersectionObserver((entries) => this._observerCallback(entries), options);
	}

	/**
	 * Обработчик пересечений (IntersectionObserver)
	 * @param {IntersectionObserverEntry[]} entries
	 * @private
	 */
	_observerCallback(entries) {
		const getTargetLink = (entry) => this._targetLinks.get(entry.target.id);
		const parentScrollTop = this._getParentScrollTop();
		const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
		this._previousScrollData.parentScrollTop = parentScrollTop;

		for (const entry of entries) {
			if (!entry.isIntersecting) {
				if (getTargetLink(entry) === this._activeTarget) this._process(null);
				continue;
			}

			const entryTop = this._getSectionTop(entry.target);
			const isEntryBelow = entryTop >= this._previousScrollData.visibleEntryTop;
			const shouldActivate =
				(userScrollsDown && isEntryBelow) || (!userScrollsDown && !isEntryBelow);

			if (shouldActivate || !this._activeTarget) {
				this._previousScrollData.visibleEntryTop = entryTop;
				this._process(getTargetLink(entry));
			}
		}
	}

	/**
	 * Находит все ссылки и соответствующие им секции
	 * @private
	 */
	_initializeTargetsAndObservables() {
		this._targetLinks.clear();
		this._observableSections.clear();

		const links = Selectors.findAll(SELECTOR_TARGET_LINKS, this._element);
		for (const link of links) {
			if (isDisabled(link)) continue;

			const id = this._getTargetIdFromTrigger(link);
			if (!id) continue;

			const section = Selectors.findID(id);
			if (section) {
				this._targetLinks.set(section.id, link);
				this._observableSections.set(section.id, section);
			}
		}
	}

	/**
	 * Активирует элемент и запускает событие
	 * @param {HTMLElement|null} target — элемент ссылки, который нужно активировать
	 * @private
	 */
	_process(target) {
		if (this._activeTarget === target) return;

		// Clear only within this spy navigation to avoid cross-interference between multiple instances.
		this._clearActiveClass(this._element);
		this._activeTarget = target;

		if (target) {
			target.classList.add(CLASS_NAME_ACTIVE);
			this._activateParents(target);
			EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target });
		}
	}

	/**
	 * Активирует родительские элементы (навигация, dropdown)
	 * @param {HTMLElement} target — активная ссылка
	 * @private
	 */
	_activateParents(target) {
		if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
			const dropdownToggle = Selectors.find(SELECTOR_DROPDOWN_TOGGLE, target.closest(SELECTOR_DROPDOWN));
			if (dropdownToggle) dropdownToggle.classList.add(CLASS_NAME_ACTIVE);
			return;
		}

		// Активируем предыдущие элементы в nav/list-group
		for (const parentGroup of Selectors.parents(target, SELECTOR_NAV_LIST_GROUP)) {
			for (const sibling of Selectors.prev(parentGroup, SELECTOR_LINK_ITEMS)) {
				sibling.classList.add(CLASS_NAME_ACTIVE);
			}
		}
	}

	/**
	 * Убирает активный класс со всех элементов
	 * @param {HTMLElement} parent — контейнер для очистки
	 * @private
	 */
	_clearActiveClass(parent) {
		if (!parent) return;
		parent.classList.remove(CLASS_NAME_ACTIVE);

		const activeLinks = Selectors.findAll(
			`[href].${CLASS_NAME_ACTIVE}, [data-vg-target].${CLASS_NAME_ACTIVE}, ${SELECTOR_DROPDOWN_TOGGLE}.${CLASS_NAME_ACTIVE}`,
			parent
		);
		for (const link of activeLinks) {
			link.classList.remove(CLASS_NAME_ACTIVE);
		}
	}

	_getTargetIdFromTrigger(trigger) {
		if (!trigger || typeof trigger.getAttribute !== 'function') return null;
		if (isDisabled(trigger) || trigger.matches(SELECTOR_DROPDOWN_TOGGLE)) return null;

		const dataTarget = (trigger.getAttribute('data-vg-target') || '').trim();
		const href = (trigger.getAttribute('href') || '').trim();

		const selector = (dataTarget && dataTarget !== '#')
			? dataTarget
			: (
				(href && (href.includes('#') || href.startsWith('#')))
					? (href.includes('#') && !href.startsWith('#') ? `#${href.split('#')[1]}` : href)
					: null
			);

		if (!selector || selector === '#' || !selector.startsWith('#')) return null;

		const decoded = this._safeDecode(selector);
		return decoded && decoded.startsWith('#') && decoded.length > 1 ? decoded.slice(1) : null;
	}

	_safeDecode(value) {
		try {
			return decodeURIComponent(value);
		} catch {
			try {
				return decodeURI(value);
			} catch {
				return value;
			}
		}
	}
}

/**
 * Инициализация через data-атрибуты при загрузке DOM
 */
(() => {
	let isInitialized = false;

	const init = () => {
		if (isInitialized) return;
		isInitialized = true;

		for (const spy of Selectors.findAll(SELECTOR_DATA_SPY)) {
			VGSpy.getOrCreateInstance(spy);
		}
	};

	// If this module is loaded after `load`, ensure initialization still happens.
	if (document.readyState === 'loading') {
		EventHandler.on(document, `DOMContentLoaded${EVENT_KEY}${DATA_API_KEY}`, init);
	} else {
		init();
	}

	EventHandler.on(window, EVENT_LOAD_DATA_API, init);
})();

export default VGSpy;
