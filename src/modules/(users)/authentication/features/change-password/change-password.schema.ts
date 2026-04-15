import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { PasswordSchema } from "#src/common/validation";

export const ChangePasswordFormSchema = Type.Object({
  oldPassword: Type.String({ minLength: 1 }),
  newPassword: PasswordSchema,
});

export type ChangePasswordFormValues = Static<typeof ChangePasswordFormSchema>;
