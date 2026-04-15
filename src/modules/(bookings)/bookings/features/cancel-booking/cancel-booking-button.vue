<script setup lang="ts">
import type { Booking } from "../../entity";
import { canCancel } from "../../entity";
import { useCancelBooking } from "./use-cancel-booking";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import type { UUID } from "#src/types";
import { Ban } from "lucide-vue-next";

const props = defineProps<{
  booking: Booking;
}>();

const { isFormOpen, reason, inputRef, isPending, toggle, close, confirm } = useCancelBooking(
  () => props.booking.id as UUID,
);
</script>

<template>
  <template v-if="canCancel(booking)">
    <Button
      variant="outline"
      class="text-destructive hover:bg-destructive/10"
      :aria-expanded="isFormOpen"
      aria-controls="cancel-booking-form"
      @click="toggle"
    >
      <Ban
        :size="16"
        class="mr-2"
      />
      Cancel booking
    </Button>

    <div
      v-if="isFormOpen"
      id="cancel-booking-form"
      class="mt-4 rounded-lg border bg-card p-4 shadow-sm max-w-md space-y-3"
      aria-live="polite"
    >
      <label
        for="cancellationReason"
        class="text-sm font-medium text-card-foreground"
      >
        Cancellation reason (optional)
      </label>
      <Input
        id="cancellationReason"
        ref="inputRef"
        v-model="reason"
        placeholder="Reason for cancellation"
      />
      <div class="flex gap-2">
        <Button
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="isPending"
          @click="confirm"
        >
          <span v-text="isPending ? 'Cancelling...' : 'Confirm cancellation'" />
        </Button>
        <Button
          variant="outline"
          @click="close"
        >
          Close
        </Button>
      </div>
    </div>
  </template>
</template>
