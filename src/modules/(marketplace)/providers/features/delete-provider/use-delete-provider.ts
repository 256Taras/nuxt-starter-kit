import { useDeleteProviderMutation } from "./delete-provider.mutation";
import { useFocusTrapOnOpen } from "#src/common/composables/use-focus-trap-on-open";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useDeleteProvider(providerId: () => UUID) {
  const mutation = useDeleteProviderMutation();
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
      { path: { id: providerId() } },
      {
        success: "Provider deleted",
        error: "Failed to delete provider",
      },
    );
    if (ok) {
      isOpen.value = false;
      await pushTo.providers.list();
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
