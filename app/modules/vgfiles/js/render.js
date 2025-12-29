import BaseModule from "../../base-module";

const NAME = 'files-template-render';
const NAME_KEY = `vg.${NAME}`;

class VGFilesTemplateRender extends BaseModule{
	constructor(element, params = {}) {
		super(element, params);
		this.module = null;
	}
	static get NAME_KEY() { return NAME_KEY; }

	init(module = null) {
		this.module = module;


	}
}

export default VGFilesTemplateRender;