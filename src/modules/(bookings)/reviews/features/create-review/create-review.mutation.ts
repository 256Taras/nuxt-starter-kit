import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1ReviewsBookingByIdMutation } from "#src/common/api/sdk-queries";
import { BOOKING_QUERY_KEYS } from "#src/modules/(bookings)/bookings";
import { REVIEW_QUERY_KEYS } from "../../entity";
import type { UUID } from "#src/types";

export function useCreateReviewMutation(serviceId: () => UUID) {
  const queryClient = useQueryClient();
  return useMutation({
    ...postV1ReviewsBookingByIdMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.byService(serviceId()) });
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.detail(vars.path.id) });
    },
  });
}
