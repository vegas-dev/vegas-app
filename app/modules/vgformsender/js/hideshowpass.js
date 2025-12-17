import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {isDisabled, mergeDeepObject} from "../../../utils/js/functions";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import Html from "../../../utils/js/components/templater";

/**
 * Constants
 */
const NAME = 'hideshowpass';
const NAME_KEY = 'vg.hideshowpass';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="pass"]';

const CLASS_NAME_SHOW = 'show';

const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGHideShowPass extends BaseModule{
	constructor(el, params = {}) {
		super(el, params);

		this._params = this._getParams(el, mergeDeepObject({}, params));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide(relatedTarget);
	}

	show(relatedTarget) {
		if (relatedTarget) this._params = this._getParams(relatedTarget, this._params);

		this._element.classList.add(CLASS_NAME_SHOW);
		relatedTarget.remove();
		this.build(true);
		Manipulator.set(this._element, 'type', 'text');
	}

	hide(relatedTarget) {
		this._element.classList.remove(CLASS_NAME_SHOW);
		relatedTarget.remove();
		this.build(false);
		Manipulator.set(this._element, 'type', 'password');
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	static init(el, params) {
		let instance = VGHideShowPass.getOrCreateInstance(el, params);
		instance.build(false);
	}

	build(isShow = false) {
		let classes = this._params.classes.join(' '), elm = '';
		const HTML = Html('string');

		if (!isShow) {
			elm = HTML.component('eye', {class: classes});
		} else {
			elm = HTML.component('eye', {class: classes, type: 'hide'});
		}

		this._element.insertAdjacentHTML(this._params.insert, elm);
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.prev(this, 'input');
	if (!target) return;

	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) {
		return
	}

	this.setAttribute('aria-expanded', true);

	const instance = VGHideShowPass.getOrCreateInstance(target.shift())
	instance.toggle(this);
});

export default VGHideShowPass