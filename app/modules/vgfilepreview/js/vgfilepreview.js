import BaseModule from "../../base-module";
import {mergeDeepObject} from "../../../utils/js/functions";
import FilePreviewHelper from "../../../utils/js/components/file-preview";
import {getSVG} from "../../module-fn";
import createFilePreviewRenderers from "./renderers";
import {createFilePreviewI18n, resolveFilePreviewLang} from "./i18n";

const NAME = 'filepreview';
const NAME_KEY = 'vg.filepreview';

class VGFilePreview extends BaseModule {
	constructor(el, params = {}) {
		super(el, params);

		this._params = this._getParams(el, mergeDeepObject({
			validate: true,
			lang: 'ru'
		}, params));

		this._filePath = '';
		this._fileUrl = null;
		this._isValid = false;
		this._fileMeta = {};
		this._fields = [];
		this._editableFields = {};
		this._helper = new FilePreviewHelper(this._element);
		this._renderers = createFilePreviewRenderers();
		this._lang = resolveFilePreviewLang(this._params.lang, this._element);
		this._i18n = createFilePreviewI18n(this._lang);

		this.init();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	get filePath() {
		return this._filePath;
	}

	get fileUrl() {
		return this._fileUrl;
	}

	get isValid() {
		return this._isValid;
	}

	get fileMeta() {
		return this._fileMeta;
	}

	get fields() {
		return this._fields;
	}

	get editableFields() {
		return this._editableFields;
	}

	init() {
		const filePath = this._helper.getFilePath();
		this._filePath = filePath;

		if (this._params.validate) {
			const validation = this._helper.validateFilePath(filePath);
			this._isValid = validation.isValid;
			this._fileUrl = validation.fileUrl;
		} else {
			this._isValid = true;
			this._fileUrl = null;
		}

		this._helper.syncState(this._isValid);

		if (!this._isValid) {
			return false;
		}

		this._fileMeta = this._helper.getFileMeta(this._filePath);
		return this.preview();
	}

	preview() {
		this._setState('loading');
		this._fields = this._helper.getFields();
		this._editableFields = this._helper.resolveEditableFields(this._fields);
		this._helper.syncEditableFields(this._editableFields);
		this._renderIcon();
		this._renderTextFields();
		this._renderDownloadField();
		this._renderPreview();

		return this._editableFields;
	}

	_renderIcon() {
		const iconField = this._editableFields.icon;
		if (!iconField) {
			return;
		}

		const icon = getSVG(this._filePath);
		if (!icon) {
			return;
		}

		iconField.innerHTML = icon;
	}

	_renderTextFields() {
		const nameField = this._editableFields.name;
		if (nameField && this._fileMeta.name) {
			nameField.textContent = this._fileMeta.name;
		}

		const extField = this._editableFields.ext;
		if (extField && this._fileMeta.ext) {
			extField.textContent = this._fileMeta.ext;
		}

		const sizeField = this._editableFields.size;
		if (sizeField && this._fileMeta.sizeText) {
			sizeField.textContent = this._fileMeta.sizeText;
		}

		const originalNameField = this._editableFields.original_name;
		if (!originalNameField) {
			return;
		}

		if (this._fileMeta.originalName) {
			originalNameField.textContent = this._fileMeta.originalName;
			return;
		}

		if (this._fileMeta.isMedia) {
			originalNameField.textContent = '';
		}
	}

	_renderDownloadField() {
		const downloadField = this._editableFields.download;
		if (!downloadField) {
			return;
		}

		const downloadLabel = this._i18n?.button('download') || '';
		const downloadIcon = getSVG('download') || '';
		const fieldTag = String(downloadField.tagName || '').toUpperCase();
		let control = null;

		if (fieldTag === 'A' || fieldTag === 'BUTTON') {
			control = downloadField;
		} else {
			control = downloadField.querySelector('[data-vg-filepreview-download-control]');
			if (!control) {
				control = document.createElement('button');
				control.type = 'button';
				downloadField.innerHTML = '';
				downloadField.appendChild(control);
			}
		}

		control.classList.add('vg-filepreview-download-trigger');
		control.setAttribute('data-vg-filepreview-download-control', 'true');

		if (fieldTag === 'A' && control === downloadField) {
			control.setAttribute('href', this._fileUrl?.href || this._filePath || '#');
			if (this._fileMeta?.name) {
				control.setAttribute('download', this._fileMeta.name);
			}
		} else if (String(control.tagName || '').toUpperCase() === 'BUTTON') {
			control.setAttribute('type', 'button');
		}

		if (!control.hasAttribute('data-vg-filepreview-download-content-init')) {
			control.setAttribute('data-vg-filepreview-download-content-init', 'true');
			control.innerHTML = '';

			if (downloadIcon) {
				const icon = document.createElement('span');
				icon.className = 'vg-filepreview-download-trigger__icon';
				icon.innerHTML = downloadIcon;
				control.appendChild(icon);
			}

			if (downloadLabel) {
				const text = document.createElement('span');
				text.className = 'vg-filepreview-download-trigger__text';
				text.textContent = downloadLabel;
				control.appendChild(text);
			}
		}

		if (!control.hasAttribute('data-vg-filepreview-download-bind')) {
			control.setAttribute('data-vg-filepreview-download-bind', 'true');
			control.addEventListener('click', (event) => {
				event.preventDefault();
				this._downloadFile();
			});
		}
	}

	_downloadFile() {
		const src = this._fileUrl?.href || this._filePath || '';
		if (!src) {
			return;
		}

		const fileName = this._fileMeta?.originalName || this._fileMeta?.name || 'file';

		fetch(src, {
			method: 'GET',
			credentials: 'same-origin'
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				return response.blob();
			})
			.then((blob) => {
				const objectUrl = URL.createObjectURL(blob);
				this._downloadByLink(objectUrl, fileName);
				setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
			})
			.catch(() => {
				this._downloadByLink(src, fileName);
			});
	}

	_downloadByLink(href, fileName) {
		const link = document.createElement('a');
		link.href = href;
		link.style.display = 'none';
		link.rel = 'noopener noreferrer';
		if (fileName) {
			link.setAttribute('download', fileName);
		}

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	_renderPreview() {
		const previewContainer = this._resolvePreviewContainer();
		if (!previewContainer) {
			this._setState('error');
			return;
		}

		previewContainer.innerHTML = '';

		const context = {
			element: this._element,
			filePath: this._filePath,
			fileUrl: this._fileUrl,
			fileMeta: this._fileMeta,
			previewContainer,
			lang: this._lang,
			i18n: this._i18n
		};

		let rendered = false;
		this._renderers.forEach((renderer) => {
			if (rendered || typeof renderer?.canRender !== 'function' || typeof renderer?.render !== 'function') {
				return;
			}

			if (!renderer.canRender(context)) {
				return;
			}

			try {
				rendered = renderer.render(context) === true;
			} catch (error) {
				rendered = false;
			}
			if (rendered) {
				this._element.setAttribute('data-vg-filepreview-renderer', renderer.name || 'custom');
			}
		});

		if (!rendered) {
			this._element.removeAttribute('data-vg-filepreview-renderer');
			this._setState('empty');
			return;
		}
		this._setState('ready');
	}

	_resolvePreviewContainer() {
		const editablePreview = this._editableFields.preview;
		if (editablePreview) {
			editablePreview.setAttribute('data-vg-filepreview-slot', 'preview');
			return editablePreview;
		}

		const existedPreview = this._element.querySelector('[data-vg-filepreview-slot="preview"]');
		if (existedPreview) {
			this._editableFields.preview = existedPreview;
			return existedPreview;
		}

		const container = document.createElement('div');
		container.className = 'preview';
		container.setAttribute('data-vg-filepreview-slot', 'preview');
		this._element.appendChild(container);
		this._editableFields.preview = container;

		return container;
	}

	static init(element, params = {}) {
		return VGFilePreview.getOrCreateInstance(element, params);
	}

	_setState(state = '') {
		const value = String(state || '').trim();
		if (!value) {
			this._element.removeAttribute('data-vg-filepreview-state');
			return;
		}
		this._element.setAttribute('data-vg-filepreview-state', value);
	}
}

export default VGFilePreview;
