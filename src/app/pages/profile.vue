<script setup lang="ts">
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { definePageMeta } from "#imports";
import { toast } from "vue3-toastify";
import { useProfileQuery, useUpdateUserMutation, useProfilesStore } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/router/app-router";
import { toTypeBoxResolver, RequiredStringSchema } from "#src/common/validation";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { Label } from "#src/common/components/atoms/label";
import { Lock } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const EditProfileSchema = Type.Object({
  firstName: RequiredStringSchema(2),
  lastName: RequiredStringSchema(2),
});

type EditProfileValues = Static<typeof EditProfileSchema>;

const { data: profile, isLoading, isError, error } = useProfileQuery();
const { getRoleLabel } = useProfilesStore();
const { routes } = useAppRouter();
const updateMutation = useUpdateUserMutation();
const isEditing = ref(false);
const apiError = ref<string | null>(null);

const { handleSubmit, errors, defineField, meta, setValues } = useForm<EditProfileValues>({
  validationSchema: toTypeBoxResolver(EditProfileSchema),
  initialValues: { firstName: "", lastName: "" },
});

const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");

watch(
  profile,
  (p) => {
    if (p) {
      setValues({ firstName: p.firstName, lastName: p.lastName });
    }
  },
  { immediate: true },
);

function startEditing() {
  isEditing.value = true;
  if (profile.value) {
    setValues({ firstName: profile.value.firstName, lastName: profile.value.lastName });
  }
}

const onSubmit = handleSubmit(async (values) => {
  if (!profile.value) return;
  apiError.value = null;
  try {
    await updateMutation.mutateAsync({ id: profile.value.id, body: values });
    toast.success("Profile updated");
    isEditing.value = false;
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Failed to update profile";
  }
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-foreground">My Profile</h1>
      <div class="flex gap-2">
        <Button
          v-if="!isEditing && profile"
          variant="outline"
          @click="startEditing"
        >
          Edit profile
        </Button>
        <NuxtLink :to="routes.changePassword()">
          <Button variant="outline">
            <Lock
              :size="16"
              class="mr-2"
            />
            Change password
          </Button>
        </NuxtLink>
      </div>
    </div>

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
      {{ error?.message ?? "Failed to load profile" }}
    </div>

    <!-- Edit mode -->
    <form
      v-else-if="profile && isEditing"
      class="rounded-lg border bg-card p-6 shadow-sm max-w-lg"
      @submit="onSubmit"
    >
      <div
        v-if="apiError"
        role="alert"
        class="bg-destructive/10 text-destructive p-3 rounded-lg text-sm mb-4"
      >
        {{ apiError }}
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="firstName">First name</Label>
            <Input
              id="firstName"
              v-model="firstName"
              v-bind="firstNameAttrs"
            />
            <p
              v-if="errors.firstName"
              class="text-sm text-destructive"
            >
              {{ errors.firstName }}
            </p>
          </div>
          <div class="space-y-2">
            <Label for="lastName">Last name</Label>
            <Input
              id="lastName"
              v-model="lastName"
              v-bind="lastNameAttrs"
            />
            <p
              v-if="errors.lastName"
              class="text-sm text-destructive"
            >
              {{ errors.lastName }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Email</Label>
          <p class="text-sm text-muted-foreground">{{ profile.email }}</p>
        </div>

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
        <div>
          <span class="text-sm text-muted-foreground">First name</span>
          <p class="font-medium text-card-foreground">{{ profile.firstName }}</p>
        </div>
        <div>
          <span class="text-sm text-muted-foreground">Last name</span>
          <p class="font-medium text-card-foreground">{{ profile.lastName }}</p>
        </div>
        <div>
          <span class="text-sm text-muted-foreground">Email</span>
          <p class="font-medium text-card-foreground">{{ profile.email }}</p>
        </div>
        <div>
          <span class="text-sm text-muted-foreground">Role</span>
          <p class="font-medium text-card-foreground">{{ getRoleLabel(profile.role) }}</p>
        </div>
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
