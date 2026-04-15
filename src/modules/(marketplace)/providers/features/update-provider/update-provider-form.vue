<script setup lang="ts">
import { useUpdateProvider } from "./use-update-provider";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";
import { computed } from "vue";

const props = defineProps<{
  providerId: UUID;
}>();

const { routes } = useAppRouter();
const providerIdRef = computed(() => props.providerId);

const {
  provider,
  isLoading,
  isError,
  error,
  name,
  nameAttrs,
  description,
  descriptionAttrs,
  logoUrl,
  logoUrlAttrs,
  errors,
  meta,
  isPending,
  onSubmit,
} = useUpdateProvider(providerIdRef);
</script>

<template>
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

  <Card
    v-else-if="provider"
    class="max-w-lg"
  >
    <CardHeader>
      <CardTitle class="text-2xl">Edit provider</CardTitle>
      <CardDescription>Update {{ provider.name }}</CardDescription>
    </CardHeader>

    <form @submit="onSubmit">
      <CardContent class="space-y-4">
        <FormField
          id="name"
          v-slot="field"
          label="Name"
          :error="errors.name"
        >
          <Input
            id="name"
            v-model="name"
            v-bind="{ ...nameAttrs, ...field }"
          />
        </FormField>

        <FormField
          id="description"
          v-slot="field"
          label="Description"
          :error="errors.description"
        >
          <Input
            id="description"
            v-model="description"
            v-bind="{ ...descriptionAttrs, ...field }"
          />
        </FormField>

        <FormField
          id="logoUrl"
          v-slot="field"
          label="Logo URL"
          :error="errors.logoUrl"
        >
          <Input
            id="logoUrl"
            v-model="logoUrl"
            v-bind="{ ...logoUrlAttrs, ...field }"
          />
        </FormField>

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
            <NuxtLink :to="routes.providers.view({ id: providerId })">Cancel</NuxtLink>
          </Button>
        </div>
      </CardContent>
    </form>
  </Card>
</template>
