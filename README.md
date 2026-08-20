# VEGAS APP (VGApp)
[FUNC.TRUE?!](http://func-true.ru)

VGApp — набор фронтенд‑модулей (UI‑компонентов и утилит) на чистом JavaScript от Vegas Studio.  
Проект объединяет типовые элементы интерфейса и сценарии (модалки, табы, формы, загрузка файлов и т.д.) с едиными подходами к инициализации, data‑API, событиям и локализации.

[![npm](https://img.shields.io/npm/v/vgapp.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/vgapp) [![npm](https://img.shields.io/npm/l/vgapp.svg?style=flat-square)]()

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

## Темы и SCSS-токены

VGApp использует семантические CSS-переменные с префиксом `--vg-`. Значения переменных формируются из SCSS-карт `$theme-light` и `$theme-dark`, расположенных в `app/utils/scss/_tokens.scss`.

Светлая тема используется по умолчанию. Явно выбрать тему можно атрибутом `data-vg-theme` на `<html>`:

```html
<html data-vg-theme="light">
```

```html
<html data-vg-theme="dark">
```

Атрибут также можно установить на отдельный контейнер, чтобы изменить тему только внутри него:

```html
<section data-vg-theme="dark">
	<!-- Компоненты внутри секции используют тёмную тему -->
</section>
```

Тему можно переключать во время работы приложения:

```js
document.documentElement.dataset.vgTheme = 'dark';
```

`data-vg-theme` — стандартный адаптер готового `vgapp.css`, а не обязательный механизм темы сайта. При сборке из SCSS карты и генератор можно подключить к селекторам основного проекта:

```scss
@use "vgapp/theme" as vg-theme;

[data-bs-theme="light"] {
	@include vg-theme.theme-variables(vg-theme.$theme-light);
}

[data-bs-theme="dark"] {
	@include vg-theme.theme-variables(vg-theme.$theme-dark);
}
```

Таким же способом можно использовать `data-ox-theme`, класс `.dark` или любой другой селектор. VGApp генерирует только переменные с префиксом `--vg-` и не меняет глобальный `color-scheme` проекта.

### Структура карт

Карты содержат не названия конкретных компонентов, а общие семантические роли:

- фон страницы и поверхности компонентов;
- обычный, акцентный, вторичный, disabled и контрастный текст;
- обычные, усиленные и disabled-границы;
- primary-цвет и его состояния;
- тени и backdrop;
- цвета состояний `success`, `warning`, `danger` и `info`.

У `$theme-light` и `$theme-dark` должен быть одинаковый набор ключей. Значения этих ключей для каждой темы могут отличаться.

### Добавление нового токена

Например, чтобы добавить secondary-цвет и цвет focus-ring, нужно расширить обе карты:

```scss
$theme-light: (
	// Существующие токены...
	secondary-color: #6b7280,
	secondary-hover-color: #4b5563,
	focus-ring-color: rgba(0, 101, 255, .35),
);

$theme-dark: (
	// Существующие токены...
	secondary-color: #a7a7a7,
	secondary-hover-color: #d1d1d1,
	focus-ring-color: rgba(110, 168, 254, .45),
);
```

Генератор темы автоматически создаст CSS-переменные:

```css
--vg-secondary-color: ...;
--vg-secondary-hover-color: ...;
--vg-focus-ring-color: ...;
```

После этого токены можно использовать в компонентах:

```scss
.vg-control {
	color: var(--vg-secondary-color);

	&:hover {
		color: var(--vg-secondary-hover-color);
	}

	&:focus-visible {
		box-shadow: 0 0 0 3px var(--vg-focus-ring-color);
	}
}
```

При миграции существующего значения следует указывать fallback светлой темы. Благодаря этому отдельный SCSS-вход компонента продолжит работать, даже если базовый файл темы не был подключён:

```scss
border-color: var(--vg-border-color, rgba(0, 0, 0, .2));
background: var(--vg-surface-bg, #ffffff);
```

### Правила именования

- Токен должен описывать назначение, например `surface-hover-bg`, а не конкретное значение вроде `gray-100`.
- Общие токены не должны содержать название компонента. Настройки конкретного компонента остаются в его собственной SCSS-карте.
- Новый ключ необходимо добавлять одновременно в `$theme-light` и `$theme-dark`.
- Компоненты должны использовать `var(--vg-...)`, чтобы тема могла переключаться без повторной сборки CSS.

CSS-переменные темы генерируются в `app/utils/scss/_theme.scss` и подключаются через базовый `default.scss` и полную SCSS-сборку. Все SCSS-компоненты VGApp переведены на модульную систему Sass, семантические токены и публичные настраиваемые карты.

## Authors

[VEGAS STUDIO](https://vegas-dev.com)  Russia

## License
Is published under the [MIT license](http://www.opensource.org/licenses/mit-license)

## Проекты на VGApp

Используете VGApp в публичном сайте, внутреннем сервисе или open-source проекте? Расскажите об этом сообществу — создайте Pull Request или Issue и укажите:

- название проекта;
- ссылку, если проект публичный;
- используемые модули VGApp;
- короткое описание или отзыв;
- можно ли публиковать название, ссылку и логотип.

Для закрытого проекта ссылку раскрывать не обязательно: его можно указать без названия, например «Внутренняя CRM автосервиса».

```md
| Проект | Сайт | Модули VGApp | Описание |
|---|---|---|---|
| Название проекта | https://example.com | VGModal, VGSelect | Короткое описание проекта |
```

Список формируется добровольно. VGApp не использует скрытую телеметрию и не собирает адреса сайтов. Статистика скачиваний npm публикуется отдельно и не считается количеством проектов или сайтов.
