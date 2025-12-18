import BaseModule from "../../base-module";
import VGModal from "../../vgmodal/js/vgmodal";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import VGHideShowPass from "./hideshowpass";
import lang from "../../../utils/js/components/lang";
import Html from "../../../utils/js/components/templater";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import {getSVG} from "../../module-fn";
import {
	execute,
	isObject,
	isVisible,
	makeRandomString,
	mergeDeepObject,
	noop,
	normalizeData
} from "../../../utils/js/functions";

/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.fs';

/**
 * Constants Events
 */
const CLASS_NAME_ALERT  = 'vg-form-sender-alert';

const EVENT_KEY_SUCCESS = 'vg.fs.success';
const EVENT_KEY_ERROR   = 'vg.fs.error';
const EVENT_KEY_BEFORE  = 'vg.fs.before';

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
				loader: false,
				output: true
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
				afterSend: noop,
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
			sanitizer: {
				allowedTags: ['div', 'span', 'p', 'a', 'img', 'table', 'tr' ,'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
				allowedAttributes: {
					'a': ['href', 'class'],
					'img': ['src', 'alt']
				},
				allowedSchemes: ['https', 'mailto']
			}
		}, params));

		this._button = null;
		this._cachedElements = new Map();

		this._initElements();

		let m = lang('ru', 'titles', 'errors');
		console.log(m)
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	_initElements() {
		this._button = Selectors.find('[type="submit"]', this._element) ||
			Selectors.find('[form="' + this._element.id + '"]') ||
			null;

		const fields = Selectors.findAll('input, textarea, select', this._element);
		this._cachedElements.set('fields', fields);

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

	build() {
		this._element.classList.add(this._params.classes.general);

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

		if (this._params.pass.enabled) {
			[... Selectors.findAll('input[type="password"]', this._element)].forEach((el) => {
				VGHideShowPass.init(el, this._params.pass);
			})
		}

		execute(this._params.callback.afterInit, [this._element, this]);

		return this
	}

	request(event, data = null) {
		const _this = this;
		const mergeFormData = (target, source) => {
			source.forEach((value, key) => {
				target.set(key, value);
			});
			return target;
		}

		_this._alertBefore();

		const submit = () => {
			let formData = new FormData(_this._element);

			if (data) _this._params.ajax.data = mergeFormData(data, formData);
			else _this._params.ajax.data = formData;

			_this._route(function (status, data) {
				execute(_this._params.callback.afterSend, [_this._element, _this, status, data]);

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

	_statusButton(status) {
		if (!this._button) return;

		if (status === 'before') {
			const button = this._button;

			this._params.button.initial = this._button.innerHTML.trim();

			if (this._params.button.spinner.enabled) {
				this._button.insertAdjacentHTML('afterbegin', this._params.button.spinner.element);
			}

			if (this._params.button.enabled) {
				button.innerHTML = this._params.button.send
			}

			if (this._params.button.disabled) {
				Manipulator.set(this._button,'disabled', 'disabled');
			}

			execute(this._params.button.click, [this, this._button, 'before'])
		}

		if (status === 'after') {
			if (this._params.button.enabled) {
				this._button.innerHTML = this._params.button.initial;
			}

			if (this._params.button.disabled) {
				Manipulator.remove(this._button,'disabled');
			}

			if (this._params.button.spinner.enabled) {
				let spinner = this._button.querySelector('.spinner-border');
				if (spinner) spinner.remove();
			}

			execute(this._params.button.click, [this, this._button, 'after'])
		}
	}

	_jsonParse(data, status) {
		const _this = this;

		if (_this._params.isJsonParse) {
			_this.alert(normalizeData(data), status);
		} else {
			_this.alert(data, status);
		}
	}

	alert(data, status) {

		if (isObject(data)) {
			if (('code' in data) && data.code && data.code === 200) {
				if ('response' in data && data.response) {
					let response = normalizeData(data.response);
					if (typeof response === 'string') {
						if (response.indexOf("Parse error") !== -1 || response.indexOf("syntax error") !== -1) {
							status = 'danger';
							data = {
								response: {
									title: 'Error',
									message: 'Something went wrong, please repeat later'
								}
							}
						}
					} else {
						if ('errors' in response && normalizeData(response.errors)) {
							status = normalizeData(response.errors) ? 'danger' : 'success';
						}
					}
				}
			} else {
				status = 'danger'
			}
		}

		if (!this._params.alert.enabled) return;

		if (this._params.alert.type === 'modal') {
			this._alertModal(data, status)
		}

		if (this._params.alert.type === 'collapse') {
			this._alertCollapse(data, status)
		}
	}

	_alertModal(data, status) {
		const _this = this;

		// Есть ли открытые модалки, закрываем
		[...document.getElementsByClassName('modal')].forEach(function (element) {
			if (element && element.classList.contains('show')) {
				if (typeof bootstrap !== 'undefined') {
					let mBS = bootstrap.Modal?.getOrCreateInstance(element);
					mBS.hide();
				} else {
					console.warn('VGApp не удалось найти bootstrap, модалки не будут закрыты, попробуйте сделать это через коллбек afterSend.')
				}
			}
		});

		[...document.getElementsByClassName('vg-modal')].forEach(function (element) {
			if (element && element.classList.contains('show')) {
				const mVG = VGModal.getOrCreateInstance(element);
				mVG.hide([mVG]);
			}
		});

		let id = _this._params.classes.general + '-' + makeRandomString(),
			$modal = Selectors.find('.' + _this._params.classes.alertModal);

		if ($modal) $modal.remove();

		setTimeout(() => {
			VGModal.init(id, {
				dismiss: true,
				classes: {
					alert: _this._params.classes.alertModal
				}
			}, function (self) {
				let element = self._element;
				element.classList.add(_this._params.classes.alertModal);

				let $content = Selectors.find('.vg-modal-content', element);
				if ($content) $content.classList.add(CLASS_NAME_ALERT, CLASS_NAME_ALERT + '-' + status);

				console.log(element)

				let $body = Selectors.find('.vg-modal-body', element);
				if ($body) $body.append(_this.setDataRelationStatus(element, status, data, 'modal'));

				self.toggle();

				if (_this._params.alert.delay > 0) {
					setTimeout(() => {
						self.hide();
					}, _this._params.alert.delay)
				}
			});
		}, _this._params.timeout);
	}

	_alertCollapse(data, status) {
		const _this = this;

		let $collapse = Selectors.find('.' + _this._params.classes.alertCollapse);
		if (!$collapse) {
			$collapse = document.createElement('div');
			$collapse.classList.add(_this._params.classes.alertCollapse);
			$collapse.classList.add('vg-collapse');
			$collapse.id = _this._params.classes.general + '-' + makeRandomString();
			$collapse.append(_this.setDataRelationStatus($collapse, status, data, 'collapse'));

			_this._element.prepend($collapse);
		}

		let collapse = VGCollapse.getOrCreateInstance($collapse, {toggle: false});
		collapse.toggle();

		if (_this._params.alert.delay > 0) {
			setTimeout(() => {
				collapse.hide();
			}, _this._params.alert.delay)
		}
	}

	setDataRelationStatus($element, status, data, type) {
		let response = normalizeData(data.response) || data,
			$alert = Selectors.find('.'+ CLASS_NAME_ALERT +'-content', $element);

		if (isObject(data)) {
			let view = '';

			if ('view' in data.response) {
				response = data.response.view
			} else if (typeof response !== 'string') {
				if (status === 'danger') {
					response.title = 'Error';

					if ('code' in data && data.code !== 200) {
						const messages = {
							400: 'Bad Request',
							401: 'Unauthorized',
							403: 'Forbidden',
							404: 'Not Found',
							413: 'Payload Too Large',
							419: 'Problems with the CSRF token',
							422: 'Unprocessable Entity',
							500: 'Internal Server Error',
							504: 'Gateway Timeout'
						};
						response.message = messages[data.code] || 'Something went wrong, please repeat later';
						response.title += ' (' + data.code + ')';
					}

					if ('errors' in response && this._params.alert.errors) {
						let errors = normalizeData(response.errors) || null;
						response.message = [];

						if (isObject(errors)) {
							for (const error in errors) {
								if (Array.isArray(errors[error])) {
									errors[error].forEach((t) => response.message.push(t))
								} else {
									response.message.push(errors[error]);
								}
							}
						}
					}
				}

				const elm = Html('string');

				view = elm.h4({class: CLASS_NAME_ALERT +'-content--title'}, response.title);

				if (Array.isArray(response.message)) {
					response.message.forEach(message => {
						view += elm.div({
							class: CLASS_NAME_ALERT +'-content--message'
						}, message);
					})
				} else {
					view += elm.div({
						class: CLASS_NAME_ALERT +'-content--message'
					}, response.message);
				}

				response = view;
			}
		}

		if (!$alert) {
			const elm = Html('dom');

			$alert = elm.div({
				class: CLASS_NAME_ALERT + '-' + type
			}, [
				elm.div({class: CLASS_NAME_ALERT + '-content'}, [
					elm.i({class: CLASS_NAME_ALERT + '-content--icon'}, getSVG(status), {isHTML: true}),
					elm.div({class: CLASS_NAME_ALERT + '-content--text'}, response, {isHTML: true})
				]),
			]);
		} else {
			let text = Selectors.find('.vg-modal-body', $element);
			text.innerHTML = response;
		}

		return $alert;
	}

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 */
	static init(element, params = {}) {
		const instance = VGFormSender.getOrCreateInstance(element, params);
		instance.build();
	}

	static buttonClick(formID, callback, status = 'before') {
		const form = Selectors.find(formID);
		if (form) {
			const instance = VGFormSender.getOrCreateInstance(form);
			form.addEventListener('vg.fs.' + status, e => {
				execute(callback, [form, instance])
			})
		}
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
					let keys = Object.keys(field);
					keys.forEach(function(key) {
						let value = normalizeData(field[key]);

						if (Array.isArray(value) || isObject(value)) {
							data.append(key, JSON.stringify(value));
						} else {
							data.append(key, value);
						}
					});
				}
			});

			return data;
		}

		let data = new FormData(instance._element),
			fields = instance._params.fields;

		if (Array.isArray(fields) && fields.length) {
			data = collectData(data, fields);
		}

		return instance.request(event, data);
	}
})

export default VGFormSender;