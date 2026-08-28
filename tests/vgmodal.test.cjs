const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
	url: 'http://localhost/module/modal/interaction',
});

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
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;
global.history = dom.window.history;

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) {
		return originalJavaScriptLoader(module, filename);
	}

	const source = fs.readFileSync(filename, 'utf8');
	const transformed = babel.transformSync(source, {
		filename,
		presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
		sourceMaps: 'inline',
	});

	module._compile(transformed.code, filename);
};

const VGModal = require('../app/modules/vgmodal/js/vgmodal').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const waitForTimers = (delay = 25) => new Promise(resolve => setTimeout(resolve, delay));

const createModal = (params = {}) => {
	const element = document.createElement('div');
	element.className = 'vg-modal';
	element.id = 'modal-under-test';
	element.innerHTML = `
		<div class="vg-modal-dialog">
			<div class="vg-modal-content">
				<button class="vg-btn-close" type="button" data-vg-dismiss="modal"></button>
				<div class="vg-modal-header"><h2 class="vg-modal-title">Чат поддержки</h2></div>
				<div class="vg-modal-body">Содержимое</div>
			</div>
		</div>`;
	document.body.append(element);

	return {
		element,
		instance: new VGModal(element, {
			animation: {enable: false},
			backdrop: false,
			...params,
		}),
	};
};

test.beforeEach(() => {
	document.body.replaceChildren();
	document.body.className = '';
	window.localStorage.clear();
});

test('opening and closing synchronize initially hidden modal accessibility', async () => {
	const {element, instance} = createModal({animation: {enable: false, delay: 0}});
	element.setAttribute('aria-hidden', 'true');
	instance.show();
	await waitForTimers();
	assert.equal(element.hasAttribute('aria-hidden'), false);
	instance.hide();
	await waitForTimers();
	assert.equal(element.getAttribute('aria-hidden'), 'true');
	instance.show();
	await waitForTimers();
	assert.equal(element.hasAttribute('aria-hidden'), false);
	instance.dispose();
});

test('generated minimize control collapses and restores an open modal', async () => {
	const {element, instance} = createModal({
		minimize: {
			enable: true,
			title: 'Чат поддержки',
			text: 'Оператор на связи',
		},
	});

	instance.show();
	await waitForTimers();
	element.querySelector('.vg-btn-minimize').dispatchEvent(new dom.window.MouseEvent('click', {
		bubbles: true,
		button: 0,
	}));
	await waitForTimers();

	assert.equal(element.classList.contains('vg-modal-minimized-state'), true);
	assert.equal(element.style.display, 'none');
	assert.equal(document.querySelector('.vg-modal-minimized__title').textContent, 'Чат поддержки');
	assert.equal(document.querySelector('.vg-modal-minimized__text').textContent, 'Оператор на связи');

	document.querySelector('.vg-modal-minimized').click();
	await waitForTimers();

	assert.equal(element.classList.contains('show'), true);
	assert.equal(element.classList.contains('vg-modal-minimized-state'), false);
	assert.equal(document.querySelector('.vg-modal-minimized'), null);

	instance.dispose();
});

test('closing an interactive modal stores its geometry under the configured key', async () => {
	const {element, instance} = createModal({
		drag: {enable: true},
		resize: {enable: true},
		state: {enable: true, key: 'vg-modal-test.geometry'},
	});
	const dialog = element.querySelector('.vg-modal-dialog');

	instance.show();
	await waitForTimers();
	dialog.style.position = 'fixed';
	dialog.style.left = '120px';
	dialog.style.top = '80px';
	dialog.style.width = '640px';
	dialog.style.height = '360px';
	dialog.style.transform = 'none';
	instance.hide();
	await waitForTimers();

	const storedState = JSON.parse(window.localStorage.getItem('vg-modal-test.geometry'));
	assert.equal(storedState.dialog.left, '120px');
	assert.equal(storedState.dialog.top, '80px');
	assert.equal(storedState.dialog.width, '640px');
	assert.equal(storedState.dialog.height, '360px');

	instance.dispose();
});
