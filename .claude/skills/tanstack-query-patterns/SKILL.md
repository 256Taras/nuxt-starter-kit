---
name: tanstack-query-patterns
description:
  TanStack Query (Vue Query) patterns — query keys, mutations with invalidation,
  optimistic updates, loading/error states, cache management. Server state
  belongs here, not in Pinia.
globs:
  - "src/modules/**/api/**/*.ts"
  - "src/modules/**/model/**/*.ts"
  - "src/app/plugins/query-provider.ts"
  - "src/common/api/query-client.ts"
allowed-tools: Read, Write, Edit, Grep, Glob
---

# TanStack Query Patterns

## Core Rule

**Server state = TanStack Query. Client state = Pinia.**

- User list from API → `useQuery` (TanStack Query cache)
- Current authenticated user → `ref` in Pinia store
- Form input → `ref` in component
- Filter/sort preferences → Pinia or URL query params

## Query Pattern

```typescript
import { useQuery } from "@tanstack/vue-query";

export function useUsers() {
  const api = useUsersApi();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getList(),
  });

  return { usersQuery };
}
```

### Query Keys Convention

```typescript
// Entity lists
["users"][("users", { page: 1, limit: 10 })][("users", { search: "john" })][
  // Single entity
  ("users", userId)
][
  // Nested resources
  ("users", userId, "orders")
][("users", userId, "orders", orderId)][
  // Current user (special)
  "profile"
];
```

Key rules:

- Array format always
- Entity name first, then filters/params
- Specific keys are subsets of broader keys (enables smart invalidation)

## Mutation Pattern

```typescript
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useCreateUser() {
  const api = useUsersApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => api.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

### Invalidation Rules

| After           | Invalidate                        |
| --------------- | --------------------------------- |
| Create user     | `["users"]` (list)                |
| Update user     | `["users"]` + `["users", userId]` |
| Delete user     | `["users"]` (list)                |
| Change password | `["profile"]`                     |

## Optimistic Updates

```typescript
useMutation({
  mutationFn: (input) => api.update(userId, input),
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ["users", userId] });
    const previous = queryClient.getQueryData(["users", userId]);
    queryClient.setQueryData(["users", userId], (old) => ({
      ...old,
      ...newData,
    }));
    return { previous };
  },
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(["users", userId], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["users", userId] });
  },
});
```

Use optimistic updates for: toggle, like, status change — instant UI feedback.
Don't use for: create, delete, complex updates — wait for server confirmation.

## Loading / Error / Empty States in Components

```vue
<script setup lang="ts">
import { useUsers } from "#src/modules/(users)/profiles";

const { usersQuery } = useUsers();
const { data, isLoading, isError, error } = usersQuery;
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">Error: {{ error?.message }}</div>
  <div v-else-if="!data?.length">No users found</div>
  <ul v-else>
    <li
      v-for="user in data"
      :key="user.id"
    >
      {{ user.email }}
    </li>
  </ul>
</template>
```

Every component using a query MUST handle: loading, error, empty, success.

## Query Client Config

From `src/common/api/query-client.ts` / `src/app/plugins/query-provider.ts`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — refetch after this
      gcTime: 1000 * 60 * 30, // 30 min — garbage collect
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Composable Structure

```
useHttpClient (ofetch)           ← Layer 1: HTTP
    ↓
useUsersApi (endpoints)          ← Layer 2: API definitions
    ↓
useUsers (TanStack Query)        ← Layer 3: caching, invalidation
    ↓
useUsersStore (Pinia)            ← Layer 4: client-only state
```

Layer 3 is WHERE queries live. Don't put useQuery inside Pinia stores.

## Anti-patterns

- Server data in Pinia refs (use useQuery)
- useQuery inside Pinia stores (keep in separate composable)
- String query keys ("users") instead of arrays (["users"])
- Missing invalidation after mutation (stale UI)
- Forgetting loading/error states in template
- Manual refetch instead of invalidation
- staleTime: 0 everywhere (defeats caching)
- Fetching same data in multiple components without shared query key
