import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {execute, isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGToastDrag from "./vgtoast.drag";
import VGToastResize from "./vgtoast.resize";

/**
 * @constant {string} NAME - РРјСЏ РјРѕРґСѓР»СЏ.
 */
const NAME = 'toast';

/**
 * @constant {string} NAME_KEY - РџСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ РёРјС‘РЅ РґР»СЏ СЃРѕР±С‹С‚РёР№.
 */
const NAME_KEY = 'vg.toast';

/**
 * @constant {string} SELECTOR_DATA_TOGGLE - РЎРµР»РµРєС‚РѕСЂ РґР»СЏ Р°РєС‚РёРІР°С†РёРё С‡РµСЂРµР· data-Р°С‚СЂРёР±СѓС‚.
 */
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="toast"]';

/**
 * @constant {string} CLASS_NAME_OPEN - РљР»Р°СЃСЃ, РґРѕР±Р°РІР»СЏРµРјС‹Р№ Рє body РїСЂРё РѕС‚РєСЂС‹С‚РёРё Р»СЋР±РѕРіРѕ С‚РѕСЃС‚Р°.
 */
const CLASS_NAME_OPEN = 'vg-toast-open';

/**
 * @constant {string} CLASS_NAME_SHOW - РљР»Р°СЃСЃ, РїРѕРєР°Р·С‹РІР°СЋС‰РёР№, С‡С‚Рѕ С‚РѕСЃС‚ РІРёРґРёРј.
 */
const CLASS_NAME_SHOW = 'show';

/**
 * @constant {string} CLASS_NAME_SHOWN - РљР»Р°СЃСЃ, РґРѕР±Р°РІР»СЏРµРјС‹Р№ РїРѕСЃР»Рµ Р·Р°РІРµСЂС€РµРЅРёСЏ Р°РЅРёРјР°С†РёРё РїРѕСЏРІР»РµРЅРёСЏ.
 */
const CLASS_NAME_SHOWN = 'shown';

// РЎРѕР±С‹С‚РёСЏ
const EVENT_KEY_HIDE     = `${NAME_KEY}.hide`;
const EVENT_KEY_HIDDEN   = `${NAME_KEY}.hidden`;
const EVENT_KEY_SHOW     = `${NAME_KEY}.show`;
const EVENT_KEY_SHOWN    = `${NAME_KEY}.shown`;
const EVENT_KEY_LOADED   = `${NAME_KEY}.loaded`;
const EVENT_KEY_KEYDOWN_DISMISS = `keydown.dismiss.${NAME_KEY}`;
const EVENT_KEY_HIDE_PREVENTED  = `hidePrevented.${NAME_KEY}`;
const EVENT_KEY_CLICK_DATA_API  = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_POINTERDOWN_INTERACTION = `pointerdown.interaction.${NAME_KEY}`;
const EVENT_KEY_POINTERUP_INTERACTION = `pointerup.interaction.${NAME_KEY}`;
const EVENT_KEY_POINTERCANCEL_INTERACTION = `pointercancel.interaction.${NAME_KEY}`;

/**
 * @typedef {Object} ToastParams
 * @property {boolean} static - РЎРѕС…СЂР°РЅСЏС‚СЊ Р»Рё С‚РѕСЃС‚ РІ DOM РїРѕСЃР»Рµ СЃРєСЂС‹С‚РёСЏ.
 * @property {string} placement - Р Р°СЃРїРѕР»РѕР¶РµРЅРёРµ: 'top left', 'bottom center' Рё С‚.Рґ.
 * @property {boolean} autohide - РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРё СЃРєСЂС‹РІР°С‚СЊ.
 * @property {number} delay - Р—Р°РґРµСЂР¶РєР° РїРµСЂРµРґ Р°РІС‚Рѕ-СЃРєСЂС‹С‚РёРµРј (РјСЃ).
 * @property {boolean} enableClickToast - Р—Р°РєСЂС‹РІР°С‚СЊ РїРѕ РєР»РёРєСѓ РЅР° С‚РѕСЃС‚.
 * @property {boolean} enableButtonClose - Р”РѕР±Р°РІРёС‚СЊ РєРЅРѕРїРєСѓ Р·Р°РєСЂС‹С‚РёСЏ.
 * @property {boolean} keyboard - Р—Р°РєСЂС‹РІР°С‚СЊ РїРѕ Esc.
 * @property {string} theme - РўРµРјР°: 'dark', 'light' Рё С‚.Рґ.
 * @property {Object} stack - РќР°СЃС‚СЂРѕР№РєРё СЃС‚РµРєР° СѓРІРµРґРѕРјР»РµРЅРёР№.
 * @property {boolean} stack.enable - Р Р°Р·СЂРµС€РёС‚СЊ СЃС‚РµРє.
 * @property {number} stack.max - РњР°РєСЃ. РєРѕР»РёС‡РµСЃС‚РІРѕ С‚РѕСЃС‚РѕРІ РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ.
 * @property {Object} animation - РђРЅРёРјР°С†РёСЏ.
 * @property {boolean} animation.enable - Р’РєР»СЋС‡РёС‚СЊ Р°РЅРёРјР°С†РёСЋ.
 * @property {string} animation.in - РђРЅРёРјР°С†РёСЏ РІС…РѕРґР° (Animate.css).
 * @property {string} animation.out - РђРЅРёРјР°С†РёСЏ РІС‹С…РѕРґР°.
 * @property {number} animation.delay - Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ Р°РЅРёРјР°С†РёРё.
 * @property {Object} ajax - РќР°СЃС‚СЂРѕР№РєРё AJAX.
 * @property {string} ajax.route - URL РґР»СЏ Р·Р°РіСЂСѓР·РєРё.
 * @property {string} ajax.target - РЎРµР»РµРєС‚РѕСЂ РєРѕРЅС‚РµР№РЅРµСЂР°.
 * @property {string} ajax.method - HTTP-РјРµС‚РѕРґ.
 * @property {boolean} ajax.loader - РџРѕРєР°Р·С‹РІР°С‚СЊ Р»РѕР°РґРµСЂ.
 * @property {boolean} ajax.once - Р—Р°РіСЂСѓР¶Р°С‚СЊ РѕРґРёРЅ СЂР°Р·.
 * @property {boolean} ajax.output - Р’С‹РІРѕРґРёС‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚.
 */

/**
 * РџР°СЂР°РјРµС‚СЂС‹ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
 * @type {ToastParams}
 */
const defaultParams = {
	static: true,
	placement: 'bottom center',
	autohide: false,
	delay: 3000,
	enableClickToast: true,
	enableButtonClose: false,
	keyboard: true,
	theme: 'dark',
	stack: {
		enable: true,
		max: 5
	},
	drag: {
		enable: false,
		selector: '.vg-toast-wrapper',
		threshold: 4,
		resizeEdgeSize: 8,
		debug: false,
	},
	resize: {
		enable: false,
		edgeSize: 8,
		minWidth: 220,
		minHeight: 64,
		debug: false,
	},
	animation: {
		enable: true,
		in: 'animate__backInUp',
		out: 'animate__backOutDown',
		delay: 300,
	},
	ajax: {
		route: '',
		target: '',
		method: 'get',
		loader: false,
		once: false,
		output: true,
	}
};

/**
 * РљР»Р°СЃСЃ VGToast вЂ” РјРѕРґСѓР»СЊ СѓРІРµРґРѕРјР»РµРЅРёР№ (С‚РѕСЃС‚С‹)
 * РџРѕРґРґРµСЂР¶РёРІР°РµС‚ СЃС‚РµРє, Р°РЅРёРјР°С†РёРё, Р°РІС‚Рѕ-СЃРєСЂС‹С‚РёРµ, AJAX-РєРѕРЅС‚РµРЅС‚, РіРѕСЂСЏС‡РёРµ РєР»Р°РІРёС€Рё.
 */
class VGToast extends BaseModule {
	/**
	 * РЎРѕР·РґР°С‘С‚ СЌРєР·РµРјРїР»СЏСЂ VGToast
	 * @param {Element} element - HTML-СЌР»РµРјРµРЅС‚ С‚РѕСЃС‚Р°.
	 * @param {Partial<ToastParams>} params - РџРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёРµ РїР°СЂР°РјРµС‚СЂС‹.
	 */
	constructor(element, params = {}) {
		super(element, params);

		/** @private */
		this._interactionDefaults = {
			drag: {
				enable: false,
				selector: '.vg-toast-wrapper',
				threshold: 4,
				resizeEdgeSize: 8,
				debug: false,
			},
			resize: {
				enable: false,
				edgeSize: 8,
				minWidth: 220,
				minHeight: 64,
				debug: false,
			},
		};
		this._params = this._getParams(element, mergeDeepObject(defaultParams, params));
		this._dragHandler = new VGToastDrag(this._element, this._element);
		this._resizeHandler = new VGToastResize(this._element, this._element);
		this._interactionConfig = this._resolveInteractionConfig();
		this._dragHandler.setOptions(this._interactionConfig.drag);
		this._resizeHandler.setOptions(this._interactionConfig.resize);
		this._animation(this._element, VGToast.NAME_KEY, this._params.animation);
		this._dismissElement();
		this._addEventListeners();

		/** @private */
		this._timeout = null;
	}

	/**
	 * РРјСЏ РјРѕРґСѓР»СЏ
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * РџСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ РёРјС‘РЅ СЃРѕР±С‹С‚РёР№
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Р“Р»РѕР±Р°Р»СЊРЅС‹Р№ РјРµС‚РѕРґ РґР»СЏ Р±С‹СЃС‚СЂРѕРіРѕ СЃРѕР·РґР°РЅРёСЏ С‚РѕСЃС‚Р°
	 * @param {string|Array<string>} text - РўРµРєСЃС‚ РёР»Рё [Р·Р°РіРѕР»РѕРІРѕРє, С‚РµР»Рѕ].
	 * @param {Partial<ToastParams>} [params] - РџР°СЂР°РјРµС‚СЂС‹.
	 * @param {Function} [callback] - Р’С‹Р·С‹РІР°РµС‚СЃСЏ РїРѕСЃР»Рµ СЃРѕР·РґР°РЅРёСЏ.
	 * @returns {VGToast}
	 */
	static run(text, params = {}, callback) {
		return VGToast.build(text, params, callback);
	}

	/**
	 * РЎРѕР·РґР°С‘С‚ Рё РїРѕРєР°Р·С‹РІР°РµС‚ РЅРѕРІС‹Р№ С‚РѕСЃС‚
	 * @param {string|Array<string>} text - РўРµРєСЃС‚ СѓРІРµРґРѕРјР»РµРЅРёСЏ.
	 * @param {Partial<ToastParams>} [params] - РџР°СЂР°РјРµС‚СЂС‹.
	 * @param {Function} [callback] - Р’С‹Р·С‹РІР°РµС‚СЃСЏ РїРѕСЃР»Рµ РїРѕСЏРІР»РµРЅРёСЏ.
	 * @returns {VGToast}
	 */
	static build(text, params, callback) {
		const rawParams = params && typeof params === 'object' ? params : {};
		const hasAutohideParam = Object.prototype.hasOwnProperty.call(rawParams, 'autohide');
		params = mergeDeepObject(defaultParams, { static: false, autohide: true }, rawParams);
		if (params.static && !hasAutohideParam) {
			params.autohide = false;
		}

		const id = 'vg-toast-' + makeRandomString();
		const target = document.createElement('div');
		target.classList.add('vg-toast');
		target.id = id;

		// РўРµРјР°
		if (params.theme) {
			target.classList.add(`vg-toast-${params.theme}`);
		}

		// РџРѕР·РёС†РёСЏ
		if (params.placement) {
			params.placement.split(' ').forEach(cls => target.classList.add(cls));
		}

		const wrapper = document.createElement('div');
		wrapper.classList.add('vg-toast-wrapper');

		// РРєРѕРЅРєР° (РµСЃР»Рё Р·Р°РґР°РЅ С‚РёРї)
		if (params.type) {
			const icon = document.createElement('div');
			icon.classList.add('vg-toast-icon');
			wrapper.append(icon);
		}

		const content = document.createElement('div');
		content.classList.add('vg-toast-content');

		const body = document.createElement('div');
		body.classList.add('vg-toast-body');

		if (typeof text === 'string') {
			body.innerHTML = text;
			content.append(body);
		} else if (Array.isArray(text)) {
			if (text.length > 1) {
				const header = document.createElement('div');
				header.classList.add('vg-toast-header');
				header.innerHTML = text[0];
				content.append(header);
			}
			body.innerHTML = text[1];
			content.append(body);
		}

		wrapper.append(content);

		// РљРЅРѕРїРєР° Р·Р°РєСЂС‹С‚РёСЏ
		if (params.enableButtonClose) {
			const button = document.createElement('div');
			button.classList.add('vg-toast-button');
			button.innerHTML = '<button class="vg-btn-close" data-vg-dismiss="toast"></button>';
			wrapper.append(button);
		}

		target.append(wrapper);
		document.body.append(target);

		const instance = VGToast.getOrCreateInstance(target, params);
		if (params.animation) {
			instance._animation(target, VGToast.NAME_KEY, params.animation);
		}

		execute(callback, [instance]);
		instance.show();

		return instance;
	}

	/**
	 * РџРµСЂРµРєР»СЋС‡Р°РµС‚ СЃРѕСЃС‚РѕСЏРЅРёРµ (РїРѕРєР°Р·Р°С‚СЊ/СЃРєСЂС‹С‚СЊ)
	 * @param {Element} [relatedTarget] - Р­Р»РµРјРµРЅС‚, РІС‹Р·РІР°РІС€РёР№ С‚РѕСЃС‚.
	 * @returns {VGToast}
	 */
	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	/**
	 * РџРѕРєР°Р·С‹РІР°РµС‚ С‚РѕСЃС‚
	 * @param {Element} [relatedTarget] - Р­Р»РµРјРµРЅС‚, РёРЅРёС†РёРёСЂРѕРІР°РІС€РёР№ РїРѕРєР°Р·.
	 * @returns {void}
	 */
	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		this._clearTimeout();
		this._disableInteractionHandlers();

		this._params = this._getParams(relatedTarget || {}, this._params);
		this._route((status, data) => {
			EventHandler.trigger(this._element, EVENT_KEY_LOADED, { stats: status, data });
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEY_SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_SHOWN);
		this._element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		this._setPlacement();

		const completeCallBack = () => {
			this._element.classList.add(CLASS_NAME_SHOWN);
			this._toggleInteractionHandlers();
			this._syncInteractiveBounds();
			this._scheduleHide();
			EventHandler.trigger(this._element, EVENT_KEY_SHOWN, { relatedTarget });
		};

		this._queueCallback(completeCallBack, this._element, true, this._params.animation.delay);
	}

	/**
	 * РЎРєСЂС‹РІР°РµС‚ С‚РѕСЃС‚
	 * @returns {void}
	 */
	hide() {
		if (isDisabled(this._element)) return;
		this._clearTimeout();

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_SHOWN);
		this._disableInteractionHandlers();

		setTimeout(() => {
			this._element.classList.remove(CLASS_NAME_SHOW);
			if (this._params.stack.enable) {
				this._setPlacement();
			}

			const completeCallback = () => {
				if (!Selectors.find('.vg-toast.show')) {
					document.body.classList.remove(CLASS_NAME_OPEN);
				}
				EventHandler.trigger(this._element, EVENT_KEY_HIDDEN);

				if (!this._params.static) {
					this.dispose();
				}
			};

			this._queueCallback(completeCallback, this._element, false, this._params.animation.delay);
		}, this._params.animation.delay);
	}

	/**
	 * РЈРґР°Р»СЏРµС‚ С‚РѕСЃС‚ РёР· DOM Рё СЃРЅРёРјР°РµС‚ РѕР±СЂР°Р±РѕС‚С‡РёРєРё
	 * @override
	 */
	dispose() {
		this._clearTimeout();
		this._disableInteractionHandlers();
		if (!this._params.static) {
			this._element.remove();
		}
		super.dispose();
	}

	/**
	 * РЈСЃС‚Р°РЅР°РІР»РёРІР°РµС‚ С‚Р°Р№РјРµСЂ РЅР° СЃРєСЂС‹С‚РёРµ
	 * @private
	 */
	_scheduleHide() {
		this._clearTimeout();
		if (!this._params.autohide) return;

		this._timeout = setTimeout(() => this.hide(), this._params.delay);
	}

	/**
	 * РџСЂРѕРІРµСЂСЏРµС‚, РїРѕРєР°Р·Р°РЅ Р»Рё С‚РѕСЃС‚
	 * @private
	 * @returns {boolean}
	 */
	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Р’РѕР·РІСЂР°С‰Р°РµС‚ СЃРїРёСЃРѕРє Р°РєС‚РёРІРЅС‹С… С‚РѕСЃС‚РѕРІ СЃ РІРµСЂС‚РёРєР°Р»СЊРЅС‹РјРё СЃРјРµС‰РµРЅРёСЏРјРё
	 * РЈС‡РёС‚С‹РІР°РµС‚ СЃС‚РµРє Рё РјР°РєСЃРёРјР°Р»СЊРЅРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ
	 * @private
	 * @returns {Array<{el: Element, top: number}>}
	 */
	_enableStack() {
		const placement = this._params.placement;
		const isTop = placement.includes('top');
		const isBottom = !isTop; // РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ СЃРЅРёР·Сѓ

		// Р¤РёР»СЊС‚СЂСѓРµРј С‚РѕСЃС‚С‹ СЃ С‚Р°РєРёРј Р¶Рµ РЅР°РїСЂР°РІР»РµРЅРёРµРј (top РёР»Рё bottom)
		const stackClass = isTop ? 'top' : 'bottom';
		const elmsShown = Selectors.findAll(`.vg-toast.show.${stackClass}`)
			.filter(el => {
				const instance = VGToast.getInstance(el);
				return instance?._params.stack.enable;
			});

		if (!this._params.stack.enable) {
			// РЎРєСЂС‹РІР°РµРј РґСЂСѓРіРёРµ С‚РѕСЃС‚С‹, РµСЃР»Рё СЃС‚РµРє РІС‹РєР»СЋС‡РµРЅ
			elmsShown
				.filter(el => el !== this._element)
				.forEach(el => VGToast.getInstance(el).hide());
			return [{ el: this._element, top: 0 }];
		}

		// РћРіСЂР°РЅРёС‡РёРІР°РµРј РїРѕ max
		if (elmsShown.length >= this._params.stack.max) {
			const excess = elmsShown.slice(0, elmsShown.length - this._params.stack.max + 1);
			excess.forEach(el => VGToast.getInstance(el).hide());
		}

		// Р’С‹С‡РёСЃР»СЏРµРј СЃРјРµС‰РµРЅРёРµ (РїРѕ РІС‹СЃРѕС‚Рµ)
		const prevEls = elmsShown.filter(el => el !== this._element);
		const offset = prevEls.reduce((sum, el) => sum + el.clientHeight, 0);

		return elmsShown.includes(this._element)
			? elmsShown.map((el, index) => {
				const heightSum = elmsShown.slice(0, index).reduce((sum, e) => sum + e.clientHeight, 0);
				return { el, top: heightSum };
			})
			: [{ el: this._element, top: offset }];
	}

	/**
	 * РЈСЃС‚Р°РЅР°РІР»РёРІР°РµС‚ РїРѕР·РёС†РёСЋ С‚РѕСЃС‚РѕРІ СЃ СѓС‡С‘С‚РѕРј СЃС‚РµРєР°
	 * @private
	 */
	_setPlacement() {
		const stackItems = this._enableStack();
		const isTop = this._params.placement.includes('top');

		const stackClass = isTop ? 'top' : 'bottom';
		const visibleStack = Selectors.findAll(`.vg-toast.show.${stackClass}`)
			.filter(el => {
				const instance = VGToast.getInstance(el);
				return instance?._params.stack.enable;
			});
		const elms = visibleStack.length ? visibleStack : stackItems.map(item => item.el);
		let offset = 0;

		elms.forEach((el) => {
			const instance = VGToast.getInstance(el);
			const placement = instance?._params.placement || this._params.placement;
			const isCenter = placement.includes('center');
			const isLeft = placement.includes('left');
			const isRight = placement.includes('right');
			const style = el.style;
			style.left = '';
			style.right = '';
			style.top = '';
			style.bottom = '';
			style.transform = '';
			style.translate = ''; // <-- РІР°Р¶РЅРѕ: СЃР±СЂР°СЃС‹РІР°РµРј translate РѕС‚РґРµР»СЊРЅРѕ

			if (isCenter) {
				style.left = '50%';
				style.translate = '-50% 0'; // <-- РІРјРµСЃС‚Рѕ transform: translateX(-50%)
			} else if (isLeft) {
				style.left = '0';
			} else if (isRight) {
				style.right = '0';
			} else {
				// РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ: С†РµРЅС‚СЂРёСЂРѕРІР°РЅРёРµ
				style.left = '50%';
				style.translate = '-50% 0';
			}

			if (isTop) {
				style.top = offset + 'px';
			} else {
				style.bottom = offset + 'px';
			}

			offset += el.offsetHeight;
		});
	}

	/**
	 * РћС‡РёС‰Р°РµС‚ С‚Р°Р№РјРµСЂ
	 * @private
	 */
	_toggleInteractionHandlers() {
		this._interactionConfig = this._resolveInteractionConfig();
		this._dragHandler.setOptions(this._interactionConfig.drag);
		this._resizeHandler.setOptions(this._interactionConfig.resize);

		if (this._interactionConfig.drag.enable) {
			this._dragHandler.enable();
		} else {
			this._dragHandler.disable();
		}

		if (this._interactionConfig.resize.enable) {
			this._resizeHandler.enable();
		} else {
			this._resizeHandler.disable();
		}
	}

	_disableInteractionHandlers() {
		this._dragHandler.disable();
		this._resizeHandler.disable();
	}

	_syncInteractiveBounds() {
		if (this._interactionConfig.resize.enable) {
			this._resizeHandler.syncToViewport();
		}

		if (this._interactionConfig.drag.enable) {
			this._dragHandler.syncPosition();
		}
	}

	_resolveInteractionConfig() {
		return {
			drag: this._normalizeInteractionParams(this._params.drag, this._interactionDefaults.drag),
			resize: this._normalizeInteractionParams(this._params.resize, this._interactionDefaults.resize),
		};
	}

	_normalizeInteractionParams(paramsValue, defaults) {
		if (typeof paramsValue === 'boolean') {
			return {...defaults, enable: paramsValue};
		}

		if (paramsValue && typeof paramsValue === 'object') {
			const hasEnable = Object.prototype.hasOwnProperty.call(paramsValue, 'enable');
			return {
				...defaults,
				...paramsValue,
				enable: hasEnable ? Boolean(paramsValue.enable) : true,
			};
		}

		return {...defaults};
	}

	_clearTimeout() {
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	}

	/**
	 * РќР°Р·РЅР°С‡Р°РµС‚ РѕР±СЂР°Р±РѕС‚С‡РёРєРё СЃРѕР±С‹С‚РёР№
	 * @private
	 */
	_addEventListeners() {
		// Р—Р°РєСЂС‹С‚РёРµ РїРѕ Esc
		if (this._params.keyboard) {
			EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
				if (event.key === 'Escape' && this._isShown()) {
					this.hide();
				}
			});
		}

		// Р—Р°РєСЂС‹С‚РёРµ РїРѕ РєР»РёРєСѓ РЅР° С‚РѕСЃС‚
		if (this._params.enableClickToast) {
			this._element.classList.add('vg-toast-pointer');
			EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, `#${this._element.id}`, () => {
				this.hide();
			});
		}

		EventHandler.on(this._element, EVENT_KEY_POINTERDOWN_INTERACTION, () => {
			this._clearTimeout();
		});

		const resumeHide = () => {
			if (this._isShown()) {
				this._scheduleHide();
			}
		};

		EventHandler.on(this._element, EVENT_KEY_POINTERUP_INTERACTION, resumeHide);
		EventHandler.on(this._element, EVENT_KEY_POINTERCANCEL_INTERACTION, resumeHide);
	}
}

// РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРµ Р·Р°РєСЂС‹С‚РёРµ РїРѕ data-vg-dismiss
dismissTrigger(VGToast);

/**
 * Р РµР°Р»РёР·Р°С†РёСЏ Data API
 */
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getElementFromSelector(this);
	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}
	if (isDisabled(this)) return;

	this.setAttribute('aria-expanded', 'true');
	EventHandler.one(target, EVENT_KEY_HIDDEN, () => {
		this.setAttribute('aria-expanded', 'false');
	});

	const data = VGToast.getOrCreateInstance(target);
	data.toggle(this);
});

export default VGToast;

