## Active Context (Auto-loaded)

@.claude/REFLECTIONS.md @.claude/SESSION_STATE.md

**Full rules** (read on demand, not auto-loaded):

- [`docs/architecture.md`](docs/architecture.md) — canonical architecture,
  decision trees
- [`docs/elegance.md`](docs/elegance.md) — elegance bar, when NOT to abstract
- [`docs/frontend-best-practices.md`](docs/frontend-best-practices.md) — full
  anti-patterns list

## Working Style

1. **REFLECTIONS first.** For non-trivial tasks, apply lessons from
   `.claude/REFLECTIONS.md`.
2. **PRP or no work.** Anything > 1-line fix needs a PRP in `PRPs/`, or invoke
   `planner` first.
3. **Append to REFLECTIONS on every fix.** Format:
   `[YYYY-MM-DD] [domain] one-sentence lesson`.
4. **No `any`. No `console.log`. No commented-out code.**
5. **`/clear` between unrelated tasks.**

## Hard Forbidden

- Edits to `.env*` / on `main`/`master`/`develop` (blocked by hook)
- Disabling tests to make them pass
- `export *` in index.ts
- Options API anywhere
- Manual HTTP / DTOs — go through generated SDK

## Stack

Nuxt 4 · Vue 3 (`<script setup>`) · TypeScript strict · pnpm · TanStack Query
(server state) · Pinia setup stores (client state) · `@hey-api/client-ofetch` +
`@hey-api/openapi-ts` (generated SDK) · vee-validate + TypeBox · shadcn-vue +
reka-ui + Tailwind 4 · lucide-vue-next · dayjs

Backend: Fastify at `http://localhost:3100`.

## Architecture (quick-ref)

Three layers, one-way imports:

```
pages (app/)  → thin orchestrators
modules/      → entity/ + features/ (flat, no nesting)
common/       → UI primitives, utils, composables
└── sdk/      → auto-generated, never edit
```

**Rules (summary — full in `docs/architecture.md`):**

- Module = one backend entity, not a feature.
- Feature = one user action (mutation + UI + side effects).
- Pages never import SDK, `@sinclair/typebox`, `useMutation`, or module
  internals (only `index.ts`).
- `entity/` holds types, domain predicates, queries, schemas.
- `features/<action>/` holds mutation + hook + UI + index.
- Enforced by `dependency-cruiser` (`pnpm dep:check`) and ESLint `pagesGuard`.
- `common/` never imports from `modules/` or `app/`.
- No `widgets/` layer — chrome lives in layouts, composites in primary module.

## Project Structure

```
src/
├── app/                     # Nuxt app layer
│   ├── pages/               # file-based routes (thin)
│   ├── layouts/             # default, auth
│   ├── middleware/          # route guards
│   └── plugins/             # toastify, query-client, auth-hydrate, error-handler
├── modules/(group)/<entity>/
│   ├── entity/              # types, domain, queries, schemas
│   ├── features/<action>/   # mutation + hook + UI + index
│   └── index.ts             # public API
├── common/
│   ├── api/                 # SDK + client + query-client
│   ├── components/          # UI primitives (atoms, molecules)
│   ├── composables/         # Vue hooks
│   ├── routing/             # app-router
│   ├── validation/          # TypeBox + resolver + useTypeBoxForm
│   └── utils/<domain>/      # dates, errors, objects, styles, currency
├── configs/                 # env-backed config
└── types/                   # UUID, pagination
```

## Mutation pattern

```ts
// 1. Use generated SDK mutation options directly when possible
export const useSignInMutation = () => useMutation(postV1AuthSignInMutation());

// 2. Spread + add onSuccess for cache invalidation
export function useDeleteProviderMutation() {
  const qc = useQueryClient();
  return useMutation({
    ...deleteV1ProvidersByIdMutation(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() }),
  });
}

// 3. Custom mutationFn only when body needs serialization (stripEmpty, toISOString)
```

Callers use `{ path, body, query }` shape matching SDK contract.

## Page pattern

```ts
// Pure orchestrator: import feature components + entity hooks, nothing else.
const { data, items, isLoading, isError, error, refetch } =
  useProvidersListQuery(params);
// <SkeletonList v-if="isLoading" /> → <ErrorState v-else-if="isError" @retry="refetch()" />
// → <EmptyState v-if="items.length === 0" /> → table
```

## Page-Specific Components

Dot-prefix folder (Nuxt 4 ignores):
`app/pages/profile/.components/profile-card.vue`. `_components/` and
`(components)/` DO NOT work (they generate routes).

## Adding a feature

```bash
pnpm plop module     # entity skeleton
pnpm plop feature    # <action>-<entity>/ with mutation + hook + button + index
pnpm plop util       # util in utils/<domain>/
pnpm plop component  # UI primitive
```

## Elegance bar (before abstracting)

**Extract only if** ≥4 near-identical callsites OR semantic win OR bug surface
(focus trap, cache invalidation). Otherwise inline. Full list:
`docs/elegance.md`.

**Rejected patterns (don't propose):**

- `<ListPageLayout>` / `<DetailPageLayout>` monoliths
- Wrappers around TanStack `{loading, error, data}`
- Per-page composables for ≤3 mutations
- Form builders / schema-to-UI generators

## Commands

```bash
pnpm dev                # dev (HMR, SSR)
pnpm build              # prod build
pnpm check:types        # vue-tsc
pnpm lint / lint:fix    # ESLint
pnpm test               # vitest watch
pnpm test:coverage      # vitest + coverage
pnpm test:e2e           # playwright
pnpm dep:check          # architecture boundaries
pnpm gen:sdk            # regenerate SDK from OpenAPI
pnpm plop               # scaffolding
```

## Naming

Files: kebab-case always (incl. `.vue`). Components in templates: PascalCase.
Composables: `useXxx()`. Types: PascalCase. Constants: `as const` objects.

## Commit Convention

```
<type>(<scope>): <short summary>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `chore`.

## Available Subagents

`planner` · `component-builder` · `code-archaeologist` ·
`defender`/`attacker`/`judge` (debate) · `meta-agent`

## Model strategy

- Main session: sonnet (default)
- Architecture / tricky debugging: opus
- Routine edits / scaffolding: haiku (`/model haiku`)
- Read-only agents: haiku
