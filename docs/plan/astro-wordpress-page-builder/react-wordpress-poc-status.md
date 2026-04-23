# React + WordPress Proof Of Concept Status

## Purpose

This document records what has already been implemented in the current proof of concept, what had to be deployed to make it work live, and what still remains before the final Astro build-time workflow is complete.

This file is a milestone log, not the canonical workflow document.

For the repeatable operator workflow to use on other pages, see:

- `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`

This is not the final target architecture document.

It is an execution log for the current milestone.

## Current Milestone

As of 2026-04-12, the live proof route at `/react/<page-slug>` demonstrates all of the following:

- `page_builder_schema` is stored in real WordPress page meta.
- `page_builder_schema_for_ai` can also be stored in real WordPress page meta for the same page.
- WordPress exposes that schema through a custom REST endpoint.
- React fetches the schema from WordPress instead of using a local hardcoded page blueprint.
- the `menu-category-photo-parallax-full-width` block resolves `sourceType = woo_category` from a real WooCommerce category slug.
- the block renders real WooCommerce product names and prices on the live route.

This means the source-of-truth chain now works in this order:

1. WordPress page meta stores `page_builder_schema`
2. WordPress page meta can also store `page_builder_schema_for_ai`
3. WordPress REST endpoint returns `page_builder_schema` and, when present, `page_builder_schema_for_ai`
4. frontend fetches the render schema
5. source resolver fetches WooCommerce products
6. block renderer displays the resolved data

## What Was Implemented

### 1. Block Registry Foundation In React

Implemented under `zip/src/blocks/registry/`:

- shared block types
- shared Zod schemas
- block registry index
- page schema parser
- blueprint-to-schema conversion
- section renderer

Key existing MVP blocks:

- `gallery-masonry-style1`
- `menu-category-photo-parallax-full-width`

### 2. Prop-Driven Block Source Component

`zip/src/components/sections/BreakfastSection.tsx` was refactored so it can accept external data instead of only hardcoded menu items.

This was necessary to make the page-builder work at all.

### 3. WooCommerce Source Resolver

Implemented under `zip/src/blocks/registry/wooStoreApi.ts` and `zip/src/blocks/registry/resolvePageBuilderSources.ts`.

Current supported proof-of-concept sources:

- `woo_category`
- `woo_products`

The current live proof uses `woo_category` with the category slug `zestawy-specjalne`.

### 4. WordPress Page Builder Endpoint

The existing `bulwar-bridge` plugin was extended with:

- page meta registration for `page_builder_schema`
- page meta registration for `page_builder_schema_for_ai`
- a new endpoint:

`/wp-json/bulwar/v1/page-builder/pages/{slug}`

- the same route now also accepts authenticated `POST` requests for controlled updates of both `page_builder_schema` and `page_builder_schema_for_ai` in one request

Relevant plugin files:

- `wordpress-plugin/bulwar-bridge/src/Http/Controllers/PageBuilderController.php`
- `wordpress-plugin/bulwar-bridge/src/Http/Routes.php`
- `wordpress-plugin/bulwar-bridge/src/Plugin.php`

### 5. WordPress-Seeding Script

To avoid fragile CLI quoting for large JSON payloads, a direct PHP seeding script was added:

- `SCRIPTS/seed-testowa-blueprint-schema.php`

This script:

- boots WordPress directly through `wp-load.php`
- creates or updates the page `testowa-blueprint`
- writes the `page_builder_schema` meta from a JSON file
- writes the `page_builder_schema_for_ai` meta when the AI JSON file is present

Schema source file used for seeding:

- `docs/plan/astro-wordpress-page-builder/testowa-blueprint.page_builder_schema.json`
- `docs/plan/astro-wordpress-page-builder/testowa-blueprint.page_builder_schema_for_ai.json`

### 6. Repo-Side AI Schema Generator

A repo-side generator now exists for VS Code composition flow:

- `SCRIPTS/generate-page-builder-ai-schema.js`

This script:

- reads a render-oriented `page_builder_schema` JSON file
- generates `page_builder_schema_for_ai`
- preserves block ids
- adds instance-level `description` and edit-routing guidance per block

## What Had To Be Done To Deploy It

### Frontend Deployment

The React build had to be:

1. built with `npm run build`
2. packaged with root `.htaccess`
3. uploaded to the live server
4. extracted into the `/react` directory
5. fixed to required dhosting permissions:
   - directories `755`
   - files `644`

Important deployment fact:

- the root `.htaccess` is mandatory for React routing on dhosting

### Plugin Deployment

The modified `bulwar-bridge` plugin files had to be copied into the live WordPress plugin directory:

- `wp-content/plugins/bulwar-bridge/`

### WordPress Content Deployment

The page schema had to be written into real WordPress post meta.

This was not done through the wp-admin UI.

It was seeded programmatically to move faster.

## Problems Encountered During Deployment

### 1. Invalid Default Block Data

Early runtime failed because the block default image payload did not satisfy its own Zod schema.

Fix applied:

- valid placeholder `backgroundImage.src`
- valid placeholder `backgroundImage.alt`

### 2. Old CLI PHP On Server

The server had multiple PHP versions available.

`wp-cli` through the default wrapper was hitting an older CLI PHP and produced fatal errors.

Workaround used:

- run direct PHP scripts through `/usr/bin/php82`
- avoid relying on the broken `wp-cli` wrapper for schema seeding

### 3. JSON Quoting Over SSH

Large JSON payloads broke shell quoting when passed inline to remote commands.

Workaround used:

- upload JSON as a file
- upload a small server-side PHP script
- let that script write post meta from the file

### 4. WordPress Empty Meta Shape

WordPress endpoint responses returned empty `meta` values as `[]` instead of `{}` in some cases.

The frontend page schema parser expected a record object.

Fix applied:

- normalize `meta`, `seo`, and `build` into objects before schema parsing

## What Is Verified Live

The live route:

- `/react/<page-slug>`

currently proves that:

- schema is fetched from WordPress
- block source is read from WordPress schema
- `woo_category` is resolved to a real WooCommerce category and its products
- rendered output shows real product titles and prices

Current seeded `woo_category` source:

- `zestawy-specjalne`

## What This Still Does Not Mean

This is still not the final Astro implementation.

It is only a successful integration proof for:

- WordPress storage
- schema transport
- Woo source resolution
- block rendering

Current rendering still happens at React runtime after the page loads.

## Remaining Work Before Final Astro Workflow

Update on 2026-04-11:

- a separate Astro proof of concept now exists in `astro-site/`
- it fetches `page_builder_schema` from WordPress during build
- it resolves WooCommerce product sources during build
- it generates a static page at `astro-site/dist/testowa-blueprint/index.html`
- the generated HTML already contains the real Woo product names and prices

### 1. Move Rendering To Astro Build-Time

Astro must:

- fetch `page_builder_schema` during build
- resolve Woo sources during build
- render final static HTML during build

### 2. Add Reliable Rebuild Trigger

After WordPress content changes, Astro needs a rebuild trigger.

Possible options:

- manual deploy command
- WordPress webhook
- Make.com-triggered deploy
- CI pipeline trigger

### 3. Expand Beyond Test Route

After the proof is accepted, the same workflow should be applied to real production page types.

## Hosting Layout Fixed On Server

The physical Astro folder layout has now been fixed on the current dhosting server.

Created directories:

- source placeholder: `/home/klient.dhosting.pl/bulwar/astro-site/`
- public Astro output: `/home/client-user/domains/client.example/public_html/astro/`
- Astro deployment backups: `/home/klient.dhosting.pl/bulwar/deploy_backups/astro/`

Current hosting constraint remains:

- no `node`
- no `npm`

Therefore Astro build currently must happen locally or in CI, and only the built output should be uploaded.

## Recommended Next Step

The next practical step is:

- implement the same fetch + source resolution flow in Astro build-time
- generate static output from WordPress data
- stop relying on client-side content fetch for final page rendering
