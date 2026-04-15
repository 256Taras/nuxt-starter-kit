---
name: vue3-component-patterns
description:
  Vue 3 component conventions — script setup, explicit imports, shadcn-vue
  patterns, CVA variants, reka-ui primitives, Tailwind CSS 4.
globs:
  - "src/**/*.vue"
  - "src/common/components/**/*.ts"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm:*)
---

# Vue 3 Component Patterns

## Component Structure

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import type { HTMLAttributes } from "vue";
// All imports explicit — no auto-imports in this project
</script>

<template>
  <!-- Template -->
</template>
```

Key: `imports: { autoImport: false }` and `components: { dirs: [] }` in
nuxt.config.

## Props Pattern

```typescript
interface Props {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  class?: HTMLAttributes["class"];
}

const {
  variant,
  size,
  class: className,
} = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
});
```

Props destructuring is enabled. Use it.

## shadcn-vue / CVA Pattern

```typescript
import { type VariantProps, cva } from "class-variance-authority";
import { Primitive } from "reka-ui";
import { cn } from "#src/common/utils/styles/cn";

const buttonVariants = cva("inline-flex items-center justify-center...", {
  variants: {
    variant: { default: "bg-primary text-primary-foreground..." },
    size: { default: "h-9 px-4 py-2", sm: "h-8 px-3 text-xs" },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

## File Naming

- kebab-case: `user-card.vue`, `user-card.stories.ts`
- Component folder: `component-name/component-name.vue` + `index.ts`
- Atoms: `src/common/components/atoms/`
- Molecules: `src/common/components/molecules/`

## Loading / Error / Empty States

Every async component MUST handle all three states.

## Anti-patterns

- Options API
- Auto-imported composables
- `export *` in index.ts
- Manual class string concatenation (use cn())
- `any` type
- `console.log`
