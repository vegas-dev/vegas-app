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

		const src = context?.fileUrl?.href || context?.filePath || '';
		if (!src) {
			return false;
		}

		const player = document.createElement('audio');
		player.className = 'vg-filepreview-audio-player';
		player.controls = true;
		player.preload = 'metadata';
		player.src = src;
		container.appendChild(player);

		return true;
	}
}

export default AudioFilePreviewRenderer;
