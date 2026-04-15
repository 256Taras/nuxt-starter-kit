<script setup lang="ts">
import type { Booking } from "#src/modules/(bookings)/bookings";
import { canPay } from "#src/modules/(bookings)/bookings";
import { usePayBooking } from "./use-pay-booking";
import { Button } from "#src/common/components/atoms/button";
import type { UUID } from "#src/types";
import { CreditCard } from "lucide-vue-next";

const props = defineProps<{
  booking: Booking;
}>();

const { trigger, isPending } = usePayBooking(() => props.booking.id as UUID);
</script>

<template>
  <Button
    v-if="canPay(booking)"
    variant="outline"
    :disabled="isPending"
    @click="trigger"
  >
    <CreditCard
      :size="16"
      class="mr-2"
    />
    <span v-text="isPending ? 'Paying...' : 'Pay'" />
  </Button>
</template>
