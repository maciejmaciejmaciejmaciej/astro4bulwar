---
description: 'Page-builder workflow for Bulwar WordPress pages stored in post meta. Use when composing a page from approved blocks, generating page_builder_schema or page_builder_schema_for_ai, syncing block ids, or writing structured page payloads to WordPress.'
applyTo: 'zip/src/blocks/**, zip/src/pages/**, wordpress-plugin/bulwar-bridge/**, docs/plan/astro-wordpress-page-builder/**'
---

# Page Builder Workflow

Use this instruction when the task involves page composition, block ordering, page schema generation, WordPress meta payloads, or block-to-page mapping.

## Confirmed Storage Model

- WordPress page instances are stored in post meta.
- The render-oriented meta field is `page_builder_schema`.
- The AI-editing-oriented meta field is `page_builder_schema_for_ai`.

## Canonical Page Model

- A WordPress page is a collection with a top-level `sections` array.
- Each `sections[]` item represents one block instance.
- Block instances must keep stable `id` values.
- Block instances must reference approved `blockKey` values from the registry.

## Dual Meta Field Rule

Every new or updated page-builder page should produce both structures:

1. `page_builder_schema`
   - full render payload
   - ordered sections
   - block versioning and external source bindings

2. `page_builder_schema_for_ai`
   - simplified editing payload
   - stable mapping back to block instance ids
   - only the content structure needed for controlled AI editing

## Mapping Rule

- Every item in `page_builder_schema_for_ai.blocks[]` must map to exactly one block instance in `page_builder_schema.sections[]`.
- The mapping key should be the block instance `id`.
- The AI schema must not silently reorder, duplicate, or lose block identities.

## Page Composition Workflow

When composing a new page:

1. Select only approved business blocks.
2. Create the ordered page structure.
3. Generate `page_builder_schema`.
4. Generate `page_builder_schema_for_ai`.
5. Validate both payloads.
6. Create or update the WordPress page.
7. Keep enough repo-side artifacts so the page can be reproduced later.

## AI Schema Generator Workflow

When working from VS Code and composing a new page, use the repo-side generator to produce the first AI payload draft from the render schema:

- `node SCRIPTS/generate-page-builder-ai-schema.js --input <path-to-page_builder_schema.json> --output <path-to-page_builder_schema_for_ai.json>`
- add `--post-id <id>` when the WordPress page id is already known

Generator requirements:

- every generated block must preserve the same `id` as the render schema block instance
- every generated block must include an instance-level `description`
- that description must explain what the block shows on this page, which keys steer the visible content, and when the agent should edit WooCommerce or WordPress media instead of page schema
- helper control fields such as `contentSource`, `editableFields`, `editRoute`, and `doNotEditDirectly` should be included when available

## Page Manifest Expectation

When practical, keep a repo-side page manifest that records:

- page slug and title
- post id if known
- ordered block list
- block docs or registry references
- scenario linkage for Make.com

The manifest is not a replacement for WordPress meta. It is the reproducibility layer.

## Block Constraints

- Only approved business blocks may be used in composed pages.
- Do not reference component filenames inside WordPress payloads.
- Do not treat one-off layout fragments as page-builder blocks.
- If a block depends on WooCommerce or another source, keep that binding explicit in `source`.

## Validation Rules

Before writing a page structure to WordPress, verify:

- schema version exists
- every section id is unique
- every block key exists in the registry
- block payloads match the block contracts
- AI schema preserves ids and content ownership
- no required fields are missing

## What To Avoid

- Do not update only one of the two meta fields when both are required by the workflow.
- Do not let WordPress become the only place where page composition logic exists.
- Do not bypass the registry just because the visual block already exists in code.
