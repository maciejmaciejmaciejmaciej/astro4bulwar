# Block Registry Specification

## Purpose

The block registry is the canonical code-side definition of all reusable business page blocks used by the Astro + WordPress page-builder system.

Its job is to answer four questions:

1. What blocks exist.
2. What data shape each block accepts.
3. How each block is rendered.
4. Whether a block can resolve data from an external source such as WooCommerce.

The registry is the source of truth for block definitions.
WordPress is only the source of truth for page instances and content values.

## Scope

The registry stores business page blocks such as:

- `about-1`
- `gallery-masonry-style1`
- `cta-2`
- `menu-category-photo-parallax-full-width`
- `reservation`

The registry does not store raw shadcn/ui primitives such as:

- `button`
- `card`
- `dialog`
- `tabs`

Those primitives may be used internally to build a block, but they are not registered as page-builder blocks.

## Core Rule

Every block must be reusable, schema-driven, and business-meaningful.

A block should be something the user can intentionally compose into a page.
It should not be a low-level UI part.

## Registry Responsibilities

The registry must provide:

- a stable `blockKey`
- block metadata for editor and automation workflows
- readiness lifecycle and capability matrix used as the single promotion gate
- data schema validation
- default data generation
- rendering contract
- optional external source resolution contract
- versioning for future migrations

## Readiness Contract

The shared registry is also the single readiness gate for both block refinement and page composition workflows.

Each registered block must expose a readiness descriptor with:

- `lifecycle`: one of `draft`, `refining`, `ready`, `blocked`
- `capabilities.reactRuntime`
- `capabilities.astroRenderer`
- `capabilities.aiDescriptor`
- `capabilities.docs`
- `capabilities.tests`

`ready` is not a manual shortcut. A block may be marked `ready` only when all required capabilities are available.
Any consumer that needs a promotion gate should read the shared registry contract instead of re-checking files ad hoc.

## Workflow 1 Refinement Contract

Workflow 1 is the repo-side refinement flow that promotes a raw shadcn candidate toward a reusable business block.

The minimal repo-side request contract is:

- `blockKey`
- `sourceComponent`
- `designReference`
- `targetStatus`

In the current safe implementation, `targetStatus` is allowed only as `ready`.
The workflow returns one readiness outcome:

- `ready`
- `refining`
- `blocked`

The outcome must be driven by the shared registry readiness gate plus a Workflow 1 artifact summary.

### Workflow 1 Required Artifacts For `ready`

Before a block can be promoted to `ready`, the repo-side refinement summary must confirm:

- `businessBlock`
- `designReference`
- `reactRuntime`
- `astroRenderer`
- `aiDescriptor`
- `docs`
- `tests`

This means `ready` requires more than just an imported component file.
The block must already exist as a reusable business block in the shared registry, have a declared design-validation surface, and satisfy the shared readiness gate used by Astro and page composition.

### Workflow 1 Design References

`designReference` is the primary review surface recorded in the refinement request.
For Bulwar, the required supporting references are:

- `zip/src/pages/TemplatePage.tsx`
- `zip/src/index.css`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

The workflow summary should report missing artifacts explicitly instead of silently promoting the block.

## Required Block Definition Shape

Each block definition must include the following fields.

### Required fields

- `blockKey`: unique, stable key used in page schemas
- `version`: integer block contract version
- `name`: human-readable label
- `description`: short explanation of the block's business purpose
- `schema`: Zod schema describing the block's `data`
- `defaultData`: default payload matching the schema
- `render`: renderer function or component binding

### Optional fields

- `variants`: allowed named variants if the block supports them
- `sourceSchema`: schema for an optional `source` object
- `resolveSource`: function that transforms external source data into render-ready data
- `exampleData`: one or more valid example payloads
- `tags`: discovery tags such as `hero`, `gallery`, `menu`, `cta`
- `deprecated`: boolean flag for retired blocks
- `migration`: helper for upgrading old versions

## Conceptual Type Shape

```ts
type BlockRegistryEntry = {
  blockKey: string;
  version: number;
  name: string;
  description: string;
  readiness: {
    lifecycle: "draft" | "refining" | "ready" | "blocked";
    capabilities: {
      reactRuntime: Capability;
      astroRenderer: Capability;
      aiDescriptor: Capability;
      docs: Capability;
      tests: Capability;
    };
  };
  schema: ZodSchema;
  defaultData: unknown;
  render: BlockRenderer;
  variants?: readonly string[];
  sourceSchema?: ZodSchema;
  resolveSource?: BlockSourceResolver;
  exampleData?: readonly unknown[];
  tags?: readonly string[];
  deprecated?: boolean;
  migration?: BlockMigration;
};
```

This is a planning contract, not yet the final implementation.

## Naming Rules

### `blockKey`

The `blockKey` must:

- be lowercase
- use kebab-case
- be stable over time
- describe the business block, not the file name

Good examples:

- `about-1`
- `gallery-masonry-style1`
- `cta-2`
- `menu-category-photo-parallax-full-width`

Bad examples:

- `AboutSection.tsx`
- `myNewComponent`
- `shadcn-card-grid`

## Versioning Rules

- `version` starts at `1`
- any backward-incompatible schema change increments `version`
- old page payloads should be migrated instead of silently accepted
- a block may expose a migration strategy when versions change

## Data Contract Rules

### `schema`

Each block must own a strict schema for its `data` payload.

Examples:

- `about-1` expects title, description, image, CTA
- `gallery-masonry-style1` expects title and image list
- `menu-category-photo-parallax-full-width` expects section text, background image, menu entries, and optional Woo source binding

### `defaultData`

`defaultData` must:

- always validate against `schema`
- be safe to use when creating a new page from blueprint
- not contain invented business copy unless explicitly intentional placeholder content is acceptable

### `exampleData`

`exampleData` should:

- contain one or more realistic valid payloads
- be used in tests and documentation
- help the agent understand what content belongs to the block

## Source Resolution Rules

Some blocks are content-only.
Some blocks are content plus external source reference.

Examples:

- `about-1`: usually no external source
- `gallery-masonry-style1`: may be manual images only
- `menu-category-photo-parallax-full-width`: may resolve products from WooCommerce category slug

If a block supports external data, it should define:

- `sourceSchema`
- `resolveSource`

Example conceptual source:

```json
{
  "sourceType": "woo_category",
  "sourceValue": "sniadania-klasyczne"
}
```

The resolver must return normalized data for rendering.
The renderer should not directly fetch from WooCommerce.

## Renderer Rules

The renderer must:

- accept already validated block data
- accept already resolved source data if the block uses external sources
- remain independent from WordPress response shapes
- remain independent from raw WooCommerce response shapes

The renderer should receive clean, normalized props only.

## File Structure Recommendation

Recommended structure inside the Astro project:

```text
src/
  blocks/
    registry/
      index.ts
      types.ts
    about-1/
      schema.ts
      defaults.ts
      renderer.astro
      examples.ts
    gallery-masonry-style1/
      schema.ts
      defaults.ts
      renderer.astro
      examples.ts
    menu-category-photo-parallax-full-width/
      schema.ts
      defaults.ts
      resolver.ts
      renderer.astro
      examples.ts
```

This structure is recommended because it keeps each block self-contained and easy to extend.

## Current Block Addition Workflow

- Add the block's own definition, schema, default data, example data, and runtime renderer in the block folder so the contract stays colocated with the implementation.
- Register the definition in the shared registry. The central page-builder renderer no longer needs a manual switch branch for each new block because it dispatches through `runtime.renderSection`.
- When the block should participate in `page_builder_schema_for_ai`, update the shared descriptor registry in `SCRIPTS/generate-page-builder-ai-schema.js`. Keep that generator descriptor-driven instead of extending another branch chain.
- Run Workflow 1 against the candidate block and inspect the artifact summary. A block that is still missing Astro, tests, docs, or design references must stay `refining` or `blocked`, never `ready`.

## Registry API Requirements

At minimum, the registry should support:

- get block by `blockKey`
- list all active blocks
- list all blocks with readiness metadata
- get readiness descriptor by `blockKey`
- assert that a block is globally ready
- validate a block payload
- validate a block source payload
- return default payload for new block instance creation

Conceptual API:

```ts
getBlock(blockKey)
listBlocks()
listBlocksWithReadiness()
getBlockReadiness(blockKey)
assertBlockReady(blockKey)
validateBlockData(blockKey, data)
validateBlockSource(blockKey, source)
createDefaultBlockInstance(blockKey)
```

## Initial MVP Blocks

The first registry version should include:

- `about-1`
- `gallery-masonry-style1`
- `menu-category-photo-parallax-full-width`

### `about-1`

Expected data areas:

- `leftImages` optional
- `leftText.title` optional
- `leftText.paragraphs`
- `leftText.ctaButton` optional
- `rightText.paragraphs`
- `rightImages` optional

### `gallery-masonry-style1`

Expected data areas:

- title optional
- images array
- each image with source and alt

### `menu-category-photo-parallax-full-width`

Expected data areas:

- title
- intro optional
- background image
- parallax headline text
- menu item list or resolved menu payload
- display options
- optional source binding to Woo category

## Adding A New Block Workflow

When adding a new reusable block, the implementation must follow this order:

1. Build the business block from shadcn/ui primitives.
2. Define its `blockKey`.
3. Write its Zod schema.
4. Write valid `defaultData`.
5. Add example payloads.
6. Implement the renderer.
7. Add optional source resolver if needed.
8. Register the block in the central registry.
9. Add validation tests.
10. Add at least one example page usage.

## Agent Compatibility Requirements

The block registry must be readable by automation and agents.

That means:

- block definitions must be explicit and discoverable
- schema fields must be clearly named
- example payloads should be easy to inspect
- registry lookup must not depend on fragile conventions

The goal is that an agent can later receive instructions such as:

- create a page with `about-1`, `gallery-masonry-style1`, and `reservation`
- update `about-1` title and CTA on page `promocja-dzien-matki`
- set `menu-category-photo-parallax-full-width` source to Woo category `menu-dla-mamy`

## Current Source Component Mapping

Current planning names map to the existing codebase like this:

- `gallery-masonry-style1` -> `GallerySection` in `zip/src/components/sections/GallerySection.tsx`
- `menu-category-photo-parallax-full-width` -> `BreakfastSection` in `zip/src/components/sections/BreakfastSection.tsx`
- `about-1` -> `AboutSection` in `zip/src/components/sections/AboutSection.tsx`

## Validation Requirements

Each registered block should have tests for:

- valid default data
- invalid payload rejection
- valid source payload if source is supported
- renderer smoke test

## Non-Goals

The block registry is not:

- a WordPress field builder
- a storage engine
- a runtime data fetcher for frontend components
- a place to store page-specific content

## Decision Summary

- Registry in code is the source of truth for block definitions.
- WordPress stores page instances and content only.
- Blocks must be business-level reusable sections.
- Every block must be schema-driven.
- External source fetching must go through resolver contracts, not component-side fetches.

## Next Dependency

The next document to define should be the exact `page_builder_schema` contract, because the registry and page schema must fit together one-to-one.
