/**
 * Описание: нативная фиксация колонок VGTable при горизонтальной прокрутке.
 * Возможности: left/right sticky-колонки, последовательный stack-режим, синхронные тени и совместимость с Fixed Header.
 */

const CELL_ATTRIBUTE = 'data-vg-table-fixed-side';
const EDGE_ATTRIBUTE = 'data-vg-table-fixed-edge';
const OFFSET_PROPERTY = '--vg-table-fixed-offset';
const WRAPPER_CLASSES = [
	'vg-table-wrapper--fixed-columns',
	'vg-table-wrapper--fixed-columns-stack',
	'is-vg-table-fixed-scrolled-start',
	'is-vg-table-fixed-scrolled-end',
];

class _fixedColumns {
	constructor(element, wrapper, params = {}, stickyHeader = null) {
		this._element = element;
		this._wrapper = wrapper;
		this._params = params;
		this._stickyHeader = stickyHeader;
		this._headerTable = stickyHeader?.getHeaderTable?.() || element;
		this._scrollHost = stickyHeader?.getBody?.() || element.closest('.vg-table-container') || wrapper;
		this._columns = {left: [], right: []};
		this._widths = [];
		this._previousClasses = new Map();
		this._activeEdges = {left: null, right: null};
		this._resizeObserver = null;
		this._boundScroll = this._syncScrollState.bind(this);
		this._boundResize = this.refresh.bind(this);
	}

	init() {
		if (!this._wrapper || !this._scrollHost || !this._headerTable?.tHead) return this;

		WRAPPER_CLASSES.forEach((className) => {
			this._previousClasses.set(className, this._wrapper.classList.contains(className));
		});
		this._wrapper.classList.add('vg-table-wrapper--fixed-columns');
		this._wrapper.classList.toggle('vg-table-wrapper--fixed-columns-stack', this._params.mode === 'stack');
		this._element.setAttribute('data-vg-table-fixed-columns', this._params.mode);
		this._scrollHost.addEventListener('scroll', this._boundScroll, {passive: true});

		if (typeof ResizeObserver !== 'undefined') {
			this._resizeObserver = new ResizeObserver(this._boundResize);
			this._resizeObserver.observe(this._scrollHost);
			this._resizeObserver.observe(this._element);
		} else if (typeof window !== 'undefined') {
			window.addEventListener('resize', this._boundResize);
		}

		this.refresh();
		return this;
	}

	refresh() {
		this._headerTable = this._stickyHeader?.getHeaderTable?.() || this._element;
		this._scrollHost = this._stickyHeader?.getBody?.() || this._element.closest('.vg-table-container') || this._wrapper;
		const headers = this._getHeaders();
		if (!headers.length) return this;

		this._clearCells();
		this._columns = this._resolveColumns(headers);
		this._widths = headers.map((header, index) => this._measureColumn(header, index));
		this._applySide('left', this._columns.left, headers);
		this._applySide('right', [...this._columns.right].reverse(), headers);
		this._syncScrollState(true);
		return this;
	}

	getState() {
		return {
			mode: this._params.mode,
			left: [...this._columns.left],
			right: [...this._columns.right],
		};
	}

	syncScroll() {
		this._syncScrollState();
		return this;
	}

	dispose() {
		this._scrollHost?.removeEventListener('scroll', this._boundScroll);
		this._resizeObserver?.disconnect();
		if (!this._resizeObserver && typeof window !== 'undefined') {
			window.removeEventListener('resize', this._boundResize);
		}
		this._clearCells();
		WRAPPER_CLASSES.forEach((className) => {
			this._wrapper.classList.toggle(className, this._previousClasses.get(className) === true);
		});
		this._element.removeAttribute('data-vg-table-fixed-columns');
	}

	_getHeaders() {
		const rows = Array.from(this._headerTable.tHead?.rows || []);
		return rows.length ? Array.from(rows[rows.length - 1].cells) : [];
	}

	_resolveColumns(headers) {
		const result = {left: [], right: []};
		const add = (side, value) => {
			const index = this._resolveIndex(value, headers);
			if (index >= 0 && !result[side].includes(index)) result[side].push(index);
		};
		const configured = this._params.columns;

		if (configured && typeof configured === 'object' && !Array.isArray(configured)) {
			['left', 'right'].forEach((side) => {
				const values = Array.isArray(configured[side]) ? configured[side] : String(configured[side] || '').split(',');
				values.forEach((value) => add(side, value));
			});
		} else {
			String(configured || '').split(';').forEach((group) => {
				const [rawSide, rawValues = ''] = group.split(':');
				const side = String(rawSide || '').trim().toLowerCase();
				if (!['left', 'right'].includes(side)) return;
				rawValues.split(',').forEach((value) => add(side, value));
			});
		}

		headers.forEach((header, index) => {
			const side = String(header.getAttribute('data-fixed') || header.getAttribute('data-fixed-column') || '').toLowerCase();
			if (['left', 'right'].includes(side)) add(side, index);
		});

		result.left.sort((a, b) => a - b);
		result.right.sort((a, b) => a - b);
		return result;
	}

	_resolveIndex(value, headers) {
		const normalized = String(value ?? '').trim();
		if (!normalized) return -1;
		if (/^\d+$/.test(normalized)) {
			const numeric = Number.parseInt(normalized, 10);
			return numeric >= 0 && numeric < headers.length ? numeric : -1;
		}
		return headers.findIndex((header) => String(header.dataset.field || '').trim() === normalized);
	}

	_measureColumn(header, index) {
		const bodyRow = Array.from(this._element.tBodies[0]?.rows || [])
			.find((row) => !row.hasAttribute('data-vg-table-state-row'));
		const bodyCell = bodyRow?.cells[index];
		const col = this._element.querySelector(`:scope > colgroup > col:nth-child(${index + 1})`);
		const measured = bodyCell?.getBoundingClientRect?.().width
			|| header.getBoundingClientRect?.().width
			|| bodyCell?.offsetWidth
			|| header.offsetWidth;
		if (measured > 0) return measured;
		const declared = Number.parseFloat(col?.style.width || col?.getAttribute('width') || '0');
		return Number.isFinite(declared) ? declared : 0;
	}

	_applySide(side, indices, headers) {
		let offset = 0;
		indices.forEach((index) => {
			this._cellsAt(index, headers).forEach((cell) => {
				cell.setAttribute(CELL_ATTRIBUTE, side);
				cell.style.setProperty(OFFSET_PROPERTY, `${offset}px`);
			});
			offset += this._widths[index] || 0;
			if (this._params.mode === 'stack') offset += this._params.stackGap;
		});
	}

	_cellsAt(index, headers = this._getHeaders()) {
		const cells = [];
		if (headers[index]) cells.push(headers[index]);
		Array.from(this._element.tBodies || []).forEach((tbody) => {
			Array.from(tbody.rows || []).forEach((row) => {
				if (row.hasAttribute('data-vg-table-state-row')) return;
				if (row.cells[index]) cells.push(row.cells[index]);
			});
		});
		Array.from(this._element.tFoot?.rows || []).forEach((row) => {
			if (row.cells[index]) cells.push(row.cells[index]);
		});
		return cells;
	}

	_syncScrollState(force = false) {
		if (!this._scrollHost) return;
		const max = Math.max(0, this._scrollHost.scrollWidth - this._scrollHost.clientWidth);
		const position = Math.max(0, Math.min(max, this._scrollHost.scrollLeft));
		this._wrapper.classList.toggle('is-vg-table-fixed-scrolled-start', position > 0.5);
		this._wrapper.classList.toggle('is-vg-table-fixed-scrolled-end', position < max - 0.5);

		if (this._params.mode !== 'stack') {
			this._setEdge('left', this._columns.left.at(-1) ?? null, force);
			this._setEdge('right', this._columns.right[0] ?? null, force);
			return;
		}

		const leftActive = this._columns.left.filter((index) => {
			const naturalStart = this._widths.slice(0, index).reduce((sum, width) => sum + width, 0);
			const offset = this._stackOffset('left', index);
			return position >= naturalStart - offset - 0.5;
		});
		const totalWidth = this._widths.reduce((sum, width) => sum + width, 0);
		const remaining = max - position;
		const rightActive = this._columns.right.filter((index) => {
			const naturalEnd = this._widths.slice(0, index + 1).reduce((sum, width) => sum + width, 0);
			const distance = totalWidth - naturalEnd;
			return remaining >= distance - this._stackOffset('right', index) - 0.5;
		});
		this._setEdge('left', leftActive.at(-1) ?? null, force);
		this._setEdge('right', rightActive[0] ?? null, force);
	}

	_stackOffset(side, index) {
		const ordered = side === 'left' ? this._columns.left : [...this._columns.right].reverse();
		let offset = 0;
		for (const current of ordered) {
			if (current === index) return offset;
			offset += (this._widths[current] || 0) + this._params.stackGap;
		}
		return offset;
	}

	_setEdge(side, index, force = false) {
		if (!force && this._activeEdges[side] === index) return;
		this._allManagedCells().forEach((cell) => {
			if (cell.getAttribute(EDGE_ATTRIBUTE) === side) cell.removeAttribute(EDGE_ATTRIBUTE);
		});
		if (index !== null) {
			this._cellsAt(index).forEach((cell) => cell.setAttribute(EDGE_ATTRIBUTE, side));
		}
		this._activeEdges[side] = index;
	}

	_allManagedCells() {
		return Array.from(this._wrapper.querySelectorAll(`[${CELL_ATTRIBUTE}], [${EDGE_ATTRIBUTE}]`));
	}

	_clearCells() {
		this._allManagedCells().forEach((cell) => {
			cell.removeAttribute(CELL_ATTRIBUTE);
			cell.removeAttribute(EDGE_ATTRIBUTE);
			cell.style.removeProperty(OFFSET_PROPERTY);
		});
		this._activeEdges = {left: null, right: null};
	}
}

export default _fixedColumns;
