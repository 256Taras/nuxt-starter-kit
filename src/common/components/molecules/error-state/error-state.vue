<script setup lang="ts">
import { Button } from "#src/common/components/atoms/button";
import { AlertCircle } from "lucide-vue-next";

defineProps<{
  title?: string;
  message?: string;
  retryLabel?: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div
    role="alert"
    class="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-8 text-center"
  >
    <AlertCircle
      :size="32"
      class="text-destructive"
      aria-hidden="true"
    />
    <p class="font-medium text-card-foreground">{{ title ?? "Something went wrong" }}</p>
    <p
      v-if="message"
      class="text-sm text-muted-foreground"
    >
      {{ message }}
    </p>
    <Button
      variant="outline"
      size="sm"
      @click="emit('retry')"
    >
      {{ retryLabel ?? "Try again" }}
    </Button>
  </div>
</template>
