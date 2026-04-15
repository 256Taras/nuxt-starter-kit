<script setup lang="ts">
import { useAuthenticationStore, LogOutButton } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/routing/app-router";
import { User, Users, Store, Briefcase, Calendar } from "lucide-vue-next";

const authStore = useAuthenticationStore();
const { routes } = useAppRouter();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white"
    >
      Skip to main content
    </a>
    <header class="bg-white shadow-sm border-b">
      <nav
        aria-label="Main navigation"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <NuxtLink
          :to="routes.home()"
          class="text-xl font-semibold text-gray-900"
        >
          Nuxt Starter Kit
        </NuxtLink>

        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              :to="routes.providers.list()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Store :size="18" />
              <span>Providers</span>
            </NuxtLink>
            <NuxtLink
              :to="routes.services.list()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Briefcase :size="18" />
              <span>Services</span>
            </NuxtLink>
            <NuxtLink
              :to="routes.bookings.list()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Calendar :size="18" />
              <span>Bookings</span>
            </NuxtLink>
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
            <LogOutButton />
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

    <main
      id="main-content"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <slot />
    </main>
  </div>
</template>
