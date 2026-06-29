import BaseModule from "../../base-module";
import fixedColumnsMethods from "./fixed";
import viewportMethods from "./viewport";
import summaryFooterMethods from "./summary-footer";
import skeletonMethods from "./skeleton";
import tableRemoteMethods from "./table-remote";
import tableUrlStateMethods from "./table-url-state";
import tableStateMethods from "./table-state";
import DEFAULT_OPTIONS from "./options";
import Pagination from "./pagination";
import Sortable from "./sortable";
import Expandable from "./expandable";
import Search from "./search";
import Filters from "./filters";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {mergeDeepObject} from "../../../utils/js/functions";

/**
 * РљРѕРЅСЃС‚Р°РЅС‚С‹
 */
const NAME = 'dynamicTable';
const NAME_KEY = 'vg.' + NAME;

const MAIN_SELECTOR_CLASS = 'vg-dynamic-table';
const SELECTOR_DATA_TOGGLE = '[data-vg-table]';

/**
 * РљР°СЂС‚Р° РєРѕР»Р±РµРєРѕРІ
 */
const ACTION_CALLBACK_MAP = {
	init: 'onInit',
	beforeload: 'onBeforeLoad',
	dataloaded: 'onDataLoaded',
	error: 'onError',
	requestsuccess: 'onRequestSuccess',
	requesterror: 'onRequestError',
	staleresponse: 'onStaleResponse',
	urlstateread: 'onUrlStateRead',
	urlstatewrite: 'onUrlStateWrite',
	urlstateerror: 'onUrlStateError',
	emptyresult: 'onEmptyResult',
	afterrender: 'onAfterRender',
	statesync: 'onStateSync',
	sortchange: 'onSortChange',
	pagechange: 'onPageChange',
	perpagechange: 'onPerPageChange',
	search: 'onSearch',
	filterschange: 'onFiltersChange',
	reset: 'onReset',
	export: 'onExport',
	viewchange: 'onViewChange',
	rowupdate: 'onRowUpdate',
	rowupdateerror: 'onRowUpdateError',
	bulkaction: 'onBulkAction',
	rowdelete: 'onRowDelete',
	rowcheck: 'onRowCheck',
	checkall: 'onCheckAll',
	selectionchange: 'onSelectionChange',
	rowexpand: 'onRowExpand',
	rowcollapse: 'onRowCollapse',
	rowtoggle: 'onRowToggle',
	rowreorder: 'onRowReorder',
	rowreordererror: 'onRowReorderError',
	columnreorder: 'onColumnReorder',
	columnresize: 'onColumnResize',
	columnfixed: 'onColumnFixed',
};

class VGDynamicTable extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);
		this._params = this._getParams(element, mergeDeepObject(DEFAULT_OPTIONS, params));
		this._parent = null;
		this._tableViewport = null;
		this._pagination = null;
		this._rows = [];
		this._originalRows = [];
		this._requestToken = 0;
		this._isRemote = false;
		this._fields = [];
		this._isInitialized = false;
		this._sortable = null;
		this._search = null;
		this._filters = null;
		this._sortState = { field: '', dir: 'asc', columnIndex: -1, sorts: [] };
		this._pageState = { page: 1, perPage: 10 };
		this._remoteParams = {};
		this._activeFilters = {};
		this._lastRemoteMeta = {};
		this._liveRegion = null;
		this._summaryNode = null;
		this._panHintNode = null;
		this._cloneStickyState = null;
		this._boundPopState = this._handlePopState.bind(this);
		this._panState = null;
		this._boundPanHintResize = this._updatePanHintVisibility.bind(this);
		this._boundPanHintDismiss = this._handlePanHintDismiss.bind(this);
		this._boundCloneStickyResize = this._refreshStickyAndFixedLayout.bind(this);
		this._boundFixedColumnsScroll = this._syncFixedColumnsScroll.bind(this);
		this._fixedColumnsScrollBound = false;
		this._fixedColumnsCellsCache = [];
		this._fixedColumnsSyncFrame = 0;
		this._fixedColumnsLastScrollLeft = 0;
		this._layoutResizeObserver = null;
		this._layoutRefreshFrame = 0;
		this._layoutRefreshReasons = [];
		this._layoutRefreshScheduled = false;
		this._requestAbortController = null;
		this._activeRemoteRequestId = '';
		this._remotePageCache = new Map();
		this._fixedColumnsSuppressed = false;
		this._searchInputCacheSelector = '';
		this._searchInputCacheNode = null;
		this._filtersFormCacheSelector = '';
		this._filtersFormCacheNode = null;
		this._filterParamKeysCache = null;
		this._columnReorderState = {
			enabled: false,
			fromIndex: -1,
			toIndex: -1,
			isDragging: false,
		};
		this._columnResizeState = {
			enabled: false,
			bound: false,
			active: false,
			index: -1,
			startX: 0,
			startWidth: 0,
			nextWidth: 0,
			frame: 0,
		};
		this._virtualState = {
			enabled: false,
			bound: false,
			lastPage: -1,
			lastPerPage: -1,
			start: 0,
			end: 0,
			page: -1,
			perPage: -1,
			frame: 0,
			lastScrollTop: -1,
			rowHeight: 44,
		};
		this._virtualSpacers = {
			top: null,
			bottom: null,
		};
		this._boundVirtualScroll = this._handleVirtualScroll.bind(this);
		this._expandable = null;
	}

	static get NAME() { return NAME; }

	static get NAME_KEY() { return NAME_KEY; }

	static initAll(params = {}) {
		Array.from(Selectors.findAll(SELECTOR_DATA_TOGGLE)).forEach((element) => {
			const instance = this.getInstance(element) || new this(element, params);
			instance.init();
		});
	}

	_emitAction(action, payload = {}) {
		const normalizedAction = String(action || '').trim();
		if (!normalizedAction) {
			return;
		}

		const detail = Object.assign({
			action: normalizedAction,
			table: this._element,
			isRemote: this._isRemote,
		}, payload);

		const callbacks = this._params.callbacks || {};
		const normalizedActionKey = normalizedAction.toLowerCase();
		const callbackName = ACTION_CALLBACK_MAP[normalizedActionKey] || '';
		const callback = callbackName ? callbacks[callbackName] : null;
		if (typeof callback === 'function') {
			callback(detail, this);
		}

		const events = this._params.events || {};
		const eventsEnabled = events.enable === undefined ? true : Boolean(events.enable);
		if (!eventsEnabled || typeof window === 'undefined' || typeof window.CustomEvent !== 'function') {
			return;
		}

		const prefix = String(events.prefix || 'vgdt').trim() || 'vgdt';
		const eventName = `${prefix}:${normalizedActionKey}`;
		const bubbles = events.bubbles === undefined ? true : Boolean(events.bubbles);
		this._element.dispatchEvent(new CustomEvent(eventName, {
			detail,
			bubbles,
		}));
	}

	updateRemoteParams(nextParams = {}, options = {}) {
		if (!this._isRemote) {
			return;
		}

		const shouldReplace = options && Object.prototype.hasOwnProperty.call(options, 'replace')
			? Boolean(options.replace)
			: false;
		const shouldReload = options && Object.prototype.hasOwnProperty.call(options, 'reload')
			? Boolean(options.reload)
			: true;
		const shouldResetPage = options && Object.prototype.hasOwnProperty.call(options, 'resetPage')
			? Boolean(options.resetPage)
			: true;
		const trigger = options && typeof options.trigger === 'string'
			? String(options.trigger).toLowerCase().trim()
			: '';
		const filtersState = options && options.filtersState && typeof options.filtersState === 'object'
			? this._normalizeFiltersEventState(options.filtersState)
			: null;

		const source = nextParams && typeof nextParams === 'object' ? nextParams : {};
		const current = shouldReplace ? {} : Object.assign({}, this._remoteParams);
		Object.keys(source).forEach((key) => {
			const value = source[key];
			if (Array.isArray(value)) {
				const normalized = value
					.map((item) => String(item || '').trim())
					.filter((item) => item !== '');
				if (!normalized.length) {
					delete current[key];
					return;
				}
				current[key] = normalized;
				return;
			}
			if (value === undefined || value === null || value === '') {
				delete current[key];
				return;
			}
			current[key] = value;
		});
		this._remoteParams = current;

		if (!shouldReload) {
			this._syncUrlState();
			return;
		}

		const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
		const page = shouldResetPage ? 1 : (this._pageState.page || 1);
		this._pageState = { page, perPage };
		this._loadRemotePage(page, perPage, null, {
			trigger,
			filtersState,
		});
	}

	setLocale(locale) {
		const normalized = String(locale || '').toLowerCase().trim() || 'ru';
		this._params.locale = normalized;
		this._writePersistentState('locale', normalized);
		return normalized;
	}

	setFiltersApplyMode(mode) {
		const normalized = this._normalizeFiltersApplyMode(mode);
		if (!this._params.filters || typeof this._params.filters !== 'object') {
			this._params.filters = {};
		}
		this._params.filters.apply = normalized;
		this._writePersistentState('filtersApplyMode', normalized);
		if (this._isInitialized && this._isRemote) {
			this._initFilters();
		}
		return normalized;
	}

	_getViewsStorageKey() {
		const explicitAttr = String(this._element.getAttribute('data-views-storage-key') || '').trim();
		if (explicitAttr) {
			return explicitAttr;
		}
		const viewsOptions = this._params.views && typeof this._params.views === 'object'
			? this._params.views
			: {};
		const nestedStorage = viewsOptions.storage && typeof viewsOptions.storage === 'object'
			? viewsOptions.storage
			: {};
		const nestedOption = String(nestedStorage.key || viewsoptions.storageKey || '').trim();
		if (nestedOption) {
			return nestedOption;
		}
		return `${this._getPerPageStorageKey()}:views`;
	}

	_readViewsStorage() {
		try {
			const raw = String(window.localStorage.getItem(this._getViewsStorageKey()) || '').trim();
			if (!raw) {
				return {};
			}
			const parsed = JSON.parse(raw);
			return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
		} catch (error) {
			return {};
		}
	}

	_writeViewsStorage(data) {
		try {
			window.localStorage.setItem(this._getViewsStorageKey(), JSON.stringify(data || {}));
		} catch (error) {
			// Ignore storage errors.
		}
	}

	_getHiddenFields() {
		return this._getHeaderCells()
			.filter((header) => String(header.getAttribute('data-hidden') || '') === '1')
			.map((header) => String(header.getAttribute('data-field') || '').trim())
			.filter(Boolean);
	}

	_setFieldHidden(field, hidden) {
		const targetField = String(field || '').trim();
		if (!targetField) {
			return;
		}
		const headers = this._getHeaderCells();
		const index = headers.findIndex((header) => String(header.getAttribute('data-field') || '').trim() === targetField);
		if (index < 0) {
			return;
		}
		const sections = [];
		if (this._element.tHead) {
			sections.push(this._element.tHead);
		}
		if (this._element.tBodies && this._element.tBodies.length) {
			sections.push(...Array.from(this._element.tBodies));
		}
		if (this._element.tFoot) {
			sections.push(this._element.tFoot);
		}
		sections.forEach((section) => {
			Array.from(section.rows || []).forEach((row) => {
				const cell = row.cells && row.cells[index] ? row.cells[index] : null;
				if (!cell) {
					return;
				}
				cell.style.display = hidden ? 'none' : '';
				if (hidden) {
					cell.setAttribute('data-hidden', '1');
				} else {
					cell.removeAttribute('data-hidden');
				}
			});
		});
		const header = headers[index];
		if (header) {
			if (hidden) {
				header.setAttribute('data-hidden', '1');
			} else {
				header.removeAttribute('data-hidden');
			}
		}
	}

	getCurrentViewState() {
		return {
			filters: Object.assign({}, this._remoteParams || {}),
			sorts: this._getNormalizedSorts(this._sortState.sorts || []),
			perPage: this._pageState.perPage || this._getInitialPerPage(),
			columnOrder: this._getCurrentColumnOrder(),
			hiddenFields: this._getHiddenFields(),
		};
	}

	listViews() {
		return Object.keys(this._readViewsStorage()).sort();
	}

	saveView(name) {
		const cleanName = String(name || '').trim();
		if (!cleanName) {
			return false;
		}
		const storage = this._readViewsStorage();
		storage[cleanName] = this.getCurrentViewState();
		this._writeViewsStorage(storage);
		this._emitAction('viewchange', {
			mode: 'save',
			name: cleanName,
			state: storage[cleanName],
		});
		return true;
	}

	applyView(name) {
		const cleanName = String(name || '').trim();
		if (!cleanName) {
			return false;
		}
		const storage = this._readViewsStorage();
		const state = storage[cleanName];
		if (!state || typeof state !== 'object') {
			return false;
		}

		const columnOrder = Array.isArray(state.columnOrder) ? state.columnOrder.filter(Boolean) : [];
		columnOrder.forEach((field, targetIndex) => {
			const currentIndex = this._findHeaderIndexByField(field);
			if (currentIndex < 0 || currentIndex === targetIndex) {
				return;
			}
			this._moveColumn(currentIndex, targetIndex);
		});

		const hiddenFields = Array.isArray(state.hiddenFields) ? state.hiddenFields : [];
		const hiddenSet = new Set(hiddenFields.map((field) => String(field || '').trim()).filter(Boolean));
		this._getCurrentColumnOrder().forEach((field) => {
			this._setFieldHidden(field, hiddenSet.has(field));
		});

		const sorts = this._getNormalizedSorts(state.sorts || []);
		if (this._sortable) {
			this._sortable.setState({ sorts });
		}
		const firstSort = sorts[0] || null;
		this._sortState = Object.assign({}, this._sortState, {
			field: firstSort ? firstSort.field : '',
			dir: firstSort ? firstSort.dir : 'asc',
			sorts,
		});

		const nextPerPage = this._clampPerPage(state.perPage, this._getInitialPerPage());
		if (this._pagination) {
			this._pagination.setMeta({
				page: 1,
				perPage: nextPerPage,
				totalPages: this._isRemote ? this._normalizePositiveInt(this._lastRemoteMeta.pages, 1) : this._getTotalPages(nextPerPage),
			});
		}
		this._pageState = { page: 1, perPage: nextPerPage };

		if (this._isRemote) {
			this._remoteParams = state.filters && typeof state.filters === 'object'
				? Object.assign({}, state.filters)
				: {};
			if (this._filters && typeof this._filters.setValues === 'function') {
				this._filters.setValues(this._getInitialFilterValues(), { emit: false });
			}
			const filtersRequestMeta = this._getFiltersRequestMetaIfActive();
			this._loadRemotePage(1, nextPerPage, null, filtersRequestMeta);
		} else {
			this._renderPageRows(1, nextPerPage);
		}

		this._afterColumnReorder();
		this._emitAction('viewchange', {
			mode: 'apply',
			name: cleanName,
			state,
		});
		return true;
	}

	deleteView(name) {
		const cleanName = String(name || '').trim();
		if (!cleanName) {
			return false;
		}
		const storage = this._readViewsStorage();
		if (!Object.prototype.hasOwnProperty.call(storage, cleanName)) {
			return false;
		}
		delete storage[cleanName];
		this._writeViewsStorage(storage);
		this._emitAction('viewchange', {
			mode: 'delete',
			name: cleanName,
		});
		return true;
	}

	init() {
		if (this._isInitialized) {
			return;
		}

		const directParent = this._element.parentElement;
		const nearestWrapper = this._element.closest(`.${MAIN_SELECTOR_CLASS}`);
		const isWrapped = nearestWrapper && nearestWrapper.contains(this._element);
		if (!isWrapped) {
			const wrapper = document.createElement('div');
			wrapper.className = MAIN_SELECTOR_CLASS;
			this._moveTableClassesToWrapper(wrapper);
			this._element.parentNode.insertBefore(wrapper, this._element);
			wrapper.appendChild(this._element);

			this._parent = wrapper;
		} else {
			this._parent = nearestWrapper;
			if (this._parent) {
				this._parent.classList.add(MAIN_SELECTOR_CLASS);
				this._moveTableClassesToWrapper(this._parent);
			}
		}

		if (!this._parent) return;

		this._ensureTableViewport(directParent);
		this._bindViewportPan();
		this._restorePersistentState();
		this._ensureLiveRegion();
		this._ensureSummaryNode();
		this._ensurePanHintNode();
		this._applyFooterVisibility();

		const sortableEnabled = Boolean(this._params.sortable && this._params.sortable.enable);
		const paginationEnabled = this._isPaginationEnabled();
		const cloneStickyEnabled = this._isCloneStickyHeaderEnabled();
		const stickyHeaderEnabled = cloneStickyEnabled ? false : this._isStickyHeaderEnabled();
		this._element.classList.toggle('table-sortable', sortableEnabled);
		this._element.classList.toggle('table-pagination', paginationEnabled);
		this._element.classList.toggle('table-sticky-head', stickyHeaderEnabled);
		this._element.classList.toggle('table-sticky-clone', cloneStickyEnabled);
		this._parent.classList.toggle('table-sortable', sortableEnabled);
		this._parent.classList.toggle('table-pagination', paginationEnabled);
		this._parent.classList.toggle('table-sticky-head', stickyHeaderEnabled);
		this._parent.classList.toggle('table-sticky-clone', cloneStickyEnabled);
		this._applyStickyHeader(stickyHeaderEnabled);
		this._applyCloneStickyHeader(cloneStickyEnabled);

		const route = this._getRoute();
		this._isRemote = Boolean(route);
		this._fields = this._getFields();
		this._sortState = this._getInitialSortState();
		this._remoteParams = this._getInitialRemoteParams();
		this._isInitialized = true;

		if (!this._isRemote) {
			this._rows = this._getTableRows();
			this._originalRows = this._rows.slice();
		}

		this._initSorting();
		this._initColumnReorder();
		this._initColumnResize();
		this._initExpandable();
		this._initSearch();
		this._initFilters();
		this._bindTableStateActions();
		this._bindPopState();
		this._refreshStickyAndFixedLayout();

		if (paginationEnabled) {
			this.setPagination();
			this._emitAction('init', {
				page: this._pageState.page,
				perPage: this._pageState.perPage,
			});
			return;
		}

		if (this._isRemote) {
			const page = this._getInitialPage();
			const perPage = this._getInitialPerPage();
			this._pageState = { page, perPage };
			const filtersRequestMeta = this._getFiltersRequestMetaIfActive();
			this._loadRemotePage(page, perPage, null, filtersRequestMeta);
		} else {
			this._renderFooterFromCurrentState();
			this._refreshExpandable();
		}

		this._emitAction('init', {
			page: this._pageState.page,
			perPage: this._pageState.perPage,
		});
	}

	setPagination() {
		if (this._isRemote) {
			this._setRemotePagination();
			return;
		}

		this._rows = this._getTableRows();
		if (!this._originalRows.length) {
			this._originalRows = this._rows.slice();
		}

		const page = this._getInitialPage();
		const perPage = this._getInitialPerPage();
		const totalPages = this._getTotalPages(perPage);
		const initialPage = Math.min(page, totalPages);
		this._pageState = { page: initialPage, perPage };

		const userOnChange = this._params.pagination.onChange;
		const userOnPerPageChange = this._params.pagination.onPerPageChange;
		const paginationI18n = this._getI18nSection('pagination');

		const paginationOptions = Object.assign({}, this._params.pagination, paginationI18n, {
			page: initialPage,
			perPage,
			maxPerPage: this._getMaxPerPage(),
			totalPages,
			onChange: (payload) => {
				const nextTotalPages = this._getTotalPages(payload.perPage);
				const nextPage = Math.min(payload.page, nextTotalPages);
				this._pageState = { page: nextPage, perPage: payload.perPage };
				this._storePage(nextPage);
				this._storePerPage(payload.perPage);

				this._renderPageRows(nextPage, payload.perPage);
				this._pagination.setMeta({
					page: nextPage,
					perPage: payload.perPage,
					totalPages: nextTotalPages,
				});
				if (payload.source !== 'ellipsis') {
					this._scrollToPaginationTop();
				}
				this._syncUrlState();

				if (typeof userOnChange === 'function') {
					userOnChange(Object.assign({}, payload, {
						page: nextPage,
						totalPages: nextTotalPages,
					}));
				}

				this._emitAction('pagechange', {
					page: nextPage,
					perPage: payload.perPage,
					totalPages: nextTotalPages,
					source: 'local',
				});
			},
			onPerPageChange: (payload) => {
				if (typeof userOnPerPageChange === 'function') {
					userOnPerPageChange(payload);
				}
				this._emitAction('perpagechange', Object.assign({}, payload, {
					source: 'local',
				}));
			},
		});

		const pagination = new Pagination(this._parent, paginationOptions);
		pagination.init();
		this._pagination = pagination;

		this._renderPageRows(initialPage, perPage);
		this._renderFooterFromCurrentState();
	}

	_setRemotePagination() {
		const page = this._getInitialPage();
		const perPage = this._getInitialPerPage();
		this._pageState = { page, perPage };

		const userOnChange = this._params.pagination.onChange;
		const userOnPerPageChange = this._params.pagination.onPerPageChange;
		const paginationI18n = this._getI18nSection('pagination');

		const paginationOptions = Object.assign({}, this._params.pagination, paginationI18n, {
			page,
			perPage,
			maxPerPage: this._getMaxPerPage(),
			totalPages: 1,
			onChange: async (payload) => {
				this._pageState = { page: payload.page, perPage: payload.perPage };
				this._storePage(payload.page);
				this._storePerPage(payload.perPage);
				if (payload.source !== 'ellipsis') {
					this._scrollToPaginationTop();
				}
				await this._loadRemotePage(payload.page, payload.perPage, userOnChange);
				const totalPages = this._normalizePositiveInt(this._lastRemoteMeta.pages, 1);
				this._emitAction('pagechange', {
					page: payload.page,
					perPage: payload.perPage,
					totalPages,
					source: 'remote',
				});
			},
			onPerPageChange: (payload) => {
				if (typeof userOnPerPageChange === 'function') {
					userOnPerPageChange(payload);
				}
				this._emitAction('perpagechange', Object.assign({}, payload, {
					source: 'remote',
				}));
			},
		});

		const pagination = new Pagination(this._parent, paginationOptions);
		pagination.init();
		this._pagination = pagination;

		const filtersRequestMeta = this._getFiltersRequestMetaIfActive();
		this._loadRemotePage(page, perPage, null, filtersRequestMeta);
	}

	_getTableRows() {
		const body = this._element.tBodies && this._element.tBodies[0];
		if (!body) {
			return [];
		}
		return Array.from(body.rows).filter((row) => String(row.getAttribute('data-virtual-spacer') || '') !== '1');
	}

	_getTotalPages(perPage) {
		if (!this._rows.length) {
			return 1;
		}
		return Math.max(1, Math.ceil(this._rows.length / perPage));
	}

	_renderPageRows(page, perPage) {
		if (!this._rows.length) {
			return;
		}

		const isVirtualEnabled = this._isVirtualEnabled();
		const start = (page - 1) * perPage;
		const end = start + perPage;

		this._rows.forEach((row, index) => {
			row.hidden = index < start || index >= end;
		});
		if (isVirtualEnabled) {
			this._virtualState.lastPage = page;
			this._virtualState.lastPerPage = perPage;
			this._applyVirtualWindow(page, perPage);
		} else {
			this._teardownVirtualWindow();
		}
		this._refreshExpandable();
		this._renderFooterFromCurrentState();
		this._refreshStickyAndFixedLayout();
	}

	_isVirtualEnabled() {
		const options = this._params.virtual || {};
		const attr = this._element.getAttribute('data-virtual-enable');
		const enabled = attr !== null
			? this._isTruthy(attr)
			: Boolean(options.enable);
		if (!enabled) {
			return false;
		}
		const thresholdRaw = this._element.getAttribute('data-virtual-threshold');
		const threshold = this._normalizePositiveInt(
			thresholdRaw !== null ? thresholdRaw : options.threshold,
			500
		);
		return this._rows.length >= threshold;
	}

	_initVirtualization() {
		if (!this._tableViewport || this._virtualState.bound) {
			return;
		}
		this._tableViewport.addEventListener('scroll', this._boundVirtualScroll, { passive: true });
		this._virtualState.bound = true;
	}

	_teardownVirtualizationBinding() {
		if (!this._tableViewport || !this._virtualState.bound) {
			return;
		}
		this._tableViewport.removeEventListener('scroll', this._boundVirtualScroll);
		this._virtualState.bound = false;
	}

	_handleVirtualScroll() {
		if (!this._isVirtualEnabled()) {
			return;
		}
		if (this._virtualState.lastPage <= 0 || this._virtualState.lastPerPage <= 0) {
			return;
		}
		const nextScrollTop = this._tableViewport ? (this._tableViewport.scrollTop || 0) : 0;
		if (nextScrollTop === this._virtualState.lastScrollTop && this._virtualState.frame === 0) {
			return;
		}
		this._virtualState.lastScrollTop = nextScrollTop;
		if (this._virtualState.frame) {
			return;
		}
		if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
			this._applyVirtualWindow(this._virtualState.lastPage, this._virtualState.lastPerPage);
			return;
		}
		this._virtualState.frame = window.requestAnimationFrame(() => {
			this._virtualState.frame = 0;
			this._applyVirtualWindow(this._virtualState.lastPage, this._virtualState.lastPerPage);
		});
	}

	_applyVirtualWindow(page, perPage) {
		if (!this._isVirtualEnabled() || !this._tableViewport) {
			this._teardownVirtualWindow();
			return;
		}

		this._initVirtualization();
		const body = this._getBody();
		if (!body) {
			this._teardownVirtualWindow();
			return;
		}
		const options = this._params.virtual || {};
		const rowHeight = this._resolveVirtualRowHeight(page, perPage, options);
		const overscanRaw = this._element.getAttribute('data-virtual-overscan');
		const overscan = Math.max(0, this._normalizePositiveInt(overscanRaw !== null ? overscanRaw : options.overscan, 8));
		const visibleCount = Math.max(1, Math.ceil((this._tableViewport.clientHeight || 0) / rowHeight));
		const pageStart = (page - 1) * perPage;
		const pageEnd = Math.min(pageStart + perPage, this._rows.length);

		const scrolledRows = Math.floor((this._tableViewport.scrollTop || 0) / rowHeight);
		const windowStart = Math.max(pageStart, pageStart + scrolledRows - overscan);
		const windowEnd = Math.min(pageEnd, pageStart + scrolledRows + visibleCount + overscan);

		const topSpacerHeight = Math.max(0, (windowStart - pageStart) * rowHeight);
		const bottomSpacerHeight = Math.max(0, (pageEnd - windowEnd) * rowHeight);
		if (
			this._virtualState.start === windowStart
			&& this._virtualState.end === windowEnd
			&& this._virtualState.page === page
			&& this._virtualState.perPage === perPage
		) {
			this._syncVirtualSpacers(body, windowStart, windowEnd, topSpacerHeight, bottomSpacerHeight);
			return;
		}

		const isSameContext = this._virtualState.page === page && this._virtualState.perPage === perPage;
		const prevStart = this._virtualState.start;
		const prevEnd = this._virtualState.end;
		const updateFrom = isSameContext
			? Math.max(pageStart, Math.min(prevStart, windowStart))
			: pageStart;
		const updateTo = isSameContext
			? Math.min(pageEnd, Math.max(prevEnd, windowEnd))
			: pageEnd;
		for (let index = updateFrom; index < updateTo; index += 1) {
			const row = this._rows[index];
			if (!row) {
				continue;
			}
			row.hidden = index < windowStart || index >= windowEnd;
		}
		this._syncVirtualSpacers(body, windowStart, windowEnd, topSpacerHeight, bottomSpacerHeight);
		this._virtualState.start = windowStart;
		this._virtualState.end = windowEnd;
		this._virtualState.page = page;
		this._virtualState.perPage = perPage;
		this._virtualState.rowHeight = rowHeight;
	}

	_resolveVirtualRowHeight(page, perPage, options = {}) {
		const attrRowHeight = this._element.getAttribute('data-virtual-row-height');
		if (attrRowHeight !== null && String(attrRowHeight).trim() !== '') {
			return Math.max(24, this._normalizePositiveInt(attrRowHeight, 44));
		}

		const optionRowHeight = this._normalizePositiveInt(options.rowheight, 0);
		const pageStart = Math.max(0, (page - 1) * perPage);
		const pageEnd = Math.min(pageStart + perPage, this._rows.length);
		const measuredHeight = this._measureVirtualRowHeight(pageStart, pageEnd);
		if (measuredHeight > 0) {
			return measuredHeight;
		}
		if (optionRowHeight > 0) {
			return Math.max(24, optionRowHeight);
		}
		const cachedHeight = this._normalizePositiveInt(this._virtualState.rowHeight, 44);
		return Math.max(24, cachedHeight);
	}

	_measureVirtualRowHeight(pageStart, pageEnd) {
		const samples = [];
		for (let index = pageStart; index < pageEnd; index += 1) {
			const row = this._rows[index];
			if (!row || row.hidden) {
				continue;
			}
			const rect = row.getBoundingClientRect();
			const height = Math.round(rect && rect.height ? rect.height : 0);
			if (height > 0) {
				samples.push(height);
			}
			if (samples.length >= 6) {
				break;
			}
		}
		if (!samples.length) {
			return 0;
		}
		const total = samples.reduce((sum, value) => sum + value, 0);
		return Math.max(24, Math.round(total / samples.length));
	}

	_syncVirtualSpacers(body, windowStart, windowEnd, topHeight, bottomHeight) {
		const columns = this._getRenderedColumnsCount();
		const topSpacer = this._ensureVirtualSpacer('top', columns);
		const bottomSpacer = this._ensureVirtualSpacer('bottom', columns);
		const firstVisibleRow = this._rows[windowStart] || null;
		const afterVisibleRow = this._rows[windowEnd] || null;

		this._updateVirtualSpacer(topSpacer, topHeight, columns);
		this._updateVirtualSpacer(bottomSpacer, bottomHeight, columns);

		if (firstVisibleRow) {
			body.insertBefore(topSpacer, firstVisibleRow);
		} else if (!topSpacer.parentElement) {
			body.appendChild(topSpacer);
		}

		if (afterVisibleRow) {
			body.insertBefore(bottomSpacer, afterVisibleRow);
		} else {
			body.appendChild(bottomSpacer);
		}
	}

	_ensureVirtualSpacer(position, columns) {
		const current = this._virtualSpacers && this._virtualSpacers[position]
			? this._virtualSpacers[position]
			: null;
		if (current && current.isConnected) {
			this._syncVirtualSpacerColumns(current, columns);
			return current;
		}

		const spacer = document.createElement('tr');
		spacer.setAttribute('data-virtual-spacer', '1');
		spacer.setAttribute('data-virtual-spacer-position', position);
		spacer.setAttribute('data-group-header', '1');
		spacer.setAttribute('aria-hidden', 'true');
		const cell = document.createElement('td');
		cell.setAttribute('data-virtual-spacer-cell', '1');
		cell.colSpan = Math.max(1, columns);
		spacer.appendChild(cell);
		this._virtualSpacers[position] = spacer;
		return spacer;
	}

	_syncVirtualSpacerColumns(spacer, columns) {
		if (!spacer || !spacer.cells || !spacer.cells[0]) {
			return;
		}
		spacer.cells[0].colSpan = Math.max(1, columns);
	}

	_updateVirtualSpacer(spacer, height, columns) {
		if (!spacer || !spacer.cells || !spacer.cells[0]) {
			return;
		}
		const safeHeight = Math.max(0, Math.round(height));
		this._syncVirtualSpacerColumns(spacer, columns);
		const cell = spacer.cells[0];
		cell.style.height = `${safeHeight}px`;
		spacer.hidden = safeHeight <= 0;
	}

	_teardownVirtualWindow() {
		this._teardownVirtualizationBinding();
		if (this._virtualState.frame && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
			window.cancelAnimationFrame(this._virtualState.frame);
		}
		this._virtualState.start = 0;
		this._virtualState.end = 0;
		this._virtualState.page = -1;
		this._virtualState.perPage = -1;
		this._virtualState.frame = 0;
		this._virtualState.lastScrollTop = -1;
		Object.keys(this._virtualSpacers || {}).forEach((key) => {
			const spacer = this._virtualSpacers[key];
			if (spacer && spacer.parentElement) {
				spacer.parentElement.removeChild(spacer);
			}
		});
	}


	_normalizePositiveInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
	}

	_getRoute() {
		const requestOptions = this._params.request || {};
		const attrRoute = this._element.getAttribute('data-request-route');
		const requestRoute = String(requestOptions.route || attrRoute || '').trim();
		if (requestRoute) {
			return requestRoute;
		}
		return this._getFiltersRoute();
	}

	_restorePersistentState() {
		const storedLocale = this._readPersistentState('locale');
		if (storedLocale) {
			this._params.locale = String(storedLocale).toLowerCase().trim();
		}

		const storedFiltersMode = this._readPersistentState('filtersApplyMode');
		if (storedFiltersMode) {
			if (!this._params.filters || typeof this._params.filters !== 'object') {
				this._params.filters = {};
			}
			this._params.filters.apply = this._normalizeFiltersApplyMode(storedFiltersMode);
		}
	}

	_isPersistenceEnabled(key) {
		const persistence = this._params.persistence || {};
		const attrEnabled = this._element.getAttribute('data-persistence-enable');
		const globalEnabled = attrEnabled !== null
			? this._isTruthy(attrEnabled)
			: Boolean(persistence.enable);
		if (!globalEnabled) {
			return false;
		}

		const attrNameMap = {
			locale: 'data-persistence-locale',
			filtersApplyMode: 'data-persistence-filters-apply-mode',
		};
		const attrName = attrNameMap[key];
		if (attrName) {
			const attrValue = this._element.getAttribute(attrName);
			if (attrValue !== null) {
				return this._isTruthy(attrValue);
			}
		}

		return Boolean(persistence[key]);
	}

	_getPersistenceStorageKey(key) {
		const persistence = this._params.persistence || {};
		const explicit = String(persistence.storageKey || this._element.getAttribute('data-persistence-storage-key') || '').trim();
		const base = explicit || this._getPerPageStorageKey().replace('perPage', 'state');
		return `${base}:${key}`;
	}

	_readPersistentState(key) {
		if (!this._isPersistenceEnabled(key)) {
			return '';
		}
		try {
			return String(window.localStorage.getItem(this._getPersistenceStorageKey(key)) || '');
		} catch (error) {
			return '';
		}
	}

	_writePersistentState(key, value) {
		if (!this._isPersistenceEnabled(key)) {
			return;
		}
		try {
			window.localStorage.setItem(this._getPersistenceStorageKey(key), String(value ?? ''));
		} catch (error) {
			// Ignore storage errors.
		}
	}

	_isTruthy(value) {
		const normalized = String(value).toLowerCase().trim();
		return normalized !== 'false' && normalized !== '0' && normalized !== '';
	}

	_getFields() {
		const headerFields = Array.from(this._element.querySelectorAll('thead th[data-field]'))
			.map((cell) => (cell.getAttribute('data-field') || '').trim())
			.filter(Boolean);

		if (headerFields.length) {
			return headerFields;
		}

		return ['sku', 'name', 'category', 'price', 'stock', 'rating'];
	}

	_getBody() {
		if (this._element.tBodies && this._element.tBodies[0]) {
			return this._element.tBodies[0];
		}

		const body = document.createElement('tbody');
		this._element.appendChild(body);
		return body;
	}

	_getRemoteResponseMode() {
		const requestOptions = this._params.request || {};
		const attrResponseMode = this._element.getAttribute('data-request-responsemode');
		const raw = attrResponseMode !== null ? attrResponseMode : requestOptions.responsemode;
		const normalized = String(raw || 'data').toLowerCase().trim();
		if (normalized === 'view' || normalized === 'auto') {
			return normalized;
		}
		return 'data';
	}

	_getRemoteViewParamName() {
		const requestOptions = this._params.request || {};
		const attr = this._element.getAttribute('data-request-viewparam');
		const raw = attr !== null ? attr : requestOptions.viewparam;
		const normalized = String(raw || '').trim();
		return normalized || '';
	}

	_getRemoteViewParamValue() {
		const requestOptions = this._params.request || {};
		const attr = this._element.getAttribute('data-request-viewvalue');
		const raw = attr !== null ? attr : requestOptions.viewvalue;
		const normalized = String(raw || '').trim();
		return normalized || '';
	}

	_getRemoteFieldsParamName() {
		const requestOptions = this._params.request || {};
		const attr = this._element.getAttribute('data-request-fieldsparam');
		const raw = attr !== null ? attr : requestOptions.fieldsparam;
		const normalized = String(raw || '').trim();
		return normalized || '';
	}

	_getRemoteDataRoute() {
		const filtersRoute = this._getFiltersRoute();
		if (filtersRoute) {
			return filtersRoute;
		}
		return this._getRoute();
	}

	_getRequestParamMap() {
		const requestOptions = this._params.request || {};
		const fromOptions = requestOptions.parammap;
		if (fromOptions && typeof fromOptions === 'object' && !Array.isArray(fromOptions)) {
			return fromOptions;
		}

		const attr = this._element.getAttribute('data-request-parammap') || '';
		if (!attr) {
			return {};
		}

		try {
			const parsed = JSON.parse(attr);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				return parsed;
			}
		} catch (error) {
			return {};
		}

		return {};
	}

	_mapRemoteRequestParams(params = {}) {
		const map = this._getRequestParamMap();
		const result = {};
		Object.keys(params || {}).forEach((key) => {
			const target = Object.prototype.hasOwnProperty.call(map, key)
				? String(map[key] || '').trim()
				: key;
			const nextKey = target || key;
			result[nextKey] = params[key];
		});
		return result;
	}

	_getRequestPath(type) {
		const requestOptions = this._params.request || {};
		if (type === 'data') {
			const attrData = this._element.getAttribute('data-request-datapath');
			const raw = attrData !== null ? attrData : requestOptions.datapath;
			return String(raw || '').trim();
		}
		if (type === 'meta') {
			const attrMeta = this._element.getAttribute('data-request-metapath');
			const raw = attrMeta !== null ? attrMeta : requestOptions.metapath;
			return String(raw || '').trim();
		}
		if (type === 'view') {
			const attrView = this._element.getAttribute('data-request-viewpath');
			const raw = attrView !== null ? attrView : requestOptions.viewpath;
			return String(raw || '').trim();
		}
		return '';
	}

	_readPath(source, path) {
		if (!source || typeof source !== 'object') {
			return undefined;
		}
		const normalized = String(path || '').trim();
		if (!normalized) {
			return undefined;
		}
		const parts = normalized.split('.').map((item) => String(item || '').trim()).filter(Boolean);
		if (!parts.length) {
			return undefined;
		}
		let current = source;
		for (let i = 0; i < parts.length; i += 1) {
			if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, parts[i])) {
				return undefined;
			}
			current = current[parts[i]];
		}
		return current;
	}

	_extractRemoteRows(response) {
		const configured = this._readPath(response, this._getRequestPath('data'));
		if (Array.isArray(configured)) {
			return configured;
		}
		return Array.isArray(response && response.data) ? response.data : [];
	}

	_extractRemoteMeta(response) {
		const configured = this._readPath(response, this._getRequestPath('meta'));
		if (configured && typeof configured === 'object' && !Array.isArray(configured)) {
			return configured;
		}
		return response && typeof response === 'object' && response.meta && typeof response.meta === 'object'
			? response.meta
			: {};
	}

	_extractRemoteViewRowsHtml(response) {
		if (!response || typeof response !== 'object') {
			return '';
		}

		const configured = this._readPath(response, this._getRequestPath('view'));
		if (typeof configured === 'string') {
			return configured;
		}

		if (typeof response.view === 'string') {
			return response.view;
		}

		const view = response.view && typeof response.view === 'object' ? response.view : null;
		if (view && typeof view.tbody === 'string') {
			return view.tbody;
		}
		if (view && typeof view.rows === 'string') {
			return view.rows;
		}

		if (typeof response.tbody === 'string') {
			return response.tbody;
		}

		return '';
	}

	_renderRemoteViewIfConfigured(viewRowsHtml, rows) {
		const mode = this._getRemoteResponseMode();
		const canUseView = typeof viewRowsHtml === 'string' && viewRowsHtml.trim() !== '';
		const shouldUseView = mode === 'view' || (mode === 'auto' && canUseView);
		if (!shouldUseView) {
			return false;
		}

		if (!canUseView) {
			if (Array.isArray(rows) && rows.length) {
				return false;
			}
			const message = this._getTableMessage('stateEmpty', 'РќРёС‡РµРіРѕ РЅРµС‚');
			this._renderStateRow(message, 'empty');
			return true;
		}

		const body = this._getBody();
		body.innerHTML = viewRowsHtml;
		if (!this._hasRenderableRowsInBody(body)) {
			this._renderStateRow(this._getTableMessage('stateEmpty', 'РќРёС‡РµРіРѕ РЅРµС‚'), 'empty');
			return true;
		}
		this._setFixedColumnsSuppressed(false);
		this._clearStateMode();
		return true;
	}

	_initSorting() {
		const sortOptions = this._params.sortable || {};
		if (!sortOptions.enable) {
			return;
		}
		const sortableI18n = this._getI18nSection('sortable');
		const attrMulti = this._element.getAttribute('data-sort-multi');
		const multiSort = attrMulti === null
			? Boolean(sortOptions.multi)
			: String(attrMulti).toLowerCase().trim() !== 'false';
		const attrMultiWithShift = this._element.getAttribute('data-sort-multi-with-shift');
		const multiSortWithShift = attrMultiWithShift === null
			? (sortOptions.multiWithShift !== undefined ? Boolean(sortOptions.multiWithShift) : true)
			: String(attrMultiWithShift).toLowerCase().trim() !== 'false';
		const attrHideUnsortedArrows = this._element.getAttribute('data-sort-hide-unsorted-arrows');
		const hideUnsortedArrows = attrHideUnsortedArrows === null
			? Boolean(sortOptions.hideUnsortedArrows)
			: String(attrHideUnsortedArrows).toLowerCase().trim() !== 'false';

		this._sortable = new Sortable(this._element, {
			initialField: this._sortState.field,
			initialDir: this._sortState.dir,
			ascLabel: sortableI18n.ascLabel,
			descLabel: sortableI18n.descLabel,
			multiSort,
			multiSortWithShift,
			hideUnsortedArrows,
			isColumnSortable: (header, index) => {
				if (!this._isHeaderSortableByConfig(header, index, sortOptions)) {
					return false;
				}
				const userCheck = typeof sortOptions.isColumnSortable === 'function'
					? Boolean(sortOptions.isColumnSortable(header))
					: true;
				return userCheck;
			},
			onChange: (payload) => this._handleSortChange(payload),
		});
		this._sortable.init();
		if (this._sortState.sorts && this._sortState.sorts.length) {
			this._sortable.setState({ sorts: this._sortState.sorts });
		}
		this._refreshStickyAndFixedLayout();
	}

	_initColumnReorder() {
		const enabled = this._isColumnReorderEnabled();
		this._columnReorderState.enabled = enabled;
		if (!enabled) {
			return;
		}

		this._applyStoredColumnOrder();
		this._syncColumnReorderHeaders();
		this._bindColumnReorder();
	}

	_initColumnResize() {
		const enabled = this._isColumnResizeEnabled();
		this._columnResizeState.enabled = enabled;
		if (!enabled) {
			return;
		}
		this._syncColumnResizeHeaders();
		this._bindColumnResize();
	}

	_initExpandable() {
		if (!this._isExpandableEnabled()) {
			if (this._expandable && typeof this._expandable.destroy === 'function') {
				this._expandable.destroy();
			}
			this._expandable = null;
			return;
		}

		const config = this._getExpandableConfig();
		if (this._expandable && typeof this._expandable.destroy === 'function') {
			this._expandable.destroy();
		}
		this._expandable = new Expandable(this._element, Object.assign({}, config, {
			onToggle: (payload) => {
				this._emitAction('rowtoggle', payload);
				this._emitAction(payload.collapsed ? 'rowcollapse' : 'rowexpand', payload);
				this._renderFooterFromCurrentState();
				this._refreshStickyAndFixedLayout();
			},
		}));
		this._expandable.init();
	}

	_refreshExpandable() {
		if (!this._expandable || typeof this._expandable.refresh !== 'function') {
			return;
		}
		this._expandable.refresh();
	}

	_isExpandableEnabled() {
		const options = this._params.expandable || {};
		const attr = this._element.getAttribute('data-expandable-enable');
		if (attr !== null) {
			return this._isTruthy(attr);
		}
		return Boolean(options.enable);
	}

	_getExpandableConfig() {
		const options = this._params.expandable || {};
		const attrId = this._element.getAttribute('data-expandable-id-attr');
		const attrParent = this._element.getAttribute('data-expandable-parent-attr');
		const attrToggle = this._element.getAttribute('data-expandable-toggle-selector');
		const attrCollapsed = this._element.getAttribute('data-expandable-collapsed');

		return {
			enable: true,
			idAttr: String(attrId !== null ? attrId : options.idAttr || 'data-expand-id').trim() || 'data-expand-id',
			parentAttr: String(attrParent !== null ? attrParent : options.parentAttr || 'data-expand-parent-id').trim() || 'data-expand-parent-id',
			toggleSelector: String(attrToggle !== null ? attrToggle : options.toggleSelector || '[data-expand-toggle]').trim() || '[data-expand-toggle]',
			collapsed: attrCollapsed !== null ? this._isTruthy(attrCollapsed) : Boolean(options.collapsed),
		};
	}


	_isColumnResizeEnabled() {
		const options = this._params.columnResize || {};
		const attr = this._element.getAttribute('data-column-resize-enable');
		if (attr !== null) {
			return this._isTruthy(attr);
		}
		return Boolean(options.enable);
	}

	_syncColumnResizeHeaders() {
		const headers = this._getHeaderCells();
		headers.forEach((header) => {
			if (!header.querySelector('[data-col-resize-handle]')) {
				const handle = document.createElement('span');
				handle.className = 'vgdt-col-resize-handle';
				handle.setAttribute('data-col-resize-handle', '1');
				handle.setAttribute('role', 'separator');
				handle.setAttribute('aria-hidden', 'true');
				header.appendChild(handle);
			}
			header.setAttribute('data-col-resize', '1');
		});
	}

	_bindColumnResize() {
		if (this._columnResizeState.bound) {
			return;
		}
		const state = this._columnResizeState;

		state.onMouseDown = (event) => {
			const handle = event.target && event.target.closest ? event.target.closest('[data-col-resize-handle]') : null;
			if (!handle) {
				return;
			}
			const header = handle.closest('th');
			const index = this._findHeaderIndex(header);
			if (index < 0) {
				return;
			}
			event.preventDefault();
			state.active = true;
			state.index = index;
			state.startX = event.clientX;
			state.startWidth = Math.max(1, header.getBoundingClientRect().width || header.offsetWidth || 1);
			this._element.classList.add('is-col-resizing');
		};

		state.onMouseMove = (event) => {
			if (!state.active || state.index < 0) {
				return;
			}
			const options = this._params.columnResize || {};
			const minWidth = Math.max(40, this._normalizePositiveInt(options.minwidth, 80));
			const maxWidth = Math.max(minWidth, this._normalizePositiveInt(options.maxwidth, 600));
			state.nextWidth = Math.min(maxWidth, Math.max(minWidth, Math.round(state.startWidth + (event.clientX - state.startX))));
			if (state.frame) {
				return;
			}
			if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
				this._applyColumnWidth(state.index, state.nextWidth);
				return;
			}
			state.frame = window.requestAnimationFrame(() => {
				state.frame = 0;
				if (!state.active || state.index < 0) {
					return;
				}
				this._applyColumnWidth(state.index, state.nextWidth);
			});
		};

		state.onMouseUp = () => {
			if (!state.active) {
				return;
			}
			if (state.frame && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
				window.cancelAnimationFrame(state.frame);
				state.frame = 0;
			}
			if (state.index >= 0 && state.nextWidth > 0) {
				this._applyColumnWidth(state.index, state.nextWidth);
			}
			state.active = false;
			state.index = -1;
			state.nextWidth = 0;
			this._element.classList.remove('is-col-resizing');
			this._refreshStickyAndFixedLayout();
			this._emitAction('columnresize', {});
		};

		this._element.addEventListener('mousedown', state.onMouseDown);
		document.addEventListener('mousemove', state.onMouseMove);
		document.addEventListener('mouseup', state.onMouseUp);
		state.bound = true;
	}

	_applyColumnWidth(index, widthPx) {
		const sections = [];
		if (this._element.tHead) {
			sections.push(this._element.tHead);
		}
		if (this._element.tBodies && this._element.tBodies.length) {
			sections.push(...Array.from(this._element.tBodies));
		}
		if (this._element.tFoot) {
			sections.push(this._element.tFoot);
		}

		sections.forEach((section) => {
			Array.from(section.rows || []).forEach((row) => {
				const cell = row.cells && row.cells[index] ? row.cells[index] : null;
				if (!cell) {
					return;
				}
				cell.style.width = `${widthPx}px`;
				cell.style.minWidth = `${widthPx}px`;
				cell.style.maxWidth = `${widthPx}px`;
			});
		});
	}

	_isColumnReorderEnabled() {
		const options = this._params.columnReorder || {};
		const attr = this._element.getAttribute('data-column-reorder-enable');
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}
		return Boolean(options.enable);
	}

	_isColumnReorderPersistEnabled() {
		const options = this._params.columnReorder || {};
		const attr = this._element.getAttribute('data-column-reorder-persist');
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}
		return Boolean(options.persist);
	}

	_getColumnReorderStorageKey() {
		const options = this._params.columnReorder || {};
		const attrStorageKey = this._element.getAttribute('data-column-reorder-storage-key') || '';
		const explicit = String(options.storageKey || attrStorageKey).trim();
		if (explicit) {
			return explicit;
		}
		return `${this._getPerPageStorageKey()}:columnOrder`;
	}

	_bindColumnReorder() {
		if (this._columnReorderState.bound) {
			return;
		}

		this._columnReorderState.onDragStart = (event) => {
			const th = event.target && event.target.closest ? event.target.closest('th[data-col-reorder="1"]') : null;
			if (!th || !this._element.contains(th)) {
				return;
			}
			if (this._isHeaderFixedForColumnReorder(th)) {
				return;
			}

			const fromIndex = this._findHeaderIndex(th);
			if (fromIndex < 0) {
				return;
			}

			this._columnReorderState.fromIndex = fromIndex;
			this._columnReorderState.toIndex = fromIndex;
			this._columnReorderState.isDragging = true;
			this._element.classList.add('is-col-dragging');
			th.setAttribute('data-col-dragging', '1');

			if (event.dataTransfer) {
				event.dataTransfer.effectAllowed = 'move';
				try {
					event.dataTransfer.setData('text/plain', String(fromIndex));
				} catch (error) {
					// Ignore setData errors.
				}
			}
		};

		this._columnReorderState.onDragOver = (event) => {
			if (!this._columnReorderState.isDragging) {
				return;
			}
			const th = event.target && event.target.closest ? event.target.closest('th[data-col-reorder="1"]') : null;
			if (!th || !this._element.contains(th)) {
				return;
			}
			if (this._isHeaderFixedForColumnReorder(th)) {
				return;
			}
			event.preventDefault();
			const toIndex = this._findHeaderIndex(th);
			if (toIndex < 0) {
				return;
			}
			this._columnReorderState.toIndex = toIndex;
			this._syncColumnDragOverMarker(toIndex);
		};

		this._columnReorderState.onDrop = (event) => {
			if (!this._columnReorderState.isDragging) {
				return;
			}
			event.preventDefault();
			const th = event.target && event.target.closest ? event.target.closest('th[data-col-reorder="1"]') : null;
			if (!th || !this._element.contains(th)) {
				return;
			}
			if (this._isHeaderFixedForColumnReorder(th)) {
				this._resetColumnDragMarkers();
				return;
			}
			const toIndex = this._findHeaderIndex(th);
			if (toIndex < 0) {
				return;
			}

			const fromIndex = this._columnReorderState.fromIndex;
			this._resetColumnDragMarkers();
			this._finalizeColumnReorder(fromIndex, toIndex);
		};

		this._columnReorderState.onDragEnd = () => {
			this._resetColumnDragMarkers();
		};

		this._element.addEventListener('dragstart', this._columnReorderState.onDragStart);
		this._element.addEventListener('dragover', this._columnReorderState.onDragOver);
		this._element.addEventListener('drop', this._columnReorderState.onDrop);
		this._element.addEventListener('dragend', this._columnReorderState.onDragEnd);
		this._columnReorderState.bound = true;
	}

	_syncColumnReorderHeaders() {
		if (!this._columnReorderState.enabled) {
			return;
		}
		const headers = this._getHeaderCells();
		headers.forEach((header) => {
			header.setAttribute('data-col-reorder', '1');
			const draggable = this._isHeaderFixedForColumnReorder(header) ? 'false' : 'true';
			header.setAttribute('draggable', draggable);
		});
	}

	_syncColumnDragOverMarker(index) {
		const headers = this._getHeaderCells();
		headers.forEach((header, headerIndex) => {
			if (headerIndex === index) {
				header.setAttribute('data-col-drag-over', '1');
			} else {
				header.removeAttribute('data-col-drag-over');
			}
		});
		const cloneHeaders = this._cloneStickyState && this._cloneStickyState.head
			? Array.from(this._cloneStickyState.head.querySelectorAll('th'))
			: [];
		cloneHeaders.forEach((header, headerIndex) => {
			if (headerIndex === index) {
				header.setAttribute('data-col-drag-over', '1');
			} else {
				header.removeAttribute('data-col-drag-over');
			}
		});
	}

	_resetColumnDragMarkers() {
		const headers = this._getHeaderCells();
		headers.forEach((header) => {
			header.removeAttribute('data-col-drag-over');
			header.removeAttribute('data-col-dragging');
		});
		const cloneHeaders = this._cloneStickyState && this._cloneStickyState.head
			? Array.from(this._cloneStickyState.head.querySelectorAll('th'))
			: [];
		cloneHeaders.forEach((header) => {
			header.removeAttribute('data-col-drag-over');
			header.removeAttribute('data-col-dragging');
		});
		this._columnReorderState.fromIndex = -1;
		this._columnReorderState.toIndex = -1;
		this._columnReorderState.isDragging = false;
		this._element.classList.remove('is-col-dragging');
	}

	_finalizeColumnReorder(fromIndex, toIndex) {
		if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
			return;
		}

		this._moveColumn(fromIndex, toIndex);
		this._normalizeFixedColumnsOrder();
		this._afterColumnReorder();
	}

	_moveColumn(fromIndex, toIndex) {
		const sections = [];
		if (this._element.tHead) {
			sections.push(this._element.tHead);
		}
		if (this._element.tBodies && this._element.tBodies.length) {
			sections.push(...Array.from(this._element.tBodies));
		}
		if (this._element.tFoot) {
			sections.push(this._element.tFoot);
		}

		sections.forEach((section) => {
			Array.from(section.rows || []).forEach((row) => {
				const cells = Array.from(row.cells || []);
				if (fromIndex < 0 || fromIndex >= cells.length || toIndex < 0 || toIndex >= cells.length) {
					return;
				}
				const movingCell = cells[fromIndex];
				const referenceCell = fromIndex < toIndex ? cells[toIndex].nextSibling : cells[toIndex];
				row.insertBefore(movingCell, referenceCell || null);
			});
		});
	}

	_afterColumnReorder() {
		this._fields = this._getFields();

		const normalizedSorts = this._getNormalizedSorts(this._sortState.sorts || []);
		const primarySort = normalizedSorts[0] || null;
		this._sortState = {
			field: primarySort ? primarySort.field : '',
			dir: primarySort ? primarySort.dir : this._normalizeSortDir(this._sortState.dir),
			columnIndex: primarySort ? primarySort.columnIndex : -1,
			sorts: normalizedSorts,
		};

		if (this._sortable && typeof this._sortable.refresh === 'function') {
			this._sortable.refresh({ sorts: normalizedSorts });
		}

		this._syncColumnReorderHeaders();
		this._refreshStickyAndFixedLayout();
		this._syncUrlState();
		this._storeColumnOrder();
		const order = this._getCurrentColumnOrder();
		this._emitAction('columnreorder', { order });
	}

	_getCurrentColumnOrder() {
		return this._getHeaderCells()
			.map((header) => String(header.getAttribute('data-field') || '').trim())
			.filter(Boolean);
	}

	_storeColumnOrder() {
		if (!this._isColumnReorderPersistEnabled()) {
			return;
		}
		const order = this._getCurrentColumnOrder();
		if (!order.length) {
			return;
		}
		try {
			window.localStorage.setItem(this._getColumnReorderStorageKey(), order.join(','));
		} catch (error) {
			// Ignore storage errors.
		}
	}

	_readStoredColumnOrder() {
		if (!this._isColumnReorderPersistEnabled()) {
			return [];
		}
		try {
			const raw = String(window.localStorage.getItem(this._getColumnReorderStorageKey()) || '').trim();
			if (!raw) {
				return [];
			}
			return raw.split(',').map((item) => item.trim()).filter(Boolean);
		} catch (error) {
			return [];
		}
	}

	_applyStoredColumnOrder() {
		const order = this._readStoredColumnOrder();
		if (!order.length) {
			return;
		}

		let changed = false;
		order.forEach((field, targetIndex) => {
			const currentIndex = this._findHeaderIndexByField(field);
			if (currentIndex < 0 || currentIndex === targetIndex) {
				return;
			}
			this._moveColumn(currentIndex, targetIndex);
			changed = true;
		});
		if (this._normalizeFixedColumnsOrder()) {
			changed = true;
		}

		if (changed) {
			this._afterColumnReorder();
		}
	}

	_isHeaderFixedForColumnReorder(header) {
		if (!header) {
			return false;
		}
		const fixedSide = String(header.getAttribute('data-fixed-side') || '').toLowerCase().trim();
		if (fixedSide === 'left' || fixedSide === 'right') {
			return true;
		}
		const fixedAttr = String(header.getAttribute('data-fixed') || '').toLowerCase().trim();
		const fixedColumnAttr = String(header.getAttribute('data-fixed-column') || '').toLowerCase().trim();
		if (fixedAttr === 'left' || fixedAttr === 'right' || fixedColumnAttr === 'left' || fixedColumnAttr === 'right') {
			return true;
		}
		const index = this._findHeaderIndex(header);
		if (index < 0) {
			return false;
		}
		const fixed = this._getFixedColumnsByHeaders(this._getHeaderCells(), {
			parseTableAttr: true,
			fallbackByPosition: true,
		});
		return fixed.left.includes(index) || fixed.right.includes(index);
	}

	_normalizeFixedColumnsOrder() {
		const headers = this._getHeaderCells();
		if (!headers.length) {
			return false;
		}

		const fixed = this._getFixedColumnsByHeaders(headers, {
			parseTableAttr: true,
			fallbackByPosition: true,
		});
		if (!fixed.left.length && !fixed.right.length) {
			return false;
		}

		const leftHeaders = fixed.left.map((index) => headers[index]).filter(Boolean);
		const rightHeaders = fixed.right.map((index) => headers[index]).filter(Boolean);
		let changed = false;
		let targetLeft = 0;
		leftHeaders.forEach((header) => {
			const currentIndex = this._findHeaderIndex(header);
			if (currentIndex >= 0 && currentIndex !== targetLeft) {
				this._moveColumn(currentIndex, targetLeft);
				changed = true;
			}
			targetLeft += 1;
		});

		let targetRight = this._getHeaderCells().length - 1;
		for (let index = rightHeaders.length - 1; index >= 0; index -= 1) {
			const header = rightHeaders[index];
			const currentIndex = this._findHeaderIndex(header);
			if (currentIndex >= 0 && currentIndex !== targetRight) {
				this._moveColumn(currentIndex, targetRight);
				changed = true;
			}
			targetRight -= 1;
		}

		return changed;
	}

	_initSearch() {
		if (!this._isRemote) {
			return;
		}

		const searchOptions = this._params.search || {};
		if (!this._isSearchEnabled()) {
			return;
		}

		const inputSelector = this._getSearchInputSelector();
		if (!inputSelector) {
			return;
		}

		const attrParam = this._element.getAttribute('data-search-param') || '';
		const param = String(searchOptions.param || attrParam || 'q').trim() || 'q';
		if (Object.prototype.hasOwnProperty.call(this._remoteParams, param)) {
			const input = this._getSearchInputNode(inputSelector);
			if (input && input.value !== this._remoteParams[param]) {
				input.value = this._remoteParams[param];
			}
		}

		if (this._search && typeof this._search.destroy === 'function') {
			this._search.destroy();
		}

		this._search = new Search({
			enabled: true,
			debounceMs: searchOptions.debounce,
			inputSelector,
			param,
			onSearch: ({ value, param: searchParam }) => {
				const next = {};
				next[searchParam] = value;
				const filtersState = this._getCurrentFiltersEventState();
				const emitFullContext = this._isFiltersEmitFullContextEnabled();
				const isSearched = this._isSearchedValue(value);
				this._emitAction('search', {
					param: searchParam,
					value,
				});
				if (!this._isRemote || !emitFullContext) {
					this._emitAction('filterschange', {
						filters: Object.assign({}, filtersState.filters || {}),
						params: Object.assign({}, filtersState.params || {}),
						fields: Array.isArray(filtersState.fields) ? filtersState.fields.slice() : [],
						meta: Object.assign({}, filtersState.meta || {}),
						phase: 'change',
						isFiltered: this._isFilteredState(filtersState) || isSearched,
						isSearched,
					});
				}
				this.updateRemoteParams(next, {
					replace: false,
					resetPage: true,
					reload: true,
					trigger: emitFullContext ? 'filterschange' : '',
					filtersState: emitFullContext ? filtersState : null,
				});
			},
		});
		this._search.init();
	}

	_getSearchInputSelector() {
		const searchOptions = this._params.search || {};
		const attrSelector = this._element.getAttribute('data-search-input') || '';
		return String(searchOptions.input || attrSelector).trim();
	}

	_getSearchInputNode(selector = '') {
		const nextSelector = String(selector || this._getSearchInputSelector() || '').trim();
		if (!nextSelector) {
			this._searchInputCacheSelector = '';
			this._searchInputCacheNode = null;
			return null;
		}
		const shouldRefresh = this._searchInputCacheSelector !== nextSelector
			|| !this._searchInputCacheNode
			|| !this._searchInputCacheNode.isConnected;
		if (shouldRefresh) {
			this._searchInputCacheSelector = nextSelector;
			this._searchInputCacheNode = document.querySelector(nextSelector);
		}
		return this._searchInputCacheNode;
	}

	_initFilters() {
		const filterOptions = this._params.filters || {};
		if (!this._isFiltersEnabled()) {
			return;
		}

		const formNode = filterOptions.form && filterOptions.form.nodeType === 1
			? filterOptions.form
			: null;
		const attrSelector = this._element.getAttribute('data-filters-form') || '';
		const formSelector = formNode
			? ''
			: (typeof filterOptions.form === 'string'
				? String(filterOptions.form).trim()
				: String(attrSelector).trim());
		if (!formNode && !formSelector) {
			return;
		}
		const attrApplyMode = this._element.getAttribute('data-filters-apply') || '';
		const applyMode = this._normalizeFiltersApplyMode(filterOptions.apply || attrApplyMode || 'auto');
		this._writePersistentState('filtersApplyMode', applyMode);
		const initialValues = this._getInitialFilterValues();
		const button = filterOptions.button && typeof filterOptions.button === 'object'
			? filterOptions.button
			: {};

		if (this._filters && typeof this._filters.destroy === 'function') {
			this._filters.destroy();
		}

		this._filters = new Filters({
			enabled: true,
			formSelector,
			formNode,
			debounceMs: filterOptions.debounce,
			applyMode,
			button: {
				apply: String(
					button.apply
					|| this._element.getAttribute('data-filters-button-apply')
					|| '[data-filter-apply]'
				).trim(),
				reset: String(
					button.reset
					|| this._element.getAttribute('data-filters-button-reset')
					|| '[data-filter-reset]'
				).trim(),
			},
			fieldAttr: filterOptions.fieldAttr,
			partAttr: filterOptions.partAttr,
			typeAttr: filterOptions.typeAttr,
			valueAttr: filterOptions.valueAttr,
			operatorAttr: filterOptions.operatorAttr,
			defaultOperator: filterOptions.defaultOperator,
			skipEmpty: filterOptions.skipEmpty,
			trimValues: filterOptions.trimValues,
			initialValues,
			onReset: () => {
				const searchSelector = this._getSearchInputSelector();
				if (!searchSelector) {
					return;
				}
				const searchInput = this._getSearchInputNode(searchSelector);
				if (searchInput) {
					searchInput.value = '';
				}
				const searchParam = this._getSearchParamName();
				if (!searchParam) {
					return;
				}
				delete this._remoteParams[searchParam];
			},
			onChange: (state) => {
				const normalizedState = this._normalizeFiltersEventState(state);
				this._activeFilters = Object.assign({}, normalizedState.filters || {});
				if (!this._isRemote || !this._isFiltersEmitFullContextEnabled()) {
					this._emitAction('filterschange', {
						filters: Object.assign({}, normalizedState.filters || {}),
						params: Object.assign({}, normalizedState.params || {}),
						fields: Array.isArray(normalizedState.fields) ? normalizedState.fields.slice() : [],
						meta: Object.assign({}, normalizedState.meta || {}),
						phase: 'change',
						isFiltered: this._isFilteredState(normalizedState) || this._isSearchActiveFromParams(this._remoteParams || {}),
						isSearched: this._isSearchActiveFromParams(this._remoteParams || {}),
					});
				}
				this._handleFiltersStateChange(normalizedState);
			},
		});
		this._filters.init();
	}

	_handleFiltersStateChange(state) {
		const rawNextParams = state && state.params && typeof state.params === 'object'
			? state.params
			: {};
		const nextParams = this._buildFilterRemoteParamsPatch(rawNextParams);
		const filterOptions = this._params.filters || {};
		const resetPage = filterOptions.resetPageOnChange === undefined
			? true
			: Boolean(filterOptions.resetPageOnChange);

		if (this._isRemote) {
			const emitFullContext = this._isFiltersEmitFullContextEnabled();
			this.updateRemoteParams(nextParams, {
				replace: false,
				resetPage,
				reload: true,
				trigger: emitFullContext ? 'filterschange' : '',
				filtersState: emitFullContext ? this._normalizeFiltersEventState(state) : null,
			});
			return;
		}

		this._remoteParams = Object.assign({}, nextParams);
		this._applyLocalFilters();
		if (this._isPaginationEnabled() && this._pagination) {
			const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
			const nextPage = resetPage ? 1 : this._pageState.page;
			const totalPages = this._getTotalPages(perPage);
			const safePage = Math.max(1, Math.min(nextPage, totalPages));
			this._pageState = { page: safePage, perPage };
			this._pagination.setMeta({
				page: safePage,
				perPage,
				totalPages,
			});
			this._renderPageRows(safePage, perPage);
		} else {
			const page = this._pageState.page || 1;
			const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
			this._renderPageRows(page, perPage);
		}
		this._refreshStickyAndFixedLayout();
		this._syncUrlState();
	}

	_buildFilterRemoteParamsPatch(nextFilterParams = {}) {
		const source = nextFilterParams && typeof nextFilterParams === 'object'
			? nextFilterParams
			: {};
		const patch = {};
		const keys = this._getFilterFieldKeys();

		keys.forEach((field) => {
			const normalizedField = String(field || '').trim();
			if (!normalizedField) {
				return;
			}

			if (Object.prototype.hasOwnProperty.call(source, normalizedField)) {
				patch[normalizedField] = source[normalizedField];
			} else {
				patch[normalizedField] = '';
			}

			const operatorKey = `${normalizedField}_op`;
			if (Object.prototype.hasOwnProperty.call(source, operatorKey)) {
				patch[operatorKey] = source[operatorKey];
			} else {
				patch[operatorKey] = '';
			}
		});

		Object.keys(source).forEach((key) => {
			if (!Object.prototype.hasOwnProperty.call(patch, key)) {
				patch[key] = source[key];
			}
		});

		return patch;
	}

	_normalizeFiltersEventState(state) {
		const source = state && typeof state === 'object' ? state : {};
		const filters = source.filters && typeof source.filters === 'object'
			? Object.assign({}, source.filters)
			: {};
		const params = source.params && typeof source.params === 'object'
			? Object.assign({}, source.params)
			: {};
		const explicitFields = Array.isArray(source.fields)
			? source.fields.slice().map((field) => String(field || '').trim()).filter(Boolean)
			: Object.keys(filters);
		const inferredFromParams = Object.keys(params)
			.map((key) => String(key || '').trim())
			.filter((key) => key !== '' && !/_op$/i.test(key))
			.filter((key) => this._isNonEmptyFilterParamValue(params[key]))
			.map((key) => key.replace(/_value$/i, ''));
		const fields = Array.from(new Set(explicitFields.concat(inferredFromParams)));
		const meta = source.meta && typeof source.meta === 'object'
			? Object.assign({}, source.meta)
			: {};
		if (!Object.prototype.hasOwnProperty.call(meta, 'count')) {
			meta.count = fields.length;
		}
		return {
			filters,
			params,
			fields,
			meta,
		};
	}

	_isFiltersEmitFullContextEnabled() {
		const filters = this._params.filters || {};
		const attr = this._element.getAttribute('data-filters-emit-full-context');
		if (attr !== null) {
			return this._isTruthy(attr);
		}
		if (filters.emitFullContext === undefined || filters.emitFullContext === null) {
			return true;
		}
		return Boolean(filters.emitFullContext);
	}

	_isFilteredState(state) {
		const normalizedState = this._normalizeFiltersEventState(state);
		if (normalizedState.fields.length > 0) {
			return true;
		}
		return Object.keys(normalizedState.params || {})
			.some((key) => {
				const normalizedKey = String(key || '').trim();
				if (!normalizedKey || /_op$/i.test(normalizedKey)) {
					return false;
				}
				return this._isNonEmptyFilterParamValue(normalizedState.params[normalizedKey]);
			});
	}

	_getCurrentFiltersEventState() {
		let state = null;
		if (this._filters && typeof this._filters.getState === 'function') {
			state = this._normalizeFiltersEventState(this._filters.getState());
			this._activeFilters = Object.assign({}, state.filters || {});
		}

		if (!state) {
			const params = this._extractFilterParamsFromRemoteParams(this._remoteParams || {});
			state = this._normalizeFiltersEventState({
				filters: Object.assign({}, this._activeFilters || {}),
				params,
			});
		}

		return state;
	}

	_extractFilterParamsFromRemoteParams(sourceParams = {}) {
		const source = sourceParams && typeof sourceParams === 'object'
			? sourceParams
			: {};
		const next = {};
		const keySet = new Set();

		this._getFilterFieldKeys().forEach((key) => keySet.add(key));
		Object.keys(this._activeFilters || {}).forEach((key) => keySet.add(String(key || '').trim()));

		keySet.forEach((key) => {
			const normalizedKey = String(key || '').trim();
			if (!normalizedKey) {
				return;
			}
			if (Object.prototype.hasOwnProperty.call(source, normalizedKey)) {
				next[normalizedKey] = source[normalizedKey];
			}
			const operatorKey = `${normalizedKey}_op`;
			if (Object.prototype.hasOwnProperty.call(source, operatorKey)) {
				next[operatorKey] = source[operatorKey];
			}
		});

		return next;
	}

	_getFiltersRequestMetaIfActive() {
		const filtersState = this._getCurrentFiltersEventState();
		if (!this._isFilteredState(filtersState)) {
			return null;
		}
		return {
			trigger: 'filterschange',
			filtersState,
		};
	}

	_isNonEmptyFilterParamValue(value) {
		if (Array.isArray(value)) {
			return value.some((item) => String(item || '').trim() !== '');
		}
		return value !== undefined && value !== null && String(value).trim() !== '';
	}

	_isSearchedValue(value) {
		return this._isNonEmptyFilterParamValue(value);
	}

	_isSearchActiveFromParams(sourceParams = {}) {
		if (!this._isSearchEnabled()) {
			return false;
		}
		const params = sourceParams && typeof sourceParams === 'object'
			? sourceParams
			: {};
		const searchParam = this._getSearchParamName();
		if (!searchParam || !Object.prototype.hasOwnProperty.call(params, searchParam)) {
			return false;
		}
		return this._isSearchedValue(params[searchParam]);
	}

	_isSearchEnabled() {
		const search = this._params.search || {};
		if (search.enable !== undefined && search.enable !== null) {
			const normalized = String(search.enable).toLowerCase().trim();
			if (normalized === 'true' || normalized === '1') {
				return true;
			}
			if (normalized === 'false' || normalized === '0') {
				return false;
			}
			return Boolean(search.enable);
		}

		const attr = this._element.getAttribute('data-search-enable');
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}

		return false;
	}

	_isFiltersEnabled() {
		const filters = this._params.filters || {};
		if (filters.enable !== undefined && filters.enable !== null) {
			const normalized = String(filters.enable).toLowerCase().trim();
			if (normalized === 'true' || normalized === '1') {
				return true;
			}
			if (normalized === 'false' || normalized === '0') {
				return false;
			}
			return Boolean(filters.enable);
		}

		const attr = this._element.getAttribute('data-filters-enable');
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}

		return false;
	}

	_normalizeFiltersApplyMode(value) {
		const normalized = String(value || 'auto').toLowerCase().trim();
		return normalized === 'manual' ? 'manual' : 'auto';
	}

	_handleSortChange(payload) {
		const normalizedSorts = this._getNormalizedSorts(Array.isArray(payload.sorts) ? payload.sorts : []);
		const primarySort = normalizedSorts[0] || null;
		this._sortState = {
			field: primarySort ? primarySort.field : (payload.field || ''),
			dir: primarySort ? primarySort.dir : this._normalizeSortDir(payload.dir),
			columnIndex: primarySort && Number.isInteger(primarySort.columnIndex) ? primarySort.columnIndex : (Number.isInteger(payload.columnIndex) ? payload.columnIndex : -1),
			sorts: normalizedSorts,
		};
		this._emitAction('sortchange', {
			sort: this._sortState.field,
			dir: this._sortState.dir,
			sorts: this._sortState.sorts.slice(),
			isRemote: this._isRemote,
		});

		if (this._isRemote) {
			const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
			this._pageState = { page: 1, perPage };
			this._loadRemotePage(1, perPage);
			return;
		}

		if (!this._sortState.sorts.length && this._sortState.columnIndex < 0) {
			this._resetLocalRowsOrder();
		} else {
			this._sortLocalRows(this._sortState.sorts.length ? this._sortState.sorts : [{
				field: this._sortState.field,
				dir: this._sortState.dir,
				columnIndex: this._sortState.columnIndex,
			}]);
		}

		if (this._isPaginationEnabled() && this._pagination) {
			const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
			const totalPages = this._getTotalPages(perPage);
			this._pageState = { page: 1, perPage };
			this._storePage(1);
			this._pagination.setMeta({
				page: 1,
				perPage,
				totalPages,
			});
			this._renderPageRows(1, perPage);
		}
		this._refreshExpandable();
		this._renderFooterFromCurrentState();
		this._refreshStickyAndFixedLayout();
		this._syncUrlState();
	}

	_sortLocalRows(sortList) {
		if (!this._rows.length) {
			this._rows = this._getTableRows();
		}

		const normalizedSorts = this._getNormalizedSorts(sortList);
		if (!normalizedSorts.length || !this._rows.length) {
			return;
		}

		this._rows.sort((leftRow, rightRow) => {
			for (let index = 0; index < normalizedSorts.length; index += 1) {
				const sort = normalizedSorts[index];
				const factor = sort.dir === 'desc' ? -1 : 1;
				const columnIndex = sort.columnIndex;
				if (!Number.isInteger(columnIndex) || columnIndex < 0) {
					continue;
				}
				const leftValue = leftRow.cells[columnIndex] ? leftRow.cells[columnIndex].textContent : '';
				const rightValue = rightRow.cells[columnIndex] ? rightRow.cells[columnIndex].textContent : '';
				const compared = this._compareSortableValues(leftValue, rightValue) * factor;
				if (compared !== 0) {
					return compared;
				}
			}
			return 0;
		});

		const body = this._getBody();
		this._rows.forEach((row) => {
			body.appendChild(row);
		});
	}

	_resetLocalRowsOrder() {
		if (!this._originalRows.length) {
			this._originalRows = this._getTableRows();
		}
		this._rows = this._originalRows.slice();

		const body = this._getBody();
		this._rows.forEach((row) => {
			body.appendChild(row);
		});
	}

	_applyLocalFilters() {
		if (!this._originalRows.length) {
			this._originalRows = this._getTableRows();
		}
		const filters = this._activeFilters && typeof this._activeFilters === 'object'
			? this._activeFilters
			: {};
		const filterKeys = Object.keys(filters);
		if (!filterKeys.length) {
			this._rows = this._originalRows.slice();
			this._rows.forEach((row) => {
				row.hidden = false;
			});
			return;
		}

		const fieldIndexMap = this._getFieldIndexMap();
		const filteredRows = [];
		this._originalRows.forEach((row) => {
			const matched = this._rowMatchesFilters(row, filters, fieldIndexMap);
			row.hidden = !matched;
			if (matched) {
				filteredRows.push(row);
			}
		});
		this._rows = filteredRows;
	}

	_getFieldIndexMap() {
		const map = {};
		this._getHeaderCells().forEach((header, index) => {
			const field = String(header.getAttribute('data-field') || '').trim();
			if (field) {
				map[field] = index;
			}
		});
		return map;
	}

	_rowMatchesFilters(row, filters, fieldIndexMap) {
		const keys = Object.keys(filters || {});
		for (let i = 0; i < keys.length; i += 1) {
			const key = keys[i];
			const descriptor = filters[key];
			if (!descriptor || typeof descriptor !== 'object') {
				continue;
			}
			const field = String(descriptor.field || key || '').trim();
			const columnIndex = Object.prototype.hasOwnProperty.call(fieldIndexMap, field)
				? fieldIndexMap[field]
				: -1;
			if (columnIndex < 0) {
				continue;
			}
			const cell = row.cells && row.cells[columnIndex] ? row.cells[columnIndex] : null;
			const cellValue = cell ? String(cell.textContent || '').trim() : '';
			if (!this._matchesFilterValue(cellValue, descriptor)) {
				return false;
			}
		}
		return true;
	}

	_matchesFilterValue(rawCellValue, descriptor) {
		const value = descriptor.values && descriptor.values.length
			? descriptor.values
			: descriptor.value;
		const operator = String(descriptor.operator || descriptor.type || 'eq').toLowerCase().trim();
		const left = String(rawCellValue || '');

		if (Array.isArray(value)) {
			const normalizedValues = value.map((item) => String(item || '').toLowerCase().trim()).filter(Boolean);
			if (!normalizedValues.length) {
				return true;
			}
			return normalizedValues.includes(left.toLowerCase().trim());
		}

		const right = String(value || '');
		if (right === '') {
			return true;
		}

		const leftLower = left.toLowerCase();
		const rightLower = right.toLowerCase();
		const leftNumber = Number.parseFloat(left.replace(',', '.'));
		const rightNumber = Number.parseFloat(right.replace(',', '.'));
		const hasNumbers = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);

		if (operator === 'contains') {
			return leftLower.includes(rightLower);
		}
		if (operator === 'starts') {
			return leftLower.startsWith(rightLower);
		}
		if (operator === 'ends') {
			return leftLower.endsWith(rightLower);
		}
		if (operator === 'neq') {
			if (hasNumbers) {
				return leftNumber !== rightNumber;
			}
			return leftLower !== rightLower;
		}
		if (operator === 'gt' && hasNumbers) {
			return leftNumber > rightNumber;
		}
		if (operator === 'gte' && hasNumbers) {
			return leftNumber >= rightNumber;
		}
		if (operator === 'lt' && hasNumbers) {
			return leftNumber < rightNumber;
		}
		if (operator === 'lte' && hasNumbers) {
			return leftNumber <= rightNumber;
		}
		return hasNumbers ? leftNumber === rightNumber : leftLower === rightLower;
	}

	_compareSortableValues(left, right) {
		const leftNumber = this._extractNumber(left);
		const rightNumber = this._extractNumber(right);

		const leftIsNumber = Number.isFinite(leftNumber);
		const rightIsNumber = Number.isFinite(rightNumber);
		if (leftIsNumber && rightIsNumber) {
			return leftNumber - rightNumber;
		}

		const leftString = String(left || '').trim();
		const rightString = String(right || '').trim();
		return leftString.localeCompare(rightString, 'ru', {
			numeric: true,
			sensitivity: 'base',
		});
	}

	_extractNumber(value) {
		const prepared = String(value || '')
			.replace(/\u00A0/g, '')
			.replace(/\s+/g, '')
			.replace(',', '.')
			.replace(/[^\d.-]/g, '');
		if (prepared === '' || prepared === '-' || prepared === '.') {
			return NaN;
		}
		return Number.parseFloat(prepared);
	}

	_getInitialSortState() {
		const sortOptions = this._params.sortable || {};
		const requestOptions = this._params.request || {};
		const requestParams = requestOptions.params || {};
		const urlParams = this._getUrlParams();
		const remoteFieldParam = 'sort';
		const remoteDirParam = 'dir';
		const field = String(
			sortOptions.initialField
			|| urlParams.get(remoteFieldParam)
			|| requestParams[remoteFieldParam]
			|| this._element.getAttribute('data-sort')
			|| ''
		).trim();
		const dirRaw = (
			sortOptions.initialDir
			|| urlParams.get(remoteDirParam)
			|| requestParams[remoteDirParam]
			|| this._element.getAttribute('data-dir')
			|| 'asc'
		);
		const dir = this._normalizeSortDir(dirRaw);
		const sorts = this._parseSortsFromStrings(field, dirRaw);

		return {
			field,
			dir,
			columnIndex: sorts[0] && Number.isInteger(sorts[0].columnIndex) ? sorts[0].columnIndex : -1,
			sorts,
		};
	}

	_parseSortsFromStrings(sortRaw, dirRaw) {
		const fields = String(sortRaw || '')
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
		const dirs = String(dirRaw || '')
			.split(',')
			.map((item) => this._normalizeSortDir(item));

		const sorts = [];
		fields.forEach((field, index) => {
			const columnIndex = this._findHeaderIndexByField(field);
			sorts.push({
				field,
				dir: dirs[index] || dirs[0] || 'asc',
				columnIndex,
			});
		});
		return this._getNormalizedSorts(sorts);
	}

	_getNormalizedSorts(items) {
		const normalized = [];
		(Array.isArray(items) ? items : []).forEach((item) => {
			const field = String(item && item.field ? item.field : '').trim();
			const columnIndex = Number.isInteger(item && item.columnIndex)
				? item.columnIndex
				: Number.parseInt(item && item.columnIndex, 10);
			const dir = this._normalizeSortDir(item && item.dir ? item.dir : 'asc');

			if (!field && !Number.isInteger(columnIndex)) {
				return;
			}

			const header = this._resolveHeaderForSort(field, columnIndex);
			if (!header) {
				return;
			}
			const resolvedColumnIndex = this._findHeaderIndex(header);
			if (resolvedColumnIndex < 0) {
				return;
			}
			if (!this._isHeaderSortableByConfig(header, resolvedColumnIndex, this._params.sortable || {})) {
				return;
			}

			const resolvedField = String(field || header.getAttribute('data-field') || '').trim();
			if (this._isRemote && !resolvedField) {
				return;
			}

			if (normalized.some((entry) => {
				if (resolvedField && entry.field) {
					return entry.field === resolvedField;
				}
				return entry.columnIndex === resolvedColumnIndex;
			})) {
				return;
			}
			normalized.push({
				field: resolvedField,
				dir,
				columnIndex: resolvedColumnIndex,
			});
		});
		return normalized;
	}

	_isHeaderSortableByConfig(header, index, sortOptions = {}) {
		if (!header) {
			return false;
		}

		const explicitAttr = header.getAttribute('data-sortable');
		if (explicitAttr !== null) {
			const normalized = String(explicitAttr).toLowerCase().trim();
			if (normalized === 'false' || normalized === '0') {
				return false;
			}
		}

		const whitelist = this._getSortableFieldsWhitelist(sortOptions);
		if (whitelist && whitelist.size > 0) {
			const field = String(header.getAttribute('data-field') || '').trim();
			if (!field || !whitelist.has(field)) {
				return false;
			}
		}

		if (this._isRemote) {
			return Boolean(String(header.getAttribute('data-field') || '').trim());
		}

		return true;
	}

	_getSortableFieldsWhitelist(sortOptions = {}) {
		const attrFields = this._element.getAttribute('data-sort-fields');
		const source = attrFields !== null ? attrFields : sortOptions.fields;
		const list = this._normalizeSortableFields(source);
		if (!list.length) {
			return null;
		}
		return new Set(list);
	}

	_normalizeSortableFields(value) {
		if (Array.isArray(value)) {
			return value
				.map((item) => String(item || '').trim())
				.filter(Boolean);
		}

		return String(value || '')
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	_getHeaderCells() {
		const head = this._element.tHead || this._element.querySelector('thead');
		if (!head || !head.rows || !head.rows.length) {
			return [];
		}
		return Array.from(head.rows[0].cells || []);
	}

	_findHeaderIndex(header) {
		if (!header) {
			return -1;
		}
		const headers = this._getHeaderCells();
		return headers.indexOf(header);
	}

	_findHeaderIndexByField(field) {
		const target = String(field || '').trim();
		if (!target) {
			return -1;
		}
		const headers = this._getHeaderCells();
		return headers.findIndex((header) => String(header.getAttribute('data-field') || '').trim() === target);
	}

	_resolveHeaderForSort(field, columnIndex) {
		const headers = this._getHeaderCells();
		const normalizedField = String(field || '').trim();
		if (normalizedField) {
			const byField = headers.find((header) => String(header.getAttribute('data-field') || '').trim() === normalizedField);
			if (byField) {
				return byField;
			}
		}

		if (Number.isInteger(columnIndex) && columnIndex >= 0 && columnIndex < headers.length) {
			return headers[columnIndex];
		}

		return null;
	}

	_getInitialPage() {
		const fromUrl = this._normalizePositiveInt(this._getUrlParams().get('page'), 0);
		if (fromUrl > 0) {
			return fromUrl;
		}
		const requestOptions = this._params.request || {};
		const requestParams = requestOptions.params || {};
		const fromRequest = this._normalizePositiveInt(requestParams.page, 0);
		if (fromRequest > 0) {
			return fromRequest;
		}
		const fromStorage = this._readStoredPage();
		if (fromStorage > 0) {
			return fromStorage;
		}
		return this._normalizePositiveInt(this._params.pagination.page, 1);
	}

	_getInitialPerPage() {
		const fromUrl = this._normalizePositiveInt(this._getUrlParams().get('per_page'), 0);
		if (fromUrl > 0) {
			return this._clampPerPage(fromUrl, 10);
		}
		const requestOptions = this._params.request || {};
		const requestParams = requestOptions.params || {};
		const fromRequest = this._normalizePositiveInt(requestParams.per_page, 0);
		if (fromRequest > 0) {
			return this._clampPerPage(fromRequest, 10);
		}
		const fromStorage = this._readStoredPerPage();
		if (fromStorage > 0) {
			return this._clampPerPage(fromStorage, 10);
		}
		const configured = this._getConfiguredPerPage();
		if (configured > 0) {
			return this._clampPerPage(configured, 10);
		}
		return this._clampPerPage(this._params.pagination.perPage, 10);
	}

	_getConfiguredPerPage() {
		const perPageAttr = this._element.getAttribute('data-pagination-per-page');
		const fromAttr = this._normalizePositiveInt(perPageAttr, 0);
		if (fromAttr > 0) {
			return fromAttr;
		}
		return this._normalizePositiveInt(this._params.pagination.perPage, 0);
	}

	_getMaxPerPage() {
		const pagination = this._params.pagination || {};
		const maxPerPageAttr = this._element.getAttribute('data-pagination-max-per-page');
		const fromAttr = this._normalizePositiveInt(maxPerPageAttr, 0);
		if (fromAttr > 0) {
			return fromAttr;
		}

		const fromOptions = this._normalizePositiveInt(pagination.maxPerPage, 0);
		if (fromOptions > 0) {
			return fromOptions;
		}

		return 100;
	}

	_clampPerPage(value, fallback = 10) {
		const normalized = this._normalizePositiveInt(value, fallback);
		const maxPerPage = this._getMaxPerPage();
		return Math.max(1, Math.min(normalized, maxPerPage));
	}

	_getFiltersRoute() {
		const filterOptions = this._params.filters || {};
		const attrRoute = this._element.getAttribute('data-filters-route');
		return String(filterOptions.route || attrRoute || '').trim();
	}

	_isPerPagePersistenceEnabled() {
		const pagination = this._params.pagination || {};
		const attr = this._element.getAttribute('data-pagination-persist-per-page');
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}
		if ((pagination.persist || {}).perPage === undefined || (pagination.persist || {}).perPage === null) {
			return true;
		}
		return Boolean((pagination.persist || {}).perPage);
	}

	_isPagePersistenceEnabled() {
		const pagination = this._params.pagination || {};
		const attr = this._element.getAttribute('data-pagination-persist-page');
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}
		if ((pagination.persist || {}).page === undefined || (pagination.persist || {}).page === null) {
			return true;
		}
		return Boolean((pagination.persist || {}).page);
	}

	_getPerPageStorageKey() {
		const pagination = this._params.pagination || {};
		const explicit = String(((pagination.storage || {}).key) || this._element.getAttribute('data-pagination-storage-key') || '').trim();
		if (explicit) {
			return explicit;
		}
		const tableId = String(this._element.id || '').trim();
		if (tableId) {
			return `vgdt:perPage:${tableId}`;
		}
		const route = String(this._getRoute() || '').trim();
		if (route) {
			return `vgdt:perPage:${route}`;
		}
		const dataToggle = String(this._element.getAttribute('data-vg-table') || '').trim();
		if (dataToggle) {
			return `vgdt:perPage:${window.location.pathname}:${dataToggle}`;
		}
		const tables = Array.from(document.querySelectorAll('[data-vg-table]'));
		const index = tables.indexOf(this._element);
		return `vgdt:perPage:${window.location.pathname}:${index >= 0 ? index : 0}`;
	}

	_getPageStorageKey() {
		const pagination = this._params.pagination || {};
		const explicit = String((((pagination.pageStorage || {}).storage || {}).key) || this._element.getAttribute('data-pagination-page-storage-key') || '').trim();
		if (explicit) {
			return explicit;
		}
		return `${this._getPerPageStorageKey()}:page`;
	}

	_readStoredPage() {
		if (!this._isPagePersistenceEnabled()) {
			return 0;
		}
		try {
			const raw = window.localStorage.getItem(this._getPageStorageKey());
			return this._normalizePositiveInt(raw, 0);
		} catch (error) {
			return 0;
		}
	}

	_storePage(page) {
		if (!this._isPagePersistenceEnabled()) {
			return;
		}
		const normalized = this._normalizePositiveInt(page, 0);
		if (normalized <= 0) {
			return;
		}
		try {
			window.localStorage.setItem(this._getPageStorageKey(), String(normalized));
		} catch (error) {
			// Ignore storage errors.
		}
	}

	_readStoredPerPage() {
		if (!this._isPerPagePersistenceEnabled()) {
			return 0;
		}
		try {
			const raw = window.localStorage.getItem(this._getPerPageStorageKey());
			return this._normalizePositiveInt(raw, 0);
		} catch (error) {
			return 0;
		}
	}

	_storePerPage(perPage) {
		if (!this._isPerPagePersistenceEnabled()) {
			return;
		}
		const normalized = this._normalizePositiveInt(perPage, 0);
		if (normalized <= 0) {
			return;
		}
		try {
			window.localStorage.setItem(this._getPerPageStorageKey(), String(normalized));
		} catch (error) {
			// Ignore storage errors.
		}
	}

	_normalizeSortDir(value) {
		const normalized = String(value)
			.split(',')[0]
			.toLowerCase()
			.trim();
		return normalized === 'desc' ? 'desc' : 'asc';
	}

	_isPaginationEnabled() {
		const pagination = this._params.pagination || {};
		if (pagination.enable !== undefined && pagination.enable !== null) {
			const normalized = String(pagination.enable).toLowerCase().trim();
			if (normalized === 'true' || normalized === '1') {
				return true;
			}
			if (normalized === 'false' || normalized === '0') {
				return false;
			}
			return Boolean(pagination.enable);
		}

		const explicitAttr = this._element.getAttribute('data-pagination-enable');
		if (explicitAttr !== null) {
			const normalized = String(explicitAttr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}

		return false;
	}

	_isStickyHeaderEnabled() {
		const sticky = this._params.stickyHeader || {};
		const enableAttr = this._element.getAttribute('data-sticky-header-enable');
		if (enableAttr !== null) {
			const normalized = String(enableAttr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}

		if (sticky.enable !== undefined && sticky.enable !== null) {
			const normalized = String(sticky.enable).toLowerCase().trim();
			if (normalized === 'true' || normalized === '1') {
				return true;
			}
			if (normalized === 'false' || normalized === '0') {
				return false;
			}
			return Boolean(sticky.enable);
		}

		return false;
	}

	_isCloneStickyHeaderEnabled() {
		if (this._parent && this._parent.classList.contains('table-sticky')) {
			return true;
		}
		return Boolean(this._element && this._element.classList.contains('table-sticky'));
	}

	_refreshStickyAndFixedLayout(options = {}) {
		const immediate = Boolean(options && options.immediate);
		const reason = String((options && options.reason) || '').trim();
		if (reason) {
			this._layoutRefreshReasons.push(reason);
			if (this._layoutRefreshReasons.length > 25) {
				this._layoutRefreshReasons.shift();
			}
		}
		if (immediate || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
			if (this._layoutRefreshFrame && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
				window.cancelAnimationFrame(this._layoutRefreshFrame);
			}
			this._layoutRefreshFrame = 0;
			this._layoutRefreshScheduled = false;
			this._refreshStickyAndFixedLayoutNow();
			return;
		}
		if (this._layoutRefreshScheduled) {
			return;
		}
		this._layoutRefreshScheduled = true;
		this._layoutRefreshFrame = window.requestAnimationFrame(() => {
			this._layoutRefreshFrame = 0;
			this._layoutRefreshScheduled = false;
			this._refreshStickyAndFixedLayoutNow();
		});
	}

	_refreshStickyAndFixedLayoutNow() {
		this._layoutRefreshReasons = [];
		if (!this._element || !this._element.isConnected) {
			return;
		}
		this._applyFixedColumnsLayout();
		this._syncCloneStickyHeader();
		this._updatePanHintVisibility();
	}

	_updateLayoutResizeBinding() {
		if (typeof window === 'undefined') {
			return;
		}
		const shouldListen = this._isCloneStickyHeaderEnabled() || this._hasFixedColumnsConfig();
		window.removeEventListener('resize', this._boundCloneStickyResize);
		this._teardownLayoutResizeObserver();
		if (shouldListen) {
			window.addEventListener('resize', this._boundCloneStickyResize);
			this._setupLayoutResizeObserver();
		}
	}

	_setupLayoutResizeObserver() {
		if (typeof ResizeObserver === 'undefined') {
			return;
		}

		if (!this._layoutResizeObserver) {
			this._layoutResizeObserver = new ResizeObserver(() => {
				this._boundCloneStickyResize();
			});
		}

		this._getLayoutResizeTargets().forEach((target) => {
			this._layoutResizeObserver.observe(target);
		});
	}

	_teardownLayoutResizeObserver() {
		if (!this._layoutResizeObserver) {
			return;
		}
		this._layoutResizeObserver.disconnect();
	}

	_getLayoutResizeTargets() {
		const seen = new Set();
		const pushUnique = (target) => {
			if (!target || seen.has(target)) {
				return;
			}
			seen.add(target);
		};

		pushUnique(this._parent);
		pushUnique(this._tableViewport);

		return Array.from(seen);
	}

	_getStickyHeaderOffsets() {
		const sticky = this._params.stickyHeader || {};
		const attrTop = this._element.getAttribute('data-sticky-header-top');
		const topRaw = attrTop !== null && String(attrTop).trim() !== '' ? attrTop : sticky.top;
		const top = Number.isFinite(Number.parseInt(topRaw, 10)) ? Number.parseInt(topRaw, 10) : 0;
		const attrMaxHeight = this._element.getAttribute('data-sticky-header-max');
		const maxHeightRaw = attrMaxHeight !== null && String(attrMaxHeight).trim() !== '' ? attrMaxHeight : sticky.max;
		const maxHeight = Number.isFinite(Number.parseInt(maxHeightRaw, 10)) ? Number.parseInt(maxHeightRaw, 10) : 0;
		return {
			top: Math.max(0, top),
			maxHeight: Math.max(0, maxHeight),
		};
	}

	_getCloneStickyHeaderOffsets() {
		return {
			top: this._readCssSizeVar('--vgdt-sticky-top', 0),
			maxHeight: this._readCssSizeVar('--vgdt-sticky-max-height', 0),
		};
	}

	_readCssSizeVar(name, fallback = 0) {
		const sources = [this._parent, this._element, this._tableViewport].filter(Boolean);
		for (let index = 0; index < sources.length; index += 1) {
			const node = sources[index];
			const value = window.getComputedStyle(node).getPropertyValue(name);
			const parsed = this._resolveCssLengthToPx(value, node);
			if (Number.isFinite(parsed)) {
				return Math.max(0, parsed);
			}
		}
		return Math.max(0, fallback);
	}

	_resolveCssLengthToPx(value, referenceNode = null) {
		const raw = String(value || '').trim();
		if (!raw) {
			return NaN;
		}

		const direct = Number.parseFloat(raw);
		if (Number.isFinite(direct)) {
			return direct;
		}

		if (typeof document === 'undefined') {
			return NaN;
		}

		const host = referenceNode instanceof Element
			? referenceNode
			: (document.body || document.documentElement);
		if (!host) {
			return NaN;
		}

		const probe = document.createElement('div');
		probe.style.position = 'absolute';
		probe.style.visibility = 'hidden';
		probe.style.pointerEvents = 'none';
		probe.style.left = '-99999px';
		probe.style.top = '0';
		probe.style.height = raw;
		host.appendChild(probe);

		const computed = window.getComputedStyle(probe).height;
		host.removeChild(probe);

		const resolved = Number.parseFloat(String(computed || '').trim());
		return Number.isFinite(resolved) ? resolved : NaN;
	}

	_applyStickyHeader(enabled) {
		if (!this._element) {
			return;
		}

		const offsets = this._getStickyHeaderOffsets();

		if (enabled) {
			this._element.style.setProperty('--vgdt-sticky-top', `${offsets.top}px`);
			const scrollTarget = this._tableViewport || this._parent;
			if (scrollTarget) {
				if (offsets.maxHeight > 0) {
					scrollTarget.classList.add('table-sticky-scroll');
					scrollTarget.style.setProperty('--vgdt-sticky-max-height', `${offsets.maxHeight}px`);
				} else {
					scrollTarget.classList.remove('table-sticky-scroll');
					scrollTarget.style.removeProperty('--vgdt-sticky-max-height');
				}
			}
			return;
		}

		this._element.style.removeProperty('--vgdt-sticky-top');
		const scrollTarget = this._tableViewport || this._parent;
		if (scrollTarget) {
			scrollTarget.classList.remove('table-sticky-scroll');
			scrollTarget.style.removeProperty('--vgdt-sticky-max-height');
		}
	}

	_applyCloneStickyHeader(enabled) {
		const scrollTarget = this._tableViewport || this._parent;
		const state = this._cloneStickyState;

		if (!enabled) {
			if (state && state.viewport && state.onScroll) {
				state.viewport.removeEventListener('scroll', state.onScroll);
			}
			if (state && state.headerWrap && state.headerWrap.parentElement) {
				state.headerWrap.parentElement.removeChild(state.headerWrap);
			}
			this._cloneStickyState = null;
			this._parent.style.removeProperty('--vgdt-sticky-clone-height');
			if (scrollTarget && !this._isStickyHeaderEnabled()) {
				scrollTarget.classList.remove('table-sticky-scroll');
				scrollTarget.style.removeProperty('--vgdt-sticky-max-height');
			}
			this._updateLayoutResizeBinding();
			return;
		}

		if (!this._parent || !this._tableViewport || !this._element.tHead) {
			return;
		}

		const offsets = this._getCloneStickyHeaderOffsets();

		if (scrollTarget) {
			if (offsets.maxHeight > 0) {
				scrollTarget.classList.add('table-sticky-scroll');
				scrollTarget.style.setProperty('--vgdt-sticky-max-height', `${offsets.maxHeight}px`);
			} else {
				scrollTarget.classList.remove('table-sticky-scroll');
				scrollTarget.style.removeProperty('--vgdt-sticky-max-height');
			}
		}

		if (!this._cloneStickyState) {
			const headerWrap = document.createElement('div');
			headerWrap.className = 'vgdt-sticky-clone';
			const cloneTable = document.createElement('table');
			cloneTable.className = 'vgdt-sticky-clone__table';
			if (this._element.classList.contains('table-sortable')) {
				cloneTable.classList.add('table-sortable');
			}
			const cloneHead = document.createElement('thead');
			cloneTable.appendChild(cloneHead);
			headerWrap.appendChild(cloneTable);
			this._parent.insertBefore(headerWrap, this._tableViewport);

			const stateNode = {
				headerWrap,
				table: cloneTable,
				head: cloneHead,
				lastHeadHtml: '',
				cloneCells: [],
				viewport: this._tableViewport,
				onScroll: () => {
					this._syncCloneStickyScroll();
				},
				onClick: (event) => {
					this._forwardCloneStickyInteraction(event, 'click');
				},
				onChange: (event) => {
					this._forwardCloneStickyInteraction(event, 'change');
				},
				onDragStart: (event) => {
					this._forwardCloneStickyInteraction(event, 'dragstart');
				},
				onDragOver: (event) => {
					this._forwardCloneStickyInteraction(event, 'dragover');
				},
				onDrop: (event) => {
					this._forwardCloneStickyInteraction(event, 'drop');
				},
				onDragEnd: (event) => {
					this._forwardCloneStickyInteraction(event, 'dragend');
				},
			};

			stateNode.viewport.addEventListener('scroll', stateNode.onScroll, { passive: true });
			stateNode.head.addEventListener('click', stateNode.onClick);
			stateNode.head.addEventListener('change', stateNode.onChange);
			stateNode.head.addEventListener('dragstart', stateNode.onDragStart);
			stateNode.head.addEventListener('dragover', stateNode.onDragOver);
			stateNode.head.addEventListener('drop', stateNode.onDrop);
			stateNode.head.addEventListener('dragend', stateNode.onDragEnd);
			this._cloneStickyState = stateNode;
		}

		this._updateLayoutResizeBinding();
		this._syncCloneStickyHeader();
	}

	_syncCloneStickyHeader() {
		const state = this._cloneStickyState;
		if (!state || !this._element || !this._element.tHead) {
			return;
		}

		const sourceHead = this._element.tHead;
		const sourceRows = Array.from(sourceHead.rows || []);
		if (!sourceRows.length) {
			state.headerWrap.hidden = true;
			return;
		}
		if (this._element.classList.contains('table-sortable')) {
			state.table.classList.add('table-sortable');
		} else {
			state.table.classList.remove('table-sortable');
		}
		const hideUnsortedAttr = this._element.getAttribute('data-sort-hide-unsorted-arrows');
		if (hideUnsortedAttr !== null) {
			state.table.setAttribute('data-sort-hide-unsorted-arrows', hideUnsortedAttr);
		} else {
			state.table.removeAttribute('data-sort-hide-unsorted-arrows');
		}

		let cloneHeadChanged = false;
		const nextHeadHtml = sourceHead.innerHTML;
		if (state.lastHeadHtml !== nextHeadHtml) {
			state.head.innerHTML = nextHeadHtml;
			this._sanitizeCloneStickyHeadIds(state.head);
			state.lastHeadHtml = nextHeadHtml;
			state.cloneCells = Array.from(state.head.querySelectorAll('th'));
			cloneHeadChanged = true;
		}
		const sourceCells = Array.from(sourceHead.querySelectorAll('th'));
		const cloneCells = Array.isArray(state.cloneCells) && state.cloneCells.length
			? state.cloneCells
			: Array.from(state.head.querySelectorAll('th'));
		this._syncCloneStickySelectAllState(sourceHead, state.head);
		const sourceTableWidth = this._element.getBoundingClientRect().width;
		const viewportMetrics = this._getViewportWidthMetrics();
		const hasHorizontalOverflow = this._tableViewport
			? this._tableViewport.scrollWidth > this._tableViewport.clientWidth + 1
			: false;
		let tableWidth = sourceTableWidth;

		if (viewportMetrics) {
			tableWidth = (!hasHorizontalOverflow || viewportMetrics.hasVerticalOverflow)
				? sourceTableWidth
				: Math.max(sourceTableWidth, viewportMetrics.effectiveWidth);
		}

		const tableWidthCss = `${Math.max(0, tableWidth)}px`;
		if (state.table.style.width !== tableWidthCss) {
			state.table.style.width = tableWidthCss;
		}
		state.headerWrap.style.width = '100%';
		let totalCloneWidth = 0;
		sourceCells.forEach((cell, index) => {
			const cloneCell = cloneCells[index];
			if (!cloneCell) {
				return;
			}
			const width = cell.getBoundingClientRect().width;
			const safeWidth = Math.max(0, width);
			const widthCss = `${safeWidth}px`;
			if (cloneCell.style.width !== widthCss) {
				cloneCell.style.width = widthCss;
			}
			if (cloneCell.style.minWidth !== widthCss) {
				cloneCell.style.minWidth = widthCss;
			}
			if (cloneCell.style.maxWidth !== widthCss) {
				cloneCell.style.maxWidth = widthCss;
			}
			totalCloneWidth += safeWidth;
		});

		if (hasHorizontalOverflow && cloneCells.length) {
			const gap = Math.max(0, tableWidth - totalCloneWidth);
			if (gap > 1) {
				const lastCell = cloneCells[cloneCells.length - 1];
				const current = lastCell.getBoundingClientRect().width;
				const next = Math.max(0, current + gap);
				lastCell.style.width = `${next}px`;
				lastCell.style.minWidth = `${next}px`;
				lastCell.style.maxWidth = `${next}px`;
			}
		}

		state.headerWrap.hidden = false;
		const cloneHeight = state.headerWrap.getBoundingClientRect().height;
		this._parent.style.setProperty('--vgdt-sticky-clone-height', `${Math.max(0, cloneHeight)}px`);
		this._syncCloneStickyScroll();
		if (cloneHeadChanged && typeof this._rebuildFixedColumnsCellsCache === 'function') {
			this._rebuildFixedColumnsCellsCache();
			if (typeof this._syncFixedColumnsScroll === 'function') {
				this._syncFixedColumnsScroll({ immediate: true });
			}
		}
	}

	_syncCloneStickySelectAllState(sourceHead, cloneHead) {
		if (!sourceHead || !cloneHead || typeof sourceHead.querySelector !== 'function' || typeof cloneHead.querySelector !== 'function') {
			return;
		}
		const sourceSelectAll = sourceHead.querySelector('[data-select-all]');
		const cloneSelectAll = cloneHead.querySelector('[data-select-all]');
		if (!sourceSelectAll || !cloneSelectAll) {
			return;
		}
		cloneSelectAll.checked = Boolean(sourceSelectAll.checked);
		cloneSelectAll.indeterminate = Boolean(sourceSelectAll.indeterminate);
		cloneSelectAll.disabled = Boolean(sourceSelectAll.disabled);
	}

	_sanitizeCloneStickyHeadIds(head) {
		if (!head || typeof head.querySelectorAll !== 'function') {
			return;
		}

		const nodesWithId = Array.from(head.querySelectorAll('[id]'));
		if (!nodesWithId.length) {
			return;
		}

		const idMap = new Map();
		nodesWithId.forEach((node) => {
			const originalId = String(node.getAttribute('id') || '').trim();
			if (!originalId) {
				return;
			}
			const cloneId = `${originalId}--vgdt-clone`;
			node.setAttribute('id', cloneId);
			idMap.set(originalId, cloneId);
		});

		if (!idMap.size) {
			return;
		}

		const idRefAttrs = ['for', 'headers', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-details'];
		const allNodes = Array.from(head.querySelectorAll('*'));
		allNodes.forEach((node) => {
			idRefAttrs.forEach((attr) => {
				const value = String(node.getAttribute(attr) || '').trim();
				if (!value) {
					return;
				}
				const nextValue = value
					.split(/\s+/)
					.map((part) => idMap.get(part) || part)
					.join(' ');
				if (nextValue !== value) {
					node.setAttribute(attr, nextValue);
				}
			});
		});
	}

	_syncCloneStickyScroll() {
		const state = this._cloneStickyState;
		if (!state || !state.viewport) {
			return;
		}
		const hasHorizontalOverflow = state.viewport.scrollWidth > state.viewport.clientWidth + 1;
		if (!hasHorizontalOverflow) {
			if (state.viewport.scrollLeft !== 0) {
				state.viewport.scrollLeft = 0;
			}
			state.table.style.transform = 'translateX(0px)';
			return;
		}
		const left = state.viewport.scrollLeft || 0;
		state.table.style.transform = `translateX(${-left}px)`;
	}

	_getViewportWidthMetrics() {
		const viewport = this._tableViewport;
		if (!viewport) {
			return null;
		}

		const clientWidth = viewport.clientWidth || 0;
		const clientHeight = viewport.clientHeight || 0;
		const hasVerticalOverflow = viewport.scrollHeight > clientHeight + 1;
		const effectiveWidth = clientWidth || viewport.offsetWidth || 0;

		return {
			clientWidth,
			effectiveWidth,
			hasVerticalOverflow,
		};
	}

	_forwardCloneStickyInteraction(event, type) {
		const state = this._cloneStickyState;
		if (!state || !this._element || !this._element.tHead || !event) {
			return;
		}
		const target = event.target instanceof Element ? event.target : null;
		if (!target) {
			return;
		}
		const cloneTh = target.closest('th');
		if (!cloneTh) {
			return;
		}

		const cloneHeaders = Array.from(state.head.querySelectorAll('th'));
		const sourceHeaders = Array.from(this._element.tHead.querySelectorAll('th'));
		const index = cloneHeaders.indexOf(cloneTh);
		const sourceTh = index >= 0 ? sourceHeaders[index] : null;
		if (!sourceTh) {
			return;
		}

		if (type === 'dragstart' || type === 'dragover' || type === 'drop' || type === 'dragend') {
			if (!this._columnReorderState.enabled) {
				return;
			}

			if (type === 'dragstart') {
				const fromIndex = this._findHeaderIndex(sourceTh);
				if (fromIndex < 0 || this._isHeaderFixedForColumnReorder(sourceTh)) {
					return;
				}
				this._columnReorderState.fromIndex = fromIndex;
				this._columnReorderState.toIndex = fromIndex;
				this._columnReorderState.isDragging = true;
				this._element.classList.add('is-col-dragging');
				sourceTh.setAttribute('data-col-dragging', '1');
				cloneTh.setAttribute('data-col-dragging', '1');

				if (event.dataTransfer) {
					event.dataTransfer.effectAllowed = 'move';
					try {
						event.dataTransfer.setData('text/plain', String(fromIndex));
					} catch (error) {
						// Ignore setData errors.
					}
				}
				return;
			}

			if (type === 'dragover') {
				if (!this._columnReorderState.isDragging || this._isHeaderFixedForColumnReorder(sourceTh)) {
					return;
				}
				event.preventDefault();
				const toIndex = this._findHeaderIndex(sourceTh);
				if (toIndex < 0) {
					return;
				}
				this._columnReorderState.toIndex = toIndex;
				this._syncColumnDragOverMarker(toIndex);
				return;
			}

			if (type === 'drop') {
				if (!this._columnReorderState.isDragging) {
					return;
				}
				event.preventDefault();
				if (this._isHeaderFixedForColumnReorder(sourceTh)) {
					this._resetColumnDragMarkers();
					return;
				}
				const toIndex = this._findHeaderIndex(sourceTh);
				if (toIndex < 0) {
					this._resetColumnDragMarkers();
					return;
				}
				const fromIndex = this._columnReorderState.fromIndex;
				this._resetColumnDragMarkers();
				this._finalizeColumnReorder(fromIndex, toIndex);
				return;
			}

			this._resetColumnDragMarkers();
			return;
		}

		if (type === 'change') {
			const clonedSelectAll = target.closest('[data-select-all]');
			if (!clonedSelectAll) {
				return;
			}
			const sourceSelectAll = sourceTh.querySelector('[data-select-all]');
			if (!sourceSelectAll) {
				return;
			}
			sourceSelectAll.checked = Boolean(clonedSelectAll.checked);
			sourceSelectAll.dispatchEvent(new Event('change', { bubbles: true }));
			this._syncCloneStickyHeader();
			return;
		}

		if (type === 'click') {
			const clonedSelectAll = target.closest('[data-select-all]');
			if (clonedSelectAll) {
				return;
			}
		}

		const clonedArrow = target.closest('[data-sort-arrow]');
		let clickTarget = sourceTh;
		if (clonedArrow) {
			const dir = clonedArrow.getAttribute('data-sort-arrow');
			const sourceArrow = sourceTh.querySelector(`[data-sort-arrow="${dir}"]`);
			if (sourceArrow) {
				clickTarget = sourceArrow;
			}
		} else {
			const clonedSelectAll = target.closest('[data-select-all]');
			if (clonedSelectAll) {
				const sourceSelectAll = sourceTh.querySelector('[data-select-all]');
				if (sourceSelectAll) {
					clickTarget = sourceSelectAll;
				}
			}
		}

		clickTarget.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window,
			shiftKey: Boolean(event.shiftKey),
			ctrlKey: Boolean(event.ctrlKey),
			altKey: Boolean(event.altKey),
			metaKey: Boolean(event.metaKey),
		}));
		this._syncCloneStickyHeader();
	}

	_renderRemoteRows(rows) {
		const body = this._getBody();

		if (!rows.length) {
			const message = this._getTableMessage('stateEmpty', 'РќРёС‡РµРіРѕ РЅРµС‚');
			this._renderStateRow(message, 'empty');
			return;
		}

		this._setFixedColumnsSuppressed(false);
		this._clearStateMode();
		body.innerHTML = rows.map((row) => {
			const cells = this._fields.map((field) => {
				const rawValue = row && Object.prototype.hasOwnProperty.call(row, field) ? row[field] : '';
				const prepared = this._formatFieldValue(field, rawValue);
				return `<td>${this._escapeHtml(prepared)}</td>`;
			});
			return `<tr>${cells.join('')}</tr>`;
		}).join('');
		this._updatePanHintVisibility();
	}

	_renderStateRow(message, state) {
		const body = this._getBody();
		const columns = this._getRenderedColumnsCount();
		const retryButton = state === 'error'
			? `<div class="vgdt-state-actions"><button type="button" class="vgdt-state-reset" data-state-retry>${this._escapeHtml(this._getTableMessage('retry', 'РџРѕРІС‚РѕСЂРёС‚СЊ'))}</button></div>`
			: '';
		const illustration = this._buildStateIllustrationMarkup(state);
		body.innerHTML = `<tr><td colspan="${columns}" data-table-state="${state}"><div class="vgdt-state">${illustration}<div class="vgdt-state-text">${this._escapeHtml(message)}</div>${retryButton}</div></td></tr>`;
		const stateCell = body.querySelector('[data-table-state]');
		this._setFixedColumnsSuppressed(true);
		this._setStateMode(state);
		this._ensureStateRowVisible(stateCell);
		this._announce(message);
		this._clearFooter();
		this._updatePanHintVisibility();
		this._refreshStickyAndFixedLayout();
	}

	_scrollToPaginationTop() {
		if (!this._isPaginationScrollToTopEnabled()) {
			return;
		}
		if (this._tableViewport) {
			this._tableViewport.scrollTop = 0;
			this._tableViewport.scrollLeft = 0;
		}
		if (typeof window === 'undefined' || !this._parent) {
			return;
		}

		const targetTop = this._getPaginationScrollTopTarget();
		const currentTop = window.pageYOffset || window.scrollY || 0;
		if (!Number.isFinite(targetTop)) {
			return;
		}
		if (Math.abs(targetTop - currentTop) < 2) {
			return;
		}

		const prefersReducedMotion = typeof window.matchMedia === 'function'
			&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		window.scrollTo({
			top: Math.max(0, Math.round(targetTop)),
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
		});
	}

	_getPaginationScrollTopTarget() {
		if (this._isPaginationScrollToWindowTopEnabled()) {
			return 0;
		}
		const rect = this._parent.getBoundingClientRect();
		if (!Number.isFinite(rect.top)) {
			return NaN;
		}
		return rect.top + (window.pageYOffset || window.scrollY || 0);
	}

	_isPaginationScrollToTopEnabled() {
		const pagination = this._params.pagination || {};
		const option = pagination.scrollToTop;
		if (option === undefined || option === null) {
			return false;
		}
		return Boolean(option);
	}

	_isPaginationScrollToWindowTopEnabled() {
		const pagination = this._params.pagination || {};
		const option = pagination.scrollToWindowTop;
		if (option === undefined || option === null) {
			return false;
		}
		return Boolean(option);
	}

	_getI18nSection(section) {
		const i18n = this._params.i18n && typeof this._params.i18n === 'object'
			? this._params.i18n
			: {};
		const defaultI18n = DEFAULT_OPTIONS.i18n && typeof DEFAULT_OPTIONS.i18n === 'object'
			? DEFAULT_OPTIONS.i18n
			: {};
		const localeRaw = String(this._params.locale || 'ru').toLowerCase();
		const locale = localeRaw.split('-')[0];
		const baseLocale = defaultI18n[localeRaw] || defaultI18n[locale] || defaultI18n.ru || {};
		const baseSection = baseLocale[section] && typeof baseLocale[section] === 'object' ? baseLocale[section] : {};

		const localized = i18n[localeRaw] || i18n[locale];
		const localizedSection = localized && typeof localized === 'object' && localized[section] && typeof localized[section] === 'object'
			? localized[section]
			: {};

		return Object.assign({}, baseSection, localizedSection);
	}

	_getTableMessage(key, fallback) {
		const tableI18n = this._getI18nSection('table');
		const value = tableI18n[key];
		return typeof value === 'string' && value.trim() ? value : fallback;
	}

	async _waitMinLoadingDelay(startedAt) {
		const loadingOptions = this._params.loading || {};
		const minDelayMs = Math.max(0, Number.parseInt(loadingOptions.minDelay, 10) || 0);
		if (minDelayMs <= 0) {
			return;
		}

		const elapsed = Date.now() - startedAt;
		const remaining = minDelayMs - elapsed;
		if (remaining <= 0) {
			return;
		}

		await new Promise((resolve) => setTimeout(resolve, remaining));
	}

	_ensureSummaryNode() {
		if (!this._isSummaryEnabled() || this._summaryNode || !this._parent) {
			return;
		}
		const node = document.createElement('div');
		node.className = 'vgdt-summary';
		node.hidden = true;
		const anchor = this._tableViewport && this._tableViewport.parentElement === this._parent
			? this._tableViewport
			: this._element;
		this._parent.insertBefore(node, anchor);
		this._summaryNode = node;
	}

}

Object.assign(
	VGDynamicTable.prototype,
	fixedColumnsMethods,
	viewportMethods,
	summaryFooterMethods,
	skeletonMethods,
	tableRemoteMethods,
	tableUrlStateMethods,
	tableStateMethods
);

EventHandler.on(document, 'DOMContentLoaded', () => {
	VGDynamicTable.initAll();
});

export default VGDynamicTable;

