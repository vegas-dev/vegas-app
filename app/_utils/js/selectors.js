import {isElement} from "./functions";

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
	}
}

export default Selectors;