<script setup lang="ts">
import { useForm } from "vee-validate";
import { ref, computed } from "vue";
import { definePageMeta, useRoute } from "#imports";
import { useAuthenticationStore } from "#src/modules/(users)/authentication";
import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { PasswordSchema, toTypeBoxResolver } from "#src/common/validation";
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

const route = useRoute();
const authStore = useAuthenticationStore();
const { routes, pushTo } = useAppRouter();
const apiError = ref<string | null>(null);

const token = computed(() => (route.query.token as string) ?? "");

const ResetPasswordFormSchema = Type.Object({ password: PasswordSchema });
type FormValues = Static<typeof ResetPasswordFormSchema>;

const { handleSubmit, errors, defineField, meta } = useForm<FormValues>({
  validationSchema: toTypeBoxResolver(ResetPasswordFormSchema),
  initialValues: {
    password: "",
  },
});

const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await authStore.resetPassword({ ...values, token: token.value });
    await pushTo.auth.signIn();
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Reset failed";
  }
});
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Set new password</CardTitle>
      <CardDescription>Enter your new password below</CardDescription>
    </CardHeader>

    <form @submit="onSubmit">
      <CardContent class="space-y-4">
        <div
          v-if="!token"
          role="alert"
          class="bg-destructive/10 text-destructive p-3 rounded-lg text-sm"
        >
          Invalid or missing reset token. Please request a new reset link.
        </div>

        <div
          v-if="apiError"
          role="alert"
          class="bg-destructive/10 text-destructive p-3 rounded-lg text-sm"
        >
          {{ apiError }}
        </div>

        <div class="space-y-2">
          <Label for="password">New password</Label>
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
          :disabled="!meta.valid || !token"
        >
          Reset password
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
