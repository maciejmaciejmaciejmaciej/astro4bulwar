# Global CSS Adaptation Contract

## Purpose

This document defines how a raw imported block must be adapted to the design contract defined by the project's design instructions and reference files.

When adding a new component or block to the app, this adaptation is the first mandatory step. The block must first be brought into alignment with the main theme CSS and existing class vocabulary before it is previewed, reused, or registered as a business block.

The key rule is:

- adapt the block's styling to the existing global CSS and the class vocabulary defined by the design instructions and reference files
- do not change the block's layout geometry unless the user explicitly asks for that change

This contract exists to stop the agent from redesigning a block while it is only supposed to integrate it visually.

It is not a separate "Bulwar format".
It is a concrete interpretation of the existing design instructions, based on the real frontend source.

Use it together with the concrete whitelist in:

- `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`

## Source Of Style Truth

The primary global style source for the React frontend is:

- `zip/src/index.css`

The primary visual reference page is:

- `zip/src/pages/TemplatePage.tsx`

These two files, together with the design instructions, define the baseline for:

- color tokens
- typography families
- shared utility classes
- page side padding rhythm
- overall section tone and composition language

If a candidate component still depends on foreign classes, ad hoc colors, or a styling system outside this baseline, it is still in adaptation and must not yet be treated as an approved block.

## Confirmed Global Tokens And Utilities

The current global CSS already defines project-level style primitives such as:

- colors:
  - `--color-primary`
  - `--color-on-primary`
  - `--color-surface`
  - `--color-on-surface`
  - `--color-surface-container-lowest`
  - `--color-surface-container-low`
  - `--color-surface-container-high`
  - `--color-outline-variant`
  - `--color-primary-fixed`
  - `--color-secondary-fixed-dim`
- fonts:
  - `--font-headline`
  - `--font-body`
  - `--font-label`
  - `--font-handwriting`
- radius tokens:
  - `--radius`
  - `--radius-sm`
  - `--radius-md`
  - `--radius-lg`
  - `--radius-xl`
  - `--radius-2xl`
  - `--radius-3xl`
  - `--radius-4xl`
- utilities:
  - `.page-margin`
  - `.menu-leader`
  - `.editorial-title`
  - `.hero-text-mask`
  - `.theme-radius-surface`
  - `.theme-radius-media`
  - `.theme-radius-control`

The block integration workflow should prefer these tokens and the semantic classes already used across the repo, such as:

- `bg-white`
- `text-on-surface`
- `font-body`
- `font-headline`
- `font-label`
- `selection:bg-primary-fixed`
- `page-margin`

## Radius Contract

Corner radius must follow the global radius token system defined in `zip/src/index.css`.

That means:

- treat `--radius` and the derived `--radius-*` tokens as the source of truth
- prefer the semantic radius utilities exposed by the global CSS over hardcoded `rounded-*` values when adapting reusable blocks
- use `.theme-radius-surface` for framed cards, panels, and contained section surfaces
- use `.theme-radius-media` for image wrappers and media crops
- use `.theme-radius-control` for buttons and other interactive controls
- do not normalize imported or reusable blocks to `rounded-[4px]` by default when the global token system defines a larger project radius

## Adapt What, Preserve What

### Adapt These Layers

When importing a raw block, the agent should adapt:

- text classes and typography mapping
- color usage
- background tokens
- border and outline colors
- text rhythm and paragraph styling
- internal padding and spacing if needed to fit the existing design language
- button styling if the project already has an equivalent button pattern

The goal is to make the block comply with the existing design contract already used by the site.

### Preserve These Layers

When importing a raw block, the agent must preserve unless explicitly told otherwise:

- outer layout structure
- width strategy
- max-width strategy
- section shell geometry
- number and order of columns
- media-to-text composition
- major alignment model
- vertical block architecture

In short:

- style may be normalized
- geometry may not be casually redesigned

## Raw Import Typography Cleanup Rule

For freshly imported shadcn, v0, or external UI snippets, typography cleanup is mandatory and overrides source typography preservation.

That means:

- do not preserve foreign font-weight, tracking, or leading utilities just because they came with the source snippet
- remove these classes from fresh raw imports: `leading-tight`, `leading-snug`, `leading-7`, `leading-none`, `tracking-tighter`, `tracking-tight`, `tracking-normal`, `font-extrabold`, `font-bold`, `font-semibold`, `font-medium`, `font-normal`
- map semantic text elements to the approved single text-size class for that role:
  - `h1` -> `text-5xl`
  - `h2` -> `text-4xl`
  - `h3` -> `text-3xl`
  - `h4` -> `text-2xl`
  - `h5` -> `text-xl`
  - `h6` -> `text-lg`
  - `p` -> `text-base`
  - `small` -> `text-sm`
  - micro detail or helper copy -> `text-xs`
- this mapping governs the text-size class only; approved project font-family, color, state, and layout classes may remain

If the imported block cannot survive this cleanup without needing extra ad hoc typography utilities, stop and report the blocker instead of improvising.

## Geometry Preservation Rule

The following changes are forbidden during normal block adaptation unless the user explicitly asks for them:

- changing the block from full-width to contained or from contained to full-width
- changing `max-w-*` composition logic
- changing grid column count as a stylistic preference
- changing block orientation, for example left-media/right-text into top-media/bottom-text
- changing the section shell height model or hero proportions
- collapsing or expanding the block into a different layout family

If the imported block cannot fit the project visually without changing geometry, the agent should stop and report that the block requires a structural redesign decision, not a styling adaptation.

## Width Rule

Width is treated as part of layout geometry, not as a visual token.

That means:

- do not change width just because the imported block looks visually different
- do not “fix” width by inventing new wrappers
- do not replace the imported shell width model with arbitrary `max-w-*` choices

If a block needs a project-standard wrapper, that must be an explicit design decision, not an automatic adaptation step.

## TemplatePage Validation Rule

Every adapted block should be checked against `TemplatePage` for:

- class vocabulary consistency
- typography consistency
- color consistency
- page-margin rhythm consistency
- component tone consistency

TemplatePage is not permission to redesign the imported block's geometry.
It is the reference for native styling and quality.

## Agent Decision Rule

When refining a raw block, the agent should classify each proposed change into one of two buckets.

### Bucket A: Safe adaptation

Examples:

- replace raw text color with `text-on-surface`
- replace ad hoc heading and paragraph sizing with the approved semantic mapping such as `h2 -> text-4xl` and `p -> text-base`
- replace foreign padding values with the nearest existing spacing rhythm
- swap imported font stack to the project's existing typography classes

### Bucket B: Structural redesign

Examples:

- changing content width model
- changing the outer shell from two columns to one column
- moving the hero image position
- replacing the original section composition with a different one from TemplatePage

Bucket B requires explicit user approval.

## Required Sentence For Future Skills And Docs

Any workflow or skill that handles raw block refinement should follow this sentence exactly in meaning:

- adapt text, colors, fonts, spacing, and padding to the global CSS and the class vocabulary defined by the design instructions and reference files; for fresh raw imports, perform typography cleanup with the approved semantic text-size mapping and remove forbidden font-weight, tracking, and leading classes; do not change the block's layout, composition, or width unless explicitly requested
