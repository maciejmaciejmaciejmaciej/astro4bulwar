# Global Navbar/Footer Operator Reference

This note is the current-state quick reference for the shared navbar/footer system.

## Source of truth

- WordPress option: `Constants::globalLayoutOptionName()`.
- Default option name: `bulwar_bridge_global_layout`.
- Stored keys:
  - `navbar`: canonical navbar data.
  - `footerPageId`: internal pointer to the shared footer page.
- `footerPageId` is storage-only and must never appear in the public runtime payload.

## Footer authoring rule

- Footer content is resolved from the page referenced by `footerPageId`.
- The bridge reads that page's `page_builder_schema` post meta and looks for one enabled footer block with:
  - `blockKey: "shared_footer"`
  - `blockVersion: 1`
  - `source: null`
- Resolution is first-match/first-failure in section order for `shared_footer` blocks: disabled matches are skipped, the first enabled match either resolves if valid or fails immediately if invalid, and later matches are ignored.
- The resolver does not enforce uniqueness. Operators should keep exactly one enabled `shared_footer` block on the referenced page, and section order matters.
- The public `footer` object is the normalized `data` from that block.
- If the page exists but the block is missing, disabled, invalid, or incompatible, the bridge emits fallback footer data and reports that explicitly in `meta.footer_status`.

## Public API

- Endpoint: `GET /wp-json/bulwar/v1/layout/global`
- Route: `wordpress-plugin/bulwar-bridge/src/Http/Routes.php`
- Controller: `wordpress-plugin/bulwar-bridge/src/Http/Controllers/GlobalLayoutController.php`
- Resolver: `wordpress-plugin/bulwar-bridge/src/Layout/GlobalLayoutResolver.php`

Response shape:

```json
{
  "success": true,
  "data": {
    "globalLayout": {
      "navbar": {
        "brand": {
          "name": "Bulwar",
          "href": "/",
          "logoSrc": null,
          "logoAlt": null
        },
        "primaryItems": [],
        "companyLinks": [],
        "legalLinks": []
      },
      "footer": {
        "brand": {
          "name": "Bulwar",
          "href": "/",
          "logoSrc": null,
          "logoAlt": null
        },
        "address": { "heading": "Adres", "lines": [] },
        "contact": { "heading": "Kontakt", "items": [] },
        "hours": { "heading": "Godziny", "lines": [] },
        "socialLinks": [],
        "legalLinks": [],
        "copyright": "(c) Bulwar"
      }
    }
  },
  "meta": {
    "layout_option_status": "resolved|fallback_*",
    "footer_status": "resolved|fallback_*"
  }
}
```

Rules:

- Clients parse both `data.globalLayout` and `meta`.
- The response envelope also includes top-level `success`, and `meta` includes `request_id` plus `timestamp` in addition to the layout statuses.
- `layout_option_status` and `footer_status` must both equal `resolved` for the payload to be accepted as live shared chrome.
- `resolved` means the bridge found a usable source and emitted a valid public payload. It does not mean every authored field was preserved verbatim: blank or invalid values may normalize to defaults, and malformed or empty links may be filtered out.
- `footerPageId` stays internal and is rejected by the public contract parsers.
- Brand names are trimmed and must be non-empty after trim.

## React runtime

- Fetch helper: `zip/src/lib/fetchWordPressGlobalLayout.ts`
- Shell owner: `zip/src/layouts/RootLayout.tsx`
- Route mount: `zip/src/App.tsx`

Current behavior:

- `RootLayout` fetches the global layout on mount and renders `Navbar2` and `Footer` only when a real layout object exists.
- There is no runtime placeholder navbar/footer in production-facing React components.
- `RootLayout` restores a session-scoped last-known-good snapshot from `sessionStorage` when available.
- If the shell is still unresolved, React allows one delayed retry only for transport failures and HTTP 5xx failures.
- Contract failures, application failures, unresolved meta statuses, and other non-retryable errors do not trigger retry.
- The shared shell currently wraps `/`, `/template`, and `/testowa-blueprint`.
- Catering routes remain outside `RootLayout`.

## Astro runtime

- Fetch helper: `astro-site/src/lib/wordpress.ts`
- Load point: `astro-site/src/pages/[slug].astro`
- Shell: `astro-site/src/layouts/BaseLayout.astro`

Current behavior:

- `[slug].astro` loads page-builder data and global layout in parallel.
- `BaseLayout` renders navbar/footer only when `globalLayout` is present.
- Astro rejects unresolved `layout_option_status` and `footer_status` the same way React does.
- `DEFAULT_GLOBAL_LAYOUT_DATA` still exists only as a controlled Astro fallback payload.
- Fallback is allowed automatically in non-production mode.
- In production/static builds, fallback is fail-closed unless `ASTRO_ALLOW_GLOBAL_LAYOUT_FALLBACK=true` is set explicitly.
- Without that override, a global-layout fetch failure aborts the build instead of shipping placeholder chrome.

## Failure semantics

- The bridge always normalizes a payload and reports fallback states in `meta`.
- React and Astro both treat any non-`resolved` meta status as a failure.
- React may keep showing a previously cached last-known-good layout for the current browser session.
- Neither runtime seeds the production shell from local placeholder navbar/footer defaults.

## Operator workflow

- Update navbar content in the WordPress global layout option.
- Update footer content only in the shared footer page's `shared_footer` block data.
- Do not add `footerPageId` to client-side payloads or downstream docs.
- After any change, verify `GET /wp-json/bulwar/v1/layout/global` returns the expected content and `meta.layout_option_status=resolved` plus `meta.footer_status=resolved`; then spot-check the returned footer/navbar fields because `resolved` does not prevent normalization or link filtering.

### Host-side footer seed/fix

Use the repo-owned script when live WordPress is missing a usable `footerPageId` or when the shared footer page must be recreated from a known-good payload.

What it mutates:

- One backup snapshot option: `<global-layout-option>_backup_<timestamp>_<uniqid>`.
- One WordPress page of type `page`: create new or update existing target page.
- One post meta entry on that page: `page_builder_schema`.
- One merged field in the bridge option: `footerPageId` only by default. Existing `navbar` and any other keys stay intact.

The script does not relax Astro fallback behavior and does not change the bridge resolver contract.

Recommended dhosting flow:

```bash
scp SCRIPTS/seed-global-layout-footer.php SCRIPTS/shared-footer.page_builder_schema.json user@host:~/global-layout/
ssh user@host 'find ~/global-layout -type d -exec chmod 755 {} \; ; find ~/global-layout -type f -exec chmod 644 {} \;'
ssh user@host 'php ~/global-layout/seed-global-layout-footer.php --wp-root=/home/client-user/domains/client.example/public_html --slug=shared-footer --title="Shared Footer" --status=private'
```

Safer page targeting rules:

- `--page-id=<id>` is safe only when that page already looks like the intended footer page.
- A `--page-id` target is accepted automatically only when one of these is true:
  - the page slug matches an approved footer slug such as `shared-footer`
  - the page already contains a compatible enabled `shared_footer` block
  - the operator passes `--confirm-repurpose-page` explicitly
- If `--page-id` is omitted, the script looks up one unique `page` by slug and aborts if more than one match exists.
- A unique slug match is reused automatically only when that page is already recognized as a footer page by an approved slug such as `shared-footer` or by a compatible enabled `shared_footer` block; otherwise the script aborts until the operator passes `--confirm-repurpose-page` explicitly.
- If the current global-layout option exists but cannot be parsed cleanly, the script now fails closed unless `--force-invalid-option` is passed.
- Resolver verification is now fail-closed. If in-process verification is unavailable, the script aborts and rolls back unless the operator explicitly passes `--skip-verification`.
- On any post-write verification failure, the script restores the previous global-layout option and the full pre-image of the footer page; if the script created a new page during the run, that page is deleted during rollback.
- The payload defaults to `shared-footer.page_builder_schema.json` sitting next to the script, so copy both files together or pass `--payload=/absolute/path/to/shared-footer.page_builder_schema.json`.

Expected script output includes:

- `BACKUP_OPTION:<name>`
- `PAGE_ID:<id>`
- `FOOTER_PAGE_ID:<id>`
- `LAYOUT_OPTION_STATUS:resolved`
- `FOOTER_STATUS:resolved`

Recommended high-safety examples:

```bash
php ~/global-layout/seed-global-layout-footer.php --wp-root=/home/client-user/domains/client.example/public_html --slug=shared-footer --title="Shared Footer" --status=private
php ~/global-layout/seed-global-layout-footer.php --wp-root=/home/client-user/domains/client.example/public_html --page-id=123 --slug=shared-footer
php ~/global-layout/seed-global-layout-footer.php --wp-root=/home/client-user/domains/client.example/public_html --page-id=123 --confirm-repurpose-page --skip-verification
```

Use the third form only when the operator has intentionally chosen to repurpose a non-footer page and has separate endpoint-level verification ready immediately after the write.

Verification flow:

1. Call `GET /wp-json/bulwar/v1/layout/global` and confirm `meta.layout_option_status=resolved` plus `meta.footer_status=resolved`.
2. Spot-check that the returned footer fields match the expected shared footer content.
3. Run the Astro production build without `ASTRO_ALLOW_GLOBAL_LAYOUT_FALLBACK=true`; it should pass only after the live endpoint is healthy.

Example endpoint check:

```bash
curl -s https://client.example/wp-json/bulwar/v1/layout/global
```

Example Astro build check from the repo:

```powershell
Set-Location "c:\Users\macie\Documents\BULWAR APP\astro-site"
Remove-Item Env:ASTRO_ALLOW_GLOBAL_LAYOUT_FALLBACK -ErrorAction SilentlyContinue
npm run build
```
