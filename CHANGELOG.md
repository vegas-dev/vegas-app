# VEGAS-APP 1.2.2 (Июнь, 16, 2026)
## Новые фичи
* В VGFiles добавлена настройка кнопок подтверждения удаления через `removes.buttons`, `removes.single.buttons` и `removes.all.buttons`.
* В VGFormSender добавлены опции `alert.modal.closeModalsBeforeModal` и `alert.toast.closeModalsBeforeToast` для управления закрытием открытых модалок перед показом alert-modal или toast.

## Изменения
* В VGFormSender при `alert.modal.closeModalsBeforeModal = false` новая alert-modal открывается поверх существующей модалки, получает класс `vg-modal-stacked` и повышенный `z-index`.
* В VGFormSender закрытие открытых Bootstrap/VGModal модалок вынесено в общий helper.
* В VGFormSender служебный параметр `closeModalsBeforeToast` не передается в настройки VGToast.
* Обновлена версия пакета в `package.json`: `1.2.1` -> `1.2.2`.

---

# VEGAS-APP 1.2.0 (Июнь, 16, 2026)
## Новые фичи
* В VGToast добавлен параметр `type` со встроенными SVG-иконками для типов `success`, `error`, `warning`, `info`.
* В VGFormSender добавлен новый режим алертов `alert.type = 'toast'` с интеграцией через `VGToast`.

## Изменения
* В VGToast добавлена мапа типов уведомлений на набор иконок `getSVG`, включая `error -> danger`.
* Вставка SVG-иконок в VGToast переведена на безопасную схему через `Sanitize.toSafeHtmlString()` и DOM fragment вместо прямого `innerHTML`.
* В VGFormSender выделена общая подготовка содержимого алертов в `_prepareAlertResponse()`, чтобы единообразно собирать `title/message` для modal, collapse и toast.
* В VGFormSender добавлена сборка toast-параметров из `alert.*` и `alert.toast`, включая проброс `theme`, `type`, `placement`, `autohide`, `delay`, `drag`, `resize`, `stack`, `animation`, `ajax`.
* В VGRollup исправлена инициализация локализованных текстов: язык и подписи кнопок теперь подставляются до слияния параметров, с учётом `data-lang` и `params.lang`.
* Обновлена версия пакета в `package.json`: `1.1.7` -> `1.2.0`.

---

# VEGAS-APP 1.1.7 (Апрель, 13, 2026)
## Новые фичи
* В VGFilePreview добавлена поддержка атрибута `data-name` для явной установки отображаемого имени файла (в приоритете над `data-vg-filepreview-display-name`).

## Изменения
* Обновлена версия пакета в `package.json`: `1.1.6` -> `1.1.7`.

---

# VEGAS-APP 1.1.6 (Апрель, 10, 2026)
## Новые фичи
* **VGToast**: добавлены встроенные модули VGToastDrag и VGToastResize с поддержкой параметров drag/resize (enable, threshold, edgeSize, minWidth/minHeight, debug).

## Изменения
* В VGToast добавлено автоматическое управление drag/resize при show/hide/dispose и синхронизация позиции/размера внутри viewport.
* Исправлен скачок тоста при начале drag/resize: при подготовке позиции сбрасывается translate.
* Исправлено поведение автоскрытия при интеракции: таймер останавливается на pointerdown и корректно возобновляется на pointerup/pointercancel.
* В VGToast.build() при static: true и отсутствии явного autohide автоскрытие по умолчанию отключается.
* Исправлены некорректно отображавшиеся комментарии в vgtoast.js.

---
# VEGAS-APP 1.1.5 (Апрель, 9, 2026)
## Новые фичи
* В VGModal добавлены встроенные модули `VGModalDrag` и `VGModalResize` с поддержкой параметров `drag`/`resize` (включение, порог, зона edge, минимальные размеры, debug).

## Изменения
* В VGFilePreview при `ui.nameOnly=true` блок `.preview` отключается (очистка + скрытие), отображается только имя файла.
* В VGFilePreview добавлена интеграция метаданных для audio/video. Audio: `title` и `cover` из ID3; Video: генерация poster-кадра в `icon`.
* В VGFilePreview унифицировано поведение имени для audio/video: `name` показывает title из метаданных (если есть), иначе имя файла; `original_name` при наличии title показывает имя файла.
* В VGFilePreview клик по `.vg-filepreview-audio-inline__name` теперь запускает/ставит на паузу аудио.
* В VGFilePreview клик по картинке в `icon` (image/audio cover/video poster) открывает ImageModal.
* В стилях VGFilePreview добавлен `.is-preview-action { cursor: pointer; }`.
* В VGFilePreview добавлена конфигурация предпросмотра по группам через `this._params.preview.<group>.enable` (`audio`, `video`, `image`, `archive`, `text`, `office`, `pdf`), в текущем состоянии по умолчанию группы включены.
* В VGModal добавлено автоматическое управление drag/resize при `show/hide/resize` модального окна, с синхронизацией позиции и границ внутри viewport.
* В VGFilePreview изменены дефолты групп предпросмотра: `image` и `office` включены по умолчанию (теперь включены все группы предпросмотра).
* В VGFilePreview для image-файлов в `_shouldRenderPreviewForCurrentFile()` добавлено принудительное отключение inline-preview.

---
# VEGAS-APP 1.1.4 (Апрель, 9, 2026)
## Новые фичи
* В модуле VGFilePreview для изображений реализован показ самой картинки в слоте иконки (с fallback на стандартную иконку при ошибке загрузки).

## Изменения
* В модуле VGFilePreview параметр `ui.preview` сделан опциональным и выключен по умолчанию.
* В модуле VGFilePreview длинные названия файлов и original name ограничены: `min-width: 60px` и `text-overflow: ellipsis`, чтобы название не схлопывалось.

---

# VEGAS-APP 1.0.0 - 1.1.3 (Апрель, 9, 2026)
* Новый модуль VGFilePreview, см. файл readme.md
* У модуля VGModal новый параметр `size: width и height`, кастомная высота и ширина, хорошо для `width: fit-content`
* модуль VGFilePreview интегрирован с VGFiles
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.9.1 - 1.0.0 (Март, 2, 2026)
* Новый модуль VGNestable, см. файл readme.md
* Добавлены новые функции в модуле VGSelect, см. файл readme.md
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.8.7 - 0.9.0 (Февраль, 10, 2026)
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.8.3 - 0.8.6 (Январь, 4, 2026)
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.8.2 (Январь, 4, 2026)
* Оптимизирован модуль VGRollup, см. файл readme.md
* Оптимизирован модуль VGSidebar, см. файл readme.md
* Оптимизирован модуль VGTabs, см. файл readme.md
* Оптимизирован модуль VGSpy, см. файл readme.md
* Оптимизирован модуль VGToast, см. файл readme.md
* Оптимизирован и дополнен модуль VGSelect, см. файл readme.md

---

# VEGAS-APP 0.8.1 (Январь, 2, 2026)
* Оптимизирован и дополнен модуль VGLoadMore, см. файл readme.md

---

 # VEGAS-APP 0.8.0 (Декабрь, 31, 2025)
* Полностью переписан модуль VGFiles, см. файл readme.md
* Рефакторинг модуля VGLawCookie, см. файл readme.md

# VEGAS-APP 0.7.9 (Декабрь, 19, 2025)
* Добавлена возможность управления клавиатурой в модуле VGAlert. ESC - отменяет действие. ENTER - подтверждает действие
* В VGAlert добавлен JSDoc и документация
* В VGCollapse добавлен JSDoc и документация

# VEGAS-APP 0.7.7 - 0.7.8 (Декабрь, 18, 2025)
* Дополнен модуль VGFormSender. В директории модуля появился файл readme.md. Добавлен JSDoc
* Удалена набор функций Ajax в module-fn и добавлен самостоятельный класс Ajax с более продвинутой логикой работы с XHR
* Добавлен в компоненты класс LaravelHtmlBuilder, на лету создающий шаблоны и элементы 
```js
  const tmpl = Html('dom'); // или 'string'
  let elm = tmpl.div({...attrbuttes}, 'text');
```
* Начата работа над компонентом Lang доступные функции `lang_titles(lang, module)` и `lang_messages(lang, module)` (в разработке)
* Исправлены ошибки в разных модулях

---
# VEGAS-APP 0.7.6 (Декабрь, 13, 2025)
* Исправлена анимация в модуле VGToast
* Добавлены темы `theme:` `['success', 'info', 'warning', 'danger', 'dark']` для модуля VGToast
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.7.5 (Декабрь, 08, 2025)
* В модуль VGFORMSENDER добавлен параметр `fields` для программного добавление новых полей в FormData,
если в значении объекта окажется массив или объект, то сформируется json строка
```js
{
  fields: [
    {
      name: Andranik,
      surname: Gasparyan
    },
    ...
    {
      json: [{key: value}]
    }
  ]
}
```
* Хак на кнопку отправки `onclick` можно повесить колбек на событие
```html
<button type="submit" class="btn btn-primary"
  onclick='vg.VGFormSender.buttonClick("#form-simple", function (form, self) {
    self._button.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
   }, "before")'
>
  <span>Сохранить</span>
</button>
```
у модуля три события `before`, `error` и `success`

* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.7.2 - 0.7.4 (Декабрь, 04, 2025)
* Новые стили и иконки для success, info, danger, warning
* Исправлены ошибки в разных модулях

## Новый модуль VGAlert

---

# VEGAS-APP 0.7.1 (Ноябрь, 26, 2025)
* в vgformsender добавлен interceptor beforeSend, позволяющий проделать необходимые пользовательские действия перед тем, как отправить форму

---

# VEGAS-APP 0.6.9 - 0.7.0 (Ноябрь, 21, 2025)
* Изменения коснулись модуля vgformsender в частности кнопку submit, дата атрибуты можно вешать на нее или на саму форму 
  1. Опциональное состояние кнопки(submit) data-button-enabled="false" - никаких действий с текстом кнопки не будет
  2. data-button-disabled - по умолчанию `true`, блокирует кнопку при отправке 
  3. data-button-spinner-enabled - по умолчанию `false`, добавляет спиннер загрузки в кнопку
  4. data-button-spinner-element - добавит код по умолчанию `<span class="spinner-border spinner-border-sm me-2"></span>`, можно придумать свой
  5. data-button-initial - можно вписать текст, или он сам возьмет содержимое кнопки.
  6. data-button-send - текст во время отправки, по умолчанию `Отправляем...`

* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.6.6 - 0.6.8 (Ноябрь, 17, 2025)
* isLeaveBackDrop (boolean) - для методов .hide() модулей VGModal и VGSidebar. Если программно нужно сменить модалки или сайдбары и/или одно на другое при этом не будет затронут задний фон Backdrop
* Исправлены ошибки в разных модулях

---
 
# VEGAS-APP 0.6.2 - 0.6.5 (Ноябрь, 10, 2025)
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.5.6 - 0.6.1 (Август, 21, 2025)
* Разделение JS и CSS
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.4.6 - 0.5.5 (Июнь, 21, 2025)
* Исправлены ошибки в разных модулях

---

# VEGAS-APP 0.4.3 - 0.4.6 (Июнь, 3, 2025)
* Исправлены ошибки в разных модулях
* Во все модули, где есть группа параметров ajax, добавлен параметр output (boolean), 
разрешает или запрещает добавление контента с сервера в целевой блок
* Во все модули, где есть группа параметров ajax, добавлен параметр once (boolean), 
разовый запрос на сервер

---
## Модуль VGRollup
* Исправлено, последовательное открытие свернутого контента

## Новый модуль VGLoadMore

---

# VEGAS-APP 0.4.3 (Май, 31, 2025)
* Исправлены ошибки в разных модулях
## Новый модуль VGTabs

---

# VEGAS-APP 0.4.0 (Май, 287, 2025)
* Исправлены ошибки в разных модулях
## Модуль VGFORMSENDER
* Добавлен параметр interceptors (перехватчики) для состояний error и/или success, после чего вызывается соответствующий колбек afterError и/или afterSuccess
* Добавлен параметр delay в группу alert автоматическое закрытие, отсчет в миллисекундах

---

# VEGAS-APP 0.3.4 (Май, 20, 2025)
## Новый модуль VGSpy

---

# VEGAS-APP 0.3.0 (Май, 09, 2025)
* Исправлены ошибки 
## Модуль VGFORMSENDER
* Добавлен параметр pass, будет добавлен глаз к полю с паролем

---

# VEGAS-APP 0.2.5 (Апрель, 12, 2025)
* Исправлены ошибки в разных модулях
## Новый модуль VGRollup

---

# VEGAS-APP 0.2.4 (Апрель, 8, 2025)
## Модуль VGSidebar & VGModal
* Добавлен параметр hash
## Новый модуль VGToast

---

# VEGAS-APP 0.2.3 (Апрель, 4, 2025)
## Модуль VGDROPDOWN
* Добавлен параметр overflow и backdrop

---

# VEGAS-APP 0.2.1 (Март, 31, 2025)
## Модуль VGDROPDOWN
* Теперь можно открыть выпадающих список через параметр data-vg-target
---

# VEGAS-APP 0.1.9 (Март, 13, 2025)
## Модуль VGFORMSENDER
* Новый параметр timeout. Задержка показа модального окна после закрытия других открытых окон.
---

# VEGAS-APP 0.1.8 (Март, 13, 2025)
## Модуль VGSelect
* Релиз
---

# VEGAS-APP 0.1.7 (Март, 12, 2025)
## Модуль VGSelect
* Исправлены ошибки
---

# VEGAS-APP 0.1.5 (Март, 11, 2025)
## Модуль VGSelect
### Добавлено:
* data-placeholder
---

### Исправлено:
* Открытие и закрытие списка
---

## Для модулей VGSidebar и VGModal
### Добавлено:
* Событие после аякс запроса NAME_KEY.loaded
---

# VEGAS-APP 0.1.4 (Март, 10, 2025)
* Перенесен плагин (<a href="https://github.com/vegas-dev/vegas-select">VGSelect</a>) в модуль VGSelect
* для модулей VGSidebar и VGModal добавлена возможность собирать параметры с кнопки вызова элемента
* в модуль VGSidebar добавлен класс vg-sidebar-open в тело документа
* исправлены некоторые ошибки
---






