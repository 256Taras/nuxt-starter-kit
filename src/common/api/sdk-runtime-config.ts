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

// Backend auth endpoints that verify the refresh token (x-refresh-token header)
// instead of the access token — see node-starter-kit auth.router.v1.ts.
const REFRESH_TOKEN_ENDPOINTS = ["/v1/auth/refresh-tokens", "/v1/auth/log-out"];
const REFRESH_TOKEN_HEADER = "x-refresh-token";

function needsRefreshTokenHeader(url: string): boolean {
  return REFRESH_TOKEN_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

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
      headers: { [REFRESH_TOKEN_HEADER]: refreshToken },
    });

    useCookie(AUTH_CONFIG.cookies.accessToken).value = credentials.accessToken;
    useCookie(AUTH_CONFIG.cookies.refreshToken).value = credentials.refreshToken;
    return true;
  } catch {
    return false;
  }
}

/**
 * Deduped refresh — if multiple callers (proactive timer, reactive 401 handler)
 * fire simultaneously, they share the same in-flight request.
 */
export function runRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = tryRefreshTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function signOutAndRedirect(): void {
  useCookie(AUTH_CONFIG.cookies.accessToken).value = null;
  useCookie(AUTH_CONFIG.cookies.refreshToken).value = null;
  navigateTo("/sign-in");
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
    onRequest({ request, options }) {
      const url = typeof request === "string" ? request : request.url;
      const existing = options.headers as unknown as Record<string, string>;

      if (needsRefreshTokenHeader(url)) {
        const refreshToken = useCookie(AUTH_CONFIG.cookies.refreshToken).value;
        if (refreshToken) {
          options.headers = {
            ...existing,
            [REFRESH_TOKEN_HEADER]: refreshToken,
          } as unknown as typeof options.headers;
        }
        return;
      }

      const accessToken = useCookie(AUTH_CONFIG.cookies.accessToken).value;
      if (accessToken) {
        options.headers = {
          ...existing,
          Authorization: `Bearer ${accessToken}`,
        } as unknown as typeof options.headers;
      }
    },
    async onResponseError({ request, options, response }) {
      if (response.status !== 401) return;

      const url = typeof request === "string" ? request : request.url;

      // 401 on refresh/logout endpoint is terminal — cookies are already
      // dead weight, drop them and bounce to sign-in.
      if (needsRefreshTokenHeader(url)) {
        signOutAndRedirect();
        return;
      }

      const refreshed = await runRefresh();
      if (!refreshed) {
        signOutAndRedirect();
        return;
      }

      // Throwing a Promise from onResponseError makes ofetch use its result
      // as the original request's response. baseURL is passed explicitly in
      // case `url` is a relative path.
      const newToken = useCookie(AUTH_CONFIG.cookies.accessToken).value;
      throw ofetch(url, {
        ...options,
        baseURL: API_BASE_URL,
        headers: {
          ...(options.headers as unknown as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        },
      });
    },
  };
};
