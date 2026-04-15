import { formatCurrency } from "#src/common/utils/currency/format-currency";
import { PaymentStatus } from "./payments.types";

export const PaymentStatusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Pending",
  [PaymentStatus.Paid]: "Paid",
  [PaymentStatus.Refunded]: "Refunded",
  [PaymentStatus.Failed]: "Failed",
};

export const PaymentStatusColor: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [PaymentStatus.Paid]: "bg-green-100 text-green-800",
  [PaymentStatus.Refunded]: "bg-blue-100 text-blue-800",
  [PaymentStatus.Failed]: "bg-red-100 text-red-800",
};

export function formatAmount(amount: number): string {
  return formatCurrency(amount);
}
