# about_2_simple

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `ModernInterior`
- current renderer path: `zip/src/components/sections/ModernInterior.tsx`
- implementation status: runtime schema, AI schema descriptor, and TemplatePage preview are implemented

## Purpose

This block renders the existing ModernInterior section from HomePage as a direct-edit page-builder block.

It keeps:

- one editorial heading and supporting paragraphs on the left
- one CTA button
- two layered interior images with the current parallax motion

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- two-column desktop composition
- left editorial copy stack
- right layered image composition with motion offsets

## Current Data Contract

### Top-Level Fields

- `title`
- `paragraphs`
- `buttonText`
- `buttonLink`
- `image1`
- `image2`

### `image1` And `image2`

- `src`
- `alt`

## Source Rule

This block is direct-edit only in MVP.

- `source = null`

## Safe AI-Editable Fields

- `title`
- `paragraphs[]`
- `buttonText`
- `buttonLink`
- `image1.src`
- `image1.alt`
- `image2.src`
- `image2.alt`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- parallax motion behavior
- image overlap proportions
- spacing rhythm and button styling

## Example Render Payload

```json
{
  "id": "about-2-simple-01",
  "blockKey": "about_2_simple",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "title": "O restauracji",
    "paragraphs": [
      "Od 2011 roku prowadzimy restauracje z autorska kuchnia.",
      "Z przyjemnoscia ugoscimy Panstwa na lunchu i kolacji."
    ],
    "buttonText": "CZYTAJ WIECEJ",
    "buttonLink": "/o-restauracji",
    "image1": {
      "src": "/react/images/about_1.jpg",
      "alt": "Wnetrze restauracji"
    },
    "image2": {
      "src": "/react/images/about_front.jpg",
      "alt": "Detale dekoracji"
    }
  },
  "source": null,
  "meta": {}
}
```