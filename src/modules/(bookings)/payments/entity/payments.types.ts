import type { GetV1PaymentsByIdResponse } from "#src/common/api/sdk";

export type Payment = GetV1PaymentsByIdResponse;

export const PaymentStatus = {
  Pending: "pending",
  Paid: "paid",
  Refunded: "refunded",
  Failed: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
