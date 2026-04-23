# simple_heading_and_paragraph

## Status

- registry status: implemented
- block version: 1
- current renderer mapping: `SimpleHeadingAndParagraph`
- current renderer path: `zip/src/components/sections/SimpleHeadingAndParagraph.tsx`
- implementation status: runtime schema, AI schema descriptor, TemplatePage preview, and focused registry tests are implemented

## Purpose

This block renders a simplified editorial header derived from the left side of `Project10`.

It keeps:

- one eyebrow label
- one large editorial title
- one darker divider line under the header shell
- one direct-edit rich-text HTML body below the divider

It removes:

- the right-side metadata column
- the CTA area
- the hero image
- the repeatable story rows

## Geometry Rules

The following structure is part of the block identity and must not be changed during styling adaptation without explicit approval:

- `page-margin` section shell
- single-column header stack derived from the left side of `Project10`
- darker divider line under the header
- one rich-text content column below the divider
- existing while-in-view motion behavior

## Current Data Contract

### Top-Level Fields

- `eyebrow`
- `title`
- `richTextHtml`

## Supported Rich-Text Tags

The rendered HTML body supports this allowlist only:

- `strong`
- `b`
- `em`
- `i`
- `u`
- `p`
- `br`
- `ul`
- `ol`
- `li`

Other tags and attributes should be treated as unsupported and must not be relied on in page schema.

## Source Rule

This block is direct-edit only in MVP.

- `source = null`

## Safe AI-Editable Fields

- `eyebrow`
- `title`
- `richTextHtml`

## Restricted Fields

Do not let AI change these by default:

- outer layout geometry
- divider styling
- motion behavior
- typography classes and spacing rhythm

## Example Render Payload

```json
{
  "id": "simple-heading-01",
  "blockKey": "simple_heading_and_paragraph",
  "blockVersion": 1,
  "variant": null,
  "enabled": true,
  "data": {
    "eyebrow": "Polityka prywatności",
    "title": "Jak przetwarzamy dane osobowe",
    "richTextHtml": "<p><strong>Administrator danych</strong> przetwarza dane osobowe zgodnie z obowiazujacymi przepisami.</p><ul><li>kontakt telefoniczny i mailowy</li><li>realizacja zamowien</li></ul>"
  },
  "source": null,
  "meta": {}
}
```