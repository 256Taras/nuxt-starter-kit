<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { definePageMeta } from "#imports";
import { toast } from "vue3-toastify";
import { useCreateUserMutation } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/router/app-router";
import { toTypeBoxResolver, EmailSchema, PasswordSchema, RequiredStringSchema } from "#src/common/validation";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { Label } from "#src/common/components/atoms/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { ArrowLeft } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const CreateUserSchema = Type.Object({
  email: EmailSchema,
  firstName: RequiredStringSchema(2),
  lastName: RequiredStringSchema(2),
  password: PasswordSchema,
});

type CreateUserValues = Static<typeof CreateUserSchema>;

const { routes, pushTo } = useAppRouter();
const createMutation = useCreateUserMutation();
const apiError = ref<string | null>(null);

const { handleSubmit, errors, defineField, meta } = useForm<CreateUserValues>({
  validationSchema: toTypeBoxResolver(CreateUserSchema),
  initialValues: { email: "", firstName: "", lastName: "", password: "" },
});

const [email, emailAttrs] = defineField("email");
const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await createMutation.mutateAsync(values);
    toast.success("User created");
    await pushTo.users.list();
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Failed to create user";
  }
});
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink
        :to="routes.users.list()"
        class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft :size="16" />
        Back to users
      </NuxtLink>
    </div>

    <Card class="max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Create user</CardTitle>
        <CardDescription>Add a new user to the system</CardDescription>
      </CardHeader>

      <form @submit="onSubmit">
        <CardContent class="space-y-4">
          <div
            v-if="apiError"
            role="alert"
            class="bg-destructive/10 text-destructive p-3 rounded-lg text-sm"
          >
            {{ apiError }}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First name</Label>
              <Input
                id="firstName"
                v-model="firstName"
                v-bind="firstNameAttrs"
                placeholder="John"
              />
              <p
                v-if="errors.firstName"
                class="text-sm text-destructive"
              >
                {{ errors.firstName }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last name</Label>
              <Input
                id="lastName"
                v-model="lastName"
                v-bind="lastNameAttrs"
                placeholder="Doe"
              />
              <p
                v-if="errors.lastName"
                class="text-sm text-destructive"
              >
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              placeholder="john@example.com"
            />
            <p
              v-if="errors.email"
              class="text-sm text-destructive"
            >
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              placeholder="Min 6 characters"
            />
            <p
              v-if="errors.password"
              class="text-sm text-destructive"
            >
              {{ errors.password }}
            </p>
          </div>

          <div class="flex gap-2 pt-2">
            <Button
              type="submit"
              :disabled="createMutation.isPending.value || !meta.valid"
            >
              {{ createMutation.isPending.value ? "Creating..." : "Create user" }}
            </Button>
            <NuxtLink :to="routes.users.list()">
              <Button
                type="button"
                variant="outline"
                >Cancel</Button
              >
            </NuxtLink>
          </div>
        </CardContent>
      </form>
    </Card>
  </div>
</template>
