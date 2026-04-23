import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveAstroPageSections } from './pageBuilder.ts';
import type { PageBuilderSchema } from './types.ts';

test('resolveAstroPageSections blocks enabled registry sections without an Astro renderer', async () => {
  await assert.rejects(
    () => resolveAstroPageSections([
      {
        id: 'simple_heading_and_paragraph-01',
        blockKey: 'simple_heading_and_paragraph',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Sekcja testowa',
        },
        source: null,
        meta: {},
      },
    ] as PageBuilderSchema['sections']),
    /not Astro-ready/i,
  );
});

test('resolveAstroPageSections ignores disabled registry sections without an Astro renderer', async () => {
  const sections = await resolveAstroPageSections([
    {
      id: 'simple_heading_and_paragraph-01',
      blockKey: 'simple_heading_and_paragraph',
      blockVersion: 1,
      variant: null,
      enabled: false,
      data: {
        title: 'Sekcja testowa',
      },
      source: null,
      meta: {},
    },
  ] as PageBuilderSchema['sections']);

  assert.equal(sections[0]?.blockKey, 'simple_heading_and_paragraph');
});

test('resolveAstroPageSections keeps enabled universal_header_block_2 sections once the renderer exists', async () => {
  const sections = await resolveAstroPageSections([
    {
      id: 'universal_header_block_2-01',
      blockKey: 'universal_header_block_2',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: 'Sesja marki',
        title: 'Bulwar Photo Story',
        description: 'Header, metadata, CTA i story rows sa w pelni sterowane przez page schema.',
        metadataItems: [
          {
            label: 'Kategoria:',
            value: 'Przyjecia okolicznosciowe',
          },
        ],
        contactCta: {
          label: 'Dostepne terminy:',
          buttonLabel: 'wyslij zapytanie',
          href: '/kontakt',
        },
        heroImage: {
          src: '/react/images/home_hero.jpg',
          alt: 'Restauracja Bulwar od frontu',
        },
        storySections: [
          {
            number: '01.',
            title: 'Inspiration.',
            content: 'Pierwsza sekcja opowiesci pozostaje w pelni sterowana przez page schema.',
          },
        ],
      },
      source: null,
      meta: {},
    },
  ] as PageBuilderSchema['sections']);

  assert.equal(sections[0]?.blockKey, 'universal_header_block_2');
});

test('resolveAstroPageSections resolves parallax menu sections from woo_category sources', async () => {
  const originalFetch = globalThis.fetch;
  const originalBaseUrl = process.env.PUBLIC_WORDPRESS_BASE_URL;

  process.env.PUBLIC_WORDPRESS_BASE_URL = 'https://example-client.pl';

  globalThis.fetch = async (input: string | URL | Request) => {
    const url = String(input);

    if (url.includes('/products/categories')) {
      return new Response(JSON.stringify([
        {
          id: 77,
          name: 'Kolacje degustacyjne',
          slug: 'kolacje-degustacyjne',
        },
      ]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.includes('/products?')) {
      return new Response(JSON.stringify([
        {
          id: 501,
          name: 'Tataki z tunczyka',
          short_description: '<p>Sos ponzu i sezam</p>',
          description: '<p>Sos ponzu i sezam</p>',
          prices: {
            price: '5400',
            currency_code: 'PLN',
            currency_minor_unit: 2,
          },
          is_in_stock: true,
          tags: [
            { id: 1, name: 'Ostre', slug: 'ostre' },
          ],
        },
      ]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unexpected fetch url in test: ${url}`);
  };

  try {
    const sections = await resolveAstroPageSections([
      {
        id: 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax-01',
        blockKey: 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          heroTitle: 'Menu testowe',
          backgroundImage: {
            src: '/react/images/home_hero.jpg',
            alt: 'Kolacje degustacyjne',
          },
          overlayOpacity: 0.2,
          layout: {
            heroHeight: '400px',
          },
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 'kolacje-degustacyjne',
          options: {
            limit: 12,
            splitIntoColumns: 2,
          },
        },
        meta: {},
      },
    ] as PageBuilderSchema['sections']);

    const section = sections[0];

    assert.equal(section?.blockKey, 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax');
    assert.equal(section?.data.heroTitle, 'Kolacje degustacyjne');
    assert.equal(section?.data.menuColumns.length, 1);
    assert.equal(section?.data.menuColumns[0]?.items[0]?.title, 'Tataki z tunczyka');
    assert.equal(section?.data.menuColumns[0]?.items[0]?.tagSlugs[0], 'ostre');
  } finally {
    globalThis.fetch = originalFetch;

    if (typeof originalBaseUrl === 'string') {
      process.env.PUBLIC_WORDPRESS_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.PUBLIC_WORDPRESS_BASE_URL;
    }
  }
});