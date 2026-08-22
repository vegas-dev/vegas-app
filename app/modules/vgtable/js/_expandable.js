/**
 * Описание: многоуровневые сворачиваемые строки базовой таблицы VGTable.
 * Возможности: дерево любой глубины, автоматические toggle-кнопки, Data API, публичное управление и события состояния.
 */
import EventHandler from "../../../utils/js/dom/event";


const EVENT_TOGGLE = 'rowtoggle.vg.table';
const EVENT_EXPAND = 'rowexpand.vg.table';
const EVENT_COLLAPSE = 'rowcollapse.vg.table';
const GENERATED_TOGGLE_ATTRIBUTE = 'data-vg-table-expandable-generated';
const HIDDEN_ATTRIBUTE = 'data-vg-table-expand-hidden';
const DEPTH_ATTRIBUTE = 'data-expand-depth';
const PAGE_ATTRIBUTE = 'data-vg-table-page-row';

class _expandable {
	constructor(table, options = {}) {
		this._table = table;
		this._options = options;
		this._collapsed = new Set();
		this._seeded = new Set();
		this._rowById = new Map();
		this._childrenByParent = new Map();
		this._boundClick = this._handleClick.bind(this);
	}

	init() {
		this._table.classList.add('vg-table-expandable');
		this._table.addEventListener('click', this._boundClick);
		return this.refresh();
	}

	dispose() {
		this._table.removeEventListener('click', this._boundClick);
		this._table.classList.remove('vg-table-expandable');
		this._rows().forEach((row) => {
			row.removeAttribute(DEPTH_ATTRIBUTE);
			row.removeAttribute(HIDDEN_ATTRIBUTE);
			row.style.removeProperty('--vg-table-expandable-depth');
			row.hidden = row.getAttribute(PAGE_ATTRIBUTE) === 'hidden'
				|| row.hasAttribute('data-vg-table-filter-hidden');
			row.querySelectorAll(`[${GENERATED_TOGGLE_ATTRIBUTE}]`).forEach((toggle) => toggle.remove());
			const toggle = this._findToggle(row);
			if (toggle) {
				toggle.classList.remove('vg-table-expandable__toggle');
				toggle.removeAttribute('aria-expanded');
				toggle.removeAttribute('aria-label');
				toggle.hidden = false;
			}
		});
		this._collapsed.clear();
		this._seeded.clear();
		this._rowById.clear();
		this._childrenByParent.clear();
	}

	refresh() {
		const rows = this._rows();
		const idAttr = this._idAttr();
		const parentAttr = this._parentAttr();
		this._rowById = new Map();
		this._childrenByParent = new Map();
		const parentById = new Map();

		rows.forEach((row, index) => {
			const fallback = `row-${index + 1}`;
			const id = String(row.getAttribute(idAttr) || fallback).trim() || fallback;
			row.setAttribute(idAttr, id);
			this._rowById.set(id, row);
			const parentId = String(row.getAttribute(parentAttr) || '').trim();
			parentById.set(id, parentId);
			if (parentId) {
				if (!this._childrenByParent.has(parentId)) this._childrenByParent.set(parentId, []);
				this._childrenByParent.get(parentId).push(id);
			}
		});

		const depthCache = new Map();
		this._rowById.forEach((row, id) => {
			const depth = this._depth(id, parentById, depthCache, new Set());
			const hasChildren = (this._childrenByParent.get(id) || []).length > 0;
			row.setAttribute(DEPTH_ATTRIBUTE, String(depth));
			row.style.setProperty('--vg-table-expandable-depth', String(depth));
			if (hasChildren && !this._seeded.has(id)) {
				if (this._initiallyCollapsed(row)) this._collapsed.add(id);
				this._seeded.add(id);
			}
			this._syncToggle(row, id, hasChildren);
		});

		this._rowById.forEach((row, id) => {
			const hidden = this._hasCollapsedAncestor(id, parentById);
			if (hidden) row.setAttribute(HIDDEN_ATTRIBUTE, 'true');
			else row.removeAttribute(HIDDEN_ATTRIBUTE);
			row.hidden = hidden
				|| row.getAttribute(PAGE_ATTRIBUTE) === 'hidden'
				|| row.hasAttribute('data-vg-table-filter-hidden');
		});

		return this.getState();
	}

	toggle(row, expanded = null, emit = true) {
		const target = this._resolveRow(row);
		if (!target) return false;
		const id = String(target.getAttribute(this._idAttr()) || '').trim();
		if (!id || !(this._childrenByParent.get(id) || []).length) return false;
		const nextExpanded = expanded === null ? this._collapsed.has(id) : expanded === true;
		if (nextExpanded) this._collapsed.delete(id);
		else this._collapsed.add(id);
		this.refresh();
		if (emit) this._emit(target, id, nextExpanded);
		return true;
	}

	expand(row, emit = true) {
		return this.toggle(row, true, emit);
	}

	collapse(row, emit = true) {
		return this.toggle(row, false, emit);
	}

	getState() {
		const parents = Array.from(this._childrenByParent.keys()).filter((id) => this._rowById.has(id));
		return {
			expanded: parents.filter((id) => !this._collapsed.has(id)),
			collapsed: parents.filter((id) => this._collapsed.has(id)),
		};
	}

	_handleClick(event) {
		const target = event.target instanceof Element ? event.target : event.target?.parentElement;
		let toggle = null;
		try {
			toggle = target?.closest(this._combinedToggleSelector());
		} catch (_) {
			toggle = target?.closest('[data-expand-toggle]');
		}
		if (!toggle || !this._table.contains(toggle)) return;
		event.preventDefault();
		const row = toggle.closest('tr');
		if (row) this.toggle(row, null, true);
	}

	_syncToggle(row, id, hasChildren) {
		let toggle = this._findToggle(row);
		if (!toggle && hasChildren) {
			const cell = row.cells?.[0];
			if (cell) {
				toggle = document.createElement('button');
				toggle.type = 'button';
				toggle.setAttribute('data-expand-toggle', id);
				toggle.setAttribute(GENERATED_TOGGLE_ATTRIBUTE, '');
				cell.prepend(toggle);
			}
		}
		if (!toggle) return;
		toggle.classList.add('vg-table-expandable__toggle');
		toggle.hidden = !hasChildren;
		if (!hasChildren) return;
		const expanded = !this._collapsed.has(id);
		const labels = this._options.labels || {};
		toggle.setAttribute('data-expand-toggle', id);
		toggle.setAttribute('aria-expanded', String(expanded));
		toggle.setAttribute('aria-label', expanded ? labels.collapse || 'Свернуть дочерние строки' : labels.expand || 'Развернуть дочерние строки');
	}

	_findToggle(row) {
		try {
			return row.querySelector(this._combinedToggleSelector());
		} catch (_) {
			return row.querySelector('[data-expand-toggle]');
		}
	}

	_combinedToggleSelector() {
		const selector = String(this._options.toggleSelector || '[data-expand-toggle]').trim();
		return selector === '[data-expand-toggle]' ? selector : `${selector}, [data-expand-toggle]`;
	}

	_depth(id, parentById, cache, trail) {
		if (cache.has(id)) return cache.get(id);
		if (trail.has(id)) return 0;
		trail.add(id);
		const parentId = String(parentById.get(id) || '').trim();
		const depth = !parentId || parentId === id || !this._rowById.has(parentId)
			? 0
			: this._depth(parentId, parentById, cache, trail) + 1;
		trail.delete(id);
		cache.set(id, depth);
		return depth;
	}

	_hasCollapsedAncestor(id, parentById) {
		const visited = new Set([id]);
		let parentId = String(parentById.get(id) || '').trim();
		while (parentId && !visited.has(parentId)) {
			if (this._collapsed.has(parentId)) return true;
			visited.add(parentId);
			parentId = String(parentById.get(parentId) || '').trim();
		}
		return false;
	}

	_initiallyCollapsed(row) {
		const value = row.getAttribute('data-expand-collapsed');
		return value === null ? this._options.collapsed === true : this._boolean(value);
	}

	_resolveRow(row) {
		if (row instanceof Element) {
			const target = row.matches('tbody tr') ? row : row.closest('tbody tr');
			return target && this._table.contains(target) ? target : null;
		}
		return this._rowById.get(String(row)) || null;
	}

	_rows() {
		return Array.from(this._table.tBodies || []).flatMap((body) => Array.from(body.rows || []));
	}

	_idAttr() {
		return String(this._options.idAttr || 'data-expand-id').trim() || 'data-expand-id';
	}

	_parentAttr() {
		return String(this._options.parentAttr || 'data-expand-parent-id').trim() || 'data-expand-parent-id';
	}

	_boolean(value) {
		return !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());
	}

	_emit(row, id, expanded) {
		const detail = {id, row, expanded, collapsed: !expanded};
		EventHandler.trigger(this._table, EVENT_TOGGLE, detail);
		EventHandler.trigger(this._table, expanded ? EVENT_EXPAND : EVENT_COLLAPSE, detail);
	}
}

export default _expandable;
