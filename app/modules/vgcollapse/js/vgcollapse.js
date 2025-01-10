import BaseModule from "../../base-module";
import {isDisabled, isVisible, mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import Selectors from "../../../utils/js/dom/selectors";
import Backdrop from "../../../utils/js/components/backdrop";
import Overflow from "../../../utils/js/components/overflow";

/**
 * Constants
 */
const NAME = 'collapse';
const NAME_KEY = 'vg.collapse';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="collapse"]'

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGCollapse extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			parent: null,
			ajax: {
				route: '',
				target: '',
				method: 'get'
			}
		}, params));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		const _this = this;
		if (isDisabled(_this._element)) return;


	}

	hide() {
		const _this = this;
		if (isDisabled(_this._element)) return;


	}

	dispose() {
		super.dispose();
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (event.target.tagName === 'A' || (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
		event.preventDefault()
	}

	let target = Selectors.getSelectorFromElement(this);
	if (!target) return;

	VGCollapse.getOrCreateInstance(target, { toggle: false }).toggle()
})

export default VGCollapse;
