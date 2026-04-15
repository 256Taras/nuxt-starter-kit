<script setup lang="ts">
import { useSignUp } from "./use-sign-up";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";

const {
  email,
  emailAttrs,
  firstName,
  firstNameAttrs,
  lastName,
  lastNameAttrs,
  password,
  passwordAttrs,
  errors,
  meta,
  isPending,
  onSubmit,
} = useSignUp();
</script>

<template>
  <form @submit="onSubmit">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <FormField
          id="firstName"
          v-slot="field"
          label="First name"
          :error="errors.firstName"
        >
          <Input
            id="firstName"
            v-model="firstName"
            v-bind="{ ...firstNameAttrs, ...field }"
            type="text"
          />
        </FormField>

        <FormField
          id="lastName"
          v-slot="field"
          label="Last name"
          :error="errors.lastName"
        >
          <Input
            id="lastName"
            v-model="lastName"
            v-bind="{ ...lastNameAttrs, ...field }"
            type="text"
          />
        </FormField>
      </div>

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
          placeholder="Min 6 chars, letters + numbers"
        />
      </FormField>

      <Button
        type="submit"
        class="w-full"
        :disabled="isPending || !meta.valid"
      >
        <span v-text="isPending ? 'Creating account...' : 'Create account'" />
      </Button>
    </div>
  </form>
</template>
