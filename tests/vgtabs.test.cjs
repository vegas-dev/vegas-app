/**
 * Описание: регрессии публичного контракта VGTabs.
 * Возможности: JS/Data API, hash, события, клавиатура, индикатор и AJAX.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'CustomEvent', 'Event', 'KeyboardEvent']) {
    global[key] = dom.window[key];
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.ResizeObserver = class {
    constructor(callback) { this.callback = callback; }
    observe() {}
    disconnect() { this.disconnected = true; }
};
const originalLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
    if (filename.includes(path.sep + 'node_modules' + path.sep)) return originalLoader(module, filename);
    const result = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
        filename, presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    });
    module._compile(result.code, filename);
};
const VGTabs = require('../app/modules/vgtabs/js/vgtabs').default;
const Ajax = require('../app/utils/js/components/ajax').default;
Module._extensions['.js'] = originalLoader;
const tick = () => new Promise(resolve => setTimeout(resolve, 20));

function fixture(attributes = '') {
    document.querySelectorAll('[data-vg-toggle="tab"]').forEach(el => VGTabs.getInstance(el)?.dispose());
    window.history.replaceState(null, '', '/');
    document.body.innerHTML = `<div class="vg-tabs" ${attributes}><div class="vg-tabs-panel">
      <button id="one" class="vg-tabs-link active" data-vg-toggle="tab" data-vg-target="#pane-one">One</button>
      <button id="two" class="vg-tabs-link" data-vg-toggle="tab" data-vg-target="#pane-two"><span>Two</span></button>
      <button id="three" class="vg-tabs-link" data-vg-toggle="tab" data-vg-target="#pane-three" disabled>Three</button>
    </div></div><div class="vg-tabs-content"><div id="pane-one" class="vg-tabs-pane active show"></div>
    <div id="pane-two" class="vg-tabs-pane"></div><div id="pane-three" class="vg-tabs-pane"></div></div>`;
    return ['one', 'two', 'three'].map(id => document.getElementById(id));
}

test('JS parameters work, data overrides them, instances stay isolated', () => {
    const [one, two] = fixture('data-hash="false"');
    const config = { slide: true, hash: true, ajax: { once: false } };
    const first = new VGTabs(one, config);
    assert.equal(first._params.slide, true);
    assert.equal(first._params.hash, false);
    assert.equal(first._params.ajax.once, false);
    const second = new VGTabs(two);
    assert.equal(second._params.ajax.once, true);
    assert.equal(config.hash, true);
    assert.equal(VGTabs.getOrCreateInstance(one), first);
});

test('show emits paired relatedTarget and cancellation preserves state', () => {
    const [one, two, three] = fixture();
    new VGTabs(one);
    const next = new VGTabs(two);
    const events = [];
    for (const name of ['hide', 'show', 'hidden', 'shown']) {
        document.body.addEventListener('vg.tabs.' + name, event => events.push([name, event.target.id, event.relatedTarget?.id]), { once: true });
    }
    next.show();
    assert.deepEqual(events, [['hide', 'one', 'two'], ['show', 'two', 'one'], ['hidden', 'one', 'two'], ['shown', 'two', 'one']]);
    assert.equal(two.getAttribute('aria-selected'), 'true');
    assert.equal(one.getAttribute('tabindex'), '-1');
    assert.equal(document.querySelector('#pane-two').classList.contains('active'), true);
    new VGTabs(three).show();
    assert.equal(three.classList.contains('active'), false);
    one.addEventListener('vg.tabs.show', event => event.preventDefault(), { once: true });
    VGTabs.getInstance(one).show();
    assert.equal(two.classList.contains('active'), true);
    two.addEventListener('vg.tabs.hide', event => event.preventDefault(), { once: true });
    VGTabs.getInstance(one).show();
    assert.equal(two.classList.contains('active'), true);
});

test('hash matches a sibling data-vg-target, ignores disabled and malformed hash', () => {
    let [one, two] = fixture('data-hash="true"');
    window.history.replaceState(null, '', '/#pane-two');
    new VGTabs(one);
    assert.equal(two.classList.contains('active'), true);
    assert.equal(two.hasAttribute('tabindex'), false);
    [one] = fixture('data-hash="true"');
    window.history.replaceState(null, '', '/#pane-three');
    new VGTabs(one);
    assert.equal(one.classList.contains('active'), true);
    [one] = fixture('data-hash="true"');
    window.history.replaceState(null, '', '/#%E0%A4%A');
    assert.doesNotThrow(() => new VGTabs(one));
});

test('keyboard wraps, skips disabled, supports Home and End', () => {
    const [one, two] = fixture();
    new VGTabs(one);
    one.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    assert.equal(document.activeElement, two);
    two.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    assert.equal(document.activeElement, one);
    one.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.equal(document.activeElement, two);
    two.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    assert.equal(document.activeElement, one);
});

test('slider follows child hover, show, resize and transfers its owner on dispose', () => {
    const [one, two] = fixture('data-slide="true"');
    for (const [index, tab] of [one, two].entries()) {
        tab.style.width = `${80 + index * 10}px`;
        tab.style.height = '30px';
        Object.defineProperties(tab, { offsetLeft: { value: index * 100 }, offsetTop: { value: index * 40 } });
    }
    const first = new VGTabs(one);
    const second = new VGTabs(two);
    const slider = document.querySelector('.vg-tabs-slider');
    assert.equal(document.querySelectorAll('.vg-tabs-slider').length, 1);
    assert.equal(second._sliderOver, null);
    two.firstElementChild.dispatchEvent(new dom.window.MouseEvent('mouseover', { bubbles: true }));
    assert.equal(slider.style.width, '90px');
    assert.equal(slider.style.top, '40px');
    second.show();
    two.style.width = '120px';
    window.dispatchEvent(new Event('resize'));
    assert.equal(slider.style.width, '120px');
    const observer = first._sliderObserver;
    first.dispose();
    assert.equal(observer.disconnected, true);
    assert.equal(typeof second._sliderOver, 'function');
    second.dispose();
    assert.equal(VGTabs.getInstance(two), null);
    assert.equal(document.querySelector('.vg-tabs-slider'), null);
    assert.doesNotThrow(() => window.dispatchEvent(new Event('resize')));
});

test('dispose removes keyboard handling; Data API can create a fresh instance', () => {
    const [one, two] = fixture();
    const instance = new VGTabs(one);
    instance.dispose();
    one.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    assert.equal(one.classList.contains('active'), true);
    two.click();
    assert.equal(two.classList.contains('active'), true);
    assert.ok(VGTabs.getInstance(two));
});

test('AJAX caches success, not errors, and avoids parallel requests per tab', async () => {
    const [one, two] = fixture();
    const originalGet = Ajax.prototype.get;
    let requests = 0;
    let complete;
    Ajax.prototype.get = (url, callbacks) => { requests++; complete = callbacks; };
    try {
        const first = new VGTabs(one);
        const next = new VGTabs(two, { ajax: { route: '/content', target: '#pane-two', loader: true } });
        const events = [];
        two.addEventListener('vg.tabs.loaded', event => events.push(event.stats));
        next.show();
        assert.ok(document.querySelector('#pane-two .vg-loader'));
        await tick();
        first.show(); next.show(); await tick();
        assert.equal(requests, 1);
        complete.onError({ code: 503, response: 'error' });
        assert.equal(next._isLoaded, false);
        assert.equal(document.querySelector('#pane-two .vg-loader'), null);
        first.show(); next.show(); await tick();
        assert.equal(requests, 2);
        complete.onSuccess({ code: 200, response: '<strong>Loaded</strong>' });
        assert.equal(document.querySelector('#pane-two').innerHTML, '<strong>Loaded</strong>');
        first.show(); next.show(); await tick();
        assert.equal(requests, 2);
        assert.deepEqual(events, ['error', 'success']);
    } finally { Ajax.prototype.get = originalGet; }
});

test('AJAX once=false and output=false emit every response without replacing content', async () => {
    const [one, two] = fixture();
    const originalGet = Ajax.prototype.get;
    let requests = 0;
    Ajax.prototype.get = (url, callbacks) => {
        requests++;
        callbacks.onSuccess({ code: 200, response: { tasks: requests } });
    };
    try {
        const first = new VGTabs(one);
        const next = new VGTabs(two, { ajax: { route: '/json', once: false, output: false, target: '#pane-two' } });
        document.querySelector('#pane-two').textContent = 'Local';
        let payload;
        two.addEventListener('vg.tabs.loaded', event => { payload = event.data.response; });
        next.show(); await tick(); first.show(); next.show(); await tick();
        assert.equal(requests, 2);
        assert.deepEqual(payload, { tasks: 2 });
        assert.equal(document.querySelector('#pane-two').textContent, 'Local');
    } finally { Ajax.prototype.get = originalGet; }
});
