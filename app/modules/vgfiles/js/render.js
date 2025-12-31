import { isElement, normalizeData } from "../../../utils/js/functions";
import Params from "../../../utils/js/components/params";
import Selectors from "../../../utils/js/dom/selectors";
import { Classes, Manipulator } from "../../../utils/js/dom/manipulator";

class VGFilesTemplateRender {
	constructor(vgFilesInstance, element, params = {}) {
		this.module = vgFilesInstance;
		this.element = isElement(element);

		if (!this.element) {
			console.error('Invalid element provided:', element);
			return;
		}

		this._params = new Params(params, element).get();
		this._nodes = {
			info: this.module._nodes.info,
			drop: this.module._nodes.drop
		};

		this.bufferTemplate = '';
		this.parsedFiles = [];
	}

	init() {
		const $targetNode = this._nodes.info || this._nodes.drop;
		if (!$targetNode) return false;

		const area = this._nodes.info ? 'info' : 'drop';
		return this._nativeRenderFiles(area, $targetNode);
	}

	_nativeRenderFiles(area, $node) {
		const $list = Selectors.find(`.vg-files-${area}--list`, $node);
		if (!$list) return false;

		const $items = Array.from($list.children).filter(li => li.tagName === 'LI');
		if ($items.length === 0) return false;

		// Сохраняем шаблон только один раз
		this._setTemplateInBuffer($items);

		if (!this.bufferTemplate) return false;

		// Парсим данные файлов
		this.parsedFiles = $items
			.map(li => {
				const rawData = Manipulator.get(li, 'data-file');
				if (!rawData) return null;

				const dataFile = normalizeData(rawData);
				const requiredKeys = ['id', 'name', 'size', 'type', 'src'];
				const isValid = requiredKeys.every(key => dataFile.hasOwnProperty(key));

				return isValid ? dataFile : null;
			})
			.filter(Boolean); // Убираем null

		return true;
	}

	_setTemplateInBuffer($items) {
		if (this.bufferTemplate || $items.length === 0) return;

		const firstItem = $items[0];

		// Если нет data-file — шаблон извлекается и элемент удаляется
		if (!Manipulator.has(firstItem, 'data-file')) {
			this.bufferTemplate = firstItem.outerHTML;
			firstItem.remove();
		} else {
			this.bufferTemplate = firstItem.outerHTML;
		}
	}

	dispose() {
		this.bufferTemplate = '';
		this.parsedFiles = [];
	}
}

export default VGFilesTemplateRender;