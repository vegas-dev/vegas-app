/**
 * Описание: регрессионные проверки жизненного цикла VGSidebar.
 * Возможности: очистка, повторная инициализация, изоляция Escape и блокировки скролла.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/module/sidebar/api'});
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'CustomEvent', 'Event', 'MutationObserver', 'history']) {
    global[key] = dom.window[key];
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;

const originalLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
    if (filename.includes(`${path.sep}node_modules${path.sep}`)) return originalLoader(module, filename);
    const result = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
        filename, presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
    });
    module._compile(result.code, filename);
};
const VGSidebar = require('../app/modules/vgsidebar/js/vgsidebar').default;
Module._extensions['.js'] = originalLoader;
const afterEvent = (element, name, action) => new Promise(resolve => {
    element.addEventListener('vg.sidebar.' + name, resolve, {once: true});
    action();
});
const show = (element, instance) => afterEvent(element, 'shown', () => instance.show());
const hide = (element, instance) => afterEvent(element, 'hidden', () => instance.hide());
const escape = () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
const errors = [];
window.addEventListener('error', event => { errors.push(event.error); event.preventDefault(); });

function create(params = {}) {
    const element = document.createElement('aside');
    element.id = 'sidebar-' + document.querySelectorAll('.vg-sidebar').length;
    element.className = 'vg-sidebar right';
    document.body.append(element);
    return {element, instance: new VGSidebar(element, {backdrop: false, overflow: false, ...params})};
}

test.beforeEach(() => {
    document.body.replaceChildren();
    document.body.className = '';
    document.body.removeAttribute('style');
    errors.length = 0;
});

test('opening and closing synchronize initially hidden sidebar accessibility', async () => {
    const {element, instance} = create();
    element.setAttribute('aria-hidden', 'true');
    await show(element, instance);
    assert.equal(element.hasAttribute('aria-hidden'), false);
    await hide(element, instance);
    assert.equal(element.getAttribute('aria-hidden'), 'true');
    await show(element, instance);
    assert.equal(element.hasAttribute('aria-hidden'), false);
    await hide(element, instance);
    instance.dispose();
});

test('dispose releases the instance and its document listener before fields are cleared', async () => {
    const {element, instance} = create();
    await show(element, instance);
    await hide(element, instance);
    assert.doesNotThrow(() => instance.dispose());
    assert.equal(VGSidebar.getInstance(element), null);
    assert.doesNotThrow(() => instance.dispose());
    escape();
    assert.deepEqual(errors, []);
    const replacement = VGSidebar.getOrCreateInstance(element, {backdrop: false, overflow: false});
    assert.notEqual(replacement, instance);
    await show(element, replacement);
    await afterEvent(element, 'hidden', escape);
    assert.equal(element.classList.contains('show'), false);
    assert.deepEqual(errors, []);
    replacement.dispose();
});

test('disposing one sidebar preserves another sidebar Escape listener and scroll lock', async () => {
    const first = create();
    const second = create({overflow: true});
    await show(second.element, second.instance);
    assert.equal(document.body.style.overflow, 'hidden');
    first.instance.dispose();
    assert.equal(document.body.style.overflow, 'hidden');
    await afterEvent(second.element, 'hidden', escape);
    assert.equal(second.element.classList.contains('show'), false);
    assert.notEqual(document.body.style.overflow, 'hidden');
    assert.deepEqual(errors, []);
    second.instance.dispose();
});

test('keyboard false emits the actual hidePrevented event only for an open sidebar', async () => {
    const {element, instance} = create({keyboard: false});
    let prevented = 0;
    element.addEventListener('hidePrevented.vg.sidebar', () => prevented++);
    escape();
    assert.equal(prevented, 0);
    await show(element, instance);
    escape();
    assert.equal(prevented, 1);
    assert.equal(element.classList.contains('show'), true);
    await hide(element, instance);
    escape();
    assert.equal(prevented, 1);
    instance.dispose();
});

test('hide can be cancelled before the panel changes state', async () => {
    const {element, instance} = create();
    await show(element, instance);
    element.addEventListener('vg.sidebar.hide', event => event.preventDefault(), {once: true});
    instance.hide();
    assert.equal(element.classList.contains('show'), true);
    await hide(element, instance);
    assert.equal(element.classList.contains('show'), false);
    instance.dispose();
});
