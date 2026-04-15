---
name: api-client-patterns
description:
  API client patterns — auto-generated SDK via `@hey-api/openapi-ts`, TanStack
  Query helpers, domain-friendly module hooks.
globs:
  - "src/common/api/**/*.ts"
  - "src/modules/**/entity/*.queries.ts"
  - "src/modules/**/features/**/*.mutation.ts"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm:*)
---

# API Client Patterns

## Architecture

```
@hey-api/openapi-ts + @hey-api/client-ofetch plugin + backend OpenAPI
    ↓
src/common/api/sdk/           (generated — never edit)
    ├── sdk.gen.ts            (SDK functions: getV1Providers, postV1AuthSignIn, ...)
    ├── types.gen.ts          (request/response types)
    ├── client.gen.ts         (ofetch-based client; wires runtime config)
    └── @tanstack/             (TanStack Query helpers plugin)
    ↓
src/common/api/sdk-runtime-config.ts  (baseURL, auth headers, 401 refresh flow)
    ↓
src/common/api/sdk-queries.ts (re-exports TanStack Query helpers)
    ↓
modules/<entity>/entity/      (domain-friendly wrappers)
    ├── *.queries.ts          (useXxxListQuery, useXxxDetailQuery)
    └── *.types.ts            (re-export SDK types with domain names)
    ↓
modules/<entity>/features/    (one folder per user action)
    └── */*.mutation.ts       (useXxxMutation — spreads SDK mutation options)
```

## Regenerate SDK

```bash
pnpm gen:sdk   # reads backend OpenAPI (http://localhost:3100), writes src/common/api/sdk/
```

## Module: types re-export

```ts
// modules/(users)/profiles/entity/profiles.types.ts
import type { GetV1UsersMeResponse } from "#src/common/api/sdk";

export type UserProfile = GetV1UsersMeResponse;
```

## Module: query hook

```ts
// modules/(bookings)/bookings/entity/bookings.queries.ts
import { useQuery } from "@tanstack/vue-query";
import { getV1BookingsByIdOptions } from "#src/common/api/sdk-queries";

export const useBookingDetailQuery = (id: MaybeRef<string>) =>
  useQuery(getV1BookingsByIdOptions({ path: { id: unref(id) } }));
```

## Feature: mutation hook

```ts
// Simple case (95% of mutations)
export const useSignInMutation = () => useMutation(postV1AuthSignInMutation());

// With cache invalidation
export function useDeleteProviderMutation() {
  const qc = useQueryClient();
  return useMutation({
    ...deleteV1ProvidersByIdMutation(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() }),
  });
}
```

Callers pass `{ path, body, query }` matching the SDK contract.

## Anti-patterns

- Hand-writing DTO types (always re-export from SDK types)
- Server state in Pinia (use TanStack Query cache)
- Editing `src/common/api/sdk/` directly (regenerate instead)
- Manual `ofetch` calls / `Authorization` headers (SDK handles it)
- Pages importing from `src/common/api/sdk` directly (go through module)
