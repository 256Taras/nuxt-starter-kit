import { useDeleteUserMutation } from "./delete-user.mutation";
import { useFocusTrapOnOpen } from "#src/common/composables/use-focus-trap-on-open";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useDeleteUser(userId: () => UUID) {
  const mutation = useDeleteUserMutation();
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
      { path: { id: userId() } },
      {
        success: "User deleted",
        error: "Failed to delete user",
      },
    );
    if (ok) {
      isOpen.value = false;
      await pushTo.users.list();
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
