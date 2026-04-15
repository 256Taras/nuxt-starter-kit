/**
 * Util generator.
 * Adds a pure utility function to common/utils/<domain>/.
 *
 * Domains group utilities by concern:
 *   currency/  dates/  errors/  objects/  styles/  (and new ones as needed)
 *
 * Picking the domain up-front prevents common/utils from becoming a dumping ground.
 * If no existing domain fits, pass a new one — the folder will be created.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templates = join(__dirname, "../templates/util");

export default function utilGenerator(plop) {
  plop.setGenerator("util", {
    description: "New util in common/utils/<domain>",
    prompts: [
      {
        type: "input",
        name: "domain",
        message: "Domain folder (e.g. dates, objects, errors, styles, currency):",
        validate: (v) => (v ? true : "Domain is required"),
      },
      {
        type: "input",
        name: "name",
        message: "Util name (kebab-case, e.g. format-phone):",
        validate: (v) => (v ? true : "Name is required"),
      },
    ],
    actions: () => [
      {
        type: "add",
        path: `src/common/utils/{{kebabCase domain}}/{{kebabCase name}}.ts`,
        templateFile: join(templates, "util.ts.hbs"),
      },
    ],
  });
}
