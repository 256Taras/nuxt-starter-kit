import { defineStore } from "pinia";
import { ref } from "vue";
import type { User, UserRole } from "../types/profiles.types";
import type { PaginationParams } from "#src/types";

export const useProfilesStore = defineStore("profiles", () => {
  const paginationParams = ref<PaginationParams>({ page: 1, limit: 10 });

  function isAdmin(user: User): boolean {
    return user.role === "ADMIN";
  }

  function getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      ADMIN: "Administrator",
      USER: "User",
    };
    return labels[role];
  }

  function getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  function setPage(page: number) {
    paginationParams.value = { ...paginationParams.value, page };
  }

  function setLimit(limit: number) {
    paginationParams.value = { ...paginationParams.value, limit, page: 1 };
  }

  return {
    paginationParams,

    isAdmin,
    getRoleLabel,
    getFullName,

    setPage,
    setLimit,
  };
});
