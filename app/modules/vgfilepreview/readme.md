## VGFilePreview

Модуль предпросмотра файлов для элементов с атрибутом `data-vg-filepreview`.

### Новые фичи

- Inline-аудио в поле `.name`: play/pause, прогресс через CSS-переменную `--vg-filepreview-audio-inline-progress`, и контроль единственного активного аудио.
- Унифицированная кнопка скачивания: модуль сам создает/инициализирует control в поле `download`, скачивает через `fetch + blob` и имеет fallback на прямую ссылку.
- Режим `ui.nameOnly`: рендер только действий по имени файла (без кнопок/контейнера предпросмотра).
- Автоопределение языка (`ru`/`en`) с приоритетом: `params.lang` -> `element[lang]` -> ближайший `[lang]` -> `<html lang>` -> `navigator.language`.
- Видео-плейлист между соседними превью: `prev/next`, циклическая навигация и hotkeys `ArrowLeft/ArrowRight`.
- ZIP-предпросмотр с кэшем: таблица содержимого архива + предпросмотр поддерживаемых файлов внутри архива (текст/изображения), включая deflate-raw через `DecompressionStream`.
- Текстовый/Markdown modal с кэшем, безопасной обработкой ссылок и прерыванием прошлых запросов (`AbortController`).

### Что умеет модуль

- Определяет тип файла и подставляет SVG-иконку.
- Заполняет поля карточки: `name`, `ext`, `size`, `original_name`, `icon`, `download`, `preview`.
- Запускает предпросмотр по типам файлов:
  - изображения (`png/jpg/webp/svg/...`);
  - видео (`mp4/webm/mov/mkv/avi/m4v`);
  - текст (`txt/md/csv/json/xml/yml/yaml/log/ini/conf/env`);
  - `pdf`;
  - office (`doc/docx/xls/xlsx/ppt/pptx/odt/ods/odp`);
  - архивы (`zip`).
- Для интерактивных рендеров автоматически вешает обработчики клика на `.name` (`is-preview-action`).

### Состояния и валидация

- Валидация пути через helper (`data-vg-filepreview-valid`, `data-vg-filepreview-error`).
- Текущее состояние рендера в `data-vg-filepreview-state`:
  - `loading`
  - `ready`
  - `empty`
  - `error`
- Выбранный рендерер в `data-vg-filepreview-renderer` (`image`, `video`, `pdf`, `office`, `zip`, `text`, `audio`).

### Атрибуты и слоты

- `data-vg-filepreview` — путь к файлу (обязательный).
- `data-fields` — список полей для синхронизации (например, `name,size,download`).
- Поддерживаемые поля: `icon`, `name`, `ext`, `size`, `original_name`, `preview`, `download`.
- Если поле `preview` не найдено, модуль создает `<div class="preview" data-vg-filepreview-slot="preview">` автоматически (кроме `ui.nameOnly`).

### Параметры

```js
new VGFilePreview(element, {
  validate: true,
  lang: 'ru',
  ui: {
    nameOnly: false
  }
});
```

- `validate` (`boolean`, default `true`) — проверка пути до файла.
- `lang` (`'ru' | 'en'`) — язык кнопок/сообщений.
- `ui.nameOnly` (`boolean`, default `false`) — не создавать UI-контейнер предпросмотра.

### Расширение

Рендереры подключаются через `js/renderers/index.js`.

1. Создайте рендерер в `js/renderers/`.
2. Реализуйте `canRender(context)` и `render(context)`.
3. Добавьте рендерер в `js/renderers/index.js` в нужном порядке приоритета.

