import BaseModule from "../../base-module";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {getNextActiveElement, isDisabled, mergeDeepObject} from "../../../utils/js/functions";

/**
 * @constant {string} NAME - Имя модуля (используется для событий и идентификации)
 */
const NAME = 'tabs';
/**
 * @constant {string} NAME_KEY - Полное пространство имён модуля (с префиксом)
 */
const NAME_KEY = 'vg.tabs';

/**
 * @event VGTabs#hide - Срабатывает перед скрытием вкладки
 */
const EVENT_HIDE = `${NAME_KEY}.hide`;
/**
 * @event VGTabs#hidden - Срабатывает после скрытия вкладки
 */
const EVENT_HIDDEN = `${NAME_KEY}.hidden`;
/**
 * @event VGTabs#show - Срабатывает перед показом вкладки
 */
const EVENT_SHOW = `${NAME_KEY}.show`;
/**
 * @event VGTabs#shown - Срабатывает после показа вкладки
 */
const EVENT_SHOWN = `${NAME_KEY}.shown`;
/**
 * @event VGTabs#loaded - Срабатывает после загрузки контента (AJAX)
 */
const EVENT_LOADED = `${NAME_KEY}.loaded`;

/**
 * @constant {string} EVENT_KEYDOWN - Событие клавиатуры для навигации по вкладкам
 */
const EVENT_KEYDOWN = `keydown.${NAME_KEY}`;
/**
 * @constant {string} EVENT_LOAD_DATA_API - Событие загрузки страницы
 */
const EVENT_LOAD_DATA_API = `load.${NAME_KEY}`;
/**
 * @constant {string} EVENT_CLICK_DATA_API - Событие клика для активации вкладки
 */
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}`;
/**
 * @constant {string} EVENT_MOUSEOVER_DATA_API - Событие наведения для слайдера
 */
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}`;
/**
 * @constant {string} EVENT_MOUSEOUT_DATA_API - Событие ухода курсора для слайдера
 */
const EVENT_MOUSEOUT_DATA_API = `mouseout.${NAME_KEY}`;

/**
 * @constant {string[]} NAV_KEYS - Клавиши для навигации между вкладками
 */
const NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';

/**
 * @constant {Object} CLASS_NAME - Классы, используемые в компоненте
 */
const CLASS_NAME = {
	ACTIVE: 'active',
	HOVER: 'hover',
	FADE: 'fade',
	SHOW: 'show',
	DROPDOWN: 'dropdown',
	SLIDER: 'vg-tabs-slider',
	WITH_SLIDER: 'vg-tabs-with-slider'
};

/**
 * @constant {Object} SELECTOR - CSS-селекторы, используемые в компоненте
 */
const INNER_SELECTOR = `.vg-tabs-link:not([data-vg-toggle="dropdown"]), .list-group-item:not([data-vg-toggle="dropdown"]), [role="tab"]:not([data-vg-toggle="dropdown"])`;
const DATA_TOGGLE = '[data-vg-toggle="tab"]';

const SELECTOR = {
	DROPDOWN_TOGGLE: '[data-vg-toggle="dropdown"]',
	DROPDOWN_MENU: '.dropdown-content',
	TAB_CLASS: '.vg-tabs',
	TAB_PANEL: '.list-group, .vg-tabs-panel, [role="tablist"]',
	OUTER: '.vg-tabs-item, .list-group-item',
	INNER: INNER_SELECTOR,
	DATA_TOGGLE: DATA_TOGGLE,
	INNER_ELEM: `${INNER_SELECTOR}, ${DATA_TOGGLE}`,
	DATA_TOGGLE_ACTIVE: `.active[data-vg-toggle="tab"]`
};

/**
 * Компонент вкладок (Tabs)
 * Поддерживает: навигацию с клавиатуры, хеш-роутинг, AJAX-загрузку, анимацию, слайдер-индикатор.
 *
 * @extends BaseModule
 */
class VGTabs extends BaseModule {
	/**
	 * Создаёт экземпляр VGTabs
	 *
	 * @param {HTMLElement} element - Элемент вкладки (например, ссылка)
	 * @param {Object} params - Параметры инициализации
	 * @param {boolean} [params.slide=false] - Показывать ли индикатор-слайдер
	 * @param {boolean} [params.hash=false] - Активировать вкладку по хешу в URL
	 * @param {Object} [params.ajax] - Настройки AJAX
	 * @param {string} [params.ajax.route=''] - URL для загрузки
	 * @param {string} [params.ajax.target=''] - Селектор цели загрузки
	 * @param {string} [params.ajax.method='get'] - HTTP-метод
	 * @param {boolean} [params.ajax.loader=false] - Показывать ли лоадер
	 * @param {boolean} [params.ajax.once=true] - Загружать один раз
	 * @param {boolean} [params.ajax.output=true] - Выводить ли ответ в DOM
	 */
	constructor(element, params) {
		super(element, params);

		this._params = mergeDeepObject({
			slide: false,
			hash: false,
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: true,
				output: true,
			},
		}, this._params);

		this._parent = this._element.closest(SELECTOR.TAB_PANEL);
		this._main_parent = this._parent?.closest(SELECTOR.TAB_CLASS) || null;

		if (!this._parent) {
			throw new TypeError(`${element.outerHTML} не имеет родителя с селектором ${SELECTOR.INNER_ELEM}`);
		}

		this._params = this._getParams(this._main_parent, this._params);
		this._params = this._getParams(this._element, this._params);

		this._setInitialAttributes(this._parent, this._getChildren());
		this._setInitialSlider();
		this._setTabHash();

		EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
	}

	/**
	 * Возвращает имя компонента
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Возвращает ключ компонента (с префиксом)
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Активирует вкладку
	 */
	show() {
		const innerElem = this._element;

		if (this._elemIsActive(innerElem)) return;

		const activeElem = this._getActiveElem();
		const relatedTarget = innerElem;

		// События hide и show
		const hideEvent = activeElem ? EventHandler.trigger(activeElem, EVENT_HIDE, {relatedTarget}) : null;
		const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW, {relatedTarget});

		if (showEvent.defaultPrevented || (hideEvent && hideEvent.defaultPrevented)) return;

		this._deactivate(activeElem, innerElem);
		this._activate(innerElem, relatedTarget);
	}

	/**
	 * Проверяет, активен ли элемент
	 * @param {HTMLElement} elem - Элемент для проверки
	 * @returns {boolean}
	 */
	_elemIsActive(elem) {
		return elem?.classList.contains(CLASS_NAME.ACTIVE) || false;
	}

	/**
	 * Получает активный элемент во вкладках
	 * @returns {HTMLElement|null}
	 */
	_getActiveElem() {
		return this._getChildren().find(child => this._elemIsActive(child)) || null;
	}

	/**
	 * Активирует элемент и его целевой панель
	 * @param {HTMLElement} element - Активируемый элемент
	 * @param {HTMLElement} relatedTarget - Элемент, вызвавший активацию
	 */
	_activate(element, relatedTarget) {
		if (!element) return;

		element.classList.add(CLASS_NAME.ACTIVE);

		const target = Selectors.getElementFromSelector(element);
		if (target) this._activate(target, relatedTarget);

		const complete = () => {
			if (element.getAttribute('role') !== 'tab') {
				element.classList.add(CLASS_NAME.SHOW);
				return;
			}

			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_LOADED, { stats: status, data });
			});

			element.removeAttribute('tabindex');
			element.setAttribute('aria-selected', 'true');
			this._toggleDropDown(element, true);

			EventHandler.trigger(element, EVENT_SHOWN, { relatedTarget }); // ← теперь relatedTarget определён
		};

		this._queueCallback(complete, element, element.classList.contains(CLASS_NAME.FADE));
	}

	/**
	 * Деактивирует элемент
	 * @param {HTMLElement} element - Деактивируемый элемент
	 * @param {HTMLElement} relatedTarget - Новый активный элемент
	 */
	_deactivate(element, relatedTarget) {
		if (!element) return;

		element.classList.remove(CLASS_NAME.ACTIVE);
		element.blur();

		const target = Selectors.getElementFromSelector(element);
		if (target) this._deactivate(target, relatedTarget);

		const complete = () => {
			if (element.getAttribute('role') !== 'tab') {
				element.classList.remove(CLASS_NAME.SHOW);
				return;
			}

			element.setAttribute('aria-selected', 'false');
			element.setAttribute('tabindex', '-1');
			this._toggleDropDown(element, false);

			EventHandler.trigger(element, EVENT_HIDDEN, { relatedTarget });
		};

		this._queueCallback(complete, element, element.classList.contains(CLASS_NAME.FADE));
	}

	/**
	 * Обработка навигации с клавиатуры
	 * @param {KeyboardEvent} event
	 */
	_keydown(event) {
		if (!NAV_KEYS.includes(event.key)) return;

		event.stopPropagation();
		event.preventDefault();

		const children = this._getChildren().filter(el => !isDisabled(el));
		let nextActiveElement;

		if ([HOME_KEY, END_KEY].includes(event.key)) {
			nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
		} else {
			const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
			nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
		}

		if (nextActiveElement) {
			nextActiveElement.focus({preventScroll: true});
			VGTabs.getOrCreateInstance(nextActiveElement).show();
		}
	}

	/**
	 * Активация вкладки по хешу в URL
	 */
	_setTabHash() {
		if (!this._params.hash) return;

		const url = document.location.toString();
		if (!url.includes('#')) return;

		const id = url.split('#')[1];
		const element = Selectors.find(`[href="#${id}"]`, this._parent) ||
			Selectors.find(`[data-vg-target="#${id}"]`, this._element) ||
			null;

		if (element) {
			VGTabs.getOrCreateInstance(element).show();
		}
	}

	/**
	 * Инициализация слайдера-индикатора под вкладками
	 */
	_setInitialSlider() {
		if (!this._params.slide) return;

		let slider = Selectors.find(`.${CLASS_NAME.SLIDER}`, this._main_parent);
		if (!slider) {
			slider = document.createElement('span');
			slider.classList.add(CLASS_NAME.SLIDER);
			this._main_parent.prepend(slider);
		}

		this._main_parent.classList.add(CLASS_NAME.WITH_SLIDER);

		const activeLink = Selectors.find(`.${CLASS_NAME.ACTIVE}`, this._parent);
		if (!activeLink) return;

		const {width, height} = window.getComputedStyle(activeLink);
		activeLink.classList.add(CLASS_NAME.HOVER);

		slider.style.width = width;
		slider.style.height = height;
		slider.style.left = `${activeLink.offsetLeft}px`;

		// Наведение
		EventHandler.on(this._main_parent, EVENT_MOUSEOVER_DATA_API, SELECTOR.DATA_TOGGLE, (event) => {
			const target = event.target;
			if (['A', 'AREA'].includes(target.tagName)) event.preventDefault();
			if (isDisabled(target)) return;

			const hover = Selectors.find(`.${CLASS_NAME.HOVER}`, this._parent);
			if (hover) hover.classList.remove(CLASS_NAME.HOVER);
			target.classList.add(CLASS_NAME.HOVER);

			const {width, height} = window.getComputedStyle(target);
			slider.style.width = width;
			slider.style.height = height;
			slider.style.left = `${target.offsetLeft}px`;
		});

		// Уход курсора
		EventHandler.on(this._main_parent, EVENT_MOUSEOUT_DATA_API, SELECTOR.DATA_TOGGLE, () => {
			const active = Selectors.find(`.${CLASS_NAME.ACTIVE}`, this._parent);
			const {width, height} = window.getComputedStyle(active);

			Selectors.findAll(`.${CLASS_NAME.HOVER}`, this._parent).forEach(el => el.classList.remove(CLASS_NAME.HOVER));
			active.classList.add(CLASS_NAME.HOVER);

			slider.style.width = width;
			slider.style.height = height;
			slider.style.left = `${active.offsetLeft}px`;
		});
	}

	/**
	 * Устанавливает базовые ARIA-атрибуты родителю
	 * @param {HTMLElement} parent - Родительский элемент (tablist)
	 * @param {HTMLElement[]} children - Дочерние элементы (вкладки)
	 */
	_setInitialAttributes(parent, children) {
		this._setAttributeIfNotExists(parent, 'role', 'tablist');
		children.forEach(child => this._setInitialAttributesOnChild(child));
	}

	/**
	 * Устанавливает атрибуты для одной вкладки
	 * @param {HTMLElement} child - Элемент вкладки
	 */
	_setInitialAttributesOnChild(child) {
		child = this._getInnerElement(child);
		const isActive = this._elemIsActive(child);
		const outerElem = this._getOuterElement(child);

		child.setAttribute('aria-selected', isActive);
		if (outerElem !== child) {
			this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
		}
		if (!isActive) {
			child.setAttribute('tabindex', '-1');
		}
		this._setAttributeIfNotExists(child, 'role', 'tab');
		this._setInitialAttributesOnTargetPanel(child);
	}

	/**
	 * Устанавливает атрибуты целевой панели (tabpanel)
	 * @param {HTMLElement} child - Элемент вкладки
	 */
	_setInitialAttributesOnTargetPanel(child) {
		const target = Selectors.getElementFromSelector(child);
		if (!target) return;

		this._setAttributeIfNotExists(target, 'role', 'tabpanel');
		if (child.id) {
			this._setAttributeIfNotExists(target, 'aria-labelledby', child.id);
		}
	}

	/**
	 * Устанавливает атрибут, если его ещё нет
	 * @param {HTMLElement} element - Целевой элемент
	 * @param {string} attribute - Имя атрибута
	 * @param {string} value - Значение атрибута
	 */
	_setAttributeIfNotExists(element, attribute, value) {
		if (!element.hasAttribute(attribute)) {
			element.setAttribute(attribute, value);
		}
	}

	/**
	 * Получает все дочерние элементы-вкладки
	 * @returns {HTMLElement[]}
	 */
	_getChildren() {
		return Selectors.findAll(SELECTOR.INNER_ELEM, this._parent);
	}

	/**
	 * Получает внутренний элемент вкладки (ссылку)
	 * @param {HTMLElement} elem - Элемент
	 * @returns {HTMLElement}
	 */
	_getInnerElement(elem) {
		return elem.matches(SELECTOR.INNER_ELEM) ? elem : Selectors.find(SELECTOR.INNER_ELEM, elem);
	}

	/**
	 * Получает внешний контейнер вкладки
	 * @param {HTMLElement} elem - Элемент
	 * @returns {HTMLElement}
	 */
	_getOuterElement(elem) {
		return elem.closest(SELECTOR.OUTER) || elem;
	}

	/**
	 * Управляет состоянием выпадающего меню
	 * @param {HTMLElement} element - Элемент вкладки
	 * @param {boolean} open - Открыть или закрыть
	 */
	_toggleDropDown(element, open) {
		const outerElem = this._getOuterElement(element);
		if (!outerElem.classList.contains(CLASS_NAME.DROPDOWN)) return;

		const toggle = (selector, className) => {
			const el = Selectors.find(selector, outerElem);
			if (el) el.classList.toggle(className, open);
		};

		toggle(SELECTOR.DROPDOWN_TOGGLE, CLASS_NAME.ACTIVE);
		toggle(SELECTOR.DROPDOWN_MENU, CLASS_NAME.SHOW);
		outerElem.setAttribute('aria-expanded', open);
	}
}

/**
 * Обработка кликов по вкладкам
 */
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR.DATA_TOGGLE, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}
	if (isDisabled(this)) return;
	VGTabs.getOrCreateInstance(this).show();
});

/**
 * Инициализация активных вкладок при загрузке страницы
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	Selectors.findAll(SELECTOR.DATA_TOGGLE_ACTIVE).forEach(element => {
		VGTabs.getOrCreateInstance(element);
	});
});

export default VGTabs;