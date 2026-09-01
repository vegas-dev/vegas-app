/**
 * Описание: форма локальных и remote-фильтров VGTable.
 * Возможности: auto/manual применение, debounce, операторы, reset и публичное состояние.
 */
import EventHandler from "../../../utils/js/dom/event";
import VGSelect from "../../vgselect/js/vgselect";

const EVENT_CHANGE = 'filterschange.vg.table';

class _filters {
	constructor(table, options = {}, onChange = null) {
		this._table = table;
		this._options = options;
		this._onChange = typeof onChange === 'function' ? onChange : null;
		this._form = null;
		this._controls = [];
		this._timer = null;
		this._boundInput = this._handleInput.bind(this);
		this._boundChange = this._handleChange.bind(this);
		this._boundClick = this._handleClick.bind(this);
		this._boundSubmit = this._handleSubmit.bind(this);
	}

	init() {
		this._form = this._resolveForm();
		if (!this._form) return this;
		this.refresh();
		this._form.addEventListener('input', this._boundInput);
		this._form.addEventListener('change', this._boundChange);
		this._form.addEventListener('click', this._boundClick);
		this._form.addEventListener('submit', this._boundSubmit);
		return this;
	}

	dispose() {
		if (this._form) {
			this._form.removeEventListener('input', this._boundInput);
			this._form.removeEventListener('change', this._boundChange);
			this._form.removeEventListener('click', this._boundClick);
			this._form.removeEventListener('submit', this._boundSubmit);
		}
		if (this._timer) window.clearTimeout(this._timer);
		this._timer = null;
		this._controls = [];
		this._form = null;
	}

	refresh() {
		if (!this._form) return this.getState();
		this._controls = Array.from(this._form.querySelectorAll(`[${this._fieldAttr()}]`))
			.filter((control) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(control.tagName));
		return this.getState();
	}

	getState() {
		const groups = new Map();
		this._controls.forEach((control) => {
			const field = String(control.getAttribute(this._fieldAttr()) || '').trim();
			if (!field) return;
			if (!groups.has(field)) groups.set(field, {
				field,
				type: String(control.getAttribute(this._typeAttr()) || 'text').trim() || 'text',
				operator: String(control.getAttribute(this._operatorAttr()) || this._options.defaultOperator || 'eq').trim() || 'eq',
				value: '',
				values: [],
			});
			const item = groups.get(field);
			const part = String(control.getAttribute(this._partAttr()) || 'value').toLowerCase();
			const value = this._readValue(control);
			if (part === 'operator') {
				item.operator = String(value || this._options.defaultOperator || 'eq').trim() || 'eq';
				return;
			}
			if (part === 'type') {
				item.type = String(value || 'text').trim() || 'text';
				return;
			}
			if (Array.isArray(value)) {
				item.values = value;
				item.value = value.join(',');
				return;
			}
			if ((control.type === 'checkbox' || control.type === 'radio') && value === '') return;
			item.value = value;
		});

		const filters = {};
		const params = {};
		groups.forEach((item, field) => {
			const normalized = this._normalizeItem(item);
			if (!normalized) return;
			filters[field] = normalized;
			params[field] = normalized.values.length ? normalized.values.slice() : normalized.value;
			if (normalized.operator) params[`${field}_op`] = normalized.operator;
		});
		return {filters, params, fields: Object.keys(filters), meta: {count: Object.keys(filters).length}};
	}

	getFields() {
		return this._fieldNames();
	}

	setValues(values = {}, options = {}) {
		const source = values && typeof values === 'object' ? values : {};
		this._controls.forEach((control) => {
			const field = String(control.getAttribute(this._fieldAttr()) || '').trim();
			if (!field) return;
			const part = String(control.getAttribute(this._partAttr()) || 'value').toLowerCase();
			const key = part === 'operator' ? `${field}_op` : field;
			this._writeValue(control, Object.prototype.hasOwnProperty.call(source, key) ? source[key] : '');
		});
		if (options.emit === true) this._emit(String(options.source || 'api'));
		return this.getState();
	}

	reset(options = {}) {
		this._controls.forEach((control) => {
			this._resetControl(control);
			if (control.tagName === 'SELECT') VGSelect.updateUI(control);
		});
		if (options.emit !== false) this._emit(String(options.source || 'reset'));
		return this.getState();
	}

	_handleInput(event) {
		if (!this._isControl(event.target) || this._isManual()) return;
		if (['checkbox', 'radio'].includes(String(event.target.type).toLowerCase()) || event.target.tagName === 'SELECT') {
			this._emit('input');
			return;
		}
		this._schedule('input');
	}

	_handleChange(event) {
		if (!this._isControl(event.target) || this._isManual()) return;
		this._clearTimer();
		this._emit('change');
	}

	_handleClick(event) {
		const buttons = this._options.buttons || {};
		const apply = this._closest(event.target, buttons.apply || '[data-filter-apply]');
		if (apply && this._form.contains(apply)) {
			event.preventDefault();
			this._clearTimer();
			this._emit('apply');
			return;
		}
		const reset = this._closest(event.target, buttons.reset || '[data-filter-reset]');
		if (!reset || !this._form.contains(reset)) return;
		event.preventDefault();
		this._clearTimer();
		this.reset({source: 'reset'});
	}

	_handleSubmit(event) {
		if (!this._isManual()) return;
		event.preventDefault();
		this._clearTimer();
		this._emit('submit');
	}

	_emit(source) {
		const state = Object.assign(this.getState(), {source});
		EventHandler.trigger(this._table, EVENT_CHANGE, state);
		this._onChange?.(state);
	}

	_schedule(source) {
		this._clearTimer();
		this._timer = window.setTimeout(() => {
			this._timer = null;
			this._emit(source);
		}, this._nonNegativeInt(this._options.debounce, 300));
	}

	_clearTimer() {
		if (this._timer) window.clearTimeout(this._timer);
		this._timer = null;
	}

	_resolveForm() {
		if (typeof Element !== 'undefined' && this._options.form instanceof Element) return this._options.form;
		const selector = String(this._options.form || '').trim();
		if (!selector) return null;
		try { return document.querySelector(selector); } catch (_) { return null; }
	}

	_normalizeItem(item) {
		let value = item.value;
		let values = Array.isArray(item.values) ? item.values.slice() : [];
		if (this._options.trim !== false) {
			if (typeof value === 'string') value = value.trim();
			values = values.map((entry) => String(entry ?? '').trim()).filter(Boolean);
		}
		if (this._options.skipEmpty !== false && !values.length && (value === null || value === undefined || String(value) === '')) return null;
		return {
			field: item.field,
			type: String(item.type || 'text').toLowerCase(),
			operator: String(item.operator || this._options.defaultOperator || 'eq').toLowerCase(),
			value: value ?? '',
			values,
		};
	}

	_readValue(control) {
		if (control.tagName === 'SELECT' && control.multiple) {
			return Array.from(control.selectedOptions).map((option) => option.value).filter(Boolean);
		}
		if (control.type === 'checkbox' || control.type === 'radio') {
			if (!control.checked) return '';
			return control.getAttribute(this._valueAttr()) ?? control.value ?? '1';
		}
		return control.value ?? '';
	}

	_writeValue(control, value) {
		if (control.type === 'checkbox' || control.type === 'radio') {
			const values = Array.isArray(value) ? value.map(String) : [String(value ?? '')];
			const own = String(control.getAttribute(this._valueAttr()) ?? control.value ?? '1');
			control.checked = values.includes(own) || (control.type === 'checkbox' && ['1', 'true', 'on'].includes(values[0]?.toLowerCase()));
			return;
		}
		if (control.tagName === 'SELECT' && control.multiple) {
			const values = new Set((Array.isArray(value) ? value : String(value ?? '').split(',')).map(String));
			Array.from(control.options).forEach((option) => { option.selected = values.has(option.value); });
			return;
		}
		control.value = String(value ?? '');
	}

	_resetControl(control) {
		if (control.type === 'checkbox' || control.type === 'radio') control.checked = control.defaultChecked;
		else if (control.tagName === 'SELECT') Array.from(control.options).forEach((option) => { option.selected = option.defaultSelected; });
		else control.value = control.defaultValue || '';
	}

	_fieldNames() {
		return Array.from(new Set(this._controls.map((control) => String(control.getAttribute(this._fieldAttr()) || '').trim()).filter(Boolean)));
	}

	_isControl(node) {
		return this._controls.includes(node);
	}

	_closest(node, selector) {
		if (!node?.closest) return null;
		const normalized = String(selector || '').trim();
		if (!normalized) return null;
		try { return node.closest(normalized); } catch (_) { return null; }
	}

	_isManual() {
		return String(this._options.apply || 'auto').toLowerCase() === 'manual';
	}

	_fieldAttr() { return String(this._options.fieldAttr || 'data-filter-field'); }
	_partAttr() { return String(this._options.partAttr || 'data-filter-part'); }
	_typeAttr() { return String(this._options.typeAttr || 'data-filter-type'); }
	_valueAttr() { return String(this._options.valueAttr || 'data-filter-value'); }
	_operatorAttr() { return String(this._options.operatorAttr || 'data-filter-operator'); }
	_nonNegativeInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
	}
}

export default _filters;
