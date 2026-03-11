import { isElement, normalizeData } from "../../../utils/js/functions";
import Params from "../../../utils/js/components/params";
import Selectors from "../../../utils/js/dom/selectors";
import { Manipulator } from "../../../utils/js/dom/manipulator";

class VGFilesTemplateRender {
	constructor(vgFilesInstance, element, params = {}) {
		this.module = vgFilesInstance;
		this.element = isElement(element) ? element : null;

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

		this._setTemplateInBuffer($items);
		if (!this.bufferTemplate) return false;

		this.parsedFiles = $items
			.map(li => {
				const rawData = Manipulator.get(li, 'data-file');
				if (!rawData) return null;

				return this._parseDataFile(rawData);
			})
			.filter(Boolean);

		return true;
	}

	_parseDataFile(rawData) {
		const dataFile = normalizeData(rawData);
		if (!dataFile || typeof dataFile !== 'object' || Array.isArray(dataFile)) return null;

		const binaryMeta = this._extractBinaryMeta(dataFile);
		const name = this._toStringOrNull(dataFile.name);
		const id = this._toStringOrNull(dataFile.id);
		const src = this._toStringOrNull(dataFile.src);
		const type = this._toStringOrNull(dataFile.type) || binaryMeta.type || 'application/octet-stream';
		const size = this._toNumberOrNull(dataFile.size) ?? binaryMeta.size ?? 0;
		const lastModified = this._toNumberOrNull(dataFile.lastModified ?? dataFile['last-modified']) ?? binaryMeta.lastModified ?? Date.now();

		const result = {
			id,
			name,
			size,
			type,
			src,
			lastModified
		};

		if (dataFile.image !== undefined && dataFile.image !== null && dataFile.image !== '') {
			result.image = dataFile.image;
		}

		const requiredKeys = ['id', 'name', 'size', 'type', 'src'];
		const isValid = requiredKeys.every((key) => {
			const value = result[key];
			if (key === 'size') return Number.isFinite(value);
			return value !== undefined && value !== null && value !== '';
		});

		if (!isValid) return null;

		const customData = {};
		const reserved = new Set(['id', 'name', 'size', 'type', 'src', 'image', 'lastModified', 'last-modified']);

		Object.entries(dataFile).forEach(([key, value]) => {
			if (reserved.has(key)) return;
			if (value === undefined || value === null || value === '') return;
			customData[key] = value;
		});

		if (Object.keys(customData).length) {
			result.customData = customData;
		}

		return result;
	}

	_extractBinaryMeta(dataFile) {
		const binary = dataFile.file || dataFile.blob || dataFile.originFile || null;
		if (!(binary instanceof Blob)) return {};

		const size = this._toNumberOrNull(binary.size);
		const type = this._toStringOrNull(binary.type);
		const lastModified = (binary instanceof File)
			? this._toNumberOrNull(binary.lastModified)
			: null;

		return {
			size: size ?? null,
			type: type || null,
			lastModified: lastModified ?? null
		};
	}

	_toStringOrNull(value) {
		if (value === undefined || value === null) return null;
		const normalized = String(value).trim();
		return normalized ? normalized : null;
	}

	_toNumberOrNull(value) {
		if (value === undefined || value === null || value === '') return null;
		const normalized = Number(value);
		return Number.isFinite(normalized) ? normalized : null;
	}

	_setTemplateInBuffer($items) {
		if (this.bufferTemplate || $items.length === 0) return;

		const firstItem = $items[0];

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
