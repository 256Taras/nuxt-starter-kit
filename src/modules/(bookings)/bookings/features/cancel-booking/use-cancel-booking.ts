import { ref, watch, nextTick } from "vue";
import type { Ref } from "vue";
import { useCancelBookingMutation } from "./cancel-booking.mutation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import type { UUID } from "#src/types";

interface UseCancelBookingReturn {
  isFormOpen: Ref<boolean>;
  reason: Ref<string>;
  inputRef: Ref<HTMLInputElement | null>;
  isPending: ReturnType<typeof useCancelBookingMutation>["isPending"];
  open: () => void;
  close: () => void;
  toggle: () => void;
  confirm: () => Promise<void>;
}

export function useCancelBooking(bookingId: () => UUID): UseCancelBookingReturn {
  const mutation = useCancelBookingMutation();
  const isFormOpen = ref(false);
  const reason = ref("");
  const inputRef = ref<HTMLInputElement | null>(null);

  watch(isFormOpen, async (open) => {
    if (!open) return;
    await nextTick();
    inputRef.value?.focus();
  });

  function open() {
    isFormOpen.value = true;
  }
  function close() {
    isFormOpen.value = false;
  }
  function toggle() {
    isFormOpen.value = !isFormOpen.value;
  }

  async function confirm() {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { path: { id: bookingId() }, body: reason.value ? { reason: reason.value } : undefined },
      { success: "Booking cancelled", error: "Failed to cancel booking" },
    );
    if (ok) {
      isFormOpen.value = false;
      reason.value = "";
    }
  }

  return { isFormOpen, reason, inputRef, isPending: mutation.isPending, open, close, toggle, confirm };
}
