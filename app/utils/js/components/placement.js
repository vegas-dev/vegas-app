import {mergeDeepObject, normalizeData} from "../functions";
import Selectors from "../dom/selectors";

/**
 * Класс Placement, определяет и устанавливает местоположение элемента на странице.
 * TODO класс не дописан, не определяет сверху и снизу
 */

const CLASS_NAME_RIGHT = 'right';
const CLASS_NAME_LEFT  = 'left';

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
		this.drop.classList.remove(CLASS_NAME_RIGHT);
		this.drop.classList.remove(CLASS_NAME_LEFT);

		if (this._isElementInViewport(this.drop)) {
			this.drop.classList.add(CLASS_NAME_LEFT);
		} else {
			this.drop.classList.add(CLASS_NAME_RIGHT);
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

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= viewportHeight &&
			rect.right <= viewportWidth
		);
	}
}

export default Placement;