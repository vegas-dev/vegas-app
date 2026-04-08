import VGSidebar from "../../../vgsidebar";

class AudioDock {
	constructor() {
		this._sidebarId = 'vg-filepreview-audio-sidebar';
		this._playlist = [];
		this._currentIndex = -1;
		this._labels = {};
		this._onKeyDown = (event) => this._handleHotkeys(event);
	}

	static getInstance() {
		if (!AudioDock._instance) {
			AudioDock._instance = new AudioDock();
		}

		return AudioDock._instance;
	}

	open(payload = {}) {
		const src = String(payload.src || '').trim();
		if (!src) {
			return;
		}

		this._ensureSidebar();
		if (!this._audio || !this._sidebar) {
			return;
		}

		const defaultTitle = String(payload.defaultTitle || '').trim();
		const title = String(payload.title || '').trim();
		const subtitle = String(payload.subtitle || '').trim();
		const playlist = payload?.playlist && typeof payload.playlist === 'object' ? payload.playlist : null;
		this._labels = payload?.labels && typeof payload.labels === 'object' ? payload.labels : {};

		if (playlist?.tracks?.length) {
			this._playlist = playlist.tracks;
			const currentBySrc = this._playlist.findIndex((track) => String(track.src || '').trim() === src);
			this._currentIndex = currentBySrc >= 0 ? currentBySrc : Number(playlist.currentIndex || 0);
		} else {
			this._playlist = [{
				src,
				title: title || defaultTitle,
				subtitle
			}];
			this._currentIndex = 0;
		}

		this._title.textContent = title || defaultTitle;

		if (subtitle) {
			this._subtitle.textContent = subtitle;
			this._subtitle.style.display = '';
		} else {
			this._subtitle.textContent = '';
			this._subtitle.style.display = 'none';
		}

		if (this._audio.getAttribute('src') !== src) {
			this._audio.src = src;
			this._audio.load();
		}

		if (!this._isShown()) {
			this._sidebar.show();
		}
		this._syncNavigation();

		this._audio.play().catch(() => {});
	}

	close() {
		if (!this._sidebar) {
			return;
		}

		this._sidebar.hide();
	}

	_ensureSidebar() {
		if (this._sidebar && this._root) {
			return;
		}

		this._build();
	}

	_build() {
		const existed = document.getElementById(this._sidebarId);
		if (existed) {
			this._root = existed;
			this._title = existed.querySelector('.vg-filepreview-audio-sidebar__title');
			this._subtitle = existed.querySelector('.vg-filepreview-audio-sidebar__subtitle');
			this._audio = existed.querySelector('.vg-filepreview-audio-sidebar__audio');
			this._sidebar = VGSidebar.getOrCreateInstance(existed, this._sidebarParams());
			this._bindHiddenLifecycle();
			return;
		}

		this._root = document.createElement('div');
		this._root.id = this._sidebarId;
		this._root.className = 'vg-sidebar bottom vg-filepreview-audio-sidebar';

		const header = document.createElement('div');
		header.className = 'vg-sidebar-header vg-filepreview-audio-sidebar__header';

		const meta = document.createElement('div');
		meta.className = 'vg-filepreview-audio-sidebar__meta';

		this._title = document.createElement('div');
		this._title.className = 'vg-filepreview-audio-sidebar__title';
		this._title.textContent = '';

		this._subtitle = document.createElement('div');
		this._subtitle.className = 'vg-filepreview-audio-sidebar__subtitle';
		this._subtitle.style.display = 'none';

		meta.appendChild(this._title);
		meta.appendChild(this._subtitle);

		const navigation = document.createElement('div');
		navigation.className = 'vg-filepreview-audio-sidebar__navigation';

		this._prevButton = document.createElement('button');
		this._prevButton.type = 'button';
		this._prevButton.className = 'vg-filepreview-audio-sidebar__nav-btn';
		this._prevButton.addEventListener('click', () => this._goPrev());

		this._nextButton = document.createElement('button');
		this._nextButton.type = 'button';
		this._nextButton.className = 'vg-filepreview-audio-sidebar__nav-btn';
		this._nextButton.addEventListener('click', () => this._goNext());

		navigation.appendChild(this._prevButton);
		navigation.appendChild(this._nextButton);

		const closeButton = document.createElement('button');
		closeButton.type = 'button';
		closeButton.className = 'vg-filepreview-audio-sidebar__close';
		closeButton.textContent = 'x';
		closeButton.addEventListener('click', () => this.close());

		header.appendChild(meta);
		header.appendChild(navigation);
		header.appendChild(closeButton);

		const body = document.createElement('div');
		body.className = 'vg-sidebar-body vg-filepreview-audio-sidebar__body';

		this._audio = document.createElement('audio');
		this._audio.className = 'vg-filepreview-audio-sidebar__audio';
		this._audio.controls = true;
		this._audio.preload = 'metadata';
		this._audio.addEventListener('ended', () => this._goNext(true));

		body.appendChild(this._audio);
		this._root.appendChild(header);
		this._root.appendChild(body);
		document.body.appendChild(this._root);

		this._sidebar = VGSidebar.getOrCreateInstance(this._root, this._sidebarParams());
		this._bindHiddenLifecycle();
	}

	_sidebarParams() {
		return {
			backdrop: false,
			overflow: false,
			keyboard: false,
			hash: false,
			animation: {
				enable: false
			}
		};
	}

	_bindHiddenLifecycle() {
		if (!this._root || this._root.hasAttribute('data-vg-filepreview-audio-stop-bind')) {
			return;
		}

		const boundRoot = this._root;
		this._root.setAttribute('data-vg-filepreview-audio-stop-bind', 'true');
		document.addEventListener('keydown', this._onKeyDown);
		this._root.addEventListener('vg.sidebar.hidden', () => {
			this._stopAudio(boundRoot);
			this._destroySidebar(boundRoot);
		});
	}

	_isShown() {
		return this._root?.classList.contains('show') || false;
	}

	_stopAudio(root = null) {
		const audio = root?.querySelector('.vg-filepreview-audio-sidebar__audio') || this._audio;
		if (!audio) {
			return;
		}

		audio.pause();
		audio.currentTime = 0;
	}

	_destroySidebar(root = null) {
		if (root && this._root !== root) {
			return;
		}
		document.removeEventListener('keydown', this._onKeyDown);

		if (this._root && this._root.parentNode) {
			this._root.parentNode.removeChild(this._root);
		}

		this._root = null;
		this._title = null;
		this._subtitle = null;
		this._prevButton = null;
		this._nextButton = null;
		this._audio = null;
		this._sidebar = null;
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
			subtitle: current.subtitle || '',
			playlist: {
				tracks: this._playlist,
				currentIndex: this._currentIndex
			},
			labels: this._labels
		});
	}

	_handleHotkeys(event) {
		if (!this._isShown()) {
			return;
		}

		const targetTag = String(event?.target?.tagName || '').toUpperCase();
		if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) {
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

export default AudioDock;
