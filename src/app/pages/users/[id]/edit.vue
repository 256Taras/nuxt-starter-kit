<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useForm } from "vee-validate";
import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { definePageMeta, useRoute } from "#imports";
import { toast } from "vue3-toastify";
import { useUserDetailQuery, useUpdateUserMutation } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/router/app-router";
import { toTypeBoxResolver, RequiredStringSchema } from "#src/common/validation";
import { Button } from "#src/common/components/atoms/button";
import { Input } from "#src/common/components/atoms/input";
import { Label } from "#src/common/components/atoms/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";
import { ArrowLeft } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const EditUserSchema = Type.Object({
  firstName: RequiredStringSchema(2),
  lastName: RequiredStringSchema(2),
});

type EditUserValues = Static<typeof EditUserSchema>;

const route = useRoute();
const userId = computed(() => route.params.id as string);
const { routes, pushTo } = useAppRouter();

const { data: user, isLoading, isError, error } = useUserDetailQuery(userId);
const updateMutation = useUpdateUserMutation();
const apiError = ref<string | null>(null);

const { handleSubmit, errors, defineField, meta, setValues } = useForm<EditUserValues>({
  validationSchema: toTypeBoxResolver(EditUserSchema),
  initialValues: { firstName: "", lastName: "" },
});

const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");

watch(
  user,
  (u) => {
    if (u) {
      setValues({ firstName: u.firstName, lastName: u.lastName });
    }
  },
  { immediate: true },
);

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await updateMutation.mutateAsync({ id: userId.value, body: values });
    toast.success("User updated");
    await pushTo.users.view({ id: userId.value });
  } catch (err: unknown) {
    apiError.value = err instanceof Error ? err.message : "Failed to update user";
  }
});
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink
        :to="routes.users.view({ id: userId })"
        class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft :size="16" />
        Back to user
      </NuxtLink>
    </div>

    <div
      v-if="isLoading"
      class="text-muted-foreground"
      aria-live="polite"
    >
      Loading user...
    </div>
    <div
      v-else-if="isError"
      class="text-destructive"
      role="alert"
    >
      {{ error?.message ?? "Failed to load user" }}
    </div>

    <Card
      v-else-if="user"
      class="max-w-lg"
    >
      <CardHeader>
        <CardTitle class="text-2xl">Edit user</CardTitle>
        <CardDescription>Update {{ user.email }}</CardDescription>
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
            <Label>Email</Label>
            <p class="text-sm text-muted-foreground">{{ user.email }}</p>
          </div>

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

          <div class="flex gap-2 pt-2">
            <Button
              type="submit"
              :disabled="updateMutation.isPending.value || !meta.valid"
            >
              {{ updateMutation.isPending.value ? "Saving..." : "Save changes" }}
            </Button>
            <NuxtLink :to="routes.users.view({ id: userId })">
              <Button
                type="button"
                variant="outline"
                >Cancel</Button
              >
            </NuxtLink>
          </div>
        </CardContent>
      </form>
    </Card>
  </div>
</template>
