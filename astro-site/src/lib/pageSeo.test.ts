import assert from 'node:assert/strict';
import test from 'node:test';

import { resolvePageSeo } from './pageSeo.ts';
import { pageBuilderSchema } from './types.ts';

test('resolvePageSeo keeps partial page_builder_schema SEO and fills missing values with [slug].astro fallbacks', () => {
  const siteUrl = 'https://example-client.pl';
  const page = pageBuilderSchema.parse({
    version: 1,
    page: {
      slug: 'komunie',
      title: 'Komunie',
      status: 'published',
    },
    seo: {
      title: 'Komunie w Bulwarze',
    },
    sections: [
      {
        id: 'gallery-01',
        blockKey: 'gallery-masonry-style1',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Galeria komunijna',
          images: [
            {
              src: '/react/images/gallery/komunie-og.webp',
              alt: 'Sala przygotowana na komunie',
            },
          ],
        },
        source: null,
        meta: {},
      },
    ],
  });

  const seo = resolvePageSeo({
    page,
    sections: page.sections,
    siteUrl: new URL(siteUrl),
    pagePath: '/astro/komunie/',
    wordPressBaseUrl: siteUrl,
  });

  assert.equal(seo.title, 'Komunie w Bulwarze');
  assert.equal(seo.description, 'Komunie - Galeria komunijna.');
  assert.equal(seo.canonical, 'https://example-client.pl/astro/komunie/');
  assert.equal(seo.robots, 'index,follow');
  assert.equal(seo.og.title, 'Komunie w Bulwarze');
  assert.equal(seo.og.description, 'Komunie - Galeria komunijna.');
  assert.equal(seo.og.image, 'https://example-client.pl/react/images/gallery/komunie-og.webp');
  assert.equal(seo.twitter.card, 'summary_large_image');
  assert.equal(seo.twitter.image, 'https://example-client.pl/react/images/gallery/komunie-og.webp');
});

test('resolvePageSeo respects explicit minimal editorial SEO fields from page_builder_schema', () => {
  const siteUrl = 'https://example-client.pl';
  const page = pageBuilderSchema.parse({
    version: 1,
    page: {
      slug: 'catering',
      title: 'Catering',
      status: 'published',
    },
    seo: {
      title: 'Catering Bulwar',
      description: 'Catering okolicznosciowy i firmowy.',
      canonical: '/oferta/catering',
      noindex: true,
      og: {
        image: '/uploads/seo/catering-og.webp',
      },
    },
    sections: [],
  });

  const seo = resolvePageSeo({
    page,
    sections: page.sections,
    siteUrl: new URL(siteUrl),
    pagePath: '/astro/catering/',
    wordPressBaseUrl: siteUrl,
  });

  assert.equal(seo.title, 'Catering Bulwar');
  assert.equal(seo.description, 'Catering okolicznosciowy i firmowy.');
  assert.equal(seo.canonical, 'https://example-client.pl/oferta/catering');
  assert.equal(seo.robots, 'noindex,follow');
  assert.equal(seo.og.image, 'https://example-client.pl/uploads/seo/catering-og.webp');
  assert.equal(seo.twitter.card, 'summary_large_image');
});