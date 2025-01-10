import {isElement} from "../functions";

/**
 * Работа с DOM
 * TODO переработать константу Selectors
 * @param selector
 * @returns {*}
 */

const parseSelector = selector => {
	if (selector && window.CSS && window.CSS.escape) {
		selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`)
	}

	return selector
}

const getSelector = element => {
	let selector = element.getAttribute('data-vg-target');

	if (!selector || selector === '#') {
		let hrefAttribute = element.getAttribute('href')
		if (!hrefAttribute || (!hrefAttribute.includes('#') && !hrefAttribute.startsWith('.'))) {
			return null
		}

		if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
			hrefAttribute = `#${hrefAttribute.split('#')[1]}`
		}

		selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null
	}

	return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null
}

const Selectors = {
	get(selector, container, isAll = false) {
		if (!selector) {
			throw new Error('Товарищ! Первый параметр не должен быть пустым!');
		} else {
			if (typeof selector === 'string') {
				let elm;

				if (isAll) {
					elm = [].concat(...Element.prototype.querySelectorAll.call(container, selector));
				} else {
					elm = Element.prototype.querySelector.call(container, selector);
				}

				if (elm) return elm; else throw new Error('Ахпер! Не удалось найти элемент');
			} else if (!isAll && isElement(selector)) {
				return selector;
			} else {
				throw new Error('КЭП! Какая-то дичь к нам залетела');
			}
		}
	},

	find(selector, container = document.documentElement) {
		return Selectors.get(selector, container);
	},

	findOne(selector, element = document.documentElement) {
		return Element.prototype.querySelector.call(element, selector)
	},

	findAll(selector, container = document.documentElement) {
		return Selectors.get(selector, container, true);
	},

	getSelectorFromElement(element) {
		const selector = getSelector(element);

		if (selector) {
			return Selectors.find(selector) ? selector : null
		}

		return null
	},

	getElementFromSelector(element) {
		const selector = getSelector(element)
		return selector ? Selectors.find(selector) : null
	},
}

export default Selectors;