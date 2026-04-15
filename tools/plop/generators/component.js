/**
 * Component generator.
 * Adds a component to common/components/atoms/ or molecules/.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templates = join(__dirname, "../templates/component");

export default function componentGenerator(plop) {
  plop.setGenerator("component", {
    description: "New component in common/components",
    prompts: [
      {
        type: "list",
        name: "kind",
        message: "Kind:",
        choices: ["atoms", "molecules"],
        default: "molecules",
      },
      {
        type: "input",
        name: "name",
        message: "Component name (kebab-case, e.g. info-card):",
        validate: (v) => (v ? true : "Name is required"),
      },
    ],
    actions: () => [
      {
        type: "add",
        path: `src/common/components/{{kind}}/{{kebabCase name}}/{{kebabCase name}}.vue`,
        templateFile: join(templates, "component.vue.hbs"),
      },
      {
        type: "add",
        path: `src/common/components/{{kind}}/{{kebabCase name}}/index.ts`,
        templateFile: join(templates, "index.ts.hbs"),
      },
    ],
  });
}
