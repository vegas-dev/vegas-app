/**
 * Описание: единый менеджер ширины, порядка и видимости колонок VGTable.
 * Возможности: pointer-resize, native drag-and-drop, внешние checkbox, localStorage, Fixed Header/Columns и публичные события.
 */
import EventHandler from "../../../utils/js/dom/event";


const RESIZE_HANDLE_ATTRIBUTE = 'data-vg-table-column-resize-handle';
const COLUMN_CONTROL_SELECTOR = '[data-vg-table-column], [data-column-field]';
const RESET_SELECTOR = '[data-vg-table-columns-reset]';
const EVENT_RESIZE = 'columnresize.vg.table';
const EVENT_REORDER = 'columnreorder.vg.table';
const EVENT_VISIBILITY = 'columnvisibilitychange.vg.table';

class _columns {
	constructor(table, wrapper, options = {}, hooks = {}) {
		this._table = table;
		this._wrapper = wrapper;
		this._options = options;
		this._hooks = hooks;
		this._headerTable = table;
		this._controls = null;
		this._originalOrder = [];
		this._originalCellStyles = new Map();
		this._originalVisibility = new Map();
		this._widths = new Map();
		this._hidden = new Set();
		this._drag = {active: false, from: -1};
		this._resize = {active: false, index: -1, field: '', startX: 0, startWidth: 0};
		this._suppressClick = false;
		this._boundPointerDown = this._handlePointerDown.bind(this);
		this._boundPointerMove = this._handlePointerMove.bind(this);
		this._boundPointerUp = this._handlePointerUp.bind(this);
		this._boundKeydown = this._handleKeydown.bind(this);
		this._boundDragStart = this._handleDragStart.bind(this);
		this._boundDragOver = this._handleDragOver.bind(this);
		this._boundDrop = this._handleDrop.bind(this);
		this._boundDragEnd = this._handleDragEnd.bind(this);
		this._boundClickCapture = this._handleClickCapture.bind(this);
		this._boundControlChange = this._handleControlChange.bind(this);
		this._boundControlClick = this._handleControlClick.bind(this);
	}

	init() {
		this._headerTable = this._hooks.getHeaderTable?.() || this._table;
		this._originalOrder = this.getOrder();
		this._rememberOriginalState();
		this._controls = this._resolveControls();

		if (this._options.reorder?.enabled === true) this._restoreOrder();
		if (this._options.resize?.enabled === true) this._restoreWidths();
		if (this._options.visibility?.enabled === true) this._restoreVisibility();
		this._decorateHeaders();
		this._bind();
		this.refresh();
		return this;
	}

	refresh() {
		this._headerTable = this._hooks.getHeaderTable?.() || this._table;
		this._decorateHeaders();
		this._widths.forEach((width, field) => this._applyWidth(field, width));
		this._hidden.forEach((field) => this._applyVisibility(field, false));
		this._syncControls();
		return this.getState();
	}

	getState() {
		const order = this.getOrder();
		return {
			order,
			widths: Object.fromEntries(this._widths),
			visible: order.filter((field) => !this._hidden.has(field)),
			hidden: order.filter((field) => this._hidden.has(field)),
		};
	}

	getOrder() {
		return this._getHeaders().map((header, index) => this._field(header, index));
	}

	setWidth(column, width, emit = true) {
		if (this._options.resize?.enabled !== true) return false;
		const index = this._resolveIndex(column);
		const field = this._field(this._getHeaders()[index], index);
		if (index < 0 || !field || this._hidden.has(field)) return false;
		const next = this._clampWidth(width);
		this._widths.set(field, next);
		this._applyWidth(field, next);
		this._storeWidths();
		this._hooks.refreshLayout?.(false);
		if (emit) EventHandler.trigger(this._table, EVENT_RESIZE, {field, columnIndex: index, width: next, widths: Object.fromEntries(this._widths)});
		return true;
	}

	move(column, target, emit = true) {
		if (this._options.reorder?.enabled !== true) return false;
		const from = this._resolveIndex(column);
		const to = this._resolveIndex(target);
		const headers = this._getHeaders();
		if (from < 0 || to < 0 || from === to || this._isLocked(headers[from], from) || this._isLocked(headers[to], to)) return false;
		const field = this._field(headers[from], from);
		this._moveColumn(from, to);
		this._storeOrder();
		this._decorateHeaders();
		this._syncControls();
		this._hooks.refreshLayout?.(true);
		if (emit) EventHandler.trigger(this._table, EVENT_REORDER, {field, fromIndex: from, toIndex: to, order: this.getOrder()});
		return true;
	}

	setVisible(column, visible = true, emit = true) {
		if (this._options.visibility?.enabled !== true) return false;
		const index = this._resolveIndex(column);
		const header = this._getHeaders()[index];
		const field = this._field(header, index);
		if (index < 0 || !field || this._isLocked(header, index)) return false;
		const nextVisible = visible !== false;
		if (!nextVisible && !this._hidden.has(field) && this.getState().visible.length <= this._minVisible()) return false;
		if (nextVisible) this._hidden.delete(field);
		else this._hidden.add(field);
		this._applyVisibility(field, nextVisible);
		this._storeVisibility();
		this._syncControls();
		this._hooks.refreshLayout?.(true);
		if (emit) EventHandler.trigger(this._table, EVENT_VISIBILITY, Object.assign({field, visible: nextVisible}, this.getState()));
		return true;
	}

	reset(emit = true) {
		this._restoreOriginalOrder();
		this._restoreOriginalStyles();
		this._widths.clear();
		this._hidden.clear();
		this._clearStorage();
		this._decorateHeaders();
		this._syncControls();
		this._hooks.refreshLayout?.(true);
		if (emit) {
			const state = Object.assign({reset: true}, this.getState());
			EventHandler.trigger(this._table, EVENT_RESIZE, state);
			EventHandler.trigger(this._table, EVENT_REORDER, state);
			EventHandler.trigger(this._table, EVENT_VISIBILITY, state);
		}
		return this.getState();
	}

	dispose() {
		this._unbind();
		this._restoreOriginalOrder();
		this._restoreOriginalStyles();
		this._getHeaders().forEach((header) => {
			header.removeAttribute('data-vg-table-column-reorder');
			header.removeAttribute('data-vg-table-column-dragging');
			header.removeAttribute('data-vg-table-column-drag-over');
			header.removeAttribute('draggable');
			header.querySelector(`[${RESIZE_HANDLE_ATTRIBUTE}]`)?.remove();
		});
		this._wrapper?.classList.remove('vg-table-wrapper--column-resizing', 'vg-table-wrapper--column-dragging');
	}

	_bind() {
		this._headerTable.addEventListener('pointerdown', this._boundPointerDown);
		this._headerTable.addEventListener('keydown', this._boundKeydown);
		this._headerTable.addEventListener('dragstart', this._boundDragStart);
		this._headerTable.addEventListener('dragover', this._boundDragOver);
		this._headerTable.addEventListener('drop', this._boundDrop);
		this._headerTable.addEventListener('dragend', this._boundDragEnd);
		this._headerTable.addEventListener('click', this._boundClickCapture, true);
		document.addEventListener('pointermove', this._boundPointerMove);
		document.addEventListener('pointerup', this._boundPointerUp);
		this._controls?.addEventListener('change', this._boundControlChange);
		this._controls?.addEventListener('click', this._boundControlClick);
	}

	_unbind() {
		this._headerTable?.removeEventListener('pointerdown', this._boundPointerDown);
		this._headerTable?.removeEventListener('keydown', this._boundKeydown);
		this._headerTable?.removeEventListener('dragstart', this._boundDragStart);
		this._headerTable?.removeEventListener('dragover', this._boundDragOver);
		this._headerTable?.removeEventListener('drop', this._boundDrop);
		this._headerTable?.removeEventListener('dragend', this._boundDragEnd);
		this._headerTable?.removeEventListener('click', this._boundClickCapture, true);
		document.removeEventListener('pointermove', this._boundPointerMove);
		document.removeEventListener('pointerup', this._boundPointerUp);
		this._controls?.removeEventListener('change', this._boundControlChange);
		this._controls?.removeEventListener('click', this._boundControlClick);
	}

	_decorateHeaders() {
		this._getHeaders().forEach((header, index) => {
			const field = this._field(header, index);
			const locked = this._isLocked(header, index);
			if (this._options.resize?.enabled === true && !header.querySelector(`[${RESIZE_HANDLE_ATTRIBUTE}]`)) {
				const handle = header.ownerDocument.createElement('span');
				handle.className = 'vg-table-column-resize-handle';
				handle.setAttribute(RESIZE_HANDLE_ATTRIBUTE, '');
				handle.setAttribute('role', 'separator');
				handle.setAttribute('aria-orientation', 'vertical');
				handle.setAttribute('aria-label', this._resizeLabel(header));
				handle.setAttribute('aria-valuemin', String(this._options.resize.minWidth));
				handle.setAttribute('aria-valuemax', String(this._options.resize.maxWidth));
				handle.setAttribute('aria-valuenow', String(Math.round(header.getBoundingClientRect().width || header.offsetWidth || this._options.resize.minWidth)));
				handle.tabIndex = 0;
				header.append(handle);
			}
			const handle = header.querySelector(`[${RESIZE_HANDLE_ATTRIBUTE}]`);
			if (handle) handle.setAttribute('aria-label', this._resizeLabel(header));
			if (this._options.reorder?.enabled === true) {
				header.setAttribute('data-vg-table-column-reorder', locked ? 'locked' : 'enabled');
				header.setAttribute('draggable', String(!locked));
			}
			if (field && this._hidden.has(field)) this._applyVisibility(field, false);
		});
	}

	_handlePointerDown(event) {
		const handle = event.target.closest?.(`[${RESIZE_HANDLE_ATTRIBUTE}]`);
		if (!handle || this._options.resize?.enabled !== true) return;
		const header = handle.closest('th');
		const index = this._getHeaders().indexOf(header);
		if (index < 0) return;
		event.preventDefault();
		event.stopPropagation();
		this._resize = {
			active: true,
			index,
			field: this._field(header, index),
			startX: event.clientX,
			startWidth: header.getBoundingClientRect().width || header.offsetWidth || this._options.resize.minWidth,
		};
		this._wrapper?.classList.add('vg-table-wrapper--column-resizing');
	}

	_handleKeydown(event) {
		const handle = event.target.closest?.(`[${RESIZE_HANDLE_ATTRIBUTE}]`);
		if (!handle || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		const header = handle.closest('th');
		const index = this._getHeaders().indexOf(header);
		if (index < 0) return;
		event.preventDefault();
		event.stopPropagation();
		const field = this._field(header, index);
		const current = this._widths.get(field) || header.getBoundingClientRect().width || header.offsetWidth || this._options.resize.minWidth;
		const step = event.shiftKey ? 25 : 10;
		const width = event.key === 'Home'
			? this._options.resize.minWidth
			: event.key === 'End'
				? this._options.resize.maxWidth
				: current + (event.key === 'ArrowRight' ? step : -step);
		this.setWidth(field, width, true);
	}

	_handlePointerMove(event) {
		if (!this._resize.active) return;
		event.preventDefault();
		const width = this._clampWidth(this._resize.startWidth + event.clientX - this._resize.startX);
		this._widths.set(this._resize.field, width);
		this._applyWidth(this._resize.field, width);
		this._hooks.refreshLayout?.(false);
	}

	_handlePointerUp() {
		if (!this._resize.active) return;
		const {field} = this._resize;
		const width = this._widths.get(field);
		this._resize = {active: false, index: -1, field: '', startX: 0, startWidth: 0};
		this._wrapper?.classList.remove('vg-table-wrapper--column-resizing');
		if (width) {
			this._storeWidths();
			EventHandler.trigger(this._table, EVENT_RESIZE, {field, columnIndex: this._resolveIndex(field), width, widths: Object.fromEntries(this._widths)});
		}
	}

	_handleDragStart(event) {
		const header = event.target.closest?.('th[data-vg-table-column-reorder="enabled"]');
		if (!header || event.target.closest?.(`[${RESIZE_HANDLE_ATTRIBUTE}]`)) return;
		const from = this._getHeaders().indexOf(header);
		if (from < 0) return;
		this._drag = {active: true, from};
		header.setAttribute('data-vg-table-column-dragging', '');
		this._wrapper?.classList.add('vg-table-wrapper--column-dragging');
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			try { event.dataTransfer.setData('text/plain', String(from)); } catch (error) { /* noop */ }
		}
	}

	_handleDragOver(event) {
		if (!this._drag.active) return;
		const header = event.target.closest?.('th[data-vg-table-column-reorder="enabled"]');
		if (!header) return;
		event.preventDefault();
		this._getHeaders().forEach((item) => item.toggleAttribute('data-vg-table-column-drag-over', item === header));
	}

	_handleDrop(event) {
		if (!this._drag.active) return;
		const header = event.target.closest?.('th[data-vg-table-column-reorder="enabled"]');
		if (!header) return;
		event.preventDefault();
		const to = this._getHeaders().indexOf(header);
		const from = this._drag.from;
		this._finishDrag();
		this.move(from, to, true);
	}

	_handleDragEnd() {
		if (!this._drag.active) return;
		this._finishDrag();
	}

	_finishDrag() {
		this._getHeaders().forEach((header) => {
			header.removeAttribute('data-vg-table-column-dragging');
			header.removeAttribute('data-vg-table-column-drag-over');
		});
		this._drag = {active: false, from: -1};
		this._suppressClick = true;
		this._wrapper?.classList.remove('vg-table-wrapper--column-dragging');
		setTimeout(() => { this._suppressClick = false; }, 0);
	}

	_handleClickCapture(event) {
		if (this._suppressClick || event.target.closest?.(`[${RESIZE_HANDLE_ATTRIBUTE}]`)) {
			event.preventDefault();
			event.stopPropagation();
			this._suppressClick = false;
		}
	}

	_handleControlChange(event) {
		const control = event.target.closest?.(COLUMN_CONTROL_SELECTOR);
		if (!control || !this._controls.contains(control)) return;
		const field = control.getAttribute('data-vg-table-column') || control.getAttribute('data-column-field');
		if (!this.setVisible(field, control.checked !== false)) this._syncControls();
	}

	_handleControlClick(event) {
		if (!event.target.closest?.(RESET_SELECTOR)) return;
		event.preventDefault();
		this.reset(true);
	}

	_applyWidth(column, width) {
		const index = this._resolveIndex(column);
		if (index < 0) return;
		this._cellsAt(index).forEach((cell) => {
			this._rememberCellStyle(cell);
			cell.style.width = `${width}px`;
			cell.style.minWidth = `${width}px`;
			cell.style.maxWidth = `${width}px`;
		});
		this._colsAt(index).forEach((col) => {
			this._rememberCellStyle(col);
			col.style.width = `${width}px`;
			col.style.minWidth = `${width}px`;
			col.style.maxWidth = `${width}px`;
		});
		this._getHeaders()[index]?.querySelector(`[${RESIZE_HANDLE_ATTRIBUTE}]`)?.setAttribute('aria-valuenow', String(width));
	}

	_applyVisibility(column, visible) {
		const index = this._resolveIndex(column);
		if (index < 0) return;
		[...this._cellsAt(index), ...this._colsAt(index)].forEach((cell) => {
			if (!this._originalVisibility.has(cell)) this._originalVisibility.set(cell, cell.hidden);
			cell.hidden = !visible;
			cell.toggleAttribute('data-vg-table-column-hidden', !visible);
		});
	}

	_moveColumn(from, to) {
		const rows = new Set([
			...Array.from(this._headerTable.rows || []),
			...Array.from(this._table.tBodies || []).flatMap((body) => Array.from(body.rows || [])),
			...Array.from(this._table.tFoot?.rows || []),
		]);
		rows.forEach((row) => this._moveNode(Array.from(row.cells || []), from, to));
		this._colgroups().forEach((group) => this._moveNode(Array.from(group.children || []), from, to));
	}

	_moveNode(nodes, from, to) {
		const moving = nodes[from];
		const target = nodes[to];
		if (!moving || !target || moving === target) return;
		if (from < to) target.after(moving);
		else target.before(moving);
	}

	_cellsAt(index) {
		const cells = [];
		const rows = new Set([
			...Array.from(this._headerTable.rows || []),
			...Array.from(this._table.tBodies || []).flatMap((body) => Array.from(body.rows || [])),
			...Array.from(this._table.tFoot?.rows || []),
		]);
		rows.forEach((row) => { if (!row.hasAttribute('data-vg-table-state-row') && row.cells[index]) cells.push(row.cells[index]); });
		return cells;
	}

	_colsAt(index) {
		return this._colgroups().map((group) => group.children[index]).filter(Boolean);
	}

	_colgroups() {
		return Array.from(new Set([
			...Array.from(this._table.querySelectorAll(':scope > colgroup')),
			...Array.from(this._headerTable.querySelectorAll(':scope > colgroup')),
		]));
	}

	_getHeaders() {
		const rows = Array.from(this._headerTable.tHead?.rows || []);
		return rows.length ? Array.from(rows.at(-1).cells || []) : [];
	}

	_field(header, index) {
		return String(header?.getAttribute('data-field') || index).trim();
	}

	_resolveIndex(column) {
		const headers = this._getHeaders();
		if (typeof column === 'number' || /^\d+$/.test(String(column ?? '').trim())) {
			const index = Number.parseInt(column, 10);
			return index >= 0 && index < headers.length ? index : -1;
		}
		const field = String(column || '').trim();
		return headers.findIndex((header, index) => this._field(header, index) === field);
	}

	_isLocked(header, index) {
		return this._hooks.isFixed?.(this._field(header, index)) === true;
	}

	_minVisible() {
		return Math.max(1, Number.parseInt(this._options.visibility?.minVisible, 10) || 1);
	}

	_clampWidth(width) {
		const min = Math.max(40, Number.parseInt(this._options.resize?.minWidth, 10) || 80);
		const max = Math.max(min, Number.parseInt(this._options.resize?.maxWidth, 10) || 600);
		return Math.min(max, Math.max(min, Math.round(Number(width) || min)));
	}

	_resizeLabel(header) {
		const column = String(header?.textContent || '').trim();
		return String(this._options.resize?.label || 'Изменить ширину колонки {column}').replace('{column}', column);
	}

	_resolveControls() {
		const controls = this._options.visibility?.controls;
		if (typeof Element !== 'undefined' && controls instanceof Element) return controls;
		return controls ? this._table.ownerDocument.querySelector(String(controls)) : null;
	}

	_syncControls() {
		this._controls?.querySelectorAll(COLUMN_CONTROL_SELECTOR).forEach((control) => {
			const field = control.getAttribute('data-vg-table-column') || control.getAttribute('data-column-field');
			const index = this._resolveIndex(field);
			control.checked = index >= 0 && !this._hidden.has(field);
			control.disabled = index < 0 || this._isLocked(this._getHeaders()[index], index);
		});
	}

	_rememberOriginalState() {
		this._getHeaders().forEach((header, index) => {
			this._cellsAt(index).forEach((cell) => {
				this._rememberCellStyle(cell);
				if (!this._originalVisibility.has(cell)) this._originalVisibility.set(cell, cell.hidden);
			});
		});
		this._colgroups().forEach((group) => Array.from(group.children).forEach((col) => this._rememberCellStyle(col)));
	}

	_rememberCellStyle(cell) {
		if (this._originalCellStyles.has(cell)) return;
		this._originalCellStyles.set(cell, {
			width: cell.style.width,
			minWidth: cell.style.minWidth,
			maxWidth: cell.style.maxWidth,
		});
	}

	_restoreOriginalStyles() {
		this._originalCellStyles.forEach((style, cell) => {
			cell.style.width = style.width;
			cell.style.minWidth = style.minWidth;
			cell.style.maxWidth = style.maxWidth;
		});
		this._originalVisibility.forEach((hidden, cell) => {
			cell.hidden = hidden;
			cell.removeAttribute('data-vg-table-column-hidden');
		});
	}

	_restoreOriginalOrder() {
		this._originalOrder.forEach((field, target) => {
			const current = this._resolveIndex(field);
			if (current >= 0 && current !== target) this._moveColumn(current, target);
		});
	}

	_storageKey(group, suffix) {
		const options = this._options[group] || {};
		if (options.persist !== true || typeof window === 'undefined') return '';
		const explicit = String(options.storageKey || '').trim();
		if (explicit) return explicit;
		return this._table.id ? `vg-table:${this._table.id}:${suffix}` : '';
	}

	_readStorage(group, suffix, fallback) {
		const key = this._storageKey(group, suffix);
		if (!key) return fallback;
		try { return JSON.parse(window.localStorage.getItem(key)) ?? fallback; } catch (error) { return fallback; }
	}

	_writeStorage(group, suffix, value) {
		const key = this._storageKey(group, suffix);
		if (!key) return;
		try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* noop */ }
	}

	_restoreOrder() {
		const order = this._readStorage('reorder', 'column-order', []);
		if (!Array.isArray(order)) return;
		order.forEach((field, target) => {
			const current = this._resolveIndex(field);
			if (current >= 0 && current !== target
				&& !this._isLocked(this._getHeaders()[current], current)
				&& !this._isLocked(this._getHeaders()[target], target)) this._moveColumn(current, target);
		});
	}

	_storeOrder() { this._writeStorage('reorder', 'column-order', this.getOrder()); }

	_restoreWidths() {
		const widths = this._readStorage('resize', 'column-widths', {});
		if (!widths || typeof widths !== 'object' || Array.isArray(widths)) return;
		Object.entries(widths).forEach(([field, width]) => {
			if (this._resolveIndex(field) >= 0) this._widths.set(field, this._clampWidth(width));
		});
	}

	_storeWidths() { this._writeStorage('resize', 'column-widths', Object.fromEntries(this._widths)); }

	_restoreVisibility() {
		const hidden = this._readStorage('visibility', 'hidden-columns', []);
		if (!Array.isArray(hidden)) return;
		hidden.forEach((field) => {
			const index = this._resolveIndex(field);
			const visibleCount = this._getHeaders().length - this._hidden.size;
			if (visibleCount > this._minVisible() && index >= 0 && !this._isLocked(this._getHeaders()[index], index)) this._hidden.add(field);
		});
	}

	_storeVisibility() { this._writeStorage('visibility', 'hidden-columns', Array.from(this._hidden)); }

	_clearStorage() {
		[['reorder', 'column-order'], ['resize', 'column-widths'], ['visibility', 'hidden-columns']].forEach(([group, suffix]) => {
			const key = this._storageKey(group, suffix);
			if (key) try { window.localStorage.removeItem(key); } catch (error) { /* noop */ }
		});
	}
}

export default _columns;
