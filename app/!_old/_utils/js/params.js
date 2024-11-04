export default {
	get: function (params, element) {
		const jsonParams = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {};

	}
}