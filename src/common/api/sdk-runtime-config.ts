import { ofetch } from "ofetch";
import { useCookie, navigateTo } from "#imports";
import { AUTH_CONFIG } from "#src/configs";
import type { CreateClientConfig } from "./sdk/client.gen";

// Read baseURL directly from env — SDK client initializes at module-import time,
// which is BEFORE a Nuxt request context exists on the server. Calling
// `useRuntimeConfig()` here would throw "composable called outside Nuxt instance".
// Nuxt inlines `process.env.NUXT_PUBLIC_*` at build for both server and client.
const API_BASE_URL =
  (typeof process !== "undefined" ? process.env.NUXT_PUBLIC_API_BASE_URL : undefined) ?? "http://localhost:8000";
const API_TIMEOUT_MS = 30_000;
const API_RETRIES = 1;

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = useCookie(AUTH_CONFIG.cookies.refreshToken).value;
  if (!refreshToken) return false;

  try {
    const credentials = await ofetch<{
      accessToken: string;
      refreshToken: string;
    }>("/v1/auth/refresh-tokens", {
      baseURL: API_BASE_URL,
      method: "PUT",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    useCookie(AUTH_CONFIG.cookies.accessToken).value = credentials.accessToken;
    useCookie(AUTH_CONFIG.cookies.refreshToken).value = credentials.refreshToken;
    return true;
  } catch {
    return false;
  }
}

export const createClientConfig: CreateClientConfig = (config) => {
  return {
    ...config,
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    retry: API_RETRIES,
    headers: {
      "Content-Type": "application/json",
    },
    onRequest({ options }) {
      const accessToken = useCookie(AUTH_CONFIG.cookies.accessToken).value;
      if (accessToken) {
        options.headers = {
          ...(options.headers as unknown as Record<string, string>),
          Authorization: `Bearer ${accessToken}`,
        } as unknown as typeof options.headers;
      }
    },
    async onResponseError({ request, options, response }) {
      if (response.status !== 401) return;

      const url = typeof request === "string" ? request : request.url;
      if (url.includes("/v1/auth/refresh-tokens")) {
        useCookie(AUTH_CONFIG.cookies.accessToken).value = null;
        useCookie(AUTH_CONFIG.cookies.refreshToken).value = null;
        navigateTo("/sign-in");
        return;
      }

      if (!refreshPromise) {
        refreshPromise = tryRefreshTokens().finally(() => {
          refreshPromise = null;
        });
      }
      const refreshed = await refreshPromise;

      if (!refreshed) {
        useCookie(AUTH_CONFIG.cookies.accessToken).value = null;
        useCookie(AUTH_CONFIG.cookies.refreshToken).value = null;
        navigateTo("/sign-in");
        return;
      }

      const newToken = useCookie(AUTH_CONFIG.cookies.accessToken).value;
      options.headers = {
        ...(options.headers as unknown as Record<string, string>),
        Authorization: `Bearer ${newToken}`,
      } as unknown as typeof options.headers;
      throw ofetch(url, { ...options, headers: options.headers });
    },
  };
};
