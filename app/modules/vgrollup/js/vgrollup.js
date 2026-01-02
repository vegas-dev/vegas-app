import BaseModule from "../../base-module";
import { execute, isDisabled, mergeDeepObject } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'rollup';
const NAME_KEY = 'vg.rollup';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_HIDE = 'vg-rollup-display--none';
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="rollup"]';

const EVENT_KEY_HIDE = `${NAME_KEY}.hide`;
const EVENT_KEY_SHOW = `${NAME_KEY}.show`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;

class VGRollup extends BaseModule {
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
				enabled: true,
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

		this.total = 0;
		this.count = 0;
		this.offset = 0;
		this.isOffset = false;

		this.build();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static toggle(target, relatedTarget) {
		const instance = VGRollup.getOrCreateInstance(target);
		const isShown = instance.isShow();

		if (!isShown) {
			instance._show(relatedTarget);
		} else {
			instance._hide(relatedTarget);
		}
	}

	_show(relatedTarget) {
		this._element.classList.add(CLASS_NAME_SHOW);
		relatedTarget.innerHTML = this._params.button.less;
		relatedTarget.setAttribute("aria-expanded", "true");

		if (this.offset > 0) {
			relatedTarget.innerHTML = this.isOffset ? this._params.button.more : this._params.button.less;
			relatedTarget.setAttribute("aria-expanded", this.isOffset ? "true" : "false");
		}

		this.switch(this._element, false);
		EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
	}

	_hide(relatedTarget) {
		let buttonText = this._params.button.more;
		const isShowNum = this._params.number;

		if (isShowNum) {
			const sum = this.total - this.count;
			if (sum > 0) {
				buttonText += this._params.more + sum;
			}
		}

		this._element.classList.remove(CLASS_NAME_SHOW);
		relatedTarget.setAttribute("aria-expanded", "false");
		relatedTarget.textContent = buttonText;

		this.switch(this._element, true);
		EventHandler.trigger(this._element, EVENT_KEY_HIDE, { relatedTarget });
	}

	build(el = null, isButtonAppend = true) {
		const element = el || this._element;
		const selfHeight = element.clientHeight;
		const setHeight = this._params.height || (selfHeight / 2);

		const {
			fade,
			transition,
			button: enableButton,
			number: showNum,
			content,
			elements: elementClass,
			cnt,
			ellipsis: ellipsisCfg
		} = this._params;

		const isEllipsis = ellipsisCfg.line !== null;
		const isButton = enableButton && isButtonAppend;

		element.classList.add(this.classes.container);

		if (!isButtonAppend) {
			this.switch(element);
			return;
		}

		if (content === 'text' && selfHeight > setHeight) {
			this._setupTextContent(element, setHeight, fade, transition, isEllipsis, ellipsisCfg.line, isButton, showNum);
		} else if (content === 'elements') {
			this._setupElementsContent(element, elementClass, cnt, fade, transition, isEllipsis, isButton, showNum);
		}
	}

	_setupTextContent(element, height, fade, transition, isEllipsis, line, isButton, showNum) {
		element.classList.add(this.classes.hidden);
		element.style.height = height + "px";

		if (isEllipsis && line) {
			element.classList.add(this.classes.ellipsis);
			element.style.webkitLineClamp = line;
		} else if (isEllipsis) {
			console.error("Переменная [data-line] или параметр[line] не должны быть пустыми");
		}

		if (transition) element.classList.add(this.classes.transition);
		if (fade) element.classList.add(this.classes.fade);

		if (isButton) this._createButton(element, '', showNum);
	}

	_setupElementsContent(element, elementClass, cnt, fade, transition, isEllipsis, isButton, showNum) {
		const items = element.querySelectorAll('.' + elementClass);
		this.total = items.length;
		this.count = cnt;

		items.forEach((item, index) => {
			if (index >= cnt) {
				item.classList.add(CLASS_NAME_HIDE);
			}
		});

		const shouldShowButton = isButton && items.length > cnt;

		if (isEllipsis) element.classList.add(this.classes.ellipsis);
		if (transition) element.classList.add(this.classes.transition);
		if (fade) element.classList.add(this.classes.fade);

		if (shouldShowButton) {
			const sum = this.total - this.count;
			const textShowNum = showNum && sum > 0 ? this._params.more + sum : '';
			this._createButton(element, textShowNum, false);
		}
	}

	_createButton(element, textNum = '', showNum = false) {
		if (!element.id) {
			element.id = `vg-rollup-${Math.random().toString(36).substr(2, 9)}`;
		}

		const btnTextMore = this._params.button.more;
		const btnHTML = `<div class="${this.classes.button}">
            <a href="#" aria-expanded="false" data-vg-toggle="rollup" data-vg-target="#${element.id}">
                ${btnTextMore}${textNum}
            </a>
        </div>`;

		element.insertAdjacentHTML("afterend", btnHTML);
	}

	switch(el, switcher = false) {
		if (switcher && !this.isOffset) {
			const { content } = this._params;
			const selfHeight = el.clientHeight;
			const setHeight = this._params.height || selfHeight / 2;

			if (content === 'text' && selfHeight > setHeight) {
				el.classList.add(this.classes.hidden);
				el.style.height = setHeight + "px";

				if (this._params.ellipsis.line) {
					el.classList.add(this.classes.ellipsis);
					el.style.webkitLineClamp = this._params.ellipsis.line;
				}

				if (this._params.fade) el.classList.add(this.classes.fade);
				if (this._params.transition) el.classList.add(this.classes.transition);
			} else if (content === 'elements') {
				const items = el.querySelectorAll('.' + this._params.elements);
				items.forEach((item, index) => {
					if (index >= this.count) {
						item.classList.add(CLASS_NAME_HIDE);
					}
				});
			}

			el.classList.add(this.classes.container);
		} else {
			const { hidden, ellipsis, fade } = this.classes;
			el.classList.remove(hidden, ellipsis, fade);
			el.removeAttribute("style");

			if (this._params.content === 'elements') {
				const items = Selectors.findAll('.' + this._params.elements, el);
				items.forEach(item => item.classList.remove(CLASS_NAME_HIDE));
			}
		}
	}

	isShow() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	static init(element, params = {}, callback) {
		const instance = VGRollup.getOrCreateInstance(element, params);
		execute(callback, [instance]);
	}
}

/**
 * Data API implementation
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}

	if (isDisabled(this)) return;

	const target = Selectors.getElementFromSelector(this);
	if (!target) return;

	VGRollup.toggle(target, this);
});

export default VGRollup;