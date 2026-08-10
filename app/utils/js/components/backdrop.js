import { execute } from "../functions";
import Html from "../components/templater";
import { Classes } from "../dom/manipulator";
import ScrollBarHelper from "./scrollbar";

const NAME = 'backdrop';
const CLASS_NAME = 'vg-backdrop';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';

const backdropDelay = 150;

class Backdrop {
	static get _rootEl() {
		return document.body;
	}

	static _scrollbar = new ScrollBarHelper();
	static _backdrop = null;
	static _backdrops = [];

	static getElement() {
		this._syncBackdrops();
		return this._backdrop;
	}

	static isActive() {
		this._syncBackdrops();
		return this._backdrops.length > 0;
	}

	/**
	 * Показывает новый backdrop и кладёт его поверх предыдущих.
	 * @param {Function} callback - Вызывается после добавления backdrop в DOM.
	 */
	static show(callback) {
		const backdrop = this._append();
		execute(callback, [backdrop]);
	}

	/**
	 * Скрывает только верхний backdrop.
	 * @param {Function} callback - Вызывается после скрытия.
	 */
	static hide(callback, backdrop = null) {
		this._syncBackdrops();

		const targetBackdrop = backdrop && backdrop.isConnected ? backdrop : this._backdrop;

		if (!targetBackdrop) {
			execute(callback);
			return;
		}

		this._destroy(targetBackdrop).then(execute.bind(null, callback));
	}

	/**
	 * Создаёт и добавляет backdrop.
	 * @returns {HTMLElement}
	 * @private
	 */
	static _append() {
		const html = Html('dom');
		const backdrop = html.div({ class: CLASS_NAME });

		this._rootEl.appendChild(backdrop);
		this._backdrops.push(backdrop);
		this._backdrop = backdrop;

		requestAnimationFrame(() => {
			Classes.add(backdrop, CLASS_NAME_SHOW);
			setTimeout(() => {
				if (backdrop.isConnected) {
					Classes.add(backdrop, CLASS_NAME_FADE);
				}
			}, backdropDelay);
		});

		return backdrop;
	}

	/**
	 * Удаляет backdrop с анимацией.
	 * @param {HTMLElement} backdrop
	 * @returns {Promise}
	 * @private
	 */
	static _destroy(backdrop) {
		return new Promise((resolve) => {
			Classes.remove(backdrop, CLASS_NAME_FADE);
			setTimeout(() => {
				Classes.remove(backdrop, CLASS_NAME_SHOW);
				backdrop.remove();
				this._backdrops = this._backdrops.filter(item => item !== backdrop && item.isConnected);
				this._backdrop = this._backdrops.length ? this._backdrops[this._backdrops.length - 1] : null;

				if (!this._backdrop) {
					this._scrollbar.reset();
				}

				resolve();
			}, backdropDelay);
		});
	}

	static _syncBackdrops() {
		this._backdrops = this._backdrops.filter(item => item && item.isConnected);
		if (!this._backdrops.length) {
			this._backdrops = Array.from(this._rootEl.querySelectorAll(`.${CLASS_NAME}`));
		}
		this._backdrop = this._backdrops.length ? this._backdrops[this._backdrops.length - 1] : null;
	}
}

export default Backdrop;
