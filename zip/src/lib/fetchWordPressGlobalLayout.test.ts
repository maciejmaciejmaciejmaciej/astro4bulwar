import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchWordPressGlobalLayout,
  GlobalLayoutFetchError,
  isRetryableGlobalLayoutError,
} from "./fetchWordPressGlobalLayout";

const successPayload = {
  success: true,
  data: {
    globalLayout: {
      navbar: {
        brand: {
          name: "Bulwar",
          href: "/",
          logoSrc: "/react/images/logo.png",
          logoAlt: "Bulwar",
        },
        primaryItems: [
          {
            label: "Start",
            href: "/",
            description: "Start strony.",
            children: [],
          },
        ],
        companyLinks: [],
        legalLinks: [],
      },
      footer: {
        brand: {
          name: "Bulwar",
          href: "/",
          logoSrc: null,
          logoAlt: null,
        },
        address: {
          heading: "Adres",
          lines: ["Stary Rynek 37"],
        },
        contact: {
          heading: "Kontakt",
          items: [],
        },
        hours: {
          heading: "Godziny",
          lines: ["Codziennie"],
        },
        socialLinks: [],
        legalLinks: [],
        copyright: "(c) 2026 Bulwar.",
      },
    },
  },
  meta: {
    request_id: "req-react-global-layout",
    timestamp: "2026-04-18T00:00:00Z",
    layout_option_status: "resolved",
    footer_status: "resolved",
  },
};

test("fetchWordPressGlobalLayout parses a successful bridge response when top-level meta is present", async () => {
  const originalFetch = globalThis.fetch;
  const originalBaseUrl = process.env.VITE_WORDPRESS_BASE_URL;
  const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];

  process.env.VITE_WORDPRESS_BASE_URL = "https://example-client.pl";

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls.push({ input, init });

    return new Response(JSON.stringify(successPayload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }) as typeof fetch;

  try {
    const layout = await fetchWordPressGlobalLayout();

    assert.equal(String(fetchCalls[0]?.input), "https://example-client.pl/wp-json/bulwar/v1/layout/global");
    assert.equal(fetchCalls[0]?.init?.method, "GET");
    assert.equal(layout.navbar.brand.logoSrc, "/react/images/logo.png");
    assert.equal(layout.footer.address.lines[0], "Stary Rynek 37");
  } finally {
    globalThis.fetch = originalFetch;
    if (typeof originalBaseUrl === "string") {
      process.env.VITE_WORDPRESS_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.VITE_WORDPRESS_BASE_URL;
    }
  }
});

test("fetchWordPressGlobalLayout throws the bridge error message when the request fails", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    success: false,
    error: {
      message: "Global layout unavailable",
    },
  }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  })) as typeof fetch;

  try {
    await assert.rejects(() => fetchWordPressGlobalLayout(), (error) => {
      assert.ok(error instanceof GlobalLayoutFetchError);
      assert.equal(error.kind, "http");
      assert.equal(error.retryable, true);
      assert.equal(isRetryableGlobalLayoutError(error), true);
      assert.match(error.message, /Global layout unavailable/);

      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchWordPressGlobalLayout marks transport failures as retryable before the shell resolves", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    throw new TypeError("fetch failed");
  }) as typeof fetch;

  try {
    await assert.rejects(() => fetchWordPressGlobalLayout(), (error) => {
      assert.ok(error instanceof GlobalLayoutFetchError);
      assert.equal(error.kind, "transport");
      assert.equal(error.retryable, true);
      assert.equal(isRetryableGlobalLayoutError(error), true);
      assert.match(error.message, /failed before reaching the server/i);

      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchWordPressGlobalLayout rejects unresolved global layout statuses", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    ...successPayload,
    meta: {
      ...successPayload.meta,
      layout_option_status: "missing",
      footer_status: "resolved",
    },
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })) as typeof fetch;

  try {
    await assert.rejects(() => fetchWordPressGlobalLayout(), (error) => {
      assert.ok(error instanceof GlobalLayoutFetchError);
      assert.equal(error.kind, "meta-status");
      assert.equal(error.retryable, false);
      assert.equal(isRetryableGlobalLayoutError(error), false);
      assert.match(error.message, /layout_option_status=missing, footer_status=resolved/);

      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchWordPressGlobalLayout rejects responses with missing meta statuses", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    ...successPayload,
    meta: {
      request_id: "req-react-global-layout",
    },
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })) as typeof fetch;

  try {
    await assert.rejects(() => fetchWordPressGlobalLayout(), (error) => {
      assert.ok(error instanceof GlobalLayoutFetchError);
      assert.equal(error.kind, "contract");
      assert.equal(error.retryable, false);
      assert.equal(isRetryableGlobalLayoutError(error), false);
      assert.match(error.message, /layout_option_status|footer_status/);

      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});