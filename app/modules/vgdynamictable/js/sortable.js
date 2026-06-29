class Sortable {
    constructor(table, options = {}) {
        this._table = table;
        this._options = Object.assign({
            initialField: '',
            initialDir: 'asc',
            directions: ['asc', 'desc'],
            ascLabel: 'Сортировка по возрастанию',
            descLabel: 'Сортировка по убыванию',
            isColumnSortable: null,
            onChange: null,
            multiSort: false,
            multiSortWithShift: true,
            hideUnsortedArrows: false,
        }, options);

        this._headers = [];
        this._sorts = [];
        this._headerControls = new WeakMap();
        this._boundClick = this._handleClick.bind(this);
        this._boundKeyDown = this._handleKeyDown.bind(this);
    }

    init() {
        this._headers = this._getHeaders();
        if (!this._headers.length) {
            return;
        }
        this._syncControlsVisibilityMode();

        this._headers.forEach((header, index) => {
            if (!this._isSortable(header, index)) {
                header.setAttribute('aria-sort', 'none');
                return;
            }

            header.dataset.sortable = '1';
            header.tabIndex = 0;
            header.setAttribute('role', 'button');
            header.setAttribute('aria-sort', 'none');
            this._decorateHeader(header);
        });

        this._table.addEventListener('click', this._boundClick);
        this._table.addEventListener('keydown', this._boundKeyDown);
        this._applyInitialState();
    }

    setState(payload = {}) {
        if (Array.isArray(payload.sorts)) {
            const normalized = this._normalizeSorts(payload.sorts);
            this._setSorts(normalized, false);
            return;
        }

        const index = this._resolveIndex(payload);
        if (index < 0) {
            this._setSorts([], false);
            return;
        }
        if (!this._isSortable(this._headers[index], index)) {
            return;
        }
        this._setSorts([{ index, dir: this._normalizeDir(payload.dir) }], false);
    }

    refresh(payload = {}) {
        this._headers = this._getHeaders();
        if (!this._headers.length) {
            return;
        }
        this._syncControlsVisibilityMode();

        this._headers.forEach((header, index) => {
            if (!this._isSortable(header, index)) {
                header.removeAttribute('data-sortable');
                header.removeAttribute('data-sort-direction');
                header.removeAttribute('data-sort-priority');
                header.setAttribute('aria-sort', 'none');
                return;
            }

            header.dataset.sortable = '1';
            header.tabIndex = 0;
            header.setAttribute('role', 'button');
            if (!header.hasAttribute('aria-sort')) {
                header.setAttribute('aria-sort', 'none');
            }
            this._decorateHeader(header);
        });

        if (Array.isArray(payload.sorts)) {
            this._setSorts(this._normalizeSorts(payload.sorts), false);
            return;
        }

        this._setSorts(this._normalizeSorts(this._sorts), false);
    }

    _applyInitialState() {
        const index = this._resolveIndex({
            field: this._options.initialField,
            columnIndex: -1,
        });
        if (index < 0 || !this._isSortable(this._headers[index], index)) {
            this._setSorts([], false);
            return;
        }
        this._setSorts([{ index, dir: this._normalizeDir(this._options.initialDir) }], false);
    }

    _getHeaders() {
        const head = this._table.tHead || this._table.querySelector('thead');
        if (!head || !head.rows.length) {
            return [];
        }
        return Array.from(head.rows[0].cells);
    }

    _isSortable(header, index) {
        if (typeof this._options.isColumnSortable === 'function') {
            return Boolean(this._options.isColumnSortable(header, index));
        }
        return true;
    }

    _handleClick(event) {
        const header = event.target.closest('th');
        if (!header || !this._table.contains(header)) {
            return;
        }

        const index = this._headers.indexOf(header);
        if (index < 0 || !this._isSortable(header, index)) {
            return;
        }

        const arrow = event.target.closest('[data-sort-arrow]');
        const multiMode = this._isMultiMode(event);
        if (arrow && header.contains(arrow)) {
            const dir = this._normalizeDir(arrow.getAttribute('data-sort-arrow'));
            this._applyColumnDirection(index, dir, multiMode, true);
            return;
        }

        this._cycleColumn(index, multiMode);
    }

    _handleKeyDown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        const header = event.target.closest('th');
        if (!header || !this._table.contains(header)) {
            return;
        }

        const index = this._headers.indexOf(header);
        if (index < 0 || !this._isSortable(header, index)) {
            return;
        }

        event.preventDefault();
        this._cycleColumn(index, this._isMultiMode(event));
    }

    _isMultiMode(event) {
        if (!this._options.multiSort) {
            return false;
        }
        if (!this._options.multiSortWithShift) {
            return true;
        }
        return Boolean(event && event.shiftKey);
    }

    _cycleColumn(index, multiMode) {
        const current = this._sorts.find((item) => item.index === index) || null;
        const directions = this._getDirections();
        const firstDir = directions[0];
        const secondDir = directions[1] || firstDir;

        if (!current) {
            this._applyColumnDirection(index, firstDir, multiMode, true);
            return;
        }
        if (current.dir === firstDir) {
            this._applyColumnDirection(index, secondDir, multiMode, true);
            return;
        }
        this._removeColumnDirection(index, multiMode, true);
    }

    _applyColumnDirection(index, dir, multiMode, emit) {
        let next = this._sorts.slice();
        next = next.filter((item) => item.index !== index);
        if (!multiMode) {
            next = [];
        }
        next.push({ index, dir: this._normalizeDir(dir) });
        this._setSorts(next, emit);
    }

    _removeColumnDirection(index, multiMode, emit) {
        let next = this._sorts.slice();
        next = next.filter((item) => item.index !== index);
        if (!multiMode) {
            next = [];
        }
        this._setSorts(next, emit);
    }

    _setSorts(nextSorts, emit) {
        this._sorts = this._normalizeSorts(nextSorts);
        const sortByIndex = new Map();
        this._sorts.forEach((item, index) => {
            sortByIndex.set(item.index, {
                dir: item.dir,
                priority: index + 1,
            });
        });

        this._headers.forEach((header, headerIndex) => {
            const sort = sortByIndex.has(headerIndex) ? sortByIndex.get(headerIndex) : null;
            if (!this._isSortable(header, headerIndex)) {
                header.removeAttribute('data-sort-direction');
                header.removeAttribute('data-sort-priority');
                header.setAttribute('aria-sort', 'none');
                return;
            }

            const controls = this._getHeaderControls(header);
            const controlsNode = controls.controlsNode;
            const ascButton = controls.ascButton;
            const descButton = controls.descButton;
            const shouldHideControls = Boolean(this._options.hideUnsortedArrows && !sort);

            if (controlsNode) {
                controlsNode.hidden = shouldHideControls;
            }

            if (sort) {
                header.dataset.sortDirection = sort.dir;
                header.dataset.sortPriority = String(sort.priority);
                header.setAttribute('aria-sort', sort.dir === 'asc' ? 'ascending' : 'descending');
                if (ascButton) ascButton.setAttribute('aria-pressed', sort.dir === 'asc' ? 'true' : 'false');
                if (descButton) descButton.setAttribute('aria-pressed', sort.dir === 'desc' ? 'true' : 'false');
            } else {
                header.removeAttribute('data-sort-direction');
                header.removeAttribute('data-sort-priority');
                header.setAttribute('aria-sort', 'none');
                if (ascButton) ascButton.setAttribute('aria-pressed', 'false');
                if (descButton) descButton.setAttribute('aria-pressed', 'false');
            }
        });
        this._syncSortedColumnsHighlight();

        if (!emit || typeof this._options.onChange !== 'function') {
            return;
        }

        const first = this._sorts[0] || null;
        this._options.onChange({
            field: first ? this._getFieldByIndex(first.index) : '',
            dir: first ? first.dir : this._normalizeDir(this._options.initialDir),
            columnIndex: first ? first.index : -1,
            sorts: this._sorts.map((item) => ({
                field: this._getFieldByIndex(item.index),
                dir: item.dir,
                columnIndex: item.index,
            })),
        });
    }

    _normalizeSorts(items) {
        const unique = [];
        const seen = new Set();
        (Array.isArray(items) ? items : []).forEach((item) => {
            const index = Number.parseInt(item.index ?? item.columnIndex, 10);
            if (!Number.isInteger(index) || index < 0 || index >= this._headers.length) {
                return;
            }
            if (!this._isSortable(this._headers[index], index)) {
                return;
            }
            if (seen.has(index)) {
                return;
            }
            seen.add(index);
            unique.push({
                index,
                dir: this._normalizeDir(item.dir),
            });
        });
        return unique;
    }

    _syncSortedColumnsHighlight() {
        const rows = this._getAllRows();
        if (!rows.length) {
            return;
        }

        rows.forEach((row) => {
            Array.from(row.cells || []).forEach((cell) => {
                cell.removeAttribute('data-sorted-column');
                cell.removeAttribute('data-sorted-priority');
            });
        });

        this._sorts.forEach((sort, index) => {
            rows.forEach((row) => {
                const cell = row.cells && row.cells[sort.index] ? row.cells[sort.index] : null;
                if (!cell) {
                    return;
                }
                cell.setAttribute('data-sorted-column', '1');
                cell.setAttribute('data-sorted-priority', String(index + 1));
            });
        });
    }

    _getAllRows() {
        const rows = [];
        const sections = ['tHead', 'tBodies', 'tFoot'];

        sections.forEach((section) => {
            const value = this._table[section];
            if (!value) {
                return;
            }
            if (section === 'tBodies') {
                Array.from(value).forEach((body) => {
                    rows.push(...Array.from(body.rows || []));
                });
                return;
            }
            rows.push(...Array.from(value.rows || []));
        });

        return rows;
    }

    _decorateHeader(header) {
        if (header.querySelector('.vgdt-sort-controls')) {
            this._headerControls.delete(header);
            return;
        }

        const label = document.createElement('span');
        label.className = 'vgdt-sort-label';
        while (header.firstChild) {
            label.appendChild(header.firstChild);
        }

        const controls = document.createElement('span');
        controls.className = 'vgdt-sort-controls';
        controls.innerHTML = `
            <button type="button" class="vgdt-sort-arrow vgdt-sort-arrow--asc" data-sort-arrow="asc" aria-label="${this._escapeAttr(this._options.ascLabel)}" aria-pressed="false">&#9650;</button>
            <button type="button" class="vgdt-sort-arrow vgdt-sort-arrow--desc" data-sort-arrow="desc" aria-label="${this._escapeAttr(this._options.descLabel)}" aria-pressed="false">&#9660;</button>
        `;

        label.appendChild(controls);
        header.appendChild(label);
        this._headerControls.delete(header);
    }

    _getHeaderControls(header) {
        if (this._headerControls.has(header)) {
            return this._headerControls.get(header);
        }
        const controls = {
            controlsNode: header.querySelector('.vgdt-sort-controls'),
            ascButton: header.querySelector('[data-sort-arrow="asc"]'),
            descButton: header.querySelector('[data-sort-arrow="desc"]'),
        };
        this._headerControls.set(header, controls);
        return controls;
    }

    _getFieldByIndex(index) {
        const header = this._headers[index];
        if (!header) {
            return '';
        }
        return (header.getAttribute('data-field') || '').trim();
    }

    _resolveIndex(payload = {}) {
        const field = (payload.field || '').toString().trim();
        if (field) {
            const byField = this._headers.findIndex((header) => {
                return (header.getAttribute('data-field') || '').trim() === field;
            });
            if (byField >= 0) {
                return byField;
            }
        }

        const byIndex = Number.parseInt(payload.columnIndex, 10);
        if (Number.isInteger(byIndex) && byIndex >= 0 && byIndex < this._headers.length) {
            return byIndex;
        }

        return -1;
    }

    _normalizeDir(dir) {
        const normalized = String(dir).toLowerCase();
        const directions = this._getDirections();
        return directions.includes(normalized) ? normalized : directions[0];
    }

    _getDirections() {
        const list = Array.isArray(this._options.directions) ? this._options.directions : ['asc', 'desc'];
        const normalized = list
            .map((item) => String(item).toLowerCase().trim())
            .filter((item) => item === 'asc' || item === 'desc');
        return normalized.length ? Array.from(new Set(normalized)) : ['asc', 'desc'];
    }

    _syncControlsVisibilityMode() {
        if (this._options.hideUnsortedArrows) {
            this._table.setAttribute('data-sort-hide-unsorted-arrows', '1');
            return;
        }
        this._table.removeAttribute('data-sort-hide-unsorted-arrows');
    }

    _escapeAttr(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

export default Sortable;


