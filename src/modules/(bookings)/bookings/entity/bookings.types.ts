import type {
  GetV1BookingsByIdResponse,
  GetV1BookingsResponse,
  PatchV1BookingsByIdCancelData,
} from "#src/common/api/sdk";

export type Booking = GetV1BookingsByIdResponse;

export type BookingListResponse = GetV1BookingsResponse;

export type BookingListItem = Required<BookingListResponse["data"][number]>;

export type BookingCancelInput = NonNullable<PatchV1BookingsByIdCancelData["body"]>;

export const BookingStatus = {
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
