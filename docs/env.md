# Environment Variables

## Quick Start

```bash
cp .env.example .env
```

The app reads env vars via Nuxt's `useRuntimeConfig()` (see `nuxt.config.ts` →
`runtimeConfig.public`) and via `src/configs/*.config.ts` wrappers.

## Variables

### API

| Variable                   | Type    | Required | Default                 | Description                          |
| -------------------------- | ------- | -------- | ----------------------- | ------------------------------------ |
| `NUXT_PUBLIC_API_BASE_URL` | string  | yes      | `http://localhost:3100` | Backend API base URL                 |
| `NUXT_PUBLIC_API_TIMEOUT`  | integer | no       | `10000`                 | HTTP request timeout (ms)            |
| `NUXT_PUBLIC_API_RETRIES`  | integer | no       | `1`                     | Number of retries on network failure |

### App

| Variable               | Type   | Required | Default                 | Description                  |
| ---------------------- | ------ | -------- | ----------------------- | ---------------------------- |
| `NUXT_PUBLIC_APP_NAME` | string | yes      | `Nuxt Starter Kit`      | Application name shown in UI |
| `NUXT_PUBLIC_APP_URL`  | string | yes      | `http://localhost:3000` | Public app URL               |

### Auth

| Variable                          | Type   | Required | Default         | Description                       |
| --------------------------------- | ------ | -------- | --------------- | --------------------------------- |
| `NUXT_PUBLIC_AUTH_ACCESS_COOKIE`  | string | no       | `access_token`  | Name of access token cookie       |
| `NUXT_PUBLIC_AUTH_REFRESH_COOKIE` | string | no       | `refresh_token` | Name of refresh token cookie      |
| `NUXT_PUBLIC_AUTH_COOKIE_DOMAIN`  | string | no       | (none)          | Cookie domain (set in production) |

### Feature Flags

| Variable                       | Type           | Required | Default | Description                 |
| ------------------------------ | -------------- | -------- | ------- | --------------------------- |
| `NUXT_PUBLIC_FF_NEW_DASHBOARD` | `true`/`false` | no       | `false` | Enable redesigned dashboard |
| `NUXT_PUBLIC_FF_BETA_FEATURES` | `true`/`false` | no       | `false` | Expose beta features        |

### Build-time

| Variable   | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| `NODE_ENV` | string | yes      | `development`, `production`, `test` |

## Environment Files

```text
.
├── .env                 # local dev (gitignored)
├── .env.example         # template, committed
└── .env.production      # (optional, usually env vars set by host)
```

Nuxt automatically loads `.env` based on `NODE_ENV`. Override by setting env
vars in the runtime (Vercel, Netlify, Docker, etc.).

## Reading config from code

Do not read `import.meta.env` directly in business code. Go through the typed
wrappers:

```ts
import { useApiConfig } from "#src/configs";

const { baseUrl, timeout } = useApiConfig();
```

The wrappers live in `src/configs/*.config.ts` and provide:

- runtime validation (via TypeBox where needed)
- typed return values
- defaults for missing vars

## Security notes

- Never put secrets (tokens, private keys) in `NUXT_PUBLIC_*` — those are
  shipped to the browser.
- Server-only secrets go in `runtimeConfig` (without the `public.` prefix) and
  are exposed to the server runtime only.
- `secure: true` cookie flag is always set — browsers exempt `localhost` for
  dev. Never set `secure: false` in a shared staging environment.
