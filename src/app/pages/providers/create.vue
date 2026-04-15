<script setup lang="ts">
import { definePageMeta } from "#imports";
import { CreateProviderForm } from "#src/modules/(marketplace)/providers";
import { useAppRouter } from "#src/common/routing/app-router";
import { BackLink } from "#src/common/components/molecules/back-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";

definePageMeta({ layout: "default" });

const { routes } = useAppRouter();
</script>

<template>
  <div>
    <div class="mb-6">
      <BackLink :to="routes.providers.list()">Back to providers</BackLink>
    </div>

    <Card class="max-w-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Create provider</CardTitle>
        <CardDescription>Register a new service provider</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProviderForm />
      </CardContent>
    </Card>
  </div>
</template>
