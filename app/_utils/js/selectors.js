import {isElement} from "./functions";

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

		let target = getSelector(_selector);
		if (!target) return null;

		let _targetSelector = Selectors.findOne(target);
		if (_targetSelector) return  _targetSelector;

		return null;
	}
}

export default Selectors;