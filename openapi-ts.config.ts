import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/docs/json",
  output: {
    path: "src/common/api/sdk",
  },
  plugins: [
    {
      name: "@hey-api/client-ofetch",
      runtimeConfigPath: "../sdk-runtime-config",
    },
    {
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/sdk",
    },
    {
      name: "@tanstack/vue-query",
    },
  ],
});
