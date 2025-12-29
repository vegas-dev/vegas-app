import {isElement} from "../../../utils/js/functions";
import Params from "../../../utils/js/components/params";
import Selectors from "../../../utils/js/dom/selectors";
import {Manipulator} from "../../../utils/js/dom/manipulator";

class VGFilesTemplateRender {
	constructor(vgFilesInstance, element, params = {}) {
		this.module = vgFilesInstance;
		this.element = isElement(element);

		if (!this.element) return console.error('Element is not valid', element);
		this._params = new Params(params, element).get();
		this._nodes = {
			info: this.module._nodes.info,
			drop: this.module._nodes.drop
		}
		this.bufferTemplate = new Set();
	}

	init() {
		return this._nativeRenderFiles();
	}

	_nativeRenderFiles() {
		const $info = this._nodes.info;
		if ($info) return this._nativeRenderFilesInfo();

		const $drop = this._nodes.drop;
		if ($drop) return this._nativeRenderFilesDrop();
	}

	_nativeRenderFilesInfo() {
		const $list = Selectors.find(`.vg-files-info--list`, this._nodes.info);
		if (!$list) return;

		this.bufferTemplate.add([... Selectors.findAll('li', $list)].map((item) => {
			if (Manipulator.has(item, 'data-file') && !Manipulator.get(item, 'data-file')) {
				return item;
			}
		}));

		console.log(this.bufferTemplate)

		return false;
	}

	_nativeRenderFilesDrop() {
		return false
	}

	dispose() {
		this.bufferTemplate.clear();
	}
}

export default VGFilesTemplateRender;