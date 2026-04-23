import assert from 'node:assert/strict';
import test from 'node:test';

import { fetchWordPressBuildablePages } from './wordpress.ts';

const buildablePagesPayload = {
  success: true,
  data: {
    pages: [
      {
        pageId: 101,
        slug: 'wedding-catering',
        title: 'Wedding Catering',
        status: 'published',
      },
      {
        pageId: 102,
        slug: 'seasonal-menu',
        title: 'Seasonal Menu',
        status: 'published',
      },
    ],
  },
};

test('fetchWordPressBuildablePages parses a successful listing response', async () => {
  const originalFetch = globalThis.fetch;
  const originalBaseUrl = process.env.PUBLIC_WORDPRESS_BASE_URL;
  const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];

  process.env.PUBLIC_WORDPRESS_BASE_URL = 'https://example-client.pl';

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls.push({ input, init });

    return new Response(JSON.stringify(buildablePagesPayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }) as typeof fetch;

  try {
    const pages = await fetchWordPressBuildablePages();

    assert.equal(String(fetchCalls[0]?.input), 'https://example-client.pl/wp-json/bulwar/v1/page-builder/pages');
    assert.equal(fetchCalls[0]?.init?.method, 'GET');
    assert.equal(fetchCalls[0]?.init?.headers instanceof Headers, false);
    assert.deepEqual(fetchCalls[0]?.init?.headers, {
      Accept: 'application/json',
    });
    assert.deepEqual(pages, buildablePagesPayload.data.pages);
  } finally {
    globalThis.fetch = originalFetch;
    if (typeof originalBaseUrl === 'string') {
      process.env.PUBLIC_WORDPRESS_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.PUBLIC_WORDPRESS_BASE_URL;
    }
  }
});

test('fetchWordPressBuildablePages accepts a successful listing response with top-level meta', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    ...buildablePagesPayload,
    meta: {
      request_id: 'req_123',
      timestamp: '2026-04-20T12:00:00Z',
      total: 2,
    },
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })) as typeof fetch;

  try {
    const pages = await fetchWordPressBuildablePages();

    assert.deepEqual(pages, buildablePagesPayload.data.pages);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('fetchWordPressBuildablePages rejects malformed listing payloads', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    success: true,
    data: {
      pages: [
        {
          pageId: 101,
          title: 'Missing Slug',
          status: 'published',
        },
      ],
    },
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })) as typeof fetch;

  try {
    await assert.rejects(
      () => fetchWordPressBuildablePages(),
      /invalid buildable pages list/i,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});