import {isElement, mergeDeepObject} from "../functions";
import EventHandler from "../dom/event";

/**
 * Классы для анимаций смотрим здесь
 * https://animate.style/
 *
 * Работает с модулями у которых есть события show, hide, hidden
 */
class Animation {
	constructor(element, key, params = {}) {
		this._params = mergeDeepObject({
			enable: false,
			in: 'animate__backInUp',
			out: 'animate__backOutUp',
			delay: 0,
		}, params);

		this.classes = {
			animated: 'animate__animated'
		}

		if (!this._params.enable) return;
		if (!isElement(element)) return;

		this._element = element;
		this._name_key = key;

		if (!this._element.classList.contains(this.classes.animated)) {
			this._element.classList.add(this.classes.animated);
		}

		this._triggers();
	}

	_triggers() {
		EventHandler.one(this._element, this._name_key + '.show', () => {
			this._element.classList.remove(this._params.out);
			this._element.classList.add(this._params.in);
		});

		EventHandler.one(this._element, this._name_key + '.hide', () => {
			this._element.classList.remove(this._params.in);
			this._element.classList.add(this._params.out);
		});

		EventHandler.one(this._element, this._name_key + '.hidden', () => {
			this._element.classList.remove(this._params.out);
		});
	}
}

export default Animation;