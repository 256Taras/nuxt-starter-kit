<script setup lang="ts">
import { definePageMeta, useSeoMeta } from "#imports";
import { SignUpForm } from "#src/modules/(users)/authentication";
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
useSeoMeta({ title: "Create account" });

const { routes } = useAppRouter();
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Create account</CardTitle>
      <CardDescription>Fill in your details to get started</CardDescription>
    </CardHeader>

    <CardContent>
      <SignUpForm />
    </CardContent>

    <CardFooter class="justify-center text-sm text-muted-foreground">
      <p>
        Already have an account?
        <NuxtLink
          :to="routes.auth.signIn()"
          class="text-primary hover:underline"
          >Sign in</NuxtLink
        >
      </p>
    </CardFooter>
  </Card>
</template>
