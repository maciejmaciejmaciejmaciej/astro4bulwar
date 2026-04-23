# just_pralax_img_horizontal

## Status

- registry status: approved seed
- block version: 1
- current renderer mapping: `JustPralaxImgHorizontalSection`
- current renderer path: `zip/src/components/sections/JustPralaxImgHorizontalSection.tsx`

## Purpose

This block renders only one thing:

- a horizontal parallax image shell

It intentionally does not render:

- any heading over the image
- any menu content below the image
- any WooCommerce-driven data

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- horizontal parallax image shell
- desktop width aligned to the same contained width as `Promo2`
- `page-margin` outer rhythm
- `max-w-screen-2xl` image container
- dark gray image mask at fixed 50% opacity
- `400px` height on smaller screens
- `300px` height on desktop

## Current Data Contract

### Top-Level Fields

- `imageUrl`

## Editing Rule

This block is intentionally limited to one editable field only:

- `content.imageUrl`

No other content fields should be exposed for AI editing in normal workflow.

## Safe AI-Editable Fields

- `content.imageUrl`

## Restricted Fields

Do not let AI change these by default:

- mask opacity
- height
- width model
- layout geometry
- meta
- source

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `zip/components/Promo2.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "just-pralax-01",
  "blockKey": "just_pralax_img_horizontal",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "imageUrl": "/images/parallax-horizontal.jpg"
  },
  "source": null,
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "just-pralax-01",
  "blockKey": "just_pralax_img_horizontal",
  "content": {
    "imageUrl": "/images/parallax-horizontal.jpg"
  }
}
```