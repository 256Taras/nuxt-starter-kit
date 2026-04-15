import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1UsersMutation } from "#src/common/api/sdk-queries";
import { USER_QUERY_KEYS } from "../../entity";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postV1UsersMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}
