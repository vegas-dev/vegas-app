const fixedColumnsMethods = {
    _getFixedColumnsConfigRaw() {
        const fixedOptions = this._params && this._params.fixed && typeof this._params.fixed === 'object'
            ? this._params.fixed
            : {};
        const optionRaw = fixedOptions.columns;
        const attrRaw = this._element
            ? this._element.getAttribute('data-fixed-columns')
            : null;
        const raw = attrRaw !== null && attrRaw !== undefined && String(attrRaw).trim() !== ''
            ? attrRaw
            : optionRaw;
        return String(raw || '').trim();
    },

    _hasFixedColumnsConfig() {
        const attr = this._getFixedColumnsConfigRaw();
        if (attr !== '') {
            return true;
        }
        const headers = this._element && this._element.tHead
            ? Array.from(this._element.tHead.querySelectorAll('th'))
            : [];
        return headers.some((header) => {
            const fixedAttr = String(header.getAttribute('data-fixed') || '').toLowerCase().trim();
            const fixedColumnAttr = String(header.getAttribute('data-fixed-column') || '').toLowerCase().trim();
            return fixedAttr === 'left' || fixedAttr === 'right' || fixedColumnAttr === 'left' || fixedColumnAttr === 'right';
        });
    },

    _buildFixedColumnsStateMap(fixed) {
        const state = new Map();
        const left = Array.isArray(fixed && fixed.left) ? fixed.left : [];
        const right = Array.isArray(fixed && fixed.right) ? fixed.right : [];
        left.forEach((index) => {
            if (Number.isInteger(index) && index >= 0) {
                state.set(index, 'left');
            }
        });
        right.forEach((index) => {
            if (Number.isInteger(index) && index >= 0 && !state.has(index)) {
                state.set(index, 'right');
            }
        });
        return state;
    },

    _collectFixedColumnsTransitions(nextState) {
        const previousState = this._fixedColumnsLastStateMap instanceof Map
            ? this._fixedColumnsLastStateMap
            : new Map();
        const transitions = [];
        nextState.forEach((side, index) => {
            if (previousState.get(index) !== side) {
                transitions.push({ index, side });
            }
        });
        this._fixedColumnsLastStateMap = nextState;
        return transitions;
    },

    _applyFixedColumnsLayout() {
        if (!this._element) {
            return;
        }
        const suppressFixedColumns = Boolean(this._fixedColumnsSuppressed);

        const sourceHeaders = this._element.tHead ? Array.from(this._element.tHead.querySelectorAll('th')) : [];
        const sourceFixedRaw = this._getFixedColumnsByHeaders(sourceHeaders, {
            parseTableAttr: true,
            fallbackByPosition: true,
        });
        const sourceFixed = suppressFixedColumns
            ? { left: [], right: [] }
            : this._applyMobileFixedColumnsGuard(this._element, sourceFixedRaw);
        const hasSourceFixed = sourceFixed.left.length > 0 || sourceFixed.right.length > 0;
        this._element.classList.toggle('table-fixed-cols', hasSourceFixed);
        if (this._parent) {
            this._parent.classList.toggle('table-fixed-cols', hasSourceFixed);
        }
        const sourceFixedTransitions = this._collectFixedColumnsTransitions(
            this._buildFixedColumnsStateMap(sourceFixed)
        );
        this._applyFixedColumnsToTable(this._element, sourceFixed, {
            includeBody: true,
            emitAction: true,
            transitionedColumns: sourceFixedTransitions,
        });
        this._toggleFixedColumnsScrollBinding(hasSourceFixed);

        const cloneTable = this._cloneStickyState && this._cloneStickyState.table
            ? this._cloneStickyState.table
            : null;
        if (cloneTable) {
            const cloneHeaders = cloneTable.tHead ? Array.from(cloneTable.tHead.querySelectorAll('th')) : [];
            const cloneFixedRaw = this._getFixedColumnsByHeaders(cloneHeaders, {
                parseTableAttr: false,
                fallbackByPosition: false,
            });
            const cloneFixed = hasSourceFixed
                ? this._applyMobileFixedColumnsGuard(cloneTable, cloneFixedRaw)
                : { left: [], right: [] };
            this._applyFixedColumnsToTable(cloneTable, cloneFixed, {
                includeBody: false,
                emitAction: false,
            });
        }
        this._rebuildFixedColumnsCellsCache();
        this._syncFixedColumnsScroll({ immediate: true });
    },

    _applyMobileFixedColumnsGuard(table, fixed) {
        const next = {
            left: Array.isArray(fixed && fixed.left) ? fixed.left.slice() : [],
            right: Array.isArray(fixed && fixed.right) ? fixed.right.slice() : [],
        };
        if (!this._isTouchDevice()) {
            return next;
        }
        const viewportMetrics = this._getViewportWidthMetrics();
        const viewportWidth = viewportMetrics
            ? viewportMetrics.effectiveWidth
            : (table ? table.getBoundingClientRect().width : 0);
        const isMobileViewport = viewportWidth > 0 && viewportWidth <= 768;
        if (!isMobileViewport) {
            return next;
        }

        const fixedIndexes = next.left.concat(next.right);
        if (fixedIndexes.length <= 0) {
            return next;
        }
        if (fixedIndexes.length > 1) {
            return { left: [], right: [] };
        }

        const headerCells = table && table.tHead ? Array.from(table.tHead.querySelectorAll('th')) : [];
        const fixedIndex = fixedIndexes[0];
        const header = Number.isInteger(fixedIndex) && fixedIndex >= 0 && fixedIndex < headerCells.length
            ? headerCells[fixedIndex]
            : null;
        if (!header) {
            return next;
        }

        const columnWidth = header.getBoundingClientRect().width || 0;
        if (columnWidth > viewportWidth * 0.5) {
            return { left: [], right: [] };
        }

        return next;
    },

    _getFixedColumnsByHeaders(headers, options = {}) {
        const list = Array.isArray(headers) ? headers : [];
        const parseTableAttr = options.parseTableAttr !== false;
        const fallbackByPosition = options.fallbackByPosition !== false;
        const byField = new Map();
        const leftSet = new Set();
        const rightSet = new Set();
        const autoIndexes = [];

        list.forEach((header, index) => {
            const field = String(header.getAttribute('data-field') || '').trim();
            if (field !== '') {
                byField.set(field, index);
            }
        });

        list.forEach((header, index) => {
            const fixedAttr = String(header.getAttribute('data-fixed') || '').toLowerCase().trim();
            const fixedColumnAttr = String(header.getAttribute('data-fixed-column') || '').toLowerCase().trim();
            const side = fixedAttr === 'left' || fixedAttr === 'right'
                ? fixedAttr
                : (fixedColumnAttr === 'left' || fixedColumnAttr === 'right' ? fixedColumnAttr : '');
            if (side === 'left') {
                leftSet.add(index);
            } else if (side === 'right') {
                rightSet.add(index);
            } else if (!parseTableAttr) {
                const clonedSide = String(header.getAttribute('data-fixed-side') || '').toLowerCase().trim();
                if (clonedSide === 'left') {
                    leftSet.add(index);
                } else if (clonedSide === 'right') {
                    rightSet.add(index);
                }
            }
        });

        if (parseTableAttr && this._element) {
            const attrRaw = this._getFixedColumnsConfigRaw();
            if (attrRaw !== '') {
                const groups = attrRaw.split(';').map((item) => item.trim()).filter(Boolean);
                groups.forEach((group) => {
                    const sideMatch = group.match(/^(left|right)\s*:\s*(.+)$/i);
                    const explicitSide = sideMatch ? sideMatch[1].toLowerCase() : '';
                    const valuesRaw = sideMatch ? sideMatch[2] : group;
                    const values = valuesRaw.split(',').map((item) => item.trim()).filter(Boolean);
                    values.forEach((name) => {
                        const index = byField.has(name) ? byField.get(name) : Number.parseInt(name, 10);
                        if (!Number.isInteger(index) || index < 0 || index >= list.length) {
                            return;
                        }
                        if (explicitSide === 'left') {
                            leftSet.add(index);
                        } else if (explicitSide === 'right') {
                            rightSet.add(index);
                        } else {
                            autoIndexes.push(index);
                        }
                    });
                });
            }
        }

        autoIndexes.forEach((index) => {
            if (leftSet.has(index) || rightSet.has(index)) {
                return;
            }
            const distanceLeft = index;
            const distanceRight = Math.max(0, list.length - 1 - index);
            if (distanceLeft <= distanceRight || !fallbackByPosition) {
                leftSet.add(index);
                return;
            }
            rightSet.add(index);
        });

        const left = Array.from(leftSet).sort((a, b) => a - b);
        const right = Array.from(rightSet)
            .filter((index) => !leftSet.has(index))
            .sort((a, b) => a - b);

        return { left, right };
    },

    _applyFixedColumnsToTable(table, fixed, options = {}) {
        if (!table) {
            return;
        }
        const includeBody = options.includeBody !== false;
        const shouldEmitAction = options.emitAction !== false;
        const transitionedColumns = Array.isArray(options.transitionedColumns)
            ? options.transitionedColumns
            : [];
        const sections = [];
        if (table.tHead) {
            sections.push(table.tHead);
        }
        if (includeBody && table.tBodies && table.tBodies.length) {
            sections.push(...Array.from(table.tBodies));
        }
        if (includeBody && table.tFoot) {
            sections.push(table.tFoot);
        }

        const rows = [];
        sections.forEach((section) => {
            rows.push(...Array.from(section.rows || []));
        });
        const hasFixed = fixed && (fixed.left.length > 0 || fixed.right.length > 0);
        rows.forEach((row) => {
            Array.from(row.cells || []).forEach((cell) => {
                cell.removeAttribute('data-fixed-side');
                cell.removeAttribute('data-fixed-edge');
                cell.removeAttribute('data-fixed-shift');
                cell.removeAttribute('data-fixed-shadow');
                cell.removeAttribute('data-fixed-overlap');
                cell.style.removeProperty('z-index');
                cell.style.removeProperty('transform');
            });
        });

        if (!hasFixed) {
            return;
        }

        const headerCells = table.tHead ? Array.from(table.tHead.querySelectorAll('th')) : [];
        const tableRect = table.getBoundingClientRect();
        const viewportMetrics = this._getViewportWidthMetrics();
        const viewportWidth = viewportMetrics
            ? viewportMetrics.effectiveWidth
            : tableRect.width;
        const metrics = {};
        headerCells.forEach((cell, index) => {
            const rect = cell.getBoundingClientRect();
            metrics[index] = {
                width: Math.max(0, rect.width),
                left: Math.max(0, rect.left - tableRect.left),
                height: Math.max(0, rect.height),
                top: Math.max(0, rect.top - tableRect.top),
            };
        });
        const leftOffsets = {};
        let leftOffset = 0;
        fixed.left.forEach((index) => {
            const width = metrics[index] ? metrics[index].width : 0;
            leftOffsets[index] = leftOffset;
            leftOffset += width;
        });

        const rightOffsets = {};
        let rightOffset = 0;
        fixed.right.slice().sort((a, b) => b - a).forEach((index) => {
            const width = metrics[index] ? metrics[index].width : 0;
            rightOffsets[index] = rightOffset;
            rightOffset += width;
        });

        const leftEdgeIndex = fixed.left.length ? fixed.left[fixed.left.length - 1] : -1;
        const rightEdgeIndex = fixed.right.length ? fixed.right[0] : -1;
        rows.forEach((row) => {
            const isHeaderRow = row.parentElement && row.parentElement.tagName === 'THEAD';
            const zIndex = isHeaderRow ? 6 : 2;

            fixed.left.forEach((index) => {
                const cell = row.cells && row.cells[index] ? row.cells[index] : null;
                if (!cell) {
                    return;
                }
                const metric = metrics[index] || { left: 0 };
                const baseShift = leftOffsets[index] - metric.left;
                cell.setAttribute('data-fixed-side', 'left');
                cell.setAttribute('data-fixed-shift', String(baseShift));
                cell.style.zIndex = String(zIndex);
                if (index === leftEdgeIndex) {
                    cell.setAttribute('data-fixed-edge', 'right');
                }
            });

            fixed.right.forEach((index) => {
                const cell = row.cells && row.cells[index] ? row.cells[index] : null;
                if (!cell) {
                    return;
                }
                const metric = metrics[index] || { left: 0, width: 0 };
                const desiredLeft = viewportWidth - rightOffsets[index] - metric.width;
                const baseShift = desiredLeft - metric.left;
                cell.setAttribute('data-fixed-side', 'right');
                cell.setAttribute('data-fixed-shift', String(baseShift));
                cell.style.zIndex = String(zIndex);
                if (index === rightEdgeIndex) {
                    cell.setAttribute('data-fixed-edge', 'left');
                }
            });
        });

        if (!shouldEmitAction || typeof this._emitAction !== 'function' || !transitionedColumns.length) {
            return;
        }

        transitionedColumns.forEach((entry) => {
            const index = Number.isInteger(entry && entry.index) ? entry.index : -1;
            const side = entry && (entry.side === 'left' || entry.side === 'right')
                ? entry.side
                : '';
            const headerCell = index >= 0 && index < headerCells.length
                ? headerCells[index]
                : null;
            if (!headerCell || !side) {
                return;
            }

            const metric = metrics[index] || { left: 0, width: 0, top: 0, height: 0 };
            const width = metric.width || 0;
            const height = metric.height || 0;
            const left = side === 'left'
                ? (leftOffsets[index] || 0)
                : Math.max(0, viewportWidth - (rightOffsets[index] || 0) - width);
            const right = side === 'right'
                ? (rightOffsets[index] || 0)
                : Math.max(0, viewportWidth - left - width);
            const top = metric.top || 0;
            const bottom = Math.max(0, tableRect.height - top - height);
            const field = String(headerCell.getAttribute('data-field') || '').trim();
            const fallbackBaseShift = left - (metric.left || 0);
            const attrBaseShift = Number.parseFloat(headerCell.getAttribute('data-fixed-shift') || '');
            const baseShift = Number.isFinite(attrBaseShift) ? attrBaseShift : fallbackBaseShift;
            const scrollLeft = this._tableViewport ? (this._tableViewport.scrollLeft || 0) : 0;
            const fixedAtTs = Date.now();

            this._emitAction('columnfixed', {
                columnIndex: index,
                side,
                phase: 'fixed',
                field,
                column: {
                    index,
                    side,
                    field,
                    width,
                    height,
                    element: headerCell,
                },
                offsets: {
                    left,
                    right,
                    top,
                    bottom,
                },
                shift: {
                    base: baseShift,
                    current: baseShift + scrollLeft,
                    scrollLeft,
                },
                fixedAt: {
                    timestamp: fixedAtTs,
                    iso: new Date(fixedAtTs).toISOString(),
                },
            });
        });
    },

    _toggleFixedColumnsScrollBinding(enabled) {
        if (!this._tableViewport) {
            this._resetFixedColumnsScrollSyncState();
            return;
        }
        if (enabled && !this._fixedColumnsScrollBound) {
            this._tableViewport.addEventListener('scroll', this._boundFixedColumnsScroll, { passive: true });
            this._fixedColumnsScrollBound = true;
            return;
        }
        if (!enabled && this._fixedColumnsScrollBound) {
            this._tableViewport.removeEventListener('scroll', this._boundFixedColumnsScroll);
            this._fixedColumnsScrollBound = false;
        }
        if (!enabled) {
            this._resetFixedColumnsScrollSyncState();
        }
    },

    _resetFixedColumnsScrollSyncState() {
        if (this._fixedColumnsSyncFrame && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(this._fixedColumnsSyncFrame);
        }
        this._fixedColumnsSyncFrame = 0;
        this._fixedColumnsLastScrollLeft = 0;
        this._fixedColumnsLastAppliedScrollLeft = Number.NaN;
        this._fixedColumnsLastShadowStateKey = '';
        this._fixedColumnsCellsCache = [];
        this._fixedColumnsShadowTargetsCache = [];
        this._fixedColumnsLastStateMap = new Map();
    },

    _rebuildFixedColumnsCellsCache() {
        const tables = [this._element];
        if (this._cloneStickyState && this._cloneStickyState.table) {
            tables.push(this._cloneStickyState.table);
        }
        const normalizedTables = tables.filter(Boolean);
        this._fixedColumnsCellsCache = normalizedTables
            .map((table) => {
                return Array.from(table.querySelectorAll('[data-fixed-side][data-fixed-shift]'))
                    .map((cell) => {
                        const baseShift = Number.parseFloat(cell.getAttribute('data-fixed-shift') || '0');
                        return {
                            cell,
                            baseShift: Number.isFinite(baseShift) ? baseShift : 0,
                        };
                    });
            })
            .filter((cells) => cells.length > 0);
        this._fixedColumnsShadowTargetsCache = normalizedTables
            .map((table) => {
                return {
                    table,
                    edges: Array.from(table.querySelectorAll('[data-fixed-edge]')),
                    fixedCells: Array.from(table.querySelectorAll('[data-fixed-side]')),
                };
            })
            .filter((entry) => entry.edges.length > 0 || entry.fixedCells.length > 0);
        this._fixedColumnsLastAppliedScrollLeft = Number.NaN;
        this._fixedColumnsLastShadowStateKey = '';
    },

    _syncFixedColumnsScroll(options = {}) {
        if (!this._tableViewport) {
            return;
        }

        const nextScrollLeft = this._tableViewport.scrollLeft || 0;
        this._fixedColumnsLastScrollLeft = nextScrollLeft;
        const immediate = Boolean(options && options.immediate);
        if (!immediate && this._fixedColumnsLastAppliedScrollLeft === nextScrollLeft) {
            return;
        }
        if (immediate || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
            this._flushFixedColumnsScrollSync(nextScrollLeft);
            return;
        }
        if (this._fixedColumnsSyncFrame) {
            return;
        }
        this._fixedColumnsSyncFrame = window.requestAnimationFrame(() => {
            this._fixedColumnsSyncFrame = 0;
            this._flushFixedColumnsScrollSync(this._fixedColumnsLastScrollLeft);
        });
    },

    _flushFixedColumnsScrollSync(scrollLeft) {
        if (!this._fixedColumnsCellsCache.length) {
            this._rebuildFixedColumnsCellsCache();
        }
        this._fixedColumnsCellsCache.forEach((cells) => {
            cells.forEach(({ cell, baseShift }) => {
                if (!cell || !cell.isConnected) {
                    return;
                }
                const shift = baseShift + scrollLeft;
                cell.style.transform = `translate3d(${shift}px, 0px, 0px)`;
            });
        });
        this._fixedColumnsLastAppliedScrollLeft = scrollLeft;
        this._syncFixedColumnsShadows();
    },

    _syncFixedColumnsShadows() {
        if (!Array.isArray(this._fixedColumnsShadowTargetsCache) || !this._fixedColumnsShadowTargetsCache.length) {
            this._rebuildFixedColumnsCellsCache();
        }
        const targets = Array.isArray(this._fixedColumnsShadowTargetsCache)
            ? this._fixedColumnsShadowTargetsCache
            : [];
        if (!targets.length) {
            return;
        }

        const viewport = this._tableViewport;
        const canScroll = Boolean(viewport && viewport.scrollWidth > viewport.clientWidth + 1);
        const scrollLeft = viewport ? (viewport.scrollLeft || 0) : 0;
        const maxScrollLeft = viewport ? Math.max(0, viewport.scrollWidth - viewport.clientWidth) : 0;
        const showLeftFixedShadow = canScroll && scrollLeft > 0;
        const showRightFixedShadow = canScroll && scrollLeft < maxScrollLeft - 1;
        const nextStateKey = `${showLeftFixedShadow ? 1 : 0}:${showRightFixedShadow ? 1 : 0}`;
        if (this._fixedColumnsLastShadowStateKey === nextStateKey) {
            return;
        }
        this._fixedColumnsLastShadowStateKey = nextStateKey;

        targets.forEach(({ edges, fixedCells }) => {
            edges.forEach((cell) => {
                const edge = String(cell.getAttribute('data-fixed-edge') || '').toLowerCase().trim();
                const shouldShow = (edge === 'right' && showLeftFixedShadow) || (edge === 'left' && showRightFixedShadow);
                if (shouldShow) {
                    cell.setAttribute('data-fixed-shadow', '1');
                } else {
                    cell.removeAttribute('data-fixed-shadow');
                }
            });

            fixedCells.forEach((cell) => {
                const side = String(cell.getAttribute('data-fixed-side') || '').toLowerCase().trim();
                const hasOverlap = (side === 'left' && showLeftFixedShadow) || (side === 'right' && showRightFixedShadow);
                if (hasOverlap) {
                    cell.setAttribute('data-fixed-overlap', '1');
                } else {
                    cell.removeAttribute('data-fixed-overlap');
                }
            });
        });
    },
};

export default fixedColumnsMethods;

