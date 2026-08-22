/**
 * Описание: отдельное поле поиска VGTable для локальных и Remote-таблиц.
 * Возможности: debounce, немедленный запуск по Enter, очистка, публичное состояние и событие изменения.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_CHANGE = 'searchchange.vg.table';

class _search {
	constructor(table, options = {}, onChange = null) {
		this._table = table;
		this._options = options;
		this._onChange = typeof onChange === 'function' ? onChange : null;
		this._input = null;
		this._resetButtons = [];
		this._timer = null;
		this._boundInput = this._handleInput.bind(this);
		this._boundKeydown = this._handleKeydown.bind(this);
		this._boundReset = this._handleReset.bind(this);
	}

	init() {
		this._input = this._resolveNode(this._options.input);
		if (!this._input) return this;
		this._resetButtons = this._resolveNodes(this._options.button?.reset || '[data-search-reset]');
		this._input.addEventListener('input', this._boundInput);
		this._input.addEventListener('keydown', this._boundKeydown);
		this._resetButtons.forEach((button) => button.addEventListener('click', this._boundReset));
		return this;
	}

	dispose() {
		this._input?.removeEventListener('input', this._boundInput);
		this._input?.removeEventListener('keydown', this._boundKeydown);
		this._resetButtons.forEach((button) => button.removeEventListener('click', this._boundReset));
		this._clearTimer();
		this._input = null;
		this._resetButtons = [];
	}

	getState() {
		return {
			value: this._value(),
			param: String(this._options.param || 'q').trim() || 'q',
		};
	}

	setValue(value, options = {}) {
		if (!this._input) return this.getState();
		this._input.value = String(value ?? '');
		this._clearTimer();
		if (options.emit === true) this._emit(String(options.source || 'api'));
		return this.getState();
	}

	reset(options = {}) {
		return this.setValue('', {
			emit: options.emit !== false,
			source: String(options.source || 'reset'),
		});
	}

	refresh() {
		return this.getState();
	}

	_handleInput() {
		this._schedule('input');
	}

	_handleKeydown(event) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		this._clearTimer();
		this._emit('enter');
	}

	_handleReset(event) {
		event.preventDefault();
		this.reset({source: 'reset'});
		this._input?.focus?.();
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

	_value() {
		const value = String(this._input?.value ?? '');
		return this._options.trim === false ? value : value.trim();
	}

	_resolveNode(value) {
		if (typeof Element !== 'undefined' && value instanceof Element) return value;
		const selector = String(value || '').trim();
		if (!selector) return null;
		try { return document.querySelector(selector); } catch (_) { return null; }
	}

	_resolveNodes(value) {
		const selector = String(value || '').trim();
		if (!selector) return [];
		try {
			const scope = this._input?.form || this._input?.closest?.('[data-search-controls]') || document;
			const scoped = Array.from(scope.querySelectorAll(selector));
			return scoped.length ? scoped : Array.from(document.querySelectorAll(selector));
		} catch (_) {
			return [];
		}
	}

	_nonNegativeInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
	}
}

export default _search;
