# promo2

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Promo2`
- current renderer path: `zip/components/Promo2.tsx`
- implementation status: runtime schema, AI schema descriptor, and Woo category source resolution are implemented

## Purpose

This block renders a story-led promo section that stays visually aligned with the current promo/story block while adding a lower menu panel attached directly to the image.

It is intended for editorial homepage or landing-page moments where the page needs:

- the existing story header and team-or-crew credibility section
- one wide supporting image
- a lower menu panel that touches the image with no gap
- a menu list that can resolve from one specified WooCommerce category

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- the existing six-column story header and text split inherited from the current promo/story block
- one wide image below the story grid
- an attached lower rectangle directly below the image with the same width as the image
- no separate menu heading such as `THE SELECTION`
- image bottom corners must stay square so the menu panel reads as attached from below

## Current Data Contract

### Top-Level Fields

- `eyebrow`
- `title`
- `members`
- `story`
- `image`
- `menuColumns`
- `emptyStateText`

### `members[]` Structure

Each member contains:

- `icon`
- `name`
- `role`

Supported icon keys:

- `calendar-days`
- `utensils-crossed`

### `image` Structure

- `src`
- `alt`

### `menuColumns[]` Structure

Each column contains:

- `items[]`

Each menu item contains:

- `title`
- optional `description`
- `priceLabel`
- optional `tagSlugs[]`

## Safe AI-Editable Fields

Safe for structured content editing later:

- `eyebrow`
- `title`
- `members[].icon`
- `members[].name`
- `members[].role`
- `story`
- `image.src`
- `image.alt`
- `menuColumns[].items[].title` when the block has no Woo source
- `menuColumns[].items[].description` when the block has no Woo source
- `menuColumns[].items[].priceLabel` when the block has no Woo source
- `source.sourceValue` when the workflow intentionally changes the Woo category binding
- `emptyStateText`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- grid structure
- image-to-panel attachment behavior
- class-level styling
- resolved `menuColumns` when `source` is set to `woo_category`

## Source Rule

This block supports two safe modes in the current implementation:

- `source = null`
  - the menu panel stays content-only and uses `menuColumns` from page schema
- `source.sourceType = woo_category`
  - the top story content and image remain page-schema driven
  - the attached lower menu panel resolves products from the specified WooCommerce category slug or id

In Woo-driven mode, do not manually edit the resolved menu rows in page schema. Change the category binding or edit the underlying WooCommerce products instead.

## Visual Rules For The Menu Panel

- no heading text above the menu items
- menu titles and descriptions must remain normal case, not forced uppercase
- the panel must sit directly under the image with 0px gap
- the panel width must match the image width

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "promo2-01",
  "blockKey": "promo2",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "eyebrow": "Chef notes",
    "title": "Seasonal menu",
    "members": [
      {
        "icon": "calendar-days",
        "name": "Anna Example",
        "role": "Guest Experience Lead"
      }
    ],
    "story": "This version keeps the story layout and attaches a lower menu panel to the image.",
    "image": {
      "src": "/react/images/promo2.jpg",
      "alt": "Promo2 sample image"
    },
    "menuColumns": [],
    "emptyStateText": "Brak pozycji w tej kategorii."
  },
  "source": {
    "sourceType": "woo_category",
    "sourceValue": "sezonowa-karta",
    "options": {
      "limit": 6,
      "splitIntoColumns": 2
    }
  },
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "promo2-01",
  "blockKey": "promo2",
  "contentSource": "woo_category",
  "content": {
    "eyebrow": "Chef notes",
    "title": "Seasonal menu",
    "members": [
      {
        "icon": "calendar-days",
        "name": "Anna Example",
        "role": "Guest Experience Lead"
      }
    ],
    "story": "This version keeps the story layout and attaches a lower menu panel to the image.",
    "image": {
      "src": "/react/images/promo2.jpg",
      "alt": "Promo2 sample image"
    },
    "source": {
      "sourceType": "woo_category",
      "sourceValue": "sezonowa-karta",
      "options": {
        "limit": 6,
        "splitIntoColumns": 2
      }
    },
    "emptyStateText": "Brak pozycji w tej kategorii."
  }
}
```

## Editing Guidance

When `source = woo_category`:

- edit story copy and image through page schema
- change `source.sourceValue` only when switching to another Woo category
- edit dish titles, descriptions, and prices through WooCommerce, not by manually changing resolved menu rows