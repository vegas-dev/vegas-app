import AudioDock from "./audio-dock";
import { buildMediaPlaylist } from "./playlist";

const AUDIO_EXTENSIONS = new Set([
	'.mp3',
	'.wav',
	'.ogg',
	'.flac',
	'.aac',
	'.m4a',
	'.opus',
	'.wma'
]);

class AudioFilePreviewRenderer {
	constructor() {
		this.name = 'audio';
		this._dock = AudioDock.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return AUDIO_EXTENSIONS.has(ext);
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

		const playlist = buildMediaPlaylist(context?.element, (ext) => AUDIO_EXTENSIONS.has(ext));
		const labels = {
			prev: i18n?.button('prev') || '',
			next: i18n?.button('next') || ''
		};

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-audio-trigger';
		trigger.textContent = i18n?.button('open_audio') || '';
		trigger.addEventListener('click', (event) => {
			event.preventDefault();

			this._dock.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('audio_title') || '',
				defaultTitle: i18n?.message('audio_title') || '',
				subtitle: context?.fileMeta?.originalName || '',
				playlist,
				labels
			});
		});

		container.appendChild(trigger);

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-audio-bind')) {
			titleLink.setAttribute('data-vg-filepreview-audio-bind', 'true');
			titleLink.addEventListener('click', (event) => {
				event.preventDefault();

				this._dock.open({
					src,
					title: context?.fileMeta?.name || i18n?.message('audio_title') || '',
					defaultTitle: i18n?.message('audio_title') || '',
					subtitle: context?.fileMeta?.originalName || '',
					playlist,
					labels
				});
			});
		}

		return true;
	}
}

export default AudioFilePreviewRenderer;
