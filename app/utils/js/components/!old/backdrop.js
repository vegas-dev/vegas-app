import {execute} from "../functions";
import Selectors from "../dom/selectors";
import EventHandler from "../dom/event";
import Html from "../components/templater";
import {Classes} from "../dom/manipulator";
import ScrollBarHelper from "./scrollbar";

const NAME = 'backdrop';
const CLASS_NAME = 'vg-backdrop';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const EVENT_MOUSEDOWN = `mousedown.vg.${NAME}`;

let backdrop_delay = 300;

class Backdrop {
	static _rootEl = document.body;
	static _scrollbar = new ScrollBarHelper();

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
			Backdrop._scrollbar.reset();
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