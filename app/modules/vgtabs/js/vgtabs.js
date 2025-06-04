import BaseModule from "../../base-module";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {getNextActiveElement, isDisabled, mergeDeepObject} from "../../../utils/js/functions";

/**
 * Constants
 */
const NAME = 'tabs';
const NAME_KEY = 'vg.tabs';

const EVENT_HIDE = `${NAME_KEY}.hide`;
const EVENT_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_SHOW = `${NAME_KEY}.show`;
const EVENT_SHOWN = `${NAME_KEY}.shown`;
const EVENT_LOADED = `${NAME_KEY}.loaded`;

const EVENT_KEYDOWN = `keydown.${NAME_KEY}`;
const EVENT_LOAD_DATA_API = `load.${NAME_KEY}`;
const EVENT_CLICK_DATA_API = `click.${NAME_KEY}`;
const EVENT_MOUSEOVER_DATA_API = `mouseover.${NAME_KEY}`;
const EVENT_MOUSEOUT_DATA_API = `mouseout.${NAME_KEY}`;

const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';

const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_HOVER = 'hover';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const CLASS_DROPDOWN = 'dropdown';
const CLASS_SLIDER = 'vg-tabs-slider';
const CLASS_WITH_SLIDER = 'vg-tabs-with-slider';

const SELECTOR_DROPDOWN_TOGGLE = '[data-vg-toggle="dropdown"]';
const SELECTOR_DROPDOWN_MENU = '.dropdown-content';
const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;

const SELECTOR_TAB_CLASS = '.vg-tabs';
const SELECTOR_TAB_PANEL = '.list-group, .vg-tabs-panel, [role="tablist"]';
const SELECTOR_OUTER = '.vg-tabs-item, .list-group-item';
const SELECTOR_INNER = `.vg-tabs-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="tab"]';
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;

const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-vg-toggle="tab"]`;

class VGTabs extends BaseModule {

	constructor(element, params) {
		super(element, params);

		this._params = mergeDeepObject({
			slide: false,
			hash: false,
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: true,
				output: true,
			},
		}, this._params);

		this._parent = this._element.closest(SELECTOR_TAB_PANEL);
		this._main_parent = this._parent.closest(SELECTOR_TAB_CLASS);
		this._params = this._getParams(this._main_parent, this._params);
		this._params = this._getParams(this._element, this._params);

		if (!this._parent) {
			throw new TypeError(`${element.outerHTML} не имеет родителя ${SELECTOR_INNER_ELEM}`)
		}

		this._setInitialAttributes(this._parent, this._getChildren());
		this._setInitialSlider();
		this._setTabHash();

		EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event))
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	show() {
		const innerElem = this._element
		if (this._elemIsActive(innerElem)) {
			return
		}

		const active = this._getActiveElem()

		const hideEvent = active ?
			EventHandler.trigger(active, EVENT_HIDE, { relatedTarget: innerElem }) :
			null

		const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW, { relatedTarget: active })

		if (showEvent.defaultPrevented || (hideEvent && hideEvent.defaultPrevented)) {
			return
		}

		this._deactivate(active, innerElem)
		this._activate(innerElem, active)
	}

	_elemIsActive(elem) {
		return elem.classList.contains(CLASS_NAME_ACTIVE)
	}

	_getActiveElem() {
		return this._getChildren().find(child => this._elemIsActive(child)) || null
	}

	_activate(element, relatedElem) {
		if (!element) {
			return
		}

		element.classList.add(CLASS_NAME_ACTIVE);

		this._activate(Selectors.getElementFromSelector(element));

		const complete = () => {
			if (element.getAttribute('role') !== 'tab') {
				element.classList.add(CLASS_NAME_SHOW)
				return
			}

			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_LOADED, {stats: status, data: data});
			});

			element.removeAttribute('tabindex')
			element.setAttribute('aria-selected', true);

			this._toggleDropDown(element, true)
			EventHandler.trigger(element, EVENT_SHOWN, {
				relatedTarget: relatedElem
			})
		}

		this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE))
	}

	_deactivate(element, relatedElem) {
		if (!element) {
			return;
		}

		element.classList.remove(CLASS_NAME_ACTIVE);
		element.blur();

		this._deactivate(Selectors.getElementFromSelector(element));

		const complete = () => {
			if (element.getAttribute('role') !== 'tab') {
				element.classList.remove(CLASS_NAME_SHOW);
				return;
			}

			element.setAttribute('aria-selected', false);
			element.setAttribute('tabindex', '-1');
			this._toggleDropDown(element, false);
			EventHandler.trigger(element, EVENT_HIDDEN, { relatedTarget: relatedElem });
		}

		this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE));
	}

	_keydown(event) {
		if (!([ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key))) {
			return
		}

		event.stopPropagation()// stopPropagation/preventDefault both added to support up/down keys without scrolling the page
		event.preventDefault()

		const children = this._getChildren().filter(element => !isDisabled(element))
		let nextActiveElement

		if ([HOME_KEY, END_KEY].includes(event.key)) {
			nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1]
		} else {
			const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key)
			nextActiveElement = getNextActiveElement(children, event.target, isNext, true)
		}

		if (nextActiveElement) {
			nextActiveElement.focus({ preventScroll: true })
			VGTabs.getOrCreateInstance(nextActiveElement).show()
		}
	}

	_setTabHash() {
		if (!this._params.hash) {
			return;
		}

		let url = document.location.toString();

		if (url.match('#')) {
			let id = url.split('#')[1];

			let element = Selectors.find('[href="#' + id +'"]', this._parent) || Selectors.find('[data-vg-target="#' + id +'"]', this._element) || null;
			if (element) {
				VGTabs.getOrCreateInstance(element).show();
			}
		}
	}

	_setInitialSlider() {
		if (!this._params.slide) {
			return;
		}

		let slider = Selectors.find('.' + CLASS_SLIDER, this._main_parent);
		if (!slider) {
			slider = document.createElement('span');
			slider.classList.add(CLASS_SLIDER);
			this._main_parent.prepend(slider);
		}

		this._main_parent.classList.add(CLASS_WITH_SLIDER);

		let link_active = Selectors.find('.' + CLASS_NAME_ACTIVE, this._parent),
			{width, height} = window.getComputedStyle(link_active);

		link_active.classList.add(CLASS_NAME_HOVER);

		slider.style.width = width;
		slider.style.height = height;
		slider.style.left = link_active.offsetLeft + 'px';

		EventHandler.on(this._main_parent, EVENT_MOUSEOVER_DATA_API, SELECTOR_DATA_TOGGLE, (event) => {
			let link_target = event.target,
				{width, height} = window.getComputedStyle(link_target);

			if (['A', 'AREA'].includes(event.target.tagName)) {
				event.preventDefault();
			}

			if (isDisabled(link_target)) return;

			let link_current_hover = Selectors.find('.' + CLASS_NAME_HOVER, this._parent);
			if (link_current_hover) link_current_hover.classList.remove(CLASS_NAME_HOVER);
			link_target.classList.add(CLASS_NAME_HOVER);

			slider.style.width = width;
			slider.style.height = height;
			slider.style.left = link_target.offsetLeft + 'px';
		});

		EventHandler.on(this._main_parent, EVENT_MOUSEOUT_DATA_API, SELECTOR_DATA_TOGGLE, (event) => {
			if (['A', 'AREA'].includes(event.target.tagName)) {
				event.preventDefault();
			}

			let active = Selectors.find('.' + CLASS_NAME_ACTIVE, this._parent),
				{width, height} = window.getComputedStyle(active);

			[... Selectors.findAll('.' + CLASS_NAME_HOVER, this._parent)].forEach(el => {
				el.classList.remove(CLASS_NAME_HOVER);
			});

			active.classList.add(CLASS_NAME_HOVER);

			slider.style.width = width;
			slider.style.height = height;
			slider.style.left = active.offsetLeft + 'px';
		});
	}

	_setInitialAttributes(parent, children) {
		this._setAttributeIfNotExists(parent, 'role', 'tablist')

		for (const child of children) {
			this._setInitialAttributesOnChild(child)
		}
	}

	_setInitialAttributesOnChild(child) {
		child = this._getInnerElement(child)
		const isActive = this._elemIsActive(child)
		const outerElem = this._getOuterElement(child)
		child.setAttribute('aria-selected', isActive)

		if (outerElem !== child) {
			this._setAttributeIfNotExists(outerElem, 'role', 'presentation')
		}

		if (!isActive) {
			child.setAttribute('tabindex', '-1')
		}

		this._setAttributeIfNotExists(child, 'role', 'tab')
		this._setInitialAttributesOnTargetPanel(child)
	}

	_setInitialAttributesOnTargetPanel(child) {
		const target = Selectors.getElementFromSelector(child)

		if (!target) {
			return
		}

		this._setAttributeIfNotExists(target, 'role', 'tabpanel')

		if (child.id) {
			this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`)
		}
	}

	_setAttributeIfNotExists(element, attribute, value) {
		if (!element.hasAttribute(attribute)) {
			element.setAttribute(attribute, value)
		}
	}

	_getChildren() {
		return Selectors.findAll(SELECTOR_INNER_ELEM, this._parent)
	}

	_getInnerElement(elem) {
		return elem.matches(SELECTOR_INNER_ELEM) ? elem : Selectors.find(SELECTOR_INNER_ELEM, elem)
	}

	_getOuterElement(elem) {
		return elem.closest(SELECTOR_OUTER) || elem
	}

	_toggleDropDown(element, open) {
		const outerElem = this._getOuterElement(element)
		if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
			return
		}

		const toggle = (selector, className) => {
			const element = Selectors.find(selector, outerElem)
			if (element) {
				element.classList.toggle(className, open)
			}
		}

		toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE)
		toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW)
		outerElem.setAttribute('aria-expanded', open)
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}

	if (isDisabled(this)) {
		return;
	}

	VGTabs.getOrCreateInstance(this).show();
})

/**
 * Initialize on focus
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const element of Selectors.findAll(SELECTOR_DATA_TOGGLE_ACTIVE)) {
		VGTabs.getOrCreateInstance(element);
	}
});


export default VGTabs;
