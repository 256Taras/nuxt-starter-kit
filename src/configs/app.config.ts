import { useRuntimeConfig } from "#imports";

export function useAppConfig() {
  const runtime = useRuntimeConfig();

  return {
    name: runtime.public.appName as string,
    url: runtime.public.appUrl as string,
    env: runtime.public.appEnv as string,
    isDev: runtime.public.appEnv === "development",
    isProd: runtime.public.appEnv === "production",
  };
}
