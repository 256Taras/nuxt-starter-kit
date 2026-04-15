import { useDeleteServiceMutation } from "./delete-service.mutation";
import { useFocusTrapOnOpen } from "#src/common/composables/use-focus-trap-on-open";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useDeleteService(serviceId: () => UUID) {
  const mutation = useDeleteServiceMutation();
  const { isOpen, dialogRef } = useFocusTrapOnOpen();
  const { pushTo } = useAppRouter();

  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }

  async function confirm() {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { path: { id: serviceId() } },
      {
        success: "Service deleted",
        error: "Failed to delete service",
      },
    );
    if (ok) {
      isOpen.value = false;
      await pushTo.services.list();
    }
  }

  return {
    isOpen,
    dialogRef,
    isPending: mutation.isPending,
    open,
    close,
    confirm,
  };
}
