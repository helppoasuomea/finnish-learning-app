# components/ui

shadcn/ui components. These files are **ours** — shadcn is a generator, not a
dependency. Nothing updates them behind our backs, so edit them freely.

## Which Button do I import?

**This one.** `@/components/ui/button`, not sivu's `Button`.

Same for `input`, `label`, `card` and `badge`, which also exist in both places.

## Why, when sivu has the same components

sivu's scope is **design tokens and CSS atoms**. Behaviour — focus traps,
portals, keyboard navigation, ARIA — stays here on Radix.

These five overlap, but there is no drift to fix: since the token block came
out of `index.css`, these components read `hsl(var(--primary))` and friends
straight from sivu. They are already themed by the design system. Changing
which file they live in would buy consistency nobody can see.

The cost is not small either. The five have **32 importers** between them:

| component | importers |
|---|---|
| `button` | 14 |
| `card` | 6 |
| `label` | 6 |
| `input` | 5 |
| `badge` | 1 |

And the variant APIs differ — shadcn uses `default` / `destructive` /
`outline` / `secondary` / `ghost` / `link`, sivu uses `primary` / `accent` /
`secondary` / `ghost` / `outline` / `destructive` / `link`. Not a mechanical
rename, and this app has no component tests to catch a bad mapping.

## So what is sivu's React layer for?

The ops console, which has no component library at all, and future surfaces.
Those primitives are plain CSS over sivu's atoms with zero dependencies, which
is what lets them work somewhere Tailwind and Radix do not exist.

## Revisit this if

- the two implementations visibly diverge
- we want one of these components somewhere outside this app
- shadcn's Radix version is replaced for an unrelated reason

Until then: tokens from sivu, components from here.
