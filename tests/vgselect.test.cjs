const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html lang="ru"><body></body></html>', {url: 'http://localhost/'});
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'CustomEvent', 'Event', 'MouseEvent', 'MutationObserver']) {
	global[key] = key === 'window' ? dom.window : dom.window[key];
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.CSS = {escape: value => String(value)};
const loader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return loader(module, filename);
	module._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), {
		filename, presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
	}).code, filename);
};
const VGSelect = require('../app/modules/vgselect/js/vgselect').default;
Module._extensions['.js'] = loader;
const originalFetch = global.fetch;
const tick = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));
const create = (params = {}, options = '<option value="" selected hidden></option><option value="a">Alpha</option>') => {
	document.body.innerHTML = `<select class="vg-select" data-placeholder="Choose">${options}</select>`;
	const select = document.querySelector('select');
	VGSelect.init(select, params);
	const container = select.nextElementSibling;
	return {select, container, instance: VGSelect.getInstance(container)};
};
test.afterEach(() => {
	document.querySelectorAll('select').forEach(select => VGSelect.destroy(select));
	document.body.replaceChildren();
	global.fetch = originalFetch;
});

test('remote search retains load-more through rebuild and observer; pagination appends and finishes', async () => {
	const requests = [];
	global.fetch = async url => {
		requests.push(String(url));
		const page = Number(new URL(url).searchParams.get('page'));
		return {ok: true, json: async () => ({results: [{id: `c${page}`, text: `City ${page}`}], pagination: {current_page: page, total_pages: 2}})};
	};
	const {select, container, instance} = create({search: {remote: true, route: '/cities', pagination: true, perpage: 1}});
	container.querySelector('input').value = 'City';
	instance._fetchRemoteData('City');
	await tick(150);
	const more = container.querySelector('.vg-select-load-more');
	assert.ok(more);
	assert.equal(more.style.display, 'block');
	more.click();
	await tick(150);
	assert.equal(select.options.length, 3);
	assert.equal(container.querySelectorAll('.vg-select-load-more').length, 1);
	assert.equal(more.style.display, 'none');
	assert.equal(new URL(requests[1]).searchParams.get('per_page'), '1');
});

test('HTTP error keeps current options and emits error, then empty results recover', async () => {
	const {select, container, instance} = create({search: {remote: true, route: '/cities'}});
	let errors = 0;
	container.addEventListener('vg.select.error', () => errors++);
	global.fetch = async () => ({ok: false, status: 503, json: async () => ({message: 'Unavailable'})});
	container.querySelector('input').value = 'error';
	instance._fetchRemoteData('error');
	await tick();
	assert.equal(errors, 1);
	assert.equal(select.options.length, 2);
	global.fetch = async () => ({ok: true, json: async () => ({results: [], pagination: {current_page: 1, total_pages: 1}})});
	container.querySelector('input').value = 'empty';
	instance._fetchRemoteData('empty');
	await tick();
	assert.equal(select.options.length, 1);
	assert.equal(container.querySelector('.vg-select-loading'), null);
});

test('destroy disposes instance, clears marker and cancels pending debounce', async () => {
	let requests = 0;
	global.fetch = async () => { requests++; return {ok: true, json: async () => ({results: []})}; };
	const {select, container, instance} = create({search: {remote: true, route: '/cities', delay: 25}});
	const input = container.querySelector('input');
	input.value = 'city';
	input.dispatchEvent(new Event('input', {bubbles: true}));
	VGSelect.destroy(select);
	await tick(50);
	assert.equal(requests, 0);
	assert.equal(VGSelect.getInstance(container), null);
	assert.equal(instance._observer, null);
	assert.equal(select.hasAttribute('data-inited'), false);
	VGSelect.init(select);
	assert.equal(document.querySelectorAll('div.vg-select').length, 1);
});

test('shortened search cancels pending debounce', async () => {
	let requests = 0;
	global.fetch = async () => { requests++; return {ok: true, json: async () => ({results: []})}; };
	const {container} = create({search: {remote: true, route: '/cities', delay: 25, minterm: 2}});
	const input = container.querySelector('input');
	input.value = 'city';
	input.dispatchEvent(new Event('input'));
	input.value = '';
	input.dispatchEvent(new Event('input'));
	await tick(50);
	assert.equal(requests, 0);
});

test('programmatic selection and addOptions synchronize caption and selected rows', () => {
	const {select, container} = create();
	VGSelect.changeSelector(select, 'a');
	assert.equal(container.querySelector('.vg-select-list--option.selected').dataset.value, 'a');
	VGSelect.addOptions(select, [{id: 'b', text: 'Beta', selected: true}]);
	assert.equal(container.querySelector('.vg-select-current').textContent, 'Beta');
	assert.equal(container.querySelector('.vg-select-list--option.selected').dataset.value, 'b');
});

test('input-only search filters options and groups and restores them on clearing', () => {
	const {container} = create({search: {enabled: true}}, '<optgroup label="A"><option value="a">Alpha</option></optgroup><optgroup label="B"><option value="b">Beta</option></optgroup>');
	const input = container.querySelector('input');
	input.value = 'Alpha';
	input.dispatchEvent(new Event('input', {bubbles: true}));
	const beta = container.querySelector('[data-value="b"]');
	assert.equal(beta.style.display, 'none');
	assert.equal(beta.parentElement.style.display, 'none');
	input.value = '';
	input.dispatchEvent(new Event('input', {bubbles: true}));
	assert.equal(beta.style.display, '');
	assert.equal(beta.hidden, false);
	assert.equal(beta.parentElement.style.display, '');
});

test('empty multiple shows a visible placeholder after clearing the last tag', () => {
	const {select} = create();
	VGSelect.destroy(select);
	select.multiple = true;
	select.options[0].selected = false;
	select.options[1].selected = true;
	VGSelect.init(select);
	VGSelect.changeSelector(select, 'a', {selected: false});
	assert.equal(select.nextElementSibling.querySelector('.vg-select-current--placeholder').textContent, 'Choose');
});

test('stale pagination cannot append to a newer search', async () => {
	let resolvePage;
	const {select, container, instance} = create({search: {remote: true, route: '/cities', pagination: true}});
	global.fetch = () => new Promise(resolve => { resolvePage = resolve; });
	const pagination = instance._loadNextPage();
	global.fetch = async () => ({ok: true, json: async () => ({results: [{id: 'new', text: 'New'}], pagination: {current_page: 1, total_pages: 1}})});
	container.querySelector('input').value = 'new';
	instance._fetchRemoteData('new');
	await tick();
	resolvePage({ok: true, json: async () => ({results: [{id: 'old', text: 'Old'}], pagination: {current_page: 2, total_pages: 3}})});
	await pagination;
	assert.equal(select.querySelector('option[value="old"]'), null);
	assert.ok(select.querySelector('option[value="new"]'));
});

test('default placement opens upward near the bottom and downward near the top', () => {
	const {container, instance} = create();
	assert.equal(instance._params.position, 'auto');
	container.getBoundingClientRect = () => ({top: 650, bottom: 700, left: 0, right: 300});
	instance.show();
	assert.equal(container.classList.contains('drop-up'), true);
	container.getBoundingClientRect = () => ({top: 50, bottom: 100, left: 0, right: 300});
	window.dispatchEvent(new Event('resize'));
	assert.equal(container.classList.contains('drop-up'), false);
});

test('explicit position none keeps CSS-only placement', () => {
	const {container, instance} = create({position: 'none'});
	container.getBoundingClientRect = () => ({top: 650, bottom: 700, left: 0, right: 300});
	instance.show();
	assert.equal(container.classList.contains('drop-up'), false);
	assert.equal(container.style.getPropertyValue('--vg-select-list-max-height'), '');
});
