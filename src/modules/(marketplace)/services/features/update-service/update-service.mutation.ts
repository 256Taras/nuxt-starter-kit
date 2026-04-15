import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { patchV1ServicesByIdMutation } from "#src/common/api/sdk-queries";
import { SERVICE_QUERY_KEYS } from "../../entity";
export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...patchV1ServicesByIdMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.detail(vars.path.id) });
    },
  });
}
