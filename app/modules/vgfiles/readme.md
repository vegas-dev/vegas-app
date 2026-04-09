# VGFiles

`VGFiles` — модуль загрузки и управления файлами с поддержкой локального режима и AJAX.

## Новые фичи

- Поддержка `replace` для single-mode (`limits.count = 1`): новый файл заменяет предыдущий без накопления.
- Переименование входящих файлов через `rename: true | (file, index) => string`.
- `smartdrop`: глобальная подсветка dropzone, если на экране только одна видимая зона дропа.
- Расширенный lifecycle для внешних файлов из `data-file`: парсинг `customData`, `src/image`, бинарных метаданных.
- Интеграция с `VGFilePreview` в info-списке (`ui.nameOnly: true`) для inline-аудио, скачивания и предпросмотра по клику.
- Авто-обогащение аудиофайлов метаданными (title/cover) через `extractAudioMetadata`.
- Гибкие confirm-хуки для удаления (`removes.single.confirm`, `removes.all.confirm`) с контрактом `accepted/data`.
- Повторная загрузка упавших файлов через `data-vg-reload="file"` и кнопки retry.
- Проброс `customData` файла в `data-*` атрибуты элементов списка.

## Базовые возможности

- Выбор файлов через `<input type="file">` и drag&drop.
- Лимиты: количество, размер файла, общий размер, MIME-типы.
- Режимы загрузки: `sequential` и `parallel`.
- Автоматическая/ручная инициализация.
- Сортировка загруженных файлов с сохранением порядка на сервере.
- Удаление одного файла и очистка всего списка.

## Инициализация

```js
const files = new VGFiles(document.querySelector('.vg-files'), {
  ajax: true,
  smartdrop: true,
  rename: true,
  replace: true,
  uploads: {
    route: '/api/upload',
    mode: 'sequential'
  },
  limits: {
    count: 10,
    sizes: 5,
    total: 50
  }
});
```

## Ключевые параметры

- `allowed` — разрешить drag-drop режим и особенности drop-зоны.
- `ajax` — включить серверную загрузку.
- `replace` (`default: true`) — замена файла в single-mode.
- `rename` (`default: false`) — переименование файлов до добавления в список.
- `smartdrop` (`default: false`) — глобальная логика подсказки drop-зоны.
- `prepend` (`default: true`) — добавление новых файлов в начало.
- `uploads.mode` — `'sequential' | 'parallel'`.
- `uploads.maxParallel`, `uploads.maxConcurrent`, `uploads.retryAttempts`, `uploads.retryDelay`.
- `removes.single.confirm`, `removes.all.confirm` — кастомные confirm-обработчики.
- `sortable.enabled`, `sortable.route`, `sortable.handle`, `sortable.lists`.

## Внешние (уже загруженные) файлы

Модуль может стартовать с предзаполненным списком через `data-file` в `<li>`.

Поддерживаемые поля объекта:

- `id`, `name`, `size`, `type`, `src` (обязательный набор для валидного внешнего файла)
- `image` (опционально)
- `lastModified` / `last-modified` (опционально)
- любые дополнительные поля -> попадают в `customData`

`customData` дальше пробрасывается в `data-*` атрибуты элементов файла и может использоваться в шаблонах/интеграциях.

## AJAX-события и callbacks

DOM-события:

- `vg.files.change`
- `vg.files.upload.start`
- `vg.files.upload.progress`
- `vg.files.upload.complete`
- `vg.files.upload.error`
- `vg.files.upload.allComplete`
- `vg.files.remove`
- `vg.files.reload`

Callbacks (`params.callbacks`):

- `onInit`
- `onChange` (`{ files, input, inputFiles }`)
- `onUploadStart`
- `onUploadProgress`
- `onUploadComplete`
- `onUploadError`
- `onUploadAllComplete`
- `onRemoveFile`
- `onClear`
- `onReload`

## Удаление с кастомным confirm

Если передан `removes.single.confirm` или `removes.all.confirm`, модуль вызывает вашу функцию вместо стандартного `VGAlert`.

Контракт результата:

- `true` или `{ accepted: true }` — подтвердить.
- `false` или `{ accepted: false }` — отменить.
- `{ accepted: true, data }` — подтвердить и использовать готовый ответ удаления (без дополнительного AJAX-запроса).

## Статусы файлов

- `pending` — ожидает загрузки.
- `loading` — идет загрузка.
- `completed` — успешно загружен.
- `failing` — ошибка загрузки (доступен reload).

## Методы API

- `upload(file)`
- `uploadAll(files)`
- `reload(button)`
- `removeFile(button)`
- `clear(resetInput, uiOnly)`
- `dispose()`

