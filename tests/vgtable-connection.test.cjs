const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('connects VGTable and leaves VGDynamicTable outside the main bundle', () => {
	const appEntry = read('app/vgapp.js');
	const packageEntry = read('index.js');
	const styleEntry = read('index.scss');
	const packageJson = JSON.parse(read('package.json'));

	assert.match(appEntry, /import VGTable from ["']\.\/modules\/vgtable["']/);
	assert.match(appEntry, /\bVGTable,\s*\n/);
	assert.match(packageEntry, /export \{ default as VGTable \}/);
	assert.match(styleEntry, /modules\/vgtable\/scss\/vgtable/);
	assert.equal(packageJson.exports['./table'].sass, './app/modules/vgtable/scss/vgtable.scss');

	assert.doesNotMatch(appEntry, /modules\/vgdynamictable|VGDynamicTable|\bEditable\b/);
	assert.doesNotMatch(packageEntry, /modules\/vgdynamictable|VGDynamicTable|\bEditable\b/);
	assert.doesNotMatch(styleEntry, /modules\/vgdynamictable/);
	assert.equal(packageJson.exports['./dynamictable'], undefined);
});
