const DEFAULT_OPTIONS = {
    // Режим темы таблицы.
    // data-атрибуты: data-theme
    theme: 'auto', // auto | light | dark

    // Ключ локали для выбора словаря i18n.
    // data-атрибуты: data-locale
    locale: 'ru',

    // Локализованные словари интерфейса.
    // data-атрибуты: нет прямого (обычно задается из JS)
    i18n: {
        ru: {
            pagination: {
                // Подпись блока per-page.
                // data-атрибуты: data-pagination-per-page-label
                perPageLabel: 'Строк на странице',
                // Суффикс варианта per-page.
                // data-атрибуты: data-pagination-per-page-option-suffix
                perPageOptionSuffix: 'на страницу',
                // Текст кнопки "назад".
                // data-атрибуты: data-pagination-prev-label
                prevLabel: 'Назад',
                // Текст кнопки "вперед".
                // data-атрибуты: data-pagination-next-label
                nextLabel: 'Вперед',
                // Текст кнопки быстрого перехода.
                // data-атрибуты: data-pagination-quick-jump-button-label
                quickJumpButtonLabel: 'Перейти',
            },
            table: {
                // Текст состояния загрузки.
                // data-атрибуты: data-table-loading-label
                loading: 'Загрузка данных...',
                // Текст пустого состояния.
                // data-атрибуты: data-table-empty-label
                empty: 'Нет данных.',
                // Текст состояния ошибки.
                // data-атрибуты: data-table-error-label
                error: 'Не удалось загрузить данные.',
                // Текст кнопки повторного запроса при ошибке.
                // data-атрибуты: data-table-retry-label
                retry: 'Повторить',
                // Подсказка для горизонтальной прокрутки таблицы.
                // data-атрибуты: data-table-shift-drag-hint
                shiftDragHint: 'Зажмите Shift и тяните мышью для прокрутки таблицы.',
            },
            sortable: {
                // Подсказка сортировки по возрастанию.
                // data-атрибуты: data-sort-asc-label
                ascLabel: 'Сортировка по возрастанию',
                // Подсказка сортировки по убыванию.
                // data-атрибуты: data-sort-desc-label
                descLabel: 'Сортировка по убыванию',
            },
            summary: {
                // Подпись общего количества.
                // data-атрибуты: data-summary-found-label
                foundLabel: 'Найдено',
                // Подпись активного поиска.
                // data-атрибуты: data-summary-search-label
                searchLabel: 'Поиск',
                // Подпись видимых строк.
                // data-атрибуты: data-summary-visible-rows-label
                visibleRowsLabel: 'Строк на странице',
                // Подпись суммы цен.
                // data-атрибуты: data-summary-page-price-sum-label
                pagePriceSumLabel: 'Сумма цен',
                // Подпись суммарного остатка.
                // data-атрибуты: data-summary-page-stock-sum-label
                pageStockSumLabel: 'Суммарный остаток',
                // Подпись среднего рейтинга.
                // data-атрибуты: data-summary-page-avg-rating-label
                pageAvgRatingLabel: 'Средний рейтинг',
            },
        },
        en: {
            pagination: {
                perPageLabel: 'Rows per page',
                perPageOptionSuffix: 'page',
                prevLabel: 'Prev',
                nextLabel: 'Next',
                quickJumpButtonLabel: 'Go',
            },
            table: {
                loading: 'Loading data...',
                empty: 'No data available.',
                error: 'Failed to load data.',
                retry: 'Retry',
                shiftDragHint: 'Hold Shift and drag to scroll the table.',
            },
            sortable: {
                ascLabel: 'Sort ascending',
                descLabel: 'Sort descending',
            },
            summary: {
                foundLabel: 'Found',
                searchLabel: 'Search',
                visibleRowsLabel: 'Rows on page',
                pagePriceSumLabel: 'Price sum',
                pageStockSumLabel: 'Total stock',
                pageAvgRatingLabel: 'Average rating',
            },
        },
    },

    // Локальный источник строк (без remote API).
    // data-атрибуты: нет прямого
    data: [],

    fixed: {
        // data-attributes: data-fixed-columns
        columns: '',
    },

    views: {
        storage: {
            // data-attributes: data-views-storage-key
            key: '',
        },
    },

    request: {
        // URL endpoint для remote-запросов.
        // data-атрибуты: data-request-route
        route: '',
        // HTTP-метод запроса.
        // data-атрибуты: data-request-method
        method: 'GET',
        // Режим credentials для fetch.
        // data-атрибуты: data-request-credentials
        credentials: 'same-origin',
        // Базовые HTTP-заголовки.
        // data-атрибуты: нет прямого
        headers: { 'Accept': 'application/json' },
        // Базовые query-параметры для каждого запроса.
        // data-атрибуты: data-request-params (json)
        params: {},
        // Маппинг внутренних параметров в backend-имена (например, q -> search).
        // data-атрибуты: data-request-parammap
        parammap: {},
        // Режим чтения ответа: data | view | auto.
        // data-атрибуты: data-request-responsemode
        responsemode: 'data',
        // Dot-path до массива строк в JSON.
        // data-атрибуты: data-request-datapath
        datapath: 'data',
        // Dot-path до meta в JSON.
        // data-атрибуты: data-request-metapath
        metapath: 'meta',
        // Dot-path до server-rendered HTML строк.
        // data-атрибуты: data-request-viewpath
        viewpath: 'view.tbody',
        // Имя параметра для запроса server-rendered view.
        // data-атрибуты: data-request-viewparam
        viewparam: 'view',
        // Значение параметра для server-rendered view.
        // data-атрибуты: data-request-viewvalue
        viewvalue: 'rows',
        // Имя параметра списка полей для view-режима.
        // data-атрибуты: data-request-fieldsparam
        fieldsparam: 'fields',
        cache: {
            // data-attributes: data-request-cache-enable
            enable: true,
            // data-attributes: data-request-cache-ttl
            ttl: 30000,
            // data-attributes: data-request-cache-max
            max: 30,
        },
        export: {
            // data-attributes: data-request-export-route
            route: '',
        },
    },

    pagination: {
        // Canonical key for enable flag.
        // data-attributes: data-pagination-enable
        enable: false,
        // Начальная страница.
        // data-атрибуты: data-pagination-page
        page: 1,
        // Начальный per-page.
        // data-атрибуты: data-pagination-perPage | data-pagination-per-page
        perPage: 10,
        // Canonical key for page size.
        // data-attributes: data-pagination-per
        per: 10,
        // Максимально допустимый per-page.
        // data-атрибуты: data-pagination-maxPerPage | data-pagination-max-per-page
        maxPerPage: 100,
        // Canonical key for max page size.
        // data-attributes: data-pagination-max
        max: 100,
        // Сохранять страницу в localStorage.
        // data-атрибуты: data-pagination-persist-page
        persistPage: true,
        // Сохранять per-page в localStorage.
        // data-атрибуты: data-pagination-persist-per-page
        persistPerPage: true,
        persist: {
            // data-attributes: data-pagination-persist-page
            page: true,
            // data-attributes: data-pagination-persist-per
            per: true,
        },
        // Ключ storage для per-page.
        // data-атрибуты: data-pagination-storage-key
        storageKey: '',
        // Ключ storage для page.
        // data-атрибуты: data-pagination-page-storage-key
        pageStorageKey: '',
        storage: {
            // data-attributes: data-pagination-storage-key
            key: '',
        },
        pageStorage: {
            storage: {
                // data-attributes: data-pagination-page-storage-key
                key: '',
            },
        },
        // Фиксированное число страниц (опционально).
        // data-атрибуты: data-pagination-totalPages | data-pagination-total-pages
        totalPages: null,
        // Позиция пагинатора.
        // data-атрибуты: data-pagination-position
        position: 'bottom', // top | bottom | both
        // Выравнивание пагинатора.
        // data-атрибуты: data-pagination-align
        align: 'left', // left | center | right | between
        // Режим рендера контролов.
        // data-атрибуты: data-pagination-renderMode | data-pagination-render-mode
        renderMode: 'auto', // auto | class | markup
        // Использовать многоточия.
        // data-атрибуты: data-pagination-ellipsis
        ellipsis: true,
        // Порог появления многоточий.
        // data-атрибуты: data-pagination-ellipsisAfter | data-pagination-ellipsis-after
        ellipsisAfter: 5,
        // Максимум видимых кнопок страниц.
        // data-атрибуты: data-pagination-maxVisiblePages | data-pagination-max-visible-pages
        maxVisiblePages: 5,
        // Показывать контрол per-page.
        // data-атрибуты: data-pagination-showPerPage | data-pagination-show-per-page
        showPerPage: true,
        // Показывать подпись рядом с per-page.
        // data-атрибуты: data-pagination-showPerPageLabel | data-pagination-show-per-page-label
        showPerPageLabel: false,
        // Прокручивать к началу таблицы при смене страницы.
        // data-атрибуты: data-pagination-scrollToTop | data-pagination-scroll-to-top
        scrollToTop: true,
        // Прокручивать страницу к началу окна браузера при смене страницы.
        // data-атрибуты: data-pagination-scrollToWindowTop | data-pagination-scroll-to-window-top
        scrollToWindowTop: false,
        // Режим быстрого перехода.
        // data-атрибуты: data-pagination-quickJump | data-pagination-quick-jump
        quickJump: false, // auto | true | false
        // Подпись кнопки быстрого перехода.
        // data-атрибуты: data-pagination-quickJumpButtonLabel | data-pagination-quick-jump-button-label
        quickJumpButtonLabel: 'Перейти',
        // Доступные варианты per-page.
        // data-атрибуты: data-pagination-perPageOptions | data-pagination-per-page-options
        perPageOptions: [10, 25, 50, 100],
        // Колбек смены страницы.
        // data-атрибуты: нет прямого
        onChange: null,
        // Колбек смены per-page.
        // data-атрибуты: нет прямого
        onPerPageChange: null,
    },

    sortable: {
        // Canonical key for enable flag.
        // data-attributes: data-sortable-enable
        enable: true,
        // Начальное поле сортировки.
        // data-атрибуты: data-sort
        initialField: '',
        // Начальное направление сортировки.
        // data-атрибуты: data-dir
        initialDir: 'asc',
        // Включить мультисортировку.
        // data-атрибуты: data-sort-multi | data-sortmulti
        multi: false,
        // Мультисортировка только с Shift.
        // data-атрибуты: data-sort-multi-with-shift | data-sortmultiWithShift
        multiWithShift: true,
        // Белый список сортируемых полей.
        // data-атрибуты: data-sort-fields
        fields: [],
        // Скрывать стрелки у несортированных колонок.
        // data-атрибуты: data-sort-hide-unsorted-arrows
        hideUnsortedArrows: true,
        // Пользовательская проверка сортируемости колонки.
        // data-атрибуты: нет прямого
        isColumnSortable: () => true,
    },

    columnReorder: {
        // Canonical key for enable flag.
        // data-attributes: data-column-reorder-enable
        enable: false,
        // Сохранять порядок колонок.
        // data-атрибуты: data-column-reorder-persist
        persist: false,
        // Ключ storage для порядка колонок.
        // data-атрибуты: data-column-reorder-storage-key
        storageKey: '',
    },

    columnResize: {
        // Canonical key for enable flag.
        // data-attributes: data-column-resize-enable
        enable: false,
        // Минимальная ширина колонки.
        // data-атрибуты: data-column-resize-min-width
        minWidth: 80,
        // Максимальная ширина колонки.
        // data-атрибуты: data-column-resize-max-width
        maxWidth: 600,
    },

    virtual: {
        // Canonical key for enable flag.
        // data-attributes: data-virtual-enable
        enable: false,
        // Ожидаемая высота строки (px).
        // data-атрибуты: data-virtual-row-height
        rowHeight: 44,
        // Запас строк вне viewport.
        // data-атрибуты: data-virtual-overscan
        overscan: 8,
        // Порог числа строк для активации виртуализации.
        // data-атрибуты: data-virtual-threshold
        threshold: 500,
    },

    expandable: {
        // Enable tree-like expandable rows.
        // data-attributes: data-expandable-enable
        enable: false,
        // Attribute name with unique row id.
        // data-attributes: data-expandable-id-attr
        idAttr: 'data-expand-id',
        // Attribute name with parent row id.
        // data-attributes: data-expandable-parent-attr
        parentAttr: 'data-expand-parent-id',
        // Selector for toggle control inside row.
        // data-attributes: data-expandable-toggle-selector
        toggleSelector: '[data-expand-toggle]',
        // Collapse groups by default.
        // data-attributes: data-expandable-collapsed
        collapsed: true,
    },

    loading: {
        // Canonical key for minimum loading delay.
        // data-attributes: data-loading-min-delay
        minDelay: 500,
        // Количество skeleton-строк.
        // data-атрибуты: data-loading-skeleton | data-loading-skeleton-rows
        skeleton: 10,
    },

    summary: {
        // Canonical key for enable flag.
        // data-attributes: data-summary-enable
        enable: false,
    },

    footer: {
        // Canonical key for enable flag.
        // data-attributes: data-footer-enable
        enable: false,
    },

    state: {
        // SVG/URL для иллюстрации error-state.
        // data-атрибуты: data-state-error-illustration
        errorIllustration: '<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="36" stroke="currentColor" stroke-opacity="0.32" stroke-width="4"/><path d="M50 30V56" stroke="currentColor" stroke-opacity="0.7" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="68" r="4" fill="currentColor" fill-opacity="0.7"/></svg>',
        // SVG/URL для иллюстрации empty-state.
        // data-атрибуты: data-state-empty-illustration
        emptyIllustration: '<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="24" width="64" height="52" rx="8" stroke="currentColor" stroke-opacity="0.32" stroke-width="4"/><path d="M30 40H70M30 50H62M30 60H54" stroke="currentColor" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round"/><circle cx="72" cy="68" r="10" stroke="currentColor" stroke-opacity="0.6" stroke-width="4"/><path d="M79 75L86 82" stroke="currentColor" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round"/></svg>',
    },

    panHint: {
        // Canonical key for dismiss days.
        // data-attributes: data-pan-hint-dismiss
        dismiss: 60,
        // Сколько дней скрывать подсказку "Shift + drag" после закрытия.
        // data-атрибуты: data-pan-hint-dismiss-days
        dismissDays: 60,
    },

    stickyHeader: {
        // Canonical key for enable flag.
        // data-attributes: data-sticky-header-enable
        enable: false,
        // Отступ сверху для sticky-header (px).
        // data-атрибуты: data-sticky-header-top-offset | data-stickyHeader-top
        top: 0,
        // Максимальная высота viewport таблицы.
        // data-атрибуты: data-sticky-header-max-height | data-stickyHeader-max
        max: 0,
    },

    search: {
        // Canonical key for enable flag.
        // data-attributes: data-search-enable
        enable: false,
        // Debounce поиска.
        // data-атрибуты: data-search-debounce | data-search-debounce-ms
        debounce: 300,
        // Имя query-параметра поиска.
        // data-атрибуты: data-search-param
        param: 'q',
        // CSS-селектор input поиска.
        // data-атрибуты: data-search-input | data-search-input-selector
        input: '',
    },

    filters: {
        // Canonical key for enable flag.
        // data-attributes: data-filters-enable
        enable: false,
        // CSS-селектор формы фильтров.
        // data-атрибуты: data-filters-form | data-filters-form-selector
        form: '',
        // Debounce фильтров.
        // data-атрибуты: data-filters-debounce | data-filters-debounce-ms
        debounce: 300,
        // Режим применения фильтров.
        // data-атрибуты: data-filters-apply | data-filters-apply-mode
        apply: 'auto', // auto | manual
        // Селекторы кнопок применения/сброса.
        // data-attributes: data-filters-button-apply | data-filters-button-reset
        button: {
            apply: '[data-filter-apply]',
            reset: '[data-filter-reset]',
        },
        // Отдельный route для фильтрации (опционально).
        // data-атрибуты: data-filters-route
        route: '',
        // Атрибут ключа фильтра (канонический field id).
        // data-атрибуты: data-filters-field-attr
        fieldAttr: 'data-filter-field',
        // Атрибут части фильтра (value|operator).
        // data-атрибуты: data-filters-part-attr
        partAttr: 'data-filter-part',
        // Атрибут типа сравнения (eq|contains|gt|...).
        // data-атрибуты: data-filters-type-attr
        typeAttr: 'data-filter-type',
        // Атрибут значения по умолчанию для фильтра.
        // data-атрибуты: data-filters-value-attr
        valueAttr: 'data-filter-value',
        // Атрибут оператора по умолчанию для фильтра.
        // data-атрибуты: data-filters-operator-attr
        operatorAttr: 'data-filter-operator',
        // Оператор по умолчанию.
        // data-атрибуты: data-filters-default-operator
        defaultOperator: 'eq',
        // Сбрасывать страницу при изменении фильтров.
        // data-атрибуты: data-filters-reset-page-on-change
        resetPageOnChange: true,
        // Пропускать пустые значения фильтров.
        // data-атрибуты: data-filters-skip-empty
        skipEmpty: true,
        // Trim текстовых значений.
        // data-атрибуты: data-filters-trim-values
        trimValues: true,
        // Всегда эмитить полный контекст sent/received для callbacks/events.
        // data-атрибуты: data-filters-emit-full-context
        emitFullContext: true,
        // URL-state для фильтров.
        urlState: {
            // data-атрибуты: data-filters-urlstate-enable
            enable: false,
            // data-атрибуты: data-filters-urlstate-read-on-init
            readOnInit: true,
            // data-атрибуты: data-filters-urlstate-write-on-change
            writeOnChange: true,
            // data-атрибуты: data-filters-urlstate-history-mode
            historyMode: 'replace', // replace | push
            // data-атрибуты: data-filters-urlstate-prefix
            paramPrefix: 'f.',
            // data-атрибуты: data-filters-urlstate-page-key
            pageKey: 'page',
            // data-атрибуты: data-filters-urlstate-per-page-key
            perPageKey: 'perPage',
            // data-атрибуты: data-filters-urlstate-sort-key
            sortKey: 'sort',
        },
        // Конфигурация транспортного payload.
        transport: {
            // data-атрибуты: data-filters-payload-key
            payloadKey: 'filters',
            // data-атрибуты: data-filters-include-meta
            includeMeta: true,
            // data-атрибуты: data-filters-include-urlstate
            includeUrlState: true,
        },
        // Конфигурация response mapping.
        response: {
            // data-атрибуты: data-filters-response-rows-path
            rowsPath: 'data.rows',
            // data-атрибуты: data-filters-response-total-path
            totalPath: 'data.total',
            // data-атрибуты: data-filters-response-meta-path
            metaPath: 'meta',
            // data-атрибуты: data-filters-response-applied-filters-path
            appliedFiltersPath: 'meta.appliedFilters',
        },
    },

    urlState: {
        // Canonical key for enable flag.
        // data-attributes: data-url-state-enable
        enable: false,
        // Режим history обновлений.
        // data-атрибуты: data-url-state-mode | data-url-state-mode
        mode: 'replace', // replace | push
        include: {
            // data-attributes: data-urlstate-include-pagination
            pagination: false,
            // data-attributes: data-urlstate-include-sort
            sort: false,
        },
        listen: {
            // data-attributes: data-url-state-listen-popstate
            popstate: false,
        },
    },

    editable: {
        // Enable editable mode.
        // data-attributes: data-editable-enable
        enable: false,
        // Enable drag-and-drop row reorder.
        // data-attributes: data-row-reorder-enable
        rowReorder: true,
        // Row reorder drag mode.
        // data-attributes: data-row-reorder-mode
        rowReorderMode: 'row', // row | handle
        // CSS selector for explicit drag handle inside row.
        // data-attributes: data-row-reorder-handle-selector
        rowReorderHandleSelector: '[data-row-reorder-handle]',
    },

    callbacks: {
        // Событие инициализации.
        onInit: null,
        // Начало remote-загрузки.
        onBeforeLoad: null,
        // Успешная загрузка данных.
        onDataLoaded: null,
        // Ошибка загрузки.
        onError: null,
        // Успех HTTP-запроса (расширенный контекст sent/received).
        onRequestSuccess: null,
        // Ошибка HTTP-запроса (расширенный контекст sent/error).
        onRequestError: null,
        // Пришел устаревший ответ и был отброшен.
        onStaleResponse: null,
        // Синхронизация urlState: чтение.
        onUrlStateRead: null,
        // Синхронизация urlState: запись.
        onUrlStateWrite: null,
        // Ошибка чтения/записи urlState.
        onUrlStateError: null,
        // Пустой результат после загрузки.
        onEmptyResult: null,
        // Завершение рендера после ответа сервера.
        onAfterRender: null,
        // Синхронизация финального состояния таблицы.
        onStateSync: null,
        // Изменение сортировки.
        onSortChange: null,
        // Изменение страницы.
        onPageChange: null,
        // Изменение per-page.
        onPerPageChange: null,
        // Изменение поискового запроса.
        onSearch: null,
        // Изменение фильтров.
        onFiltersChange: null,
        // Сброс фильтров/поиска.
        onReset: null,
        // Изменение чекбокса строки в editable-режиме.
        onRowCheck: null,
        // Изменение чекбокса "выбрать все" в editable-режиме.
        onCheckAll: null,
        // Ручная перестановка строк в editable-режиме.
        onRowReorder: null,
        // Запуск экспорта.
        onExport: null,
        // Операции сохраненных видов.
        onViewChange: null,
        // Раскрытие строки в tree-data.
        onRowExpand: null,
        // Коллапс строки в tree-data.
        onRowCollapse: null,
        // Переключение состояния строки в tree-data.
        onRowToggle: null,
        // Перестановка колонок.
        onColumnReorder: null,
        // Изменение ширины колонки.
        onColumnResize: null,
        onColumnFixed: null,
    },

    events: {
        // Включить dispatch CustomEvent-событий.
        // data-атрибуты: data-events-enabled
        enable: true,
        // Префикс событий (например, vgdt:dataloaded).
        // data-атрибуты: data-events-prefix
        prefix: 'vgdt',
        // Распространять события вверх по DOM (bubbles).
        // data-атрибуты: data-events-bubbles
        bubbles: true,
    },

    persistence: {
        // Глобальный toggle persistence.
        // data-атрибуты: data-persistence-enabled
        enable: false,
        // Общий ключ storage для persistence.
        // data-атрибуты: data-persistence-storage-key
        storageKey: '',
        // Сохранять тему.
        // data-атрибуты: data-persistence-theme
        theme: false,
        // Сохранять локаль.
        // data-атрибуты: data-persistence-locale
        locale: false,
        // Сохранять режим применения фильтров.
        // data-атрибуты: data-persistence-filters-apply-mode
        filtersApply: false,
    },
};

export default DEFAULT_OPTIONS;


