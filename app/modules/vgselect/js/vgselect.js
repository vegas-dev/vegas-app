import BaseModule from "../../base-module";
import {
	isDisabled,
	isEmptyObj, isObject, isVisible,
	mergeDeepObject,
	noop,
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

const SELECTOR_DATA_TOGGLE    = '[data-vg-toggle="select"]';
const SELECTOR_OPTION_TOGGLE  = '[data-vg-toggle="select-option"]';
const SELECTOR_SEARCH_TOGGLE  = '[name=vg-select-search]';


let observerTimout;

class VGSelect extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			search: false,
			placeholder: '',
		}, params));

		this._drop = Selectors.find('.' + CLASS_NAME_DROPDOWN, this._element);
		this.refresh();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static buildListOptions(selector, drop, isPlaceholder) {
		let options = selector.options,
			list = document.createElement('ul');

		if (isPlaceholder) {
			let isSelectedOption = [...options].filter(el => Manipulator.has(el, 'selected')).length > 0;

			if (!isSelectedOption) {
				let option = document.createElement('option');
				Manipulator.set(option, 'hidden', '');
				Manipulator.set(option, 'selected', '');
				options.add(option, 0)
			}
		}


		list.classList.add(CLASS_NAME_LIST);

		let optGroup = selector.querySelectorAll('optgroup');

		if (optGroup.length) {
			let isSelected = false;
			[...optGroup].forEach(function (el) {
				let olOptGroup = document.createElement('ol');
				olOptGroup.classList.add(CLASS_NAME_OPTGROUP);

				let liLabel = document.createElement('li');
				liLabel.innerHTML = el.label.trim();
				liLabel.classList.add(CLASS_NAME_OPTGROUP_TITLE)

				olOptGroup.prepend(liLabel)

				let optGroupOptions = Selectors.findAll('option', el);

				createLi(optGroupOptions, olOptGroup, isSelected);

				list.append(olOptGroup);
				isSelected = true;
			});
		} else {
			let isSelected = false;
			createLi(options, list, isSelected);
		}

		drop.append(list);

		return list;

		function createLi(options, list, isSelected) {
			let i = 0;
			for (const option of options) {
				let li = document.createElement('li');

				li.innerHTML = option.innerHTML.trim().replace(/<\/[^>]+(>|$)/g, "")
				li.dataset.value = Manipulator.get(option, 'value');
				li.classList.add(CLASS_NAME_OPTION);

				Manipulator.set(li, 'data-vg-toggle', 'select-option');

				let liData = Manipulator.get(option);
				if (!isEmptyObj(liData)) {
					for (const key of Object.keys(liData)) {
						Manipulator.set(li, 'data-' + key, liData[key]);
					}
				}

				if (i === selector.selectedIndex && !isSelected) {
					li.classList.add('selected');
				}

				if (Manipulator.has(option, 'disabled')) li.classList.add('disabled');
				if (Manipulator.has(option, 'hidden')) li.classList.add('hidden');

				list.append(li);

				i++;
			}
		}
	}

	static build(selector, reBuild = false) {
		let option_selected,
			placeholder = selector.dataset.placeholder || '',
			isPlaceholder = !!placeholder,
			isSearch = selector.dataset.search || false;

		if (selector.dataset?.inited === 'true' || reBuild) {
			VGSelect.destroy(selector);
		}

		selector.parentElement.style.position = 'relative';

		let isSelectedOption = [... selector.options].filter(el => {
			return Manipulator.has(el, 'selected') && el.value !== ''
		}).length > 0;

		if (isPlaceholder && selector.selectedIndex === -1) {
			option_selected = '<span class="' + CLASS_NAME_PLACEHOLDER + '">' + placeholder + '<span>';
			Manipulator.set(selector, 'disabled', '');
		} else if (!isPlaceholder && selector.selectedIndex === -1) {
			option_selected = '<span class="' + CLASS_NAME_PLACEHOLDER + '">-<span>';
			Manipulator.set(selector, 'disabled', '');
		} else if (isPlaceholder) {
			if (isPlaceholder && isSelectedOption) {
				option_selected = selector.options[selector.selectedIndex].innerText;
			} else if (isPlaceholder && !isSelectedOption) {
				option_selected = '<span class="' + CLASS_NAME_PLACEHOLDER + '">' + placeholder + '<span>';
			} else if(!isPlaceholder && !isSelectedOption) {
				option_selected = selector.options[selector.selectedIndex].innerText;
			} else {
				option_selected = '<span class="' + CLASS_NAME_PLACEHOLDER + '">-<span>';
			}
		} else {
			option_selected = selector.options[selector.selectedIndex].innerText;
		}

		// Создаем основной элемент с классами селекта
		let classes = Manipulator.get(selector,'class'),
			element = document.createElement('div');

		classes = classes.split(' ');

		for (const _class of classes) {
			element.classList.add(_class)
		}

		if (Manipulator.has(selector, 'disabled')) element.classList.add('disabled');

		let elData = Manipulator.get(selector);
		if (!isEmptyObj(elData)) {
			for (const key of Object.keys(elData)) {
				Manipulator.set(element,'data-' + key, elData[key]);
			}
		}

		// Создаем элемент с отображением выбранного варианта
		let current = document.createElement('div');
		current.classList.add(CLASS_NAME_CURRENT);
		Manipulator.set(current, 'data-vg-toggle', 'select');
		Manipulator.set(current, 'aria-expanded', 'false');
		current.innerHTML = option_selected.trim();
		element.append(current);

		// Создаем элемент выпадающего списка
		let dropdown = document.createElement('div');
		dropdown.classList.add(CLASS_NAME_DROPDOWN);
		element.append(dropdown);

		// Создаем список и варианты селекта
		VGSelect.buildListOptions(selector, dropdown, isPlaceholder);

		// Добавляем все созданный контейнер после селекта
		selector.insertAdjacentElement('afterend', element);

		// помечаем элемент инициализированным
		selector.dataset.inited = 'true';

		if (isSearch) {
			let search_container = document.createElement('div');
			search_container.classList.add(CLASS_NAME_SEARCH);

			let input = document.createElement('input');
			Manipulator.set(input, 'name', 'vg-select-search');
			Manipulator.set(input, 'type', 'text');
			Manipulator.set(input, 'placeholder', 'Поиск...');
			Manipulator.set(input, 'autocomplete', 'off');

			search_container.append(input);
			dropdown.prepend(search_container);
		}

		return element;
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		if ('ontouchstart' in document.documentElement) {
			for (const element of [].concat(...document.body.children)) {
				EventHandler.on(element, 'mouseover', noop);
			}
		}

		this._element.classList.add(CLASS_NAME_SHOW);

		if (this._params.search) {
			let input = Selectors.find('input', this._element);
			if (input) input.focus();
		}

		const completeCallBack = () => {
			this._element.classList.add(CLASS_NAME_ACTIVE);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		}

		this._queueCallback(completeCallBack, this._drop, true, 50)
	}

	hide() {
		if (isDisabled(this._element) || !this._isShown()) return;

		this._completeHide();
	}

	_completeHide() {
		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE, {})
		if (hideEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_ACTIVE);
		let toggle = Selectors.find(SELECTOR_DATA_TOGGLE, this._element);
		Manipulator.set(toggle, 'aria-expanded', 'false');

		if ('ontouchstart' in document.documentElement) {
			for (const element of [].concat(...document.body.children)) {
				EventHandler.off(element, 'mouseover', noop);
			}
		}

		const completeCallback = () => {
			this._element.classList.remove(CLASS_NAME_SHOW);
			EventHandler.trigger(this._element, EVENT_KEY_HIDDEN, {});
		}
		this._queueCallback(completeCallback, this._drop, true, 10);
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	refresh() {
		const select = this._element.previousSibling;

		let observer = new MutationObserver(() => {
			clearTimeout(observerTimout);
			observerTimout = setTimeout(() => {
				console.log('asdas')
				VGSelect.build(select, true);
			}, 10);
		});

		observer.observe(select, {
			attributeFilter: ['disabled', 'required', 'style', 'hidden', 'value', 'selected'],
			childList: true,
			subtree: true,
			characterDataOldValue: true,
		});
	}

	dispose() {
		super.dispose();
	}

	static destroy(select) {
		let element = Selectors.next(select, '.' + CLASS_NAME_CONTAINER);
		element = element.shift();

		if (element) {
			if (element.classList.contains(CLASS_NAME_CONTAINER)) {
				element.remove();

				select.selectedIndex = 0;
				[...select.querySelectorAll('option')].forEach(function (el, index) {
					if (el.hasAttribute('selected')) {
						select.selectedIndex = index;
					}
				});
			}
		}
	}

	static hideOpenToggles(event) {
		const openToggles = Selectors.findAll('.vg-select:not(.disabled):not(:disabled).show');

		for (const toggle of openToggles) {
			const context = VGSelect.getInstance(toggle);
			if (!context) continue;

			if (event.target.closest('.' + CLASS_NAME_CONTAINER) === context._element) {
				return;
			}

			const composedPath = event.composedPath();
			if (composedPath.includes(context._element)) {
				continue
			}

			const relatedTarget = { relatedTarget: context._element }

			if (event.type === 'click') {
				relatedTarget.clickEvent = event
			}

			context._completeHide(relatedTarget)
		}
	}

	static clearDrops(event) {
		if (event.button === 2 || (event.type === 'keyup' && event.key !== 'Tab')) {
			return
		}

		VGSelect.hideOpenToggles(event)
	}

	static changeSelector(select, value, data = {}) {
		if (!isObject(data) && isEmptyObj(data)) return;

		[... select.options].forEach(el => {
			Manipulator.remove(el, 'selected');

			if (el.value === value) {
				Manipulator.set(el, 'selected', true);
			}
		})

		select.value = normalizeData(value);
		EventHandler.trigger(select, EVENT_KEY_CHANGE, {data: data});
		EventHandler.trigger(select, 'change', {data: data});
	}

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 * @param isRebuild
	 */
	static init(element, params = {}, isRebuild = false) {
		let elm = VGSelect.build(element);
		VGSelect.getOrCreateInstance(elm, params);
	}
}

EventHandler.on(document, EVENT_CLICK_DATA_API, VGSelect.clearDrops);

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function () {
	const target = this.closest('.' + CLASS_NAME_CONTAINER);

	Manipulator.set(this, 'aria-expanded', true);

	const alreadyOpen = Selectors.find('.vg-select.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGSelect.getInstance(alreadyOpen).hide();
	}

	const instance = VGSelect.getOrCreateInstance(target);
	instance.toggle(this);
});

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_OPTION_TOGGLE, function (e) {
	let el = e.target;

	if (!el.classList.contains('disabled')) {
		let container = el.closest('.' + CLASS_NAME_CONTAINER),
			options = container.querySelectorAll('.' + CLASS_NAME_OPTION);

		if (options.length) {
			for (const option of options) {
				option.classList.remove('selected');
			}
		}

		el.classList.add('selected');

		container.querySelector('.' + CLASS_NAME_CURRENT).innerText = el.innerText;
		container.classList.remove('show');

		let select = container.previousSibling;
		VGSelect.changeSelector(select, el.dataset.value, {value: el.dataset.value, title: el.innerHTML})
	}
});

EventHandler.on(document, EVENT_KEY_UP_DATA_API, SELECTOR_SEARCH_TOGGLE, function (e) {
	let el = this;

	let selectList = el?.closest('.' + CLASS_NAME_DROPDOWN).querySelector('.' + CLASS_NAME_LIST);
	if (selectList) {
		let options = [...selectList.querySelectorAll('.' + CLASS_NAME_OPTION)],
			optionsGroup = [...selectList.querySelectorAll('.' + CLASS_NAME_OPTGROUP)],
			value = el?.value;

		options = options.concat(optionsGroup);

		for (const option of options) {
			Manipulator.show(option);
		}

		if (value.length) {
			value = value.trim();
			value = value.toLowerCase();

			let arrOptions = [];

			[
				value,
				transliterate(value),
				transliterate(value, true),
			].forEach(val => {
				for (const option of options) {
					let text = option.innerText.toLowerCase();

					Manipulator.hide(option)

					if (text.includes(val)) {
						arrOptions.push(option)
					}
				}
			});

			arrOptions.forEach(el => Manipulator.show(el))
		}
	}
});

EventHandler.on(document, EVENT_RESET_DATA_API, 'form', function () {
	Selectors.findAll('select.' + CLASS_NAME_CONTAINER, this).forEach(el => {
		VGSelect.build(el, true)
	});
});


export default VGSelect;