class Expandable {
    constructor(table, params = {}) {
        this._table = table;
        this._params = params && typeof params === 'object' ? params : {};
        this._collapsed = new Set();
        this._boundClick = this._handleClick.bind(this);
        this._initialized = false;
    }

    init() {
        if (!this._isEnabled() || this._initialized) {
            return;
        }
        this._table.addEventListener('click', this._boundClick);
        this._initialized = true;
        this.refresh();
    }

    destroy() {
        if (!this._initialized) {
            return;
        }
        this._table.removeEventListener('click', this._boundClick);
        this._initialized = false;
    }

    refresh() {
        if (!this._isEnabled()) {
            return;
        }

        const rows = this._getRows();
        if (!rows.length) {
            return;
        }

        this._resetExpandHidden(rows);
        this._rememberBaseVisibility(rows);

        const idAttr = this._getIdAttr();
        const parentAttr = this._getParentAttr();
        const rowById = new Map();
        const parentById = new Map();
        const childrenByParent = new Map();

        rows.forEach((row, index) => {
            const fallbackId = `row-${index + 1}`;
            const rowId = String(row.getAttribute(idAttr) || fallbackId).trim() || fallbackId;
            row.setAttribute(idAttr, rowId);
            rowById.set(rowId, row);

            const parentId = String(row.getAttribute(parentAttr) || '').trim();
            parentById.set(rowId, parentId);
            if (parentId) {
                if (!childrenByParent.has(parentId)) {
                    childrenByParent.set(parentId, []);
                }
                childrenByParent.get(parentId).push(rowId);
            }
        });

        const depthCache = new Map();
        const getDepth = (rowId) => {
            if (depthCache.has(rowId)) {
                return depthCache.get(rowId);
            }
            const parentId = String(parentById.get(rowId) || '').trim();
            if (!parentId) {
                depthCache.set(rowId, 0);
                return 0;
            }
            if (!rowById.has(parentId) || parentId === rowId) {
                depthCache.set(rowId, 0);
                return 0;
            }
            const depth = Math.max(0, getDepth(parentId) + 1);
            depthCache.set(rowId, depth);
            return depth;
        };

        const isAncestorCollapsed = (rowId) => {
            let parentId = String(parentById.get(rowId) || '').trim();
            while (parentId) {
                if (this._collapsed.has(parentId)) {
                    return true;
                }
                parentId = String(parentById.get(parentId) || '').trim();
            }
            return false;
        };

        rowById.forEach((row, rowId) => {
            const depth = getDepth(rowId);
            row.setAttribute('data-expand-depth', String(depth));
            row.style.setProperty('--vgdt-expand-depth', String(depth));

            const hasChildren = childrenByParent.has(rowId) && childrenByParent.get(rowId).length > 0;
            const seeded = row.getAttribute('data-expand-seeded') === '1';
            if (hasChildren && !seeded) {
                if (this._isInitiallyCollapsed(row)) {
                    this._collapsed.add(rowId);
                }
                row.setAttribute('data-expand-seeded', '1');
            }
            this._syncToggleNode(row, rowId, hasChildren);

            const baseHidden = row.getAttribute('data-expand-base-hidden') === '1';
            const collapseHidden = isAncestorCollapsed(rowId);
            const nextHidden = baseHidden || collapseHidden;
            row.hidden = nextHidden;
            if (collapseHidden) {
                row.setAttribute('data-expand-hidden', '1');
            } else {
                row.removeAttribute('data-expand-hidden');
            }
        });
    }

    _handleClick(event) {
        const toggleSelector = this._getToggleSelector();
        const rawTarget = event.target || null;
        const target = rawTarget && rawTarget.nodeType === 3 ? rawTarget.parentElement : rawTarget;
        const toggle = target && target.closest ? target.closest(toggleSelector) : null;
        if (!toggle || !this._table.contains(toggle)) {
            return;
        }
        event.preventDefault();

        const row = toggle.closest('tr');
        if (!row) {
            return;
        }
        const rowId = String(row.getAttribute(this._getIdAttr()) || '').trim();
        if (!rowId) {
            return;
        }

        const collapsed = !this._collapsed.has(rowId);
        if (collapsed) {
            this._collapsed.add(rowId);
        } else {
            this._collapsed.delete(rowId);
        }
        this.refresh();

        const payload = {
            id: rowId,
            collapsed,
            row,
        };
        if (typeof this._params.onToggle === 'function') {
            this._params.onToggle(payload);
        }
    }

    _syncToggleNode(row, rowId, hasChildren) {
        const selector = this._getToggleSelector();
        let toggle = row.querySelector(selector);
        if (!toggle && hasChildren) {
            const firstCell = row.cells && row.cells[0] ? row.cells[0] : null;
            if (firstCell) {
                toggle = document.createElement('button');
                toggle.type = 'button';
                toggle.className = 'vgdt-expand-toggle';
                toggle.setAttribute('data-expand-toggle', '1');
                firstCell.prepend(toggle);
            }
        }
        if (!toggle) {
            return;
        }

        // Keep visual spacing stable even if CSS bundle is outdated.
        toggle.style.marginInlineEnd = '10px';
        toggle.style.cursor = 'pointer';

        const nextNode = toggle.nextSibling;
        const hasLeadingSpace = nextNode
            && nextNode.nodeType === 3
            && /^\s/.test(String(nextNode.textContent || ''));
        if (!hasLeadingSpace) {
            toggle.after(document.createTextNode(' '));
        }

        toggle.setAttribute('data-expand-toggle', rowId);
        toggle.setAttribute('aria-expanded', this._collapsed.has(rowId) ? 'false' : 'true');
        toggle.hidden = !hasChildren;
        if (!hasChildren) {
            return;
        }
        const collapsed = this._collapsed.has(rowId);
        toggle.textContent = collapsed ? '+' : '−';
    }

    _getRows() {
        const body = this._table.tBodies && this._table.tBodies[0];
        if (!body) {
            return [];
        }
        return Array.from(body.rows).filter((row) => !row.querySelector('[data-table-state]'));
    }

    _resetExpandHidden(rows) {
        rows.forEach((row) => {
            if (row.getAttribute('data-expand-hidden') === '1') {
                row.hidden = false;
                row.removeAttribute('data-expand-hidden');
            }
        });
    }

    _rememberBaseVisibility(rows) {
        rows.forEach((row) => {
            row.setAttribute('data-expand-base-hidden', row.hidden ? '1' : '0');
        });
    }

    _isInitiallyCollapsed(row) {
        const attr = row.getAttribute('data-expand-collapsed');
        if (attr !== null) {
            return this._isTruthy(attr);
        }
        return Boolean(this._params.collapsed);
    }

    _isEnabled() {
        return Boolean(this._params.enable);
    }

    _getIdAttr() {
        return String(this._params.idAttr || 'data-expand-id').trim() || 'data-expand-id';
    }

    _getParentAttr() {
        return String(this._params.parentAttr || 'data-expand-parent-id').trim() || 'data-expand-parent-id';
    }

    _getToggleSelector() {
        return String(this._params.toggleSelector || '[data-expand-toggle]').trim() || '[data-expand-toggle]';
    }

    _isTruthy(value) {
        const normalized = String(value || '').toLowerCase().trim();
        return normalized !== '' && normalized !== '0' && normalized !== 'false' && normalized !== 'off' && normalized !== 'no';
    }
}

export default Expandable;
