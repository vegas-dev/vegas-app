/**
 * Описание: регрессионные проверки публичного контракта VGSpy.
 * Возможности: Data API, конфигурация, активация, refresh и очистка экземпляров.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'CustomEvent', 'Event']) {
    global[key] = dom.window[key];
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.IntersectionObserver = class {
    constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; }
    observe(element) { this.targets.push(element); }
    disconnect() { this.targets = []; this.disconnected = true; }
};
const originalLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
    if (filename.includes(path.sep + 'node_modules' + path.sep)) return originalLoader(module, filename);
    const result = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
        filename, presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    });
    module._compile(result.code, filename);
};
const VGSpy = require('../app/modules/vgspy/js/vgspy').default;
Module._extensions['.js'] = originalLoader;

function fixture(attributes = '') {
    document.body.innerHTML = '<nav id="nav" ' + attributes + '><a href="#one">One</a><a href="#two">Two</a></nav>' +
        '<div id="root" style="overflow-y:auto"><section id="one"></section><section id="two"></section></div>';
    const nav = document.getElementById('nav');
    const root = document.getElementById('root');
    Object.defineProperties(root, { scrollHeight: { value: 900 }, clientHeight: { value: 300 } });
    for (const [index, section] of [...root.children].entries()) {
        section.getClientRects = () => [{ top: index * 300 }];
        section.getBoundingClientRect = () => ({ top: index * 300 - root.scrollTop });
    }
    root.getBoundingClientRect = () => ({ top: 0 });
    root.scrollTo = ({ top }) => { root.scrollTop = top; };
    return { nav, root, one: root.children[0], two: root.children[1] };
}

test('Data API reads options and data attributes override JavaScript', () => {
    const { nav, root } = fixture('data-vg-toggle="spy" data-target="#root" data-root-margin="0px 0px -50%" data-smooth-scroll="false" data-threshold="0.2, 0.8"');
    const spy = new VGSpy(nav, { smoothScroll: true, rootMargin: '0px' });
    assert.equal(spy._params.target, root);
    assert.equal(spy._rootElement, root);
    assert.equal(spy._params.smoothScroll, false);
    assert.deepEqual(spy._observer.options.threshold, [0.2, 0.8]);
    assert.equal(spy._observer.options.rootMargin, '0px 0px -50%');
    spy.dispose();
});

test('DOM target is preserved and threshold replaces defaults without mutating caller', () => {
    const { nav, root } = fixture();
    const threshold = [0.25, 0.75];
    const spy = new VGSpy(nav, { target: root, threshold });
    assert.equal(spy._params.target, root);
    assert.equal(spy._rootElement, root);
    assert.deepEqual(spy._observer.options.threshold, threshold);
    assert.deepEqual(threshold, [0.25, 0.75]);
    assert.equal(VGSpy.getOrCreateInstance(nav), spy);
    spy.dispose();
});

test('scroll root is detected from sections and offset retains legacy normalization', () => {
    const { nav, root } = fixture('data-offset="12"');
    const spy = new VGSpy(nav);
    assert.equal(spy._rootElement, root);
    assert.equal(spy._params.rootMargin, '12px 0px -30%');
    spy.dispose();
});

test('smooth click emits relatedTarget and dispose removes the click handler', () => {
    const { nav, root } = fixture();
    const spy = new VGSpy(nav, { target: root });
    let related = null;
    nav.addEventListener('activate.vg.spy', event => { related = event.relatedTarget; });
    const link = nav.lastElementChild;
    const click = new Event('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    assert.equal(click.defaultPrevented, true);
    assert.equal(root.scrollTop, 300);
    assert.equal(related, link);
    assert.equal(link.classList.contains('active'), true);
    const observer = spy._observer;
    spy.dispose();
    assert.equal(observer.disconnected, true);
    assert.equal(VGSpy.getInstance(nav), null);
    const after = new Event('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(after);
    assert.equal(after.defaultPrevented, false);
});

test('refresh registers added sections and forgets removed sections', () => {
    const { nav, root, two } = fixture();
    const spy = new VGSpy(nav);
    two.remove();
    nav.lastElementChild.remove();
    root.insertAdjacentHTML('beforeend', '<section id="three"></section>');
    nav.insertAdjacentHTML('beforeend', '<a href="#three">Three</a>');
    spy.refresh();
    assert.deepEqual([...spy._observableSections.keys()], ['one', 'three']);
    assert.equal(spy._observer.targets.length, 2);
    spy.dispose();
});

test('an active section can exit and re-enter without losing its active class', () => {
    const { nav, one } = fixture();
    const spy = new VGSpy(nav);
    spy._observerCallback([{ target: one, isIntersecting: true }]);
    spy._observerCallback([{ target: one, isIntersecting: false }]);
    spy._observerCallback([{ target: one, isIntersecting: true }]);
    assert.equal(nav.firstElementChild.classList.contains('active'), true);
    spy.dispose();
});

test('refresh and dispose clear stale active state', () => {
    const { nav } = fixture();
    const spy = new VGSpy(nav);
    spy._process(nav.lastElementChild);
    spy.refresh();
    assert.equal(spy._activeTarget, null);
    spy._process(nav.lastElementChild);
    spy.dispose();
    assert.equal(nav.querySelectorAll('.active').length, 0);
});

test('dropdown toggle is not a scroll target and its active state is cleared without data-target', () => {
    const { nav, root } = fixture();
    nav.insertAdjacentHTML('beforeend', '<div class="vg-dropdown"><button data-vg-toggle="dropdown">Menu</button><div id="menu"><a class="vg-dropdown-item" href="#two">Two</a></div></div>');
    const toggle = nav.querySelector('button');
    const spy = new VGSpy(nav);
    spy._process(nav.querySelector('.vg-dropdown-item'));
    assert.equal(toggle.classList.contains('active'), true);
    spy._process(nav.firstElementChild);
    assert.equal(toggle.classList.contains('active'), false);
    toggle.setAttribute('data-vg-target', '#menu');
    spy.refresh();
    assert.equal(spy._observableSections.has('menu'), false);
    const click = new Event('click', { bubbles: true, cancelable: true });
    toggle.dispatchEvent(click);
    assert.equal(click.defaultPrevented, false);
    assert.equal(root.scrollTop, 0);
    spy.dispose();
});

test('disabled anchors are neither observed nor intercepted', () => {
    const { nav } = fixture();
    nav.lastElementChild.classList.add('disabled');
    const spy = new VGSpy(nav);
    assert.equal(spy._observableSections.has('two'), false);
    const click = new Event('click', { bubbles: true, cancelable: true });
    nav.lastElementChild.dispatchEvent(click);
    assert.equal(click.defaultPrevented, false);
    spy.dispose();
});

test('virtual scrollbar listener is attached once and removed on dispose', () => {
    const { nav, root } = fixture();
    const listeners = new Set();
    root.scrollbar = {
        offset: { y: 0 },
        addListener: listener => listeners.add(listener),
        removeListener: listener => listeners.delete(listener),
    };
    const spy = new VGSpy(nav, { target: root });
    assert.equal(listeners.size, 1);
    spy.refresh();
    assert.equal(listeners.size, 1);
    spy.dispose();
    assert.equal(listeners.size, 0);
    assert.doesNotThrow(() => spy.dispose());
});
