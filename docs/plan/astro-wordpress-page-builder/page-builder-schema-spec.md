# Page Builder Schema Specification

## Purpose

`page_builder_schema` is the canonical WordPress-side storage format for a page composed from registered business blocks.

It is the render-oriented payload consumed by Astro.

It has a companion editing-oriented payload stored separately as `page_builder_schema_for_ai`.

It describes:

- page-level metadata needed by Astro
- the ordered list of block instances on the page
- per-block content payloads
- optional external source bindings, especially WooCommerce

The schema does not define what a block is.
That remains the responsibility of the block registry in code.

## Storage Location

- WordPress object type: standard page
- WordPress storage: post meta
- Render meta key: `page_builder_schema`
- Companion AI meta key: `page_builder_schema_for_ai`
- Stored format: JSON string

## Design Rules

- The schema must be deterministic and machine-readable.
- The schema must be directly compatible with the block registry.
- The schema must not store component file names.
- The schema must allow a page to mix pure-content blocks and Woo-backed blocks.
- The schema must be versioned.

## Top-Level Shape

The page schema is one JSON object.

Conceptual shape:

```json
{
  "version": 1,
  "page": {
    "slug": "menu-sniadaniowe",
    "title": "Menu śniadaniowe",
    "status": "draft"
  },
  "sections": [
    {
      "id": "about-1-01",
      "blockKey": "about-1",
      "blockVersion": 1,
      "variant": null,
      "enabled": true,
      "data": {},
      "source": null,
      "meta": {}
    }
  ]
}
```

## Top-Level Required Fields

### `version`

- type: integer
- required: yes
- purpose: version of the page schema contract itself
- initial value: `1`

### `page`

- type: object
- required: yes
- purpose: page-level metadata used by the system

### `sections`

- type: array
- required: yes
- purpose: ordered list of block instances rendered on the page

## Top-Level Optional Fields

These may be added, but are not required for MVP.

### `seo`

- type: object
- required: no
- purpose: page-level SEO overrides if not handled elsewhere in WordPress

### `build`

- type: object
- required: no
- purpose: optional build-time hints, cache behavior, or deployment notes

### `meta`

- type: object
- required: no
- purpose: system metadata not used directly for rendering

## `page` Object Specification

### Required fields

- `slug`: unique page slug
- `title`: human-readable page title
- `status`: page lifecycle status

### Optional fields

- `templateKey`: optional logical page template key
- `locale`: optional locale identifier
- `description`: optional internal page description

### Allowed `status` values for MVP

- `draft`
- `published`
- `archived`

### Example

```json
{
  "slug": "promocja-dzien-matki",
  "title": "Promocja z okazji Dnia Matki",
  "status": "draft",
  "templateKey": "landing-promo"
}
```

## `sections` Array Specification

The order of items in `sections` is the visual order of blocks on the page.

Each array item is one block instance.

## Block Instance Shape

Every section item must be an object with the following structure.

```json
{
  "id": "menu-category-photo-parallax-full-width-02",
  "blockKey": "menu-category-photo-parallax-full-width",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {},
  "source": null,
  "meta": {}
}
```

## Block Instance Required Fields

### `id`

- type: string
- required: yes
- purpose: stable instance identifier within the page
- must be unique inside one page schema

Recommended format:

- `<blockKey>-01`
- `<blockKey>-02`

Examples:

- `about-1-01`
- `gallery-masonry-style1-01`
- `menu-category-photo-parallax-full-width-02`

### `blockKey`

- type: string
- required: yes
- purpose: link to the registry definition
- must match an existing block in the registry

### `blockVersion`

- type: integer
- required: yes
- purpose: version of the block payload written into this page
- must correspond to the registered block contract version used when the block instance was saved

### `enabled`

- type: boolean
- required: yes
- purpose: soft on/off toggle without deleting the block instance

### `data`

- type: object
- required: yes
- purpose: block-local content payload
- must validate against the block's registry schema

## Block Instance Optional Fields

### `variant`

- type: string or null
- required: no
- purpose: optional named visual or structural variant supported by the block

### `source`

- type: object or null
- required: no
- purpose: optional external source binding, typically WooCommerce

### `meta`

- type: object
- required: no
- purpose: editor/system-only metadata not directly needed by the renderer

Examples of possible `meta` values:

- `label`
- `notes`
- `createdBy`
- `updatedAt`

## Required vs Optional Summary

### Top-level required

- `version`
- `page`
- `sections`

### `page` required

- `slug`
- `title`
- `status`

### Block instance required

- `id`
- `blockKey`
- `blockVersion`
- `enabled`
- `data`

### Optional everywhere

- `variant`
- `source`
- `meta`
- top-level `seo`
- top-level `build`
- top-level `meta`

## `data` Object Rules

`data` is block-specific.
Its exact shape is not defined by the page schema document.

Instead:

- `data` must be validated against the `schema` from the registry entry for `blockKey`
- `defaultData` from the registry should be used to prefill new block instances

Examples:

### `about-1` conceptual data

```json
{
  "leftImages": [
    {
      "src": "https://example.com/uploads/about-left.jpg",
      "alt": "Sala restauracji"
    }
  ],
  "leftText": {
    "title": "Nasza historia",
    "paragraphs": [
      "Bulwar laczy atmosfere i kuchnie.",
      "Ta sekcja wprowadza uzytkownika w charakter miejsca."
    ],
    "ctaButton": {
      "text": "Skontaktuj sie",
      "href": "/kontakt"
    }
  },
  "rightText": {
    "paragraphs": [
      "Druga kolumna rozwija glowna opowiesc."
    ]
  },
  "rightImages": [
    {
      "src": "https://example.com/uploads/about-right.jpg",
      "alt": "Detal wnetrza"
    }
  ]
}
```

### `gallery-masonry-style1` conceptual data

```json
{
  "title": "Galeria wydarzenia",
  "images": [
    {
      "src": "https://.../1.jpg",
      "alt": "Dekoracja sali"
    },
    {
      "src": "https://.../2.jpg",
      "alt": "Deser i kawa"
    }
  ]
}
```

## `source` Object Purpose

`source` exists for blocks that resolve external data.

Examples:

- WooCommerce category-based product sections
- manually selected WooCommerce products
- later, possibly WordPress posts or taxonomies if needed

The page schema allows `source`, but a block may also choose not to support it.

If a block does not define `sourceSchema` in the registry, `source` must be null or absent.

## `source` Object Core Shape

For MVP, recommend this generic shape:

```json
{
  "sourceType": "woo_category",
  "sourceValue": "sniadania-klasyczne",
  "options": {}
}
```

### Required fields

- `sourceType`
- `sourceValue`

### Optional fields

- `options`

## WooCommerce Source Types

For MVP, support these WooCommerce source modes.

### 1. `woo_category`

Use this when a block should render products from a WooCommerce category.

Example:

```json
{
  "sourceType": "woo_category",
  "sourceValue": "sniadania-klasyczne",
  "options": {
    "limit": 12,
    "sort": "menu_order",
    "includeOutOfStock": false
  }
}
```

### 2. `woo_products`

Use this when a block should render a manually selected list of WooCommerce products.

Example:

```json
{
  "sourceType": "woo_products",
  "sourceValue": [101, 204, 305],
  "options": {
    "preserveOrder": true
  }
}
```

### 3. `woo_tag`

Use only if a block is designed to resolve products from a WooCommerce tag.

Example:

```json
{
  "sourceType": "woo_tag",
  "sourceValue": "dzien-matki",
  "options": {
    "limit": 6
  }
}
```

## WooCommerce Source Rules

- `sourceType` must be validated by the block's `sourceSchema`
- `sourceValue` shape depends on `sourceType`
- the block resolver is responsible for normalizing Woo data into render-ready props
- renderers must not directly consume raw Woo REST objects

## Example Full Schema: Menu Śniadaniowe

```json
{
  "version": 1,
  "page": {
    "slug": "menu-sniadaniowe",
    "title": "Menu śniadaniowe",
    "status": "published",
    "templateKey": "menu-page"
  },
  "sections": [
    {
      "id": "about-1-01",
      "blockKey": "about-1",
      "blockVersion": 1,
      "variant": null,
      "enabled": true,
      "data": {
        "leftImages": [
          {
            "src": "https://example.com/uploads/sniadania-1.jpg",
            "alt": "Sala restauracji o poranku"
          }
        ],
        "leftText": {
          "title": "Śniadania w Bulwarze",
          "paragraphs": [
            "Codziennie serwujemy śniadania oparte na świeżych składnikach.",
            "Ta sekcja otwiera stronę i buduje klimat oferty."
          ],
          "ctaButton": {
            "text": "Zobacz niżej",
            "href": "#sekcja-sniadania"
          }
        },
        "rightText": {
          "paragraphs": [
            "Druga kolumna dopowiada kontekst i wzmacnia przekaz głównej sekcji."
          ]
        },
        "rightImages": []
      },
      "source": null,
      "meta": {
        "label": "Sekcja otwierająca"
      }
    },
    {
      "id": "menu-category-photo-parallax-full-width-01",
      "blockKey": "menu-category-photo-parallax-full-width",
      "blockVersion": 1,
      "variant": null,
      "enabled": true,
      "data": {
        "heroTitle": "Śniadania klasyczne",
        "backgroundImage": {
          "src": "https://example.com/uploads/klasyczne.jpg",
          "alt": "Klasyczne śniadanie"
        },
        "overlayOpacity": 0.2,
        "layout": {
          "columns": 2,
          "heroHeight": "400px"
        },
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "sniadania-klasyczne",
        "options": {
          "limit": 20,
          "sort": "menu_order",
          "includeOutOfStock": false
        }
      },
      "meta": {}
    },
    {
      "id": "menu-category-photo-parallax-full-width-02",
      "blockKey": "menu-category-photo-parallax-full-width",
      "blockVersion": 1,
      "variant": null,
      "enabled": true,
      "data": {
        "heroTitle": "Śniadania na słodko",
        "backgroundImage": {
          "src": "https://example.com/uploads/slodkie.jpg",
          "alt": "Słodkie śniadanie"
        },
        "overlayOpacity": 0.2,
        "layout": {
          "columns": 2,
          "heroHeight": "400px"
        },
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "sniadania-na-slodko",
        "options": {
          "limit": 20,
          "sort": "menu_order",
          "includeOutOfStock": false
        }
      },
      "meta": {}
    }
  ]
}
```

## Validation Rules

The system should validate in this order:

1. Top-level page schema contract.
2. Presence and uniqueness of section `id` values.
3. Existence of each `blockKey` in the registry.
4. `blockVersion` compatibility.
5. Block `data` using the registry schema.
6. Block `source` using the registry source schema, if supported.

## Behavior Rules

### Disabled sections

- if `enabled` is `false`, the section remains stored but is not rendered

### Missing block definitions

- build must fail with a clear error
- silent fallback is not allowed for production build

### Unsupported source

- build must fail with a clear error if `source` is supplied for a block that does not support it

## Recommended Future Extensions

These are not required for MVP but the schema should leave room for them:

- `visibility` rules
- scheduling / publish windows per section
- locale-specific block overrides
- experiment flags
- editor comments

## Decision Summary

- `page_builder_schema` is one JSON document per WordPress page.
- It contains page metadata plus ordered block instances.
- Every block instance stores validated `data` and optional `source`.
- WooCommerce references are stored inside `source`, not mixed into `data` unless the block schema explicitly requires local content plus source.
- Registry and page schema are intentionally separated: code defines blocks, WordPress stores page instances.

## Next Dependency

The next document to define should be the blueprint DSL, because page creation commands must produce valid `page_builder_schema` objects automatically.
