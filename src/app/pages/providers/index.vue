<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import { useProvidersListQuery, getRatingLabel } from "#src/modules/(marketplace)/providers";
import type { PaginationParams } from "#src/types";
import { useAppRouter } from "#src/common/routing/app-router";
import { Button } from "#src/common/components/atoms/button";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Pagination } from "#src/common/components/molecules/pagination";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";
import { ErrorState } from "#src/common/components/molecules/error-state";
import { EmptyState } from "#src/common/components/molecules/empty-state";
import { Plus, Eye, Pencil, CheckCircle } from "lucide-vue-next";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Providers" });

const paginationParams = ref<PaginationParams>({ page: 1, limit: 10 });
const { routes } = useAppRouter();

const {
  data: response,
  items: providers,
  isLoading,
  isError,
  error,
  refetch,
} = useProvidersListQuery(paginationParams);

function setPage(page: number) {
  paginationParams.value = { ...paginationParams.value, page };
}
</script>

<template>
  <div>
    <PageHeader title="Providers">
      <template #actions>
        <Button as-child>
          <NuxtLink :to="routes.providers.create()">
            <Plus
              :size="16"
              class="mr-2"
            />
            Create provider
          </NuxtLink>
        </Button>
      </template>
    </PageHeader>

    <SkeletonList v-if="isLoading" />

    <ErrorState
      v-else-if="isError"
      :message="error?.userMessage"
      @retry="refetch()"
    />

    <template v-else-if="response">
      <EmptyState
        v-if="providers.length === 0"
        title="No providers yet"
        description="Create your first provider to get started."
      >
        <template #action>
          <Button as-child>
            <NuxtLink :to="routes.providers.create()">
              <Plus
                :size="16"
                class="mr-2"
              />
              Create provider
            </NuxtLink>
          </Button>
        </template>
      </EmptyState>

      <template v-else>
        <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
          <table
            class="w-full text-sm"
            aria-label="Providers list"
          >
            <thead class="bg-muted/50 border-b">
              <tr>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Rating</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Reviews</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Verified</th>
                <th class="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="provider in providers"
                :key="provider.id"
                class="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td class="px-4 py-3 font-medium text-card-foreground">{{ provider.name }}</td>
                <td class="px-4 py-3 text-muted-foreground">
                  {{ provider.rating }} ({{ getRatingLabel(provider.rating) }})
                </td>
                <td class="px-4 py-3 text-muted-foreground">{{ provider.reviewsCount }}</td>
                <td class="px-4 py-3">
                  <CheckCircle
                    v-if="provider.isVerified"
                    :size="16"
                    class="text-green-600"
                    aria-label="Verified"
                  />
                  <span
                    v-else
                    class="text-muted-foreground text-xs"
                  >
                    Not verified
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      as-child
                      variant="outline"
                      size="sm"
                    >
                      <NuxtLink :to="routes.providers.view({ id: provider.id })">
                        <Eye
                          :size="14"
                          class="mr-1"
                        />
                        View
                      </NuxtLink>
                    </Button>
                    <Button
                      as-child
                      variant="outline"
                      size="sm"
                    >
                      <NuxtLink :to="routes.providers.edit({ id: provider.id })">
                        <Pencil
                          :size="14"
                          class="mr-1"
                        />
                        Edit
                      </NuxtLink>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-center">
          <Pagination
            :page="response.meta.page"
            :total-pages="response.meta.pageCount"
            :has-next-page="response.meta.hasNextPage"
            :has-previous-page="response.meta.hasPreviousPage"
            @update:page="setPage"
          />
        </div>
      </template>
    </template>
  </div>
</template>
