import PdfModal from "./pdf-modal";

const PDF_EXTENSIONS = new Set([
	'.pdf'
]);

class PdfFilePreviewRenderer {
	constructor() {
		this.name = 'pdf';
		this._modal = PdfModal.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return PDF_EXTENSIONS.has(ext);
	}

	render(context = {}) {
		const container = context?.previewContainer;
		const i18n = context?.i18n;
		if (!container) {
			return false;
		}

		const src = context?.fileUrl?.href || context?.filePath || '';
		if (!src) {
			return false;
		}

		const openPdf = (event) => {
			if (event) {
				event.preventDefault();
			}

			this._modal.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('pdf_title') || '',
				defaultTitle: i18n?.message('pdf_title') || '',
				labels: {
					page: i18n?.message('pdf_page') || '',
					zoom: i18n?.message('pdf_zoom') || '',
					zoomIn: i18n?.button('zoom_in') || '',
					zoomOut: i18n?.button('zoom_out') || '',
					prevPage: i18n?.button('prev') || '',
					nextPage: i18n?.button('next') || '',
					download: i18n?.button('download') || ''
				},
				downloadName: context?.fileMeta?.originalName || context?.fileMeta?.name || 'file.pdf'
			});
		};

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-pdf-trigger';
		trigger.textContent = i18n?.button('open_pdf') || '';
		trigger.addEventListener('click', openPdf);
		container.appendChild(trigger);

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-pdf-bind')) {
			titleLink.setAttribute('data-vg-filepreview-pdf-bind', 'true');
			titleLink.addEventListener('click', openPdf);
		}

		return true;
	}
}

export default PdfFilePreviewRenderer;
