import BaseModule from "../../base-module";
import {execute, isDisabled, mergeDeepObject} from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'rollup';
const NAME_KEY = 'vg.rollup';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_HIDE = 'vg-rollup-display--none';
const SELECTOR_DATA_TOGGLE= '[data-vg-toggle="rollup"]'

const EVENT_KEY_HIDE   = `${NAME_KEY}.hide`;
const EVENT_KEY_SHOW   = `${NAME_KEY}.show`;

const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGRollup  extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			content: 'text',
			cnt: 0,
			fade: true,
			transition: false,
			number: false,
			height: 0,
			ellipsis: {
				line: null
			},
			more: ' еще ',
			button: {
				enable: true,
				more: "Показать",
				less: "Свернуть"
			}
		}, params));

		this.classes = {
			container: 'vg-rollup',
			hidden: "vg-rollup-content--hidden",
			fade: "vg-rollup-content--fade",
			ellipsis: "vg-rollup-content--ellipsis",
			button: "vg-rollup-content--button",
			transition: "vg-rollup-content--transition"
		};

		this.total       = 0;
		this.count       = 0;

		this.build();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	static toggle(target, relatedTarget) {
		const instance = VGRollup.getOrCreateInstance(target);
		let isShown = instance.isShow();

		if (!isShown) {
			instance._element.classList.add(CLASS_NAME_SHOW);
			relatedTarget.innerHTML = instance._params.button.less;
			relatedTarget.setAttribute("aria-expanded", true);

			if (instance.offset > 0) {
				if (instance.isOffset) {
					relatedTarget.innerHTML = instance._params.button.more;
					relatedTarget.setAttribute("aria-expanded", true);
				} else {
					relatedTarget.innerHTML = instance._params.button.less;
					relatedTarget.setAttribute("aria-expanded", false);
				}
			}

			instance.switch(instance._element, false);
			EventHandler.trigger(instance._element, EVENT_KEY_SHOW, { relatedTarget });
		} else {
			let textShowNum = '',
				isShowNum = instance._params.number;


			if (isShowNum) {
				let sum = (instance.total) - (instance.count);

				if (sum > 0) {
					textShowNum = instance._params.more + sum;
				}
			}

			if (instance.isOffset) {
				relatedTarget.setAttribute("aria-expanded", true);
			} else {
				relatedTarget.setAttribute("aria-expanded", false);
			}

			instance._element.classList.remove(CLASS_NAME_SHOW);
			relatedTarget.innerHTML = instance._params.button.more + textShowNum;
			instance.switch(instance._element, true);

			EventHandler.trigger(instance._element, EVENT_KEY_HIDE, { relatedTarget });
		}
	}

	build(el = null, isButtonAppend = true) {
		let _this = this,
			element = el || _this._element,
			self_height = element.clientHeight, set_height = _this._params.height || (self_height / 2);

		element.classList.add(_this.classes.container)

		let isFade =        _this._params.fade,
			isTransition =  _this._params.transition,
			isEllipsis =    _this._params.ellipsis.line !== null,
			isButton =      _this._params.button.enable,
			isShowNum =     _this._params.number;

		if (!isButtonAppend) _this.switch(element);

		if (self_height > set_height && _this._params.content === 'text') {
			element.classList.add(_this.classes.hidden);
			element.style.height = set_height + "px";

			ellipsis();
			transition();
			fade();
			button();
		} else if (_this._params.content === 'elements') {
			let elementClass = _this._params.elements || 'item',
				items = element.querySelectorAll('.' + elementClass),
				cnt = _this._params.cnt || 5,
				i = 1;

			_this.total = items.length;
			_this.count = cnt;

			for (const item of items) {
				if (i > cnt) {
					item.classList.add(CLASS_NAME_HIDE)
				}

				i++;
			}

			if (isButton === true) isButton = (i - 1) > cnt;

			ellipsis();
			transition();
			fade();
			button();
		}

		function ellipsis() {
			if (isEllipsis) {
				let line = _this._params.ellipsis.line;
				isFade = false;

				if (line) {
					element.classList.add(_this.classes.ellipsis);
					element.style.webkitLineClamp = line;
				} else {
					console.log("Переменная [data-line] или параметр[line] не должны быть пустыми");
				}
			}
		}

		// TODO no work
		function transition() {
			if (isTransition) {
				element.classList.add(_this.classes.transition);
			}
		}

		function fade() {
			if (isFade) {
				element.classList.add(_this.classes.fade);
			}
		}

		function button() {
			if (isButtonAppend) {
				element.setAttribute("id", element.id);

				if (isButton) {
					let textShowNum = '';

					if (isShowNum) {
						let sum = (_this.total) - (_this.count);

						if (sum > 0) {
							textShowNum = _this._params.more + sum;
						}
					}

					let btnTextMore = _this._params.button.more;
					element.insertAdjacentHTML("afterend", "<div  class=\"" + _this.classes.button + "\"><a href=\"#\" aria-expanded=\"false\" data-vg-toggle=\"rollup\" data-vg-target=\"#" + element.id + "\">" + btnTextMore + textShowNum + "</a></div>");
				}
			}
		}
	}

	switch(el, switcher = false) {
		if (switcher && !this.isOffset) {
			this.build(el, false);

			if (this._params.offset > 0) {
				this.offset = this._params.offset;
				if (this.offset > 0) this.isOffset = true;
			}
		} else {
			el.classList.remove(this.classes.hidden);
			el.classList.remove(this.classes.ellipsis);
			el.classList.remove(this.classes.fade);

			el.removeAttribute("style");

			if (this._params.content === 'elements') {
				let className = this._params.elements;

				let items = Selectors.findAll('.' + className, el);

				if (items.length) {
					items.forEach((item) => item.classList.remove(CLASS_NAME_HIDE))
				}
			}
		}
	}

	isShow() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 * @param callback
	 */
	static init(element, params = {}, callback) {
		const instance = VGRollup.getOrCreateInstance(element, params);
		execute(callback, [instance]);
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getElementFromSelector(this);
	if (!target) return;

	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault()
	}

	if (isDisabled(this)) {
		return
	}

	VGRollup.toggle(target, this);
});

export default VGRollup;