import BaseModule from "../../base-module";
import {isDisabled, isEmptyObj, mergeDeepObject, noop, normalizeData, transliterate} from "../../../utils/js/functions";
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

const EVENT_KEY_CLICK_DATA_API  = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE            = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN          = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW            = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN           = `${NAME_KEY}.shown`;

const SELECTOR_DATA_TOGGLE    = '[data-vg-toggle="select"]';
const SELECTOR_OPTION_TOGGLE  = '[data-vg-toggle="select-option"]';


let observerTimout;

class VGSelect extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			search: false,
			placeholder: '',
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
			},
			render: {
				option: noop,
				item: noop
			}
		}, params));

		this._drop = Selectors.find('.' + CLASS_NAME_DROPDOWN, this._element);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
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

		this._route((status, data) => {
			let response = normalizeData(data.response),
				select = this._element.previousSibling;

			if (response.length) {
				Selectors.findAll('option', select).forEach(option => {
					option.remove();
				});

				response.forEach(el => {
					let option = document.createElement('option');
					option.innerText = el.title;
					Manipulator.set(option, 'value', el.id);

					select.append(option);
				})

				this.build(true, this._element);
			}
		});

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
		this._queueCallback(completeCallback, this._element, true, 10);
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	build(isRebuild, elm = null) {
		const _this = this;
		let element = this._element;

		if (elm) element = elm;

		if (element.dataset?.inited === 'true' && !isRebuild) {
			return;
		} else if (isRebuild) {
			_this.destroy(element);
		}

		element.parentElement.style.position = 'relative';

		let option_selected,
			options = element.options;

		if (_this._params.placeholder && element.selectedIndex === 0) {
			option_selected = '<span class="'+ CLASS_NAME_PLACEHOLDER +'">' + _this._params.placeholder + '<span>';
		} else {
			option_selected = element.options[element.selectedIndex].innerText;
		}

		// Создаем основной элемент с классами селекта
		let classes = Manipulator.get(element,'class'),
			select = document.createElement('div');

		classes = classes.split(' ');

		for (const _class of classes) {
			select.classList.add(_class)
		}

		if (Manipulator.has(element, 'disabled')) select.classList.add('disabled')

		let elData = Manipulator.get(element);
		if (!isEmptyObj(elData)) {
			for (const key of Object.keys(elData)) {
				Manipulator.set(select,'data-' + key, elData[key]);
			}
		}

		// Создаем элемент с отображением выбранного варианта
		let current = document.createElement('div');
		current.classList.add(CLASS_NAME_CURRENT);
		Manipulator.set(current, 'data-vg-toggle', 'select');
		Manipulator.set(current, 'aria-expanded', 'false');
		current.innerHTML = option_selected.trim();
		select.append(current);

		// Создаем элемент выпадающего списка
		let dropdown = document.createElement('div');
		dropdown.classList.add(CLASS_NAME_DROPDOWN);
		select.append(dropdown);

		// Создаем список и варианты селекта
		let list = document.createElement('ul');
		list.classList.add(CLASS_NAME_LIST);

		let optGroup = element.querySelectorAll('optgroup');

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

				if (i === element.selectedIndex && !isSelected) {
					li.classList.add('selected');
				}

				if (Manipulator.has(option, 'disabled')) li.classList.add('disabled');
				if (Manipulator.has(option, 'hidden')) li.classList.add('hidden');

				list.append(li);

				i++;
			}
		}

		dropdown.append(list);

		// Добавляем все созданный контейнер после селекта
		element.insertAdjacentElement('afterend', select);

		// помечаем элемент инициализированным
		element.dataset.inited = 'true';

		if (_this._params.search) {
			this.search(select);
		}
	}

	destroy(select) {
		let element = select.nextElementSibling;

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

	refresh(select) {
		const _this = this;

		let observer = new MutationObserver(() => {
			clearTimeout(observerTimout);
			observerTimout = setTimeout(() => {
				_this.build(true, select);
			}, 100);
		});

		observer.observe(select, {
			attributeFilter: ['disabled', 'required', 'style', 'hidden'],
			childList: true,
			subtree: true,
			characterDataOldValue: true,
		});
	}

	search(select) {
		let dropdown = select.querySelector('.' + CLASS_NAME_DROPDOWN);

		let search_container = document.createElement('div');
		search_container.classList.add(CLASS_NAME_SEARCH);

		let input = document.createElement('input');
		input.setAttribute('name', 'vg-select-search');
		input.setAttribute('type', 'text');
		input.setAttribute('placeholder', 'Поиск...');

		search_container.append(input);
		dropdown.prepend(search_container);

		search_container.querySelector('[name=vg-select-search]').addEventListener('keyup', (e) => {
			e.preventDefault();

			let el = e.target;

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
					value = transliterate(value, true);

					for (const option of options) {
						let text = option.innerText.toLowerCase();

						if (text.indexOf(value) === -1) Manipulator.hide(option);
					}
				}
			}
		});
	}

	dispose() {
		super.dispose();
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

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 * @param isRebuild
	 */
	static init(element, params = {}, isRebuild = false) {
		const instance = VGSelect.getOrCreateInstance(element, params);
		instance.build(isRebuild);
	}
}

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, VGSelect.clearDrops);

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function () {
	const target = this.closest('.' + CLASS_NAME_CONTAINER);

	Manipulator.set(this, 'aria-expanded', true);

	EventHandler.one(target, EVENT_KEY_HIDDEN, () => {
		Manipulator.set(this, 'aria-expanded', false);
	})

	const alreadyOpen = Selectors.find('.vg-select.show')
	if (alreadyOpen && alreadyOpen !== target) {
		VGSelect.getInstance(alreadyOpen).hide();
	}

	const instance = VGSelect.getOrCreateInstance(target);
	instance.toggle(this);
});

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_OPTION_TOGGLE, function (e) {
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
		select.value = el.dataset.value;
		EventHandler.trigger(select, EVENT_KEY_CHANGE, {value: el.dataset.value});
	}
});


export default VGSelect;