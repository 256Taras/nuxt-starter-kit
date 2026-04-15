import { defineNuxtRouteMiddleware, useCookie, navigateTo } from "#imports";
import { AUTH_CONFIG } from "#src/configs";
import { routes } from "#src/common/router/app-router";

const PUBLIC_ROUTES = new Set([
  routes.auth.signIn(),
  routes.auth.signUp(),
  routes.auth.forgotPassword(),
  "/reset-password",
]);

const GUEST_ONLY_ROUTES = new Set([routes.auth.signIn(), routes.auth.signUp()]);

export default defineNuxtRouteMiddleware((to) => {
  const accessToken = useCookie(AUTH_CONFIG.cookies.accessToken);
  const isAuthenticated = !!accessToken.value;
  const path = to.path;

  if (PUBLIC_ROUTES.has(path)) {
    if (isAuthenticated && GUEST_ONLY_ROUTES.has(path)) {
      return navigateTo(routes.home());
    }
    return;
  }

  if (!isAuthenticated) {
    return navigateTo({
      path: routes.auth.signIn(),
      query: { redirect: path },
    });
  }
});
