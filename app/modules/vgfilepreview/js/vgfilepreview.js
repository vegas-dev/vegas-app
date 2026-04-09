import BaseModule from "../../base-module";
import {mergeDeepObject} from "../../../utils/js/functions";
import FilePreviewHelper from "../../../utils/js/components/file-preview";
import {extractAudioMetadata} from "../../../utils/js/components/audio-metadata";
import {extractVideoMetadata} from "../../../utils/js/components/video-metadata";
import {getSVG} from "../../module-fn";
import createFilePreviewRenderers from "./renderers";
import ImageModal from "./renderers/image-modal";
import {createFilePreviewI18n, resolveFilePreviewLang} from "./i18n";

const NAME = 'filepreview';
const NAME_KEY = 'vg.filepreview';

class VGFilePreview extends BaseModule {
	constructor(el, params = {}) {
		super(el, params);

		this._params = this._getParams(el, mergeDeepObject({
			validate: true,
			lang: 'ru',
			ui: {
				nameOnly: false
			},
			preview: {
				audio: {enable: true},
				video: {enable: true},
				image: {enable: true},
				archive: {enable: true},
				text: {enable: true},
				office: {enable: true},
				pdf: {enable: true}
			}
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
		this._inlineAudio = null;
		this._inlineAudioSrc = '';
		this._inlineAudioButton = null;
		this._inlineAudioIcon = null;
		this._inlineAudioContainer = null;
		this._audioMetaPromise = null;
		this._audioMetaApplied = false;
		this._audioCoverObjectUrl = '';
		this._videoMetaPromise = null;
		this._videoMetaApplied = false;
		this._videoCoverObjectUrl = '';
		this._imageModal = null;

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
		this._enrichVideoMetadata();
		this._renderPreview();

		return this._editableFields;
	}

	_renderIcon() {
		const iconField = this._editableFields.icon;
		if (!iconField) {
			return;
		}

		const imageSrc = this._getImageIconSrc();
		if (imageSrc) {
			iconField.innerHTML = '';
			const image = document.createElement('img');
			image.src = imageSrc;
			image.alt = this._fileMeta?.originalName || this._fileMeta?.name || '';
			image.className = 'vg-filepreview-icon-image';
			image.loading = 'lazy';
			image.addEventListener('error', () => {
				this._renderDefaultIcon(iconField);
			});
			if (this._isPreviewGroupEnabled('image')) {
				this._bindIconImageToModal(image, imageSrc);
			}
			iconField.appendChild(image);
			return;
		}

		this._renderDefaultIcon(iconField);
	}

	_renderTextFields() {
		const displayName = this._getDisplayName();
		const fileName = this._getFileName();
		const hasDataTitle = this._hasDataDrivenDisplayName();

		const nameField = this._editableFields.name;
		if (nameField) {
			if (this._isAudioFile() && this._isPreviewGroupEnabled('audio')) {
				this._renderAudioNameField(nameField);
				this._element.setAttribute('data-vg-filepreview-renderer', 'audio');
			} else if (displayName) {
				nameField.classList.remove('vg-filepreview-audio-inline');
				nameField.textContent = displayName;
				this._applyNameClampStyles(nameField);
			}
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

		if (hasDataTitle && fileName) {
			originalNameField.textContent = fileName;
			this._applyNameClampStyles(originalNameField);
			return;
		}

		if (this._fileMeta.originalName) {
			originalNameField.textContent = this._fileMeta.originalName;
			this._applyNameClampStyles(originalNameField);
			return;
		}

		if (this._fileMeta.isMedia) {
			originalNameField.textContent = '';
		}
	}

	_renderAudioNameField(nameField) {
		const fileName = this._getDisplayName();
		if (!fileName) {
			return;
		}

		nameField.innerHTML = '';
		nameField.classList.add('vg-filepreview-audio-inline');

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'vg-filepreview-audio-inline__toggle';
		button.setAttribute('aria-label', 'Play/Pause');

		const icon = document.createElement('span');
		icon.className = 'vg-filepreview-audio-inline__icon';
		button.appendChild(icon);

		const text = document.createElement('span');
		text.className = 'vg-filepreview-audio-inline__name';
		text.textContent = fileName;
		this._applyNameClampStyles(text);
		text.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			this._toggleInlineAudio();
		});

		button.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			this._toggleInlineAudio();
		});

		nameField.appendChild(button);
		nameField.appendChild(text);

		this._inlineAudioButton = button;
		this._inlineAudioIcon = icon;
		const rootFile = this._element?.classList?.contains('file')
			? this._element
			: this._element?.closest?.('.file');
		this._inlineAudioContainer = rootFile || this._element || nameField;
		this._setInlineAudioProgress(0);
		const isCurrentAudioPlaying = VGFilePreview._activeAudioOwner === this && this._inlineAudio && !this._inlineAudio.paused;
		this._syncInlineAudioIcon(isCurrentAudioPlaying);
		this._enrichAudioMetadata(text);
	}

	_toggleInlineAudio() {
		if (!this._isPreviewGroupEnabled('audio')) {
			return;
		}

		const src = this._fileUrl?.href || this._filePath || '';
		if (!src || !this._inlineAudioButton) {
			return;
		}

		if (VGFilePreview._activeAudioOwner && VGFilePreview._activeAudioOwner !== this) {
			VGFilePreview._activeAudioOwner._stopInlineAudio();
		}

		if (!this._inlineAudio || this._inlineAudioSrc !== src) {
			this._stopInlineAudio();
			this._inlineAudio = new Audio(src);
			this._inlineAudioSrc = src;
			this._inlineAudio.addEventListener('ended', () => {
				this._syncInlineAudioIcon(false);
				this._setInlineAudioProgress(0);
			});
			this._inlineAudio.addEventListener('timeupdate', () => this._syncInlineAudioProgress());
			this._inlineAudio.addEventListener('loadedmetadata', () => this._syncInlineAudioProgress());
		}

		if (this._inlineAudio.paused) {
			this._inlineAudio.play().then(() => {
				VGFilePreview._activeAudioOwner = this;
				this._syncInlineAudioIcon(true);
			}).catch(() => {
				this._syncInlineAudioIcon(false);
			});
			return;
		}

		this._inlineAudio.pause();
		this._syncInlineAudioIcon(false);
		if (VGFilePreview._activeAudioOwner === this) {
			VGFilePreview._activeAudioOwner = null;
		}
	}

	_stopInlineAudio() {
		if (!this._inlineAudio) {
			this._syncInlineAudioIcon(false);
			this._setInlineAudioProgress(0);
			return;
		}

		this._inlineAudio.pause();
		this._inlineAudio.currentTime = 0;
		this._syncInlineAudioIcon(false);
		this._setInlineAudioProgress(0);
		if (VGFilePreview._activeAudioOwner === this) {
			VGFilePreview._activeAudioOwner = null;
		}
	}

	_syncInlineAudioIcon(isPlaying) {
		if (!this._inlineAudioIcon) {
			return;
		}

		this._inlineAudioIcon.innerHTML = isPlaying ? (getSVG('pause') || '') : (getSVG('play') || '');
	}

	_syncInlineAudioProgress() {
		if (!this._inlineAudio) {
			this._setInlineAudioProgress(0);
			return;
		}

		const duration = Number(this._inlineAudio.duration || 0);
		const currentTime = Number(this._inlineAudio.currentTime || 0);
		if (!duration || !Number.isFinite(duration) || duration <= 0) {
			this._setInlineAudioProgress(0);
			return;
		}

		const progress = Math.max(0, Math.min(100, (currentTime / duration) * 100));
		this._setInlineAudioProgress(progress);
	}

	_setInlineAudioProgress(percent) {
		if (!this._inlineAudioContainer) {
			return;
		}

		const normalized = Math.max(0, Math.min(100, Number(percent) || 0));
		this._inlineAudioContainer.style.setProperty('--vg-filepreview-audio-inline-progress', `${normalized}%`);
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

	_enrichAudioMetadata(nameField = null) {
		if (this._audioMetaApplied || this._audioMetaPromise || !this._isAudioFile()) {
			return;
		}

		const src = this._fileUrl?.href || this._filePath || '';
		if (!src) {
			return;
		}

		this._audioMetaPromise = this._createAudioFileFromSource(src)
			.then((file) => {
				if (!file) {
					return null;
				}
				return extractAudioMetadata(file);
			})
			.then((meta) => {
				if (!meta) {
					return false;
				}

				let changed = false;
				const title = String(meta.title || '').trim();
				if (title) {
					this._element.setAttribute('data-vg-filepreview-display-name', title);

					if (nameField) {
						nameField.textContent = title;
						this._applyNameClampStyles(nameField);
					}

					const originalNameField = this._editableFields?.original_name;
					if (originalNameField) {
						originalNameField.textContent = this._getFileName();
						this._applyNameClampStyles(originalNameField);
					}

					changed = true;
				}

				if (meta.pictureBlob instanceof Blob && this._editableFields?.icon) {
					if (this._audioCoverObjectUrl) {
						URL.revokeObjectURL(this._audioCoverObjectUrl);
					}
					this._audioCoverObjectUrl = URL.createObjectURL(meta.pictureBlob);

					const iconField = this._editableFields.icon;
					iconField.innerHTML = '';

					const image = document.createElement('img');
					image.src = this._audioCoverObjectUrl;
					image.alt = title || this._fileMeta?.originalName || this._fileMeta?.name || '';
					image.className = 'vg-filepreview-icon-image';
					image.loading = 'lazy';
					image.addEventListener('error', () => {
						this._renderDefaultIcon(iconField);
					});
					this._bindIconImageToModal(image, this._audioCoverObjectUrl, title);
					iconField.appendChild(image);

					changed = true;
				}

				this._audioMetaApplied = true;
				return changed;
			})
			.catch(() => false)
			.finally(() => {
				this._audioMetaPromise = null;
			});
	}

	_enrichVideoMetadata() {
		if (!this._isPreviewGroupEnabled('video')) {
			return;
		}

		if (this._videoMetaApplied || this._videoMetaPromise || !this._isVideoFile()) {
			return;
		}

		const src = this._fileUrl?.href || this._filePath || '';
		if (!src) {
			return;
		}

		this._videoMetaPromise = this._createMediaFileFromSource(src, this._fileMeta?.originalName || this._fileMeta?.name || 'video.mp4', 'video/mp4')
			.then((file) => {
				if (!file) {
					return null;
				}
				return extractVideoMetadata(file);
			})
			.then((meta) => {
				if (!meta || !(meta.posterBlob instanceof Blob) || !this._editableFields?.icon) {
					return false;
				}

				if (this._videoCoverObjectUrl) {
					URL.revokeObjectURL(this._videoCoverObjectUrl);
				}
				this._videoCoverObjectUrl = URL.createObjectURL(meta.posterBlob);

				const iconField = this._editableFields.icon;
				iconField.innerHTML = '';

				const image = document.createElement('img');
				image.src = this._videoCoverObjectUrl;
				image.alt = this._fileMeta?.originalName || this._fileMeta?.name || '';
				image.className = 'vg-filepreview-icon-image';
				image.loading = 'lazy';
				image.addEventListener('error', () => {
					this._renderDefaultIcon(iconField);
				});
				if (this._isPreviewGroupEnabled('video')) {
					this._bindIconImageToModal(image, this._videoCoverObjectUrl, image.alt);
				}
				iconField.appendChild(image);

				this._videoMetaApplied = true;
				return true;
			})
			.catch(() => false)
			.finally(() => {
				this._videoMetaPromise = null;
			});
	}

	async _createAudioFileFromSource(src = '') {
		const name = this._fileMeta?.originalName || this._fileMeta?.name || 'audio.mp3';
		return this._createMediaFileFromSource(src, name, 'audio/mpeg');
	}

	async _createMediaFileFromSource(src = '', name = 'file', defaultType = 'application/octet-stream') {
		try {
			const response = await fetch(src, {
				method: 'GET',
				credentials: 'same-origin'
			});
			if (!response.ok) {
				return null;
			}

			const blob = await response.blob();
			if (!blob || !blob.size) {
				return null;
			}

			return new File([blob], name, {
				type: blob.type || defaultType,
				lastModified: Date.now()
			});
		} catch {
			return null;
		}
	}

	_bindIconImageToModal(imageNode, src = '', title = '') {
		if (!imageNode) {
			return;
		}

		const modalSrc = String(src || '').trim();
		if (!modalSrc) {
			return;
		}

		const modalTitle = String(title || this._fileMeta?.originalName || this._fileMeta?.name || '').trim();
		imageNode.setAttribute('data-vg-filepreview-image-modal-src', modalSrc);
		imageNode.setAttribute('data-vg-filepreview-image-modal-title', modalTitle);
		imageNode.classList.add('is-preview-action');

		if (imageNode.hasAttribute('data-vg-filepreview-image-modal-bind')) {
			return;
		}

		imageNode.setAttribute('data-vg-filepreview-image-modal-bind', 'true');
		imageNode.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();

			const nodeSrc = String(imageNode.getAttribute('data-vg-filepreview-image-modal-src') || '').trim();
			if (!nodeSrc) {
				return;
			}

			const nodeTitle = String(imageNode.getAttribute('data-vg-filepreview-image-modal-title') || '').trim();
			if (!this._imageModal) {
				this._imageModal = ImageModal.getInstance();
			}

			this._imageModal.open({
				src: nodeSrc,
				title: nodeTitle,
				defaultTitle: this._i18n?.message('image_title') || ''
			});
		});
	}

	_renderPreview() {
		const isNameOnly = Boolean(this._params?.ui?.nameOnly) || !this._shouldRenderPreviewForCurrentFile();
		const previewContainer = this._resolvePreviewContainer({
			autoCreate: !isNameOnly
		});
		if (!previewContainer && !isNameOnly) {
			this._setState('error');
			return;
		}

		if (previewContainer) {
			previewContainer.innerHTML = '';
		}

		const context = {
			element: this._element,
			filePath: this._filePath,
			fileUrl: this._fileUrl,
			fileMeta: this._fileMeta,
			previewContainer,
			lang: this._lang,
			i18n: this._i18n,
			ui: this._params?.ui || {}
		};

		let rendered = false;
		this._renderers.forEach((renderer) => {
			if (rendered || typeof renderer?.canRender !== 'function' || typeof renderer?.render !== 'function') {
				return;
			}
			if (!this._isRendererEnabled(renderer?.name)) {
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

		if (!rendered && !isNameOnly) {
			this._element.removeAttribute('data-vg-filepreview-renderer');
			this._setState('empty');
			return;
		}
		this._setState('ready');
	}

	_resolvePreviewContainer(params = {}) {
		const autoCreate = !Object.prototype.hasOwnProperty.call(params, 'autoCreate') || Boolean(params.autoCreate);
		if (!autoCreate) {
			const disabledPreview = this._editableFields.preview || this._element.querySelector('[data-vg-filepreview-slot="preview"]');
			if (disabledPreview) {
				disabledPreview.innerHTML = '';
				disabledPreview.classList.remove('preview');
				disabledPreview.setAttribute('hidden', 'hidden');
				disabledPreview.setAttribute('aria-hidden', 'true');
			}
			return null;
		}

		const editablePreview = this._editableFields.preview;
		if (editablePreview) {
			editablePreview.classList.add('preview');
			editablePreview.removeAttribute('hidden');
			editablePreview.removeAttribute('aria-hidden');
			editablePreview.setAttribute('data-vg-filepreview-slot', 'preview');
			return editablePreview;
		}

		const existedPreview = this._element.querySelector('[data-vg-filepreview-slot="preview"]');
		if (existedPreview) {
			existedPreview.classList.add('preview');
			existedPreview.removeAttribute('hidden');
			existedPreview.removeAttribute('aria-hidden');
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

	_shouldRenderPreviewForCurrentFile() {
		if (this._isAudioFile()) {
			return this._isPreviewGroupEnabled('audio');
		}

		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		if (ext === '.pdf') {
			return this._isPreviewGroupEnabled('pdf');
		}

		if (this._isVideoFile()) {
			return this._isPreviewGroupEnabled('video');
		}

		if (this._isImageFile()) {
			return false;
		}

		if (this._isOfficeFile()) {
			return this._isPreviewGroupEnabled('office');
		}

		if (this._isArchiveFile()) {
			return this._isPreviewGroupEnabled('archive');
		}

		if (this._isTextFile()) {
			return this._isPreviewGroupEnabled('text');
		}

		return false;
	}

	_isRendererEnabled(rendererName = '') {
		const name = String(rendererName || '').trim();
		const map = {
			image: 'image',
			video: 'video',
			pdf: 'pdf',
			office: 'office',
			zip: 'archive',
			text: 'text'
		};
		const group = map[name];
		if (!group) {
			return true;
		}

		return this._isPreviewGroupEnabled(group);
	}

	_isPreviewGroupEnabled(groupName = '') {
		const group = String(groupName || '').trim();
		if (!group) {
			return false;
		}

		const preview = this._params?.preview;
		if (!preview || typeof preview !== 'object' || Array.isArray(preview)) {
			return false;
		}

		if (!Object.prototype.hasOwnProperty.call(preview, group)) {
			return false;
		}

		const config = preview[group];
		if (typeof config === 'boolean') {
			return config;
		}

		if (!config || typeof config !== 'object' || Array.isArray(config)) {
			return false;
		}

		if (!Object.prototype.hasOwnProperty.call(config, 'enable')) {
			return false;
		}

		return Boolean(config.enable);
	}

	_getImageIconSrc() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.avif', '.ico'];
		if (!imageExts.includes(ext)) {
			return '';
		}

		return this._fileUrl?.href || this._filePath || '';
	}

	_isImageFile() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.avif', '.ico', '.tif', '.tiff', '.heic', '.heif'].includes(ext);
	}

	_isOfficeFile() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		return ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp'].includes(ext);
	}

	_isArchiveFile() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		return ['.zip'].includes(ext);
	}

	_isTextFile() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		return ['.txt', '.md', '.csv', '.json', '.xml', '.yml', '.yaml', '.log', '.ini', '.conf', '.env'].includes(ext);
	}

	_renderDefaultIcon(iconField) {
		const icon = getSVG(this._filePath);
		if (!icon) {
			iconField.innerHTML = '';
			return;
		}

		iconField.innerHTML = icon;
	}

	_applyNameClampStyles(field) {
		if (!field || !field.style) {
			return;
		}

		field.style.minWidth = '60px';
		field.style.maxWidth = '100%';
		field.style.overflow = 'hidden';
		field.style.textOverflow = 'ellipsis';
		field.style.whiteSpace = 'nowrap';
	}

	static init(element, params = {}) {
		return VGFilePreview.getOrCreateInstance(element, params);
	}

	static stopActiveInlineAudio() {
		const owner = VGFilePreview._activeAudioOwner;
		if (owner && typeof owner._stopInlineAudio === 'function') {
			owner._stopInlineAudio();
		}

		VGFilePreview._activeAudioOwner = null;
	}

	static stopActiveInlineAudioIfDetached(nodes = []) {
		const owner = VGFilePreview._activeAudioOwner;
		if (!owner || !owner._element || !Array.isArray(nodes) || !nodes.length) {
			return;
		}

		const shouldStop = nodes.some((node) => {
			if (!node || typeof node.contains !== 'function') {
				return false;
			}

			return node === owner._element || node.contains(owner._element);
		});

		if (shouldStop) {
			owner._stopInlineAudio();
			VGFilePreview._activeAudioOwner = null;
		}
	}

	_setState(state = '') {
		const value = String(state || '').trim();
		if (!value) {
			this._element.removeAttribute('data-vg-filepreview-state');
			return;
		}
		this._element.setAttribute('data-vg-filepreview-state', value);
	}

	_isAudioFile() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		return ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.opus', '.wma'].includes(ext);
	}

	_isVideoFile() {
		const ext = String(this._fileMeta?.ext || '').toLowerCase();
		return ['.mp4', '.webm', '.mov', '.mkv', '.avi', '.m4v', '.ogv'].includes(ext);
	}

	_getFileName() {
		return String(this._fileMeta?.originalName || this._fileMeta?.name || '').trim();
	}

	_getDataDisplayName() {
		return String(this._element?.getAttribute('data-vg-filepreview-display-name') || '').trim();
	}

	_hasDataDrivenDisplayName() {
		const dataName = this._getDataDisplayName();
		if (!dataName) {
			return false;
		}

		const fileName = this._getFileName();
		if (!fileName) {
			return true;
		}

		return dataName !== fileName;
	}

	_getDisplayName() {
		const dataName = this._getDataDisplayName();
		if (dataName) {
			return dataName;
		}

		return this._getFileName();
	}
}

export default VGFilePreview;
