import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { deleteV1ServicesByIdMutation } from "#src/common/api/sdk-queries";
import { SERVICE_QUERY_KEYS } from "../../entity";

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteV1ServicesByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() });
    },
  });
}
