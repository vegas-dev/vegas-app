import TextModal from "./text-modal";

const TEXT_EXTENSIONS = new Set([
	'.txt',
	'.md',
	'.csv',
	'.json',
	'.xml',
	'.yml',
	'.yaml',
	'.log',
	'.ini',
	'.conf',
	'.env'
]);

class TextFilePreviewRenderer {
	constructor() {
		this.name = 'text';
		this._modal = TextModal.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return TEXT_EXTENSIONS.has(ext);
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

		const openText = (event) => {
			if (event) {
				event.preventDefault();
			}

			this._modal.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('text_title') || '',
				defaultTitle: i18n?.message('text_title') || '',
				ext: context?.fileMeta?.ext || '',
				labels: {
					loading: i18n?.message('loading_text') || '',
					cannotOpen: i18n?.message('cannot_open_file') || '',
					unknownError: i18n?.message('unknown_error') || '',
					emptyFile: i18n?.message('empty_file') || ''
				}
			});
		};

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-text-trigger';
		trigger.textContent = i18n?.button('open_text') || '';
		trigger.addEventListener('click', openText);
		container.appendChild(trigger);

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-text-bind')) {
			titleLink.setAttribute('data-vg-filepreview-text-bind', 'true');
			titleLink.addEventListener('click', openText);
		}

		return true;
	}
}

export default TextFilePreviewRenderer;
