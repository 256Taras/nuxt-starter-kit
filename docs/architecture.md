# Modular Vue Architecture

Architecture prompt for Vue 3 / Nuxt 3 projects. Inspired by FEOD (Fractal
Entity Oriental Design) and FSD (Feature-Sliced Design), but adapted with
concrete technology choices and a Pinia-centric hook chain. Not a faithful
implementation of either methodology — use this prompt as the single source of
truth.

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

## Core Principles

1. **Pragmatic over ceremonial.** No classes, no DDD aggregates, no use case
   layers, no repository pattern. Plain types + Pinia stores + functions.
2. **Pinia store is the main composer.** It owns state, business logic, helpers,
   predicates, and orchestrates API + TanStack Query. UI talks to the store.
3. **4-layer hook chain.** Every API-touching module follows
   `useHttpClient -> useXxxApi -> useXxx -> useXxxStore`.
4. **Explicit public API.** Every module exposes a manually-curated `index.ts`
   with named exports. No `export *`.
5. **Fractal modules allowed but not forced.** A module may contain sub-modules
   when it genuinely grows. Small modules stay flat.
6. **Internal module structure is a recommendation, not a law.** Small modules
   can skip folders entirely. Large modules use the full structure.
7. **Files in kebab-case. Always.** Including `.vue` files.
8. **API types come from the backend.** Generated from OpenAPI, never
   hand-written for DTOs.

## Folder Structure

```
src/
├── app.vue                   <- root component
├── app/                      <- Nuxt app layer (all client-side conventions)
│   ├── assets/               <- styles, fonts, images
│   ├── layouts/              <- page layouts
│   ├── middleware/            <- route guards
│   ├── pages/                <- file-based routing
│   └── plugins/              <- Nuxt plugins
│
├── modules/                  <- business logic grouped by domain
│   ├── (users)/              <- GROUP: parentheses = visual grouping only
│   │   ├── profiles/         <- module
│   │   ├── authentication/
│   │   └── access-control/
│   │
│   ├── (orders)/
│   │   ├── order-list/
│   │   └── checkout/
│   │
│   └── (billing)/
│       └── subscriptions/
│
└── common/                   <- shared, business-agnostic code
    ├── api/                  <- useHttpClient + generated OpenAPI schema
    ├── lib/                  <- shadcn utility (cn())
    ├── ui/                   <- shadcn-vue primitives (each in own folder)
    ├── validation/           <- TypeBox helpers + vee-validate resolver
    ├── utils/                <- constants, useAppRouter
    └── types/
```

### Page-Specific Components

Components used only on a single page live in a `.components/` folder next to
the page. The dot prefix prevents Nuxt from generating routes for them.

```
app/pages/
├── index.vue
├── profile/
│   ├── index.vue
│   └── .components/
│       ├── profile-card.vue
│       └── profile-edit-form.vue
└── users/
    ├── index.vue
    ├── [id].vue
    └── .components/
        ├── users-table.vue
        └── user-filters.vue
```

Import with relative paths:

```typescript
import ProfileCard from "./.components/profile-card.vue";
```

**Rules:**

- Only `.components/` with dot prefix — Nuxt 4 ignores dot-prefixed folders
- `_components/` and `(components)/` do NOT work — Nuxt 4 creates routes from
  them
- If a component is used across multiple pages, move it to the module's `ui/`
  folder

### Module Groups `(name)`

Parentheses are purely organizational — they mark domain areas visually but have
no runtime meaning. No group-level `index.ts`. Imports include the parentheses
in the path: `#src/modules/(orders)/order-list`.

### Common Folder

`common/` has **no root `index.ts`**. Imports are always from specific
sub-paths:

- `import { UiButton } from '#src/common/ui/button'`
- `import { useHttpClient } from '#src/common/api/use-http-client'`

## Module Structure: Flat vs Fractal

### Flat Module (default for most cases)

```
module-name/
├── api/
│   └── use-<name>-api.ts       <- calls useHttpClient, returns { list, getById, ... }
├── composables/
│   └── use-<name>.ts           <- wraps api with TanStack Query (useQuery, useMutation)
├── model/
│   ├── <name>.types.ts         <- re-exports from generated schema + local additions
│   ├── <name>.schemas.ts       <- TypeBox schemas for forms (only if needed)
│   └── <name>.store.ts         <- Pinia store: THE composer
├── ui/
│   ├── ui-<name>-row.vue
│   └── ...
└── index.ts                    <- explicit public API
```

### Tiny Module (when folders are overkill)

```
module-name/
├── module-name.types.ts
├── module-name.store.ts
├── ui-module-name.vue
└── index.ts
```

## The 4-Layer Hook Chain

```
useHttpClient        (common layer — ofetch wrapper, auth interceptors)
      |
useXxxApi            (module layer — pure HTTP calls, returns { list, getById, ... })
      |
useXxx               (module layer — wraps api with useQuery / useMutation + queryKeys)
      |
useXxxStore          (Pinia — THE composer: state + business logic + orchestration)
      |
UI components        (consume store directly, or receive data via props)
```

### Layer 1: `useHttpClient`

Singleton ofetch instance. Lives in `common/api/use-http-client.ts`. Handles
baseURL, auth token, interceptors, retries, timeout. Returns a typed `$Fetch`.

### Layer 2: `useXxxApi`

Composable returning a plain object with typed API methods. No reactivity, no
state. Each method is a thin wrapper over `http<T>(url, options)`. Response
types come from the OpenAPI-generated schema.

### Layer 3: `useXxx`

Composable wrapping the api layer with TanStack Query. Returns an object
`{ list, byId, cancel, ... }` where each method creates a `useQuery` or
`useMutation`. Define `queryKeys` as a hierarchical object at the top of the
file for consistent invalidation.

### Layer 4: `useXxxStore` (Pinia setup store)

**This is where all business logic lives.** The store:

- Calls `useXxx()` internally to get queries and mutations
- Holds UI state (filters, selection, pagination)
- Exposes computed data (`orders`, `total`, `isLoading`) from query results
- Contains business predicates as methods (`canCancel`, `canRefund`, `isFinal`)
- Contains display helpers as methods (`getStatusLabel`, `getItemsCount`)
- Contains computed filtered lists (`cancellableOrders`, `refundableOrders`)
- Contains action methods (`cancelOrder`, `setStatusFilter`, `resetFilters`)

**No separate helpers file.** All predicates, formatters, and business rules are
methods on the store.

## API Types from OpenAPI

**DTO types are generated, never hand-written.**

- Backend publishes `openapi.json` at a known URL
- Script `pnpm gen:api` runs `openapi-typescript` and writes
  `src/common/api/generated/api-schema.ts`
- Generated file is committed to Git for diff visibility on backend changes
- CI runs `pnpm gen:api && git diff --exit-code` to catch out-of-sync types
- Module's `<name>.types.ts` re-exports from generated schema under clean domain
  names

## TypeBox: Scope and Rules

TypeBox is used **only where OpenAPI is not the source of truth**:

1. **Forms** — login, register, edit profile, cancellation reason
2. **Untrusted inputs** — URL query params, localStorage, postMessage
3. **Feature flags / remote config**
4. **Runtime type guards**

**Never validate your own API responses with TypeBox.** Trust the generated
types.

## Naming Conventions

**Files (all kebab-case):**

- Composables: `use-order.ts`, `use-http-client.ts`
- API: `use-order-api.ts`
- Stores: `order.store.ts`
- Types: `order.types.ts`
- Schemas: `order.schemas.ts`
- Vue components: `ui-order-row.vue`, `ui-button.vue`

**Code:**

- Composables: `useOrder()`, `useHttpClient()`
- Stores: `useOrderStore()`
- Vue components in templates: `<UiOrderRow>`, `<UiButton>` — PascalCase with
  `Ui` prefix
- Types/interfaces: `Order`, `OrderListFilters`
- Enums: `OrderStatus` — `as const` object, never TypeScript `enum`

## Type Rules

- Always use `as const` objects for enums, never TypeScript `enum`
- All data types use `readonly` by default for DTO types
- Exhaustive switch with `never` check

## Import Rules

- **Single path alias:** `#src` pointing to `./src`
- **Always import modules through their `index.ts`**
- **`common` sub-paths are imported directly** (no root common index)
- **`common` never imports from `modules`**
- **`pages` import from `modules` and `common`**
- **Modules can import from other modules** only through their public `index.ts`
- **Disable Nuxt auto-imports**

## Index.ts Rules

**Always explicit named exports. Never `export *`.** Group exports with section
comments.

**Never export module internals.** API composables, private helpers, internal
schemas stay unexported.

## What NOT to Do

- No classes for entities — use `interface` + store methods
- No separate `helpers.ts` files — business logic goes inside the store
- No repository pattern, no use case layer, no domain services
- No `export *` anywhere in any `index.ts`
- No `enum` keyword — use `as const` objects
- No `any` type — use `unknown` if truly needed
- No storing server data in Pinia state — TanStack Query cache is the source of
  truth
- No composables reading Pinia stores — stores sit at the top of the chain
- No hand-written DTO types — generate from OpenAPI
- No validation of own API responses with TypeBox
- No root `common/index.ts`
- No group-level `index.ts` for `(users)`, `(orders)` etc.
- No empty folders "for future use"
