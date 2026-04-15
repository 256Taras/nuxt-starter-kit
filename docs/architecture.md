# Architecture

> This document is the **single source of truth** about how code is organized in
> this project. Read it before creating a new file or deciding where code goes.
> It is auto-loaded in every session.

## One-sentence summary

**Pages are thin orchestrators. Modules own business logic (entity + features).
Common holds UI primitives. No `widgets/` layer — composites live in layouts
(chrome) or as feature-composites in the primary module. No nested modules.**

## The three-layer structure

```text
┌──────────────────────────────────────────────────┐
│  PAGES    — orchestrators, no business logic     │
├──────────────────────────────────────────────────┤
│  MODULES  — entity + features (flat, no nesting) │
├──────────────────────────────────────────────────┤
│  COMMON   — UI primitives, layouts, utils        │
├──────────────────────────────────────────────────┤
│  SDK      — auto-generated (never edit)          │
└──────────────────────────────────────────────────┘

Imports: top → bottom only. Never sideways, never bottom → top.
```

## Module structure

Each module represents one backend entity (one API resource).

```text
modules/(group)/<entity-name>/
├── entity/                     # data + rules about the entity
│   ├── <name>.types.ts         #   type aliases from SDK, as-const enums
│   ├── <name>.domain.ts        #   predicates (canCancel), formatters, status maps
│   ├── <name>.queries.ts       #   shared queries/query keys (list, detail)
│   └── index.ts
│
├── features/                   # user actions / reusable UI blocks with logic
│   ├── create-<entity>/
│   │   ├── create-<entity>.mutation.ts
│   │   ├── create-<entity>.schema.ts
│   │   ├── create-<entity>-form.vue
│   │   ├── use-create-<entity>.ts    # orchestration: toast, redirect, invalidate
│   │   └── index.ts
│   ├── cancel-<entity>/
│   │   ├── cancel-<entity>.mutation.ts
│   │   ├── cancel-<entity>-button.vue     # self-contained: includes canCancel check
│   │   ├── cancel-<entity>-dialog.vue
│   │   ├── use-cancel-<entity>.ts
│   │   └── index.ts
│   └── <entity>-list/
│       ├── <entity>-list.queries.ts       # own queries if needed
│       ├── <entity>-list-table.vue
│       ├── use-<entity>-list.ts
│       └── index.ts
│
└── index.ts                    # public API: what pages and other modules may import
```

## Flat hierarchy — no nested modules

**Never** create sub-modules. If entities relate hierarchically, encode it in
the **name prefix**, not the folder structure.

Wrong (nested):

```text
modules/(education)/mini-courses/blocks/lessons/   ❌
```

Right (flat with prefixes):

```text
modules/(education)/
├── mini-courses/
├── mini-course-blocks/         # prefix carries the parent relation
└── mini-course-lessons/        # prefix again
```

Maximum nesting is **2 levels**: `modules/(group)/<module>/`. Never deeper.

## Entity vs Feature

|                                | Entity                                            | Feature                                     |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------- |
| **Purpose**                    | Data + rules about the thing                      | User action / reusable UI block             |
| **Contains**                   | types, domain predicates, shared queries          | mutation, UI, hook, schema                  |
| **Has UI?**                    | No                                                | Yes                                         |
| **Has mutations?**             | No (queries only — list, detail)                  | Yes — one mutation per feature              |
| **Example**                    | `Booking` type, `canCancel`, `BookingStatusLabel` | `<CancelBookingButton>`, `useCancelBooking` |
| **Knows about UI?**            | No                                                | Yes                                         |
| **Knows about toast/routing?** | No                                                | Yes (inside hook)                           |

Entity is the **pure data layer**. Feature is the **vertical slice** of a user
action including its UI, logic, and side effects.

**Entity → Feature** dependency is one-way: features import from entity. Entity
never imports from features.

## Pages — pure orchestrators

A page is a tree of imports from modules + common. Nothing else.

### What pages MAY do

- Import feature components from modules: `<CancelBookingButton>`,
  `<CreateBookingForm>`
- Import entity hooks from modules: `useBookingDetail()`, `useBookingsList()`
- Import UI primitives from common: `<Button>`, `<FormField>`, `<BackLink>`
- Have local `.components/` folder — **only pure presentational UI**, no
  business logic
- Use routing composables: `useRouteId()`, `useQueryParam()`
- Compose components with `v-if`, `v-for`, props, emit
- Show loading / error / empty branches via `isLoading`, `isError`, `error` from
  hooks

### What pages MUST NOT do

- Call `useMutation` or `useQuery` directly → use a module hook
- Import `Type` / `Static` from `@sinclair/typebox` → schemas live in modules
- Call `new Date().toISOString()`, `stripEmpty()` → serialization lives in the
  mutation
- Call domain predicates like `canCancel(booking)` → the feature component
  checks itself
- Import SDK functions directly → always through module queries
- Write `try/catch` around mutations → use `runWithToast` inside a hook
- Show toasts directly → inside hooks
- Import from another page — never

### Size rule

If a page's `<script setup>` is more than **~20 lines**, something is leaking
out of a module. Push it into a feature or an entity hook.

## What pages look like

```vue
<!-- pages/bookings/[id]/index.vue -->
<script setup lang="ts">
import { useRouteId } from "#src/common/composables/use-route-id";
import { useBookingDetailQuery } from "#src/modules/(bookings)/bookings";
import { CancelBookingButton } from "#src/modules/(bookings)/bookings";
import { ConfirmBookingButton } from "#src/modules/(bookings)/bookings";
import { CompleteBookingButton } from "#src/modules/(bookings)/bookings";
import { PayBookingButton } from "#src/modules/(bookings)/payments";
import { BackLink, PageHeader } from "#src/common/components/molecules";

const bookingId = useRouteId("bookings-id");
const {
  data: booking,
  isLoading,
  isError,
  error,
} = useBookingDetailQuery(bookingId);
</script>

<template>
  <BackLink to="/bookings">Back to bookings</BackLink>

  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">{{ error?.userMessage ?? "Failed to load" }}</div>

  <template v-else-if="booking">
    <PageHeader :title="`Booking ${booking.id}`" />
    <div class="flex gap-2">
      <ConfirmBookingButton :booking="booking" />
      <CompleteBookingButton :booking="booking" />
      <PayBookingButton :booking="booking" />
      <CancelBookingButton :booking="booking" />
    </div>
  </template>
</template>
```

Note: page does **not** check `v-if="canCancel(booking)"` — the button itself
decides internally whether to render.

## Layer import rules

```text
Layer    | May import from                      | Never imports
─────────┼──────────────────────────────────────┼──────────────────────────
pages    | modules (via index), common          | other pages, SDK directly,
         |                                      | @sinclair/typebox
modules  | common, SDK, other modules (index)   | pages
common   | SDK types                            | modules, pages
SDK      | nothing (self-contained)             | —
```

### Module internal import rules

Inside a module, layering is also strict:

```text
File              | May import from                      | Never imports
──────────────────┼──────────────────────────────────────┼────────────────
features/*        | entity/, common, SDK, other modules  | other features
                  | via index                            | in same module
entity/queries.ts | entity/types, SDK, other module keys | store, features
entity/domain.ts  | entity/types                         | Vue, Pinia,
                  |                                      | TanStack, SDK funcs
entity/types.ts   | SDK types                            | runtime values
                  |                                      | (except as-const)
```

## High cohesion + low coupling

### Cohesion — everything that changes together lives together

Adding "archive booking" means touching exactly one folder:

```text
modules/(bookings)/bookings/features/archive-booking/
├── archive-booking.mutation.ts
├── archive-booking-button.vue
├── use-archive-booking.ts
└── index.ts
```

No edits anywhere else (except the module's `index.ts` to export).

### Coupling — module internals are hidden

Every module's `index.ts` is its **contract**. The rest is implementation
detail.

```ts
// modules/(bookings)/bookings/index.ts — public API
export {
  useBookingDetailQuery,
  useBookingsListQuery,
  canCancel,
  canConfirm,
  canComplete,
  canPay,
  BOOKING_QUERY_KEYS,
} from "./entity";
export { CreateBookingForm } from "./features/create-booking";
export { CancelBookingButton } from "./features/cancel-booking";
export { ConfirmBookingButton } from "./features/confirm-booking";
export { CompleteBookingButton } from "./features/complete-booking";

// NOT exported: individual mutations, schemas, internal hooks, dialog components
export type { Booking, BookingListItem } from "./entity";
```

Consumers import **only** what's in `index.ts`. Deep imports are forbidden.

### Cross-module dependencies

When `modules/payments` needs to invalidate bookings cache:

```ts
// modules/(bookings)/payments/features/pay-booking/pay-booking.mutation.ts
import { BOOKING_QUERY_KEYS } from "#src/modules/(bookings)/bookings"; // ✅ public API
// NOT: import from "#src/modules/(bookings)/bookings/entity/booking.queries";  ❌
```

## Feature components self-contain visibility

Features decide when they should render. Pages don't check predicates.

```vue
<!-- features/cancel-booking/cancel-booking-button.vue -->
<script setup lang="ts">
import { canCancel } from "#src/modules/(bookings)/bookings";
import type { Booking } from "#src/modules/(bookings)/bookings";
import { useCancelBooking } from "./use-cancel-booking";
// ...

const props = defineProps<{ booking: Booking }>();
const { isOpen, dialogRef, reason, confirm, isPending } = useCancelBooking(
  () => props.booking.id,
);
</script>

<template>
  <template v-if="canCancel(booking)">
    <Button @click="isOpen = true">Cancel booking</Button>
    <CancelBookingDialog
      v-if="isOpen"
      ref="dialogRef"
      v-model:reason="reason"
      :is-pending="isPending"
      @confirm="confirm"
      @close="isOpen = false"
    />
  </template>
</template>
```

## Serialization boundary

Mutations take **form values**. They serialize internally before calling SDK.

```ts
// features/create-booking/create-booking.mutation.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1Bookings } from "#src/common/api/sdk";
import { BOOKING_QUERY_KEYS } from "../../entity/booking.queries";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import type { CreateBookingFormValues } from "./create-booking.schema";
import type { UUID } from "#src/types";

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      serviceId: UUID;
      values: CreateBookingFormValues;
    }) => {
      //                                ^^^^^^^ form values, not API body
      const body = {
        serviceId: vars.serviceId,
        startAt: new Date(vars.values.startAt).toISOString(),
      };
      //                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ serialization here
      const { data } = await postV1Bookings({ body, throwOnError: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.lists() });
    },
  });
}
```

Pages never call `stripEmpty()`, `toISOString()`, or assemble request bodies.

## When to create a module

Create a module **only** when there's a backend entity (an API resource with
types and endpoints). Do not create modules for:

- UI patterns without data (use `common/components/`)
- One-off utilities (use `common/utils/`)
- Page-specific logic (keep on the page)

## When to extract a feature from a page

Start with code on the page. Extract when one of these is true:

- Same logic appears on **3+ pages** (Rule of Three)
- A user action has meaningful UI + mutation + side effects (worth
  encapsulating)
- A UI block composes multiple pieces and could be reused

Tiny pages (about, privacy) stay as plain `.vue` files with `.components/`. No
module, no feature.

## The `common/` layer

### What it contains

- `common/components/` — UI primitives and reusable presentational components
  (Button, Input, FormField, DataField, BackLink, StatusBadge, PageHeader,
  CursorPagination, Pagination, Card, etc.)
- `common/composables/` — generic composables (`useRouteId`, `useQueryParam`,
  `useFocusTrapOnOpen`)
- `common/utils/` — pure helpers (`runWithToast`, `stripEmpty`,
  `formatCurrency`, `formatDate`, `formatApiError`)
- `common/validation/` — shared TypeBox primitives (`EmailSchema`,
  `PasswordSchema`, `RequiredStringSchema`), `toTypeBoxResolver`
- `common/router/` — `useAppRouter` with typed routes
- `common/types/` — `UUID`, `PaginationParams`, `UpdateMutationVars<T>`
- `common/lib/` — shadcn `cn()` utility
- `common/api/` — generated SDK + runtime config

### What `common/` must never contain

- Business entity types (they belong in `modules/<entity>/entity/types.ts`)
- Business predicates (`canCancel`, `isVerified` — belong in `entity/domain.ts`)
- Feature-specific logic
- Module-specific queries or mutations

## Global layout components

`AppHeader`, `AppSidebar`, `Breadcrumbs` go in `common/components/layouts/` or
in the Nuxt layout file itself (`app/layouts/default.vue`). They are not a
module — they are shared app chrome.

## No `widgets/` layer — where composites live

FSD has a `widgets/` layer for UI composites. We deliberately do not have one
because Nuxt layouts already serve as the composition point. When a UI element
composes multiple features, it goes in one of four places depending on shape.

### Decision tree

```text
Is this UI a composite (combines ≥2 features)?
├── NO (one feature) → lives inside that feature's module
│
└── YES
    │
    Is it app chrome (header / footer / sidebar / nav)?
    ├── YES → app/layouts/default.vue
    │         or common/components/layouts/app-header.vue (if shared across layouts)
    │         or app/layouts/.components/app-header.vue (if layout-specific)
    │
    └── NO
        │
        Is it a global overlay rendered once at the root?
        │ (toast container, command palette, cookie banner, chat widget)
        ├── YES → mount in app.vue (or in layout once)
        │         component itself lives in the "primary" module as a feature
        │         e.g. modules/(search)/search/features/command-palette/
        │
        └── NO
            │
            How many pages use it?
            ├── 1 page       → pages/xxx/.components/<name>.vue
            ├── 2–3 pages    → page-level (still .components, consider extraction)
            └── 4+ pages     → feature-composite in "primary" module
                               e.g. modules/(marketplace)/products/features/
                                    related-products/
```

### "Primary" module for a composite

A composite belongs to the module of the dominant business entity it operates
on. Examples:

| Composite              | Combines                        | Primary module                           |
| ---------------------- | ------------------------------- | ---------------------------------------- |
| `<RelatedProducts>`    | products + reviews + cart       | `modules/(marketplace)/products/`        |
| `<OrderSummaryCard>`   | order + payments + user         | `modules/(bookings)/orders/`             |
| `<ChatWidget>`         | chat + presence + support       | `modules/(support)/chat/`                |
| `<CommandPalette>`     | search + navigation + shortcuts | `modules/(search)/search/`               |
| `<NotificationsPanel>` | notifications + user            | `modules/(notifications)/notifications/` |

If no primary module is obvious, the composite probably belongs in
`pages/<page>/.components/`, not in a module.

### Examples

**Header with many features** (log-out, user menu, search, cart, notifications):
layout composes feature components, layout owns no logic.

```vue
<!-- app/layouts/default.vue -->
<template>
  <header>
    <AppLogo />
    <GlobalSearch />
    <!-- from modules/(search)/search -->
    <NotificationsBell />
    <!-- from modules/(notifications)/... -->
    <CartBadge />
    <!-- from modules/(commerce)/cart -->
    <UserMenu />
    <!-- from modules/(users)/profiles -->
    <LogOutButton />
    <!-- from modules/(users)/authentication -->
  </header>
  <main><slot /></main>
</template>
```

**Command palette** (global overlay): feature in the `search` module, mounted
once at app root.

```
modules/(search)/search/features/command-palette/
├── command-palette.vue
├── use-command-palette.ts             # keyboard shortcut + open/close state
└── index.ts
```

```vue
<!-- app.vue -->
<NuxtLayout><NuxtPage /></NuxtLayout>
<CommandPalette />
```

**Related products** (composite, 4+ pages use it): feature-composite in the
products module.

```
modules/(marketplace)/products/features/related-products/
├── related-products.vue               # composes ProductCard + AddToCartButton
├── use-related-products.ts
└── index.ts
```

### Forbidden

- ❌ Creating a chrome module (`modules/(chrome)/header/`) — chrome has no
  backend entity, it does not fit the module definition.
- ❌ Creating a `widgets/` layer — duplicates Nuxt layouts + pages.
- ❌ Putting business logic (mutations, predicates, API calls) inside a layout
  file — layouts only compose. Logic stays in features.

## File naming

| File           | Pattern                        | Example                                               |
| -------------- | ------------------------------ | ----------------------------------------------------- |
| Vue components | kebab-case                     | `cancel-booking-button.vue`                           |
| TypeScript     | kebab-case with purpose suffix | `use-cancel-booking.ts`, `cancel-booking.mutation.ts` |
| Types          | `<name>.types.ts`              | `booking.types.ts`                                    |
| Schemas        | `<name>.schema.ts`             | `create-booking.schema.ts`                            |
| Domain         | `<name>.domain.ts`             | `booking.domain.ts`                                   |
| Queries        | `<name>.queries.ts`            | `booking.queries.ts`                                  |
| Mutations      | `<action>.mutation.ts`         | `cancel-booking.mutation.ts`                          |

## Component naming

| Kind                 | Pattern                                 | Example                                                              |
| -------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| Feature UI           | `<Action><Entity><Suffix>` (PascalCase) | `<CancelBookingButton>`, `<CreateBookingForm>`, `<BookingListTable>` |
| Entity-bound UI card | `<Entity><Suffix>`                      | `<BookingDetailsCard>`, `<UserProfileCard>`                          |
| Generic UI           | plain noun                              | `<Button>`, `<FormField>`, `<DataField>`                             |

## Decision tree: where does this code go?

```text
Is it a backend entity (API resource)?
├── YES → modules/(group)/<entity>/entity/
│
└── NO
    │
    Is it a user action (mutation + UI)?
    ├── YES → modules/(group)/<entity>/features/<action>/
    │
    └── NO
        │
        Is it app chrome (header/footer/sidebar)?
        ├── YES → app/layouts/ or common/components/layouts/
        │         (see "No widgets/ layer" section)
        │
        └── NO
            │
            Is it a global overlay (rendered once at root)?
            │ (toast container, command palette, cookie banner)
            ├── YES → feature in primary module,
            │         mounted in app.vue
            │
            └── NO
                │
                Is it a composite of ≥2 features used on 4+ pages?
                ├── YES → feature-composite in primary module
                │
                └── NO
                    │
                    Is it a reusable UI block with business data?
                    ├── YES → modules/(group)/<entity>/features/<name>/
                    │
                    └── NO
                        │
                        Is it a generic UI primitive?
                        ├── YES → common/components/
                        │
                        └── NO
                            │
                            Is it a pure utility (format, strip, etc.)?
                            ├── YES → common/utils/<domain>/
                            │
                            └── NO
                                │
                                Is it specific to one page?
                                └── YES → pages/<page>/.components/
```

## Anti-patterns (forbidden)

- Creating a module for a feature (module = entity, not feature)
- Nested modules (`modules/a/sub/b/` — never)
- Page importing `useMutation`, `useQuery`, or SDK functions directly
- Page importing `@sinclair/typebox`
- Page constructing API body (`stripEmpty`, `toISOString`, body assembly)
- Page calling domain predicates (`canCancel` — feature component decides)
- `try/catch` + manual toast on pages (use `runWithToast` in hooks)
- `<NuxtLink><Button>` nesting (use `<Button as-child>`)
- Deep imports across modules (always via `index.ts`)
- Entity importing from features
- Features importing each other in the same module
- `common/` containing business domain types or predicates
- `export *` from any `index.ts`
- Manual SDK edits (it's generated — run `pnpm gen:sdk`)
- Creating a `widgets/` layer — use layouts + feature composites instead
- Creating a chrome module (`modules/(chrome)/header/`) — chrome is not an
  entity
- Business logic (mutations, predicates, API) inside a layout file

## Session gate — before declaring done

1. `npx nuxi typecheck` — zero errors in business code
2. No business logic on pages (no mutations, predicates, schemas, body assembly)
3. No direct SDK imports from pages
4. No TypeBox imports on pages
5. All cross-module imports go through `index.ts`
6. Feature components self-check visibility (no `v-if="canX(thing)"` on pages)
7. Append a line to `.claude/REFLECTIONS.md` if anything surprised you
