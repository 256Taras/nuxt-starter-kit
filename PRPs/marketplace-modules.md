# PRP: Marketplace Frontend Modules

**Ticket:** marketplace-modules **Date:** 2026-04-10 **Complexity:** Large (5
modules, ~50 files)

---

## Goal

Implement five frontend business modules for a service marketplace app using the
4-layer hook chain pattern. Modules integrate with an existing Nuxt 4 / Vue 3
codebase that has auth, profiles, and users already working.

---

## Context

- Backend: `http://localhost:8000`, OpenAPI types at
  `src/common/api/generated/api-schema.ts`
- `components["schemas"]` is `never` in the generated schema; all types must be
  extracted from `paths[...].responses` and `paths[...]["post"].requestBody`
  inline shapes using `paths` key access
- `useHttpClient` already has `patch` method
- `CursorPaginationParams`, `CursorPaginatedResponse`, `CursorPaginationMeta`
  already defined in `src/types/index.ts`
- Existing module reference: `src/modules/(users)/profiles/` — follow its
  structure exactly (queries/ not composables/, types/ not model/)
- Router lives in `src/common/routing/app-router.ts`
- Navigation lives in `src/app/layouts/default.vue`

---

## Affected Modules

| Path                                   | Status   |
| -------------------------------------- | -------- |
| `src/modules/(marketplace)/providers/` | New      |
| `src/modules/(marketplace)/services/`  | New      |
| `src/modules/(bookings)/bookings/`     | New      |
| `src/modules/(bookings)/payments/`     | New      |
| `src/modules/(bookings)/reviews/`      | New      |
| `src/common/routing/app-router.ts`     | Modified |
| `src/app/layouts/default.vue`          | Modified |

---

## Type Extraction Pattern

```typescript
import type { paths } from "#src/common/api/generated/api-schema";

export type Provider =
  paths["/v1/providers/{id}"]["get"]["responses"][200]["content"]["application/json"];

export type ProviderCreateInput =
  paths["/v1/providers/"]["post"]["requestBody"]["content"]["application/json"];

export type ProviderUpdateInput = NonNullable<
  paths["/v1/providers/{id}"]["patch"]["requestBody"]
>["content"]["application/json"];
```

---

## Module Summaries

### 1. providers (marketplace)

- CRUD with offset pagination
- Store: paginationParams, nameFilter, verifiedFilter, predicates

### 2. services (marketplace)

- CRUD + by provider, offset pagination
- ServiceStatus enum (active/inactive/draft)
- Store: paginationParams, statusFilter, canBook, formatPrice, formatDuration

### 3. bookings (bookings)

- List + create + cancel/confirm/complete, cursor pagination
- BookingStatus enum (pending/confirmed/completed/cancelled)
- Store: cursorParams, statusFilter, canCancel/canConfirm/canComplete/isFinal

### 4. payments (bookings)

- Pay + detail only (no list)
- PaymentStatus enum (pending/paid/refunded/failed)
- Cross-module invalidation of booking queries on pay

### 5. reviews (bookings)

- List by service + create for booking, offset pagination
- TypeBox schema for create review form
- Cross-module invalidation of booking queries on create

---

## Cross-Module Invalidation

- `usePayBookingMutation` imports `BOOKING_QUERY_KEYS`
- `useCreateReviewMutation` imports `BOOKING_QUERY_KEYS`
