# Error Handling

How errors flow from the backend SDK through the frontend to the user.

## The flow

```text
Backend error (4xx/5xx)
  ↓
SDK throws (throwOnError: true)
  ↓
Mutation rejects inside mutationFn
  ↓
runWithToast catches, calls formatApiError
  ↓
toast.error(userMessage) shown to user
  ↓
runWithToast returns false — page handles (no redirect)
```

## Error shape from backend

The backend returns errors in this shape (defined in `libs/errors` on the
backend, mirrored as `ApiErrorResponse` in `src/types/api.types.ts`):

```ts
interface ApiErrorBody {
  readonly statusCode: number;
  readonly userMessage: string; // localized, safe to display
  readonly developerMessage?: string; // debug detail
  readonly errorDetails?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}
```

## Mutation error handling

Every mutation uses `throwOnError: true` so the error bubbles up:

```ts
const { data } = await postV1Providers({ body, throwOnError: true });
```

The error object the hook catches has shape:

```ts
{
  response: Response;
  data: ApiErrorBody; // the body we care about
  status: number;
}
```

Access it via `error.data.userMessage` — never render a raw Error object.

## `runWithToast` helper

The canonical mutation wrapper. Lives at
`src/common/utils/errors/run-with-toast.ts`.

```ts
export async function runWithToast<V>(
  mutate: (vars: V) => Promise<unknown>,
  vars: V,
  messages: { success: string; error: string },
): Promise<boolean> {
  try {
    await mutate(vars);
    toast.success(messages.success);
    return true;
  } catch (err) {
    toast.error(formatApiError(err, messages.error));
    return false;
  }
}
```

Pages and feature hooks use this for every mutation. No raw `try/catch` +
`toast.success/error` combos anywhere else.

## `formatApiError` helper

Extracts `userMessage` from the SDK's thrown error. Falls back to a provided
string when the error is not the expected shape.

```ts
export function formatApiError(error: unknown, fallback: string): string {
  if (!isApiError(error)) return fallback;

  const { data } = error;

  if (data.userMessage && data.userMessage !== "Bad request") {
    return data.userMessage;
  }

  return fallback;
}
```

**Why we don't expand `errorDetails` into the toast:** field-level errors belong
on the form, not in a notification. vee-validate + `FormField` already render
per-field errors inline via `extractFieldErrors` (see below).

## Field-level form errors

When validation fails server-side with `errorDetails`, map them onto the form's
`errors` object:

```ts
import { extractFieldErrors } from "#src/common/utils/errors/format-api-error";

const onSubmit = handleSubmit(async (values) => {
  try {
    await mutation.mutateAsync(values);
  } catch (err) {
    const fieldErrors = extractFieldErrors(err);
    Object.entries(fieldErrors).forEach(([field, message]) => {
      setFieldError(field, message);
    });
  }
});
```

Use this only when you need inline field errors. For most mutations,
`runWithToast` is enough.

## Query error handling

TanStack Query's `useQuery` returns `{ isError, error }`. Detail/list pages
render a simple inline alert:

```vue
<div v-else-if="isError" class="text-destructive" role="alert">
  {{ error?.userMessage ?? "Failed to load" }}
</div>
```

Never wrap queries in `try/catch` — the reactive API is the contract.

## Auth errors (401)

The SDK runtime config (`src/common/api/sdk-runtime-config.ts`) intercepts `401`
responses and attempts a token refresh via the refresh endpoint. If the refresh
fails, it clears credentials and redirects to `/sign-in`. The feature code never
needs to handle 401 explicitly.

## Network errors

When the fetch itself fails (no connection, CORS, DNS), `throwOnError` still
throws but with a non-`ApiErrorBody` shape. `isApiError()` returns `false`, so
`formatApiError` falls back to the provided string — the user sees the fallback
message, not a technical error.

## Redirect on success

Pages decide what happens after a successful mutation. The canonical pattern:

```ts
const onSubmit = handleSubmit(async (values) => {
  const ok = await runWithToast(mutation.mutateAsync, values, {
    success: "Provider created",
    error: "Failed to create provider",
  });
  if (ok) await pushTo.providers.list();
});
```

`ok` is `true` when the mutation succeeded. Use it to decide the next step
(redirect, close modal, clear form).

## Rules

- **Never** catch an error and silently continue — always toast or log.
- **Never** display raw error messages or stack traces to users.
- **Never** hand-write HTTP calls — use SDK-wrapped mutations/queries.
- **Always** pass `throwOnError: true` to SDK functions.
- **Always** use `runWithToast` for page-level mutation handling.
- **Never** show `errorDetails` in a toast — they belong on the form field.
- Auth 401s are handled globally. Do not write page-level 401 handlers.
