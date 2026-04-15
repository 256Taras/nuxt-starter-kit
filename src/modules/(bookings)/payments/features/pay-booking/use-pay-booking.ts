import { usePayBookingMutation } from "./pay-booking.mutation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import type { UUID } from "#src/types";

export function usePayBooking(bookingId: () => UUID) {
  const mutation = usePayBookingMutation();

  function trigger() {
    return runWithToast(
      mutation.mutateAsync,
      { path: { id: bookingId() } },
      {
        success: "Payment successful",
        error: "Failed to pay",
      },
    );
  }

  return { trigger, isPending: mutation.isPending };
}
