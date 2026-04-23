# oferta_posts_section

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `OfertaSection`
- current renderer path: `zip/src/components/sections/OfertaSection.tsx`
- implementation status: runtime schema, AI schema descriptor, WordPress post source resolution, and TemplatePage preview are implemented

## Purpose

This block renders the existing OfertaSection layout as a reusable page-builder block.

Its intended production mode is an ordered list of WordPress post ids stored in `source.sourceValue`.

Each row resolves from the referenced post using:

- featured image for the row image
- post title for the row title
- post excerpt for the row text
- custom field `offer_url_link` for the button href

The CTA label is fixed by design and is always `Zobacz więcej`.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- top heading aligned to the current OfertaSection design
- one divider line above the row collection
- one row per offer with a four-column desktop grid
- left image, middle copy, right outline CTA
- one divider line below each row

## Current Data Contract

### Top-Level Fields

- `title`
- `items`

### `items[]` Structure

Each item contains:

- `image.src`
- `image.alt`
- `title`
- `description`
- `link.href`

The button label is not part of block data because it is fixed in the renderer.

## Source Rule

This block supports one production source mode:

- source type: `wordpress_posts`
- source value: ordered array of WordPress post ids

Example:

```json
{
  "sourceType": "wordpress_posts",
  "sourceValue": [912, 401, 388],
  "options": {}
}
```

The order of `source.sourceValue` is preserved in the rendered rows.

## WordPress Field Mapping

For each referenced post, the resolver maps:

- image: `_embedded["wp:featuredmedia"][0].source_url`
- image alt: `_embedded["wp:featuredmedia"][0].alt_text`
- title: `title.rendered`
- description: `excerpt.rendered`
- button link: `offer_url_link`

Supported `offer_url_link` shapes:

- top-level `offer_url_link`
- `meta.offer_url_link`
- `acf.offer_url_link`

If `offer_url_link` is missing, the resolver falls back to the post permalink `link` so the CTA still points to a meaningful destination.

If a featured image is missing, the resolver keeps the existing fallback image from block data for resilience, but the intended production path is to provide a featured image on every referenced post.

## Fallback Rule

When `source = null`, the block stays content-only and renders the manual rows in `data.items`.

This is the intended path for:

- local preview
- default seed content
- TemplatePage visual verification

Production page instances should prefer `source.sourceValue` with WordPress post ids.

## Safe AI-Editable Fields

When `source = wordpress_posts`:

- `title`
- `source.sourceValue`

When `source = null`:

- `title`
- `items[].image.src`
- `items[].image.alt`
- `items[].title`
- `items[].description`
- `items[].link.href`

## Restricted Fields

Do not let AI change these by default:

- fixed CTA text `Zobacz więcej`
- row geometry
- grid structure
- divider treatment
- resolved `items` when `source` is set

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "oferta-posts-01",
  "blockKey": "oferta_posts_section",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "title": "Nasza Oferta",
    "items": [
      {
        "image": {
          "src": "/react/images/oferta-fallback.jpg",
          "alt": "Oferta fallback"
        },
        "title": "Catering dla firm",
        "description": "Fallback preview content used when source is null.",
        "link": {
          "href": "/oferta/catering-dla-firm"
        }
      }
    ]
  },
  "source": {
    "sourceType": "wordpress_posts",
    "sourceValue": [912, 401, 388],
    "options": {}
  },
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "oferta-posts-01",
  "blockKey": "oferta_posts_section",
  "contentSource": "wordpress_posts",
  "content": {
    "title": "Nasza Oferta",
    "source": {
      "sourceType": "wordpress_posts",
      "sourceValue": [912, 401, 388],
      "options": {}
    }
  }
}
```