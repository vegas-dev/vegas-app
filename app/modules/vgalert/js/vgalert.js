import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGModal from "../../vgmodal/js/vgmodal";

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

let IS_PROMISE = false;

class VGAlert extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			modal: {
				centered: false,
				backdrop: true,
				overflow: true,
				keyboard: true,
				animation: {
					enable: false,
					in: 'animate__rollIn',
					out: 'animate__rollOut',
					delay: 0,
				},
			},
			toast: {

			},
			dialog: 'modal',
			mode: 'alert',
		}, params));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	static run(message, params) {
		//const instance = VGAlert.getOrCreateInstance()
	}

	toggle(event) {
		const promise = this.promise(event);
		promise.then(resolve => {
			IS_PROMISE = true
			this._element.click();
		}).catch(reject => {
			IS_PROMISE = false;
		});
	}

	promise() {
		let dialog = this._build();
		dialog.toggle();

		return new Promise((resolve) => {
			if (this._params.mode === 'alert') {
				dialog._element.addEventListener('vg.'+ this._params.dialog +'.hidden', resolve);
			}
		});
	}

	_build() {
		if (this._params.dialog === 'modal') {
			return this._buildModal();
		}
		if (this._params.dialog === 'toast') {
			return this._buildToast();
		}
	}

	_buildModal() {
		let id = 'vg-alert-' + makeRandomString(),
			$modal = Selectors.find('.vg-alert-modal');

		if ($modal) $modal.remove();

		return VGModal.build(id, this._params.modal, (self) => {
			let element = self._element;
			element.classList.add('vg-alert-modal');

			let $body = Selectors.find('.vg-modal-body', element);
			if ($body) $body.innerHTML = this._params.message;
		});
	}

	_buildToast() {

	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (!IS_PROMISE) {
		let target = this;
		event.preventDefault();

		if (isDisabled(target)) return;

		const data = VGAlert.getOrCreateInstance(target)
		data.toggle(event);
	}
});

export default VGAlert;