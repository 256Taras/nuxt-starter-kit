import { formatCurrency } from "#src/common/utils/currency/format-currency";
import { ServiceStatus } from "./services.types";

export const ServiceStatusLabel: Record<ServiceStatus, string> = {
  [ServiceStatus.Active]: "Active",
  [ServiceStatus.Inactive]: "Inactive",
  [ServiceStatus.Draft]: "Draft",
};

export const ServiceStatusColor: Record<ServiceStatus, string> = {
  [ServiceStatus.Active]: "bg-green-100 text-green-800",
  [ServiceStatus.Inactive]: "bg-gray-100 text-gray-800",
  [ServiceStatus.Draft]: "bg-yellow-100 text-yellow-800",
};

export function formatPrice(price: number): string {
  return formatCurrency(price);
}

export function formatDuration(duration: number): string {
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${duration} min`;
}
