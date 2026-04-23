# universal_header_block_2

## Status

- registry status: ready
- block version: 1
- current renderer mapping: `Project10`
- current renderer path: `zip/src/components/sections/Project10.tsx`
- Astro renderer path: `astro-site/src/components/UniversalHeaderBlock2Section.astro`
- implementation status: runtime schema, AI schema descriptor, React runtime, Astro renderer/projection support, TemplatePage preview, and focused registry tests are implemented

## Purpose

This block renders an editorial hero/story section with:

- one lead intro column with eyebrow, title, and description
- one metadata stack on the right
- one optional CTA below the metadata
- one wide hero image
- one repeatable collection of numbered story rows

It is intended for visual storytelling headers, branded campaign intros, and page sections where both metadata rows and story rows must stay directly editable in page schema.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- current Project10 hero header split
- right-side metadata stack and CTA area
- one wide image below the header
- one vertical sequence of numbered story rows
- existing while-in-view motion behavior

## Current Data Contract

### Top-Level Fields

- `eyebrow`
- `title`
- `description`
- `metadataItems`
- optional `contactCta`
- `heroImage`
- `storySections`

### `metadataItems[]` Structure

- `label`
- `value`

### `contactCta` Structure

- `label`
- `buttonLabel`
- `href`

### `heroImage` Structure

- `src`
- `alt`

### `storySections[]` Structure

- `number`
- `title`
- `content`

## Safe AI-Editable Fields

- `eyebrow`
- `title`
- `description`
- `metadataItems[].label`
- `metadataItems[].value`
- `contactCta.label`
- `contactCta.buttonLabel`
- `contactCta.href`
- `heroImage.src`
- `heroImage.alt`
- `storySections[].number`
- `storySections[].title`
- `storySections[].content`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- hero image height model
- motion choreography
- story-row shell styling
- class-level styling

## Source Rule

This block is content-only in MVP.

- `source = null`

It should not fetch WooCommerce or WordPress collections directly as part of the initial contract.

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "universal-header-2-01",
  "blockKey": "universal_header_block_2",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "eyebrow": "Sesja marki",
    "title": "Bulwar Photo Story",
    "description": "Header, metadata, CTA i story rows sa w pelni sterowane przez page schema.",
    "metadataItems": [
      {
        "label": "Kategoria:",
        "value": "Przyjecia okolicznosciowe"
      }
    ],
    "contactCta": {
      "label": "Dostepne terminy:",
      "buttonLabel": "wyslij zapytanie",
      "href": "/kontakt"
    },
    "heroImage": {
      "src": "/react/images/home_hero.jpg",
      "alt": "Restauracja Bulwar od frontu"
    },
    "storySections": [
      {
        "number": "01.",
        "title": "Inspiration.",
        "content": "Pierwsza sekcja opowiesci pozostaje w pelni sterowana przez page schema."
      }
    ]
  },
  "source": null,
  "meta": {}
}
```