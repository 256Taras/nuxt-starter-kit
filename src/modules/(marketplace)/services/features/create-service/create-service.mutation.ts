import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1ServicesProviderByProviderId } from "#src/common/api/sdk";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import { SERVICE_QUERY_KEYS } from "../../entity";
import type { ServiceFormValues } from "../../entity";
import type { UUID } from "#src/types";

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { providerId: UUID; values: ServiceFormValues }) => {
      const body = {
        name: vars.values.name,
        price: vars.values.price,
        duration: vars.values.duration,
        ...stripEmpty({ description: vars.values.description, imageUrl: vars.values.imageUrl }),
      };
      const { data } = await postV1ServicesProviderByProviderId({
        path: { providerId: vars.providerId },
        body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
    },
  });
}
