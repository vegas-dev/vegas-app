import BaseModule from "../../base-module";
import {
	isDisabled,
	isEmptyObj,
	mergeDeepObject,
	normalizeData,
	transliterate
} from "../../../utils/js/functions";
import { Manipulator } from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

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

const EVENT_CLICK_DATA_API      = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_UP_DATA_API     = `keyup.${NAME_KEY}.data.api`;
const EVENT_RESET_DATA_API      = `reset.${NAME_KEY}.data.api`;
const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE            = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN          = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW            = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN           = `${NAME_KEY}.shown`;

const SELECTOR_DATA_TOGGLE      = '[data-vg-toggle="select"]';
const SELECTOR_OPTION_TOGGLE    = '[data-vg-toggle="select-option"]';
const SELECTOR_SEARCH_TOGGLE    = '[name="vg-select-search"]';
const SELECTOR_CURRENT          = `.${CLASS_NAME_CURRENT}`;
const SELECTOR_DROPDOWN         = `.${CLASS_NAME_DROPDOWN}`;

let _observerTimeout;

class VGSelect extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			search: false,
			placeholder: '',
		}, params));

		this._observer = null;
		this._drop = Selectors.find(SELECTOR_DROPDOWN, this._element);
		this._initObserver();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static buildListOptions(selector, drop) {
		const list = document.createElement('ul');
		list.classList.add(CLASS_NAME_LIST);
		drop.innerHTML = '';

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
		} else {
			this._createListItems(selector.options, list, selector);
		}

		if (optGroups.length > 0) {
			list.appendChild(fragment);
		}
		drop.appendChild(list);

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

			input.addEventListener('keydown', e => {
				if (e.key === 'Backspace' && !e.target.value) {
					const tags = input.parentElement.querySelectorAll(`.${CLASS_NAME_TAG}`);
					if (tags.length) {
						const last = tags[tags.length - 1];
						const value = last.querySelector('svg')?.dataset.value;
						const opt = selector.querySelector(`option[value="${CSS.escape(value)}"]`);
						if (opt) {
							opt.selected = false;
							this.updateUI(selector);
							selector.dispatchEvent(new Event('change', { bubbles: true }));
							EventHandler.trigger(selector, EVENT_KEY_CHANGE, { data: { value } });
						}
					}
				}
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

		if (selector.dataset.search !== undefined) {
			const search = document.createElement('div');
			search.classList.add(CLASS_NAME_SEARCH);
			const input = document.createElement('input');
			input.name = 'vg-select-search';
			input.type = 'text';
			input.placeholder = 'Поиск...';
			input.autocomplete = 'off';
			input.setAttribute('role', 'searchbox');
			search.appendChild(input);
			dropdown.insertBefore(search, dropdown.firstChild);
		}

		selector.insertAdjacentElement('afterend', container);
		selector.dataset.inited = 'true';

		this.getOrCreateInstance(container);
		this.updateUI(selector);

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

		this._queueCallback(() => {
			this._element.classList.add(CLASS_NAME_ACTIVE);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
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

		this._observer = new MutationObserver(() => {
			if (select.hasAttribute('data-updating')) return;
			clearTimeout(_observerTimeout);
			_observerTimeout = setTimeout(() => {
				if (this._element.previousElementSibling === select && !select.hasAttribute('data-updating')) {
					this.constructor.build(select, true);
				}
			}, 0);
		});

		this._observer.observe(select, {
			attributes: true,
			attributeFilter: ['disabled', 'required', 'style', 'hidden'],
			childList: true,
			subtree: true,
			characterData: true
		});
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

		if (isMultiple) {
			const tags = current.querySelector(`.${CLASS_NAME_TAGS}`);
			const input = tags.querySelector('input');
			tags.innerHTML = '';
			tags.appendChild(input);

			const selected = Array.from(select.selectedOptions);
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

			current.innerHTML = showPlaceholder
				? `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`
				: text || '-';
		}
	}

	static changeSelector(select, value, data = {}) {
		select.setAttribute('data-updating', 'true');
		try {
			[...select.options].forEach(opt => opt.selected = false);
			const opt = select.querySelector(`option[value="${CSS.escape(normalizeData(value))}"]`);
			if (opt) {
				opt.selected = true;
				select.value = opt.value;
				this.updateUI(select);
				const e = new Event('change', { bubbles: true, cancelable: true });
				select.dispatchEvent(e);
				EventHandler.trigger(select, EVENT_KEY_CHANGE, { data });
			}
		} finally {
			select.removeAttribute('data-updating');
		}
	}

	static hideOpenToggles(event) {
		const toggles = Selectors.findAll(`.${CLASS_NAME_CONTAINER}.${CLASS_NAME_SHOW}:not(.disabled)`);
		for (const el of toggles) {
			const instance = this.getInstance(el);
			if (!instance) continue;
			if (event.target.closest(`.${CLASS_NAME_CONTAINER}`) === el) continue;
			if (event.composedPath?.().includes(el)) continue;
			instance._completeHide({ relatedTarget: el });
		}
	}

	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) return;
		this.hideOpenToggles(event);
	}

	static init(element, params = {}, isRebuild = false) {
		this.build(element, isRebuild);
	}
}

EventHandler.on(document, EVENT_CLICK_DATA_API, e => VGSelect.clearDrops(e));
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(e) {
	const target = e.target;
	if (target.closest(`.${CLASS_NAME_TAG}`) || target.closest(`.${CLASS_NAME_TAG_REMOVE}`)) {
		e.stopPropagation();
		return;
	}
	const container = this.closest(`.${CLASS_NAME_CONTAINER}`);
	const instance = VGSelect.getOrCreateInstance(container);
	const open = Selectors.find(`.${CLASS_NAME_CONTAINER}.${CLASS_NAME_SHOW}`);
	if (open && open !== container) VGSelect.getInstance(open)?.hide();
	instance.toggle(this);
});
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_OPTION_TOGGLE, function(e) {
	const option = e.target;
	if (option.classList.contains('disabled')) return;
	const container = option.closest(`.${CLASS_NAME_CONTAINER}`);
	const select = container.previousElementSibling;
	const isMultiple = select.multiple;
	const value = option.dataset.value;
	const realOpt = select.querySelector(`option[value="${CSS.escape(value)}"]`);
	if (!realOpt) return;

	if (isMultiple) {
		realOpt.selected = !realOpt.selected;
		option.classList.toggle('selected', realOpt.selected);
		VGSelect.updateUI(select);
		select.dispatchEvent(new Event('change', { bubbles: true }));
		EventHandler.trigger(select, EVENT_KEY_CHANGE, {
			data: { value, title: option.textContent, ...Manipulator.get(option) }
		});
	} else {
		container.querySelectorAll(`.${CLASS_NAME_OPTION}`).forEach(o => o.classList.remove('selected'));
		option.classList.add('selected');
		VGSelect.changeSelector(select, value, {
			value,
			title: option.textContent,
			...Manipulator.get(option)
		});
		VGSelect.getInstance(container)?.hide();
	}
});
EventHandler.on(document, EVENT_KEY_UP_DATA_API, SELECTOR_SEARCH_TOGGLE, function(e) {
	const input = e.target;
	const dropdown = input.closest(SELECTOR_DROPDOWN);
	const list = dropdown?.querySelector(`.${CLASS_NAME_LIST}`);
	if (!list) return;

	const options = list.querySelectorAll(`.${CLASS_NAME_OPTION}`);
	const groups = list.querySelectorAll(`.${CLASS_NAME_OPTGROUP}`);
	const value = input.value.trim().toLowerCase();
	if (!value) {
		options.forEach(el => { el.hidden = false; el.style.display = ''; });
		groups.forEach(el => { el.hidden = false; el.style.display = ''; });
		return;
	}

	const search = [value, transliterate(value), transliterate(value, true)];
	options.forEach(el => { el.hidden = true; el.style.display = 'none'; });

	groups.length ? groups.forEach(group => {
		const items = group.querySelectorAll(`.${CLASS_NAME_OPTION}`);
		const visible = Array.from(items).some(item => {
			const t = item.textContent.toLowerCase();
			return search.some(s => t.includes(s));
		});
		group.hidden = !visible;
		group.style.display = visible ? '' : 'none';
		items.forEach(item => {
			const t = item.textContent.toLowerCase();
			const match = search.some(s => t.includes(s));
			item.hidden = !match;
			item.style.display = match ? '' : 'none';
		});
	}) : options.forEach(option => {
		const t = option.textContent.toLowerCase();
		const match = search.some(s => t.includes(s));
		option.hidden = !match;
		option.style.display = match ? '' : 'none';
	});
});
EventHandler.on(document, EVENT_RESET_DATA_API, 'form', function() {
	Selectors.findAll('select[data-inited="true"]', this).forEach(select => VGSelect.build(select, true));
});
EventHandler.on(document, 'keydown', SELECTOR_DATA_TOGGLE, function(e) {
	const inst = VGSelect.getInstance(this.closest(`.${CLASS_NAME_CONTAINER}`));
	if (!inst) return;
	switch (e.key) {
		case 'Enter':
		case ' ':
			e.preventDefault();
			inst.toggle();
			break;
		case 'Escape':
			if (inst._isShown()) inst.hide();
			break;
		case 'ArrowDown':
			e.preventDefault();
			if (!inst._isShown()) inst.show();
			break;
	}
});
EventHandler.on(document, EVENT_CLICK_DATA_API, `.${CLASS_NAME_TAGS}`, function(e) {
	const btn = e.target.closest(`.${CLASS_NAME_TAG_REMOVE}`);
	if (!btn) return;
	e.preventDefault();
	e.stopPropagation();
	const container = this.closest(`.${CLASS_NAME_CONTAINER}`);
	const select = container.previousElementSibling;
	const value = btn.dataset.value;
	const opt = select.querySelector(`option[value="${CSS.escape(value)}"]`);
	const item = container.querySelector(`.${CLASS_NAME_OPTION}[data-value="${CSS.escape(value)}"]`);
	if (opt) {
		opt.selected = false;
		if (item) item.classList.remove('selected');
		VGSelect.updateUI(select);
		select.dispatchEvent(new Event('change', { bubbles: true }));
		EventHandler.trigger(select, EVENT_KEY_CHANGE, { data: { value } });
	}
});

export default VGSelect;