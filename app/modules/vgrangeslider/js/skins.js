const SKIN_CLASS_DEFAULT = 'is-skin-default';
const SKIN_CLASS_RULER = 'is-skin-ruler';
const SKIN_CLASS_STATUS = 'is-skin-status';
const SKIN_CLASS_RULER_DIM = 'is-ruler-dim-inactive';
const STATUS_CLASS_SUCCESS = 'is-status-success';
const STATUS_CLASS_WARNING = 'is-status-warning';
const STATUS_CLASS_DANGER = 'is-status-danger';

const STATUS_CLASSES = [
	STATUS_CLASS_SUCCESS,
	STATUS_CLASS_WARNING,
	STATUS_CLASS_DANGER,
];

const resolveStatusToneByValue = (value, params, state) => {
	const span = state.max - state.min;
	const percent = span > 0 ? ((value - state.min) / span) * 100 : 0;
	const warningBelow = Number(params?.status?.warningBelow);
	const dangerBelow = Number(params?.status?.dangerBelow);
	const warningThreshold = Number.isFinite(warningBelow) ? warningBelow : 60;
	const dangerThreshold = Number.isFinite(dangerBelow) ? dangerBelow : 30;

	if (percent < dangerThreshold) {
		return 'danger';
	}

	if (percent < warningThreshold) {
		return 'warning';
	}

	return 'success';
};

const resolveStatusSourceValue = (params, state, helpers) => {
	if (!helpers.isRange) {
		return state.from;
	}

	const by = typeof params?.status?.by === 'string'
		? params.status.by.toLowerCase()
		: 'to';

	if (by === 'from') {
		return state.from;
	}

	if (by === 'avg') {
		return (state.from + state.to) / 2;
	}

	return state.to;
};

const buildRulerValues = (params, state) => {
	if (Array.isArray(params?.ruler?.values) && params.ruler.values.length > 0) {
		return params.ruler.values
			.map(value => Number(value))
			.filter(value => Number.isFinite(value))
			.sort((a, b) => a - b);
	}

	const count = Math.max(2, Number(params?.ruler?.count) || 6);
	const span = state.max - state.min;
	const step = span / (count - 1);
	const values = [];

	for (let index = 0; index < count; index++) {
		const value = index === count - 1 ? state.max : state.min + (step * index);
		values.push(Number(value.toFixed(5)));
	}

	return values;
};

const createRulerSkin = (root, params, state, formatValue, toPositionPx) => {
	const values = buildRulerValues(params, state);
	const ruler = document.createElement('div');
	ruler.className = 'vg-range-slider__ruler';

	if (params?.ruler?.dimInactive === true) {
		root.classList.add(SKIN_CLASS_RULER_DIM);
	}

	const ticks = values.map((value) => {
		const item = document.createElement('span');
		item.className = 'vg-range-slider__ruler-item';
		item.style.left = `${toPositionPx(value)}px`;
		item.dataset.value = String(value);

		const mark = document.createElement('span');
		mark.className = 'vg-range-slider__ruler-mark';
		item.appendChild(mark);

		if (params?.ruler?.labels !== false) {
			const label = document.createElement('span');
			label.className = 'vg-range-slider__ruler-label';
			label.textContent = formatValue(value);
			item.appendChild(label);
		}

		ruler.appendChild(item);
		return item;
	});

	root.appendChild(ruler);

	return {
		type: 'ruler',
		root: ruler,
		ticks,
		values,
	};
};

const resolveStatusTone = (params, state, helpers) => {
	const value = resolveStatusSourceValue(params, state, helpers);
	return resolveStatusToneByValue(value, params, state);
};

const syncStatusClasses = (root, tone) => {
	root.classList.remove(...STATUS_CLASSES);

	if (tone === 'danger') {
		root.classList.add(STATUS_CLASS_DANGER);
		return;
	}

	if (tone === 'warning') {
		root.classList.add(STATUS_CLASS_WARNING);
		return;
	}

	root.classList.add(STATUS_CLASS_SUCCESS);
};

const resolveStatusLabel = (params, tone) => {
	if (!Array.isArray(params?.labelWords) || params.labelWords.length < 3) {
		return null;
	}

	if (tone === 'danger') {
		return params.labelWords[0] || null;
	}

	if (tone === 'warning') {
		return params.labelWords[1] || null;
	}

	return params.labelWords[2] || null;
};

const syncStatusLabels = (params, state, helpers) => {
	const labelFrom = helpers?.dom?.labelFrom;
	const labelTo = helpers?.dom?.labelTo;
	const fromLabel = resolveStatusLabel(params, resolveStatusToneByValue(state.from, params, state));
	const toLabel = resolveStatusLabel(params, resolveStatusToneByValue(state.to, params, state));

	if (labelFrom && fromLabel) {
		labelFrom.textContent = fromLabel;
	}

	if (labelTo && toLabel) {
		labelTo.textContent = toLabel;
	}
};

const applyRangeSliderSkin = (root, params, state, helpers) => {
	root.classList.add(SKIN_CLASS_DEFAULT);

	if (params.skin === 'ruler') {
		root.classList.add(SKIN_CLASS_RULER);
		return createRulerSkin(root, params, state, helpers.formatValue, helpers.toPositionPx);
	}

	if (params.skin === 'status') {
		root.classList.add(SKIN_CLASS_STATUS);
		syncStatusClasses(root, resolveStatusTone(params, state, helpers));

		return {
			type: 'status',
			root,
		};
	}

	if (params.skin !== 'default') {
		return null;
	}

	return null;
};

const syncRangeSliderSkin = (skin, state, helpers) => {
	if (!skin) {
		return;
	}

	if (skin.type === 'status') {
		syncStatusClasses(skin.root, resolveStatusTone(helpers.params, state, helpers));
		syncStatusLabels(helpers.params, state, helpers);
		return;
	}

	if (skin.type !== 'ruler') {
		return;
	}

	const isRange = state.from !== state.to || helpers.isRange;

	skin.ticks.forEach((tick, index) => {
		const value = skin.values[index];
		const isActive = isRange
			? value >= state.from && value <= state.to
			: value <= state.from;

		tick.classList.toggle('is-active', isActive);
	});
};

export {
	applyRangeSliderSkin,
	syncRangeSliderSkin,
};
