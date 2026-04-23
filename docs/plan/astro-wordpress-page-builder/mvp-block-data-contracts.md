# MVP Block Data Contracts

## Purpose

This document defines the first concrete block-level data contracts for the Astro + WordPress page-builder system.

These contracts are based on blocks that already exist visually in the current frontend and already have schema definitions in code.

The goal is to stop speaking abstractly and describe real blocks that map to real components.

This document should stay aligned with the current code-side schemas and renderer adapters.

## Scope

This document currently defines all three MVP blocks used by planning and registry documentation.

- `about-1`
- `gallery-masonry-style1`
- `menu-category-photo-parallax-full-width`

`about-1` now has a locked documentation-level contract and registry mapping, but still needs code-side schema and runtime implementation.

## Contract Conventions

- `data` means the block-local content payload stored inside the page schema.
- `source` means an optional external data reference, typically WooCommerce.
- The block registry owns validation.
- The page schema stores the validated instance.

## 1. `gallery-masonry-style1`

### Source Component Mapping

- current source component: `GallerySection`
- current file: `zip/src/components/sections/GallerySection.tsx`
- current usage:
  - `zip/src/pages/HomePage.tsx`
  - `zip/src/pages/TemplatePage.tsx`

### Current Visual Behavior

This block renders:

- a section title
- a masonry-like 4-column gallery
- parallax motion on columns during scroll
- a layout that visually expects 7 image slots

The current business data contract accepts:

- `title?: string`
- `layoutStyle?: "masonry-style1"`
- `motionPreset?: "parallax-columns-soft"`
- `images?: { src: string; alt: string }[]`

The current React renderer adapter still maps that contract into a simpler component prop surface:

- `title?: string`
- `images?: string[]`
- `className?: string`

### Registry Block Key

- `gallery-masonry-style1`

### Purpose

Use this block for photo galleries where the layout itself is part of the visual identity and should remain consistent across pages.

### `data` Contract

#### Required fields

- `images`

#### Optional fields

- `title`
- `layoutStyle`
- `motionPreset`

### Recommended `data` Shape

```json
{
  "title": "Galeria",
  "layoutStyle": "masonry-style1",
  "motionPreset": "parallax-columns-soft",
  "images": [
    {
      "src": "https://example.com/uploads/gallery-1.jpg",
      "alt": "Wnętrze restauracji"
    },
    {
      "src": "https://example.com/uploads/gallery-2.jpg",
      "alt": "Detal zastawy"
    }
  ]
}
```

### `data` Field Rules

#### `title`

- type: string
- required: no
- default: `Galeria`

#### `layoutStyle`

- type: string
- required: no
- allowed for MVP: `masonry-style1`
- default: `masonry-style1`
- purpose: future-proofing for possible alternate masonry variants

#### `motionPreset`

- type: string
- required: no
- allowed for MVP: `parallax-columns-soft`
- default: `parallax-columns-soft`

#### `images`

- type: array of image objects
- required: yes
- minimum recommended: 7
- current default in code: `[]`
- practical minimum for rendering without obvious visual repetition: 4

Each image object should contain:

- `src`: required string
- `alt`: required string

Example image object:

```json
{
  "src": "https://example.com/uploads/gallery-1.jpg",
  "alt": "Wnętrze restauracji wieczorem"
}
```

### Rendering Rule

The stored contract for this block is image objects with `src` and `alt`.

Current runtime behavior:

- React page-builder adapter maps `images[].src` into the current `GallerySection` string-array prop shape
- Astro already consumes image objects directly and uses both `src` and `alt`

### `source` Contract

This block does not require a WooCommerce source in MVP.

Recommended rule:

- `source = null`

Future non-MVP extension could support WordPress media collections or tagged galleries, but not now.

### Default Data Recommendation

```json
{
  "title": "Galeria",
  "layoutStyle": "masonry-style1",
  "motionPreset": "parallax-columns-soft",
  "images": []
}
```

### Validation Notes

- reject images without `src`
- reject images without `alt`
- warn if fewer than 7 images are supplied
- do not fail if fewer than 7 exist, because current renderers preserve layout with fallback/reuse behavior

## 2. `menu-category-photo-parallax-full-width`

### Source Component Mapping

- current source component: `BreakfastSection`
- current file: `zip/src/components/sections/BreakfastSection.tsx`
- current usage:
  - `zip/src/pages/TemplatePage.tsx`

### Current Visual Behavior

This block renders:

- a full-width parallax/fixed-background hero image
- a centered uppercase headline over the image
- a two-column menu list below the hero
- menu rows with title, short description, leader line, and price label

The original visual source component was hardcoded, but the current page-builder integration already exposes a real prop-driven data contract in code.

### Registry Block Key

- `menu-category-photo-parallax-full-width`

### Purpose

Use this block for menu-category sections that need a visually strong category header followed by a curated item list or Woo-backed category listing.

This is the correct candidate for breakfast-like, dessert-like, and category-led landing sections.

### `data` Contract

#### Required fields

- `heroTitle`
- `backgroundImage`

#### Optional fields

- `overlayOpacity`
- `menuColumns`
- `layout`
- `menuAnchorId`
- `emptyStateText`

### Recommended `data` Shape

```json
{
  "heroTitle": "Breakfast",
  "backgroundImage": {
    "src": "https://example.com/uploads/breakfast.jpg",
    "alt": "Śniadanie podane na stole"
  },
  "overlayOpacity": 0.2,
  "layout": {
    "columns": 2,
    "heroHeight": "400px"
  },
  "menuColumns": [
    {
      "items": [
        {
          "title": "Cornish Earlies Potatoes",
          "description": "Potato, toast & bacon",
          "priceLabel": "$11"
        }
      ]
    },
    {
      "items": [
        {
          "title": "Rib-Eye On The Bone",
          "description": "Scottish dry aged",
          "priceLabel": "$18"
        }
      ]
    }
  ],
  "emptyStateText": "Brak pozycji w tej kategorii."
}
```

### `data` Field Rules

#### `heroTitle`

- type: string
- required: yes
- purpose: large text placed over the full-width hero image

#### `backgroundImage`

- type: image object
- required: yes

Image object fields:

- `src`: required string
- `alt`: required string

#### `overlayOpacity`

- type: number
- required: no
- default: `0.2`
- recommended range: `0` to `0.8`

#### `layout`

- type: object
- required: no

Allowed MVP fields:

- `columns`: integer, default `2`
- `heroHeight`: string, default `400px`

#### `menuColumns`

- type: array of column objects
- required: no when a Woo source is present
- required: yes when using manual mode

Each column object contains:

- `items`: array of menu items

Each menu item contains:

- `title`: required string
- `description`: optional string
- `priceLabel`: required string
- `tagSlugs`: optional string array, default `[]`

Example menu item:

```json
{
  "title": "Young Leeks & Asparagus",
  "description": "Crispy black garlic",
  "priceLabel": "$15"
}
```

#### `menuAnchorId`

- type: string
- required: no
- purpose: optional page anchor for navigation

#### `emptyStateText`

- type: string
- required: no
- used when source resolution returns no items

### Manual Mode Rule

If `source` is null, the block must use `menuColumns` from `data`.

This mode mirrors the current demo/default `BreakfastSection` content path most closely.

### Woo-Resolved Mode Rule

If `source` is present, the block may derive menu items from WooCommerce.

In that case:

- `heroTitle` and `backgroundImage` still come from `data`
- menu entries come from the resolved source payload
- `menuColumns` may be omitted and generated by the resolver/adapter
- `tagSlugs` may be preserved in manual mode, but Woo-resolved output should only include fields produced by the Woo normalization layer

### `source` Contract

This block supports WooCommerce-backed category rendering.

#### Recommended MVP source types

- `woo_category`
- `woo_products`

### Example Woo category source

```json
{
  "sourceType": "woo_category",
  "sourceValue": "sniadania-klasyczne",
  "options": {
    "limit": 20,
    "sort": "menu_order",
    "includeOutOfStock": false,
    "splitIntoColumns": 2
  }
}
```

### Example Woo product list source

```json
{
  "sourceType": "woo_products",
  "sourceValue": [101, 102, 103, 104],
  "options": {
    "preserveOrder": true,
    "splitIntoColumns": 2
  }
}
```

### Woo Resolver Output Recommendation

The Woo resolver should normalize product data into the same internal shape as `menuColumns`.

That means the renderer should receive a normalized structure like:

```json
{
  "menuColumns": [
    {
      "items": [
        {
          "title": "Jajecznica",
          "description": "Masło, szczypiorek",
          "priceLabel": "29 PLN"
        }
      ]
    }
  ]
}
```

### Default Data Recommendation

```json
{
  "heroTitle": "Breakfast",
  "backgroundImage": {
    "src": "",
    "alt": ""
  },
  "overlayOpacity": 0.2,
  "layout": {
    "columns": 2,
    "heroHeight": "400px"
  },
  "menuColumns": [],
  "emptyStateText": "Brak pozycji w tej kategorii."
}
```

### Validation Notes

- reject empty `heroTitle`
- reject missing `backgroundImage.src`
- reject missing `backgroundImage.alt`
- reject menu items without `title`
- reject menu items without `priceLabel` in manual mode
- allow empty `menuColumns` only when `source` is present or when intentionally creating a draft shell

## 3. `about-1`

### Source Component Mapping

- current source component: `AboutSection`
- current file: `zip/src/components/sections/AboutSection.tsx`
- current usage:
  - component exists as a reusable project-aligned section source
  - no page-builder runtime registration exists yet

### Current Visual Behavior

This block renders:

- a two-column editorial layout with alternating text and image groups
- a primary text area with optional title and optional CTA button
- a secondary supporting text area
- optional image stack on the left side
- optional image stack on the right side

The current component accepts:

- `leftImages?: { src: string; alt: string }[]`
- `leftText?: { title?: string; paragraphs: string[]; ctaButton?: { href: string; text: string } }`
- `rightText?: { paragraphs: string[] }`
- `rightImages?: { src: string; alt: string }[]`

### Registry Block Key

- `about-1`

### Purpose

Use this block for editorial or story-driven sections where a brand narrative, venue introduction, campaign explanation, or event introduction should sit next to supporting imagery.

### `data` Contract

#### Required fields

- `leftText`
- `rightText`

#### Optional fields

- `leftImages`
- `rightImages`

### Recommended `data` Shape

```json
{
  "leftImages": [
    {
      "src": "https://example.com/uploads/about-left-1.jpg",
      "alt": "Sala restauracji"
    }
  ],
  "leftText": {
    "title": "Nasza historia",
    "paragraphs": [
      "Bulwar laczy kuchnie, atmosfere i miejsce spotkan.",
      "Ta sekcja opowiada o charakterze restauracji albo oferty."
    ],
    "ctaButton": {
      "href": "/kontakt",
      "text": "Skontaktuj sie"
    }
  },
  "rightText": {
    "paragraphs": [
      "Druga kolumna rozwija glowna opowiesc i moze zostac bez tytulu i CTA."
    ]
  },
  "rightImages": [
    {
      "src": "https://example.com/uploads/about-right-1.jpg",
      "alt": "Detal wnetrza"
    }
  ]
}
```

### `data` Field Rules

#### `leftImages`

- type: array of image objects
- required: no

Each image object should contain:

- `src`: required string
- `alt`: required string

#### `leftText`

- type: object
- required: yes

Allowed fields:

- `title`: optional string
- `paragraphs`: required string array
- `ctaButton`: optional object with `href` and `text`

#### `rightText`

- type: object
- required: yes

Allowed fields:

- `paragraphs`: required string array

#### `rightImages`

- type: array of image objects
- required: no

### Rendering Rule

This block is content-first and does not require external source resolution in MVP.

The renderer should consume the stored image objects and text groups directly, without converting them into a flatter hero-style payload.

### `source` Contract

This block does not require an external source in MVP.

Recommended rule:

- `source = null`

### Default Data Recommendation

```json
{
  "leftImages": [],
  "leftText": {
    "paragraphs": []
  },
  "rightText": {
    "paragraphs": []
  },
  "rightImages": []
}
```

### Validation Notes

- reject image entries without `src`
- reject image entries without `alt`
- reject `leftText.paragraphs` if it is missing
- reject `rightText.paragraphs` if it is missing
- reject `ctaButton` if either `href` or `text` is missing

## Practical Summary

### `gallery-masonry-style1`

- maps to current `GallerySection`
- content-first block
- stores images as objects with `src` and `alt`
- uses an adapter in React and native object rendering in Astro

### `menu-category-photo-parallax-full-width`

- maps to current `BreakfastSection`
- hybrid block: visual hero + menu list
- supports manual mode and Woo-backed mode
- stores hero image and title locally, menu items either manually or from Woo
- current supported Woo source modes are `woo_category` and `woo_products`

### `about-1`

- now maps to current `AboutSection`
- is documentation-complete at the contract level
- still requires code-side schema and runtime registration

## Next Step

The next practical step after this document is to define the actual registry-side Zod schemas for these two blocks and then scaffold their adapter contracts in code.

For `about-1`, the next step is now to implement the code-side schema, defaults, examples, and renderer binding that match this documented contract.
