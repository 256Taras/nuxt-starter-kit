import { useColorMode } from "#imports";
import type { ColorModeInstance } from "@nuxtjs/color-mode/dist/runtime/types";

export type ThemePreference = "light" | "dark" | "system";

const CYCLE: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

/**
 * Thin wrapper over `@nuxtjs/color-mode` that exposes a 3-state preference
 * (light / dark / system) and a cycle action — the shadcn-vue pattern.
 */
export function useTheme(): {
  mode: ColorModeInstance;
  cycle: () => void;
} {
  const mode = useColorMode();
  function cycle(): void {
    mode.preference = CYCLE[mode.preference as ThemePreference];
  }
  return { mode, cycle };
}
