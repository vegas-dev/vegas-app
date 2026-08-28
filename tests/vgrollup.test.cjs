const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html lang="ru"><body></body></html>', {url: 'http://localhost/'});
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'CustomEvent', 'Event', 'MouseEvent']) {
	global[key] = key === 'window' ? dom.window : dom.window[key];
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
const loader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return loader(module, filename);
	module._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), {
		filename, presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
	}).code, filename);
};
const VGRollup = require('../app/modules/vgrollup/js/vgrollup').default;
Module._extensions['.js'] = loader;

const instances = [];
const create = (params = {}, html = '<div id="rollup">Text</div>', height = 240) => {
	document.body.innerHTML = html;
	const element = document.querySelector('#rollup');
	Object.defineProperty(element, 'clientHeight', {get: () => element.style.height ? parseFloat(element.style.height) : height});
	VGRollup.init(element, {height: 80, ...params});
	const instance = VGRollup.getInstance(element);
	instances.push(instance);
	return {element, instance, button: document.querySelector('[data-vg-toggle="rollup"]')};
};
test.afterEach(() => {
	instances.splice(0).forEach(instance => instance.dispose());
	document.body.replaceChildren();
});

test('text Data API toggle synchronizes height, labels, aria and DOM events', () => {
	const {element, instance, button} = create({}, '<div id="rollup" data-height="60">Text</div>');
	assert.equal(element.style.height, '60px');
	let trigger;
	element.addEventListener('vg.rollup.show', event => { trigger = event.detail.relatedTarget; });
	button.click();
	assert.equal(instance.isShow(), true);
	assert.equal(button.getAttribute('aria-expanded'), 'true');
	assert.equal(trigger, button);
	assert.equal(element.style.height, '');
	button.click();
	assert.equal(instance.isShow(), false);
	assert.equal(button.getAttribute('aria-expanded'), 'false');
	assert.equal(element.style.height, '60px');
});

test('text invokes collapse callback instead of expand on closing', () => {
	const calls = [];
	const {element, button} = create({callbacks: {
		init: () => calls.push('init'), expand: () => calls.push('expand'), collapse: () => calls.push('collapse'),
	}});
	VGRollup.toggle(element, button);
	VGRollup.toggle(element, button);
	assert.deepEqual(calls, ['init', 'expand', 'collapse']);
});

test('expansion preserves consumer inline styles and CSS variables', () => {
	const {element, button} = create({}, '<div id="rollup" style="padding: 12px; --vg-rollup-fade-height: 32px">Text</div>');
	VGRollup.toggle(element, button);
	assert.equal(element.style.padding, '12px');
	assert.equal(element.style.getPropertyValue('--vg-rollup-fade-height'), '32px');
});

test('line clamp uses prefixed CSS and restores it after collapse', () => {
	const {element, button} = create({ellipsis: {line: 3}, fade: false});
	assert.equal(element.style.getPropertyValue('-webkit-line-clamp'), '3');
	button.click();
	assert.equal(element.style.getPropertyValue('-webkit-line-clamp'), '');
	button.click();
	assert.equal(element.style.getPropertyValue('-webkit-line-clamp'), '3');
});

test('data-lang overrides JS and document locale for generated labels', () => {
	const {button} = create({lang: 'en'}, '<div id="rollup" data-lang="ru">Text</div>');
	assert.equal(button.textContent.trim(), 'Показать');
});

test('elements mode counts hidden entries and init does not duplicate controls', () => {
	const {element, instance, button} = create({content: 'elements', elements: 'item', cnt: 2, number: true, fade: false},
		'<ul id="rollup"><li class="item">A</li><li class="item">B</li><li class="item">C</li><li class="item">D</li></ul>');
	assert.equal(element.querySelectorAll('.vg-rollup-display--none').length, 2);
	assert.match(button.textContent, /2/);
	VGRollup.init(element);
	assert.equal(VGRollup.getInstance(element), instance);
	assert.equal(document.querySelectorAll('[data-vg-toggle="rollup"]').length, 1);
	button.click();
	assert.equal(element.querySelectorAll('.vg-rollup-display--none').length, 0);
	button.click();
	assert.equal(element.querySelectorAll('.vg-rollup-display--none').length, 2);
});

test('short text and empty lists do not get unnecessary controls', () => {
	const {button} = create({height: 100}, '<div id="rollup">Short</div>', 20);
	assert.equal(button, null);
	const list = document.createElement('ul');
	document.body.append(list);
	VGRollup.init(list, {content: 'elements', elements: 'item', cnt: 3, fade: false});
	instances.push(VGRollup.getInstance(list));
	assert.equal(document.querySelector('[data-vg-toggle="rollup"]'), null);
});
