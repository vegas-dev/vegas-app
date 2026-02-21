# VGNav

JS-модуль навигации с поддержкой dropdown-меню, позиционирования и мобильного режима (гамбургер).

## Возможности
- Автосборка структуры: добавляет контейнерные классы, режим размещения (`horizontal` / др.).
- Dropdown-меню с анимацией и управлением состоянием (`show`, `fade`, `active`).
- Hover-режим для десктопа, click-режим для мобильных.
- Автосоздание кнопки-гамбургера, если она отсутствует в разметке.
- Автодобавление toggle-индикатора к пунктам `.dropdown > a`.
- Позиционирование выпадающих меню через компонент `Placement` с автопереворотом.
- Закрытие открытых dropdown при клике вне или по `Tab` (keyup).
- Отслеживание скролла/ресайза и пересчет позиции открытых меню.
- Колбэки `afterInit`, `afterClick` для кастомного поведения.
- Интеграция с сайдбаром через события `vg.sidebar.show` / `vg.sidebar.hide`.

## Параметры
Передаются при инициализации `VGNav.init(element, params)`:

```js
{
  breakpoint: 'lg',        // точка, на которой включается hamburger/expand
  placement: 'horizontal', // класс размещения: vg-nav-horizontal и т.п.
  hover: true,             // открытие dropdown по наведению (desktop)
  animation: {
    enable: true,
    timeout: 700
  },
  toggle: '<span class="default"></span>', // HTML-индикатор возле пунктов dropdown
  hamburger: {
    enable: true,   // создать кнопку, если ее нет
    always: false,  // всегда режим hamburger
    title: '',      // текст перед иконкой
    body: null,     // HTML-контент иконки
    target: '#sidebar-nav'
  },
  callbacks: {
    afterInit: noop,
    afterClick: noop
  }
}
```

## Разметка
Минимальный каркас:

```html
<nav class="vg-nav">
  <div class="vg-nav-wrapper">
    <ul>
      <li class="dropdown">
        <a href="#">Item</a>
        <div class="dropdown-content">...</div>
      </li>
    </ul>
  </div>
</nav>
```

## События
Триггерит:
- `vg.nav.show` / `vg.nav.shown`
- `vg.nav.hide` / `vg.nav.hidden`

## Data API
Поведение навигации завязано на клики по `.vg-nav a` и на события `mouseover`/`mouseout`
для `.dropdown` при включенном `hover`.
