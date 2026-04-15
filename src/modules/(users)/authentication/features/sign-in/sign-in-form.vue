<script setup lang="ts">
import { useSignIn } from "./use-sign-in";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";

const { email, emailAttrs, password, passwordAttrs, errors, meta, isPending, onSubmit } = useSignIn();
</script>

<template>
  <form @submit="onSubmit">
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

      <FormField
        id="password"
        v-slot="field"
        label="Password"
        :error="errors.password"
      >
        <Input
          id="password"
          v-model="password"
          v-bind="{ ...passwordAttrs, ...field }"
          type="password"
          placeholder="Your password"
        />
      </FormField>

      <Button
        type="submit"
        class="w-full"
        :disabled="isPending || !meta.valid"
      >
        <span v-text="isPending ? 'Signing in...' : 'Sign in'" />
      </Button>
    </div>
  </form>
</template>
