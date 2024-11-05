import EventHandler from "./event";
import {isDisabled, isEmptyObj, isObject} from "./functions";
import Selectors from "./selectors";

/**
 * Enable Dismiss Trigger
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

		const target = Selectors.getTargetFromSelector(this) || this.closest(`.vg-${name}`)
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

		if (isObject(data) && !isEmptyObj(data)) {
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
	dismissTrigger, Ajax
}