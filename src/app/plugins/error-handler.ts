import { defineNuxtPlugin } from "#imports";
import { toast } from "vue3-toastify";
import { formatApiError } from "#src/common/utils/errors/format-api-error";

/**
 * Catches unhandled Vue component errors. Without this, a broken render /
 * thrown composable silently shows a blank UI; users have no idea anything
 * is wrong. We toast the message and log to the console (hook Sentry here
 * when wired up).
 *
 * Mutation errors are handled by `runWithToast` — they never reach this
 * handler. Query errors surface through TanStack's `isError`/`error` on the
 * consuming page. This fires only for everything else: template expressions,
 * `onMounted` throws, watchers, etc.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err, _instance, info) => {
    const message = formatApiError(err, err instanceof Error ? err.message : "Unexpected error");
    toast.error(message);

    console.error("[vue errorHandler]", info, err);
  };

  nuxtApp.hook("vue:error", (err) => {
    // Nuxt's own error hook — mirrors the above for errors that bypass
    // Vue's config.errorHandler (e.g. SSR paths).

    console.error("[nuxt vue:error]", err);
  });
});
