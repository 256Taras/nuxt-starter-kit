import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { deleteV1UsersByIdMutation } from "#src/common/api/sdk-queries";
import { USER_QUERY_KEYS } from "../../entity";
import type { UUID } from "#src/types";

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteV1UsersByIdMutation(),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(vars.path.id as UUID) });
    },
  });
}
