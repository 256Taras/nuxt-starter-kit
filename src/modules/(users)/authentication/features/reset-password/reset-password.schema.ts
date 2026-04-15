import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { PasswordSchema } from "#src/common/validation";

export const ResetPasswordPageSchema = Type.Object({
  password: PasswordSchema,
});

export type ResetPasswordPageValues = Static<typeof ResetPasswordPageSchema>;
