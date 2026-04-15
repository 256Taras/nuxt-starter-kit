<script setup lang="ts">
import { definePageMeta, useSeoMeta } from "#imports";
import { ChangePasswordForm } from "#src/modules/(users)/authentication";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "#src/common/components/molecules/card";

definePageMeta({ layout: "default" });
useSeoMeta({ title: "Change password" });
</script>

<template>
  <div class="max-w-lg mx-auto">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Change password</CardTitle>
        <CardDescription>Enter your current password and choose a new one</CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  </div>
</template>
