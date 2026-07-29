import EventHandler from "../../../utils/js/dom/event";
import Data from "../../../utils/js/dom/data";

const TABLE_SELECTOR = '[data-vg-table]';
const ROW_SELECTOR = 'tbody tr:not([data-group-header="1"])';
const ROW_CHECK_SELECTOR = '[data-row-select]';
const CHECK_ALL_SELECTOR = '[data-select-all]';
const DEFAULT_ROW_REORDER_HANDLE_SELECTOR = '[data-row-reorder-handle]';
const ROW_REORDER_IGNORE_SELECTOR = 'input, button, a, select, textarea, [contenteditable="true"]';
const TABLE_DATA_KEY = 'vg.dynamicTable';
const ACTION_CALLBACK_MAP = {
	rowcheck: 'onRowCheck',
	checkall: 'onCheckAll',
	rowreorder: 'onRowReorder',
};

class Editable {
	static _getInitStore() {
		if (!this.__initStore) {
			this.__initStore = new WeakSet();
		}
		return this.__initStore;
	}

	static _getDragStore() {
		if (!this.__dragStore) {
			this.__dragStore = new WeakMap();
		}
		return this.__dragStore;
	}

	static initAll() {
		const tables = Array.from(document.querySelectorAll(TABLE_SELECTOR));
		tables.forEach((table) => {
			if (!this._isEditableEnabled(table)) {
				return;
			}

			const initStore = this._getInitStore();
			if (initStore.has(table)) {
				this._syncSelectAll(table);
				this._syncRowReorder(table);
				return;
			}

			initStore.add(table);
			this._bind(table);
			this._syncSelectAll(table);
			this._syncRowReorder(table);
		});
	}

	static _bind(table) {
		table.addEventListener('change', (event) => {
			const checkAll = event.target.closest(CHECK_ALL_SELECTOR);
			if (checkAll) {
				this._toggleAll(table, Boolean(checkAll.checked));
				this._syncSelectAll(table);
				this._emit(table, 'checkall', this._getSelectionPayload(table, {
					checked: Boolean(checkAll.checked),
				}));
				return;
			}

			const rowCheckbox = event.target.closest(ROW_CHECK_SELECTOR);
			if (!rowCheckbox) {
				return;
			}

			this._syncSelectAll(table);
			const row = rowCheckbox.closest('tr');
			this._emit(table, 'rowcheck', this._getSelectionPayload(table, {
				checked: Boolean(rowCheckbox.checked),
				row: this._getRowPayload(table, row),
			}));
		});

		table.addEventListener('dragstart', (event) => {
			this._handleRowDragStart(table, event);
		});
		table.addEventListener('dragover', (event) => {
			this._handleRowDragOver(table, event);
		});
		table.addEventListener('drop', (event) => {
			this._handleRowDrop(table, event);
		});
		table.addEventListener('dragend', () => {
			this._clearRowDragState(table);
		});

		const eventPrefix = this._getEventPrefix(table);
		table.addEventListener(`${eventPrefix}:dataloaded`, () => {
			this._syncSelectAll(table);
			this._syncRowReorder(table);
		});
	}

	static _toggleAll(table, checked) {
		Array.from(table.querySelectorAll(`${ROW_SELECTOR} ${ROW_CHECK_SELECTOR}`)).forEach((node) => {
			node.checked = checked;
		});
	}

	static _syncSelectAll(table) {
		const rowCheckboxes = Array.from(table.querySelectorAll(`${ROW_SELECTOR} ${ROW_CHECK_SELECTOR}`));
		const total = rowCheckboxes.length;
		const selected = rowCheckboxes.filter((node) => node.checked).length;
		const checkAll = table.querySelector(CHECK_ALL_SELECTOR);
		if (!checkAll) {
			return;
		}
		checkAll.checked = total > 0 && selected === total;
		checkAll.indeterminate = selected > 0 && selected < total;
	}

	static _getSelectionPayload(table, extra = {}) {
		const rowCheckboxes = Array.from(table.querySelectorAll(`${ROW_SELECTOR} ${ROW_CHECK_SELECTOR}`));
		const total = rowCheckboxes.length;
		const selected = rowCheckboxes.filter((node) => node.checked).length;
		return Object.assign({total, selected}, extra);
	}

	static _isEditableEnabled(table) {
		const editableOptions = this._getEditableOptions(this._getTableInstance(table));
		if (editableOptions.enable !== undefined) {
			return Boolean(editableOptions.enable);
		}
		const attrEnabled = table.getAttribute('data-editable-enable');
		if (attrEnabled === null) {
			return false;
		}
		return this._parseBool(attrEnabled, false);
	}

	static _isRowReorderEnabled(table) {
		const editableOptions = this._getEditableOptions(this._getTableInstance(table));
		const attrEnabled = table.getAttribute('data-row-reorder-enable');
		if (attrEnabled !== null) {
			return this._parseBool(attrEnabled, false);
		}
		if (editableOptions.rowReorder !== undefined) {
			return Boolean(editableOptions.rowReorder);
		}
		return true;
	}

	static _getRowReorderMode(table) {
		const editableOptions = this._getEditableOptions(this._getTableInstance(table));
		const attrMode = table.getAttribute('data-row-reorder-mode');
		const mode = String(attrMode !== null ? attrMode : editableOptions.rowReorderMode || 'row').trim().toLowerCase();
		return mode === 'handle' ? 'handle' : 'row';
	}

	static _getRowReorderHandleSelector(table) {
		const editableOptions = this._getEditableOptions(this._getTableInstance(table));
		const attrSelector = String(table.getAttribute('data-row-reorder-handle-selector') || '').trim();
		const optionSelector = String(editableOptions.rowReorderHandleSelector || '').trim();
		return attrSelector || optionSelector || DEFAULT_ROW_REORDER_HANDLE_SELECTOR;
	}

	static _syncRowReorder(table) {
		const enabled = this._isRowReorderEnabled(table);
		const mode = this._getRowReorderMode(table);
		const handleSelector = this._getRowReorderHandleSelector(table);
		const rows = Array.from(table.querySelectorAll(ROW_SELECTOR));

		rows.forEach((row) => {
			const handles = Array.from(row.querySelectorAll(handleSelector));
			if (!enabled) {
				row.removeAttribute('data-row-reorder');
				row.removeAttribute('data-row-reorder-mode');
				row.setAttribute('draggable', 'false');
				handles.forEach((handle) => handle.setAttribute('draggable', 'false'));
				return;
			}

			row.setAttribute('data-row-reorder', '1');
			row.setAttribute('data-row-reorder-mode', mode);
			row.setAttribute('draggable', mode === 'row' ? 'true' : 'false');
			handles.forEach((handle) => handle.setAttribute('draggable', mode === 'handle' ? 'true' : 'false'));
		});

		if (!enabled) {
			this._clearRowDragState(table);
		}
	}

	static _getRowDragState(table) {
		const store = this._getDragStore();
		if (!store.has(table)) {
			store.set(table, {
				fromRow: null,
				fromIndex: -1,
				overRow: null,
				overAfter: false,
			});
		}
		return store.get(table);
	}

	static _clearRowDragState(table) {
		const state = this._getRowDragState(table);
		Array.from(table.querySelectorAll(`${ROW_SELECTOR}[data-row-dragging], ${ROW_SELECTOR}[data-row-drag-over]`)).forEach((row) => {
			row.removeAttribute('data-row-dragging');
			row.removeAttribute('data-row-drag-over');
		});
		state.fromRow = null;
		state.fromIndex = -1;
		state.overRow = null;
		state.overAfter = false;
	}

	static _handleRowDragStart(table, event) {
		if (!this._isRowReorderEnabled(table)) {
			return;
		}

		const row = event.target && event.target.closest ? event.target.closest(`${ROW_SELECTOR}[data-row-reorder="1"]`) : null;
		if (!row || !table.contains(row)) {
			return;
		}

		const mode = this._getRowReorderMode(table);
		if (mode === 'handle') {
			const handleSelector = this._getRowReorderHandleSelector(table);
			const isFromHandle = Boolean(event.target && event.target.closest && event.target.closest(handleSelector));
			if (!isFromHandle) {
				event.preventDefault();
				return;
			}
		} else if (event.target && event.target.closest && event.target.closest(ROW_REORDER_IGNORE_SELECTOR)) {
			event.preventDefault();
			return;
		}

		const state = this._getRowDragState(table);
		state.fromRow = row;
		state.fromIndex = this._getBodyRowIndex(table, row);
		state.overRow = null;
		state.overAfter = false;
		row.setAttribute('data-row-dragging', '1');

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', 'row-reorder');
		}
	}

	static _handleRowDragOver(table, event) {
		const state = this._getRowDragState(table);
		if (!state.fromRow) {
			return;
		}

		const row = event.target && event.target.closest ? event.target.closest(`${ROW_SELECTOR}[data-row-reorder="1"]`) : null;
		if (!row || !table.contains(row)) {
			return;
		}

		event.preventDefault();
		const rect = row.getBoundingClientRect();
		const insertAfter = event.clientY > rect.top + (rect.height / 2);
		state.overRow = row;
		state.overAfter = insertAfter;

		Array.from(table.querySelectorAll(`${ROW_SELECTOR}[data-row-drag-over]`)).forEach((node) => {
			node.removeAttribute('data-row-drag-over');
		});
		if (row !== state.fromRow) {
			row.setAttribute('data-row-drag-over', insertAfter ? 'after' : 'before');
		}
	}

	static _handleRowDrop(table, event) {
		const state = this._getRowDragState(table);
		if (!state.fromRow) {
			return;
		}

		event.preventDefault();
		const targetRow = state.overRow;
		if (!targetRow || !table.contains(targetRow)) {
			this._clearRowDragState(table);
			return;
		}

		const moved = this._moveRow(table, state.fromRow, targetRow, state.overAfter);
		if (!moved) {
			this._clearRowDragState(table);
			return;
		}

		const toIndex = this._getBodyRowIndex(table, state.fromRow);
		this._syncSelectAll(table);
		this._emit(table, 'rowreorder', {
			row: this._getRowPayload(table, state.fromRow),
			fromIndex: state.fromIndex,
			toIndex,
			beforeRow: this._getSiblingRowPayload(table, state.fromRow, 'prev'),
			afterRow: this._getSiblingRowPayload(table, state.fromRow, 'next'),
		});
		this._clearRowDragState(table);
	}

	static _moveRow(table, fromRow, targetRow, insertAfter) {
		const body = table.tBodies && table.tBodies[0] ? table.tBodies[0] : null;
		if (!body || !fromRow || !targetRow || fromRow === targetRow) {
			return false;
		}

		if (insertAfter) {
			if (targetRow.nextSibling === fromRow) {
				return false;
			}
			body.insertBefore(fromRow, targetRow.nextSibling);
			return true;
		}

		if (fromRow.nextSibling === targetRow) {
			return false;
		}
		body.insertBefore(fromRow, targetRow);
		return true;
	}

	static _getBodyRowIndex(table, row) {
		const body = table.tBodies && table.tBodies[0] ? table.tBodies[0] : null;
		if (!body || !row) {
			return -1;
		}
		return Array.from(body.rows).indexOf(row);
	}

	static _getSiblingRowPayload(table, row, direction) {
		if (!row) {
			return null;
		}
		const sibling = direction === 'prev' ? row.previousElementSibling : row.nextElementSibling;
		if (!sibling || sibling.tagName !== 'TR') {
			return null;
		}
		return this._getRowPayload(table, sibling);
	}

	static _getRowPayload(table, row) {
		if (!row) {
			return null;
		}
		const headers = Array.from(table.querySelectorAll('thead th')).map((cell) => String(cell.textContent || '').trim());
		const cells = Array.from(row.cells || []).map((cell) => String(cell.textContent || '').trim());
		return {
			index: this._getBodyRowIndex(table, row),
			headers,
			cells,
			values: headers.reduce((acc, key, idx) => {
				const normalized = key || `col_${idx}`;
				acc[normalized] = cells[idx] || '';
				return acc;
			}, {}),
		};
	}

	static _emit(table, action, payload = {}) {
		const normalizedAction = String(action || '').toLowerCase().trim();
		if (!normalizedAction) {
			return;
		}

		const instance = this._getTableInstance(table);
		const detail = Object.assign({
			action: normalizedAction,
			table,
			isRemote: Boolean(instance && instance._isRemote),
		}, payload);

		const callbacks = instance && instance._params && instance._params.callbacks && typeof instance._params.callbacks === 'object'
			? instance._params.callbacks
			: {};
		const callbackName = ACTION_CALLBACK_MAP[normalizedAction] || '';
		const callback = callbackName ? callbacks[callbackName] : null;
		if (typeof callback === 'function') {
			callback(detail, instance);
		}

		const events = instance && instance._params && instance._params.events ? instance._params.events : {};
		const enabled = events.enable === undefined ? true : Boolean(events.enable);
		if (!enabled || typeof window.CustomEvent !== 'function') {
			return;
		}

		const prefix = String(events.prefix || 'vgdt').trim() || 'vgdt';
		const bubbles = events.bubbles === undefined ? true : Boolean(events.bubbles);
		table.dispatchEvent(new CustomEvent(`${prefix}:${normalizedAction}`, {
			detail,
			bubbles,
		}));
	}

	static _getEditableOptions(instance = null) {
		const current = instance || null;
		return current && current._params && current._params.editable && typeof current._params.editable === 'object'
			? current._params.editable
			: {};
	}

	static _getTableInstance(table) {
		if (!table) {
			return null;
		}
		return Data.get(table, TABLE_DATA_KEY);
	}

	static _getEventPrefix(table) {
		const instance = this._getTableInstance(table);
		const events = instance && instance._params && instance._params.events ? instance._params.events : {};
		return String(events.prefix || 'vgdt').trim() || 'vgdt';
	}

	static _parseBool(value, fallback = false) {
		if (value === undefined || value === null) {
			return fallback;
		}
		const normalized = String(value).toLowerCase().trim();
		if (normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on') {
			return true;
		}
		if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off') {
			return false;
		}
		return fallback;
	}
}

EventHandler.on(document, 'DOMContentLoaded', () => {
	Editable.initAll();
});

export default Editable;
