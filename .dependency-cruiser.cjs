/**
 * Dependency-cruiser config — enforces the architecture documented in
 * .claude/ARCHITECTURE.md. Runs as a second line of defense next to
 * eslint-plugin-boundaries (editor feedback) — dependency-cruiser gives the
 * authoritative whole-project graph in CI and can render an SVG.
 *
 * Run:
 *   pnpm dep:check        # validate — fails CI on violations
 *   pnpm dep:graph        # render SVG at docs/dependency-graph.svg
 *   pnpm dep:graph:arch   # high-level folder-level graph
 */

/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    // ─────────────────────────────────────────────────────────────────
    // Generic safety nets
    // ─────────────────────────────────────────────────────────────────
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies create fragile code and hide design problems.",
      from: {
        // shadcn-vue primitives have benign circular between <name>.vue and index.ts
        // (index re-exports component default and exposes CVA variants that the component imports back).
        pathNot: "^src/common/components/(atoms|molecules)/",
      },
      to: { circular: true },
    },
    {
      name: "no-deprecated-core",
      severity: "warn",
      comment: "Avoid Node core modules that are deprecated or discouraged.",
      from: {},
      to: {
        dependencyTypes: ["core"],
        path: ["^(v8/tools/codemap)$", "^(v8/tools/consarray)$", "^(v8/tools/csvparser)$"],
      },
    },

    // ─────────────────────────────────────────────────────────────────
    // Generated SDK — never touch directly
    // ─────────────────────────────────────────────────────────────────
    {
      name: "no-deep-sdk-import",
      severity: "error",
      comment:
        "Do not import from sdk/ directly. Use #src/common/api/sdk (functions) or #src/common/api/sdk-queries (TanStack helpers).",
      from: {
        pathNot: ["^src/common/api/(sdk|sdk-queries|sdk-runtime-config|query-client)"],
      },
      to: { path: "^src/common/api/sdk/" },
    },

    // ─────────────────────────────────────────────────────────────────
    // Common layer — cross-cutting; must not touch modules / app / configs bidir
    // ─────────────────────────────────────────────────────────────────
    {
      name: "common-no-import-from-modules",
      severity: "error",
      comment: "common/ is cross-cutting and must not depend on business modules.",
      from: { path: "^src/common/" },
      to: { path: "^src/modules/" },
    },
    {
      name: "common-no-import-from-app",
      severity: "error",
      comment: "common/ must not depend on app-layer (pages/layouts/middleware/plugins).",
      from: { path: "^src/common/" },
      to: { path: "^src/app/" },
    },

    // ─────────────────────────────────────────────────────────────────
    // Modules — no cross-module deep imports, entity/feature layering
    // ─────────────────────────────────────────────────────────────────
    {
      name: "module-no-deep-cross-module-import",
      severity: "error",
      comment: "Modules must be consumed through their public index.ts only.",
      from: {
        path: "^src/modules/\\(([^)]+)\\)/([^/]+)/",
        pathNot: "^src/modules/\\(([^)]+)\\)/([^/]+)/index\\.ts$",
      },
      to: {
        path: "^src/modules/\\(([^)]+)\\)/([^/]+)/(entity|features)",
        pathNot: [
          // allow same-module imports
          "^src/modules/\\($1\\)/$2/(entity|features)",
        ],
      },
    },
    {
      name: "entity-no-import-from-features",
      severity: "error",
      comment: "entity/ is the pure data layer; features/ depends on entity, not the other way around.",
      from: { path: "^src/modules/\\([^)]+\\)/[^/]+/entity/" },
      to: { path: "^src/modules/\\([^)]+\\)/[^/]+/features/" },
    },
    {
      name: "features-no-cross-feature-import",
      severity: "error",
      comment: "Features inside the same module must not import each other directly. Share via entity/.",
      from: {
        path: "^src/modules/\\(([^)]+)\\)/([^/]+)/features/([^/]+)/",
      },
      to: {
        path: "^src/modules/\\($1\\)/$2/features/",
        pathNot: "^src/modules/\\($1\\)/$2/features/$3/",
      },
    },
    {
      name: "module-no-import-from-app",
      severity: "error",
      comment: "Modules must not depend on the app layer (pages/layouts/middleware/plugins).",
      from: { path: "^src/modules/" },
      to: { path: "^src/app/" },
    },

    // ─────────────────────────────────────────────────────────────────
    // Pages — thin orchestrators; no SDK / TypeBox / useMutation / deep module imports
    // ─────────────────────────────────────────────────────────────────
    {
      name: "pages-no-direct-sdk-import",
      severity: "error",
      comment: "Pages consume modules, not SDK. Use module queries/features instead.",
      from: { path: "^src/app/(pages|layouts)/" },
      to: { path: "^src/common/api/(sdk|sdk-queries)" },
    },
    {
      name: "pages-no-typebox",
      severity: "error",
      comment: "Schemas & forms live in modules. Pages only compose UI.",
      from: { path: "^src/app/(pages|layouts)/" },
      to: { path: "^node_modules/@sinclair/typebox/" },
    },
    {
      name: "pages-no-deep-module-import",
      severity: "error",
      comment: "Pages must import modules through their public index.ts.",
      from: { path: "^src/app/" },
      to: { path: "^src/modules/\\([^)]+\\)/[^/]+/(entity|features)" },
    },
  ],

  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: [
        "\\.nuxt",
        "\\.output",
        "\\.storybook",
        "\\.playwright-mcp",
        "node_modules",
        "src/common/api/sdk/",
        "\\.stories\\.ts$",
        "\\.test\\.ts$",
        "\\.spec\\.ts$",
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      mainFields: ["module", "main", "types", "typings"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "^src/(common|modules|app|configs|types)/[^/]+",
        theme: {
          graph: { rankdir: "LR", splines: "ortho", bgcolor: "transparent" },
          modules: [
            { criteria: { source: "^src/common/" }, attributes: { fillcolor: "#d5e8d4" } },
            { criteria: { source: "^src/modules/" }, attributes: { fillcolor: "#dae8fc" } },
            { criteria: { source: "^src/app/" }, attributes: { fillcolor: "#fff2cc" } },
            { criteria: { source: "^src/configs/" }, attributes: { fillcolor: "#f8cecc" } },
          ],
        },
      },
      archi: {
        collapsePattern: "^(src/(common|modules|app|configs|types))/[^/]+",
      },
    },
  },
};
