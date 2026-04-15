<script setup lang="ts">
import { computed } from "vue";
import { useUpdateUser } from "./use-update-user";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { DataField } from "#src/common/components/molecules/data-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

const props = defineProps<{
  userId: UUID;
}>();

const { routes } = useAppRouter();
const userIdRef = computed(() => props.userId);

const {
  user,
  isLoading,
  isError,
  error,
  firstName,
  firstNameAttrs,
  lastName,
  lastNameAttrs,
  errors,
  meta,
  isPending,
  onSubmit,
} = useUpdateUser(userIdRef);
</script>

<template>
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

  <Card
    v-else-if="user"
    class="max-w-lg"
  >
    <CardHeader>
      <CardTitle class="text-2xl">Edit user</CardTitle>
      <CardDescription>Update {{ user.email }}</CardDescription>
    </CardHeader>

    <form @submit="onSubmit">
      <CardContent class="space-y-4">
        <DataField label="Email">{{ user.email }}</DataField>

        <div class="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            v-slot="field"
            label="First name"
            :error="errors.firstName"
          >
            <Input
              id="firstName"
              v-model="firstName"
              v-bind="{ ...firstNameAttrs, ...field }"
            />
          </FormField>

          <FormField
            id="lastName"
            v-slot="field"
            label="Last name"
            :error="errors.lastName"
          >
            <Input
              id="lastName"
              v-model="lastName"
              v-bind="{ ...lastNameAttrs, ...field }"
            />
          </FormField>
        </div>

        <div class="flex gap-2 pt-2">
          <Button
            type="submit"
            :disabled="isPending || !meta.valid"
          >
            <span v-text="isPending ? 'Saving...' : 'Save changes'" />
          </Button>
          <Button
            as-child
            type="button"
            variant="outline"
          >
            <NuxtLink :to="routes.users.view({ id: userId })">Cancel</NuxtLink>
          </Button>
        </div>
      </CardContent>
    </form>
  </Card>
</template>
