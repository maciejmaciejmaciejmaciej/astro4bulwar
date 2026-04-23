# our-services

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `OurServices`
- current renderer path: `zip/src/components/sections/OurServices.tsx`
- implementation status: runtime schema and zip pagebuilder registration are implemented

## Purpose

This block renders a services section with:

- a sticky introductory column with title, description, and optional primary CTA
- a masonry-like grid of service cards
- one card per service offer, each with icon, title, description, and CTA link

It is intended for Bulwar offer overviews, catering service summaries, event service listings, and similar editorial sections where services are presented as reusable cards rather than sourced from WooCommerce.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- sticky intro column on larger breakpoints
- card grid using the existing multi-column layout rhythm
- individual service cards preserved as separate items instead of being collapsed into one list paragraph

## Current Data Contract

### Top-Level Fields

- `title`
- `description`
- optional `primaryCta`
- `cards`

### `primaryCta` Structure

- `text`
- optional `href`

### `cards[]` Structure

Each card contains:

- `icon`
- `title`
- `description`
- `ctaText`
- `ctaHref`

## Safe AI-Editable Fields

Safe for structured content editing later:

- `title`
- `description`
- `primaryCta.text`
- `primaryCta.href`
- `cards[].icon`
- `cards[].title`
- `cards[].description`
- `cards[].ctaText`
- `cards[].ctaHref`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- sticky behavior
- column structure
- card shell styling
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
  "id": "our-services-01",
  "blockKey": "our-services",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "title": "Nasze uslugi",
    "description": "Od kameralnych kolacji po duze przyjecia firmowe, Bulwar przygotowuje format spotkania, menu i obsluge dopasowane do okazji.",
    "primaryCta": {
      "text": "Poznaj cala oferte",
      "href": "/oferta"
    },
    "cards": [
      {
        "icon": "celebration",
        "title": "PRZYJECIA OKOLICZNOSCIOWE",
        "description": "Kompletna oprawa rodzinnych uroczystosci z indywidualnym menu, obsluga sali i wsparciem organizacyjnym.",
        "ctaText": "Zobacz szczegoly",
        "ctaHref": "/przyjecia-okolicznosciowe"
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
  "id": "our-services-01",
  "blockKey": "our-services",
  "content": {
    "title": "Nasze uslugi",
    "description": "Od kameralnych kolacji po duze przyjecia firmowe...",
    "primaryCta": {
      "text": "Poznaj cala oferte",
      "href": "/oferta"
    },
    "cards": [
      {
        "icon": "celebration",
        "title": "PRZYJECIA OKOLICZNOSCIOWE",
        "description": "Kompletna oprawa rodzinnych uroczystosci.",
        "ctaText": "Zobacz szczegoly",
        "ctaHref": "/przyjecia-okolicznosciowe"
      }
    ]
  }
}
```

## Future Refinement

Future iterations may decide whether card-level CTAs should be constrained to internal routes only, but the MVP contract remains strictly content-only and keeps source resolution out of this block.