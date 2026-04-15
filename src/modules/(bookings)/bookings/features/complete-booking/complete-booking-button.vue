<script setup lang="ts">
import type { Booking } from "../../entity";
import { canComplete } from "../../entity";
import { useCompleteBooking } from "./use-complete-booking";
import { Button } from "#src/common/components/atoms/button";
import type { UUID } from "#src/types";
import { CircleCheck } from "lucide-vue-next";

const props = defineProps<{
  booking: Booking;
}>();

const { trigger, isPending } = useCompleteBooking(() => props.booking.id as UUID);
</script>

<template>
  <Button
    v-if="canComplete(booking)"
    :disabled="isPending"
    @click="trigger"
  >
    <CircleCheck
      :size="16"
      class="mr-2"
    />
    <span v-text="isPending ? 'Completing...' : 'Complete'" />
  </Button>
</template>
