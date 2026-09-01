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
	const tableModule = read('app/modules/vgtable/js/vgtable.js');
	const tableOptions = read('app/modules/vgtable/js/_options.js');

	assert.match(appEntry, /import VGTable from ["']\.\/modules\/vgtable["']/);
	assert.match(appEntry, /\bVGTable,\s*\n/);
	assert.match(packageEntry, /export \{ default as VGTable \}/);
	assert.match(packageEntry, /export \{ Responsive, DEFAULT_BREAKPOINTS \} from ['"]\.\/app\/utils\/js\/components\/responsive['"]/);
	assert.match(styleEntry, /modules\/vgtable\/scss\/vgtable/);
	assert.equal(packageJson.exports['./table'].sass, './app/modules/vgtable/scss/vgtable.scss');
	assert.match(tableModule, /from ["']\.\/_options\.js["']/);
	assert.doesNotMatch(tableModule, /const DEFAULT_OPTIONS\s*=/);
	assert.match(tableOptions, /const DEFAULT_OPTIONS\s*=\s*\{/);
	assert.match(tableOptions, /export \{[\s\S]*DEFAULT_OPTIONS/);
	const tableVariables = read('app/modules/vgtable/scss/_variables.scss');
	const tableStyles = read('app/modules/vgtable/scss/vgtable.scss');
	const stickyHeaderStyles = read('app/modules/vgtable/scss/_sticky-header.scss');
	const fixedColumnStyles = read('app/modules/vgtable/scss/_fixed-columns.scss');
	assert.match(tableVariables, /\$table-wrapper:\s*\(/);
	assert.match(tableVariables, /\$table-container:\s*\(/);
	assert.match(tableStyles, /mix-vars\('table-wrapper', table\.\$table-wrapper\)/);
	assert.match(tableStyles, /mix-vars\('table-container', table\.\$table-container\)/);
	assert.doesNotMatch(tableStyles, /\.vg-table-wrapper\s*\{[\s\S]*?mix-vars\('table', map\.get\(table\.\$table-sizing, md\)\);[\s\S]*?\.vg-table\s*\{/);
	assert.match(tableStyles, /border: var\(--vg-table-wrapper-border-width\) var\(--vg-table-wrapper-border-style\) var\(--vg-table-wrapper-border-color\)/);
	assert.match(tableStyles, /\.vg-table-wrapper > \.vg-table-container[\s\S]*border: var\(--vg-table-container-border-width\) var\(--vg-table-container-border-style\) var\(--vg-table-container-border-color\)/);
	assert.match(tableStyles, /\.vg-table\s*\{[\s\S]*?border: 0;[\s\S]*?border-radius: 0;/);
	assert.match(tableVariables, /\$table-sizing:\s*\(/);
	for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
		assert.match(tableVariables, new RegExp(`\\b${size}: \\(`));
	}
	assert.match(tableStyles, /@each \$size, \$values in table\.\$table-sizing/);
	assert.match(stickyHeaderStyles, /&--sticky-page\s*\{[\s\S]*?overflow: visible;[\s\S]*?\.vg-table-body\s*\{\s*overflow-x: auto;\s*overflow-y: hidden;/);
	assert.doesNotMatch(stickyHeaderStyles, /&--sticky-page\s*\{[\s\S]*?\.vg-table-body\s*\{\s*overflow: auto;/);
	assert.match(stickyHeaderStyles, /\.vg-table-header\s*\{[\s\S]*?position: relative;[\s\S]*?z-index: var\(--vg-table-sticky-z-index\);/);
	assert.match(stickyHeaderStyles, /\.vg-table-body\s*\{\s*position: relative;\s*z-index: 0;/);
	assert.match(fixedColumnStyles, /tbody tr > \[data-vg-table-fixed-side\],[\s\S]*?box-shadow: inset 0 0 0 100vmax transparent;[\s\S]*?transition: box-shadow var\(--vg-table-transition\);/);
	assert.match(fixedColumnStyles, /tbody tr\.vg-table-row-selected > \[data-vg-table-fixed-side\]\s*\{\s*box-shadow: inset 0 0 0 100vmax var\(--vg-table-selection-row-background\);/);
	assert.match(fixedColumnStyles, /tbody tr\.vg-table-row-selected:hover > \[data-vg-table-fixed-side\]\s*\{\s*box-shadow: inset 0 0 0 100vmax var\(--vg-table-selection-row-background-hovered\);/);

	assert.doesNotMatch(appEntry, /modules\/vgdynamictable|VGDynamicTable|\bEditable\b/);
	assert.doesNotMatch(packageEntry, /modules\/vgdynamictable|VGDynamicTable|\bEditable\b/);
	assert.doesNotMatch(styleEntry, /modules\/vgdynamictable/);
	assert.equal(packageJson.exports['./dynamictable'], undefined);
});
