# Global Layout Contract

This note locks the v1 repo-side contract before any runtime wiring changes.

## Public payload

- Future bridge response shape: `success.data.globalLayout`
- Public contract includes only `navbar` and resolved `footer`
- Public contract must not expose `footerPageId`

### `globalLayout.navbar`

- `brand`: `{ name, href, logoSrc, logoAlt }`
- `primaryItems[]`: `{ label, href, description, children[] }`
- `companyLinks[]`: `{ label, href }`
- `legalLinks[]`: `{ label, href }`

### `globalLayout.footer`

- `brand`: `{ name, href, logoSrc, logoAlt }`
- `address`: `{ heading, lines[] }`
- `contact`: `{ heading, items[] }` where each item is `{ label, href }`
- `hours`: `{ heading, lines[] }`
- `socialLinks[]`: `{ label, href }`
- `legalLinks[]`: `{ label, href }`
- `copyright`: `string`

## Fallback rules

- `brand.href` defaults to `/`
- `brand.logoSrc` and `brand.logoAlt` default to `null`
- `primaryItems[].description` defaults to `null`
- `primaryItems[].children`, `companyLinks`, `legalLinks`, `address.lines`, `contact.items`, `hours.lines`, `socialLinks`, and `footer.legalLinks` default to empty arrays

## Internal storage rule

- The shared footer stays in the shared footer page `page_builder_schema.sections[]`
- The bridge keeps `footerPageId` as an internal storage detail only
- The shared footer page must contain one enabled dedicated footer section with:
  - `blockKey: "shared_footer"`
  - `blockVersion: 1`
  - `source: null`
  - `data` matching the public `globalLayout.footer` shape exactly
- `page_builder_schema.meta.footer` is not part of the v1 contract and should not be used

## Repo contract modules

- React contract module: `zip/src/blocks/registry/globalLayoutContract.ts`
- Astro contract module: `astro-site/src/lib/globalLayoutContract.ts`
- Both modules must keep field names, defaults, block key, and block version identical