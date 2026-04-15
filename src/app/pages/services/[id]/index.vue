<script setup lang="ts">
import { definePageMeta } from "#imports";
import {
  useServiceDetailQuery,
  formatPrice,
  formatDuration,
  ServiceStatusLabel,
  ServiceStatusColor,
  DeleteServiceButton,
} from "#src/modules/(marketplace)/services";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { Button } from "#src/common/components/atoms/button";
import { StatusBadge } from "#src/common/components/atoms/status-badge";
import { BackLink } from "#src/common/components/molecules/back-link";
import { DataField } from "#src/common/components/molecules/data-field";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Pencil, Calendar } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const serviceId = useRouteId("services-id");
const { routes } = useAppRouter();

const { data: service, isLoading, isError, error } = useServiceDetailQuery(serviceId);
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.services.list()">Back to services</BackLink>
    </div>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading service...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.userMessage ?? "Failed to load service" }}
    </div>

    <template v-else-if="service">
      <PageHeader :title="service.name">
        <template #actions>
          <Button as-child>
            <NuxtLink :to="routes.bookings.createForService(service.id)">
              <Calendar
                :size="16"
                class="mr-2"
              />
              Book now
            </NuxtLink>
          </Button>
          <Button
            as-child
            variant="outline"
          >
            <NuxtLink :to="routes.services.edit({ id: service.id })">
              <Pencil
                :size="16"
                class="mr-2"
              />
              Edit
            </NuxtLink>
          </Button>
          <DeleteServiceButton :service="service" />
        </template>
      </PageHeader>

      <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <DataField label="Description">{{ service.description ?? "No description" }}</DataField>
          <DataField label="Price">{{ formatPrice(service.price) }}</DataField>
          <DataField label="Duration">{{ formatDuration(service.duration) }}</DataField>
          <DataField label="Status">
            <StatusBadge :class="ServiceStatusColor[service.status]">
              {{ ServiceStatusLabel[service.status] }}
            </StatusBadge>
          </DataField>
        </div>
      </div>
    </template>
  </div>
</template>
