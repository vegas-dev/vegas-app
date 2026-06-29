const tableRemoteMethods = {
    _getRemoteRouteRequestConfig(route = '') {
        const requestOptions = this._params.request || {};
        const attrMethod = this._element.getAttribute('data-request-method');
        const attrCredentials = this._element.getAttribute('data-request-credentials');
        const attrParams = this._element.getAttribute('data-request-params');
        let paramsFromAttr = {};

        if (attrParams !== null && String(attrParams).trim() !== '') {
            try {
                const parsed = JSON.parse(attrParams);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    paramsFromAttr = parsed;
                }
            } catch (error) {
                paramsFromAttr = {};
            }
        }

        return {
            route: route || this._getRemoteDataRoute(),
            method: attrMethod !== null ? attrMethod : requestOptions.method,
            credentials: attrCredentials !== null ? attrCredentials : requestOptions.credentials,
            headers: requestOptions.headers && typeof requestOptions.headers === 'object'
                ? Object.assign({}, requestOptions.headers)
                : { 'Accept': 'application/json' },
            baseParams: Object.assign(
                {},
                requestOptions.params && typeof requestOptions.params === 'object' ? requestOptions.params : {},
                paramsFromAttr
            ),
            responseType: 'json',
        };
    },

    _isRemoteCacheEnabled() {
        const requestOptions = this._params.request || {};
        const requestCacheOptions = requestOptions.cache && typeof requestOptions.cache === 'object'
            ? requestOptions.cache
            : {};
        const attr = this._element.getAttribute('data-request-cache-enable');
        if (attr !== null) {
            return this._isTruthy(attr);
        }
        const fromOptions = requestCacheOptions.enable;
        if (fromOptions === undefined || fromOptions === null) {
            return true;
        }
        return Boolean(fromOptions);
    },

    _getRemoteCacheTtlMs() {
        const requestOptions = this._params.request || {};
        const requestCacheOptions = requestOptions.cache && typeof requestOptions.cache === 'object'
            ? requestOptions.cache
            : {};
        const attr = this._element.getAttribute('data-request-cache-ttl');
        const raw = attr !== null ? attr : requestCacheOptions.ttl;
        const parsed = Number.parseInt(raw, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
    },

    _getRemoteCacheMaxEntries() {
        const requestOptions = this._params.request || {};
        const requestCacheOptions = requestOptions.cache && typeof requestOptions.cache === 'object'
            ? requestOptions.cache
            : {};
        const attr = this._element.getAttribute('data-request-cache-max');
        const raw = attr !== null ? attr : requestCacheOptions.max;
        const parsed = Number.parseInt(raw, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
    },

    _getRemoteCacheKey(endpoint, params = {}) {
        const keys = Object.keys(params || {}).sort();
        const query = keys.map((key) => {
            const value = params[key];
            const normalized = Array.isArray(value)
                ? value.join(',')
                : String(value === undefined || value === null ? '' : value);
            return `${encodeURIComponent(key)}=${encodeURIComponent(normalized)}`;
        }).join('&');
        return `${String(endpoint || '').trim()}?${query}`;
    },

    _readRemoteCache(endpoint, params = {}) {
        if (!this._isRemoteCacheEnabled()) {
            return null;
        }
        if (!this._remotePageCache || typeof this._remotePageCache.get !== 'function') {
            return null;
        }
        const key = this._getRemoteCacheKey(endpoint, params);
        const entry = this._remotePageCache.get(key);
        if (!entry || typeof entry !== 'object') {
            return null;
        }
        const ttlMs = this._getRemoteCacheTtlMs();
        const age = Date.now() - Number(entry.ts || 0);
        if (!Number.isFinite(age) || age < 0 || age > ttlMs) {
            this._remotePageCache.delete(key);
            return null;
        }
        entry.lastUsedAt = Date.now();
        return entry.response;
    },

    _writeRemoteCache(endpoint, params = {}, response) {
        if (!this._isRemoteCacheEnabled()) {
            return;
        }
        if (!this._remotePageCache || typeof this._remotePageCache.set !== 'function') {
            return;
        }
        const key = this._getRemoteCacheKey(endpoint, params);
        this._remotePageCache.set(key, {
            ts: Date.now(),
            lastUsedAt: Date.now(),
            response,
        });

        const maxEntries = this._getRemoteCacheMaxEntries();
        if (this._remotePageCache.size <= maxEntries) {
            return;
        }
        const entries = Array.from(this._remotePageCache.entries());
        entries.sort((a, b) => Number((a[1] && a[1].lastUsedAt) || 0) - Number((b[1] && b[1].lastUsedAt) || 0));
        while (this._remotePageCache.size > maxEntries && entries.length) {
            const next = entries.shift();
            if (next) {
                this._remotePageCache.delete(next[0]);
            }
        }
    },

    _applyRemoteResponse(response, safePage, safePerPage, userOnChange = null, options = {}) {
        const rows = this._extractRemoteRows(response);
        const meta = this._extractRemoteMeta(response);
        const fromCache = Boolean(options.fromCache);
        const requestContext = options.requestContext && typeof options.requestContext === 'object'
            ? options.requestContext
            : null;
        const requestId = String(
            (meta && (meta.request_id || meta.requestId))
            || (requestContext && requestContext.requestId)
            || ''
        ).trim();
        this._lastRemoteMeta = meta;
        this._renderSummary(meta);

        const viewRowsHtml = this._extractRemoteViewRowsHtml(response);
        const didRenderView = this._renderRemoteViewIfConfigured(viewRowsHtml, rows);
        if (!didRenderView) {
            this._renderRemoteRows(rows);
        }
        this._renderFooterFromRows(rows, meta);
        this._updatePanHintVisibility();
        this._refreshStickyAndFixedLayout();

        const nextPage = this._normalizePositiveInt(meta.page, safePage);
        const nextPerPage = this._clampPerPage(meta.per_page, safePerPage);
        const totalPages = this._normalizePositiveInt(meta.pages, 1);
        this._pageState = { page: nextPage, perPage: nextPerPage };
        this._storePage(nextPage);
        this._storePerPage(nextPerPage);

        const nextSort = typeof meta.sort === 'string' ? meta.sort.trim() : this._sortState.field;
        const nextDir = meta && typeof meta.dir === 'string' ? meta.dir : this._sortState.dir;
        if (nextSort) {
            const metaSorts = this._parseSortsFromStrings(nextSort, nextDir);
            this._sortState = Object.assign({}, this._sortState, {
                field: metaSorts[0] ? metaSorts[0].field : nextSort,
                dir: metaSorts[0] ? metaSorts[0].dir : this._normalizeSortDir(nextDir),
                sorts: metaSorts,
            });
            if (this._sortable) {
                this._sortable.setState({
                    sorts: this._sortState.sorts,
                });
            }
        }

        if (this._pagination) {
            this._pagination.setMeta({
                page: nextPage,
                perPage: nextPerPage,
                totalPages,
            });
        }

        if (typeof userOnChange === 'function') {
            userOnChange({
                page: nextPage,
                perPage: nextPerPage,
                totalPages,
            });
        }
        this._syncUrlState();
        const received = {
            rows: Array.isArray(rows) ? rows.slice() : [],
            total: this._normalizePositiveInt(meta && meta.total, Array.isArray(rows) ? rows.length : 0),
            serverMeta: Object.assign({}, meta || {}),
            raw: response,
        };
        const sent = requestContext && requestContext.sent
            ? Object.assign({}, requestContext.sent)
            : {};
        const requestTrigger = requestContext && typeof requestContext.trigger === 'string'
            ? String(requestContext.trigger).toLowerCase().trim()
            : '';
        const requestFiltersState = requestContext && requestContext.filtersState && typeof requestContext.filtersState === 'object'
            ? this._normalizeFiltersEventState(requestContext.filtersState)
            : null;
        if (requestTrigger === 'filterschange' && this._isFiltersEmitFullContextEnabled()) {
            const fallbackState = this._normalizeFiltersEventState({
                filters: sent.filters || {},
                params: sent.params || {},
            });
            const eventState = requestFiltersState || fallbackState;
            const isSearched = this._isSearchActiveFromParams(sent.params || {});
            this._emitAction('filterschange', {
                filters: Object.assign({}, eventState.filters || {}),
                params: Object.assign({}, eventState.params || {}),
                fields: Array.isArray(eventState.fields) ? eventState.fields.slice() : [],
                meta: Object.assign({}, eventState.meta || {}),
                phase: 'response',
                isFiltered: this._isFilteredState(eventState) || isSearched,
                isSearched,
                requestId,
                fromCache,
                sent,
                received,
                response,
                serverMeta: Object.assign({}, received.serverMeta || {}),
            });
        }
        this._emitAction('requestsuccess', {
            requestId,
            mode: 'remote',
            responsemode: this._getRemoteResponseMode(),
            sent,
            received,
            fromCache,
        });
        this._emitAction('dataloaded', {
            requestId,
            page: nextPage,
            perPage: nextPerPage,
            totalPages,
            rows,
            view: viewRowsHtml,
            meta,
            fromCache,
            sent,
            received,
        });
        this._emitAction('afterrender', {
            requestId,
            renderedCount: Array.isArray(rows) ? rows.length : 0,
            total: received.total,
            sent,
            received,
        });
        this._emitAction('statesync', {
            requestId,
            state: {
                page: nextPage,
                perPage: nextPerPage,
                sorts: this._getNormalizedSorts(this._sortState.sorts),
                filters: Object.assign({}, this._activeFilters || {}),
                params: Object.assign({}, this._remoteParams || {}),
            },
            sent,
            received,
        });
        if (!Array.isArray(rows) || rows.length === 0) {
            this._emitAction('emptyresult', {
                requestId,
                reason: 'no_matches',
                sent,
                received,
            });
        }
    },

    _buildRemoteRequestParams(page, perPage) {
        const sortOptions = this._params.sortable || {};
        const requestParams = {
            page,
            per_page: perPage,
        };
        Object.assign(requestParams, this._remoteParams);

        const responseMode = this._getRemoteResponseMode();
        if (responseMode !== 'data') {
            const viewParam = this._getRemoteViewParamName();
            const viewValue = this._getRemoteViewParamValue();
            if (viewParam && viewValue && !Object.prototype.hasOwnProperty.call(requestParams, viewParam)) {
                requestParams[viewParam] = viewValue;
            }

            const fieldsParam = this._getRemoteFieldsParamName();
            if (fieldsParam && this._fields.length && !Object.prototype.hasOwnProperty.call(requestParams, fieldsParam)) {
                requestParams[fieldsParam] = this._fields.join(',');
            }
        }

        if (sortOptions.enable && this._sortState.field) {
            const remoteFieldParam = 'sort';
            const remoteDirParam = 'dir';
            const sorts = this._getNormalizedSorts(this._sortState.sorts);
            if (sorts.length > 0) {
                requestParams[remoteFieldParam] = sorts.map((item) => item.field).join(',');
                requestParams[remoteDirParam] = sorts.map((item) => item.dir).join(',');
            } else {
                requestParams[remoteFieldParam] = this._sortState.field;
                requestParams[remoteDirParam] = this._sortState.dir;
            }
        }

        return requestParams;
    },

    exportRemote(format = 'csv', options = {}) {
        if (!this._isRemote) {
            return '';
        }
        const requestOptions = this._params.request || {};

        const normalizedFormat = String(format || 'csv').toLowerCase().trim() === 'xlsx'
            ? 'xlsx'
            : 'csv';
        const safePage = this._normalizePositiveInt(
            options.page !== undefined ? options.page : this._pageState.page,
            1
        );
        const safePerPage = this._clampPerPage(
            options.perPage !== undefined ? options.perPage : this._pageState.perPage,
            this._getInitialPerPage()
        );

        const requestParams = this._buildRemoteRequestParams(safePage, safePerPage);
        requestParams.format = normalizedFormat;
        const mappedRequestParams = this._mapRemoteRequestParams(requestParams);
        const endpoint = String(
            options.endpoint
            || (requestOptions.export && requestOptions.export.route)
            || this._element.getAttribute('data-request-export-route')
            || this._getRemoteDataRoute()
        ).trim();
        const exportEndpoint = endpoint || this._getRemoteDataRoute();
        const exportUrl = this._buildRouteUrl(
            mappedRequestParams,
            exportEndpoint,
            this._getRemoteRouteRequestConfig(exportEndpoint)
        ).toString();
        if (options.open !== false && typeof window !== 'undefined' && typeof window.open === 'function') {
            window.open(exportUrl, '_blank', 'noopener');
        }

        this._emitAction('export', {
            format: normalizedFormat,
            page: safePage,
            perPage: safePerPage,
            endpoint: exportEndpoint,
            url: exportUrl,
        });
        return exportUrl;
    },

    async _loadRemotePage(page, perPage, userOnChange = null, requestMeta = null) {
        if (!this._isRemote) {
            return;
        }

        const safePage = this._normalizePositiveInt(page, 1);
        const safePerPage = this._clampPerPage(perPage, this._getInitialPerPage());
        const requestToken = ++this._requestToken;
        const requestId = `req-${Date.now()}-${requestToken}`;
        const requestParams = this._buildRemoteRequestParams(safePage, safePerPage);
        const mappedRequestParams = this._mapRemoteRequestParams(requestParams);
        const endpoint = this._getRemoteDataRoute();
        const filtersOptions = this._params.filters || {};
        const transport = filtersOptions.transport && typeof filtersOptions.transport === 'object'
            ? filtersOptions.transport
            : {};
        if (transport.includeMeta !== false) {
            mappedRequestParams.request_id = requestId;
            mappedRequestParams.responsemode = this._getRemoteResponseMode();
        }
        const sent = {
            filters: Object.assign({}, this._activeFilters || {}),
            sort: this._getNormalizedSorts(this._sortState.sorts || []),
            page: safePage,
            perPage: safePerPage,
            params: Object.assign({}, this._remoteParams || {}),
            urlState: this._collectUrlState(),
            requestPayload: Object.assign({}, mappedRequestParams),
            endpoint,
        };
        const trigger = requestMeta && typeof requestMeta.trigger === 'string'
            ? String(requestMeta.trigger).toLowerCase().trim()
            : '';
        const filtersState = requestMeta && requestMeta.filtersState && typeof requestMeta.filtersState === 'object'
            ? this._normalizeFiltersEventState(requestMeta.filtersState)
            : null;
        const requestContext = {
            requestId,
            sent,
            trigger,
            filtersState,
        };
        this._activeRemoteRequestId = requestId;
        const cachedResponse = this._readRemoteCache(endpoint, mappedRequestParams);
        if (trigger === 'filterschange' && this._isFiltersEmitFullContextEnabled()) {
            const eventState = filtersState || this._normalizeFiltersEventState({
                filters: sent.filters || {},
                params: sent.params || {},
            });
            const isSearched = this._isSearchActiveFromParams(sent.params || {});
            this._emitAction('filterschange', {
                filters: Object.assign({}, eventState.filters || {}),
                params: Object.assign({}, eventState.params || {}),
                fields: Array.isArray(eventState.fields) ? eventState.fields.slice() : [],
                meta: Object.assign({}, eventState.meta || {}),
                phase: 'request',
                isFiltered: this._isFilteredState(eventState) || isSearched,
                isSearched,
                requestId,
                fromCache: Boolean(cachedResponse),
                sent,
                table: null,
            });
        }
        if (this._requestAbortController && typeof this._requestAbortController.abort === 'function') {
            this._requestAbortController.abort();
        }
        const requestAbortController = cachedResponse ? null : (typeof AbortController === 'function'
            ? new AbortController()
            : null);
        this._requestAbortController = requestAbortController;
        const requestStartedAt = Date.now();
        this._emitAction('beforeload', {
            requestId,
            page: safePage,
            perPage: safePerPage,
            params: Object.assign({}, this._remoteParams),
            sent,
        });
        if (!cachedResponse) {
            this._renderLoadingSkeleton();
        }

        try {
            const response = cachedResponse || await this._route(Object.assign(
                {},
                this._getRemoteRouteRequestConfig(endpoint),
                {
                    route: endpoint,
                    method: 'GET',
                    params: mappedRequestParams,
                    signal: requestAbortController ? requestAbortController.signal : undefined,
                    responseType: 'json',
                }
            ));
            if (!cachedResponse) {
                await this._waitMinLoadingDelay(requestStartedAt);
            }

            if (requestToken !== this._requestToken) {
                this._emitAction('staleresponse', {
                    requestId,
                    activeRequestId: String(this._activeRemoteRequestId || ''),
                    sent,
                });
                return;
            }

            if (!cachedResponse) {
                this._writeRemoteCache(endpoint, mappedRequestParams, response);
            }
            this._applyRemoteResponse(response, safePage, safePerPage, userOnChange, {
                fromCache: Boolean(cachedResponse),
                requestContext,
            });
        } catch (error) {
            if (error && error.name === 'AbortError') {
                return;
            }
            await this._waitMinLoadingDelay(requestStartedAt);
            if (requestToken !== this._requestToken) {
                this._emitAction('staleresponse', {
                    requestId,
                    activeRequestId: String(this._activeRemoteRequestId || ''),
                    sent,
                });
                return;
            }
            this._renderSummary({ total: 0 });
            this._clearFooter();
            const errorMessage = this._getTableMessage('stateError', 'Failed to load data.');
            if (typeof console !== 'undefined' && typeof console.error === 'function') {
                console.error('VGDynamicTable: remote data load failed', error);
            }
            this._renderStateRow(errorMessage, 'error');
            this._refreshStickyAndFixedLayout();
            this._emitAction('error', {
                requestId,
                page: safePage,
                perPage: safePerPage,
                error,
                message: errorMessage,
                sent,
            });
            this._emitAction('requesterror', {
                requestId,
                mode: 'remote',
                responsemode: this._getRemoteResponseMode(),
                sent,
                error: {
                    message: String((error && error.message) || errorMessage),
                    code: String((error && error.code) || 'REQUEST_FAILED'),
                    status: error && error.status ? error.status : 0,
                    details: error && Array.isArray(error.details) ? error.details.slice() : [],
                },
            });
            if (requestContext && String(requestContext.trigger || '').toLowerCase().trim() === 'filterschange' && this._isFiltersEmitFullContextEnabled()) {
                const eventState = requestContext.filtersState && typeof requestContext.filtersState === 'object'
                    ? this._normalizeFiltersEventState(requestContext.filtersState)
                    : this._normalizeFiltersEventState({
                        filters: sent.filters || {},
                        params: sent.params || {},
                    });
                const isSearched = this._isSearchActiveFromParams(sent.params || {});
                this._emitAction('filterschange', {
                    filters: Object.assign({}, eventState.filters || {}),
                    params: Object.assign({}, eventState.params || {}),
                    fields: Array.isArray(eventState.fields) ? eventState.fields.slice() : [],
                    meta: Object.assign({}, eventState.meta || {}),
                    phase: 'error',
                    isFiltered: this._isFilteredState(eventState) || isSearched,
                    isSearched,
                    requestId,
                    sent,
                    error: {
                        message: String((error && error.message) || errorMessage),
                        code: String((error && error.code) || 'REQUEST_FAILED'),
                        status: error && error.status ? error.status : 0,
                        details: error && Array.isArray(error.details) ? error.details.slice() : [],
                    },
                });
            }
        } finally {
            if (this._requestAbortController === requestAbortController) {
                this._requestAbortController = null;
            }
        }
    },

    _getRemoteResponseMode() {
        const requestOptions = this._params.request || {};
        const attrResponseMode = this._element.getAttribute('data-request-responsemode');
        const raw = attrResponseMode !== null ? attrResponseMode : requestOptions.responsemode;
        const normalized = String(raw || 'data').toLowerCase().trim();
        if (normalized === 'view' || normalized === 'auto') {
            return normalized;
        }
        return 'data';
    },

    _getRemoteViewParamName() {
        const requestOptions = this._params.request || {};
        const attr = this._element.getAttribute('data-request-viewparam');
        const raw = attr !== null ? attr : requestOptions.viewparam;
        const normalized = String(raw || '').trim();
        return normalized || '';
    },

    _getRemoteViewParamValue() {
        const requestOptions = this._params.request || {};
        const attr = this._element.getAttribute('data-request-viewvalue');
        const raw = attr !== null ? attr : requestOptions.viewvalue;
        const normalized = String(raw || '').trim();
        return normalized || '';
    },

    _getRemoteFieldsParamName() {
        const requestOptions = this._params.request || {};
        const attr = this._element.getAttribute('data-request-fieldsparam');
        const raw = attr !== null ? attr : requestOptions.fieldsparam;
        const normalized = String(raw || '').trim();
        return normalized || '';
    },

    _getRemoteDataRoute() {
        const filtersRoute = this._getFiltersRoute();
        if (filtersRoute) {
            return filtersRoute;
        }
        return this._getRoute();
    },

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
    },

    _mapRemoteRequestParams(params = {}) {
        const map = Object.assign(
            {},
            this._getAutoFilterRequestParamMap(params),
            this._getRequestParamMap()
        );
        const result = {};
        Object.keys(params || {}).forEach((key) => {
            const target = Object.prototype.hasOwnProperty.call(map, key)
                ? String(map[key] || '').trim()
                : key;
            const nextKey = target || key;
            result[nextKey] = params[key];
        });
        return result;
    },

    _getAutoFilterRequestParamMap(params = {}) {
        const source = params && typeof params === 'object'
            ? params
            : {};
        const fields = typeof this._getFilterFieldKeys === 'function'
            ? this._getFilterFieldKeys()
            : [];
        if (!Array.isArray(fields) || !fields.length) {
            return {};
        }

        const prefix = typeof this._getFiltersUrlPrefix === 'function'
            ? String(this._getFiltersUrlPrefix() || '').trim()
            : '';
        if (!prefix) {
            return {};
        }

        const autoMap = {};
        fields.forEach((field) => {
            const normalizedField = String(field || '').trim();
            if (!normalizedField) {
                return;
            }
            const mappedField = typeof this._prefixFilterParamKey === 'function'
                ? this._prefixFilterParamKey(normalizedField, prefix)
                : (normalizedField.startsWith(prefix) ? normalizedField : `${prefix}${normalizedField}`);

            if (Object.prototype.hasOwnProperty.call(source, normalizedField)) {
                autoMap[normalizedField] = mappedField;
            }

            const operatorKey = `${normalizedField}_op`;
            const mappedOperatorKey = typeof this._prefixFilterParamKey === 'function'
                ? this._prefixFilterParamKey(operatorKey, prefix)
                : (operatorKey.startsWith(prefix) ? operatorKey : `${prefix}${operatorKey}`);
            if (Object.prototype.hasOwnProperty.call(source, operatorKey)) {
                autoMap[operatorKey] = mappedOperatorKey;
            }
        });
        return autoMap;
    },

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
    },

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
    },

    _extractRemoteRows(response) {
        const configured = this._readPath(response, this._getRequestPath('data'));
        if (Array.isArray(configured)) {
            return configured;
        }
        return Array.isArray(response && response.data) ? response.data : [];
    },

    _extractRemoteMeta(response) {
        const configured = this._readPath(response, this._getRequestPath('meta'));
        if (configured && typeof configured === 'object' && !Array.isArray(configured)) {
            return configured;
        }
        return response && typeof response === 'object' && response.meta && typeof response.meta === 'object'
            ? response.meta
            : {};
    },

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
    },

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
            const message = this._getTableMessage('stateEmpty', 'Ничего нет');
            this._renderStateRow(message, 'empty');
            return true;
        }

        const body = this._getBody();
        body.innerHTML = viewRowsHtml;
        if (!this._hasRenderableRowsInBody(body)) {
            this._renderStateRow(this._getTableMessage('stateEmpty', 'Ничего нет'), 'empty');
            return true;
        }
        this._setFixedColumnsSuppressed(false);
        this._clearStateMode();
        return true;
    },

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
    },
};

export default tableRemoteMethods;
