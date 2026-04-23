# Blueprint DSL Specification

## Purpose

The blueprint DSL is the human-friendly command format used from VS Code to create or update pages composed from registered blocks.

Its purpose is to let the operator describe page structure quickly without manually writing raw `page_builder_schema` JSON.

The DSL must be:

- easy to write by hand
- easy to read in chat and markdown
- deterministic to parse
- directly transformable into valid `page_builder_schema`
- compatible with the block registry

## Role In The System

The DSL is not the storage format.

The lifecycle is:

1. The operator writes a blueprint in VS Code or chat.
2. The blueprint parser converts it into `page_builder_schema`.
3. The schema is saved to WordPress.
4. Astro later reads the saved schema and renders the page.

So the DSL is the authoring format.
`page_builder_schema` remains the storage format.

## Design Goals

- prioritize speed of composition
- minimize syntax ambiguity
- keep block order obvious
- allow optional inline defaults and Woo sources
- support both page creation and page updates

## MVP Scope

The first DSL version should support:

- create a page
- define page metadata
- define ordered block list
- assign optional `id`
- assign optional `variant`
- assign optional inline `data`
- assign optional WooCommerce `source`
- allow repeated use of the same block

The first DSL version does not need to support:

- complex conditional logic
- scheduling rules
- reusable macros
- nested sections
- multilingual branches

## Recommended Authoring Format

Use a YAML-like declarative format.

Reason:

- easier to write than raw JSON
- easier to validate than freeform prose
- more readable for both operator and agent
- naturally maps to the page schema

## Canonical Blueprint Shape

```yaml
page:
  slug: promocja-dzien-matki
  title: Promocja z okazji Dnia Matki
  status: draft
  templateKey: landing-promo

sections:
  - block: about-1
    id: about-1-01

  - block: gallery-masonry-style1
    id: gallery-masonry-style1-01

  - block: cta-2
    id: cta-2-01

  - block: menu-category-photo-parallax-full-width
    id: menu-category-photo-parallax-full-width-01
    source:
      type: woo_category
      value: dzien-matki-przystawki

  - block: menu-category-photo-parallax-full-width
    id: menu-category-photo-parallax-full-width-02
    source:
      type: woo_category
      value: dzien-matki-dania-glowne

  - block: reservation
    id: reservation-01
```

This is the canonical blueprint form for MVP.

## Top-Level Blueprint Structure

### `page`

Required.
Defines page-level metadata.

### `sections`

Required.
Defines the page block instances in visual order.

## `page` Fields

### Required

- `slug`
- `title`
- `status`

### Optional

- `templateKey`
- `description`
- `locale`

### Example

```yaml
page:
  slug: menu-sniadaniowe
  title: Menu śniadaniowe
  status: published
  templateKey: menu-page
```

## `sections` Fields

Each section entry represents one block instance.

### Required per section

- `block`

### Optional per section

- `id`
- `variant`
- `enabled`
- `data`
- `source`
- `meta`

## Section Field Meanings

### `block`

- required
- maps to `blockKey` in the registry

Example:

```yaml
- block: about-1
```

### `id`

- optional but recommended
- if omitted, the system may auto-generate one

Example:

```yaml
- block: gallery-masonry-style1
  id: gallery-masonry-style1-01
```

### `variant`

- optional
- used only when the block supports named variants

Example:

```yaml
- block: cta-2
  variant: dark
```

### `enabled`

- optional
- default should be `true`

Example:

```yaml
- block: reservation
  enabled: false
```

### `data`

- optional in blueprint only because the system may inject `defaultData`
- if provided, must match the block schema

Example:

```yaml
- block: about-1
  data:
    leftText:
      title: Dzien Matki
      paragraphs:
        - Celebruj z nami
        - Zapraszamy na specjalne menu.
    rightText:
      paragraphs:
        - Dodatkowy opis sekcji.
```

### `source`

- optional
- used for blocks that support external data sources
- must match the block's `sourceSchema`

Example:

```yaml
- block: menu-category-photo-parallax-full-width
  source:
    type: woo_category
    value: sniadania-klasyczne
```

### `meta`

- optional
- editor-only annotations
- not required for rendering

Example:

```yaml
- block: about-1
  meta:
    label: Sekcja otwierająca
```

## WooCommerce Source Syntax

For MVP, the DSL should support the following `source.type` values.

### `woo_category`

```yaml
source:
  type: woo_category
  value: sniadania-klasyczne
```

### `woo_products`

```yaml
source:
  type: woo_products
  value: [101, 204, 305]
```

### `woo_tag`

```yaml
source:
  type: woo_tag
  value: dzien-matki
```

### `source.options`

Optional resolver hints.

Example:

```yaml
source:
  type: woo_category
  value: sniadania-klasyczne
  options:
    limit: 12
    sort: menu_order
    includeOutOfStock: false
```

## Mapping From Blueprint To Page Schema

Blueprint values should convert to `page_builder_schema` as follows.

### Page mapping

- `page.slug` -> `page.slug`
- `page.title` -> `page.title`
- `page.status` -> `page.status`
- `page.templateKey` -> `page.templateKey`

### Section mapping

- `block` -> `blockKey`
- `id` -> `id`
- `variant` -> `variant`
- `enabled` -> `enabled`
- `data` -> `data`
- `source` -> `source`
- `meta` -> `meta`

### Injected values during conversion

The conversion layer should additionally inject:

- top-level `version`
- section `blockVersion` from the current registry entry
- section `enabled = true` if omitted
- section `data = defaultData` if omitted or partially incomplete, depending on chosen merge policy

## Merge Policy Recommendation

For MVP, use this rule:

- if `data` is omitted, use full `defaultData`
- if `data` is provided, deep-merge it over `defaultData`

This makes blueprint authoring faster and avoids repetitive boilerplate.

## Example: Minimal Blueprint

```yaml
page:
  slug: menu-sniadaniowe
  title: Menu śniadaniowe
  status: draft

sections:
  - block: about-1
  - block: menu-category-photo-parallax-full-width
    source:
      type: woo_category
      value: sniadania-klasyczne
  - block: menu-category-photo-parallax-full-width
    source:
      type: woo_category
      value: sniadania-na-slodko
```

The system should expand this into a valid `page_builder_schema` using defaults, generated ids, and block versions.

## Example: Full Blueprint

```yaml
page:
  slug: promocja-dzien-matki
  title: Promocja z okazji Dnia Matki
  status: draft
  templateKey: landing-promo
  description: Landing page for Mother's Day offer

sections:
  - block: about-1
    id: about-1-01
    data:
      leftImages:
        - src: https://example.com/uploads/matka-hero.jpg
          alt: Sala przygotowana na Dzien Matki
      leftText:
        title: Celebruj z nami wyjątkowy dzień
        paragraphs:
          - Zapraszamy na specjalne menu z okazji Dnia Matki.
          - Ta sekcja otwiera landing i buduje klimat wydarzenia.
        ctaButton:
          text: Zarezerwuj stolik
          href: /kontakt
      rightText:
        paragraphs:
          - Druga kolumna dopowiada szczegoly oferty i charakter miejsca.
      rightImages:
        - src: https://example.com/uploads/matka-sala.jpg
          alt: Detal dekoracji sali

  - block: gallery-masonry-style1
    id: gallery-masonry-style1-01
    data:
      title: Zobacz atmosferę wydarzenia
      images:
        - src: https://example.com/uploads/matka-1.jpg
          alt: Dekoracja sali
        - src: https://example.com/uploads/matka-2.jpg
          alt: Zestaw deserów
        - src: https://example.com/uploads/matka-3.jpg
          alt: Kwiaty na stole
        - src: https://example.com/uploads/matka-4.jpg
          alt: Kawa i ciasto

  - block: cta-2
    id: cta-2-01
    data:
      title: Zarezerwuj stolik już dziś
      buttonLabel: Rezerwacja
      buttonHref: /kontakt

  - block: menu-category-photo-parallax-full-width
    id: menu-category-photo-parallax-full-width-01
    data:
      title: Przystawki
    source:
      type: woo_category
      value: dzien-matki-przystawki

  - block: menu-category-photo-parallax-full-width
    id: menu-category-photo-parallax-full-width-02
    data:
      title: Dania główne
    source:
      type: woo_category
      value: dzien-matki-dania-glowne

  - block: menu-category-photo-parallax-full-width
    id: menu-category-photo-parallax-full-width-03
    data:
      title: Desery
    source:
      type: woo_category
      value: dzien-matki-desery

  - block: reservation
    id: reservation-01
```

## Update Commands

For MVP, updates may still use the same full blueprint format.
Later, a patch-style DSL can be added.

Recommended first approach:

- full replace of page section list
- or agent-assisted targeted update based on block `id`

Patch syntax is not required for the first release.

## Validation Rules

The blueprint parser must validate:

1. top-level presence of `page` and `sections`
2. required `page` fields
3. every `block` exists in the registry
4. duplicate `id` values are rejected
5. provided `data` matches the block schema after merge
6. provided `source` matches the block source schema

## Error Behavior

If the blueprint is invalid, the parser should fail with clear messages such as:

- unknown block `menu-feature-x`
- duplicate section id `gallery-masonry-style1-01`
- invalid source type `woo_collection`
- missing required page field `slug`
- invalid data for block `about-1`

## Recommended Future Extensions

Possible later additions:

- patch/update command syntax
- section insertion helpers such as `before` and `after`
- blueprint presets
- reusable fragments
- locale overrides

These are explicitly out of MVP scope.

## Decision Summary

- The blueprint DSL is the authoring format for composing pages from VS Code.
- YAML-like declarative syntax is recommended for MVP.
- The DSL maps directly into `page_builder_schema`.
- Each section points to a registry block and may optionally provide `data`, `source`, and `variant`.
- WooCommerce references are expressed in `source`.

## Current Component Mapping

- `gallery-masonry-style1` -> current `GallerySection`
- `menu-category-photo-parallax-full-width` -> current `BreakfastSection`
- `about-1` -> `AboutSection` in `zip/src/components/sections/AboutSection.tsx`

## Next Dependency

After this document, the next practical step is to define the WordPress bridge API contract so the blueprint-to-schema save flow can be implemented cleanly.
