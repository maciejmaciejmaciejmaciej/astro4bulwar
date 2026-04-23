# Page Builder Authoring Workflow

> Start reading here only if you already know this folder.
> If not, begin with [README.md](README.md) for the shortest document path.

## Purpose

This document is the practical operator workflow for building and publishing new page-builder pages after the work completed on 2026-04-12.

This is the current canonical operating workflow for the system.

For future target-state Firebase draft bootstrap work from scrape input, see `docs/plan/astro-wordpress-page-builder/scrape-bootstrap-firebase-draft-mapping.md`.

That note does not replace this repo-first canonical flow.

Treat this document as the canonical day-to-day operator workflow even though a node-only runtime now exists under `SCRIPTS/page-builder-runtime/`.

The runtime is part of the supported implementation, but this document remains the main operator reference for how the pieces fit together.

Use it when you want to repeat the same flow for another page, not only for `testowa-blueprint`.

This is the shortest path from page composition in VS Code to live WordPress meta and Astro static output.

## What Exists Now

The current system now has all of the following parts:

- `page_builder_schema` as the render-oriented WordPress meta field
- `page_builder_schema_for_ai` as the AI-editing-oriented WordPress meta field
- a repo-side AI schema generator:
  - `SCRIPTS/generate-page-builder-ai-schema.js`
- a public read endpoint:
  - `GET /wp-json/bulwar/v1/page-builder/pages/{slug}`
- a public buildable-pages listing endpoint for Astro slug discovery:
  - `GET /wp-json/bulwar/v1/page-builder/pages`
- an authenticated write endpoint for both meta fields in one request:
  - `POST /wp-json/bulwar/v1/page-builder/pages/{slug}`
- a node-only runtime CLI that can ensure the page exists, compile payloads, publish both payloads, and optionally verify readback:
  - `SCRIPTS/page-builder-runtime/cli.ts`
- a local Astro build and deploy workflow for `/astro/`

## Node-Only Runtime Boundary

The live runtime for Firebase draft persistence, authenticated WordPress publish, and the canonical CLI now lives under `SCRIPTS/page-builder-runtime/`.

For local operator convenience, the runtime CLI can auto-load a repo-root file named `.env.page-builder.local`.

Use `.env.page-builder.local.example` as the tracked template and keep real secrets only in the local gitignored file.

The `zip/src/blocks/registry/` tree remains shared-only and safe for the browser bundle: contracts, parsers, and generic helper layers without live SDK initialization or secrets.

The compile gate stays single-source in `SCRIPTS/make-page-draft-compile-gate.js` and is still the only compiler for `page_builder_schema` plus `page_builder_schema_for_ai`.

## Current Truths And Limits

These are important when using this workflow for other pages:

- the WordPress bridge `POST` endpoint updates an existing page; it does not create a missing page by itself
- the node-only runtime can create or update the underlying WordPress page by slug through the core WordPress pages API and then publish both page-builder payloads through the bridge endpoint
- the dedicated seed script in repo is still specific to `testowa-blueprint`
- the React proof route is still hardcoded to `testowa-blueprint`
- Astro slug discovery now comes from `GET /wp-json/bulwar/v1/page-builder/pages`, so any buildable published page returned by that endpoint is picked up automatically during the static build
- the generic reproducible path for future pages should prefer:
  - draft or render payload artifacts in repo
  - generated AI JSON in repo
  - runtime-assisted or authenticated publish to WordPress
  - Astro build and deploy when the static route is ready

## Canonical Files Per Page

For each page-builder page keep at least these repo-side artifacts:

1. Render schema:
   - `.../<slug>.page_builder_schema.json`
2. AI schema:
   - `.../<slug>.page_builder_schema_for_ai.json`
3. Block docs used by the page:
   - `docs/block-registry/*.md`
4. Optional page manifest or planning note if the page is business-critical

Example from the current proof:

- `docs/plan/astro-wordpress-page-builder/testowa-blueprint.page_builder_schema.json`
- `docs/plan/astro-wordpress-page-builder/testowa-blueprint.page_builder_schema_for_ai.json`

## Workflow For A New Page

### 0. Default-First Bootstrap When Final Content Is Not Ready Yet

If the final content for the new page is still unknown, start from a safe preset draft instead of inventing copy early.

Use the generator:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/create-default-page-draft-from-template.ts --slug 'nowa-strona'
```

Optional overrides:

```powershell
npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/create-default-page-draft-from-template.ts --slug 'nowa-strona' --title 'Nowa Strona' --status draft
```

This creates two repo-side artifacts:

1. `docs/plan/astro-wordpress-page-builder/<slug>.firebase-draft.json`
2. `docs/plan/astro-wordpress-page-builder/<slug>-source-mappings.json`

The generator clones a safe template draft, resets runtime state, preserves the default block structure, and exports the current `source` values for Woo-backed blocks into a separate mappings file.

Use this mode when:

- the new page slug is known
- the block structure should be created now
- the real copy, media, and business content will be decided later

At this stage:

- keep the blocks on their default-safe content path
- do not derive real editorial content from the old public page
- for menu blocks, keep WooCommerce as the source of truth for products and prices

### 1. Compose The Render Schema In Repo

Create the ordered `page_builder_schema` first.

Requirements:

- use only approved blocks from the registry
- keep stable block instance ids
- keep Woo bindings explicit in `source`
- for restaurant menu pages, treat WooCommerce as the source of truth for products and prices; do not populate canonical menu rows from scrape output or direct-edit payloads
- do not store component file names in the payload

At this stage the render schema is the source of truth for layout and external data bindings.

### 2. Generate The AI Schema From The Render Schema

Use the generator:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
node 'SCRIPTS/generate-page-builder-ai-schema.js' --input 'docs/plan/astro-wordpress-page-builder/<slug>.page_builder_schema.json' --output 'docs/plan/astro-wordpress-page-builder/<slug>.page_builder_schema_for_ai.json'
```

If the WordPress post id is already known, pass it too:

```powershell
node 'SCRIPTS/generate-page-builder-ai-schema.js' --input 'docs/plan/astro-wordpress-page-builder/<slug>.page_builder_schema.json' --output 'docs/plan/astro-wordpress-page-builder/<slug>.page_builder_schema_for_ai.json' --post-id 123
```

The generated AI schema must:

- preserve the same block ids as `sections[]`
- include instance-level `description`
- explain where the agent should edit content
- tell the agent when to use WooCommerce or WordPress media tools instead of editing page schema directly

### 3. Review And Fix The AI Descriptions

Do not treat the generated `description` fields as untouchable.

Review them and make sure they are specific to the actual page instance.

If you want to define what one concrete block instance is for on one concrete page, put that text on the section instance in `meta.ai.description` inside `page_builder_schema`.

Minimal example:

```json
{
  "id": "gallery-masonry-style1-01",
  "blockKey": "gallery-masonry-style1",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "title": "Galeria sali",
    "images": [
      {
        "src": "/react/images/gallery/12-1024x680-1-640x640.webp",
        "alt": "Sala restauracji"
      }
    ]
  },
  "source": null,
  "meta": {
    "ai": {
      "description": "Ta sekcja pokazuje galerie sali restauracyjnej. Edytuj tylko tytul i liste zdjec tej sekcji; do wyboru obrazow uzyj mediow WordPress."
    }
  }
}
```

The generator copies `section.meta.ai.description` into `blocks[].description` in `page_builder_schema_for_ai`, so the business meaning of the block lives on the page instance, not in the shared registry.

Every block description should tell the Make agent:

- what the block currently shows
- which keys steer that visible output
- which edits belong in page schema
- which edits belong in WooCommerce
- which edits belong in WordPress media
- which keys must not be edited directly

For menu blocks backed by `woo_category` or `woo_products`, the description must explicitly say that products, prices, and menu rows are resolved from WooCommerce and are not direct-edit content.

### 4. Make Sure The WordPress Page Exists

The WordPress bridge `POST` endpoint still updates an existing page by slug.

For a new page, use one of these two supported paths:

1. Preferred generic path: run the node-only runtime CLI, which ensures the WordPress page exists, compiles payloads, publishes both payloads, and can verify readback.
2. Manual path: create the page first and then use the bridge `POST` endpoint to update both meta payloads.

Runtime CLI examples:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/page-builder-runtime/cli.ts --draft-file 'docs/plan/astro-wordpress-page-builder/<slug>.firebase-draft.json' --source-mappings 'docs/plan/astro-wordpress-page-builder/<slug>-source-mappings.json' --verify-readback
```

By default, the CLI first tries to load local runtime secrets from:

- `.env.page-builder.local`

You can also point it to a custom file explicitly:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/page-builder-runtime/cli.ts --draft-file 'docs/plan/astro-wordpress-page-builder/<slug>.firebase-draft.json' --source-mappings 'docs/plan/astro-wordpress-page-builder/<slug>-source-mappings.json' --env-file '.env.page-builder.local' --verify-readback
```

Or, when the draft already lives in Firestore:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/page-builder-runtime/cli.ts --draft-doc-id '<docId>' --source-mappings 'docs/plan/astro-wordpress-page-builder/<slug>-source-mappings.json' --verify-readback
```

The runtime path is the generic create-or-update workflow for new pages.

Use the manual path only when you deliberately want to bypass the runtime and operate directly on the WordPress page plus bridge endpoint.

### 5. Write Both Meta Fields To WordPress

There are two supported publish paths.

Preferred generic path:

- use `SCRIPTS/page-builder-runtime/cli.ts`

Manual path:

- use the authenticated endpoint:
  - `POST /wp-json/bulwar/v1/page-builder/pages/{slug}`

The runtime path is the only supported path that both ensures page existence and publishes the two payloads in one operator flow.

Required request body shape:

```json
{
  "schema": { "version": 1, "page": {}, "sections": [] },
  "aiSchema": { "version": 1, "postId": 123, "slug": "example", "title": "Example", "blocks": [] }
}
```

Important rules:

- send both `schema` and `aiSchema` together
- use an authenticated WordPress user with `edit_pages`
- do not update only one of the two meta fields during normal workflow

Successful response should include:

- `data.schema`
- `data.aiSchema`
- `meta.updated_meta_keys`

Example success signal:

- `updated_meta_keys = ["page_builder_schema", "page_builder_schema_for_ai"]`

### 6. Verify The WordPress Read Endpoint

After the write, verify the public read endpoint:

- `GET /wp-json/bulwar/v1/page-builder/pages/{slug}`

Check that:

- `data.schema.page.slug` matches the target page
- `data.aiSchema.blocks[]` exists when AI meta is expected
- `description`, `editableFields`, and `editRoute` are present where expected

### 7. React Proof Verification

Current limitation:

- the React proof route is still tied to `testowa-blueprint` in `zip/src/pages/TestowaBlueprintPage.tsx`

So for future pages the React route is not yet the generic verification path unless that page is wired into React separately.

Treat React proof as optional and page-specific for now.

### 8. Astro Static Route Preparation

If the page should be visible under `/astro/`, no manual slug registration is required anymore.

Astro now discovers buildable pages automatically from:

- `GET /wp-json/bulwar/v1/page-builder/pages`

That means a page will be picked up by the static build when it is returned by the listing endpoint as buildable.

In practice verify that:

- the WordPress page is published
- `page_builder_schema` is valid and non-empty
- the normalized schema page status resolves to `published`
- `seo.noindex` is not `true`

### 9. Astro Build And Deploy

Canonical commands:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP/astro-site'
npm run build
```

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
powershell -ExecutionPolicy Bypass -File 'c:/Users/macie/Documents/BULWAR APP/SCRIPTS/deploy-astro-static.ps1'
```

After deploy, verify the live page:

```powershell
$response = Invoke-WebRequest -Uri 'https://client.example/astro/<slug>/' -UseBasicParsing
if ($response.Content -match '/astro/_astro/') { 'LIVE_HTML_OK' } else { 'LIVE_HTML_BAD' }
```

## Current Canonical Tools

Use these tools and files as the current standard:

- render schema authoring in repo
- `SCRIPTS/generate-page-builder-ai-schema.js`
- `SCRIPTS/page-builder-runtime/cli.ts`
- `GET /wp-json/bulwar/v1/page-builder/pages/{slug}`
- `GET /wp-json/bulwar/v1/page-builder/pages`
- `POST /wp-json/bulwar/v1/page-builder/pages/{slug}`
- `SCRIPTS/deploy-astro-static.ps1`

Use these only as test-page-specific helpers, not as the final generic page workflow:

- `SCRIPTS/seed-testowa-blueprint-schema.php`
- `SCRIPTS/seed-testowa-blueprint-schema.sh`

## Recommended Operator Sequence

For the next real page, follow this order exactly:

1. Create `page_builder_schema` in repo.
2. Generate `page_builder_schema_for_ai` with the script.
3. Review and refine block descriptions.
4. Use the runtime CLI to ensure the WordPress page exists and publish both payloads, or manually create the page and then `POST` both payloads.
5. Verify the `GET` endpoint.
6. Confirm the page appears in the buildable-pages listing endpoint.
8. Build Astro.
9. Deploy Astro.
10. Verify live `/astro/<slug>/` output.

## What To Avoid

- do not create only `page_builder_schema` and skip `page_builder_schema_for_ai`
- do not rely on the test-only seed script as the long-term workflow for every page
- do not let Make edit Woo-backed block content by writing fake product text into page schema
- do not skip the repo-side artifacts; WordPress must not become the only source of truth
- do not deploy Astro manually outside `SCRIPTS/deploy-astro-static.ps1`

## References

- `docs/plan/astro-wordpress-page-builder/page-builder-schema-spec.md`
- `docs/plan/astro-wordpress-page-builder/agentic-page-builder-blueprint.md`
- `docs/plan/astro-wordpress-page-builder/firebase-page-draft-mvp.md`
- `docs/plan/astro-wordpress-page-builder/local-astro-deploy-from-windows.md`
- `.github/instructions/page-builder.instructions.md`
- `docs/block-registry/`
