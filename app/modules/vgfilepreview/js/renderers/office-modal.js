import VGModal from "../../../vgmodal";

class OfficeModal {
	constructor() {
		this._modalId = 'vg-filepreview-office-modal';
		this._labels = {};
	}

	static getInstance() {
		if (!OfficeModal._instance) {
			OfficeModal._instance = new OfficeModal();
		}

		return OfficeModal._instance;
	}

	open(payload = {}) {
		const src = String(payload.src || '').trim();
		if (!src) {
			return;
		}

		this._ensureModal();
		if (!this._modal || !this._frame) {
			return;
		}

		this._labels = payload?.labels && typeof payload.labels === 'object' ? payload.labels : {};
		this._src = src;
		this._downloadName = String(payload.downloadName || '').trim();

		const defaultTitle = String(payload.defaultTitle || '').trim();
		const title = String(payload.title || '').trim();
		this._title.textContent = title || defaultTitle;
		this._fallback.textContent = this._label('fallback');
		this._download.textContent = this._label('download');

		this._frame.src = this._buildViewerUrl(src);
		this._modal.show();
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

		this._modal = VGModal.build(this._modalId, params, (modalInstance) => {
			const element = modalInstance._element;
			this._root = element;
			element.classList.add('vg-filepreview-office-modal');

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

			this._frame = document.createElement('iframe');
			this._frame.className = 'vg-filepreview-office-modal__frame';
			this._frame.setAttribute('title', 'Office preview');

			const footer = document.createElement('div');
			footer.className = 'vg-filepreview-office-modal__footer';

			this._fallback = document.createElement('span');
			this._fallback.className = 'vg-filepreview-office-modal__hint';

			this._download = document.createElement('button');
			this._download.type = 'button';
			this._download.className = 'vg-filepreview-office-modal__btn';
			this._download.addEventListener('click', () => this._downloadFile());

			footer.appendChild(this._fallback);
			footer.appendChild(this._download);

			header.appendChild(this._title);
			body.appendChild(this._frame);
			content.appendChild(footer);

			this._bindLifecycle(element);
		});
	}

	_buildViewerUrl(src) {
		const absolute = new URL(src, window.location.origin).href;
		const viewerBase = 'https://view.officeapps.live.com/op/embed.aspx?src=';
		return `${viewerBase}${encodeURIComponent(absolute)}`;
	}

	_downloadFile() {
		if (!this._src) {
			return;
		}

		const link = document.createElement('a');
		link.href = this._src;
		if (this._downloadName) {
			link.setAttribute('download', this._downloadName);
		}
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	_label(key) {
		const value = this._labels?.[key];
		return String(value || '').trim();
	}

	_bindLifecycle(root) {
		if (!root || root.hasAttribute('data-vg-filepreview-office-lifecycle-bind')) {
			return;
		}
		root.setAttribute('data-vg-filepreview-office-lifecycle-bind', 'true');
		root.addEventListener('vg.modal.hidden', () => this._destroyModal());
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
		this._frame = null;
		this._fallback = null;
		this._download = null;
		this._labels = null;
		this._src = '';
		this._downloadName = '';
	}
}

export default OfficeModal;
