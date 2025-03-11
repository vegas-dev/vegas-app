import BaseModule from "../../base-module";
import {isDisabled, isEmptyObj, mergeDeepObject, noop, transliterate} from "../../../utils/js/functions";
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
const EVENT_KEY_HIDE_PREVENTED  = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;
const EVENT_KEY_HIDE            = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN          = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW            = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN           = `${NAME_KEY}.shown`;

const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="select"]';


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
		return !this._isShow() ? this.show(relatedTarget) : this.hide();
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

	_isShow() {
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

				let optGroupOptions = el.querySelectorAll('option');

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

	_addEventListeners(select) {
		const _this = this;

		select.querySelector('.' + CLASS_NAME_CURRENT).onclick = function (e) {
			let el = e.target,
				container = el.closest('.' + CLASS_NAME_CONTAINER);

			let selects = document.querySelectorAll('.' + CLASS_NAME_CONTAINER);
			if (selects.length) {
				for (const els of selects) {
					if (els !== container) {
						els?.classList.remove('show');
					}
				}
			}

			if (container.classList.contains('show')) {
				container.classList.remove('show');
			} else {
				container.classList.add('show');

				if (_this._params.search) {
					let input = container.querySelector('input');
					if (input) input.focus();
				}
			}

			return false;
		}

		select.querySelectorAll('.' + CLASS_NAME_OPTION).forEach((option) => {
			option.addEventListener('click', (e) => {
				e.preventDefault();

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
					EventHandler.trigger(select, EVENT_KEY_CHANGE)
				}
			});
		});

		window.addEventListener('click', function (e) {
			if (!e?.target.closest('.' + CLASS_NAME_CONTAINER)) {
				let selects = document.querySelectorAll('.' + CLASS_NAME_CONTAINER);
				if (selects.length) {
					for (const el of selects) {
						el?.classList.remove('show');
					}
				}
			}
		});

		[...document.querySelectorAll('form')].forEach(function (form) {
			form.addEventListener("reset", function () {
				form.querySelectorAll('select.vg-select').forEach(function (select) {
					VGSelect.init(select, {}, true)
				})
			});
		});
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


export default VGSelect;