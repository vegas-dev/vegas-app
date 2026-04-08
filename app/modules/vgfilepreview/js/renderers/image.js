import ImageModal from "./image-modal";

const IMAGE_EXTENSIONS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.svg',
	'.bmp',
	'.tif',
	'.tiff',
	'.heic',
	'.heif',
	'.avif'
]);

class ImageFilePreviewRenderer {
	constructor() {
		this.name = 'image';
		this._modal = ImageModal.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return IMAGE_EXTENSIONS.has(ext);
	}

	render(context = {}) {
		const container = context?.previewContainer;
		if (!container) {
			return false;
		}
		const i18n = context?.i18n;

		const src = context?.fileUrl?.href || context?.filePath || '';
		if (!src) {
			return false;
		}

		const openImage = (event) => {
			if (event) {
				event.preventDefault();
			}

			this._modal.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('image_title') || '',
				defaultTitle: i18n?.message('image_title') || ''
			});
		};

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-image-trigger';
		trigger.textContent = i18n?.button('open_image') || '';
		trigger.addEventListener('click', openImage);
		container.appendChild(trigger);

		const thumbnail = document.createElement('img');
		thumbnail.className = 'vg-filepreview-image-thumb';
		thumbnail.src = src;
		thumbnail.alt = context?.fileMeta?.name || i18n?.message('image_thumbnail_alt') || '';
		thumbnail.loading = 'lazy';
		thumbnail.addEventListener('click', openImage);
		container.appendChild(thumbnail);

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-image-bind')) {
			titleLink.setAttribute('data-vg-filepreview-image-bind', 'true');
			titleLink.addEventListener('click', openImage);
		}

		return true;
	}
}

export default ImageFilePreviewRenderer;
