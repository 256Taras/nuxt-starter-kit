## Active Context (Auto-loaded)

@.claude/REFLECTIONS.md @.claude/SESSION_STATE.md

## Working Style — READ EVERY SESSION

1. **REFLECTIONS first.** Before any non-trivial task, read
   `.claude/REFLECTIONS.md`. Apply them.

2. **PRP or no work.** For anything beyond a 1-line fix, there must be a PRP
   file in `PRPs/`. If none exists, invoke `planner` agent first.

3. **Append to REFLECTIONS on every fix.** Format:
   `[YYYY-MM-DD] [domain] one-sentence lesson` Domains: vue, pinia, nuxt,
   tanstack-query, tailwind, vee-validate, storybook, a11y.

4. **No `any`. No `console.log`. No commented-out code.**

5. **`/clear` between unrelated tasks.**

6. **Background processes for feedback loops.** Run `pnpm dev` via `/bg-dev`.
   Nuxt has HMR.

## Hard Forbidden

- Edits to `.env*` (blocked by hook)
- Edits on `main`/`master`/`develop` branches (blocked by hook)
- Disabling tests to make them pass
- Adding new deps without checking existing alternatives
- `export *` in index.ts files
- Options API in any component or store

## Available Subagents

- `planner` — read-only, generates PRP
- `component-builder` — creates components with stories
- `accessibility-auditor` — checks a11y issues
- `bundle-watcher` — analyzes build output
- `code-archaeologist` — read-only, deep exploration
- `defender` / `attacker` / `judge` — debate review
- `meta-agent` — generates new subagents

## Available Skills (auto-load by glob)

Skills load conditionally based on file paths via frontmatter `globs:`.

## Default Models

- Main session: sonnet
- Read-only agents: haiku
- Critical review: sonnet
- Architecture: opus
- MAX_THINKING_TOKENS: 2000

---

# Project Instructions

You are an expert Vue/Nuxt architect working on a **production-grade Nuxt 4
starter kit**.

This project follows the Modular Vue Architecture documented in
`docs/architecture.md`.

## Stack

- **Framework:** Vue 3 + Nuxt 4 (Composition API, `<script setup>`)
- **Language:** TypeScript strict mode
- **Package manager:** pnpm (only pnpm, never npm/yarn)
- **State:** Pinia (setup stores only)
- **Server state:** TanStack Query (`@tanstack/vue-query`)
- **HTTP:** ofetch (via `useHttpClient` wrapper)
- **UI library:** shadcn-vue + Tailwind CSS
- **Icons:** lucide-vue-next
- **API types:** auto-generated from OpenAPI via `openapi-typescript`
- **Runtime validation:** TypeBox (`@sinclair/typebox`) — only where needed
- **Backend:** Fastify (node-starter-kit) at `http://localhost:3100`

## Core Principles

1. **Pragmatic over ceremonial.** No classes, no DDD, no use case layers, no
   repository pattern
2. **Pinia store is the main composer.** State + business logic + orchestration
3. **4-layer hook chain:** `useHttpClient -> useXxxApi -> useXxx -> useXxxStore`
4. **Explicit public API.** Every module has manually-curated `index.ts`. No
   `export *`
5. **Files in kebab-case. Always.** Including `.vue` files
6. **API types come from backend.** Generated from OpenAPI, never hand-written
   for DTOs

## Project Structure

```
src/
├── app.vue                   # Root component
├── app/                      # Nuxt app layer (all client-side conventions)
│   ├── assets/               # styles, fonts, images
│   ├── layouts/              # page layouts
│   ├── middleware/            # route guards
│   ├── pages/                # file-based routing
│   └── plugins/              # Nuxt plugins
├── modules/                  # business logic grouped by domain
│   └── (users)/              # domain group (visual only)
│       ├── authentication/   # auth module
│       └── profiles/         # user profiles module
└── common/                   # shared, business-agnostic code
    ├── api/                  # useHttpClient + generated types
    ├── lib/                  # shadcn utility (cn())
    ├── ui/                   # shadcn-vue components
    ├── types/                # shared type definitions
    ├── utils/                # constants, useAppRouter
    └── validation/           # TypeBox schemas + vee-validate resolver
```

## Page-Specific Components

Components used only on one page live in `.components/` (dot prefix) next to the
page:

```
app/pages/profile/
├── index.vue
└── .components/
    └── profile-card.vue
```

- **Dot prefix is required** — Nuxt 4 ignores dot-prefixed folders
- `_components/` and `(components)/` do NOT work — they generate routes
- Import with relative path:
  `import ProfileCard from "./.components/profile-card.vue"`
- If shared across pages — move to module's `ui/` folder

## Module Structure

Each module follows the 4-layer pattern:

```
module-name/
├── api/
│   └── use-<name>-api.ts       # HTTP calls using useHttpClient
├── composables/
│   └── use-<name>.ts           # TanStack Query wrappers
├── model/
│   ├── <name>.types.ts         # re-exports from generated API schema
│   ├── <name>.schemas.ts       # TypeBox form schemas (if needed)
│   └── <name>.store.ts         # Pinia store — THE composer
├── ui/
│   └── ui-<name>-*.vue         # UI components
└── index.ts                    # explicit public API
```

## Import Rules

- **Single alias:** `#src` -> `./src`
- **Import modules through `index.ts`**, never deep-import
- **`common` sub-paths directly** (no root common index)
- **`common` never imports from `modules`**
- **Nuxt auto-imports disabled** — always explicit imports

## Anti-Patterns (full list in `docs/frontend-best-practices.md`)

- No `enum` keyword — use `as const` objects
- No `any` type — use `unknown`
- No storing server data in Pinia state — TanStack Query cache is truth
- No composables reading Pinia stores
- No hand-written DTO types that exist in OpenAPI
- No separate `helpers.ts` — business logic goes in the store
- No `export *` in any `index.ts`
- No `reactive()` for simple state — use `ref()`
- No `watch` for derived state — use `computed()`
- No data fetching in `onMounted()` — use `useQuery()`
- No manual `refetch()` — use `invalidateQueries()`
- No inline query keys — use query key factory
- No `v-if` + `v-for` on same element
- No prop mutation — emit events up
- No prop drilling > 2 levels — use `provide/inject`
- No nesting > 2 levels — use early returns
- No browser APIs outside `onMounted()` / `import.meta.client`

## Commands

```bash
pnpm dev                # Run dev server
pnpm build              # Build for production
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint errors
pnpm prettier:fix       # Format code
pnpm gen:api            # Generate API types from backend OpenAPI
```

## Adding New Features

1. **Start with types** — re-export from `api-schema.ts` in `<name>.types.ts`
2. **Create API layer** — `use-<name>-api.ts` using `useHttpClient`
3. **Create composable** — `use-<name>.ts` wrapping API with TanStack Query
4. **Create store** — `<name>.store.ts` with state, predicates, actions
5. **Create UI** — `ui-<name>-*.vue` consuming the store
6. **Create index.ts** — explicit public API exports
7. **Add page** — in `src/pages/` consuming the module

## Code Style

- **Indentation:** 2 spaces
- **Quotes:** Double quotes
- **Semicolons:** Always
- **Line Length:** Max 120 characters
- **Vue components:** `<script setup>` only
- **Pinia stores:** Setup syntax only (no options API)

## Naming

- **Files:** kebab-case (`use-authentication-api.ts`, `ui-user-card.vue`)
- **Components:** PascalCase with `Ui` prefix in templates (`<UiButton>`)
- **Stores:** `useXxxStore()`
- **Composables:** `useXxx()`
- **Types:** PascalCase (`User`, `OrderStatus`)
- **Constants:** `as const` objects, PascalCase name

## Commit Convention

```
<type>(<scope>): <short summary>

feat(auth): add forgot password page
fix(profiles): resolve user list pagination
refactor(common): simplify http client interceptors
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `chore`
