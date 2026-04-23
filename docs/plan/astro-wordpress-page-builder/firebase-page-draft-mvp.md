# Firebase Page Draft MVP

## Purpose

This document defines a target-state MVP working-state model for page editing in Firebase.

It is not the current canonical operating workflow.

The current production-facing workflow is the repo-first process documented in `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`.

For the target-state registry-driven bootstrap layer from scrape into Firebase draft, and for the compile mapping from draft to both WordPress payloads, see `docs/plan/astro-wordpress-page-builder/scrape-bootstrap-firebase-draft-mapping.md`.

It should be read as a subordinate design note under the broader AI editing architecture documented in `docs/plan/astro-wordpress-page-builder/agentic-page-builder-blueprint.md`.

The goal is to keep the editing flow simple enough for the VS Code agent and Make.com agents without introducing too many intermediate structures.

## Relationship To The Main Blueprint

If this variant is implemented, Firebase becomes a working-draft store only.

It does not replace:

- repo as the source of truth for block definitions and contracts
- WordPress as the storage for publishable page payloads
- the dual-meta model built around `page_builder_schema` and `page_builder_schema_for_ai`

Its role would be limited to:

- holding editable draft state between composition and publish
- letting Make update draft content in a granular way
- feeding a compile step that generates the same WordPress payloads already used by the rest of the system
- preserving structure and source bindings without turning scrape body content into direct-edit menu payload

## Core Rule

- one Firebase document = one page draft
- the document is the working state edited by Make.com
- a separate compile step produces:
  - `page_builder_schema`
  - `page_builder_schema_for_ai`
- WordPress stores the compiled output, not the working draft logic
- for restaurant menu pages, WooCommerce remains the source of truth for products, prices, and category-driven menu lists
- scrape output may help detect page type or SEO candidates, but it must not seed canonical product rows for direct edit

## Why This Model

This is intentionally simpler than the earlier multi-collection ideas.

The workflow should be:

1. VS Code agent creates the page draft document in Firebase
2. VS Code agent creates the Make.com scenario and its agent inputs/outputs
3. Make agent edits the Firebase page draft through MCP tools
4. a separate compile action builds the two WordPress JSON structures
5. a separate publish action writes both JSON structures to WordPress
6. an optional deploy action publishes Astro

## Important Technical Adjustment

Conceptually this is still one document per page.

However, the editable block collection inside the document should not be represented as the primary root array for write operations.

Instead:

- keep block order in `blocksOrder`
- keep editable blocks in `blocks`
- use stable block ids as object keys

This keeps the model conceptually simple while allowing precise block updates without replacing a whole ordered array on every change.

## Final MVP Shape

```json
{
  "pageSlug": "testowa-blueprint",
  "wordpressPostId": 118,
  "title": "Testowa Blueprint",
  "templateKey": "blueprint-test-page",
  "status": "draft",
  "currentSessionId": "sess_20260415_001",
  "blocksOrder": [
    "gallery-masonry-style1-01",
    "menu-category-photo-parallax-full-width-01"
  ],
  "blocks": {
    "gallery-masonry-style1-01": {
      "blockKey": "gallery-masonry-style1",
      "description": "Ten blok pokazuje galerie zdjec strony.",
      "howToEdit": "W output schema dla tego bloku podmieniasz content.title oraz content.images[].src i content.images[].alt.",
      "contentSource": "page_schema",
      "editableFields": [
        "content.title",
        "content.images"
      ],
      "content": {
        "title": "Galeria Testowa",
        "images": [
          {
            "src": "/react/images/gallery/12-1024x680-1-640x640.webp",
            "alt": "Zdjecie 1"
          },
          {
            "src": "/react/images/gallery/20160511_123307-kopia-1024x576-1-640x576.webp",
            "alt": "Zdjecie 2"
          }
        ]
      }
    },
    "menu-category-photo-parallax-full-width-01": {
      "blockKey": "menu-category-photo-parallax-full-width",
      "description": "Ten blok pokazuje obraz naglowka kategorii menu, nazwe kategorii WooCommerce oraz liste produktow z tej kategorii. Edycja tego bloku to glownie zmiana obrazu naglowka albo kategorii.",
      "howToEdit": "W output schema dla tego bloku zmieniaj content.backgroundImage.src, content.backgroundImage.alt oraz content.source.sourceValue. Nie wpisuj recznie listy produktow.",
      "contentSource": "woo_category",
      "editableFields": [
        "content.backgroundImage.src",
        "content.backgroundImage.alt",
        "content.source.sourceValue",
        "content.emptyStateText"
      ],
      "content": {
        "backgroundImage": {
          "src": "https://picsum.photos/seed/menu-specials/1920/1080",
          "alt": "Sekcja menu Bulwar"
        },
        "source": {
          "sourceValue": "zestawy-specjalne"
        },
        "emptyStateText": "Ladowanie produktow z WooCommerce..."
      }
    }
  },
  "compiled": {
    "page_builder_schema": null,
    "page_builder_schema_for_ai": null
  },
  "needsCompile": true,
  "needsPublish": false,
  "needsDeploy": false,
  "createdAt": "2026-04-15T12:00:00Z",
  "updatedAt": "2026-04-15T12:00:00Z"
}
```

## Field Meanings

### Top-Level Fields

- `pageSlug`: stable page identifier
- `wordpressPostId`: target WordPress page id when known
- `title`: working title of the page
- `templateKey`: optional logical page template key
- `status`: current draft lifecycle status
- `currentSessionId`: current planning or execution session id in Make
- `blocksOrder`: visual order of block ids on the page
- `blocks`: editable working-state map keyed by `blockId`
- `compiled.page_builder_schema`: last compiled render payload
- `compiled.page_builder_schema_for_ai`: last compiled AI payload
- `needsCompile`: whether the draft changed and compiled output is stale
- `needsPublish`: whether compiled output should be written to WordPress
- `needsDeploy`: whether published content now requires Astro deploy

For source-bound page types such as restaurant menu pages, the draft should also expose explicit workflow gates, for example:

- `workflow.requiresSourceMapping`: whether any Woo binding is still unresolved
- `workflow.unresolvedSourceBlockIds`: exact block ids waiting for source mapping
- `workflow.sourceMappingNotes`: operator guidance for the missing bindings

These workflow gates complement the existing top-level lifecycle flags such as `needsCompile`, `needsPublish`, and `needsDeploy`; they do not replace them.

### Block Fields

Each entry in `blocks` must contain:

- `blockKey`: approved registry block key
- `description`: short business description of the block instance
- `howToEdit`: short instruction telling the Make agent how to change this block in output terms
- `contentSource`: where the visible content primarily comes from
- `editableFields`: list of fields that the editing agent is allowed to modify
- `content`: the current editable payload for that block instance

For menu blocks backed by `woo_category` or `woo_products`, `content` is not the canonical product catalog. It should carry only the editable structural fields owned by the block, while products and prices remain owned by WooCommerce.

## Why `blocksOrder` And `blocks` Both Exist

This is the one compromise in the MVP.

If blocks were stored only as an ordered array, a granular update to one block would often require rewriting a large array structure.

By splitting the structure into:

- `blocksOrder`
- `blocks`

the system still behaves like one page document, but edits can target a specific block id more safely.

## What The Make Agent Should Edit

The Make editing agent should primarily modify:

- `blocks.<blockId>.content`
- `blocks.<blockId>.description` only if the workflow intentionally regenerates contextual instructions
- `blocks.<blockId>.howToEdit` only if the page workflow intentionally refreshes that guidance

The Make editing agent should normally not modify:

- `blocksOrder`
- `compiled`
- `needsDeploy` directly unless the scenario explicitly owns publish/deploy decisions

For restaurant menu blocks with `contentSource = woo_category` or `contentSource = woo_products`, the Make agent should edit only structural fields such as hero image, empty state, anchor ids, or approved `source` bindings. It must never hand-write product names, descriptions, prices, or menu rows into the draft as a substitute for WooCommerce.

## What The Compile Step Does

The compile step reads the Firebase page draft and produces:

1. `compiled.page_builder_schema_for_ai`
   - generated from the working draft into the AI-editing-oriented WordPress structure

2. `compiled.page_builder_schema`
   - generated from the same working draft into the render-oriented WordPress structure

The compile step is the only place where draft content becomes WordPress publishable JSON.

If the draft still has unresolved Woo bindings, for example `workflow.requiresSourceMapping = true` or placeholder values such as `TODO_WOO_CATEGORY_SLUG`, the compile step should fail in a controlled way and return a validation result instead of producing publishable payloads.

## What The Publish Step Does

The publish step should:

1. read `compiled.page_builder_schema`
2. read `compiled.page_builder_schema_for_ai`
3. send both to the authenticated WordPress page-builder `POST` endpoint
4. set `needsPublish = false`
5. set `needsDeploy = true` when a static Astro deploy is still required

## What To Avoid

- do not store each field as a separate WordPress meta field
- do not make WordPress the working-state store for iterative edits
- do not model one Make scenario per block type
- do not treat the compile step as optional if WordPress output depends on this Firebase draft
- do not store editing history inside the same page document forever; keep this document focused on current draft state
- do not bootstrap restaurant menu products from scrape body content into Firebase direct-edit fields
- do not treat Woo-backed menu products as editable content in `content` when the block contract says they resolve from WooCommerce

## Recommended Next Step

If this MVP shape is accepted, the next implementation design should define exactly:

- how `compiled.page_builder_schema_for_ai` is generated from `blocks`
- how `compiled.page_builder_schema` is generated from `blocks`
- which fields in `blocks[*].content` map directly to WordPress output and which should trigger tool-based edits instead
- how the Make Code module validates `workflow.requiresSourceMapping`, applies approved Woo source bindings, and fails safely when menu source mapping is incomplete