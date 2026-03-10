import BaseModule from "../../base-module";
import {mergeDeepObject} from "../../../utils/js/functions";
import Html from "../../../utils/js/components/templater";
import {lang_messages} from "../../../utils/js/components/lang";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";
import Selectors from "../../../utils/js/dom/selectors";
import {getSVG} from "../../module-fn";

class VGFilesBase extends BaseModule {
	constructor(element, params = {}, defaults = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject(defaults, params));
		this._params.init = ('init' in params) && params.init || this._params.init;

		if (!this._params.init) {
			this._isInitialized = false;
			return;
		}
		this._isInitialized = true;

		this._tpl = Html('dom');
		this._files = [];
		this._errors = new Set();
		this._objectUrls = [];

		this._nodes = {
			stat: Selectors.find(`.${this._getClass('stat')}`, this._element),
			info: Selectors.find(`.${this._getClass('info')}`, this._element),
			drop: Selectors.find(`.${this._getClass('drop')}`, this._element),
		};

		this.template = '<li data-file="" class="file"><div class="file-image"></div><div class="file-info"></div><div class="file-remove"></div></li>';
		this._onNativeInputChange = (e) => this.change(e?.target);

		this._init();
	}

	_getClass(name) {
		const map = {
			'stat': 'vg-files-stat',
			'stat-progress': 'vg-files-stat-progress',
			'info': 'vg-files-info',
			'info-list': 'vg-files-info--list',
			'drop': 'vg-files-drop',
			'drop-list': 'vg-files-drop--list',
			'drop-message': 'vg-files-drop-message',
			'errors': 'vg-files-errors'
		};
		return map[name] || '';
	}

	_applyRenameToIncomingFiles(files) {
		const rename = this._params?.rename;

		if (!rename) return files;
		if (!Array.isArray(files) || !files.length) return files;

		return files.map((file, index) => {
			if (!file) return file;

			let newName = null;

			if (typeof rename === 'function') {
				newName = rename(file, index);
			} else if (rename === true) {
				newName = this._generateRenamedFileName(file?.name || 'file', index);
			}

			if (!newName || typeof newName !== 'string' || newName.trim() === '') return file;
			if (file.name === newName) return file;

			try {
				const renamed = new File([file], newName, {
					type: file.type || "application/octet-stream",
					lastModified: file.lastModified || Date.now()
				});

				// переносим «кастомные» поля, которые используются в проекте
				['id', 'src', 'image'].forEach((prop) => {
					if (file[prop] !== undefined) {
						Object.defineProperty(renamed, prop, {
							value: file[prop],
							writable: true,
							enumerable: true
						});
					}
				});

				return renamed;
			} catch (e) {
				// если браузер/окружение не позволило создать File — оставляем как есть
				return file;
			}
		});
	}

	_generateRenamedFileName(originalName, index) {
		const safeOriginal = String(originalName || 'file');

		const dotIndex = safeOriginal.lastIndexOf('.');
		const hasExt = dotIndex > 0 && dotIndex < safeOriginal.length - 1;

		const base = hasExt ? safeOriginal.slice(0, dotIndex) : safeOriginal;
		const ext = hasExt ? safeOriginal.slice(dotIndex + 1) : '';

		const stamp = Date.now();
		const seq = index + 1;

		const normalizedBase = base.trim() || 'file';
		return ext ? `${normalizedBase}_${stamp}_${seq}.${ext}` : `${normalizedBase}_${stamp}_${seq}`;
	}

	_init() {
		if (!this._isInitialized) return;

		const isSingle = Number(this._params?.limits?.count) === 1;

		if (isSingle) {
			this._preventOriginalInputFromSubmit(true);
			this._cleanupFakeInputs();
		} else {
			this._preventOriginalInputFromSubmit();
		}

		this._addEventListener();
	}

	change(input = null) {
		const incomingFiles = input?.files;
		if (!incomingFiles?.length) return;

		const filesArray = this._applyRenameToIncomingFiles(Array.from(incomingFiles));

		const isSingle = Number(this._params?.limits?.count) === 1;
		const shouldReplaceOnSingle =
			Boolean(this._params?.replace) &&
			isSingle;

		if (shouldReplaceOnSingle) {
			this.clear(false);
			this.append(filesArray, true);
			this._revokeUrls();
			this._cleanupFakeInputs();
			this._cleanupErrors();

			this._files = this._filterFiles(filesArray);
			if (this._params.prepend) this._files.reverse();

			this.build();
			return;
		}

		if (!this._params.allowed) {
			this.append(filesArray, false);
			this.build();
		} else {
			this.clear();
			this.append(filesArray, true);
			this.build();
		}
	}

	build() {
		this._updateStat();

		if (this._params.ajax) {
			if (this._render.init()) {
				this._render.init()
			} else {
				this._renderUI(this._files);
			}
			this._renderUI(this._files);
		} else {
			this._renderUI(this._files);

			const isSingle = Number(this._params?.limits?.count) === 1;
			if (!isSingle) {
				this._generateHiddenInputs(this._files);
			} else {
				this._cleanupFakeInputs();
			}
		}
	}

	append(values, replace = true) {
		const incoming = this._applyRenameToIncomingFiles(Array.from(values));
		let filesToProcess;

		if (replace) {
			filesToProcess = incoming;
		} else {
			const fileMap = new Map(this._files.map(f => [this._getFileKey(f), f]));
			incoming.forEach(file => {
				fileMap.set(this._getFileKey(file), file);
			});
			filesToProcess = Array.from(fileMap.values());
		}

		this._files = this._filterFiles(filesToProcess);
		if (this._params.prepend) this._files.reverse();

		this._renderErrors();

		return this._files;
	}

	_getFileKey(file) {
		return `${file.name}-${file.size}-${file.type}`;
	}

	_filterFiles(files) {
		this._errors.clear();
		const { count, sizes, total } = this._params.limits;
		const maxSize = sizes * 1024 * 1024;
		const maxTotalSize = total * 1024 * 1024;

		let currentTotalSize = 0;
		const filtered = [];

		for (const file of files) {
			if (count > 0 && filtered.length >= count) {
				this._errors.add('is-count');
				break;
			}

			let isValid = true;

			if (this._params.types.length && !this._params.types.includes(file.type)) {
				this._errors.add('is-types');
				isValid = false;
			}

			if (file.size > maxSize) {
				this._errors.add('is-sizes');
				isValid = false;
			}

			if (isValid && maxTotalSize > 0) {
				if (currentTotalSize + file.size > maxTotalSize) {
					this._errors.add('is-total-size');
					isValid = false;
				} else {
					currentTotalSize += file.size;
				}
			}

			if (isValid) filtered.push(file);
		}

		return filtered;
	}

	_getSizes(size, isArray = false) {
		const totalSize = isArray ? this._files.reduce((acc, f) => acc + f.size, 0) : size;
		const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];
		const index = totalSize > 0 ? Math.min(Math.floor(Math.log(totalSize) / Math.log(1024)), units.length - 1) : 0;
		const value = totalSize / Math.pow(1024, index);

		return new Intl.NumberFormat(this._params.lang, {
			style: 'unit',
			unit: units[index],
			unitDisplay: 'short',
			maximumFractionDigits: 2
		}).format(value);
	}

	_cleanupErrors() {
		this._errors.clear();
		const $errorCont = Selectors.find(`.${this._getClass('errors')}`, this._element);
		if ($errorCont) {
			$errorCont.remove()
		}
	}

	_renderErrors() {
		if (!this._errors.size) return;

		const messages = lang_messages(this._params.lang, 'files') || this._getFallbackErrors();
		let $errorCont = Selectors.find(`.${this._getClass('errors')}`, this._element);

		if (!$errorCont) {
			$errorCont = this._tpl.div({ class: this._getClass('errors') });
			this._element.prepend($errorCont);
		} else {
			$errorCont.innerHTML = '';
		}

		this._errors.forEach(errKey => {
			const msg = messages[errKey] || errKey;
			$errorCont.append(this._tpl.span({ class: 'error-item' }, msg));
		});
	}

	_getFallbackErrors() {
		const { count, sizes, total } = this._params.limits;
		return {
			'is-count': `Limit: ${count}`,
			'is-sizes': `Max size: ${sizes}MB`,
			'is-total-size': `Total max size: ${total}MB`,
			'is-types': `Allowed: ${this._params.types.join(', ')}`
		};
	}

	_renderUI(files) {
		if (this._nodes.drop) {
			this._renderUIDropList(files);
		} else if (this._nodes.info) {
			this._renderInfoList(files);
		}

		this._renderUIStatusDropInfoAjax(this._files)
	}

	_parseTemplate() {
		const render = this._render;
		const fallbackTemplate = '<li data-file="" class="file"><div class="file-image"></div><div class="file-custom"><div class="file-info"></div><div class="file-remove"></div></div></li>';
		let tmpl = this.template || fallbackTemplate;

		if (render) {
			if (render.bufferTemplate) tmpl = render.bufferTemplate;
		}

		const temp = document.createElement('div');
		temp.innerHTML = tmpl;
		let liElement = temp.firstElementChild;

		if (!liElement) {
			temp.innerHTML = fallbackTemplate;
			liElement = temp.firstElementChild;
		}
		const liClasses = liElement.className || '';
		const liClassList = liClasses ? liClasses.split(' ').filter(cls => cls.trim() !== '') : [];

		const childCount = liElement.childElementCount;

		const children = [];
		for (let i = 0; i < childCount; i++) {
			children.push({
				index: i,
				element: liElement.children[i],
				className: liElement.children[i].className
			});
		}

		return {
			children: children,
			template: tmpl,
			liClasses: liClassList,
			liClassName: liClasses
		};
	}

	_renderUIDropList(files) {
		if (!this._nodes.drop) return;

		let $list = Selectors.find(`.${this._getClass('drop-list')}`, this._nodes.drop);
		if (!$list) {
			$list = this._tpl.ul([], { class: this._getClass('drop-list') });
		}

		const $itemsTemplate = this._parseTemplate().children;
		const $itemsTemplateClasses = this._parseTemplate().liClasses.filter(cls => cls !== 'file');
		const fragment = document.createDocumentFragment();

		files.forEach((file) => {
			let classes = $itemsTemplateClasses;

			if (this._params.detach) classes.push('with-remove')
			if (this._params.sortable.enabled) classes.push('with-sortable')
			if (this._params.limits.count === 1) {
				classes.push('single');

				if (file.type.startsWith('image/')) {
					classes.push('single-image')
				} else {
					classes.push('single-file')
				}
			}

			let parts = [];
			$itemsTemplate.forEach(tmpl => {
				const part = this._renderTemplatePart(tmpl.element, file, null, { isDrop: true });
				if (part) parts.push(part);
			});

			const $li = this._tpl.li(
				{ 'data-name': file.name, 'data-size': file.size, 'data-id': file.id || '', class: 'file ' + classes.join(' ') }, parts
			);

			fragment.appendChild($li);
		});

		$list.innerHTML = '';
		$list.appendChild(fragment);

		const $message = Selectors.find(`.${this._getClass('drop-message')}`, this._nodes.drop);
		if ($message) {
			if (files.length) Classes.add($message, 'has-files');
			else Classes.remove($message, 'has-files');

			const isSingle = Number(this._params?.limits?.count) === 1;
			if (isSingle) {
				if (files.length) Classes.remove($message, 'show');
				else Classes.add($message, 'show');
			}
		}

		this._nodes.drop.appendChild($list);
		Classes.add(this._nodes.drop, 'active');
	}

	_renderInfoList(files) {
		if (!this._nodes.info) return;

		let $list = Selectors.find(`.${this._getClass('info-list')}`, this._element);
		if (!$list) {
			$list = this._tpl.ul([], { class: this._getClass('info-list') });
			this._nodes.info.appendChild($list);
		}

		if (!this._params.info) Classes.add($list, 'list-row');

		$list.innerHTML = '';

		const $itemsTemplate = this._parseTemplate().children;
		const $itemsTemplateClasses = this._parseTemplate().liClasses.filter(cls => cls !== 'file');
		const fragment = document.createDocumentFragment();

		files.forEach((file, i) => {
			let classes = $itemsTemplateClasses;

			if (this._params.image) classes.push('with-image');
			if (this._params.info) classes.push('with-info');
			if (this._params.detach) classes.push('with-remove')
			if (this._params.sortable.enabled) classes.push('with-sortable');

			let parts = [];
			$itemsTemplate.forEach(tmpl => {
				const part = this._renderTemplatePart(tmpl.element, file, i);
				if (part) parts.push(part);
			});

			const $li = this._tpl.li(
				{ 'data-name': file.name, 'data-size': file.size, 'data-type': file.type, 'data-id': file.id || '', class: 'file ' + classes.join(' ') + ' ' }, parts
			);
			fragment.appendChild($li);
		});
		$list.appendChild(fragment);

		Classes.add(this._nodes.info, 'show')
	}

	_renderTemplatePart(element, file, index = null, options = {}) {
		if (!element) return null;
		const { isDrop = false } = options;

		const classList = element?.classList;

		if (classList?.contains('file-image')) return this._renderUIImage(file);
		if (classList?.contains('file-info')) {
			if (isDrop) return null;
			return this._renderUIInfo(file, index);
		}
		if (classList?.contains('file-remove')) return this._wrapInFileCustom(this._renderUIDetach(file));

		const $part = element.cloneNode(true);

		this._replaceTemplateSlot($part, '.file-image', () => this._renderUIImage(file));
		this._replaceTemplateSlot($part, '.file-info', () => isDrop ? null : this._renderUIInfo(file, index));
		this._replaceTemplateSlot($part, '.file-remove', () => this._renderUIDetach(file));

		return this._wrapInFileCustom($part);
	}

	_wrapInFileCustom(node) {
		if (!node) return null;
		if (node.classList?.contains('file-custom')) return node;

		const wrapper = document.createElement('div');
		wrapper.className = 'file-custom';
		wrapper.appendChild(node);

		return wrapper;
	}

	_replaceTemplateSlot(container, selector, renderer) {
		const isMatchSelf = container?.matches && container.matches(selector);
		const matched = isMatchSelf ? [container] : Array.from(container.querySelectorAll(selector));

		matched.forEach((node) => {
			const replacement = renderer();
			if (replacement) node.replaceWith(replacement);
			else node.remove();
		});
	}

	_renderUIDetach(file) {
		if (this._params.detach) {
			return this._tpl.div({ class: 'file-remove' }, [
				this._setButtonElement(file)
			])
		}
	}

	_renderUIInfo(file, i) {
		if (this._params.info) {
			return  this._tpl.div({ class: 'file-info' }, [
				this._tpl.span({ class: 'iteration' }, `${i + 1}.`),
				this._tpl.span({ class: 'name' }, file.name),
				this._tpl.span({ class: 'size' }, `[${this._getSizes(file.size)}]`)
			]);
		}
	}

	_renderUIImage(file) {
		const $container = this._tpl.div({ class: 'file-image' });

		const src = file?.src || file?.image;
		if (src) {
			$container.appendChild(this._tpl.img(src, file.name || '', { class: 'file-preview' }));
			return $container;
		}

		if (file?.type && file.type.startsWith('image/')) {
			const objectUrl = URL.createObjectURL(file);
			this._objectUrls.push(objectUrl);
			$container.appendChild(this._tpl.img(objectUrl, file.name, { class: 'file-preview' }));
			return $container;
		}

		const icon = this._getIconByFileType(file);
		$container.appendChild(this._tpl.i({}, icon, { isHTML: true }));
		return $container;
	}

	_getIconByFileType(file) {
		if (file.type === 'application/pdf') return getSVG('file-pdf');
		if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return getSVG('file-word');
		if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) return getSVG('file-exel');
		if (file.type === 'application/zip' || file.name.endsWith('.zip')) return getSVG('file-zip');
		if (file.name.endsWith('.txt')) return getSVG('file-text');
		return getSVG('file-generic');
	}

	_updateStat() {
		if (!this._nodes.stat) return;

		const totalSize = this._getSizes(this._files, true);
		const $count = Selectors.find(`.${this._getClass('stat')}-count`, this._nodes.stat);
		if ($count) {
			$count.innerHTML = this._files.length ? `${this._files.length}<span>[${totalSize}]</span>` : '';
		}

		Classes.add(this._nodes.stat, 'show');
	}

	_generateHiddenInputs(files) {
		this._cleanupFakeInputs();
		const fragment = document.createDocumentFragment();
		const idInput =  Manipulator.get(Selectors.find('label', this._element), 'for') || '';
		const name = Selectors.findID(idInput, this._element)?.name || Selectors.findID(idInput, this._element)?.dataset.originalName || 'files[]';

		const baseName = name.endsWith('[]') ? name.slice(0, -2) : name;
		const isSingle = Number(this._params?.limits?.count) === 1;

		if (isSingle) return;

		files.forEach((file, index) => {
			const input = document.createElement('input');
			input.type = 'file';
			input.name = `${baseName}[${index}]`;
			input.dataset.vgFiles = 'generated';
			Manipulator.hide(input);

			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			input.files = dataTransfer.files;
			fragment.appendChild(input);
		});

		this._element.appendChild(fragment);
	}

	_cleanupFakeInputs() {
		Selectors.findAll('[data-vg-files="generated"]', this._element).forEach(el => el.remove());
	}

	clear(resetInput = true) {
		this._revokeUrls();
		if (resetInput) {
			this._resetFileInput();
		}
		this._cleanupFakeInputs();
		this._cleanupErrors();
		this._files = [];

		if (this._nodes.info) {
			Classes.remove(this._nodes.info, 'show');
			const $list = Selectors.find(`.${this._getClass('info-list')}`, this._element);
			if ($list) $list.innerHTML = '';
		}
		if (this._nodes.drop) {
			const $list = Selectors.find(`.${this._getClass('drop-list')}`, this._element);
			if ($list) $list.innerHTML = '';

			const $message = Selectors.find(`.${this._getClass('drop-message')}`, this._element);
			if ($message) {
				Classes.remove($message, 'has-files');

				const isSingle = Number(this._params?.limits?.count) === 1;
				if (isSingle) {
					Classes.add($message, 'show');
				}
			}

			Classes.remove(this._nodes.drop, 'active');
		}
		if (this._nodes.stat) {
			Classes.remove(this._nodes.stat, 'show');
		}
	}

	_revokeUrls() {
		this._objectUrls.forEach(url => URL.revokeObjectURL(url));
		this._objectUrls = [];
	}

	_resetFileInput() {
		Selectors.findAll('[data-vg-toggle="files"]', this._element).forEach(input => input.value = '');
	}

	_preventOriginalInputFromSubmit(isRestore = false) {
		const el = Selectors.find('[data-vg-toggle="files"]', this._element);
		if (!el) return;
		if (!isRestore && !el.dataset.originalName) {
			el.dataset.originalName = el.name;
			el.removeAttribute('name');
		} else if (isRestore && el.dataset.originalName) {
			el.name = el.dataset.originalName;
			delete el.dataset.originalName;
		}
	}

	_addEventListener() {
		Selectors.findAll('[data-vg-toggle="files"]', this._element).forEach(el => {
			el.removeEventListener('change', this._onNativeInputChange);
			el.addEventListener('change', this._onNativeInputChange);
		});
	}

	dispose() {
		this.clear();
		super.dispose();
	}
}

export default VGFilesBase;
