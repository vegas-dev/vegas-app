import BaseModule from "../../base-module";
import {
	isDisabled,
	isEmptyObj,
	mergeDeepObject,
	normalizeData,
	transliterate
} from "../../../utils/js/functions";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
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

const EVENT_CLICK_DATA_API      = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_UP_DATA_API     = `keyup.${NAME_KEY}.data.api`;
const EVENT_RESET_DATA_API      = `reset.${NAME_KEY}.data.api`;
const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE            = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN          = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW            = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN           = `${NAME_KEY}.shown`;

const SELECTOR_DATA_TOGGLE     = '[data-vg-toggle="select"]';
const SELECTOR_OPTION_TOGGLE   = '[data-vg-toggle="select-option"]';
const SELECTOR_SEARCH_TOGGLE   = '[name="vg-select-search"]';
const SELECTOR_CURRENT         = `.${CLASS_NAME_CURRENT}`;
const SELECTOR_DROPDOWN        = `.${CLASS_NAME_DROPDOWN}`;

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

	static buildListOptions(selector, drop, isPlaceholder) {
		const options = selector.options;
		const list = document.createElement('ul');
		list.classList.add(CLASS_NAME_LIST);
		drop.innerHTML = '';

		const optGroups = selector.querySelectorAll('optgroup');

		if (optGroups.length > 0) {
			let isSelected = false;
			optGroups.forEach(optGroup => {
				const olOptGroup = document.createElement('ol');
				olOptGroup.classList.add(CLASS_NAME_OPTGROUP);

				const liLabel = document.createElement('li');
				liLabel.textContent = optGroup.label.trim();
				liLabel.classList.add(CLASS_NAME_OPTGROUP_TITLE);
				olOptGroup.prepend(liLabel);

				const groupOptions = optGroup.querySelectorAll('option');
				this._createListItems(groupOptions, olOptGroup, selector, isSelected);
				isSelected = true;

				list.append(olOptGroup);
			});
		} else {
			this._createListItems(options, list, selector, false);
		}

		drop.append(list);
		return list;
	}

	static _createListItems(options, parent, selector, skipSelected) {
		const selectedIndex = selector.selectedIndex;

		[...options].forEach((option, i) => {
			if (option.hidden) return;

			const li = document.createElement('li');
			li.textContent = option.textContent.trim();
			li.dataset.value = option.value || '';
			li.classList.add(CLASS_NAME_OPTION);

			Manipulator.set(li, 'data-vg-toggle', 'select-option');

			if (!skipSelected && i === selectedIndex) {
				li.classList.add('selected');
			}

			if (option.disabled) li.classList.add('disabled');
			if (option.hidden) li.classList.add('hidden');

			const dataAttrs = Manipulator.get(option);
			if (!isEmptyObj(dataAttrs)) {
				Object.keys(dataAttrs).forEach(key => {
					Manipulator.set(li, `data-${key}`, dataAttrs[key]);
				});
			}

			parent.append(li);
		});
	}

	static build(selector, reBuild = false) {
		if (reBuild || selector.dataset.inited === 'true') {
			VGSelect.destroy(selector);
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
		const isPlaceholder = !!placeholder;
		const hasSelectedOption = [...selector.options].some(opt => opt.selected && opt.value);

		let displayText;
		if (isPlaceholder && !hasSelectedOption) {
			displayText = `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`;
			Manipulator.set(selector, 'disabled', '');
		} else {
			const index = selector.selectedIndex !== -1 ? selector.selectedIndex : 0;
			displayText = selector.options[index]?.textContent || '-';
		}

		const current = document.createElement('div');
		current.classList.add(CLASS_NAME_CURRENT);
		Manipulator.set(current, 'data-vg-toggle', 'select');
		Manipulator.set(current, 'aria-expanded', 'false');
		Manipulator.set(current, 'role', 'button');
		Manipulator.set(current, 'tabindex', '0');
		current.innerHTML = displayText;
		container.append(current);

		const dropdown = document.createElement('div');
		dropdown.classList.add(CLASS_NAME_DROPDOWN);
		container.append(dropdown);

		VGSelect.buildListOptions(selector, dropdown, isPlaceholder);

		if (selector.dataset.search !== undefined) {
			const searchContainer = document.createElement('div');
			searchContainer.classList.add(CLASS_NAME_SEARCH);

			const input = document.createElement('input');
			input.name = 'vg-select-search';
			input.type = 'text';
			input.placeholder = 'Поиск...';
			input.autocomplete = 'off';
			input.setAttribute('role', 'searchbox');

			searchContainer.append(input);
			dropdown.prepend(searchContainer);
		}

		selector.insertAdjacentElement('afterend', container);
		selector.dataset.inited = 'true';

		VGSelect.getOrCreateInstance(container);

		return container;
	}

	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		this._element.classList.add(CLASS_NAME_SHOW);

		if ('ontouchstart' in document.documentElement) {
			document.body.style.pointerEvents = 'none';
		}

		const toggle = this._element.querySelector(SELECTOR_DATA_TOGGLE);
		Manipulator.set(toggle, 'aria-expanded', 'true');

		if (this._params.search) {
			const input = this._element.querySelector('input');
			if (input) input.focus();
		}

		const complete = () => {
			this._element.classList.add(CLASS_NAME_ACTIVE);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		};

		this._queueCallback(complete, this._drop, true, 50);
	}

	hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		this._completeHide();
	}

	_completeHide(relatedTarget = {}) {
		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE, relatedTarget);
		if (hideEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_ACTIVE);
		const toggle = this._element.querySelector(SELECTOR_DATA_TOGGLE);
		Manipulator.set(toggle, 'aria-expanded', 'false');

		const complete = () => {
			this._element.classList.remove(CLASS_NAME_SHOW);
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN, relatedTarget);
		};

		this._queueCallback(complete, this._drop, true, 10);

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
			// ✅ Если идёт внутреннее обновление — игнорируем
			if (select.hasAttribute('data-updating')) {
				return;
			}

			clearTimeout(_observerTimeout);
			_observerTimeout = setTimeout(() => {
				if (!select.hasAttribute('data-updating')) {
					VGSelect.build(select, true);
				}
			}, 10);
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

	// ✅ Новое: мгновенное обновление UI без пересборки
	static updateUI(select) {
		const container = select.nextElementSibling;
		if (!container || !container.classList.contains(CLASS_NAME_CONTAINER)) return;

		const current = container.querySelector(SELECTOR_CURRENT);
		const placeholder = select.dataset.placeholder || '';
		const hasSelectedOption = [...select.options].some(opt => opt.selected && opt.value);

		if (hasSelectedOption) {
			const selectedOption = select.options[select.selectedIndex];
			current.textContent = selectedOption?.textContent || '';
		} else if (placeholder) {
			current.innerHTML = `<span class="${CLASS_NAME_PLACEHOLDER}">${placeholder}</span>`;
		}
	}

	// ✅ Новое: безопасное изменение значения
	static changeSelector(select, value, data = {}) {
		const valueStr = normalizeData(value);

		// ✅ Помечаем, что идёт внутреннее обновление
		select.setAttribute('data-updating', 'true');

		try {
			[...select.options].forEach(opt => {
				opt.selected = false;
			});

			const targetOption = select.querySelector(`option[value="${CSS.escape(valueStr)}"]`);
			if (targetOption) {
				targetOption.selected = true;
				select.value = valueStr;
			}

			EventHandler.trigger(select, EVENT_KEY_CHANGE, { data });

			const changeEvent = new Event('change', {
				bubbles: true,
				cancelable: true
			});
			select.dispatchEvent(changeEvent);

			VGSelect.updateUI(select);
		} finally {
			select.removeAttribute('data-updating');
		}
	}

	static hideOpenToggles(event) {
		const openToggles = Selectors.findAll(`.${CLASS_NAME_CONTAINER}.${CLASS_NAME_SHOW}:not(.disabled):not(:disabled)`);

		for (const toggle of openToggles) {
			const instance = VGSelect.getInstance(toggle);
			if (!instance) continue;

			if (event.target.closest(`.${CLASS_NAME_CONTAINER}`) === toggle) {
				continue;
			}

			const path = event.composedPath?.() || [];
			if (path.includes(toggle)) continue;

			instance._completeHide({ relatedTarget: toggle });
		}
	}

	static clearDrops(event) {
		if (event.button === 2) return;
		if (event.type === 'keyup' && event.key !== 'Tab') return;
		VGSelect.hideOpenToggles(event);
	}

	static init(element, params = {}, isRebuild = false) {
		this.build(element);
	}
}

// === Event Listeners ===

EventHandler.on(document, EVENT_CLICK_DATA_API, (e) => VGSelect.clearDrops(e));

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function () {
	const container = this.closest(`.${CLASS_NAME_CONTAINER}`);
	const instance = VGSelect.getOrCreateInstance(container);

	const open = Selectors.find(`.${CLASS_NAME_CONTAINER}.${CLASS_NAME_SHOW}`);
	if (open && open !== container) {
		VGSelect.getInstance(open)?.hide();
	}

	instance.toggle(this);
});

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_OPTION_TOGGLE, function (e) {
	const option = e.target;
	if (option.classList.contains('disabled')) return;

	const container = option.closest(`.${CLASS_NAME_CONTAINER}`);
	if (!container) return;

	// Обновляем состояние списка
	const options = container.querySelectorAll(`.${CLASS_NAME_OPTION}`);
	options.forEach(opt => opt.classList.remove('selected'));
	option.classList.add('selected');

	// Обновляем отображаемое значение
	const current = container.querySelector(SELECTOR_CURRENT);
	current.textContent = option.textContent;

	// Обновляем нативный select
	const select = container.previousElementSibling;
	VGSelect.changeSelector(select, option.dataset.value, {
		value: option.dataset.value,
		title: option.textContent,
		...Manipulator.get(option)
	});

	const instance = VGSelect.getInstance(container);
	if (instance) {
		instance.hide();
	}
});

EventHandler.on(document, EVENT_KEY_UP_DATA_API, SELECTOR_SEARCH_TOGGLE, function (e) {
	const input = e.target;
	const dropdown = input.closest(SELECTOR_DROPDOWN);
	const list = dropdown?.querySelector(`.${CLASS_NAME_LIST}`);
	if (!list) return;

	const options = [
		...list.querySelectorAll(`.${CLASS_NAME_OPTION}`),
		...list.querySelectorAll(`.${CLASS_NAME_OPTGROUP}`)
	];

	const value = input.value.trim().toLowerCase();
	if (!value) {
		options.forEach(Manipulator.show);
		return;
	}

	const searchValues = [
		value,
		transliterate(value),
		transliterate(value, true)
	];

	options.forEach(Manipulator.hide);
	options.forEach(option => {
		const text = option.textContent.toLowerCase();
		if (searchValues.some(val => text.includes(val))) {
			Manipulator.show(option);
		}
	});
});

EventHandler.on(document, EVENT_RESET_DATA_API, 'form', function () {
	Selectors.findAll('select[data-inited="true"]', this).forEach(select => {
		VGSelect.build(select, true);
	});
});

EventHandler.on(document, 'keydown', SELECTOR_DATA_TOGGLE, function (e) {
	const container = this.closest(`.${CLASS_NAME_CONTAINER}`);
	const instance = VGSelect.getInstance(container);
	if (!instance) return;

	switch (e.key) {
		case 'Enter':
		case ' ':
			e.preventDefault();
			instance.toggle();
			break;
		case 'Escape':
			if (instance._isShown()) instance.hide();
			break;
		case 'ArrowDown':
			e.preventDefault();
			if (!instance._isShown()) instance.show();
			break;
	}
});

export default VGSelect;