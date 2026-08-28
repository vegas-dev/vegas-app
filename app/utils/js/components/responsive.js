/**
 * Описание: общий сервис брейкпоинтов и адаптивных настроек VGApp.
 * Возможности: xs–xxl, глобальные и локальные границы, наследование профилей, подписки, viewport и эвристики устройства/touch.
 */
import {normalizeData} from "../functions";

export const DEFAULT_BREAKPOINTS = Object.freeze({xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400});

const plainObject = (value) => {
	if (value === null || typeof value !== 'object') return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || Object.getPrototypeOf(prototype) === null;
};
const entries = (value) => Object.entries(value).filter(([key]) => !['__proto__', 'constructor', 'prototype'].includes(key));
const clone = (value) => Array.isArray(value) ? value.map(clone)
	: plainObject(value) ? Object.fromEntries(entries(value).map(([key, item]) => [key, clone(item)])) : value;

// В профилях массив заменяется целиком, а не конкатенируется как в mergeDeepObject.
const merge = (base, profile) => {
	const result = plainObject(base) ? clone(base) : {};
	if (plainObject(profile)) entries(profile).forEach(([key, value]) => {
		result[key] = plainObject(value) ? merge(result[key], value) : clone(value);
	});
	return result;
};

export class Responsive {
	constructor(options = {}) {
		this._window = options.window === undefined ? (typeof window === 'undefined' ? null : window) : options.window;
		const globalPoints = this._window?.Breakpoints ?? this._window?.breakpoints;
		const globalMap = normalizeData(globalPoints ?? {});
		const localMap = normalizeData(options.breakpoints ?? {});
		const sourcesValid = plainObject(globalMap) && plainObject(localMap);
		const combined = {...DEFAULT_BREAKPOINTS, ...(plainObject(globalMap) ? globalMap : {}), ...(plainObject(localMap) ? localMap : {})};
		this._breakpoints = Object.freeze(Object.fromEntries(entries(combined).map(([key, value]) => [key,
			typeof value === 'string' && value.trim() !== '' ? Number(value) : value,
		])));
		const standardNames = Object.keys(DEFAULT_BREAKPOINTS);
		const widths = Object.values(this._breakpoints);
		this._valid = sourcesValid && widths.every((width) => Number.isFinite(width) && width >= 0)
			&& new Set(widths).size === widths.length
			&& standardNames.every((name, index) => index === 0 ? this._breakpoints[name] === 0
				: this._breakpoints[name] > this._breakpoints[standardNames[index - 1]]);
		this._keys = this._valid ? Object.keys(this._breakpoints).sort((a, b) => this._breakpoints[a] - this._breakpoints[b]) : [];
		this._subscribers = new Set();
		this._previous = null;
		this._boundResize = () => {
			const state = this.getState();
			if (state.breakpoint === this._previous) return;
			const previous = this._previous;
			this._previous = state.breakpoint;
			Array.from(this._subscribers).forEach((subscriber) => {
				if (!this._subscribers.has(subscriber)) return;
				try { subscriber({...this.getState(), previous}); }
				catch (error) {
					if (typeof this._window?.reportError === 'function') this._window.reportError(error);
					else console.error(error);
				}
			});
		};
	}

	/** Копия границ; внешнее изменение не влияет на экземпляр. */
	get breakpoints() { return {...this._breakpoints}; }
	isValid() { return this._valid; }

	/** Без аргумента — карта; имя — min-width; число (включая 0) — имя диапазона. */
	breakpoint(point) {
		if (point === undefined) return this.breakpoints;
		if (typeof point === 'number') return this.getBreakpointKey(point);
		return this.checkBreakpoint(point) ? this._breakpoints[point] : null;
	}

	checkBreakpoint(point) {
		return this._valid && typeof point === 'string' && Object.prototype.hasOwnProperty.call(this._breakpoints, point);
	}

	breakpointDown(point) { return this.checkBreakpoint(point) && this.viewport().width < this._breakpoints[point]; }
	breakpointUp(point) { return this.checkBreakpoint(point) && this.viewport().width >= this._breakpoints[point]; }

	/** Полуоткрытый диапазон [start, end), без пересечения соседних диапазонов. */
	breakpointBetween(start, end) {
		const width = this.viewport().width;
		return this.checkBreakpoint(start) && this.checkBreakpoint(end)
			&& this._breakpoints[start] < this._breakpoints[end]
			&& width >= this._breakpoints[start] && width < this._breakpoints[end];
	}

	getActiveBreakpoints(width = this.viewport().width) {
		if (!this._valid || !Number.isFinite(width) || width < 0) return [];
		return this._keys.filter((key) => width >= this._breakpoints[key]);
	}

	getBreakpointKey(width = this.viewport().width) { return this.getActiveBreakpoints(width).at(-1) ?? null; }

	/** База + все достигнутые профили; вложенные объекты объединяются, массивы заменяются. */
	resolve(profiles = {}, base = {}, width = this.viewport().width) {
		return this.getActiveBreakpoints(width).reduce((result, key) => merge(result, profiles?.[key]), merge({}, base));
	}

	getState() {
		const viewport = this.viewport();
		return {...viewport, breakpoint: this.getBreakpointKey(viewport.width), active: this.getActiveBreakpoints(viewport.width),
			reason: this._valid ? null : 'invalid-breakpoints'};
	}

	/** Уведомляет только о смене диапазона; возвращает функцию отписки. */
	subscribe(callback, {immediate = false} = {}) {
		if (typeof callback !== 'function') throw new TypeError('Responsive.subscribe expects a function.');
		if (!this._valid) return () => {};
		const subscriber = (state) => callback(state);
		if (this._subscribers.size === 0) {
			this._previous = this.getBreakpointKey();
			this._window?.addEventListener('resize', this._boundResize);
		}
		this._subscribers.add(subscriber);
		const unsubscribe = () => {
			this._subscribers.delete(subscriber);
			if (this._subscribers.size === 0) this._window?.removeEventListener('resize', this._boundResize);
		};
		if (immediate) {
			try { callback({...this.getState(), previous: null}); }
			catch (error) { unsubscribe(); throw error; }
		}
		return unsubscribe;
	}

	dispose() {
		this._window?.removeEventListener('resize', this._boundResize);
		this._subscribers.clear();
	}

	viewport() {
		return {width: this._window?.innerWidth ?? 0, height: this._window?.innerHeight ?? 0};
	}

	/** Возможность touch-ввода, не классификация телефона или планшета. */
	detectTouchDevice() {
		return !!this._window && (Number(this._window.navigator?.maxTouchPoints) > 0 || 'ontouchstart' in this._window);
	}

	/** Эвристики устройства не используются при выборе responsive-профилей. */
	isMobileDevice() {
		if (!this._window) return false;
		const userAgent = this._window.navigator?.userAgent || '';
		return /Android|iPhone|iPad|iPod/i.test(userAgent)
			|| (this.detectTouchDevice() && this.viewport().width < 768 && this._window.devicePixelRatio >= 2);
	}

	isTabletDevice() {
		if (!this._window) return false;
		const navigator = this._window.navigator || {};
		const userAgent = (navigator.userAgent || '').toLowerCase();
		const {width, height} = this.viewport();
		const short = Math.min(width, height);
		const long = Math.max(width, height);
		return /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
			|| (/android/.test(userAgent) && !/mobile/.test(userAgent) && long > 800)
			|| (this.detectTouchDevice() && short >= 600 && short <= 1200 && long >= 800 && long <= 1600);
	}

	detectDevice() {
		return this.isTabletDevice() ? 'tablet' : this.isMobileDevice() ? 'mobile' : 'desktop';
	}
}
