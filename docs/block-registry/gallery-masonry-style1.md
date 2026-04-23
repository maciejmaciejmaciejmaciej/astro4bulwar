# gallery-masonry-style1

## Status

- registry status: seed
- block version: 1
- current renderer mapping: `GallerySection`
- current renderer path: `zip/src/components/sections/GallerySection.tsx`

## Purpose

This block renders a masonry-style gallery section with:

- a section title
- a four-column staggered image composition on desktop
- square and portrait aspect-ratio image tiles
- subtle scroll-driven vertical motion using Framer Motion

It is intended for hospitality, venue, food, and editorial gallery sections where visual atmosphere matters more than captions or text density.

## Why This Is A Good Second Seed Block

This block already has a reusable prop surface and a recognizable business purpose.

It also introduces a second important block family into the registry:

- menu/content-heavy section
- gallery/image-heavy section

That makes the registry meaningfully closer to a real page-composition library.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- page-margin section shell
- `max-w-screen-2xl mx-auto` container logic
- staggered masonry composition
- desktop four-column layout
- mixed aspect-ratio image tiles
- scroll-driven vertical offset behavior for the columns

## Current Data Contract

### Top-Level Fields

- `title`
- `images`
- optional `layoutStyle`
- optional `motionPreset`

### images Structure

- `images[]` is an ordered array of image objects
- each image object contains:
  - `src`
  - `alt`
- the current component fills seven visual slots
- if fewer than seven images are passed, the component reuses fallback defaults to preserve the layout shape

## Safe AI-Editable Fields

Safe for structured content editing later:

- `title`
- `images[].src`
- `images[].alt`

## Restricted Fields

Do not let AI change these by default:

- `layoutStyle`
- `motionPreset`
- masonry geometry
- column staggering
- aspect-ratio system
- motion behavior

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "gallery-01",
  "blockKey": "gallery-masonry-style1",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "title": "Galeria",
    "layoutStyle": "masonry-style1",
    "motionPreset": "parallax-columns-soft",
    "images": [
      {
        "src": "/images/galeria-1.webp",
        "alt": "Sala restauracji"
      },
      {
        "src": "/images/galeria-2.webp",
        "alt": "Detal zastawy"
      },
      {
        "src": "/images/galeria-3.webp",
        "alt": "Nakryty stol"
      }
    ]
  },
  "source": null,
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "gallery-01",
  "blockKey": "gallery-masonry-style1",
  "content": {
    "title": "Galeria",
    "images": [
      {
        "src": "/images/galeria-1.webp",
        "alt": "Sala restauracji"
      },
      {
        "src": "/images/galeria-2.webp",
        "alt": "Detal zastawy"
      },
      {
        "src": "/images/galeria-3.webp",
        "alt": "Nakryty stol"
      }
    ]
  }
}
```

## Next Required Refinement

Before this block should be treated as fully approved for production composition, the next pass should:

- decide whether optional captions or media bindings should be added on top of the current `src` + `alt` shape
- decide whether the required image count should stay fixed at seven slots or become configurable
- verify that motion behavior is acceptable as part of the approved business block identity
- define whether WordPress media bindings should replace raw image objects
