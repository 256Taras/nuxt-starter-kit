/**
 * Plop code generator.
 *
 * Usage:
 *   pnpm plop                       — interactive menu
 *   pnpm plop module                — new module (entity only)
 *   pnpm plop feature               — new feature in existing module
 *   pnpm plop page                  — new page
 *   pnpm plop composable            — new composable in common/composables
 *   pnpm plop util                  — new util in common/utils
 *   pnpm plop component             — new component in common/components
 */

import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatorsPath = join(__dirname, "tools/plop/generators");

export default async function plopConfig(plop) {
  registerHelpers(plop);

  const generatorFiles = readdirSync(generatorsPath).filter((f) => f.endsWith(".js"));
  for (const file of generatorFiles) {
    const mod = await import(join(generatorsPath, file));
    mod.default(plop);
  }
}

function registerHelpers(plop) {
  plop.setHelper("pascalCase", toPascalCase);
  plop.setHelper("camelCase", toCamelCase);
  plop.setHelper("kebabCase", toKebabCase);
  plop.setHelper("upperSnakeCase", (s) => toSnakeCase(s).toUpperCase());
  plop.setHelper("singular", toSingular);
  plop.setHelper("plural", toPlural);
  plop.setHelper("eq", (a, b) => a === b);
  plop.setHelper("upperCase", (s) => String(s).toUpperCase());
}

function toPascalCase(str) {
  return String(str)
    .replaceAll(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function toCamelCase(str) {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function toSnakeCase(str) {
  return String(str)
    .replaceAll(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replaceAll(/[-\s]+/g, "_");
}

function toKebabCase(str) {
  return toSnakeCase(str).replaceAll("_", "-");
}

function toPlural(str) {
  const s = String(str);
  if (s.endsWith("y") && !["ay", "ey", "oy", "uy"].some((e) => s.endsWith(e))) {
    return s.slice(0, -1) + "ies";
  }
  if (s.endsWith("s") || s.endsWith("x") || s.endsWith("ch") || s.endsWith("sh")) {
    return s + "es";
  }
  return s + "s";
}

function toSingular(str) {
  const s = String(str);
  if (s.endsWith("ies")) return s.slice(0, -3) + "y";
  if (s.endsWith("xes") || s.endsWith("ches") || s.endsWith("shes") || s.endsWith("sses")) {
    return s.slice(0, -2);
  }
  if (s.endsWith("s") && !s.endsWith("ss")) return s.slice(0, -1);
  return s;
}
