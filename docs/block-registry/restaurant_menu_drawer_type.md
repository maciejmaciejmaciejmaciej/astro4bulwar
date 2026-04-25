# restaurant_menu_drawer_type

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `PageBuilderRestaurantMenuDrawerTypeSection`
- current renderer path: `zip/src/components/sections/PageBuilderRestaurantMenuDrawerTypeSection.tsx`
- implementation status: runtime schema and zip pagebuilder registration are implemented
- Astro readiness: ready; Astro renderer is registered and exercised by a dedicated validation route
- Astro renderer path: `astro-site/src/components/RestaurantMenuDrawerTypeSection.astro`

## Purpose

This block turns the standalone RestaurantMenuDrawerType section into a formal reusable page-builder block.

It is intended for cases where the page needs:

- a sticky descriptive intro column with heading, description, optional CTA, and optional intro image
- a repeatable grid of collection boxes
- a side drawer that always repeats the block-level intro copy at the top
- drawer sections sourced from ordered WooCommerce category ids attached to the clicked collection

## Geometry Rules

- `page-margin` section shell
- sticky descriptive intro column on larger breakpoints
- repeatable collection-card grid in the right column
- no empty visual placeholder when the intro image or collection image is missing
- drawer opens from the right and keeps the existing standalone visual treatment

## Current Data Contract

### Top-Level Fields

- `intro`
- `collections`

### `intro` Structure

- `heading`
- `description`
- `buttonLabel`
- `buttonTarget`
- `imageUrl`
- `imageAlt`

Rendering rules:

- if `buttonTarget` is empty, the CTA button is not rendered
- if `imageUrl` is empty, the intro image is not rendered

### `collections[]` Structure

Each collection contains:

- optional `visualUrl`
- `collectionTitle`
- `collectionDescription`
- `buttonLabel`
- `wooCategoryIds[]`

Rendering rules:

- `collections[]` is the repeatable part of the schema
- all collection fields are required except `visualUrl`
- if `visualUrl` is empty or missing, the card renders without a visual area and without empty spacing
- clicking the whole card opens the drawer

## Drawer Resolution Rule

This block is direct-edit for structure but Woo-backed inside each collection.

- `source = null`
- the drawer reads `collections[].wooCategoryIds[]` from the clicked collection
- each Woo category id resolves to one drawer section
- drawer sections appear in the exact order of the ids in `wooCategoryIds[]`
- each resolved drawer section renders:
  - Woo category name as the section heading
  - Woo products from that category below it
- the drawer heading and description always come from `intro.heading` and `intro.description`, not from the clicked collection card

## Safe AI-Editable Fields

- `intro.heading`
- `intro.description`
- `intro.buttonLabel`
- `intro.buttonTarget`
- `intro.imageUrl`
- `intro.imageAlt`
- `collections[].visualUrl`
- `collections[].collectionTitle`
- `collections[].collectionDescription`
- `collections[].buttonLabel`
- `collections[].wooCategoryIds[]`

## Restricted Fields

- outer layout geometry
- sticky intro behavior
- drawer animation and shell styling
- card grid rhythm
- class-level styling

## Source Rule

This block does not use the page-builder `section.source` field in MVP.

- keep `source = null`
- the only Woo binding lives in `collections[].wooCategoryIds[]`
- changing the listed products means changing the category ids or editing the WooCommerce products in those categories

## Example Render Payload

```json
{
  "id": "restaurant-menu-drawer-01",
  "blockKey": "restaurant_menu_drawer_type",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "intro": {
      "heading": "Our Services",
      "description": "Curated collections that open into WooCommerce-powered drawers.",
      "buttonLabel": "View all services",
      "buttonTarget": "/oferta",
      "imageUrl": "/react/images/about_front.jpg",
      "imageAlt": "Restaurant interior"
    },
    "collections": [
      {
        "visualUrl": "/react/images/about_front.jpg",
        "collectionTitle": "TASTING MENU",
        "collectionDescription": "Seasonal tasting collections.",
        "buttonLabel": "Open tasting menu",
        "wooCategoryIds": [84, 85, 86]
      }
    ]
  },
  "source": null,
  "meta": {}
}
```

## Astro Notes

Astro mirrors the approved direct-edit contract and keeps Woo resolution inside each clicked collection.

- the intro CTA stays hidden when `buttonTarget` is empty
- the intro image stays hidden when `imageUrl` is empty
- collection visuals are optional and disappear without placeholder spacing
- the drawer header always uses `intro.heading` and `intro.description`
- the Astro drawer resolves Woo categories client-side in the listed `wooCategoryIds[]` order
- the dedicated Astro validation route renders this block through `PageBuilderSection.astro`