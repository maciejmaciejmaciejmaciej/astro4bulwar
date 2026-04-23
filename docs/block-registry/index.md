# Block Registry

## Purpose

This folder is the repo-side registry and documentation repository for approved page-builder blocks.

It exists to give every later workflow one stable source for:

- approved `blockKey` values
- block identity and version
- human-readable block intent
- machine-readable block contracts
- AI-editing boundaries

## Rules

- Only reusable business blocks belong here.
- Raw shadcn imports do not belong here.
- A new component or block may enter the registry only after it has been adapted to the application's main theme CSS and existing class vocabulary.
- Every block listed here must have a machine-readable registry entry and a human-readable markdown document.
- Registry entries must use business block keys, never component filenames.
- If a block is still only a seed entry derived from existing code, that status must be explicit.

## Block Addition Workflow

- Step 1 is always adaptation: align the source component with the main theme CSS, approved tokens, and existing layout/class patterns.
- Step 2 is refinement: make it a reusable business block with a stable API and data contract.
- Step 3 is registration: document and register only the already-adapted business block.
- A new block now owns its definition, schema, defaults, examples, and runtime renderer alongside the block itself.
- Register the block in the shared registry, but do not add a manual switch entry to the central renderer. Rendering now flows through the block's own `runtime.renderSection` contract.
- AI schema generation stays descriptor-driven. Update the shared generator registry in `SCRIPTS/generate-page-builder-ai-schema.js` instead of adding another branch chain.
- Workflow 1 refinement now uses a repo-side request contract: `blockKey`, `sourceComponent`, `designReference`, `targetStatus`.
- Workflow 1 may return only `ready`, `refining`, or `blocked`, and `ready` requires the full artifact summary: business block, design reference, React runtime, Astro renderer, AI descriptor, docs, and tests.

## Files

- `registry.machine.json`: machine-readable registry index
- one markdown file per approved or seeded business block

## Current Entries

- `about-1`
- `about_2_simple`
- `simple_heading_and_paragraph`
- `our-services`
- `promo2`
- `promo3`
- `story-team-showcase`
- `hero_simple_no_text_py32`
- `hero_simple_no_text_normal_wide`
- `just_pralax_img_horizontal`
- `menu-category-photo-parallax-full-width`
- `gallery-masonry-style1`
- `oferta_posts_section`
- `universal_header_block_2`

## Current Phase

The registry now contains a mix of `ready` and `refining` entries.

Readiness must be checked per block in the block docs or in `registry.machine.json` before the block is treated as ready for page composition.
