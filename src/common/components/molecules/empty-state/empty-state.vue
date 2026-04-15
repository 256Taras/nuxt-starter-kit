<script setup lang="ts">
import { Inbox } from "lucide-vue-next";
import type { Component } from "vue";

defineProps<{
  title?: string;
  description?: string;
  icon?: Component;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-12 text-center">
    <component
      :is="icon ?? Inbox"
      :size="40"
      class="text-muted-foreground"
      aria-hidden="true"
    />
    <p class="font-medium text-card-foreground">{{ title ?? "Nothing here yet" }}</p>
    <p
      v-if="description"
      class="text-sm text-muted-foreground max-w-sm"
    >
      {{ description }}
    </p>
    <slot name="action" />
  </div>
</template>
