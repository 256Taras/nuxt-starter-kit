# Scripts

All scripts run via `pnpm <name>`.

## Development

| Script             | What it does                          |
| ------------------ | ------------------------------------- |
| `pnpm dev`         | Start Nuxt dev server with HMR        |
| `pnpm build`       | Production build                      |
| `pnpm preview`     | Preview the production build locally  |
| `pnpm generate`    | Static site generation (Nuxt)         |
| `pnpm postinstall` | Auto-run by pnpm; runs `nuxt prepare` |

## Quality

| Script               | What it does                                                          |
| -------------------- | --------------------------------------------------------------------- |
| `pnpm lint`          | Run ESLint on the repo                                                |
| `pnpm lint:fix`      | Run ESLint with autofix                                               |
| `pnpm prettier:fix`  | Format all files with Prettier                                        |
| `pnpm check:types`   | Run `vue-tsc --noEmit` for a full type check                          |
| `npx nuxi typecheck` | Stricter typecheck than `check:types` (includes template expressions) |
| `pnpm precommit`     | Run lint-staged (invoked by Husky on commit)                          |

## SDK

| Script         | What it does                                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm gen:sdk` | Regenerate `src/common/api/sdk/` from the backend OpenAPI spec. Backend must run at the URL configured in `openapi-ts.config.ts`. Commit the result. |

## Storybook

| Script                 | What it does                            |
| ---------------------- | --------------------------------------- |
| `pnpm storybook`       | Start Storybook dev server on port 6006 |
| `pnpm build-storybook` | Build Storybook static site             |

## Plop — code generators

`pnpm plop` scaffolds new code following project conventions. Templates live in
`tools/plop/templates/`. Generators in `tools/plop/generators/`.

| Script                               | What it does                                  |
| ------------------------------------ | --------------------------------------------- |
| `pnpm plop`                          | Interactive menu — pick a generator           |
| `pnpm plop <name>`                   | Run a generator interactively                 |
| `pnpm plop <name> <arg1> <arg2> ...` | Bypass mode — pass answers as positional args |

### Generators

#### `pnpm plop module`

Creates a new module skeleton with entity sub-layer.

Prompts:

1. **group** — domain group name (e.g. `bookings`, `marketplace`, `users`)
2. **name** — module name, plural, kebab-case (e.g. `bookings`, `mini-courses`)

Output:

```text
src/modules/(<group>)/<name>/
├── entity/
│   ├── <singular>.types.ts      # SDK type aliases + as-const enums
│   ├── <singular>.domain.ts     # predicates, formatters, status maps
│   ├── <singular>.queries.ts    # shared queries + query keys
│   └── index.ts                 # entity public API
└── index.ts                     # module public API
```

All files contain commented-out template code you uncomment and fill in.

Bypass: `pnpm plop module <group> <name>`

#### `pnpm plop feature`

Creates a new feature (user action) inside an existing module.

Prompts:

1. **group** — domain group the module belongs to
2. **module** — module name (plural, kebab-case)
3. **action** — verb (kebab-case: `cancel`, `archive`, `publish`)
4. **entity** — singular entity name (kebab-case: `booking`)

Output:

```text
src/modules/(<group>)/<module>/features/<action>-<entity>/
├── <action>-<entity>.mutation.ts     # useXxxMutation wrapping SDK
├── use-<action>-<entity>.ts          # hook: runWithToast + state
├── <action>-<entity>-button.vue      # UI tied to feature + visibility predicate
└── index.ts                          # feature public API
```

Bypass: `pnpm plop feature <group> <module> <action> <entity>`

Example: `pnpm plop feature bookings bookings cancel booking`

#### `pnpm plop page`

Creates a new Nuxt page.

Prompts:

1. **path** — route path (kebab-case, e.g. `about`, `bookings/create`,
   `users/[id]`)
2. **title** — page title (human-readable)
3. **layout** — `default` or `auth`

Output:

```text
src/app/pages/<path>/index.vue
```

The template renders a `<PageHeader>` and a `TODO` comment reminding you to
compose features from modules. Pages must stay thin — no mutations, no
predicates, no `@sinclair/typebox` imports.

Bypass: `pnpm plop page <path> <title> <layout>`

#### `pnpm plop composable`

Creates a generic composable in `common/composables/`.

Prompts:

1. **name** — composable name without the `use-` prefix (kebab-case, e.g.
   `focus-trap`)

Output:

```text
src/common/composables/use-<name>.ts
```

Bypass: `pnpm plop composable <name>`

#### `pnpm plop util`

Creates a pure utility function in `common/utils/`.

Prompts:

1. **name** — util name (kebab-case, e.g. `format-phone`)

Output:

```text
src/common/utils/<name>.ts
```

Bypass: `pnpm plop util <name>`

#### `pnpm plop component`

Creates a reusable UI component in `common/components/`.

Prompts:

1. **kind** — `atoms` or `molecules`
2. **name** — component name (kebab-case, e.g. `info-card`)

Output:

```text
src/common/components/<kind>/<name>/
├── <name>.vue
└── index.ts
```

Bypass: `pnpm plop component <kind> <name>`

### Adding a new generator

1. Create `tools/plop/generators/<name>.js` exporting a default function that
   calls `plop.setGenerator(...)`.
2. Put templates in `tools/plop/templates/<name>/` as `.hbs` files.
3. Use Handlebars helpers from `plopfile.js`: `pascalCase`, `camelCase`,
   `kebabCase`, `upperSnakeCase`, `singular`, `plural`.
4. **Escape Vue template interpolation:** do not write `{{ expr }}` inside
   `.hbs` files — Handlebars will consume it. Use `v-text="expr"` or a
   `computed()` bound via `v-text` instead.
