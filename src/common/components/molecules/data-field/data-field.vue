<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div>
    <span class="text-sm text-muted-foreground">{{ label }}</span>
    <p class="font-medium text-card-foreground">
      <slot />
    </p>
  </div>
</template>
