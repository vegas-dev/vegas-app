import {isElement} from "./functions";
import {Manipulator} from "./manipulator";

const Selectors = {
	get(el, container) {
		if (!el) {
			throw new Error('Товарищ! Первый параметр не должен быть пустым!');
		} else {
			if (typeof el === 'string') {
				let elm = isElement(container) ? Selectors.findOne(el, container) : Selectors.findOne(el);
				if (elm) return elm;
				else throw new Error('Ахпер! Не удалось найти элемент');
			} else if (isElement(el)) {
				return el;
			} else {
				throw new Error('КЭП! Какая-то дичь к нам залетела');
			}
		}
	},

	findAll(selector, element = document.documentElement) {
		return [].concat(...Element.prototype.querySelectorAll.call(element, selector))
	},

	findOne(selector, element = document.documentElement) {
		return Element.prototype.querySelector.call(element, selector)
	},

	getTargetFromSelector(selector) {
		let _selector = null;

		if (isElement(selector)) {
			_selector = selector;
		} else if (typeof selector === 'string') {
			_selector = Selectors.findOne(selector);
		}

		let target = Manipulator.getAttribute(_selector,'href') || Manipulator.getAttribute(_selector,'data-vg-target') || '';
		if (target) {
			return Selectors.findOne(target);
		}
	}
}

export default Selectors;