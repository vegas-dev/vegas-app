/**
 * Описание: локальная и remote-пагинация строк базовой таблицы VGTable.
 * Возможности: выбор страницы и размера, серверная meta, лимит кнопок, responsive-представление без запросов, многоточия, быстрый переход и сохранение.
 */
import EventHandler from "../../../utils/js/dom/event";
import VGDropdown from "../../vgdropdown";


const EVENT_PAGE_CHANGE = 'pagechange.vg.table';
const EVENT_PER_PAGE_CHANGE = 'perpagechange.vg.table';
const GENERATED_ATTRIBUTE = 'data-vg-table-pagination-generated';

class _pagination {
	constructor(table, options = {}) {
		this._table = table;
		this._options = options;
		this._host = table.closest('.vg-table-wrapper') || table.parentElement;
		this._containers = [];
		this._dropdowns = [];
		this._externalVisibility = new Map();
		this._manageExternalVisibility = options.responsive === true;
		this._updatingPresentation = false;
		this._page = this._positiveInt(options.page, 1);
		this._perPage = this._clampPerPage(options.per);
		this._remote = options.remote === true;
		this._totalRowsValue = 0;
		this._totalPagesValue = this._remote ? this._page : 1;
		this._boundClick = this._handleClick.bind(this);
		this._boundChange = this._handleChange.bind(this);
		this._boundKeydown = this._handleKeydown.bind(this);
		this._boundFocusIn = this._handleFocusIn.bind(this);
		this._boundFocusOut = this._handleFocusOut.bind(this);
	}

	init() {
		this._restoreState();
		this._containers = this._resolveContainers();
		this._bindContainers();
		this.refresh();
	}

	_bindContainers() {
		this._containers.forEach((container) => {
			container.addEventListener('click', this._boundClick);
			container.addEventListener('change', this._boundChange);
			container.addEventListener('keydown', this._boundKeydown);
			container.addEventListener('focusin', this._boundFocusIn);
			container.addEventListener('focusout', this._boundFocusOut);
		});
	}

	_releaseContainers() {
		this._disposeDropdowns();
		this._containers.forEach((container) => {
			container.removeEventListener('click', this._boundClick);
			container.removeEventListener('change', this._boundChange);
			container.removeEventListener('keydown', this._boundKeydown);
			container.removeEventListener('focusin', this._boundFocusIn);
			container.removeEventListener('focusout', this._boundFocusOut);
			if (container.hasAttribute(GENERATED_ATTRIBUTE)) container.remove();
		});
		this._containers = [];
	}

	dispose() {
		this._releaseContainers();
		this._externalVisibility.forEach((hidden, container) => { container.hidden = hidden; });
		this._externalVisibility.clear();
		this._rows().forEach((row) => {
			row.hidden = row.getAttribute('data-vg-table-expand-hidden') === 'true'
				|| row.hasAttribute('data-vg-table-filter-hidden');
			row.removeAttribute('data-vg-table-page-row');
		});
		this._containers = [];
	}

	/** Обновляет только панели: не трогает строки, page/per, storage, scroll или onChange. */
	updatePresentation(options) {
		const focus = this._captureFocus();
		const position = this._position();
		this._updatingPresentation = true;
		try {
			this._options = {...this._options, ...options};
			if (position !== this._position()) {
				this._manageExternalVisibility = true;
				this._releaseContainers();
				this._containers = this._resolveContainers();
				this._bindContainers();
			}
			this._renderControls();
		} finally {
			this._updatingPresentation = false;
		}
		this._restoreFocus(focus);
	}

	_captureFocus() {
		const active = this._table.ownerDocument.activeElement;
		const container = this._containers.find((item) => item.contains(active));
		if (!container) return null;
		const attribute = ['data-pagination-page', 'data-pagination-per-page', 'data-pagination-quick-input', 'data-pagination-quick-button']
			.find((name) => active.hasAttribute(name));
		return {
			position: this._positionFor(container), attribute, value: attribute ? active.getAttribute(attribute) : null,
			inputValue: active.tagName === 'INPUT' ? active.value : null,
			start: active.selectionStart, end: active.selectionEnd,
		};
	}

	_restoreFocus(focus) {
		if (!focus) return;
		const container = this._containers.find((item) => this._positionFor(item) === focus.position) || this._containers[0];
		if (!container) return;
		const matching = focus.attribute ? Array.from(container.querySelectorAll(`[${focus.attribute}]`))
			.find((item) => !item.disabled && item.getAttribute(focus.attribute) === focus.value) : null;
		const target = matching || container.querySelector('[aria-current="page"]');
		target?.focus({preventScroll: true});
		if (matching && focus.inputValue !== null) {
			matching.value = focus.inputValue;
			if (focus.start !== null && focus.start !== undefined) matching.setSelectionRange(focus.start, focus.end);
		}
	}

	setPage(page, emit = false, source = 'api') {
		const nextPage = this._clampPage(page);
		if (nextPage === this._page) return false;

		this._page = nextPage;
		this._storeState();
		this._render();
		this._scroll();
		if (emit) this._emit(EVENT_PAGE_CHANGE, source);
		this._notify(source);
		return true;
	}

	setPerPage(perPage, emit = false, source = 'api') {
		const nextPerPage = this._clampPerPage(perPage);
		const changed = nextPerPage !== this._perPage;
		if (!changed && this._page === 1) return false;

		this._perPage = nextPerPage;
		this._page = 1;
		this._storeState();
		this._render();
		this._scroll();
		if (emit) {
			this._emit(EVENT_PER_PAGE_CHANGE, source);
			this._emit(EVENT_PAGE_CHANGE, source);
		}
		this._notify(source);
		return true;
	}

	setMeta(meta = {}) {
		if (!this._remote) return this.getState();
		this._totalRowsValue = this._nonNegativeInt(meta.total, this._totalRowsValue);
		this._totalPagesValue = this._positiveInt(meta.pages ?? meta.totalPages, Math.max(1, Math.ceil(this._totalRowsValue / this._perPage)));
		this._perPage = this._clampPerPage(meta.per_page ?? meta.perPage ?? this._perPage);
		this._page = Math.min(this._positiveInt(meta.page, this._page), this._totalPagesValue);
		this._storeState();
		this._render();
		return this.getState();
	}

	getState() {
		return {
			page: this._page,
			perPage: this._perPage,
			totalPages: this._totalPages(),
			totalRows: this._remote ? this._totalRowsValue : this._rows().length,
		};
	}

	refresh(resetPage = false) {
		if (resetPage) this._page = 1;
		this._page = this._clampPage(this._page);
		this._render();
		return this.getState();
	}

	_render() {
		if (!this._remote) {
			const rows = this._rows();
			const start = (this._page - 1) * this._perPage;
			const end = start + this._perPage;
			rows.forEach((row, index) => {
				const visible = index >= start && index < end;
				const expandHidden = row.getAttribute('data-vg-table-expand-hidden') === 'true';
				row.hidden = !visible || expandHidden;
				row.setAttribute('data-vg-table-page-row', visible ? 'visible' : 'hidden');
			});
		}

		this._renderControls();
	}

	_renderControls() {
		const markup = this._buildMarkup();
		this._disposeDropdowns();
		this._containers.forEach((container) => {
			container.className = `vg-table-pagination vg-table-pagination--${this._positionFor(container)}`;
			container.innerHTML = markup;
			this._initDropdowns(container);
		});
	}

	_buildMarkup() {
		const align = this._align();
		const size = this._options.size || {};
		const quick = this._options.quick || {};
		const labels = this._options.labels || {};
		const pages = this._buildPages();
		const sizeMarkup = size.enabled === false ? '' : this._buildSizeMarkup(size);
		const quickMarkup = this._isQuickJumpEnabled() ? `
			<label class="vg-table-pagination__quick">
				<span class="vg-table-pagination__sr-only">${quick.label || 'Перейти к странице'}</span>
				<input type="number" min="1" max="${this._totalPages()}" value="${this._page}" data-pagination-quick-input>
				<button type="button" class="vg-table-page vg-table-page--quick" data-pagination-quick-button>${quick.button || 'Перейти'}</button>
			</label>` : '';

		return `
			<div class="vg-table-pagination__inner vg-table-pagination__inner--${align}">
				${sizeMarkup}
				<nav class="vg-table-pagination__pages" aria-label="${labels.aria || 'Пагинация'}">
					<button type="button" class="vg-table-page vg-table-page--prev" data-pagination-page="prev" aria-label="${labels.prev || 'Назад'}" ${this._page <= 1 ? 'disabled' : ''}>${this._buildChevron('prev')}</button>
					${pages.map((item) => this._buildPageButton(item)).join('')}
					<button type="button" class="vg-table-page vg-table-page--next" data-pagination-page="next" aria-label="${labels.next || 'Вперёд'}" ${this._page >= this._totalPages() ? 'disabled' : ''}>${this._buildChevron('next')}</button>
				</nav>
				${quickMarkup}
			</div>`;
	}

	_buildSizeMarkup(size) {
		const options = this._sizeOptions();
		return `
			<label class="vg-table-pagination__size">
				${size.label === false ? '' : `<span class="vg-table-pagination__size-heading">${size.label || 'Строк на странице'}</span>`}
				<div class="vg-table-pagination__size-control vg-dropdown">
					<input
						type="text"
						min="1"
						max="${this._positiveInt(this._options.max, 100)}"
						step="1"
						inputmode="numeric"
						data-pagination-per-page
						data-vg-toggle="dropdown"
						value="${this._formatPerPage(this._perPage)}"
						aria-label="${size.aria || size.label || 'Строк на странице'}"
						aria-haspopup="true"
					>
					<span class="vg-table-pagination__size-chevron" aria-hidden="true">
						<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="M5 7.5L10 12.5L15 7.5" /></svg>
					</span>
					<div class="vg-dropdown-content vg-table-pagination__size-dropdown">
						<div class="vg-dropdown-container">
							${options.map((value) => `<button type="button" class="vg-table-pagination__size-option" data-pagination-per-page-option="${value}">${this._formatPerPage(value)}</button>`).join('')}
						</div>
					</div>
				</div>
			</label>`;
	}

	_buildPageButton(item) {
		if (typeof item === 'object') {
			const hover = this._options.ellipsisHover !== false;
			const labels = this._options.labels || {};
			const label = item.direction === 'prev'
				? labels.ellipsisPrev || 'Перейти к предыдущим страницам'
				: labels.ellipsisNext || 'Перейти к следующим страницам';
			return `<button type="button" class="vg-table-page vg-table-page--ellipsis${hover ? ' vg-table-page--ellipsis-hover' : ''}" data-pagination-page="ellipsis-${item.direction}" aria-label="${label}"><span class="vg-table-page__ellipsis-dots" aria-hidden="true">…</span>${hover ? this._buildEllipsisChevron(item.direction) : ''}</button>`;
		}
		const active = item === this._page;
		return `<button type="button" class="vg-table-page${active ? ' is-active' : ''}" data-pagination-page="${item}" ${active ? 'aria-current="page"' : ''}>${item}</button>`;
	}

	_buildChevron(direction) {
		const path = direction === 'prev' ? 'M12.5 4.5L7 10l5.5 5.5' : 'M7.5 4.5L13 10l-5.5 5.5';
		return `<svg class="vg-table-page__chevron" viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="${path}" /></svg>`;
	}

	_buildEllipsisChevron(direction) {
		const paths = direction === 'prev'
			? '<path d="M10.5 5L5.5 10l5 5" /><path d="M15 5l-5 5 5 5" />'
			: '<path d="M9.5 5l5 5-5 5" /><path d="M5 5l5 5-5 5" />';
		return `<svg class="vg-table-page__ellipsis-chevron vg-table-page__ellipsis-chevron--${direction}" viewBox="0 0 20 20" focusable="false" aria-hidden="true">${paths}</svg>`;
	}

	_buildPages() {
		const total = this._totalPages();
		const maxButtons = this._options.maxButtons;
		if (Number.isInteger(maxButtons) && maxButtons >= 3) return this._buildLimitedPages(total, maxButtons);
		const visible = Math.max(1, this._positiveInt(this._options.visible, 5));
		const threshold = Math.max(1, this._positiveInt(this._options.threshold, 5));
		if (this._options.ellipsis === false || total <= threshold || total <= visible + 2) {
			return this._range(1, total);
		}

		let start = Math.max(2, this._page - Math.floor(visible / 2));
		let end = Math.min(total - 1, start + visible - 1);
		start = Math.max(2, end - visible + 1);
		const pages = [1];
		if (start > 2) pages.push({direction: 'prev'});
		for (let page = start; page <= end; page += 1) pages.push(page);
		if (end < total - 1) pages.push({direction: 'next'});
		pages.push(total);
		return pages;
	}

	_buildLimitedPages(total, maximum) {
		if (total <= maximum) return this._range(1, total);
		if (maximum < 5 || this._options.ellipsis === false) {
			const start = Math.max(1, Math.min(this._page - Math.floor(maximum / 2), total - maximum + 1));
			return this._range(start, start + maximum - 1);
		}
		// Резервируем края и подбираем наибольшее окно, учитывая оба многоточия в лимите.
		for (let count = maximum - 2; count >= 1; count -= 1) {
			const start = Math.max(2, Math.min(this._page - Math.floor(count / 2), total - count));
			const end = start + count - 1;
			const pages = [1];
			if (start === 3) pages.push(2);
			else if (start > 3) pages.push({direction: 'prev'});
			pages.push(...this._range(start, end));
			if (end === total - 2) pages.push(total - 1);
			else if (end < total - 2) pages.push({direction: 'next'});
			pages.push(total);
			if (pages.length <= maximum) return pages;
		}
		return [this._page];
	}

	_handleClick(event) {
		const sizeOption = event.target.closest('[data-pagination-per-page-option]');
		if (sizeOption) {
			event.preventDefault();
			const value = sizeOption.getAttribute('data-pagination-per-page-option');
			this.setPerPage(value, true, 'per-page');
			this._hideDropdown(sizeOption);
			return;
		}

		const quickButton = event.target.closest('[data-pagination-quick-button]');
		if (quickButton) {
			const input = quickButton.closest('.vg-table-pagination__quick')?.querySelector('[data-pagination-quick-input]');
			this.setPage(input?.value, true, 'quick');
			return;
		}

		const button = event.target.closest('[data-pagination-page]');
		if (!button || button.disabled) return;
		const value = button.getAttribute('data-pagination-page');
		if (value === 'prev') return void this.setPage(this._page - 1, true, 'prev');
		if (value === 'next') return void this.setPage(this._page + 1, true, 'next');
		if (value === 'ellipsis-prev') return void this.setPage(this._ellipsisTarget('prev'), true, 'ellipsis');
		if (value === 'ellipsis-next') return void this.setPage(this._ellipsisTarget('next'), true, 'ellipsis');
		this.setPage(value, true, 'page');
	}

	_handleChange(event) {
		const input = event.target.closest('[data-pagination-per-page]');
		if (input) this._applyPerPageInput(input);
	}

	_handleKeydown(event) {
		const sizeInput = event.target.closest('[data-pagination-per-page]');
		if (sizeInput && event.key === 'Escape') {
			this._hideDropdown(sizeInput);
			sizeInput.blur();
			return;
		}
		if (sizeInput && event.key === 'Enter') {
			event.preventDefault();
			this._applyPerPageInput(sizeInput);
			return;
		}

		if (event.key !== 'Enter') return;
		const input = event.target.closest('[data-pagination-quick-input]');
		if (!input) return;
		event.preventDefault();
		this.setPage(input.value, true, 'quick');
	}

	_handleFocusIn(event) {
		const input = event.target.closest('[data-pagination-per-page]');
		if (input) input.value = String(this._perPage);
	}

	_handleFocusOut(event) {
		if (this._updatingPresentation) return;
		const input = event.target.closest('[data-pagination-per-page]');
		if (!input) return;
		const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
		const control = input.closest('.vg-table-pagination__size-control');
		if (control && related && control.contains(related)) return;
		this._applyPerPageInput(input);
	}

	_applyPerPageInput(input) {
		this.setPerPage(input.value, true, 'per-page');
		input.value = this._formatPerPage(this._perPage);
	}

	_emit(name, source) {
		EventHandler.trigger(this._table, name, Object.assign(this.getState(), {source}));
	}

	_notify(source) {
		if (typeof this._options.onChange !== 'function') return;
		this._options.onChange(Object.assign(this.getState(), {source}));
	}

	_resolveContainers() {
		if (!this._host) return [];
		const position = this._position();
		const existing = Array.from(this._host.querySelectorAll('[data-vg-table-pagination]'));
		if (existing.length) {
			const selected = position === 'both' ? existing : [existing.find((item) => item.getAttribute('data-position') === position) || existing[0]];
			if (this._manageExternalVisibility) existing.forEach((container) => {
				if (!this._externalVisibility.has(container)) this._externalVisibility.set(container, container.hidden);
				container.hidden = !selected.includes(container);
			});
			return selected;
		}

		const positions = position === 'both' ? ['top', 'bottom'] : [position];
		const tableAnchor = this._table.closest('.vg-table-container') || this._table;
		return positions.map((item) => {
			const container = document.createElement('div');
			container.setAttribute(GENERATED_ATTRIBUTE, '');
			container.setAttribute('data-position', item);
			if (item === 'top') this._host.insertBefore(container, tableAnchor);
			else this._host.insertBefore(container, tableAnchor.nextSibling);
			return container;
		});
	}

	_rows() {
		return Array.from(this._table.tBodies || [])
			.flatMap((body) => Array.from(body.rows || []))
			.filter((row) => !row.hasAttribute('data-vg-table-filter-hidden') && !row.hasAttribute('data-vg-table-state-row'));
	}

	_totalPages() {
		if (this._remote) return Math.max(1, this._totalPagesValue);
		return Math.max(1, Math.ceil(this._rows().length / this._perPage));
	}

	_clampPage(value) {
		return Math.min(this._positiveInt(value, 1), this._totalPages());
	}

	_clampPerPage(value) {
		const maximum = this._positiveInt(this._options.max, 100);
		return Math.min(this._positiveInt(value, 10), maximum);
	}

	_sizeOptions() {
		const size = this._options.size || {};
		const source = Array.isArray(size.options) ? size.options : [10, 25, 50, 100];
		const values = source.map((value) => this._clampPerPage(value)).filter((value) => value > 0);
		values.push(this._perPage);
		return Array.from(new Set(values)).sort((left, right) => left - right);
	}

	_formatPerPage(value) {
		const suffix = String((this._options.size || {}).suffix || 'на страницу').trim();
		return suffix ? `${this._positiveInt(value, this._perPage)} / ${suffix}` : String(this._positiveInt(value, this._perPage));
	}

	_initDropdowns(container) {
		container.querySelectorAll('[data-pagination-per-page][data-vg-toggle="dropdown"]').forEach((toggle) => {
			const instance = VGDropdown.init(toggle, {
				placement: 'auto',
				hover: false,
				animation: {fade: true, enable: false, delay: 120},
			});
			this._dropdowns.push({toggle, instance});
		});
	}

	_disposeDropdowns() {
		this._dropdowns.forEach(({instance}) => instance?.dispose?.());
		this._dropdowns = [];
	}

	_dropdownFor(node) {
		const control = node.closest('.vg-table-pagination__size-control');
		const toggle = control?.querySelector('[data-pagination-per-page]');
		return this._dropdowns.find((item) => item.toggle === toggle)?.instance || null;
	}

	_hideDropdown(node) {
		this._dropdownFor(node)?.hide?.();
	}

	_position() {
		const value = String(this._options.position || 'bottom').toLowerCase();
		return ['top', 'bottom', 'both'].includes(value) ? value : 'bottom';
	}

	_positionFor(container) {
		return container.getAttribute('data-position') || this._position().replace('both', 'bottom');
	}

	_align() {
		const value = String(this._options.align || 'right').toLowerCase();
		return ['left', 'center', 'right', 'between'].includes(value) ? value : 'right';
	}

	_isQuickJumpEnabled() {
		const enabled = (this._options.quick || {}).enabled;
		if (enabled === 'auto') return this._totalPages() > this._positiveInt(this._options.threshold, 5);
		return enabled === true;
	}

	_ellipsisTarget(direction) {
		const numeric = this._buildPages().filter(Number.isInteger);
		if (direction === 'prev') return Math.max(1, (numeric[1] || 2) - 1);
		return Math.min(this._totalPages(), (numeric[numeric.length - 2] || this._totalPages() - 1) + 1);
	}

	_scroll() {
		const mode = this._options.scroll;
		if (!mode || mode === false || typeof window === 'undefined') return;
		if (mode === 'window') {
			window.scrollTo?.({top: 0, behavior: 'smooth'});
			return;
		}
		this._host?.scrollIntoView?.({block: 'start', behavior: 'smooth'});
	}

	_storageKey() {
		const explicit = String((this._options.storage || {}).key || '').trim();
		if (explicit) return explicit;
		if (this._table.id) return `vg:table:pagination:${this._table.id}`;
		const path = typeof window !== 'undefined' ? window.location.pathname : '';
		const tables = Array.from(document.querySelectorAll('[data-vg-table]'));
		const index = Math.max(0, tables.indexOf(this._table));
		return `vg:table:pagination:${path}:${index}`;
	}

	_restoreState() {
		if (typeof window === 'undefined' || !window.localStorage) return;
		const persist = this._options.persist || {};
		if (persist.page !== true && persist.per !== true) return;
		try {
			const saved = JSON.parse(window.localStorage.getItem(this._storageKey()) || '{}');
			const savedPage = this._positiveInt(saved.page, 0);
			const savedPerPage = this._positiveInt(saved.perPage, 0);
			if (persist.page === true && savedPage > 0) this._page = savedPage;
			if (persist.per === true && savedPerPage > 0) this._perPage = this._clampPerPage(savedPerPage);
		} catch (_) {}
	}

	_storeState() {
		if (typeof window === 'undefined' || !window.localStorage) return;
		const persist = this._options.persist || {};
		if (persist.page !== true && persist.per !== true) return;
		const state = {};
		if (persist.page === true) state.page = this._page;
		if (persist.per === true) state.perPage = this._perPage;
		try {
			window.localStorage.setItem(this._storageKey(), JSON.stringify(state));
		} catch (_) {}
	}

	_positiveInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
	}

	_nonNegativeInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
	}

	_range(start, end) {
		const values = [];
		for (let value = start; value <= end; value += 1) values.push(value);
		return values;
	}
}

export default _pagination;
