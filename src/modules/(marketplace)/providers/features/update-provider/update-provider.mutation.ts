import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { patchV1ProvidersByIdMutation } from "#src/common/api/sdk-queries";
import { PROVIDER_QUERY_KEYS } from "../../entity";
export function useUpdateProviderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...patchV1ProvidersByIdMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.detail(vars.path.id) });
    },
  });
}
