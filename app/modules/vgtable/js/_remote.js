/**
 * Описание: remote-источник строк для VGTable через общий Ajax requestRoute.
 * Возможности: data/view/auto ответы, серверная пагинация и сортировка, parammap, отмена гонок, cache, состояния и экспорт.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_BEFORE_LOAD = 'beforeload.vg.table';
const EVENT_REQUEST_SUCCESS = 'requestsuccess.vg.table';
const EVENT_REQUEST_ERROR = 'requesterror.vg.table';
const EVENT_DATA_LOADED = 'dataloaded.vg.table';
const EVENT_AFTER_RENDER = 'afterrender.vg.table';

class _remote {
	constructor(table, options = {}, hooks = {}) {
		this._table = table;
		this._options = options;
		this._hooks = hooks;
		this._cache = new Map();
		this._controller = null;
		this._token = 0;
		this._params = {};
		this._lastMeta = {};
		this._lastRequest = null;
		this._loading = false;
		this._boundClick = this._handleClick.bind(this);
	}

	init() {
		this._table.addEventListener('click', this._boundClick);
		return this.load();
	}

	dispose() {
		this._token += 1;
		this._controller?.abort?.();
		this._table.removeEventListener('click', this._boundClick);
		this._table.removeAttribute('aria-busy');
		this._table.removeAttribute('data-vg-table-remote');
		this._cache.clear();
		this._controller = null;
	}

	load(options = {}) {
		const pagination = this._hooks.getPagination?.() || {};
		const page = this._positiveInt(options.page, pagination.page || 1);
		const perPage = this._positiveInt(options.perPage, pagination.perPage || 10);
		if (options.params && typeof options.params === 'object' && !Array.isArray(options.params)) {
			this.setParams(options.params, options.replaceParams === true);
		}

		return this._request(page, perPage, {
			force: options.force === true,
			source: String(options.source || 'api'),
		});
	}

	reload(options = {}) {
		return this.load(Object.assign({}, options, {force: options.force !== false}));
	}

	setParams(params = {}, replace = false) {
		const source = params && typeof params === 'object' && !Array.isArray(params) ? params : {};
		this._params = replace ? Object.assign({}, source) : Object.assign({}, this._params, source);
		return Object.assign({}, this._params);
	}

	clearCache() {
		this._cache.clear();
	}

	getState() {
		return {
			loading: this._loading,
			params: Object.assign({}, this._params),
			meta: Object.assign({}, this._lastMeta),
			request: this._lastRequest ? Object.assign({}, this._lastRequest) : null,
		};
	}

	export(format = 'csv', options = {}) {
		const route = String(options.route || this._options.export?.route || this._options.route || '').trim();
		if (!route) return '';

		const pagination = this._hooks.getPagination?.() || {};
		const params = this._mapParams(this._buildParams(
			this._positiveInt(options.page, pagination.page || 1),
			this._positiveInt(options.perPage, pagination.perPage || 10)
		));
		params.format = String(format || 'csv').toLowerCase() === 'xlsx' ? 'xlsx' : 'csv';
		const url = this._hooks.buildUrl(params, route, this._requestConfig(route));
		if (options.open !== false && typeof window !== 'undefined') {
			window.open?.(url.toString(), '_blank', 'noopener');
		}
		return url.toString();
	}

	async _request(page, perPage, options = {}) {
		const route = String(this._options.route || '').trim();
		if (!route) return null;

		const requestParams = this._mapParams(this._buildParams(page, perPage));
		const method = String(this._options.method || 'GET').toUpperCase();
		const cacheKey = this._cacheKey(route, method, requestParams);
		const cached = options.force ? null : this._readCache(cacheKey);
		const startedAt = Date.now();
		const token = ++this._token;
		const requestId = `vg-table-${Date.now()}-${token}`;
		const detail = {
			requestId,
			page,
			perPage,
			params: Object.assign({}, requestParams),
			source: options.source,
			fromCache: Boolean(cached),
		};
		this._lastRequest = detail;
		this._controller?.abort?.();
		this._controller = cached || typeof AbortController !== 'function' ? null : new AbortController();
		this._loading = true;
		this._table.setAttribute('data-vg-table-remote', '');
		this._table.setAttribute('aria-busy', 'true');
		this._emit(EVENT_BEFORE_LOAD, detail);
		if (!cached) {
			const rendered = this._hooks.renderLoading?.();
			if (!rendered) this._renderState(this._label('loading', 'Загрузка…'), 'loading');
		}

		try {
			const response = cached || await this._hooks.request(this._buildRequest(requestParams, this._controller?.signal, options.source));
			if (token !== this._token) return null;
			if (!cached) await this._waitMinLoadingDelay(startedAt);
			if (token !== this._token) return null;
			if (!cached) this._writeCache(cacheKey, response);
			const result = this._applyResponse(response, page, perPage);
			this._emit(EVENT_REQUEST_SUCCESS, Object.assign({}, detail, {response, meta: result.meta}));
			this._emit(EVENT_DATA_LOADED, Object.assign({}, detail, result, {response}));
			this._emit(EVENT_AFTER_RENDER, Object.assign({}, detail, {
				renderedCount: result.renderedCount,
				total: result.meta.total,
			}));
			return result;
		} catch (error) {
			if (error?.name === 'AbortError' || token !== this._token) return null;
			if (!cached) await this._waitMinLoadingDelay(startedAt);
			if (token !== this._token) return null;
			if (!this._hooks.renderError?.(error)) this._renderState(this._label('error', 'Не удалось загрузить данные'), 'error');
			this._emit(EVENT_REQUEST_ERROR, Object.assign({}, detail, {error}));
			return null;
		} finally {
			if (token === this._token) {
				this._loading = false;
				this._table.setAttribute('aria-busy', 'false');
				this._controller = null;
			}
		}
	}

	_waitMinLoadingDelay(startedAt) {
		const delay = this._nonNegativeInt(this._hooks.getLoadingMinDelay?.(), 0);
		const remaining = delay - Math.max(0, Date.now() - startedAt);
		return remaining > 0
			? new Promise((resolve) => window.setTimeout(resolve, remaining))
			: Promise.resolve();
	}

	_buildRequest(params, signal, source = 'api') {
		const method = String(this._options.method || 'GET').toUpperCase();
		const isGetLike = method === 'GET' || method === 'HEAD';
		const config = this._requestConfig();
		if (source === 'retry') config.headers['X-VGTable-Retry'] = '1';
		return Object.assign(config, {
			method,
			params: isGetLike ? params : {},
			body: isGetLike ? null : params,
			signal,
			responseType: 'json',
		});
	}

	_requestConfig(route = this._options.route) {
		return {
			route,
			method: this._options.method,
			credentials: this._options.credentials,
			headers: Object.assign({}, this._options.headers || {}),
			baseParams: Object.assign({}, this._options.params || {}),
		};
	}

	_buildParams(page, perPage) {
		const params = Object.assign({}, this._params, {page, per_page: perPage});
		const sort = this._hooks.getSort?.();
		const sorts = Array.isArray(sort?.sorts) && sort.sorts.length ? sort.sorts : (sort?.field ? [sort] : []);
		if (sorts.length) {
			params.sort = sorts.map((item) => item.field).filter(Boolean).join(',');
			params.dir = sorts.map((item) => item.direction === 'desc' ? 'desc' : 'asc').join(',');
		}

		const mode = this._responseMode();
		params.responsemode = mode;
		if (mode !== 'data') {
			const viewParam = String(this._options.viewparam || '').trim();
			const viewValue = String(this._options.viewvalue || '').trim();
			if (viewParam && viewValue) params[viewParam] = viewValue;
			const fieldsParam = String(this._options.fieldsparam || '').trim();
			const fields = this._fields();
			if (fieldsParam && fields.length) params[fieldsParam] = fields.join(',');
		}
		return params;
	}

	_mapParams(params) {
		const map = this._options.parammap && typeof this._options.parammap === 'object'
			? this._options.parammap
			: {};
		return Object.keys(params).reduce((result, key) => {
			const mapped = String(Object.prototype.hasOwnProperty.call(map, key) ? map[key] : key).trim() || key;
			result[mapped] = params[key];
			return result;
		}, {});
	}

	_applyResponse(response, requestedPage, requestedPerPage) {
		const rows = this._extractRows(response);
		const view = this._extractView(response);
		const meta = this._normalizeMeta(this._readPath(response, this._options.metapath), rows, requestedPage, requestedPerPage);
		const mode = this._responseMode();
		const useView = mode === 'view' || (mode === 'auto' && typeof view === 'string' && view.trim() !== '');
		let renderedCount = 0;

		if (useView && typeof view === 'string' && view.trim() !== '') {
			this._body().innerHTML = view;
			renderedCount = this._body().rows.length;
		} else if (Array.isArray(rows) && rows.length) {
			renderedCount = this._renderRows(rows);
		} else {
			if (!this._hooks.renderEmpty?.({rows, view, meta})) this._renderState(this._label('empty', 'Ничего не найдено'), 'empty');
		}

		this._lastMeta = meta;
		this._hooks.applyMeta?.(meta);
		this._hooks.afterRender?.({rows, view, meta, renderedCount});
		return {rows, view, meta, renderedCount};
	}

	_renderRows(rows) {
		const body = this._body();
		const fields = this._fields();
		const fragment = this._table.ownerDocument.createDocumentFragment();
		rows.forEach((row) => {
			const tr = this._table.ownerDocument.createElement('tr');
			fields.forEach((field) => {
				const td = this._table.ownerDocument.createElement('td');
				const value = this._readPath(row, field);
				td.textContent = value === undefined || value === null ? '' : String(value);
				tr.append(td);
			});
			fragment.append(tr);
		});
		body.replaceChildren(fragment);
		return rows.length;
	}

	_renderState(message, state) {
		const body = this._body();
		const row = this._table.ownerDocument.createElement('tr');
		const cell = this._table.ownerDocument.createElement('td');
		cell.colSpan = Math.max(1, this._fields().length || this._headerCells().length);
		cell.setAttribute('data-vg-table-state', state);
		const text = this._table.ownerDocument.createElement('span');
		text.textContent = message;
		cell.append(text);
		if (state === 'error') {
			const button = this._table.ownerDocument.createElement('button');
			button.type = 'button';
			button.className = 'vg-table-state__retry';
			button.setAttribute('data-vg-table-retry', '');
			button.textContent = this._label('retry', 'Повторить');
			cell.append(button);
		}
		row.append(cell);
		body.replaceChildren(row);
	}

	_label(key, fallback) {
		return String(this._options.labels?.[key] || fallback || '');
	}

	_normalizeMeta(source, rows, page, perPage) {
		const meta = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
		const normalizedPage = this._positiveInt(meta.page ?? meta.current_page, page);
		const normalizedPerPage = this._positiveInt(meta.per_page ?? meta.perPage, perPage);
		const total = this._nonNegativeInt(meta.total, Array.isArray(rows) ? rows.length : 0);
		const pages = this._positiveInt(meta.pages ?? meta.last_page, Math.max(1, Math.ceil(total / normalizedPerPage)));
		return Object.assign({}, meta, {
			page: Math.min(normalizedPage, pages),
			per_page: normalizedPerPage,
			total,
			pages,
		});
	}

	_extractRows(response) {
		const rows = this._readPath(response, this._options.datapath);
		return Array.isArray(rows) ? rows : [];
	}

	_extractView(response) {
		const view = this._readPath(response, this._options.viewpath);
		return typeof view === 'string' ? view : '';
	}

	_readPath(source, path) {
		const parts = String(path || '').split('.').map((item) => item.trim()).filter(Boolean);
		let current = source;
		for (const part of parts) {
			if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, part)) return undefined;
			current = current[part];
		}
		return current;
	}

	_fields() {
		return this._headerCells()
			.map((header) => String(header.getAttribute('data-field') || '').trim())
			.filter(Boolean);
	}

	_headerCells() {
		const headerTable = this._hooks.getHeaderTable?.() || this._table;
		const head = headerTable.tHead || headerTable.querySelector('thead');
		return head?.rows.length ? Array.from(head.rows[head.rows.length - 1].cells) : [];
	}

	_body() {
		return this._table.tBodies[0] || this._table.createTBody();
	}

	_responseMode() {
		const mode = String(this._options.responsemode || 'data').toLowerCase();
		return ['data', 'view', 'auto'].includes(mode) ? mode : 'data';
	}

	_cacheKey(route, method, params) {
		const query = Object.keys(params).sort().map((key) => {
			const value = Array.isArray(params[key]) ? params[key].join(',') : params[key];
			return `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`;
		}).join('&');
		return `${method}:${route}?${query}`;
	}

	_readCache(key) {
		if (this._options.cache?.enable === false) return null;
		const entry = this._cache.get(key);
		if (!entry) return null;
		const ttl = this._positiveInt(this._options.cache?.ttl, 30000);
		if (Date.now() - entry.createdAt > ttl) {
			this._cache.delete(key);
			return null;
		}
		entry.usedAt = Date.now();
		return entry.response;
	}

	_writeCache(key, response) {
		if (this._options.cache?.enable === false) return;
		this._cache.set(key, {response, createdAt: Date.now(), usedAt: Date.now()});
		const max = this._positiveInt(this._options.cache?.max, 30);
		if (this._cache.size <= max) return;
		const oldest = Array.from(this._cache.entries()).sort((left, right) => left[1].usedAt - right[1].usedAt)[0];
		if (oldest) this._cache.delete(oldest[0]);
	}

	_handleClick(event) {
		if (!event.target.closest('[data-vg-table-retry]')) return;
		this.reload({source: 'retry'});
	}

	_emit(name, detail) {
		EventHandler.trigger(this._table, name, detail);
	}

	_positiveInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
	}

	_nonNegativeInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
	}
}

export default _remote;
