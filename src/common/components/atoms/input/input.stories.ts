import type { Meta, StoryObj } from "@storybook/vue3";
import { Input } from ".";
import { Label } from "../label";

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "text",
    placeholder: "Enter text...",
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: '<Input v-bind="args" />',
  }),
};

export const WithLabel: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="space-y-2 w-80">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled input" },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: '<Input v-bind="args" />',
  }),
};

export const Password: Story = {
  args: { type: "password", placeholder: "Enter password" },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: '<Input v-bind="args" />',
  }),
};
