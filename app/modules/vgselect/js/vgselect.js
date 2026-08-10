import BaseModule from "../../base-module";
import {
	isDisabled,
	isEmptyObj,
	mergeDeepObject,
	normalizeData,
} from "../../../utils/js/functions";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import _handlersVGSelect from "./handlers";
import {lang_buttons, lang_messages, lang_titles} from "../../../utils/js/components/lang";

const NAME = 'select';
const NAME_KEY = 'vg.select';

const CLASS_NAME_SHOW           = 'show';
const CLASS_NAME_ACTIVE         = 'active';
const CLASS_NAME_CONTAINER      = 'vg-select';
const CLASS_NAME_DROPDOWN       = 'vg-select-dropdown';
const CLASS_NAME_LIST           = 'vg-select-list';
const CLASS_NAME_OPTION         = 'vg-select-list--option';
const CLASS_NAME_OPTGROUP       = 'vg-select-list--optgroup';
const CLASS_NAME_OPTGROUP_TITLE = 'vg-select-list--optgroup-title';
const CLASS_NAME_CURRENT        = 'vg-select-current';
const CLASS_NAME_PLACEHOLDER    = 'vg-select-current--placeholder';
const CLASS_NAME_SEARCH         = 'vg-select-search';
const CLASS_NAME_TAGS           = 'vg-select-tags';
const CLASS_NAME_TAG            = 'vg-select-tag';
const CLASS_NAME_TAG_REMOVE     = 'vg-select-tag-remove';
const CLASS_NAME_LOAD_MORE      = 'vg-select-load-more';
const CLASS_NAME_LOADING        = 'vg-select-loading';
const CLASS_NAME_DROP_UP        = 'drop-up';

const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE            = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN          = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW            = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN           = `${NAME_KEY}.shown`;
const EVENT_KEY_INIT            = `${NAME_KEY}.init`;
const EVENT_KEY_REBUILD         = `${NAME_KEY}.rebuild`;
const EVENT_KEY_OPEN            = `${NAME_KEY}.open`;
const EVENT_KEY_CLOSE           = `${NAME_KEY}.close`;
const EVENT_KEY_SELECT          = `${NAME_KEY}.select`;
const EVENT_KEY_CLEAR           = `${NAME_KEY}.clear`;
const EVENT_KEY_ERROR           = `${NAME_KEY}.error`;
const EVENT_KEY_LOAD_NEXT       = `${NAME_KEY}.loadNext`;

const SELECTOR_DATA_TOGGLE      = '[data-vg-toggle="select"]';
const SELECTOR_CURRENT          = `.${CLASS_NAME_CURRENT}`;
const SELECTOR_DROPDOWN         = `.${CLASS_NAME_DROPDOWN}`;
const SELECTOR_SEARCH_INPUT     = `.${CLASS_NAME_SEARCH} input`;
const SELECTOR_LIST             = `.${CLASS_NAME_LIST}`;
const SELECTOR_LOAD_MORE_BTN    = `.${CLASS_NAME_LOAD_MORE}`;
const DATA_ATTR_COPY_EXCLUDE_DEFAULT = ['inited', 'updating', 'exclude'];

/**
 * Класс VGSelect
 * Кастомный <select> с поддержкой поиска, мультивыбора, динамической загрузки, i18n, пагинации и обновления через MutationObserver.
 * @extends BaseModule
 */
class VGSelect extends BaseModule {
	/**
	 * Создаёт экземпляр VGSelect
	 * @param {HTMLSelectElement} element - Исходный <select> элемент
	 * @param {Object} [params] - Параметры инициализации
	 */
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			lang: document.documentElement.lang || 'ru',
			autosearch: true,
			// Dropdown placement behavior:
			// - none: default CSS positioning (no JS)
			// - auto: choose top/bottom based on available space in overflow ancestor/viewport
			// - top: force open upwards
			// - bottom: force open downwards
			position: 'none',
			search: {
				enabled: false,
				route: '',
				remote: false,
				delay: 300,
				minterm: 1,
				pagination: false,
				pageParam: 'page',
				termParam: 'q',
				perpage: 20,
				loadMoreText: 'Загрузить ещё',
			},
			close: true,
			tree: false,
			exclude: 'data-filter-param',
			placeholder: '',
			onInit: null,
			onShow: null,
			onHide: null,
			onChange: null,
			onSelect: null,
			onDeselect: null,
			onClear: null,
			onLoadNext: null,
		}, params));

		this._observer = null;
		this._observerTimeout = null;
		this._visibilityTransitionId = 0;
		this._drop = Selectors.find(SELECTOR_DROPDOWN, this._element);
		this._searchTerm = '';
		this._currentPage = 1;
		this._totalPages = null;
		this._loading = false;

		if (typeof params.search === 'object') {
			this._params.search.loadMoreText = lang_buttons(this._params.lang, NAME)['load-more'] || 'Загрузить еще'
		}

		this._remoteSearchRequestId = 0;
		this._remoteSearchAbortController = null;

		this._positioningScrollParent = null;
		this._boundUpdateDropdownPlacement = () => this._updateDropdownPlacement();

		this._initObserver();
		this._syncSearch();
		this._initLoadMoreButton();

		this._triggerEvent(EVENT_KEY_INIT);
		this._callCallback('onInit');
	}

	/**
	 * Возвращает имя компонента
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Возвращает ключ события компонента
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Перестраивает список опций в выпадающем меню
	 * @param {HTMLSelectElement} selector - Исходный <select>
	 * @param {HTMLElement} drop - Контейнер выпадающего списка
	 * @returns {HTMLElement} - Обновлённый список
	 */
	static buildListOptions(selector, drop, params = {}) {
		let list = drop.querySelector(`.${CLASS_NAME_LIST}`);
		if (!list) {
			list = document.createElement('ul');
			Classes.add(list, CLASS_NAME_LIST);
			drop.appendChild(list);
		} else {
			list.innerHTML = '';
		}

		const optGroups = Selectors.findAll('optgroup', selector);
		const fragment = document.createDocumentFragment();
		const isTree = this._isTreeEnabled(selector, params);

		if (optGroups.length > 0) {
			optGroups.forEach(optGroup => {
				const ol = document.createElement('ol');
				Classes.add(ol, CLASS_NAME_OPTGROUP);

				const label = document.createElement('li');
				label.textContent = optGroup.label.trim();
				Classes.add(label, CLASS_NAME_OPTGROUP_TITLE);
				ol.appendChild(label);

				VGSelect._createListItems(Selectors.findAll('option', optGroup), ol, selector, {
					tree: isTree,
					depth: isTree ? 1 : 0,
				});
				fragment.appendChild(ol);
			});
			list.appendChild(fragment);
		} else {
			VGSelect._createListItems(selector.options, list, selector, {
				tree: isTree,
				depth: 0,
			});
		}

		return list;
	}

	/**
	 * Создаёт <li> элементы из списка <option>
	 * @param {HTMLCollection|NodeList} options - Коллекция <option>
	 * @param {HTMLElement} parent - Родительский контейнер (ul/ol)
	 * @param {HTMLSelectElement} selector - Исходный <select>
	 * @private
	 */
	static _createListItems(options, parent, selector, config = {}) {
		const frag = document.createDocumentFragment();
		const baseDepth = Number.isInteger(config.depth) ? config.depth : 0;
		const treeEnabled = !!config.tree;

		[...options].forEach((option) => {
			if (option.hidden) return;

			// value атрибута может не быть или он может быть пустым -> для маппинга используем индекс
			const rawValueAttr = option.getAttribute('value'); // null если атрибута нет
			const value = rawValueAttr == null ? '' : rawValueAttr;
			const text = option.textContent.trim();
			const isEmptyOption = value === '' && text === '';

			const li = document.createElement('li');
			li.textContent = text;
			li.dataset.index = String(option.index);
			li.dataset.value = value;
			li.classList.add(CLASS_NAME_OPTION);
			Manipulator.set(li, 'data-vg-toggle', 'select-option');
			if (treeEnabled) {
				const optionLevelRaw = option.dataset.level;
				const optionLevel = Number.isFinite(Number(optionLevelRaw)) ? parseInt(optionLevelRaw, 10) : null;
				const level = Math.max(0, optionLevel == null ? baseDepth : optionLevel);
				li.dataset.level = String(level);
				li.style.paddingLeft = `${16 + (level * 16)}px`;
			}

			// Раньше подсветка зависела от "явно выбранных" option (атрибут selected),
			// из-за этого UI мог показывать placeholder, но DOM считал, что выбрана 1-я опция.
			// Подсвечиваем по фактическому состоянию option.selected.
			if (option.selected) {
				li.classList.add('selected');
			}

			if (option.disabled) {
				li.classList.add('disabled');
			}

			if (isEmptyOption) {
				li.hidden = true;
				li.style.display = 'none';
			}

			const dataAttrs = Manipulator.get(option);
			if (!isEmptyObj(dataAttrs)) {
				Object.keys(dataAttrs).forEach(key => {
					Manipulator.set(li, `data-${key}`, dataAttrs[key]);
				});
			}

			frag.appendChild(li);
		});

		parent.appendChild(frag);
	}

	static _isTreeEnabled(selector, params = {}) {
		if (typeof params.tree === 'boolean') return params.tree;
		if (selector?.dataset && typeof selector.dataset.tree !== 'undefined') {
			return normalizeData(selector.dataset.tree) === true;
		}

		return false;
	}

	static _getDataAttrCopyExclusions(selector, params = {}) {
		const rawExclude = typeof params.exclude === 'string'
			? params.exclude
			: (selector.dataset.exclude || '');
		const customExcluded = rawExclude
			.split(',')
			.map(item => this._normalizeDataAttrKey(item))
			.filter(Boolean);

		return new Set([...DATA_ATTR_COPY_EXCLUDE_DEFAULT, ...customExcluded]);
	}

	static _normalizeDataAttrKey(value) {
		return String(value || '')
			.trim()
			.replace(/^data-/, '')
			.toLowerCase();
	}

	/**
	 * Определяет, нужно ли показывать поиск.
	 * search.enabled и search.remote включают его при любом количестве опций.
	 * autosearch: true использует порог 7, число задаёт собственный порог.
	 * @param {HTMLSelectElement} selector
	 * @param {Object} params
	 * @returns {boolean}
	 * @private
	 */
	static _isSearchEnabled(selector, params = {}) {
		if (params.search?.enabled === true || params.search?.remote === true) return true;

		const autosearch = params.autosearch;
		if (autosearch === false) return false;

		const numericThreshold = Number(autosearch);
		const threshold = autosearch !== true && Number.isFinite(numericThreshold) && numericThreshold >= 0
			? numericThreshold
			: 7;
		const optionCount = Array.from(selector?.options || []).filter(option => {
			if (option.hidden) return false;
			return option.value !== '' || option.textContent.trim() !== '';
		}).length;

		return optionCount > threshold;
	}

	/**
	 * Проверяет, является ли значение "пустым" (соответствует placeholder)
	 * @param {HTMLSelectElement} select - Элемент <select>
	 * @param {string} value - Значение для проверки
	 * @returns {boolean}
	 */
	static isPlaceholderValue(select, value) {
		const attr = select.dataset.placeholderValue;
		if (!attr) return value == null || String(value).trim() === '';
		return attr.split(',').map(v => v.trim()).includes(String(value));
	}

	/**
	 * Есть ли в <select> явно отмеченные selected (именно атрибутом selected, а не браузерным дефолтом)
	 * @param {HTMLSelectElement} select
	 * @returns {boolean}
	 */
	static hasExplicitSelectedOption(select) {
		return Array.from(select.options).some(opt => opt.hasAttribute('selected'));
	}

	/**
	 * Проверяет, выбрана ли допустимая опция (не placeholder)
	 * @param {HTMLSelectElement} select - Элемент <select>
	 * @returns {boolean}
	 */
	static hasSelectedValidOption(select) {
		const index = select.selectedIndex;
		if (index === -1) return false;
		return !this.isPlaceholderValue(select, select.options[index]?.value);
	}

	/**
	 * Строит кастомный UI для <select>
	 * @param {HTMLSelectElement} selector - Исходный <select>
	 * @param {boolean} [reBuild=false] - Пересоздать, если уже инициализирован
	 * @param params
	 * @returns {HTMLElement} - Обёртка (.vg-select)
	 */
	static build(selector, reBuild = false, params = {}) {
		if (reBuild || selector.dataset.inited === 'true') {
			this.destroy(selector);
		}

		const container = document.createElement('div');
		container.classList.add(CLASS_NAME_CONTAINER);
		container.style.position = 'relative';

		if (selector.classList.length) {
			[...selector.classList].forEach(cls => container.classList.add(cls));
		}

		if (isDisabled(selector)) {
			container.classList.add('disabled');
		}

		const elData = Manipulator.get(selector);
		if (!isEmptyObj(elData)) {
			const excludeDataAttrs = this._getDataAttrCopyExclusions(selector, params);
			Object.keys(elData).forEach(key => {
				if (excludeDataAttrs.has(key)) return;
				Manipulator.set(container, `data-${key}`, elData[key]);
			});
		}

		const placeholder = selector.dataset.placeholder || '';
		const isMultiple = selector.multiple;

		const current = document.createElement('div');
		current.classList.add(CLASS_NAME_CURRENT);
		current.setAttribute('data-vg-toggle', 'select');
		current.setAttribute('aria-expanded', 'false');
		current.setAttribute('role', 'button');
		current.tabIndex = isMultiple ? -1 : 0;

		if (isMultiple) {
			const tags = document.createElement('div');
			tags.classList.add(CLASS_NAME_TAGS);
			current.appendChild(tags);

			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'vg-select-multiple-input';
			input.style.cssText = 'border:0;outline:none;background:transparent;padding:0;margin:0;min-width:1px;width:1px;height:1px;line-height:1;font:inherit;opacity:0;';
			tags.appendChild(input);

			input.addEventListener('focus', () => {
				const inst = VGSelect.getInstance(input.closest(`.${CLASS_NAME_CONTAINER}`));
				if (inst && !inst._isShown()) inst.show();
			});
		} else {
			const index = selector.selectedIndex;
			const option = index >= 0 ? selector.options[index] : null;
			const text = option?.textContent.trim() || '';

			// Placeholder показываем только если реально нет валидно выбранной опции
			const showPlaceholder = placeholder && !this.hasSelectedValidOption(selector);

			current.innerHTML = showPlaceholder
				? `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`
				: text || '-';
		}

		container.appendChild(current);

		const dropdown = document.createElement('div');
		dropdown.classList.add(CLASS_NAME_DROPDOWN);
		container.appendChild(dropdown);

		this.buildListOptions(selector, dropdown, params);

		selector.insertAdjacentElement('afterend', container);
		selector.dataset.inited = 'true';

		this.getOrCreateInstance(container, params);
		this.updateUI(selector);

		return container;
	}

	/**
	 * Добавляет или убирает поле поиска согласно search.enabled/autosearch.
	 * @private
	 */
	_syncSearch() {
		const selector = this._element.previousElementSibling;
		if (!selector || selector.tagName !== 'SELECT' || !this._drop) return;

		const enabled = VGSelect._isSearchEnabled(selector, this._params);
		const currentSearch = this._drop.querySelector(`.${CLASS_NAME_SEARCH}`);
		if (!enabled) {
			currentSearch?.remove();
			return;
		}
		if (currentSearch) return;

		const search = document.createElement('div');
		search.classList.add(CLASS_NAME_SEARCH);
		const searchInput = document.createElement('input');
		searchInput.name = 'vg-select-search';
		searchInput.type = 'text';
		searchInput.placeholder = lang_titles(this._params.lang, NAME)['search'];
		searchInput.autocomplete = 'off';
		searchInput.setAttribute('role', 'searchbox');
		search.appendChild(searchInput);
		this._drop.insertBefore(search, this._drop.firstChild);

		let searchTimeout;
		searchInput.addEventListener('input', (e) => {
			const term = e.target.value.trim();
			const params = this._params;

			this._callCallback('onSearch', { term });
			if (params.search.remote && params.search.route) {
				if (term.length < (params.search.minterm || 1)) return;

				clearTimeout(searchTimeout);
				searchTimeout = setTimeout(() => {
					this._fetchRemoteData(term);
				}, params.search.delay || 300);
			} else {
				this._filterLocalOptions(term);
			}
		});
	}

	/**
	 * Переключает открытие/закрытие выпадающего списка
	 * @param {EventTarget} [relatedTarget] - Элемент, вызвавший событие
	 */
	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	/**
	 * Открывает выпадающий список
	 * @param {EventTarget} [relatedTarget] - Элемент, вызвавший событие
	 */
	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		const e = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
		if (e.defaultPrevented) return;

		const transitionId = ++this._visibilityTransitionId;
		this._element.classList.add(CLASS_NAME_SHOW);
		// active задаёт видимое состояние dropdown (opacity/height). Оно не должно
		// зависеть от таймера: под нагрузкой отложенный callback оставлял уже
		// открытый dropdown прозрачным и с height: 0.
		this._element.classList.add(CLASS_NAME_ACTIVE);
		if (this._getPositionMode() !== 'none') {
			this._setupDropdownPlacement();
		} else {
			// Ensure no leftovers if the instance had JS positioning before.
			this._teardownDropdownPlacement();
		}

		if ('ontouchstart' in document.documentElement) {
			document.body.style.pointerEvents = 'none';
		}

		const toggle = this._element.querySelector(SELECTOR_DATA_TOGGLE);
		toggle.setAttribute('aria-expanded', 'true');

		const searchInput = this._element.querySelector(SELECTOR_SEARCH_INPUT);
		if (searchInput) searchInput.focus();

		return this._queueCallback(() => {
			if (transitionId !== this._visibilityTransitionId || !this._isShown()) return;
			this._updateDropdownPlacement();
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
			this._triggerEvent(EVENT_KEY_OPEN);
			this._callCallback('onShow');
		}, this._drop, true, 50);
	}

	/**
	 * Закрывает выпадающий список
	 */
	hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		this._completeHide();
	}

	/**
	 * Полностью завершает процесс закрытия
	 * @param {Object} [relatedTarget] - Доп. данные
	 * @private
	 */
	_completeHide(relatedTarget = {}) {
		const e = EventHandler.trigger(this._element, EVENT_KEY_HIDE, relatedTarget);
		if (e.defaultPrevented) return;

		const transitionId = ++this._visibilityTransitionId;
		this._teardownDropdownPlacement();

		this._element.classList.remove(CLASS_NAME_ACTIVE);
		this._element.querySelector(SELECTOR_DATA_TOGGLE).setAttribute('aria-expanded', 'false');

		this._queueCallback(() => {
			if (transitionId !== this._visibilityTransitionId) return;
			this._element.classList.remove(CLASS_NAME_SHOW);
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN, relatedTarget);
			this._triggerEvent(EVENT_KEY_CLOSE);
			this._callCallback('onHide');
		}, this._drop, true, 10);

		if ('ontouchstart' in document.documentElement) {
			document.body.style.pointerEvents = '';
		}
	}

	/**
	 * Проверяет, открыт ли список
	 * @returns {boolean}
	 * @private
	 */
	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Инициализирует MutationObserver для отслеживания изменений в <select>
	 * @private
	 */
	_initObserver() {
		if (this._observer) {
			this._observer.disconnect();
		}

		const select = this._element.previousElementSibling;
		if (!select || select.tagName !== 'SELECT') return;

		this._observer = new MutationObserver((mutations) => {
			console.debug('VGSelect: Mutation detected', mutations);
			if (select.hasAttribute('data-updating')) return;

			const shouldUpdate = mutations.some(mutation => {
				if (mutation.type === 'attributes') {
					return ['disabled', 'required', 'style', 'hidden'].includes(mutation.attributeName);
				}
				return mutation.type === 'childList' || mutation.type === 'characterData';
			});

			if (!shouldUpdate) return;

			const wasShown = this._isShown();

			clearTimeout(this._observerTimeout);
			this._observerTimeout = setTimeout(() => {
				if (this._element.previousElementSibling !== select || select.hasAttribute('data-updating')) return;

				this._updateFromMutation();

				if (wasShown) {
					requestAnimationFrame(() => {
						this.show();
					});
				}
			}, 100);
		});

		this._observer.observe(select, {
			attributes: true,
			attributeFilter: ['disabled', 'required', 'style', 'hidden'],
			childList: true,
			subtree: true,
			characterData: true
		});
	}

	/**
	 * Обновляет UI после изменения в DOM
	 * @private
	 */
	_updateFromMutation() {
		const select = this._element.previousElementSibling;
		if (!select) return;

		if (isDisabled(select)) {
			this._element.classList.add('disabled');
		} else {
			this._element.classList.remove('disabled');
		}

		const drop = this._element.querySelector(SELECTOR_DROPDOWN);
		VGSelect.buildListOptions(select, drop, this._params);
		this._syncSearch();
		VGSelect.updateUI(select);
	}

	/**
	 * Освобождает ресурсы (отключает observer, очищает таймеры)
	 */
	dispose() {
		this._visibilityTransitionId++;
		if (this._observer) {
			this._observer.disconnect();
			this._observer = null;
		}
		clearTimeout(this._observerTimeout);
		this._observerTimeout = null;
		this._teardownDropdownPlacement();
		super.dispose();
	}

	_setupDropdownPlacement() {
		if (this._getPositionMode() === 'none') return;

		this._teardownDropdownPlacement();
		this._positioningScrollParent = this._getOverflowAncestor(this._element);

		// Update position on viewport scroll/resize, and on the nearest scroll/overflow parent.
		window.addEventListener('resize', this._boundUpdateDropdownPlacement, { passive: true });
		window.addEventListener('scroll', this._boundUpdateDropdownPlacement, { passive: true });

		if (this._positioningScrollParent) {
			this._positioningScrollParent.addEventListener('scroll', this._boundUpdateDropdownPlacement, { passive: true });
		}

		this._updateDropdownPlacement();
	}

	_teardownDropdownPlacement() {
		window.removeEventListener('resize', this._boundUpdateDropdownPlacement);
		window.removeEventListener('scroll', this._boundUpdateDropdownPlacement);

		if (this._positioningScrollParent) {
			this._positioningScrollParent.removeEventListener('scroll', this._boundUpdateDropdownPlacement);
		}
		this._positioningScrollParent = null;

		// Reset to stylesheet defaults.
		this._element.classList.remove(CLASS_NAME_DROP_UP);
		this._element.style.removeProperty('--vg-select-list-max-height');
	}

	_getPositionMode() {
		const raw = this._params?.position;
		const mode = raw == null ? 'none' : String(raw).trim().toLowerCase();
		if (mode === 'auto' || mode === 'top' || mode === 'bottom' || mode === 'none') return mode;
		return 'none';
	}

	_getOverflowAncestor(startEl) {
		let el = startEl?.parentElement;
		while (el && el !== document.body && el !== document.documentElement) {
			const style = window.getComputedStyle(el);
			const overflowX = style.overflowX || style.overflow || 'visible';
			const overflowY = style.overflowY || style.overflow || 'visible';
			const clipsX = overflowX !== 'visible';
			const clipsY = overflowY !== 'visible';

			if (clipsX || clipsY) {
				return el;
			}

			el = el.parentElement;
		}
		return null;
	}

	_getClipRect() {
		const viewport = {
			top: 0,
			left: 0,
			right: window.innerWidth,
			bottom: window.innerHeight
		};

		const parent = this._positioningScrollParent;
		if (!parent) return viewport;

		const r = parent.getBoundingClientRect();
		return {
			top: Math.max(viewport.top, r.top),
			left: Math.max(viewport.left, r.left),
			right: Math.min(viewport.right, r.right),
			bottom: Math.min(viewport.bottom, r.bottom),
		};
	}

	_updateDropdownPlacement() {
		if (!this._isShown()) return;

		const mode = this._getPositionMode();
		if (mode === 'none') return;

		const clip = this._getClipRect();
		const containerRect = this._element.getBoundingClientRect();

		const spaceBelow = clip.bottom - containerRect.bottom;
		const spaceAbove = containerRect.top - clip.top;

		const openUp = mode === 'top' ? true : mode === 'bottom' ? false : spaceAbove > spaceBelow;
		this._element.classList.toggle(CLASS_NAME_DROP_UP, openUp);

		const available = openUp ? spaceAbove : spaceBelow;

		// Give the dropdown some breathing room (borders/margins) and clamp.
		const listMax = Math.max(80, Math.floor(available - 12));
		if (Number.isFinite(listMax) && listMax > 0) {
			this._element.style.setProperty('--vg-select-list-max-height', `${listMax}px`);
		}
	}

	/**
	 * Удаляет кастомный UI
	 * @param {HTMLSelectElement} select - Исходный <select>
	 */
	static destroy(select) {
		const container = select.nextElementSibling;
		if (container && container.classList.contains(CLASS_NAME_CONTAINER)) {
			container.remove();
		}
	}

	/**
	 * Обновляет отображаемое значение (текст, теги)
	 * @param {HTMLSelectElement} select - Исходный <select>
	 */
	static updateUI(select) {
		const container = select.nextElementSibling;
		if (!container || !container.classList.contains(CLASS_NAME_CONTAINER)) return;

		const current = container.querySelector(SELECTOR_CURRENT);
		const placeholder = select.dataset.placeholder || '';
		const isMultiple = select.multiple;
		const instance = VGSelect.getInstance(container);

		if (isMultiple) {
			const tags = current.querySelector(`.${CLASS_NAME_TAGS}`);
			const input = tags.querySelector('input');
			const prevCount = tags.querySelectorAll(`.${CLASS_NAME_TAG}`).length;
			tags.innerHTML = '';
			tags.appendChild(input);

			const selected = Array.from(select.selectedOptions);
			const newCount = selected.length;

			if (newCount === 0 && prevCount > 0) {
				instance?._triggerEvent(EVENT_KEY_CLEAR);
				instance?._callCallback('onClear');
			}

			if (selected.length === 0) {
				input.placeholder = placeholder;
			} else {
				input.placeholder = '';
				selected.forEach(opt => {
					const tag = document.createElement('div');
					tag.classList.add(CLASS_NAME_TAG);
					// data-index — основной ключ (работает даже если у option нет value атрибута)
					tag.innerHTML = `<span>${opt.textContent}</span><svg class="${CLASS_NAME_TAG_REMOVE}" data-index="${opt.index}" data-value="${opt.getAttribute('value') ?? ''}" width="14" height="14" viewBox="0 0 14 14"><line x1="2" y1="2" x2="12" y2="12" stroke="currentColor"/><line x1="12" y1="2" x2="2" y2="12" stroke="currentColor"/></svg>`;
					tags.insertBefore(tag, input);
				});
			}
		} else {
			const index = select.selectedIndex;
			const option = index >= 0 ? select.options[index] : null;
			const text = option?.textContent.trim() || '';

			// Placeholder показываем только если реально нет валидно выбранной опции
			const showPlaceholder = placeholder && !this.hasSelectedValidOption(select);

			const oldText = current.textContent;
			const newText = showPlaceholder ? placeholder : text || '-';

			if (oldText !== newText) {
				current.innerHTML = showPlaceholder
					? `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`
					: newText;
			}
		}
	}

	/**
	 * Программно устанавливает значение <select>
	 * @param {HTMLSelectElement} select - Исходный <select>
	 * @param {string} value - Значение для выбора
	 * @param {Object} [data] - Дополнительные данные
	 */
	static changeSelector(select, value, data = {}) {
		const container = select.nextElementSibling;
		const instance = container ? VGSelect.getInstance(container) : null;

		select.setAttribute('data-updating', 'true');
		try {
			const opt = select.querySelector(`option[value="${CSS.escape(normalizeData(value))}"]`);
			if (!opt) {
				instance?._triggerEvent(EVENT_KEY_ERROR, { error: 'Option not found', value });
				return;
			}

			const wasSelected = opt.selected;
			const selectedText = opt.textContent.trim();

			if (select.multiple) {
				opt.selected = data?.selected === false ? false : true;
			} else {
				[...select.options].forEach(o => o.selected = false);
				opt.selected = true;
				select.value = opt.value;
			}

			this.updateUI(select);

			const e = new Event('change', { bubbles: true, cancelable: true });
			select.dispatchEvent(e);

			if (!wasSelected) {
				EventHandler.trigger(select, EVENT_KEY_CHANGE, { data });
				instance?._triggerEvent(EVENT_KEY_SELECT, { value, text: selectedText, data });
				instance?._callCallback('onSelect', { value, text: selectedText, data });
			}
		} finally {
			select.removeAttribute('data-updating');
		}
	}

	/**
	 * Программно устанавливает выбор <select> по индексу option (надёжно даже при пустом/отсутствующем value)
	 * @param {HTMLSelectElement} select
	 * @param {number} index
	 * @param {Object} [data]
	 */
	static changeSelectorByIndex(select, index, data = {}) {
		const container = select.nextElementSibling;
		const instance = container ? VGSelect.getInstance(container) : null;

		select.setAttribute('data-updating', 'true');
		try {
			const opt = Number.isInteger(index) ? select.options[index] : null;
			if (!opt) {
				instance?._triggerEvent(EVENT_KEY_ERROR, { error: 'Option not found by index', index });
				return;
			}

			const wasSelected = opt.selected;
			const selectedText = opt.textContent.trim();
			const value = opt.value;

			if (select.multiple) {
				opt.selected = data?.selected === false ? false : true;
			} else {
				[...select.options].forEach(o => o.selected = false);
				opt.selected = true;
				select.value = opt.value;
			}

			this.updateUI(select);

			const e = new Event('change', { bubbles: true, cancelable: true });
			select.dispatchEvent(e);

			if (!wasSelected) {
				EventHandler.trigger(select, EVENT_KEY_CHANGE, { data });
				instance?._triggerEvent(EVENT_KEY_SELECT, { value, text: selectedText, data });
				instance?._callCallback('onSelect', { value, text: selectedText, data });
			}
		} finally {
			select.removeAttribute('data-updating');
		}
	}

	/**
	 * Вызывает кастомное событие
	 * @param {string} eventName - Имя события
	 * @param {Object} [detail] - Данные события
	 * @private
	 */
	_triggerEvent(eventName, detail = {}) {
		EventHandler.trigger(this._element, eventName, detail);
	}

	/**
	 * Выполняет пользовательский коллбэк
	 * @param {string} name - Имя коллбэка
	 * @param {*} [arg] - Аргумент
	 * @private
	 */
	_callCallback(name, arg = null) {
		const callback = this._params[name];
		if (typeof callback === 'function') {
			callback.call(this, this._element, arg);
		}
	}

	/**
	 * Инициализирует или пересоздаёт компонент
	 * @param {HTMLSelectElement} element - <select>
	 * @param {Object} [params] - Параметры
	 * @param {boolean} [isRebuild=false] - Пересоздать
	 */
	static init(element, params = {}, isRebuild = false) {
		this.build(element, isRebuild, params);
	}

	/**
	 * Закрывает все открытые выпадающие списки при клике вне
	 * @param {MouseEvent} event
	 */
	static clearDrops(event) {
		const open = Selectors.find(`.${CLASS_NAME_CONTAINER}.${CLASS_NAME_SHOW}`);
		if (!open) return;

		const targetIsToggle = event.target.closest(SELECTOR_DATA_TOGGLE);
		if (targetIsToggle && targetIsToggle.closest(`.${CLASS_NAME_CONTAINER}`) === open) {
			return;
		}

		const targetInDropdown = event.composedPath().some(el =>
			el.classList?.contains(CLASS_NAME_DROPDOWN)
		);
		if (targetInDropdown) {
			return;
		}

		const instance = VGSelect.getInstance(open);
		if (instance) {
			instance._completeHide({ relatedTarget: event.target });
		}
	}

	/**
	 * Инициализирует кнопку "Загрузить ещё"
	 * @private
	 */
	_initLoadMoreButton() {
		if (!this._params.search?.pagination || !this._params.search.remote) return;

		const list = this._element.querySelector(SELECTOR_LIST);
		if (!list) return;

		const btn = document.createElement('li');
		btn.className = CLASS_NAME_LOAD_MORE;
		btn.style.textAlign = 'center';
		btn.style.padding = '8px';
		btn.style.cursor = 'pointer';
		btn.style.color = '#007bff';
		btn.style.fontSize = '14px';
		btn.style.fontWeight = '500';
		btn.textContent = this._params.search.loadMoreText;

		btn.addEventListener('click', () => {
			if (!this._loading && (this._totalPages === null || this._currentPage < this._totalPages)) {
				this._loadNextPage();
			}
		});

		list.appendChild(btn);
		this._hideLoadMoreButton(true); // скрыта до первого запроса
	}

	/**
	 * Показывает или скрывает кнопку "Загрузить ещё"
	 * @param {boolean} hide
	 * @private
	 */
	_hideLoadMoreButton(hide) {
		const btn = this._element.querySelector(SELECTOR_LOAD_MORE_BTN);
		if (btn) {
			btn.style.display = hide ? 'none' : 'block';
		}
	}

	/**
	 * Показывает или скрывает индикатор загрузки
	 * @param {boolean} show
	 * @private
	 */
	_showLoading(show) {
		const list = this._element.querySelector(SELECTOR_LIST);
		let loader = list.querySelector(`.${CLASS_NAME_LOADING}`);
		if (show && !loader) {
			loader = document.createElement('li');
			loader.className = CLASS_NAME_LOADING;
			loader.style.textAlign = 'center';
			loader.style.padding = '8px';
			loader.textContent = lang_messages(this._params.lang, NAME)['loading'];
			list.appendChild(loader);
		} else if (!show && loader) {
			loader.remove();
		}
	}

	/**
	 * Загружает следующую страницу данных по клику
	 * @private
	 */
	async _loadNextPage() {
		const { route, pageParam = 'page', termParam = 'q', perpage = 20 } = this._params.search;
		const nextPage = this._currentPage + 1;

		const url = new URL(route, window.location.origin);
		url.searchParams.set(termParam, this._searchTerm);
		url.searchParams.set(pageParam, nextPage);
		url.searchParams.set('per_page', perpage);

		this._loading = true;
		this._showLoading(true);
		this._hideLoadMoreButton(true);

		try {
			const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
			const data = await res.json();

			if (Array.isArray(data.results)) {
				VGSelect.addOptions(this._element.previousElementSibling, data, { preserve: true });
				this._currentPage = data.pagination?.current_page || nextPage;
				this._totalPages = data.pagination?.total_pages || null;

				// Показать кнопку снова, если есть следующая страница
				if (this._totalPages === null || this._currentPage < this._totalPages) {
					this._hideLoadMoreButton(false);
				}

				this._callCallback('onLoadNext', { page: this._currentPage, data });
				this._triggerEvent(EVENT_KEY_LOAD_NEXT, { page: this._currentPage, term: this._searchTerm });
			}
		} catch (err) {
			console.error('VGSelect: Failed to load next page', err);
			this._triggerEvent(EVENT_KEY_ERROR, { error: 'Pagination fetch failed', term: this._searchTerm });
			this._hideLoadMoreButton(false); // оставить кнопку при ошибке
		} finally {
			this._showLoading(false);
			this._loading = false;
		}
	}

	/**
	 * Выполняет удалённый запрос для поиска
	 * @param {string} term - Поисковый запрос
	 * @private
	 */
	_fetchRemoteData(term) {
		const { route, method = 'GET', pageParam = 'page', termParam = 'q', perpage = 20 } = this._params.search;
		const url = new URL(route, window.location.origin);
		url.searchParams.set(termParam, term);
		url.searchParams.set(pageParam, 1);
		url.searchParams.set('per_page', perpage);

		const searchInput = this._element.querySelector(SELECTOR_SEARCH_INPUT);
		const wasOpen = this._isShown();

		// Обновляем текущее "желательное" состояние
		this._searchTerm = term;
		this._currentPage = 1;
		this._totalPages = null;

		// Отменяем предыдущий запрос (если ещё летит)
		if (this._remoteSearchAbortController) {
			this._remoteSearchAbortController.abort();
		}
		this._remoteSearchAbortController = new AbortController();

		// Метим этот запрос как "последний"
		const requestId = ++this._remoteSearchRequestId;
		const signal = this._remoteSearchAbortController.signal;

		this._showLoading(true);
		this._hideLoadMoreButton(true);

		fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			signal
		})
			.then(res => res.json())
			.then(data => {
				// Если прилетел не самый свежий ответ — игнорируем
				if (requestId !== this._remoteSearchRequestId) return;

				// Если пользователь уже ввёл другой текст — тоже игнорируем
				const liveTerm = searchInput ? searchInput.value.trim() : '';
				if (liveTerm !== term) return;

				const select = this._element.previousElementSibling;
				if (!select) return;

				// Очистка старых опций
				[...select.querySelectorAll('option')].forEach(opt => {
					// Оставляем первый пустой скрытый placeholder:
					// <option value="" selected hidden></option>
					const isFirst = opt === select.options[0];
					const isEmptyValue = (opt.getAttribute('value') ?? '') === '';
					const isEmptyText = (opt.textContent || '').trim() === '';
					const isHidden = opt.hidden === true || opt.hasAttribute('hidden');
					const isSelectedAttr = opt.hasAttribute('selected');

					if (isFirst && isEmptyValue && isEmptyText && isHidden && isSelectedAttr) {
						return;
					}

					if (!opt.hasAttribute('data-preserve') && !opt.closest('optgroup[data-preserve]')) {
						opt.remove();
					}
				});

				VGSelect.addOptions(select, data, { preserve: true });

				this._callCallback('onSearch', { term, data });
				this._triggerEvent(EVENT_KEY_REBUILD, { term, data });

				if (data.pagination) {
					this._currentPage = data.pagination.current_page || 1;
					this._totalPages = data.pagination.total_pages || null;
				}

				// Показать кнопку "Загрузить ещё", если есть следующая страница
				if (this._totalPages === null || this._currentPage < this._totalPages) {
					this._hideLoadMoreButton(false);
				}

				// Важно: НЕ перетираем searchInput.value "term"-ом — это и вызывает глюк при гонках.
				if (wasOpen && searchInput) {
					searchInput.focus();
					this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_ACTIVE);
				}
			})
			.catch(err => {
				// Abort — нормальная ситуация при быстром вводе
				if (err && (err.name === 'AbortError')) return;

				console.error('VGSelect: Remote search error', err);
				this._triggerEvent(EVENT_KEY_ERROR, { error: 'Search request failed', term });
				this._hideLoadMoreButton(false);
			})
			.finally(() => {
				// Лоадер убираем только для последнего актуального запроса
				if (requestId === this._remoteSearchRequestId) {
					this._showLoading(false);
				}
			});
	}

	/**
	 * Добавляет опции в <select> и обновляет UI
	 * @param {HTMLSelectElement} select - Исходный <select>
	 * @param {Array|Object} data - Данные (массив или { results: [...] })
	 * @param {Object} [options] - Опции
	 * @param {boolean} [options.preserve] - Сохранить существующие опции
	 */
	static addOptions(select, data, options = {}) {
		const { preserve = false } = options;
		const container = select.nextElementSibling;
		const isRebuild = container && container.classList.contains(CLASS_NAME_CONTAINER);
		const instance = isRebuild ? VGSelect.getInstance(container) : null;

		let optionsData = data;
		if (data && data.results && Array.isArray(data.results)) {
			optionsData = data.results;
		}

		if (!Array.isArray(optionsData)) {
			instance?._triggerEvent(EVENT_KEY_ERROR, { error: 'Invalid data format: expected array' });
			return;
		}
		const treeEnabled = this._isTreeEnabled(select, instance?._params || {});

		if (!preserve) {
			// Удаление только не помеченных как data-preserve
			[...select.querySelectorAll('option')].forEach(option => {
				const parentOptGroup = option.closest('optgroup');
				if (option.value === '') return;
				if (option.hasAttribute('data-preserve')) return;
				if (parentOptGroup && parentOptGroup.hasAttribute('data-preserve')) return;
				option.remove();
			});

			[...select.querySelectorAll('optgroup')].forEach(og => {
				if (og.children.length === 0 && !og.hasAttribute('data-preserve')) {
					og.remove();
				}
			});
		}

		const appendOption = (item, parent, level = null) => {
			const option = document.createElement('option');
			const hasChildren = Array.isArray(item.children) && item.children.length > 0;

			option.value = item.id || '';
			option.textContent = item.text || '';
			if (item.selected) option.selected = true;
			if (item.disabled) option.disabled = true;
			if (treeEnabled && Number.isInteger(level)) {
				option.setAttribute('data-level', String(level));
				if (hasChildren && !option.value) {
					option.disabled = true;
				}
			}

			const dataAttrs = Object.keys(item).filter(k => !['id', 'text', 'selected', 'disabled', 'children'].includes(k));
			dataAttrs.forEach(key => {
				option.setAttribute(`data-${key}`, item[key]);
			});

			parent.appendChild(option);
		};

		const appendTreeOptions = (items, parent, level = 0) => {
			items.forEach(item => {
				appendOption(item, parent, level);
				if (Array.isArray(item.children) && item.children.length > 0) {
					appendTreeOptions(item.children, parent, level + 1);
				}
			});
		};

		if (treeEnabled) {
			appendTreeOptions(optionsData, select, 0);
		} else {
			optionsData.forEach(item => {
				if (item.children && Array.isArray(item.children)) {
					const optgroup = document.createElement('optgroup');
					optgroup.label = item.text || '';
					if (item.disabled) optgroup.disabled = true;

					item.children.forEach(child => appendOption(child, optgroup));

					select.appendChild(optgroup);
				} else {
					appendOption(item, select);
				}
			});
		}

		if (isRebuild) {
			const drop = container.querySelector(`.${CLASS_NAME_DROPDOWN}`);
			VGSelect.buildListOptions(select, drop, instance?._params || {});
			instance?._syncSearch();
			instance?._triggerEvent(EVENT_KEY_REBUILD);
		} else {
			this.updateUI(select);
		}
	}

	/**
	 * Фильтрует опции локально по введённому тексту
	 * @param {string} term - Поисковый запрос
	 * @private
	 */
	_filterLocalOptions(term) {
		const list = this._drop.querySelector(`.${CLASS_NAME_LIST}`);
		const options = list.querySelectorAll(`.${CLASS_NAME_OPTION}`);

		if (!term) {
			options.forEach(el => el.hidden = false);
			return;
		}

		term = term.toLowerCase();
		options.forEach(el => {
			const text = el.textContent.toLowerCase();
			el.hidden = !text.includes(term);
		});
	}
}

_handlersVGSelect();

export default VGSelect;
