import BaseModule from "../../base-module";
import {mergeDeepObject, getElement, isDisabled, isVisible} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'spy';
const NAME_KEY = 'vg.spy';
const EVENT_KEY = `.${NAME_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_ACTIVATE = `activate${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DROPDOWN_ITEM = 'vg-dropdown-item'
const CLASS_NAME_ACTIVE = 'active'

const SELECTOR_DATA_SPY = '[data-vg-toggle="spy"]'
const SELECTOR_TARGET_LINKS = '[href]'
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group'
const SELECTOR_NAV_LINKS = '.nav-link'
const SELECTOR_NAV_ITEMS = '.nav-item'
const SELECTOR_LIST_ITEMS = '.list-group-item'
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`
const SELECTOR_DROPDOWN = '.vg-dropdown'
const SELECTOR_DROPDOWN_TOGGLE = '[data-vg-toggle="dropdown"]'


class VGSpy extends BaseModule {
	constructor(element, params) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			offset: null, // TODO: v6 @deprecated, keep it for backwards compatibility reasons
			rootMargin: '0px 0px -25%',
			smoothScroll: true,
			target: this._element,
			threshold: [0.1, 0.5, 1]
		}, params));

		this._targetLinks = new Map()
		this._observableSections = new Map()
		this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element
		this._activeTarget = null
		this._observer = null
		this._previousScrollData = {
			visibleEntryTop: 0,
			parentScrollTop: 0
		}
		this._params = this._configAfterMerge(this._params);
		console.log(this._params)

		this.refresh();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	refresh() {
		this._initializeTargetsAndObservables()
		this._maybeEnableSmoothScroll()

		if (this._observer) {
			this._observer.disconnect()
		} else {
			this._observer = this._getNewObserver()
		}

		for (const section of this._observableSections.values()) {
			this._observer.observe(section)
		}
	}

	dispose() {
		this._observer.disconnect()
		super.dispose()
	}

	_configAfterMerge(param) {
		param.target = getElement(param.target) || document.body
		param.rootMargin = param.offset ? `${param.offset}px 0px -30%` : param.rootMargin

		if (typeof param.threshold === 'string') {
			param.threshold = param.threshold.split(',').map(value => Number.parseFloat(value))
		}

		return param
	}

	_maybeEnableSmoothScroll() {
		if (!this._params.smoothScroll) {
			return
		}

		EventHandler.off(this._params.target, EVENT_CLICK)

		EventHandler.on(this._params.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
			const observableSection = this._observableSections.get(event.target.hash)
			if (observableSection) {
				event.preventDefault()
				const root = this._rootElement || window
				const height = observableSection.offsetTop - this._element.offsetTop
				if (root.scrollTo) {
					root.scrollTo({ top: height, behavior: 'smooth' })
					return
				}
				root.scrollTop = height
			}
		})
	}

	_getNewObserver() {
		const options = {
			root: this._rootElement,
			threshold: this._params.threshold,
			rootMargin: this._params.rootMargin
		}

		return new IntersectionObserver(entries => this._observerCallback(entries), options)
	}

	_observerCallback(entries) {
		const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);

		const activate = entry => {
			this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
			this._process(targetElement(entry));
		}

		const parentScrollTop = (this._rootElement || document.documentElement).scrollTop
		const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop
		this._previousScrollData.parentScrollTop = parentScrollTop

		for (const entry of entries) {
			if (!entry.isIntersecting) {
				this._activeTarget = null
				this._clearActiveClass(targetElement(entry))

				continue
			}

			const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop
			if (userScrollsDown && entryIsLowerThanPrevious) {
				activate(entry)
				if (!parentScrollTop) {
					return
				}

				continue
			}

			if (!userScrollsDown && !entryIsLowerThanPrevious) {
				activate(entry)
			}
		}
	}

	_initializeTargetsAndObservables() {
		this._targetLinks = new Map();
		this._observableSections = new Map();

		const targetLinks = Selectors.findAll(SELECTOR_TARGET_LINKS, this._params.target);

		for (const anchor of targetLinks) {
			if (!anchor.hash || isDisabled(anchor)) {
				continue
			}

			const observableSection = Selectors.find(decodeURI(anchor.hash));

			if (isVisible(observableSection)) {
				this._targetLinks.set(decodeURI(anchor.hash), anchor)
				this._observableSections.set(anchor.hash, observableSection)
			}
		}
	}

	_process(target) {
		if (this._activeTarget === target) {
			return
		}

		this._clearActiveClass(this._params.target)
		this._activeTarget = target
		target.classList.add(CLASS_NAME_ACTIVE)
		this._activateParents(target)

		EventHandler.trigger(this._element, EVENT_ACTIVATE, { relatedTarget: target })
	}

	_activateParents(target) {
		if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
			Selectors.find(SELECTOR_DROPDOWN_TOGGLE, target.closest(SELECTOR_DROPDOWN))
				.classList.add(CLASS_NAME_ACTIVE)
			return
		}

		for (const listGroup of Selectors.parents(target, SELECTOR_NAV_LIST_GROUP)) {
			for (const item of Selectors.prev(listGroup, SELECTOR_LINK_ITEMS)) {
				item.classList.add(CLASS_NAME_ACTIVE)
			}
		}
	}

	_clearActiveClass(parent) {
		parent.classList.remove(CLASS_NAME_ACTIVE)

		const activeNodes = Selectors.findAll(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent);
		for (const node of activeNodes) {
			node.classList.remove(CLASS_NAME_ACTIVE)
		}
	}
}

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const spy of Selectors.findAll(SELECTOR_DATA_SPY)) {
		VGSpy.getOrCreateInstance(spy)
	}
})

export default VGSpy;