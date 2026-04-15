import { describe, expect, it } from "vitest";
import {
  canCancel,
  canConfirm,
  canComplete,
  isCancelled,
  isFinal,
} from "#src/modules/(bookings)/bookings/entity/bookings.domain";
import { BookingStatus } from "#src/modules/(bookings)/bookings/entity/bookings.types";
import type { Booking } from "#src/modules/(bookings)/bookings/entity/bookings.types";

function makeBooking(status: Booking["status"]): Booking {
  return { status } as Booking;
}

describe("bookings.domain", () => {
  it("canCancel — true for pending/confirmed, false otherwise", () => {
    expect(canCancel(makeBooking(BookingStatus.Pending))).toBe(true);
    expect(canCancel(makeBooking(BookingStatus.Confirmed))).toBe(true);
    expect(canCancel(makeBooking(BookingStatus.Completed))).toBe(false);
    expect(canCancel(makeBooking(BookingStatus.Cancelled))).toBe(false);
  });

  it("canConfirm — true only for pending", () => {
    expect(canConfirm(makeBooking(BookingStatus.Pending))).toBe(true);
    expect(canConfirm(makeBooking(BookingStatus.Confirmed))).toBe(false);
  });

  it("canComplete — true only for confirmed", () => {
    expect(canComplete(makeBooking(BookingStatus.Confirmed))).toBe(true);
    expect(canComplete(makeBooking(BookingStatus.Pending))).toBe(false);
  });

  it("isCancelled / isFinal", () => {
    expect(isCancelled(makeBooking(BookingStatus.Cancelled))).toBe(true);
    expect(isFinal(makeBooking(BookingStatus.Completed))).toBe(true);
    expect(isFinal(makeBooking(BookingStatus.Cancelled))).toBe(true);
    expect(isFinal(makeBooking(BookingStatus.Pending))).toBe(false);
  });
});
