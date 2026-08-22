/**
 * Описание: разметка Fixed Header с отдельными слоями заголовка и тела VGTable.
 * Возможности: перенос настоящего thead без клона, синхронизация колонок и горизонтальной прокрутки.
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
		this._boundScroll = this._syncScroll.bind(this);
		this._boundResize = this.refresh.bind(this);
		this._boundPageScroll = this._syncStickyState.bind(this);
	}

	init() {
		if (!this._wrapper || !this._container || !this._head) return this;

		const widths = this._measureColumns();
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
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', this._boundResize);
			if (this._params.mode === 'page') window.addEventListener('scroll', this._boundPageScroll, {passive: true});
		}
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

		const widths = this._measureBodyColumns();
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
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', this._boundResize);
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
		const row = this._element.tBodies[0]?.rows[0] || this._head.rows[this._head.rows.length - 1];
		return this._measureRow(row);
	}

	_measureBodyColumns() {
		const row = this._element.tBodies[0]?.rows[0];
		const widths = this._measureRow(row);
		return widths.some((width) => width > 0) ? widths : this._measureRow(this._head.rows[this._head.rows.length - 1]);
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
		colgroup.replaceChildren(...widths.map((width) => {
			const col = table.ownerDocument.createElement('col');
			if (width > 0) col.style.width = `${width}px`;
			return col;
		}));
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
