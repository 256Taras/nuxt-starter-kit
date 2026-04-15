<script setup lang="ts">
import { definePageMeta } from "#imports";
import { CreateUserForm } from "#src/modules/(users)/profiles";
import { useAppRouter } from "#src/common/routing/app-router";
import { BackLink } from "#src/common/components/molecules/back-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";

definePageMeta({ layout: "default" });

const { routes } = useAppRouter();
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.users.list()">Back to users</BackLink>
    </div>

    <Card class="max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Create user</CardTitle>
        <CardDescription>Add a new user to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateUserForm />
      </CardContent>
    </Card>
  </div>
</template>
