import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1Providers } from "#src/common/api/sdk";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import { PROVIDER_QUERY_KEYS } from "../../entity";
import type { ProviderFormValues } from "../../entity";

export function useCreateProviderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProviderFormValues) => {
      const body = {
        name: values.name,
        ...stripEmpty({ description: values.description, logoUrl: values.logoUrl }),
      };
      const { data } = await postV1Providers({ body, throwOnError: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() });
    },
  });
}
