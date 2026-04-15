import { useLogOutMutation } from "./log-out.mutation";
import { useAuthenticationStore } from "../../entity";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";

export function useLogOut() {
  const mutation = useLogOutMutation();
  const authStore = useAuthenticationStore();
  const { pushTo } = useAppRouter();

  async function logOutAndClear() {
    await mutation.mutateAsync({});
    authStore.clearCredentials();
  }

  async function logOut() {
    const ok = await runWithToast(logOutAndClear, undefined, {
      success: "Signed out",
      error: "Sign out failed",
    });
    if (ok) await pushTo.auth.signIn();
  }

  return {
    isPending: mutation.isPending,
    logOut,
  };
}
