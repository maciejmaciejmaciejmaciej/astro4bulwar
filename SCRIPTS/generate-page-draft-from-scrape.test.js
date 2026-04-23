const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(repoRoot, 'SCRIPTS', 'generate-page-draft-from-scrape.ts');
const inputPath = path.join(
  repoRoot,
  'zip',
  'SRIPTS',
  'wp-seo-scraper',
  'output',
  'menu-dania-glowne',
  'content.md',
);
const npxCommand = process.platform === 'win32' ? 'npx' : 'npx';

test('generate-page-draft-from-scrape creates a structure-only Woo-backed menu draft', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-scrape-draft-'));
  const outputPath = path.join(tempDir, 'menu-dania-glowne.firebase-draft.json');

  const command = [
    npxCommand,
    '--prefix zip',
    'tsx',
    '--tsconfig zip/tsconfig.json',
    `"${scriptPath}"`,
    '--input',
    `"${inputPath}"`,
    '--output',
    `"${outputPath}"`,
  ].join(' ');
  const result = spawnSync(command, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: true,
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const draft = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const menuBlockIds = draft.blocksOrder.filter((blockId) => {
    return blockId.startsWith('menu_two_columns_with_with_heading_no_img-');
  });
  const menuTitles = menuBlockIds.map((blockId) => draft.blocks[blockId]?.data?.title);

  assert.equal(draft.pageSlug, 'menu-dania-glowne');
  assert.equal(draft.pageKind, 'restaurant_menu');
  assert.equal(draft.title, 'Dania G\u0142\u00F3wne');
  assert.equal(
    draft.sourcePath,
    'zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md',
  );
  assert.equal(draft.workflow?.requiresSourceMapping, true);
  assert.ok(Array.isArray(draft.workflow?.unresolvedSourceBlockIds));
  assert.ok(draft.workflow.unresolvedSourceBlockIds.length > 0);
  assert.ok(menuBlockIds.length >= 3);
  assert.ok(menuTitles.includes('Zupy'));
  assert.ok(menuTitles.includes('Pierogi i przystawki'));
  assert.equal(menuTitles.includes('Kuchnia regionalna'), false);

  for (const blockId of menuBlockIds) {
    const block = draft.blocks[blockId];

    assert.deepEqual(block.data.menuColumns, []);
    assert.equal(block.source.sourceType, 'woo_category');
    assert.match(block.source.sourceValue, /^TODO_WOO_CATEGORY_SLUG/);
  }
});