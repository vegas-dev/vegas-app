# VGDropdown — Модуль выпадающего списка

**VGDropdown** — это универсальный и гибко настраиваемый JavaScript-компонент для создания интерактивных 
выпадающих меню (dropdown) в веб-интерфейсах. Поддерживает позиционирование, анимации, AJAX-загрузку контента,
работу с hover/кликами, клавиатурную навигацию и доступность.

---

## 📌 Основные возможности

- Открытие/закрытие по клику или наведению (`hover`)
- Поддержка **автоматического позиционирования** (с учётом границ экрана и overflow)
- Полная **клавиатурная навигация** (стрелки, Esc, Tab)
- **AJAX-загрузка контента** динамически
- **CSS-анимации** (вход/выход) с использованием Animate.css
- Поддержка **fade-эффектов** и кастомных задержек
- Автоматическое закрытие других открытых dropdown'ов
- Полная **доступность (a11y)**: `aria-expanded`
- Совместимость с **мобильными устройствами**
- Гибкая инициализация: через JS или `data-*` атрибуты

---

## 🧩 Структура HTML

```bladehtml
<div class="vg-dropdown">
    <a href="#" data-vg-toggle="dropdown" data-params='{"hover": "true"}' ( или data-hover="true") class="btn btn-primary" aria-expanded="false">Open</a>
    <div class="vg-dropdown-content">
        <div class="vg-dropdown-container">
            <ul class="list-group">
                <li class="list-group-item"><a href="#">Home</a></li>
                <li class="list-group-item"><a href="#">Services</a></li>
                <li class="list-group-item"><a href="#">About</a></li>
                <li class="list-group-item"><a href="#">Contacts</a></li>
            </ul>
        </div>
    </div>
</div>
```

> 💡 Убедитесь, что `.vg-dropdown-content` находится внутри `.vg-dropdown`, либо укажите селектор явно через `data-vg-target`.

---

## ⚙️ Параметры инициализации

| Параметр | Тип | По умолчанию | Описание                                                                      |
|--------|------|-------------|-------------------------------------------------------------------------------|
| `placement` | `string` | `'auto'` | Позиция меню: `'top-start'`, `'bottom-start'`, `'left-start'`, `'right-start'`, `'auto'` и т.д. |
| `hover` | `boolean` | `false` | Открывать при наведении мыши (на десктопе)                                    |
| `animation.fade` | `boolean` | `true` | Добавить класс `fade` при показе                                              |
| `animation.enable` | `boolean` | `false` | Включить CSS-анимации                                                         |
| `animation.in` | `string` | `'animate__flipInY'` | Класс анимации входа (например, Animate.css)                                  |
| `animation.out` | `string` | `'animate__flipOutY'` | Класс анимации выхода                                                         |
| `animation.delay` | `number` | `300` | Задержка перед удалением `.show` (в мс)                                       |
| `ajax.route` | `string` | `''` | URL для загрузки контента                                                     |
| `ajax.target` | `string` | `''` | Селектор внутри `.vg-dropdown-content` для вставки данных                     |
| `ajax.method` | `string` | `'get'` | HTTP-метод запроса                                                            |
| `ajax.loader` | `boolean` | `false` | Показывать лоадер при загрузке                                                |
| `ajax.once` | `boolean` | `false` | Загружать контент только один раз                                             |
| `ajax.output` | `boolean` | `true` | Вставлять ответ в DOM                                                         |

---

## 🚀 Инициализация

### Через JavaScript
```js 
import VGDropdown from 'app/modules/vgdropdown/js/vgdropdown';

const dropdown = new VGDropdown(document.querySelector('[data-vg-toggle="dropdown"]'), { 
    placement: 'bottom-start', 
    hover: true, 
    animation: { 
        enable: true, 
        in: 'animate__fadeInDown', 
        out: 'animate__fadeOutUp', 
        delay: 200
    }, 
    ajax: { 
        route: '',
        target: '', 
        method: 'get', 
        once: true
	} 
});
```

> Атрибуты автоматически преобразуются в параметры:  
> `data-placement` → `placement`  
> `data-ajax-route` → `ajax.route`

---

## 🔁 Методы

| Метод | Описание |
|------|--------|
| `.toggle()` | Переключает состояние (открыть/закрыть) |
| `.show()` | Открывает меню |
| `.hide()` | Закрывает меню |
| `.dispose()` | Удаляет экземпляр и обработчики событий |
| `.getInstance(element)` | Получить существующий экземпляр |
| `.getOrCreateInstance(element, params)` | Получить или создать экземпляр |

```js
VGDropdown.getOrCreateInstance().hide(); // Закрыть drop
```
---

## 📣 События

VGDropdown генерирует пользовательские события.

| Событие | Срабатывает | Детали (`event.detail`) |
|--------|-------------|-------------------------|
| `vg.dropdown.show` | Перед открытием | `relatedTarget` — кнопка |
| `vg.dropdown.shown` | После открытия | `relatedTarget` |
| `vg.dropdown.hide` | Перед закрытием | `relatedTarget` |
| `vg.dropdown.hidden` | После закрытия | `relatedTarget` |
| `vg.dropdown.loaded` | После AJAX-загрузки | `stats`, `data` |

```js
dropdown._drop.addEventListener('vg.dropdown.shown', (e) => { 
    console.log('Дроп открыт', e.detail.relatedTarget); 
});
```

---

## 🖱️ Поведение при наведении (`hover`)

```js 
hover: true
```

- Работает только на десктопах (`!isMobileDevice()`)
- Автоматически закрывается при уходе курсора
- Не конфликтует с другими открытыми меню

---

## 🔁 AJAX-загрузка контента

```js
ajax: {
    route: '/menu', 
    target: '#drop-content', // Целевой селектор внутри .vg-dropdown-container
    method: 'get', 
    once: true, 
    loader: false, 
    output: true 
}
```
- Контент загружается при первом открытии (если `once: true`)
- Ответ вставляется в указанный селектор
- Генерируется событие `vg.dropdown.loaded`

---

## 🎨 Анимации

Поддерживается два режима:

### 1. Fade (CSS)
### 2. CSS-анимации (через Animate.css)
```js
animation: { enable: true, in: 'animate__fadeInUp', out: 'animate__fadeOutDown' }
```
> Убедитесь, что подключили animate.css или свои классы анимаций.

---

## 📱 Адаптивность и мобильные устройства

- На мобильных устройствах `hover` отключается
- При открытии временно блокируются `mouseover` события на других элементах (для стабильности)
- Поддерживает тач-события корректно

---

## 🔐 Доступность (a11y)

- `aria-expanded` автоматически обновляется
- Поддержка клавиатуры: **Enter**, **Space**, **Esc**, **↑↓**
- Закрытие при клике вне или нажатии `Tab`

---
## 🧰 Статические методы

| Метод | Описание |
|------|--------|
| `VGDropdown.hideOpenToggles(event)` | Закрывает все открытые меню |
| `VGDropdown.keydownHandler(event)` | Обработчик клавиш |
| `VGDropdown.clearDrops(event)` | Обработчик кликов вне и Tab |

---

## 📦 CSS-классы

| Класс | Назначение |
|------|----------|
| `.vg-dropdown` | Родительский контейнер |
| `.vg-dropdown-content` | Выпадающее меню |
| `.show` | Показывает элемент |
| `.fade` | Эффект затухания |
| `.open` | Альтернатива fade (без анимации) |
| `[data-vg-toggle="dropdown"]` | Кнопка-переключатель |

---

## 📄 Лицензия

MIT — свободное использование и модификация.

---

🛠 Разработано с использованием современных паттернов и лучших практик.  
Создано для масштабируемых, доступных и красивых интерфейсов.

---

> 🚀 Автор: VEGAS STUDIO (vegas-dev.com)
> 📍 Поддерживается в проектах VEGAS