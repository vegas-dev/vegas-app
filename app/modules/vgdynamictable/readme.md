# VGDynamicTable — модуль таблиц

`VGDynamicTable` — модуль таблиц для Vegas App. Поддерживает локальные и remote-данные, пагинацию, сортировку, фильтрацию, поиск, sticky header, fixed columns, editable-режим, reorder колонок и строк, виртуализацию и служебные summary/footer-блоки.

> **Важно:** модуль сохранён в исходниках, но не подключён к основной JS/CSS-сборке и корневому экспорту пакета.

---

## ✅ Возможности

- 📦 **Локальные и remote-таблицы** — работает как со статическим `tbody`, так и с серверным `data-request-route`.
- 📄 **Пагинация** — локальная и серверная, с выбором `per page`, сохранением состояния и скроллом к началу.
- ↕ **Сортировка** — одиночная и мультисортировка по колонкам.
- 🔎 **Поиск и фильтры** — поддержка формы фильтров, debounce, url-state и server sync.
- 📌 **Sticky header и fixed columns** — для широких таблиц и ограниченного viewport.
- ✍ **Editable-режим** — чекбоксы строк, bulk state, inline update hooks и row reorder.
- 🧩 **Column reorder / resize** — перестановка и изменение ширины колонок.
- 🚀 **Виртуализация** — для больших наборов строк, совместимая со sticky viewport.
- 📊 **Summary и footer** — агрегаты по странице и служебные подписи.
- 🌐 **i18n и persistence** — локали интерфейса и хранение части состояния в `localStorage`.

---

## 📦 Подключение

Модуль подключается как часть Vegas App и использует:

- `BaseModule`
- `Pagination`
- `Sortable`
- `Expandable`
- `Search`
- `Filters`
- viewport / fixed / summary / state mixins модуля

Автоинициализация работает через Data API:

```html
<table data-vg-table></table>
```

---

## 🧰 Быстрый старт

### Локальная таблица

```html
<table
    class="table table-hover table-striped"
    data-vg-table
    data-pagination-enable="true"
    data-sortable-enable="true"
    data-search-enable="true">
    <thead>
    <tr>
        <th data-field="sku">SKU</th>
        <th data-field="title">Название</th>
        <th data-field="price">Цена</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>SKU-0001</td>
        <td>Product 1</td>
        <td>199.00</td>
    </tr>
    </tbody>
</table>
```

### Remote-таблица

```html
<table
    class="table"
    data-vg-table
    data-request-route="/api/products"
    data-pagination-enable="true"
    data-search-enable="true"
    data-filters-enable="true">
</table>
```

### Через JavaScript

```js
const table = document.querySelector('[data-vg-table]');
const instance = new VGDynamicTable(table, {
    pagination: { enable: true, perPage: 25 },
    sortable: { enable: true },
    stickyHeader: { enable: true, max: 520 }
});

instance.init();
```

---

## ⚙️ Основные опции

### `request`

Настройки remote-режима:

- `route` — endpoint для загрузки данных
- `method` — HTTP-метод запроса
- `credentials` — режим `fetch credentials`
- `headers` — дополнительные заголовки
- `params` — базовые query-параметры
- `parammap` — маппинг внутренних имен параметров в backend-имена
- `responsemode` — `data | view | auto`
- `datapath`, `metapath`, `viewpath` — пути чтения ответа
- `export.route` — отдельный endpoint экспорта

### `pagination`

- `enable`
- `page`
- `perPage`
- `maxPerPage`
- `persistPage`
- `persistPerPage`
- `storageKey`

### `sortable`

- `enable`
- `multi`
- `dir`
- `persist`

### `search`

- `enable`
- `input`
- `param`
- `debounce`

### `filters`

- `enable`
- `form`
- `apply`
- `debounce`
- `transport`
- `urlState`

### `stickyHeader`

- `enable`
- `top`
- `max`
- `clone`

### `fixed`

- `columns`

### `virtual`

- `enable`
- `threshold`
- `rowheight`
- `overscan`

### `columnReorder` / `columnResize`

- `enable`
- `persist`
- ограничения и storage-настройки

### `expandable`

- `enable`
- `idAttr`
- `parentAttr`
- `toggleSelector`

### `editable`

- `enable`
- `selectors`
- `update`
- `bulk`

---

## 🧪 Data API примеры

### Sticky + fixed columns

```html
<table
    data-vg-table
    data-pagination-enable="true"
    data-sticky-header-enable="true"
    data-sticky-header-max="520"
    data-fixed-columns="rating">
</table>
```

### Editable + row reorder + virtualization

```html
<table
    data-vg-table
    data-editable-enable="true"
    data-row-reorder-enable="true"
    data-row-reorder-mode="handle"
    data-virtual-enable="true"
    data-virtual-threshold="150">
</table>
```

---

## 📣 Колбэки и события

Модуль поддерживает callbacks в конфиге и action-события для основных этапов работы:

- `onInit`
- `onBeforeLoad`
- `onDataLoaded`
- `onError`
- `onRequestSuccess`
- `onRequestError`
- `onSortChange`
- `onPageChange`
- `onPerPageChange`
- `onSearch`
- `onFiltersChange`
- `onRowUpdate`
- `onRowDelete`
- `onRowReorder`
- `onColumnReorder`
- `onColumnResize`
- `onColumnFixed`

---

## 💡 Что покрыто модулем

- обычные таблицы со статическим HTML
- большие таблицы с ограниченной высотой и внутренним scroll
- remote-списки с пагинацией, фильтрами и поиском
- admin/editable-сценарии с выбором строк и reorder
- гибридный режим server-rendered view + JSON meta

---

> Автор: VEGAS STUDIO (vegas-dev.com)
> Поддерживается в проектах VEGAS
