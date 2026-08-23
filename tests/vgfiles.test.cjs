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
const VGFilesDroppable = require('../app/modules/vgfiles/js/droppable').default;
const sortableModule = require('../app/modules/vgfiles/js/sortable');
const VGFilesSortable = sortableModule.default;
const { VG_FILES_SORTABLE_DATA_TYPE } = sortableModule;
Module._extensions['.js'] = originalJavaScriptLoader;

test.beforeEach(() => {
	document.body.replaceChildren();
});

test('keeps an invalid file visible with its error in single replace mode', () => {
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

	assert.deepEqual(instance._files, [oversizedFile]);
	assert.equal(instance._errors.has('is-sizes'), true);
	const invalidItem = container.querySelector('.vg-files-info--list > li');
	assert.equal(invalidItem.classList.contains('failing'), true);
	assert.equal(invalidItem.classList.contains('validation-error'), true);
	assert.equal(invalidItem.querySelector('.file-validation-error'), null);
	assert.equal(container.querySelector('#single-file').hasAttribute('name'), false);
	assert.equal(
		container.querySelector('.vg-files-errors .error-item')?.textContent,
		'oversized.bin — File size exceeded'
	);

	const validFile = new File(['content'], 'valid.bin', {
		type: 'application/octet-stream'
	});
	instance.change({ files: [validFile] });

	assert.deepEqual(instance._files, [validFile]);
	assert.equal(container.querySelector('#single-file').name, 'file');
	assert.equal(container.querySelector('.vg-files-errors'), null);

	instance.dispose();
});

test('shows an AJAX-invalid file as failed and never sends it to the uploader', async () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<label for="ajax-files" class="vg-files-label">Select files</label>
		<div class="vg-files-stat"><span class="vg-files-stat-count"></span></div>
		<div class="vg-files-info"></div>
		<input id="ajax-files" name="files[]" type="file" data-vg-toggle="files" multiple>
	`;
	document.body.append(container);

	const instance = new VGFiles(container, {
		ajax: true,
		lang: 'en',
		limits: { count: 0, sizes: 1, total: 0 }
	});
	const oversizedFile = new File(['content'], 'oversized.bin', {
		type: 'application/octet-stream'
	});
	Object.defineProperty(oversizedFile, 'size', {
		value: 10 * 1024 * 1024
	});

	instance.change({ files: [oversizedFile] });

	assert.deepEqual(instance._files, [oversizedFile]);
	assert.equal(container.querySelector('.vg-files-stat').classList.contains('show'), true);
	assert.equal(container.querySelector('.vg-files-info').classList.contains('show'), true);
	assert.equal(container.querySelector('.vg-files-info--list > li').classList.contains('failing'), true);
	assert.equal(
		container.querySelector('.vg-files-errors .error-item')?.textContent,
		'oversized.bin — File size exceeded'
	);

	let uploadedFiles = null;
	instance._params.uploads.route = '/upload';
	instance._uploader = {
		isIdle: () => false,
		uploadFiles: async files => { uploadedFiles = files; }
	};
	await instance.uploadAll(instance._files);
	assert.equal(uploadedFiles, null);
	assert.equal(instance._pendingUploadedKeys.size, 0);

	const validFile = new File(['content'], 'valid.bin', {
		type: 'application/octet-stream'
	});
	instance.change({ files: [validFile] });

	assert.equal(container.querySelector('.vg-files-stat').classList.contains('show'), true);
	assert.equal(container.querySelector('.vg-files-info').classList.contains('show'), true);
	await instance.uploadAll(instance._files);
	assert.deepEqual(uploadedFiles, [validFile]);
	assert.equal(instance._pendingUploadedKeys.has(instance._getFileKey(validFile)), true);
	assert.equal(instance._pendingUploadedKeys.has(instance._getFileKey(oversizedFile)), false);

	instance.dispose();
});

test('file dismiss uses the compact remove icon in list and dropzone modes', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<label class="vg-files-drop"><ul class="vg-files-drop--list"></ul></label>
		<input type="file" multiple>
	`;
	document.body.append(container);

	const instance = new VGFiles(container, { info: false });
	const dismiss = instance._setButtonElement({
		name: 'photo.jpg',
		size: 1024,
		type: 'image/jpeg'
	});

	assert.equal(dismiss.dataset.vgDismiss, 'file');
	assert.ok(dismiss.querySelector('svg.vg-icon-remove'));

	instance._params.info = true;
	const infoDismiss = instance._setButtonElement({
		name: 'document.pdf',
		size: 2048,
		type: 'application/pdf'
	});
	assert.ok(infoDismiss.querySelector('svg.vg-icon-remove'));

	instance.dispose();
});

test('highlights a rejected dropzone tile without rendering an inline error', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<label class="vg-files-drop">
			<span class="vg-files-drop-message show"><span class="title">Drop files</span></span>
			<ul class="vg-files-drop--list"></ul>
		</label>
		<input type="file" data-vg-toggle="files" multiple>
	`;
	document.body.append(container);

	const instance = new VGFiles(container, {
		lang: 'en',
		limits: { count: 0, sizes: 1, total: 0 }
	});
	const oversizedFile = new File(['content'], 'large-photo.jpg', { type: 'image/jpeg' });
	Object.defineProperty(oversizedFile, 'size', { value: 5 * 1024 * 1024 });

	instance.change({ files: [oversizedFile] });

	const tile = container.querySelector('.vg-files-drop--list > li');
	assert.equal(tile.classList.contains('validation-error'), true);
	assert.equal(tile.querySelector('.file-validation-error'), null);
	assert.equal(container.querySelector('.vg-files-errors .error-item')?.textContent, 'large-photo.jpg — File size exceeded');

	instance.dispose();
});

test('shortens a long file name in the validation summary and keeps the full label in title', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<div class="vg-files-info"></div>
		<input type="file" data-vg-toggle="files">
	`;
	document.body.append(container);

	const instance = new VGFiles(container, {
		lang: 'en',
		limits: { count: 1, sizes: 1, total: 0 }
	});
	const longFile = new File(['content'], 'beige-leaf-patterned-design-space.jpg', { type: 'image/jpeg' });
	Object.defineProperty(longFile, 'size', { value: 5 * 1024 * 1024 });

	instance.change({ files: [longFile] });

	const error = container.querySelector('.vg-files-errors .error-item');
	assert.equal(error?.textContent, 'beige....jpg — File size exceeded');
	assert.equal(error?.title, 'beige-leaf-patterned-design-space.jpg — File size exceeded');

	instance.dispose();
});

test('does not add files rejected by the count limit to the list', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<div class="vg-files-info"></div>
		<input type="file" data-vg-toggle="files" multiple>
	`;
	document.body.append(container);

	const instance = new VGFiles(container, {
		lang: 'en',
		limits: { count: 1, sizes: 10, total: 0 }
	});
	const firstFile = new File(['first'], 'first.txt', { type: 'text/plain' });
	const extraFile = new File(['extra'], 'extra.txt', { type: 'text/plain' });

	instance.change({ files: [firstFile, extraFile] });

	assert.deepEqual(instance._files, [firstFile]);
	assert.equal(container.querySelectorAll('.vg-files-info--list > li').length, 1);
	assert.equal(container.querySelector('.vg-files-info--list > li')?.dataset.name, 'first.txt');
	assert.equal(container.querySelector('.vg-files-errors .error-item')?.textContent, 'Exceeded the limit on the number of files');

	instance.dispose();
});

test('custom file buttons are hidden for unavailable upload states by default', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<div class="vg-files-info">
			<ul class="vg-files-info--list">
				<li class="file">
					<div class="file-info"></div>
					<div class="file-custom">
						<div class="file-remove"></div>
						<div class="file-zoom"><button type="button">Zoom</button></div>
						<div class="file-edit"><button type="button">Edit</button></div>
						<div class="file-visible"><button type="button">Visibility</button></div>
					</div>
				</li>
			</ul>
		</div>
		<input type="file" multiple>
	`;
	document.body.append(container);

	const instance = new VGFiles(container, { ajax: true });
	const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
	instance._files = [file];
	instance._pendingUploadedKeys.add(instance._getFileKey(file));
	instance._renderUI(instance._files);

	const item = container.querySelector('.vg-files-info--list > li');
	assert.equal(item.classList.contains('hide-custom-buttons-on-upload-state'), true);
	assert.equal(item.classList.contains('pending'), true);
	assert.ok(item.querySelector('.file-remove'));
	assert.ok(item.querySelector('.file-zoom'));
	assert.ok(item.querySelector('.file-edit'));
	assert.ok(item.querySelector('.file-visible'));

	instance.dispose();
});

test('custom file button upload-state hiding can be disabled', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<div class="vg-files-info">
			<ul class="vg-files-info--list">
				<li class="file">
					<div class="file-info"></div>
					<div class="file-actions"><button type="button">Custom action</button></div>
					<div class="file-remove"></div>
				</li>
			</ul>
		</div>
		<input type="file" multiple>
	`;
	document.body.append(container);

	const instance = new VGFiles(container, {
		ajax: true,
		customButtons: { hideOnUploadState: false }
	});
	const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
	instance._files = [file];
	instance._failingUploadedKeys.add(instance._getFileKey(file));
	instance._renderUI(instance._files);

	const item = container.querySelector('.vg-files-info--list > li');
	assert.equal(instance._params.customButtons.hideOnUploadState, false);
	assert.equal(item.classList.contains('hide-custom-buttons-on-upload-state'), false);
	assert.ok(item.querySelector('.file-actions button'));

	instance.dispose();
});

test('smartdrop ignores an internal sortable drag even when DataTransfer exposes files', () => {
	const drop = document.createElement('label');
	drop.className = 'vg-files-drop';
	document.body.append(drop);

	const instance = new VGFilesDroppable(drop);
	const transferredFile = new File(['content'], 'already-uploaded.jpg', {
		type: 'image/jpeg'
	});
	const sortableTransfer = {
		files: [transferredFile],
		items: [{ kind: 'file' }],
		types: ['Files', 'text/plain'],
		getData: type => type === 'text/plain' ? 'vgsortable' : ''
	};

	assert.equal(instance._isSortableDrag({ dataTransfer: sortableTransfer }), true);
	assert.equal(instance._isFileDrag({ dataTransfer: sortableTransfer }), false);

	sortableTransfer.getData = () => '';
	assert.equal(instance._isFileDrag({ dataTransfer: sortableTransfer }), true);

	instance.dispose();
});

test('sortable reorders uploaded drop tiles without handing them to smartdrop', () => {
	const container = document.createElement('div');
	container.className = 'vg-files';
	container.innerHTML = `
		<label class="vg-files-drop">
			<ul class="vg-files-drop--list">
				<li class="file" data-id="1">First</li>
				<li class="file" data-id="2">Second</li>
			</ul>
		</label>
		<input type="file" multiple>
	`;
	document.body.append(container);

	const list = container.querySelector('.vg-files-drop--list');
	const drop = container.querySelector('.vg-files-drop');
	const input = container.querySelector('input');
	const sortable = new VGFilesSortable({
		_element: container,
		_nodes: { list },
		_triggerCallback() {}
	}, { route: '/api/files/sort' });
	const droppable = new VGFilesDroppable(drop, { smartdrop: true });
	const transferData = new Map();
	const dataTransfer = {
		files: [new File(['content'], 'already-uploaded.jpg', { type: 'image/jpeg' })],
		items: [{ kind: 'file' }],
		get types() { return ['Files', ...transferData.keys()]; },
		effectAllowed: 'all',
		dropEffect: 'none',
		setData(type, value) { transferData.set(type, value); },
		getData(type) { return transferData.get(type) || ''; }
	};
	const dispatchDrag = (target, type, clientY = 0) => {
		const event = new Event(type, { bubbles: true, cancelable: true });
		Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
		Object.defineProperty(event, 'clientY', { value: clientY });
		target.dispatchEvent(event);
	};
	let inputChanges = 0;
	input.addEventListener('change', () => inputChanges++);

	const [first, second] = list.children;
	dispatchDrag(first, 'dragstart');
	assert.equal(dataTransfer.types.includes(VG_FILES_SORTABLE_DATA_TYPE), true);
	dispatchDrag(document, 'dragenter');
	dispatchDrag(second, 'dragover', 1);
	dispatchDrag(second, 'drop', 1);

	assert.deepEqual(Array.from(list.children, item => item.dataset.id), ['2', '1']);
	assert.equal(inputChanges, 0);
	assert.equal(VGFilesDroppable._activeSuggestedDrop, null);

	sortable._params.route = null;
	dispatchDrag(first, 'dragend');
	dataTransfer.getData = () => '';
	dispatchDrag(document, 'dragenter');
	assert.equal(document.querySelector('.dragging'), null);
	assert.equal(inputChanges, 0);
	assert.equal(VGFilesDroppable._activeSuggestedDrop, null);
	assert.equal(drop.classList.contains('drop-active'), false);
	sortable.destroy();
	droppable.dispose();
});
