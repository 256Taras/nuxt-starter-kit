import { useCompleteBookingMutation } from "./complete-booking.mutation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import type { UUID } from "#src/types";

export function useCompleteBooking(bookingId: () => UUID) {
  const mutation = useCompleteBookingMutation();

  function trigger() {
    return runWithToast(
      mutation.mutateAsync,
      { path: { id: bookingId() } },
      {
        success: "Booking completed",
        error: "Failed to complete booking",
      },
    );
  }

  return { trigger, isPending: mutation.isPending };
}
