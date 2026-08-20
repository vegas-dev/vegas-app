const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html lang="en"><body></body></html>', {
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
global.File = dom.window.File;
global.MutationObserver = dom.window.MutationObserver;
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;
dom.window.URL.createObjectURL = file => `blob:test/${encodeURIComponent(file.name)}`;
dom.window.URL.revokeObjectURL = () => {};
global.URL = dom.window.URL;

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) {
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

const VGFiles = require('../app/modules/vgfiles/js/vgfiles').default;
Module._extensions['.js'] = originalJavaScriptLoader;

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('keeps the size validation error visible in single replace mode', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<label for="single-file" class="vg-files-label">Select file</label>
		<div class="vg-files-stat"><span class="vg-files-stat-count"></span></div>
		<div class="vg-files-info"></div>
		<input id="single-file" name="file" type="file" data-vg-toggle="files">
	`;
	document.body.append(container);

	const instance = new VGFiles(container, {
		lang: 'en',
		limits: { count: 1, sizes: 30, total: 0 }
	});
	const oversizedFile = new File(['content'], 'oversized.bin', {
		type: 'application/octet-stream'
	});
	Object.defineProperty(oversizedFile, 'size', {
		value: 100 * 1024 * 1024
	});

	instance.change({ files: [oversizedFile] });

	assert.equal(instance._files.length, 0);
	assert.equal(instance._errors.has('is-sizes'), true);
	assert.equal(
		container.querySelector('.vg-files-errors .error-item')?.textContent,
		'File size exceeded'
	);

	const validFile = new File(['content'], 'valid.bin', {
		type: 'application/octet-stream'
	});
	instance.change({ files: [validFile] });

	assert.deepEqual(instance._files, [validFile]);
	assert.equal(container.querySelector('.vg-files-errors'), null);

	instance.dispose();
});
