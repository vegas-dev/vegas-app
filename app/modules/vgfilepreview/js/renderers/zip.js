import ZipModal from "./zip-modal";

const ZIP_EXTENSIONS = new Set([
	'.zip'
]);

class ZipFilePreviewRenderer {
	constructor() {
		this.name = 'zip';
		this._modal = ZipModal.getInstance();
	}

	canRender(context = {}) {
		const ext = String(context?.fileMeta?.ext || '').toLowerCase();
		return ZIP_EXTENSIONS.has(ext);
	}

	render(context = {}) {
		const container = context?.previewContainer;
		const nameOnly = Boolean(context?.ui?.nameOnly);
		const i18n = context?.i18n;

		const src = context?.fileUrl?.href || context?.filePath || '';
		if (!src) {
			return false;
		}

		const openArchive = (event) => {
			if (event) {
				event.preventDefault();
			}

			this._modal.open({
				src,
				title: context?.fileMeta?.name || i18n?.message('archive_title') || '',
				defaultTitle: i18n?.message('archive_title') || '',
				labels: {
					loadingArchive: i18n?.message('loading_archive') || '',
					cannotOpenArchive: i18n?.message('cannot_open_archive') || '',
					unknownError: i18n?.message('unknown_error') || '',
					invalidZip: i18n?.message('invalid_zip') || '',
					centralDirectoryNotFound: i18n?.message('central_directory_not_found') || '',
					archiveEmptyUnsupported: i18n?.message('archive_empty_unsupported') || '',
					typeDir: i18n?.message('archive_type_dir') || '',
					typeFile: i18n?.message('archive_type_file') || '',
					tableName: i18n?.message('archive_table_name') || '',
					tableType: i18n?.message('archive_table_type') || '',
					tablePacked: i18n?.message('archive_table_packed') || '',
					tableSize: i18n?.message('archive_table_size') || '',
					tablePreview: i18n?.message('archive_table_preview') || '',
					previewEntry: i18n?.button('preview') || '',
					loadingEntry: i18n?.message('loading_entry') || '',
					cannotPreviewEntry: i18n?.message('cannot_preview_entry') || '',
					deflateNotSupported: i18n?.message('deflate_not_supported') || '',
					compressionNotSupported: i18n?.message('compression_not_supported') || '',
					entryCorrupted: i18n?.message('entry_corrupted') || '',
					archiveBufferMissing: i18n?.message('archive_buffer_missing') || '',
					emptyFileInArchive: i18n?.message('empty_file') || ''
				}
			});
		};

		const titleLink = context?.element?.querySelector('.name');
		if (titleLink && !titleLink.hasAttribute('data-vg-filepreview-zip-bind')) {
			titleLink.setAttribute('data-vg-filepreview-zip-bind', 'true');
			titleLink.classList.add('is-preview-action');
			titleLink.addEventListener('click', openArchive);
		}

		if (nameOnly) {
			return Boolean(titleLink);
		}

		if (!container) {
			return false;
		}

		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'vg-filepreview-zip-trigger';
		trigger.textContent = i18n?.button('open_archive') || '';
		trigger.addEventListener('click', openArchive);
		container.appendChild(trigger);

		return true;
	}
}

export default ZipFilePreviewRenderer;
