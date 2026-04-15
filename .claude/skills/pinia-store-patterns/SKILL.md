---
name: pinia-store-patterns
description:
  Pinia store conventions — setup syntax, client state management, loading/error
  patterns, storeToRefs usage.
globs:
  - "src/modules/**/*.store.ts"
  - "src/modules/**/model/**/*.ts"
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Pinia Store Patterns

## Setup Syntax (mandatory)

```typescript
import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore("authentication", () => {
  const currentUser = ref<User | null>(null);
  const isSigningIn = ref(false);

  const isAuthenticated = computed(() => currentUser.value !== null);

  async function signIn(input: SignInInput) {
    isSigningIn.value = true;
    try {
      const credentials = await api.signIn(input);
      setCredentials(credentials);
    } finally {
      isSigningIn.value = false;
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isSigningIn: computed(() => isSigningIn.value),
    signIn,
  };
});
```

## storeToRefs Rule

```typescript
// MUST call before any await
const store = useAuthenticationStore();
const { currentUser, isAuthenticated } = storeToRefs(store);
```

## Module Structure

```
src/modules/(users)/authentication/
├── api/use-authentication-api.ts
├── model/
│   ├── authentication.types.ts
│   ├── authentication.schemas.ts
│   └── authentication.store.ts
└── index.ts
```

## Anti-patterns

- Options API stores
- Server data in Pinia (use TanStack Query)
- `export *` in index.ts
- Missing loading/error handling
