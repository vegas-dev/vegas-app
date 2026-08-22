const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html lang="ru"><body></body></html>', {url: 'http://localhost/'});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;
global.requestAnimationFrame = callback => callback();

const observed = [];
global.IntersectionObserver = class {
	observe(element) { observed.push(element); }
	disconnect() {}
};

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return originalJavaScriptLoader(module, filename);

	const source = fs.readFileSync(filename, 'utf8');
	const transformed = babel.transformSync(source, {
		filename,
		presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
		sourceMaps: 'inline',
	});
	module._compile(transformed.code, filename);
};

const VGLoadMore = require('../app/modules/vgloadmore/js/vgloadmore').default;
Module._extensions['.js'] = originalJavaScriptLoader;

test.beforeEach(() => {
	document.body.replaceChildren();
	observed.length = 0;
});

test('static container loads batches, emits loaded and hides the generated trigger at the end', () => {
	const container = document.createElement('div');
	container.id = 'static-list';
	container.innerHTML = Array.from({length: 4}, (_, index) => `<div class="item">${index + 1}</div>`).join('');
	document.body.append(container);

	new VGLoadMore(container, {
		limit: 2,
		elements: 'item',
		button: {classes: ['btn']},
	});

	const trigger = container.nextElementSibling;
	assert.ok(trigger);
	assert.deepEqual(Array.from(container.children, item => item.classList.contains('show')), [true, true, false, false]);

	let loadedDetail = null;
	trigger.addEventListener('vg.loadmore.loaded', event => { loadedDetail = event.detail; });
	VGLoadMore.getOrCreateInstance(trigger).toggle();

	assert.deepEqual(Array.from(container.children, item => item.classList.contains('show')), [true, true, true, true]);
	assert.equal(trigger.classList.contains('vg-collapse'), true);
	assert.equal(trigger.getAttribute('aria-hidden'), 'true');
	assert.equal(loadedDetail.data.remaining, 0);
});

test('scroll mode observes the last visible item inside its own container', () => {
	const container = document.createElement('div');
	container.innerHTML = '<div class="item">1</div><div class="item">2</div><div class="item">3</div>';
	document.body.append(container);

	new VGLoadMore(container, {limit: 2, elements: 'item', mode: 'scroll'});

	assert.equal(observed.length, 1);
	assert.equal(observed[0], container.children[1]);
});

test('AJAX GET sends limit, offset and custom data and restores the trigger after an error', async () => {
	const target = document.createElement('div');
	target.id = 'ajax-target';
	const trigger = document.createElement('button');
	trigger.textContent = 'Загрузить ещё';
	document.body.append(target, trigger);

	const calls = [];
	global.fetch = async (url) => {
		calls.push(new URL(url));
		throw new Error('Expected demo failure');
	};

	const instance = new VGLoadMore(trigger, {
		limit: 3,
		offset: 6,
		ajax: {route: '/api/items', target: '#ajax-target', data: {category: 'news'}},
	});
	instance.toggle();
	await new Promise(resolve => setTimeout(resolve, 20));

	assert.equal(calls[0].searchParams.get('limit'), '3');
	assert.equal(calls[0].searchParams.get('offset'), '6');
	assert.equal(calls[0].searchParams.get('category'), 'news');
	assert.equal(trigger.disabled, false);
	assert.equal(trigger.textContent, 'Загрузить еще');
});
