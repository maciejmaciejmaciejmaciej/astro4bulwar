# offer_hero

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `OfferHeroSection`
- current renderer path: `zip/src/components/sections/OfferHeroSection.tsx`
- astro renderer path: `astro-site/src/components/OfferHeroSection.astro`

## Purpose

This block renders an editorial offer hero with:

- eyebrow and multi-line title
- lead paragraph
- list of key fact rows
- one main hero image
- secondary editorial copy with optional sale notice
- one or more supporting images

## Current Data Contract

- `eyebrow`
- `titleLines[]`
- `lead`
- `infoItems[]`
- `mainImage`
- `offerEyebrow`
- `offerTitleLines[]`
- `offerParagraphs[]`
- optional `saleNotice`
- `secondaryImages[]`

## Safe AI-Editable Fields

- `eyebrow`
- `titleLines[]`
- `lead`
- `infoItems[].label`
- `infoItems[].value`
- `infoItems[].note`
- `mainImage.src`
- `mainImage.alt`
- `offerEyebrow`
- `offerTitleLines[]`
- `offerParagraphs[]`
- `saleNotice`
- `secondaryImages[].src`
- `secondaryImages[].alt`

## Restricted Fields

- outer hero geometry
- image aspect ratios
- desktop/mobile column behavior
- class-level styling

## Source Rule

This block is content-only in MVP.

- `source = null`
