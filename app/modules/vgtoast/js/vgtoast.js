import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {isDisabled, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'toast';
const NAME_KEY = 'vg.toast';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="toast"]';

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_OPEN = 'vg-toast-open';

const EVENT_KEY_HIDE    = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN  = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW    = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN   = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED  = `${NAME_KEY}.loaded`;

const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGToast extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			animation: {
				enable: true,
				in: 'animate__fadeInUp',
				out: 'animate__fadeOutDown',
				delay: 800,
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
			}
		}, params));

		this._addEventListeners();
		this._dismissElement();

		this._params.animation.delay = !this._params.animation.enable ? 0 : this._params.animation.delay;
		this._animation(this._element, VGToast.NAME_KEY, this._params.animation);
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	init(element) {
		//this._setPlacement();
	}

	build() {

	}

	toggle(relatedTarget) {
		return !this._isShown() ? this.show(relatedTarget) : this.hide();
	}

	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		this._params = this._getParams(relatedTarget, this._params);
		this._route(function (status, data) {
			EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget })
		if (showEvent.defaultPrevented) return;

		this._element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		this._setPlacement();

		const completeCallBack = () => {
			this._element.classList.add(CLASS_NAME_SHOW);
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		}
		this._queueCallback(completeCallBack, this._element, true, 50);
	}

	hide() {
		if (isDisabled(this._element)) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		setTimeout(() => {
			this._element.setAttribute('aria-expanded', false);
			this._element.classList.remove(CLASS_NAME_SHOW);

			const completeCallback = () => {
				document.body.classList.remove(CLASS_NAME_OPEN);
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);
			}
			this._queueCallback(completeCallback, this._element, true);
		}, this._params.animation.delay);
	}

	dispose() {
		super.dispose();
	}

	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	_setPlacement() {
		const elSizes = [this._element.clientWidth, this._element.clientHeight];

		let isPlacementClassTop = this._element.classList.contains('top'),
			isPlacementClassBottom = this._element.classList.contains('bottom'),
			isPlacementClassLeft = this._element.classList.contains('left'),
			isPlacementClassRight = this._element.classList.contains('right'),
			isPlacementClassCenter = this._element.classList.contains('center');

		if (isPlacementClassCenter) {
			if (isPlacementClassLeft) {
				this._element.style.left = 0;
				this._element.style.top = 'calc(50% - ('+ elSizes[1] +'px) / 2)';
			} else if (isPlacementClassRight) {
				this._element.style.right = 0;
				this._element.style.top = 'calc(50% - ('+ elSizes[1] +'px) / 2)';
			} else if (isPlacementClassBottom) {
				this._element.style.left = 'calc(50% - ('+ elSizes[0] +'px) / 2)';
				this._element.style.bottom = 0;
			} else if (isPlacementClassTop) {
				this._element.style.left = 'calc(50% - ('+ elSizes[0] +'px) / 2)';
				this._element.style.top = 0;
			} else {
				this._element.style.left = 'calc(50% - ('+ elSizes[0] +'px) / 2)';
				this._element.style.top = 'calc(50% - ('+ elSizes[1] +'px) / 2)';
			}
		} else {
			if (isPlacementClassLeft) this._element.style.left = 0;
			if (isPlacementClassBottom) this._element.style.bottom = 0;
			if (isPlacementClassTop) this._element.style.top = 0;
			if (isPlacementClassRight) this._element.style.right = 0;
		}
	}

	_addEventListeners() {
		EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
			if (event.key !== 'Escape') return;

			if (this._params.keyboard) {
				this.hide();
				return;
			}

			EventHandler.trigger(this._element, EVENT_KEY_HIDE_PREVENTED)
		});
	}
}

dismissTrigger(VGToast);

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getElementFromSelector(this);

	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) {
		return
	}

	this.setAttribute('aria-expanded', true);
	EventHandler.one(target, EVENT_KEY_HIDDEN, () => {
		this.setAttribute('aria-expanded', false);
	});

	const data = VGToast.getOrCreateInstance(target);
	data.toggle(this);
});

export default VGToast;
