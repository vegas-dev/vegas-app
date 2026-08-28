const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');

const originalLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return originalLoader(module, filename);
	const transformed = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
		filename, presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
	});
	module._compile(transformed.code, filename);
};
const {Responsive, DEFAULT_BREAKPOINTS} = require('../app/utils/js/components/responsive');
Module._extensions['.js'] = originalLoader;

const createWindow = (width = 1024, height = 900) => {
	const target = new EventTarget();
	target.innerWidth = width;
	target.innerHeight = height;
	target.navigator = {userAgent: '', platform: '', maxTouchPoints: 0};
	target.devicePixelRatio = 1;
	return target;
};
const resize = (target, width) => {
	target.innerWidth = width;
	target.dispatchEvent(new Event('resize'));
};

test('Responsive resolves zero, exact and fractional boundaries without overlapping ranges', () => {
	const target = createWindow(768);
	const responsive = new Responsive({window: target});
	assert.equal(responsive.breakpoint(0), 'xs');
	assert.equal(responsive.breakpoint('xs'), 0);
	assert.equal(responsive.getBreakpointKey(767.5), 'sm');
	assert.equal(responsive.getBreakpointKey(), 'md');
	assert.equal(responsive.breakpointDown('md'), false);
	assert.equal(responsive.breakpointUp('md'), true);
	assert.equal(responsive.breakpointBetween('sm', 'md'), false);
	assert.equal(responsive.breakpointBetween('md', 'lg'), true);
	assert.equal(responsive.breakpointBetween('lg', 'md'), false);
	assert.equal(responsive.breakpoint('unknown'), null);
	assert.equal(responsive.breakpoint(null), null);
	assert.equal(responsive.checkBreakpoint('constructor'), false);
	assert.equal(responsive.breakpointDown('unknown'), false);
	for (const width of [NaN, Infinity, -1, '768']) assert.equal(responsive.getBreakpointKey(width), null);
	assert.deepEqual(responsive.getActiveBreakpoints(1400), ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']);
});

test('Responsive merges defaults, global aliases/JSON and local overrides without shared mutation', () => {
	const target = createWindow(800);
	target.breakpoints = {md: 880};
	assert.equal(new Responsive({window: target}).breakpoint('md'), 880);
	target.Breakpoints = '{"md":"900","wide":1600}';
	const overrides = {md: 850};
	const responsive = new Responsive({window: target, breakpoints: overrides});
	assert.equal(responsive.breakpoint('sm'), 576);
	assert.equal(responsive.breakpoint('md'), 850);
	assert.equal(responsive.getBreakpointKey(1700), 'wide');
	assert.equal(new Responsive({window: target}).breakpoint('md'), 900);
	const copy = responsive.breakpoint();
	copy.md = 999;
	overrides.md = 999;
	assert.equal(responsive.breakpoints.md, 850);
	assert.equal(DEFAULT_BREAKPOINTS.md, 768);
	assert.equal(new Responsive({window: createWindow()}).breakpoint('md'), 768);
	// Глобальные настройки могут принадлежать другому window/realm.
	target.Breakpoints = require('node:vm').runInNewContext('({md: 910})');
	assert.equal(new Responsive({window: target}).breakpoint('md'), 910);
});

test('Responsive rejects invalid maps and preserves the base when resolving invalid profiles', () => {
	for (const breakpoints of [{xs: 1}, {md: 300}, {md: 992}, {md: -1}, {md: Infinity}, {md: ''}, {md: '768px'}, {md: true}, [], 'bad-json']) {
		const responsive = new Responsive({window: createWindow(), breakpoints});
		assert.equal(responsive.isValid(), false);
		assert.equal(responsive.getState().reason, 'invalid-breakpoints');
		assert.equal(responsive.getBreakpointKey(1024), null);
		assert.deepEqual(responsive.resolve({xs: {value: 2}}, {value: 1}), {value: 1});
		let called = false;
		responsive.subscribe(() => { called = true; }, {immediate: true})();
		assert.equal(called, false);
	}
});

test('Responsive resolve deeply inherits reached profiles, replaces arrays and isolates returned objects', () => {
	const responsive = new Responsive({window: createWindow()});
	const base = {pagination: {size: {enabled: true, label: 'Rows'}, options: [10, 20]}, feature: true};
	const profiles = {
		xs: {pagination: {maxButtons: 3, size: {enabled: false}}},
		md: {pagination: {maxButtons: 5, options: [30]}},
		lg: {pagination: {maxButtons: 7, size: {enabled: true}}},
	};
	const snapshot = JSON.stringify({base, profiles});
	const medium = responsive.resolve(profiles, base, 800);
	assert.deepEqual(medium, {pagination: {size: {enabled: false, label: 'Rows'}, options: [30], maxButtons: 5}, feature: true});
	medium.pagination.options.push(99);
	medium.pagination.size.label = 'Changed';
	assert.equal(responsive.resolve(profiles, base, 1024).pagination.size.enabled, true);
	assert.equal(responsive.resolve(profiles, base, 375).pagination.maxButtons, 3);
	assert.equal(JSON.stringify({base, profiles}), snapshot);
	const unsafe = JSON.parse('{"xs":{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}}');
	assert.deepEqual(responsive.resolve(unsafe), {});
	assert.equal({}.polluted, undefined);
});

test('Responsive shares one listener per instance and cleans subscriptions on unsubscribe/dispose', () => {
	const target = createWindow(375);
	let additions = 0;
	let removals = 0;
	const add = target.addEventListener.bind(target);
	const remove = target.removeEventListener.bind(target);
	target.addEventListener = (...args) => { additions += 1; add(...args); };
	target.removeEventListener = (...args) => { removals += 1; remove(...args); };
	const responsive = new Responsive({window: target});
	const first = [];
	const second = [];
	const stop = responsive.subscribe((state) => first.push(state), {immediate: true});
	responsive.subscribe((state) => second.push(state));
	assert.equal(additions, 1);
	assert.equal(first[0].previous, null);
	resize(target, 500);
	assert.equal(first.length, 1);
	assert.equal(responsive.getState().width, 500);
	resize(target, 768);
	assert.equal(first[1].previous, 'xs');
	assert.equal(second[0].breakpoint, 'md');
	stop();
	resize(target, 992);
	assert.equal(first.length, 2);
	assert.equal(second.length, 2);
	responsive.dispose();
	assert.equal(removals, 1);
	resize(target, 1200);
	assert.equal(second.length, 2);
});

test('Responsive releases the last subscription and isolates callback errors', () => {
	const target = createWindow(375);
	const errors = [];
	target.reportError = (error) => errors.push(error);
	const responsive = new Responsive({window: target});
	assert.throws(() => responsive.subscribe(null), TypeError);
	assert.throws(() => responsive.subscribe(() => { throw new Error('immediate'); }, {immediate: true}), /immediate/);
	const stopError = responsive.subscribe(() => { throw new Error('listener'); });
	const events = [];
	const stop = responsive.subscribe((state) => events.push(state));
	resize(target, 768);
	assert.equal(errors.length, 1);
	assert.equal(events.length, 1);
	stopError();
	stop();
	resize(target, 992);
	assert.equal(events.length, 1);
	assert.equal(errors.length, 1);
});

test('Responsive works without browser globals and separates touch capability from device heuristics', () => {
	const offline = new Responsive();
	assert.deepEqual(offline.viewport(), {width: 0, height: 0});
	assert.equal(offline.detectTouchDevice(), false);
	assert.equal(offline.detectDevice(), 'desktop');
	offline.dispose();
	const target = createWindow(1920, 1080);
	const responsive = new Responsive({window: target});
	assert.equal(responsive.detectTouchDevice(), false);
	target.navigator.maxTouchPoints = 1;
	assert.equal(responsive.detectTouchDevice(), true);
	// Touch не означает, что широкий экран — телефон.
	assert.equal(responsive.isMobileDevice(), false);
	target.navigator = {userAgent: 'Mozilla Macintosh', platform: 'MacIntel', maxTouchPoints: 5};
	assert.equal(responsive.isTabletDevice(), true);
	assert.equal(responsive.detectDevice(), 'tablet');
	target.navigator = {userAgent: 'iPhone', maxTouchPoints: 5};
	target.innerWidth = 390;
	target.innerHeight = 844;
	assert.equal(responsive.detectDevice(), 'mobile');
});
