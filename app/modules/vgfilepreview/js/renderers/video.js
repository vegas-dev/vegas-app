/**
 * Описание: рендерер видеофайлов для VGFilePreview.
 * Возможности: создаёт действие предпросмотра и собирает актуальный плейлист соседних видео при открытии.
 */
import VideoModal from "./video-modal";
import { buildMediaPlaylist } from "./playlist";

const VIDEO_EXTENSIONS = new Set([
	'.mp4',
	'.webm',
	'.mov',
	'.mkv',
	'.avi',
	'.m4v'
]);

class VideoFilePreviewRenderer {
	constructor() {
		this.name = 'video';
		this._modal = VideoModal.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return VIDEO_EXTENSIONS.has(ext);
	}

	render(context = {}) {
		const container = context?.previewContainer;
		const nameOnly = Boolean(context?.ui?.nameOnly);
		const i18n = context?.i18n;

		const src = context?.fileUrl?.href || context?.filePath || '';
		if (!src) {
			return false;
		}

		const labels = {
			prev: i18n?.button('prev') || '',
			next: i18n?.button('next') || ''
		};

		const openVideo = (event) => {
			if (event) {
				event.preventDefault();
			}

			const playlist = buildMediaPlaylist(context?.element, (ext) => VIDEO_EXTENSIONS.has(ext));

			this._modal.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('video_title') || '',
				defaultTitle: i18n?.message('video_title') || '',
				playlist,
				labels
			});
		};

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-video-bind')) {
			titleLink.setAttribute('data-vg-filepreview-video-bind', 'true');
			titleLink.classList.add('is-preview-action');
			titleLink.addEventListener('click', openVideo);
		}

		if (nameOnly) {
			return Boolean(titleLink);
		}

		if (!container) {
			return false;
		}

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-video-trigger';
		trigger.textContent = i18n?.button('open_video') || '';
		trigger.addEventListener('click', openVideo);
		container.appendChild(trigger);

		return true;
	}
}

export default VideoFilePreviewRenderer;
