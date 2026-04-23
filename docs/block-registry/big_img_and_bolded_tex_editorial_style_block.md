# big_img_and_bolded_tex_editorial_style_block

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Promo3`
- current renderer path: `zip/components/Promo3.tsx`
- implementation status: runtime schema, AI schema descriptor, and TemplatePage preview are implemented

## Purpose

This block exposes the existing Promo3 composition under the requested business key.

It renders:

- one tall portrait image
- one bold editorial text block
- the same mobile-first image-over-copy stacking as the source component

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- contained `max-w-screen-2xl` composition
- portrait image column on the left
- one lead copy block on the right
- mobile order: image first, copy second

## Current Data Contract

### Top-Level Fields

- `title`
- `story`
- `image`

### `image`

- `src`
- `alt`

## Source Rule

This block is direct-edit only in MVP.

- `source = null`

## Safe AI-Editable Fields

- `title`
- `story`
- `image.src`
- `image.alt`

## Restricted Fields

Do not let AI change these by default:

- portrait ratio
- left-right column geometry
- image width inside the left column
- section shell spacing

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "editorial-style-01",
  "blockKey": "big_img_and_bolded_tex_editorial_style_block",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "title": "Editorial portrait",
    "story": "This variant keeps the tall image and the bold editorial copy block only.",
    "image": {
      "src": "/react/images/editorial-portrait.jpg",
      "alt": "Editorial portrait image"
    }
  },
  "source": null,
  "meta": {}
}
```