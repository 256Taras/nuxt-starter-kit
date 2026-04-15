<script setup lang="ts">
import { useChangePassword } from "./use-change-password";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";

const { oldPassword, oldPasswordAttrs, newPassword, newPasswordAttrs, errors, meta, isPending, onSubmit } =
  useChangePassword();
</script>

<template>
  <form @submit="onSubmit">
    <div class="space-y-4">
      <FormField
        id="oldPassword"
        v-slot="field"
        label="Current password"
        :error="errors.oldPassword"
      >
        <Input
          id="oldPassword"
          v-model="oldPassword"
          v-bind="{ ...oldPasswordAttrs, ...field }"
          type="password"
          placeholder="Your current password"
        />
      </FormField>

      <FormField
        id="newPassword"
        v-slot="field"
        label="New password"
        :error="errors.newPassword"
      >
        <Input
          id="newPassword"
          v-model="newPassword"
          v-bind="{ ...newPasswordAttrs, ...field }"
          type="password"
          placeholder="Min 6 characters, letters + numbers"
        />
      </FormField>

      <Button
        type="submit"
        class="w-full"
        :disabled="isPending || !meta.valid"
      >
        <span v-text="isPending ? 'Changing...' : 'Change password'" />
      </Button>
    </div>
  </form>
</template>
