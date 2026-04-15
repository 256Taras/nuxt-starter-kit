<script setup lang="ts">
import { useHead, useSeoMeta } from "#imports";
import { useAppConfig } from "#src/configs";

const app = useAppConfig();

useHead({
  titleTemplate: (title) => (title ? `${title} — ${app.name}` : app.name),
});

useSeoMeta({
  ogSiteName: app.name,
  ogType: "website",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
