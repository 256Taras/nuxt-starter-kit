<script setup lang="ts">
import type { Booking } from "../../entity";
import { canConfirm } from "../../entity";
import { useConfirmBooking } from "./use-confirm-booking";
import { Button } from "#src/common/components/atoms/button";
import type { UUID } from "#src/types";
import { CheckCircle } from "lucide-vue-next";

const props = defineProps<{
  booking: Booking;
}>();

const { trigger, isPending } = useConfirmBooking(() => props.booking.id as UUID);
</script>

<template>
  <Button
    v-if="canConfirm(booking)"
    :disabled="isPending"
    @click="trigger"
  >
    <CheckCircle
      :size="16"
      class="mr-2"
    />
    <span v-text="isPending ? 'Confirming...' : 'Confirm'" />
  </Button>
</template>
