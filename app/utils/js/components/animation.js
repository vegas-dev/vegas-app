import { isElement, mergeDeepObject } from "../functions";
import EventHandler from "../dom/event";

/**
 * Анимация на основе Animate.css
 * Поддерживает модули с событиях: show, shown, hide, hidden
 *
 * @see https://animate.style/
 */
class Animation {
	static get DEFAULTS() {
		return {
			enable: false,
			in: 'animate__fadeIn',     // Анимация при появлении
			out: 'animate__fadeOut',   // Анимация при скрытии
			duration: 500,             // Длительность анимации (мс)
		};
	}

	constructor(element, key, userParams = {}) {
		this._element = element;
		this._nameKey = key;

		// Объединение параметров
		this._params = mergeDeepObject(Animation.DEFAULTS, userParams);

		// Ранний выход, если анимация отключена или элемент не валиден
		if (!this._params.enable || !isElement(element)) {
			return;
		}

		this._classes = {
			animated: 'animate__animated',
			duration: 'animate__fast' // Используем классы animate.css
		};

		this._init();
	}

	/**
	 * Инициализация анимации
	 * @private
	 */
	_init() {
		const { classList } = this._element;

		// Добавляем общие классы
		classList.add(this._classes.animated, this._classes.duration);

		// Удаляем стандартный класс 'fade', если используется animate.css
		if (classList.contains('fade')) {
			classList.remove('fade');
		}

		// Назначаем обработчики событий
		this._setupEventListeners();
	}

	/**
	 * Назначение обработчиков событий
	 * @private
	 */
	_setupEventListeners() {
		EventHandler.on(this._element, `${this._nameKey}.show`, this._handleShow.bind(this), null);
		EventHandler.on(this._element, `${this._nameKey}.shown`, this._handleShown.bind(this), null);
		EventHandler.on(this._element, `${this._nameKey}.hide`, this._handleHide.bind(this), null);
		EventHandler.on(this._element, `${this._nameKey}.hidden`, this._handleHidden.bind(this), null);
	}

	/**
	 * Обработка события "show" — запуск анимации входа
	 * @private
	 */
	_handleShow() {
		const { classList } = this._element;
		const { in: inClass, out: outClass } = this._params;

		// Убираем выходную анимацию, если была
		if (classList.contains(outClass)) {
			classList.remove(outClass);
		}

		// Добавляем входную анимацию
		classList.add(inClass);
	}

	/**
	 * Обработка события "shown" — завершение анимации входа
	 * @private
	 */
	_handleShown() {
		this._element.classList.add(this._classes.animated);
	}

	/**
	 * Обработка события "hide" — запуск анимации выхода
	 * @private
	 */
	_handleHide() {
		const { classList } = this._element;
		const { in: inClass, out: outClass } = this._params;

		// Убираем входную анимацию
		if (classList.contains(inClass)) {
			classList.remove(inClass);
		}

		// Добавляем выходную анимацию
		classList.add(outClass);
	}

	/**
	 * Обработка события "hidden" — очистка анимационных классов
	 * @private
	 */
	_handleHidden() {
		const { classList } = this._element;
		const { in: inClass, out: outClass } = this._params;

		// Удаляем все анимационные классы animate.css
		[...classList]
			.filter(cls => cls.startsWith('animate__'))
			.forEach(cls => classList.remove(cls));

		// Восстанавливаем базовые классы для будущих анимаций
		classList.add(this._classes.animated, this._classes.duration);
	}

	/**
	 * Уничтожение экземпляра (очистка событий)
	 */
	dispose() {
		EventHandler.off(this._element, `${this._nameKey}.show`, null, null);
		EventHandler.off(this._element, `${this._nameKey}.shown`, null, null);
		EventHandler.off(this._element, `${this._nameKey}.hide`, null, null);
		EventHandler.off(this._element, `${this._nameKey}.hidden`, null, null);

		// Очищаем анимационные классы
		[...this._element.classList]
			.filter(cls => cls.startsWith('animate__'))
			.forEach(cls => this._element.classList.remove(cls));

		this._element = null;
	}
}

export default Animation;