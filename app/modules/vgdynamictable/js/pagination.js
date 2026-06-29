import VGDropdown from "../../vgdropdown";

class Pagination {
	constructor(el, params = {}) {
		if (!el || !(el instanceof Element)) {
			throw new Error('Pagination requires a valid root element');
		}

		const defaults = {
			markupSelector: '[data-vgdt-pagination], .vgdt-pagination',
			perPageOptionSuffix: 'page',
			showPerPageLabel: false,
			perPageLabel: 'Строк на странице',
			prevLabel: 'Назад',
			nextLabel: 'Вперед',
			quickJumpButtonLabel: 'Перейти',
			container: null,
			maxPerPage: 100,
		};

		this._root = el;
		this._params = Object.assign({}, defaults, params);

		this._maxPerPage = this._resolveMaxPerPage();
		this._state = {
			page: this._normalizeInt(this._params.page, 1),
			perPage: this._normalizePerPage(this._params.perPage, 10),
			totalPages: this._normalizeInt(this._params.totalPages, 1),
		};

		this._containers = [];
		this._lastMarkupByContainer = new WeakMap();
		this._boundContainerClick = this._handleContainerClick.bind(this);
		this._boundContainerChange = this._handleContainerChange.bind(this);
		this._boundContainerKeyDown = this._handleContainerKeyDown.bind(this);
		this._boundContainerFocusIn = this._handleContainerFocusIn.bind(this);
		this._boundContainerBlur = this._handleContainerBlur.bind(this);
		this._dropdownInstances = new WeakMap();
	}

	init() {
		this._containers = this._resolveContainers();
		if (!this._containers.length) return;
		this._render();
		this._bindEvents();
	}

	setMeta(meta = {}) {
		let changed = false;
		if (meta.page !== undefined) {
			const nextPage = this._normalizeInt(meta.page, this._state.page);
			if (nextPage !== this._state.page) {
				this._state.page = nextPage;
				changed = true;
			}
		}
		if (meta.perPage !== undefined) {
			const nextPerPage = this._normalizePerPage(meta.perPage, this._state.perPage);
			if (nextPerPage !== this._state.perPage) {
				this._state.perPage = nextPerPage;
				changed = true;
			}
		}
		if (meta.totalPages !== undefined) {
			const nextTotalPages = this._normalizeInt(meta.totalPages, this._state.totalPages);
			if (nextTotalPages !== this._state.totalPages) {
				this._state.totalPages = nextTotalPages;
				changed = true;
			}
		}
		const clampedPage = this._clampPage(this._state.page);
		if (clampedPage !== this._state.page) {
			this._state.page = clampedPage;
			changed = true;
		}
		if (!changed) {
			return;
		}
		this._render();
	}

	_resolveContainers() {
		const mode = this._resolveRenderMode();
		const found = this._findMarkupContainers();
		if (mode === 'markup') return found;
		if (mode === 'auto' && found.length) return found;
		return this._createClassContainers();
	}

	_resolveRenderMode() {
		const render = (this._params.renderMode || this._params.render || 'auto').toString().toLowerCase();
		if (render === 'class') return 'class';
		if (render === 'markup') return 'markup';
		return 'auto';
	}

	_findMarkupContainers() {
		if (this._params.container instanceof Element) {
			return [this._params.container];
		}
		if (typeof this._params.container === 'string' && this._params.container.trim()) {
			const scopedContainer = this._root.querySelector(this._params.container);
			if (scopedContainer) return [scopedContainer];
		}

		const list = Array.from(this._root.querySelectorAll(this._params.markupSelector || '.vgdt-pagination'));
		if (!list.length) return [];

		const position = (this._params.position || 'bottom').toString().toLowerCase();
		if (position === 'both') return list;

		const preferred = list.find((item) => item.dataset.position === position);
		return preferred ? [preferred] : [list[0]];
	}

	_createClassContainers() {
		const position = (this._params.position || 'bottom').toString().toLowerCase();
		const table = this._root.querySelector('table');
		const tableHost = table ? (table.closest('.vgdt-table-viewport') || table) : null;
		const containers = [];

		const ensure = (pos) => {
			const className = `vgdt-pagination vgdt-pagination--${pos}`;
			let container = this._root.querySelector(`.vgdt-pagination--${pos}[data-pagination-generated="1"]`);
			if (!container) {
				container = document.createElement('div');
				container.className = className;
				container.dataset.position = pos;
				container.dataset.paginationGenerated = '1';
				if (tableHost && tableHost.parentElement === this._root) {
					if (pos === 'top') {
						this._root.insertBefore(container, tableHost);
					} else {
						if (tableHost.nextSibling) {
							this._root.insertBefore(container, tableHost.nextSibling);
						} else {
							this._root.appendChild(container);
						}
					}
				} else {
					this._root.appendChild(container);
				}
			}
			containers.push(container);
		};

		if (position === 'top' || position === 'both') ensure('top');
		if (position === 'bottom' || position === 'both') ensure('bottom');
		return containers;
	}

	_bindEvents() {
		this._containers.forEach((container) => {
			container.removeEventListener('click', this._boundContainerClick);
			container.removeEventListener('change', this._boundContainerChange);
			container.removeEventListener('keydown', this._boundContainerKeyDown);
			container.removeEventListener('focusin', this._boundContainerFocusIn);
			container.removeEventListener('focusout', this._boundContainerBlur);
			container.addEventListener('click', this._boundContainerClick);
			container.addEventListener('change', this._boundContainerChange);
			container.addEventListener('keydown', this._boundContainerKeyDown);
			container.addEventListener('focusin', this._boundContainerFocusIn);
			container.addEventListener('focusout', this._boundContainerBlur);
		});
	}

	_handleContainerClick(event) {
		const perPageOption = event.target.closest('[data-per-page-option]');
		if (perPageOption) {
			event.preventDefault();
			const input = this._findPerPageInputFromNode(perPageOption);
			const value = perPageOption.getAttribute('data-per-page-option') || '';
			if (input) {
				input.value = this._formatPerPageDisplay(value);
			}
			this._applyPerPage(value);
			this._hidePerPageDropdownFromNode(perPageOption);
			return;
		}

		const perPageInput = event.target.closest('[data-per-page]');
		if (perPageInput) {
			event.preventDefault();
			event.stopPropagation();
			const toggle = this._findPerPageToggleFromNode(perPageInput);
			const dropdown = this._getOrCreatePerPageDropdown(toggle);
			if (dropdown && typeof dropdown.toggle === 'function') {
				dropdown.toggle();
			} else if (dropdown && typeof dropdown.show === 'function') {
				dropdown.show();
			}
			return;
		}

		const jumpButton = event.target.closest('[data-page-jump]');
		if (jumpButton) {
			const root = jumpButton.closest('.vgdt-pagination__jump');
			const input = root ? root.querySelector('[data-page-jump-input]') : null;
			this._jumpToPage(input ? input.value : '');
			return;
		}

		const button = event.target.closest('[data-page]');
		if (!button) return;

		const page = button.dataset.page;
		if (page === 'prev') {
			this._setPage(this._state.page - 1, 'prev');
			return;
		}
		if (page === 'next') {
			this._setPage(this._state.page + 1, 'next');
			return;
		}
		if (page === 'ellipsis-prev') {
			this._setPage(this._getEllipsisTargetPage('prev'), 'ellipsis');
			return;
		}
		if (page === 'ellipsis-next') {
			this._setPage(this._getEllipsisTargetPage('next'), 'ellipsis');
			return;
		}
		this._setPage(this._normalizeInt(page, this._state.page), 'page');
	}

	_handleContainerKeyDown(event) {
		if (event.key === 'Escape') {
			const perPageInput = event.target.closest('[data-per-page]');
			if (perPageInput) {
				this._hidePerPageDropdownFromNode(perPageInput);
				perPageInput.blur();
				return;
			}
		}

		if (event.key !== 'Enter') return;

		const perPageInput = event.target.closest('[data-per-page]');
		if (perPageInput) {
			event.preventDefault();
			this._applyPerPage(perPageInput.value);
			perPageInput.value = this._formatPerPageDisplay(this._state.perPage);
			return;
		}

		const input = event.target.closest('[data-page-jump-input]');
		if (!input) return;

		event.preventDefault();
		this._jumpToPage(input.value);
	}

	_handleContainerChange(event) {
		const input = event.target.closest('[data-per-page]');
		if (input) {
			this._applyPerPage(input.value);
			input.value = this._formatPerPageDisplay(this._state.perPage);
		}
	}

	_handleContainerFocusIn(event) {
		const input = event.target.closest('[data-per-page]');
		if (!input) {
			return;
		}
		input.value = String(this._normalizePerPage(input.value, this._state.perPage));
	}

	_handleContainerBlur(event) {
		const input = event.target.closest('[data-per-page]');
		if (!input) {
			return;
		}
		const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
		const control = input.closest('.vgdt-pagination__per-page-control');
		if (control && related && control.contains(related)) {
			return;
		}
		this._applyPerPage(input.value);
		input.value = this._formatPerPageDisplay(this._state.perPage);
	}

	_applyPerPage(value) {
		const perPage = this._normalizePerPage(value, this._state.perPage);
		const perPageChanged = perPage !== this._state.perPage;
		const pageChanged = this._state.page !== 1;
		if (!perPageChanged && !pageChanged) return;

		this._state.perPage = perPage;
		this._state.page = 1;
		this._render();
		this._emitChange(perPageChanged, 'per-page');
	}

	_setPage(page, source = 'page') {
		const normalized = this._clampPage(page);
		if (normalized === this._state.page) return;
		this._state.page = normalized;
		this._render();
		this._emitChange(false, source);
	}

	_emitChange(perPageChanged, source = 'page') {
		const payload = {
			page: this._state.page,
			perPage: this._state.perPage,
			totalPages: this._state.totalPages,
			perPageChanged: Boolean(perPageChanged),
			source,
		};

		const onChange = this._params.onChange;
		if (typeof onChange === 'function') {
			onChange(payload);
		}
		const onPerPageChange = this._params.onPerPageChange;
		if (perPageChanged && typeof onPerPageChange === 'function') {
			onPerPageChange(payload);
		}

		this._root.dispatchEvent(new CustomEvent('vgdt:pagination:change', {
			bubbles: true,
			detail: payload,
		}));
	}

	_render() {
		const pages = this._buildPages();
		const markup = this._buildMarkup(pages);
		this._containers.forEach((container) => {
			const lastMarkup = this._lastMarkupByContainer.get(container) || '';
			if (lastMarkup === markup) {
				return;
			}
			container.innerHTML = markup;
			this._lastMarkupByContainer.set(container, markup);
			this._initPerPageDropdown(container);
		});
	}

	_buildMarkup(pages) {
		const align = this._resolveAlign();
		const alignStyle = this._resolveAlignStyle(align);
		const prevDisabled = this._state.page <= 1 ? 'disabled' : '';
		const nextDisabled = this._state.page >= this._state.totalPages ? 'disabled' : '';
		const showPerPage = this._params.showPerPage;
		const perPageHtml = showPerPage ? this._buildPerPageMarkup() : '';
		const quickJumpHtml = this._shouldShowQuickJump()
			? this._buildQuickJumpMarkup()
			: '';

		return `
			<div class="vgdt-pagination__inner vgdt-pagination__inner--${align}" style="display:flex;align-items:center;justify-content:${alignStyle};gap:12px;flex-wrap:wrap;">
				${perPageHtml}
				<nav class="vgdt-pagination__pages" aria-label="Pagination">
					<button type="button" class="vgdt-page vgdt-page--prev" data-page="prev" ${prevDisabled}>${this._params.prevLabel}</button>
					${pages.map((item) => this._buildPageItem(item)).join('')}
					<button type="button" class="vgdt-page vgdt-page--next" data-page="next" ${nextDisabled}>${this._params.nextLabel}</button>
				</nav>
				${quickJumpHtml}
			</div>
		`;
	}

	_buildPerPageMarkup() {
		const options = this._normalizePerPageOptions();
		const showLabel = this._isPerPageLabelVisible();
		const perPageLabelMarkup = showLabel ? `<span>${this._params.perPageLabel}</span>` : '';
		return `
			<label class="vgdt-pagination__per-page">
				${perPageLabelMarkup}
				<div class="vgdt-pagination__per-page-control vg-dropdown">
					<input
						type="text"
						min="1"
						max="${this._maxPerPage}"
						step="1"
						inputmode="numeric"
						data-per-page
						data-toggle="dropdown"
						value="${this._formatPerPageDisplay(this._state.perPage)}"
						aria-label="${this._params.perPageLabel}"
						aria-haspopup="true"
					>
					<span class="vgdt-pagination__per-page-chevron" aria-hidden="true">
						<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
							<path d="M5 7.5L10 12.5L15 7.5" />
						</svg>
					</span>
					<div class="vg-dropdown-content vgdt-pagination__per-page-dropdown">
						<div class="vg-dropdown-container">
							${options.map((value) => {
								return `<button type="button" class="vgdt-pagination__per-page-option" data-per-page-option="${value}">${this._formatPerPageDisplay(value)}</button>`;
							}).join('')}
						</div>
					</div>
				</div>
			</label>
		`;
	}

	_isPerPageLabelVisible() {
		const table = this._root ? this._root.querySelector('table') : null;
		const attr = table
			? table.getAttribute('data-pagination-show-per-page-label')
			: null;
		if (attr !== null) {
			const normalized = String(attr).toLowerCase().trim();
			return normalized !== 'false' && normalized !== '0';
		}

		return Boolean(this._params.showPerPageLabel);
	}

	_buildPageItem(item) {
		if (item && typeof item === 'object' && item.type === 'ellipsis') {
			const isPrev = item.direction === 'prev';
			const pageAction = isPrev ? 'ellipsis-prev' : 'ellipsis-next';
			const chevron = isPrev ? '&laquo;' : '&raquo;';
			const targetPage = this._getEllipsisTargetPage(item.direction);
			const jumpStep = Math.abs(targetPage - this._state.page);
			const label = isPrev
				? `Go back ${jumpStep} page${jumpStep > 1 ? 's' : ''}`
				: `Go forward ${jumpStep} page${jumpStep > 1 ? 's' : ''}`;
			return `<button type="button" class="vgdt-page vgdt-page--ellipsis" data-page="${pageAction}" aria-label="${label}"><span class="vgdt-ellipsis-dots" aria-hidden="true">...</span><span class="vgdt-ellipsis-chevron" aria-hidden="true">${chevron}</span></button>`;
		}
		const active = item === this._state.page ? 'is-active' : '';
		return `<button type="button" class="vgdt-page ${active}" data-page="${item}" aria-current="${active ? 'page' : 'false'}">${item}</button>`;
	}

	_buildQuickJumpMarkup() {
		return `
			<div class="vgdt-pagination__jump">
				<input
					type="number"
					min="1"
					max="${this._state.totalPages}"
					step="1"
					inputmode="numeric"
					data-page-jump-input
					value="${this._state.page}"
				>
				<button type="button" class="vgdt-page vgdt-page--jump" data-page-jump>${this._params.quickJumpButtonLabel || 'Go'}</button>
			</div>
		`;
	}

	_buildPages() {
		const total = this._state.totalPages;
		const current = this._clampPage(this._state.page);
		const maxVisible = Math.max(1, this._normalizeInt(this._params.maxVisiblePages, 5));
		const shouldEllipsis = Boolean(this._params.ellipsis) && total > this._normalizeInt(this._params.ellipsisAfter, 5);

		if (!shouldEllipsis || total <= maxVisible + 2) {
			return this._range(1, total);
		}

		const middleSlots = maxVisible;
		let start = Math.max(2, current - Math.floor(middleSlots / 2));
		let end = Math.min(total - 1, start + middleSlots - 1);

		start = Math.max(2, end - middleSlots + 1);

		const pages = [1];
		if (start > 2) pages.push({ type: 'ellipsis', direction: 'prev' });
		for (let page = start; page <= end; page += 1) {
			pages.push(page);
		}
		if (end < total - 1) pages.push({ type: 'ellipsis', direction: 'next' });
		pages.push(total);
		return pages;
	}

	_findPerPageInputFromNode(node) {
		const root = node ? node.closest('.vgdt-pagination__per-page-control') : null;
		return root ? root.querySelector('[data-per-page]') : null;
	}

	_findPerPageToggleFromNode(node) {
		const root = node ? node.closest('.vgdt-pagination__per-page-control') : null;
		return root ? root.querySelector('[data-per-page][data-toggle="dropdown"]') : null;
	}

	_getOrCreatePerPageDropdown(toggle) {
		if (!toggle) {
			return null;
		}
		let instance = this._dropdownInstances.get(toggle);
		if (instance) {
			return instance;
		}
		instance = VGDropdown.getOrCreateInstance(toggle, {
			placement: 'auto',
			hover: false,
			animation: {
				fade: true,
				enable: false,
				delay: 120,
			},
		});
		this._dropdownInstances.set(toggle, instance);
		return instance;
	}

	_initPerPageDropdown(container) {
		const toggle = container.querySelector('.vgdt-pagination__per-page-control [data-toggle="dropdown"]');
		if (!toggle) {
			return;
		}
		this._getOrCreatePerPageDropdown(toggle);
	}

	_hidePerPageDropdownFromNode(node) {
		const toggle = this._findPerPageToggleFromNode(node);
		if (!toggle) {
			return;
		}
		const dropdown = this._dropdownInstances.get(toggle);
		if (dropdown && typeof dropdown.hide === 'function') {
			dropdown.hide();
		}
	}

	_shouldShowQuickJump() {
		if (this._state.totalPages <= 1) return false;

		const mode = this._params.quickJump;
		if (mode === true || mode === 'true') return true;
		if (mode === false || mode === 'false') return false;

		const threshold = this._normalizeInt(this._params.ellipsisAfter, 5);
		return this._state.totalPages > threshold;
	}

	_resolveAlign() {
		const value = (this._params.align || 'left').toString().toLowerCase();
		if (value === 'center' || value === 'right' || value === 'between') return value;
		return 'left';
	}

	_resolveAlignStyle(align) {
		if (align === 'center') return 'center';
		if (align === 'right') return 'flex-end';
		if (align === 'between') return 'space-between';
		return 'flex-start';
	}

	_normalizePerPageOptions() {
		const list = this._params.perPageOptions;
		const options = Array.isArray(list) ? list : [10, 25, 50, 100];
		const normalized = options
			.map((item) => this._normalizeInt(item, 0))
			.filter((item) => item > 0 && item <= this._maxPerPage);
		if (!normalized.length) return [this._state.perPage];
		if (!normalized.includes(this._state.perPage)) normalized.push(this._state.perPage);
		return Array.from(new Set(normalized)).sort((a, b) => a - b);
	}

	_resolveMaxPerPage() {
		const raw = this._params.maxPerPage;
		return this._normalizeInt(raw, 100);
	}

	_normalizePerPage(value, fallback) {
		const normalized = this._normalizeInt(value, fallback);
		return Math.min(normalized, this._maxPerPage);
	}

	_getPerPageOptionSuffix() {
		const rawSuffix = this._params.perPageOptionSuffix;
		const normalized = String(rawSuffix || '').trim();
		if (normalized) {
			return normalized;
		}
		const label = String(this._params.perPageLabel || '').toLowerCase();
		return /[а-яё]/i.test(label) ? 'на страницу' : 'page';
	}

	_formatPerPageDisplay(value) {
		const normalizedValue = this._normalizeInt(value, this._state.perPage);
		return `${normalizedValue} / ${this._getPerPageOptionSuffix()}`;
	}

	_clampPage(page) {
		const normalized = this._normalizeInt(page, 1);
		return Math.max(1, Math.min(normalized, this._state.totalPages));
	}

	_normalizeInt(value, fallback) {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
	}

	_jumpToPage(value) {
		const page = this._normalizeInt(value, this._state.page);
		this._setPage(page, 'jump');
	}

	_getEllipsisTargetPage(direction) {
		const pages = this._buildPages();
		const visibleNumericPages = pages.filter((item) => Number.isInteger(item) && item > 1 && item < this._state.totalPages);
		if (!visibleNumericPages.length) {
			return direction === 'prev' ? 1 : this._state.totalPages;
		}
		const firstVisible = visibleNumericPages[0];
		const lastVisible = visibleNumericPages[visibleNumericPages.length - 1];
		if (direction === 'prev') {
			return this._clampPage(firstVisible - 1);
		}
		return this._clampPage(lastVisible + 1);
	}

	_range(start, end) {
		const result = [];
		for (let value = start; value <= end; value += 1) {
			result.push(value);
		}
		return result;
	}
}

export default Pagination

