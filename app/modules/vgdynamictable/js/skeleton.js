const skeletonMethods = {
    _renderLoadingSkeleton() {
        const body = this._getBody();
        const columns = this._getRenderedColumnsCount();
        const columnWidths = this._getCurrentColumnWidthsPx();
        const rowsCount = this._getSkeletonRowsCount();
        const rowHeight = this._getSkeletonRowHeightPx();
        const rowHeightStyle = Number.isFinite(rowHeight) && rowHeight > 0
            ? `height:${rowHeight}px;--vgdt-skeleton-row-height:${rowHeight}px;`
            : '';

        const rowHtml = Array.from({ length: rowsCount }).map((_, rowIndex) => {
            const cells = Array.from({ length: columns }).map((_, columnIndex) => {
                const width = Number.isFinite(columnWidths[columnIndex]) ? Math.round(columnWidths[columnIndex]) : 0;
                const widthStyle = width > 0
                    ? ` style="width:${width}px;min-width:${width}px;max-width:${width}px;"`
                    : '';
                return `<td${widthStyle}><div class="skeleton-cell"><div class="skeleton-line"></div></div></td>`;
            }).join('');
            return `<tr class="skeleton-row" style="${rowHeightStyle}--skeleton-delay:${(rowIndex * 0.08).toFixed(2)}s">${cells}</tr>`;
        }).join('');

        body.innerHTML = rowHtml;
        this._updatePanHintVisibility();
        this._refreshStickyAndFixedLayout();
    },

    _getRenderedColumnsCount() {
        const headerCount = this._getHeaderCells().length;
        const fieldsCount = this._fields.length;
        const resolved = Math.max(headerCount, fieldsCount);
        return resolved > 0 ? resolved : 1;
    },

    _getCurrentColumnWidthsPx() {
        const headers = this._getHeaderCells();
        const headerWidths = headers.map((header) => {
            if (!header || typeof header.getBoundingClientRect !== 'function') {
                return 0;
            }
            const rect = header.getBoundingClientRect();
            return rect && Number.isFinite(rect.width) && rect.width > 0 ? rect.width : 0;
        });

        if (headerWidths.some((width) => width > 0)) {
            return headerWidths;
        }

        const body = this._getBody();
        const firstRow = body && body.rows && body.rows.length ? body.rows[0] : null;
        if (!firstRow || !firstRow.cells || !firstRow.cells.length) {
            return [];
        }

        return Array.from(firstRow.cells).map((cell) => {
            if (!cell || typeof cell.getBoundingClientRect !== 'function') {
                return 0;
            }
            const rect = cell.getBoundingClientRect();
            return rect && Number.isFinite(rect.width) && rect.width > 0 ? rect.width : 0;
        });
    },

    _getSkeletonRowsCount() {
        const renderedRows = this._getRenderedDataRows();
        if (renderedRows.length > 0) {
            return renderedRows.length;
        }

        const body = this._getBody();
        const currentSkeletonRows = Array.from(body.rows || []).filter((row) => {
            return row && row.classList.contains('skeleton-row');
        });
        if (currentSkeletonRows.length > 0) {
            return currentSkeletonRows.length;
        }

        const loadingOptions = this._params.loading || {};
        const explicit = Number.parseInt(loadingOptions.skeleton, 10);
        if (Number.isFinite(explicit) && explicit > 0) {
            return explicit;
        }

        const fromPerPageControl = this._getPerPageControlValue();
        if (Number.isFinite(fromPerPageControl) && fromPerPageControl > 0) {
            return fromPerPageControl;
        }

        const fromState = Number.parseInt(this._pageState && this._pageState.perPage, 10);
        if (Number.isFinite(fromState) && fromState > 0) {
            return fromState;
        }

        const pagination = this._params.pagination || {};
        const fromParams = Number.parseInt(pagination.perPage, 10);
        if (Number.isFinite(fromParams) && fromParams > 0) {
            return fromParams;
        }

        return 5;
    },

    _getPerPageControlValue() {
        if (!this._parent) {
            return NaN;
        }
        const perPageControl = this._parent.querySelector('[data-per-page]');
        if (!perPageControl) {
            return NaN;
        }
        const value = Number.parseInt(perPageControl.value, 10);
        return Number.isFinite(value) ? this._clampPerPage(value, 10) : NaN;
    },

    _getSkeletonRowHeightPx() {
        const renderedRows = this._getRenderedDataRows();
        if (!renderedRows.length) {
            return null;
        }

        const firstRow = renderedRows[0];
        const rect = firstRow.getBoundingClientRect();
        if (!rect || !Number.isFinite(rect.height) || rect.height <= 0) {
            return null;
        }

        return Math.round(rect.height);
    },

    _getRenderedDataRows() {
        const body = this._getBody();
        return Array.from(body.rows || []).filter((row) => {
            if (!row || row.classList.contains('skeleton-row')) {
                return false;
            }
            if (row.querySelector('[data-table-state]')) {
                return false;
            }
            return true;
        });
    },
};

export default skeletonMethods;
