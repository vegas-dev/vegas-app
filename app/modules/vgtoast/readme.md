# VGToast — Модуль уведомлений (Toasts)

`VGToast` — это современный, гибкий и расширяемый модуль уведомлений (toasts) для VegaS Framework. Он позволяет отображать временные сообщения пользователю с поддержкой анимаций, стека, автоматического закрытия, тем оформления и AJAX-загрузки.

---

## ✅ Возможности

- 📦 **Легковесный и автономный** — не требует внешних зависимостей (кроме utils).
- 🎨 **Поддержка тем** (`dark`, `light`, кастомные).
- 🎯 **Гибкое позиционирование**: `top`, `bottom`, `left`, `right`, `center`, `start`, `end`.
- 🔁 **Стек уведомлений** с ограничением количества и автоматическим смещением.
- ⏱ **Авто-скрытие** с настраиваемой задержкой.
- 🖱 **Закрытие по клику** на тост или кнопку.
- ⌨ **Поддержка клавиши `Esc`**.
- 🎭 **Анимации** через Animate.css (или любые CSS-анимации).
- 📡 **AJAX-подгрузка контента**.
- 🧩 **Data API** и **JS API** — полная гибкость.
- 📱 **Адаптивность** — корректно работает на всех устройствах.

---

## 📦 Установка

Модуль автоматически подключается. Убедитесь, что включены:
- `BaseModule`
- `Event` (из `utils/js/dom/event`)
- `Selectors`
- `Placement` (для умного позиционирования, опционально)

---

## 🧰 Быстрое использование

### Через JavaScript
```js
// Простое сообщение 
VGToast.run('Привет, это уведомление!');
// С заголовком 
VGToast.run(['Успешно!', 'Данные сохранены.']);
// С параметрами 
VGToast.run('Ошибка подключения', {
    theme: 'danger', 
    autohide: true, 
    delay: 5000, 
    placement: 'top-end',
    enableButtonClose: true 
});
```
---

## ⚙️ Параметры

| Параметр | Тип | По умолчанию | Описание |
|--------|------|-------------|--------|
| `static` | `boolean` | `true` | Оставить тост в DOM после скрытия |
| `placement` | `string` | `'bottom center'` | Позиция: `top`, `bottom`, `left`, `right`, `center`, `start`, `end` |
| `autohide` | `boolean` | `false` | Автоматически скрывать |
| `delay` | `number` | `3000` | Задержка перед скрытием (мс) |
| `enableClickToast` | `boolean` | `true` | Закрывать тост по клику |
| `enableButtonClose` | `boolean` | `false` | Показать кнопку закрытия |
| `keyboard` | `boolean` | `true` | Закрывать по `Esc` |
| `theme` | `string` | `'dark'` | Тема: `dark`, `light`, `success`, `danger` и др. |
| `stack.enable` | `boolean` | `true` | Включить стек уведомлений |
| `stack.max` | `number` | `5` | Макс. кол-во тостов одновременно |
| `animation.enable` | `boolean` | `true` | Включить анимации |
| `animation.in` | `string` | `'animate__backInUp'` | Анимация появления |
| `animation.out` | `string` | `'animate__backOutDown'` | Анимация исчезновения |
| `animation.delay` | `number` | `300` | Длительность анимации (мс) |
| `animation.effect` | `string \| string[]` | `'none'` | Доп. CSS-эффект отображения: `none`, `fade`, `zoom`, `blur`, `slide-up`, `slide-down` или кастомный класс |
| `ajax.route` | `string` | `''` | URL для загрузки |
| `ajax.target` | `string` | `''` | Селектор контейнера (если используется) |
| `ajax.method` | `string` | `'get'` | HTTP-метод |
| `ajax.loader` | `boolean` | `false` | Показывать лоадер |
| `ajax.once` | `boolean` | `false` | Загружать только один раз |
| `ajax.output` | `boolean` | `true` | Выводить результат в тост |

---

## 💡 Расширенные примеры

### 1. Кастомная анимация
```js
VGToast.run('Появилось!', { 
    animation: { 
        in: 'animate__fadeIn', 
        out: 'animate__fadeOut', 
        delay: 500
    } 
});
```

### 2. AJAX-уведомление
### 2.1. Дополнительные эффекты отображения
```js
VGToast.run('Сообщение', {
    animation: {
        in: 'animate__fadeIn',
        out: 'animate__fadeOut',
        effect: ['zoom', 'blur']
    }
});
```

```js
VGToast.run('Загрузка...', { 
    ajax: { 
        route: '/api/notify', 
        method: 'post', 
        output: true 
    } 
});
```
---

## 📅 События

| Событие | Описание |
|-------|--------|
| `vg.toast.show` | Перед показом |
| `vg.toast.shown` | После показа |
| `vg.toast.hide` | Перед скрытием |
| `vg.toast.hidden` | После скрытия |
| `vg.toast.loaded` | После загрузки AJAX |
| `hidePrevented.vg.toast` | Если скрытие отменено |

## 🌐 Глобальные стили

- `.vg-toast-open` — добавляется к `<body>` при открытии любого тоста.
- `.vg-toast-pointer` — курсор-пинтер при `enableClickToast`.

---

## 🔄 Методы

| Метод | Описание |
|------|--------|
| `VGToast.run(text, params, cb)` | Показать тост |
| `VGToast.build(text, params, cb)` | Создать и показать тост |
| `toast.show()` | Показать экземпляр |
| `toast.hide()` | Скрыть экземпляр |
| `toast.toggle()` | Переключить состояние |
| `toast.dispose()` | Удалить и очистить |

---


## 📝 Лицензия

MIT. Свободно использовать и модифицировать.

---

📌 *Разработано в рамках фронтенд-системы VG Modules.*
> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS
