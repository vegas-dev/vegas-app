
/**
 * Подготавливаем и объединяем параметры
 * @param arg
 * @param pDefault
 * @returns {*}
 */
function mergeParams(arg, pDefault) {
	let mParams = mergeDeepObject(pDefault, arg);

	if (isObject(mParams) && !isEmptyObj(mParams)) {
		for (const datum in mParams) {
			let value = normalizeData(mParams[datum]);

			if (datum !== 'params') {
				if (!(datum in pDefault)) {
					let p = datum.split('-');

					if (p[1] in pDefault[p[0]]) {
						pDefault[p[0]][p[1]] = value;
					}

					delete mParams[datum];
				} else {
					mParams[datum] = value;
				}
			} else {
				mParams = mergeDeepObject(mParams, value)
				delete mParams[datum];
			}
		}
	}

	return mParams
}



/**
 * Манипуляции с элементом
 */
const Manipulator = {
	getDataAttributes(element, isRemoveDataName = true, isRemovePrefix = true) {
		if (!element) {
			return {}
		}

		const attributes= {},
			arr = [].filter.call(element.attributes, function (at) {
				return /^data-/.test(at.name);
			});

		if (arr.length) {
			arr.forEach(function (v) {
				let name = v.name, prefix = 'vg-';
				if (isRemoveDataName) name = name.slice(5);
				if (isRemovePrefix && name.indexOf(prefix) !== -1) name = name.slice(3);

				attributes[name] = normalizeData(v.value)
			});
		}

		return attributes
	},

	getAttribute: function (element, nameAttribute) {
		if (!element || !nameAttribute) {
			return ''
		}
		return normalizeData(element.getAttribute(nameAttribute));
	},

	find: function (el) {
		if (!el) {
			throw new Error('Товарищ! Первый параметр не должен быть пустым!');
		} else {
			if (typeof el === 'string') {
				let elm = document.querySelector(el);
				if (elm) return elm;
				else throw new Error('Ахпер! Не удалось найти элемент');
			} else if (typeof el === 'object') {
				return el;
			} else {
				throw new Error('КЭП! Какая-то дичь к нам залетела');
			}
		}
	}
}

/**
 * EVENTS
 * @type {{on: eventHandler.on}}
 * Как это работает?
 * Вызов функции: eventHandler.on('элемент который нужно тригернуть', 'как тригернуть элемент');
 */
const eventHandler = {
	on: function (element, event, detail = {}) {
		const eventSuccess = new CustomEvent(event, {
			bubbles: true,
			detail: detail
		});

		element.dispatchEvent(eventSuccess);
	}
}

export {Manipulator, eventHandler, mergeParams}
