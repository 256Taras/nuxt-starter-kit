<script setup lang="ts">
import { ref, computed } from "vue";
import { definePageMeta, useRoute } from "#imports";
import { toast } from "vue3-toastify";
import { useUserDetailQuery, useRemoveUserMutation, useProfilesStore } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/router/app-router";
import { Button } from "#src/common/components/atoms/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const route = useRoute();
const userId = computed(() => route.params.id as string);
const { routes, pushTo } = useAppRouter();
const { getRoleLabel, getFullName } = useProfilesStore();

const { data: user, isLoading, isError, error } = useUserDetailQuery(userId);
const removeMutation = useRemoveUserMutation();
const showDeleteConfirm = ref(false);

async function handleDelete() {
  try {
    await removeMutation.mutateAsync(userId.value);
    toast.success("User deleted");
    await pushTo.users.list();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "Failed to delete user");
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink
        :to="routes.users.list()"
        class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft :size="16" />
        Back to users
      </NuxtLink>
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
      {{ error?.message ?? "Failed to load user" }}
    </div>

    <template v-else-if="user">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-foreground">{{ getFullName(user) }}</h1>
        <div class="flex gap-2">
          <NuxtLink :to="routes.users.edit({ id: user.id })">
            <Button variant="outline">
              <Pencil
                :size="16"
                class="mr-2"
              />
              Edit
            </Button>
          </NuxtLink>
          <Button
            variant="outline"
            class="text-destructive hover:bg-destructive/10"
            @click="showDeleteConfirm = true"
          >
            <Trash2
              :size="16"
              class="mr-2"
            />
            Delete
          </Button>
        </div>
      </div>

      <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm text-muted-foreground">First name</span>
            <p class="font-medium text-card-foreground">{{ user.firstName }}</p>
          </div>
          <div>
            <span class="text-sm text-muted-foreground">Last name</span>
            <p class="font-medium text-card-foreground">{{ user.lastName }}</p>
          </div>
          <div>
            <span class="text-sm text-muted-foreground">Email</span>
            <p class="font-medium text-card-foreground">{{ user.email }}</p>
          </div>
          <div>
            <span class="text-sm text-muted-foreground">Role</span>
            <p class="font-medium text-card-foreground">{{ getRoleLabel(user.role) }}</p>
          </div>
        </div>
      </div>

      <!-- Delete confirmation -->
      <div
        v-if="showDeleteConfirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="showDeleteConfirm = false"
        @keydown.escape="showDeleteConfirm = false"
      >
        <div class="bg-card rounded-lg p-6 shadow-lg max-w-sm w-full space-y-4">
          <h2
            id="delete-dialog-title"
            class="text-lg font-semibold text-card-foreground"
          >
            Delete user?
          </h2>
          <p class="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{{ getFullName(user) }}</strong
            >? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-2">
            <Button
              variant="outline"
              @click="showDeleteConfirm = false"
              >Cancel</Button
            >
            <Button
              class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              :disabled="removeMutation.isPending.value"
              @click="handleDelete"
            >
              {{ removeMutation.isPending.value ? "Deleting..." : "Delete" }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
