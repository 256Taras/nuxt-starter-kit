import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useProfilesApi } from "../api/use-profiles-api";
import { USER_QUERY_KEYS } from "./use-profiles-queries";
import type { User, UserCreateInput, UserUpdateInput } from "../types/profiles.types";

export function useCreateUserMutation() {
  const api = useProfilesApi();
  const queryClient = useQueryClient();

  return useMutation<User, Error, UserCreateInput>({
    mutationFn: (input) => api.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateUserMutation() {
  const api = useProfilesApi();
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; body: UserUpdateInput }>({
    mutationFn: ({ id, body }) => api.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(id) });
    },
  });
}

export function useRemoveUserMutation() {
  const api = useProfilesApi();
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}
