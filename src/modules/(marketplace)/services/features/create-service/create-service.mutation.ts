import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1ServicesProviderByProviderIdMutation } from "#src/common/api/sdk-queries";
import { SERVICE_QUERY_KEYS } from "../../entity";

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postV1ServicesProviderByProviderIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
    },
  });
}
