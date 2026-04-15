<script setup lang="ts">
import { useCreateUser } from "./use-create-user";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { useAppRouter } from "#src/common/routing/app-router";

const { routes } = useAppRouter();
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
} = useCreateUser();
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
            placeholder="John"
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
            placeholder="Doe"
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
          placeholder="john@example.com"
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
          placeholder="Min 6 characters"
        />
      </FormField>

      <div class="flex gap-2 pt-2">
        <Button
          type="submit"
          :disabled="isPending || !meta.valid"
        >
          <span v-text="isPending ? 'Creating...' : 'Create user'" />
        </Button>
        <Button
          as-child
          type="button"
          variant="outline"
        >
          <NuxtLink :to="routes.users.list()">Cancel</NuxtLink>
        </Button>
      </div>
    </div>
  </form>
</template>
