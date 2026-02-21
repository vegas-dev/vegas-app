# VEGAS APP (VGApp)
[FUNC.TRUE?!](http://func-true.ru)

VGApp — набор фронтенд‑модулей (UI‑компонентов и утилит) на чистом JavaScript от Vegas Studio.  
Проект объединяет типовые элементы интерфейса и сценарии (модалки, табы, формы, загрузка файлов и т.д.) с едиными подходами к инициализации, data‑API, событиям и локализации.

[![npm](https://img.shields.io/npm/v/vgapp.svg?style=flat-square&maxAge=600)](https://www.npmjs.com/package/vgapp) [![npm](https://img.shields.io/npm/l/vgapp.svg?style=flat-square)]()

## Install
```
npm i vgapp
```

## Что умеет

### Общие возможности
- Работает без jQuery, ориентирован на ES6+.
- Поддерживает инициализацию через JS и `data-*` атрибуты.
- События на DOM для интеграции и расширения поведения.
- AJAX‑интеграция в ключевых модулях.
- Локализация интерфейсных текстов.

### Основные модули
- `VGAlert` — модальные окна подтверждений и уведомлений (confirm/info), интеграция с AJAX, темы, клавиатура.
- `VGModal` — базовые модальные окна.
- `VGToast` — уведомления (toasts) с темами, стеком, автозакрытием и анимациями.
- `VGSidebar` — боковые панели с backdrop, блокировкой скролла, анимациями и AJAX‑загрузкой.
- `VGNav` — навигация с dropdown‑меню, позиционированием и мобильным режимом (гамбургер).
- `VGDropdown` — выпадающие меню с позиционированием, hover/click, анимациями, a11y и AJAX.
- `VGTabs` — вкладки с клавиатурой, хеш‑роутингом, слайдер‑индикатором и AJAX‑контентом.
- `VGCollapse` — сворачиваемые блоки/аккордеоны с плавной анимацией.
- `VGRollup` — сворачивание текста или списка элементов по высоте/количеству.
- `VGLoadMore` — подгрузка контента по кнопке или при прокрутке (infinite scroll).
- `VGSpy` — scroll‑spy: подсветка активных пунктов навигации и плавная прокрутка.
- `VGSelect` — кастомный `<select>` с поиском, мультивыбором, удалёнными данными и i18n.
- `VGFormSender` — отправка форм (AJAX/нативно), валидация, спиннеры, редиректы, уведомления.
- `VGFiles` — управление файлами: drag‑and‑drop, превью, валидация, загрузка/удаление по AJAX.
- `VGLawCookie` — баннер согласия на cookies с хранением в cookie/localStorage.

## Authors

[VEGAS STUDIO](https://vegas-dev.com)  Russia

## License
Is published under the [MIT license](http://www.opensource.org/licenses/mit-license)