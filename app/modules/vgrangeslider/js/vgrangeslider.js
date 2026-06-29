import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import Selectors from "../../../utils/js/dom/selectors";
import { mergeDeepObject, normalizeData } from "../../../utils/js/functions";
import { applyRangeSliderSkin, syncRangeSliderSkin } from "./skins";

const NAME = 'rangeslider';
const NAME_KEY = 'vg.rangeslider';

const SELECTOR_DATA_MODULE = '[data-vgrangeslider]';

const CLASS_NAME_MODULE = 'vg-range-slider';
const CLASS_NAME_RANGE = 'is-range';
const CLASS_NAME_DISABLED = 'disabled';
const CLASS_NAME_TOOLTIP_HIDDEN = 'is-hidden';

const EVENT_KEY_INIT = `${NAME_KEY}.init`;
const EVENT_KEY_INPUT = `${NAME_KEY}.input`;
const EVENT_KEY_CHANGE = `${NAME_KEY}.change`;
const EVENT_KEY_UPDATE = `${NAME_KEY}.update`;

const defaultParams = {
	range: false,
	min: 0,
	max: 100,
	step: 1,
	start: null,
	connect: true,
	tooltips: true,
	labels: true,
	separator: ' - ',
	suffix: '',
	prefix: '',
	labelWords: null,
	skin: 'default',
	ruler: {
		count: 6,
		labels: true,
		values: null,
		dimInactive: false,
	},
	status: {
		warningBelow: 60,
		dangerBelow: 30,
		by: 'to',
	},
	name: {
		min: '',
		max: '',
	},
	input: {
		min: null,
		max: null,
	},
	output: {
		target: null,
		min: null,
		max: null,
	},
	disabled: false,
	onInit: null,
	onInput: null,
	onChange: null,
	onUpdate: null,
	formatValue: null,
};

class VGRangeSlider extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._sourceInput = this._element.matches('input[type="range"]') ? this._element : null;
		this._params = this._buildParams(params);
		this._isRange = this._resolveRangeMode();
		this._listeners = [];
		this._handleResize = () => this._syncUI();
		this._dom = {
			root: null,
			wrapper: null,
			fill: null,
			inputFrom: null,
			inputTo: null,
			tooltipFrom: null,
			tooltipTo: null,
			tooltipMerged: null,
			labelFrom: null,
			labelTo: null,
			labelSeparator: null,
			hiddenMin: null,
			hiddenMax: null,
			skin: null,
		};

		this._state = this._buildState();

		this._render();
		this._bindEvents();
		this._syncUI();
		this._setDisabledState(this._params.disabled);
		this._emit(EVENT_KEY_INIT, 'onInit');
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY;
	}

	static init(element, params = {}) {
		return this.getOrCreateInstance(element, params);
	}

	getValue() {
		return this._isRange ? [this._state.from, this._state.to] : this._state.from;
	}

	setValue(value, options = {}) {
		const { silent = false, emit = 'update' } = options;

		if (this._isRange) {
			const next = Array.isArray(value) ? value : [value, this._state.to];
			const from = this._normalizeValue(next[0], this._state.min);
			const to = this._normalizeValue(next[1], this._state.max);
			this._state.from = Math.min(from, to);
			this._state.to = Math.max(from, to);
		} else {
			this._state.from = this._normalizeValue(value, this._state.min);
		}

		this._syncUI();

		if (!silent) {
			this._emit(emit === 'change' ? EVENT_KEY_CHANGE : EVENT_KEY_UPDATE, emit === 'change' ? 'onChange' : 'onUpdate');
		}
	}

	enable() {
		this._setDisabledState(false);
	}

	disable() {
		this._setDisabledState(true);
	}

	dispose() {
		this._listeners.forEach(({ element, type, handler }) => element.removeEventListener(type, handler));
		this._listeners = [];
		window.removeEventListener('resize', this._handleResize);
		super.dispose();
	}

	_buildParams(params) {
		const merged = this._getParams(this._element, mergeDeepObject(defaultParams, params));

		if (this._sourceInput) {
			merged.min = this._sourceInput.min !== '' ? normalizeData(this._sourceInput.min) : merged.min;
			merged.max = this._sourceInput.max !== '' ? normalizeData(this._sourceInput.max) : merged.max;
			merged.step = this._sourceInput.step !== '' ? normalizeData(this._sourceInput.step) : merged.step;
			merged.start = this._sourceInput.value !== '' ? normalizeData(this._sourceInput.value) : merged.start;
			merged.name = this._sourceInput.name || merged.name;
			merged.disabled = this._sourceInput.disabled || merged.disabled;
		}

		if (typeof merged.name === 'string') {
			merged.name = {
				min: merged.name,
				max: merged.name,
			};
		}

		if (!merged.input || typeof merged.input !== 'object') {
			merged.input = { min: null, max: null };
		}

		if (typeof merged.output === 'string') {
			merged.output = {
				target: merged.output,
				min: null,
				max: null,
			};
		} else if (!merged.output || typeof merged.output !== 'object') {
			merged.output = {
				target: null,
				min: null,
				max: null,
			};
		} else if (!Object.prototype.hasOwnProperty.call(merged.output, 'target')) {
			merged.output.target = null;
		}

		if (!merged.labelWords && merged.label && typeof merged.label === 'object' && Object.prototype.hasOwnProperty.call(merged.label, 'words')) {
			merged.labelWords = merged.label.words;
		}

		if (typeof merged.labelWords === 'string') {
			merged.labelWords = merged.labelWords
				.split(',')
				.map((word) => word.trim())
				.filter(Boolean);
		} else if (!Array.isArray(merged.labelWords)) {
			merged.labelWords = null;
		}

		return merged;
	}

	_buildState() {
		const min = Number(normalizeData(this._params.min));
		const max = Math.max(Number(normalizeData(this._params.max)), min);
		const step = Number(normalizeData(this._params.step)) || 1;
		const start = this._resolveStartValues(min, max);

		return {
			min,
			max: max >= min ? max : min,
			step: step > 0 ? step : 1,
			from: start.from,
			to: start.to,
		};
	}

	_resolveRangeMode() {
		if (this._sourceInput) return false;
		return normalizeData(this._params.range) === true;
	}

	_resolveStartValues(min, max) {
		let from = min;
		let to = max;

		if (this._isRange) {
			const start = Array.isArray(this._params.start) ? this._params.start : [this._params.from, this._params.to];
			from = this._normalizeValue(start[0], min, min, max);
			to = this._normalizeValue(start[1], max, min, max);
			if (from > to) {
				[from, to] = [to, from];
			}
		} else {
			const value = this._params.start ?? this._params.value ?? min;
			from = this._normalizeValue(value, min, min, max);
			to = from;
		}

		return { from, to };
	}

	_render() {
		const root = this._sourceInput ? this._renderFromInput() : this._renderFromContainer();
		this._dom.root = root;
		this._dom.wrapper = Selectors.find('.vg-range-slider__wrapper', root);
		this._dom.fill = Selectors.find('.vg-range-slider__fill', root);
		this._dom.inputFrom = Selectors.find('.vg-range-slider__input--from', root);
		this._dom.inputTo = Selectors.find('.vg-range-slider__input--to', root);
		this._dom.tooltipFrom = Selectors.find('.vg-range-slider__tooltip--from', root);
		this._dom.tooltipTo = Selectors.find('.vg-range-slider__tooltip--to', root);
		this._dom.tooltipMerged = Selectors.find('.vg-range-slider__tooltip--merged', root);
		this._dom.labelFrom = Selectors.find('.vg-range-slider__label--from', root);
		this._dom.labelTo = Selectors.find('.vg-range-slider__label--to', root);
		this._dom.labelSeparator = Selectors.find('.vg-range-slider__separator', root);
		this._dom.hiddenMin = root.querySelector('input[data-vgrangeslider-hidden="min"]');
		this._dom.hiddenMax = root.querySelector('input[data-vgrangeslider-hidden="max"]');
		this._dom.skin = applyRangeSliderSkin(root, this._params, this._state, {
			formatValue: (value) => this._formatValue(value),
			toPositionPx: (value) => this._toPositionPx(value),
		});
	}

	_renderFromInput() {
		const sourceInput = this._sourceInput;
		const root = document.createElement('div');
		root.className = CLASS_NAME_MODULE;

		const wrapper = document.createElement('div');
		wrapper.className = 'vg-range-slider__wrapper';

		const track = document.createElement('div');
		track.className = 'vg-range-slider__track';

		const fill = document.createElement('div');
		fill.className = 'vg-range-slider__fill';

		const tooltip = this._params.tooltips ? this._createTooltip('from') : null;
		const labels = this._params.labels ? this._createLabels(false) : null;

		sourceInput.insertAdjacentElement('beforebegin', root);

		sourceInput.classList.add('vg-range-slider__input', 'vg-range-slider__input--from');
		sourceInput.autocomplete = 'off';

		track.appendChild(fill);
		wrapper.appendChild(track);
		wrapper.appendChild(sourceInput);
		if (tooltip) wrapper.appendChild(tooltip);
		root.appendChild(wrapper);
		if (labels) root.appendChild(labels);

		return root;
	}

	_renderFromContainer() {
		const root = this._element;
		root.classList.add(CLASS_NAME_MODULE);
		if (this._isRange) root.classList.add(CLASS_NAME_RANGE);

		root.innerHTML = '';

		const wrapper = document.createElement('div');
		wrapper.className = 'vg-range-slider__wrapper';

		const track = document.createElement('div');
		track.className = 'vg-range-slider__track';

		const fill = document.createElement('div');
		fill.className = 'vg-range-slider__fill';

		track.appendChild(fill);
		wrapper.appendChild(track);

		const inputFrom = this._createRangeInput('from');
		wrapper.appendChild(inputFrom);

		if (this._isRange) {
			const inputTo = this._createRangeInput('to');
			wrapper.appendChild(inputTo);
		}

		if (this._params.tooltips) {
			wrapper.appendChild(this._createTooltip('from'));
			if (this._isRange) wrapper.appendChild(this._createTooltip('to'));
			if (this._isRange) wrapper.appendChild(this._createTooltip('merged'));
		}

		root.appendChild(wrapper);

		if (this._params.labels) {
			root.appendChild(this._createLabels(this._isRange));
		}

		if (this._isRange) {
			this._ensureHiddenInput(root, 'min', this._params.input?.min, this._params.name?.min);
			this._ensureHiddenInput(root, 'max', this._params.input?.max, this._params.name?.max);
		} else if (this._params.name?.min) {
			this._ensureHiddenInput(root, 'min', this._params.input?.min, this._params.name.min);
		}

		return root;
	}

	_createRangeInput(type) {
		const input = document.createElement('input');
		input.type = 'range';
		input.className = `vg-range-slider__input vg-range-slider__input--${type}`;
		input.min = String(this._state.min);
		input.max = String(this._state.max);
		input.step = String(this._state.step);
		input.value = String(type === 'to' ? this._state.to : this._state.from);
		input.autocomplete = 'off';
		return input;
	}

	_createTooltip(type) {
		const tooltip = document.createElement('span');
		tooltip.className = `vg-range-slider__tooltip vg-range-slider__tooltip--${type}`;
		if (type === 'merged') {
			tooltip.classList.add(CLASS_NAME_TOOLTIP_HIDDEN);
		}
		return tooltip;
	}

	_createLabels(isRange) {
		const labels = document.createElement('div');
		labels.className = 'vg-range-slider__labels';

		const from = document.createElement('span');
		from.className = 'vg-range-slider__label vg-range-slider__label--from';
		labels.appendChild(from);

		if (isRange) {
			const separator = document.createElement('span');
			separator.className = 'vg-range-slider__separator';
			separator.textContent = this._params.separator;
			labels.appendChild(separator);

			const to = document.createElement('span');
			to.className = 'vg-range-slider__label vg-range-slider__label--to';
			labels.appendChild(to);
		}

		return labels;
	}

	_ensureHiddenInput(root, role, selector, name) {
		let input = selector ? Selectors.find(selector) : null;
		if (!input) {
			input = document.createElement('input');
			input.type = 'hidden';
			if (name) input.name = name;
			root.appendChild(input);
		}
		input.setAttribute('data-vgrangeslider-hidden', role);
	}

	_bindEvents() {
		const inputHandler = (type) => (event) => {
			const rawValue = this._normalizeValue(event.target.value, this._state.min);

			if (this._isRange) {
				if (type === 'from') {
					this._state.from = Math.min(rawValue, this._state.to);
					event.target.value = String(this._state.from);
				} else {
					this._state.to = Math.max(rawValue, this._state.from);
					event.target.value = String(this._state.to);
				}
			} else {
				this._state.from = rawValue;
			}

			this._syncUI();
			this._emit(EVENT_KEY_INPUT, 'onInput');
		};

		const changeHandler = () => {
			this._syncUI();
			this._emit(EVENT_KEY_CHANGE, 'onChange');
		};

		[this._dom.inputFrom, this._dom.inputTo].filter(Boolean).forEach((input) => {
			const type = input.classList.contains('vg-range-slider__input--to') ? 'to' : 'from';
			const onInput = inputHandler(type);
			const onChange = changeHandler;

			input.addEventListener('input', onInput);
			input.addEventListener('change', onChange);

			this._listeners.push({ element: input, type: 'input', handler: onInput });
			this._listeners.push({ element: input, type: 'change', handler: onChange });
		});

		window.addEventListener('resize', this._handleResize);
	}

	_syncUI() {
		const fromPercent = this._toPercent(this._state.from);
		const toPercent = this._toPercent(this._isRange ? this._state.to : this._state.from);
		const fromPosition = this._toPositionPx(this._state.from);
		const toPosition = this._toPositionPx(this._isRange ? this._state.to : this._state.from);

		if (this._dom.inputFrom) this._dom.inputFrom.value = String(this._state.from);
		if (this._dom.inputTo) this._dom.inputTo.value = String(this._state.to);

		if (this._dom.fill) {
			const left = this._isRange ? fromPosition : 0;
			const width = this._isRange ? (toPosition - fromPosition) : toPosition;
			this._dom.fill.style.left = `${Math.max(left, 0)}px`;
			this._dom.fill.style.width = `${Math.max(width, 0)}px`;
		}

		this._placeTooltip(this._dom.tooltipFrom, fromPosition, this._formatValue(this._state.from));
		this._placeTooltip(this._dom.tooltipTo, toPosition, this._formatValue(this._state.to));
		this._syncTooltips(fromPosition, toPosition);

		if (this._dom.labelFrom) this._dom.labelFrom.textContent = this._formatValue(this._state.from);
		if (this._dom.labelTo) this._dom.labelTo.textContent = this._formatValue(this._state.to);
		if (this._dom.labelSeparator) this._dom.labelSeparator.hidden = !this._isRange;

		this._syncTargets();
		syncRangeSliderSkin(this._dom.skin, this._state, {
			isRange: this._isRange,
			params: this._params,
			dom: this._dom,
		});
	}

	_syncTargets() {
		const values = this.getValue();
		const [from, to] = Array.isArray(values) ? values : [values, values];

		if (this._dom.hiddenMin) {
			this._dom.hiddenMin.value = String(from);
		}

		if (this._dom.hiddenMax) {
			this._dom.hiddenMax.value = String(to);
		}

		this._setText(this._params.output?.target, this._isRange ? `${this._formatValue(from)}${this._params.separator}${this._formatValue(to)}` : this._formatValue(from));
		this._setText(this._params.output?.min, this._formatValue(from));
		this._setText(this._params.output?.max, this._formatValue(to));
	}

	_setDisabledState(state) {
		this._params.disabled = !!state;
		if (this._dom.root) {
			this._dom.root.classList.toggle(CLASS_NAME_DISABLED, this._params.disabled);
		}

		[this._dom.inputFrom, this._dom.inputTo].filter(Boolean).forEach((input) => {
			input.disabled = this._params.disabled;
		});
	}

	_placeTooltip(node, percent, value) {
		if (!node) return;
		node.textContent = value;
		node.style.left = `${percent}px`;
	}

	_syncTooltips(fromPosition, toPosition) {
		const mergedTooltip = this._dom.tooltipMerged;
		const fromTooltip = this._dom.tooltipFrom;
		const toTooltip = this._dom.tooltipTo;

		if (!this._isRange || !mergedTooltip || !fromTooltip || !toTooltip) {
			if (fromTooltip) fromTooltip.classList.remove(CLASS_NAME_TOOLTIP_HIDDEN);
			if (toTooltip) toTooltip.classList.remove(CLASS_NAME_TOOLTIP_HIDDEN);
			if (mergedTooltip) mergedTooltip.classList.add(CLASS_NAME_TOOLTIP_HIDDEN);
			return;
		}

		const gap = 8;
		const fromHalfWidth = fromTooltip.offsetWidth / 2;
		const toHalfWidth = toTooltip.offsetWidth / 2;
		const isIntersected = (toPosition - fromPosition) <= (fromHalfWidth + toHalfWidth + gap);

		if (!isIntersected) {
			fromTooltip.classList.remove(CLASS_NAME_TOOLTIP_HIDDEN);
			toTooltip.classList.remove(CLASS_NAME_TOOLTIP_HIDDEN);
			mergedTooltip.classList.add(CLASS_NAME_TOOLTIP_HIDDEN);
			return;
		}

		fromTooltip.classList.add(CLASS_NAME_TOOLTIP_HIDDEN);
		toTooltip.classList.add(CLASS_NAME_TOOLTIP_HIDDEN);
		mergedTooltip.classList.remove(CLASS_NAME_TOOLTIP_HIDDEN);
		mergedTooltip.textContent = `${this._formatValue(this._state.from)}${this._params.separator}${this._formatValue(this._state.to)}`;
		mergedTooltip.style.left = `${(fromPosition + toPosition) / 2}px`;
	}

	_toPercent(value) {
		const range = this._state.max - this._state.min;
		if (range <= 0) return 0;
		return ((value - this._state.min) / range) * 100;
	}

	_toPositionPx(value) {
		const wrapper = this._dom?.wrapper;
		const range = this._state.max - this._state.min;
		if (!wrapper || range <= 0) return 0;

		const percent = (value - this._state.min) / range;
		const styles = getComputedStyle(this._dom.root || wrapper);
		const thumbSize = parseFloat(styles.getPropertyValue('--vg-range-slider-thumb-size')) || 0;
		const width = wrapper.clientWidth || 0;

		if (width <= 0) return 0;
		if (width <= thumbSize) return width / 2;

		return (percent * (width - thumbSize)) + (thumbSize / 2);
	}

	_normalizeValue(value, fallback, min = this._state?.min ?? 0, max = this._state?.max ?? 100) {
		const numeric = Number(normalizeData(value));
		const safeValue = Number.isFinite(numeric) ? numeric : fallback;
		const clamped = Math.min(Math.max(safeValue, min), max);
		const step = this._state?.step || this._params.step || 1;
		const stepped = Math.round((clamped - min) / step) * step + min;
		return Number(stepped.toFixed(5));
	}

	_formatValue(value) {
		if (typeof this._params.formatValue === 'function') {
			return this._params.formatValue.call(this, value, this._element);
		}

		const prefix = this._params.prefix == null ? '' : String(this._params.prefix);
		const suffix = this._params.suffix == null ? '' : String(this._params.suffix);

		return `${prefix}${value}${suffix}`;
	}

	_getStatusBy() {
		if (typeof this._params?.status?.by !== 'string') {
			return 'to';
		}

		const by = this._params.status.by.toLowerCase();
		return ['from', 'to', 'avg'].includes(by) ? by : 'to';
	}

	_getStatusPercentByValue(value) {
		const range = this._state.max - this._state.min;
		if (range <= 0) {
			return 0;
		}

		return ((value - this._state.min) / range) * 100;
	}

	_getStatusToneByValue(value) {
		const percent = this._getStatusPercentByValue(value);
		const warningBelow = Number(this._params?.status?.warningBelow);
		const dangerBelow = Number(this._params?.status?.dangerBelow);
		const warningThreshold = Number.isFinite(warningBelow) ? warningBelow : 60;
		const dangerThreshold = Number.isFinite(dangerBelow) ? dangerBelow : 30;

		if (percent < dangerThreshold) {
			return 'danger';
		}

		if (percent < warningThreshold) {
			return 'warning';
		}

		return 'success';
	}

	_getStatusLabelByTone(tone) {
		if (!Array.isArray(this._params?.labelWords) || this._params.labelWords.length < 3) {
			return null;
		}

		if (tone === 'danger') {
			return this._params.labelWords[0] || null;
		}

		if (tone === 'warning') {
			return this._params.labelWords[1] || null;
		}

		return this._params.labelWords[2] || null;
	}

	_getStatusDetail() {
		const by = this._getStatusBy();
		const fromValue = this._state.from;
		const toValue = this._state.to;
		const sourceValue = by === 'from'
			? fromValue
			: by === 'avg'
				? (fromValue + toValue) / 2
				: toValue;
		const tone = this._getStatusToneByValue(sourceValue);

		return {
			by,
			sourceValue,
			percent: Number(this._getStatusPercentByValue(sourceValue).toFixed(5)),
			tone,
			label: this._getStatusLabelByTone(tone),
			from: {
				value: fromValue,
				percent: Number(this._getStatusPercentByValue(fromValue).toFixed(5)),
				tone: this._getStatusToneByValue(fromValue),
				label: this._getStatusLabelByTone(this._getStatusToneByValue(fromValue)),
			},
			to: {
				value: toValue,
				percent: Number(this._getStatusPercentByValue(toValue).toFixed(5)),
				tone: this._getStatusToneByValue(toValue),
				label: this._getStatusLabelByTone(this._getStatusToneByValue(toValue)),
			},
		};
	}

	_emit(eventName, callbackName) {
		const detail = {
			value: this.getValue(),
			from: this._state.from,
			to: this._state.to,
			min: this._state.min,
			max: this._state.max,
			step: this._state.step,
			status: this._getStatusDetail(),
			instance: this,
		};

		EventHandler.trigger(this._element, eventName, detail);

		const callback = this._params[callbackName];
		if (typeof callback === 'function') {
			callback.call(this, this._element, detail);
		}
	}

	_setText(selector, value) {
		if (!selector) return;
		const target = Selectors.find(selector);
		if (target) target.textContent = value;
	}
}

EventHandler.on(document, 'DOMContentLoaded', () => {
	Selectors.findAll(SELECTOR_DATA_MODULE).forEach((element) => {
		if (!element.dataset.vgrangesliderInitialized) {
			VGRangeSlider.getOrCreateInstance(element);
			element.dataset.vgrangesliderInitialized = 'true';
		}
	});
});

export default VGRangeSlider;
