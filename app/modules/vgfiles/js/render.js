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
		Classes.add(this._nodes.info, 'show');

		const parsed = [];

		$items.forEach((li, i) => {
			const rawDataFile = normalizeData(Manipulator.get(li, 'data-file'));
			if (!rawDataFile) return;

			let dataFile = normalizeData(rawDataFile),
				rulesData = ['id', 'name', 'size', 'type', 'src'];

			let isNonFound = !rulesData.every(rule => dataFile.hasOwnProperty(rule));
			if (isNonFound) return;

			parsed.push(dataFile);

			Manipulator.set(li, 'data-name', dataFile.name);
			Manipulator.set(li, 'data-size', dataFile.size);
			Manipulator.set(li, 'data-id', dataFile.id);
			Manipulator.set(li, 'data-type', dataFile.type);
			if ('lastModified' in dataFile) Manipulator.set(li, 'data-last-modified', dataFile.lastModified);

			const renderClasses = [];
			if (this._params.image) renderClasses.push('with-image');
			if (this._params.info) renderClasses.push('with-info');
			if (this._params.detach) renderClasses.push('with-remove');
			if (this._params.sortable?.enabled) renderClasses.push('with-sortable');

			if (this._params.ajax) {
				this.module._uploadedKeys.add(this.module._getFileKey(dataFile));
			}

			const preservedStateClasses = [
				'loaded',
				'loading',
				'pending',
				'failing',
				'completed'
			].filter(c => li.classList.contains(c));

			li.className = ['file', ...renderClasses, ...preservedStateClasses].join(' ');
			Classes.add(li, 'loaded');

			const parts = {
				image: Selectors.find('.file-image', li),
				info: Selectors.find('.file-info', li),
				remove: Selectors.find('.file-remove', li)
			};

			if (!parts.image) {
				parts.image = this.module._renderUIImage(dataFile);
				li.prepend(parts.image);
			}

			this.module._updateStat();
		});

		/*console.log(parsed)*/

		return true;
	}

	_nativeRenderFilesDrop() {
		return false
	}

	_setTemplateInBuffer($items) {
		if (!$items.length) return;
		if (this.bufferTemplate) return;

		let first = $items[0],
			fileObjData = {};

		if (Manipulator.has(first, 'data-file')) {
			fileObjData = normalizeData(Manipulator.get(first, 'data-file'));
		}

		if (!fileObjData) {
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