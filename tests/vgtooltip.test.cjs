const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const test = require('node:test');
const babel = require('@babel/core');
const { JSDOM } = require('jsdom');

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
global.MutationObserver = dom.window.MutationObserver;
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${require('node:path').sep}node_modules${require('node:path').sep}`)) {
		return originalJavaScriptLoader(module, filename);
	}

	const source = fs.readFileSync(filename, 'utf8');
	const transformed = babel.transformSync(source, {
		filename,
		presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
		sourceMaps: 'inline'
	});

	module._compile(transformed.code, filename);
};

const VGTooltip = require('../app/modules/vgtooltip/js/vgtooltip').default;
Module._extensions['.js'] = originalJavaScriptLoader;

const waitForTimers = () => new Promise(resolve => setTimeout(resolve, 15));

const createTooltip = (params = {}) => {
	const trigger = document.createElement('button');
	trigger.setAttribute('data-vg-toggle', 'tooltip');
	trigger.setAttribute('title', 'Подсказка');
	document.body.append(trigger);

	const instance = new VGTooltip(trigger, {
		delay: { show: 0, hide: 0 },
		animation: { enable: false, delay: 0 },
		...params
	});

	return { instance, trigger };
};

test.beforeEach(() => {
	document.body.replaceChildren();
	document.body.className = '';
});

test('cancels a delayed hover show when the pointer leaves the trigger quickly', async () => {
	const { instance, trigger } = createTooltip({
		delay: { show: 30, hide: 0 }
	});

	trigger.dispatchEvent(new dom.window.MouseEvent('mouseover', {
		bubbles: true
	}));
	trigger.dispatchEvent(new dom.window.MouseEvent('mouseout', {
		bubbles: true
	}));

	await new Promise(resolve => setTimeout(resolve, 50));

	assert.equal(instance._showTimeout, null);
	assert.equal(trigger.classList.contains('show'), false);
	assert.equal(trigger.hasAttribute('aria-describedby'), false);
	assert.equal(document.querySelector('.vg-tooltip'), null);
	assert.equal(document.body.classList.contains('vg-tooltip-open'), false);

	instance.dispose();
});

test('disposes an open tooltip when its trigger is removed', async () => {
	const { instance, trigger } = createTooltip();
	instance.show();
	await waitForTimers();

	const tooltipId = trigger.getAttribute('aria-describedby');
	assert.ok(tooltipId);
	assert.ok(document.getElementById(tooltipId));

	trigger.remove();
	await waitForTimers();

	assert.equal(document.getElementById(tooltipId), null);
	assert.equal(document.body.classList.contains('vg-tooltip-open'), false);
	assert.equal(trigger.classList.contains('show'), false);
	assert.equal(trigger.hasAttribute('aria-describedby'), false);
	assert.equal(trigger.getAttribute('title'), 'Подсказка');
	assert.equal(VGTooltip.getInstance(trigger), null);
});

test('resize and scroll after trigger removal cannot reposition an orphan tooltip', async () => {
	const { instance, trigger } = createTooltip();
	let placementCalls = 0;
	instance._setPlacement = () => {
		placementCalls += 1;
	};

	instance.show();
	await waitForTimers();
	const callsAfterShow = placementCalls;
	const tooltipId = trigger.getAttribute('aria-describedby');

	trigger.remove();
	window.dispatchEvent(new Event('resize'));
	window.dispatchEvent(new Event('scroll'));
	await waitForTimers();

	assert.equal(placementCalls, callsAfterShow);
	assert.equal(document.getElementById(tooltipId), null);
	assert.equal(document.querySelector('.vg-tooltip'), null);
	assert.equal(document.body.classList.contains('vg-tooltip-open'), false);
});

test('removes an orphan tooltip before opening another tooltip', async () => {
	const orphan = document.createElement('div');
	orphan.id = 'vg-tooltip-orphan';
	orphan.className = 'vg-tooltip show';
	document.body.append(orphan);
	document.body.classList.add('vg-tooltip-open');

	const { instance } = createTooltip();
	instance.show();
	await waitForTimers();

	assert.equal(document.getElementById('vg-tooltip-orphan'), null);
	assert.equal(document.querySelectorAll('.vg-tooltip.show').length, 1);
	assert.equal(document.body.classList.contains('vg-tooltip-open'), true);

	instance.dispose();
});

test('keeps ordinary show and hide lifecycle working', async () => {
	const { instance, trigger } = createTooltip();
	assert.equal(instance._triggerObserver, null);

	instance.show();
	await waitForTimers();

	assert.equal(trigger.classList.contains('show'), true);
	assert.ok(document.querySelector('.vg-tooltip.show'));
	assert.equal(document.body.classList.contains('vg-tooltip-open'), true);
	assert.ok(instance._triggerObserver);

	instance.hide();
	assert.equal(instance._triggerObserver, null);
	await waitForTimers();

	assert.equal(trigger.classList.contains('show'), false);
	assert.equal(trigger.hasAttribute('aria-describedby'), false);
	assert.equal(document.querySelector('.vg-tooltip'), null);
	assert.equal(document.body.classList.contains('vg-tooltip-open'), false);

	instance.dispose();
});

test('popover Data API renders data-vg-content as text by default', async () => {
	const trigger = document.createElement('button');
	trigger.setAttribute('data-vg-toggle', 'popover');
	trigger.setAttribute('data-vg-title', 'Заголовок');
	trigger.setAttribute('data-vg-content', '<strong>Подробности</strong>');
	trigger.setAttribute('data-delay-show', '0');
	trigger.setAttribute('data-animation-delay', '0');
	document.body.append(trigger);
	trigger.click();
	await waitForTimers();
	const tooltip = document.querySelector('.vg-tooltip-popover');
	assert.equal(tooltip.getAttribute('role'), 'dialog');
	assert.equal(tooltip.querySelector('.vg-tooltip-inner--title').textContent, 'Заголовок');
	assert.equal(tooltip.querySelector('.vg-tooltip-inner--content').textContent, '<strong>Подробности</strong>');
	assert.equal(tooltip.querySelector('strong'), null);
	VGTooltip.getInstance(trigger).dispose();
});

test('content option takes priority over alias and HTML requires opt-in', async () => {
	const { instance, trigger } = createTooltip({ content: '<em>JS content</em>', html: true, popover: true });
	trigger.dataset.vgContent = 'Alias';
	instance.show();
	await waitForTimers();
	assert.equal(document.querySelector('.vg-tooltip-inner--content em').textContent, 'JS content');
	instance.dispose();
});

test('placement arrays replace defaults and Data API overrides JavaScript arrays', () => {
	const { instance } = createTooltip({ offset: [0, 16], fallbackPlacements: ['left'] });
	assert.deepEqual(instance._params.offset, [0, 16]);
	assert.deepEqual(instance._params.fallbackPlacements, ['left']);
	instance.dispose();
	const trigger = document.createElement('button');
	trigger.dataset.params = JSON.stringify({ offset: [2, 20], fallbackPlacements: ['right'] });
	document.body.append(trigger);
	const dataInstance = new VGTooltip(trigger, { offset: [1, 10], fallbackPlacements: ['left'] });
	assert.deepEqual(dataInstance._params.offset, [2, 20]);
	assert.deepEqual(dataInstance._params.fallbackPlacements, ['right']);
	dataInstance.dispose();
});
