import assert from "node:assert/strict";
import test from "node:test";

import {
  createWordPressPageBuilderClient,
  parsePageBuilderWordPressEnv,
} from "./wordpressPageBuilderClient.ts";

type MockRequest = {
  url: string;
  init?: RequestInit;
};

const createJsonResponse = (payload: unknown, status = 200): Response => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

test("WordPress runtime client creates a missing page by slug", async () => {
  const requests: MockRequest[] = [];
  const client = createWordPressPageBuilderClient({
    baseUrl: "https://example.test",
    username: "agent",
    applicationPassword: "secret-app-password",
    fetch: async (input, init) => {
      requests.push({ url: String(input), init });

      if (requests.length === 1) {
        return createJsonResponse([]);
      }

      if (requests.length === 2) {
        return createJsonResponse({
          id: 321,
          slug: "menu-kolacje",
          status: "draft",
          title: {
            rendered: "Kolacje",
          },
        });
      }

      throw new Error("Unexpected request");
    },
  });

  const page = await client.ensurePageExists({
    slug: "menu-kolacje",
    title: "Kolacje",
    status: "draft",
  });

  assert.equal(page.id, 321);
  assert.match(requests[0]?.url ?? "", /\/wp-json\/wp\/v2\/pages\?/);
  assert.match(requests[0]?.url ?? "", /slug=menu-kolacje/);
  assert.match(requests[0]?.url ?? "", /context=edit/);
  assert.match(requests[0]?.url ?? "", /status=any/);
  assert.equal(requests[1]?.init?.method, "POST");
  assert.equal(
    requests[1]?.init?.headers instanceof Headers
      ? requests[1].init.headers.get("Authorization")
      : null,
    `Basic ${Buffer.from("agent:secret-app-password").toString("base64")}`,
  );

  const createBody = JSON.parse(String(requests[1]?.init?.body));
  assert.equal(createBody.slug, "menu-kolacje");
  assert.equal(createBody.title, "Kolacje");
});

test("WordPress runtime client updates an existing page instead of creating a duplicate", async () => {
  const requests: MockRequest[] = [];
  const client = createWordPressPageBuilderClient({
    baseUrl: "https://example.test",
    username: "agent",
    applicationPassword: "secret-app-password",
    fetch: async (input, init) => {
      requests.push({ url: String(input), init });

      if (requests.length === 1) {
        return createJsonResponse([
          {
            id: 654,
            slug: "menu-kolacje",
            status: "draft",
            title: {
              rendered: "Old title",
            },
          },
        ]);
      }

      if (requests.length === 2) {
        return createJsonResponse({
          id: 654,
          slug: "menu-kolacje",
          status: "publish",
          title: {
            rendered: "Kolacje published",
          },
        });
      }

      throw new Error("Unexpected request");
    },
  });

  const page = await client.ensurePageExists({
    slug: "menu-kolacje",
    title: "Kolacje published",
    status: "published",
  });

  assert.equal(page.id, 654);
  assert.equal(requests.length, 2);
  assert.match(requests[1]?.url ?? "", /\/wp-json\/wp\/v2\/pages\/654$/);

  const updateBody = JSON.parse(String(requests[1]?.init?.body));
  assert.equal(updateBody.slug, "menu-kolacje");
  assert.equal(updateBody.status, "publish");
});

test("WordPress runtime client detects an existing draft page by slug before creating a new page", async () => {
  const requests: MockRequest[] = [];
  const client = createWordPressPageBuilderClient({
    baseUrl: "https://example.test",
    username: "agent",
    applicationPassword: "secret-app-password",
    fetch: async (input, init) => {
      requests.push({ url: String(input), init });

      if (requests.length === 1) {
        return createJsonResponse([
          {
            id: 122,
            slug: "restauracja-na-wesele",
            status: "draft",
            title: {
              rendered: "Restauracja na wesele",
            },
          },
        ]);
      }

      if (requests.length === 2) {
        return createJsonResponse({
          id: 122,
          slug: "restauracja-na-wesele",
          status: "draft",
          title: {
            rendered: "Restauracja na wesele",
          },
        });
      }

      throw new Error("Unexpected request");
    },
  });

  const page = await client.ensurePageExists({
    slug: "restauracja-na-wesele",
    title: "Restauracja na wesele",
    status: "draft",
  });

  assert.equal(page.id, 122);
  assert.equal(requests.length, 2);
  assert.match(requests[0]?.url ?? "", /slug=restauracja-na-wesele/);
  assert.match(requests[0]?.url ?? "", /context=edit/);
  assert.match(requests[0]?.url ?? "", /status=any/);
  assert.match(requests[1]?.url ?? "", /\/wp-json\/wp\/v2\/pages\/122$/);

  const updateBody = JSON.parse(String(requests[1]?.init?.body));
  assert.equal(updateBody.slug, "restauracja-na-wesele");
  assert.equal(updateBody.title, "Restauracja na wesele");
});

test("WordPress runtime client fetches site context root values", async () => {
  const requests: MockRequest[] = [];
  const client = createWordPressPageBuilderClient({
    baseUrl: "https://example.test/",
    username: "agent",
    applicationPassword: "secret-app-password",
    fetch: async (input, init) => {
      requests.push({ url: String(input), init });

      return createJsonResponse({
        success: true,
        data: {
          CompanyName: "Bulwar Restauracja",
          websiteUrl: "https://example.test/",
        },
      });
    },
  });

  const siteContext = await client.fetchSiteContext();

  assert.deepEqual(siteContext, {
    CompanyName: "Bulwar Restauracja",
    websiteUrl: "https://example.test/",
  });
  assert.equal(requests.length, 1);
  assert.match(requests[0]?.url ?? "", /\/wp-json\/bulwar\/v1\/page-builder\/site-context$/);
  assert.equal(requests[0]?.init?.method, "GET");
});

test("WordPress runtime env parser rejects missing values", () => {
  assert.throws(
    () => parsePageBuilderWordPressEnv({ PAGE_BUILDER_WORDPRESS_USERNAME: "agent" }),
    /PAGE_BUILDER_WORDPRESS_BASE_URL/,
  );
});