/**
 * Описание: управление выбором строк базовой таблицы VGTable.
 * Возможности: выбор кликом, одиночный и множественный режимы, публичное управление и событие изменения.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_SELECTION_CHANGE = 'selectionchange.vg.table';
const ROW_SELECTOR = 'tbody tr';
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, label, [contenteditable="true"], [role="button"], [data-vg-table-selection-ignore]';
const SELECTED_CLASS = 'vg-table-row-selected';
const SELECTED_ATTRIBUTE = 'data-vg-table-selected';

class _selection {
	constructor(table, options = {}) {
		this._table = table;
		this._options = Object.assign({click: true, multiple: false}, options);
		this._boundClick = this._handleClick.bind(this);
	}

	init() {
		this._table.classList.toggle('vg-table-selection-click', this._options.click === true);
		if (this._options.click === true) this._table.addEventListener('click', this._boundClick);
	}

	dispose() {
		this._table.removeEventListener('click', this._boundClick);
		this._table.classList.remove('vg-table-selection-click');
		this.getSelectedRows().forEach((row) => this._setRowState(row, false));
	}

	selectRow(row, selected = true, emit = true) {
		const target = this._resolveRow(row);
		if (!target) return false;

		const nextSelected = selected === true;
		const currentlySelected = target.classList.contains(SELECTED_CLASS);
		if (nextSelected === currentlySelected) return true;

		if (nextSelected && this._options.multiple !== true) {
			this.getSelectedRows().forEach((selectedRow) => {
				if (selectedRow !== target) this._setRowState(selectedRow, false);
			});
		}

		this._setRowState(target, nextSelected);
		if (emit) this._emitChange(target, nextSelected);
		return true;
	}

	toggleRow(row, emit = true) {
		const target = this._resolveRow(row);
		if (!target) return false;
		return this.selectRow(target, !target.classList.contains(SELECTED_CLASS), emit);
	}

	getSelectedRows() {
		return this._getRows().filter((row) => row.classList.contains(SELECTED_CLASS));
	}

	clearSelection(emit = true) {
		const selectedRows = this.getSelectedRows();
		if (!selectedRows.length) return false;

		selectedRows.forEach((row) => this._setRowState(row, false));
		if (emit) this._emitChange(null, false);
		return true;
	}

	_handleClick(event) {
		if (event.target.closest(INTERACTIVE_SELECTOR)) return;

		const row = event.target.closest(ROW_SELECTOR);
		if (row && this._table.contains(row)) this.toggleRow(row);
	}

	_getRows() {
		return Array.from(this._table.tBodies || []).flatMap((body) => Array.from(body.rows || []));
	}

	_resolveRow(row) {
		if (row instanceof Element) {
			const target = row.matches(ROW_SELECTOR) ? row : row.closest(ROW_SELECTOR);
			return target && this._table.contains(target) ? target : null;
		}

		const index = Number.parseInt(row, 10);
		return Number.isInteger(index) ? this._getRows()[index] || null : null;
	}

	_setRowState(row, selected) {
		row.classList.toggle(SELECTED_CLASS, selected);
		if (selected) {
			row.setAttribute(SELECTED_ATTRIBUTE, 'true');
		} else {
			row.removeAttribute(SELECTED_ATTRIBUTE);
		}
	}

	_emitChange(row, selected) {
		const rows = this.getSelectedRows();
		const tableRows = this._getRows();
		const keys = rows.map((selectedRow) => selectedRow.getAttribute('data-row-key') || String(tableRows.indexOf(selectedRow)));
		EventHandler.trigger(this._table, EVENT_SELECTION_CHANGE, {
			row,
			selected,
			rows,
			keys,
		});
	}
}

export default _selection;
