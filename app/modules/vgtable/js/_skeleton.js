/**
 * Описание: skeleton-состояние загрузки строк VGTable.
 * Возможности: сохраняет количество, высоту и ширины текущих строк, поддерживает пустую таблицу и пагинацию.
 */

const SKELETON_ROW_SELECTOR = 'tr[data-vg-table-skeleton]';

class _skeleton {
	constructor(table, options = {}, hooks = {}) {
		this._table = table;
		this._options = options;
		this._hooks = hooks;
	}

	render() {
		if (this._options.enabled === false) return 0;
		const body = this._body();
		const rows = this._dataRows();
		const widths = this._columnWidths(rows[0]);
		const preserveColumnWidths = this._hasHorizontalOverflow();
		const columns = Math.max(1, widths.length, this._headerCells().length);
		const rowCount = this._rowsCount(rows);
		const rowHeight = this._rowHeight(rows[0]);
		const fragment = this._table.ownerDocument.createDocumentFragment();

		for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
			const row = this._table.ownerDocument.createElement('tr');
			row.className = 'vg-table-skeleton-row';
			row.setAttribute('data-vg-table-skeleton', '');
			row.setAttribute('aria-hidden', 'true');
			row.style.setProperty('--vg-table-skeleton-delay', `${(rowIndex * 0.08).toFixed(2)}s`);
			if (rowHeight > 0) row.style.setProperty('--vg-table-skeleton-row-height', `${rowHeight}px`);

			for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
				const cell = this._table.ownerDocument.createElement('td');
				if (rowHeight > 0) cell.style.height = `${rowHeight}px`;
				const width = Number.isFinite(widths[columnIndex]) ? Math.round(widths[columnIndex]) : 0;
				if (preserveColumnWidths && width > 0) {
					cell.style.width = `${width}px`;
					cell.style.minWidth = `${width}px`;
					cell.style.maxWidth = `${width}px`;
				}
				const content = this._table.ownerDocument.createElement('span');
				content.className = 'vg-table-skeleton-cell';
				const line = this._table.ownerDocument.createElement('span');
				line.className = 'vg-table-skeleton-line';
				content.append(line);
				cell.append(content);
				row.append(cell);
			}
			fragment.append(row);
		}

		body.replaceChildren(fragment);
		this._hooks.afterRender?.();
		return rowCount;
	}

	dispose() {
		this._body().querySelectorAll(SKELETON_ROW_SELECTOR).forEach((row) => row.remove());
	}

	_rowsCount(rows) {
		if (rows.length) return rows.length;
		const current = this._body().querySelectorAll(SKELETON_ROW_SELECTOR).length;
		if (current) return current;
		const explicit = Number.parseInt(this._options.skeleton ?? this._options.rows, 10);
		if (Number.isFinite(explicit) && explicit > 0) return explicit;
		const perPage = Number.parseInt(this._hooks.getPagination?.()?.perPage, 10);
		return Number.isFinite(perPage) && perPage > 0 ? perPage : 5;
	}

	_columnWidths(firstRow) {
		const headerWidths = this._headerCells().map((cell) => this._width(cell));
		if (headerWidths.some((width) => width > 0)) return headerWidths;
		return firstRow ? Array.from(firstRow.cells || [], (cell) => this._width(cell)) : [];
	}

	_headerCells() {
		const headerTable = this._hooks.getHeaderTable?.() || this._table;
		const head = headerTable.tHead || headerTable.querySelector('thead');
		return head?.rows.length ? Array.from(head.rows[head.rows.length - 1].cells) : [];
	}

	_dataRows() {
		return Array.from(this._body().rows || []).filter((row) => (
			!row.matches(SKELETON_ROW_SELECTOR) && !row.querySelector('[data-vg-table-state]')
		));
	}

	_rowHeight(row) {
		const rowHeight = row ? Math.round(this._height(row)) : 0;
		if (rowHeight > 0) return rowHeight;
		const headerTable = this._hooks.getHeaderTable?.() || this._table;
		const head = headerTable.tHead || headerTable.querySelector('thead');
		const headerRow = head?.rows.length ? head.rows[head.rows.length - 1] : null;
		return headerRow ? Math.round(this._height(headerRow)) : 0;
	}

	_width(element) {
		const width = element?.getBoundingClientRect?.().width;
		return Number.isFinite(width) && width > 0 ? width : 0;
	}

	_height(element) {
		const height = element?.getBoundingClientRect?.().height;
		return Number.isFinite(height) && height > 0 ? height : 0;
	}

	_hasHorizontalOverflow() {
		const host = this._hooks.getScrollHost?.()
			|| this._table.closest('.vg-table-body')
			|| this._table.closest('.vg-table-container');
		if (!host) return false;
		return host.scrollWidth - host.clientWidth > 1;
	}

	_body() {
		return this._table.tBodies[0] || this._table.createTBody();
	}
}

export default _skeleton;
