import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { parseGlobalLayoutApiResponse } from './globalLayoutContract.ts';
import { fetchWordPressGlobalLayout, shouldAllowGlobalLayoutFallback } from './wordpress.ts';
import { buildFooterWordmark, splitNavbarPrimaryItems } from './globalLayoutPresentation.ts';

const successPayload = {
  success: true,
  data: {
    globalLayout: {
      navbar: {
        brand: {
          name: 'Bulwar',
          href: '/',
          logoSrc: '/react/images/logo.png',
          logoAlt: 'Bulwar',
        },
        primaryItems: [
          { label: 'Start', href: '/', description: 'Start strony.', children: [] },
          { label: 'Menu', href: '/menu', description: 'Menu strony.', children: [] },
          { label: 'Catering', href: '/catering', description: 'Catering strony.', children: [] },
          { label: 'Kontakt', href: '/kontakt', description: 'Kontakt strony.', children: [] },
          { label: 'Rezerwacje', href: '/rezerwacje', description: 'Rezerwacje strony.', children: [] },
        ],
        companyLinks: [
          { label: 'Rezerwuj stolik', href: '/rezerwacje' },
        ],
        legalLinks: [
          { label: 'Regulamin', href: '/regulamin' },
        ],
      },
      footer: {
        brand: {
          name: 'Bulwar',
          href: '/',
          logoSrc: null,
          logoAlt: null,
        },
        address: {
          heading: 'Adres',
          lines: ['Stary Rynek 37'],
        },
        contact: {
          heading: 'Kontakt',
          items: [],
        },
        hours: {
          heading: 'Godziny',
          lines: ['Codziennie'],
        },
        socialLinks: [],
        legalLinks: [],
        copyright: '(c) 2026 Bulwar.',
      },
    },
  },
  meta: {
    request_id: 'req-astro-global-layout',
    timestamp: '2026-04-18T00:00:00Z',
    layout_option_status: 'resolved',
    footer_status: 'resolved',
  },
};

test('fetchWordPressGlobalLayout parses a successful bridge response when top-level meta is present', async () => {
  const originalFetch = globalThis.fetch;
  const originalBaseUrl = process.env.PUBLIC_WORDPRESS_BASE_URL;
  const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];

  process.env.PUBLIC_WORDPRESS_BASE_URL = 'https://example-client.pl';

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls.push({ input, init });

    return new Response(JSON.stringify(successPayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }) as typeof fetch;

  try {
    const layout = await fetchWordPressGlobalLayout();

    assert.equal(String(fetchCalls[0]?.input), 'https://example-client.pl/wp-json/bulwar/v1/layout/global');
    assert.equal(fetchCalls[0]?.init?.method, 'GET');
    assert.equal(layout.navbar.brand.logoSrc, '/react/images/logo.png');
    assert.equal(layout.footer.address.lines[0], 'Stary Rynek 37');
  } finally {
    globalThis.fetch = originalFetch;
    if (typeof originalBaseUrl === 'string') {
      process.env.PUBLIC_WORDPRESS_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.PUBLIC_WORDPRESS_BASE_URL;
    }
  }
});

test('fetchWordPressGlobalLayout throws the bridge error message when the request fails', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    success: false,
    error: {
      message: 'Global layout unavailable',
    },
  }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  })) as typeof fetch;

  try {
    await assert.rejects(() => fetchWordPressGlobalLayout(), /Global layout unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('fetchWordPressGlobalLayout rejects unresolved global layout statuses', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    ...successPayload,
    meta: {
      ...successPayload.meta,
      layout_option_status: 'resolved',
      footer_status: 'fallback_missing_footer_page_id',
    },
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })) as typeof fetch;

  try {
    await assert.rejects(
      () => fetchWordPressGlobalLayout(),
      /layout_option_status=resolved, footer_status=fallback_missing_footer_page_id/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('fetchWordPressGlobalLayout rejects responses with invalid meta statuses', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    ...successPayload,
    meta: {
      ...successPayload.meta,
      layout_option_status: 123,
      footer_status: null,
    },
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })) as typeof fetch;

  try {
    await assert.rejects(() => fetchWordPressGlobalLayout(), /layout_option_status|footer_status/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('shouldAllowGlobalLayoutFallback stays enabled for local development by default', () => {
  assert.equal(shouldAllowGlobalLayoutFallback({
    prod: false,
    allowFallback: undefined,
  }), true);
});

test('shouldAllowGlobalLayoutFallback stays disabled for production without explicit override', () => {
  assert.equal(shouldAllowGlobalLayoutFallback({
    prod: true,
    allowFallback: undefined,
  }), false);
});

test('shouldAllowGlobalLayoutFallback accepts an explicit production override flag', () => {
  assert.equal(shouldAllowGlobalLayoutFallback({
    prod: true,
    allowFallback: 'true',
  }), true);
});

test('shouldAllowGlobalLayoutFallback accepts a boolean-shaped production override flag', () => {
  assert.equal(shouldAllowGlobalLayoutFallback({
    prod: true,
    allowFallback: true,
  }), true);
});

test('splitNavbarPrimaryItems keeps order and balances both desktop menu columns', () => {
  const result = splitNavbarPrimaryItems(successPayload.data.globalLayout.navbar.primaryItems);

  assert.deepEqual(result.leading.map((item) => item.label), ['Start', 'Menu', 'Catering']);
  assert.deepEqual(result.trailing.map((item) => item.label), ['Kontakt', 'Rezerwacje']);
});

test('buildFooterWordmark does not synthesize placeholder branding for whitespace names', () => {
  assert.deepEqual(buildFooterWordmark('Bulwar'), {
    leading: 'B',
    trailing: 'ULWAR',
  });

  assert.deepEqual(buildFooterWordmark('   '), {
    leading: '',
    trailing: '',
  });
});

test('parseGlobalLayoutApiResponse rejects whitespace-only brand names after trim', () => {
  assert.throws(
    () => parseGlobalLayoutApiResponse({
      ...successPayload,
      data: {
        globalLayout: {
          ...successPayload.data.globalLayout,
          footer: {
            ...successPayload.data.globalLayout.footer,
            brand: {
              ...successPayload.data.globalLayout.footer.brand,
              name: '   ',
            },
          },
        },
      },
    }),
    /name/i,
  );
});

test('Astro layout chrome no longer ships runtime placeholder defaults in production-facing components', async () => {
  const [baseLayoutSource, navbarSource, footerSource] = await Promise.all([
    readFile(new URL('../layouts/BaseLayout.astro', import.meta.url), 'utf8'),
    readFile(new URL('../components/Navbar.astro', import.meta.url), 'utf8'),
    readFile(new URL('../components/Footer.astro', import.meta.url), 'utf8'),
  ]);

  assert.doesNotMatch(baseLayoutSource, /DEFAULT_GLOBAL_LAYOUT_DATA/);
  assert.match(baseLayoutSource, /globalLayout \? <Navbar navbar=\{globalLayout\.navbar\} \/> : null/);
  assert.match(baseLayoutSource, /globalLayout \? <Footer footer=\{globalLayout\.footer\} \/> : null/);

  assert.doesNotMatch(navbarSource, /DEFAULT_GLOBAL_LAYOUT_DATA/);
  assert.doesNotMatch(navbarSource, /const \{ navbar = /);

  assert.doesNotMatch(footerSource, /DEFAULT_GLOBAL_LAYOUT_DATA/);
  assert.doesNotMatch(footerSource, /const \{ footer = /);
});