/**
 * Описание: регрессионные проверки VGToast.
 * Возможности: лимит стека, повторный показ и замена уведомлений.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
	url: 'http://localhost/module/toast/presentation',
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

const VGToast = require('../app/modules/vgtoast/js/vgtoast').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const wait = () => new Promise(resolve => setTimeout(resolve, 40));
const create = params => VGToast.run('Уведомление', {
  autohide: false, animation: {enable: false, delay: 0}, ...params,
});
test.afterEach(() => {
  document.querySelectorAll('.vg-toast').forEach(el => VGToast.getInstance(el)?.dispose());
  document.body.replaceChildren();
});

test('stack keeps exactly max items including after eviction finishes', async () => {
  for (let i = 0; i < 4; i++) create({stack: {enable: true, max: 3}});
  await wait();
  await wait();
  assert.equal(document.querySelectorAll('.vg-toast.shown').length, 3);
});

test('show on an already visible toast does not restart lifecycle', async () => {
  const toast = create();
  await wait();
  let shows = 0;
  toast._element.addEventListener('vg.toast.show', () => shows++);
  toast.show();
  assert.equal(shows, 0);
  assert.equal(toast._element.classList.contains('shown'), true);
});

test('disabled stack replaces previous non-stacking toast', async () => {
  create({stack: {enable: false}});
  const latest = create({stack: {enable: false}});
  await wait();
  await wait();
  assert.equal(document.querySelectorAll('.vg-toast.shown').length, 1);
  assert.equal(latest._element.classList.contains('shown'), true);
});
