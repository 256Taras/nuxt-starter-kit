/**
 * Feature generator.
 *
 * Adds a feature folder inside an existing module with:
 *   - mutation.ts         (useXxxMutation wrapping SDK + cache invalidation)
 *   - use-xxx.ts          (hook: runWithToast + state + orchestration)
 *   - xxx-button.vue      (self-contained UI with visibility check)
 *   - index.ts            (public API)
 *
 * Layout:
 *   src/modules/(group)/<module>/features/<action>-<entity>/
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templates = join(__dirname, "../templates/feature");

export default function featureGenerator(plop) {
  plop.setGenerator("feature", {
    description: "New feature in existing module (mutation + button + hook)",
    prompts: [
      {
        type: "input",
        name: "group",
        message: "Domain group (e.g. bookings, marketplace, users):",
        validate: (v) => (v ? true : "Group is required"),
      },
      {
        type: "input",
        name: "module",
        message: "Module name (plural, kebab-case, e.g. bookings):",
        validate: (v) => (v ? true : "Module is required"),
      },
      {
        type: "input",
        name: "action",
        message: "Action verb (kebab-case, e.g. cancel, archive, publish):",
        validate: (v) => (v ? true : "Action is required"),
      },
      {
        type: "input",
        name: "entity",
        message: "Entity name (singular, kebab-case, e.g. booking):",
        validate: (v) => (v ? true : "Entity is required"),
      },
    ],
    actions: () => {
      const base = `src/modules/({{kebabCase group}})/{{kebabCase module}}/features/{{kebabCase action}}-{{kebabCase entity}}`;
      return [
        {
          type: "add",
          path: `${base}/{{kebabCase action}}-{{kebabCase entity}}.mutation.ts`,
          templateFile: join(templates, "mutation.ts.hbs"),
        },
        {
          type: "add",
          path: `${base}/use-{{kebabCase action}}-{{kebabCase entity}}.ts`,
          templateFile: join(templates, "use-feature.ts.hbs"),
        },
        {
          type: "add",
          path: `${base}/{{kebabCase action}}-{{kebabCase entity}}-button.vue`,
          templateFile: join(templates, "button.vue.hbs"),
        },
        {
          type: "add",
          path: `${base}/index.ts`,
          templateFile: join(templates, "index.ts.hbs"),
        },
      ];
    },
  });
}
