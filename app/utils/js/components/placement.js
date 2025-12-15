import {mergeDeepObject, normalizeData} from "../functions";
import {Classes} from "../dom/manipulator";

/**
 * Класс Placement, определяет и устанавливает местоположение элемента на странице.
 */

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

		this._builtInPlacements = {
			top: 'top',
			'top-start': 'top-start',
			'top-end': 'top-end',
			bottom: 'bottom',
			'bottom-start': 'bottom-start',
			'bottom-end': 'bottom-end',
			left: 'left',
			'left-start': 'left-start',
			'left-end': 'left-end',
			right: 'right',
			'right-start': 'right-start',
			'right-end': 'right-end'
		};
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

			for (let p of fallbacks) {
				let pos = this._calculatePosition(p, refRect, dropRect, xOffset, yOffset);
				let overflow = this._calculateOverflow(pos, viewRect);

				if (!best || overflow < best.overflow) {
					best = { placement: p, position: pos, overflow };
					if (overflow === 0) break;
				}
			}

			placement = best.placement;
			this._setStyles(best.position);
		} else {
			const pos = this._calculatePosition(placement, refRect, dropRect, xOffset, yOffset);
			this._setStyles(pos);
		}

		this.drop.setAttribute('data-vg-placement', placement);
	}

	_calculatePosition(placement, refRect, dropRect, xOffset = 0, yOffset = 0) {
		let top, left;

		switch (placement) {
			case 'top':
			case 'top-start':
				top = refRect.top - dropRect.height - yOffset;
				left = placement === 'top-start' ? refRect.left + xOffset : refRect.left + (refRect.width - dropRect.width) / 2;
				break;
			case 'top-end':
				top = refRect.top - dropRect.height - yOffset;
				left = refRect.right - dropRect.width - xOffset;
				break;
			case 'bottom':
			case 'bottom-start':
				top = refRect.bottom + yOffset;
				left = placement === 'bottom-start' ? refRect.left + xOffset : refRect.left + (refRect.width - dropRect.width) / 2;
				break;
			case 'bottom-end':
				top = refRect.bottom + yOffset;
				left = refRect.right - dropRect.width - xOffset;
				break;
			case 'left':
				top = refRect.top + (refRect.height - dropRect.height) / 2;
				left = refRect.left - dropRect.width - xOffset;
				break;
			case 'right':
				top = refRect.top + (refRect.height - dropRect.height) / 2;
				left = refRect.right + xOffset;
				break;
			default:
				top = refRect.bottom + yOffset;
				left = refRect.left + xOffset;
		}

		return { top, left };
	}

	_calculateOverflow(pos, viewRect) {
		let overflow = 0;
		if (pos.left < viewRect.left) overflow += viewRect.left - pos.left;
		if (pos.top < viewRect.top) overflow += viewRect.top - pos.top;
		if (pos.left + this.drop.offsetWidth > viewRect.right) overflow += (pos.left + this.drop.offsetWidth) - viewRect.right;
		if (pos.top + this.drop.offsetHeight > viewRect.bottom) overflow += (pos.top + this.drop.offsetHeight) - viewRect.bottom;
		return overflow;
	}

	_setStyles(pos) {
		mergeDeepObject(this.drop.style, {
			position: 'absolute',
			top: `${pos.top}px`,
			left: `${pos.left}px`,
			margin: 0
		})
	}

	_setPlacement() {
		this._getOverflowConstraints();
	}
}

export default Placement;