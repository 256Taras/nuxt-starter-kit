/**
 * Composable generator.
 * Adds a generic composable to common/composables/.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templates = join(__dirname, "../templates/composable");

export default function composableGenerator(plop) {
  plop.setGenerator("composable", {
    description: "New composable in common/composables",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Composable name (without 'use-' prefix, kebab-case, e.g. focus-trap):",
        validate: (v) => (v ? true : "Name is required"),
      },
    ],
    actions: () => [
      {
        type: "add",
        path: `src/common/composables/use-{{kebabCase name}}.ts`,
        templateFile: join(templates, "use-composable.ts.hbs"),
      },
    ],
  });
}
