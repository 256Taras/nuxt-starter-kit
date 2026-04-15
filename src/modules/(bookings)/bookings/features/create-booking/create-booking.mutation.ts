import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1Bookings } from "#src/common/api/sdk";
import { BOOKING_QUERY_KEYS } from "../../entity";
import type { CreateBookingFormValues } from "./create-booking.schema";
import type { UUID } from "#src/types";

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { serviceId: UUID; values: CreateBookingFormValues }) => {
      const body = { serviceId: vars.serviceId, startAt: new Date(vars.values.startAt).toISOString() };
      const { data } = await postV1Bookings({ body, throwOnError: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.lists() });
    },
  });
}
