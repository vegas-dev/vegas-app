import BaseModule from "../../base-module";
import { isElement, mergeDeepObject, normalizeData } from "../../../utils/js/functions";
import Html from "../../../utils/js/components/templater";
import { lang_messages } from "../../../utils/js/components/lang";
import { Manipulator, Classes } from "../../../utils/js/dom/manipulator";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Базовый класс управления файлами (без AJAX)
 */
class VGFilesBase extends BaseModule {
	constructor(element, params = {}, defaults = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject(defaults, params));
		this._tpl = Html('dom');
		this._files = [];
		this._errors = new Set();
		this._objectUrls = [];

		this._nodes = {
			stat: Selectors.find(`.${this._getClass('stat')}`, this._element),
			info: Selectors.find(`.${this._getClass('info')}`, this._element),
			drop: Selectors.find(`.${this._getClass('drop')}`, this._element),
		};

		this._init();
	}

	_getClass(name) {
		const map = {
			'stat': 'vg-files-stat',
			'info': 'vg-files-info',
			'info-list': 'vg-files-info--list',
			'drop': 'vg-files-drop',
			'drop-list': 'vg-files-drop--list',
			'errors': 'vg-files-errors'
		};
		return map[name] || '';
	}

	_init() {
		this._preventOriginalInputFromSubmit();
		this._addEventListener();
	}

	_getFileKey(file) {
		return `${file.name}-${file.size}`;
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

	append(values) {
		const fileMap = new Map(this._files.map(f => [this._getFileKey(f), f]));
		Array.from(values).forEach(file => {
			fileMap.set(this._getFileKey(file), file);
		});
		this._files = this._filterFiles(Array.from(fileMap.values()));
		this._renderErrors();
		return this._files;
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
		if ($errorCont) $errorCont.remove();
	}

	_renderErrors() {
		if (!this._errors.size) return;

		const messages = lang_messages(this._params.lang, 'files') || this._getFallbackErrors();
		let $errorCont = Selectors.find(`.${this._getClass('errors')}`, this._element);

		if (!$errorCont) {
			$errorCont = this._tpl.div({ class: this._getClass('errors') });
			const $info = Selectors.find(`.${this._getClass('info')}`, this._element);
			if ($info) $info.before($errorCont);
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
	}

	_renderUIDropList(files) {
		let $list = Selectors.find(`.${this._getClass('drop-list')}`, this._element);
		if (!$list) {
			$list = this._tpl.ul([], { class: this._getClass('drop-list') });
			this._nodes.drop.appendChild($list);
		}

		$list.innerHTML = '';
		const fragment = document.createDocumentFragment();
		files.forEach(file => {
			const $li = this._tpl.li(
				{ 'data-name': file.name, 'data-size': file.size, class: 'file with-remove' },
				[
					this._renderUIImage(file),
					this._tpl.div({ class: 'file-remove' }, [this._tpl.button({}, '×')])
				]
			);
			fragment.appendChild($li);
		});
		$list.appendChild(fragment);
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
		const fragment = document.createDocumentFragment();
		files.forEach((file, i) => {
			let classes = [];

			if (this._params.image) {
				classes.push('with-image');
			}
			if (this._params.info) {
				classes.push('with-info');
			}
			if (this._params.detach) {
				classes.push('with-remove')
			}

			const $li = this._tpl.li(
				{ 'data-name': file.name, 'data-size': file.size, 'data-id': file.id || '', class: 'file ' + classes.join(' ') }, [
					this._renderUIImage(file)
				]
			);

			// Добавляем превью изображения, если включено и файл — картинка


			// Добавляем информационную часть (имя, размер), если включено
			if (this._params.info) {
				const $infoContainer = this._tpl.div({ class: 'file-info' }, [
					this._tpl.span({ class: 'iteration' }, `${i + 1}.`),
					this._tpl.span({ class: 'name' }, file.name),
					this._tpl.span({ class: 'size' }, `[${this._getSizes(file.size)}]`)
				]);
				$li.appendChild($infoContainer);
			}

			// Добавляем кнопку удаления, если разрешено
			if (this._params.detach) {
				const $fileRemove = this._tpl.div({ class: 'file-remove' }, [
					this._setButtonElement(file)
				])
				$li.appendChild($fileRemove);
			}

			fragment.appendChild($li);
		});
		$list.appendChild(fragment);

		Classes.add(this._nodes.info, 'show')
	}

	_renderUIImage(file) {
		const $container = this._tpl.div({ class: 'file-image' });
		if (file.type.startsWith('image/')) {
			const src = URL.createObjectURL(file);
			this._objectUrls.push(src);
			$container.appendChild(this._tpl.img(src, file.name, { class: 'file-preview' }));
		} else {
			const icon = this._getIconByFileType(file);
			$container.appendChild(this._tpl.i({}, icon, { isHTML: true }));
		}
		return $container;
	}

	_getIconByFileType(file) {
		if (file.type === 'application/pdf') return '<svg>PDF</svg>';
		if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return '<svg>DOC</svg>';
		if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) return '<svg>XLS</svg>';
		if (file.type === 'application/zip' || file.name.endsWith('.zip')) return '<svg>ZIP</svg>';
		if (file.name.endsWith('.txt')) return '<svg>TXT</svg>';
		return '<svg>FILE</svg>';
	}

	_updateStat() {
		if (!this._nodes.stat) return;
		const totalSize = this._getSizes(this._files, true);
		const $count = Selectors.find(`.${this._getClass('stat')}-count`, this._nodes.stat);
		if ($count) {
			$count.innerHTML = this._files.length ? `${this._files.length}<span>[${totalSize}]</span>` : '';
		}
	}

	_generateHiddenInputs(files) {
		this._cleanupFakeInputs();
		const fragment = document.createDocumentFragment();
		const name = this._element.querySelector('[data-vg-toggle]')?.name || 'files[]';

		files.forEach((file, index) => {
			const input = document.createElement('input');
			input.type = 'file';
			input.name = `${name.replace('[]', '')}[${index}]`;
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

	clear() {
		this._revokeUrls();
		this._resetFileInput();
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
			Classes.add(this._nodes.dropMessage, 'show');
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
			el.addEventListener('change', () => this.change(el));
		});
	}

	change(input = null) {
		const incomingFiles = input?.files;
		if (!incomingFiles?.length) return;

		const filesArray = Array.from(incomingFiles);
		this.clear();
		this.append(filesArray);
		this.build();
	}

	build() {
		this._updateStat();
		this._renderUI(this._files);

		if (!this._params.ajax) {
			this._generateHiddenInputs(this._files);
		}
	}

	dispose() {
		this.clear();
		super.dispose();
	}
}

export default VGFilesBase;