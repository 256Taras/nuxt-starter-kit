import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCookie } from "#imports";
import type { User, Credentials } from "./authentication.types";
import { AUTH_CONFIG } from "#src/configs";

export const useAuthenticationStore = defineStore("authentication", () => {
  const accessToken = useCookie<string | null>(AUTH_CONFIG.cookies.accessToken, AUTH_CONFIG.cookieOptions);
  const refreshToken = useCookie<string | null>(AUTH_CONFIG.cookies.refreshToken, AUTH_CONFIG.cookieOptions);

  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => currentUser.value !== null);

  function setCredentials(credentials: Credentials) {
    accessToken.value = credentials.accessToken;
    refreshToken.value = credentials.refreshToken;
    currentUser.value = credentials.user;
  }

  function clearCredentials() {
    accessToken.value = null;
    refreshToken.value = null;
    currentUser.value = null;
  }

  function setCurrentUser(user: User) {
    currentUser.value = user;
  }

  return {
    currentUser,
    isAuthenticated,
    setCredentials,
    clearCredentials,
    setCurrentUser,
  };
});
