<script setup lang="ts">
import { computed, ref } from "vue";
import { definePageMeta, useSeoMeta } from "#imports";
import {
  useBookingsListQuery,
  formatDateTime,
  formatTotalPrice,
  BookingStatusLabel,
  BookingStatusColor,
} from "#src/modules/(bookings)/bookings";
import type { CursorPaginationParams } from "#src/types";
import { useAppRouter } from "#src/common/routing/app-router";
import { Button } from "#src/common/components/atoms/button";
import { StatusBadge } from "#src/common/components/atoms/status-badge";
import { CursorPagination } from "#src/common/components/molecules/pagination";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { SkeletonList } from "#src/common/components/molecules/skeleton-list";
import { ErrorState } from "#src/common/components/molecules/error-state";
import { EmptyState } from "#src/common/components/molecules/empty-state";
import { Eye, Plus } from "lucide-vue-next";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Bookings" });

const cursorParams = ref<CursorPaginationParams>({ limit: 10 });
const { routes, pushTo } = useAppRouter();

const { data: response, items: bookings, isLoading, isError, error, refetch } = useBookingsListQuery(cursorParams);
const meta = computed(() => response.value?.meta);

function handlePrevPage() {
  const cursor = meta.value?.startCursor;
  if (cursor) cursorParams.value = { ...cursorParams.value, before: cursor, after: undefined };
}

function handleNextPage() {
  const cursor = meta.value?.endCursor;
  if (cursor) cursorParams.value = { ...cursorParams.value, after: cursor, before: undefined };
}
</script>

<template>
  <div>
    <PageHeader title="Bookings">
      <template #actions>
        <Button @click="pushTo.bookings.create()">
          <Plus
            :size="16"
            class="mr-2"
          />
          New booking
        </Button>
      </template>
    </PageHeader>

    <SkeletonList v-if="isLoading" />

    <ErrorState
      v-else-if="isError"
      :message="error?.userMessage"
      @retry="refetch()"
    />

    <template v-else-if="response">
      <EmptyState
        v-if="bookings.length === 0"
        title="No bookings yet"
      >
        <template #action>
          <Button @click="pushTo.bookings.create()">
            <Plus
              :size="16"
              class="mr-2"
            />
            Create your first booking
          </Button>
        </template>
      </EmptyState>

      <template v-else>
        <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
          <table
            class="w-full text-sm"
            aria-label="Bookings list"
          >
            <thead class="bg-muted/50 border-b">
              <tr>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Start</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">End</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th class="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th class="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="booking in bookings"
                :key="booking.id"
                class="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td class="px-4 py-3 text-card-foreground">
                  {{ formatDateTime(booking.startAt) }}
                </td>
                <td class="px-4 py-3 text-muted-foreground">
                  {{ formatDateTime(booking.endAt) }}
                </td>
                <td class="px-4 py-3">
                  <StatusBadge :class="BookingStatusColor[booking.status]">
                    {{ BookingStatusLabel[booking.status] }}
                  </StatusBadge>
                </td>
                <td class="px-4 py-3 text-muted-foreground">
                  {{ formatTotalPrice(booking.totalPrice) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <NuxtLink :to="routes.bookings.view({ id: booking.id })">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Eye
                        :size="14"
                        class="mr-1"
                      />
                      View
                    </Button>
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-center">
          <CursorPagination
            :has-next-page="!!meta?.hasNextPage"
            :has-previous-page="!!meta?.hasPreviousPage"
            @next="handleNextPage"
            @prev="handlePrevPage"
          />
        </div>
      </template>
    </template>
  </div>
</template>
