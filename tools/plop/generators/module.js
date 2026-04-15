/**
 * Module generator.
 *
 * Creates a new module skeleton: types, domain, queries, index.
 * Features (mutations + UI) are added separately via `pnpm plop feature`.
 *
 * Layout produced:
 *   src/modules/(group)/<name>/
 *   ├── entity/
 *   │   ├── <name>.types.ts
 *   │   ├── <name>.domain.ts
 *   │   ├── <name>.queries.ts
 *   │   └── index.ts
 *   ├── features/                # empty, ready for `pnpm plop feature`
 *   └── index.ts
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templates = join(__dirname, "../templates/module");

export default function moduleGenerator(plop) {
  plop.setGenerator("module", {
    description: "New module (entity skeleton)",
    prompts: [
      {
        type: "input",
        name: "group",
        message: "Domain group (e.g. bookings, marketplace, users):",
        validate: (v) => (v ? true : "Group is required"),
      },
      {
        type: "input",
        name: "name",
        message: "Module name (plural, kebab-case, e.g. bookings, mini-courses):",
        validate: (v) => (v ? true : "Name is required"),
      },
    ],
    actions: () => {
      const base = `src/modules/({{kebabCase group}})/{{kebabCase name}}`;
      return [
        {
          type: "add",
          path: `${base}/entity/{{kebabCase name}}.types.ts`,
          templateFile: join(templates, "entity/types.ts.hbs"),
        },
        {
          type: "add",
          path: `${base}/entity/{{kebabCase name}}.domain.ts`,
          templateFile: join(templates, "entity/domain.ts.hbs"),
        },
        {
          type: "add",
          path: `${base}/entity/{{kebabCase name}}.queries.ts`,
          templateFile: join(templates, "entity/queries.ts.hbs"),
        },
        {
          type: "add",
          path: `${base}/entity/index.ts`,
          templateFile: join(templates, "entity/index.ts.hbs"),
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
