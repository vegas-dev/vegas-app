import {execute} from "../functions";
import Selectors from "../dom/selectors";
import EventHandler from "../dom/event";
import Overflow from "./overflow";
import Html from "../components/templater";
import {Classes} from "../dom/manipulator";

const NAME = 'backdrop';
const CLASS_NAME = 'vg-backdrop';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const EVENT_MOUSEDOWN = `mousedown.vg.${NAME}`;

let backdrop_delay = 300;

class Backdrop {
	static _rootEl = document.body;

	static show(callback) {
		Backdrop._append()
		execute(callback);
	}

	static hide(callback) {
		Backdrop._destroy();
		execute(callback);
	}

	static _append() {
		if (Selectors.find('.' + CLASS_NAME)) return false;

		let html = Html('dom'),
			backdrop = html.div({class: CLASS_NAME}, '');

		Backdrop._rootEl.append(backdrop);
		Classes.add(backdrop, CLASS_NAME_SHOW);

		setTimeout(() => {
			Classes.add(backdrop, CLASS_NAME_FADE);
		}, backdrop_delay);

		EventHandler.on(backdrop, EVENT_MOUSEDOWN, () => {
			Backdrop.hide()
			Overflow.destroy();
		});
	}

	static _destroy() {
		let element = Selectors.find('.' + CLASS_NAME);
		if (!element) return;

		Classes.remove(element, CLASS_NAME_FADE);

		setTimeout(() => {
			Classes.remove(element, CLASS_NAME_SHOW);
			element.remove();
		}, backdrop_delay);
	}
}

export default Backdrop;