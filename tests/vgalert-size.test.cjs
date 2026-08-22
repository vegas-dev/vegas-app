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

test('unknown size falls back to the default alert markup', () => {
	const alert = new VGAlert({size: 'large'});
	const content = alert._buildContent();

	assert.equal(alert._params.size, 'default');
	assert.equal(content.classList.contains('vg-alert-compact'), false);
});
