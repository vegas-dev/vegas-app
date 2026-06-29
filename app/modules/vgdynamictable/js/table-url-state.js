import {normalizeBooleanOption, normalizeEnabledFlag, safeQuerySelector, toQueryParamValue} from "./utils/common";

const tableUrlStateMethods = {
    _syncUrlState() {
        if (!this._isFiltersUrlStateEnabled() || !this._isFiltersUrlStateWriteOnChange()) {
            return;
        }
        if (typeof window === 'undefined' || !window.history || !window.location) {
            return;
        }

        let url;
        try {
            url = new URL(window.location.href);
        } catch (error) {
            this._emitAction('urlstateerror', {
                source: 'write',
                error,
            });
            return;
        }

        const nextState = this._collectUrlState();
        const managedKeys = this._getManagedUrlStateKeys();
        managedKeys.forEach((key) => {
            url.searchParams.delete(key);
        });

        Object.keys(nextState).forEach((key) => {
            const rawValue = nextState[key];
            const value = toQueryParamValue(rawValue);
            if (value === undefined || value === null || value === '') {
                return;
            }
            url.searchParams.set(key, String(value));
        });

        const nextUrl = `${url.pathname}${url.search}${url.hash}`;
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (nextUrl === currentUrl) {
            return;
        }

        const mode = this._getUrlStateMode();
        if (mode === 'push') {
            window.history.pushState({}, '', nextUrl);
        } else {
            window.history.replaceState({}, '', nextUrl);
        }

        this._emitAction('urlstatewrite', {
            mode,
            state: Object.assign({}, nextState),
            url: nextUrl,
        });
    },

    _collectUrlState() {
        const next = {};
        const config = this._getFiltersUrlStateConfig();
        const prefix = this._getFiltersUrlPrefix();
        const searchParam = this._getSearchParamName();

        if (searchParam && Object.prototype.hasOwnProperty.call(this._remoteParams || {}, searchParam)) {
            next[searchParam] = this._remoteParams[searchParam];
        }

        this._getFilterFieldKeys().forEach((field) => {
            const valueKey = field;
            const operatorKey = `${field}_op`;
            const urlValueKey = this._prefixFilterParamKey(valueKey, prefix);
            const urlOperatorKey = this._prefixFilterParamKey(operatorKey, prefix);
            if (Object.prototype.hasOwnProperty.call(this._remoteParams || {}, valueKey)) {
                next[urlValueKey] = this._remoteParams[valueKey];
            }
            if (Object.prototype.hasOwnProperty.call(this._remoteParams || {}, operatorKey)) {
                next[urlOperatorKey] = this._remoteParams[operatorKey];
            }
        });

        if (this._isPaginationEnabled()) {
            const page = this._normalizePositiveInt(this._pageState.page, 1);
            const fallbackPerPage = this._normalizePositiveInt(this._params.pagination.perPage, 10);
            const perPage = this._normalizePositiveInt(this._pageState.perPage, fallbackPerPage);
            next[String(config.pageKey || 'page')] = page;
            next[String(config.perPageKey || 'perPage')] = perPage;
        }

        if (this._params.sortable && this._params.sortable.enable) {
            const sorts = this._getNormalizedSorts(this._sortState.sorts || []);
            const valid = sorts
                .filter((item) => String(item.field || '').trim() !== '')
                .map((item) => `${item.field}:${this._normalizeSortDir(item.dir)}`);
            if (valid.length > 0) {
                next[String(config.sortKey || 'sort')] = valid.join(',');
            }
        }

        return next;
    },

    _getManagedUrlStateKeys() {
        const keys = new Set();
        const config = this._getFiltersUrlStateConfig();
        const prefix = this._getFiltersUrlPrefix();

        keys.add(this._getSearchParamName());
        this._getFilterFieldKeys().forEach((field) => {
            keys.add(this._prefixFilterParamKey(field, prefix));
            keys.add(this._prefixFilterParamKey(`${field}_op`, prefix));
        });

        if (this._isPaginationEnabled()) {
            keys.add(String(config.pageKey || 'page'));
            keys.add(String(config.perPageKey || 'perPage'));
        }
        if (this._params.sortable && this._params.sortable.enable) {
            keys.add(String(config.sortKey || 'sort'));
        }

        return Array.from(keys).filter(Boolean);
    },

    _isUrlStateEnabled() {
        return this._isFiltersUrlStateEnabled();
    },

    _getUrlStateMode() {
        const config = this._getFiltersUrlStateConfig();
        const attr = this._element.getAttribute('data-filters-urlstate-history-mode');
        const mode = String(attr !== null ? attr : (config.historyMode || 'replace')).toLowerCase().trim();
        return mode === 'push' ? 'push' : 'replace';
    },

    _isUrlStateIncludePagination() {
        return this._isPaginationEnabled();
    },

    _isUrlStateIncludeSort() {
        return Boolean(this._params.sortable && this._params.sortable.enable);
    },

    _bindPopState() {
        if (!this._isRemote || !this._isFiltersUrlStateEnabled()) {
            return;
        }
        if (typeof window === 'undefined' || !window.addEventListener) {
            return;
        }
        const listen = this._isUrlStatePopStateEnabled();
        if (!listen) {
            return;
        }
        window.removeEventListener('popstate', this._boundPopState);
        window.addEventListener('popstate', this._boundPopState);
    },

    async _handlePopState() {
        if (!this._isRemote) {
            return;
        }

        this._remoteParams = this._getInitialRemoteParams();
        this._sortState = this._getInitialSortState();
        if (this._sortable) {
            this._sortable.setState({
                sorts: this._sortState.sorts,
            });
        }

        this._syncControlsFromState();

        const page = this._getInitialPage();
        const perPage = this._getInitialPerPage();
        this._pageState = { page, perPage };
        if (this._pagination) {
            this._pagination.setMeta({
                page,
                perPage,
            });
        }

        const filtersRequestMeta = this._getFiltersRequestMetaIfActive();
        await this._loadRemotePage(page, perPage, null, filtersRequestMeta);
    },

    _syncControlsFromState() {
        const searchParam = this._getSearchParamName();
        const searchSelector = this._getSearchInputSelector();
        if (searchSelector) {
            const input = this._getSearchInputNode(searchSelector);
            if (input) {
                input.value = String(this._remoteParams[searchParam] || '');
            }
        }

        if (this._filters && typeof this._filters.setValues === 'function') {
            this._filters.setValues(this._getInitialFilterValues(), { emit: false });
        }
    },

    _isUrlStatePopStateEnabled() {
        const attr = this._element.getAttribute('data-filters-urlstate-listen-popstate');
        return normalizeEnabledFlag(attr, true);
    },

    _getInitialRemoteParams() {
        const requestOptions = this._params.request || {};
        const requestParams = requestOptions.params || {};
        const nextParams = {};
        const reserved = new Set(['page', 'per_page', 'sort', 'dir']);

        Object.keys(requestParams).forEach((key) => {
            if (reserved.has(key)) {
                return;
            }
            const value = requestParams[key];
            if (value === undefined || value === null || value === '') {
                return;
            }
            nextParams[key] = value;
        });

        if (!this._isFiltersUrlStateEnabled() || !this._isFiltersUrlStateReadOnInit()) {
            return nextParams;
        }

        const config = this._getFiltersUrlStateConfig();
        const prefix = this._getFiltersUrlPrefix();
        const urlParams = this._getUrlParams();
        const searchParam = this._getSearchParamName();
        const filterFields = this._getFilterFieldKeys();

        if (searchParam && urlParams.has(searchParam)) {
            const value = String(urlParams.get(searchParam) || '').trim();
            if (value) {
                nextParams[searchParam] = value;
            } else {
                delete nextParams[searchParam];
            }
        }

        filterFields.forEach((field) => {
            const valueKey = this._prefixFilterParamKey(field, prefix);
            const operatorKey = this._prefixFilterParamKey(`${field}_op`, prefix);
            if (urlParams.has(valueKey)) {
                const value = String(urlParams.get(valueKey) || '').trim();
                if (value) {
                    nextParams[field] = value.includes(',') ? value.split(',').map((item) => String(item || '').trim()).filter(Boolean) : value;
                } else {
                    delete nextParams[field];
                }
            }
            if (urlParams.has(operatorKey)) {
                const operator = String(urlParams.get(operatorKey) || '').trim();
                if (operator) {
                    nextParams[`${field}_op`] = operator;
                } else {
                    delete nextParams[`${field}_op`];
                }
            }
        });

        const sortKey = String(config.sortKey || 'sort');
        if (urlParams.has(sortKey)) {
            const rawSort = String(urlParams.get(sortKey) || '').trim();
            if (rawSort) {
                const items = rawSort.split(',').map((item) => String(item || '').trim()).filter(Boolean);
                const fields = [];
                const dirs = [];
                items.forEach((item) => {
                    const parts = item.split(':').map((part) => String(part || '').trim()).filter(Boolean);
                    if (!parts.length) {
                        return;
                    }
                    fields.push(parts[0]);
                    dirs.push(parts[1] === 'desc' ? 'desc' : 'asc');
                });
                if (fields.length) {
                    nextParams.sort = fields.join(',');
                    nextParams.dir = dirs.join(',');
                }
            }
        }

        this._emitAction('urlstateread', {
            state: Object.assign({}, nextParams),
        });

        return nextParams;
    },

    _prefixFilterParamKey(key, prefix) {
        const rawKey = String(key || '').trim();
        if (!rawKey) {
            return '';
        }
        const rawPrefix = String(prefix || '').trim();
        if (!rawPrefix || rawKey.startsWith(rawPrefix)) {
            return rawKey;
        }
        return `${rawPrefix}${rawKey}`;
    },

    _getUrlParams() {
        try {
            return new URLSearchParams(window.location.search || '');
        } catch (error) {
            this._emitAction('urlstateerror', {
                source: 'read',
                error,
            });
            return new URLSearchParams();
        }
    },

    _getSearchParamName() {
        const searchOptions = this._params.search || {};
        const attrParam = this._element.getAttribute('data-search-param') || '';
        return String(searchOptions.param || attrParam || 'q').trim() || 'q';
    },

    _getFilterFieldKeys() {
        const form = this._getFiltersFormNode();
        if (!form) {
            return [];
        }

        if (Array.isArray(this._filterParamKeysCache)) {
            return this._filterParamKeysCache.slice();
        }

        const options = this._params.filters || {};
        const fieldAttr = String(options.fieldAttr || 'data-filter-field').trim() || 'data-filter-field';
        const unique = new Set();
        Array.from(form.querySelectorAll(`[${fieldAttr}]`)).forEach((node) => {
            const key = String(node.getAttribute(fieldAttr) || '').trim();
            if (key) {
                unique.add(key);
            }
        });
        this._filterParamKeysCache = Array.from(unique);
        return this._filterParamKeysCache.slice();
    },

    _getInitialFilterValues() {
        const keys = this._getFilterFieldKeys();
        if (!keys.length) {
            return {};
        }
        const values = {};
        keys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(this._remoteParams, key)) {
                values[key] = this._remoteParams[key];
            }
            if (Object.prototype.hasOwnProperty.call(this._remoteParams, `${key}_op`)) {
                values[`${key}_op`] = this._remoteParams[`${key}_op`];
            }
        });
        return values;
    },

    _getFiltersFormSelector() {
        const filterOptions = this._params.filters || {};
        if (typeof filterOptions.form === 'string') {
            return String(filterOptions.form).trim();
        }
        const attrSelector = this._element.getAttribute('data-filters-form') || '';
        return String(attrSelector).trim();
    },

    _getFiltersFormNode() {
        const filterOptions = this._params.filters || {};
        const optionForm = filterOptions.form;
        if (optionForm && optionForm.nodeType === 1) {
            const shouldRefreshByNode = this._filtersFormCacheNode !== optionForm
                || this._filtersFormCacheSelector !== '';
            if (shouldRefreshByNode) {
                this._filtersFormCacheSelector = '';
                this._filtersFormCacheNode = optionForm;
                this._filterParamKeysCache = null;
            }
            if (!optionForm.isConnected) {
                return null;
            }
            return this._filtersFormCacheNode;
        }

        const selector = this._getFiltersFormSelector();
        if (!selector) {
            this._filtersFormCacheSelector = '';
            this._filtersFormCacheNode = null;
            this._filterParamKeysCache = null;
            return null;
        }
        const shouldRefresh = this._filtersFormCacheSelector !== selector
            || !this._filtersFormCacheNode
            || !this._filtersFormCacheNode.isConnected;
        if (shouldRefresh) {
            this._filtersFormCacheSelector = selector;
            this._filtersFormCacheNode = safeQuerySelector(selector);
            this._filterParamKeysCache = null;
        }
        return this._filtersFormCacheNode;
    },

    _getFiltersUrlStateConfig() {
        const filters = this._params.filters || {};
        const urlState = filters.urlState && typeof filters.urlState === 'object'
            ? filters.urlState
            : {};
        return urlState;
    },

    _getFiltersUrlPrefix() {
        const config = this._getFiltersUrlStateConfig();
        const attr = this._element.getAttribute('data-filters-urlstate-prefix');
        const raw = attr !== null ? attr : config.paramPrefix;
        return String(raw || 'f.').trim() || 'f.';
    },

    _isFiltersUrlStateEnabled() {
        const config = this._getFiltersUrlStateConfig();
        const attr = this._element.getAttribute('data-filters-urlstate-enable');
        const raw = attr !== null ? attr : config.enable;
        return normalizeBooleanOption(raw, false);
    },

    _isFiltersUrlStateReadOnInit() {
        const config = this._getFiltersUrlStateConfig();
        const attr = this._element.getAttribute('data-filters-urlstate-read-on-init');
        const raw = attr !== null ? attr : config.readOnInit;
        return normalizeEnabledFlag(raw, true);
    },

    _isFiltersUrlStateWriteOnChange() {
        const config = this._getFiltersUrlStateConfig();
        const attr = this._element.getAttribute('data-filters-urlstate-write-on-change');
        const raw = attr !== null ? attr : config.writeOnChange;
        return normalizeEnabledFlag(raw, true);
    },
};

export default tableUrlStateMethods;
