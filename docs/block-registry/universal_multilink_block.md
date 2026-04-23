# universal_multilink_block

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Feature18`
- current renderer path: `zip/src/components/sections/Feature18.tsx`
- implementation status: runtime schema, AI schema descriptor, TemplatePage preview, and focused registry tests are implemented

## Purpose

This block renders an editorial two-column feature section with:

- one fully editable left column
- one schema-driven collection of cards on the right
- one link CTA inside the left column
- one link CTA per card

It is intended for section-level navigation, menu overviews, offer maps, and other editorial layouts where the page schema must control both the lead column and the number of linked cards.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- current Feature18 background pattern and section shell
- left intro column on larger screens
- responsive right-side card grid
- one rectangular card shell per item
- existing uppercase typographic rhythm and CTA placement

## Current Data Contract

### Top-Level Fields

- `leftColumn`
- `cards`

### `leftColumn` Structure

- `title`
- `primaryCta.label`
- `primaryCta.href`

### `cards[]` Structure

Each card contains:

- `meta`
- `title`
- `description`
- `linkLabel`
- `linkHref`

## Safe AI-Editable Fields

- `leftColumn.title`
- `leftColumn.primaryCta.label`
- `leftColumn.primaryCta.href`
- `cards[].meta`
- `cards[].title`
- `cards[].description`
- `cards[].linkLabel`
- `cards[].linkHref`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- grid structure
- card shell styling
- section background treatment
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
  "id": "universal-multilink-01",
  "blockKey": "universal_multilink_block",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "leftColumn": {
      "title": "Karta menu",
      "primaryCta": {
        "label": "Sprawdz cala karte",
        "href": "/menu"
      }
    },
    "cards": [
      {
        "meta": "08:00 - 12:00",
        "title": "Sniadania",
        "description": "Pozycje poranne z sezonowymi dodatkami.",
        "linkLabel": "Zobacz wiecej",
        "linkHref": "/sniadania"
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
  "id": "universal-multilink-01",
  "blockKey": "universal_multilink_block",
  "content": {
    "leftColumn": {
      "title": "Karta menu",
      "primaryCta": {
        "label": "Sprawdz cala karte",
        "href": "/menu"
      }
    },
    "cards": [
      {
        "meta": "08:00 - 12:00",
        "title": "Sniadania",
        "description": "Pozycje poranne z sezonowymi dodatkami.",
        "linkLabel": "Zobacz wiecej",
        "linkHref": "/sniadania"
      }
    ]
  }
}
```