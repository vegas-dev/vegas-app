/**
 * Описание: константы и параметры по умолчанию базовой таблицы VGTable.
 * Возможности: единая настройка Data API, i18n, wrapper, remote-запросов, фильтров, sticky-заголовка, колонок, строк, сортировки, выбора и пагинации.
 */

/**
 * Служебные константы модуля.
 */
// Имя компонента в публичном API. Варианты: фиксированное значение 'table'.
const NAME = 'table';
// Ключ экземпляра в Data API. Варианты: фиксированное значение 'vg.table'.
const NAME_KEY = `vg.${NAME}`;
// Селектор автоматической инициализации. Варианты: элементы с атрибутом data-vg-table.
const SELECTOR_DATA_TOGGLE = '[data-vg-table]';
// Селектор обязательного адаптивного контейнера. Варианты: класс .vg-table-wrapper.
const WRAPPER_SELECTOR = '.vg-table-wrapper';
// Маркер wrapper, созданного компонентом. Варианты: пустой data-атрибут.
const GENERATED_WRAPPER_ATTRIBUTE = 'data-vg-table-generated-wrapper';
// Селектор обязательного внутреннего scroll-контейнера таблицы. Варианты: класс .vg-table-container.
const TABLE_CONTAINER_SELECTOR = '.vg-table-container';
// Маркер container, созданного компонентом. Варианты: пустой data-атрибут.
const GENERATED_TABLE_CONTAINER_ATTRIBUTE = 'data-vg-table-generated-container';

const DEFAULT_OPTIONS = {
	// Активная локаль встроенного интерфейса. Data API: data-locale. Варианты: 'ru' | 'en' | региональный BCP 47 код.
	locale: 'ru',
	// Пользовательские словари, объединяемые со встроенными ru/en. Data API отсутствует; варианты: объект {locale: {group: {key: value}}}.
	i18n: {},

	/** Локальная сортировка строк по значениям ячеек. */
	sort: {
		// Включает сортировку по клику и клавиатуре; сложная сетка отключает её автоматически. Варианты: true | false.
		enabled: true,
		// Показывает неактивные шевроны только при наведении. Варианты: true | false.
		hover: true,
		// Разрешает одновременно сортировать по нескольким колонкам. Data API: data-sort-multiple. Варианты: true | false.
		multiple: false,
		// Добавляет следующую колонку только при удержании Shift; false включает постоянный режим мультисортировки. Data API: data-sort-multiple-with-shift. Варианты: true | false.
		multipleWithShift: true,
	},

	/** Горизонтальное перемещение таблицы с зажатой клавишей Shift. */
	pan: {
		// Включает Shift-перетаскивание внутри wrapper. Варианты: true | false.
		enabled: true,
	},

	/** Нативная фиксация заголовка без клонирования таблицы. */
	stickyHeader: {
		// Включает position: sticky для ячеек thead. Варианты: true | false.
		enabled: false,
		// Выбирает область прокрутки. Варианты: 'container' | 'page'.
		mode: 'container',
		// Задаёт inline-отступ; null оставляет управление публичной CSS-переменной. Варианты: null | число пикселей | CSS length.
		top: null,
		// Ограничивает высоту body-слоя в container-режиме. Варианты: число пикселей | CSS length.
		maxHeight: '24rem',
	},

	/** Нативные фиксированные колонки без клонирования ячеек. */
	fixedColumns: {
		// Включает sticky-колонки; наличие columns или data-fixed у th включает их автоматически. Варианты: true | false.
		enabled: false,
		// Перечисляет колонки по data-field или zero-based индексу. Data API: data-fixed-columns. Варианты: 'left:id,name;right:actions' | {left: [], right: []}.
		columns: '',
		// Выбирает постоянную фиксацию крайних колонок или последовательное накопление при прокрутке. Варианты: 'fixed' | 'stack'.
		mode: 'fixed',
		// Добавляет расстояние между колонками в stack-режиме. Варианты: число пикселей >= 0.
		stackGap: 0,
	},

	/** Изменение ширины колонок указателем или через публичный API. */
	columnResize: {
		// Включает resize-handle в заголовках. Data API: data-column-resize-enable. Варианты: true | false.
		enabled: false,
		// Минимальная ширина колонки в пикселях. Data API: data-column-resize-min-width. Варианты: число >= 40.
		minWidth: 80,
		// Максимальная ширина колонки в пикселях. Data API: data-column-resize-max-width. Варианты: число >= minWidth.
		maxWidth: 600,
		// Сохраняет ширины в localStorage. Data API: data-column-resize-persist. Варианты: true | false.
		persist: false,
		// Переопределяет ключ localStorage. Data API: data-column-resize-storage-key. Варианты: string.
		storageKey: '',
		// Шаблон aria-label resize-handle; {column} заменяется заголовком. Варианты: непустая строка.
		label: 'Изменить ширину колонки {column}',
	},

	/** Перестановка колонок нативным drag-and-drop. */
	columnReorder: {
		// Включает перетаскивание заголовков. Data API: data-column-reorder-enable. Варианты: true | false.
		enabled: false,
		// Сохраняет порядок в localStorage. Data API: data-column-reorder-persist. Варианты: true | false.
		persist: false,
		// Переопределяет ключ localStorage. Data API: data-column-reorder-storage-key. Варианты: string.
		storageKey: '',
	},

	/** Скрытие и отображение колонок внешними checkbox или публичным API. */
	columnVisibility: {
		// Включает управление видимостью. Data API: data-column-visibility-enable. Варианты: true | false.
		enabled: false,
		// Находит контейнер checkbox с data-vg-table-column. Data API: data-column-visibility-controls. Варианты: Element | CSS selector | ''.
		controls: '',
		// Минимальное число видимых колонок. Data API: data-column-visibility-min-visible. Варианты: целое число >= 1.
		minVisible: 1,
		// Сохраняет скрытые поля в localStorage. Data API: data-column-visibility-persist. Варианты: true | false.
		persist: false,
		// Переопределяет ключ localStorage. Data API: data-column-visibility-storage-key. Варианты: string.
		storageKey: '',
	},

	/** Самостоятельное изменение порядка строк без editable-режима. */
	rowReorder: {
		// Включает native drag-and-drop строк. Data API: data-row-reorder-enable | data-row-reorder-enabled. Варианты: true | false.
		enabled: false,
		// Определяет область начала перетаскивания. Data API: data-row-reorder-mode. Варианты: 'handle' | 'row'.
		mode: 'handle',
		// Находит явный drag-handle внутри строки. Data API: data-row-reorder-handle-selector. Варианты: CSS selector.
		handleSelector: '[data-row-reorder-handle]',
		// Задаёт атрибут стабильного ключа строки. Data API: data-row-reorder-key-attr. Варианты: имя HTML-атрибута.
		keyAttr: 'data-row-key',
		// Сохраняет локальный порядок строк. Data API: data-row-reorder-persist. Варианты: true | false.
		persist: false,
		// Переопределяет ключ localStorage. Data API: data-row-reorder-storage-key. Варианты: string.
		storageKey: '',

		/** Доступные подписи drag-handle. */
		labels: {
			// Шаблон доступного имени; {row} заменяется ключом строки. Варианты: непустая строка.
			handle: 'Изменить позицию строки {row}',
		},
	},

	/** Выбор одной или нескольких строк таблицы. */
	selection: {
		// Включает API и состояния выбора строк. Варианты: true | false.
		enabled: false,
		// Разрешает выбирать строку кликом по её неинтерактивной области. Варианты: true | false.
		click: true,
		// Разрешает одновременный выбор нескольких строк. Варианты: true | false.
		multiple: false,
	},

	/** Многоуровневое дерево связанных родительских и дочерних строк. */
	expandable: {
		// Включает сворачивание и разворачивание ветвей. Варианты: true | false.
		enabled: false,
		// Задаёт имя атрибута с уникальным ID строки. Варианты: непустая строка с именем data-атрибута.
		idAttr: 'data-expand-id',
		// Задаёт имя атрибута с ID родительской строки. Варианты: непустая строка с именем data-атрибута.
		parentAttr: 'data-expand-parent-id',
		// Находит пользовательскую кнопку ветви. Варианты: корректный CSS-селектор.
		toggleSelector: '[data-expand-toggle]',
		// Сворачивает родительские строки при первой инициализации. Варианты: true | false.
		collapsed: true,

		/** Доступные подписи кнопки управления ветвью. */
		labels: {
			// Описывает действие для свёрнутой ветви. Варианты: непустая строка.
			expand: 'Развернуть дочерние строки',
			// Описывает действие для развёрнутой ветви. Варианты: непустая строка.
			collapse: 'Свернуть дочерние строки',
		},
	},

	/** Отдельное поле глобального поиска по локальным или серверным строкам. */
	search: {
		// Включает отдельное поле поиска. Data API: data-search-enable. Варианты: true | false.
		enabled: false,
		// Находит input поиска. Data API: data-search-input. Варианты: Element | CSS selector | ''.
		input: '',
		// Имя Remote-параметра. Data API: data-search-param. Варианты: непустая строка.
		param: 'q',
		// Задерживает поиск при вводе. Data API: data-search-debounce. Варианты: целое число миллисекунд >= 0.
		debounce: 300,
		// Сбрасывает активную страницу при изменении запроса. Data API: data-search-reset-page. Варианты: true | false.
		resetPage: true,
		// Удаляет пробелы по краям запроса. Data API: data-search-trim. Варианты: true | false.
		trim: true,
		// Ограничивает локальный поиск полями data-field; пустой список ищет во всех разрешённых колонках. Data API: data-search-fields. Варианты: массив | строка через запятую.
		fields: [],
		// Селектор кнопки очистки. Data API: data-search-button-reset. Варианты: CSS selector.
		button: {reset: '[data-search-reset]'},
	},

	/** Внешняя форма локальных или серверных фильтров. */
	filters: {
		// Включает подключение формы фильтров. Data API: data-filters-enable | data-filters-enabled. Варианты: true | false.
		enabled: false,
		// Находит форму или контейнер с контролами. Data API: data-filters-form. Варианты: Element | CSS selector | ''.
		form: '',
		// Задерживает применение текстовых полей в auto-режиме. Data API: data-filters-debounce. Варианты: целое число миллисекунд >= 0.
		debounce: 300,
		// Определяет немедленное применение или ожидание submit/apply. Data API: data-filters-apply. Варианты: 'auto' | 'manual'.
		apply: 'auto',
		// Сбрасывает активную страницу после изменения фильтров. Data API: data-filters-reset-page. Варианты: true | false.
		resetPage: true,
		// Не создаёт фильтры для пустых значений. Data API: data-filters-skip-empty. Варианты: true | false.
		skipEmpty: true,
		// Удаляет пробелы по краям текстовых значений. Data API: data-filters-trim. Варианты: true | false.
		trim: true,
		// Задаёт оператор для контролов без data-filter-operator. Data API: data-filters-default-operator. Варианты: eq | neq | contains | starts | ends | gt | gte | lt | lte | in | notin.
		defaultOperator: 'eq',
		// Имена служебных атрибутов формы. Data API: data-filters-*-attr. Варианты: валидные имена HTML-атрибутов.
		fieldAttr: 'data-filter-field',
		partAttr: 'data-filter-part',
		typeAttr: 'data-filter-type',
		valueAttr: 'data-filter-value',
		operatorAttr: 'data-filter-operator',

		/** Селекторы кнопок ручного применения и сброса. */
		buttons: {
			// Data API: data-filters-button-apply. Варианты: CSS selector.
			apply: '[data-filter-apply]',
			// Data API: data-filters-button-reset. Варианты: CSS selector.
			reset: '[data-filter-reset]',
		},

	},

	/** Состояния результата, ошибки и восстановления таблицы. */
	state: {
		// Включает встроенный state-layer. Data API: data-state-enable. Варианты: true | false.
		enabled: true,

		/** Тексты состояний и действий. */
		labels: {
			// Пустая таблица без исходных данных. Data API: data-state-empty-label. Варианты: непустая строка.
			empty: 'Нет данных',
			// Нет совпадений при активном поиске или фильтрах. Data API: data-state-filtered-empty-label. Варианты: непустая строка.
			'filtered-empty': 'По вашему запросу ничего не найдено',
			// Ошибка Remote-запроса. Data API: data-state-error-label. Варианты: непустая строка.
			error: 'Не удалось загрузить данные',
			// Повтор Remote-запроса. Data API: data-state-retry-label. Варианты: непустая строка.
			retry: 'Повторить',
			// Сброс поиска и фильтров из filtered-empty. Data API: data-state-reset-label. Варианты: непустая строка.
			reset: 'Сбросить фильтры',
		},
	},

	/** Единая синхронизация пользовательского состояния с query string. */
	urlState: {
		// Включает общий URL state. Data API: data-url-state-enable. Варианты: true | false.
		enabled: false,
		// Читает query string при инициализации. Data API: data-url-state-read. Варианты: true | false.
		read: true,
		// Записывает изменения в query string. Data API: data-url-state-write. Варианты: true | false.
		write: true,
		// Обрабатывает back/forward через popstate. Data API: data-url-state-listen. Варианты: true | false.
		listen: true,
		// Способ обновления истории. Data API: data-url-state-mode. Варианты: 'replace' | 'push'.
		mode: 'replace',
		// Общий префикс ключей для нескольких таблиц на странице. Data API: data-url-state-prefix. Варианты: string.
		prefix: '',

		/** Имена query-параметров. */
		keys: {
			// Номер страницы. Data API: data-url-state-page-key. Варианты: непустая строка.
			page: 'page',
			// Количество строк. Data API: data-url-state-per-page-key. Варианты: непустая строка.
			perPage: 'perPage',
			// Поле сортировки. Data API: data-url-state-sort-key. Варианты: непустая строка.
			sort: 'sort',
			// Направление сортировки. Data API: data-url-state-direction-key. Варианты: непустая строка.
			direction: 'dir',
			// Глобальный поиск. Data API: data-url-state-search-key. Варианты: непустая строка.
			search: 'search',
			// Префикс полей фильтров. Data API: data-url-state-filter-prefix. Варианты: string.
			filterPrefix: 'filter-',
		},

		/** Управляемые части состояния. */
		include: {
			// Data API: data-url-state-include-pagination. Варианты: true | false.
			pagination: true,
			// Data API: data-url-state-include-sort. Варианты: true | false.
			sort: true,
			// Data API: data-url-state-include-search. Варианты: true | false.
			search: true,
			// Data API: data-url-state-include-filters. Варианты: true | false.
			filters: true,
		},
	},

	/** Визуальное состояние Remote-загрузки с сохранением геометрии таблицы. */
	loading: {
		// Включает skeleton вместо текстовой строки загрузки. Data API: data-loading-enable. Варианты: true | false.
		enabled: true,
		// Минимальное время показа skeleton в миллисекундах. Data API: data-loading-min-delay. Варианты: целое число >= 0.
		minDelay: 500,
		// Число строк для изначально пустой таблицы. Data API: data-loading-skeleton | data-loading-skeleton-rows. Варианты: целое число >= 1.
		skeleton: 5,
	},

	/** Загрузка строк и серверной метаинформации через общий Ajax-компонент. */
	request: {
		// URL endpoint; непустое значение автоматически включает remote-режим. Data API: data-request-route. Варианты: string | ''.
		route: '',
		// HTTP-метод запроса. Data API: data-request-method. Варианты: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'.
		method: 'GET',
		// Режим credentials для fetch. Data API: data-request-credentials. Варианты: 'same-origin' | 'include' | 'omit'.
		credentials: 'same-origin',
		// Базовые HTTP-заголовки. Data API: нет прямого атрибута. Варианты: объект заголовков fetch.
		headers: {'Accept': 'application/json'},
		// Базовые query-параметры для каждого запроса. Data API: data-request-params (JSON). Варианты: plain object.
		params: {},
		// Переименовывает внутренние параметры перед отправкой. Data API: data-request-parammap (JSON). Варианты: plain object вида {q: 'search'}.
		parammap: {},
		// Выбирает источник разметки строк. Data API: data-request-responsemode. Варианты: 'data' | 'view' | 'auto'.
		responsemode: 'data',
		// Dot-path до массива строк JSON. Data API: data-request-datapath. Варианты: непустой dot-path.
		datapath: 'data',
		// Dot-path до объекта серверной пагинации. Data API: data-request-metapath. Варианты: непустой dot-path.
		metapath: 'meta',
		// Dot-path до готовой HTML-разметки строк. Data API: data-request-viewpath. Варианты: непустой dot-path.
		viewpath: 'view.tbody',
		// Имя параметра, запрашивающего server-rendered view. Data API: data-request-viewparam. Варианты: string | ''.
		viewparam: 'view',
		// Значение параметра server-rendered view. Data API: data-request-viewvalue. Варианты: string | ''.
		viewvalue: 'rows',
		// Имя параметра со списком data-field колонок. Data API: data-request-fieldsparam. Варианты: string | ''.
		fieldsparam: 'fields',

		/** Кратковременный cache одинаковых remote-запросов. */
		cache: {
			// Включает cache ответов в памяти экземпляра. Data API: data-request-cache-enable. Варианты: true | false.
			enable: true,
			// Время жизни записи cache в миллисекундах. Data API: data-request-cache-ttl. Варианты: целое число >= 1.
			ttl: 30000,
			// Максимальное число записей с вытеснением давно использованных. Data API: data-request-cache-max. Варианты: целое число >= 1.
			max: 30,
		},

		/** Отдельный endpoint выгрузки текущего remote-состояния. */
		export: {
			// URL endpoint выгрузки; пустая строка использует основной route. Data API: data-request-export-route. Варианты: string | ''.
			route: '',
		},
	},

	/** Локальная или серверная пагинация строк. */
	pagination: {
		// Включает разбиение строк и элементы навигации. Варианты: true | false.
		enabled: false,
		// Задаёт начальную страницу. Варианты: целое число >= 1.
		page: 1,
		// Задаёт начальное количество строк на странице. Варианты: целое число от 1 до max.
		per: 10,
		// Ограничивает произвольное количество строк на странице. Варианты: целое число >= 1.
		max: 100,
		// Определяет расположение пагинации относительно таблицы. Варианты: 'top' | 'bottom' | 'both'.
		position: 'bottom',
		// Выравнивает элементы внутри панели пагинации. Варианты: 'left' | 'center' | 'right' | 'between'.
		align: 'right',
		// Заменяет скрытые диапазоны страниц интерактивным многоточием. Варианты: true | false.
		ellipsis: true,
		// Заменяет точки направленным двойным шевроном при hover и focus. Варианты: true | false.
		ellipsisHover: true,
		// Задаёт число страниц, после которого разрешены многоточие и quick='auto'. Варианты: целое число >= 1.
		threshold: 5,
		// Задаёт максимальное число соседних страниц между первой и последней. Варианты: целое число >= 1.
		visible: 5,

		/** Поле и VGDropdown для выбора количества строк. */
		size: {
			// Показывает контрол количества строк на странице. Варианты: true | false.
			enabled: false,
			// Задаёт предустановленные размеры страницы. Варианты: массив целых чисел от 1 до max.
			options: [10, 25, 50, 100],
			// Задаёт видимую подпись поля; false скрывает её. Варианты: string | false.
			label: 'Строк на странице',
			// Добавляет текст после числового значения. Варианты: string | ''.
			suffix: 'на страницу',
		},

		/** Поле прямого перехода к номеру страницы. */
		quick: {
			// Показывает быстрый переход всегда, никогда или после threshold. Варианты: true | false | 'auto'.
			enabled: false,
			// Задаёт доступную подпись поля номера страницы. Варианты: непустая строка.
			label: 'Перейти к странице',
			// Задаёт текст кнопки подтверждения перехода. Варианты: непустая строка.
			button: 'Перейти',
		},

		/** Сохранение состояния локальной пагинации. */
		persist: {
			// Сохраняет текущую страницу в localStorage. Варианты: true | false.
			page: true,
			// Сохраняет количество строк на странице в localStorage. Варианты: true | false.
			per: true,
		},

		/** Идентификация записи состояния в localStorage. */
		storage: {
			// Задаёт явный ключ; пустая строка включает автоматический ключ. Варианты: string | ''.
			key: '',
		},

		// Управляет прокруткой после смены страницы. Варианты: false | 'table' | 'window'.
		scroll: false,

		/** Доступные подписи навигации для screen reader. */
		labels: {
			// Задаёт aria-label блока навигации. Варианты: непустая строка.
			aria: 'Пагинация',
			// Задаёт aria-label кнопки предыдущей страницы. Варианты: непустая строка.
			prev: 'Назад',
			// Задаёт aria-label кнопки следующей страницы. Варианты: непустая строка.
			next: 'Вперёд',
			// Задаёт aria-label перехода через левое многоточие. Варианты: непустая строка.
			ellipsisPrev: 'Перейти к предыдущим страницам',
			// Задаёт aria-label перехода через правое многоточие. Варианты: непустая строка.
			ellipsisNext: 'Перейти к следующим страницам',
		},
	}
};

export {
	DEFAULT_OPTIONS,
	GENERATED_TABLE_CONTAINER_ATTRIBUTE,
	GENERATED_WRAPPER_ATTRIBUTE,
	NAME,
	NAME_KEY,
	SELECTOR_DATA_TOGGLE,
	TABLE_CONTAINER_SELECTOR,
	WRAPPER_SELECTOR,
};
