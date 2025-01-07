import BaseModule from "../../base-module";
import {Manipulator} from "../../../_utils/js/manipulator";
import EventHandler from "../../../_utils/js/event";
import VGModal from "../../modal/js/vgmodal";
import params from "../../../_utils/js/params";
import {mergeDeepObject} from "../../../_utils/js/functions";

/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_FULL = 'vgformsender';
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
const EVENT_KEY_LOADED  = 'vg.fs.loaded';

const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

/**
 * Default Params
 */
const PARAMS_DEFAULT =  {
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
		validation: 'needs-validation',
		wasValidate: 'was-validated'
	}
};

class VGFormSender extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params.ajax.route = Manipulator.get(this._element, 'action');
	}

	static get Default() {
		return PARAMS_DEFAULT
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_FULL() {
		return NAME_FULL;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	build() {
		/*this.element.classList.add(this.params.classes.general);

		if (this.params.validate) {
			Manipulator.set(this.element, 'novalidate', '');
			this.element.classList.add(this.params.classes.validation);
		}*/

		// TODO сделать добавление глаза если есть ввод пароля

		return this
	}

	request(data, event) {
		const _this = this;

		_this._alertBefore();

		_this.params.ajax.fields = data;

		console.log(this.params)

		_this._route(function (status, data) {
			_this.element.classList.remove('was-validated');

			if (_this.params.alert.enabled) {
				if (typeof status === 'string' && status === 'error') {
					_this._alertError(event, data);
				} else if (typeof status === 'string' && status === 'success') {
					_this._alertSuccess(event, data);
				}
			}

			if (_this.params.redirect) {
				window.location.href = _this.params.redirect;
			}
		});
	}

	_alertBefore() {
		const _this = this;

		_this._statusButton('before');
		EventHandler.trigger(_this.element, EVENT_KEY_BEFORE, _this);
	}

	_alertError(event, data) {
		const _this = this;

		_this._statusButton('after');
		_this._jsonParse(data, 'error');
		EventHandler.trigger(_this.element, EVENT_KEY_ERROR, [event, _this, data]);
	}

	_alertSuccess(event, data) {
		const _this = this;

		_this._statusButton('after');
		_this._jsonParse(data, 'success');
		EventHandler.trigger(_this.element, EVENT_KEY_SUCCESS, [event, _this, data]);
	}

	_statusButton(status) {
		const _this = this;

		let btnSubmitText = _this.button,
			btnText = {
			send: 'Отправляем...',
			text: 'Отправить'
		};

		if (Manipulator.has(_this.button, 'data-spinner') && status === 'before') {
			_this.button.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm me-2"></span>');
		}

		if (Manipulator.has(_this.button, 'data-text')) {
			btnText.text = Manipulator.get(_this.button, 'data-text');
		} else {
			let $btnText = _this.button.querySelector('[data-text]');
			if ($btnText) {
				btnText.text = Manipulator.get($btnText, 'data-text');
				btnSubmitText = $btnText;
			}
		}

		if (Manipulator.has(_this.button, 'data-text-send')) {
			btnText.send = Manipulator.get(_this.button, 'data-text-send');
		} else {
			let $btnTextSend = _this.button.querySelector('[data-text-send]');
			if ($btnTextSend) {
				btnText.send = Manipulator.get($btnTextSend, 'data-text-send');
				btnSubmitText = $btnTextSend;
			}
		}

		if (status === 'before') {
			if (_this.params.isBtnText) {
				btnSubmitText.innerHTML = btnText.send;
			}
			Manipulator.set(_this.button,'disabled', 'disabled');
		}

		if (status === 'after') {
			if (_this.params.isBtnText) {
				btnSubmitText.innerHTML = btnText.text;
			}
			Manipulator.remove(_this.button,'disabled');

			let spinner = _this.button.querySelector('.spinner-border');
			if (spinner) spinner.remove();
		}
	}

	_jsonParse(data, status) {
		const _this = this;

		if (_this.params.isJsonParse && typeof data === 'string') {
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

		if (!_this.params.alert.enabled) {
			return;
		}

		if (_this.params.alert.type === 'modal') {
			_this._alertModal(data, status)
		}

		if (_this.params.alert.type === 'collapse') {
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

		// Формируем новую модалку и открываем её
	}

	_alertCollapse(data, status) {
		const _this = this;
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

	if (instance.params.validate) {
		if (!instance.element.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();

			instance.element.classList.add(instance.params.classes.wasValidate);

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

	if (!instance.params.submit) {
		event.preventDefault();

		let data = new FormData(instance.element);
		if (typeof instance.params.ajax.fields === 'object') {
			data = collectData(data, instance.params.ajax.fields);
		}

		return instance.request(data, event);
	}
})

export default VGFormSender;