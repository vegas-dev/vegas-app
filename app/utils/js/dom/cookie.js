/*! js-cookie v3.0.1 | MIT */

function assign (target) {
	for (let i = 1; i < arguments.length; i++) {
		let source = arguments[i];
		for (let key in source) {
			target[key] = source[key];
		}
	}
	return target
}

let defaultConverter = {
	read: function (value) {
		if (value[0] === '"') {
			value = value.slice(1, -1);
		}
		return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
	},
	write: function (value) {
		return encodeURIComponent(value).replace(
			/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
			decodeURIComponent
		)
	}
};

function init (converter, defaultAttributes) {
	function set (key, value, attributes) {
		if (typeof document === 'undefined') {
			return
		}

		attributes = assign({}, defaultAttributes, attributes);

		if (typeof attributes.expires === 'number') {
			attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
		}
		if (attributes.expires) {
			attributes.expires = attributes.expires.toUTCString();
		}

		key = encodeURIComponent(key)
			.replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
			.replace(/[()]/g, escape);

		let stringifiedAttributes = '';
		for (let attributeName in attributes) {
			if (!attributes[attributeName]) {
				continue
			}

			stringifiedAttributes += '; ' + attributeName;

			if (attributes[attributeName] === true) {
				continue
			}

			// Considers RFC 6265 section 5.2:
			// ...
			// 3.  If the remaining unparsed-attributes contains a %x3B (";")
			//     character:
			// Consume the characters of the unparsed-attributes up to,
			// not including, the first %x3B (";") character.
			// ...
			stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
		}

		return (document.cookie =
			key + '=' + converter.write(value, key) + stringifiedAttributes)
	}

	function get (key) {
		if (typeof document === 'undefined' || (arguments.length && !key)) {
			return
		}

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all.
		let cookies = document.cookie ? document.cookie.split('; ') : [];
		let jar = {};
		for (let i = 0; i < cookies.length; i++) {
			let parts = cookies[i].split('=');
			let value = parts.slice(1).join('=');

			try {
				let foundKey = decodeURIComponent(parts[0]);
				jar[foundKey] = converter.read(value, foundKey);

				if (key === foundKey) {
					break
				}
			} catch (e) {}
		}

		return key ? jar[key] : jar
	}

	return Object.create({
			set: set,
			get: get,
			remove: function (key, attributes) {
				set(
					key,
					'',
					assign({}, attributes, {
						expires: -1
					})
				);
			},
			withAttributes: function (attributes) {
				return init(this.converter, assign({}, this.attributes, attributes))
			},
			withConverter: function (converter) {
				return init(assign({}, this.converter, converter), this.attributes)
			}
		},
		{
			attributes: { value: Object.freeze(defaultAttributes) },
			converter: { value: Object.freeze(converter) }
		}
	)
}

let api = init(defaultConverter, { path: '/' });

export default api;