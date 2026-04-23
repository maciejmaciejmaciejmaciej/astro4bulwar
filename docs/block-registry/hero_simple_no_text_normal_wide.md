# hero_simple_no_text_normal_wide

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `HeroSimpleNoTextNormalWide`
- current renderer path: `zip/src/components/sections/hero_simple_no_text_normal_wide.tsx`
- implementation status: runtime schema, AI schema descriptor, and TemplatePage preview are implemented

## Purpose

This block renders the existing normal wide hero variant as a direct-edit page-builder block.

It keeps:

- one wide hero image inside the current rounded shell
- the existing `page-margin` outer spacing
- the thin divider line under the image

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- wide rounded image wrapper
- lower divider line centered under the image

## Current Data Contract

### Top-Level Fields

- `imageSrc`
- `alt`

## Source Rule

This block is direct-edit only in MVP.

- `source = null`

## Safe AI-Editable Fields

- `imageSrc`
- `alt`

## Restricted Fields

Do not let AI change these by default:

- outer spacing rhythm
- aspect ratio behavior
- divider placement
- rounded frame styling

## Example Render Payload

```json
{
  "id": "hero-wide-01",
  "blockKey": "hero_simple_no_text_normal_wide",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "imageSrc": "/react/images/home_hero.jpg",
    "alt": "Hero preview wide"
  },
  "source": null,
  "meta": {}
}
```