const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;

Object.defineProperty(document.documentElement, 'clientWidth', {value: 1024, configurable: true});
Object.defineProperty(document.documentElement, 'clientHeight', {value: 768, configurable: true});

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return originalJavaScriptLoader(module, filename);
	const source = fs.readFileSync(filename, 'utf8');
	const transformed = babel.transformSync(source, {
		filename,
		presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
		sourceMaps: 'inline'
	});
	module._compile(transformed.code, filename);
};

const VGDropdown = require('../app/modules/vgdropdown/js/vgdropdown').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const rect = (left, top, width, height) => ({
	left,
	top,
	right: left + width,
	bottom: top + height,
	width,
	height,
	x: left,
	y: top,
	toJSON() { return this; },
});

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('initAll discovers Data API toggles and does not bind click twice', () => {
	const root = document.createElement('div');
	root.className = 'vg-dropdown';
	root.innerHTML = `
		<button type="button" data-vg-toggle="dropdown" aria-expanded="false">Открыть</button>
		<div class="vg-dropdown-content"><div class="vg-dropdown-container">Список</div></div>`;
	document.body.append(root);

	const [firstInstance] = VGDropdown.initAll();
	const [secondInstance] = VGDropdown.initAll();
	const toggle = root.querySelector('[data-vg-toggle="dropdown"]');

	assert.equal(firstInstance, secondInstance);
	toggle.dispatchEvent(new Event('click', {bubbles: true, cancelable: true}));
	assert.equal(toggle.classList.contains('show'), true);
	assert.equal(toggle.getAttribute('aria-expanded'), 'true');

	firstInstance.dispose();
});

test('auto placement flips above inside the nearest overflow parent', () => {
	const wrapper = document.createElement('div');
	wrapper.style.overflow = 'auto';
	wrapper.innerHTML = `
		<div class="vg-dropdown">
			<button type="button" data-vg-toggle="dropdown">Открыть</button>
			<div class="vg-dropdown-content"><div class="vg-dropdown-container">Список</div></div>
		</div>`;
	document.body.append(wrapper);
	const toggle = wrapper.querySelector('[data-vg-toggle="dropdown"]');
	const drop = wrapper.querySelector('.vg-dropdown-content');
	wrapper.getBoundingClientRect = () => rect(0, 0, 300, 200);
	toggle.getBoundingClientRect = () => rect(10, 160, 100, 20);
	drop.getBoundingClientRect = () => rect(0, 0, 150, 80);

	const instance = VGDropdown.init(toggle, {placement: 'auto'});
	instance.show();

	assert.equal(drop.getAttribute('data-vg-placement'), 'top-start');
	instance.dispose();
});

test('auto placement prefers bottom-end near the right boundary', () => {
	const wrapper = document.createElement('div');
	wrapper.style.overflow = 'auto';
	wrapper.innerHTML = `
		<div class="vg-dropdown">
			<button type="button" data-vg-toggle="dropdown">Открыть</button>
			<div class="vg-dropdown-content"><div class="vg-dropdown-container">Список</div></div>
		</div>`;
	document.body.append(wrapper);
	const toggle = wrapper.querySelector('[data-vg-toggle="dropdown"]');
	const drop = wrapper.querySelector('.vg-dropdown-content');
	wrapper.getBoundingClientRect = () => rect(0, 0, 300, 300);
	toggle.getBoundingClientRect = () => rect(250, 50, 40, 20);
	drop.getBoundingClientRect = () => rect(0, 0, 150, 80);

	const instance = VGDropdown.init(toggle, {placement: 'auto'});
	instance.show();

	assert.equal(drop.getAttribute('data-vg-placement'), 'bottom-end');
	instance.dispose();
});

test('click outside closes an initialized dropdown', () => {
	const root = document.createElement('div');
	root.className = 'vg-dropdown';
	root.innerHTML = `
		<button type="button" data-vg-toggle="dropdown">Открыть</button>
		<div class="vg-dropdown-content"><div class="vg-dropdown-container">Список</div></div>`;
	document.body.append(root);
	const toggle = root.querySelector('[data-vg-toggle="dropdown"]');
	const instance = VGDropdown.init(toggle, {placement: 'auto'});

	instance.show();
	assert.equal(toggle.classList.contains('show'), true);
	document.body.dispatchEvent(new Event('click', {bubbles: true}));
	assert.equal(toggle.classList.contains('show'), false);

	instance.dispose();
});
