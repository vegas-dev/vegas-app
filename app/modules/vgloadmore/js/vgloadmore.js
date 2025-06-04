import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {execute, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";

const NAME             = 'loadmore';
const NAME_KEY         = 'vg.loadmore';
const CLASS_NAME_SHOW  = 'show';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="loadmore"]';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

const EVENT_KEY_CLICK_DATA_API      = `click.${NAME_KEY}.data.api`;

class VGLoadMore extends BaseModule{
	constructor(element, params) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			limit: 0,
			offset: 0,
			output: true,
			autohide: true,
			button: {
				text: '',
				send: 'Загружаем...'
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: false,
				output: false,
			},
		}, params));

		this.fOffset = this._params.offset;

		if (!this._params.button.text) {
			this._params.button.text = this._element.innerHTML;
		}
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	toggle(callback) {
		this._params.ajax.data = {
			limit: this._params.limit,
			offset: this._params.offset
		}

		if (this._params.button.send) {
			this._element.innerHTML = this._params.button.send;
		}

		this._route((status, data, target) => {
			if ('loader' in this._params.ajax && this._params.ajax.loader) {
				let loader = Selectors.find('.vg-loader', target);
				if (loader) loader.remove();
			}

			if ('output' in this._params && this._params.output) {
				target.insertAdjacentHTML('beforeend', data.response);
			}

			this._params.offset = this.fOffset + this._params.offset;
			this._element.innerHTML = this._params.button.text;

			if ('autohide' in this._params && this._params.autohide) {
				if (!data.response) this._element.remove();
			}

			EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});
			execute(callback, [this, data, target, status]);
		});
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = this;

	if (['A', 'AREA'].includes(this.tagName)) event.preventDefault();

	const instance = VGLoadMore.getOrCreateInstance(target);
	instance.toggle();
});


export default VGLoadMore;