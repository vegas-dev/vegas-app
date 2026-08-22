/**
 * Описание: единое состояние VGTable в query string.
 * Возможности: чтение/запись page, perPage, одиночной и мультисортировки, search и filters, popstate и публичные события.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_READ = 'urlstateread.vg.table';
const EVENT_WRITE = 'urlstatewrite.vg.table';
const EVENT_ERROR = 'urlstateerror.vg.table';

class _urlState {
	constructor(table, options = {}, hooks = {}) {
		this._table = table;
		this._options = options;
		this._hooks = hooks;
		this._state = null;
		this._boundPopState = this._handlePopState.bind(this);
	}

	init() {
		if (this._options.listen !== false && typeof window !== 'undefined') {
			window.addEventListener('popstate', this._boundPopState);
		}
		return this;
	}

	dispose() {
		if (typeof window !== 'undefined') window.removeEventListener('popstate', this._boundPopState);
		this._state = null;
	}

	read(source = 'api') {
		if (typeof window === 'undefined') return this._emptyState();
		try {
			const params = new URLSearchParams(window.location.search || '');
			const keys = this._keys();
			const state = this._emptyState();
			if (this._include('pagination')) {
				state.present.page = params.has(keys.page);
				state.present.perPage = params.has(keys.perPage);
				state.page = this._positiveInt(params.get(keys.page), null);
				state.perPage = this._positiveInt(params.get(keys.perPage), null);
			}
			if (this._include('sort')) {
				state.present.sort = params.has(keys.sort) || params.has(keys.direction);
				const fields = this._list(params.get(keys.sort));
				const directions = this._list(params.get(keys.direction));
				const sorts = fields.map((field, index) => ({
					field,
					direction: String(directions[index] || directions[0] || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc',
				}));
				state.sort = sorts.length ? Object.assign({}, sorts[0], {sorts}) : null;
			}
			if (this._include('search')) {
				state.present.search = params.has(keys.search);
				state.search = String(params.get(keys.search) || '');
			}
			if (this._include('filters')) this._filterFields().forEach((filter) => {
				const valueKey = `${keys.filterPrefix}${filter}`;
				const operatorKey = `${valueKey}_op`;
				const values = params.getAll(valueKey);
				if (values.length) {
					state.filters[filter] = values.length === 1 ? values[0] : values;
					state.present.filters = true;
				}
				if (params.has(operatorKey)) {
					state.filters[`${filter}_op`] = params.get(operatorKey);
					state.present.filters = true;
				}
			});
			this._state = state;
			EventHandler.trigger(this._table, EVENT_READ, {source, state: this.getState()});
			return this.getState();
		} catch (error) {
			EventHandler.trigger(this._table, EVENT_ERROR, {source: 'read', error});
			return this._emptyState();
		}
	}

	write(state = {}) {
		if (this._options.write === false || typeof window === 'undefined' || !window.history) return null;
		try {
			const url = new URL(window.location.href);
			const keys = this._keys();
			this._managedKeys().forEach((key) => url.searchParams.delete(key));
			if (this._include('pagination')) {
				this._set(url, keys.page, state.page || 1);
				this._set(url, keys.perPage, state.perPage || '');
			}
			if (this._include('sort') && state.sort?.field) {
				const sorts = Array.isArray(state.sort.sorts) && state.sort.sorts.length ? state.sort.sorts : [state.sort];
				this._set(url, keys.sort, sorts.map((item) => item.field).filter(Boolean).join(','));
				this._set(url, keys.direction, sorts.map((item) => item.direction === 'desc' ? 'desc' : 'asc').join(','));
			}
			if (this._include('search')) this._set(url, keys.search, state.search || '');
			if (this._include('filters')) {
				Object.entries(state.filters || {}).forEach(([key, value]) => {
					const queryKey = `${keys.filterPrefix}${key}`;
					(Array.isArray(value) ? value : [value]).forEach((item) => this._append(url, queryKey, item));
				});
			}
			const next = `${url.pathname}${url.search}${url.hash}`;
			const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
			if (next !== current) window.history[this._options.mode === 'push' ? 'pushState' : 'replaceState']({}, '', next);
			this._state = Object.assign({}, state);
			EventHandler.trigger(this._table, EVENT_WRITE, {mode: this._options.mode, state: this.getState(), url: next});
			return next;
		} catch (error) {
			EventHandler.trigger(this._table, EVENT_ERROR, {source: 'write', error});
			return null;
		}
	}

	getState() {
		return this._state ? JSON.parse(JSON.stringify(this._state)) : null;
	}

	_handlePopState() {
		this._hooks.apply?.(this.read('popstate'), {source: 'popstate', clearMissing: true});
	}

	_managedKeys() {
		const keys = this._keys();
		const managed = [];
		if (this._include('pagination')) managed.push(keys.page, keys.perPage);
		if (this._include('sort')) managed.push(keys.sort, keys.direction);
		if (this._include('search')) managed.push(keys.search);
		if (this._include('filters')) this._filterFields().forEach((filter) => managed.push(`${keys.filterPrefix}${filter}`, `${keys.filterPrefix}${filter}_op`));
		return managed.filter(Boolean);
	}

	_filterFields() {
		return this._hooks.getFilterFields?.() || [];
	}

	_keys() {
		const source = this._options.keys || {};
		const prefix = String(this._options.prefix || '');
		return {
			page: `${prefix}${source.page || 'page'}`,
			perPage: `${prefix}${source.perPage || 'perPage'}`,
			sort: `${prefix}${source.sort || 'sort'}`,
			direction: `${prefix}${source.direction || 'dir'}`,
			search: `${prefix}${source.search || 'search'}`,
			filterPrefix: `${prefix}${source.filterPrefix || 'filter-'}`,
		};
	}

	_include(key) {
		return (this._options.include || {})[key] !== false;
	}

	_emptyState() {
		return {page: null, perPage: null, sort: null, search: '', filters: {}, present: {page: false, perPage: false, sort: false, search: false, filters: false}};
	}

	_set(url, key, value) {
		if (value === undefined || value === null || String(value) === '') return;
		url.searchParams.set(key, String(value));
	}

	_append(url, key, value) {
		if (value === undefined || value === null || String(value) === '') return;
		url.searchParams.append(key, String(value));
	}

	_positiveInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
	}

	_list(value) {
		return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
	}
}

export default _urlState;
