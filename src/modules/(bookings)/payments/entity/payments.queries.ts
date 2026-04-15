import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getV1PaymentsByIdOptions, getV1PaymentsByIdQueryKey } from "#src/common/api/sdk-queries";
import type { UUID } from "#src/types";

export const PAYMENT_QUERY_KEYS = {
  detail: (id: UUID) => getV1PaymentsByIdQueryKey({ path: { id } }),
};

export function usePaymentDetailQuery(id: Ref<UUID>) {
  return useQuery(
    computed(() => ({
      ...getV1PaymentsByIdOptions({ path: { id: id.value } }),
      enabled: !!id.value,
    })),
  );
}
