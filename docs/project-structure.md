# Project Structure

## Overview

```text
.
├── docs/                 # Documentation
├── public/               # Static assets served as-is
├── src/                  # Application source code
├── tools/                # Dev tooling (plop generators)
├── .claude/              # Claude Code context (architecture, reflections)
├── openapi-ts.config.ts  # SDK generation config
├── nuxt.config.ts        # Nuxt config
└── package.json
```

## Source Code (`src/`)

```text
src/
├── app/                  # Nuxt application layer
├── modules/              # Business modules (domain entities + features)
├── common/               # Shared, business-agnostic code
├── configs/              # Runtime configuration
└── types/                # Global types (UUID, pagination, UpdateMutationVars)
```

### `app/`

Nuxt's own conventions. All things the framework auto-discovers.

```text
app/
├── pages/                # File-based routing = features (orchestrators)
├── layouts/              # Page layouts (default, auth)
├── middleware/           # Route guards (auth.global.ts)
├── plugins/              # Nuxt plugins (toastify, query-provider)
├── assets/               # Styles, fonts, images
└── app.vue               # Root component
```

### `modules/`

Business modules grouped by domain. Each module = one backend entity.

```text
modules/
├── (bookings)/           # domain group (visual only, no runtime meaning)
│   ├── bookings/         # module: the "booking" entity
│   ├── payments/         # module: the "payment" entity
│   └── reviews/          # module: the "review" entity
├── (marketplace)/
│   ├── providers/
│   └── services/
└── (users)/
    ├── authentication/
    └── profiles/
```

#### Module internal structure

Each module follows this pattern:

```text
module-name/
├── entity/               # data + rules about the entity
│   ├── <name>.types.ts
│   ├── <name>.domain.ts
│   ├── <name>.queries.ts
│   └── index.ts
├── features/             # user actions / reusable UI blocks with logic
│   ├── create-<name>/
│   ├── cancel-<name>/
│   └── <name>-list/
└── index.ts              # module public API
```

See [`.claude/ARCHITECTURE.md`](../.claude/ARCHITECTURE.md) for the full rules
on what belongs in each layer.

### `common/`

Shared, business-agnostic code. No module ever lives here.

| Directory                   | Description                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `api/sdk/`                  | Auto-generated SDK (never edited)                                                   |
| `api/sdk-queries.ts`        | Barrel over generated TanStack Query helpers                                        |
| `api/sdk-runtime-config.ts` | HTTP client config (auth, refresh, interceptors)                                    |
| `api/query-client.ts`       | TanStack Query client singleton                                                     |
| `components/atoms/`         | Low-level UI primitives (Button, Input, StatusBadge)                                |
| `components/molecules/`     | Composite UI (FormField, BackLink, DataField, PageHeader, Card, Pagination)         |
| `composables/`              | Generic composables (useRouteId, useQueryParam, useFocusTrapOnOpen)                 |
| `utils/`                    | Pure helpers (runWithToast, stripEmpty, formatCurrency, formatDate, formatApiError) |
| `validation/`               | TypeBox primitives (EmailSchema, PasswordSchema), vee-validate resolver             |
| `router/`                   | Typed route table (useAppRouter)                                                    |
| `lib/`                      | shadcn `cn()` utility                                                               |

````

### `types/`

Global cross-module types. Everything here can be imported from `#src/types`.

| File | Description |
|------|-------------|
| `api.types.ts` | `UUID`, pagination types, `UpdateMutationVars<T>`, `ApiErrorResponse` |
| `index.ts` | Barrel re-exports |

### `configs/`

Runtime configuration. Values are read via `useRuntimeConfig()` or directly.

| File | Description |
|------|-------------|
| `api.config.ts` | API base URL, timeouts, retries |
| `app.config.ts` | App name, URL |
| `auth.config.ts` | Cookie options, refresh token path |
| `feature-flags.config.ts` | Feature flag toggles |
| `use-config.ts` | Typed config accessor |
| `index.ts` | Barrel re-exports |

## Docs (`docs/`)

| File | Description |
|------|-------------|
| `architecture.md` | The architecture blueprint |
| `project-structure.md` | This file |
| `scripts.md` | All `pnpm` scripts |
| `env.md` | Environment variables |
| `faq.md` | Common questions |
| `snippets.md` | Code patterns for common tasks |
| `error-handling.md` | How errors flow from SDK to toast |
| `frontend-best-practices.md` | Vue 3 / Nuxt 4 best practices |

## Tools (`tools/`)

```text
tools/
└── plop/
    ├── generators/       # module, feature, page, composable, util, component
    └── templates/        # .hbs files used by generators
````

See [`docs/scripts.md`](scripts.md) under "Plop — code generators" for usage.

## Claude Context (`.claude/`)

Auto-loaded in every Claude Code session.

| File               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `ARCHITECTURE.md`  | Single source of truth for architecture rules            |
| `ELEGANCE.md`      | Established elegance rules (refactoring, extraction bar) |
| `REFLECTIONS.md`   | Append-only log of lessons learned                       |
| `SESSION_STATE.md` | Transient per-session state                              |
