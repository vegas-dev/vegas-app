import {execute} from "./functions";
import Selectors from "./selectors";
import EventHandler from "./event";
import Overflow from "./overflow";

const NAME = 'backdrop'
const CLASS_NAME = 'vg-backdrop'
const CLASS_NAME_FADE = 'fade'
const EVENT_MOUSEDOWN = `mousedown.vg.${NAME}`

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
		if (Selectors.findOne('.' + CLASS_NAME)) {
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
		let element = Selectors.findOne('.' + CLASS_NAME);
		if (!element) return;

		element.classList.remove(CLASS_NAME_FADE);

		setTimeout(() => {
			element.remove();
		}, 500);
	}
}

export default Backdrop;