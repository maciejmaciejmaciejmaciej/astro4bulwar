# universal_header_block_1

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Project5c`
- current renderer path: `zip/src/components/sections/Project5c.tsx`
- implementation status: runtime schema, AI schema descriptor, TemplatePage preview, and focused registry tests are implemented

## Purpose

This block renders an editorial header/gallery section with:

- one lead intro column with eyebrow, title, and description
- one direct-edit list of linked rows
- one primary wide image and one supporting image
- one lower detail band with its own title and body copy

It is intended for section intros, menu landing headers, and branded editorial blocks where every visible field should remain direct-edit in the page schema.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- current Project5c header split
- right-side stacked list panel
- two-image composition below the header
- lower border-top detail section
- existing motion timing and reveal sequence

## Current Data Contract

### Top-Level Fields

- `eyebrow`
- `title`
- `description`
- `links`
- `gallery`
- `detailSection`

### `links[]` Structure

- `label`
- `href`

### `gallery` Structure

- `primaryImage.src`
- `primaryImage.alt`
- `secondaryImage.src`
- `secondaryImage.alt`

### `detailSection` Structure

- `title`
- `body`

## Safe AI-Editable Fields

- `eyebrow`
- `title`
- `description`
- `links[].label`
- `links[].href`
- `gallery.primaryImage.src`
- `gallery.primaryImage.alt`
- `gallery.secondaryImage.src`
- `gallery.secondaryImage.alt`
- `detailSection.title`
- `detailSection.body`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- image ratio assumptions
- motion choreography
- list-row shell styling
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
  "id": "universal-header-1-01",
  "blockKey": "universal_header_block_1",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "eyebrow": "Kolekcja menu",
    "title": "Bulwar Degustation",
    "description": "Content-only header zachowujacy aktualny uklad redakcyjny.",
    "links": [
      {
        "label": "Menu glowne",
        "href": "/menu"
      }
    ],
    "gallery": {
      "primaryImage": {
        "src": "/react/images/home_hero.jpg",
        "alt": "Sala restauracji Bulwar"
      },
      "secondaryImage": {
        "src": "/react/images/about_1.jpg",
        "alt": "Detal stolikow i swiatla"
      }
    },
    "detailSection": {
      "title": "Nastroj",
      "body": "Dolna sekcja pozostaje bezposrednio edytowalna."
    }
  },
  "source": null,
  "meta": {}
}
```