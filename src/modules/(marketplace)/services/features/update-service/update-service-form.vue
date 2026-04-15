<script setup lang="ts">
import { computed } from "vue";
import { useUpdateService } from "./use-update-service";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

const props = defineProps<{
  serviceId: UUID;
}>();

const { routes } = useAppRouter();
const serviceIdRef = computed(() => props.serviceId);

const {
  service,
  isLoading,
  isError,
  error,
  name,
  nameAttrs,
  description,
  descriptionAttrs,
  imageUrl,
  imageUrlAttrs,
  price,
  priceAttrs,
  duration,
  durationAttrs,
  errors,
  meta,
  isPending,
  onSubmit,
} = useUpdateService(serviceIdRef);
</script>

<template>
  <div
    v-if="isLoading"
    class="text-muted-foreground"
    aria-live="polite"
  >
    Loading service...
  </div>
  <div
    v-else-if="isError"
    class="text-destructive"
    role="alert"
  >
    {{ error?.userMessage ?? "Failed to load service" }}
  </div>

  <Card
    v-else-if="service"
    class="max-w-lg"
  >
    <CardHeader>
      <CardTitle class="text-2xl">Edit service</CardTitle>
      <CardDescription>Update {{ service.name }}</CardDescription>
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
          id="imageUrl"
          v-slot="field"
          label="Image URL"
          :error="errors.imageUrl"
        >
          <Input
            id="imageUrl"
            v-model="imageUrl"
            v-bind="{ ...imageUrlAttrs, ...field }"
          />
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField
            id="price"
            v-slot="field"
            label="Price ($)"
            :error="errors.price"
          >
            <Input
              id="price"
              v-model.number="price"
              v-bind="{ ...priceAttrs, ...field }"
              type="number"
              step="0.01"
              min="0"
            />
          </FormField>

          <FormField
            id="duration"
            v-slot="field"
            label="Duration (min)"
            :error="errors.duration"
          >
            <Input
              id="duration"
              v-model.number="duration"
              v-bind="{ ...durationAttrs, ...field }"
              type="number"
              min="1"
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
            <NuxtLink :to="routes.services.view({ id: serviceId })">Cancel</NuxtLink>
          </Button>
        </div>
      </CardContent>
    </form>
  </Card>
</template>
