import {isElement, mergeDeepObject} from "../functions";

/**
 * Классы для анимаций смотрим здесь
 * https://animate.style/
 */
class Animation {
	constructor(element, key, params = {}) {
		this._params = mergeDeepObject({
			enable: false,
			in: 'animate__backInUp',
			out: 'animate__backOutUp',
			delay: 800,
		}, params);

		this.classes = {
			animated: 'animate__animated'
		}

		if (!this._params.enable) return;

		this._element = element;
		this._name_key = key;

		this.init();
	}

	init() {
		if (!isElement(this._element)) return;

		if (!this._element.classList.contains(this.classes.animated)) {
			this._element.classList.add(this.classes.animated);

			this.toggle();
		}
	}

	toggle() {
		if (this._element.classList.contains(this._params.in)) {
			this.out();
		} else {
			this.in();
		}
	}

	in() {
		this._element.classList.remove(this._params.out);
		this._element.classList.add(this._params.in);
	}

	out() {
		console.log('as');
		this._element.addEventListener(`${this._name_key}.hide`, event => {
			event.preventDefault();

			console.log('tada');
		})
	}

	reset() {
		//this._element.classList.remove(this._params.out);
	}
}

export default Animation;