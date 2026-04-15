import type { components } from "#src/common/api/generated/api-schema";

export type User = components["schemas"]["User"];
export type UserCreateInput = components["schemas"]["UserCreateInput"];
export type UserUpdateInput = components["schemas"]["UserUpdateInput"];
export type UserListResponse = components["schemas"]["UserListResponse"];

export const UserRole = {
  User: "USER",
  Admin: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
