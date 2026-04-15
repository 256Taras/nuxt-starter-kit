---
name: storybook-patterns
description:
  Storybook conventions — story file structure, component documentation, variant
  showcase.
globs:
  - "src/**/*.stories.ts"
  - ".storybook/**/*"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm:*)
---

# Storybook Patterns

## Story File Structure

```typescript
import type { Meta, StoryObj } from "@storybook/vue3";
import { Button } from ".";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "default" } };
export const Destructive: Story = { args: { variant: "destructive" } };
```

## File Naming

- Same directory as component: `button.stories.ts` next to `button.vue`
- Import the component from its folder `index.ts` (not `./button.vue`)
- Title matches atomic structure: `Atoms/Button`, `Molecules/Card`

## Running

```bash
pnpm storybook          # Dev on port 6006
pnpm build-storybook    # Static build
```

## Anti-patterns

- Stories without argTypes
- Missing autodocs tag
- Importing directly from `./name.vue` instead of the folder's `index.ts`
