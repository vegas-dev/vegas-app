/**
 * Описание: горизонтальное перемещение адаптивной таблицы мышью.
 * Возможности: Shift-перетаскивание, синхронное обновление связанных слоёв, защита интерактивных элементов и подавление случайного клика.
 */
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [contenteditable="true"], [role="button"]';
const MOVE_THRESHOLD = 4;

class _panning {
	constructor(table, options = {}) {
		this._scrollHost = table.closest('.vg-table-body') || table.closest('.vg-table-container') || table.closest('.vg-table-wrapper');
		this._stateTarget = table.closest('.vg-table-wrapper') || this._scrollHost;
		this._onMove = typeof options.onMove === 'function' ? options.onMove : null;
		this._active = false;
		this._moved = false;
		this._pointerId = null;
		this._startX = 0;
		this._startScrollLeft = 0;
		this._suppressClick = false;
		this._suppressClickTimer = null;
		this._boundPointerDown = this._handlePointerDown.bind(this);
		this._boundPointerMove = this._handlePointerMove.bind(this);
		this._boundPointerUp = this._handlePointerUp.bind(this);
		this._boundPointerCancel = this._handlePointerCancel.bind(this);
		this._boundClick = this._handleClick.bind(this);
	}

	init() {
		if (!this._scrollHost) return;

		this._scrollHost.addEventListener('pointerdown', this._boundPointerDown);
		this._scrollHost.addEventListener('pointermove', this._boundPointerMove);
		this._scrollHost.addEventListener('pointerup', this._boundPointerUp);
		this._scrollHost.addEventListener('pointercancel', this._boundPointerCancel);
		this._scrollHost.addEventListener('click', this._boundClick, true);
	}

	dispose() {
		if (!this._scrollHost) return;

		this._scrollHost.removeEventListener('pointerdown', this._boundPointerDown);
		this._scrollHost.removeEventListener('pointermove', this._boundPointerMove);
		this._scrollHost.removeEventListener('pointerup', this._boundPointerUp);
		this._scrollHost.removeEventListener('pointercancel', this._boundPointerCancel);
		this._scrollHost.removeEventListener('click', this._boundClick, true);
		this._scrollHost.classList.remove('is-panning');
		this._stateTarget?.classList.remove('is-panning');
		if (this._suppressClickTimer) window.clearTimeout(this._suppressClickTimer);
		this._reset();
	}

	_handlePointerDown(event) {
		if (!event.isPrimary || event.pointerType !== 'mouse' || event.button !== 0 || !event.shiftKey) return;
		if (this._scrollHost.scrollWidth <= this._scrollHost.clientWidth) return;
		if (event.target.closest(INTERACTIVE_SELECTOR)) return;

		this._active = true;
		this._moved = false;
		this._pointerId = event.pointerId;
		this._startX = event.clientX;
		this._startScrollLeft = this._scrollHost.scrollLeft;
		this._stateTarget.classList.add('is-panning');
		if (event.cancelable) event.preventDefault();

		if (typeof this._scrollHost.setPointerCapture === 'function') {
			this._scrollHost.setPointerCapture(event.pointerId);
		}
	}

	_handlePointerMove(event) {
		if (!this._active || event.pointerId !== this._pointerId) return;

		const deltaX = event.clientX - this._startX;
		if (!this._moved && Math.abs(deltaX) > MOVE_THRESHOLD) this._moved = true;
		this._scrollHost.scrollLeft = this._startScrollLeft - deltaX;
		this._onMove?.(this._scrollHost.scrollLeft);

		if (this._moved && event.cancelable) event.preventDefault();
	}

	_handlePointerUp(event) {
		if (event.pointerId !== this._pointerId) return;

		if (typeof this._scrollHost.releasePointerCapture === 'function') {
			try {
				this._scrollHost.releasePointerCapture(event.pointerId);
			} catch (error) {
				// Pointer capture may already be released by the browser.
			}
		}

		if (this._moved) {
			this._suppressClick = true;
			this._suppressClickTimer = window.setTimeout(() => {
				this._suppressClick = false;
				this._suppressClickTimer = null;
			}, 0);
		}

		this._reset();
	}

	_handlePointerCancel(event) {
		if (event.pointerId === this._pointerId) this._reset();
	}

	_handleClick(event) {
		if (!this._suppressClick) return;

		this._suppressClick = false;
		if (this._suppressClickTimer) window.clearTimeout(this._suppressClickTimer);
		this._suppressClickTimer = null;
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	_reset() {
		this._active = false;
		this._moved = false;
		this._pointerId = null;
		this._stateTarget?.classList.remove('is-panning');
	}
}

export default _panning;
