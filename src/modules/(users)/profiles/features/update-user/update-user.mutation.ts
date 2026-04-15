import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { putV1UsersByIdMutation } from "#src/common/api/sdk-queries";
import { USER_QUERY_KEYS } from "../../entity";
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...putV1UsersByIdMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(vars.path.id) });
    },
  });
}
