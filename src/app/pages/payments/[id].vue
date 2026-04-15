<script setup lang="ts">
import { definePageMeta } from "#imports";
import { formatDateTime, formatDateTimeOrFallback } from "#src/common/utils/dates/format-date";
import {
  usePaymentDetailQuery,
  PaymentStatusLabel,
  PaymentStatusColor,
  formatAmount,
} from "#src/modules/(bookings)/payments";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { StatusBadge } from "#src/common/components/atoms/status-badge";
import { BackLink } from "#src/common/components/molecules/back-link";
import { DataField } from "#src/common/components/molecules/data-field";
import { PageHeader } from "#src/common/components/molecules/page-header";

definePageMeta({ layout: "default" });

const paymentId = useRouteId("payments-id");
const { routes } = useAppRouter();

const { data: payment, isLoading, isError, error } = usePaymentDetailQuery(paymentId);
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
      Loading payment...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.userMessage ?? "Failed to load payment" }}
    </div>

    <template v-else-if="payment">
      <PageHeader title="Payment details">
        <template #actions>
          <StatusBadge
            size="md"
            :class="PaymentStatusColor[payment.status]"
          >
            {{ PaymentStatusLabel[payment.status] }}
          </StatusBadge>
        </template>
      </PageHeader>

      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <div class="grid grid-cols-2 gap-4">
          <DataField label="Amount">{{ formatAmount(payment.amount) }}</DataField>
          <DataField label="Booking ID">
            <NuxtLink
              :to="routes.bookings.view({ id: payment.bookingId })"
              class="text-primary hover:underline"
            >
              {{ payment.bookingId }}
            </NuxtLink>
          </DataField>
          <DataField label="Paid at">{{ formatDateTimeOrFallback(payment.paidAt, "Not paid") }}</DataField>
          <DataField label="Refunded at">{{ formatDateTimeOrFallback(payment.refundedAt, "N/A") }}</DataField>
          <DataField label="Created">{{ formatDateTime(payment.createdAt) }}</DataField>
        </div>
      </div>
    </template>
  </div>
</template>
