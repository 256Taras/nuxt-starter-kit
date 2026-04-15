<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: "sm" | "md";
  }>(),
  { size: "sm" },
);

const sizeClass = computed(() => (props.size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"));
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium"
    :class="sizeClass"
  >
    <slot />
  </span>
</template>
