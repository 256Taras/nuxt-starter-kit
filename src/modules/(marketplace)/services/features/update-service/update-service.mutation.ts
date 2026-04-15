import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { patchV1ServicesById } from "#src/common/api/sdk";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import { SERVICE_QUERY_KEYS } from "../../entity";
import type { ServiceFormValues } from "../../entity";
import type { UUID } from "#src/types";

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { id: UUID; values: ServiceFormValues }) => {
      const body = {
        name: vars.values.name,
        price: vars.values.price,
        duration: vars.values.duration,
        ...stripEmpty({ description: vars.values.description, imageUrl: vars.values.imageUrl }),
      };
      const { data } = await patchV1ServicesById({
        path: { id: vars.id },
        body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.detail(vars.id) });
    },
  });
}
