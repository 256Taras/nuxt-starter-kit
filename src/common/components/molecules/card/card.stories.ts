import type { Meta, StoryObj } from "@storybook/vue3";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from ".";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { Label } from "../../atoms/label";

const meta = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Card, CardContent, CardDescription, CardHeader, CardTitle },
    template: `
      <Card class="w-96">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content body text.</p>
        </CardContent>
      </Card>
    `,
  }),
};

export const WithFooter: Story = {
  render: () => ({
    components: { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button },
    template: `
      <Card class="w-96">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Fill in the form to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Form fields go here...</p>
        </CardContent>
        <CardFooter class="justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

export const LoginForm: Story = {
  render: () => ({
    components: { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Input, Label },
    template: `
      <Card class="w-96">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Sign in</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="Your password" />
          </div>
          <Button class="w-full">Sign in</Button>
        </CardContent>
        <CardFooter class="justify-center text-sm text-muted-foreground">
          Don't have an account? Sign up
        </CardFooter>
      </Card>
    `,
  }),
};
