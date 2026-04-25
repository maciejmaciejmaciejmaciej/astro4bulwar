import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getSharedRegistryReadiness,
  listAstroRendererBlockKeys,
  resolveAstroRenderer,
} from './astroRegistry.ts';

const EXPECTED_RENDERERS = {
  about_2_simple: 'astro-site/src/components/About2SimpleSection.astro',
  big_img_and_bolded_tex_editorial_style_block:
    'astro-site/src/components/BigImgAndBoldedTexEditorialStyleBlockSection.astro',
  block_download: 'astro-site/src/components/BlockDownloadSection.astro',
  hero_simple_no_text_normal_wide:
    'astro-site/src/components/HeroSimpleNoTextNormalWideSection.astro',
  hero_simple_no_text_py32: 'astro-site/src/components/HeroSimpleNoTextPy32Section.astro',
  just_pralax_img_horizontal: 'astro-site/src/components/JustPralaxImgHorizontalSection.astro',
  menu_three_columns_with_with_heading_no_img: 'astro-site/src/components/StandaloneMenuSection.astro',
  menu_two_columns_with_no_heading_no_img: 'astro-site/src/components/StandaloneMenuSection.astro',
  menu_two_columns_with_with_heading_no_img: 'astro-site/src/components/StandaloneMenuSection.astro',
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax:
    'astro-site/src/components/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.astro',
  oferta_posts_section: 'astro-site/src/components/OfertaPostsSection.astro',
  premium_call_to_action_with_image_carousel:
    'astro-site/src/components/PremiumCallToActionWithImageCarouselSection.astro',
  promo2: 'astro-site/src/components/Promo2Section.astro',
  restaurant_menu_drawer_type: 'astro-site/src/components/RestaurantMenuDrawerTypeSection.astro',
  simple_heading_and_paragraph: 'astro-site/src/components/SimpleHeadingAndParagraphSection.astro',
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
    () => resolveAstroRenderer('promo3'),
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

test('resolveAstroRenderer resolves the Astro renderer for restaurant_menu_drawer_type', () => {
  const renderer = resolveAstroRenderer('restaurant_menu_drawer_type');

  assert.deepEqual(renderer, {
    blockKey: 'restaurant_menu_drawer_type',
    componentPath: 'astro-site/src/components/RestaurantMenuDrawerTypeSection.astro',
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
