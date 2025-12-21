import BaseModule from "../../base-module";
import {mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import Html from "../../../utils/js/components/templater";
import {Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * Constants
 */
const NAME = 'files';
const NAME_KEY = 'vg.files';
const SELECTOR_DATA_TOGGLE  = '[data-vg-toggle="files"]';
const SELECTOR_DATA_DISMISS = '[data-dismiss="file"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_INFO      = CLASS_NAME_CONTAINER + '-info';
const CLASS_NAME_IMAGES    = CLASS_NAME_CONTAINER + '-info--images';
const CLASS_NAME_LIST      = CLASS_NAME_CONTAINER + '-info--list';
const CLASS_NAME_FAKE      = CLASS_NAME_CONTAINER + '-info-fake';
const CLASS_NAME_DROP      = CLASS_NAME_CONTAINER + '-drop';

const EVENT_KEY_CHANGE   = `${NAME_KEY}.change`;

const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;
const EVENT_KEY_DISMISS_DATA_API    = `click.${NAME_KEY}.data.api`;

class VGFiles extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(this._element, mergeDeepObject({
			allowed: true,
			lang: 'ru',
			limits: {
				count: 0,
				sizes: 0
			},
			image: false,
			detach: true,
			info: true,
			types: ['image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff", "image/webp"],
		}, params));

		this.id     = this._element.querySelector('[data-vg-toggle]').getAttribute('id') || undefined;
		this.name   = this._element.querySelector('[data-vg-toggle]').getAttribute('name') || undefined;
		this.accept = this._element.querySelector('[data-vg-toggle]').getAttribute('accept') || undefined;

		this._tpl = Html('dom');
		this._files = [];
		this._addEventListener();

		const setLang = () => {
			switch (this._params.lang) {
				case 'ru': return 'ru-RU'; break;
				default: return 'en-US'; break;
			}
		}
		this._params.lang = setLang();

		this._dragDrop = Selectors.find('.' + CLASS_NAME_DROP, this._element) || null
		if (this._dragDrop) {
			this._initDragDrop();
		}
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	_initDragDrop() {
		const dropZone = this._dragDrop;

		// Добавляем визуальный класс при наведении
		const handleDragOver = (e) => {
			e.preventDefault();
			e.stopPropagation();
			console.log(dropZone.classList.contains('drag-over'))
			if (!dropZone.classList.contains('drag-over')) {
				dropZone.classList.add('drag-over');
			}
		};

		const handleDragLeave = (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.classList.remove('drag-over');
		};

		const handleDrop = (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.classList.remove('drag-over');

			const files = e.dataTransfer.files;
			if (files.length) {
				this._handleDroppedFiles(files);
			}
		};

		// Сохраняем обработчики для возможности удаления
		this._dragHandlers = { handleDragOver, handleDragLeave, handleDrop };

		dropZone.addEventListener('dragover', handleDragOver);
		dropZone.addEventListener('dragleave', handleDragLeave);
		dropZone.addEventListener('drop', handleDrop);
	}

	build() {
		const $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
		if (!$fileInfo) return;

		const $count = Selectors.find('.' + CLASS_NAME_INFO + '--wrapper-count', $fileInfo);
		if ($count) {
			$count.innerHTML = this._files.length + (this._files.length ? '<span>[' + this._getSizes(this._files, true) + ']</span>' : '');
		}

		this.change()
	}

	change(input = null) {
		let values = input !== null ? input.files : this._files,
			appended_files = [];

		this.clear();

		if (!this._params.allowed) this._files = [];

		if (values.length) {
			/*if (this._params.limits.count !== 1) {
				input.removeAttribute('id');
				input.removeAttribute('data-vg-toggle');
				input.classList.add(CLASS_NAME_FAKE);
				input.onchange = null;

				this._addEventListener();
			}*/

			appended_files = this.append(values);

			if (appended_files.length) {
				let $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
				if ($fileInfo) {
					$fileInfo.classList.add('show');

					let $count = Selectors.find('.' + CLASS_NAME_INFO + '--wrapper-count', $fileInfo);
					if ($count) $count.innerHTML = appended_files.length + '<span>[' + this._getSizes(appended_files, true) + ']</span>';

					const inputName = this.name || 'files[]';
					appended_files.forEach((file, index) => {
						// Создаём Blob из файла и input типа file
						const fileInput = document.createElement('input');
						fileInput.type = 'file';
						fileInput.name = `${inputName}[${index}]`;
						fileInput.dataset.vgFiles = 'generated';
						fileInput.style.display = 'none';

						// Создаём DataTransfer для установки файла
						const dataTransfer = new DataTransfer();
						dataTransfer.items.add(file);
						fileInput.files = dataTransfer.files;

						console.log(fileInput)
					});

					this.setImages(appended_files);
					this.setInfoList(appended_files);
				}
			}

			EventHandler.trigger(this._element, EVENT_KEY_CHANGE, {});
		}
	}

	append(values) {
		const files = Array.from(values);
		this._files = [...this._files, ...files];

		const uniqueFiles = this._files.reduce((acc, file) => {
			const isDuplicate = acc.some(existingFile =>
				existingFile.name === file.name &&
				existingFile.size === file.size &&
				existingFile.type === file.type
			);
			if (!isDuplicate) {
				acc.push(file);
			}
			return acc;
		}, []);

		const filtered = this._filterFiles(uniqueFiles);
		this._files = filtered;

		return filtered;
	}

	removeFile(button) {
		let file = {
			name: normalizeData(Manipulator.get(button, 'data-name')),
			size: normalizeData(Manipulator.get(button, 'data-size')),
			type: normalizeData(Manipulator.get(button, 'data-type')),
		}

		if (!file.name && !file.size && !file.type) return;

		this._files = [... this._files].filter(existingFile =>
			!(existingFile.name === file.name &&
				existingFile.size === file.size &&
				existingFile.type === file.type)
		);

		if (this._files.length) {
			this.build();
			this._cleanupFakeInputs();
		} else {
			this.clear(true);
		}
	}

	clear(all = false) {
		let $filesInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);

		if ($filesInfo) {
			if (this._params.image) {
				let $filesInfoImages = Selectors.find('.' + CLASS_NAME_IMAGES, $filesInfo);

				if ($filesInfoImages) {
					let $images = Selectors.findAll('span', $filesInfoImages);
					if ($images.length) {
						for (const $image of $images) {
							[... Selectors.findAll('img', $image)].forEach($img => {
								URL.revokeObjectURL($img.src);
							});

							$image.parentNode.removeChild($image);
						}
					}
				}
			}

			if (this._params.info) {
				let $filesInfoList = Selectors.find('.' + CLASS_NAME_LIST, $filesInfo);
				if ($filesInfoList) {
					let $li = Selectors.findAll('li', $filesInfoList);
					if ($li.length) {
						for (const $item of $li) {
							$item.parentNode.removeChild($item);
						}
					}
				}
			}
		}

		if (all) {
			Selectors.findAll('[type="file"]', this._element).forEach(input => {
				input.value = '';
			});

			let fakeInputs = Selectors.findAll('.' + CLASS_NAME_FAKE, this._element);
			if (fakeInputs.length) {
				for (const fakeInput of fakeInputs) {
					fakeInput.remove();
				}
			}

			if ($filesInfo) {
				$filesInfo.classList.remove('show');
			}

			this._files = [];
		}
	}

	dispose() {
		super.dispose();
		this.clear(true);

		// Удаляем drag & drop обработчики
		/*if (this._dragHandlers && this._params.dragDrop) {
			const dropZone = this._element;
			dropZone.removeEventListener('dragover', this._dragHandlers.handleDragOver);
			dropZone.removeEventListener('dragleave', this._dragHandlers.handleDragLeave);
			dropZone.removeEventListener('drop', this._dragHandlers.handleDrop);
			this._dragHandlers = null;
		}*/
	}

	setImages(files, clear = false) {
		if (this._params.image) {
			const $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
			if ($fileInfo) {
				let $selector = Selectors.find('.' + CLASS_NAME_IMAGES, this._element);
				if (!$selector) {
					$selector = document.createElement('div');
					$selector.classList.add(CLASS_NAME_IMAGES);
					$fileInfo.prepend($selector);
				}

				if (clear) {
					$selector.innerHTML = '';
				}

				for (const file of files) {
					if (this._checkType(file.type)) {
						let src = URL.createObjectURL(file);
						$selector.insertAdjacentHTML('beforeEnd', '<span><img src="'+ src +'" alt="#"></span>');
					}
				}
			}
		}
	}

	setInfoList(files, clear = false) {
		if (this._params.info) {
			const $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
			if ($fileInfo) {

				let $list = Selectors.find('.' + CLASS_NAME_LIST, this._element);
				if (!$list) {
					$list = this._tpl.ul([],{
						class: CLASS_NAME_LIST,
					});
					$fileInfo.append($list);

					if (clear) {
						$fileInfo.innerHTML = '';
					}
				}

				let i = 1;
				files.forEach(file => {let detach = '';
					if (this._params.detach) {
						detach = `<button type="button" data-dismiss="file" data-name="${file.name}" data-size="${file.size}" data-type="${file.type}">✕</button>`
					}

					$list.insertAdjacentHTML('beforeEnd', `<li>
						<span>${i}.</span>
						<span>${file.name}</span>
						<span>[${this._getSizes(file.size)}]</span>
						${detach}
					</li>`);
					i++;
				});
			}
		}
	}

	_filterFiles(files) {
		let filesFilteredCount = this._filterFilesCount(files);
		return this._filterFilesBySize(filesFilteredCount);
	}

	_filterFilesCount(files) {
		const { count } = this._params.limits;
		if (count === 0) return files;
		return files.slice(0, count);
	}

	_filterFilesBySize(files) {
		const { sizes } = this._params.limits;
		if (sizes === 0) return files;
		return files.filter(file => file.size <= sizes * 1024 * 1024);
	}

	_getSizes(size, array = false) {
		if (array && Array.isArray(size)) {
			const total = size.reduce((acc, file) => acc + file.size, 0);
			return this._getSizes(total);
		}

		const formatter = new Intl.NumberFormat(this._params.lang, {
			style: 'unit',
			unit: getUnit(size),
			unitDisplay: 'short',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});

		return formatter.format(size / Math.pow(1024, getUnitIndex(size)));

		function getUnit(bytes) {
			const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
			const index = Math.min(
				Math.floor(Math.log10(Math.abs(bytes || 1)) / Math.log10(1024)), units.length - 1
			);
			return units[index];
		}

		function getUnitIndex(bytes) {
			return Math.min(Math.floor(Math.log10(Math.abs(bytes || 1)) / Math.log10(1024)), 4);
		}
	}

	_checkType(type) {
		return this._params.types.includes(type);
	}

	_cleanupFakeInputs() {
		const fakeInputs = Selectors.findAll('.' + CLASS_NAME_FAKE, this._element);
		if (fakeInputs.length) {
			for (const input of fakeInputs) {
				if (!input.files || input.files.length === 0) {
					input.remove();
				}
			}
		}
	}

	_handleDroppedFiles(files) {
		// Создаём временный инпут для эмуляции события change
		const tempInput = document.createElement('input');
		tempInput.type = 'file';
		tempInput.files = files;

		// Эмулируем change событие
		this.change(tempInput);
	}

	_addEventListener() {
		const _this = this;

		[... Selectors.findAll(SELECTOR_DATA_TOGGLE, _this._element)].forEach(el => {
			el.addEventListener('change', function () {
				_this.change(this)
			})
		});

		let $dismiss = Selectors.find('[data-dismiss="vg-files"]', _this._element);
		if ($dismiss) {
			$dismiss.addEventListener('click', function (e) {
				e.preventDefault();
				_this.clear(true);
			});
		}
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_DOM_LOADED_DATA_API, function () {
	[... Selectors.findAll('.vg-files')].forEach(el => {
		VGFiles.getOrCreateInstance(el);
	})
})

EventHandler.on(document, EVENT_KEY_DISMISS_DATA_API, SELECTOR_DATA_DISMISS, function (event) {
	let target = event.target.closest('.' + CLASS_NAME_CONTAINER);
	if (!target) return;

	if (['A', 'AREA'].includes(this.tagName)) event.preventDefault();

	const instance = VGFiles.getOrCreateInstance(target);
	instance.removeFile(this);
});

export default VGFiles;
