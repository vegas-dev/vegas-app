# VEGAS APP (VGApp)
[FUNC.TRUE?!](http://func-true.ru)

VGApp — набор фронтенд‑модулей (UI‑компонентов и утилит) на чистом JavaScript от Vegas Studio.  
Проект объединяет типовые элементы интерфейса и сценарии (модалки, табы, формы, загрузка файлов и т.д.) с едиными подходами к инициализации, data‑API, событиям и локализации.

[![npm](https://img.shields.io/npm/v/vgapp.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/vgapp) [![npm](https://img.shields.io/npm/l/vgapp.svg?style=flat-square)]()

## Install
```
npm i vgapp
```

Локально из соседнего репозитория:
```json
{
	"dependencies": {
		"vgapp": "file:../vegas-app"
	}
}
```

## API
```js
import vgapp from 'vgapp';

vgapp.boot();
```

- `vgapp` экспортируется как singleton app.
- `vgapp.register()` регистрирует модули по их статическому `NAME`.
- `vgapp.boot()` вызывает общий boot-контракт модуля.
- У модулей со своим `initAll()` boot использует его автоматически.

Для выборочного набора модулей создавайте отдельный экземпляр:
```js
import { VGApp, VGModal, VGTooltip } from 'vgapp';

const app = new VGApp();

app
	.register(VGModal, VGTooltip)
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
	.register(VGModal, VGTooltip)
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

## Authors

[VEGAS STUDIO](https://vegas-dev.com)  Russia

## License
Is published under the [MIT license](http://www.opensource.org/licenses/mit-license)
