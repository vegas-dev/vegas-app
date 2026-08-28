/**
 * Описание: боковые панели VGSidebar с декларативным и программным управлением.
 * Возможности: четыре стороны экрана, backdrop, прокрутка, URL-хэш, AJAX, события и доступность.
 */
import BaseModule from "../../base-module";
import { isDisabled, isVisible, mergeDeepObject } from "../../../utils/js/functions";
import EventHandler from "../../../utils/js/dom/event";
import { dismissTrigger } from "../../module-fn";
import Selectors from "../../../utils/js/dom/selectors";
import Backdrop from "../../../utils/js/components/backdrop";
import ScrollBarHelper from "../../../utils/js/components/scrollbar";

/**
 * @constant {string} NAME - Имя модуля.
 */
const NAME = 'sidebar';

/**
 * @constant {string} NAME_KEY - Пространство имён для событий.
 */
const NAME_KEY = 'vg.sidebar';

/**
 * @constant {string} SELECTOR_DATA_TOGGLE - Селектор для элементов активации сайдбара.
 */
const SELECTOR_DATA_TOGGLE = '[data-vg-toggle="sidebar"]';
const OPEN_SELECTOR = '.vg-sidebar.show';
const BACKDROP_OWNER_ATTR = 'data-vg-backdrop-owner';
const BACKDROP_OWNER_VALUE = 'sidebar';

/**
 * @constant {string} CLASS_NAME_SHOW - Класс, отвечающий за отображение сайдбара.
 */
const CLASS_NAME_SHOW = 'show';

/**
 * @constant {string} CLASS_NAME_OPEN - Класс, добавляемый к body при открытом сайдбаре.
 */
const CLASS_NAME_OPEN = 'vg-sidebar-open';

/**
 * @constant {Object} EVENT_KEYS - Объект с ключами событий для модуля.
 */
const EVENT_KEYS = {
	HIDE: `${NAME_KEY}.hide`,
	HIDDEN: `${NAME_KEY}.hidden`,
	SHOW: `${NAME_KEY}.show`,
	SHOWN: `${NAME_KEY}.shown`,
	LOADED: `${NAME_KEY}.loaded`,
	KEYDOWN_DISMISS: `keydown.dismiss.${NAME_KEY}`,
	HIDE_PREVENTED: `hidePrevented.${NAME_KEY}`,
	CLICK_DATA_API: `click.${NAME_KEY}.data.api`,
	POPSTATE_DATA_API: `popstate.${NAME_KEY}.data.api`,
	DOM_LOADED_DATA_API: `DOMContentLoaded.${NAME_KEY}.data.api`,
};

/**
 * Класс VGSidebar реализует функциональность боковой панели (сайдбара) с поддержкой:
 * - открытия/закрытия по клику или хэшу
 * - поддержки backdrop
 * - блокировки скролла при открытии
 * - анимаций
 * - AJAX-загрузки контента
 *
 * @extends BaseModule
 */
class VGSidebar extends BaseModule {
	/**
	 * Создаёт экземпляр VGSidebar.
	 *
	 * @param {HTMLElement} element - Основной элемент сайдбара.
	 * @param {Object} params - Параметры конфигурации.
	 * @param {boolean} [params.backdrop=true] - Показывать подложку.
	 * @param {boolean} [params.overflow=true] - Блокировать скролл при открытии.
	 * @param {boolean} [params.keyboard=true] - Закрывать по клавише Escape.
	 * @param {boolean} [params.hash=false] - Поддержка открытия по хэшу URL.
	 * @param {Object} [params.animation] - Настройки анимации.
	 * @param {boolean} [params.animation.enable=false] - Включить анимацию.
	 * @param {string} [params.animation.in='animate__rollIn'] - Класс входной анимации.
	 * @param {string} [params.animation.out='animate__rollOut'] - Класс выходной анимации.
	 * @param {number} [params.animation.delay=800] - Задержка перед закрытием (мс).
	 * @param {Object} [params.ajax] - Параметры AJAX-загрузки.
	 * @param {string} [params.ajax.route=''] - URL для загрузки.
	 * @param {string} [params.ajax.target=''] - Селектор цели для вставки.
	 * @param {string} [params.ajax.method='get'] - HTTP-метод.
	 * @param {boolean} [params.ajax.loader=false] - Показывать лоадер.
	 * @param {boolean} [params.ajax.once=false] - Загружать только один раз.
	 * @param {boolean} [params.ajax.output=true] - Вставлять ответ в DOM.
	 */
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			backdrop: true,
			overflow: true,
			keyboard: true,
			hash: false,
			animation: {
				enable: false,
				in: 'animate__rollIn',
				out: 'animate__rollOut',
				delay: 800,
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				loader: false,
				once: false,
				output: true,
			}
		}, params));

		this._scrollBar = new ScrollBarHelper();
		this._backdropElement = null;
		this._params.animation.delay = this._params.animation.enable ? this._params.animation.delay : 0;

		this._addEventListeners();
		this._dismissElement();
		this._animation(this._element, NAME_KEY, this._params.animation);
	}

	/**
	 * Статическое свойство: имя модуля.
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Статическое свойство: ключ для событий и данных.
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	static getOpenSidebars(excludeElement = null) {
		return Selectors.findAll(OPEN_SELECTOR).filter(sidebar => sidebar !== excludeElement);
	}

	static getBackdropElement() {
		const sidebarBackdrops = Selectors.findAll(`.vg-backdrop[${BACKDROP_OWNER_ATTR}="${BACKDROP_OWNER_VALUE}"]`);
		return sidebarBackdrops.length ? sidebarBackdrops[sidebarBackdrops.length - 1] : null;
	}

	/**
	 * Переключает состояние сайдбара (открыть/закрыть).
	 *
	 * @param {HTMLElement} [relatedTarget] - Элемент, инициировавший открытие.
	 * @returns {void}
	 */
	toggle(relatedTarget) {
		return this._isShown() ? this.hide() : this.show(relatedTarget);
	}
	_showPopstateHandler = null;

	/**
	 * Открывает сайдбар.
	 *
	 * @param {HTMLElement} [relatedTarget] - Элемент, инициировавший открытие.
	 * @returns {void}
	 */
	show(relatedTarget) {
		if (isDisabled(this._element) || this._isShown()) return;

		if (relatedTarget) {
			this._params = this._getParams(relatedTarget, this._params);
		}

		this._route((status, data) => {
			EventHandler.trigger(this._element, EVENT_KEYS.LOADED, { stats: status, data });
		});

		const showEvent = EventHandler.trigger(this._element, EVENT_KEYS.SHOW, { relatedTarget });
		if (showEvent.defaultPrevented) return;

		const alreadyOpenSidebars = VGSidebar.getOpenSidebars(this._element);
		const hasOpenSidebar = alreadyOpenSidebars.length > 0;
		let currentBackdrop = null;
		if (this._params.backdrop) {
			if (hasOpenSidebar) {
				currentBackdrop = VGSidebar.getBackdropElement();
				if (currentBackdrop) {
					this._backdropElement = currentBackdrop;
				} else {
					Backdrop.show((backdrop) => {
						currentBackdrop = backdrop;
						this._backdropElement = backdrop;
						backdrop.setAttribute(BACKDROP_OWNER_ATTR, BACKDROP_OWNER_VALUE);
					});
				}
			} else {
				Backdrop.show((backdrop) => {
					currentBackdrop = backdrop;
					this._backdropElement = backdrop;
					backdrop.setAttribute(BACKDROP_OWNER_ATTR, BACKDROP_OWNER_VALUE);
				});
			}
		}

		if (this._params.overflow && !hasOpenSidebar) {
			this._scrollBar.hide();
		}

		if (this._params.hash) {
			history.pushState(null, '', `#${this._element.id}`);

			if (this._showPopstateHandler) {
				EventHandler.off(window, EVENT_KEYS.POPSTATE_DATA_API, this._showPopstateHandler);
			}

			this._showPopstateHandler = () => this.hide();
			EventHandler.on(window, EVENT_KEYS.POPSTATE_DATA_API, this._showPopstateHandler);
		}

		this._element.classList.add(CLASS_NAME_SHOW);
		this._element.removeAttribute('aria-hidden');
		document.body.classList.add(CLASS_NAME_OPEN);

		const completeCallback = () => {
			const backdrop = this._params.backdrop ? (currentBackdrop || VGSidebar.getBackdropElement()) : null;
			if (backdrop) {
				EventHandler.on(backdrop, 'mousedown.vg.backdrop', () => this.hide());
			}
			EventHandler.trigger(this._element, EVENT_KEYS.SHOWN, { relatedTarget });
		};

		this._queueCallback(completeCallback, this._element, true, 50);
	}

	/**
	 * Закрывает сайдбар.
	 *
	 * @param {boolean} [isLeaveBackDrop=false] - Не убирать подложку.
	 * @returns {void}
	 */
	hide(isLeaveBackDrop = false) {
		if (isDisabled(this._element) || !this._isShown()) return;

		const hideEvent = EventHandler.trigger(this._element, EVENT_KEYS.HIDE);
		if (hideEvent.defaultPrevented) return;

		this._element.classList.remove(CLASS_NAME_SHOW);
		this._element.setAttribute('aria-hidden', 'true');
		const remainingOpenSidebars = VGSidebar.getOpenSidebars(this._element);
		if (!remainingOpenSidebars.length) {
			document.body.classList.remove(CLASS_NAME_OPEN);
		}

		setTimeout(() => {
			this._element.setAttribute('aria-expanded', 'false');

			const completeCallback = () => {
				if (!isLeaveBackDrop) {
					if (this._params.backdrop && !remainingOpenSidebars.length) {
						Backdrop.hide(() => {
							this._backdropElement = null;
							if (this._params.overflow && !Backdrop.isActive()) {
								this._scrollBar.reset();
							}
						}, this._backdropElement || VGSidebar.getBackdropElement());
					} else if (this._params.backdrop) {
						this._backdropElement = null;
					} else if (this._params.overflow) {
						if (!remainingOpenSidebars.length && !Backdrop.isActive()) {
							this._scrollBar.reset();
						}
					}

					if (this._params.hash && window.location.hash === `#${this._element.id}`) {
						history.replaceState(
							'',
							document.title,
							window.location.pathname + window.location.search
						);
					}

					if (this._showPopstateHandler) {
						EventHandler.off(window, EVENT_KEYS.POPSTATE_DATA_API, this._showPopstateHandler);
						this._showPopstateHandler = null;
					}

					EventHandler.trigger(this._element, EVENT_KEYS.HIDDEN);
				}
			};

			this._queueCallback(completeCallback, this._element, true);
		}, this._params.animation.delay);
	}

	/**
	 * Очищает ресурсы модуля.
	 * @override
	 */
	dispose() {
		if (!this._element) return;
		EventHandler.off(document, EVENT_KEYS.KEYDOWN_DISMISS, this._keydownHandler);
		EventHandler.off(this._element, EVENT_KEYS.HIDE);
		if (this._showPopstateHandler) {
			EventHandler.off(window, EVENT_KEYS.POPSTATE_DATA_API, this._showPopstateHandler);
		}
		if (!VGSidebar.getOpenSidebars(this._element).length && !Backdrop.isActive()) {
			this._scrollBar.reset();
		}
		super.dispose();
	}

	/**
	 * Проверяет, открыт ли сайдбар.
	 * @returns {boolean}
	 * @private
	 */
	_isShown() {
		return this._element.classList.contains(CLASS_NAME_SHOW);
	}

	/**
	 * Добавляет глобальные слушатели событий (например, Escape).
	 * @private
	 */
	_addEventListeners() {
		this._keydownHandler = (event) => {
			if (event.key !== 'Escape' || !this._isShown()) return;

			if (this._params.keyboard) {
				this.hide();
			} else {
				EventHandler.trigger(this._element, EVENT_KEYS.HIDE_PREVENTED);
			}
		};
		EventHandler.on(document, EVENT_KEYS.KEYDOWN_DISMISS, this._keydownHandler);
	}
}

// Автоматическая инициализация по data-атрибутам
dismissTrigger(VGSidebar);

/**
 * Реализация Data API: открытие сайдбара по data-атрибуту.
 */
EventHandler.on(document, EVENT_KEYS.CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	const target = Selectors.getElementFromSelector(this);
	if (!target) return;

	if (['A', 'AREA'].includes(this.tagName)) {
		event.preventDefault();
	}

	if (isDisabled(this)) return;

	this.setAttribute('aria-expanded', 'true');

	// Сбрасываем атрибут после закрытия
	EventHandler.one(target, EVENT_KEYS.HIDDEN, () => {
		this.setAttribute('aria-expanded', 'false');
	});

	const instance = VGSidebar.getOrCreateInstance(target);
	instance.toggle(this);
});

/**
 * Открытие сайдбара по хэшу при загрузке страницы.
 */
EventHandler.on(document, EVENT_KEYS.DOM_LOADED_DATA_API, function () {
	const hash = window.location.hash.slice(1);
	if (!hash) return;

	const target = Selectors.find(`#${hash}`);
	if (target && target.classList.contains('vg-sidebar') && !isDisabled(target)) {
		const instance = VGSidebar.getOrCreateInstance(target);

		if (instance._params.hash) {
			instance.toggle();
		}
	}
});

export default VGSidebar;
