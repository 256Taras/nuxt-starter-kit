import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getV1ReviewsServiceByServiceIdOptions,
  getV1ReviewsServiceByServiceIdQueryKey,
} from "#src/common/api/sdk-queries";
import type { PaginationParams, UUID } from "#src/types";

export const REVIEW_QUERY_KEYS = {
  byService: (serviceId: UUID) => getV1ReviewsServiceByServiceIdQueryKey({ path: { serviceId } }),
};

export function useReviewsByServiceQuery(serviceId: Ref<UUID>, params: Ref<PaginationParams>) {
  return useQuery(
    computed(() => ({
      ...getV1ReviewsServiceByServiceIdOptions({
        path: { serviceId: serviceId.value },
        query: params.value,
      }),
      enabled: !!serviceId.value,
    })),
  );
}
