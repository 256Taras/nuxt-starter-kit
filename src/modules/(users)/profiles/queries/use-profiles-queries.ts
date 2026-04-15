import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";
import { useProfilesApi } from "../api/use-profiles-api";
import type { User, UserListResponse } from "../types/profiles.types";
import type { PaginationParams } from "#src/types";

const QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...QUERY_KEYS.all, "list"] as const,
  list: (params: PaginationParams) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  profile: ["profile"] as const,
};

export { QUERY_KEYS as USER_QUERY_KEYS };

export function useProfileQuery() {
  const api = useProfilesApi();

  return useQuery<User>({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => api.getProfile(),
  });
}

export function useUsersListQuery(params: Ref<PaginationParams>) {
  const api = useProfilesApi();

  return useQuery<UserListResponse>({
    queryKey: computed(() => QUERY_KEYS.list(params.value)),
    queryFn: () => api.getList(params.value),
  });
}

export function useUserDetailQuery(id: Ref<string>) {
  const api = useProfilesApi();

  return useQuery<User>({
    queryKey: computed(() => QUERY_KEYS.detail(id.value)),
    queryFn: () => api.getById(id.value),
    enabled: computed(() => !!id.value),
  });
}
