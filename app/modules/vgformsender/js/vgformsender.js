import BaseModule from "../../base-module";
import {Manipulator} from "../../../utils/js/dom/manipulator";
import EventHandler from "../../../utils/js/dom/event";
import VGModal from "../../vgmodal/js/vgmodal";
import {makeRandomString, mergeDeepObject, normalizeData} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import {getSVG} from "../../module-fn";

/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.fs';

/**
 * Constants Classes
 */


/**
 * Constants Events
 */
const EVENT_KEY_SUCCESS = 'vg.fs.success';
const EVENT_KEY_ERROR   = 'vg.fs.error';
const EVENT_KEY_BEFORE  = 'vg.fs.before';

const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

class VGFormSender extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			redirect: '',
			validate: false,
			submit: false,
			fields: [],
			alert: {
				enabled: true,
				type: 'modal'
			},
			ajax: {
				route: '',
				target: '',
				method: 'get',
			},
			classes: {
				general: 'vg-form-sender',
				alertCollapse: 'vg-form-sender-collapse',
				alertModal: 'vg-form-sender-modal',
				validation: 'needs-validation',
				wasValidate: 'was-validated'
			}
		}, params));

		this._params.ajax.route = Manipulator.get(this._element, 'action').toLowerCase();
		this._params.ajax.method = Manipulator.get(this._element, 'method').toLowerCase();
		this._button = Selectors.find('[type="submit"]', this._element) || Selectors.find('[form="' + this._element.id + '"]') || null;

		this._params.isBtnText   = Manipulator.get(this._element, 'data-btn-text') !== 'false';
		this._params.isJsonParse = Manipulator.get(this._element, 'data-json-parse') !== 'false';
		this._params.isShowPass  = Manipulator.get(this._element, 'data-show-pass') === 'true';
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	build() {
		this._element.classList.add(this._params.classes.general);

		if (this._params.validate) {
			Manipulator.set(this._element, 'novalidate', '');
			this._element.classList.add(this._params.classes.validation);
		}

		// TODO сделать добавление глаза если есть ввод пароля

		return this
	}

	request(data, event) {
		const _this = this;

		_this._alertBefore();

		_this._params.ajax.fields = data;

		_this._route(function (status, data) {
			_this._element.classList.remove('was-validated');

			if (_this._params.alert.enabled) {
				if (typeof status === 'string' && status === 'error') {
					_this._alertError(event, data);
				} else if (typeof status === 'string' && status === 'success') {
					_this._alertSuccess(event, data);
				}
			}

			if (_this._params.redirect) {
				window.location.href = _this._params.redirect;
			}
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
		const _this = this;

		if (!_this._button) return;

		let btnSubmitText = _this._button,
			btnText = {
			send: 'Отправляем...',
			text: 'Отправить'
		};

		if (Manipulator.has(_this._button, 'data-spinner') && status === 'before') {
			_this._button.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm me-2"></span>');
		}

		if (Manipulator.has(_this._button, 'data-text')) {
			btnText.text = Manipulator.get(_this._button, 'data-text');
		} else {
			let $btnText = _this._button.querySelector('[data-text]');
			if ($btnText) {
				btnText.text = Manipulator.get($btnText, 'data-text');
				btnSubmitText = $btnText;
			}
		}

		if (Manipulator.has(_this._button, 'data-text-send')) {
			btnText.send = Manipulator.get(_this._button, 'data-text-send');
		} else {
			let $btnTextSend = _this._button.querySelector('[data-text-send]');
			if ($btnTextSend) {
				btnText.send = Manipulator.get($btnTextSend, 'data-text-send');
				btnSubmitText = $btnTextSend;
			}
		}

		if (status === 'before') {
			if (_this._params.isBtnText) {
				btnSubmitText.innerHTML = btnText.send;
			}
			Manipulator.set(_this._button,'disabled', 'disabled');
		}

		if (status === 'after') {
			if (_this._params.isBtnText) {
				btnSubmitText.innerHTML = btnText.text;
			}
			Manipulator.remove(_this._button,'disabled');

			let spinner = _this._button.querySelector('.spinner-border');
			if (spinner) spinner.remove();
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

		if (typeof data === "object") {
			if ('errors' in data) {
				status = normalizeData(data.errors) ? 'error' : 'success';
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
				mVG.hide();
			}
		});

		let $modal = Selectors.find('.' + _this._params.classes.alertModal);
		if ($modal) $modal.remove();

		let id = _this._params.classes.general + '-' + makeRandomString();
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
		});
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

		VGCollapse.getOrCreateInstance($collapse, {toggle: false}).toggle();
	}

	setDataRelationStatus($element, status, data, type) {
		let $alert = Selectors.find('.vg-alert-' + status, $element);

		if (typeof data === 'object') {
			if ('view' in data && typeof data.view === 'object') {
				let txt = '';

				if ('title' in data.view) {
					txt += '<h4 class="vg-alert-content--title">' + data.view.title + '</h4>'
				}

				if ('message' in data.view) {
					txt += '<div class="vg-alert-content--message">' + data.view.message + '</div>'
				}

				data = txt;
			} else if ('view' in data && typeof data.view === "string") {
				data = data.view;
			}
		}

		if (!$alert) {
			$alert = document.createElement('div');
			$alert.classList.add('vg-alert', 'vg-alert-' + status, 'vg-alert-' + type);

			let content = document.createElement('div');
			content.classList.add('vg-alert-content');

			let icon = document.createElement('div');
			icon.classList.add('vg-alert-content--icon');

			let i = document.createElement('i');
			i.innerHTML = getSVG(status);

			icon.append(i);
			content.append(icon);

			let text = document.createElement('div');
			text.classList.add('vg-alert-content--text');
			text.innerHTML = data;

			content.append(text);
			$alert.append(content);
		} else {
			let text = Selectors.find('.vg-alert-content--text', $alert);
			text.innerHTML = data;
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

	const collectData = function(data, fields) {
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
	}

	if (!instance._params.submit) {
		event.preventDefault();

		let data = new FormData(instance._element);
		if (typeof instance._params.ajax.fields === 'object') {
			data = collectData(data, instance._params.ajax.fields);
		}

		return instance.request(data, event);
	}
})

export default VGFormSender;