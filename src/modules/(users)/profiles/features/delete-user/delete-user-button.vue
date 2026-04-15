<script setup lang="ts">
import type { User } from "../../entity";
import { getFullName } from "../../entity";
import { useDeleteUser } from "./use-delete-user";
import { Button } from "#src/common/components/atoms/button";
import type { UUID } from "#src/types";
import { Trash2 } from "lucide-vue-next";

const props = defineProps<{
  user: User;
}>();

const { isOpen, dialogRef, isPending, open, close, confirm } = useDeleteUser(() => props.user.id as UUID);
</script>

<template>
  <Button
    variant="outline"
    class="text-destructive hover:bg-destructive/10"
    @click="open"
  >
    <Trash2
      :size="16"
      class="mr-2"
    />
    Delete
  </Button>

  <div
    v-if="isOpen"
    ref="dialogRef"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-user-dialog-title"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="close"
    @keydown.escape="close"
  >
    <div class="bg-card rounded-lg p-6 shadow-lg max-w-sm w-full space-y-4">
      <h2
        id="delete-user-dialog-title"
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
          @click="close"
        >
          Cancel
        </Button>
        <Button
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="isPending"
          @click="confirm"
        >
          <span v-text="isPending ? 'Deleting...' : 'Delete'" />
        </Button>
      </div>
    </div>
  </div>
</template>
