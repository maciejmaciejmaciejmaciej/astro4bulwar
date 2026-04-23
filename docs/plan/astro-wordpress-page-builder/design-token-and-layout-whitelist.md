# Design Token And Layout Whitelist

## Purpose

This document is the practical whitelist for adapting imported blocks to the design contract defined by the project's design instructions.

It exists so the agent does not have to infer the design language from scattered files every time.

It does not define a separate format.
It translates the existing design instructions into concrete tokens, classes, and layout rules grounded in the real codebase.

Use it together with:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`

## Source Files Used For This Whitelist

The whitelist below is derived from:

- `zip/src/index.css`
- `zip/src/pages/TemplatePage.tsx`
- `zip/src/components/sections/Navbar.tsx`
- `zip/src/components/sections/Footer.tsx`
- `zip/src/components/sections/AboutSection.tsx`
- `zip/src/components/sections/BreakfastSection.tsx`
- `zip/src/components/sections/CateringSection.tsx`

## Rule Zero

When adapting a raw block:

- use the style vocabulary from this whitelist
- do not change the block's outer layout, width logic, or composition unless explicitly requested

This whitelist governs styling adaptation, not structural redesign.

## Preferred Global Tokens

### Color Tokens

Prefer existing semantic color usage built on these tokens:

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

### Font Tokens

Prefer existing font roles:

- `--font-headline`
- `--font-body`
- `--font-label`
- `--font-handwriting`

## Preferred Utility Classes

These are recurring repo-approved classes and should be preferred over ad hoc alternatives.

### Shell And Page Rhythm

- `page-margin`
- `min-h-screen`
- `overflow-hidden`
- `overflow-x-hidden`
- `selection:bg-primary-fixed`
- `bg-white`
- `text-on-surface`
- `font-body`

### Typography

- `font-headline`
- `font-body`
- `font-label`
- `text-on-surface`
- `text-on-surface/80`
- `text-zinc-500`
- `text-zinc-400`
- `uppercase`

For fresh raw shadcn imports, treat this as the approved typography cleanup vocabulary:

- use the semantic text-size mapping only: `h1 -> text-5xl`, `h2 -> text-4xl`, `h3 -> text-3xl`, `h4 -> text-2xl`, `h5 -> text-xl`, `h6 -> text-lg`, `p -> text-base`, `small -> text-sm`, micro detail -> `text-xs`
- keep approved project font-family classes only when needed: `font-headline`, `font-body`, `font-label`
- keep color, spacing, layout, and state classes only if they do not reintroduce forbidden typography modifiers
- do not preserve imported `leading-*`, `tracking-*`, or raw font-weight utility classes on fresh imports

### Surfaces And Borders

- `bg-white`
- `bg-surface`
- `bg-surface-container-lowest`
- `bg-surface-container-low`
- `bg-surface-container-high`
- `bg-primary`
- `text-on-primary`
- `border-zinc-200`
- `border-outline-variant/20`
- `theme-radius-surface`
- `theme-radius-media`
- `theme-radius-control`

### Buttons And CTA Tone

- `bg-primary text-on-primary`
- `bg-black text-white`
- `font-label tracking-[0.1em] uppercase`
- `hover:opacity-70`
- `hover:bg-zinc-800`
- `transition-opacity`
- `transition-colors`

### Existing Project Utilities

- `menu-leader`
- `editorial-title`
- `hero-text-mask`
- `theme-section-wrapper` for the standard hero/content wrapper shell

## Preferred Section Shell Patterns

These are recurring section patterns already used in the project.

### Pattern A: Full Page-Margin Section

Use when the section content naturally spans the main page width.

Typical shell:

- `page-margin`
- vertical rhythm such as `py-16 lg:py-24`, `py-24`, `py-32`, or `py-40`

Examples in code:

- `AboutSection`
- `BreakfastSection`
- `Footer`

### Pattern B: Page-Margin Plus Inner Max Width

Use when the section has a contained content core inside page-level side padding.

Common inner wrappers:

- `max-w-4xl mx-auto`
- `max-w-5xl mx-auto`
- `max-w-7xl mx-auto`

Examples in code:

- `Footer`
- `BreakfastSection`
- `CateringSection`

### Pattern D: Shared Hero Or Content Wrapper Width

Use when a block follows the standard wrapper contract currently used by imported hero or content sections.

Shared shell:

- `theme-section-wrapper`

Rules:

- manage the desktop width through the global CSS variable in `zip/src/index.css`
- do not repeat inline `lg:w-[calc(...)]` wrapper math in individual section components

### Pattern C: Page-Margin With Surface Container

Use when the section sits inside a framed surface shell.

Common shell features:

- `page-margin`
- `bg-surface-container-low`
- `theme-radius-surface`
- inner padding such as `px-4 md:px-12 lg:px-24`

Example in code:

- `CateringSection`

## Preferred Layout Vocabulary

When adapting an imported block, prefer project-proven layout vocabulary before introducing anything custom.

Common recurring layout primitives:

- `flex flex-col`
- `lg:flex-row`
- `items-center`
- `justify-between`
- `gap-8`
- `gap-10`
- `gap-12`
- `gap-14`
- `gap-16`
- `space-y-6`
- `space-y-8`
- `grid md:grid-cols-2`
- `grid md:grid-cols-3`

These are safe styling-layer building blocks only if they do not change the imported block's geometry.

## Preferred Media Patterns

Common existing image treatment patterns:

- `object-cover`
- `theme-radius-media`
- `overflow-hidden`
- `aspect-[4/3]`
- `w-full`
- `h-[250px]`
- `transition-transform duration-1000 hover:scale-110`

Use these to normalize image styling, not to redesign the block's media composition.

## Preferred Text Patterns

### Headings

Use these semantic cleanup targets for fresh raw imports:

- `h1` and page titles -> `text-5xl`
- `h2` and section titles -> `text-4xl`
- `h3` and subtitles -> `text-3xl`
- `h4` and card or widget titles -> `text-2xl`
- `h5` -> `text-xl`
- `h6` -> `text-lg`

### Body Copy

Use these semantic cleanup targets for fresh raw imports:

- `p` and body copy -> `text-base`

### Labels And Meta Text

Use these semantic cleanup targets for fresh raw imports:

- `small`, meta copy, and subtext -> `text-sm`
- micro detail and helper copy -> `text-xs`

## Safe Adaptation Moves

These are normally safe when integrating a raw block:

- replace imported text colors with semantic project text classes
- replace imported fonts with `font-headline`, `font-body`, or `font-label`
- replace imported surface colors with project surface classes
- normalize border colors to `border-zinc-200` or `border-outline-variant/20`
- normalize corner radius to `theme-radius-surface`, `theme-radius-media`, or `theme-radius-control` depending on role
- normalize semantic text sizing to the approved raw-import typography mapping
- remove imported font-weight, tracking, and leading utilities banned by the raw-import typography protocol

## Forbidden Adaptation Moves Without Explicit Approval

- changing full-width to contained or contained to full-width
- changing existing `max-w-*` shell logic
- changing number of primary columns
- converting horizontal composition to vertical composition
- changing hero height model or section silhouette
- replacing the block's native shell with a different shell from another project section
- wrapping the block in a new page-width container only because it looks nicer

## Decision Rule For Agents

Before changing a raw imported block, classify the change.

### Styling Adaptation

Allowed by default.

Examples:

- typography remap
- color remap
- spacing normalization
- button tone normalization
- border and surface normalization

### Structural Redesign

Not allowed by default.

Examples:

- width change
- layout direction change
- column count change
- shell replacement
- content-image composition change

If the change is structural redesign, stop and ask for explicit direction.
