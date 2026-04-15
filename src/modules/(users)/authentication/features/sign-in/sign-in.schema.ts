import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { EmailSchema } from "#src/common/validation";

export const SignInFormSchema = Type.Object({
  email: EmailSchema,
  password: Type.String({ minLength: 1 }),
});

export type SignInFormValues = Static<typeof SignInFormSchema>;
