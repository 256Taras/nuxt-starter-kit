import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useRoute } from "#imports";
import type { UUID } from "#src/types";

type RouteName = Parameters<typeof useRoute>[0];

export function useRouteId(name: RouteName): ComputedRef<UUID> {
  const route = useRoute(name);
  return computed(() => (route.params as Record<string, string>).id!);
}
