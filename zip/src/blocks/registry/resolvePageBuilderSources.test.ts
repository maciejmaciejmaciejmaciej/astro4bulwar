import assert from "node:assert/strict";
import test from "node:test";

import { menuThreeColumnsWithWithHeadingNoImgDefaultData } from "../menu_three_columns_with_with_heading_no_img/schema";
import { menuTwoColumnsWithNoHeadingNoImgDefaultData } from "../menu_two_columns_with_no_heading_no_img/schema";
import { menuTwoColumnsWithWithHeadingNoImgDefaultData } from "../menu_two_columns_with_with_heading_no_img/schema";
import { menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData } from "../menu_two_columns_with_with_heading_with_img_fullwidth_paralax/schema";
import { ofertaPostsSectionDefaultData } from "../oferta_posts_section/schema";
import { promo2DefaultData } from "../promo2/schema";
import { parsePageBuilderSchema } from "./pageBuilderSchema";
import { resolvePageBuilderSchemaSources } from "./resolvePageBuilderSources";

test("resolvePageBuilderSchemaSources resolves promo2 menu items from a Woo category source", async () => {
  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    fetchCalls.push(url);

    if (url.includes("/wp-json/wc/store/v1/products/categories")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 27,
            name: "Sezonowa karta",
            slug: "sezonowa-karta",
          },
        ],
      } as Response;
    }

    if (url.includes("/wp-json/wc/store/v1/products?")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 101,
            name: "Spring ravioli",
            short_description: "<p>Brown butter, hazelnut</p>",
            description: "",
            prices: {
              price: "4200",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 102,
            name: "Charred cabbage",
            short_description: "<p>Apple glaze</p>",
            description: "",
            prices: {
              price: "3600",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 103,
            name: "Burnt cheesecake",
            short_description: "<p>Cherry, vanilla</p>",
            description: "",
            prices: {
              price: "2800",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ],
      } as Response;
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  }) as typeof fetch;

  try {
    const schema = parsePageBuilderSchema({
      version: 1,
      page: {
        slug: "promo2-source-test",
        title: "Promo2 Source Test",
        status: "draft",
      },
      sections: [
        {
          id: "promo2-01",
          blockKey: "promo2",
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: promo2DefaultData,
          source: {
            sourceType: "woo_category",
            sourceValue: "sezonowa-karta",
            options: {
              limit: 3,
              splitIntoColumns: 2,
            },
          },
          meta: {},
        },
      ],
    });

    const resolved = await resolvePageBuilderSchemaSources(schema);
    const section = resolved.sections[0];

    assert.ok(section);
    assert.equal(section?.blockKey, "promo2");
    assert.equal(fetchCalls.length, 2);

    const data = section?.data as typeof promo2DefaultData;

    assert.equal(data.menuColumns.length, 2);
    assert.equal(data.menuColumns[0]?.items[0]?.title, "Spring ravioli");
    assert.equal(data.menuColumns[0]?.items[0]?.description, "Brown butter, hazelnut");
    assert.equal(
      data.menuColumns[0]?.items[0]?.priceLabel.replace(/\u00a0/g, " "),
      "42,00 zł",
    );
    assert.equal(data.menuColumns[1]?.items[0]?.title, "Burnt cheesecake");
    assert.equal(data.title, promo2DefaultData.title);
    assert.deepEqual(data.image, promo2DefaultData.image);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resolvePageBuilderSchemaSources resolves parallax hero title from Woo category and keeps explicit image data", async () => {
  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    fetchCalls.push(url);

    if (url.includes("/wp-json/wc/store/v1/products/categories")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 41,
            name: "Kolacje",
            slug: "kolacje",
          },
        ],
      } as Response;
    }

    if (url.includes("/wp-json/wc/store/v1/products?")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 201,
            name: "Stek z kalafiora",
            short_description: "<p>Maslo z tymiankiem</p>",
            description: "",
            prices: {
              price: "4200",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 202,
            name: "Pstrag wedzony",
            short_description: "<p>Ogorek, kremowy sos</p>",
            description: "",
            prices: {
              price: "4400",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 203,
            name: "Sernik baskijski",
            short_description: "<p>Wisnia, wanilia</p>",
            description: "",
            prices: {
              price: "2800",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ],
      } as Response;
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  }) as typeof fetch;

  try {
    const schema = parsePageBuilderSchema({
      version: 1,
      page: {
        slug: "menu-parallax-source-test",
        title: "Menu Parallax Source Test",
        status: "draft",
      },
      sections: [
        {
          id: "menu-parallax-01",
          blockKey: "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
          blockVersion: 1,
          variant: "white",
          enabled: true,
          data: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
          source: {
            sourceType: "woo_category",
            sourceValue: "kolacje",
            options: {
              limit: 3,
            },
          },
          meta: {},
        },
      ],
    });

    const resolved = await resolvePageBuilderSchemaSources(schema);
    const section = resolved.sections[0];

    assert.ok(section);
    assert.equal(section?.blockKey, "menu_two_columns_with_with_heading_with_img_fullwidth_paralax");
    assert.equal(fetchCalls.length, 2);

    const data = section?.data as typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData;

    assert.equal(data.heroTitle, "Kolacje");
    assert.deepEqual(data.backgroundImage, menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData.backgroundImage);
    assert.equal(data.menuColumns.length, 2);
    assert.equal(data.menuColumns[0]?.items[0]?.title, "Stek z kalafiora");
    assert.equal(data.menuColumns[0]?.items[0]?.description, "Maslo z tymiankiem");
    assert.equal(
      data.menuColumns[1]?.items[0]?.priceLabel.replace(/\u00a0/g, " "),
      "28,00 zł",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resolvePageBuilderSchemaSources resolves oferta posts from ordered WordPress post ids", async () => {
  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    fetchCalls.push(url);

    if (url.includes("/wp-json/wp/v2/posts?")
      && url.includes("include=912%2C401")
      && url.includes("orderby=include")
      && url.includes("per_page=2")
      && url.includes("_embed=wp%3Afeaturedmedia")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 912,
            title: {
              rendered: "Kolacja degustacyjna",
            },
            excerpt: {
              rendered: "<p>Siedem autorskich dan z pairingiem.</p>",
            },
            meta: {
              offer_url_link: "/oferta/kolacja-degustacyjna",
            },
            _embedded: {
              "wp:featuredmedia": [
                {
                  source_url: "https://example.com/uploads/kolacja.jpg",
                  alt_text: "Kolacja degustacyjna",
                },
              ],
            },
          },
          {
            id: 401,
            title: {
              rendered: "Lunch firmowy",
            },
            excerpt: {
              rendered: "<p>Spotkania biznesowe z pelna obsluga.</p>",
            },
            acf: {
              offer_url_link: "/oferta/lunch-firmowy",
            },
            _embedded: {
              "wp:featuredmedia": [
                {
                  source_url: "https://example.com/uploads/lunch.jpg",
                  alt_text: "Lunch firmowy w Bulwarze",
                },
              ],
            },
          },
        ],
      } as Response;
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  }) as typeof fetch;

  try {
    const schema = parsePageBuilderSchema({
      version: 1,
      page: {
        slug: "oferta-posts-source-test",
        title: "Oferta Posts Source Test",
        status: "draft",
      },
      sections: [
        {
          id: "oferta-posts-01",
          blockKey: "oferta_posts_section",
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: ofertaPostsSectionDefaultData,
          source: {
            sourceType: "wordpress_posts",
            sourceValue: [912, 401],
            options: {},
          },
          meta: {},
        },
      ],
    });

    const resolved = await resolvePageBuilderSchemaSources(schema);
    const section = resolved.sections[0];

    assert.ok(section);
    assert.equal(section?.blockKey, "oferta_posts_section");
    assert.equal(fetchCalls.length, 1);

    const data = section?.data as typeof ofertaPostsSectionDefaultData;

    assert.equal(data.title, ofertaPostsSectionDefaultData.title);
    assert.equal(data.items.length, 2);
    assert.equal(data.items[0]?.title, "Kolacja degustacyjna");
    assert.equal(data.items[0]?.description, "Siedem autorskich dan z pairingiem.");
    assert.equal(data.items[0]?.image.src, "https://example.com/uploads/kolacja.jpg");
    assert.equal(data.items[0]?.link.href, "/oferta/kolacja-degustacyjna");
    assert.equal(data.items[1]?.title, "Lunch firmowy");
    assert.equal(data.items[1]?.link.href, "/oferta/lunch-firmowy");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resolvePageBuilderSchemaSources resolves standalone two-column menu items from a Woo category source", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/wp-json/wc/store/v1/products/categories")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 73,
            name: "Lunche",
            slug: "lunche",
          },
        ],
      } as Response;
    }

    if (url.includes("/wp-json/wc/store/v1/products?")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 301,
            name: "Krem z pomidorow",
            short_description: "<p>Bazylia, oliwa</p>",
            description: "",
            prices: {
              price: "2600",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 302,
            name: "Makaron z kurkami",
            short_description: "<p>Maslo, pecorino</p>",
            description: "",
            prices: {
              price: "3900",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 303,
            name: "Tarta cytrynowa",
            short_description: "<p>Beza palona</p>",
            description: "",
            prices: {
              price: "2400",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ],
      } as Response;
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  }) as typeof fetch;

  try {
    const schema = parsePageBuilderSchema({
      version: 1,
      page: {
        slug: "menu-two-columns-source-test",
        title: "Menu Two Columns Source Test",
        status: "draft",
      },
      sections: [
        {
          id: "menu-two-columns-01",
          blockKey: "menu_two_columns_with_no_heading_no_img",
          blockVersion: 1,
          variant: "surface",
          enabled: true,
          data: menuTwoColumnsWithNoHeadingNoImgDefaultData,
          source: {
            sourceType: "woo_category",
            sourceValue: "lunche",
            options: {
              limit: 3,
            },
          },
          meta: {},
        },
      ],
    });

    const resolved = await resolvePageBuilderSchemaSources(schema);
    const section = resolved.sections[0];

    assert.ok(section);
    assert.equal(section?.blockKey, "menu_two_columns_with_no_heading_no_img");

    const data = section?.data as typeof menuTwoColumnsWithNoHeadingNoImgDefaultData;

    assert.equal(data.menuColumns.length, 2);
    assert.equal(data.menuColumns[0]?.items[0]?.title, "Krem z pomidorow");
    assert.equal(data.menuColumns[0]?.items[1]?.title, "Makaron z kurkami");
    assert.equal(data.menuColumns[1]?.items[0]?.title, "Tarta cytrynowa");
    assert.equal(data.emptyStateText, menuTwoColumnsWithNoHeadingNoImgDefaultData.emptyStateText);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resolvePageBuilderSchemaSources resolves standalone heading menu titles and column counts from Woo categories", async () => {
  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    fetchCalls.push(url);

    if (url.includes("/wp-json/wc/store/v1/products/categories")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 84,
            name: "Desery",
            slug: "desery",
          },
        ],
      } as Response;
    }

    if (url.includes("/wp-json/wc/store/v1/products?")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 401,
            name: "Sernik baskijski",
            short_description: "<p>Wisnia, wanilia</p>",
            description: "",
            prices: {
              price: "2800",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 402,
            name: "Mus czekoladowy",
            short_description: "<p>Sol morska</p>",
            description: "",
            prices: {
              price: "2600",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 403,
            name: "Panna cotta",
            short_description: "<p>Malina</p>",
            description: "",
            prices: {
              price: "2400",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 404,
            name: "Creme brulee",
            short_description: "<p>Tonka</p>",
            description: "",
            prices: {
              price: "2500",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
          {
            id: 405,
            name: "Lody pistacjowe",
            short_description: "<p>Kruchy wafelek</p>",
            description: "",
            prices: {
              price: "2200",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ],
      } as Response;
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  }) as typeof fetch;

  try {
    const schema = parsePageBuilderSchema({
      version: 1,
      page: {
        slug: "menu-heading-source-test",
        title: "Menu Heading Source Test",
        status: "draft",
      },
      sections: [
        {
          id: "menu-two-columns-heading-01",
          blockKey: "menu_two_columns_with_with_heading_no_img",
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: menuTwoColumnsWithWithHeadingNoImgDefaultData,
          source: {
            sourceType: "woo_category",
            sourceValue: "desery",
            options: {
              limit: 5,
            },
          },
          meta: {},
        },
        {
          id: "menu-three-columns-heading-01",
          blockKey: "menu_three_columns_with_with_heading_no_img",
          blockVersion: 1,
          variant: "white",
          enabled: true,
          data: menuThreeColumnsWithWithHeadingNoImgDefaultData,
          source: {
            sourceType: "woo_category",
            sourceValue: 84,
            options: {
              limit: 5,
            },
          },
          meta: {},
        },
      ],
    });

    const resolved = await resolvePageBuilderSchemaSources(schema);
    const twoColumnSection = resolved.sections[0];
    const threeColumnSection = resolved.sections[1];

    assert.equal(fetchCalls.length, 4);

    const twoColumnData = twoColumnSection?.data as typeof menuTwoColumnsWithWithHeadingNoImgDefaultData;
    const threeColumnData = threeColumnSection?.data as typeof menuThreeColumnsWithWithHeadingNoImgDefaultData;

    assert.equal(twoColumnData.title, "Desery");
    assert.equal(twoColumnData.menuColumns.length, 2);
    assert.equal(twoColumnData.menuColumns[0]?.items.length, 3);
    assert.equal(twoColumnData.menuColumns[1]?.items.length, 2);

    assert.equal(threeColumnData.title, "Desery");
    assert.equal(threeColumnData.menuColumns.length, 3);
    assert.equal(threeColumnData.menuColumns[0]?.items.length, 2);
    assert.equal(threeColumnData.menuColumns[1]?.items.length, 2);
    assert.equal(threeColumnData.menuColumns[2]?.items.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});