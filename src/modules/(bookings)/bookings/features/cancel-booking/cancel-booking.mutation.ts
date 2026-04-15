import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { patchV1BookingsByIdCancelMutation } from "#src/common/api/sdk-queries";
import { BOOKING_QUERY_KEYS } from "../../entity";
import type { UUID } from "#src/types";

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...patchV1BookingsByIdCancelMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.detail(vars.path.id as UUID) });
    },
  });
}
