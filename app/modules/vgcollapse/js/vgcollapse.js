/**
 * @class VGCollapse
 * @extends BaseModule
 * @classdesc Класс для реализации поведения "collapse" (раскрытие/свертывание элементов) с поддержкой анимации, AJAX-загрузки и иерархической структуры.
 *
 * Поддерживает переключение видимости контента по клику на элементы с атрибутом `data-vg-toggle="collapse"`.
 * Может работать в вертикальном и горизонтальном режимах, управлять aria-атрибутами и состоянием кнопок.
 *
 * @param {HTMLElement} element - Основной элемент, к которому применяется collapse.
 * @param {Object} params - Параметры конфигурации.
 * @param {boolean} [params.toggle=true] - Автоматически переключать состояние при инициализации.
 * @param {string|HTMLElement|null} [params.parent=null] - Родительский контейнер, ограничивающий поиск дочерних collapse-элементов.
 * @param {Object} params.ajax - Настройки AJAX-загрузки контента.
 * @param {string} params.ajax.route - URL-адрес для запроса.
 * @param {string} params.ajax.target - CSS-селектор, куда вставлять ответ.
 * @param {string} params.ajax.method='get' - HTTP-метод запроса.
 * @param {boolean} params.ajax.loader=false - Показывать ли лоадер при загрузке.
 * @param {boolean} params.ajax.once=true - Загружать контент только один раз.
 * @param {boolean} params.ajax.output=true - Вставлять ли ответ в DOM.
 *
 * @example
 * const collapse = new VGCollapse(document.getElementById('myCollapse'), {
 *   toggle: true,
 *   parent: '#accordion'
 * });
 *
 * @example
 * <div id="accordion">
 *   <div class="vg-collapse" id="collapseOne">
 *     <button data-vg-toggle="collapse" data-target="#collapseOne">Toggle</button>
 *   </div>
 * </div>
 */
import BaseModule from "../../base-module";
import {getElement, mergeDeepObject, reflow} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * Константы, используемые в классе VGCollapse.
 * @private
 * @type {Object}
 */
const NAME = 'collapse';
const NAME_KEY = 'vg.collapse';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_COLLAPSE = 'vg-collapse';
const CLASS_NAME_COLLAPSING = 'vg-collapsing';
const CLASS_NAME_COLLAPSED = 'vg-collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'vg-collapse-horizontal';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="collapse"]';
const SELECTOR_ACTIVES = '.vg-collapse.show, .vg-collapse.vg-collapsing';

const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

const WIDTH = 'width';
const HEIGHT = 'height';

class VGCollapse extends BaseModule {
	/**
	 * Создает экземпляр VGCollapse.
	 * @param {HTMLElement} element - DOM-элемент, к которому применяется collapse.
	 * @param {Object} params - Параметры инициализации.
	 */
	constructor(element, params = {}) {
		super(element, params);

		/**
		 * Объединённые параметры с учётом значений по умолчанию и переданных пользователем.
		 * @type {Object}
		 * @private
		 */
		this._params = this._getParams(element, mergeDeepObject({
			toggle: true,
			parent: null,
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: true,
				output: true,
			}
		}, params));

		/**
		 * Родительский элемент (если задан).
		 * @type {HTMLElement|null}
		 * @private
		 */
		this._params.parent = getElement(this._params.parent) || null;

		/**
		 * Флаг, указывающий на переход (анимацию).
		 * @type {boolean}
		 * @private
		 */
		this._isTransitioning = false;

		/**
		 * Массив элементов, которые управляют этим collapse (например, кнопки).
		 * @type {HTMLElement[]}
		 * @private
		 */
		this._triggerArray = [];

		const toggleList = Selectors.findAll(SELECTOR_DATA_TOGGLE);

		for (const elem of toggleList) {
			const selector = Selectors.getSelectorFromElement(elem);
			const filterElement = Selectors.findAll(selector).filter(foundElement => foundElement === this._element);

			if (selector !== null && filterElement.length) {
				this._triggerArray.push(elem);
			}
		}

		this._initializeChildren();

		if (!this._params.parent) {
			this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
		}

		if (this._params.toggle) {
			this.toggle();
		}
	}

	/**
	 * Возвращает статическое имя модуля.
	 * @returns {string} Имя модуля.
	 * @static
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Возвращает статический ключ модуля (используется для событий и хранения экземпляров).
	 * @returns {string} Ключ модуля.
	 * @static
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Переключает состояние collapse: если скрыт — показывает, если показан — скрывает.
	 * @param {EventTarget} [relatedTarget] - Связанный элемент (опционально).
	 * @returns {void}
	 */
	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	/**
	 * Открывает collapse с анимацией и, при необходимости, AJAX-загрузкой.
	 * @emits VGCollapse#show - Перед началом открытия.
	 * @emits VGCollapse#shown - После завершения открытия.
	 * @emits VGCollapse#loaded - После загрузки AJAX-контента (если используется).
	 * @returns {void}
	 */
	show() {
		if (this._isTransitioning || this._isShown()) {
			return;
		}

		let activeChildren = [];

		if (this._params.parent) {
			activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES)
				.filter(element => element !== this._element)
				.map(element => VGCollapse.getOrCreateInstance(element, { toggle: false }));
		}

		if (activeChildren.length && activeChildren[0]._isTransitioning) {
			return;
		}

		const startEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW);
		if (startEvent.defaultPrevented) {
			return;
		}

		for (const activeInstance of activeChildren) {
			activeInstance.hide();
		}

		const dimension = this._getDimension();

		this._element.classList.remove(CLASS_NAME_COLLAPSE);
		this._element.classList.add(CLASS_NAME_COLLAPSING);

		this._element.style[dimension] = '0';

		this._addAriaAndCollapsedClass(this._triggerArray, true);
		this._isTransitioning = true;

		const complete = () => {
			this._isTransitioning = false;

			this._element.classList.remove(CLASS_NAME_COLLAPSING);
			this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

			this._element.style[dimension] = '';

			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_KEY_LOADED, { stats: status, data });
			});

			EventHandler.trigger(this._element, EVENT_KEY_SHOWN);
		};

		const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
		const scrollSize = `scroll${capitalizedDimension}`;

		this._queueCallback(complete, this._element, true);
		this._element.style[dimension] = `${this._element[scrollSize]}px`;
	}

	/**
	 * Скрывает collapse с анимацией.
	 * @emits VGCollapse#hide - Перед началом скрытия.
	 * @emits VGCollapse#hidden - После завершения скрытия.
	 * @returns {void}
	 */
	hide() {
		if (this._isTransitioning || !this._isShown()) {
			return;
		}

		const startEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (startEvent.defaultPrevented) {
			return;
		}

		const dimension = this._getDimension();

		this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;

		reflow(this._element);

		this._element.classList.add(CLASS_NAME_COLLAPSING);
		this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

		for (const trigger of this._triggerArray) {
			const element = Selectors.getElementFromSelector(trigger);

			if (element && !this._isShown(element)) {
				this._addAriaAndCollapsedClass([trigger], false);
			}
		}

		this._isTransitioning = true;

		const complete = () => {
			this._isTransitioning = false;
			this._element.classList.remove(CLASS_NAME_COLLAPSING);
			this._element.classList.add(CLASS_NAME_COLLAPSE);
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
		};

		this._element.style[dimension] = '';

		this._queueCallback(complete, this._element, true);
	}

	/**
	 * Удаляет экземпляр collapse и очищает память.
	 * @returns {void}
	 */
	dispose() {
		super.dispose();
	}

	/**
	 * Проверяет, является ли элемент открытым.
	 * @param {HTMLElement} [element=this._element] - Элемент для проверки.
	 * @returns {boolean} `true`, если элемент имеет класс `.show`.
	 * @private
	 */
	_isShown(element = this._element) {
		return element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Добавляет или удаляет aria-атрибуты и классы у управляющих элементов.
	 * @param {HTMLElement[]} triggerArray - Массив элементов управления.
	 * @param {boolean} isOpen - Состояние: открыто или закрыто.
	 * @private
	 */
	_addAriaAndCollapsedClass(triggerArray, isOpen) {
		if (!triggerArray.length) {
			return;
		}

		for (const element of triggerArray) {
			this._changeStateButton(element, isOpen);
		}
	}

	/**
	 * Инициализирует дочерние collapse-элементы, если указан родитель.
	 * @private
	 */
	_initializeChildren() {
		if (!this._params.parent) return;

		const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);

		for (const element of children) {
			const selected = Selectors.getElementFromSelector(element);

			if (selected) {
				this._addAriaAndCollapsedClass([element], this._isShown(selected));
			}
		}
	}

	/**
	 * Возвращает дочерние элементы первого уровня (без вложенных).
	 * @param {string} selector - CSS-селектор для поиска.
	 * @returns {HTMLElement[]} Массив найденных элементов.
	 * @private
	 */
	_getFirstLevelChildren(selector) {
		const children = Selectors.findAll(CLASS_NAME_DEEPER_CHILDREN, this._params.parent);
		return Selectors.findAll(selector, this._params.parent).filter(element => !children.includes(element));
	}

	/**
	 * Обновляет состояние кнопки: классы, текст, aria-expanded.
	 * @param {HTMLElement} element - Кнопка, управляющая collapse.
	 * @param {boolean} isOpen - Текущее состояние (открыто/закрыто).
	 * @private
	 */
	_changeStateButton(element, isOpen) {
		element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
		element.setAttribute('aria-expanded', isOpen);
		element.innerHTML = Manipulator.get(element, `data-${isOpen ? 'hide' : 'show'}-text`) || element.innerHTML;
	}

	/**
	 * Определяет, по какой оси происходит анимация (высота или ширина).
	 * @returns {string} `'height'` или `'width'`.
	 * @private
	 */
	_getDimension() {
		return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
	}
}

/**
 * Реализация Data API: автоматическая инициализация по атрибуту `data-vg-toggle="collapse"`.
 * @listens document#click
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (event.target.tagName === 'A' || (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
		event.preventDefault();
	}

	Selectors.getMultipleElementsFromSelector(this).forEach(function (element) {
		VGCollapse.getOrCreateInstance(element, { toggle: false }).toggle();
	});
});

export default VGCollapse;