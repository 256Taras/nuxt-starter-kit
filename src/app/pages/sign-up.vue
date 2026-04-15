<script setup lang="ts">
import { useForm } from "vee-validate";
import { ref } from "vue";
import { definePageMeta } from "#imports";
import { useAuthenticationStore, SignUpFormSchema } from "#src/modules/(users)/authentication";
import type { SignUpFormValues } from "#src/modules/(users)/authentication";
import { toTypeBoxResolver } from "#src/common/validation";
import { useAppRouter } from "#src/common/router/app-router";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { Label } from "#src/common/components/atoms/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#src/common/components/molecules/card";

definePageMeta({ layout: "auth" });

const authStore = useAuthenticationStore();
const { routes, pushTo } = useAppRouter();
const apiError = ref<string | null>(null);

const { handleSubmit, errors, defineField, meta } = useForm<SignUpFormValues>({
  validationSchema: toTypeBoxResolver(SignUpFormSchema),
  initialValues: {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  },
});

const [email, emailAttrs] = defineField("email");
const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await authStore.signUp(values);
    await pushTo.home();
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Sign up failed";
  }
});
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Create account</CardTitle>
      <CardDescription>Fill in your details to get started</CardDescription>
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
              type="text"
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
              type="text"
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
            placeholder="you@example.com"
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
            placeholder="Min 6 chars, letters + numbers"
          />
          <p
            v-if="errors.password"
            class="text-sm text-destructive"
          >
            {{ errors.password }}
          </p>
        </div>

        <Button
          type="submit"
          class="w-full"
          :disabled="authStore.isSigningUp || !meta.valid"
        >
          {{ authStore.isSigningUp ? "Creating account..." : "Create account" }}
        </Button>
      </CardContent>

      <CardFooter class="justify-center text-sm text-muted-foreground">
        <p>
          Already have an account?
          <NuxtLink
            :to="routes.auth.signIn()"
            class="text-primary hover:underline"
            >Sign in</NuxtLink
          >
        </p>
      </CardFooter>
    </form>
  </Card>
</template>
