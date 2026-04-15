<script setup lang="ts">
import { definePageMeta } from "#imports";
import { UpdateUserForm } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/routing/app-router";
import { useRouteId } from "#src/common/composables/use-route-id";
import { BackLink } from "#src/common/components/molecules/back-link";

definePageMeta({ layout: "default" });

const userId = useRouteId("users-id-edit");
const { routes } = useAppRouter();
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.users.view({ id: userId })">Back to user</BackLink>
    </div>

    <UpdateUserForm :user-id="userId" />
  </div>
</template>
