# testimonial7

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Testimonial7`
- current renderer path: `zip/src/components/sections/Testimonial7.tsx`
- astro renderer path: `astro-site/src/components/Testimonial7Section.astro`

## Purpose

This block renders a two-row testimonial section with:

- section badge
- title and description
- first testimonial row
- second testimonial row

## Current Data Contract

- `badge`
- `title`
- `description`
- `firstRow[]`
- `secondRow[]`

Each testimonial item contains:

- `name`
- `role`
- `avatar`
- `content`

## Safe AI-Editable Fields

- `badge`
- `title`
- `description`
- `firstRow[].name`
- `firstRow[].role`
- `firstRow[].avatar`
- `firstRow[].content`
- `secondRow[].name`
- `secondRow[].role`
- `secondRow[].avatar`
- `secondRow[].content`

## Restricted Fields

- marquee direction and motion rules
- card shell geometry
- row duplication logic

## Source Rule

This block is content-only in MVP.

- `source = null`
