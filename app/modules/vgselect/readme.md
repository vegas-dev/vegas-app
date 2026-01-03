# VGSelect — Кастомный `<select>` с расширенными возможностями

`VGSelect` — это продвинутый JavaScript-модуль для замены стандартного HTML-элемента `<select>` на полностью кастомизируемый компонент с поддержкой поиска, мультивыбора, динамической загрузки данных, i18n, пагинации и автоматического обновления через `MutationObserver`.

---

## ✅ Основные возможности

| Функция | Поддержка |
|--------|---------|
| 🔹 Кастомный дизайн | ✅ |
| 🔹 Поиск (локальный и удалённый) | ✅ |
| 🔹 Поддержка мультивыбора (`multiple`) | ✅ |
| 🔹 Динамическая загрузка данных (AJAX) | ✅ |
| 🔹 Пагинация и "Загрузить ещё" | ✅ |
| 🔹 i18n (многоязычность) | ✅ |
| 🔹 Автообновление при изменении `<select>` | ✅ (`MutationObserver`) |
| 🔹 Обработка `optgroup` | ✅ |
| 🔹 Поддержка `disabled`, `required`, `placeholder` | ✅ |
| 🔹 Полная доступность (ARIA) | ✅ |
| 🔹 Коллбэки и события | ✅ |

---

## 📦 Установка и инициализация

### HTML
```html
 <select id="country" class="vg-select w-100" name="country" data-max="10" required>
    <option value="2" data-price="1">Россия</option>
    <option value="3" data-price="2">Узбекистан</option>
    <option value="4" data-price="3">Казахстан</option>
    <option value="5" data-price="4" selected>Белоруссия</option>
    <option value="6" data-price="5" disabled>Китай</option>
</select>
```
### JavaScript
```js
js import VGSelect from './app/modules/vgselect/js/vgselect';
// Инициализация 
VGSelect.init(document.getElementById('mySelect'), { 
    lang: 'ru', 
    placeholder: 'Выберите значение', 
    search: {
        enabled: true, 
        remote: true, 
        route: '/api/search', 
        delay: 300, 
        minTerm: 1, 
        pagination: true, 
        loadMoreText: 'Загрузить ещё'
    }, 
    onInit: (element) => console.log('VGSelect инициализирован'), 
    onChange: (element, data) => console.log('Значение изменено:', data) 
});
```

---

## 🔧 Параметры инициализации

| Параметр | Тип | Описание |
|--------|-----|---------|
| `lang` | `string` | Язык интерфейса (поддерживается i18n). По умолчанию: `ru` |
| `placeholder` | `string` | Текст плейсхолдера |
| `search.enabled` | `boolean` | Включить поле поиска |
| `search.remote` | `boolean` | Поиск через AJAX |
| `search.route` | `string` | URL для удалённого поиска |
| `search.delay` | `number` | Задержка перед запросом (мс) |
| `search.minTerm` | `number` | Минимальная длина запроса |
| `search.pagination` | `boolean` | Включить пагинацию |
| `search.pageParam` | `string` | Название параметра страницы в URL (`page`) |
| `search.termParam` | `string` | Название параметра поиска (`q`) |
| `search.perPage` | `number` | Количество элементов на страницу |
| `search.loadMoreText` | `string` | Текст кнопки "Загрузить ещё" |
| `onInit` | `function` | Коллбэк при инициализации |
| `onShow` | `function` | Коллбэк при открытии |
| `onHide` | `function` | Коллбэк при закрытии |
| `onChange` | `function` | Коллбэк при изменении значения |
| `onSelect` | `function` | Коллбэк при выборе элемента |
| `onClear` | `function` | Коллбэк при очистке выбора |
| `onLoadNext` | `function` | Коллбэк при загрузке следующей страницы |
| `onSearch` | `function` | Коллбэк при вводе в поиске |

---

## 🌐 i18n (международные сообщения)

Модуль поддерживает локализацию через:
- `lang_titles(lang, component)` — заголовки
- `lang_messages(lang, component)` — сообщения (например, "Загрузка...")
- `lang_buttons(lang, component)` — кнопки (например, "Загрузить ещё")

Поддерживаемые языки: `ru`, `en` и др. (настраивается в ядре).

---

## 🔁 Динамическая загрузка данных

Если включён `search.remote`, компонент отправляет запрос на указанный `route` с параметрами:

```html
?q=searchTerm&page=1&per_page=20
```

Ожидается JSON-ответ:
```json
{
  "results": 
    [ 
      { "id": "1", "text": "Опция 1" },
      { "id": "2", "text": "Опция 2" } 
    ], 
  "pagination": { 
    "current_page": 1, 
    "total_pages": 5
  }
}
```
---

## 🔍 Поиск

- **Локальный**: фильтрация уже существующих опций.
- **Удалённый**: AJAX-запрос с пагинацией.
- Поддержка кнопки **"Загрузить ещё"** при включённой пагинации.

---

## 🔄 Автообновление (MutationObserver)

Компонент автоматически обновляется при:
- Изменении `option` или `optgroup` в исходном `<select>`
- Изменении атрибутов: `disabled`, `required`, `hidden`, `style`
- Добавлении/удалении опций через DOM

---

## 🎯 API методы

| Метод | Описание |
|------|---------|
| `VGSelect.init(select, params, rebuild)` | Инициализация |
| `VGSelect.destroy(select)` | Удаление компонента |
| `VGSelect.updateUI(select)` | Обновление отображаемого значения |
| `VGSelect.changeSelector(select, value, data)` | Программная установка значения |
| `VGSelect.addOptions(select, data, { preserve })` | Добавление опций (удобно при AJAX) |
| `instance.show()` | Открыть выпадающий список |
| `instance.hide()` | Закрыть выпадающий список |
| `instance.toggle()` | Переключить состояние |

---

## 📣 События

| Событие | Описание |
|--------|---------|
| `vg.select.init` | Инициализация завершена |
| `vg.select.show` | Начало открытия |
| `vg.select.shown` | Открытие завершено |
| `vg.select.hide` | Начало закрытия |
| `vg.select.hidden` | Закрытие завершено |
| `vg.select.change` | Значение изменено |
| `vg.select.select` | Элемент выбран |
| `vg.select.clear` | Выбор очищен |
| `vg.select.rebuild` | Список перестроен (после поиска) |
| `vg.select.loadNext` | Загружена следующая страница |
| `vg.select.error` | Ошибка (AJAX, данные и т.д.) |

---

## 📝 Лицензия

MIT. Свободно использовать и модифицировать.

---

📌 *Разработано в рамках фронтенд-системы VG Modules.*
> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS