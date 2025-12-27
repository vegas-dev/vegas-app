import { isElement } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { Classes } from "../../../utils/js/dom/manipulator";

const CLASS_NAME_CONTAINER = 'vg-files';
const CLASS_NAME_DROP = `${CLASS_NAME_CONTAINER}-drop`;

const CLASS_NAME_DROP_ACTIVE = 'drop-active';
const CLASS_NAME_DROP_HOVER = 'drop-hover';

class DnD {
	/**
	 * @param {HTMLElement} element
	 * @param {Object} params
	 */
	constructor(element, params = {}) {
		this._element = element;
		this._params = params;

		this._files = null;
		this._input = null;
		this._init();
	}

	_init() {
		this._findInput();
		this._setupEvents();

	}

	/**
	 * Поиск связанного input[type="file"] внутри или рядом с drop-зоной
	 */
	_findInput() {
		const { id, name } = this._element.dataset;
		if (id) this._input = document.getElementById(id);
		if (!this._input && name) {
			this._input = Selectors.find(`[name="${name}"]`);
		}
		if (!this._input) {
			this._input = Selectors.find('input[type="file"]', this._element) || Selectors.find('input[type="file"]', this._element.parentNode);
		}
	}

	/**
	 * Настройка событий перетаскивания
	 */
	_setupEvents() {
		if (!isElement(this._element)) return;

		EventHandler.on(this._element, 'dragover', (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (!Classes.has(this._element, CLASS_NAME_DROP_ACTIVE)) {
				Classes.add(this._element, CLASS_NAME_DROP_HOVER);
			}
		});

		EventHandler.on(this._element, 'dragenter', (e) => {
			e.preventDefault();
			Classes.add(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);
		});

		EventHandler.on(this._element, 'dragleave', (e) => {
			e.preventDefault();
			if (e.target === this._element || e.target.closest('.' + CLASS_NAME_DROP) === this._element) {
				Classes.remove(this._element, CLASS_NAME_DROP_HOVER);
				setTimeout(() => {
					if (!this._element.matches(':hover')) {
						Classes.remove(this._element, CLASS_NAME_DROP_ACTIVE);
					}
				}, 50);
			}
		});

		EventHandler.on(this._element, 'drop', (e) => {
			e.preventDefault();
			Classes.remove(this._element, [CLASS_NAME_DROP_ACTIVE, CLASS_NAME_DROP_HOVER]);

			const files = e.dataTransfer?.files;
			if (!files || !files.length) return;

			this._files = files;

			if (isElement(this._input)) {
				this._input.files = files;
				EventHandler.trigger(this._input, 'change');
			}
		});
	}

	/**
	 * Получить выбранные файлы
	 * @returns {FileList|null}
	 */
	getFiles() {
		return this._files;
	}

	/**
	 * Уничтожение событий
	 */
	dispose() {
		EventHandler.off(this._element, 'dragover');
		EventHandler.off(this._element, 'dragenter');
		EventHandler.off(this._element, 'dragleave');
		EventHandler.off(this._element, 'drop');
		this._input = null;
		this._files = null;
	}

	init() {
		return this;
	}
}

export default DnD;