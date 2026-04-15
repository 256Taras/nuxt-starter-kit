<script setup lang="ts">
import { useCreateBooking } from "./use-create-booking";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

const props = defineProps<{
  serviceId: UUID;
}>();

const { routes } = useAppRouter();
const { startAt, startAtAttrs, errors, meta, isPending, onSubmit } = useCreateBooking(() => props.serviceId);
</script>

<template>
  <form @submit="onSubmit">
    <div class="space-y-4">
      <FormField
        id="startAt"
        v-slot="field"
        label="Start date and time"
        :error="errors.startAt"
      >
        <Input
          id="startAt"
          v-model="startAt"
          v-bind="{ ...startAtAttrs, ...field }"
          type="datetime-local"
        />
      </FormField>

      <div class="flex gap-2 pt-2">
        <Button
          type="submit"
          :disabled="isPending || !meta.valid"
        >
          <span v-text="isPending ? 'Booking...' : 'Create booking'" />
        </Button>
        <Button
          as-child
          type="button"
          variant="outline"
        >
          <NuxtLink :to="routes.bookings.list()">Cancel</NuxtLink>
        </Button>
      </div>
    </div>
  </form>
</template>
