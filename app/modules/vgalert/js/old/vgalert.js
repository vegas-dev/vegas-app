import BaseModule from "../../base-module";
import VGModal from "../../vgmodal";

import { isElement, isVisible, makeRandomString, mergeDeepObject } from "../../../utils/js/functions";
import { getSVG } from "../../module-fn";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";
import {lang_buttons, lang_messages} from "../../../utils/js/components/lang";
import Html from "../../../utils/js/components/templater";
import Params from "../../../utils/js/components/params";

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

class VGAlert {
	constructor(params = {}, lang = 'ru') {
		this.lang = lang;
		this._defaultParams = {
			render: {
				type: "modal",
			},
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
			hide: false,
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

	static call(options = {}, lang = 'ru') {
		const context = new VGAlert(options, lang);

		if (isAlertOpen) return Promise.reject({ accepted: false, reason: lang_messages(context.lang, NAME_KEY).reason });
		isAlertOpen = true;

		let modal = context._buildModal();
		modal.show();

		const container = modal._element;

		return new Promise((resolve, reject) => {
			context._attachHandlers(
				container,
				resolve,
				reject,
				() => {
					modal.hide();
					isAlertOpen = false;
				}
			);
		});
	}

	static confirm(elem, options = {}) {
		let lang = 'ru';

		if ('lang' in options) {
			lang = options.lang || 'ru';
			delete options.lang;
		}
		const context = new VGAlert(options, lang);
		if (context._params.mode !== "confirm") return;

		const instance = VGAlertConfirm.getOrCreateInstance(elem, context._params);
		instance.run(VGAlert);
	}

	static overlay(target, options = {}, lang = 'ru') {
		const modalContainer = target.closest('.vg-modal');
		if (!modalContainer) return;

		const modal = VGModal.getOrCreateInstance(modalContainer);
		const container = Selectors.find('.vg-modal-content', modal._element);

		const params = new Params(options, target);
		const context = new VGAlert(params._params, lang);
		const isHideModal = context._params.hide || false;
		const overlay = context._buildOverlay(container);

		return new Promise((resolve, reject) => {
			context._attachHandlers(
				overlay,
				resolve,
				reject,
				() => {
					overlay.remove();
				},
				() => {
					if (modal && isHideModal) {
						modal.hide();
					}
				}
			);
		});
	}

	_attachHandlers(root, resolve, reject, close, agree) {
		const agreeBtn = Selectors.find(`[${DATA_AGREE}]`, root);
		const cancelBtn = Selectors.find(`[${DATA_CANCEL}]`, root);

		const cleanup = () => {
			document.removeEventListener(
				"keydown",
				handleKeydown
			);

			agreeBtn?.removeEventListener(
				"click",
				handleAgree
			);

			cancelBtn?.removeEventListener(
				"click",
				handleCancel
			);
		};

		const handleAgree = (e) => {
			e.preventDefault();

			cleanup();

			resolve({
				accepted: true,
				timestamp: new Date()
			});

			agree();
			close();
		};

		const handleCancel = (e) => {
			e.preventDefault();

			cleanup();

			reject({
				accepted: false,
				timestamp: new Date()
			});

			close();
		};

		const handleKeydown = (e) => {

			if (e.key === "Enter") {
				handleAgree(e);
			}

			if (e.key === "Escape") {
				handleCancel(e);
			}
		};

		agreeBtn?.addEventListener(
			"click",
			handleAgree
		);

		cancelBtn?.addEventListener(
			"click",
			handleCancel
		);

		document.addEventListener(
			"keydown",
			handleKeydown
		);
	}

	_setParams(params) {
		const merged = mergeDeepObject(this._defaultParams, params);
		merged.buttons = mergeDeepObject(this._elementsDefault.buttons, merged.buttons);
		merged.message = mergeDeepObject(this._elementsDefault.message, merged.message);
		merged.icon = this._elementsDefault.icons[merged.theme];

		return merged;
	}

	_buildModal() {
		const id = `${CLASS_NAME_ALERT}-${makeRandomString()}`;

		return VGModal.build(id, this._params.modal, (modal) => {
			modal._element.classList.add(`${CLASS_NAME_ALERT}-modal`);
			const body = Selectors.find(".vg-modal-body", modal._element);
			body.append(this._buildContent());
		});
	}

	_buildContent() {
		const html = Html('dom');

		let icon = null;

		if (this._params.icon) {
			icon = html.div(
				{class: `${CLASS_NAME_ALERT}-content--icon`},
				this._params.icon,
				{isHTML: true}
			);
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

		return html.div(
			{class: `${CLASS_NAME_ALERT}-wrapper ${CLASS_NAME_ALERT}-${this._params.theme}`},
			[
				html.div(
					{class: `${CLASS_NAME_ALERT}-content`},
					[
						icon,
						html.div(
							{class: `${CLASS_NAME_ALERT}-content--message`},
							[
								html.div(
									{class: `${CLASS_NAME_ALERT}-content--title`},
									this._params.message.title
								),
								html.div(
									{class: `${CLASS_NAME_ALERT}-content--description`},
									this._params.message.description
								)
							]
						)
					]
				),
				buttons
			]
		);
	}

	_buildOverlay(container) {
		const overlay = document.createElement('div');

		overlay.className = `${CLASS_NAME_ALERT}-overlay`;
		overlay.append(this._buildContent());

		container.append(overlay);

		return overlay;
	}

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

class VGAlertConfirm extends BaseModule {
	constructor(element, options = {}) {
		super(element);
		this._params = this._getParams(element, mergeDeepObject({}, options));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

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

	let renderType = target.getAttribute('data-render-type') || '';
	if (renderType && renderType === 'overlay') {
		VGAlert.overlay(
			target,
			{
				message: {
					title: 'Удалить?',
					description: 'Действие необратимо'
				}
			}
		);
	} else {
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
	}
});

export default VGAlert;