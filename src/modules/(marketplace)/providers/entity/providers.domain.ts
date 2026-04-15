import type { Provider } from "./providers.types";

export function isVerified(provider: Provider): boolean {
  return provider.isVerified;
}

export function getRatingLabel(rating: string): string {
  const value = parseFloat(rating);

  if (value >= 4.5) return "Excellent";
  if (value >= 3.5) return "Good";
  if (value >= 2.5) return "Average";
  if (value >= 1.5) return "Below average";
  return "Poor";
}
