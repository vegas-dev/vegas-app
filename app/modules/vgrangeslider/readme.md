# VGRangeSlider

**VGRangeSlider** — JavaScript-модуль для одиночных и диапазонных слайдеров на нативных `input[type="range"]`. Поддерживает одиночный режим, диапазон с двумя ручками, tooltips, текстовые labels, внешние output-цели, скрытые input-поля для форм и визуальные skin-режимы.

---

## ✅ Возможности

- Одиночный слайдер и диапазонный слайдер (`range: true`)
- Инициализация на `input[type="range"]` или на контейнере с `data-vgrangeslider`
- Настройка `min`, `max`, `step`, `start`, `from`, `to`
- Автоматическая нормализация значений по диапазону и шагу
- Tooltips над ручками
- Объединённый tooltip для range-режима, когда ручки сближаются
- Текстовые labels под слайдером
- Вывод значений во внешние DOM-элементы
- Скрытые `input[type="hidden"]` для отправки значений формы
- Скины `default`, `ruler`, `status`
- События `init`, `input`, `change`, `update`
- API для чтения, установки значения, включения и отключения
- Автоинициализация по `DOMContentLoaded`

---

## 📦 Подключение

```js
import VGRangeSlider from "./app/modules/vgrangeslider";
```

Или напрямую:

```js
import VGRangeSlider from "./app/modules/vgrangeslider/js/vgrangeslider";
```

---

## 🧩 Варианты использования

### 1. Одиночный слайдер на `input[type="range"]`

```html
<input
	type="range"
	name="price"
	min="0"
	max="100"
	step="5"
	value="35"
	data-vgrangeslider
>
```

Модуль использует атрибуты самого input:
- `min`
- `max`
- `step`
- `value`
- `name`
- `disabled`

### 2. Диапазонный слайдер на контейнере

```html
<div
	data-vgrangeslider
	data-range="true"
	data-min="0"
	data-max="100"
	data-start='[20,80]'
	data-input='{"min":"#price-min","max":"#price-max"}'
	data-output='{"target":"#price-result","min":"#price-from","max":"#price-to"}'
></div>

<input type="hidden" id="price-min" name="price_min">
<input type="hidden" id="price-max" name="price_max">

<div id="price-result"></div>
<div id="price-from"></div>
<div id="price-to"></div>
```

Если hidden inputs не найдены по селекторам, модуль создаст их сам внутри контейнера.

---

## ⚙️ Инициализация

### Автоинициализация

Модуль автоматически инициализирует все элементы с `data-vgrangeslider` после `DOMContentLoaded`.

### Ручная инициализация

```js
const element = document.querySelector('[data-vgrangeslider]');
const slider = VGRangeSlider.init(element, {
	range: true,
	min: 0,
	max: 500,
	step: 10,
	start: [100, 300]
});
```

Или:

```js
const slider = new VGRangeSlider(element, {
	range: true,
	min: 0,
	max: 500,
	step: 10,
	start: [100, 300]
});
```

---

## 🛠 Параметры

```js
{
	range: false,
	min: 0,
	max: 100,
	step: 1,
	start: null,
	connect: true,
	tooltips: true,
	labels: true,
	separator: " - ",
	suffix: "",
	prefix: "",
	labelWords: null,
	skin: "default",
	ruler: {
		count: 6,
		labels: true,
		values: null,
		dimInactive: false
	},
	status: {
		warningBelow: 60,
		dangerBelow: 30,
		by: "to"
	},
	name: {
		min: "",
		max: ""
	},
	input: {
		min: null,
		max: null
	},
	output: {
		target: null,
		min: null,
		max: null
	},
	disabled: false,
	onInit: null,
	onInput: null,
	onChange: null,
	onUpdate: null,
	formatValue: null
}
```

### Основные параметры

| Параметр | Тип | Описание |
|---|---|---|
| `range` | `boolean` | Включает режим диапазона с двумя ручками |
| `min` | `number` | Минимальное значение |
| `max` | `number` | Максимальное значение |
| `step` | `number` | Шаг изменения |
| `start` | `number \| number[]` | Стартовое значение или `[from, to]` |
| `from` / `to` | `number` | Альтернатива `start` для range-режима |
| `disabled` | `boolean` | Блокирует управление |

### Отображение

| Параметр | Тип | Описание |
|---|---|---|
| `tooltips` | `boolean` | Показывает tooltip’ы |
| `labels` | `boolean` | Показывает текстовые labels |
| `separator` | `string` | Разделитель между значениями диапазона |
| `prefix` | `string` | Префикс для вывода значения |
| `suffix` | `string` | Суффикс для вывода значения |
| `formatValue` | `function` | Кастомный форматтер значения |

### Интеграция с формой и DOM

| Параметр | Тип | Описание |
|---|---|---|
| `name.min` | `string` | Имя hidden input для нижней границы |
| `name.max` | `string` | Имя hidden input для верхней границы |
| `input.min` | `string` | CSS-селектор существующего hidden input |
| `input.max` | `string` | CSS-селектор существующего hidden input |
| `output.target` | `string` | Селектор общего output-элемента |
| `output.min` | `string` | Селектор output для нижней границы |
| `output.max` | `string` | Селектор output для верхней границы |

### Колбэки

| Параметр | Тип | Описание |
|---|---|---|
| `onInit` | `function` | Вызывается после инициализации |
| `onInput` | `function` | Вызывается на `input` |
| `onChange` | `function` | Вызывается на `change` |
| `onUpdate` | `function` | Вызывается после `setValue()` |

---

## 🎨 Скины

### `default`

Базовый режим с track, fill, thumb, labels и tooltip’ами.

```js
new VGRangeSlider(element, {
	skin: "default"
});
```

### `ruler`

Добавляет шкалу отметок под слайдером.

```js
new VGRangeSlider(element, {
	range: true,
	skin: "ruler",
	ruler: {
		count: 5,
		labels: true,
		dimInactive: true
	}
});
```

Поддерживает:
- `ruler.count` — количество отметок, если `values` не заданы
- `ruler.values` — явный массив значений шкалы
- `ruler.labels` — показывать подписи значений
- `ruler.dimInactive` — приглушать неактивные отметки

### `status`

Окрашивает слайдер по порогам `success / warning / danger`.

```js
new VGRangeSlider(element, {
	range: true,
	skin: "status",
	status: {
		warningBelow: 60,
		dangerBelow: 30,
		by: "avg"
	},
	labelWords: ["Низкий", "Средний", "Высокий"]
});
```

Поддерживает:
- `status.warningBelow`
- `status.dangerBelow`
- `status.by: "from" | "to" | "avg"`
- `labelWords: [danger, warning, success]`

---

## 🧪 Форматирование значений

### Через `prefix` и `suffix`

```js
new VGRangeSlider(element, {
	start: 50,
	prefix: "от ",
	suffix: " ₽"
});
```

### Через `formatValue`

```js
new VGRangeSlider(element, {
	range: true,
	start: [1500, 4500],
	formatValue(value) {
		return `${value.toLocaleString("ru-RU")} ₽`;
	}
});
```

---

## 📤 Вывод значений во внешние элементы

```html
<div id="price-slider"></div>

<div>
	<span id="price-result"></span>
	<span id="price-from"></span>
	<span id="price-to"></span>
</div>
```

```js
new VGRangeSlider(document.getElementById("price-slider"), {
	range: true,
	min: 0,
	max: 10000,
	start: [2000, 8000],
	output: {
		target: "#price-result",
		min: "#price-from",
		max: "#price-to"
	},
	formatValue(value) {
		return `${value} ₽`;
	}
});
```

Модуль синхронизирует:
- `output.target` → `2000 ₽ - 8000 ₽`
- `output.min` → `2000 ₽`
- `output.max` → `8000 ₽`

---

## 🧾 Hidden inputs для форм

```html
<div id="filter-price"></div>
<input type="hidden" id="filter-price-min" name="price_min">
<input type="hidden" id="filter-price-max" name="price_max">
```

```js
new VGRangeSlider(document.getElementById("filter-price"), {
	range: true,
	min: 0,
	max: 1000,
	start: [100, 700],
	input: {
		min: "#filter-price-min",
		max: "#filter-price-max"
	}
});
```

Если селекторы не указаны, можно передать только `name`:

```js
new VGRangeSlider(element, {
	range: true,
	name: {
		min: "price_min",
		max: "price_max"
	}
});
```

Тогда hidden inputs будут созданы автоматически.

---

## 🔔 События

Модуль генерирует события на исходном элементе:

| Событие | Когда вызывается |
|---|---|
| `vg.rangeslider.init` | После инициализации |
| `vg.rangeslider.input` | При движении ручки |
| `vg.rangeslider.change` | После завершения изменения |
| `vg.rangeslider.update` | После `setValue()` |

### Пример подписки

```js
const element = document.querySelector('[data-vgrangeslider]');

element.addEventListener('vg.rangeslider.input', (event) => {
	console.log(event.detail.value);
	console.log(event.detail.from);
	console.log(event.detail.to);
	console.log(event.detail.status);
});
```

### `event.detail`

```js
{
	value,
	from,
	to,
	min,
	max,
	step,
	status,
	instance
}
```

`status` содержит:

```js
{
	by,
	sourceValue,
	percent,
	tone,
	label,
	from: {
		value,
		percent,
		tone,
		label
	},
	to: {
		value,
		percent,
		tone,
		label
	}
}
```

---

## 🧠 Публичный API

### `getValue()`

Возвращает:
- `number` для одиночного режима
- `[from, to]` для диапазона

```js
slider.getValue();
```

### `setValue(value, options?)`

```js
slider.setValue(45);

slider.setValue([100, 300], {
	silent: false,
	emit: "update"
});
```

Опции:
- `silent` — не генерировать событие
- `emit: "update" | "change"` — какое событие сгенерировать после установки

### `enable()`

```js
slider.enable();
```

### `disable()`

```js
slider.disable();
```

### `dispose()`

```js
slider.dispose();
```

Удаляет обработчики событий и освобождает экземпляр.

---

## 📝 Поведение и ограничения

- Если модуль инициализирован на `input[type="range"]`, режим диапазона не используется
- В range-режиме модуль не допускает пересечения ручек: `from` всегда меньше или равен `to`
- Любое значение приводится к допустимому диапазону и округляется по `step`
- Параметр `connect` сейчас присутствует в конфиге, но отдельной логики переключения fill не имеет — fill рисуется всегда
- Для корректного внешнего вывода селекторы в `input` и `output` должны существовать в DOM к моменту инициализации

---

## 🎨 Стилизация

Основные стили находятся в:

- `app/modules/vgrangeslider/scss/vgrangeslider.scss`
- `app/modules/vgrangeslider/scss/_variables.scss`

Модуль использует CSS custom properties для:
- размеров track и thumb
- цветов track, fill, tooltip
- параметров ruler
- z-index слоёв

---

## 📎 См. также

- `app/modules/vgrangeslider/js/vgrangeslider.js`
- `app/modules/vgrangeslider/js/skins.js`
- `app/modules/vgrangeslider/scss/vgrangeslider.scss`

---

> Автор: VEGAS STUDIO (vegas-dev.com)
> Поддерживается в проектах VEGAS
