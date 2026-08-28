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

const VGTable = require('../app/modules/vgtable/js/vgtable').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const jsonResponse = payload => ({
	ok: true,
	status: 200,
	statusText: 'OK',
	headers: {get: name => name.toLowerCase() === 'content-type' ? 'application/json' : ''},
	json: async () => payload,
	text: async () => JSON.stringify(payload),
});

const nextEvent = (target, name) => new Promise((resolve, reject) => {
	const timeout = setTimeout(() => reject(new Error(`Timed out waiting for ${name}`)), 1000);
	target.addEventListener(name, event => {
		clearTimeout(timeout);
		resolve(event);
	}, {once: true});
});

const createRemoteTable = attributes => {
	const host = document.createElement('div');
	host.innerHTML = `
		<table data-vg-table ${attributes}>
			<thead><tr><th data-field="id">ID</th><th data-field="name">Название</th></tr></thead>
			<tbody><tr><td colspan="2">Начальная строка</td></tr></tbody>
		</table>`;
	const table = host.firstElementChild;
	document.body.append(table);
	return table;
};

test.beforeEach(() => {
	document.body.replaceChildren();
	window.localStorage.clear();
	window.history.replaceState({}, '', '/');
});

for (const responsemode of ['data', 'view']) {
	test(`responsive pagination preserves remote ${responsemode} state without requests on resize`, async (t) => {
		Object.defineProperty(window, 'innerWidth', {configurable: true, value: 1024});
		const calls = [];
		global.fetch = async (url) => {
			calls.push(url);
			return jsonResponse({
				data: [{id: 1, name: 'Row'}],
				view: {tbody: '<tr><td>1</td><td>Row</td></tr>'},
				meta: {page: 10, per_page: 1, total: 20, pages: 20},
			});
		};
		const table = createRemoteTable('class="vg-table" data-loading-min-delay="0"');
		const loaded = nextEvent(table, 'dataloaded.vg.table');
		const instance = new VGTable(table, {
			request: {route: '/api/responsive', responsemode, cache: {enable: false}},
			pagination: {enabled: true, page: 10, per: 1},
			responsive: {enabled: true, xs: {pagination: {maxButtons: 3, page: 1, per: 10}}, lg: {pagination: {maxButtons: 7}}},
		}).init();
		t.after(() => { instance.dispose(); Object.defineProperty(window, 'innerWidth', {configurable: true, value: 1024}); });
		await loaded;
		const state = instance.getPagination();
		const row = table.tBodies[0].rows[0];
		const storage = JSON.stringify(window.localStorage);
		const url = window.location.href;
		Object.defineProperty(window, 'innerWidth', {configurable: true, value: 375});
		window.dispatchEvent(new Event('resize'));
		await new Promise(resolve => setTimeout(resolve, 0));
		assert.equal(calls.length, 1);
		assert.deepEqual(instance.getPagination(), state);
		assert.equal(table.tBodies[0].rows[0], row);
		assert.equal(JSON.stringify(window.localStorage), storage);
		assert.equal(window.location.href, url);
		assert.equal(table.closest('.vg-table-wrapper').querySelectorAll('.vg-table-pagination__pages button').length, 5);
		await instance.reload();
		assert.equal(calls.length, 2);
		assert.equal(instance.getResponsiveState().breakpoint, 'xs');
		assert.equal(table.closest('.vg-table-wrapper').querySelectorAll('.vg-table-pagination__pages button').length, 5);
	});
}

test('remote skeleton keeps the current table geometry and uses configured rows when empty', async () => {
	const responses = [];
	global.fetch = () => new Promise(resolve => responses.push(resolve));
	const host = document.createElement('div');
	host.innerHTML = `
		<table data-vg-table data-request-route="/api/skeleton" data-loading-min-delay="0" data-loading-skeleton-rows="7">
			<thead><tr><th data-field="id">ID</th><th data-field="name">Название</th></tr></thead>
			<tbody></tbody>
		</table>`;
	const table = host.firstElementChild;
	document.body.append(table);
	const headers = Array.from(table.tHead.rows[0].cells);
	table.tHead.rows[0].getBoundingClientRect = () => ({width: 360, height: 52});
	headers[0].getBoundingClientRect = () => ({width: 120, height: 40});
	headers[1].getBoundingClientRect = () => ({width: 240, height: 40});

	const firstLoaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	const tableContainer = table.closest('.vg-table-container');
	assert.equal(table.querySelectorAll('[data-vg-table-skeleton]').length, 7);
	assert.equal(table.tBodies[0].rows[0].style.getPropertyValue('--vg-table-skeleton-row-height'), '52px');
	assert.equal(table.tBodies[0].rows[0].cells[0].style.height, '52px');
	assert.equal(table.tBodies[0].rows[0].cells[0].style.width, '');
	assert.equal(table.tBodies[0].rows[0].cells[1].style.width, '');
	responses.shift()(jsonResponse({
		data: [{id: 1, name: 'Один'}, {id: 2, name: 'Два'}, {id: 3, name: 'Три'}],
		meta: {page: 1, per_page: 10, total: 3, pages: 1},
	}));
	await firstLoaded;
	Object.defineProperties(tableContainer, {
		clientWidth: {configurable: true, value: 300},
		scrollWidth: {configurable: true, value: 360},
	});
	Array.from(table.tBodies[0].rows).forEach(row => {
		row.getBoundingClientRect = () => ({width: 360, height: 44});
	});

	const secondLoaded = nextEvent(table, 'dataloaded.vg.table');
	const reload = instance.reload();
	assert.equal(table.querySelectorAll('[data-vg-table-skeleton]').length, 3);
	assert.equal(table.tBodies[0].rows[0].style.getPropertyValue('--vg-table-skeleton-row-height'), '44px');
	assert.equal(table.tBodies[0].rows[0].cells[0].style.width, '120px');
	assert.equal(table.tBodies[0].rows[0].cells[1].style.width, '240px');
	responses.shift()(jsonResponse({
		data: [{id: 4, name: 'Четыре'}],
		meta: {page: 1, per_page: 10, total: 1, pages: 1},
	}));
	await reload;
	await secondLoaded;
	instance.dispose();
});

test('remote data mode uses Ajax query params, server meta, pagination and sorting', async () => {
	const calls = [];
	global.fetch = async (url, options) => {
		calls.push({url: new URL(url), options});
		const requestUrl = new URL(url);
		const page = Number(requestUrl.searchParams.get('page'));
		const sorted = requestUrl.searchParams.get('sort') === 'name';
		return jsonResponse({
			data: [{id: page * 10 + 1, name: sorted ? 'Альфа' : 'Бета'}, {id: page * 10 + 2, name: 'Гамма'}],
			meta: {page, per_page: 2, total: 12, pages: 6},
		});
	};

	const table = createRemoteTable('data-request-route="/api/table" data-pagination-enable="true" data-pagination-per-page="2"');
	const loaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await loaded;

	assert.equal(instance.isRemote(), true);
	assert.equal(calls[0].url.pathname, '/api/table');
	assert.equal(calls[0].url.searchParams.get('page'), '1');
	assert.equal(calls[0].url.searchParams.get('per_page'), '2');
	assert.equal(calls[0].url.searchParams.get('responsemode'), 'data');
	assert.deepEqual(Array.from(table.tBodies[0].rows, row => row.cells[1].textContent), ['Бета', 'Гамма']);
	assert.deepEqual(instance.getPagination(), {page: 1, perPage: 2, totalPages: 6, totalRows: 12});

	const sorted = nextEvent(table, 'dataloaded.vg.table');
	table.tHead.rows[0].cells[1].click();
	await sorted;
	assert.equal(calls[1].url.searchParams.get('sort'), 'name');
	assert.equal(calls[1].url.searchParams.get('dir'), 'asc');
	assert.equal(table.tBodies[0].rows[0].cells[1].textContent, 'Альфа');
	instance.dispose();
});

test('remote multi-sort sends ordered comma-separated fields and directions', async () => {
	const calls = [];
	global.fetch = async (url) => {
		calls.push(new URL(url));
		return jsonResponse({data: [{id: 1, name: 'Альфа'}], meta: {page: 1, per_page: 10, total: 1, pages: 1}});
	};

	const table = createRemoteTable('data-request-route="/api/table" data-sort-multiple="true" data-loading-min-delay="0"');
	let loaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await loaded;

	loaded = nextEvent(table, 'dataloaded.vg.table');
	table.tHead.rows[0].cells[1].click();
	await loaded;
	loaded = nextEvent(table, 'dataloaded.vg.table');
	table.tHead.rows[0].cells[0].dispatchEvent(new window.MouseEvent('click', {bubbles: true, shiftKey: true}));
	await loaded;

	assert.equal(calls.at(-1).searchParams.get('sort'), 'name,id');
	assert.equal(calls.at(-1).searchParams.get('dir'), 'asc,asc');
	assert.deepEqual(instance.getSorts().map(({field, direction}) => ({field, direction})), [
		{field: 'name', direction: 'asc'},
		{field: 'id', direction: 'asc'},
	]);
	instance.dispose();
});

test('remote view mode sends mapped params and reuses a cached response', async () => {
	let calls = 0;
	global.fetch = async (url) => {
		calls += 1;
		const requestUrl = new URL(url);
		assert.equal(requestUrl.searchParams.get('limit'), '10');
		assert.equal(requestUrl.searchParams.get('view'), 'rows');
		assert.equal(requestUrl.searchParams.get('fields'), 'id,name');
		return jsonResponse({
			view: {tbody: '<tr data-server-row><td>7</td><td><strong>Серверная строка</strong></td></tr>'},
			meta: {page: 1, per_page: 10, total: 1, pages: 1},
		});
	};

	const table = createRemoteTable(`data-request-route="/api/table/view" data-request-responsemode="view" data-request-parammap='{"per_page":"limit"}'`);
	const loaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await loaded;
	assert.equal(table.querySelector('[data-server-row] strong').textContent, 'Серверная строка');

	const cached = nextEvent(table, 'dataloaded.vg.table');
	await instance.reload({force: false});
	const event = await cached;
	assert.equal(event.detail.fromCache, true);
	assert.equal(calls, 1);
	instance.dispose();
});

test('remote POST sends mapped state as JSON body and exposes errors with retry', async () => {
	let shouldFail = false;
	let lastOptions = null;
	global.fetch = async (_url, options) => {
		lastOptions = options;
		if (shouldFail) {
			return {
				...jsonResponse({error: {message: 'Ошибка демо'}}),
				ok: false,
				status: 500,
				statusText: 'Server Error',
			};
		}
		return jsonResponse({data: [{id: 1, name: 'POST'}], meta: {page: 1, per_page: 10, total: 1, pages: 1}});
	};

	const table = createRemoteTable('data-request-route="/api/table" data-request-method="POST"');
	const loaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await loaded;
	assert.equal(lastOptions.method, 'POST');
	assert.equal(JSON.parse(lastOptions.body).page, 1);

	shouldFail = true;
	const failed = nextEvent(table, 'requesterror.vg.table');
	await instance.reload();
	await failed;
	assert.equal(table.getAttribute('aria-busy'), 'false');
	assert.equal(table.querySelector('[data-vg-table-state="error"]').textContent.includes('Не удалось загрузить данные'), true);
	assert.ok(table.querySelector('[data-vg-table-retry]'));
	shouldFail = false;
	const retried = nextEvent(table, 'dataloaded.vg.table');
	table.querySelector('[data-vg-table-retry]').click();
	await retried;
	assert.equal(lastOptions.headers['X-VGTable-Retry'], '1');
	assert.equal(instance.getTableState(), null);
	assert.equal(table.tBodies[0].rows[0].cells[1].textContent, 'POST');
	instance.dispose();
});

test('remote auto mode supports custom response paths, base params and export URL', async () => {
	global.fetch = async url => {
		const requestUrl = new URL(url);
		assert.equal(requestUrl.searchParams.get('tenant'), 'demo');
		return jsonResponse({
			payload: {
				rows: [{id: 42, name: 'Вложенный ответ'}],
				pagination: {page: 1, per_page: 10, total: 1, pages: 1},
			},
		});
	};

	const table = createRemoteTable(`data-request-route="/api/nested" data-request-responsemode="auto" data-request-datapath="payload.rows" data-request-metapath="payload.pagination" data-request-params='{"tenant":"demo"}' data-request-export-route="/api/nested/export"`);
	const loaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await loaded;
	assert.equal(table.tBodies[0].rows[0].cells[1].textContent, 'Вложенный ответ');
	assert.match(instance.exportRemote('xlsx', {open: false}), /^http:\/\/localhost\/api\/nested\/export\?/);
	assert.match(instance.exportRemote('xlsx', {open: false}), /format=xlsx/);
	instance.dispose();
});

test('remote filters apply select and switch changes immediately', async () => {
	const calls = [];
	global.fetch = async url => {
		const requestUrl = new URL(url);
		calls.push(requestUrl);
		return jsonResponse({
			data: [{id: calls.length, name: requestUrl.searchParams.get('status') || 'Все'}],
			meta: {page: 1, per_page: 10, total: 1, pages: 1},
		});
	};
	const form = document.createElement('form');
	form.id = 'remote-filters';
	form.innerHTML = `
		<input id="remote-search" type="search">
		<select data-filter-field="status">
			<option value="">Все</option><option value="active">Активные</option>
		</select>
		<input type="checkbox" value="1" data-filter-field="recent">
		<button type="button" data-filter-reset>Сбросить фильтры</button>
	`;
	document.body.append(form);
	VGTable.registerParamsGroup('remote-filtered', {
		request: {route: '/api/filterable'},
		search: {enabled: true, input: '#remote-search', debounce: 0},
		filters: {enabled: true, form: '#remote-filters'},
		pagination: {enabled: true, per: 10},
	});
	const table = createRemoteTable('data-group-params="remote-filtered"');
	const initial = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await initial;

	const select = form.querySelector('select');
	select.value = 'active';
	const selected = nextEvent(table, 'dataloaded.vg.table');
	select.dispatchEvent(new Event('change', {bubbles: true}));
	await selected;
	assert.equal(calls.at(-1).searchParams.get('status'), 'active');
	assert.equal(calls.at(-1).searchParams.get('status_op'), 'eq');

	const checkbox = form.querySelector('input[type="checkbox"]');
	checkbox.checked = true;
	const switched = nextEvent(table, 'dataloaded.vg.table');
	checkbox.dispatchEvent(new Event('change', {bubbles: true}));
	await switched;
	assert.equal(calls.at(-1).searchParams.get('recent'), '1');
	assert.equal(instance.getFilters().meta.count, 2);

	const search = form.querySelector('#remote-search');
	search.value = 'needle';
	const searched = nextEvent(table, 'dataloaded.vg.table');
	search.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}));
	await searched;
	assert.equal(calls.at(-1).searchParams.get('q'), 'needle');
	assert.equal(calls.at(-1).searchParams.get('status'), 'active');
	assert.equal(instance.getSearch().value, 'needle');

	const callsBeforeReset = calls.length;
	const cleared = nextEvent(table, 'dataloaded.vg.table');
	form.querySelector('[data-filter-reset]').click();
	await cleared;
	assert.equal(calls.length, callsBeforeReset + 1);
	assert.equal(calls.at(-1).searchParams.get('q'), null);
	assert.equal(calls.at(-1).searchParams.get('status'), null);
	assert.equal(calls.at(-1).searchParams.get('recent'), null);
	assert.equal(instance.getSearch().value, '');
	assert.equal(instance.getFilters().meta.count, 0);
	instance.dispose();
	VGTable.unregisterParamsGroup('remote-filtered');
});

test('common URL state restores and writes pagination, sort, search and filters', async () => {
	window.history.replaceState({}, '', '/tables?page=3&perPage=25&sort=name&dir=desc&search=needle&filter-status=active&filter-status_op=eq');
	const calls = [];
	global.fetch = async url => {
		const requestUrl = new URL(url);
		calls.push(requestUrl);
		const page = Number(requestUrl.searchParams.get('page') || 1);
		const perPage = Number(requestUrl.searchParams.get('per_page') || 10);
		return jsonResponse({
			data: [{id: page, name: requestUrl.searchParams.get('q') || 'Строка'}],
			meta: {page, per_page: perPage, total: 100, pages: Math.ceil(100 / perPage)},
		});
	};
	const form = document.createElement('form');
	form.id = 'url-state-filters';
	form.innerHTML = `
		<input id="url-state-search" type="search">
		<select data-filter-field="status"><option value="">Все</option><option value="active">Активные</option></select>
	`;
	document.body.append(form);
	VGTable.registerParamsGroup('url-state-table', {
		request: {route: '/api/url-state', cache: {enable: false}},
		loading: {minDelay: 0},
		search: {enabled: true, input: '#url-state-search', debounce: 0},
		filters: {enabled: true, form: '#url-state-filters'},
		pagination: {enabled: true, per: 10},
		urlState: {enabled: true},
	});
	const table = createRemoteTable('data-group-params="url-state-table"');
	const initial = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await initial;
	assert.equal(calls[0].searchParams.get('page'), '3');
	assert.equal(calls[0].searchParams.get('per_page'), '25');
	assert.equal(calls[0].searchParams.get('sort'), 'name');
	assert.equal(calls[0].searchParams.get('dir'), 'desc');
	assert.equal(calls[0].searchParams.get('q'), 'needle');
	assert.equal(calls[0].searchParams.get('status'), 'active');
	assert.equal(form.querySelector('#url-state-search').value, 'needle');
	assert.equal(form.querySelector('select').value, 'active');

	const searched = nextEvent(table, 'dataloaded.vg.table');
	form.querySelector('#url-state-search').value = 'next';
	form.querySelector('#url-state-search').dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}));
	await searched;
	assert.equal(new URL(window.location.href).searchParams.get('search'), 'next');
	assert.equal(new URL(window.location.href).searchParams.get('page'), '1');
	assert.equal(new URL(window.location.href).searchParams.get('filter-status'), 'active');

	window.history.replaceState({}, '', '/tables?page=2&perPage=10&sort=id&dir=asc&search=back');
	const popped = nextEvent(table, 'dataloaded.vg.table');
	window.dispatchEvent(new Event('popstate'));
	await popped;
	assert.equal(calls.at(-1).searchParams.get('page'), '2');
	assert.equal(calls.at(-1).searchParams.get('per_page'), '10');
	assert.equal(calls.at(-1).searchParams.get('sort'), 'id');
	assert.equal(calls.at(-1).searchParams.get('q'), 'back');
	assert.equal(calls.at(-1).searchParams.get('status'), null);
	assert.equal(form.querySelector('select').value, '');
	instance.dispose();
	VGTable.unregisterParamsGroup('url-state-table');
});

test('common URL state restores and writes multi-sort priority order', async () => {
	window.history.replaceState({}, '', '/tables?sort=name,id&dir=asc,desc');
	const calls = [];
	global.fetch = async (url) => {
		calls.push(new URL(url));
		return jsonResponse({data: [{id: 1, name: 'Альфа'}], meta: {page: 1, per_page: 10, total: 1, pages: 1}});
	};

	const table = createRemoteTable('data-request-route="/api/table" data-sort-multiple="true" data-url-state-enable="true" data-loading-min-delay="0"');
	const loaded = nextEvent(table, 'dataloaded.vg.table');
	const instance = new VGTable(table).init();
	await loaded;

	assert.equal(calls[0].searchParams.get('sort'), 'name,id');
	assert.equal(calls[0].searchParams.get('dir'), 'asc,desc');
	assert.deepEqual(instance.getSorts().map(({field, direction}) => ({field, direction})), [
		{field: 'name', direction: 'asc'},
		{field: 'id', direction: 'desc'},
	]);

	const nextLoaded = nextEvent(table, 'dataloaded.vg.table');
	table.tHead.rows[0].cells[1].dispatchEvent(new window.MouseEvent('click', {bubbles: true, shiftKey: true}));
	await nextLoaded;
	assert.equal(new URL(window.location.href).searchParams.get('sort'), 'name,id');
	assert.equal(new URL(window.location.href).searchParams.get('dir'), 'desc,desc');
	instance.dispose();
});
