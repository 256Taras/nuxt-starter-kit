const SECONDS_PER_DAY = 60 * 60 * 24;
const COOKIE_MAX_AGE_DAYS = 7;

export const AUTH_CONFIG = {
  cookies: {
    accessToken: "access_token",
    refreshToken: "refresh_token",
  },
  cookieMaxAge: SECONDS_PER_DAY * COOKIE_MAX_AGE_DAYS,
  // TODO: migrate to httpOnly cookies — requires server-side token injection
  // Current client-side reads in sdk-runtime-config.ts and authentication.store.ts
  // prevent httpOnly without architectural changes.
  cookieOptions: {
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
} as const;
