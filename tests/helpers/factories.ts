// Test data factories. Keep them minimal — extend as needed.
import type { UUID } from "#src/types";

let seq = 0;
export function nextId(): UUID {
  seq += 1;
  return `00000000-0000-0000-0000-${String(seq).padStart(12, "0")}` as UUID;
}
