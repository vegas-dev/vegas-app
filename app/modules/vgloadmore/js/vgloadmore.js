import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {execute, isObject, mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import {Manipulator} from "../../../utils/js/dom/manipulator";

const NAME             = 'loadmore';
const NAME_KEY         = 'vg.loadmore';

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="loadmore"]';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;

const CLASS_NAME_HIDE = 'vg-collapse';
const CLASS_NAME_SHOW = 'show';

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
				send: 'Загружаем...',
				classes: []
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

	static init(el, callback) {
		let id           = el.id,
			items        = normalizeData(el.dataset.elements),
			limit        = normalizeData(el.dataset.limit),
			offset       = normalizeData(el.dataset.offset),
			output       = el.dataset.output || 'true',
			autohide     = el.dataset.autohide || 'true',
			params       = el.dataset.params,
			buttonParams = normalizeData(el.dataset.button);

		if (!isObject(buttonParams)) {
			console.error('Дата атрибут data-button должен быть в формате json и передавать объект');
			return;
		}

		if (limit < offset) {
			console.error('Параметр offset должен быть меньше или равен параметру limit');
			return;
		}

		if (!id && !items && !limit && !offset) return;

		let itemsElements = [... Selectors.findAll('.' + items, el)];

		if (itemsElements.length <= limit) return;

		itemsElements.forEach((item, i) => {
			item.classList.add(CLASS_NAME_HIDE)
			if ((i + 1) <= limit) item.classList.add(CLASS_NAME_SHOW)
		});

		let button = document.createElement('button');

		buttonParams.text = normalizeData(el.dataset.buttonText) || 'Показать еще';

		Manipulator.set(button, 'data-limit', limit);
		Manipulator.set(button, 'data-offset', offset);
		Manipulator.set(button, 'data-output', output);
		Manipulator.set(button, 'data-autohide', autohide);
		Manipulator.set(button, 'data-elements', items);
		Manipulator.set(button, 'data-vg-toggle', 'loadmore');
		Manipulator.set(button, 'data-target', '#' + id);

		if (params) Manipulator.set(button, 'data-autohide', params);

		button.innerHTML = buttonParams.text

		if ('classes' in buttonParams && buttonParams.classes.length) {
			buttonParams.classes.forEach(cl => button.classList.add(cl));
		}

		el.parentNode.insertBefore(button, el.nextSibling);

		execute(callback, [el, button]);
	}

	toggle(callback) {
		if (this._params.ajax.route) {
			this.ajax(callback);
		} else {
			this.static(callback);
		}
	}

	ajax(callback) {
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

			this._params.offset = this.counter();
			this._element.innerHTML = this._params.button.text;

			if ('autohide' in this._params && this._params.autohide) {
				if (!data.response) this._element.remove();
			}

			EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});
			execute(callback, [this, data, target, status]);
		});
	}

	static(callback) {
		if (!'elements' in this._params && !'target' in this._params) return;

		let container = Selectors.find(this._params.target),
			items = Selectors.findAll('.' + this._params.elements, container);

		if (items) {
			items.slice(this._params.offset, this._params.offset + this._params.limit).forEach(item => item.classList.add(CLASS_NAME_SHOW));
			this._params.offset = this.counter();
		}

		let itemsHidden = Selectors.findAll('.' + this._params.elements + ':not(.show)', container);

		if (this.remainder(itemsHidden.length)) {
			if ('autohide' in this._params && this._params.autohide) {
				this._element.remove();
			}
		}

		execute(callback, [this, this._element]);
	}

	counter() {
		return this.fOffset + this._params.offset;
	}

	remainder(count) {
		return count === 0
	}
}

EventHandler.on(document, 'DOMContentLoaded', function () {
	[... document.querySelectorAll('[data-vgloadmore]')].forEach(el => {
		VGLoadMore.init(el);
	})
});

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