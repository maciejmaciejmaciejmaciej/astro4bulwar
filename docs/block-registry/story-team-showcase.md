# story-team-showcase

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `PROMOCJA_sezonowa`
- current renderer path: `zip/components/PROMOCJA_sezonowa.tsx`
- implementation status: runtime schema, AI schema descriptor, and homepage pagebuilder integration are implemented

## Purpose

This block renders a bottom-of-page editorial brand section with:

- a large section title in the existing six-column shell
- a small uppercase eyebrow label
- a short list of team or crew highlight rows with icon, name, and role
- a narrative story paragraph
- one wide supporting image

It is intended for homepage credibility sections, founder-story sections, team-introduction blocks, and similar editorial moments where the page needs both a brief narrative and a compact human face to the brand.

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- top title row inside the six-column grid
- left-side stacked team rows on larger breakpoints
- right-side narrative copy block aligned with the current column rhythm
- full-width image anchored below the text grid

## Current Data Contract

### Top-Level Fields

- `eyebrow`
- `title`
- `members`
- `story`
- `image`

### `members[]` Structure

Each member contains:

- `icon`
- `name`
- `role`

Current supported icon keys:

- `calendar-days`
- `utensils-crossed`

### `image` Structure

- `src`
- `alt`

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

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- grid structure
- team-row shell styling
- spacing rhythm
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
  "id": "story-team-showcase-01",
  "blockKey": "story-team-showcase",
  "blockVersion": 1,
  "enabled": true,
  "data": {
    "eyebrow": "Our Crew, Our story",
    "title": "Our story",
    "members": [
      {
        "icon": "calendar-days",
        "name": "John Doe1",
        "role": "Creative Director1"
      },
      {
        "icon": "utensils-crossed",
        "name": "John Doe2",
        "role": "Creative Director2"
      }
    ],
    "story": "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the drive to bring meaningful ideas to life.",
    "image": {
      "src": "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png",
      "alt": "about us image"
    }
  },
  "source": null,
  "meta": {}
}
```

## Example AI Payload Fragment

```json
{
  "id": "story-team-showcase-01",
  "blockKey": "story-team-showcase",
  "content": {
    "eyebrow": "Our Crew, Our story",
    "title": "Our story",
    "members": [
      {
        "icon": "calendar-days",
        "name": "John Doe1",
        "role": "Creative Director1"
      }
    ],
    "story": "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect.",
    "image": {
      "src": "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png",
      "alt": "about us image"
    }
  }
}
```

## Future Refinement

Future passes can decide whether this block should accept a richer icon set or optional CTA, but the current MVP contract keeps it intentionally narrow so the homepage section stays stable and page-builder-safe.