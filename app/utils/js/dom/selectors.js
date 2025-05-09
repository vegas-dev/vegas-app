/**
 * Работа с DOM
 * @param selector
 * @returns {*}
 */
import {isElement} from "../functions";

const parseSelector = selector => {
	if (selector && window.CSS && window.CSS.escape) {
		selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`)
	}

	return selector
}

const getSelector = element => {
	let selector = element.getAttribute('data-vg-target');

	if (!selector || selector === '#') {
		let hrefAttribute = element.getAttribute('href');
		if (!hrefAttribute || (!hrefAttribute.includes('#') && !hrefAttribute.startsWith('.'))) {
			return null;
		}

		if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
			hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
		}

		selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
	}

	return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
}

const Selectors = {
	find(selector, element = document.documentElement) {
		if (isElement(selector)) {
			return selector;
		} else {
			return Element.prototype.querySelector.call(element, selector);
		}
	},

	findAll(selector, container = document.documentElement) {
		return [].concat(...Element.prototype.querySelectorAll.call(container, selector));
	},

	getSelectorFromElement(element) {
		const selector = getSelector(element);
		if (selector) return Selectors.find(selector) ? selector : null
		return null
	},

	getElementFromSelector(element) {
		const selector = getSelector(element);
		return selector ? Selectors.find(selector) : null
	},

	getMultipleElementsFromSelector(element) {
		const selector = getSelector(element);
		return selector ? Selectors.findAll(selector) : []
	},

	prev(element) {
		return element.previousElementSibling || null
	}
}

export default Selectors;