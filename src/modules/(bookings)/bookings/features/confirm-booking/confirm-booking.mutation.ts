import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { patchV1BookingsByIdConfirmMutation } from "#src/common/api/sdk-queries";
import { BOOKING_QUERY_KEYS } from "../../entity";
export function useConfirmBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...patchV1BookingsByIdConfirmMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.detail(vars.path.id) });
    },
  });
}
