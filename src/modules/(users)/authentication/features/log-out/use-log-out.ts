import { useLogOutMutation } from "./log-out.mutation";
import { useAuthenticationStore } from "../../entity";
import { useAppRouter } from "#src/common/routing/app-router";

export function useLogOut() {
  const mutation = useLogOutMutation();
  const authStore = useAuthenticationStore();
  const { pushTo } = useAppRouter();

  // Optimistic: clear local state + redirect immediately so the user isn't
  // blocked by a possibly-failing backend call (expired session, 401, network).
  // The server-side session record is invalidated best-effort in the background.
  async function logOut() {
    authStore.clearCredentials();
    void mutation.mutateAsync({}).catch(() => undefined);
    await pushTo.auth.signIn();
  }

  return {
    isPending: mutation.isPending,
    logOut,
  };
}
