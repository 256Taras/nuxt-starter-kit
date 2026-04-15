<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { definePageMeta, useSeoMeta } from "#imports";
import {
  useProfileQuery,
  useUpdateUserMutation,
  getRoleLabel,
  EditUserFormSchema,
} from "#src/modules/(users)/profiles";
import type { EditUserFormValues } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/routing/app-router";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { FormField } from "#src/common/components/molecules/form-field";
import { DataField } from "#src/common/components/molecules/data-field";
import { PageHeader } from "#src/common/components/molecules/page-header";
import { Lock } from "lucide-vue-next";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "My profile" });

const { data: profile, isLoading, isError, error } = useProfileQuery();
const { routes } = useAppRouter();
const updateMutation = useUpdateUserMutation();
const isEditing = ref(false);

const { handleSubmit, errors, defineField, meta, setValues } = useForm<EditUserFormValues>({
  validationSchema: toTypeBoxResolver(EditUserFormSchema),
  initialValues: { firstName: "", lastName: "" },
});

const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");

function startEditing() {
  if (!profile.value) return;
  setValues({ firstName: profile.value.firstName, lastName: profile.value.lastName });
  isEditing.value = true;
}

const onSubmit = handleSubmit(async (values) => {
  if (!profile.value) return;
  const ok = await runWithToast(
    updateMutation.mutateAsync,
    { path: { id: profile.value.id }, body: values },
    { success: "Profile updated", error: "Failed to update profile" },
  );
  if (ok) isEditing.value = false;
});
</script>

<template>
  <div>
    <PageHeader title="My Profile">
      <template #actions>
        <Button
          v-if="!isEditing && profile"
          variant="outline"
          @click="startEditing"
        >
          Edit profile
        </Button>
        <Button
          as-child
          variant="outline"
        >
          <NuxtLink :to="routes.changePassword()">
            <Lock
              :size="16"
              class="mr-2"
            />
            Change password
          </NuxtLink>
        </Button>
      </template>
    </PageHeader>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading profile...
    </div>

    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.userMessage ?? "Failed to load profile" }}
    </div>

    <!-- Edit mode -->
    <form
      v-else-if="profile && isEditing"
      class="rounded-lg border bg-card p-6 shadow-sm max-w-lg"
      @submit="onSubmit"
    >
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
            />
          </FormField>
        </div>

        <DataField label="Email">{{ profile.email }}</DataField>

        <div class="flex gap-2 pt-2">
          <Button
            type="submit"
            :disabled="updateMutation.isPending.value || !meta.valid"
          >
            {{ updateMutation.isPending.value ? "Saving..." : "Save" }}
          </Button>
          <Button
            type="button"
            variant="outline"
            @click="isEditing = false"
            >Cancel</Button
          >
        </div>
      </div>
    </form>

    <!-- View mode -->
    <div
      v-else-if="profile"
      class="rounded-lg border bg-card p-6 shadow-sm space-y-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <DataField label="First name">{{ profile.firstName }}</DataField>
        <DataField label="Last name">{{ profile.lastName }}</DataField>
        <DataField label="Email">{{ profile.email }}</DataField>
        <DataField label="Role">{{ getRoleLabel(profile.role) }}</DataField>
      </div>
    </div>

    <div
      v-else
      class="text-muted-foreground"
    >
      Profile not found.
    </div>
  </div>
</template>
