import type { User, UserCreateInput, UserUpdateInput, UserListResponse } from "../types/profiles.types";
import type { PaginationParams } from "#src/types";
import { useHttpClient } from "#src/common/api/use-http-client";

export function useProfilesApi() {
  const http = useHttpClient();

  return {
    getProfile: () => http.get<User>("/v1/users/profile"),

    getList: (params?: PaginationParams) => http.get<UserListResponse>("/v1/users", { query: params }),

    getById: (id: string) => http.get<User>(`/v1/users/${id}`),

    create: (body: UserCreateInput) => http.post<User>("/v1/users", body),

    update: (id: string, body: UserUpdateInput) => http.put<User>(`/v1/users/${id}`, body),

    remove: (id: string) => http.delete<User>(`/v1/users/${id}`),
  };
}
