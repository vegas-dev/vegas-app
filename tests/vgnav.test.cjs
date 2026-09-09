const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'CustomEvent', 'Event']) {
	global[key] = key === 'window' ? dom.window : dom.window[key];
}
Object.defineProperty(global, 'navigator', {value: dom.window.navigator, configurable: true});
Object.defineProperty(document.documentElement, 'clientWidth', {value: 1200, configurable: true});
Object.defineProperty(document.documentElement, 'clientHeight', {value: 800, configurable: true});

const originalLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return originalLoader(module, filename);
	module._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), {
		filename, presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
	}).code, filename);
};
const VGNav = require('../app/modules/vgnav/js/vgnav').default;
Module._extensions['.js'] = originalLoader;

const createNav = () => {
	const root = document.createElement('nav');
	root.className = 'vg-nav';
	root.innerHTML = `<ul class="vg-nav-wrapper"><li class="dropdown" id="parent">
		<a href="#">Parent</a><div class="dropdown-content"><ul><li class="dropdown" id="child">
		<a href="#">Child</a><div class="dropdown-content">Content</div>
		</li></ul></div></li></ul>`;
	document.body.append(root);
	VGNav.init(root, {hover: false, breakpoint: false, hamburger: {enable: false}});
	const instance = VGNav.getInstance(root);
	// Управляем завершением CSS-переходов без зависимости от wall-clock таймеров.
	const callbacks = [];
	instance._queueCallback = callback => callbacks.push(callback);
	const flush = () => { while (callbacks.length) callbacks.shift()(); };
	return {root, instance, flush, parent: root.querySelector('#parent'), child: root.querySelector('#child')};
};

const createOverflowNav = ({count = 0, placement = 'horizontal', keepLast = false} = {}) => {
	const root = document.createElement('nav');
	root.className = 'vg-nav';
	root.innerHTML = `<ul class="vg-nav-wrapper">
		<li id="overflow-one"><a href="#one">One</a></li>
		<li id="overflow-two"><a href="#two">Two</a></li>
		<li id="overflow-three" class="dropdown"><a href="#three">Three</a><div class="dropdown-content">Three child</div></li>
		<li id="overflow-four"${keepLast ? ' data-vg-nav-overflow="keep"' : ''}><a href="#four">Four</a></li>
	</ul>`;
	document.body.append(root);
	const wrapper = root.querySelector('.vg-nav-wrapper');
	let width = 500;
	Object.defineProperty(wrapper, 'clientWidth', {configurable: true, get: () => width});
	wrapper.getClientRects = () => [wrapper.getBoundingClientRect()];
	wrapper.getBoundingClientRect = () => ({width, left: 0, right: width, top: 0, bottom: 40, height: 40});
	[...wrapper.children].forEach((item) => {
		item.getBoundingClientRect = () => ({width: 60, left: 0, right: 60, top: 0, bottom: 40, height: 40});
	});
	VGNav.init(root, {
		hover: false,
		breakpoint: false,
		placement,
		hamburger: {enable: false},
		overflow: {enable: true, count},
	});
	const instance = VGNav.getInstance(root);
	const trigger = root.querySelector('.vg-nav-overflow');
	if (trigger) {
		trigger.getBoundingClientRect = () => ({width: 30, left: 0, right: 30, top: 0, bottom: 40, height: 40});
	}
	instance.refresh();
	return {root, wrapper, instance, trigger, setWidth: (value) => { width = value; }};
};

test.afterEach(() => document.body.replaceChildren());

test('programmatic parent hide clears every nested dropdown and emits hidden for each', () => {
	assert.equal('ontouchstart' in document.documentElement, true);
	const {root, instance, parent, child, flush} = createNav();
	const hidden = [];
	root.addEventListener('vg.nav.hidden', event => hidden.push(event.target));
	instance.show({relatedTarget: parent});
	instance.show({relatedTarget: child});
	flush();
	instance.hide({relatedTarget: parent});
	flush();
	assert.equal(root.querySelectorAll('.show, .fade, .active').length, 0);
	assert.equal(root.querySelectorAll('[aria-expanded="true"]').length, 0);
	assert.equal(hidden.length, 2);
	assert.equal(instance._openDrops.size, 0);
});

test('closing a child keeps resize tracking for its open parent', () => {
	const {instance, parent, child, flush} = createNav();
	instance.show({relatedTarget: parent});
	instance.show({relatedTarget: child});
	flush();
	const parentDrop = parent.querySelector('.dropdown-content');
	Object.defineProperty(parentDrop, 'offsetParent', {value: parent, configurable: true});
	let placements = 0;
	instance._openDrops.get(parentDrop).placement._setPlacement = () => placements++;
	instance.hide({relatedTarget: child});
	flush();
	window.dispatchEvent(new Event('resize'));
	assert.equal(placements, 1);
	instance.hide({relatedTarget: parent});
	flush();
});

test('canceled show leaves dropdown collapsed', () => {
	const {root, instance, parent, flush} = createNav();
	root.addEventListener('vg.nav.show', event => event.preventDefault());
	instance.show({relatedTarget: parent});
	flush();
	assert.equal(root.querySelectorAll('.show, .active').length, 0);
	assert.equal(parent.firstElementChild.getAttribute('aria-expanded'), 'false');
	assert.equal(parent.classList.contains('first'), false);
});

test('an old hide transition cannot close a reopened dropdown', () => {
	const {instance, parent, flush} = createNav();
	instance.show({relatedTarget: parent});
	flush();
	instance.hide({relatedTarget: parent});
	instance.show({relatedTarget: parent});
	flush();
	assert.equal(parent.querySelector('.dropdown-content').classList.contains('show'), true);
	assert.equal(parent.firstElementChild.getAttribute('aria-expanded'), 'true');
	instance.hide({relatedTarget: parent});
	flush();
});

test('smooth first-level hover opens the adjacent dropdown before closing the current one', () => {
	const root = document.createElement('nav');
	root.className = 'vg-nav';
	root.innerHTML = `<ul class="vg-nav-wrapper">
		<li class="dropdown" id="first"><a href="#">First</a><div class="dropdown-content">First content</div></li>
		<li class="dropdown" id="second"><a href="#">Second</a><div class="dropdown-content">Second content</div></li>
	</ul>`;
	document.body.append(root);
	VGNav.init(root, {
		hover: true,
		breakpoint: false,
		hamburger: {enable: false},
		hoversmoothfirstlevel: {enable: true, horizontalOnly: true},
	});
	const instance = VGNav.getInstance(root);
	const callbacks = [];
	instance._queueCallback = callback => callbacks.push(callback);
	const flush = () => { while (callbacks.length) callbacks.shift()(); };
	const smoothCallbacks = [];
	instance._scheduleSmoothSwitchCompletion = (dropContent, callback) => smoothCallbacks.push(callback);
	const first = root.querySelector('#first');
	const second = root.querySelector('#second');
	const lifecycle = [];
	let adjacentVisibleBeforeHide = false;
	root.addEventListener('vg.nav.show', event => lifecycle.push(`show:${event.target.id}`));
	root.addEventListener('vg.nav.hide', event => {
		lifecycle.push(`hide:${event.target.id}`);
		if (event.target === first) {
			adjacentVisibleBeforeHide = second.querySelector('.dropdown-content').classList.contains('fade');
		}
	});

	first.dispatchEvent(new dom.window.MouseEvent('mousemove', {bubbles: true, clientX: 10, clientY: 10}));
	first.dispatchEvent(new dom.window.MouseEvent('mouseover', {bubbles: true, relatedTarget: document.body, clientX: 10, clientY: 10}));
	flush();
	first.dispatchEvent(new dom.window.MouseEvent('mouseout', {bubbles: true, relatedTarget: second, clientX: 80, clientY: 10}));
	second.dispatchEvent(new dom.window.MouseEvent('mouseover', {bubbles: true, relatedTarget: first, clientX: 80, clientY: 10}));

	assert.deepEqual(lifecycle, ['show:first', 'show:second']);
	assert.equal(first.classList.contains('active'), true);
	assert.equal(second.classList.contains('active'), true);
	assert.equal(second.querySelector('.dropdown-content').classList.contains('fade'), true);
	assert.equal(second.firstElementChild.getAttribute('aria-expanded'), 'true');
	assert.equal(smoothCallbacks.length, 1);
	smoothCallbacks.shift()();
	assert.deepEqual(lifecycle, ['show:first', 'show:second', 'hide:first']);
	assert.equal(adjacentVisibleBeforeHide, true);
	assert.equal(first.classList.contains('active'), false);
	flush();
});

test('nested dropdown positioning writes coordinates and stays within a narrow viewport', () => {
	const {instance, parent, child, flush} = createNav();
	const rect = (left, top, width, height) => ({left, top, width, height, right: left + width, bottom: top + height});
	Object.defineProperty(document.documentElement, 'clientWidth', {value: 390, configurable: true});
	const parentDrop = parent.querySelector('.dropdown-content');
	const childDrop = child.querySelector('.dropdown-content');
	parent.getBoundingClientRect = () => rect(29, 300, 100, 46);
	child.getBoundingClientRect = () => rect(30, 400, 254, 49);
	parentDrop.getBoundingClientRect = () => rect(29, 352, 256, 99);
	childDrop.getBoundingClientRect = () => rect(0, 0, 256, 99);
	Object.defineProperty(parentDrop, 'offsetParent', {value: parent});
	Object.defineProperty(childDrop, 'offsetParent', {value: child});
	try {
		instance.show({relatedTarget: parent});
		instance.show({relatedTarget: child});
		flush();
		assert.equal(childDrop.style.position, 'absolute');
		const viewportLeft = 30 + parseFloat(childDrop.style.left);
		assert.ok(viewportLeft >= 0 && viewportLeft + 256 <= 390);
		assert.ok(Number.isFinite(parseFloat(childDrop.style.top)));
	} finally {
		instance.hide({relatedTarget: parent});
		flush();
		Object.defineProperty(document.documentElement, 'clientWidth', {value: 1200, configurable: true});
	}
});

test('hamburger aria-expanded is not treated as a dropdown click', () => {
	const {root, instance} = createNav();
	const hamburger = document.createElement('a');
	hamburger.className = 'vg-nav-hamburger';
	hamburger.href = '#sidebar';
	hamburger.setAttribute('aria-expanded', 'true');
	root.append(hamburger);
	let dropdownClicks = 0;
	instance._params.callbacks.afterClick = () => dropdownClicks++;
	hamburger.dispatchEvent(new dom.window.MouseEvent('click', {bubbles: true, cancelable: true}));
	assert.equal(dropdownClicks, 0);
	assert.doesNotThrow(() => instance.show({relatedTarget: hamburger}));
});

test('horizontal overflow moves a trailing suffix and restores it when width grows', () => {
	const {wrapper, instance, trigger, setWidth} = createOverflowNav();
	setWidth(150);
	instance.refresh();
	assert.deepEqual([...wrapper.children].filter(item => item !== trigger).map(item => item.id), ['overflow-one', 'overflow-two']);
	assert.deepEqual([...trigger.querySelector('.vg-nav-overflow-list').children].map(item => item.id), ['overflow-three', 'overflow-four']);
	assert.equal(trigger.hidden, false);

	setWidth(300);
	instance.refresh();
	assert.deepEqual([...wrapper.children].filter(item => item !== trigger).map(item => item.id), [
		'overflow-one', 'overflow-two', 'overflow-three', 'overflow-four'
	]);
	assert.equal(trigger.hidden, true);
});

test('overflow count limits visible first-level items without depending on width', () => {
	const {wrapper, trigger} = createOverflowNav({count: 2});
	assert.deepEqual([...wrapper.children].filter(item => item !== trigger).map(item => item.id), ['overflow-one', 'overflow-two']);
	assert.deepEqual([...trigger.querySelector('.vg-nav-overflow-list').children].map(item => item.id), ['overflow-three', 'overflow-four']);
	assert.equal(trigger.querySelector('svg path').getAttribute('fill'), 'currentColor');
	assert.equal(trigger.firstElementChild.getAttribute('aria-label'), 'Другие разделы');
});

test('overflow keep selector takes priority over count', () => {
	const {wrapper, trigger} = createOverflowNav({count: 2, keepLast: true});
	assert.deepEqual([...wrapper.children].filter(item => item !== trigger).map(item => item.id), ['overflow-one', 'overflow-four']);
	assert.deepEqual([...trigger.querySelector('.vg-nav-overflow-list').children].map(item => item.id), ['overflow-two', 'overflow-three']);
});

test('moved first-level dropdown keeps its nested content and can be opened', () => {
	const {instance, trigger} = createOverflowNav({count: 2});
	const movedDropdown = trigger.querySelector('#overflow-three');
	const callbacks = [];
	instance._queueCallback = callback => callbacks.push(callback);
	instance.show({relatedTarget: movedDropdown});
	while (callbacks.length) callbacks.shift()();
	assert.equal(movedDropdown.classList.contains('active'), true);
	assert.equal(movedDropdown.querySelector('.dropdown-content').classList.contains('show'), true);
	instance.hide({relatedTarget: movedDropdown});
	while (callbacks.length) callbacks.shift()();
});

test('overflow is ignored for vertical navigation', () => {
	const {wrapper, trigger} = createOverflowNav({count: 1, placement: 'vertical'});
	assert.equal(trigger, null);
	assert.equal(wrapper.querySelectorAll(':scope > li').length, 4);
});

test('dispose restores original items and removes generated overflow markup', () => {
	const {root, wrapper, instance} = createOverflowNav({count: 2});
	instance.dispose();
	assert.deepEqual([...wrapper.children].map(item => item.id), [
		'overflow-one', 'overflow-two', 'overflow-three', 'overflow-four'
	]);
	assert.equal(root.querySelector('.vg-nav-overflow'), null);
	assert.equal(root.classList.contains('vg-nav-overflow-enabled'), false);
});
