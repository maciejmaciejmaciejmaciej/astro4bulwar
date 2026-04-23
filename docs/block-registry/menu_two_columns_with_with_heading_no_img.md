# menu_two_columns_with_with_heading_no_img

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `PageBuilderMenuSection`
- current renderer path: `zip/src/components/sections/PageBuilderMenuSection.tsx`
- implementation status: runtime schema and zip pagebuilder registration are implemented

## Purpose

This block renders the Promo2 lower menu panel as a standalone page-builder section with a centered heading and divider line.

It is intended for cases where the page needs:

- the Promo2 lower menu-row typography
- a two-column menu layout
- the centered heading style used by TheMenuSection
- no image
- color styling selected via `section.variant`

## Geometry Rules

- `page-margin` section shell
- centered inner panel based on the Promo2 lower menu panel
- heading centered above the grid with a divider line
- two menu columns
- no media element

## Current Data Contract

### Top-Level Fields

- `title`
- `menuColumns`
- `emptyStateText`

### `menuColumns[]` Structure

Each column contains:

- `items[]`

Each item contains:

- `title`
- optional `description`
- `priceLabel`
- optional `tagSlugs[]`

## Supported Variants

- `white`
- `surface`
- `white-outlined`
- `inverted`

`section.variant = null` is also valid and falls back to the shared default presentation.

## Safe AI-Editable Fields

- `title` only when `source = null`; when `source` is set the runtime heading comes from the Woo category name
- `menuColumns[].items[].title` only when `source = null`
- `menuColumns[].items[].description` only when `source = null`
- `menuColumns[].items[].priceLabel` only when `source = null`
- `menuColumns[].items[].tagSlugs[]` only when `source = null`
- `emptyStateText`
- `section.variant`

## Restricted Fields

- outer layout geometry
- column count
- heading geometry
- row styling and typography system
- class-level styling

## Source Rule

This block supports Woo-driven menu sourcing in MVP.

- intended source: `sourceType: "woo_category"`
- `sourceValue` accepts either:
  - Woo category slug
  - Woo category id
- when `source` is set:
  - `title` resolves from the Woo category name
  - `menuColumns` resolve from WooCommerce Store API products in that category
  - the block keeps the fixed two-column split
  - manual `title` and `menuColumns` edits are fallback-only and must not be treated as the primary content contract
- when `source = null`:
  - `title` and `menuColumns` may be edited directly as static fallback content

## Example Render Payload

```json
{
  "id": "menu-two-columns-heading-01",
  "blockKey": "menu_two_columns_with_with_heading_no_img",
  "blockVersion": 1,
  "variant": "white-outlined",
  "enabled": true,
  "data": {
    "title": "The Menu",
    "menuColumns": [
      {
        "items": [
          {
            "title": "Spring asparagus",
            "description": "Brown butter, hazelnut",
            "priceLabel": "42 zl"
          }
        ]
      },
      {
        "items": [
          {
            "title": "Burnt cheesecake",
            "description": "Cherry, vanilla",
            "priceLabel": "28 zl"
          }
        ]
      }
    ],
    "emptyStateText": "Brak pozycji w tej kategorii."
  },
  "source": {
    "sourceType": "woo_category",
    "sourceValue": "kolacje",
    "options": {
      "limit": 6
    }
  },
  "meta": {}
}
```