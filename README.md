# VEGAS APP (VGApp)
[FUNC.TRUE?!](http://func-true.ru)

VGApp — набор фронтенд‑модулей (UI‑компонентов и утилит) на чистом JavaScript от Vegas Studio.  
Проект объединяет типовые элементы интерфейса и сценарии (модалки, табы, формы, загрузка файлов и т.д.) с едиными подходами к инициализации, data‑API, событиям и локализации.

[![npm](https://img.shields.io/npm/v/vgapp.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/vgapp) [![npm](https://img.shields.io/npm/l/vgapp.svg?style=flat-square)]()

## Install
```
npm i vgapp
```

## API
```js
import vgapp from 'vgapp';

vgapp.boot();
```

- `vgapp` экспортируется как singleton app.
- `vgapp.register()` использует единый контракт: `register(name, Module)`.
- `vgapp.boot()` вызывает общий boot-контракт модуля.
- У модулей со своим `initAll()` boot использует его автоматически.

Для выборочного набора модулей создавайте отдельный экземпляр:
```js
import { VGApp, VGModal, VGTooltip } from 'vgapp';

const app = new VGApp();

app
	.register(VGModal.NAME, VGModal)
	.register(VGTooltip.NAME, VGTooltip)
	.boot();
```

## Подключение

### Laravel + Vite
`resources/js/app.js`
```js
import vgapp from 'vgapp';
import 'vgapp/build/vgapp.css';

vgapp.boot();
```

`vite.config.js`
```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
	plugins: [
		laravel([
			'resources/css/app.css',
			'resources/js/app.js',
		]),
	],
});
```

В Blade:
```php
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

### Vite
`src/main.js`
```js
import vgapp from 'vgapp';
import 'vgapp/build/vgapp.css';

vgapp.boot();
```

### Webpack
`src/app.js`
```js
import vgapp from 'vgapp';
import 'vgapp/build/vgapp.css';

vgapp.boot();
```

Минимально в `webpack.config.js`:
```js
module.exports = {
	entry: './src/app.js',
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};
```

### Частичный boot
Если не нужно поднимать весь реестр singleton-приложения:
```js
import { VGApp, VGModal, VGTooltip } from 'vgapp';
import 'vgapp/build/vgapp.css';

const app = new VGApp();

app
	.register(VGModal.NAME, VGModal)
	.register(VGTooltip.NAME, VGTooltip)
	.boot();
```

## Что умеет

### Общие возможности
- Работает без jQuery, ориентирован на ES6+.
- Поддерживает инициализацию через JS и `data-*` атрибуты.
- События на DOM для интеграции и расширения поведения.
- AJAX‑интеграция в ключевых модулях.
- Локализация интерфейсных текстов.
- Расширяемая архитектура модулей и рендереров.

### Основные модули
- `VGAlert` — диалоги подтверждения и уведомления с поддержкой AJAX‑сценариев.
- `VGCollapse` — сворачиваемые секции и аккордеоны с анимацией.
- `VGDropdown` — выпадающие меню с гибким открытием и позиционированием.
- `VGDynamicTable` — интерактивные таблицы с сортировкой, фильтрацией, remote-режимом и состоянием.
- `VGFiles` — загрузка и управление файлами (dropzone, валидация, AJAX, сортировка).
- `VGFilePreview` — предпросмотр файлов разных типов и действия по файлу (preview/download).
- `VGFormSender` — отправка форм (AJAX/нативно), обработка состояний и ответов.
- `VGLawCookie` — баннер cookies с сохранением выбора пользователя.
- `VGLoadMore` — подгрузка контента кнопкой или при прокрутке.
- `VGModal` — базовый модуль модальных окон.
- `VGNav` — навигация и мобильное меню.
- `VGNestable` — drag‑and‑drop вложенных списков с обновлением структуры.
- `VGRangeSlider` — одиночные и диапазонные слайдеры со значениями, лимитами и синхронизацией полей.
- `VGRollup` — ограничение контента по высоте/элементам с кнопкой разворота.
- `VGSelect` — кастомный select с поиском, мультивыбором и i18n.
- `VGSidebar` — боковые панели с управлением открытием/закрытием.
- `VGSpy` — scroll‑spy для подсветки активных ссылок по секциям.
- `VGTabs` — вкладки с переключением контента и поддержкой URL/hash.
- `VGToast` — всплывающие уведомления со стеком и автозакрытием.
- `VGTooltip` — tooltip/popover подсказки с Data API, автопозиционированием и закрытием по `Esc`/клику вне элемента.

### VGSelect: автоматический поиск

По умолчанию `autosearch: true`: поле поиска автоматически появляется, если в `<select>` больше 7 непустых видимых опций. Число вместо `true` задаёт собственный порог:

```js
VGSelect.init(select, { autosearch: 10 }); // поиск появится при 11+ опциях
VGSelect.init(select, { autosearch: 15 }); // поиск появится при 16+ опциях
VGSelect.init(select, { autosearch: false }); // автоматический поиск отключён
```

Ручное включение поиска не зависит от количества опций и имеет приоритет над `autosearch`:

```js
VGSelect.init(select, {
	search: { enabled: true }, // поиск будет виден даже для двух опций
});
```

`search.remote: true` также всегда включает поле поиска: remote-режим не зависит от количества локальных опций.

Те же настройки через Data API:

```html
<select class="vg-select" data-autosearch="10">...</select>
<select class="vg-select" data-search-enabled="true">...</select>
<select class="vg-select" data-search-remote="true" data-search-route="/api/search">...</select>
```

## Authors

[VEGAS STUDIO](https://vegas-dev.com)  Russia

## License
Is published under the [MIT license](http://www.opensource.org/licenses/mit-license)
