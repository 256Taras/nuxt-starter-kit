<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

defineProps<{
  to: RouteLocationRaw;
}>();
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
  >
    <ArrowLeft :size="16" />
    <slot />
  </NuxtLink>
</template>
