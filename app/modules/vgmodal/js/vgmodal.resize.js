const DEFAULT_OPTIONS = {
	enable: false,
	minWidth: 300,
	minHeight: 160,
	edgeSize: 8,
	debug: false,
};

const DIRECTION_TO_CURSOR = {
	n: 'ns-resize',
	s: 'ns-resize',
	e: 'ew-resize',
	w: 'ew-resize',
	ne: 'nesw-resize',
	sw: 'nesw-resize',
	nw: 'nwse-resize',
	se: 'nwse-resize',
};

class VGModalResize {
	constructor(modalElement, dialogElement, options = {}) {
		this._modalElement = modalElement;
		this._dialogElement = dialogElement;
		this._contentElement = this._dialogElement ? this._dialogElement.querySelector('.vg-modal-content') : null;
		this._options = this._normalizeOptions(options);
		this._pointerId = null;
		this._direction = '';
		this._startX = 0;
		this._startY = 0;
		this._currentX = 0;
		this._currentY = 0;
		this._startWidth = 0;
		this._startHeight = 0;
		this._startLeft = 0;
		this._startTop = 0;
		this._startRight = 0;
		this._startBottom = 0;
		this._isEnabled = false;
		this._observer = null;
		this._syncFrameId = null;
		this._resizeFrameId = null;
		this._lockedIframes = [];
		this._debugElement = null;
		this._previousMaxWidth = '';
		this._previousMaxHeight = '';
		this._previousPointerEvents = '';
		this._previousMinHeight = '';
		this._previousOverflow = '';
		this._previousTransition = '';
		this._previousWillChange = '';
		this._previousContentHeight = '';
		this._previousContentMaxHeight = '';
		this._previousContentOverflow = '';

		this._onPointerDown = this._onPointerDown.bind(this);
		this._onPointerMove = this._onPointerMove.bind(this);
		this._onPointerUp = this._onPointerUp.bind(this);
		this._onPointerLeave = this._onPointerLeave.bind(this);
		this._applyResizePosition = this._applyResizePosition.bind(this);
	}

	setOptions(options = {}) {
		this._options = this._normalizeOptions(options, this._options);
		this._updateDebugOverlay();
	}

	enable() {
		if (!this._dialogElement || this._isEnabled) return;

		this._updateDebugOverlay();
		this._modalElement.addEventListener('pointermove', this._onPointerMove);
		this._modalElement.addEventListener('pointerdown', this._onPointerDown);
		this._modalElement.addEventListener('pointerleave', this._onPointerLeave);
		this._startObserveSizeChanges();
		this._isEnabled = true;
	}

	disable() {
		if (!this._isEnabled) return;

		this._modalElement.removeEventListener('pointermove', this._onPointerMove);
		this._modalElement.removeEventListener('pointerdown', this._onPointerDown);
		this._modalElement.removeEventListener('pointerleave', this._onPointerLeave);
		document.removeEventListener('pointermove', this._onPointerMove);
		document.removeEventListener('pointerup', this._onPointerUp);
		document.removeEventListener('pointercancel', this._onPointerUp);
		this._cancelResizeFrame();
		this._stopObserveSizeChanges();
		this._pointerId = null;
		this._direction = '';
		this._dialogElement.style.cursor = '';
		delete this._modalElement.dataset.vgModalResizing;
		this._unlockEmbeddedFrames();
		this._restoreResizeStyles();
		this._setDebugVisibility(false);
		this._isEnabled = false;
	}

	syncToViewport() {
		if (this._modalElement && this._modalElement.dataset.vgModalDragging === 'true') return;
		if (!this._isPreparedForInteraction()) return;

		const rect = this._dialogElement.getBoundingClientRect();
		const currentWidth = this._dialogElement.offsetWidth || rect.width;
		const currentHeight = this._dialogElement.offsetHeight || rect.height;
		const currentLeftValue = Number.parseFloat(this._dialogElement.style.left);
		const currentTopValue = Number.parseFloat(this._dialogElement.style.top);
		const currentLeft = Number.isFinite(currentLeftValue) ? currentLeftValue : rect.left;
		const currentTop = Number.isFinite(currentTopValue) ? currentTopValue : rect.top;
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;
		const width = Math.max(this._options.minWidth, Math.min(currentWidth, maxWidth));
		const height = Math.max(this._options.minHeight, Math.min(currentHeight, maxHeight));
		const maxLeft = Math.max(0, window.innerWidth - width);
		const maxTop = Math.max(0, window.innerHeight - height);
		const left = Math.min(maxLeft, Math.max(0, currentLeft));
		const top = Math.min(maxTop, Math.max(0, currentTop));

		if (Math.abs(currentWidth - width) > 0.5) {
			this._dialogElement.style.width = `${width}px`;
		}

		if (Math.abs(currentHeight - height) > 0.5) {
			this._dialogElement.style.height = `${height}px`;
		}

		this._dialogElement.style.left = `${left}px`;
		this._dialogElement.style.top = `${top}px`;
		this._updateDebugValues();

	}

	_onPointerDown(event) {
		if (event.button !== 0) return;
		if (event.defaultPrevented) return;

		const direction = this._getDirectionFromPointer(event);
		if (!direction) return;

		event.preventDefault();
		this._pointerId = event.pointerId;
		this._direction = direction;

		const rect = this._dialogElement.getBoundingClientRect();
		this._applyResizeStyles();
		this._preparePosition(rect);
		this._startX = event.clientX;
		this._startY = event.clientY;
		this._currentX = event.clientX;
		this._currentY = event.clientY;
		this._startWidth = rect.width;
		this._startHeight = rect.height;
		this._startLeft = rect.left;
		this._startTop = rect.top;
		this._startRight = rect.right;
		this._startBottom = rect.bottom;
		this._lockEmbeddedFrames();
		this._modalElement.dataset.vgModalResizing = 'true';
		this._setDebugVisibility(true);
		this._updateDebugValues();

		document.addEventListener('pointermove', this._onPointerMove);
		document.addEventListener('pointerup', this._onPointerUp);
		document.addEventListener('pointercancel', this._onPointerUp);
	}

	_onPointerMove(event) {
		if (this._pointerId === null) {
			const direction = this._getDirectionFromPointer(event);
			this._dialogElement.style.cursor = direction ? DIRECTION_TO_CURSOR[direction] : '';
			return;
		}

		if (event.pointerId !== this._pointerId) return;

		this._currentX = event.clientX;
		this._currentY = event.clientY;
		if (this._resizeFrameId !== null) return;
		this._resizeFrameId = window.requestAnimationFrame(this._applyResizePosition);
	}

	_applyResizePosition() {
		this._resizeFrameId = null;
		if (this._pointerId === null) return;

		const deltaX = this._currentX - this._startX;
		const deltaY = this._currentY - this._startY;
		let width = this._startWidth;
		let height = this._startHeight;
		let left = this._startLeft;
		let top = this._startTop;

		if (this._direction.includes('e')) {
			const maxWidth = Math.max(this._options.minWidth, window.innerWidth - this._startLeft);
			width = Math.min(maxWidth, Math.max(this._options.minWidth, this._startWidth + deltaX));
		}

		if (this._direction.includes('s')) {
			const maxHeight = Math.max(this._options.minHeight, window.innerHeight - this._startTop);
			height = Math.min(maxHeight, Math.max(this._options.minHeight, this._startHeight + deltaY));
		}

		if (this._direction.includes('w')) {
			const maxLeft = this._startRight - this._options.minWidth;
			left = Math.min(maxLeft, Math.max(0, this._startLeft + deltaX));
			width = this._startRight - left;
		}

		if (this._direction.includes('n')) {
			const maxTop = this._startBottom - this._options.minHeight;
			top = Math.min(maxTop, Math.max(0, this._startTop + deltaY));
			height = this._startBottom - top;
		}

		this._dialogElement.style.left = `${left}px`;
		this._dialogElement.style.top = `${top}px`;
		this._dialogElement.style.width = `${width}px`;
		this._dialogElement.style.height = `${height}px`;
		this._updateDebugValues();

	}

	_onPointerUp(event) {
		if (event.pointerId !== this._pointerId) return;

		document.removeEventListener('pointermove', this._onPointerMove);
		document.removeEventListener('pointerup', this._onPointerUp);
		document.removeEventListener('pointercancel', this._onPointerUp);
		this._cancelResizeFrame();
		this._applyResizePosition();
		this._pointerId = null;
		this._direction = '';
		delete this._modalElement.dataset.vgModalResizing;
		this._unlockEmbeddedFrames();
		this._setDebugVisibility(this._options.debug);
		this._updateDebugValues();
	}

	_onPointerLeave() {
		if (this._pointerId !== null) return;
		this._dialogElement.style.cursor = '';
	}

	_getDirectionFromPointer(event) {
		const rect = this._dialogElement.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;
		const edgeSize = this._options.edgeSize;
		const insideDialog = offsetX >= 0 && offsetX <= rect.width && offsetY >= 0 && offsetY <= rect.height;
		if (!insideDialog) return '';

		const nearTop = offsetY >= 0 && offsetY <= edgeSize;
		const nearBottom = offsetY <= rect.height && offsetY >= rect.height - edgeSize;
		const nearLeft = offsetX >= 0 && offsetX <= edgeSize;
		const nearRight = offsetX <= rect.width && offsetX >= rect.width - edgeSize;

		if (nearTop && nearLeft) return 'nw';
		if (nearTop && nearRight) return 'ne';
		if (nearBottom && nearLeft) return 'sw';
		if (nearBottom && nearRight) return 'se';
		if (nearTop) return 'n';
		if (nearBottom) return 's';
		if (nearLeft) return 'w';
		if (nearRight) return 'e';

		return '';
	}

	_preparePosition(rect) {
		this._dialogElement.style.position = 'fixed';
		this._dialogElement.style.margin = '0';
		this._dialogElement.style.left = `${rect.left}px`;
		this._dialogElement.style.top = `${rect.top}px`;
		this._dialogElement.style.width = `${rect.width}px`;
		this._dialogElement.style.height = `${rect.height}px`;
		this._dialogElement.style.transform = 'none';
	}

	_isPreparedForInteraction() {
		return this._dialogElement.style.position === 'fixed' && this._dialogElement.style.transform === 'none';
	}

	_startObserveSizeChanges() {
		if (typeof ResizeObserver === 'undefined' || this._observer) return;

		this._observer = new ResizeObserver(() => {
			if (this._pointerId !== null) return;
			if (this._modalElement && this._modalElement.dataset.vgModalDragging === 'true') return;
			if (this._syncFrameId !== null) return;

			this._syncFrameId = window.requestAnimationFrame(() => {
				this._syncFrameId = null;
				this.syncToViewport();
			});
		});

		this._observer.observe(this._dialogElement);
	}

	_stopObserveSizeChanges() {
		if (this._observer) {
			this._observer.disconnect();
			this._observer = null;
		}

		if (this._syncFrameId !== null) {
			window.cancelAnimationFrame(this._syncFrameId);
			this._syncFrameId = null;
		}
	}

	_applyResizeStyles() {
		this._previousMaxWidth = this._dialogElement.style.maxWidth;
		this._previousMaxHeight = this._dialogElement.style.maxHeight;
		this._previousPointerEvents = this._dialogElement.style.pointerEvents;
		this._previousMinHeight = this._dialogElement.style.minHeight;
		this._previousOverflow = this._dialogElement.style.overflow;
		this._previousTransition = this._dialogElement.style.transition;
		this._previousWillChange = this._dialogElement.style.willChange;

		this._dialogElement.style.maxWidth = 'none';
		this._dialogElement.style.maxHeight = 'none';
		this._dialogElement.style.pointerEvents = 'auto';
		this._dialogElement.style.minHeight = `${this._options.minHeight}px`;
		this._dialogElement.style.overflow = 'hidden';
		this._dialogElement.style.transition = 'none';
		this._dialogElement.style.willChange = 'left, top, width, height';

		if (this._contentElement) {
			this._previousContentHeight = this._contentElement.style.height;
			this._previousContentMaxHeight = this._contentElement.style.maxHeight;
			this._previousContentOverflow = this._contentElement.style.overflow;
			this._contentElement.style.height = '100%';
			this._contentElement.style.maxHeight = '100%';
			this._contentElement.style.overflow = 'auto';
		}
	}

	_restoreResizeStyles() {
		this._dialogElement.style.maxWidth = this._previousMaxWidth;
		this._dialogElement.style.maxHeight = this._previousMaxHeight;
		this._dialogElement.style.pointerEvents = this._previousPointerEvents;
		this._dialogElement.style.minHeight = this._previousMinHeight;
		this._dialogElement.style.overflow = this._previousOverflow;
		this._dialogElement.style.transition = this._previousTransition;
		this._dialogElement.style.willChange = this._previousWillChange;

		if (this._contentElement) {
			this._contentElement.style.height = this._previousContentHeight;
			this._contentElement.style.maxHeight = this._previousContentMaxHeight;
			this._contentElement.style.overflow = this._previousContentOverflow;
		}
	}

	_normalizeOptions(options, base = DEFAULT_OPTIONS) {
		const merged = {...base, ...options};
		const minWidth = Number(merged.minWidth);
		const minHeight = Number(merged.minHeight);
		const edgeSize = Number(merged.edgeSize);

		return {
			...merged,
			minWidth: Number.isFinite(minWidth) && minWidth > 0 ? minWidth : DEFAULT_OPTIONS.minWidth,
			minHeight: Number.isFinite(minHeight) && minHeight > 0 ? minHeight : DEFAULT_OPTIONS.minHeight,
			edgeSize: Number.isFinite(edgeSize) && edgeSize > 0 ? edgeSize : DEFAULT_OPTIONS.edgeSize,
			debug: Boolean(merged.debug),
		};
	}

	_cancelResizeFrame() {
		if (this._resizeFrameId === null) return;
		window.cancelAnimationFrame(this._resizeFrameId);
		this._resizeFrameId = null;
	}

	_lockEmbeddedFrames() {
		if (!this._dialogElement || this._lockedIframes.length) return;

		const iframes = this._dialogElement.querySelectorAll('iframe');
		for (const frame of iframes) {
			this._lockedIframes.push({
				element: frame,
				pointerEvents: frame.style.pointerEvents,
			});
			frame.style.pointerEvents = 'none';
		}
	}

	_unlockEmbeddedFrames() {
		if (!this._lockedIframes.length) return;

		for (const item of this._lockedIframes) {
			item.element.style.pointerEvents = item.pointerEvents;
		}
		this._lockedIframes = [];
	}

	_updateDebugOverlay() {
		if (!this._options.debug) {
			this._setDebugVisibility(false);
			return;
		}

		if (!this._debugElement) {
			this._debugElement = document.createElement('div');
			this._debugElement.style.position = 'absolute';
			this._debugElement.style.left = '8px';
			this._debugElement.style.bottom = '8px';
			this._debugElement.style.zIndex = '6';
			this._debugElement.style.padding = '4px 6px';
			this._debugElement.style.borderRadius = '4px';
			this._debugElement.style.background = 'rgba(0, 0, 0, 0.72)';
			this._debugElement.style.color = '#fff';
			this._debugElement.style.fontSize = '11px';
			this._debugElement.style.lineHeight = '1.3';
			this._debugElement.style.pointerEvents = 'none';
			this._dialogElement.append(this._debugElement);
		}

		this._setDebugVisibility(true);
		this._updateDebugValues();
	}

	_setDebugVisibility(visible) {
		if (!this._debugElement) return;
		this._debugElement.style.display = visible ? 'block' : 'none';
	}

	_updateDebugValues() {
		if (!this._debugElement || !this._options.debug) return;

		const rect = this._dialogElement.getBoundingClientRect();
		this._debugElement.textContent = `w:${Math.round(rect.width)} h:${Math.round(rect.height)} x:${Math.round(rect.left)} y:${Math.round(rect.top)}`;
	}
}

export default VGModalResize;
