# VGNestable

`VGNestable` - модуль для вложенной сортировки списка (drag-and-drop + клавиатура) с ограничением глубины, сворачиванием веток и опциональным сохранением структуры на сервер.

## Возможности

- Сортировка элементов внутри списка мышью, touch и Pointer Events.
- Перенос элементов между несколькими списками (по `group` + `connect`).
- Ограничение максимальной глубины вложенности (`maxdepth`).
- Управление разрешением дропа через функцию `accept`.
- Поддержка клавиатуры и live-region для доступности (ARIA).
- Автоматическое создание внутренней структуры (`.vg-nestable-inner`, drag-handle, кнопка collapse).
- Сериализация структуры в дерево (`serialize()`).
- Автосохранение после изменения через `ajax.route` или ручной вызов `save()`.
- События жизненного цикла через DOM events и `callbacks`.

## Подключение

```js
import VGNestable from "./app/modules/vgnestable";
```

Инициализация через JS:

```js
const nestable = VGNestable.getOrCreateInstance("#myNestable", {
  maxdepth: 4
});
```

Или через data-api (автоинициализация на `DOMContentLoaded`):

```html
<div data-vg-toggle="nestable" class="vg-nestable">
  <ol class="vg-nestable-list">
    <li class="vg-nestable-item" data-id="1">...</li>
    <li class="vg-nestable-item" data-id="2">...</li>
  </ol>
</div>
```

## Рекомендуемая разметка

```html
<div id="myNestable" class="vg-nestable">
  <ol class="vg-nestable-list">
    <li class="vg-nestable-item" data-id="1">
      <div class="vg-nestable-inner">
        <div class="vg-nestable-handle"></div>
        <div class="vg-nestable-content">Item 1</div>
      </div>
      <ol class="vg-nestable-list">
        <li class="vg-nestable-item" data-id="11">
          <div class="vg-nestable-inner">
            <div class="vg-nestable-handle"></div>
            <div class="vg-nestable-content">Item 1.1</div>
          </div>
        </li>
      </ol>
    </li>
  </ol>
</div>
```

Примечание: если `inner`/`handle` отсутствуют, модуль может достроить их автоматически при `refresh()`.

## Все настройки

Значения по умолчанию:

```js
{
  listselector: ".vg-nestable-list",
  itemselector: ".vg-nestable-item",
  handleselector: ".vg-nestable-handle",
  idattribute: "data-id",
  childlistclass: "vg-nestable-list",
  handleicon: "",
  indent: 28,
  maxdepth: 6,
  hoverthreshold: 0.18,
  neighborchangethreshold: 0,
  showplaceholder: true,
  group: "",
  connect: false,
  accept: null,
  collapse: {
    enabled: true,
    open: true,
    showtext: getSVG("chevron"),
    hidetext: getSVG("chevron")
  },
  callbacks: {
    init: null,
    refresh: null,
    pointerdown: null,
    start: null,
    move: null,
    placeholdermove: null,
    drop: null,
    transfer: null,
    change: null,
    end: null,
    save: null,
    destroy: null
  },
  ajax: {
    route: "",
    method: "post",
    field: "items",
    data: {},
    loader: false,
    once: false,
    output: false,
    timeout: 0
  }
}
```

### Пояснение параметров

- `listselector`: селектор корневого/вложенных списков.
- `itemselector`: селектор sortable-элемента.
- `handleselector`: селектор зоны, за которую можно начинать drag.
- `idattribute`: атрибут, из которого берется `id` в `serialize()`.
- `childlistclass`: классы для автосозданного дочернего списка.
- `handleicon`: HTML/SVG иконки хэндла (проходит SVG-санитизацию).
- `indent`: смещение по X (px), после которого режим дропа переключается в вложение (`child`).
- `maxdepth`: максимальная глубина дерева.
- `hoverthreshold`: вертикальный порог (0.05..0.45 фактически), определяет зоны `before/after/keep`.
- `neighborchangethreshold`: порог в процентах (0..49), альтернативная логика смены позиции по краям элемента.
- `showplaceholder`: показывать/скрывать placeholder во время drag.
- `group`: имя группы списков для межспискового dnd.
- `connect`: включить связь списков внутри группы.
- `accept(item, sourceInstance, targetInstance)`: функция-фильтр разрешения дропа в target.

#### `collapse`

- `enabled`: добавить collapse-toggle у элементов с дочерним списком.
- `open`: начальное состояние дочерних списков (`show`/скрыт).
- `showtext`: контент кнопки в закрытом состоянии.
- `hidetext`: контент кнопки в открытом состоянии.

#### `callbacks`

Ключи совпадают с именами событий. Если передана функция, модуль вызывает ее в `_emit(action, payload)`.

#### `ajax`

- `route`: URL сохранения (если пустой, `save()` вернет payload без запроса).
- `method`: `post | get | delete`.
- `field`: имя поля для payload при `post` (по умолчанию `items`).
- `data`: дополнительные данные для `post`.
- `timeout`: задержка перед отправкой (мс).
- `loader`, `once`, `output`: есть в конфиге, но в текущей реализации `save()` не используются.

## Публичное API

- `VGNestable.getOrCreateInstance(element, params?)`
- `VGNestable.getInstance(element)`
- `instance.refresh()` - пересобирает layout элементов, handle, collapse.
- `instance.serialize()` - возвращает дерево вида:

```js
[
  { id: 1, children: [{ id: 11 }] },
  { id: 2 }
]
```

- `instance.save()` - отправляет сериализованные данные на сервер (если указан `ajax.route`), возвращает `Promise`.
- `instance.dispose()` - снимает listeners, удаляет служебные узлы, unregister из группы.

## События

DOM-события триггерятся на корневом элементе модуля:

- `vg.nestable.init`
- `vg.nestable.refresh`
- `vg.nestable.pointerdown`
- `vg.nestable.start`
- `vg.nestable.move`
- `vg.nestable.placeholdermove`
- `vg.nestable.drop`
- `vg.nestable.transfer`
- `vg.nestable.change`
- `vg.nestable.end`
- `vg.nestable.save`
- `vg.nestable.destroy`

Подписка:

```js
const el = document.querySelector("#myNestable");
el.addEventListener("vg.nestable.change", (event) => {
  console.log(event.detail.payload);
});
```

Полезные поля `event.detail` (зависят от события):

- `action`
- `instance`
- `item`
- `payload`
- `previousPayload`
- `changed`
- `targetInstance`
- `sourcePayload` / `targetPayload` (для transfer)
- `status`, `response`, `error` (для save)
- `keyboard`, `cancelled`

## Клавиатурное управление

Фокус на handle (или `handleselector`), затем:

- `Enter`/`Space`: поднять элемент или завершить drop.
- `ArrowUp` / `ArrowDown`: перемещение вверх/вниз в текущем списке.
- `ArrowRight`: сделать вложенным в предыдущий элемент.
- `ArrowLeft`: уменьшить уровень вложенности.
- `Escape`: отмена текущей keyboard-сессии.

## Межсписковый перенос

Чтобы переносить элементы между списками:

1. У обоих инстансов должен быть одинаковый `group`.
2. У обоих `connect: true`.
3. (Опционально) `accept` у target должен вернуть `true`.

При переносе:

- исходный инстанс и целевой получают `transfer`;
- исходный получает `change`;
- целевой получает `change` с новым payload;
- если настроен `ajax.route`, `save()` вызывается для каждого изменившегося инстанса.

## Автосохранение и ручное сохранение

Автосохранение происходит после `change`, если указан `ajax.route`.
Ручной вызов:

```js
nestable.save()
  .then((response) => console.log("Saved", response))
  .catch((error) => console.error("Save error", error));
```

При `method: "post"` уходит:

```js
{
  ...ajax.data,
  [ajax.field]: nestable.serialize()
}
```

## Стили и CSS-переменные

Основные классы:

- `.vg-nestable-list`
- `.vg-nestable-item`
- `.vg-nestable-inner`
- `.vg-nestable-handle`
- `.vg-nestable-handle-icon`
- `.vg-nestable-collapse-toggle`
- `.vg-nestable-placeholder`
- `.vg-nestable-drag-element`
- `.is-drop-target`
- `.is-drop-denied`
- `.is-dragging`
- `.is-drag-ghost`

SCSS-переменные заданы в `scss/_variables.scss` через map `nestable` (`--vg-nestable-*`), включая:

- размеры handle/toggle;
- цвета и границы placeholder/drop-state;
- отступы вложенных списков;
- стиль ghost-элемента при drag.

## Короткий пример полной инициализации

```js
VGNestable.getOrCreateInstance("#myNestable", {
  maxdepth: 5,
  indent: 24,
  connect: true,
  group: "menu-builder",
  accept: (item, from, to) => from !== to || item.dataset.locked !== "true",
  collapse: {
    enabled: true,
    open: false
  },
  ajax: {
    route: "/admin/menu/reorder",
    method: "post",
    field: "items",
    data: { menu_id: 15 },
    timeout: 100
  },
  callbacks: {
    change: ({ payload }) => console.log("Tree changed:", payload),
    save: ({ status, response, error }) => console.log("Save:", status, response || error)
  }
});
```
