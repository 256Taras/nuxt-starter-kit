import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { deleteV1ProvidersByIdMutation } from "#src/common/api/sdk-queries";
import { PROVIDER_QUERY_KEYS } from "../../entity";

export function useDeleteProviderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteV1ProvidersByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() });
    },
  });
}
