import BaseModule from "../../base-module";
import VGModal from "../../vgmodal";
import VGDropdown from "../../vgdropdown";

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
				type: "modal", // modal, overlay or dropdown
				dismiss: false,
			},
			dropdown: {
				placement: "auto",
				hover: false,
				animation: {
					fade: true,
					enable: false,
					in: "animate__flipInY",
					out: "animate__flipOutY",
					delay: 300,
				},
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

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static boot() {
		this._bindDataApi();
		return null;
	}

	static call(options = {}, lang = 'ru') {
		const context = new VGAlert(options, lang);

		if (isAlertOpen) return Promise.reject({ accepted: false, reason: lang_messages(context.lang, NAME_KEY).reason });
		isAlertOpen = true;

		const getContainer = () => {
			if (context._params.render.type === "overlay") {
				const overlay = context._buildOverlay();

				if (!overlay.element || !overlay.render) {
					const modal = context._buildModal();
					return {
						element: modal._element,
						render: modal,
						type: 'modal'
					}
				}

				return {
					element: overlay.element,
					render: overlay.render,
					type: 'overlay'
				}
			} else if (context._params.render.type === "modal") {
				const modal = context._buildModal();
				return {
					element: modal._element,
					render: modal,
					type: 'modal'
				}
			} else if (context._params.render.type === "dropdown") {
				const dropdown = context._buildDropdown();

				if (!dropdown.element || !dropdown.render) {
					const modal = context._buildModal();
					return {
						element: modal._element,
						render: modal,
						type: 'modal'
					}
				}

				return {
					element: dropdown.element,
					render: dropdown.render,
					type: 'dropdown'
				}
			}
		};

		const {element: container, render, type} = getContainer();

		if (type === 'modal' || type === 'dropdown') {
			render.show();
		}

		const agreeBtn = Selectors.find(`[${DATA_AGREE}]`, container);
		const cancelBtn = Selectors.find(`[${DATA_CANCEL}]`, container);

		return new Promise((resolve, reject) => {
			let isSettled = false;

			const closeAlert = (isHide = true) => {
				if (type === 'modal') {
					render.hide();
					return;
				}

				if (type === 'dropdown') {
					render.hide();
					return;
				}

				if (type === 'overlay') {
					container.remove();

					if (context._params.render.dismiss && isHide) {
						render.hide();
					}
				}
			};

			const handleAgree = (e) => {
				e.preventDefault();
				isSettled = true;
				cleanup();
				resolve({
					accepted: true,
					timestamp: new Date(),
				});
				closeAlert();
			};

			const handleCancel = (e) => {
				e.preventDefault();
				isSettled = true;
				cleanup();
				reject({
					accepted: false,
					timestamp: new Date(),
				});
				closeAlert(false);
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
				document.removeEventListener("click", handleDropdownClickOutside);
				if (agreeBtn) agreeBtn.removeEventListener("click", handleAgree);
				if (cancelBtn) cancelBtn.removeEventListener("click", handleCancel);
			};

			const handleDropdownClickOutside = (e) => {
				if (type !== 'dropdown') return;

				const toggle = context._params.relatedTarget;

				if (container.contains(e.target) || (isElement(toggle) && toggle.contains(e.target))) {
					return;
				}

				handleCancel(e);
			};

			if (context._params.mode === "confirm") {
				if (agreeBtn) agreeBtn.addEventListener("click", handleAgree);
				if (cancelBtn) cancelBtn.addEventListener("click", handleCancel);
			}

			if (context._params.mode === "info") {
				if (cancelBtn) cancelBtn.addEventListener("click", handleCancel);
			}

			document.addEventListener("keydown", handleKeydown);

			if (type === 'modal') {
				container.addEventListener("vg.modal.hide", () => {
					if (isSettled) return;
					isSettled = true;
					cleanup();
					reject({
						accepted: false,
						timestamp: new Date(),
					});
				}, {once: true});
			}

			if (type === 'dropdown') {
				document.addEventListener("click", handleDropdownClickOutside);

				container.addEventListener("vg.dropdown.hidden", () => {
					if (container._vgAlertDropdownParent && !container._vgAlertDropdownParentWasSet) {
						container._vgAlertDropdownParent.classList.remove('vg-dropdown');
					}

					container.remove();

					if (isSettled) return;

					isSettled = true;
					cleanup();
					reject({
						accepted: false,
						timestamp: new Date(),
					});
				}, {once: true});
			}

			container.focus();
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

	static _bindDataApi() {
		if (this._isDataApiBound) {
			return;
		}

		this._isDataApiBound = true;

		EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
			event.preventDefault();
			const target = event.delegateTarget || this || event.target?.closest(SELECTOR_DATA_TOGGLE) || event.target;

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

	_buildOverlay() {
		const targetContainers = ['.vg-modal', '.vg-sidebar'];
		const relatedTarget = this._params.relatedTarget;
		const containerWrap = isElement(relatedTarget)
			? relatedTarget.closest(targetContainers.join(', '))
			: null;

		if (!containerWrap) {
			return {
				element: null,
				render: null,
			};
		}

		const modal = VGModal.getOrCreateInstance(containerWrap);
		const container = Selectors.find('.vg-modal-content', modal._element) || containerWrap;

		const overlay = document.createElement('div');

		overlay.className = `${CLASS_NAME_ALERT}-overlay`;
		overlay.append(this._buildContent());

		container.append(overlay);

		return {
			element: overlay,
			render: modal,
		};
	}

	_buildDropdown() {
		const relatedTarget = this._params.relatedTarget;

		if (!isElement(relatedTarget) || !relatedTarget.parentNode) {
			return {
				element: null,
				render: null,
			};
		}

		const id = `${CLASS_NAME_ALERT}-dropdown-${makeRandomString()}`;
		const parent = relatedTarget.parentNode;
		const container = document.createElement('div');
		const dropdownContainer = document.createElement('div');
		const isDropdownParent = parent.classList.contains('vg-dropdown');

		parent.classList.add('vg-dropdown');

		container.id = id;
		container.className = `vg-dropdown-content ${CLASS_NAME_ALERT}-dropdown`;
		container.setAttribute('tabindex', '-1');
		container.setAttribute('role', 'dialog');
		container._vgAlertDropdownParent = parent;
		container._vgAlertDropdownParentWasSet = isDropdownParent;

		dropdownContainer.className = 'vg-dropdown-container';
		dropdownContainer.append(this._buildContent());
		container.append(dropdownContainer);

		parent.append(container);

		const dropdown = VGDropdown.getOrCreateInstance(relatedTarget, mergeDeepObject({
			placement: 'bottom-start',
		}, this._params.dropdown));

		dropdown._drop = container;
		dropdown._parent = parent;

		return {
			element: container,
			render: dropdown,
		};
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

		this._params.relatedTarget = this._element;

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
VGAlert._isDataApiBound = false;

export default VGAlert;
