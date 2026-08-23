/**
 * Описание: разметка Fixed Header с отдельными слоями заголовка и тела VGTable.
 * Возможности: перенос настоящего thead без клона, автоматическая синхронизация ширин колонок и горизонтальной прокрутки.
 */

const MODE_CLASSES = ['vg-table-wrapper--sticky-container', 'vg-table-wrapper--sticky-page'];
const CONTAINER_MODE_CLASSES = ['vg-table-container--sticky-container', 'vg-table-container--sticky-page'];
const STYLE_PROPERTIES = ['--vg-table-sticky-top', '--vg-table-sticky-max-height'];
const GENERATED_LAYER_ATTRIBUTE = 'data-vg-table-sticky-generated';

class _stickyHeader {
	constructor(element, wrapper, container, params = {}) {
		this._element = element;
		this._wrapper = wrapper;
		this._container = container;
		this._params = params;
		this._head = element.tHead;
		this._header = null;
		this._headerTable = null;
		this._body = null;
		this._previousClasses = new Map();
		this._previousContainerClasses = new Map();
		this._previousStyles = new Map();
		this._columnWeights = new Map();
		this._hardColumnWidths = new Map();
		this._hasSourceColgroup = false;
		this._resizeObserver = null;
		this._resizeFrame = null;
		this._boundScroll = this._syncScroll.bind(this);
		this._boundResize = this._scheduleRefresh.bind(this);
		this._boundPageScroll = this._syncStickyState.bind(this);
	}

	init() {
		if (!this._wrapper || !this._container || !this._head) return this;

		const widths = this._measureColumns();
		this._rememberColumnGeometry(widths);
		MODE_CLASSES.forEach((className) => this._previousClasses.set(className, this._wrapper.classList.contains(className)));
		CONTAINER_MODE_CLASSES.forEach((className) => this._previousContainerClasses.set(className, this._container.classList.contains(className)));
		STYLE_PROPERTIES.forEach((property) => this._previousStyles.set(property, this._container.style.getPropertyValue(property)));

		this._wrapper.classList.add(`vg-table-wrapper--sticky-${this._params.mode}`);
		this._container.classList.add(`vg-table-container--sticky-${this._params.mode}`);
		if (this._params.top !== null && String(this._params.top).trim() !== '') {
			this._container.style.setProperty('--vg-table-sticky-top', this._toCssLength(this._params.top, '0px'));
		}
		this._container.style.setProperty('--vg-table-sticky-max-height', this._toCssLength(this._params.maxHeight, '24rem'));
		this._element.setAttribute('data-vg-table-sticky-header', this._params.mode);

		this._buildLayers(widths);
		this._body.addEventListener('scroll', this._boundScroll, {passive: true});
		if (typeof ResizeObserver !== 'undefined') {
			this._resizeObserver = new ResizeObserver(this._boundResize);
			this._resizeObserver.observe(this._container);
			this._resizeObserver.observe(this._body);
		} else if (typeof window !== 'undefined') {
			window.addEventListener('resize', this._boundResize);
		}
		if (this._params.mode === 'page' && typeof window !== 'undefined') window.addEventListener('scroll', this._boundPageScroll, {passive: true});
		this.refresh();
		return this;
	}

	getHeaderTable() {
		return this._headerTable || this._element;
	}

	getBody() {
		return this._body;
	}

	syncScroll() {
		this._syncScroll();
		return this;
	}

	refresh() {
		if (!this._header || !this._headerTable || !this._body) return this;

		const widths = this._resolveLayoutWidths();
		this._applyColgroup(this._headerTable, widths);
		this._applyColgroup(this._element, widths);
		const scrollbar = Math.max(0, this._body.offsetWidth - this._body.clientWidth);
		this._header.style.paddingInlineEnd = `${scrollbar}px`;
		this._header.style.setProperty('--vg-table-sticky-scrollbar-width', `${scrollbar}px`);
		this._header.classList.toggle('vg-table-header--scrollbar', scrollbar > 0);
		this._container.classList.toggle('vg-table-container--scrollbar', scrollbar > 0);
		this._syncScroll();
		this._syncStickyState();
		return this;
	}

	dispose() {
		if (this._body) this._body.removeEventListener('scroll', this._boundScroll);
		this._resizeObserver?.disconnect();
		if (this._resizeFrame !== null && typeof cancelAnimationFrame === 'function') {
			cancelAnimationFrame(this._resizeFrame);
			this._resizeFrame = null;
		}
		if (typeof window !== 'undefined') {
			if (!this._resizeObserver) window.removeEventListener('resize', this._boundResize);
			window.removeEventListener('scroll', this._boundPageScroll);
		}
		this._header?.classList.remove('is-stuck');
		if (this._head && this._headerTable?.contains(this._head)) this._element.prepend(this._head);
		this._header?.remove();
		this._container?.classList.remove('vg-table-container--scrollbar');
		if (this._body?.contains(this._element)) this._body.before(this._element);
		this._body?.remove();
		this._element.querySelector(':scope > colgroup[data-vg-table-sticky-colgroup]')?.remove();

		MODE_CLASSES.forEach((className) => {
			this._wrapper.classList.toggle(className, this._previousClasses.get(className) === true);
		});
		CONTAINER_MODE_CLASSES.forEach((className) => {
			this._container.classList.toggle(className, this._previousContainerClasses.get(className) === true);
		});
		STYLE_PROPERTIES.forEach((property) => {
			const previous = this._previousStyles.get(property);
			if (previous) this._container.style.setProperty(property, previous);
			else this._container.style.removeProperty(property);
		});
		this._element.removeAttribute('data-vg-table-sticky-header');
	}

	_scheduleRefresh() {
		if (this._resizeFrame !== null) return;
		if (typeof requestAnimationFrame !== 'function') {
			this.refresh();
			return;
		}
		this._resizeFrame = requestAnimationFrame(() => {
			this._resizeFrame = null;
			this.refresh();
		});
	}

	_buildLayers(widths) {
		this._header = this._element.ownerDocument.createElement('div');
		this._header.className = 'vg-table-header';
		this._header.setAttribute(GENERATED_LAYER_ATTRIBUTE, '');
		this._headerTable = this._element.ownerDocument.createElement('table');
		this._headerTable.className = `${this._element.className} vg-table-header__table`;
		this._headerTable.style.cssText = this._element.style.cssText;
		this._headerTable.removeAttribute('data-vg-table');
		const sourceColgroup = this._element.querySelector(':scope > colgroup:not([data-vg-table-sticky-colgroup])');
		if (sourceColgroup) this._headerTable.append(sourceColgroup.cloneNode(true));
		else this._applyColgroup(this._headerTable, widths);
		this._headerTable.append(this._head);
		this._header.append(this._headerTable);

		this._body = this._element.ownerDocument.createElement('div');
		this._body.className = 'vg-table-body';
		this._body.setAttribute(GENERATED_LAYER_ATTRIBUTE, '');
		this._applyColgroup(this._element, widths);
		this._element.before(this._header, this._body);
		this._body.append(this._element);
	}

	_measureColumns() {
		return this._measureBodyColumns();
	}

	_measureBodyColumns() {
		const headerRow = this._head?.rows[this._head.rows.length - 1];
		const headerWidths = this._measureRow(headerRow);
		const rows = Array.from(this._element.tBodies || []).flatMap((body) => Array.from(body.rows || []));
		for (const row of rows) {
			if (row.hidden || row.hasAttribute('data-vg-table-state-row') || row.hasAttribute('data-vg-table-skeleton') || row.hasAttribute('data-vg-table-skeleton-row')) continue;
			if (row.querySelector('[data-vg-table-state]')) continue;
			const widths = this._measureRow(row);
			if (widths.length === headerWidths.length && widths.some((width) => width > 0)) return widths;
		}
		return headerWidths;
	}

	_measureRow(row) {
		if (!row) return [];
		return Array.from(row.cells).flatMap((cell) => {
			const span = Math.max(1, cell.colSpan || 1);
			const width = cell.getBoundingClientRect().width / span;
			return Array.from({length: span}, () => width);
		});
	}

	_applyColgroup(table, widths) {
		if (!widths.length) return;
		if (table.querySelector(':scope > colgroup:not([data-vg-table-sticky-colgroup])')) return;
		let colgroup = table.querySelector(':scope > colgroup[data-vg-table-sticky-colgroup]');
		if (!colgroup) {
			colgroup = table.ownerDocument.createElement('colgroup');
			colgroup.setAttribute('data-vg-table-sticky-colgroup', '');
			table.prepend(colgroup);
		}
		while (colgroup.children.length < widths.length) colgroup.append(table.ownerDocument.createElement('col'));
		while (colgroup.children.length > widths.length) colgroup.lastElementChild.remove();
		const headers = this._getHeaders();
		widths.forEach((width, index) => {
			const col = colgroup.children[index];
			if (width > 0) col.style.width = `${width}px`;
			else col.style.removeProperty('width');
			const hidden = headers[index]?.hidden === true;
			col.hidden = hidden;
			col.toggleAttribute('data-vg-table-column-hidden', hidden);
		});
	}

	_rememberColumnGeometry(widths) {
		const headers = this._getHeaders();
		const sourceCols = Array.from(this._element.querySelector(':scope > colgroup:not([data-vg-table-sticky-colgroup])')?.children || []);
		this._hasSourceColgroup = sourceCols.length > 0;
		headers.forEach((header, index) => {
			const key = this._columnKey(header, index);
			this._columnWeights.set(key, widths[index] > 0 ? widths[index] : 1);
			if (this._hasDeclaredWidth(header) || this._hasDeclaredWidth(sourceCols[index])) {
				this._hardColumnWidths.set(key, widths[index] > 0 ? widths[index] : 0);
			}
		});
	}

	_resolveLayoutWidths() {
		const headers = this._getHeaders();
		const measured = this._measureBodyColumns();
		if (this._hasSourceColgroup || !headers.length) return measured;

		const bodyRow = Array.from(this._element.tBodies || [])
			.flatMap((body) => Array.from(body.rows || []))
			.find((row) => !row.hidden && !row.hasAttribute('data-vg-table-state-row'));
		const hard = new Map();
		const flexible = [];
		headers.forEach((header, index) => {
			const key = this._columnKey(header, index);
			const bodyCell = bodyRow?.cells[index];
			if (this._hasDeclaredWidth(header) || this._hasDeclaredWidth(bodyCell) || this._hardColumnWidths.has(key)) {
				const declared = this._readDeclaredPixelWidth(header) || this._readDeclaredPixelWidth(bodyCell);
				const width = declared || this._hardColumnWidths.get(key) || measured[index] || 0;
				this._hardColumnWidths.set(key, width);
				hard.set(index, width);
			} else {
				flexible.push(index);
			}
		});

		const measuredTotal = measured.reduce((total, width) => total + width, 0);
		const viewport = this._body?.clientWidth || this._container?.clientWidth || measuredTotal;
		const minimum = this._readTableMinimumWidth();
		const target = Math.max(viewport, minimum, 0);
		const hardTotal = Array.from(hard.values()).reduce((total, width) => total + width, 0);
		const available = Math.max(0, target - hardTotal);
		const widths = Array(headers.length).fill(0);
		hard.forEach((width, index) => { widths[index] = width; });

		if (!flexible.length) return widths;
		const weights = flexible.map((index) => {
			const key = this._columnKey(headers[index], index);
			return this._columnWeights.get(key) || measured[index] || 1;
		});
		const weightTotal = weights.reduce((total, weight) => total + weight, 0) || flexible.length;
		let distributed = 0;
		flexible.forEach((index, position) => {
			const width = position === flexible.length - 1
				? Math.max(0, available - distributed)
				: available * weights[position] / weightTotal;
			widths[index] = width;
			distributed += width;
		});
		return widths;
	}

	_getHeaders() {
		const rows = Array.from(this._head?.rows || []);
		return rows.length ? Array.from(rows.at(-1).cells || []) : [];
	}

	_columnKey(header, index) {
		return String(header?.getAttribute('data-field') || index).trim();
	}

	_hasDeclaredWidth(element) {
		if (!element) return false;
		return element.hasAttribute('width')
			|| element.hasAttribute('data-column-width')
			|| Boolean(element.style?.width || element.style?.minWidth || element.style?.maxWidth);
	}

	_readDeclaredPixelWidth(element) {
		if (!element || !this._hasDeclaredWidth(element)) return 0;
		const fixed = element.style?.minWidth && element.style.minWidth === element.style.maxWidth
			? Number.parseFloat(element.style.width || element.style.minWidth)
			: 0;
		if (Number.isFinite(fixed) && fixed > 0) return fixed;
		const measured = element.getBoundingClientRect?.().width || element.offsetWidth || 0;
		return measured > 0 ? measured : 0;
	}

	_readTableMinimumWidth() {
		if (typeof getComputedStyle !== 'function') return 0;
		const value = Number.parseFloat(getComputedStyle(this._element).minWidth || '0');
		return Number.isFinite(value) ? value : 0;
	}

	_syncScroll() {
		if (this._header && this._body) this._header.scrollLeft = this._body.scrollLeft;
	}

	_syncStickyState() {
		if (!this._header || this._params.mode !== 'page') return;
		const headerRect = this._header.getBoundingClientRect();
		const containerRect = this._container.getBoundingClientRect();
		const top = Number.parseFloat(window.getComputedStyle(this._header).top) || 0;
		const atStickyTop = Math.abs(headerRect.top - top) <= 1;
		const insideContainer = containerRect.top < top && containerRect.bottom > top + headerRect.height;
		this._header.classList.toggle('is-stuck', atStickyTop && insideContainer);
	}

	_toCssLength(value, fallback) {
		if (typeof value === 'number' && Number.isFinite(value)) return `${Math.max(0, value)}px`;
		const normalized = String(value ?? '').trim();
		if (!normalized) return fallback;
		if (/^\d+(?:\.\d+)?$/.test(normalized)) return `${normalized}px`;
		return normalized;
	}
}

export default _stickyHeader;
