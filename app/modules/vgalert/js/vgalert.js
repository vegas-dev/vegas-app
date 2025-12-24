import BaseModule from "../../base-module";
import VGModal from "../../vgmodal";

import { isElement, isVisible, makeRandomString, mergeDeepObject } from "../../../utils/js/functions";
import { getSVG } from "../../module-fn";
import { Classes, Manipulator } from "../../../utils/js/dom/manipulator";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {lang_buttons, lang_messages} from "../../../utils/js/components/lang";
import Html from "../../../utils/js/components/templater";
import {resolve} from "@babel/core/lib/vendor/import-meta-resolve";

/**
 * @typedef {Object} AjaxParams
 * @property {string} route - URL-адрес для AJAX-запроса.
 * @property {string} target - Селектор элемента, куда будет вставлен ответ.
 * @property {string} method - HTTP-метод ('get', 'post' и т.д.).
 * @property {boolean} loader - Показывать ли индикатор загрузки.
 * @property {boolean} once - Выполнить запрос только один раз.
 * @property {boolean} output - Выводить ли результат в целевой элемент.
 */

/**
 * @typedef {Object} ModalParams
 * @property {boolean} centered - Центрировать ли модальное окно по вертикали.
 * @property {boolean|string} backdrop - Фоновая подложка ('static', true, false).
 * @property {boolean} overflow - Разрешить прокрутку фона при открытом окне.
 * @property {boolean} keyboard - Закрывать по нажатию Escape.
 * @property {boolean} dismiss - Закрывать при клике по подложке.
 * @property {Object} animation - Параметры анимации.
 * @property {boolean} animation.enable - Включить анимацию.
 * @property {string} animation.in - Класс анимации входа.
 * @property {string} animation.out - Класс анимации выхода.
 * @property {number} animation.delay - Задержка перед показом (мс).
 * @property {number} animation.duration - Длительность анимации (мс).
 */

/**
 * @typedef {Object} ButtonConfig
 * @property {string} [element] - Готовый HTML-элемент кнопки.
 * @property {'button'|'a'} [tag='button'] - Тип элемента.
 * @property {string} [type='button'] - Атрибут type (для <button>).
 * @property {Object.<string, string>} [attr] - Дополнительные атрибуты.
 * @property {string} toggle - Атрибут данных для управления.
 * @property {string[]} class - CSS-классы кнопки.
 * @property {string} text - Текст кнопки.
 */

/**
 * @typedef {Object} MessageConfig
 * @property {string} title - Заголовок сообщения.
 * @property {string} description - Описание/текст сообщения.
 */

/**
 * @typedef {Object} AlertParams
 * @property {AjaxParams} ajax - Параметры AJAX-запроса.
 * @property {ModalParams} modal - Параметры модального окна.
 * @property {'confirm'|'info'} mode - Режим алерта: подтверждение или информационное.
 * @property {'danger'|'warning'|'success'|'info'} theme - Тема оформления.
 * @property {{agree: ButtonConfig, cancel: ButtonConfig}} buttons - Конфигурация кнопок.
 * @property {MessageConfig} message - Сообщение и заголовок.
 * @property {string} [icon] - SVG-иконка, соответствующая теме.
 */

/**
 * Константы
 */
const CLASS_NAME_ALERT = "vg-alert";
const DATA_AGREE = "data-vg-alert-agree";
const DATA_CANCEL = "data-vg-alert-cancel";

const NAME = "alert";
const NAME_KEY = "vg.alert";

// Глобальная блокировка: предотвращаем открытие нескольких алертов
let isAlertOpen = false;

/**
 * Класс VGAlert — модальное окно подтверждения или информационное уведомление.
 *
 * @class
 * @example
 * VGAlert.call({
 *   mode: 'confirm',
 *   theme: 'danger',
 *   message: {
 *     title: 'Вы уверены?',
 *     description: 'Это действие нельзя отменить.'
 *   },
 *   buttons: {
 *     agree: { text: 'Удалить', class: ['btn-danger'] },
 *     cancel: { text: 'Отмена' }
 *   }
 * }).then(() => {
 *   console.log('Подтверждено');
 * }).catch(() => {
 *   console.log('Отменено');
 * });
 */
class VGAlert {
	/**
	 * Создаёт экземпляр VGAlert.
	 *
	 * @param {AlertParams} params - Пользовательские параметры.
	 * @param {'ru'|'en'} [lang='ru'] - Язык интерфейса.
	 */
	constructor(params = {}, lang = 'ru') {
		this.lang = lang;
		this._defaultParams = {
			ajax: {
				route: "",
				target: "",
				method: "get",
				loader: false,
				once: false,
				output: true,
			},
			modal: {
				centered: false,
				backdrop: true,
				overflow: true,
				keyboard: true,
				dismiss: true,
				animation: {
					enable: false,
					in: "animate__rollIn",
					out: "animate__rollOut",
					delay: 300,
					duration: 700,
				},
			},
			mode: "confirm",
			theme: "danger",
			buttons: {},
			message: {},
		};

		this._elementsDefault = {
			buttons: {
				agree: {
					element: "",
					tag: "button",
					type: "button",
					attr: {},
					toggle: DATA_AGREE,
					class: ["btn"],
					text: lang_buttons(this.lang, NAME)['agree'],
				},
				cancel: {
					element: "",
					tag: "button",
					type: "button",
					attr: {},
					toggle: DATA_CANCEL,
					class: ["btn"],
					text: lang_buttons(this.lang, NAME)['cancel'],
				},
			},
			message: {
				title: lang_messages(this.lang, NAME)['title'],
				description: lang_messages(this.lang, NAME)['description']
			},
			icons: {
				danger: getSVG("danger"),
				warning: getSVG("warning"),
				success: getSVG("success"),
				info: getSVG("info"),
			},
		};
		this._params = this._setParams(params);
	}

	/**
	 * Открывает алерт и возвращает Promise.
	 *
	 * @static
	 * @param {AlertParams} options - Параметры алерта.
	 * @param {'ru'|'en'} [lang='ru'] - Язык.
	 * @returns {Promise<{accepted: boolean, timestamp: Date}>} Результат взаимодействия.
	 * @throws {Error} Если алерт уже открыт.
	 */
	static call(options = {}, lang = 'ru') {
		const context = new VGAlert(options, lang);

		if (isAlertOpen) return Promise.reject({ accepted: false, reason: lang_messages(context.lang, NAME_KEY).reason });
		isAlertOpen = true;

		let modal = context._buildModal();
		modal.show();

		const container = modal._element;
		const agreeBtn = Selectors.find(`[${DATA_AGREE}]`, container);
		const cancelBtn = Selectors.find(`[${DATA_CANCEL}]`, container);

		return new Promise((resolve, reject) => {
			const handleAgree = (e) => {
				e.preventDefault();
				cleanup();
				resolve({
					accepted: true,
					timestamp: new Date(),
				});
				modal.hide();
			};

			const handleCancel = (e) => {
				e.preventDefault();
				modal.hide();
			};

			const handleKeydown = (e) => {
				if (e.key === "Enter" && agreeBtn) {
					e.preventDefault();
					handleAgree(e);
				}
				if (e.key === "Escape") {
					e.preventDefault();
					handleCancel(e);
				}
			};

			const cleanup = () => {
				isAlertOpen = false;
				document.removeEventListener("keydown", handleKeydown);
				if (agreeBtn) agreeBtn.removeEventListener("click", handleAgree);
				if (cancelBtn) cancelBtn.removeEventListener("click", handleCancel);
			};

			if (context._params.mode === "confirm") {
				if (agreeBtn) agreeBtn.addEventListener("click", handleAgree);
				if (cancelBtn) cancelBtn.addEventListener("click", handleCancel);
			}

			if (context._params.mode === "info") {
				if (cancelBtn) cancelBtn.addEventListener("click", handleCancel);
			}

			document.addEventListener("keydown", handleKeydown);
			container.addEventListener("vg.modal.hide", () => {
				cleanup();
				reject({
					accepted: false,
					timestamp: new Date(),
				});
			});

			container.focus();
		});
	}

	/**
	 * Инициирует алерт подтверждения на основе DOM-элемента.
	 *
	 * @static
	 * @param {HTMLElement} elem - Элемент, вызвавший алерт.
	 * @param {AlertParams} options - Параметры алерта.
	 * @returns {void}
	 */
	static confirm(elem, options = {}) {
		const context = new VGAlert(options);
		if (context._params.mode !== "confirm") return;

		const instance = VGAlertConfirm.getOrCreateInstance(elem, context._params);
		instance.run(VGAlert);
	}

	/**
	 * Слияние пользовательских параметров с дефолтными.
	 *
	 * @private
	 * @param {AlertParams} params - Пользовательские параметры.
	 * @returns {AlertParams} Полный объект параметров.
	 */
	_setParams(params) {
		const merged = mergeDeepObject(this._defaultParams, params);
		merged.buttons = mergeDeepObject(this._elementsDefault.buttons, merged.buttons);
		merged.message = mergeDeepObject(this._elementsDefault.message, merged.message);
		merged.icon = this._elementsDefault.icons[merged.theme];

		return merged;
	}

	/**
	 * Создаёт и возвращает экземпляр модального окна с контентом алерта.
	 *
	 * @private
	 * @returns {VGModal} Экземпляр модального окна.
	 */
	_buildModal() {
		const id = `${CLASS_NAME_ALERT}-${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : makeRandomString()}`;
		const $modal = Selectors.find(`.${CLASS_NAME_ALERT}-modal`);
		if ($modal) $modal.remove();

		const html = Html('dom');

		return VGModal.build(id, this._params.modal, (modalInstance) => {
			const element = modalInstance._element;
			element.classList.add(`${CLASS_NAME_ALERT}-modal`);
			element.setAttribute("role", "alertdialog");
			element.setAttribute("aria-modal", "true");

			const $body = Selectors.find(".vg-modal-body", element);
			if (!$body) return;

			let icon = null;
			if (this._params.icon) {
				icon = html.div({class: `${CLASS_NAME_ALERT}-content--icon`}, this._params.icon, {isHTML: true});
			}

			const buttons = document.createElement("div");
			Classes.add(buttons, "vg-alert-buttons");

			if (this._params.mode === "confirm") {
				this._createButton(buttons, "cancel");
				this._createButton(buttons, "agree");
			}

			if (this._params.mode === "info") {
				this._createButton(buttons, "cancel");
			}

			let wrapper = html.div({class: `${CLASS_NAME_ALERT}-wrapper ${CLASS_NAME_ALERT}-${this._params.theme}`}, [
				html.div({class: `${CLASS_NAME_ALERT}-content`}, [
					icon,
					html.div({class: `${CLASS_NAME_ALERT}-content--message`}, [
						html.div({class: `${CLASS_NAME_ALERT}-content--title`}, this._params.message.title),
						html.div({class: `${CLASS_NAME_ALERT}-content--description`}, this._params.message.description),
					])
				]),
				buttons
			]);

			$body.appendChild(wrapper);
		});
	}

	/**
	 * Создаёт кнопку и добавляет её в контейнер.
	 *
	 * @private
	 * @param {HTMLElement} container - Родительский элемент.
	 * @param {'agree'|'cancel'} key - Ключ кнопки.
	 * @returns {void}
	 */
	_createButton(container, key) {
		const button = this._params.buttons[key];
		if (!button || button.element) {
			container.insertAdjacentHTML("beforeend", button?.element || "");
			return;
		}

		if (!button.tag) return;

		let btn = null,
			classes = [...new Set(button.class)].join(" "),
			attrs = mergeDeepObject({
				class: classes
			}, button.attr);

		if (button.tag === "button") {
			btn = Html('dom').button(button.text, button.type, attrs);
		} else if (button.tag === "a") {
			btn = Html('dom').a('#', button.text, attrs);
		}

		if (!btn) return;

		btn.setAttribute(button.toggle, "true");
		container.appendChild(btn);
	}
}

/**
 * Константы для событий и селекторов
 */
const SELECTOR_DATA_TOGGLE = `[data-vg-toggle="${NAME}"]`;
const EVENT_KEY_CLICK_DATA_API = `click.${NAME_KEY}.data.api`;
const EVENT_KEY_LOADED  = `${NAME_KEY}.loaded`;
const EVENT_KEY_ACCEPT  = `${NAME_KEY}.accept`;
const EVENT_KEY_REJECT  = `${NAME_KEY}.reject`;
const EVENT_KEY_FINALLY = `${NAME_KEY}.finally`;

/**
 * Класс для работы с алертами по data-атрибутам.
 *
 * @class
 * @extends BaseModule
 * @example
 * <button data-vg-toggle="alert" data-ajax-route="/delete/1">Удалить</button>
 */
class VGAlertConfirm extends BaseModule {
	/**
	 * Создаёт экземпляр VGAlertConfirm.
	 *
	 * @param {HTMLElement} element - DOM-элемент.
	 * @param {AlertParams} options - Параметры.
	 */
	constructor(element, options = {}) {
		super(element);
		this._params = this._getParams(element, mergeDeepObject({}, options));
	}

	/**
	 * Возвращает имя модуля.
	 * @returns {string}
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Возвращает ключевое имя с префиксом.
	 * @returns {string}
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Запускает логику алерта: вызывает модальное окно и обрабатывает результат.
	 *
	 * @param {typeof VGAlert} AlertClass - Класс алерта.
	 * @returns {void}
	 */
	run(AlertClass) {
		if (this._params.mode !== "confirm") return;

		AlertClass.call(this._params)
			.then((resolve) => {
				if (!resolve.accepted) return Promise.reject(resolve);
				if (!this._params.ajax.route) return resolve;
				return this._ajax();
			})
			.then((response) => {
				EventHandler.trigger(this._element, EVENT_KEY_ACCEPT, { vgalert: response });
			})
			.catch((error) => {
				EventHandler.trigger(this._element, EVENT_KEY_REJECT, { vgalert: error });
			})
			.finally(() => {
				EventHandler.trigger(this._element, EVENT_KEY_FINALLY, { vgalert: 'finally' });
			});
	}

	/**
	 * Выполняет AJAX-запрос после подтверждения.
	 *
	 * @private
	 * @returns {Promise<Object>} Ответ от сервера.
	 */
	_ajax() {
		return new Promise((resolve) => {
			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_KEY_LOADED, { stats: status, data });
				resolve({ status, data });
			});
		});
	}
}

// Делегирование кликов по data-атрибутам
EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	event.preventDefault();
	const target = event.target;

	if (!isVisible(target) || !isElement(target)) return;

	VGAlert.confirm(target, {
		buttons: {
			agree: {
				class: ["btn-primary"],
			},
			cancel: {
				class: ["btn-outline-primary"],
			},
		},
	});
});

export default VGAlert;