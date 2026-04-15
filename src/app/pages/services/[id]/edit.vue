<script setup lang="ts">
import { definePageMeta } from "#imports";
import { UpdateServiceForm } from "#src/modules/(marketplace)/services";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { BackLink } from "#src/common/components/molecules/back-link";

definePageMeta({ layout: "default" });

const serviceId = useRouteId("services-id-edit");
const { routes } = useAppRouter();
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.services.view({ id: serviceId })">Back to service</BackLink>
    </div>

    <UpdateServiceForm :service-id="serviceId" />
  </div>
</template>
