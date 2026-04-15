import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getV1ServicesOptions,
  getV1ServicesByIdOptions,
  getV1ServicesQueryKey,
  getV1ServicesByIdQueryKey,
} from "#src/common/api/sdk-queries";
import type { ServiceListItem } from "./services.types";
import type { PaginationParams, UUID } from "#src/types";

export const SERVICE_QUERY_KEYS = {
  lists: () => getV1ServicesQueryKey({}),
  detail: (id: UUID) => getV1ServicesByIdQueryKey({ path: { id } }),
};

export function useServicesListQuery(params: Ref<PaginationParams>) {
  const query = useQuery(computed(() => getV1ServicesOptions({ query: params.value })));
  const items = computed<ServiceListItem[]>(() => (query.data.value?.data ?? []) as ServiceListItem[]);
  return { ...query, items };
}

export function useServiceDetailQuery(id: Ref<UUID>) {
  return useQuery(
    computed(() => ({
      ...getV1ServicesByIdOptions({ path: { id: id.value } }),
      enabled: !!id.value,
    })),
  );
}
