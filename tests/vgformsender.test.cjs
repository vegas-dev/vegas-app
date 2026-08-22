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

const VGFormSender = require('../app/modules/vgformsender/js/vgformsender').default;
Module._extensions['.js'] = originalJavaScriptLoader;

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('collapse response receives the base, layout and status classes required by public styles', () => {
	const form = document.createElement('form');
	form.innerHTML = '<button type="submit">Отправить</button>';
	document.body.append(form);

	const sender = new VGFormSender(form, {
		alert: {type: 'collapse', delay: 0}
	});

	sender._alertCollapse({title: 'Готово', message: 'Форма отправлена'}, 'success');

	const alert = form.querySelector('.vg-form-sender-alert-collapse');
	assert.ok(alert);
	assert.equal(alert.classList.contains('vg-form-sender-alert'), true);
	assert.equal(alert.classList.contains('vg-form-sender-alert-success'), true);
});
