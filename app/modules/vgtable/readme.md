# VGTable

`VGTable` — базовый модуль таблиц VGApp. Компонент работает с обычной HTML-таблицей, не заменяет её собственной моделью данных и добавляет интерактивность только для включённых возможностей.

## Возможности

- локальная и серверная сортировка, включая мультисортировку;
- локальная и Remote-пагинация;
- поиск, фильтры и синхронизация состояния с URL;
- состояния `empty`, `filtered-empty`, `error`, повтор запроса и сброс фильтров;
- фиксированный заголовок при прокрутке контейнера или страницы;
- фиксированные и последовательно складывающиеся колонки;
- изменение ширины, перестановка, скрытие и отображение колонок;
- самостоятельная перестановка строк;
- выбор строк и многоуровневые раскрываемые строки;
- Remote-режим с JSON-данными или готовой серверной разметкой строк;
- skeleton загрузки без схлопывания таблицы;
- встроенные локали `ru` и `en`, пользовательские словари;
- сохранение пользовательских настроек в `localStorage`;
- управление через Data API, JavaScript API и DOM-события.

## Подключение

Модуль экспортируется из основной точки входа пакета:

```js
import {VGTable} from 'vgapp';
```

Стили подключаются общей SCSS-точкой входа VGApp.

## Разметка

Рекомендуется явно использовать два контейнера:

```html
<div class="vg-table-wrapper">
    <div class="vg-table-container">
        <table class="vg-table" data-vg-table>
            <thead>
                <tr>
                    <th data-field="id" data-sort-type="number">ID</th>
                    <th data-field="name">Название</th>
                    <th data-field="status">Статус</th>
                </tr>
            </thead>
            <tbody>
                <tr data-row-key="1">
                    <td>1</td>
                    <td>Первая запись</td>
                    <td>Активна</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

Назначение элементов:

- `.vg-table-wrapper` — внешний контейнер таблицы и панелей управления;
- `.vg-table-container` — внутренняя область прокрутки непосредственно таблицы;
- `.vg-table` — сама таблица;
- `data-vg-table` — маркер автоматической инициализации;
- `data-field` — стабильный идентификатор колонки для сортировки, Remote-данных и управления колонками;
- `data-row-key` — стабильный идентификатор строки для перестановки и связанных сценариев.

Если wrapper или container отсутствуют, компонент создаст недостающую обёртку самостоятельно и корректно удалит её при `dispose()`. Явная разметка предпочтительна: она заранее разделяет прокрутку таблицы и внешнюю пагинацию.

## Инициализация

### Автоматическая

Все элементы с `data-vg-table` инициализируются после `DOMContentLoaded`:

```html
<table class="vg-table" data-vg-table>
    <!-- ... -->
</table>
```

### Через JavaScript

```js
const element = document.querySelector('#orders-table');
const table = VGTable.getOrCreateInstance(element, {
    pagination: {
        enabled: true,
        per: 10,
        size: {
            enabled: true,
            options: [10, 25, 50, 100],
        },
    },
});

table.init();
```

Повторный вызов `getOrCreateInstance()` возвращает существующий экземпляр.

## Data API

Основные возможности можно включить атрибутами таблицы:

```html
<table
    id="orders-table"
    class="vg-table"
    data-vg-table
    data-locale="ru"
    data-pagination-enabled="true"
    data-pagination-per-page="10"
    data-pagination-show-per-page="true"
    data-pagination-per-page-options="10,25,50,100"
    data-sort-multiple="true"
    data-sticky-header-enabled="true"
    data-sticky-header-mode="container"
    data-sticky-header-max-height="32rem"
>
    <!-- ... -->
</table>
```

Имена атрибутов обычно повторяют группы JavaScript-настроек: например, `stickyHeader.maxHeight` соответствует `data-sticky-header-max-height`. Для совместимости с VGDynamicTable некоторые параметры также имеют короткие aliases, например `data-pagination-show-per-page`.

Полный актуальный список параметров, допустимых значений и соответствующих data-атрибутов находится в `js/_options.js`.

## Настройки

Ниже приведена структура основных параметров. Неуказанные значения дополняются настройками по умолчанию.

```js
const table = new VGTable(element, {
    locale: 'ru',
    i18n: {},

    sort: {
        enabled: true,
        hover: true,
        multiple: false,
        multipleWithShift: true,
    },

    pan: {
        enabled: true,
    },

    pagination: {
        enabled: false,
        page: 1,
        per: 10,
        max: 100,
        position: 'bottom', // top | bottom | both
        align: 'right',     // left | center | right | between
        ellipsis: true,
        ellipsisHover: true,
        threshold: 5,
        visible: 5,
        size: {
            enabled: false,
            options: [10, 25, 50, 100],
            label: 'Строк на странице',
            suffix: 'на страницу',
        },
        quick: {
            enabled: false, // true | false | auto
            label: 'Перейти к странице',
            button: 'Перейти',
        },
        persist: {
            page: true,
            per: true,
        },
        storage: {
            key: '',
        },
        scroll: false, // false | table | window
    },

    stickyHeader: {
        enabled: false,
        mode: 'container', // container | page
        top: null,
        maxHeight: '24rem',
    },

    fixedColumns: {
        enabled: false,
        columns: '',
        mode: 'fixed', // fixed | stack
        stackGap: 0,
    },

    columnResize: {
        enabled: false,
        minWidth: 80,
        maxWidth: 600,
        persist: false,
        storageKey: '',
    },

    columnReorder: {
        enabled: false,
        persist: false,
        storageKey: '',
    },

    columnVisibility: {
        enabled: false,
        controls: '',
        minVisible: 1,
        persist: false,
        storageKey: '',
    },

    rowReorder: {
        enabled: false,
        mode: 'handle', // handle | row
        handleSelector: '[data-row-reorder-handle]',
        keyAttr: 'data-row-key',
        persist: false,
        storageKey: '',
    },

    selection: {
        enabled: false,
        click: true,
        multiple: false,
    },

    expandable: {
        enabled: false,
        idAttr: 'data-expand-id',
        parentAttr: 'data-expand-parent-id',
        toggleSelector: '[data-expand-toggle]',
        collapsed: true,
    },

    search: {
        enabled: false,
        input: '',
        param: 'q',
        debounce: 300,
        resetPage: true,
        trim: true,
        fields: [],
    },

    filters: {
        enabled: false,
        form: '',
        debounce: 300,
        apply: 'auto', // auto | manual
        resetPage: true,
        skipEmpty: true,
        trim: true,
        defaultOperator: 'eq',
    },

    state: {
        enabled: true,
    },

    urlState: {
        enabled: false,
        read: true,
        write: true,
        listen: true,
        mode: 'replace', // replace | push
        prefix: '',
    },

    loading: {
        enabled: true,
        minDelay: 500,
        skeleton: 5,
    },

    request: {
        route: '',
        method: 'GET',
        credentials: 'same-origin',
        headers: {'Accept': 'application/json'},
        params: {},
        parammap: {},
        responsemode: 'data', // data | view | auto
        datapath: 'data',
        metapath: 'meta',
        viewpath: 'view.tbody',
        viewparam: 'view',
        viewvalue: 'rows',
        fieldsparam: 'fields',
        cache: {
            enable: true,
            ttl: 30000,
            max: 30,
        },
        export: {
            route: '',
        },
    },
});
```

## Сортировка

По умолчанию сортировка включена для обычных таблиц. Поле определяется по `data-field`, тип — автоматически или через `data-sort-type`.

```html
<th data-field="created_at" data-sort-type="date">Создано</th>
<th data-field="total" data-sort-type="number">Сумма</th>
<th data-field="actions" data-sort-enabled="false">Действия</th>
```

Для значения, отличного от отображаемого текста, используется `data-sort-value`:

```html
<td data-sort-value="2026-08-22">22 августа 2026</td>
```

При `sort.multiple: true` следующая колонка добавляется с `Shift`. Если `multipleWithShift` равен `false`, мультисортировка действует постоянно.

Таблица с `colspan` или `rowspan` считается сложной. Для неё сортировка и операции, меняющие структуру колонок, отключаются автоматически, чтобы не нарушить сетку.

## Пагинация

Панель пагинации создаётся вне `.vg-table-container`, поэтому не попадает в горизонтальную прокрутку таблицы.

```html
<table
    class="vg-table"
    data-vg-table
    data-pagination-enabled="true"
    data-pagination-per-page="10"
    data-pagination-position="bottom"
    data-pagination-align="right"
    data-pagination-show-per-page="true"
    data-pagination-per-page-options="10,25,50,100"
></table>
```

Выбор количества строк использует `VGDropdown`, но поле также принимает произвольное число от `1` до `pagination.max`. Текущая страница и размер страницы могут сохраняться в `localStorage`.

## Поиск, фильтры и состояния

### Поиск

```html
<input id="orders-search" class="form-control" type="search">
<button type="button" data-search-reset>Очистить</button>

<table
    class="vg-table"
    data-vg-table
    data-search-enable="true"
    data-search-input="#orders-search"
    data-search-fields="name,status"
></table>
```

В локальном режиме поиск фильтрует существующие строки, в Remote-режиме передаёт значение на сервер параметром `q` или именем из `search.param`.

### Фильтры

```html
<form id="orders-filters">
    <select data-filter-field="status">
        <option value="">Все статусы</option>
        <option value="active">Активные</option>
    </select>

    <input
        type="number"
        data-filter-field="total"
        data-filter-operator="gte"
        placeholder="Сумма от"
    >

    <button type="button" data-filter-reset>Сбросить фильтры</button>
</form>

<table
    class="vg-table"
    data-vg-table
    data-filters-enable="true"
    data-filters-form="#orders-filters"
    data-filters-apply="auto"
></table>
```

Доступные операторы: `eq`, `neq`, `contains`, `starts`, `ends`, `gt`, `gte`, `lt`, `lte`, `in`, `notin`.

Кнопка сброса очищает фильтры и глобальный поиск. При отсутствии результата компонент различает обычное пустое состояние и `filtered-empty`.

### Состояния

Встроенный state-layer поддерживает:

- `empty` — исходных строк нет;
- `filtered-empty` — строки не найдены после поиска или фильтрации;
- `error` — Remote-запрос завершился ошибкой;
- повтор запроса из состояния ошибки;
- сброс поиска и фильтров из `filtered-empty`.

Тексты задаются через `state.labels` или соответствующие `data-state-*-label`.

## Состояние в URL

Общий URL state синхронизирует `page`, `perPage`, `sort`, `dir`, `search` и фильтры:

```html
<table
    class="vg-table"
    data-vg-table
    data-url-state-enable="true"
    data-url-state-mode="replace"
    data-url-state-prefix="orders-"
></table>
```

Для нескольких таблиц на одной странице обязательно задавайте разные `urlState.prefix`. Компонент умеет читать исходный query string, записывать изменения и обрабатывать переходы Back/Forward.

## Фиксированный заголовок

VGTable использует нативный `position: sticky` и отдельный header-слой без клонирования строк и обработчиков.

### Прокрутка внутри таблицы

```html
<table
    class="vg-table"
    data-vg-table
    data-sticky-header-enabled="true"
    data-sticky-header-mode="container"
    data-sticky-header-max-height="28rem"
></table>
```

### Прокрутка страницы

```html
<table
    class="vg-table"
    data-vg-table
    data-sticky-header-enabled="true"
    data-sticky-header-mode="page"
    data-sticky-header-top="72"
></table>
```

`stickyHeader.top` принимает число пикселей или CSS-значение. Если параметр равен `null`, отступом можно управлять публичной переменной `--vg-table-sticky-top`, например с учётом фиксированного header сайта.

## Фиксированные колонки

Колонки задаются по `data-field` или zero-based индексу:

```html
<table
    class="vg-table"
    data-vg-table
    data-fixed-columns-enabled="true"
    data-fixed-columns="left:id,name;right:actions"
    data-fixed-columns-mode="fixed"
></table>
```

Поддерживаются режимы:

- `fixed` — колонки постоянно закреплены у соответствующего края;
- `stack` — колонки последовательно фиксируются при прокрутке.

Отдельную колонку также можно пометить непосредственно в заголовке. Фиксированные ячейки получают непрозрачный фон и повышенный `z-index`, чтобы соседние колонки не просвечивали при прокрутке.

## Управление колонками

Для изменения ширины, перестановки и видимости каждой колонке нужен стабильный `data-field`.

```html
<div id="column-controls">
    <label><input type="checkbox" data-vg-table-column="email" checked> Почта</label>
    <label><input type="checkbox" data-vg-table-column="city" checked> Город</label>
</div>

<table
    class="vg-table"
    data-vg-table
    data-column-resize-enable="true"
    data-column-reorder-enable="true"
    data-column-visibility-enable="true"
    data-column-visibility-controls="#column-controls"
></table>
```

Все три режима могут независимо сохранять состояние в `localStorage`. Фиксированные колонки разрешено изменять по ширине, но нельзя скрывать или переносить через границу фиксированной области.

## Перестановка строк

```html
<table
    class="vg-table"
    data-vg-table
    data-row-reorder-enable="true"
    data-row-reorder-mode="handle"
>
    <tbody>
        <tr data-row-key="order-1">
            <td><button type="button" data-row-reorder-handle>Переместить</button></td>
            <td>Заказ №1</td>
        </tr>
    </tbody>
</table>
```

Режим `handle` начинает перенос только с указанного элемента, `row` — с любой неинтерактивной области строки. При включённой перестановке строк сортировка не инициализируется: ручной порядок и сортировка являются взаимоисключающими режимами.

## Выбор строк

```js
const table = VGTable.getOrCreateInstance(element, {
    selection: {
        enabled: true,
        click: true,
        multiple: true,
    },
});
```

Клики по ссылкам, кнопкам и полям формы внутри строки не изменяют выбор. Текущее состояние доступно через `getSelectedRows()`.

## Раскрываемые строки

Связи дерева задаются ID строки и ID родителя. Уровень вложенности не ограничен разметкой одного уровня.

```html
<table
    class="vg-table"
    data-vg-table
    data-expandable-enabled="true"
    data-expandable-collapsed="true"
>
    <tbody>
        <tr data-expand-id="root">
            <td><button type="button" data-expand-toggle></button> Родитель</td>
        </tr>
        <tr data-expand-id="child" data-expand-parent-id="root">
            <td>Дочерняя строка</td>
        </tr>
        <tr data-expand-id="leaf" data-expand-parent-id="child">
            <td>Третий уровень</td>
        </tr>
    </tbody>
</table>
```

Если кнопка управления не добавлена вручную, компонент создаёт её для родительской строки автоматически.

## Remote-режим

Непустой `request.route` автоматически переводит таблицу в Remote-режим. Запросы выполняются через общий Ajax-компонент VGApp.

```html
<table
    id="remote-orders"
    class="vg-table"
    data-vg-table
    data-request-route="/api/orders"
    data-request-method="GET"
    data-request-responsemode="data"
    data-request-datapath="data"
    data-request-metapath="meta"
    data-request-cache-enable="true"
    data-pagination-enabled="true"
    data-pagination-show-per-page="true"
></table>
```

Компонент передаёт серверу:

- `page` — текущую страницу;
- `per_page` — количество строк;
- `sort` — поле или список полей через запятую;
- `dir` — направление или список направлений через запятую;
- параметр поиска, по умолчанию `q`;
- параметры активных фильтров;
- дополнительные значения из `request.params`.

Имена можно переопределить через `request.parammap`:

```js
request: {
    route: '/api/orders',
    parammap: {
        q: 'search',
        per_page: 'limit',
    },
}
```

### Ответ с данными

```json
{
    "data": [
        {
            "id": 1,
            "name": "Заказ №1",
            "status": "active"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 10,
        "total": 100,
        "last_page": 10
    }
}
```

Ключи объектов сопоставляются с заголовками `th[data-field]`. Путь к массиву и meta можно изменить через `datapath` и `metapath`.

### Ответ с готовой разметкой

Для `responsemode: 'view'` сервер возвращает HTML строк:

```json
{
    "view": {
        "tbody": "<tr data-row-key=\"1\"><td>1</td><td>Заказ №1</td></tr>"
    },
    "meta": {
        "page": 1,
        "per_page": 10,
        "total": 100,
        "pages": 10
    }
}
```

В режиме `auto` компонент сначала ищет server-rendered view, затем массив данных. Для view-запроса автоматически передаются имя представления и список полей, если настроены `viewparam`, `viewvalue` и `fieldsparam`.

Повторяющиеся запросы кратковременно кешируются в памяти экземпляра. Для выгрузки текущего серверного состояния используется отдельный `request.export.route` или основной route.

## Группы параметров

Повторяющуюся конфигурацию можно зарегистрировать один раз и подключать одним атрибутом:

```js
VGTable.registerParamsGroup('remote-registry', {
    pagination: {
        enabled: true,
        size: {enabled: true},
    },
    loading: {
        enabled: true,
        skeleton: 10,
    },
    urlState: {
        enabled: true,
    },
});
```

```html
<table
    class="vg-table"
    data-vg-table
    data-group-params="remote-registry"
    data-request-route="/api/orders"
></table>
```

Параметры конкретного экземпляра и его Data API дополняют или переопределяют зарегистрированную группу.

Доступные методы:

```js
VGTable.registerParamsGroup(name, params);
VGTable.getParamsGroup(name);
VGTable.unregisterParamsGroup(name);
```

## Интернационализация

Встроены локали `ru` и `en`. Региональный код, например `ru-RU`, использует точное совпадение, а затем базовую локаль `ru`.

```js
const table = VGTable.getOrCreateInstance(element, {
    locale: 'en',
    i18n: {
        en: {
            pagination: {
                size: {
                    label: 'Rows per page',
                },
            },
        },
    },
});

table.init();
table.setLocale('ru');
```

Пользовательский словарь объединяется со встроенным, поэтому достаточно указать только изменяемые строки.

## Публичные методы

### Экземпляр и жизненный цикл

```js
VGTable.getInstance(element);
VGTable.getOrCreateInstance(element, params);

table.init();
table.dispose();
table.isRemote();
table.isComplex();
```

### Локаль

```js
table.getLocale();
table.setLocale(locale);
```

### Сортировка

```js
table.setSort(field, direction);
table.setSorts(sorts);
table.getSort();
table.getSorts();
table.clearSort();
```

### Пагинация

```js
table.setPage(page);
table.setPerPage(perPage);
table.getPagination();
table.refreshPagination();
```

### Поиск, фильтры и URL

```js
table.getSearch();
table.setSearch(value);
table.resetSearch();
table.refreshSearch();

table.getFilters();
table.setFilters(filters);
table.resetFilters();
table.refreshFilters();

table.getUrlState();
table.refreshUrlState();
```

### Состояния и Remote

```js
table.getTableState();
table.showTableState(state, message);
table.clearTableState();

table.reload();
table.setRequestParams(params);
table.getRequestState();
table.clearRequestCache();
table.exportRemote(format, options);
```

### Заголовок и колонки

```js
table.refreshStickyHeader();
table.refreshFixedColumns();
table.getFixedColumns();

table.getColumns();
table.setColumnWidth(field, width);
table.moveColumn(field, target);
table.setColumnVisible(field, visible);
table.resetColumns();
table.refreshColumns();
```

### Строки

```js
table.selectRow(row, selected);
table.toggleRow(row);
table.getSelectedRows();
table.clearSelection();

table.toggleExpanded(id);
table.expandRow(id);
table.collapseRow(id);
table.getExpandable();
table.refreshExpandable();

table.getRowOrder();
table.moveRow(row, target, position, emit);
table.resetRows();
table.refreshRowReorder();
```

## События

Все события всплывают от элемента таблицы и доступны через `event.detail`.

| Событие | Назначение |
| --- | --- |
| `sortchange.vg.table` | Изменилось поле, направление или порядок мультисортировки |
| `pagechange.vg.table` | Изменилась текущая страница |
| `perpagechange.vg.table` | Изменилось количество строк на странице |
| `searchchange.vg.table` | Изменился глобальный поиск |
| `filterschange.vg.table` | Изменились активные фильтры |
| `selectionchange.vg.table` | Изменился выбор строк |
| `rowtoggle.vg.table` | Изменилось состояние раскрываемой ветви |
| `rowexpand.vg.table` | Ветвь развёрнута |
| `rowcollapse.vg.table` | Ветвь свёрнута |
| `rowreorder.vg.table` | Изменён порядок строк |
| `columnresize.vg.table` | Изменена ширина колонки |
| `columnreorder.vg.table` | Изменён порядок колонок |
| `columnvisibilitychange.vg.table` | Изменена видимость колонки |
| `beforeload.vg.table` | Remote-запрос подготовлен к отправке |
| `requestsuccess.vg.table` | Получен успешный Remote-ответ |
| `requesterror.vg.table` | Remote-запрос завершился ошибкой |
| `dataloaded.vg.table` | Данные ответа прочитаны |
| `afterrender.vg.table` | Строки ответа отрисованы |
| `statechange.vg.table` | Изменилось состояние результата |
| `urlstateread.vg.table` | Состояние прочитано из URL |
| `urlstatewrite.vg.table` | Состояние записано в URL |
| `urlstateerror.vg.table` | Возникла ошибка разбора URL state |
| `localechange.vg.table` | Изменилась активная локаль |

```js
element.addEventListener('sortchange.vg.table', (event) => {
    console.log(event.detail.sorts);
});

element.addEventListener('requesterror.vg.table', (event) => {
    console.error(event.detail.error);
});
```

## Размеры и оформление

Доступные классы размеров:

```html
<table class="vg-table vg-table-xs"></table>
<table class="vg-table vg-table-sm"></table>
<table class="vg-table"></table>
<table class="vg-table vg-table-lg"></table>
<table class="vg-table vg-table-xl"></table>
```

Средний размер является значением по умолчанию и не требует класса `vg-table-md`.

Дополнительные классы:

- `.vg-table-striped` — чередование фона строк;
- `.vg-table-hovered` — подсветка строки при наведении.

Для темизации доступны группы CSS-переменных:

- `--vg-table-*` — таблица и ячейки;
- `--vg-table-wrapper-*` — внешний wrapper;
- `--vg-table-container-*` — scroll-контейнер;
- `--vg-table-sort-*` — сортировка;
- `--vg-table-columns-*` — управление колонками;
- `--vg-table-row-reorder-*` — перестановка строк;
- `--vg-table-pan-*` — горизонтальное перемещение;
- `--vg-table-selection-*` — выбранные строки;
- `--vg-table-expandable-*` — раскрываемое дерево;
- `--vg-table-pagination-*` — пагинация;
- `--vg-table-sticky-*` — фиксированный заголовок;
- `--vg-table-fixed-*` — фиксированные колонки;
- `--vg-table-state-*` — состояния результата;
- `--vg-table-skeleton-*` — skeleton загрузки.

```css
.orders-table {
    --vg-table-sticky-top: 4.5rem;
    --vg-table-pagination-gap: 0.75rem;
}
```

## Доступность и клавиатура

- сортируемые заголовки поддерживают `Enter` и `Space`;
- resize-handle колонок поддерживает стрелки, `Home` и `End`;
- handle перестановки строк поддерживает стрелки вверх/вниз, `Home` и `End`;
- кнопки раскрываемых ветвей получают `aria-expanded` и локализованную подпись;
- активная страница отмечается `aria-current="page"`;
- шевроны пагинации имеют текстовые `aria-label`;
- состояние таблицы и интерактивные контролы обновляются без удаления исходной семантики `<table>`.

## Важные сочетания режимов

- `colspan` и `rowspan` автоматически помечают таблицу как сложную и отключают сортировку, фиксированные колонки и структурное управление колонками;
- самостоятельная перестановка строк отключает сортировку;
- внешний wrapper отвечает за панели, внутренний container — только за прокрутку таблицы;
- для Remote-таблицы `data-field` должны совпадать с ключами данных или сервер должен возвращать готовый view;
- для сохранения колонок и строк нужны стабильные `data-field` и `data-row-key`;
- после ручного изменения DOM вызывайте соответствующий метод `refresh*()`.

## Удаление экземпляра

```js
const table = VGTable.getInstance(element);
table?.dispose();
```

`dispose()` удаляет созданные компонентом обработчики и служебные элементы, восстанавливает исходную структуру таблицы и удаляет только те wrapper/container, которые VGTable создал самостоятельно.
