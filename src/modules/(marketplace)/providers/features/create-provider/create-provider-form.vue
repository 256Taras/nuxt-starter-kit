<script setup lang="ts">
import { useCreateProvider } from "./use-create-provider";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { useAppRouter } from "#src/common/routing/app-router";

const { routes } = useAppRouter();
const { name, nameAttrs, description, descriptionAttrs, logoUrl, logoUrlAttrs, errors, meta, isPending, onSubmit } =
  useCreateProvider();
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
          placeholder="Provider name"
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
        id="logoUrl"
        v-slot="field"
        label="Logo URL"
        :error="errors.logoUrl"
      >
        <Input
          id="logoUrl"
          v-model="logoUrl"
          v-bind="{ ...logoUrlAttrs, ...field }"
          placeholder="https://example.com/logo.png"
        />
      </FormField>

      <div class="flex gap-2 pt-2">
        <Button
          type="submit"
          :disabled="isPending || !meta.valid"
        >
          <span v-text="isPending ? 'Creating...' : 'Create provider'" />
        </Button>
        <Button
          as-child
          type="button"
          variant="outline"
        >
          <NuxtLink :to="routes.providers.list()">Cancel</NuxtLink>
        </Button>
      </div>
    </div>
  </form>
</template>
