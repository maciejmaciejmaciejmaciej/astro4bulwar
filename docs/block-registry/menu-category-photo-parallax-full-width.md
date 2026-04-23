# menu-category-photo-parallax-full-width

## Status

- registry status: seed
- block version: 1
- current renderer mapping: `BreakfastSection`
- current renderer path: `zip/src/components/sections/BreakfastSection.tsx`

## Purpose

This block renders a menu-category section with:

- a full-width parallax hero image
- a large uppercase section title over the image
- a contained menu list body inside the standard page side rhythm
- a desktop two-column menu layout

It is intended for category-style food sections such as breakfast, lunch, seasonal menus, or event menus.

## Why This Is The First Seed Block

This block already has a reusable prop interface in code and a stable visual shape.

It is therefore a good first registry entry because it already exposes a recognizable business pattern rather than a raw primitive.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- full-width hero image shell
- centered hero title over image
- separate contained menu body below the hero
- page-margin outer rhythm
- `max-w-5xl mx-auto` content shell
- desktop two-column menu list

## Current Data Contract

### Top-Level Fields

- `heroTitle`
- `backgroundImage`
- `overlayOpacity`
- `layout`
- `menuColumns`
- optional `menuAnchorId`
- `emptyStateText`

### backgroundImage Structure

- `src`
- `alt`

### layout Structure

- `columns`
- `heroHeight`

### menuColumns Structure

Each item in `menuColumns[]` contains:

- `items[]`

Each item in `items[]` contains:

- `title`
- optional `description`
- `priceLabel`
- optional `tagSlugs[]`

## Woo Source Rule

For real Woo-driven rendering, the simplest supported model is:

- source type: `woo_category`
- source value: Woo category slug or Woo category id

Also supported in the current code-side schema:

- source type: `woo_products`
- source value: ordered Woo product id array

In that mode:

- the heading should resolve from the Woo category name
- the parallax image remains a separate explicit image field in block data
- the product list should resolve from products assigned to that category

Direct `woo_products` support may still exist, but the preferred business mode for this block is category-driven rendering.

## Safe AI-Editable Fields

Safe for structured content editing later:

- `heroTitle`
- `backgroundImage.src`
- `backgroundImage.alt`
- `emptyStateText`
- `menuColumns[].items[].title`
- `menuColumns[].items[].description`
- `menuColumns[].items[].priceLabel`
- `menuColumns[].items[].tagSlugs[]`
- `source.sourceValue` when the workflow intentionally changes the Woo source

## Restricted Fields

Do not let AI change these by default:

- `layout.heroHeight`
- `overlayOpacity`
- outer geometry
- width model
- column model

When the block is powered by `woo_category`, the heading and product list should normally come from Woo rather than free text edits.

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "menu-breakfast-01",
  "blockKey": "menu-category-photo-parallax-full-width",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "heroTitle": "Śniadania",
    "backgroundImage": {
      "src": "/images/sniadania-hero.jpg",
      "alt": "Śniadaniowe menu Bulwar"
    },
    "overlayOpacity": 0.2,
    "layout": {
      "columns": 2,
      "heroHeight": "400px"
    },
    "menuColumns": [
      {
        "items": [
          {
            "title": "Jajecznica z boczkiem",
            "description": "Pieczywo i sałata",
            "priceLabel": "29 zł",
            "tagSlugs": ["vege"]
          }
        ]
      },
      {
        "items": [
          {
            "title": "Tosty francuskie",
            "description": "Owoce sezonowe",
            "priceLabel": "27 zł"
          }
        ]
      }
    ],
    "emptyStateText": "Brak pozycji w tej kategorii."
  },
  "source": null,
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "menu-breakfast-01",
  "blockKey": "menu-category-photo-parallax-full-width",
  "content": {
    "heroTitle": "Śniadania",
    "backgroundImage": {
      "src": "/images/sniadania-hero.jpg",
      "alt": "Śniadaniowe menu Bulwar"
    },
    "menuColumns": [
      {
        "items": [
          {
            "title": "Jajecznica z boczkiem",
            "description": "Pieczywo i sałata",
            "priceLabel": "29 zł",
            "tagSlugs": ["vege"]
          }
        ]
      }
    ],
    "emptyStateText": "Brak pozycji w tej kategorii."
  }
}
```

## Next Required Refinement

Before this block should be treated as fully approved for production composition, the next pass should:

- keep demo defaults as filler content for static and preview mode, but treat Woo-driven category mode as the real data path for production use
- decide whether `woo_products` should remain a secondary source mode or whether `woo_category` should become the only recommended source mode
- decide whether additional product metadata beyond tags should be exposed in the contract
- validate the block against TemplatePage in a dedicated refinement workflow
