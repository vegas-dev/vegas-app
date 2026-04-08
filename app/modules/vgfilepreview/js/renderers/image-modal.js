import VGModal from "../../../vgmodal";

class ImageModal {
	constructor() {
		this._modalId = 'vg-filepreview-image-modal';
	}

	static getInstance() {
		if (!ImageModal._instance) {
			ImageModal._instance = new ImageModal();
		}

		return ImageModal._instance;
	}

	open(payload = {}) {
		const src = String(payload.src || '').trim();
		if (!src) {
			return;
		}

		this._ensureModal();
		if (!this._modal || !this._image) {
			return;
		}

		const defaultTitle = String(payload.defaultTitle || '').trim();
		const title = String(payload.title || '').trim();
		this._title.textContent = title || defaultTitle;
		this._image.src = src;
		this._image.alt = title || defaultTitle;

		this._modal.show();
	}

	close() {
		if (!this._modal) {
			return;
		}

		this._modal.hide();
	}

	_ensureModal() {
		if (this._modal && this._root) {
			return;
		}

		this._initModal();
	}

	_initModal() {
		const params = {
			centered: true,
			dismiss: true,
			backdrop: true,
			keyboard: true,
			sizes: {
				width: 'fit-content',
			},
			animation: {
				enable: false
			}
		};

		const existed = document.getElementById(this._modalId);
		if (existed) {
			this._root = existed;
			this._modal = VGModal.getOrCreateInstance(existed, params);
			this._bindElements(existed);
			this._bindLifecycle(existed);
			return;
		}

		this._modal = VGModal.build(this._modalId, params, (modalInstance) => {
			const element = modalInstance._element;
			this._root = element;
			element.classList.add('vg-filepreview-image-modal');

			const body = element.querySelector('.vg-modal-body');
			const content = element.querySelector('.vg-modal-content');
			if (!body || !content) {
				return;
			}

			body.classList.add('vg-filepreview-image-modal__body');
			body.innerHTML = '';

			let header = element.querySelector('.vg-modal-header');
			if (!header) {
				header = document.createElement('div');
				header.className = 'vg-modal-header';
				content.prepend(header);
			}

			this._title = document.createElement('div');
			this._title.className = 'vg-modal-title';
			this._title.textContent = '';

			this._image = document.createElement('img');
			this._image.className = 'vg-filepreview-image-modal__img';
			this._image.loading = 'eager';
			this._image.decoding = 'async';

			header.appendChild(this._title);
			body.appendChild(this._image);

			this._bindLifecycle(element);
		});
	}

	_bindElements(root) {
		this._title = root.querySelector('.vg-filepreview-image-modal__title');
		this._image = root.querySelector('.vg-filepreview-image-modal__img');
	}

	_bindLifecycle(root) {
		if (!root || root.hasAttribute('data-vg-filepreview-image-lifecycle-bind')) {
			return;
		}

		root.setAttribute('data-vg-filepreview-image-lifecycle-bind', 'true');
		root.addEventListener('vg.modal.hidden', () => {
			this._destroyModal();
		});
	}

	_destroyModal() {
		if (this._modal && typeof this._modal.dispose === 'function') {
			this._modal.dispose();
		}

		if (this._root && this._root.parentNode) {
			this._root.parentNode.removeChild(this._root);
		}

		this._root = null;
		this._modal = null;
		this._title = null;
		this._image = null;
	}

}

export default ImageModal;
