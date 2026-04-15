<script setup lang="ts">
import { useForm } from "vee-validate";
import { ref } from "vue";
import { definePageMeta } from "#imports";
import { useAuthenticationStore, SignInFormSchema } from "#src/modules/(users)/authentication";
import type { SignInFormValues } from "#src/modules/(users)/authentication";
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

const { handleSubmit, errors, defineField, meta } = useForm<SignInFormValues>({
  validationSchema: toTypeBoxResolver(SignInFormSchema),
  initialValues: {
    email: "",
    password: "",
  },
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await authStore.signIn(values);
    await pushTo.home();
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Sign in failed";
  }
});
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Sign in</CardTitle>
      <CardDescription>Enter your credentials to access your account</CardDescription>
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
            placeholder="Your password"
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
          :disabled="authStore.isSigningIn || !meta.valid"
        >
          {{ authStore.isSigningIn ? "Signing in..." : "Sign in" }}
        </Button>
      </CardContent>

      <CardFooter class="flex-col gap-2 text-sm text-muted-foreground">
        <NuxtLink
          :to="routes.auth.forgotPassword()"
          class="text-primary hover:underline"
        >
          Forgot password?
        </NuxtLink>
        <p>
          Don't have an account?
          <NuxtLink
            :to="routes.auth.signUp()"
            class="text-primary hover:underline"
            >Sign up</NuxtLink
          >
        </p>
      </CardFooter>
    </form>
  </Card>
</template>
