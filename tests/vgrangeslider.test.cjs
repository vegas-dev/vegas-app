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
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
const loader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) return loader(module, filename);
	module._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), {
		filename, presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
	}).code, filename);
};
const VGRangeSlider = require('../app/modules/vgrangeslider/js/vgrangeslider').default;
Module._extensions['.js'] = loader;

const instances = [];
const create = (params = {}, html = '<div id="slider"></div>') => {
	document.body.innerHTML = html;
	const element = document.querySelector('#slider');
	const slider = VGRangeSlider.init(element, params);
	instances.push(slider);
	return {element, slider};
};
test.afterEach(() => {
	instances.splice(0).forEach(slider => { if (slider._element) slider.dispose(); });
	document.body.replaceChildren();
});

test('native input uses its attributes and init returns the same instance', () => {
	const {element, slider} = create({}, '<label for="slider">Volume</label><input id="slider" type="range" name="volume" min="0" max="100" step="5" value="35">');
	assert.equal(slider.getValue(), 35);
	assert.equal(VGRangeSlider.init(element), slider);
	assert.equal(document.querySelectorAll('.vg-range-slider').length, 1);
	slider.setValue(52);
	assert.equal(element.value, '50');
});

test('range synchronizes external hidden inputs without moving or duplicating them', () => {
	const {slider} = create({range: true, start: [20, 80], input: {min: '#from', max: '#to'}},
		'<form><div id="slider"></div><input id="from" type="hidden" name="from"><input id="to" type="hidden" name="to"></form>');
	assert.equal(document.querySelector('#from').value, '20');
	assert.equal(document.querySelector('#to').value, '80');
	slider.setValue([35, 65]);
	const data = new dom.window.FormData(document.querySelector('form'));
	assert.deepEqual([...data.entries()], [['from', '35'], ['to', '65']]);
	assert.equal(document.querySelector('#from').parentElement.tagName, 'FORM');
});

test('ruler tick coordinates follow viewport resizing', () => {
	const {element, slider} = create({skin: 'ruler', ruler: {values: [0, 25, 100], dimInactive: true}, start: 30});
	const wrapper = element.querySelector('.vg-range-slider__wrapper');
	Object.defineProperty(wrapper, 'clientWidth', {value: 400, configurable: true});
	window.dispatchEvent(new Event('resize'));
	const last = element.querySelectorAll('.vg-range-slider__ruler-item')[2];
	const wide = parseFloat(last.style.left);
	Object.defineProperty(wrapper, 'clientWidth', {value: 200, configurable: true});
	window.dispatchEvent(new Event('resize'));
	const narrow = parseFloat(last.style.left);
	assert.ok(wide > narrow && narrow > 0);
	assert.equal(element.querySelectorAll('.vg-range-slider__ruler-item.is-active').length, 2);
	assert.equal(slider.getValue(), 30);
});

test('single-slider event status follows the current value rather than the start value', () => {
	const {element, slider} = create({skin: 'status', start: 80, labelWords: ['Low', 'Medium', 'High']});
	let detail;
	element.addEventListener('vg.rangeslider.update', event => { detail = event.detail; });
	slider.setValue(10);
	assert.equal(detail.to, 10);
	assert.equal(detail.status.sourceValue, 10);
	assert.equal(detail.status.tone, 'danger');
	assert.equal(element.classList.contains('is-status-danger'), true);
});

test('step rounding never exceeds max or disagrees with the native range value', () => {
	const {element, slider} = create({min: 0, max: 5, step: 3, start: 5});
	assert.equal(slider.getValue(), 3);
	slider.setValue(100);
	assert.equal(slider.getValue(), 3);
	assert.equal(Number(element.querySelector('input[type="range"]').value), slider.getValue());
});

test('range sorts programmatic values, prevents crossing, and supports silent updates', () => {
	const {element, slider} = create({range: true, start: [20, 80], name: {min: 'min', max: 'max'}});
	slider.setValue([90, 10]);
	assert.deepEqual(slider.getValue(), [10, 90]);
	let updates = 0;
	element.addEventListener('vg.rangeslider.update', () => updates++);
	slider.setValue([30, 60], {silent: true});
	assert.equal(updates, 0);
	const from = element.querySelector('.vg-range-slider__input--from');
	from.value = '90';
	from.dispatchEvent(new Event('input', {bubbles: true}));
	assert.deepEqual(slider.getValue(), [60, 60]);
	assert.equal(element.querySelector('input[name="min"]').value, '60');
});

test('disable, enable, formatting and disposal respect their public contracts', () => {
	const {element, slider} = create({start: 25, output: '#output', formatValue: value => value + ' units'},
		'<div id="slider"></div><output id="output"></output>');
	const input = element.querySelector('input[type="range"]');
	assert.equal(document.querySelector('#output').textContent, '25 units');
	slider.disable();
	assert.equal(input.disabled, true);
	slider.enable();
	assert.equal(input.disabled, false);
	let changes = 0;
	element.addEventListener('vg.rangeslider.change', () => changes++);
	slider.setValue(50, {emit: 'change'});
	assert.equal(changes, 1);
	slider.dispose();
	assert.equal(VGRangeSlider.getInstance(element), null);
	input.dispatchEvent(new Event('change', {bubbles: true}));
	assert.equal(changes, 1);
});
