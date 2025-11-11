import BaseModule from "../../base-module";
import {isDisabled, isVisible, mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'files';
const NAME_KEY = 'vg.files';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="files"]';

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_INFO      = CLASS_NAME_CONTAINER + '-info';
const CLASS_NAME_IMAGES    = CLASS_NAME_CONTAINER + '-info--images';
const CLASS_NAME_LIST      = CLASS_NAME_CONTAINER + '-info--list';
const CLASS_NAME_FAKE      = CLASS_NAME_CONTAINER + '-info-fake';

const EVENT_KEY_CHANGE   = `${NAME_KEY}.change`;
const EVENT_KEY_LOADED   = `${NAME_KEY}.loaded`;

const EVENT_KEY_DOM_LOADED_DATA_API = `DOMContentLoaded.${NAME_KEY}.data.api`;

class VGFiles extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(this._element, mergeDeepObject({
			limits: {
				count: 0,
				sizes: 0
			},
			image: false,
			info: true,
			types: ['image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff", "image/webp"],
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: false,
				output: true,
			}
		}, params));
		this._files = [];
		this.id     = this._element.querySelector('[data-vg-toggle]').getAttribute('id') || undefined;
		this.name   = this._element.querySelector('[data-vg-toggle]').getAttribute('name') || undefined;
		this.accept = this._element.querySelector('[data-vg-toggle]').getAttribute('accept') || undefined;

		this._addEventListener();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	change(input) {
		let values = input.files,
			appended_files = [];

		this.clear();

		if (values.length) {
			if (this._params.limits.count !== 1) {
				input.removeAttribute('id');
				input.removeAttribute('data-vg-toggle');
				input.classList.add(CLASS_NAME_FAKE);
				input.onchange = null;

				let accept = this.accept ? 'accept="' + this.accept + '"' : '';

				this._element.insertAdjacentHTML('beforeEnd', '<input type="file" name="'+ this.name +'" id="'+ this.id +'" data-vg-toggle="files" ' + accept + ' multiple>');
				this._addEventListener();
			}

			appended_files = this.append(values);

			if (appended_files.length) {
				let $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
				$fileInfo.classList.add('show');

				let $count = $fileInfo.querySelector('.' + CLASS_NAME_INFO + '--wrapper-count');
				if ($count) $count.innerHTML = appended_files.length + '<span>[' + this._getSizes(appended_files, true) + ']</span>';

				this.setImages(appended_files);
				this.setInfoList(appended_files);
			}

			EventHandler.trigger(this._element, EVENT_KEY_CHANGE);

			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});
			});
		}
	}

	append(values) {
		this._files.push(values);
		return pushFiles(this._files, this._params.limits.count);

		function pushFiles (files, limit) {
			let arr = [];
			for (let i = 0; i <= files.length - 1; i++) {
				let count = 1;
				for (const file of files[i]) {
					if (limit === 0) {
						arr.push(file);
					} else {
						if (count <= limit) {
							arr.unshift(file);
						}
					}

					count++;
				}
			}

			if (limit > 0 && arr.length > limit) {
				arr.splice(limit, arr.length - limit);
			}

			return arr;
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
			this._element.querySelector('[type="file"]').value = '';

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
	}

	setImages(files) {
		if (this._params.image) {
			const $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
			if ($fileInfo) {
				let $selector = Selectors.find('.' + CLASS_NAME_IMAGES, this._element);
				if (!$selector) {
					$selector = document.createElement('div');
					$selector.classList.add(CLASS_NAME_IMAGES);
					$fileInfo.prepend($selector);
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

	setInfoList(files) {
		if (this._params.info) {
			const $fileInfo = Selectors.find('.' + CLASS_NAME_INFO, this._element);
			if ($fileInfo) {
				let $list = Selectors.find('.' + CLASS_NAME_LIST);
				if (!$list) {
					$list = document.createElement('ul');
					$list.classList.add(CLASS_NAME_LIST);
					$fileInfo.append($list);
				}

				let i = 1;
				for (const file of files) {
					let size = this._getSizes(file.size);
					$list.insertAdjacentHTML('beforeEnd', '<li><span>'+ (i) + '.</span><span>' + file.name + '</span><span>['+ size +']</span></li>');
					i++;
				}
			}
		}
	}

	_getSizes(size, array = false) {
		let size_kb = size / 1024,
			size_mb = size_kb / 1024,
			size_gb = size_mb / 1024,
			size_tb = size_gb / 1024;

		let output = 0;

		if (size_kb <= 1024) {
			output = size_kb.toFixed(3) + ' Kb';
		} else if (size_kb >= 1024 && size_mb <= 1024) {
			output = size_mb.toFixed(3) + ' Mb';
		} else if (size_mb >= 1024 && size_gb <= 1024) {
			output = size_gb.toFixed(3) + ' Gb';
		} else {
			output = size_tb.toFixed(3) + ' Tb';
		}

		if (array) {
			let arrSizes = [];
			size.map(function (el) {
				arrSizes.push(el.size);
			})

			output = arrSizes.reduce( function (a, b) {
				return a + b
			});

			output = this._getSizes(output);
		}

		return output;
	}

	_checkType(type) {
		return this._params.types.includes(type);
	}

	_addEventListener() {
		const _this = this;

		[... Selectors.findAll(SELECTOR_DATA_TOGGLE, _this._element)].forEach(el => {
			el.addEventListener('change', function () {
				_this.change(this)
			})
		});

		let $dismiss = Selectors.find('[data-dismiss="vg-files"]', _this._element);
		$dismiss.onclick = function () {
			_this.clear(true);

			return false;
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

export default VGFiles;
