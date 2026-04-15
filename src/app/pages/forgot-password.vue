<script setup lang="ts">
import { definePageMeta, useSeoMeta } from "#imports";
import { ForgotPasswordForm } from "#src/modules/(users)/authentication";
import { useAppRouter } from "#src/common/routing/app-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#src/common/components/molecules/card";

definePageMeta({ layout: "auth" });
useSeoMeta({ title: "Reset password" });

const { routes } = useAppRouter();
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Reset password</CardTitle>
      <CardDescription>Enter your email and we'll send reset instructions</CardDescription>
    </CardHeader>

    <CardContent>
      <ForgotPasswordForm />
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
