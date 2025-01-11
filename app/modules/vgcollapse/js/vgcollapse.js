import BaseModule from "../../base-module";
import {mergeDeepObject, reflow} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * Constants
 */
const NAME = 'collapse';
const NAME_KEY = 'vg.collapse';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_COLLAPSE = 'vg-collapse';
const CLASS_NAME_COLLAPSING = 'vg-collapsing';
const CLASS_NAME_COLLAPSED = 'vg-collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;

const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="collapse"]';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN  = `${NAME_KEY}.shown`;

const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGCollapse extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			toggle: true,
			parent: null,
			ajax: {
				route: '',
				target: '',
				method: 'get'
			}
		}, params));

		this._isTransitioning = false
		this._triggerArray = []

		const toggleList = Selectors.findAll(SELECTOR_DATA_TOGGLE);

		for (const elem of toggleList) {
			const selector = Selectors.getSelectorFromElement(elem);
			const filterElement = Selectors.findAll(selector).filter(foundElement => foundElement === this._element);

			if (selector !== null && filterElement.length) {
				this._triggerArray.push(elem)
			}
		}

		this._initializeChildren();

		if (!this._params.parent) {
			this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
		}

		if (this._params.toggle) {
			this.toggle();
		}
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show() {
		const _this = this;

		if (_this._isTransitioning || _this._isShown()) return;

		let activeChildren = [];

		if (_this._params.parent) {
			activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES)
				.filter(element => element !== this._element)
				.map(element => VGCollapse.getOrCreateInstance(element, { toggle: false }));
		}

		if (activeChildren.length && activeChildren[0]._isTransitioning) return;

		const startEvent = EventHandler.trigger(_this._element, EVENT_KEY_SHOW);
		if (startEvent.defaultPrevented) return;

		for (const activeInstance of activeChildren) {
			activeInstance.hide();
		}

		_this._element.classList.remove(CLASS_NAME_COLLAPSE)
		_this._element.classList.add(CLASS_NAME_COLLAPSING)

		_this._element.style.height = 0;

		_this._addAriaAndCollapsedClass(_this._triggerArray, true);
		_this._isTransitioning = true;

		console.log(_this._params)
		_this._route();

		const complete = () => {
			_this._isTransitioning = false;

			_this._element.classList.remove(CLASS_NAME_COLLAPSING);
			_this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

			_this._element.style.height = '';
			EventHandler.trigger(_this._element, EVENT_KEY_SHOWN);
		}

		_this._queueCallback(complete, _this._element, true);

		const scrollSize = `scrollHeight`;
		_this._element.style.height = `${_this._element[scrollSize]}px`;
	}

	hide() {
		const _this = this;

		if (_this._isTransitioning || !_this._isShown()) return;

		const startEvent = EventHandler.trigger(_this._element, EVENT_KEY_HIDE)
		if (startEvent.defaultPrevented) return;

		_this._element.style.height = `${this._element.getBoundingClientRect().height}px`;
		reflow(_this._element);

		_this._element.classList.add(CLASS_NAME_COLLAPSING);
		_this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

		for (const trigger of _this._triggerArray) {
			const element = Selectors.getElementFromSelector(trigger);

			if (element && !_this._isShown(element)) {
				_this._addAriaAndCollapsedClass([trigger], false);
			}
		}

		_this._isTransitioning = true

		const complete = () => {
			_this._isTransitioning = false;
			_this._element.classList.remove(CLASS_NAME_COLLAPSING);
			_this._element.classList.add(CLASS_NAME_COLLAPSE);
			EventHandler.trigger(_this._element, EVENT_KEY_HIDDEN);
		}

		_this._element.style.height = '';
		_this._queueCallback(complete, _this._element, true);
	}

	dispose() {
		super.dispose();
	}

	_isShown(element = this._element) {
		return element.classList.contains(CLASS_NAME_SHOW);
	}

	_addAriaAndCollapsedClass(triggerArray, isOpen) {
		if (!triggerArray.length) {
			return
		}

		for (const element of triggerArray) {
			this._changeStateButton(element, isOpen);
		}
	}

	_initializeChildren() {
		if (!this._params.parent) return;

		const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);

		for (const element of children) {
			const selected = Selectors.getElementFromSelector(element)

			if (selected) {
				this._addAriaAndCollapsedClass([element], this._isShown(selected))
			}
		}
	}

	_getFirstLevelChildren(selector) {
		const children = Selectors.find(CLASS_NAME_DEEPER_CHILDREN, this._params.parent);
		return Selectors.find(selector, this._params.parent).filter(element => !children.includes(element));
	}

	_changeStateButton(element, isOpen) {
		element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
		element.setAttribute('aria-expanded', isOpen);
		element.innerHTML = Manipulator.get(element, `data-${isOpen ? 'hide' : 'show'}-text`) || element.innerHTML;
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (event.target.tagName === 'A' || (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
		event.preventDefault()
	}

	Selectors.getMultipleElementsFromSelector(this).forEach(function (element) {
		VGCollapse.getOrCreateInstance(element, {toggle: false}).toggle();
	});
})

export default VGCollapse;