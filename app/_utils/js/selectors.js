import {isElement} from "./functions";

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
	let selector = element.getAttribute('data-vg-target')

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

	findAll(selector, container = document.documentElement) {
		return Selectors.get(selector, container, true);
	},

	prev(element, selector) {
		let previous = element.previousElementSibling

		while (previous) {
			if (previous.matches(selector)) {
				return [previous]
			}

			previous = previous.previousElementSibling
		}

		return []
	},

	next(element, selector) {
		let next = element.nextElementSibling;

		while (next) {
			if (next.matches(selector)) {
				return [next]
			}

			next = next.nextElementSibling
		}

		return []
	},

	getTargetFromSelector(selector) {
		let _selector = null;

		if (isElement(selector)) {
			_selector = selector;
		} else if (typeof selector === 'string') {
			_selector = Selectors.find(selector);
		}

		let target = getSelector(_selector);
		if (!target) return null;

		let _targetSelector = Selectors.find(target);
		if (_targetSelector) return  _targetSelector;

		return null;
	}
}

export default Selectors;