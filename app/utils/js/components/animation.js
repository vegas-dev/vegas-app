import {mergeDeepObject} from "../functions";

/**
 * Классы для анимаций смотрим здесь
 * https://animate.style/
 */
class Animation {
	constructor(element, params = {}) {
		this._params = mergeDeepObject({
			in: 'animate__backInUp',
			out: 'animate__backOutUp',
			delay: 800,
		}, params);

		this.classes = {
			animated: 'animate__animated'
		}
		this._element = element;

		if (!this._element.classList.contains(this.classes.animated)) {
			this._element.classList.add(this.classes.animated);
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
		this._element.classList.remove(this._params.in);
		this._element.classList.add(this._params.out);
	}

	reset() {
		this._element.classList.remove(this._params.out);
	}
}

export default Animation;