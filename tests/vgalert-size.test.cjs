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
global.MutationObserver = dom.window.MutationObserver;
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = callback => callback();
global.cancelAnimationFrame = () => {};

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

const VGAlert = require('../app/modules/vgalert/js/vgalert').default;
Module._extensions['.js'] = originalJavaScriptLoader;

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('compact size adds the public modifier to content and dropdown container', () => {
	const parent = document.createElement('div');
	const trigger = document.createElement('button');
	parent.append(trigger);
	document.body.append(parent);

	const alert = new VGAlert({
		size: 'compact',
		relatedTarget: trigger,
		render: {type: 'dropdown'}
	});
	const dropdown = alert._buildDropdown();

	assert.equal(dropdown.element.classList.contains('vg-alert-compact'), true);
	assert.equal(dropdown.element.querySelector('.vg-alert-wrapper').classList.contains('vg-alert-compact'), true);
});

test('sidebar overlay keeps its real parent renderer for dismiss', async (t) => {
	t.mock.method(window, 'getComputedStyle', element => global.getComputedStyle(element));
	const sidebar = document.createElement('aside');
	sidebar.className = 'vg-sidebar right';
	sidebar.setAttribute('data-backdrop', 'false');
	sidebar.setAttribute('data-overflow', 'false');
	const trigger = document.createElement('button');
	sidebar.append(trigger);
	document.body.append(sidebar);
	const alert = new VGAlert({relatedTarget: trigger, render: {type: 'overlay', dismiss: true}});
	const {element, render} = alert._buildOverlay();
	assert.equal(render.constructor.NAME, 'sidebar');
	assert.equal(element.parentElement, sidebar);
	element.remove();
	await new Promise(resolve => {
		sidebar.addEventListener('vg.sidebar.shown', resolve, {once: true});
		render.show();
	});
	const hidden = new Promise(resolve => sidebar.addEventListener('vg.sidebar.hidden', resolve, {once: true}));
	const result = VGAlert.call({relatedTarget: trigger, render: {type: 'overlay', dismiss: true}});
	sidebar.querySelector('[data-vg-alert-agree]').click();
	assert.equal((await result).accepted, true);
	await hidden;
	assert.equal(sidebar.classList.contains('show'), false);
	render.dispose();
});

test('modal overlay keeps its alert wrapper in the visible modal scroll area', () => {
	const modal = document.createElement('div');
	modal.className = 'vg-modal show';
	modal.innerHTML = '<div class="vg-modal-dialog"><div class="vg-modal-content"><div class="vg-modal-body"><button type="button">Open</button></div></div></div>';
	document.body.append(modal);
	const trigger = modal.querySelector('button');
	const alert = new VGAlert({relatedTarget: trigger, render: {type: 'overlay'}});
	const {element, render} = alert._buildOverlay();

	assert.equal(render.constructor.NAME, 'modal');
	assert.equal(element.classList.contains('vg-alert-overlay--modal'), true);
	assert.equal(element.parentElement, modal.querySelector('.vg-modal-content'));

	const styles = fs.readFileSync(path.join(__dirname, '../app/modules/vgalert/scss/vgalert.scss'), 'utf8');
	assert.match(styles, /&--modal\s*\{[\s\S]*?\.vg-alert-wrapper\s*\{\s*position: sticky;\s*top: calc\(var\(--vg-alert-overlay-wrapper-top\) \+ 1rem\);/);
	render.dispose();
});

test('unknown size falls back to the default alert markup', () => {
	const alert = new VGAlert({size: 'large'});
	const content = alert._buildContent();

	assert.equal(alert._params.size, 'default');
	assert.equal(content.classList.contains('vg-alert-compact'), false);
});
