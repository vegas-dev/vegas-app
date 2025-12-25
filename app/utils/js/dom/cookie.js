/*! js-cookie v3.0.1 | MIT */

'use strict';

/**
 * Объединяет несколько объектов в один (аналог Object.assign)
 * @param {Object} target - целевой объект
 * @param {...Object} sources - источники
 * @returns {Object}
 */
function assign(target) {
	const sources = Array.prototype.slice.call(arguments, 1);
	sources.forEach(source => {
		if (!source) return;
		Object.keys(source).forEach(key => {
			target[key] = source[key];
		});
	});
	return target;
}

/**
 * Конвертер для чтения и записи значений cookie
 */
const defaultConverter = {
	/**
	 * Читает значение cookie, убирая кавычки и декодируя
	 * @param {string} value
	 * @param {string} key
	 * @returns {string}
	 */
	read: function (value) {
		if (value[0] === '"') {
			value = value.slice(1, -1);
		}
		return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
	},

	/**
	 * Записывает значение cookie, кодируя его
	 * @param {string} value
	 * @param {string} key
	 * @returns {string}
	 */
	write: function (value) {
		return encodeURIComponent(value).replace(
			/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
			decodeURIComponent
		);
	}
};

/**
 * Инициализация функционала работы с cookie
 * @param {Object} converter - объект с методами read/write
 * @param {Object} defaultAttributes - атрибуты по умолчанию (например, path, expires)
 * @returns {Object} - API: set, get, remove, withAttributes, withConverter
 */
function init(converter, defaultAttributes) {
	/**
	 * Устанавливает cookie
	 */
	function set(key, value, attributes) {
		if (typeof document === 'undefined') return;

		// Объединяем атрибуты: по умолчанию → экземпляр → вызов
		attributes = assign({}, defaultAttributes, attributes);

		// Обработка expires: число → дата
		if (typeof attributes.expires === 'number') {
			const daysInMs = 864e5; // 24 * 60 * 60 * 1000
			attributes.expires = new Date(Date.now() + attributes.expires * daysInMs);
		}

		// Преобразуем дату в строку, если есть
		if (attributes.expires) {
			attributes.expires = attributes.expires.toUTCString();
		}

		// Кодируем ключ
		key = encodeURIComponent(key)
			.replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
			.replace(/[()]/g, escape);

		// Формируем строку атрибутов
		let stringifiedAttributes = '';
		Object.keys(attributes).forEach(attributeName => {
			if (!attributes[attributeName]) return;

			stringifiedAttributes += '; ' + attributeName;

			// Булевые атрибуты (например, Secure) не требуют значения
			if (attributes[attributeName] !== true) {
				// RFC 6265: обрезаем значение до первого `;`
				const sanitizedValue = String(attributes[attributeName]).split(';')[0];
				stringifiedAttributes += '=' + sanitizedValue;
			}
		});

		// Устанавливаем cookie
		return (document.cookie = key + '=' + converter.write(value, key) + stringifiedAttributes);
	}

	/**
	 * Получает значение cookie по ключу
	 */
	function get(key) {
		if (typeof document === 'undefined' || (arguments.length && !key)) {
			return;
		}

		const cookies = document.cookie ? document.cookie.split('; ') : [];
		const jar = {};

		for (let i = 0; i < cookies.length; i++) {
			const parts = cookies[i].split('=');
			const value = parts.slice(1).join('=');
			const encodedKey = parts[0];

			try {
				const foundKey = decodeURIComponent(encodedKey);
				jar[foundKey] = converter.read(value, foundKey);

				// Прерываем, если нашли нужный ключ
				if (key === foundKey) break;
			} catch (e) {
				// Игнорируем поврежденные cookie
			}
		}

		return key ? jar[key] : jar;
	}

	// Возвращаем API
	return Object.create(
		{
			set,
			get,
			/**
			 * Удаляет cookie, устанавливая срок действия в прошлое
			 */
			remove: function (key, attributes) {
				set(key, '', assign({}, attributes, { expires: -1 }));
			},

			/**
			 * Создаёт новый экземпляр с новыми атрибутами по умолчанию
			 */
			withAttributes: function (attributes) {
				return init(this.converter, assign({}, this.attributes, attributes));
			},

			/**
			 * Создаёт новый экземпляр с новым конвертером
			 */
			withConverter: function (converter) {
				return init(assign({}, this.converter, converter), this.attributes);
			}
		},
		{
			attributes: { value: Object.freeze(defaultAttributes) },
			converter: { value: Object.freeze(converter) }
		}
	);
}

// Экспорт по умолчанию: экземпляр с атрибутом path: '/'
const Cookies = init(defaultConverter, { path: '/' });

export default Cookies;