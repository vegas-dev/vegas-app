import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import { execute, isObject, mergeDeepObject, normalizeData } from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import { Manipulator } from "../../../utils/js/dom/manipulator";
import {lang_buttons} from "../../../utils/js/components/lang";

const NAME = 'loadmore';
const NAME_KEY = 'vg.loadmore';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="loadmore"]';
const SELECTOR_DATA_MODULE = '[data-vgloadmore]';

const EVENT_KEY_LOADED = `${NAME_KEY}.loaded`;
const EVENT_KEY_BEFORE_LOAD = `${NAME_KEY}.before.load`;
const CLASS_NAME_HIDE = 'vg-collapse';
const CLASS_NAME_SHOW = 'show';
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGLoadMore extends BaseModule {
	constructor(element, params) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			lang: document.documentElement.lang || 'ru',
			limit: 0,
			offset: 0,
			output: true,
			autohide: true,
			animate: false,
			append: 'after',
			mode: 'button',
			threshold: 100,
			debug: false,
			detach: false,
			button: {
				text: '',
				send: 'Загружаю...',
				show: 'Показываю...',
				loader: false,
				classes: []
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: false,
				output: false,
				data: {}
			}
		}, params));

		this._observer = null;
		this._isScrollMode = this._params.mode === 'scroll';
		this._isToggleElement = element.hasAttribute('data-vg-toggle');

		this._params.button.send = lang_buttons(this._params.lang, NAME)['send'];
		this._params.button.show = lang_buttons(this._params.lang, NAME)['show'];

		if (!this._params.button.text) {
			this._params.button.text = this._isToggleElement
				? this._element.innerHTML.trim() || lang_buttons(this._params.lang, NAME)['text-ajax']
				: this._params.ajax.route ? lang_buttons(this._params.lang, NAME)['text-ajax'] : lang_buttons(this._params.lang, NAME)['text-more'];
		}

		if (this._isToggleElement) {
			this._initializeAsButton();
		} else {
			this._initializeContainer();
		}
	}

	static get NAME() { return NAME; }
	static get NAME_KEY() { return NAME_KEY; }

	_initializeAsButton() {
		if (this._isScrollMode) {
			this._initScrollMode();
		}
	}

	_initializeContainer() {
		const { elements: itemClass, limit } = this._params;
		const container = this._element;
		const items = Selectors.findAll(`.${itemClass}`, container);

		if (!this._params.ajax.route && (items.length <= limit || this._params.offset >= items.length)) {
			return;
		}

		items.forEach((item, i) => {
			item.classList.toggle(CLASS_NAME_SHOW, i < limit);
			item.classList.toggle(CLASS_NAME_HIDE, i >= limit);
		});

		if (this._params.mode === 'button') {
			this._createAndInsertButton(container);
		} else if (this._isScrollMode) {
			this._initScrollMode();
		}

		if (this._params.offset === 0) {
			this._params.offset = limit;
		}
	}

	_createAndInsertButton(container) {
		const button = document.createElement('button');
		const buttonText = normalizeData(container.dataset.buttonText) || this._params.button.text;

		const buttonData = {
			limit: this._params.limit,
			offset: this._params.offset,
			output: this._params.output,
			autohide: this._params.autohide,
			animate: this._params.animate,
			append: this._params.append,
			mode: this._params.mode,
			threshold: this._params.threshold,
			debug: this._params.debug,
			detach: this._params.detach,
			elements: this._params.elements,
			'vg-toggle': 'loadmore',
			target: `#${container.id}`
		};

		Object.assign(buttonData, normalizeData(container.dataset.params));

		Object.keys(buttonData).forEach(key => {
			Manipulator.set(button, `data-${key}`, buttonData[key]);
		});

		button.textContent = buttonText;
		button.classList.add(...this._params.button.classes);

		container.parentNode.insertBefore(button, container.nextSibling);
	}

	_initScrollMode() {
		this._setupIntersectionObserver();
		this._observeLastVisibleItem();
	}

	_setupIntersectionObserver() {
		if (this._observer) return;

		this._observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this._params.debug && console.log('[VGLoadMore] Пересечение — вызов toggle');
					this.toggle();
				}
			});
		}, {
			root: null,
			rootMargin: `0px 0px ${this._params.threshold}px 0px`,
			threshold: 0.1
		});
	}

	_observeLastVisibleItem() {
		if (!this._observer) return;

		this._observer.disconnect();

		const container = Selectors.find(this._params.target) || this._element.parentNode;
		const items = Selectors.findAll(`.${this._params.elements}`, container);
		const visibleItems = items.filter(item => item.classList.contains(CLASS_NAME_SHOW));
		const lastVisible = visibleItems[visibleItems.length - 1];

		if (lastVisible instanceof Element) {
			this._observer.observe(lastVisible);
		}
	}

	toggle(callback) {
		this._params.debug && console.log('[VGLoadMore] toggle()');

		if (EventHandler.trigger(this._element, EVENT_KEY_BEFORE_LOAD).defaultPrevented) return;

		const isButton = this._isToggleElement || (['BUTTON', 'A'].includes(this._element.tagName) && !this._isScrollMode);
		if (isButton) {
			this._element.disabled = true;
			this._element.innerHTML = this._params.ajax.route ? this._params.button.send : this._params.button.show;
		}

		this._params.ajax.route ? this.ajax(callback) : this.staticLoad(callback);
	}

	ajax(callback) {
		const targetSelector = this._params.ajax.target?.trim();
		let targetEl = null;

		if (targetSelector) {
			targetEl = Selectors.find(targetSelector);
		} else {
			targetEl = this._element
		}

		const originalText = this._params.button.text;

		if (!targetEl) {
			console.error('[VGLoadMore] target элемент не найден:', this._params.ajax.target);
			return;
		}

		this._params.ajax.data = { limit: this._params.limit, offset: this._params.offset };

		this._route((status, data, responseTarget) => {
			if (status === 'error' || typeof data?.response !== 'string') return;

			if (this._params.output) {
				targetEl.insertAdjacentHTML(
					this._params.append === 'after' ? 'beforeend' : 'afterbegin',
					data.response
				);
			}

			this._params.offset += this._params.limit;
			this._restoreElementState(originalText);
			this._observeLastVisibleItem();

			const noMoreData = !data.response.trim();
			if (this._params.autohide && this._params.detach && noMoreData) {
				this._autohideTrigger();
			}

			EventHandler.trigger(this._element, EVENT_KEY_LOADED, { stats: status, data });
			execute(callback, [this, data, responseTarget, status]);
		}, (error) => {
			this._restoreElementState(originalText);
			console.error('[VGLoadMore] AJAX ошибка', error);
		});
	}

	staticLoad(callback) {
		const container = Selectors.find(this._params.target) || this._element.parentNode;
		const items = Selectors.findAll(`.${this._params.elements}`, container);
		const start = this._params.offset;
		const end = start + this._params.limit;
		const newItems = items.slice(start, end);

		if (newItems.length === 0) return;

		if (this._isToggleElement || (['BUTTON', 'A'].includes(this._element.tagName) && !this._isScrollMode)) {
			this._element.disabled = true;
			this._element.innerHTML = this._params.button.show;
		}

		newItems.forEach(item => {
			item.classList.replace(CLASS_NAME_HIDE, CLASS_NAME_SHOW);
			if (this._params.animate) {
				item.style.opacity = 0;
				requestAnimationFrame(() => {
					item.style.transition = 'opacity 0.3s ease';
					item.style.opacity = 1;
				});
			}
		});

		this._params.offset = end;
		this._observeLastVisibleItem();

		const remaining = items.slice(end);
		if (this._params.autohide && this._params.detach && remaining.length === 0) {
			this._autohideTrigger();
		}

		this._restoreElementState(this._params.button.text);
		execute(callback, [this, this._element]);
	}

	_restoreElementState(text) {
		const isButton = this._isToggleElement || this._element.tagName === 'BUTTON';
		if (isButton && !this._isScrollMode) {
			this._element.disabled = false;
			this._element.innerHTML = text;
		}
	}

	_autohideTrigger() {
		if (this._isScrollMode) {
			this._observer?.disconnect();
			this._observer = null;
		} else if (this._params.detach && this._element.parentNode) {
			this._element.remove();
		}
	}

	dispose() {
		this._observer?.disconnect();
		super.dispose();
	}
}

EventHandler.on(document, 'DOMContentLoaded', () => {
	Selectors.findAll(SELECTOR_DATA_MODULE).forEach(el => {
		!el.dataset.initialized && VGLoadMore.getOrCreateInstance(el);
		el.dataset.initialized = 'true';
	});
});

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	['A', 'AREA'].includes(this.tagName) && event.preventDefault();
	VGLoadMore.getOrCreateInstance(this).toggle();
});

export default VGLoadMore;