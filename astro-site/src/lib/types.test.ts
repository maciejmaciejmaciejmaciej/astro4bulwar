import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveAstroRenderer } from './astroRegistry.ts';
import {
  about2SimpleBlockSchema,
  bigImgAndBoldedTexEditorialStyleBlockSchema,
  blockDownloadSectionBlockSchema,
  heroSimpleNoTextNormalWideBlockSchema,
  heroSimpleNoTextPy32BlockSchema,
  justPralaxImgHorizontalBlockSchema,
  menuThreeColumnsWithWithHeadingNoImgBlockSchema,
  menuTwoColumnsWithNoHeadingNoImgBlockSchema,
  menuTwoColumnsWithWithHeadingNoImgBlockSchema,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema,
  ofertaPostsSectionBlockSchema,
  pageBuilderSchema,
  premiumCallToActionWithImageCarouselBlockSchema,
  promo2BlockSchema,
  restaurantMenuDrawerTypeBlockSchema,
  simpleHeadingAndParagraphBlockSchema,
} from './types.ts';
import {
  TEMPLATE_BLOCK_ASTRO_VALIDATION_BLOCK_KEYS,
  TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS,
  templateBlockAstroValidationPage,
  templateBlockAstroValidationRenderableSections,
} from './templateBlockAstroValidation.ts';

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

test('pageBuilderSchema accepts simple_heading_and_paragraph through the first-class Astro schema', () => {
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
          eyebrow: 'Sekcja testowa',
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

test('pageBuilderSchema accepts the missing template blocks through first-class Astro schemas', () => {
  const parsed = pageBuilderSchema.parse({
    ...baseSchema,
    sections: [
      {
        id: 'hero-simple-no-text-py32-01',
        blockKey: 'hero_simple_no_text_py32',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          imageSrc: '/react/images/home_hero.jpg',
          alt: 'Hero preview py32',
        },
        source: null,
        meta: {},
      },
      {
        id: 'hero-simple-no-text-normal-wide-01',
        blockKey: 'hero_simple_no_text_normal_wide',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          imageSrc: '/react/images/about_front.jpg',
          alt: 'Hero preview wide',
        },
        source: null,
        meta: {},
      },
      {
        id: 'about-2-simple-01',
        blockKey: 'about_2_simple',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'O restauracji',
          paragraphs: ['Od 2011 roku prowadzimy restauracje z autorska kuchnia.'],
          buttonText: 'CZYTAJ WIECEJ',
          buttonLink: '/o-restauracji',
          image1: {
            src: '/react/images/about_1.jpg',
            alt: 'Wnetrze restauracji',
          },
          image2: {
            src: '/react/images/about_front.jpg',
            alt: 'Detale dekoracji',
          },
        },
        source: null,
        meta: {},
      },
      {
        id: 'promo2-01',
        blockKey: 'promo2',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          eyebrow: 'Chef notes',
          title: 'Seasonal menu',
          members: [
            {
              icon: 'calendar-days',
              name: 'Anna Example',
              role: 'Guest Experience Lead',
            },
          ],
          story: 'Story-led promo with an attached lower menu panel.',
          image: {
            src: '/react/images/promo2.jpg',
            alt: 'Promo2 sample image',
          },
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 'sezonowa-karta',
          options: {
            limit: 6,
            splitIntoColumns: 2,
          },
        },
        meta: {},
      },
      {
        id: 'simple-heading-and-paragraph-01',
        blockKey: 'simple_heading_and_paragraph',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          eyebrow: 'Polityka prywatnosci',
          title: 'Informacja o przetwarzaniu danych',
          richTextHtml: '<p>Opis testowy</p>',
        },
        source: null,
        meta: {},
      },
      {
        id: 'big-img-and-bolded-text-01',
        blockKey: 'big_img_and_bolded_tex_editorial_style_block',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Seasonal story',
          story: 'Jedno zdjecie portretowe i jeden blok tekstu redakcyjnego.',
          buttonLabel: 'przycisk',
          buttonHref: '#',
          image: {
            src: '/react/images/about_1.jpg',
            alt: 'Seasonal portrait image',
          },
        },
        source: null,
        meta: {},
      },
      {
        id: 'menu-two-columns-no-heading-01',
        blockKey: 'menu_two_columns_with_no_heading_no_img',
        blockVersion: 1,
        variant: 'surface',
        enabled: true,
        data: {
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 'lunche',
          options: {
            limit: 6,
          },
        },
        meta: {},
      },
      {
        id: 'menu-two-columns-with-heading-01',
        blockKey: 'menu_two_columns_with_with_heading_no_img',
        blockVersion: 1,
        variant: 'white',
        enabled: true,
        data: {
          title: 'The Menu',
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 21,
          options: {
            splitIntoColumns: 2,
          },
        },
        meta: {},
      },
      {
        id: 'just-pralax-img-horizontal-01',
        blockKey: 'just_pralax_img_horizontal',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          imageUrl: 'https://example.com/uploads/parallax-horizontal.jpg',
        },
        source: null,
        meta: {},
      },
      {
        id: 'menu-three-columns-with-heading-01',
        blockKey: 'menu_three_columns_with_with_heading_no_img',
        blockVersion: 1,
        variant: 'inverted',
        enabled: true,
        data: {
          title: 'Chef Selection',
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 'chef-selection',
          options: {
            splitIntoColumns: 3,
          },
        },
        meta: {},
      },
      {
        id: 'premium-catering-01',
        blockKey: 'premium_call_to_action_with_image_carousel',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          heading: 'Catering Wielkanocny',
          description: 'Contained CTA section aligned with Promo2 rhythm.',
          buttonText: 'ZAMOW ONLINE',
          buttonHref: '/catering-wielkanocny',
          images: [
            {
              src: '/react/images/zupy-catering.jpg',
              alt: 'Zupy cateringowe',
            },
          ],
        },
        source: null,
        meta: {},
      },
      {
        id: 'oferta-posts-01',
        blockKey: 'oferta_posts_section',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Nasza Oferta',
          items: [
            {
              image: {
                src: '/react/images/oferta-fallback.jpg',
                alt: 'Oferta fallback',
              },
              title: 'Catering dla firm',
              description: 'Fallback preview content used when source is null.',
              link: {
                href: '/oferta/catering-dla-firm',
              },
            },
          ],
        },
        source: {
          sourceType: 'wordpress_posts',
          sourceValue: [912, 401, 388],
          options: {},
        },
        meta: {},
      },
      {
        id: 'restaurant-menu-drawer-type-01',
        blockKey: 'restaurant_menu_drawer_type',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          intro: {
            heading: 'Our Services',
            description: 'Curated collections that open into Woo drawers.',
            buttonLabel: 'View all services',
            buttonTarget: '/oferta',
            imageUrl: '/react/images/about_front.jpg',
            imageAlt: 'Restaurant interior',
          },
          collections: [
            {
              visualUrl: '/react/images/about_front.jpg',
              collectionTitle: 'TASTING MENU',
              collectionDescription: 'Seasonal tasting collections.',
              buttonLabel: 'Open tasting menu',
              wooCategoryIds: [84, 85, 86],
            },
            {
              collectionTitle: 'PRIVATE EVENTS',
              collectionDescription: 'Cards can omit the image without leaving an empty placeholder.',
              buttonLabel: 'Open events',
              wooCategoryIds: [87],
            },
          ],
        },
        source: null,
        meta: {},
      },
    ],
  });

  assert.deepEqual(
    parsed.sections.map((section) => section.blockKey),
    [
      'hero_simple_no_text_py32',
      'hero_simple_no_text_normal_wide',
      'about_2_simple',
      'promo2',
      'simple_heading_and_paragraph',
      'big_img_and_bolded_tex_editorial_style_block',
      'menu_two_columns_with_no_heading_no_img',
      'menu_two_columns_with_with_heading_no_img',
      'just_pralax_img_horizontal',
      'menu_three_columns_with_with_heading_no_img',
      'premium_call_to_action_with_image_carousel',
      'oferta_posts_section',
      'restaurant_menu_drawer_type',
    ],
  );
});

test('restaurantMenuDrawerTypeBlockSchema keeps Woo category ids in collection order and stays direct-edit', () => {
  const parsed = restaurantMenuDrawerTypeBlockSchema.parse({
    id: 'restaurant-menu-drawer-type-01',
    blockKey: 'restaurant_menu_drawer_type',
    blockVersion: 1,
    variant: null,
    enabled: true,
    data: {
      intro: {
        heading: 'Our Services',
        description: 'Curated collections that open into Woo drawers.',
        buttonLabel: 'View all services',
        buttonTarget: '/oferta',
        imageUrl: '/react/images/about_front.jpg',
        imageAlt: 'Restaurant interior',
      },
      collections: [
        {
          collectionTitle: 'TASTING MENU',
          collectionDescription: 'Seasonal tasting collections.',
          buttonLabel: 'Open tasting menu',
          wooCategoryIds: [84, 85, 86],
        },
      ],
    },
    source: null,
    meta: {},
  });

  assert.deepEqual(parsed.data.collections[0]?.wooCategoryIds, [84, 85, 86]);
  assert.equal(parsed.source, null);
});

test('template block Astro validation fixture stays deterministic and excludes fetch-only payloads', () => {
  assert.deepEqual(
    templateBlockAstroValidationPage.sections.map((section) => section.blockKey),
    TEMPLATE_BLOCK_ASTRO_VALIDATION_BLOCK_KEYS,
  );

  assert.equal(templateBlockAstroValidationPage.sections.length, 13);
  assert.equal(templateBlockAstroValidationPage.sections.every((section) => section.enabled), true);
  assert.equal(templateBlockAstroValidationPage.sections.every((section) => section.source === null), true);
  assert.ok(!TEMPLATE_BLOCK_ASTRO_VALIDATION_BLOCK_KEYS.includes('NavbarBigSpaceBetweenElements_py32'));
  assert.ok(!TEMPLATE_BLOCK_ASTRO_VALIDATION_BLOCK_KEYS.includes('Projects17a'));
});

test('aggregate template block Astro validation only includes sections that pass resolveAstroRenderer', () => {
  const expectedRenderableKeys = templateBlockAstroValidationPage.sections.flatMap((section) => {
    try {
      resolveAstroRenderer(section.blockKey);
      return [section.blockKey];
    } catch (error) {
      if (error instanceof Error && /not Astro-ready/i.test(error.message)) {
        return [];
      }

      throw error;
    }
  });

  assert.deepEqual(TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS, expectedRenderableKeys);
  assert.deepEqual(
    templateBlockAstroValidationRenderableSections.map((section) => section.blockKey),
    expectedRenderableKeys,
  );
  assert.equal(TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS.includes('hero_simple_no_text_py32'), false);
  assert.equal(TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS.includes('restaurant_menu_drawer_type'), true);
});

test('template block schemas keep direct-edit and source-backed contracts distinct', () => {
  assert.equal(
    heroSimpleNoTextPy32BlockSchema.safeParse({
      id: 'hero-simple-no-text-py32-01',
      blockKey: 'hero_simple_no_text_py32',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        imageSrc: '/react/images/home_hero.jpg',
        alt: 'Hero preview py32',
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 'lunche',
        options: {},
      },
      meta: {},
    }).success,
    false,
  );

  assert.equal(
    heroSimpleNoTextNormalWideBlockSchema.safeParse({
      id: 'hero-simple-no-text-normal-wide-01',
      blockKey: 'hero_simple_no_text_normal_wide',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        imageSrc: '/react/images/about_front.jpg',
        alt: 'Hero preview wide',
      },
      source: null,
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    about2SimpleBlockSchema.safeParse({
      id: 'about-2-simple-01',
      blockKey: 'about_2_simple',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        title: 'O restauracji',
        paragraphs: ['Od 2011 roku prowadzimy restauracje z autorska kuchnia.'],
        buttonText: 'CZYTAJ WIECEJ',
        buttonLink: '/o-restauracji',
        image1: {
          src: '/react/images/about_1.jpg',
          alt: 'Wnetrze restauracji',
        },
        image2: {
          src: '/react/images/about_front.jpg',
          alt: 'Detale dekoracji',
        },
      },
      source: null,
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    simpleHeadingAndParagraphBlockSchema.safeParse({
      id: 'simple-heading-and-paragraph-01',
      blockKey: 'simple_heading_and_paragraph',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: 'Polityka prywatnosci',
        title: 'Informacja o przetwarzaniu danych',
        richTextHtml: '<p>Opis testowy</p>',
      },
      source: null,
      meta: {},
    }).success,
    true,
  );

  const bigImgAndBoldedText = bigImgAndBoldedTexEditorialStyleBlockSchema.parse({
    id: 'big-img-and-bolded-text-01',
    blockKey: 'big_img_and_bolded_tex_editorial_style_block',
    blockVersion: 1,
    variant: null,
    enabled: true,
    data: {
      title: 'Seasonal story',
      story: 'Jedno zdjecie portretowe i jeden blok tekstu redakcyjnego.',
      buttonLabel: 'przycisk',
      buttonHref: '#',
      image: {
        src: '/react/images/about_1.jpg',
        alt: 'Seasonal portrait image',
      },
    },
    source: null,
    meta: {},
  });

  assert.deepEqual(bigImgAndBoldedText.data, {
    title: 'Seasonal story',
    story: 'Jedno zdjecie portretowe i jeden blok tekstu redakcyjnego.',
    buttonLabel: 'przycisk',
    buttonHref: '#',
    image: {
      src: '/react/images/about_1.jpg',
      alt: 'Seasonal portrait image',
    },
  });

  assert.equal(
    justPralaxImgHorizontalBlockSchema.safeParse({
      id: 'just-pralax-img-horizontal-01',
      blockKey: 'just_pralax_img_horizontal',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        imageUrl: 'https://example.com/uploads/parallax-horizontal.jpg',
      },
      source: null,
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    premiumCallToActionWithImageCarouselBlockSchema.safeParse({
      id: 'premium-catering-01',
      blockKey: 'premium_call_to_action_with_image_carousel',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        heading: 'Catering Wielkanocny',
        description: 'Contained CTA section aligned with Promo2 rhythm.',
        buttonText: 'ZAMOW ONLINE',
        buttonHref: '/catering-wielkanocny',
        images: [
          {
            src: '/react/images/zupy-catering.jpg',
            alt: 'Zupy cateringowe',
          },
        ],
      },
      source: null,
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    promo2BlockSchema.safeParse({
      id: 'promo2-01',
      blockKey: 'promo2',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: 'Chef notes',
        title: 'Seasonal menu',
        members: [
          {
            icon: 'calendar-days',
            name: 'Anna Example',
            role: 'Guest Experience Lead',
          },
        ],
        story: 'Story-led promo with an attached lower menu panel.',
        image: {
          src: '/react/images/promo2.jpg',
          alt: 'Promo2 sample image',
        },
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 'sezonowa-karta',
        options: {
          limit: 6,
          splitIntoColumns: 2,
        },
      },
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    menuTwoColumnsWithNoHeadingNoImgBlockSchema.safeParse({
      id: 'menu-two-columns-no-heading-01',
      blockKey: 'menu_two_columns_with_no_heading_no_img',
      blockVersion: 1,
      variant: 'surface',
      enabled: true,
      data: {
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 'lunche',
        options: {
          limit: 6,
        },
      },
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    menuTwoColumnsWithWithHeadingNoImgBlockSchema.safeParse({
      id: 'menu-two-columns-with-heading-01',
      blockKey: 'menu_two_columns_with_with_heading_no_img',
      blockVersion: 1,
      variant: 'white',
      enabled: true,
      data: {
        title: 'The Menu',
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 21,
        options: {
          splitIntoColumns: 2,
        },
      },
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    menuThreeColumnsWithWithHeadingNoImgBlockSchema.safeParse({
      id: 'menu-three-columns-with-heading-01',
      blockKey: 'menu_three_columns_with_with_heading_no_img',
      blockVersion: 1,
      variant: 'inverted',
      enabled: true,
      data: {
        title: 'Chef Selection',
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 'chef-selection',
        options: {
          splitIntoColumns: 3,
        },
      },
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    ofertaPostsSectionBlockSchema.safeParse({
      id: 'oferta-posts-01',
      blockKey: 'oferta_posts_section',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        title: 'Nasza Oferta',
        items: [
          {
            image: {
              src: '/react/images/oferta-fallback.jpg',
              alt: 'Oferta fallback',
            },
            title: 'Catering dla firm',
            description: 'Fallback preview content used when source is null.',
            link: {
              href: '/oferta/catering-dla-firm',
            },
          },
        ],
      },
      source: {
        sourceType: 'wordpress_posts',
        sourceValue: [912, 401, 388],
        options: {},
      },
      meta: {},
    }).success,
    true,
  );

  assert.equal(
    ofertaPostsSectionBlockSchema.safeParse({
      id: 'oferta-posts-01',
      blockKey: 'oferta_posts_section',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        title: 'Nasza Oferta',
        items: [],
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 'oferta',
        options: {},
      },
      meta: {},
    }).success,
    false,
  );
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