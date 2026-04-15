<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import type { UUID, PaginationParams } from "#src/types";
import { CreateBookingForm } from "#src/modules/(bookings)/bookings";
import { useServicesListQuery } from "#src/modules/(marketplace)/services";
import { useProvidersListQuery } from "#src/modules/(marketplace)/providers";
import { useAuthenticationStore } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/routing/app-router";
import { useQueryParam } from "#src/common/composables/use-query-param";
import { BackLink } from "#src/common/components/molecules/back-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";
import { EmptyState } from "#src/common/components/molecules/empty-state";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Create booking" });

const { routes } = useAppRouter();
const authStore = useAuthenticationStore();
const serviceIdQuery = useQueryParam<UUID>("serviceId");

const selectedServiceId = ref<UUID | null>(serviceIdQuery.value || null);
watch(serviceIdQuery, (next) => {
  if (next) selectedServiceId.value = next;
});

const SELECTION_LIST_LIMIT = 100;

const servicesParams = ref<PaginationParams>({ page: 1, limit: SELECTION_LIST_LIMIT });
const providersParams = ref<PaginationParams>({ page: 1, limit: SELECTION_LIST_LIMIT });
const { items: services, isLoading: servicesLoading } = useServicesListQuery(servicesParams);
const { items: providers, isLoading: providersLoading } = useProvidersListQuery(providersParams);

const isLoading = computed(() => servicesLoading.value || providersLoading.value);

// Backend rejects bookings on services the user owns ("Cannot book your own
// service"), so exclude services whose provider belongs to the current user.
const bookableServices = computed(() => {
  const userId = authStore.currentUser?.id;
  if (!userId) return services.value;
  const myProviderIds = new Set(providers.value.filter((p) => p.userId === userId).map((p) => p.id));
  return services.value.filter((s) => !myProviderIds.has(s.providerId));
});

const hasService = computed(() => !!selectedServiceId.value);
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.bookings.list()">Back to bookings</BackLink>
    </div>

    <Card class="max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Create booking</CardTitle>
        <CardDescription>
          <template v-if="hasService">Schedule a new appointment</template>
          <template v-else>Pick a service and schedule an appointment</template>
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-if="!hasService"
          class="space-y-2"
        >
          <label
            for="serviceId"
            class="text-sm font-medium text-card-foreground"
          >
            Service
          </label>
          <SkeletonList
            v-if="isLoading"
            :rows="1"
          />
          <EmptyState
            v-else-if="bookableServices.length === 0"
            title="No services available to book"
            description="All listed services belong to your providers."
          />
          <select
            v-else
            id="serviceId"
            v-model="selectedServiceId"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option
              :value="null"
              disabled
            >
              Select a service…
            </option>
            <option
              v-for="service in bookableServices"
              :key="service.id"
              :value="service.id"
            >
              {{ service.name }}
            </option>
          </select>
        </div>

        <CreateBookingForm
          v-if="selectedServiceId"
          :service-id="selectedServiceId"
        />
      </CardContent>
    </Card>
  </div>
</template>
