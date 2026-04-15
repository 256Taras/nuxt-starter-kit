<script setup lang="ts">
import { computed } from "vue";
import { Button } from "#src/common/components/atoms/button";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>();

const emit = defineEmits<{
  "update:page": [page: number];
}>();

const pages = computed(() => {
  const result: (number | "...")[] = [];
  const total = props.totalPages;
  const current = props.page;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) result.push(i);
    return result;
  }

  result.push(1);
  if (current > 3) result.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) result.push(i);

  if (current < total - 2) result.push("...");
  result.push(total);

  return result;
});
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Pagination"
    class="flex items-center gap-1"
  >
    <Button
      variant="outline"
      size="icon"
      aria-label="Previous page"
      :disabled="!hasPreviousPage"
      @click="emit('update:page', page - 1)"
    >
      <ChevronLeft :size="16" />
    </Button>

    <template
      v-for="(p, i) in pages"
      :key="i"
    >
      <span
        v-if="p === '...'"
        class="px-2 text-muted-foreground"
        >...</span
      >
      <Button
        v-else
        :variant="p === page ? 'default' : 'outline'"
        :aria-label="`Go to page ${p}`"
        :aria-current="p === page ? 'page' : undefined"
        size="sm"
        @click="emit('update:page', p)"
      >
        {{ p }}
      </Button>
    </template>

    <Button
      variant="outline"
      size="icon"
      aria-label="Next page"
      :disabled="!hasNextPage"
      @click="emit('update:page', page + 1)"
    >
      <ChevronRight :size="16" />
    </Button>
  </nav>
</template>
