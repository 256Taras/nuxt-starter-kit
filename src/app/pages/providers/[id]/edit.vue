<script setup lang="ts">
import { definePageMeta } from "#imports";
import { UpdateProviderForm } from "#src/modules/(marketplace)/providers";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { BackLink } from "#src/common/components/molecules/back-link";

definePageMeta({ layout: "default" });

const providerId = useRouteId("providers-id-edit");
const { routes } = useAppRouter();
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.providers.view({ id: providerId })">Back to provider</BackLink>
    </div>

    <UpdateProviderForm :provider-id="providerId" />
  </div>
</template>
