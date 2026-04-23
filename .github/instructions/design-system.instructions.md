---
description: 'Design-system workflow for Bulwar reusable page blocks. Use when importing raw shadcn blocks, adapting them to project design, validating TemplatePage parity, or turning a visual section into a reusable business block with a documented contract.'
applyTo: 'zip/src/**/*.tsx, zip/src/**/*.ts, zip/src/**/*.css, docs/block-registry/**/*.md, docs/plan/astro-wordpress-page-builder/**'
---

# Design System And Block Refinement

Use this instruction when the task is about visual block quality, reusable section design, TemplatePage parity, or adapting imported shadcn blocks.

## Canonical Visual Reference

- `zip/src/pages/TemplatePage.tsx` is the sacred visual reference.
- TemplatePage is the repair surface for block quality and the benchmark for spacing, class usage, layout rhythm, and component tone.
- A block is not approved just because it renders. It is approved only when it fits the established design language.

## Global Style Source Of Truth

- `zip/src/index.css` is the global style source of truth for colors, fonts, and shared utilities.
- `zip/src/pages/TemplatePage.tsx` is the canonical visual reference for how those global styles are actually used in page sections.
- There is no separate "Bulwar format" outside this instruction layer; the required format is the design contract defined here and clarified by the referenced files.
- The detailed adaptation rule is documented in `docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md`.
- The practical whitelist of preferred tokens, classes, and section-shell patterns is documented in `docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md`.
- New blocks that follow the standard hero/content width must use `theme-section-wrapper` from `zip/src/index.css`.
- Manage that desktop wrapper width from the shared CSS variable in global CSS instead of repeating inline `lg:w-[calc(...)]` math in section components.

## Raw Block Rule

- A raw downloaded shadcn block is never a final page-builder block.
- Adding a new component or block starts with adapting it to the application's main theme CSS and existing class vocabulary.
- Only after that adaptation step may it be treated as a reusable business block, previewed on a target page, or proposed for registration.
- It must first be refactored into a reusable business block.
- Hardcoded copy, one-off layout assumptions, and project-incompatible classes must be removed.
- During this adaptation, style must be normalized to the global CSS and existing class vocabulary, but geometry must remain intact unless the user explicitly asks for redesign.

## Translation-Only Rule

- When the user pastes a shadcn block and asks to adapt it to the project theme, treat the task as a translation, not a redesign.
- Do not add creative interpretation, visual improvement, cleanup by taste, or alternative hierarchy.
- Preserve the source block's geometry and visual decisions unless the user explicitly asks for changes.
- Preserve spacing, padding, margins, radius, shadows, layout, and responsive behavior unless a project-token replacement is technically required.
- Replace only what is technically necessary: map classes and primitives to the project's tokens, utilities, and existing UI components.
- If a source primitive does not exist in the repo, recreate only the missing technical wrapper needed to preserve the same visual result.
- If an exact translation is impossible without changing appearance, stop and report the blocker instead of improvising.

## Fresh Shadcn Typography Protocol

- Freshly imported shadcn, v0, or external snippet components must go through mandatory typography cleanup before preview, reuse, or registration.
- Typography cleanup must preserve the authored `text-*` size classes exactly as imported unless the user explicitly asks for a redesign.
- The mandatory cleanup step is to run `npm run normalize:raw-shadcn-typography -- --write <target>` inside `zip/` on the imported file or directory before preview, reuse, or registration.
- When no explicit target is given, the cleaner defaults to `src/components/sections`.
- The cleaner removes only `leading-*`, `tracking-*`, and font-weight classes such as `font-normal`, `font-medium`, `font-semibold`, and `font-bold`.
- Keep `italic`, `font-mono`, color classes, spacing, layout, borders, shadows, radius, and all authored `text-*` sizes unless the user explicitly asks otherwise.
- After running the cleaner, inspect the imported slice for unsupported dynamic class composition. If `leading-*`, `tracking-*`, or font-weight classes remain because they are built through complex `cn(...)` or indirection, report that explicitly instead of pretending the cleanup is complete.
- If the imported block depends on forbidden typography classes to stay legible or visually coherent, stop and report the blocker instead of inventing new typography utilities.

## Preview Workflow

- New imported blocks for visual checking should be rendered on `zip/src/pages/TemplatePage2.tsx` unless the user explicitly asks to use another preview surface.
- `zip/src/pages/TemplatePage.tsx` remains the canonical reference surface, but `TemplatePage2` is the sandbox for newly translated blocks.
- The workflow is: paste source block -> run the raw typography cleaner on the imported slice -> adapt it to the main theme CSS and approved class vocabulary -> translate 1:1 into project primitives and tokens -> render on `/template2` -> iterate only on explicit user feedback.

## Token Propagation Rule

- When translating a block, prefer token-driven project primitives and semantic utilities so later changes to shared tokens propagate automatically.
- Shared concerns such as radius, borders, shadows, colors, and button styling must be wired through the project's token system whenever this can be done without changing the source block's appearance.
- Token propagation must never be used as a reason to alter the original block's geometry or hierarchy.

## Required Output Of Block Refinement

Every accepted business block should end up with:

- a reusable component API driven by props
- content extracted out of hardcoded JSX
- alignment with existing project classes and spacing patterns
- a visual validation pass on `zip/src/pages/TemplatePage2.tsx`, using `zip/src/pages/TemplatePage.tsx` as the canonical visual reference
- a documented data contract
- example content payloads for future reuse

## Visual Rules

- Use only the existing project design language unless the user explicitly approves a new pattern.
- Do not invent new ad hoc styling systems.
- Reuse the existing semantic classes and spacing patterns already present in the project.
- Preserve the Navbar, Footer, page margins, typography hierarchy, and overall composition style already used by the site.

## Adaptation Boundary

The agent may adapt:

- text styling
- colors
- font classes
- internal spacing and padding
- button and surface styling

The agent must preserve unless explicitly instructed otherwise:

- block layout
- block width
- max-width logic
- column structure
- section shell geometry
- major media-text composition

If the block looks wrong without changing geometry, the agent must report that the block needs structural redesign approval rather than silently changing it.

## Reusability Rules

- A block must be composable into different pages without rewriting its internal JSX.
- Prefer descriptive props and structured content objects over flat prop explosions.
- Do not couple a reusable block to one page slug or one WordPress page.
- If a block has meaningful variants, name and document them explicitly.

## Block Documentation Rules

- Every approved business block should have both a machine-readable registry entry and a human-readable description.
- The human-readable description should explain what content belongs in the block, what optional parts exist, and which fields are safe for AI editing later.
- The documentation should be strong enough to support Make.com output descriptions later.

## Validation Checklist

Before calling a block ready, verify:

- design parity with the project reference
- style alignment with `zip/src/index.css`
- responsive behavior
- clean reusable props
- no hardcoded business copy that should be data-driven
- block identity and purpose are clear enough for registry use
- fresh imported typography has been cleaned with the mandatory raw cleaner while preserving authored `text-*` sizes
- no banned font-weight, tracking, or leading classes remain on the imported slice

## What To Avoid

- Do not register raw shadcn primitives as business blocks.
- Do not leave a block only in a “working” state on a scratch page.
- Do not mix multiple unrelated visual directions inside one block.
- Do not approve a block without documenting its input structure.
- Do not change a block's width or outer layout during styling adaptation unless the user explicitly approves that change.
- Do not duplicate the standard hero/content wrapper width contract inline when `theme-section-wrapper` matches the intended shell.

