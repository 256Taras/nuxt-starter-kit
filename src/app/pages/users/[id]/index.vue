<script setup lang="ts">
import { definePageMeta } from "#imports";
import { useUserDetailQuery, getRoleLabel, getFullName, DeleteUserButton } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { Button } from "#src/common/components/atoms/button";
import { BackLink } from "#src/common/components/molecules/back-link";
import { DataField } from "#src/common/components/molecules/data-field";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Pencil } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const userId = useRouteId("users-id");
const { routes } = useAppRouter();

const { data: user, isLoading, isError, error } = useUserDetailQuery(userId);
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.users.list()">Back to users</BackLink>
    </div>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading user...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.userMessage ?? "Failed to load user" }}
    </div>

    <template v-else-if="user">
      <PageHeader :title="getFullName(user)">
        <template #actions>
          <Button
            as-child
            variant="outline"
          >
            <NuxtLink :to="routes.users.edit({ id: user.id })">
              <Pencil
                :size="16"
                class="mr-2"
              />
              Edit
            </NuxtLink>
          </Button>
          <DeleteUserButton :user="user" />
        </template>
      </PageHeader>

      <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <DataField label="First name">{{ user.firstName }}</DataField>
          <DataField label="Last name">{{ user.lastName }}</DataField>
          <DataField label="Email">{{ user.email }}</DataField>
          <DataField label="Role">{{ getRoleLabel(user.role) }}</DataField>
        </div>
      </div>
    </template>
  </div>
</template>
