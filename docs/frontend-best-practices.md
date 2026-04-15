# Frontend Best Practices & Anti-Patterns

Production coding standards for Vue 3.5 + Nuxt 4 + Pinia 3 + TanStack Query v5.

Based on: Clean Code (Robert C. Martin), Refactoring (Martin Fowler), Vue/Nuxt
official docs, TkDodo blog (TanStack Query maintainer), and battle-tested
production patterns.

---

## Table of Contents

1. [Vue 3.5 Composition API](#1-vue-35-composition-api)
2. [Nuxt 4](#2-nuxt-4)
3. [Pinia 3](#3-pinia-3)
4. [TanStack Query v5](#4-tanstack-query-v5)
5. [Component Design](#5-component-design)
6. [Performance](#6-performance)
7. [TypeScript](#7-typescript)
8. [General Anti-Patterns](#8-general-anti-patterns)

---

## 1. Vue 3.5 Composition API

### 1.1 Reactivity

**USE `ref()` by default.** Only use `reactive()` for deeply nested objects that
are always used as a whole.

```typescript
// GOOD — ref for primitives and simple objects
const count = ref(0);
const user = ref<User | null>(null);

// BAD — reactive for something that gets reassigned
const state = reactive({ user: null }); // can't reassign state.user = newUser cleanly
```

**NEVER destructure reactive objects without `toRefs()` or `storeToRefs()`.**

```typescript
// BAD — loses reactivity
const { name, email } = store;

// GOOD
const { name, email } = storeToRefs(store);
```

**USE `shallowRef()` for large objects or arrays that are replaced entirely, not
mutated.**

```typescript
// GOOD — large list replaced on each fetch
const users = shallowRef<User[]>([]);
users.value = newUsers; // triggers reactivity

// BAD — deep ref tracks every nested property (wasted CPU)
const users = ref<User[]>([]);
```

**PREFER `computed()` over `watch` for derived state.**

```typescript
// GOOD — declarative, cached
const fullName = computed(() => `${first.value} ${last.value}`);

// BAD — imperative, unnecessary watcher
const fullName = ref("");
watch([first, last], () => {
  fullName.value = `${first.value} ${last.value}`;
});
```

**USE `watch` only for side effects (API calls, navigation, analytics).**

```typescript
// GOOD — side effect
watch(selectedId, (id) => {
  router.push({ params: { id } });
});

// BAD — deriving state (use computed instead)
watch(items, (items) => {
  total.value = items.length;
});
```

**USE `watchEffect` when you want auto-dependency tracking.**

```typescript
// GOOD — tracks all reactive dependencies automatically
watchEffect(() => {
  console.log(`User ${user.value.name} selected item ${selectedId.value}`);
});
```

### 1.2 Composables

**ALWAYS return plain objects with refs from composables.**

```typescript
// GOOD
export function useMouse() {
  const x = ref(0);
  const y = ref(0);
  return { x, y }; // plain object, destructurable
}

// BAD — returning reactive object
export function useMouse() {
  return reactive({ x: 0, y: 0 }); // can't destructure without losing reactivity
}
```

**ALWAYS accept refs, getters, and plain values as input.**

```typescript
import { toValue, type MaybeRefOrGetter } from "vue";

export function useFetch(url: MaybeRefOrGetter<string>) {
  watchEffect(() => {
    fetch(toValue(url)); // works with ref, getter, or string
  });
}

// All usage patterns work:
useFetch("/api/users");
useFetch(urlRef);
useFetch(() => `/api/users/${id.value}`);
```

**ALWAYS clean up side effects in composables.**

```typescript
export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener,
) {
  onMounted(() => target.addEventListener(event, handler));
  onUnmounted(() => target.removeEventListener(event, handler));
}
```

**NEVER call composables inside callbacks, loops, or after `await` (except
`<script setup>`).**

```typescript
// BAD
onClick(() => {
  const { data } = useQuery(...); // broken — no setup context
});

// BAD
for (const id of ids) {
  useQuery(...); // broken — dynamic composable calls
}

// GOOD — call in <script setup> or setup()
const { data } = useQuery(...);
```

### 1.3 Vue 3.5+ Features

**USE `onWatcherCleanup()` for cleanup inside watchers.**

```typescript
import { watch, onWatcherCleanup } from "vue";

watch(searchQuery, (query) => {
  const controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal });

  onWatcherCleanup(() => {
    controller.abort(); // cancel previous request
  });
});
```

**USE `watch` with depth number instead of `deep: true`.**

```typescript
// GOOD — watch only 2 levels deep (cheaper)
watch(formData, (val) => validate(val), { deep: 2 });

// AVOID — watches everything recursively (expensive)
watch(formData, (val) => validate(val), { deep: true });
```

**USE `pause/resume` on watchers instead of boolean guards.**

```typescript
const { pause, resume } = watch(source, callback);
pause(); // temporarily disable
resume(); // re-enable
```

**Reactive props destructure is automatic in Vue 3.5+.**

```vue
<script setup lang="ts">
// Props are reactive when destructured — no withDefaults needed for defaults
const { title, count = 0 } = defineProps<{
  title: string;
  count?: number;
}>();

// Wrap in getter when passing to composables or watch
watch(
  () => title,
  (newTitle) => {
    /* ... */
  },
);
</script>
```

**USE `useId()` for SSR-safe unique IDs.**

```typescript
// GOOD — same ID on server and client
const id = useId();

// BAD — different on server vs client, hydration mismatch
const id = Math.random().toString(36);
```

### 1.4 Template Refs

**USE `useTemplateRef()` (Vue 3.5+) instead of matching ref name to template.**

```typescript
// GOOD — Vue 3.5+
const inputEl = useTemplateRef<HTMLInputElement>("input");

// OLD WAY — fragile, relies on name matching
const input = ref<HTMLInputElement | null>(null);
```

```vue
<template>
  <input ref="input" />
</template>
```

### 1.4 Props & Events

**USE `defineModel()` for two-way binding (Vue 3.4+).**

```vue
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });
</script>

<template>
  <input v-model="modelValue" />
</template>
```

**NEVER mutate props directly.**

```typescript
// BAD
props.items.push(newItem);
props.user.name = "new";

// GOOD — emit event, let parent handle it
emit("update:items", [...props.items, newItem]);
```

---

## 2. Nuxt 4

### 2.1 Data Fetching

**USE `useFetch` / `useAsyncData` for SSR-safe data fetching, `$fetch` for
client-only actions.**

```typescript
// GOOD — SSR-safe, deduped, cached
const { data, error, status } = await useFetch("/api/users");

// GOOD — client-only mutation
async function deleteUser(id: string) {
  await $fetch(`/api/users/${id}`, { method: "DELETE" });
}

// BAD — fetch in onMounted (runs only on client, no SSR)
onMounted(async () => {
  const data = await fetch("/api/users");
});
```

**ALWAYS provide a unique `key` to `useAsyncData`.**

```typescript
// GOOD
const { data } = await useAsyncData(`user-${id}`, () =>
  $fetch(`/api/users/${id}`),
);

// BAD — auto-generated key may collide
const { data } = await useAsyncData(() => $fetch(`/api/users/${id}`));
```

**USE `lazy: true` for non-critical data to avoid blocking navigation.**

```typescript
const { data, status } = useLazyFetch("/api/analytics");
```

**NEVER use `$fetch` in `<script setup>` — causes double fetch (server +
client).**

```typescript
// BAD — fetches on server, then again on client
const data = await $fetch("/api/users");

// GOOD — deduped, SSR-safe
const { data } = await useFetch("/api/users");
```

**USE `pick` or `transform` to minimize SSR payload.**

```typescript
const { data } = await useFetch("/api/users", {
  pick: ["id", "name", "email"], // only these fields transferred to client
});
```

**USE reactive URL for dynamic params.**

```typescript
// GOOD — re-fetches when route.params.id changes
const { data } = await useFetch(() => `/api/users/${route.params.id}`);

// BAD — stale data when route changes
const { data } = await useFetch(`/api/users/${route.params.id}`);
```

### 2.2 SSR & Hydration

**NEVER access browser APIs outside `onMounted()` or `process.client`.**

```typescript
// BAD — breaks SSR
const width = window.innerWidth;

// GOOD
const width = ref(0);
onMounted(() => {
  width.value = window.innerWidth;
});

// GOOD — conditional
if (import.meta.client) {
  localStorage.setItem("key", "value");
}
```

**USE `<ClientOnly>` for components that can't render on server.**

```vue
<ClientOnly>
  <ChartComponent :data="chartData" />
  <template #fallback>
    <div class="h-64 animate-pulse bg-muted rounded" />
  </template>
</ClientOnly>
```

**NEVER use `v-if` based on random/time values — causes hydration mismatch.**

```typescript
// BAD — different on server vs client
const showBanner = ref(Math.random() > 0.5);
const now = ref(new Date());

// GOOD — compute on client only
const showBanner = ref(false);
onMounted(() => {
  showBanner.value = Math.random() > 0.5;
});
```

### 2.3 Middleware & Plugins

**USE route middleware for auth guards, not `onBeforeMount`.**

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }
});
```

**NEVER use `defineNuxtPlugin` for things that should be composables.**

```typescript
// BAD — plugin for something that should be a composable
export default defineNuxtPlugin(() => {
  return { provide: { formatDate: (d: Date) => d.toISOString() } };
});

// GOOD — just a composable
export function useFormatDate() {
  return (d: Date) => d.toISOString();
}
```

### 2.4 Error Handling

**USE `useError()` and `createError()` for consistent error handling.**

```typescript
// In server route or middleware
throw createError({
  statusCode: 404,
  statusMessage: "User not found",
});

// In component
const error = useError();
if (error.value) {
  // Show error page
}
```

**ALWAYS handle error state from data fetching.**

```vue
<script setup lang="ts">
const { data, error, status } = await useFetch("/api/users");
</script>

<template>
  <div v-if="error">Error: {{ error.message }}</div>
  <div v-else-if="status === 'pending'">Loading...</div>
  <div v-else>{{ data }}</div>
</template>
```

**USE `<NuxtErrorBoundary>` for client-side error isolation.**

```vue
<NuxtErrorBoundary>
  <DangerousComponent />
  <template #error="{ error, clearError }">
    <p>Something went wrong: {{ error.message }}</p>
    <button @click="clearError">Try again</button>
  </template>
</NuxtErrorBoundary>
```

---

## 3. Pinia 3

### 3.1 Store Design

**ALWAYS use setup stores (Composition API syntax).**

```typescript
// GOOD — setup store
export const useUserStore = defineStore("user", () => {
  const name = ref("");
  const email = ref("");

  const displayName = computed(() => name.value || email.value);

  function reset() {
    name.value = "";
    email.value = "";
  }

  return { name, email, displayName, reset };
});

// BAD — options API store
export const useUserStore = defineStore("user", {
  state: () => ({ name: "", email: "" }),
  getters: { displayName: (state) => state.name || state.email },
  actions: {
    reset() {
      this.name = "";
    },
  },
});
```

### 3.2 What Goes in Pinia

**Pinia is for CLIENT STATE only:**

| Belongs in Pinia                             | Does NOT belong in Pinia          |
| -------------------------------------------- | --------------------------------- |
| UI state (filters, pagination, sidebar open) | Server data (users list, profile) |
| Auth tokens, user session                    | Fetched API responses             |
| Form wizard step                             | Individual form field values      |
| Feature flags (client-side)                  | Component-local state             |
| Cross-component shared state                 | Derived data (use computed)       |

```typescript
// GOOD — client state in Pinia
export const useUsersStore = defineStore("users", () => {
  // UI state only
  const filters = ref<UserFilters>({ search: "", role: null });
  const currentPage = ref(1);
  const selectedIds = ref<Set<string>>(new Set());

  // Business predicates
  const isAdmin = (user: User) => user.role === "admin";
  const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;

  return { filters, currentPage, selectedIds, isAdmin, getFullName };
});

// BAD — server data in Pinia
export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]); // server data — use TanStack Query
  const isLoading = ref(false); // loading state — TanStack Query handles this
  const error = ref<Error | null>(null); // error state — TanStack Query handles this

  async function fetchUsers() {
    // manual fetching — use useQuery
    isLoading.value = true;
    users.value = await api.getUsers();
    isLoading.value = false;
  }
});
```

### 3.3 Store Size

**ONE store per feature/domain, not one mega-store.**

```typescript
// GOOD — focused stores
const useAuthStore = defineStore("auth", () => {
  /* auth state */
});
const useUsersStore = defineStore("users", () => {
  /* users UI state */
});
const useNotificationsStore = defineStore("notifications", () => {
  /* notifications */
});

// BAD — god store
const useAppStore = defineStore("app", () => {
  // auth + users + notifications + settings + ...
});
```

### 3.4 Store Composition

**When stores need to reference each other, call `useXxxStore()` inside actions,
not at the top level.**

```typescript
export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  // GOOD — call inside action
  function checkout() {
    const auth = useAuthStore(); // called when needed
    if (!auth.isAuthenticated) throw new Error("Not authenticated");
    // ...
  }

  // BAD — called at top level (circular dependency risk)
  // const auth = useAuthStore(); // DON'T DO THIS

  return { items, checkout };
});
```

### 3.5 Always Use `storeToRefs()` for Destructuring

```typescript
// GOOD
const store = useUsersStore();
const { filters, currentPage } = storeToRefs(store);
const { isAdmin, getFullName } = store; // methods don't need storeToRefs

// BAD — loses reactivity
const { filters, currentPage } = useUsersStore();
```

### 3.6 SSR & Hydration

**In Nuxt, Pinia state is automatically serialized/hydrated.** But be careful:

```typescript
// BAD — non-serializable state
const store = defineStore("app", () => {
  const socket = ref(new WebSocket("ws://...")); // can't serialize
  const callback = ref(() => {}); // can't serialize
});

// GOOD — initialize non-serializable on client only
const store = defineStore("app", () => {
  const socket = ref<WebSocket | null>(null);

  if (import.meta.client) {
    socket.value = new WebSocket("ws://...");
  }
});
```

### 3.7 Keep Actions Simple

```typescript
// GOOD — action does one thing
function setPage(page: number) {
  currentPage.value = page;
}

function resetFilters() {
  filters.value = { search: "", role: null };
  currentPage.value = 1;
}

// BAD — action does too many unrelated things
function updateEverything(page: number, filters: Filters, sortBy: string) {
  currentPage.value = page;
  activeFilters.value = filters;
  sortColumn.value = sortBy;
  await fetchUsers(); // side effect
  analytics.track("filter_changed"); // another side effect
}
```

### 3.8 Use `$patch` for Batch Updates

Each direct assignment triggers a separate reactive update. Batch with `$patch`.

```typescript
// BAD — three separate re-renders
store.name = "John";
store.email = "john@example.com";
store.age = 30;

// GOOD — single reactive update
store.$patch({
  name: "John",
  email: "john@example.com",
  age: 30,
});

// GOOD — function form for complex mutations
store.$patch((state) => {
  state.items = state.items.filter((item) => !item.expired);
  state.lastCleanup = Date.now();
});
```

### 3.9 Use `skipHydrate()` for Non-Serializable State

```typescript
import { skipHydrate } from "pinia";

export const useWidgetStore = defineStore("widget", () => {
  const element = skipHydrate(ref<HTMLElement | null>(null));
  const localStorage = skipHydrate(useLocalStorage("key", "default"));

  return { element, localStorage };
});
```

### 3.10 Use `readonly()` for Protected State

```typescript
export const useCartStore = defineStore("cart", () => {
  const _items = ref<CartItem[]>([]);
  const items = readonly(_items); // components cannot mutate

  function addItem(item: CartItem) {
    _items.value.push(item);
  }

  return { items, addItem };
});
```

### 3.11 NEVER Use Lifecycle Hooks Inside Store Definitions

Stores can be instantiated outside component lifecycle. `onMounted` may never
fire.

```typescript
// BAD
export const useDataStore = defineStore("data", () => {
  const items = ref<Item[]>([]);
  onMounted(async () => {
    items.value = await fetchItems(); // may NEVER fire
  });
  return { items };
});

// GOOD — explicit initialization action
export const useDataStore = defineStore("data", () => {
  const items = ref<Item[]>([]);

  async function initialize() {
    items.value = await fetchItems();
  }

  return { items, initialize };
});
```

### 3.12 Re-throw Errors from Actions

```typescript
// BAD — error swallowed
async function updateProfile(data: ProfileUpdate) {
  try {
    await api.updateProfile(data);
  } catch (e) {
    console.error(e); // component has no idea it failed
  }
}

// GOOD — store tracks error, re-throws for caller
async function updateProfile(data: ProfileUpdate) {
  try {
    profile.value = await api.updateProfile(data);
  } catch (error) {
    profileError.value =
      error instanceof Error ? error.message : "Update failed";
    throw error; // component can show toast, redirect, etc.
  }
}
```

---

## 4. TanStack Query v5

### 4.1 Query Key Factory Pattern

**ALWAYS use a query key factory. NEVER inline query keys.**

```typescript
// GOOD — query key factory
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => ["profile"] as const,
};

// Usage
useQuery({ queryKey: userKeys.detail(userId) });
queryClient.invalidateQueries({ queryKey: userKeys.lists() }); // invalidates ALL lists

// BAD — inline keys, inconsistent, typo-prone
useQuery({ queryKey: ["users", id] });
queryClient.invalidateQueries({ queryKey: ["users"] });
```

### 4.2 Query Defaults

**UNDERSTAND the defaults before overriding them.**

| Default                | Value   | Meaning                                    |
| ---------------------- | ------- | ------------------------------------------ |
| `staleTime`            | `0`     | Data is immediately stale after fetch      |
| `gcTime`               | `5 min` | Unused cache garbage-collected after 5 min |
| `refetchOnWindowFocus` | `true`  | Refetch when user returns to tab           |
| `refetchOnReconnect`   | `true`  | Refetch when network reconnects            |
| `retry`                | `3`     | Retry failed queries 3 times               |

**SET `staleTime` globally for most apps.** Zero staleTime means every component
mount triggers a refetch.

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute — data stays fresh
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

### 4.3 useQuery Patterns

**ALWAYS co-locate query with its composable.**

```typescript
// use-users-queries.ts
export function useUsersListQuery(params: Ref<UserListParams>) {
  const api = useUsersApi();
  return useQuery({
    queryKey: computed(() => userKeys.list(toValue(params))),
    queryFn: () => api.getList(toValue(params)),
  });
}

export function useUserDetailQuery(id: Ref<string>) {
  const api = useUsersApi();
  return useQuery({
    queryKey: computed(() => userKeys.detail(toValue(id))),
    queryFn: () => api.getById(toValue(id)),
    enabled: computed(() => !!toValue(id)),
  });
}
```

**USE `enabled` to control when queries fire.**

```typescript
// GOOD — only fetch when id is available
const { data } = useQuery({
  queryKey: computed(() => userKeys.detail(id.value)),
  queryFn: () => api.getById(id.value),
  enabled: computed(() => !!id.value),
});

// BAD — fetch always, handle null in queryFn
const { data } = useQuery({
  queryKey: ["user", id.value],
  queryFn: () => (id.value ? api.getById(id.value) : null), // DON'T
});
```

**USE `select` to transform data.**

```typescript
// GOOD — transform once, cache derived result
const { data: userNames } = useQuery({
  queryKey: userKeys.lists(),
  queryFn: () => api.getList(),
  select: (data) => data.map((u) => u.name),
});

// BAD — transform in component every render
const { data } = useQuery({ ... });
const userNames = computed(() => data.value?.map((u) => u.name));
```

### 4.4 useMutation Patterns

**ALWAYS invalidate related queries on mutation success.**

```typescript
export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const api = useUsersApi();

  return useMutation({
    mutationFn: (input: UserCreateInput) => api.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

**USE optimistic updates for instant UI feedback.**

```typescript
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const api = useUsersApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateInput }) =>
      api.update(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData(userKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(userKeys.detail(id), (old: User) => ({
        ...old,
        ...data,
      }));

      return { previous }; // context for rollback
    },

    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(userKeys.detail(id), context.previous);
      }
    },

    onSettled: (_data, _err, { id }) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

### 4.5 Anti-Patterns

**NEVER fetch data in `onMounted` — use `useQuery`.**

```typescript
// BAD
onMounted(async () => {
  const users = await api.getUsers();
  store.users = users;
});

// GOOD
const { data: users } = useUsersListQuery(params);
```

**NEVER use `queryClient` directly in components.**

```typescript
// BAD — component knows about cache internals
const queryClient = useQueryClient();
const users = queryClient.getQueryData(["users"]);

// GOOD — use useQuery, it handles caching
const { data: users } = useUsersListQuery(params);
```

**NEVER use manual `refetch()` when you should `invalidateQueries()`.**

```typescript
// BAD — refetch only this query, stale data in other components
const { refetch } = useUsersListQuery(params);
await createUser(data);
refetch();

// GOOD — invalidate all related queries, every subscriber updates
const queryClient = useQueryClient();
await createUser(data);
queryClient.invalidateQueries({ queryKey: userKeys.lists() });
```

**NEVER store TanStack Query data in Pinia state.**

```typescript
// BAD — double caching, out of sync
const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  async function fetchUsers() {
    const { data } = useUsersListQuery(params);
    watch(data, (val) => {
      users.value = val;
    }); // DON'T
  }
});

// GOOD — TanStack Query IS the cache, Pinia holds UI state only
```

### 4.6 Dependent Queries

```typescript
// First query
const { data: user } = useUserProfileQuery();

// Second query depends on first
const { data: orders } = useQuery({
  queryKey: computed(() => orderKeys.list(user.value?.id)),
  queryFn: () => api.getOrders(user.value!.id),
  enabled: computed(() => !!user.value?.id),
});
```

### 4.7 Pagination

```typescript
export function useUsersListQuery(params: Ref<PaginationParams>) {
  const api = useUsersApi();

  return useQuery({
    queryKey: computed(() => userKeys.list(toValue(params))),
    queryFn: () => api.getList(toValue(params)),
    placeholderData: keepPreviousData, // keep showing old page while loading new one
  });
}
```

### 4.8 Global Error Handler

**USE `QueryCache` / `MutationCache` for centralized error handling.**

```typescript
import { QueryCache, MutationCache, QueryClient } from "@tanstack/vue-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only toast for background refetch failures (not initial loads)
      if (query.state.data !== undefined) {
        toast.error(`Background update failed: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`Action failed: ${error.message}`);
    },
  }),
});
```

### 4.9 Smart Retry Strategy

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Never retry 4xx client errors
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 2; // retry server errors twice
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
    },
    mutations: {
      retry: false, // NEVER auto-retry mutations
    },
  },
});
```

### 4.10 Mutation Callback Placement

**Cache logic in `useMutation`. UI logic in `mutate()` call site.**

```typescript
// Definition — cache invalidation here
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileUpdate) => api.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Component — UI side-effects here
const { mutate } = useUpdateProfile();
mutate(formData, {
  onSuccess: () => {
    toast.success("Profile updated");
    router.push("/profiles");
  },
});
```

### 4.11 Prefetching

```typescript
// Prefetch on hover for instant navigation
function onProfileHover(id: string) {
  queryClient.prefetchQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.getById(id),
    staleTime: 60_000, // don't re-prefetch within 1 minute
  });
}

// Route guard — ensure data before navigation
const profile = await queryClient.ensureQueryData({
  queryKey: userKeys.profile(),
  queryFn: () => api.getProfile(),
});
```

### 4.12 Nuxt SSR Plugin

```typescript
// plugins/vue-query.ts
import type { DehydratedState } from "@tanstack/vue-query";
import {
  VueQueryPlugin,
  QueryClient,
  dehydrate,
  hydrate,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000, // prevents client re-fetch after SSR hydration
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  if (import.meta.server) {
    nuxtApp.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxtApp.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }
});
```

### 4.13 Common Mistakes Reference

| Mistake                                         | Fix                                                        |
| ----------------------------------------------- | ---------------------------------------------------------- |
| Filter params not in queryKey                   | Every variable affecting the response belongs in the key   |
| `refetch()` with new params                     | Change the reactive key variable — auto-refetches          |
| QueryClient inside component                    | Create once in plugin                                      |
| Over-invalidating `["users"]` after editing one | Invalidate narrowest scope: `["users", "detail", id]`      |
| Under-invalidating (forget lists after create)  | Always invalidate list scope after create/delete mutations |
| `gcTime: 0`                                     | Data disappears on unmount, re-fetches every navigation    |
| `useQuery` inside `onMounted`                   | Call at top of `<script setup>` — it is declarative        |
| `gcTime` < `staleTime`                          | Cache garbage-collected while still "fresh" — nonsensical  |

---

## 5. Component Design

### 5.1 Single Responsibility

**ONE component = ONE job. Split when a component does more than one thing.**

```vue
<!-- BAD — does everything -->
<template>
  <div>
    <h1>{{ user.name }}</h1>
    <form @submit="handleSubmit">...</form>
    <table>
      ...
    </table>
    <nav>...</nav>
  </div>
</template>

<!-- GOOD — composition of focused components -->
<template>
  <UserHeader :user="user" />
  <UserEditForm
    :user="user"
    @submit="handleSubmit"
  />
  <UserOrdersTable :orders="orders" />
  <Pagination
    v-model:page="page"
    :total="total"
  />
</template>
```

### 5.2 Props Down, Events Up

**NEVER let child components modify parent state directly.**

```vue
<!-- GOOD — child emits, parent decides -->
<UserCard :user="user" @delete="handleDelete" />

<!-- BAD — child reaches into parent state -->
<UserCard :user="user" :store="usersStore" />
```

### 5.3 Avoid Prop Drilling (> 2 levels)

**USE `provide/inject` for deeply nested data instead of passing through 3+
levels.**

```typescript
// Parent
const user = ref<User>(userData);
provide("currentUser", readonly(user));

// Deep child (any level)
const user = inject<Readonly<Ref<User>>>("currentUser");
```

### 5.4 Slots Over Props for Complex Content

```vue
<!-- BAD — HTML as string prop -->
<Modal :body="'<p>Are you sure?</p>'" />

<!-- GOOD — slot for flexible content -->
<Modal>
  <template #body>
    <p>Are you sure you want to delete <strong>{{ user.name }}</strong>?</p>
  </template>
</Modal>
```

### 5.5 Keep Templates Clean

**EXTRACT complex expressions to computed properties.**

```typescript
// BAD — in template
// <div v-if="user.role === 'admin' && user.permissions.includes('manage') && !user.suspended">

// GOOD
const canManage = computed(
  () =>
    user.value.role === "admin" &&
    user.value.permissions.includes("manage") &&
    !user.value.suspended,
);
// <div v-if="canManage">
```

### 5.6 NEVER Use `v-if` and `v-for` on Same Element

```vue
<!-- BAD — v-if evaluated for every item -->
<li v-for="user in users" v-if="user.isActive" :key="user.id">

<!-- GOOD — filter first -->
<li v-for="user in activeUsers" :key="user.id">
```

```typescript
const activeUsers = computed(() => users.value.filter((u) => u.isActive));
```

---

## 6. Performance

### 6.1 Lazy Components

**USE `defineAsyncComponent` for heavy components not needed immediately.**

```typescript
const HeavyChart = defineAsyncComponent(() => import("./heavy-chart.vue"));
```

**USE Nuxt `<LazyXxx>` prefix for auto-lazy components.**

```vue
<!-- Loaded only when visible -->
<LazyHeavyChart v-if="showChart" />
```

### 6.2 Virtual Scrolling

**USE virtual scrolling for lists > 100 items.**

```vue
<VirtualList :items="items" :item-height="48">
  <template #default="{ item }">
    <UserRow :user="item" />
  </template>
</VirtualList>
```

### 6.3 `v-once` and `v-memo`

```vue
<!-- Render once, never re-render (truly static content) -->
<footer v-once>
  <p>Copyright 2026 Company Name</p>
</footer>

<!-- Re-render only when dependency changes -->
<div v-memo="[user.id]">
  <ExpensiveComponent :user="user" />
</div>
```

### 6.4 Watchers

**USE `{ flush: 'post' }` when you need DOM-updated state in watcher.**

**ALWAYS stop watchers that are created manually outside setup.**

```typescript
const stop = watch(source, callback);
// Later...
stop(); // prevent memory leak
```

### 6.5 Images

**ALWAYS use `<NuxtImg>` instead of `<img>` for automatic optimization.**

```vue
<NuxtImg
  src="/hero.jpg"
  width="800"
  height="400"
  loading="lazy"
  format="webp"
/>
```

---

## 7. TypeScript

### 7.1 Never Use `any`

```typescript
// BAD
function process(data: any) { ... }

// GOOD
function process(data: unknown) {
  if (isUser(data)) { ... }
}
```

### 7.2 Use `as const` Instead of `enum`

```typescript
// BAD
enum UserRole {
  Admin = "admin",
  User = "user",
}

// GOOD
const UserRole = {
  Admin: "admin",
  User: "user",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

### 7.3 Proper Component Props Typing

```vue
<script setup lang="ts">
interface Props {
  user: User;
  showAvatar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true,
});
</script>
```

### 7.4 Proper Emit Typing

```vue
<script setup lang="ts">
const emit = defineEmits<{
  delete: [id: string];
  update: [user: User];
}>();
</script>
```

---

## 8. General Anti-Patterns

### 8.1 Don't Over-Engineer

```typescript
// BAD — unnecessary abstraction for one-time use
class UserService {
  constructor(private api: UserApi) {}
  async getUsers() {
    return this.api.getList();
  }
}

// GOOD — just call the function
const { data } = useUsersListQuery(params);
```

### 8.2 Don't Create Helpers Files

```typescript
// BAD — random helpers scattered across the project
// utils/user-helpers.ts
export function isAdmin(user: User) { ... }
export function getFullName(user: User) { ... }

// GOOD — business logic lives in the store
export const useUsersStore = defineStore("users", () => {
  const isAdmin = (user: User) => user.role === "admin";
  const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;
  return { isAdmin, getFullName };
});
```

### 8.3 Don't Use Magic Strings

```typescript
// BAD
if (user.role === "admin") { ... }
router.push("/users/profile");

// GOOD
if (user.role === UserRole.Admin) { ... }
router.push({ name: "users-profile" });
```

### 8.4 Don't Nest More Than 2 Levels

```typescript
// BAD
if (user) {
  if (user.orders) {
    if (user.orders.length > 0) {
      // ...
    }
  }
}

// GOOD — early returns
if (!user?.orders?.length) return;
// ...
```

### 8.5 Don't Mix Concerns in Components

```vue
<!-- BAD — API call + business logic + formatting in component -->
<script setup>
const response = await fetch("/api/users");
const users = await response.json();
const admins = users.filter((u) => u.role === "admin");
const formatted = admins.map((u) => `${u.firstName} ${u.lastName}`);
</script>

<!-- GOOD — component only renders -->
<script setup>
const store = useUsersStore();
const { data: users } = useUsersListQuery(store.filters);
</script>
```

### 8.6 Don't Import from Deep Paths

```typescript
// BAD
import { isAdmin } from "#src/modules/(users)/profiles/store/profiles.store";

// GOOD — through module's public API
import { useProfilesStore } from "#src/modules/(users)/profiles";
```

---

## Quick Reference: Where State Lives

| Type of State                  | Where It Lives        | Example                       |
| ------------------------------ | --------------------- | ----------------------------- |
| Server data (lists, details)   | TanStack Query cache  | `useQuery()`                  |
| Auth tokens, session           | Pinia store           | `useAuthStore()`              |
| UI state (filters, pagination) | Pinia store           | `useUsersStore()`             |
| Form values                    | Component-local `ref` | `const name = ref("")`        |
| Component-only toggles         | Component-local `ref` | `const isOpen = ref(false)`   |
| Derived/computed data          | `computed()`          | `const total = computed(...)` |
| Cross-page shared UI state     | Pinia store           | `useSidebarStore()`           |

---

## Quick Reference: Decision Tree

```
Need data from API?
  └── YES → Use TanStack Query (useQuery / useMutation)
  └── NO → Is it shared across components?
       └── YES → Use Pinia store
       └── NO → Is it derived from other state?
            └── YES → Use computed()
            └── NO → Use local ref()
```
