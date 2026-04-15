<script setup lang="ts">
import { definePageMeta, useSeoMeta } from "#imports";
import { ResetPasswordForm } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/routing/app-router";
import { useQueryParam } from "#src/common/composables/use-query-param";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#src/common/components/molecules/card";

definePageMeta({ layout: "auth" });
useSeoMeta({ title: "Set new password" });

const { routes } = useAppRouter();
const token = useQueryParam("token");
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Set new password</CardTitle>
      <CardDescription>Enter your new password below</CardDescription>
    </CardHeader>

    <CardContent>
      <ResetPasswordForm :token="token" />
    </CardContent>

    <CardFooter class="justify-center text-sm text-muted-foreground">
      <NuxtLink
        :to="routes.auth.signIn()"
        class="text-primary hover:underline"
        >Back to sign in</NuxtLink
      >
    </CardFooter>
  </Card>
</template>
