/**
 * Описание: локальная и серверная сортировка строк базовой таблицы VGTable.
 * Возможности: стабильная одиночная и мультисортировка, Shift-режим, remote-события, Fixed Header, клавиатура, приоритеты и подсветка колонок.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_SORT_CHANGE = 'sortchange.vg.table';
const SORTABLE_SELECTOR = 'th';
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [contenteditable="true"], [data-vg-table-column-resize-handle]';

class _sorting {
	constructor(table, options = {}, headerTable = table) {
		this._table = table;
		this._headerTable = headerTable;
		this._options = Object.assign({hover: false, multiple: false, multipleWithShift: true}, options);
		this._headers = [];
		this._originalRows = new Map();
		this._sorts = [];
		this._boundClick = this._handleClick.bind(this);
		this._boundKeydown = this._handleKeydown.bind(this);
	}

	init() {
		this._headers = this._getHeaders();
		this._rememberOriginalRows();
		this._table.classList.toggle('vg-table-sort-hover', this._options.hover === true);
		this._headerTable.classList.toggle('vg-table-sort-hover', this._options.hover === true);
		this._table.classList.toggle('vg-table-sort-multiple', this._options.multiple === true);
		this._headerTable.classList.toggle('vg-table-sort-multiple', this._options.multiple === true);

		this._headers.forEach((header) => {
			if (!this._isSortable(header)) return;

			header.classList.add('vg-table-sortable');
			header.setAttribute('aria-sort', 'none');
			this._decorateHeader(header);
			if (!header.hasAttribute('tabindex')) header.tabIndex = 0;
		});

		this._headerTable.addEventListener('click', this._boundClick);
		this._headerTable.addEventListener('keydown', this._boundKeydown);
	}

	dispose() {
		this._headerTable.removeEventListener('click', this._boundClick);
		this._headerTable.removeEventListener('keydown', this._boundKeydown);
		this._table.classList.remove('vg-table-sort-hover');
		this._headerTable.classList.remove('vg-table-sort-hover');
		this._table.classList.remove('vg-table-sort-multiple');
		this._headerTable.classList.remove('vg-table-sort-multiple');

		this._headers.forEach((header) => {
			header.classList.remove('vg-table-sortable');
			header.removeAttribute('aria-sort');
				header.removeAttribute('data-sort-direction');
			header.removeAttribute('data-sort-priority');
			header.querySelector('[data-vg-table-sort-controls]')?.remove();
		});

		this._sorts = [];
		this._syncColumnHighlight();
		this._headers = [];
		this._originalRows.clear();
	}

	setSort(column, direction = 'asc', emit = false) {
		const index = this._resolveColumnIndex(column);
		return this.setSorts([{columnIndex: index, direction}], emit);
	}

	setSorts(sorts = [], emit = false) {
		const normalized = this._normalizeSorts(sorts);
		if (sorts.length && !normalized.length) return false;
		this._sorts = this._options.multiple === true ? normalized : normalized.slice(0, 1);
		this._applySort();
		this._syncHeaders();
		if (emit) this._emitChange();
		return true;
	}

	getSort() {
		const sort = this._sorts[0];
		if (!sort) return null;
		const header = this._headers[sort.index];
		return {
			columnIndex: sort.index,
			field: header ? String(header.getAttribute('data-field') || '').trim() : '',
			direction: sort.direction,
		};
	}

	getSorts() {
		return this._sorts.map((sort) => {
			const header = this._headers[sort.index];
			return {
				columnIndex: sort.index,
				field: header ? String(header.getAttribute('data-field') || '').trim() : '',
				direction: sort.direction,
			};
		});
	}

	getSortState() {
		const sort = this.getSort();
		return sort ? Object.assign({}, sort, {sorts: this.getSorts()}) : null;
	}

	refresh(structure = false) {
		if (structure) {
			const sorts = this.getSorts();
			this._headers = this._getHeaders();
			this._headers.forEach((header) => {
				if (!this._isSortable(header)) return;
				header.classList.add('vg-table-sortable');
				if (!header.hasAttribute('aria-sort')) header.setAttribute('aria-sort', 'none');
				this._decorateHeader(header);
				if (!header.hasAttribute('tabindex')) header.tabIndex = 0;
			});
			this.setSorts(sorts, false);
		} else {
			this._syncColumnHighlight();
		}
		return this.getSort();
	}

	clearSort(emit = false) {
		this._sorts = [];
		if (this._options.remote !== true) this._restoreOriginalRows();
		this._syncHeaders();
		if (emit) this._emitChange();
	}

	_getHeaders() {
		const head = this._headerTable.tHead || this._headerTable.querySelector('thead');
		if (!head || !head.rows.length) return [];
		return Array.from(head.rows[head.rows.length - 1].querySelectorAll(SORTABLE_SELECTOR));
	}

	_isSortable(header) {
		return String(header.getAttribute('data-sort-enabled') || '').toLowerCase() !== 'false';
	}

	_rememberOriginalRows() {
		Array.from(this._table.tBodies || []).forEach((body) => {
			this._originalRows.set(body, Array.from(body.rows));
		});
	}

	_restoreOriginalRows() {
		this._originalRows.forEach((rows, body) => {
			rows.forEach((row) => body.append(row));
		});
	}

	_handleClick(event) {
		if (event.target.closest(INTERACTIVE_SELECTOR)) return;

		const header = event.target.closest(SORTABLE_SELECTOR);
		if (!header || !this._headers.includes(header) || !this._isSortable(header)) return;
		this._cycleSort(this._headers.indexOf(header), this._isMultipleMode(event));
	}

	_handleKeydown(event) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		if (event.target.closest(INTERACTIVE_SELECTOR)) return;

		const header = event.target.closest(SORTABLE_SELECTOR);
		if (!header || !this._headers.includes(header) || !this._isSortable(header)) return;

		event.preventDefault();
		this._cycleSort(this._headers.indexOf(header), this._isMultipleMode(event));
	}

	_isMultipleMode(event) {
		if (this._options.multiple !== true) return false;
		return this._options.multipleWithShift === false || event?.shiftKey === true;
	}

	_cycleSort(index, multipleMode = false) {
		const current = this._sorts.find((sort) => sort.index === index);
		if (!current) {
			this._setColumnSort(index, 'asc', multipleMode);
			return;
		}
		if (current.direction === 'asc') {
			this._setColumnSort(index, 'desc', multipleMode);
			return;
		}
		const next = multipleMode
			? this._sorts.filter((sort) => sort.index !== index)
			: [];
		this.setSorts(next, true);
	}

	_setColumnSort(index, direction, multipleMode) {
		const next = multipleMode ? this._sorts.slice() : [];
		const currentIndex = next.findIndex((sort) => sort.index === index);
		const item = {columnIndex: index, direction};
		if (currentIndex >= 0) next.splice(currentIndex, 1, item);
		else next.push(item);
		this.setSorts(next, true);
	}

	_applySort() {
		if (this._options.remote === true || !this._sorts.length) return;

		this._originalRows.forEach((originalRows, body) => {
			const originalIndex = new Map(originalRows.map((row, rowIndex) => [row, rowIndex]));
			const rows = Array.from(body.rows);
			rows.sort((leftRow, rightRow) => {
				for (const sort of this._sorts) {
					const header = this._headers[sort.index];
					const type = String(header?.getAttribute('data-sort-type') || 'auto').toLowerCase();
					const result = this._compareCells(leftRow.cells[sort.index], rightRow.cells[sort.index], type);
					if (result !== 0) return sort.direction === 'desc' ? -result : result;
				}
				return (originalIndex.get(leftRow) ?? 0) - (originalIndex.get(rightRow) ?? 0);
			});
			rows.forEach((row) => body.append(row));
		});
	}

	_compareCells(leftCell, rightCell, type) {
		const left = this._getCellValue(leftCell);
		const right = this._getCellValue(rightCell);

		if (type === 'number' || (type === 'auto' && this._isNumeric(left) && this._isNumeric(right))) {
			return this._toNumber(left) - this._toNumber(right);
		}

		if (type === 'date') {
			const leftTime = Date.parse(left);
			const rightTime = Date.parse(right);
			if (!Number.isNaN(leftTime) && !Number.isNaN(rightTime)) return leftTime - rightTime;
		}

		return left.localeCompare(right, undefined, {numeric: true, sensitivity: 'base'});
	}

	_getCellValue(cell) {
		if (!cell) return '';
		return String(cell.getAttribute('data-sort-value') ?? cell.textContent ?? '').trim();
	}

	_isNumeric(value) {
		return value !== '' && Number.isFinite(this._toNumber(value));
	}

	_toNumber(value) {
		return Number(String(value).replace(/\s/g, '').replace(',', '.'));
	}

	_decorateHeader(header) {
		if (header.querySelector('[data-vg-table-sort-controls]')) return;

		const controls = document.createElement('span');
		controls.className = 'vg-table-sort-controls';
		controls.setAttribute('data-vg-table-sort-controls', '');
		controls.setAttribute('aria-hidden', 'true');
		controls.innerHTML = `
			<span class="vg-table-sort-priority" data-vg-table-sort-priority hidden></span>
			<span class="vg-table-sort-chevron vg-table-sort-chevron-asc"></span>
			<span class="vg-table-sort-chevron vg-table-sort-chevron-desc"></span>
		`;
		header.append(controls);
	}

	_syncHeaders() {
		this._headers.forEach((header, index) => {
			const priority = this._sorts.findIndex((sort) => sort.index === index);
			const direction = priority >= 0 ? this._sorts[priority].direction : null;
			const priorityNode = header.querySelector('[data-vg-table-sort-priority]');
			header.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none');
			if (direction) {
				header.setAttribute('data-sort-direction', direction);
				header.setAttribute('data-sort-priority', String(priority + 1));
				if (priorityNode) {
					priorityNode.textContent = String(priority + 1);
					priorityNode.hidden = this._sorts.length < 2;
				}
			} else {
				header.removeAttribute('data-sort-direction');
				header.removeAttribute('data-sort-priority');
				if (priorityNode) priorityNode.hidden = true;
			}
		});
		this._syncColumnHighlight();
	}

	_syncColumnHighlight() {
		const rows = [...Array.from(this._headerTable.rows || []), ...Array.from(this._table.rows || [])]
			.filter((row) => !row.hasAttribute('data-vg-table-state-row'));
		rows.forEach((row) => {
			Array.from(row.cells || []).forEach((cell) => {
				cell.removeAttribute('data-sorted-column');
				cell.removeAttribute('data-sorted-priority');
			});
		});

		this._sorts.forEach((sort, priority) => rows.forEach((row) => {
			const cell = row.cells[sort.index];
			if (cell) {
				cell.setAttribute('data-sorted-column', '1');
				cell.setAttribute('data-sorted-priority', String(priority + 1));
			}
		}));
	}

	_normalizeSorts(sorts) {
		const result = [];
		const seen = new Set();
		(Array.isArray(sorts) ? sorts : []).forEach((sort) => {
			const column = sort?.field ?? sort?.columnIndex ?? sort?.index;
			const index = this._resolveColumnIndex(column);
			if (index < 0 || seen.has(index) || !this._isSortable(this._headers[index])) return;
			seen.add(index);
			result.push({
				index,
				direction: String(sort?.direction ?? sort?.dir ?? 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc',
			});
		});
		return result;
	}

	_emitChange() {
		EventHandler.trigger(this._table, EVENT_SORT_CHANGE, {sort: this.getSort(), sorts: this.getSorts()});
	}

	_resolveColumnIndex(column) {
		if (typeof column === 'string') {
			return this._headers.findIndex((header) => String(header.getAttribute('data-field') || '').trim() === column.trim());
		}

		const index = Number.parseInt(column, 10);
		return Number.isInteger(index) ? index : -1;
	}
}

export default _sorting;
