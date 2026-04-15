import { useConfirmBookingMutation } from "./confirm-booking.mutation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import type { UUID } from "#src/types";

export function useConfirmBooking(bookingId: () => UUID) {
  const mutation = useConfirmBookingMutation();

  function trigger() {
    return runWithToast(
      mutation.mutateAsync,
      { path: { id: bookingId() } },
      {
        success: "Booking confirmed",
        error: "Failed to confirm booking",
      },
    );
  }

  return { trigger, isPending: mutation.isPending };
}
