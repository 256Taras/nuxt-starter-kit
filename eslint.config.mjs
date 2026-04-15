import withNuxt from "./.nuxt/eslint.config.mjs";
import prettier from "eslint-plugin-prettier/recommended";

// Architecture rules live in `.dependency-cruiser.cjs` (single source of truth).
// ESLint enforces only language/style rules and a small set of page-level guards.

const pagesGuard = {
  files: ["src/app/pages/**/*.vue", "src/app/layouts/**/*.vue"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [{ name: "@sinclair/typebox", message: "Forms and schemas belong in modules, not on pages." }],
        patterns: [
          {
            group: ["#src/common/api/sdk", "#src/common/api/sdk-queries", "#src/common/api/sdk/*"],
            message: "Pages do not call the SDK directly. Use module features / queries.",
          },
          {
            group: ["@tanstack/vue-query"],
            importNames: ["useMutation"],
            message: "Mutations belong in module features, not on pages.",
          },
          {
            group: ["#src/modules/*/*/entity/*", "#src/modules/*/*/entity", "#src/modules/*/*/features/*"],
            message: "Import modules only via their public index.ts.",
          },
        ],
      },
    ],
  },
};

export default withNuxt(
  {
    ignores: ["src/common/api/sdk/**", "src/common/api/generated/**"],
  },
  prettier,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "vue/multi-word-component-names": "off",
    },
  },
  pagesGuard,
).override("nuxt/typescript/rules", {
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
  },
});
