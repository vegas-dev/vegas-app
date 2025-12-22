import BaseModule from "../../base-module";
import {mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import Html from "../../../utils/js/components/templater";
import {Manipulator, Classes} from "../../../utils/js/dom/manipulator";
import DragDropFiles from "./dragDropFiles";
import {lang_messages} from "../../../utils/js/components/lang";


/**
 * Constants
 */
const NAME                  = 'files';
const NAME_KEY              = 'vg.files';
const SELECTOR_DATA_TOGGLE  = '[data-vg-toggle="files"]';
const SELECTOR_DATA_DISMISS = '[data-dismiss="file"]';
const SELECTOR_DATA_FAKE    = '[data-vg-files="generated"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_INFO      = `${CLASS_NAME_CONTAINER}-info`;
const CLASS_NAME_IMAGES    = `${CLASS_NAME_INFO}--images`;
const CLASS_NAME_LIST      = `${CLASS_NAME_INFO}--list`;
const CLASS_NAME_DROP      = `${CLASS_NAME_CONTAINER}-drop`;
const CLASS_NAME_ERRORS    = `${CLASS_NAME_CONTAINER}-errors`;

const EVENT_KEY_CHANGE   = `${NAME_KEY}.change`;
const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_DISMISS_DATA_API    = `click.${NAME_KEY}.data.api`;

class VGFiles extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(this._element, mergeDeepObject({
			allowed: true,
			lang: document.documentElement.lang || 'ru',
			limits: {
				count: 0,
				sizes: 10 // MB
			},
			image: false,
			detach: true,
			info: true,
			types: [], // 'image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff", "image/webp"
		}, params));

		const toggleEl = Selectors.find('[data-vg-toggle]', this._element);
		this.id     = toggleEl?.id || undefined;
		this.name   = toggleEl?.name || 'files[]';
		this.accept = toggleEl?.getAttribute('accept') || undefined;

		this._tpl    = Html('dom');
		this._files  = [];
		this._errors = [];
		this._objectUrls = [];

		this._init();
		this._addEventListener();
	}

	static get NAME() { return NAME; }
	static get NAME_KEY() { return NAME_KEY; }

	_init() {
		this._dragDrop = Selectors.find(`.${CLASS_NAME_DROP}`, this._element);
		if (this._dragDrop) {
			new DragDropFiles(this._dragDrop, this._params).init();
		}
	}

	build() {
		const $fileInfo = Selectors.find(`.${CLASS_NAME_INFO}`, this._element);
		if (!$fileInfo) return;

		this._updateCounter($fileInfo);
		this.change();
	}

	change(input = null) {
		const values = input?.files || this._files;
		
		this.clear();
		if (!this._params.allowed) this._files = [];

		if (values.length) {
			this._cleanupErrors();
			const appendedFiles = this.append(values);

			if (appendedFiles.length) {
				this._generateHiddenInputs(appendedFiles);
				this._renderUI(appendedFiles);
			}

			EventHandler.trigger(this._element, EVENT_KEY_CHANGE, { files: appendedFiles });
		}
	}

	_renderUI(files) {
		const $fileInfo = Selectors.find(`.${CLASS_NAME_INFO}`, this._element);
		if (!$fileInfo) return;

		Classes.add($fileInfo, 'show');
		this._updateCounter($fileInfo);
		this.setImages(files);
		this.setInfoList(files);
	}

	_updateCounter(container) {
		const $count = Selectors.find(`.${CLASS_NAME_INFO}--wrapper-count`, container);
		if ($count) {
			const sizeText = this._files.length ? `<span>[${this._getSizes(this._files, true)}]</span>` : '';
			$count.innerHTML = `${this._files.length}${sizeText}`;
		}
	}

	_generateHiddenInputs(files) {
		this._cleanupFakeInputs();
		files.forEach((file, index) => {
			const input = document.createElement('input');
			input.type = 'file';
			input.name = `${this.name.replace('[]', '')}[${index}]`;
			input.dataset.vgFiles = 'generated';
			Manipulator.hide(input);

			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			input.files = dataTransfer.files;

			this._element.appendChild(input);
		});
	}

	append(values) {
		const newFiles = Array.from(values);
		const allFiles = [...this._files, ...newFiles];

		this._files = allFiles.reduce((acc, file) => {
			const isDuplicate = acc.some(f => f.name === file.name && f.size === file.size && f.type === file.type);
			if (!isDuplicate) acc.push(file);
			return acc;
		}, []);

		this._files = this._filterFiles(this._files);
		this._renderErrors();

		return this._files;
	}

	removeFile(button) {
		const fileData = {
			name: normalizeData(Manipulator.get(button, 'data-name')),
			size: normalizeData(Manipulator.get(button, 'data-size')),
			type: normalizeData(Manipulator.get(button, 'data-type')),
		};

		this._files = this._files.filter(f => 
			!(f.name === fileData.name && f.size === fileData.size && f.type === fileData.type)
		);

		this._files.length ? this.build() : this.clear(true);
	}

	clear(all = false) {
		this._revokeUrls();
		
		const selectors = [`.${CLASS_NAME_IMAGES}`, `.${CLASS_NAME_LIST}`];
		selectors.forEach(s => {
			const el = Selectors.find(s, this._element);
			if (el) el.innerHTML = '';
		});

		if (all) {
			Selectors.findAll('[type="file"]', this._element).forEach(i => i.value = '');
			this._cleanupFakeInputs();
			this._cleanupErrors();
			const $info = Selectors.find(`.${CLASS_NAME_INFO}`, this._element);
			if ($info) Classes.remove($info, 'show');
			this._files = [];
		}
	}

	_revokeUrls() {
		this._objectUrls.forEach(url => URL.revokeObjectURL(url));
		this._objectUrls = [];
	}

	setImages(files) {
		if (!this._params.image) return;

		const $fileInfo = Selectors.find(`.${CLASS_NAME_INFO}`, this._element);
		let $container = Selectors.find(`.${CLASS_NAME_IMAGES}`, this._element);

		if (!$container && $fileInfo) {
			$container = this._tpl.div({ class: CLASS_NAME_IMAGES });
			$fileInfo.prepend($container);
		}

		files.forEach(file => {
			const src = URL.createObjectURL(file);
			this._objectUrls.push(src);
			$container.appendChild(this._tpl.span({}, [this._tpl.img(src, file.name)]));
		});
	}

	setInfoList(files) {
		if (!this._params.info) return;

		const $fileInfo = Selectors.find(`.${CLASS_NAME_INFO}`, this._element);
		let $list = Selectors.find(`.${CLASS_NAME_LIST}`, this._element);

		if (!$list && $fileInfo) {
			$list = this._tpl.ul([], { class: CLASS_NAME_LIST });
			$fileInfo.append($list);
		}

		files.forEach((file, i) => {
			const $li = this._tpl.li({}, [
				this._tpl.span({class: 'iteration'}, `${i + 1}.`),
				this._tpl.span({class: 'name'}, file.name),
				this._tpl.span({class: 'size'}, `[${this._getSizes(file.size)}]`)
			]);

			if (this._params.detach) {
				const $btn = this._tpl.button('✕', 'button', {
					type: 'button',
					'data-dismiss': 'file',
					'data-name': file.name,
					'data-size': file.size,
					'data-type': file.type
				});
				$li.append($btn);
			}
			$list.append($li);
		});
	}

	_filterFiles(files) {
		this._errors = [];
		let filtered = files;

		// Filter Type
		if (this._params.types?.length) {
			filtered = filtered.filter(f => {
				const ok = this._checkType(f.type);
				if (!ok) this._errors.push('is-types');
				return ok;
			});
		}

		// Filter Size
		const maxSize = this._params.limits.sizes * 1024 * 1024;
		filtered = filtered.filter(f => {
			const ok = f.size <= maxSize;
			if (!ok) this._errors.push('is-sizes');
			return ok;
		});

		// Filter Count
		if (this._params.limits.count > 0 && filtered.length > this._params.limits.count) {
			this._errors.push('is-count');
			filtered = filtered.slice(0, this._params.limits.count);
		}

		return filtered;
	}

	_getSizes(size, isArray = false) {
		const totalSize = isArray ? size.reduce((acc, f) => acc + f.size, 0) : size;
		const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];
		const index = totalSize > 0 ? Math.min(Math.floor(Math.log(totalSize) / Math.log(1024)), units.length - 1) : 0;

		return new Intl.NumberFormat(this._params.lang, {
			style: 'unit',
			unit: units[index],
			unitDisplay: 'short',
			maximumFractionDigits: 2
		}).format(totalSize / Math.pow(1024, index));
	}

	_checkType(type) {
		return this._params.types.includes(type);
	}

	_cleanupFakeInputs() {
		Selectors.findAll(SELECTOR_DATA_FAKE, this._element).forEach(el => el.remove());
	}

	_cleanupErrors() {
		this._errors = [];
		Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element)?.remove();
	}

	_renderErrors() {
		if (!this._errors.length) return;

		const uniqueErrors = [...new Set(this._errors)];
		const messages = lang_messages(this._params.lang, NAME) || this._getFallbackErrors();

		let $errorCont = Selectors.find(`.${CLASS_NAME_ERRORS}`, this._element);
		if (!$errorCont) {
			$errorCont = this._tpl.div({ class: CLASS_NAME_ERRORS });
			Selectors.find(`.${CLASS_NAME_INFO}`, this._element)?.before($errorCont);
		}

		uniqueErrors.forEach(errKey => {
			const msg = messages[errKey] || errKey;
			$errorCont.append(this._tpl.span({ class: 'error-item' }, [this._tpl.span({}, msg)]));
		});
	}

	_getFallbackErrors() {
		return {
			'is-count': `Limit: ${this._params.limits.count}`,
			'is-sizes': `Max size: ${this._params.limits.sizes}MB`,
			'is-types': `Allowed: ${this._params.types.join(', ')}`
		};
	}

	_addEventListener() {
		Selectors.findAll(SELECTOR_DATA_TOGGLE, this._element).forEach(el => {
			el.addEventListener('change', () => this.change(el));
		});

		const $dismiss = Selectors.find('[data-dismiss="vg-files"]', this._element);
		$dismiss?.addEventListener('click', (e) => {
			e.preventDefault();
			this.clear(true);
		});
	}

	dispose() {
		this.clear(true);
		super.dispose();
	}
}

/**
 * Data API
 */
EventHandler.on(document, EVENT_KEY_DOM_LOADED_DATA_API, () => {
	Selectors.findAll(`.${CLASS_NAME_CONTAINER}`).forEach(el => VGFiles.getOrCreateInstance(el));
});

EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS, function (event) {
	const target = event.target.closest(`.${CLASS_NAME_CONTAINER}`);
	if (!target) return;
	event.preventDefault();
	VGFiles.getOrCreateInstance(target).removeFile(this);
});

export default VGFiles;
