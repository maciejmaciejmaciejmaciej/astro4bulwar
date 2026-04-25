import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveAstroPageSections, resolveAstroSectionSources } from './pageBuilder.ts';
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

test('resolveAstroPageSections keeps enabled restaurant_menu_drawer_type sections once the renderer exists', async () => {
  const sections = await resolveAstroPageSections([
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
            wooCategoryIds: [84, 85],
          },
        ],
      },
      source: null,
      meta: {},
    },
  ] as PageBuilderSchema['sections']);

  assert.equal(sections[0]?.blockKey, 'restaurant_menu_drawer_type');
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

test('resolveAstroSectionSources resolves Woo menu families and oferta post fallbacks in one pass', async () => {
  const originalFetch = globalThis.fetch;
  const originalBaseUrl = process.env.PUBLIC_WORDPRESS_BASE_URL;
  const fetchCalls: string[] = [];

  process.env.PUBLIC_WORDPRESS_BASE_URL = 'https://example-client.pl';

  globalThis.fetch = async (input: string | URL | Request) => {
    const url = String(input);
    fetchCalls.push(url);

    if (url.includes('/products/categories')) {
      return new Response(JSON.stringify([
        {
          id: 11,
          name: 'Sezonowa karta',
          slug: 'sezonowa-karta',
        },
        {
          id: 22,
          name: 'Desery',
          slug: 'desery',
        },
        {
          id: 33,
          name: 'Lunch',
          slug: 'lunch',
        },
      ]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.includes('/wp-json/wc/store/v1/products?')) {
      const parsedUrl = new URL(url);
      const category = parsedUrl.searchParams.get('category');

      if (category === 'sezonowa-karta') {
        return new Response(JSON.stringify([
          {
            id: 101,
            name: 'Spring ravioli',
            short_description: '<p>Brown butter, hazelnut</p>',
            description: '',
            prices: {
              price: '4200',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [
              { id: 1, name: 'Seasonal', slug: 'seasonal' },
            ],
          },
          {
            id: 102,
            name: 'Charred cabbage',
            short_description: '<p>Apple glaze</p>',
            description: '',
            prices: {
              price: '3600',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 103,
            name: 'Burnt cheesecake',
            short_description: '<p>Cherry, vanilla</p>',
            description: '',
            prices: {
              price: '2800',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (category === 'desery' || category === '22') {
        return new Response(JSON.stringify([
          {
            id: 201,
            name: 'Sernik baskijski',
            short_description: '<p>Wisnia, wanilia</p>',
            description: '',
            prices: {
              price: '2800',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 202,
            name: 'Mus czekoladowy',
            short_description: '<p>Sol morska</p>',
            description: '',
            prices: {
              price: '2600',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 203,
            name: 'Panna cotta',
            short_description: '<p>Malina</p>',
            description: '',
            prices: {
              price: '2400',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 204,
            name: 'Creme brulee',
            short_description: '<p>Tonka</p>',
            description: '',
            prices: {
              price: '2500',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 205,
            name: 'Lody pistacjowe',
            short_description: '<p>Kruchy wafelek</p>',
            description: '',
            prices: {
              price: '2200',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (category === 'lunch') {
        return new Response(JSON.stringify([
          {
            id: 301,
            name: 'Krem z pomidorow',
            short_description: '<p>Bazylia, oliwa</p>',
            description: '',
            prices: {
              price: '2600',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 302,
            name: 'Makaron z kurkami',
            short_description: '<p>Maslo, pecorino</p>',
            description: '',
            prices: {
              price: '3900',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 303,
            name: 'Tarta cytrynowa',
            short_description: '<p>Beza palona</p>',
            description: '',
            prices: {
              price: '2400',
              currency_code: 'PLN',
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.includes('/wp-json/wp/v2/posts?')) {
      return new Response(JSON.stringify([
        {
          id: 912,
          title: {
            rendered: 'Kolacja degustacyjna',
          },
          excerpt: {
            rendered: '<p>Siedem autorskich dan z pairingiem.</p>',
          },
          meta: {
            offer_url_link: '/oferta/kolacja-degustacyjna',
          },
          _embedded: {
            'wp:featuredmedia': [
              {
                source_url: 'https://example.com/uploads/kolacja.jpg',
                alt_text: 'Kolacja degustacyjna',
              },
            ],
          },
        },
        {
          id: 401,
          title: {
            rendered: 'Lunch firmowy',
          },
          excerpt: {
            rendered: '<p>Spotkania biznesowe z pelna obsluga.</p>',
          },
          link: '/oferta/lunch-firmowy',
        },
      ]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unexpected fetch url in test: ${url}`);
  };

  try {
    const resolvedSections = await resolveAstroSectionSources([
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
          story: 'Story-led promo section.',
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
            limit: 3,
            splitIntoColumns: 2,
          },
        },
        meta: {},
      },
      {
        id: 'menu-two-columns-01',
        blockKey: 'menu_two_columns_with_no_heading_no_img',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 'lunch',
          options: {
            limit: 3,
          },
        },
        meta: {},
      },
      {
        id: 'menu-two-columns-heading-01',
        blockKey: 'menu_two_columns_with_with_heading_no_img',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Fallback title',
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 'desery',
          options: {
            limit: 5,
          },
        },
        meta: {},
      },
      {
        id: 'menu-three-columns-heading-01',
        blockKey: 'menu_three_columns_with_with_heading_no_img',
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: 'Fallback title',
          menuColumns: [],
          emptyStateText: 'Brak pozycji w tej kategorii.',
        },
        source: {
          sourceType: 'woo_category',
          sourceValue: 22,
          options: {
            limit: 5,
          },
        },
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
                src: '/react/images/oferta-fallback-a.jpg',
                alt: 'Fallback A',
              },
              title: 'Fallback item A',
              description: 'Fallback description A',
              link: {
                href: '/fallback-a',
              },
            },
            {
              image: {
                src: '/react/images/oferta-fallback-b.jpg',
                alt: 'Fallback B',
              },
              title: 'Fallback item B',
              description: 'Fallback description B',
              link: {
                href: '/fallback-b',
              },
            },
          ],
        },
        source: {
          sourceType: 'wordpress_posts',
          sourceValue: [912, 401],
          options: {},
        },
        meta: {},
      },
    ] as PageBuilderSchema['sections']);

    assert.equal(fetchCalls.filter((url) => url.includes('/products/categories')).length, 4);
    assert.equal(fetchCalls.filter((url) => url.includes('/wp-json/wc/store/v1/products?')).length, 4);
    assert.equal(fetchCalls.filter((url) => url.includes('/wp-json/wp/v2/posts?')).length, 1);

    const promoSection = resolvedSections[0];
    const headinglessMenuSection = resolvedSections[1];
    const headingMenuSection = resolvedSections[2];
    const threeColumnMenuSection = resolvedSections[3];
    const ofertaSection = resolvedSections[4];

    assert.equal(promoSection?.data.title, 'Seasonal menu');
    assert.equal(promoSection?.data.image.src, '/react/images/promo2.jpg');
    assert.equal(promoSection?.data.menuColumns.length, 2);
    assert.equal(promoSection?.data.menuColumns[0]?.items[0]?.title, 'Spring ravioli');
    assert.equal(promoSection?.data.menuColumns[0]?.items[0]?.tagSlugs[0], 'seasonal');

    assert.equal(headinglessMenuSection?.data.menuColumns.length, 2);
    assert.equal(headinglessMenuSection?.data.menuColumns[0]?.items[1]?.title, 'Makaron z kurkami');

    assert.equal(headingMenuSection?.data.title, 'Desery');
    assert.equal(headingMenuSection?.data.menuColumns.length, 2);
    assert.equal(headingMenuSection?.data.menuColumns[0]?.items.length, 3);

    assert.equal(threeColumnMenuSection?.data.title, 'Desery');
    assert.equal(threeColumnMenuSection?.data.menuColumns.length, 3);
    assert.equal(threeColumnMenuSection?.data.menuColumns[2]?.items[0]?.title, 'Lody pistacjowe');

    assert.equal(ofertaSection?.data.title, 'Nasza Oferta');
    assert.equal(ofertaSection?.data.items[0]?.title, 'Kolacja degustacyjna');
    assert.equal(ofertaSection?.data.items[0]?.link.href, '/oferta/kolacja-degustacyjna');
    assert.equal(ofertaSection?.data.items[1]?.title, 'Lunch firmowy');
    assert.equal(ofertaSection?.data.items[1]?.image.src, '/react/images/oferta-fallback-b.jpg');
    assert.equal(ofertaSection?.data.items[1]?.link.href, '/oferta/lunch-firmowy');
  } finally {
    globalThis.fetch = originalFetch;

    if (typeof originalBaseUrl === 'string') {
      process.env.PUBLIC_WORDPRESS_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.PUBLIC_WORDPRESS_BASE_URL;
    }
  }
});