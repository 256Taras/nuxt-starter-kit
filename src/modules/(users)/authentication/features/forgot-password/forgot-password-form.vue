<script setup lang="ts">
import { useForgotPassword } from "./use-forgot-password";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { useAppRouter } from "#src/common/routing/app-router";

const { routes } = useAppRouter();
const { email, emailAttrs, errors, meta, submitted, onSubmit } = useForgotPassword();
</script>

<template>
  <div
    v-if="submitted"
    role="status"
    aria-live="polite"
    class="text-center space-y-4"
  >
    <p class="text-muted-foreground">If an account with that email exists, we've sent reset instructions.</p>
    <Button
      as-child
      variant="outline"
    >
      <NuxtLink :to="routes.auth.signIn()">Back to sign in</NuxtLink>
    </Button>
  </div>

  <form
    v-else
    @submit="onSubmit"
  >
    <div class="space-y-4">
      <FormField
        id="email"
        v-slot="field"
        label="Email"
        :error="errors.email"
      >
        <Input
          id="email"
          v-model="email"
          v-bind="{ ...emailAttrs, ...field }"
          type="email"
          placeholder="you@example.com"
        />
      </FormField>

      <Button
        type="submit"
        class="w-full"
        :disabled="!meta.valid"
      >
        Send reset link
      </Button>
    </div>
  </form>
</template>
