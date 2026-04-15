<script setup lang="ts">
import { definePageMeta } from "#imports";
import { useProviderDetailQuery, DeleteProviderButton } from "#src/modules/(marketplace)/providers";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { Button } from "#src/common/components/atoms/button";
import { BackLink } from "#src/common/components/molecules/back-link";
import { DataField } from "#src/common/components/molecules/data-field";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Pencil, CheckCircle, Plus } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const providerId = useRouteId("providers-id");
const { routes } = useAppRouter();

const { data: provider, isLoading, isError, error } = useProviderDetailQuery(providerId);
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.providers.list()">Back to providers</BackLink>
    </div>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading provider...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.userMessage ?? "Failed to load provider" }}
    </div>

    <template v-else-if="provider">
      <PageHeader>
        <template #title>
          <span class="inline-flex items-center gap-3">
            {{ provider.name }}
            <CheckCircle
              v-if="provider.isVerified"
              :size="20"
              class="text-green-600"
              aria-label="Verified provider"
            />
          </span>
        </template>
        <template #actions>
          <Button
            as-child
            variant="outline"
          >
            <NuxtLink :to="routes.services.createForProvider(provider.id)">
              <Plus
                :size="16"
                class="mr-2"
              />
              Add service
            </NuxtLink>
          </Button>
          <Button
            as-child
            variant="outline"
          >
            <NuxtLink :to="routes.providers.edit({ id: provider.id })">
              <Pencil
                :size="16"
                class="mr-2"
              />
              Edit
            </NuxtLink>
          </Button>
          <DeleteProviderButton :provider="provider" />
        </template>
      </PageHeader>

      <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <DataField label="Description">{{ provider.description ?? "No description" }}</DataField>
          <DataField label="Rating">{{ provider.rating }} ({{ provider.reviewsCount }} reviews)</DataField>
          <DataField label="Logo">{{ provider.logoUrl ?? "No logo" }}</DataField>
          <DataField label="Created">{{ new Date(provider.createdAt).toLocaleDateString() }}</DataField>
        </div>
      </div>
    </template>
  </div>
</template>
