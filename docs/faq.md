# FAQ

## Architecture

**Is the FSD methodology used here?**

No. The project uses a pragmatic page-first + modules architecture documented in
[`.claude/ARCHITECTURE.md`](../.claude/ARCHITECTURE.md). Pages are thin
orchestrators. Modules own entity + features. No `widgets/`, no `features/` as a
top-level layer.

**What is a module?**

One backend entity (one API resource). Not a feature, not a page, not a user
story. Examples: `bookings`, `providers`, `services`, `profiles`.

**What is a feature?**

A user action with UI + logic + mutation, scoped to one entity. It lives
**inside** the module, under `features/`. Example: `cancel-booking`,
`create-provider`, `archive-user`.

**Can modules be nested?**

No. Modules live flat at `modules/(group)/<name>/`. Maximum two folder levels.
If entities relate hierarchically, encode it in the name prefix: `mini-courses`,
`mini-course-blocks`, `mini-course-lessons` — not nested.

**When do I create a module vs keep code on the page?**

Create a module only when the code is tied to a backend entity (a table, an API
resource). For page-specific UI and logic, keep it on the page.

**When do I extract a feature out of a page?**

Use the Rule of Three: extract when the same logic appears on 3+ pages, OR when
a user action has meaningful UI + mutation + side effects worth encapsulating.

## Pages

**What can live on a page?**

Imports from modules + common. Composition via `v-if`, `v-for`, props, emit.
Routing helpers (`useRouteId`, `useQueryParam`). Loading/error branches reading
`isLoading`, `isError`, `error` from module hooks. That's it.

**What can NOT live on a page?**

- Mutations called directly (`useMutation` → use a module hook)
- `@sinclair/typebox` imports (`Type`, `Static` → use module schemas)
- Domain predicates like `canCancel(booking)` — the feature component
  self-checks
- `new Date().toISOString()`, `stripEmpty()` — serialization lives in mutations
- `try/catch` + manual `toast.success/error` — use `runWithToast` in a hook
- SDK function calls — always via module queries

If a page's `<script setup>` has more than ~20 lines, you have a leak.

## Types

**Where do types live?**

- SDK auto-generated types in `src/common/api/sdk/` — never edit
- Entity domain types aliased from SDK in
  `modules/<entity>/entity/<name>.types.ts`
- Shared cross-module types in `src/types/api.types.ts` (UUID,
  `UpdateMutationVars<T>`, pagination)

**Do I hand-write DTOs?**

No. SDK types are the source of truth. Always alias from SDK.

**What's `UUID`?**

A branded type: `string & { readonly __brand: "UUID" }`. Cast once at the
boundary (route params, query params) via `useRouteId()` or
`useQueryParam<UUID>()`. Never cast in business code.

## Forms

**Where do form schemas live?**

In `modules/<entity>/features/<action>/<action>.schema.ts` (for feature-specific
forms) or in a shared `modules/<entity>/entity/<name>.schemas.ts` (if reused
across 2+ features).

**Why `<FormField v-slot="field">`?**

So that `aria-describedby` and `aria-invalid` flow to the input automatically.
Screen readers cannot announce field errors otherwise.

**Why pass values (not body) to mutations?**

Because the mutation is the serialization boundary. Pages should never call
`stripEmpty()` or `new Date().toISOString()` — that is the module's job.

## Queries & Mutations

**Where do query keys live?**

In `modules/<entity>/entity/<name>.queries.ts` as `<ENTITY>_QUERY_KEYS` object.
Export from the module's `index.ts` so other modules can invalidate via public
API.

**How do I invalidate another module's cache?**

Import that module's `X_QUERY_KEYS` from its `index.ts`, never deep-import.
Example: `payments` invalidates bookings:

```ts
import { BOOKING_QUERY_KEYS } from "#src/modules/(bookings)/bookings";
queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.detail(id) });
```

**When does a feature get its own query?**

Only if the query is specific to the feature (e.g., a paginated list with
feature-specific filters). Shared queries (list, detail by id) live in
`entity/<name>.queries.ts`.

## Testing

**Are tests required?**

No. Cover critical paths (auth flow, payment submission). Don't chase coverage.

**Which test types?**

- Unit (Vitest) for composables, utils, domain functions
- Component (Vitest + @vue/test-utils) for feature components
- E2E (Playwright) for critical user journeys

## SDK

**When do I run `pnpm gen:sdk`?**

Whenever the backend API changes. Also whenever `check:types` fails with SDK
type errors.

**Can I edit files in `src/common/api/sdk/`?**

No. They are regenerated on every `pnpm gen:sdk` — your edits will be lost.

## Code style

**Do I write JSDoc?**

Only when explaining _why_, not _what_. TypeScript types are self-documenting.

**Do I add `// TODO` comments?**

Avoid. If the thing is worth tracking, open a ticket.

**File naming?**

All kebab-case, including `.vue` files. See
[`.claude/ARCHITECTURE.md`](../.claude/ARCHITECTURE.md) section "File naming"
for the full table.

## Code generation

**How do I scaffold a new module?**

```bash
pnpm plop module
```

Prompts for group and name. Creates the entity skeleton with `TODO` markers.

**How do I scaffold a new feature?**

```bash
pnpm plop feature
```

Prompts for module path, action verb, and entity. Creates mutation + hook +
button + index.

See [`docs/scripts.md`](scripts.md) for all generators.
