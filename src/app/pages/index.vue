<script setup lang="ts">
import { computed } from "vue";
import { useAuthenticationStore } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/router/app-router";
import { Button } from "#src/common/components/atoms/button";

const authStore = useAuthenticationStore();
const { routes } = useAppRouter();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userName = computed(() => authStore.currentUser?.firstName ?? "Guest");
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-foreground mb-4">Welcome, {{ userName }}</h1>
    <p class="text-muted-foreground">Nuxt Starter Kit — production-grade frontend template.</p>

    <div
      v-if="!isAuthenticated"
      class="mt-8 flex gap-4"
    >
      <Button as-child>
        <NuxtLink :to="routes.auth.signIn()">Sign in</NuxtLink>
      </Button>
      <Button
        as-child
        variant="outline"
      >
        <NuxtLink :to="routes.auth.signUp()">Sign up</NuxtLink>
      </Button>
    </div>
  </div>
</template>
