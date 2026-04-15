import { watch } from "vue";
import { defineNuxtPlugin, useCookie } from "#imports";
import { AUTH_CONFIG } from "#src/configs";
import { runRefresh } from "#src/common/api/sdk-runtime-config";

const REFRESH_BUFFER_MS = 30_000;

/** Ms until we should refresh, or null if the token can't be parsed. */
function msUntilRefresh(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64)) as { exp?: unknown };
    if (typeof exp !== "number") return null;
    return exp * 1000 - Date.now() - REFRESH_BUFFER_MS;
  } catch {
    return null;
  }
}

/**
 * Refresh the access token shortly before it expires. Self-reschedules after
 * each refresh by re-reading the cookie, because independent `useCookie` refs
 * don't share reactivity — writes from runRefresh() wouldn't fire the watch.
 */
export default defineNuxtPlugin(() => {
  const accessToken = useCookie<string | null>(AUTH_CONFIG.cookies.accessToken);
  let timerId: ReturnType<typeof setTimeout> | null = null;

  function schedule(token: string | null | undefined): void {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    if (!token) return;

    const delay = msUntilRefresh(token);
    if (delay === null) return;

    timerId = setTimeout(
      async () => {
        const ok = await runRefresh();
        if (!ok) return;
        // runRefresh wrote new tokens via a separate useCookie ref, so our
        // `accessToken` ref above won't update. Read the cookie fresh.
        schedule(useCookie<string | null>(AUTH_CONFIG.cookies.accessToken).value);
      },
      Math.max(delay, 0),
    );
  }

  // `immediate: true` handles app boot; the watch also catches sign-in/sign-out
  // when the auth store writes the cookie (same-ref case).
  watch(accessToken, schedule, { immediate: true });
});
