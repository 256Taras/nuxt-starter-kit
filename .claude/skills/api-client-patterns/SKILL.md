---
name: api-client-patterns
description:
  API client patterns — ofetch HTTP client, useXxxApi composables, TanStack
  Query, OpenAPI type generation.
globs:
  - "src/common/api/**/*.ts"
  - "src/modules/**/api/**/*.ts"
  - "src/configs/api.config.ts"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm:*)
---

# API Client Patterns

## 4-Layer Hook Chain

```
useHttpClient (ofetch instance, auth, errors)
    |
useXxxApi (endpoint definitions, typed responses)
    |
useXxx (optional TanStack Query wrapper)
    |
useXxxStore (Pinia store, orchestration)
```

## Layer 1: useHttpClient

Singleton ofetch in src/common/api/use-http-client.ts:

- Base URL from useRuntimeConfig().public.apiBaseUrl
- Auth: Bearer token from cookie
- Error: 401 -> clear credentials -> redirect
- Timeout: 30s, retries: 1

## Layer 2: useXxxApi

```typescript
export function useAuthenticationApi() {
  const http = useHttpClient();
  return {
    signIn: (body: SignInInput): Promise<Credentials> =>
      http("/v1/auth/sign-in", { method: "POST", body }),
  };
}
```

## Layer 3: TanStack Query (optional)

```typescript
export function useUsers() {
  const api = useUsersApi();
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getList(),
  });

  return { usersQuery };
}
```

## OpenAPI Types

```bash
pnpm gen:api  # Generates src/common/api/generated/api-schema.ts
```

Re-export in module's \*.types.ts:

```typescript
import type { components } from "#src/common/api/generated/api-schema";
export type User = components["schemas"]["UserOutputContract"];
```

## Anti-patterns

- Hand-writing DTO types (use OpenAPI generation)
- Server state in Pinia (use TanStack Query)
- Catching errors in useXxxApi (let useHttpClient handle)
