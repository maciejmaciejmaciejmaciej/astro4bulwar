# regional_cuisine

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `RegionalCuisine`
- current renderer path: `zip/src/components/sections/RegionalCuisine.tsx`
- astro renderer path: `astro-site/src/components/RegionalCuisineSection.astro`

## Purpose

This block renders an editorial cuisine section with:

- multi-line title
- lead paragraph
- action cards with links
- featured image offset on desktop and inline on mobile

## Current Data Contract

- `titleLines[]`
- `description`
- `actions[]`
- `image`

Each action contains:

- `icon`
- `titleLines[]`
- `description`
- `href`
- `linkLabel`

Allowed action icon keys:

- `heart`
- `conciergeBell`

## Safe AI-Editable Fields

- `titleLines[]`
- `description`
- `actions[].icon`
- `actions[].titleLines[]`
- `actions[].description`
- `actions[].href`
- `actions[].linkLabel`
- `image.src`
- `image.alt`

## Restricted Fields

- desktop image overflow geometry
- text/image column relationship
- class-level styling

## Source Rule

This block is content-only in MVP.

- `source = null`
