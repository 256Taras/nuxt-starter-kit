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
import Button from "./button.vue";

const meta: Meta<typeof Button> = {
  title: "atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline"],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "default" } };
export const Destructive: Story = { args: { variant: "destructive" } };
```

## File Naming

- Same directory as component: button.stories.ts
- Title matches: atoms/Button, molecules/Card

## Running

```bash
pnpm storybook          # Dev on port 6006
pnpm build-storybook    # Static build
```

## Anti-patterns

- Stories without argTypes
- Missing autodocs tag
- Importing from index.ts instead of .vue file
