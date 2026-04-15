<script setup lang="ts">
import { useForm } from "vee-validate";
import { ref } from "vue";
import { definePageMeta } from "#imports";
import { useAuthenticationStore, ForgotPasswordFormSchema } from "#src/modules/(users)/authentication";
import type { ForgotPasswordFormValues } from "#src/modules/(users)/authentication";
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
const { routes } = useAppRouter();
const submitted = ref(false);
const apiError = ref<string | null>(null);

const { handleSubmit, errors, defineField, meta } = useForm<ForgotPasswordFormValues>({
  validationSchema: toTypeBoxResolver(ForgotPasswordFormSchema),
  initialValues: {
    email: "",
  },
});

const [email, emailAttrs] = defineField("email");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await authStore.forgotPassword(values);
    submitted.value = true;
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Request failed";
  }
});
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Reset password</CardTitle>
      <CardDescription>Enter your email and we'll send reset instructions</CardDescription>
    </CardHeader>

    <div v-if="submitted">
      <CardContent class="text-center space-y-4">
        <p class="text-muted-foreground">If an account with that email exists, we've sent reset instructions.</p>
        <Button
          as-child
          variant="outline"
        >
          <NuxtLink :to="routes.auth.signIn()">Back to sign in</NuxtLink>
        </Button>
      </CardContent>
    </div>

    <form
      v-else
      @submit="onSubmit"
    >
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

        <Button
          type="submit"
          class="w-full"
          :disabled="!meta.valid"
        >
          Send reset link
        </Button>
      </CardContent>

      <CardFooter class="justify-center text-sm text-muted-foreground">
        <NuxtLink
          :to="routes.auth.signIn()"
          class="text-primary hover:underline"
          >Back to sign in</NuxtLink
        >
      </CardFooter>
    </form>
  </Card>
</template>
