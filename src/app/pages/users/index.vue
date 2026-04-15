<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import { useUsersListQuery, getFullName, getRoleLabel, UserRoleColor } from "#src/modules/(users)/profiles";
import type { PaginationParams } from "#src/types";
import { DEFAULT_PAGE_SIZE } from "#src/types";
import { useAppRouter } from "#src/common/routing/app-router";
import { Button } from "#src/common/components/atoms/button";
import { StatusBadge } from "#src/common/components/atoms/status-badge";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Pagination } from "#src/common/components/molecules/pagination";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";
import { ErrorState } from "#src/common/components/molecules/error-state";
import { Plus, Eye, Pencil } from "lucide-vue-next";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Users" });

const paginationParams = ref<PaginationParams>({ page: 1, limit: DEFAULT_PAGE_SIZE });
const { routes } = useAppRouter();

const { data: response, items: users, isLoading, isError, error, refetch } = useUsersListQuery(paginationParams);

function setPage(page: number) {
  paginationParams.value = { ...paginationParams.value, page };
}
</script>

<template>
  <div>
    <PageHeader title="Users">
      <template #actions>
        <Button as-child>
          <NuxtLink :to="routes.users.create()">
            <Plus
              :size="16"
              class="mr-2"
            />
            Create user
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
      <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
        <table
          class="w-full text-sm"
          aria-label="Users list"
        >
          <thead class="bg-muted/50 border-b">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-card-foreground">{{ getFullName(user) }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ user.email }}</td>
              <td class="px-4 py-3">
                <StatusBadge :class="UserRoleColor[user.role]">
                  {{ getRoleLabel(user.role) }}
                </StatusBadge>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink :to="routes.users.view({ id: user.id })">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Eye
                        :size="14"
                        class="mr-1"
                      />
                      View
                    </Button>
                  </NuxtLink>
                  <NuxtLink :to="routes.users.edit({ id: user.id })">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Pencil
                        :size="14"
                        class="mr-1"
                      />
                      Edit
                    </Button>
                  </NuxtLink>
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
  </div>
</template>
