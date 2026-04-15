const MAX_RATING = 5;

export function formatRating(rating: number): string {
  return `${rating}/${MAX_RATING}`;
}
