<script setup lang="ts">
import { definePageMeta, useSeoMeta } from "#imports";
import { SignInForm } from "#src/modules/(users)/authentication";
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
useSeoMeta({ title: "Sign in" });

const { routes } = useAppRouter();
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Sign in</CardTitle>
      <CardDescription>Enter your credentials to access your account</CardDescription>
    </CardHeader>

    <CardContent>
      <SignInForm />
    </CardContent>

    <CardFooter class="flex-col gap-2 text-sm text-muted-foreground">
      <NuxtLink
        :to="routes.auth.forgotPassword()"
        class="text-primary hover:underline"
      >
        Forgot password?
      </NuxtLink>
      <p>
        Don't have an account?
        <NuxtLink
          :to="routes.auth.signUp()"
          class="text-primary hover:underline"
          >Sign up</NuxtLink
        >
      </p>
    </CardFooter>
  </Card>
</template>
