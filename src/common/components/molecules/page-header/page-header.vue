<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-foreground">
      <slot name="title">{{ title }}</slot>
    </h1>
    <div
      v-if="$slots.actions"
      class="flex items-center gap-2"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
