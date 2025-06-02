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
			elements: {
				button: ''
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

	static run(... args) {

	}

	toggle(event) {

	}

	promise(event) {

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
			if ($body) {
				let html = '<div class="message">' + this._params.message + '</div>';

				html += '<div class="buttons">';
				if (this._params.elements.button) {
					html += '<a href="#" data-vg-dismiss="modal" class="btn btn-primary">'+ this._params.elements.button +'</a>';
				}
				html += '</div>';

				$body.innerHTML = html;
			}
		});
	}

	_buildToast() {

	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {

});

/*window.alert = (message) => {
	VGAlert.run(message);
}*/

export default VGAlert;