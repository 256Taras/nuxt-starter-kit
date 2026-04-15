import { ofetch } from "ofetch";
import type { FetchOptions } from "ofetch";
import { useCookie, navigateTo } from "#imports";
import { AUTH_CONFIG, useApiConfig } from "#src/configs";

interface HttpClient {
  get: <T>(url: string, options?: FetchOptions) => Promise<T>;
  post: <T>(url: string, body?: unknown, options?: FetchOptions) => Promise<T>;
  put: <T>(url: string, body?: unknown, options?: FetchOptions) => Promise<T>;
  delete: <T>(url: string, options?: FetchOptions) => Promise<T>;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshTokens(baseURL: string): Promise<boolean> {
  const refreshToken = useCookie(AUTH_CONFIG.cookies.refreshToken).value;
  if (!refreshToken) return false;

  try {
    const credentials = await ofetch<{
      accessToken: string;
      refreshToken: string;
    }>("/v1/auth/refresh-tokens", {
      baseURL,
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

export function useHttpClient(): HttpClient {
  const apiConfig = useApiConfig();

  const instance = ofetch.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    retry: apiConfig.retries,
    headers: {
      "Content-Type": "application/json",
    },

    onRequest({ options }) {
      const accessToken = useCookie(AUTH_CONFIG.cookies.accessToken).value;
      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        };
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

      refreshPromise = refreshPromise ?? tryRefreshTokens(apiConfig.baseUrl);
      const refreshed = await refreshPromise;
      refreshPromise = null;

      if (!refreshed) {
        useCookie(AUTH_CONFIG.cookies.accessToken).value = null;
        useCookie(AUTH_CONFIG.cookies.refreshToken).value = null;
        navigateTo("/sign-in");
        return;
      }

      const newToken = useCookie(AUTH_CONFIG.cookies.accessToken).value;
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      throw ofetch(url, { ...options, headers: options.headers });
    },
  });

  return {
    get: <T>(url: string, options?: FetchOptions) => instance<T>(url, { ...options, method: "GET" }),

    post: <T>(url: string, body?: unknown, options?: FetchOptions) =>
      instance<T>(url, { ...options, method: "POST", body }),

    put: <T>(url: string, body?: unknown, options?: FetchOptions) =>
      instance<T>(url, { ...options, method: "PUT", body }),

    delete: <T>(url: string, options?: FetchOptions) => instance<T>(url, { ...options, method: "DELETE" }),
  };
}
