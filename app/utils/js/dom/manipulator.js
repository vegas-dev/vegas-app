import {isElement, normalizeData} from "../functions";

/**
 * Манипуляции с атрибутами у элемента:
 * get (элемент, имя, флаг - вырезать data-) - метод выбирает значение атрибута по его имени, если в поле имени передать 'data' -> будут выбраны только дата атрибуты, если 'all' -> метод вернет значение всех атрибутов
 * has (элемент, имя) - есть ли атрибут у элемента
 * set (элемент, имя, значение) - установка у элемента атрибута или его изменение
 * remove (элемент, имя) - удаляет атрибут у элемента
 * hide(элемент) - скрыть элемент
 * show(элемент) - показать элемент
 */
const Manipulator = {
	get(element, nameAttribute = 'data', isRemoveDataName = true) {
		if (!element) {
			return {}
		}

		if (nameAttribute === 'data') {
			let elmBase = ['data-vg-toggle', 'data-vg-target', 'data-vg-dismiss'],
				attributes = {};

			let arr = [].filter.call(element.attributes, function (at) {
				return /^data-/.test(at.name);
			});

			if (arr.length) {
				arr.forEach(function (v) {
					let name = v.name;

					if (!elmBase.includes(name)) {
						if (isRemoveDataName) name = name.slice(5);
						attributes[name] = normalizeData(v.value)
					}
				});
			}

			return attributes;
		} else if (nameAttribute === 'all') {
			return element.getAttributeNames().reduce((acc, name) => {
				return {...acc, [name]: element.getAttribute(name)};
			}, {});
		} else {
			return element.getAttribute(nameAttribute);
		}
	},

	has(element, nameAttribute) {
		return element.hasAttribute(nameAttribute);
	},

	set(element, name, value) {
		if (isElement(element) && name) {
			element.setAttribute(name, value);
		}
	},

	remove(element, nameAttribute) {
		if (isElement(element) && nameAttribute) {
			element.removeAttribute(nameAttribute);
		}
	},

	hide(el) {
		el.style.display = 'none';
	},

	show(el, state = 'block') {
		el.style.display = state;
	},
}

export {Manipulator}
