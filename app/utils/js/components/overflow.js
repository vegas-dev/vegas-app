import {Manipulator} from "../dom/manipulator";

/**
 * Класс Overflow
 * Запрещает скроллинг и убирает его, компенсируя отступом
 */

class Overflow {
	static append() {
		document.body.style.paddingRight = getWidth() + 'px';
		document.body.style.overflow = 'hidden';

		function getWidth() {
			const documentWidth = document.documentElement.clientWidth
			return Math.abs(window.innerWidth - documentWidth)
		}
	}

	static destroy() {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';

		let styles = Manipulator.get(document.body, 'style');
		if (!styles) Manipulator.remove(document.body, 'style');
	}
}

export default Overflow;