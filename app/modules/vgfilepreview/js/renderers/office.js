import OfficeModal from "./office-modal";

const OFFICE_EXTENSIONS = new Set([
	'.doc',
	'.docx',
	'.xls',
	'.xlsx',
	'.ppt',
	'.pptx',
	'.odt',
	'.ods',
	'.odp'
]);

class OfficeFilePreviewRenderer {
	constructor() {
		this.name = 'office';
		this._modal = OfficeModal.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return OFFICE_EXTENSIONS.has(ext);
	}

	render(context = {}) {
		const container = context?.previewContainer;
		const nameOnly = Boolean(context?.ui?.nameOnly);
		const i18n = context?.i18n;

		const src = context?.fileUrl?.href || context?.filePath || '';
		if (!src) {
			return false;
		}

		const openOffice = (event) => {
			if (event) {
				event.preventDefault();
			}

			this._modal.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('office_title') || '',
				defaultTitle: i18n?.message('office_title') || '',
				downloadName: context?.fileMeta?.originalName || context?.fileMeta?.name || '',
				labels: {
					download: i18n?.button('download') || '',
					fallback: i18n?.message('office_fallback') || ''
				}
			});
		};

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-office-bind')) {
			titleLink.setAttribute('data-vg-filepreview-office-bind', 'true');
			titleLink.classList.add('is-preview-action');
			titleLink.addEventListener('click', openOffice);
		}

		if (nameOnly) {
			return Boolean(titleLink);
		}

		if (!container) {
			return false;
		}

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-office-trigger';
		trigger.textContent = i18n?.button('open_office') || '';
		trigger.addEventListener('click', openOffice);
		container.appendChild(trigger);

		return true;
	}
}

export default OfficeFilePreviewRenderer;
