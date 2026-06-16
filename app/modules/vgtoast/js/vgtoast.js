import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger, getSVG} from "../../module-fn";
import Sanitize from "../../../utils/js/components/sanitize";
import {execute, isDisabled, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGToastDrag from "./vgtoast.drag";
import VGToastResize from "./vgtoast.resize";

/**
 * @constant {string} NAME - Имя модуля.
 */
const NAME = 'toast';

/**
 * @constant {string} NAME_KEY - Пространство имён для событий.
 */
const NAME_KEY = 'vg.toast';

/**
 * @constant {string} SELECTOR_DATA_TOGGLE - Селектор для активации через data-атрибут.
 */
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="toast"]';

/**
 * @constant {string} CLASS_NAME_OPEN - Класс, добавляемый к body при открытии любого тоста.
 */
const CLASS_NAME_OPEN = 'vg-toast-open';

/**
 * @constant {string} CLASS_NAME_SHOW - Класс, показывающий, что тост видим.
 */
const CLASS_NAME_SHOW = 'show';

/**
 * @constant {string} CLASS_NAME_SHOWN - Класс, добавляемый после завершения анимации появления.
 */
const CLASS_NAME_SHOWN = 'shown';
const EFFECT_CLASS_PREFIX = 'vg-toast-effect-';
const EFFECT_PRESET_MAP = {
	none: '',
	fade: `${EFFECT_CLASS_PREFIX}fade`,
	zoom: `${EFFECT_CLASS_PREFIX}zoom`,
	blur: `${EFFECT_CLASS_PREFIX}blur`,
	'slide-up': `${EFFECT_CLASS_PREFIX}slide-up`,
	'slide-down': `${EFFECT_CLASS_PREFIX}slide-down`,
};

// События
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
const TOAST_ICON_MAP = {
	success: 'success',
	error: 'danger',
	warning: 'warning',
	info: 'info',
};

/**
 * @typedef {Object} ToastParams
 * @property {boolean} static - Сохранять ли тост в DOM после скрытия.
 * @property {string} placement - Расположение: 'top left', 'bottom center' и т.д.
 * @property {boolean} autohide - Автоматически скрывать.
 * @property {number} delay - Задержка перед авто-скрытием (мс).
 * @property {boolean} enableClickToast - Закрывать по клику на тост.
 * @property {boolean} enableButtonClose - Добавить кнопку закрытия.
 * @property {boolean} keyboard - Закрывать по Esc.
 * @property {string} theme - Тема: 'dark', 'light' и т.д.
 * @property {('success'|'error'|'warning'|'info'|null)} type - Тип уведомления для вывода иконки.
 * @property {Object} stack - Настройки стека уведомлений.
 * @property {boolean} stack.enable - Разрешить стек.
 * @property {number} stack.max - Макс. количество тостов одновременно.
 * @property {Object} animation - Анимация.
 * @property {boolean} animation.enable - Включить анимацию.
 * @property {string} animation.in - Анимация входа (Animate.css).
 * @property {string} animation.out - Анимация выхода.
 * @property {number} animation.delay - Длительность анимации.
 * @property {string|string[]} animation.effect - Доп. визуальный эффект (preset или css-класс).
 * @property {Object} ajax - Настройки AJAX.
 * @property {string} ajax.route - URL для загрузки.
 * @property {string} ajax.target - Селектор контейнера.
 * @property {string} ajax.method - HTTP-метод.
 * @property {boolean} ajax.loader - Показывать лоадер.
 * @property {boolean} ajax.once - Загружать один раз.
 * @property {boolean} ajax.output - Выводить результат.
 */

/**
 * Параметры по умолчанию
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
	type: null,
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
		effect: 'none',
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
 * Класс VGToast — модуль уведомлений (тосты)
 * Поддерживает стек, анимации, авто-скрытие, AJAX-контент, горячие клавиши.
 */
class VGToast extends BaseModule {
	/**
	 * Создаёт экземпляр VGToast
	 * @param {Element} element - HTML-элемент тоста.
	 * @param {Partial<ToastParams>} params - Пользовательские параметры.
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
		this._applyAnimationEffects();
		this._dismissElement();
		this._addEventListeners();

		/** @private */
		this._timeout = null;
		this._hideTimeout = null;
		this._isHiding = false;
	}

	/**
	 * Имя модуля
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Пространство имён событий
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Глобальный метод для быстрого создания тоста
	 * @param {string|Array<string>} text - Текст или [заголовок, тело].
	 * @param {Partial<ToastParams>} [params] - Параметры.
	 * @param {Function} [callback] - Вызывается после создания.
	 * @returns {VGToast}
	 */
	static run(text, params = {}, callback) {
		return VGToast.build(text, params, callback);
	}

	/**
	 * Создаёт и показывает новый тост
	 * @param {string|Array<string>} text - Текст уведомления.
	 * @param {Partial<ToastParams>} [params] - Параметры.
	 * @param {Function} [callback] - Вызывается после появления.
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

		// Тема
		if (params.theme) {
			target.classList.add(`vg-toast-${params.theme}`);
		}

		// Позиция
		if (params.placement) {
			params.placement.split(' ').forEach(cls => target.classList.add(cls));
		}

		const wrapper = document.createElement('div');
		wrapper.classList.add('vg-toast-wrapper');

		// Иконка (если задан тип)
		if (params.type) {
			const iconName = TOAST_ICON_MAP[params.type];
			const iconSvg = iconName ? getSVG(iconName) : '';

			if (iconSvg) {
				const icon = document.createElement('div');
				icon.classList.add('vg-toast-icon');
				const safeIconSvg = Sanitize.toSafeHtmlString(iconSvg);
				const fragment = document.createRange().createContextualFragment(safeIconSvg);
				const svgElement = fragment.firstElementChild;

				if (svgElement) {
					icon.append(svgElement);
				}
				wrapper.append(icon);
			}
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

		// Кнопка закрытия
		if (params.enableButtonClose) {
			target.classList.add('vg-toast-has-button');
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
			instance._applyAnimationEffects();
		}

		execute(callback, [instance]);
		instance.show();

		return instance;
	}

	/**
	 * Переключает состояние (показать/скрыть)
	 * @param {Element} [relatedTarget] - Элемент, вызвавший тост.
	 * @returns {VGToast}
	 */
	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}

	/**
	 * Показывает тост
	 * @param {Element} [relatedTarget] - Элемент, инициировавший показ.
	 * @returns {void}
	 */
	show(relatedTarget) {
		if (isDisabled(this._element)) return;

		const element = this._element;
		this._clearTimeout();
		this._clearHideTimeout();
		this._isHiding = false;
		this._disableInteractionHandlers();

		this._params = this._getParams(relatedTarget || {}, this._params);
		this._route((status, data) => {
			if (this._element !== element) return;
			EventHandler.trigger(element, EVENT_KEY_LOADED, { stats: status, data });
		});

		const showEvent = EventHandler.trigger(element, EVENT_KEY_SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		element.classList.remove(CLASS_NAME_SHOWN);
		element.classList.add(CLASS_NAME_SHOW);
		document.body.classList.add(CLASS_NAME_OPEN);

		this._setPlacement();

		const completeCallBack = () => {
			if (this._element !== element || this._isHiding) return;

			element.classList.add(CLASS_NAME_SHOWN);
			this._toggleInteractionHandlers();
			this._syncInteractiveBounds();
			this._scheduleHide();
			EventHandler.trigger(element, EVENT_KEY_SHOWN, { relatedTarget });
		};

		this._queueCallback(completeCallBack, element, true, this._params.animation.delay);
	}

	/**
	 * Скрывает тост
	 * @returns {void}
	 */
	hide() {
		if (isDisabled(this._element) || this._isHiding) return;

		const element = this._element;
		this._clearTimeout();
		this._clearHideTimeout();

		const hideEvent = EventHandler.trigger(element, EVENT_KEY_HIDE);
		if (hideEvent.defaultPrevented) return;

		this._isHiding = true;
		element.classList.remove(CLASS_NAME_SHOWN);
		this._disableInteractionHandlers();

		this._hideTimeout = setTimeout(() => {
			this._hideTimeout = null;
			if (this._element !== element) return;

			element.classList.remove(CLASS_NAME_SHOW);
			if (this._params.stack.enable) {
				this._setPlacement();
			}

			const completeCallback = () => {
				if (this._element !== element) return;

				if (!Selectors.find('.vg-toast.show')) {
					document.body.classList.remove(CLASS_NAME_OPEN);
				}

				const shouldDispose = !this._params.static;
				this._isHiding = false;
				EventHandler.trigger(element, EVENT_KEY_HIDDEN);

				if (this._element !== element) return;
				if (shouldDispose) {
					this.dispose();
				}
			};

			this._queueCallback(completeCallback, element, false, this._params.animation.delay);
		}, this._params.animation.delay);
	}

	/**
	 * Удаляет тост из DOM и снимает обработчики
	 * @override
	 */
	dispose() {
		if (!this._element) return;

		this._clearTimeout();
		this._clearHideTimeout();
		this._disableInteractionHandlers();
		if (!this._params.static) {
			this._element.remove();
		}
		super.dispose();
	}

	/**
	 * Устанавливает таймер на скрытие
	 * @private
	 */
	_scheduleHide() {
		this._clearTimeout();
		if (!this._params.autohide) return;

		this._timeout = setTimeout(() => this.hide(), this._params.delay);
	}

	/**
	 * Проверяет, показан ли тост
	 * @private
	 * @returns {boolean}
	 */
	_isShown() {
		return !!this._element && this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Возвращает список активных тостов с вертикальными смещениями
	 * Учитывает стек и максимальное количество
	 * @private
	 * @returns {Array<{el: Element, top: number}>}
	 */
	_enableStack() {
		const placement = this._params.placement;
		const isTop = placement.includes('top');
		const isBottom = !isTop; // по умолчанию снизу

		// Фильтруем тосты с таким же направлением (top или bottom)
		const stackClass = isTop ? 'top' : 'bottom';
		const elmsShown = Selectors.findAll(`.vg-toast.show.${stackClass}`)
			.filter(el => {
				const instance = VGToast.getInstance(el);
				return instance?._params.stack.enable;
			});

		if (!this._params.stack.enable) {
			// Скрываем другие тосты, если стек выключен
			elmsShown
				.filter(el => el !== this._element)
				.forEach(el => VGToast.getInstance(el).hide());
			return [{ el: this._element, top: 0 }];
		}

		// Ограничиваем по max
		if (elmsShown.length >= this._params.stack.max) {
			const excess = elmsShown.slice(0, elmsShown.length - this._params.stack.max + 1);
			excess.forEach(el => VGToast.getInstance(el).hide());
		}

		// Вычисляем смещение (по высоте)
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
	 * Устанавливает позицию тостов с учётом стека
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
			style.translate = ''; // <-- важно: сбрасываем translate отдельно

			if (isCenter) {
				style.left = '50%';
				style.translate = '-50% 0'; // <-- вместо transform: translateX(-50%)
			} else if (isLeft) {
				style.left = '0';
			} else if (isRight) {
				style.right = '0';
			} else {
				// по умолчанию: центрирование
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
	 * Очищает таймер
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

	_applyAnimationEffects() {
		const classList = this._element.classList;
		const effectClasses = [...classList].filter(className => className.startsWith(EFFECT_CLASS_PREFIX));
		effectClasses.forEach(className => classList.remove(className));

		const nextClasses = this._resolveAnimationEffectClasses(this._params.animation?.effect);
		nextClasses.forEach(className => classList.add(className));
	}

	_resolveAnimationEffectClasses(effectValue) {
		const values = Array.isArray(effectValue) ? effectValue : [effectValue];
		const normalized = values
			.filter(Boolean)
			.map(effect => this._resolveAnimationEffectClass(effect))
			.filter(Boolean);

		return Array.from(new Set(normalized));
	}

	_resolveAnimationEffectClass(effectValue) {
		if (typeof effectValue !== 'string') return '';
		const key = effectValue.trim().toLowerCase();
		if (!key) return '';

		if (Object.prototype.hasOwnProperty.call(EFFECT_PRESET_MAP, key)) {
			return EFFECT_PRESET_MAP[key];
		}

		return effectValue.trim();
	}

	_clearTimeout() {
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	}

	_clearHideTimeout() {
		if (this._hideTimeout) {
			clearTimeout(this._hideTimeout);
			this._hideTimeout = null;
		}
	}

	/**
	 * Назначает обработчики событий
	 * @private
	 */
	_addEventListeners() {
		// Закрытие по Esc
		if (this._params.keyboard) {
			EventHandler.on(document, EVENT_KEY_KEYDOWN_DISMISS, event => {
				if (event.key === 'Escape' && this._isShown()) {
					this.hide();
				}
			});
		}

		// Закрытие по клику на тост
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

// Автоматическое закрытие по data-vg-dismiss
dismissTrigger(VGToast);

/**
 * Реализация Data API
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


