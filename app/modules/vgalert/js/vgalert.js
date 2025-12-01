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
		this._params = mergeDeepObject({
			modal: {
				centered: false,
				backdrop: true,
				overflow: true,
				keyboard: true,
				dismiss: true,
				animation: {
					enable: true,
					in: 'animate__rollIn',
					out: 'animate__rollOut',
					delay: 0,
				},
			},
			toast: {

			},
			elements: {
				buttons: {
					agree: {
						element: '',
						type: 'button',
						attr: {
							type: 'button',
							'data-vg-alert': 'success'
						},
						class: ['btn', 'btn-primary'],
						text: 'На всё согласен'
					},
					cancel: {
						element: '',
						type: 'button',
						attr: {
							type: 'button',
							'data-vg-dismiss': 'modal'
						},
						class: ['btn', 'btn-outline-primary'],
						text: 'Пошли на хуй'
					}
				},
				messages: {
					title: 'Удалить это гавно',
					description: 'Вы действительно собираетесь удалить всё это гавно с Вашего сайта?',
				},
				icons: {
					error: getSVG('error'),
					success: getSVG('success'),
					waiting: getSVG('waiting'),
				}
			},
			mode: 'confirm',
			type: 'danger',
			callbacks: {
				init: noop,
				accept: noop,
				cancel: noop,
			}
		}, params);
	}

	static call(options = {}) {
		const context = new VGAlert(options);
		let modal = context._buildModal();
		modal.show();

		execute(context._params.callbacks.init, [context])

		let container = modal._element,
			agreeBtn = Selectors.find('[data-vg-alert="success"]', container),
			cancelBtn = Selectors.find('[data-vg-dismiss="modal"]', container),
			messageDiv = Selectors.find('.vg-alert-message', container);


		return new Promise((resolve, reject) => {
			if (context._params.mode === 'confirm') {
				const handleAgree = () => {
					cleanup();
					messageDiv.innerHTML = '✅ Согласие получено!';
					resolve({
						accepted: true,
						timestamp: new Date(),
						message: 'Пользователь согласился',
					});
				};

				const handleCancel = () => {
					cleanup();
					messageDiv.innerHTML = '❌ Согласие отклонено';
					reject(new Error('Пользователь отказался'));
				};

				const cleanup = () => {
					agreeBtn.removeEventListener('click', handleAgree);
					cancelBtn.removeEventListener('click', handleCancel);
				};

				agreeBtn.addEventListener('click', handleAgree);
				cancelBtn.addEventListener('click', handleCancel);
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
				if (this._params.mode === 'confirm') {
					let wrapper = document.createElement('div');
					Classes.add(wrapper, 'vg-alert');

					if (this._params.type === 'danger') {
						Classes.add(wrapper, 'vg-alert-danger');
					}

					let content = document.createElement('div');
					Classes.add(content, 'vg-alert-content');

					let title = document.createElement('div');
					Classes.add(title, 'vg-alert-content--title');
					this._create(title, 'messages', 'title');

					let description = document.createElement('div');
					Classes.add(description, 'vg-alert-content--description');
					this._create(description, 'messages', 'description');

					let icon = document.createElement('div');
					Classes.add(icon, 'vg-alert-icon');
					this._create(icon, 'icons', 'error');

					let buttons = document.createElement('div');
					Classes.add(buttons, 'vg-alert-buttons');
					this._create(buttons, 'button', 'agree');
					this._create(buttons, 'button', 'cancel');

					content.append(title);
					content.append(description);
					wrapper.append(icon);
					wrapper.append(content);
					$body.append(wrapper);
					$body.append(buttons);
				}
			}
		});
	}

	_create(container, element, mode) {
		if (element === 'button') {
			if (this._params.elements.buttons[mode].element) {
				return container.innerHTML += this._params.elements.buttons[mode].element;
			} else {
				if (!this._params.elements.buttons[mode].type) return '';
				let button = document.createElement(this._params.elements.buttons[mode].type);
				Classes.add(button, this._params.elements.buttons[mode].class.join(' '));

				if (this._params.elements.buttons[mode].attr) {
					let attr = this._params.elements.buttons[mode].attr;
					for (const key in attr) {
						Manipulator.set(button, key, attr[key]);
					}
				}

				button.innerHTML = this._params.elements.buttons[mode].text;

				container.append(button);
			}
		}

		if (element === 'icons') {
			if (this._params.elements.icons[mode]) {
				return container.innerHTML = this._params.elements.icons[mode];
			}
		}

		if (element === 'messages') {
			if (this._params.elements.messages[mode]) {
				return container.innerHTML = this._params.elements.messages[mode];
			}
		}
	}
}


export default VGAlert;