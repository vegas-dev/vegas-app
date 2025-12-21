# VGFormSender — Модуль отправки форм

Модуль `VGFormSender` позволяет легко и гибко управлять отправкой форм на сайте. Он поддерживает как нативную, так и **AJAX-отправку**, валидацию, отображение уведомлений (через **VGModal** или **VGCollapse**), работу с паролями, спиннеры на кнопках и многое другое.

---

## ✅ Основные возможности

- 📤 **Отправка форм через AJAX или нативно**
- ✅ **HTML5-валидация** с подсветкой ошибок
- 🔔 **Уведомления** — в виде модального окна или collapse-блока
- 🔐 **Показ/скрытие пароля** (с иконкой "глаз")
- 🔁 **Спиннеры на кнопке отправки**
- 🔄 **Редиректы** после успешной или неудачной отправки
- 🧩 **Интерцепторы** (`beforeSend`, `success`, `error`) — полный контроль
- 🌐 **Мультиязычность** (поддержка `ru`, легко расширяемо)
- 📢 **События** (`before`, `success`, `error`) для внешнего контроля
- ⚙️ **Кастомизация** через параметры и `data-*` атрибуты

---

## 🧱 Подключение

### Через JavaScript
```js
import VGFormSender from './app/modules/vgformsender/js/vgformsender.js';
```
Или подключите как часть сборки.

---
## 🛠️ Инициализация

### 1. Через JavaScript
```js 
VGFormSender.init(document.getElementById('contactForm'), { 
    validate: true, // включить валидацию
    ajax: { 
        route: '/api/send', // URL для отправки 
        method: 'post' 
    }, 
    alert: { 
        type: 'modal', // 'modal' или 'collapse' 
        enabled: true, 
        delay: 5000 // ожидание открытия, через 5 секунд 
    }, 
    callback: { 
        afterSuccess: (form, instance, event, data) => { 
            console.log('Форма отправлена!', data); 
        }, 
        afterError: (form, instance, event, data) => { 
            console.error('Ошибка:', data); 
        } 
    }
});
```

### 2. Через HTML (`data-*` атрибуты)
```html
    <form action="/api/send" method="post" id="contactForm" data-vgformsender 
          data-validate="true" 
          data-alert-type="modal"
    >
        <!-- ... -->
        <button type="submit" data-button-send="Отправляем..." data-button-spinner-enabled="true">Отправить</button>
    </form>
```

---

## ⚙️ Параметры модуля

| Параметр                  | Тип                     | По умолчанию                       | Описание                                                             |
|---------------------------|-------------------------|------------------------------------|----------------------------------------------------------------------|
| `validate`                | `boolean`               | `false`                            | Включить HTML5-валидацию                                             |
| `response.enabled`        | `boolean`               | `false`                            | Нативная обработка ответа (без AJAX)                                 |
| `submit`                  | `boolean`               | `false`                            | Отправлять нативно (без AJAX)                                        |
| `fields`                  | `Array`                 | `[]`                               | Доп. данные для отправки                                             |
| `pass.enabled`            | `boolean`               | `true`                             | Показывать иконку глаза у паролей                                    |
| `alert.enabled`           | `boolean`               | `true`                             | Показывать уведомления                                               |
| `alert.type`              | `'modal' \| 'collapse'` | `'modal'`                          | Тип уведомления                                                      |
| `alert.errors`            | `boolean`               | `true`                             | Показывать детали ошибок                                             |
| `alert.delay`             | `number`                | `0`                                | Задержка закрытия (мс), `0` — не закрывать                           |
| `ajax.route`              | `string`                | `''`                               | URL отправки (переопределяет `action`)                               |
| `ajax.method`             | `string`                | `'get'`                            | HTTP-метод (`post`, `put`, и т.д.)                                   |
| `ajax.target`             | `string`                | `''`                               | Указывается ID целевого блока, для AJAX-ответа                       |
| `ajax.output`             | `boolean`               | `false`                            | Разрешает или запрещает добавление контента с сервера в целевой блок |
| `button.spinner.enabled`  | `boolean`               | `false`                            | Показывать спиннер на кнопке                                         |
| `button.spinner.element`  | `string`                | `<span class="spinner-border...">` | HTML спиннера                                                        |
| `button.send`             | `string`                | `'Отправляем...'`                  | Текст кнопки при отправке                                            |
| `button.initial`          | `string`                | `'Отправить'`                      | Исходный текст кнопки                                                |
| `redirect.success`        | `string`                | `''`                               | Редирект после успеха                                                |
| `redirect.error`          | `string`                | `''`                               | Редирект после ошибки                                                |
| `lang`                    | `string`                | `'ru'`                             | Язык сообщений                                                       |
| `interceptors.beforeSend` | `Function`              | `Promise.resolve()`                | Выполняется перед отправкой                                          |
| `interceptors.success`    | `Function\|false`       | `false`                            | Кастомная обработка успеха                                           |
| `interceptors.error`      | `Function\|false`       | `false`                            | Кастомная обработка ошибки                                           |
| `callback.afterInit`      | `Function`              | `noop`                             | После инициализации                                                  |
| `callback.afterSuccess`   | `Function`              | `noop`                             | После успеха                                                         |
| `callback.afterError`     | `Function`              | `noop`                             | После ошибки                                                         |
| `callback.afterSend`      | `Function`              | `noop`                             | После любого ответа                                                  |

---

## 🔔 События

Модуль генерирует события на DOM-элементе формы.

### Доступные события

| Событие | Данные | Описание |
|--------|--------|---------|
| `vg.fs.before` | `{ instance }` | Перед отправкой |
| `vg.fs.success` | `{ event, self, data }` | Успешная отправка |
| `vg.fs.error` | `{ event, self, data }` | Ошибка при отправке |

### Пример прослушивания

```js
document.getElementById('contactForm').addEventListener('vg.fs.success', (e) => { 
    const { data } = e.vgformsender; 
    console.log('Ответ сервера:', data); 
});
```
---

## 💬 Языки

Поддерживается русский (`ru`) по умолчанию. Вы можете расширить поддержку:
```js
// В lang.js lang_messages('en', 'errors').went_wrong = 'Something went wrong'; lang_titles('en', 'errors').title = 'Error';
```
---

## 🖼️ Типы уведомлений

### 1. Модальное окно (`modal`)
```js
alert: {
    type: 'modal', 
    enabled: true
}
```
Автоматически закрывает другие модальные окна (включая Bootstrap и VGModal).

### 2. Collapse-блок
```js 
alert: { 
    type: 'collapse', 
    enabled: true
}
```
Уведомление появляется в начале формы.

---

## 🔄 Интерцепторы

Полный контроль над процессом:
```js
interceptors: { 
    beforeSend: () => {
        return new Promise((resolve, reject) => { 
            if (confirm('Отправить форму?')) {
                resolve(); 
            } else {
                reject(); 
            } 
        });
    },
    success: (form, instance, data) => { // кастомная логика, отключает стандартное поведение 
        console.log('Кастомный успех'); 
        return false; // важно: вернуть false, чтобы отключить стандартный alert 
    } 
}
```
---

## 🖱️ Статические методы

### `VGFormSender.init(element, params)`
Инициализирует форму.

### `VGFormSender.buttonClick(formID, callback, status)`
Подписывается на нажатие кнопки.

```js 
VGFormSender.buttonClick('#contactForm', (form, instance) => { 
    console.log('Кнопка нажата до отправки'); 
}, 'before');
```
---

## 🔄 Ответ сервера
Ответ сервера обязательно должен быть в формате JSON.
```php
json_encode([
    'errors' => false, // флаг ошибки,
    'title' => 'Успех!', // заголовок уведомления
    'message' => 'Сообщение отправлено' // текст уведомления
])
```
или 

```php
json_encode([
    'errors' => false, // флаг ошибки,
    'view' => '<...>' // HTML-контент
])
```
Если есть несколько ошибок логики работы сервера, передаем так:

```php
json_encode([
    'errors' => [ // массив ошибок
        ['Не заполнено поля имя', 'Не заполнено поля email']
    ],
])
```

---

## 🎨 CSS-классы

| Класс | Назначение |
|------|-----------|
| `.vg-form-sender` | Базовый класс формы |
| `.vg-form-sender--content` | Обёртка полей |
| `.vg-form-sender-alert` | Блок уведомления |
| `.vg-form-sender-modal` | Модальное уведомление |
| `.vg-form-sender-collapse` | Collapse-уведомление |

---

## 📦 Зависимости
- `BaseModule` — базовый класс
- `VGModal`, `VGCollapse` — компоненты интерфейса
- `VGHideShowPass` — показ/скрытие пароля
- `utils/js/dom/*` — утилиты DOM
- `utils/js/functions` — вспомогательные функции

---

## 📄 Лицензия

MIT — свободно используйте и модифицируйте.

---

> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS
