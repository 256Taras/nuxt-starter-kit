# Reflections — Lessons Learned the Hard Way

> This file is **append-only**. Claude appends one line per mistake fixed. Read
> this at session start. These are your priors.
>
> Format: `[YYYY-MM-DD] [domain] one-sentence lesson, present tense, imperative`

## Examples (delete after first real entries)

[2026-04-09] [pinia] storeToRefs() must be called before any await, otherwise
reactivity is lost [2026-04-09] [vue] Props destructuring is enabled in
nuxt.config — use it, don't spread props manually [2026-04-09] [tanstack-query]
Server data belongs in TanStack Query cache, not Pinia state — Pinia is for
client state only [2026-04-09] [tailwind] Tailwind CSS 4 uses @theme in CSS, not
tailwind.config.js — check main.css for theme tokens [2026-04-09] [nuxt]
Auto-imports are disabled — every import must be explicit, including vue
composables

## Real entries (append below)

[2026-04-10] [nuxt] When components["schemas"] is `never` in openapi-typescript
output, extract types from
`paths[...]["get"]["responses"][200]["content"]["application/json"]` — never
hand-write DTOs [2026-04-10] [nuxt] useHttpClient needs `patch` method alongside
get/post/put/delete — add it before implementing PATCH-based endpoints
[2026-04-10] [tanstack-query] Cursor-based pagination requires separate
CursorPaginationParams type (limit/after/before) — don't reuse offset
PaginationParams [2026-04-11] [architecture] queries.ts must never import store
— if mutation needs store side-effect, wrap mutateAsync + store call in a
page-level closure and pass it to runWithToast [2026-04-11] [a11y]
useFocusTrapOnOpen must intercept Tab/Shift-Tab on the dialog element and cycle
focus — just calling dialogRef.focus() on open is not a real trap [2026-04-11]
[vue] FormField must pass aria-describedby and aria-invalid to the slotted input
via scoped slot props — without this, screen readers cannot announce field
errors [2026-04-11] [vue] NuxtLink wrapping Button produces invalid
`<a><button>` nesting — always use `<Button as-child><NuxtLink>` instead
[2026-04-11] [refactoring] 10 parallel audit agents produce ~60 findings, but
only ~18 pass the elegance bar (≥4 callsites OR bug fix OR semantic win) —
filter ruthlessly before acting [2026-04-12] [meta] Canonical elegance rules
live in docs/elegance.md — reference on demand (not auto-loaded); CLAUDE.md
links to it
