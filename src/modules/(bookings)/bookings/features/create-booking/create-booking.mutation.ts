import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1BookingsMutation } from "#src/common/api/sdk-queries";
import { BOOKING_QUERY_KEYS } from "../../entity";

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postV1BookingsMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.lists() });
    },
  });
}
