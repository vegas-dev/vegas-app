import {normalizeBooleanOption, normalizeEnabledFlag, safeQuerySelector} from "./utils/common";

const summaryFooterMethods = {
    _renderSummary(meta = {}) {
        if (!this._isSummaryEnabled() || !this._summaryNode || !this._isRemote) {
            return;
        }

        const totalRaw = Number.parseInt(meta.total, 10);
        const total = Number.isFinite(totalRaw) && totalRaw >= 0 ? totalRaw : 0;
        const summaryI18n = this._getI18nSection('summary');
        const foundLabel = (summaryI18n.foundLabel && String(summaryI18n.foundLabel).trim()) || 'Found';
        const totalLabel = `${foundLabel}: ${total}`;
        const active = this._getActiveCriteria();

        const chips = active.map((item) => {
            const label = this._escapeHtml(item.label);
            const value = this._escapeHtml(item.value);
            return `<span class="vgdt-summary__chip"><b>${label}:</b> ${value}</span>`;
        }).join('');

        this._summaryNode.innerHTML = `
            <div class="vgdt-summary__row">
                <span class="vgdt-summary__count">${this._escapeHtml(totalLabel)}</span>
                ${chips ? `<div class="vgdt-summary__chips">${chips}</div>` : ''}
            </div>
        `;
        this._summaryNode.hidden = false;
    },

    _isSummaryEnabled() {
        const options = this._params.summary || {};
        if (options.enable !== undefined && options.enable !== null) {
            return normalizeBooleanOption(options.enable, false);
        }

        const attr = this._element.getAttribute('data-summary-enable');
        return normalizeEnabledFlag(attr, false);
    },

    _getActiveCriteria() {
        const list = [];
        const searchParam = this._getSearchParamName();
        const searchValue = String(this._remoteParams[searchParam] || '').trim();
        if (searchValue !== '') {
            const summaryI18n = this._getI18nSection('summary');
            const searchLabel = (summaryI18n.searchLabel && String(summaryI18n.searchLabel).trim()) || 'Search';
            list.push({ label: searchLabel, value: searchValue });
        }

        Object.keys(this._remoteParams || {}).forEach((key) => {
            if (key === searchParam) {
                return;
            }
            const value = String(this._remoteParams[key] || '').trim();
            if (value === '') {
                return;
            }
            const label = this._getFilterLabelByParam(key) || key;
            list.push({ label, value });
        });

        return list;
    },

    _getFilterLabelByParam(param) {
        const selector = this._getFiltersFormSelector();
        if (!selector) {
            return '';
        }

        const shouldRefreshFormCache = this._filtersFormCacheSelector !== selector
            || !this._filtersFormCacheNode
            || !this._filtersFormCacheNode.isConnected;
        if (shouldRefreshFormCache) {
            this._filtersFormCacheSelector = selector;
            this._filtersFormCacheNode = safeQuerySelector(selector);
            this._filtersLabelCache = {};
        }

        const form = this._filtersFormCacheNode;
        if (!form) {
            return '';
        }

        const cache = this._filtersLabelCache && typeof this._filtersLabelCache === 'object'
            ? this._filtersLabelCache
            : {};
        this._filtersLabelCache = cache;
        if (Object.prototype.hasOwnProperty.call(cache, param)) {
            return cache[param];
        }

        const options = this._params.filters || {};
        const fieldAttr = String(options.fieldAttr || 'data-filter-field').trim() || 'data-filter-field';
        const partAttr = String(options.partAttr || 'data-filter-part').trim() || 'data-filter-part';
        const normalizedParam = String(param || '').trim();
        const isOperator = /_op$/i.test(normalizedParam);
        const fieldKey = normalizedParam.replace(/_op$/i, '');
        const controlSelector = isOperator
            ? `[${fieldAttr}="${fieldKey}"][${partAttr}="operator"]`
            : `[${fieldAttr}="${fieldKey}"]`;
        const control = form.querySelector(controlSelector);
        if (!control) {
            cache[param] = '';
            return '';
        }
        const field = control.closest('.field');
        const labelNode = field ? field.querySelector('.field__label') : null;
        if (labelNode) {
            const label = String(labelNode.textContent || '').trim();
            cache[param] = label;
            return label;
        }
        cache[param] = '';
        return '';
    },

    _getFooterCell() {
        if (!this._isFooterEnabled()) {
            return null;
        }
        const foot = this._element.tFoot || this._element.querySelector('tfoot');
        if (!foot || !foot.rows || !foot.rows.length) {
            return null;
        }
        return foot.querySelector('[data-vgdt-footer]') || foot.rows[0].cells[0] || null;
    },

    _clearFooter() {
        const cell = this._getFooterCell();
        if (!cell) {
            return;
        }
        cell.innerHTML = '';
    },

    _renderFooterFromCurrentState() {
        if (!this._isFooterEnabled()) {
            return;
        }
        if (this._isRemote) {
            return;
        }
        const visibleRows = this._getVisibleRows();
        const records = visibleRows.map((row) => this._mapDomRowToRecord(row));
        this._renderFooterStats(records, null);
    },

    _renderFooterFromRows(rows, meta) {
        if (!this._isFooterEnabled()) {
            return;
        }
        if (!this._isRemote) {
            return;
        }
        this._renderFooterStats(Array.isArray(rows) ? rows : [], meta || null);
    },

    _getVisibleRows() {
        const body = this._getBody();
        return Array.from(body.rows || []).filter((row) => !row.hidden);
    },

    _mapDomRowToRecord(row) {
        const valueByField = {};
        this._fields.forEach((field, index) => {
            const cell = row && row.cells && row.cells[index] ? row.cells[index] : null;
            valueByField[field] = cell ? String(cell.textContent || '').trim() : '';
        });
        return valueByField;
    },

    _renderFooterStats(records, meta) {
        if (!this._isFooterEnabled()) {
            return;
        }
        const cell = this._getFooterCell();
        if (!cell) {
            return;
        }

        const rows = Array.isArray(records) ? records : [];
        const visibleCount = rows.length;
        let sumPrice = 0;
        let sumStock = 0;
        let ratingSum = 0;
        let ratingCount = 0;

        rows.forEach((row) => {
            const price = this._extractNumber(row.price);
            if (Number.isFinite(price)) {
                sumPrice += price;
            }

            const stock = this._extractNumber(row.stock);
            if (Number.isFinite(stock)) {
                sumStock += stock;
            }

            const rating = this._extractNumber(row.rating);
            if (Number.isFinite(rating)) {
                ratingSum += rating;
                ratingCount += 1;
            }
        });

        const avgRating = ratingCount > 0 ? (ratingSum / ratingCount) : 0;

        const summaryI18n = this._getI18nSection('summary');
        const visibleRowsLabel = (summaryI18n.visibleRowsLabel && String(summaryI18n.visibleRowsLabel).trim()) || 'Rows on page';
        const pagePriceSumLabel = (summaryI18n.pagePriceSumLabel && String(summaryI18n.pagePriceSumLabel).trim()) || 'Price sum';
        const pageStockSumLabel = (summaryI18n.pageStockSumLabel && String(summaryI18n.pageStockSumLabel).trim()) || 'Total stock';
        const pageAvgRatingLabel = (summaryI18n.pageAvgRatingLabel && String(summaryI18n.pageAvgRatingLabel).trim()) || 'Average rating';
        const foundLabel = (summaryI18n.foundLabel && String(summaryI18n.foundLabel).trim()) || 'Found';

        const metaTotalRaw = meta && Object.prototype.hasOwnProperty.call(meta, 'total')
            ? Number.parseInt(meta.total, 10)
            : NaN;
        const hasTotal = Number.isFinite(metaTotalRaw) && metaTotalRaw >= 0;
        const totalHtml = hasTotal
            ? `<span class="vgdt-foot__item"><b>${this._escapeHtml(foundLabel)}:</b> ${metaTotalRaw}</span>`
            : '';

        const finiteSumPrice = Number.isFinite(sumPrice) ? sumPrice : 0;
        const finiteSumStock = Number.isFinite(sumStock) ? sumStock : 0;
        const finiteAvgRating = Number.isFinite(avgRating) ? avgRating : 0;

        cell.innerHTML = `
            <div class="vgdt-foot">
                <span class="vgdt-foot__item"><b>${this._escapeHtml(visibleRowsLabel)}:</b> ${visibleCount}</span>
                ${totalHtml}
                <span class="vgdt-foot__item"><b>${this._escapeHtml(pagePriceSumLabel)}:</b> ${finiteSumPrice.toFixed(2)} RUB</span>
                <span class="vgdt-foot__item"><b>${this._escapeHtml(pageStockSumLabel)}:</b> ${Math.round(finiteSumStock)}</span>
                <span class="vgdt-foot__item"><b>${this._escapeHtml(pageAvgRatingLabel)}:</b> ${finiteAvgRating.toFixed(2)}</span>
            </div>
        `;
    },

    _isFooterEnabled() {
        const options = this._params.footer || {};
        if (options.enable !== undefined && options.enable !== null) {
            return normalizeBooleanOption(options.enable, false);
        }

        const attr = this._element.getAttribute('data-footer-enable');
        return normalizeEnabledFlag(attr, false);
    },

    _applyFooterVisibility() {
        const foot = this._element.tFoot || this._element.querySelector('tfoot');
        if (!foot) {
            return;
        }
        foot.hidden = !this._isFooterEnabled();
    },

    _formatFieldValue(field, value) {
        if (field === 'price') {
            const amount = Number.parseFloat(value);
            if (Number.isFinite(amount)) {
                return `${amount.toFixed(2)} RUB`;
            }
            return '';
        }

        if (field === 'category' && (value === null || value === undefined || value === '')) {
            return '-';
        }

        return value === null || value === undefined ? '' : String(value);
    },

    _escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
};

export default summaryFooterMethods;
