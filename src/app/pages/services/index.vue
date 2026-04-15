<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import {
  useServicesListQuery,
  formatPrice,
  formatDuration,
  ServiceStatusLabel,
  ServiceStatusColor,
} from "#src/modules/(marketplace)/services";
import type { PaginationParams } from "#src/types";
import { DEFAULT_PAGE_SIZE } from "#src/types";
import { useAppRouter } from "#src/common/routing/app-router";
import { Button } from "#src/common/components/atoms/button";
import { StatusBadge } from "#src/common/components/atoms/status-badge";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Pagination } from "#src/common/components/molecules/pagination";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";
import { ErrorState } from "#src/common/components/molecules/error-state";
import { EmptyState } from "#src/common/components/molecules/empty-state";
import { Eye, Plus } from "lucide-vue-next";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Services" });

const paginationParams = ref<PaginationParams>({ page: 1, limit: DEFAULT_PAGE_SIZE });
const { routes } = useAppRouter();

const { data: response, items: services, isLoading, isError, error, refetch } = useServicesListQuery(paginationParams);

function setPage(page: number) {
  paginationParams.value = { ...paginationParams.value, page };
}
</script>

<template>
  <div>
    <PageHeader title="Services">
      <template #actions>
        <Button as-child>
          <NuxtLink :to="routes.services.create()">
            <Plus
              :size="16"
              class="mr-2"
            />
            New service
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
        v-if="services.length === 0"
        title="No services yet"
        description="Create one from a provider page."
      />

      <template v-else>
        <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
          <table
            class="w-full text-sm"
            aria-label="Services list"
          >
            <thead class="bg-muted/50 border-b">
              <tr>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Duration</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th class="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="service in services"
                :key="service.id"
                class="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td class="px-4 py-3 font-medium text-card-foreground">{{ service.name }}</td>
                <td class="px-4 py-3 text-muted-foreground">{{ formatPrice(service.price) }}</td>
                <td class="px-4 py-3 text-muted-foreground">{{ formatDuration(service.duration) }}</td>
                <td class="px-4 py-3">
                  <StatusBadge :class="ServiceStatusColor[service.status]">
                    {{ ServiceStatusLabel[service.status] }}
                  </StatusBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <Button
                    as-child
                    variant="outline"
                    size="sm"
                  >
                    <NuxtLink :to="routes.services.view({ id: service.id })">
                      <Eye
                        :size="14"
                        class="mr-1"
                      />
                      View
                    </NuxtLink>
                  </Button>
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
