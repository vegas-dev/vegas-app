# VGSidebar – Модуль боковой панели (сайдбара)

`VGSidebar` – это модуль на чистом JavaScript, реализующий интерактивную боковую панель (сайдбар) с поддержкой анимаций, backdrop, AJAX-загрузки, управления скроллом и навигации через URL-хэш. Легко интегрируется в любые проекты без зависимостей.

---

## ✅ Возможности

- Открытие/закрытие сайдбара по клику, хэшу URL или программно
- Поддержка затемнённого фона (backdrop)
- Блокировка скролла страницы при открытом сайдбаре
- Поддержка клавиши **Escape** для закрытия
- Анимации входа и выхода (через CSS-классы, например, с `animate.css`)
- Возможность загрузки контента через AJAX
- Поддержка открытия по `#id` в URL (хэш-роутинг)

---

## 🔧 Установка

HTML разметка сайдбара:
```html
<div class="vg-sidebar left" id="sidebar-left"  data-animation='{"enable": true, "in": "animate__fadeInLeft", "out": "animate__fadeOutLeft"}'>
    <div class="vg-sidebar-header">
        <div class="vg-sidebar-header--title">...</div>
        <button type="button" class="vg-btn-close" data-vg-dismiss="sidebar" data-vg-target="#sidebar-left" aria-label="Close"></button>
    </div>
    <div class="vg-sidebar-body">...</div>
    <div class="vg-sidebar-footer">...</div>
</div>
```
---

## ⚙️ Параметры (настройки)

Параметры можно задать:
- Через `data-*` атрибуты
- Через JavaScript при инициализации
- Через объединение обоих способов

| Параметр           | Тип      | По умолчанию       | Описание |
|--------------------|----------|--------------------|---------|
| `backdrop`         | boolean  | `true`             | Показывать затемнённый фон |
| `overflow`         | boolean  | `true`             | Блокировать скролл страницы |
| `keyboard`         | boolean  | `true`             | Закрывать по нажатию `Esc` |
| `hash`             | boolean  | `false`            | Поддержка открытия по `#id` в URL |
| `animation.enable` | boolean  | `false`            | Включить анимации |
| `animation.in`     | string   | `animate__rollIn`  | CSS-класс анимации входа |
| `animation.out`    | string   | `animate__rollOut` | CSS-класс анимации выхода |
| `animation.delay`  | number   | `800`              | Задержка перед закрытием (мс) |
| `ajax.route`       | string   | `''`               | URL для AJAX-загрузки |
| `ajax.target`      | string   | `''`               | Селектор внутри сайдбара для вставки |
| `ajax.method`      | string   | `'get'`            | HTTP-метод (`get`, `post`) |
| `ajax.loader`      | boolean  | `false`            | Показывать лоадер |
| `ajax.once`        | boolean  | `false`            | Загружать контент только один раз |
| `ajax.output`      | boolean  | `true`             | Вставлять ответ в DOM |

---

## 🖱️ Использование

### 1. Через Data API (рекомендуется)
```html
<a href="#sidebar-left" data-vg-toggle="sidebar">Открыть панель слева</a>
или
<button class="btn btn-primary" data-vg-target="#sidebar-right" data-vg-toggle="sidebar">Открыть панель справа</button>
```

> ⚠️ Обязательно задавайте `id`, если используете `data-vg-target` или хэш.

### 2. Через JavaScript

```js
import VGSidebar from './modules/vgsidebar/js/vgsidebar.js';
const sidebar = new VGSidebar(document.getElementById('sidebar-left'), { 
    backdrop: true, 
    overflow: true, 
    keyboard: true, 
    hash: true, 
    animation: { 
        enable: true, 
        in: 'animate__fadeInLeft', 
        out: 'animate__fadeOutLeft', 
        delay: 500 
    } 
});

sidebar.show();
sidebar.hide(); 
sidebar.toggle();
```

### 3. Открытие по хэшу URL

Включите параметр `hash: true`, и при переходе по ссылке вида:

```html
https://example.com/page#sidebar-left
```

Сайдбар с `id="sidebar-left"` автоматически откроется.

---

### 4. AJAX-загрузка контента
```html
<div class="vg-sidebar right" id="sidebar-right" data-params='{"ajax": {"route": "/core/server.php?sidebar=right", "target": "#sidebar-ajax-content", "loader": true}}'>
...
```

При открытии сайдбара контент будет загружен с `/api/sidebar-content` и вставлен в `.vg-sidebar-content`.

---

## 🎉 События

Модуль генерирует пользовательские события:

| Событие                   | Описание |
|---------------------------|---------|
| `vg.sidebar.show`         | Перед открытием |
| `vg.sidebar.shown`        | После открытия |
| `vg.sidebar.hide`         | Перед закрытием |
| `vg.sidebar.hidden`       | После закрытия |
| `vg.sidebar.loaded`       | После AJAX-загрузки |
| `vg.sidebar.hidePrevented`| Если закрытие отменено (например, `Esc`, но `keyboard: false`) |

## 🧹 Очистка

При необходимости удалите экземпляр:

```js
sidebar.dispose();
```` 

---

## 🧩 Зависимости

- `BaseModule` – базовый класс модулей
- `Backdrop` – управление затемнением
- `ScrollBarHelper` – блокировка скролла
- `EventHandler` – гибкая система событий
- `Selectors` – безопасный поиск элементов

---


## 📝 Лицензия

MIT. Свободно использовать и модифицировать.

---

📌 *Разработано в рамках фронтенд-системы VG Modules.*
> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS