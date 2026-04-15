import type { StorybookConfig } from "@storybook/vue3-vite";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],

  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },

  viteFinal(config) {
    // Replace the default vue plugin with explicit one to fix Vite 7 compatibility
    config.plugins = (config.plugins ?? []).filter(
      (plugin) => !(plugin && typeof plugin === "object" && "name" in plugin && plugin.name === "vite:vue"),
    );
    config.plugins.unshift(vue());
    config.plugins.push(tailwindcss());

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "#src": fileURLToPath(new URL("../src", import.meta.url)),
      "@": fileURLToPath(new URL("../src", import.meta.url)),
      "~": fileURLToPath(new URL("../src", import.meta.url)),
    };

    return config;
  },
};

export default config;
