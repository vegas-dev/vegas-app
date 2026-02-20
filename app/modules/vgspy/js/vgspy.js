import BaseModule from "../../base-module";
import { mergeDeepObject, getElement, isDisabled, isVisible } from "../../../utils/js/functions";
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
const SELECTOR_TARGET_LINKS = '[href]';
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
			mergeDeepObject(
				{
					offset: null, // Устаревшее, для обратной совместимости
					rootMargin: '0px 0px -25%',
					smoothScroll: true,
					target: this._element,
					threshold: [0.1, 0.5, 1],
				},
				params
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

	/**
	 * Инициализирует или перезапускает модуль: находит ссылки и секции, создаёт observer
	 */
	refresh() {
		this._initializeTargetsAndObservables();
		this._updateRootElement();
		this._maybeEnableSmoothScroll();

		if (this._observer) this._observer.disconnect();
		this._observer = this._getNewObserver();

		// Подписываемся на наблюдение за секциями
		for (const section of this._observableSections.values()) {
			this._observer.observe(section);
		}
	}

	/**
	 * Очищает ресурсы (отключает observer)
	 */
	_updateRootElement() {
		this._rootElement = this._normalizeScrollRoot(this._params.target);

		if (!this._rootElement && this._isScrollable(this._element)) {
			this._rootElement = this._element;
		}

		if (!this._rootElement) {
			const firstSection = this._observableSections.values().next().value || null;
			this._rootElement = firstSection ? this._getScrollParent(firstSection) : null;
		}

		this._previousScrollData.parentScrollTop = this._getParentScrollTop();
		this._previousScrollData.visibleEntryTop = 0;
	}

	_normalizeScrollRoot(element) {
		const root = getElement(element);
		if (!root) return null;
		if (root === document.body || root === document.documentElement) return null;
		return this._isScrollable(root) ? root : null;
	}

	_isScrollable(element) {
		if (!(element instanceof HTMLElement)) return false;
		const overflowY = getComputedStyle(element).overflowY;
		if (!/(auto|scroll|overlay)/.test(overflowY)) return false;
		return element.scrollHeight > element.clientHeight;
	}

	_getScrollParent(element) {
		for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
			if (this._isScrollable(parent)) return parent;
		}
		return null;
	}

	_getSectionTop(section) {
		if (this._rootElement) {
			const rootRect = this._rootElement.getBoundingClientRect();
			const rect = section.getBoundingClientRect();
			return this._rootElement.scrollTop + (rect.top - rootRect.top);
		}

		return (window.scrollY || document.documentElement.scrollTop || 0) + section.getBoundingClientRect().top;
	}

	_getParentScrollTop() {
		if (this._rootElement) return this._rootElement.scrollTop;
		return window.scrollY || document.documentElement.scrollTop || 0;
	}

	dispose() {
		if (this._observer) {
			this._observer.disconnect();
		}
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
			const hash = decodeURI(link.hash || '');
			if (!hash) return;

			const section = this._observableSections.get(hash);
			if (!section) return;

			event.preventDefault();

			const scrollTop = this._getSectionTop(section);
			const root = this._rootElement;

			if (root) {
				if (root.scrollTo) {
					root.scrollTo({ top: scrollTop, behavior: 'smooth' });
				} else {
					root.scrollTop = scrollTop;
				}
				return;
			}

			if (window.scrollTo) {
				window.scrollTo({ top: scrollTop, behavior: 'smooth' });
			} else {
				document.documentElement.scrollTop = scrollTop;
			}
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
		const getTargetLink = (entry) => this._targetLinks.get(`#${entry.target.id}`);
		const parentScrollTop = this._getParentScrollTop();
		const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
		this._previousScrollData.parentScrollTop = parentScrollTop;

		for (const entry of entries) {
			if (!entry.isIntersecting) {
				this._clearActiveClass(getTargetLink(entry));
				continue;
			}

			const entryTop = this._getSectionTop(entry.target);
			const isEntryBelow = entryTop >= this._previousScrollData.visibleEntryTop;
			const shouldActivate =
				(userScrollsDown && isEntryBelow) || (!userScrollsDown && !isEntryBelow);

			if (shouldActivate) {
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
			const hash = decodeURI(link.hash || '');
			if (!hash || isDisabled(link)) continue;

			const section = Selectors.find(hash);
			if (isVisible(section)) {
				this._targetLinks.set(hash, link);
				this._observableSections.set(hash, section);
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

		this._clearActiveClass(this._params.target);
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
		parent.classList.remove(CLASS_NAME_ACTIVE);

		const activeLinks = Selectors.findAll(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent);
		for (const link of activeLinks) {
			link.classList.remove(CLASS_NAME_ACTIVE);
		}
	}
}

/**
 * Инициализация через data-атрибуты при загрузке DOM
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const spy of Selectors.findAll(SELECTOR_DATA_SPY)) {
		VGSpy.getOrCreateInstance(spy);
	}
});

export default VGSpy;
