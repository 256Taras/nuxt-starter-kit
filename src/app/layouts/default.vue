<script setup lang="ts">
import { computed } from "vue";
import { useAuthenticationStore } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/router/app-router";
import { LogOut, User, Users } from "lucide-vue-next";

const authStore = useAuthenticationStore();
const { routes, pushTo } = useAppRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink
          :to="routes.home()"
          class="text-xl font-semibold text-gray-900"
        >
          Nuxt Starter Kit
        </NuxtLink>

        <div class="flex items-center gap-4">
          <template v-if="isAuthenticated">
            <NuxtLink
              :to="routes.users.list()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Users :size="18" />
              <span>Users</span>
            </NuxtLink>
            <NuxtLink
              :to="routes.profile()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <User :size="18" />
              <span>Profile</span>
            </NuxtLink>
            <button
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              @click="authStore.logOut().then(() => pushTo.auth.signIn())"
            >
              <LogOut :size="18" />
              <span>Log out</span>
            </button>
          </template>
          <template v-else>
            <NuxtLink
              :to="routes.auth.signIn()"
              class="text-gray-600 hover:text-gray-900"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              :to="routes.auth.signUp()"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign up
            </NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>
