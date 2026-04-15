import type {
  GetV1UsersByIdResponse,
  GetV1UsersResponse,
  PostV1UsersData,
  PutV1UsersByIdData,
} from "#src/common/api/sdk";

export type User = GetV1UsersByIdResponse;

export type UserListResponse = GetV1UsersResponse;

// Pick drops the [key: string]: unknown index signature that prevents assignment to required-field types
export type UserListItem = Pick<
  Required<UserListResponse["data"][number]>,
  "id" | "email" | "firstName" | "lastName" | "role" | "createdAt" | "updatedAt"
>;

export type UserCreateInput = PostV1UsersData["body"];

export type UserUpdateInput = NonNullable<PutV1UsersByIdData["body"]>;

export const UserRole = {
  User: "USER",
  Admin: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
