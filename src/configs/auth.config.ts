const SECONDS_PER_DAY = 60 * 60 * 24;
const COOKIE_MAX_AGE_DAYS = 7;

export const AUTH_CONFIG = {
  cookies: {
    accessToken: "access_token",
    refreshToken: "refresh_token",
  },
  cookieMaxAge: SECONDS_PER_DAY * COOKIE_MAX_AGE_DAYS,
} as const;
