const DEFAULT_OPTIONS = {
	enable: false,
	selector: '.vg-toast-wrapper',
	threshold: 4,
	resizeEdgeSize: 8,
	debug: false,
};

class VGToastDrag {
	constructor(modalElement, dialogElement, options = {}) {
		this._modalElement = modalElement;
		this._dialogElement = dialogElement;
		this._options = this._normalizeOptions(options);
		this._pointerId = null;
		this._dragTarget = null;
		this._isDragging = false;
		this._startX = 0;
		this._startY = 0;
		this._currentX = 0;
		this._currentY = 0;
		this._dialogStartLeft = 0;
		this._dialogStartTop = 0;
		this._dialogWidth = 0;
		this._dialogHeight = 0;
		this._isEnabled = false;
		this._previousUserSelect = '';
		this._previousTransition = '';
		this._previousWillChange = '';
		this._initialRect = null;
		this._lockedIframes = [];
		this._debugElement = null;

		this._onPointerMove = this._onPointerMove.bind(this);
		this._onPointerUp = this._onPointerUp.bind(this);
		this._onPointerDown = this._onPointerDown.bind(this);
		this._onNativeDragStart = this._onNativeDragStart.bind(this);
	}

	setOptions(options = {}) {
		this._options = this._normalizeOptions(options, this._options);
		this._updateDebugOverlay();
	}

	enable() {
		if (!this._dialogElement || this._isEnabled) return;

		this._updateDebugOverlay();
		this._dialogElement.addEventListener('pointerdown', this._onPointerDown);
		this._isEnabled = true;
	}

	disable() {
		if (!this._dialogElement || !this._isEnabled) return;

		this._dialogElement.removeEventListener('pointerdown', this._onPointerDown);
		document.removeEventListener('pointermove', this._onPointerMove);
		document.removeEventListener('pointerup', this._onPointerUp);
		document.removeEventListener('pointercancel', this._onPointerUp);
		document.removeEventListener('dragstart', this._onNativeDragStart, true);
		this._dialogElement.style.touchAction = '';
		document.body.style.userSelect = this._previousUserSelect;
		this._pointerId = null;
		this._dragTarget = null;
		this._isDragging = false;
		this._initialRect = null;
		this._unlockEmbeddedFrames();
		this._restoreDragStyles();
		delete this._modalElement.dataset.vgToastDragging;
		this._setDebugVisibility(false);
		this._isEnabled = false;
	}

	syncPosition() {
		if (!this._isEnabled) return;
		if (!this._isPreparedForInteraction()) return;

		const rect = this._dialogElement.getBoundingClientRect();
		const width = this._dialogElement.offsetWidth || rect.width;
		const height = this._dialogElement.offsetHeight || rect.height;
		const currentLeft = Number.parseFloat(this._dialogElement.style.left);
		const currentTop = Number.parseFloat(this._dialogElement.style.top);
		const left = Number.isFinite(currentLeft) ? currentLeft : rect.left;
		const top = Number.isFinite(currentTop) ? currentTop : rect.top;
		const maxLeft = Math.max(0, window.innerWidth - width);
		const maxTop = Math.max(0, window.innerHeight - height);
		const nextLeft = Math.min(maxLeft, Math.max(0, left));
		const nextTop = Math.min(maxTop, Math.max(0, top));

		this._dialogElement.style.left = `${nextLeft}px`;
		this._dialogElement.style.top = `${nextTop}px`;
		this._updateDebugValues('synced');
	}

	_onPointerDown(event) {
		if (event.button !== 0) return;

		const dragArea = this._resolveDragArea(event.target);
		if (!dragArea || !this._dialogElement.contains(dragArea)) return;
		if (this._isPointerOnResizeEdge(event)) return;
		if (event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
		if (dragArea && dragArea.closest('[data-vg-dismiss="toast"]')) return;

		this._pointerId = event.pointerId;
		this._dragTarget = event.target;
		this._isDragging = false;
		event.preventDefault();
		this._previousUserSelect = document.body.style.userSelect;
		document.body.style.userSelect = 'none';
		this._initialRect = this._dialogElement.getBoundingClientRect();
		this._dialogStartLeft = this._initialRect.left;
		this._dialogStartTop = this._initialRect.top;
		this._dialogWidth = this._initialRect.width;
		this._dialogHeight = this._initialRect.height;
		this._startX = event.clientX;
		this._startY = event.clientY;
		this._currentX = event.clientX;
		this._currentY = event.clientY;
		this._lockEmbeddedFrames();
		this._modalElement.dataset.vgToastDragging = 'true';
		this._setDebugVisibility(true);
		this._updateDebugValues('armed');

		document.addEventListener('dragstart', this._onNativeDragStart, true);

		if (this._dialogElement && this._dialogElement.setPointerCapture) {
			this._dialogElement.setPointerCapture(event.pointerId);
		}

		document.addEventListener('pointermove', this._onPointerMove);
		document.addEventListener('pointerup', this._onPointerUp);
		document.addEventListener('pointercancel', this._onPointerUp);
	}

	_onPointerMove(event) {
		if (event.pointerId !== this._pointerId) return;

		this._currentX = event.clientX;
		this._currentY = event.clientY;
		if (!this._isDragging) {
			const deltaX = this._currentX - this._startX;
			const deltaY = this._currentY - this._startY;
			const distance = Math.hypot(deltaX, deltaY);
			if (distance < this._options.threshold) return;

			this._isDragging = true;
			this._dialogElement.style.touchAction = 'none';
			this._applyDragStyles();
			this._preparePosition(this._initialRect);
			event.preventDefault();
			this._updateDebugValues('dragging');
		}
		this._applyDragPosition();
	}

	_onPointerUp(event) {
		if (event.pointerId !== this._pointerId) return;

		document.removeEventListener('pointermove', this._onPointerMove);
		document.removeEventListener('pointerup', this._onPointerUp);
		document.removeEventListener('pointercancel', this._onPointerUp);
		document.removeEventListener('dragstart', this._onNativeDragStart, true);
		if (this._isDragging) {
			this._applyDragPosition();
		}
		this._dialogElement.style.touchAction = '';
		document.body.style.userSelect = this._previousUserSelect;

		if (this._dialogElement && this._dialogElement.releasePointerCapture) {
			this._dialogElement.releasePointerCapture(event.pointerId);
		}

		this._pointerId = null;
		this._dragTarget = null;
		this._isDragging = false;
		this._initialRect = null;
		this._unlockEmbeddedFrames();
		this._restoreDragStyles();
		delete this._modalElement.dataset.vgToastDragging;
		this._setDebugVisibility(this._options.debug);
		this._updateDebugValues('idle');
	}

	_preparePosition(rect = null) {
		if (!this._dialogElement) return;

		const currentRect = rect || this._dialogElement.getBoundingClientRect();
		this._dialogElement.style.position = 'fixed';
		this._dialogElement.style.margin = '0';
		this._dialogElement.style.left = `${currentRect.left}px`;
		this._dialogElement.style.top = `${currentRect.top}px`;
		this._dialogElement.style.width = `${currentRect.width}px`;
		this._dialogElement.style.height = `${currentRect.height}px`;
		this._dialogElement.style.transform = 'none';
		this._dialogElement.style.translate = 'none';
	}

	_isPreparedForInteraction() {
		return this._dialogElement.style.position === 'fixed' && this._dialogElement.style.transform === 'none';
	}

	_isPointerOnResizeEdge(event) {
		const rect = this._dialogElement.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;
		const edgeSize = this._options.resizeEdgeSize;

		const nearTop = offsetY >= 0 && offsetY <= edgeSize;
		const nearBottom = offsetY <= rect.height && offsetY >= rect.height - edgeSize;
		const nearLeft = offsetX >= 0 && offsetX <= edgeSize;
		const nearRight = offsetX <= rect.width && offsetX >= rect.width - edgeSize;

		return nearTop || nearBottom || nearLeft || nearRight;
	}

	_applyDragPosition() {
		if (this._pointerId === null || !this._isDragging) return;

		const deltaX = this._currentX - this._startX;
		const deltaY = this._currentY - this._startY;
		const maxLeft = Math.max(0, window.innerWidth - this._dialogWidth);
		const maxTop = Math.max(0, window.innerHeight - this._dialogHeight);
		const nextLeft = Math.min(maxLeft, Math.max(0, this._dialogStartLeft + deltaX));
		const nextTop = Math.min(maxTop, Math.max(0, this._dialogStartTop + deltaY));

		this._dialogElement.style.left = `${nextLeft}px`;
		this._dialogElement.style.top = `${nextTop}px`;
		this._updateDebugValues('dragging');
	}

	_onNativeDragStart(event) {
		if (this._pointerId === null) return;
		event.preventDefault();
	}

	_applyDragStyles() {
		this._previousTransition = this._dialogElement.style.transition;
		this._previousWillChange = this._dialogElement.style.willChange;
		this._dialogElement.style.transition = 'none';
		this._dialogElement.style.willChange = 'left, top';
	}

	_restoreDragStyles() {
		this._dialogElement.style.transition = this._previousTransition;
		this._dialogElement.style.willChange = this._previousWillChange;
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

	_normalizeOptions(options, base = DEFAULT_OPTIONS) {
		const merged = {...base, ...options};
		const threshold = Number(merged.threshold);
		const resizeEdgeSize = Number(merged.resizeEdgeSize);
		const selector = typeof merged.selector === 'string' && merged.selector.trim()
			? merged.selector
			: DEFAULT_OPTIONS.selector;

		return {
			...merged,
			selector,
			threshold: Number.isFinite(threshold) && threshold >= 0 ? threshold : DEFAULT_OPTIONS.threshold,
			resizeEdgeSize: Number.isFinite(resizeEdgeSize) && resizeEdgeSize > 0 ? resizeEdgeSize : DEFAULT_OPTIONS.resizeEdgeSize,
			debug: Boolean(merged.debug),
		};
	}

	_resolveDragArea(target) {
		try {
			return target.closest(this._options.selector);
		} catch (error) {
			return target.closest(DEFAULT_OPTIONS.selector);
		}
	}

	_updateDebugOverlay() {
		if (!this._options.debug) {
			this._setDebugVisibility(false);
			return;
		}

		if (!this._debugElement) {
			this._debugElement = document.createElement('div');
			this._debugElement.style.position = 'absolute';
			this._debugElement.style.left = '170px';
			this._debugElement.style.bottom = '8px';
			this._debugElement.style.zIndex = '7';
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
		this._updateDebugValues(this._isDragging ? 'dragging' : 'idle');
	}

	_setDebugVisibility(visible) {
		if (!this._debugElement) return;
		this._debugElement.style.display = visible ? 'block' : 'none';
	}

	_updateDebugValues(state = 'idle') {
		if (!this._debugElement || !this._options.debug) return;

		const rect = this._dialogElement.getBoundingClientRect();
		this._debugElement.textContent = `drag:${state} x:${Math.round(rect.left)} y:${Math.round(rect.top)} w:${Math.round(rect.width)} h:${Math.round(rect.height)}`;
	}
}

export default VGToastDrag;


