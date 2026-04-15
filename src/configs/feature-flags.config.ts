import { useRuntimeConfig } from "#imports";

const FeatureFlag = {
  NewDashboard: "newDashboard",
  BetaFeatures: "betaFeatures",
} as const;

type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

type FeatureFlags = Record<FeatureFlag, boolean>;

function resolveFlags(): FeatureFlags {
  const runtime = useRuntimeConfig();
  const env = runtime.public;

  return {
    newDashboard: (env.ffNewDashboard as string) === "true",
    betaFeatures: (env.ffBetaFeatures as string) === "true",
  };
}

export function useFeatureFlags() {
  const flags = resolveFlags();

  return {
    flags,
    isEnabled: (flag: FeatureFlag) => flags[flag] === true,
    FeatureFlag,
  };
}
