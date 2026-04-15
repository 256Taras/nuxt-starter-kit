<script setup lang="ts">
import { storeToRefs } from "pinia";
import { definePageMeta } from "#imports";
import { useProfilesStore, useUsersListQuery } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/router/app-router";
import { Button } from "#src/common/components/atoms/button";
import { Pagination } from "#src/common/components/molecules/pagination";
import { Plus, Eye, Pencil } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const store = useProfilesStore();
const { paginationParams } = storeToRefs(store);
const { getFullName, getRoleLabel } = store;
const { routes } = useAppRouter();

const { data: response, isLoading, isError, error } = useUsersListQuery(paginationParams);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-foreground">Users</h1>
      <NuxtLink :to="routes.users.create()">
        <Button>
          <Plus
            :size="16"
            class="mr-2"
          />
          Create user
        </Button>
      </NuxtLink>
    </div>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading users...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.message ?? "Failed to load users" }}
    </div>

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
              v-for="user in response.data"
              :key="user.id"
              class="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-card-foreground">{{ getFullName(user) }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
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
          :total-pages="response.meta.totalPages"
          :has-next-page="response.meta.hasNextPage"
          :has-previous-page="response.meta.hasPreviousPage"
          @update:page="store.setPage"
        />
      </div>
    </template>
  </div>
</template>
