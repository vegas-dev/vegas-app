# VGTabs — Модуль вкладок (Tabs)

`VGTabs` — это модуль на чистом JavaScript, реализующий интерактивные вкладки с поддержкой клавиатуры, хеш-роутинга, AJAX-загрузки контента, анимации и визуального индикатора (слайдер).

Модуль расширяет `BaseModule`, что позволяет легко интегрировать его в компонентную архитектуру, а также использовать настройки через `data-*` атрибуты или JavaScript API.

---

## 🔧 Возможности

- ✅ Переключение вкладок по клику
- ✅ Поддержка горячих клавиш: `←`, `→`, `↑`, `↓`, `Home`, `End`
- ✅ Хеш-роутинг: активация вкладки по `#id`
- ✅ Поддержка анимации (`fade`, `show`)
- ✅ AJAX-загрузка контента (реализована в `BaseModule`)
- ✅ Слайдер-индикатор под активной вкладкой
- ✅ Полная ARIA-совместимость (доступность)
- ✅ Поддержка выпадающих меню (`dropdown`)
- ✅ Простое подключение через `data-vg-toggle="tab"`

---

## 📦 Структура HTML

```html
<div class="vg-tabs">
    <ul class="vg-tabs-panel" id="myTab" role="tablist">
        <li class="vg-tabs-item" role="presentation">
            <button class="vg-tabs-link active" id="home-tab" data-vg-toggle="tab" data-vg-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
        </li>
        <li class="vg-tabs-item" role="presentation">
            <button class="vg-tabs-link" id="profile-tab" data-vg-toggle="tab" data-vg-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button>
        </li>
        <li class="vg-tabs-item" role="presentation">
            <button class="vg-tabs-link" id="contact-tab" data-vg-toggle="tab" data-vg-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button>
        </li>
        <li class="vg-tabs-item" role="presentation">
            <button class="vg-tabs-link" id="disabled-tab" data-vg-toggle="tab" data-vg-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled>Disabled</button>
        </li>
    </ul>
</div>

<div class="vg-tabs-content mt-4" id="myTabContent">
    <div class="vg-tabs-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus deserunt magni numquam omnis tenetur unde.
    </div>
    <div class="vg-tabs-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid debitis eum ipsam maiores minima minus natus qui sunt! Architecto asperiores cum eaque exercitationem fugiat in labore nemo nostrum ullam voluptatum.
    </div>
    <div class="vg-tabs-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
        Lorem ipsum dolor sit amet.
    </div>
    <div class="vg-tabs-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorum excepturi hic laudantium nulla. Eos ipsa quos vero voluptates. Dolorem.
    </div>
</div>
```

---

## ⚙️ Настройки (параметры)

Настройки можно задать через JavaScript при инициализации или через `data-vg-tabs='{}'`.

| Параметр       | Тип     | По умолчанию | Описание |
|----------------|---------|--------------|---------|
| `slide`        | boolean | `false`      | Показывать слайдер-индикатор под вкладками |
| `hash`         | boolean | `false`      | Активировать вкладку по хешу в URL (`#id`) |
| `ajax.route`   | string  | `''`         | URL для AJAX-запроса |
| `ajax.target`  | string  | `''`         | CSS-селектор, куда вставлять ответ |
| `ajax.method`  | string  | `'get'`      | HTTP-метод (`get`, `post`) |
| `ajax.once`    | boolean | `true`       | Загружать контент один раз |
| `ajax.output`  | boolean | `true`       | Выводить ответ в DOM |

---

## 🎯 События

Модуль генерирует события до и после переключения вкладок.

| Событие         | Описание |
|-----------------|--------|
| `vg.tabs.show`  | Перед активацией вкладки |
| `vg.tabs.shown` | После активации вкладки |
| `vg.tabs.hide`  | Перед деактивацией вкладки |
| `vg.tabs.hidden`| После деактивации вкладки |
| `vg.tabs.loaded`| После AJAX-загрузки контента |

Пример прослушивания:

```js
document.addEventListener('vg.tabs.shown', function (e) { 
    console.log('Активирована вкладка:', e.target);
    console.log('Предыдущая вкладка:', e.relatedTarget); 
});
```

---

## 🖱️ Управление с клавиатуры

- `→ / ↓` — следующая вкладка
- `← / ↑` — предыдущая вкладка
- `Home` — первая вкладка
- `End` — последняя вкладка

---

## 🛠️ AJAX-загрузка

Если указаны параметры `ajax.route` и `ajax.target`, контент будет подгружен при первом открытии вкладки (если `ajax.once = true`).

После загрузки срабатывает событие `vg.tabs.loaded`.

---

## 🌈 Слайдер-индикатор

При включённой опции `slide: true` под вкладками появляется плавающий индикатор, который перемещается при наведении и переключении.

---

## 📐 Поддерживаемые селекторы

Модуль поддерживает различные структуры:
- `.vg-tabs-link`
- `.list-group-item`
- Элементы с `role="tab"`
- Работает с `dropdown` и `data-vg-toggle="dropdown"`

---

## 🚀 Инициализация

Модуль инициализируется автоматически при загрузке страницы для всех элементов с `data-vg-toggle="tab"`.

Также можно создать вручную:

```js
import VGTabs from 'app/modules/vgtabs/js/vgtabs';
const tab = new VGTabs(document.querySelector('[data-vg-toggle="tab"]'), { 
    slide: true, 
    hash: true 
});
```


## 📝 Лицензия

MIT. Свободно использовать и модифицировать.

---

📌 *Разработано в рамках фронтенд-системы VG Modules.*
> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS