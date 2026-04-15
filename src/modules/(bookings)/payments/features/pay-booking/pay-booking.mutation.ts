import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1PaymentsBookingsByIdPayMutation } from "#src/common/api/sdk-queries";
import { BOOKING_QUERY_KEYS } from "#src/modules/(bookings)/bookings";
import type { UUID } from "#src/types";

export function usePayBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postV1PaymentsBookingsByIdPayMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.detail(vars.path.id as UUID) });
    },
  });
}
