/**
 * Описание: самостоятельное изменение порядка строк VGTable.
 * Возможности: режим строки или handle, native drag-and-drop, клавиатура, localStorage, публичные методы и события.
 */
import EventHandler from "../../../utils/js/dom/event";

const EVENT_REORDER = 'rowreorder.vg.table';
const DRAGGING_ATTRIBUTE = 'data-vg-table-row-dragging';
const OVER_ATTRIBUTE = 'data-vg-table-row-drag-over';
const DECORATED_ATTRIBUTE = 'data-vg-table-row-reorder';
const STATE_ROW_SELECTOR = '[data-vg-table-state-row], [data-vg-table-skeleton-row]';
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [contenteditable="true"]';

class _rowReorder {
	constructor(table, wrapper, options = {}, hooks = {}) {
		this._table = table;
		this._wrapper = wrapper;
		this._options = options;
		this._hooks = hooks;
		this._original = new Map();
		this._rowState = new WeakMap();
		this._handleState = new WeakMap();
		this._drag = {row: null, fromIndex: -1, target: null, after: false};
		this._boundDragStart = this._handleDragStart.bind(this);
		this._boundDragOver = this._handleDragOver.bind(this);
		this._boundDrop = this._handleDrop.bind(this);
		this._boundDragEnd = this._clearDrag.bind(this);
		this._boundKeydown = this._handleKeydown.bind(this);
	}

	init() {
		Array.from(this._table.tBodies || []).forEach(body => this._original.set(body, this._rows(body)));
		this._restoreStoredOrder();
		this.refresh();
		this._table.addEventListener('dragstart', this._boundDragStart);
		this._table.addEventListener('dragover', this._boundDragOver);
		this._table.addEventListener('drop', this._boundDrop);
		this._table.addEventListener('dragend', this._boundDragEnd);
		this._table.addEventListener('keydown', this._boundKeydown);
		return this;
	}

	refresh() {
		this._rows().forEach((row, index) => this._decorate(row, index));
		return this.getState();
	}

	getState() {
		return {order: this._rows().map((row, index) => this._key(row, index)), rows: this._rows()};
	}

	move(row, target, position = 'before', emit = true) {
		const moving = this._resolveRow(row);
		const destination = this._resolveRow(target);
		if (!moving || !destination || moving === destination || moving.parentElement !== destination.parentElement) return false;
		if (this._disabled(moving) || this._disabled(destination)) return false;
		const rows = this._rows(moving.parentElement);
		const fromIndex = rows.indexOf(moving);
		const after = String(position).toLowerCase() === 'after';
		if ((!after && moving.nextElementSibling === destination) || (after && destination.nextElementSibling === moving)) return false;
		moving.parentElement.insertBefore(moving, after ? destination.nextSibling : destination);
		this._afterMove(moving, fromIndex, emit);
		return true;
	}

	reset(emit = true) {
		this._original.forEach((rows, body) => rows.forEach(row => body.append(row)));
		this._clearStorage();
		this.refresh();
		this._hooks.refreshLayout?.();
		if (emit) EventHandler.trigger(this._table, EVENT_REORDER, Object.assign({reset: true}, this.getState()));
		return this.getState();
	}

	dispose() {
		this._table.removeEventListener('dragstart', this._boundDragStart);
		this._table.removeEventListener('dragover', this._boundDragOver);
		this._table.removeEventListener('drop', this._boundDrop);
		this._table.removeEventListener('dragend', this._boundDragEnd);
		this._table.removeEventListener('keydown', this._boundKeydown);
		this._clearDrag();
		this._rows().forEach(row => this._undecorate(row));
		this._original.forEach((rows, body) => rows.forEach(row => body.append(row)));
		this._original.clear();
	}

	_decorate(row, index) {
		if (!this._rowState.has(row)) this._rowState.set(row, {
			draggable: row.getAttribute('draggable'), tabindex: row.getAttribute('tabindex'), label: row.getAttribute('aria-label'),
		});
		const disabled = this._disabled(row);
		const mode = this._mode();
		row.setAttribute(DECORATED_ATTRIBUTE, disabled ? 'disabled' : mode);
		row.draggable = !disabled && mode === 'row';
		if (!disabled && mode === 'row') {
			if (!row.hasAttribute('tabindex')) row.tabIndex = 0;
			row.setAttribute('aria-label', this._handleLabel(row, index));
		}
		this._handles(row).forEach(handle => {
			if (!this._handleState.has(handle)) this._handleState.set(handle, {
				draggable: handle.getAttribute('draggable'), tabindex: handle.getAttribute('tabindex'),
				role: handle.getAttribute('role'), label: handle.getAttribute('aria-label'), disabled: handle.getAttribute('aria-disabled'),
			});
			handle.draggable = !disabled && mode === 'handle';
			if (!disabled && !handle.hasAttribute('tabindex')) handle.tabIndex = 0;
			if (!handle.hasAttribute('role')) handle.setAttribute('role', 'button');
			handle.setAttribute('aria-label', this._handleLabel(row, index));
			handle.toggleAttribute('aria-disabled', disabled);
		});
	}

	_undecorate(row) {
		row.removeAttribute(DECORATED_ATTRIBUTE);
		row.removeAttribute(DRAGGING_ATTRIBUTE);
		row.removeAttribute(OVER_ATTRIBUTE);
		const rowState = this._rowState.get(row) || {};
		this._restoreAttribute(row, 'draggable', rowState.draggable);
		this._restoreAttribute(row, 'tabindex', rowState.tabindex);
		this._restoreAttribute(row, 'aria-label', rowState.label);
		this._handles(row).forEach(handle => {
			const state = this._handleState.get(handle) || {};
			this._restoreAttribute(handle, 'draggable', state.draggable);
			this._restoreAttribute(handle, 'tabindex', state.tabindex);
			this._restoreAttribute(handle, 'role', state.role);
			this._restoreAttribute(handle, 'aria-label', state.label);
			this._restoreAttribute(handle, 'aria-disabled', state.disabled);
		});
	}

	_restoreAttribute(element, name, value) {
		if (value === null || value === undefined) element.removeAttribute(name);
		else element.setAttribute(name, value);
	}

	_handleDragStart(event) {
		const row = event.target.closest?.(`tr[${DECORATED_ATTRIBUTE}]`);
		if (!row || this._disabled(row)) return;
		if (this._mode() === 'handle' && !event.target.closest?.(this._handleSelector())) {
			event.preventDefault();
			return;
		}
		if (this._mode() === 'row' && event.target.closest?.(INTERACTIVE_SELECTOR)) {
			event.preventDefault();
			return;
		}
		this._drag = {row, fromIndex: this._rows(row.parentElement).indexOf(row), target: null, after: false};
		row.setAttribute(DRAGGING_ATTRIBUTE, '');
		this._wrapper?.classList.add('vg-table-wrapper--row-dragging');
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			try { event.dataTransfer.setData('text/plain', this._key(row, this._drag.fromIndex)); } catch (error) { /* noop */ }
		}
	}

	_handleDragOver(event) {
		if (!this._drag.row) return;
		const target = event.target.closest?.(`tr[${DECORATED_ATTRIBUTE}]`);
		if (!target || target === this._drag.row || target.parentElement !== this._drag.row.parentElement || this._disabled(target)) return;
		event.preventDefault();
		const rect = target.getBoundingClientRect();
		const after = event.clientY > rect.top + rect.height / 2;
		this._rows().forEach(row => row.removeAttribute(OVER_ATTRIBUTE));
		target.setAttribute(OVER_ATTRIBUTE, after ? 'after' : 'before');
		this._drag.target = target;
		this._drag.after = after;
	}

	_handleDrop(event) {
		if (!this._drag.row || !this._drag.target) return this._clearDrag();
		event.preventDefault();
		const {row, target, after, fromIndex} = this._drag;
		row.parentElement.insertBefore(row, after ? target.nextSibling : target);
		this._clearDrag();
		this._afterMove(row, fromIndex, true);
	}

	_handleKeydown(event) {
		if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
		const handle = event.target.closest?.(this._handleSelector());
		const row = handle?.closest?.(`tr[${DECORATED_ATTRIBUTE}]`)
			|| (this._mode() === 'row' ? event.target.closest?.(`tr[${DECORATED_ATTRIBUTE}]`) : null);
		if (!row || this._disabled(row)) return;
		if (!handle && event.target !== row && event.target.closest?.(INTERACTIVE_SELECTOR)) return;
		const rows = this._rows(row.parentElement).filter(item => !this._disabled(item));
		const index = rows.indexOf(row);
		const target = event.key === 'Home' ? rows[0] : event.key === 'End' ? rows.at(-1) : rows[index + (event.key === 'ArrowUp' ? -1 : 1)];
		if (!target || target === row) return;
		event.preventDefault();
		this.move(row, target, event.key === 'ArrowDown' || event.key === 'End' ? 'after' : 'before', true);
		(handle || row).focus?.();
	}

	_afterMove(row, fromIndex, emit) {
		this.refresh();
		this._storeOrder();
		this._hooks.refreshLayout?.();
		if (!emit) return;
		const rows = this._rows(row.parentElement);
		const toIndex = rows.indexOf(row);
		EventHandler.trigger(this._table, EVENT_REORDER, {
			row, key: this._key(row, toIndex), fromIndex, toIndex,
			beforeRow: row.previousElementSibling || null, afterRow: row.nextElementSibling || null,
			order: rows.map((item, index) => this._key(item, index)),
		});
	}

	_clearDrag() {
		this._rows().forEach(row => {
			row.removeAttribute(DRAGGING_ATTRIBUTE);
			row.removeAttribute(OVER_ATTRIBUTE);
		});
		this._wrapper?.classList.remove('vg-table-wrapper--row-dragging');
		this._drag = {row: null, fromIndex: -1, target: null, after: false};
	}

	_rows(body = null) {
		const bodies = body ? [body] : Array.from(this._table.tBodies || []);
		return bodies.flatMap(item => Array.from(item.rows || [])).filter(row => !row.matches(STATE_ROW_SELECTOR));
	}

	_resolveRow(value) {
		if (value?.tagName === 'TR' && this._table.contains(value)) return value;
		const rows = this._rows();
		if (typeof value === 'number') return rows[Number.parseInt(value, 10)] || null;
		const key = String(value || '').trim();
		return rows.find((row, index) => this._key(row, index) === key) || null;
	}

	_key(row, index) {
		return String(row.getAttribute(this._options.keyAttr || 'data-row-key') ?? row.getAttribute('data-id') ?? index);
	}

	_disabled(row) { return row.hasAttribute('data-row-reorder-disabled'); }
	_mode() { return String(this._options.mode || 'handle').toLowerCase() === 'row' ? 'row' : 'handle'; }
	_handleSelector() { return String(this._options.handleSelector || '[data-row-reorder-handle]').trim() || '[data-row-reorder-handle]'; }
	_handles(row) { return Array.from(row.querySelectorAll(this._handleSelector())); }
	_handleLabel(row, index) {
		const template = String(this._options.labels?.handle || 'Изменить позицию строки {row}');
		return template.replace('{row}', this._key(row, index));
	}

	_storageKey() {
		if (this._options.persist !== true || typeof window === 'undefined') return '';
		return String(this._options.storageKey || '').trim() || (this._table.id ? `vg-table:${this._table.id}:row-order` : '');
	}
	_storeOrder() {
		const key = this._storageKey();
		if (key) try { window.localStorage.setItem(key, JSON.stringify(this.getState().order)); } catch (error) { /* noop */ }
	}
	_restoreStoredOrder() {
		const key = this._storageKey();
		if (!key) return;
		let order = [];
		try { order = JSON.parse(window.localStorage.getItem(key)) || []; } catch (error) { return; }
		if (!Array.isArray(order)) return;
		order.forEach((rowKey, targetIndex) => {
			const row = this._resolveRow(String(rowKey));
			const target = this._rows(row?.parentElement)[targetIndex];
			if (row && target && row !== target && !this._disabled(row) && !this._disabled(target)) target.before(row);
		});
	}
	_clearStorage() {
		const key = this._storageKey();
		if (key) try { window.localStorage.removeItem(key); } catch (error) { /* noop */ }
	}
}

export default _rowReorder;
