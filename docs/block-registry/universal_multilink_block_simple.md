# universal_multilink_block_simple

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Feature18Simple`
- current renderer path: `zip/src/components/sections/Feature18.tsx`
- implementation status: runtime schema, AI schema descriptor, focused React coverage, and Astro validation route are implemented

## Purpose

This block renders a sibling version of `universal_multilink_block` with:

- one fully editable left column title
- one optional CTA under the heading that renders only when `leftColumn.primaryCta.href` is provided
- one schema-driven collection of simplified linked cards
- one learn-more style link CTA per card

It is intended for concise navigation surfaces where the cards should remain lightweight and avoid per-card metadata or body copy.

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
- `primaryCta.href` optional

### `cards[]` Structure

Each card contains:

- `title`
- `linkLabel`
- `linkHref`

## Safe AI-Editable Fields

- `leftColumn.title`
- `leftColumn.primaryCta.label`
- `leftColumn.primaryCta.href`
- `cards[].title`
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
  "id": "universal-multilink-simple-01",
  "blockKey": "universal_multilink_block_simple",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "leftColumn": {
      "title": "Szybkie linki",
      "primaryCta": {
        "label": "Dowiedz sie wiecej"
      }
    },
    "cards": [
      {
        "title": "Lunch dnia",
        "linkLabel": "Learn more",
        "linkHref": "/menu#lunch-dnia"
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
  "id": "universal-multilink-simple-01",
  "blockKey": "universal_multilink_block_simple",
  "content": {
    "leftColumn": {
      "title": "Szybkie linki",
      "primaryCta": {
        "label": "Dowiedz sie wiecej"
      }
    },
    "cards": [
      {
        "title": "Lunch dnia",
        "linkLabel": "Learn more",
        "linkHref": "/menu#lunch-dnia"
      }
    ]
  }
}
```