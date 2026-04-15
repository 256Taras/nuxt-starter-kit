import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useRoute } from "#imports";

/**
 * Reads a single query parameter as a string, normalizing the
 * `string | string[] | null` shape that `route.query[key]` returns.
 * Missing or array-valued params collapse to their first value,
 * defaulting to an empty string.
 */
export function useQueryParam<T extends string = string>(key: string): ComputedRef<T> {
  const route = useRoute();
  return computed(() => {
    const value = route.query[key];
    return ((Array.isArray(value) ? value[0] : value) ?? "") as T;
  });
}
