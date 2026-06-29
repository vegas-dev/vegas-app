const MAIN_SELECTOR_CLASS = 'vg-dynamic-table';

const viewportMethods = {
    _ensureTableViewport(previousParent = null) {
        if (!this._parent || !this._element) {
            return;
        }

        let viewport = this._element.parentElement && this._element.parentElement.classList.contains('vgdt-table-viewport')
            ? this._element.parentElement
            : null;

        if (!viewport) {
            viewport = Array.from(this._parent.children || []).find((node) => {
                return node && node.classList && node.classList.contains('vgdt-table-viewport');
            }) || null;
        }

        if (!viewport) {
            viewport = document.createElement('div');
            viewport.className = 'vgdt-table-viewport';
            if (previousParent === this._parent) {
                this._parent.insertBefore(viewport, this._element);
            } else {
                this._parent.appendChild(viewport);
            }
        }

        if (this._element.parentElement !== viewport) {
            viewport.appendChild(this._element);
        }

        this._tableViewport = viewport;
    },

    _bindViewportPan() {
        const viewport = this._tableViewport;
        if (!viewport) {
            return;
        }

        if (this._panState && this._panState.viewport === viewport) {
            return;
        }

        if (this._panState && this._panState.viewport) {
            const prev = this._panState.viewport;
            prev.removeEventListener('pointerdown', this._panState.onPointerDown);
            prev.removeEventListener('pointermove', this._panState.onPointerMove);
            prev.removeEventListener('pointerup', this._panState.onPointerUp);
            prev.removeEventListener('pointercancel', this._panState.onPointerCancel);
            prev.classList.remove('vgdt-pan-enabled', 'is-panning');
        }

        const state = {
            viewport,
            active: false,
            moved: false,
            pointerId: null,
            startX: 0,
            startY: 0,
            startScrollLeft: 0,
            startScrollTop: 0,
            onPointerDown: null,
            onPointerMove: null,
            onPointerUp: null,
            onPointerCancel: null,
        };

        const resetPan = () => {
            state.active = false;
            state.moved = false;
            state.pointerId = null;
            viewport.classList.remove('is-panning');
        };

        state.onPointerDown = (event) => {
            if (!event || !event.isPrimary) {
                return;
            }
            if (event.pointerType === 'mouse' && event.button !== 0) {
                return;
            }
            if (!event.shiftKey) {
                return;
            }

            const target = event.target;
            if (target && target.closest('button, a, input, select, textarea, [role="button"], [data-sort-arrow]')) {
                return;
            }

            state.active = true;
            state.moved = false;
            state.pointerId = event.pointerId;
            state.startX = event.clientX;
            state.startY = event.clientY;
            state.startScrollLeft = viewport.scrollLeft;
            state.startScrollTop = viewport.scrollTop;
            viewport.classList.add('is-panning');
            if (typeof viewport.setPointerCapture === 'function') {
                viewport.setPointerCapture(event.pointerId);
            }
        };

        state.onPointerMove = (event) => {
            if (!state.active || event.pointerId !== state.pointerId) {
                return;
            }

            const deltaX = event.clientX - state.startX;
            const deltaY = event.clientY - state.startY;
            if (!state.moved && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
                state.moved = true;
            }

            viewport.scrollLeft = state.startScrollLeft - deltaX;
            viewport.scrollTop = state.startScrollTop - deltaY;

            if (state.moved && event.cancelable) {
                event.preventDefault();
            }
        };

        state.onPointerUp = (event) => {
            if (event.pointerId !== state.pointerId) {
                return;
            }
            if (typeof viewport.releasePointerCapture === 'function') {
                try {
                    viewport.releasePointerCapture(event.pointerId);
                } catch (error) {
                    // Ignore capture release errors.
                }
            }
            resetPan();
        };

        state.onPointerCancel = (event) => {
            if (event.pointerId !== state.pointerId) {
                return;
            }
            resetPan();
        };

        viewport.classList.add('vgdt-pan-enabled');
        viewport.addEventListener('pointerdown', state.onPointerDown);
        viewport.addEventListener('pointermove', state.onPointerMove);
        viewport.addEventListener('pointerup', state.onPointerUp);
        viewport.addEventListener('pointercancel', state.onPointerCancel);
        this._panState = state;
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this._boundPanHintResize);
            window.addEventListener('resize', this._boundPanHintResize);
        }
        this._updatePanHintVisibility();
    },

    _ensurePanHintNode() {
        if (this._panHintNode || !this._parent) {
            return;
        }
        const node = document.createElement('div');
        node.className = 'vgdt-pan-hint';
        const text = this._getTableMessage('shiftDragHint', 'Hold Shift and drag to scroll the table.');
        const closeLabel = this._getTableMessage('shiftDragHintClose', 'Close hint');
        node.innerHTML = `<span class="vgdt-pan-hint__text">${this._escapeHtml(text)}</span><button type="button" class="vgdt-pan-hint__close" data-pan-hint-dismiss aria-label="${this._escapeHtml(closeLabel)}">&times;</button>`;
        node.hidden = true;
        node.addEventListener('click', this._boundPanHintDismiss);
        const anchor = this._tableViewport && this._tableViewport.parentElement === this._parent
            ? this._tableViewport
            : this._element;
        this._parent.insertBefore(node, anchor);
        this._panHintNode = node;
    },

    _handlePanHintDismiss(event) {
        const targetNode = event ? event.target : null;
        const targetElement = targetNode instanceof Element
            ? targetNode
            : (targetNode && targetNode.parentElement ? targetNode.parentElement : null);
        const dismissButton = targetElement ? targetElement.closest('[data-pan-hint-dismiss]') : null;
        if (!dismissButton) {
            return;
        }
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        this._storePanHintDismissedAt(Date.now());
        if (this._panHintNode) {
            this._panHintNode.hidden = true;
        }
    },

    _updatePanHintVisibility() {
        if (!this._panHintNode || !this._tableViewport) {
            return;
        }
        const scrollWidth = this._tableViewport.scrollWidth || 0;
        const clientWidth = this._tableViewport.clientWidth || 0;
        const overflowX = Math.max(0, scrollWidth - clientWidth);
        const hasHorizontalOverflow = overflowX > 1;
        if (!hasHorizontalOverflow) {
            this._panHintNode.hidden = true;
            return;
        }
        const shouldShowPanHint = !this._isTouchDevice() && !this._isPanHintDismissed();
        this._panHintNode.hidden = !shouldShowPanHint;
    },

    _getPanHintDismissDays() {
        const options = this._params && this._params.panHint && typeof this._params.panHint === 'object'
            ? this._params.panHint
            : {};
        const attrValue = this._element
            ? this._element.getAttribute('data-pan-hint-dismiss-days')
            : null;
        const raw = attrValue !== null ? attrValue : options.dismissDays;
        const parsed = Number.parseInt(raw, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
    },

    _getPanHintDismissStorageKey() {
        if (typeof this._getPerPageStorageKey === 'function') {
            return `${this._getPerPageStorageKey()}:panHintDismissedAt`;
        }
        const tableId = this._element && this._element.id ? String(this._element.id).trim() : '';
        if (tableId) {
            return `vgdt:panHint:${tableId}`;
        }
        return `vgdt:panHint:${window.location.pathname}`;
    },

    _readPanHintDismissedAt() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return 0;
        }
        try {
            const value = Number.parseInt(window.localStorage.getItem(this._getPanHintDismissStorageKey()), 10);
            return Number.isFinite(value) && value > 0 ? value : 0;
        } catch (error) {
            return 0;
        }
    },

    _storePanHintDismissedAt(timestamp) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        const value = Number.isFinite(timestamp) && timestamp > 0 ? Math.floor(timestamp) : Date.now();
        try {
            window.localStorage.setItem(this._getPanHintDismissStorageKey(), String(value));
        } catch (error) {
            // Ignore storage errors.
        }
    },

    _clearPanHintDismissedAt() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        try {
            window.localStorage.removeItem(this._getPanHintDismissStorageKey());
        } catch (error) {
            // Ignore storage errors.
        }
    },

    _isPanHintDismissed() {
        const dismissedAt = this._readPanHintDismissedAt();
        if (!dismissedAt) {
            return false;
        }
        const days = this._getPanHintDismissDays();
        const ttlMs = days * 24 * 60 * 60 * 1000;
        if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
            return false;
        }
        const expiresAt = dismissedAt + ttlMs;
        if (Date.now() <= expiresAt) {
            return true;
        }
        this._clearPanHintDismissedAt();
        return false;
    },

    _isTouchDevice() {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return false;
        }

        const hasTouchPoints = Number.isFinite(navigator.maxTouchPoints) && navigator.maxTouchPoints > 0;
        const hasCoarsePointer = typeof window.matchMedia === 'function'
            ? window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(any-pointer: coarse)').matches
            : false;
        const hasNoHover = typeof window.matchMedia === 'function'
            ? window.matchMedia('(hover: none)').matches || window.matchMedia('(any-hover: none)').matches
            : false;
        const hasTouchEvents = 'ontouchstart' in window;

        return hasTouchPoints || hasCoarsePointer || hasNoHover || hasTouchEvents;
    },

    _moveTableClassesToWrapper(wrapper) {
        if (!wrapper || !this._element) {
            return;
        }
        const tableClasses = Array.from(this._element.classList || []);
        if (!tableClasses.length) {
            return;
        }
        tableClasses.forEach((className) => {
            if (className !== MAIN_SELECTOR_CLASS) {
                wrapper.classList.add(className);
            }
            this._element.classList.remove(className);
        });
    },
};

export default viewportMethods;

