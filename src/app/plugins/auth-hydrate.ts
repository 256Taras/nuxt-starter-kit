import { defineNuxtPlugin, useCookie } from "#imports";
import { getV1UsersProfile } from "#src/common/api/sdk";
import { useAuthenticationStore } from "#src/modules/(users)/authentication";
import { AUTH_CONFIG } from "#src/configs";

/**
 * Hydrates the authentication store with the current user on app boot.
 * Without this, a page reload shows guest UI until something fetches the profile,
 * because the store's `currentUser` ref is in-memory and lost across reloads.
 *
 * Runs on both server and client so the hydrated store survives SSR → CSR.
 */
export default defineNuxtPlugin(async () => {
  const accessToken = useCookie<string | null>(AUTH_CONFIG.cookies.accessToken).value;
  if (!accessToken) return;

  const authStore = useAuthenticationStore();
  if (authStore.currentUser) return;

  try {
    const { data } = await getV1UsersProfile({ throwOnError: true });
    if (data) {
      authStore.setCurrentUser(data);
    }
  } catch {
    // Silent fail: 401 is handled by sdk-runtime-config which will clear cookies
    // and redirect to /sign-in. Any other error just leaves currentUser = null
    // (middleware falls back to cookie check anyway).
  }
});
