import BaseModule from "../../base-module";
import {isEmptyObj, mergeDeepObject} from "../../../utils/js/functions";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";

/**
 * Constants
 */
const NAME = 'select';
const NAME_KEY = 'vg.select';

const CLASS_NAME_CONTAINER      = 'vg-select';
const CLASS_NAME_DROPDOWN       = 'vg-select-dropdown';
const CLASS_NAME_LIST           = 'vg-select-list';
const CLASS_NAME_OPTION         = 'vg-select-list--option';
const CLASS_NAME_OPTGROUP       = 'vg-select-list--optgroup';
const CLASS_NAME_OPTGROUP_TITLE = 'vg-select-list--optgroup-title';
const CLASS_NAME_CURRENT        = 'vg-select-current';
const CLASS_NAME_SEARCH         = 'vg-select-search';
const CLASS_NAME_SELECTED       = 'selected';

const EVENT_KEY_CHANGE          = `${NAME_KEY}.change`;

let observerTimout;

class VGSelect extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			search: false
		}, params));

		this._addEventListeners();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
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

		let option_selected = element.options[element.selectedIndex].innerText,
			options = element.options;

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
		current.innerText = option_selected.trim();
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

		_this.toggle(select);
	}

	toggle(select) {
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

	}

	dispose() {
		super.dispose();
	}

	_addEventListeners() {
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

export default VGSelect;