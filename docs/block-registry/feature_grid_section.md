# feature_grid_section

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `FeatureGridSection`
- current renderer path: `zip/src/components/sections/FeatureGridSection.tsx`
- astro renderer path: `astro-site/src/components/FeatureGridSection.astro`

## Purpose

This block renders a simple feature grid with four or more editorial cards.

## Current Data Contract

- `items[]`

Each item contains:

- `icon`
- `title`
- `description`

Allowed icon keys:

- `globe`
- `rocket`
- `expand`
- `wrench`

## Safe AI-Editable Fields

- `items[].icon`
- `items[].title`
- `items[].description`

## Restricted Fields

- column count rules
- border grid shell
- icon rendering implementation

## Source Rule

This block is content-only in MVP.

- `source = null`
