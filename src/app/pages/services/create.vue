<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import type { UUID, PaginationParams } from "#src/types";
import { CreateServiceForm } from "#src/modules/(marketplace)/services";
import { useProvidersListQuery } from "#src/modules/(marketplace)/providers";
import { useAuthenticationStore } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/routing/app-router";
import { useQueryParam } from "#src/common/composables/use-query-param";
import { BackLink } from "#src/common/components/molecules/back-link";
import { Button } from "#src/common/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";
import { EmptyState } from "#src/common/components/molecules/empty-state";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Create service" });

const { routes } = useAppRouter();
const authStore = useAuthenticationStore();
const providerIdQuery = useQueryParam<UUID>("providerId");

const selectedProviderId = ref<UUID | null>(providerIdQuery.value || null);
watch(providerIdQuery, (next) => {
  if (next) selectedProviderId.value = next;
});

const SELECTION_LIST_LIMIT = 100;

const providersParams = ref<PaginationParams>({ page: 1, limit: SELECTION_LIST_LIMIT });
const { items: allProviders, isLoading: providersLoading } = useProvidersListQuery(providersParams);

// Backend enforces provider ownership — only list the current user's providers
// in the picker so the user can't pick one that will 403 on submit.
const myProviders = computed(() => {
  const userId = authStore.currentUser?.id;
  return userId ? allProviders.value.filter((p) => p.userId === userId) : [];
});

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
          <EmptyState
            v-else-if="myProviders.length === 0"
            title="No providers yet"
            description="You need a provider profile before you can add services."
          >
            <template #action>
              <Button as-child>
                <NuxtLink :to="routes.providers.create()">Create provider</NuxtLink>
              </Button>
            </template>
          </EmptyState>
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
              v-for="provider in myProviders"
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
