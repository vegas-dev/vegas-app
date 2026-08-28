/**
 * Описание: адаптер общего Responsive для представления VGTable.
 * Возможности: отбор безопасных параметров пагинации и события таблицы; границы, наследование и подписки делегируются Responsive.
 */
import EventHandler from "../../../utils/js/dom/event";
import {Responsive} from "../../../utils/js/components/responsive";

const object = (value) => value && typeof value === 'object' && !Array.isArray(value);

// Только представление: page/per, callbacks, storage и параметры запросов не принимаются.
const paginationProfile = (value) => {
	const result = {};
	if (!object(value)) return result;
	if (value.maxButtons === null || (Number.isInteger(value.maxButtons) && value.maxButtons >= 3)) result.maxButtons = value.maxButtons;
	if (['left', 'center', 'right', 'between'].includes(value.align)) result.align = value.align;
	if (['top', 'bottom', 'both'].includes(value.position)) result.position = value.position;
	if (object(value.size)) {
		result.size = {};
		if (typeof value.size.enabled === 'boolean') result.size.enabled = value.size.enabled;
		if (value.size.label === false || typeof value.size.label === 'string') result.size.label = value.size.label;
	}
	if (object(value.quick) && [true, false, 'auto'].includes(value.quick.enabled)) result.quick = {enabled: value.quick.enabled};
	return result;
};

class _responsive {
	constructor(table, options, onChange) {
		this._table = table;
		this._onChange = onChange;
		this._responsive = new Responsive({breakpoints: options.breakpoints, window: table.ownerDocument.defaultView});
		this._profiles = Object.fromEntries(Object.keys(this._responsive.breakpoints).map((name) => [name, paginationProfile(options[name]?.pagination)]));
		this._breakpoint = null;
		this._pagination = {};
		this._width = 0;
		this._valid = this._responsive.isValid();
	}

	init() {
		if (!this._valid) {
			console.warn('VGTable: responsive.breakpoints must start at xs: 0 and increase through xxl.');
			return this;
		}
		this.refresh();
		this._responsive.subscribe(() => this.refresh());
		return this;
	}

	refresh(force = false) {
		if (!this._valid || !this._responsive) return this.getState();
		this._width = this._responsive.viewport().width;
		const breakpoint = this._responsive.getBreakpointKey(this._width);
		if (!force && breakpoint === this._breakpoint) return this.getState();
		const previous = this._breakpoint;
		this._breakpoint = breakpoint;
		this._pagination = this._responsive.resolve(this._profiles, {}, this._width);
		this._onChange();
		if (previous !== null && previous !== breakpoint) {
			EventHandler.trigger(this._table, 'responsivechange.vg.table', {...this.getState(), previous});
		}
		return this.getState();
	}

	getState() {
		return {
			breakpoint: this._breakpoint,
			width: this._responsive?.viewport().width ?? this._width,
			reason: this._valid ? null : 'invalid-breakpoints',
			pagination: {...this._pagination, size: {...this._pagination.size}, quick: {...this._pagination.quick}},
		};
	}

	dispose() {
		this._width = this._responsive?.viewport().width ?? this._width;
		this._responsive?.dispose();
		this._responsive = null;
	}
}

export default _responsive;
