const DEFAULT_OPTIONS = {
	pathAttribute: 'data-vg-filepreview',
	fieldsAttribute: 'data-fields',
	validAttribute: 'data-vg-filepreview-valid',
	errorAttribute: 'data-vg-filepreview-error',
	errorValue: 'invalid-file-path',
	fieldAttribute: 'data-vg-filepreview-field',
	editableAttribute: 'data-vg-filepreview-editable',
	editableFieldsAttribute: 'data-vg-filepreview-editable-fields',
	missingFieldsAttribute: 'data-vg-filepreview-missing-fields'
};

class FilePreviewHelper {
	constructor(element, options = {}) {
		this._element = element;
		this._options = Object.assign({}, DEFAULT_OPTIONS, options);
	}

	getFilePath() {
		if (!this._element) {
			return '';
		}

		const filePath = this._element.getAttribute(this._options.pathAttribute);
		return typeof filePath === 'string' ? filePath.trim() : '';
	}

	getFields() {
		if (!this._element) {
			return [];
		}

		const rawFields = this._element.getAttribute(this._options.fieldsAttribute);
		if (typeof rawFields !== 'string' || !rawFields.trim()) {
			return [];
		}

		return rawFields
			.split(',')
			.map(field => field.trim())
			.filter(field => field && /^[-_a-zA-Z0-9]+$/.test(field));
	}

	validateFilePath(path) {
		if (!path || path === '#' || /^javascript:/i.test(path)) {
			return { isValid: false, fileUrl: null };
		}

		try {
			const parsed = new URL(path, window.location.origin);
			const protocol = parsed.protocol;

			if (!['http:', 'https:', 'blob:', 'data:'].includes(protocol)) {
				return { isValid: false, fileUrl: null };
			}

			if (protocol === 'data:' || protocol === 'blob:') {
				return { isValid: true, fileUrl: parsed };
			}

			const pathname = parsed.pathname || '';
			const fileName = pathname.split('/').filter(Boolean).pop() || '';
			if (!fileName || !fileName.includes('.')) {
				return { isValid: false, fileUrl: null };
			}

			return { isValid: true, fileUrl: parsed };
		} catch {
			return { isValid: false, fileUrl: null };
		}
	}

	syncState(isValid) {
		if (!this._element) {
			return;
		}

		this._element.setAttribute(this._options.validAttribute, isValid ? 'true' : 'false');

		if (isValid) {
			this._element.removeAttribute(this._options.errorAttribute);
			return;
		}

		this._element.setAttribute(this._options.errorAttribute, this._options.errorValue);
	}

	resolveEditableFields(fields = []) {
		if (!this._element || !Array.isArray(fields) || !fields.length) {
			return {};
		}

		return fields.reduce((acc, field) => {
			acc[field] = this._element.querySelector(`.${this._escapeClassName(field)}`);
			return acc;
		}, {});
	}

	syncEditableFields(fieldsMap = {}) {
		if (!this._element) {
			return;
		}

		const previousMarkedFields = this._element.querySelectorAll(`[${this._options.fieldAttribute}]`);
		previousMarkedFields.forEach((node) => {
			node.removeAttribute(this._options.fieldAttribute);
			node.setAttribute(this._options.editableAttribute, 'false');
		});

		const editableFields = [];
		const missingFields = [];

		Object.entries(fieldsMap).forEach(([field, node]) => {
			if (!node) {
				missingFields.push(field);
				return;
			}

			node.setAttribute(this._options.fieldAttribute, field);
			node.setAttribute(this._options.editableAttribute, 'true');
			editableFields.push(field);
		});

		if (editableFields.length) {
			this._element.setAttribute(this._options.editableFieldsAttribute, editableFields.join(','));
		} else {
			this._element.removeAttribute(this._options.editableFieldsAttribute);
		}

		if (missingFields.length) {
			this._element.setAttribute(this._options.missingFieldsAttribute, missingFields.join(','));
		} else {
			this._element.removeAttribute(this._options.missingFieldsAttribute);
		}
	}

	_escapeClassName(value) {
		if (window.CSS && typeof window.CSS.escape === 'function') {
			return window.CSS.escape(value);
		}

		return String(value).replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
	}

	getFileMeta(path) {
		const normalizedPath = typeof path === 'string' ? path.trim() : '';
		const fallback = {
			name: '',
			ext: '',
			originalName: '',
			isMedia: false,
			sizeBytes: null,
			sizeText: ''
		};

		if (!normalizedPath) {
			return fallback;
		}

		try {
			const parsedUrl = new URL(normalizedPath, window.location.origin);
			const pathname = parsedUrl.pathname || '';
			const fileName = decodeURIComponent(pathname.split('/').pop() || '');
			const ext = fileName.includes('.') ? `.${fileName.split('.').pop() || ''}` : '';

			const params = parsedUrl.searchParams;
			const originalName = this._readOriginalName(params);
			const sizeBytes = this._readSize(params);
			const mediaByExt = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.mp4', '.webm', '.mov', '.mkv', '.avi'];

			return {
				name: fileName,
				ext: ext.toLowerCase(),
				originalName,
				isMedia: mediaByExt.includes(ext.toLowerCase()),
				sizeBytes,
				sizeText: this._formatSize(sizeBytes)
			};
		} catch {
			const cleanPath = normalizedPath.split('#')[0].split('?')[0];
			const fileName = decodeURIComponent(cleanPath.split('/').pop() || '');
			const ext = fileName.includes('.') ? `.${fileName.split('.').pop() || ''}` : '';
			const sizeBytes = this._readSize(null);

			return {
				name: fileName,
				ext: ext.toLowerCase(),
				originalName: '',
				isMedia: false,
				sizeBytes,
				sizeText: this._formatSize(sizeBytes)
			};
		}
	}

	_readOriginalName(searchParams) {
		const fromData = this._element?.getAttribute('data-original-name')
			|| this._element?.getAttribute('data-vg-filepreview-original-name')
			|| '';
		if (fromData) {
			return String(fromData).trim();
		}

		const keys = ['original_name', 'originalName', 'filename', 'name'];
		for (const key of keys) {
			const value = searchParams.get(key);
			if (value) {
				return String(value).trim();
			}
		}

		return '';
	}

	_readSize(searchParams) {
		const dataCandidates = [
			this._element?.getAttribute('data-size'),
			this._element?.getAttribute('data-vg-filepreview-size')
		];

		for (const value of dataCandidates) {
			const parsed = this._parseSizeValue(value);
			if (parsed !== null) {
				return parsed;
			}
		}

		if (!searchParams) {
			return null;
		}

		const keys = ['size', 'size_bytes', 'bytes'];
		for (const key of keys) {
			const value = searchParams.get(key);
			const parsed = this._parseSizeValue(value);
			if (parsed !== null) {
				return parsed;
			}
		}

		return null;
	}

	_parseSizeValue(value) {
		if (value === null || value === undefined) {
			return null;
		}

		const normalized = String(value).trim().toLowerCase();
		if (!normalized) {
			return null;
		}

		const match = normalized.match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb|tb)?$/i);
		if (!match) {
			return null;
		}

		const number = Number.parseFloat(match[1]);
		if (!Number.isFinite(number) || number < 0) {
			return null;
		}

		const unit = (match[2] || 'b').toLowerCase();
		const multipliers = {
			b: 1,
			kb: 1024,
			mb: 1024 * 1024,
			gb: 1024 * 1024 * 1024,
			tb: 1024 * 1024 * 1024 * 1024
		};

		return Math.round(number * (multipliers[unit] || 1));
	}

	_formatSize(bytes) {
		if (!Number.isFinite(bytes) || bytes < 0) {
			return '';
		}

		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		let value = bytes;
		let unitIndex = 0;

		while (value >= 1024 && unitIndex < units.length - 1) {
			value /= 1024;
			unitIndex += 1;
		}

		const fractionDigits = value >= 100 || unitIndex === 0 ? 0 : 2;
		return `${value.toFixed(fractionDigits)} ${units[unitIndex]}`;
	}
}

export default FilePreviewHelper;
