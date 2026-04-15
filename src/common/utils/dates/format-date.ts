import dayjs from "dayjs";

export function formatDateTime(dateStr: string): string {
  return dayjs(dateStr).format("MMM D, YYYY h:mm A");
}

export function formatDate(dateStr: string): string {
  return dayjs(dateStr).format("MMM D, YYYY");
}

/** Safe formatter for SDK fields typed as `string | unknown` (simplifies to `unknown`). */
export function formatDateTimeOrFallback(val: unknown, fallback = "-"): string {
  return typeof val === "string" ? formatDateTime(val) : fallback;
}
