import type { User, UserListItem } from "./profiles.types";
import { UserRole } from "./profiles.types";

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.Admin]: "Administrator",
  [UserRole.User]: "User",
};

export const UserRoleColor: Record<UserRole, string> = {
  [UserRole.Admin]: "bg-primary/10 text-primary",
  [UserRole.User]: "bg-muted text-muted-foreground",
};

export function getRoleLabel(role: UserRole): string {
  return UserRoleLabel[role];
}

export function getFullName(user: User | UserListItem): string {
  return `${user.firstName} ${user.lastName}`;
}
