const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
	url: 'http://localhost/'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;
global.KeyboardEvent = dom.window.KeyboardEvent;

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) {
		return originalJavaScriptLoader(module, filename);
	}

	const source = fs.readFileSync(filename, 'utf8');
	const transformed = babel.transformSync(source, {
		filename,
		presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
		sourceMaps: 'inline'
	});

	module._compile(transformed.code, filename);
};

const VGTable = require('../app/modules/vgtable/js/vgtable').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const createTable = (attributes = '') => {
	const wrapper = document.createElement('div');
	wrapper.innerHTML = `
		<table data-vg-table ${attributes}>
			<thead><tr><th data-field="name">Название</th><th data-field="count">Количество</th></tr></thead>
			<tbody>
				<tr data-id="first"><td>Бета</td><td>10</td></tr>
				<tr data-id="second"><td>Альфа</td><td>2</td></tr>
				<tr data-id="third"><td>Альфа</td><td>5</td></tr>
			</tbody>
		</table>
	`;
	const table = wrapper.firstElementChild;
	document.body.append(table);
	return table;
};

const createExpandableTable = (attributes = '') => {
	const host = document.createElement('div');
	host.innerHTML = `
		<table data-vg-table data-sort-enabled="false" data-expandable-enable="true" ${attributes}>
			<thead><tr><th>Название</th><th>Тип</th></tr></thead>
			<tbody>
				<tr data-expand-id="root"><td>Проект</td><td>Корень</td></tr>
				<tr data-expand-id="section" data-expand-parent-id="root"><td>Раздел</td><td>Уровень 1</td></tr>
				<tr data-expand-id="item" data-expand-parent-id="section"><td>Элемент</td><td>Уровень 2</td></tr>
				<tr data-expand-id="other"><td>Другой проект</td><td>Корень</td></tr>
			</tbody>
		</table>
	`;
	const table = host.firstElementChild;
	document.body.append(table);
	return table;
};

const createColumnsTable = (attributes = '') => {
	const host = document.createElement('div');
	host.innerHTML = `
		<div id="column-controls">
			<input type="checkbox" data-vg-table-column="name" checked>
			<input type="checkbox" data-vg-table-column="status" checked>
			<input type="checkbox" data-vg-table-column="actions" checked>
			<button type="button" data-vg-table-columns-reset>Сбросить</button>
		</div>
		<table id="managed-columns" data-vg-table ${attributes}>
			<colgroup><col><col><col><col></colgroup>
			<thead><tr>
				<th data-field="id">ID</th><th data-field="name">Название</th>
				<th data-field="status">Статус</th><th data-field="actions">Действия</th>
			</tr></thead>
			<tbody>
				<tr><td>1</td><td>Альфа</td><td>Активен</td><td>Открыть</td></tr>
				<tr><td>2</td><td>Бета</td><td>Архив</td><td>Открыть</td></tr>
			</tbody>
		</table>`;
	document.body.append(...Array.from(host.children));
	return document.querySelector('#managed-columns');
};

const createRowReorderTable = (attributes = '') => {
	const host = document.createElement('div');
	host.innerHTML = `
		<table id="row-reorder-table" data-vg-table data-sort-enabled="true" data-row-reorder-enable="true" ${attributes}>
			<thead><tr><th>Порядок</th><th>Задача</th></tr></thead>
			<tbody>
				<tr data-row-key="task-1"><td><span data-row-reorder-handle>⋮⋮</span></td><td>Первая</td></tr>
				<tr data-row-key="task-2"><td><span data-row-reorder-handle>⋮⋮</span></td><td>Вторая</td></tr>
				<tr data-row-key="task-3"><td><span data-row-reorder-handle>⋮⋮</span></td><td>Третья</td></tr>
			</tbody>
		</table>`;
	const table = host.firstElementChild;
	document.body.append(table);
	return table;
};

const rowIds = table => Array.from(table.tBodies[0].rows, row => row.dataset.id);

const dispatchPointer = (element, type, properties = {}) => {
	const event = new Event(type, {bubbles: true, cancelable: true});
	Object.entries(properties).forEach(([name, value]) => {
		Object.defineProperty(event, name, {value});
	});
	element.dispatchEvent(event);
	return event;
};

test.beforeEach(() => {
	document.body.replaceChildren();
	window.localStorage.clear();
	window.history.replaceState({}, '', '/');
});

test('creates missing wrapper and container and removes only generated structure on dispose', () => {
	const marker = document.createElement('span');
	document.body.append(marker);
	const table = createTable();
	const instance = new VGTable(table).init();
	const container = table.parentElement;
	const wrapper = container.parentElement;

	assert.equal(wrapper.classList.contains('vg-table-wrapper'), true);
	assert.equal(wrapper.hasAttribute('data-vg-table-generated-wrapper'), true);
	assert.equal(container.classList.contains('vg-table-container'), true);
	assert.equal(container.hasAttribute('data-vg-table-generated-container'), true);
	assert.equal(wrapper.previousElementSibling, marker);

	instance.init();
	assert.equal(document.querySelectorAll('.vg-table-wrapper').length, 1);

	instance.dispose();
	assert.equal(table.parentElement, document.body);
	assert.equal(table.previousElementSibling, marker);
	assert.equal(document.querySelector('.vg-table-wrapper'), null);
});

test('reuses a supplied wrapper and generates only its required table container', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper';
	document.body.append(wrapper);
	const table = createTable();
	wrapper.append(table);
	const instance = new VGTable(table).init();

	const container = table.parentElement;
	assert.equal(container.classList.contains('vg-table-container'), true);
	assert.equal(container.hasAttribute('data-vg-table-generated-container'), true);
	assert.equal(container.parentElement, wrapper);
	assert.equal(wrapper.hasAttribute('data-vg-table-generated-wrapper'), false);

	instance.dispose();
	assert.equal(table.parentElement, wrapper);
	assert.equal(wrapper.isConnected, true);
});

test('builds Ant-like header and body layers inside a bounded table container', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper';
	document.body.append(wrapper);
	const table = createTable('data-sticky-header-enable="true" data-sticky-header-mode="container" data-sticky-header-top="8" data-sticky-header-max-height="320px"');
	wrapper.append(table);
	const instance = new VGTable(table).init();
	const body = table.parentElement;
	const container = body.parentElement;

	assert.equal(wrapper.classList.contains('vg-table-wrapper--sticky-container'), true);
	assert.equal(container.classList.contains('vg-table-container--sticky-container'), true);
	assert.equal(container.hasAttribute('data-vg-table-generated-container'), true);
	assert.equal(container.style.getPropertyValue('--vg-table-sticky-top'), '8px');
	assert.equal(container.style.getPropertyValue('--vg-table-sticky-max-height'), '320px');
	assert.equal(table.getAttribute('data-vg-table-sticky-header'), 'container');
	assert.equal(body.classList.contains('vg-table-body'), true);
	assert.equal(container.querySelector('.vg-table-header') !== null, true);
	assert.equal(container.querySelectorAll('table').length, 2);
	assert.equal(container.querySelectorAll('thead').length, 1);
	assert.equal(table.tHead, null);
	assert.equal(container.querySelector('.vg-table-header__table').hasAttribute('data-vg-table'), false);
	body.scrollLeft = 48;
	body.dispatchEvent(new Event('scroll'));
	assert.equal(container.querySelector('.vg-table-header').scrollLeft, 48);
	Object.defineProperty(body, 'offsetWidth', {configurable: true, value: 315});
	Object.defineProperty(body, 'clientWidth', {configurable: true, value: 300});
	instance.refreshStickyHeader();
	assert.equal(container.querySelector('.vg-table-header').classList.contains('vg-table-header--scrollbar'), true);
	assert.equal(container.classList.contains('vg-table-container--scrollbar'), true);
	assert.equal(container.querySelector('.vg-table-header').style.getPropertyValue('--vg-table-sticky-scrollbar-width'), '15px');
	container.querySelector('th[data-field="name"]').click();
	assert.equal(instance.getSort().direction, 'asc');
	assert.deepEqual(rowIds(table), ['second', 'third', 'first']);

	instance.dispose();
	assert.equal(wrapper.classList.contains('vg-table-wrapper--sticky-container'), false);
	assert.equal(table.parentElement, wrapper);
	assert.equal(wrapper.querySelector('.vg-table-container'), null);
	assert.equal(table.hasAttribute('data-vg-table-sticky-header'), false);
});

test('uses page sticky mode and preserves an existing table container on dispose', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper custom-wrapper';
	wrapper.style.setProperty('--vg-table-sticky-top', '4rem');
	document.body.append(wrapper);
	const container = document.createElement('div');
	container.className = 'vg-table-container custom-container';
	wrapper.append(container);
	const table = createTable('data-sticky-header-enable="true" data-sticky-header-mode="page"');
	container.append(table);
	const instance = new VGTable(table).init();

	assert.equal(wrapper.classList.contains('vg-table-wrapper--sticky-page'), true);
	assert.equal(container.classList.contains('vg-table-container--sticky-page'), true);
	assert.equal(container.style.getPropertyValue('--vg-table-sticky-top'), '');
	assert.equal(wrapper.style.getPropertyValue('--vg-table-sticky-top'), '4rem');
	assert.equal(table.getAttribute('data-vg-table-sticky-header'), 'page');
	assert.equal(table.parentElement.classList.contains('vg-table-body'), true);
	assert.equal(container.querySelector('.vg-table-header') !== null, true);

	instance.dispose();
	assert.equal(wrapper.classList.contains('vg-table-wrapper--sticky-page'), false);
	assert.equal(container.classList.contains('vg-table-container--sticky-page'), false);
	assert.equal(container.style.getPropertyValue('--vg-table-sticky-top'), '');
	assert.equal(wrapper.style.getPropertyValue('--vg-table-sticky-top'), '4rem');
	assert.equal(table.parentElement, container);
	assert.notEqual(table.tHead, null);
	assert.equal(wrapper.classList.contains('custom-wrapper'), true);
});

test('fixes left and right columns with native offsets and synchronous scroll edges', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper';
	wrapper.innerHTML = `
		<table class="vg-table" data-vg-table data-fixed-columns="left:id,name;right:actions">
			<thead><tr>
				<th data-field="id">ID</th><th data-field="name">Название</th>
				<th data-field="status">Статус</th><th data-field="actions">Действия</th>
			</tr></thead>
			<tbody><tr><td>1</td><td>Проект</td><td>Активен</td><td>Открыть</td></tr></tbody>
		</table>
	`;
	document.body.append(wrapper);
	const table = wrapper.querySelector('table');
	Array.from(table.querySelectorAll('th, td')).forEach((cell) => {
		cell.getBoundingClientRect = () => ({width: 100});
	});
	const instance = new VGTable(table).init();
	const container = table.closest('.vg-table-container');
	Object.defineProperties(container, {
		scrollWidth: {configurable: true, value: 600},
		clientWidth: {configurable: true, value: 300},
	});
	instance.refreshFixedColumns();
	const header = Array.from(table.tHead.rows[0].cells);
	const cells = Array.from(table.tBodies[0].rows[0].cells);

	assert.equal(instance.getFixedColumns().mode, 'fixed');
	assert.deepEqual(instance.getFixedColumns().left, [0, 1]);
	assert.equal(header[0].getAttribute('data-vg-table-fixed-side'), 'left');
	assert.equal(cells[1].style.getPropertyValue('--vg-table-fixed-offset'), '100px');
	assert.equal(cells[3].getAttribute('data-vg-table-fixed-side'), 'right');
	assert.equal(cells[3].style.getPropertyValue('--vg-table-fixed-offset'), '0px');
	assert.equal(header[1].getAttribute('data-vg-table-fixed-edge'), 'left');

	container.scrollLeft = 20;
	container.dispatchEvent(new Event('scroll'));
	assert.equal(wrapper.classList.contains('is-vg-table-fixed-scrolled-start'), true);
	assert.equal(wrapper.classList.contains('is-vg-table-fixed-scrolled-end'), true);

	instance.dispose();
	assert.equal(table.querySelector('[data-vg-table-fixed-side]'), null);
	assert.equal(wrapper.classList.contains('vg-table-wrapper--fixed-columns'), false);
});

test('explicit data-fixed-columns-enable="false" overrides automatic column discovery', () => {
	const table = createTable('data-fixed-columns="left:name" data-fixed-columns-enable="false"');
	const instance = new VGTable(table).init();

	assert.equal(instance.getFixedColumns(), null);
	assert.equal(table.querySelector('[data-vg-table-fixed-side]'), null);
	instance.dispose();
});

test('stack fixed columns join progressively and work with the real Fixed Header thead', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper';
	wrapper.innerHTML = `
		<table class="vg-table" data-vg-table
			data-fixed-columns="left:id,department,city;right:actions"
			data-fixed-columns-mode="stack"
			data-sticky-header-enable="true"
			data-sticky-header-mode="container">
			<thead><tr>
				<th data-field="id">ID</th><th data-field="name">Имя</th>
				<th data-field="department">Отдел</th><th data-field="status">Статус</th>
				<th data-field="city">Город</th><th data-field="actions">Действия</th>
			</tr></thead>
			<tbody><tr><td>1</td><td>Анна</td><td>Продажи</td><td>Активен</td><td>Москва</td><td>Открыть</td></tr></tbody>
		</table>
	`;
	document.body.append(wrapper);
	const table = wrapper.querySelector('table');
	Array.from(table.querySelectorAll('th, td')).forEach((cell) => {
		cell.getBoundingClientRect = () => ({width: 100});
	});
	const instance = new VGTable(table).init();
	const body = wrapper.querySelector('.vg-table-body');
	Object.defineProperties(body, {
		scrollWidth: {configurable: true, value: 600},
		clientWidth: {configurable: true, value: 300},
	});
	instance.refreshFixedColumns();
	const headerTable = wrapper.querySelector('.vg-table-header__table');
	const headers = Array.from(headerTable.tHead.rows[0].cells);

	assert.equal(wrapper.classList.contains('vg-table-wrapper--fixed-columns-stack'), true);
	assert.equal(headers[0].getAttribute('data-vg-table-fixed-edge'), 'left');
	assert.equal(headers[2].getAttribute('data-vg-table-fixed-edge'), null);
	assert.equal(headers[2].style.getPropertyValue('--vg-table-fixed-offset'), '100px');
	assert.equal(table.tBodies[0].rows[0].cells[2].getAttribute('data-vg-table-fixed-side'), 'left');

	body.scrollLeft = 120;
	body.dispatchEvent(new Event('scroll'));
	assert.equal(headers[0].getAttribute('data-vg-table-fixed-edge'), null);
	assert.equal(headers[2].getAttribute('data-vg-table-fixed-edge'), 'left');

	body.scrollLeft = 230;
	body.dispatchEvent(new Event('scroll'));
	assert.equal(headers[4].getAttribute('data-vg-table-fixed-edge'), 'left');
	assert.equal(wrapper.querySelectorAll('thead').length, 1);

	instance.dispose();
	assert.notEqual(table.tHead, null);
});

test('expands and collapses a tree of rows at unlimited nested levels', () => {
	const table = createExpandableTable();
	const instance = new VGTable(table).init();
	const root = table.querySelector('[data-expand-id="root"]');
	const section = table.querySelector('[data-expand-id="section"]');
	const item = table.querySelector('[data-expand-id="item"]');
	const rootToggle = root.querySelector('[data-expand-toggle]');
	let detail = null;
	table.addEventListener('rowexpand.vg.table', event => { detail = event.detail; });

	assert.equal(root.getAttribute('data-expand-depth'), '0');
	assert.equal(section.getAttribute('data-expand-depth'), '1');
	assert.equal(item.getAttribute('data-expand-depth'), '2');
	assert.equal(rootToggle.getAttribute('aria-expanded'), 'false');
	assert.equal(section.hidden, true);
	assert.equal(item.hidden, true);

	rootToggle.click();
	assert.equal(rootToggle.getAttribute('aria-expanded'), 'true');
	assert.equal(section.hidden, false);
	assert.equal(item.hidden, true);
	assert.equal(detail.id, 'root');
	assert.equal(detail.expanded, true);

	section.querySelector('[data-expand-toggle]').click();
	assert.equal(item.hidden, false);
	assert.deepEqual(instance.getExpandable(), {expanded: ['root', 'section'], collapsed: []});

	assert.equal(instance.collapseRow('root'), true);
	assert.equal(section.hidden, true);
	assert.equal(item.hidden, true);
	assert.equal(instance.expandRow('root'), true);
	assert.equal(section.hidden, false);
	assert.equal(item.hidden, false);

	instance.dispose();
	assert.equal(table.querySelector('[data-vg-table-expandable-generated]'), null);
	assert.equal(section.hidden, false);
	assert.equal(item.hasAttribute('data-expand-depth'), false);
});

test('supports custom expandable row attributes and safely handles cyclic parents', () => {
	const table = createExpandableTable('data-expandable-id-attr="data-node" data-expandable-parent-attr="data-parent" data-expandable-collapsed="false"');
	const rows = Array.from(table.tBodies[0].rows);
	rows[0].setAttribute('data-node', 'a');
	rows[0].setAttribute('data-parent', 'b');
	rows[1].setAttribute('data-node', 'b');
	rows[1].setAttribute('data-parent', 'a');
	rows[2].setAttribute('data-node', 'c');
	rows[2].setAttribute('data-parent', 'b');
	rows[3].setAttribute('data-node', 'd');
	const instance = new VGTable(table).init();

	assert.ok(Number.isFinite(Number(rows[0].getAttribute('data-expand-depth'))));
	assert.ok(Number.isFinite(Number(rows[1].getAttribute('data-expand-depth'))));
	assert.equal(instance.getExpandable().collapsed.length, 0);

	instance.dispose();
});

test('detects complex cell spans and disables sorting automatically', () => {
	const host = document.createElement('div');
	host.innerHTML = `
		<table data-vg-table>
			<thead><tr><th>Строка</th><th colspan="2">Телефон</th></tr></thead>
			<tbody>
				<tr data-id="first"><th scope="row">1</th><td rowspan="2">111</td><td>222</td></tr>
				<tr data-id="second"><th scope="row">2</th><td>333</td></tr>
			</tbody>
		</table>
	`;
	const table = host.firstElementChild;
	document.body.append(table);
	const instance = new VGTable(table).init();

	assert.equal(instance.isComplex(), true);
	assert.equal(table.getAttribute('data-vg-table-complex'), '');
	assert.equal(table.classList.contains('vg-table-complex'), true);
	assert.equal(table.querySelector('[data-vg-table-sort-controls]'), null);
	table.tHead.rows[0].cells[0].click();
	assert.deepEqual(rowIds(table), ['first', 'second']);

	instance.dispose();
	assert.equal(table.hasAttribute('data-vg-table-complex'), false);
	assert.equal(table.classList.contains('vg-table-complex'), false);
});

test('enables stable local sorting by default and cycles back to the original order', () => {
	const table = createTable();
	const instance = new VGTable(table).init();
	const nameHeader = table.tHead.rows[0].cells[0];
	const ascChevron = nameHeader.querySelector('.vg-table-sort-chevron-asc');
	const descChevron = nameHeader.querySelector('.vg-table-sort-chevron-desc');

	assert.equal(instance.isComplex(), false);
	assert.ok(ascChevron);
	assert.ok(descChevron);
	assert.equal(nameHeader.hasAttribute('data-sort-direction'), false);

	nameHeader.click();
	assert.deepEqual(rowIds(table), ['second', 'third', 'first']);
	assert.equal(nameHeader.getAttribute('aria-sort'), 'ascending');
	assert.equal(nameHeader.getAttribute('data-sort-direction'), 'asc');
	assert.equal(table.querySelectorAll('[data-sorted-column="1"]').length, 4);
	assert.deepEqual(instance.getSort(), {columnIndex: 0, field: 'name', direction: 'asc'});

	nameHeader.click();
	assert.deepEqual(rowIds(table), ['first', 'second', 'third']);
	assert.equal(nameHeader.getAttribute('aria-sort'), 'descending');
	assert.equal(nameHeader.getAttribute('data-sort-direction'), 'desc');

	nameHeader.click();
	assert.deepEqual(rowIds(table), ['first', 'second', 'third']);
	assert.equal(nameHeader.getAttribute('aria-sort'), 'none');
	assert.equal(nameHeader.hasAttribute('data-sort-direction'), false);
	assert.equal(table.querySelectorAll('[data-sorted-column="1"]').length, 0);
	assert.equal(instance.getSort(), null);

	instance.dispose();
});

test('sorts numeric cells numerically and supports keyboard activation', () => {
	const table = createTable();
	const instance = new VGTable(table).init();
	const countHeader = table.tHead.rows[0].cells[1];

	countHeader.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
	assert.deepEqual(rowIds(table), ['second', 'third', 'first']);

	instance.dispose();
});

test('supports stable multi-column sorting with Shift and exposes priorities', () => {
	const table = createTable('data-sort-multiple="true"');
	const instance = new VGTable(table).init();
	const nameHeader = table.tHead.rows[0].cells[0];
	const countHeader = table.tHead.rows[0].cells[1];

	nameHeader.click();
	countHeader.dispatchEvent(new window.MouseEvent('click', {bubbles: true, shiftKey: true}));
	countHeader.dispatchEvent(new window.MouseEvent('click', {bubbles: true, shiftKey: true}));

	assert.deepEqual(rowIds(table), ['third', 'second', 'first']);
	assert.deepEqual(instance.getSorts(), [
		{columnIndex: 0, field: 'name', direction: 'asc'},
		{columnIndex: 1, field: 'count', direction: 'desc'},
	]);
	assert.equal(nameHeader.getAttribute('data-sort-priority'), '1');
	assert.equal(countHeader.getAttribute('data-sort-priority'), '2');
	assert.equal(nameHeader.querySelector('[data-vg-table-sort-priority]').textContent, '1');
	assert.equal(countHeader.querySelector('[data-vg-table-sort-priority]').textContent, '2');
	assert.equal(table.querySelectorAll('[data-sorted-priority="2"]').length, 4);

	countHeader.dispatchEvent(new window.MouseEvent('click', {bubbles: true, shiftKey: true}));
	assert.deepEqual(rowIds(table), ['second', 'third', 'first']);
	assert.deepEqual(instance.getSorts(), [{columnIndex: 0, field: 'name', direction: 'asc'}]);

	countHeader.click();
	assert.deepEqual(rowIds(table), ['second', 'third', 'first']);
	assert.deepEqual(instance.getSorts(), [{columnIndex: 1, field: 'count', direction: 'asc'}]);
	assert.equal(nameHeader.hasAttribute('data-sort-priority'), false);

	instance.dispose();
});

test('supports permanent multi-sort mode and the setSorts public method', () => {
	const table = createTable('data-sort-multiple="true" data-sort-multiple-with-shift="false"');
	const instance = new VGTable(table).init();
	const headers = table.tHead.rows[0].cells;

	headers[0].click();
	headers[1].click();
	assert.equal(instance.getSorts().length, 2);

	assert.equal(instance.setSorts([{field: 'name', dir: 'asc'}, {field: 'count', dir: 'desc'}]), true);
	assert.deepEqual(rowIds(table), ['third', 'second', 'first']);
	assert.deepEqual(instance.getSort(), {columnIndex: 0, field: 'name', direction: 'asc'});

	instance.clearSort();
	assert.deepEqual(instance.getSorts(), []);
	assert.deepEqual(rowIds(table), ['first', 'second', 'third']);
	instance.dispose();
});

test('data-sort-enabled="false" disables sorting', () => {
	const table = createTable('data-sort-enabled="false"');
	const instance = new VGTable(table).init();
	const header = table.tHead.rows[0].cells[0];

	header.click();
	assert.deepEqual(rowIds(table), ['first', 'second', 'third']);
	assert.equal(header.hasAttribute('aria-sort'), false);
	assert.equal(instance.getSort(), null);

	instance.dispose();
});

test('data-sort-hover="true" enables hover-only controls but keeps an active sort visible', () => {
	const table = createTable('data-sort-hover="true"');
	const instance = new VGTable(table).init();
	const header = table.tHead.rows[0].cells[0];

	assert.equal(table.classList.contains('vg-table-sort-hover'), true);
	assert.equal(header.hasAttribute('data-sort-direction'), false);

	header.click();
	assert.equal(header.getAttribute('data-sort-direction'), 'asc');

	instance.dispose();
	assert.equal(table.classList.contains('vg-table-sort-hover'), false);
});

test('resizes, reorders and hides columns while keeping fixed edges locked', () => {
	const table = createColumnsTable(`
		data-column-resize-enable="true"
		data-column-reorder-enable="true"
		data-column-visibility-enable="true"
		data-column-visibility-controls="#column-controls"
		data-fixed-columns="left:id;right:actions"
	`);
	const instance = new VGTable(table).init();
	const controls = document.querySelector('#column-controls');
	let resized = null;
	let reordered = null;
	let visibility = null;
	table.addEventListener('columnresize.vg.table', event => { resized = event.detail; });
	table.addEventListener('columnreorder.vg.table', event => { reordered = event.detail; });
	table.addEventListener('columnvisibilitychange.vg.table', event => { visibility = event.detail; });

	assert.equal(table.querySelectorAll('[data-vg-table-column-resize-handle]').length, 4);
	assert.equal(controls.querySelector('[data-vg-table-column="actions"]').disabled, true);
	assert.equal(instance.setColumnWidth('name', 180), true);
	assert.equal(table.tHead.rows[0].cells[1].style.width, '180px');
	assert.equal(table.tBodies[0].rows[0].cells[1].style.width, '180px');
	assert.equal(resized.field, 'name');

	assert.equal(instance.setColumnVisible('status', false), true);
	assert.equal(table.tHead.rows[0].cells[2].hidden, true);
	assert.equal(table.tBodies[0].rows[0].cells[2].hidden, true);
	assert.equal(controls.querySelector('[data-vg-table-column="status"]').checked, false);
	assert.equal(visibility.field, 'status');
	assert.equal(instance.setColumnVisible('actions', false), false);

	assert.equal(instance.moveColumn('name', 'status'), true);
	assert.deepEqual(instance.getColumns().order, ['id', 'status', 'name', 'actions']);
	assert.deepEqual(Array.from(table.tBodies[0].rows[0].cells, cell => cell.textContent), ['1', 'Активен', 'Альфа', 'Открыть']);
	assert.equal(reordered.field, 'name');
	assert.deepEqual(instance.getFixedColumns(), {mode: 'fixed', left: [0], right: [3]});
	assert.equal(instance.moveColumn('name', 'actions'), false);

	const reset = instance.resetColumns();
	assert.deepEqual(reset.order, ['id', 'name', 'status', 'actions']);
	assert.deepEqual(reset.hidden, []);
	assert.equal(table.tHead.rows[0].cells[1].style.width, '');
	assert.equal(controls.querySelector('[data-vg-table-column="status"]').checked, true);

	instance.dispose();
	assert.equal(table.querySelector('[data-vg-table-column-resize-handle]'), null);
});

test('column widths, order and visibility can persist by table id', () => {
	const attributes = `
		data-column-resize-enable="true" data-column-resize-persist="true"
		data-column-reorder-enable="true" data-column-reorder-persist="true"
		data-column-visibility-enable="true" data-column-visibility-controls="#column-controls" data-column-visibility-persist="true"
	`;
	const table = createColumnsTable(attributes);
	let instance = new VGTable(table).init();
	instance.setColumnWidth('name', 210);
	instance.moveColumn('name', 'status');
	instance.setColumnVisible('status', false);
	instance.dispose();

	instance = new VGTable(table).init();
	assert.deepEqual(instance.getColumns().order, ['id', 'status', 'name', 'actions']);
	assert.equal(instance.getColumns().widths.name, 210);
	assert.deepEqual(instance.getColumns().hidden, ['status']);
	assert.equal(table.tHead.rows[0].cells[1].hidden, true);
	assert.equal(table.tHead.rows[0].cells[2].style.width, '210px');
	instance.resetColumns(false);
	instance.dispose();
});

test('column resize handles and native drag events update the table interactively', () => {
	const table = createColumnsTable('data-column-resize-enable="true" data-column-reorder-enable="true"');
	const instance = new VGTable(table).init();
	let headers = table.tHead.rows[0].cells;
	const nameHeader = headers[1];
	nameHeader.getBoundingClientRect = () => ({width: 120});
	const handle = nameHeader.querySelector('[data-vg-table-column-resize-handle]');
	dispatchPointer(handle, 'pointerdown', {clientX: 100});
	dispatchPointer(document, 'pointermove', {clientX: 160});
	dispatchPointer(document, 'pointerup', {clientX: 160});
	assert.equal(nameHeader.style.width, '180px');
	handle.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true, cancelable: true}));
	assert.equal(nameHeader.style.width, '190px');
	assert.equal(handle.getAttribute('aria-valuenow'), '190');

	const transfer = {effectAllowed: '', setData() {}};
	dispatchPointer(nameHeader, 'dragstart', {dataTransfer: transfer});
	dispatchPointer(headers[2], 'dragover', {dataTransfer: transfer});
	dispatchPointer(headers[2], 'drop', {dataTransfer: transfer});
	assert.deepEqual(instance.getColumns().order, ['id', 'status', 'name', 'actions']);
	assert.deepEqual(Array.from(table.tBodies[0].rows[0].cells, cell => cell.textContent), ['1', 'Активен', 'Альфа', 'Открыть']);
	instance.dispose();
});

test('standalone row reorder supports public API, native drag, keyboard and reset', () => {
	const table = createRowReorderTable();
	const instance = new VGTable(table).init();
	let detail = null;
	table.addEventListener('rowreorder.vg.table', event => { detail = event.detail; });

	assert.equal(instance.getSort(), null);
	assert.deepEqual(instance.getRowOrder(), ['task-1', 'task-2', 'task-3']);
	assert.equal(instance.moveRow('task-3', 'task-1'), true);
	assert.deepEqual(instance.getRowOrder(), ['task-3', 'task-1', 'task-2']);
	assert.equal(detail.key, 'task-3');
	assert.equal(detail.fromIndex, 2);
	assert.equal(detail.toIndex, 0);

	const handle = table.querySelector('[data-row-key="task-3"] [data-row-reorder-handle]');
	handle.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true, cancelable: true}));
	assert.deepEqual(instance.getRowOrder(), ['task-1', 'task-3', 'task-2']);
	assert.match(handle.getAttribute('aria-label'), /task-3/);

	const moving = table.querySelector('[data-row-key="task-1"] [data-row-reorder-handle]');
	const target = table.querySelector('[data-row-key="task-2"]');
	target.getBoundingClientRect = () => ({top: 0, height: 40});
	const transfer = {effectAllowed: '', setData() {}};
	dispatchPointer(moving, 'dragstart', {dataTransfer: transfer});
	dispatchPointer(target, 'dragover', {clientY: 30, dataTransfer: transfer});
	dispatchPointer(target, 'drop', {clientY: 30, dataTransfer: transfer});
	assert.deepEqual(instance.getRowOrder(), ['task-3', 'task-2', 'task-1']);

	assert.deepEqual(instance.resetRows().order, ['task-1', 'task-2', 'task-3']);
	instance.dispose();
	assert.equal(table.querySelector('[data-vg-table-row-reorder]'), null);
});

test('row order persistence uses stable keys and disabled rows stay locked', () => {
	const table = createRowReorderTable('data-row-reorder-persist="true"');
	table.tBodies[0].rows[1].setAttribute('data-row-reorder-disabled', '');
	let instance = new VGTable(table).init();
	assert.equal(instance.moveRow('task-1', 'task-2'), false);
	assert.equal(instance.moveRow('task-3', 'task-1'), true);
	instance.dispose();

	instance = new VGTable(table).init();
	assert.deepEqual(instance.getRowOrder(), ['task-3', 'task-1', 'task-2']);
	instance.resetRows(false);
	instance.dispose();
});

test('i18n resolves English, regional locale and custom dictionaries without a demo layer', () => {
	const table = createTable('data-locale="en-US" data-pagination-enable="true" data-pagination-show-per-page="true" data-pagination-per-page="1" data-column-resize-enable="true"');
	const instance = new VGTable(table, {
		i18n: {en: {pagination: {size: {label: 'Items per page'}}}},
	}).init();
	const wrapper = table.closest('.vg-table-wrapper');

	assert.equal(instance.getLocale(), 'en-us');
	assert.equal(wrapper.querySelector('.vg-table-pagination__size-heading').textContent, 'Items per page');
	assert.match(table.querySelector('[data-vg-table-column-resize-handle]').getAttribute('aria-label'), /^Resize column/);
	assert.equal(instance.setLocale('ru'), 'ru');
	assert.equal(wrapper.querySelector('.vg-table-pagination__size-heading').textContent, 'Строк на странице');
	assert.match(table.querySelector('[data-vg-table-column-resize-handle]').getAttribute('aria-label'), /^Изменить ширину/);
	instance.dispose();
});

test('shift and mouse drag scrolls an overflowing responsive table without sorting it', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper';
	document.body.append(wrapper);
	const table = createTable();
	wrapper.append(table);
	const instance = new VGTable(table).init();
	const container = table.closest('.vg-table-container');
	Object.defineProperty(container, 'clientWidth', {value: 300});
	Object.defineProperty(container, 'scrollWidth', {value: 900});
	const header = table.tHead.rows[0].cells[0];
	const pointer = {isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 1};

	dispatchPointer(header, 'pointerdown', {...pointer, shiftKey: false, clientX: 200});
	dispatchPointer(header, 'pointermove', {...pointer, shiftKey: false, clientX: 100});
	dispatchPointer(header, 'pointerup', {...pointer, shiftKey: false, clientX: 100});
	assert.equal(container.scrollLeft, 0);

	const downEvent = dispatchPointer(header, 'pointerdown', {...pointer, shiftKey: true, clientX: 200});
	assert.equal(downEvent.defaultPrevented, true);
	const moveEvent = dispatchPointer(header, 'pointermove', {...pointer, shiftKey: true, clientX: 100});
	assert.equal(container.scrollLeft, 100);
	assert.equal(moveEvent.defaultPrevented, true);
	assert.equal(wrapper.classList.contains('is-panning'), true);
	dispatchPointer(header, 'pointerup', {...pointer, shiftKey: true, clientX: 100});
	header.click();

	assert.equal(wrapper.classList.contains('is-panning'), false);
	assert.deepEqual(rowIds(table), ['first', 'second', 'third']);
	assert.equal(instance.getSort(), null);

	instance.dispose();
});

test('fixed header panning puts cursor and selection state on the outer wrapper', () => {
	const wrapper = document.createElement('div');
	wrapper.className = 'vg-table-wrapper';
	document.body.append(wrapper);
	const table = createTable('data-sticky-header-enable="true" data-sticky-header-mode="container"');
	wrapper.append(table);
	const instance = new VGTable(table).init();
	const body = wrapper.querySelector('.vg-table-body');
	const cell = table.tBodies[0].rows[0].cells[0];
	Object.defineProperty(body, 'clientWidth', {value: 300});
	Object.defineProperty(body, 'scrollWidth', {value: 900});
	const pointer = {isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 2, shiftKey: true};

	const downEvent = dispatchPointer(cell, 'pointerdown', {...pointer, clientX: 220});
	dispatchPointer(cell, 'pointermove', {...pointer, clientX: 120});

	assert.equal(downEvent.defaultPrevented, true);
	assert.equal(body.scrollLeft, 100);
	assert.equal(wrapper.querySelector('.vg-table-header').scrollLeft, 100);
	assert.equal(body.classList.contains('is-panning'), false);
	assert.equal(wrapper.classList.contains('is-panning'), true);

	dispatchPointer(cell, 'pointerup', {...pointer, clientX: 120});
	assert.equal(wrapper.classList.contains('is-panning'), false);
	instance.dispose();
});

test('row click selection is opt-in, single by default, and emits its public event', () => {
	const table = createTable('data-selection-enabled="true"');
	const instance = new VGTable(table).init();
	const rows = Array.from(table.tBodies[0].rows);
	let detail = null;
	table.addEventListener('selectionchange.vg.table', (event) => {
		detail = event.detail;
	});

	rows[0].cells[0].click();
	assert.equal(rows[0].classList.contains('vg-table-row-selected'), true);
	assert.equal(rows[0].getAttribute('data-vg-table-selected'), 'true');
	assert.deepEqual(instance.getSelectedRows(), [rows[0]]);
	assert.equal(detail.row, rows[0]);
	assert.equal(detail.selected, true);
	assert.deepEqual(detail.keys, ['0']);

	rows[1].cells[0].click();
	assert.equal(rows[0].classList.contains('vg-table-row-selected'), false);
	assert.deepEqual(instance.getSelectedRows(), [rows[1]]);

	instance.dispose();
});

test('multiple selection can be controlled by custom interactive elements through the public API', () => {
	const table = createTable('data-selection-enabled="true" data-selection-click="false" data-selection-multiple="true"');
	const instance = new VGTable(table).init();
	const rows = Array.from(table.tBodies[0].rows);

	assert.equal(instance.selectRow(rows[0], true), true);
	assert.equal(instance.selectRow(rows[2], true), true);
	assert.deepEqual(instance.getSelectedRows(), [rows[0], rows[2]]);
	assert.equal(instance.clearSelection(), true);
	assert.deepEqual(instance.getSelectedRows(), []);

	instance.dispose();
});

test('data-pagination-* enables local pagination and exposes public state', () => {
	const table = createTable('data-pagination-enable="true" data-pagination-per-page="2"');
	const instance = new VGTable(table).init();
	const rows = Array.from(table.tBodies[0].rows);
	const wrapper = table.closest('.vg-table-wrapper');

	assert.deepEqual(instance.getPagination(), {page: 1, perPage: 2, totalPages: 2, totalRows: 3});
	assert.deepEqual(rows.map(row => row.hidden), [false, false, true]);
	assert.ok(wrapper.querySelector('.vg-table-pagination--bottom'));
	assert.ok(wrapper.querySelector('.vg-table-pagination__inner--right'));
	assert.equal(wrapper.querySelector('.vg-table-pagination--bottom').parentElement, wrapper);
	assert.equal(table.closest('.vg-table-container').querySelector('.vg-table-pagination'), null);
	assert.equal(wrapper.querySelector('input[data-pagination-per-page]'), null);
	assert.equal(wrapper.querySelector('[data-pagination-quick-input]'), null);

	assert.equal(instance.setPage(2), true);
	assert.deepEqual(rows.map(row => row.hidden), [true, true, false]);
	assert.equal(instance.getPagination().page, 2);

	instance.dispose();
	assert.deepEqual(rows.map(row => row.hidden), [false, false, false]);
});

test('pagination accepts canonical enabled/per attributes and legacy display options', () => {
	const table = createTable('data-pagination-enabled="true" data-pagination-per="1" data-pagination-show-per-page="false" data-pagination-next-label="Далее"');
	const instance = new VGTable(table).init();
	const pagination = table.closest('.vg-table-wrapper').querySelector('.vg-table-pagination');

	assert.equal(pagination.querySelector('[data-pagination-per-page]'), null);
	assert.equal(pagination.querySelector('.vg-table-page--next').getAttribute('aria-label'), 'Далее');
	assert.ok(pagination.querySelector('.vg-table-page--next .vg-table-page__chevron'));
	assert.equal(instance.getPagination().perPage, 1);

	instance.dispose();
});

test('per-page VGDropdown uses 10, 25, 50 and 100 when the control is enabled', () => {
	const table = createTable('data-pagination-enable="true" data-pagination-show-per-page="true"');
	const instance = new VGTable(table).init();
	const wrapper = table.closest('.vg-table-wrapper');
	const values = Array.from(
		wrapper.querySelectorAll('[data-pagination-per-page-option]'),
		option => option.getAttribute('data-pagination-per-page-option')
	);

	assert.deepEqual(values, ['10', '25', '50', '100']);
	assert.equal(wrapper.querySelector('.vg-table-pagination__size-heading').textContent, 'Строк на странице');
	instance.dispose();
});

test('per-page VGDropdown accepts arbitrary values and persists the selected size', () => {
	const table = createTable('id="persisted-table" data-pagination-enable="true" data-pagination-show-per-page="true" data-pagination-per-page="1" data-pagination-max-per-page="50"');
	const instance = new VGTable(table).init();
	const wrapper = table.closest('.vg-table-wrapper');
	const input = wrapper.querySelector('input[data-pagination-per-page]');
	const options = wrapper.querySelectorAll('[data-pagination-per-page-option]');

	assert.equal(input.value, '1 / на страницу');
	assert.deepEqual(Array.from(options, option => option.getAttribute('data-pagination-per-page-option')), ['1', '10', '25', '50']);
	input.dispatchEvent(new Event('focusin', {bubbles: true}));
	input.value = '3';
	input.dispatchEvent(new Event('change', {bubbles: true}));
	assert.equal(instance.getPagination().perPage, 3);
	assert.equal(input.value, '3 / на страницу');
	assert.match(window.localStorage.getItem('vg:table:pagination:persisted-table'), /"perPage":3/);

	instance.dispose();
});

test('pagination controls emit page and per-page events', () => {
	const table = createTable('data-pagination-enabled="true" data-pagination-show-per-page="true" data-pagination-per="1" data-pagination-position="both"');
	const instance = new VGTable(table).init();
	const wrapper = table.closest('.vg-table-wrapper');
	let pageDetail = null;
	let perPageDetail = null;
	table.addEventListener('pagechange.vg.table', event => { pageDetail = event.detail; });
	table.addEventListener('perpagechange.vg.table', event => { perPageDetail = event.detail; });

	wrapper.querySelector('[data-pagination-page="2"]').click();
	assert.equal(pageDetail.page, 2);
	assert.equal(pageDetail.source, 'page');
	assert.equal(wrapper.querySelectorAll('.vg-table-pagination').length, 2);

	const select = wrapper.querySelector('[data-pagination-per-page]');
	select.value = '10';
	select.dispatchEvent(new Event('change', {bubbles: true}));
	assert.equal(perPageDetail.perPage, 10);
	assert.equal(instance.getPagination().page, 1);

	instance.dispose();
});

test('pagination supports ellipsis, quick jump and refresh after sorting', () => {
	const table = createTable('data-pagination-enabled="true" data-pagination-per="1" data-pagination-threshold="2" data-pagination-visible="1" data-pagination-quick-enabled="true"');
	const body = table.tBodies[0];
	for (let index = 4; index <= 8; index += 1) {
		body.insertAdjacentHTML('beforeend', `<tr data-id="row-${index}"><td>Строка ${index}</td><td>${index}</td></tr>`);
	}
	const instance = new VGTable(table).init();
	const wrapper = table.closest('.vg-table-wrapper');
	const ellipsis = wrapper.querySelector('.vg-table-page--ellipsis');
	assert.ok(ellipsis);
	assert.equal(ellipsis.classList.contains('vg-table-page--ellipsis-hover'), true);
	assert.ok(ellipsis.querySelector('.vg-table-page__ellipsis-dots'));
	assert.ok(ellipsis.querySelector('.vg-table-page__ellipsis-chevron'));

	const quick = wrapper.querySelector('[data-pagination-quick-input]');
	quick.value = '8';
	quick.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
	assert.equal(instance.getPagination().page, 8);

	table.tHead.rows[0].cells[1].click();
	assert.equal(instance.getPagination().page, 8);
	assert.equal(Array.from(body.rows).filter(row => !row.hidden).length, 1);

	instance.dispose();
});

test('local filters support operators, pagination reset and form reset', () => {
	const form = document.createElement('form');
	form.id = 'local-table-filters';
	form.innerHTML = `
		<input data-filter-field="name" data-filter-operator="contains">
		<select data-filter-field="count" data-filter-operator="gte">
			<option value="">Любое</option><option value="5">От 5</option>
		</select>
		<button type="button" data-filter-reset>Сбросить</button>
	`;
	document.body.append(form);
	const table = createTable('data-filters-enable="true" data-filters-form="#local-table-filters" data-pagination-enable="true" data-pagination-per-page="1"');
	const instance = new VGTable(table).init();
	const name = form.querySelector('[data-filter-field="name"]');
	const count = form.querySelector('[data-filter-field="count"]');

	name.value = 'аль';
	name.dispatchEvent(new Event('change', {bubbles: true}));
	assert.equal(instance.getFilters().meta.count, 1);
	assert.equal(instance.getPagination().totalRows, 2);
	assert.deepEqual(Array.from(table.tBodies[0].rows, row => row.hidden), [true, false, true]);

	count.value = '5';
	count.dispatchEvent(new Event('change', {bubbles: true}));
	assert.equal(instance.getPagination().totalRows, 1);
	assert.deepEqual(Array.from(table.tBodies[0].rows, row => row.hidden), [true, true, false]);

	form.querySelector('[data-filter-reset]').click();
	assert.equal(instance.getFilters().meta.count, 0);
	assert.equal(instance.getPagination().totalRows, 3);
	instance.dispose();
});

test('local search combines with filters, resets pagination and can be cleared independently', () => {
	const form = document.createElement('form');
	form.id = 'local-table-search';
	form.innerHTML = `
		<input id="local-search" type="search">
		<select data-filter-field="count" data-filter-operator="gte">
			<option value="">Любое</option><option value="5">От 5</option>
		</select>
		<button type="button" data-search-reset>Очистить поиск</button>
		<button type="button" data-filter-reset>Сбросить фильтры</button>
	`;
	document.body.append(form);
	const table = createTable('data-search-enable="true" data-search-input="#local-search" data-search-debounce="0" data-filters-enable="true" data-filters-form="#local-table-search" data-pagination-enable="true" data-pagination-per-page="1"');
	const instance = new VGTable(table).init();
	const input = form.querySelector('#local-search');
	let detail = null;
	table.addEventListener('searchchange.vg.table', event => { detail = event.detail; });

	instance.setPage(2);
	input.value = 'альфа';
	input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}));
	assert.equal(detail.value, 'альфа');
	assert.equal(detail.source, 'enter');
	assert.equal(instance.getPagination().page, 1);
	assert.equal(instance.getPagination().totalRows, 2);

	const count = form.querySelector('[data-filter-field="count"]');
	count.value = '5';
	count.dispatchEvent(new Event('change', {bubbles: true}));
	assert.equal(instance.getPagination().totalRows, 1);
	assert.deepEqual(Array.from(table.tBodies[0].rows, row => row.hidden), [true, true, false]);

	form.querySelector('[data-search-reset]').click();
	assert.equal(instance.getSearch().value, '');
	assert.equal(instance.getPagination().totalRows, 2);
	assert.deepEqual(Array.from(table.tBodies[0].rows, row => row.hasAttribute('data-vg-table-filter-hidden')), [false, true, false]);
	instance.dispose();
});

test('table states distinguish empty and filtered-empty and reset query controls', () => {
	const emptyHost = document.createElement('div');
	emptyHost.innerHTML = '<table data-vg-table><thead><tr><th data-field="name">Название</th></tr></thead><tbody></tbody></table>';
	const emptyTable = emptyHost.firstElementChild;
	document.body.append(emptyTable);
	const emptyInstance = new VGTable(emptyTable).init();
	assert.equal(emptyInstance.getTableState().type, 'empty');
	assert.equal(emptyTable.querySelector('[data-vg-table-state="empty"]').textContent.includes('Нет данных'), true);
	emptyInstance.dispose();

	const form = document.createElement('form');
	form.id = 'state-search-form';
	form.innerHTML = '<input id="state-search" type="search" value="совпадений нет">';
	document.body.append(form);
	const table = createTable('data-search-enable="true" data-search-input="#state-search"');
	const instance = new VGTable(table).init();
	assert.equal(instance.getTableState().type, 'filtered-empty');
	assert.ok(table.querySelector('[data-vg-table-state-reset]'));

	table.querySelector('[data-vg-table-state-reset]').click();
	assert.equal(form.querySelector('input').value, '');
	assert.equal(instance.getTableState(), null);
	assert.equal(Array.from(table.tBodies[0].rows).filter(row => !row.hidden).length, 3);
	instance.dispose();
});

test('named params group is connected with one data-group-params attribute', () => {
	const form = document.createElement('form');
	form.id = 'grouped-filters';
	form.innerHTML = '<input data-filter-field="name" data-filter-operator="contains">';
	document.body.append(form);
	VGTable.registerParamsGroup('table-list', {
		filters: {enabled: true, form: '#grouped-filters'},
		pagination: {enabled: true, per: 2},
	});
	const table = createTable('data-group-params="table-list"');
	const instance = new VGTable(table).init();

	assert.equal(instance.getFilters().meta.count, 0);
	assert.equal(instance.getPagination().perPage, 2);
	assert.equal(VGTable.getParamsGroup('table-list').filters.form, '#grouped-filters');
	instance.dispose();
	assert.equal(VGTable.unregisterParamsGroup('table-list'), true);
});
