import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1ReviewsBookingById } from "#src/common/api/sdk";
import { BOOKING_QUERY_KEYS } from "#src/modules/(bookings)/bookings";
import { REVIEW_QUERY_KEYS } from "../../entity";
import type { ReviewCreateInput } from "../../entity";
import type { UUID } from "#src/types";

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { bookingId: UUID; serviceId: UUID; body: ReviewCreateInput }) => {
      const { data } = await postV1ReviewsBookingById({
        path: { id: vars.bookingId },
        body: vars.body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.byService(vars.serviceId) });
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEYS.detail(vars.bookingId) });
    },
  });
}
