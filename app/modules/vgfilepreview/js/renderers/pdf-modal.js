import VGModal from "../../../vgmodal";

class PdfModal {
	constructor() {
		this._modalId = 'vg-filepreview-pdf-modal';
		this._labels = {};
		this._src = '';
		this._downloadName = '';
		this._page = 1;
		this._zoom = 100;
	}

	static getInstance() {
		if (!PdfModal._instance) {
			PdfModal._instance = new PdfModal();
		}

		return PdfModal._instance;
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
		this._page = 1;
		this._zoom = 100;

		const defaultTitle = String(payload.defaultTitle || '').trim();
		const title = String(payload.title || '').trim();
		this._title.textContent = title || defaultTitle;

		this._syncControls();
		this._updateFrameSrc();
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
			element.classList.add('vg-filepreview-pdf-modal');

			const body = element.querySelector('.vg-modal-body');
			if (!body) {
				return;
			}

			body.classList.add('vg-filepreview-pdf-modal__body');
			body.innerHTML = '';

			this._title = document.createElement('div');
			this._title.className = 'vg-filepreview-pdf-modal__title';

			const toolbar = document.createElement('div');
			toolbar.className = 'vg-filepreview-pdf-modal__toolbar';

			this._pagePrev = document.createElement('button');
			this._pagePrev.type = 'button';
			this._pagePrev.className = 'vg-filepreview-pdf-modal__btn';
			this._pagePrev.setAttribute('data-role', 'page-prev');
			this._pagePrev.addEventListener('click', () => {
				this._page = Math.max(1, this._page - 1);
				this._syncControls();
				this._updateFrameSrc();
			});

			this._pageInfo = document.createElement('span');
			this._pageInfo.className = 'vg-filepreview-pdf-modal__meta';
			this._pageInfo.setAttribute('data-role', 'page');

			this._pageNext = document.createElement('button');
			this._pageNext.type = 'button';
			this._pageNext.className = 'vg-filepreview-pdf-modal__btn';
			this._pageNext.setAttribute('data-role', 'page-next');
			this._pageNext.addEventListener('click', () => {
				this._page += 1;
				this._syncControls();
				this._updateFrameSrc();
			});

			this._zoomOut = document.createElement('button');
			this._zoomOut.type = 'button';
			this._zoomOut.className = 'vg-filepreview-pdf-modal__btn';
			this._zoomOut.setAttribute('data-role', 'zoom-out');
			this._zoomOut.addEventListener('click', () => {
				this._zoom = Math.max(50, this._zoom - 10);
				this._syncControls();
				this._updateFrameSrc();
			});

			this._zoomIn = document.createElement('button');
			this._zoomIn.type = 'button';
			this._zoomIn.className = 'vg-filepreview-pdf-modal__btn';
			this._zoomIn.setAttribute('data-role', 'zoom-in');
			this._zoomIn.addEventListener('click', () => {
				this._zoom = Math.min(300, this._zoom + 10);
				this._syncControls();
				this._updateFrameSrc();
			});

			this._zoomInfo = document.createElement('span');
			this._zoomInfo.className = 'vg-filepreview-pdf-modal__meta';
			this._zoomInfo.setAttribute('data-role', 'zoom');

			this._download = document.createElement('button');
			this._download.type = 'button';
			this._download.className = 'vg-filepreview-pdf-modal__btn primary';
			this._download.setAttribute('data-role', 'download');
			this._download.addEventListener('click', () => this._downloadFile());

			toolbar.appendChild(this._pagePrev);
			toolbar.appendChild(this._pageInfo);
			toolbar.appendChild(this._pageNext);
			toolbar.appendChild(this._zoomOut);
			toolbar.appendChild(this._zoomInfo);
			toolbar.appendChild(this._zoomIn);
			toolbar.appendChild(this._download);

			this._frame = document.createElement('iframe');
			this._frame.className = 'vg-filepreview-pdf-modal__frame';
			this._frame.setAttribute('title', 'PDF preview');

			body.appendChild(this._title);
			body.appendChild(toolbar);
			body.appendChild(this._frame);

			this._bindLifecycle(element);
		});
	}

	_bindElements(root) {
		this._title = root.querySelector('.vg-filepreview-pdf-modal__title');
		this._frame = root.querySelector('.vg-filepreview-pdf-modal__frame');
		this._pagePrev = root.querySelector('.vg-filepreview-pdf-modal__btn[data-role="page-prev"]');
		this._pageNext = root.querySelector('.vg-filepreview-pdf-modal__btn[data-role="page-next"]');
		this._zoomOut = root.querySelector('.vg-filepreview-pdf-modal__btn[data-role="zoom-out"]');
		this._zoomIn = root.querySelector('.vg-filepreview-pdf-modal__btn[data-role="zoom-in"]');
		this._download = root.querySelector('.vg-filepreview-pdf-modal__btn[data-role="download"]');
		this._pageInfo = root.querySelector('.vg-filepreview-pdf-modal__meta[data-role="page"]');
		this._zoomInfo = root.querySelector('.vg-filepreview-pdf-modal__meta[data-role="zoom"]');
	}

	_bindLifecycle(root) {
		if (!root || root.hasAttribute('data-vg-filepreview-pdf-lifecycle-bind')) {
			return;
		}

		root.setAttribute('data-vg-filepreview-pdf-lifecycle-bind', 'true');
		root.addEventListener('vg.modal.hidden', () => this._destroyModal());
	}

	_syncControls() {
		if (!this._pageInfo || !this._zoomInfo) {
			return;
		}

		this._pagePrev.textContent = this._label('prevPage');
		this._pageNext.textContent = this._label('nextPage');
		this._zoomOut.textContent = this._label('zoomOut');
		this._zoomIn.textContent = this._label('zoomIn');
		this._download.textContent = this._label('download');
		this._pageInfo.textContent = `${this._label('page')}: ${this._page}`;
		this._zoomInfo.textContent = `${this._label('zoom')}: ${this._zoom}%`;
	}

	_updateFrameSrc() {
		if (!this._frame || !this._src) {
			return;
		}

		const hash = `#page=${this._page}&zoom=${this._zoom}`;
		this._frame.src = `${this._src}${hash}`;
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
		this._labels = null;
		this._src = '';
	}
}

export default PdfModal;
