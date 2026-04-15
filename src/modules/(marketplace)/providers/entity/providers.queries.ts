import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getV1ProvidersOptions,
  getV1ProvidersByIdOptions,
  getV1ProvidersQueryKey,
  getV1ProvidersByIdQueryKey,
} from "#src/common/api/sdk-queries";
import type { ProviderListItem } from "./providers.types";
import type { PaginationParams, UUID } from "#src/types";

export const PROVIDER_QUERY_KEYS = {
  lists: () => getV1ProvidersQueryKey({}),
  detail: (id: UUID) => getV1ProvidersByIdQueryKey({ path: { id } }),
};

export function useProvidersListQuery(params: Ref<PaginationParams>) {
  const query = useQuery(computed(() => getV1ProvidersOptions({ query: params.value })));
  const items = computed<ProviderListItem[]>(() => (query.data.value?.data ?? []) as ProviderListItem[]);
  return { ...query, items };
}

export function useProviderDetailQuery(id: Ref<UUID>) {
  return useQuery(
    computed(() => ({
      ...getV1ProvidersByIdOptions({ path: { id: id.value } }),
      enabled: !!id.value,
    })),
  );
}
