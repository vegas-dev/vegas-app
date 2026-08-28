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
