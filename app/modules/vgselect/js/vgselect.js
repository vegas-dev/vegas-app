import BaseModule from "../../base-module";
import {
	isDisabled,
	isEmptyObj,
	mergeDeepObject,
	normalizeData,
} from "../../../utils/js/functions";
import { Manipulator } from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import _handlersVGSelect from "./handlers";
import {lang_titles} from "../../../utils/js/components/lang";

const NAME = 'select';
const NAME_KEY = 'vg.select';

const CLASS_NAME_SHOW           = 'show';
const CLASS_NAME_ACTIVE         = 'active';
const CLASS_NAME_CONTAINER      = 'vg-select';
const CLASS_NAME_DROPDOWN       = 'vg-select-dropdown';
const CLASS_NAME_LIST           = 'vg-select-list';
const CLASS_NAME_OPTION         = 'vg-select-list--option';
const CLASS_NAME_OPTGROUP       = 'vg-select-list--optgroup';
const CLASS_NAME_OPTGROUP_TITLE = 'vg-select-list--optgroup-title';
const CLASS_NAME_CURRENT        = 'vg-select-current';
const CLASS_NAME_PLACEHOLDER    = 'vg-select-current--placeholder';
const CLASS_NAME_SEARCH         = 'vg-select-search';
const CLASS_NAME_TAGS           = 'vg-select-tags';
const CLASS_NAME_TAG            = 'vg-select-tag';
const CLASS_NAME_TAG_REMOVE     = 'vg-select-tag-remove';

const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE            = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN          = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW            = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN           = `${NAME_KEY}.shown`;
const EVENT_KEY_INIT            = `${NAME_KEY}.init`;
const EVENT_KEY_REBUILD         = `${NAME_KEY}.rebuild`;
const EVENT_KEY_OPEN            = `${NAME_KEY}.open`;
const EVENT_KEY_CLOSE           = `${NAME_KEY}.close`;
const EVENT_KEY_SELECT          = `${NAME_KEY}.select`;
const EVENT_KEY_CLEAR           = `${NAME_KEY}.clear`;
const EVENT_KEY_ERROR           = `${NAME_KEY}.error`;

const SELECTOR_DATA_TOGGLE      = '[data-vg-toggle="select"]';
const SELECTOR_CURRENT          = `.${CLASS_NAME_CURRENT}`;
const SELECTOR_DROPDOWN         = `.${CLASS_NAME_DROPDOWN}`;

let _observerTimeout;

class VGSelect extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			lang: document.documentElement.lang || 'ru',
			search: {
				enabled: true,
				route: '',
				remote: false,
				delay: 300,
				minTerm: 1,
			},
			placeholder: '',
			onInit: null,
			onShow: null,
			onHide: null,
			onChange: null,
			onSearch: null,
			onSelect: null,
			onDeselect: null,
			onClear: null,
		}, params));

		this._observer = null;
		this._drop = Selectors.find(SELECTOR_DROPDOWN, this._element);
		this._initObserver();

		this._triggerEvent(EVENT_KEY_INIT);
		this._callCallback('onInit');
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static buildListOptions(selector, drop) {
		let list = drop.querySelector(`.${CLASS_NAME_LIST}`);
		if (!list) {
			list = document.createElement('ul');
			list.classList.add(CLASS_NAME_LIST);
			drop.appendChild(list);
		} else {
			list.innerHTML = '';
		}

		const optGroups = selector.querySelectorAll('optgroup');
		const fragment = document.createDocumentFragment();

		if (optGroups.length > 0) {
			optGroups.forEach(optGroup => {
				const ol = document.createElement('ol');
				ol.classList.add(CLASS_NAME_OPTGROUP);

				const label = document.createElement('li');
				label.textContent = optGroup.label.trim();
				label.classList.add(CLASS_NAME_OPTGROUP_TITLE);
				ol.appendChild(label);

				this._createListItems(optGroup.querySelectorAll('option'), ol, selector);
				fragment.appendChild(ol);
			});
			list.appendChild(fragment);
		} else {
			this._createListItems(selector.options, list, selector);
		}

		return list;
	}

	static _createListItems(options, parent, selector) {
		const frag = document.createDocumentFragment();
		const selectedIndex = selector.selectedIndex;

		[...options].forEach((option, i) => {
			if (option.hidden) return;

			const value = option.value || '';
			const text = option.textContent.trim();
			const isEmptyOption = value === '' && text === '';

			const li = document.createElement('li');
			li.textContent = text;
			li.dataset.value = value;
			li.classList.add(CLASS_NAME_OPTION);
			Manipulator.set(li, 'data-vg-toggle', 'select-option');

			if (i === selectedIndex) {
				li.classList.add('selected');
			}

			if (option.disabled) {
				li.classList.add('disabled');
			}

			if (isEmptyOption) {
				li.hidden = true;
				li.style.display = 'none';
			}

			const dataAttrs = Manipulator.get(option);
			if (!isEmptyObj(dataAttrs)) {
				Object.keys(dataAttrs).forEach(key => {
					Manipulator.set(li, `data-${key}`, dataAttrs[key]);
				});
			}

			frag.appendChild(li);
		});

		parent.appendChild(frag);
	}

	static isPlaceholderValue(select, value) {
		const attr = select.dataset.placeholderValue;
		if (!attr) return value == null || String(value).trim() === '';
		return attr.split(',').map(v => v.trim()).includes(String(value));
	}

	static hasSelectedValidOption(select) {
		const index = select.selectedIndex;
		if (index === -1) return false;
		return !this.isPlaceholderValue(select, select.options[index]?.value);
	}

	static build(selector, reBuild = false) {
		if (reBuild || selector.dataset.inited === 'true') {
			this.destroy(selector);
		}

		const container = document.createElement('div');
		container.classList.add(CLASS_NAME_CONTAINER);
		container.style.position = 'relative';

		if (selector.classList.length) {
			[...selector.classList].forEach(cls => container.classList.add(cls));
		}

		if (isDisabled(selector)) {
			container.classList.add('disabled');
		}

		const elData = Manipulator.get(selector);
		if (!isEmptyObj(elData)) {
			Object.keys(elData).forEach(key => {
				Manipulator.set(container, `data-${key}`, elData[key]);
			});
		}

		const placeholder = selector.dataset.placeholder || '';
		const isMultiple = selector.multiple;

		const current = document.createElement('div');
		current.classList.add(CLASS_NAME_CURRENT);
		current.setAttribute('data-vg-toggle', 'select');
		current.setAttribute('aria-expanded', 'false');
		current.setAttribute('role', 'button');
		current.tabIndex = isMultiple ? -1 : 0;

		if (isMultiple) {
			const tags = document.createElement('div');
			tags.classList.add(CLASS_NAME_TAGS);
			current.appendChild(tags);

			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'vg-select-multiple-input';
			input.style.cssText = 'border:none;outline:none;background:transparent;padding:0;margin:0;min-width:40px;font:inherit;';
			tags.appendChild(input);

			input.addEventListener('focus', () => {
				const inst = VGSelect.getInstance(input.closest(`.${CLASS_NAME_CONTAINER}`));
				if (inst && !inst._isShown()) inst.show();
			});
		} else {
			const index = selector.selectedIndex;
			const option = index >= 0 ? selector.options[index] : null;
			const text = option?.textContent.trim() || '';
			const showPlaceholder = placeholder && !this.hasSelectedValidOption(selector);

			current.innerHTML = showPlaceholder
				? `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`
				: text || '-';
		}

		container.appendChild(current);

		const dropdown = document.createElement('div');
		dropdown.classList.add(CLASS_NAME_DROPDOWN);
		container.appendChild(dropdown);

		this.buildListOptions(selector, dropdown);

		selector.insertAdjacentElement('afterend', container);
		selector.dataset.inited = 'true';

		this.getOrCreateInstance(container);
		this.updateUI(selector);
		const instance = VGSelect.getInstance(container);

		let searchInput = null;
		if (Manipulator.has(selector, 'data-search-enabled')) {
			const search = document.createElement('div');
			search.classList.add(CLASS_NAME_SEARCH);
			searchInput = document.createElement('input');
			searchInput.name = 'vg-select-search';
			searchInput.type = 'text';
			searchInput.placeholder = lang_titles(instance._params.lang, NAME)['search'];
			searchInput.autocomplete = 'off';
			searchInput.setAttribute('role', 'searchbox');
			search.appendChild(searchInput);
			dropdown.insertBefore(search, dropdown.firstChild);
		}

		if (searchInput && instance) {
			let searchTimeout;

			searchInput.addEventListener('input', (e) => {
				const term = e.target.value.trim();
				const params = instance._params;

				instance._callCallback('onSearch', { term });

				if (params.search.remote && params.search.route) {
					if (term.length < (params.search.minTerm || 1)) return;

					clearTimeout(searchTimeout);
					searchTimeout = setTimeout(() => {
						instance._fetchRemoteData(term);
					}, params.search.delay || 300);
				} else {
					instance._filterLocalOptions(term);
				}
			});
		}

		return container;
	}

	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		const e = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
		if (e.defaultPrevented) return;

		this._element.classList.add(CLASS_NAME_SHOW);

		if ('ontouchstart' in document.documentElement) {
			document.body.style.pointerEvents = 'none';
		}

		const toggle = this._element.querySelector(SELECTOR_DATA_TOGGLE);
		toggle.setAttribute('aria-expanded', 'true');

		if (this._params.search) {
			const input = this._element.querySelector('input');
			if (input) input.focus();
		}

		return this._queueCallback(() => {
			this._element.classList.add(CLASS_NAME_ACTIVE);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
			this._triggerEvent(EVENT_KEY_OPEN);
			this._callCallback('onShow');
		}, this._drop, true, 50);
	}

	hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		this._completeHide();
	}

	_completeHide(relatedTarget = {}) {
		const e = EventHandler.trigger(this._element, EVENT_KEY_HIDE, relatedTarget);
		if (e.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_ACTIVE);
		this._element.querySelector(SELECTOR_DATA_TOGGLE).setAttribute('aria-expanded', 'false');

		this._queueCallback(() => {
			this._element.classList.remove(CLASS_NAME_SHOW);
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN, relatedTarget);
			this._triggerEvent(EVENT_KEY_CLOSE);
			this._callCallback('onHide');
		}, this._drop, true, 10);

		if ('ontouchstart' in document.documentElement) {
			document.body.style.pointerEvents = '';
		}
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_initObserver() {
		if (this._observer) {
			this._observer.disconnect();
		}

		const select = this._element.previousElementSibling;
		if (!select || select.tagName !== 'SELECT') return;

		this._observer = new MutationObserver((mutations) => {
			console.debug('VGSelect: Mutation detected', mutations);
			if (select.hasAttribute('data-updating')) return;

			const shouldUpdate = mutations.some(mutation => {
				if (mutation.type === 'attributes') {
					return ['disabled', 'required', 'style', 'hidden'].includes(mutation.attributeName);
				}
				return mutation.type === 'childList' || mutation.type === 'characterData';
			});

			if (!shouldUpdate) return;

			const wasShown = this._isShown();

			clearTimeout(_observerTimeout);
			_observerTimeout = setTimeout(() => {
				if (this._element.previousElementSibling !== select || select.hasAttribute('data-updating')) return;

				this._updateFromMutation();

				if (wasShown) {
					requestAnimationFrame(() => {
						this.show();
					});
				}
			}, 100);
		});

		this._observer.observe(select, {
			attributes: true,
			attributeFilter: ['disabled', 'required', 'style', 'hidden'],
			childList: true,
			subtree: true,
			characterData: true
		});
	}

	_updateFromMutation() {
		const select = this._element.previousElementSibling;
		if (!select) return;

		if (isDisabled(select)) {
			this._element.classList.add('disabled');
		} else {
			this._element.classList.remove('disabled');
		}

		const drop = this._element.querySelector(SELECTOR_DROPDOWN);
		VGSelect.buildListOptions(select, drop);

		VGSelect.updateUI(select);
	}

	dispose() {
		if (this._observer) {
			this._observer.disconnect();
			this._observer = null;
		}
		clearTimeout(_observerTimeout);
		super.dispose();
	}

	static destroy(select) {
		const container = select.nextElementSibling;
		if (container && container.classList.contains(CLASS_NAME_CONTAINER)) {
			container.remove();
		}
	}

	static updateUI(select) {
		const container = select.nextElementSibling;
		if (!container || !container.classList.contains(CLASS_NAME_CONTAINER)) return;

		const current = container.querySelector(SELECTOR_CURRENT);
		const placeholder = select.dataset.placeholder || '';
		const isMultiple = select.multiple;
		const instance = VGSelect.getInstance(container);

		if (isMultiple) {
			const tags = current.querySelector(`.${CLASS_NAME_TAGS}`);
			const input = tags.querySelector('input');
			const prevCount = tags.querySelectorAll(`.${CLASS_NAME_TAG}`).length;
			tags.innerHTML = '';
			tags.appendChild(input);

			const selected = Array.from(select.selectedOptions);
			const newCount = selected.length;

			if (newCount === 0 && prevCount > 0) {
				instance?._triggerEvent(EVENT_KEY_CLEAR);
				instance?._callCallback('onClear');
			}

			if (selected.length === 0) {
				input.placeholder = placeholder;
			} else {
				input.placeholder = '';
				selected.forEach(opt => {
					const tag = document.createElement('div');
					tag.classList.add(CLASS_NAME_TAG);
					tag.innerHTML = `<span>${opt.textContent}</span><svg class="${CLASS_NAME_TAG_REMOVE}" data-value="${opt.value}" width="14" height="14" viewBox="0 0 14 14"><line x1="2" y1="2" x2="12" y2="12" stroke="currentColor"/><line x1="12" y1="2" x2="2" y2="12" stroke="currentColor"/></svg>`;
					tags.insertBefore(tag, input);
				});
			}
		} else {
			const index = select.selectedIndex;
			const option = index >= 0 ? select.options[index] : null;
			const text = option?.textContent.trim() || '';
			const value = option?.value;
			const showPlaceholder = placeholder && (!value || this.isPlaceholderValue(select, value) || !text);

			const oldText = current.textContent;
			const newText = showPlaceholder ? placeholder : text || '-';

			if (oldText !== newText) {
				current.innerHTML = showPlaceholder
					? `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`
					: newText;
			}
		}
	}

	static changeSelector(select, value, data = {}) {
		const container = select.nextElementSibling;
		const instance = container ? VGSelect.getInstance(container) : null;
		const prevValue = select.value;

		select.setAttribute('data-updating', 'true');
		try {
			const opt = select.querySelector(`option[value="${CSS.escape(normalizeData(value))}"]`);
			if (!opt) {
				instance?._triggerEvent(EVENT_KEY_ERROR, { error: 'Option not found', value });
				return;
			}

			const oldValue = select.value;
			const wasSelected = opt.selected;
			const selectedText = opt.textContent.trim();

			[...select.options].forEach(o => o.selected = false);
			opt.selected = true;
			select.value = opt.value;

			this.updateUI(select);

			const e = new Event('change', { bubbles: true, cancelable: true });
			select.dispatchEvent(e);

			if (!wasSelected) {
				EventHandler.trigger(select, EVENT_KEY_CHANGE, { data });
				instance?._triggerEvent(EVENT_KEY_SELECT, { value, text: selectedText, data });
				instance?._callCallback('onSelect', { value, text: selectedText, data });
			}
		} finally {
			select.removeAttribute('data-updating');
		}
	}

	_triggerEvent(eventName, detail = {}) {
		EventHandler.trigger(this._element, eventName, detail);
	}

	_callCallback(name, arg = null) {
		const callback = this._params[name];
		if (typeof callback === 'function') {
			callback.call(this, this._element, arg);
		}
	}

	static init(element, params = {}, isRebuild = false) {
		this.build(element, isRebuild);
	}

	static clearDrops(event) {
		const open = Selectors.find(`.${CLASS_NAME_CONTAINER}.${CLASS_NAME_SHOW}`);
		if (!open) return;

		const targetIsToggle = event.target.closest(SELECTOR_DATA_TOGGLE);
		if (targetIsToggle && targetIsToggle.closest(`.${CLASS_NAME_CONTAINER}`) === open) {
			return;
		}

		const targetInDropdown = event.composedPath().some(el =>
			el.classList?.contains(CLASS_NAME_DROPDOWN)
		);
		if (targetInDropdown) {
			return;
		}

		const instance = VGSelect.getInstance(open);
		if (instance) {
			instance._completeHide({ relatedTarget: event.target });
		}
	}

	static addOptions(select, data) {
		const container = select.nextElementSibling;
		const isRebuild = container && container.classList.contains(CLASS_NAME_CONTAINER);
		const instance = isRebuild ? VGSelect.getInstance(container) : null;

		let options = data;
		if (data && data.results && Array.isArray(data.results)) {
			options = data.results;
		}

		if (!Array.isArray(options)) {
			instance?._triggerEvent(EVENT_KEY_ERROR, { error: 'Invalid data format: expected array' });
			return;
		}

		// Удаляем только динамические опции
		[...select.querySelectorAll('option')].forEach(option => {
			const parentOptGroup = option.closest('optgroup');
			if (option.value === '') return; // не удаляем пустую
			if (option.hasAttribute('data-preserve')) return;
			if (parentOptGroup && parentOptGroup.hasAttribute('data-preserve')) return;

			option.remove();
		});

		[...select.querySelectorAll('optgroup')].forEach(og => {
			if (og.children.length === 0 && !og.hasAttribute('data-preserve')) {
				og.remove();
			}
		});

		// Добавляем новые
		options.forEach(item => {
			if (item.children && Array.isArray(item.children)) {
				const optgroup = document.createElement('optgroup');
				optgroup.label = item.text || '';
				if (item.disabled) optgroup.disabled = true;

				item.children.forEach(child => {
					const option = document.createElement('option');
					option.value = child.id || '';
					option.textContent = child.text || '';
					if (child.selected) option.selected = true;
					if (child.disabled) option.disabled = true;

					const dataAttrs = Object.keys(child).filter(k => !['id', 'text', 'selected', 'disabled'].includes(k));
					dataAttrs.forEach(key => {
						option.setAttribute(`data-${key}`, child[key]);
					});

					optgroup.appendChild(option);
				});

				select.appendChild(optgroup);
			} else {
				const option = document.createElement('option');
				option.value = item.id || '';
				option.textContent = item.text || '';
				if (item.selected) option.selected = true;
				if (item.disabled) option.disabled = true;

				const dataAttrs = Object.keys(item).filter(k => !['id', 'text', 'selected', 'disabled'].includes(k));
				dataAttrs.forEach(key => {
					option.setAttribute(`data-${key}`, item[key]);
				});

				select.appendChild(option);
			}
		});

		if (isRebuild) {
			const drop = container.querySelector(`.${CLASS_NAME_DROPDOWN}`);
			VGSelect.buildListOptions(select, drop);
			instance?._triggerEvent(EVENT_KEY_REBUILD);
		} else {
			this.updateUI(select);
		}
	}

	_fetchRemoteData(term) {
		const { route, method = 'GET' } = this._params.search;
		const url = route.replace('{query}', encodeURIComponent(term));

		const options = {
			method,
			headers: { 'Content-Type': 'application/json' }
		};

		if (method.toUpperCase() !== 'GET') {
			options.body = JSON.stringify({ query: term });
		}

		const searchInput = this._element.querySelector(`.${CLASS_NAME_SEARCH} input`);
		const wasOpen = this._isShown(); // Сохраняем состояние

		fetch(url, options)
			.then(res => res.json())
			.then(data => {
				const select = this._element.previousElementSibling;
				if (!select) return;

				VGSelect.addOptions(select, data);
				this._callCallback('onSearch', { term, data });

				if (wasOpen && searchInput) {
					searchInput.value = term;
					searchInput.focus();

					this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_ACTIVE);
				}
			})
			.catch(err => {
				console.error('VGSelect: Remote search error', err);
				this._triggerEvent(EVENT_KEY_ERROR, { error: 'Search request failed', term });

				if (wasOpen && searchInput) {
					searchInput.focus();
				}
			});
	}

	_filterLocalOptions(term) {
		const list = this._drop.querySelector(`.${CLASS_NAME_LIST}`);
		const options = list.querySelectorAll(`.${CLASS_NAME_OPTION}`);

		if (!term) {
			options.forEach(el => el.hidden = false);
			return;
		}

		term = term.toLowerCase();
		options.forEach(el => {
			const text = el.textContent.toLowerCase();
			el.hidden = !text.includes(term);
		});
	}
}

_handlersVGSelect();

export default VGSelect;