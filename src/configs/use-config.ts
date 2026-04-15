import { useAppConfig } from "./app.config";
import { useApiConfig } from "./api.config";
import { AUTH_CONFIG } from "./auth.config";
import { useFeatureFlags } from "./feature-flags.config";

export function useConfig() {
  return {
    app: useAppConfig(),
    api: useApiConfig(),
    auth: AUTH_CONFIG,
    features: useFeatureFlags(),
  };
}
