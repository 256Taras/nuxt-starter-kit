<script setup lang="ts">
import { Button } from "#src/common/components/atoms/button";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps<{
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>();

defineEmits<{
  prev: [];
  next: [];
}>();
</script>

<template>
  <nav
    class="flex items-center gap-2"
    aria-label="Pagination"
  >
    <Button
      variant="outline"
      size="sm"
      :disabled="!hasPreviousPage"
      @click="$emit('prev')"
    >
      <ChevronLeft :size="16" />
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      :disabled="!hasNextPage"
      @click="$emit('next')"
    >
      Next
      <ChevronRight :size="16" />
    </Button>
  </nav>
</template>
