# premium_call_to_action_with_image_carousel

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `CateringSection`
- current renderer path: `zip/src/components/sections/CateringSection.tsx`
- implementation status: runtime schema, AI schema descriptor, and TemplatePage preview are implemented

## Purpose

This block renders the existing CateringSection as a direct-edit page-builder block with a contained shell that matches Promo2 width behavior.

It keeps:

- one main CTA copy stack on the left
- one image carousel/marquee area on the right
- contained width using `page-margin` plus `max-w-screen-2xl`

The decorative lower-right graphic from source inspiration is intentionally excluded.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- contained `max-w-screen-2xl` wrapper
- rounded surface panel
- two-column desktop composition with copy left and carousel right
- marquee-based image motion pattern

## Current Data Contract

### Top-Level Fields

- `heading`
- `description`
- `buttonText`
- `buttonHref`
- `images`

### `images[]`

- `src`
- `alt`

The schema supports direct-edit image arrays.

Seeded defaults and examples intentionally use exactly 6 images.

## Source Rule

This block is direct-edit only in MVP.

- `source = null`

## Safe AI-Editable Fields

- `heading`
- `description`
- `buttonText`
- `buttonHref`
- `images[].src`
- `images[].alt`

## Restricted Fields

Do not let AI change these by default:

- contained shell geometry
- marquee animation direction and split behavior
- card surface styling
- column layout and spacing rhythm

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "premium-catering-01",
  "blockKey": "premium_call_to_action_with_image_carousel",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "heading": "Catering Wielkanocny",
    "description": "Zamow z dostawa lub odbiorem w contained sekcji zgodnej z rytmem Promo2.",
    "buttonText": "ZAMOW ONLINE",
    "buttonHref": "/catering-wielkanocny",
    "images": [
      {
        "src": "/react/images/zupy-catering.jpg",
        "alt": "Zupy cateringowe"
      },
      {
        "src": "/react/images/sniadanie-wielkanocne.jpg",
        "alt": "Sniadanie wielkanocne"
      },
      {
        "src": "/react/images/ciasta-catering.jpg",
        "alt": "Ciasta cateringowe"
      },
      {
        "src": "/react/images/dla-dzieci.jpg",
        "alt": "Menu dla dzieci"
      },
      {
        "src": "/react/images/chleb-pieczywo.jpg",
        "alt": "Chleb i pieczywo"
      },
      {
        "src": "/react/images/dania-glowne.jpg",
        "alt": "Dania glowne"
      }
    ]
  },
  "source": null,
  "meta": {}
}
```