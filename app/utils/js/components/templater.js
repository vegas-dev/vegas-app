import {getSVG} from "../../../modules/module-fn";

class LaravelHtmlBuilder {
	constructor(mode = 'string') {
		this.mode = mode; // 'string' или 'dom'
		this.document = typeof document !== 'undefined' ? document : null;
		this.tags = {
			selfClosing: ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
		};
	}

	/**
	 * Установка режима работы
	 */
	setMode(mode) {
		this.mode = mode;
		return this;
	}

	/**
	 * Создание HTML элемента
	 */
	element(tag, attributes = {}, content = null) {
		if (this.mode === 'dom' && this.document) {
			return this._createDomElement(tag, attributes, content);
		}
		return this._createHtmlString(tag, attributes, content);
	}

	/**
	 * Создание DOM элемента
	 */
	_createDomElement(tag, attributes, content) {
		const element = this.document.createElement(tag);

		// Установка атрибутов
		this._setDomAttributes(element, attributes);

		// Добавление содержимого
		if (content !== null && !this.tags.selfClosing.includes(tag)) {
			if (Array.isArray(content)) {
				content.forEach(item => {
					if (typeof item === 'string') {
						element.appendChild(this.document.createTextNode(item));
					} else if (item instanceof Node) {
						element.appendChild(item);
					}
				});
			} else if (content instanceof Node) {
				element.appendChild(content);
			} else {
				element.textContent = content;
			}
		}

		return element;
	}

	/**
	 * Установка атрибутов DOM элемента
	 */
	_setDomAttributes(element, attributes) {
		if (!attributes) return;

		Object.entries(attributes).forEach(([key, value]) => {
			if (value === null || value === undefined || value === false) {
				return;
			}

			if (value === true) {
				element.setAttribute(key, '');
			} else {
				element.setAttribute(key, String(value));
			}
		});
	}

	/**
	 * Создание HTML строки
	 */
	_createHtmlString(tag, attributes, content) {
		const attrString = this._attributesToString(attributes);
		const isSelfClosing = this.tags.selfClosing.includes(tag);

		if (isSelfClosing) {
			return `<${tag}${attrString}>`;
		}

		const contentStr = content !== null ?
			this._contentToString(content) : '';

		if (tag === '') {
			return `${contentStr}`;
		} else {
			return `<${tag}${attrString}>${contentStr}</${tag}>`;
		}
	}

	/**
	 * Преобразование содержимого в строку
	 */
	_contentToString(content) {
		if (Array.isArray(content)) {
			return content.map(item => {
				if (item instanceof Node) {
					return this._nodeToString(item);
				}
				return String(item);
			}).join('');
		}

		if (content instanceof Node) {
			return this._nodeToString(content);
		}

		return String(content);
	}

	/**
	 * Преобразование DOM узла в строку
	 */
	_nodeToString(node) {
		if (node.outerHTML) {
			return node.outerHTML;
		}
		return String(node);
	}

	/**
	 * Преобразование атрибутов в строку
	 */
	_attributesToString(attrs) {
		if (!attrs || Object.keys(attrs).length === 0) {
			return '';
		}

		const attributes = Object.entries(attrs)
			.map(([key, value]) => {
				if (value === null || value === undefined || value === false) {
					return '';
				}

				if (value === true) {
					return key;
				}

				const escapedValue = String(value)
					.replace(/&/g, '&amp;')
					.replace(/"/g, '&quot;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');

				return `${key}="${escapedValue}"`;
			})
			.filter(attr => attr !== '');

		return attributes.length ? ' ' + attributes.join(' ') : '';
	}

	/**
	 * Методы для конкретных элементов
	 */
	div(attributes = {}, content = '') {
		return this.element('div', attributes, content);
	}

	span(attributes = {}, content = '') {
		return this.element('span', attributes, content);
	}

	p(attributes = {}, content = '') {
		return this.element('p', attributes, content);
	}

	a(href, content = '', attributes = {}) {
		return this.element('a', { href, ...attributes }, content);
	}

	img(src, alt = '', attributes = {}) {
		return this.element('img', { src, alt, ...attributes });
	}

	input(name, type = 'text', value = '', attributes = {}) {
		return this.element('input', {
			type,
			name,
			value,
			...attributes
		});
	}

	button(content = '', type = 'button', attributes = {}) {
		return this.element('button', { type, ...attributes }, content);
	}

	form(action = '', method = 'post', attributes = {}, content = '') {
		return this.element('form', { action, method, ...attributes }, content);
	}

	label(forId, content, attributes = {}) {
		return this.element('label', { for: forId, ...attributes }, content);
	}

	textarea(name, content = '', attributes = {}) {
		return this.element('textarea', { name, ...attributes }, content);
	}

	ul(items = [], attributes = {}) {
		const listItems = items.map(item =>
			this.element('li', {}, item)
		);
		return this.element('ul', attributes, listItems);
	}

	ol(items = [], attributes = {}) {
		const listItems = items.map(item =>
			this.element('li', {}, item)
		);
		return this.element('ol', attributes, listItems);
	}

	/**
	 * Создание таблицы
	 */
	table(headers = [], rows = [], attributes = {}) {
		const headerCells = headers.map(header =>
			this.element('th', {}, header)
		);
		const headerRow = this.element('tr', {}, headerCells);
		const thead = this.element('thead', {}, headerRow);

		const bodyRows = rows.map(row => {
			const cells = row.map(cell =>
				this.element('td', {}, cell)
			);
			return this.element('tr', {}, cells);
		});
		const tbody = this.element('tbody', {}, bodyRows);

		return this.element('table', attributes, [thead, tbody]);
	}

	/**
	 * Методы для форм
	 */
	csrfToken(token) {
		return this.element('input', {
			type: 'hidden',
			name: '_token',
			value: token
		});
	}

	method(method) {
		return this.element('input', {
			type: 'hidden',
			name: '_method',
			value: method
		});
	}

	/**
	 * Создание элемента с обработчиками событий
	 */
	withEvents(element, events = {}) {
		if (element instanceof Node && this.mode === 'dom') {
			Object.entries(events).forEach(([event, handler]) => {
				element.addEventListener(event, handler);
			});
		}
		return element;
	}

	/**
	 * Добавление классов
	 */
	addClass(element, className) {
		if (element instanceof Node && this.mode === 'dom') {
			element.classList.add(className);
		} else if (typeof element === 'string') {
			// Для строкового режима - модифицируем атрибут class
			const match = element.match(/<(\w+)([^>]*)>/);
			if (match) {
				const [fullMatch, tag, attrs] = match;
				const newAttrs = this._addClassToAttributes(attrs, className);
				return element.replace(fullMatch, `<${tag}${newAttrs}>`);
			}
		}
		return element;
	}

	_addClassToAttributes(attrs, className) {
		const classMatch = attrs.match(/class="([^"]*)"/);
		if (classMatch) {
			const existingClass = classMatch[1];
			const newClass = existingClass ? `${existingClass} ${className}` : className;
			return attrs.replace(/class="[^"]*"/, `class="${newClass}"`);
		} else {
			return `${attrs} class="${className}"`;
		}
	}

	/**
	 * Создание компонента
	 */
	component(name, props = {}, slots = {}) {
		// Можно добавить заготовленные компоненты
		const components = {
			'eye': (props) => {
				const type = props.type || 'open';
				const svg = this.element('', {},  getSVG(`eye-${type}`))
				return this.span(
					{
						'data-vg-toggle': 'pass',
						'data-bs-toggle': 'tooltip',
						'title': 'Скрыть',
						'class': props.class || ''
					},
					[
						svg
					]
				);
			},
			'alert': (props) => {
				const type = props.type || 'info';
				return this.div(
					{
						class: `alert alert-${type}`,
						role: 'alert'
					},
					props.content || ''
				);
			},
			'card': (props) => {
				const header = props.header ?
					this.div({ class: 'card-header' }, props.header) : '';
				const body = this.div({ class: 'card-body' }, props.body || '');
				const footer = props.footer ?
					this.div({ class: 'card-footer' }, props.footer) : '';

				return this.div(
					{ class: 'card' },
					[header, body, footer]
				);
			}
		};

		if (components[name]) {
			return components[name](props);
		}

		return this.div({ class: `component-${name}` }, '');
	}
}

function Html(mode = 'string') {
	const builder = new LaravelHtmlBuilder(mode);

	const handler = {
		get(target, prop) {
			if (prop in target) {
				return target[prop].bind(target);
			}

			// Динамическое создание метода для любого тега
			return function(attributes = {}, content = '') {
				return target.element(prop, attributes, content);
			};
		}
	};

	return new Proxy(builder, handler);
}

export default Html;