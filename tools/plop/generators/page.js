/**
 * Page generator.
 *
 * Creates a new Nuxt page at app/pages/<path>/index.vue with a minimal
 * orchestrator template. Pages must stay thin — no mutations, no predicates,
 * no @sinclair/typebox imports.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templates = join(__dirname, "../templates/page");

export default function pageGenerator(plop) {
  plop.setGenerator("page", {
    description: "New page (orchestrator)",
    prompts: [
      {
        type: "input",
        name: "path",
        message: "Page path (kebab-case, e.g. about, bookings/create, users/[id]):",
        validate: (v) => (v ? true : "Path is required"),
      },
      {
        type: "input",
        name: "title",
        message: "Page title (human-readable, e.g. About, Create booking):",
        validate: (v) => (v ? true : "Title is required"),
      },
      {
        type: "list",
        name: "layout",
        message: "Layout:",
        choices: ["default", "auth"],
        default: "default",
      },
    ],
    actions: () => [
      {
        type: "add",
        path: `src/app/pages/{{path}}/index.vue`,
        templateFile: join(templates, "index.vue.hbs"),
      },
    ],
  });
}
