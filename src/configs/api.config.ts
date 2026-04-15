import { useRuntimeConfig } from "#imports";

const TIMEOUT_MS = 30_000;
const RETRIES = 1;

export function useApiConfig() {
  const runtime = useRuntimeConfig();

  return {
    baseUrl: runtime.public.apiBaseUrl as string,
    timeout: TIMEOUT_MS,
    retries: RETRIES,
  };
}
