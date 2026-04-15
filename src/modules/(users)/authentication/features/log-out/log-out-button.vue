<script setup lang="ts">
import { useLogOut } from "./use-log-out";
import { LogOut } from "lucide-vue-next";

const { logOut } = useLogOut();
</script>

<template>
  <button
    class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
    @click="logOut"
  >
    <LogOut :size="18" />
    <span>Log out</span>
  </button>
</template>
