import {mergeDeepObject, normalizeData} from "../functions";

/**
 * Класс Placement, определяет и устанавливает местоположение элемента на странице.
 * TODO класс не дописан
 */

class Placement {
	constructor(arg = {}) {
		this.params = mergeDeepObject({
			element: null,
			drop: null
		}, arg);
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
}

export default Placement;