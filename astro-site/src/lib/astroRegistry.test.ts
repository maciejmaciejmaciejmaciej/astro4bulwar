import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getSharedRegistryReadiness,
  listAstroRendererBlockKeys,
  resolveAstroRenderer,
} from './astroRegistry.ts';

const EXPECTED_RENDERERS = {
  block_download: 'astro-site/src/components/BlockDownloadSection.astro',
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax:
    'astro-site/src/components/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.astro',
  universal_header_block_1: 'astro-site/src/components/UniversalHeaderBlock1Section.astro',
  universal_header_block_2: 'astro-site/src/components/UniversalHeaderBlock2Section.astro',
  universal_multilink_block: 'astro-site/src/components/UniversalMultilinkBlockSection.astro',
} as const;

test('Astro projection stays aligned with the shared readiness manifest', () => {
  const readiness = getSharedRegistryReadiness();
  const astroReadyBlockKeys = Object.entries(readiness.blocks)
    .filter(([, blockReadiness]) => blockReadiness.capabilities.astroRenderer.available)
    .map(([blockKey]) => blockKey)
    .sort((left, right) => left.localeCompare(right));

  assert.deepEqual(listAstroRendererBlockKeys(), astroReadyBlockKeys);

  for (const blockKey of astroReadyBlockKeys) {
    const renderer = resolveAstroRenderer(blockKey);
    const manifestEntry = readiness.blocks[blockKey];

    assert.equal(renderer.blockKey, blockKey);
    assert.equal(renderer.componentPath, manifestEntry.capabilities.astroRenderer.path);
  }
});

test('resolveAstroRenderer rejects registered blocks that are not Astro-ready', () => {
  assert.throws(
    () => resolveAstroRenderer('simple_heading_and_paragraph'),
    /not Astro-ready/i,
  );
});

test('resolveAstroRenderer resolves the Astro renderer for universal_header_block_2', () => {
  const renderer = resolveAstroRenderer('universal_header_block_2');

  assert.deepEqual(renderer, {
    blockKey: 'universal_header_block_2',
    componentPath: 'astro-site/src/components/UniversalHeaderBlock2Section.astro',
  });
});

test('resolveAstroRenderer resolves the approved template follow-up renderers', () => {
  for (const [blockKey, componentPath] of Object.entries(EXPECTED_RENDERERS)) {
    const renderer = resolveAstroRenderer(blockKey);

    assert.deepEqual(renderer, {
      blockKey,
      componentPath,
    });
  }
});