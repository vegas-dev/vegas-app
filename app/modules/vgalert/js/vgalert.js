import {execute, makeRandomString, mergeDeepObject, noop} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGModal from "../../vgmodal";
import {getSVG} from "../../module-fn";
import {Classes, Manipulator} from "../../../utils/js/dom/manipulator";

/**
 * Constants
 */

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
					class: [],
					text: 'На всё согласен'
				},
				cancel: {
					element: '',
					tag: 'button',
					attr: {
						type: 'button',
					},
					toggle: 'data-vg-alert-cancel',
					class: [],
					text: 'Пошли на хуй'
				}
			},
			message: {
				title: 'Удалить это гавно',
				description: 'Вы действительно собираетесь удалить всё это гавно с Вашего сайта?',
			},
			icons: {
				danger: getSVG('danger'),
				success: getSVG('success'),
				info: getSVG('info'),
			}
		}

		this._defaultParams = {
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
			callbacks: {
				init: noop,
				accept: noop,
				cancel: noop,
			},
			buttons: {},
			message: {},
		};

		this._params = this.setParams(params);
	}

	setParams(params) {
		params = mergeDeepObject(this._defaultParams, params);
		params.buttons = mergeDeepObject(this._elementsDefault.buttons, params.buttons);
		params.message = mergeDeepObject(this._elementsDefault.message, params.message);
		params.icon = this._elementsDefault.icons[params.theme];

		return params;
	}

	static call(options = {}) {
		const context = new VGAlert(options);
		let modal = context._buildModal();
		modal.show();

		execute(context._params.callbacks.init, [context])

		let container = modal._element,
			agreeBtn = Selectors.find('[data-vg-alert-agree]', container),
			cancelBtn = Selectors.find('[data-vg-alert-cancel]', container);

		return new Promise((resolve, reject) => {
			if (context._params.mode === 'confirm') {
				const handleAgree = () => {
					cleanup();
					resolve({
						accepted: true,
						timestamp: new Date(),
						message: 'Пользователь согласился',
					});
					modal.hide();
				};

				const handleCancel = () => {
					modal.hide();
				};

				const cleanup = () => {
					agreeBtn.removeEventListener('click', handleAgree);
					cancelBtn.removeEventListener('click', handleCancel);
				};

				agreeBtn.addEventListener('click', handleAgree);
				cancelBtn.addEventListener('click', handleCancel);

				container.addEventListener('vg.modal.hide', () => {
					cleanup();
					reject(new Error('Пользователь отказался'));
				})
			}
		})
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

				content.append(icon);
				content.append(message);

				let buttons = document.createElement('div');
				Classes.add(buttons, 'vg-alert-buttons');
				this._create(buttons, 'button', 'cancel');

				if (this._params.mode === 'confirm') {
					this._create(buttons, 'button', 'agree');
				}

				wrapper.append(content);
				$body.append(wrapper);
				$body.append(buttons);
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


export default VGAlert;