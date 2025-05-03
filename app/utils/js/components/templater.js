import {execute, mergeDeepObject} from "../functions";

let templates = [
	{type: 'collapse', template: ''},
	{type: 'modal', template: ''},
	{type: 'pass', template: '<span data-vg-toggle="vgpass" title="Показать / Скрыть" data-bs-toggle="tooltip"><i class="fal fa-eye"></i></span>'},
]


class Templater {
	constructor(el, params = {}) {
		if (!el) {
			throw new Error('Element is required');
		}

		this._element = el;
		this._params = mergeDeepObject({
			insert: 'after',
		}, params);

		this.templateBuild = null;
	}

	render(content, callback) {
		return this.toHTML(content, callback);
	}

	toHTML(content = '' | null, callback) {
		let tmpl = ''

		if (Array.isArray(this._element)) {

		} else {
			
		}
		execute(callback, [this._element, this._params, tmpl]);

		return tmpl;
	}

	setContent() {

	}
}

export default Templater;