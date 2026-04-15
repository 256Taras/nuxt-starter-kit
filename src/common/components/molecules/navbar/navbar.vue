<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  brandLabel: string;
  brandTo: RouteLocationRaw;
}>();
</script>

<template>
  <header class="bg-card shadow-sm border-b">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-background"
    >
      Skip to main content
    </a>
    <nav
      aria-label="Main navigation"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
    >
      <NuxtLink
        :to="brandTo"
        class="text-xl font-semibold text-foreground"
      >
        {{ brandLabel }}
      </NuxtLink>

      <div class="flex items-center gap-4">
        <slot />
      </div>
    </nav>
  </header>
</template>
