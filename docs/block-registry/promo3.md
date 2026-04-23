# promo3

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Promo3`
- current renderer path: `zip/components/Promo3.tsx`
- implementation status: runtime schema and AI schema descriptor are implemented

## Purpose

This block renders a simplified editorial promo/story section with:

- a large title in the existing page shell
- one centered portrait image on the left column
- one main narrative copy block on the right column
- mobile stacking where the image appears above the copy

It is intended for lighter story moments where the page should keep the existing editorial tone without eyebrow labels, icon rows, or crew/member metadata.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- the current large editorial title row
- two-column desktop layout with image left and story right
- centered image that stays at 50% of the left column width
- portrait image ratio
- mobile order: image first, copy second

## Current Data Contract

### Top-Level Fields

- `title`
- `story`
- `image`

### `image` Structure

- `src`
- `alt`

## Safe AI-Editable Fields

Safe for structured content editing later:

- `title`
- `story`
- `image.src`
- `image.alt`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- image width ratio inside the left column
- portrait image ratio
- desktop/mobile order of image and text
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
  "id": "promo3-01",
  "blockKey": "promo3",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "title": "Our story",
    "story": "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect.",
    "image": {
      "src": "/react/images/promo3.jpg",
      "alt": "Portrait editorial image"
    }
  },
  "source": null,
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "promo3-01",
  "blockKey": "promo3",
  "contentSource": "page_schema",
  "content": {
    "title": "Our story",
    "story": "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect.",
    "image": {
      "src": "/react/images/promo3.jpg",
      "alt": "Portrait editorial image"
    }
  }
}
```