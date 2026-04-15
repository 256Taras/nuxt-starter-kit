import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1ProvidersMutation } from "#src/common/api/sdk-queries";
import { PROVIDER_QUERY_KEYS } from "../../entity";

export function useCreateProviderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postV1ProvidersMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() });
    },
  });
}
