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
