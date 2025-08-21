import {mergeDeepObject, normalizeData} from "../functions";
import {Classes} from "../dom/manipulator";

/**
 * Класс Placement, определяет и устанавливает местоположение элемента на странице.
 * TODO класс не дописан, не определяет сверху и снизу
 */

const CLASS_NAME_RIGHT   = 'right';
const CLASS_NAME_LEFT    = 'left';
const CLASS_NAME_TOP     = 'top';
const CLASS_NAME_BOTTOM  = 'bottom';

class Placement {
	constructor(arg = {}) {
		this.params = mergeDeepObject({
			element: null,
			drop: null
		}, arg);

		this._drop = null;
		this.drop = this.params.drop;

		this._element = null;
		this.element = this.params.element;

		if (!this.drop) return false;
	}

	get drop() {
		return this._drop;
	}

	set drop(el) {
		if (!el) return;
		this._drop = el;
	}

	get element() {
		return this._element;
	}

	set element(el) {
		if (!el) {
			if (this.drop) {
				this._element = this.drop.parentNode;
			}
		}

		this._element = el;
	}

	_setPlacement() {
		let rect = this._isElementInViewport(this.drop);

		if (!rect.isView) {
			if (!rect.isViewRight) {
				Classes.remove(this.drop, CLASS_NAME_LEFT);
				Classes.add(this.drop, CLASS_NAME_RIGHT);
			}

			if (!rect.isViewLeft) {
				Classes.remove(this.drop, CLASS_NAME_RIGHT);
				Classes.add(this.drop, CLASS_NAME_LEFT);
			}

			if (!rect.isViewTop) {
				Classes.remove(this.drop, CLASS_NAME_BOTTOM);
				Classes.add(this.drop, CLASS_NAME_TOP);
			}

			if (!rect.isViewBottom) {
				Classes.remove(this.drop, CLASS_NAME_TOP);
				Classes.add(this.drop, CLASS_NAME_BOTTOM);
			}
		}
	}

	_getPlacement() {
		const _this = this;
		const _parent = (self) => {
			let parent = self.parentNode,
				overflow = getComputedStyle(parent).overflow;

			if (parent.tagName !== 'BODY') {
				if (overflow === 'visible') {
					_parent(parent)
				} else {
					return parent;
				}
			} else {
				return null;
			}
		}

		let isFixed = false, top, left,
			bounds = _this.params.drop.getBoundingClientRect(),
			parent = _this.params.element.getBoundingClientRect();

		if (_parent(_this.params.element)) {
			isFixed = true;
			top = bounds.top;
			left = bounds.left;
		} else {
			let styles = getComputedStyle(_this.params.drop);
			top = normalizeData(styles.top.slice(0, -2));
			left = normalizeData(styles.left.slice(0, -2));
		}

		if ((bounds.left + bounds.width) > window.innerWidth) {
			left = parent.width - bounds.width;
		}

		return {
			isFixed: isFixed,
			top: top,
			left: left
		}
	}

	_isElementInViewport(element) {
		const rect = element.getBoundingClientRect();
		const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		return {
			isView: (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= viewportHeight &&
				rect.right <= viewportWidth
			),
			isViewRight: rect.right <= viewportWidth,
			isViewLeft: rect.left >= 0,
			isViewTop: rect.top >= 0,
			isViewBottom: rect.bottom <= viewportHeight,
		};
	}
}

export default Placement;