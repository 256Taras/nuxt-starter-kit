<script setup lang="ts">
import { computed } from "vue";
import { Sun, Moon, Monitor } from "lucide-vue-next";
import { useTheme, type ThemePreference } from "#src/common/composables/use-theme";
import { Button } from "#src/common/components/atoms/button";

const { mode, cycle } = useTheme();

const icon = computed(() => {
  const pref = mode.preference as ThemePreference;
  if (pref === "light") return Sun;
  if (pref === "dark") return Moon;
  return Monitor;
});

const label = computed(() => {
  const pref = mode.preference as ThemePreference;
  if (pref === "light") return "Light theme, click to switch to dark";
  if (pref === "dark") return "Dark theme, click to switch to system";
  return "System theme, click to switch to light";
});
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :aria-label="label"
    :title="label"
    @click="cycle"
  >
    <ClientOnly>
      <component
        :is="icon"
        :size="18"
      />
    </ClientOnly>
  </Button>
</template>
