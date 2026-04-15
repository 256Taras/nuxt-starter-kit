<script setup lang="ts">
import { definePageMeta } from "#imports";
import {
  useBookingDetailQuery,
  isCancelled,
  formatDateTime,
  formatTotalPrice,
  formatCancellationFee,
  BookingStatusLabel,
  BookingStatusColor,
  CancelBookingButton,
  ConfirmBookingButton,
  CompleteBookingButton,
} from "#src/modules/(bookings)/bookings";
import { PayBookingButton } from "#src/modules/(bookings)/payments";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { StatusBadge } from "#src/common/components/atoms/status-badge";
import { BackLink } from "#src/common/components/molecules/back-link";
import { DataField } from "#src/common/components/molecules/data-field";
import { PageHeader } from "#src/common/components/molecules/page-header";

definePageMeta({ layout: "default" });

const bookingId = useRouteId("bookings-id");
const { routes } = useAppRouter();
const { data: booking, isLoading, isError, error } = useBookingDetailQuery(bookingId);
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.bookings.list()">Back to bookings</BackLink>
    </div>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading booking...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.userMessage ?? "Failed to load booking" }}
    </div>

    <template v-else-if="booking">
      <PageHeader title="Booking details">
        <template #actions>
          <StatusBadge
            size="md"
            :class="BookingStatusColor[booking.status]"
          >
            {{ BookingStatusLabel[booking.status] }}
          </StatusBadge>
        </template>
      </PageHeader>

      <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <DataField label="Start">{{ formatDateTime(booking.startAt) }}</DataField>
          <DataField label="End">{{ formatDateTime(booking.endAt) }}</DataField>
          <DataField label="Total price">{{ formatTotalPrice(booking.totalPrice) }}</DataField>
          <DataField label="Created">{{ formatDateTime(booking.createdAt) }}</DataField>
        </div>

        <template v-if="isCancelled(booking)">
          <div class="border-t pt-4">
            <DataField label="Cancellation reason">
              {{ booking.cancellationReason ?? "No reason provided" }}
            </DataField>
          </div>
          <DataField
            v-if="booking.cancellationFee"
            label="Cancellation fee"
          >
            {{ formatCancellationFee(booking.cancellationFee) }}
          </DataField>
        </template>
      </div>

      <h2 class="text-lg font-semibold text-foreground mb-3">Actions</h2>
      <div class="flex flex-wrap gap-2">
        <ConfirmBookingButton :booking="booking" />
        <CompleteBookingButton :booking="booking" />
        <PayBookingButton :booking="booking" />
        <CancelBookingButton :booking="booking" />
      </div>
    </template>
  </div>
</template>
