# V1 Raw Shadcn Typography Normalizer

Use this only on explicitly named raw-import `.tsx` files. V1 is not a repo-wide migration tool.

## Invocation

Dry-run is the default:

```bash
npm run normalize:raw-shadcn-typography -- src/components/sections/About1.tsx
```

Write mode mutates the file in place:

```bash
npm run normalize:raw-shadcn-typography -- --write src/components/sections/About1.tsx
```

You may pass multiple explicit `.tsx` files. V1 refuses directories, glob-style arguments, and non-`.tsx` paths.

## What V1 Rewrites

Supported semantic tags only: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, and `small`.

For those tags, v1 removes raw text-size utilities plus raw `leading-*`, `tracking-*`, and font-weight utilities, then inserts one approved size class for the tag:

- `h1` -> `text-5xl`
- `h2` -> `text-4xl`
- `h3` -> `text-3xl`
- `h4` -> `text-2xl`
- `h5` -> `text-xl`
- `h6` -> `text-lg`
- `p` -> `text-base`
- `small` -> `text-sm`

Non-typography classes stay in place. In dry-run, the CLI reports `changed` or `no changes` per file without writing.

## Manual Follow-Up Required

V1 reports these unresolved categories instead of rewriting them:

- `computed_class_name`: any computed or interpolated `className`, including conditional expressions and non-literal `cn(...)` arguments
- `unsupported_element`: static typography on nonsemantic wrappers such as `div` and `span`
- `unsupported_component`: static className stacks on components such as `Button`

Treat reported lines as manual cleanup work. Do not assume the tool inferred the correct text role for them.

## Intentional Out Of Scope

V1 does not:

- scan the repo, walk directories, or expand globs
- normalize layout shells, width strategy, spacing geometry, or section composition
- infer nonsemantic text roles from `div`, `span`, or component usage
- rewrite component-specific typography intent outside the supported semantic tags