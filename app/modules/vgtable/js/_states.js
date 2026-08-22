/**
 * Описание: единый визуальный слой состояний VGTable.
 * Возможности: empty, filtered-empty и error, действия retry/reset, live-region и публичное состояние.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_CHANGE = 'statechange.vg.table';
const STATE_ROW_ATTRIBUTE = 'data-vg-table-state-row';

class _states {
	constructor(table, wrapper, options = {}, hooks = {}) {
		this._table = table;
		this._wrapper = wrapper;
		this._options = options;
		this._hooks = hooks;
		this._state = null;
		this._boundClick = this._handleClick.bind(this);
	}

	init() {
		this._table.addEventListener('click', this._boundClick);
		return this;
	}

	dispose() {
		this._table.removeEventListener('click', this._boundClick);
		this.clear(false);
	}

	render(type, message = '') {
		if (this._options.enabled === false) return null;
		const normalized = ['empty', 'filtered-empty', 'error'].includes(String(type)) ? String(type) : 'empty';
		this._removeRow();
		const row = this._table.ownerDocument.createElement('tr');
		row.setAttribute(STATE_ROW_ATTRIBUTE, '');
		const cell = this._table.ownerDocument.createElement('td');
		cell.colSpan = this._columns();
		cell.setAttribute('data-vg-table-state', normalized);
		cell.setAttribute('role', normalized === 'error' ? 'alert' : 'status');
		const content = this._table.ownerDocument.createElement('div');
		content.className = 'vg-table-state';
		const icon = this._table.ownerDocument.createElement('span');
		icon.className = `vg-table-state__icon vg-table-state__icon--${normalized}`;
		icon.setAttribute('aria-hidden', 'true');
		const text = this._table.ownerDocument.createElement('span');
		text.className = 'vg-table-state__text';
		text.textContent = message || this._label(normalized);
		content.append(icon, text);
		const actions = this._actions(normalized);
		if (actions) content.append(actions);
		cell.append(content);
		row.append(cell);
		if (this._hooks.remote === true) this._body().replaceChildren(row);
		else this._body().append(row);
		this._state = {type: normalized, message: text.textContent};
		this._wrapper?.setAttribute('data-vg-table-state', normalized);
		EventHandler.trigger(this._table, EVENT_CHANGE, this.getState());
		return this.getState();
	}

	clear(emit = true) {
		const previous = this._state;
		this._removeRow();
		this._state = null;
		this._wrapper?.removeAttribute('data-vg-table-state');
		if (emit && previous) EventHandler.trigger(this._table, EVENT_CHANGE, {type: null, previous});
		return previous;
	}

	syncLocal(activeQuery = false) {
		const rows = this._dataRows();
		if (!rows.length) return this.render('empty');
		const matched = rows.filter((row) => !row.hasAttribute('data-vg-table-filter-hidden'));
		if (activeQuery && !matched.length) return this.render('filtered-empty');
		this.clear();
		return null;
	}

	getState() {
		return this._state ? Object.assign({}, this._state) : null;
	}

	_actions(type) {
		if (type !== 'error' && type !== 'filtered-empty') return null;
		const actions = this._table.ownerDocument.createElement('span');
		actions.className = 'vg-table-state__actions';
		const button = this._table.ownerDocument.createElement('button');
		button.type = 'button';
		button.className = 'vg-table-state__action';
		if (type === 'error') {
			button.setAttribute('data-vg-table-retry', '');
			button.textContent = this._label('retry');
		} else {
			button.setAttribute('data-vg-table-state-reset', '');
			button.textContent = this._label('reset');
		}
		actions.append(button);
		return actions;
	}

	_handleClick(event) {
		const reset = event.target.closest('[data-vg-table-state-reset]');
		if (!reset) return;
		event.preventDefault();
		this._hooks.reset?.();
	}

	_label(key) {
		const labels = this._options.labels || {};
		const fallbacks = {
			empty: 'Нет данных',
			'filtered-empty': 'По вашему запросу ничего не найдено',
			error: 'Не удалось загрузить данные',
			retry: 'Повторить',
			reset: 'Сбросить фильтры',
		};
		return String(labels[key] || fallbacks[key] || '');
	}

	_columns() {
		const headerTable = this._hooks.getHeaderTable?.() || this._table;
		const rows = Array.from(headerTable.tHead?.rows || []);
		return Math.max(1, rows.length ? rows.at(-1).cells.length : 1);
	}

	_dataRows() {
		return Array.from(this._table.tBodies || [])
			.flatMap((body) => Array.from(body.rows || []))
			.filter((row) => !row.hasAttribute(STATE_ROW_ATTRIBUTE));
	}

	_removeRow() {
		this._body().querySelector(`[${STATE_ROW_ATTRIBUTE}]`)?.remove();
	}

	_body() {
		return this._table.tBodies[0] || this._table.createTBody();
	}
}

export {STATE_ROW_ATTRIBUTE};
export default _states;
