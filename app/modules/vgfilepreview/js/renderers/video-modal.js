import VGModal from "../../../vgmodal";

class VideoModal {
	constructor() {
		this._modalId = 'vg-filepreview-video-modal';
		this._playlist = [];
		this._currentIndex = -1;
		this._labels = {};
		this._onKeyDown = (event) => this._handleHotkeys(event);
	}

	static getInstance() {
		if (!VideoModal._instance) {
			VideoModal._instance = new VideoModal();
		}

		return VideoModal._instance;
	}

	open(payload = {}) {
		const src = String(payload.src || '').trim();
		if (!src) {
			return;
		}

		this._ensureModal();
		if (!this._modal || !this._video) {
			return;
		}

		const playlist = payload?.playlist && typeof payload.playlist === 'object' ? payload.playlist : null;
		this._labels = payload?.labels && typeof payload.labels === 'object' ? payload.labels : {};
		if (playlist?.tracks?.length) {
			this._playlist = playlist.tracks;
			const currentBySrc = this._playlist.findIndex((track) => String(track.src || '').trim() === src);
			this._currentIndex = currentBySrc >= 0 ? currentBySrc : Number(playlist.currentIndex || 0);
		} else {
			this._playlist = [{ src, title: String(payload.title || '').trim() }];
			this._currentIndex = 0;
		}

		const defaultTitle = String(payload.defaultTitle || '').trim();
		const title = String(payload.title || '').trim();
		this._title.textContent = title || defaultTitle;
		this._syncNavigation();
		this._video.src = src;
		this._video.load();

		this._modal.show();
		this._video.play().catch(() => {});
	}

	close() {
		if (!this._modal) {
			return;
		}

		this._modal.hide();
		this._stop();
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
			this._bindEvents(existed);
			return;
		}

		this._modal = VGModal.build(this._modalId, params, (modalInstance) => {
			const element = modalInstance._element;
			this._root = element;
			element.classList.add('vg-filepreview-video-modal');

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

			const navigation = document.createElement('div');
			navigation.className = 'vg-filepreview-video-modal__navigation';

			this._prevButton = document.createElement('button');
			this._prevButton.type = 'button';
			this._prevButton.className = 'vg-filepreview-video-modal__nav-btn';
			this._prevButton.addEventListener('click', () => this._goPrev());

			this._nextButton = document.createElement('button');
			this._nextButton.type = 'button';
			this._nextButton.className = 'vg-filepreview-video-modal__nav-btn';
			this._nextButton.addEventListener('click', () => this._goNext());

			navigation.appendChild(this._prevButton);
			navigation.appendChild(this._nextButton);

			this._video = document.createElement('video');
			this._video.className = 'vg-filepreview-video-modal__video';
			this._video.controls = true;
			this._video.preload = 'metadata';
			this._video.playsInline = true;
			this._video.addEventListener('ended', () => this._goNext(true));

			header.appendChild(this._title);
			//header.appendChild(navigation);
			body.appendChild(this._video);

			this._bindEvents(element);
		});
	}

	_bindElements(root) {
		this._title = root.querySelector('.vg-filepreview-video-modal__title');
		this._video = root.querySelector('.vg-filepreview-video-modal__video');
	}

	_bindEvents(root) {
		if (!root || root.hasAttribute('data-vg-filepreview-video-bind')) {
			return;
		}

		root.setAttribute('data-vg-filepreview-video-bind', 'true');
		document.addEventListener('keydown', this._onKeyDown);
		root.addEventListener('vg.modal.hidden', () => {
			this._stop();
			this._destroyModal();
		});
	}

	_stop() {
		if (!this._video) {
			return;
		}

		this._video.pause();
		this._video.currentTime = 0;
	}

	_destroyModal() {
		document.removeEventListener('keydown', this._onKeyDown);
		if (this._modal && typeof this._modal.dispose === 'function') {
			this._modal.dispose();
		}

		if (this._root && this._root.parentNode) {
			this._root.parentNode.removeChild(this._root);
		}

		this._root = null;
		this._modal = null;
		this._title = null;
		this._prevButton = null;
		this._nextButton = null;
		this._video = null;
		this._playlist = [];
		this._currentIndex = -1;
		this._labels = {};
	}

	_syncNavigation() {
		if (!this._prevButton || !this._nextButton) {
			return;
		}

		this._prevButton.textContent = this._labels.prev || '';
		this._nextButton.textContent = this._labels.next || '';
		const hasPlaylist = this._playlist.length > 1;
		this._prevButton.disabled = !hasPlaylist;
		this._nextButton.disabled = !hasPlaylist;
	}

	_goPrev() {
		if (!this._playlist.length) {
			return;
		}

		this._currentIndex = this._currentIndex <= 0 ? this._playlist.length - 1 : this._currentIndex - 1;
		this._openCurrentTrack();
	}

	_goNext(fromEnded = false) {
		if (!this._playlist.length) {
			return;
		}

		if (this._playlist.length === 1 && !fromEnded) {
			return;
		}

		this._currentIndex = (this._currentIndex + 1) % this._playlist.length;
		this._openCurrentTrack();
	}

	_openCurrentTrack() {
		const current = this._playlist[this._currentIndex];
		if (!current?.src) {
			return;
		}

		this.open({
			src: current.src,
			title: current.title || '',
			defaultTitle: current.title || '',
			playlist: {
				tracks: this._playlist,
				currentIndex: this._currentIndex
			},
			labels: this._labels
		});
	}

	_handleHotkeys(event) {
		if (!this._root || !this._root.classList.contains('show')) {
			return;
		}

		const tag = String(event?.target?.tagName || '').toUpperCase();
		if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			this._goPrev();
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			this._goNext();
		}
	}

}

export default VideoModal;
