import { execute } from "../functions";
import EventHandler from "../dom/event";
import Html from "../components/templater";
import { Classes } from "../dom/manipulator";
import ScrollBarHelper from "./scrollbar";

const NAME = 'backdrop';
const CLASS_NAME = 'vg-backdrop';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const EVENT_MOUSEDOWN = `mousedown.vg.${NAME}`;

const backdropDelay = 150;

class Backdrop {
	static get _rootEl() {
		return document.body;
	}

	static _scrollbar = new ScrollBarHelper();
	static _backdrop = null;

	/**
	 * Показывает бэкдроп
	 * @param {Function} callback - вызывается после отображения
	 */
	static show(callback) {
		if (!this._backdrop) {
			this._append();
		}

		execute(callback);
	}

	/**
	 * Скрывает бэкдроп
	 * @param {Function} callback - вызывается после скрытия
	 */
	static hide(callback) {
		if (!this._backdrop) return;

		this._destroy().then(execute.bind(null, callback));
	}

	/**
	 * Создаёт и добавляет элемент бэкдропа
	 * @private
	 */
	static _append() {
		const html = Html('dom');
		this._backdrop = html.div({ class: CLASS_NAME });

		this._rootEl.appendChild(this._backdrop);
		requestAnimationFrame(() => {
			Classes.add(this._backdrop, CLASS_NAME_SHOW);
			setTimeout(() => {
				Classes.add(this._backdrop, CLASS_NAME_FADE);
			}, backdropDelay);
		});

		EventHandler.on(this._backdrop, EVENT_MOUSEDOWN, () => {
			this.hide();
		});
	}

	/**
	 * Удаляет бэкдроп с анимацией
	 * @returns {Promise}
	 * @private
	 */
	static _destroy() {
		return new Promise((resolve) => {
			Classes.remove(this._backdrop, CLASS_NAME_FADE);
			setTimeout(() => {
				Classes.remove(this._backdrop, CLASS_NAME_SHOW);
				this._backdrop.remove();
				this._backdrop = null;
				this._scrollbar.reset();
				resolve();
			}, backdropDelay);
		});
	}
}

export default Backdrop;