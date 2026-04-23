# menu_two_columns_with_no_heading_no_img

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `PageBuilderMenuSection`
- current renderer path: `zip/src/components/sections/PageBuilderMenuSection.tsx`
- implementation status: runtime schema and zip pagebuilder registration are implemented

## Purpose

This block renders only the lower menu panel from Promo2 as a standalone page-builder section.

It is intended for cases where the page needs:

- the Promo2 lower menu-row typography
- a two-column menu layout
- no image
- no editorial story header
- color styling selected via `section.variant`

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- centered inner panel based on the Promo2 lower menu panel
- two menu columns
- no section heading
- no media element

## Current Data Contract

### Top-Level Fields

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

- `menuColumns[].items[].title` only when `source = null`
- `menuColumns[].items[].description` only when `source = null`
- `menuColumns[].items[].priceLabel` only when `source = null`
- `menuColumns[].items[].tagSlugs[]` only when `source = null`
- `emptyStateText`
- `section.variant`

## Restricted Fields

- outer layout geometry
- column count
- row styling and typography system
- class-level styling

## Source Rule

This block supports Woo-driven menu sourcing in MVP.

- intended source: `sourceType: "woo_category"`
- `sourceValue` accepts either:
  - Woo category slug
  - Woo category id
- when `source` is set:
  - `menuColumns` are runtime-resolved from WooCommerce Store API products in that category
  - the block keeps the fixed two-column split
  - manual `menuColumns` edits are fallback-only and must not be treated as the primary content contract
- when `source = null`:
  - `menuColumns` may be edited directly as static fallback content

## Example Render Payload

```json
{
  "id": "menu-two-columns-01",
  "blockKey": "menu_two_columns_with_no_heading_no_img",
  "blockVersion": 1,
  "variant": "surface",
  "enabled": true,
  "data": {
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
    "sourceValue": "lunche",
    "options": {
      "limit": 6
    }
  },
  "meta": {}
}
```