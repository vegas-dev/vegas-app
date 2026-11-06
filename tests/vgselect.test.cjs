/**
 * Описание: регрессионные проверки VGSelect в DOM.
 * Возможности: поиск, сохранение выбора, AJAX-пагинация, теги, синхронизация и позиционирование.
 */
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

test('height limits the list by default and supports a numeric Data API override', () => {
	const defaultSelect = create();
	assert.equal(defaultSelect.instance._params.height, true);
	assert.equal(defaultSelect.container.style.getPropertyValue('--vg-select-list-max-height'), '');

	VGSelect.destroy(defaultSelect.select);
	defaultSelect.select.remove();
	document.body.innerHTML = '<select class="vg-select" data-height="420"><option value="a">Alpha</option></select>';
	const select = document.querySelector('select');
	VGSelect.init(select);
	const container = select.nextElementSibling;
	assert.equal(VGSelect.getInstance(container)._params.height, 420);
	assert.equal(container.style.getPropertyValue('--vg-select-list-max-height'), '420px');
});

test('height false removes the list limit', () => {
	const {container, instance} = create({height: false});
	assert.equal(container.style.getPropertyValue('--vg-select-list-max-height'), 'none');
	container.getBoundingClientRect = () => ({top: 50, bottom: 100, left: 0, right: 300});
	instance.show();
	assert.equal(container.style.getPropertyValue('--vg-select-list-max-height'), 'none');
});

test('automatic placement only reduces the configured height to available space', () => {
	const {container, instance} = create({height: 500});
	container.getBoundingClientRect = () => ({top: 300, bottom: 400, left: 0, right: 300});
	instance.show();
	assert.equal(container.style.getPropertyValue('--vg-select-list-max-height'), '356px');
	instance.hide();
	assert.equal(container.style.getPropertyValue('--vg-select-list-max-height'), '500px');
});

const createMultipleRemote = (options = '<option value="a" selected>Alpha</option>') => {
	const fixture = create({search: {remote: true, route: '/projects', pagination: true}}, options);
	VGSelect.destroy(fixture.select);
	fixture.select.multiple = true;
	VGSelect.init(fixture.select, {search: {remote: true, route: '/projects', pagination: true}});
	const container = fixture.select.nextElementSibling;
	return {select: fixture.select, container, instance: VGSelect.getInstance(container)};
};
const searchRemote = async (fixture, term, results) => {
	global.fetch = async () => ({ok: true, json: async () => ({results})});
	fixture.container.querySelector('.vg-select-search input').value = term;
	fixture.instance._fetchRemoteData(term);
	await tick();
};
const selectedValues = select => [...select.selectedOptions].map(option => option.value);

test('open remote multiple keeps its query and results after DOM updates and can load more', async () => {
	const {select, container} = createMultipleRemote();
	const toggle = container.querySelector('.vg-select-current');
	let opens = 0;
	container.addEventListener('vg.select.show', () => opens++);
	global.fetch = async url => {
		const page = Number(new URL(url).searchParams.get('page'));
		return {ok: true, json: async () => ({
			results: [{id: `b${page}`, text: `Beta ${page}`}],
			pagination: {current_page: page, total_pages: 2},
		})};
	};
	toggle.click();
	const input = container.querySelector('.vg-select-search input');
	const rebuilt = new Promise(resolve => container.addEventListener('vg.select.rebuild', resolve, {once: true}));
	input.value = 'Beta';
	input.dispatchEvent(new Event('input', {bubbles: true}));
	await rebuilt;
	await tick(150);

	assert.equal(input.value, 'Beta');
	assert.equal(document.activeElement, input);
	assert.equal(toggle.getAttribute('aria-expanded'), 'true');
	const firstResult = container.querySelector('.vg-select-list--option[data-value="b1"]');
	assert.equal(firstResult?.hidden, false);
	firstResult.click();
	assert.deepEqual(selectedValues(select), ['a', 'b1']);
	assert.equal(firstResult.hidden, true);

	const more = container.querySelector('.vg-select-load-more');
	assert.equal(more?.style.display, 'block');
	more.click();
	await tick(150);
	assert.equal(container.querySelector('.vg-select-list--option[data-value="b2"]')?.hidden, false);
	assert.equal(more.style.display, 'none');
	assert.equal(opens, 1);

	toggle.click();
	await tick(75);
	toggle.click();
	assert.equal(input.value, '');
	assert.equal(container.querySelectorAll('.vg-select-list--option').length, 0);
	assert.deepEqual(selectedValues(select), ['a', 'b1']);
});

test('a remote response does not reopen a multiple select closed during loading', async () => {
	const {container} = createMultipleRemote();
	const toggle = container.querySelector('.vg-select-current');
	let resolveRequest;
	const requested = new Promise(resolve => {
		global.fetch = () => new Promise(finish => {
			resolveRequest = finish;
			resolve();
		});
	});
	toggle.click();
	const input = container.querySelector('.vg-select-search input');
	input.value = 'Beta';
	input.dispatchEvent(new Event('input', {bubbles: true}));
	await requested;
	toggle.click();
	await tick(75);
	resolveRequest({ok: true, json: async () => ({results: [{id: 'b', text: 'Beta'}]})});
	await tick(150);

	assert.equal(toggle.getAttribute('aria-expanded'), 'false');
	assert.equal(container.classList.contains('show'), false);
	assert.equal(container.classList.contains('active'), false);
});

test('multiple remote searches keep earlier selections and submit every selected value', async () => {
	const fixture = createMultipleRemote();
	await searchRemote(fixture, 'Beta', [{id: 'b', text: 'Beta'}]);
	fixture.container.querySelector('.vg-select-list--option[data-value="b"]').click();
	await searchRemote(fixture, 'Gamma', [{id: 'c', text: 'Gamma'}]);
	fixture.container.querySelector('.vg-select-list--option[data-value="c"]').click();

	assert.deepEqual(selectedValues(fixture.select), ['a', 'b', 'c']);
	assert.equal(fixture.container.querySelectorAll('.vg-select-tag').length, 3);
	const form = document.createElement('form');
	fixture.select.name = 'projects[]';
	document.body.append(form);
	form.append(fixture.select, fixture.container);
	assert.deepEqual(new window.FormData(form).getAll('projects[]'), ['a', 'b', 'c']);
});

test('empty remote results retain chosen options and discard unselected results', async () => {
	const fixture = createMultipleRemote('<optgroup label="Projects"><option value="a" selected>Alpha</option><option value="b">Beta</option></optgroup>');
	await searchRemote(fixture, 'missing', []);

	assert.deepEqual(selectedValues(fixture.select), ['a']);
	assert.equal(fixture.select.querySelector('option[value="b"]'), null);
	assert.equal(fixture.container.querySelectorAll('.vg-select-tag').length, 1);
});

test('repeated remote results and pagination keep one option per value and preserve selection', async () => {
	const fixture = createMultipleRemote();
	await searchRemote(fixture, 'Alpha', [{id: 'a', text: 'Alpha'}, {id: 'b', text: 'Beta'}]);
	global.fetch = async () => ({ok: true, json: async () => ({results: [{id: 'a', text: 'Alpha'}, {id: 'b', text: 'Beta'}, {id: 'c', text: 'Gamma'}]})});
	await fixture.instance._loadNextPage();

	assert.deepEqual([...fixture.select.options].map(option => option.value), ['a', 'b', 'c']);
	assert.deepEqual(selectedValues(fixture.select), ['a']);
	assert.equal(fixture.container.querySelectorAll('.vg-select-tag').length, 1);
});

test('removing a retained tag stays removed after subsequent searches', async () => {
	const fixture = createMultipleRemote();
	await searchRemote(fixture, 'Beta', [{id: 'b', text: 'Beta'}]);
	fixture.container.querySelector('.vg-select-tag-remove[data-value="a"]').dispatchEvent(new MouseEvent('click', {bubbles: true}));
	await searchRemote(fixture, 'Gamma', [{id: 'c', text: 'Gamma'}]);

	assert.deepEqual(selectedValues(fixture.select), []);
	assert.equal(fixture.select.querySelector('option[value="a"]'), null);
	assert.equal(fixture.container.querySelectorAll('.vg-select-tag').length, 0);
});

test('single remote search keeps the current value until another option is chosen', async () => {
	const fixture = create({search: {remote: true, route: '/projects'}}, '<option value="a" selected>Alpha</option>');
	await searchRemote(fixture, 'Beta', [{id: 'b', text: 'Beta'}]);

	assert.equal(fixture.select.value, 'a');
	assert.equal(fixture.container.querySelector('.vg-select-current').textContent, 'Alpha');
	fixture.container.querySelector('.vg-select-list--option[data-value="b"]').click();
	assert.equal(fixture.select.value, 'b');
});

test('preserved additions deduplicate numeric ids including zero and honor explicit selection', () => {
	const fixture = createMultipleRemote('<option value="0">Zero</option>');
	VGSelect.addOptions(fixture.select, [{id: 0, text: 'Zero', selected: true}, {id: 1, text: 'One'}, {id: '1', text: 'One'}], {preserve: true});

	assert.deepEqual([...fixture.select.options].map(option => option.value), ['0', '1']);
	assert.deepEqual(selectedValues(fixture.select), ['0']);
});

test('remote response preserves the live selection changed while its request is pending', async () => {
	const fixture = createMultipleRemote('<option value="a" selected>Alpha</option><option value="b">Beta</option>');
	let resolveRequest;
	global.fetch = () => new Promise(resolve => { resolveRequest = resolve; });
	fixture.container.querySelector('.vg-select-search input').value = 'Gamma';
	fixture.instance._fetchRemoteData('Gamma');
	VGSelect.changeSelector(fixture.select, 'a', {selected: false});
	VGSelect.changeSelector(fixture.select, 'b');
	resolveRequest({ok: true, json: async () => ({results: [{id: 'c', text: 'Gamma'}]})});
	await tick();

	assert.deepEqual(selectedValues(fixture.select), ['b']);
	assert.equal(fixture.select.querySelector('option[value="a"]'), null);
});

test('grouped remote results reuse retained options without creating empty duplicate groups', async () => {
	const fixture = createMultipleRemote('<optgroup label="Projects"><option value="a" selected>Alpha</option></optgroup>');
	await searchRemote(fixture, 'Alpha', [{text: 'Projects', children: [{id: 'a', text: 'Alpha'}]}]);

	assert.deepEqual(selectedValues(fixture.select), ['a']);
	assert.equal(fixture.select.options.length, 1);
	assert.equal(fixture.select.querySelectorAll('optgroup').length, 1);
});
