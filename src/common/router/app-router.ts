import { useRouter } from "#imports";

interface RouteConfig {
  list: () => string;
  create: () => string;
  edit: (params: { id: string }) => string;
  view: (params: { id: string }) => string;
}

function createCrudRoutes(basePath: string): RouteConfig {
  return {
    list: () => basePath,
    create: () => `${basePath}/create`,
    edit: ({ id }) => `${basePath}/${id}/edit`,
    view: ({ id }) => `${basePath}/${id}`,
  };
}

const routes = {
  auth: {
    signIn: () => "/sign-in",
    signUp: () => "/sign-up",
    forgotPassword: () => "/forgot-password",
    resetPassword: (token: string) => `/reset-password?token=${token}`,
  },

  home: () => "/",
  profile: () => "/profile",
  changePassword: () => "/change-password",

  users: createCrudRoutes("/users"),
} as const;

type NavigationMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => Promise<undefined>
    : NavigationMethods<T[K]>;
};

function createPushTo<T extends Record<string, unknown>>(
  routeConfig: T,
  navigate: (path: string) => Promise<undefined>,
): NavigationMethods<T> {
  const result = {} as Record<string, unknown>;

  for (const key of Object.keys(routeConfig)) {
    const value = routeConfig[key];

    if (typeof value === "function") {
      result[key] = (...args: unknown[]) => navigate((value as (...a: unknown[]) => string)(...args));
    } else if (typeof value === "object" && value !== null) {
      result[key] = createPushTo(value as Record<string, unknown>, navigate);
    }
  }

  return result as NavigationMethods<T>;
}

export function useAppRouter() {
  const router = useRouter();

  const navigate = (path: string) => router.push(path);

  return {
    routes,
    pushTo: createPushTo(routes, navigate),
    router,
  };
}

export { routes };
export type AppRoutes = typeof routes;
