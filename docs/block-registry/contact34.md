# contact34

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `Contact34Section`
- current renderer path: `zip/src/components/sections/Contact34Section.tsx`
- astro renderer path: `astro-site/src/components/Contact34Section.astro`

## Purpose

This block renders a split contact section with:

- tagline and title
- editorial image
- contact info panel
- static form copy

## Current Data Contract

- `tagline`
- `title`
- `image`
- `contactItems[]`
- `form`

Each contact item contains:

- `label`
- `value`
- optional `href`

The form object contains:

- `nameLabel`
- `namePlaceholder`
- `emailLabel`
- `emailPlaceholder`
- `messageLabel`
- `messagePlaceholder`
- `submitLabel`

## Safe AI-Editable Fields

- `tagline`
- `title`
- `image.src`
- `image.alt`
- `contactItems[].label`
- `contactItems[].value`
- `contactItems[].href`
- `form.nameLabel`
- `form.namePlaceholder`
- `form.emailLabel`
- `form.emailPlaceholder`
- `form.messageLabel`
- `form.messagePlaceholder`
- `form.submitLabel`

## Restricted Fields

- form field structure
- image/contact column split
- card shell styling

## Source Rule

This block is content-only in MVP.

- `source = null`
