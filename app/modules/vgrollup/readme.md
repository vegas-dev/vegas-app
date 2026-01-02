# VGRollup — Модуль сворачивания/разворачивания контента

`VGRollup` — это JavaScript-модуль, позволяющий сворачивать и разворачивать контент на веб-странице. Поддерживает два режима: по высоте (для текста) и по количеству элементов. Автоматически создаёт кнопку управления с возможностью локализации.

---

## 🔧 Возможности

- **Два режима работы**:
    - `text` — обрезка текста по заданной высоте или количеству строк (с поддержкой `line-clamp`).
    - `elements` — отображение только первых N элементов (например, списка новостей).
- **Анимации и эффекты**:
    - Поддержка плавного затухания (`fade`).
    - CSS-переходы (`transition`).
- **Гибкая настройка кнопки**:
    - Включение/отключение кнопки.
    - Кастомизация текста: "Показать", "Свернуть", "ещё X".
    - Автоматическое размещение после контента.
- **Локализация интерфейса**:
    - Поддержка нескольких языков через `lang_buttons`.
    - Тексты кнопок и подсказок подтягиваются в зависимости от языка (`ru`, `en`, и др.).
- **Data API**:
    - Автоинициализация через `data-vg-rollup`.
    - Управление через `data-vg-toggle="rollup"` и `data-vg-target`.
- **Программное управление**:
    - Публичные методы: `.show()`, `.hide()`, `.toggle()`, `.isShow()`.
    - Инициализация через `VGRollup.init()`.

---

## 📦 Установка и инициализация

### Через JavaScript
```js
import VGRollup from './app/modules/vgrollup/js/vgrollup';
VGRollup.init(document.querySelector('.rollup'), { 
    content: 'text', 
    height: 100,
    button: { 
        enabled: true, 
        more: 'Показать', 
        less: 'Свернуть' 
    }, 
    lang: 'ru' 
});
```

### Через data-атрибуты
```hmtl
<ul class="rollup-list"
    data-vgrollup
    data-content="elements"
    data-elements="item"
    data-cnt="3"
    data-fade="false"
    data-number="true"
    data-more=" more "
    data-button-more="Show"
    data-button-less="Hide"
    id="rollup-list-num">
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
        <li class="item">Lorem ipsum dolor sit amet.</li>
</ul>
```
---

## ⚙️ Параметры конфигурации

| Параметр | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `content` | `string` | `'text'` | Режим: `'text'` или `'elements'`. |
| `cnt` | `number` | `0` | Количество видимых элементов (в режиме `elements`). |
| `fade` | `boolean` | `true` | Добавлять эффект затухания к нижней части. |
| `transition` | `boolean` | `false` | Включить CSS-анимацию при переключении. |
| `number` | `boolean` | `false` | Показывать количество скрытых элементов (например, "ещё 5"). |
| `height` | `number` | `0` | Высота контейнера в px, до которой обрезать текст. |
| `ellipsis.line` | `number\|null` | `null` | Количество строк перед обрезкой (использует `line-clamp`). |
| `more` | `string` | `' еще '` | Текст для отображения количества скрытых элементов. |
| `button.enabled` | `boolean` | `true` | Отображать кнопку управления. |
| `button.more` | `string` | `'Показать'` | Текст кнопки для раскрытия. |
| `button.less` | `string` | `'Свернуть'` | Текст кнопки для сворачивания. |
| `lang` | `string` | `'ru'` | Язык интерфейса. Подтягивает локализацию из `lang_buttons`. |

---

## 🧩 Режимы работы

### 1. Режим `text` (по высоте)

Обрезает текст по заданной высоте или количеству строк.

```js
{ 
    content: 'text', 
    height: 120 
}
```

Или с `line-clamp`:

```js
{ 
    content: 'text', 
    ellipsis: { 
        line: 3
}
```

> ⚠️ `line-clamp` требует `display: -webkit-box` и `-webkit-line-clamp` в CSS.

### 2. Режим `elements` (по количеству элементов)

Оставляет первые `cnt` элементов, остальные скрываются.
```js
{ 
    content: 'elements', 
    elements: 'news-item', 
    cnt: 5 
}
```

---

## 🌍 Локализация

Тексты кнопок и подсказок локализуются через `lang_buttons(lang, 'rollup')`.

Поддерживаемые языки:
- `ru` — русский
- `en` — английский
- (и другие, если добавлены в `lang_buttons`)

## 🖱️ Data API

- `data-vg-toggle="rollup"` — элемент, клик по которому переключает контент.
- `data-vg-target="#id"` — указывает на контейнер с контентом.
- `data-vg-rollup='{...}'` — параметры инициализации.

---

## 🧪 Методы

| Метод | Описание |
|------|---------|
| `VGRollup.toggle(target, button)` | Переключает состояние. |
| `instance.isShow()` | Возвращает `true`, если контент развёрнут. |
| `VGRollup.init(element, params, callback)` | Инициализирует модуль. |

---

## 🎨 CSS-классы

| Класс | Описание |
|------|---------|
| `.vg-rollup` | Базовый класс контейнера. |
| `.vg-rollup-content--hidden` | Скрытое состояние (ограничение высоты). |
| `.vg-rollup-content--fade` | Эффект затухания. |
| `.vg-rollup-content--ellipsis` | Режим `line-clamp`. |
| `.vg-rollup-content--transition` | Анимация переключения. |
| `.vg-rollup-display--none` | Состояние "развёрнуто" (управляется JS). |

---
## 📎 Зависимости

- `BaseModule` — базовый класс компонентов.
- `Classes`, `Manipulator` — утилиты для работы с классами и атрибутами.
- `Selectors` — безопасный поиск элементов.
- `EventHandler` — делегирование событий.
- `lang_buttons(lang, 'rollup')` — функция локализации.

---

## ✅ Требования

- Современный браузер (поддержка ES6, `classList`, `insertAdjacentHTML`).
- Для `line-clamp` требуется поддержка `-webkit-line-clamp`.

---

## 📄 Лицензия

MIT — свободное использование и модификация.

---

📌 *Разработано в рамках фронтенд-системы VG Modules.*
> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS