import {execute} from "../functions";
import Selectors from "../dom/selectors";
import EventHandler from "../dom/event";
import Overflow from "./overflow";

const NAME = 'backdrop';
const CLASS_NAME = 'vg-backdrop';
const CLASS_NAME_FADE = 'fade';
const EVENT_MOUSEDOWN = `mousedown.vg.${NAME}`;

let backdrop_delay = 500;

class Backdrop {
	static show(callback) {
		Backdrop._append()
		execute(callback);
	}

	static hide(callback) {
		Backdrop._destroy();
		execute(callback);
	}

	static _append() {
		if (Selectors.find('.' + CLASS_NAME)) {
			return false;
		}

		let backdrop = document.createElement('div');
		backdrop.classList.add(CLASS_NAME);

		document.body.append(backdrop);

		setTimeout(() => {
			backdrop.classList.add(CLASS_NAME_FADE)
		}, 50);

		EventHandler.on(backdrop, EVENT_MOUSEDOWN, () => {
			Backdrop.hide()
			Overflow.destroy();
		});
	}

	static _destroy() {
		let element = Selectors.find('.' + CLASS_NAME);
		if (!element) return;

		element.classList.remove(CLASS_NAME_FADE);

		setTimeout(() => {
			element.remove();
		}, backdrop_delay);
	}
}

export default Backdrop;