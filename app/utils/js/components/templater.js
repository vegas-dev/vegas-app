/**
 * Класс для рендеринга HTML элементов с санитизацией
 * Поддерживает создание из шаблонов и программное создание
 */
class Templater {
	/**
	 * Конструктор
	 * @param {string|HTMLElement} element - Селектор, HTML строка или HTMLElement
	 */
	constructor(element) {
		this.element = null;
		this.children = [];
		this.sanitizer = new Sanitizer();

		if (element) {
			this.init(element);
		}
	}

	/**
	 * Инициализация элемента
	 * @param {string|HTMLElement} element
	 */
	init(element) {
		if (typeof element === 'string') {
			// Если это селектор
			if (element.startsWith('#') || element.startsWith('.')) {
				const found = document.querySelector(element);
				if (found) {
					this.element = found;
				} else {
					this.createFromString(element);
				}
			}
			// Если это HTML строка
			else if (element.includes('<')) {
				this.createFromHTML(element);
			}
			// Если это просто тег
			else {
				this.createFromScratch(element);
			}
		}
		// Если это уже DOM элемент
		else if (element instanceof HTMLElement) {
			this.element = element;
		}

		return this;
	}

	/**
	 * Создание элемента из HTML строки с санитизацией
	 * @param {string} html - HTML строка
	 * @param {boolean} sanitize - Нужно ли санитизировать
	 * @returns {Templater}
	 */
	createFromHTML(html, sanitize = true) {
		const template = document.createElement('template');

		// Санитизация HTML
		const processedHTML = sanitize ? this.sanitizer.sanitizeHTML(html) : html;
		template.innerHTML = processedHTML.trim();

		const content = template.content;

		if (content.children.length === 1) {
			this.element = content.firstElementChild;
		} else {
			const wrapper = document.createElement('div');
			wrapper.appendChild(content.cloneNode(true));
			this.element = wrapper;
		}

		return this;
	}

	/**
	 * Создание элемента с нуля
	 * @param {string} tagName - Название тега
	 * @param {Object} options - Опции элемента
	 * @returns {Templater}
	 */
	createFromScratch(tagName = 'div', options = {}) {
		// Проверяем допустимость тега
		tagName = this.sanitizer.sanitizeTagName(tagName);

		this.element = document.createElement(tagName);

		// Устанавливаем атрибуты если есть
		if (options.attrs) {
			this.setAttributes(options.attrs);
		}

		// Устанавливаем классы если есть
		if (options.classes) {
			this.addClass(...options.classes);
		}

		// Устанавливаем стили если есть
		if (options.styles) {
			this.setStyles(options.styles);
		}

		// Устанавливаем текст если есть
		if (options.text) {
			this.setText(options.text);
		}

		// Устанавливаем HTML если есть
		if (options.html) {
			this.setHTML(options.html, options.sanitizeHTML);
		}

		return this;
	}

	/**
	 * Загрузка шаблона из файла
	 * @param {string} url - URL шаблона
	 * @param {boolean} sanitize - Нужно ли санитизировать
	 * @returns {Promise<Templater>}
	 */
	async loadTemplate(url, sanitize = true) {
		try {
			const response = await fetch(url);
			const html = await response.text();
			return this.createFromHTML(html, sanitize);
		} catch (error) {
			console.error('Error loading template:', error);
			return this;
		}
	}

	/**
	 * Получить шаблон из script тега
	 * @param {string} selector - Селектор script тега
	 * @param {boolean} sanitize - Нужно ли санитизировать
	 * @returns {Templater}
	 */
	fromTemplateScript(selector, sanitize = true) {
		const templateScript = document.querySelector(selector);
		if (templateScript && templateScript.type === 'text/template') {
			return this.createFromHTML(templateScript.innerHTML, sanitize);
		}
		return this;
	}

	/**
	 * Установить атрибуты с санитизацией
	 * @param {Object} attrs - Объект с атрибутами
	 * @returns {Templater}
	 */
	setAttributes(attrs) {
		if (!this.element) return this;

		Object.entries(attrs).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				// Санитизация имени и значения атрибута
				const sanitizedKey = this.sanitizer.sanitizeAttributeName(key);
				const sanitizedValue = this.sanitizer.sanitizeAttributeValue(key, value);

				if (sanitizedKey && sanitizedValue !== null) {
					this.element.setAttribute(sanitizedKey, sanitizedValue);
				}
			}
		});

		return this;
	}

	/**
	 * Установить один атрибут с санитизацией
	 * @param {string} name - Имя атрибута
	 * @param {string} value - Значение атрибута
	 * @returns {Templater}
	 */
	setAttribute(name, value) {
		if (this.element) {
			const sanitizedName = this.sanitizer.sanitizeAttributeName(name);
			const sanitizedValue = this.sanitizer.sanitizeAttributeValue(name, value);

			if (sanitizedName && sanitizedValue !== null) {
				this.element.setAttribute(sanitizedName, sanitizedValue);
			}
		}
		return this;
	}

	/**
	 * Добавить классы с санитизацией
	 * @param {...string} classNames - Классы для добавления
	 * @returns {Templater}
	 */
	addClass(...classNames) {
		if (this.element) {
			const sanitizedClasses = classNames.map(className =>
				this.sanitizer.sanitizeClassName(className)
			).filter(Boolean);

			this.element.classList.add(...sanitizedClasses);
		}
		return this;
	}

	/**
	 * Удалить классы
	 * @param {...string} classNames - Классы для удаления
	 * @returns {Templater}
	 */
	removeClass(...classNames) {
		if (this.element) {
			this.element.classList.remove(...classNames);
		}
		return this;
	}

	/**
	 * Переключить класс
	 * @param {string} className - Класс для переключения
	 * @returns {Templater}
	 */
	toggleClass(className) {
		if (this.element) {
			this.element.classList.toggle(className);
		}
		return this;
	}

	/**
	 * Установить стили с санитизацией
	 * @param {Object} styles - Объект со стилями
	 * @returns {Templater}
	 */
	setStyles(styles) {
		if (!this.element) return this;

		Object.entries(styles).forEach(([property, value]) => {
			const sanitizedProperty = this.sanitizer.sanitizeCSSProperty(property);
			const sanitizedValue = this.sanitizer.sanitizeCSSValue(property, value);

			if (sanitizedProperty && sanitizedValue !== null) {
				this.element.style[sanitizedProperty] = sanitizedValue;
			}
		});

		return this;
	}

	/**
	 * Установить текст (безопасно, экранирование HTML)
	 * @param {string} text - Текст
	 * @returns {Templater}
	 */
	setText(text) {
		if (this.element) {
			this.element.textContent = text;
		}
		return this;
	}

	/**
	 * Установить HTML с опциональной санитизацией
	 * @param {string} html - HTML строка
	 * @param {boolean} sanitize - Нужно ли санитизировать
	 * @returns {Templater}
	 */
	setHTML(html, sanitize = true) {
		if (this.element) {
			const processedHTML = sanitize ?
				this.sanitizer.sanitizeHTML(html) : html;
			this.element.innerHTML = processedHTML;
		}
		return this;
	}

	/**
	 * Установить безопасный HTML (всегда с санитизацией)
	 * @param {string} html - HTML строка
	 * @returns {Templater}
	 */
	setSafeHTML(html) {
		return this.setHTML(html, true);
	}

	/**
	 * Добавить дочерний элемент с санитизацией
	 * @param {Templater|HTMLElement|string} child - Дочерний элемент
	 * @param {boolean} sanitize - Нужно ли санитизировать если child - строка
	 * @returns {Templater}
	 */
	addChild(child, sanitize = true) {
		if (!this.element) return this;

		if (child instanceof Templater) {
			this.element.appendChild(child.getElement());
			this.children.push(child);
		} else if (child instanceof HTMLElement) {
			// Клонируем и санитизируем существующий элемент
			const sanitizedChild = this.sanitizer.sanitizeElement(child);
			this.element.appendChild(sanitizedChild);
		} else if (typeof child === 'string') {
			// Санитизируем строку
			const sanitizedHTML = sanitize ?
				this.sanitizer.sanitizeHTML(child) : child;

			const template = document.createElement('template');
			template.innerHTML = sanitizedHTML;

			const fragment = template.content;
			while (fragment.children.length > 0) {
				this.element.appendChild(fragment.children[0]);
			}
		}

		return this;
	}

	/**
	 * Добавить несколько дочерних элементов
	 * @param {Array} children - Массив дочерних элементов
	 * @param {boolean} sanitize - Нужно ли санитизировать
	 * @returns {Templater}
	 */
	addChildren(children, sanitize = true) {
		children.forEach(child => this.addChild(child, sanitize));
		return this;
	}

	/**
	 * Добавить безопасный дочерний элемент (всегда с санитизацией)
	 * @param {Templater|HTMLElement|string} child
	 * @returns {Templater}
	 */
	addSafeChild(child) {
		return this.addChild(child, true);
	}

	/**
	 * Очистить содержимое
	 * @returns {Templater}
	 */
	clear() {
		if (this.element) {
			this.element.innerHTML = '';
			this.children = [];
		}
		return this;
	}

	/**
	 * Добавить обработчик события с валидацией
	 * @param {string} event - Тип события
	 * @param {Function} handler - Обработчик
	 * @param {Object} options - Опции события
	 * @returns {Templater}
	 */
	on(event, handler, options = {}) {
		if (this.element && typeof handler === 'function') {
			// Валидация имени события
			const sanitizedEvent = this.sanitizer.sanitizeEventName(event);
			if (sanitizedEvent) {
				this.element.addEventListener(sanitizedEvent, handler, options);
			}
		}
		return this;
	}

	/**
	 * Удалить обработчик события
	 * @param {string} event - Тип события
	 * @param {Function} handler - Обработчик
	 * @param {Object} options - Опции события
	 * @returns {Templater}
	 */
	off(event, handler, options = {}) {
		if (this.element) {
			this.element.removeEventListener(event, handler, options);
		}
		return this;
	}

	/**
	 * Вставить элемент в DOM
	 * @param {string|HTMLElement} container - Контейнер или селектор
	 * @param {string} position - Позиция (beforebegin, afterbegin, beforeend, afterend)
	 * @returns {Templater}
	 */
	insertTo(container, position = 'beforeend') {
		let target;

		if (typeof container === 'string') {
			target = document.querySelector(container);
		} else if (container instanceof HTMLElement) {
			target = container;
		}

		if (target && this.element) {
			if (position === 'replace') {
				target.replaceWith(this.element);
			} else {
				target.insertAdjacentElement(position, this.element);
			}
		}

		return this;
	}

	/**
	 * Заменить существующий элемент
	 * @param {string|HTMLElement} target - Элемент для замены
	 * @returns {Templater}
	 */
	replace(target) {
		return this.insertTo(target, 'replace');
	}

	/**
	 * Удалить элемент из DOM
	 * @returns {Templater}
	 */
	remove() {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
		return this;
	}

	/**
	 * Клонировать элемент с санитизацией
	 * @param {boolean} deep - Глубокое клонирование
	 * @returns {Templater}
	 */
	clone(deep = true) {
		if (!this.element) return new Templater();

		const clonedElement = this.element.cloneNode(deep);
		// Санитизируем клонированный элемент
		const sanitizedClone = this.sanitizer.sanitizeElement(clonedElement);
		return new Templater(sanitizedClone);
	}

	/**
	 * Получить DOM элемент
	 * @returns {HTMLElement|null}
	 */
	getElement() {
		return this.element;
	}

	/**
	 * Получить безопасный HTML (санитизированный)
	 * @returns {string}
	 */
	getSafeHTML() {
		return this.element ? this.element.innerHTML : '';
	}

	/**
	 * Получить текст
	 * @returns {string}
	 */
	getText() {
		return this.element ? this.element.textContent : '';
	}

	/**
	 * Установить конфигурацию санитизатора
	 * @param {Object} config - Конфигурация
	 * @returns {Templater}
	 */
	setSanitizerConfig(config) {
		this.sanitizer.setConfig(config);
		return this;
	}

	/**
	 * Статический метод для быстрого создания
	 * @param {string|HTMLElement} element
	 * @returns {Templater}
	 */
	static create(element) {
		return new Templater(element);
	}

	/**
	 * Статический метод для создания из HTML
	 * @param {string} html
	 * @param {boolean} sanitize
	 * @returns {Templater}
	 */
	static fromHTML(html, sanitize = true) {
		return new Templater().createFromHTML(html, sanitize);
	}

	/**
	 * Статический метод для создания с нуля
	 * @param {string} tagName
	 * @param {Object} options
	 * @returns {Templater}
	 */
	static createElement(tagName, options = {}) {
		return new Templater().createFromScratch(tagName, options);
	}

	/**
	 * Статический метод для загрузки шаблона
	 * @param {string} url
	 * @param {boolean} sanitize
	 * @returns {Promise<Templater>}
	 */
	static async load(url, sanitize = true) {
		const renderer = new Templater();
		return await renderer.loadTemplate(url, sanitize);
	}

	/**
	 * Статический метод для экранирования HTML
	 * @param {string} html
	 * @returns {string}
	 */
	static escapeHTML(html) {
		return new Sanitizer().escapeHTML(html);
	}
}

/**
 * Класс для санитизации HTML и DOM элементов
 */
class Sanitizer {
	constructor(config = {}) {
		const defaultConfig = {
			allowedTags: [
				'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
				'a', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
				'strong', 'em', 'b', 'i', 'u', 's', 'br', 'hr',
				'img', 'input', 'textarea', 'select', 'option',
				'button', 'form', 'label', 'fieldset', 'legend',
				'section', 'article', 'header', 'footer', 'nav',
				'aside', 'main', 'figure', 'figcaption',
				'code', 'pre', 'blockquote', 'cite',
				'tbody', 'thead', 'tfoot'
			],
			allowedAttributes: {
				'*': ['class', 'id', 'title', 'style', 'data-*'],
				'a': ['href', 'target', 'rel'],
				'img': ['src', 'alt', 'width', 'height'],
				'input': ['type', 'name', 'value', 'placeholder', 'disabled', 'checked'],
				'textarea': ['name', 'placeholder', 'rows', 'cols'],
				'button': ['type', 'disabled'],
				'form': ['action', 'method'],
				'select': ['name'],
				'option': ['value'],
				'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen']
			},
			allowedSchemes: ['http', 'https', 'mailto', 'tel', '#'],
			allowedCSSProperties: [
				'color', 'background-color', 'font-size', 'font-family',
				'font-weight', 'text-align', 'padding', 'margin',
				'border', 'width', 'height', 'display', 'position',
				'top', 'left', 'right', 'bottom', 'z-index',
				'opacity', 'visibility', 'cursor', 'text-decoration',
				'line-height', 'letter-spacing', 'word-spacing',
				'white-space', 'overflow', 'float', 'clear',
				'min-width', 'max-width', 'min-height', 'max-height'
			],
			allowedClassPattern: /^[a-zA-Z0-9-_]+$/,
			allowedAttrPattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
			allowedEvents: [
				'click', 'dblclick', 'mouseover', 'mouseout',
				'mousedown', 'mouseup', 'mousemove',
				'keydown', 'keyup', 'keypress',
				'focus', 'blur', 'change', 'input',
				'submit', 'reset', 'load', 'error'
			],
			attributeHandlers: {
				'href': this.sanitizeURL.bind(this),
				'src': this.sanitizeURL.bind(this),
				'style': this.sanitizeStyleString.bind(this),
				'on*': () => null
			}
		};

		// Безопасное объединение конфигурации
		this.config = this.safeMergeConfig(defaultConfig, config);

	}

	/**
	 * Безопасное объединение конфигураций
	 * @param {Object} defaultConfig
	 * @param {Object} userConfig
	 * @returns {Object}
	 */
	safeMergeConfig(defaultConfig, userConfig) {
		const result = { ...defaultConfig };

		// Обрабатываем allowedTags
		if (userConfig.allowedTags && Array.isArray(userConfig.allowedTags)) {
			result.allowedTags = userConfig.allowedTags;
		}

		// Обрабатываем allowedAttributes
		if (userConfig.allowedAttributes && typeof userConfig.allowedAttributes === 'object') {
			// Объединяем вложенные объекты
			result.allowedAttributes = { ...defaultConfig.allowedAttributes };
			Object.keys(userConfig.allowedAttributes).forEach(key => {
				if (Array.isArray(userConfig.allowedAttributes[key])) {
					result.allowedAttributes[key] = userConfig.allowedAttributes[key];
				}
			});
		}

		// Обрабатываем остальные свойства
		Object.keys(userConfig).forEach(key => {
			if (key !== 'allowedTags' && key !== 'allowedAttributes') {
				result[key] = userConfig[key];
			}
		});

		return result;
	}

	/**
	 * Безопасное получение значения конфигурации
	 * @param {string} key
	 * @param {any} defaultValue
	 * @returns {any}
	 */
	getConfigValue(key, defaultValue = null) {
		const value = this.config[key];

		// Проверяем тип значения в зависимости от ключа
		switch (key) {
			case 'allowedTags':
			case 'allowedCSSProperties':
			case 'allowedEvents':
				return Array.isArray(value) ? value : (defaultValue || []);
			case 'allowedAttributes':
				return value && typeof value === 'object' ? value : (defaultValue || {});
			case 'allowedClassPattern':
			case 'allowedAttrPattern':
				return value instanceof RegExp ? value : defaultValue;
			case 'attributeHandlers':
				return value && typeof value === 'object' ? value : (defaultValue || {});
			default:
				return value !== undefined ? value : defaultValue;
		}
	}

	/**
	 * Санитизация HTML строки
	 * @param {string} html
	 * @returns {string}
	 */
	sanitizeHTML(html) {
		if (!html) return '';

		// Создаем временный элемент для парсинга
		const template = document.createElement('template');
		template.innerHTML = html;

		// Рекурсивно санитизируем все элементы
		this.sanitizeNode(template.content);

		return template.innerHTML;
	}

	/**
	 * Рекурсивная санитизация узла
	 * @param {Node} node
	 */
	sanitizeNode(node) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			this.sanitizeElement(node);
		} else if (node.nodeType === Node.TEXT_NODE) {
			// Текстовые узлы безопасны
			return;
		}

		// Обрабатываем детей рекурсивно
		const children = Array.from(node.childNodes);
		children.forEach(child => this.sanitizeNode(child));
	}

	/**
	 * Санитизация элемента
	 * @param {Element} element
	 * @returns {Element}
	 */
	sanitizeElement(element) {
		const tagName = element.tagName.toLowerCase();

		// Проверяем разрешен ли тег (добавляем проверку на exists)
		if (!this.config.allowedTags || !this.config.allowedTags.includes(tagName)) {
			// Заменяем неразрешенный тег на span
			const span = document.createElement('span');
			span.textContent = `[${tagName.toUpperCase()} removed]`;
			element.parentNode?.replaceChild(span, element);
			return span;
		}

		// Санитизируем атрибуты
		this.sanitizeElementAttributes(element);

		return element;
	}

	/**
	 * Санитизация атрибутов элемента
	 * @param {Element} element
	 */
	sanitizeElementAttributes(element) {
		const tagName = element.tagName.toLowerCase();
		const attributes = Array.from(element.attributes);

		attributes.forEach(attr => {
			const attrName = attr.name.toLowerCase();
			const attrValue = attr.value;

			// Проверяем атрибуты on* (события)
			if (attrName.startsWith('on')) {
				element.removeAttribute(attrName);
				return;
			}

			// Проверяем разрешен ли атрибут вообще
			let isAllowed = false;

			// Проверяем общие атрибуты (добавляем проверку на exists)
			if (this.config.allowedAttributes['*'] &&
				this.config.allowedAttributes['*'].includes(attrName)) {
				isAllowed = true;
			}

			// Проверяем data-* атрибуты
			if (attrName.startsWith('data-')) {
				const dataAttrName = attrName.substring(5);
				const allowedDataAttrs = this.config.allowedAttributes['*'];
				if ((allowedDataAttrs && allowedDataAttrs.includes('data-*')) ||
					this.config.allowedAttrPattern.test(dataAttrName)) {
					isAllowed = true;
				}
			}

			// Проверяем специфичные для тега атрибуты
			const tagAllowedAttrs = this.config.allowedAttributes[tagName];
			if (tagAllowedAttrs && tagAllowedAttrs.includes(attrName)) {
				isAllowed = true;
			}

			// Проверяем шаблон data-* для конкретного тега
			if (tagAllowedAttrs &&
				tagAllowedAttrs.includes('data-*') &&
				attrName.startsWith('data-')) {
				isAllowed = true;
			}

			if (!isAllowed) {
				element.removeAttribute(attrName);
				return;
			}

			// Обрабатываем специальные атрибуты
			const handler = this.config.attributeHandlers[attrName] ||
				(attrName.startsWith('on') ? this.config.attributeHandlers['on*'] : null);

			if (handler) {
				const sanitizedValue = handler(attrValue, attrName, tagName);
				if (sanitizedValue === null) {
					element.removeAttribute(attrName);
				} else {
					element.setAttribute(attrName, sanitizedValue);
				}
			} else {
				// Базовая санитизация значения
				const sanitizedValue = this.sanitizeAttributeValue(attrName, attrValue);
				if (sanitizedValue === null) {
					element.removeAttribute(attrName);
				} else {
					element.setAttribute(attrName, sanitizedValue);
				}
			}
		});
	}

	/**
	 * Санитизация имени тега
	 * @param {string} tagName
	 * @returns {string}
	 */
	sanitizeTagName(tagName) {
		const normalized = tagName.toLowerCase().trim();
		// Проверяем что allowedTags существует и содержит тег
		if (!this.config.allowedTags || !this.config.allowedTags.includes(normalized)) {
			return 'div'; // Значение по умолчанию
		}
		return normalized;
	}

	/**
	 * Санитизация имени атрибута
	 * @param {string} name
	 * @returns {string|null}
	 */
	sanitizeAttributeName(name) {
		const normalized = name.toLowerCase().trim();

		// Проверяем соответствие паттерну
		if (!this.config.allowedAttrPattern.test(normalized)) {
			return null;
		}

		// Блокируем опасные атрибуты
		const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onfocus', 'onsubmit'];
		if (dangerousAttrs.includes(normalized) || normalized.startsWith('on')) {
			return null;
		}

		return normalized;
	}

	/**
	 * Санитизация значения атрибута
	 * @param {string} name
	 * @param {string} value
	 * @returns {string|null}
	 */
	sanitizeAttributeValue(name, value) {
		if (value === null || value === undefined) {
			return null;
		}

		const strValue = String(value).trim();

		switch (name) {
			case 'href':
			case 'src':
			case 'action':
				return this.sanitizeURL(strValue);

			case 'style':
				return this.sanitizeStyleString(strValue);

			case 'class':
				return this.sanitizeClassString(strValue);

			default:
				// Экранируем специальные символы
				return this.escapeAttribute(strValue);
		}
	}

	/**
	 * Санитизация URL
	 * @param {string} url
	 * @returns {string|null}
	 */
	sanitizeURL(url) {
		if (!url) return null;

		try {
			// Проверяем якорные ссылки и javascript:
			if (url.startsWith('#') || url.startsWith('?')) {
				return url;
			}

			if (url.toLowerCase().startsWith('javascript:')) {
				return null;
			}

			// Парсим URL
			const parsed = new URL(url, window.location.origin);

			// Проверяем разрешенную схему
			if (!this.config.allowedSchemes.includes(parsed.protocol.replace(':', ''))) {
				return null;
			}

			return parsed.toString();
		} catch (e) {
			// Если URL невалидный, возвращаем null
			return null;
		}
	}

	/**
	 * Санитизация строки стилей
	 * @param {string} style
	 * @returns {string}
	 */
	sanitizeStyleString(style) {
		if (!style) return '';

		const styles = style.split(';').filter(s => s.trim());
		const sanitizedStyles = [];

		styles.forEach(styleRule => {
			const [property, value] = styleRule.split(':').map(s => s.trim());

			if (property && value) {
				const sanitizedProperty = this.sanitizeCSSProperty(property);
				const sanitizedValue = this.sanitizeCSSValue(property, value);

				if (sanitizedProperty && sanitizedValue !== null) {
					sanitizedStyles.push(`${sanitizedProperty}: ${sanitizedValue}`);
				}
			}
		});

		return sanitizedStyles.join('; ');
	}

	/**
	 * Санитизация свойства CSS
	 * @param {string} property
	 * @returns {string|null}
	 */
	sanitizeCSSProperty(property) {
		const normalized = property.toLowerCase().trim();

		// Проверяем что allowedCSSProperties существует
		if (!this.config.allowedCSSProperties) {
			return null;
		}

		// Проверяем разрешенные свойства
		if (this.config.allowedCSSProperties.includes(normalized)) {
			return normalized;
		}

		// Проверяем кастомные свойства CSS
		if (normalized.startsWith('--')) {
			return normalized;
		}

		return null;
	}

	/**
	 * Санитизация значения CSS
	 * @param {string} property
	 * @param {string} value
	 * @returns {string|null}
	 */
	sanitizeCSSValue(property, value) {
		const normalizedValue = value.trim();

		// Блокируем опасные значения
		const dangerousValues = [
			'expression', 'javascript:', 'data:', 'vbscript:'
		];

		if (dangerousValues.some(danger =>
			normalizedValue.toLowerCase().includes(danger))) {
			return null;
		}

		// Проверяем URL в CSS
		if (normalizedValue.includes('url(')) {
			const urlMatch = normalizedValue.match(/url\(['"]?(.*?)['"]?\)/);
			if (urlMatch) {
				const url = urlMatch[1];
				const sanitizedUrl = this.sanitizeURL(url);
				if (!sanitizedUrl) {
					return null;
				}
				return normalizedValue.replace(url, sanitizedUrl);
			}
		}

		return this.escapeCSS(normalizedValue);
	}

	/**
	 * Санитизация строки классов
	 * @param {string} classString
	 * @returns {string}
	 */
	sanitizeClassString(classString) {
		const classes = classString.split(/\s+/).filter(c => c.trim());
		const sanitizedClasses = [];

		classes.forEach(className => {
			if (this.config.allowedClassPattern.test(className)) {
				sanitizedClasses.push(className);
			}
		});

		return sanitizedClasses.join(' ');
	}

	/**
	 * Санитизация имени класса
	 * @param {string} className
	 * @returns {string|null}
	 */
	sanitizeClassName(className) {
		const trimmed = className.trim();
		return this.config.allowedClassPattern.test(trimmed) ? trimmed : null;
	}

	/**
	 * Санитизация имени события
	 * @param {string} eventName
	 * @returns {string|null}
	 */
	sanitizeEventName(eventName) {
		const normalized = eventName.toLowerCase().trim();
		// Проверяем что allowedEvents существует
		if (!this.config.allowedEvents || !this.config.allowedEvents.includes(normalized)) {
			return null;
		}
		return normalized;
	}

	/**
	 * Экранирование HTML
	 * @param {string} html
	 * @returns {string}
	 */
	escapeHTML(html) {
		const div = document.createElement('div');
		div.textContent = html;
		return div.innerHTML;
	}

	/**
	 * Экранирование атрибутов
	 * @param {string} value
	 * @returns {string}
	 */
	escapeAttribute(value) {
		return value
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#x27;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	/**
	 * Экранирование CSS
	 * @param {string} value
	 * @returns {string}
	 */
	escapeCSS(value) {
		return value.replace(/[<>"']/g, '');
	}
}

export { Templater, Sanitizer };


/**
 * Примеры


// 1. Безопасное создание из HTML
const safeHTML = new Templater()
	.createFromHTML(`
        <div onclick="alert('xss')">
            <script>alert('опасно')</script>
            <a href="javascript:alert(1)">Click me</a>
            <img src="x" onerror="alert('xss')">
        </div>
    `);
// Все опасные элементы и атрибуты будут удалены

// 2. Создание с настройками санитизатора
const renderer = new Templater()
	.setSanitizerConfig({
		allowedTags: [...Sanitizer.defaultConfig.allowedTags, 'custom-tag'],
		allowedAttributes: {
			...Sanitizer.defaultConfig.allowedAttributes,
			'custom-tag': ['data-custom']
		}
	})
	.createFromHTML('<custom-tag data-custom="value">Safe</custom-tag>');

// 3. Безопасная установка HTML
const div = Templater.createElement('div')
	.setSafeHTML('<script>alert("xss")</script>Safe content')
	.insertTo('body');
// Скрипт будет удален, останется только "Safe content"

// 4. Работа с пользовательским вводом
function renderUserContent(userInput) {
	return Templater.fromHTML(userInput, true)
		.insertTo('#user-content');
}

// 5. Безопасные атрибуты
const link = Templater.createElement('a', {
	attrs: {
		href: 'javascript:alert(1)',
		onclick: 'alert(2)',
		title: 'Safe title',
		'data-safe': 'value'
	},
	text: 'Click me'
});
// href и onclick будут удалены, остальные атрибуты сохранены

// 6. Статический метод для экранирования
const userText = '<script>alert("xss")</script>';
const escaped = Templater.escapeHTML(userText);
// Результат: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

// Можно создать кастомный санитизатор
const customSanitizer = new Sanitizer({
	allowedTags: ['div', 'span', 'p', 'a', 'img'],
	allowedAttributes: {
		'a': ['href', 'class'],
		'img': ['src', 'alt']
	},
	allowedSchemes: ['https', 'mailto']
});

// И использовать его
const renderer = new Templater();
renderer.sanitizer = customSanitizer; */