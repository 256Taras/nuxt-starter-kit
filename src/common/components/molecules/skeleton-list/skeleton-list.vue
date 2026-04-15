<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number;
    /** Tailwind height class for each row */
    rowClass?: string;
  }>(),
  { rows: 5, rowClass: "h-10" },
);
</script>

<template>
  <div
    class="space-y-2"
    aria-live="polite"
    aria-busy="true"
  >
    <span class="sr-only">Loading</span>
    <div
      v-for="i in rows"
      :key="i"
      :class="[rowClass, 'rounded-md bg-muted/60 animate-pulse']"
    />
  </div>
</template>
