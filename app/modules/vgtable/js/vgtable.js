/**
 * Описание: основной модуль базовых таблиц VGTable.
 * Возможности: i18n, wrapper/container, состояния и URL state, local/remote, sticky, управление колонками и строками, сортировка, дерево, пагинация, выбор и panning.
 */
import BaseModule from "../../base-module";
import {mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import _sorting from "./_sorting.js";
import _panning from "./_panning.js";
import _selection from "./_selection.js";
import _pagination from "./_pagination.js";
import _expandable from "./_expandable.js";
import _stickyHeader from "./_sticky-header.js";
import _fixedColumns from "./_fixed-columns.js";
import _columns from "./_columns.js";
import _rowReorder from "./_row-reorder.js";
import _remote from "./_remote.js";
import _filters from "./_filters.js";
import _search from "./_search.js";
import _skeleton from "./_skeleton.js";
import _states from "./_states.js";
import _urlState from "./_url-state.js";
import {normalizeLocale, resolveDictionary} from "./_i18n.js";
import {getParamsGroup, registerParamsGroup, unregisterParamsGroup} from "./_params-groups.js";
import {
	DEFAULT_OPTIONS,
	GENERATED_TABLE_CONTAINER_ATTRIBUTE,
	GENERATED_WRAPPER_ATTRIBUTE,
	NAME,
	NAME_KEY,
	SELECTOR_DATA_TOGGLE,
	TABLE_CONTAINER_SELECTOR,
	WRAPPER_SELECTOR,
} from "./_options.js";

const FILTER_HIDDEN_ATTRIBUTE = 'data-vg-table-filter-hidden';
const NOT_SPLITTER_CLASS = 'not-splitter';

class VGTable extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);
		const paramsGroup = getParamsGroup(element?.getAttribute?.('data-group-params')) || {};
		const locale = normalizeLocale(params.locale || paramsGroup.locale || element?.getAttribute?.('data-locale') || DEFAULT_OPTIONS.locale);
		const dictionaries = mergeDeepObject({}, paramsGroup.i18n || {}, params.i18n || {});
		this._dictionary = resolveDictionary(locale, dictionaries);
		this._params = this._getParams(element, mergeDeepObject(DEFAULT_OPTIONS, this._dictionary, paramsGroup, params, {locale, i18n: dictionaries}));
		this._params.locale = normalizeLocale(this._params.locale);
		this._normalizeSortDataOptions();
		this._normalizeRequestDataOptions();
		this._normalizePaginationDataOptions();
		this._normalizeSearchDataOptions();
		this._normalizeFiltersDataOptions();
		this._normalizeStateDataOptions();
		this._normalizeUrlStateDataOptions();
		this._normalizeLoadingDataOptions();
		this._normalizeExpandableDataOptions();
		this._normalizeStickyHeaderDataOptions();
		this._normalizeFixedColumnsDataOptions();
		this._normalizeColumnsDataOptions();
		this._normalizeRowReorderDataOptions();
		this._sorting = null;
		this._panning = null;
		this._selection = null;
		this._expandable = null;
		this._pagination = null;
		this._filters = null;
		this._search = null;
		this._skeleton = null;
		this._states = null;
		this._urlState = null;
		this._applyingUrlState = false;
		this._filtersState = {filters: {}, params: {}, fields: [], meta: {count: 0}};
		this._filterParamKeys = new Set();
		this._searchState = {value: '', param: 'q'};
		this._searchParamKey = '';
		this._stickyHeader = null;
		this._fixedColumns = null;
		this._columns = null;
		this._rowReorder = null;
		this._remote = null;
		this._autoNotSplitterHeaders = new Set();
		this._emptyHeaderSortOptions = new Map();
		this._emptyHeaderSplittersSynced = false;
		this._isRemote = Boolean(String(this._params.request.route || '').trim());
		this._complex = false;
		this._wrapper = null;
		this._ownsWrapper = false;
		this._tableContainer = null;
		this._ownsTableContainer = false;
		this._boundPaginationRefresh = this._refreshPagination.bind(this);
		this._boundLocalSortChange = this._handleLocalSortChange.bind(this);
		this._boundRemoteSortChange = this._handleRemoteSortChange.bind(this);
	}

	static get NAME() { return NAME; }

	static get NAME_KEY() { return NAME_KEY; }

	/** Регистрирует общую конфигурацию, подключаемую через data-group-params. */
	static registerParamsGroup(name, params = {}) { return registerParamsGroup(name, params); }

	/** Удаляет зарегистрированную группу параметров. */
	static unregisterParamsGroup(name) { return unregisterParamsGroup(name); }

	/** Возвращает зарегистрированную группу параметров. */
	static getParamsGroup(name) { return getParamsGroup(name); }

	/**
	 * Инициализация таблицы
	 * @returns {VGTable}
	 */
	init() {
		this._ensureWrapper();
		this._ensureTableContainer();
		this._syncComplexState();
		this._syncEmptyHeaderSplitters();

		// Включаем нативный sticky-заголовок без клонирования DOM
		if (!this._stickyHeader && this._params.stickyHeader.enabled === true) {
			this._stickyHeader = new _stickyHeader(this._element, this._wrapper, this._tableContainer, this._params.stickyHeader);
			this._stickyHeader.init();
		}

		if (!this._complex && !this._columns && this._hasColumnsFeatures()) {
			this._columns = new _columns(this._element, this._wrapper, {
				resize: this._params.columnResize,
				reorder: this._params.columnReorder,
				visibility: this._params.columnVisibility,
			}, {
				getHeaderTable: () => this._stickyHeader?.getHeaderTable?.() || this._element,
				isFixed: (field) => this._isFixedColumnField(field),
				refreshLayout: (structure = false) => this._refreshColumnsLayout(structure),
			});
			this._columns.init();
		}

		if (!this._complex && !this._rowReorder && this._params.rowReorder.enabled === true) {
			this._rowReorder = new _rowReorder(this._element, this._wrapper, this._params.rowReorder, {
				refreshLayout: () => this._refreshRowsLayout(),
			});
			this._rowReorder.init();
		}

		// Включаем сортировку
		if (!this._complex && !this._sorting && this._params.sort.enabled === true && this._params.rowReorder.enabled !== true) {
			this._sorting = new _sorting(this._element, Object.assign({}, this._params.sort, {remote: this._isRemote}), this._stickyHeader?.getHeaderTable());
			this._sorting.init();
			this._element.addEventListener(
				'sortchange.vg.table',
				this._isRemote ? this._boundRemoteSortChange : this._boundLocalSortChange
			);
		}
		this._stickyHeader?.refreshIntrinsicMinimums?.();

		// Фиксируем настоящие ячейки через native sticky, включая отдельный слой Fixed Header
		if (!this._complex && !this._fixedColumns && this._params.fixedColumns.enabled === true) {
			this._fixedColumns = new _fixedColumns(
				this._element,
				this._wrapper,
				this._params.fixedColumns,
				this._stickyHeader
			);
			this._fixedColumns.init();
		}

		// Включаем перемещение
		if (!this._panning && this._params.pan.enabled === true) {
			this._panning = new _panning(this._element, {
				onMove: () => {
					this._stickyHeader?.syncScroll?.();
					this._fixedColumns?.syncScroll?.();
				},
			});
			this._panning.init();
		}

		// Включаем выбор строк
		if (!this._selection && this._params.selection.enabled === true) {
			this._selection = new _selection(this._element, this._params.selection);
			this._selection.init();
		}

		// Включаем многоуровневые сворачиваемые строки
		if (!this._expandable && this._params.expandable.enabled === true) {
			this._expandable = new _expandable(this._element, this._params.expandable);
			this._expandable.init();
		}

		// Включаем локальную или серверную пагинацию
		if (!this._pagination && this._params.pagination.enabled === true) {
			this._pagination = new _pagination(this._element, Object.assign({}, this._params.pagination, {
				remote: this._isRemote,
				onChange: (state) => this._handlePaginationChange(state),
			}));
			this._pagination.init();
		}

		// Подключаем внешнюю форму фильтров до первого remote-запроса.
		if (!this._filters && this._params.filters.enabled === true) {
			this._filters = new _filters(this._element, this._params.filters, (state) => this._handleFiltersChange(state));
			this._filters.init();
			this._filtersState = this._filters.getState();
			this._filterParamKeys = new Set(Object.keys(this._filtersState.params || {}));
			if (!this._isRemote) this._applyLocalFilters(this._filtersState);
		}

		// Подключаем отдельное поле поиска до первого remote-запроса.
		if (!this._search && this._params.search.enabled === true) {
			this._search = new _search(this._element, this._params.search, (state) => this._handleSearchChange(state));
			this._search.init();
			this._searchState = this._search.getState();
			this._searchParamKey = this._searchState.param;
			if (!this._isRemote) this._applyLocalFilters(this._filtersState);
		}

		if (!this._states && this._params.state.enabled === true) {
			this._states = new _states(this._element, this._wrapper, this._params.state, {
				remote: this._isRemote,
				getHeaderTable: () => this._stickyHeader?.getHeaderTable() || this._element,
				reset: () => this._resetQueryControls(),
			});
			this._states.init();
			if (!this._isRemote) this._states.syncLocal(this._hasActiveQuery());
		}

		if (!this._urlState && this._params.urlState.enabled === true) {
			this._urlState = new _urlState(this._element, this._params.urlState, {
				getFilterFields: () => this._filters?.getFields?.() || [],
				apply: (state, options) => this._applyUrlState(state, options),
			});
			this._urlState.init();
			if (this._params.urlState.read !== false) {
				this._applyUrlState(this._urlState.read('init'), {source: 'init', clearMissing: false});
			}
		}

		if (!this._remote && this._isRemote) {
			this._skeleton = new _skeleton(this._element, this._params.loading, {
				getPagination: () => this._pagination?.getState() || null,
				getHeaderTable: () => this._stickyHeader?.getHeaderTable() || this._element,
				getScrollHost: () => this._stickyHeader?.getBody() || this._tableContainer,
				afterRender: () => {
					this._columns?.refresh?.();
					this._stickyHeader?.refresh?.();
					this._fixedColumns?.refresh?.();
				},
			});
			this._remote = new _remote(this._element, Object.assign({}, this._params.request, {labels: this._dictionary.remote || {}}), {
				request: (options) => this._route(options),
				buildUrl: (params, endpoint, options) => this._buildRouteUrl(params, endpoint, options),
				getPagination: () => this._pagination?.getState() || {
					page: this._params.pagination.page,
					perPage: this._params.pagination.per,
				},
				getSort: () => this._sorting?.getSortState?.() || this._sorting?.getSort() || null,
				getHeaderTable: () => this._stickyHeader?.getHeaderTable() || this._element,
				applyMeta: (meta) => this._pagination?.setMeta(meta),
				afterRender: (detail) => this._afterRemoteRender(detail),
				renderLoading: () => this._skeleton?.render(),
				renderEmpty: () => this._states?.render(this._hasActiveQuery() ? 'filtered-empty' : 'empty'),
				renderError: () => this._states?.render('error'),
				getLoadingMinDelay: () => this._params.loading.minDelay,
			});
			const initialParams = Object.assign({}, this._filtersState.params || {});
			if (this._searchState.value) initialParams[this._searchState.param] = this._searchState.value;
			if (Object.keys(initialParams).length) this._remote.setParams(initialParams);
			this._remote.init();
		}

		return this;
	}

	/** Возвращает признак загрузки строк с сервера. */
	isRemote() {
		return this._isRemote;
	}

	/**
	 * Возвращает признак неоднородной сетки, для которой сортировка отключена.
	 * @returns {boolean}
	 */
	isComplex() {
		return this._complex;
	}

	/** Активная локаль и переключение встроенных подписей без пересоздания таблицы. */
	getLocale() {
		return this._params.locale;
	}

	setLocale(locale) {
		const normalized = normalizeLocale(locale);
		this._dictionary = resolveDictionary(normalized, this._params.i18n || {});
		this._params.locale = normalized;
		this._mergeLocale(this._params, this._dictionary);
		this._normalizePaginationDataOptions();
		this._normalizeStateDataOptions();
		this._normalizeExpandableDataOptions();
		this._normalizeColumnsDataOptions();
		this._normalizeRowReorderDataOptions();
		if (this._remote) this._remote._options.labels = this._dictionary.remote || {};
		this._pagination?.refresh?.();
		this._expandable?.refresh?.();
		this._columns?.refresh?.();
		this._rowReorder?.refresh?.();
		const state = this._states?.getState?.();
		if (state) this._states.render(state.type);
		EventHandler.trigger(this._element, 'localechange.vg.table', {locale: normalized});
		return normalized;
	}

	_mergeLocale(target, source) {
		if (!target || !source || typeof source !== 'object') return target;
		Object.entries(source).forEach(([key, value]) => {
			if (value && typeof value === 'object' && !Array.isArray(value)) {
				if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {};
				this._mergeLocale(target[key], value);
			} else target[key] = value;
		});
		return target;
	}

	/** Подготовка мультисортировки и совместимых Data API aliases. */
	_normalizeSortDataOptions() {
		const sort = this._params.sort;
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const multiple = this._element.getAttribute('data-sort-multiple') ?? this._element.getAttribute('data-sort-multi');
		const withShift = this._element.getAttribute('data-sort-multiple-with-shift') ?? this._element.getAttribute('data-sort-multi-with-shift');
		if (multiple !== null) sort.multiple = boolean(multiple);
		if (withShift !== null) sort.multipleWithShift = boolean(withShift);
	}

	/** Подготовка resize/reorder/visibility из Data API. */
	_normalizeColumnsDataOptions() {
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback, minimum) => {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) && parsed >= minimum ? parsed : fallback;
		};
		const groups = [
			['columnResize', 'column-resize'],
			['columnReorder', 'column-reorder'],
			['columnVisibility', 'column-visibility'],
		];
		groups.forEach(([key, prefix]) => {
			const group = this._params[key];
			if (Object.prototype.hasOwnProperty.call(group, 'enable')) group.enabled = boolean(group.enable);
			const enabled = this._element.getAttribute(`data-${prefix}-enable`) ?? this._element.getAttribute(`data-${prefix}-enabled`);
			if (enabled !== null) group.enabled = boolean(enabled);
			const persist = this._element.getAttribute(`data-${prefix}-persist`);
			if (persist !== null) group.persist = boolean(persist);
			const storageKey = this._element.getAttribute(`data-${prefix}-storage-key`);
			if (storageKey !== null) group.storageKey = storageKey;
		});
		const resize = this._params.columnResize;
		resize.minWidth = number(this._element.getAttribute('data-column-resize-min-width') ?? resize.minWidth, 80, 40);
		resize.maxWidth = number(this._element.getAttribute('data-column-resize-max-width') ?? resize.maxWidth, 600, resize.minWidth);
		resize.maxWidth = Math.max(resize.minWidth, resize.maxWidth);
		const visibility = this._params.columnVisibility;
		const controls = this._element.getAttribute('data-column-visibility-controls');
		if (controls !== null) visibility.controls = controls;
		visibility.minVisible = number(this._element.getAttribute('data-column-visibility-min-visible') ?? visibility.minVisible, 1, 1);
	}

	/** Подготовка самостоятельного Row Reorder из Data API. */
	_normalizeRowReorderDataOptions() {
		const options = this._params.rowReorder;
		const assign = (suffix, callback) => {
			const value = this._element.getAttribute(`data-row-reorder-${suffix}`);
			if (value !== null) callback(value);
		};
		const boolean = value => ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
		assign('enable', value => { options.enabled = boolean(value); });
		assign('enabled', value => { options.enabled = boolean(value); });
		assign('mode', value => { options.mode = String(value).toLowerCase() === 'row' ? 'row' : 'handle'; });
		assign('handle-selector', value => { options.handleSelector = String(value).trim() || options.handleSelector; });
		assign('key-attr', value => { options.keyAttr = String(value).trim() || options.keyAttr; });
		assign('persist', value => { options.persist = boolean(value); });
		assign('storage-key', value => { options.storageKey = String(value).trim(); });
	}

	_hasColumnsFeatures() {
		return this._params.columnResize.enabled === true
			|| this._params.columnReorder.enabled === true
			|| this._params.columnVisibility.enabled === true;
	}

	/**
	 * Подготовка request-параметров из Data API.
	 * @private
	 */
	_normalizeRequestDataOptions() {
		this._params.request = mergeDeepObject(
			{},
			this._params.request,
			{
				headers: Object.assign({}, this._params.request.headers),
				params: Object.assign({}, this._params.request.params),
				parammap: Object.assign({}, this._params.request.parammap),
				cache: Object.assign({}, this._params.request.cache),
				export: Object.assign({}, this._params.request.export),
			}
		);
		const request = this._params.request;
		const read = (name) => this._element.getAttribute(`data-request-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback) => {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
		};
		const object = (value, fallback) => {
			try {
				const parsed = JSON.parse(value);
				return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
			} catch (_) {
				return fallback;
			}
		};

		assign('route', (value) => { request.route = value; });
		assign('method', (value) => { request.method = value; });
		assign('credentials', (value) => { request.credentials = value; });
		assign('params', (value) => { request.params = object(value, request.params); });
		assign('parammap', (value) => { request.parammap = object(value, request.parammap); });
		assign('responsemode', (value) => { request.responsemode = value; });
		assign('datapath', (value) => { request.datapath = value; });
		assign('metapath', (value) => { request.metapath = value; });
		assign('viewpath', (value) => { request.viewpath = value; });
		assign('viewparam', (value) => { request.viewparam = value; });
		assign('viewvalue', (value) => { request.viewvalue = value; });
		assign('fieldsparam', (value) => { request.fieldsparam = value; });
		assign('cache-enable', (value) => { request.cache.enable = boolean(value); });
		assign('cache-ttl', (value) => { request.cache.ttl = number(value, request.cache.ttl); });
		assign('cache-max', (value) => { request.cache.max = number(value, request.cache.max); });
		assign('export-route', (value) => { request.export.route = value; });

		request.route = String(request.route || '').trim();
		request.method = String(request.method || 'GET').toUpperCase();
		request.credentials = String(request.credentials || 'same-origin');
		request.responsemode = ['view', 'auto'].includes(String(request.responsemode).toLowerCase())
			? String(request.responsemode).toLowerCase()
			: 'data';
	}

	/**
	 * Определяет таблицу с многострочным thead, colspan или rowspan.
	 * @private
	 */
	_syncComplexState() {
		const rows = this._isRemote
			? Array.from(this._element.tHead?.rows || [])
			: Array.from(this._element.rows || []);
		const hasSpans = rows.some((row) => Array.from(row.cells || []).some((cell) => cell.colSpan > 1 || cell.rowSpan > 1));
		this._complex = Boolean((this._element.tHead?.rows.length || 0) > 1 || hasSpans);
		this._element.classList.toggle('vg-table-complex', this._complex);
		this._element.toggleAttribute('data-vg-table-complex', this._complex);
	}

	/**
	 * Скрывает разделитель и отключает сортировку у пустых заголовочных ячеек.
	 * @private
	 */
	_syncEmptyHeaderSplitters() {
		if (this._emptyHeaderSplittersSynced) return;

		Array.from(this._element.tHead?.querySelectorAll('th') || []).forEach((header) => {
			const isEmpty = header.childElementCount === 0 && String(header.textContent || '').trim() === '';
			if (!isEmpty) return;

			if (!header.classList.contains(NOT_SPLITTER_CLASS)) {
				header.classList.add(NOT_SPLITTER_CLASS);
				this._autoNotSplitterHeaders.add(header);
			}
			if (String(header.getAttribute('data-sort-enabled')).toLowerCase() !== 'false') {
				this._emptyHeaderSortOptions.set(header, header.getAttribute('data-sort-enabled'));
				header.setAttribute('data-sort-enabled', 'false');
			}
		});
		this._emptyHeaderSplittersSynced = true;
	}

	/**
	 * Подготовка переменных для пагинации
	 * @private
	 */
	_normalizePaginationDataOptions() {
		this._params.pagination = mergeDeepObject(
			{},
			this._params.pagination,
			{
				size: Object.assign({}, this._params.pagination.size),
				quick: Object.assign({}, this._params.pagination.quick),
				persist: Object.assign({}, this._params.pagination.persist),
				storage: Object.assign({}, this._params.pagination.storage),
				labels: Object.assign({}, this._params.pagination.labels),
			}
		);
		const pagination = this._params.pagination;
		const read = (name) => this._element.getAttribute(`data-pagination-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback) => {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
		};
		const list = (value) => String(value)
			.replace(/^\[|\]$/g, '')
			.split(',')
			.map((item) => number(item.trim(), 0))
			.filter((item) => item > 0);

		assign('enable', (value) => { pagination.enabled = boolean(value); });
		assign('enabled', (value) => { pagination.enabled = boolean(value); });
		assign('per-page', (value) => { pagination.per = number(value, pagination.per); });
		assign('max-per-page', (value) => { pagination.max = number(value, pagination.max); });
		assign('ellipsis', (value) => { pagination.ellipsis = boolean(value); });
		assign('ellipsis-hover', (value) => { pagination.ellipsisHover = boolean(value); });
		assign('ellipsis-after', (value) => { pagination.threshold = number(value, pagination.threshold); });
		assign('max-visible-pages', (value) => { pagination.visible = number(value, pagination.visible); });
		assign('show-per-page', (value) => { pagination.size.enabled = boolean(value); });
		assign('show-per-page-label', (value) => { pagination.size.label = boolean(value) ? 'Строк на странице' : false; });
		assign('per-page-label', (value) => { pagination.size.label = value; });
		assign('per-page-option-suffix', (value) => { pagination.size.suffix = value; });
		assign('per-page-options', (value) => { pagination.size.options = list(value); });
		assign('quick-jump', (value) => { pagination.quick.enabled = value === 'auto' ? 'auto' : boolean(value); });
		assign('quick-jump-button-label', (value) => { pagination.quick.button = value; });
		assign('persist-page', (value) => { pagination.persist.page = boolean(value); });
		assign('persist-per-page', (value) => { pagination.persist.per = boolean(value); });
		assign('storage-key', (value) => { pagination.storage.key = value; });
		assign('scroll-to-top', (value) => { pagination.scroll = boolean(value) ? 'table' : false; });
		assign('scroll-to-window-top', (value) => { if (boolean(value)) pagination.scroll = 'window'; });
		assign('prev-label', (value) => { pagination.labels.prev = value; });
		assign('next-label', (value) => { pagination.labels.next = value; });
	}

	/**
	 * Подготовка параметров отдельного поля поиска из Data API.
	 * @private
	 */
	_normalizeSearchDataOptions() {
		this._params.search = mergeDeepObject(
			{},
			this._params.search,
			{button: Object.assign({}, this._params.search.button)}
		);
		const search = this._params.search;
		const read = (name) => this._element.getAttribute(`data-search-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback) => {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
		};
		const list = (value) => {
			if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
			try {
				const parsed = JSON.parse(value);
				if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
			} catch (_) {
				// Строка через запятую является полноценным вариантом Data API.
			}
			return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
		};

		if (Object.prototype.hasOwnProperty.call(search, 'enable')) search.enabled = boolean(search.enable);
		assign('enable', (value) => { search.enabled = boolean(value); });
		assign('enabled', (value) => { search.enabled = boolean(value); });
		assign('input', (value) => { search.input = value; });
		assign('input-selector', (value) => { search.input = value; });
		assign('param', (value) => { search.param = value; });
		assign('debounce', (value) => { search.debounce = number(value, search.debounce); });
		assign('debounce-ms', (value) => { search.debounce = number(value, search.debounce); });
		assign('reset-page', (value) => { search.resetPage = boolean(value); });
		assign('reset-page-on-change', (value) => { search.resetPage = boolean(value); });
		assign('trim', (value) => { search.trim = boolean(value); });
		assign('fields', (value) => { search.fields = list(value); });
		assign('button-reset', (value) => { search.button.reset = value; });
		search.fields = list(search.fields);
		search.param = String(search.param || 'q').trim() || 'q';
	}

	/**
	 * Подготовка параметров внешней формы фильтров из Data API.
	 * @private
	 */
	_normalizeFiltersDataOptions() {
		this._params.filters = mergeDeepObject(
			{},
			this._params.filters,
			{
				buttons: Object.assign({}, this._params.filters.buttons),
			}
		);
		const filters = this._params.filters;
		const read = (name) => this._element.getAttribute(`data-filters-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback) => {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
		};

		if (Object.prototype.hasOwnProperty.call(filters, 'enable')) filters.enabled = boolean(filters.enable);
		assign('enable', (value) => { filters.enabled = boolean(value); });
		assign('enabled', (value) => { filters.enabled = boolean(value); });
		assign('form', (value) => { filters.form = value; });
		assign('form-selector', (value) => { filters.form = value; });
		assign('debounce', (value) => { filters.debounce = number(value, filters.debounce); });
		assign('debounce-ms', (value) => { filters.debounce = number(value, filters.debounce); });
		assign('apply', (value) => { filters.apply = value; });
		assign('apply-mode', (value) => { filters.apply = value; });
		assign('reset-page', (value) => { filters.resetPage = boolean(value); });
		assign('reset-page-on-change', (value) => { filters.resetPage = boolean(value); });
		assign('skip-empty', (value) => { filters.skipEmpty = boolean(value); });
		assign('trim', (value) => { filters.trim = boolean(value); });
		assign('trim-values', (value) => { filters.trim = boolean(value); });
		assign('default-operator', (value) => { filters.defaultOperator = value; });
		assign('field-attr', (value) => { filters.fieldAttr = value; });
		assign('part-attr', (value) => { filters.partAttr = value; });
		assign('type-attr', (value) => { filters.typeAttr = value; });
		assign('value-attr', (value) => { filters.valueAttr = value; });
		assign('operator-attr', (value) => { filters.operatorAttr = value; });
		assign('button-apply', (value) => { filters.buttons.apply = value; });
		assign('button-reset', (value) => { filters.buttons.reset = value; });

		filters.apply = String(filters.apply).toLowerCase() === 'manual' ? 'manual' : 'auto';
	}

	/** Подготовка текстов и включения state-layer из Data API. */
	_normalizeStateDataOptions() {
		this._params.state = mergeDeepObject({}, this._params.state, {
			labels: Object.assign({}, this._params.state.labels),
		});
		const state = this._params.state;
		const read = (name) => this._element.getAttribute(`data-state-${name}`);
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const enabled = read('enable') ?? read('enabled');
		if (enabled !== null) state.enabled = boolean(enabled);
		['empty', 'filtered-empty', 'error', 'retry', 'reset'].forEach((key) => {
			const value = read(`${key}-label`);
			if (value !== null) state.labels[key] = value;
		});
	}

	/** Подготовка единого URL state из Data API. */
	_normalizeUrlStateDataOptions() {
		this._params.urlState = mergeDeepObject({}, this._params.urlState, {
			keys: Object.assign({}, this._params.urlState.keys),
			include: Object.assign({}, this._params.urlState.include),
		});
		const state = this._params.urlState;
		const read = (name) => this._element.getAttribute(`data-url-state-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		if (Object.prototype.hasOwnProperty.call(state, 'enable')) state.enabled = boolean(state.enable);
		assign('enable', (value) => { state.enabled = boolean(value); });
		assign('enabled', (value) => { state.enabled = boolean(value); });
		assign('read', (value) => { state.read = boolean(value); });
		assign('write', (value) => { state.write = boolean(value); });
		assign('listen', (value) => { state.listen = boolean(value); });
		assign('mode', (value) => { state.mode = value; });
		assign('prefix', (value) => { state.prefix = value; });
		assign('page-key', (value) => { state.keys.page = value; });
		assign('per-page-key', (value) => { state.keys.perPage = value; });
		assign('sort-key', (value) => { state.keys.sort = value; });
		assign('direction-key', (value) => { state.keys.direction = value; });
		assign('search-key', (value) => { state.keys.search = value; });
		assign('filter-prefix', (value) => { state.keys.filterPrefix = value; });
		assign('include-pagination', (value) => { state.include.pagination = boolean(value); });
		assign('include-sort', (value) => { state.include.sort = boolean(value); });
		assign('include-search', (value) => { state.include.search = boolean(value); });
		assign('include-filters', (value) => { state.include.filters = boolean(value); });
		state.mode = String(state.mode).toLowerCase() === 'push' ? 'push' : 'replace';
	}

	/**
	 * Подготовка параметров skeleton-загрузки из Data API.
	 * @private
	 */
	_normalizeLoadingDataOptions() {
		const loading = this._params.loading;
		const read = (name) => this._element.getAttribute(`data-loading-${name}`);
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback, minimum = 0) => {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) && parsed >= minimum ? parsed : fallback;
		};
		const enabled = read('enable') ?? read('enabled');
		if (enabled !== null) loading.enabled = boolean(enabled);
		const delay = read('min-delay');
		if (delay !== null) loading.minDelay = number(delay, loading.minDelay);
		const rows = read('skeleton') ?? read('skeleton-rows');
		if (rows !== null) loading.skeleton = number(rows, loading.skeleton, 1);
	}

	/**
	 * Подготовка параметров многоуровневых строк из Data API.
	 * @private
	 */
	_normalizeExpandableDataOptions() {
		const expandable = this._params.expandable;
		expandable.labels = Object.assign({}, expandable.labels);
		const read = (name) => this._element.getAttribute(`data-expandable-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());

		if (Object.prototype.hasOwnProperty.call(expandable, 'enable')) {
			expandable.enabled = boolean(expandable.enable);
		}
		assign('enable', (value) => { expandable.enabled = boolean(value); });
		assign('enabled', (value) => { expandable.enabled = boolean(value); });
		assign('id-attr', (value) => { expandable.idAttr = value; });
		assign('parent-attr', (value) => { expandable.parentAttr = value; });
		assign('toggle-selector', (value) => { expandable.toggleSelector = value; });
		assign('collapsed', (value) => { expandable.collapsed = boolean(value); });
		assign('expand-label', (value) => { expandable.labels.expand = value; });
		assign('collapse-label', (value) => { expandable.labels.collapse = value; });
	}

	/**
	 * Подготовка параметров sticky-заголовка из Data API и старых имён VGDynamicTable.
	 * @private
	 */
	_normalizeStickyHeaderDataOptions() {
		this._params.stickyHeader = Object.assign({}, this._params.stickyHeader);
		const sticky = this._params.stickyHeader;
		const read = (name) => this._element.getAttribute(`data-sticky-header-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());

		if (Object.prototype.hasOwnProperty.call(sticky, 'enable')) sticky.enabled = boolean(sticky.enable);
		if (Object.prototype.hasOwnProperty.call(sticky, 'max')) sticky.maxHeight = sticky.max;
		assign('enable', (value) => { sticky.enabled = boolean(value); });
		assign('enabled', (value) => { sticky.enabled = boolean(value); });
		assign('mode', (value) => { sticky.mode = value; });
		assign('top', (value) => { sticky.top = value; });
		assign('top-offset', (value) => { sticky.top = value; });
		assign('max', (value) => { sticky.maxHeight = value; });
		assign('max-height', (value) => { sticky.maxHeight = value; });
		sticky.mode = String(sticky.mode).toLowerCase() === 'page' ? 'page' : 'container';
	}

	/**
	 * Подготовка параметров фиксированных колонок из Data API.
	 * @private
	 */
	_normalizeFixedColumnsDataOptions() {
		this._params.fixedColumns = Object.assign({}, this._params.fixedColumns);
		const fixed = this._params.fixedColumns;
		const read = (name) => this._element.getAttribute(`data-fixed-columns-${name}`);
		const assign = (name, callback) => {
			const value = read(name);
			if (value !== null) callback(value);
		};
		const boolean = (value) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
		const number = (value, fallback) => {
			const parsed = Number.parseFloat(value);
			return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
		};

		let explicitEnabled = null;
		if (Object.prototype.hasOwnProperty.call(fixed, 'enable')) fixed.enabled = boolean(fixed.enable);
		const columnsAttribute = this._element.getAttribute('data-fixed-columns');
		if (columnsAttribute !== null) fixed.columns = columnsAttribute;
		assign('enable', (value) => { explicitEnabled = boolean(value); fixed.enabled = explicitEnabled; });
		assign('enabled', (value) => { explicitEnabled = boolean(value); fixed.enabled = explicitEnabled; });
		assign('mode', (value) => { fixed.mode = value; });
		assign('stack-gap', (value) => { fixed.stackGap = number(value, fixed.stackGap); });
		fixed.mode = String(fixed.mode).toLowerCase() === 'stack' ? 'stack' : 'fixed';
		fixed.stackGap = number(fixed.stackGap, 0);
		const headerHasFixed = Boolean(this._element.tHead?.querySelector('[data-fixed], [data-fixed-column]'));
		if (explicitEnabled === null && (columnsAttribute !== null || headerHasFixed || (fixed.columns && typeof fixed.columns === 'object'))) {
			fixed.enabled = true;
		}
	}

	/**
	 * Создаёт обязательную адаптивную обёртку, если её нет в разметке.
	 * @private
	 */
	_ensureWrapper() {
		const wrapper = this._element.closest(WRAPPER_SELECTOR);
		if (wrapper) {
			this._wrapper = wrapper;
			return;
		}

		const generatedWrapper = this._element.ownerDocument.createElement('div');
		generatedWrapper.className = WRAPPER_SELECTOR.slice(1);
		generatedWrapper.setAttribute(GENERATED_WRAPPER_ATTRIBUTE, '');
		this._element.before(generatedWrapper);
		generatedWrapper.append(this._element);
		this._wrapper = generatedWrapper;
		this._ownsWrapper = true;
	}

	/**
	 * Снимает только созданную модулем обёртку и возвращает таблицу на её место.
	 * @private
	 */
	_removeGeneratedWrapper() {
		if (!this._ownsWrapper || !this._wrapper) return;

		if (this._element.parentElement === this._wrapper) {
			this._wrapper.before(this._element);
		}
		if (!this._wrapper.children.length) this._wrapper.remove();
		this._wrapper = null;
		this._ownsWrapper = false;
	}

	/**
	 * Создаёт обязательный внутренний scroll-контейнер таблицы, если его нет.
	 * @private
	 */
	_ensureTableContainer() {
		const container = this._element.closest(TABLE_CONTAINER_SELECTOR);
		if (container && container.closest(WRAPPER_SELECTOR) === this._wrapper) {
			this._tableContainer = container;
			return;
		}

		const generatedContainer = this._element.ownerDocument.createElement('div');
		generatedContainer.className = TABLE_CONTAINER_SELECTOR.slice(1);
		generatedContainer.setAttribute(GENERATED_TABLE_CONTAINER_ATTRIBUTE, '');
		this._element.before(generatedContainer);
		generatedContainer.append(this._element);
		this._tableContainer = generatedContainer;
		this._ownsTableContainer = true;
	}

	/**
	 * Снимает только созданный модулем container, сохраняя пользовательскую разметку.
	 * @private
	 */
	_removeGeneratedTableContainer() {
		if (!this._ownsTableContainer || !this._tableContainer) return;

		if (this._element.parentElement === this._tableContainer) {
			this._tableContainer.before(this._element);
		}
		if (!this._tableContainer.children.length) this._tableContainer.remove();
		this._tableContainer = null;
		this._ownsTableContainer = false;
	}

	/**
	 * Сортировка
	 * @param column
	 * @param direction
	 * @returns {*|boolean|boolean}
	 */
	setSort(column, direction = 'asc') {
		const sorted = this._sorting ? this._sorting.setSort(column, direction) : false;
		if (sorted) {
			this._refreshPagination();
			this._syncUrlState();
		}
		return sorted;
	}

	setSorts(sorts = []) {
		const sorted = this._sorting ? this._sorting.setSorts(sorts) : false;
		if (sorted) {
			this._refreshPagination();
			this._syncUrlState();
		}
		return sorted;
	}

	getSort() {
		return this._sorting ? this._sorting.getSort() : null;
	}

	getSorts() {
		return this._sorting ? this._sorting.getSorts() : [];
	}

	clearSort() {
		if (this._sorting) {
			this._sorting.clearSort();
			this._refreshPagination();
			this._syncUrlState();
		}
	}

	/**
	 * Выборка строк
	 * @param row
	 * @param selected
	 * @param emit
	 * @returns {*|boolean|boolean}
	 */
	selectRow(row, selected = true, emit = true) {
		return this._selection ? this._selection.selectRow(row, selected, emit) : false;
	}

	toggleRow(row, emit = true) {
		return this._selection ? this._selection.toggleRow(row, emit) : false;
	}

	getSelectedRows() {
		return this._selection ? this._selection.getSelectedRows() : [];
	}

	clearSelection(emit = true) {
		return this._selection ? this._selection.clearSelection(emit) : false;
	}

	/**
	 * Многоуровневые строки
	 */
	toggleExpanded(row, expanded = null, emit = false) {
		return this._expandable ? this._expandable.toggle(row, expanded, emit) : false;
	}

	expandRow(row, emit = false) {
		return this._expandable ? this._expandable.expand(row, emit) : false;
	}

	collapseRow(row, emit = false) {
		return this._expandable ? this._expandable.collapse(row, emit) : false;
	}

	getExpandable() {
		return this._expandable ? this._expandable.getState() : null;
	}

	refreshExpandable() {
		return this._expandable ? this._expandable.refresh() : null;
	}

	/**
	 * Пагинация
	 */
	setPage(page, emit = false) {
		return this._pagination ? this._pagination.setPage(page, emit) : false;
	}

	setPerPage(perPage, emit = false) {
		return this._pagination ? this._pagination.setPerPage(perPage, emit) : false;
	}

	getPagination() {
		return this._pagination ? this._pagination.getState() : null;
	}

	refreshPagination(resetPage = false) {
		return this._pagination ? this._pagination.refresh(resetPage) : null;
	}

	/** Фильтры. */
	getFilters() {
		return this._filters ? this._filters.getState() : null;
	}

	setFilters(values = {}, emit = true) {
		return this._filters ? this._filters.setValues(values, {emit, source: 'api'}) : null;
	}

	resetFilters(emit = true) {
		return this._filters ? this._filters.reset({emit, source: 'api-reset'}) : null;
	}

	refreshFilters() {
		return this._filters ? this._filters.refresh() : null;
	}

	/** Поиск. */
	getSearch() {
		return this._search ? this._search.getState() : null;
	}

	setSearch(value, emit = true) {
		return this._search ? this._search.setValue(value, {emit, source: 'api'}) : null;
	}

	resetSearch(emit = true) {
		return this._search ? this._search.reset({emit, source: 'api-reset'}) : null;
	}

	refreshSearch() {
		return this._search ? this._search.refresh() : null;
	}

	/** Состояния таблицы. */
	getTableState() {
		return this._states?.getState() || null;
	}

	showTableState(type, message = '') {
		return this._states?.render(type, message) || null;
	}

	clearTableState() {
		return this._states?.clear() || null;
	}

	/** Общее состояние query string. */
	getUrlState() {
		return this._urlState?.getState() || null;
	}

	refreshUrlState() {
		return this._urlState ? this._applyUrlState(this._urlState.read('api'), {source: 'api', clearMissing: true}) : null;
	}

	/**
	 * Remote data
	 */
	reload(options = {}) {
		return this._remote ? this._remote.reload(options) : Promise.resolve(null);
	}

	setRequestParams(params = {}, reload = true, replace = false) {
		if (!this._remote) return null;
		const next = this._remote.setParams(params, replace);
		if (reload) this._remote.reload({page: 1, source: 'params'});
		return next;
	}

	getRequestState() {
		return this._remote ? this._remote.getState() : null;
	}

	clearRequestCache() {
		this._remote?.clearCache();
	}

	exportRemote(format = 'csv', options = {}) {
		return this._remote ? this._remote.export(format, options) : '';
	}

	refreshStickyHeader() {
		return this._stickyHeader ? this._stickyHeader.refresh() : null;
	}

	refreshFixedColumns() {
		return this._fixedColumns ? this._fixedColumns.refresh() : null;
	}

	getFixedColumns() {
		return this._fixedColumns ? this._fixedColumns.getState() : null;
	}

	/** Управление шириной, порядком и видимостью колонок. */
	getColumns() {
		return this._columns ? this._columns.getState() : null;
	}

	setColumnWidth(column, width, emit = true) {
		return this._columns ? this._columns.setWidth(column, width, emit) : false;
	}

	moveColumn(column, target, emit = true) {
		return this._columns ? this._columns.move(column, target, emit) : false;
	}

	setColumnVisible(column, visible = true, emit = true) {
		return this._columns ? this._columns.setVisible(column, visible, emit) : false;
	}

	resetColumns(emit = true) {
		return this._columns ? this._columns.reset(emit) : null;
	}

	refreshColumns() {
		const state = this._columns?.refresh?.() || null;
		this._refreshColumnsLayout(true);
		return state;
	}

	/** Самостоятельное управление порядком строк. */
	getRowOrder() {
		return this._rowReorder ? this._rowReorder.getState().order : [];
	}

	moveRow(row, target, position = 'before', emit = true) {
		return this._rowReorder ? this._rowReorder.move(row, target, position, emit) : false;
	}

	resetRows(emit = true) {
		return this._rowReorder ? this._rowReorder.reset(emit) : null;
	}

	refreshRowReorder() {
		return this._rowReorder ? this._rowReorder.refresh() : null;
	}

	_refreshPagination() {
		if (this._pagination) this._pagination.refresh();
		if (this._expandable) this._expandable.refresh();
	}

	_isFixedColumnField(field) {
		const normalized = String(field || '').trim();
		if (!normalized) return false;
		const headerTable = this._stickyHeader?.getHeaderTable?.() || this._element;
		const header = Array.from(headerTable.tHead?.querySelectorAll('th') || [])
			.find((cell) => String(cell.getAttribute('data-field') || '').trim() === normalized);
		if (['left', 'right'].includes(String(header?.getAttribute('data-fixed') || header?.getAttribute('data-fixed-column') || '').toLowerCase())) return true;
		const configured = this._params.fixedColumns.columns;
		if (configured && typeof configured === 'object' && !Array.isArray(configured)) {
			return ['left', 'right'].some((side) => {
				const values = Array.isArray(configured[side]) ? configured[side] : String(configured[side] || '').split(',');
				return values.map((value) => String(value).trim()).includes(normalized);
			});
		}
		return String(configured || '').split(';').some((group) => {
			const [, values = ''] = group.split(':');
			return values.split(',').map((value) => value.trim()).includes(normalized);
		});
	}

	_refreshColumnsLayout(structure = false) {
		this._sorting?.refresh?.(structure);
		this._stickyHeader?.refreshIntrinsicMinimums?.();
		this._fixedColumns?.refresh?.();
	}

	_refreshRowsLayout() {
		this._pagination?.refresh?.(false);
		this._expandable?.refresh?.();
		this._stickyHeader?.refresh?.();
		this._fixedColumns?.refresh?.();
	}

	_handleFiltersChange(state) {
		this._filtersState = state && typeof state === 'object'
			? state
			: {filters: {}, params: {}, fields: [], meta: {count: 0}};
		const fullReset = ['reset', 'api-reset'].includes(String(this._filtersState.source || ''));
		if (fullReset && this._search) {
			this._search.reset({emit: false, source: 'filters-reset'});
			this._searchState = this._search.getState();
		}
		if (!this._isRemote) {
			this._applyLocalFilters(this._filtersState);
			this._syncUrlState();
			return;
		}

		const params = this._filtersState.params || {};
		const patch = {};
		this._filterParamKeys.forEach((key) => { patch[key] = ''; });
		if (fullReset && this._searchParamKey) patch[this._searchParamKey] = '';
		Object.assign(patch, params);
		this._filterParamKeys = new Set(Object.keys(params));
		this._remote?.setParams(patch);
		this._syncUrlState();
		const pagination = this._pagination?.getState();
		if (this._params.filters.resetPage !== false && pagination?.page > 1) {
			this._pagination.setPage(1, false, 'filters');
			return;
		}
		this._remote?.load({source: 'filters'});
	}

	_handleSearchChange(state) {
		this._searchState = state && typeof state === 'object'
			? state
			: {value: '', param: 'q'};
		if (!this._isRemote) {
			this._applyLocalFilters(this._filtersState, this._params.search.resetPage !== false);
			this._syncUrlState();
			return;
		}

		const param = String(this._searchState.param || 'q').trim() || 'q';
		const patch = {};
		if (this._searchParamKey) patch[this._searchParamKey] = '';
		if (this._searchState.value) patch[param] = this._searchState.value;
		this._searchParamKey = param;
		this._remote?.setParams(patch);
		this._syncUrlState();
		const pagination = this._pagination?.getState();
		if (this._params.search.resetPage !== false && pagination?.page > 1) {
			this._pagination.setPage(1, false, 'search');
			return;
		}
		this._remote?.load({source: 'search'});
	}

	_applyLocalFilters(state, resetPage = this._params.filters.resetPage !== false) {
		const filters = state?.filters && typeof state.filters === 'object' ? state.filters : {};
		const headerTable = this._stickyHeader?.getHeaderTable?.() || this._element;
		const headerRows = Array.from(headerTable.tHead?.rows || []);
		const headers = headerRows.length ? Array.from(headerRows.at(-1).cells || []) : [];
		const fields = new Map(headers.map((header, index) => [String(header.getAttribute('data-field') || '').trim(), index]));
		Array.from(this._element.tBodies || []).flatMap((body) => Array.from(body.rows || []))
			.filter((row) => !row.hasAttribute('data-vg-table-state-row'))
			.forEach((row) => {
			const matchedFilters = Object.entries(filters).every(([key, descriptor]) => {
				const field = String(descriptor?.field || key || '').trim();
				const index = fields.has(field) ? fields.get(field) : -1;
				if (index < 0 || !row.cells[index]) return true;
				const cell = row.cells[index];
				const value = cell.getAttribute('data-filter-value') ?? cell.textContent ?? '';
				return this._matchesFilterValue(value, descriptor || {});
			});
			const matched = matchedFilters && this._matchesSearchRow(row, headers);
			row.toggleAttribute(FILTER_HIDDEN_ATTRIBUTE, !matched);
			if (!matched) row.hidden = true;
			else if (!this._pagination) row.hidden = row.getAttribute('data-vg-table-expand-hidden') === 'true';
		});
		if (this._pagination) this._pagination.refresh(resetPage);
		this._expandable?.refresh();
		this._stickyHeader?.refresh?.();
		this._fixedColumns?.refresh?.();
		this._states?.syncLocal(this._hasActiveQuery());
	}

	_matchesSearchRow(row, headers) {
		const query = String(this._searchState?.value || '').toLocaleLowerCase();
		if (!query) return true;
		const configuredFields = new Set((this._params.search.fields || []).map((field) => String(field).trim()));
		const indexes = headers.reduce((result, header, index) => {
			const field = String(header.getAttribute('data-field') || '').trim();
			if (header.getAttribute('data-search-enabled') === 'false') return result;
			if (configuredFields.size && !configuredFields.has(field)) return result;
			result.push(index);
			return result;
		}, []);
		const rowValue = row.getAttribute('data-search-value');
		const value = rowValue !== null
			? rowValue
			: indexes.map((index) => {
				const cell = row.cells[index];
				return cell?.getAttribute('data-search-value') ?? cell?.textContent ?? '';
			}).join(' ');
		return String(value).toLocaleLowerCase().includes(query);
	}

	_matchesFilterValue(rawValue, descriptor) {
		const values = Array.isArray(descriptor.values) && descriptor.values.length
			? descriptor.values
			: descriptor.value;
		const operator = String(descriptor.operator || descriptor.type || 'eq').toLowerCase().trim();
		const left = String(rawValue ?? '').trim();
		if (operator === 'empty') return left === '';
		if (operator === 'notempty') return left !== '';
		if (Array.isArray(values)) {
			const choices = values.map((value) => String(value ?? '').toLocaleLowerCase().trim()).filter(Boolean);
			const included = choices.includes(left.toLocaleLowerCase());
			return operator === 'notin' ? !included : included;
		}
		const right = String(values ?? '').trim();
		if (!right) return true;
		const leftText = left.toLocaleLowerCase();
		const rightText = right.toLocaleLowerCase();
		if (operator === 'contains') return leftText.includes(rightText);
		if (operator === 'starts') return leftText.startsWith(rightText);
		if (operator === 'ends') return leftText.endsWith(rightText);
		const leftNumber = Number.parseFloat(left.replace(',', '.'));
		const rightNumber = Number.parseFloat(right.replace(',', '.'));
		const numeric = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);
		const leftDate = descriptor.type === 'date' ? Date.parse(left) : NaN;
		const rightDate = descriptor.type === 'date' ? Date.parse(right) : NaN;
		const comparableLeft = Number.isFinite(leftDate) && Number.isFinite(rightDate) ? leftDate : leftNumber;
		const comparableRight = Number.isFinite(leftDate) && Number.isFinite(rightDate) ? rightDate : rightNumber;
		const comparable = numeric || (Number.isFinite(leftDate) && Number.isFinite(rightDate));
		if (operator === 'neq') return comparable ? comparableLeft !== comparableRight : leftText !== rightText;
		if (operator === 'gt' && comparable) return comparableLeft > comparableRight;
		if (operator === 'gte' && comparable) return comparableLeft >= comparableRight;
		if (operator === 'lt' && comparable) return comparableLeft < comparableRight;
		if (operator === 'lte' && comparable) return comparableLeft <= comparableRight;
		return comparable ? comparableLeft === comparableRight : leftText === rightText;
	}

	_clearLocalFilters() {
		Array.from(this._element.tBodies || []).flatMap((body) => Array.from(body.rows || [])).forEach((row) => {
			row.removeAttribute(FILTER_HIDDEN_ATTRIBUTE);
			row.hidden = row.getAttribute('data-vg-table-expand-hidden') === 'true'
				|| row.getAttribute('data-vg-table-page-row') === 'hidden';
		});
	}

	_handlePaginationChange(state) {
		if (this._applyingUrlState) return;
		this._syncUrlState();
		if (!this._isRemote) {
			this._states?.syncLocal(this._hasActiveQuery());
			return;
		}
		this._remote?.load({page: state.page, perPage: state.perPage, source: state.source});
	}

	_handleLocalSortChange() {
		this._refreshPagination();
		this._syncUrlState();
	}

	_hasActiveQuery() {
		return Boolean(this._searchState?.value || Object.keys(this._filtersState?.filters || {}).length);
	}

	_collectUrlState() {
		const pagination = this._pagination?.getState() || {};
		return {
			page: pagination.page || 1,
			perPage: pagination.perPage || this._params.pagination.per,
			sort: this._sorting?.getSortState?.() || this._sorting?.getSort() || null,
			search: this._searchState?.value || '',
			filters: Object.assign({}, this._filtersState?.params || {}),
		};
	}

	_syncUrlState() {
		if (this._applyingUrlState || !this._urlState) return null;
		return this._urlState.write(this._collectUrlState());
	}

	_applyUrlState(state = {}, options = {}) {
		if (!state || typeof state !== 'object') return null;
		const clearMissing = options.clearMissing === true;
		const present = state.present || {};
		const previousFilterKeys = new Set(this._filterParamKeys);
		const previousSearchKey = this._searchParamKey;
		this._applyingUrlState = true;
		try {
			if (this._filters && (clearMissing || present.filters)) {
				this._filters.setValues(state.filters || {}, {emit: false});
				this._filtersState = this._filters.getState();
				this._filterParamKeys = new Set(Object.keys(this._filtersState.params || {}));
			}
			if (this._search && (clearMissing || present.search)) {
				this._search.setValue(state.search || '', {emit: false});
				this._searchState = this._search.getState();
				this._searchParamKey = this._searchState.param;
			}
			if (this._sorting && (clearMissing || present.sort)) {
				if (state.sort?.sorts?.length) this._sorting.setSorts(state.sort.sorts, false);
				else if (state.sort?.field) this._sorting.setSort(state.sort.field, state.sort.direction, false);
				else this._sorting.clearSort(false);
			}
			if (this._pagination) {
				const current = this._pagination.getState();
				const perPage = present.perPage ? state.perPage : (clearMissing ? this._params.pagination.per : current.perPage);
				const page = present.page ? state.page : (clearMissing ? this._params.pagination.page : current.page);
				if (this._isRemote) {
					this._pagination.setMeta({
						page: page || 1,
						per_page: perPage || current.perPage,
						total: current.totalRows,
						pages: Math.max(1, page || 1),
					});
				} else {
					if (perPage) this._pagination.setPerPage(perPage, false, 'urlstate');
					if (page) this._pagination.setPage(page, false, 'urlstate');
				}
			}
			if (!this._isRemote) this._applyLocalFilters(this._filtersState, false);
			if (this._remote) {
				const patch = {};
				previousFilterKeys.forEach((key) => { patch[key] = ''; });
				if (previousSearchKey) patch[previousSearchKey] = '';
				Object.assign(patch, this._filtersState.params || {});
				if (this._searchState.value) patch[this._searchState.param] = this._searchState.value;
				this._remote.setParams(patch);
			}
		} finally {
			this._applyingUrlState = false;
		}
		if (this._remote && options.source !== 'init') {
			const pagination = this._pagination?.getState() || {};
			this._remote.load({page: pagination.page, perPage: pagination.perPage, source: options.source || 'urlstate'});
		}
		return this._collectUrlState();
	}

	_resetQueryControls() {
		this._applyingUrlState = true;
		try {
			this._filters?.reset({emit: false});
			this._search?.reset({emit: false});
			this._filtersState = this._filters?.getState() || {filters: {}, params: {}, fields: [], meta: {count: 0}};
			this._searchState = this._search?.getState() || {value: '', param: this._searchParamKey || 'q'};
			const patch = {};
			this._filterParamKeys.forEach((key) => { patch[key] = ''; });
			if (this._searchParamKey) patch[this._searchParamKey] = '';
			this._filterParamKeys = new Set();
			this._remote?.setParams(patch);
			if (this._pagination?.getState().page > 1) this._pagination.setPage(1, false, 'state-reset');
			if (!this._isRemote) this._applyLocalFilters(this._filtersState, true);
		} finally {
			this._applyingUrlState = false;
		}
		this._syncUrlState();
		if (this._remote) this._remote.load({page: 1, source: 'state-reset'});
	}

	_handleRemoteSortChange() {
		if (!this._remote) return;
		this._syncUrlState();
		const state = this._pagination?.getState();
		if (state && state.page !== 1) {
			this._pagination.setPage(1, false, 'sort');
			return;
		}
		this._remote.reload({page: 1, source: 'sort'});
	}

	_afterRemoteRender(detail = {}) {
		if (detail.renderedCount > 0) this._states?.clear();
		this._columns?.refresh?.();
		this._sorting?.refresh?.();
		this._expandable?.refresh?.();
		this._rowReorder?.refresh?.();
		this._stickyHeader?.refreshIntrinsicMinimums?.();
		this._fixedColumns?.refresh?.();
	}

	/**
	 * Очистка ресурсов
	 */
	dispose() {
		if (this._remote) this._remote.dispose();
		if (this._skeleton) this._skeleton.dispose();
		if (this._urlState) this._urlState.dispose();
		if (this._states) this._states.dispose();
		if (this._search) this._search.dispose();
		if (this._filters) this._filters.dispose();
		this._clearLocalFilters();
		if (this._fixedColumns) this._fixedColumns.dispose();
		if (this._sorting) this._sorting.dispose();
		if (this._columns) this._columns.dispose();
		if (this._stickyHeader) this._stickyHeader.dispose();
		if (this._panning) this._panning.dispose();
		if (this._selection) this._selection.dispose();
		if (this._rowReorder) this._rowReorder.dispose();
		if (this._expandable) this._expandable.dispose();
		this._element.removeEventListener('sortchange.vg.table', this._boundPaginationRefresh);
		this._element.removeEventListener('sortchange.vg.table', this._boundLocalSortChange);
		this._element.removeEventListener('sortchange.vg.table', this._boundRemoteSortChange);
		if (this._pagination) this._pagination.dispose();
		this._autoNotSplitterHeaders.forEach((header) => header.classList.remove(NOT_SPLITTER_CLASS));
		this._autoNotSplitterHeaders.clear();
		this._emptyHeaderSortOptions.forEach((value, header) => {
			if (value === null) header.removeAttribute('data-sort-enabled');
			else header.setAttribute('data-sort-enabled', value);
		});
		this._emptyHeaderSortOptions.clear();
		this._element.classList.remove('vg-table-complex');
		this._element.removeAttribute('data-vg-table-complex');
		this._removeGeneratedTableContainer();
		this._removeGeneratedWrapper();
		super.dispose();
	}
}

EventHandler.on(document, 'DOMContentLoaded', () => {
	Selectors.findAll(SELECTOR_DATA_TOGGLE).forEach((el) => {
		VGTable.getOrCreateInstance(el).init();
	})
});

export default VGTable;
