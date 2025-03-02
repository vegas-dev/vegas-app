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
			duration: 1000,
			delay: 1000,
			repeat: 1
		}, params);

		this._element = element;

		if (!this._element.classList.contains('animate__animated')) {
			this._element.classList.add('animate__animated');
		}
	}

	toggle() {
		if (this._element.classList.contains(this._params.in)) {
			this.out();
		} else {
			this.in();
		}
	}

	in(callback) {
		this._element.classList.remove(this._params.out);
		this._element.classList.add(this._params.in);
	}

	out(callback) {
		this._element.classList.remove(this._params.in);
		this._element.classList.add(this._params.out);
	}
}

export default Animation;