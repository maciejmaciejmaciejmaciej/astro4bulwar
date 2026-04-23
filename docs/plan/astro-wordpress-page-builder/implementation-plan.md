# Astro + WordPress Page Builder Implementation Plan

> For the shortest entry into this folder, start with [README.md](README.md).

## Status

- This document is the planning source of truth for the Astro page-builder system as of 2026-04-15.
- The current canonical operator workflow is repo-first: page composition happens in VS Code, WordPress stores page payloads, and Astro renders static output.
- The current repeatable operator flow is documented in `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`.
- The current React milestone is documented in `docs/plan/astro-wordpress-page-builder/react-wordpress-poc-status.md`, but that file is a POC execution log, not the main workflow document.
- A separate Astro build-time proof already exists in `astro-site/` and now discovers buildable slugs from the WordPress listing endpoint during static generation.
- The dual-meta-field model and target Make.com editing architecture are described in `docs/plan/astro-wordpress-page-builder/agentic-page-builder-blueprint.md`.
- A node-only runtime now exists under `SCRIPTS/page-builder-runtime/` for draft loading, compile, page ensure/create-or-update, publish, and optional readback verification.
- The Firebase draft model described in `docs/plan/astro-wordpress-page-builder/firebase-page-draft-mvp.md` remains an optional runtime variant, not the canonical workflow document.
- The repo-side block docs live in `docs/block-registry/` and now include current block docs with ready entries such as `universal_header_block_2`.

## Goal

Build a system where reusable page blocks can be added in code, registered once with their data schema, composed into new pages from VS Code, stored in WordPress, rendered by Astro, and deployed as static updates.

## Core Decisions

- Do not use ACF Pro as a core dependency.
- Do not generate separate ACF fields for every page and every block instance.
- Treat the repo-first workflow as the canonical operating model even though a runtime-assisted publish path now exists; the repo-first doc remains the operator source of truth.
- Store page output in WordPress as two JSON meta fields:
  - `page_builder_schema` for render-oriented output
  - `page_builder_schema_for_ai` for AI-editing-oriented output
- Keep the block registry in code as the source of truth for block definitions.
- Treat WordPress as storage for page instances and content.
- Treat WooCommerce as storage for products, categories, prices, and product-linked source data.
- Register business page blocks, not raw shadcn/ui primitives.

## Architecture

### 1. Block Registry In Code

Every reusable page block must have:

- `blockKey`
- `version`
- `name`
- `schema`
- `defaultData`
- `renderer`
- optional `sourceResolver`

Example business blocks:

- `about-1`
- `gallery-masonry-style1`
- `cta-2`
- `menu-category-photo-parallax-full-width`
- `reservation`

### 2. Page Schema In WordPress

Each WordPress page stores two related JSON documents in post meta:

- `page_builder_schema` as the render-oriented payload used by Astro
- `page_builder_schema_for_ai` as the editing-oriented payload used by controlled AI workflows

The render schema is the canonical build input for Astro.

The AI schema is a companion editing contract that must preserve instance identity and map back to the same block instances.

Together these payloads store:

- page metadata needed by Astro
- ordered block instances
- per-block content data
- optional references to WooCommerce sources
- instance-level editing guidance for the AI layer

Conceptual shape:

```json
{
  "version": 1,
  "sections": [
    {
      "id": "hero-01",
      "blockKey": "about-1",
      "variant": null,
      "data": {},
      "source": null
    }
  ]
}
```

### 3. WordPress Bridge

A small plugin or mu-plugin should:

- register both meta keys
- validate payloads before saving
- expose read endpoints for Astro build and operational verification
- expose write/update endpoints that normally write both payloads together

### 4. WooCommerce Data Resolvers

Some blocks use only static content.
Some blocks resolve data from WooCommerce, for example by category slug.

Example:

- `sourceType = "woo_category"`
- `sourceValue = "sniadania-klasyczne"`

Astro resolves the products during build and injects them into the block renderer.

### 5. Astro Renderer

Astro should:

- fetch the page schema from WordPress
- validate the schema
- resolve each block from the registry
- resolve WooCommerce-backed sources when needed
- render the final static page
- fail the build with a clear error if a block is missing or invalid

## Block Design Rule

Do not register file names or implementation details in WordPress.

Use business block keys such as:

- `about-1`
- `gallery-masonry-style1`
- `menu-category-photo-parallax-full-width`

Do not store technical references such as:

- `About1.tsx`
- `GallerySection.tsx`

WordPress should know what kind of section exists.
Code should know how that section is rendered.

## Delivery Stages From Current State

### Stage 1: Stabilize The Current Repo-First Publish Flow

Goal:

- treat the current repo JSON -> WordPress -> Astro path as the only canonical operational flow

Main deliverables:

- keep `page-builder-authoring-workflow.md` aligned with the real operator steps
- keep dual-meta writes as the normal publish behavior
- remove stale wording that still describes the system as single-meta or purely planned

### Stage 2: Close The MVP Block Contracts

Goal:

- finish the minimal reusable block set on a stable contract surface

Main deliverables:

- implement the code-side schema and runtime registration for the already documented `about-1` contract
- keep `gallery-masonry-style1` and `menu-category-photo-parallax-full-width` aligned across docs, examples, and code
- make the block docs and machine-readable registry entries consistent

### Stage 3: Generalize WordPress Page Publication

Goal:

- move from one test page to a reusable multi-page publish workflow

Main deliverables:

- keep the generic create-or-update page flow by slug available through the node-only runtime
- stop relying on the `testowa-blueprint` seed path as the model for all future pages
- keep both meta payloads updated together and document clearly that the bridge endpoint itself remains update-only

### Stage 4: Generalize Astro Beyond The Test Slug

Goal:

- turn Astro from a one-page proof into a multi-page static renderer

Main deliverables:

- automatic slug discovery from the WordPress buildable-pages listing endpoint
- multi-page build verification
- stable deploy and rollback behavior for repeated content updates

### Stage 5: Add The Controlled AI Editing Layer

Goal:

- let AI update page content through the existing dual-meta model without creating a second source of truth

Main deliverables:

- a documented Make scenario that updates both payloads
- explicit publish and redeploy approval rules
- clear rules for page-schema edits versus WooCommerce or WordPress media edits

### Stage 6: Decide Whether Firebase Becomes A Real Runtime Layer

Goal:

- decide whether Firebase is implemented as a true working-state store or left out of Production v1

Main deliverables:

- either a full runtime, compile, and publish design tied to the current system
- or a formal decision that repo-first remains the only supported workflow for Production v1

## MVP Scope

The current implemented baseline is intentionally small:

- seed block docs and registry structure
- implemented proof blocks now include the live blocks required by the current Astro route, including `gallery-masonry-style1`, `menu-category-photo-parallax-full-width`, `about-1`, `universal_header_block_2`, and additional live-supported sections such as `our-services`
- dual WordPress meta fields: `page_builder_schema`, `page_builder_schema_for_ai`
- one repo-side AI schema generator
- one node-only runtime for create-or-update, publish, and optional readback verification
- one WordPress read/write transport layer plus a buildable-pages listing route for Astro discovery
- Astro build and deployment for buildable page slugs returned by WordPress

Production v1 should add only what is necessary to make that baseline reusable across multiple pages.

## Current Component Mapping

The current planning aliases should map to existing frontend components as follows:

- `gallery-masonry-style1` -> current `GallerySection` in `zip/src/components/sections/GallerySection.tsx`
- `menu-category-photo-parallax-full-width` -> current `BreakfastSection` in `zip/src/components/sections/BreakfastSection.tsx`
- `about-1` -> current `AboutSection` in `zip/src/components/sections/AboutSection.tsx`
- `universal_header_block_2` -> current `Project10` in `zip/src/components/sections/Project10.tsx`

## Versioning Rules

- Every block has a `version`.
- Schema changes must be explicit.
- Future migrations should upgrade old block payloads instead of relying on manual fixes.

## Testing Rules

Minimum test coverage should include:

- block schema validation tests
- example payload tests for each registered block
- page schema render test
- Woo resolver tests
- failure tests for invalid page schemas

## Target Workflow

1. Open VS Code.
2. Add or update a reusable business block built from shadcn/ui primitives.
3. Register the block with its schema and default data.
4. Create or update the repo-side render schema for a page.
5. Generate or refine the matching `page_builder_schema_for_ai` payload.
6. Write both payloads to WordPress.
7. Run Astro build.
8. Deploy the generated static update.

## What Not To Do

- Do not create page-specific ACF field groups for every block instance.
- Do not store component file names in WordPress.
- Do not let frontend components talk directly to WordPress or WooCommerce without a mapping layer.
- Do not register raw shadcn/ui primitives as business page blocks.

## Canonical Documents

Use these as the primary references for this system:

1. `docs/plan/astro-wordpress-page-builder/implementation-plan.md`
  - planning source of truth and delivery order
2. `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`
  - current canonical operator workflow
3. `docs/plan/astro-wordpress-page-builder/block-registry-spec.md`
  - canonical block-registry contract
4. `docs/plan/astro-wordpress-page-builder/page-builder-schema-spec.md`
  - canonical render-schema contract
5. `docs/plan/astro-wordpress-page-builder/agentic-page-builder-blueprint.md`
  - target-state AI editing architecture

Treat these as secondary or status-only references:

- `docs/plan/astro-wordpress-page-builder/react-wordpress-poc-status.md`
- `docs/plan/astro-wordpress-page-builder/firebase-page-draft-mvp.md`
