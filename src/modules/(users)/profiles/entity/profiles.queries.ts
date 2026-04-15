import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getV1UsersProfileOptions,
  getV1UsersProfileQueryKey,
  getV1UsersOptions,
  getV1UsersQueryKey,
  getV1UsersByIdOptions,
  getV1UsersByIdQueryKey,
} from "#src/common/api/sdk-queries";
import type { UserListItem } from "./profiles.types";
import type { PaginationParams, UUID } from "#src/types";

export const USER_QUERY_KEYS = {
  profile: () => getV1UsersProfileQueryKey({}),
  lists: () => getV1UsersQueryKey({}),
  detail: (id: UUID) => getV1UsersByIdQueryKey({ path: { id } }),
};

export function useProfileQuery() {
  return useQuery(getV1UsersProfileOptions());
}

export function useUsersListQuery(params: Ref<PaginationParams>) {
  const query = useQuery(computed(() => getV1UsersOptions({ query: params.value })));
  const items = computed<UserListItem[]>(() => (query.data.value?.data ?? []) as UserListItem[]);
  return { ...query, items };
}

export function useUserDetailQuery(id: Ref<UUID>) {
  return useQuery(
    computed(() => ({
      ...getV1UsersByIdOptions({ path: { id: id.value } }),
      enabled: !!id.value,
    })),
  );
}
