import BaseModule from "../../base-module";
import {Manipulator} from "../../../_utils/js/manipulator";
import {execute, isDisabled, normalizeData} from "../../../_utils/js/functions";
import EventHandler from "../../../_utils/js/event";
import {validate} from "@babel/core/lib/config/validation/options";
import Selectors from "../../../_utils/js/selectors";

/**
 * Constants
 */
const NAME = 'form-sender';
const NAME_KEY = 'vg.form-sender';

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
	action: location.href,
	method: 'post',
	fields: [],
	redirect: null,
	isJsonParse: true,
	isValidate: false,
	isSubmit: false,
	isBtnText: true,
	isShowPass: true,
	alert: {
		enabled: true,
		delay: 350,
		type: 'modal'
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

		this._button = null;
		this.button = this.element.querySelector('[type="submit"]');

		this.params.action = Manipulator.get(this.element, 'action') || this.params.action;
		this.params.method = Manipulator.get(this.element, 'method') || this.params.method;

		this.params.isValidate  = Manipulator.get(this.element, 'data-validate') === 'true';
		this.params.isSubmit    = Manipulator.get(this.element, 'data-submit') === 'true';
		this.params.isBtnText   = Manipulator.get(this.element, 'data-btn-text') !== 'false';
		this.params.isJsonParse = Manipulator.get(this.element, 'data-json-parse') !== 'false';
		this.params.isShowPass = Manipulator.get(this.element, 'data-show-pass') !== 'false';

		if (this.params.fields && typeof this.params.fields == 'function') {
			this.params.fields = this.params.fields();
		}
	}

	static get Default() {
		return PARAMS_DEFAULT
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	get button() {
		return this._button
	}

	set button(btn) {
		if (!btn) {
			this._button = document.querySelector('[form="' + this.element.id + '"]');
		} else {
			this._button = btn;
		}
	}

	build() {
		this.element.classList.add(this.params.classes.general);

		if (this.params.isValidate) {
			Manipulator.set(this.element, 'novalidate', '');
			this.element.classList.add(this.params.classes.validation);
		}

		// TODO сделать добавление глаза если есть ввод пароля

		return this
	}

	submit(callback) {
		const _this = this;

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

		this.element.addEventListener('submit', function (event) {
			if (_this.params.isValidate) {
				if (!_this.element.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();

					_this.element.classList.add(_this.params.classes.wasValidate);

					return false;
				}
			}

			if (isDisabled(_this.button)) {
				event.preventDefault();
				return;
			}

			if (!_this.params.isSubmit) {
				event.preventDefault();

				let data = new FormData(_this.element);
				if (typeof _this.params.fields === 'object') {
					data = collectData(data, _this.params.fields);
				}

				return _this.request(data, callback, event);
			}
		});
	}

	request(data, callback, event) {
		const _this = this;

		_this.params.ajax = {
			route: _this.params.action,
			method: _this.params.method.toLowerCase(),
			data: data
		}

		if (callback && 'beforeSend' in callback) {
			execute(callback.beforeSend, [event, _this]);
			EventHandler.trigger(_this.element, EVENT_KEY_BEFORE, _this);
		}

		_this._route(function (status, data) {
			console.log(status);
			console.log(data);
		})
	}

	/**
	 * Инициализация
	 * @param element
	 * @param params
	 */
	static init(element, params = {}) {
		const instance = VGFormSender.getOrCreateInstance(element, params);
		instance.build().submit();
	}
}

export default VGFormSender;