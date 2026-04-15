<script setup lang="ts">
import { useCreateService } from "./use-create-service";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

const props = defineProps<{
  providerId: UUID;
}>();

const { routes } = useAppRouter();
const {
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
} = useCreateService(() => props.providerId);
</script>

<template>
  <form @submit="onSubmit">
    <div class="space-y-4">
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
          placeholder="Service name"
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
          placeholder="Optional description"
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
          placeholder="https://example.com/image.png"
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
          <span v-text="isPending ? 'Creating...' : 'Create service'" />
        </Button>
        <Button
          as-child
          type="button"
          variant="outline"
        >
          <NuxtLink :to="routes.services.list()">Cancel</NuxtLink>
        </Button>
      </div>
    </div>
  </form>
</template>
