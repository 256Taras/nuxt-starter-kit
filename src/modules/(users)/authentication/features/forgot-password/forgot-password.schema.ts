import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { EmailSchema } from "#src/common/validation";

export const ForgotPasswordFormSchema = Type.Object({
  email: EmailSchema,
});

export type ForgotPasswordFormValues = Static<typeof ForgotPasswordFormSchema>;
