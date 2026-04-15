import type { Provider } from "./providers.types";

const RATING_EXCELLENT = 4.5;
const RATING_GOOD = 3.5;
const RATING_AVERAGE = 2.5;
const RATING_BELOW_AVERAGE = 1.5;

export function isVerified(provider: Provider): boolean {
  return provider.isVerified;
}

export function getRatingLabel(rating: string): string {
  const value = parseFloat(rating);

  if (value >= RATING_EXCELLENT) return "Excellent";
  if (value >= RATING_GOOD) return "Good";
  if (value >= RATING_AVERAGE) return "Average";
  if (value >= RATING_BELOW_AVERAGE) return "Below average";
  return "Poor";
}
