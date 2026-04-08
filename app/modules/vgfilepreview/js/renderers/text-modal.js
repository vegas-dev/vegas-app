import VGModal from "../../../vgmodal";

class TextModal {
	constructor() {
		this._modalId = 'vg-filepreview-text-modal';
		this._abortController = null;
		this._labels = {};
	}

	static getInstance() {
		if (!TextModal._instance) {
			TextModal._instance = new TextModal();
		}

		return TextModal._instance;
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
		const ext = String(payload.ext || '').toLowerCase();
		this._title.textContent = title || defaultTitle;
		this._content.textContent = this._label('loading');
		this._content.classList.remove('is-markdown');
		this._modal.show();

		this._loadText(src, {ext});
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
			sizes: {
				width: '600px',
				height: '',
			},
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
			element.classList.add('vg-filepreview-text-modal');

			const body = element.querySelector('.vg-modal-body');
			const content = element.querySelector('.vg-modal-content');
			if (!body || !content) {
				return;
			}

			body.classList.add('vg-filepreview-text-modal__body');
			body.innerHTML = '';

			let header = element.querySelector('.vg-modal-header');
			if (!header) {
				header = document.createElement('div');
				header.className = 'vg-modal-header';
				content.prepend(header);
			}

			this._title = document.createElement('div');
			this._title.className = 'vg-modal-title';
			this._title.textContent = '';

			this._content = document.createElement('pre');
			this._content.className = 'vg-filepreview-text-modal__content';
			this._content.textContent = '';

			header.appendChild(this._title);
			body.appendChild(this._content);

			this._bindLifecycle(element);
		});
	}

	_bindElements(root) {
		this._title = root.querySelector('.vg-filepreview-text-modal__title');
		this._content = root.querySelector('.vg-filepreview-text-modal__content');
	}

	_bindLifecycle(root) {
		if (!root || root.hasAttribute('data-vg-filepreview-text-lifecycle-bind')) {
			return;
		}

		root.setAttribute('data-vg-filepreview-text-lifecycle-bind', 'true');
		root.addEventListener('vg.modal.hidden', () => {
			this._destroyModal();
		});
	}

	_loadText(src, options = {}) {
		const ext = String(options.ext || '').toLowerCase();
		const cacheKey = `${src}|${ext}`;

		if (TextModal._cache.has(cacheKey)) {
			const cached = TextModal._cache.get(cacheKey);
			this._renderLoadedText(cached, ext);
			return;
		}

		if (this._abortController) {
			this._abortController.abort();
		}

		this._abortController = new AbortController();

		fetch(src, {
			method: 'GET',
			signal: this._abortController.signal
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				return response.text();
			})
			.then((text) => {
				const normalized = text || '';
				TextModal._cache.set(cacheKey, normalized);
				this._renderLoadedText(normalized, ext);
			})
			.catch((error) => {
				if (!this._content) {
					return;
				}

				if (error?.name === 'AbortError') {
					return;
				}

				this._content.classList.remove('is-markdown');
				this._content.textContent = `${this._label('cannotOpen')}: ${error?.message || this._label('unknownError')}`;
			});
	}

	_renderLoadedText(text, ext) {
		if (!this._content) {
			return;
		}

		const normalized = String(text || '');
		if (ext === '.md') {
			this._content.classList.add('is-markdown');
			this._content.innerHTML = this._renderMarkdown(normalized);
		} else {
			this._content.classList.remove('is-markdown');
			this._content.textContent = normalized || this._label('emptyFile');
		}
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
	}

	_label(key, fallback = '') {
		const value = this._labels?.[key];
		return typeof value === 'string' && value.trim() ? value : fallback;
	}

	_renderMarkdown(markdownText) {
		const escapeHtml = (value) => String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

		const inline = (line) => {
			let result = escapeHtml(line);
			result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
			result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
			result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
			result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
				const safeHref = this._sanitizeUrl(href);
				return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`;
			});
			return result;
		};

		const lines = String(markdownText || '').split(/\r?\n/);
		const html = [];
		let inList = false;
		let inCode = false;

		lines.forEach((rawLine) => {
			const line = rawLine || '';

			if (line.trim().startsWith('```')) {
				if (!inCode) {
					inCode = true;
					html.push('<pre><code>');
				} else {
					inCode = false;
					html.push('</code></pre>');
				}
				return;
			}

			if (inCode) {
				html.push(`${escapeHtml(line)}\n`);
				return;
			}

			if (!line.trim()) {
				if (inList) {
					inList = false;
					html.push('</ul>');
				}
				return;
			}

			const heading = line.match(/^(#{1,6})\s+(.+)$/);
			if (heading) {
				if (inList) {
					inList = false;
					html.push('</ul>');
				}

				const level = heading[1].length;
				html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
				return;
			}

			const listItem = line.match(/^[-*]\s+(.+)$/);
			if (listItem) {
				if (!inList) {
					inList = true;
					html.push('<ul>');
				}
				html.push(`<li>${inline(listItem[1])}</li>`);
				return;
			}

			if (inList) {
				inList = false;
				html.push('</ul>');
			}

			html.push(`<p>${inline(line)}</p>`);
		});

		if (inList) {
			html.push('</ul>');
		}
		if (inCode) {
			html.push('</code></pre>');
		}

		return html.join('') || `<p>${this._escapeHtml(this._label('emptyFile'))}</p>`;
	}

	_escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	_sanitizeUrl(url) {
		const value = String(url || '').trim();
		if (!value) {
			return '#';
		}

		try {
			const parsed = new URL(value, window.location.origin);
			if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
				return parsed.href;
			}
		} catch {
			return '#';
		}

		return '#';
	}

}

TextModal._cache = new Map();

export default TextModal;
