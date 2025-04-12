import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {execute, mergeDeepObject} from "../../../utils/js/functions";

/**
 * Constants
 */
const NAME = 'alert';
const NAME_KEY = 'vg.alert';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="alert"]';

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_OPEN = 'vg-alert-open';

const EVENT_KEY_HIDE    = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN  = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW    = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN   = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED  = `${NAME_KEY}.loaded`;
const EVENT_KEY_CONFIRM = `${NAME_KEY}.confirm`;
const EVENT_KEY_CANCEL  = `${NAME_KEY}.cancel`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGAlert extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			backdrop: true,
			overflow: true,
			keyboard: true,
			confirm: true,
			showInside: true,
			theme: 'default',
			elements: [
				{
					'title': 'Вы уверены?',
					'element': 'button',
					'type': 'confirm',
					'classes': ['btn', 'btn-primary']
				}
			],
			animation: {
				enable: false,
				in: 'animate__rollIn',
				out: 'animate__rollOut',
				delay: 800,
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
			}
		}, params));

		this._addEventListeners();
		this._dismissElement();

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGAlert.NAME_KEY, this._params.animation);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	static run(text, params = {}, callback) {
		return VGAlert.build(text, params, callback);
	}

	static build(text, params, callback) {
		params = mergeDeepObject({
			theme: 'default',
		}, params);

		let target;

		let instance =  VGAlert.getOrCreateInstance(target, params);
		execute(callback, [instance]);
		instance.show();
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {

	}

	hide() {

	}

	dispose() {
		super.dispose();
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== 'Escape') return;

			if (this._params.keyboard) {
				this.hide();
				return;
			}

			EventHandler.trigger(this._element, EVENT_KEY_HIDE_PREVENTED)
		});
	}
}

dismissTrigger(VGAlert);

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {

});

export default VGAlert;
