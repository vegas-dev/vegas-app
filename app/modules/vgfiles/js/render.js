import {isElement, normalizeData} from "../../../utils/js/functions";
import Params from "../../../utils/js/components/params";
import Selectors from "../../../utils/js/dom/selectors";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";
import data from "../../../utils/js/dom/data";

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
		this.bufferTemplate = '';
		this.fileObjData = {};
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

		const $items = Array.from($list.querySelectorAll('li'));
		if (!$items.length) return false;

		this._setTemplateInBuffer($items);
		if (!this.bufferTemplate) return false;

		if (!$items.length) return false;
		Classes.add(this._nodes.info, 'show')

		$items.forEach((li, i) => {
			if (!Classes.has(li, 'file')) Classes.add(li, 'file');
		});

		return true;
	}

	_nativeRenderFilesDrop() {
		return false
	}

	_setTemplateInBuffer($items) {
		if (!$items.length) return;

		let first = $items[0];

		if (Manipulator.has(first, 'data-file')) {
			this.fileObjData = normalizeData(Manipulator.get(first, 'data-file'));
		}

		if (!this.fileObjData) {
			this.bufferTemplate = first.outerHTML;
			first.remove();
			$items.shift();
		} else {
			this.bufferTemplate = first.outerHTML;
		}
	}

	dispose() {
		this.bufferTemplate.clear();
	}
}

export default VGFilesTemplateRender;