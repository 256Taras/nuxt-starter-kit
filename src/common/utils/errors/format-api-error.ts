interface ApiErrorDetail {
  readonly field: string;
  readonly message: string;
  readonly type: string;
}

interface ApiErrorBody {
  readonly statusCode: number;
  readonly userMessage: string;
  readonly errorDetails?: readonly ApiErrorDetail[];
}

function isApiError(error: unknown): error is { data: ApiErrorBody } {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as Record<string, unknown>).data === "object"
  );
}

export function formatApiError(error: unknown, fallback: string): string {
  if (!isApiError(error)) return fallback;

  const { data } = error;

  if (data.userMessage && data.userMessage !== "Bad request") {
    return data.userMessage;
  }

  return fallback;
}

export function extractFieldErrors(error: unknown): Record<string, string> {
  if (!isApiError(error)) return {};

  const { data } = error;
  if (!data.errorDetails?.length) return {};

  const result: Record<string, string> = {};
  for (const detail of data.errorDetails) {
    result[detail.field] = detail.message;
  }
  return result;
}
