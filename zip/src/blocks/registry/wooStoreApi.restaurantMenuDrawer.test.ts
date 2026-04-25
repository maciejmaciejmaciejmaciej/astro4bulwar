import assert from "node:assert/strict";
import test from "node:test";

import { resolveWooMenuSectionsByCategoryIds } from "./wooStoreApi";

test("resolveWooMenuSectionsByCategoryIds preserves category order and maps each category into one drawer section", async () => {
  const originalFetch = globalThis.fetch;
  const originalWordPressBaseUrl = process.env.VITE_WORDPRESS_BASE_URL;
  const fetchCalls: string[] = [];

  process.env.VITE_WORDPRESS_BASE_URL = "https://example.com";

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    fetchCalls.push(url);

    if (url.includes("/wp-json/wc/store/v1/products/categories")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 12,
            name: "Breakfast",
            slug: "breakfast",
          },
          {
            id: 18,
            name: "Lunch",
            slug: "lunch",
          },
          {
            id: 24,
            name: "Dessert",
            slug: "dessert",
          },
        ],
      } as Response;
    }

    if (url.includes("category=18")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 301,
            name: "Lunch Ravioli",
            short_description: "<p>Ricotta, sage</p>",
            description: "",
            prices: {
              price: "4900",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ],
      } as Response;
    }

    if (url.includes("category=12")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 302,
            name: "Breakfast Brioche",
            short_description: "<p>Mascarpone, berries</p>",
            description: "",
            prices: {
              price: "3200",
              currency_code: "PLN",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            tags: [],
          },
        ],
      } as Response;
    }

    if (url.includes("category=24")) {
      return {
        ok: true,
        json: async () => [
          {
            id: 303,
            name: "Dessert Tart",
            short_description: "<p>Lemon cream</p>",
            description: "",
            prices: {
              price: "2600",
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
    const sections = await resolveWooMenuSectionsByCategoryIds([18, 12, 24]);

    assert.equal(fetchCalls.length, 4);
    assert.deepEqual(
      sections.map((section) => section.heading),
      ["Lunch", "Breakfast", "Dessert"],
    );
    assert.equal(sections[0]?.menuColumns.length, 1);
    assert.equal(sections[0]?.menuColumns[0]?.items[0]?.title, "Lunch Ravioli");
    assert.equal(sections[1]?.menuColumns[0]?.items[0]?.title, "Breakfast Brioche");
    assert.equal(sections[2]?.menuColumns[0]?.items[0]?.title, "Dessert Tart");
  } finally {
    globalThis.fetch = originalFetch;

    if (originalWordPressBaseUrl) {
      process.env.VITE_WORDPRESS_BASE_URL = originalWordPressBaseUrl;
    } else {
      delete process.env.VITE_WORDPRESS_BASE_URL;
    }
  }
});