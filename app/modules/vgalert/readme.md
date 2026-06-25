# VGAlert — Модуль модальных окон подтверждения и уведомлений

`VGAlert` — это мощный и гибкий JavaScript-модуль, предназначенный для отображения модальных окон подтверждения действий или информационных сообщений. Он интегрирован с системой `VGModal` и поддерживает AJAX-запросы, локализацию, кастомизацию кнопок, тем оформления и работу через `data`-атрибуты.

---

## ✅ Возможности

- Отображение **подтверждающих алертов** (`confirm`) и **информационных сообщений** (`info`)
- Поддержка **AJAX-запросов** после подтверждения
- Полная **локализация** (настройка языка)
- Гибкая **настройка кнопок** и сообщений
- Поддержка **SVG-иконок** и тем стилей (`danger`, `warning`, `success`, `info`)
- Работа как через **API**, так и через **`data`-атрибуты**
- Интеграция с промисами (`Promise`)
- Защита от **множественных одновременных вызовов**
- Поддержка **клавиатурных сокращений** (Enter, Escape)
- Два режима рендера: обычный **`modal`** и вложенный **`overlay`**
- Возможность закрывать родительскую модалку/сайдбар через `render.dismiss`

---

## 📦 Установка

Модуль автоматически подключается при инициализации системы. Убедитесь, что подключены зависимости:
```js
import VGAlert from "./app/modules/vgalert/js/vgalert.js";
```

---

## 🧩 Режимы работы

### 1. `confirm` — Подтверждение действия
Показывает два действия: **Подтвердить** и **Отмена**.

### 2. `info` — Информационное сообщение
Показывает только кнопку **ОК** (или "Продолжить").

---

## 🖼 Рендер (`render`)

`VGAlert` поддерживает два варианта отображения:

| Параметр | Значение | Описание |
|--------|--------|----------|
| `render.type` | `modal` | Обычный alert в отдельной модалке |
| `render.type` | `overlay` | Alert-оверлей внутри текущей `.vg-modal` или `.vg-sidebar` |
| `render.dismiss` | `true` / `false` | Для `overlay`: после закрытия alert дополнительно закрывает родительский контейнер |

### Пример: alert поверх открытой модалки

```js
VGAlert.call({
    render: {
        type: "overlay",
        dismiss: true
    },
    relatedTarget: button,
    message: {
        title: "Удалить запись",
        description: "Действие будет выполнено в текущем окне."
    }
});
```

`relatedTarget` нужен для `overlay`, чтобы модуль нашёл ближайшую `.vg-modal` или `.vg-sidebar`, куда надо встроить alert.

---

## 🎨 Темы (`theme`)
| Значение | Иконка | Назначение |
|--------|--------|----------|
| `danger` | ⚠️ | Опасные действия (удаление, сброс) |
| `warning` | ⚠️ | Предупреждения |
| `success` | ✅ | Успешные операции |
| `info` | ℹ️ | Общая информация |

---

## 🧱 Вызов через JS (API)

### Пример 1: Подтверждение удаления

```js
VGAlert.call({ 
    mode: "confirm", 
    theme: "danger", 
    message: { 
        title: "Вы уверены?", 
        description: "Это действие нельзя отменить." 
    }, 
    buttons: { 
        agree: { 
            text: "Удалить", 
            class: ["btn-danger"]
        },
        cancel: {
            text: "Отмена", 
            class: ["btn-outline-secondary"] 
        } 
    } 
}).then(() => { // Выполнить AJAX-удаление
	console.log("Пользователь подтвердил удаление");
}).catch(() => { 
	console.log("Пользователь отменил действие"); 
});
```

### Пример 2: Информационное сообщение
```js
VGAlert.call({ 
    mode: "info",
    theme: "success",
    message: {
        title: "Успешно!", 
        description: "Данные были сохранены."
    }, 
    buttons: { 
        cancel: { 
            text: "ОК", 
            class: ["btn-success"] 
        } 
    } 
});
```

### Пример 3: Обработка результата через `Promise`
```js
VGAlert.call({
    message: {
        title: "Подтвердите действие",
        description: "Продолжить?"
    }
}).then((result) => {
    console.log(result.accepted); // true
    console.log(result.timestamp);
}).catch((error) => {
    console.log(error.accepted); // false
    console.log(error.timestamp);
});
```

---

## 🔌 Работа с AJAX

Модуль можно связать с AJAX-запросом, который выполнится после подтверждения:
```js
// Удалить запись 
// Автоматически вызывается при клике
VGAlert.confirm(element, { 
    mode: "confirm", 
    theme: "danger", 
    message: { 
        title: "Удалить?", 
        description: "Вы действительно хотите удалить эту запись?" 
    }, 
    ajax: {
        route: "/api/delete/123", 
        method: "post",
    }
});
```
После подтверждения:
- Выполняется `POST /api/delete/123`
- Результат можно отследить через события

---

## 🔔 События

Модуль генерирует события на элементе-триггере, у которого есть `[data-vg-toggle="alert"]`:

| Событие | Описание |
|--------|--------|
| `vg.alert.accept` | Пользователь подтвердил действие |
| `vg.alert.reject` | Пользователь отменил действие |
| `vg.alert.finally` | Действие завершено (в любом случае) |
| `vg.alert.loaded` | Получен ответ от сервера (если был AJAX) |

```js 
const buttons = document.querySelectorAll('[data-vg-toggle="alert"]');

buttons.forEach((button) => {
    button.addEventListener('vg.alert.accept', function (e) {
        console.log('Подтверждено:', e.vgalert);
    });
});
```

Если нужен общий глобальный обработчик, событие можно слушать и на `document`, так как оно всплывает.

---

## ⌨️ Клавиатурные комбинации

- `Enter` — подтверждение (если фокус на кнопке "Подтвердить")
- `Escape` — отмена (если `keyboard: true`)

---

## 🛠️ Конфигурация по умолчанию
```js
{ 
    mode: "confirm", 
    theme: "danger", 
    render: {
        type: "modal",
        dismiss: false
    },
    modal: { 
        centered: false,
        backdrop: true, 
        keyboard: true,
        dismiss: true 
    }, 
    buttons: {
        agree: { 
            text: "Да", 
            class: ["btn-primary"] }, 
        cancel: { 
            text: "Отмена", 
            class: ["btn-secondary"] 
        } 
    },
    message: { 
        title: "Подтвердите действие", 
        description: "Вы уверены, что хотите продолжить?" 
    } 
}
```

---

## 🌐 Локализация

Поддерживаются языки: `ru` (по умолчанию), `en`.

Настройка языка:

```js
VGAlert.call(params, 'en');
```
Переводы хранятся в `lang_buttons` и `lang_messages`.

---

## 🧩 Кастомизация кнопок

Поддерживает:
- `tag: 'button' | 'a'`
- `type` (для `<button>`)
- `class` — массив CSS-классов
- `attr` — любые дополнительные атрибуты
- `element` — готовый HTML-код кнопки
- `toggle` — служебный атрибут кнопки (`data-vg-alert-agree` / `data-vg-alert-cancel`), обычно задаётся модулем автоматически

### Пример: кнопка-ссылка
```js
buttons: { 
    agree: {
        tag: "a", 
        attr: {}, 
        class: ["btn", "btn-info"], 
        text: "Перейти в профиль" }, 
    cancel: { 
        text: "Закрыть"
    } 
}
```

---

## 🚫 Ограничения

- Нельзя открыть более одного `VGAlert` одновременно (защита от дублирования)
- Если `isAlertOpen = true`, последующие вызовы будут отклонены с ошибкой

---

## 📎 Смотрите также

- [`VGModal`](../vgmodal/readme.md) — основа модального окна
- [`BaseModule`](../../base-module.js) — базовый класс модулей
- [`lang`](../../../utils/js/components/lang.js) — система локализации

---

💡 **Совет**: Используйте `VGAlert` для критичных действий, где важно получить подтверждение от пользователя.

---
## 📄 Лицензия

MIT — свободно используйте и модифицируйте.

---

> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS
