# How Navbar/Footer Work

This document explains the end-to-end flow for the shared navbar and footer as implemented today.

## 1. Storage model

There is one bridge-owned settings option and one shared footer page.

- The option name comes from `Constants::globalLayoutOptionName()` and defaults to `bulwar_bridge_global_layout`.
- The option stores:
  - `navbar`: the canonical navbar object.
  - `footerPageId`: the internal reference to the shared footer page.
- The footer content itself is not stored in the option.

The footer lives in the referenced WordPress page's `page_builder_schema.sections[]`. The bridge expects one enabled block with this exact authoring contract:

```json
{
  "blockKey": "shared_footer",
  "blockVersion": 1,
  "enabled": true,
  "source": null,
  "data": {
    "brand": { "name": "Bulwar", "href": "/", "logoSrc": null, "logoAlt": null },
    "address": { "heading": "Adres", "lines": [] },
    "contact": { "heading": "Kontakt", "items": [] },
    "hours": { "heading": "Godziny", "lines": [] },
    "socialLinks": [],
    "legalLinks": [],
    "copyright": "(c) Bulwar"
  }
}
```

Shared footer authoring rule: only `shared_footer` blocks are considered by the runtime footer resolver. The resolver is section-order sensitive and does not enforce uniqueness: it skips disabled `shared_footer` blocks, then treats the first enabled `shared_footer` as decisive, resolving if it is valid or failing immediately if it is invalid. Later `shared_footer` blocks are ignored. Operators should keep exactly one enabled `shared_footer` block on the referenced page, and section order matters.

## 2. Bridge resolution

The public entry point is `GET /wp-json/bulwar/v1/layout/global`.

Resolution flow:

1. `GlobalLayoutController::show()` calls `GlobalLayoutResolver::resolve()`.
2. The resolver reads the global layout option.
3. `navbar` is normalized directly from the option data.
4. `footerPageId` is resolved internally to a WordPress page.
5. The resolver reads that page's `page_builder_schema` meta, scans `sections[]`, and extracts the enabled `shared_footer` block.
6. The bridge returns a normalized public payload plus meta statuses describing whether the option and footer resolved cleanly.

Important boundary:

- `footerPageId` is internal storage and debug context only.
- The public response exposes navbar/footer only through `data.globalLayout`; the standard envelope still includes top-level `success` and `meta`, and `meta` also carries `request_id` and `timestamp`.
- Both React and Astro contract parsers reject public payloads that try to expose `footerPageId`.

## 3. Public contract

The repo locks the public contract in both runtimes:

- `zip/src/blocks/registry/globalLayoutContract.ts`
- `astro-site/src/lib/globalLayoutContract.ts`

The contract guarantees these public fields:

- `globalLayout.navbar.brand`
- `globalLayout.navbar.primaryItems[]`
- `globalLayout.navbar.companyLinks[]`
- `globalLayout.navbar.legalLinks[]`
- `globalLayout.footer.brand`
- `globalLayout.footer.address`
- `globalLayout.footer.contact`
- `globalLayout.footer.hours`
- `globalLayout.footer.socialLinks[]`
- `globalLayout.footer.legalLinks[]`
- `globalLayout.footer.copyright`
- `meta.layout_option_status`
- `meta.footer_status`

Two rules matter operationally:

- Brand names are trimmed and must stay non-empty after trimming.
- `resolved` means the bridge found a usable source and produced a valid public payload. It does not guarantee every authored field survived unchanged: blank or invalid values may normalize to defaults, and malformed or empty links are filtered.
- A payload is only considered live shared chrome when both meta fields equal `resolved`.

## 4. React consumption

React fetches the bridge payload in `zip/src/lib/fetchWordPressGlobalLayout.ts` and mounts the shared shell in `zip/src/layouts/RootLayout.tsx`.

Current route scope:

- Shared shell routes: `/`, `/template`, `/testowa-blueprint`
- Outside the shared shell: catering routes

Runtime flow:

1. `RootLayout` initializes from `initialGlobalLayout` or from a session-scoped last-known-good cache in `sessionStorage`.
2. It fetches `/wp-json/bulwar/v1/layout/global` once on mount.
3. The fetch helper rejects if the HTTP/app contract is broken or if either meta status is not `resolved`.
4. On success, `RootLayout` stores the result as the new last-known-good snapshot and passes the data into `Navbar2` and `Footer`.
5. If the shell is still unresolved, React allows one delayed retry only for transport failures and HTTP 5xx failures.
6. If there is no valid live or cached payload, the route content still renders, but shared navbar/footer chrome stays absent.

Fail-closed rules in React:

- No production-facing React component inserts placeholder navbar/footer defaults at runtime.
- `Navbar2` and `Footer` are treated as consumers of validated data, not fallback builders.
- Invalid cached snapshots are discarded rather than converted into synthetic chrome.

## 5. Astro consumption

Astro fetches the same endpoint in `astro-site/src/lib/wordpress.ts` and passes the result into `astro-site/src/layouts/BaseLayout.astro` from `astro-site/src/pages/[slug].astro`.

Runtime flow:

1. `[slug].astro` loads page-builder content and global layout in parallel.
2. The Astro fetch helper parses the same public contract and rejects unresolved meta statuses.
3. `BaseLayout` renders navbar/footer only when `globalLayout` is present.

Fail-closed rules in Astro:

- Astro still keeps `DEFAULT_GLOBAL_LAYOUT_DATA`, but only as an explicitly controlled fallback payload in the fetch layer.
- In non-production mode, fallback remains allowed so local work can continue before the live endpoint is available.
- In production/static builds, fallback is disabled by default.
- Production fallback is only re-enabled with `ASTRO_ALLOW_GLOBAL_LAYOUT_FALLBACK=true`.
- Without that override, a failed global-layout fetch stops the build instead of shipping placeholder chrome.

## 6. Fallback and failure behavior

The bridge and the runtimes intentionally fail at different layers:

- Bridge: always returns a normalized shape and reports resolution quality in `meta`.
- React/Astro: accept the payload only when both meta fields are `resolved`.

That means these cases are visible and explicit:

- Missing or invalid option data
- Missing `footerPageId`
- Missing footer page
- Missing, disabled, invalid, or incompatible `shared_footer` block
- Broken public contract

The result is deliberate: the system does not silently downgrade to production placeholder navbar/footer chrome when the source of truth is unhealthy.

## 7. What stays internal

These details are internal and should stay out of public runtime consumers:

- `footerPageId`
- Raw footer page-builder sections
- WordPress storage layout beyond the normalized public payload
- Resolver-only fallback statuses except as surfaced through top-level `meta`

If a downstream consumer needs the footer page id or raw footer sections, that is a new backend contract decision, not part of the current public API.

## 8. Editing workflow

When changing navbar or footer content, use this sequence:

1. Update the navbar object in the WordPress global layout option.
2. Update footer content in the shared footer page by editing the enabled `shared_footer` block data inside `page_builder_schema.sections[]`.
3. Do not expose or depend on `footerPageId` in React, Astro, or external docs.
4. Call `GET /wp-json/bulwar/v1/layout/global` and verify the visible content.
5. Confirm `meta.layout_option_status=resolved` and `meta.footer_status=resolved`, then spot-check the returned content because `resolved` still allows normalization and filtering of bad authored values.
6. If Astro production output depends on the change, ensure the live endpoint is healthy before running a production/static build, or set the explicit override only when that fallback is intentionally desired.

Practical rule: if the shared footer content needs to change, edit the shared footer block, not the public API contract and not the React/Astro presenters.