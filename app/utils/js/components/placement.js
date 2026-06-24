import {mergeDeepObject} from "../functions";

class Placement {
	constructor(config) {
		this.reference = config.reference;
		this.drop = config.drop;
		this.offset = config.offset || [0, 0];
		this.boundary = config.boundary || 'viewport';
		this.autoFlip = config.autoFlip !== false;
		this.overflowProtection = config.overflowProtection !== false;
		this.placement = config.placement || 'bottom';
		this.fallbackPlacements = config.fallbackPlacements || [];

		this.clamp = config.clamp === true;
		this.clampPadding = config.clampPadding ?? 8;
		this.isMerge = config.isMerge !== false;
	}

	_getPlacementRect(element) {
		return element.getBoundingClientRect();
	}

	_getViewportRect() {
		const doc = document.documentElement;

		return {
			width: doc.clientWidth,
			height: doc.clientHeight,
			left: 0,
			top: 0,
			right: doc.clientWidth,
			bottom: doc.clientHeight
		};
	}

	_getOverflowConstraints() {
		const refRect = this._getPlacementRect(this.reference);
		const dropRect = this._getPlacementRect(this.drop);
		const viewRect = this._getViewportRect();
		const [xOffset, yOffset] = this.offset;

		let placement = this.placement;

		if (this.overflowProtection) {
			const fallbacks = [this.placement, ...this.fallbackPlacements];
			let best = null;

			for (const p of fallbacks) {
				const position = this._calculatePosition(p, refRect, dropRect, xOffset, yOffset);
				const overflow = this._calculateOverflow(position, dropRect, viewRect);

				if (!best || overflow < best.overflow) {
					best = { placement: p, position, overflow };

					if (overflow === 0) break;
				}
			}

			placement = best.placement;

			const finalPosition = this.clamp
				? this._clampPosition(best.position, dropRect, viewRect)
				: best.position;

			this._setStyles(finalPosition);
		} else {
			const position = this._calculatePosition(placement, refRect, dropRect, xOffset, yOffset);

			const finalPosition = this.clamp
				? this._clampPosition(position, dropRect, viewRect)
				: position;

			this._setStyles(finalPosition);
		}

		this.drop.setAttribute('data-vg-placement', placement);
	}

	_calculatePosition(placement, refRect, dropRect, xOffset = 0, yOffset = 0) {
		let top;
		let left;

		switch (placement) {
			case 'top':
				top = refRect.top - dropRect.height - yOffset;
				left = refRect.left + (refRect.width - dropRect.width) / 2;
				break;

			case 'top-start':
				top = refRect.top - dropRect.height - yOffset;
				left = refRect.left + xOffset;
				break;

			case 'top-end':
				top = refRect.top - dropRect.height - yOffset;
				left = refRect.right - dropRect.width - xOffset;
				break;

			case 'bottom':
				top = refRect.bottom + yOffset;
				left = refRect.left + (refRect.width - dropRect.width) / 2;
				break;

			case 'bottom-start':
				top = refRect.bottom + yOffset;
				left = refRect.left + xOffset;
				break;

			case 'bottom-end':
				top = refRect.bottom + yOffset;
				left = refRect.right - dropRect.width - xOffset;
				break;

			case 'left':
				top = refRect.top + (refRect.height - dropRect.height) / 2;
				left = refRect.left - dropRect.width - xOffset;
				break;

			case 'left-start':
				top = refRect.top + yOffset;
				left = refRect.left - dropRect.width - xOffset;
				break;

			case 'left-end':
				top = refRect.bottom - dropRect.height - yOffset;
				left = refRect.left - dropRect.width - xOffset;
				break;

			case 'right':
				top = refRect.top + (refRect.height - dropRect.height) / 2;
				left = refRect.right + xOffset;
				break;

			case 'right-start':
				top = refRect.top + yOffset;
				left = refRect.right + xOffset;
				break;

			case 'right-end':
				top = refRect.bottom - dropRect.height - yOffset;
				left = refRect.right + xOffset;
				break;

			default:
				top = refRect.bottom + yOffset;
				left = refRect.left + xOffset;
		}

		return { top, left };
	}

	_calculateOverflow(pos, dropRect, viewRect) {
		let overflow = 0;

		if (pos.left < viewRect.left) {
			overflow += viewRect.left - pos.left;
		}

		if (pos.top < viewRect.top) {
			overflow += viewRect.top - pos.top;
		}

		if (pos.left + dropRect.width > viewRect.right) {
			overflow += (pos.left + dropRect.width) - viewRect.right;
		}

		if (pos.top + dropRect.height > viewRect.bottom) {
			overflow += (pos.top + dropRect.height) - viewRect.bottom;
		}

		return overflow;
	}

	_clampPosition(pos, dropRect, viewRect) {
		const padding = this.clampPadding;

		const maxTop = viewRect.bottom - dropRect.height - padding;
		const maxLeft = viewRect.right - dropRect.width - padding;

		return {
			top: Math.min(
				Math.max(pos.top, viewRect.top + padding),
				maxTop
			),
			left: Math.min(
				Math.max(pos.left, viewRect.left + padding),
				maxLeft
			)
		};
	}

	_setStyles(pos) {
		if (!pos || !this.drop) return;

		if (this.isMerge) {
			mergeDeepObject(this.drop.style, {
				position: 'absolute',
				top: `${pos.top + window.pageYOffset}px`,
				left: `${pos.left + window.pageXOffset}px`,
				margin: '0'
			});
		} else {
			this.drop.style.position = 'absolute';
			this.drop.style.top = `${pos.top + window.pageYOffset}px`;
			this.drop.style.left = `${pos.left + window.pageXOffset}px`;
			this.drop.style.margin = '0';
		}
	}

	_setPlacement() {
		this._getOverflowConstraints();
	}
}

export default Placement;