const tableStateMethods = {
    _renderRemoteRows(rows) {
        const body = this._getBody();

        if (!rows.length) {
            const message = this._getTableMessage('stateEmpty', 'Ничего нет');
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
    },

    _renderStateRow(message, state) {
        const body = this._getBody();
        const columns = this._getRenderedColumnsCount();
        const retryButton = state === 'error'
            ? `<div class="vgdt-state-actions"><button type="button" class="vgdt-state-reset" data-state-retry>${this._escapeHtml(this._getTableMessage('retry', 'Retry'))}</button></div>`
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
    },

    _hasRenderableRowsInBody(body) {
        if (!body || !body.rows || !body.rows.length) {
            return false;
        }
        return Array.from(body.rows).some((row) => {
            const cells = Array.from(row.cells || []);
            if (!cells.length) {
                return false;
            }
            return cells.some((cell) => {
                if (!cell) {
                    return false;
                }
                const text = String(cell.textContent || '').trim();
                return text !== '' || cell.children.length > 0;
            });
        });
    },

    _setFixedColumnsSuppressed(value) {
        this._fixedColumnsSuppressed = Boolean(value);
    },

    _setStateMode(state) {
        if (!this._parent) {
            return;
        }
        this._parent.setAttribute('data-state-mode', String(state || ''));
    },

    _clearStateMode() {
        if (!this._parent) {
            return;
        }
        this._parent.removeAttribute('data-state-mode');
    },

    _buildStateIllustrationMarkup(state) {
        const stateOptions = this._params.state && typeof this._params.state === 'object'
            ? this._params.state
            : {};
        const optionKey = state === 'error' ? 'errorIllustration' : 'emptyIllustration';
        const attrName = state === 'error'
            ? 'data-state-error-illustration'
            : 'data-state-empty-illustration';
        const optionValue = stateOptions[optionKey] || '';
        const attrValue = this._element ? this._element.getAttribute(attrName) : '';
        const src = String(optionValue || attrValue || '').trim();
        if (!src) {
            return '<div class="vgdt-state-illustration" aria-hidden="true"></div>';
        }
        const inlineSvg = this._extractInlineSvgMarkup(src);
        if (inlineSvg) {
            return `<div class="vgdt-state-illustration" aria-hidden="true">${inlineSvg}</div>`;
        }
        const alt = state === 'error' ? 'Error' : 'Empty';
        return `<div class="vgdt-state-illustration"><img src="${this._escapeHtml(src)}" alt="${alt}" loading="lazy"></div>`;
    },

    _extractInlineSvgMarkup(value) {
        const raw = String(value || '').trim();
        if (!raw) {
            return '';
        }
        if (/^<svg[\s>]/i.test(raw)) {
            return raw;
        }

        const decoded = this._decodeHtmlEntities(raw);
        if (/^<svg[\s>]/i.test(decoded)) {
            return decoded;
        }
        return '';
    },

    _decodeHtmlEntities(value) {
        return String(value || '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, '\'')
            .replace(/&amp;/g, '&');
    },

    _ensureStateRowVisible(stateCell) {
        if (!stateCell) {
            return;
        }
        const minHeight = this._getStateBlockMinHeight();
        stateCell.style.minHeight = `${minHeight}px`;
        if (this._tableViewport) {
            this._tableViewport.scrollTop = 0;
            this._tableViewport.scrollLeft = 0;
        }
        if (typeof window === 'undefined') {
            return;
        }
        const rect = stateCell.getBoundingClientRect();
        const vh = window.innerHeight || 0;
        if (rect.top < 0 || (vh > 0 && rect.bottom > vh)) {
            stateCell.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
    },

    _getStateBlockMinHeight() {
        if (typeof window === 'undefined') {
            return 180;
        }
        const vh = window.innerHeight || 0;
        const isMobile = (window.innerWidth || 0) <= 768;
        const ratio = isMobile ? 0.52 : 0.34;
        const computed = vh > 0 ? Math.round(vh * ratio) : 0;
        return Math.max(160, computed);
    },

    _bindTableStateActions() {
        this._element.addEventListener('click', (event) => {
            const reset = event.target.closest('[data-state-reset]');
            if (reset) {
                event.preventDefault();
                this._resetFiltersAndSearch();
                return;
            }
            const retry = event.target.closest('[data-state-retry]');
            if (retry) {
                event.preventDefault();
                this._reloadCurrentPage();
            }
        });
    },

    _resetFiltersAndSearch() {
        if (!this._isRemote) {
            return;
        }

        this._remoteParams = {};
        this._activeFilters = {};
        this._sortState = Object.assign({}, this._sortState, { field: '', dir: 'asc', columnIndex: -1, sorts: [] });
        if (this._sortable) {
            this._sortable.setState({ sorts: [] });
        }

        const searchSelector = this._getSearchInputSelector();
        if (searchSelector) {
            const searchInput = this._getSearchInputNode(searchSelector);
            if (searchInput) {
                searchInput.value = '';
            }
        }

        if (this._filters && typeof this._filters.setValues === 'function') {
            this._filters.setValues({}, { emit: false });
        }

        const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
        this._pageState = { page: 1, perPage };
        this._emitAction('reset', {
            page: 1,
            perPage,
        });
        this._loadRemotePage(1, perPage);
    },

    _reloadCurrentPage() {
        if (!this._isRemote) {
            return;
        }
        const page = this._pageState.page || 1;
        const perPage = this._pageState.perPage || this._normalizePositiveInt(this._params.pagination.perPage, 10);
        this._loadRemotePage(page, perPage);
    },

    _hasActiveRemoteFilters() {
        if (!this._isRemote) {
            return false;
        }
        return Object.keys(this._remoteParams || {}).length > 0;
    },

    _ensureLiveRegion() {
        if (this._liveRegion || !this._parent) {
            return;
        }
        const node = document.createElement('div');
        node.className = 'vgdt-live-region';
        node.setAttribute('aria-live', 'polite');
        node.setAttribute('aria-atomic', 'true');
        this._parent.appendChild(node);
        this._liveRegion = node;
    },

    _announce(message) {
        if (!this._liveRegion) {
            return;
        }
        this._liveRegion.textContent = String(message || '');
    },
};

export default tableStateMethods;

