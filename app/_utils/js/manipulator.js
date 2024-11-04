import {isElement, normalizeData} from "./functions";

/**
 * Манипуляции с элементом
 */
const Manipulator = {
	getDataAttributes(element, isRemoveDataName = true) {
		if (!element) {
			return {}
		}

		let elmBase = ['data-vg-toggle', 'data-vg-target'],
			attributes= {},
			arr = [].filter.call(element.attributes, function (at) {
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

		return attributes
	},

	getAttribute: function (element, nameAttribute) {
		if (!element && !nameAttribute) {
			return ''
		}
		return normalizeData(element.getAttribute(nameAttribute));
	},

	removeAttribute: function (element, nameAttribute) {
		if (isElement(element) && nameAttribute) {
			element.removeAttribute(nameAttribute);
		}
	}
}

export {Manipulator}
