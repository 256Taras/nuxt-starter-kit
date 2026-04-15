import { formatDateTime, formatDate, formatDateTimeOrFallback } from "#src/common/utils/dates/format-date";
import { formatCurrency } from "#src/common/utils/currency/format-currency";
import type { Booking } from "./bookings.types";
import { BookingStatus } from "./bookings.types";

export { formatDateTime, formatDate, formatDateTimeOrFallback };

export const BookingStatusLabel: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "Pending",
  [BookingStatus.Confirmed]: "Confirmed",
  [BookingStatus.Completed]: "Completed",
  [BookingStatus.Cancelled]: "Cancelled",
};

export const BookingStatusColor: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [BookingStatus.Confirmed]: "bg-blue-100 text-blue-800",
  [BookingStatus.Completed]: "bg-green-100 text-green-800",
  [BookingStatus.Cancelled]: "bg-red-100 text-red-800",
};

export function canCancel(booking: Booking): boolean {
  return booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed;
}

export function canConfirm(booking: Booking): boolean {
  return booking.status === BookingStatus.Pending;
}

export function canComplete(booking: Booking): boolean {
  return booking.status === BookingStatus.Confirmed;
}

export function canPay(booking: Booking): boolean {
  return booking.status === BookingStatus.Confirmed;
}

export function isCancelled(booking: Booking): boolean {
  return booking.status === BookingStatus.Cancelled;
}

export function isFinal(booking: Booking): boolean {
  return booking.status === BookingStatus.Completed || booking.status === BookingStatus.Cancelled;
}

export function formatTotalPrice(price: number): string {
  return formatCurrency(price);
}

/** SDK types `cancellationFee: number | unknown` which simplifies to `unknown`. */
export function formatCancellationFee(val: unknown): string | null {
  return typeof val === "number" ? formatTotalPrice(val) : null;
}
