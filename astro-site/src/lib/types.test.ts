import assert from 'node:assert/strict';
import test from 'node:test';

import {
  blockDownloadSectionBlockSchema,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema,
  pageBuilderSchema,
} from './types.ts';

const baseSchema = {
  version: 1,
  page: {
    slug: 'testowa-blueprint',
    title: 'Testowa Blueprint',
    status: 'published',
  },
  sections: [],
};

test('pageBuilderSchema defaults missing SEO to an empty object for runtime fallbacks', () => {
  const parsed = pageBuilderSchema.parse(baseSchema);

  assert.deepEqual(parsed.seo, {});
});

test('pageBuilderSchema accepts the minimal editorial SEO contract in page_builder_schema', () => {
  const parsed = pageBuilderSchema.parse({
    ...baseSchema,
    seo: {
      title: 'Oferta komunijna Bulwar',
      description: 'Kameralne przyjecia komunijne nad Wisla.',
      canonical: '/oferta/komunie',
      noindex: true,
      og: {
        image: '/uploads/seo/komunie-og.webp',
      },
    },
  });

  assert.deepEqual(parsed.seo, {
    title: 'Oferta komunijna Bulwar',
    description: 'Kameralne przyjecia komunijne nad Wisla.',
    canonical: '/oferta/komunie',
    noindex: true,
    og: {
      image: '/uploads/seo/komunie-og.webp',
    },
  });
});

test('pageBuilderSchema normalizes blank optional SEO strings to undefined', () => {
  const parsed = pageBuilderSchema.parse({
    ...baseSchema,
    seo: {
      title: '   ',
      description: '',
      canonical: ' ',
      og: {
        title: '',
        description: '   ',
        image: '',
        type: ' ',
      },
    },
  });

  assert.deepEqual(parsed.seo, {
    title: undefined,
    description: undefined,
    canonical: undefined,
    og: {
      title: undefined,
      description: undefined,
      image: undefined,
      type: undefined,
    },
  });
});

test('pageBuilderSchema accepts partial SEO objects so runtime fallbacks can fill the gaps', () => {
  const parsed = pageBuilderSchema.parse({
    ...baseSchema,
    seo: {
      title: 'Oferta komunijna Bulwar',
      og: {
        image: '/uploads/komunia-og.jpg',
      },
    },
  });

  assert.deepEqual(parsed.seo, {
    title: 'Oferta komunijna Bulwar',
    og: {
      image: '/uploads/komunia-og.jpg',
    },
  });
});

test('pageBuilderSchema still rejects malformed structured SEO values', () => {
  assert.throws(
    () => pageBuilderSchema.parse({
      ...baseSchema,
      seo: {
        og: '',
      },
    }),
    /og/i,
  );
});

test('pageBuilderSchema accepts the live about and services blocks used by testowa-blueprint', () => {
  const parsed = pageBuilderSchema.parse({
    ...baseSchema,
    sections: [
      {
        id: 'about-1-01',
        blockKey: 'about-1',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          leftImages: [
            {
              src: '/react/images/about_1.jpg',
              alt: 'Wnetrze restauracji Bulwar',
            },
          ],
          leftText: {
            title: 'O restauracji',
            paragraphs: [
              'Od 2011 roku prowadzimy restauracje z autorska kuchnia.',
            ],
            ctaButton: {
              href: '/o-restauracji',
              text: 'Czytaj wiecej',
            },
          },
          rightText: {
            paragraphs: [
              'Z przyjemnoscia goscimy naszych gosci przy wspolnym stole.',
            ],
          },
          rightImages: [
            {
              src: '/react/images/about_front.jpg',
              alt: 'Detal frontu restauracji Bulwar',
            },
          ],
        },
        source: null,
        meta: {},
      },
      {
        id: 'our-services-01',
        blockKey: 'our-services',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Nasze uslugi',
          description: 'Bulwar przygotowuje format spotkania i menu dopasowane do okazji.',
          primaryCta: {
            text: 'Poznaj cala oferte',
            href: '/oferta',
          },
          cards: [
            {
              icon: 'celebration',
              title: 'PRZYJECIA OKOLICZNOSCIOWE',
              description: 'Indywidualne menu i spokojna organizacja rodzinnych uroczystosci.',
              ctaText: 'Zobacz szczegoly',
              ctaHref: '/przyjecia-okolicznosciowe',
            },
          ],
        },
        source: null,
        meta: {},
      },
    ],
  });

  assert.equal(parsed.sections[0]?.blockKey, 'about-1');
  assert.equal(parsed.sections[1]?.blockKey, 'our-services');
});

test('pageBuilderSchema accepts shared-registry sections before Astro renderer readiness is checked', () => {
  const parsed = pageBuilderSchema.parse({
    ...baseSchema,
    sections: [
      {
        id: 'simple_heading_and_paragraph-01',
        blockKey: 'simple_heading_and_paragraph',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Sekcja testowa',
          richTextHtml: '<p>Opis testowy</p>',
        },
        source: null,
        meta: {},
      },
    ],
  });

  assert.equal(parsed.sections[0]?.blockKey, 'simple_heading_and_paragraph');
});

test('pageBuilderSchema enforces the first-class block_download schema', () => {
  const parsed = blockDownloadSectionBlockSchema.safeParse({
    id: 'block_download-01',
    blockKey: 'block_download',
    blockVersion: 1,
    variant: null,
    enabled: true,
    data: {
      title: 'Menu okolicznosciowe',
      subtitle: 'Pobierz PDF.',
      primaryCta: {
        href: '/pdf/menu.pdf',
      },
      secondaryCta: {
        label: 'Zobacz online',
        href: '/menu-online',
      },
      helperText: 'Pomocniczy tekst',
      versionLabel: 'PDF 2026',
      fileMeta: '1.2 MB',
      panelCaption: 'Aktualna wersja',
      features: [],
    },
    source: null,
    meta: {},
  });

  assert.equal(parsed.success, false);
  assert.equal(parsed.error.issues.some((issue) => issue.path.join('.').includes('primaryCta.label')), true);
});

test('pageBuilderSchema enforces the first-class parallax menu source contract', () => {
  const parsed = menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema.safeParse({
    id: 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax-01',
    blockKey: 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax',
    blockVersion: 1,
    variant: null,
    enabled: true,
    data: {
      heroTitle: 'Kolacje',
      backgroundImage: {
        src: '/react/images/home_hero.jpg',
        alt: 'Kolacje',
      },
      overlayOpacity: 0.2,
      layout: {
        heroHeight: '400px',
      },
      menuColumns: [],
      emptyStateText: 'Brak pozycji w tej kategorii.',
    },
    source: {
      sourceType: 'woo_products',
      sourceValue: [1, 2],
      options: {},
    },
    meta: {},
  });

  assert.equal(parsed.success, false);
  assert.equal(parsed.error.issues.some((issue) => issue.path.join('.').includes('source.sourceType')), true);
});