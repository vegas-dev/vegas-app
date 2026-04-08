import VGModal from "../../../vgmodal";

class ZipModal {
	constructor() {
		this._modalId = 'vg-filepreview-zip-modal';
		this._abortController = null;
		this._labels = {};
		this._entries = [];
		this._arrayBuffer = null;
	}

	static getInstance() {
		if (!ZipModal._instance) {
			ZipModal._instance = new ZipModal();
		}

		return ZipModal._instance;
	}

	open(payload = {}) {
		const src = String(payload.src || '').trim();
		if (!src) {
			return;
		}

		this._ensureModal();
		if (!this._modal || !this._content) {
			return;
		}

		this._labels = payload?.labels && typeof payload.labels === 'object' ? payload.labels : {};
		const defaultTitle = String(payload.defaultTitle || '').trim();
		const title = String(payload.title || '').trim();
		this._title.textContent = title || defaultTitle;
		this._content.innerHTML = `<div class="vg-filepreview-zip-modal__loading">${this._escapeHtml(this._label('loadingArchive'))}</div>`;
		this._modal.show();

		this._loadZipEntries(src);
	}

	close() {
		if (!this._modal) {
			return;
		}

		this._modal.hide();
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
			element.classList.add('vg-filepreview-zip-modal');

			const body = element.querySelector('.vg-modal-body');
			if (!body) {
				return;
			}

			body.classList.add('vg-filepreview-zip-modal__body');
			body.innerHTML = '';

			this._title = document.createElement('div');
			this._title.className = 'vg-filepreview-zip-modal__title';
			this._title.textContent = '';

			this._content = document.createElement('div');
			this._content.className = 'vg-filepreview-zip-modal__content';

			body.appendChild(this._title);
			body.appendChild(this._content);

			this._bindLifecycle(element);
		});
	}

	_bindElements(root) {
		this._title = root.querySelector('.vg-filepreview-zip-modal__title');
		this._content = root.querySelector('.vg-filepreview-zip-modal__content');
	}

	_bindLifecycle(root) {
		if (!root || root.hasAttribute('data-vg-filepreview-zip-lifecycle-bind')) {
			return;
		}

		root.setAttribute('data-vg-filepreview-zip-lifecycle-bind', 'true');
		root.addEventListener('vg.modal.hidden', () => {
			this._destroyModal();
		});
	}

	_loadZipEntries(src) {
		if (this._abortController) {
			this._abortController.abort();
		}
		this._abortController = new AbortController();

		const cached = ZipModal._cache.get(src);
		if (cached?.entries && cached?.arrayBuffer) {
			this._entries = cached.entries;
			this._arrayBuffer = cached.arrayBuffer;
			this._renderEntries(this._entries);
			return;
		}

		fetch(src, {
			method: 'GET',
			signal: this._abortController.signal
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				return response.arrayBuffer();
			})
			.then((buffer) => {
				const entries = this._parseZipEntries(buffer);
				this._entries = entries;
				this._arrayBuffer = buffer;
				ZipModal._cache.set(src, {
					entries,
					arrayBuffer: buffer
				});
				this._renderEntries(entries);
			})
			.catch((error) => {
				if (error?.name === 'AbortError') {
					return;
				}

				if (this._content) {
					const errorText = this._resolveErrorText(error);
					this._content.innerHTML = `<div class="vg-filepreview-zip-modal__error">${this._escapeHtml(this._label('cannotOpenArchive'))}: ${this._escapeHtml(errorText)}</div>`;
				}
			});
	}

	_destroyModal() {
		if (this._abortController) {
			this._abortController.abort();
			this._abortController = null;
		}

		if (this._modal && typeof this._modal.dispose === 'function') {
			this._modal.dispose();
		}

		if (this._root && this._root.parentNode) {
			this._root.parentNode.removeChild(this._root);
		}

		this._root = null;
		this._modal = null;
		this._title = null;
		this._content = null;
		this._labels = null;
		this._entries = [];
		this._arrayBuffer = null;
	}

	_parseZipEntries(arrayBuffer) {
		const view = new DataView(arrayBuffer);
		const length = view.byteLength;

		if (length < 22) {
			throw new Error('invalid_zip');
		}

		const eocdOffset = this._findEndOfCentralDirectory(view);
		if (eocdOffset < 0) {
			throw new Error('central_directory_not_found');
		}

		const totalEntries = view.getUint16(eocdOffset + 10, true);
		const centralDirOffset = view.getUint32(eocdOffset + 16, true);

		const decoder = new TextDecoder('utf-8', { fatal: false });
		const entries = [];
		let ptr = centralDirOffset;

		for (let i = 0; i < totalEntries; i += 1) {
			if (ptr + 46 > length) {
				break;
			}

			const signature = view.getUint32(ptr, true);
			if (signature !== 0x02014b50) {
				break;
			}

			const compressedSize = view.getUint32(ptr + 20, true);
			const uncompressedSize = view.getUint32(ptr + 24, true);
			const compressionMethod = view.getUint16(ptr + 10, true);
			const fileNameLen = view.getUint16(ptr + 28, true);
			const extraLen = view.getUint16(ptr + 30, true);
			const commentLen = view.getUint16(ptr + 32, true);
			const localHeaderOffset = view.getUint32(ptr + 42, true);

			const nameStart = ptr + 46;
			const nameEnd = nameStart + fileNameLen;
			if (nameEnd > length) {
				break;
			}

			const fileNameBytes = new Uint8Array(arrayBuffer, nameStart, fileNameLen);
			const fileName = decoder.decode(fileNameBytes);

			entries.push({
				name: fileName,
				compressedSize,
				uncompressedSize,
				compressionMethod,
				localHeaderOffset,
				isDirectory: fileName.endsWith('/')
			});

			ptr = nameEnd + extraLen + commentLen;
		}

		return entries;
	}

	_findEndOfCentralDirectory(view) {
		const minOffset = Math.max(0, view.byteLength - 65557);
		for (let i = view.byteLength - 22; i >= minOffset; i -= 1) {
			if (view.getUint32(i, true) === 0x06054b50) {
				return i;
			}
		}
		return -1;
	}

	_renderEntries(entries) {
		if (!this._content) {
			return;
		}

		if (!entries.length) {
			this._content.innerHTML = `<div class="vg-filepreview-zip-modal__empty">${this._escapeHtml(this._label('archiveEmptyUnsupported'))}</div>`;
			return;
		}

		const rows = entries.map((entry, index) => {
			const type = entry.isDirectory
				? this._label('typeDir')
				: this._label('typeFile');
			const compressed = entry.isDirectory ? '-' : this._formatSize(entry.compressedSize);
			const original = entry.isDirectory ? '-' : this._formatSize(entry.uncompressedSize);
			const previewAction = (!entry.isDirectory && this._canPreviewEntry(entry))
				? `<button type="button" class="vg-filepreview-zip-modal__entry-btn" data-entry-index="${index}">${this._escapeHtml(this._label('previewEntry'))}</button>`
				: '-';

			return `
<tr>
	<td>${index + 1}</td>
	<td class="name">${this._escapeHtml(entry.name)}</td>
	<td>${type}</td>
	<td>${compressed}</td>
	<td>${original}</td>
	<td>${previewAction}</td>
</tr>`;
		}).join('');

		this._content.innerHTML = `
<table class="vg-filepreview-zip-modal__table">
	<thead>
		<tr>
			<th>#</th>
			<th>${this._escapeHtml(this._label('tableName'))}</th>
			<th>${this._escapeHtml(this._label('tableType'))}</th>
			<th>${this._escapeHtml(this._label('tablePacked'))}</th>
			<th>${this._escapeHtml(this._label('tableSize'))}</th>
			<th>${this._escapeHtml(this._label('tablePreview'))}</th>
		</tr>
	</thead>
	<tbody>
		${rows}
	</tbody>
</table>`;
		this._bindEntriesPreview();
	}

	_label(key, fallback = '') {
		const value = this._labels?.[key];
		return typeof value === 'string' && value.trim() ? value : fallback;
	}

	_resolveErrorText(error) {
		const message = String(error?.message || '').trim();
		if (!message) {
			return this._label('unknownError');
		}

		if (message === 'invalid_zip') {
			return this._label('invalidZip');
		}

		if (message === 'central_directory_not_found') {
			return this._label('centralDirectoryNotFound');
		}

		return message;
	}

	_formatSize(bytes) {
		if (!Number.isFinite(bytes) || bytes < 0) {
			return '-';
		}

		const units = ['B', 'KB', 'MB', 'GB'];
		let value = bytes;
		let unitIndex = 0;
		while (value >= 1024 && unitIndex < units.length - 1) {
			value /= 1024;
			unitIndex += 1;
		}

		const digits = value >= 100 || unitIndex === 0 ? 0 : 2;
		return `${value.toFixed(digits)} ${units[unitIndex]}`;
	}

	_escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	_bindEntriesPreview() {
		if (!this._content || this._content.hasAttribute('data-vg-filepreview-zip-preview-bind')) {
			return;
		}

		this._content.setAttribute('data-vg-filepreview-zip-preview-bind', 'true');
		this._content.addEventListener('click', (event) => {
			const button = event.target.closest('[data-entry-index]');
			if (!button) {
				return;
			}

			event.preventDefault();
			const index = Number(button.getAttribute('data-entry-index'));
			if (!Number.isFinite(index) || index < 0 || index >= this._entries.length) {
				return;
			}
			this._previewEntry(index);
		});
	}

	_canPreviewEntry(entry) {
		if (!entry || entry.isDirectory || !entry.name) {
			return false;
		}

		const ext = this._extractExtension(entry.name);
		const allowed = new Set([
			'.txt', '.md', '.json', '.xml', '.yml', '.yaml', '.csv', '.log',
			'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'
		]);
		return allowed.has(ext);
	}

	async _previewEntry(index) {
		if (!this._content) {
			return;
		}

		const entry = this._entries[index];
		if (!entry || !this._canPreviewEntry(entry)) {
			return;
		}

		let panel = this._content.querySelector('.vg-filepreview-zip-modal__entry-preview');
		if (!panel) {
			panel = document.createElement('div');
			panel.className = 'vg-filepreview-zip-modal__entry-preview';
			this._content.appendChild(panel);
		}

		panel.innerHTML = `<div class="vg-filepreview-zip-modal__entry-preview-loading">${this._escapeHtml(this._label('loadingEntry'))}</div>`;

		try {
			const uint8 = await this._extractEntryBytes(entry);
			const ext = this._extractExtension(entry.name);

			if (this._isImageExtension(ext)) {
				const blob = new Blob([uint8.buffer], { type: this._mimeByExtension(ext) });
				const url = URL.createObjectURL(blob);
				panel.innerHTML = `
<div class="vg-filepreview-zip-modal__entry-preview-title">${this._escapeHtml(entry.name)}</div>
<img class="vg-filepreview-zip-modal__entry-preview-image" src="${url}" alt="${this._escapeHtml(entry.name)}" />`;
				setTimeout(() => URL.revokeObjectURL(url), 2000);
				return;
			}

			const decoder = new TextDecoder('utf-8', { fatal: false });
			const text = decoder.decode(uint8);
			const safeText = this._escapeHtml(text || this._label('emptyFileInArchive'));
			panel.innerHTML = `
<div class="vg-filepreview-zip-modal__entry-preview-title">${this._escapeHtml(entry.name)}</div>
<pre class="vg-filepreview-zip-modal__entry-preview-text">${safeText}</pre>`;
		} catch (error) {
			panel.innerHTML = `<div class="vg-filepreview-zip-modal__entry-preview-error">${this._escapeHtml(this._label('cannotPreviewEntry'))}: ${this._escapeHtml(error?.message || this._label('unknownError'))}</div>`;
		}
	}

	async _extractEntryBytes(entry) {
		if (!this._arrayBuffer) {
			throw new Error(this._label('archiveBufferMissing'));
		}

		const view = new DataView(this._arrayBuffer);
		const offset = Number(entry.localHeaderOffset || 0);
		if (offset + 30 > view.byteLength) {
			throw new Error(this._label('entryCorrupted'));
		}

		const signature = view.getUint32(offset, true);
		if (signature !== 0x04034b50) {
			throw new Error(this._label('entryCorrupted'));
		}

		const nameLen = view.getUint16(offset + 26, true);
		const extraLen = view.getUint16(offset + 28, true);
		const dataStart = offset + 30 + nameLen + extraLen;
		const dataEnd = dataStart + Number(entry.compressedSize || 0);
		if (dataEnd > view.byteLength) {
			throw new Error(this._label('entryCorrupted'));
		}

		const compressed = new Uint8Array(this._arrayBuffer.slice(dataStart, dataEnd));
		const method = Number(entry.compressionMethod || 0);

		if (method === 0) {
			return compressed;
		}

		if (method === 8) {
			if (typeof DecompressionStream === 'undefined') {
				throw new Error(this._label('deflateNotSupported'));
			}

			const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
			const decompressed = await new Response(stream).arrayBuffer();
			return new Uint8Array(decompressed);
		}

		throw new Error(this._label('compressionNotSupported'));
	}

	_extractExtension(name) {
		const value = String(name || '').toLowerCase();
		const clean = value.split('/').pop() || '';
		if (!clean.includes('.')) {
			return '';
		}
		return `.${clean.split('.').pop() || ''}`;
	}

	_isImageExtension(ext) {
		return new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp']).has(ext);
	}

	_mimeByExtension(ext) {
		const map = {
			'.png': 'image/png',
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.gif': 'image/gif',
			'.webp': 'image/webp',
			'.svg': 'image/svg+xml',
			'.bmp': 'image/bmp'
		};
		return map[ext] || 'application/octet-stream';
	}

}

ZipModal._cache = new Map();

export default ZipModal;
