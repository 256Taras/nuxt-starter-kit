import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { EmailSchema, PasswordSchema, RequiredStringSchema } from "#src/common/validation";

export const SignUpFormSchema = Type.Object({
  email: EmailSchema,
  firstName: RequiredStringSchema(2),
  lastName: RequiredStringSchema(2),
  password: PasswordSchema,
});

export type SignUpFormValues = Static<typeof SignUpFormSchema>;
