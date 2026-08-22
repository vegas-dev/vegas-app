const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><html lang="ru"><body></body></html>', {
	url: 'http://localhost/',
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
global.Blob = dom.window.Blob;
global.URL = dom.window.URL;
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;
dom.window.HTMLMediaElement.prototype.load = () => {};
dom.window.HTMLMediaElement.prototype.pause = () => {};
dom.window.HTMLMediaElement.prototype.play = () => Promise.resolve();

const originalJavaScriptLoader = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
	if (filename.includes(`${path.sep}node_modules${path.sep}`)) {
		return originalJavaScriptLoader(module, filename);
	}

	const source = fs.readFileSync(filename, 'utf8');
	const transformed = babel.transformSync(source, {
		filename,
		presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
		sourceMaps: 'inline',
	});

	module._compile(transformed.code, filename);
};

const VGFilePreview = require('../app/modules/vgfilepreview/js/vgfilepreview').default;
const VideoModal = require('../app/modules/vgfilepreview/js/renderers/video-modal').default;
const VideoFilePreviewRenderer = require('../app/modules/vgfilepreview/js/renderers/video').default;
Module._extensions['.js'] = originalJavaScriptLoader;

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('renders the reachable image preview controls when image preview is enabled', () => {
	const element = document.createElement('div');
	element.className = 'file';
	element.setAttribute('data-vg-filepreview', '/files/photo.jpg');
	element.setAttribute('data-fields', 'icon,name,preview');
	element.innerHTML = '<div class="icon"></div><button class="name"></button><div class="preview"></div>';
	document.body.append(element);

	const instance = new VGFilePreview(element);

	assert.equal(element.getAttribute('data-vg-filepreview-state'), 'ready');
	assert.equal(element.getAttribute('data-vg-filepreview-renderer'), 'image');
	assert.ok(element.querySelector('.vg-filepreview-image-trigger'));
	assert.ok(element.querySelector('.vg-filepreview-image-thumb'));
});

test('keeps image preview controls disabled through the public group option', () => {
	const element = document.createElement('div');
	element.setAttribute('data-vg-filepreview', '/files/photo.jpg');
	element.setAttribute('data-fields', 'name,preview');
	element.innerHTML = '<button class="name"></button><div class="preview"></div>';
	document.body.append(element);

	new VGFilePreview(element, {
		preview: {
			image: {enable: false},
		},
	});

	assert.equal(element.getAttribute('data-vg-filepreview-state'), 'ready');
	assert.equal(element.querySelector('.vg-filepreview-image-trigger'), null);
	assert.equal(element.querySelector('.vg-filepreview-image-thumb'), null);
});

test('renders video playlist navigation and switches to the next track', () => {
	const modal = new VideoModal();
	const tracks = [
		{src: 'http://localhost/files/video.mp4?clip=1', title: 'Фрагмент 1'},
		{src: 'http://localhost/files/video.mp4?clip=2', title: 'Фрагмент 2'},
	];

	modal.open({
		src: tracks[0].src,
		title: tracks[0].title,
		playlist: {tracks, currentIndex: 0},
		labels: {prev: 'Предыдущий', next: 'Следующий'},
	});

	const root = document.querySelector('.vg-filepreview-video-modal');
	const buttons = root.querySelectorAll('.vg-filepreview-video-modal__nav-btn');
	assert.equal(buttons.length, 2);
	assert.equal(buttons[0].textContent, 'Предыдущий');
	assert.equal(buttons[1].textContent, 'Следующий');

	buttons[1].click();

	assert.equal(root.querySelector('.vg-modal-title').textContent, 'Фрагмент 2');
	assert.match(root.querySelector('video').src, /clip=2$/);
});

test('collects the video playlist when opening after neighboring previews become valid', () => {
	const current = document.createElement('div');
	current.setAttribute('data-vg-filepreview', '/files/video.mp4?clip=1');
	current.setAttribute('data-vg-filepreview-valid', 'true');
	current.innerHTML = '<button class="name">Фрагмент 1</button><div class="preview"></div>';
	document.body.append(current);

	let openedPayload = null;
	const renderer = new VideoFilePreviewRenderer();
	renderer._modal = {
		open(payload) {
			openedPayload = payload;
		},
	};

	renderer.render({
		element: current,
		filePath: '/files/video.mp4?clip=1',
		fileUrl: new URL('/files/video.mp4?clip=1', window.location.origin),
		fileMeta: {ext: '.mp4', name: 'video.mp4'},
		previewContainer: current.querySelector('.preview'),
		ui: {nameOnly: false},
		i18n: {button: key => key, message: key => key},
	});

	const neighbor = document.createElement('div');
	neighbor.setAttribute('data-vg-filepreview', '/files/video.mp4?clip=2');
	neighbor.setAttribute('data-vg-filepreview-valid', 'true');
	neighbor.innerHTML = '<button class="name">Фрагмент 2</button>';
	document.body.append(neighbor);

	current.querySelector('.vg-filepreview-video-trigger').click();

	assert.equal(openedPayload.playlist.tracks.length, 2);
	assert.equal(openedPayload.playlist.tracks[1].title, 'Фрагмент 2');
});
