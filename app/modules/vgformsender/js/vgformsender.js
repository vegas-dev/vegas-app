import BaseModule from "../../base-module";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import VGModal from "../../vgmodal/js/vgmodal";
import {
	execute, getDeepestLastChild,
	isObject,
	isVisible,
	makeRandomString,
	mergeDeepObject,
	noop,
	normalizeData
} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import {getSVG} from "../../module-fn";
import VGHideShowPass from "./hideshowpass";

/**
 * TODO
 * доделай динамическое добавление полей в форму,
 * но не меняй место их получения (их нужно получить прямо перед отправкой, после того как выполнился промис beforeSend)
 */

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
				}
			},
		}, params));

		this._params.ajax.route = Manipulator.get(this._element, 'action').toLowerCase();
		this._params.ajax.method = Manipulator.get(this._element, 'method').toLowerCase();
		this._button = Selectors.find('[type="submit"]', this._element) || Selectors.find('[form="' + this._element.id + '"]') || null;

		this._params.isBtnText   = Manipulator.get(this._element, 'data-btn-text') !== 'false';
		this._params.isJsonParse = Manipulator.get(this._element, 'data-json-parse') !== 'false';
		this._params.isShowPass  = Manipulator.get(this._element, 'data-show-pass') === 'true';

		this._params = this._getParams(this._button, this._params);
		this._params.button.initial = this._button.innerHTML || this._params.button.initial;
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	build() {
		this._element.classList.add(this._params.classes.general);

		[... Selectors.findAll('input, textarea, select', this._element)].forEach((el) => {
			if (isVisible(el)) {
				el.parentElement.classList.add(this._params.classes.content)
			}
		});

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

	request(data, event) {
		const _this = this;

		_this._alertBefore();

		const submit = () => {
			_this._params.ajax.data = new FormData(_this._element);
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
		});
	}

	_alertBefore() {
		const _this = this;

		if (_this._params.alert.type === 'collapse') {
			[...document.getElementsByClassName(_this._params.classes.alertCollapse)].forEach(function (element) {
				if (element && element.classList.contains('show')) {
					VGCollapse.getOrCreateInstance(element, {toggle: false}).hide();
				}
			});
		}

		_this._statusButton('before');
		EventHandler.trigger(_this._element, EVENT_KEY_BEFORE, _this);
	}

	_alertError(event, data) {
		const _this = this;

		_this._statusButton('after');
		_this._jsonParse(data, 'error');
		EventHandler.trigger(_this._element, EVENT_KEY_ERROR, [event, _this, data]);
	}

	_alertSuccess(event, data) {
		const _this = this;

		_this._statusButton('after');
		_this._jsonParse(data, 'success');
		EventHandler.trigger(_this._element, EVENT_KEY_SUCCESS, [event, _this, data]);
	}

	_statusButton(status) {
		if (!this._button) return;

		if (status === 'before') {
			const button = getDeepestLastChild(this._button) || this._button;

			if (this._params.button.spinner.enabled) {
				this._button.insertAdjacentHTML('afterbegin', this._params.button.spinner.element);
			}

			if (this._params.button.enabled) {
				button.innerHTML = this._params.button.send
			}

			if (this._params.button.disabled) {
				Manipulator.set(this._button,'disabled', 'disabled');
			}
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
		}
	}

	_jsonParse(data, status) {
		const _this = this;

		if (_this._params.isJsonParse && typeof data === 'string') {
			let parserData = {};

			try {
				parserData = JSON.parse(data);
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
							}
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
			_this._alertModal(data, status)
		}

		if (_this._params.alert.type === 'collapse') {
			_this._alertCollapse(data, status)
		}
	}

	_alertModal(data, status) {
		const _this = this;

		// Есть ли открытые модалки, закрываем
		[...document.getElementsByClassName('modal')].forEach(function (element) {
			if (element && element.classList.contains('show')) {
				let mBS = bootstrap.Modal.getOrCreateInstance(element);
				mBS.hide();
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
				classes: {
					alert: _this._params.classes.alertModal
				}
			}, function (self) {
				let element = self._element;
				element.classList.add(_this._params.classes.alertModal);

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
		if (status === 'error') status = 'danger';

		let $alert = Selectors.find('.'+ CLASS_NAME_ALERT +'-' + status, $element);

		if (isObject(data)) {
			if (status === 'error') {
				if ('code' in data && data.code !== 200) {
					if ('text' in data && !data.text) {
						data.text = 'Something went wrong, please repeat later';

						switch (data.code) {
							case 400:
								data.text = 'Bad Request'
								break;
							case 401:
								data.text = 'Unauthorized'
								break;
							case 403:
								data.text = 'Unauthorized'
								break;
							case 413:
								data.text = 'Forbidden'
								break;
							case 404:
								data.text = 'Not Found'
								break;
							case 422:
								data.text = 'Unprocessable Entity'
								break;
							case 500:
								data.text = 'Internal Server Error'
								break;
							case 504:
								data.text = 'Gateway Timeout'
								break;
						}
					}
				}
			}

			if ('response' in data) {
				let response = normalizeData(data.response), title = '', txt = '', code = '';
				if (typeof response !== 'string') {
					if (!('view' in response)) {
						if ('title' in response) title = response.title;
						if (status === 'error' && data.code !== 200 && this._params.alert.errors) {
							code = ' ' + data.text + ' (' + data.code + ')';
						}

						if (!title) txt += '<h4 class="'+ CLASS_NAME_ALERT +'-content--title">' + code + '</h4>';
						else txt += '<h4 class="'+ CLASS_NAME_ALERT +'-content--title">' + title + '</h4>';

						if ('message' in response) {
							txt += '<div class="'+ CLASS_NAME_ALERT +'-content--message">' + response.message + '</div>'
						}

						if ('errors' in response && this._params.alert.errors) {
							let errors = normalizeData(response.errors) || null;
							if (isObject(errors)) {
								for (const error in errors) {
									if (Array.isArray(errors[error])) {
										errors[error].forEach(function (t) {
											txt += '<div>'+ t +'</div>';
										})
									} else {
										txt = '<div>'+ errors[error] +'</div>';
									}
								}
							}
						}

						data = {
							view: txt
						}
					}
				} else {
					data.view = response;
				}
			}
		}

		if (!$alert) {
			$alert = document.createElement('div');
			$alert.classList.add(CLASS_NAME_ALERT, CLASS_NAME_ALERT + '-' + status, CLASS_NAME_ALERT + '-' + type);

			let content = document.createElement('div');
			content.classList.add(CLASS_NAME_ALERT + '-content');

			let icon = document.createElement('div');
			icon.classList.add(CLASS_NAME_ALERT + '-content--icon');

			let i = document.createElement('i');
			i.innerHTML = getSVG(status);

			icon.append(i);
			content.append(icon);

			let text = document.createElement('div');
			text.classList.add(CLASS_NAME_ALERT + '-content--text');
			text.innerHTML = data.view;

			content.append(text);
			$alert.append(content);
		} else {
			let text = Selectors.find('.'+ CLASS_NAME_ALERT +'-content--text', $alert);
			text.innerHTML = data.view;
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

	/*const collectData = function(data, fields) {
		for (let name in fields) {
			if (typeof fields[name] === 'object') {
				for (let key in fields[name]) {
					let arr = Object.keys(fields[name][key]).map(function (i) {
						return fields[name][key][i];
					});
					data.append(name, arr);
				}
			} else {
				data.append(name, fields[name]);
			}
		}

		return data;
	}*/

	if (!instance._params.submit) {
		event.preventDefault();

		//let data = new FormData(instance._element);

		// TODO доделать
		/*if (Array.isArray(instance._params.ajax.fields) && instance._params.ajax.fields.length) {
			data = collectData(data, instance._params.ajax.fields);
		}*/

		return instance.request(event);
	}
})

export default VGFormSender;