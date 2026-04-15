<script setup lang="ts">
import { computed } from "vue";
import { useAppRouter } from "#src/common/router/app-router";
import { Button } from "#src/common/components/atoms/button";

const props = defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();

const { pushTo } = useAppRouter();

const title = computed(() => {
  if (props.error.statusCode === 404) return "Page not found";
  if (props.error.statusCode === 403) return "Access denied";
  if (props.error.statusCode === 500) return "Server error";
  return "Something went wrong";
});

const description = computed(() => {
  if (props.error.statusCode === 404) return "The page you are looking for does not exist.";
  if (props.error.statusCode === 403) return "You do not have permission to view this page.";
  return props.error.message || "An unexpected error occurred.";
});

function handleClearError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center space-y-6 max-w-md">
      <p class="text-6xl font-bold text-muted-foreground">{{ error.statusCode }}</p>
      <h1 class="text-2xl font-semibold text-foreground">{{ title }}</h1>
      <p class="text-muted-foreground">{{ description }}</p>
      <div class="flex gap-3 justify-center">
        <Button @click="handleClearError">Go home</Button>
        <Button
          variant="outline"
          @click="pushTo.auth.signIn()"
          >Sign in</Button
        >
      </div>
    </div>
  </div>
</template>
