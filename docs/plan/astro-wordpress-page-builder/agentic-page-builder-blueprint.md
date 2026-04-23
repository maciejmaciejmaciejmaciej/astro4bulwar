# Agentic Page Builder Blueprint

> For the shortest reading path across this folder, start with [README.md](README.md).

## Purpose

This document defines the target operating model for building and maintaining reusable content pages with:

- VS Code agents as the authoring and orchestration layer
- WordPress post meta as runtime page storage
- Astro or React frontend renderers consuming page schemas
- Make.com as the production AI content-editing layer

This document does not replace the low-level specs already defined in this folder.
It connects them into one agent workflow and clarifies what should live in code, what should live in WordPress, and what should be generated for Make.com.

## Status

- Date: 2026-04-12
- This is the current target architecture blueprint for the agent-driven page builder.
- The current canonical day-to-day workflow is still the repo-first operator process documented in `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`.
- Current confirmed WordPress storage model: post meta
- Current confirmed page structure model: page object plus `sections[]`
- Current target editing model: a Make.com scenario edits content structures and then triggers or requests redeploy

## Current Workflow Boundary

Use this boundary to avoid treating target-state ideas as if they were already operational.

### Current Supported Operating Flow

- compose page payloads in repo from VS Code
- optionally bootstrap a default draft or load a runtime draft from file or Firestore
- generate `page_builder_schema_for_ai` from the render schema
- ensure the WordPress page exists and write both payloads to WordPress through the runtime or the manual repo-first path
- verify readback when using the runtime path
- build and deploy Astro

### Target AI Editing Layer

- Make.com is the planned production AI editing layer
- it should operate on the approved dual-meta contract
- it should not introduce a second competing source of truth for live page output

### Optional Firebase Draft Variant

- Firebase is an optional future working-draft layer
- if introduced, it sits between authoring and WordPress publish
- the existence of the node-only runtime does not make Firebase the canonical workflow document; the canonical operator reference remains `page-builder-authoring-workflow.md`

## Confirmed Decisions

### 1. Storage Model

- WordPress stores page data in post meta.
- The main meta field is `page_builder_schema`.
- A second AI-oriented meta field is `page_builder_schema_for_ai`.

### 2. Canonical Page Structure

The canonical WordPress-side page structure is a collection with a top-level `sections` array.
Each section item represents one block instance and contains the content for that block.

### 3. Block Source Model

- Blocks are prepared in VS Code.
- Raw imported shadcn blocks are never treated as final page-builder blocks.
- Every imported block must be refactored into a reusable business block before it is allowed into the block registry.
- `TemplatePage` is the visual reference and repair surface for block quality.
- `zip/src/index.css` is the source of truth for styling adaptation.
- Styling adaptation must not silently change imported block geometry, width, or outer composition.

### 4. Production Content Editing Model

- In the target state, a script or management workflow creates or updates a Make.com scenario for approved pages.
- That scenario becomes the production content-editing layer for the page.
- The scenario reads approved page structures, lets the AI agent update only selected values, writes back the updated meta fields in WordPress, and can trigger or request redeployment.

## System Model

The full system should be treated as three connected processes.

### Process 1: Block Refinement In VS Code

Goal:

- take a raw downloaded shadcn block
- adapt it to project design rules
- convert it into a reusable business block
- document its data contract
- register it for future page composition

Minimal repo-side request contract:

- `blockKey`
- `sourceComponent`
- `designReference`
- `targetStatus`

Current safe target:

- `targetStatus = ready`

Required Workflow 1 output:

- reusable business block registered in the shared registry
- recorded design reference for TemplatePage/index.css validation
- React runtime renderer
- Astro renderer support
- AI descriptor coverage
- block docs
- tests
- readiness outcome `ready` or an explicit `refining|blocked` artifact summary

This is a design and code process.
It happens before a block can be used on any real page.

### Process 2: New Page Composition In VS Code

Goal:

- select approved business blocks
- stack them into a page structure
- generate `page_builder_schema`
- generate `page_builder_schema_for_ai`
- create or update the WordPress page
- optionally create or update the matching Make.com scenario for future production editing

This is a page-construction process.
It produces the first publishable version of a page.

### Process 3: Production Content Editing In Make.com

Goal:

- let the client request content changes in plain language
- let a Make-hosted AI agent update the relevant keys in the page structures
- write the updated structures back to WordPress
- mark the page as unpublished until redeployment happens
- allow the management app or agent to ask whether the deployment should now be triggered

This is not a design or block-authoring process.
It is only a structured content-editing process.

## Relationship To Firebase Draft Design

The Firebase model described in `docs/plan/astro-wordpress-page-builder/firebase-page-draft-mvp.md` is a subordinate runtime variant, not a replacement for this blueprint.

Use that document only if the project explicitly decides to add a working-draft store between VS Code authoring and WordPress publish.

If Firebase is not implemented, this blueprint still stands:

- repo remains the source of truth for block definitions and contracts
- WordPress remains the runtime storage for publishable page payloads
- Make.com edits the approved dual-meta payloads through a controlled workflow

## Source Of Truth Model

The recommended model for this project is:

- repo is source of truth for block definitions, contracts, workflow rules, and scenario templates
- WordPress is runtime storage for page instances and live page content structures
- Make.com is the execution layer for production AI content changes

In practice this means:

- block definitions live in code
- block schemas live in code
- page composition contracts live in repo docs and scripts
- WordPress stores validated page instance payloads
- Make.com receives a generated contract derived from block docs and page structures

## Runtime Meta Fields

### 1. `page_builder_schema`

This is the render-oriented structure.
It is the full page payload used by the frontend rendering layer.

Responsibilities:

- stores ordered sections
- stores block identity and version
- stores full content payload per section
- stores external bindings such as Woo references
- is used by frontend renderers and deployment pipeline

Conceptual shape:

```json
{
  "version": 1,
  "page": {
    "slug": "promocja-wiosna",
    "title": "Promocja Wiosna",
    "status": "draft"
  },
  "sections": [
    {
      "id": "hero-01",
      "blockKey": "hero-promo-1",
      "blockVersion": 1,
      "enabled": true,
      "data": {},
      "source": null,
      "meta": {}
    }
  ]
}
```

### 2. `page_builder_schema_for_ai`

This is the AI-editing-oriented structure.
It is a simplified payload designed for content editing, not rendering.

Responsibilities:

- provides a smaller, easier-to-edit structure for the Make AI agent
- mirrors the page in a way that preserves block identity
- gives the AI agent a constrained field map for content edits
- can be used as the default output structure in Make.com

Recommended MVP shape:

```json
{
  "version": 1,
  "postId": 123,
  "slug": "promocja-wiosna",
  "title": "Promocja Wiosna",
  "blocks": [
    {
      "id": "about-1-01",
      "blockKey": "about-1",
      "description": "Ten blok wyswietla sekcje wprowadzajaca z obrazami po bokach oraz dwiema grupami tresci. Zmieniaj tu tylko teksty i obrazy nalezace do samej sekcji. Nie edytuj tu danych WooCommerce.",
      "contentSource": "page_schema",
      "editableFields": [
        "content.leftImages",
        "content.leftText.title",
        "content.leftText.paragraphs",
        "content.leftText.ctaButton.text",
        "content.leftText.ctaButton.href",
        "content.rightText.paragraphs",
        "content.rightImages"
      ],
      "editRoute": "Zmiany tresci tej sekcji wprowadzaj w page_builder_schema_for_ai i odpowiadajacym page_builder_schema. Nie uzywaj narzedzi WooCommerce dla tego bloku.",
      "doNotEditDirectly": [
        "layout",
        "meta"
      ],
      "content": {
        "leftImages": [
          {
            "src": "https://example.com/uploads/about-left.jpg",
            "alt": "Sala restauracji"
          }
        ],
        "leftText": {
          "title": "Nasza historia",
          "paragraphs": [
            "Bulwar laczy kuchnie i atmosfere miejsca."
          ],
          "ctaButton": {
            "text": "Skontaktuj sie",
            "href": "/kontakt"
          }
        },
        "rightText": {
          "paragraphs": [
            "Druga kolumna rozwija glowny przekaz sekcji."
          ]
        },
        "rightImages": []
      }
    }
  ]
}
```

Additional required rule for block instances:

- every block in `page_builder_schema_for_ai.blocks[]` should include an instance-level `description`
- this `description` is not a generic block-library description
- it must describe the concrete block as used on the concrete page
- it must explain what the block currently displays, which keys steer that display, and where the agent should make changes when the visible content actually lives outside page schema
- descriptions should be generated during page composition time in VS Code from block docs plus the concrete source/data used by the page instance
- when useful, the AI payload should also include helper control fields such as `contentSource`, `editableFields`, `editRoute`, and `doNotEditDirectly`

### Mapping Rule Between The Two Meta Fields

- `page_builder_schema` is the full structural render payload
- `page_builder_schema_for_ai` is the simplified editing payload
- every item in `page_builder_schema_for_ai.blocks[]` must map to a block instance in `page_builder_schema.sections[]`
- the mapping key should be the block instance `id`
- the AI schema must never lose identity or reorder blocks implicitly

## Make.com Scenario Contract

Each page should have a matching Make.com scenario for production content editing.

### Scenario Goal

Take:

- current `page_builder_schema_for_ai`
- current `page_builder_schema`
- a plain-language user request

Return:

- updated `page_builder_schema_for_ai`
- updated `page_builder_schema`

### Recommended 3-Module Scenario Layout

#### Module 1: AI Content Editor

Inputs:

- current `page_builder_schema_for_ai`
- current `page_builder_schema`
- user request text
- system instruction telling the AI to update only relevant keys

Output:

- a new `page_builder_schema_for_ai`
- a new `page_builder_schema`

Critical rule:

- output shape must be strict and schema-bound
- default values in output should start from the current page values
- descriptions in the output schema should be generated from block docs maintained in repo

#### Module 2: WordPress Meta Update

Inputs:

- `postId`
- full updated `page_builder_schema`
- full updated `page_builder_schema_for_ai`

Actions:

- update both WordPress post meta fields
- set page status or a dedicated flag so the system knows this page requires redeployment

#### Module 3: Redeploy Trigger

Inputs:

- post id or slug
- current publish state
- explicit publish approval signal

Actions:

- call a webhook that triggers GitHub Actions deployment

## Deployment And Publish Rules

### Required Rule

If a page was changed through the production Make flow, the page must be treated as needing redeployment.

Recommended behavior:

- Make updates the meta fields
- page becomes unpublished or marked as pending publish
- the management app or orchestrating agent detects this status
- the system asks whether a deployment should now be executed
- only after confirmation is the redeploy webhook triggered

## Proposed Repository Structure

Recommended target structure:

```text
.github/
  agents/
  instructions/
  skills/
docs/
  setup/
  block-registry/
  page-contracts/
  agent-workflows/
scripts/
  make/
  wordpress/
  deploy/
zip/
  src/
    blocks/
      registry/
      business/
      templates/
    pages/
      TemplatePage.tsx
```
```

Notes:

- existing `SCRIPTS/` can remain, but long-term grouping by responsibility would be healthier
- `TemplatePage` remains the block repair and design validation surface
- block registry and block docs should be discoverable without scanning the whole repo

## Files To Add

The following artifacts should exist to support the full workflow.

### Setup And Platform Files

- `.env.example`
- `docs/setup/repo-ready-checklist.md`
- `docs/setup/credentials-matrix.md`
- `docs/setup/deployment-rules.md`

### Block Registry Files

- `docs/block-registry/index.md`
- `docs/block-registry/registry.machine.json`
- one human-readable md per approved business block

Current status:

- `docs/block-registry/` has been created
- `docs/block-registry/` now contains multiple documented business blocks
- ready entries with Astro renderer support, such as `universal_header_block_2`, are now tracked in the shared registry
- readiness should be read from the shared registry before a block is treated as ready for page composition

Recommended block doc naming:

- `docs/block-registry/hero-promo-1.md`
- `docs/block-registry/gallery-masonry-style1.md`

### Page Contract Files

- `docs/page-contracts/page-builder-schema.render.jsonschema.json`
- `docs/page-contracts/page-builder-schema-for-ai.jsonschema.json`
- `docs/page-contracts/page-manifest-spec.md`

### Workflow Files

- `docs/agent-workflows/block-refinement-workflow.md`
- `docs/agent-workflows/page-composition-workflow.md`
- `docs/agent-workflows/production-content-editing-workflow.md`
- `docs/agent-workflows/make-scenario-generation-workflow.md`

### Scenario Template Files

- `scripts/make/generate-page-agent-blueprint.*`
- `scripts/make/update-page-agent-blueprint.*`
- `docs/page-contracts/make-output-contract-spec.md`

## Recommended Instruction Files

These should guide always-on agent behavior in VS Code.

### 1. `project-foundation.instructions.md`

Purpose:

- repo prerequisites
- `.env` rules
- required scripts
- deployment and rollback rules
- forbidden operations

### 2. `design-system.instructions.md`

Purpose:

- TemplatePage as the canonical visual reference
- allowed classes and spacing patterns
- reusable block requirements
- rules for design parity and responsive quality

### 3. `page-builder.instructions.md`

Purpose:

- page meta model
- `sections[]` rules
- generation rules for both meta fields
- mapping rules between render schema and AI schema

### 4. `make-scenario.instructions.md`

Purpose:

- blueprint generation rules
- output schema discipline
- deployment webhook usage rules
- safe update rules for production content edits

## Recommended Skills

## Practical Sequencing Note

From the current project state, the next practical build step should be the block registry and its human-readable block-doc repository.

Reason:

- the refinement skill needs a target registry shape
- the page composer needs approved block identities
- the Make workflow needs block docs to derive safe editable fields

So the order should be:

1. instructions and design contract
2. registry plus block docs
3. first approved block entry
4. refinement and composition skills
5. page composition and Make generation

These should be on-demand workflow skills, not always-on instructions.

### 1. Skill: `shadcn-block-refinement`

Use when:

- a raw shadcn block was copied into the repo
- it must be adapted to project design rules
- it must become a reusable business block

Expected outputs:

- reusable block component
- block contract
- entry in machine registry
- human-readable block doc
- TemplatePage preview entry

### 2. Skill: `business-block-contract-authoring`

Use when:

- a business block exists in code
- its machine contract and human contract need to be created or updated

Expected outputs:

- registry entry
- docs/block-registry md file
- example data
- AI field descriptions

### 3. Skill: `page-composer`

Use when:

- a new page must be assembled from approved blocks
- the page structures must be generated
- the WordPress page must be created or updated

Expected outputs:

- page manifest
- `page_builder_schema`
- `page_builder_schema_for_ai`

### 4. Skill: `wordpress-page-publisher`

Use when:

- validated page structures must be written to WordPress post meta
- the system needs to update an existing page instance safely

Expected outputs:

- saved meta fields
- saved publish state
- traceable write result

### 5. Skill: `make-page-agent-bootstrap`

Use when:

- a page already exists
- a Make.com scenario must be created or updated for production editing

Expected outputs:

- Make blueprint
- module descriptions derived from block docs
- deployment webhook module

## Block Lifecycle

Each approved page block should pass this lifecycle:

1. raw import collected into the working folder
2. design adaptation against TemplatePage rules
3. reusable component refactor
4. block contract creation
5. machine registry entry
6. human-readable block doc
7. TemplatePage visual validation
8. approved for page composition

## Page Lifecycle

Each new page should pass this lifecycle:

1. page brief
2. approved block selection
3. page manifest
4. generated `page_builder_schema`
5. generated `page_builder_schema_for_ai`
6. WordPress page create or update
7. Make scenario create or update
8. build and deploy

## Page Manifest Recommendation

In addition to the two meta fields stored in WordPress, the repo should keep a page manifest for reproducibility.

Recommended conceptual shape:

```yaml
page:
  slug: promocja-wiosna
  title: Promocja Wiosna
  postId: 123
  renderer: astro
  templatePageReference: TemplatePage

blocks:
  - id: hero-01
    blockKey: hero-promo-1
    sourceBlockDoc: docs/block-registry/hero-promo-1.md
  - id: gallery-01
    blockKey: gallery-masonry-style1
    sourceBlockDoc: docs/block-registry/gallery-masonry-style1.md

meta:
  makeScenarioKey: page-agent-promocja-wiosna
  deployWebhookKey: github-redeploy
```

Purpose of the manifest:

- reproducible page composition
- traceability between repo, WordPress, and Make
- a deterministic handoff artifact for agents

## Validation Rules

No page should be published or sent to Make generation unless all of the following pass:

- render schema validates
- AI schema validates
- every blockKey exists in registry
- every block instance `id` is unique
- AI schema block ids map to render schema section ids
- Make output contract matches both schemas
- page can be rebuilt without manual patching

## Definition Of Done

A page is done only when:

- all blocks are approved business blocks
- both WordPress meta fields are generated and valid
- WordPress page exists and stores the latest structures
- Make scenario exists or is updated
- deployment path is defined
- preview or test render exists
- the page can be edited later without breaking schema contracts

## What Not To Do

- do not let Make edit arbitrary raw WordPress content outside the structured meta fields
- do not let the production AI agent invent new block ids or reorder blocks silently
- do not use raw shadcn blocks as registry blocks without adaptation
- do not make WordPress the source of block contract truth
- do not let deployment happen automatically after content edits without an explicit approval step

## Remaining Open Questions

These are the main decisions still worth locking before implementation work starts.

1. What exact WordPress status or flag should represent “changed by AI, waiting for redeploy”?
2. Should `page_builder_schema_for_ai` always mirror every block, or can some render-only blocks be excluded?
3. Should page manifests be stored only in repo docs, or also be available through the WordPress bridge API?
4. Should the Make scenario be generated per page slug, per page template, or per page family?
5. Which exact folder should be the canonical working folder for raw imported shadcn blocks?
