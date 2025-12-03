import BaseModule from "../../base-module";
import VGModal from "../../vgmodal";

import {isElement, isVisible, makeRandomString, mergeDeepObject} from "../../../utils/js/functions";
import {getSVG} from "../../module-fn";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";
import Selectors from "../../../utils/js/dom/selectors";
import EventHandler from "../../../utils/js/dom/event";

class VGAlert {
	constructor(params = {}) {
		this._elementsDefault = {
			buttons: {
				agree: {
					element: '',
					tag: 'button',
					attr: {
						type: 'button',
					},
					toggle: 'data-vg-alert-agree',
					class: ['btn'],
					text: 'Да, согласен'
				},
				cancel: {
					element: '',
					tag: 'button',
					attr: {
						type: 'button',
					},
					toggle: 'data-vg-alert-cancel',
					class: ['btn'],
					text: 'Пошли на хуй'
				}
			},
			message: {
				title: 'Заголовок по умолчанию',
				description: 'Описание текущего действия',
			},
			icons: {
				danger: getSVG('danger'),
				success: getSVG('success'),
				info: getSVG('info'),
			}
		}

		this._defaultParams = {
			ajax: {
				route: '',
				target: '',
				method: 'get',
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
					in: 'animate__rollIn',
					out: 'animate__rollOut',
					delay: 300,
					duration: 700
				},
			},
			mode: 'confirm',
			theme: 'danger',
			buttons: {},
			message: {},
		};

		this._params = this._setParams(params);
	}

	static call(options = {}) {
		const context = new VGAlert(options);
		let modal = context._buildModal();
		modal.show();

		let container = modal._element,
			agreeBtn = Selectors.find('[data-vg-alert-agree]', container),
			cancelBtn = Selectors.find('[data-vg-alert-cancel]', container);

		return new Promise((resolve, reject) => {
			const handleAgree = () => {
				cleanup();
				resolve({
					accepted: true,
					timestamp: new Date(),
				});
				modal.hide();
			};

			const handleCancel = () => {
				modal.hide();
			};

			const cleanup = () => {
				if (agreeBtn) agreeBtn.removeEventListener('click', handleAgree);
				if (cancelBtn) cancelBtn.removeEventListener('click', handleCancel);
			};

			if (context._params.mode === 'confirm') {
				if (agreeBtn) agreeBtn.addEventListener('click', handleAgree);
				if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);

				container.addEventListener('vg.modal.hide', () => {
					cleanup();

					reject({
						accepted: false,
						timestamp: new Date(),
					});
				})
			}

			if (context._params.mode === 'info') {
				if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);

				container.addEventListener('vg.modal.hide', () => {
					cleanup();

					reject({
						accepted: false,
						timestamp: new Date(),
					});
				})
			}
		})
	}

	static confirm(elem, options = {}) {
		let context = new VGAlert(options);
		if (context._params.mode !== 'confirm') return;

		const instance = VGAlertConfirm.getOrCreateInstance(elem, context._params);
		instance.run(VGAlert);
	}

	_setParams(params) {
		params = mergeDeepObject(this._defaultParams, params);
		params.buttons = mergeDeepObject(this._elementsDefault.buttons, params.buttons);
		params.message = mergeDeepObject(this._elementsDefault.message, params.message);
		params.icon = this._elementsDefault.icons[params.theme];

		return params;
	}

	_buildModal() {
		let id = 'vg-alert-' + makeRandomString(),
			$modal = Selectors.find('.vg-alert-modal');

		if ($modal) $modal.remove();

		return VGModal.build(id, this._params.modal, (self) => {
			let element = self._element;
			element.classList.add('vg-alert-modal');

			let $body = Selectors.find('.vg-modal-body', element);
			if ($body) {
				let wrapper = document.createElement('div');
				Classes.add(wrapper, 'vg-alert-wrapper');

				if (this._params.type === 'danger') {
					Classes.add(wrapper, 'vg-alert-danger');
				}

				let content = document.createElement('div');
				Classes.add(content, 'vg-alert-content');

				let icon = document.createElement('div');
				Classes.add(icon, 'vg-alert-content--icon');
				this._create(icon, 'icons', this._params.type);

				let message = document.createElement('div');
				Classes.add(message, 'vg-alert-content--message');

				let title = document.createElement('div');
				Classes.add(title, 'vg-alert-content--title');
				this._create(title, 'messages', 'title');

				let description = document.createElement('div');
				Classes.add(description, 'vg-alert-content--description');
				this._create(description, 'messages', 'description');

				message.append(title);
				message.append(description);

				if (this._params.icon) content.append(icon);
				content.append(message);

				let buttons = document.createElement('div');
				Classes.add(buttons, 'vg-alert-buttons');

				if (this._params.mode === 'confirm') {
					this._create(buttons, 'button', 'cancel');
					this._create(buttons, 'button', 'agree');
				}

				if (this._params.mode === 'info') {
					this._create(buttons, 'button', 'cancel');
				}

				wrapper.append(content);
				wrapper.append(buttons);
				$body.append(wrapper);
			}
		});
	}

	_create(container, element, mode) {
		if (element === 'button') {
			let button = this._params.buttons[mode];
			if (button.element) {
				return container.innerHTML += button.element;
			} else {
				if (!button.tag) return;

				let btn = document.createElement(button.tag);
				Classes.add(btn, button.class.join(' '));

				if (button.attr) {
					let attr = button.attr;
					for (const key in attr) {
						Manipulator.set(btn, key, attr[key]);
					}
				}

				Manipulator.set(btn, button.toggle, true);
				btn.innerHTML = button.text;

				container.append(btn);
			}
		}

		if (element === 'icons') {
			if (this._params.icon) {
				container.innerHTML = this._params.elements.icon;
			}
		}

		if (element === 'messages') {
			if (this._params.message) {
				container.innerHTML = this._params.message[mode];
			}
		}
	}
}


/**
 * Constants
 */
const NAME      = 'alert';
const NAME_KEY  = 'vg.alert';

const SELECTOR_DATA_TOGGLE          = '[data-vg-toggle="alert"]';
const EVENT_KEY_CLICK_DATA_API      = `click.${NAME_KEY}.data.api`;

const EVENT_KEY_LOADED              = 'vg.alert.loaded';
const EVENT_KEY_ACCEPT              = 'vg.alert.accept';
const EVENT_KEY_REJECT              = 'vg.alert.reject';

class VGAlertConfirm extends BaseModule {
	constructor(element, options = {}) {
		super(element);

		this._params = this._getParams(this._element, mergeDeepObject({

		}, options));
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	run(self) {
		if (this._params.mode !== 'confirm') return;

		self.call(this._params).then((resolve) => {
			if (resolve.accepted) {
				if (this._params.ajax.route) {
					return this._ajax()
				} else {
					return resolve;
				}
			}
		}).then((response) => {
			EventHandler.trigger(this._element, EVENT_KEY_ACCEPT, {vgalert: response});
		}).catch((error) => {
			EventHandler.trigger(this._element, EVENT_KEY_REJECT, {vgalert: error});
		})
	}
	_ajax() {
		return new Promise((resolve) => {
			this._route((status, data) => {
				EventHandler.trigger(this._element, EVENT_KEY_LOADED, {stats: status, data: data});

				resolve({
					status: status,
					data: data
				});
			})
		});
	}
}

EventHandler.on(document, EVENT_KEY_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (event) => {
	event.preventDefault();

	let target = event.target;
	if (!isVisible(target) || !isElement(target)) return;

	VGAlert.confirm(target, {
		message: {
			title: 'Удалить этот товар',
			description: 'Внимание этот товар будет удален'
		},
		buttons: {
			agree: {
				class: ['btn', 'btn-primary'],
			},
			cancel: {
				class: ['btn', 'btn-outline-primary'],
			}
		}
	});
})

export default VGAlert;