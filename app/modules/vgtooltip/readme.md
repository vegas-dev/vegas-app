# VGTooltip — модуль подсказок и popover

`VGTooltip` — модуль всплывающих подсказок для Vegas App. Поддерживает tooltip и popover режимы, Data API и JS API, автопозиционирование, анимации и управление через события.

---

## ✅ Возможности

- 📦 **Легковесный и автономный** — работает как модуль без внешнего UI-фреймворка.
- 🎯 **Два режима работы** — обычный tooltip и `popover` с заголовком и контентом.
- 🧭 **Умное позиционирование** — поддерживает `top`, `bottom`, `left`, `right` и авто-переворот.
- 🖱 **Гибкие триггеры** — `hover`, `click` или их комбинация.
- 🔁 **Автозакрытие других подсказок** — при `closeOther: true`.
- ⌨ **Поддержка `Esc`** и закрытия по клику вне элемента.
- 🎬 **Анимации показа и скрытия** через общий animation API.
- 📱 **Адаптивное поведение** — перерасчёт позиции при `resize` и `scroll`.

---

## 📦 Установка

Модуль подключается как часть системы модулей. Для работы должны быть доступны:
- `BaseModule`
- `EventHandler`
- `Selectors`
- `Placement`

---

## 🧰 Быстрое использование

### Через JavaScript
```js
const button = document.querySelector('#tooltip-demo');

const tooltip = new VGTooltip(button, {
    title: 'Подсказка',
    placement: 'right'
});

tooltip.show();
```

### Через Data API
```html
<button
    data-vg-toggle="tooltip"
    data-vg-title="Текст подсказки">
    Наведи на меня
</button>
```

### Popover
```html
<button
    data-vg-toggle="popover"
    data-vg-title="Заголовок"
    data-vg-content="Подробный текст">
    Открыть popover
</button>
```

---

## ⚙️ Параметры

| Параметр | Тип | По умолчанию | Описание |
|--------|------|-------------|--------|
| `title` | `string` | `''` | Заголовок tooltip/popover |
| `content` | `string` | `''` | Контент для режима `popover` |
| `trigger` | `string` | `'hover'` | Триггер показа: `hover`, `click` или комбинация |
| `placement` | `string` | `'top'` | Позиция: `top`, `bottom`, `left`, `right` и варианты |
| `container` | `string` | `'body'` | Контейнер, в который рендерится tooltip |
| `popover` | `boolean` | `false` | Режим popover |
| `html` | `boolean` | `false` | Разрешить HTML в `title` и `content` |
| `offset` | `array` | `[8, 8]` | Смещение относительно элемента |
| `autoFlip` | `boolean` | `true` | Автоматически менять сторону при нехватке места |
| `overflowProtection` | `boolean` | `true` | Защита от выхода за границы окна |
| `fallbackPlacements` | `array` | `['bottom', 'right', 'left']` | Порядок запасных позиций |
| `closeOnOutsideClick` | `boolean` | `true` | Закрывать по клику вне tooltip |
| `keyboard` | `boolean` | `true` | Закрывать по `Esc` |
| `closeOther` | `boolean` | `true` | Скрывать другие открытые tooltip |
| `delay.show` | `number` | `100` | Задержка перед показом, мс |
| `delay.hide` | `number` | `100` | Задержка перед скрытием, мс |
| `arrow.padding` | `number` | `8` | Отступ стрелки от краёв |
| `custom.class` | `string` | `''` | Дополнительный CSS-класс |
| `animation.enable` | `boolean` | `true` | Включить анимации |
| `animation.in` | `string` | `'animate__backInUp'` | Анимация появления |
| `animation.out` | `string` | `'animate__backOutDown'` | Анимация скрытия |
| `animation.delay` | `number` | `300` | Длительность анимации, мс |
| `animation.effect` | `string` | `'none'` | Дополнительный CSS-эффект |

---

## 💡 Расширенные примеры

### 1. Tooltip по клику
```js
new VGTooltip(document.querySelector('#help'), {
    title: 'Подсказка по клику',
    trigger: 'click',
    placement: 'bottom'
});
```

### 2. HTML-контент
```js
new VGTooltip(document.querySelector('#html-tooltip'), {
    title: '<strong>Важно</strong>',
    content: 'Можно передавать <em>HTML</em>',
    html: true,
    popover: true,
    trigger: 'click'
});
```

### 3. Кастомный контейнер и класс
```js
new VGTooltip(document.querySelector('#custom-tooltip'), {
    title: 'Подсказка внутри контейнера',
    container: '.demo-area',
    custom: {
        class: 'tooltip-accent'
    }
});
```

---

## 🧩 Data API

- `data-vg-toggle="tooltip"` — обычная подсказка.
- `data-vg-toggle="popover"` — popover-режим.
- `data-vg-title` — текст заголовка.
- `data-vg-content` — текст контента.
- Если у элемента есть `title`, модуль переносит его в `data-vg-original-title` и использует как источник текста.

---

## 🧪 События

| Событие | Описание |
|-------|--------|
| `vg.tooltip.show` | Перед показом |
| `vg.tooltip.shown` | После показа |
| `vg.tooltip.hide` | Перед скрытием |
| `vg.tooltip.hidden` | После скрытия |

---

## 🔄 Методы

| Метод | Описание |
|------|--------|
| `VGTooltip.getInstance(element)` | Получить существующий экземпляр |
| `VGTooltip.getOrCreateInstance(element, params)` | Получить или создать экземпляр |
| `tooltip.show(relatedTarget)` | Показать tooltip |
| `tooltip.hide()` | Скрыть tooltip |
| `tooltip.toggle(relatedTarget)` | Переключить состояние |
| `tooltip.dispose()` | Удалить tooltip и очистить обработчики |

---

## 🌐 Глобальные классы

- `.vg-tooltip-open` — добавляется к `<body>`, пока открыт хотя бы один tooltip.
- `.vg-tooltip.show` — tooltip находится в DOM и видим.
- `.vg-tooltip.shown` — tooltip завершил фазу показа.
- `.vg-tooltip-popover` — оформление для режима popover.

---

## 📝 Лицензия

MIT. Свободно использовать и модифицировать.

---

📌 *Разработано в рамках фронтенд-системы VG Modules.*
> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS
