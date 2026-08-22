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
global.KeyboardEvent = dom.window.KeyboardEvent;
global.getComputedStyle = dom.window.getComputedStyle;
global.requestAnimationFrame = callback => callback();

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

const VGNestable = require('../app/modules/vgnestable/js/vgnestable').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const createTree = (attributes = '') => {
	const host = document.createElement('div');
	host.innerHTML = `
		<div id="tree" class="vg-nestable" data-vg-toggle="nestable" ${attributes}>
			<ol class="vg-nestable-list">
				<li class="vg-nestable-item" data-id="1" data-label="Раздел">
					<div class="vg-nestable-inner"><div class="vg-nestable-handle"></div><div class="vg-nestable-content">Раздел</div></div>
					<ol class="vg-nestable-list">
						<li class="vg-nestable-item" data-id="11" data-enabled="true">Вложенный</li>
					</ol>
				</li>
				<li class="vg-nestable-item" data-id="2">Контакты</li>
			</ol>
		</div>`;
	document.body.append(host);
	return host.querySelector('#tree');
};

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('serializes nested ids and additional data attributes like Nestable', () => {
	const element = createTree();
	const instance = new VGNestable(element);

	assert.deepEqual(instance.serialize(), [
		{id: 1, label: 'Раздел', children: [{id: 11, enabled: true}]},
		{id: 2},
	]);
	instance.dispose();
});

test('serializedata=false preserves the legacy id-only payload', () => {
	const element = createTree();
	const instance = new VGNestable(element, {serializedata: false});

	assert.deepEqual(instance.serialize(), [
		{id: 1, children: [{id: 11}]},
		{id: 2},
	]);
	instance.dispose();
});

test('collapseAll and expandAll control every branch and emit public events', async () => {
	const element = createTree();
	const instance = new VGNestable(element);
	const childList = element.querySelector('.vg-nestable-item > .vg-nestable-list');
	let collapsed = 0;
	let expanded = 0;
	element.addEventListener('vg.nestable.collapse', () => { collapsed += 1; });
	element.addEventListener('vg.nestable.expand', () => { expanded += 1; });

	assert.equal(instance.collapseAll(), 1);
	assert.equal(childList.classList.contains('show'), false);
	assert.equal(collapsed, 1);
	await new Promise(resolve => setTimeout(resolve, 10));
	assert.equal(instance.expandAll(), 1);
	await new Promise(resolve => setTimeout(resolve, 10));
	assert.equal(childList.classList.contains('show'), true);
	assert.equal(expanded, 1);
	instance.dispose();
});

test('empty root renders an accessible drop target', () => {
	const element = document.createElement('div');
	element.className = 'vg-nestable';
	element.innerHTML = '<ol class="vg-nestable-list"></ol>';
	document.body.append(element);
	const instance = new VGNestable(element, {emptytext: 'Перетащите элементы сюда'});
	const empty = element.querySelector('.vg-nestable-empty');

	assert.ok(empty);
	assert.equal(empty.textContent, 'Перетащите элементы сюда');
	assert.equal(empty.parentElement.classList.contains('is-empty'), true);
	assert.deepEqual(instance.serialize(), []);
	instance.dispose();
});

test('Data API actions expand and collapse the targeted tree', () => {
	const element = createTree();
	const instance = new VGNestable(element);
	const collapse = document.createElement('button');
	collapse.setAttribute('data-vg-nestable-action', 'collapseAll');
	collapse.setAttribute('data-vg-target', '#tree');
	document.body.append(collapse);

	collapse.dispatchEvent(new Event('click', {bubbles: true, cancelable: true}));
	assert.equal(element.querySelector('.vg-nestable-item > .vg-nestable-list').classList.contains('show'), false);
	instance.dispose();
});

test('drag preview clones the whole branch and keeps a measured placeholder', () => {
	const element = createTree();
	const instance = new VGNestable(element);
	const item = element.querySelector('[data-id="1"]');
	item.getBoundingClientRect = () => ({left: 20, top: 40, width: 320, height: 126, right: 340, bottom: 166});
	instance._draggedItem = item;
	instance._mouse = {...instance._mouse, x: 48, y: 60, grabOffsetX: 28, grabOffsetY: 20};

	instance._startDrag();
	const preview = document.querySelector('.vg-nestable-drag-element');
	const placeholder = element.querySelector('.vg-nestable-placeholder');

	assert.ok(preview);
	assert.ok(preview.querySelector('.vg-nestable-list'));
	assert.equal(preview.style.width, '320px');
	assert.equal(placeholder.style.height, '126px');
	instance._cancelDrag();
	instance.dispose();
});

test('Escape restores the original position after keyboard movement', () => {
	const element = createTree();
	const instance = new VGNestable(element);
	const firstHandle = element.querySelector('[data-id="1"] > .vg-nestable-inner > .vg-nestable-handle');

	firstHandle.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}));
	firstHandle.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true, cancelable: true}));
	assert.deepEqual(instance.serialize().map(item => item.id), [2, 1]);
	firstHandle.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, cancelable: true}));
	assert.deepEqual(instance.serialize().map(item => item.id), [1, 2]);
	instance.dispose();
});

test('locks one item or a nested group while keeping the group parent movable', () => {
	const element = createTree();
	const lockedItem = element.querySelector('[data-id="1"]');
	const nestedList = lockedItem.querySelector(':scope > .vg-nestable-list');
	lockedItem.setAttribute('data-disabled', 'true');
	nestedList.setAttribute('data-disabled', 'true');
	const instance = new VGNestable(element);
	const parentHandle = lockedItem.querySelector(':scope > .vg-nestable-inner > .vg-nestable-handle');
	const childHandle = nestedList.querySelector('.vg-nestable-handle');

	assert.equal(parentHandle.getAttribute('aria-disabled'), 'true');
	assert.equal(childHandle.getAttribute('aria-disabled'), 'true');
	assert.equal(lockedItem.classList.contains('is-drag-disabled'), true);

	lockedItem.removeAttribute('data-disabled');
	instance.refresh();
	assert.equal(parentHandle.getAttribute('aria-disabled'), 'false');
	assert.equal(childHandle.getAttribute('aria-disabled'), 'true');
	instance.dispose();
});
