# menu_two_columns_with_with_heading_with_img_fullwidth_paralax

## Status

- registry status: approved seed
- block version: 1
- current renderer mapping: `MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection`
- current renderer path: `zip/src/components/sections/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.tsx`

## Purpose

This block combines two existing approved patterns into one reusable category menu section:

- a full-width parallax hero image
- a centered heading rendered over that image
- an attached lower shared menu panel rendered directly below the hero
- a fixed two-column menu layout in the lower panel

It is intended for WooCommerce-driven menu categories where the category name should become the hero heading and the category products should feed the lower menu panel.

## Composition Rule

This block is intentionally derived from:

- `menu-category-photo-parallax-full-width` for the full-width parallax hero shell
- `menu_two_columns_with_no_heading_no_img` for the lower menu panel treatment

Everything below the image from the older parallax block concept is replaced by the shared standalone menu panel style.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- full-width parallax hero image shell
- centered hero heading over image
- attached lower menu panel immediately below the image
- lower panel uses the shared PageBuilderMenuSection visual system
- lower panel stays fixed at two columns
- lower panel does not render its own extra heading

## Current Data Contract

### Top-Level Fields

- `heroTitle`
- `backgroundImage`
- `overlayOpacity`
- `layout`
- `menuColumns`
- `emptyStateText`

### backgroundImage Structure

- `src`
- `alt`

### layout Structure

- `heroHeight`

### menuColumns Structure

Each item in `menuColumns[]` contains:

- `items[]`

Each item in `items[]` contains:

- `title`
- optional `description`
- `priceLabel`
- optional `tagSlugs[]`

## Variant Rule

The lower menu panel inherits approved shared variants through `section.variant`.

Approved variants:

- `white`
- `surface`
- `white-outlined`
- `inverted`

These variants affect only the lower attached panel, not the hero image.

## Woo Source Rule

This block supports only one external source mode:

- source type: `woo_category`
- source value: Woo category slug or Woo category id

In that mode:

- `heroTitle` should resolve from the Woo category name
- `backgroundImage` remains explicit block data and is not fetched from WooCommerce
- `menuColumns` should resolve from products assigned to that category
- the lower menu panel remains fixed at two columns

## Safe AI-Editable Fields

Safe for structured content editing later:

- `backgroundImage.src`
- `backgroundImage.alt`
- `emptyStateText`
- `source.sourceValue`
- `section.variant`

When this block is powered by `woo_category`, the hero title and menu item list should normally come from WooCommerce rather than manual text edits.

## Restricted Fields

Do not let AI change these by default:

- `menuColumns` when `source` is set
- `heroTitle` when `source` is set
- `layout.heroHeight`
- `overlayOpacity`
- outer geometry
- width model
- column model

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "menu-kolacje-01",
  "blockKey": "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
  "blockVersion": 1,
  "variant": "surface",
  "enabled": true,
  "data": {
    "heroTitle": "Kolacje",
    "backgroundImage": {
      "src": "/images/kolacje-hero.jpg",
      "alt": "Kolacje w Bulwarze"
    },
    "overlayOpacity": 0.2,
    "layout": {
      "heroHeight": "400px"
    },
    "menuColumns": [
      {
        "items": [
          {
            "title": "Stek z kalafiora",
            "description": "Masło z tymiankiem",
            "priceLabel": "42 zł"
          }
        ]
      },
      {
        "items": [
          {
            "title": "Pstrąg wędzony",
            "description": "Ogórek, kremowy sos",
            "priceLabel": "44 zł"
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
      "limit": 8,
      "includeOutOfStock": false
    }
  },
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "menu-kolacje-01",
  "blockKey": "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
  "content": {
    "backgroundImage": {
      "src": "/images/kolacje-hero.jpg",
      "alt": "Kolacje w Bulwarze"
    },
    "source": {
      "sourceType": "woo_category",
      "sourceValue": "kolacje",
      "options": {
        "limit": 8,
        "includeOutOfStock": false
      }
    },
    "emptyStateText": "Brak pozycji w tej kategorii.",
    "variant": "surface"
  }
}
```