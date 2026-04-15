<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { definePageMeta } from "#imports";
import { useAuthenticationStore, ChangePasswordFormSchema } from "#src/modules/(users)/authentication";
import type { ChangePasswordFormValues } from "#src/modules/(users)/authentication";
import { toTypeBoxResolver } from "#src/common/validation";
import { useAppRouter } from "#src/common/router/app-router";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { Label } from "#src/common/components/atoms/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";

definePageMeta({ layout: "default" });

const authStore = useAuthenticationStore();
const { pushTo } = useAppRouter();
const apiError = ref<string | null>(null);
const isSubmitting = ref(false);

const { handleSubmit, errors, defineField, meta } = useForm<ChangePasswordFormValues>({
  validationSchema: toTypeBoxResolver(ChangePasswordFormSchema),
  initialValues: { oldPassword: "", newPassword: "" },
});

const [oldPassword, oldPasswordAttrs] = defineField("oldPassword");
const [newPassword, newPasswordAttrs] = defineField("newPassword");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  isSubmitting.value = true;
  try {
    await authStore.changePassword(values);
    await pushTo.profile();
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Failed to change password";
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="max-w-lg mx-auto">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Change password</CardTitle>
        <CardDescription>Enter your current password and choose a new one</CardDescription>
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
            <Label for="oldPassword">Current password</Label>
            <Input
              id="oldPassword"
              v-model="oldPassword"
              v-bind="oldPasswordAttrs"
              type="password"
              placeholder="Your current password"
            />
            <p
              v-if="errors.oldPassword"
              class="text-sm text-destructive"
            >
              {{ errors.oldPassword }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="newPassword">New password</Label>
            <Input
              id="newPassword"
              v-model="newPassword"
              v-bind="newPasswordAttrs"
              type="password"
              placeholder="Min 6 characters, letters + numbers"
            />
            <p
              v-if="errors.newPassword"
              class="text-sm text-destructive"
            >
              {{ errors.newPassword }}
            </p>
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="isSubmitting || !meta.valid"
          >
            {{ isSubmitting ? "Changing..." : "Change password" }}
          </Button>
        </CardContent>
      </form>
    </Card>
  </div>
</template>
