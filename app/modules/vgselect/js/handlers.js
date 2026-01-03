import VGSelect from "./vgselect";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {Manipulator} from "../../../utils/js/dom/manipulator";

const NAME_KEY = 'vg.select';

const CLASS_NAME_SHOW           = 'show';
const CLASS_NAME_CONTAINER      = 'vg-select';
const CLASS_NAME_DROPDOWN       = 'vg-select-dropdown';
const CLASS_NAME_LIST           = 'vg-select-list';
const CLASS_NAME_OPTION         = 'vg-select-list--option';
const CLASS_NAME_OPTGROUP       = 'vg-select-list--optgroup';
const CLASS_NAME_TAGS           = 'vg-select-tags';
const CLASS_NAME_TAG            = 'vg-select-tag';
const CLASS_NAME_TAG_REMOVE     = 'vg-select-tag-remove';

const EVENT_CLICK_DATA_API      = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_UP_DATA_API     = `keyup.${NAME_KEY}.data.api`;
const EVENT_RESET_DATA_API      = `reset.${NAME_KEY}.data.api`;
const EVENT_KEYDOWN_DATA_API    = `keydown.${NAME_KEY}.data.api`;

const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_SEARCH          = `${NAME_KEY}.search`;
const EVENT_KEY_SELECT          = `${NAME_KEY}.select`;
const EVENT_KEY_DESELECT        = `${NAME_KEY}.deselect`;

const SELECTOR_DATA_TOGGLE      = '[data-vg-toggle="select"]';
const SELECTOR_OPTION_TOGGLE    = '[data-vg-toggle="select-option"]';
const SELECTOR_SEARCH_TOGGLE    = '[name="vg-select-search"]';
const SELECTOR_DROPDOWN         = `.${CLASS_NAME_DROPDOWN}`;
const SELECTOR_MULTIPLE_INPUT   = `.vg-select-multiple-input`;

const _vgSelectHandlers = () => {
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

		const instance = VGSelect.getInstance(container);
		const wasSelected = realOpt.selected;

		if (isMultiple) {
			realOpt.selected = !realOpt.selected;
			option.classList.toggle('selected', realOpt.selected);
			VGSelect.updateUI(select);
			select.dispatchEvent(new Event('change', { bubbles: true }));
			EventHandler.trigger(select, EVENT_KEY_CHANGE, {
				data: { value, title: option.textContent, ...Manipulator.get(option) }
			});

			if (realOpt.selected) {
				instance?._triggerEvent(EVENT_KEY_SELECT, { value, title: option.textContent, ...Manipulator.get(option) });
				instance?._callCallback('onSelect', { value, title: option.textContent, ...Manipulator.get(option) });
			} else {
				instance?._triggerEvent(EVENT_KEY_DESELECT, { value, title: option.textContent, ...Manipulator.get(option) });
				instance?._callCallback('onDeselect', { value, title: option.textContent, ...Manipulator.get(option) });
			}
		} else {
			if (wasSelected) return;

			container.querySelectorAll(`.${CLASS_NAME_OPTION}`).forEach(o => o.classList.remove('selected'));
			option.classList.add('selected');
			VGSelect.changeSelector(select, value, {
				value,
				title: option.textContent,
				...Manipulator.get(option)
			});
			instance?.hide();
		}
	});

	EventHandler.on(document, EVENT_KEY_UP_DATA_API, SELECTOR_SEARCH_TOGGLE, function(e) {
		const input = e.target;
		const dropdown = input.closest(SELECTOR_DROPDOWN);
		const list = dropdown?.querySelector(`.${CLASS_NAME_LIST}`);
		if (!list) return;

		const container = input.closest(`.${CLASS_NAME_CONTAINER}`);
		const instance = VGSelect.getInstance(container);

		const options = list.querySelectorAll(`.${CLASS_NAME_OPTION}`);
		const groups = list.querySelectorAll(`.${CLASS_NAME_OPTGROUP}`);
		const value = input.value.trim().toLowerCase();
		const search = [value, transliterate(value), transliterate(value, true)];

		options.forEach(el => { el.hidden = false; el.style.display = ''; });
		groups.forEach(el => { el.hidden = false; el.style.display = ''; });

		if (value) {
			let visibleCount = 0;
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
					if (match) visibleCount++;
				});
			}) : options.forEach(option => {
				const t = option.textContent.toLowerCase();
				const match = search.some(s => t.includes(s));
				option.hidden = !match;
				option.style.display = match ? '' : 'none';
				if (match) visibleCount++;
			});

			instance?._triggerEvent(EVENT_KEY_SEARCH, { query: value, results: visibleCount });
			instance?._callCallback('onSearch', { query: value, results: visibleCount });
		} else {
			instance?._triggerEvent(EVENT_KEY_SEARCH, { query: '', results: options.length });
			instance?._callCallback('onSearch', { query: '', results: options.length });
		}
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
		const instance = VGSelect.getInstance(container);

		if (opt) {
			opt.selected = false;
			if (item) item.classList.remove('selected');
			VGSelect.updateUI(select);
			select.dispatchEvent(new Event('change', { bubbles: true }));
			EventHandler.trigger(select, EVENT_KEY_CHANGE, { data: { value } });

			instance?._triggerEvent(EVENT_KEY_DESELECT, { value });
			instance?._callCallback('onDeselect', { value });
		}
	});

	EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MULTIPLE_INPUT, function(e) {
		if (e.key === 'Backspace' && !e.target.value) {
			const input = e.target;
			const tagsContainer = input.parentElement;
			const tags = tagsContainer.querySelectorAll(`.${CLASS_NAME_TAG}`);
			if (tags.length > 0) {
				const lastTag = tags[tags.length - 1];
				const value = lastTag.querySelector('svg')?.dataset.value;
				const select = input.closest(`.${CLASS_NAME_CONTAINER}`).previousElementSibling;
				const option = select.querySelector(`option[value="${CSS.escape(value)}"]`);
				const listItem = select.closest(`.${CLASS_NAME_CONTAINER}`).querySelector(`.${CLASS_NAME_OPTION}[data-value="${CSS.escape(value)}"]`);
				const instance = VGSelect.getInstance(input.closest(`.${CLASS_NAME_CONTAINER}`));

				if (option) {
					option.selected = false;
					if (listItem) listItem.classList.remove('selected');
					VGSelect.updateUI(select);
					select.dispatchEvent(new Event('change', { bubbles: true }));
					EventHandler.trigger(select, EVENT_KEY_CHANGE, { data: { value } });

					instance?._triggerEvent(EVENT_KEY_DESELECT, { value });
					instance?._callCallback('onDeselect', { value });
				}
			}
		}
	});

}

export default _vgSelectHandlers;