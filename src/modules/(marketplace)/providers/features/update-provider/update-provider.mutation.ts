import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { patchV1ProvidersById } from "#src/common/api/sdk";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import { PROVIDER_QUERY_KEYS } from "../../entity";
import type { ProviderFormValues } from "../../entity";
import type { UUID } from "#src/types";

export function useUpdateProviderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { id: UUID; values: ProviderFormValues }) => {
      const body = {
        name: vars.values.name,
        ...stripEmpty({ description: vars.values.description, logoUrl: vars.values.logoUrl }),
      };
      const { data } = await patchV1ProvidersById({
        path: { id: vars.id },
        body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.detail(vars.id) });
    },
  });
}
