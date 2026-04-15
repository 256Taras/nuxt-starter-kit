<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import type { UUID, PaginationParams } from "#src/types";
import { CreateServiceForm } from "#src/modules/(marketplace)/services";
import { useProvidersListQuery } from "#src/modules/(marketplace)/providers";
import { useAppRouter } from "#src/common/routing/app-router";
import { useQueryParam } from "#src/common/composables/use-query-param";
import { BackLink } from "#src/common/components/molecules/back-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Create service" });

const { routes } = useAppRouter();
const providerIdQuery = useQueryParam<UUID>("providerId");

const selectedProviderId = ref<UUID | null>(providerIdQuery.value || null);
watch(providerIdQuery, (next) => {
  if (next) selectedProviderId.value = next;
});

const SELECTION_LIST_LIMIT = 100;

const providersParams = ref<PaginationParams>({ page: 1, limit: SELECTION_LIST_LIMIT });
const { items: providers, isLoading: providersLoading } = useProvidersListQuery(providersParams);

const hasProvider = computed(() => !!selectedProviderId.value);
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.services.list()">Back to services</BackLink>
    </div>

    <Card class="max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Create service</CardTitle>
        <CardDescription>
          <template v-if="hasProvider">Add a new service to your provider</template>
          <template v-else>Pick a provider and add a new service</template>
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-if="!hasProvider"
          class="space-y-2"
        >
          <label
            for="providerId"
            class="text-sm font-medium text-card-foreground"
          >
            Provider
          </label>
          <SkeletonList
            v-if="providersLoading"
            :rows="1"
          />
          <select
            v-else
            id="providerId"
            v-model="selectedProviderId"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option
              :value="null"
              disabled
            >
              Select a provider…
            </option>
            <option
              v-for="provider in providers"
              :key="provider.id"
              :value="provider.id"
            >
              {{ provider.name }}
            </option>
          </select>
        </div>

        <CreateServiceForm
          v-if="selectedProviderId"
          :provider-id="selectedProviderId"
        />
      </CardContent>
    </Card>
  </div>
</template>
