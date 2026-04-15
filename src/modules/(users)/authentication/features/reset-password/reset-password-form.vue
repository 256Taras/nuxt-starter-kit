<script setup lang="ts">
import { useResetPassword } from "./use-reset-password";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";

const props = defineProps<{
  token: string;
}>();

const { password, passwordAttrs, errors, meta, onSubmit } = useResetPassword(() => props.token);
</script>

<template>
  <form @submit="onSubmit">
    <div class="space-y-4">
      <div
        v-if="!token"
        role="alert"
        class="bg-destructive/10 text-destructive p-3 rounded-lg text-sm"
      >
        Invalid or missing reset token. Please request a new reset link.
      </div>

      <FormField
        id="password"
        v-slot="field"
        label="New password"
        :error="errors.password"
      >
        <Input
          id="password"
          v-model="password"
          v-bind="{ ...passwordAttrs, ...field }"
          type="password"
          placeholder="Min 6 chars, letters + numbers"
        />
      </FormField>

      <Button
        type="submit"
        class="w-full"
        :disabled="!meta.valid || !token"
      >
        Reset password
      </Button>
    </div>
  </form>
</template>
