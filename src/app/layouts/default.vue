<script setup lang="ts">
import { useAuthenticationStore, LogOutButton } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/routing/app-router";
import { Navbar } from "#src/common/components/molecules/navbar";
import { ThemeToggle } from "#src/common/components/atoms/theme-toggle";
import { User, Users, Store, Briefcase, Calendar } from "lucide-vue-next";

const authStore = useAuthenticationStore();
const { routes } = useAppRouter();
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Navbar
      brand-label="Nuxt Starter Kit"
      :brand-to="routes.home()"
    >
      <template v-if="authStore.isAuthenticated">
        <NuxtLink
          :to="routes.providers.list()"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Store :size="18" />
          <span>Providers</span>
        </NuxtLink>
        <NuxtLink
          :to="routes.services.list()"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Briefcase :size="18" />
          <span>Services</span>
        </NuxtLink>
        <NuxtLink
          :to="routes.bookings.list()"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Calendar :size="18" />
          <span>Bookings</span>
        </NuxtLink>
        <NuxtLink
          :to="routes.users.list()"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Users :size="18" />
          <span>Users</span>
        </NuxtLink>
        <NuxtLink
          :to="routes.profile()"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <User :size="18" />
          <span>Profile</span>
        </NuxtLink>
        <LogOutButton />
      </template>
      <template v-else>
        <NuxtLink
          :to="routes.auth.signIn()"
          class="text-muted-foreground hover:text-foreground"
        >
          Sign in
        </NuxtLink>
        <NuxtLink
          :to="routes.auth.signUp()"
          class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Sign up
        </NuxtLink>
      </template>
      <ThemeToggle />
    </Navbar>

    <main
      id="main-content"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <slot />
    </main>
  </div>
</template>
