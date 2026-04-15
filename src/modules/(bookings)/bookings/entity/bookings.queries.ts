import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getV1BookingsOptions,
  getV1BookingsByIdOptions,
  getV1BookingsQueryKey,
  getV1BookingsByIdQueryKey,
} from "#src/common/api/sdk-queries";
import type { GetV1BookingsData } from "#src/common/api/sdk";
import type { BookingListItem } from "./bookings.types";
import type { UUID } from "#src/types";

export type BookingListParams = NonNullable<GetV1BookingsData["query"]>;

export const BOOKING_QUERY_KEYS = {
  lists: () => getV1BookingsQueryKey({}),
  detail: (id: string) => getV1BookingsByIdQueryKey({ path: { id } }),
};

export function useBookingsListQuery(params: Ref<BookingListParams>) {
  const query = useQuery(computed(() => getV1BookingsOptions({ query: params.value })));
  const items = computed<BookingListItem[]>(() => (query.data.value?.data ?? []) as BookingListItem[]);
  return { ...query, items };
}

export function useBookingDetailQuery(id: Ref<UUID>) {
  return useQuery(
    computed(() => ({
      ...getV1BookingsByIdOptions({ path: { id: id.value } }),
      enabled: !!id.value,
    })),
  );
}
