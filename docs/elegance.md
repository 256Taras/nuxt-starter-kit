# Elegance Rules

> Code is read far more than it is written. Every extraction must make the
> reader's job easier — never just the writer's. Three similar lines beat a
> premature abstraction.

This document is the distilled standard we've converged on after multiple
refactoring passes. Read it before proposing any new abstraction.

## 1. The elegance bar — before abstracting

Create a component / composable / utility only if **at least one** holds:

- **Reuse**: ≥4 near-identical callsites of ≥4-line blocks, OR ≥3 callsites of
  ≥15-line blocks.
- **Semantics**: the extracted name makes code read like prose —
  `<BackLink to>`, `useRouteId("x")`, `runWithToast(...)`.
- **Bug surface**: the pattern has a real footgun that centralisation fixes —
  focus trap, a11y wiring, token refresh, cache invalidation order.

If none holds — **inline**. "It would be nicer to hide this boilerplate" is not
a reason.

## 2. Hard "no" list — already tried, rejected

Do not propose these. We've been here.

- Monolithic page scaffolds — `DetailPageLayout`, `ListPageLayout`. Slots
  proliferate, pages diverge.
- Wrappers around TanStack Query's `loading/error/data` triple. The library API
  _is_ the abstraction.
- Per-page composables (`useXxxPage`) when the page has ≤3 mutations and no
  shared state. Indirection without callsite reuse.
- Form builders / schema-to-UI generators.
- Options API anywhere.
- `enum` keyword — use `as const` objects.
- `any` type — use `unknown` and narrow.
- `reactive()` for simple state — use `ref`.
- `watch` for derived state — use `computed`.
- Commented-out code, `console.log`, `// TODO: remove` markers.
- `export *` from barrel files.
- Hand-written HTTP / DTOs — go through the generated SDK.
- Data fetching in `onMounted()` — use `useQuery`.
- Module-scoped `let` for state — use `ref` inside a composable.
- `TableRow` / `TableHeadCell` / `FormGrid` slot wrappers — add nesting without
  clarity.
- `.heading-1` / `.card-body` utility classes — replacing three Tailwind classes
  with one is not a win.
- `watch(source, (s) => { if (s) setValues(...) }, { immediate: true })` →
  `watchEffect` — current form is more readable.
- Branded `Minutes` / runtime UUID regex guards — premature defensive coding.
- `useFormHydration` composable across edit pages — 5 lines of inline
  `watch + setValues` reads fine.
- Splitting `authentication.queries.ts` into 3 files — 6 mutations cohesive to
  auth domain.
- Renaming `d`/`val`/`vars` inside 2-line map callbacks or TanStack `onSuccess`
  handlers — bikeshedding.

## 3. Module architecture — strict layering

A module is a thin wrapper over the auto-generated SDK.

| Layer               | Contains                                                                                  | Forbidden                                   |
| ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| `<name>.types.ts`   | type aliases from SDK, `as const` enums                                                   | labels, colors, formatters, predicates      |
| `<name>.domain.ts`  | predicates (`canCancel`), formatters (`formatPrice`), `XxxStatusLabel` / `XxxStatusColor` | Vue / TanStack / Pinia imports              |
| `<name>.queries.ts` | `useXxxQuery`, `useXxxMutation`, query keys, cache invalidation                           | toast, routing, i18n strings, store imports |
| `<name>.store.ts`   | Pinia setup store — only reactive _client_ state + setters                                | pure functions, API calls, server data      |

**Rule that decides store vs local `ref`:** must the state survive navigation
between different pages?

- Yes → store.
- No → `ref` in the page.

**Tiny modules (≤2 endpoints)** may live flat (`<name>.types.ts`,
`<name>.queries.ts`, `<name>.domain.ts`, `index.ts`). `.domain.ts` is still
required if there are any formatters or labels.

**One-way dependency:** store may import queries, queries must never import
store.

**Cross-module invalidation** imports query keys from the other module's
`index.ts`. Never deep-import.

## 4. Types discipline

- SDK types are the source of truth. Domain types are one-line aliases:
  `export type Booking = GetV1BookingsByIdResponse`.
- Never hand-write a DTO.
- `UUID` is branded. Cast once at the boundary (`useRouteId` /
  `useQueryParam<UUID>`), never in business logic.
- Remove index signatures from SDK list items via
  `Pick<Required<T>, "k1" | "k2">`.
- Prefer `type` over `interface` unless extending.
- SDK fields typed as `string | unknown` simplify to `unknown` — use safe
  formatters (`formatDateTimeOrFallback(val, fallback)`) and narrow with
  `typeof`.
- Shared cross-module shapes live in `#src/types` (e.g.,
  `UpdateMutationVars<TBody>`).
- Every exported composable / util has an explicit return type.

## 5. The canonical mutation handler

Every page-level mutation goes through `runWithToast`:

```ts
const onSubmit = handleSubmit(async (values) => {
  const ok = await runWithToast(mutation.mutateAsync, values, {
    success: "X created",
    error: "Failed to create X",
  });
  if (ok) await pushTo.x.list();
});
```

- No raw `try/catch + toast.success/error + formatApiError`.
- No `apiError: ref<string>` with inline red divs.
- Messages belong on the page (i18n-ready), not in `queries.ts`.
- If the mutation needs a side effect (e.g., `authStore.setCredentials`), wrap
  it in a closure and pass that closure to `runWithToast`:

```ts
async function signInAndStore(values: SignInFormValues) {
  const credentials = await signInMutation.mutateAsync(values);
  authStore.setCredentials(credentials);
}
const ok = await runWithToast(signInAndStore, values, { ... });
```

## 6. Form conventions

- Schema: TypeBox, inline in the page if <6 fields.
- Resolver: `toTypeBoxResolver(Schema)`.
- Every field: `<FormField id label :error v-slot="field">` wrapping the input.
  Spread `{ ...xAttrs, ...field }` onto the input so `aria-describedby` /
  `aria-invalid` flow through.
- Initial values: include every optional field explicitly as `""`. Never leave
  some implicit.
- Before submit: `stripEmpty({ optional1, optional2 })` to drop empty strings.
- Submit button disabled: `createMutation.isPending.value || !meta.valid`.
- Hydrate edit forms with
  `watch(data, s => { if (s) setValues(...) }, { immediate: true })` — inline,
  no composable.

## 7. Detail / list page conventions

- `const xId = useRouteId("route-name")` — never `useRoute() + computed + cast`.
- Query param IDs: `useQueryParam<UUID>("serviceId")` — never `Array.isArray`
  ternary.
- Data cells: `<DataField label="X">{{ value }}</DataField>`.
- Status pills:
  `<StatusBadge :class="XxxStatusColor[x.status]">{{ XxxStatusLabel[x.status] }}</StatusBadge>`.
- Back navigation: `<BackLink :to="routes.x.list()">Back to X</BackLink>`.
- Page titles + actions:
  `<PageHeader title="X"><template #actions>...</template></PageHeader>`.
- Focus-trapped overlays: `const { isOpen, dialogRef } = useFocusTrapOnOpen()`.
  Binds `isOpen` to `v-if` and `dialogRef` to the overlay's root. Tab/Shift-Tab
  trap is built in.
- Empty state is a first-class branch (`v-if="items.length === 0"`), not an
  afterthought.
- Offset paging: `<Pagination>`. Cursor paging: `<CursorPagination>`.
- Narrow list-item types with a `computed`, not inline `as` cast in `v-for`.

## 8. Button / link composition

- **`<NuxtLink><Button>` is forbidden** — it produces invalid `<a><button>`
  nesting and double-tab focus.
- Use `<Button as-child><NuxtLink>...</NuxtLink></Button>` — shadcn-vue renders
  the button styling directly on the `<a>`.

## 9. Vue idiom rules

- `<script setup>` only.
- Read store state directly in templates. Don't wrap `authStore.isAuthenticated`
  in a redundant `computed`.
- `storeToRefs` only for reactive state, never for actions.
- Destructure props; don't spread them manually.
- Template attribute order: `id`, `for`/`to`, data props, `v-model`, `v-bind`,
  handlers, `class`.
- No `v-if` + `v-for` on the same element.
- No inline class ternaries longer than ~60 chars — move to a `Record` map in
  domain.
- No prop mutation — emit events up.
- No `provide/inject` before ≥2 levels of prop drilling appear.

## 10. Composable / component return shapes

- Flat return, ≤6 fields, no `// ─── section ───` comment headers.
- If you want to group with comments → split into two composables instead.
- Composables return **named objects**, not tuples.
- Never return mutation objects whole. Return what callers need: `confirm`,
  `isConfirming`.
- Refs come out as refs. Don't unwrap in the composable just to rewrap in the
  page.

## 11. Naming

- **Files**: kebab-case always — including `.vue` (`back-link.vue`,
  `use-route-id.ts`).
- **Components in templates**: PascalCase (`<BackLink>`, `<FormField>`).
- **Composables**: `useXxx`, must return an object.
- **Predicates**: `canX` / `isX` / `hasX` → `boolean`.
- **Formatters**: `formatX` → `string`.
- **Mutation hooks**: domain-named, not SDK-named (`useCancelBookingMutation`,
  not `usePatchV1BookingsByIdCancelMutation`).
- **Query keys**: `X_QUERY_KEYS.lists()`, `X_QUERY_KEYS.detail(id)`.
- **Status triples**: `XStatus` (`as const`) + `XStatusLabel` + `XStatusColor`
  live together in `<name>.domain.ts`.

## 12. Elegance sweep — things to delete when touching a file

- Unused imports (especially `Label`, `computed`, `ref`, `useRoute` left behind
  after refactor).
- Redundant `computed` wrappers around already-reactive store getters.
- `let someVar` at module scope where a `ref` is correct.
- Comments that restate what the code does. Comments explain **why**, never
  **what**.
- `v-if` + `v-for` on the same element.
- Empty `.value` deref in a template.
- `// TODO: remove` markers for code already replaced elsewhere.

## 13. The pause-before-abstracting test

Before extracting, answer all three out loud:

1. How many callsites **exist today** (not "might exist")? If <4, stop.
2. Does the extracted name let the reader skip reading the body? If no, stop.
3. Does the inline version work fine? If yes, stop — inline is the default.

Only if all three pass: extract.

## 14. Commit discipline

- One refactor = one commit. Never mix refactor + feature.
- `feat(scope)` / `fix(scope)` / `refactor(scope)` / `chore(scope)`.
- Commit body answers **why**, not **what** — the diff already shows what.
- Never `--no-verify` unless explicitly told.

## 15. Session gate — before declaring done

1. `npx nuxi typecheck` — zero errors in business code (storybook noise
   acceptable as a known tracked item).
2. No `formatApiError` + raw `try/catch + toast` left on any page.
3. No raw `Label + Input + error <p>` triples — all `<FormField>`.
4. No `route.params.id as UUID` inline — all `useRouteId`.
5. No `<NuxtLink><Button>` nesting — all `<Button as-child>`.
6. No module-scoped `let` for state.
7. Append one line to `.claude/REFLECTIONS.md` if anything surprised you:
   `[YYYY-MM-DD] [domain] lesson`.

## Established helpers (reference)

| Path                                                                                                    | Purpose                                                    |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [src/common/utils/errors/run-with-toast.ts](../src/common/utils/errors/run-with-toast.ts)               | Mutation + toast + boolean result                          |
| [src/common/utils/objects/strip-empty.ts](../src/common/utils/objects/strip-empty.ts)                   | Prune `""`/`null`/`undefined` from form payloads           |
| [src/common/utils/dates/format-date.ts](../src/common/utils/dates/format-date.ts)                       | `formatDateTime`, `formatDate`, `formatDateTimeOrFallback` |
| [src/common/utils/currency/format-currency.ts](../src/common/utils/currency/format-currency.ts)         | Cached `Intl.NumberFormat` USD                             |
| [src/common/utils/errors/format-api-error.ts](../src/common/utils/errors/format-api-error.ts)           | SDK error → user-facing string                             |
| [src/common/composables/use-route-id.ts](../src/common/composables/use-route-id.ts)                     | Typed `ComputedRef<UUID>` from route params                |
| [src/common/composables/use-query-param.ts](../src/common/composables/use-query-param.ts)               | Normalised query-string param                              |
| [src/common/composables/use-focus-trap-on-open.ts](../src/common/composables/use-focus-trap-on-open.ts) | Dialog focus trap + Tab cycling                            |
| [src/common/components/atoms/status-badge/](../src/common/components/atoms/status-badge/)               | `<StatusBadge size>` pill                                  |
| [src/common/components/molecules/form-field/](../src/common/components/molecules/form-field/)           | Label + slot + error + aria wiring                         |
| [src/common/components/molecules/back-link/](../src/common/components/molecules/back-link/)             | Back navigation link                                       |
| [src/common/components/molecules/data-field/](../src/common/components/molecules/data-field/)           | Label + value detail cell                                  |
| [src/common/components/molecules/page-header/](../src/common/components/molecules/page-header/)         | Title + actions slot                                       |
| [src/common/components/molecules/pagination/](../src/common/components/molecules/pagination/)           | `<Pagination>` (offset), `<CursorPagination>`              |
| [src/types/api.types.ts](../src/types/api.types.ts)                                                     | `UUID`, `UpdateMutationVars<T>`, pagination types          |
