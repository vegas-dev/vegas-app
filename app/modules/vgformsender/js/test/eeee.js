import BaseModule from "../../base-module";
import { Manipulator } from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import VGModal from "../../vgmodal/js/vgmodal";
import {
	execute,
	getDeepestLastChild,
	isObject,
	isVisible,
	makeRandomString,
	mergeDeepObject,
	noop,
	normalizeData
} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import { getSVG } from "../../module-fn";
import VGHideShowPass from "./hideshowpass";
import { Sanitizer } from "../../../utils/js/components/templater";

/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.fs';

/**
 * Constants Events
 */
const CLASS_NAME_ALERT = 'vg-form-sender-alert';

const EVENT_KEY_SUCCESS = 'vg.fs.success';
const EVENT_KEY_ERROR = 'vg.fs.error';
const EVENT_KEY_BEFORE = 'vg.fs.before';

const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

class VGFormSender extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			response: {
				enabled: false,
				errors: false,
				title: '',
				message: '',
			},
			redirect: {
				error: '',
				success: ''
			},
			validate: false,
			submit: false,
			fields: [],
			timeout: 50,
			pass: {
				enabled: true,
				template: 'pass-open',
				classes: ['vg-form-sender--hide-show-pass'],
				insert: 'afterend'
			},
			alert: {
				enabled: true,
				type: 'modal',
				errors: true,
				delay: 0
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
				timeout: 1000,
			},
			classes: {
				general: 'vg-form-sender',
				alertCollapse: 'vg-form-sender-collapse',
				alertModal: 'vg-form-sender-modal',
				validation: 'needs-validation',
				wasValidate: 'was-validated',
				content: 'vg-form-sender--content'
			},
			callback: {
				afterInit: noop,
				afterSuccess: noop,
				afterError: noop,
			},
			interceptors: {
				beforeSend: () => new Promise((resolve, reject) => resolve()),
				success: false,
				error: false
			},
			button: {
				enabled: true,
				disabled: true,
				send: 'Отправляем...',
				initial: 'Отправить',
				spinner: {
					enabled: false,
					element: '<span class="spinner-border spinner-border-sm me-2"></span>'
				},
				click: noop,
			},
		}, params));

		// Кэшируем элементы
		this._button = null;
		this._cachedElements = new Map();

		this._initElements();
	}

	/**
	 * Инициализация и кэширование DOM-элементов
	 * @private
	 */
	_initElements() {
		// Кэшируем основные элементы
		this._button = Selectors.find('[type="submit"]', this._element) ||
			Selectors.find('[form="' + this._element.id + '"]') ||
			null;

		// Кэшируем поля формы
		const fields = Selectors.findAll('input, textarea, select', this._element);
		this._cachedElements.set('fields', fields);

		// Устанавливаем параметры
		this._params.ajax.route = Manipulator.get(this._element, 'action') || this._params.ajax.route;
		this._params.ajax.method = Manipulator.get(this._element, 'method') || this._params.ajax.method;

		this._params.isBtnText = Manipulator.get(this._element, 'data-btn-text') !== 'false';
		this._params.isJsonParse = Manipulator.get(this._element, 'data-json-parse') !== 'false';
		this._params.isShowPass = Manipulator.get(this._element, 'data-show-pass') === 'true';

		if (this._button) {
			this._params = this._getParams(this._button, this._params);
			this._params.button.initial = this._button.innerHTML.trim() || this._params.button.initial;
		}
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	build() {
		this._element.classList.add(this._params.classes.general);

		// Используем кэшированные поля
		const fields = this._cachedElements.get('fields');
		if (fields) {
			fields.forEach((el) => {
				if (isVisible(el) && el.parentElement) {
					el.parentElement.classList.add(this._params.classes.content);
				}
			});
		}

		if (this._params.validate) {
			Manipulator.set(this._element, 'novalidate', '');
			this._element.classList.add(this._params.classes.validation);
		}

		execute(this._params.callback.afterInit, [this._element, this]);

		return this;
	}

	request(event, data = null) {
		const _this = this;
		const mergeFormData = (target, source) => {
			source.forEach((value, key) => {
				target.set(key, value);
			});
			return target;
		};

		_this._alertBefore();

		const submit = () => {
			let formData = new FormData(_this._element);

			if (data) _this._params.ajax.data = mergeFormData(data, formData);
			else _this._params.ajax.data = formData;

			_this._route(function (status, data) {
				_this._element.classList.remove('was-validated');

				if (_this._params.response.enabled) {
					data.response = _this._params.response;
				}

				if (_this._params.alert.enabled) {
					if (typeof status === 'string' && status === 'error') {
						if (_this._params.redirect.error) {
							window.location.href = _this._params.redirect.error;
						} else {
							if (!_this._params.interceptors.error) {
								_this._alertError(event, data);
								execute(_this._params.callback.afterError, [_this._element, _this, event, data]);
							} else {
								execute(_this._params.callback.afterError, [_this._element, _this, event, data]);
							}
						}
					} else if (typeof status === 'string' && status === 'success') {
						if (_this._params.redirect.success) {
							window.location.href = _this._params.redirect.success;
						} else {
							if (!_this._params.interceptors.success) {
								_this._alertSuccess(event, data);
								execute(_this._params.callback.afterSuccess, [_this._element, _this, event, data]);
							} else {
								execute(_this._params.callback.afterSuccess, [_this._element, _this, event, data]);
							}
						}
					}
				}
			});
		};

		_this._params.interceptors.beforeSend().then(() => {
			submit();
		}).catch(err => {
			console.error(err);
		});
	}

	_alertBefore() {
		const _this = this;

		if (_this._params.alert.type === 'collapse') {
			// Кэшируем поиск collapse
			const collapseClass = _this._params.classes.alertCollapse;
			if (!_this._cachedElements.has('collapses') || document.querySelector('.' + collapseClass + '.show')) {
				const collapses = document.getElementsByClassName(collapseClass);
				_this._cachedElements.set('collapses', collapses);

				[...collapses].forEach(function (element) {
					if (element.classList.contains('show')) {
						VGCollapse.getOrCreateInstance(element, { toggle: false }).hide();
					}
				});
			}
		}

		_this._statusButton('before');
		EventHandler.trigger(_this._element, EVENT_KEY_BEFORE, _this);
	}

	_alertError(event, data) {
		const _this = this;

		_this._statusButton('after');
		_this._jsonParse(data, 'error');
		EventHandler.trigger(_this._element, EVENT_KEY_ERROR, {
			vgformsender: {
				event: event,
				self: _this,
				data: data
			}
		});
	}

	_alertSuccess(event, data) {
		const _this = this;

		_this._statusButton('after');
		_this._jsonParse(data, 'success');
		EventHandler.trigger(_this._element, EVENT_KEY_SUCCESS, {
			vgformsender: {
				event: event,
				self: _this,
				data: data
			}
		});
	}

	static buttonClick(formID, callback, status = 'before') {
		const form = Selectors.find(formID);
		if (form) {
			const instance = VGFormSender.getOrCreateInstance(form);
			form.addEventListener('vg.fs.' + status, e => {
				execute(callback, [form, instance]);
			});
		}
	}

	_statusButton(status) {
		if (!this._button) return;

		if (status === 'before') {
			this._params.button.initial = this._button.innerHTML.trim();

			if (this._params.button.spinner.enabled) {
				this._button.insertAdjacentHTML('afterbegin', this._params.button.spinner.element);
			}

			if (this._params.button.enabled) {
				this._button.innerHTML = this._params.button.send;
			}

			if (this._params.button.disabled) {
				Manipulator.set(this._button, 'disabled', 'disabled');
			}

			execute(this._params.button.click, [this, this._button, 'before']);
		}

		if (status === 'after') {
			if (this._params.button.enabled) {
				this._button.innerHTML = this._params.button.initial;
			}

			if (this._params.button.disabled) {
				Manipulator.remove(this._button, 'disabled');
			}

			if (this._params.button.spinner.enabled) {
				const spinner = this._button.querySelector('.spinner-border');
				if (spinner) spinner.remove();
			}

			execute(this._params.button.click, [this, this._button, 'after']);
		}
	}

	_jsonParse(data, status) {
		const _this = this;

		if (_this._params.isJsonParse && typeof data === 'string') {
			try {
				const parserData = JSON.parse(data);
				_this.alert(parserData, status);
			} catch (e) {
				_this.alert(data, status);
			}
		} else {
			_this.alert(data, status);
		}
	}

	alert(data, status) {
		const _this = this;

		if (isObject(data)) {
			if (('code' in data) && data.code && data.code === 200) {
				if ('response' in data && data.response) {
					let response = normalizeData(data.response);
					if (typeof response === 'string') {
						if (response.indexOf("Parse error") !== -1 || response.indexOf("syntax error") !== -1) {
							status = 'error';
							data = {
								response: {
									title: 'Error',
									message: 'Something went wrong, please repeat later'
								},
								text: 'Something went wrong, please repeat later'
							};
						}
					} else {
						if ('errors' in response && normalizeData(response.errors)) {
							status = normalizeData(response.errors) ? 'danger' : 'success';
						}
					}
				}
			}
		}

		if (!_this._params.alert.enabled) {
			return;
		}

		if (_this._params.alert.type === 'modal') {
			_this._alertModal(data, status);
		}

		if (_this._params.alert.type === 'collapse') {
			_this._alertCollapse(data, status);
		}
	}

	_alertModal(data, status) {
		const _this = this;

		// Кэшируем поиск модалок
		const modals = document.querySelectorAll('.modal.show, .vg-modal.show');
		modals.forEach(element => {
			if (element.classList.contains('modal') && window.bootstrap?.Modal) {
				const bsModal = window.bootstrap.Modal.getInstance(element);
				if (bsModal) bsModal.hide();
			}
			if (element.classList.contains('vg-modal')) {
				const vgModal = VGModal.getInstance(element);
				if (vgModal) vgModal.hide();
			}
		});

		const randomId = _this._params.classes.general + '-' + makeRandomString();
		const $modal = document.querySelector('.' + _this._params.classes.alertModal);
		if ($modal) $modal.remove();

		setTimeout(() => {
			VGModal.init(randomId, {
				classes: {
					alert: _this._params.classes.alertModal
				}
			}, function (self) {
				const element = self._element;
				element.classList.add(_this._params.classes.alertModal);

				const $body = element.querySelector('.vg-modal-body');
				if ($body) {
					$body.innerHTML = '';
					$body.appendChild(_this.setDataRelationStatus(element, status, data, 'modal'));
				}

				self.toggle();

				if (_this._params.alert.delay > 0) {
					setTimeout(() => self.hide(), _this._params.alert.delay);
				}
			});
		}, _this._params.timeout);
	}

	_alertCollapse(data, status) {
		const _this = this;

		let $collapse = document.querySelector('.' + _this._params.classes.alertCollapse);
		if (!$collapse) {
			$collapse = document.createElement('div');
			$collapse.classList.add(_this._params.classes.alertCollapse, 'vg-collapse');
			$collapse.id = _this._params.classes.general + '-' + makeRandomString();
			$collapse.appendChild(_this.setDataRelationStatus($collapse, status, data, 'collapse'));
			_this._element.prepend($collapse);
		} else {
			// Обновляем содержимое существующего collapse
			const existingAlert = $collapse.querySelector(`.${CLASS_NAME_ALERT}`);
			if (existingAlert) {
				$collapse.removeChild(existingAlert);
			}
			$collapse.appendChild(_this.setDataRelationStatus($collapse, status, data, 'collapse'));
		}

		const collapse = VGCollapse.getOrCreateInstance($collapse, { toggle: false });
		collapse.show();

		if (_this._params.alert.delay > 0) {
			setTimeout(() => collapse.hide(), _this._params.alert.delay);
		}
	}

	setDataRelationStatus($element, status, data, type) {
		if (status === 'error') status = 'danger';

		// Проверяем существование alert через кэшированный селектор
		let $alert = $element.querySelector(`.${CLASS_NAME_ALERT}-${status}`);
		if (!$alert) {
			$alert = document.createElement('div');
			$alert.className = `${CLASS_NAME_ALERT} ${CLASS_NAME_ALERT}-${status} ${CLASS_NAME_ALERT}-${type}`;

			const content = document.createElement('div');
			content.className = `${CLASS_NAME_ALERT}-content`;

			const icon = document.createElement('div');
			icon.className = `${CLASS_NAME_ALERT}-content--icon`;
			icon.innerHTML = getSVG(status);

			const text = document.createElement('div');
			text.className = `${CLASS_NAME_ALERT}-content--text`;

			if (isObject(data) && 'view' in data) {
				text.innerHTML = data.view;
			} else {
				text.textContent = typeof data === 'string' ? data : JSON.stringify(data);
			}

			content.append(icon, text);
			$alert.append(content);
		} else {
			const textEl = $alert.querySelector(`.${CLASS_NAME_ALERT}-content--text`);
			if (textEl) {
				if (isObject(data) && 'view' in data) {
					textEl.innerHTML = data.view;
				} else {
					textEl.textContent = typeof data === 'string' ? data : JSON.stringify(data);
				}
			}
		}

		return $alert;
	}

	static init(element, params = {}) {
		const instance = VGFormSender.getOrCreateInstance(element, params);
		instance.build();
	}
}

EventHandler.on(document, EVENT_SUBMIT_DATA_API, function (event) {
	if (!Manipulator.has(event.target, 'data-vgformsender')) {
		return;
	}

	const instance = VGFormSender.getOrCreateInstance(event.target, {});
	if (!instance) {
		return;
	}

	if (instance._params.validate) {
		if (!instance._element.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
			instance._element.classList.add(instance._params.classes.wasValidate);
			return false;
		}
	}

	if (!instance._params.submit) {
		event.preventDefault();

		const collectData = function(data, fields) {
			fields.forEach(function(field) {
				if (isObject(field)) {
					Object.keys(field).forEach(function(key) {
						let value = normalizeData(field[key]);
						data.append(key, Array.isArray(value) || isObject(value) ? JSON.stringify(value) : value);
					});
				}
			});
			return data;
		};

		let data = new FormData(instance._element);
		const fields = instance._params.fields;

		if (Array.isArray(fields) && fields.length) {
			data = collectData(data, fields);
		}

		return instance.request(event, data);
	}
});

export default VGFormSender;