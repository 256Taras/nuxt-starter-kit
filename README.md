# ▲ Nuxt Starter Kit

**Production-grade Nuxt 4 starter. SDK-first. Strict architecture. Enforced
boundaries.**

Scaffold a serious frontend in minutes, not days.

---

## 💡 Philosophy

> _"Pages are kitchens. Modules are ingredient shelves. Common is the cutlery
> drawer."_

This starter embraces **explicit, enforceable rules** over habit and discipline.
The architecture is documented, the boundaries are checked by tools, and every
layer has one job.

- **SDK-first** — types, requests, and TanStack helpers come from your backend's
  OpenAPI spec. Hand-written DTOs are forbidden.
- **Module = one entity** — not a feature, not a page. Each backend resource
  gets a folder with `entity/` (data) + `features/` (user actions).
- **Pages stay thin** — orchestrators only. No mutations, no schemas, no
  try/catch on pages.
- **Boundaries are code** — `eslint-plugin-boundaries` in editor +
  `dependency-cruiser` in CI. Architecture violations fail the build.
- **Minimal deps** — every package earns its place. No utility wrappers around
  the stdlib.

---

## ⚡ What Makes This Different

### Generated SDK with TanStack Query helpers

`@hey-api/openapi-ts` reads your backend OpenAPI spec and generates:

- TypeScript types for every request and response
- SDK functions (`getV1Providers`, `postV1AuthSignIn`, ...)
- Ready-to-use `UseMutationOptions` (`postV1AuthSignInMutation()`, ...)
- Query keys (`getV1ProvidersQueryKey({ ... })`)

Modules wrap these with domain-friendly names. You never write `fetch`,
`useQuery`, or `Authorization` headers.

```ts
// 95% of mutations are one line
export const useSignInMutation = () => useMutation(postV1AuthSignInMutation());
```

### Architecture enforced by code, not docs

| Tool                       | When                 | Catches                                       |
| -------------------------- | -------------------- | --------------------------------------------- |
| `eslint-plugin-boundaries` | Editor + `pnpm lint` | Deep imports, layer violations, cross-feature |
| `dependency-cruiser`       | `pnpm dep:check`     | Circular deps, full-project boundary check    |
| `commitlint`               | `commit-msg` hook    | Conventional Commits format                   |
| `lint-staged`              | `pre-commit` hook    | Lint + format only changed files              |

### Three-layer architecture, one-way imports

```
pages (app/)   — thin orchestrators (no business logic)
modules/       — entity + features (flat, no nesting)
common/        — UI primitives, utils, composables
└── sdk/       — auto-generated, never edit
```

No `widgets/` layer (Nuxt layouts cover composition). No nested modules (use
name prefixes for hierarchy).

### Code generators, not boilerplate

```bash
pnpm plop module     # entity skeleton
pnpm plop feature    # action + UI + hook + index
pnpm plop page       # thin page orchestrator
pnpm plop component  # UI primitive
pnpm plop util       # picks the domain folder for you
```

---

## 🏗️ Architecture

```
src/
├── app/                         # Nuxt app layer
│   ├── pages/                   # file-based routes — orchestrators
│   ├── layouts/                 # default, auth
│   ├── middleware/              # route guards (auth)
│   └── plugins/                 # toast, query-client
│
├── modules/                     # business logic by domain
│   └── (group)/<entity>/
│       ├── entity/              # types, domain predicates, queries, schemas
│       ├── features/            # <action>/ → mutation + hook + UI + index
│       └── index.ts             # public API (no deep imports allowed)
│
├── common/                      # cross-cutting (no module/app imports)
│   ├── api/                     # SDK + client config + query-client
│   ├── components/              # UI primitives (atoms, molecules)
│   ├── composables/             # Vue hooks
│   ├── routing/                 # app-router (typed)
│   ├── validation/              # TypeBox + vee-validate resolver
│   └── utils/                   # by domain: dates, errors, objects, styles, currency
│
├── configs/                     # env-backed config
└── types/                       # shared types (UUID, pagination)

tests/
├── unit/                        # pure functions (domain, utils)
├── integration/                 # composables, stores, components
├── e2e/                         # Playwright flows
└── helpers/                     # test factories, render helpers
```

**Read [`.claude/ARCHITECTURE.md`](./.claude/ARCHITECTURE.md) before creating
any new file.** Decision tree included.

---

## ✅ Features

**Core**

- Nuxt 4 + Vue 3 (Composition API, `<script setup>`)
- TypeScript strict mode
- Generated SDK from OpenAPI (`@hey-api/openapi-ts`)
- TanStack Query for server state + Pinia for client state
- vee-validate + TypeBox for forms
- shadcn-vue + reka-ui + Tailwind 4

**Auth**

- JWT access + refresh with race-safe token refresh
- Cookie-based session
- Global route middleware with safe redirect
- Auto-retry on 401 with refresh queue

**Architecture**

- ESLint boundaries (editor) + dependency-cruiser (CI)
- Plop generators for module / feature / page / component / util
- Strict layering: entity → features, never the other way
- Cross-module imports through `index.ts` only

**Quality**

- vitest (unit + integration) with happy-dom + @vue/test-utils
- Playwright for E2E
- Coverage via `@vitest/coverage-v8`
- Storybook for component documentation
- ESLint + Prettier + commitlint + lint-staged + Husky

**DX**

- Plop scaffolding (`pnpm plop`)
- Background dev hooks via `.claude/`
- Conventional Commits enforced
- Architecture-as-graph (`pnpm dep:graph`)

---

## 🧰 Stack

|                  |                                                   |
| ---------------- | ------------------------------------------------- |
| **Framework**    | Nuxt 4 + Vue 3                                    |
| **Language**     | TypeScript (strict)                               |
| **HTTP**         | `@hey-api/client-ofetch` + auto-generated SDK     |
| **Server state** | TanStack Query (`@tanstack/vue-query`)            |
| **Client state** | Pinia (setup stores only)                         |
| **Forms**        | vee-validate + TypeBox + custom resolver          |
| **UI**           | shadcn-vue + reka-ui + Tailwind 4                 |
| **Icons**        | lucide-vue-next                                   |
| **Dates**        | dayjs                                             |
| **Tests**        | Vitest + @vue/test-utils + happy-dom + Playwright |
| **Boundaries**   | eslint-plugin-boundaries + dependency-cruiser     |
| **Pkg manager**  | pnpm only                                         |

---

## 📦 Module Structure

```
modules/(bookings)/bookings/
├── entity/
│   ├── bookings.types.ts        # type aliases over SDK types
│   ├── bookings.domain.ts       # canCancel(), formatPrice(), StatusLabel
│   ├── bookings.queries.ts      # useBookingsListQuery, useBookingDetailQuery, BOOKING_QUERY_KEYS
│   └── index.ts
│
├── features/
│   ├── create-booking/
│   │   ├── create-booking.schema.ts
│   │   ├── create-booking.mutation.ts
│   │   ├── use-create-booking.ts          # form + toast + redirect
│   │   ├── create-booking-form.vue
│   │   └── index.ts
│   ├── cancel-booking/
│   │   ├── cancel-booking.mutation.ts
│   │   ├── use-cancel-booking.ts
│   │   ├── cancel-booking-button.vue      # self-contained: includes canCancel check
│   │   └── index.ts
│   └── ...
│
└── index.ts                                # explicit public API (no export *)
```

---

## ⚡ Quick Start

```bash
# 1. Install (Node 24+)
corepack enable
pnpm install

# 2. Configure env
cp .env.example .env

# 3. Generate SDK from backend (backend at http://localhost:3100)
pnpm gen:sdk

# 4. Run dev → http://localhost:3000
pnpm dev
```

---

## 📋 Commands

```bash
# Development
pnpm dev                     # Dev with HMR
pnpm build                   # Production build
pnpm preview                 # Preview prod build

# Quality
pnpm check:types             # vue-tsc --noEmit
pnpm lint                    # ESLint (includes boundaries)
pnpm lint:fix                # ESLint + autofix
pnpm prettier:fix            # Format all files

# Tests
pnpm test                    # Vitest in watch mode
pnpm test:unit               # Unit only
pnpm test:integration        # Integration only
pnpm test:e2e                # Playwright E2E
pnpm test:coverage           # Coverage report

# Architecture
pnpm dep:check               # CI-grade dependency rules check
pnpm dep:report              # HTML report of violations
pnpm dep:graph               # SVG graph (needs `brew install graphviz`)

# Generation
pnpm gen:sdk                 # Regenerate SDK from OpenAPI
pnpm plop                    # Scaffold module / feature / page / component

# Storybook
pnpm storybook               # http://localhost:6006
```

---

## 🛠️ Developer Experience

- **Plop generators** — every artifact has a generator that follows project
  conventions
- **Architecture-as-code** — boundaries enforced in editor + CI, not in docs
- **HMR** — Nuxt dev server with instant feedback
- **VS Code / Cursor** — workspace settings configured
- **Claude Code** — full `.claude/` configuration with hooks, agents, skills,
  commands

---

## 🤖 Claude Code

This project includes a full `.claude/` configuration:

- **Hooks** — branch protection, post-edit format, pre-bash guards, cost
  tracking, session logs
- **Skills** — TanStack patterns, Pinia patterns, vee-validate + TypeBox, Vue 3
  component patterns, Storybook patterns, API client patterns
- **Agents** — planner, component-builder, accessibility-auditor,
  bundle-watcher, security-auditor, code-archaeologist, defender / attacker /
  judge (debate review)
- **Commands** — `/spec`, `/new-module`, `/new-component`, `/review-debate`,
  `/reflect`, `/standup`, `/tdd`

See [`.claude/ARCHITECTURE.md`](./.claude/ARCHITECTURE.md),
[`.claude/ELEGANCE.md`](./.claude/ELEGANCE.md),
[`.claude/REFLECTIONS.md`](./.claude/REFLECTIONS.md).

---

## 📚 Further Reading

- [Architecture rules](./.claude/ARCHITECTURE.md) — single source of truth
- [Elegance bar](./.claude/ELEGANCE.md) — before abstracting, read this
- [Reflections](./.claude/REFLECTIONS.md) — lessons learned, append-only
- [`docs/`](./docs/) — project structure, env, error handling, FAQ

---

## 📄 License

MIT

---

**Architecture is hard. Tools should enforce it. Pages should stay thin.**
