import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCookie } from "#imports";
import { toast } from "vue3-toastify";
import { useAuthenticationApi } from "../api/use-authentication-api";
import type {
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  Credentials,
} from "../types/authentication.types";
import type { components } from "#src/common/api/generated/api-schema";
import { AUTH_CONFIG } from "#src/configs";

type User = components["schemas"]["User"];

export const useAuthenticationStore = defineStore("authentication", () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => currentUser.value !== null);

  const isSigningUp = ref(false);
  const isSigningIn = ref(false);
  const isLoggingOut = ref(false);

  function setCredentials(credentials: Credentials) {
    const accessTokenCookie = useCookie(AUTH_CONFIG.cookies.accessToken);
    const refreshTokenCookie = useCookie(AUTH_CONFIG.cookies.refreshToken);

    accessTokenCookie.value = credentials.accessToken;
    refreshTokenCookie.value = credentials.refreshToken;
    currentUser.value = credentials.user;
  }

  function clearCredentials() {
    const accessTokenCookie = useCookie(AUTH_CONFIG.cookies.accessToken);
    const refreshTokenCookie = useCookie(AUTH_CONFIG.cookies.refreshToken);

    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
    currentUser.value = null;
  }

  async function signUp(input: SignUpInput) {
    const api = useAuthenticationApi();
    isSigningUp.value = true;
    try {
      const credentials = await api.signUp(input);
      setCredentials(credentials);
      toast.success("Account created successfully");
    } finally {
      isSigningUp.value = false;
    }
  }

  async function signIn(input: SignInInput) {
    const api = useAuthenticationApi();
    isSigningIn.value = true;
    try {
      const credentials = await api.signIn(input);
      setCredentials(credentials);
      toast.success("Signed in successfully");
    } finally {
      isSigningIn.value = false;
    }
  }

  async function logOut() {
    const api = useAuthenticationApi();
    isLoggingOut.value = true;
    try {
      await api.logOut();
      clearCredentials();
      toast.success("Signed out");
    } finally {
      isLoggingOut.value = false;
    }
  }

  async function forgotPassword(input: ForgotPasswordInput) {
    const api = useAuthenticationApi();
    const result = await api.forgotPassword(input);
    toast.success("Password reset link sent to your email");
    return result;
  }

  async function resetPassword(input: ResetPasswordInput) {
    const api = useAuthenticationApi();
    await api.resetPassword(input);
    toast.success("Password reset successfully");
  }

  async function changePassword(input: ChangePasswordInput) {
    const api = useAuthenticationApi();
    const result = await api.changePassword(input);
    toast.success("Password changed successfully");
    return result;
  }

  return {
    currentUser,
    isAuthenticated,

    isSigningUp: computed(() => isSigningUp.value),
    isSigningIn: computed(() => isSigningIn.value),
    isLoggingOut: computed(() => isLoggingOut.value),

    signUp,
    signIn,
    logOut,
    forgotPassword,
    resetPassword,
    changePassword,
    setCredentials,
    clearCredentials,
  };
});
