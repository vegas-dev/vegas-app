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
		error: '',
		success: '',
		dots: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',
		cross: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 224.512 224.512" xml:space="preserve"><g><polygon points="224.507,6.997 217.521,0 112.256,105.258 6.998,0 0.005,6.997 105.263,112.254 0.005,217.512 6.998,224.512 112.256,119.24 217.521,224.512 224.507,217.512 119.249,112.254 "/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>'
	};

	return svg[name] ?? {};
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
			event.preventDefault()
		}

		if (isDisabled(this)) {
			return
		}

		const target = Selectors.getSelectorFromElement(this) || this.closest(`.vg-${name}`)
		const instance = module.getOrCreateInstance(target)

		instance[method]()
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
		x.onreadystatechange = function () {
			if (x.readyState === 4) {
				switch (x.status) {
					case 200:
						callback('success', x.responseText)
						break;
					default:
						callback('error', x.statusText)
						break;
				}
			}
		};
		x.send(data)
	},

	get: function (url, data, callback, async) {
		let query = [];

		if (!isEmptyObj(data)) {
			for (let key of data) {
				query.push(encodeURIComponent(key[0]) + '=' + encodeURIComponent(key[1]));
			}
		}
		Ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
	},

	post: function (url, data, callback, async) {
		Ajax.send(url, callback, 'POST', data, async)
	}
};

export {
	dismissTrigger, Ajax, getSVG
}