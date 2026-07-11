/**
 * VGFormSender Module
 *
 * Этот модуль отвечает за отправку форм с поддержкой AJAX, валидации, отображения уведомлений
 * (модальные окна или collapse), обработки ошибок, спиннеров для кнопок и многое другое.
 * Поддерживает кастомизацию через параметры и data-атрибуты.
 *
 * @class VGFormSender
 * @extends BaseModule
 *
 * @param {HTMLElement} element - DOM-элемент формы
 * @param {Object} params - Параметры инициализации
 *
 * @example
 * VGFormSender.init(document.getElementById('myForm'), {
 *   ajax: {
 *     route: '/submit',
 *     method: 'post'
 *   },
 *   alert: {
 *     type: 'modal',
 *     enabled: true
 *   },
 *   callback: {
 *     afterSuccess: (form, instance, event, data) => {
 *       console.log('Форма успешно отправлена');
 *     },
 *     afterValidateError: (form, instance, event, errors) => {
 *       console.log(errors);
 *     }
 *   }
 * });
 */

import BaseModule from "../../base-module";
import VGModal from "../../vgmodal/js/vgmodal";
import VGCollapse from "../../vgcollapse/js/vgcollapse";
import VGToast from "../../vgtoast/js/vgtoast";
import VGHideShowPass from "./hideshowpass";
import {lang_titles, lang_messages} from "../../../utils/js/components/lang";
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
 * Константа: имя модуля
 * @type {string}
 */
const NAME = 'form-sender';

/**
 * Константа: ключ модуля для использования в data-атрибутах и событиях
 * @type {string}
 */
const NAME_KEY = 'vg.fs';

/**
 * CSS-класс для алертов
 * @type {string}
 */
const CLASS_NAME_ALERT  = 'vg-form-sender-alert';
const CLASS_NAME_MODAL_STACKED = 'vg-modal-stacked';

/**
 * Событие: успешная отправка формы
 * @type {string}
 */
const EVENT_KEY_SUCCESS = 'vg.fs.success';

/**
 * Событие: ошибка при отправке формы
 * @type {string}
 */
const EVENT_KEY_ERROR   = 'vg.fs.error';

/**
 * Событие: перед отправкой формы
 * @type {string}
 */
const EVENT_KEY_BEFORE  = 'vg.fs.before';

/**
 * Событие: обработка нативной отправки формы
 * @type {string}
 */
const EVENT_SUBMIT_DATA_API = `submit.${NAME_KEY}.data.api`;

/**
 * Основной класс модуля формы
 */
class VGFormSender extends BaseModule {
	/**
	 * Создаёт экземпляр VGFormSender
	 * @param {HTMLElement} element - Элемент формы
	 * @param {Object} params - Параметры конфигурации
	 */
	constructor(element, params = {}) {
		super(element, params);

		/**
		 * Объединённые параметры с дефолтными значениями
		 * @type {Object}
		 * @private
		 */
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
				title: true,
				delay: 0,
				modal: {
					closeModalsBeforeModal: true
				},
				toast: {
					closeModalsBeforeToast: true
				}
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
				afterValidateError: noop,
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
			lang: 'ru'
		}, params));

		/**
		 * Кнопка отправки формы
		 * @type {HTMLElement|null}
		 * @private
		 */
		this._button = null;

		/**
		 * Кэш для часто используемых элементов
		 * @type {Map<string, any>}
		 * @private
		 */
		this._cachedElements = new Map();

		this._initElements();
	}

	/**
	 * Возвращает имя модуля
	 * @returns {string}
	 * @static
	 */
	static get NAME() {
		return NAME;
	}

	/**
	 * Возвращает ключ модуля
	 * @returns {string}
	 * @static
	 */
	static get NAME_KEY() {
		return NAME_KEY;
	}

	/**
	 * Инициализация внутренних элементов: кнопка, поля, параметры
	 * @private
	 */
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

	/**
	 * Построение формы: добавление классов, инициализация паролей, валидации
	 * @returns {VGFormSender}
	 */
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

	/**
	 * Отправка формы (AJAX или нативная)
	 * @param {Event} event - DOM-событие отправки
	 * @param {FormData|null} data - Дополнительные данные для отправки
	 */
	request(event, data = null) {
		const _this = this;
		const mergeFormData = (target, source) => {
			const replacedKeys = new Set();
			source.forEach((value, key) => {
				if (!replacedKeys.has(key)) {
					target.delete(key);
					replacedKeys.add(key);
				}
				target.append(key, value);
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

	/**
	 * Действия перед отправкой формы: блокировка кнопки, триггер события
	 * @private
	 */
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
		EventHandler.trigger(_this._element, EVENT_KEY_BEFORE, {
			vgformsender: {
				self: _this
			}
		});
	}

	/**
	 * Обработка ошибки: отображение алерта, вызов колбэка
	 * @param {Event} event - DOM-событие
	 * @param {Object} data - Данные ответа
	 * @private
	 */
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

	/**
	 * Обработка успеха: отображение алерта, вызов колбэка
	 * @param {Event} event - DOM-событие
	 * @param {Object} data - Данные ответа
	 * @private
	 */
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

	/**
	 * Управление состоянием кнопки отправки
	 * @param {'before'|'after'} status - Статус: до/после отправки
	 * @private
	 */
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

	/**
	 * Парсинг JSON-ответа и вызов алерта
	 * @param {Object} data - Данные ответа
	 * @param {'success'|'error'} status - Статус ответа
	 * @private
	 */
	_jsonParse(data, status) {
		const _this = this;

		if (_this._params.isJsonParse) {
			_this.alert(normalizeData(data), status);
		} else {
			_this.alert(data, status);
		}
	}

	/**
	 * Возвращает список ошибок нативной валидации формы
	 * @returns {Array<Object>}
	 * @private
	 */
	_getValidationErrors() {
		return [...this._element.elements]
			.filter((field) => typeof field?.checkValidity === 'function' && !field.checkValidity())
			.map((field) => ({
				element: field,
				name: field.name || '',
				id: field.id || '',
				type: field.type || '',
				value: field.value,
				message: field.validationMessage || '',
				validity: {...field.validity}
			}));
	}

	/**
	 * Обрабатывает неуспешную нативную валидацию перед отправкой
	 * @param {Event} event
	 * @returns {boolean}
	 * @private
	 */
	_handleValidateError(event) {
		event.preventDefault();
		event.stopPropagation();

		this._element.classList.add(this._params.classes.wasValidate);

		execute(this._params.callback.afterValidateError, [
			this._element,
			this,
			event,
			this._getValidationErrors()
		]);

		return false;
	}

	/**
	 * Отображение алерта в зависимости от типа (modal/collapse)
	 * @param {Object|string} data - Данные для отображения
	 * @param {string} status - Статус: success, error, danger и т.д.
	 */
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
									title: lang_titles(this._params.lang, 'errors').title,
									message: lang_messages(this._params.lang, 'errors').went_wrong
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

		if (this._params.alert.type === 'toast') {
			this._alertToast(data, status)
		}
	}

	/**
	 * Показ алерта в виде модального окна
	 * @param {Object} data - Данные для отображения
	 * @param {string} status - Статус (success/error)
	 * @private
	 */
	_alertModal(data, status) {
		const _this = this;
		const closeModalsBeforeModal = _this._params.alert.modal?.closeModalsBeforeModal;
		const isStackedModal = !closeModalsBeforeModal && _this._hasOpenedModals();

		if (closeModalsBeforeModal) {
			_this._closeOpenedModals();
		}

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
				if (isStackedModal) {
					_this._setStackedModalState(element);
				}

				let $content = Selectors.find('.vg-modal-content', element);
				if ($content) $content.classList.add(CLASS_NAME_ALERT, CLASS_NAME_ALERT + '-' + status);

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

	/**
	 * Проверка наличия открытых модальных окон
	 * @returns {boolean}
	 * @private
	 */
	_hasOpenedModals() {
		return Boolean(Selectors.find('.modal.show, .vg-modal.show'));
	}

	/**
	 * Помечает alert-modal как вторую модалку и поднимает ее над уже открытыми
	 * @param {HTMLElement} element
	 * @private
	 */
	_setStackedModalState(element) {
		if (!element) return;

		element.classList.add(CLASS_NAME_MODAL_STACKED);
		element.style.zIndex = this._getNextModalZIndex();
	}

	/**
	 * Вычисление z-index выше всех открытых модалок
	 * @returns {string}
	 * @private
	 */
	_getNextModalZIndex() {
		const indexes = Selectors.findAll('.modal.show, .vg-modal.show, .ox-modal.is-open')
			.map((element) => Number.parseInt(window.getComputedStyle(element).zIndex, 10))
			.filter((index) => Number.isFinite(index));

		return String((indexes.length ? Math.max(...indexes) : 1040) + 10);
	}

	/**
	 * Закрытие всех открытых модальных окон
	 * @private
	 */
	_closeOpenedModals() {
		// Модалка Bootstrap
		[...document.getElementsByClassName('modal')].forEach((element) => {
			if (element && element.classList.contains('show')) {
				if (typeof bootstrap !== 'undefined' && bootstrap.Modal?.getOrCreateInstance) {
					const mBS = bootstrap.Modal.getOrCreateInstance(element);
					mBS.hide();
				} else {
					console.warn(lang_messages(this._params.lang, NAME).bootstrap_not_found)
				}
			}
		});

		// Модалка VGApp
		[...document.getElementsByClassName('vg-modal')].forEach((element) => {
			if (element && element.classList.contains('show')) {
				const mVG = VGModal.getOrCreateInstance(element);
				mVG.hide([mVG]);
			}
		});

		// Модалка OKAUX
		[...document.getElementsByClassName('ox-modal')].forEach((element) => {
			if (element && element.classList.contains('is-open')) {
				const mOX = okaux.Modal.getOrCreateInstance(element);
				mOX.hide();
			}
		});
	}

	/**
	 * Показ алерта в виде collapse
	 * @param {Object} data - Данные для отображения
	 * @param {string} status - Статус (success/error)
	 * @private
	 */
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

	/**
	 * Показ алерта в виде toast
	 * @param {Object} data - Данные для отображения
	 * @param {string} status - Статус (success/error)
	 * @private
	 */
	_alertToast(data, status) {
		const response = this._prepareAlertResponse(status, data);
		const toastParams = this._getToastParams(status);

		if (this._params.alert.toast?.closeModalsBeforeToast) {
			this._closeOpenedModals();
		}

		if (response.title) {
			VGToast.run([response.title, response.message], toastParams);
			return;
		}

		VGToast.run(response.message, toastParams);
	}

	/**
	 * Сборка параметров toast из alert.* и alert.toast
	 * @param {string} status - Статус алерта
	 * @returns {Object}
	 * @private
	 */
	_getToastParams(status) {
		const theme = status === 'error' ? 'danger' : status;
		const toastType = status === 'danger' ? 'error' : status;
		const delay = this._params.alert.delay > 0 ? this._params.alert.delay : 3000;
		const flatToastParams = {};
		const {closeModalsBeforeToast, ...toastParams} = this._params.alert.toast || {};
		const allowedKeys = [
			'static',
			'placement',
			'autohide',
			'delay',
			'enableClickToast',
			'enableButtonClose',
			'keyboard',
			'theme',
			'drag',
			'resize',
			'stack',
			'animation',
			'ajax'
		];

		allowedKeys.forEach((key) => {
			if (key in this._params.alert) {
				flatToastParams[key] = this._params.alert[key];
			}
		});

		return mergeDeepObject({
			theme: theme || 'dark',
			type: toastType || null,
			enableButtonClose: true,
			autohide: this._params.alert.delay > 0,
			delay: delay
		}, flatToastParams, toastParams);
	}

	/**
	 * Формирование содержимого алерта (заголовок, текст, иконка)
	 * @param {HTMLElement} $element - Родительский элемент
	 * @param {string} status - Статус (success/danger и т.д.)
	 * @param {Object} data - Данные ответа
	 * @param {'modal'|'collapse'} type - Тип алерта
	 * @returns {HTMLElement} - DOM-элемент с контентом
	 */
	setDataRelationStatus($element, status, data, type) {
		let $alert = Selectors.find('.'+ CLASS_NAME_ALERT +'-content', $element);
		const response = this._prepareAlertResponse(status, data);
		const title = response.title
			? Html('string').h4({class: CLASS_NAME_ALERT +'-content--title'}, response.title)
			: '';
		const content = title + response.message;

		if (!$alert) {
			const elm = Html('dom');

			$alert = elm.div({
				class: CLASS_NAME_ALERT + '-' + type
			}, [
				elm.div({class: CLASS_NAME_ALERT + '-content'}, [
					elm.i({class: CLASS_NAME_ALERT + '-content--icon'}, getSVG(status), {isHTML: true}),
					elm.div({class: CLASS_NAME_ALERT + '-content--text'}, content, {isHTML: true})
				]),
			]);
		} else {
			let text = Selectors.find('.vg-modal-body', $element);
			text.innerHTML = content;
		}

		return $alert;
	}

	/**
	 * Подготовка содержимого алерта
	 * @param {string} status - Статус алерта
	 * @param {Object|string} data - Данные ответа
	 * @returns {{title: string, message: string}}
	 * @private
	 */
	_prepareAlertResponse(status, data) {
		let response = normalizeData(data?.response) || data;

		if (isObject(data)) {
			if (isObject(data.response) && 'view' in data.response) {
				return {
					title: '',
					message: data.response.view
				};
			}

			if (typeof response !== 'string') {
				if (status === 'danger') {
					response.title = ('title' in response) ? response.title : lang_titles(this._params.lang, 'errors').title;

					if ('code' in data && data.code !== 200) {
						const messages = {
							400: lang_messages(this._params.lang, 'errors')[400],
							401: lang_messages(this._params.lang, 'errors')[401],
							403: lang_messages(this._params.lang, 'errors')[403],
							404: lang_messages(this._params.lang, 'errors')[404],
							413: lang_messages(this._params.lang, 'errors')[413],
							419: lang_messages(this._params.lang, 'errors')[419],
							422: lang_messages(this._params.lang, 'errors')[422],
							500: lang_messages(this._params.lang, 'errors')[500],
							504: lang_messages(this._params.lang, 'errors')[504],
						};
						response.message = messages[data.code] || lang_messages(this._params.lang, 'errors').went_wrong;
						response.title += ' (' + data.code + ')';
					}

					if ('errors' in response && this._params.alert.errors) {
						let errors = normalizeData(response.errors) || null;
						response.message = [];

						if (isObject(errors)) {
							for (const error in errors) {
								if (Array.isArray(errors[error])) {
									errors[error].forEach((text) => response.message.push(text))
								} else {
									response.message.push(errors[error]);
								}
							}
						}
					}
				}

				const elm = Html('string');
				let message = '';

				if (Array.isArray(response.message)) {
					response.message.forEach((text) => {
						message += elm.div({
							class: CLASS_NAME_ALERT +'-content--message'
						}, text);
					})
				} else {
					message = elm.div({
						class: CLASS_NAME_ALERT +'-content--message'
					}, response.message);
				}

				return {
					title: this._params.alert.title ? response.title || '' : '',
					message: message
				};
			}
		}

		return {
			title: '',
			message: typeof response === 'string' ? response : ''
		};
	}

	/**
	 * Статический метод инициализации формы
	 * @param {HTMLElement} element - Форма
	 * @param {Object} params - Параметры
	 * @example
	 * VGFormSender.init(formElement, { validate: true });
	 */
	static init(element, params = {}) {
		const instance = VGFormSender.getOrCreateInstance(element, params);
		instance.build();
	}

	/**
	 * Подписка на события кнопки формы
	 * @param {string} formID - CSS-селектор формы
	 * @param {Function} callback - Колбэк-функция
	 * @param {'before'|'after'} status - Статус события
	 * @example
	 * VGFormSender.buttonClick('#myForm', (form, instance) => { ... }, 'before');
	 */
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

/**
 * Обработчик события отправки формы
 */
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
			return instance._handleValidateError(event);
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

