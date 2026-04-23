# block_download

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `OccasionalMenuPdfDownloadSection`
- current renderer path: `zip/src/components/sections/OccasionalMenuPdfDownloadSection.tsx`
- implementation status: runtime schema, AI schema descriptor, and TemplatePage preview are implemented

## Purpose

This block renders the existing PDF download section as a direct-edit page-builder block.

It keeps:

- the editorial left intro with title and subtitle
- the feature list with icons
- the right-side card with version label, file meta, primary CTA, secondary CTA, and helper text

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` outer section shell
- contained `max-w-screen-2xl` card shell
- left editorial copy and feature stack
- right PDF card with rounded surface treatment
- one primary CTA followed by one secondary text CTA and helper text

## Current Data Contract

### Top-Level Fields

- `title`
- `subtitle`
- `primaryCta`
- `secondaryCta`
- `helperText`
- `versionLabel`
- `fileMeta`
- `panelCaption`
- `features`

### `primaryCta` And `secondaryCta`

- `label`
- `href`

### `features[]`

- `icon`
- `title`

Allowed `icon` values:

- `groups`
- `quality`
- `format`
- `events`

## Source Rule

This block is direct-edit only in MVP.

- `source = null`

## Safe AI-Editable Fields

- `title`
- `subtitle`
- `primaryCta.label`
- `primaryCta.href`
- `secondaryCta.label`
- `secondaryCta.href`
- `helperText`
- `versionLabel`
- `fileMeta`
- `panelCaption`
- `features[].icon`
- `features[].title`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- card shell styling
- feature icon container treatment
- overall two-column composition

## Design References

This block must follow:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`
- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Example Render Payload

```json
{
  "id": "block-download-01",
  "blockKey": "block_download",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "title": "Pakiet bankietowy",
    "subtitle": "Pobierz wersje PDF przygotowana dla eventow premium.",
    "primaryCta": {
      "label": "Pobierz pakiet",
      "href": "/pdf/premium.pdf"
    },
    "secondaryCta": {
      "label": "Zobacz online",
      "href": "/menu-okolicznosciowe-premium"
    },
    "helperText": "PDF gotowy do wysylki klientom",
    "versionLabel": "PDF PRO",
    "fileMeta": "4.1 MB",
    "panelCaption": "Rozszerzona oferta dla wydarzen premium",
    "features": [
      {
        "icon": "events",
        "title": "Rozbudowane propozycje dla gali i jubileuszy"
      }
    ]
  },
  "source": null,
  "meta": {}
}
```