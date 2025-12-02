import EventHandler from "../utils/js/dom/event";
import {isDisabled, isEmptyObj} from "../utils/js/functions";
import Selectors from "../utils/js/dom/selectors";

/**
 * Тут собраны вспомогательные скрипты для работы модулей
 */

/**
 * Набор svg элементов
 * @param name
 * @returns {*|{}}
 */
const getSVG = (name) => {
	const svg =  {
		error: '<svg  viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="ui-success" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-2" transform="translate(2.000000, 2.000000)"><circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><circle class="ui-error-circle" stroke="#F74444" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><path class="ui-error-line1" d="M22.244224,22 L60.4279902,60.1837662" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path><path class="ui-error-line2" d="M60.755776,21 L23.244224,59.8443492" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path></g></g></svg>',
		success: '<svg viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="ui-error" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-3" transform="translate(2.000000, 2.000000)"><circle id="Oval-2" stroke="rgba(117, 183, 152, 0.4)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><circle  class="ui-success-circle" id="Oval-2" stroke="#A5DC86" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><polyline class="ui-success-path" id="Path-2" stroke="#A5DC86" stroke-width="4" points="19 38.8036813 31.1020744 54.8046875 63.299221 28"></polyline></g></g></svg>',
		waiting: '<svg viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="ui-waiting" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-3" transform="translate(2.000000, 2.000000)"><circle id="Oval-2" stroke="rgba(255, 218, 106, 0.4)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><circle class="ui-waiting-circle" id="Oval-2" stroke="#ffda6a" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle><path class="ui-waiting-line1" d="M43 63C54.598 63 64 53.598 64 42C64 30.402 54.598 21 43 21C31.402 21 22 30.402 22 42C22 53.598 31.402 63 43 63Z" stroke-width="3" stroke="#ffda6a" stroke-linecap="round" stroke-linejoin="round"/><path class="ui-waiting-line2" d="M40.6667 32.6641V44.3307H52.3334" stroke="#ffda6a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>',
		dots: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',
		cross: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path style="mix-blend-mode:plus-darker" d="M15.3149 0.340332C15.4478 0.20752 15.6027 0.118978 15.7798 0.074707C15.9569 0.0249023 16.134 0.0249023 16.311 0.074707C16.4881 0.118978 16.6431 0.20752 16.7759 0.340332C16.9142 0.473145 17.0055 0.630859 17.0498 0.813477C17.0941 0.99056 17.0941 1.16764 17.0498 1.34473C17.0055 1.52181 16.917 1.67676 16.7842 1.80957L1.80127 16.8008C1.67399 16.9281 1.52181 17.0111 1.34473 17.0498C1.16764 17.0941 0.987793 17.0941 0.805176 17.0498C0.628092 17.0111 0.470378 16.9253 0.332031 16.7925C0.199219 16.6597 0.110677 16.502 0.0664062 16.3193C0.0221354 16.1423 0.0221354 15.9652 0.0664062 15.7881C0.110677 15.611 0.196452 15.4588 0.32373 15.3315L15.3149 0.340332ZM16.7842 15.3232C16.917 15.4561 17.0028 15.6082 17.0415 15.7798C17.0858 15.9569 17.0858 16.134 17.0415 16.311C17.0028 16.4937 16.9142 16.6541 16.7759 16.7925C16.6431 16.9253 16.4881 17.0138 16.311 17.0581C16.134 17.1024 15.9569 17.1024 15.7798 17.0581C15.6027 17.0138 15.4478 16.9253 15.3149 16.7925L0.32373 1.80127C0.201986 1.67952 0.116211 1.53011 0.0664062 1.35303C0.0221354 1.17594 0.0221354 0.996094 0.0664062 0.813477C0.116211 0.630859 0.204753 0.473145 0.332031 0.340332C0.464844 0.20752 0.622559 0.118978 0.805176 0.074707C0.987793 0.0304362 1.16488 0.0304362 1.33643 0.074707C1.51351 0.118978 1.66846 0.204753 1.80127 0.332031L16.7842 15.3232Z" fill="#000"/></svg>'
	};

	return svg[name] ?? '';
}

/**
 * Вешаем событие "Закрыть" на все модалки, сайдбары и т.п.
 * @param module
 * @param method
 */
const dismissTrigger = (module, method = 'hide') => {
	const clickEvent = `click.dismiss.${module.EVENT_KEY}`
	const name = module.NAME;

	EventHandler.on(document, clickEvent, `[data-vg-dismiss="${name}"]`, function (event) {
		if (['A', 'AREA'].includes(this.tagName)) {
			event.preventDefault();
		}

		if (isDisabled(this)) return;

		const target = Selectors.getSelectorFromElement(this) || this.closest(`.vg-${name}`);
		const instance = module.getOrCreateInstance(target);

		instance[method]();
	})
}

/**
 * AJAX REQUEST
 * @type {{post: ajax.post, get: ajax.get, x: ((function(): (XMLHttpRequest))|*), send: ajax.send}}
 */
const Ajax = {
	x: function () {
		if (typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();
		}
		let versions = [
			"MSXML2.XmlHttp.6.0",
			"MSXML2.XmlHttp.5.0",
			"MSXML2.XmlHttp.4.0",
			"MSXML2.XmlHttp.3.0",
			"MSXML2.XmlHttp.2.0",
			"Microsoft.XmlHttp"
		];

		let xhr;
		for (let i = 0; i < versions.length; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			} catch (e) {}
		}

		return xhr;
	},

	send: function (url, callback, method, data, async) {
		if (async === undefined) {
			async = true;
		}
		let x = Ajax.x();
		x.open(method, url, async);
		x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		x.onreadystatechange = function () {
			if (x.readyState === 4) {
				switch (x.status) {
					case 200:
						callback('success', {text: x.statusText, response: x.responseText, code: x.status})
						break;
					default:
						callback('error', {text: x.statusText, response: x.responseText, code: x.status})
						break;
				}
			}
		};
		x.send(data)
	},

	get: function (url, data, callback, async) {
		let query = [];

		if (!isEmptyObj(data)) {
			for (let key in data) {
				query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			}
		}

		let uri = '';
		if (query.length) {
			uri += url.includes('?') ? '&' : '?';
			uri += query.join('&');
		}

		Ajax.send(url + uri, callback, 'GET', null, async)
	},

	post: function (url, data, callback, async) {
		Ajax.send(url, callback, 'POST', data, async)
	}
};

export {
	dismissTrigger, Ajax, getSVG
}