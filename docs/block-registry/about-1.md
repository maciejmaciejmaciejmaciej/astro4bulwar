# about-1

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `AboutSection`
- current renderer path: `zip/src/components/sections/AboutSection.tsx`
- implementation status: runtime schema and zip pagebuilder registration are implemented

## Purpose

This block renders an editorial two-column about section with:

- a primary text group with optional title and optional CTA
- a secondary supporting text group
- optional image stack on the left
- optional image stack on the right

It is intended for brand-story, venue-introduction, campaign-introduction, and event-context sections where narrative content matters more than list rendering or external product data.

## Why This Is A Valid Third Seed Block

This block already exists as a reusable project-aligned component and matches the earlier MVP intent of having a non-menu, non-gallery storytelling section.

It is a better source mapping for `about-1` than a generic imported variant because it already follows the project's spacing and typography language.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- two-column alternating text and image composition
- stacked image groups instead of a single hero image
- primary text group on the left cluster
- supporting text group on the right cluster

## Current Data Contract

### Top-Level Fields

- `leftImages`
- `leftText`
- `rightText`
- `rightImages`

### `leftImages` Structure

- ordered array of image objects
- each image object contains:
  - `src`
  - `alt`

### `leftText` Structure

- optional `title`
- required `paragraphs[]`
- optional `ctaButton`

### `ctaButton` Structure

- `href`
- `text`

### `rightText` Structure

- required `paragraphs[]`

### `rightImages` Structure

- ordered array of image objects
- each image object contains:
  - `src`
  - `alt`

## Safe AI-Editable Fields

Safe for structured content editing later:

- `leftImages[].src`
- `leftImages[].alt`
- `leftText.title`
- `leftText.paragraphs[]`
- `leftText.ctaButton.text`
- `leftText.ctaButton.href`
- `rightText.paragraphs[]`
- `rightImages[].src`
- `rightImages[].alt`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- column order
- spacing rhythm
- image stack behavior
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
  "id": "about-1-01",
  "blockKey": "about-1",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "leftImages": [
      {
        "src": "/images/about-left-1.webp",
        "alt": "Sala restauracji"
      }
    ],
    "leftText": {
      "title": "Nasza historia",
      "paragraphs": [
        "Bulwar laczy kuchnie i atmosfere miejsca.",
        "Ta sekcja otwiera narracje strony."
      ],
      "ctaButton": {
        "href": "/kontakt",
        "text": "Skontaktuj sie"
      }
    },
    "rightText": {
      "paragraphs": [
        "Druga kolumna rozwija glowny przekaz sekcji."
      ]
    },
    "rightImages": [
      {
        "src": "/images/about-right-1.webp",
        "alt": "Detal wnetrza"
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
  "id": "about-1-01",
  "blockKey": "about-1",
  "content": {
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
    }
  }
}
```

## Future Refinement

Future passes can still decide whether the right text group should ever support title or CTA in a future variant, but the current MVP contract and runtime registration are already in place.